import { InvalidReviewDefinitionError } from './review.errors';
import {
  CorpusReviewBasisFingerprint,
  SubjectElementReference,
} from './subject-element-reference';

export type FindingAffectedTarget =
  | {
      readonly kind: 'SubjectElementTarget';
      readonly subjectElementReferences: readonly SubjectElementReference[];
    }
  | {
      readonly kind: 'AssessmentSubjectTarget';
      readonly basisFingerprint: CorpusReviewBasisFingerprint;
    };

export function subjectElementTarget(
  subjectElementReferences: readonly SubjectElementReference[],
): FindingAffectedTarget {
  if (subjectElementReferences.length === 0) {
    throw new InvalidReviewDefinitionError('SubjectElementTarget requires at least one SubjectElementReference.');
  }

  const sorted = [...subjectElementReferences].sort((left, right) => left.compareTo(right));

  for (const reference of sorted) {
    if (!(reference instanceof SubjectElementReference)) {
      throw new InvalidReviewDefinitionError('SubjectElementTarget requires SubjectElementReference values.');
    }
  }

  for (let index = 1; index < sorted.length; index += 1) {
    if (sorted[index - 1]?.equals(sorted[index] as SubjectElementReference)) {
      throw new InvalidReviewDefinitionError('SubjectElementTarget cannot contain duplicate references.');
    }
  }

  return Object.freeze({
    kind: 'SubjectElementTarget',
    subjectElementReferences: Object.freeze(sorted),
  });
}

export function assessmentSubjectTarget(
  basisFingerprint: CorpusReviewBasisFingerprint,
): FindingAffectedTarget {
  if (!(basisFingerprint instanceof CorpusReviewBasisFingerprint)) {
    throw new InvalidReviewDefinitionError('AssessmentSubjectTarget requires a CorpusReviewBasisFingerprint.');
  }

  return Object.freeze({ kind: 'AssessmentSubjectTarget', basisFingerprint });
}
