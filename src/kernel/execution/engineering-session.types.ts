import type { EngineeringSessionState } from './engineering-session-status';

export type EngineeringSessionMetadata = Readonly<Record<string, string>>;

export interface EngineeringSessionDiagnosticInput {
  readonly code: string;
  readonly message: string;
  readonly recordedAt: string;
}

export interface EngineeringSessionDiagnosticSnapshot {
  readonly code: string;
  readonly message: string;
  readonly recordedAt: string;
}

export interface EngineeringSessionStatusTransitionInput {
  readonly status: EngineeringSessionState | string;
  readonly occurredAt: string;
}

export interface EngineeringSessionStatusTransitionSnapshot {
  readonly status: EngineeringSessionState;
  readonly occurredAt: string;
}

export interface EngineeringSessionTimelineInput {
  readonly createdAt: string;
  readonly statusTransitions?: readonly EngineeringSessionStatusTransitionInput[];
  readonly closedAt?: string;
}

export interface EngineeringSessionTimelineSnapshot {
  readonly createdAt: string;
  readonly statusTransitions: readonly EngineeringSessionStatusTransitionSnapshot[];
  readonly closedAt?: string;
}

export interface EngineeringSessionInput {
  readonly id: string;
  readonly engineeringRuntimeContextReference: string;
  readonly activeEngineeringWorkflowReference: string;
  readonly workflowChainId: string;
  readonly currentWorkflowStepId: string;
  readonly participatingRoleIds: readonly string[];
  readonly workflowState: string;
  readonly timeline: EngineeringSessionTimelineInput;
  readonly diagnostics?: readonly EngineeringSessionDiagnosticInput[];
  readonly collaborationMetadata?: EngineeringSessionMetadata;
}

export interface EngineeringSessionSnapshot {
  readonly id: string;
  readonly status: EngineeringSessionState;
  readonly engineeringRuntimeContextReference: string;
  readonly activeEngineeringWorkflowReference: string;
  readonly workflowChainId: string;
  readonly currentWorkflowStepId: string;
  readonly participatingRoleIds: readonly string[];
  readonly workflowState: string;
  readonly timeline: EngineeringSessionTimelineSnapshot;
  readonly diagnostics: readonly EngineeringSessionDiagnosticSnapshot[];
  readonly collaborationMetadata: EngineeringSessionMetadata;
}
