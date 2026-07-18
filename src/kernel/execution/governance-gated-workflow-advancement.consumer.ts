import type { EventBusContract, EventBusEvent, EventSubscriptionHandle } from '../common/event-bus-contract';
import type { IGovernanceDecisionRepository } from '../governance/governance-decision.repository';
import type { GovernanceDecisionSnapshot } from '../governance/governance.types';
import { ServiceLifecycle } from '../common/service-lifecycle';
import type { EngineeringDecisionCorrelationServiceContract } from './engineering-decision-correlation.contract';
import type { EngineeringSessionService } from './engineering-session.service';
import type { EngineeringSessionSnapshot } from './engineering-session.types';
import { InvalidEngineeringSessionDefinitionError } from './engineering-session.errors';

export interface HandleGovernanceDecisionRecordedCommand {
  readonly event: EventBusEvent;
  readonly engineeringSessionId: string;
  readonly currentWorkflowStepId: string;
}

export type EventDrivenWorkflowAdvancementStatus =
  | 'Advanced'
  | 'NotAdvanced'
  | 'AlreadyProcessed'
  | 'Rejected';

export interface EventDrivenWorkflowAdvancementDiagnostic {
  readonly code: string;
  readonly message: string;
}

export interface EventDrivenWorkflowAdvancementResult {
  readonly eventId: string;
  readonly eventType: string;
  readonly governanceDecisionId?: string;
  readonly missionId?: string;
  readonly engineeringSessionId?: string;
  readonly workflowStepId?: string;
  readonly status: EventDrivenWorkflowAdvancementStatus;
  readonly diagnostic: EventDrivenWorkflowAdvancementDiagnostic;
  readonly engineeringSession?: EngineeringSessionSnapshot;
}

export class GovernanceGatedWorkflowAdvancementConsumer extends ServiceLifecycle {
  private readonly subscriptionHandles: EventSubscriptionHandle[] = [];
  private readonly processedEventIds = new Set<string>();
  private readonly resultsByEventId = new Map<string, EventDrivenWorkflowAdvancementResult>();

  public constructor(
    private readonly engineeringSessionService: Pick<
      EngineeringSessionService,
      'advanceWorkflowAfterGovernanceDecision' | 'getEngineeringSession'
    >,
    private readonly governanceDecisionRepository?: Pick<IGovernanceDecisionRepository, 'getById'>,
    private readonly engineeringDecisionCorrelationService?: Pick<
      EngineeringDecisionCorrelationServiceContract,
      'findByGovernanceDecisionId'
    >,
    private readonly eventBus?: EventBusContract,
  ) {
    super('GovernanceGatedWorkflowAdvancementConsumer');
  }

  public override async initialize(): Promise<void> {
    await super.initialize();

    if (this.eventBus === undefined || this.subscriptionHandles.length > 0) {
      return;
    }

    this.subscriptionHandles.push(
      this.eventBus.subscribe({
        eventType: 'GovernanceDecisionRecorded',
        handler: async (event) => {
          await this.handleEvent(event);
        },
      }),
    );
  }

  public override dispose(): void {
    for (const handle of this.subscriptionHandles.splice(0)) {
      handle.dispose();
    }

    super.dispose();
  }

  public async handleGovernanceDecisionRecorded(
    command: HandleGovernanceDecisionRecordedCommand,
  ): Promise<EngineeringSessionSnapshot> {
    if (command.event.eventType !== 'GovernanceDecisionRecorded') {
      throw new InvalidEngineeringSessionDefinitionError(
        `Governance-Gated Advancement consumer requires GovernanceDecisionRecorded; received '${command.event.eventType}'.`,
      );
    }

    const governanceDecisionId = readGovernanceDecisionId(command.event);

    return this.engineeringSessionService.advanceWorkflowAfterGovernanceDecision({
      engineeringSessionId: command.engineeringSessionId,
      governanceDecisionId,
      currentWorkflowStepId: command.currentWorkflowStepId,
    });
  }

