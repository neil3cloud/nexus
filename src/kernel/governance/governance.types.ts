import type {
  FindingStatusValue,
  ReviewOutcomeValue,
  SeverityValue,
} from '../review/review.types';
import type {
  RatificationAttributionDiagnostic,
  RatificationAttributionValidationOutcome,
} from './ratification-attribution.types';

export const governanceDecisionValues = [
  'Approved',
  'Rejected',
  'Deferred',
  'Escalation Required',
] as const;
export type GovernanceDecisionValue = (typeof governanceDecisionValues)[number];

export const policyCriterionResultStatuses = [
  'Satisfied',
  'Violated',
  'Undetermined',
  'Unsupported',
] as const;
export type PolicyCriterionResultStatusValue =
  (typeof policyCriterionResultStatuses)[number];

export const governancePredicateKinds = [
  'ReviewOutcomeMembership',
  'UnresolvedFindingMatch',
] as const;
export type GovernancePredicateKind = (typeof governancePredicateKinds)[number];

export const unresolvedFindingExpectedMatches = ['Present', 'Absent'] as const;
export type UnresolvedFindingExpectedMatch =
  (typeof unresolvedFindingExpectedMatches)[number];

export const governanceEscalationReasonCodes = [
  'UnknownRepositoryPolicy',
  'UnknownRepositoryPolicyVersion',
  'MissingReview',
  'InvalidRatificationAttribution',
  'UnresolvableRatificationAttribution',
  'UnsupportedPredicateKind',
  'UnsupportedPredicateSchemaVersion',
  'MalformedPredicateDescriptor',
  'ContradictoryPredicateDescriptor',
  'InvalidExpectedMatch',
  'ReviewMissionMismatch',
] as const;
export type GovernanceEscalationReasonCode =
  (typeof governanceEscalationReasonCodes)[number];

export interface ReviewOutcomeMembershipDescriptor {
  readonly kind: 'ReviewOutcomeMembership';
  readonly schemaVersion: 1;
  readonly allowedReviewOutcomes: readonly ReviewOutcomeValue[];
}

export interface UnresolvedFindingMatchDescriptor {
  readonly kind: 'UnresolvedFindingMatch';
  readonly schemaVersion: 1;
  readonly severities: readonly SeverityValue[];
  readonly statuses: readonly FindingStatusValue[];
  readonly expectedMatch: UnresolvedFindingExpectedMatch;
}

export type GovernancePredicateDescriptor =
  | ReviewOutcomeMembershipDescriptor
  | UnresolvedFindingMatchDescriptor;

export interface PolicyCriterionResultSnapshot {
  readonly policyCriterionId: string;
  readonly predicateKind: string;
  readonly predicateSchemaVersion: string;
  readonly status: PolicyCriterionResultStatusValue;
  readonly reviewOutcome?: ReviewOutcomeValue;
  readonly findingReferences: readonly string[];
  readonly explanationCode: string;
}

export interface GovernanceEscalationSnapshot {
  readonly id: string;
  readonly reasonCode: GovernanceEscalationReasonCode;
  readonly repositoryPolicyId: string;
  readonly repositoryPolicyVersion: number;
  readonly reviewId: string;
  readonly reviewStateReference?: string;
  readonly policyCriterionIds: readonly string[];
  readonly inputReferences: readonly string[];
  readonly requiredAuthority: string;
  readonly ratificationId?: string;
  readonly ratificationAttributionOutcome?: RatificationAttributionValidationOutcome;
  readonly ratificationAttributionDiagnostics?: readonly RatificationAttributionDiagnostic[];
  readonly ratificationAuthoritySnapshotFingerprint?: string;
}

export interface PolicyEvaluationSnapshot {
  readonly id: string;
  readonly repositoryPolicyId: string;
  readonly repositoryPolicyVersion: number;
  readonly reviewId: string;
  readonly reviewStateReference: string;
  readonly criterionResults: readonly PolicyCriterionResultSnapshot[];
  readonly evaluationContractVersion: string;
  readonly evaluationKey: string;
  readonly evaluatedAt: string;
  readonly governanceDecisionId: string;
}

export interface GovernanceDecisionSnapshot {
  readonly id: string;
  readonly missionId: string;
  readonly value: GovernanceDecisionValue;
  readonly repositoryPolicyId: string;
  readonly repositoryPolicyVersion: number;
  readonly reviewId: string;
  readonly reviewStateReference: string;
  readonly policyEvaluationId: string;
  readonly evaluationKey: string;
  readonly criterionResults: readonly PolicyCriterionResultSnapshot[];
  readonly evaluatedAt: string;
  readonly explanationCodes: readonly string[];
  readonly escalation?: GovernanceEscalationSnapshot;
}
