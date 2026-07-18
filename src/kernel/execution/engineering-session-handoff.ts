import { MissionId } from '../mission/mission-id';
import { EngineeringSessionHandoffStatus } from './engineering-session-handoff-status';
import { EngineeringSessionId } from './engineering-session-id';
import { RoleId } from './role-id';
import { InvalidEngineeringSessionHandoffDefinitionError } from './mission-engineering-orchestration.errors';
import type {
  EngineeringSessionHandoffInput,
  EngineeringSessionHandoffSnapshot,
} from './mission-engineering-orchestration.types';

export class EngineeringSessionHandoff {
  private constructor(
    private readonly idValue: string,
    private readonly missionIdValue: MissionId,
    private readonly sourceEngineeringSessionIdValue: EngineeringSessionId,
    private readonly sourceRoleIdValue: RoleId,
    private readonly targetEngineeringSessionIdValue: EngineeringSessionId,
    private readonly targetRoleIdValue: RoleId,
    private readonly recordedAtValue: string,
    private readonly statusValue: EngineeringSessionHandoffStatus,
  ) {}

  public static record(input: EngineeringSessionHandoffInput): EngineeringSessionHandoff {
    const id = normalizeNonEmptyString(input.id, 'EngineeringSessionHandoff id');
    const sourceEngineeringSessionId = EngineeringSessionId.fromString(
      input.sourceEngineeringSessionId,
    );
    const targetEngineeringSessionId = EngineeringSessionId.fromString(
      input.targetEngineeringSessionId,
    );

    if (sourceEngineeringSessionId.equals(targetEngineeringSessionId)) {
      throw new InvalidEngineeringSessionHandoffDefinitionError(
        'EngineeringSessionHandoff requires different source and target EngineeringSessions.',
      );
    }

    return new EngineeringSessionHandoff(
      id,
      MissionId.fromString(input.missionId),
      sourceEngineeringSessionId,
      RoleId.fromString(input.sourceRoleId),
      targetEngineeringSessionId,
      RoleId.fromString(input.targetRoleId),
      normalizeNonEmptyString(input.recordedAt, 'EngineeringSessionHandoff recordedAt'),
      EngineeringSessionHandoffStatus.fromString(input.status ?? 'Recorded'),
    );
  }

  public static fromSnapshot(snapshot: EngineeringSessionHandoffSnapshot): EngineeringSessionHandoff {
    return EngineeringSessionHandoff.record(snapshot);
  }

  public get id(): string {
    return this.idValue;
  }

  public get missionId(): MissionId {
    return this.missionIdValue;
  }

  public get sourceEngineeringSessionId(): EngineeringSessionId {
    return this.sourceEngineeringSessionIdValue;
  }

  public get targetEngineeringSessionId(): EngineeringSessionId {
    return this.targetEngineeringSessionIdValue;
  }

  public get status(): EngineeringSessionHandoffStatus {
    return this.statusValue;
  }

  public toSnapshot(): EngineeringSessionHandoffSnapshot {
    return Object.freeze({
      id: this.idValue,
      missionId: this.missionIdValue.toString(),
      sourceEngineeringSessionId: this.sourceEngineeringSessionIdValue.toString(),
      sourceRoleId: this.sourceRoleIdValue.toString(),
      targetEngineeringSessionId: this.targetEngineeringSessionIdValue.toString(),
      targetRoleId: this.targetRoleIdValue.toString(),
      recordedAt: this.recordedAtValue,
      status: this.statusValue.toString(),
    });
  }
}

function normalizeNonEmptyString(value: unknown, label: string): string {
  if (typeof value !== 'string') {
    throw new InvalidEngineeringSessionHandoffDefinitionError(`${label} must be a non-empty string.`);
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidEngineeringSessionHandoffDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
