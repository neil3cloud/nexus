import type { EventBusContract, EventSubscription, EventSubscriptionHandle } from '../common/event-bus-contract';
import { ServiceLifecycle } from '../common/service-lifecycle';
import type { EventBusEvent } from '../common/event-bus-contract';
import type { IGovernanceDecisionRepository } from '../governance/governance-decision.repository';
import { InMemoryGovernanceDecisionRepository } from '../governance/governance-decision.repository';
import { MissionId } from '../mission/mission-id';
import { MissionPlan } from '../mission/mission-plan.aggregate';
import { MissionPlanId } from '../mission/mission-plan-id';
import type { IMissionPlanRepository, IMissionRepository } from '../mission/mission.repository';
import { InMemoryMissionRepository } from '../mission/mission.repository';
import { MissionPlanningService } from '../mission/mission-planning.service';
import type { MissionPlanSnapshot, PlanningMetadata } from '../mission/mission-planning.types';
import type { ReviewServiceContract } from '../review/review.contract';
import { ReviewService } from '../review/review.service';
import type { ReviewPlanRevisionReference } from '../review/review.types';
import type { IPlanningCorrelationRepository } from './planning-correlation.repository';
import { InMemoryPlanningCorrelationRepository } from './planning-correlation.repository';
import { PlanningCorrelationAssociationRejectedError } from './planning.errors';
import type {
  PlanningCorrelationSnapshot,
  ProposedMissionPlanSnapshot,
  ProposedPlanRevisionSnapshot,
  ProposedTaskDependencySnapshot,
  ProposedTaskSnapshot,
} from './planning.types';
import { ProposedMissionPlan } from './proposed-mission-plan';
import { ProposedMissionPlanId, normalizeNonEmptyString } from './proposed-mission-plan-id';
import type { IProposedMissionPlanRepository } from './proposed-mission-plan.repository';
import { InMemoryProposedMissionPlanRepository } from './proposed-mission-plan.repository';
import { ProposedPlanRevision } from './proposed-plan-revision';
import { ProposedPlanRevisionId } from './proposed-plan-revision-id';

type MissionPlanningRepository = IMissionPlanRepository & Pick<IMissionRepository, 'getById'>;

export interface ActivateProposedPlanCommand {
  readonly proposedMissionPlanId: string;
  readonly proposedPlanRevisionId: string;
  readonly missionPlanId?: string;
  readonly activatedAt?: string;
}

export interface ActivateProposedPlanResult {
  readonly proposedMissionPlan: ProposedMissionPlanSnapshot;
  readonly planningCorrelation: PlanningCorrelationSnapshot;
  readonly missionPlan: MissionPlanSnapshot;
}

export class PlanningActivationService extends ServiceLifecycle {
  private operationQueue: Promise<unknown> = Promise.resolve();

  public constructor(
    private readonly proposedMissionPlanRepository: IProposedMissionPlanRepository =
      new InMemoryProposedMissionPlanRepository(),
    private readonly planningCorrelationRepository: IPlanningCorrelationRepository =
      new InMemoryPlanningCorrelationRepository(),
    private readonly reviewService: Pick<ReviewServiceContract, 'queryReviewResult'> = new ReviewService(),
    private readonly governanceDecisionRepository: IGovernanceDecisionRepository =
      new InMemoryGovernanceDecisionRepository(),
    private readonly missionRepository: MissionPlanningRepository = new InMemoryMissionRepository(),
    private readonly eventBus?: EventBusContract,
  ) {
    super('PlanningActivationService');
  }

  public async activate(command: ActivateProposedPlanCommand): Promise<ActivateProposedPlanResult> {
    return this.runExclusive(() => this.activateExclusive(command));
  }

