import { Evidence } from './evidence.aggregate';
import type { EvidenceSnapshot } from './evidence.aggregate';
import {
  AmbiguousEvidenceVersionException,
  DuplicateEvidenceException,
  EvidenceVersionNotFoundException,
} from './evidence.errors';
import { EvidenceId } from './evidence-id';
import { EvidenceVersion } from './evidence-version';

export interface IEvidenceRepository {
  register(evidence: Evidence): Promise<void>;
  getById(evidenceId: EvidenceId): Promise<Evidence | undefined>;
  getByIdAndVersion(
    evidenceId: EvidenceId,
    evidenceVersion: EvidenceVersion,
  ): Promise<Evidence | undefined>;
  exists(evidenceId: EvidenceId): Promise<boolean>;
  existsByIdAndVersion(evidenceId: EvidenceId, evidenceVersion: EvidenceVersion): Promise<boolean>;
  enumerate(): Promise<readonly Evidence[]>;
}

export class InMemoryEvidenceRepository implements IEvidenceRepository {
  private readonly evidenceById = new Map<string, Map<number, EvidenceSnapshot>>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async register(evidence: Evidence): Promise<void> {
    await this.runExclusive(() => {
      const evidenceId = evidence.id.toString();
      const evidenceVersion = evidence.version.toNumber();
      let evidenceByVersion = this.evidenceById.get(evidenceId);

      if (evidenceByVersion === undefined) {
        evidenceByVersion = new Map<number, EvidenceSnapshot>();
        this.evidenceById.set(evidenceId, evidenceByVersion);
      }

      if (evidenceByVersion.has(evidenceVersion)) {
        throw new DuplicateEvidenceException(evidenceId, evidenceVersion);
      }

      evidenceByVersion.set(evidenceVersion, evidence.toSnapshot());
    });
  }

  public async getById(evidenceId: EvidenceId): Promise<Evidence | undefined> {
    return this.runExclusive(() => {
      const evidenceByVersion = this.evidenceById.get(evidenceId.toString());

      if (evidenceByVersion === undefined) {
        return undefined;
      }

      if (evidenceByVersion.size > 1) {
        throw new AmbiguousEvidenceVersionException(evidenceId.toString());
      }

      const [snapshot] = evidenceByVersion.values();

      if (snapshot === undefined) {
        return undefined;
      }

      return Evidence.fromSnapshot(snapshot);
    });
  }

  public async getByIdAndVersion(
    evidenceId: EvidenceId,
    evidenceVersion: EvidenceVersion,
  ): Promise<Evidence | undefined> {
    return this.runExclusive(() => {
      const evidenceByVersion = this.evidenceById.get(evidenceId.toString());

      if (evidenceByVersion === undefined) {
        return undefined;
      }

      const snapshot = evidenceByVersion.get(evidenceVersion.toNumber());

      if (snapshot === undefined) {
        throw new EvidenceVersionNotFoundException(
          evidenceId.toString(),
          evidenceVersion.toNumber(),
        );
      }

      return Evidence.fromSnapshot(snapshot);
    });
  }

  public async exists(evidenceId: EvidenceId): Promise<boolean> {
    return this.runExclusive(() => this.evidenceById.has(evidenceId.toString()));
  }

  public async existsByIdAndVersion(
    evidenceId: EvidenceId,
    evidenceVersion: EvidenceVersion,
  ): Promise<boolean> {
    return this.runExclusive(() => {
      const evidenceByVersion = this.evidenceById.get(evidenceId.toString());

      if (evidenceByVersion === undefined) {
        return false;
      }

      return evidenceByVersion.has(evidenceVersion.toNumber());
    });
  }

  public async enumerate(): Promise<readonly Evidence[]> {
    return this.runExclusive(() => {
      const evidence: Evidence[] = [];

      for (const evidenceByVersion of this.evidenceById.values()) {
        const versions = [...evidenceByVersion.keys()].sort((left, right) => left - right);

        for (const version of versions) {
          const snapshot = evidenceByVersion.get(version);

          if (snapshot !== undefined) {
            evidence.push(Evidence.fromSnapshot(snapshot));
          }
        }
      }

      return evidence;
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
