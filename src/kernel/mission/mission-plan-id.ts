import { MissionPlanningValidationError } from './mission.errors';

export class MissionPlanId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): MissionPlanId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new MissionPlanningValidationError('MissionPlan identity must be a non-empty string.');
    }

    return new MissionPlanId(normalized);
  }

  public equals(other: MissionPlanId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}

