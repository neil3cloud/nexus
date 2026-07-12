import { RoleId } from './role-id';
import { RoleMetadata } from './role-metadata';
import type { RoleMetadataInput, RoleMetadataSnapshot } from './role-metadata';
import { InvalidRoleDefinitionError } from './role.errors';

export interface RoleAssignmentInput {
  readonly taskId: string;
  readonly roleId: RoleId | string;
  readonly metadata?: RoleMetadata | RoleMetadataInput;
}

export interface RoleAssignmentSnapshot {
  readonly taskId: string;
  readonly roleId: string;
  readonly metadata: RoleMetadataSnapshot;
}

export class RoleAssignment {
  private constructor(
    private readonly taskIdValue: string,
    private readonly roleIdValue: RoleId,
    private readonly assignmentMetadata: RoleMetadata,
  ) {
    Object.freeze(this);
  }

  public static create(input: RoleAssignmentInput): RoleAssignment {
    return new RoleAssignment(
      normalizeNonEmptyString(input.taskId, 'Task identity'),
      normalizeRoleId(input.roleId),
      normalizeMetadata(input.metadata),
    );
  }

  public static fromSnapshot(snapshot: RoleAssignmentSnapshot): RoleAssignment {
    return RoleAssignment.create({
      taskId: snapshot.taskId,
      roleId: snapshot.roleId,
      metadata: RoleMetadata.fromSnapshot(snapshot.metadata),
    });
  }

  public get taskId(): string {
    return this.taskIdValue;
  }

  public get roleId(): RoleId {
    return this.roleIdValue;
  }

  public get metadata(): RoleMetadata {
    return this.assignmentMetadata;
  }

  public equals(other: RoleAssignment): boolean {
    return (
      this.taskIdValue === other.taskIdValue &&
      this.roleIdValue.equals(other.roleIdValue) &&
      this.assignmentMetadata.equals(other.assignmentMetadata)
    );
  }

  public toSnapshot(): RoleAssignmentSnapshot {
    return Object.freeze({
      taskId: this.taskIdValue,
      roleId: this.roleIdValue.toString(),
      metadata: this.assignmentMetadata.toSnapshot(),
    });
  }
}

function normalizeRoleId(roleId: RoleId | string): RoleId {
  return typeof roleId === 'string' ? RoleId.fromString(roleId) : roleId;
}

function normalizeMetadata(metadata: RoleMetadata | RoleMetadataInput | undefined): RoleMetadata {
  if (metadata instanceof RoleMetadata) {
    return metadata;
  }

  return RoleMetadata.create(metadata ?? {});
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidRoleDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}

