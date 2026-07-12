import { describe, expect, it } from 'vitest';

import { Evidence } from '../../../src/kernel/evidence/evidence.aggregate';
import { InvalidEvidenceException } from '../../../src/kernel/evidence/evidence.errors';

function evidenceRequest() {
  return {
    id: ' evidence-1 ',
    type: 'TestResult',
    version: 1,
    hash: 'sha256:test-result',
    metadata: {
      capturedAt: '2026-07-12T00:00:00.000Z',
      attributes: {
        suite: 'unit',
      },
    },
    provenance: {
      source: 'vitest',
      acquisitionMethod: 'test-run',
      acquiredAt: '2026-07-12T00:00:00.000Z',
      actor: 'builder',
      system: 'nexus',
      verificationStatus: 'Verified',
    },
  };
}

describe('Evidence', () => {
  it('creates an immutable aggregate with deterministic snapshots', () => {
    const evidence = Evidence.register(evidenceRequest());

    expect(Object.isFrozen(evidence)).toBe(true);
    expect(evidence.toSnapshot()).toEqual({
      id: 'evidence-1',
      type: 'TestResult',
      version: 1,
      source: 'vitest',
      hash: 'sha256:test-result',
      metadata: {
        capturedAt: '2026-07-12T00:00:00.000Z',
        attributes: {
          suite: 'unit',
        },
      },
      provenance: {
        source: 'vitest',
        acquisitionMethod: 'test-run',
        acquiredAt: '2026-07-12T00:00:00.000Z',
        actor: 'builder',
        system: 'nexus',
        verificationStatus: 'Verified',
      },
    });
  });

  it('preserves metadata immutability from caller-owned objects', () => {
    const request = evidenceRequest();
    const mutableAttributes: Record<string, string> = {
      suite: 'unit',
    };

    const evidence = Evidence.register({
      ...request,
      metadata: {
        capturedAt: request.metadata.capturedAt,
        attributes: mutableAttributes,
      },
    });

    mutableAttributes.suite = 'mutated';

    expect(evidence.metadata.attributes).toEqual({
      suite: 'unit',
    });
  });

  it('rejects invalid constructor inputs through domain validation', () => {
    expect(() =>
      Evidence.register({
        ...evidenceRequest(),
        id: ' ',
      }),
    ).toThrow(InvalidEvidenceException);

    expect(() =>
      Evidence.register({
        ...evidenceRequest(),
        metadata: {
          capturedAt: ' ',
        },
      }),
    ).toThrow(InvalidEvidenceException);

    expect(() =>
      Evidence.register({
        ...evidenceRequest(),
        provenance: {
          ...evidenceRequest().provenance,
          source: ' ',
        },
      }),
    ).toThrow(InvalidEvidenceException);
  });

  it('reconstitutes Evidence from snapshots without changing identity or provenance', () => {
    const evidence = Evidence.register(evidenceRequest());
    const restored = Evidence.fromSnapshot(evidence.toSnapshot());

    expect(restored).not.toBe(evidence);
    expect(restored.toSnapshot()).toEqual(evidence.toSnapshot());
  });
});
