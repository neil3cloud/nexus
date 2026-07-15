import type { GovernanceDecisionSnapshot } from './governance.types';

export interface EvaluateGovernancePolicyCommand {
  readonly repositoryPolicyId: string;
  readonly repositoryPolicyVersion: number;
  readonly reviewId: string;
  readonly reviewStateReference?: string;
  readonly evaluatedAt: string;
  readonly policyEvaluationId?: string;
  readonly governanceDecisionId?: string;
  readonly governanceEscalationId?: string;
}

export interface GovernanceServiceContract {
  evaluateGovernancePolicy(
    command: EvaluateGovernancePolicyCommand,
  ): Promise<GovernanceDecisionSnapshot>;
}
