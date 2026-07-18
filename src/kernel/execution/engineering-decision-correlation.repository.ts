import { GovernanceDecisionId } from '../governance/governance-decision-id';
import { MissionId } from '../mission/mission-id';
import { ReviewId } from '../review/review-id';
import { EngineeringDecisionCorrelation } from './engineering-decision-correlation';
import { EngineeringDecisionCorrelationId } from './engineering-decision-correlation-id';
import {
  DuplicateEngineeringDecisionCorrelationError,
  InvalidEngineeringDecisionCorrelationDefinitionError,
} from './engineering-decision-correlation.errors';
import type { EngineeringDecisionCorrelationSnapshot } from './engineering-decision-correlation.types';
import { EngineeringSessionId } from './engineering-session-id';

export interface EngineeringDecisionCorrelationPositionKey {
  readonly missionId: string;
  readonly engineeringSessionId: string;
  readonly workflowStepId: string;
}

export interface IEngineeringDecisionCorrelationRepository {
  register(
    engineeringDecisionCorrelation: EngineeringDecisionCorrelation,
  ): Promise<EngineeringDecisionCorrelation>;
  save(
    engineeringDecisionCorrelation: EngineeringDecisionCorrelation,
  ): Promise<EngineeringDecisionCorrelation>;
  getById(
    engineeringDecisionCorrelationId: EngineeringDecisionCorrelationId | string,
  ): Promise<EngineeringDecisionCorrelation | undefined>;
  findByReviewId(reviewId: ReviewId | string): Promise<EngineeringDecisionCorrelation | undefined>;
  findByGovernanceDecisionId(
    governanceDecisionId: GovernanceDecisionId | string,
  ): Promise<EngineeringDecisionCorrelation | undefined>;
  findByPositionKey(
    key: EngineeringDecisionCorrelationPositionKey,
  ): Promise<EngineeringDecisionCorrelation | undefined>;
  enumerate(): Promise<readonly EngineeringDecisionCorrelation[]>;
}

