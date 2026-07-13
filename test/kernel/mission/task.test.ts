import { describe, expect, it } from 'vitest';

import { MissionPlanId } from '../../../src/kernel/mission/mission-plan-id';
import { MissionId } from '../../../src/kernel/mission/mission-id';
import {
  MissionPlanningValidationError,
  TaskLifecycleTransitionError,
} from '../../../src/kernel/mission/mission.errors';
import { Task } from '../../../src/kernel/mission/task';
import { TaskDependency } from '../../../src/kernel/mission/task-dependency';
import { TaskId } from '../../../src/kernel/mission/task-id';
import type { DomainEventMetadata } from '../../../src/kernel/mission/mission.types';

const timestamp = '2026-07-12T00:00:00.000Z';

function metadata(eventId: string): DomainEventMetadata {
  return {
    eventId,
    timestamp,
  };
}

function createTask(): Task {
  return Task.create({
    id: TaskId.fromString(' task-1 '),
    title: ' Implement planner ',
    description: 'Create Mission Planning model',
    parentMissionPlanId: MissionPlanId.fromString('plan-1'),
  });
}

describe('Task', () => {
  it('has immutable TaskId, parent MissionPlan, metadata, and Planned initial status', () => {
    const task = createTask();

    expect(task.id.toString()).toBe('task-1');
    expect(Object.isFrozen(task.id)).toBe(true);
    expect(task.title).toBe('Implement planner');
    expect(task.status).toBe('Planned');
    expect(task.parentMissionPlanId.toString()).toBe('plan-1');
  });

  it('enforces valid TaskStatus transitions and terminal states', () => {
    const task = createTask();

    task.transitionTo('Ready');
    task.transitionTo('InProgress');
    task.transitionTo('Completed');

    expect(task.status).toBe('Completed');
    expect(() => task.transitionTo('Cancelled')).toThrow(TaskLifecycleTransitionError);
  });

  it('rejects same-status update validation on terminal Tasks', () => {
    const task = createTask();

    task.transitionTo('Ready');
    task.transitionTo('InProgress');
    task.transitionTo('Completed');

    expect(() =>
      task.assertUpdateIsValid({
        status: 'Completed',
      }),
    ).toThrow(TaskLifecycleTransitionError);
  });

  it('rejects undocumented TaskStatus transitions', () => {
    const task = createTask();

    expect(() => task.transitionTo('Completed')).toThrow(TaskLifecycleTransitionError);
    expect(task.status).toBe('Planned');
  });

  it('cancels Ready Tasks and rejects restart', () => {
    const task = createTask();

    task.markReady();
    task.cancel();

    expect(task.status).toBe('Cancelled');
    expect(() => task.start()).toThrow(TaskLifecycleTransitionError);
  });

  it('prevents duplicate dependencies and dependencies targeting another Task', () => {
    const task = createTask();
    const dependency = TaskDependency.fromTaskIds(
      TaskId.fromString('task-1'),
      TaskId.fromString('task-2'),
    );

    task.addDependency(dependency);

    expect(task.prerequisites().map(String)).toEqual(['task-2']);
    expect(() => task.addDependency(dependency)).toThrow(MissionPlanningValidationError);
    expect(() =>
      task.addDependency(
        TaskDependency.fromTaskIds(TaskId.fromString('other-task'), TaskId.fromString('task-3')),
      ),
    ).toThrow(MissionPlanningValidationError);
  });

  it('records and drains Task lifecycle domain events when metadata is supplied', () => {
    const task = createTask();
    const missionId = MissionId.fromString('mission-1');

    task.markReady();
    task.start(metadata('event-started'), missionId);
    task.complete(metadata('event-completed'), missionId);

    expect(task.pullDomainEvents()).toEqual([
      {
        eventId: 'event-started',
        missionId: 'mission-1',
        eventType: 'TaskStarted',
        timestamp,
        causality: [],
        attribution: {
          missionId: 'mission-1',
          taskId: 'task-1',
        },
        payload: {
          missionPlanId: 'plan-1',
          taskId: 'task-1',
          status: 'InProgress',
        },
      },
      {
        eventId: 'event-completed',
        missionId: 'mission-1',
        eventType: 'TaskCompleted',
        timestamp,
        causality: [],
        attribution: {
          missionId: 'mission-1',
          taskId: 'task-1',
        },
        payload: {
          missionPlanId: 'plan-1',
          taskId: 'task-1',
          status: 'Completed',
        },
      },
    ]);
    expect(task.pullDomainEvents()).toEqual([]);
  });
});
