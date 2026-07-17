import { MissionId } from '../mission/mission-id';
import { ReviewId } from '../review/review-id';
import { PlanningCorrelation } from './planning-correlation';
import { PlanningCorrelationId } from './planning-correlation-id';
import {
  DuplicatePlanningCorrelationError,
  InvalidPlanningCorrelationDefinitionError,
} from './planning.errors';
import type { PlanningCorrelationSnapshot } from './planning.types';
import { ProposedMissionPlanId } from './proposed-mission-plan-id';
import { ProposedPlanRevisionId } from './proposed-plan-revision-id';

export interface PlanningCorrelationRevisionKey {
  readonly missionId: string;
  readonly proposedMissionPlanId: string;
  readonly proposedPlanRevisionId: string;
}

export interface IPlanningCorrelationRepository {
  register(planningCorrelation: PlanningCorrelation): Promise<PlanningCorrelation>;
  save(planningCorrelation: PlanningCorrelation): Promise<PlanningCorrelation>;
  saveWithSupersededGovernanceDecision(
    planningCorrelation: PlanningCorrelation,
  ): Promise<PlanningCorrelation>;
  getById(
    planningCorrelationId: PlanningCorrelationId | string,
  ): Promise<PlanningCorrelation | undefined>;
  findByReviewId(reviewId: ReviewId | string): Promise<PlanningCorrelation | undefined>;
  findByGovernanceDecisionId(
    governanceDecisionId: string,
  ): Promise<PlanningCorrelation | undefined>;
  findByProposedPlanRevision(
    key: PlanningCorrelationRevisionKey,
  ): Promise<PlanningCorrelation | undefined>;
  history(
    planningCorrelationId: PlanningCorrelationId | string,
  ): Promise<readonly PlanningCorrelation[]>;
  enumerate(): Promise<readonly PlanningCorrelation[]>;
}

export class InMemoryPlanningCorrelationRepository implements IPlanningCorrelationRepository {
  private readonly correlationsById = new Map<string, PlanningCorrelationSnapshot>();
  private readonly historiesById = new Map<string, PlanningCorrelationSnapshot[]>();
  private readonly correlationIdsByReviewId = new Map<string, Set<string>>();
  private readonly correlationIdsByGovernanceDecisionId = new Map<string, Set<string>>();
  private readonly correlationIdsByRevisionKey = new Map<string, Set<string>>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async register(planningCorrelation: PlanningCorrelation): Promise<PlanningCorrelation> {
    return this.runExclusive(() => {
      const snapshot = planningCorrelation.toSnapshot();
      const revisionKey = createRevisionKey(snapshot);
      const existingByRevision = this.findUniqueSnapshotByIndexedKey(
        this.correlationIdsByRevisionKey,
        revisionKey,
      );

      if (existingByRevision !== undefined) {
        return PlanningCorrelation.fromSnapshot(existingByRevision);
      }

      if (this.correlationsById.has(snapshot.id)) {
        throw new DuplicatePlanningCorrelationError(snapshot.id);
      }

      this.correlationsById.set(snapshot.id, snapshot);
      this.historiesById.set(snapshot.id, [snapshot]);
      addIndexValue(this.correlationIdsByRevisionKey, revisionKey, snapshot.id);
      this.indexAssociations(snapshot);

      return PlanningCorrelation.fromSnapshot(snapshot);
    });
  }

  public async save(planningCorrelation: PlanningCorrelation): Promise<PlanningCorrelation> {
    return this.saveInternal(planningCorrelation, false);
  }

  public async saveWithSupersededGovernanceDecision(
    planningCorrelation: PlanningCorrelation,
  ): Promise<PlanningCorrelation> {
    return this.saveInternal(planningCorrelation, true);
  }

