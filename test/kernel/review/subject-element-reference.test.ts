import { describe, expect, it } from 'vitest';

import { InvalidReviewDefinitionError } from '../../../src/kernel/review/review.errors';
import {
  CanonicalSubjectElementKind,
  CorpusReviewBasisFingerprint,
  SubjectElementReference,
} from '../../../src/kernel/review/subject-element-reference';

describe('Subject element structural identities', () => {
  it('fails closed on empty or structurally malformed opaque identifiers', () => {
    expect(() => SubjectElementReference.fromString(' ')).toThrow(InvalidReviewDefinitionError);
    expect(() => CanonicalSubjectElementKind.fromString('\u0000')).toThrow(InvalidReviewDefinitionError);
    expect(() => CorpusReviewBasisFingerprint.fromString('')).toThrow(InvalidReviewDefinitionError);
  });

  it('supports exact equality and deterministic bytewise total ordering', () => {
    const first = SubjectElementReference.fromString('artifact-a');
    const same = SubjectElementReference.fromString('artifact-a');
    const second = SubjectElementReference.fromString('artifact-b');

    expect(first.equals(same)).toBe(true);
    expect(first.equals(second)).toBe(false);
    expect(first.compareTo(same)).toBe(0);
    expect([second, first, same].sort((left, right) => left.compareTo(right)).map((value) => value.toString())).toEqual([
      'artifact-a',
      'artifact-a',
      'artifact-b',
    ]);
  });

  it('compares canonical kinds bytewise and preserves basis fingerprints exactly', () => {
    const kindA = CanonicalSubjectElementKind.fromString('Source');
    const kindB = CanonicalSubjectElementKind.fromString('Test');
    const fingerprint = CorpusReviewBasisFingerprint.fromString('basis-fingerprint-1');

    expect(kindA.compareTo(kindB)).toBeLessThan(0);
    expect(kindA.equals(CanonicalSubjectElementKind.fromString('Source'))).toBe(true);
    expect(fingerprint.equals(CorpusReviewBasisFingerprint.fromString('basis-fingerprint-1'))).toBe(true);
    expect(fingerprint.toJSON()).toBe('basis-fingerprint-1');
  });
});
