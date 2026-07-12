import { InvalidEvidenceException } from './evidence.errors';

export class EvidenceHash {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): EvidenceHash {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidEvidenceException('EvidenceHash must be a non-empty string.');
    }

    return new EvidenceHash(normalized);
  }

  public equals(other: EvidenceHash): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
