import { KernelError } from '../common/kernel-error';

export class SharedRealityDomainException extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class ProjectionValidationError extends SharedRealityDomainException {}

export class ProjectionEvidenceNotFoundError extends ProjectionValidationError {
  public constructor(evidenceId: string) {
    super(`Evidence '${evidenceId}' is required for Shared Reality projection but was not found.`);
  }
}

export class ProjectionMissionNotFoundError extends ProjectionValidationError {
  public constructor(missionId: string) {
    super(`Mission '${missionId}' is required for Shared Reality projection but was not found.`);
  }
}

export class ProjectionMissionPlanNotFoundError extends ProjectionValidationError {
  public constructor(missionId: string) {
    super(`Mission '${missionId}' has no MissionPlan for Shared Reality projection.`);
  }
}

export class ProjectionInactiveMissionError extends ProjectionValidationError {
  public constructor(missionId: string, status: string) {
    super(
      `Mission '${missionId}' must be active for Shared Reality projection; current status is '${status}'.`,
    );
  }
}

export class ProjectionEvidenceRequiredError extends ProjectionValidationError {
  public constructor() {
    super('Shared Reality projection requires at least one Evidence instance.');
  }
}

export class DuplicateProjectionEvidenceReferenceError extends ProjectionValidationError {
  public constructor(evidenceId: string) {
    super(`Evidence '${evidenceId}' was referenced more than once for Shared Reality projection.`);
  }
}

export class ProjectionEvidenceVersionMismatchError extends ProjectionValidationError {
  public constructor(evidenceId: string, expectedVersion: number, actualVersion: number) {
    super(
      `Evidence '${evidenceId}' version '${actualVersion}' does not match requested version '${expectedVersion}'.`,
    );
  }
}

export class UnsupportedProjectionEvidenceTypeError extends ProjectionValidationError {
  public constructor(evidenceId: string, evidenceType: string) {
    super(
      `Evidence '${evidenceId}' has unsupported type '${evidenceType}' for Shared Reality projection.`,
    );
  }
}

export class ProjectionConsistencyError extends ProjectionValidationError {}
