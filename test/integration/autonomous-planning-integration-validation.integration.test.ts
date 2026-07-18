import { describe, expect, it } from 'vitest';

import { type EventBusEvent } from '../../src/kernel/common/event-bus-contract';
import type { KernelLogger } from '../../src/kernel/common/kernel-logger';
import { EventBus } from '../../src/kernel/events/event-bus';
import { GovernanceDecision } from '../../src/kernel/governance/governance-decision';
import {
  InMemoryGovernanceDecisionRepository,
} from '../../src/kernel/governance/governance-decision.repository';
import type { GovernanceDecisionSnapshot } from '../../src/kernel/governance/governance.types';
import { GovernanceService } from '../../src/kernel/governance/governance.service';
import { InMemoryRatificationAuthoritySnapshotRepository } from '../../src/kernel/governance/ratification-authority.repository';
import { RatificationAuthoritySnapshot } from '../../src/kernel/governance/ratification-authority-snapshot';
import { RatificationAttributionValidationService } from '../../src/kernel/governance/ratification-attribution-validation';
import { RepositoryPolicy } from '../../src/kernel/governance/repository-policy';
import {
  InMemoryRepositoryPolicyRepository,
} from '../../src/kernel/governance/repository-policy.repository';
import type { PolicyCriterionInput } from '../../src/kernel/governance/repository-policy.types';
import { Mission } from '../../src/kernel/mission/mission.aggregate';
import { MissionId } from '../../src/kernel/mission/mission-id';
import { MissionObjective } from '../../src/kernel/mission/mission-objective';
import type { MissionPlan } from '../../src/kernel/mission/mission-plan.aggregate';
import { InMemoryMissionRepository } from '../../src/kernel/mission/mission.repository';
import { PlanningActivationService } from '../../src/kernel/planning/planning-activation.service';
import { PlanningCorrelation } from '../../src/kernel/planning/planning-correlation';
import {
  InMemoryPlanningCorrelationRepository,
} from '../../src/kernel/planning/planning-correlation.repository';
import { PlanningCorrelationService } from '../../src/kernel/planning/planning-correlation.service';
import {
  PlanningCorrelationAssociationRejectedError,
} from '../../src/kernel/planning/planning.errors';
import { PlanningService } from '../../src/kernel/planning/planning.service';
import type {
  ProposedMissionPlanInput,
  ProposedMissionPlanSnapshot,
  ProposedPlanRevisionInput,
} from '../../src/kernel/planning/planning.types';
import { ProposedMissionPlan } from '../../src/kernel/planning/proposed-mission-plan';
import {
  InMemoryProposedMissionPlanRepository,
} from '../../src/kernel/planning/proposed-mission-plan.repository';
import { ReviewService } from '../../src/kernel/review/review.service';
import { Review } from '../../src/kernel/review/review.aggregate';
import { InMemoryReviewRepository } from '../../src/kernel/review/review.repository';
import type { ReviewOutcomeValue } from '../../src/kernel/review/review.types';

const missionId = 'mission-sprint-77';
const proposedMissionPlanId = 'proposed-mission-plan-sprint-77';
const initialRevisionId = 'proposed-plan-revision-sprint-77-draft';
const submittedRevisionId = 'proposed-plan-revision-sprint-77-submitted';
const underReviewRevisionId = 'proposed-plan-revision-sprint-77-under-review';
const governedRevisionId = 'proposed-plan-revision-sprint-77-governed';
const siblingDraftRevisionId = 'proposed-plan-revision-sprint-77-sibling-draft';
const siblingSubmittedRevisionId = 'proposed-plan-revision-sprint-77-sibling-submitted';
const siblingUnderReviewRevisionId = 'proposed-plan-revision-sprint-77-sibling-under-review';
const siblingGovernedRevisionId = 'proposed-plan-revision-sprint-77-sibling-governed';
const planningCorrelationId = 'planning-correlation-sprint-77';
const siblingPlanningCorrelationId = 'planning-correlation-sprint-77-sibling';
const reviewId = 'review-sprint-77';
const siblingReviewId = 'review-sprint-77-sibling';
const governanceDecisionId = 'governance-decision-sprint-77';
const siblingGovernanceDecisionId = 'governance-decision-sprint-77-sibling';
const repositoryPolicyId = 'repository-policy-sprint-77';
const repositoryPolicyVersion = 1;
const ratificationId = 'NEXUS-RAT-2026-07-18-002';
const timestamp = '2026-07-18T02:00:00.000Z';

