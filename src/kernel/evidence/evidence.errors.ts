import { KernelError } from '../common/kernel-error';

export class EvidenceDomainException extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'EvidenceDomainException';
  }
}

export class DuplicateEvidenceException extends EvidenceDomainException {
  public constructor(evidenceId: string) {
    super(`Evidence '${evidenceId}' already exists.`);
    this.name = 'DuplicateEvidenceException';
  }
}

export class InvalidEvidenceException extends EvidenceDomainException {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidEvidenceException';
  }
}

export class EvidenceNotFoundException extends EvidenceDomainException {
  public constructor(evidenceId: string) {
    super(`Evidence '${evidenceId}' was not found.`);
    this.name = 'EvidenceNotFoundException';
  }
}

export class EvidenceEventPublisherUnavailableError extends EvidenceDomainException {
  public constructor() {
    super('EvidenceService requires an EventBusContract to publish Evidence domain events.');
    this.name = 'EvidenceEventPublisherUnavailableError';
  }
}
