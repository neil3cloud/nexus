import { MissionId } from '../mission/mission-id';
import { ReviewId } from '../review/review-id';
import { PlannerAttribution } from './planner-attribution';
import { PlanningCorrelationId } from './planning-correlation-id';
import { InvalidPlanningCorrelationDefinitionError } from './planning.errors';
import type { PlannerAttributionInput, PlanningCorrelationSnapshot } from './planning.types';
import { ProposedMissionPlanId, normalizeNonEmptyString } from './proposed-mission-plan-id';
import { ProposedPlanRevisionId } from './proposed-plan-revision-id';

export interface CreatePlanningCorrelationInput {
  readonly id: string;
  readonly missionId: string;
  readonly proposedMissionPlanId: string;
  readonly proposedPlanRevisionId: string;
  readonly plannerAttribution: PlannerAttributionInput;
  readonly createdAt: string;
  readonly causality?: readonly string[];
  readonly correlationId?: string;
}

export class PlanningCorrelation {
  private constructor(private readonly snapshotValue: PlanningCorrelationSnapshot) {
    Object.freeze(this);
  }

  public static create(input: CreatePlanningCorrelationInput): PlanningCorrelation {
    return new PlanningCorrelation(
      normalizeSnapshot({
        id: input.id,
        missionId: input.missionId,
        proposedMissionPlanId: input.proposedMissionPlanId,
        proposedPlanRevisionId: input.proposedPlanRevisionId,
        plannerAttribution: PlannerAttribution.create(input.plannerAttribution).toSnapshot(),
        createdAt: input.createdAt,
        causality: input.causality ?? [],
        ...(input.correlationId === undefined ? {} : { correlationId: input.correlationId }),
      }),
    );
  }

  public static fromSnapshot(snapshot: PlanningCorrelationSnapshot): PlanningCorrelation {
    return new PlanningCorrelation(normalizeSnapshot(snapshot));
  }

  public get id(): PlanningCorrelationId {
    return PlanningCorrelationId.fromString(this.snapshotValue.id);
  }

  public get missionId(): string {
    return this.snapshotValue.missionId;
  }

  public get proposedMissionPlanId(): string {
    return this.snapshotValue.proposedMissionPlanId;
  }

  public get proposedPlanRevisionId(): string {
    return this.snapshotValue.proposedPlanRevisionId;
  }

  public get reviewId(): string | undefined {
    return this.snapshotValue.reviewId;
  }

  public associateReview(reviewId: string): PlanningCorrelation {
    const normalizedReviewId = ReviewId.fromString(reviewId).toString();

    if (this.snapshotValue.reviewId !== undefined) {
      if (this.snapshotValue.reviewId === normalizedReviewId) {
        return this;
      }

      throw new InvalidPlanningCorrelationDefinitionError(
        `PlanningCorrelation '${this.snapshotValue.id}' already has Review '${this.snapshotValue.reviewId}'.`,
      );
    }

    return PlanningCorrelation.fromSnapshot({
      ...this.snapshotValue,
      reviewId: normalizedReviewId,
    });
  }

  public toSnapshot(): PlanningCorrelationSnapshot {
    return Object.freeze({
      ...this.snapshotValue,
      plannerAttribution: PlannerAttribution.fromSnapshot(
        this.snapshotValue.plannerAttribution,
      ).toSnapshot(),
      causality: Object.freeze([...this.snapshotValue.causality]),
    });
  }
}

function normalizeSnapshot(snapshot: PlanningCorrelationSnapshot): PlanningCorrelationSnapshot {
  return Object.freeze({
    id: PlanningCorrelationId.fromString(snapshot.id).toString(),
    missionId: MissionId.fromString(snapshot.missionId).toString(),
    proposedMissionPlanId: ProposedMissionPlanId.fromString(
      snapshot.proposedMissionPlanId,
    ).toString(),
    proposedPlanRevisionId: ProposedPlanRevisionId.fromString(
      snapshot.proposedPlanRevisionId,
    ).toString(),
    plannerAttribution: PlannerAttribution.fromSnapshot(snapshot.plannerAttribution).toSnapshot(),
    createdAt: normalizeNonEmptyString(snapshot.createdAt, 'PlanningCorrelation createdAt'),
    causality: Object.freeze(
      snapshot.causality.map((value) =>
        normalizeNonEmptyString(value, 'PlanningCorrelation causality'),
      ),
    ),
    ...(snapshot.correlationId === undefined
      ? {}
      : {
          correlationId: normalizeNonEmptyString(
            snapshot.correlationId,
            'PlanningCorrelation correlationId',
          ),
        }),
    ...(snapshot.reviewId === undefined
      ? {}
      : { reviewId: ReviewId.fromString(snapshot.reviewId).toString() }),
  });
}
