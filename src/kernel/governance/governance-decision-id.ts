import { InvalidGovernanceDecisionDefinitionError } from './governance.errors';

export class GovernanceDecisionId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): GovernanceDecisionId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidGovernanceDecisionDefinitionError(
        'GovernanceDecisionId must be a non-empty string.',
      );
    }

    return new GovernanceDecisionId(normalized);
  }

  public equals(other: GovernanceDecisionId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
