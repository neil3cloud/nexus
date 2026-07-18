import { KernelError } from '../common/kernel-error';

export class WorkflowChainDomainError extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'WorkflowChainDomainError';
  }
}

export class InvalidWorkflowChainDefinitionError extends WorkflowChainDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidWorkflowChainDefinitionError';
  }
}

export class DuplicateWorkflowChainError extends WorkflowChainDomainError {
  public constructor(workflowChainId: string) {
    super(`WorkflowChain '${workflowChainId}' already exists.`);
    this.name = 'DuplicateWorkflowChainError';
  }
}

export class WorkflowChainNotFoundError extends WorkflowChainDomainError {
  public constructor(workflowChainId: string) {
    super(`WorkflowChain '${workflowChainId}' was not found.`);
    this.name = 'WorkflowChainNotFoundError';
  }
}
