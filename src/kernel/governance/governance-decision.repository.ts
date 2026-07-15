import { GovernanceDecision } from './governance-decision';
import { GovernanceDecisionId } from './governance-decision-id';
import {
  ContradictoryGovernanceDecisionError,
  DuplicateGovernanceDecisionError,
} from './governance.errors';
import type { GovernanceDecisionSnapshot } from './governance.types';
import { RepositoryPolicyId } from './repository-policy-id';
import { ReviewId } from '../review/review-id';

export interface IGovernanceDecisionRepository {
  register(governanceDecision: GovernanceDecision): Promise<GovernanceDecision>;
  getById(governanceDecisionId: GovernanceDecisionId | string): Promise<GovernanceDecision | undefined>;
  getByEvaluationKey(evaluationKey: string): Promise<GovernanceDecision | undefined>;
  findByRepositoryPolicy(
    repositoryPolicyId: RepositoryPolicyId | string,
    version: number,
  ): Promise<readonly GovernanceDecision[]>;
  findByReview(reviewId: ReviewId | string): Promise<readonly GovernanceDecision[]>;
  enumerate(): Promise<readonly GovernanceDecision[]>;
}

export class InMemoryGovernanceDecisionRepository implements IGovernanceDecisionRepository {
  private readonly decisionsById = new Map<string, GovernanceDecisionSnapshot>();
  private readonly decisionIdsByEvaluationKey = new Map<string, string>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async register(governanceDecision: GovernanceDecision): Promise<GovernanceDecision> {
    return this.runExclusive(() => {
      const snapshot = governanceDecision.toSnapshot();
      const existingDecisionId = this.decisionIdsByEvaluationKey.get(snapshot.evaluationKey);

      if (existingDecisionId !== undefined) {
        const existingSnapshot = this.decisionsById.get(existingDecisionId);

        if (existingSnapshot === undefined) {
          throw new ContradictoryGovernanceDecisionError(snapshot.evaluationKey);
        }

        if (canonicalizeGovernanceDecision(existingSnapshot) !== canonicalizeGovernanceDecision(snapshot)) {
          throw new ContradictoryGovernanceDecisionError(snapshot.evaluationKey);
        }

        return GovernanceDecision.fromSnapshot(existingSnapshot);
      }

      if (this.decisionsById.has(snapshot.id)) {
        throw new DuplicateGovernanceDecisionError(snapshot.evaluationKey);
      }

      this.decisionsById.set(snapshot.id, snapshot);
      this.decisionIdsByEvaluationKey.set(snapshot.evaluationKey, snapshot.id);

      return GovernanceDecision.fromSnapshot(snapshot);
    });
  }

  public async getById(
    governanceDecisionId: GovernanceDecisionId | string,
  ): Promise<GovernanceDecision | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.decisionsById.get(normalizeDecisionId(governanceDecisionId).toString());

