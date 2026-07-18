import { AssignmentPolicy } from './assignment-policy';
import { AssignmentPolicyId } from './assignment-policy-id';
import { DuplicateAssignmentPolicyError } from './assignment-policy.errors';
import type { AssignmentPolicySnapshot } from './assignment-policy.types';

export interface IAssignmentPolicyRepository {
  create(assignmentPolicy: AssignmentPolicy): Promise<void>;
  getById(assignmentPolicyId: AssignmentPolicyId | string): Promise<AssignmentPolicy | undefined>;
  enumerate(): Promise<readonly AssignmentPolicy[]>;
}

export class InMemoryAssignmentPolicyRepository implements IAssignmentPolicyRepository {
  private readonly policiesById = new Map<string, AssignmentPolicySnapshot>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async create(assignmentPolicy: AssignmentPolicy): Promise<void> {
    await this.runExclusive(() => {
      const snapshot = assignmentPolicy.toSnapshot();

      if (this.policiesById.has(snapshot.id)) {
        throw new DuplicateAssignmentPolicyError(snapshot.id);
      }

      this.policiesById.set(snapshot.id, snapshot);
    });
  }

  public async getById(
    assignmentPolicyId: AssignmentPolicyId | string,
  ): Promise<AssignmentPolicy | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.policiesById.get(
        normalizeAssignmentPolicyId(assignmentPolicyId).toString(),
      );

      if (snapshot === undefined) {
        return undefined;
      }

      return AssignmentPolicy.fromSnapshot(snapshot);
    });
  }

  public async enumerate(): Promise<readonly AssignmentPolicy[]> {
    return this.runExclusive(() =>
      Object.freeze(
        [...this.policiesById.values()]
          .map((snapshot) => AssignmentPolicy.fromSnapshot(snapshot))
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

function normalizeAssignmentPolicyId(
  assignmentPolicyId: AssignmentPolicyId | string,
): AssignmentPolicyId {
  return typeof assignmentPolicyId === 'string'
    ? AssignmentPolicyId.fromString(assignmentPolicyId)
    : assignmentPolicyId;
}
