import { describe, expect, it } from 'vitest';

import {
  assessmentSubjectTarget,
  subjectElementTarget,
} from '../../../src/kernel/review/finding-affected-target';
import { InvalidReviewDefinitionError } from '../../../src/kernel/review/review.errors';
import {
  CorpusReviewBasisFingerprint,
  SubjectElementReference,
} from '../../../src/kernel/review/subject-element-reference';

describe('FindingAffectedTarget', () => {
  it('constructs closed target variants with deterministic subject-element ordering', () => {
    const target = subjectElementTarget([
      SubjectElementReference.fromString('b'),
      SubjectElementReference.fromString('a'),
    ]);

    expect(target.kind).toBe('SubjectElementTarget');

    if (target.kind !== 'SubjectElementTarget') {
      throw new Error('unexpected target');
    }

    expect(target.subjectElementReferences.map(String)).toEqual(['a', 'b']);
    expect(assessmentSubjectTarget(CorpusReviewBasisFingerprint.fromString('basis')).kind).toBe(
      'AssessmentSubjectTarget',
    );
  });

  it('fails closed on zero, duplicate, or malformed target declarations', () => {
    const reference = SubjectElementReference.fromString('artifact');

    expect(() => subjectElementTarget([])).toThrow(InvalidReviewDefinitionError);
    expect(() => subjectElementTarget([reference, reference])).toThrow(InvalidReviewDefinitionError);
    expect(() => assessmentSubjectTarget(undefined as never)).toThrow(InvalidReviewDefinitionError);
  });
});
