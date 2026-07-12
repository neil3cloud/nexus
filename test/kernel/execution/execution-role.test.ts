import { describe, expect, it } from 'vitest';

import { createDefaultKernelRoles } from '../../../src/kernel/execution/default-kernel-roles';
import { ExecutionRole } from '../../../src/kernel/execution/execution-role';
import { RoleAssignment } from '../../../src/kernel/execution/role-assignment';
import { RoleId } from '../../../src/kernel/execution/role-id';
import { RoleMetadata } from '../../../src/kernel/execution/role-metadata';
import { InvalidRoleDefinitionError } from '../../../src/kernel/execution/role.errors';

describe('ExecutionRole domain', () => {
  it('constructs immutable roles with deterministic equality and metadata snapshots', () => {
    const role = ExecutionRole.create({
      id: ' builder ',
      name: ' Builder ',
      description: ' Implements authorized work. ',
      category: ' Engineering Responsibility ',
      metadata: {
        attributes: {
          zeta: 'last',
          alpha: 'first',
        },
      },
    });
    const equivalentRole = ExecutionRole.fromSnapshot(role.toSnapshot());

    expect(role.toSnapshot()).toEqual({
      id: 'builder',
      name: 'Builder',
      description: 'Implements authorized work.',
      category: 'Engineering Responsibility',
      metadata: {
        attributes: {
          alpha: 'first',
          zeta: 'last',
        },
      },
    });
    expect(role.equals(equivalentRole)).toBe(true);
    expect(RoleId.fromString('builder').equals(role.id)).toBe(true);
    expect(Object.isFrozen(role)).toBe(true);
    expect(Object.isFrozen(role.metadata)).toBe(true);
    expect(Object.isFrozen(role.metadata.attributes)).toBe(true);
  });

  it('rejects invalid role definitions and metadata deterministically', () => {
    expect(() => RoleId.fromString(' ')).toThrow(InvalidRoleDefinitionError);
    expect(() =>
      ExecutionRole.create({
        id: 'role-1',
        name: '',
        description: 'Description',
        category: 'Category',
      }),
    ).toThrow(InvalidRoleDefinitionError);
    expect(() =>
      RoleMetadata.create({
        attributes: {
          valid: ' ',
        },
      }),
    ).toThrow(InvalidRoleDefinitionError);
  });

  it('registers default Kernel roles without provider references', () => {
    const defaultRoles = createDefaultKernelRoles();

    expect(defaultRoles.map((role) => role.name)).toEqual(['Builder', 'Reviewer']);
    expect(defaultRoles.map((role) => role.id.toString())).toEqual(['builder', 'reviewer']);
    expect(defaultRoles.every((role) => role.metadata.attributes.origin === 'KernelDefault')).toBe(
      true,
    );
    expect(Object.isFrozen(defaultRoles)).toBe(true);
  });
});

describe('RoleAssignment domain', () => {
  it('constructs immutable provider-independent task role assignments', () => {
    const assignment = RoleAssignment.create({
      taskId: ' task-1 ',
      roleId: ' builder ',
      metadata: {
        attributes: {
          reason: 'implementation',
        },
      },
    });
    const equivalentAssignment = RoleAssignment.fromSnapshot(assignment.toSnapshot());

    expect(assignment.toSnapshot()).toEqual({
      taskId: 'task-1',
      roleId: 'builder',
      metadata: {
        attributes: {
          reason: 'implementation',
        },
      },
    });
    expect(assignment.equals(equivalentAssignment)).toBe(true);
    expect(Object.isFrozen(assignment)).toBe(true);
  });

  it('rejects invalid assignment relationships', () => {
    expect(() =>
      RoleAssignment.create({
        taskId: ' ',
        roleId: 'builder',
      }),
    ).toThrow(InvalidRoleDefinitionError);
  });
});

