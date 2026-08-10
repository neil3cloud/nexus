import { describe, expect, it } from 'vitest';

import { issueRatificationAuthoritySnapshot } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance';
import { RatificationAuthoritySnapshotSource } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance.types';

function issue(capturedAt: string): ReturnType<typeof issueRatificationAuthoritySnapshot> {
  return issueRatificationAuthoritySnapshot({
    source: RatificationAuthoritySnapshotSource.fromBytes(Buffer.from(active(), 'utf8')),
    capturedAt,
    producingAttribution: {
      producingImplementationIdentity: 'test-issuer',
      producingImplementationRevision: 'rev-1',
    },
  });
}

describe('RatificationAuthoritySnapshotIssuance commitment layers', () => {
  it('emits prefixed record fingerprints, authority root, and envelope commitment', () => {
    const result = issue('2026-08-06T09:00:00Z');

    expect(result.result).toBe('Issued');
    expect(result.result === 'Issued' ? result.recordFingerprints[0] : '').toMatch(/^lr-sha256-[0-9a-f]{64}$/);
    expect(result.result === 'Issued' ? result.envelope.authorityRoot : '').toMatch(/^ar-sha256-[0-9a-f]{64}$/);
    expect(result.result === 'Issued' ? result.envelopeCommitment : '').toMatch(/^ec-sha256-[0-9a-f]{64}$/);
  });

  it('keeps the root invariant under declared facts while varying envelope commitment', () => {
    const first = issue('2026-08-06T09:00:00Z');
    const second = issue('2026-08-06T10:00:00Z');

    expect(first.result === 'Issued' && second.result === 'Issued' ? first.envelope.authorityRoot : '').toBe(
      second.result === 'Issued' ? second.envelope.authorityRoot : '',
    );
    expect(first.result === 'Issued' && second.result === 'Issued' ? first.envelopeCommitment : '').not.toBe(
      second.result === 'Issued' ? second.envelopeCommitment : '',
    );
  });
});

function active(): string {
  return `# NEXUS-RAT-2026-08-06-601

## Ratification Identifier

NEXUS-RAT-2026-08-06-601

## Date

2026-08-06

## Subject

Commitment subject.

## Current Status

Active
`;
}

