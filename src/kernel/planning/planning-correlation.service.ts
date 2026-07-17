import { randomUUID } from 'node:crypto';

import { ServiceLifecycle } from '../common/service-lifecycle';
import { MissionId } from '../mission/mission-id';
import type { ReviewServiceContract, StartReviewCommand } from '../review/review.contract';
import { ReviewService } from '../review/review.service';
import type { ReviewCriteriaSnapshot } from '../review/review.types';
import { PlannerAttribution } from './planner-attribution';
import { PlanningCorrelation } from './planning-correlation';
import {
  InMemoryPlanningCorrelationRepository,
  type IPlanningCorrelationRepository,
} from './planning-correlation.repository';
import {
  PlanningCorrelationAssociationRejectedError,
  ProposedMissionPlanNotFoundError,
} from './planning.errors';
import type {
  PlannerAttributionInput,
  PlanningCorrelationSnapshot,
  ProposedMissionPlanSnapshot,
  ProposedPlanRevisionSnapshot,
} from './planning.types';
import { ProposedMissionPlan } from './proposed-mission-plan';
import { ProposedMissionPlanId, normalizeNonEmptyString } from './proposed-mission-plan-id';
import {
  InMemoryProposedMissionPlanRepository,
  type IProposedMissionPlanRepository,
} from './proposed-mission-plan.repository';
import { ProposedPlanRevisionId } from './proposed-plan-revision-id';

export interface EnterPlanningReviewCommand {
  readonly missionId: string;
  readonly proposedMissionPlanId?: string;
  readonly submittedProposedPlanRevisionId: string;
  readonly underReviewProposedPlanRevisionId: string;
  readonly planningCorrelationId?: string;
  readonly reviewId?: string;
  readonly reviewCriteria: readonly ReviewCriteriaSnapshot[];
  readonly evidenceReferences: readonly string[];
  readonly plannerAttribution: PlannerAttributionInput;
  readonly createdAt: string;
  readonly causality?: readonly string[];
  readonly correlationId?: string;
}

export interface EnterPlanningReviewResult {
  readonly proposedMissionPlan: ProposedMissionPlanSnapshot;
  readonly planningCorrelation: PlanningCorrelationSnapshot;
  readonly reviewId: string;
}

export class PlanningCorrelationService extends ServiceLifecycle {
  public constructor(
    private readonly proposedMissionPlanRepository: IProposedMissionPlanRepository =
      new InMemoryProposedMissionPlanRepository(),
    private readonly planningCorrelationRepository: IPlanningCorrelationRepository =
      new InMemoryPlanningCorrelationRepository(),
    private readonly reviewService: Pick<ReviewServiceContract, 'startReview'> = new ReviewService(),
    private readonly createIdentity: () => string = randomUUID,
  ) {
    super('PlanningCorrelationService');
  }

