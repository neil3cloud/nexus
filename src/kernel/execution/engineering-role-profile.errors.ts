import { KernelError } from '../common/kernel-error';

export class EngineeringRoleProfileDomainError extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'EngineeringRoleProfileDomainError';
  }
}

export class InvalidEngineeringRoleProfileDefinitionError extends EngineeringRoleProfileDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidEngineeringRoleProfileDefinitionError';
  }
}

export class DuplicateEngineeringRoleProfileRegistrationError extends EngineeringRoleProfileDomainError {
  public constructor(roleId: string) {
    super(`EngineeringRoleProfile for ExecutionRole '${roleId}' is already registered.`);
    this.name = 'DuplicateEngineeringRoleProfileRegistrationError';
  }
}

export class UnknownEngineeringRoleProfileError extends EngineeringRoleProfileDomainError {
  public constructor(roleId: string) {
    super(`EngineeringRoleProfile for ExecutionRole '${roleId}' is not registered.`);
    this.name = 'UnknownEngineeringRoleProfileError';
  }
}

