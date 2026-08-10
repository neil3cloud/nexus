import { describe, expect, it } from 'vitest';

import { issueRatificationAuthoritySnapshot } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance';
import {
  createRatificationAuthoritySnapshotRejectedResult,
  ratificationAuthoritySnapshotDiagnosticMetadata,
} from '../../../src/kernel/governance/ratification-authority-snapshot-issuance.contract';
import { RatificationAuthoritySnapshotIssuanceContractError } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance.errors';
import {
  ratificationAuthoritySnapshotDiagnosticCodes,
  ratificationAuthoritySnapshotDiagnosticPhases,
} from '../../../src/kernel/governance/ratification-authority-snapshot-issuance.types';
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

  it('objective test 5 — createRatificationAuthoritySnapshotRejectedResult raises RatificationAuthoritySnapshotIssuanceContractError carrying malformed-diagnostic-payload for invalid payloads', () => {
    const throwsMalformedPayload = (fn: () => unknown): void => {
      let thrown: unknown;

      try {
        fn();
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(RatificationAuthoritySnapshotIssuanceContractError);

      if (thrown instanceof RatificationAuthoritySnapshotIssuanceContractError) {
        expect(thrown.contractViolationCode).toBe('malformed-diagnostic-payload');
        expect(thrown.diagnosticPhase).toBe('ContractViolation');
        expect(thrown.diagnosticPrecedence).toBe(9);
      }
    };

    throwsMalformedPayload(() =>
      createRatificationAuthoritySnapshotRejectedResult('invalid-input', {
        payloadKind: 'EntryPayload',
        ratificationIdentifier: 'NEXUS-RAT-2026-01-01-001',
      }),
    );

    throwsMalformedPayload(() =>
      createRatificationAuthoritySnapshotRejectedResult('missing-section', {
        payloadKind: 'EntrySectionPayload',
        ratificationIdentifier: 'NEXUS-RAT-2026-01-01-001',
      } as never),
    );

    throwsMalformedPayload(() =>
      createRatificationAuthoritySnapshotRejectedResult('invalid-input', {
        payloadKind: 'NoPayload',
        extra: 'unexpected',
      } as never),
    );

    throwsMalformedPayload(() =>
      createRatificationAuthoritySnapshotRejectedResult('missing-identifier', {
        payloadKind: 'EntryPayload',
        ratificationIdentifier: 123,
      } as never),
    );

    throwsMalformedPayload(() =>
      createRatificationAuthoritySnapshotRejectedResult('missing-identifier', {
        payloadKind: 'EntryPayload',
        ratificationIdentifier: '',
      }),
    );

    throwsMalformedPayload(() =>
      createRatificationAuthoritySnapshotRejectedResult('cyclic-declaration-authority', {
        payloadKind: 'RelationPathPayload',
        pathIdentifiers: [],
      }),
    );
  });

  it('objective test 7 — exhaustive central-construction test across all 47 public codes', () => {
    const contractViolationCodes = [
      'undeclared-diagnostic',
      'malformed-diagnostic-payload',
      'internal-invariant-violation',
    ];
    const contractViolationPhase = 'ContractViolation';

    expect(ratificationAuthoritySnapshotDiagnosticCodes).toHaveLength(47);
    expect(ratificationAuthoritySnapshotDiagnosticPhases).toHaveLength(9);

    for (const contractViolationCode of contractViolationCodes) {
      expect(ratificationAuthoritySnapshotDiagnosticCodes).not.toContain(contractViolationCode);
    }

    expect(ratificationAuthoritySnapshotDiagnosticPhases).not.toContain(contractViolationPhase);

    for (const code of ratificationAuthoritySnapshotDiagnosticCodes) {
      const metadata = ratificationAuthoritySnapshotDiagnosticMetadata[code];
      const payload = buildValidPayload(metadata.payloadKind);
      const result = createRatificationAuthoritySnapshotRejectedResult(code, payload);

      expect(result.result).toBe('Rejected');

      if (result.result === 'Rejected') {
        expect(ratificationAuthoritySnapshotDiagnosticCodes).toContain(result.diagnosticCode);
        expect(ratificationAuthoritySnapshotDiagnosticPhases).toContain(result.diagnosticPhase);
        expect(contractViolationCodes).not.toContain(result.diagnosticCode);
        expect(result.diagnosticPhase).not.toBe(contractViolationPhase);
        expect(result).not.toHaveProperty('envelope');
        expect(result).not.toHaveProperty('envelopeCommitment');
        expect(result).not.toHaveProperty('records');
      }
    }

    const issuedResult = issue(active());

    expect(issuedResult.result).toBe('Issued');
    expect(issuedResult).not.toHaveProperty('diagnosticCode');
    expect(issuedResult).not.toHaveProperty('diagnosticPhase');
    expect(issuedResult).not.toHaveProperty('diagnosticPrecedence');
    expect(issuedResult).not.toHaveProperty('diagnosticPayload');
    expect(issuedResult).not.toHaveProperty('detail');
  });
});

function buildValidPayload(payloadKind: string): Record<string, unknown> {
  switch (payloadKind) {
    case 'NoPayload':
      return { payloadKind: 'NoPayload' };
    case 'EntryPayload':
      return { payloadKind: 'EntryPayload', ratificationIdentifier: 'NEXUS-RAT-2026-01-01-001' };
    case 'EntrySectionPayload':
      return {
        payloadKind: 'EntrySectionPayload',
        ratificationIdentifier: 'NEXUS-RAT-2026-01-01-001',
        sectionHeading: '## Subject',
      };
    case 'DeclarationPayload':
      return {
        payloadKind: 'DeclarationPayload',
        declaringAuthority: 'authority',
        declarationSubject: 'subject',
      };
    case 'DeclarationScopePayload':
      return {
        payloadKind: 'DeclarationScopePayload',
        declaringAuthority: 'authority',
        declarationSubject: 'subject',
        scopeKey: 'key',
      };
    case 'RelationPathPayload':
      return { payloadKind: 'RelationPathPayload', pathIdentifiers: ['A', 'B'] };
    case 'DeclaredInputPayload':
      return { payloadKind: 'DeclaredInputPayload', declaredField: 'someField' };
    default:
      throw new Error(`Unknown payloadKind: ${payloadKind}`);
  }
}

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

