import type { PolicyCriterionInput, RepositoryPolicySnapshot } from './repository-policy.types';

export interface RegisterRepositoryPolicyCommand {
  readonly id?: string;
  readonly name: string;
  readonly description: string;
  readonly criteria: readonly PolicyCriterionInput[];
  readonly ratificationId: string;
}

export interface SupersedeRepositoryPolicyCommand {
  readonly repositoryPolicyId: string;
  readonly name: string;
  readonly description: string;
  readonly criteria: readonly PolicyCriterionInput[];
  readonly ratificationId: string;
}

export interface RepositoryPolicyServiceContract {
  registerRepositoryPolicy(command: RegisterRepositoryPolicyCommand): Promise<RepositoryPolicySnapshot>;
  supersedeRepositoryPolicy(command: SupersedeRepositoryPolicyCommand): Promise<RepositoryPolicySnapshot>;
  getRepositoryPolicy(
    repositoryPolicyId: string,
    version: number,
  ): Promise<RepositoryPolicySnapshot>;
  getCurrentRepositoryPolicy(repositoryPolicyId: string): Promise<RepositoryPolicySnapshot>;
  enumerateCurrentRepositoryPolicies(): Promise<readonly RepositoryPolicySnapshot[]>;
  enumerateRepositoryPolicyHistory(
    repositoryPolicyId: string,
  ): Promise<readonly RepositoryPolicySnapshot[]>;
}
