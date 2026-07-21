import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { CorpusArtifactKind } from '../../../src/kernel/corpus-review/corpus-artifact-kind';
import { CorpusArtifactReference } from '../../../src/kernel/corpus-review/corpus-artifact-reference';
import {
  InvalidCorpusArtifactKindException,
  InvalidCorpusArtifactReferenceException,
  MissingExactContentEvidenceException,
} from '../../../src/kernel/corpus-review/corpus-review.errors';
import { Evidence } from '../../../src/kernel/evidence/evidence.aggregate';

describe('CorpusArtifactReference', () => {
  it('derives every exact identity field from caller-supplied Exact Content Evidence', () => {
    const sourceEvidence = evidence({
      evidenceId: 'evidence-1',
      evidenceVersion: 2,
      contentId: 'knowledge/specifications/rfc-0013.md',
      contentRevision: 'rev-1',
      contentDigest: digestFor('rfc-0013-rev-1'),
    });

    const reference = CorpusArtifactReference.create({
      corpusArtifactReferenceId: 'reference-1',
      artifactKind: CorpusArtifactKind.fromString('RFC'),
      evidence: sourceEvidence,
      locator: 'knowledge/specifications/rfc-0013.md',
    });

    expect(reference.artifactId).toBe('knowledge/specifications/rfc-0013.md');
    expect(reference.evidenceId).toBe('evidence-1');
    expect(reference.evidenceVersion).toBe(2);
    expect(reference.contentDigest).toBe(digestFor('rfc-0013-rev-1'));
    expect(reference.representedContentReference).toBe(
      sourceEvidence.exactContent.representedContentReference,
    );
    expect(reference.representedContentReference.contentRevision).toBe('rev-1');
    expect(reference.canonicalExactIdentity()).toEqual({
      artifactId: 'knowledge/specifications/rfc-0013.md',
      canonicalArtifactKindKey: 'RFC',
      contentDigest: digestFor('rfc-0013-rev-1'),
    });
  });

  it('fails closed for missing Exact Content Evidence, empty ids, and invalid artifact kinds', () => {
    expect(() =>
      CorpusArtifactReference.create({
        corpusArtifactReferenceId: 'reference-1',
        artifactKind: CorpusArtifactKind.fromString('RFC'),
        evidence: evidenceWithoutExactContent(),
      }),
    ).toThrow(MissingExactContentEvidenceException);

    expect(() =>
      CorpusArtifactReference.create({
        corpusArtifactReferenceId: ' ',
        artifactKind: CorpusArtifactKind.fromString('RFC'),
        evidence: evidence(),
      }),
    ).toThrow(InvalidCorpusArtifactReferenceException);

    expect(() => CorpusArtifactKind.fromString('Other')).toThrow(
      InvalidCorpusArtifactKindException,
    );
  });

  it('proves artifactId derivation fidelity and locator-independent canonical identity', () => {
    const first = CorpusArtifactReference.create({
      corpusArtifactReferenceId: 'reference-1',
      artifactKind: CorpusArtifactKind.fromString('RFC'),
      evidence: evidence({ contentId: 'artifact-a', contentDigest: digestFor('same-content') }),
      locator: 'old/path.md',
    });
    const second = CorpusArtifactReference.create({
      corpusArtifactReferenceId: 'reference-2',
      artifactKind: CorpusArtifactKind.fromString('RFC'),
      evidence: evidence({
        evidenceId: 'evidence-2',
        contentId: 'artifact-b',
        contentDigest: digestFor('same-content'),
      }),
    });
    const sameIdentityDifferentLocator = CorpusArtifactReference.create({
      corpusArtifactReferenceId: 'reference-3',
      artifactKind: CorpusArtifactKind.fromString('RFC'),
      evidence: evidence({
        evidenceId: 'evidence-3',
        contentId: 'artifact-a',
        contentDigest: digestFor('same-content'),
      }),
      locator: 'new/path.md',
    });

    expect(first.artifactId).toBe('artifact-a');
    expect(second.artifactId).toBe('artifact-b');
    expect(first.hasSameCanonicalExactIdentity(second)).toBe(false);
    expect(first.hasSameCanonicalExactIdentity(sameIdentityDifferentLocator)).toBe(true);
    expect(first.canonicalExactIdentityKey()).toBe(
      sameIdentityDifferentLocator.canonicalExactIdentityKey(),
    );
  });
});

function evidence(
  input: {
    readonly evidenceId?: string;
    readonly evidenceVersion?: number;
    readonly contentId?: string;
    readonly contentRevision?: string;
    readonly contentDigest?: string;
  } = {},
): Evidence {
  return Evidence.register({
    ...baseEvidenceRequest(input.evidenceId ?? 'evidence-1', input.evidenceVersion ?? 1),
    exactContent: {
      representedContentReference: {
        contentOwner: 'nexus',
        contentType: 'RepositoryArtifact',
        contentId: input.contentId ?? 'artifact-1',
        contentRevision: input.contentRevision ?? 'revision-1',
        evidenceTypeIdentity: 'EvidenceType/RepositoryArtifact',
        evidenceTypeVersion: '1',
      },
      contentRepresentation: 'SnapshotContent',
      contentDigestAlgorithm: 'SHA-256',
      contentDigest: input.contentDigest ?? digestFor('artifact-1'),
    },
  });
}

function evidenceWithoutExactContent(): Evidence {
  return Evidence.register(baseEvidenceRequest('evidence-without-exact-content', 1));
}

function baseEvidenceRequest(id: string, version: number) {
  return {
    id,
    type: 'ArchitectureDocument',
    version,
    hash: `sha256:${id}`,
    metadata: {
      capturedAt: '2026-07-22T00:00:00.000Z',
      attributes: {
        fixture: 'corpus-review',
      },
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
  };
}

function digestFor(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}
