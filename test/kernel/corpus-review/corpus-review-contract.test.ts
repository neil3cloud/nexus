import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { CorpusArtifactKind } from '../../../src/kernel/corpus-review/corpus-artifact-kind';
import { CorpusArtifactReference } from '../../../src/kernel/corpus-review/corpus-artifact-reference';
import {
  DuplicateCanonicalCorpusArtifactIdentityException,
  DuplicateCorpusArtifactReferenceIdException,
  EmptyCorpusReviewContractException,
  IneligibleCorpusReviewContractArtifactKindException,
  InvalidCorpusArtifactKindException,
} from '../../../src/kernel/corpus-review/corpus-review.errors';
import { CorpusReviewContract } from '../../../src/kernel/corpus-review/corpus-review-contract';
import { ConfidenceClassification } from '../../../src/kernel/evidence/confidence-classification';
import { Evidence } from '../../../src/kernel/evidence/evidence.aggregate';
import { EvidenceVerificationStatus } from '../../../src/kernel/evidence/evidence-verification-status';
import { exactSubjectElementSetApplicability } from '../../../src/kernel/review/assessment-criterion-applicability';
import {
  AssessmentCriteriaSet,
  AssessmentCriterion,
  AssessmentCriterionId,
} from '../../../src/kernel/review/assessment-criterion';
import { requiredEvidenceType } from '../../../src/kernel/review/evidence-expectation';
import { SubjectElementReference } from '../../../src/kernel/review/subject-element-reference';

describe('CorpusReviewContract', () => {
  it('rejects empty contract, non-authority kinds, Other, duplicate ids, and duplicate exact identities', () => {
    const first = reference('reference-1', 'authority-a', digestFor('rev-1'), 'RFC');
    const duplicateId = reference('reference-1', 'authority-b', digestFor('rev-2'), 'Canon');
    const duplicateIdentity = reference('reference-2', 'authority-a', digestFor('rev-1'), 'RFC');

    expect(() =>
      CorpusReviewContract.create({ authorityReferences: [], assessmentCriteriaSet: criteriaSet() }),
    ).toThrow(EmptyCorpusReviewContractException);
    expect(() =>
      CorpusReviewContract.create({
        authorityReferences: [
          reference('reference-3', 'implementation-plan', digestFor('plan'), 'ImplementationPlan'),
        ],
        assessmentCriteriaSet: criteriaSet(),
      }),
    ).toThrow(IneligibleCorpusReviewContractArtifactKindException);
    expect(() => CorpusArtifactKind.fromString('Other')).toThrow(
      InvalidCorpusArtifactKindException,
    );
    expect(() =>
      CorpusReviewContract.create({
        authorityReferences: [first, duplicateId],
        assessmentCriteriaSet: criteriaSet(),
      }),
    ).toThrow(DuplicateCorpusArtifactReferenceIdException);
    expect(() =>
      CorpusReviewContract.create({
        authorityReferences: [first, duplicateIdentity],
        assessmentCriteriaSet: criteriaSet(),
      }),
    ).toThrow(DuplicateCanonicalCorpusArtifactIdentityException);
  });

  it('stores the derived AssessmentCriteriaSet reference without fingerprint participation', () => {
    const authority = reference('reference-1', 'rfc-0013', digestFor('rfc'), 'RFC');
    const firstCriteriaSet = criteriaSet('criteria-a', '1', 'criterion-a');
    const secondCriteriaSet = criteriaSet('criteria-b', '2', 'criterion-b');
    const first = CorpusReviewContract.create({
      authorityReferences: [authority],
      assessmentCriteriaSet: firstCriteriaSet,
    });
    const second = CorpusReviewContract.create({
      authorityReferences: [authority],
      assessmentCriteriaSet: secondCriteriaSet,
    });

    expect(first.assessmentCriteriaSetReference).toEqual({
      identity: firstCriteriaSet.identity,
      version: firstCriteriaSet.version,
      fingerprint: firstCriteriaSet.fingerprint,
    });
    expect(first.assessmentCriteriaSetReference).not.toEqual(
      second.assessmentCriteriaSetReference,
    );
    expect(first.fingerprint).toBe(second.fingerprint);
  });

  it('computes an order-irrelevant authority-reference fingerprint from canonical exact identities only', () => {
    const first = reference('reference-1', 'authority-a', digestFor('rev-1'), 'RFC', 'old/path.md');
    const second = reference('reference-2', 'authority-b', digestFor('rev-2'), 'Canon');
    const baseline = CorpusReviewContract.create({
      authorityReferences: [first, second],
      assessmentCriteriaSet: criteriaSet(),
    });
    const reordered = CorpusReviewContract.create({
      authorityReferences: [second, first],
      assessmentCriteriaSet: criteriaSet(),
    });
    const changedRecordIdAndLocator = CorpusReviewContract.create({
      authorityReferences: [
        reference('changed-id', 'authority-a', digestFor('rev-1'), 'RFC', 'new/path.md'),
        second,
      ],
      assessmentCriteriaSet: criteriaSet(),
    });

    expect(baseline.fingerprint).toBe(reordered.fingerprint);
    expect(baseline.fingerprint).toBe(changedRecordIdAndLocator.fingerprint);
    expect(baseline.fingerprint).toMatch(/^[0-9a-f]{64}$/u);
    expect(
      CorpusReviewContract.create({
        authorityReferences: [
          reference('reference-1', 'authority-c', digestFor('rev-1'), 'RFC'),
          second,
        ],
        assessmentCriteriaSet: criteriaSet(),
      }).fingerprint,
    ).not.toBe(baseline.fingerprint);
    expect(
      CorpusReviewContract.create({
        authorityReferences: [
          reference('reference-1', 'authority-a', digestFor('rev-1'), 'ADR'),
          second,
        ],
        assessmentCriteriaSet: criteriaSet(),
      }).fingerprint,
    ).not.toBe(baseline.fingerprint);
    expect(
      CorpusReviewContract.create({
        authorityReferences: [
          reference('reference-1', 'authority-a', digestFor('rev-3'), 'RFC'),
          second,
        ],
        assessmentCriteriaSet: criteriaSet(),
      }).fingerprint,
    ).not.toBe(baseline.fingerprint);
  });
});

