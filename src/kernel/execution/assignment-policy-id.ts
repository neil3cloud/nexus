import { InvalidAssignmentPolicyDefinitionError } from './assignment-policy.errors';

export class AssignmentPolicyId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): AssignmentPolicyId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidAssignmentPolicyDefinitionError(
        'AssignmentPolicyId must be a non-empty string.',
      );
    }

    return new AssignmentPolicyId(normalized);
  }

  public equals(other: AssignmentPolicyId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
