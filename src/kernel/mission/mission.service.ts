import { randomUUID } from 'node:crypto';

import type { EventBusContract } from '../common/event-bus-contract';
import { ServiceLifecycle } from '../common/service-lifecycle';
import { Mission } from './mission.aggregate';
import {
  MissionAlreadyExistsError,
  MissionEventPublisherUnavailableError,
  MissionNotFoundError,
} from './mission.errors';
import { MissionId } from './mission-id';
import { MissionObjective } from './mission-objective';
import { InMemoryMissionRepository } from './mission.repository';
import type { IMissionRepository } from './mission.repository';
import type { CreateMissionRequest, DomainEventMetadata } from './mission.types';

export class MissionService extends ServiceLifecycle {
  public constructor(
    private readonly repository: IMissionRepository = new InMemoryMissionRepository(),
    private readonly eventBus?: EventBusContract,
    private readonly createIdentity: () => string = randomUUID,
    private readonly createTimestamp: () => string = () => new Date().toISOString(),
  ) {
    super('MissionService');
  }

  public async createMission(request: CreateMissionRequest): Promise<Mission> {
    const eventBus = this.requireEventBus();

    const missionId = MissionId.fromString(request.id ?? this.createIdentity());

    if (await this.repository.exists(missionId)) {
      throw new MissionAlreadyExistsError(missionId.toString());
    }

    const mission = Mission.create(
      missionId,
      MissionObjective.fromString(request.objective),
      this.createEventMetadata(request.correlationId),
    );

    await this.repository.save(mission);
    await this.publishRecordedEvents(mission, eventBus);

    return mission;
  }

  public async planMission(missionId: MissionId | string, correlationId?: string): Promise<Mission> {
    return this.updateMission(missionId, (mission, metadata) => {
      mission.plan(metadata);
    }, correlationId);
  }

  public async markMissionReady(
    missionId: MissionId | string,
    correlationId?: string,
  ): Promise<Mission> {
    return this.updateMission(missionId, (mission, metadata) => {
      mission.markReady(metadata);
    }, correlationId);
  }

  public async startMission(missionId: MissionId | string, correlationId?: string): Promise<Mission> {
    return this.updateMission(missionId, (mission, metadata) => {
      mission.start(metadata);
    }, correlationId);
  }

  public async reviewMission(missionId: MissionId | string, correlationId?: string): Promise<Mission> {
    return this.updateMission(missionId, (mission, metadata) => {
      mission.review(metadata);
    }, correlationId);
  }

  public async resumeMission(missionId: MissionId | string, correlationId?: string): Promise<Mission> {
    return this.updateMission(missionId, (mission, metadata) => {
      mission.resume(metadata);
    }, correlationId);
  }

  public async completeMission(
    missionId: MissionId | string,
    correlationId?: string,
  ): Promise<Mission> {
    return this.updateMission(missionId, (mission, metadata) => {
      mission.complete(metadata);
    }, correlationId);
  }

  public async cancelMission(missionId: MissionId | string, correlationId?: string): Promise<Mission> {
    return this.updateMission(missionId, (mission, metadata) => {
      mission.cancel(metadata);
    }, correlationId);
  }

  public async failMission(missionId: MissionId | string, correlationId?: string): Promise<Mission> {
    return this.updateMission(missionId, (mission, metadata) => {
      mission.fail(metadata);
    }, correlationId);
  }

  private async updateMission(
    missionId: MissionId | string,
    update: (mission: Mission, metadata: DomainEventMetadata) => void,
    correlationId?: string,
  ): Promise<Mission> {
    const eventBus = this.requireEventBus();

    const normalizedMissionId =
      typeof missionId === 'string' ? MissionId.fromString(missionId) : missionId;
    const mission = await this.repository.getById(normalizedMissionId);

    if (mission === undefined) {
      throw new MissionNotFoundError(normalizedMissionId.toString());
    }

    update(mission, this.createEventMetadata(correlationId));

    await this.repository.save(mission);
    await this.publishRecordedEvents(mission, eventBus);

    return mission;
  }

  private createEventMetadata(correlationId?: string): DomainEventMetadata {
    return {
      eventId: this.createIdentity(),
      timestamp: this.createTimestamp(),
      ...(correlationId === undefined ? {} : { correlationId }),
    };
  }

  private async publishRecordedEvents(mission: Mission, eventBus: EventBusContract): Promise<void> {
    for (const event of mission.pullDomainEvents()) {
      await eventBus.publish(event);
    }
  }

  private requireEventBus(): EventBusContract {
    if (this.eventBus === undefined) {
      throw new MissionEventPublisherUnavailableError();
    }

    return this.eventBus;
  }
}
