import { describe, expect, it } from 'vitest';

import { EventBus } from '../../../src/kernel/events/event-bus';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';
import { Mission } from '../../../src/kernel/mission/mission.aggregate';
import { MissionPlan } from '../../../src/kernel/mission/mission-plan.aggregate';
import {
  MissionAlreadyPlannedError,
  MissionPlanningEventPublisherUnavailableError,
  MissionPlanAlreadyExistsError,
  MissionPlanNotFoundError,
  MissionPlanningTerminalMissionError,
  MissionPlanningValidationError,
  MissionNotFoundError,
} from '../../../src/kernel/mission/mission.errors';
import { MissionId } from '../../../src/kernel/mission/mission-id';
import { MissionObjective } from '../../../src/kernel/mission/mission-objective';
import { MissionPlanId } from '../../../src/kernel/mission/mission-plan-id';
import { MissionPlanningService } from '../../../src/kernel/mission/mission-planning.service';
import { InMemoryMissionRepository } from '../../../src/kernel/mission/mission.repository';
import type { TaskSnapshot } from '../../../src/kernel/mission/mission-planning.types';
import type { DomainEventMetadata } from '../../../src/kernel/mission/mission.types';

const timestamp = '2026-07-12T00:00:00.000Z';

class TestLogger implements KernelLogger {
  public info(): void {}

  public error(): void {}
}

class FailingSaveMissionPlanRepository extends InMemoryMissionRepository {
  private failMissionPlanSaves = false;

  public failNextMissionPlanSaves(): void {
    this.failMissionPlanSaves = true;
  }

  public override async saveMissionPlan(missionPlan: MissionPlan): Promise<void> {
    if (this.failMissionPlanSaves) {
      throw new Error('Save MissionPlan failed.');
    }

    await super.saveMissionPlan(missionPlan);
  }
}

function metadata(eventId: string): DomainEventMetadata {
  return {
    eventId,
    timestamp,
  };
}

function createMission(id: string): Mission {
  return Mission.create(
    MissionId.fromString(id),
    MissionObjective.fromString('Implement Mission Planning'),
    metadata(`event-${id}`),
  );
}

function completeMission(mission: Mission): void {
  mission.pullDomainEvents();
  mission.plan(metadata('event-planned'));
  mission.markReady(metadata('event-ready'));
  mission.start(metadata('event-started'));
  mission.review(metadata('event-reviewed'));
  mission.complete(metadata('event-completed'), [taskSnapshot('task-1', 'Completed')]);
}

