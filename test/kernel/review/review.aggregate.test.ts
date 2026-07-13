import { describe, expect, it } from 'vitest';

import { Finding } from '../../../src/kernel/review/finding';
import type { DomainEventMetadata } from '../../../src/kernel/mission/mission.types';
import { Review } from '../../../src/kernel/review/review.aggregate';
import {
  DuplicateFindingError,
  InvalidFindingLifecycleTransitionError,
  InvalidReviewDefinitionError,
  InvalidReviewLifecycleTransitionError,
  MissingEvidenceReferenceError,
  ReviewCompletionRejectedError,
} from '../../../src/kernel/review/review.errors';

const timestamp = '2026-07-12T00:00:00.000Z';

function metadata(eventId: string): DomainEventMetadata {
  return {
    eventId,
    timestamp,
  };
}

function createReview(): Review {
  return Review.create({
    id: ' review-1 ',
    missionId: ' mission-1 ',
    missionPlanRevision: ' revision-1 ',
    reviewCriteria: [
      {
        id: 'architecture',
        description: 'Implementation preserves architectural boundaries.',
      },
      {
        id: 'tests',
        description: 'Implementation includes unit tests.',
      },
    ],
    evidenceReferences: ['evidence-1', 'evidence-2'],
  });
}

function createFinding(id = 'finding-1'): Finding {
  return Finding.create({
    id,
    reviewId: 'review-1',
    severity: 'Major',
    category: 'Correction',
    summary: 'Lifecycle validation is missing.',
    description: 'The implementation must reject invalid lifecycle transitions.',
    supportingEvidenceReferences: ['evidence-1'],
    affectedArtifactReferences: ['src/kernel/review/review.aggregate.ts'],
    criteriaReferences: ['architecture'],
  });
}

describe('Review', () => {
  it('owns Review lifecycle, Findings, and completion outcome', () => {
    const review = createReview();

    expect(review.id.toString()).toBe('review-1');
    expect(review.status.toString()).toBe('Pending');

    review.start(metadata('event-started'));
    review.publishFinding(createFinding(), metadata('event-finding-created'));
    review.complete('Action Required', metadata('event-completed'));

    expect(review.toSnapshot()).toEqual({
      id: 'review-1',
      missionId: 'mission-1',
      missionPlanRevision: 'revision-1',
      status: 'Completed',
      outcome: 'Action Required',
      reviewCriteria: [
        {
          id: 'architecture',
          description: 'Implementation preserves architectural boundaries.',
        },
        {
          id: 'tests',
          description: 'Implementation includes unit tests.',
        },
      ],
      evidenceReferences: ['evidence-1', 'evidence-2'],
      findings: [
        {
          id: 'finding-1',
          reviewId: 'review-1',
          severity: 'Major',
          category: 'Correction',
          summary: 'Lifecycle validation is missing.',
          description: 'The implementation must reject invalid lifecycle transitions.',
          supportingEvidenceReferences: ['evidence-1'],
          affectedArtifactReferences: ['src/kernel/review/review.aggregate.ts'],
          criteriaReferences: ['architecture'],
          status: 'Created',
        },
      ],
    });
  });

  it('reconstitutes from snapshots without changing Review state', () => {
    const review = createReview();
    review.start(metadata('event-started'));
    review.publishFinding(createFinding(), metadata('event-finding-created'));
    review.complete('Rejected', metadata('event-completed'), metadata('event-rejected'));

    const restored = Review.fromSnapshot(review.toSnapshot());

    expect(restored).not.toBe(review);
    expect(restored.toSnapshot()).toEqual(review.toSnapshot());
  });

  it('rejects invalid Review lifecycle transitions and premature completion', () => {
    const review = createReview();

    expect(() => review.complete('Accepted', metadata('event-completed'))).toThrow(ReviewCompletionRejectedError);
    expect(() => review.publishFinding(createFinding(), metadata('event-finding-created'))).toThrow(
      InvalidReviewLifecycleTransitionError,
    );

    review.start(metadata('event-started'));
    review.complete('Accepted', metadata('event-completed'), metadata('event-accepted'));

    expect(() => review.start(metadata('event-started-again'))).toThrow(InvalidReviewLifecycleTransitionError);
    expect(() => review.publishFinding(createFinding(), metadata('event-finding-created'))).toThrow(
      InvalidReviewLifecycleTransitionError,
    );
  });

  it('rejects duplicate Findings and Findings unsupported by Review Evidence', () => {
    const review = createReview();
    review.start(metadata('event-started'));
    review.publishFinding(createFinding(), metadata('event-finding-created'));

    expect(() => review.publishFinding(createFinding(), metadata('event-duplicate'))).toThrow(DuplicateFindingError);
    expect(() =>
      review.publishFinding(
        Finding.create({
          ...createFinding('finding-2').toSnapshot(),
          supportingEvidenceReferences: ['missing-evidence'],
        }),
        metadata('event-unsupported'),
      ),
    ).toThrow(MissingEvidenceReferenceError);
  });

  it('validates Review construction and snapshot consistency', () => {
    expect(() =>
      Review.create({
        id: 'review-1',
        missionId: ' ',
        missionPlanRevision: 'revision-1',
        reviewCriteria: [{ id: 'architecture', description: 'Architecture.' }],
        evidenceReferences: ['evidence-1'],
      }),
    ).toThrow(InvalidReviewDefinitionError);

    expect(() =>
      Review.create({
        id: 'review-1',
        missionId: 'mission-1',
        missionPlanRevision: 'revision-1',
        reviewCriteria: [],
        evidenceReferences: ['evidence-1'],
      }),
    ).toThrow(InvalidReviewDefinitionError);

    expect(() =>
      Review.fromSnapshot({
        ...createReview().toSnapshot(),
        outcome: 'Accepted',
      }),
    ).toThrow(ReviewCompletionRejectedError);
  });

  it('records Review and Finding domain events and drains them deterministically', () => {
    const review = createReview();

    review.start(metadata('event-started'));
    review.publishFinding(createFinding(), metadata('event-finding-created'));
    review.complete('Rejected', metadata('event-completed'), metadata('event-rejected'));

    expect(review.pullDomainEvents().map((event) => ({
      eventId: event.eventId,
      missionId: event.missionId,
      eventType: event.eventType,
      attribution: event.attribution,
      payload: event.payload,
    }))).toEqual([
      {
        eventId: 'event-started',
        missionId: 'mission-1',
        eventType: 'ReviewStarted',
        attribution: {
          missionId: 'mission-1',
          missionPlanRevisionId: 'revision-1',
        },
        payload: {
          reviewId: 'review-1',
          missionPlanRevision: 'revision-1',
        },
      },
      {
        eventId: 'event-finding-created',
        missionId: 'mission-1',
        eventType: 'FindingCreated',
        attribution: {
          missionId: 'mission-1',
          missionPlanRevisionId: 'revision-1',
        },
        payload: {
          reviewId: 'review-1',
          findingId: 'finding-1',
          severity: 'Major',
          category: 'Correction',
          supportingEvidenceReferences: ['evidence-1'],
        },
      },
      {
        eventId: 'event-completed',
        missionId: 'mission-1',
        eventType: 'ReviewCompleted',
        attribution: {
          missionId: 'mission-1',
          missionPlanRevisionId: 'revision-1',
        },
        payload: {
          reviewId: 'review-1',
          outcome: 'Rejected',
        },
      },
      {
        eventId: 'event-rejected',
        missionId: 'mission-1',
        eventType: 'ReviewRejected',
        attribution: {
          missionId: 'mission-1',
          missionPlanRevisionId: 'revision-1',
        },
        payload: {
          reviewId: 'review-1',
          outcome: 'Rejected',
        },
      },
    ]);
    expect(review.pullDomainEvents()).toEqual([]);
  });
});

