import { KernelError } from '../common/kernel-error';

export class AssignmentPolicyDomainError extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'AssignmentPolicyDomainError';
  }
}

export class InvalidAssignmentPolicyDefinitionError extends AssignmentPolicyDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidAssignmentPolicyDefinitionError';
  }
}

export class DuplicateAssignmentPolicyError extends AssignmentPolicyDomainError {
  public constructor(assignmentPolicyId: string) {
    super(`AssignmentPolicy '${assignmentPolicyId}' already exists.`);
    this.name = 'DuplicateAssignmentPolicyError';
  }
}

export class AssignmentPolicyNotFoundError extends AssignmentPolicyDomainError {
  public constructor(assignmentPolicyId: string) {
    super(`AssignmentPolicy '${assignmentPolicyId}' was not found.`);
    this.name = 'AssignmentPolicyNotFoundError';
  }
}
