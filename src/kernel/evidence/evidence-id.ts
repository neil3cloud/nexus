import { InvalidEvidenceException } from './evidence.errors';

export class EvidenceId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): EvidenceId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidEvidenceException('EvidenceId must be a non-empty string.');
    }

    return new EvidenceId(normalized);
  }

  public equals(other: EvidenceId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
