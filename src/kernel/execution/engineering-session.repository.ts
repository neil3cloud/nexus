import { EngineeringSession } from './engineering-session';
import { EngineeringSessionId } from './engineering-session-id';
import type { EngineeringSessionSnapshot } from './engineering-session.types';
import { DuplicateEngineeringSessionError } from './engineering-session.errors';

export interface IEngineeringSessionRepository {
  create(engineeringSession: EngineeringSession): Promise<void>;
  save(engineeringSession: EngineeringSession): Promise<void>;
  getById(engineeringSessionId: EngineeringSessionId | string): Promise<EngineeringSession | undefined>;
  exists(engineeringSessionId: EngineeringSessionId | string): Promise<boolean>;
  enumerate(): Promise<readonly EngineeringSession[]>;
}

export class InMemoryEngineeringSessionRepository implements IEngineeringSessionRepository {
  private readonly sessionsById = new Map<string, EngineeringSessionSnapshot>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async create(engineeringSession: EngineeringSession): Promise<void> {
    await this.runExclusive(() => {
      const snapshot = engineeringSession.toSnapshot();

      if (this.sessionsById.has(snapshot.id)) {
        throw new DuplicateEngineeringSessionError(snapshot.id);
      }

      this.sessionsById.set(snapshot.id, snapshot);
    });
  }

  public async save(engineeringSession: EngineeringSession): Promise<void> {
    await this.runExclusive(() => {
      const snapshot = engineeringSession.toSnapshot();
      this.sessionsById.set(snapshot.id, snapshot);
    });
  }

  public async getById(
    engineeringSessionId: EngineeringSessionId | string,
  ): Promise<EngineeringSession | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.sessionsById.get(normalizeEngineeringSessionId(engineeringSessionId).toString());

      if (snapshot === undefined) {
        return undefined;
      }

      return EngineeringSession.fromSnapshot(snapshot);
    });
  }

  public async exists(engineeringSessionId: EngineeringSessionId | string): Promise<boolean> {
    return this.runExclusive(() =>
      this.sessionsById.has(normalizeEngineeringSessionId(engineeringSessionId).toString()),
    );
  }

  public async enumerate(): Promise<readonly EngineeringSession[]> {
    return this.runExclusive(() =>
      Object.freeze(
        [...this.sessionsById.values()]
          .map((snapshot) => EngineeringSession.fromSnapshot(snapshot))
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

function normalizeEngineeringSessionId(
  engineeringSessionId: EngineeringSessionId | string,
): EngineeringSessionId {
  return typeof engineeringSessionId === 'string'
    ? EngineeringSessionId.fromString(engineeringSessionId)
    : engineeringSessionId;
}
