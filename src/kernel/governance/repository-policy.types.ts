export interface PolicyCriterionInput {
  readonly id: string;
  readonly description: string;
  readonly requiredInputs: readonly string[];
  readonly conditionDescriptor: string;
}

export interface PolicyCriterionSnapshot {
  readonly id: string;
  readonly description: string;
  readonly requiredInputs: readonly string[];
  readonly conditionDescriptor: string;
}

export interface RepositoryPolicyInitialInput {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly criteria: readonly PolicyCriterionInput[];
  readonly ratificationId: string;
}

export interface RepositoryPolicySupersessionInput {
  readonly name: string;
  readonly description: string;
  readonly criteria: readonly PolicyCriterionInput[];
  readonly ratificationId: string;
}

export interface RepositoryPolicyVersionInput extends RepositoryPolicyInitialInput {
  readonly version: number;
  readonly predecessorVersion?: number;
}

export interface RepositoryPolicySnapshot {
  readonly id: string;
  readonly version: number;
  readonly name: string;
  readonly description: string;
  readonly criteria: readonly PolicyCriterionSnapshot[];
  readonly ratificationId: string;
  readonly predecessorVersion?: number;
}
