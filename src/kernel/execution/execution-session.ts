import { EngineeringSessionId } from './engineering-session-id';
import { ExecutionSessionId } from './execution-session-id';
import type {
  ExecutionSessionInput,
  ExecutionSessionSnapshot,
  ExecutionSessionTimestampsInput,
  ExecutionSessionTimestampsSnapshot,
} from './execution-session.types';
import { InvalidExecutionSessionDefinitionError } from './execution-session.errors';
import { RoleId } from './role-id';

export class ExecutionSession {
  private constructor(
    private readonly executionSessionId: ExecutionSessionId,
    private readonly owningEngineeringSessionId: EngineeringSessionId,
    private readonly assignedRoleId: RoleId,
    private readonly assignedAdapterReference: string,
    private readonly executionTimestampValues: ExecutionSessionTimestampsSnapshot,
    private readonly consumedProjectionVersionValue: string,
    private readonly producedArtifactValues: readonly string[],
    private readonly executionOutcomeValue: string,
  ) {
    Object.freeze(this);
  }

  public static create(input: ExecutionSessionInput): ExecutionSession {
    return new ExecutionSession(
      ExecutionSessionId.fromString(input.id),
      EngineeringSessionId.fromString(
        normalizeNonEmptyString(input.engineeringSessionId, 'ExecutionSession engineeringSessionId'),
      ),
      RoleId.fromString(normalizeNonEmptyString(input.assignedRole, 'ExecutionSession assignedRole')),
      normalizeNonEmptyString(input.assignedAdapter, 'ExecutionSession assignedAdapter'),
      normalizeExecutionTimestamps(input.executionTimestamps),
      normalizeNonEmptyString(
        input.consumedProjectionVersion,
        'ExecutionSession consumedProjectionVersion',
      ),
      normalizeProducedArtifacts(input.producedArtifacts),
      normalizeNonEmptyString(input.executionOutcome, 'ExecutionSession executionOutcome'),
    );
  }

  public static fromSnapshot(snapshot: ExecutionSessionSnapshot): ExecutionSession {
    return ExecutionSession.create(snapshot);
  }

  public get id(): ExecutionSessionId {
    return this.executionSessionId;
  }

  public get engineeringSessionId(): EngineeringSessionId {
    return this.owningEngineeringSessionId;
  }

  public get assignedRole(): RoleId {
    return this.assignedRoleId;
  }

  public get assignedAdapter(): string {
    return this.assignedAdapterReference;
  }

  public get executionTimestamps(): ExecutionSessionTimestampsSnapshot {
    return copyExecutionTimestamps(this.executionTimestampValues);
  }

  public get consumedProjectionVersion(): string {
    return this.consumedProjectionVersionValue;
  }

  public get producedArtifacts(): readonly string[] {
    return Object.freeze([...this.producedArtifactValues]);
  }

  public get executionOutcome(): string {
    return this.executionOutcomeValue;
  }

  public equals(other: ExecutionSession): boolean {
    return JSON.stringify(this.toSnapshot()) === JSON.stringify(other.toSnapshot());
  }

  public toSnapshot(): ExecutionSessionSnapshot {
    return Object.freeze({
      id: this.executionSessionId.toString(),
      engineeringSessionId: this.owningEngineeringSessionId.toString(),
      assignedRole: this.assignedRoleId.toString(),
      assignedAdapter: this.assignedAdapterReference,
      executionTimestamps: copyExecutionTimestamps(this.executionTimestampValues),
      consumedProjectionVersion: this.consumedProjectionVersionValue,
      producedArtifacts: Object.freeze([...this.producedArtifactValues]),
      executionOutcome: this.executionOutcomeValue,
    });
  }
}

function normalizeExecutionTimestamps(
  timestamps: ExecutionSessionTimestampsInput,
): ExecutionSessionTimestampsSnapshot {
  const startedAt = normalizeNonEmptyString(
    timestamps.startedAt,
    'ExecutionSession executionTimestamps.startedAt',
  );
  const completedAt = normalizeNonEmptyString(
    timestamps.completedAt,
    'ExecutionSession executionTimestamps.completedAt',
  );

  return Object.freeze({
    startedAt,
    completedAt,
  });
}

function normalizeProducedArtifacts(artifacts: readonly string[]): readonly string[] {
  return Object.freeze(
    artifacts.map((artifact) =>
      normalizeNonEmptyString(artifact, 'ExecutionSession producedArtifact'),
    ),
  );
}

function copyExecutionTimestamps(
  timestamps: ExecutionSessionTimestampsSnapshot,
): ExecutionSessionTimestampsSnapshot {
  return Object.freeze({
    startedAt: timestamps.startedAt,
    completedAt: timestamps.completedAt,
  });
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidExecutionSessionDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
