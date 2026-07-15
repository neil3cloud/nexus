import {
  RatificationAuthoritySnapshot,
} from './ratification-authority-snapshot';
import type { RatificationAuthoritySnapshotState } from './ratification-attribution.types';

export interface IRatificationAuthoritySnapshotRepository {
  recordSnapshot(snapshot: RatificationAuthoritySnapshot): Promise<void>;
  getSnapshot(): Promise<RatificationAuthoritySnapshot | undefined>;
}

export class InMemoryRatificationAuthoritySnapshotRepository
  implements IRatificationAuthoritySnapshotRepository
{
  private snapshot: RatificationAuthoritySnapshotState | undefined;
  private operationQueue: Promise<unknown> = Promise.resolve();

  public constructor(snapshot?: RatificationAuthoritySnapshot) {
    this.snapshot = snapshot?.toSnapshot();
  }

  public async recordSnapshot(snapshot: RatificationAuthoritySnapshot): Promise<void> {
    await this.runExclusive(() => {
      this.snapshot = snapshot.toSnapshot();
    });
  }

  public async getSnapshot(): Promise<RatificationAuthoritySnapshot | undefined> {
    return this.runExclusive(() =>
      this.snapshot === undefined ? undefined : RatificationAuthoritySnapshot.fromSnapshot(this.snapshot),
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

