import { MissionId } from '../mission/mission-id';
import { EngineeringSessionId } from './engineering-session-id';
import {
  DuplicateMissionEngineeringGroupAssociationError,
  InvalidMissionEngineeringGroupDefinitionError,
} from './mission-engineering-orchestration.errors';
import type {
  MissionEngineeringGroupInput,
  MissionEngineeringGroupSnapshot,
} from './mission-engineering-orchestration.types';

export class MissionEngineeringGroup {
  private constructor(
    private readonly missionIdValue: MissionId,
    private engineeringSessionIdValues: readonly EngineeringSessionId[],
  ) {}

  public static create(input: MissionEngineeringGroupInput): MissionEngineeringGroup {
    const missionId = MissionId.fromString(input.missionId);
    const engineeringSessionIds = normalizeEngineeringSessionIds(input.engineeringSessionIds);

    return new MissionEngineeringGroup(missionId, engineeringSessionIds);
  }

  public static fromSnapshot(snapshot: MissionEngineeringGroupSnapshot): MissionEngineeringGroup {
    return MissionEngineeringGroup.create(snapshot);
  }

  public get missionId(): MissionId {
    return this.missionIdValue;
  }

  public get engineeringSessionIds(): readonly EngineeringSessionId[] {
    return this.engineeringSessionIdValues;
  }

  public addEngineeringSession(engineeringSessionId: EngineeringSessionId | string): void {
    const normalizedEngineeringSessionId =
      typeof engineeringSessionId === 'string'
        ? EngineeringSessionId.fromString(engineeringSessionId)
        : engineeringSessionId;

    if (this.hasEngineeringSession(normalizedEngineeringSessionId)) {
      throw new DuplicateMissionEngineeringGroupAssociationError(
        this.missionIdValue.toString(),
        normalizedEngineeringSessionId.toString(),
      );
    }

    this.engineeringSessionIdValues = Object.freeze(
      [...this.engineeringSessionIdValues, normalizedEngineeringSessionId].sort((left, right) =>
        left.toString().localeCompare(right.toString()),
      ),
    );
  }

  public hasEngineeringSession(engineeringSessionId: EngineeringSessionId | string): boolean {
    const normalizedEngineeringSessionId =
      typeof engineeringSessionId === 'string'
        ? EngineeringSessionId.fromString(engineeringSessionId)
        : engineeringSessionId;

    return this.engineeringSessionIdValues.some((candidate) =>
      candidate.equals(normalizedEngineeringSessionId),
    );
  }

  public toSnapshot(): MissionEngineeringGroupSnapshot {
    return Object.freeze({
      missionId: this.missionIdValue.toString(),
      engineeringSessionIds: Object.freeze(
        this.engineeringSessionIdValues.map((engineeringSessionId) =>
          engineeringSessionId.toString(),
        ),
      ),
    });
  }
}

function normalizeEngineeringSessionIds(
  engineeringSessionIds: readonly string[],
): readonly EngineeringSessionId[] {
  const normalizedEngineeringSessionIds = engineeringSessionIds.map((engineeringSessionId) =>
    EngineeringSessionId.fromString(engineeringSessionId),
  );
  const engineeringSessionIdValues = normalizedEngineeringSessionIds.map((engineeringSessionId) =>
    engineeringSessionId.toString(),
  );

  if (new Set(engineeringSessionIdValues).size !== engineeringSessionIdValues.length) {
    throw new InvalidMissionEngineeringGroupDefinitionError(
      'MissionEngineeringGroup cannot contain duplicate EngineeringSessions.',
    );
  }

  return Object.freeze(
    normalizedEngineeringSessionIds.sort((left, right) =>
      left.toString().localeCompare(right.toString()),
    ),
  );
}