const plannerAttribution = {
  executionRoleId: 'planner',
  actorType: 'Human',
  actorId: 'neil',
  engineeringSessionId: 'engineering-session-sprint-77',
  generatedAt: timestamp,
  causality: ['mission-created'],
  correlationId: 'planner-correlation-sprint-77',
} as const;

describe('Sprint 77 autonomous Planning integration validation', () => {
  it('drives Draft to executable MissionPlan through real Planning, Review, Governance, and Mission services', async () => {
    const harness = await createSprint77Harness();
    await harness.registerMission();
    await harness.registerRepositoryPolicy();
    const governed = await harness.driveGovernedRevision({
      planningCorrelationId,
      reviewId,
      governanceDecisionId,
      submittedRevisionId,
      underReviewRevisionId,
      governedRevisionId,
    });
    const governedRevisionBeforeActivation = requireRevision(
      governed.proposedMissionPlan,
      governedRevisionId,
    );

    const activation = await harness.activationService.activate({
      proposedMissionPlanId,
      proposedPlanRevisionId: governedRevisionId,
      missionPlanId: 'mission-plan-sprint-77',
      activatedAt: '2026-07-18T02:30:00.000Z',
    });
    const repeatedActivation = await harness.activationService.activate({
      proposedMissionPlanId,
      proposedPlanRevisionId: governedRevisionId,
      missionPlanId: 'mission-plan-sprint-77',
      activatedAt: '2026-07-18T02:31:00.000Z',
    });
    const activatedRevision = requireRevision(activation.proposedMissionPlan, governedRevisionId);

    expect(governed.proposedMissionPlan.revisions.map((revision) => revision.lifecycleState)).toEqual([
      'Draft',
      'Submitted',
      'Under Review',
      'Governed',
    ]);
    expect(governed.planningCorrelation).toMatchObject({
      id: planningCorrelationId,
      reviewedProposedPlanRevisionId: underReviewRevisionId,
      governedProposedPlanRevisionId: governedRevisionId,
      reviewId,
      governanceDecisionId,
    });
    expect(governed.governanceDecision).toMatchObject({
      id: governanceDecisionId,
      missionId,
      value: 'Approved',
      reviewId,
      repositoryPolicyId,
      repositoryPolicyVersion,
    });
    expect((await harness.reviewService.queryReviewResult({ reviewId })).review).toMatchObject({
      id: reviewId,
      missionId,
      missionPlanRevision: {
        kind: 'ProposedPlanRevision',
        revisionId: underReviewRevisionId,
      },
      status: 'Completed',
      outcome: 'Accepted',
    });
    expect(activation.proposedMissionPlan.lifecycleState).toBe('Activated');
    expect(activation.missionPlan).toMatchObject({
      id: 'mission-plan-sprint-77',
      missionId,
      metadata: {
        proposedMissionPlanId,
        proposedPlanRevisionId: governedRevisionId,
        reviewPlanRevisionKind: 'ProposedPlanRevision',
        reviewPlanRevisionId: underReviewRevisionId,
        reviewId,
        governanceDecisionId,
        planningCorrelationId,
      },
    });
    expect(activation.missionPlan.tasks.map((task) => task.id)).toEqual([
      'proposed-task-sprint-77-design',
      'proposed-task-sprint-77-validate',
    ]);
    expect(
      activation.missionPlan.tasks.find((task) => task.id === 'proposed-task-sprint-77-validate')
        ?.dependencies,
    ).toEqual(['proposed-task-sprint-77-design']);
    expect(repeatedActivation.missionPlan).toEqual(activation.missionPlan);
    await expect(
      harness.missionRepository.getMissionPlansByMissionId(MissionId.fromString(missionId)),
    ).resolves.toHaveLength(1);
    expect(harness.eventsOfType('MissionPlanCreated')).toHaveLength(1);
    expect(harness.eventsOfType('TaskCreated')).toHaveLength(2);
    expect(activatedRevision).toMatchObject({
      ...governedRevisionBeforeActivation,
      lifecycleState: 'Activated',
    });
  });

  it('fails closed when Review revision typing does not match the PlanningCorrelation', async () => {
    const harness = await createSprint77Harness();
    await harness.registerMission();
    await harness.registerRepositoryPolicy();
    await harness.planningService.createProposedMissionPlan(createPlanInput());
    await harness.planningService.submitCurrentRevision(submitCommand(submittedRevisionId));
    await harness.reviewService.startReview({
      id: reviewId,
      missionId,
      missionPlanRevision: {
        kind: 'ExecutableMissionPlan',
        revisionId: underReviewRevisionId,
      },
      reviewCriteria: [{ id: 'criterion-sprint-77', description: 'Validate typed revision.' }],
      evidenceReferences: [underReviewRevisionId],
    });
    await harness.planningCorrelationRepository.register(
      PlanningCorrelation.create({
        id: planningCorrelationId,
        missionId,
        proposedMissionPlanId,
        reviewedProposedPlanRevisionId: underReviewRevisionId,
        plannerAttribution,
        createdAt: timestamp,
      }).associateReview(reviewId),
    );
    await harness.reviewService.finalizeReviewOutcome({ reviewId, outcome: 'Accepted' });

    await expect(
      harness.planningCorrelationService.evaluateGovernance(
        governanceCommand({
          planningCorrelationId,
          id: governedRevisionId,
          governanceDecisionId,
        }),
      ),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);
  });

  it('rejects unsafe Activation paths and preserves executable Mission state on injected failure', async () => {
    const failingMissionRepository = new FailingCommitMissionRepository();
    const failureHarness = await createSprint77Harness({ missionRepository: failingMissionRepository });
    await failureHarness.registerMission();
    await failureHarness.registerRepositoryPolicy();
    await failureHarness.driveGovernedRevision({
      planningCorrelationId,
      reviewId,
      governanceDecisionId,
      submittedRevisionId,
      underReviewRevisionId,
      governedRevisionId,
    });

    failingMissionRepository.failNextCommit();

    await expect(
      failureHarness.activationService.activate({
        proposedMissionPlanId,
        proposedPlanRevisionId: governedRevisionId,
        missionPlanId: 'mission-plan-sprint-77-failed',
      }),
    ).rejects.toThrow('Executable MissionPlan commit failed.');
    await expect(
      failureHarness.missionRepository.getMissionPlansByMissionId(MissionId.fromString(missionId)),
    ).resolves.toEqual([]);
    expect(failureHarness.eventsOfType('MissionPlanCreated')).toHaveLength(0);
    expect(failureHarness.eventsOfType('TaskCreated')).toHaveLength(0);
    await expect(
      failureHarness.proposedMissionPlanRepository.getById(proposedMissionPlanId),
    ).resolves.toMatchObject({
      lifecycleState: 'Governed',
    });

    const siblingHarness = await createSprint77Harness();
    await siblingHarness.registerMission();
    await siblingHarness.registerRepositoryPolicy();
    await siblingHarness.driveGovernedRevision({
      planningCorrelationId,
      reviewId,
      governanceDecisionId,
      submittedRevisionId,
      underReviewRevisionId,
      governedRevisionId,
    });
    await siblingHarness.driveGovernedRevision({
      planningCorrelationId: siblingPlanningCorrelationId,
      reviewId: siblingReviewId,
      governanceDecisionId: siblingGovernanceDecisionId,
      submittedRevisionId: siblingSubmittedRevisionId,
      underReviewRevisionId: siblingUnderReviewRevisionId,
      governedRevisionId: siblingGovernedRevisionId,
      appendDraftRevisionId: siblingDraftRevisionId,
    });

    await siblingHarness.activationService.activate({
      proposedMissionPlanId,
      proposedPlanRevisionId: siblingGovernedRevisionId,
      missionPlanId: 'mission-plan-sprint-77-sibling',
    });
    const stored = await siblingHarness.proposedMissionPlanRepository.getById(proposedMissionPlanId);
    const storedSnapshot = stored?.toSnapshot();

    expect(storedSnapshot?.revisions.map((revision) => revision.lifecycleState)).toContain(
      'Superseded',
    );
    expect(requireRevision(requireSnapshot(storedSnapshot), governedRevisionId).lifecycleState).toBe(
      'Superseded',
    );
    await expect(
      siblingHarness.activationService.activate({
        proposedMissionPlanId,
        proposedPlanRevisionId: governedRevisionId,
        missionPlanId: 'mission-plan-sprint-77-late-sibling',
      }),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);
  });

  it('rejects Activation when Governance is missing, non-terminal, non-Approved, or stale', async () => {
    await expect(expectActivationRejectedForSeededGovernanceState('missing')).rejects.toThrow(
      PlanningCorrelationAssociationRejectedError,
    );
    await expect(expectActivationRejectedForSeededGovernanceState('Deferred')).rejects.toThrow(
      PlanningCorrelationAssociationRejectedError,
    );
    await expect(expectActivationRejectedForSeededGovernanceState('Rejected')).rejects.toThrow(
      PlanningCorrelationAssociationRejectedError,
    );

    const staleHarness = await createSprint77Harness();
    await staleHarness.registerMission();
    await staleHarness.seedGovernedActivationState({
      governanceDecision: governanceDecisionSnapshot({
        reviewId: 'review-sprint-77-stale',
        value: 'Approved',
      }),
    });

    await expect(
      staleHarness.activationService.activate({
        proposedMissionPlanId,
        proposedPlanRevisionId: governedRevisionId,
      }),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);
  });
});

