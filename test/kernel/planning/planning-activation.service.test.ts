import { describe, expect, it } from 'vitest';

import { EventBus } from '../../../src/kernel/events/event-bus';
import { GovernanceDecision, PolicyCriterionResult } from '../../../src/kernel/governance/governance-decision';
import { InMemoryGovernanceDecisionRepository } from '../../../src/kernel/governance/governance-decision.repository';
import { Mission } from '../../../src/kernel/mission/mission.aggregate';
import { MissionId } from '../../../src/kernel/mission/mission-id';
import { MissionObjective } from '../../../src/kernel/mission/mission-objective';
import type { MissionPlan } from '../../../src/kernel/mission/mission-plan.aggregate';
import { InMemoryMissionRepository } from '../../../src/kernel/mission/mission.repository';
import { PlanningActivationService } from '../../../src/kernel/planning/planning-activation.service';
import { PlanningCorrelation } from '../../../src/kernel/planning/planning-correlation';
import { InMemoryPlanningCorrelationRepository } from '../../../src/kernel/planning/planning-correlation.repository';
import { PlanningCorrelationAssociationRejectedError } from '../../../src/kernel/planning/planning.errors';
import type { PlannerAttributionInput, ProposedMissionPlanSnapshot } from '../../../src/kernel/planning/planning.types';
import { ProposedMissionPlan } from '../../../src/kernel/planning/proposed-mission-plan';
import { InMemoryProposedMissionPlanRepository } from '../../../src/kernel/planning/proposed-mission-plan.repository';
import type { ReviewServiceContract } from '../../../src/kernel/review/review.contract';
import type { ReviewSnapshot } from '../../../src/kernel/review/review.types';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';

class TestLogger implements KernelLogger {
  public info(): void {}

