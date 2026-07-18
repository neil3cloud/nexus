import { GovernanceStateProjection } from './governance-state-projection';
import type { GovernanceStateProjectionSnapshot } from './governance-state-projection.types';
import { MissionId } from '../mission/mission-id';

export interface IGovernanceStateProjectionRepository {
  save(projection: GovernanceStateProjection): Promise<GovernanceStateProjection>;
  getByMissionId(missionId: MissionId | string): Promise<GovernanceStateProjection | undefined>;
}

export class InMemoryGovernanceStateProjectionRepository
  implements IGovernanceStateProjectionRepository
{
  private readonly projectionsByMissionId = new Map<string, GovernanceStateProjectionSnapshot>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async save(projection: GovernanceStateProjection): Promise<GovernanceStateProjection> {
    return this.runExclusive(() => {
      const snapshot = projection.toSnapshot();

      this.projectionsByMissionId.set(snapshot.missionId, snapshot);

      return GovernanceStateProjection.fromSnapshot(snapshot);
    });
  }

  public async getByMissionId(
    missionId: MissionId | string,
  ): Promise<GovernanceStateProjection | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.projectionsByMissionId.get(normalizeMissionId(missionId));

      return snapshot === undefined ? undefined : GovernanceStateProjection.fromSnapshot(snapshot);
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

function normalizeMissionId(missionId: MissionId | string): string {
  return typeof missionId === 'string' ? MissionId.fromString(missionId).toString() : missionId.toString();
}
