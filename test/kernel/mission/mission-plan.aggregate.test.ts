import { describe, expect, it } from 'vitest';

import { MissionId } from '../../../src/kernel/mission/mission-id';
import { MissionPlan } from '../../../src/kernel/mission/mission-plan.aggregate';
import { MissionPlanId } from '../../../src/kernel/mission/mission-plan-id';
import {
  MissionExecutionValidationError,
  MissionPlanningValidationError,
  TaskNotFoundError,
} from '../../../src/kernel/mission/mission.errors';
import type { RevisionMetadata } from '../../../src/kernel/mission/mission-planning.types';
import { Task } from '../../../src/kernel/mission/task';
import { TaskDependency } from '../../../src/kernel/mission/task-dependency';
import { TaskId } from '../../../src/kernel/mission/task-id';
import type { DomainEventMetadata } from '../../../src/kernel/mission/mission.types';

const timestamp = '2026-07-12T00:00:00.000Z';

function eventMetadata(eventId: string): DomainEventMetadata {
  return {
    eventId,
    timestamp,
  };
}

function revisionMetadata(reason: string): RevisionMetadata {
  return {
    createdAt: timestamp,
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

  it('starts Tasks only after prerequisites are completed', () => {
    const missionPlan = createMissionPlan();
    const firstTask = createTask('task-1');
    const secondTask = createTask('task-2');

    firstTask.markReady();
    secondTask.markReady();
    secondTask.addDependency(TaskDependency.fromTaskIds(secondTask.id, firstTask.id));
    missionPlan.addTask(firstTask, revisionMetadata('Add first task'));
    missionPlan.addTask(secondTask, revisionMetadata('Add second task'));

    expect(() => missionPlan.startTask(TaskId.fromString('task-2'))).toThrow(
      MissionExecutionValidationError,
    );

    missionPlan.startTask(TaskId.fromString('task-1'));
    missionPlan.completeTask(TaskId.fromString('task-1'));
    missionPlan.startTask(TaskId.fromString('task-2'));

    expect(missionPlan.tasks.map((task) => ({ id: task.id, status: task.status }))).toEqual([
      { id: 'task-1', status: 'Completed' },
      { id: 'task-2', status: 'InProgress' },
    ]);
  });

  it('rejects empty MissionPlan execution', () => {
    const missionPlan = createMissionPlan();

    expect(() => missionPlan.assertExecutable()).toThrow(MissionExecutionValidationError);
  });

  it('records and drains MissionPlan planning domain events', () => {
    const missionPlan = MissionPlan.create({
      id: MissionPlanId.fromString('plan-1'),
      missionId: MissionId.fromString('mission-1'),
      revisionMetadata: revisionMetadata('Initial plan'),
      eventMetadata: eventMetadata('event-plan-created'),
    });

    missionPlan.addTask(
      createTask('task-1'),
      revisionMetadata('Add task'),
      eventMetadata('event-task-created'),
    );
    missionPlan.revise(
      {
        metadata: {
          revised: true,
        },
      },
      revisionMetadata('Revise metadata'),
      eventMetadata('event-plan-revised'),
    );

    expect(missionPlan.pullDomainEvents()).toEqual([
      {
        eventId: 'event-plan-created',
        missionId: 'mission-1',
        eventType: 'MissionPlanCreated',
        timestamp,
        causality: [],
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
        missionId: 'mission-1',
        eventType: 'TaskCreated',
        timestamp,
        causality: [],
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
        missionId: 'mission-1',
        eventType: 'MissionPlanRevised',
        timestamp,
        causality: [],
        attribution: {
          missionId: 'mission-1',
          missionPlanRevisionId: '3',
        },
        payload: {
          missionPlanId: 'plan-1',
          revisionNumber: 3,
        },
      },
    ]);
    expect(missionPlan.pullDomainEvents()).toEqual([]);
  });

  it('records Task execution events through the MissionPlan boundary', () => {
    const missionPlan = createMissionPlan();
    const task = createTask('task-1');

    task.markReady();
    missionPlan.addTask(task, revisionMetadata('Add task'));
    missionPlan.startTask(TaskId.fromString('task-1'), eventMetadata('event-task-started'));
    missionPlan.completeTask(TaskId.fromString('task-1'), eventMetadata('event-task-completed'));

    expect(missionPlan.pullDomainEvents().map((event) => event.eventType)).toEqual([
      'TaskStarted',
      'TaskCompleted',
    ]);
    expect(missionPlan.pullDomainEvents()).toEqual([]);
  });
});
