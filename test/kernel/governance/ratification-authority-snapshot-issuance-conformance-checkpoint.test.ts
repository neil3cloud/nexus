import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { issueRatificationAuthoritySnapshot } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance';
import { RatificationAuthoritySnapshotSource } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance.types';

describe('RatificationAuthoritySnapshotIssuance live conformance checkpoint', () => {
  it('runs over the live Ratification Ledger and reports a total result without writing to it', () => {
    const path = 'knowledge/governance/RATIFICATION_LEDGER.md';
    const before = readFileSync(path);
    const result = issueRatificationAuthoritySnapshot({
      source: RatificationAuthoritySnapshotSource.fromBytes(before),
      capturedAt: '2026-08-06T09:00:00Z',
      producingAttribution: {
        producingImplementationIdentity: 'sprint-82-conformance-checkpoint',
        producingImplementationRevision: 'working-tree',
      },
    });
    const after = readFileSync(path);

    expect(['Issued', 'Rejected']).toContain(result.result);
    expect(after.equals(before)).toBe(true);
  });
});
