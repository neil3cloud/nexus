export interface SharedRealityRequest {
  readonly missionId: string;
  readonly objective: string;
  readonly evidenceScopes: readonly string[];
}

export interface SharedRealityEvidence {
  readonly id: string;
  readonly source: string;
  readonly summary: string;
}

export interface SharedRealityView {
  readonly missionId: string;
  readonly objective: string;
  readonly evidence: readonly SharedRealityEvidence[];
  readonly acceptedImplementationHistory: readonly string[];
}

export interface SharedRealityAssembler {
  assemble(request: SharedRealityRequest): Promise<SharedRealityView>;
}

// TODO: Refine evidence quality, freshness, and traceability contracts.
