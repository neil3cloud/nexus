import { GovernanceDecisionId } from '../governance/governance-decision-id';
import { MissionId } from '../mission/mission-id';
import { ReviewId } from '../review/review-id';
import { EngineeringDecisionCorrelationId } from './engineering-decision-correlation-id';
import { InvalidEngineeringDecisionCorrelationDefinitionError } from './engineering-decision-correlation.errors';
import type { EngineeringDecisionCorrelationSnapshot } from './engineering-decision-correlation.types';
import { EngineeringSessionId } from './engineering-session-id';

export interface CreateEngineeringDecisionCorrelationInput {
  readonly id: string;
  readonly missionId: string;
  readonly engineeringSessionId: string;
  readonly workflowStepId: string;
  readonly createdAt: string;
  readonly creationCausality?: readonly string[];
  readonly creationCorrelationId?: string;
}

export class EngineeringDecisionCorrelation {
  private constructor(private readonly snapshotValue: EngineeringDecisionCorrelationSnapshot) {
    Object.freeze(this);
  }

  public static create(
    input: CreateEngineeringDecisionCorrelationInput,
  ): EngineeringDecisionCorrelation {
    return new EngineeringDecisionCorrelation(
      normalizeSnapshot({
        id: input.id,
        missionId: input.missionId,
        engineeringSessionId: input.engineeringSessionId,
        workflowStepId: input.workflowStepId,
        createdAt: input.createdAt,
        creationCausality: input.creationCausality ?? [],
        ...(input.creationCorrelationId === undefined
          ? {}
          : { creationCorrelationId: input.creationCorrelationId }),
      }),
    );
  }

  public static fromSnapshot(
    snapshot: EngineeringDecisionCorrelationSnapshot,
  ): EngineeringDecisionCorrelation {
    return new EngineeringDecisionCorrelation(normalizeSnapshot(snapshot));
  }

  public get id(): EngineeringDecisionCorrelationId {
    return EngineeringDecisionCorrelationId.fromString(this.snapshotValue.id);
  }

  public get missionId(): string {
    return this.snapshotValue.missionId;
  }

  public get engineeringSessionId(): string {
    return this.snapshotValue.engineeringSessionId;
  }

  public get workflowStepId(): string {
    return this.snapshotValue.workflowStepId;
  }

  public get reviewId(): string | undefined {
    return this.snapshotValue.reviewId;
  }

  public get governanceDecisionId(): string | undefined {
    return this.snapshotValue.governanceDecisionId;
  }

  public associateReview(reviewId: string): EngineeringDecisionCorrelation {
    const normalizedReviewId = ReviewId.fromString(reviewId).toString();

    if (this.snapshotValue.reviewId !== undefined) {
      if (this.snapshotValue.reviewId === normalizedReviewId) {
        return this;
      }

      throw new InvalidEngineeringDecisionCorrelationDefinitionError(
        `EngineeringDecisionCorrelation '${this.snapshotValue.id}' already has Review '${this.snapshotValue.reviewId}'.`,
      );
    }

    return EngineeringDecisionCorrelation.fromSnapshot({
      ...this.snapshotValue,
      reviewId: normalizedReviewId,
    });
  }

  public associateGovernanceDecision(governanceDecisionId: string): EngineeringDecisionCorrelation {
    const normalizedGovernanceDecisionId =
      GovernanceDecisionId.fromString(governanceDecisionId).toString();

    if (this.snapshotValue.reviewId === undefined) {
      throw new InvalidEngineeringDecisionCorrelationDefinitionError(
        `EngineeringDecisionCorrelation '${this.snapshotValue.id}' requires Review association before GovernanceDecision association.`,
      );
    }

    if (this.snapshotValue.governanceDecisionId !== undefined) {
      if (this.snapshotValue.governanceDecisionId === normalizedGovernanceDecisionId) {
        return this;
      }

      throw new InvalidEngineeringDecisionCorrelationDefinitionError(
        `EngineeringDecisionCorrelation '${this.snapshotValue.id}' already has GovernanceDecision '${this.snapshotValue.governanceDecisionId}'.`,
      );
    }

    return EngineeringDecisionCorrelation.fromSnapshot({
      ...this.snapshotValue,
      governanceDecisionId: normalizedGovernanceDecisionId,
    });
  }

  public toSnapshot(): EngineeringDecisionCorrelationSnapshot {
    return Object.freeze({
      ...this.snapshotValue,
      creationCausality: Object.freeze([...this.snapshotValue.creationCausality]),
    });
  }
}

function normalizeSnapshot(
  snapshot: EngineeringDecisionCorrelationSnapshot,
): EngineeringDecisionCorrelationSnapshot {
  return Object.freeze({
    id: EngineeringDecisionCorrelationId.fromString(snapshot.id).toString(),
    missionId: MissionId.fromString(snapshot.missionId).toString(),
    engineeringSessionId: EngineeringSessionId.fromString(snapshot.engineeringSessionId).toString(),
    workflowStepId: normalizeNonEmptyString(
      snapshot.workflowStepId,
      'EngineeringDecisionCorrelation workflowStepId',
    ),
    createdAt: normalizeNonEmptyString(
      snapshot.createdAt,
      'EngineeringDecisionCorrelation createdAt',
    ),
    creationCausality: normalizeStringList(
      snapshot.creationCausality,
      'EngineeringDecisionCorrelation creationCausality',
    ),
    ...(snapshot.creationCorrelationId === undefined
      ? {}
      : {
          creationCorrelationId: normalizeNonEmptyString(
            snapshot.creationCorrelationId,
            'EngineeringDecisionCorrelation creationCorrelationId',
          ),
        }),
    ...(snapshot.reviewId === undefined
      ? {}
      : { reviewId: ReviewId.fromString(snapshot.reviewId).toString() }),
    ...(snapshot.governanceDecisionId === undefined
      ? {}
      : {
          governanceDecisionId: GovernanceDecisionId.fromString(
            snapshot.governanceDecisionId,
          ).toString(),
        }),
  });
}

function normalizeStringList(values: readonly string[], label: string): readonly string[] {
  return Object.freeze(values.map((value) => normalizeNonEmptyString(value, label)));
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

