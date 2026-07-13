import type { DomainEvent } from '../events/domain-event';
import type { MissionId } from './mission-id';
import type { MissionPlanId } from './mission-plan-id';
import type { TaskStatus } from './mission-planning.types';
import type { TaskId } from './task-id';
import type { DomainEventMetadata } from './mission.types';

export const taskEventTypes = ['TaskStarted', 'TaskCompleted', 'TaskCancelled'] as const;

export type TaskEventType = (typeof taskEventTypes)[number];

export type TaskDomainEvent = DomainEvent & {
  readonly eventType: TaskEventType;
};

export function createTaskStartedEvent(input: TaskEventInput): TaskDomainEvent {
  return createTaskEvent('TaskStarted', input);
}

export function createTaskCompletedEvent(input: TaskEventInput): TaskDomainEvent {
  return createTaskEvent('TaskCompleted', input);
}

export function createTaskCancelledEvent(input: TaskEventInput): TaskDomainEvent {
  return createTaskEvent('TaskCancelled', input);
}

export interface TaskEventInput {
  readonly missionId: MissionId;
  readonly missionPlanId: MissionPlanId;
  readonly taskId: TaskId;
  readonly status: TaskStatus;
  readonly metadata: DomainEventMetadata;
}

function createTaskEvent(eventType: TaskEventType, input: TaskEventInput): TaskDomainEvent {
  return {
    eventId: input.metadata.eventId,
    missionId: input.missionId.toString(),
    eventType,
    timestamp: input.metadata.timestamp,
    causality: input.metadata.causality ?? [],
    ...(input.metadata.correlationId === undefined ? {} : { correlationId: input.metadata.correlationId }),
    attribution: {
      missionId: input.missionId.toString(),
      taskId: input.taskId.toString(),
    },
    payload: {
      missionPlanId: input.missionPlanId.toString(),
      taskId: input.taskId.toString(),
      status: input.status,
    },
  };
}
