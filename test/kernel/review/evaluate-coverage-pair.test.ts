import { describe, expect, it } from 'vitest';

import { ConfidenceClassification } from '../../../src/kernel/evidence/confidence-classification';
import { EvidenceId } from '../../../src/kernel/evidence/evidence-id';
import { EvidenceVerificationStatus } from '../../../src/kernel/evidence/evidence-verification-status';
import { EvidenceVersion } from '../../../src/kernel/evidence/evidence-version';
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
  findingProducedDisposition,
  structuralSubjectElementDescriptor,
} from '../../../src/kernel/review/assessment-coverage';
import {
  baselinePreconditionFailure,
  evaluateCoveragePair,
  notExactContent,
  qualifiedDerivedContent,
  qualifiedSnapshotContent,
  resolvedBaseline,
  type StructuralEvidenceDescriptor,
} from '../../../src/kernel/review/evaluate-coverage-pair';
import {
  requiredEvidenceCount,
  requiredEvidenceType,
  requiredExactContent,
} from '../../../src/kernel/review/evidence-expectation';
import { InvalidReviewDefinitionError } from '../../../src/kernel/review/review.errors';
import {
  CanonicalSubjectElementKind,
  CorpusReviewBasisFingerprint,
  SubjectElementReference,
} from '../../../src/kernel/review/subject-element-reference';

