import { describe, expect, it } from 'vitest';

import { AdvancementTrigger } from '../../../src/kernel/execution/advancement-trigger';
import { EngineeringSession } from '../../../src/kernel/execution/engineering-session';
import {
  InvalidEngineeringSessionDefinitionError,
  InvalidEngineeringSessionLifecycleTransitionError,
} from '../../../src/kernel/execution/engineering-session.errors';
import { EngineeringSessionId } from '../../../src/kernel/execution/engineering-session-id';
import { EngineeringSessionStatus } from '../../../src/kernel/execution/engineering-session-status';
import type { EngineeringSessionInput } from '../../../src/kernel/execution/engineering-session.types';
import { WorkflowChain } from '../../../src/kernel/execution/workflow-chain';
import { WorkflowChainId } from '../../../src/kernel/execution/workflow-chain-id';
import { ReviewOutcome } from '../../../src/kernel/review/review-values';

const workflowChain = WorkflowChain.create({
  id: 'workflow-chain-1',
  steps: [{ roleId: 'builder' }, { roleId: 'reviewer' }],
});
const advancementTrigger = AdvancementTrigger.create({
  fact: 'workflow-position-eligible',
});

function createSession(): EngineeringSession {
  return EngineeringSession.create({
    id: ' session-1 ',
    engineeringRuntimeContextReference: ' runtime-context-1 ',
    activeEngineeringWorkflowReference: ' builder-workflow ',
    workflowChainId: ' workflow-chain-1 ',
    currentWorkflowStepId: ' 0 ',
    participatingRoleIds: ['reviewer', 'builder'],
    workflowState: 'active',
    timeline: {
      createdAt: '2026-07-14T00:00:00.000Z',
    },
    diagnostics: [
      {
        code: 'session-created',
        message: 'Session created.',
        recordedAt: '2026-07-14T00:00:00.000Z',
      },
    ],
    collaborationMetadata: {
      pair: 'human-builder',
    },
  }, workflowChain);
}

function createSessionInput(
  overrides: Partial<EngineeringSessionInput> = {},
): EngineeringSessionInput {
  return {
    id: 'session-1',
    engineeringRuntimeContextReference: 'runtime-context-1',
    activeEngineeringWorkflowReference: 'builder-workflow',
    workflowChainId: 'workflow-chain-1',
    currentWorkflowStepId: '0',
    participatingRoleIds: ['builder'],
    workflowState: 'active',
    timeline: {
      createdAt: '2026-07-14T00:00:00.000Z',
    },
    ...overrides,
  };
}

