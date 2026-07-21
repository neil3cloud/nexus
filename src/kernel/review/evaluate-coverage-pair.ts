import type { ConfidenceClassification } from '../evidence/confidence-classification';
import type { EvidenceVerificationStatus } from '../evidence/evidence-verification-status';
import type { EvidenceId } from '../evidence/evidence-id';
import type { EvidenceVersion } from '../evidence/evidence-version';
import {
  type AssessmentCoveragePair,
  AssessmentCoverage,
  assessmentCoveragePairKey,
  selectsPair,
} from './assessment-coverage';
import type { EvidenceExpectation, ExactContentExpectationClassification } from './evidence-expectation';
import { InvalidReviewDefinitionError } from './review.errors';

export type ExactContentQualification =
  | { readonly kind: 'NotExactContent' }
  | { readonly kind: 'QualifiedSnapshotContent' }
  | { readonly kind: 'QualifiedDerivedContent' };

export interface StructuralEvidenceDescriptor {
  readonly evidenceId: EvidenceId;
  readonly evidenceVersion: EvidenceVersion;
  readonly evidenceTypeIdentity: string;
  readonly evidenceTypeVersion: string;
  readonly confidenceClassification: ConfidenceClassification;
  readonly evidenceVerificationStatus: EvidenceVerificationStatus;
  readonly exactContentQualification: ExactContentQualification;
}

export interface EvidenceReference {
  readonly evidenceId: EvidenceId;
  readonly evidenceVersion: EvidenceVersion;
}

export type PreconditionFailure =
  | { readonly kind: 'EmptyBaseline' }
  | { readonly kind: 'Ambiguous'; readonly conflictingReferences: readonly EvidenceReference[] }
  | { readonly kind: 'Conflicting'; readonly conflictingReferences: readonly EvidenceReference[] }
  | {
      readonly kind: 'CrossMission';
      readonly offendingReference: EvidenceReference;
      readonly expectedMissionId: string;
      readonly actualMissionId: string;
    }
  | {
      readonly kind: 'CrossElement';
      readonly offendingReference: EvidenceReference;
      readonly expectedSubjectElementReference: string;
      readonly actualSubjectElementReference: string;
    }
  | { readonly kind: 'UnresolvedReference'; readonly unresolvedReference: EvidenceReference }
  | {
      readonly kind: 'RepresentedContentMismatched';
      readonly offendingReference: EvidenceReference;
      readonly expectedRepresentedContentReference: string;
      readonly actualRepresentedContentReference: string;
    }
  | {
      readonly kind: 'DigestMismatched';
      readonly offendingReference: EvidenceReference;
      readonly expectedContentDigestAlgorithm: string;
      readonly expectedContentDigest: string;
      readonly actualContentDigestAlgorithm: string;
      readonly actualContentDigest: string;
    }
  | {
      readonly kind: 'UnresolvedDerivation';
      readonly offendingReference: EvidenceReference;
      readonly unresolvedDerivationSourceReferences: readonly EvidenceReference[];
    }
  | { readonly kind: 'UnrankableConfidence'; readonly offendingReference: EvidenceReference }
  | { readonly kind: 'UnrankableVerificationStatus'; readonly offendingReference: EvidenceReference }
  | { readonly kind: 'MalformedProvenance'; readonly offendingReference: EvidenceReference };

export type BaselineResolutionResult =
  | { readonly kind: 'PreconditionFailure'; readonly failure: PreconditionFailure }
  | { readonly kind: 'ResolvedBaseline'; readonly evidence: readonly StructuralEvidenceDescriptor[] };

export type ExpectationFailure =
  | { readonly kind: 'EvidenceExpectationMismatch'; readonly expectation: EvidenceExpectation }
  | {
      readonly kind: 'VerificationStatusThresholdFailure';
      readonly evidenceReference: EvidenceReference;
      readonly actual: EvidenceVerificationStatus;
      readonly required: EvidenceVerificationStatus;
    }
  | {
      readonly kind: 'ConfidenceThresholdFailure';
      readonly evidenceReference: EvidenceReference;
      readonly actual: ConfidenceClassification;
      readonly required: ConfidenceClassification;
    };

export type FindingRequiredTargetData =
  | {
      readonly kind: 'SubjectElementTargetData';
      readonly subjectElementReference: string;
      readonly canonicalKind: string;
    }
  | {
      readonly kind: 'AssessmentSubjectTargetData';
      readonly basisFingerprint: string;
    };

export type CoveragePairEvaluationOutcome =
  | { readonly kind: 'Satisfied' }
  | {
      readonly kind: 'FindingRequired';
      readonly failures: readonly ExpectationFailure[];
      readonly targetData: FindingRequiredTargetData;
    }
  | {
      readonly kind: 'NotApplicable';
      readonly explanation: string;
      readonly pairKey: string;
      readonly applicability: unknown;
    }
  | { readonly kind: 'UnableToEvaluate'; readonly reason: PreconditionFailure };

