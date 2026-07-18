import type { DomainEvent } from '../events/domain-event';
import type { DomainEventMetadata } from '../mission/mission.types';
import type { Finding } from './finding';
import type { Review } from './review.aggregate';
import type { ReviewOutcome } from './review-values';

export const reviewEventTypes = [
  'ReviewStarted',
  'ReviewCompleted',
  'ReviewAccepted',
  'ReviewRejected',
  'FindingCreated',
] as const;

export type ReviewEventType = (typeof reviewEventTypes)[number];

export type ReviewDomainEvent = DomainEvent & {
  readonly eventType: ReviewEventType;
};

export function createReviewStartedEvent(
  review: Review,
  metadata: DomainEventMetadata,
): ReviewDomainEvent {
  return createReviewEvent('ReviewStarted', review, metadata, {
    reviewId: review.id.toString(),
    missionPlanRevision: review.missionPlanRevision.revisionId,
  });
}

export function createFindingCreatedEvent(
  review: Review,
  finding: Finding,
  metadata: DomainEventMetadata,
): ReviewDomainEvent {
  return createReviewEvent('FindingCreated', review, metadata, {
    reviewId: review.id.toString(),
    findingId: finding.id.toString(),
    severity: finding.severity.toString(),
    ...(finding.category === undefined ? {} : { category: finding.category.toString() }),
    supportingEvidenceReferences: finding.supportingEvidenceReferences,
  });
}

export function createReviewCompletedEvent(
  review: Review,
  outcome: ReviewOutcome,
  metadata: DomainEventMetadata,
): ReviewDomainEvent {
  return createReviewEvent('ReviewCompleted', review, metadata, {
    reviewId: review.id.toString(),
    outcome: outcome.toString(),
  });
}

export function createReviewAcceptedEvent(
  review: Review,
  outcome: ReviewOutcome,
  metadata: DomainEventMetadata,
): ReviewDomainEvent {
  return createReviewEvent('ReviewAccepted', review, metadata, {
    reviewId: review.id.toString(),
    outcome: outcome.toString(),
  });
}

export function createReviewRejectedEvent(
  review: Review,
  outcome: ReviewOutcome,
  metadata: DomainEventMetadata,
): ReviewDomainEvent {
  return createReviewEvent('ReviewRejected', review, metadata, {
    reviewId: review.id.toString(),
    outcome: outcome.toString(),
  });
}

function createReviewEvent(
  eventType: ReviewEventType,
  review: Review,
  metadata: DomainEventMetadata,
  payload: ReviewDomainEvent['payload'],
): ReviewDomainEvent {
  return {
    eventId: metadata.eventId,
    missionId: review.missionId,
    eventType,
    timestamp: metadata.timestamp,
    causality: metadata.causality ?? [],
    ...(metadata.correlationId === undefined ? {} : { correlationId: metadata.correlationId }),
    attribution: {
      missionId: review.missionId,
      missionPlanRevisionId: review.missionPlanRevision.revisionId,
    },
    payload,
  };
}