describe('EngineeringSession domain', () => {
  it('constructs immutable sessions with deterministic snapshots and equality', () => {
    const session = createSession();
    const equivalentSession = EngineeringSession.fromSnapshot(session.toSnapshot());

    expect(session.toSnapshot()).toEqual({
      id: 'session-1',
      status: 'Open',
      engineeringRuntimeContextReference: 'runtime-context-1',
      activeEngineeringWorkflowReference: 'builder-workflow',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '0',
      participatingRoleIds: ['builder', 'reviewer'],
      workflowState: 'active',
      timeline: {
        createdAt: '2026-07-14T00:00:00.000Z',
        statusTransitions: [
          {
            status: 'Open',
            occurredAt: '2026-07-14T00:00:00.000Z',
          },
        ],
      },
      diagnostics: [
        {
          code: 'session-created',
          message: 'Session created.',
          recordedAt: '2026-07-14T00:00:00.000Z',
        },
      ],
      collaborationMetadata: {
        pair: 'human-builder',
      },
    });
    expect(session.equals(equivalentSession)).toBe(true);
    expect(EngineeringSessionId.fromString('session-1').equals(session.id)).toBe(true);
    expect(EngineeringSessionStatus.open().equals(session.status)).toBe(true);
    expect(session.engineeringRuntimeContextReference).toBe('runtime-context-1');
    expect(session.activeEngineeringWorkflowReference).toBe('builder-workflow');
    expect(WorkflowChainId.fromString('workflow-chain-1').equals(session.workflowChainId)).toBe(true);
    expect(session.currentWorkflowStepId).toBe('0');
    expect(session.participatingRoleIds.map((roleId) => roleId.toString())).toEqual([
      'builder',
      'reviewer',
    ]);
    expect(Object.isFrozen(session.toSnapshot())).toBe(true);
    expect(Object.isFrozen(session.toSnapshot().timeline)).toBe(true);
    expect(Object.isFrozen(session.toSnapshot().timeline.statusTransitions)).toBe(true);
    expect(Object.isFrozen(session.toSnapshot().diagnostics)).toBe(true);
    expect(Object.isFrozen(session.toSnapshot().collaborationMetadata)).toBe(true);
  });

  it('closes open sessions and rejects terminal lifecycle transitions', () => {
    const session = createSession();

    session.close('2026-07-14T01:00:00.000Z');

    expect(session.toSnapshot()).toMatchObject({
      status: 'Closed',
      timeline: {
        createdAt: '2026-07-14T00:00:00.000Z',
        closedAt: '2026-07-14T01:00:00.000Z',
        statusTransitions: [
          {
            status: 'Open',
            occurredAt: '2026-07-14T00:00:00.000Z',
          },
          {
            status: 'Closed',
            occurredAt: '2026-07-14T01:00:00.000Z',
          },
        ],
      },
    });
    expect(EngineeringSessionStatus.closed().equals(session.status)).toBe(true);
    expect(() => session.close('2026-07-14T02:00:00.000Z')).toThrow(
      InvalidEngineeringSessionLifecycleTransitionError,
    );
  });

  it('advances exactly one WorkflowStep per invocation and detects terminal completion', () => {
    const session = createSession();

    expect(session.executeCurrentWorkflowStep(workflowChain)).toEqual({
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '0',
      roleId: 'builder',
    });
    expect(session.isWorkflowComplete(workflowChain)).toBe(false);

    session.advanceWorkflow(workflowChain);

    expect(session.currentWorkflowStepId).toBe('1');
    expect(session.executeCurrentWorkflowStep(workflowChain)).toEqual({
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '1',
      roleId: 'reviewer',
    });
    expect(session.toSnapshot()).toMatchObject({
      currentWorkflowStepId: '1',
      status: 'Open',
    });
    expect(session.isWorkflowComplete(workflowChain)).toBe(true);
  });

  it('advances on an AdvancementTrigger using existing Workflow Advancement semantics', () => {
    const session = createSession();

    session.advanceWorkflowOnTrigger(advancementTrigger, workflowChain);

    expect(session.toSnapshot()).toMatchObject({
      currentWorkflowStepId: '1',
      status: 'Open',
    });
    expect(session.isWorkflowComplete(workflowChain)).toBe(true);
  });

  it('advances after Non-Blocking Review Outcomes using existing Workflow Advancement semantics', () => {
    for (const outcome of ['Accepted', 'Accepted With Observations']) {
      const session = createSession();

      session.advanceWorkflowAfterReview(ReviewOutcome.fromString(outcome), workflowChain);

      expect(session.toSnapshot()).toMatchObject({
        currentWorkflowStepId: '1',
        status: 'Open',
      });
      expect(session.isWorkflowComplete(workflowChain)).toBe(true);
    }
  });

  it('rejects Blocking Review Outcomes without changing workflow position', () => {
    for (const outcome of ['Action Required', 'Rejected']) {
      const session = createSession();

      expect(() =>
        session.advanceWorkflowAfterReview(ReviewOutcome.fromString(outcome), workflowChain),
      ).toThrow(InvalidEngineeringSessionDefinitionError);
      expect(session.currentWorkflowStepId).toBe('0');
    }
  });

  it('rejects advancement beyond the terminal WorkflowStep', () => {
    const session = EngineeringSession.create(
      createSessionInput({ currentWorkflowStepId: '1' }),
      workflowChain,
    );

    expect(session.isWorkflowComplete(workflowChain)).toBe(true);
    expect(() => session.advanceWorkflow(workflowChain)).toThrow(
      InvalidEngineeringSessionDefinitionError,
    );
    expect(session.currentWorkflowStepId).toBe('1');
  });

  it('rejects trigger advancement using the same ineligible Advancement Failure semantics', () => {
    const terminalSession = EngineeringSession.create(
      createSessionInput({ currentWorkflowStepId: '1' }),
      workflowChain,
    );
    const invalidCurrentStepSession = EngineeringSession.fromSnapshot({
      ...createSession().toSnapshot(),
      currentWorkflowStepId: '2',
    });
    const mismatchedWorkflowChain = WorkflowChain.create({
      id: 'workflow-chain-2',
      steps: [{ roleId: 'builder' }, { roleId: 'reviewer' }],
    });

    expect(() => createSession().advanceWorkflowOnTrigger(advancementTrigger, undefined)).toThrow(
      InvalidEngineeringSessionDefinitionError,
    );
    expect(() => terminalSession.advanceWorkflowOnTrigger(advancementTrigger, workflowChain)).toThrow(
      InvalidEngineeringSessionDefinitionError,
    );
    expect(() =>
      invalidCurrentStepSession.advanceWorkflowOnTrigger(advancementTrigger, workflowChain),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
    expect(() =>
      createSession().advanceWorkflowOnTrigger(advancementTrigger, mismatchedWorkflowChain),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
    expect(terminalSession.currentWorkflowStepId).toBe('1');
    expect(invalidCurrentStepSession.currentWorkflowStepId).toBe('2');
  });

  it('rejects review-gated advancement using the same ineligible Advancement Failure semantics', () => {
    const acceptedOutcome = ReviewOutcome.fromString('Accepted');
    const terminalSession = EngineeringSession.create(
      createSessionInput({ currentWorkflowStepId: '1' }),
      workflowChain,
    );
    const invalidCurrentStepSession = EngineeringSession.fromSnapshot({
      ...createSession().toSnapshot(),
      currentWorkflowStepId: '2',
    });
    const mismatchedWorkflowChain = WorkflowChain.create({
      id: 'workflow-chain-2',
      steps: [{ roleId: 'builder' }, { roleId: 'reviewer' }],
    });

    expect(() => createSession().advanceWorkflowAfterReview(acceptedOutcome, undefined)).toThrow(
      InvalidEngineeringSessionDefinitionError,
    );
    expect(() =>
      terminalSession.advanceWorkflowAfterReview(acceptedOutcome, workflowChain),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
    expect(() =>
      invalidCurrentStepSession.advanceWorkflowAfterReview(acceptedOutcome, workflowChain),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
    expect(() =>
      createSession().advanceWorkflowAfterReview(acceptedOutcome, mismatchedWorkflowChain),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
    expect(terminalSession.currentWorkflowStepId).toBe('1');
    expect(invalidCurrentStepSession.currentWorkflowStepId).toBe('2');
  });

  it('rejects advancement from invalid or unbound workflow positions', () => {
    const invalidCurrentStepSession = EngineeringSession.fromSnapshot({
      ...createSession().toSnapshot(),
      currentWorkflowStepId: '2',
    });
    const mismatchedWorkflowChain = WorkflowChain.create({
      id: 'workflow-chain-2',
      steps: [{ roleId: 'builder' }, { roleId: 'reviewer' }],
    });

    expect(() => createSession().advanceWorkflow(undefined)).toThrow(
      InvalidEngineeringSessionDefinitionError,
    );
    expect(() => invalidCurrentStepSession.advanceWorkflow(workflowChain)).toThrow(
      InvalidEngineeringSessionDefinitionError,
    );
    expect(() => createSession().advanceWorkflow(mismatchedWorkflowChain)).toThrow(
      InvalidEngineeringSessionDefinitionError,
    );
  });

  it('advances deterministically for equivalent workflow inputs', () => {
    const left = createSession();
    const right = EngineeringSession.fromSnapshot(createSession().toSnapshot());

    left.advanceWorkflow(workflowChain);
    right.advanceWorkflow(workflowChain);

    expect(left.toSnapshot()).toEqual(right.toSnapshot());
    expect(left.equals(right)).toBe(true);
  });

  it('advances deterministically for equivalent trigger and EngineeringSession state', () => {
    const left = createSession();
    const right = EngineeringSession.fromSnapshot(createSession().toSnapshot());
    const leftTrigger = AdvancementTrigger.create({
      fact: 'workflow-position-eligible',
    });
    const rightTrigger = AdvancementTrigger.fromSnapshot(leftTrigger.toSnapshot());

    left.advanceWorkflowOnTrigger(leftTrigger, workflowChain);
    right.advanceWorkflowOnTrigger(rightTrigger, workflowChain);

    expect(left.toSnapshot()).toEqual(right.toSnapshot());
    expect(left.equals(right)).toBe(true);
  });

  it('advances deterministically for equivalent ReviewOutcome and EngineeringSession state', () => {
    const left = createSession();
    const right = EngineeringSession.fromSnapshot(createSession().toSnapshot());
    const leftOutcome = ReviewOutcome.fromString('Accepted With Observations');
    const rightOutcome = ReviewOutcome.fromString(leftOutcome.toString());

    left.advanceWorkflowAfterReview(leftOutcome, workflowChain);
    right.advanceWorkflowAfterReview(rightOutcome, workflowChain);

    expect(left.toSnapshot()).toEqual(right.toSnapshot());
    expect(left.equals(right)).toBe(true);
  });

  it('rejects review-gated advancement deterministically for equivalent Blocking Review Outcomes', () => {
    const left = createSession();
    const right = EngineeringSession.fromSnapshot(createSession().toSnapshot());

    expect(() =>
      left.advanceWorkflowAfterReview(ReviewOutcome.fromString('Rejected'), workflowChain),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
    expect(() =>
      right.advanceWorkflowAfterReview(ReviewOutcome.fromString('Rejected'), workflowChain),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
    expect(left.toSnapshot()).toEqual(right.toSnapshot());
  });

  it('rejects invalid session definitions deterministically', () => {
    expect(() =>
      EngineeringSession.create(createSessionInput({ id: '' }), workflowChain),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
    expect(() =>
      EngineeringSession.create(createSessionInput({ participatingRoleIds: [] }), workflowChain),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
    expect(() =>
      EngineeringSession.create(
        createSessionInput({ participatingRoleIds: ['builder', 'builder'] }),
        workflowChain,
      ),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
    expect(() =>
      EngineeringSession.create(
        createSessionInput({
          timeline: {
          createdAt: '2026-07-14T00:00:00.000Z',
          statusTransitions: [
            {
              status: 'Closed',
              occurredAt: '2026-07-14T00:00:00.000Z',
            },
          ],
          closedAt: '2026-07-14T00:00:00.000Z',
        },
        }),
        workflowChain,
      ),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
    expect(() =>
      EngineeringSession.fromSnapshot({
        ...createSession().toSnapshot(),
        status: 'Closed',
      }),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
  });

  it('validates WorkflowChain binding at construction', () => {
    expect(createSession().toSnapshot()).toMatchObject({
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '0',
    });
    expect(() =>
      EngineeringSession.create(createSessionInput(), undefined),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
    expect(() =>
      EngineeringSession.create(createSessionInput({ workflowChainId: 'missing-chain' }), workflowChain),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
    expect(() =>
      EngineeringSession.create(createSessionInput({ currentWorkflowStepId: '2' }), workflowChain),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
    expect(() =>
      EngineeringSession.create(
        createSessionInput({
          currentWorkflowStepId: '0',
        }),
        WorkflowChain.create({
          id: 'workflow-chain-1',
          steps: [{ roleId: 'documentation-reviewer' }, { roleId: 'reviewer' }],
        }),
      ),
    ).not.toThrow();
    expect(() =>
      EngineeringSession.create(createSessionInput({ currentWorkflowStepId: '-1' }), workflowChain),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
    expect(() =>
      EngineeringSession.create(createSessionInput({ currentWorkflowStepId: 'builder' }), workflowChain),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
  });

  it('binds repeated-role WorkflowChain positions independently', () => {
    const repeatedRoleWorkflowChain = WorkflowChain.create({
      id: 'workflow-chain-1',
      steps: [{ roleId: 'builder' }, { roleId: 'reviewer' }, { roleId: 'builder' }],
    });

    expect(
      EngineeringSession.create(
        createSessionInput({ id: 'session-position-0', currentWorkflowStepId: '0' }),
        repeatedRoleWorkflowChain,
      ).toSnapshot(),
    ).toMatchObject({
      currentWorkflowStepId: '0',
    });
    expect(
      EngineeringSession.create(
        createSessionInput({ id: 'session-position-1', currentWorkflowStepId: '1' }),
        repeatedRoleWorkflowChain,
      ).toSnapshot(),
    ).toMatchObject({
      currentWorkflowStepId: '1',
    });
    expect(
      EngineeringSession.create(
        createSessionInput({ id: 'session-position-2', currentWorkflowStepId: '2' }),
        repeatedRoleWorkflowChain,
      ).toSnapshot(),
    ).toMatchObject({
      currentWorkflowStepId: '2',
    });
  });
});
