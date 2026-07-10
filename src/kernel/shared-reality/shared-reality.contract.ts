export interface SharedRealityRequest {
  readonly objective: string;
  readonly evidenceScopes: readonly string[];
}

export interface SharedRealityEvidence {
  readonly id: string;
  readonly source: string;
  readonly summary: string;
}

export interface SharedRealityView {
  readonly objective: string;
  readonly evidence: readonly SharedRealityEvidence[];
}

export interface SharedRealityAssembler {
  assemble(request: SharedRealityRequest): Promise<SharedRealityView>;
}

// TODO: Refine evidence quality, freshness, and traceability contracts.
