import type { Adapter } from './adapter.contract';
import { AdapterId } from './adapter-id';
import type { AdapterMetadata } from './adapter-metadata';
import { AdapterNotFoundError, DuplicateAdapterRegistrationError } from './adapter.errors';

export interface AdapterRegistry {
  register(adapter: Adapter): Promise<void>;
  unregister(adapterId: AdapterId | string): Promise<void>;
  getById(adapterId: AdapterId | string): Promise<Adapter | undefined>;
  has(adapterId: AdapterId | string): Promise<boolean>;
  enumerate(): Promise<readonly AdapterMetadata[]>;
}

export class InMemoryAdapterRegistry implements AdapterRegistry {
  private readonly adaptersById = new Map<string, Adapter>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async register(adapter: Adapter): Promise<void> {
    await this.runExclusive(() => {
      const adapterId = adapter.metadata.id.toString();

      if (this.adaptersById.has(adapterId)) {
        throw new DuplicateAdapterRegistrationError(adapterId);
      }

      this.adaptersById.set(adapterId, adapter);
    });
  }

  public async unregister(adapterId: AdapterId | string): Promise<void> {
    await this.runExclusive(() => {
      const normalizedAdapterId = normalizeAdapterId(adapterId).toString();

      if (!this.adaptersById.delete(normalizedAdapterId)) {
        throw new AdapterNotFoundError(normalizedAdapterId);
      }
    });
  }

  public async getById(adapterId: AdapterId | string): Promise<Adapter | undefined> {
    return this.runExclusive(() => this.adaptersById.get(normalizeAdapterId(adapterId).toString()));
  }

  public async has(adapterId: AdapterId | string): Promise<boolean> {
    return this.runExclusive(() => this.adaptersById.has(normalizeAdapterId(adapterId).toString()));
  }

  public async enumerate(): Promise<readonly AdapterMetadata[]> {
    return this.runExclusive(() =>
      Object.freeze(
        [...this.adaptersById.values()]
          .map((adapter) => adapter.metadata)
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

function normalizeAdapterId(adapterId: AdapterId | string): AdapterId {
  return typeof adapterId === 'string' ? AdapterId.fromString(adapterId) : adapterId;
}
