import { KernelError } from '../common/kernel-error';

export class MissionEngineeringOrchestrationDomainError extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'MissionEngineeringOrchestrationDomainError';
  }
}

export class InvalidMissionEngineeringGroupDefinitionError extends MissionEngineeringOrchestrationDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidMissionEngineeringGroupDefinitionError';
  }
}

export class DuplicateMissionEngineeringGroupAssociationError extends MissionEngineeringOrchestrationDomainError {
  public constructor(missionId: string, engineeringSessionId: string) {
    super(
      `MissionEngineeringGroup for Mission '${missionId}' already includes EngineeringSession '${engineeringSessionId}'.`,
    );
    this.name = 'DuplicateMissionEngineeringGroupAssociationError';
  }
}

export class InvalidEngineeringSessionHandoffDefinitionError extends MissionEngineeringOrchestrationDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidEngineeringSessionHandoffDefinitionError';
  }
}

export class UnauthorizedEngineeringSessionHandoffError extends MissionEngineeringOrchestrationDomainError {
  public constructor(missionId: string, sourceEngineeringSessionId: string, targetEngineeringSessionId: string) {
    super(
      `EngineeringSessionHandoff for Mission '${missionId}' requires both EngineeringSessions '${sourceEngineeringSessionId}' and '${targetEngineeringSessionId}' to participate in the MissionEngineeringGroup.`,
    );
    this.name = 'UnauthorizedEngineeringSessionHandoffError';
  }
}

export class DuplicateEngineeringSessionHandoffError extends MissionEngineeringOrchestrationDomainError {
  public constructor(missionId: string, sourceEngineeringSessionId: string, targetEngineeringSessionId: string) {
    super(
      `EngineeringSessionHandoff for Mission '${missionId}' from EngineeringSession '${sourceEngineeringSessionId}' to EngineeringSession '${targetEngineeringSessionId}' already exists.`,
    );
    this.name = 'DuplicateEngineeringSessionHandoffError';
  }
}
