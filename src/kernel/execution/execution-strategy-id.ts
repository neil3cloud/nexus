import { InvalidExecutionStrategyDefinitionError } from './execution-strategy.errors';

export class ExecutionStrategyId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): ExecutionStrategyId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidExecutionStrategyDefinitionError(
        'ExecutionStrategyId must be a non-empty string.',
      );
    }

    return new ExecutionStrategyId(normalized);
  }

  public equals(other: ExecutionStrategyId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
