import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { CorpusArtifactKind } from '../../../src/kernel/corpus-review/corpus-artifact-kind';
import { CorpusArtifactReference } from '../../../src/kernel/corpus-review/corpus-artifact-reference';
import {
  DuplicateCanonicalCorpusArtifactIdentityException,
  DuplicateCorpusArtifactReferenceIdException,
  EmptyCorpusReviewScopeException,
} from '../../../src/kernel/corpus-review/corpus-review.errors';
import { CorpusReviewScope } from '../../../src/kernel/corpus-review/corpus-review-scope';
import { Evidence } from '../../../src/kernel/evidence/evidence.aggregate';

describe('CorpusReviewScope', () => {
  it('rejects empty scope, duplicate ids, and duplicate canonical exact identities within the scope', () => {
    const first = reference('reference-1', 'artifact-a', digestFor('rev-1'), 'RFC');
    const duplicateId = reference('reference-1', 'artifact-b', digestFor('rev-2'), 'Canon');
    const duplicateIdentity = reference('reference-2', 'artifact-a', digestFor('rev-1'), 'RFC');

    expect(() => CorpusReviewScope.create({ references: [] })).toThrow(
      EmptyCorpusReviewScopeException,
    );
    expect(() =>
      CorpusReviewScope.create({ references: [first, duplicateId] }),
    ).toThrow(DuplicateCorpusArtifactReferenceIdException);
    expect(() =>
      CorpusReviewScope.create({ references: [first, duplicateIdentity] }),
    ).toThrow(DuplicateCanonicalCorpusArtifactIdentityException);
  });

  it('accepts the same artifactId with different contentDigest as distinct exact revisions', () => {
    const scope = CorpusReviewScope.create({
      references: [
        reference('reference-1', 'artifact-a', digestFor('rev-1'), 'RFC'),
        reference('reference-2', 'artifact-a', digestFor('rev-2'), 'RFC'),
      ],
    });

    expect(scope.references).toHaveLength(2);
  });

  it('computes an order-irrelevant fingerprint from canonical exact identities only', () => {
    const first = reference('reference-1', 'artifact-a', digestFor('rev-1'), 'RFC', 'old/path.md');
    const second = reference('reference-2', 'artifact-b', digestFor('rev-2'), 'Canon');
    const baseline = CorpusReviewScope.create({ references: [first, second] });
    const reordered = CorpusReviewScope.create({ references: [second, first] });
    const changedRecordIdAndLocator = CorpusReviewScope.create({
      references: [
        reference('changed-id', 'artifact-a', digestFor('rev-1'), 'RFC', 'new/path.md'),
        second,
      ],
    });

    expect(baseline.fingerprint).toBe(reordered.fingerprint);
    expect(baseline.fingerprint).toBe(changedRecordIdAndLocator.fingerprint);
    expect(baseline.fingerprint).toMatch(/^[0-9a-f]{64}$/u);
    expect(
      CorpusReviewScope.create({
        references: [reference('reference-1', 'artifact-c', digestFor('rev-1'), 'RFC'), second],
      }).fingerprint,
    ).not.toBe(baseline.fingerprint);
    expect(
      CorpusReviewScope.create({
        references: [reference('reference-1', 'artifact-a', digestFor('rev-1'), 'ADR'), second],
      }).fingerprint,
    ).not.toBe(baseline.fingerprint);
    expect(
      CorpusReviewScope.create({
        references: [reference('reference-1', 'artifact-a', digestFor('rev-3'), 'RFC'), second],
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

function digestFor(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}
