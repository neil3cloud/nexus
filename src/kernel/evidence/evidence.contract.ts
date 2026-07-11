export interface EvidenceRecord {
  readonly id: string;
  readonly source: string;
  readonly summary: string;
  readonly provenance: readonly string[];
  readonly confidence: "verified" | "accepted" | "observed" | "inferred" | "unverified";
}

export interface EvidenceService {
  ingest(records: readonly EvidenceRecord[]): Promise<void>;
  resolveAuthoritativeSet(missionId: string): Promise<readonly EvidenceRecord[]>;
}

// TODO: Add relationship, conflict, and versioning contracts.
