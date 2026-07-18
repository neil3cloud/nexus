export const recoveryRequirementStatuses = ['Open', 'Resolved', 'Withdrawn'] as const;
export type RecoveryRequirementStatus = (typeof recoveryRequirementStatuses)[number];

export interface RecoveryRequirementResolutionSnapshot {
  readonly acceptedOutcomeReference: string;
  readonly resolvedAt: string;
  readonly attribution: string;
  readonly causality: readonly string[];
  readonly correlationId?: string;
}

export interface RecoveryRequirementWithdrawalSnapshot {
  readonly authoritativeDecisionReference: string;
  readonly reason: string;
  readonly withdrawnAt: string;
  readonly attribution: string;
  readonly causality: readonly string[];
  readonly correlationId?: string;
}

export interface RecoveryRequirementSnapshot {
  readonly id: string;
  readonly missionId: string;
  readonly engineeringSessionId: string;
  readonly workflowStepId: string;
  readonly governanceDecisionId: string;
  readonly createdAt: string;
  readonly creationCausality: readonly string[];
  readonly creationCorrelationId?: string;
  readonly status: RecoveryRequirementStatus;
  readonly resolution?: RecoveryRequirementResolutionSnapshot;
  readonly withdrawal?: RecoveryRequirementWithdrawalSnapshot;
}

