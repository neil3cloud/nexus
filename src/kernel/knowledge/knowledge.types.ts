export const knowledgeStatuses = [
  'Candidate',
  'Approved',
  'Active',
  'Superseded',
  'Archived',
] as const;
export type KnowledgeStatusValue = (typeof knowledgeStatuses)[number];

export const knowledgeScopes = [
  'Repository',
  'Architecture',
  'Capability',
  'Component',
  'Module',
  'Policy',
] as const;
export type KnowledgeScopeValue = (typeof knowledgeScopes)[number];

export interface KnowledgeAttributionSnapshot {
  readonly missionId: string;
  readonly missionPlanRevisionId: string;
  readonly supportingEvidenceIds: readonly string[];
  readonly supportingReviewId: string;
  readonly contributingEventIds: readonly string[];
  readonly approvingAuthority: string;
}

export interface KnowledgeProvenanceSnapshot {
  readonly evidenceLineage: readonly string[];
  readonly reviewLineage: string;
  readonly missionLineage: {
    readonly missionId: string;
    readonly missionPlanRevisionId: string;
  };
  readonly approvalLineage: string;
}

export interface KnowledgeRevisionSnapshot {
  readonly revisionNumber: number;
  readonly previousRevisionNumber?: number;
  readonly summary: string;
  readonly attribution: KnowledgeAttributionSnapshot;
  readonly provenance: KnowledgeProvenanceSnapshot;
}

export interface KnowledgeSnapshot {
  readonly id: string;
  readonly missionId: string;
  readonly missionPlanRevisionId: string;
  readonly summary: string;
  readonly scope: KnowledgeScopeValue;
  readonly status: KnowledgeStatusValue;
  readonly supportingEvidenceIds: readonly string[];
  readonly supportingReviewId: string;
  readonly contributingEventIds: readonly string[];
  readonly approvingAuthority: string;
  readonly attribution: KnowledgeAttributionSnapshot;
  readonly provenance: KnowledgeProvenanceSnapshot;
  readonly revisions: readonly KnowledgeRevisionSnapshot[];
}
