import type {
  EventBusContract,
  EventBusEvent,
  EventSubscriptionHandle,
} from '../common/event-bus-contract';
import { KernelError } from '../common/kernel-error';
import { ServiceLifecycle } from '../common/service-lifecycle';
import type { GovernanceStateProjectionServiceContract } from '../governance/governance-state-projection.contract';
import type { GovernanceStateProjectionSnapshot } from '../governance/governance-state-projection.types';
import { MissionId } from './mission-id';
import type { MissionExecutionRequest } from './mission-execution.types';

const governedMissionCompletionEventTypes = [
  'GovernanceDecisionRecorded',
  'RecoveryRequirementCreated',
  'RecoveryRequirementResolved',
  'RecoveryRequirementWithdrawn',
] as const;

type GovernedMissionCompletionEventType =
  (typeof governedMissionCompletionEventTypes)[number];

export type GovernanceGatedMissionCompletionStatus =
  | 'Completed'
  | 'Skipped'
  | 'CompletionRejected';

export interface GovernanceGatedMissionCompletionDiagnostic {
  readonly eventId: string;
  readonly eventType: GovernedMissionCompletionEventType;
  readonly missionId: string;
  readonly status: GovernanceGatedMissionCompletionStatus;
  readonly reason: string;
  readonly projection: GovernanceStateProjectionSnapshot;
  readonly rejectionName?: string;
}

export class GovernanceGatedMissionCompletionCoordinator extends ServiceLifecycle {
  private readonly subscriptionHandles: EventSubscriptionHandle[] = [];
  private readonly completedMissionIds = new Set<string>();
  private readonly diagnosticsByEventId = new Map<string, GovernanceGatedMissionCompletionDiagnostic>();

  public constructor(
    private readonly eventBus: EventBusContract,
    private readonly governanceStateProjectionService: GovernanceStateProjectionServiceContract,
    private readonly missionExecutionService: {
      completeMission(request: MissionExecutionRequest): Promise<unknown>;
    },
  ) {
    super('GovernanceGatedMissionCompletionCoordinator');
  }

  public override async initialize(): Promise<void> {
    await super.initialize();

    if (this.subscriptionHandles.length > 0) {
      return;
    }

    for (const eventType of governedMissionCompletionEventTypes) {
      this.subscriptionHandles.push(
        this.eventBus.subscribe({
          eventType,
          handler: async (event) => {
            await this.handleEvent(event);
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

  public async handleEvent(
    event: EventBusEvent,
  ): Promise<GovernanceGatedMissionCompletionDiagnostic> {
    assertGovernedMissionCompletionEvent(event);

    const existingDiagnostic = this.diagnosticsByEventId.get(event.eventId);

    if (existingDiagnostic !== undefined) {
      return existingDiagnostic;
    }

    const missionId = MissionId.fromString(event.missionId).toString();
    const projection = await this.governanceStateProjectionService.getGovernanceStateProjection(missionId);

    if (this.completedMissionIds.has(missionId)) {
      return this.recordDiagnostic(event, projection, {
        status: 'Skipped',
        reason: `Mission '${missionId}' has already completed through this coordinator.`,
      });
    }

    if (isProjectionBlockingMissionCompletion(projection)) {
      return this.recordDiagnostic(event, projection, {
        status: 'Skipped',
        reason: `Mission '${missionId}' remains blocked by governance state.`,
      });
    }

    try {
      await this.missionExecutionService.completeMission({ missionId });
    } catch (error) {
      return this.recordDiagnostic(event, projection, {
        status: 'CompletionRejected',
        reason: error instanceof Error ? error.message : String(error),
        rejectionName: error instanceof Error ? error.name : 'Error',
      });
    }

    this.completedMissionIds.add(missionId);

    return this.recordDiagnostic(event, projection, {
      status: 'Completed',
      reason: `Mission '${missionId}' completed after governance state became non-blocking.`,
    });
  }

  public diagnostics(): readonly GovernanceGatedMissionCompletionDiagnostic[] {
    return Object.freeze([...this.diagnosticsByEventId.values()]);
  }

  private recordDiagnostic(
    event: EventBusEvent & { readonly eventType: GovernedMissionCompletionEventType },
    projection: GovernanceStateProjectionSnapshot,
    outcome: {
      readonly status: GovernanceGatedMissionCompletionStatus;
      readonly reason: string;
      readonly rejectionName?: string;
    },
  ): GovernanceGatedMissionCompletionDiagnostic {
    const diagnostic: GovernanceGatedMissionCompletionDiagnostic =
      outcome.rejectionName === undefined
        ? Object.freeze({
            eventId: event.eventId,
            eventType: event.eventType,
            missionId: projection.missionId,
            status: outcome.status,
            reason: outcome.reason,
            projection,
          })
        : Object.freeze({
            eventId: event.eventId,
            eventType: event.eventType,
            missionId: projection.missionId,
            status: outcome.status,
            reason: outcome.reason,
            projection,
            rejectionName: outcome.rejectionName,
          });

    this.diagnosticsByEventId.set(event.eventId, diagnostic);

    return diagnostic;
  }
}

function assertGovernedMissionCompletionEvent(
  event: EventBusEvent,
): asserts event is EventBusEvent & { readonly eventType: GovernedMissionCompletionEventType } {
  if (
    governedMissionCompletionEventTypes.some(
      (candidate) => candidate === event.eventType,
    )
  ) {
    return;
  }

  throw new KernelError(
    `GovernanceGatedMissionCompletionCoordinator cannot consume event '${event.eventType}'.`,
  );
}

function isProjectionBlockingMissionCompletion(
  projection: GovernanceStateProjectionSnapshot,
): boolean {
  return (
    projection.isBlocking ||
    projection.hasEscalationRequired ||
    projection.unresolvedRecoveryRequirements.length > 0
  );
}