async function expectActivationRejectedForSeededGovernanceState(
  governanceState: 'missing' | 'Deferred' | 'Rejected',
): Promise<unknown> {
  const harness = await createSprint77Harness();
  await harness.registerMission();
  await harness.seedGovernedActivationState({
    governanceDecision:
      governanceState === 'missing'
        ? undefined
        : governanceDecisionSnapshot({
            value: governanceState,
          }),
  });

  return harness.activationService.activate({
    proposedMissionPlanId,
    proposedPlanRevisionId: governedRevisionId,
  });
}

async function createSprint77Harness(
  overrides: {
    readonly missionRepository?: InMemoryMissionRepository;
  } = {},
): Promise<{
  readonly planningService: PlanningService;
  readonly planningCorrelationService: PlanningCorrelationService;
  readonly activationService: PlanningActivationService;
  readonly reviewService: ReviewService;
  readonly proposedMissionPlanRepository: InMemoryProposedMissionPlanRepository;
  readonly planningCorrelationRepository: InMemoryPlanningCorrelationRepository;
  readonly governanceDecisionRepository: InMemoryGovernanceDecisionRepository;
  readonly missionRepository: InMemoryMissionRepository;
  readonly registerMission: () => Promise<void>;
  readonly registerRepositoryPolicy: () => Promise<void>;
  readonly driveGovernedRevision: (
    input: GovernedRevisionInput,
  ) => Promise<Awaited<ReturnType<PlanningCorrelationService['evaluateGovernance']>>>;
  readonly seedGovernedActivationState: (input: SeedGovernedActivationStateInput) => Promise<void>;
  readonly eventsOfType: (eventType: string) => readonly EventBusEvent[];
}> {
  const eventBus = new EventBus(new TestLogger());
  const proposedMissionPlanRepository = new InMemoryProposedMissionPlanRepository();
  const planningCorrelationRepository = new InMemoryPlanningCorrelationRepository();
  const reviewRepository = new InMemoryReviewRepository();
  const repositoryPolicyRepository = new InMemoryRepositoryPolicyRepository();
  const governanceDecisionRepository = new InMemoryGovernanceDecisionRepository();
  const missionRepository = overrides.missionRepository ?? new InMemoryMissionRepository();
  const ratificationAuthorityRepository = new InMemoryRatificationAuthoritySnapshotRepository();
  const ratificationAttributionValidationService = new RatificationAttributionValidationService(
    ratificationAuthorityRepository,
  );
  const reviewService = new ReviewService(
    reviewRepository,
    eventBus,
    createIdentitySequence([
      'review-started-event-sprint-77',
      'review-completed-event-sprint-77',
      'review-accepted-event-sprint-77',
      'review-started-event-sprint-77-sibling',
      'review-completed-event-sprint-77-sibling',
      'review-accepted-event-sprint-77-sibling',
    ]),
    () => timestamp,
  );
  const governanceService = new GovernanceService(
    repositoryPolicyRepository,
    reviewRepository,
    governanceDecisionRepository,
    createIdentitySequence([
      'policy-evaluation-sprint-77',
      governanceDecisionId,
      'governance-decision-recorded-event-sprint-77',
      'policy-evaluation-sprint-77-sibling',
      siblingGovernanceDecisionId,
      'governance-decision-recorded-event-sprint-77-sibling',
    ]),
    ratificationAttributionValidationService,
    eventBus,
  );
  const planningService = new PlanningService(proposedMissionPlanRepository);
  const planningCorrelationService = new PlanningCorrelationService(
    proposedMissionPlanRepository,
    planningCorrelationRepository,
    reviewService,
    createIdentitySequence([planningCorrelationId, siblingPlanningCorrelationId]),
    governanceService,
    repositoryPolicyRepository,
    governanceDecisionRepository,
  );
  const activationService = new PlanningActivationService(
    proposedMissionPlanRepository,
    planningCorrelationRepository,
    reviewService,
    governanceDecisionRepository,
    missionRepository,
    eventBus,
  );

  await ratificationAuthorityRepository.recordSnapshot(
    RatificationAuthoritySnapshot.create({
      source: 'RATIFICATION_LEDGER.md',
      capturedAt: timestamp,
      records: [
        {
          identifier: ratificationId,
          date: '2026-07-18',
          subject: 'Sprint 77 autonomous Planning integration validation.',
          lifecycleStatus: 'Effective',
        },
      ],
    }),
  );

  return {
    planningService,
    planningCorrelationService,
    activationService,
    reviewService,
    proposedMissionPlanRepository,
    planningCorrelationRepository,
    governanceDecisionRepository,
    missionRepository,
    async registerMission() {
      await missionRepository.save(
        Mission.create(
          MissionId.fromString(missionId),
          MissionObjective.fromString('Validate autonomous Planning integration.'),
          { eventId: 'mission-created-event-sprint-77', timestamp },
        ),
      );
    },
    async registerRepositoryPolicy() {
      await repositoryPolicyRepository.registerInitialVersion(createRepositoryPolicy());
    },
    async driveGovernedRevision(input) {
      if (input.appendDraftRevisionId !== undefined) {
        await planningService.createProposedPlanRevision(
          revisionInput({
            id: input.appendDraftRevisionId,
            createdAt: '2026-07-18T02:05:00.000Z',
            causality: [governedRevisionId],
            correlationId: `${input.appendDraftRevisionId}-correlation`,
          }),
        );
      } else {
        await planningService.createProposedMissionPlan(createPlanInput());
      }

      await planningService.submitCurrentRevision(submitCommand(input.submittedRevisionId));
      await planningCorrelationService.enterReview({
        missionId,
        proposedMissionPlanId,
        submittedProposedPlanRevisionId: input.submittedRevisionId,
        underReviewProposedPlanRevisionId: input.underReviewRevisionId,
        planningCorrelationId: input.planningCorrelationId,
        reviewId: input.reviewId,
        reviewCriteria: [{ id: 'criterion-sprint-77', description: 'Validate proposed plan.' }],
        evidenceReferences: [input.underReviewRevisionId],
        plannerAttribution,
        createdAt: timestamp,
        causality: [input.submittedRevisionId],
        correlationId: `${input.planningCorrelationId}-entry`,
      });
      await reviewService.finalizeReviewOutcome({
        reviewId: input.reviewId,
        outcome: 'Accepted',
      });

      return planningCorrelationService.evaluateGovernance(
        governanceCommand({
          planningCorrelationId: input.planningCorrelationId,
          id: input.governedRevisionId,
          governanceDecisionId: input.governanceDecisionId,
        }),
      );
    },
    async seedGovernedActivationState(input) {
      await proposedMissionPlanRepository.create(
        ProposedMissionPlan.fromSnapshot(proposedMissionPlanSnapshot()),
      );
      await reviewRepository.create(
        Review.fromSnapshot({
          id: reviewId,
          missionId,
          missionPlanRevision: {
            kind: 'ProposedPlanRevision',
            revisionId: underReviewRevisionId,
          },
          status: 'Completed',
          outcome: 'Accepted',
          reviewCriteria: [{ id: 'criterion-sprint-77', description: 'Validate proposed plan.' }],
          evidenceReferences: [underReviewRevisionId],
          findings: [],
        }),
      );
      await planningCorrelationRepository.register(
        PlanningCorrelation.create({
          id: planningCorrelationId,
          missionId,
          proposedMissionPlanId,
          reviewedProposedPlanRevisionId: underReviewRevisionId,
          plannerAttribution,
          createdAt: timestamp,
        })
          .associateReview(reviewId)
          .associateRepositoryPolicy({
            repositoryPolicyId,
            repositoryPolicyVersion,
          })
          .associateGovernanceDecision(governanceDecisionId)
          .associateGovernedProposedPlanRevision(governedRevisionId),
      );

      if (input.governanceDecision !== undefined) {
        await governanceDecisionRepository.register(
          GovernanceDecision.fromSnapshot(input.governanceDecision),
        );
      }
    },
    eventsOfType(eventType) {
      return eventBus.replay(missionId).filter((event) => event.eventType === eventType);
    },
  };
}

