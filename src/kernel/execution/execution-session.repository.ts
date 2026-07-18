import { EngineeringSessionId } from './engineering-session-id';
import { ExecutionSession } from './execution-session';
import { ExecutionSessionId } from './execution-session-id';
import {
  DuplicateExecutionSessionError,
  InvalidExecutionSessionDefinitionError,
} from './execution-session.errors';
import type { ExecutionSessionSnapshot } from './execution-session.types';

export interface IExecutionSessionRepository {
  create(executionSession: ExecutionSession): Promise<void>;
  getById(executionSessionId: ExecutionSessionId | string): Promise<ExecutionSession | undefined>;
  exists(executionSessionId: ExecutionSessionId | string): Promise<boolean>;
  enumerate(engineeringSessionId?: EngineeringSessionId | string): Promise<readonly ExecutionSession[]>;
}

export class InMemoryExecutionSessionRepository implements IExecutionSessionRepository {
  private readonly sessionsById = new Map<string, ExecutionSessionSnapshot>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async create(executionSession: ExecutionSession): Promise<void> {
    await this.runExclusive(() => {
      const snapshot = executionSession.toSnapshot();
      this.assertOwningEngineeringSessionId(snapshot);

      if (this.sessionsById.has(snapshot.id)) {
        throw new DuplicateExecutionSessionError(snapshot.id);
      }

      this.sessionsById.set(snapshot.id, snapshot);
    });
  }

  public async getById(
    executionSessionId: ExecutionSessionId | string,
  ): Promise<ExecutionSession | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.sessionsById.get(normalizeExecutionSessionId(executionSessionId).toString());

      if (snapshot === undefined) {
        return undefined;
      }

      return ExecutionSession.fromSnapshot(snapshot);
    });
  }

  public async exists(executionSessionId: ExecutionSessionId | string): Promise<boolean> {
    return this.runExclusive(() =>
      this.sessionsById.has(normalizeExecutionSessionId(executionSessionId).toString()),
    );
  }

  public async enumerate(
    engineeringSessionId?: EngineeringSessionId | string,
  ): Promise<readonly ExecutionSession[]> {
    return this.runExclusive(() => {
      const normalizedEngineeringSessionId =
        engineeringSessionId === undefined
          ? undefined
          : normalizeEngineeringSessionId(engineeringSessionId).toString();

      return Object.freeze(
        [...this.sessionsById.values()]
          .filter(
            (snapshot) =>
              normalizedEngineeringSessionId === undefined ||
              snapshot.engineeringSessionId === normalizedEngineeringSessionId,
          )
          .map((snapshot) => ExecutionSession.fromSnapshot(snapshot))
          .sort((left, right) => left.id.toString().localeCompare(right.id.toString())),
      );
    });
  }

  private assertOwningEngineeringSessionId(snapshot: ExecutionSessionSnapshot): void {
    if (snapshot.engineeringSessionId.trim().length === 0) {
      throw new InvalidExecutionSessionDefinitionError(
        'ExecutionSession requires an owning EngineeringSessionId.',
      );
    }

    EngineeringSessionId.fromString(snapshot.engineeringSessionId);
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

function normalizeExecutionSessionId(
  executionSessionId: ExecutionSessionId | string,
): ExecutionSessionId {
  return typeof executionSessionId === 'string'
    ? ExecutionSessionId.fromString(executionSessionId)
    : executionSessionId;
}

function normalizeEngineeringSessionId(
  engineeringSessionId: EngineeringSessionId | string,
): EngineeringSessionId {
  return typeof engineeringSessionId === 'string'
    ? EngineeringSessionId.fromString(engineeringSessionId)
    : engineeringSessionId;
}
