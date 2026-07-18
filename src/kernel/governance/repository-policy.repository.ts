import { RepositoryPolicy } from './repository-policy';
import { RepositoryPolicyId } from './repository-policy-id';
import {
  CompetingRepositoryPolicySuccessorError,
  DuplicateRepositoryPolicyVersionError,
  InvalidRepositoryPolicyLineageError,
  UnknownRepositoryPolicyPredecessorError,
} from './repository-policy.errors';
import type { RepositoryPolicySnapshot } from './repository-policy.types';

export interface IRepositoryPolicyRepository {
  registerInitialVersion(repositoryPolicy: RepositoryPolicy): Promise<void>;
  registerSupersedingVersion(
    predecessorPolicyId: RepositoryPolicyId | string,
    predecessorVersion: number,
    repositoryPolicy: RepositoryPolicy,
  ): Promise<void>;
  getByIdAndVersion(
    repositoryPolicyId: RepositoryPolicyId | string,
    version: number,
  ): Promise<RepositoryPolicy | undefined>;
  getCurrent(repositoryPolicyId: RepositoryPolicyId | string): Promise<RepositoryPolicy | undefined>;
  enumerateCurrent(): Promise<readonly RepositoryPolicy[]>;
  enumerateHistory(repositoryPolicyId: RepositoryPolicyId | string): Promise<readonly RepositoryPolicy[]>;
}

export class InMemoryRepositoryPolicyRepository implements IRepositoryPolicyRepository {
  private readonly policyVersionsById = new Map<string, Map<number, RepositoryPolicySnapshot>>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async registerInitialVersion(repositoryPolicy: RepositoryPolicy): Promise<void> {
    await this.runExclusive(() => {
      const snapshot = repositoryPolicy.toSnapshot();

      if (snapshot.version !== 1 || snapshot.predecessorVersion !== undefined) {
        throw new InvalidRepositoryPolicyLineageError(
          'RepositoryPolicy initial registration requires version 1 without a predecessor.',
        );
      }

      const history = this.policyVersionsById.get(snapshot.id);

      if (history !== undefined && history.size > 0) {
        throw new DuplicateRepositoryPolicyVersionError(snapshot.id, snapshot.version);
      }

      this.policyVersionsById.set(snapshot.id, new Map([[snapshot.version, snapshot]]));
    });
  }

  public async registerSupersedingVersion(
    predecessorPolicyId: RepositoryPolicyId | string,
    predecessorVersion: number,
    repositoryPolicy: RepositoryPolicy,
  ): Promise<void> {
    await this.runExclusive(() => {
      const normalizedPredecessorPolicyId = normalizeRepositoryPolicyId(predecessorPolicyId);
      const repositoryPolicyId = normalizedPredecessorPolicyId.toString();
      const snapshot = repositoryPolicy.toSnapshot();

      if (snapshot.id !== repositoryPolicyId) {
        throw new InvalidRepositoryPolicyLineageError(
          'RepositoryPolicy supersession must preserve RepositoryPolicyId.',
        );
      }

      if (
        snapshot.predecessorVersion !== predecessorVersion ||
        snapshot.version !== predecessorVersion + 1
      ) {
        throw new InvalidRepositoryPolicyLineageError(
          'RepositoryPolicy supersession must use the next sequential version.',
        );
      }

      const history = this.policyVersionsById.get(repositoryPolicyId);

      if (history === undefined || !history.has(predecessorVersion)) {
        throw new UnknownRepositoryPolicyPredecessorError(repositoryPolicyId, predecessorVersion);
      }

      const currentVersion = Math.max(...history.keys());

      if (predecessorVersion !== currentVersion) {
        throw new CompetingRepositoryPolicySuccessorError(repositoryPolicyId, predecessorVersion);
      }

      if (history.has(snapshot.version)) {
        throw new DuplicateRepositoryPolicyVersionError(snapshot.id, snapshot.version);
      }

      history.set(snapshot.version, snapshot);
    });
  }

  public async getByIdAndVersion(
    repositoryPolicyId: RepositoryPolicyId | string,
    version: number,
  ): Promise<RepositoryPolicy | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.policyVersionsById
        .get(normalizeRepositoryPolicyId(repositoryPolicyId).toString())
        ?.get(version);

      return snapshot === undefined ? undefined : RepositoryPolicy.fromSnapshot(snapshot);
    });
  }

  public async getCurrent(
    repositoryPolicyId: RepositoryPolicyId | string,
  ): Promise<RepositoryPolicy | undefined> {
    return this.runExclusive(() => {
      const history = this.policyVersionsById.get(normalizeRepositoryPolicyId(repositoryPolicyId).toString());

      if (history === undefined || history.size === 0) {
        return undefined;
      }

      const currentVersion = Math.max(...history.keys());
      const currentSnapshot = history.get(currentVersion);

      return currentSnapshot === undefined ? undefined : RepositoryPolicy.fromSnapshot(currentSnapshot);
    });
  }

  public async enumerateCurrent(): Promise<readonly RepositoryPolicy[]> {
    return this.runExclusive(() =>
      Object.freeze(
        [...this.policyVersionsById.values()]
          .map((history) => {
            const currentVersion = Math.max(...history.keys());
            const currentSnapshot = history.get(currentVersion);

            if (currentSnapshot === undefined) {
              throw new InvalidRepositoryPolicyLineageError(
                'RepositoryPolicy history is missing its current version.',
              );
            }

            return RepositoryPolicy.fromSnapshot(currentSnapshot);
          })
          .sort((left, right) => left.id.toString().localeCompare(right.id.toString())),
      ),
    );
  }

  public async enumerateHistory(
    repositoryPolicyId: RepositoryPolicyId | string,
  ): Promise<readonly RepositoryPolicy[]> {
    return this.runExclusive(() => {
      const history = this.policyVersionsById.get(normalizeRepositoryPolicyId(repositoryPolicyId).toString());

      if (history === undefined) {
        return Object.freeze([]);
      }

      return Object.freeze(
        [...history.values()]
          .map((snapshot) => RepositoryPolicy.fromSnapshot(snapshot))
          .sort((left, right) => left.version - right.version),
      );
    });
  }

  private async runExclusive<T>(operation: () => T): Promise<T> {
    const run = this.operationQueue.then(operation, operation);
    this.operationQueue = run.then(
      () => undefined,
      () => undefined,
    );

    return run;
  }
}

function normalizeRepositoryPolicyId(repositoryPolicyId: RepositoryPolicyId | string): RepositoryPolicyId {
  return typeof repositoryPolicyId === 'string'
    ? RepositoryPolicyId.fromString(repositoryPolicyId)
    : repositoryPolicyId;
}
