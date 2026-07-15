import { EngineeringSessionCheckpoint } from './engineering-session-checkpoint';
import { EngineeringSessionCheckpointId } from './engineering-session-checkpoint-id';
import type { EngineeringSessionCheckpointSnapshot } from './engineering-session-checkpoint.types';
import { DuplicateEngineeringSessionCheckpointError } from './engineering-session.errors';

export interface IEngineeringSessionCheckpointRepository {
  create(checkpoint: EngineeringSessionCheckpoint): Promise<void>;
  getById(
    checkpointId: EngineeringSessionCheckpointId | string,
  ): Promise<EngineeringSessionCheckpoint | undefined>;
  exists(checkpointId: EngineeringSessionCheckpointId | string): Promise<boolean>;
  enumerate(): Promise<readonly EngineeringSessionCheckpoint[]>;
}

export class InMemoryEngineeringSessionCheckpointRepository
  implements IEngineeringSessionCheckpointRepository
{
  private readonly checkpointsById = new Map<string, EngineeringSessionCheckpointSnapshot>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async create(checkpoint: EngineeringSessionCheckpoint): Promise<void> {
    await this.runExclusive(() => {
      const snapshot = checkpoint.toSnapshot();

      if (this.checkpointsById.has(snapshot.id)) {
        throw new DuplicateEngineeringSessionCheckpointError(snapshot.id);
      }

      this.checkpointsById.set(snapshot.id, snapshot);
    });
  }

  public async getById(
    checkpointId: EngineeringSessionCheckpointId | string,
  ): Promise<EngineeringSessionCheckpoint | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.checkpointsById.get(normalizeCheckpointId(checkpointId).toString());

      if (snapshot === undefined) {
        return undefined;
      }

      return EngineeringSessionCheckpoint.fromSnapshot(snapshot);
    });
  }

  public async exists(checkpointId: EngineeringSessionCheckpointId | string): Promise<boolean> {
    return this.runExclusive(() =>
      this.checkpointsById.has(normalizeCheckpointId(checkpointId).toString()),
    );
  }

  public async enumerate(): Promise<readonly EngineeringSessionCheckpoint[]> {
    return this.runExclusive(() =>
      Object.freeze(
        [...this.checkpointsById.values()]
          .map((snapshot) => EngineeringSessionCheckpoint.fromSnapshot(snapshot))
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

function normalizeCheckpointId(
  checkpointId: EngineeringSessionCheckpointId | string,
): EngineeringSessionCheckpointId {
  return typeof checkpointId === 'string'
    ? EngineeringSessionCheckpointId.fromString(checkpointId)
    : checkpointId;
}
