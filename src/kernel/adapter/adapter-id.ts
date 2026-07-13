import { InvalidAdapterDefinitionError } from './adapter.errors';

export class AdapterId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): AdapterId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidAdapterDefinitionError('AdapterId must be a non-empty string.');
    }

    return new AdapterId(normalized);
  }

  public equals(other: AdapterId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
