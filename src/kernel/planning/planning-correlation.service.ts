import { randomUUID } from 'node:crypto';

import { ServiceLifecycle } from '../common/service-lifecycle';
import type { GovernanceServiceContract } from '../governance/governance.contract';
import {
  InMemoryGovernanceDecisionRepository,
  type IGovernanceDecisionRepository,
} from '../governance/governance-decision.repository';
import { GovernanceService } from '../governance/governance.service';
import type {
  GovernanceDecisionSnapshot,
  GovernanceDecisionValue,
} from '../governance/governance.types';
import { RepositoryPolicyId } from '../governance/repository-policy-id';
import {
  InMemoryRepositoryPolicyRepository,
  type IRepositoryPolicyRepository,
} from '../governance/repository-policy.repository';
import { MissionId } from '../mission/mission-id';
import type { ReviewServiceContract, StartReviewCommand } from '../review/review.contract';
import { ReviewService } from '../review/review.service';
import type { ReviewCriteriaSnapshot, ReviewSnapshot } from '../review/review.types';
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
  TransitionProposedPlanRevisionInput,
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

export interface EvaluatePlanningGovernanceCommand extends TransitionProposedPlanRevisionInput {
  readonly missionId: string;
  readonly planningCorrelationId: string;
  readonly repositoryPolicyId: string;
  readonly repositoryPolicyVersion: number;
  readonly evaluatedAt: string;
  readonly policyEvaluationId?: string;
  readonly governanceDecisionId?: string;
  readonly governanceEscalationId?: string;
}

export interface EvaluatePlanningGovernanceResult {
  readonly proposedMissionPlan: ProposedMissionPlanSnapshot;
  readonly planningCorrelation: PlanningCorrelationSnapshot;
  readonly governanceDecision?: GovernanceDecisionSnapshot;
}

