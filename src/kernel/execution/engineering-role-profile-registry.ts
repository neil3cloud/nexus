import { EngineeringRoleProfile } from './engineering-role-profile';
import type { EngineeringRoleProfileSnapshot } from './engineering-role-profile';
import { DuplicateEngineeringRoleProfileRegistrationError } from './engineering-role-profile.errors';
import { RoleId } from './role-id';

export interface EngineeringRoleProfileRegistry {
  register(profile: EngineeringRoleProfile): Promise<void>;
  getById(roleId: RoleId | string): Promise<EngineeringRoleProfile | undefined>;
  has(roleId: RoleId | string): Promise<boolean>;
  enumerate(): Promise<readonly EngineeringRoleProfile[]>;
}

export class InMemoryEngineeringRoleProfileRegistry implements EngineeringRoleProfileRegistry {
  private readonly profilesByRoleId = new Map<string, EngineeringRoleProfileSnapshot>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public constructor(initialProfiles: readonly EngineeringRoleProfile[] = []) {
    for (const profile of initialProfiles) {
      this.registerSnapshot(profile);
    }
  }

  public async register(profile: EngineeringRoleProfile): Promise<void> {
    await this.runExclusive(() => {
      this.registerSnapshot(profile);
    });
  }

  public async getById(roleId: RoleId | string): Promise<EngineeringRoleProfile | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.profilesByRoleId.get(normalizeRoleId(roleId).toString());

      if (snapshot === undefined) {
        return undefined;
      }

      return EngineeringRoleProfile.fromSnapshot(snapshot);
    });
  }

  public async has(roleId: RoleId | string): Promise<boolean> {
    return this.runExclusive(() => this.profilesByRoleId.has(normalizeRoleId(roleId).toString()));
  }

  public async enumerate(): Promise<readonly EngineeringRoleProfile[]> {
    return this.runExclusive(() =>
      Object.freeze(
        [...this.profilesByRoleId.values()]
          .map((snapshot) => EngineeringRoleProfile.fromSnapshot(snapshot))
          .sort((left, right) => left.roleId.toString().localeCompare(right.roleId.toString())),
      ),
    );
  }

  private registerSnapshot(profile: EngineeringRoleProfile): void {
    const roleId = profile.roleId.toString();

    if (this.profilesByRoleId.has(roleId)) {
      throw new DuplicateEngineeringRoleProfileRegistrationError(roleId);
    }

    this.profilesByRoleId.set(roleId, profile.toSnapshot());
  }

  private async runExclusive<T>(operation: () => T): Promise<T> {
    const run = this.operationQueue.then(operation, operation);
    this.operationQueue = run.then(
      () => undefined,
      () => undefined,
    );

    return run;
  }
}

function normalizeRoleId(roleId: RoleId | string): RoleId {
  return typeof roleId === 'string' ? RoleId.fromString(roleId) : roleId;
}

