import { describe, expect, it } from 'vitest';

import { ConfidenceClassification } from '../../../src/kernel/evidence/confidence-classification';
import { EvidenceVerificationStatus } from '../../../src/kernel/evidence/evidence-verification-status';
import {
  exactSubjectElementSetApplicability,
  subjectElementsOfKindApplicability,
} from '../../../src/kernel/review/assessment-criterion-applicability';
import {
  AssessmentCriteriaSet,
  AssessmentCriterion,
  AssessmentCriterionId,
} from '../../../src/kernel/review/assessment-criterion';
import { requiredEvidenceCount, requiredEvidenceType } from '../../../src/kernel/review/evidence-expectation';
import { InvalidReviewDefinitionError } from '../../../src/kernel/review/review.errors';
import {
  CanonicalSubjectElementKind,
  SubjectElementReference,
} from '../../../src/kernel/review/subject-element-reference';

describe('AssessmentCriterion and AssessmentCriteriaSet', () => {
  it('enforces non-empty criteria sets, duplicate ids, and inline/reference XOR', () => {
    const criterion = inlineCriterion('criterion-1');

    expect(() => AssessmentCriteriaSet.create({ identity: 'set', version: '1', criteria: [] })).toThrow(
      InvalidReviewDefinitionError,
    );
    expect(() => AssessmentCriteriaSet.create({ identity: 'set', version: '1', criteria: [criterion, criterion] })).toThrow(
      InvalidReviewDefinitionError,
    );
    expect(() =>
      AssessmentCriterion.create({
        ...criterionInput('criterion-2'),
        inlineDefinition: 'definition',
        exactReference: exactReference(),
      }),
    ).toThrow(InvalidReviewDefinitionError);
    expect(() =>
      AssessmentCriterion.create(criterionInput('criterion-3')),
    ).toThrow(InvalidReviewDefinitionError);
  });

  it('canonicalizes inline definitions using NFC, LF, and outer-trim while preserving internal whitespace', () => {
    const composed = AssessmentCriteriaSet.create({
      identity: 'set',
      version: '1',
      criteria: [inlineCriterion('criterion', ' Cafe\u0301\r\nrule ')],
    });
    const normalized = AssessmentCriteriaSet.create({
      identity: 'set',
      version: '1',
      criteria: [inlineCriterion('criterion', 'Café\nrule')],
    });
    const changedInternalWhitespace = AssessmentCriteriaSet.create({
      identity: 'set',
      version: '1',
      criteria: [inlineCriterion('criterion', 'Café\n rule')],
    });

    expect(composed.fingerprint).toBe(normalized.fingerprint);
    expect(composed.fingerprint).not.toBe(changedInternalWhitespace.fingerprint);
  });

  it('produces order-independent fingerprints and changes for each governed fingerprint input', () => {
    const first = inlineCriterion('a');
    const second = AssessmentCriterion.create({
      ...criterionInput('b'),
      inlineDefinition: 'definition',
      evidenceExpectations: [requiredEvidenceType('ArchitectureDocument', '1')],
    });
    const baseline = AssessmentCriteriaSet.create({ identity: 'set', version: '1', criteria: [first, second] });
    const reversed = AssessmentCriteriaSet.create({ identity: 'set', version: '1', criteria: [second, first] });

    expect(baseline.fingerprint).toBe(reversed.fingerprint);
    expect(baseline.fingerprint).toMatch(/^[0-9a-f]{64}$/u);
    expect(
      AssessmentCriteriaSet.create({
        identity: 'set',
        version: '1',
        criteria: [inlineCriterion('a-changed'), second],
      }).fingerprint,
    ).not.toBe(baseline.fingerprint);
    expect(
      AssessmentCriteriaSet.create({
        identity: 'set',
        version: '1',
        criteria: [inlineCriterion('a', 'changed definition'), second],
      }).fingerprint,
    ).not.toBe(baseline.fingerprint);
    expect(
      AssessmentCriteriaSet.create({
        identity: 'set',
        version: '1',
        criteria: [
          AssessmentCriterion.create({
            ...criterionInput('a'),
            inlineDefinition: 'definition',
            applicability: subjectElementsOfKindApplicability(CanonicalSubjectElementKind.fromString('Source')),
          }),
          second,
        ],
      }).fingerprint,
    ).not.toBe(baseline.fingerprint);
    expect(
      AssessmentCriteriaSet.create({
        identity: 'set',
        version: '1',
        criteria: [
          AssessmentCriterion.create({
            ...criterionInput('a'),
            inlineDefinition: 'definition',
            supportingAuthorityReferences: ['authority-2'],
          }),
          second,
        ],
      }).fingerprint,
    ).not.toBe(baseline.fingerprint);
    expect(
      AssessmentCriteriaSet.create({
        identity: 'set',
        version: '1',
        criteria: [
          AssessmentCriterion.create({
            ...criterionInput('a'),
            inlineDefinition: 'definition',
            evidenceExpectations: [requiredEvidenceCount(2)],
          }),
          second,
        ],
      }).fingerprint,
    ).not.toBe(baseline.fingerprint);
    expect(
      AssessmentCriteriaSet.create({
        identity: 'set',
        version: '1',
        criteria: [
          AssessmentCriterion.create({
            ...criterionInput('a'),
            inlineDefinition: 'definition',
            verificationStatusThreshold: EvidenceVerificationStatus.fromString('Verified'),
          }),
          second,
        ],
      }).fingerprint,
    ).not.toBe(baseline.fingerprint);
    expect(
      AssessmentCriteriaSet.create({
        identity: 'set',
        version: '1',
        criteria: [
          AssessmentCriterion.create({
            ...criterionInput('a'),
            inlineDefinition: 'definition',
            confidenceThreshold: ConfidenceClassification.fromString('Verified'),
          }),
          second,
        ],
      }).fingerprint,
    ).not.toBe(baseline.fingerprint);
  });

  it('validates exact immutable criterion reference tuple structure without resolving it', () => {
    expect(
      AssessmentCriterion.create({
        ...criterionInput('reference-criterion'),
        exactReference: exactReference(),
      }).exactReference?.supportingAuthorityReferences,
    ).toEqual(['authority-a']);
    expect(() =>
      AssessmentCriterion.create({
        ...criterionInput('broken-reference'),
        exactReference: { ...exactReference(), ownerArtifactVersion: '' },
      }),
    ).toThrow(InvalidReviewDefinitionError);
  });
});

