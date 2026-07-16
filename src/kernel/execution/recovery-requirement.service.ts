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
      ...(command.causality === undefined ? {} : { causality: command.causality }),
      ...(command.correlationId === undefined ? {} : { correlationId: command.correlationId }),
    });

    await this.repository.save(resolved);

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
      ...(command.causality === undefined ? {} : { causality: command.causality }),
      ...(command.correlationId === undefined ? {} : { correlationId: command.correlationId }),
    });

    await this.repository.save(withdrawn);

    return withdrawn.toSnapshot();
  }
}

