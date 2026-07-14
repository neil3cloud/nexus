import { describe, expect, it } from 'vitest';

import { EngineeringSession } from '../../../src/kernel/execution/engineering-session';
import {
  InvalidEngineeringSessionDefinitionError,
  InvalidEngineeringSessionLifecycleTransitionError,
} from '../../../src/kernel/execution/engineering-session.errors';
import { EngineeringSessionId } from '../../../src/kernel/execution/engineering-session-id';
import { EngineeringSessionStatus } from '../../../src/kernel/execution/engineering-session-status';

function createSession(): EngineeringSession {
  return EngineeringSession.create({
    id: ' session-1 ',
    engineeringRuntimeContextReference: ' runtime-context-1 ',
    activeEngineeringWorkflowReference: ' builder-workflow ',
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
  });
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
      EngineeringSession.create({
        id: '',
        engineeringRuntimeContextReference: 'runtime-context-1',
        activeEngineeringWorkflowReference: 'builder-workflow',
        participatingRoleIds: ['builder'],
        workflowState: 'active',
        timeline: {
          createdAt: '2026-07-14T00:00:00.000Z',
        },
      }),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
    expect(() =>
      EngineeringSession.create({
        id: 'session-1',
        engineeringRuntimeContextReference: 'runtime-context-1',
        activeEngineeringWorkflowReference: 'builder-workflow',
        participatingRoleIds: [],
        workflowState: 'active',
        timeline: {
          createdAt: '2026-07-14T00:00:00.000Z',
        },
      }),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
    expect(() =>
      EngineeringSession.create({
        id: 'session-1',
        engineeringRuntimeContextReference: 'runtime-context-1',
        activeEngineeringWorkflowReference: 'builder-workflow',
        participatingRoleIds: ['builder', 'builder'],
        workflowState: 'active',
        timeline: {
          createdAt: '2026-07-14T00:00:00.000Z',
        },
      }),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
    expect(() =>
      EngineeringSession.create({
        id: 'session-1',
        engineeringRuntimeContextReference: 'runtime-context-1',
        activeEngineeringWorkflowReference: 'builder-workflow',
        participatingRoleIds: ['builder'],
        workflowState: 'active',
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
    ).toThrow(InvalidEngineeringSessionDefinitionError);
    expect(() =>
      EngineeringSession.fromSnapshot({
        ...createSession().toSnapshot(),
        status: 'Closed',
      }),
    ).toThrow(InvalidEngineeringSessionDefinitionError);
  });
});
