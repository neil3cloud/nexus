import { MissionIdentityError } from './mission.errors';

export class MissionId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): MissionId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new MissionIdentityError('Mission identity must be a non-empty string.');
    }

    return new MissionId(normalized);
  }

  public equals(other: MissionId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}