interface GovernedRevisionInput {
  readonly planningCorrelationId: string;
  readonly reviewId: string;
  readonly governanceDecisionId: string;
  readonly submittedRevisionId: string;
  readonly underReviewRevisionId: string;
  readonly governedRevisionId: string;
  readonly appendDraftRevisionId?: string;
}

interface SeedGovernedActivationStateInput {
  readonly governanceDecision: GovernanceDecisionSnapshot | undefined;
}

class FailingCommitMissionRepository extends InMemoryMissionRepository {
  private failNextMissionPlanSave = false;

  public failNextCommit(): void {
    this.failNextMissionPlanSave = true;
  }

  public override async saveMissionPlan(missionPlan: MissionPlan): Promise<void> {
    if (this.failNextMissionPlanSave) {
      this.failNextMissionPlanSave = false;
      throw new Error('Executable MissionPlan commit failed.');
    }

    await super.saveMissionPlan(missionPlan);
  }
}

function createPlanInput(): ProposedMissionPlanInput {
  return {
    id: proposedMissionPlanId,
    missionId,
    initialRevision: revisionInput({ id: initialRevisionId }),
  };
}

function revisionInput(
  overrides: Partial<ProposedPlanRevisionInput> = {},
): ProposedPlanRevisionInput {
  return {
    id: initialRevisionId,
    proposedMissionPlanId,
    revisionNumber: 1,
    proposedTasks: [
      {
        id: 'proposed-task-sprint-77-design',
        title: 'Validate Planning integration',
        description: 'Drive the proposed Mission Plan through Review and Governance.',
      },
      {
        id: 'proposed-task-sprint-77-validate',
        title: 'Validate executable MissionPlan',
        description: 'Confirm Activation creates traceable executable Mission state.',
      },
    ],
    proposedTaskDependencies: [
      {
        targetProposedTaskId: 'proposed-task-sprint-77-validate',
        prerequisiteProposedTaskId: 'proposed-task-sprint-77-design',
      },
    ],
    plannerAttribution,
    createdAt: timestamp,
    causality: ['mission-created'],
    correlationId: 'revision-correlation-sprint-77',
    ...overrides,
  };
}

