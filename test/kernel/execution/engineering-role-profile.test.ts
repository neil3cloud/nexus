import { describe, expect, it } from 'vitest';

import { createDefaultEngineeringRoleProfiles } from '../../../src/kernel/execution/default-engineering-role-profiles';
import { EngineeringRoleProfile } from '../../../src/kernel/execution/engineering-role-profile';
import { RoleId } from '../../../src/kernel/execution/role-id';
import {
  InvalidEngineeringRoleProfileDefinitionError,
} from '../../../src/kernel/execution/engineering-role-profile.errors';

describe('EngineeringRoleProfile domain', () => {
  it('constructs immutable profiles with deterministic equality and snapshots', () => {
    const profile = EngineeringRoleProfile.create({
      roleId: ' builder ',
      workflowPresentationLabel: ' Builder Workflow ',
      completionPresentationLabel: ' Builder workflow ',
      includeAssignedRoleInPresentation: true,
    });
    const equivalentProfile = EngineeringRoleProfile.fromSnapshot(profile.toSnapshot());

    expect(profile.toSnapshot()).toEqual({
      roleId: 'builder',
      workflowPresentationLabel: 'Builder Workflow',
      completionPresentationLabel: 'Builder workflow',
      includeAssignedRoleInPresentation: true,
    });
    expect(profile.equals(equivalentProfile)).toBe(true);
    expect(RoleId.fromString('builder').equals(profile.roleId)).toBe(true);
    expect(profile.workflowPresentationLabel).toBe('Builder Workflow');
    expect(profile.completionPresentationLabel).toBe('Builder workflow');
    expect(profile.includeAssignedRoleInPresentation).toBe(true);
    expect(Object.isFrozen(profile)).toBe(true);
    expect(Object.isFrozen(profile.toSnapshot())).toBe(true);
  });

  it('rejects invalid profile definitions deterministically', () => {
    expect(() =>
      EngineeringRoleProfile.create({
        roleId: 'builder',
        workflowPresentationLabel: '',
        completionPresentationLabel: 'Builder workflow',
        includeAssignedRoleInPresentation: true,
      }),
    ).toThrow(InvalidEngineeringRoleProfileDefinitionError);
    expect(() =>
      EngineeringRoleProfile.create({
        roleId: 'builder',
        workflowPresentationLabel: 'Builder Workflow',
        completionPresentationLabel: ' ',
        includeAssignedRoleInPresentation: true,
      }),
    ).toThrow(InvalidEngineeringRoleProfileDefinitionError);
  });

  it('creates one default profile per default Kernel role with semantically equivalent presentation metadata', () => {
    const profiles = createDefaultEngineeringRoleProfiles();

    expect(profiles.map((profile) => profile.toSnapshot())).toEqual([
      {
        roleId: 'builder',
        workflowPresentationLabel: 'Builder Workflow',
        completionPresentationLabel: 'Builder workflow',
        includeAssignedRoleInPresentation: true,
      },
      {
        roleId: 'reviewer',
        workflowPresentationLabel: 'Reviewer Workflow',
        completionPresentationLabel: 'Reviewer workflow',
        includeAssignedRoleInPresentation: true,
      },
      {
        roleId: 'documentation-reviewer',
        workflowPresentationLabel: 'Documentation Reviewer Workflow',
        completionPresentationLabel: 'Documentation Review completed',
        includeAssignedRoleInPresentation: true,
      },
    ]);
    expect(new Set(profiles.map((profile) => profile.roleId.toString())).size).toBe(3);
    expect(Object.isFrozen(profiles)).toBe(true);
  });
});

