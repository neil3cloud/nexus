import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';

import { Evidence } from '../../../src/kernel/evidence/evidence.aggregate';
import {
  ConfidenceClassification,
  confidenceSatisfiesThreshold,
} from '../../../src/kernel/evidence/confidence-classification';
import {
  DerivedContentMultiSourceDeferredException,
  DerivedContentZeroSourceException,
  DuplicateDerivedContentSourceException,
  InvalidEvidenceException,
  SnapshotContentSourceReferenceException,
} from '../../../src/kernel/evidence/evidence.errors';
import type { DomainEventMetadata } from '../../../src/kernel/mission/mission.types';

const timestamp = '2026-07-12T00:00:00.000Z';

function metadata(eventId: string): DomainEventMetadata {
  return {
    eventId,
    timestamp,
  };
}

function evidenceRequest() {
  return {
    id: ' evidence-1 ',
    missionId: ' mission-1 ',
    type: 'TestResult',
    version: 1,
    hash: 'sha256:test-result',
    metadata: {
      capturedAt: '2026-07-12T00:00:00.000Z',
      attributes: {
        suite: 'unit',
      },
    },
    confidenceClassification: 'Verified',
    provenance: {
      source: 'vitest',
      acquisitionMethod: 'test-run',
      acquiredAt: '2026-07-12T00:00:00.000Z',
      actor: 'builder',
      system: 'nexus',
      verificationStatus: 'Verified',
      verificationStatusSemantics: 'EvidenceVerificationStatus/v1',
    },
  };
}

