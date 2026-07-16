import { execFileSync } from 'node:child_process';

import { describe, expect, it } from 'vitest';

import type {
  EventBusContract,
  EventBusEvent,
  EventSubscription,
  EventSubscriptionHandle,
} from '../../src/kernel/common/event-bus-contract';
import { GovernanceGatedWorkflowAdvancementConsumer } from '../../src/kernel/execution/governance-gated-workflow-advancement.consumer';
import { InMemoryEngineeringSessionCheckpointRepository } from '../../src/kernel/execution/engineering-session-checkpoint.repository';
import { InMemoryEngineeringSessionRepository } from '../../src/kernel/execution/engineering-session.repository';
import { EngineeringSessionService } from '../../src/kernel/execution/engineering-session.service';
import { RecoveryRequirementGovernanceDecisionConsumer } from '../../src/kernel/execution/recovery-requirement-governance-decision.consumer';
import { InMemoryRecoveryRequirementRepository } from '../../src/kernel/execution/recovery-requirement.repository';
import { RecoveryRequirementService } from '../../src/kernel/execution/recovery-requirement.service';
import { InMemoryWorkflowChainRepository } from '../../src/kernel/execution/workflow-chain.repository';
import { WorkflowChainService } from '../../src/kernel/execution/workflow-chain.service';
import { GovernanceDecision } from '../../src/kernel/governance/governance-decision';
import {
  InMemoryGovernanceDecisionRepository,
  type IGovernanceDecisionRepository,
} from '../../src/kernel/governance/governance-decision.repository';
import { GovernanceService } from '../../src/kernel/governance/governance.service';
import type { GovernanceDecisionSnapshot } from '../../src/kernel/governance/governance.types';
import { RatificationAuthoritySnapshot } from '../../src/kernel/governance/ratification-authority-snapshot';
import { InMemoryRatificationAuthoritySnapshotRepository } from '../../src/kernel/governance/ratification-authority.repository';
import { RatificationAttributionValidationService } from '../../src/kernel/governance/ratification-attribution-validation';
import type { RatificationAuthorityRecordInput } from '../../src/kernel/governance/ratification-attribution.types';
import { InMemoryRepositoryPolicyRepository } from '../../src/kernel/governance/repository-policy.repository';
import { RepositoryPolicyService } from '../../src/kernel/governance/repository-policy.service';
import type { PolicyCriterionInput } from '../../src/kernel/governance/repository-policy.types';
import { MissionCompletionRejectedError } from '../../src/kernel/mission/mission.errors';
import { MissionExecutionService } from '../../src/kernel/mission/mission-execution.service';
import { MissionPlanningService } from '../../src/kernel/mission/mission-planning.service';
import { InMemoryMissionRepository } from '../../src/kernel/mission/mission.repository';
import { MissionService } from '../../src/kernel/mission/mission.service';
import { InMemoryReviewRepository } from '../../src/kernel/review/review.repository';
import { ReviewService } from '../../src/kernel/review/review.service';
import type { ReviewOutcomeValue } from '../../src/kernel/review/review.types';

const missionId = 'mission-sprint-62';
const otherMissionId = 'mission-sprint-62-other';
const missionPlanId = 'mission-plan-sprint-62';
const taskId = 'task-sprint-62';
const workflowChainId = 'workflow-chain-sprint-62';
const engineeringSessionId = 'engineering-session-sprint-62';
const currentWorkflowStepId = '0';
const repositoryPolicyId = 'repository-policy-sprint-62';
const repositoryPolicyVersion = 1;
const ratificationId = 'NEXUS-RAT-2026-07-16-014';
const timestamp = '2026-07-16T09:00:00.000Z';

