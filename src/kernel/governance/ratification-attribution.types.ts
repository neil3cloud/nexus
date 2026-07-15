import type { RepositoryPolicySnapshot } from './repository-policy.types';

export const ratificationAuthorityLifecycleStatuses = [
  'Effective',
  'Superseded',
  'Withdrawn',
] as const;

export type RatificationAuthorityLifecycleStatus =
  (typeof ratificationAuthorityLifecycleStatuses)[number];

export const ratificationAttributionValidationOutcomes = [
  'Valid',
  'Invalid',
  'Unresolvable',
] as const;

export type RatificationAttributionValidationOutcome =
  (typeof ratificationAttributionValidationOutcomes)[number];

export const ratificationAttributionDiagnosticCodes = [
  'valid-effective-record',
  'invalid-superseded-record',
  'invalid-withdrawn-record',
  'invalid-contradictory-record',
  'invalid-structurally-malformed-record',
  'unresolvable-no-matching-record',
  'unresolvable-duplicate-identifier',
  'unresolvable-unknown-lifecycle-status',
  'unresolvable-malformed-ratification-reference',
  'unresolvable-snapshot-source-unavailable',
] as const;

export type RatificationAttributionDiagnosticCode =
  (typeof ratificationAttributionDiagnosticCodes)[number];

export interface RatificationAuthorityRecordInput {
  readonly identifier?: string;
  readonly date?: string;
  readonly subject?: string;
  readonly lifecycleStatus?: string | readonly string[];
  readonly supersededByRatificationId?: string;
  readonly withdrawnByRatificationId?: string;
}

export interface RatificationAuthorityRecordSnapshot {
  readonly identifier?: string;
  readonly date?: string;
  readonly subject?: string;
  readonly lifecycleStatus?: string | readonly string[];
  readonly supersededByRatificationId?: string;
  readonly withdrawnByRatificationId?: string;
}

export interface RatificationAuthoritySnapshotInput {
  readonly source: string;
  readonly capturedAt: string;
  readonly records: readonly RatificationAuthorityRecordInput[];
}

export interface RatificationAuthoritySnapshotState {
  readonly source: string;
  readonly capturedAt: string;
  readonly records: readonly RatificationAuthorityRecordSnapshot[];
}

export interface RatificationAttributionDiagnostic {
  readonly code: RatificationAttributionDiagnosticCode;
  readonly message: string;
  readonly ratificationId?: string;
}

export interface RatificationAttributionValidationSnapshot {
  readonly repositoryPolicyId: string;
  readonly repositoryPolicyVersion: number;
  readonly ratificationId: string;
  readonly outcome: RatificationAttributionValidationOutcome;
  readonly diagnostics: readonly RatificationAttributionDiagnostic[];
}

export interface ValidateRatificationAttributionCommand {
  readonly repositoryPolicy: RepositoryPolicySnapshot;
}

