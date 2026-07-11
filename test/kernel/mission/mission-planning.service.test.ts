import { describe, expect, it } from 'vitest';

import { Mission } from '../../../src/kernel/mission/mission.aggregate';
import {
  MissionAlreadyPlannedError,
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
import type { DomainEventMetadata } from '../../../src/kernel/mission/mission.types';

const timestamp = '2026-07-12T00:00:00.000Z';

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
  mission.complete(metadata('event-completed'));
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
      sequence(['plan-1', 'task-1', 'task-2']),
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
    const service = new MissionPlanningService(repository, sequence(['unused']));

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
    const service = new MissionPlanningService(new InMemoryMissionRepository(), sequence(['plan-1']));

    await expect(
      service.createMissionPlan({
        missionId: 'missing-mission',
      }),
    ).rejects.toThrow(MissionNotFoundError);
  });

  it('rejects a second MissionPlan for the same Mission before saving it', async () => {
    const repository = new InMemoryMissionRepository();
    const service = new MissionPlanningService(repository, sequence(['plan-1', 'plan-2']));

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
    const service = new MissionPlanningService(repository, sequence(['plan-1', 'plan-2']));

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
    const service = new MissionPlanningService(repository, sequence(['plan-1']));

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
    const service = new MissionPlanningService(repository, sequence(['plan-1']));

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
    const service = new MissionPlanningService(repository, sequence(['plan-1', 'task-1']));

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
});
