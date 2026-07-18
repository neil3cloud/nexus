import { RecoveryRequirement } from './recovery-requirement';
import {
  DuplicateRecoveryRequirementError,
  InvalidRecoveryRequirementDefinitionError,
} from './recovery-requirement.errors';
import { RecoveryRequirementId } from './recovery-requirement-id';
import type { RecoveryRequirementSnapshot } from './recovery-requirement.types';

export interface RecoveryRequirementAttributionKey {
  readonly missionId: string;
  readonly engineeringSessionId: string;
  readonly workflowStepId: string;
  readonly governanceDecisionId: string;
}

export interface IRecoveryRequirementRepository {
  register(recoveryRequirement: RecoveryRequirement): Promise<RecoveryRequirement>;
  save(recoveryRequirement: RecoveryRequirement): Promise<RecoveryRequirement>;
  getById(recoveryRequirementId: RecoveryRequirementId | string): Promise<RecoveryRequirement | undefined>;
  findByAttributionKey(key: RecoveryRequirementAttributionKey): Promise<RecoveryRequirement | undefined>;
  enumerate(): Promise<readonly RecoveryRequirement[]>;
}

export class InMemoryRecoveryRequirementRepository implements IRecoveryRequirementRepository {
  private readonly requirementsById = new Map<string, RecoveryRequirementSnapshot>();
  private readonly requirementIdsByAttributionKey = new Map<string, string>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async register(recoveryRequirement: RecoveryRequirement): Promise<RecoveryRequirement> {
    return this.runExclusive(() => {
      const snapshot = recoveryRequirement.toSnapshot();
      const attributionKey = createAttributionKey(snapshot);
      const existingRequirementId = this.requirementIdsByAttributionKey.get(attributionKey);

      if (existingRequirementId !== undefined) {
        const existingSnapshot = this.requirementsById.get(existingRequirementId);

        if (existingSnapshot === undefined) {
          throw new InvalidRecoveryRequirementDefinitionError(
            `RecoveryRequirement attribution key '${attributionKey}' references a missing record.`,
          );
        }

        return RecoveryRequirement.fromSnapshot(existingSnapshot);
      }

      if (this.requirementsById.has(snapshot.id)) {
        throw new DuplicateRecoveryRequirementError(snapshot.id);
      }

      this.requirementsById.set(snapshot.id, snapshot);
      this.requirementIdsByAttributionKey.set(attributionKey, snapshot.id);

      return RecoveryRequirement.fromSnapshot(snapshot);
    });
  }

  public async save(recoveryRequirement: RecoveryRequirement): Promise<RecoveryRequirement> {
    return this.runExclusive(() => {
      const snapshot = recoveryRequirement.toSnapshot();
      const existingSnapshot = this.requirementsById.get(snapshot.id);

      if (existingSnapshot === undefined) {
        throw new InvalidRecoveryRequirementDefinitionError(
          `RecoveryRequirement '${snapshot.id}' must be registered before it can be saved.`,
        );
      }

      if (createAttributionKey(existingSnapshot) !== createAttributionKey(snapshot)) {
        throw new InvalidRecoveryRequirementDefinitionError(
          `RecoveryRequirement '${snapshot.id}' immutable attribution cannot be changed.`,
        );
      }

      this.requirementsById.set(snapshot.id, snapshot);

      return RecoveryRequirement.fromSnapshot(snapshot);
    });
  }

  public async getById(
    recoveryRequirementId: RecoveryRequirementId | string,
  ): Promise<RecoveryRequirement | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.requirementsById.get(normalizeRecoveryRequirementId(recoveryRequirementId));

      return snapshot === undefined ? undefined : RecoveryRequirement.fromSnapshot(snapshot);
    });
  }

  public async findByAttributionKey(
    key: RecoveryRequirementAttributionKey,
  ): Promise<RecoveryRequirement | undefined> {
    return this.runExclusive(() => {
      const requirementId = this.requirementIdsByAttributionKey.get(createKeyFromInput(key));
      const snapshot = requirementId === undefined ? undefined : this.requirementsById.get(requirementId);

      return snapshot === undefined ? undefined : RecoveryRequirement.fromSnapshot(snapshot);
    });
  }

  public async enumerate(): Promise<readonly RecoveryRequirement[]> {
    return this.runExclusive(() =>
      Object.freeze(
        [...this.requirementsById.values()]
          .sort((left, right) => left.id.localeCompare(right.id))
          .map((snapshot) => RecoveryRequirement.fromSnapshot(snapshot)),
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

function createAttributionKey(snapshot: RecoveryRequirementSnapshot): string {
  return createKeyFromInput({
    missionId: snapshot.missionId,
    engineeringSessionId: snapshot.engineeringSessionId,
    workflowStepId: snapshot.workflowStepId,
    governanceDecisionId: snapshot.governanceDecisionId,
  });
}

function createKeyFromInput(key: RecoveryRequirementAttributionKey): string {
  return [
    normalizeNonEmptyString(key.missionId, 'RecoveryRequirement missionId'),
    normalizeNonEmptyString(key.engineeringSessionId, 'RecoveryRequirement engineeringSessionId'),
    normalizeNonEmptyString(key.workflowStepId, 'RecoveryRequirement workflowStepId'),
    normalizeNonEmptyString(key.governanceDecisionId, 'RecoveryRequirement governanceDecisionId'),
  ].join('::');
}

function normalizeRecoveryRequirementId(recoveryRequirementId: RecoveryRequirementId | string): string {
  return typeof recoveryRequirementId === 'string'
    ? RecoveryRequirementId.fromString(recoveryRequirementId).toString()
    : recoveryRequirementId.toString();
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidRecoveryRequirementDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}

