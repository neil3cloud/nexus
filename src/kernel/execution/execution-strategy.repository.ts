import { ExecutionStrategy } from './execution-strategy.aggregate';
import { ExecutionStrategyId } from './execution-strategy-id';
import type { ExecutionStrategySnapshot } from './execution-strategy.types';
import {
  DuplicateExecutionStrategyError,
  DuplicateExecutionStrategyForMissionError,
  InvalidExecutionStrategyDefinitionError,
} from './execution-strategy.errors';

export interface IExecutionStrategyRepository {
  create(executionStrategy: ExecutionStrategy): Promise<void>;
  getById(executionStrategyId: ExecutionStrategyId | string): Promise<ExecutionStrategy | undefined>;
  getByMissionId(missionId: string): Promise<ExecutionStrategy | undefined>;
  exists(executionStrategyId: ExecutionStrategyId | string): Promise<boolean>;
  enumerate(): Promise<readonly ExecutionStrategy[]>;
}

export class InMemoryExecutionStrategyRepository implements IExecutionStrategyRepository {
  private readonly strategiesById = new Map<string, ExecutionStrategySnapshot>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async create(executionStrategy: ExecutionStrategy): Promise<void> {
    await this.runExclusive(() => {
      const snapshot = executionStrategy.toSnapshot();

      if (this.strategiesById.has(snapshot.id)) {
        throw new DuplicateExecutionStrategyError(snapshot.id);
      }

      if ([...this.strategiesById.values()].some((stored) => stored.missionId === snapshot.missionId)) {
        throw new DuplicateExecutionStrategyForMissionError(snapshot.missionId);
      }

      this.strategiesById.set(snapshot.id, snapshot);
    });
  }

  public async getById(
    executionStrategyId: ExecutionStrategyId | string,
  ): Promise<ExecutionStrategy | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.strategiesById.get(normalizeExecutionStrategyId(executionStrategyId).toString());

      if (snapshot === undefined) {
        return undefined;
      }

      return ExecutionStrategy.fromSnapshot(snapshot);
    });
  }

  public async getByMissionId(missionId: string): Promise<ExecutionStrategy | undefined> {
    return this.runExclusive(() => {
      const normalizedMissionId = normalizeNonEmptyString(missionId, 'Mission identity');
      const snapshot = [...this.strategiesById.values()].find(
        (stored) => stored.missionId === normalizedMissionId,
      );

      if (snapshot === undefined) {
        return undefined;
      }

      return ExecutionStrategy.fromSnapshot(snapshot);
    });
  }

  public async exists(executionStrategyId: ExecutionStrategyId | string): Promise<boolean> {
    return this.runExclusive(() =>
      this.strategiesById.has(normalizeExecutionStrategyId(executionStrategyId).toString()),
    );
  }

  public async enumerate(): Promise<readonly ExecutionStrategy[]> {
    return this.runExclusive(() =>
      Object.freeze(
        [...this.strategiesById.values()]
          .map((snapshot) => ExecutionStrategy.fromSnapshot(snapshot))
          .sort((left, right) => left.id.toString().localeCompare(right.id.toString())),
      ),
    );
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

function normalizeExecutionStrategyId(
  executionStrategyId: ExecutionStrategyId | string,
): ExecutionStrategyId {
  return typeof executionStrategyId === 'string'
    ? ExecutionStrategyId.fromString(executionStrategyId)
    : executionStrategyId;
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidExecutionStrategyDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
