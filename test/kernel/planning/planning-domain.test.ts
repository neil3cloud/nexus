import { describe, expect, it } from 'vitest';

import { PlanningPolicy } from '../../../src/kernel/planning/planning-policy';
import { PlannerAttribution } from '../../../src/kernel/planning/planner-attribution';
import {
  InvalidPlanningDefinitionError,
  InvalidProposalLifecycleTransitionError,
  StructuralPlanValidationError,
} from '../../../src/kernel/planning/planning.errors';
import { ProposedMissionPlan } from '../../../src/kernel/planning/proposed-mission-plan';
import { ProposedPlanRevision } from '../../../src/kernel/planning/proposed-plan-revision';
import { ProposedTask } from '../../../src/kernel/planning/proposed-task';
import { ProposedTaskDependency } from '../../../src/kernel/planning/proposed-task-dependency';
import type {
  PlanningDiagnosticCode,
  PlannerAttributionInput,
  ProposedMissionPlanInput,
  ProposedPlanRevisionInput,
} from '../../../src/kernel/planning/planning.types';

const humanPlannerAttribution: PlannerAttributionInput = {
  executionRoleId: 'planner',
  actorType: 'Human',
  actorId: 'neil',
  engineeringSessionId: 'engineering-session-1',
  generatedAt: '2026-07-17T00:00:00.000Z',
  causality: ['mission-created'],
  correlationId: 'planning-correlation-1',
};

const adapterPlannerAttribution: PlannerAttributionInput = {
  executionRoleId: 'planner',
  actorType: 'Adapter',
  actorId: 'mock-adapter',
  adapterId: 'mock-adapter',
  engineeringSessionId: 'engineering-session-1',
  executionSessionId: 'execution-session-1',
  generatedAt: '2026-07-17T00:00:00.000Z',
  causality: ['adapter-response'],
  correlationId: 'planning-correlation-2',
};

function createRevisionInput(
  overrides: Partial<ProposedPlanRevisionInput> = {},
): ProposedPlanRevisionInput {
  return {
    id: 'proposed-plan-revision-1',
    proposedMissionPlanId: 'proposed-mission-plan-1',
    revisionNumber: 1,
    proposedTasks: [
      {
        id: 'proposed-task-1',
        title: 'Implement Planning domain',
        description: 'Add non-executable planning model.',
      },
      {
        id: 'proposed-task-2',
        title: 'Validate Planning domain',
        description: 'Add structural validation tests.',
      },
    ],
    proposedTaskDependencies: [
      {
        targetProposedTaskId: 'proposed-task-2',
        prerequisiteProposedTaskId: 'proposed-task-1',
      },
    ],
    plannerAttribution: humanPlannerAttribution,
    createdAt: '2026-07-17T00:00:00.000Z',
    causality: ['mission-created'],
    correlationId: 'revision-correlation-1',
    ...overrides,
  };
}

function createProposedMissionPlanInput(): ProposedMissionPlanInput {
  return {
    id: 'proposed-mission-plan-1',
    missionId: 'mission-1',
    initialRevision: createRevisionInput(),
  };
}

function createPlanningPolicy(): PlanningPolicy {
  return PlanningPolicy.create({
    id: 'planning-policy-1',
    version: '1.0.0',
    maxProposedTaskCount: 5,
    requiredProposedTaskFields: ['title', 'description'],
  });
}

const producedPlanningDiagnosticCodes = [
  'MissingProposedTaskReference',
  'SelfDependency',
  'DuplicateDependency',
  'DependencyCycle',
  'PlanningPolicyViolation',
] as const satisfies readonly PlanningDiagnosticCode[];

