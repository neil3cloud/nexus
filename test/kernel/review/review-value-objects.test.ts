import { describe, expect, it } from 'vitest';

import { FindingId } from '../../../src/kernel/review/finding-id';
import { ReviewId } from '../../../src/kernel/review/review-id';
import { InvalidReviewDefinitionError } from '../../../src/kernel/review/review.errors';
import {
  FindingCategory,
  FindingStatus,
  ReviewOutcome,
  ReviewStatus,
  Severity,
} from '../../../src/kernel/review/review-values';

describe('Review value objects', () => {
  it('normalizes identities and supports deterministic equality', () => {
    const reviewId = ReviewId.fromString(' review-1 ');
    const findingId = FindingId.fromString(' finding-1 ');

    expect(reviewId.toString()).toBe('review-1');
    expect(reviewId.equals(ReviewId.fromString('review-1'))).toBe(true);
    expect(findingId.toString()).toBe('finding-1');
    expect(findingId.equals(FindingId.fromString('finding-1'))).toBe(true);
  });

  it('accepts only ratified Review and Finding vocabulary', () => {
    expect(ReviewStatus.fromString('Pending').toString()).toBe('Pending');
    expect(ReviewOutcome.fromString('Action Required').toString()).toBe('Action Required');
    expect(Severity.fromString('Critical').toString()).toBe('Critical');
    expect(FindingCategory.fromString('Risk Mitigation').toString()).toBe('Risk Mitigation');
    expect(FindingStatus.fromString('Created').toString()).toBe('Created');

    expect(() => ReviewOutcome.fromString('Approved')).toThrow(InvalidReviewDefinitionError);
    expect(() => Severity.fromString('Error')).toThrow(InvalidReviewDefinitionError);
    expect(() => FindingCategory.fromString('Preference')).toThrow(InvalidReviewDefinitionError);
  });

  it('rejects empty identifiers', () => {
    expect(() => ReviewId.fromString(' ')).toThrow(InvalidReviewDefinitionError);
    expect(() => FindingId.fromString(' ')).toThrow(InvalidReviewDefinitionError);
  });
});
