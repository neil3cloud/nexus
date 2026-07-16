import { KernelError } from '../common/kernel-error';

export class InvalidEngineeringDecisionCorrelationDefinitionError extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidEngineeringDecisionCorrelationDefinitionError';
  }
}

export class EngineeringDecisionCorrelationNotFoundError extends KernelError {
  public constructor(engineeringDecisionCorrelationId: string) {
    super(`EngineeringDecisionCorrelation '${engineeringDecisionCorrelationId}' was not found.`);
    this.name = 'EngineeringDecisionCorrelationNotFoundError';
  }
}

export class DuplicateEngineeringDecisionCorrelationError extends KernelError {
  public constructor(engineeringDecisionCorrelationId: string) {
    super(`EngineeringDecisionCorrelation '${engineeringDecisionCorrelationId}' already exists.`);
    this.name = 'DuplicateEngineeringDecisionCorrelationError';
  }
}

export class EngineeringDecisionCorrelationAssociationRejectedError extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'EngineeringDecisionCorrelationAssociationRejectedError';
  }
}

