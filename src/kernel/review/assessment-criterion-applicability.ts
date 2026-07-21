import { InvalidReviewDefinitionError } from './review.errors';
import {
  CanonicalSubjectElementKind,
  SubjectElementReference,
  compareUtf8Bytes,
} from './subject-element-reference';

export type AssessmentCriterionApplicability =
  | { readonly kind: 'AllSubjectElements' }
  | { readonly kind: 'SubjectElementsOfKind'; readonly canonicalKind: CanonicalSubjectElementKind }
  | {
      readonly kind: 'ExactSubjectElementSet';
      readonly subjectElementReferences: readonly SubjectElementReference[];
    }
  | { readonly kind: 'SubjectWide' };

export function allSubjectElementsApplicability(): AssessmentCriterionApplicability {
  return Object.freeze({ kind: 'AllSubjectElements' });
}

export function subjectElementsOfKindApplicability(
  canonicalKind: CanonicalSubjectElementKind,
): AssessmentCriterionApplicability {
  if (!(canonicalKind instanceof CanonicalSubjectElementKind)) {
    throw new InvalidReviewDefinitionError('SubjectElementsOfKind requires a canonical kind.');
  }

  return Object.freeze({ kind: 'SubjectElementsOfKind', canonicalKind });
}

export function exactSubjectElementSetApplicability(
  subjectElementReferences: readonly SubjectElementReference[],
): AssessmentCriterionApplicability {
  if (subjectElementReferences.length === 0) {
    throw new InvalidReviewDefinitionError('ExactSubjectElementSet requires at least one SubjectElementReference.');
  }

  const sorted = [...subjectElementReferences].sort((left, right) => left.compareTo(right));

  for (const reference of sorted) {
    if (!(reference instanceof SubjectElementReference)) {
      throw new InvalidReviewDefinitionError('ExactSubjectElementSet requires only SubjectElementReference values.');
    }
  }

  for (let index = 1; index < sorted.length; index += 1) {
    if (sorted[index - 1]?.equals(sorted[index] as SubjectElementReference)) {
      throw new InvalidReviewDefinitionError('ExactSubjectElementSet cannot contain duplicate references.');
    }
  }

  return Object.freeze({
    kind: 'ExactSubjectElementSet',
    subjectElementReferences: Object.freeze(sorted),
  });
}

export function subjectWideApplicability(): AssessmentCriterionApplicability {
  return Object.freeze({ kind: 'SubjectWide' });
}

export function canonicalizeAssessmentCriterionApplicability(
  applicability: AssessmentCriterionApplicability,
): string {
  switch (applicability.kind) {
    case 'AllSubjectElements':
      return frame('AllSubjectElements');
    case 'SubjectElementsOfKind':
      return [frame('SubjectElementsOfKind'), frame(applicability.canonicalKind.toString())].join('');
    case 'ExactSubjectElementSet':
      return [
        frame('ExactSubjectElementSet'),
        ...applicability.subjectElementReferences
          .map((reference) => reference.toString())
          .sort(compareUtf8Bytes)
          .map(frame),
      ].join('');
    case 'SubjectWide':
      return frame('SubjectWide');
    default:
      throw new InvalidReviewDefinitionError('Unknown AssessmentCriterionApplicability variant.');
  }
}

export function isElementScopedApplicability(applicability: AssessmentCriterionApplicability): boolean {
  return applicability.kind !== 'SubjectWide';
}

export function frame(value: string): string {
  return `${Buffer.byteLength(value, 'utf8')}:${value}`;
}