  private async saveInternal(
    planningCorrelation: PlanningCorrelation,
    allowGovernanceDecisionSupersession: boolean,
  ): Promise<PlanningCorrelation> {
    return this.runExclusive(() => {
      const snapshot = planningCorrelation.toSnapshot();
      const existingSnapshot = this.correlationsById.get(snapshot.id);

      if (existingSnapshot === undefined) {
        throw new InvalidPlanningCorrelationDefinitionError(
          `PlanningCorrelation '${snapshot.id}' must be registered before it can be saved.`,
        );
      }

      assertImmutableCreationFields(existingSnapshot, snapshot);
      assertAppendOnlyAssociations(
        existingSnapshot,
        snapshot,
        allowGovernanceDecisionSupersession,
      );

      this.correlationsById.set(snapshot.id, snapshot);
      this.historiesById.set(snapshot.id, [
        ...(this.historiesById.get(snapshot.id) ?? []),
        snapshot,
      ]);
      this.indexAssociations(snapshot);

      return PlanningCorrelation.fromSnapshot(snapshot);
    });
  }

  public async getById(
    planningCorrelationId: PlanningCorrelationId | string,
  ): Promise<PlanningCorrelation | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.correlationsById.get(
        normalizePlanningCorrelationId(planningCorrelationId),
      );

      return snapshot === undefined ? undefined : PlanningCorrelation.fromSnapshot(snapshot);
    });
  }

  public async findByReviewId(
    reviewId: ReviewId | string,
  ): Promise<PlanningCorrelation | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.findUniqueSnapshotByIndexedKey(
        this.correlationIdsByReviewId,
        normalizeReviewId(reviewId),
      );

      return snapshot === undefined ? undefined : PlanningCorrelation.fromSnapshot(snapshot);
    });
  }

  public async findByGovernanceDecisionId(
    governanceDecisionId: string,
  ): Promise<PlanningCorrelation | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.findUniqueSnapshotByIndexedKey(
        this.correlationIdsByGovernanceDecisionId,
        normalizeGovernanceDecisionId(governanceDecisionId),
      );

      return snapshot === undefined ? undefined : PlanningCorrelation.fromSnapshot(snapshot);
    });
  }

  public async findByProposedPlanRevision(
    key: PlanningCorrelationRevisionKey,
  ): Promise<PlanningCorrelation | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.findUniqueSnapshotByIndexedKey(
        this.correlationIdsByRevisionKey,
        createRevisionKeyFromInput(key),
      );

      return snapshot === undefined ? undefined : PlanningCorrelation.fromSnapshot(snapshot);
    });
  }

  public async history(
    planningCorrelationId: PlanningCorrelationId | string,
  ): Promise<readonly PlanningCorrelation[]> {
    return this.runExclusive(() =>
      Object.freeze(
        (this.historiesById.get(normalizePlanningCorrelationId(planningCorrelationId)) ?? []).map(
          (snapshot) => PlanningCorrelation.fromSnapshot(snapshot),
        ),
      ),
    );
  }

  public async enumerate(): Promise<readonly PlanningCorrelation[]> {
    return this.runExclusive(() =>
      Object.freeze(
        [...this.correlationsById.values()]
          .sort((left, right) => left.id.localeCompare(right.id))
          .map((snapshot) => PlanningCorrelation.fromSnapshot(snapshot)),
      ),
    );
  }

  private findUniqueSnapshotByIndexedKey(
    index: ReadonlyMap<string, ReadonlySet<string>>,
    key: string,
  ): PlanningCorrelationSnapshot | undefined {
    const correlationIds = index.get(key);

    if (correlationIds === undefined || correlationIds.size !== 1) {
      return undefined;
    }

    const correlationId = [...correlationIds][0];

    return correlationId === undefined ? undefined : this.correlationsById.get(correlationId);
  }

  private indexAssociations(snapshot: PlanningCorrelationSnapshot): void {
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
  existingSnapshot: PlanningCorrelationSnapshot,
  snapshot: PlanningCorrelationSnapshot,
): void {
  if (
    existingSnapshot.missionId !== snapshot.missionId ||
    existingSnapshot.proposedMissionPlanId !== snapshot.proposedMissionPlanId ||
    existingSnapshot.proposedPlanRevisionId !== snapshot.proposedPlanRevisionId ||
    existingSnapshot.createdAt !== snapshot.createdAt ||
    existingSnapshot.correlationId !== snapshot.correlationId ||
    existingSnapshot.causality.join('\u0000') !== snapshot.causality.join('\u0000') ||
    JSON.stringify(existingSnapshot.plannerAttribution) !==
      JSON.stringify(snapshot.plannerAttribution)
  ) {
    throw new InvalidPlanningCorrelationDefinitionError(
      `PlanningCorrelation '${snapshot.id}' immutable attribution cannot be changed.`,
    );
  }
}

