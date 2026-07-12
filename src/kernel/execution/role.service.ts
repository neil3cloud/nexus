import { ServiceLifecycle } from '../common/service-lifecycle';
import { createDefaultKernelRoles } from './default-kernel-roles';
import { ExecutionRole } from './execution-role';
import type { ExecutionRoleInput } from './execution-role';
import { RoleAssignment } from './role-assignment';
import type { RoleAssignmentInput } from './role-assignment';
import {
  InMemoryRoleAssignmentRepository,
  type RoleAssignmentRepository,
} from './role-assignment.repository';
import { InMemoryRoleRegistry, type RoleRegistry } from './role-registry';
import { RoleValidation } from './role-validation';
import { RoleId } from './role-id';
import { RoleAssignmentNotFoundError, UnknownExecutionRoleError } from './role.errors';

export class RoleService extends ServiceLifecycle {
  public constructor(
    private readonly registry: RoleRegistry = new InMemoryRoleRegistry(),
    private readonly assignments: RoleAssignmentRepository = new InMemoryRoleAssignmentRepository(),
    private readonly defaultRoles: readonly ExecutionRole[] = createDefaultKernelRoles(),
  ) {
    super('RoleService');
  }

  public override async initialize(): Promise<void> {
    for (const role of this.defaultRoles) {
      if (!(await this.registry.has(role.id))) {
        await this.registry.register(role);
      }
    }

    await super.initialize();
  }

  public async registerRole(input: ExecutionRole | ExecutionRoleInput): Promise<ExecutionRole> {
    const role = input instanceof ExecutionRole ? input : ExecutionRole.create(input);

    await this.registry.register(role);

    return role;
  }

  public async retrieveRole(roleId: RoleId | string): Promise<ExecutionRole> {
    const normalizedRoleId = normalizeRoleId(roleId);
    const role = await this.registry.getById(normalizedRoleId);

    if (role === undefined) {
      throw new UnknownExecutionRoleError(normalizedRoleId.toString());
    }

    return role;
  }

  public async enumerateRoles(): Promise<readonly ExecutionRole[]> {
    return this.registry.enumerate();
  }

  public async assignRole(input: RoleAssignmentInput): Promise<RoleAssignment> {
    const assignment = RoleAssignment.create(input);
    const role = await this.registry.getById(assignment.roleId);

    RoleValidation.ensureKnownRole(role, assignment.roleId);
    RoleValidation.ensureTaskUnassigned(
      await this.assignments.getByTaskId(assignment.taskId),
      assignment.taskId,
    );

    await this.assignments.save(assignment);

    return assignment;
  }

  public async retrieveAssignment(taskId: string): Promise<RoleAssignment> {
    const assignment = await this.assignments.getByTaskId(taskId);

    if (assignment === undefined) {
      throw new RoleAssignmentNotFoundError(taskId.trim());
    }

    return assignment;
  }

  public async enumerateAssignments(): Promise<readonly RoleAssignment[]> {
    return this.assignments.enumerate();
  }
}

function normalizeRoleId(roleId: RoleId | string): RoleId {
  return typeof roleId === 'string' ? RoleId.fromString(roleId) : roleId;
}

