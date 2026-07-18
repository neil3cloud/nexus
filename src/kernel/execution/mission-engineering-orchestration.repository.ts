import { EngineeringSessionHandoff } from './engineering-session-handoff';
import { EngineeringSessionId } from './engineering-session-id';
import { MissionEngineeringGroup } from './mission-engineering-group';
import {
  AmbiguousMissionEngineeringGroupAssociationError,
  DuplicateEngineeringSessionHandoffError,
  InvalidEngineeringSessionHandoffDefinitionError,
  MissingMissionEngineeringGroupAssociationError,
} from './mission-engineering-orchestration.errors';
import type {
  EngineeringSessionHandoffSnapshot,
  MissionEngineeringGroupSnapshot,
} from './mission-engineering-orchestration.types';
import { MissionId } from '../mission/mission-id';

export interface IMissionEngineeringGroupRepository {
  save(missionEngineeringGroup: MissionEngineeringGroup): Promise<void>;
  getByMissionId(missionId: MissionId | string): Promise<MissionEngineeringGroup | undefined>;
  getMissionIdByEngineeringSessionId(
    engineeringSessionId: EngineeringSessionId | string,
  ): Promise<MissionId>;
  enumerate(): Promise<readonly MissionEngineeringGroup[]>;
}

export interface IEngineeringSessionHandoffRepository {
  create(engineeringSessionHandoff: EngineeringSessionHandoff): Promise<void>;
  getById(handoffId: string): Promise<EngineeringSessionHandoff | undefined>;
  existsForTransfer(
    missionId: MissionId | string,
    sourceEngineeringSessionId: EngineeringSessionId | string,
    targetEngineeringSessionId: EngineeringSessionId | string,
  ): Promise<boolean>;
  enumerate(missionId?: MissionId | string): Promise<readonly EngineeringSessionHandoff[]>;
}

