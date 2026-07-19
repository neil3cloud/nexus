import { describe, expect, it } from 'vitest';

import * as evidenceContract from '../../../src/kernel/evidence/evidence.contract';

describe('evidence.contract', () => {
  it('exports Sprint 78 Exact Content Evidence public contracts', () => {
    expect(evidenceContract.ContentDigest).toBeDefined();
    expect(evidenceContract.ContentDigestAlgorithm).toBeDefined();
    expect(evidenceContract.RepresentedContentReference).toBeDefined();
    expect(evidenceContract.ExactContentEvidence).toBeDefined();
    expect(evidenceContract.ExactContentSourceReference).toBeDefined();
    expect(evidenceContract.InMemoryExactContentResolver).toBeDefined();
    expect(evidenceContract.ExactContentCanonicalizerRegistry).toBeDefined();
    expect(evidenceContract.ExactContentVerificationService).toBeDefined();
    expect(evidenceContract.VerificationResult).toBeDefined();
    expect(evidenceContract.EvidenceVersionNotFoundException).toBeDefined();
    expect(evidenceContract.AmbiguousEvidenceVersionException).toBeDefined();
    expect(evidenceContract.DuplicateEvidenceException).toBeDefined();
  });
});
