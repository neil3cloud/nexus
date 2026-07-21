import type { Evidence } from '../evidence/evidence.aggregate';
import type { RepresentedContentReference } from '../evidence/exact-content-reference';
import { CorpusArtifactKind } from './corpus-artifact-kind';
import {
  InvalidCorpusArtifactReferenceException,
  MissingExactContentEvidenceException,
} from './corpus-review.errors';

export interface CorpusArtifactReferenceInput {
  readonly corpusArtifactReferenceId: string;
  readonly artifactKind: CorpusArtifactKind;
  readonly evidence: Evidence;
  readonly locator?: string;
}

export interface CorpusArtifactCanonicalIdentity {
  readonly artifactId: string;
  readonly canonicalArtifactKindKey: string;
  readonly contentDigest: string;
}

export class CorpusArtifactReference {
  private constructor(
    public readonly corpusArtifactReferenceId: string,
    public readonly artifactKind: CorpusArtifactKind,
    public readonly artifactId: string,
    public readonly evidenceId: string,
    public readonly evidenceVersion: number,
    public readonly contentDigest: string,
    public readonly representedContentReference: RepresentedContentReference,
    public readonly locator: string | undefined,
  ) {
    Object.freeze(this);
  }

  public static create(input: CorpusArtifactReferenceInput): CorpusArtifactReference {
    if (!input.evidence.hasExactContent()) {
      throw new MissingExactContentEvidenceException();
    }

    const exactContent = input.evidence.exactContent;
    const representedContentReference = exactContent.representedContentReference;

    return new CorpusArtifactReference(
      normalizeNonEmpty(
        input.corpusArtifactReferenceId,
        'CorpusArtifactReference corpusArtifactReferenceId',
      ),
      input.artifactKind,
      representedContentReference.contentId,
      input.evidence.id.toString(),
      input.evidence.version.toNumber(),
      exactContent.contentDigest.toString(),
      representedContentReference,
      normalizeOptional(input.locator, 'CorpusArtifactReference locator'),
    );
  }

  public get canonicalArtifactKindKey(): string {
    return this.artifactKind.canonicalArtifactKindKey;
  }

  public canonicalExactIdentity(): CorpusArtifactCanonicalIdentity {
    return {
      artifactId: this.artifactId,
      canonicalArtifactKindKey: this.canonicalArtifactKindKey,
      contentDigest: this.contentDigest,
    };
  }

  public canonicalExactIdentityTuple(): readonly [string, string, string] {
    return [this.artifactId, this.canonicalArtifactKindKey, this.contentDigest];
  }

  public canonicalExactIdentityKey(): string {
    return this.canonicalExactIdentityTuple().join('\u001f');
  }

  public hasSameCanonicalExactIdentity(other: CorpusArtifactReference): boolean {
    return this.canonicalExactIdentityKey() === other.canonicalExactIdentityKey();
  }
}

function normalizeNonEmpty(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidCorpusArtifactReferenceException(`${label} must be a non-empty string.`);
  }

  return normalized;
}

function normalizeOptional(value: string | undefined, label: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return normalizeNonEmpty(value, label);
}
