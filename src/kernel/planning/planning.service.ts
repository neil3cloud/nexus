import { ServiceLifecycle } from '../common/service-lifecycle';
import { PlannerAttribution } from './planner-attribution';
import { PlanningPolicy } from './planning-policy';
import {
  DuplicateProposedMissionPlanError,
  InvalidPlanningDefinitionError,
  ProposedMissionPlanNotFoundError,
} from './planning.errors';
import type {
  AppendProposedPlanRevisionInput,
  PlanningPolicyInput,
  PlanningPolicySnapshot,
  ProposedMissionPlanInput,
  ProposedMissionPlanSnapshot,
  ProposedPlanRevisionSnapshot,
  TransitionProposedPlanRevisionInput,
} from './planning.types';
import { ProposedMissionPlan } from './proposed-mission-plan';
import { ProposedMissionPlanId, normalizeNonEmptyString } from './proposed-mission-plan-id';
import { ProposedPlanRevision } from './proposed-plan-revision';
import {
  InMemoryProposedMissionPlanRepository,
  type IProposedMissionPlanRepository,
} from './proposed-mission-plan.repository';

export interface CreateProposedPlanRevisionCommand extends AppendProposedPlanRevisionInput {
  readonly proposedMissionPlanId: string;
}

export interface SubmitProposedPlanRevisionCommand extends TransitionProposedPlanRevisionInput {
  readonly proposedMissionPlanId: string;
  readonly planningPolicy: PlanningPolicyInput | PlanningPolicySnapshot;
}

export interface WithdrawProposedPlanRevisionCommand extends TransitionProposedPlanRevisionInput {
  readonly proposedMissionPlanId: string;
}

export class PlanningService extends ServiceLifecycle {
  public constructor(
    private readonly repository: IProposedMissionPlanRepository =
      new InMemoryProposedMissionPlanRepository(),
  ) {
    super('PlanningService');
  }

  public async createProposedMissionPlan(
    input: ProposedMissionPlanInput,
  ): Promise<ProposedMissionPlanSnapshot> {
    const proposedMissionPlan = ProposedMissionPlan.create(input);
    const existingProposedMissionPlan = await this.repository.getById(proposedMissionPlan.id);

    if (existingProposedMissionPlan !== undefined) {
      if (sameSnapshot(existingProposedMissionPlan.toSnapshot(), proposedMissionPlan.toSnapshot())) {
        return existingProposedMissionPlan.toSnapshot();
      }

      throw new DuplicateProposedMissionPlanError(proposedMissionPlan.id.toString());
    }

    return (await this.repository.create(proposedMissionPlan)).toSnapshot();
  }

  public async createProposedPlanRevision(
    command: CreateProposedPlanRevisionCommand,
  ): Promise<ProposedMissionPlanSnapshot> {
    const proposedMissionPlan = await this.requireProposedMissionPlan(command.proposedMissionPlanId);
    const snapshot = proposedMissionPlan.toSnapshot();
    const currentRevision = proposedMissionPlan.currentRevision;
    const currentRevisionSnapshot = currentRevision.toSnapshot();

    if (currentRevisionSnapshot.id === command.id) {
      const expectedRevision = ProposedPlanRevision.create({
        ...command,
        proposedMissionPlanId: proposedMissionPlan.id.toString(),
        revisionNumber: currentRevision.revisionNumber,
        lifecycleState: 'Draft',
      });

      if (sameSnapshot(currentRevisionSnapshot, expectedRevision.toSnapshot())) {
        return snapshot;
      }

      throw new InvalidPlanningDefinitionError(
        `ProposedPlanRevision '${command.id}' already exists with different content.`,
      );
    }

    this.assertRevisionIdUnused(snapshot, command.id);

    const updatedProposedMissionPlan = proposedMissionPlan.appendRevision(command);

    return (await this.repository.save(updatedProposedMissionPlan)).toSnapshot();
  }

