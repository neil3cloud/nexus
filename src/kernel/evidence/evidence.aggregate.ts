import { EvidenceHash } from './evidence-hash';
import { InvalidEvidenceException } from './evidence.errors';
import { EvidenceId } from './evidence-id';
import { EvidenceMetadata } from './evidence-metadata';
import type { EvidenceMetadataInput, EvidenceMetadataSnapshot } from './evidence-metadata';
import { EvidenceSource } from './evidence-source';
import { EvidenceType } from './evidence-type';
import { EvidenceVersion } from './evidence-version';
import type { EvidenceDomainEvent } from './evidence.events';
import { createEvidenceCapturedEvent } from './evidence.events';
import { Provenance } from './provenance';
import type { ProvenanceInput, ProvenanceSnapshot } from './provenance';
import type { DomainEventMetadata } from '../mission/mission.types';

export interface CreateEvidenceInput {
  readonly id: EvidenceId;
  readonly missionId?: string;
  readonly type: EvidenceType;
  readonly version: EvidenceVersion;
  readonly hash: EvidenceHash;
  readonly metadata: EvidenceMetadata;
  readonly provenance: Provenance;
}

export interface RegisterEvidenceRequest {
  readonly id: string;
  readonly missionId?: string;
  readonly type: string;
  readonly version: number;
  readonly hash: string;
  readonly metadata: EvidenceMetadataInput;
  readonly provenance: ProvenanceInput;
}

export interface EvidenceSnapshot {
  readonly id: string;
  readonly missionId?: string;
  readonly type: string;
  readonly version: number;
  readonly source: string;
  readonly hash: string;
  readonly metadata: EvidenceMetadataSnapshot;
  readonly provenance: ProvenanceSnapshot;
}

export class Evidence {
  private readonly recordedEvents: EvidenceDomainEvent[] = [];

  private constructor(
    private readonly evidenceId: EvidenceId,
    private readonly missionIdValue: string | undefined,
    private readonly evidenceType: EvidenceType,
    private readonly evidenceVersion: EvidenceVersion,
    private readonly evidenceHash: EvidenceHash,
    private readonly evidenceMetadata: EvidenceMetadata,
    private readonly evidenceProvenance: Provenance,
  ) {
    Object.freeze(this);
  }

  public static create(input: CreateEvidenceInput): Evidence {
    return new Evidence(
      input.id,
      normalizeOptionalString(input.missionId, 'Evidence Mission identity'),
      input.type,
      input.version,
      input.hash,
      input.metadata,
      input.provenance,
    );
  }

  public static register(input: RegisterEvidenceRequest): Evidence {
    return Evidence.create({
      id: EvidenceId.fromString(input.id),
      ...(input.missionId === undefined ? {} : { missionId: input.missionId }),
      type: EvidenceType.fromString(input.type),
      version: EvidenceVersion.fromNumber(input.version),
      hash: EvidenceHash.fromString(input.hash),
      metadata: EvidenceMetadata.create(input.metadata),
      provenance: Provenance.create(input.provenance),
    });
  }

  public static fromSnapshot(snapshot: EvidenceSnapshot): Evidence {
    return Evidence.create({
      id: EvidenceId.fromString(snapshot.id),
      ...(snapshot.missionId === undefined ? {} : { missionId: snapshot.missionId }),
      type: EvidenceType.fromString(snapshot.type),
      version: EvidenceVersion.fromNumber(snapshot.version),
      hash: EvidenceHash.fromString(snapshot.hash),
      metadata: EvidenceMetadata.fromSnapshot(snapshot.metadata),
      provenance: Provenance.fromSnapshot(snapshot.provenance),
    });
  }

  public get id(): EvidenceId {
    return this.evidenceId;
  }

  public get missionId(): string | undefined {
    return this.missionIdValue;
  }

  public get type(): EvidenceType {
    return this.evidenceType;
  }

  public get version(): EvidenceVersion {
    return this.evidenceVersion;
  }

  public get source(): EvidenceSource {
    return this.evidenceProvenance.source;
  }

  public get hash(): EvidenceHash {
    return this.evidenceHash;
  }

  public get metadata(): EvidenceMetadata {
    return this.evidenceMetadata;
  }

  public get provenance(): Provenance {
    return this.evidenceProvenance;
  }

  public recordCaptured(metadata: DomainEventMetadata): void {
    this.recordedEvents.push(createEvidenceCapturedEvent(this, metadata));
  }

  public pullDomainEvents(): readonly EvidenceDomainEvent[] {
    const events = [...this.recordedEvents];

    this.recordedEvents.length = 0;

    return events;
  }

  public toSnapshot(): EvidenceSnapshot {
    return {
      id: this.evidenceId.toString(),
      ...(this.missionIdValue === undefined ? {} : { missionId: this.missionIdValue }),
      type: this.evidenceType.toString(),
      version: this.evidenceVersion.toNumber(),
      source: this.source.toString(),
      hash: this.evidenceHash.toString(),
      metadata: this.evidenceMetadata.toSnapshot(),
      provenance: this.evidenceProvenance.toSnapshot(),
    };
  }
}

function normalizeOptionalString(value: string | undefined, label: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidEvidenceException(`${label} must be a non-empty string.`);
  }

  return normalized;
}
