import { createHash } from 'node:crypto';

import type { ConfidenceClassification } from '../evidence/confidence-classification';
import type { EvidenceVerificationStatus } from '../evidence/evidence-verification-status';
import {
  type AssessmentCriterionApplicability,
  canonicalizeAssessmentCriterionApplicability,
  frame,
  isElementScopedApplicability,
} from './assessment-criterion-applicability';
import {
  type EvidenceExpectation,
  canonicalizeEvidenceExpectationSet,
  createEvidenceExpectationSet,
} from './evidence-expectation';
import { InvalidReviewDefinitionError } from './review.errors';
import { compareUtf8Bytes } from './subject-element-reference';

export class AssessmentCriterionId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): AssessmentCriterionId {
    return new AssessmentCriterionId(normalizeNonEmpty(value, 'AssessmentCriterionId'));
  }

  public equals(other: AssessmentCriterionId): boolean {
    return this.value === other.value;
  }

  public compareTo(other: AssessmentCriterionId): number {
    return compareUtf8Bytes(this.value, other.value);
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}

export interface ExactImmutableCriterionReferenceInput {
  readonly owningArtifactType: string;
  readonly criterionIdentity: string;
  readonly ownerArtifactIdentity: string;
  readonly ownerArtifactVersion: string;
  readonly criterionContentFingerprint: string;
  readonly supportingAuthorityReferences: readonly string[];
}

export interface ExactImmutableCriterionReference {
  readonly owningArtifactType: string;
  readonly criterionIdentity: string;
  readonly ownerArtifactIdentity: string;
  readonly ownerArtifactVersion: string;
  readonly criterionContentFingerprint: string;
  readonly supportingAuthorityReferences: readonly string[];
}

export interface AssessmentCriterionInput {
  readonly id: AssessmentCriterionId;
  readonly inlineDefinition?: string;
  readonly exactReference?: ExactImmutableCriterionReferenceInput;
  readonly applicability: AssessmentCriterionApplicability;
  readonly supportingAuthorityReferences: readonly string[];
  readonly evidenceExpectations: readonly EvidenceExpectation[];
  readonly verificationStatusThreshold: EvidenceVerificationStatus;
  readonly confidenceThreshold: ConfidenceClassification;
}

export class AssessmentCriterion {
  private constructor(
    public readonly id: AssessmentCriterionId,
    public readonly inlineDefinition: string | undefined,
    public readonly exactReference: ExactImmutableCriterionReference | undefined,
    public readonly applicability: AssessmentCriterionApplicability,
    public readonly supportingAuthorityReferences: readonly string[],
    public readonly evidenceExpectations: readonly EvidenceExpectation[],
    public readonly verificationStatusThreshold: EvidenceVerificationStatus,
    public readonly confidenceThreshold: ConfidenceClassification,
  ) {
    Object.freeze(this);
  }

  public static create(input: AssessmentCriterionInput): AssessmentCriterion {
    const hasInlineDefinition = input.inlineDefinition !== undefined;
    const hasExactReference = input.exactReference !== undefined;

    if (hasInlineDefinition === hasExactReference) {
      throw new InvalidReviewDefinitionError(
        'AssessmentCriterion requires exactly one of inlineDefinition or exactReference.',
      );
    }

    const inlineDefinition = input.inlineDefinition === undefined ? undefined : canonicalizeInlineDefinition(input.inlineDefinition);
    const exactReference =
      input.exactReference === undefined ? undefined : normalizeExactReference(input.exactReference);

    return new AssessmentCriterion(
      input.id,
      inlineDefinition,
      exactReference,
      input.applicability,
      normalizeReferenceSet(input.supportingAuthorityReferences, 'supporting authority reference'),
      createEvidenceExpectationSet(input.evidenceExpectations),
      input.verificationStatusThreshold,
      input.confidenceThreshold,
    );
  }

  public isElementScoped(): boolean {
    return isElementScopedApplicability(this.applicability);
  }

