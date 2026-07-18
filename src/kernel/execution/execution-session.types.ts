export interface ExecutionSessionTimestampsInput {
  readonly startedAt: string;
  readonly completedAt: string;
}

export interface ExecutionSessionTimestampsSnapshot {
  readonly startedAt: string;
  readonly completedAt: string;
}

export interface ExecutionSessionInput {
  readonly id: string;
  readonly engineeringSessionId: string;
  readonly assignedRole: string;
  readonly assignedAdapter: string;
  readonly executionTimestamps: ExecutionSessionTimestampsInput;
  readonly consumedProjectionVersion: string;
  readonly producedArtifacts: readonly string[];
  readonly executionOutcome: string;
}

export interface ExecutionSessionSnapshot {
  readonly id: string;
  readonly engineeringSessionId: string;
  readonly assignedRole: string;
  readonly assignedAdapter: string;
  readonly executionTimestamps: ExecutionSessionTimestampsSnapshot;
  readonly consumedProjectionVersion: string;
  readonly producedArtifacts: readonly string[];
  readonly executionOutcome: string;
}
