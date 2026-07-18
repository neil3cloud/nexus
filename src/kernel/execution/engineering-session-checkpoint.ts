import { EngineeringSession } from './engineering-session';
import { EngineeringSessionCheckpointId } from './engineering-session-checkpoint-id';
import type {
  EngineeringSessionCheckpointInput,
  EngineeringSessionCheckpointSnapshot,
} from './engineering-session-checkpoint.types';
import { InvalidEngineeringSessionDefinitionError } from './engineering-session.errors';
import type { EngineeringSessionSnapshot } from './engineering-session.types';

export class EngineeringSessionCheckpoint {
  private constructor(
    private readonly engineeringSessionCheckpointId: EngineeringSessionCheckpointId,
    private readonly engineeringSessionSnapshot: EngineeringSessionSnapshot,
    private readonly capturedAtValue: string,
  ) {
    Object.freeze(this);
  }

  public static create(input: EngineeringSessionCheckpointInput): EngineeringSessionCheckpoint {
    return new EngineeringSessionCheckpoint(
      EngineeringSessionCheckpointId.fromString(input.id),
      copyEngineeringSessionSnapshot(input.engineeringSession),
      normalizeNonEmptyString(input.capturedAt, 'EngineeringSessionCheckpoint capturedAt'),
    );
  }

  public static fromSnapshot(
    snapshot: EngineeringSessionCheckpointSnapshot,
  ): EngineeringSessionCheckpoint {
    return EngineeringSessionCheckpoint.create(snapshot);
  }

  public get id(): EngineeringSessionCheckpointId {
    return this.engineeringSessionCheckpointId;
  }

  public get engineeringSession(): EngineeringSessionSnapshot {
    return copyEngineeringSessionSnapshot(this.engineeringSessionSnapshot);
  }

  public get capturedAt(): string {
    return this.capturedAtValue;
  }

  public equals(other: EngineeringSessionCheckpoint): boolean {
    return JSON.stringify(this.toSnapshot()) === JSON.stringify(other.toSnapshot());
  }

  public toSnapshot(): EngineeringSessionCheckpointSnapshot {
    return Object.freeze({
      id: this.engineeringSessionCheckpointId.toString(),
      engineeringSession: copyEngineeringSessionSnapshot(this.engineeringSessionSnapshot),
      capturedAt: this.capturedAtValue,
    });
  }
}

function copyEngineeringSessionSnapshot(
  snapshot: EngineeringSessionSnapshot,
): EngineeringSessionSnapshot {
  return EngineeringSession.fromSnapshot(snapshot).toSnapshot();
}

function normalizeNonEmptyString(value: unknown, label: string): string {
  if (typeof value !== 'string') {
    throw new InvalidEngineeringSessionDefinitionError(`${label} must be a non-empty string.`);
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidEngineeringSessionDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
