import { KernelError } from '../common/kernel-error';

export class AdapterDomainException extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'AdapterDomainException';
  }
}

export class InvalidAdapterDefinitionError extends AdapterDomainException {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidAdapterDefinitionError';
  }
}

export class InvalidAdapterRequestError extends AdapterDomainException {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidAdapterRequestError';
  }
}

export class InvalidAdapterResponseError extends AdapterDomainException {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidAdapterResponseError';
  }
}

export class DuplicateAdapterRegistrationError extends AdapterDomainException {
  public constructor(adapterId: string) {
    super(`Adapter '${adapterId}' is already registered.`);
    this.name = 'DuplicateAdapterRegistrationError';
  }
}

export class AdapterNotFoundError extends AdapterDomainException {
  public constructor(adapterId: string) {
    super(`Adapter '${adapterId}' was not found.`);
    this.name = 'AdapterNotFoundError';
  }
}

export class UnsupportedAdapterCapabilityError extends AdapterDomainException {
  public constructor(adapterId: string, capability: string) {
    super(`Adapter '${adapterId}' does not support capability '${capability}'.`);
    this.name = 'UnsupportedAdapterCapabilityError';
  }
}

export class InvalidAdapterLifecycleTransitionError extends AdapterDomainException {
  public constructor(from: string, to: string) {
    super(`Adapter lifecycle transition from '${from}' to '${to}' is not valid.`);
    this.name = 'InvalidAdapterLifecycleTransitionError';
  }
}

export class IncompatibleAdapterProtocolVersionError extends AdapterDomainException {
  public constructor(adapterId: string, expected: string, actual: string) {
    super(
      `Adapter '${adapterId}' protocol version '${actual}' is incompatible with expected version '${expected}'.`,
    );
    this.name = 'IncompatibleAdapterProtocolVersionError';
  }
}
