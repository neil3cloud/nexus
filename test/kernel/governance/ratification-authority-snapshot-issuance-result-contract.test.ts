import { describe, expect, it } from 'vitest';

import { issueRatificationAuthoritySnapshot } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance';
import { RatificationAuthoritySnapshotSource } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance.types';

const facts = {
  capturedAt: '2026-08-06T09:00:00Z',
  producingAttribution: {
    producingImplementationIdentity: 'test-issuer',
    producingImplementationRevision: 'rev-1',
  },
} as const;

describe('RatificationAuthoritySnapshotIssuance total result contract', () => {
  it('emits the exact Issued result field list and derived counts', () => {
    const result = issue(active());

    expect(Object.keys(result)).toEqual([
      'result',
      'envelope',
      'envelopeCommitment',
      'records',
      'recordFingerprints',
      'declarationCount',
      'genericCount',
      'segmentedCount',
    ]);
    expect(result.result).toBe('Issued');
    expect(result.result === 'Issued' ? Object.keys(result.envelope) : []).toEqual([
      'authorityRoot',
      'authoritySourceIdentity',
      'authoritySourceRevision',
      'canonicalSerializationProtocolId',
      'capturedAt',
      'producingAttribution',
      'recordCount',
      'snapshotSchemaVersion',
    ]);
    expect(result.result === 'Issued' ? result.declarationCount + result.genericCount : -1).toBe(
      result.result === 'Issued' ? result.envelope.recordCount : -2,
    );
  });

  it('emits Rejected without a partial snapshot', () => {
    const result = issue('not a ledger');

    expect(Object.keys(result)).toEqual([
      'result',
      'diagnosticCode',
      'diagnosticPhase',
      'diagnosticPrecedence',
      'diagnosticPayload',
      'detail',
    ]);
    expect(result).not.toHaveProperty('records');
  });
});

function issue(text: string): ReturnType<typeof issueRatificationAuthoritySnapshot> {
  return issueRatificationAuthoritySnapshot({
    source: RatificationAuthoritySnapshotSource.fromBytes(Buffer.from(text, 'utf8')),
    ...facts,
  });
}

function active(): string {
  return `# NEXUS-RAT-2026-08-06-801

## Ratification Identifier

NEXUS-RAT-2026-08-06-801

## Date

2026-08-06

## Subject

Result subject.

## Current Status

Active
`;
}

