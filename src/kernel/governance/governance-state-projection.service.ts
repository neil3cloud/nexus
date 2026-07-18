import type { EventBusContract, EventBusEvent, EventSubscriptionHandle } from '../common/event-bus-contract';
import { KernelError } from '../common/kernel-error';
import { ServiceLifecycle } from '../common/service-lifecycle';
import { MissionId } from '../mission/mission-id';
import type { GovernanceStateProjectionServiceContract } from './governance-state-projection.contract';
import { GovernanceStateProjection, isGovernanceStateProjectionEventType } from './governance-state-projection';
import {
  InMemoryGovernanceStateProjectionRepository,
  type IGovernanceStateProjectionRepository,
} from './governance-state-projection.repository';
import type { GovernanceStateProjectionSnapshot } from './governance-state-projection.types';

const subscribedEventTypes = [
  'GovernanceDecisionRecorded',
  'RecoveryRequirementCreated',
  'RecoveryRequirementResolved',
  'RecoveryRequirementWithdrawn',
] as const;

export class GovernanceStateProjectionService
  extends ServiceLifecycle
  implements GovernanceStateProjectionServiceContract
{
  private readonly subscriptionHandles: EventSubscriptionHandle[] = [];

  public constructor(
    private readonly repository: IGovernanceStateProjectionRepository =
      new InMemoryGovernanceStateProjectionRepository(),
    private readonly eventBus?: EventBusContract,
  ) {
    super('GovernanceStateProjectionService');
  }

  public override async initialize(): Promise<void> {
    await super.initialize();

    if (this.eventBus === undefined || this.subscriptionHandles.length > 0) {
      return;
    }

    for (const eventType of subscribedEventTypes) {
      this.subscriptionHandles.push(
        this.eventBus.subscribe({
          eventType,
          handler: (event) => this.consumeEvent(event),
        }),
      );
    }
  }

  public override dispose(): void {
    for (const handle of this.subscriptionHandles.splice(0)) {
      handle.dispose();
    }

    super.dispose();
  }

  public async getGovernanceStateProjection(
    missionId: string,
  ): Promise<GovernanceStateProjectionSnapshot> {
    const normalizedMissionId = MissionId.fromString(missionId).toString();

    if (this.eventBus !== undefined) {
      for (const event of this.eventBus.replay(normalizedMissionId)) {
        await this.consumeEvent(event);
      }
    }

    const projection = await this.repository.getByMissionId(normalizedMissionId);

    return (projection ?? GovernanceStateProjection.empty(normalizedMissionId)).toSnapshot();
  }

  private async consumeEvent(event: EventBusEvent): Promise<void> {
    if (!isGovernanceStateProjectionEventType(event.eventType)) {
      return;
    }

    const missionId = requireEventMissionId(event);
    const currentProjection =
      (await this.repository.getByMissionId(missionId)) ??
      GovernanceStateProjection.empty(missionId);
    const updatedProjection = currentProjection.apply(event);

    await this.repository.save(updatedProjection);
  }
}

function requireEventMissionId(event: EventBusEvent): string {
  if (event.missionId === undefined) {
    throw new KernelError(
      `GovernanceStateProjection requires Mission-scoped event '${event.eventType}'.`,
    );
  }

  return MissionId.fromString(event.missionId).toString();
}
