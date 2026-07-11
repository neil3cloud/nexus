import { randomUUID } from 'node:crypto';

import { ServiceLifecycle } from '../common/service-lifecycle';
import { MissionId } from './mission-id';
import { MissionPlan } from './mission-plan.aggregate';
import { MissionPlanId } from './mission-plan-id';
import {
  MissionAlreadyPlannedError,
  MissionPlanAlreadyExistsError,
  MissionPlanNotFoundError,
  MissionPlanningTerminalMissionError,
  MissionPlanningValidationError,
  MissionNotFoundError,
} from './mission.errors';
import type {
  AddTaskRequest,
  CreateMissionPlanRequest,
  PlanningMetadata,
  RemoveTaskRequest,
  ReviseMissionPlanRequest,
  RevisionMetadata,
  UpdateTaskRequest,
} from './mission-planning.types';
import { InMemoryMissionRepository } from './mission.repository';
import type { IMissionPlanRepository, IMissionRepository } from './mission.repository';
import { Task } from './task';
import { TaskId } from './task-id';

type MissionPlanningRepository = IMissionPlanRepository & Pick<IMissionRepository, 'getById'>;

export class MissionPlanningService extends ServiceLifecycle {
  public constructor(
    private readonly repository: MissionPlanningRepository = new InMemoryMissionRepository(),
    private readonly createIdentity: () => string = randomUUID,
    private readonly createTimestamp: () => string = () => new Date().toISOString(),
  ) {
    super('MissionPlanningService');
  }

  public async createMissionPlan(request: CreateMissionPlanRequest): Promise<MissionPlan> {
    const missionPlanId = MissionPlanId.fromString(request.id ?? this.createIdentity());
    const missionId = MissionId.fromString(request.missionId);
    const mission = await this.repository.getById(missionId);

    if (mission === undefined) {
      throw new MissionNotFoundError(missionId.toString());
    }

    assertMissionCanBePlanned(mission.id.toString(), mission.status);

    if (await this.repository.missionPlanExists(missionPlanId)) {
      throw new MissionPlanAlreadyExistsError(missionPlanId.toString());
    }

    const existingMissionPlan = (await this.repository.getMissionPlansByMissionId(missionId))[0];

    if (existingMissionPlan !== undefined) {
      throw new MissionAlreadyPlannedError(missionId.toString(), existingMissionPlan.id.toString());
    }

    const missionPlan = MissionPlan.create({
      id: missionPlanId,
      missionId,
      ...(request.metadata === undefined ? {} : { metadata: request.metadata }),
      revisionMetadata: this.createRevisionMetadata(
        request.revisionReason,
        request.revisionMetadata,
      ),
    });

    await this.repository.saveMissionPlan(missionPlan);

    return missionPlan;
  }

  public async addTask(request: AddTaskRequest): Promise<MissionPlan> {
    return this.updateMissionPlan(
      request.missionPlanId,
      (missionPlan, revisionMetadata) => {
        const task = Task.create({
          id: TaskId.fromString(request.taskId ?? this.createIdentity()),
          title: request.title,
          description: request.description,
          parentMissionPlanId: missionPlan.id,
          ...(request.dependencies === undefined
            ? {}
            : { dependencies: request.dependencies.map((taskId) => TaskId.fromString(taskId)) }),
          ...(request.metadata === undefined ? {} : { metadata: request.metadata }),
        });

        missionPlan.addTask(task, revisionMetadata);
      },
      request.revisionReason,
      request.revisionMetadata,
    );
  }

  public async updateTask(request: UpdateTaskRequest): Promise<MissionPlan> {
    return this.updateMissionPlan(
      request.missionPlanId,
      (missionPlan, revisionMetadata) => {
        missionPlan.updateTask(
          TaskId.fromString(request.taskId),
          {
            ...(request.title === undefined ? {} : { title: request.title }),
            ...(request.description === undefined ? {} : { description: request.description }),
            ...(request.status === undefined ? {} : { status: request.status }),
            ...(request.dependencies === undefined
              ? {}
              : { dependencies: request.dependencies.map((taskId) => TaskId.fromString(taskId)) }),
            ...(request.metadata === undefined ? {} : { metadata: request.metadata }),
          },
          revisionMetadata,
        );
      },
      request.revisionReason,
      request.revisionMetadata,
    );
  }

  public async removeTask(request: RemoveTaskRequest): Promise<MissionPlan> {
    return this.updateMissionPlan(
      request.missionPlanId,
      (missionPlan, revisionMetadata) => {
        missionPlan.removeTask(TaskId.fromString(request.taskId), revisionMetadata);
      },
      request.revisionReason,
      request.revisionMetadata,
    );
  }

  public async reviseMissionPlan(request: ReviseMissionPlanRequest): Promise<MissionPlan> {
    return this.updateMissionPlan(
      request.missionPlanId,
      (missionPlan, revisionMetadata) => {
        missionPlan.revise(
          request.metadata === undefined ? {} : { metadata: request.metadata },
          revisionMetadata,
        );
      },
      request.revisionReason,
      request.revisionMetadata,
    );
  }

  private async updateMissionPlan(
    missionPlanId: string,
    update: (missionPlan: MissionPlan, revisionMetadata: RevisionMetadata) => void,
    revisionReason?: string,
    revisionAttributes?: PlanningMetadata,
  ): Promise<MissionPlan> {
    const normalizedMissionPlanId = MissionPlanId.fromString(missionPlanId);
    const missionPlan = await this.repository.getMissionPlanById(normalizedMissionPlanId);

    if (missionPlan === undefined) {
      throw new MissionPlanNotFoundError(normalizedMissionPlanId.toString());
    }

    const mission = await this.repository.getById(missionPlan.missionId);

    if (mission === undefined) {
      throw new MissionNotFoundError(missionPlan.missionId.toString());
    }

    assertMissionCanBePlanned(mission.id.toString(), mission.status);

    update(missionPlan, this.createRevisionMetadata(revisionReason, revisionAttributes));
    await this.repository.saveMissionPlan(missionPlan);

    return missionPlan;
  }

  private createRevisionMetadata(
    reason: string | undefined,
    attributes: PlanningMetadata | undefined,
  ): RevisionMetadata {
    const normalizedReason = reason?.trim();

    if (normalizedReason !== undefined && normalizedReason.length === 0) {
      throw new MissionPlanningValidationError('Revision reason must not be empty when provided.');
    }

    return {
      createdAt: this.createTimestamp(),
      ...(normalizedReason === undefined ? {} : { reason: normalizedReason }),
      attributes: attributes ?? {},
    };
  }
}

function assertMissionCanBePlanned(
  missionId: string,
  status: 'Draft' | 'Planned' | 'Ready' | 'Executing' | 'Reviewing' | 'Completed' | 'Cancelled' | 'Failed',
): void {
  if (status === 'Completed' || status === 'Cancelled' || status === 'Failed') {
    throw new MissionPlanningTerminalMissionError(missionId, status);
  }
}

