import { KernelError } from '../common/kernel-error';

export class AdvancementTriggerDomainError extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'AdvancementTriggerDomainError';
  }
}

export class InvalidAdvancementTriggerDefinitionError extends AdvancementTriggerDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidAdvancementTriggerDefinitionError';
  }
}
