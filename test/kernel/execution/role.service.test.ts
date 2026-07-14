import { describe, expect, it } from 'vitest';

import { ExecutionRole } from '../../../src/kernel/execution/execution-role';
import { InMemoryRoleAssignmentRepository } from '../../../src/kernel/execution/role-assignment.repository';
import { InMemoryRoleRegistry } from '../../../src/kernel/execution/role-registry';
import { RoleService } from '../../../src/kernel/execution/role.service';
import {
  DuplicateRoleAssignmentError,
  RoleAssignmentNotFoundError,
  UnknownExecutionRoleError,
} from '../../../src/kernel/execution/role.errors';

describe('RoleService', () => {
  it('registers default Kernel roles during initialization', async () => {
    const service = new RoleService();

    await service.initialize();

    expect((await service.enumerateRoles()).map((role) => role.name)).toEqual([
      'Builder',
      'Documentation Reviewer',
      'Reviewer',
    ]);
  });

  it('coordinates custom role registration without provider concepts', async () => {
    const service = new RoleService(new InMemoryRoleRegistry(), new InMemoryRoleAssignmentRepository(), []);

    const role = await service.registerRole({
      id: 'documentation-reviewer',
      name: 'Documentation Reviewer',
      description: 'Reviews documentation changes.',
      category: 'Engineering Responsibility',
    });

    expect((await service.retrieveRole('documentation-reviewer')).equals(role)).toBe(true);
  });

  it('assigns known roles and exposes assignment lookup operations', async () => {
    const registry = new InMemoryRoleRegistry();
    const assignments = new InMemoryRoleAssignmentRepository();
    const builder = ExecutionRole.create({
      id: 'builder',
      name: 'Builder',
      description: 'Implements authorized work.',
      category: 'Engineering Responsibility',
    });
    const service = new RoleService(registry, assignments, [builder]);

    await service.initialize();

    const assignment = await service.assignRole({
      taskId: 'task-1',
      roleId: 'builder',
      metadata: {
        attributes: {
          reason: 'implementation',
        },
      },
    });

    expect((await service.retrieveAssignment('task-1')).equals(assignment)).toBe(true);
    expect((await service.enumerateAssignments()).map((item) => item.taskId)).toEqual(['task-1']);
  });

  it('rejects unknown roles, duplicate assignments, and missing assignments', async () => {
    const service = new RoleService();

    await service.initialize();

    await expect(
      service.assignRole({
        taskId: 'task-1',
        roleId: 'missing-role',
      }),
    ).rejects.toThrow(UnknownExecutionRoleError);

    await service.assignRole({
      taskId: 'task-1',
      roleId: 'builder',
    });

    await expect(
      service.assignRole({
        taskId: 'task-1',
        roleId: 'reviewer',
      }),
    ).rejects.toThrow(DuplicateRoleAssignmentError);
    await expect(service.retrieveAssignment('missing-task')).rejects.toThrow(
      RoleAssignmentNotFoundError,
    );
  });
});
