import { InvalidWorkflowChainDefinitionError } from './workflow-chain.errors';

export class WorkflowChainId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): WorkflowChainId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidWorkflowChainDefinitionError(
        'WorkflowChainId must be a non-empty string.',
      );
    }

    return new WorkflowChainId(normalized);
  }

  public equals(other: WorkflowChainId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