  public async handleEvent(event: EventBusEvent): Promise<EventDrivenWorkflowAdvancementResult> {
    const existingResult = this.resultsByEventId.get(event.eventId);

    if (existingResult !== undefined) {
      return existingResult;
    }

    if (event.eventType !== 'GovernanceDecisionRecorded') {
      return this.recordResult(event, {
        status: 'Rejected',
        diagnostic: {
          code: 'event-driven-workflow-advancement.unsupported-event',
          message: `Event-Driven Workflow Advancement requires GovernanceDecisionRecorded; received '${event.eventType}'.`,
        },
      });
    }

    let governanceDecisionId: string;

    try {
      governanceDecisionId = readGovernanceDecisionId(event);
    } catch (error) {
      return this.recordResult(event, {
        status: 'Rejected',
        diagnostic: {
          code: 'event-driven-workflow-advancement.malformed-event',
          message: diagnosticFromError(error),
        },
      });
    }

    if (this.processedEventIds.has(event.eventId)) {
      return this.recordResult(event, {
        governanceDecisionId,
        status: 'AlreadyProcessed',
        diagnostic: {
          code: 'event-driven-workflow-advancement.duplicate-event',
          message: `GovernanceDecisionRecorded event '${event.eventId}' was already processed.`,
        },
      });
    }

    const governanceDecisionRepository = this.governanceDecisionRepository;
    const engineeringDecisionCorrelationService = this.engineeringDecisionCorrelationService;

    if (
      governanceDecisionRepository === undefined ||
      engineeringDecisionCorrelationService === undefined
    ) {
      return this.recordResult(event, {
        governanceDecisionId,
        status: 'Rejected',
        diagnostic: {
          code: 'event-driven-workflow-advancement.missing-dependency',
          message:
            'Event-Driven Workflow Advancement requires GovernanceDecision and EngineeringDecisionCorrelation services.',
        },
      });
    }

    const governanceDecision = await governanceDecisionRepository.getById(governanceDecisionId);

    if (governanceDecision === undefined) {
      return this.recordResult(event, {
        governanceDecisionId,
        status: 'Rejected',
        diagnostic: {
          code: 'event-driven-workflow-advancement.governance-decision-not-found',
          message: `GovernanceDecision '${governanceDecisionId}' was not found.`,
        },
      });
    }

    const governanceDecisionSnapshot = governanceDecision.toSnapshot();
    const missionValidation = validateMissionAttribution(event, governanceDecisionSnapshot);

    if (missionValidation !== undefined) {
      return this.recordResult(event, {
        governanceDecisionId,
        missionId: event.missionId,
        status: 'Rejected',
        diagnostic: missionValidation,
      });
    }

    const correlation =
      await engineeringDecisionCorrelationService.findByGovernanceDecisionId(governanceDecisionId);

    if (correlation === undefined) {
      return this.recordResult(event, {
        governanceDecisionId,
        missionId: governanceDecisionSnapshot.missionId,
        status: 'Rejected',
        diagnostic: {
          code: 'event-driven-workflow-advancement.correlation-unresolved',
          message:
            `EngineeringDecisionCorrelation for GovernanceDecision '${governanceDecisionId}' ` +
            'was missing or ambiguous.',
        },
      });
    }

    const correlationValidation = validateCorrelationAttribution(
      governanceDecisionSnapshot,
      correlation,
    );

    if (correlationValidation !== undefined) {
      return this.recordResult(event, {
        governanceDecisionId,
        missionId: governanceDecisionSnapshot.missionId,
        engineeringSessionId: correlation.engineeringSessionId,
        workflowStepId: correlation.workflowStepId,
        status: 'Rejected',
        diagnostic: correlationValidation,
      });
    }

    const engineeringSession = await this.engineeringSessionService.getEngineeringSession(
      correlation.engineeringSessionId,
    );

    if (engineeringSession.currentWorkflowStepId !== correlation.workflowStepId) {
      return this.recordResult(event, {
        governanceDecisionId,
        missionId: correlation.missionId,
        engineeringSessionId: correlation.engineeringSessionId,
        workflowStepId: correlation.workflowStepId,
        status: 'Rejected',
        engineeringSession,
        diagnostic: {
          code: 'event-driven-workflow-advancement.workflow-step-mismatch',
          message:
            `EngineeringSession '${correlation.engineeringSessionId}' current WorkflowStep ` +
            `'${engineeringSession.currentWorkflowStepId}' does not match correlated WorkflowStep ` +
            `'${correlation.workflowStepId}'.`,
        },
      });
    }

    if (governanceDecisionSnapshot.value !== 'Approved') {
      return this.recordResult(event, {
        governanceDecisionId,
        missionId: correlation.missionId,
        engineeringSessionId: correlation.engineeringSessionId,
        workflowStepId: correlation.workflowStepId,
        status: 'NotAdvanced',
        engineeringSession,
        diagnostic: {
          code: 'event-driven-workflow-advancement.blocking-governance-decision',
          message:
            `GovernanceDecision '${governanceDecisionId}' value ` +
            `'${governanceDecisionSnapshot.value}' is not eligible for Event-Driven Workflow Advancement.`,
        },
      });
    }

    try {
      const advanced = await this.engineeringSessionService.advanceWorkflowAfterGovernanceDecision({
        engineeringSessionId: correlation.engineeringSessionId,
        governanceDecisionId,
        currentWorkflowStepId: correlation.workflowStepId,
      });
      const status = advanced.currentWorkflowStepId === correlation.workflowStepId
        ? 'AlreadyProcessed'
        : 'Advanced';

      this.processedEventIds.add(event.eventId);

      return this.recordResult(event, {
        governanceDecisionId,
        missionId: correlation.missionId,
        engineeringSessionId: correlation.engineeringSessionId,
        workflowStepId: correlation.workflowStepId,
        status,
        engineeringSession: advanced,
        diagnostic: {
          code:
            status === 'Advanced'
              ? 'event-driven-workflow-advancement.advanced'
              : 'event-driven-workflow-advancement.already-advanced',
          message:
            status === 'Advanced'
              ? `EngineeringSession '${correlation.engineeringSessionId}' advanced after GovernanceDecision '${governanceDecisionId}'.`
              : `EngineeringSession '${correlation.engineeringSessionId}' had already advanced beyond WorkflowStep '${correlation.workflowStepId}'.`,
        },
      });
    } catch (error) {
      return this.recordResult(event, {
        governanceDecisionId,
        missionId: correlation.missionId,
        engineeringSessionId: correlation.engineeringSessionId,
        workflowStepId: correlation.workflowStepId,
        status: 'Rejected',
        engineeringSession,
        diagnostic: {
          code: 'event-driven-workflow-advancement.advancement-rejected',
          message: diagnosticFromError(error),
        },
      });
    }
  }

