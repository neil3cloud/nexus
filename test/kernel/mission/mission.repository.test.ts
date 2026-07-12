import { describe, expect, it } from 'vitest';

import { Mission } from '../../../src/kernel/mission/mission.aggregate';
import { MissionId } from '../../../src/kernel/mission/mission-id';
import { MissionObjective } from '../../../src/kernel/mission/mission-objective';
import { MissionPlan } from '../../../src/kernel/mission/mission-plan.aggregate';
import { MissionPlanId } from '../../../src/kernel/mission/mission-plan-id';
import { InMemoryMissionRepository } from '../../../src/kernel/mission/mission.repository';
import type { RevisionMetadata } from '../../../src/kernel/mission/mission-planning.types';
import type { DomainEventMetadata } from '../../../src/kernel/mission/mission.types';
import { Task } from '../../../src/kernel/mission/task';
import { TaskId } from '../../../src/kernel/mission/task-id';

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
    MissionObjective.fromString('Implement Mission Foundation'),
    metadata(`event-${id}`),
  );
}

function revisionMetadata(reason: string): RevisionMetadata {
  return {
    createdAt: timestamp,
    reason,
    attributes: {},
  };
}

function createMissionPlan(id: string, missionId: string): MissionPlan {
  return MissionPlan.create({
    id: MissionPlanId.fromString(id),
    missionId: MissionId.fromString(missionId),
    revisionMetadata: revisionMetadata('Initial plan'),
  });
}

describe('InMemoryMissionRepository', () => {
  it('saves, retrieves, and checks Mission existence by MissionId', async () => {
    const repository = new InMemoryMissionRepository();
    const missionId = MissionId.fromString('mission-1');
    const mission = createMission('mission-1');

    await repository.save(mission);

    const retrieved = await repository.getById(missionId);

    expect(await repository.exists(missionId)).toBe(true);
    expect(retrieved?.toSnapshot()).toEqual({
      id: 'mission-1',
      objective: 'Implement Mission Foundation',
      status: 'Draft',
      latestEventId: 'event-mission-1',
    });
  });

  it('returns undefined and false when a Mission does not exist', async () => {
    const repository = new InMemoryMissionRepository();
    const missionId = MissionId.fromString('missing-mission');

    await expect(repository.getById(missionId)).resolves.toBeUndefined();
    await expect(repository.exists(missionId)).resolves.toBe(false);
  });

  it('stores snapshots so retrieved aggregate mutations do not leak without save', async () => {
    const repository = new InMemoryMissionRepository();
    const missionId = MissionId.fromString('mission-1');

    await repository.save(createMission('mission-1'));

    const retrieved = await repository.getById(missionId);

    if (retrieved === undefined) {
      throw new Error('Expected Mission to exist.');
    }

    retrieved.plan(metadata('event-planned'));

    const retrievedAgain = await repository.getById(missionId);

    expect(retrievedAgain?.status).toBe('Draft');
  });

  it('serializes concurrent unit-test operations through the repository contract', async () => {
    const repository = new InMemoryMissionRepository();
    const missionOne = createMission('mission-1');
    const missionTwo = createMission('mission-2');

    await Promise.all([repository.save(missionOne), repository.save(missionTwo)]);

    await expect(repository.exists(missionOne.id)).resolves.toBe(true);
    await expect(repository.exists(missionTwo.id)).resolves.toBe(true);
  });

  it('persists MissionPlan snapshots with Tasks and revision history', async () => {
    const repository = new InMemoryMissionRepository();
    const missionPlan = createMissionPlan('plan-1', 'mission-1');
    const task = Task.create({
      id: TaskId.fromString('task-1'),
      title: 'Create aggregate',
      description: 'Implement MissionPlan',
      parentMissionPlanId: missionPlan.id,
    });

    missionPlan.addTask(task, revisionMetadata('Add task'));
    await repository.saveMissionPlan(missionPlan);

    const retrieved = await repository.getMissionPlanById(missionPlan.id);

    expect(await repository.missionPlanExists(missionPlan.id)).toBe(true);
    expect(retrieved?.toSnapshot()).toEqual(missionPlan.toSnapshot());
    expect(retrieved?.revisions.map((revision) => revision.revisionNumber)).toEqual([1, 2]);
    await expect(repository.getMissionPlansByMissionId(MissionId.fromString('mission-1'))).resolves
      .toHaveLength(1);
  });

  it('stores MissionPlan snapshots so retrieved planning mutations do not leak without save', async () => {
    const repository = new InMemoryMissionRepository();
    const missionPlan = createMissionPlan('plan-1', 'mission-1');

    await repository.saveMissionPlan(missionPlan);

    const retrieved = await repository.getMissionPlanById(missionPlan.id);

    if (retrieved === undefined) {
      throw new Error('Expected MissionPlan to exist.');
    }

    retrieved.addTask(
      Task.create({
        id: TaskId.fromString('task-1'),
        title: 'Unsaved task',
        description: 'Should not leak',
        parentMissionPlanId: retrieved.id,
      }),
      revisionMetadata('Unsaved task'),
    );

    const retrievedAgain = await repository.getMissionPlanById(missionPlan.id);

    expect(retrievedAgain?.tasks).toEqual([]);
    expect(retrievedAgain?.revisionNumber).toBe(1);
  });

  it('persists Task execution state updates in MissionPlan snapshots', async () => {
    const repository = new InMemoryMissionRepository();
    const missionPlan = createMissionPlan('plan-1', 'mission-1');
    const task = Task.create({
      id: TaskId.fromString('task-1'),
      title: 'Execute task',
      description: 'Persist execution state',
      parentMissionPlanId: missionPlan.id,
    });

    task.markReady();
    missionPlan.addTask(task, revisionMetadata('Add executable task'));
    missionPlan.startTask(task.id);
    missionPlan.completeTask(task.id);

    await repository.saveMissionPlan(missionPlan);

    const retrieved = await repository.getMissionPlanById(missionPlan.id);

    expect(retrieved?.tasks[0]?.status).toBe('Completed');
  });
});
