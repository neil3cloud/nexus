import type { AdvancementTriggerInput } from './advancement-trigger.types';
import type { AdapterExecutionConstraints, AdapterRequestMetadata } from '../adapter/adapter-request';
import type {
  EngineeringSessionDiagnosticInput,
  EngineeringSessionMetadata,
  EngineeringSessionSnapshot,
  EngineeringSessionWorkflowExecutionResult,
} from './engineering-session.types';

export interface CreateEngineeringSessionCommand {
  readonly id?: string;
  readonly engineeringRuntimeContextReference: string;
  readonly activeEngineeringWorkflowReference: string;
  readonly workflowChainId: string;
  readonly currentWorkflowStepId: string;
  readonly participatingRoleIds: readonly string[];
  readonly workflowState: string;
  readonly collaborationMetadata?: EngineeringSessionMetadata;
  readonly diagnostics?: readonly EngineeringSessionDiagnosticInput[];
}

export interface CloseEngineeringSessionCommand {
  readonly engineeringSessionId: string;
}

export interface AdvanceEngineeringSessionWorkflowCommand {
  readonly engineeringSessionId: string;
}

export interface AdvanceEngineeringSessionWorkflowOnTriggerCommand {
  readonly engineeringSessionId: string;
  readonly trigger: AdvancementTriggerInput;
}

export interface AdvanceEngineeringSessionWorkflowAfterReviewCommand {
  readonly engineeringSessionId: string;
  readonly reviewOutcome: string;
}

export interface ExecuteCurrentWorkflowStepCommand {
  readonly engineeringSessionId: string;
  readonly executionStrategyId: string;
  readonly missionPlanId: string;
  readonly taskId: string;
  readonly adapterId: string;
  readonly contextPackageReference: string;
  readonly consumedProjectionVersion: string;
  readonly executionConstraints?: AdapterExecutionConstraints;
  readonly requestMetadata?: AdapterRequestMetadata;
}

export interface EngineeringSessionServiceContract {
  createEngineeringSession(command: CreateEngineeringSessionCommand): Promise<EngineeringSessionSnapshot>;
  closeEngineeringSession(command: CloseEngineeringSessionCommand): Promise<EngineeringSessionSnapshot>;
  advanceWorkflow(command: AdvanceEngineeringSessionWorkflowCommand): Promise<EngineeringSessionSnapshot>;
  advanceWorkflowOnTrigger(
    command: AdvanceEngineeringSessionWorkflowOnTriggerCommand,
  ): Promise<EngineeringSessionSnapshot>;
  advanceWorkflowAfterReview(
    command: AdvanceEngineeringSessionWorkflowAfterReviewCommand,
  ): Promise<EngineeringSessionSnapshot>;
  executeCurrentWorkflowStep(
    command: ExecuteCurrentWorkflowStepCommand,
  ): Promise<EngineeringSessionWorkflowExecutionResult>;
  getEngineeringSession(engineeringSessionId: string): Promise<EngineeringSessionSnapshot>;
  enumerateEngineeringSessions(): Promise<readonly EngineeringSessionSnapshot[]>;
}
