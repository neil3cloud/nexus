import { describe, expect, it } from 'vitest';

import { EventBus } from '../../../src/kernel/events/event-bus';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';
import {
  DuplicateFindingError,
  DuplicateReviewError,
  ReviewEventPublisherUnavailableError,
  ReviewNotFoundError,
} from '../../../src/kernel/review/review.errors';
import { InMemoryReviewRepository } from '../../../src/kernel/review/review.repository';
import { ReviewService } from '../../../src/kernel/review/review.service';

class TestLogger implements KernelLogger {
  public info(): void {}

  public error(): void {}
}

function sequence(values: readonly string[]): () => string {
  let index = 0;

  return () => {
    const value = values[index];

    if (value === undefined) {
      throw new Error('Sequence exhausted.');
    }

    index += 1;

    return value;
  };
}

function startReviewCommand(id = 'review-1') {
  return {
    id,
    missionId: 'mission-1',
    missionPlanRevision: 'revision-1',
    reviewCriteria: [{ id: 'architecture', description: 'Architecture criteria.' }],
    evidenceReferences: ['evidence-1'],
  };
}

describe('ReviewService', () => {
  it('coordinates Review creation, Finding publication, outcome finalization, and retrieval', async () => {
    const service = new ReviewService(
      new InMemoryReviewRepository(),
      new EventBus(new TestLogger()),
      sequence(['event-started', 'event-finding-created', 'event-completed']),
      () => '2026-07-12T00:00:00.000Z',
    );

    const review = await service.startReview(startReviewCommand());
    const finding = await service.publishFinding({
      reviewId: review.id,
      findingId: 'finding-1',
      severity: 'Major',
      category: 'Correction',
      summary: 'Review validation is missing.',
      description: 'The Review aggregate must reject invalid lifecycle transitions.',
      supportingEvidenceReferences: ['evidence-1'],
      affectedArtifactReferences: ['src/kernel/review/review.aggregate.ts'],
      criteriaReferences: ['architecture'],
    });
    const result = await service.finalizeReviewOutcome({
      reviewId: review.id,
      outcome: 'Action Required',
    });

    expect(finding.id).toBe('finding-1');
    expect(result.review.status).toBe('Completed');
    expect(result.review.outcome).toBe('Action Required');
    expect((await service.queryReviewResult({ reviewId: review.id })).findings).toHaveLength(1);
    expect((await service.enumerateReviews()).map((item) => item.id.toString())).toEqual(['review-1']);
    expect((await service.enumerateFindings('review-1')).map((item) => item.id.toString())).toEqual([
      'finding-1',
    ]);
  });

  it('uses injected identity generation without provider or adapter concepts', async () => {
    const service = new ReviewService(
      new InMemoryReviewRepository(),
      new EventBus(new TestLogger()),
      sequence(['generated-review', 'event-started']),
      () => '2026-07-12T00:00:00.000Z',
    );

    const review = await service.startReview({
      missionId: 'mission-1',
      missionPlanRevision: 'revision-1',
      reviewCriteria: [{ id: 'tests', description: 'Tests exist.' }],
      evidenceReferences: ['evidence-1'],
    });

    expect(review.id).toBe('generated-review');
  });

  it('surfaces deterministic repository and aggregate diagnostics', async () => {
    const service = new ReviewService(
      new InMemoryReviewRepository(),
      new EventBus(new TestLogger()),
      sequence([
        'event-started',
        'event-started-duplicate',
        'event-finding-created',
        'event-finding-duplicate',
      ]),
      () => '2026-07-12T00:00:00.000Z',
    );

    await service.startReview(startReviewCommand());

    await expect(service.startReview(startReviewCommand())).rejects.toThrow(DuplicateReviewError);
    await expect(service.queryReviewResult({ reviewId: 'missing-review' })).rejects.toThrow(
      ReviewNotFoundError,
    );

    await service.publishFinding({
      reviewId: 'review-1',
      findingId: 'finding-1',
      severity: 'Minor',
      category: 'Documentation',
      summary: 'Documentation missing.',
      description: 'Implementation documentation is required.',
      supportingEvidenceReferences: ['evidence-1'],
      affectedArtifactReferences: ['IMPLEMENTATION_REPORT.md'],
      criteriaReferences: ['architecture'],
    });

    await expect(
      service.publishFinding({
        reviewId: 'review-1',
        findingId: 'finding-1',
        severity: 'Minor',
        category: 'Documentation',
        summary: 'Documentation missing.',
        description: 'Implementation documentation is required.',
        supportingEvidenceReferences: ['evidence-1'],
        affectedArtifactReferences: ['IMPLEMENTATION_REPORT.md'],
        criteriaReferences: ['architecture'],
      }),
    ).rejects.toThrow(DuplicateFindingError);
  });

  it('publishes Review and Finding events with outcome-conditional completion events', async () => {
    const eventBus = new EventBus(new TestLogger());
    const service = new ReviewService(
      new InMemoryReviewRepository(),
      eventBus,
      sequence([
        'event-started-accepted',
        'event-completed-accepted',
        'event-accepted',
        'event-started-observed',
        'event-completed-observed',
        'event-observed',
        'event-started-rejected',
        'event-completed-rejected',
        'event-rejected',
        'event-started-action',
        'event-finding-created',
        'event-completed-action',
      ]),
      () => '2026-07-12T00:00:00.000Z',
    );

    await service.startReview(startReviewCommand('review-accepted'));
    await service.finalizeReviewOutcome({
      reviewId: 'review-accepted',
      outcome: 'Accepted',
    });
    await service.startReview(startReviewCommand('review-observed'));
    await service.finalizeReviewOutcome({
      reviewId: 'review-observed',
      outcome: 'Accepted With Observations',
    });
    await service.startReview(startReviewCommand('review-rejected'));
    await service.finalizeReviewOutcome({
      reviewId: 'review-rejected',
      outcome: 'Rejected',
    });
    await service.startReview(startReviewCommand('review-action'));
    await service.publishFinding({
      reviewId: 'review-action',
      findingId: 'finding-1',
      severity: 'Major',
      category: 'Correction',
      summary: 'Review validation is missing.',
      description: 'The Review aggregate must reject invalid lifecycle transitions.',
      supportingEvidenceReferences: ['evidence-1'],
      affectedArtifactReferences: ['src/kernel/review/review.aggregate.ts'],
      criteriaReferences: ['architecture'],
    });
    await service.finalizeReviewOutcome({
      reviewId: 'review-action',
      outcome: 'Action Required',
    });

    expect(eventBus.replay('mission-1').map((event) => event.eventType)).toEqual([
      'ReviewStarted',
      'ReviewCompleted',
      'ReviewAccepted',
      'ReviewStarted',
      'ReviewCompleted',
      'ReviewAccepted',
      'ReviewStarted',
      'ReviewCompleted',
      'ReviewRejected',
      'ReviewStarted',
      'FindingCreated',
      'ReviewCompleted',
    ]);
  });

  it('requires an EventBusContract before mutating Review state', async () => {
    const repository = new InMemoryReviewRepository();
    const service = new ReviewService(repository, undefined, sequence(['event-started']));

    await expect(service.startReview(startReviewCommand())).rejects.toThrow(
      ReviewEventPublisherUnavailableError,
    );
    await expect(repository.enumerate()).resolves.toEqual([]);
  });
});
