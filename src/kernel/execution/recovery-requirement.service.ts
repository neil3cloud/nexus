import { randomUUID } from 'node:crypto';

import type { EventBusContract } from '../common/event-bus-contract';
import { ServiceLifecycle } from '../common/service-lifecycle';
import {
  RecoveryRequirementNotFoundError,
} from './recovery-requirement.errors';
import {
  InMemoryRecoveryRequirementRepository,
  type IRecoveryRequirementRepository,
} from './recovery-requirement.repository';
import type {
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
