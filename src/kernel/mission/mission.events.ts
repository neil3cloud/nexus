import type { DomainEvent } from '../events/domain-event';
import type { MissionId } from './mission-id';
import type { MissionObjective } from './mission-objective';
import type { DomainEventMetadata } from './mission.types';

export const missionEventTypes = [
  'MissionCreated',
  'MissionPlanned',
  'MissionReady',
  'MissionStarted',
  'MissionPaused',
  'MissionResumed',
  'MissionPlanRevised',
  'TaskAdded',
  'TaskCompleted',
  'TaskRemoved',
  'MissionReviewed',
  'MissionCompleted',
  'MissionCancelled',
  'MissionFailed',
] as const;

export type MissionEventType = (typeof missionEventTypes)[number];

export type MissionDomainEvent = DomainEvent & {
  readonly eventType: MissionEventType;
};

export function createMissionCreatedEvent(
  missionId: MissionId,
  objective: MissionObjective,
  metadata: DomainEventMetadata,
): MissionDomainEvent {
  return createMissionEvent('MissionCreated', missionId, metadata, {
    missionId: missionId.toString(),
    objective: objective.toString(),
  });
}

export function createMissionLifecycleEvent(
  eventType: MissionEventType,
  missionId: MissionId,
  metadata: DomainEventMetadata,
): MissionDomainEvent {
  return createMissionEvent(eventType, missionId, metadata, {});
}

function createMissionEvent(
  eventType: MissionEventType,
  missionId: MissionId,
  metadata: DomainEventMetadata,
  payload: MissionDomainEvent['payload'],
): MissionDomainEvent {
  return {
    eventId: metadata.eventId,
    missionId: missionId.toString(),
    eventType,
    timestamp: metadata.timestamp,
    causality: metadata.causality ?? [],
    ...(metadata.correlationId === undefined ? {} : { correlationId: metadata.correlationId }),
    attribution: {
      missionId: missionId.toString(),
    },
    payload,
  };
}

