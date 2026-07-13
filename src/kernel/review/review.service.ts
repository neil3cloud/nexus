import { randomUUID } from 'node:crypto';

import type { EventBusContract } from '../common/event-bus-contract';
import { ServiceLifecycle } from '../common/service-lifecycle';
import { Finding } from './finding';
import { Review } from './review.aggregate';
import type {
  FinalizeReviewOutcomeCommand,
  PublishFindingCommand,
  QueryReviewResult,
  ReviewResult,
  ReviewServiceContract,
  StartReviewCommand,
} from './review.contract';
import { ReviewId } from './review-id';
import { InMemoryReviewRepository, type IReviewRepository } from './review.repository';
import type { FindingSnapshot, ReviewSnapshot } from './review.types';
import { ReviewEventPublisherUnavailableError, ReviewNotFoundError } from './review.errors';

export class ReviewService extends ServiceLifecycle implements ReviewServiceContract {
  public constructor(
    private readonly repository: IReviewRepository = new InMemoryReviewRepository(),
    private readonly eventBus?: EventBusContract,
    private readonly createIdentity: () => string = randomUUID,
    private readonly createTimestamp: () => string = () => new Date().toISOString(),
  ) {
    super('ReviewService');
  }

  public async startReview(command: StartReviewCommand): Promise<ReviewSnapshot> {
    const eventBus = this.requireEventBus();
    const review = Review.create({
      id: command.id ?? this.createIdentity(),
      missionId: command.missionId,
      missionPlanRevision: command.missionPlanRevision,
      reviewCriteria: command.reviewCriteria,
      evidenceReferences: command.evidenceReferences,
    });

    review.start(this.createEventMetadata());

    await this.repository.create(review);
    await this.publishRecordedEvents(review, eventBus);

    return review.toSnapshot();
  }

  public async publishFinding(command: PublishFindingCommand): Promise<FindingSnapshot> {
    const eventBus = this.requireEventBus();
    const review = await this.requireReview(command.reviewId);
    const finding = Finding.create({
      id: command.findingId ?? this.createIdentity(),
      reviewId: review.id,
      severity: command.severity,
      ...(command.category === undefined ? {} : { category: command.category }),
      summary: command.summary,
      description: command.description,
      supportingEvidenceReferences: command.supportingEvidenceReferences,
      affectedArtifactReferences: command.affectedArtifactReferences,
      criteriaReferences: command.criteriaReferences,
    });

    review.publishFinding(finding, this.createEventMetadata());

    await this.repository.save(review);
    await this.publishRecordedEvents(review, eventBus);

    return finding.toSnapshot();
  }

  public async finalizeReviewOutcome(command: FinalizeReviewOutcomeCommand): Promise<ReviewResult> {
    const eventBus = this.requireEventBus();
    const review = await this.requireReview(command.reviewId);

    review.complete(
      command.outcome,
      this.createEventMetadata(),
      requiresOutcomeSpecificEvent(command.outcome) ? this.createEventMetadata() : undefined,
    );

    await this.repository.save(review);
    await this.publishRecordedEvents(review, eventBus);

    return toReviewResult(review);
  }

  public async queryReviewResult(query: QueryReviewResult): Promise<ReviewResult> {
    return toReviewResult(await this.requireReview(query.reviewId));
  }

  public async retrieveReview(reviewId: ReviewId | string): Promise<Review> {
    return this.requireReview(reviewId);
  }

  public async enumerateReviews(): Promise<readonly Review[]> {
    return this.repository.enumerate();
  }

  public async enumerateFindings(reviewId: ReviewId | string): Promise<readonly Finding[]> {
    const normalizedReviewId = normalizeReviewId(reviewId);

    if (!(await this.repository.exists(normalizedReviewId))) {
      throw new ReviewNotFoundError(normalizedReviewId.toString());
    }

    return this.repository.enumerateFindings(normalizedReviewId);
  }

  private async requireReview(reviewId: ReviewId | string): Promise<Review> {
    const normalizedReviewId = normalizeReviewId(reviewId);
    const review = await this.repository.getById(normalizedReviewId);

    if (review === undefined) {
      throw new ReviewNotFoundError(normalizedReviewId.toString());
    }

    return review;
  }

  private createEventMetadata(): {
    readonly eventId: string;
    readonly timestamp: string;
  } {
    return {
      eventId: this.createIdentity(),
      timestamp: this.createTimestamp(),
    };
  }

  private async publishRecordedEvents(review: Review, eventBus: EventBusContract): Promise<void> {
    for (const event of review.pullDomainEvents()) {
      await eventBus.publish(event);
    }
  }

  private requireEventBus(): EventBusContract {
    if (this.eventBus === undefined) {
      throw new ReviewEventPublisherUnavailableError();
    }

    return this.eventBus;
  }
}

function normalizeReviewId(reviewId: ReviewId | string): ReviewId {
  return typeof reviewId === 'string' ? ReviewId.fromString(reviewId) : reviewId;
}

function requiresOutcomeSpecificEvent(outcome: string): boolean {
  const normalizedOutcome = outcome.trim();

  return (
    normalizedOutcome === 'Accepted' ||
    normalizedOutcome === 'Accepted With Observations' ||
    normalizedOutcome === 'Rejected'
  );
}

function toReviewResult(review: Review): ReviewResult {
  const snapshot = review.toSnapshot();

  return Object.freeze({
    review: snapshot,
    findings: snapshot.findings,
  });
}
