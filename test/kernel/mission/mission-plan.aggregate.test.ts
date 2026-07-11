import { describe, expect, it } from 'vitest';

import { MissionId } from '../../../src/kernel/mission/mission-id';
import { MissionPlan } from '../../../src/kernel/mission/mission-plan.aggregate';
import { MissionPlanId } from '../../../src/kernel/mission/mission-plan-id';
import {
  MissionPlanningValidationError,
  TaskNotFoundError,
} from '../../../src/kernel/mission/mission.errors';
import type { RevisionMetadata } from '../../../src/kernel/mission/mission-planning.types';
import { Task } from '../../../src/kernel/mission/task';
import { TaskDependency } from '../../../src/kernel/mission/task-dependency';
import { TaskId } from '../../../src/kernel/mission/task-id';

function revisionMetadata(reason: string): RevisionMetadata {
  return {
    createdAt: '2026-07-12T00:00:00.000Z',
    reason,
    attributes: {
      sprint: 'Sprint 3',
    },
  };
}

function createMissionPlan(): MissionPlan {
  return MissionPlan.create({
    id: MissionPlanId.fromString('plan-1'),
    missionId: MissionId.fromString('mission-1'),
    metadata: {
      planner: 'builder',
    },
    revisionMetadata: revisionMetadata('Initial plan'),
  });
}

function createTask(id: string, planId: MissionPlanId = MissionPlanId.fromString('plan-1')): Task {
  return Task.create({
    id: TaskId.fromString(id),
    title: `Task ${id}`,
    description: `Description for ${id}`,
    parentMissionPlanId: planId,
    metadata: {
      source: 'unit-test',
    },
  });
}

