import { RoleId } from './role-id';
import { RoleMetadata } from './role-metadata';
import type { RoleMetadataInput, RoleMetadataSnapshot } from './role-metadata';
import { InvalidRoleDefinitionError } from './role.errors';

export interface ExecutionRoleInput {
  readonly id: RoleId | string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly metadata?: RoleMetadata | RoleMetadataInput;
}

export interface ExecutionRoleSnapshot {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly metadata: RoleMetadataSnapshot;
}

export class ExecutionRole {
  private constructor(
    private readonly roleId: RoleId,
    private readonly roleName: string,
    private readonly roleDescription: string,
    private readonly roleCategory: string,
    private readonly roleMetadata: RoleMetadata,
  ) {
    Object.freeze(this);
  }

  public static create(input: ExecutionRoleInput): ExecutionRole {
    return new ExecutionRole(
      normalizeRoleId(input.id),
      normalizeNonEmptyString(input.name, 'ExecutionRole name'),
      normalizeNonEmptyString(input.description, 'ExecutionRole description'),
      normalizeNonEmptyString(input.category, 'ExecutionRole category'),
      normalizeMetadata(input.metadata),
    );
  }

  public static fromSnapshot(snapshot: ExecutionRoleSnapshot): ExecutionRole {
    return ExecutionRole.create({
      id: snapshot.id,
      name: snapshot.name,
      description: snapshot.description,
      category: snapshot.category,
      metadata: RoleMetadata.fromSnapshot(snapshot.metadata),
    });
  }

  public get id(): RoleId {
    return this.roleId;
  }

  public get name(): string {
    return this.roleName;
  }

  public get description(): string {
    return this.roleDescription;
  }

  public get category(): string {
    return this.roleCategory;
  }

  public get metadata(): RoleMetadata {
    return this.roleMetadata;
  }

  public equals(other: ExecutionRole): boolean {
    return (
      this.roleId.equals(other.roleId) &&
      this.roleName === other.roleName &&
      this.roleDescription === other.roleDescription &&
      this.roleCategory === other.roleCategory &&
      this.roleMetadata.equals(other.roleMetadata)
    );
  }

  public toSnapshot(): ExecutionRoleSnapshot {
    return Object.freeze({
      id: this.roleId.toString(),
      name: this.roleName,
      description: this.roleDescription,
      category: this.roleCategory,
      metadata: this.roleMetadata.toSnapshot(),
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

