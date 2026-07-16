import type { EngineeringDecisionCorrelationSnapshot } from '../execution/engineering-decision-correlation.types';
import type { RecoveryRequirementSnapshot } from '../execution/recovery-requirement.types';
import type { GovernanceDecisionSnapshot } from '../governance/governance.types';
import { MissionCompletionRejectedError } from './mission.errors';

export interface MissionCompletionGovernanceEligibilityInput {
  readonly governanceDecisions: readonly GovernanceDecisionSnapshot[];
  readonly engineeringDecisionCorrelations?: readonly EngineeringDecisionCorrelationSnapshot[];
  readonly recoveryRequirements?: readonly RecoveryRequirementSnapshot[];
}

export function isGovernanceGatedMissionCompletionEligible(
  input: MissionCompletionGovernanceEligibilityInput,
): boolean {
  return applicableGovernanceDecisions(input).every((governanceDecision) =>
    isNonBlockingGovernanceDecision(governanceDecision),
  );
}

export function assertGovernanceGatedMissionCompletionEligible(
  input: MissionCompletionGovernanceEligibilityInput,
): void {
  const blockingGovernanceDecision = applicableGovernanceDecisions(input).find(
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

function applicableGovernanceDecisions(
  input: MissionCompletionGovernanceEligibilityInput,
): readonly GovernanceDecisionSnapshot[] {
  return input.governanceDecisions.filter(
    (governanceDecision) => !isSupersededRejectedGovernanceDecision(governanceDecision, input),
  );
}

function isSupersededRejectedGovernanceDecision(
  governanceDecision: GovernanceDecisionSnapshot,
  input: MissionCompletionGovernanceEligibilityInput,
): boolean {
  if (governanceDecision.value !== 'Rejected') {
    return false;
  }

  const governedPosition = findUniqueCorrelationForGovernanceDecision(
    input.engineeringDecisionCorrelations ?? [],
    governanceDecision.id,
  );

  if (governedPosition === undefined) {
    return false;
  }

  const resolvedRecoveryRequirement = findResolvedRecoveryRequirement(
    input.recoveryRequirements ?? [],
    governanceDecision.id,
    governedPosition,
  );

  if (resolvedRecoveryRequirement?.resolution === undefined) {
    return false;
  }

  return input.governanceDecisions.some((candidateDecision) =>
    isSupersedingGovernanceDecision(
      candidateDecision,
      governanceDecision,
      governedPosition,
      resolvedRecoveryRequirement,
      input.engineeringDecisionCorrelations ?? [],
    ),
  );
}

function isSupersedingGovernanceDecision(
  candidateDecision: GovernanceDecisionSnapshot,
  supersededDecision: GovernanceDecisionSnapshot,
  governedPosition: EngineeringDecisionCorrelationSnapshot,
  recoveryRequirement: RecoveryRequirementSnapshot,
  engineeringDecisionCorrelations: readonly EngineeringDecisionCorrelationSnapshot[],
): boolean {
  if (
    candidateDecision.id === supersededDecision.id ||
    candidateDecision.value !== 'Approved' ||
    candidateDecision.evaluatedAt <= supersededDecision.evaluatedAt ||
    recoveryRequirement.resolution === undefined ||
    candidateDecision.evaluatedAt <= recoveryRequirement.resolution.resolvedAt
  ) {
    return false;
  }

  const candidatePosition = findUniqueCorrelationForGovernanceDecision(
    engineeringDecisionCorrelations,
    candidateDecision.id,
  );

  return (
    candidatePosition !== undefined &&
    candidatePosition.missionId === governedPosition.missionId &&
    candidatePosition.engineeringSessionId === governedPosition.engineeringSessionId &&
    candidatePosition.workflowStepId === governedPosition.workflowStepId
  );
}

function findUniqueCorrelationForGovernanceDecision(
  engineeringDecisionCorrelations: readonly EngineeringDecisionCorrelationSnapshot[],
  governanceDecisionId: string,
): EngineeringDecisionCorrelationSnapshot | undefined {
  const matchingCorrelations = engineeringDecisionCorrelations.filter(
    (correlation) => correlation.governanceDecisionId === governanceDecisionId,
  );

  return matchingCorrelations.length === 1 ? matchingCorrelations[0] : undefined;
}

function findResolvedRecoveryRequirement(
  recoveryRequirements: readonly RecoveryRequirementSnapshot[],
  governanceDecisionId: string,
  governedPosition: EngineeringDecisionCorrelationSnapshot,
): RecoveryRequirementSnapshot | undefined {
  return recoveryRequirements.find(
    (recoveryRequirement) =>
      recoveryRequirement.governanceDecisionId === governanceDecisionId &&
      recoveryRequirement.missionId === governedPosition.missionId &&
      recoveryRequirement.engineeringSessionId === governedPosition.engineeringSessionId &&
      recoveryRequirement.workflowStepId === governedPosition.workflowStepId &&
      recoveryRequirement.status === 'Resolved',
  );
}
