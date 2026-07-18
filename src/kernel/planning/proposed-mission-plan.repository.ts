import { MissionId } from '../mission/mission-id';
import { ProposedMissionPlan } from './proposed-mission-plan';
import { ProposedMissionPlanId } from './proposed-mission-plan-id';
import {
  DuplicateProposedMissionPlanError,
  InvalidPlanningDefinitionError,
} from './planning.errors';
import type { ProposedMissionPlanSnapshot } from './planning.types';

export interface IProposedMissionPlanRepository {
  create(proposedMissionPlan: ProposedMissionPlan): Promise<ProposedMissionPlan>;
  save(proposedMissionPlan: ProposedMissionPlan): Promise<ProposedMissionPlan>;
  getById(
    proposedMissionPlanId: ProposedMissionPlanId | string,
  ): Promise<ProposedMissionPlan | undefined>;
  getByMissionId(missionId: MissionId | string): Promise<readonly ProposedMissionPlan[]>;
  enumerate(): Promise<readonly ProposedMissionPlan[]>;
}

export class InMemoryProposedMissionPlanRepository implements IProposedMissionPlanRepository {
  private readonly proposedMissionPlansById = new Map<string, ProposedMissionPlanSnapshot>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async create(proposedMissionPlan: ProposedMissionPlan): Promise<ProposedMissionPlan> {
    return this.runExclusive(() => {
      const snapshot = proposedMissionPlan.toSnapshot();

      if (this.proposedMissionPlansById.has(snapshot.id)) {
        throw new DuplicateProposedMissionPlanError(snapshot.id);
      }

      this.proposedMissionPlansById.set(snapshot.id, snapshot);

      return ProposedMissionPlan.fromSnapshot(snapshot);
    });
  }

  public async save(proposedMissionPlan: ProposedMissionPlan): Promise<ProposedMissionPlan> {
    return this.runExclusive(() => {
      const snapshot = proposedMissionPlan.toSnapshot();
      const existingSnapshot = this.proposedMissionPlansById.get(snapshot.id);

      if (existingSnapshot === undefined) {
        throw new InvalidPlanningDefinitionError(
          `ProposedMissionPlan '${snapshot.id}' must be created before it can be saved.`,
        );
      }

      if (existingSnapshot.missionId !== snapshot.missionId) {
        throw new InvalidPlanningDefinitionError(
          `ProposedMissionPlan '${snapshot.id}' missionId is immutable.`,
        );
      }

      this.proposedMissionPlansById.set(snapshot.id, snapshot);

      return ProposedMissionPlan.fromSnapshot(snapshot);
    });
  }

  public async getById(
    proposedMissionPlanId: ProposedMissionPlanId | string,
  ): Promise<ProposedMissionPlan | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.proposedMissionPlansById.get(
        normalizeProposedMissionPlanId(proposedMissionPlanId),
      );

      return snapshot === undefined ? undefined : ProposedMissionPlan.fromSnapshot(snapshot);
    });
  }

  public async getByMissionId(missionId: MissionId | string): Promise<readonly ProposedMissionPlan[]> {
    return this.runExclusive(() =>
      Object.freeze(
        [...this.proposedMissionPlansById.values()]
          .filter((snapshot) => snapshot.missionId === normalizeMissionId(missionId))
          .sort((left, right) => left.id.localeCompare(right.id))
          .map((snapshot) => ProposedMissionPlan.fromSnapshot(snapshot)),
      ),
    );
  }

  public async enumerate(): Promise<readonly ProposedMissionPlan[]> {
    return this.runExclusive(() =>
      Object.freeze(
        [...this.proposedMissionPlansById.values()]
          .sort((left, right) => left.id.localeCompare(right.id))
          .map((snapshot) => ProposedMissionPlan.fromSnapshot(snapshot)),
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

function normalizeProposedMissionPlanId(
  proposedMissionPlanId: ProposedMissionPlanId | string,
): string {
  return typeof proposedMissionPlanId === 'string'
    ? ProposedMissionPlanId.fromString(proposedMissionPlanId).toString()
    : proposedMissionPlanId.toString();
}

function normalizeMissionId(missionId: MissionId | string): string {
  return typeof missionId === 'string' ? MissionId.fromString(missionId).toString() : missionId.toString();
}
