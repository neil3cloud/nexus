import { InvalidEngineeringDecisionCorrelationDefinitionError } from './engineering-decision-correlation.errors';

export class EngineeringDecisionCorrelationId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): EngineeringDecisionCorrelationId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidEngineeringDecisionCorrelationDefinitionError(
        'EngineeringDecisionCorrelationId must be a non-empty string.',
      );
    }

    return new EngineeringDecisionCorrelationId(normalized);
  }

  public equals(other: EngineeringDecisionCorrelationId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}

