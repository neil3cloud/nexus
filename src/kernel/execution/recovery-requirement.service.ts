import { randomUUID } from 'node:crypto';

import type { EventBusContract } from '../common/event-bus-contract';
import { ServiceLifecycle } from '../common/service-lifecycle';
import {
  RecoveryRequirement,
} from './recovery-requirement';
import {
  RecoveryRequirementNotFoundError,
} from './recovery-requirement.errors';
import {
  InMemoryRecoveryRequirementRepository,
  type IRecoveryRequirementRepository,
} from './recovery-requirement.repository';
import type {
  CreateRecoveryRequirementCommand,
  RecoveryRequirementServiceContract,
  ResolveRecoveryRequirementCommand,
  WithdrawRecoveryRequirementCommand,
} from './recovery-requirement.contract';
import type { RecoveryRequirementSnapshot } from './recovery-requirement.types';

export class RecoveryRequirementService
  extends ServiceLifecycle
  implements RecoveryRequirementServiceContract
{
  public constructor(
    private readonly repository: IRecoveryRequirementRepository =
      new InMemoryRecoveryRequirementRepository(),
    private readonly eventBus?: EventBusContract,
    private readonly createIdentity: () => string = randomUUID,
  ) {
    super('RecoveryRequirementService');
  }

  public async createRecoveryRequirement(
    command: CreateRecoveryRequirementCommand,
  ): Promise<RecoveryRequirementSnapshot> {
    const existingRequirement = await this.repository.findByAttributionKey(command);

    if (existingRequirement !== undefined) {
      return existingRequirement.toSnapshot();
    }

    const recoveryRequirement = RecoveryRequirement.create({
      id: this.createIdentity(),
      missionId: command.missionId,
      engineeringSessionId: command.engineeringSessionId,
      workflowStepId: command.workflowStepId,
      governanceDecisionId: command.governanceDecisionId,
      createdAt: command.createdAt,
      creationEventId: this.createIdentity(),
      creationCausality: command.creationCausality ?? [],
      ...(command.creationCorrelationId === undefined
        ? {}
        : { creationCorrelationId: command.creationCorrelationId }),
    });

    const registered = await this.repository.register(recoveryRequirement);

    if (registered.id.toString() === recoveryRequirement.id.toString()) {
      await this.publishDomainEvents(recoveryRequirement);
    }

    return registered.toSnapshot();
  }

  public async resolveRecoveryRequirement(
    command: ResolveRecoveryRequirementCommand,
  ): Promise<RecoveryRequirementSnapshot> {
    const recoveryRequirement = await this.repository.getById(command.recoveryRequirementId);

    if (recoveryRequirement === undefined) {
      throw new RecoveryRequirementNotFoundError(command.recoveryRequirementId);
    }

    const resolved = recoveryRequirement.resolve({
      acceptedOutcomeReference: command.acceptedOutcomeReference,
      resolvedAt: command.resolvedAt,
      attribution: command.attribution,
      eventId: this.createIdentity(),
      ...(command.causality === undefined ? {} : { causality: command.causality }),
      ...(command.correlationId === undefined ? {} : { correlationId: command.correlationId }),
    });

    await this.repository.save(resolved);
    await this.publishDomainEvents(resolved);

    return resolved.toSnapshot();
  }

  public async withdrawRecoveryRequirement(
    command: WithdrawRecoveryRequirementCommand,
  ): Promise<RecoveryRequirementSnapshot> {
    const recoveryRequirement = await this.repository.getById(command.recoveryRequirementId);

    if (recoveryRequirement === undefined) {
      throw new RecoveryRequirementNotFoundError(command.recoveryRequirementId);
    }

    const withdrawn = recoveryRequirement.withdraw({
      authoritativeDecisionReference: command.authoritativeDecisionReference,
      reason: command.reason,
      withdrawnAt: command.withdrawnAt,
      attribution: command.attribution,
      eventId: this.createIdentity(),
      ...(command.causality === undefined ? {} : { causality: command.causality }),
      ...(command.correlationId === undefined ? {} : { correlationId: command.correlationId }),
    });

    await this.repository.save(withdrawn);
    await this.publishDomainEvents(withdrawn);

    return withdrawn.toSnapshot();
  }

  private async publishDomainEvents(recoveryRequirement: {
    pullDomainEvents(): readonly Parameters<EventBusContract['publish']>[0][];
  }): Promise<void> {
    if (this.eventBus === undefined) {
      return;
    }

    for (const event of recoveryRequirement.pullDomainEvents()) {
      await this.eventBus.publish(event);
    }
  }
}
