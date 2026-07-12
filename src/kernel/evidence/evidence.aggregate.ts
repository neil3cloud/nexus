import { EvidenceHash } from './evidence-hash';
import { EvidenceId } from './evidence-id';
import { EvidenceMetadata } from './evidence-metadata';
import type { EvidenceMetadataInput, EvidenceMetadataSnapshot } from './evidence-metadata';
import { EvidenceSource } from './evidence-source';
import { EvidenceType } from './evidence-type';
import { EvidenceVersion } from './evidence-version';
import { Provenance } from './provenance';
import type { ProvenanceInput, ProvenanceSnapshot } from './provenance';

export interface CreateEvidenceInput {
  readonly id: EvidenceId;
  readonly type: EvidenceType;
  readonly version: EvidenceVersion;
  readonly hash: EvidenceHash;
  readonly metadata: EvidenceMetadata;
  readonly provenance: Provenance;
}

export interface RegisterEvidenceRequest {
  readonly id: string;
  readonly type: string;
  readonly version: number;
  readonly hash: string;
  readonly metadata: EvidenceMetadataInput;
  readonly provenance: ProvenanceInput;
}

export interface EvidenceSnapshot {
  readonly id: string;
  readonly type: string;
  readonly version: number;
  readonly source: string;
  readonly hash: string;
  readonly metadata: EvidenceMetadataSnapshot;
  readonly provenance: ProvenanceSnapshot;
}

export class Evidence {
  private constructor(
    private readonly evidenceId: EvidenceId,
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

  public toSnapshot(): EvidenceSnapshot {
    return {
      id: this.evidenceId.toString(),
      type: this.evidenceType.toString(),
      version: this.evidenceVersion.toNumber(),
      source: this.source.toString(),
      hash: this.evidenceHash.toString(),
      metadata: this.evidenceMetadata.toSnapshot(),
      provenance: this.evidenceProvenance.toSnapshot(),
    };
  }
}
