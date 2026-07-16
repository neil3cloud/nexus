import type { EventBusEvent } from '../common/event-bus-contract';
import { ServiceLifecycle } from '../common/service-lifecycle';
import type { EngineeringSessionService } from './engineering-session.service';
import type { EngineeringSessionSnapshot } from './engineering-session.types';
import { InvalidEngineeringSessionDefinitionError } from './engineering-session.errors';

export interface HandleGovernanceDecisionRecordedCommand {
  readonly event: EventBusEvent;
  readonly engineeringSessionId: string;
  readonly currentWorkflowStepId: string;
}

export class GovernanceGatedWorkflowAdvancementConsumer extends ServiceLifecycle {
  public constructor(
    private readonly engineeringSessionService: Pick<
      EngineeringSessionService,
      'advanceWorkflowAfterGovernanceDecision'
    >,
  ) {
    super('GovernanceGatedWorkflowAdvancementConsumer');
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
