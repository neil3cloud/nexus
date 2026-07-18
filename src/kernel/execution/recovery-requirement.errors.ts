import { KernelError } from '../common/kernel-error';

export class InvalidRecoveryRequirementDefinitionError extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidRecoveryRequirementDefinitionError';
  }
}

export class RecoveryRequirementNotFoundError extends KernelError {
  public constructor(recoveryRequirementId: string) {
    super(`RecoveryRequirement '${recoveryRequirementId}' was not found.`);
    this.name = 'RecoveryRequirementNotFoundError';
  }
}

export class DuplicateRecoveryRequirementError extends KernelError {
  public constructor(recoveryRequirementId: string) {
    super(`RecoveryRequirement '${recoveryRequirementId}' already exists.`);
    this.name = 'DuplicateRecoveryRequirementError';
  }
}