function submitCommand(
  submittedRevision: string,
): Parameters<PlanningService['submitCurrentRevision']>[0] {
  return {
    proposedMissionPlanId,
    id: submittedRevision,
    plannerAttribution,
    createdAt: timestamp,
    causality: [initialRevisionId],
    correlationId: `${submittedRevision}-correlation`,
    planningPolicy: {
      id: 'planning-policy-sprint-77',
      version: '1.0.0',
      maxProposedTaskCount: 5,
      requiredProposedTaskFields: ['title', 'description'],
    },
  };
}

function governanceCommand(
  overrides: Partial<Parameters<PlanningCorrelationService['evaluateGovernance']>[0]> = {},
): Parameters<PlanningCorrelationService['evaluateGovernance']>[0] {
  return {
    missionId,
    planningCorrelationId,
    repositoryPolicyId,
    repositoryPolicyVersion,
    id: governedRevisionId,
    plannerAttribution,
    createdAt: timestamp,
    evaluatedAt: timestamp,
    causality: [reviewId],
    correlationId: 'governance-correlation-sprint-77',
    governanceDecisionId,
    ...overrides,
  };
}

function createRepositoryPolicy(): RepositoryPolicy {
  return RepositoryPolicy.createInitial({
    id: repositoryPolicyId,
    name: 'Sprint 77 Planning Review Policy',
    description: 'Requires an accepted Planning Review before Governance approval.',
    criteria: [
      criterion('review-accepted', ['Accepted', 'Accepted With Observations']),
    ],
    ratificationId,
  });
}

