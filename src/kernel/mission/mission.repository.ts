import { Mission } from './mission.aggregate';
import type { MissionId } from './mission-id';
import { MissionPlan } from './mission-plan.aggregate';
import type { MissionPlanId } from './mission-plan-id';
import type { MissionPlanSnapshot } from './mission-planning.types';
import type { MissionSnapshot } from './mission.types';

export interface IMissionRepository {
  save(mission: Mission): Promise<void>;
  getById(missionId: MissionId): Promise<Mission | undefined>;
  exists(missionId: MissionId): Promise<boolean>;
}

export interface IMissionPlanRepository {
  saveMissionPlan(missionPlan: MissionPlan): Promise<void>;
  getMissionPlanById(missionPlanId: MissionPlanId): Promise<MissionPlan | undefined>;
  missionPlanExists(missionPlanId: MissionPlanId): Promise<boolean>;
  getMissionPlansByMissionId(missionId: MissionId): Promise<readonly MissionPlan[]>;
}

export class InMemoryMissionRepository implements IMissionRepository, IMissionPlanRepository {
  private readonly missionsById = new Map<string, MissionSnapshot>();
  private readonly missionPlansById = new Map<string, MissionPlanSnapshot>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async save(mission: Mission): Promise<void> {
    await this.runExclusive(() => {
      this.missionsById.set(mission.id.toString(), mission.toSnapshot());
    });
  }

  public async getById(missionId: MissionId): Promise<Mission | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.missionsById.get(missionId.toString());

      if (snapshot === undefined) {
        return undefined;
      }

      return Mission.fromSnapshot(snapshot);
    });
  }

  public async exists(missionId: MissionId): Promise<boolean> {
    return this.runExclusive(() => this.missionsById.has(missionId.toString()));
  }

  public async saveMissionPlan(missionPlan: MissionPlan): Promise<void> {
    await this.runExclusive(() => {
      this.missionPlansById.set(missionPlan.id.toString(), missionPlan.toSnapshot());
    });
  }

  public async getMissionPlanById(
    missionPlanId: MissionPlanId,
  ): Promise<MissionPlan | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.missionPlansById.get(missionPlanId.toString());

      if (snapshot === undefined) {
        return undefined;
      }

      return MissionPlan.fromSnapshot(snapshot);
    });
  }

  public async missionPlanExists(missionPlanId: MissionPlanId): Promise<boolean> {
    return this.runExclusive(() => this.missionPlansById.has(missionPlanId.toString()));
  }

  public async getMissionPlansByMissionId(missionId: MissionId): Promise<readonly MissionPlan[]> {
    return this.runExclusive(() =>
      [...this.missionPlansById.values()]
        .filter((snapshot) => snapshot.missionId === missionId.toString())
        .map((snapshot) => MissionPlan.fromSnapshot(snapshot)),
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
