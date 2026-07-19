import { KernelError } from '../common/kernel-error';

export class EvidenceDomainException extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'EvidenceDomainException';
  }
}

export class DuplicateEvidenceException extends EvidenceDomainException {
  public constructor(evidenceId: string, evidenceVersion?: number) {
    super(
      evidenceVersion === undefined
        ? `Evidence '${evidenceId}' already exists.`
        : `Evidence '${evidenceId}' version '${evidenceVersion}' already exists.`,
    );
    this.name = 'DuplicateEvidenceException';
  }
}

export class EvidenceVersionNotFoundException extends EvidenceDomainException {
  public constructor(evidenceId: string, evidenceVersion: number) {
    super(`Evidence '${evidenceId}' version '${evidenceVersion}' was not found.`);
    this.name = 'EvidenceVersionNotFoundException';
  }
}

export class AmbiguousEvidenceVersionException extends EvidenceDomainException {
  public constructor(evidenceId: string) {
    super(`Evidence '${evidenceId}' has multiple versions; exact EvidenceVersion is required.`);
    this.name = 'AmbiguousEvidenceVersionException';
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

export class SnapshotContentSourceReferenceException extends EvidenceDomainException {
  public constructor() {
    super('SnapshotContent Evidence must not declare derivation source references.');
    this.name = 'SnapshotContentSourceReferenceException';
  }
}

export class DerivedContentZeroSourceException extends EvidenceDomainException {
  public constructor() {
    super('DerivedContent Evidence requires exactly one source Evidence reference in Sprint 78.');
    this.name = 'DerivedContentZeroSourceException';
  }
}

export class DerivedContentMultiSourceDeferredException extends EvidenceDomainException {
  public constructor() {
    super('DerivedContent multi-source combination semantics are deferred outside Sprint 78.');
    this.name = 'DerivedContentMultiSourceDeferredException';
  }
}

export class DuplicateDerivedContentSourceException extends EvidenceDomainException {
  public constructor() {
    super('DerivedContent Evidence source references must not contain duplicates.');
    this.name = 'DuplicateDerivedContentSourceException';
  }
}

export class DuplicateExactContentResolverBindingException extends EvidenceDomainException {
  public constructor() {
    super('Exact Content resolver binding already exists for the represented content reference.');
    this.name = 'DuplicateExactContentResolverBindingException';
  }
}

export class MissingExactContentResolverBindingException extends EvidenceDomainException {
  public constructor() {
    super('Exact Content resolver binding was not found for the represented content reference.');
    this.name = 'MissingExactContentResolverBindingException';
  }
}

export class UnsupportedCanonicalizerIdentityException extends EvidenceDomainException {
  public constructor(evidenceTypeIdentity: string) {
    super(`Canonicalization profile identity '${evidenceTypeIdentity}' is not registered.`);
    this.name = 'UnsupportedCanonicalizerIdentityException';
  }
}

export class UnsupportedCanonicalizerVersionException extends EvidenceDomainException {
  public constructor(evidenceTypeIdentity: string, evidenceTypeVersion: string) {
    super(
      `Canonicalization profile '${evidenceTypeIdentity}' version '${evidenceTypeVersion}' is not registered.`,
    );
    this.name = 'UnsupportedCanonicalizerVersionException';
  }
}

export class RepresentedContentReferenceMismatchException extends EvidenceDomainException {
  public constructor(field: string, expected: string, actual: string) {
    super(
      `Resolved representedContentReference.${field} mismatch: expected '${expected}', got '${actual}'.`,
    );
    this.name = 'RepresentedContentReferenceMismatchException';
  }
}

export class ContentDigestMismatchException extends EvidenceDomainException {
  public constructor() {
    super('Exact Content digest mismatch.');
    this.name = 'ContentDigestMismatchException';
  }
}

export class ExactContentCycleDetectedException extends EvidenceDomainException {
  public constructor(evidenceId: string, evidenceVersion: number) {
    super(`Exact Content derivation cycle detected at Evidence '${evidenceId}' version '${evidenceVersion}'.`);
    this.name = 'ExactContentCycleDetectedException';
  }
}

export class ExactContentRequiredException extends EvidenceDomainException {
  public constructor(evidenceId: string, evidenceVersion: number) {
    super(`Evidence '${evidenceId}' version '${evidenceVersion}' does not contain Exact Content Evidence.`);
    this.name = 'ExactContentRequiredException';
  }
}

export class ExactContentSourceVerificationException extends EvidenceDomainException {
  public constructor(diagnostic: string) {
    super(`DerivedContent source Evidence failed Resolution Verification: ${diagnostic}`);
    this.name = 'ExactContentSourceVerificationException';
  }
}
