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

    expect(ratificationAuthoritySnapshotDiagnosticCodes).toHaveLength(46);
    expect(result.result).toBe('Rejected');
    expect(
      result.result === 'Rejected'
        ? ratificationAuthoritySnapshotDiagnosticCodes.includes(result.diagnosticCode)
        : false,
    ).toBe(true);
  });
});

function issue(text: string): ReturnType<typeof issueRatificationAuthoritySnapshot> {
  return issueRatificationAuthoritySnapshot({
    source: RatificationAuthoritySnapshotSource.fromBytes(Buffer.from(text, 'utf8')),
    ...facts,
  });
}