function assertAppendOnlyAssociations(
  existingSnapshot: PlanningCorrelationSnapshot,
  snapshot: PlanningCorrelationSnapshot,
  allowGovernanceDecisionSupersession: boolean,
): void {
  if (existingSnapshot.reviewId !== undefined && existingSnapshot.reviewId !== snapshot.reviewId) {
    throw new InvalidPlanningCorrelationDefinitionError(
      `PlanningCorrelation '${snapshot.id}' Review association cannot be changed.`,
    );
  }

  if (
    existingSnapshot.repositoryPolicyId !== undefined &&
    (existingSnapshot.repositoryPolicyId !== snapshot.repositoryPolicyId ||
      existingSnapshot.repositoryPolicyVersion !== snapshot.repositoryPolicyVersion)
  ) {
    throw new InvalidPlanningCorrelationDefinitionError(
      `PlanningCorrelation '${snapshot.id}' RepositoryPolicy association cannot be changed.`,
    );
  }

  if (
    existingSnapshot.governanceDecisionId !== undefined &&
    existingSnapshot.governanceDecisionId !== snapshot.governanceDecisionId &&
    !allowGovernanceDecisionSupersession
  ) {
    throw new InvalidPlanningCorrelationDefinitionError(
      `PlanningCorrelation '${snapshot.id}' GovernanceDecision association cannot be changed.`,
    );
  }
}

function createRevisionKey(snapshot: PlanningCorrelationSnapshot): string {
  return createRevisionKeyFromInput({
    missionId: snapshot.missionId,
    proposedMissionPlanId: snapshot.proposedMissionPlanId,
    proposedPlanRevisionId: snapshot.proposedPlanRevisionId,
  });
}

function createRevisionKeyFromInput(key: PlanningCorrelationRevisionKey): string {
  return [
    MissionId.fromString(key.missionId).toString(),
    ProposedMissionPlanId.fromString(key.proposedMissionPlanId).toString(),
    ProposedPlanRevisionId.fromString(key.proposedPlanRevisionId).toString(),
  ].join('::');
}

function addIndexValue(index: Map<string, Set<string>>, key: string, value: string): void {
  const values = index.get(key) ?? new Set<string>();
  values.add(value);
  index.set(key, values);
}

function normalizePlanningCorrelationId(
  planningCorrelationId: PlanningCorrelationId | string,
): string {
  return typeof planningCorrelationId === 'string'
    ? PlanningCorrelationId.fromString(planningCorrelationId).toString()
    : planningCorrelationId.toString();
}

function normalizeReviewId(reviewId: ReviewId | string): string {
  return typeof reviewId === 'string' ? ReviewId.fromString(reviewId).toString() : reviewId.toString();
}

function normalizeGovernanceDecisionId(governanceDecisionId: string): string {
  const normalized = governanceDecisionId.trim();

  if (normalized.length === 0) {
    throw new InvalidPlanningCorrelationDefinitionError(
      'PlanningCorrelation governanceDecisionId must be a non-empty string.',
    );
  }

  return normalized;
}
