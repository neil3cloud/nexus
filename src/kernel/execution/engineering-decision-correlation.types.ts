export interface EngineeringDecisionCorrelationSnapshot {
  readonly id: string;
  readonly missionId: string;
  readonly engineeringSessionId: string;
  readonly workflowStepId: string;
  readonly createdAt: string;
  readonly creationCausality: readonly string[];
  readonly creationCorrelationId?: string;
  readonly reviewId?: string;
  readonly governanceDecisionId?: string;
}

