import { describe, expect, it } from 'vitest';

import { ExecutionSession } from '../../../src/kernel/execution/execution-session';
import {
  DuplicateExecutionSessionError,
  InvalidExecutionSessionDefinitionError,
} from '../../../src/kernel/execution/execution-session.errors';
import { InMemoryExecutionSessionRepository } from '../../../src/kernel/execution/execution-session.repository';

function createExecutionSession(id: string, engineeringSessionId: string): ExecutionSession {
  return ExecutionSession.create({
    id,
    engineeringSessionId,
    assignedRole: 'builder',
    assignedAdapter: 'mock-adapter',
    executionTimestamps: {
      startedAt: '2026-07-14T00:00:00.000Z',
      completedAt: '2026-07-14T00:05:00.000Z',
    },
    consumedProjectionVersion: 'projection-version-1',
    producedArtifacts: [`artifact-${id}`],
    executionOutcome: 'Completed',
  });
}

describe('InMemoryExecutionSessionRepository', () => {
  it('creates, retrieves, and enumerates ExecutionSessions deterministically by owner', async () => {
    const repository = new InMemoryExecutionSessionRepository();
    const executionSessionB = createExecutionSession('execution-session-b', 'engineering-session-1');
    const executionSessionA = createExecutionSession('execution-session-a', 'engineering-session-1');
    const executionSessionC = createExecutionSession('execution-session-c', 'engineering-session-2');

    await repository.create(executionSessionB);
    await repository.create(executionSessionA);
    await repository.create(executionSessionC);

    expect(await repository.exists('execution-session-a')).toBe(true);
    expect((await repository.getById('execution-session-a'))?.toSnapshot()).toEqual(
      executionSessionA.toSnapshot(),
    );
    expect((await repository.enumerate()).map((session) => session.id.toString())).toEqual([
      'execution-session-a',
      'execution-session-b',
      'execution-session-c',
    ]);
    expect(
      (await repository.enumerate('engineering-session-1')).map((session) => session.id.toString()),
    ).toEqual(['execution-session-a', 'execution-session-b']);
    expect(await repository.enumerate('engineering-session-missing')).toEqual([]);
  });

  it('rejects duplicate ExecutionSession identities', async () => {
    const repository = new InMemoryExecutionSessionRepository();

    await repository.create(createExecutionSession('execution-session-1', 'engineering-session-1'));

    await expect(
      repository.create(createExecutionSession('execution-session-1', 'engineering-session-1')),
    ).rejects.toThrow(DuplicateExecutionSessionError);
  });

  it('rejects repository registration without a valid owning EngineeringSessionId', async () => {
    const repository = new InMemoryExecutionSessionRepository();
    const invalidExecutionSession = {
      toSnapshot: () =>
        Object.freeze({
          id: 'execution-session-1',
          engineeringSessionId: '',
          assignedRole: 'builder',
          assignedAdapter: 'mock-adapter',
          executionTimestamps: Object.freeze({
            startedAt: '2026-07-14T00:00:00.000Z',
            completedAt: '2026-07-14T00:05:00.000Z',
          }),
          consumedProjectionVersion: 'projection-version-1',
          producedArtifacts: Object.freeze([]),
          executionOutcome: 'Completed',
        }),
    } as unknown as ExecutionSession;

    await expect(repository.create(invalidExecutionSession)).rejects.toThrow(
      InvalidExecutionSessionDefinitionError,
    );
  });
});