export class PlanningCorrelationService extends ServiceLifecycle {
  public constructor(
    private readonly proposedMissionPlanRepository: IProposedMissionPlanRepository =
      new InMemoryProposedMissionPlanRepository(),
    private readonly planningCorrelationRepository: IPlanningCorrelationRepository =
      new InMemoryPlanningCorrelationRepository(),
    private readonly reviewService: Pick<ReviewServiceContract, 'startReview'> &
      Partial<Pick<ReviewServiceContract, 'queryReviewResult'>> = new ReviewService(),
    private readonly createIdentity: () => string = randomUUID,
    private readonly governanceService: GovernanceServiceContract = new GovernanceService(),
    private readonly repositoryPolicyRepository: IRepositoryPolicyRepository =
      new InMemoryRepositoryPolicyRepository(),
    private readonly governanceDecisionRepository: IGovernanceDecisionRepository =
      new InMemoryGovernanceDecisionRepository(),
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

  public async evaluateGovernance(
    command: EvaluatePlanningGovernanceCommand,
  ): Promise<EvaluatePlanningGovernanceResult> {
    const missionId = MissionId.fromString(command.missionId).toString();
    const repositoryPolicyReference = normalizeRepositoryPolicyReference(command);
    const planningCorrelation = await this.requirePlanningCorrelation(command.planningCorrelationId);
    const planningCorrelationSnapshot = planningCorrelation.toSnapshot();

    this.assertCorrelationMission(planningCorrelationSnapshot, missionId);
    this.assertPolicyReevaluationIsStable(
      planningCorrelationSnapshot,
      repositoryPolicyReference,
    );

    const reviewId = requireReviewId(planningCorrelationSnapshot);
    const review = await this.resolveTerminalReview(reviewId);
    this.assertReviewMatchesCorrelation(review, planningCorrelationSnapshot);

    const proposedMissionPlan = await this.requireProposedMissionPlanById(
      planningCorrelationSnapshot.proposedMissionPlanId,
    );
    const currentRevisionSnapshot = proposedMissionPlan.currentRevision.toSnapshot();

    if (isIdempotentGovernanceState(currentRevisionSnapshot.lifecycleState)) {
      this.assertIdempotentGovernanceTransition(currentRevisionSnapshot, command);

      return Object.freeze({
        proposedMissionPlan: proposedMissionPlan.toSnapshot(),
        planningCorrelation: planningCorrelationSnapshot,
      });
    }

    this.assertUnderReviewRevisionMatchesCorrelation(
      currentRevisionSnapshot,
      planningCorrelationSnapshot,
    );

    if (!isGovernanceEligibleReviewOutcome(review)) {
      const rejectedProposedMissionPlan = proposedMissionPlan.rejectCurrentRevision(command);
      const savedProposedMissionPlan = await this.proposedMissionPlanRepository.save(
        rejectedProposedMissionPlan,
      );

      return Object.freeze({
        proposedMissionPlan: savedProposedMissionPlan.toSnapshot(),
        planningCorrelation: planningCorrelationSnapshot,
      });
    }

    await this.assertRepositoryPolicyIsCurrent(repositoryPolicyReference);

    const governanceDecision = await this.governanceService.evaluateGovernancePolicy({
      missionId,
      repositoryPolicyId: repositoryPolicyReference.repositoryPolicyId,
      repositoryPolicyVersion: repositoryPolicyReference.repositoryPolicyVersion,
      reviewId,
      evaluatedAt: command.evaluatedAt,
      ...(command.policyEvaluationId === undefined
        ? {}
        : { policyEvaluationId: command.policyEvaluationId }),
      ...(command.governanceDecisionId === undefined
        ? {}
        : { governanceDecisionId: command.governanceDecisionId }),
      ...(command.governanceEscalationId === undefined
        ? {}
        : { governanceEscalationId: command.governanceEscalationId }),
    });

    this.assertGovernanceDecisionMatchesCorrelation(
      governanceDecision,
      planningCorrelationSnapshot,
      repositoryPolicyReference,
    );

    const savedPlanningCorrelation = await this.savePlanningCorrelationGovernanceDecision(
      planningCorrelation,
      planningCorrelationSnapshot,
      repositoryPolicyReference,
      governanceDecision.id,
    );

    if (governanceDecision.value === 'Deferred' || governanceDecision.value === 'Escalation Required') {
      return Object.freeze({
        proposedMissionPlan: proposedMissionPlan.toSnapshot(),
        planningCorrelation: savedPlanningCorrelation.toSnapshot(),
        governanceDecision,
      });
    }

    const evaluatedProposedMissionPlan =
      governanceDecision.value === 'Approved'
        ? proposedMissionPlan.markCurrentRevisionGoverned(command)
        : proposedMissionPlan.rejectCurrentRevision(command);
    const savedProposedMissionPlan = await this.proposedMissionPlanRepository.save(
      evaluatedProposedMissionPlan,
    );

    return Object.freeze({
      proposedMissionPlan: savedProposedMissionPlan.toSnapshot(),
      planningCorrelation: savedPlanningCorrelation.toSnapshot(),
      governanceDecision,
    });
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

  private async requireProposedMissionPlanById(
    proposedMissionPlanId: string,
  ): Promise<ProposedMissionPlan> {
    const normalizedProposedMissionPlanId =
      ProposedMissionPlanId.fromString(proposedMissionPlanId).toString();
    const proposedMissionPlan = await this.proposedMissionPlanRepository.getById(
      normalizedProposedMissionPlanId,
    );

    if (proposedMissionPlan === undefined) {
      throw new ProposedMissionPlanNotFoundError(normalizedProposedMissionPlanId);
    }

    return proposedMissionPlan;
  }

  private async requirePlanningCorrelation(
    planningCorrelationId: string,
  ): Promise<PlanningCorrelation> {
    const planningCorrelation = await this.planningCorrelationRepository.getById(
      planningCorrelationId,
    );

    if (planningCorrelation === undefined) {
      throw new PlanningCorrelationAssociationRejectedError(
        `PlanningCorrelation '${planningCorrelationId}' was not found.`,
      );
    }

    return planningCorrelation;
  }

  private assertCorrelationMission(
    planningCorrelation: PlanningCorrelationSnapshot,
    missionId: string,
  ): void {
    if (planningCorrelation.missionId !== missionId) {
      throw new PlanningCorrelationAssociationRejectedError(
        `PlanningCorrelation '${planningCorrelation.id}' Mission '${planningCorrelation.missionId}' does not match requested Mission '${missionId}'.`,
      );
    }
  }

  private assertPolicyReevaluationIsStable(
    planningCorrelation: PlanningCorrelationSnapshot,
    repositoryPolicyReference: RepositoryPolicyReference,
  ): void {
    if (
      planningCorrelation.repositoryPolicyId === undefined &&
      planningCorrelation.repositoryPolicyVersion === undefined
    ) {
      return;
    }

    if (
      planningCorrelation.repositoryPolicyId === repositoryPolicyReference.repositoryPolicyId &&
      planningCorrelation.repositoryPolicyVersion ===
        repositoryPolicyReference.repositoryPolicyVersion
    ) {
      return;
    }

    throw new PlanningCorrelationAssociationRejectedError(
      `PlanningCorrelation '${planningCorrelation.id}' cannot be re-evaluated with RepositoryPolicy '${repositoryPolicyReference.repositoryPolicyId}' version '${repositoryPolicyReference.repositoryPolicyVersion}'.`,
    );
  }

  private async resolveTerminalReview(reviewId: string): Promise<ReviewSnapshot> {
    if (this.reviewService.queryReviewResult === undefined) {
      throw new PlanningCorrelationAssociationRejectedError(
        'Review outcome query contract is required for Planning Governance evaluation.',
      );
    }

    const review = (await this.reviewService.queryReviewResult({ reviewId })).review;

    if (review.status !== 'Completed' || review.outcome === undefined) {
      throw new PlanningCorrelationAssociationRejectedError(
        `Review '${reviewId}' must be Completed with a terminal ReviewOutcome before Planning Governance evaluation.`,
      );
    }

    return review;
  }

  private assertReviewMatchesCorrelation(
    review: ReviewSnapshot,
    planningCorrelation: PlanningCorrelationSnapshot,
  ): void {
    if (review.missionId !== planningCorrelation.missionId) {
      throw new PlanningCorrelationAssociationRejectedError(
        `Review '${review.id}' Mission '${review.missionId}' does not match PlanningCorrelation Mission '${planningCorrelation.missionId}'.`,
      );
    }

    if (
      review.missionPlanRevision.kind !== 'ProposedPlanRevision' ||
      review.missionPlanRevision.revisionId !== planningCorrelation.proposedPlanRevisionId
    ) {
      throw new PlanningCorrelationAssociationRejectedError(
        `Review '${review.id}' ProposedPlanRevision '${review.missionPlanRevision.revisionId}' does not match PlanningCorrelation ProposedPlanRevision '${planningCorrelation.proposedPlanRevisionId}'.`,
      );
    }
  }

  private assertUnderReviewRevisionMatchesCorrelation(
    currentRevisionSnapshot: ProposedPlanRevisionSnapshot,
    planningCorrelation: PlanningCorrelationSnapshot,
  ): void {
    if (
      currentRevisionSnapshot.lifecycleState !== 'Under Review' ||
      currentRevisionSnapshot.id !== planningCorrelation.proposedPlanRevisionId
    ) {
      throw new PlanningCorrelationAssociationRejectedError(
        `ProposedPlanRevision '${planningCorrelation.proposedPlanRevisionId}' must be the current Under Review revision before Planning Governance evaluation.`,
      );
    }
  }

  private assertIdempotentGovernanceTransition(
    currentRevisionSnapshot: ProposedPlanRevisionSnapshot,
    command: EvaluatePlanningGovernanceCommand,
  ): void {
    const normalizedProposedPlanRevisionId = ProposedPlanRevisionId.fromString(command.id).toString();

    if (currentRevisionSnapshot.id !== normalizedProposedPlanRevisionId) {
      throw new PlanningCorrelationAssociationRejectedError(
        `ProposedPlanRevision '${currentRevisionSnapshot.id}' already reached '${currentRevisionSnapshot.lifecycleState}' with a different transition identity.`,
      );
    }
  }

  private async assertRepositoryPolicyIsCurrent(
    repositoryPolicyReference: RepositoryPolicyReference,
  ): Promise<void> {
    const requestedPolicy = await this.repositoryPolicyRepository.getByIdAndVersion(
      repositoryPolicyReference.repositoryPolicyId,
      repositoryPolicyReference.repositoryPolicyVersion,
    );
    const currentPolicy = await this.repositoryPolicyRepository.getCurrent(
      repositoryPolicyReference.repositoryPolicyId,
    );

    if (requestedPolicy === undefined || currentPolicy === undefined) {
      throw new PlanningCorrelationAssociationRejectedError(
        `RepositoryPolicy '${repositoryPolicyReference.repositoryPolicyId}' version '${repositoryPolicyReference.repositoryPolicyVersion}' could not be resolved for Planning Governance evaluation.`,
      );
    }

    if (currentPolicy.version !== repositoryPolicyReference.repositoryPolicyVersion) {
      throw new PlanningCorrelationAssociationRejectedError(
        `RepositoryPolicy '${repositoryPolicyReference.repositoryPolicyId}' version '${repositoryPolicyReference.repositoryPolicyVersion}' is superseded and cannot be used for Planning Governance evaluation.`,
      );
    }
  }

  private assertGovernanceDecisionMatchesCorrelation(
    governanceDecision: GovernanceDecisionSnapshot,
    planningCorrelation: PlanningCorrelationSnapshot,
    repositoryPolicyReference: RepositoryPolicyReference,
  ): void {
    if (governanceDecision.missionId !== planningCorrelation.missionId) {
      throw new PlanningCorrelationAssociationRejectedError(
        `GovernanceDecision '${governanceDecision.id}' Mission '${governanceDecision.missionId}' does not match PlanningCorrelation Mission '${planningCorrelation.missionId}'.`,
      );
    }

    if (governanceDecision.reviewId !== planningCorrelation.reviewId) {
      throw new PlanningCorrelationAssociationRejectedError(
        `GovernanceDecision '${governanceDecision.id}' Review '${governanceDecision.reviewId}' does not match PlanningCorrelation Review '${planningCorrelation.reviewId}'.`,
      );
    }

    if (
      governanceDecision.repositoryPolicyId !== repositoryPolicyReference.repositoryPolicyId ||
      governanceDecision.repositoryPolicyVersion !== repositoryPolicyReference.repositoryPolicyVersion
    ) {
      throw new PlanningCorrelationAssociationRejectedError(
        `GovernanceDecision '${governanceDecision.id}' RepositoryPolicy attribution does not match PlanningCorrelation evaluation request.`,
      );
    }
  }

  private async savePlanningCorrelationGovernanceDecision(
    planningCorrelation: PlanningCorrelation,
    planningCorrelationSnapshot: PlanningCorrelationSnapshot,
    repositoryPolicyReference: RepositoryPolicyReference,
    governanceDecisionId: string,
  ): Promise<PlanningCorrelation> {
    const policyAssociatedCorrelation =
      planningCorrelation.associateRepositoryPolicy(repositoryPolicyReference);

    if (
      planningCorrelationSnapshot.governanceDecisionId !== undefined &&
      planningCorrelationSnapshot.governanceDecisionId !== governanceDecisionId
    ) {
      await this.assertExistingGovernanceDecisionCanBeSuperseded(
        planningCorrelationSnapshot.governanceDecisionId,
      );

      return this.planningCorrelationRepository.saveWithSupersededGovernanceDecision(
        policyAssociatedCorrelation.supersedeGovernanceDecision(governanceDecisionId),
      );
    }

    return this.planningCorrelationRepository.save(
      policyAssociatedCorrelation.associateGovernanceDecision(governanceDecisionId),
    );
  }

  private async assertExistingGovernanceDecisionCanBeSuperseded(
    governanceDecisionId: string,
  ): Promise<void> {
    const governanceDecision = await this.governanceDecisionRepository.getById(governanceDecisionId);

    if (governanceDecision === undefined) {
      throw new PlanningCorrelationAssociationRejectedError(
        `PlanningCorrelation GovernanceDecision '${governanceDecisionId}' could not be resolved for supersession.`,
      );
    }

    const governanceDecisionValue = governanceDecision.toSnapshot().value;

    if (isTerminalGovernanceDecisionValue(governanceDecisionValue)) {
      throw new PlanningCorrelationAssociationRejectedError(
        `PlanningCorrelation GovernanceDecision '${governanceDecisionId}' reached terminal outcome '${governanceDecisionValue}' and cannot be superseded.`,
      );
    }
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
      missionPlanRevision: {
        kind: 'ProposedPlanRevision',
        revisionId: missionPlanRevision,
      },
      reviewCriteria: command.reviewCriteria,
      evidenceReferences: command.evidenceReferences,
    };
  }

  private assertReviewMatchesRevision(
    review: Pick<ReviewSnapshot, 'id' | 'missionId' | 'missionPlanRevision'>,
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

    if (
      review.missionPlanRevision.kind !== 'ProposedPlanRevision' ||
      review.missionPlanRevision.revisionId !== proposedPlanRevisionId
    ) {
      throw new PlanningCorrelationAssociationRejectedError(
        `Review '${review.id}' ProposedPlanRevision '${review.missionPlanRevision.revisionId}' does not match PlanningCorrelation ProposedPlanRevision '${proposedPlanRevisionId}'.`,
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

interface RepositoryPolicyReference {
  readonly repositoryPolicyId: string;
  readonly repositoryPolicyVersion: number;
}

function normalizeRepositoryPolicyReference(
  command: EvaluatePlanningGovernanceCommand,
): RepositoryPolicyReference {
  if (!Number.isInteger(command.repositoryPolicyVersion) || command.repositoryPolicyVersion < 1) {
    throw new PlanningCorrelationAssociationRejectedError(
      'RepositoryPolicy version is required for Planning Governance evaluation.',
    );
  }

  return {
    repositoryPolicyId: RepositoryPolicyId.fromString(command.repositoryPolicyId).toString(),
    repositoryPolicyVersion: command.repositoryPolicyVersion,
  };
}

function requireReviewId(planningCorrelation: PlanningCorrelationSnapshot): string {
  if (planningCorrelation.reviewId === undefined) {
    throw new PlanningCorrelationAssociationRejectedError(
      `PlanningCorrelation '${planningCorrelation.id}' does not carry a Review reference.`,
    );
  }

  return planningCorrelation.reviewId;
}

function isGovernanceEligibleReviewOutcome(review: ReviewSnapshot): boolean {
  return review.outcome === 'Accepted' || review.outcome === 'Accepted With Observations';
}

function isIdempotentGovernanceState(lifecycleState: string): boolean {
  return lifecycleState === 'Governed' || lifecycleState === 'Rejected';
}

function isTerminalGovernanceDecisionValue(value: GovernanceDecisionValue): boolean {
  return value === 'Approved' || value === 'Rejected';
}
