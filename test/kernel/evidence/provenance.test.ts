import { describe, expect, it } from 'vitest';

import { InvalidEvidenceException } from '../../../src/kernel/evidence/evidence.errors';
import {
  EvidenceVerificationStatus,
  evidenceVerificationStatusSemantics,
  verificationStatusSatisfiesThreshold,
} from '../../../src/kernel/evidence/evidence-verification-status';
import { Provenance } from '../../../src/kernel/evidence/provenance';
import type { LegacyProvenanceSnapshot } from '../../../src/kernel/evidence/provenance';

describe('Provenance', () => {
  it('constructs governed Provenance only with typed status and exact semantics marker', () => {
    const provenance = Provenance.create({
      ...baseFields(),
      verificationStatus: EvidenceVerificationStatus.fromString('Verified'),
      verificationStatusSemantics: evidenceVerificationStatusSemantics,
    });

    expect(provenance.toSnapshot()).toEqual({
      ...baseFields(),
      verificationStatus: 'Verified',
      verificationStatusSemantics: evidenceVerificationStatusSemantics,
    });

    expect(() =>
      Provenance.create({
        ...baseFields(),
        verificationStatus: EvidenceVerificationStatus.fromString('Verified'),
        verificationStatusSemantics: 'wrong-marker' as typeof evidenceVerificationStatusSemantics,
      }),
    ).toThrow(InvalidEvidenceException);
  });

  it('validates raw registration input before delegating to governed construction', () => {
    const provenance = Provenance.register({
      ...baseFields(),
      verificationStatus: 'Unverified',
      verificationStatusSemantics: evidenceVerificationStatusSemantics,
    });

    expect(provenance.verificationStatusForThreshold()).toEqual({
      kind: 'Governed',
      value: EvidenceVerificationStatus.fromString('Unverified'),
    });

    expect(() =>
      Provenance.register({
        ...baseFields(),
        verificationStatus: 'Failed',
        verificationStatusSemantics: evidenceVerificationStatusSemantics,
      }),
    ).toThrow(InvalidEvidenceException);
    expect(() =>
      Provenance.register({
        ...baseFields(),
        verificationStatus: 'Verified',
        verificationStatusSemantics: '',
      }),
    ).toThrow(InvalidEvidenceException);
  });

  it('preserves legacy marker-less verification status bytes as unrankable', () => {
    for (const legacyStatus of ['Verified', 'legacy verified', '']) {
      const restored = Provenance.fromSnapshot({
        ...baseFields(),
        verificationStatus: legacyStatus,
      });

      expect(restored.toSnapshot()).toEqual({
        ...baseFields(),
        verificationStatus: legacyStatus,
      });
      expect(restored.verificationStatusForThreshold()).toEqual({ kind: 'Unrankable' });
      expect(
        verificationStatusSatisfiesThreshold(
          restored.verificationStatusForThreshold(),
          EvidenceVerificationStatus.fromString('Unverified'),
        ),
      ).toBe('Undetermined');
    }
  });

  it('fails closed for malformed governed snapshot representations', () => {
    for (const malformed of [
      { verificationStatus: 'Failed', verificationStatusSemantics: evidenceVerificationStatusSemantics },
      { verificationStatus: 'Verified', verificationStatusSemantics: 'EvidenceVerificationStatus/v2' },
      { verificationStatus: 'Verified', verificationStatusSemantics: '' },
      { verificationStatusSemantics: evidenceVerificationStatusSemantics },
    ]) {
      expect(() =>
        Provenance.fromSnapshot({
          ...baseFields(),
          ...malformed,
        } as never),
      ).toThrow(InvalidEvidenceException);
    }
  });

  it('keeps governed and legacy representations distinct for equality and union typing', () => {
    const governed = Provenance.register({
      ...baseFields(),
      verificationStatus: 'Verified',
      verificationStatusSemantics: evidenceVerificationStatusSemantics,
    });
    const legacy = Provenance.fromSnapshot({
      ...baseFields(),
      verificationStatus: 'Verified',
    });

    expect(governed.equals(legacy)).toBe(false);

    const invalidLegacySnapshot: LegacyProvenanceSnapshot = {
      ...baseFields(),
      verificationStatus: 'Verified',
      // @ts-expect-error verificationStatusSemantics closes the legacy union branch.
      verificationStatusSemantics: evidenceVerificationStatusSemantics,
    };

    expect(invalidLegacySnapshot.verificationStatusSemantics).toBe(evidenceVerificationStatusSemantics);
  });
});

function baseFields() {
  return {
    source: 'vitest',
    acquisitionMethod: 'test-run',
    acquiredAt: '2026-07-12T00:00:00.000Z',
    actor: 'builder',
    system: 'nexus',
  };
}
