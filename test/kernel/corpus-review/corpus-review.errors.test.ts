import { describe, expect, it } from 'vitest';

import {
  CorpusReviewException,
  DuplicateCanonicalCorpusArtifactIdentityException,
  DuplicateCorpusArtifactReferenceIdException,
  EmptyCorpusReviewContractException,
  EmptyCorpusReviewScopeException,
  IneligibleCorpusReviewContractArtifactKindException,
  InvalidCorpusArtifactKindException,
  InvalidCorpusArtifactReferenceException,
  InvalidCorpusReviewFingerprintInputException,
  InvalidCorpusReviewOpeningAttributionException,
  InvalidCorpusReviewPurposeException,
  MissingExactContentEvidenceException,
} from '../../../src/kernel/corpus-review/corpus-review.errors';

describe('Corpus Review diagnostics', () => {
  it('exposes named fail-closed diagnostics for Sprint 81 construction failures', () => {
    const diagnostics = [
      new InvalidCorpusReviewPurposeException('invalid purpose'),
      new InvalidCorpusArtifactKindException('invalid kind'),
      new InvalidCorpusArtifactReferenceException('invalid reference'),
      new MissingExactContentEvidenceException(),
      new EmptyCorpusReviewScopeException(),
      new EmptyCorpusReviewContractException(),
      new DuplicateCorpusArtifactReferenceIdException('CorpusReviewScope', 'reference-1'),
      new DuplicateCanonicalCorpusArtifactIdentityException('CorpusReviewScope', 'identity-1'),
      new IneligibleCorpusReviewContractArtifactKindException('ImplementationPlan'),
      new InvalidCorpusReviewOpeningAttributionException('invalid attribution'),
      new InvalidCorpusReviewFingerprintInputException('invalid fingerprint input'),
    ];

    for (const diagnostic of diagnostics) {
      expect(diagnostic).toBeInstanceOf(CorpusReviewException);
      expect(diagnostic.name).toBe(diagnostic.constructor.name);
      expect(diagnostic.message.length).toBeGreaterThan(0);
    }
  });
});
