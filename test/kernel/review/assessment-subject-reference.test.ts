import { describe, expect, it } from 'vitest';

import {
  assessmentSubjectReferenceFromSnapshot,
  corpusReviewBasisSubject,
  executableMissionPlanSubject,
  proposedPlanRevisionSubject,
} from '../../../src/kernel/review/assessment-subject-reference';
import { InvalidReviewDefinitionError } from '../../../src/kernel/review/review.errors';
import { CorpusReviewBasisFingerprint } from '../../../src/kernel/review/subject-element-reference';

describe('AssessmentSubjectReference', () => {
  it('constructs exactly the three RFC-0006 v1.3 discriminants', () => {
    expect(executableMissionPlanSubject('revision-1')).toEqual({
      kind: 'ExecutableMissionPlan',
      revisionId: 'revision-1',
    });
    expect(proposedPlanRevisionSubject('proposal-1')).toEqual({
      kind: 'ProposedPlanRevision',
      revisionId: 'proposal-1',
    });
    expect(corpusReviewBasisSubject(CorpusReviewBasisFingerprint.fromString('basis-1')).kind).toBe('CorpusReviewBasis');
  });

  it('preserves existing plan-revision wire values without importing ReviewPlanRevisionReference', () => {
    expect(assessmentSubjectReferenceFromSnapshot({ kind: 'ExecutableMissionPlan', revisionId: 'plan-1' })).toEqual({
      kind: 'ExecutableMissionPlan',
      revisionId: 'plan-1',
    });
    expect(assessmentSubjectReferenceFromSnapshot({ kind: 'ProposedPlanRevision', revisionId: 'plan-2' })).toEqual({
      kind: 'ProposedPlanRevision',
      revisionId: 'plan-2',
    });
  });

  it('fails closed on empty CorpusReviewBasis fingerprints, empty revisions, and unknown discriminants', () => {
    expect(() => executableMissionPlanSubject(' ')).toThrow(InvalidReviewDefinitionError);
    expect(() => corpusReviewBasisSubject(' ')).toThrow(InvalidReviewDefinitionError);
    expect(() =>
      assessmentSubjectReferenceFromSnapshot({ kind: 'Other', revisionId: 'x' } as never),
    ).toThrow(InvalidReviewDefinitionError);
  });
});
