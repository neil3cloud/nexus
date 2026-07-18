import { RoleId } from './role-id';
import { InvalidEngineeringRoleProfileDefinitionError } from './engineering-role-profile.errors';

export interface EngineeringRoleProfileInput {
  readonly roleId: RoleId | string;
  readonly workflowPresentationLabel: string;
  readonly completionPresentationLabel: string;
  readonly includeAssignedRoleInPresentation: boolean;
}

export interface EngineeringRoleProfileSnapshot {
  readonly roleId: string;
  readonly workflowPresentationLabel: string;
  readonly completionPresentationLabel: string;
  readonly includeAssignedRoleInPresentation: boolean;
}

export class EngineeringRoleProfile {
  private constructor(
    private readonly executionRoleId: RoleId,
    private readonly workflowLabel: string,
    private readonly completionLabel: string,
    private readonly includeAssignedRole: boolean,
  ) {
    Object.freeze(this);
  }

  public static create(input: EngineeringRoleProfileInput): EngineeringRoleProfile {
    return new EngineeringRoleProfile(
      normalizeRoleId(input.roleId),
      normalizeNonEmptyString(
        input.workflowPresentationLabel,
        'EngineeringRoleProfile workflowPresentationLabel',
      ),
      normalizeNonEmptyString(
        input.completionPresentationLabel,
        'EngineeringRoleProfile completionPresentationLabel',
      ),
      input.includeAssignedRoleInPresentation,
    );
  }

  public static fromSnapshot(snapshot: EngineeringRoleProfileSnapshot): EngineeringRoleProfile {
    return EngineeringRoleProfile.create({
      roleId: snapshot.roleId,
      workflowPresentationLabel: snapshot.workflowPresentationLabel,
      completionPresentationLabel: snapshot.completionPresentationLabel,
      includeAssignedRoleInPresentation: snapshot.includeAssignedRoleInPresentation,
    });
  }

  public get roleId(): RoleId {
    return this.executionRoleId;
  }

  public get workflowPresentationLabel(): string {
    return this.workflowLabel;
  }

  public get completionPresentationLabel(): string {
    return this.completionLabel;
  }

  public get includeAssignedRoleInPresentation(): boolean {
    return this.includeAssignedRole;
  }

  public equals(other: EngineeringRoleProfile): boolean {
    return (
      this.executionRoleId.equals(other.executionRoleId) &&
      this.workflowLabel === other.workflowLabel &&
      this.completionLabel === other.completionLabel &&
      this.includeAssignedRole === other.includeAssignedRole
    );
  }

  public toSnapshot(): EngineeringRoleProfileSnapshot {
    return Object.freeze({
      roleId: this.executionRoleId.toString(),
      workflowPresentationLabel: this.workflowLabel,
      completionPresentationLabel: this.completionLabel,
      includeAssignedRoleInPresentation: this.includeAssignedRole,
    });
  }
}

function normalizeRoleId(roleId: RoleId | string): RoleId {
  return typeof roleId === 'string' ? RoleId.fromString(roleId) : roleId;
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidEngineeringRoleProfileDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}