describe('Planning domain', () => {
  it('constructs immutable Planning Policy and Planner Attribution value objects', () => {
    const policy = createPlanningPolicy();
    const humanAttribution = PlannerAttribution.create(humanPlannerAttribution);
    const adapterAttribution = PlannerAttribution.create(adapterPlannerAttribution);

    expect(policy.toSnapshot()).toEqual({
      id: 'planning-policy-1',
      version: '1.0.0',
      maxProposedTaskCount: 5,
      requiredProposedTaskFields: ['title', 'description'],
    });
    expect(producedPlanningDiagnosticCodes).toHaveLength(5);
    expect(humanAttribution.toSnapshot()).toEqual({
      executionRoleId: 'planner',
      actorType: 'Human',
      actorId: 'neil',
      engineeringSessionId: 'engineering-session-1',
      generatedAt: '2026-07-17T00:00:00.000Z',
      causality: ['mission-created'],
      correlationId: 'planning-correlation-1',
    });
    expect(adapterAttribution.toSnapshot()).toEqual(adapterPlannerAttribution);
    expect(Object.isFrozen(policy)).toBe(true);
    expect(Object.isFrozen(policy.toSnapshot())).toBe(true);
    expect(Object.isFrozen(policy.toSnapshot().requiredProposedTaskFields)).toBe(true);
    expect(Object.isFrozen(humanAttribution)).toBe(true);
    const adapterAttributionWithoutAdapterId = {
      executionRoleId: 'planner',
      actorType: adapterPlannerAttribution.actorType,
      actorId: 'mock-adapter',
      generatedAt: '2026-07-17T00:00:00.000Z',
    };
    expect(() => PlannerAttribution.create(adapterAttributionWithoutAdapterId)).toThrow(
      InvalidPlanningDefinitionError,
    );
    expect(() =>
      PlannerAttribution.create({
        ...humanPlannerAttribution,
        adapterId: 'mock-adapter',
      }),
    ).toThrow(InvalidPlanningDefinitionError);
  });

  it('constructs Proposed Mission Plans with separate immutable Proposed Task types', () => {
    const proposedTask = ProposedTask.create({
      id: ' proposed-task-1 ',
      title: ' Plan ',
      description: ' Describe ',
    });
    const proposedTaskDependency = ProposedTaskDependency.create({
      targetProposedTaskId: ' proposed-task-2 ',
      prerequisiteProposedTaskId: ' proposed-task-1 ',
    });
    const proposedMissionPlan = ProposedMissionPlan.create(createProposedMissionPlanInput());
    const snapshot = proposedMissionPlan.toSnapshot();

    expect(proposedTask.toSnapshot()).toEqual({
      id: 'proposed-task-1',
      title: 'Plan',
      description: 'Describe',
    });
    expect(proposedTaskDependency.toSnapshot()).toEqual({
      targetProposedTaskId: 'proposed-task-2',
      prerequisiteProposedTaskId: 'proposed-task-1',
    });
    expect(snapshot).toMatchObject({
      id: 'proposed-mission-plan-1',
      missionId: 'mission-1',
      lifecycleState: 'Draft',
    });
    expect(snapshot.revisions).toHaveLength(1);
    expect(snapshot.revisions[0]).toMatchObject({
      id: 'proposed-plan-revision-1',
      proposedMissionPlanId: 'proposed-mission-plan-1',
      revisionNumber: 1,
      lifecycleState: 'Draft',
    });
    expect(Object.isFrozen(proposedTask)).toBe(true);
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.revisions)).toBe(true);
    const initialRevision = snapshot.revisions[0];
    const initialProposedTask = initialRevision?.proposedTasks[0];
    expect(initialRevision).toBeDefined();
    expect(initialProposedTask).toBeDefined();
    expect('parentMissionPlanId' in Object(initialProposedTask)).toBe(false);
    expect('status' in Object(initialProposedTask)).toBe(false);
  });

  it('validates structural plan failures deterministically', () => {
    const missingReferenceRevision = ProposedPlanRevision.create(
      createRevisionInput({
        proposedTaskDependencies: [
          {
            targetProposedTaskId: 'proposed-task-2',
            prerequisiteProposedTaskId: 'missing-task',
          },
        ],
      }),
    );
    const selfDependencyRevision = ProposedPlanRevision.create(
      createRevisionInput({
        proposedTaskDependencies: [
          {
            targetProposedTaskId: 'proposed-task-1',
            prerequisiteProposedTaskId: 'proposed-task-1',
          },
        ],
      }),
    );
    const duplicateDependencyRevision = ProposedPlanRevision.create(
      createRevisionInput({
        proposedTaskDependencies: [
          {
            targetProposedTaskId: 'proposed-task-2',
            prerequisiteProposedTaskId: 'proposed-task-1',
          },
          {
            targetProposedTaskId: 'proposed-task-2',
            prerequisiteProposedTaskId: 'proposed-task-1',
          },
        ],
      }),
    );
    const cycleRevision = ProposedPlanRevision.create(
      createRevisionInput({
        proposedTasks: [
          {
            id: 'proposed-task-1',
            title: 'One',
            description: 'One.',
          },
          {
            id: 'proposed-task-2',
            title: 'Two',
            description: 'Two.',
          },
          {
            id: 'proposed-task-3',
            title: 'Three',
            description: 'Three.',
          },
        ],
        proposedTaskDependencies: [
          {
            targetProposedTaskId: 'proposed-task-2',
            prerequisiteProposedTaskId: 'proposed-task-1',
          },
          {
            targetProposedTaskId: 'proposed-task-3',
            prerequisiteProposedTaskId: 'proposed-task-2',
          },
          {
            targetProposedTaskId: 'proposed-task-1',
            prerequisiteProposedTaskId: 'proposed-task-3',
          },
        ],
      }),
    );

    expect(missingReferenceRevision.validateStructure()).toMatchObject([
      { code: 'MissingProposedTaskReference' },
    ]);
    expect(selfDependencyRevision.validateStructure()).toContainEqual(
      expect.objectContaining({ code: 'SelfDependency' }),
    );
    expect(duplicateDependencyRevision.validateStructure()).toContainEqual(
      expect.objectContaining({ code: 'DuplicateDependency' }),
    );
    expect(cycleRevision.validateStructure()).toContainEqual(
      expect.objectContaining({ code: 'DependencyCycle' }),
    );
    expect(() => cycleRevision.assertStructurallyValid()).toThrow(StructuralPlanValidationError);
  });

  it('enforces Draft, Submitted, and Withdrawn lifecycle transitions through new revisions', () => {
    const proposedMissionPlan = ProposedMissionPlan.create(createProposedMissionPlanInput());
    const submittedMissionPlan = proposedMissionPlan.submitCurrentRevision(
      {
        id: 'proposed-plan-revision-2',
        plannerAttribution: humanPlannerAttribution,
        createdAt: '2026-07-17T01:00:00.000Z',
      },
      createPlanningPolicy(),
    );
    const withdrawnMissionPlan = submittedMissionPlan.withdrawCurrentRevision({
      id: 'proposed-plan-revision-3',
      plannerAttribution: humanPlannerAttribution,
      createdAt: '2026-07-17T02:00:00.000Z',
    });

    expect(proposedMissionPlan.lifecycleState).toBe('Draft');
    expect(submittedMissionPlan.lifecycleState).toBe('Submitted');
    expect(withdrawnMissionPlan.lifecycleState).toBe('Withdrawn');
    expect(submittedMissionPlan.toSnapshot().revisions.map((revision) => revision.lifecycleState)).toEqual([
      'Draft',
      'Submitted',
    ]);
    expect(withdrawnMissionPlan.toSnapshot().revisions.map((revision) => revision.revisionNumber)).toEqual([
      1,
      2,
      3,
    ]);
    expect(() =>
      withdrawnMissionPlan.appendRevision({
        id: 'proposed-plan-revision-4',
        proposedTasks: [],
        proposedTaskDependencies: [],
        plannerAttribution: humanPlannerAttribution,
        createdAt: '2026-07-17T03:00:00.000Z',
      }),
    ).toThrow(InvalidProposalLifecycleTransitionError);
    expect(() =>
      ProposedPlanRevision.create(createRevisionInput({ lifecycleState: 'Withdrawn' })).transitionTo(
        'Submitted',
      ),
    ).toThrow(InvalidProposalLifecycleTransitionError);
  });

  it('transitions a Submitted ProposedPlanRevision to Under Review at the aggregate level', () => {
    const submittedMissionPlan = ProposedMissionPlan.create(
      createProposedMissionPlanInput(),
    ).submitCurrentRevision(
      {
        id: 'proposed-plan-revision-2',
        plannerAttribution: humanPlannerAttribution,
        createdAt: '2026-07-17T01:00:00.000Z',
      },
      createPlanningPolicy(),
    );
    const underReviewMissionPlan = submittedMissionPlan.markCurrentRevisionUnderReview({
      id: 'proposed-plan-revision-3',
      plannerAttribution: humanPlannerAttribution,
      createdAt: '2026-07-17T02:00:00.000Z',
    });

    expect(underReviewMissionPlan.lifecycleState).toBe('Under Review');
    expect(underReviewMissionPlan.toSnapshot().revisions.map((revision) => revision.lifecycleState)).toEqual([
      'Draft',
      'Submitted',
      'Under Review',
    ]);
  });

  it('supports additive Governed and Rejected Proposal Lifecycle transitions', () => {
    const governedMissionPlan = ProposedMissionPlan.create(createProposedMissionPlanInput())
      .submitCurrentRevision(
        {
          id: 'proposed-plan-revision-2',
          plannerAttribution: humanPlannerAttribution,
          createdAt: '2026-07-17T01:00:00.000Z',
        },
        createPlanningPolicy(),
      )
      .markCurrentRevisionUnderReview({
        id: 'proposed-plan-revision-3',
        plannerAttribution: humanPlannerAttribution,
        createdAt: '2026-07-17T02:00:00.000Z',
      })
      .markCurrentRevisionGoverned({
        id: 'proposed-plan-revision-4',
        plannerAttribution: humanPlannerAttribution,
        createdAt: '2026-07-17T03:00:00.000Z',
      });
    const rejectedMissionPlan = governedMissionPlan.rejectCurrentRevision({
      id: 'proposed-plan-revision-5',
      plannerAttribution: humanPlannerAttribution,
      createdAt: '2026-07-17T04:00:00.000Z',
    });
    const reviewRejectedMissionPlan = ProposedMissionPlan.create(createProposedMissionPlanInput())
      .submitCurrentRevision(
        {
          id: 'proposed-plan-revision-2',
          plannerAttribution: humanPlannerAttribution,
          createdAt: '2026-07-17T01:00:00.000Z',
        },
        createPlanningPolicy(),
      )
      .markCurrentRevisionUnderReview({
        id: 'proposed-plan-revision-3',
        plannerAttribution: humanPlannerAttribution,
        createdAt: '2026-07-17T02:00:00.000Z',
      })
      .rejectCurrentRevision({
        id: 'proposed-plan-revision-4',
        plannerAttribution: humanPlannerAttribution,
        createdAt: '2026-07-17T03:00:00.000Z',
      });

    expect(governedMissionPlan.lifecycleState).toBe('Governed');
    expect(rejectedMissionPlan.lifecycleState).toBe('Rejected');
    expect(reviewRejectedMissionPlan.lifecycleState).toBe('Rejected');
    expect(() =>
      ProposedMissionPlan.create(createProposedMissionPlanInput()).markCurrentRevisionGoverned({
        id: 'proposed-plan-revision-2',
        plannerAttribution: humanPlannerAttribution,
        createdAt: '2026-07-17T01:00:00.000Z',
      }),
    ).toThrow(InvalidProposalLifecycleTransitionError);
  });

  it('rejects new ProposedPlanRevision creation when the current revision is Withdrawn', () => {
    const withdrawnMissionPlan = ProposedMissionPlan.create(createProposedMissionPlanInput())
      .submitCurrentRevision(
        {
          id: 'proposed-plan-revision-2',
          plannerAttribution: humanPlannerAttribution,
          createdAt: '2026-07-17T01:00:00.000Z',
        },
        createPlanningPolicy(),
      )
      .withdrawCurrentRevision({
        id: 'proposed-plan-revision-3',
        plannerAttribution: humanPlannerAttribution,
        createdAt: '2026-07-17T02:00:00.000Z',
      });

    const createRevisionAfterWithdrawn = () =>
      withdrawnMissionPlan.appendRevision({
        id: 'proposed-plan-revision-4',
        proposedTasks: [],
        proposedTaskDependencies: [],
        plannerAttribution: humanPlannerAttribution,
        createdAt: '2026-07-17T03:00:00.000Z',
      });

    expect(withdrawnMissionPlan.lifecycleState).toBe('Withdrawn');
    expect(createRevisionAfterWithdrawn).toThrow(InvalidProposalLifecycleTransitionError);
    expect(createRevisionAfterWithdrawn).toThrow(
      "ProposedMissionPlan 'proposed-mission-plan-1' cannot create a new ProposedPlanRevision after Withdrawn.",
    );
  });

  it('rejects new ProposedPlanRevision creation when the current revision is Rejected', () => {
    const rejectedMissionPlan = ProposedMissionPlan.create(createProposedMissionPlanInput())
      .submitCurrentRevision(
        {
          id: 'proposed-plan-revision-2',
          plannerAttribution: humanPlannerAttribution,
          createdAt: '2026-07-17T01:00:00.000Z',
        },
        createPlanningPolicy(),
      )
      .markCurrentRevisionUnderReview({
        id: 'proposed-plan-revision-3',
        plannerAttribution: humanPlannerAttribution,
        createdAt: '2026-07-17T02:00:00.000Z',
      })
      .rejectCurrentRevision({
        id: 'proposed-plan-revision-4',
        plannerAttribution: humanPlannerAttribution,
        createdAt: '2026-07-17T03:00:00.000Z',
      });

    const createRevisionAfterRejected = () =>
      rejectedMissionPlan.appendRevision({
        id: 'proposed-plan-revision-5',
        proposedTasks: [],
        proposedTaskDependencies: [],
        plannerAttribution: humanPlannerAttribution,
        createdAt: '2026-07-17T04:00:00.000Z',
      });

    expect(rejectedMissionPlan.lifecycleState).toBe('Rejected');
    expect(createRevisionAfterRejected).toThrow(InvalidProposalLifecycleTransitionError);
    expect(createRevisionAfterRejected).toThrow(
      "ProposedMissionPlan 'proposed-mission-plan-1' cannot create a new ProposedPlanRevision after Rejected.",
    );
  });

  it('rejects an aggregate-level Under Review transition from Draft', () => {
    const proposedMissionPlan = ProposedMissionPlan.create(createProposedMissionPlanInput());

    expect(() =>
      proposedMissionPlan.markCurrentRevisionUnderReview({
        id: 'proposed-plan-revision-2',
        plannerAttribution: humanPlannerAttribution,
        createdAt: '2026-07-17T01:00:00.000Z',
      }),
    ).toThrow(InvalidProposalLifecycleTransitionError);
  });

  it('rejects an aggregate-level Under Review transition from Withdrawn', () => {
    const withdrawnMissionPlan = ProposedMissionPlan.create(createProposedMissionPlanInput())
      .submitCurrentRevision(
        {
          id: 'proposed-plan-revision-2',
          plannerAttribution: humanPlannerAttribution,
          createdAt: '2026-07-17T01:00:00.000Z',
        },
        createPlanningPolicy(),
      )
      .withdrawCurrentRevision({
        id: 'proposed-plan-revision-3',
        plannerAttribution: humanPlannerAttribution,
        createdAt: '2026-07-17T02:00:00.000Z',
      });

    expect(() =>
      withdrawnMissionPlan.markCurrentRevisionUnderReview({
        id: 'proposed-plan-revision-4',
        plannerAttribution: humanPlannerAttribution,
        createdAt: '2026-07-17T03:00:00.000Z',
      }),
    ).toThrow(InvalidProposalLifecycleTransitionError);
  });

  it('runs Structural Plan Validation and Planning Policy before submission', () => {
    const proposedMissionPlan = ProposedMissionPlan.create({
      id: 'proposed-mission-plan-1',
      missionId: 'mission-1',
      initialRevision: createRevisionInput({
        proposedTaskDependencies: [
          {
            targetProposedTaskId: 'proposed-task-2',
            prerequisiteProposedTaskId: 'missing-task',
          },
        ],
      }),
    });

    expect(() =>
      proposedMissionPlan.submitCurrentRevision(
        {
          id: 'proposed-plan-revision-2',
          plannerAttribution: humanPlannerAttribution,
          createdAt: '2026-07-17T01:00:00.000Z',
        },
        createPlanningPolicy(),
      ),
    ).toThrow(StructuralPlanValidationError);

    expect(() =>
      ProposedMissionPlan.create(createProposedMissionPlanInput()).submitCurrentRevision(
        {
          id: 'proposed-plan-revision-2',
          plannerAttribution: humanPlannerAttribution,
          createdAt: '2026-07-17T01:00:00.000Z',
        },
        PlanningPolicy.create({
          id: 'planning-policy-1',
          version: '1.0.0',
          maxProposedTaskCount: 1,
        }),
      ),
    ).toThrow(StructuralPlanValidationError);
  });
});
