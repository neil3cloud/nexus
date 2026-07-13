import { ExecutionRole } from './execution-role';
import type { ExecutionRoleSnapshot } from './execution-role';
import { RoleId } from './role-id';
import { DuplicateRoleRegistrationError } from './role.errors';

export interface RoleRegistry {
  register(role: ExecutionRole): Promise<void>;
  getById(roleId: RoleId | string): Promise<ExecutionRole | undefined>;
  has(roleId: RoleId | string): Promise<boolean>;
  enumerate(): Promise<readonly ExecutionRole[]>;
}

export class InMemoryRoleRegistry implements RoleRegistry {
  private readonly rolesById = new Map<string, ExecutionRoleSnapshot>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async register(role: ExecutionRole): Promise<void> {
    await this.runExclusive(() => {
      const roleId = role.id.toString();

      if (this.rolesById.has(roleId)) {
        throw new DuplicateRoleRegistrationError(roleId);
      }

      this.rolesById.set(roleId, role.toSnapshot());
    });
  }

  public async getById(roleId: RoleId | string): Promise<ExecutionRole | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.rolesById.get(normalizeRoleId(roleId).toString());

      if (snapshot === undefined) {
        return undefined;
      }

      return ExecutionRole.fromSnapshot(snapshot);
    });
  }

  public async has(roleId: RoleId | string): Promise<boolean> {
    return this.runExclusive(() => this.rolesById.has(normalizeRoleId(roleId).toString()));
  }

  public async enumerate(): Promise<readonly ExecutionRole[]> {
    return this.runExclusive(() =>
      Object.freeze(
        [...this.rolesById.values()]
          .map((snapshot) => ExecutionRole.fromSnapshot(snapshot))
          .sort((left, right) => left.id.toString().localeCompare(right.id.toString())),
      ),
    );
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