function taskSnapshot(id: string, status: TaskSnapshot['status']): TaskSnapshot {
  return {
    id,
    title: `Task ${id}`,
    description: `Description for ${id}`,
    status,
    parentMissionPlanId: 'plan-1',
    dependencies: [],
    metadata: {},
  };
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

describe('MissionPlanningService', () => {
  it('creates MissionPlan and coordinates add, update, remove, and revise operations', async () => {
    const repository = new InMemoryMissionRepository();
    const service = new MissionPlanningService(
      repository,
      new EventBus(new TestLogger()),
      sequence([
        'plan-1',
        'event-plan-created',
        'task-1',
        'event-task-created-1',
        'task-2',
        'event-task-created-2',
        'event-plan-revised',
      ]),
      () => timestamp,
    );

    await repository.save(createMission('mission-1'));
    await service.createMissionPlan({
      missionId: 'mission-1',
      metadata: {
        planner: 'builder',
      },
      revisionReason: 'Initial plan',
    });
    await service.addTask({
      missionPlanId: 'plan-1',
      title: 'First task',
      description: 'Create plan aggregate',
      revisionReason: 'Add first task',
    });
    await service.addTask({
      missionPlanId: 'plan-1',
      title: 'Second task',
      description: 'Create service',
      dependencies: ['task-1'],
      revisionReason: 'Add second task',
    });
    await service.updateTask({
      missionPlanId: 'plan-1',
      taskId: 'task-1',
      status: 'Ready',
      revisionReason: 'Mark ready',
    });
    await service.removeTask({
      missionPlanId: 'plan-1',
      taskId: 'task-2',
      revisionReason: 'Remove second task',
    });
    const revisedPlan = await service.reviseMissionPlan({
      missionPlanId: 'plan-1',
      metadata: {
        planner: 'builder',
        updated: true,
      },
      revisionReason: 'Revise metadata',
    });

    expect(revisedPlan.revisionNumber).toBe(6);
    expect(revisedPlan.tasks).toEqual([
      {
        id: 'task-1',
        title: 'First task',
        description: 'Create plan aggregate',
        status: 'Ready',
        parentMissionPlanId: 'plan-1',
        dependencies: [],
        metadata: {},
      },
    ]);
    expect(revisedPlan.revisions.map((revision) => revision.revisionNumber)).toEqual([
      1, 2, 3, 4, 5, 6,
    ]);

    const persistedPlan = await repository.getMissionPlanById(revisedPlan.id);

    expect(persistedPlan?.toSnapshot()).toEqual(revisedPlan.toSnapshot());
  });

  it('rejects duplicate MissionPlan identity and unknown MissionPlan updates', async () => {
    const repository = new InMemoryMissionRepository();
    const service = new MissionPlanningService(
      repository,
      new EventBus(new TestLogger()),
      sequence(['event-plan-created']),
    );

    await repository.save(createMission('mission-1'));
    await service.createMissionPlan({
      id: 'plan-1',
      missionId: 'mission-1',
    });

    await expect(
      service.createMissionPlan({
        id: 'plan-1',
        missionId: 'mission-1',
      }),
    ).rejects.toThrow(MissionPlanAlreadyExistsError);
    await expect(
      service.addTask({
        missionPlanId: 'missing-plan',
        title: 'Task',
        description: 'Description',
      }),
    ).rejects.toThrow(MissionPlanNotFoundError);
  });

  it('rejects MissionPlan creation for unknown Missions', async () => {
    const service = new MissionPlanningService(
      new InMemoryMissionRepository(),
      new EventBus(new TestLogger()),
      sequence(['plan-1']),
    );

    await expect(
      service.createMissionPlan({
        missionId: 'missing-mission',
      }),
    ).rejects.toThrow(MissionNotFoundError);
  });

  it('rejects a second MissionPlan for the same Mission before saving it', async () => {
    const repository = new InMemoryMissionRepository();
    const service = new MissionPlanningService(
      repository,
      new EventBus(new TestLogger()),
      sequence(['plan-1', 'event-plan-created', 'plan-2']),
    );

    await repository.save(createMission('mission-1'));
    await service.createMissionPlan({
      missionId: 'mission-1',
    });

    await expect(
      service.createMissionPlan({
        missionId: 'mission-1',
      }),
    ).rejects.toThrow(MissionAlreadyPlannedError);
    await expect(repository.getMissionPlansByMissionId(MissionId.fromString('mission-1'))).resolves
      .toHaveLength(1);
    await expect(repository.missionPlanExists(MissionPlanId.fromString('plan-2'))).resolves.toBe(
      false,
    );
  });

  it('allows one MissionPlan per each distinct Mission', async () => {
    const repository = new InMemoryMissionRepository();
    const service = new MissionPlanningService(
      repository,
      new EventBus(new TestLogger()),
      sequence(['plan-1', 'event-plan-created-1', 'plan-2', 'event-plan-created-2']),
    );

    await repository.save(createMission('mission-1'));
    await repository.save(createMission('mission-2'));

    await service.createMissionPlan({
      missionId: 'mission-1',
    });
    await service.createMissionPlan({
      missionId: 'mission-2',
    });

    await expect(repository.getMissionPlansByMissionId(MissionId.fromString('mission-1'))).resolves
      .toHaveLength(1);
    await expect(repository.getMissionPlansByMissionId(MissionId.fromString('mission-2'))).resolves
      .toHaveLength(1);
  });

  it('rejects MissionPlan creation for a Cancelled Mission', async () => {
    const repository = new InMemoryMissionRepository();
    const mission = createMission('mission-1');
    const service = new MissionPlanningService(
      repository,
      new EventBus(new TestLogger()),
      sequence(['plan-1', 'event-plan-created']),
    );

    mission.cancel(metadata('event-cancelled'));
    await repository.save(mission);

    await expect(
      service.createMissionPlan({
        missionId: 'mission-1',
      }),
    ).rejects.toThrow(MissionPlanningTerminalMissionError);
    await expect(repository.getMissionPlansByMissionId(MissionId.fromString('mission-1'))).resolves
      .toHaveLength(0);
  });

  it('rejects task mutation when the owning Mission becomes Completed after plan creation', async () => {
    const repository = new InMemoryMissionRepository();
    const mission = createMission('mission-1');
    const service = new MissionPlanningService(
      repository,
      new EventBus(new TestLogger()),
      sequence(['plan-1', 'event-plan-created']),
    );

    await repository.save(mission);
    const plan = await service.createMissionPlan({
      missionId: 'mission-1',
    });

    completeMission(mission);
    await repository.save(mission);

    const before = plan.toSnapshot();

    await expect(
      service.addTask({
        missionPlanId: 'plan-1',
        title: 'Rejected task',
        description: 'Should not be persisted',
      }),
    ).rejects.toThrow(MissionPlanningTerminalMissionError);

    const persistedPlan = await repository.getMissionPlanById(plan.id);

    expect(persistedPlan?.toSnapshot()).toEqual(before);
  });

  it('surfaces planning validation errors without executing tasks', async () => {
    const repository = new InMemoryMissionRepository();
    const service = new MissionPlanningService(
      repository,
      new EventBus(new TestLogger()),
      sequence(['plan-1', 'event-plan-created', 'task-1']),
    );

    await repository.save(createMission('mission-1'));
    await service.createMissionPlan({
      missionId: 'mission-1',
    });

    await expect(
      service.addTask({
        missionPlanId: 'plan-1',
        title: ' ',
        description: 'Description',
      }),
    ).rejects.toThrow(MissionPlanningValidationError);
  });

  it('publishes MissionPlanCreated, TaskCreated, and MissionPlanRevised after persistence', async () => {
    const repository = new InMemoryMissionRepository();
    const eventBus = new EventBus(new TestLogger());
    const service = new MissionPlanningService(
      repository,
      eventBus,
      sequence([
        'plan-1',
        'event-plan-created',
        'task-1',
        'event-task-created',
        'event-plan-revised',
      ]),
      () => timestamp,
    );

    await repository.save(createMission('mission-1'));
    await service.createMissionPlan({
      missionId: 'mission-1',
      revisionReason: 'Initial plan',
    });
    await service.addTask({
      missionPlanId: 'plan-1',
      title: 'First task',
      description: 'Create plan aggregate',
      revisionReason: 'Add task',
    });
    await service.updateTask({
      missionPlanId: 'plan-1',
      taskId: 'task-1',
      title: 'Updated task',
      revisionReason: 'Update task silently',
    });
    await service.removeTask({
      missionPlanId: 'plan-1',
      taskId: 'task-1',
      revisionReason: 'Remove task silently',
    });
    await service.reviseMissionPlan({
      missionPlanId: 'plan-1',
      metadata: {
        revised: true,
      },
      revisionReason: 'Revise metadata',
    });

    expect(
      eventBus.replay('mission-1').map((event) => ({
        eventId: event.eventId,
        eventType: event.eventType,
        missionId: event.missionId,
        attribution: event.attribution,
        payload: event.payload,
      })),
    ).toEqual([
      {
        eventId: 'event-plan-created',
        eventType: 'MissionPlanCreated',
        missionId: 'mission-1',
        attribution: {
          missionId: 'mission-1',
          missionPlanRevisionId: '1',
        },
        payload: {
          missionPlanId: 'plan-1',
          revisionNumber: 1,
        },
      },
      {
        eventId: 'event-task-created',
        eventType: 'TaskCreated',
        missionId: 'mission-1',
        attribution: {
          missionId: 'mission-1',
          missionPlanRevisionId: '2',
        },
        payload: {
          missionPlanId: 'plan-1',
          revisionNumber: 2,
          taskId: 'task-1',
        },
      },
      {
        eventId: 'event-plan-revised',
        eventType: 'MissionPlanRevised',
        missionId: 'mission-1',
        attribution: {
          missionId: 'mission-1',
          missionPlanRevisionId: '5',
        },
        payload: {
          missionPlanId: 'plan-1',
          revisionNumber: 5,
        },
      },
    ]);
  });

  it('requires an EventBusContract only for MissionPlan operations that publish events', async () => {
    const repository = new InMemoryMissionRepository();
    const service = new MissionPlanningService(repository, undefined, sequence(['plan-1']));

    await repository.save(createMission('mission-1'));
    await expect(
      service.createMissionPlan({
        missionId: 'mission-1',
      }),
    ).rejects.toThrow(MissionPlanningEventPublisherUnavailableError);
  });

  it('does not publish planning events when MissionPlan persistence fails', async () => {
    const cases = [
      {
        eventId: 'event-plan-created',
        operation: (service: MissionPlanningService) =>
          service.createMissionPlan({
            missionId: 'mission-1',
          }),
      },
      {
        eventId: 'event-task-created',
        seedPlan: true,
        operation: (service: MissionPlanningService) =>
          service.addTask({
            missionPlanId: 'plan-1',
            title: 'First task',
            description: 'Create plan aggregate',
          }),
      },
      {
        eventId: 'event-plan-revised',
        seedPlan: true,
        operation: (service: MissionPlanningService) =>
          service.reviseMissionPlan({
            missionPlanId: 'plan-1',
            metadata: {
              revised: true,
            },
          }),
      },
    ];

    for (const item of cases) {
      const repository = new FailingSaveMissionPlanRepository();
      const eventBus = new EventBus(new TestLogger());
      const service = new MissionPlanningService(
        repository,
        eventBus,
        sequence(['plan-1', item.eventId]),
        () => timestamp,
      );

      await repository.save(createMission('mission-1'));
      if (item.seedPlan === true) {
        await repository.saveMissionPlan(
          MissionPlan.create({
            id: MissionPlanId.fromString('plan-1'),
            missionId: MissionId.fromString('mission-1'),
            revisionMetadata: {
              createdAt: timestamp,
              attributes: {},
            },
          }),
        );
      }
      repository.failNextMissionPlanSaves();

      await expect(item.operation(service)).rejects.toThrow('Save MissionPlan failed.');
      expect(eventBus.replay('mission-1')).toEqual([]);
    }
  });
});
