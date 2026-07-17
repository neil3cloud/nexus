import { KernelError } from '../common/kernel-error';

export class PlanningDomainError extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'PlanningDomainError';
  }
}

export class InvalidPlanningDefinitionError extends PlanningDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidPlanningDefinitionError';
  }
}

export class StructuralPlanValidationError extends PlanningDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'StructuralPlanValidationError';
  }
}

export class InvalidProposalLifecycleTransitionError extends PlanningDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidProposalLifecycleTransitionError';
  }
}

export class DuplicateProposedMissionPlanError extends PlanningDomainError {
  public constructor(proposedMissionPlanId: string) {
    super(`ProposedMissionPlan '${proposedMissionPlanId}' already exists.`);
    this.name = 'DuplicateProposedMissionPlanError';
  }
}

export class ProposedMissionPlanNotFoundError extends PlanningDomainError {
  public constructor(proposedMissionPlanId: string) {
    super(`ProposedMissionPlan '${proposedMissionPlanId}' was not found.`);
    this.name = 'ProposedMissionPlanNotFoundError';
  }
}