describe('Sprint 62 governance automation integration validation', () => {
  it('approves governance, advances the Workflow, and permits Mission completion', async () => {
    const harness = await createGovernedHarness();
    const review = await harness.createCompletedReview('Accepted');
    await harness.registerPolicy([reviewOutcomeCriterion('review-accepted', ['Accepted'])]);

    const decision = await harness.evaluateGovernance(review.review.id);
    const advanced = await harness.workflowAdvancementConsumer.handleGovernanceDecisionRecorded({
      event: harness.requireGovernanceDecisionRecordedEvent(decision.id),
      engineeringSessionId,
      currentWorkflowStepId,
    });

    expect(decision.value).toBe('Approved');
    expect(advanced.currentWorkflowStepId).toBe('1');
    await expect(harness.missionExecutionService.completeMission({ missionId })).resolves.toMatchObject({
      status: 'Completed',
    });
  });

  it('keeps a Rejected governance decision blocking Workflow advancement and Mission completion', async () => {
    const harness = await createGovernedHarness();
    const review = await harness.createCompletedReview('Accepted');
    await harness.registerPolicy([reviewOutcomeCriterion('review-rejected', ['Rejected'])]);

    const decision = await harness.evaluateGovernance(review.review.id);

    expect(decision.value).toBe('Rejected');
    await expect(harness.advanceAfterDecision(decision)).rejects.toThrow(
      'EngineeringSession Governance-Gated Advancement requires a Non-Blocking Governance Decision.',
    );
    await expect(harness.missionExecutionService.completeMission({ missionId })).rejects.toThrow(
      MissionCompletionRejectedError,
    );
  });

  it('creates exactly one Recovery Requirement for a Rejected GovernanceDecision', async () => {
    const harness = await createGovernedHarness();
    const review = await harness.createCompletedReview('Accepted');
    await harness.registerPolicy([reviewOutcomeCriterion('review-rejected', ['Rejected'])]);

    const decision = await harness.evaluateGovernance(review.review.id);
    const requirements = await harness.recoveryRequirementRepository.enumerate();

    expect(decision.value).toBe('Rejected');
    expect(requirements).toHaveLength(1);
    expect(requirements[0]?.toSnapshot()).toMatchObject({
      missionId,
      engineeringSessionId,
      workflowStepId: currentWorkflowStepId,
      governanceDecisionId: decision.id,
      status: 'Open',
    });
    expect(harness.eventsOfType('RecoveryRequirementCreated')).toHaveLength(1);
  });

  it('keeps an Open Recovery Requirement blocking re-advancement', async () => {
    const harness = await createGovernedHarness();
    const review = await harness.createCompletedReview('Accepted');
    await harness.registerPolicy([reviewOutcomeCriterion('review-rejected', ['Rejected'])]);

    const decision = await harness.evaluateGovernance(review.review.id);

    await expect(harness.advanceAfterDecision(decision)).rejects.toThrow(
      'EngineeringSession Governance-Gated Advancement requires a Non-Blocking Governance Decision.',
    );
    await expect(harness.engineeringSessionService.getEngineeringSession(engineeringSessionId)).resolves.toMatchObject({
      currentWorkflowStepId,
    });
  });

  it('restores Workflow advancement eligibility after exact Recovery Requirement resolution', async () => {
    const harness = await createGovernedHarness();
    const review = await harness.createCompletedReview('Accepted');
    await harness.registerPolicy([reviewOutcomeCriterion('review-rejected', ['Rejected'])]);

    const decision = await harness.evaluateGovernance(review.review.id);
    const recoveryRequirement = await harness.requireSingleRecoveryRequirement();
    await harness.recoveryRequirementService.resolveRecoveryRequirement({
      recoveryRequirementId: recoveryRequirement.id,
      acceptedOutcomeReference: 'review-outcome:accepted-remediation',
      resolvedAt: '2026-07-16T10:00:00.000Z',
      attribution: 'builder:sprint-62',
    });
    const advanced = await harness.advanceAfterDecision(decision);

    expect(advanced.currentWorkflowStepId).toBe('1');
    expect(harness.eventsOfType('RecoveryRequirementResolved')).toHaveLength(1);
  });

  it('does not let a Resolved Recovery Requirement override Governance-Gated Mission Completion', async () => {
    const harness = await createGovernedHarness();
    const review = await harness.createCompletedReview('Accepted');
    await harness.registerPolicy([reviewOutcomeCriterion('review-rejected', ['Rejected'])]);

    await harness.evaluateGovernance(review.review.id);
    const recoveryRequirement = await harness.requireSingleRecoveryRequirement();
    await harness.recoveryRequirementService.resolveRecoveryRequirement({
      recoveryRequirementId: recoveryRequirement.id,
      acceptedOutcomeReference: 'review-outcome:accepted-remediation',
      resolvedAt: '2026-07-16T10:00:00.000Z',
      attribution: 'builder:sprint-62',
    });

    await expect(harness.missionExecutionService.completeMission({ missionId })).rejects.toThrow(
      MissionCompletionRejectedError,
    );
  });

  it('keeps Deferred governance blocking Workflow advancement and Mission completion', async () => {
    const harness = await createGovernedHarness();
    const review = await harness.createInProgressReview();
    await harness.registerPolicy([reviewOutcomeCriterion('review-accepted', ['Accepted'])]);

    const decision = await harness.evaluateGovernance(review.id);

    expect(decision.value).toBe('Deferred');
    expect(await harness.recoveryRequirementRepository.enumerate()).toHaveLength(0);
    await expect(harness.advanceAfterDecision(decision)).rejects.toThrow(
      'EngineeringSession Governance-Gated Advancement requires a completed Review',
    );
    await expect(harness.missionExecutionService.completeMission({ missionId })).rejects.toThrow(
      MissionCompletionRejectedError,
    );
  });

  it('keeps Escalation Required governance blocking Workflow advancement and Mission completion', async () => {
    const harness = await createGovernedHarness({
      authorityRecords: [
        ratificationRecord({
          lifecycleStatus: 'Superseded',
          supersededByRatificationId: 'NEXUS-RAT-2026-07-16-999',
        }),
      ],
    });
    const review = await harness.createCompletedReview('Accepted');
    await harness.registerPolicy([reviewOutcomeCriterion('review-accepted', ['Accepted'])]);

    const decision = await harness.evaluateGovernance(review.review.id);

    expect(decision.value).toBe('Escalation Required');
    await expect(harness.advanceAfterDecision(decision)).rejects.toThrow(
      'EngineeringSession Governance-Gated Advancement requires a Non-Blocking Governance Decision.',
    );
    await expect(harness.missionExecutionService.completeMission({ missionId })).rejects.toThrow(
      MissionCompletionRejectedError,
    );
  });

  it('fails closed when the Review is missing', async () => {
    const harness = await createGovernedHarness();
    await harness.registerPolicy([reviewOutcomeCriterion('review-accepted', ['Accepted'])]);

    const decision = await harness.evaluateGovernance('missing-review', {
      reviewStateReference: 'missing-review-state',
    });

    expect(decision).toMatchObject({
      value: 'Escalation Required',
      missionId,
      escalation: {
        reasonCode: 'MissingReview',
      },
    });
    await expect(harness.advanceAfterDecision(decision)).rejects.toThrow(
      'EngineeringSession Governance-Gated Advancement requires a completed Review',
    );
    await expect(harness.missionExecutionService.completeMission({ missionId })).rejects.toThrow(
      MissionCompletionRejectedError,
    );
  });

  it.each([
    [
      'Invalid',
      [
        ratificationRecord({
          lifecycleStatus: 'Withdrawn',
          withdrawnByRatificationId: 'NEXUS-RAT-2026-07-16-998',
        }),
      ],
    ],
    ['Unresolvable', [ratificationRecord({ identifier: 'NEXUS-RAT-2026-07-16-998' })]],
  ] as const)(
    'classifies %s ratification attribution as Escalation Required',
    async (_outcome, authorityRecords) => {
      const harness = await createGovernedHarness({ authorityRecords });
      const review = await harness.createCompletedReview('Accepted');
      await harness.registerPolicy([reviewOutcomeCriterion('review-accepted', ['Accepted'])]);

      const decision = await harness.evaluateGovernance(review.review.id);

      expect(decision).toMatchObject({
        value: 'Escalation Required',
        escalation: {
          ratificationId,
        },
      });
    },
  );

  it('fails closed on cross-Mission attribution mismatch', async () => {
    const harness = await createGovernedHarness();
    const review = await harness.createCompletedReview('Accepted', otherMissionId);
    await harness.registerPolicy([reviewOutcomeCriterion('review-accepted', ['Accepted'])]);

    const decision = await harness.evaluateGovernance(review.review.id);

    expect(decision).toMatchObject({
      value: 'Escalation Required',
      missionId,
      escalation: {
        reasonCode: 'ReviewMissionMismatch',
      },
    });
    expect(harness.requireGovernanceDecisionRecordedEvent(decision.id)).toMatchObject({
      missionId,
      attribution: {
        missionId,
      },
    });
  });

  it('keeps repeated evaluation idempotent without duplicate decisions, requirements, or events', async () => {
    const harness = await createGovernedHarness();
    const review = await harness.createCompletedReview('Accepted');
    await harness.registerPolicy([reviewOutcomeCriterion('review-rejected', ['Rejected'])]);

    const firstDecision = await harness.evaluateGovernance(review.review.id);
    const secondDecision = await harness.evaluateGovernance(review.review.id);

    expect(secondDecision).toEqual(firstDecision);
    expect(await harness.governanceDecisionRepository.enumerate()).toHaveLength(1);
    expect(await harness.recoveryRequirementRepository.enumerate()).toHaveLength(1);
    expect(harness.eventsOfType('GovernanceDecisionRecorded')).toHaveLength(1);
    expect(harness.eventsOfType('RecoveryRequirementCreated')).toHaveLength(1);
  });

  it('publishes no Domain Event when GovernanceDecision persistence fails', async () => {
    const harness = await createGovernedHarness({
      governanceDecisionRepository: new FailingGovernanceDecisionRepository(),
    });
    const review = await harness.createCompletedReview('Accepted');
    await harness.registerPolicy([reviewOutcomeCriterion('review-accepted', ['Accepted'])]);

    await expect(harness.evaluateGovernance(review.review.id)).rejects.toThrow(
      'GovernanceDecision persistence failed.',
    );
    expect(harness.eventsOfType('GovernanceDecisionRecorded')).toHaveLength(0);
    expect(harness.eventsOfType('RecoveryRequirementCreated')).toHaveLength(0);
  });

  it('leaves existing production contracts and Host/Adapter boundaries unmodified outside authorized current-sprint paths', () => {
    const authorizedProductionPaths = new Set([
      'src/kernel/common/create-kernel-services.ts',
      'src/kernel/execution/engineering-session.errors.ts',
      'src/kernel/execution/engineering-session.events.ts',
      'src/kernel/execution/engineering-session.service.ts',
      'src/kernel/execution/engineering-session.ts',
      'src/kernel/execution/governance-gated-workflow-advancement.consumer.ts',
      'src/kernel/execution/mission-engineering-orchestration.errors.ts',
      'src/kernel/execution/mission-engineering-orchestration.repository.ts',
      'src/kernel/execution/recovery-requirement-governance-decision.consumer.ts',
      'src/kernel/execution/recovery-requirement.contract.ts',
      'src/kernel/execution/recovery-requirement.service.ts',
      'src/kernel/governance/governance-state-projection.contract.ts',
      'src/kernel/governance/governance-state-projection.repository.ts',
      'src/kernel/governance/governance-state-projection.service.ts',
      'src/kernel/governance/governance-state-projection.ts',
      'src/kernel/governance/governance-state-projection.types.ts',
    ]);
    const changedProductionPaths = execFileSync(
      'git',
      ['--no-pager', 'diff', '--name-only', '--', 'src'],
      { cwd: process.cwd(), encoding: 'utf8' },
    )
      .split(/\r?\n/)
      .filter((path) => path.length > 0)
      .filter((path) => !authorizedProductionPaths.has(path));
    const changedHostOrAdapterPaths = execFileSync(
      'git',
      ['--no-pager', 'diff', '--name-only', '--', 'src/hosts', 'src/adapters'],
      { cwd: process.cwd(), encoding: 'utf8' },
    )
      .split(/\r?\n/)
      .filter((path) => path.length > 0);

    expect(changedProductionPaths).toEqual([]);
    expect(changedHostOrAdapterPaths).toEqual([]);
  });
});

