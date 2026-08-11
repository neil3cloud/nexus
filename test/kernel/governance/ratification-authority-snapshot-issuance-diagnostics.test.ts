import { describe, expect, it } from 'vitest';

import { issueRatificationAuthoritySnapshot } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance';
import { ratificationAuthoritySnapshotDiagnosticCodes } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance.types';
import { RatificationAuthoritySnapshotSource } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance.types';

const facts = {
  capturedAt: '2026-08-06T09:00:00Z',
  producingAttribution: {
    producingImplementationIdentity: 'test-issuer',
    producingImplementationRevision: 'rev-1',
  },
} as const;

describe('RatificationAuthoritySnapshotIssuance diagnostics', () => {
  it('reports lower-ranked phase defects before later phase defects', () => {
    const result = issue(`# NEXUS-RAT-2026-08-06-901

## Ratification Identifier

NEXUS-RAT-2026-08-06-901
`);

    expect(result).toMatchObject({
      diagnosticCode: 'missing-section',
      diagnosticPhase: 'EntryStructure',
      diagnosticPrecedence: 1,
    });
  });

  it('keeps every public diagnostic code in the closed vocabulary and emits none outside it', () => {
    const result = issue('not a ledger');

    expect(ratificationAuthoritySnapshotDiagnosticCodes).toHaveLength(47);
    expect(result.result).toBe('Rejected');
    expect(
      result.result === 'Rejected'
        ? ratificationAuthoritySnapshotDiagnosticCodes.includes(result.diagnosticCode)
        : false,
    ).toBe(true);
  });

  it('objective test 3 — malformed-capture-instant and malformed-attribution carry diagnosticPhase Envelope and diagnosticPrecedence 8', () => {
    const captureInstantResult = issueRatificationAuthoritySnapshot({
      source: RatificationAuthoritySnapshotSource.fromBytes(Buffer.from(active(), 'utf8')),
      capturedAt: 'not-a-valid-timestamp',
      producingAttribution: facts.producingAttribution,
    });

    expect(captureInstantResult).toMatchObject({
      result: 'Rejected',
      diagnosticCode: 'malformed-capture-instant',
      diagnosticPhase: 'Envelope',
      diagnosticPrecedence: 8,
    });

    const attributionResult = issueRatificationAuthoritySnapshot({
      source: RatificationAuthoritySnapshotSource.fromBytes(Buffer.from(active(), 'utf8')),
      capturedAt: facts.capturedAt,
      producingAttribution: { producingImplementationIdentity: '', producingImplementationRevision: 'rev-1' },
    });

    expect(attributionResult).toMatchObject({
      result: 'Rejected',
      diagnosticCode: 'malformed-attribution',
      diagnosticPhase: 'Envelope',
      diagnosticPrecedence: 8,
    });
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

