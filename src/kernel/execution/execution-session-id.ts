import { InvalidExecutionSessionDefinitionError } from './execution-session.errors';

export class ExecutionSessionId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): ExecutionSessionId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidExecutionSessionDefinitionError(
        'ExecutionSessionId must be a non-empty string.',
      );
    }

    return new ExecutionSessionId(normalized);
  }

  public equals(other: ExecutionSessionId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
