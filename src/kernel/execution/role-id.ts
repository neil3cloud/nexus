import { InvalidRoleDefinitionError } from './role.errors';

export class RoleId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): RoleId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidRoleDefinitionError('RoleId must be a non-empty string.');
    }

    return new RoleId(normalized);
  }

  public equals(other: RoleId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}

