import { InvalidReviewDefinitionError } from './review.errors';
import { CorpusReviewBasisFingerprint } from './subject-element-reference';

export const assessmentSubjectReferenceKinds = [
  'ExecutableMissionPlan',
  'ProposedPlanRevision',
  'CorpusReviewBasis',
] as const;

export type AssessmentSubjectReferenceKind = (typeof assessmentSubjectReferenceKinds)[number];

export interface ExecutableMissionPlanAssessmentSubjectReference {
  readonly kind: 'ExecutableMissionPlan';
  readonly revisionId: string;
}

export interface ProposedPlanRevisionAssessmentSubjectReference {
  readonly kind: 'ProposedPlanRevision';
  readonly revisionId: string;
}

export interface CorpusReviewBasisAssessmentSubjectReference {
  readonly kind: 'CorpusReviewBasis';
  readonly basisFingerprint: CorpusReviewBasisFingerprint;
}

export type AssessmentSubjectReference =
  | ExecutableMissionPlanAssessmentSubjectReference
  | ProposedPlanRevisionAssessmentSubjectReference
  | CorpusReviewBasisAssessmentSubjectReference;

export type AssessmentSubjectReferenceSnapshot =
  | ExecutableMissionPlanAssessmentSubjectReference
  | ProposedPlanRevisionAssessmentSubjectReference
  | {
      readonly kind: 'CorpusReviewBasis';
      readonly basisFingerprint: string;
    };

export function executableMissionPlanSubject(revisionId: string): ExecutableMissionPlanAssessmentSubjectReference {
  return Object.freeze({
    kind: 'ExecutableMissionPlan',
    revisionId: normalizeRevisionId(revisionId),
  });
}

export function proposedPlanRevisionSubject(revisionId: string): ProposedPlanRevisionAssessmentSubjectReference {
  return Object.freeze({
    kind: 'ProposedPlanRevision',
    revisionId: normalizeRevisionId(revisionId),
  });
}

export function corpusReviewBasisSubject(
  basisFingerprint: CorpusReviewBasisFingerprint | string,
): CorpusReviewBasisAssessmentSubjectReference {
  return Object.freeze({
    kind: 'CorpusReviewBasis',
    basisFingerprint:
      typeof basisFingerprint === 'string'
        ? CorpusReviewBasisFingerprint.fromString(basisFingerprint)
        : basisFingerprint,
  });
}

export function assessmentSubjectReferenceFromSnapshot(
  snapshot: AssessmentSubjectReferenceSnapshot,
): AssessmentSubjectReference {
  switch (snapshot.kind) {
    case 'ExecutableMissionPlan':
      return executableMissionPlanSubject(snapshot.revisionId);
    case 'ProposedPlanRevision':
      return proposedPlanRevisionSubject(snapshot.revisionId);
    case 'CorpusReviewBasis':
      return corpusReviewBasisSubject(snapshot.basisFingerprint);
    default:
      throw new InvalidReviewDefinitionError('AssessmentSubjectReference kind is not authorized by RFC-0006 v1.3.');
  }
}

function normalizeRevisionId(value: string): string {
  if (typeof value !== 'string') {
    throw new InvalidReviewDefinitionError('AssessmentSubjectReference revisionId must be a non-empty string.');
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidReviewDefinitionError('AssessmentSubjectReference revisionId must be a non-empty string.');
  }

  return normalized;
}
