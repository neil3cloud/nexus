import type { ExecutionSessionSnapshot } from './execution-session.types';

export interface CreateExecutionSessionCommand {
  readonly id?: string;
  readonly engineeringSessionId: string;
  readonly assignedRole: string;
  readonly assignedAdapter: string;
  readonly startedAt: string;
  readonly completedAt: string;
  readonly consumedProjectionVersion: string;
  readonly producedArtifacts?: readonly string[];
  readonly executionOutcome: string;
}

export interface ExecutionSessionServiceContract {
  createExecutionSession(command: CreateExecutionSessionCommand): Promise<ExecutionSessionSnapshot>;
  getExecutionSession(executionSessionId: string): Promise<ExecutionSessionSnapshot>;
  enumerateExecutionSessions(
    engineeringSessionId?: string,
  ): Promise<readonly ExecutionSessionSnapshot[]>;
}
