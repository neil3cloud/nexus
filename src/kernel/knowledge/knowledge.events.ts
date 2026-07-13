import type { DomainEvent } from '../events/domain-event';
import type { DomainEventMetadata } from '../mission/mission.types';
import type { Knowledge } from './knowledge.aggregate';

export const knowledgeEventTypes = [
  'KnowledgeCandidateCreated',
  'KnowledgeRevisionCreated',
  'KnowledgeAccepted',
  'KnowledgePublished',
  'KnowledgeSuperseded',
  'KnowledgeArchived',
] as const;

export type KnowledgeEventType = (typeof knowledgeEventTypes)[number];

export type KnowledgeDomainEvent = DomainEvent & {
  readonly eventType: KnowledgeEventType;
};

export function createKnowledgeCandidateCreatedEvent(
  knowledge: Knowledge,
  metadata: DomainEventMetadata,
): KnowledgeDomainEvent {
  return createKnowledgeEvent('KnowledgeCandidateCreated', knowledge, metadata, {
    knowledgeId: knowledge.id.toString(),
    status: knowledge.status.toString(),
    scope: knowledge.scope.toString(),
    revisionNumber: knowledge.revisions.length,
  });
}

export function createKnowledgeRevisionCreatedEvent(
  knowledge: Knowledge,
  metadata: DomainEventMetadata,
): KnowledgeDomainEvent {
  const revisionNumber = knowledge.revisions.length;

  return createKnowledgeEvent('KnowledgeRevisionCreated', knowledge, metadata, {
    knowledgeId: knowledge.id.toString(),
    revisionNumber,
    previousRevisionNumber: revisionNumber - 1,
  });
}

export function createKnowledgeAcceptedEvent(
  knowledge: Knowledge,
  metadata: DomainEventMetadata,
): KnowledgeDomainEvent {
  return createKnowledgeLifecycleEvent('KnowledgeAccepted', knowledge, metadata);
}

export function createKnowledgePublishedEvent(
  knowledge: Knowledge,
  metadata: DomainEventMetadata,
): KnowledgeDomainEvent {
  return createKnowledgeLifecycleEvent('KnowledgePublished', knowledge, metadata);
}

export function createKnowledgeSupersededEvent(
  knowledge: Knowledge,
  metadata: DomainEventMetadata,
): KnowledgeDomainEvent {
  return createKnowledgeLifecycleEvent('KnowledgeSuperseded', knowledge, metadata);
}

export function createKnowledgeArchivedEvent(
  knowledge: Knowledge,
  metadata: DomainEventMetadata,
): KnowledgeDomainEvent {
  return createKnowledgeLifecycleEvent('KnowledgeArchived', knowledge, metadata);
}

function createKnowledgeLifecycleEvent(
  eventType: KnowledgeEventType,
  knowledge: Knowledge,
  metadata: DomainEventMetadata,
): KnowledgeDomainEvent {
  return createKnowledgeEvent(eventType, knowledge, metadata, {
    knowledgeId: knowledge.id.toString(),
    status: knowledge.status.toString(),
  });
}

function createKnowledgeEvent(
  eventType: KnowledgeEventType,
  knowledge: Knowledge,
  metadata: DomainEventMetadata,
  payload: KnowledgeDomainEvent['payload'],
): KnowledgeDomainEvent {
  return {
    eventId: metadata.eventId,
    missionId: knowledge.missionId,
    eventType,
    timestamp: metadata.timestamp,
    causality: metadata.causality ?? [],
    ...(metadata.correlationId === undefined ? {} : { correlationId: metadata.correlationId }),
    attribution: {
      missionId: knowledge.missionId,
      missionPlanRevisionId: knowledge.missionPlanRevisionId,
    },
    payload,
  };
}
