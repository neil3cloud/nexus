export interface MissionExecutionRequest {
  readonly missionId: string;
}

export interface TaskExecutionRequest {
  readonly missionId: string;
  readonly taskId: string;
}

