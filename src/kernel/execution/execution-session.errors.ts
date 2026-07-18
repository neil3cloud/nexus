import { KernelError } from '../common/kernel-error';

export class ExecutionSessionDomainError extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'ExecutionSessionDomainError';
  }
}

export class InvalidExecutionSessionDefinitionError extends ExecutionSessionDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidExecutionSessionDefinitionError';
  }
}

export class DuplicateExecutionSessionError extends ExecutionSessionDomainError {
  public constructor(executionSessionId: string) {
    super(`ExecutionSession '${executionSessionId}' already exists.`);
    this.name = 'DuplicateExecutionSessionError';
  }
}

export class ExecutionSessionNotFoundError extends ExecutionSessionDomainError {
  public constructor(executionSessionId: string) {
    super(`ExecutionSession '${executionSessionId}' was not found.`);
    this.name = 'ExecutionSessionNotFoundError';
  }
}
