import { KernelError } from '../common/kernel-error';

export class GovernanceDecisionDomainError extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'GovernanceDecisionDomainError';
  }
}

export class InvalidGovernanceDecisionDefinitionError extends GovernanceDecisionDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidGovernanceDecisionDefinitionError';
  }
}

export class DuplicateGovernanceDecisionError extends GovernanceDecisionDomainError {
  public constructor(evaluationKey: string) {
    super(`GovernanceDecision for evaluation key '${evaluationKey}' already exists.`);
    this.name = 'DuplicateGovernanceDecisionError';
  }
}

export class ContradictoryGovernanceDecisionError extends GovernanceDecisionDomainError {
  public constructor(evaluationKey: string) {
    super(
      `GovernanceDecision for evaluation key '${evaluationKey}' conflicts with the recorded decision.`,
    );
    this.name = 'ContradictoryGovernanceDecisionError';
  }
}