export function notExactContent(): ExactContentQualification {
  return Object.freeze({ kind: 'NotExactContent' });
}

export function qualifiedSnapshotContent(): ExactContentQualification {
  return Object.freeze({ kind: 'QualifiedSnapshotContent' });
}

export function qualifiedDerivedContent(): ExactContentQualification {
  return Object.freeze({ kind: 'QualifiedDerivedContent' });
}

export function resolvedBaseline(
  evidence: readonly StructuralEvidenceDescriptor[],
): BaselineResolutionResult {
  if (evidence.length === 0) {
    throw new InvalidReviewDefinitionError('Resolved baseline must contain at least one StructuralEvidenceDescriptor.');
  }

  const keys = new Set(evidence.map((descriptor) => evidenceReferenceKey(descriptor)));

  if (keys.size !== evidence.length) {
    throw new InvalidReviewDefinitionError('Resolved baseline cannot contain duplicate EvidenceId/EvidenceVersion pairs.');
  }

  return Object.freeze({ kind: 'ResolvedBaseline', evidence: Object.freeze([...evidence]) });
}

export function baselinePreconditionFailure(failure: PreconditionFailure): BaselineResolutionResult {
  return Object.freeze({ kind: 'PreconditionFailure', failure: validatePreconditionFailure(failure) });
}

export function evaluateCoveragePair(
  coverage: AssessmentCoverage,
  pair: AssessmentCoveragePair,
  baselineResolution: BaselineResolutionResult,
): CoveragePairEvaluationOutcome {
  if (!(coverage instanceof AssessmentCoverage)) {
    throw new InvalidReviewDefinitionError('evaluateCoveragePair requires an AssessmentCoverage.');
  }

  const criterion = coverage.getCriterionForPair(pair);

  if (!selectsPair(criterion.applicability, pair)) {
    return Object.freeze({
      kind: 'NotApplicable',
      explanation: `Criterion '${pair.assessmentCriterionId.toString()}' does not select coverage pair '${assessmentCoveragePairKey(pair)}'.`,
      pairKey: assessmentCoveragePairKey(pair),
      applicability: criterion.applicability,
    });
  }

  if (baselineResolution.kind === 'PreconditionFailure') {
    return Object.freeze({ kind: 'UnableToEvaluate', reason: validatePreconditionFailure(baselineResolution.failure) });
  }

  if (baselineResolution.evidence.length === 0) {
    return Object.freeze({ kind: 'UnableToEvaluate', reason: { kind: 'EmptyBaseline' as const } });
  }

  const failures = [
    ...evaluateExpectations(criterion.evidenceExpectations, baselineResolution.evidence),
    ...evaluateThresholds(
      baselineResolution.evidence,
      criterion.verificationStatusThreshold,
      criterion.confidenceThreshold,
    ),
  ];

  if (failures.length > 0) {
    return Object.freeze({
      kind: 'FindingRequired',
      failures: Object.freeze(failures),
      targetData: targetDataForPair(pair),
    });
  }

  return Object.freeze({ kind: 'Satisfied' });
}

function evaluateExpectations(
  expectations: readonly EvidenceExpectation[],
  evidence: readonly StructuralEvidenceDescriptor[],
): readonly ExpectationFailure[] {
  return expectations
    .filter((expectation) => !evidenceExpectationSatisfied(expectation, evidence))
    .map((expectation) => Object.freeze({ kind: 'EvidenceExpectationMismatch', expectation }) as ExpectationFailure);
}

function evidenceExpectationSatisfied(
  expectation: EvidenceExpectation,
  evidence: readonly StructuralEvidenceDescriptor[],
): boolean {
  switch (expectation.kind) {
    case 'NoAdditionalExpectation':
      return evidence.length > 0;
    case 'RequiredEvidenceType':
      return evidence.some(
        (descriptor) =>
          descriptor.evidenceTypeIdentity === expectation.evidenceTypeIdentity &&
          descriptor.evidenceTypeVersion === expectation.evidenceTypeVersion,
      );
    case 'RequiredExactContent':
      return evidence.some((descriptor) =>
        exactContentQualificationSatisfies(descriptor.exactContentQualification, expectation.classification),
      );
    case 'RequiredEvidenceCount':
      return evidence.length >= expectation.minimumCount;
    default:
      throw new InvalidReviewDefinitionError('Unknown EvidenceExpectation variant.');
  }
}

