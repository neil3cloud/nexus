export const reviewStatuses = ['Pending', 'In Progress', 'Completed'] as const;
export type ReviewStatusValue = (typeof reviewStatuses)[number];

export const reviewOutcomes = [
  'Accepted',
  'Accepted With Observations',
  'Action Required',
  'Rejected',
] as const;
export type ReviewOutcomeValue = (typeof reviewOutcomes)[number];

export const severities = ['Informational', 'Minor', 'Major', 'Critical'] as const;
export type SeverityValue = (typeof severities)[number];

export const findingCategories = [
  'Correction',
  'Expansion',
  'Refactoring',
  'Alignment',
  'Risk Mitigation',
  'Documentation',
] as const;
export type FindingCategoryValue = (typeof findingCategories)[number];

export const findingStatuses = ['Created', 'Accepted', 'Resolved', 'Dismissed'] as const;
export type FindingStatusValue = (typeof findingStatuses)[number];

export interface ReviewCriteriaSnapshot {
  readonly id: string;
  readonly description: string;
}

export interface FindingSnapshot {
  readonly id: string;
  readonly reviewId: string;
  readonly severity: SeverityValue;
  readonly category?: FindingCategoryValue;
  readonly summary: string;
  readonly description: string;
  readonly supportingEvidenceReferences: readonly string[];
  readonly affectedArtifactReferences: readonly string[];
  readonly criteriaReferences: readonly string[];
  readonly status: FindingStatusValue;
}

export interface ReviewSnapshot {
  readonly id: string;
  readonly missionId: string;
  readonly missionPlanRevision: string;
  readonly status: ReviewStatusValue;
  readonly outcome?: ReviewOutcomeValue;
  readonly reviewCriteria: readonly ReviewCriteriaSnapshot[];
  readonly evidenceReferences: readonly string[];
  readonly findings: readonly FindingSnapshot[];
}