class CollectingEventBus implements EventBusContract {
  private readonly events: EventBusEvent[] = [];
  private readonly subscriptions: EventSubscription[] = [];

  public async publish(event: EventBusEvent): Promise<void> {
    this.events.push(event);

    for (const subscription of this.subscriptions) {
      if (subscription.eventType === event.eventType) {
        await subscription.handler(event);
      }
    }
  }

  public subscribe(subscription: EventSubscription): EventSubscriptionHandle {
    this.subscriptions.push(subscription);

    return {
      dispose: () => {
        const index = this.subscriptions.indexOf(subscription);

        if (index >= 0) {
          this.subscriptions.splice(index, 1);
        }
      },
    };
  }

  public replay(replayMissionId: string): readonly EventBusEvent[] {
    return Object.freeze(this.events.filter((event) => event.missionId === replayMissionId));
  }

  public eventsOfType(eventType: string): readonly EventBusEvent[] {
    return Object.freeze(this.events.filter((event) => event.eventType === eventType));
  }
}

class FailingGovernanceDecisionRepository
  extends InMemoryGovernanceDecisionRepository
  implements IGovernanceDecisionRepository
{
  public override async register(): Promise<GovernanceDecision> {
    throw new Error('GovernanceDecision persistence failed.');
  }
}

