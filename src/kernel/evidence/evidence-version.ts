import { InvalidEvidenceException } from './evidence.errors';

export class EvidenceVersion {
  private constructor(private readonly value: number) {
    Object.freeze(this);
  }

  public static fromNumber(value: number): EvidenceVersion {
    if (!Number.isInteger(value) || value < 1) {
      throw new InvalidEvidenceException('EvidenceVersion must be a positive integer.');
    }

    return new EvidenceVersion(value);
  }

  public equals(other: EvidenceVersion): boolean {
    return this.value === other.value;
  }

  public toNumber(): number {
    return this.value;
  }

  public toJSON(): number {
    return this.value;
  }
}
