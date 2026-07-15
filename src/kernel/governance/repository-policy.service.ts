import { randomUUID } from 'node:crypto';

import { ServiceLifecycle } from '../common/service-lifecycle';
import { RepositoryPolicy } from './repository-policy';
import type {
  RegisterRepositoryPolicyCommand,
  RepositoryPolicyServiceContract,
  SupersedeRepositoryPolicyCommand,
} from './repository-policy.contract';
import { RepositoryPolicyId } from './repository-policy-id';
import {
  RepositoryPolicyNotFoundError,
  RepositoryPolicyVersionNotFoundError,
} from './repository-policy.errors';
import {
  InMemoryRepositoryPolicyRepository,
  type IRepositoryPolicyRepository,
} from './repository-policy.repository';
import type { RepositoryPolicySnapshot } from './repository-policy.types';

export class RepositoryPolicyService
  extends ServiceLifecycle
  implements RepositoryPolicyServiceContract
{
  public constructor(
    private readonly repository: IRepositoryPolicyRepository = new InMemoryRepositoryPolicyRepository(),
    private readonly createIdentity: () => string = randomUUID,
  ) {
    super('RepositoryPolicyService');
  }

  public async registerRepositoryPolicy(
    command: RegisterRepositoryPolicyCommand,
  ): Promise<RepositoryPolicySnapshot> {
    const repositoryPolicy = RepositoryPolicy.createInitial({
      id: command.id ?? this.createIdentity(),
      name: command.name,
      description: command.description,
      criteria: command.criteria,
      ratificationId: command.ratificationId,
    });

    await this.repository.registerInitialVersion(repositoryPolicy);

    return repositoryPolicy.toSnapshot();
  }

  public async supersedeRepositoryPolicy(
    command: SupersedeRepositoryPolicyCommand,
  ): Promise<RepositoryPolicySnapshot> {
    const predecessor = await this.requireCurrentRepositoryPolicy(command.repositoryPolicyId);
    const supersedingPolicy = RepositoryPolicy.supersede(predecessor, {
      name: command.name,
      description: command.description,
      criteria: command.criteria,
      ratificationId: command.ratificationId,
    });

    await this.repository.registerSupersedingVersion(
      predecessor.id,
      predecessor.version,
      supersedingPolicy,
    );

    return supersedingPolicy.toSnapshot();
  }

  public async getRepositoryPolicy(
    repositoryPolicyId: string,
    version: number,
  ): Promise<RepositoryPolicySnapshot> {
    const normalizedRepositoryPolicyId = RepositoryPolicyId.fromString(repositoryPolicyId);
    const repositoryPolicy = await this.repository.getByIdAndVersion(
      normalizedRepositoryPolicyId,
      version,
    );

    if (repositoryPolicy === undefined) {
      throw new RepositoryPolicyVersionNotFoundError(
        normalizedRepositoryPolicyId.toString(),
        version,
      );
    }

    return repositoryPolicy.toSnapshot();
  }

  public async getCurrentRepositoryPolicy(
    repositoryPolicyId: string,
  ): Promise<RepositoryPolicySnapshot> {
    return (await this.requireCurrentRepositoryPolicy(repositoryPolicyId)).toSnapshot();
  }

  public async enumerateCurrentRepositoryPolicies(): Promise<readonly RepositoryPolicySnapshot[]> {
    return Object.freeze(
      (await this.repository.enumerateCurrent()).map((repositoryPolicy) =>
        repositoryPolicy.toSnapshot(),
      ),
    );
  }

  public async enumerateRepositoryPolicyHistory(
    repositoryPolicyId: string,
  ): Promise<readonly RepositoryPolicySnapshot[]> {
    const normalizedRepositoryPolicyId = RepositoryPolicyId.fromString(repositoryPolicyId);
    const history = await this.repository.enumerateHistory(normalizedRepositoryPolicyId);

    if (history.length === 0) {
      throw new RepositoryPolicyNotFoundError(normalizedRepositoryPolicyId.toString());
    }

    return Object.freeze(history.map((repositoryPolicy) => repositoryPolicy.toSnapshot()));
  }

  private async requireCurrentRepositoryPolicy(
    repositoryPolicyId: RepositoryPolicyId | string,
  ): Promise<RepositoryPolicy> {
    const normalizedRepositoryPolicyId =
      typeof repositoryPolicyId === 'string'
        ? RepositoryPolicyId.fromString(repositoryPolicyId)
        : repositoryPolicyId;
    const repositoryPolicy = await this.repository.getCurrent(normalizedRepositoryPolicyId);

    if (repositoryPolicy === undefined) {
      throw new RepositoryPolicyNotFoundError(normalizedRepositoryPolicyId.toString());
    }

    return repositoryPolicy;
  }
}
