import { InvalidReviewDefinitionError } from './review.errors';

export class FindingId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): FindingId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidReviewDefinitionError('FindingId must be a non-empty string.');
    }

    return new FindingId(normalized);
  }

  public equals(other: FindingId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
