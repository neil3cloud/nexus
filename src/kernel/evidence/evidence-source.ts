import { InvalidEvidenceException } from './evidence.errors';

export class EvidenceSource {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): EvidenceSource {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidEvidenceException('EvidenceSource must be a non-empty string.');
    }

    return new EvidenceSource(normalized);
  }

  public equals(other: EvidenceSource): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
