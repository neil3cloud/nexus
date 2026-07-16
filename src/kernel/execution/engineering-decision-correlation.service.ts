import { randomUUID } from 'node:crypto';

import { ServiceLifecycle } from '../common/service-lifecycle';
import type { IGovernanceDecisionRepository } from '../governance/governance-decision.repository';
import { InMemoryGovernanceDecisionRepository } from '../governance/governance-decision.repository';
import type { IReviewRepository } from '../review/review.repository';
import { InMemoryReviewRepository } from '../review/review.repository';
import { EngineeringDecisionCorrelation } from './engineering-decision-correlation';
import type {
  AssociateGovernanceDecisionWithEngineeringDecisionCorrelationCommand,
  AssociateReviewWithEngineeringDecisionCorrelationCommand,
  BeginEngineeringDecisionCorrelationCommand,
  EngineeringDecisionCorrelationServiceContract,
  FindEngineeringDecisionCorrelationByWorkflowPositionCommand,
} from './engineering-decision-correlation.contract';
import {
  EngineeringDecisionCorrelationAssociationRejectedError,
  EngineeringDecisionCorrelationNotFoundError,
} from './engineering-decision-correlation.errors';
import {
  InMemoryEngineeringDecisionCorrelationRepository,
  type IEngineeringDecisionCorrelationRepository,
} from './engineering-decision-correlation.repository';
import type { EngineeringDecisionCorrelationSnapshot } from './engineering-decision-correlation.types';
import { EngineeringSessionId } from './engineering-session-id';
import {
  InMemoryMissionEngineeringGroupRepository,
  type IMissionEngineeringGroupRepository,
} from './mission-engineering-orchestration.repository';

export class EngineeringDecisionCorrelationService
  extends ServiceLifecycle
  implements EngineeringDecisionCorrelationServiceContract
{
  public constructor(
    private readonly repository: IEngineeringDecisionCorrelationRepository =
      new InMemoryEngineeringDecisionCorrelationRepository(),
    private readonly missionEngineeringGroupRepository: IMissionEngineeringGroupRepository =
      new InMemoryMissionEngineeringGroupRepository(),
    private readonly reviewRepository: IReviewRepository = new InMemoryReviewRepository(),
    private readonly governanceDecisionRepository: IGovernanceDecisionRepository =
      new InMemoryGovernanceDecisionRepository(),
    private readonly createIdentity: () => string = randomUUID,
    private readonly createTimestamp: () => string = () => new Date().toISOString(),
  ) {
    super('EngineeringDecisionCorrelationService');
  }

  public async beginCorrelation(
    command: BeginEngineeringDecisionCorrelationCommand,
  ): Promise<EngineeringDecisionCorrelationSnapshot> {
    const engineeringSessionId = EngineeringSessionId.fromString(command.engineeringSessionId);
    const missionId =
      await this.missionEngineeringGroupRepository.getMissionIdByEngineeringSessionId(
        engineeringSessionId,
      );
    const correlation = EngineeringDecisionCorrelation.create({
      id: this.createIdentity(),
      missionId: missionId.toString(),
      engineeringSessionId: engineeringSessionId.toString(),
      workflowStepId: command.workflowStepId,
      createdAt: this.createTimestamp(),
      ...(command.creationCausality === undefined
        ? {}
        : { creationCausality: command.creationCausality }),
      ...(command.creationCorrelationId === undefined
        ? {}
        : { creationCorrelationId: command.creationCorrelationId }),
    });

    return (await this.repository.register(correlation)).toSnapshot();
  }

  public async associateReview(
    command: AssociateReviewWithEngineeringDecisionCorrelationCommand,
  ): Promise<EngineeringDecisionCorrelationSnapshot> {
    const correlation = await this.requireCorrelation(command.correlationId);
    const review = await this.reviewRepository.getById(command.reviewId);

    if (review === undefined) {
      throw new EngineeringDecisionCorrelationAssociationRejectedError(
        `Review '${command.reviewId}' was not found for EngineeringDecisionCorrelation '${command.correlationId}'.`,
      );
    }

    if (review.missionId !== correlation.missionId) {
      throw new EngineeringDecisionCorrelationAssociationRejectedError(
        `Review '${review.id.toString()}' Mission '${review.missionId}' does not match EngineeringDecisionCorrelation '${correlation.id.toString()}' Mission '${correlation.missionId}'.`,
      );
    }

    return (await this.repository.save(correlation.associateReview(review.id.toString()))).toSnapshot();
  }

  public async associateGovernanceDecision(
    command: AssociateGovernanceDecisionWithEngineeringDecisionCorrelationCommand,
  ): Promise<EngineeringDecisionCorrelationSnapshot> {
    const correlation = await this.requireCorrelation(command.correlationId);
    const governanceDecision = await this.governanceDecisionRepository.getById(
      command.governanceDecisionId,
    );

    if (governanceDecision === undefined) {
      throw new EngineeringDecisionCorrelationAssociationRejectedError(
        `GovernanceDecision '${command.governanceDecisionId}' was not found for EngineeringDecisionCorrelation '${command.correlationId}'.`,
      );
    }

    if (governanceDecision.missionId !== correlation.missionId) {
      throw new EngineeringDecisionCorrelationAssociationRejectedError(
        `GovernanceDecision '${governanceDecision.id.toString()}' Mission '${governanceDecision.missionId}' does not match EngineeringDecisionCorrelation '${correlation.id.toString()}' Mission '${correlation.missionId}'.`,
      );
    }

    const governanceDecisionSnapshot = governanceDecision.toSnapshot();

    if (
      correlation.reviewId !== undefined &&
      governanceDecisionSnapshot.reviewId !== correlation.reviewId
    ) {
      throw new EngineeringDecisionCorrelationAssociationRejectedError(
        `GovernanceDecision '${governanceDecision.id.toString()}' Review '${governanceDecisionSnapshot.reviewId}' does not match EngineeringDecisionCorrelation '${correlation.id.toString()}' Review '${correlation.reviewId}'.`,
      );
    }

    return (
      await this.repository.save(
        correlation.associateGovernanceDecision(governanceDecision.id.toString()),
      )
    ).toSnapshot();
  }

  public async getCorrelation(
    correlationId: string,
  ): Promise<EngineeringDecisionCorrelationSnapshot | undefined> {
    return (await this.repository.getById(correlationId))?.toSnapshot();
  }

  public async findByReviewId(
    reviewId: string,
  ): Promise<EngineeringDecisionCorrelationSnapshot | undefined> {
    return (await this.repository.findByReviewId(reviewId))?.toSnapshot();
  }

  public async findByGovernanceDecisionId(
    governanceDecisionId: string,
  ): Promise<EngineeringDecisionCorrelationSnapshot | undefined> {
    return (await this.repository.findByGovernanceDecisionId(governanceDecisionId))?.toSnapshot();
  }

  public async findByWorkflowPosition(
    command: FindEngineeringDecisionCorrelationByWorkflowPositionCommand,
  ): Promise<EngineeringDecisionCorrelationSnapshot | undefined> {
    return (await this.repository.findByPositionKey(command))?.toSnapshot();
  }

  private async requireCorrelation(correlationId: string): Promise<EngineeringDecisionCorrelation> {
    const correlation = await this.repository.getById(correlationId);

    if (correlation === undefined) {
      throw new EngineeringDecisionCorrelationNotFoundError(correlationId);
    }

    return correlation;
  }
}
