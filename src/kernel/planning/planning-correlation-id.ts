import { InvalidPlanningCorrelationDefinitionError } from './planning.errors';

export class PlanningCorrelationId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): PlanningCorrelationId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidPlanningCorrelationDefinitionError(
        'PlanningCorrelationId must be a non-empty string.',
      );
    }

    return new PlanningCorrelationId(normalized);
  }

  public equals(other: PlanningCorrelationId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
