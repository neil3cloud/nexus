import type { EngineeringDecisionCorrelationSnapshot } from './engineering-decision-correlation.types';

export interface BeginEngineeringDecisionCorrelationCommand {
  readonly engineeringSessionId: string;
  readonly workflowStepId: string;
  readonly creationCausality?: readonly string[];
  readonly creationCorrelationId?: string;
}

export interface AssociateReviewWithEngineeringDecisionCorrelationCommand {
  readonly correlationId: string;
  readonly reviewId: string;
}

export interface AssociateGovernanceDecisionWithEngineeringDecisionCorrelationCommand {
  readonly correlationId: string;
  readonly governanceDecisionId: string;
}

export interface FindEngineeringDecisionCorrelationByWorkflowPositionCommand {
  readonly missionId: string;
  readonly engineeringSessionId: string;
  readonly workflowStepId: string;
}

export interface EngineeringDecisionCorrelationServiceContract {
  beginCorrelation(
    command: BeginEngineeringDecisionCorrelationCommand,
  ): Promise<EngineeringDecisionCorrelationSnapshot>;
  associateReview(
    command: AssociateReviewWithEngineeringDecisionCorrelationCommand,
  ): Promise<EngineeringDecisionCorrelationSnapshot>;
  associateGovernanceDecision(
    command: AssociateGovernanceDecisionWithEngineeringDecisionCorrelationCommand,
  ): Promise<EngineeringDecisionCorrelationSnapshot>;
  getCorrelation(correlationId: string): Promise<EngineeringDecisionCorrelationSnapshot | undefined>;
  findByReviewId(reviewId: string): Promise<EngineeringDecisionCorrelationSnapshot | undefined>;
  findByGovernanceDecisionId(
    governanceDecisionId: string,
  ): Promise<EngineeringDecisionCorrelationSnapshot | undefined>;
  findByWorkflowPosition(
    command: FindEngineeringDecisionCorrelationByWorkflowPositionCommand,
  ): Promise<EngineeringDecisionCorrelationSnapshot | undefined>;
}

