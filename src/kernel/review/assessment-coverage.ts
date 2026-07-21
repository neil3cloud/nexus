import {
  type AssessmentCriterionApplicability,
  canonicalizeAssessmentCriterionApplicability,
  isElementScopedApplicability,
} from './assessment-criterion-applicability';
import {
  AssessmentCriteriaSet,
  type AssessmentCriterion,
  AssessmentCriterionId,
} from './assessment-criterion';
import { InvalidReviewDefinitionError } from './review.errors';
import {
  CanonicalSubjectElementKind,
  CorpusReviewBasisFingerprint,
  SubjectElementReference,
  compareUtf8Bytes,
} from './subject-element-reference';

export interface StructuralSubjectElementDescriptor {
  readonly subjectElementReference: SubjectElementReference;
  readonly canonicalKind: CanonicalSubjectElementKind;
}

export type AssessmentCoveragePair =
  | {
      readonly kind: 'SubjectElementPair';
      readonly subjectElement: StructuralSubjectElementDescriptor;
      readonly assessmentCriterionId: AssessmentCriterionId;
    }
  | {
      readonly kind: 'AssessmentSubjectPair';
      readonly basisFingerprint: CorpusReviewBasisFingerprint;
      readonly assessmentCriterionId: AssessmentCriterionId;
    };

export type CoverageDisposition =
  | { readonly kind: 'Satisfied' }
  | {
      readonly kind: 'NotApplicable';
      readonly explanation: string;
      readonly pairKey: string;
      readonly applicability: AssessmentCriterionApplicability;
    }
  | { readonly kind: 'UnableToEvaluate'; readonly reason: unknown }
  | { readonly kind: 'FindingProduced'; readonly findingReference: string };

export function structuralSubjectElementDescriptor(input: {
  readonly subjectElementReference: SubjectElementReference;
  readonly canonicalKind: CanonicalSubjectElementKind;
}): StructuralSubjectElementDescriptor {
  if (!(input.subjectElementReference instanceof SubjectElementReference)) {
    throw new InvalidReviewDefinitionError('StructuralSubjectElementDescriptor requires a SubjectElementReference.');
  }

  if (!(input.canonicalKind instanceof CanonicalSubjectElementKind)) {
    throw new InvalidReviewDefinitionError('StructuralSubjectElementDescriptor requires a CanonicalSubjectElementKind.');
  }

  return Object.freeze({
    subjectElementReference: input.subjectElementReference,
    canonicalKind: input.canonicalKind,
  });
}

export function satisfiedDisposition(): CoverageDisposition {
  return Object.freeze({ kind: 'Satisfied' });
}

export function notApplicableDisposition(input: {
  readonly explanation: string;
  readonly pair: AssessmentCoveragePair;
  readonly applicability: AssessmentCriterionApplicability;
}): CoverageDisposition {
  const explanation = normalizeNonEmpty(input.explanation, 'NotApplicable explanation');

  return Object.freeze({
    kind: 'NotApplicable',
    explanation,
    pairKey: assessmentCoveragePairKey(input.pair),
    applicability: input.applicability,
  });
}

export function unableToEvaluateDisposition(reason: unknown): CoverageDisposition {
  if (reason === undefined) {
    throw new InvalidReviewDefinitionError('UnableToEvaluate requires an attributable reason.');
  }

  return Object.freeze({ kind: 'UnableToEvaluate', reason });
}

export function findingProducedDisposition(findingReference: string): CoverageDisposition {
  return Object.freeze({
    kind: 'FindingProduced',
    findingReference: normalizeNonEmpty(findingReference, 'FindingProduced finding reference'),
  });
}

export class AssessmentCoverage {
  private constructor(
    public readonly basisFingerprint: CorpusReviewBasisFingerprint,
    public readonly criteria: AssessmentCriteriaSet,
    public readonly pairs: readonly AssessmentCoveragePair[],
    private readonly dispositions: ReadonlyMap<string, CoverageDisposition>,
  ) {
    Object.freeze(this);
  }