  public diagnostics(): readonly EventDrivenWorkflowAdvancementResult[] {
    return Object.freeze([...this.resultsByEventId.values()]);
  }

  private recordResult(
    event: EventBusEvent,
    result: Omit<EventDrivenWorkflowAdvancementResult, 'eventId' | 'eventType'>,
  ): EventDrivenWorkflowAdvancementResult {
    const recorded = Object.freeze({
      eventId: event.eventId,
      eventType: event.eventType,
      ...result,
    });

    this.resultsByEventId.set(event.eventId, recorded);

    return recorded;
  }
}

function readGovernanceDecisionId(event: EventBusEvent): string {
  const governanceDecisionId = event.payload['governanceDecisionId'];

  if (typeof governanceDecisionId !== 'string' || governanceDecisionId.trim().length === 0) {
    throw new InvalidEngineeringSessionDefinitionError(
      'GovernanceDecisionRecorded event requires governanceDecisionId payload.',
    );
  }

  return governanceDecisionId;
}

function validateMissionAttribution(
  event: EventBusEvent,
  governanceDecision: GovernanceDecisionSnapshot,
): EventDrivenWorkflowAdvancementDiagnostic | undefined {
  if (event.missionId === governanceDecision.missionId) {
    return undefined;
  }

  return {
    code: 'event-driven-workflow-advancement.mission-mismatch',
    message:
      `GovernanceDecisionRecorded event Mission '${event.missionId}' does not match ` +
      `GovernanceDecision '${governanceDecision.id}' Mission '${governanceDecision.missionId}'.`,
  };
}

function validateCorrelationAttribution(
  governanceDecision: GovernanceDecisionSnapshot,
  correlation: {
    readonly missionId: string;
    readonly governanceDecisionId?: string;
    readonly engineeringSessionId: string;
    readonly workflowStepId: string;
  },
): EventDrivenWorkflowAdvancementDiagnostic | undefined {
  if (correlation.governanceDecisionId !== governanceDecision.id) {
    return {
      code: 'event-driven-workflow-advancement.correlation-governance-decision-mismatch',
      message:
        `EngineeringDecisionCorrelation GovernanceDecision '${correlation.governanceDecisionId}' ` +
        `does not match GovernanceDecision '${governanceDecision.id}'.`,
    };
  }

  if (correlation.missionId !== governanceDecision.missionId) {
    return {
      code: 'event-driven-workflow-advancement.correlation-mission-mismatch',
      message:
        `EngineeringDecisionCorrelation Mission '${correlation.missionId}' does not match ` +
        `GovernanceDecision '${governanceDecision.id}' Mission '${governanceDecision.missionId}'.`,
    };
  }

  return undefined;
}

function diagnosticFromError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