  private async activateExclusive(
    command: ActivateProposedPlanCommand,
  ): Promise<ActivateProposedPlanResult> {
    const proposedMissionPlanId = ProposedMissionPlanId.fromString(
      command.proposedMissionPlanId,
    ).toString();
    const proposedPlanRevisionId = ProposedPlanRevisionId.fromString(
      command.proposedPlanRevisionId,
    ).toString();
    const proposedMissionPlan = await this.requireProposedMissionPlan(proposedMissionPlanId);
    const proposedMissionPlanSnapshot = proposedMissionPlan.toSnapshot();
    const existingActivatedRevision = proposedMissionPlanSnapshot.revisions.find(
      (revision) => revision.lifecycleState === 'Activated',
    );

    if (existingActivatedRevision !== undefined) {
      if (existingActivatedRevision.id === proposedPlanRevisionId) {
        return this.resolveIdempotentActivation(
          proposedMissionPlanSnapshot,
          proposedPlanRevisionId,
        );
      }

      throw new PlanningCorrelationAssociationRejectedError(
        `ProposedMissionPlan '${proposedMissionPlanId}' already has Activated ProposedPlanRevision '${existingActivatedRevision.id}'.`,
      );
    }

    const targetRevision = this.requireGovernedRevision(
      proposedMissionPlanSnapshot,
      proposedPlanRevisionId,
    );
    ProposedPlanRevision.fromSnapshot(targetRevision).assertStructurallyValid();
    const planningCorrelation = await this.requirePlanningCorrelation(
      proposedMissionPlanSnapshot,
      proposedPlanRevisionId,
    );
    const reviewId = this.requireCorrelationReference(planningCorrelation.reviewId, 'Review');
    const governanceDecisionId = this.requireCorrelationReference(
      planningCorrelation.governanceDecisionId,
      'GovernanceDecision',
    );
    const review = (await this.reviewService.queryReviewResult({ reviewId })).review;
    const governanceDecision = await this.governanceDecisionRepository.getById(governanceDecisionId);

    if (governanceDecision === undefined) {
      throw new PlanningCorrelationAssociationRejectedError(
        `GovernanceDecision '${governanceDecisionId}' could not be resolved for Activation.`,
      );
    }

    if (governanceDecision.toSnapshot().value !== 'Approved') {
      throw new PlanningCorrelationAssociationRejectedError(
        `GovernanceDecision '${governanceDecisionId}' must be Approved before Activation.`,
      );
    }

    this.assertReviewReferenceMatches(
      review.missionPlanRevision,
      planningCorrelation.proposedPlanRevisionId,
      review.id,
    );

    const traceability = activationTraceability({
      proposedMissionPlanId,
      proposedPlanRevisionId,
      reviewPlanRevisionReference: review.missionPlanRevision,
      reviewId,
      governanceDecisionId,
      planningCorrelationId: planningCorrelation.id,
    });
    const missionPlanId = normalizeNonEmptyString(
      command.missionPlanId ?? `mission-plan-${proposedPlanRevisionId}`,
      'MissionPlan id',
    );
    const stagingRepository = new StagedMissionPlanningRepository(this.missionRepository);
    const bufferingEventBus = new BufferingEventBus(this.requireEventBus());
    const missionPlanningService = new MissionPlanningService(
      stagingRepository,
      bufferingEventBus,
      () => missionPlanId,
      () => command.activatedAt ?? new Date().toISOString(),
    );

    await missionPlanningService.createMissionPlan({
      id: missionPlanId,
      missionId: proposedMissionPlanSnapshot.missionId,
      metadata: traceability,
      revisionReason: 'Activate Proposed Plan Revision.',
      revisionMetadata: traceability,
    });

    for (const task of orderTasksForActivation(
      targetRevision.proposedTasks,
      targetRevision.proposedTaskDependencies,
    )) {
      await missionPlanningService.addTask({
        missionPlanId,
        taskId: task.id,
        title: task.title,
        description: task.description,
        dependencies: dependenciesForTask(task.id, targetRevision.proposedTaskDependencies),
        metadata: traceability,
        revisionReason: 'Activate Proposed Task.',
        revisionMetadata: traceability,
      });
    }

    const activatedProposedMissionPlan = proposedMissionPlan.activateRevision(proposedPlanRevisionId);
    const missionPlan = await stagingRepository.commit();
    const savedProposedMissionPlan = await this.proposedMissionPlanRepository.save(
      activatedProposedMissionPlan,
    );
    await bufferingEventBus.flush();

    return Object.freeze({
      proposedMissionPlan: savedProposedMissionPlan.toSnapshot(),
      planningCorrelation,
      missionPlan: missionPlan.toSnapshot(),
    });
  }

  private async resolveIdempotentActivation(
    proposedMissionPlan: ProposedMissionPlanSnapshot,
    proposedPlanRevisionId: string,
  ): Promise<ActivateProposedPlanResult> {
    const missionPlan = (await this.missionRepository.getMissionPlansByMissionId(
      MissionId.fromString(proposedMissionPlan.missionId),
    )).find(
      (candidate) =>
        candidate.metadata.proposedMissionPlanId === proposedMissionPlan.id &&
        candidate.metadata.proposedPlanRevisionId === proposedPlanRevisionId,
    );

    if (missionPlan === undefined) {
      throw new PlanningCorrelationAssociationRejectedError(
        `Activated ProposedPlanRevision '${proposedPlanRevisionId}' has no traceable executable MissionPlan.`,
      );
    }

    const planningCorrelation = await this.requirePlanningCorrelation(
      proposedMissionPlan,
      proposedPlanRevisionId,
    );

    return Object.freeze({
      proposedMissionPlan,
      planningCorrelation,
      missionPlan: missionPlan.toSnapshot(),
    });
  }

