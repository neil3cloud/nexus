import { KernelError } from '../common/kernel-error';

export class RoleDomainError extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'RoleDomainError';
  }
}

export class InvalidRoleDefinitionError extends RoleDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidRoleDefinitionError';
  }
}

export class DuplicateRoleRegistrationError extends RoleDomainError {
  public constructor(roleId: string) {
    super(`ExecutionRole '${roleId}' is already registered.`);
    this.name = 'DuplicateRoleRegistrationError';
  }
}

export class UnknownExecutionRoleError extends RoleDomainError {
  public constructor(roleId: string) {
    super(`ExecutionRole '${roleId}' is not registered.`);
    this.name = 'UnknownExecutionRoleError';
  }
}

export class DuplicateRoleAssignmentError extends RoleDomainError {
  public constructor(taskId: string) {
    super(`Task '${taskId}' already has a RoleAssignment.`);
    this.name = 'DuplicateRoleAssignmentError';
  }
}

export class RoleAssignmentNotFoundError extends RoleDomainError {
  public constructor(taskId: string) {
    super(`Task '${taskId}' does not have a RoleAssignment.`);
    this.name = 'RoleAssignmentNotFoundError';
  }
}

