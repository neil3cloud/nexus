export interface EngineeringCorpusEntry {
  readonly id: string;
  readonly kind: string;
  readonly location: string;
}

export interface EvidenceReference {
  readonly entryId: string;
  readonly rationale: string;
}

export interface HostRequest {
  readonly objective: string;
  readonly originHost: string;
}

// TODO: Add richer platform-wide types as capability and specification contracts become clearer.
