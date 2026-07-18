import { InvalidRecoveryRequirementDefinitionError } from './recovery-requirement.errors';

export class RecoveryRequirementId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): RecoveryRequirementId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidRecoveryRequirementDefinitionError(
        'RecoveryRequirementId must be a non-empty string.',
      );
    }

    return new RecoveryRequirementId(normalized);
  }

  public equals(other: RecoveryRequirementId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}