describe('MissionPlan aggregate', () => {
  it('creates a MissionPlan for exactly one Mission with initial revision history', () => {
    const missionPlan = createMissionPlan();

    expect(missionPlan.id.toString()).toBe('plan-1');
    expect(missionPlan.missionId.toString()).toBe('mission-1');
    expect(missionPlan.revisionNumber).toBe(1);
    expect(missionPlan.tasks).toEqual([]);
    expect(missionPlan.metadata).toEqual({
      planner: 'builder',
    });
    expect(missionPlan.revisions.map((revision) => revision.toSnapshot())).toEqual([
      {
        revisionNumber: 1,
        metadata: revisionMetadata('Initial plan'),
        tasks: [],
      },
    ]);
  });

  it('increments revision numbers and preserves previous revisions for planning changes', () => {
    const missionPlan = createMissionPlan();

    missionPlan.addTask(createTask('task-1'), revisionMetadata('Add task'));
    missionPlan.updateTask(
      TaskId.fromString('task-1'),
      {
        title: 'Updated task',
      },
      revisionMetadata('Update task'),
    );

    expect(missionPlan.revisionNumber).toBe(3);
    expect(missionPlan.getRevision(1)?.tasks).toEqual([]);
    expect(missionPlan.getRevision(2)?.tasks.map((task) => task.title)).toEqual(['Task task-1']);
    expect(missionPlan.getRevision(3)?.tasks.map((task) => task.title)).toEqual([
      'Updated task',
    ]);
  });

  it('owns Task collection and rejects duplicate or foreign Task membership', () => {
    const missionPlan = createMissionPlan();

    missionPlan.addTask(createTask('task-1'), revisionMetadata('Add task'));

    expect(() => missionPlan.addTask(createTask('task-1'), revisionMetadata('Duplicate'))).toThrow(
      MissionPlanningValidationError,
    );
    expect(() =>
      missionPlan.addTask(
        createTask('task-2', MissionPlanId.fromString('plan-2')),
        revisionMetadata('Foreign task'),
      ),
    ).toThrow(MissionPlanningValidationError);
  });

  it('supports dependency add, remove, prerequisite query, and self-dependency detection', () => {
    const missionPlan = createMissionPlan();

    missionPlan.addTask(createTask('task-1'), revisionMetadata('Add first task'));
    missionPlan.addTask(createTask('task-2'), revisionMetadata('Add second task'));
    missionPlan.addTaskDependency(
      TaskId.fromString('task-2'),
      TaskId.fromString('task-1'),
      revisionMetadata('Add dependency'),
    );

    expect(missionPlan.prerequisitesFor(TaskId.fromString('task-2')).map(String)).toEqual([
      'task-1',
    ]);
    expect(() =>
      missionPlan.addTaskDependency(
        TaskId.fromString('task-2'),
        TaskId.fromString('task-1'),
        revisionMetadata('Duplicate dependency'),
      ),
    ).toThrow(MissionPlanningValidationError);
    expect(() =>
      TaskDependency.fromTaskIds(TaskId.fromString('task-1'), TaskId.fromString('task-1')),
    ).toThrow(MissionPlanningValidationError);

    missionPlan.removeTaskDependency(
      TaskId.fromString('task-2'),
      TaskId.fromString('task-1'),
      revisionMetadata('Remove dependency'),
    );

    expect(missionPlan.prerequisitesFor(TaskId.fromString('task-2'))).toEqual([]);
  });

  it('rejects dependencies on unknown Tasks', () => {
    const missionPlan = createMissionPlan();

    missionPlan.addTask(createTask('task-1'), revisionMetadata('Add first task'));

    expect(() =>
      missionPlan.updateTask(
        TaskId.fromString('task-1'),
        {
          dependencies: [TaskId.fromString('missing-task')],
        },
        revisionMetadata('Unknown dependency'),
      ),
    ).toThrow(TaskNotFoundError);
  });

  it('leaves Task unchanged and records no revision when updateTask rejects invalid status', () => {
    const missionPlan = createMissionPlan();

    missionPlan.addTask(createTask('task-1'), revisionMetadata('Add task'));

    const before = missionPlan.toSnapshot();

    expect(() =>
      missionPlan.updateTask(
        TaskId.fromString('task-1'),
        {
          title: 'Mutated title',
          description: 'Mutated description',
          status: 'Completed',
          metadata: {
            changed: true,
          },
        },
        revisionMetadata('Invalid update'),
      ),
    ).toThrow();
    expect(missionPlan.toSnapshot()).toEqual(before);
  });

  it('leaves Task unchanged and records no revision when updateTask rejects unknown dependency', () => {
    const missionPlan = createMissionPlan();

    missionPlan.addTask(createTask('task-1'), revisionMetadata('Add task'));

    const before = missionPlan.toSnapshot();

    expect(() =>
      missionPlan.updateTask(
        TaskId.fromString('task-1'),
        {
          title: 'Mutated title',
          description: 'Mutated description',
          dependencies: [TaskId.fromString('missing-task')],
          metadata: {
            changed: true,
          },
        },
        revisionMetadata('Invalid update'),
      ),
    ).toThrow(TaskNotFoundError);
    expect(missionPlan.toSnapshot()).toEqual(before);
  });

  it('rejects direct dependency cycles before recording a revision', () => {
    const missionPlan = createMissionPlan();

    missionPlan.addTask(createTask('task-1'), revisionMetadata('Add first task'));
    missionPlan.addTask(createTask('task-2'), revisionMetadata('Add second task'));
    missionPlan.addTaskDependency(
      TaskId.fromString('task-2'),
      TaskId.fromString('task-1'),
      revisionMetadata('Add dependency'),
    );

    const before = missionPlan.toSnapshot();

    expect(() =>
      missionPlan.addTaskDependency(
        TaskId.fromString('task-1'),
        TaskId.fromString('task-2'),
        revisionMetadata('Reject direct cycle'),
      ),
    ).toThrow(MissionPlanningValidationError);
    expect(missionPlan.toSnapshot()).toEqual(before);
  });

  it('rejects transitive dependency cycles before recording a revision', () => {
    const missionPlan = createMissionPlan();

    missionPlan.addTask(createTask('task-1'), revisionMetadata('Add first task'));
    missionPlan.addTask(createTask('task-2'), revisionMetadata('Add second task'));
    missionPlan.addTask(createTask('task-3'), revisionMetadata('Add third task'));
    missionPlan.addTaskDependency(
      TaskId.fromString('task-2'),
      TaskId.fromString('task-1'),
      revisionMetadata('Add first dependency'),
    );
    missionPlan.addTaskDependency(
      TaskId.fromString('task-3'),
      TaskId.fromString('task-2'),
      revisionMetadata('Add second dependency'),
    );

    const before = missionPlan.toSnapshot();

    expect(() =>
      missionPlan.updateTask(
        TaskId.fromString('task-1'),
        {
          dependencies: [TaskId.fromString('task-3')],
        },
        revisionMetadata('Reject transitive cycle'),
      ),
    ).toThrow(MissionPlanningValidationError);
    expect(missionPlan.toSnapshot()).toEqual(before);
  });
});
