import { randomUUID } from 'node:crypto';

import type { EventBusContract } from '../common/event-bus-contract';
import { ServiceLifecycle } from '../common/service-lifecycle';
import { Mission } from './mission.aggregate';
import type { TaskExecutionRequest, MissionExecutionRequest } from './mission-execution.types';
import { MissionId } from './mission-id';
import { MissionPlan } from './mission-plan.aggregate';
import {
  MissionExecutionValidationError,
  MissionNotFoundError,
} from './mission.errors';
import type { DomainEventMetadata } from './mission.types';
import type { IMissionPlanRepository, IMissionRepository } from './mission.repository';
import { TaskId } from './task-id';

type MissionExecutionRepository = IMissionRepository & IMissionPlanRepository;

export class MissionExecutionService extends ServiceLifecycle {
  public constructor(
    private readonly repository: MissionExecutionRepository,
    private readonly eventBus: EventBusContract,
    private readonly createIdentity: () => string = randomUUID,
    private readonly createTimestamp: () => string = () => new Date().toISOString(),
  ) {
    super('MissionExecutionService');
  }

  public async startMission(request: MissionExecutionRequest): Promise<Mission> {
    const { mission, missionPlan } = await this.loadExecutionAggregates(request.missionId);

    missionPlan.assertExecutable();
    mission.start(this.createEventMetadata());

    await this.repository.save(mission);
    await this.publishRecordedEvents(mission);

    return mission;
  }

  public async completeMission(request: MissionExecutionRequest): Promise<Mission> {
    const { mission, missionPlan } = await this.loadExecutionAggregates(request.missionId);

    mission.complete(this.createEventMetadata(), missionPlan.tasks);

    await this.repository.save(mission);
    await this.publishRecordedEvents(mission);

    return mission;
  }

  public async failMission(request: MissionExecutionRequest): Promise<Mission> {
    const { mission } = await this.loadExecutionAggregates(request.missionId);

    mission.fail(this.createEventMetadata());

    await this.repository.save(mission);
    await this.publishRecordedEvents(mission);

    return mission;
  }

  public async cancelMission(request: MissionExecutionRequest): Promise<Mission> {
    const { mission } = await this.loadExecutionAggregates(request.missionId);

    mission.cancel(this.createEventMetadata());

    await this.repository.save(mission);
    await this.publishRecordedEvents(mission);

    return mission;
  }

  public async startTask(request: TaskExecutionRequest): Promise<MissionPlan> {
    return this.updateMissionPlanTask(request, (missionPlan, taskId, metadata) => {
      missionPlan.startTask(taskId, metadata);
    });
  }

  public async completeTask(request: TaskExecutionRequest): Promise<MissionPlan> {
    return this.updateMissionPlanTask(request, (missionPlan, taskId, metadata) => {
      missionPlan.completeTask(taskId, metadata);
    });
  }

  public async cancelTask(request: TaskExecutionRequest): Promise<MissionPlan> {
    return this.updateMissionPlanTask(request, (missionPlan, taskId, metadata) => {
      missionPlan.cancelTask(taskId, metadata);
    });
  }

  private async updateMissionPlanTask(
    request: TaskExecutionRequest,
    update: (missionPlan: MissionPlan, taskId: TaskId, metadata: DomainEventMetadata) => void,
  ): Promise<MissionPlan> {
    const { mission, missionPlan } = await this.loadExecutionAggregates(request.missionId);

    mission.assertTaskExecutionPermitted();
    update(missionPlan, TaskId.fromString(request.taskId), this.createEventMetadata());

    await this.repository.saveMissionPlan(missionPlan);
    await this.publishMissionPlanRecordedEvents(missionPlan);

    return missionPlan;
  }

  private async loadExecutionAggregates(missionId: string): Promise<{
    readonly mission: Mission;
    readonly missionPlan: MissionPlan;
  }> {
    const normalizedMissionId = MissionId.fromString(missionId);
    const mission = await this.repository.getById(normalizedMissionId);

    if (mission === undefined) {
      throw new MissionNotFoundError(normalizedMissionId.toString());
    }

    const missionPlan = (await this.repository.getMissionPlansByMissionId(normalizedMissionId))[0];

    if (missionPlan === undefined) {
      throw new MissionExecutionValidationError(
        `Mission '${normalizedMissionId.toString()}' has no MissionPlan to execute.`,
      );
    }

    return { mission, missionPlan };
  }

  private createEventMetadata(): DomainEventMetadata {
    return {
      eventId: this.createIdentity(),
      timestamp: this.createTimestamp(),
    };
  }

  private async publishRecordedEvents(mission: Mission): Promise<void> {
    for (const event of mission.pullDomainEvents()) {
      await this.eventBus.publish(event);
    }
  }

  private async publishMissionPlanRecordedEvents(missionPlan: MissionPlan): Promise<void> {
    for (const event of missionPlan.pullDomainEvents()) {
      await this.eventBus.publish(event);
    }
  }
}
