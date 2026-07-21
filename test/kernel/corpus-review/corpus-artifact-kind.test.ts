import { describe, expect, it } from 'vitest';

import {
  CorpusArtifactKind,
  corpusArtifactKindValues,
} from '../../../src/kernel/corpus-review/corpus-artifact-kind';
import { InvalidCorpusArtifactKindException } from '../../../src/kernel/corpus-review/corpus-review.errors';

describe('CorpusArtifactKind', () => {
  it('constructs the fourteen core values and derives identity canonical artifact kind keys', () => {
    for (const value of corpusArtifactKindValues) {
      const kind = CorpusArtifactKind.fromString(value);

      expect(kind.toString()).toBe(value);
      expect(kind.canonicalArtifactKindKey).toBe(value);
      expect(kind.equals(CorpusArtifactKind.fromString(value))).toBe(true);
    }
  });

  it('classifies only the closed authority-bearing kind set as contract-eligible', () => {
    expect(CorpusArtifactKind.fromString('Canon').isAuthorityBearing()).toBe(true);
    expect(CorpusArtifactKind.fromString('RFC').isAuthorityBearing()).toBe(true);
    expect(CorpusArtifactKind.fromString('ImplementationConstitution').isAuthorityBearing()).toBe(
      true,
    );
    expect(CorpusArtifactKind.fromString('ImplementationPlan').isAuthorityBearing()).toBe(false);
    expect(CorpusArtifactKind.fromString('ImplementationManifest').isAuthorityBearing()).toBe(
      false,
    );
    expect(CorpusArtifactKind.fromString('SprintImplementationRecord').isAuthorityBearing()).toBe(
      false,
    );
    expect(CorpusArtifactKind.fromString('ReviewHistory').isAuthorityBearing()).toBe(false);
  });

  it('fails closed for Other and arbitrary values', () => {
    expect(() => CorpusArtifactKind.fromString('Other')).toThrow(
      InvalidCorpusArtifactKindException,
    );
    expect(() => CorpusArtifactKind.fromString('UnknownKind')).toThrow(
      InvalidCorpusArtifactKindException,
    );
  });

  it('rejects whitespace-padded canonical artifact kind values', () => {
    for (const value of corpusArtifactKindValues) {
      for (const invalid of [` ${value}`, `${value} `, ` ${value} `]) {
        expect(() => CorpusArtifactKind.fromString(invalid)).toThrow(
          InvalidCorpusArtifactKindException,
        );
      }
    }
  });
});