describe('Finding', () => {
  it('creates evidence-backed actionable Findings and observations deterministically', () => {
    const actionableFinding = createFinding();
    const observation = Finding.create({
      id: 'finding-2',
      reviewId: 'review-1',
      severity: 'Informational',
      summary: 'Tests are clear.',
      description: 'The implementation includes readable tests.',
      supportingEvidenceReferences: ['evidence-2'],
      affectedArtifactReferences: ['test/kernel/review/review.aggregate.test.ts'],
      criteriaReferences: ['tests'],
    });

    expect(actionableFinding.isActionable()).toBe(true);
    expect(observation.isActionable()).toBe(false);
    expect(observation.toSnapshot()).not.toHaveProperty('category');
  });

  it('owns Finding lifecycle transitions', () => {
    const acceptedFinding = createFinding();
    acceptedFinding.accept();
    acceptedFinding.resolve();

    expect(acceptedFinding.status.toString()).toBe('Resolved');

    const dismissedFinding = createFinding('finding-2');
    dismissedFinding.dismiss();

    expect(dismissedFinding.status.toString()).toBe('Dismissed');
    expect(() => dismissedFinding.accept()).toThrow(InvalidFindingLifecycleTransitionError);
  });

  it('requires evidence, artifacts, and criteria references', () => {
    expect(() =>
      Finding.create({
        id: 'finding-1',
        reviewId: 'review-1',
        severity: 'Minor',
        summary: 'Missing evidence.',
        description: 'Findings must reference supporting Evidence.',
        supportingEvidenceReferences: [],
        affectedArtifactReferences: ['src/kernel/review/finding.ts'],
        criteriaReferences: ['architecture'],
      }),
    ).toThrow(MissingEvidenceReferenceError);

    expect(() =>
      Finding.create({
        id: 'finding-1',
        reviewId: 'review-1',
        severity: 'Minor',
        summary: 'Missing artifact.',
        description: 'Findings must reference affected artifacts.',
        supportingEvidenceReferences: ['evidence-1'],
        affectedArtifactReferences: [],
        criteriaReferences: ['architecture'],
      }),
    ).toThrow(InvalidReviewDefinitionError);
  });
});
