import { describe, expect, it } from 'vitest';

import { EventBus } from '../../../src/kernel/events/event-bus';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';
import {
  MissionAlreadyExistsError,
  MissionEventPublisherUnavailableError,
  MissionNotFoundError,
} from '../../../src/kernel/mission/mission.errors';
import { MissionId } from '../../../src/kernel/mission/mission-id';
import { InMemoryMissionRepository } from '../../../src/kernel/mission/mission.repository';
import { MissionService } from '../../../src/kernel/mission/mission.service';

class TestLogger implements KernelLogger {
  public info(): void {}

  public error(): void {}
}

function sequence(values: readonly string[]): () => string {
  let index = 0;

  return () => {
    const value = values[index];

    if (value === undefined) {
      throw new Error('Sequence exhausted.');
    }

    index += 1;

    return value;
  };
}

describe('MissionService', () => {
  it('creates a Mission, saves it, and publishes MissionCreated', async () => {
    const repository = new InMemoryMissionRepository();
    const eventBus = new EventBus(new TestLogger());
    const service = new MissionService(
      repository,
      eventBus,
      sequence(['mission-1', 'event-created']),
      () => '2026-07-12T00:00:00.000Z',
    );

    const mission = await service.createMission({
      objective: 'Implement Mission Foundation',
      correlationId: 'correlation-1',
    });

    expect(mission.toSnapshot()).toEqual({
      id: 'mission-1',
      objective: 'Implement Mission Foundation',
      status: 'Draft',
      latestEventId: 'event-created',
    });
    await expect(repository.exists(mission.id)).resolves.toBe(true);
    expect(eventBus.replay('mission-1')).toEqual([
      {
        eventId: 'event-created',
        missionId: 'mission-1',
        eventType: 'MissionCreated',
        timestamp: '2026-07-12T00:00:00.000Z',
        causality: [],
        correlationId: 'correlation-1',
        attribution: {
          missionId: 'mission-1',
        },
        payload: {
          missionId: 'mission-1',
          objective: 'Implement Mission Foundation',
        },
      },
    ]);
  });

  it('coordinates lifecycle operations through the aggregate and publishes canonical events', async () => {
    const repository = new InMemoryMissionRepository();
    const eventBus = new EventBus(new TestLogger());
    const service = new MissionService(
      repository,
      eventBus,
      sequence([
        'mission-1',
        'event-created',
        'event-planned',
        'event-ready',
        'event-started',
        'event-reviewed',
        'event-completed',
      ]),
      () => '2026-07-12T00:00:00.000Z',
    );

    await service.createMission({ objective: 'Implement Mission Foundation' });
    await service.planMission('mission-1');
    await service.markMissionReady('mission-1');
    await service.startMission('mission-1');
    await service.reviewMission('mission-1');
    const completedMission = await service.completeMission('mission-1');

    expect(completedMission.status).toBe('Completed');
    expect(eventBus.replay('mission-1').map((event) => event.eventType)).toEqual([
      'MissionCreated',
      'MissionPlanned',
      'MissionReady',
      'MissionStarted',
      'MissionReviewed',
      'MissionCompleted',
    ]);
    expect((await repository.getById(completedMission.id))?.status).toBe('Completed');
  });

  it('publishes lifecycle events with causality across repository round trips', async () => {
    const repository = new InMemoryMissionRepository();
    const eventBus = new EventBus(new TestLogger());
    const service = new MissionService(
      repository,
      eventBus,
      sequence([
        'mission-1',
        'event-created',
        'event-planned',
        'event-ready',
        'event-started',
        'event-reviewed',
        'event-completed',
      ]),
      () => '2026-07-12T00:00:00.000Z',
    );

    await service.createMission({ objective: 'Implement Mission Foundation' });
    await service.planMission('mission-1');
    await service.markMissionReady('mission-1');
    await service.startMission('mission-1');
    await service.reviewMission('mission-1');
    await service.completeMission('mission-1');

    expect(
      eventBus.replay('mission-1').map((event) => ({
        eventId: event.eventId,
        eventType: event.eventType,
        causality: event.causality,
      })),
    ).toEqual([
      {
        eventId: 'event-created',
        eventType: 'MissionCreated',
        causality: [],
      },
      {
        eventId: 'event-planned',
        eventType: 'MissionPlanned',
        causality: ['event-created'],
      },
      {
        eventId: 'event-ready',
        eventType: 'MissionReady',
        causality: ['event-planned'],
      },
      {
        eventId: 'event-started',
        eventType: 'MissionStarted',
        causality: ['event-ready'],
      },
      {
        eventId: 'event-reviewed',
        eventType: 'MissionReviewed',
        causality: ['event-started'],
      },
      {
        eventId: 'event-completed',
        eventType: 'MissionCompleted',
        causality: ['event-reviewed'],
      },
    ]);
  });

  it('propagates optional lifecycle correlation and omits correlation when absent', async () => {
    const repository = new InMemoryMissionRepository();
    const eventBus = new EventBus(new TestLogger());
    const service = new MissionService(
      repository,
      eventBus,
      sequence(['mission-1', 'event-created', 'event-planned', 'event-ready']),
      () => '2026-07-12T00:00:00.000Z',
    );

    await service.createMission({ objective: 'Implement Mission Foundation' });
    await service.planMission('mission-1', 'correlation-plan');
    await service.markMissionReady('mission-1');

    const [, plannedEvent, readyEvent] = eventBus.replay('mission-1');

    expect(plannedEvent?.correlationId).toBe('correlation-plan');
    expect(readyEvent).not.toHaveProperty('correlationId');
  });

  it('handles duplicate Mission identity explicitly', async () => {
    const repository = new InMemoryMissionRepository();
    const eventBus = new EventBus(new TestLogger());
    const service = new MissionService(
      repository,
      eventBus,
      sequence(['event-created']),
      () => '2026-07-12T00:00:00.000Z',
    );

    await service.createMission({
      id: 'mission-1',
      objective: 'Implement Mission Foundation',
    });

    await expect(
      service.createMission({
        id: 'mission-1',
        objective: 'Implement Mission Foundation Again',
      }),
    ).rejects.toThrow(MissionAlreadyExistsError);
    expect(eventBus.replay('mission-1').map((event) => event.eventType)).toEqual([
      'MissionCreated',
    ]);
  });

  it('rejects lifecycle updates for unknown Missions', async () => {
    const service = new MissionService(
      new InMemoryMissionRepository(),
      new EventBus(new TestLogger()),
      sequence(['event-started']),
      () => '2026-07-12T00:00:00.000Z',
    );

    await expect(service.startMission('missing-mission')).rejects.toThrow(MissionNotFoundError);
  });

  it('requires an EventBusContract before mutating repository state', async () => {
    const repository = new InMemoryMissionRepository();
    const service = new MissionService(repository, undefined, sequence(['mission-1']));

    await expect(
      service.createMission({
        objective: 'Implement Mission Foundation',
      }),
    ).rejects.toThrow(MissionEventPublisherUnavailableError);
    await expect(repository.exists(MissionId.fromString('mission-1'))).resolves.toBe(false);
  });
});
