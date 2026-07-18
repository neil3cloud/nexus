import { describe, expect, it } from 'vitest';

import { Finding } from '../../../src/kernel/review/finding';
import type { DomainEventMetadata } from '../../../src/kernel/mission/mission.types';
import { Review } from '../../../src/kernel/review/review.aggregate';
import { DuplicateReviewError } from '../../../src/kernel/review/review.errors';
import { InMemoryReviewRepository } from '../../../src/kernel/review/review.repository';

function metadata(eventId: string): DomainEventMetadata {
  return {
    eventId,
    timestamp: '2026-07-12T00:00:00.000Z',
  };
}

function createReview(reviewId: string): Review {
  const review = Review.create({
    id: reviewId,
    missionId: `mission-${reviewId}`,
    missionPlanRevision: {
      kind: 'ExecutableMissionPlan',
      revisionId: 'revision-1',
    },
    reviewCriteria: [{ id: 'architecture', description: 'Architecture criteria.' }],
    evidenceReferences: ['evidence-1'],
  });

  review.start(metadata(`event-started-${reviewId}`));

  return review;
}

describe('InMemoryReviewRepository', () => {
  it('persists, retrieves, and enumerates Reviews deterministically', async () => {
    const repository = new InMemoryReviewRepository();
    const reviewB = createReview('review-b');
    const reviewA = createReview('review-a');

    await repository.create(reviewB);
    await repository.create(reviewA);

    expect(await repository.exists('review-a')).toBe(true);
    expect((await repository.getById('review-a'))?.toSnapshot()).toEqual(reviewA.toSnapshot());
    expect((await repository.enumerate()).map((review) => review.id.toString())).toEqual([
      'review-a',
      'review-b',
    ]);
  });

  it('rejects duplicate Review creation', async () => {
    const repository = new InMemoryReviewRepository();
    const review = createReview('review-1');

    await repository.create(review);

    await expect(repository.create(review)).rejects.toThrow(DuplicateReviewError);
  });

  it('persists Findings as part of the Review snapshot', async () => {
    const repository = new InMemoryReviewRepository();
    const review = createReview('review-1');

    review.publishFinding(
      Finding.create({
        id: 'finding-1',
        reviewId: 'review-1',
        severity: 'Minor',
        category: 'Documentation',
        summary: 'Documentation needs update.',
        description: 'Sprint documentation must describe RFC coverage.',
        supportingEvidenceReferences: ['evidence-1'],
        affectedArtifactReferences: ['IMPLEMENTATION_REPORT.md'],
        criteriaReferences: ['architecture'],
      }),
      metadata('event-finding-created'),
    );

    await repository.create(review);

    expect((await repository.enumerateFindings('review-1')).map((finding) => finding.id.toString())).toEqual([
      'finding-1',
    ]);
  });
});
