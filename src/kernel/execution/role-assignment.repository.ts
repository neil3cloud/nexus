import { RoleAssignment } from './role-assignment';
import type { RoleAssignmentSnapshot } from './role-assignment';
import { DuplicateRoleAssignmentError, InvalidRoleDefinitionError } from './role.errors';

export interface RoleAssignmentRepository {
  save(assignment: RoleAssignment): Promise<void>;
  getByTaskId(taskId: string): Promise<RoleAssignment | undefined>;
  hasTaskAssignment(taskId: string): Promise<boolean>;
  enumerate(): Promise<readonly RoleAssignment[]>;
}

export class InMemoryRoleAssignmentRepository implements RoleAssignmentRepository {
  private readonly assignmentsByTaskId = new Map<string, RoleAssignmentSnapshot>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async save(assignment: RoleAssignment): Promise<void> {
    await this.runExclusive(() => {
      if (this.assignmentsByTaskId.has(assignment.taskId)) {
        throw new DuplicateRoleAssignmentError(assignment.taskId);
      }

      this.assignmentsByTaskId.set(assignment.taskId, assignment.toSnapshot());
    });
  }

  public async getByTaskId(taskId: string): Promise<RoleAssignment | undefined> {
    return this.runExclusive(() => {
      const normalizedTaskId = normalizeNonEmptyString(taskId, 'Task identity');
      const snapshot = this.assignmentsByTaskId.get(normalizedTaskId);

      if (snapshot === undefined) {
        return undefined;
      }

      return RoleAssignment.fromSnapshot(snapshot);
    });
  }

  public async hasTaskAssignment(taskId: string): Promise<boolean> {
    return this.runExclusive(() =>
      this.assignmentsByTaskId.has(normalizeNonEmptyString(taskId, 'Task identity')),
    );
  }

  public async enumerate(): Promise<readonly RoleAssignment[]> {
    return this.runExclusive(() =>
      Object.freeze(
        [...this.assignmentsByTaskId.values()]
          .map((snapshot) => RoleAssignment.fromSnapshot(snapshot))
          .sort((left, right) => left.taskId.localeCompare(right.taskId)),
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

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidRoleDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
