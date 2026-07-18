import { describe, expect, it } from 'vitest';

import { EngineeringSessionId } from '../../../src/kernel/execution/engineering-session-id';
import { ExecutionSession } from '../../../src/kernel/execution/execution-session';
import { ExecutionSessionId } from '../../../src/kernel/execution/execution-session-id';
import { InvalidExecutionSessionDefinitionError } from '../../../src/kernel/execution/execution-session.errors';

function createExecutionSession(): ExecutionSession {
  return ExecutionSession.create({
    id: ' execution-session-1 ',
    engineeringSessionId: ' engineering-session-1 ',
    assignedRole: ' builder ',
    assignedAdapter: ' mock-adapter ',
    executionTimestamps: {
      startedAt: '2026-07-14T00:00:00.000Z',
      completedAt: '2026-07-14T00:05:00.000Z',
    },
    consumedProjectionVersion: ' projection-version-1 ',
    producedArtifacts: [' src/kernel/execution/execution-session.ts '],
    executionOutcome: ' Completed ',
  });
}

describe('ExecutionSession domain', () => {
  it('constructs immutable append-only sessions with deterministic snapshots and equality', () => {
    const executionSession = createExecutionSession();
    const equivalentExecutionSession = ExecutionSession.fromSnapshot(executionSession.toSnapshot());

    expect(executionSession.toSnapshot()).toEqual({
      id: 'execution-session-1',
      engineeringSessionId: 'engineering-session-1',
      assignedRole: 'builder',
      assignedAdapter: 'mock-adapter',
      executionTimestamps: {
        startedAt: '2026-07-14T00:00:00.000Z',
        completedAt: '2026-07-14T00:05:00.000Z',
      },
      consumedProjectionVersion: 'projection-version-1',
      producedArtifacts: ['src/kernel/execution/execution-session.ts'],
      executionOutcome: 'Completed',
    });
    expect(executionSession.equals(equivalentExecutionSession)).toBe(true);
    expect(ExecutionSessionId.fromString('execution-session-1').equals(executionSession.id)).toBe(
      true,
    );
    expect(
      EngineeringSessionId.fromString('engineering-session-1').equals(
        executionSession.engineeringSessionId,
      ),
    ).toBe(true);
    expect(executionSession.assignedRole.toString()).toBe('builder');
    expect(executionSession.assignedAdapter).toBe('mock-adapter');
    expect(executionSession.executionTimestamps).toEqual({
      startedAt: '2026-07-14T00:00:00.000Z',
      completedAt: '2026-07-14T00:05:00.000Z',
    });
    expect(executionSession.consumedProjectionVersion).toBe('projection-version-1');
    expect(executionSession.producedArtifacts).toEqual([
      'src/kernel/execution/execution-session.ts',
    ]);
    expect(executionSession.executionOutcome).toBe('Completed');
    expect(Object.isFrozen(executionSession)).toBe(true);
    expect(Object.isFrozen(executionSession.toSnapshot())).toBe(true);
    expect(Object.isFrozen(executionSession.toSnapshot().executionTimestamps)).toBe(true);
    expect(Object.isFrozen(executionSession.toSnapshot().producedArtifacts)).toBe(true);
    expect('close' in executionSession).toBe(false);
    expect('save' in executionSession).toBe(false);
  });

  it('produces reproducible state for equivalent construction inputs', () => {
    expect(createExecutionSession().toSnapshot()).toEqual(createExecutionSession().toSnapshot());
  });

  it('rejects invalid session definitions and missing ownership deterministically', () => {
    expect(() =>
      ExecutionSession.create({
        id: '',
        engineeringSessionId: 'engineering-session-1',
        assignedRole: 'builder',
        assignedAdapter: 'mock-adapter',
        executionTimestamps: {
          startedAt: '2026-07-14T00:00:00.000Z',
          completedAt: '2026-07-14T00:05:00.000Z',
        },
        consumedProjectionVersion: 'projection-version-1',
        producedArtifacts: [],
        executionOutcome: 'Completed',
      }),
    ).toThrow(InvalidExecutionSessionDefinitionError);
    expect(() =>
      ExecutionSession.create({
        id: 'execution-session-1',
        engineeringSessionId: '',
        assignedRole: 'builder',
        assignedAdapter: 'mock-adapter',
        executionTimestamps: {
          startedAt: '2026-07-14T00:00:00.000Z',
          completedAt: '2026-07-14T00:05:00.000Z',
        },
        consumedProjectionVersion: 'projection-version-1',
        producedArtifacts: [],
        executionOutcome: 'Completed',
      }),
    ).toThrow(InvalidExecutionSessionDefinitionError);
    expect(() =>
      ExecutionSession.create({
        id: 'execution-session-1',
        engineeringSessionId: 'engineering-session-1',
        assignedRole: ' ',
        assignedAdapter: 'mock-adapter',
        executionTimestamps: {
          startedAt: '2026-07-14T00:00:00.000Z',
          completedAt: '2026-07-14T00:05:00.000Z',
        },
        consumedProjectionVersion: 'projection-version-1',
        producedArtifacts: [],
        executionOutcome: 'Completed',
      }),
    ).toThrow(InvalidExecutionSessionDefinitionError);
    expect(() =>
      ExecutionSession.create({
        id: 'execution-session-1',
        engineeringSessionId: 'engineering-session-1',
        assignedRole: 'builder',
        assignedAdapter: '',
        executionTimestamps: {
          startedAt: '2026-07-14T00:00:00.000Z',
          completedAt: '2026-07-14T00:05:00.000Z',
        },
        consumedProjectionVersion: 'projection-version-1',
        producedArtifacts: [],
        executionOutcome: 'Completed',
      }),
    ).toThrow(InvalidExecutionSessionDefinitionError);
    expect(() =>
      ExecutionSession.create({
        id: 'execution-session-1',
        engineeringSessionId: 'engineering-session-1',
        assignedRole: 'builder',
        assignedAdapter: 'mock-adapter',
        executionTimestamps: {
          startedAt: '',
          completedAt: '2026-07-14T00:05:00.000Z',
        },
        consumedProjectionVersion: 'projection-version-1',
        producedArtifacts: [],
        executionOutcome: 'Completed',
      }),
    ).toThrow(InvalidExecutionSessionDefinitionError);
    expect(() =>
      ExecutionSession.create({
        id: 'execution-session-1',
        engineeringSessionId: 'engineering-session-1',
        assignedRole: 'builder',
        assignedAdapter: 'mock-adapter',
        executionTimestamps: {
          startedAt: '2026-07-14T00:00:00.000Z',
          completedAt: '2026-07-14T00:05:00.000Z',
        },
        consumedProjectionVersion: '',
        producedArtifacts: [],
        executionOutcome: 'Completed',
      }),
    ).toThrow(InvalidExecutionSessionDefinitionError);
    expect(() =>
      ExecutionSession.create({
        id: 'execution-session-1',
        engineeringSessionId: 'engineering-session-1',
        assignedRole: 'builder',
        assignedAdapter: 'mock-adapter',
        executionTimestamps: {
          startedAt: '2026-07-14T00:00:00.000Z',
          completedAt: '2026-07-14T00:05:00.000Z',
        },
        consumedProjectionVersion: 'projection-version-1',
        producedArtifacts: [''],
        executionOutcome: 'Completed',
      }),
    ).toThrow(InvalidExecutionSessionDefinitionError);
    expect(() =>
      ExecutionSession.create({
        id: 'execution-session-1',
        engineeringSessionId: 'engineering-session-1',
        assignedRole: 'builder',
        assignedAdapter: 'mock-adapter',
        executionTimestamps: {
          startedAt: '2026-07-14T00:00:00.000Z',
          completedAt: '2026-07-14T00:05:00.000Z',
        },
        consumedProjectionVersion: 'projection-version-1',
        producedArtifacts: [],
        executionOutcome: '',
      }),
    ).toThrow(InvalidExecutionSessionDefinitionError);
  });
});