  public static open(
    basisFingerprint: CorpusReviewBasisFingerprint,
    elements: readonly StructuralSubjectElementDescriptor[],
    criteria: AssessmentCriteriaSet,
  ): AssessmentCoverage {
    if (!(basisFingerprint instanceof CorpusReviewBasisFingerprint)) {
      throw new InvalidReviewDefinitionError('AssessmentCoverage.open requires a CorpusReviewBasisFingerprint.');
    }

    if (!(criteria instanceof AssessmentCriteriaSet)) {
      throw new InvalidReviewDefinitionError('AssessmentCoverage.open requires an AssessmentCriteriaSet.');
    }

    const sortedElements = [...elements].sort((left, right) =>
      left.subjectElementReference.compareTo(right.subjectElementReference),
    );
    assertUniqueElements(sortedElements);

    const elementPairs = sortedElements.flatMap((element) =>
      criteria.criteria
        .filter((criterion) => criterion.isElementScoped())
        .map((criterion) =>
          freezePair({
            kind: 'SubjectElementPair',
            subjectElement: element,
            assessmentCriterionId: criterion.id,
          }),
        ),
    );
    const subjectPairs = criteria.criteria
      .filter((criterion) => !criterion.isElementScoped())
      .map((criterion) =>
        freezePair({
          kind: 'AssessmentSubjectPair',
          basisFingerprint,
          assessmentCriterionId: criterion.id,
        }),
      );
    const pairs = [...elementPairs, ...subjectPairs].sort(comparePairs);
    const keys = new Set(pairs.map(assessmentCoveragePairKey));

    if (keys.size !== pairs.length) {
      throw new InvalidReviewDefinitionError('AssessmentCoverage.open produced duplicate coverage pair identities.');
    }

    return new AssessmentCoverage(basisFingerprint, criteria, Object.freeze(pairs), new Map());
  }

  public containsPair(pair: AssessmentCoveragePair): boolean {
    return this.pairs.some((candidate) => assessmentCoveragePairsEqual(candidate, pair));
  }

  public getCriterionForPair(pair: AssessmentCoveragePair): AssessmentCriterion {
    this.assertUniversePair(pair);
    return this.criteria.getById(pair.assessmentCriterionId);
  }

  public getDisposition(pair: AssessmentCoveragePair): CoverageDisposition | undefined {
    this.assertUniversePair(pair);
    return this.dispositions.get(assessmentCoveragePairKey(pair));
  }

  public recordDisposition(pair: AssessmentCoveragePair, disposition: CoverageDisposition): AssessmentCoverage {
    const universePair = this.assertUniversePair(pair);
    const key = assessmentCoveragePairKey(universePair);

    if (this.dispositions.has(key)) {
      throw new InvalidReviewDefinitionError('AssessmentCoverage pair already has an immutable disposition.');
    }

    this.validateDisposition(universePair, disposition);

    const dispositions = new Map(this.dispositions);
    dispositions.set(key, disposition);

    return new AssessmentCoverage(this.basisFingerprint, this.criteria, this.pairs, dispositions);
  }

  public isComplete(): boolean {
    return this.pairs.every((pair) => this.dispositions.has(assessmentCoveragePairKey(pair)));
  }

  private assertUniversePair(pair: AssessmentCoveragePair): AssessmentCoveragePair {
    const universePair = this.pairs.find((candidate) => assessmentCoveragePairsEqual(candidate, pair));

    if (universePair === undefined) {
      throw new InvalidReviewDefinitionError('AssessmentCoverage pair is not present in this coverage universe.');
    }

    return universePair;
  }