  public async submitCurrentRevision(
    command: SubmitProposedPlanRevisionCommand,
  ): Promise<ProposedMissionPlanSnapshot> {
    const proposedMissionPlan = await this.requireProposedMissionPlan(command.proposedMissionPlanId);
    const currentRevisionSnapshot = proposedMissionPlan.currentRevision.toSnapshot();

    if (
      currentRevisionSnapshot.lifecycleState === 'Submitted' &&
      currentRevisionSnapshot.id === command.id
    ) {
      this.assertIdempotentTransition(currentRevisionSnapshot, command);

      return proposedMissionPlan.toSnapshot();
    }

    this.assertRevisionIdUnused(proposedMissionPlan.toSnapshot(), command.id);

    const updatedProposedMissionPlan = proposedMissionPlan.submitCurrentRevision(
      command,
      PlanningPolicy.create(command.planningPolicy),
    );

    return (await this.repository.save(updatedProposedMissionPlan)).toSnapshot();
  }

  public async withdrawCurrentRevision(
    command: WithdrawProposedPlanRevisionCommand,
  ): Promise<ProposedMissionPlanSnapshot> {
    const proposedMissionPlan = await this.requireProposedMissionPlan(command.proposedMissionPlanId);
    const currentRevisionSnapshot = proposedMissionPlan.currentRevision.toSnapshot();

    if (
      currentRevisionSnapshot.lifecycleState === 'Withdrawn' &&
      currentRevisionSnapshot.id === command.id
    ) {
      this.assertIdempotentTransition(currentRevisionSnapshot, command);

      return proposedMissionPlan.toSnapshot();
    }

    this.assertRevisionIdUnused(proposedMissionPlan.toSnapshot(), command.id);

    const updatedProposedMissionPlan = proposedMissionPlan.withdrawCurrentRevision(command);

    return (await this.repository.save(updatedProposedMissionPlan)).toSnapshot();
  }

  private async requireProposedMissionPlan(
    proposedMissionPlanId: string,
  ): Promise<ProposedMissionPlan> {
    const normalizedProposedMissionPlanId =
      ProposedMissionPlanId.fromString(proposedMissionPlanId).toString();
    const proposedMissionPlan = await this.repository.getById(normalizedProposedMissionPlanId);

    if (proposedMissionPlan === undefined) {
      throw new ProposedMissionPlanNotFoundError(normalizedProposedMissionPlanId);
    }

    return proposedMissionPlan;
  }

  private assertRevisionIdUnused(
    snapshot: ProposedMissionPlanSnapshot,
    proposedPlanRevisionId: string,
  ): void {
    const normalizedProposedPlanRevisionId = normalizeNonEmptyString(
      proposedPlanRevisionId,
      'ProposedPlanRevision id',
    );

    if (snapshot.revisions.some((revision) => revision.id === normalizedProposedPlanRevisionId)) {
      throw new InvalidPlanningDefinitionError(
        `ProposedPlanRevision '${normalizedProposedPlanRevisionId}' already exists.`,
      );
    }
  }

  private assertIdempotentTransition(
    currentRevisionSnapshot: ProposedPlanRevisionSnapshot,
    command: TransitionProposedPlanRevisionInput,
  ): void {
    const expectedAttribution = PlannerAttribution.create(command.plannerAttribution).toSnapshot();
    const expectedCausality = (command.causality ?? []).map((value) =>
      normalizeNonEmptyString(value, 'ProposedPlanRevision causality'),
    );
    const expectedCorrelationId =
      command.correlationId === undefined
        ? undefined
        : normalizeNonEmptyString(command.correlationId, 'ProposedPlanRevision correlationId');

    if (
      !sameSnapshot(currentRevisionSnapshot.plannerAttribution, expectedAttribution) ||
      currentRevisionSnapshot.createdAt !==
        normalizeNonEmptyString(command.createdAt, 'ProposedPlanRevision createdAt') ||
      !sameSnapshot(currentRevisionSnapshot.causality, expectedCausality) ||
      currentRevisionSnapshot.correlationId !== expectedCorrelationId
    ) {
      throw new InvalidPlanningDefinitionError(
        `ProposedPlanRevision '${command.id}' already exists with different transition metadata.`,
      );
    }
  }
}

function sameSnapshot(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}
