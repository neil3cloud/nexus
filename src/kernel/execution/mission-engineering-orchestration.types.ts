import type { EngineeringSessionHandoffState } from './engineering-session-handoff-status';

export interface MissionEngineeringGroupInput {
  readonly missionId: string;
  readonly engineeringSessionIds: readonly string[];
}

export interface MissionEngineeringGroupSnapshot {
  readonly missionId: string;
  readonly engineeringSessionIds: readonly string[];
}

export interface EngineeringSessionHandoffInput {
  readonly id: string;
  readonly missionId: string;
  readonly sourceEngineeringSessionId: string;
  readonly sourceRoleId: string;
  readonly targetEngineeringSessionId: string;
  readonly targetRoleId: string;
  readonly recordedAt: string;
  readonly status?: EngineeringSessionHandoffState | string;
}

export interface EngineeringSessionHandoffSnapshot {
  readonly id: string;
  readonly missionId: string;
  readonly sourceEngineeringSessionId: string;
  readonly sourceRoleId: string;
  readonly targetEngineeringSessionId: string;
  readonly targetRoleId: string;
  readonly recordedAt: string;
  readonly status: EngineeringSessionHandoffState;
}