interface GovernedHarness {
  readonly eventBus: CollectingEventBus;
  readonly repositoryPolicyService: RepositoryPolicyService;
  readonly reviewService: ReviewService;
  readonly governanceService: GovernanceService;
  readonly governanceDecisionRepository: IGovernanceDecisionRepository;
  readonly recoveryRequirementRepository: InMemoryRecoveryRequirementRepository;
  readonly recoveryRequirementService: RecoveryRequirementService;
  readonly engineeringSessionService: EngineeringSessionService;
  readonly workflowAdvancementConsumer: GovernanceGatedWorkflowAdvancementConsumer;
  readonly missionExecutionService: MissionExecutionService;
  registerPolicy(criteria: readonly PolicyCriterionInput[]): Promise<void>;
  createCompletedReview(
    outcome: ReviewOutcomeValue,
    reviewMissionId?: string,
  ): Promise<Awaited<ReturnType<ReviewService['finalizeReviewOutcome']>>>;
  createInProgressReview(): Promise<Awaited<ReturnType<ReviewService['startReview']>>>;
  evaluateGovernance(
    reviewId: string,
    options?: { readonly reviewStateReference?: string },
  ): Promise<GovernanceDecisionSnapshot>;
  advanceAfterDecision(
    decision: GovernanceDecisionSnapshot,
  ): ReturnType<GovernanceGatedWorkflowAdvancementConsumer['handleGovernanceDecisionRecorded']>;
  requireGovernanceDecisionRecordedEvent(governanceDecisionId: string): EventBusEvent;
  requireSingleRecoveryRequirement(): Promise<ReturnType<Awaited<ReturnType<InMemoryRecoveryRequirementRepository['enumerate']>>[number]['toSnapshot']>>;
  eventsOfType(eventType: string): readonly EventBusEvent[];
}

