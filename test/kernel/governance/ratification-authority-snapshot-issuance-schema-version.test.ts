import { describe, expect, it } from 'vitest';

import { issueRatificationAuthoritySnapshot } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance';
import { RatificationAuthoritySnapshotSource } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance.types';

describe('RatificationAuthoritySnapshotIssuance schema version', () => {
  it('always emits the fixed v3 issuer-side schema version and exposes no caller override', () => {
    const result = issueRatificationAuthoritySnapshot({
      source: RatificationAuthoritySnapshotSource.fromBytes(Buffer.from(active(), 'utf8')),
      capturedAt: '2026-08-06T09:00:00Z',
      producingAttribution: {
        producingImplementationIdentity: 'test-issuer',
        producingImplementationRevision: 'rev-1',
      },
    });

    expect(result.result === 'Issued' ? result.envelope.snapshotSchemaVersion : undefined).toBe(
      'nexus-ratification-authority-snapshot/3',
    );
  });
});

function active(): string {
  return `# NEXUS-RAT-2026-08-06-100

## Ratification Identifier

NEXUS-RAT-2026-08-06-100

## Date

2026-08-06

## Subject

Schema subject.

## Current Status

Active
`;
}

