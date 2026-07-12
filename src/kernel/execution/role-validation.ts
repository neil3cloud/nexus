import type { ExecutionRole } from './execution-role';
import type { RoleAssignment } from './role-assignment';
import { RoleId } from './role-id';
import { DuplicateRoleAssignmentError, UnknownExecutionRoleError } from './role.errors';

export class RoleValidation {
  private constructor() {}

  public static ensureKnownRole(
    role: ExecutionRole | undefined,
    roleId: RoleId | string,
  ): ExecutionRole {
    const normalizedRoleId = normalizeRoleId(roleId);

    if (role === undefined) {
      throw new UnknownExecutionRoleError(normalizedRoleId.toString());
    }

    return role;
  }

  public static ensureTaskUnassigned(
    assignment: RoleAssignment | undefined,
    taskId: string,
  ): void {
    const normalizedTaskId = taskId.trim();

    if (assignment !== undefined) {
      throw new DuplicateRoleAssignmentError(normalizedTaskId);
    }
  }
}

function normalizeRoleId(roleId: RoleId | string): RoleId {
  return typeof roleId === 'string' ? RoleId.fromString(roleId) : roleId;
}

