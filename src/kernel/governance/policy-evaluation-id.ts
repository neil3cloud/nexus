import { InvalidGovernanceDecisionDefinitionError } from './governance.errors';

export class PolicyEvaluationId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): PolicyEvaluationId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidGovernanceDecisionDefinitionError(
        'PolicyEvaluationId must be a non-empty string.',
      );
    }

    return new PolicyEvaluationId(normalized);
  }

  public equals(other: PolicyEvaluationId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
