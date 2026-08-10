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

function source(text: string): RatificationAuthoritySnapshotSource {
  return RatificationAuthoritySnapshotSource.fromBytes(Buffer.from(text, 'utf8'));
}

function active(status = 'Active'): string {
  return `# NEXUS-RAT-2026-08-06-101

## Ratification Identifier

NEXUS-RAT-2026-08-06-101

## Date

2026-08-06

## Subject

Source domain subject.

## Current Status

${status}
`;
}

describe('RatificationAuthoritySnapshotIssuance source domain and preparation', () => {
  it('accepts only the declared carrier type and rejects byte-identical alternatives', () => {
    expect(issueRatificationAuthoritySnapshot({ source: source(active()), ...facts }).result).toBe('Issued');
    expect(issueRatificationAuthoritySnapshot({ source: Buffer.from(active(), 'utf8'), ...facts })).toMatchObject({
      result: 'Rejected',
      diagnosticCode: 'invalid-input',
    });
  });

  it('rejects invalid UTF-8 and byte order marks at every position', () => {
    expect(
      issueRatificationAuthoritySnapshot({
        source: RatificationAuthoritySnapshotSource.fromBytes(Uint8Array.from([0xff])),
        ...facts,
      }),
    ).toMatchObject({ diagnosticCode: 'invalid-utf8' });

    for (const text of [`\uFEFF${active()}`, `${active()}\uFEFF`, active().replace('Subject', 'Sub\uFEFFject')]) {
      expect(issueRatificationAuthoritySnapshot({ source: source(text), ...facts })).toMatchObject({
        diagnosticCode: 'byte-order-mark-present',
      });
    }
  });

  it('normalizes line endings and NFC without trimming status text or mutating source octets', () => {
    const original = active('Active ').replace(/\n/g, '\r\n');
    const bytes = Buffer.from(original, 'utf8');
    const carrier = RatificationAuthoritySnapshotSource.fromBytes(bytes);

    expect(issueRatificationAuthoritySnapshot({ source: carrier, ...facts })).toMatchObject({
      result: 'Rejected',
      diagnosticCode: 'unresolved-lifecycle',
    });
    expect(Buffer.from(carrier.toBytes()).equals(bytes)).toBe(true);
  });
});

