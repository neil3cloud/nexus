import type { EventBusContract, EventSubscriptionHandle } from '../common/event-bus-contract';
import type { EventBusEvent } from '../common/event-bus-contract';
import { ServiceLifecycle } from '../common/service-lifecycle';
import type { IGovernanceDecisionRepository } from '../governance/governance-decision.repository';
import type { GovernanceDecisionSnapshot } from '../governance/governance.types';
import type { EngineeringDecisionCorrelationServiceContract } from './engineering-decision-correlation.contract';
import type { EngineeringSessionService } from './engineering-session.service';
import type { EngineeringSessionSnapshot } from './engineering-session.types';
import type { RecoveryRequirementSnapshot } from './recovery-requirement.types';
import {
  InvalidRecoveryRequirementDefinitionError,
} from './recovery-requirement.errors';
import type {
  RecoveryRequirementServiceContract,
} from './recovery-requirement.contract';

export interface HandleRecoveryRequirementGovernanceDecisionRecordedCommand {
  readonly event: EventBusEvent;
  readonly engineeringSessionId: string;
  readonly workflowStepId: string;
}

export type RecoveryWorkflowAutomationStatus =
  | 'Created'
  | 'NotCreated'
  | 'Rejected';

export interface RecoveryWorkflowAutomationDiagnostic {
  readonly code: string;
  readonly message: string;
}

export interface RecoveryWorkflowAutomationResult {
  readonly eventId: string;
  readonly eventType: string;
  readonly governanceDecisionId?: string;
  readonly missionId?: string;
  readonly engineeringSessionId?: string;
  readonly workflowStepId?: string;
  readonly status: RecoveryWorkflowAutomationStatus;
  readonly diagnostic: RecoveryWorkflowAutomationDiagnostic;
  readonly recoveryRequirement?: RecoveryRequirementSnapshot;
  readonly engineeringSession?: EngineeringSessionSnapshot;
}

export class RecoveryRequirementGovernanceDecisionConsumer extends ServiceLifecycle {
  private readonly subscriptionHandles: EventSubscriptionHandle[] = [];
  private readonly resultsByEventId = new Map<string, RecoveryWorkflowAutomationResult>();

  public constructor(
    private readonly governanceDecisionRepository: Pick<IGovernanceDecisionRepository, 'getById'>,
    private readonly recoveryRequirementService: Pick<
      RecoveryRequirementServiceContract,
      'createRecoveryRequirement'
    >,
    private readonly engineeringDecisionCorrelationService?: Pick<
      EngineeringDecisionCorrelationServiceContract,
      'findByGovernanceDecisionId'
    >,
    private readonly engineeringSessionService?: Pick<EngineeringSessionService, 'getEngineeringSession'>,
    private readonly eventBus?: EventBusContract,
  ) {
    super('RecoveryRequirementGovernanceDecisionConsumer');
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
    command: HandleRecoveryRequirementGovernanceDecisionRecordedCommand,
  ): Promise<RecoveryRequirementSnapshot | undefined> {
    if (command.event.eventType !== 'GovernanceDecisionRecorded') {
      throw new InvalidRecoveryRequirementDefinitionError(
        `Recovery Requirement consumer requires GovernanceDecisionRecorded; received '${command.event.eventType}'.`,
      );
    }

    const governanceDecisionId = readGovernanceDecisionId(command.event);
    const governanceDecision = await this.governanceDecisionRepository.getById(governanceDecisionId);

    if (governanceDecision === undefined) {
      throw new InvalidRecoveryRequirementDefinitionError(
        `Recovery Requirement creation requires a produced GovernanceDecision '${governanceDecisionId}'.`,
      );
    }

    const governanceDecisionSnapshot = governanceDecision.toSnapshot();

    if (governanceDecisionSnapshot.value !== 'Rejected') {
      return undefined;
    }

    return this.recoveryRequirementService.createRecoveryRequirement({
      missionId: governanceDecisionSnapshot.missionId,
      engineeringSessionId: command.engineeringSessionId,
      workflowStepId: command.workflowStepId,
      governanceDecisionId: governanceDecisionSnapshot.id,
      createdAt: command.event.timestamp,
      creationCausality: command.event.causality,
      ...(command.event.correlationId === undefined
        ? {}
        : { creationCorrelationId: command.event.correlationId }),
    });
  }