describe('evaluateCoveragePair', () => {
  it('rejects structurally foreign pairs and evaluates selection from retained coverage state', () => {
    const coverage = openCoverage();
    const selectedPair = pairByCriterion(coverage, 'all');
    const foreignCoverage = openCoverage(CorpusReviewBasisFingerprint.fromString('other-basis'));
    const foreignPair = foreignCoverage.pairs.find((pair) => pair.kind === 'AssessmentSubjectPair');
    const unselectedPair = coverage.pairs.find(
      (pair) =>
        pair.kind === 'SubjectElementPair' &&
        pair.subjectElement.subjectElementReference.toString() === 'artifact-b' &&
        pair.assessmentCriterionId.toString() === 'exact',
    );

    if (foreignPair === undefined || unselectedPair === undefined) {
      throw new Error('fixture pair missing');
    }

    expect(() => evaluateCoveragePair(coverage, foreignPair, resolvedBaseline([evidence()]))).toThrow(
      InvalidReviewDefinitionError,
    );
    expect(evaluateCoveragePair(coverage, selectedPair, resolvedBaseline([evidence()])).kind).toBe('Satisfied');
    expect(evaluateCoveragePair(coverage, unselectedPair, resolvedBaseline([evidence()])).kind).toBe('NotApplicable');
  });

  it('returns FindingRequired with every expectation and threshold failure retained', () => {
    const coverage = openCoverage();
    const pair = pairByCriterion(coverage, 'strict');
    const outcome = evaluateCoveragePair(coverage, pair, resolvedBaseline([
      evidence({
        evidenceTypeIdentity: 'BuildOutput',
        confidenceClassification: ConfidenceClassification.fromString('Inferred'),
        evidenceVerificationStatus: EvidenceVerificationStatus.fromString('VerificationFailed'),
        exactContentQualification: notExactContent(),
      }),
    ]));

    expect(outcome.kind).toBe('FindingRequired');

    if (outcome.kind !== 'FindingRequired') {
      throw new Error('unexpected outcome');
    }

    expect(outcome.failures.map((failure) => failure.kind)).toEqual([
      'EvidenceExpectationMismatch',
      'EvidenceExpectationMismatch',
      'VerificationStatusThresholdFailure',
      'ConfidenceThresholdFailure',
    ]);
    expect(outcome.targetData.kind).toBe('SubjectElementTargetData');
  });

  it('returns UnableToEvaluate with structured precondition payloads', () => {
    const coverage = openCoverage();
    const pair = pairByCriterion(coverage, 'all');
    const reason = {
      kind: 'CrossMission' as const,
      offendingReference: evidenceReference('evidence-1', 1),
      expectedMissionId: 'mission-a',
      actualMissionId: 'mission-b',
    };

    expect(evaluateCoveragePair(coverage, pair, baselinePreconditionFailure(reason))).toEqual({
      kind: 'UnableToEvaluate',
      reason,
    });
    expect(() =>
      baselinePreconditionFailure({ kind: 'Ambiguous', conflictingReferences: [] }),
    ).toThrow(InvalidReviewDefinitionError);
  });

  it('matches exact-content qualifications and counts distinct EvidenceId/EvidenceVersion pairs', () => {
    const coverage = openCoverage();
    const snapshotPair = pairByCriterion(coverage, 'snapshot');
    const derivedPair = pairByCriterion(coverage, 'derived');
    const anyExactPair = pairByCriterion(coverage, 'any-exact');
    const countPair = pairByCriterion(coverage, 'count');

    expect(evaluateCoveragePair(coverage, snapshotPair, resolvedBaseline([evidence({
      exactContentQualification: qualifiedSnapshotContent(),
    })]))).toEqual({ kind: 'Satisfied' });
    expect(evaluateCoveragePair(coverage, derivedPair, resolvedBaseline([evidence({
      exactContentQualification: qualifiedDerivedContent(),
    })]))).toEqual({ kind: 'Satisfied' });
    expect(evaluateCoveragePair(coverage, anyExactPair, resolvedBaseline([evidence({
      exactContentQualification: qualifiedSnapshotContent(),
    })]))).toEqual({ kind: 'Satisfied' });
    expect(evaluateCoveragePair(coverage, anyExactPair, resolvedBaseline([evidence({
      exactContentQualification: qualifiedDerivedContent(),
    })]))).toEqual({ kind: 'Satisfied' });
    expect(evaluateCoveragePair(coverage, anyExactPair, resolvedBaseline([evidence({
      exactContentQualification: notExactContent(),
    })])).kind).toBe('FindingRequired');
    expect(evaluateCoveragePair(coverage, countPair, resolvedBaseline([
      evidence({ evidenceId: EvidenceId.fromString('evidence-1') }),
      evidence({ evidenceId: EvidenceId.fromString('evidence-2') }),
    ])).kind).toBe('Satisfied');
    expect(() => resolvedBaseline([
      evidence({ evidenceId: EvidenceId.fromString('evidence-1') }),
      evidence({ evidenceId: EvidenceId.fromString('evidence-1') }),
    ])).toThrow(InvalidReviewDefinitionError);
  });

  it('satisfies multiple RequiredEvidenceType clauses with different baseline evidence items', () => {
    const coverage = openCoverage();
    const pair = pairByCriterion(coverage, 'multi-type');

    expect(evaluateCoveragePair(coverage, pair, resolvedBaseline([
      evidence({
        evidenceId: EvidenceId.fromString('evidence-source'),
        evidenceTypeIdentity: 'RepositorySourceCode',
        evidenceTypeVersion: '1',
      }),
      evidence({
        evidenceId: EvidenceId.fromString('evidence-build'),
        evidenceTypeIdentity: 'BuildOutput',
        evidenceTypeVersion: '2',
      }),
    ]))).toEqual({ kind: 'Satisfied' });
  });

  it('keeps non-persistable evaluation outcomes separate from recordable dispositions', () => {
    const coverage = openCoverage();
    const pair = pairByCriterion(coverage, 'strict');
    const outcome = evaluateCoveragePair(coverage, pair, resolvedBaseline([evidence({
      evidenceTypeIdentity: 'BuildOutput',
    })]));

    expect(outcome.kind).toBe('FindingRequired');

    if (outcome.kind !== 'FindingRequired') {
      throw new Error('unexpected outcome');
    }

    // @ts-expect-error FindingRequired is not a CoverageDisposition.
    expect(() => coverage.recordDisposition(pair, outcome)).toThrow(InvalidReviewDefinitionError);
    expect(() => coverage.recordDisposition(pair, { kind: 'FindingRequired' } as never)).toThrow(
      InvalidReviewDefinitionError,
    );
    expect(coverage.recordDisposition(pair, findingProducedDisposition('finding-1')).getDisposition(pair)?.kind).toBe(
      'FindingProduced',
    );
  });
});