async function createGovernedHarness(input: {
  readonly authorityRecords?: readonly RatificationAuthorityRecordInput[];
  readonly governanceDecisionRepository?: IGovernanceDecisionRepository;
} = {}): Promise<GovernedHarness> {
  const eventBus = new CollectingEventBus();
  const missionRepository = new InMemoryMissionRepository();
  const repositoryPolicyRepository = new InMemoryRepositoryPolicyRepository();
  const reviewRepository = new InMemoryReviewRepository();
  const governanceDecisionRepository =
    input.governanceDecisionRepository ?? new InMemoryGovernanceDecisionRepository();
  const ratificationAuthorityRepository = new InMemoryRatificationAuthoritySnapshotRepository();
  const recoveryRequirementRepository = new InMemoryRecoveryRequirementRepository();
  const workflowChainRepository = new InMemoryWorkflowChainRepository();
  const engineeringSessionRepository = new InMemoryEngineeringSessionRepository();
  const repositoryPolicyService = new RepositoryPolicyService(repositoryPolicyRepository);
  const reviewService = new ReviewService(
    reviewRepository,
    eventBus,
    createIdentityFactory('review-event'),
    () => timestamp,
  );
  const ratificationAttributionValidationService = new RatificationAttributionValidationService(
    ratificationAuthorityRepository,
  );
  const governanceService = new GovernanceService(
    repositoryPolicyRepository,
    reviewRepository,
    governanceDecisionRepository,
    createIdentityFactory('governance'),
    ratificationAttributionValidationService,
    eventBus,
  );
  const recoveryRequirementService = new RecoveryRequirementService(
    recoveryRequirementRepository,
    eventBus,
    createIdentityFactory('recovery-requirement'),
  );
  const recoveryRequirementConsumer = new RecoveryRequirementGovernanceDecisionConsumer(
    governanceDecisionRepository,
    recoveryRequirementService,
    undefined,
    undefined,
    eventBus,
  );
  const workflowChainService = new WorkflowChainService(workflowChainRepository);
  const engineeringSessionService = new EngineeringSessionService(
    engineeringSessionRepository,
    workflowChainRepository,
    createIdentityFactory('engineering-session'),
    () => timestamp,
    undefined,
    undefined,
    undefined,
    undefined,
    new InMemoryEngineeringSessionCheckpointRepository(),
    governanceDecisionRepository,
    reviewRepository,
    recoveryRequirementRepository,
  );
  const workflowAdvancementConsumer = new GovernanceGatedWorkflowAdvancementConsumer(
    engineeringSessionService,
  );
  const missionService = new MissionService(
    missionRepository,
    eventBus,
    createIdentityFactory('mission-event'),
    () => timestamp,
  );
  const missionPlanningService = new MissionPlanningService(
    missionRepository,
    eventBus,
    createIdentityFactory('mission-plan-event'),
    () => timestamp,
  );
  const missionExecutionService = new MissionExecutionService(
    missionRepository,
    eventBus,
    createIdentityFactory('mission-execution-event'),
    () => timestamp,
    governanceDecisionRepository,
  );

  await ratificationAuthorityRepository.recordSnapshot(
    RatificationAuthoritySnapshot.create({
      source: 'RATIFICATION_LEDGER.md',
      capturedAt: timestamp,
      records: input.authorityRecords ?? [ratificationRecord()],
    }),
  );
  await createMissionReadyForGovernanceCompletion({
    missionService,
    missionPlanningService,
    missionExecutionService,
  });
  await workflowChainService.createWorkflowChain({
    id: workflowChainId,
    steps: [{ roleId: 'builder' }, { roleId: 'reviewer' }],
  });
  await engineeringSessionService.createEngineeringSession({
    id: engineeringSessionId,
    engineeringRuntimeContextReference: 'runtime-context-sprint-62',
    activeEngineeringWorkflowReference: 'governance-automation-validation',
    workflowChainId,
    currentWorkflowStepId,
    participatingRoleIds: ['builder', 'reviewer'],
    workflowState: 'active',
  });
  eventBus.subscribe({
    eventType: 'GovernanceDecisionRecorded',
    handler: async (event) => {
      await recoveryRequirementConsumer.handleGovernanceDecisionRecorded({
        event,
        engineeringSessionId,
        workflowStepId: currentWorkflowStepId,
      });
    },
  });
  const requireGovernanceDecisionRecordedEvent = (governanceDecisionId: string): EventBusEvent => {
    const event = eventBus
      .eventsOfType('GovernanceDecisionRecorded')
      .find((candidate) => candidate.payload['governanceDecisionId'] === governanceDecisionId);

    if (event === undefined) {
      throw new Error(`Expected GovernanceDecisionRecorded event for '${governanceDecisionId}'.`);
    }

    return event;
  };

  return {
    eventBus,
    repositoryPolicyService,
    reviewService,
    governanceService,
    governanceDecisionRepository,
    recoveryRequirementRepository,
    recoveryRequirementService,
    engineeringSessionService,
    workflowAdvancementConsumer,
    missionExecutionService,
    async registerPolicy(criteria) {
      await repositoryPolicyService.registerRepositoryPolicy({
        id: repositoryPolicyId,
        name: 'Sprint 62 Governance Automation Policy',
        description: 'Validation policy for the complete governed engineering path.',
        criteria,
        ratificationId,
      });
    },
    createCompletedReview(outcome, reviewMissionId = missionId) {
      return createCompletedReview(reviewService, outcome, reviewMissionId);
    },
    createInProgressReview() {
      return reviewService.startReview({
        id: 'review-sprint-62',
        missionId,
        missionPlanRevision: 'mission-plan-revision-sprint-62',
        reviewCriteria: [{ id: 'review-criteria-sprint-62', description: 'Review criteria.' }],
        evidenceReferences: ['evidence-sprint-62'],
      });
    },
    evaluateGovernance(reviewId, options) {
      return governanceService.evaluateGovernancePolicy({
        missionId,
        repositoryPolicyId,
        repositoryPolicyVersion,
        reviewId,
        evaluatedAt: timestamp,
        ...(options?.reviewStateReference === undefined
          ? {}
          : { reviewStateReference: options.reviewStateReference }),
      });
    },
    advanceAfterDecision(decision) {
      return workflowAdvancementConsumer.handleGovernanceDecisionRecorded({
        event: requireGovernanceDecisionRecordedEvent(decision.id),
        engineeringSessionId,
        currentWorkflowStepId,
      });
    },
    requireGovernanceDecisionRecordedEvent,
    async requireSingleRecoveryRequirement() {
      const recoveryRequirements = await recoveryRequirementRepository.enumerate();
      const recoveryRequirement = recoveryRequirements[0];

      if (recoveryRequirement === undefined || recoveryRequirements.length !== 1) {
        throw new Error('Expected exactly one RecoveryRequirement.');
      }

      return recoveryRequirement.toSnapshot();
    },
    eventsOfType(eventType) {
      return eventBus.eventsOfType(eventType);
    },
  };
}

