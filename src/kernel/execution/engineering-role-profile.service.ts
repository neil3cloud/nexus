import { ServiceLifecycle } from '../common/service-lifecycle';
import { UnknownEngineeringRoleProfileError } from './engineering-role-profile.errors';
import type { EngineeringRoleProfile } from './engineering-role-profile';
import {
  InMemoryEngineeringRoleProfileRegistry,
  type EngineeringRoleProfileRegistry,
} from './engineering-role-profile-registry';
import { RoleId } from './role-id';

export class EngineeringRoleProfileService extends ServiceLifecycle {
  public constructor(
    private readonly registry: EngineeringRoleProfileRegistry = new InMemoryEngineeringRoleProfileRegistry(),
  ) {
    super('EngineeringRoleProfileService');
  }

  public async getById(roleId: RoleId | string): Promise<EngineeringRoleProfile> {
    const normalizedRoleId = normalizeRoleId(roleId);
    const profile = await this.registry.getById(normalizedRoleId);

    if (profile === undefined) {
      throw new UnknownEngineeringRoleProfileError(normalizedRoleId.toString());
    }

    return profile;
  }

  public async has(roleId: RoleId | string): Promise<boolean> {
    return this.registry.has(roleId);
  }

  public async enumerate(): Promise<readonly EngineeringRoleProfile[]> {
    return this.registry.enumerate();
  }
}

function normalizeRoleId(roleId: RoleId | string): RoleId {
  return typeof roleId === 'string' ? RoleId.fromString(roleId) : roleId;
}