function openCoverage(basisFingerprint = CorpusReviewBasisFingerprint.fromString('basis')): AssessmentCoverage {
  return AssessmentCoverage.open(
    basisFingerprint,
    [
      structuralSubjectElementDescriptor({
        subjectElementReference: SubjectElementReference.fromString('artifact-a'),
        canonicalKind: CanonicalSubjectElementKind.fromString('Source'),
      }),
      structuralSubjectElementDescriptor({
        subjectElementReference: SubjectElementReference.fromString('artifact-b'),
        canonicalKind: CanonicalSubjectElementKind.fromString('Test'),
      }),
    ],
    criteriaSet(),
  );
}

function criteriaSet(): AssessmentCriteriaSet {
  return AssessmentCriteriaSet.create({
    identity: 'criteria',
    version: '1',
    criteria: [
      criterion('all', [requiredEvidenceType('RepositorySourceCode', '1')], allSubjectElementsApplicability()),
      criterion('strict', [
        requiredEvidenceType('RepositorySourceCode', '1'),
        requiredExactContent('SnapshotContent'),
      ], allSubjectElementsApplicability(), EvidenceVerificationStatus.fromString('Verified'), ConfidenceClassification.fromString('Observed')),
      criterion('snapshot', [requiredExactContent('SnapshotContent')], allSubjectElementsApplicability()),
      criterion('derived', [requiredExactContent('DerivedContent')], allSubjectElementsApplicability()),
      criterion('any-exact', [requiredExactContent('AnyExactContent')], allSubjectElementsApplicability()),
      criterion('count', [requiredEvidenceCount(2)], allSubjectElementsApplicability()),
      criterion('multi-type', [
        requiredEvidenceType('RepositorySourceCode', '1'),
        requiredEvidenceType('BuildOutput', '2'),
      ], allSubjectElementsApplicability()),
      criterion('exact', [requiredEvidenceType('RepositorySourceCode', '1')], exactSubjectElementSetApplicability([
        SubjectElementReference.fromString('artifact-a'),
      ])),
      criterion('wide', [requiredEvidenceType('RepositorySourceCode', '1')], subjectWideApplicability()),
    ],
  });
}

function criterion(
  id: string,
  expectations: Parameters<typeof AssessmentCriterion.create>[0]['evidenceExpectations'],
  applicability: Parameters<typeof AssessmentCriterion.create>[0]['applicability'],
  verificationStatusThreshold = EvidenceVerificationStatus.fromString('Unverified'),
  confidenceThreshold = ConfidenceClassification.fromString('Inferred'),
): AssessmentCriterion {
  return AssessmentCriterion.create({
    id: AssessmentCriterionId.fromString(id),
    inlineDefinition: `definition ${id}`,
    applicability,
    supportingAuthorityReferences: ['authority'],
    evidenceExpectations: expectations,
    verificationStatusThreshold,
    confidenceThreshold,
  });
}

function pairByCriterion(coverage: AssessmentCoverage, criterionId: string) {
  const pair = coverage.pairs.find((candidate) => candidate.assessmentCriterionId.toString() === criterionId);

  if (pair === undefined) {
    throw new Error(`criterion '${criterionId}' pair missing`);
  }

  return pair;
}

function evidence(overrides: Partial<StructuralEvidenceDescriptor> = {}): StructuralEvidenceDescriptor {
  return {
    evidenceId: EvidenceId.fromString('evidence-1'),
    evidenceVersion: EvidenceVersion.fromNumber(1),
    evidenceTypeIdentity: 'RepositorySourceCode',
    evidenceTypeVersion: '1',
    confidenceClassification: ConfidenceClassification.fromString('Verified'),
    evidenceVerificationStatus: EvidenceVerificationStatus.fromString('Verified'),
    exactContentQualification: qualifiedSnapshotContent(),
    ...overrides,
  };
}

function evidenceReference(evidenceId: string, evidenceVersion: number) {
  return {
    evidenceId: EvidenceId.fromString(evidenceId),
    evidenceVersion: EvidenceVersion.fromNumber(evidenceVersion),
  };
}
