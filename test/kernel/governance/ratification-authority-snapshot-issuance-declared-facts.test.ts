import { describe, expect, it } from 'vitest';

import { issueRatificationAuthoritySnapshot } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance';
import { RatificationAuthoritySnapshotSource } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance.types';

describe('RatificationAuthoritySnapshotIssuance declared facts', () => {
  it('rejects malformed capturedAt values and does not synthesize a clock value', () => {
    for (const capturedAt of [
      '2026-08-06T09:00:00+08:00',
      '2026-08-06T09:00:00.000Z',
      '2026-08-06T09:00:00',
      '2026-08-06T24:00:00Z',
      '2026-08-06T23:59:60Z',
      '2026-02-31T09:00:00Z',
    ]) {
      expect(issue(capturedAt)).toMatchObject({ diagnosticCode: 'malformed-capture-instant' });
    }
  });

  it('rejects empty attribution members and unrecognized declared fields', () => {
    expect(
      issueRatificationAuthoritySnapshot({
        source: RatificationAuthoritySnapshotSource.fromBytes(Buffer.from(active(), 'utf8')),
        capturedAt: '2026-08-06T09:00:00Z',
        producingAttribution: {
          producingImplementationIdentity: '',
          producingImplementationRevision: 'rev-1',
        },
      }),
    ).toMatchObject({ diagnosticCode: 'malformed-attribution' });

    expect(
      issueRatificationAuthoritySnapshot({
        source: RatificationAuthoritySnapshotSource.fromBytes(Buffer.from(active(), 'utf8')),
        capturedAt: '2026-08-06T09:00:00Z',
        producingAttribution: {
          producingImplementationIdentity: 'test',
          producingImplementationRevision: 'rev-1',
        },
        authorityRoot: 'ar-sha256-ignored',
      }),
    ).toMatchObject({ diagnosticPayload: { declaredField: 'authorityRoot' } });
  });
});

function issue(capturedAt: string): ReturnType<typeof issueRatificationAuthoritySnapshot> {
  return issueRatificationAuthoritySnapshot({
    source: RatificationAuthoritySnapshotSource.fromBytes(Buffer.from(active(), 'utf8')),
    capturedAt,
    producingAttribution: {
      producingImplementationIdentity: 'test',
      producingImplementationRevision: 'rev-1',
    },
  });
}

function active(): string {
  return `# NEXUS-RAT-2026-08-06-701

## Ratification Identifier

NEXUS-RAT-2026-08-06-701

## Date

2026-08-06

## Subject

Fact subject.

## Current Status

Active
`;
}