  public error(): void {}
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

const timestamp = '2026-07-17T00:00:00.000Z';

const plannerAttribution = {
  executionRoleId: 'planner',
  actorType: 'Human',
  actorId: 'neil',
  engineeringSessionId: 'engineering-session-1',
  generatedAt: timestamp,
  causality: [],
} satisfies PlannerAttributionInput;

describe('PlanningActivationService', () => {
  it('activates a Governed Proposed Plan Revision into executable MissionPlan state with traceability', async () => {
    const harness = await createActivationHarness();

    const result = await harness.activationService.activate({
      proposedMissionPlanId: 'proposed-mission-plan-1',
      proposedPlanRevisionId: 'proposed-plan-revision-governed',
      activatedAt: timestamp,
    });
    const repeated = await harness.activationService.activate({
      proposedMissionPlanId: 'proposed-mission-plan-1',
      proposedPlanRevisionId: 'proposed-plan-revision-governed',
      activatedAt: timestamp,
    });

    expect(result.proposedMissionPlan.lifecycleState).toBe('Activated');
    expect(result.proposedMissionPlan.revisions.map((revision) => revision.lifecycleState)).toEqual([
      'Under Review',
      'Activated',
    ]);
    expect(result.missionPlan.tasks.map((task) => task.id)).toEqual(['proposed-task-1', 'proposed-task-2']);
    expect(result.missionPlan.tasks.find((task) => task.id === 'proposed-task-2')?.dependencies).toEqual([
      'proposed-task-1',
    ]);
    expect(result.missionPlan.metadata).toMatchObject({
      proposedMissionPlanId: 'proposed-mission-plan-1',
      proposedPlanRevisionId: 'proposed-plan-revision-governed',
      reviewPlanRevisionKind: 'ProposedPlanRevision',
      reviewPlanRevisionId: 'proposed-plan-revision-under-review',
      reviewId: 'review-1',
      governanceDecisionId: 'governance-decision-1',
    });
    expect(repeated.missionPlan).toEqual(result.missionPlan);
    expect(harness.eventBus.replay('mission-1').map((event) => event.eventType)).toEqual([
      'MissionPlanCreated',
      'TaskCreated',
      'TaskCreated',
    ]);
  });

  it('fails closed before writing executable state when Governance or Review correlation is invalid', async () => {
    const harness = await createActivationHarness({
      review: reviewSnapshot({
        missionPlanRevision: {
          kind: 'ExecutableMissionPlan',
          revisionId: 'proposed-plan-revision-under-review',
        },
      }),
    });

    await expect(
      harness.activationService.activate({
        proposedMissionPlanId: 'proposed-mission-plan-1',
        proposedPlanRevisionId: 'proposed-plan-revision-governed',
      }),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);
    await expect(
      harness.missionRepository.getMissionPlansByMissionId(MissionId.fromString('mission-1')),
    ).resolves.toEqual([]);
    expect(harness.eventBus.replay('mission-1')).toEqual([]);
  });

  it('rejects Activation when the PlanningCorrelation has no governed revision identity', async () => {
    const harness = await createActivationHarness({ associateGovernedRevision: false });

    await expect(
      harness.activationService.activate({
        proposedMissionPlanId: 'proposed-mission-plan-1',
        proposedPlanRevisionId: 'proposed-plan-revision-governed',
      }),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);
    await expect(
      harness.missionRepository.getMissionPlansByMissionId(MissionId.fromString('mission-1')),
    ).resolves.toEqual([]);
    expect(harness.eventBus.replay('mission-1')).toEqual([]);
  });

  it('rejects Activation by reviewed revision instead of the exact governed successor revision', async () => {
    const harness = await createActivationHarness();

    await expect(
      harness.activationService.activate({
        proposedMissionPlanId: 'proposed-mission-plan-1',
        proposedPlanRevisionId: 'proposed-plan-revision-under-review',
      }),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);
    await expect(
      harness.missionRepository.getMissionPlansByMissionId(MissionId.fromString('mission-1')),
    ).resolves.toEqual([]);
    expect(harness.eventBus.replay('mission-1')).toEqual([]);
  });

  it('rejects Activation when reviewed-to-governed lineage is not a direct successor', async () => {
    const harness = await createActivationHarness({
      proposedMissionPlan: proposedMissionPlanSnapshot({
        revisions: [
          underReviewRevision('proposed-plan-revision-under-review', 1),
          {
            ...governedRevision('proposed-plan-revision-governed'),
            revisionNumber: 3,
          },
        ],
      }),
    });

    await expect(
      harness.activationService.activate({
        proposedMissionPlanId: 'proposed-mission-plan-1',
        proposedPlanRevisionId: 'proposed-plan-revision-governed',
      }),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);
    await expect(
      harness.missionRepository.getMissionPlansByMissionId(MissionId.fromString('mission-1')),
    ).resolves.toEqual([]);
    expect(harness.eventBus.replay('mission-1')).toEqual([]);
  });

  it('rejects cross-Mission lineage at the Activation checkpoint', async () => {
    const harness = await createActivationHarness({
      proposedMissionPlan: proposedMissionPlanSnapshot({
        missionId: 'mission-other',
      }),
    });

    await expect(
      harness.activationService.activate({
        proposedMissionPlanId: 'proposed-mission-plan-1',
        proposedPlanRevisionId: 'proposed-plan-revision-governed',
      }),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);
    await expect(
      harness.missionRepository.getMissionPlansByMissionId(MissionId.fromString('mission-1')),
    ).resolves.toEqual([]);
    expect(harness.eventBus.replay('mission-1')).toEqual([]);
  });

  it('rejects cross-proposal lineage at the Activation checkpoint', async () => {
    const harness = await createActivationHarness({
      correlationProposedMissionPlanId: 'proposed-mission-plan-other',
    });

    await expect(
      harness.activationService.activate({
        proposedMissionPlanId: 'proposed-mission-plan-1',
        proposedPlanRevisionId: 'proposed-plan-revision-governed',
      }),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);
    await expect(
      harness.missionRepository.getMissionPlansByMissionId(MissionId.fromString('mission-1')),
    ).resolves.toEqual([]);
    expect(harness.eventBus.replay('mission-1')).toEqual([]);
  });

  it('rejects Activation when the GovernanceDecision no longer matches correlation lineage', async () => {
    const harness = await createActivationHarness({ governanceDecisionReviewId: 'review-other' });

    await expect(
      harness.activationService.activate({
        proposedMissionPlanId: 'proposed-mission-plan-1',
        proposedPlanRevisionId: 'proposed-plan-revision-governed',
      }),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);
    await expect(
      harness.missionRepository.getMissionPlansByMissionId(MissionId.fromString('mission-1')),
    ).resolves.toEqual([]);
    expect(harness.eventBus.replay('mission-1')).toEqual([]);
  });

  it('publishes no MissionPlan state or events when conversion fails partway through multi-task activation', async () => {
    const harness = await createActivationHarness({
      proposedMissionPlan: proposedMissionPlanSnapshot({
        proposedTasks: [
          {
            id: 'duplicate-task',
            title: 'First task',
            description: 'First task.',
          },
          {
            id: 'duplicate-task',
            title: 'Second task',
            description: 'Second task.',
          },
        ],
      }),
    });

    await expect(
      harness.activationService.activate({
        proposedMissionPlanId: 'proposed-mission-plan-1',
        proposedPlanRevisionId: 'proposed-plan-revision-governed',
      }),
    ).rejects.toThrow();
    await expect(
      harness.missionRepository.getMissionPlansByMissionId(MissionId.fromString('mission-1')),
    ).resolves.toEqual([]);
    expect(harness.eventBus.replay('mission-1')).toEqual([]);
  });

  it('leaves ProposedPlanRevision lifecycle unchanged when the executable MissionPlan commit fails', async () => {
    const missionRepository = new FailingCommitMissionRepository();
    const harness = await createActivationHarness({ missionRepository });

    missionRepository.failNextCommit();

    await expect(
      harness.activationService.activate({
        proposedMissionPlanId: 'proposed-mission-plan-1',
        proposedPlanRevisionId: 'proposed-plan-revision-governed',
      }),
    ).rejects.toThrow('Executable MissionPlan commit failed.');

    const afterFailure = await harness.proposedMissionPlanRepository.getById('proposed-mission-plan-1');
    expect(afterFailure?.toSnapshot().revisions.map((revision) => revision.lifecycleState)).toEqual([
      'Under Review',
      'Governed',
    ]);
    await expect(
      harness.missionRepository.getMissionPlansByMissionId(MissionId.fromString('mission-1')),
    ).resolves.toEqual([]);
    expect(harness.eventBus.replay('mission-1')).toEqual([]);

    const retry = await harness.activationService.activate({
      proposedMissionPlanId: 'proposed-mission-plan-1',
      proposedPlanRevisionId: 'proposed-plan-revision-governed',
    });

    expect(retry.proposedMissionPlan.revisions.map((revision) => revision.lifecycleState)).toEqual([
      'Under Review',
      'Activated',
    ]);
    expect(retry.missionPlan.metadata.proposedPlanRevisionId).toBe(
      'proposed-plan-revision-governed',
    );
  });

  it('rejects a second revision after one sibling activates and supersedes prior Governed revisions', async () => {
    const harness = await createActivationHarness({
      proposedMissionPlan: proposedMissionPlanSnapshot({
        revisions: [
          underReviewRevision('proposed-plan-revision-sibling-under-review', 1),
          governedRevision('proposed-plan-revision-sibling'),
          underReviewRevision('proposed-plan-revision-under-review', 1),
          governedRevision('proposed-plan-revision-governed'),
        ],
      }),
      correlations: ['proposed-plan-revision-sibling', 'proposed-plan-revision-governed'],
    });

    await harness.activationService.activate({
      proposedMissionPlanId: 'proposed-mission-plan-1',
      proposedPlanRevisionId: 'proposed-plan-revision-governed',
    });
    const stored = await harness.proposedMissionPlanRepository.getById('proposed-mission-plan-1');

    expect(stored?.toSnapshot().revisions.map((revision) => revision.lifecycleState)).toContain(
      'Superseded',
    );
    await expect(
      harness.activationService.activate({
        proposedMissionPlanId: 'proposed-mission-plan-1',
        proposedPlanRevisionId: 'proposed-plan-revision-sibling',
      }),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);
  });
});

async function createActivationHarness(
  overrides: {
    readonly proposedMissionPlan?: ProposedMissionPlanSnapshot;
    readonly review?: ReviewSnapshot;
    readonly correlations?: readonly string[];
    readonly missionRepository?: InMemoryMissionRepository;
    readonly associateGovernedRevision?: boolean;
    readonly governanceDecisionReviewId?: string;
    readonly correlationMissionId?: string;
    readonly correlationProposedMissionPlanId?: string;
  } = {},
) {
  const eventBus = new EventBus(new TestLogger());
  const missionRepository = overrides.missionRepository ?? new InMemoryMissionRepository();
  const proposedMissionPlanRepository = new InMemoryProposedMissionPlanRepository();
  const planningCorrelationRepository = new InMemoryPlanningCorrelationRepository();
  const governanceDecisionRepository = new InMemoryGovernanceDecisionRepository();
  const review = overrides.review ?? reviewSnapshot();
  const reviewService: Pick<ReviewServiceContract, 'queryReviewResult'> = {
    async queryReviewResult() {
      return {
        review,
        findings: review.findings,
      };
    },
  };

  await missionRepository.save(
    Mission.create(
      MissionId.fromString('mission-1'),
      MissionObjective.fromString('Activate approved plan.'),
      { eventId: 'event-mission-created', timestamp },
    ),
  );
  await proposedMissionPlanRepository.create(
    ProposedMissionPlan.fromSnapshot(overrides.proposedMissionPlan ?? proposedMissionPlanSnapshot()),
  );

  for (const revisionId of overrides.correlations ?? ['proposed-plan-revision-governed']) {
    await planningCorrelationRepository.register(
      PlanningCorrelation.create({
        id: `planning-correlation-${revisionId}`,
        missionId: overrides.correlationMissionId ?? 'mission-1',
        proposedMissionPlanId:
          overrides.correlationProposedMissionPlanId ?? 'proposed-mission-plan-1',
        reviewedProposedPlanRevisionId: reviewedRevisionIdForGovernedRevision(revisionId),
        plannerAttribution,
        createdAt: timestamp,
      })
        .associateReview('review-1')
        .associateRepositoryPolicy({
          repositoryPolicyId: 'repository-policy-1',
          repositoryPolicyVersion: 1,
        })
        .associateGovernanceDecision('governance-decision-1'),
    );

    if (overrides.associateGovernedRevision !== false) {
      const registeredCorrelation = await planningCorrelationRepository.getById(
        `planning-correlation-${revisionId}`,
      );

      if (registeredCorrelation === undefined) {
        throw new Error(`Expected PlanningCorrelation for '${revisionId}' to be registered.`);
      }

      await planningCorrelationRepository.save(
        registeredCorrelation.associateGovernedProposedPlanRevision(revisionId),
      );
    }
  }

  await governanceDecisionRepository.register(
    GovernanceDecision.create({
      id: 'governance-decision-1',
      missionId: 'mission-1',
      value: 'Approved',
      repositoryPolicyId: 'repository-policy-1',
      repositoryPolicyVersion: 1,
      reviewId: overrides.governanceDecisionReviewId ?? 'review-1',
      reviewStateReference: 'review-1:Completed',
      policyEvaluationId: 'policy-evaluation-1',
      evaluationKey: 'evaluation-1',
      criterionResults: [
        PolicyCriterionResult.create({
          policyCriterionId: 'criterion-1',
          predicateKind: 'ReviewOutcomeMembership',
          predicateSchemaVersion: '1',
          status: 'Satisfied',
          reviewOutcome: 'Accepted',
          explanationCode: 'review.accepted',
        }),
      ],
      evaluatedAt: timestamp,
      explanationCodes: ['review.accepted'],
    }),
  );

  return {
    activationService: new PlanningActivationService(
      proposedMissionPlanRepository,
      planningCorrelationRepository,
      reviewService,
      governanceDecisionRepository,
      missionRepository,
      eventBus,
    ),
    eventBus,
    missionRepository,
    proposedMissionPlanRepository,
  };
}

function proposedMissionPlanSnapshot(
  overrides: {
    readonly id?: string;
    readonly missionId?: string;
    readonly revisions?: ProposedMissionPlanSnapshot['revisions'];
    readonly proposedTasks?: ProposedMissionPlanSnapshot['revisions'][number]['proposedTasks'];
  } = {},
): ProposedMissionPlanSnapshot {
  return {
    id: overrides.id ?? 'proposed-mission-plan-1',
    missionId: overrides.missionId ?? 'mission-1',
    plannerAttribution,
    lifecycleState: 'Governed',
    revisions: overrides.revisions ?? [
      underReviewRevision('proposed-plan-revision-under-review', 1),
      {
        ...governedRevision('proposed-plan-revision-governed'),
        proposedTasks: overrides.proposedTasks ?? governedRevision('x').proposedTasks,
      },
    ],
  };
}

function governedRevision(id: string): ProposedMissionPlanSnapshot['revisions'][number] {
  return {
    id,
    proposedMissionPlanId: 'proposed-mission-plan-1',
    revisionNumber: id === 'proposed-plan-revision-sibling' ? 2 : 2,
    proposedTasks: [
      {
        id: 'proposed-task-1',
        title: 'Implement activation',
        description: 'Convert proposed task one.',
      },
      {
        id: 'proposed-task-2',
        title: 'Validate activation',
        description: 'Convert proposed task two.',
      },
    ],
    proposedTaskDependencies: [
      {
        targetProposedTaskId: 'proposed-task-2',
        prerequisiteProposedTaskId: 'proposed-task-1',
      },
    ],
    plannerAttribution,
    createdAt: timestamp,
    causality: [],
    lifecycleState: 'Governed',
  };
}

function underReviewRevision(
  id: string,
  revisionNumber: number,
): ProposedMissionPlanSnapshot['revisions'][number] {
  return {
    ...governedRevision(id),
    revisionNumber,
    lifecycleState: 'Under Review',
  };
}

function reviewedRevisionIdForGovernedRevision(governedRevisionId: string): string {
  return governedRevisionId === 'proposed-plan-revision-sibling'
    ? 'proposed-plan-revision-sibling-under-review'
    : 'proposed-plan-revision-under-review';
}

function reviewSnapshot(overrides: Partial<ReviewSnapshot> = {}): ReviewSnapshot {
  return {
    id: 'review-1',
    missionId: 'mission-1',
    missionPlanRevision: {
      kind: 'ProposedPlanRevision',
      revisionId: 'proposed-plan-revision-under-review',
    },
    status: 'Completed',
    outcome: 'Accepted',
    reviewCriteria: [{ id: 'criterion-1', description: 'Review proposed plan.' }],
    evidenceReferences: ['evidence-1'],
    findings: [],
    ...overrides,
  };
}
