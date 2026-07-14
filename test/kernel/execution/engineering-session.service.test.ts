import { describe, expect, it } from 'vitest';

import {
  EngineeringSessionNotFoundError,
  InvalidEngineeringSessionLifecycleTransitionError,
} from '../../../src/kernel/execution/engineering-session.errors';
import { InMemoryEngineeringSessionRepository } from '../../../src/kernel/execution/engineering-session.repository';
import { EngineeringSessionService } from '../../../src/kernel/execution/engineering-session.service';

describe('EngineeringSessionService', () => {
  it('creates, closes, looks up, and enumerates sessions through repository contracts', async () => {
    const timestamps = [
      '2026-07-14T00:00:00.000Z',
      '2026-07-14T01:00:00.000Z',
    ];
    const service = new EngineeringSessionService(
      new InMemoryEngineeringSessionRepository(),
      () => 'session-1',
      () => {
        const timestamp = timestamps.shift();

        if (timestamp === undefined) {
          throw new Error('No timestamp available for test.');
        }

        return timestamp;
      },
    );

    const created = await service.createEngineeringSession({
      engineeringRuntimeContextReference: 'runtime-context-1',
      activeEngineeringWorkflowReference: 'builder-workflow',
      participatingRoleIds: ['builder', 'reviewer'],
      workflowState: 'active',
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
    const closed = await service.closeEngineeringSession({
      engineeringSessionId: created.id,
    });

    expect(created).toMatchObject({
      id: 'session-1',
      status: 'Open',
      timeline: {
        createdAt: '2026-07-14T00:00:00.000Z',
      },
    });
    expect(closed).toMatchObject({
      id: 'session-1',
      status: 'Closed',
      timeline: {
        closedAt: '2026-07-14T01:00:00.000Z',
      },
    });
    await expect(service.getEngineeringSession('session-1')).resolves.toEqual(closed);
    await expect(service.enumerateEngineeringSessions()).resolves.toEqual([closed]);
  });

  it('reports not-found and invalid-transition diagnostics without hiding domain failures', async () => {
    const service = new EngineeringSessionService(
      new InMemoryEngineeringSessionRepository(),
      () => 'session-1',
      () => '2026-07-14T00:00:00.000Z',
    );

    await expect(service.getEngineeringSession('missing-session')).rejects.toThrow(
      EngineeringSessionNotFoundError,
    );

    await service.createEngineeringSession({
      engineeringRuntimeContextReference: 'runtime-context-1',
      activeEngineeringWorkflowReference: 'builder-workflow',
      participatingRoleIds: ['builder'],
      workflowState: 'active',
    });
    await service.closeEngineeringSession({ engineeringSessionId: 'session-1' });

    await expect(
      service.closeEngineeringSession({ engineeringSessionId: 'session-1' }),
    ).rejects.toThrow(InvalidEngineeringSessionLifecycleTransitionError);
  });
});