  public async enterReview(
    command: EnterPlanningReviewCommand,
  ): Promise<EnterPlanningReviewResult> {
    const missionId = MissionId.fromString(command.missionId).toString();
    const proposedMissionPlan = await this.resolveProposedMissionPlan(command, missionId);
    const proposedMissionPlanSnapshot = proposedMissionPlan.toSnapshot();

    if (proposedMissionPlanSnapshot.missionId !== missionId) {
      throw new PlanningCorrelationAssociationRejectedError(
        `ProposedMissionPlan '${proposedMissionPlanSnapshot.id}' Mission '${proposedMissionPlanSnapshot.missionId}' does not match requested Mission '${missionId}'.`,
      );
    }

    const currentRevisionSnapshot = proposedMissionPlan.currentRevision.toSnapshot();
    const normalizedUnderReviewRevisionId = ProposedPlanRevisionId.fromString(
      command.underReviewProposedPlanRevisionId,
    ).toString();

    if (
      currentRevisionSnapshot.lifecycleState === 'Under Review' &&
      currentRevisionSnapshot.id === normalizedUnderReviewRevisionId
    ) {
      return this.resolveIdempotentUnderReviewResult(
        missionId,
        proposedMissionPlanSnapshot.id,
        currentRevisionSnapshot,
        proposedMissionPlan.toSnapshot(),
      );
    }

    this.assertSubmittedCurrentRevision(
      proposedMissionPlanSnapshot,
      currentRevisionSnapshot,
      command.submittedProposedPlanRevisionId,
    );
    PlannerAttribution.create(command.plannerAttribution);

    const underReviewProposedMissionPlan = proposedMissionPlan.markCurrentRevisionUnderReview({
      id: normalizedUnderReviewRevisionId,
      plannerAttribution: command.plannerAttribution,
      createdAt: command.createdAt,
      ...(command.causality === undefined ? {} : { causality: command.causality }),
      ...(command.correlationId === undefined ? {} : { correlationId: command.correlationId }),
    });
    const underReviewRevisionSnapshot = underReviewProposedMissionPlan.currentRevision.toSnapshot();
    const review = await this.reviewService.startReview(
      this.createStartReviewCommand(command, missionId, underReviewRevisionSnapshot.id),
    );

    this.assertReviewMatchesRevision(review, missionId, underReviewRevisionSnapshot.id);
    await this.assertReviewIsUncorrelated(review.id);

    const planningCorrelation = PlanningCorrelation.create({
      id:
        command.planningCorrelationId === undefined
          ? this.createIdentity()
          : command.planningCorrelationId,
      missionId,
      proposedMissionPlanId: proposedMissionPlanSnapshot.id,
      proposedPlanRevisionId: underReviewRevisionSnapshot.id,
      plannerAttribution: command.plannerAttribution,
      createdAt: command.createdAt,
      ...(command.causality === undefined ? {} : { causality: command.causality }),
      ...(command.correlationId === undefined ? {} : { correlationId: command.correlationId }),
    }).associateReview(review.id);

    const savedProposedMissionPlan = await this.proposedMissionPlanRepository.save(
      underReviewProposedMissionPlan,
    );
    const registeredPlanningCorrelation = await this.planningCorrelationRepository.register(
      planningCorrelation,
    );

    return Object.freeze({
      proposedMissionPlan: savedProposedMissionPlan.toSnapshot(),
      planningCorrelation: registeredPlanningCorrelation.toSnapshot(),
      reviewId: review.id,
    });
  }

  public async getCorrelation(
    planningCorrelationId: string,
  ): Promise<PlanningCorrelationSnapshot | undefined> {
    return (await this.planningCorrelationRepository.getById(planningCorrelationId))?.toSnapshot();
  }

  public async findByReviewId(reviewId: string): Promise<PlanningCorrelationSnapshot | undefined> {
    return (await this.planningCorrelationRepository.findByReviewId(reviewId))?.toSnapshot();
  }

  private async resolveProposedMissionPlan(
    command: EnterPlanningReviewCommand,
    missionId: string,
  ): Promise<ProposedMissionPlan> {
    if (command.proposedMissionPlanId !== undefined) {
      const proposedMissionPlanId = ProposedMissionPlanId.fromString(
        command.proposedMissionPlanId,
      ).toString();
      const proposedMissionPlan = await this.proposedMissionPlanRepository.getById(
        proposedMissionPlanId,
      );

      if (proposedMissionPlan === undefined) {
        throw new ProposedMissionPlanNotFoundError(proposedMissionPlanId);
      }

      return proposedMissionPlan;
    }

    const proposedMissionPlans = await this.proposedMissionPlanRepository.getByMissionId(missionId);

    if (proposedMissionPlans.length === 0) {
      throw new PlanningCorrelationAssociationRejectedError(
        `No ProposedMissionPlan was found for Mission '${missionId}'.`,
      );
    }

    if (proposedMissionPlans.length > 1) {
      throw new PlanningCorrelationAssociationRejectedError(
        `Mission '${missionId}' has ambiguous ProposedMissionPlan references for PlanningCorrelation.`,
      );
    }

    const proposedMissionPlan = proposedMissionPlans[0];

    if (proposedMissionPlan === undefined) {
      throw new PlanningCorrelationAssociationRejectedError(
        `No ProposedMissionPlan was found for Mission '${missionId}'.`,
      );
    }

    return proposedMissionPlan;
  }