      return snapshot === undefined ? undefined : GovernanceDecision.fromSnapshot(snapshot);
    });
  }

  public async getByEvaluationKey(evaluationKey: string): Promise<GovernanceDecision | undefined> {
    return this.runExclusive(() => {
      const decisionId = this.decisionIdsByEvaluationKey.get(normalizeNonEmptyString(evaluationKey));
      const snapshot = decisionId === undefined ? undefined : this.decisionsById.get(decisionId);

      return snapshot === undefined ? undefined : GovernanceDecision.fromSnapshot(snapshot);
    });
  }

  public async findByRepositoryPolicy(
    repositoryPolicyId: RepositoryPolicyId | string,
    version: number,
  ): Promise<readonly GovernanceDecision[]> {
    return this.runExclusive(() => {
      const normalizedPolicyId = normalizeRepositoryPolicyId(repositoryPolicyId).toString();

      return freezeDecisions(
        [...this.decisionsById.values()].filter(
          (snapshot) =>
            snapshot.repositoryPolicyId === normalizedPolicyId &&
            snapshot.repositoryPolicyVersion === version,
        ),
      );
    });
  }

  public async findByReview(reviewId: ReviewId | string): Promise<readonly GovernanceDecision[]> {
    return this.runExclusive(() => {
      const normalizedReviewId = normalizeReviewId(reviewId).toString();

      return freezeDecisions(
        [...this.decisionsById.values()].filter(
          (snapshot) => snapshot.reviewId === normalizedReviewId,
        ),
      );
    });
  }

  public async enumerate(): Promise<readonly GovernanceDecision[]> {
    return this.runExclusive(() => freezeDecisions([...this.decisionsById.values()]));
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

function freezeDecisions(snapshots: readonly GovernanceDecisionSnapshot[]): readonly GovernanceDecision[] {
  return Object.freeze(
    [...snapshots]
      .sort((left, right) => left.id.localeCompare(right.id))
      .map((snapshot) => GovernanceDecision.fromSnapshot(snapshot)),
  );
}

function canonicalizeGovernanceDecision(snapshot: GovernanceDecisionSnapshot): string {
  return JSON.stringify({
    value: snapshot.value,
    repositoryPolicyId: snapshot.repositoryPolicyId,
    repositoryPolicyVersion: snapshot.repositoryPolicyVersion,
    reviewId: snapshot.reviewId,
    reviewStateReference: snapshot.reviewStateReference,
    evaluationKey: snapshot.evaluationKey,
    criterionResults: snapshot.criterionResults,
    explanationCodes: snapshot.explanationCodes,
    ...(snapshot.escalation === undefined
      ? {}
      : { escalation: canonicalizeGovernanceEscalation(snapshot.escalation) }),
  });
}

function canonicalizeGovernanceEscalation(
  escalation: NonNullable<GovernanceDecisionSnapshot['escalation']>,
): Omit<NonNullable<GovernanceDecisionSnapshot['escalation']>, 'id'> {
  return {
    reasonCode: escalation.reasonCode,
    repositoryPolicyId: escalation.repositoryPolicyId,
    repositoryPolicyVersion: escalation.repositoryPolicyVersion,
    reviewId: escalation.reviewId,
    ...(escalation.reviewStateReference === undefined
      ? {}
      : { reviewStateReference: escalation.reviewStateReference }),
    policyCriterionIds: escalation.policyCriterionIds,
    inputReferences: escalation.inputReferences,
    requiredAuthority: escalation.requiredAuthority,
    ...(escalation.ratificationId === undefined
      ? {}
      : { ratificationId: escalation.ratificationId }),
    ...(escalation.ratificationAttributionOutcome === undefined
      ? {}
      : { ratificationAttributionOutcome: escalation.ratificationAttributionOutcome }),
    ...(escalation.ratificationAttributionDiagnostics === undefined
      ? {}
      : { ratificationAttributionDiagnostics: escalation.ratificationAttributionDiagnostics }),
    ...(escalation.ratificationAuthoritySnapshotFingerprint === undefined
      ? {}
      : {
          ratificationAuthoritySnapshotFingerprint:
            escalation.ratificationAuthoritySnapshotFingerprint,
        }),
  };
}

function normalizeDecisionId(governanceDecisionId: GovernanceDecisionId | string): GovernanceDecisionId {
  return typeof governanceDecisionId === 'string'
    ? GovernanceDecisionId.fromString(governanceDecisionId)
    : governanceDecisionId;
}

function normalizeRepositoryPolicyId(repositoryPolicyId: RepositoryPolicyId | string): RepositoryPolicyId {
  return typeof repositoryPolicyId === 'string'
    ? RepositoryPolicyId.fromString(repositoryPolicyId)
    : repositoryPolicyId;
}

function normalizeReviewId(reviewId: ReviewId | string): ReviewId {
  return typeof reviewId === 'string' ? ReviewId.fromString(reviewId) : reviewId;
}

function normalizeNonEmptyString(value: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new DuplicateGovernanceDecisionError('empty-evaluation-key');
  }

  return normalized;
}
