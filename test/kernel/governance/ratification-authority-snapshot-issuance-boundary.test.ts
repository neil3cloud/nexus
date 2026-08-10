import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { issueRatificationAuthoritySnapshot } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance';
import { RatificationAuthoritySnapshotSource } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance.types';

describe('RatificationAuthoritySnapshotIssuance Boundary A', () => {
  it('is not composed by createKernelServices and does not return validation outcomes', () => {
    const composition = readFileSync('src/kernel/common/create-kernel-services.ts', 'utf8');
    const result = issueRatificationAuthoritySnapshot({
      source: RatificationAuthoritySnapshotSource.fromBytes(Buffer.from(active(), 'utf8')),
      capturedAt: '2026-08-06T09:00:00Z',
      producingAttribution: {
        producingImplementationIdentity: 'test-issuer',
        producingImplementationRevision: 'rev-1',
      },
    });

    expect(composition).not.toContain('ratification-authority-snapshot-issuance');
    expect(['Valid', 'Invalid', 'Unresolvable']).not.toContain(result.result);
  });

  it('does not import GovernanceDecision, PolicyEvaluation, event, host, or adapter surfaces', () => {
    const source = readFileSync('src/kernel/governance/ratification-authority-snapshot-issuance.ts', 'utf8');

    expect(source).not.toMatch(/GovernanceDecision|PolicyEvaluation|events|hosts|adapters/);
  });
});

function active(): string {
  return `# NEXUS-RAT-2026-08-06-110

## Ratification Identifier

NEXUS-RAT-2026-08-06-110

## Date

2026-08-06

## Subject

Boundary subject.

## Current Status

Active
`;
}

