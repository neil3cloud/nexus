import { KernelError } from '../common/kernel-error';

export class ExecutionStrategyDomainError extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'ExecutionStrategyDomainError';
  }
}

export class InvalidExecutionStrategyDefinitionError extends ExecutionStrategyDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidExecutionStrategyDefinitionError';
  }
}

export class DuplicateExecutionStrategyError extends ExecutionStrategyDomainError {
  public constructor(executionStrategyId: string) {
    super(`ExecutionStrategy '${executionStrategyId}' already exists.`);
    this.name = 'DuplicateExecutionStrategyError';
  }
}

export class DuplicateExecutionStrategyForMissionError extends ExecutionStrategyDomainError {
  public constructor(missionId: string) {
    super(`Mission '${missionId}' already has an ExecutionStrategy.`);
    this.name = 'DuplicateExecutionStrategyForMissionError';
  }
}

export class ExecutionStrategyNotFoundError extends ExecutionStrategyDomainError {
  public constructor(executionStrategyId: string) {
    super(`ExecutionStrategy '${executionStrategyId}' was not found.`);
    this.name = 'ExecutionStrategyNotFoundError';
  }
}

export class ExecutionStrategyReferenceError extends ExecutionStrategyDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'ExecutionStrategyReferenceError';
  }
}

export class UnsatisfiedDependencyOrderingError extends ExecutionStrategyDomainError {
  public constructor(taskId: string, unsatisfiedTaskIds: readonly string[]) {
    super(
      `Task '${taskId}' cannot be considered execution-ready because dependency ordering is unsatisfied for Task(s): ${unsatisfiedTaskIds.join(', ')}.`,
    );
    this.name = 'UnsatisfiedDependencyOrderingError';
  }
}