describe('Evidence', () => {
  it('creates an immutable aggregate with deterministic snapshots', () => {
    const evidence = Evidence.register(evidenceRequest());

    expect(Object.isFrozen(evidence)).toBe(true);
    expect(evidence.toSnapshot()).toEqual({
      id: 'evidence-1',
      missionId: 'mission-1',
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
      confidenceClassification: 'Verified',
      provenance: {
        source: 'vitest',
        acquisitionMethod: 'test-run',
        acquiredAt: '2026-07-12T00:00:00.000Z',
        actor: 'builder',
        system: 'nexus',
        verificationStatus: 'Verified',
        verificationStatusSemantics: 'EvidenceVerificationStatus/v1',
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

  it('fails closed when new construction omits confidence classification', () => {
    const request = evidenceRequest();
    const withoutConfidence = { ...request };
    delete (withoutConfidence as { confidenceClassification?: string }).confidenceClassification;

    expect(() => Evidence.register(withoutConfidence as never)).toThrow(InvalidEvidenceException);
    expect(() =>
      Evidence.create({
        id: Evidence.register(request).id,
        type: Evidence.register(request).type,
        version: Evidence.register(request).version,
        hash: Evidence.register(request).hash,
        metadata: Evidence.register(request).metadata,
        provenance: Evidence.register(request).provenance,
      } as never),
    ).toThrow(InvalidEvidenceException);
  });

  it('preserves absent legacy confidence on reconstitution without backfill', () => {
    const snapshot = Evidence.register(evidenceRequest()).toSnapshot();
    const legacySnapshot = { ...snapshot };
    delete (legacySnapshot as { confidenceClassification?: string }).confidenceClassification;
    const restored = Evidence.fromSnapshot(legacySnapshot);

    expect(restored.confidenceClassification).toBeUndefined();
    expect(restored.toSnapshot()).not.toHaveProperty('confidenceClassification');
    expect(
      confidenceSatisfiesThreshold(
        restored.confidenceClassification,
        ConfidenceClassification.fromString('Unverified'),
      ),
    ).toBe('Undetermined');
  });

  it('fails closed when snapshot confidence is present but invalid', () => {
    const snapshot = {
      ...Evidence.register(evidenceRequest()).toSnapshot(),
      confidenceClassification: 'Unknown',
    };

    expect(() => Evidence.fromSnapshot(snapshot)).toThrow(InvalidEvidenceException);
  });

  it('distinguishes legacy Evidence from Exact Content Evidence', () => {
    const evidence = Evidence.register(evidenceRequest());

    expect(evidence.hasExactContent()).toBe(false);
    expect(evidence.toSnapshot()).not.toHaveProperty('exactContent');
  });

  it('preserves the complete Exact Content Evidence block through snapshot rehydration', () => {
    const evidence = Evidence.register({
      ...evidenceRequest(),
      exactContent: exactContentInput('SnapshotContent', []),
    });
    const restored = Evidence.fromSnapshot(evidence.toSnapshot());

    expect(evidence.hasExactContent()).toBe(true);
    expect(restored.toSnapshot()).toEqual(evidence.toSnapshot());
  });

  it('validates SnapshotContent and DerivedContent source cardinality fail-closed rules', () => {
    expect(() =>
      Evidence.register({
        ...evidenceRequest(),
        exactContent: exactContentInput('SnapshotContent', [{ evidenceId: 'source-1', evidenceVersion: 1 }]),
      }),
    ).toThrow(SnapshotContentSourceReferenceException);

    expect(() =>
      Evidence.register({
        ...evidenceRequest(),
        exactContent: exactContentInput('DerivedContent', []),
      }),
    ).toThrow(DerivedContentZeroSourceException);

    expect(() =>
      Evidence.register({
        ...evidenceRequest(),
        exactContent: exactContentInput('DerivedContent', [
          { evidenceId: 'source-1', evidenceVersion: 1 },
          { evidenceId: 'source-1', evidenceVersion: 1 },
        ]),
      }),
    ).toThrow(DuplicateDerivedContentSourceException);

    expect(() =>
      Evidence.register({
        ...evidenceRequest(),
        exactContent: exactContentInput('DerivedContent', [
          { evidenceId: 'source-1', evidenceVersion: 1 },
          { evidenceId: 'source-2', evidenceVersion: 1 },
        ]),
      }),
    ).toThrow(DerivedContentMultiSourceDeferredException);
  });

  it('accepts exactly one DerivedContent source reference', () => {
    const evidence = Evidence.register({
      ...evidenceRequest(),
      exactContent: exactContentInput('DerivedContent', [{ evidenceId: 'source-1', evidenceVersion: 1 }]),
    });

    expect(evidence.exactContent.sourceEvidenceReferences).toHaveLength(1);
  });

  it('keeps EvidenceHash and contentDigest independent in snapshots', () => {
    const evidence = Evidence.register({
      ...evidenceRequest(),
      hash: 'sha256:opaque-evidence-hash',
      exactContent: exactContentInput('SnapshotContent', []),
    });

    expect(evidence.hash.toString()).toBe('sha256:opaque-evidence-hash');
    expect(evidence.exactContent.contentDigest.toString()).not.toBe(evidence.hash.toString());
    expect(evidence.toSnapshot().hash).toBe('sha256:opaque-evidence-hash');
    expect(evidence.toSnapshot().exactContent?.contentDigest).toBe(
      digestFor(new Uint8Array([1, 2, 3])),
    );
  });

  it('does not expose verification, applicability, currentness, authority, acceptance, or readiness state', () => {
    const evidence = Evidence.register(evidenceRequest());
    const prototypeNames = Object.getOwnPropertyNames(Object.getPrototypeOf(evidence));
    const forbidden = [
      'verificationStatus',
      'verified',
      'currentStatus',
      'applicability',
      'authoritative',
      'acceptance',
      'readiness',
    ];

    for (const forbiddenName of forbidden) {
      expect(prototypeNames).not.toContain(forbiddenName);
      expect(Object.hasOwn(evidence, forbiddenName)).toBe(false);
    }
  });

  it('records EvidenceCaptured events and drains them deterministically', () => {
    const evidence = Evidence.register(evidenceRequest());

    evidence.recordCaptured(metadata('event-evidence-captured'));

    expect(evidence.pullDomainEvents()).toEqual([
      {
        eventId: 'event-evidence-captured',
        missionId: 'mission-1',
        eventType: 'EvidenceCaptured',
        timestamp,
        causality: [],
        attribution: {
          missionId: 'mission-1',
        },
        payload: {
          evidenceId: 'evidence-1',
          evidenceType: 'TestResult',
          evidenceVersion: 1,
          evidenceSource: 'vitest',
          evidenceHash: 'sha256:test-result',
        },
      },
    ]);
    expect(evidence.pullDomainEvents()).toEqual([]);
  });

  function exactContentInput(
    contentRepresentation: 'SnapshotContent' | 'DerivedContent',
    sourceEvidenceReferences: readonly { readonly evidenceId: string; readonly evidenceVersion: number }[],
  ) {
    return {
      representedContentReference: {
        contentOwner: 'repo',
        contentType: 'file',
        contentId: 'src/kernel/evidence/evidence.aggregate.ts',
        contentRevision: 'rev-1',
        evidenceTypeIdentity: 'ExactOctetStream',
        evidenceTypeVersion: '1',
      },
      contentRepresentation,
      contentDigestAlgorithm: 'SHA-256',
      contentDigest: digestFor(new Uint8Array([1, 2, 3])),
      sourceEvidenceReferences,
    };
  }

  function digestFor(octets: Uint8Array): string {
    return createHash('sha256').update(octets).digest('hex');
  }

  it('uses the Evidence-specific event variant for Mission-independent EvidenceCaptured events', () => {
    const evidence = Evidence.register({
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
      confidenceClassification: 'Verified',
      provenance: {
        source: 'vitest',
        acquisitionMethod: 'test-run',
        acquiredAt: '2026-07-12T00:00:00.000Z',
        actor: 'builder',
        system: 'nexus',
        verificationStatus: 'Verified',
        verificationStatusSemantics: 'EvidenceVerificationStatus/v1',
      },
    });

    evidence.recordCaptured(metadata('event-mission-independent-evidence-captured'));

    expect(evidence.pullDomainEvents()).toEqual([
      {
        eventId: 'event-mission-independent-evidence-captured',
        eventType: 'EvidenceCaptured',
        timestamp,
        causality: [],
        attribution: {},
        payload: {
          evidenceId: 'evidence-1',
          evidenceType: 'TestResult',
          evidenceVersion: 1,
          evidenceSource: 'vitest',
          evidenceHash: 'sha256:test-result',
        },
      },
    ]);
  });
});