  private async requireProposedMissionPlan(
    proposedMissionPlanId: string,
  ): Promise<ProposedMissionPlan> {
    const proposedMissionPlan = await this.proposedMissionPlanRepository.getById(proposedMissionPlanId);

    if (proposedMissionPlan === undefined) {
      throw new PlanningCorrelationAssociationRejectedError(
        `ProposedMissionPlan '${proposedMissionPlanId}' was not found for Activation.`,
      );
    }

    return proposedMissionPlan;
  }

  private requireGovernedRevision(
    proposedMissionPlan: ProposedMissionPlanSnapshot,
    proposedPlanRevisionId: string,
  ): ProposedPlanRevisionSnapshot {
    const revision = proposedMissionPlan.revisions.find(
      (candidate) => candidate.id === proposedPlanRevisionId,
    );

    if (revision === undefined) {
      throw new PlanningCorrelationAssociationRejectedError(
        `ProposedPlanRevision '${proposedPlanRevisionId}' was not found for Activation.`,
      );
    }

    if (revision.lifecycleState !== 'Governed') {
      throw new PlanningCorrelationAssociationRejectedError(
        `ProposedPlanRevision '${proposedPlanRevisionId}' must be Governed before Activation; current state is '${revision.lifecycleState}'.`,
      );
    }

    return revision;
  }

  private async requirePlanningCorrelation(
    proposedMissionPlan: ProposedMissionPlanSnapshot,
    proposedPlanRevisionId: string,
  ): Promise<PlanningCorrelationSnapshot> {
    const planningCorrelation =
      await this.planningCorrelationRepository.findByProposedPlanRevision({
        missionId: proposedMissionPlan.missionId,
        proposedMissionPlanId: proposedMissionPlan.id,
        proposedPlanRevisionId,
      });

    if (planningCorrelation === undefined) {
      throw new PlanningCorrelationAssociationRejectedError(
        `PlanningCorrelation for ProposedPlanRevision '${proposedPlanRevisionId}' was not found for Activation.`,
      );
    }

    return planningCorrelation.toSnapshot();
  }

  private requireCorrelationReference(reference: string | undefined, label: string): string {
    if (reference === undefined) {
      throw new PlanningCorrelationAssociationRejectedError(
        `PlanningCorrelation is missing ${label} reference for Activation.`,
      );
    }

    return reference;
  }

  private assertReviewReferenceMatches(
    reference: ReviewPlanRevisionReference,
    proposedPlanRevisionId: string,
    reviewId: string,
  ): void {
    if (reference.kind !== 'ProposedPlanRevision' || reference.revisionId !== proposedPlanRevisionId) {
      throw new PlanningCorrelationAssociationRejectedError(
        `Review '${reviewId}' ReviewPlanRevisionReference does not match ProposedPlanRevision '${proposedPlanRevisionId}'.`,
      );
    }
  }

  private requireEventBus(): EventBusContract {
    if (this.eventBus === undefined) {
      throw new PlanningCorrelationAssociationRejectedError(
        'Activation requires an EventBusContract for deferred MissionPlanningService event publication.',
      );
    }

    return this.eventBus;
  }

  private async runExclusive<T>(operation: () => Promise<T>): Promise<T> {
    const run = this.operationQueue.then(operation, operation);
    this.operationQueue = run.then(
      () => undefined,
      () => undefined,
    );

    return run;
  }
}

class StagedMissionPlanningRepository implements MissionPlanningRepository {
  private readonly stagedMissionPlans = new Map<string, MissionPlanSnapshot>();

  public constructor(private readonly repository: MissionPlanningRepository) {}

  public getById(missionId: MissionId): Promise<ReturnType<MissionPlanningRepository['getById']> extends Promise<infer T> ? T : never> {
    return this.repository.getById(missionId);
  }

  public async saveMissionPlan(missionPlan: MissionPlan): Promise<void> {
    this.stagedMissionPlans.set(missionPlan.id.toString(), missionPlan.toSnapshot());
  }

  public async getMissionPlanById(missionPlanId: MissionPlanId): Promise<MissionPlan | undefined> {
    const staged = this.stagedMissionPlans.get(missionPlanId.toString());

    if (staged !== undefined) {
      return MissionPlan.fromSnapshot(staged);
    }

    return this.repository.getMissionPlanById(missionPlanId);
  }

