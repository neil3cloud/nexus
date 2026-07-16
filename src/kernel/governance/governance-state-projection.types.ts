import type { GovernanceDecisionValue } from './governance.types';
import type { RecoveryRequirementStatus } from '../execution/recovery-requirement.types';

export interface GovernanceStateProjectionDecisionSnapshot {
  readonly governanceDecisionId: string;
  readonly outcome: GovernanceDecisionValue;
  readonly repositoryPolicyId: string;
  readonly repositoryPolicyVersion: number;
  readonly reviewId: string;
  readonly policyEvaluationId: string;
  readonly evaluationKey: string;
  readonly explanationCodes: readonly string[];
  readonly recordedAt: string;
  readonly eventId: string;
  readonly governanceEscalationId?: string;
}

export interface GovernanceStateProjectionRecoveryRequirementSnapshot {
  readonly recoveryRequirementId: string;
  readonly governanceDecisionId: string;
  readonly status: RecoveryRequirementStatus;
  readonly createdAt: string;
  readonly lastUpdatedAt: string;
  readonly lastEventId: string;
  readonly resolvedAt?: string;
  readonly withdrawnAt?: string;
}

export interface GovernanceStateProjectionDiagnosticsSnapshot {
  readonly consumedEventCount: number;
  readonly consumedEventIds: readonly string[];
  readonly lastEventId?: string;
  readonly lastUpdatedAt?: string;
}

export interface GovernanceStateProjectionSnapshot {
  readonly missionId: string;
  readonly latestGovernanceDecision?: GovernanceStateProjectionDecisionSnapshot;
  readonly recoveryRequirements: readonly GovernanceStateProjectionRecoveryRequirementSnapshot[];
  readonly unresolvedRecoveryRequirements: readonly GovernanceStateProjectionRecoveryRequirementSnapshot[];
  readonly isBlocking: boolean;
  readonly hasEscalationRequired: boolean;
  readonly attribution: {
    readonly missionId: string;
  };
  readonly diagnostics: GovernanceStateProjectionDiagnosticsSnapshot;
}
