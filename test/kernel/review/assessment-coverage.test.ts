import { describe, expect, it } from 'vitest';

import { ConfidenceClassification } from '../../../src/kernel/evidence/confidence-classification';
import { EvidenceVerificationStatus } from '../../../src/kernel/evidence/evidence-verification-status';
import {
  allSubjectElementsApplicability,
  exactSubjectElementSetApplicability,
  subjectWideApplicability,
} from '../../../src/kernel/review/assessment-criterion-applicability';
import {
  AssessmentCriteriaSet,
  AssessmentCriterion,
  AssessmentCriterionId,
} from '../../../src/kernel/review/assessment-criterion';
import {
  AssessmentCoverage,
  assessmentCoveragePairKey,
  findingProducedDisposition,
  notApplicableDisposition,
  satisfiedDisposition,
  structuralSubjectElementDescriptor,
} from '../../../src/kernel/review/assessment-coverage';
import { requiredEvidenceCount } from '../../../src/kernel/review/evidence-expectation';
import { InvalidReviewDefinitionError } from '../../../src/kernel/review/review.errors';
import {
  CanonicalSubjectElementKind,
  CorpusReviewBasisFingerprint,
  SubjectElementReference,
} from '../../../src/kernel/review/subject-element-reference';

describe('AssessmentCoverage', () => {
  it('opens a deterministic universe of element and subject-wide pairs', () => {
    const coverage = openFixtureCoverage();

    expect(coverage.pairs.map((pair) => pair.kind)).toEqual([
      'SubjectElementPair',
      'SubjectElementPair',
      'SubjectElementPair',
      'SubjectElementPair',
      'AssessmentSubjectPair',
    ]);
    expect(coverage.pairs.map(assessmentCoveragePairKey)).toEqual([
      'SubjectElementPair\u001fartifact-a\u001fSource\u001fall',
      'SubjectElementPair\u001fartifact-a\u001fSource\u001fexact',
      'SubjectElementPair\u001fartifact-b\u001fTest\u001fall',
      'SubjectElementPair\u001fartifact-b\u001fTest\u001fexact',
      'AssessmentSubjectPair\u001fbasis\u001fwide',
    ]);
    expect(coverage.pairs.filter((pair) => pair.kind === 'AssessmentSubjectPair')[0]?.kind).toBe('AssessmentSubjectPair');
  });

  it('uses the Basis fingerprint in subject-wide pairs and keeps the universe distinct when it changes', () => {
    const first = openFixtureCoverage(CorpusReviewBasisFingerprint.fromString('basis-a'));
    const second = openFixtureCoverage(CorpusReviewBasisFingerprint.fromString('basis-b'));

    expect(first.pairs.find((pair) => pair.kind === 'AssessmentSubjectPair')).not.toEqual(
      second.pairs.find((pair) => pair.kind === 'AssessmentSubjectPair'),
    );
  });

  it('fails closed on duplicate subject elements and immutable duplicate dispositions', () => {
    const descriptor = element('artifact-a', 'Source');
    const criteria = criteriaSet();

    expect(() =>
      AssessmentCoverage.open(CorpusReviewBasisFingerprint.fromString('basis'), [descriptor, descriptor], criteria),
    ).toThrow(InvalidReviewDefinitionError);

    const coverage = openFixtureCoverage();
    const pair = coverage.pairs[0];

    if (pair === undefined) {
      throw new Error('fixture pair missing');
    }

    const dispositioned = coverage.recordDisposition(pair, satisfiedDisposition());
    expect(dispositioned).not.toBe(coverage);
    expect(coverage.getDisposition(pair)).toBeUndefined();
    expect(dispositioned.getDisposition(pair)?.kind).toBe('Satisfied');
    expect(() => dispositioned.recordDisposition(pair, satisfiedDisposition())).toThrow(InvalidReviewDefinitionError);
  });

  it('enforces NotApplicable and FindingProduced structural restrictions', () => {
    const coverage = openFixtureCoverage();
    const selectedPair = coverage.pairs.find(
      (pair) =>
        pair.kind === 'SubjectElementPair' &&
        pair.subjectElement.subjectElementReference.toString() === 'artifact-a' &&
        pair.assessmentCriterionId.toString() === 'exact',
    );
    const unselectedPair = coverage.pairs.find(
      (pair) =>
        pair.kind === 'SubjectElementPair' &&
        pair.subjectElement.subjectElementReference.toString() === 'artifact-b' &&
        pair.assessmentCriterionId.toString() === 'exact',
    );
    const subjectPair = coverage.pairs.find((pair) => pair.kind === 'AssessmentSubjectPair');

    if (selectedPair === undefined || unselectedPair === undefined || subjectPair === undefined) {
      throw new Error('fixture pair missing');
    }

    expect(() =>
      coverage.recordDisposition(selectedPair, notApplicableDisposition({
        pair: selectedPair,
        explanation: 'not selected',
        applicability: coverage.getCriterionForPair(selectedPair).applicability,
      })),
    ).toThrow(InvalidReviewDefinitionError);
    expect(
      coverage.recordDisposition(unselectedPair, notApplicableDisposition({
        pair: unselectedPair,
        explanation: 'criterion applies only to artifact-a',
        applicability: coverage.getCriterionForPair(unselectedPair).applicability,
      })).getDisposition(unselectedPair)?.kind,
    ).toBe('NotApplicable');
    expect(() =>
      coverage.recordDisposition(subjectPair, notApplicableDisposition({
        pair: subjectPair,
        explanation: 'subject pairs are selected by construction',
        applicability: coverage.getCriterionForPair(subjectPair).applicability,
      })),
    ).toThrow(InvalidReviewDefinitionError);
    expect(() => coverage.recordDisposition(subjectPair, findingProducedDisposition(' '))).toThrow(
      InvalidReviewDefinitionError,
    );
  });

  it('rejects NotApplicable dispositions with substituted applicability declarations', () => {
    const coverage = openFixtureCoverage();
    const unselectedPair = coverage.pairs.find(
      (pair) =>
        pair.kind === 'SubjectElementPair' &&
        pair.subjectElement.subjectElementReference.toString() === 'artifact-b' &&
        pair.assessmentCriterionId.toString() === 'exact',
    );

    if (unselectedPair === undefined) {
      throw new Error('fixture pair missing');
    }

    expect(() =>
      coverage.recordDisposition(unselectedPair, notApplicableDisposition({
        pair: unselectedPair,
        explanation: 'substituted applicability must fail closed',
        applicability: allSubjectElementsApplicability(),
      })),
    ).toThrow(InvalidReviewDefinitionError);
    expect(
      coverage.recordDisposition(unselectedPair, notApplicableDisposition({
        pair: unselectedPair,
        explanation: 'actual exact-set applicability does not select artifact-b',
        applicability: coverage.getCriterionForPair(unselectedPair).applicability,
      })).getDisposition(unselectedPair)?.kind,
    ).toBe('NotApplicable');
  });

  it('reports incomplete coverage until every pair has exactly one disposition', () => {
    let coverage = openFixtureCoverage();

    expect(coverage.isComplete()).toBe(false);

    for (const pair of coverage.pairs) {
      if (
        pair.kind === 'SubjectElementPair' &&
        pair.assessmentCriterionId.toString() === 'exact' &&
        pair.subjectElement.subjectElementReference.toString() === 'artifact-b'
      ) {
        coverage = coverage.recordDisposition(pair, notApplicableDisposition({
          pair,
          explanation: 'not selected by exact-set applicability',
          applicability: coverage.getCriterionForPair(pair).applicability,
        }));
      } else {
        coverage = coverage.recordDisposition(pair, satisfiedDisposition());
      }
    }

    expect(coverage.isComplete()).toBe(true);
  });
});

