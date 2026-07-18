import { describe, expect, it } from 'vitest';

import {
  ExecutionSessionNotFoundError,
  InvalidExecutionSessionDefinitionError,
} from '../../../src/kernel/execution/execution-session.errors';
import { InMemoryExecutionSessionRepository } from '../../../src/kernel/execution/execution-session.repository';
import { ExecutionSessionService } from '../../../src/kernel/execution/execution-session.service';

describe('ExecutionSessionService', () => {
  it('creates, looks up, and enumerates sessions through repository contracts', async () => {
    const service = new ExecutionSessionService(
      new InMemoryExecutionSessionRepository(),
      () => 'execution-session-1',
    );

    const created = await service.createExecutionSession({
      engineeringSessionId: 'engineering-session-1',
      assignedRole: 'builder',
      assignedAdapter: 'mock-adapter',
      startedAt: '2026-07-14T00:00:00.000Z',
      completedAt: '2026-07-14T00:05:00.000Z',
      consumedProjectionVersion: 'projection-version-1',
      producedArtifacts: ['artifact-1'],
      executionOutcome: 'Completed',
    });

    expect(created).toEqual({
      id: 'execution-session-1',
      engineeringSessionId: 'engineering-session-1',
      assignedRole: 'builder',
      assignedAdapter: 'mock-adapter',
      executionTimestamps: {
        startedAt: '2026-07-14T00:00:00.000Z',
        completedAt: '2026-07-14T00:05:00.000Z',
      },
      consumedProjectionVersion: 'projection-version-1',
      producedArtifacts: ['artifact-1'],
      executionOutcome: 'Completed',
    });
    await expect(service.getExecutionSession('execution-session-1')).resolves.toEqual(created);
    await expect(service.enumerateExecutionSessions()).resolves.toEqual([created]);
    await expect(service.enumerateExecutionSessions('engineering-session-1')).resolves.toEqual([
      created,
    ]);
    await expect(service.enumerateExecutionSessions('engineering-session-missing')).resolves.toEqual(
      [],
    );
  });

  it('reports not-found and invalid input without hiding domain failures', async () => {
    const service = new ExecutionSessionService(
      new InMemoryExecutionSessionRepository(),
      () => 'execution-session-1',
    );

    await expect(service.getExecutionSession('missing-execution-session')).rejects.toThrow(
      ExecutionSessionNotFoundError,
    );
    await expect(
      service.createExecutionSession({
        engineeringSessionId: '',
        assignedRole: 'builder',
        assignedAdapter: 'mock-adapter',
        startedAt: '2026-07-14T00:00:00.000Z',
        completedAt: '2026-07-14T00:05:00.000Z',
        consumedProjectionVersion: 'projection-version-1',
        executionOutcome: 'Completed',
      }),
    ).rejects.toThrow(InvalidExecutionSessionDefinitionError);
  });
});
