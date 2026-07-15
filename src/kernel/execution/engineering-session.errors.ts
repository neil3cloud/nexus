import { KernelError } from '../common/kernel-error';

export class EngineeringSessionDomainError extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'EngineeringSessionDomainError';
  }
}

export class InvalidEngineeringSessionDefinitionError extends EngineeringSessionDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidEngineeringSessionDefinitionError';
  }
}

export class InvalidEngineeringSessionLifecycleTransitionError extends EngineeringSessionDomainError {
  public constructor(currentStatus: string, targetStatus: string) {
    super(`EngineeringSession cannot transition from '${currentStatus}' to '${targetStatus}'.`);
    this.name = 'InvalidEngineeringSessionLifecycleTransitionError';
  }
}

export class DuplicateEngineeringSessionError extends EngineeringSessionDomainError {
  public constructor(engineeringSessionId: string) {
    super(`EngineeringSession '${engineeringSessionId}' already exists.`);
    this.name = 'DuplicateEngineeringSessionError';
  }
}

export class EngineeringSessionNotFoundError extends EngineeringSessionDomainError {
  public constructor(engineeringSessionId: string) {
    super(`EngineeringSession '${engineeringSessionId}' was not found.`);
    this.name = 'EngineeringSessionNotFoundError';
  }
}

export class DuplicateEngineeringSessionCheckpointError extends EngineeringSessionDomainError {
  public constructor(checkpointId: string) {
    super(`EngineeringSessionCheckpoint '${checkpointId}' already exists.`);
    this.name = 'DuplicateEngineeringSessionCheckpointError';
  }
}

export class EngineeringSessionCheckpointNotFoundError extends EngineeringSessionDomainError {
  public constructor(checkpointId: string) {
    super(`EngineeringSessionCheckpoint '${checkpointId}' was not found.`);
    this.name = 'EngineeringSessionCheckpointNotFoundError';
  }
}
