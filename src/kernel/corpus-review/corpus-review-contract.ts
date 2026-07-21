import { AssessmentCriteriaSet } from '../review/assessment-criterion';
import type { CorpusArtifactReference } from './corpus-artifact-reference';
import {
  DuplicateCanonicalCorpusArtifactIdentityException,
  DuplicateCorpusArtifactReferenceIdException,
  EmptyCorpusReviewContractException,
  IneligibleCorpusReviewContractArtifactKindException,
} from './corpus-review.errors';
import { CorpusReviewFingerprintProtocol } from './corpus-review-fingerprint-protocol';

export interface AssessmentCriteriaSetReference {
  readonly identity: string;
  readonly version: string;
  readonly fingerprint: string;
}

export interface CorpusReviewContractInput {
  readonly authorityReferences: readonly CorpusArtifactReference[];
  readonly assessmentCriteriaSet: AssessmentCriteriaSet;
}

export class CorpusReviewContract {
  public readonly fingerprint: string;
  public readonly assessmentCriteriaSetReference: AssessmentCriteriaSetReference;

  private constructor(
    public readonly authorityReferences: readonly CorpusArtifactReference[],
    assessmentCriteriaSet: AssessmentCriteriaSet,
  ) {
    this.assessmentCriteriaSetReference = Object.freeze({
      identity: assessmentCriteriaSet.identity,
      version: assessmentCriteriaSet.version,
      fingerprint: assessmentCriteriaSet.fingerprint,
    });
    this.fingerprint = CorpusReviewFingerprintProtocol.compute(
      authorityReferences.map((reference) => reference.canonicalExactIdentityTuple()),
    );

    Object.freeze(this.authorityReferences);
    Object.freeze(this);
  }

  public static create(input: CorpusReviewContractInput): CorpusReviewContract {
    if (input.authorityReferences.length === 0) {
      throw new EmptyCorpusReviewContractException();
    }

    for (const reference of input.authorityReferences) {
      if (!reference.artifactKind.isAuthorityBearing()) {
        throw new IneligibleCorpusReviewContractArtifactKindException(
          reference.artifactKind.toString(),
        );
      }
    }

    validateUniqueReferenceIds('CorpusReviewContract', input.authorityReferences);
    validateUniqueCanonicalIdentities('CorpusReviewContract', input.authorityReferences);

    return new CorpusReviewContract(
      Object.freeze([...input.authorityReferences]),
      input.assessmentCriteriaSet,
    );
  }
}

function validateUniqueReferenceIds(
  owner: 'CorpusReviewContract',
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
  owner: 'CorpusReviewContract',
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