function openFixtureCoverage(basisFingerprint = CorpusReviewBasisFingerprint.fromString('basis')): AssessmentCoverage {
  return AssessmentCoverage.open(
    basisFingerprint,
    [element('artifact-b', 'Test'), element('artifact-a', 'Source')],
    criteriaSet(),
  );
}

function element(reference: string, kind: string) {
  return structuralSubjectElementDescriptor({
    subjectElementReference: SubjectElementReference.fromString(reference),
    canonicalKind: CanonicalSubjectElementKind.fromString(kind),
  });
}

function criteriaSet(): AssessmentCriteriaSet {
  return AssessmentCriteriaSet.create({
    identity: 'criteria',
    version: '1',
    criteria: [
      criterion('exact', exactSubjectElementSetApplicability([SubjectElementReference.fromString('artifact-a')])),
      criterion('all', allSubjectElementsApplicability()),
      criterion('wide', subjectWideApplicability()),
    ],
  });
}

function criterion(id: string, applicability: Parameters<typeof AssessmentCriterion.create>[0]['applicability']) {
  return AssessmentCriterion.create({
    id: AssessmentCriterionId.fromString(id),
    inlineDefinition: `definition ${id}`,
    applicability,
    supportingAuthorityReferences: ['authority'],
    evidenceExpectations: [requiredEvidenceCount(1)],
    verificationStatusThreshold: EvidenceVerificationStatus.fromString('Unverified'),
    confidenceThreshold: ConfidenceClassification.fromString('Observed'),
  });
}
