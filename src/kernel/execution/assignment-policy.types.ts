export interface AssignmentPolicyInput {
  readonly id: string;
  readonly requiredRole: string;
  readonly adapterExecutionCapability: string;
  readonly repositoryConfiguration: Readonly<Record<string, string>>;
  readonly executionConstraints: Readonly<Record<string, string>>;
  readonly humanPreferences: Readonly<Record<string, string>>;
}

export interface AssignmentPolicySnapshot {
  readonly id: string;
  readonly requiredRole: string;
  readonly adapterExecutionCapability: string;
  readonly repositoryConfiguration: Readonly<Record<string, string>>;
  readonly executionConstraints: Readonly<Record<string, string>>;
  readonly humanPreferences: Readonly<Record<string, string>>;
}

export interface AssignmentPolicyEvaluationInput {
  readonly requiredRole: string;
  readonly adapterExecutionCapability: string;
  readonly repositoryConfiguration: Readonly<Record<string, string>>;
  readonly executionConstraints: Readonly<Record<string, string>>;
  readonly humanPreferences: Readonly<Record<string, string>>;
}

export interface AssignmentRequirementEvaluation {
  readonly requiredRole: boolean;
  readonly adapterExecutionCapability: boolean;
  readonly repositoryConfiguration: boolean;
  readonly executionConstraints: boolean;
  readonly humanPreferences: boolean;
}

export interface AssignmentPolicyEvaluationResult {
  readonly assignmentPolicyId: string;
  readonly satisfied: boolean;
  readonly requirements: AssignmentRequirementEvaluation;
}