function reference(
  referenceId: string,
  contentId: string,
  contentDigest: string,
  kind: string,
  locator?: string,
): CorpusArtifactReference {
  return CorpusArtifactReference.create({
    corpusArtifactReferenceId: referenceId,
    artifactKind: CorpusArtifactKind.fromString(kind),
    evidence: evidence(referenceId, contentId, contentDigest),
    ...(locator === undefined ? {} : { locator }),
  });
}

function evidence(id: string, contentId: string, contentDigest: string): Evidence {
  return Evidence.register({
    id: `evidence-${id}`,
    type: 'ArchitectureDocument',
    version: 1,
    hash: `sha256:${id}`,
    metadata: {
      capturedAt: '2026-07-22T00:00:00.000Z',
    },
    confidenceClassification: 'Verified',
    provenance: {
      source: 'vitest',
      acquisitionMethod: 'test-fixture',
      acquiredAt: '2026-07-22T00:00:00.000Z',
      actor: 'builder',
      system: 'nexus',
      verificationStatus: 'Verified',
      verificationStatusSemantics: 'EvidenceVerificationStatus/v1',
    },
    exactContent: {
      representedContentReference: {
        contentOwner: 'nexus',
        contentType: 'RepositoryArtifact',
        contentId,
        contentRevision: 'revision-1',
        evidenceTypeIdentity: 'EvidenceType/RepositoryArtifact',
        evidenceTypeVersion: '1',
      },
      contentRepresentation: 'SnapshotContent',
      contentDigestAlgorithm: 'SHA-256',
      contentDigest,
    },
  });
}

function criteriaSet(identity = 'criteria-set', version = '1', criterionId = 'criterion'): AssessmentCriteriaSet {
  return AssessmentCriteriaSet.create({
    identity,
    version,
    criteria: [
      AssessmentCriterion.create({
        id: AssessmentCriterionId.fromString(criterionId),
        inlineDefinition: `Definition for ${criterionId}`,
        applicability: exactSubjectElementSetApplicability([
          SubjectElementReference.fromString('artifact-1'),
        ]),
        supportingAuthorityReferences: ['authority-1'],
        evidenceExpectations: [requiredEvidenceType('ArchitectureDocument', '1')],
        verificationStatusThreshold: EvidenceVerificationStatus.fromString('Verified'),
        confidenceThreshold: ConfidenceClassification.fromString('Observed'),
      }),
    ],
  });
}

function digestFor(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}
