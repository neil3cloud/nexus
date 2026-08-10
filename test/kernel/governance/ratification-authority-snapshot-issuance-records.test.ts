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

describe('RatificationAuthoritySnapshotIssuance records and segments', () => {
  it('emits seven-field declared record shape only through its discriminated arm', () => {
    const result = issueRatificationAuthoritySnapshot({
      source: RatificationAuthoritySnapshotSource.fromBytes(Buffer.from(active(), 'utf8')),
      ...facts,
    });

    expect(result.result).toBe('Issued');
    expect(result.result === 'Issued' ? result.records[0] : undefined).toEqual({
      lifecycleAuthorityKind: 'GenericSourceRule',
      ratificationIdentifier: 'NEXUS-RAT-2026-08-06-401',
      ratificationDate: '2026-08-06',
      ratificationSubject: 'Records subject.',
      lifecycleResolutionForm: 'WholeRecordLifecycle',
      lifecycleSegments: [
        {
          scopeKind: 'ResidualScope',
          scopeKey: 'residual',
          lifecycleStatus: 'Effective',
          lifecycleRelations: [],
        },
      ],
    });
  });

  it('keeps lifecycleResolutionForm separate from lifecycle status', () => {
    const result = issueRatificationAuthoritySnapshot({
      source: RatificationAuthoritySnapshotSource.fromBytes(Buffer.from(active(), 'utf8')),
      ...facts,
    });

    expect(result.result === 'Issued' ? result.records[0]?.lifecycleResolutionForm : undefined).toBe(
      'WholeRecordLifecycle',
    );
    expect(result.result === 'Issued' ? result.records[0]?.lifecycleSegments[0]?.lifecycleStatus : undefined).toBe(
      'Effective',
    );
  });
});

function active(): string {
  return `# NEXUS-RAT-2026-08-06-401

## Ratification Identifier

NEXUS-RAT-2026-08-06-401

## Date

2026-08-06

## Subject

Records subject.

## Current Status

Active
`;
}