export class InMemoryEngineeringDecisionCorrelationRepository
  implements IEngineeringDecisionCorrelationRepository
{
  private readonly correlationsById = new Map<string, EngineeringDecisionCorrelationSnapshot>();
  private readonly correlationIdsByPositionKey = new Map<string, Set<string>>();
  private readonly correlationIdsByReviewId = new Map<string, Set<string>>();
  private readonly correlationIdsByGovernanceDecisionId = new Map<string, Set<string>>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async register(
    engineeringDecisionCorrelation: EngineeringDecisionCorrelation,
  ): Promise<EngineeringDecisionCorrelation> {
    return this.runExclusive(() => {
      const snapshot = engineeringDecisionCorrelation.toSnapshot();
      const positionKey = createPositionKey(snapshot);
      const existingByPosition = this.findUniqueSnapshotByIndexedKey(
        this.correlationIdsByPositionKey,
        positionKey,
      );

      if (existingByPosition !== undefined) {
        return EngineeringDecisionCorrelation.fromSnapshot(existingByPosition);
      }

      if (this.correlationsById.has(snapshot.id)) {
        throw new DuplicateEngineeringDecisionCorrelationError(snapshot.id);
      }

      this.correlationsById.set(snapshot.id, snapshot);
      addIndexValue(this.correlationIdsByPositionKey, positionKey, snapshot.id);
      this.indexAssociations(snapshot);

      return EngineeringDecisionCorrelation.fromSnapshot(snapshot);
    });
  }

  public async save(
    engineeringDecisionCorrelation: EngineeringDecisionCorrelation,
  ): Promise<EngineeringDecisionCorrelation> {
    return this.runExclusive(() => {
      const snapshot = engineeringDecisionCorrelation.toSnapshot();
      const existingSnapshot = this.correlationsById.get(snapshot.id);

      if (existingSnapshot === undefined) {
        throw new InvalidEngineeringDecisionCorrelationDefinitionError(
          `EngineeringDecisionCorrelation '${snapshot.id}' must be registered before it can be saved.`,
        );
      }

      assertImmutableCreationFields(existingSnapshot, snapshot);
      assertAppendOnlyAssociations(existingSnapshot, snapshot);

      this.correlationsById.set(snapshot.id, snapshot);
      this.indexAssociations(snapshot);

      return EngineeringDecisionCorrelation.fromSnapshot(snapshot);
    });
  }

  public async getById(
    engineeringDecisionCorrelationId: EngineeringDecisionCorrelationId | string,
  ): Promise<EngineeringDecisionCorrelation | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.correlationsById.get(
        normalizeEngineeringDecisionCorrelationId(engineeringDecisionCorrelationId),
      );

      return snapshot === undefined
        ? undefined
        : EngineeringDecisionCorrelation.fromSnapshot(snapshot);
    });
  }

  public async findByReviewId(
    reviewId: ReviewId | string,
  ): Promise<EngineeringDecisionCorrelation | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.findUniqueSnapshotByIndexedKey(
        this.correlationIdsByReviewId,
        normalizeReviewId(reviewId),
      );

      return snapshot === undefined
        ? undefined
        : EngineeringDecisionCorrelation.fromSnapshot(snapshot);
    });
  }

  public async findByGovernanceDecisionId(
    governanceDecisionId: GovernanceDecisionId | string,
  ): Promise<EngineeringDecisionCorrelation | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.findUniqueSnapshotByIndexedKey(
        this.correlationIdsByGovernanceDecisionId,
        normalizeGovernanceDecisionId(governanceDecisionId),
      );

      return snapshot === undefined
        ? undefined
        : EngineeringDecisionCorrelation.fromSnapshot(snapshot);
    });
  }

  public async findByPositionKey(
    key: EngineeringDecisionCorrelationPositionKey,
  ): Promise<EngineeringDecisionCorrelation | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.findUniqueSnapshotByIndexedKey(
        this.correlationIdsByPositionKey,
        createPositionKeyFromInput(key),
      );

      return snapshot === undefined
        ? undefined
        : EngineeringDecisionCorrelation.fromSnapshot(snapshot);
    });
  }

  public async enumerate(): Promise<readonly EngineeringDecisionCorrelation[]> {
    return this.runExclusive(() =>
      Object.freeze(
        [...this.correlationsById.values()]
          .sort((left, right) => left.id.localeCompare(right.id))
          .map((snapshot) => EngineeringDecisionCorrelation.fromSnapshot(snapshot)),
      ),
    );
  }

  private findUniqueSnapshotByIndexedKey(
    index: ReadonlyMap<string, ReadonlySet<string>>,
    key: string,
  ): EngineeringDecisionCorrelationSnapshot | undefined {
    const correlationIds = index.get(key);

    if (correlationIds === undefined || correlationIds.size !== 1) {
      return undefined;
    }

    const correlationId = [...correlationIds][0];

    return correlationId === undefined ? undefined : this.correlationsById.get(correlationId);
  }

  private indexAssociations(snapshot: EngineeringDecisionCorrelationSnapshot): void {
    if (snapshot.reviewId !== undefined) {
      addIndexValue(this.correlationIdsByReviewId, snapshot.reviewId, snapshot.id);
    }

    if (snapshot.governanceDecisionId !== undefined) {
      addIndexValue(
        this.correlationIdsByGovernanceDecisionId,
        snapshot.governanceDecisionId,
        snapshot.id,
      );
    }
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

function assertImmutableCreationFields(
  existingSnapshot: EngineeringDecisionCorrelationSnapshot,
  snapshot: EngineeringDecisionCorrelationSnapshot,
): void {
  if (
    existingSnapshot.missionId !== snapshot.missionId ||
    existingSnapshot.engineeringSessionId !== snapshot.engineeringSessionId ||
    existingSnapshot.workflowStepId !== snapshot.workflowStepId ||
    existingSnapshot.createdAt !== snapshot.createdAt ||
    existingSnapshot.creationCorrelationId !== snapshot.creationCorrelationId ||
    existingSnapshot.creationCausality.join('\u0000') !== snapshot.creationCausality.join('\u0000')
  ) {
    throw new InvalidEngineeringDecisionCorrelationDefinitionError(
      `EngineeringDecisionCorrelation '${snapshot.id}' immutable attribution cannot be changed.`,
    );
  }
}

function assertAppendOnlyAssociations(
  existingSnapshot: EngineeringDecisionCorrelationSnapshot,
  snapshot: EngineeringDecisionCorrelationSnapshot,
): void {
  if (
    existingSnapshot.reviewId !== undefined &&
    existingSnapshot.reviewId !== snapshot.reviewId
  ) {
    throw new InvalidEngineeringDecisionCorrelationDefinitionError(
      `EngineeringDecisionCorrelation '${snapshot.id}' Review association cannot be changed.`,
    );
  }

  if (
    existingSnapshot.governanceDecisionId !== undefined &&
    existingSnapshot.governanceDecisionId !== snapshot.governanceDecisionId
  ) {
    throw new InvalidEngineeringDecisionCorrelationDefinitionError(
      `EngineeringDecisionCorrelation '${snapshot.id}' GovernanceDecision association cannot be changed.`,
    );
  }
}

function createPositionKey(snapshot: EngineeringDecisionCorrelationSnapshot): string {
  return createPositionKeyFromInput({
    missionId: snapshot.missionId,
    engineeringSessionId: snapshot.engineeringSessionId,
    workflowStepId: snapshot.workflowStepId,
  });
}

function createPositionKeyFromInput(key: EngineeringDecisionCorrelationPositionKey): string {
  return [
    MissionId.fromString(key.missionId).toString(),
    EngineeringSessionId.fromString(key.engineeringSessionId).toString(),
    normalizeNonEmptyString(key.workflowStepId, 'EngineeringDecisionCorrelation workflowStepId'),
  ].join('::');
}

function addIndexValue(index: Map<string, Set<string>>, key: string, value: string): void {
  const values = index.get(key) ?? new Set<string>();
  values.add(value);
  index.set(key, values);
}

function normalizeEngineeringDecisionCorrelationId(
  engineeringDecisionCorrelationId: EngineeringDecisionCorrelationId | string,
): string {
  return typeof engineeringDecisionCorrelationId === 'string'
    ? EngineeringDecisionCorrelationId.fromString(engineeringDecisionCorrelationId).toString()
    : engineeringDecisionCorrelationId.toString();
}

function normalizeReviewId(reviewId: ReviewId | string): string {
  return typeof reviewId === 'string'
    ? ReviewId.fromString(reviewId).toString()
    : reviewId.toString();
}

function normalizeGovernanceDecisionId(
  governanceDecisionId: GovernanceDecisionId | string,
): string {
  return typeof governanceDecisionId === 'string'
    ? GovernanceDecisionId.fromString(governanceDecisionId).toString()
    : governanceDecisionId.toString();
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidEngineeringDecisionCorrelationDefinitionError(
      `${label} must be a non-empty string.`,
    );
  }

  return normalized;
}

