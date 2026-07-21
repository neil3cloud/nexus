import { describe, expect, it } from 'vitest';

import {
  allSubjectElementsApplicability,
  canonicalizeAssessmentCriterionApplicability,
  exactSubjectElementSetApplicability,
  subjectElementsOfKindApplicability,
  subjectWideApplicability,
} from '../../../src/kernel/review/assessment-criterion-applicability';
import { InvalidReviewDefinitionError } from '../../../src/kernel/review/review.errors';
import {
  CanonicalSubjectElementKind,
  SubjectElementReference,
} from '../../../src/kernel/review/subject-element-reference';

describe('AssessmentCriterionApplicability', () => {
  it('constructs the four closed variants and canonicalizes them deterministically', () => {
    const sourceKind = CanonicalSubjectElementKind.fromString('Source');
    const second = SubjectElementReference.fromString('b');
    const first = SubjectElementReference.fromString('a');

    expect(allSubjectElementsApplicability()).toEqual({ kind: 'AllSubjectElements' });
    expect(subjectElementsOfKindApplicability(sourceKind).kind).toBe('SubjectElementsOfKind');
    expect(subjectWideApplicability()).toEqual({ kind: 'SubjectWide' });
    const exactSet = exactSubjectElementSetApplicability([second, first]);

    if (exactSet.kind !== 'ExactSubjectElementSet') {
      throw new Error('unexpected applicability variant');
    }

    expect(exactSet.subjectElementReferences.map(String)).toEqual(['a', 'b']);
    expect(canonicalizeAssessmentCriterionApplicability(exactSubjectElementSetApplicability([second, first]))).toBe(
      canonicalizeAssessmentCriterionApplicability(exactSubjectElementSetApplicability([first, second])),
    );
  });

  it('fails closed for malformed ExactSubjectElementSet and SubjectElementsOfKind declarations', () => {
    const reference = SubjectElementReference.fromString('artifact');

    expect(() => exactSubjectElementSetApplicability([])).toThrow(InvalidReviewDefinitionError);
    expect(() => exactSubjectElementSetApplicability([reference, reference])).toThrow(InvalidReviewDefinitionError);
    expect(() => subjectElementsOfKindApplicability(undefined as never)).toThrow(InvalidReviewDefinitionError);
    expect(() => canonicalizeAssessmentCriterionApplicability({ kind: 'Predicate' } as never)).toThrow(
      InvalidReviewDefinitionError,
    );
  });
});
