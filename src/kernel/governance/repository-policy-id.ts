import { InvalidRepositoryPolicyDefinitionError } from './repository-policy.errors';

export class RepositoryPolicyId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): RepositoryPolicyId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidRepositoryPolicyDefinitionError(
        'RepositoryPolicyId must be a non-empty string.',
      );
    }

    return new RepositoryPolicyId(normalized);
  }

  public equals(other: RepositoryPolicyId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
