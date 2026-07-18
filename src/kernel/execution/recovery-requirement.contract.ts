import type { RecoveryRequirementSnapshot } from './recovery-requirement.types';

export interface CreateRecoveryRequirementCommand {
  readonly missionId: string;
  readonly engineeringSessionId: string;
  readonly workflowStepId: string;
  readonly governanceDecisionId: string;
  readonly createdAt: string;
  readonly creationCausality?: readonly string[];
  readonly creationCorrelationId?: string;
}

export interface ResolveRecoveryRequirementCommand {
  readonly recoveryRequirementId: string;
  readonly acceptedOutcomeReference: string;
  readonly resolvedAt: string;
  readonly attribution: string;
  readonly causality?: readonly string[];
  readonly correlationId?: string;
}

export interface WithdrawRecoveryRequirementCommand {
  readonly recoveryRequirementId: string;
  readonly authoritativeDecisionReference: string;
  readonly reason: string;
  readonly withdrawnAt: string;
  readonly attribution: string;
  readonly causality?: readonly string[];
  readonly correlationId?: string;
}

export interface RecoveryRequirementServiceContract {
  createRecoveryRequirement(
    command: CreateRecoveryRequirementCommand,
  ): Promise<RecoveryRequirementSnapshot>;
  resolveRecoveryRequirement(
    command: ResolveRecoveryRequirementCommand,
  ): Promise<RecoveryRequirementSnapshot>;
  withdrawRecoveryRequirement(
    command: WithdrawRecoveryRequirementCommand,
  ): Promise<RecoveryRequirementSnapshot>;
}