export class InMemoryMissionEngineeringGroupRepository
  implements IMissionEngineeringGroupRepository
{
  private readonly groupsByMissionId = new Map<string, MissionEngineeringGroupSnapshot>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async save(missionEngineeringGroup: MissionEngineeringGroup): Promise<void> {
    await this.runExclusive(() => {
      const snapshot = missionEngineeringGroup.toSnapshot();

      this.groupsByMissionId.set(snapshot.missionId, snapshot);
    });
  }

  public async getByMissionId(
    missionId: MissionId | string,
  ): Promise<MissionEngineeringGroup | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.groupsByMissionId.get(normalizeMissionId(missionId).toString());

      if (snapshot === undefined) {
        return undefined;
      }

      return MissionEngineeringGroup.fromSnapshot(snapshot);
    });
  }

  public async getMissionIdByEngineeringSessionId(
    engineeringSessionId: EngineeringSessionId | string,
  ): Promise<MissionId> {
    return this.runExclusive(() => {
      const normalizedEngineeringSessionId = normalizeEngineeringSessionId(engineeringSessionId);
      const matches = [...this.groupsByMissionId.values()].filter((group) =>
        group.engineeringSessionIds.includes(normalizedEngineeringSessionId.toString()),
      );

      if (matches.length === 0) {
        throw new MissingMissionEngineeringGroupAssociationError(
          normalizedEngineeringSessionId.toString(),
        );
      }

      if (matches.length > 1) {
        throw new AmbiguousMissionEngineeringGroupAssociationError(
          normalizedEngineeringSessionId.toString(),
        );
      }

      const match = matches[0];

      if (match === undefined) {
        throw new MissingMissionEngineeringGroupAssociationError(
          normalizedEngineeringSessionId.toString(),
        );
      }

      return MissionId.fromString(match.missionId);
    });
  }

  public async enumerate(): Promise<readonly MissionEngineeringGroup[]> {
    return this.runExclusive(() =>
      Object.freeze(
        [...this.groupsByMissionId.values()]
          .map((snapshot) => MissionEngineeringGroup.fromSnapshot(snapshot))
          .sort((left, right) => left.missionId.toString().localeCompare(right.missionId.toString())),
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

export class InMemoryEngineeringSessionHandoffRepository
  implements IEngineeringSessionHandoffRepository
{
  private readonly handoffsById = new Map<string, EngineeringSessionHandoffSnapshot>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async create(engineeringSessionHandoff: EngineeringSessionHandoff): Promise<void> {
    await this.runExclusive(() => {
      const snapshot = engineeringSessionHandoff.toSnapshot();

      if (this.handoffsById.has(snapshot.id)) {
        throw new DuplicateEngineeringSessionHandoffError(
          snapshot.missionId,
          snapshot.sourceEngineeringSessionId,
          snapshot.targetEngineeringSessionId,
        );
      }

      this.handoffsById.set(snapshot.id, snapshot);
    });
  }

  public async getById(handoffId: string): Promise<EngineeringSessionHandoff | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.handoffsById.get(normalizeHandoffId(handoffId));

      if (snapshot === undefined) {
        return undefined;
      }

      return EngineeringSessionHandoff.fromSnapshot(snapshot);
    });
  }

  public async existsForTransfer(
    missionId: MissionId | string,
    sourceEngineeringSessionId: EngineeringSessionId | string,
    targetEngineeringSessionId: EngineeringSessionId | string,
  ): Promise<boolean> {
    return this.runExclusive(() => {
      const normalizedMissionId = normalizeMissionId(missionId).toString();
      const normalizedSourceEngineeringSessionId =
        normalizeEngineeringSessionId(sourceEngineeringSessionId).toString();
      const normalizedTargetEngineeringSessionId =
        normalizeEngineeringSessionId(targetEngineeringSessionId).toString();

      return [...this.handoffsById.values()].some(
        (handoff) =>
          handoff.missionId === normalizedMissionId &&
          handoff.sourceEngineeringSessionId === normalizedSourceEngineeringSessionId &&
          handoff.targetEngineeringSessionId === normalizedTargetEngineeringSessionId,
      );
    });
  }

  public async enumerate(
    missionId?: MissionId | string,
  ): Promise<readonly EngineeringSessionHandoff[]> {
    return this.runExclusive(() => {
      const normalizedMissionId =
        missionId === undefined ? undefined : normalizeMissionId(missionId).toString();

      return Object.freeze(
        [...this.handoffsById.values()]
          .filter(
            (snapshot) =>
              normalizedMissionId === undefined || snapshot.missionId === normalizedMissionId,
          )
          .map((snapshot) => EngineeringSessionHandoff.fromSnapshot(snapshot))
          .sort(compareEngineeringSessionHandoffs),
      );
    });
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

function compareEngineeringSessionHandoffs(
  left: EngineeringSessionHandoff,
  right: EngineeringSessionHandoff,
): number {
  const leftSnapshot = left.toSnapshot();
  const rightSnapshot = right.toSnapshot();

  return (
    leftSnapshot.missionId.localeCompare(rightSnapshot.missionId) ||
    leftSnapshot.recordedAt.localeCompare(rightSnapshot.recordedAt) ||
    leftSnapshot.id.localeCompare(rightSnapshot.id)
  );
}

function normalizeMissionId(missionId: MissionId | string): MissionId {
  return typeof missionId === 'string' ? MissionId.fromString(missionId) : missionId;
}

function normalizeEngineeringSessionId(
  engineeringSessionId: EngineeringSessionId | string,
): EngineeringSessionId {
  return typeof engineeringSessionId === 'string'
    ? EngineeringSessionId.fromString(engineeringSessionId)
    : engineeringSessionId;
}

function normalizeHandoffId(handoffId: string): string {
  const normalized = handoffId.trim();

  if (normalized.length === 0) {
    throw new InvalidEngineeringSessionHandoffDefinitionError(
      'EngineeringSessionHandoff id must be a non-empty string.',
    );
  }

  return normalized;
}
