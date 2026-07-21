import { describe, expect, it } from 'vitest';

import {
  CorpusReviewOpeningAttribution,
  corpusReviewOpeningOriginTypes,
} from '../../../src/kernel/corpus-review/corpus-review-opening-attribution';
import { InvalidCorpusReviewOpeningAttributionException } from '../../../src/kernel/corpus-review/corpus-review.errors';

describe('CorpusReviewOpeningAttribution', () => {
  it('accepts each closed origin type with origin id and timestamp', () => {
    const timestamp = new Date('2026-07-22T00:00:00.000Z');

    for (const originType of corpusReviewOpeningOriginTypes) {
      const attribution = CorpusReviewOpeningAttribution.create({
        originType,
        originId: 'origin-1',
        timestamp,
      });

      expect(attribution.originType).toBe(originType);
      expect(attribution.originId).toBe('origin-1');
      expect(attribution.timestamp.toISOString()).toBe('2026-07-22T00:00:00.000Z');
    }
  });

  it('rejects missing origin type, origin id, or timestamp', () => {
    const timestamp = new Date('2026-07-22T00:00:00.000Z');

    expect(() =>
      CorpusReviewOpeningAttribution.create({
        originType: '',
        originId: 'origin-1',
        timestamp,
      }),
    ).toThrow(InvalidCorpusReviewOpeningAttributionException);
    expect(() =>
      CorpusReviewOpeningAttribution.create({
        originType: 'Human',
        originId: '',
        timestamp,
      }),
    ).toThrow(InvalidCorpusReviewOpeningAttributionException);
    expect(() =>
      CorpusReviewOpeningAttribution.create({
        originType: 'Human',
        originId: 'origin-1',
        timestamp: new Date(Number.NaN),
      }),
    ).toThrow(InvalidCorpusReviewOpeningAttributionException);
  });

  it('rejects whitespace-padded canonical origin types', () => {
    const timestamp = new Date('2026-07-22T00:00:00.000Z');

    for (const originType of corpusReviewOpeningOriginTypes) {
      for (const invalid of [` ${originType}`, `${originType} `, ` ${originType} `]) {
        expect(() =>
          CorpusReviewOpeningAttribution.create({
            originType: invalid,
            originId: 'origin-1',
            timestamp,
          }),
        ).toThrow(InvalidCorpusReviewOpeningAttributionException);
      }
    }
  });

  it('defensively copies timestamps', () => {
    const timestamp = new Date('2026-07-22T00:00:00.000Z');
    const attribution = CorpusReviewOpeningAttribution.create({
      originType: 'Human',
      originId: 'origin-1',
      timestamp,
    });

    timestamp.setUTCFullYear(2030);
    const exposedTimestamp = attribution.timestamp;
    exposedTimestamp.setUTCFullYear(2040);

    expect(attribution.timestamp.toISOString()).toBe('2026-07-22T00:00:00.000Z');
  });
});
