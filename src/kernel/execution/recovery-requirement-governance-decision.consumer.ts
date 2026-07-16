import { randomUUID } from 'node:crypto';

import type { EventBusEvent } from '../common/event-bus-contract';
import { ServiceLifecycle } from '../common/service-lifecycle';
import type { IGovernanceDecisionRepository } from '../governance/governance-decision.repository';
import type { RecoveryRequirementSnapshot } from './recovery-requirement.types';
import { RecoveryRequirement } from './recovery-requirement';
import {
  InvalidRecoveryRequirementDefinitionError,
} from './recovery-requirement.errors';
import type { IRecoveryRequirementRepository } from './recovery-requirement.repository';

export interface HandleRecoveryRequirementGovernanceDecisionRecordedCommand {
  readonly event: EventBusEvent;
  readonly engineeringSessionId: string;
  readonly workflowStepId: string;
}

export class RecoveryRequirementGovernanceDecisionConsumer extends ServiceLifecycle {
  public constructor(
    private readonly governanceDecisionRepository: Pick<IGovernanceDecisionRepository, 'getById'>,
    private readonly recoveryRequirementRepository: Pick<IRecoveryRequirementRepository, 'register'>,
    private readonly createIdentity: () => string = randomUUID,
  ) {
    super('RecoveryRequirementGovernanceDecisionConsumer');
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

    const recoveryRequirement = RecoveryRequirement.create({
      id: this.createIdentity(),
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

    return (await this.recoveryRequirementRepository.register(recoveryRequirement)).toSnapshot();
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

