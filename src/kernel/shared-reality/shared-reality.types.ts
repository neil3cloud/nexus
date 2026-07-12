import type { EvidenceTypeName } from '../evidence/evidence-type';
import type { MissionPlanSnapshot, TaskStatus } from '../mission/mission-planning.types';
import type { MissionSnapshot, MissionStatus } from '../mission/mission.types';

export interface EvidenceProjectionReference {
  readonly id: string;
  readonly type: EvidenceTypeName;
  readonly version: number;
  readonly source: string;
  readonly hash: string;
}

export interface EvidenceProjectionRequest {
  readonly id: string;
  readonly version?: number;
}

export interface ProjectionRequest {
  readonly missionId: string;
  readonly evidence?: readonly EvidenceProjectionRequest[];
}

export interface ProjectionContextAggregation {
  readonly evidenceByType: Readonly<Record<string, readonly EvidenceProjectionReference[]>>;
  readonly evidenceBySource: Readonly<Record<string, readonly EvidenceProjectionReference[]>>;
}

export interface MissionExecutionStateProjection {
  readonly missionStatus: MissionStatus;
  readonly tasks: readonly {
    readonly id: string;
    readonly status: TaskStatus;
  }[];
}

export interface ProjectionMetadata {
  readonly algorithm: 'nexus-shared-reality-foundation-v1';
  readonly evidenceCount: number;
  readonly missionPlanRevision: number;
}

export interface SharedRealitySnapshot {
  readonly activeMission: MissionSnapshot;
  readonly missionPlan: MissionPlanSnapshot;
  readonly missionExecutionState: MissionExecutionStateProjection;
  readonly evidenceReferences: readonly EvidenceProjectionReference[];
  readonly context: ProjectionContextAggregation;
}
