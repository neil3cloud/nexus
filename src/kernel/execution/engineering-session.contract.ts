import type {
  EngineeringSessionDiagnosticInput,
  EngineeringSessionMetadata,
  EngineeringSessionSnapshot,
} from './engineering-session.types';

export interface CreateEngineeringSessionCommand {
  readonly id?: string;
  readonly engineeringRuntimeContextReference: string;
  readonly activeEngineeringWorkflowReference: string;
  readonly participatingRoleIds: readonly string[];
  readonly workflowState: string;
  readonly collaborationMetadata?: EngineeringSessionMetadata;
  readonly diagnostics?: readonly EngineeringSessionDiagnosticInput[];
}

export interface CloseEngineeringSessionCommand {
  readonly engineeringSessionId: string;
}

export interface EngineeringSessionServiceContract {
  createEngineeringSession(command: CreateEngineeringSessionCommand): Promise<EngineeringSessionSnapshot>;
  closeEngineeringSession(command: CloseEngineeringSessionCommand): Promise<EngineeringSessionSnapshot>;
  getEngineeringSession(engineeringSessionId: string): Promise<EngineeringSessionSnapshot>;
  enumerateEngineeringSessions(): Promise<readonly EngineeringSessionSnapshot[]>;
}