  private validateDisposition(pair: AssessmentCoveragePair, disposition: CoverageDisposition): void {
    switch (disposition.kind) {
      case 'Satisfied':
      case 'UnableToEvaluate':
        return;
      case 'FindingProduced':
        normalizeNonEmpty(disposition.findingReference, 'FindingProduced finding reference');
        return;
      case 'NotApplicable': {
        if (disposition.pairKey !== assessmentCoveragePairKey(pair)) {
          throw new InvalidReviewDefinitionError('NotApplicable explanation must be tied to the exact coverage pair.');
        }

        const actualApplicability = this.getCriterionForPair(pair).applicability;

        if (
          canonicalizeAssessmentCriterionApplicability(disposition.applicability) !==
          canonicalizeAssessmentCriterionApplicability(actualApplicability)
        ) {
          throw new InvalidReviewDefinitionError(
            'NotApplicable disposition must carry the exact applicability declaration relied upon.',
          );
        }

        if (pair.kind === 'AssessmentSubjectPair') {
          throw new InvalidReviewDefinitionError('AssessmentSubjectPair cannot be marked NotApplicable.');
        }

        if (selectsPair(actualApplicability, pair)) {
          throw new InvalidReviewDefinitionError('A selected SubjectElementPair cannot be marked NotApplicable.');
        }

        normalizeNonEmpty(disposition.explanation, 'NotApplicable explanation');
        return;
      }
      default:
        throw new InvalidReviewDefinitionError('Unknown CoverageDisposition variant.');
    }
  }
}

export function selectsPair(
  applicability: AssessmentCriterionApplicability,
  pair: AssessmentCoveragePair,
): boolean {
  if (pair.kind === 'AssessmentSubjectPair') {
    return applicability.kind === 'SubjectWide';
  }

  if (!isElementScopedApplicability(applicability)) {
    return false;
  }

  switch (applicability.kind) {
    case 'AllSubjectElements':
      return true;
    case 'SubjectElementsOfKind':
      return pair.subjectElement.canonicalKind.equals(applicability.canonicalKind);
    case 'ExactSubjectElementSet':
      return applicability.subjectElementReferences.some((reference) =>
        reference.equals(pair.subjectElement.subjectElementReference),
      );
    case 'SubjectWide':
      return false;
    default:
      throw new InvalidReviewDefinitionError('Unknown AssessmentCriterionApplicability variant.');
  }
}

export function assessmentCoveragePairsEqual(left: AssessmentCoveragePair, right: AssessmentCoveragePair): boolean {
  return assessmentCoveragePairKey(left) === assessmentCoveragePairKey(right);
}

export function assessmentCoveragePairKey(pair: AssessmentCoveragePair): string {
  switch (pair.kind) {
    case 'SubjectElementPair':
      return [
        'SubjectElementPair',
        pair.subjectElement.subjectElementReference.toString(),
        pair.subjectElement.canonicalKind.toString(),
        pair.assessmentCriterionId.toString(),
      ].join('\u001f');
    case 'AssessmentSubjectPair':
      return [
        'AssessmentSubjectPair',
        pair.basisFingerprint.toString(),
        pair.assessmentCriterionId.toString(),
      ].join('\u001f');
    default:
      throw new InvalidReviewDefinitionError('Unknown AssessmentCoveragePair variant.');
  }
}

function assertUniqueElements(elements: readonly StructuralSubjectElementDescriptor[]): void {
  const references = new Map<string, CanonicalSubjectElementKind>();

  for (const element of elements) {
    const descriptor = structuralSubjectElementDescriptor(element);
    const key = descriptor.subjectElementReference.toString();
    const existing = references.get(key);

    if (existing !== undefined) {
      throw new InvalidReviewDefinitionError(
        existing.equals(descriptor.canonicalKind)
          ? 'AssessmentCoverage.open cannot accept duplicate SubjectElementReference values.'
          : 'AssessmentCoverage.open cannot accept conflicting canonical kinds for a SubjectElementReference.',
      );
    }

    references.set(key, descriptor.canonicalKind);
  }
}

function comparePairs(left: AssessmentCoveragePair, right: AssessmentCoveragePair): number {
  if (left.kind !== right.kind) {
    return left.kind === 'SubjectElementPair' ? -1 : 1;
  }

  if (left.kind === 'SubjectElementPair' && right.kind === 'SubjectElementPair') {
    const elementComparison = left.subjectElement.subjectElementReference.compareTo(
      right.subjectElement.subjectElementReference,
    );

    return elementComparison === 0 ? left.assessmentCriterionId.compareTo(right.assessmentCriterionId) : elementComparison;
  }

  return compareUtf8Bytes(left.assessmentCriterionId.toString(), right.assessmentCriterionId.toString());
}

function freezePair(pair: AssessmentCoveragePair): AssessmentCoveragePair {
  return Object.freeze(pair);
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
