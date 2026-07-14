import { describe, expect, it } from 'vitest';

import { EngineeringRoleProfile } from '../../../src/kernel/execution/engineering-role-profile';
import { InMemoryEngineeringRoleProfileRegistry } from '../../../src/kernel/execution/engineering-role-profile-registry';
import {
  DuplicateEngineeringRoleProfileRegistrationError,
} from '../../../src/kernel/execution/engineering-role-profile.errors';

function createProfile(roleId: string): EngineeringRoleProfile {
  return EngineeringRoleProfile.create({
    roleId,
    workflowPresentationLabel: `Workflow ${roleId}`,
    completionPresentationLabel: `Completion ${roleId}`,
    includeAssignedRoleInPresentation: true,
  });
}

describe('InMemoryEngineeringRoleProfileRegistry', () => {
  it('registers, retrieves, and enumerates profiles deterministically', async () => {
    const registry = new InMemoryEngineeringRoleProfileRegistry();
    const profileB = createProfile('role-b');
    const profileA = createProfile('role-a');

    await registry.register(profileB);
    await registry.register(profileA);

    expect(await registry.has('role-a')).toBe(true);
    expect((await registry.getById('role-a'))?.equals(profileA)).toBe(true);
    expect((await registry.enumerate()).map((profile) => profile.roleId.toString())).toEqual([
      'role-a',
      'role-b',
    ]);
  });

  it('seeds initial profiles during composition and rejects duplicate registration', async () => {
    const profile = createProfile('builder');
    const registry = new InMemoryEngineeringRoleProfileRegistry([profile]);

    expect((await registry.getById('builder'))?.equals(profile)).toBe(true);
    await expect(registry.register(profile)).rejects.toThrow(
      DuplicateEngineeringRoleProfileRegistrationError,
    );
    expect(() => new InMemoryEngineeringRoleProfileRegistry([profile, profile])).toThrow(
      DuplicateEngineeringRoleProfileRegistrationError,
    );
  });
});

