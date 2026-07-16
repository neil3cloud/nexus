import { EngineeringSessionId } from './engineering-session-id';
import { EngineeringSessionStateProjection } from './engineering-session-state-projection';
import type { EngineeringSessionStateProjectionSnapshot } from './engineering-session-state-projection.types';
import { MissionId } from '../mission/mission-id';

export interface IEngineeringSessionStateProjectionRepository {
  save(projection: EngineeringSessionStateProjection): Promise<EngineeringSessionStateProjection>;
  getByEngineeringSessionId(
    engineeringSessionId: EngineeringSessionId | string,
  ): Promise<EngineeringSessionStateProjection | undefined>;
  enumerate(): Promise<readonly EngineeringSessionStateProjection[]>;
  getByMissionId(missionId: MissionId | string): Promise<readonly EngineeringSessionStateProjection[]>;
}

export class InMemoryEngineeringSessionStateProjectionRepository
  implements IEngineeringSessionStateProjectionRepository
{
  private readonly projectionsByEngineeringSessionId = new Map<
    string,
    EngineeringSessionStateProjectionSnapshot
  >();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async save(
    projection: EngineeringSessionStateProjection,
  ): Promise<EngineeringSessionStateProjection> {
    return this.runExclusive(() => {
      const snapshot = projection.toSnapshot();

      this.projectionsByEngineeringSessionId.set(snapshot.engineeringSessionId, snapshot);

      return EngineeringSessionStateProjection.fromSnapshot(snapshot);
    });
  }

  public async getByEngineeringSessionId(
    engineeringSessionId: EngineeringSessionId | string,
  ): Promise<EngineeringSessionStateProjection | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.projectionsByEngineeringSessionId.get(
        normalizeEngineeringSessionId(engineeringSessionId),
      );

      return snapshot === undefined
        ? undefined
        : EngineeringSessionStateProjection.fromSnapshot(snapshot);
    });
  }

  public async enumerate(): Promise<readonly EngineeringSessionStateProjection[]> {
    return this.runExclusive(() =>
      Object.freeze(
        [...this.projectionsByEngineeringSessionId.values()]
          .sort((left, right) => left.engineeringSessionId.localeCompare(right.engineeringSessionId))
          .map((snapshot) => EngineeringSessionStateProjection.fromSnapshot(snapshot)),
      ),
    );
  }

  public async getByMissionId(
    missionId: MissionId | string,
  ): Promise<readonly EngineeringSessionStateProjection[]> {
    return this.runExclusive(() => {
      const normalizedMissionId = normalizeMissionId(missionId);

      return Object.freeze(
        [...this.projectionsByEngineeringSessionId.values()]
          .filter((snapshot) => snapshot.missionId === normalizedMissionId)
          .sort((left, right) => left.engineeringSessionId.localeCompare(right.engineeringSessionId))
          .map((snapshot) => EngineeringSessionStateProjection.fromSnapshot(snapshot)),
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

function normalizeEngineeringSessionId(engineeringSessionId: EngineeringSessionId | string): string {
  return typeof engineeringSessionId === 'string'
    ? EngineeringSessionId.fromString(engineeringSessionId).toString()
    : engineeringSessionId.toString();
}

function normalizeMissionId(missionId: MissionId | string): string {
  return typeof missionId === 'string' ? MissionId.fromString(missionId).toString() : missionId.toString();
}
