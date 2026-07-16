import type { GovernanceDecisionSnapshot } from '../governance/governance.types';
import { MissionCompletionRejectedError } from './mission.errors';

export interface MissionCompletionGovernanceEligibilityInput {
  readonly governanceDecisions: readonly GovernanceDecisionSnapshot[];
}

export function isGovernanceGatedMissionCompletionEligible(
  input: MissionCompletionGovernanceEligibilityInput,
): boolean {
  return input.governanceDecisions.every((governanceDecision) =>
    isNonBlockingGovernanceDecision(governanceDecision),
  );
}

export function assertGovernanceGatedMissionCompletionEligible(
  input: MissionCompletionGovernanceEligibilityInput,
): void {
  const blockingGovernanceDecision = input.governanceDecisions.find(
    (governanceDecision) => !isNonBlockingGovernanceDecision(governanceDecision),
  );

  if (blockingGovernanceDecision === undefined) {
    return;
  }

  throw new MissionCompletionRejectedError(
    `Mission '${blockingGovernanceDecision.missionId}' cannot complete because GovernanceDecision '${blockingGovernanceDecision.id}' is '${blockingGovernanceDecision.value}'.`,
  );
}

function isNonBlockingGovernanceDecision(
  governanceDecision: GovernanceDecisionSnapshot,
): boolean {
  return governanceDecision.value === 'Approved';
}
