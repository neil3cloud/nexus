import type { EventBusContract, EventBusEvent, EventSubscriptionHandle } from '../common/event-bus-contract';
import { KernelError } from '../common/kernel-error';
import { ServiceLifecycle } from '../common/service-lifecycle';
import { MissionId } from '../mission/mission-id';
import { EngineeringSessionId } from './engineering-session-id';
import {
  EngineeringSessionStateProjection,
  isEngineeringSessionStateProjectionEventType,
} from './engineering-session-state-projection';
import {
  InMemoryEngineeringSessionStateProjectionRepository,
  type IEngineeringSessionStateProjectionRepository,
} from './engineering-session-state-projection.repository';
import type {
  EngineeringSessionStateProjectionApplicationResult,
  EngineeringSessionStateProjectionSnapshot,
} from './engineering-session-state-projection.types';

const subscribedEventTypes = ['EngineeringSessionWorkflowAdvanced'] as const;

export class EngineeringSessionStateProjectionService extends ServiceLifecycle {
  private readonly subscriptionHandles: EventSubscriptionHandle[] = [];

  public constructor(
    private readonly repository: IEngineeringSessionStateProjectionRepository =
      new InMemoryEngineeringSessionStateProjectionRepository(),
    private readonly eventBus?: EventBusContract,
  ) {
    super('EngineeringSessionStateProjectionService');
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
          handler: async (event) => {
            const result = await this.applyEvent(event);

            if (result.status === 'Rejected') {
              throw new KernelError(result.diagnostic);
            }
          },
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

  public async getEngineeringSessionStateProjection(
    engineeringSessionId: string,
  ): Promise<EngineeringSessionStateProjectionSnapshot | undefined> {
    const projection = await this.repository.getByEngineeringSessionId(
      EngineeringSessionId.fromString(engineeringSessionId),
    );

    return projection?.toSnapshot();
  }

  public async enumerateProjections(): Promise<readonly EngineeringSessionStateProjectionSnapshot[]> {
    const projections = await this.repository.enumerate();

    return Object.freeze(projections.map((projection) => projection.toSnapshot()));
  }

  public async enumerateProjectionsByMission(
    missionId: string,
  ): Promise<readonly EngineeringSessionStateProjectionSnapshot[]> {
    const projections = await this.repository.getByMissionId(MissionId.fromString(missionId));

    return Object.freeze(projections.map((projection) => projection.toSnapshot()));
  }

  public async replayMissionEventStream(
    missionId: string,
  ): Promise<readonly EngineeringSessionStateProjectionApplicationResult[]> {
    if (this.eventBus === undefined) {
      return Object.freeze([]);
    }

    const normalizedMissionId = MissionId.fromString(missionId).toString();
    const results: EngineeringSessionStateProjectionApplicationResult[] = [];

    for (const event of this.eventBus.replay(normalizedMissionId)) {
      if (isEngineeringSessionStateProjectionEventType(event.eventType)) {
        results.push(await this.applyEvent(event));
      }
    }

    return Object.freeze(results);
  }

  public async applyEvent(
    event: EventBusEvent,
  ): Promise<EngineeringSessionStateProjectionApplicationResult> {
    if (!isEngineeringSessionStateProjectionEventType(event.eventType)) {
      return rejectedResult(event, `Unsupported event type '${event.eventType}'.`);
    }

    let engineeringSessionId: string;

    try {
      engineeringSessionId = readEngineeringSessionId(event);
    } catch (error) {
      return rejectedResult(event, diagnosticFromError(error));
    }

    try {
      const currentProjection =
        await this.repository.getByEngineeringSessionId(engineeringSessionId);

      if (currentProjection?.hasProcessedEvent(event.eventId) === true) {
        return {
          status: 'Duplicate',
          eventId: event.eventId,
          eventType: event.eventType,
          engineeringSessionId,
          diagnostic: `EngineeringSessionStateProjection already processed event '${event.eventId}'.`,
          projection: currentProjection.toSnapshot(),
          ...(event.missionId === undefined ? {} : { missionId: event.missionId }),
        };
      }

      const updatedProjection =
        currentProjection === undefined
          ? EngineeringSessionStateProjection.createFromEvent(event)
          : currentProjection.apply(event);
      const savedProjection = await this.repository.save(updatedProjection);

      return {
        status: 'Applied',
        eventId: event.eventId,
        eventType: event.eventType,
        missionId: savedProjection.missionId,
        engineeringSessionId: savedProjection.engineeringSessionId,
        diagnostic: `EngineeringSessionStateProjection applied event '${event.eventId}'.`,
        projection: savedProjection.toSnapshot(),
      };
    } catch (error) {
      return {
        ...rejectedResult(event, diagnosticFromError(error)),
        engineeringSessionId,
      };
    }
  }
}

function readEngineeringSessionId(event: EventBusEvent): string {
  const value = event.payload.engineeringSessionId;

  if (typeof value !== 'string') {
    throw new KernelError(
      `EngineeringSessionStateProjection event '${event.eventType}' requires string payload 'engineeringSessionId'.`,
    );
  }

  return EngineeringSessionId.fromString(value).toString();
}

function rejectedResult(
  event: EventBusEvent,
  diagnostic: string,
): EngineeringSessionStateProjectionApplicationResult {
  return {
    status: 'Rejected',
    eventId: event.eventId,
    eventType: event.eventType,
    diagnostic,
    ...(event.missionId === undefined ? {} : { missionId: event.missionId }),
  };
}

function diagnosticFromError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