  private assertSubmittedCurrentRevision(
    proposedMissionPlanSnapshot: ProposedMissionPlanSnapshot,
    currentRevisionSnapshot: ProposedPlanRevisionSnapshot,
    submittedProposedPlanRevisionId: string,
  ): void {
    const normalizedSubmittedRevisionId = ProposedPlanRevisionId.fromString(
      submittedProposedPlanRevisionId,
    ).toString();
    const matchingRevisions = proposedMissionPlanSnapshot.revisions.filter(
      (revision) => revision.id === normalizedSubmittedRevisionId,
    );

    if (matchingRevisions.length !== 1) {
      throw new PlanningCorrelationAssociationRejectedError(
        `ProposedPlanRevision '${normalizedSubmittedRevisionId}' was not found exactly once in ProposedMissionPlan '${proposedMissionPlanSnapshot.id}'.`,
      );
    }

    if (currentRevisionSnapshot.id !== normalizedSubmittedRevisionId) {
      throw new PlanningCorrelationAssociationRejectedError(
        `ProposedMissionPlan '${proposedMissionPlanSnapshot.id}' has later ProposedPlanRevision '${currentRevisionSnapshot.id}' after requested Submitted revision '${normalizedSubmittedRevisionId}'.`,
      );
    }

    if (currentRevisionSnapshot.lifecycleState !== 'Submitted') {
      throw new PlanningCorrelationAssociationRejectedError(
        `ProposedPlanRevision '${normalizedSubmittedRevisionId}' must be Submitted before Review entry; current state is '${currentRevisionSnapshot.lifecycleState}'.`,
      );
    }
  }

  private async resolveIdempotentUnderReviewResult(
    missionId: string,
    proposedMissionPlanId: string,
    currentRevisionSnapshot: ProposedPlanRevisionSnapshot,
    proposedMissionPlanSnapshot: ProposedMissionPlanSnapshot,
  ): Promise<EnterPlanningReviewResult> {
    const planningCorrelation = await this.planningCorrelationRepository.findByProposedPlanRevision({
      missionId,
      proposedMissionPlanId,
      proposedPlanRevisionId: currentRevisionSnapshot.id,
    });

    if (planningCorrelation === undefined || planningCorrelation.reviewId === undefined) {
      throw new PlanningCorrelationAssociationRejectedError(
        `PlanningCorrelation for Under Review ProposedPlanRevision '${currentRevisionSnapshot.id}' was not found exactly once with a Review reference.`,
      );
    }

    return Object.freeze({
      proposedMissionPlan: proposedMissionPlanSnapshot,
      planningCorrelation: planningCorrelation.toSnapshot(),
      reviewId: planningCorrelation.reviewId,
    });
  }

  private createStartReviewCommand(
    command: EnterPlanningReviewCommand,
    missionId: string,
    missionPlanRevision: string,
  ): StartReviewCommand {
    return {
      ...(command.reviewId === undefined ? {} : { id: command.reviewId }),
      missionId,
      missionPlanRevision,
      reviewCriteria: command.reviewCriteria,
      evidenceReferences: command.evidenceReferences,
    };
  }

  private assertReviewMatchesRevision(
    review: { readonly id: string; readonly missionId: string; readonly missionPlanRevision: string },
    missionId: string,
    proposedPlanRevisionId: string,
  ): void {
    if (normalizeNonEmptyString(review.id, 'Review id').length === 0) {
      throw new PlanningCorrelationAssociationRejectedError(
        `Review reference for ProposedPlanRevision '${proposedPlanRevisionId}' was not resolved.`,
      );
    }

    if (review.missionId !== missionId) {
      throw new PlanningCorrelationAssociationRejectedError(
        `Review '${review.id}' Mission '${review.missionId}' does not match PlanningCorrelation Mission '${missionId}'.`,
      );
    }

    if (review.missionPlanRevision !== proposedPlanRevisionId) {
      throw new PlanningCorrelationAssociationRejectedError(
        `Review '${review.id}' ProposedPlanRevision '${review.missionPlanRevision}' does not match PlanningCorrelation ProposedPlanRevision '${proposedPlanRevisionId}'.`,
      );
    }
  }

  private async assertReviewIsUncorrelated(reviewId: string): Promise<void> {
    const existingCorrelation = await this.planningCorrelationRepository.findByReviewId(reviewId);

    if (existingCorrelation !== undefined) {
      throw new PlanningCorrelationAssociationRejectedError(
        `Review '${reviewId}' is already associated with PlanningCorrelation '${existingCorrelation.id.toString()}'.`,
      );
    }
  }
}
