import { Evidence } from './evidence.aggregate';
import type { EvidenceSnapshot } from './evidence.aggregate';
import { DuplicateEvidenceException } from './evidence.errors';
import { EvidenceId } from './evidence-id';

export interface IEvidenceRepository {
  register(evidence: Evidence): Promise<void>;
  getById(evidenceId: EvidenceId): Promise<Evidence | undefined>;
  exists(evidenceId: EvidenceId): Promise<boolean>;
  enumerate(): Promise<readonly Evidence[]>;
}

export class InMemoryEvidenceRepository implements IEvidenceRepository {
  private readonly evidenceById = new Map<string, EvidenceSnapshot>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async register(evidence: Evidence): Promise<void> {
    await this.runExclusive(() => {
      const evidenceId = evidence.id.toString();

      if (this.evidenceById.has(evidenceId)) {
        throw new DuplicateEvidenceException(evidenceId);
      }

      this.evidenceById.set(evidenceId, evidence.toSnapshot());
    });
  }

  public async getById(evidenceId: EvidenceId): Promise<Evidence | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.evidenceById.get(evidenceId.toString());

      if (snapshot === undefined) {
        return undefined;
      }

      return Evidence.fromSnapshot(snapshot);
    });
  }

  public async exists(evidenceId: EvidenceId): Promise<boolean> {
    return this.runExclusive(() => this.evidenceById.has(evidenceId.toString()));
  }

  public async enumerate(): Promise<readonly Evidence[]> {
    return this.runExclusive(() =>
      [...this.evidenceById.values()].map((snapshot) => Evidence.fromSnapshot(snapshot)),
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