async function createMissionReadyForGovernanceCompletion(services: {
  readonly missionService: MissionService;
  readonly missionPlanningService: MissionPlanningService;
  readonly missionExecutionService: MissionExecutionService;
}): Promise<void> {
  await services.missionService.createMission({
    id: missionId,
    objective: 'Validate Milestone 9 governance automation integration.',
  });
  await services.missionService.planMission(missionId);
  await services.missionPlanningService.createMissionPlan({
    id: missionPlanId,
    missionId,
    revisionReason: 'Create Sprint 62 certification plan.',
  });
  await services.missionPlanningService.addTask({
    missionPlanId,
    taskId,
    title: 'Exercise governed engineering path',
    description: 'Run the integrated governance automation path.',
    revisionReason: 'Add certification task.',
  });
  await services.missionPlanningService.updateTask({
    missionPlanId,
    taskId,
    status: 'Ready',
    revisionReason: 'Mark certification task ready.',
  });
  await services.missionService.markMissionReady(missionId);
  await services.missionExecutionService.startMission({ missionId });
  await services.missionExecutionService.startTask({ missionId, taskId });
  await services.missionExecutionService.completeTask({ missionId, taskId });
  await services.missionService.reviewMission(missionId);
}

async function createCompletedReview(
  reviewService: ReviewService,
  outcome: ReviewOutcomeValue,
  reviewMissionId: string,
): Promise<Awaited<ReturnType<ReviewService['finalizeReviewOutcome']>>> {
  await reviewService.startReview({
    id: 'review-sprint-62',
    missionId: reviewMissionId,
    missionPlanRevision: 'mission-plan-revision-sprint-62',
    reviewCriteria: [{ id: 'review-criteria-sprint-62', description: 'Review criteria.' }],
    evidenceReferences: ['evidence-sprint-62'],
  });

  return reviewService.finalizeReviewOutcome({
    reviewId: 'review-sprint-62',
    outcome,
  });
}

function reviewOutcomeCriterion(
  id: string,
  allowedReviewOutcomes: readonly ReviewOutcomeValue[],
): PolicyCriterionInput {
  return {
    id,
    description: `${id} criterion.`,
    requiredInputs: ['ReviewOutcome'],
    conditionDescriptor: JSON.stringify({
      kind: 'ReviewOutcomeMembership',
      schemaVersion: 1,
      allowedReviewOutcomes,
    }),
  };
}

function ratificationRecord(
  overrides: RatificationAuthorityRecordInput = {},
): RatificationAuthorityRecordInput {
  return {
    identifier: ratificationId,
    date: '2026-07-16',
    subject: 'Sprint 62 Scope Ratification.',
    lifecycleStatus: 'Effective',
    ...overrides,
  };
}

function createIdentityFactory(prefix: string): () => string {
  let index = 0;

  return () => {
    index += 1;

    return `${prefix}-${index}`;
  };
}