function criterion(
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

function proposedMissionPlanSnapshot(): ProposedMissionPlanSnapshot {
  return {
    id: proposedMissionPlanId,
    missionId,
    plannerAttribution,
    lifecycleState: 'Governed',
    revisions: [
      revisionSnapshot(initialRevisionId, 1, 'Draft'),
      revisionSnapshot(submittedRevisionId, 2, 'Submitted'),
      revisionSnapshot(underReviewRevisionId, 3, 'Under Review'),
      revisionSnapshot(governedRevisionId, 4, 'Governed'),
    ],
  };
}

function revisionSnapshot(
  id: string,
  revisionNumber: number,
  lifecycleState: ProposedMissionPlanSnapshot['revisions'][number]['lifecycleState'],
): ProposedMissionPlanSnapshot['revisions'][number] {
  return {
    ...revisionInput({ id }),
    revisionNumber,
    plannerAttribution,
    causality: ['mission-created'],
    correlationId: 'revision-correlation-sprint-77',
    lifecycleState,
  };
}

function governanceDecisionSnapshot(
  overrides: Partial<GovernanceDecisionSnapshot> = {},
): GovernanceDecisionSnapshot {
  return {
    id: governanceDecisionId,
    missionId,
    value: 'Approved',
    repositoryPolicyId,
    repositoryPolicyVersion,
    reviewId,
    reviewStateReference: `Review:${reviewId}:Completed:Accepted`,
    policyEvaluationId: 'policy-evaluation-sprint-77',
    evaluationKey: 'policy-evaluation-key-sprint-77',
    criterionResults: [],
    evaluatedAt: timestamp,
    explanationCodes: ['review-outcome-membership-satisfied'],
    ...overrides,
  };
}

function requireRevision(
  proposedMissionPlan: ProposedMissionPlanSnapshot,
  proposedPlanRevisionId: string,
): ProposedMissionPlanSnapshot['revisions'][number] {
  const revision = proposedMissionPlan.revisions.find(
    (candidate) => candidate.id === proposedPlanRevisionId,
  );

  if (revision === undefined) {
    throw new Error(`Expected ProposedPlanRevision '${proposedPlanRevisionId}' to exist.`);
  }

  return revision;
}

function requireSnapshot(
  snapshot: ProposedMissionPlanSnapshot | undefined,
): ProposedMissionPlanSnapshot {
  if (snapshot === undefined) {
    throw new Error('Expected ProposedMissionPlan snapshot to exist.');
  }

  return snapshot;
}

function createIdentitySequence(identities: string[]): () => string {
  let generatedIdentityCount = 0;

  return () => {
    const identity = identities.shift();

    if (identity !== undefined) {
      return identity;
    }

    generatedIdentityCount += 1;

    return `generated-sprint-77-identity-${generatedIdentityCount}`;
  };
}

class TestLogger implements KernelLogger {
  public info(): void {}

  public warn(): void {}

  public error(): void {}

  public debug(): void {}
}
