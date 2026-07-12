import { Finding } from './finding';
import { Review } from './review.aggregate';
import { ReviewId } from './review-id';
import type { ReviewSnapshot } from './review.types';
import { DuplicateReviewError } from './review.errors';

export interface IReviewRepository {
  create(review: Review): Promise<void>;
  save(review: Review): Promise<void>;
  getById(reviewId: ReviewId | string): Promise<Review | undefined>;
  exists(reviewId: ReviewId | string): Promise<boolean>;
  enumerate(): Promise<readonly Review[]>;
  enumerateFindings(reviewId: ReviewId | string): Promise<readonly Finding[]>;
}

export class InMemoryReviewRepository implements IReviewRepository {
  private readonly reviewsById = new Map<string, ReviewSnapshot>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async create(review: Review): Promise<void> {
    await this.runExclusive(() => {
      const reviewId = review.id.toString();

      if (this.reviewsById.has(reviewId)) {
        throw new DuplicateReviewError(reviewId);
      }

      this.reviewsById.set(reviewId, review.toSnapshot());
    });
  }

  public async save(review: Review): Promise<void> {
    await this.runExclusive(() => {
      this.reviewsById.set(review.id.toString(), review.toSnapshot());
    });
  }

  public async getById(reviewId: ReviewId | string): Promise<Review | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.reviewsById.get(normalizeReviewId(reviewId).toString());

      if (snapshot === undefined) {
        return undefined;
      }

      return Review.fromSnapshot(snapshot);
    });
  }

  public async exists(reviewId: ReviewId | string): Promise<boolean> {
    return this.runExclusive(() => this.reviewsById.has(normalizeReviewId(reviewId).toString()));
  }

  public async enumerate(): Promise<readonly Review[]> {
    return this.runExclusive(() =>
      Object.freeze(
        [...this.reviewsById.values()]
          .map((snapshot) => Review.fromSnapshot(snapshot))
          .sort((left, right) => left.id.toString().localeCompare(right.id.toString())),
      ),
    );
  }

  public async enumerateFindings(reviewId: ReviewId | string): Promise<readonly Finding[]> {
    return this.runExclusive(() => {
      const snapshot = this.reviewsById.get(normalizeReviewId(reviewId).toString());

      if (snapshot === undefined) {
        return Object.freeze([]);
      }

      return Review.fromSnapshot(snapshot).findings;
    });
  }

  private async runExclusive<T>(operation: () => T): Promise<T> {
    const run = this.operationQueue.then(operation, operation);
    this.operationQueue = run.then(
      () => undefined,
      () => undefined,
    );

    return run;
  }
}

function normalizeReviewId(reviewId: ReviewId | string): ReviewId {
  return typeof reviewId === 'string' ? ReviewId.fromString(reviewId) : reviewId;
}
