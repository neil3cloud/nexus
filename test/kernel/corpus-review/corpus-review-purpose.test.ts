import { describe, expect, it } from 'vitest';

import {
  CorpusReviewPurpose,
  corpusReviewPurposeValues,
} from '../../../src/kernel/corpus-review/corpus-review-purpose';
import { InvalidCorpusReviewPurposeException } from '../../../src/kernel/corpus-review/corpus-review.errors';

describe('CorpusReviewPurpose', () => {
  it('constructs the six core values and derives identity canonical purpose keys', () => {
    for (const value of corpusReviewPurposeValues) {
      const purpose = CorpusReviewPurpose.fromString(value);

      expect(purpose.toString()).toBe(value);
      expect(purpose.canonicalPurposeKey).toBe(value);
      expect(purpose.equals(CorpusReviewPurpose.fromString(value))).toBe(true);
    }
  });

  it('fails closed for Other and arbitrary values', () => {
    expect(() => CorpusReviewPurpose.fromString('Other')).toThrow(
      InvalidCorpusReviewPurposeException,
    );
    expect(() => CorpusReviewPurpose.fromString('UnknownPurpose')).toThrow(
      InvalidCorpusReviewPurposeException,
    );
  });

  it('rejects whitespace-padded canonical purpose values', () => {
    for (const value of corpusReviewPurposeValues) {
      for (const invalid of [` ${value}`, `${value} `, ` ${value} `]) {
        expect(() => CorpusReviewPurpose.fromString(invalid)).toThrow(
          InvalidCorpusReviewPurposeException,
        );
      }
    }
  });
});
