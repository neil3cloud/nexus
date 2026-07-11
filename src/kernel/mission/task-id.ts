import { MissionPlanningValidationError } from './mission.errors';

export class TaskId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): TaskId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new MissionPlanningValidationError('Task identity must be a non-empty string.');
    }

    return new TaskId(normalized);
  }

  public equals(other: TaskId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}

