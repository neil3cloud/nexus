import { InvalidReviewDefinitionError } from './review.errors';

export class ReviewId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): ReviewId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidReviewDefinitionError('ReviewId must be a non-empty string.');
    }

    return new ReviewId(normalized);
  }

  public equals(other: ReviewId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
