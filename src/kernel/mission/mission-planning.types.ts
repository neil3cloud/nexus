export const taskStatuses = [
  'Planned',
  'Ready',
  'InProgress',
  'Completed',
  'Cancelled',
] as const;

export type TaskStatus = (typeof taskStatuses)[number];

export type PlanningMetadataValue = string | number | boolean;

export type PlanningMetadata = Readonly<Record<string, PlanningMetadataValue>>;

export interface RevisionMetadata {
  readonly createdAt: string;
  readonly reason?: string;
  readonly attributes: PlanningMetadata;
}

export interface TaskSnapshot {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly parentMissionPlanId: string;
  readonly dependencies: readonly string[];
  readonly metadata: PlanningMetadata;
}

export interface PlanRevisionSnapshot {
  readonly revisionNumber: number;
  readonly metadata: RevisionMetadata;
  readonly tasks: readonly TaskSnapshot[];
}

export interface MissionPlanSnapshot {
  readonly id: string;
  readonly missionId: string;
  readonly revisionNumber: number;
  readonly metadata: PlanningMetadata;
  readonly tasks: readonly TaskSnapshot[];
  readonly revisions: readonly PlanRevisionSnapshot[];
}

export interface CreateMissionPlanRequest {
  readonly id?: string;
  readonly missionId: string;
  readonly metadata?: PlanningMetadata;
  readonly revisionReason?: string;
  readonly revisionMetadata?: PlanningMetadata;
}

export interface AddTaskRequest {
  readonly missionPlanId: string;
  readonly taskId?: string;
  readonly title: string;
  readonly description: string;
  readonly dependencies?: readonly string[];
  readonly metadata?: PlanningMetadata;
  readonly revisionReason?: string;
  readonly revisionMetadata?: PlanningMetadata;
}

export interface UpdateTaskRequest {
  readonly missionPlanId: string;
  readonly taskId: string;
  readonly title?: string;
  readonly description?: string;
  readonly status?: TaskStatus;
  readonly dependencies?: readonly string[];
  readonly metadata?: PlanningMetadata;
  readonly revisionReason?: string;
  readonly revisionMetadata?: PlanningMetadata;
}

export interface RemoveTaskRequest {
  readonly missionPlanId: string;
  readonly taskId: string;
  readonly revisionReason?: string;
  readonly revisionMetadata?: PlanningMetadata;
}

export interface ReviseMissionPlanRequest {
  readonly missionPlanId: string;
  readonly metadata?: PlanningMetadata;
  readonly revisionReason?: string;
  readonly revisionMetadata?: PlanningMetadata;
}
