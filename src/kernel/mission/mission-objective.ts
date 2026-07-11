import { MissionObjectiveError } from './mission.errors';

export class MissionObjective {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): MissionObjective {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new MissionObjectiveError('Mission objective must be a non-empty string.');
    }

    return new MissionObjective(normalized);
  }

  public equals(other: MissionObjective): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}

