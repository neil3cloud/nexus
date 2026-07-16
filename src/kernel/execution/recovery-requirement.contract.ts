import type { RecoveryRequirementSnapshot } from './recovery-requirement.types';

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
  resolveRecoveryRequirement(
    command: ResolveRecoveryRequirementCommand,
  ): Promise<RecoveryRequirementSnapshot>;
  withdrawRecoveryRequirement(
    command: WithdrawRecoveryRequirementCommand,
  ): Promise<RecoveryRequirementSnapshot>;
}

