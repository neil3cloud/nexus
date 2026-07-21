import { describe, expect, it } from 'vitest';

import {
  ConfidenceClassification,
  confidenceClassificationNames,
  confidenceSatisfiesThreshold,
} from '../../../src/kernel/evidence/confidence-classification';
import { InvalidEvidenceException } from '../../../src/kernel/evidence/evidence.errors';

describe('ConfidenceClassification', () => {
  it('uses RFC-0002 v1.3 canonical encodings and rejects out-of-vocabulary strings', () => {
    for (const name of confidenceClassificationNames) {
      const classification = ConfidenceClassification.fromString(name);

      expect(classification.toString()).toBe(name);
      expect(classification.toJSON()).toBe(name);
    }

    for (const invalid of ['', ' verified ', 'verified', 'Failed', 'Unknown']) {
      expect(() => ConfidenceClassification.fromString(invalid)).toThrow(InvalidEvidenceException);
    }
  });

  it('rejects whitespace-padded canonical vocabulary strings', () => {
    for (const name of confidenceClassificationNames) {
      for (const invalid of [` ${name}`, `${name} `, ` ${name} `]) {
        expect(() => ConfidenceClassification.fromString(invalid)).toThrow(InvalidEvidenceException);
      }
    }
  });

  it('enforces the normative total ordering in both directions', () => {
    const ordered = confidenceClassificationNames.map((name) =>
      ConfidenceClassification.fromString(name),
    );

    for (let index = 0; index < ordered.length - 1; index += 1) {
      const stronger = ordered[index];
      const weaker = ordered[index + 1];

      if (stronger === undefined || weaker === undefined) {
        throw new Error('Missing ordered confidence classification fixture.');
      }

      expect(stronger.compareTo(weaker)).toBeGreaterThan(0);
      expect(weaker.compareTo(stronger)).toBeLessThan(0);
    }

    for (const classification of ordered) {
      expect(classification.compareTo(classification)).toBe(0);
    }
  });

  it('returns three-way threshold satisfaction including Undetermined for absent confidence', () => {
    const accepted = ConfidenceClassification.fromString('Accepted');
    const observed = ConfidenceClassification.fromString('Observed');
    const inferred = ConfidenceClassification.fromString('Inferred');

    expect(confidenceSatisfiesThreshold(accepted, observed)).toBe('Satisfied');
    expect(confidenceSatisfiesThreshold(inferred, observed)).toBe('Insufficient');
    expect(confidenceSatisfiesThreshold(undefined, observed)).toBe('Undetermined');
  });
});