function inlineCriterion(id: string, definition = 'definition'): AssessmentCriterion {
  return AssessmentCriterion.create({
    ...criterionInput(id),
    inlineDefinition: definition,
  });
}

function criterionInput(id: string): Omit<Parameters<typeof AssessmentCriterion.create>[0], 'inlineDefinition' | 'exactReference'> {
  return {
    id: AssessmentCriterionId.fromString(id),
    applicability: exactSubjectElementSetApplicability([SubjectElementReference.fromString('artifact-1')]),
    supportingAuthorityReferences: ['authority-1'],
    evidenceExpectations: [requiredEvidenceType('RepositorySourceCode', '1')],
    verificationStatusThreshold: EvidenceVerificationStatus.fromString('Unverified'),
    confidenceThreshold: ConfidenceClassification.fromString('Observed'),
  };
}

function exactReference(): {
  readonly owningArtifactType: string;
  readonly criterionIdentity: string;
  readonly ownerArtifactIdentity: string;
  readonly ownerArtifactVersion: string;
  readonly criterionContentFingerprint: string;
  readonly supportingAuthorityReferences: readonly string[];
} {
  return {
    owningArtifactType: 'RFC',
    criterionIdentity: 'criterion',
    ownerArtifactIdentity: 'RFC-0006',
    ownerArtifactVersion: 'v1.3',
    criterionContentFingerprint: 'fingerprint',
    supportingAuthorityReferences: ['authority-a'],
  };
}
