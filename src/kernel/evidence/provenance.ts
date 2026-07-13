import { EvidenceSource } from './evidence-source';
import { InvalidEvidenceException } from './evidence.errors';

export interface ProvenanceInput {
  readonly source: string;
  readonly acquisitionMethod: string;
  readonly acquiredAt: string;
  readonly actor: string;
  readonly system: string;
  readonly verificationStatus: string;
}

export interface ProvenanceSnapshot {
  readonly source: string;
  readonly acquisitionMethod: string;
  readonly acquiredAt: string;
  readonly actor: string;
  readonly system: string;
  readonly verificationStatus: string;
}

export class Provenance {
  private constructor(
    private readonly sourceValue: EvidenceSource,
    private readonly acquisitionMethodValue: string,
    private readonly acquiredAtValue: string,
    private readonly actorValue: string,
    private readonly systemValue: string,
    private readonly verificationStatusValue: string,
  ) {
    Object.freeze(this);
  }

  public static create(input: ProvenanceInput): Provenance {
    return new Provenance(
      EvidenceSource.fromString(input.source),
      requireNonEmpty(input.acquisitionMethod, 'Provenance acquisitionMethod'),
      requireNonEmpty(input.acquiredAt, 'Provenance acquiredAt'),
      requireNonEmpty(input.actor, 'Provenance actor'),
      requireNonEmpty(input.system, 'Provenance system'),
      requireNonEmpty(input.verificationStatus, 'Provenance verificationStatus'),
    );
  }

  public static fromSnapshot(snapshot: ProvenanceSnapshot): Provenance {
    return Provenance.create(snapshot);
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

  public equals(other: Provenance): boolean {
    return (
      this.sourceValue.equals(other.sourceValue) &&
      this.acquisitionMethodValue === other.acquisitionMethodValue &&
      this.acquiredAtValue === other.acquiredAtValue &&
      this.actorValue === other.actorValue &&
      this.systemValue === other.systemValue &&
      this.verificationStatusValue === other.verificationStatusValue
    );
  }

  public toSnapshot(): ProvenanceSnapshot {
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