  public canonicalFingerprintInput(): string {
    return [
      frame(this.id.toString()),
      this.inlineDefinition === undefined
        ? frame(canonicalizeExactReference(this.exactReference as ExactImmutableCriterionReference))
        : frame(this.inlineDefinition),
      frame(canonicalizeAssessmentCriterionApplicability(this.applicability)),
      frame(canonicalizeStringSet(this.supportingAuthorityReferences)),
      frame(canonicalizeEvidenceExpectationSet(this.evidenceExpectations)),
      frame(this.verificationStatusThreshold.toString()),
      frame(this.confidenceThreshold.toString()),
    ].join('');
  }
}

export class AssessmentCriteriaSet {
  private constructor(
    public readonly identity: string,
    public readonly version: string,
    public readonly criteria: readonly AssessmentCriterion[],
    public readonly fingerprint: string,
  ) {
    Object.freeze(this);
  }

  public static create(input: {
    readonly identity: string;
    readonly version: string;
    readonly criteria: readonly AssessmentCriterion[];
  }): AssessmentCriteriaSet {
    if (input.criteria.length === 0) {
      throw new InvalidReviewDefinitionError('AssessmentCriteriaSet must be non-empty.');
    }

    const criteria = [...input.criteria].sort((left, right) => left.id.compareTo(right.id));
    const ids = new Set(criteria.map((criterion) => criterion.id.toString()));

    if (ids.size !== criteria.length) {
      throw new InvalidReviewDefinitionError('AssessmentCriteriaSet cannot contain duplicate AssessmentCriterionId values.');
    }

    const fingerprintInput = criteria.map((criterion) => frame(criterion.canonicalFingerprintInput())).join('');
    const fingerprint = createHash('sha256').update(fingerprintInput, 'utf8').digest('hex');

    return new AssessmentCriteriaSet(
      normalizeNonEmpty(input.identity, 'AssessmentCriteriaSet identity'),
      normalizeNonEmpty(input.version, 'AssessmentCriteriaSet version'),
      Object.freeze(criteria),
      fingerprint,
    );
  }

  public getById(id: AssessmentCriterionId): AssessmentCriterion {
    const criterion = this.criteria.find((candidate) => candidate.id.equals(id));

    if (criterion === undefined) {
      throw new InvalidReviewDefinitionError(`AssessmentCriterion '${id.toString()}' is not present in the criteria set.`);
    }

    return criterion;
  }
}

function canonicalizeInlineDefinition(value: string): string {
  return normalizeNonEmpty(value.normalize('NFC').replace(/\r\n?/gu, '\n').trim(), 'inline criterion definition');
}

function normalizeExactReference(input: ExactImmutableCriterionReferenceInput): ExactImmutableCriterionReference {
  return Object.freeze({
    owningArtifactType: normalizeNonEmpty(input.owningArtifactType, 'owning artifact type'),
    criterionIdentity: normalizeNonEmpty(input.criterionIdentity, 'criterion identity'),
    ownerArtifactIdentity: normalizeNonEmpty(input.ownerArtifactIdentity, 'owner artifact identity'),
    ownerArtifactVersion: normalizeNonEmpty(input.ownerArtifactVersion, 'owner artifact version'),
    criterionContentFingerprint: normalizeNonEmpty(input.criterionContentFingerprint, 'criterion content fingerprint'),
    supportingAuthorityReferences: normalizeReferenceSet(
      input.supportingAuthorityReferences,
      'exact-reference supporting authority reference',
    ),
  });
}

function canonicalizeExactReference(reference: ExactImmutableCriterionReference): string {
  return [
    frame(reference.owningArtifactType),
    frame(reference.criterionIdentity),
    frame(reference.ownerArtifactIdentity),
    frame(reference.ownerArtifactVersion),
    frame(reference.criterionContentFingerprint),
    frame(canonicalizeStringSet(reference.supportingAuthorityReferences)),
  ].join('');
}

function normalizeReferenceSet(values: readonly string[], label: string): readonly string[] {
  const sorted = values.map((value) => normalizeNonEmpty(value, label)).sort(compareUtf8Bytes);
  const unique = new Set(sorted);

  if (unique.size !== sorted.length) {
    throw new InvalidReviewDefinitionError(`Duplicate ${label} values are not permitted.`);
  }

  return Object.freeze(sorted);
}

function canonicalizeStringSet(values: readonly string[]): string {
  return [frame(String(values.length)), ...values.map(frame)].join('');
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