function evaluateThresholds(
  evidence: readonly StructuralEvidenceDescriptor[],
  verificationStatusThreshold: EvidenceVerificationStatus,
  confidenceThreshold: ConfidenceClassification,
): readonly ExpectationFailure[] {
  const failures: ExpectationFailure[] = [];

  for (const descriptor of evidence) {
    if (descriptor.evidenceVerificationStatus.satisfiesThreshold(verificationStatusThreshold) === 'Insufficient') {
      failures.push(
        Object.freeze({
          kind: 'VerificationStatusThresholdFailure',
          evidenceReference: evidenceReferenceFromDescriptor(descriptor),
          actual: descriptor.evidenceVerificationStatus,
          required: verificationStatusThreshold,
        }),
      );
    }

    if (descriptor.confidenceClassification.satisfiesThreshold(confidenceThreshold) === 'Insufficient') {
      failures.push(
        Object.freeze({
          kind: 'ConfidenceThresholdFailure',
          evidenceReference: evidenceReferenceFromDescriptor(descriptor),
          actual: descriptor.confidenceClassification,
          required: confidenceThreshold,
        }),
      );
    }
  }

  return Object.freeze(failures);
}

function exactContentQualificationSatisfies(
  qualification: ExactContentQualification,
  classification: ExactContentExpectationClassification,
): boolean {
  switch (classification) {
    case 'AnyExactContent':
      return qualification.kind === 'QualifiedSnapshotContent' || qualification.kind === 'QualifiedDerivedContent';
    case 'SnapshotContent':
      return qualification.kind === 'QualifiedSnapshotContent';
    case 'DerivedContent':
      return qualification.kind === 'QualifiedDerivedContent';
    default:
      throw new InvalidReviewDefinitionError('Unknown RequiredExactContent classification.');
  }
}

function targetDataForPair(pair: AssessmentCoveragePair): FindingRequiredTargetData {
  switch (pair.kind) {
    case 'SubjectElementPair':
      return Object.freeze({
        kind: 'SubjectElementTargetData',
        subjectElementReference: pair.subjectElement.subjectElementReference.toString(),
        canonicalKind: pair.subjectElement.canonicalKind.toString(),
      });
    case 'AssessmentSubjectPair':
      return Object.freeze({
        kind: 'AssessmentSubjectTargetData',
        basisFingerprint: pair.basisFingerprint.toString(),
      });
    default:
      throw new InvalidReviewDefinitionError('Unknown AssessmentCoveragePair variant.');
  }
}

function validatePreconditionFailure(failure: PreconditionFailure): PreconditionFailure {
  switch (failure.kind) {
    case 'EmptyBaseline':
      return failure;
    case 'Ambiguous':
    case 'Conflicting':
      assertNonEmptyReferences(failure.conflictingReferences, failure.kind);
      return failure;
    case 'CrossMission':
      normalizeNonEmpty(failure.expectedMissionId, 'expected Mission identity');
      normalizeNonEmpty(failure.actualMissionId, 'actual Mission identity');
      return failure;
    case 'CrossElement':
      normalizeNonEmpty(failure.expectedSubjectElementReference, 'expected SubjectElementReference');
      normalizeNonEmpty(failure.actualSubjectElementReference, 'actual SubjectElementReference');
      return failure;
    case 'UnresolvedReference':
    case 'UnrankableConfidence':
    case 'UnrankableVerificationStatus':
    case 'MalformedProvenance':
      return failure;
    case 'RepresentedContentMismatched':
      normalizeNonEmpty(failure.expectedRepresentedContentReference, 'expected representedContentReference');
      normalizeNonEmpty(failure.actualRepresentedContentReference, 'actual representedContentReference');
      return failure;
    case 'DigestMismatched':
      normalizeNonEmpty(failure.expectedContentDigestAlgorithm, 'expected contentDigestAlgorithm');
      normalizeNonEmpty(failure.expectedContentDigest, 'expected contentDigest');
      normalizeNonEmpty(failure.actualContentDigestAlgorithm, 'actual contentDigestAlgorithm');
      normalizeNonEmpty(failure.actualContentDigest, 'actual contentDigest');
      return failure;
    case 'UnresolvedDerivation':
      assertNonEmptyReferences(failure.unresolvedDerivationSourceReferences, 'UnresolvedDerivation');
      return failure;
    default:
      throw new InvalidReviewDefinitionError('Unknown Precondition-Failure Vocabulary variant.');
  }
}

function assertNonEmptyReferences(references: readonly EvidenceReference[], label: string): void {
  if (references.length === 0) {
    throw new InvalidReviewDefinitionError(`${label} requires a non-empty evidence-reference payload.`);
  }
}

function evidenceReferenceFromDescriptor(descriptor: StructuralEvidenceDescriptor): EvidenceReference {
  return Object.freeze({
    evidenceId: descriptor.evidenceId,
    evidenceVersion: descriptor.evidenceVersion,
  });
}

function evidenceReferenceKey(reference: EvidenceReference): string {
  return `${reference.evidenceId.toString()}@${reference.evidenceVersion.toNumber()}`;
}

function normalizeNonEmpty(value: string, label: string): string {
  if (typeof value !== 'string') {
    throw new InvalidReviewDefinitionError(`${label} must be a non-empty string.`);
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidReviewDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
