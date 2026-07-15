import { KernelError } from '../common/kernel-error';

export class RepositoryPolicyDomainError extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'RepositoryPolicyDomainError';
  }
}

export class InvalidRepositoryPolicyDefinitionError extends RepositoryPolicyDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidRepositoryPolicyDefinitionError';
  }
}

export class InvalidRepositoryPolicyLineageError extends RepositoryPolicyDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidRepositoryPolicyLineageError';
  }
}

export class DuplicatePolicyCriterionError extends RepositoryPolicyDomainError {
  public constructor(criterionId: string) {
    super(`PolicyCriterion '${criterionId}' is duplicated within the RepositoryPolicy version.`);
    this.name = 'DuplicatePolicyCriterionError';
  }
}

export class DuplicateRepositoryPolicyVersionError extends RepositoryPolicyDomainError {
  public constructor(repositoryPolicyId: string, version: number) {
    super(`RepositoryPolicy '${repositoryPolicyId}' version '${version}' already exists.`);
    this.name = 'DuplicateRepositoryPolicyVersionError';
  }
}

export class RepositoryPolicyNotFoundError extends RepositoryPolicyDomainError {
  public constructor(repositoryPolicyId: string) {
    super(`RepositoryPolicy '${repositoryPolicyId}' was not found.`);
    this.name = 'RepositoryPolicyNotFoundError';
  }
}

export class RepositoryPolicyVersionNotFoundError extends RepositoryPolicyDomainError {
  public constructor(repositoryPolicyId: string, version: number) {
    super(`RepositoryPolicy '${repositoryPolicyId}' version '${version}' was not found.`);
    this.name = 'RepositoryPolicyVersionNotFoundError';
  }
}

export class UnknownRepositoryPolicyPredecessorError extends RepositoryPolicyDomainError {
  public constructor(repositoryPolicyId: string, predecessorVersion: number) {
    super(
      `RepositoryPolicy '${repositoryPolicyId}' predecessor version '${predecessorVersion}' was not found.`,
    );
    this.name = 'UnknownRepositoryPolicyPredecessorError';
  }
}

export class CompetingRepositoryPolicySuccessorError extends RepositoryPolicyDomainError {
  public constructor(repositoryPolicyId: string, predecessorVersion: number) {
    super(
      `RepositoryPolicy '${repositoryPolicyId}' predecessor version '${predecessorVersion}' already has a successor.`,
    );
    this.name = 'CompetingRepositoryPolicySuccessorError';
  }
}
