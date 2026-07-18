import { describe, expect, it } from 'vitest';

import { createDefaultEngineeringRoleProfiles } from '../../../src/kernel/execution/default-engineering-role-profiles';
import { EngineeringRoleProfileService } from '../../../src/kernel/execution/engineering-role-profile.service';
import { InMemoryEngineeringRoleProfileRegistry } from '../../../src/kernel/execution/engineering-role-profile-registry';
import {
  UnknownEngineeringRoleProfileError,
} from '../../../src/kernel/execution/engineering-role-profile.errors';

describe('EngineeringRoleProfileService', () => {
  it('looks up, checks, and enumerates profiles without orchestration behavior', async () => {
    const registry = new InMemoryEngineeringRoleProfileRegistry(createDefaultEngineeringRoleProfiles());
    const service = new EngineeringRoleProfileService(registry);

    expect(await service.has('builder')).toBe(true);
    expect((await service.getById('builder')).toSnapshot()).toMatchObject({
      roleId: 'builder',
      workflowPresentationLabel: 'Builder Workflow',
    });
    expect((await service.enumerate()).map((profile) => profile.roleId.toString())).toEqual([
      'builder',
      'documentation-reviewer',
      'reviewer',
    ]);
    expect(Object.getOwnPropertyNames(EngineeringRoleProfileService.prototype).sort()).toEqual([
      'constructor',
      'enumerate',
      'getById',
      'has',
    ]);
  });

  it('reports not-found diagnostics without creating profiles at runtime', async () => {
    const service = new EngineeringRoleProfileService();

    expect(await service.has('missing-role')).toBe(false);
    await expect(service.getById('missing-role')).rejects.toThrow(UnknownEngineeringRoleProfileError);
  });
});

