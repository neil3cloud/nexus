import { describe, expect, it } from 'vitest';

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

const workflowChain = WorkflowChain.create({
  id: 'workflow-chain-1',
  steps: [{ roleId: 'builder' }, { roleId: 'reviewer' }],
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
