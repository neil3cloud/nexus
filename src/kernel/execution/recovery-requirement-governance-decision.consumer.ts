import { randomUUID } from 'node:crypto';

import type { EventBusContract } from '../common/event-bus-contract';
import type { EventBusEvent } from '../common/event-bus-contract';
import { ServiceLifecycle } from '../common/service-lifecycle';
import type { IGovernanceDecisionRepository } from '../governance/governance-decision.repository';
import type { RecoveryRequirementSnapshot } from './recovery-requirement.types';
import { RecoveryRequirement } from './recovery-requirement';
import {
  InvalidRecoveryRequirementDefinitionError,
} from './recovery-requirement.errors';
import type {
  IRecoveryRequirementRepository,
} from './recovery-requirement.repository';

export interface HandleRecoveryRequirementGovernanceDecisionRecordedCommand {
  readonly event: EventBusEvent;
  readonly engineeringSessionId: string;
  readonly workflowStepId: string;
}

export class RecoveryRequirementGovernanceDecisionConsumer extends ServiceLifecycle {
  public constructor(
    private readonly governanceDecisionRepository: Pick<IGovernanceDecisionRepository, 'getById'>,
    private readonly recoveryRequirementRepository: Pick<
      IRecoveryRequirementRepository,
      'findByAttributionKey' | 'register'
    >,
    private readonly createIdentity: () => string = randomUUID,
    private readonly eventBus?: EventBusContract,
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

    const attributionKey = {
      missionId: governanceDecisionSnapshot.missionId,
      engineeringSessionId: command.engineeringSessionId,
      workflowStepId: command.workflowStepId,
      governanceDecisionId: governanceDecisionSnapshot.id,
    };
    const existingRequirement = await this.recoveryRequirementRepository.findByAttributionKey(
      attributionKey,
    );

    if (existingRequirement !== undefined) {
      return existingRequirement.toSnapshot();
    }

    const recoveryRequirement = RecoveryRequirement.create({
      id: this.createIdentity(),
      ...attributionKey,
      createdAt: command.event.timestamp,
      creationEventId: this.createIdentity(),
      creationCausality: command.event.causality,
      ...(command.event.correlationId === undefined
        ? {}
        : { creationCorrelationId: command.event.correlationId }),
    });

    const registered = await this.recoveryRequirementRepository.register(recoveryRequirement);

    if (registered.id.toString() === recoveryRequirement.id.toString()) {
      await this.publishDomainEvents(recoveryRequirement);
    }

    return registered.toSnapshot();
  }

  private async publishDomainEvents(recoveryRequirement: RecoveryRequirement): Promise<void> {
    if (this.eventBus === undefined) {
      return;
    }

    for (const event of recoveryRequirement.pullDomainEvents()) {
      await this.eventBus.publish(event);
    }
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
