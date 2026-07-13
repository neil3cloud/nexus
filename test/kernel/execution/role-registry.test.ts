import { describe, expect, it } from 'vitest';

import { ExecutionRole } from '../../../src/kernel/execution/execution-role';
import {
  InMemoryRoleAssignmentRepository,
} from '../../../src/kernel/execution/role-assignment.repository';
import { RoleAssignment } from '../../../src/kernel/execution/role-assignment';
import { InMemoryRoleRegistry } from '../../../src/kernel/execution/role-registry';
import {
  DuplicateRoleAssignmentError,
  DuplicateRoleRegistrationError,
} from '../../../src/kernel/execution/role.errors';

function createRole(roleId: string): ExecutionRole {
  return ExecutionRole.create({
    id: roleId,
    name: `Role ${roleId}`,
    description: `Description for ${roleId}`,
    category: 'Engineering Responsibility',
  });
}

describe('InMemoryRoleRegistry', () => {
  it('registers, retrieves, and enumerates roles deterministically', async () => {
    const registry = new InMemoryRoleRegistry();
    const roleB = createRole('role-b');
    const roleA = createRole('role-a');

    await registry.register(roleB);
    await registry.register(roleA);

    expect(await registry.has('role-a')).toBe(true);
    expect((await registry.getById('role-a'))?.equals(roleA)).toBe(true);
    expect((await registry.enumerate()).map((role) => role.id.toString())).toEqual([
      'role-a',
      'role-b',
    ]);
  });

  it('rejects duplicate role registration', async () => {
    const registry = new InMemoryRoleRegistry();
    const role = createRole('role-1');

    await registry.register(role);

    await expect(registry.register(role)).rejects.toThrow(DuplicateRoleRegistrationError);
  });
});

describe('InMemoryRoleAssignmentRepository', () => {
  it('persists, retrieves, and enumerates assignments deterministically', async () => {
    const repository = new InMemoryRoleAssignmentRepository();
    const assignmentB = RoleAssignment.create({ taskId: 'task-b', roleId: 'reviewer' });
    const assignmentA = RoleAssignment.create({ taskId: 'task-a', roleId: 'builder' });

    await repository.save(assignmentB);
    await repository.save(assignmentA);

    expect(await repository.hasTaskAssignment('task-a')).toBe(true);
    expect((await repository.getByTaskId('task-a'))?.equals(assignmentA)).toBe(true);
    expect((await repository.enumerate()).map((assignment) => assignment.taskId)).toEqual([
      'task-a',
      'task-b',
    ]);
  });

  it('rejects duplicate task assignments', async () => {
    const repository = new InMemoryRoleAssignmentRepository();
    const assignment = RoleAssignment.create({ taskId: 'task-1', roleId: 'builder' });

    await repository.save(assignment);

    await expect(repository.save(assignment)).rejects.toThrow(DuplicateRoleAssignmentError);
  });
});