  public async missionPlanExists(missionPlanId: MissionPlanId): Promise<boolean> {
    return (
      this.stagedMissionPlans.has(missionPlanId.toString()) ||
      (await this.repository.missionPlanExists(missionPlanId))
    );
  }

  public async getMissionPlansByMissionId(missionId: MissionId): Promise<readonly MissionPlan[]> {
    const baseMissionPlans = await this.repository.getMissionPlansByMissionId(missionId);
    const stagedMissionPlans = [...this.stagedMissionPlans.values()]
      .filter((snapshot) => snapshot.missionId === missionId.toString())
      .map((snapshot) => MissionPlan.fromSnapshot(snapshot));

    return Object.freeze([...baseMissionPlans, ...stagedMissionPlans]);
  }

  public async commit(): Promise<MissionPlan> {
    if (this.stagedMissionPlans.size !== 1) {
      throw new PlanningCorrelationAssociationRejectedError(
        'Activation must stage exactly one executable MissionPlan.',
      );
    }

    const snapshot = [...this.stagedMissionPlans.values()][0];

    if (snapshot === undefined) {
      throw new PlanningCorrelationAssociationRejectedError(
        'Activation staged no executable MissionPlan.',
      );
    }

    const missionPlan = MissionPlan.fromSnapshot(snapshot);
    await this.repository.saveMissionPlan(missionPlan);
    this.stagedMissionPlans.clear();

    return missionPlan;
  }
}

class BufferingEventBus implements EventBusContract {
  private readonly events: EventBusEvent[] = [];

  public constructor(private readonly eventBus: EventBusContract) {}

  public async publish(event: EventBusEvent): Promise<void> {
    this.events.push(event);
  }

  public subscribe(subscription: EventSubscription): EventSubscriptionHandle {
    return this.eventBus.subscribe(subscription);
  }

  public replay(missionId: string): readonly EventBusEvent[] {
    return this.eventBus.replay(missionId);
  }

  public async flush(): Promise<void> {
    for (const event of this.events) {
      await this.eventBus.publish(event);
    }

    this.events.length = 0;
  }
}

function activationTraceability(input: {
  readonly proposedMissionPlanId: string;
  readonly proposedPlanRevisionId: string;
  readonly reviewPlanRevisionReference: ReviewPlanRevisionReference;
  readonly reviewId: string;
  readonly governanceDecisionId: string;
  readonly planningCorrelationId: string;
}): PlanningMetadata {
  return Object.freeze({
    proposedMissionPlanId: input.proposedMissionPlanId,
    proposedPlanRevisionId: input.proposedPlanRevisionId,
    reviewPlanRevisionKind: input.reviewPlanRevisionReference.kind,
    reviewPlanRevisionId: input.reviewPlanRevisionReference.revisionId,
    reviewId: input.reviewId,
    governanceDecisionId: input.governanceDecisionId,
    planningCorrelationId: input.planningCorrelationId,
  });
}

function dependenciesForTask(
  proposedTaskId: string,
  dependencies: readonly ProposedTaskDependencySnapshot[],
): readonly string[] {
  return dependencies
    .filter((dependency) => dependency.targetProposedTaskId === proposedTaskId)
    .map((dependency) => dependency.prerequisiteProposedTaskId);
}

function orderTasksForActivation(
  tasks: readonly ProposedTaskSnapshot[],
  dependencies: readonly ProposedTaskDependencySnapshot[],
): readonly ProposedTaskSnapshot[] {
  const tasksById = new Map(tasks.map((task) => [task.id, task]));
  const ordered: ProposedTaskSnapshot[] = [];
  const visited = new Set<string>();

  for (const task of tasks) {
    visitTask(task.id, tasksById, dependencies, visited, ordered);
  }

  return Object.freeze(ordered);
}

function visitTask(
  taskId: string,
  tasksById: ReadonlyMap<string, ProposedTaskSnapshot>,
  dependencies: readonly ProposedTaskDependencySnapshot[],
  visited: Set<string>,
  ordered: ProposedTaskSnapshot[],
): void {
  if (visited.has(taskId)) {
    return;
  }

  visited.add(taskId);

  for (const dependency of dependencies.filter((item) => item.targetProposedTaskId === taskId)) {
    visitTask(dependency.prerequisiteProposedTaskId, tasksById, dependencies, visited, ordered);
  }

  const task = tasksById.get(taskId);

  if (task !== undefined) {
    ordered.push(task);
  }
}
