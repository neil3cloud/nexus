import type { CorpusArtifactReference } from './corpus-artifact-reference';
import {
  DuplicateCanonicalCorpusArtifactIdentityException,
  DuplicateCorpusArtifactReferenceIdException,
  EmptyCorpusReviewScopeException,
} from './corpus-review.errors';
import { CorpusReviewFingerprintProtocol } from './corpus-review-fingerprint-protocol';

export interface CorpusReviewScopeInput {
  readonly references: readonly CorpusArtifactReference[];
}

export class CorpusReviewScope {
  public readonly fingerprint: string;

  private constructor(public readonly references: readonly CorpusArtifactReference[]) {
    this.fingerprint = CorpusReviewFingerprintProtocol.compute(
      references.map((reference) => reference.canonicalExactIdentityTuple()),
    );

    Object.freeze(this.references);
    Object.freeze(this);
  }

  public static create(input: CorpusReviewScopeInput): CorpusReviewScope {
    if (input.references.length === 0) {
      throw new EmptyCorpusReviewScopeException();
    }

    validateUniqueReferenceIds('CorpusReviewScope', input.references);
    validateUniqueCanonicalIdentities('CorpusReviewScope', input.references);

    return new CorpusReviewScope(Object.freeze([...input.references]));
  }
}

function validateUniqueReferenceIds(
  owner: 'CorpusReviewScope',
  references: readonly CorpusArtifactReference[],
): void {
  const seen = new Set<string>();

  for (const reference of references) {
    if (seen.has(reference.corpusArtifactReferenceId)) {
      throw new DuplicateCorpusArtifactReferenceIdException(
        owner,
        reference.corpusArtifactReferenceId,
      );
    }

    seen.add(reference.corpusArtifactReferenceId);
  }
}

function validateUniqueCanonicalIdentities(
  owner: 'CorpusReviewScope',
  references: readonly CorpusArtifactReference[],
): void {
  const seen = new Set<string>();

  for (const reference of references) {
    const identity = reference.canonicalExactIdentityKey();

    if (seen.has(identity)) {
      throw new DuplicateCanonicalCorpusArtifactIdentityException(owner, identity);
    }

    seen.add(identity);
  }
}
