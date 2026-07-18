import type {
  EngineeringSessionHandoffSnapshot,
  MissionEngineeringGroupSnapshot,
} from './mission-engineering-orchestration.types';

export interface AssociateEngineeringSessionWithMissionCommand {
  readonly missionId: string;
  readonly engineeringSessionId: string;
}

export interface EnumerateMissionEngineeringGroupCommand {
  readonly missionId: string;
}

export interface RecordEngineeringSessionHandoffCommand {
  readonly handoffId?: string;
  readonly missionId: string;
  readonly sourceEngineeringSessionId: string;
  readonly sourceRoleId: string;
  readonly targetEngineeringSessionId: string;
  readonly targetRoleId: string;
}

export interface EnumerateEngineeringSessionHandoffsCommand {
  readonly missionId?: string;
}

export interface MissionEngineeringOrchestrationServiceContract {
  associateEngineeringSessionWithMission(
    command: AssociateEngineeringSessionWithMissionCommand,
  ): Promise<MissionEngineeringGroupSnapshot>;
  enumerateMissionEngineeringGroup(
    command: EnumerateMissionEngineeringGroupCommand,
  ): Promise<MissionEngineeringGroupSnapshot>;
  recordEngineeringSessionHandoff(
    command: RecordEngineeringSessionHandoffCommand,
  ): Promise<EngineeringSessionHandoffSnapshot>;
  enumerateEngineeringSessionHandoffs(
    command?: EnumerateEngineeringSessionHandoffsCommand,
  ): Promise<readonly EngineeringSessionHandoffSnapshot[]>;
}
