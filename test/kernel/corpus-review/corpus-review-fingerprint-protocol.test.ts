import { describe, expect, it } from 'vitest';

import { InvalidCorpusReviewFingerprintInputException } from '../../../src/kernel/corpus-review/corpus-review.errors';
import { CorpusReviewFingerprintProtocol } from '../../../src/kernel/corpus-review/corpus-review-fingerprint-protocol';

describe('CorpusReviewFingerprintProtocol', () => {
  it('produces order-independent lowercase SHA-256 fingerprints for identical tuple sets', () => {
    const first = CorpusReviewFingerprintProtocol.compute([
      ['artifact-b', 'RFC', 'digest-b'],
      ['artifact-a', 'Canon', 'digest-a'],
    ]);
    const second = CorpusReviewFingerprintProtocol.compute([
      ['artifact-a', 'Canon', 'digest-a'],
      ['artifact-b', 'RFC', 'digest-b'],
    ]);

    expect(first).toBe(second);
    expect(first).toMatch(/^[0-9a-f]{64}$/u);
  });

  it('changes when any participating field changes and preserves record identifiers outside input', () => {
    const baseline = CorpusReviewFingerprintProtocol.compute([
      ['artifact-a', 'RFC', 'digest-a'],
    ]);

    expect(
      CorpusReviewFingerprintProtocol.compute([['artifact-b', 'RFC', 'digest-a']]),
    ).not.toBe(baseline);
    expect(
      CorpusReviewFingerprintProtocol.compute([['artifact-a', 'Canon', 'digest-a']]),
    ).not.toBe(baseline);
    expect(
      CorpusReviewFingerprintProtocol.compute([['artifact-a', 'RFC', 'digest-b']]),
    ).not.toBe(baseline);
    expect(
      CorpusReviewFingerprintProtocol.compute([['artifact-a', 'RFC', 'digest-a']]),
    ).toBe(baseline);
  });

  it('serializes with length-prefixed framing so distinct fields cannot collide by concatenation', () => {
    const splitAsOneAndTwo = CorpusReviewFingerprintProtocol.serialize([['a', 'bc']]);
    const splitAsTwoAndOne = CorpusReviewFingerprintProtocol.serialize([['ab', 'c']]);

    expect(splitAsOneAndTwo).not.toBe(splitAsTwoAndOne);
    expect(() => CorpusReviewFingerprintProtocol.compute([[]])).toThrow(
      InvalidCorpusReviewFingerprintInputException,
    );
  });
});
