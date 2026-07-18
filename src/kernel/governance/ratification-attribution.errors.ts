import { KernelError } from '../common/kernel-error';

export class RatificationAttributionDomainError extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'RatificationAttributionDomainError';
  }
}

export class InvalidRatificationAttributionDefinitionError extends RatificationAttributionDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidRatificationAttributionDefinitionError';
  }
}

