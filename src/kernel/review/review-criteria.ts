import type { ReviewCriteriaSnapshot } from './review.types';
import { InvalidReviewDefinitionError } from './review.errors';

export interface ReviewCriteriaInput {
  readonly id: string;
  readonly description: string;
}

export class ReviewCriteria {
  private constructor(
    private readonly criteriaId: string,
    private readonly criteriaDescription: string,
  ) {
    Object.freeze(this);
  }

  public static create(input: ReviewCriteriaInput): ReviewCriteria {
    return new ReviewCriteria(
      normalizeNonEmptyString(input.id, 'ReviewCriteria identity'),
      normalizeNonEmptyString(input.description, 'ReviewCriteria description'),
    );
  }

  public static fromSnapshot(snapshot: ReviewCriteriaSnapshot): ReviewCriteria {
    return ReviewCriteria.create(snapshot);
  }

  public get id(): string {
    return this.criteriaId;
  }

  public get description(): string {
    return this.criteriaDescription;
  }

  public toSnapshot(): ReviewCriteriaSnapshot {
    return Object.freeze({
      id: this.criteriaId,
      description: this.criteriaDescription,
    });
  }
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidReviewDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
