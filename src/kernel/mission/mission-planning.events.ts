import type { DomainEvent } from '../events/domain-event';
import type { MissionPlan } from './mission-plan.aggregate';
import type { TaskId } from './task-id';
import type { DomainEventMetadata } from './mission.types';

export const missionPlanEventTypes = [
  'MissionPlanCreated',
  'MissionPlanRevised',
  'TaskCreated',
] as const;

export type MissionPlanEventType = (typeof missionPlanEventTypes)[number];

export type MissionPlanDomainEvent = DomainEvent & {
  readonly eventType: MissionPlanEventType;
};

export function createMissionPlanCreatedEvent(
  missionPlan: MissionPlan,
  metadata: DomainEventMetadata,
): MissionPlanDomainEvent {
  return createMissionPlanEvent('MissionPlanCreated', missionPlan, metadata, {
    missionPlanId: missionPlan.id.toString(),
    revisionNumber: missionPlan.revisionNumber,
  });
}

export function createMissionPlanRevisedEvent(
  missionPlan: MissionPlan,
  metadata: DomainEventMetadata,
): MissionPlanDomainEvent {
  return createMissionPlanEvent('MissionPlanRevised', missionPlan, metadata, {
    missionPlanId: missionPlan.id.toString(),
    revisionNumber: missionPlan.revisionNumber,
  });
}

export function createTaskCreatedEvent(
  missionPlan: MissionPlan,
  taskId: TaskId,
  metadata: DomainEventMetadata,
): MissionPlanDomainEvent {
  return createMissionPlanEvent('TaskCreated', missionPlan, metadata, {
    missionPlanId: missionPlan.id.toString(),
    revisionNumber: missionPlan.revisionNumber,
    taskId: taskId.toString(),
  });
}

function createMissionPlanEvent(
  eventType: MissionPlanEventType,
  missionPlan: MissionPlan,
  metadata: DomainEventMetadata,
  payload: MissionPlanDomainEvent['payload'],
): MissionPlanDomainEvent {
  return {
    eventId: metadata.eventId,
    missionId: missionPlan.missionId.toString(),
    eventType,
    timestamp: metadata.timestamp,
    causality: metadata.causality ?? [],
    ...(metadata.correlationId === undefined ? {} : { correlationId: metadata.correlationId }),
    attribution: {
      missionId: missionPlan.missionId.toString(),
      missionPlanRevisionId: String(missionPlan.revisionNumber),
    },
    payload,
  };
}
