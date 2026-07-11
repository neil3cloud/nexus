import type { EvidenceRecord } from "../evidence/evidence.contract";

export interface ProjectionRequest {
  readonly missionId: string;
  readonly objective: string;
  readonly evidence: readonly EvidenceRecord[];
}

export interface ProjectionView {
  readonly missionId: string;
  readonly objective: string;
  readonly evidenceIds: readonly string[];
  readonly contextSummary: string;
}

export interface ProjectionService {
  compute(request: ProjectionRequest): Promise<ProjectionView>;
}

// TODO: Add projection versioning and freshness contracts.