  public async handleEvent(event: EventBusEvent): Promise<RecoveryWorkflowAutomationResult> {
    const existingResult = this.resultsByEventId.get(event.eventId);

    if (existingResult !== undefined) {
      return existingResult;
    }

    if (event.eventType !== 'GovernanceDecisionRecorded') {
      return this.recordResult(event, {
        status: 'Rejected',
        diagnostic: {
          code: 'recovery-workflow-automation.unsupported-event',
          message: `Recovery Workflow Automation requires GovernanceDecisionRecorded; received '${event.eventType}'.`,
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
          code: 'recovery-workflow-automation.malformed-event',
          message: diagnosticFromError(error),
        },
      });
    }

    const engineeringDecisionCorrelationService = this.engineeringDecisionCorrelationService;
    const engineeringSessionService = this.engineeringSessionService;

    if (
      engineeringDecisionCorrelationService === undefined ||
      engineeringSessionService === undefined
    ) {
      return this.recordResult(event, {
        governanceDecisionId,
        status: 'Rejected',
        diagnostic: {
          code: 'recovery-workflow-automation.missing-dependency',
          message:
            'Recovery Workflow Automation requires EngineeringDecisionCorrelation and EngineeringSession services.',
        },
      });
    }

    const governanceDecision = await this.governanceDecisionRepository.getById(governanceDecisionId);

    if (governanceDecision === undefined) {
      return this.recordResult(event, {
        governanceDecisionId,
        status: 'Rejected',
        diagnostic: {
          code: 'recovery-workflow-automation.governance-decision-not-found',
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
          code: 'recovery-workflow-automation.correlation-unresolved',
          message:
            `EngineeringDecisionCorrelation for GovernanceDecision '${governanceDecisionId}' ` +
            'was missing or ambiguous.',
        },
      });
    }

    const correlationValidation = validateCorrelationAttribution(governanceDecisionSnapshot, correlation);

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

    const engineeringSession = await engineeringSessionService.getEngineeringSession(
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
          code: 'recovery-workflow-automation.workflow-step-mismatch',
          message:
            `EngineeringSession '${correlation.engineeringSessionId}' current WorkflowStep ` +
            `'${engineeringSession.currentWorkflowStepId}' does not match correlated WorkflowStep ` +
            `'${correlation.workflowStepId}'.`,
        },
      });
    }

    if (governanceDecisionSnapshot.value !== 'Rejected') {
      return this.recordResult(event, {
        governanceDecisionId,
        missionId: correlation.missionId,
        engineeringSessionId: correlation.engineeringSessionId,
        workflowStepId: correlation.workflowStepId,
        status: 'NotCreated',
        engineeringSession,
        diagnostic: {
          code: 'recovery-workflow-automation.non-rejected-governance-decision',
          message:
            `GovernanceDecision '${governanceDecisionId}' value ` +
            `'${governanceDecisionSnapshot.value}' is not eligible for Recovery Workflow Automation.`,
        },
      });
    }

    try {
      const recoveryRequirement = await this.recoveryRequirementService.createRecoveryRequirement({
        missionId: correlation.missionId,
        engineeringSessionId: correlation.engineeringSessionId,
        workflowStepId: correlation.workflowStepId,
        governanceDecisionId,
        createdAt: event.timestamp,
        creationCausality: event.causality,
        ...(event.correlationId === undefined ? {} : { creationCorrelationId: event.correlationId }),
      });

      return this.recordResult(event, {
        governanceDecisionId,
        missionId: correlation.missionId,
        engineeringSessionId: correlation.engineeringSessionId,
        workflowStepId: correlation.workflowStepId,
        status: 'Created',
        recoveryRequirement,
        engineeringSession,
        diagnostic: {
          code: 'recovery-workflow-automation.created',
          message:
            `RecoveryRequirement '${recoveryRequirement.id}' recorded for ` +
            `GovernanceDecision '${governanceDecisionId}'.`,
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
          code: 'recovery-workflow-automation.creation-rejected',
          message: diagnosticFromError(error),
        },
      });
    }
  }

  public diagnostics(): readonly RecoveryWorkflowAutomationResult[] {
    return Object.freeze([...this.resultsByEventId.values()]);
  }

  private recordResult(
    event: EventBusEvent,
    result: Omit<RecoveryWorkflowAutomationResult, 'eventId' | 'eventType'>,
  ): RecoveryWorkflowAutomationResult {
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
    throw new InvalidRecoveryRequirementDefinitionError(
      'GovernanceDecisionRecorded event requires governanceDecisionId payload.',
    );
  }

  return governanceDecisionId;
}

function validateMissionAttribution(
  event: EventBusEvent,
  governanceDecision: GovernanceDecisionSnapshot,
): RecoveryWorkflowAutomationDiagnostic | undefined {
  if (event.missionId === governanceDecision.missionId) {
    return undefined;
  }

  return {
    code: 'recovery-workflow-automation.mission-mismatch',
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
): RecoveryWorkflowAutomationDiagnostic | undefined {
  if (correlation.governanceDecisionId !== governanceDecision.id) {
    return {
      code: 'recovery-workflow-automation.correlation-governance-decision-mismatch',
      message:
        `EngineeringDecisionCorrelation GovernanceDecision '${correlation.governanceDecisionId}' ` +
        `does not match GovernanceDecision '${governanceDecision.id}'.`,
    };
  }

  if (correlation.missionId !== governanceDecision.missionId) {
    return {
      code: 'recovery-workflow-automation.correlation-mission-mismatch',
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
