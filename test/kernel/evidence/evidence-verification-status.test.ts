import { describe, expect, it } from 'vitest';

import { InvalidEvidenceException } from '../../../src/kernel/evidence/evidence.errors';
import {
  EvidenceVerificationStatus,
  evidenceVerificationStatusNames,
  verificationStatusSatisfiesThreshold,
} from '../../../src/kernel/evidence/evidence-verification-status';
import { VerificationResult } from '../../../src/kernel/evidence/exact-content-verification.service';

describe('EvidenceVerificationStatus', () => {
  it('uses RFC-0002 v1.3 canonical encodings and rejects out-of-vocabulary strings', () => {
    for (const name of evidenceVerificationStatusNames) {
      const status = EvidenceVerificationStatus.fromString(name);

      expect(status.toString()).toBe(name);
      expect(status.toJSON()).toBe(name);
    }

    for (const invalid of ['', ' verified ', 'Failed', 'Accepted', 'Unknown']) {
      expect(() => EvidenceVerificationStatus.fromString(invalid)).toThrow(InvalidEvidenceException);
    }
  });

  it('rejects whitespace-padded canonical vocabulary strings', () => {
    for (const name of evidenceVerificationStatusNames) {
      for (const invalid of [` ${name}`, `${name} `, ` ${name} `]) {
        expect(() => EvidenceVerificationStatus.fromString(invalid)).toThrow(
          InvalidEvidenceException,
        );
      }
    }
  });

  it('enforces the normative total ordering in both directions', () => {
    const ordered = evidenceVerificationStatusNames.map((name) =>
      EvidenceVerificationStatus.fromString(name),
    );

    for (let index = 0; index < ordered.length - 1; index += 1) {
      const stronger = ordered[index];
      const weaker = ordered[index + 1];

      if (stronger === undefined || weaker === undefined) {
        throw new Error('Missing ordered EvidenceVerificationStatus fixture.');
      }

      expect(stronger.compareTo(weaker)).toBeGreaterThan(0);
      expect(weaker.compareTo(stronger)).toBeLessThan(0);
    }

    for (const status of ordered) {
      expect(status.compareTo(status)).toBe(0);
    }
  });

  it('returns three-way threshold satisfaction and keeps Sprint 78 VerificationStatus separate', () => {
    const verified = EvidenceVerificationStatus.fromString('Verified');
    const unverified = EvidenceVerificationStatus.fromString('Unverified');

    expect(verificationStatusSatisfiesThreshold({ kind: 'Governed', value: verified }, unverified)).toBe(
      'Satisfied',
    );
    expect(verificationStatusSatisfiesThreshold({ kind: 'Governed', value: unverified }, verified)).toBe(
      'Insufficient',
    );
    expect(verificationStatusSatisfiesThreshold({ kind: 'Unrankable' }, unverified)).toBe(
      'Undetermined',
    );
    expect(VerificationResult.failed(new Error('digest mismatch')).status).toBe('Failed');
    expect(() => EvidenceVerificationStatus.fromString('Failed')).toThrow(InvalidEvidenceException);
  });
});
