import { EvidenceSource } from './evidence-source';
import { InvalidEvidenceException } from './evidence.errors';
import {
  EvidenceVerificationStatus,
  evidenceVerificationStatusSemantics,
} from './evidence-verification-status';
import type {
  EvidenceVerificationStatusName,
  GovernedVerificationStatusInput,
} from './evidence-verification-status';

export interface ProvenanceInput {
  readonly source: string;
  readonly acquisitionMethod: string;
  readonly acquiredAt: string;
  readonly actor: string;
  readonly system: string;
  readonly verificationStatus: EvidenceVerificationStatus;
  readonly verificationStatusSemantics: typeof evidenceVerificationStatusSemantics;
}

export interface ProvenanceRegistrationInput {
  readonly source: string;
  readonly acquisitionMethod: string;
  readonly acquiredAt: string;
  readonly actor: string;
  readonly system: string;
  readonly verificationStatus: string;
  readonly verificationStatusSemantics: string;
}

export interface LegacyProvenanceSnapshot {
  readonly source: string;
  readonly acquisitionMethod: string;
  readonly acquiredAt: string;
  readonly actor: string;
  readonly system: string;
  readonly verificationStatus: string;
  readonly verificationStatusSemantics?: never;
}

export interface GovernedProvenanceSnapshot {
  readonly source: string;
  readonly acquisitionMethod: string;
  readonly acquiredAt: string;
  readonly actor: string;
  readonly system: string;
  readonly verificationStatus: EvidenceVerificationStatusName;
  readonly verificationStatusSemantics: typeof evidenceVerificationStatusSemantics;
}

export type ProvenanceSnapshot = LegacyProvenanceSnapshot | GovernedProvenanceSnapshot;

export class Provenance {
  private constructor(
    private readonly sourceValue: EvidenceSource,
    private readonly acquisitionMethodValue: string,
    private readonly acquiredAtValue: string,
    private readonly actorValue: string,
    private readonly systemValue: string,
    private readonly verificationStatusValue: string,
    private readonly governedVerificationStatus: EvidenceVerificationStatus | undefined,
  ) {
    Object.freeze(this);
  }

  public static create(input: ProvenanceInput): Provenance {
    if (input.verificationStatusSemantics !== evidenceVerificationStatusSemantics) {
      throw new InvalidEvidenceException(
        `Provenance verificationStatusSemantics must be '${evidenceVerificationStatusSemantics}'.`,
      );
    }

    if (!EvidenceVerificationStatus.isEvidenceVerificationStatus(input.verificationStatus)) {
      throw new InvalidEvidenceException('Provenance verificationStatus must be governed.');
    }

    return new Provenance(
      EvidenceSource.fromString(input.source),
      requireNonEmpty(input.acquisitionMethod, 'Provenance acquisitionMethod'),
      requireNonEmpty(input.acquiredAt, 'Provenance acquiredAt'),
      requireNonEmpty(input.actor, 'Provenance actor'),
      requireNonEmpty(input.system, 'Provenance system'),
      input.verificationStatus.toString(),
      input.verificationStatus,
    );
  }

  public static register(input: ProvenanceRegistrationInput): Provenance {
    return Provenance.create({
      source: input.source,
      acquisitionMethod: input.acquisitionMethod,
      acquiredAt: input.acquiredAt,
      actor: input.actor,
      system: input.system,
      verificationStatus: EvidenceVerificationStatus.fromString(input.verificationStatus),
      verificationStatusSemantics: requireVerificationStatusSemantics(
        input.verificationStatusSemantics,
      ),
    });
  }

  public static fromSnapshot(snapshot: ProvenanceSnapshot): Provenance {
    const hasMarker = Object.hasOwn(snapshot, 'verificationStatusSemantics');
    const common = {
      source: EvidenceSource.fromString(snapshot.source),
      acquisitionMethod: requireNonEmpty(snapshot.acquisitionMethod, 'Provenance acquisitionMethod'),
      acquiredAt: requireNonEmpty(snapshot.acquiredAt, 'Provenance acquiredAt'),
      actor: requireNonEmpty(snapshot.actor, 'Provenance actor'),
      system: requireNonEmpty(snapshot.system, 'Provenance system'),
    };

    if (!hasMarker) {
      if (typeof snapshot.verificationStatus !== 'string') {
        throw new InvalidEvidenceException('Legacy Provenance verificationStatus must be a string.');
      }

      return new Provenance(
        common.source,
        common.acquisitionMethod,
        common.acquiredAt,
        common.actor,
        common.system,
        snapshot.verificationStatus,
        undefined,
      );
    }

    if (snapshot.verificationStatusSemantics !== evidenceVerificationStatusSemantics) {
      throw new InvalidEvidenceException(
        `Provenance verificationStatusSemantics must be '${evidenceVerificationStatusSemantics}'.`,
      );
    }

    const governedStatus = EvidenceVerificationStatus.fromString(snapshot.verificationStatus);

    return new Provenance(
      common.source,
      common.acquisitionMethod,
      common.acquiredAt,
      common.actor,
      common.system,
      governedStatus.toString(),
      governedStatus,
    );
  }

  public get source(): EvidenceSource {
    return this.sourceValue;
  }

  public get acquisitionMethod(): string {
    return this.acquisitionMethodValue;
  }

  public get acquiredAt(): string {
    return this.acquiredAtValue;
  }

  public get actor(): string {
    return this.actorValue;
  }

  public get system(): string {
    return this.systemValue;
  }

  public get verificationStatus(): string {
    return this.verificationStatusValue;
  }

  public verificationStatusForThreshold(): GovernedVerificationStatusInput {
    if (this.governedVerificationStatus === undefined) {
      return { kind: 'Unrankable' };
    }

    return { kind: 'Governed', value: this.governedVerificationStatus };
  }

  public equals(other: Provenance): boolean {
    return (
      this.sourceValue.equals(other.sourceValue) &&
      this.acquisitionMethodValue === other.acquisitionMethodValue &&
      this.acquiredAtValue === other.acquiredAtValue &&
      this.actorValue === other.actorValue &&
      this.systemValue === other.systemValue &&
      this.verificationStatusValue === other.verificationStatusValue &&
      this.governedVerificationStatus?.toString() === other.governedVerificationStatus?.toString()
    );
  }

  public toSnapshot(): ProvenanceSnapshot {
    if (this.governedVerificationStatus !== undefined) {
      return {
        source: this.sourceValue.toString(),
        acquisitionMethod: this.acquisitionMethodValue,
        acquiredAt: this.acquiredAtValue,
        actor: this.actorValue,
        system: this.systemValue,
        verificationStatus: this.governedVerificationStatus.toString(),
        verificationStatusSemantics: evidenceVerificationStatusSemantics,
      };
    }

    return {
      source: this.sourceValue.toString(),
      acquisitionMethod: this.acquisitionMethodValue,
      acquiredAt: this.acquiredAtValue,
      actor: this.actorValue,
      system: this.systemValue,
      verificationStatus: this.verificationStatusValue,
    };
  }
}

function requireNonEmpty(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidEvidenceException(`${label} must be a non-empty string.`);
  }

  return normalized;
}

function requireVerificationStatusSemantics(
  value: string,
): typeof evidenceVerificationStatusSemantics {
  if (value !== evidenceVerificationStatusSemantics) {
    throw new InvalidEvidenceException(
      `Provenance verificationStatusSemantics must be '${evidenceVerificationStatusSemantics}'.`,
    );
  }

  return value;
}
