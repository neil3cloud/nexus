import type {
  AssignmentPolicyEvaluationInput,
  AssignmentPolicyEvaluationResult,
  AssignmentPolicySnapshot,
} from './assignment-policy.types';

export interface CreateAssignmentPolicyCommand {
  readonly id?: string;
  readonly requiredRole: string;
  readonly adapterExecutionCapability: string;
  readonly repositoryConfiguration: Readonly<Record<string, string>>;
  readonly executionConstraints: Readonly<Record<string, string>>;
  readonly humanPreferences: Readonly<Record<string, string>>;
}

export interface EvaluateAssignmentPolicyCommand {
  readonly assignmentPolicyId: string;
  readonly input: AssignmentPolicyEvaluationInput;
}

export interface AssignmentPolicyServiceContract {
  createAssignmentPolicy(command: CreateAssignmentPolicyCommand): Promise<AssignmentPolicySnapshot>;
  getAssignmentPolicy(assignmentPolicyId: string): Promise<AssignmentPolicySnapshot>;
  enumerateAssignmentPolicies(): Promise<readonly AssignmentPolicySnapshot[]>;
  evaluateAssignmentPolicy(
    command: EvaluateAssignmentPolicyCommand,
  ): Promise<AssignmentPolicyEvaluationResult>;
}
