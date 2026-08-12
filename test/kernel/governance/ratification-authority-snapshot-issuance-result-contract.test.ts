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
import type { RatificationAuthoritySnapshotDiagnosticPayload } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance.types';
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

  it('rule-4 guard — createRatificationAuthoritySnapshotRejectedResult raises RatificationAuthoritySnapshotIssuanceContractError carrying undeclared-diagnostic for each contract-violation code', () => {
    const contractViolationCodes = [
      'undeclared-diagnostic',
      'malformed-diagnostic-payload',
      'internal-invariant-violation',
    ] as const;

    for (const code of contractViolationCodes) {
      let thrown: unknown;

      try {
        createRatificationAuthoritySnapshotRejectedResult(
          code as never,
          { payloadKind: 'NoPayload' },
        );
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(RatificationAuthoritySnapshotIssuanceContractError);

      if (thrown instanceof RatificationAuthoritySnapshotIssuanceContractError) {
        expect(thrown.contractViolationCode).toBe('undeclared-diagnostic');
        expect(thrown.diagnosticPhase).toBe('ContractViolation');
        expect(thrown.diagnosticPrecedence).toBe(9);
      }
    }
  });

  it('objective test 4 — createRatificationAuthoritySnapshotRejectedResult raises RatificationAuthoritySnapshotIssuanceContractError carrying undeclared-diagnostic for an arbitrary undeclared code', () => {
    let result: unknown;
    let thrown: unknown;

    try {
      result = createRatificationAuthoritySnapshotRejectedResult(
        'bt-082-008-arbitrary-undeclared-code' as never,
        { payloadKind: 'NoPayload' },
      );
    } catch (error) {
      thrown = error;
    }

    expect(result).toBeUndefined();
    expect(thrown).toBeInstanceOf(RatificationAuthoritySnapshotIssuanceContractError);

    if (thrown instanceof RatificationAuthoritySnapshotIssuanceContractError) {
      expect(thrown.contractViolationCode).toBe('undeclared-diagnostic');
      expect(thrown.diagnosticPhase).toBe('ContractViolation');
      expect(thrown.diagnosticPrecedence).toBe(9);
    }
  });
});

describe('RFC-0011 v1.10 — code-aware empty data-String field admission', () => {
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
    }
  };

  it('admits empty scopeKey for malformed-scope-key', () => {
    const result = createRatificationAuthoritySnapshotRejectedResult('malformed-scope-key', {
      payloadKind: 'DeclarationScopePayload',
      declaringAuthority: 'auth',
      declarationSubject: 'subj',
      scopeKey: '',
    });

    expect(result.result).toBe('Rejected');
  });

  it('admits empty declaredField for malformed-attribution', () => {
    const result = createRatificationAuthoritySnapshotRejectedResult('malformed-attribution', {
      payloadKind: 'DeclaredInputPayload',
      declaredField: '',
    });

    expect(result.result).toBe('Rejected');
  });

  it('refuses empty data-String fields for all 61 non-exempt (code, field) pairs', () => {
    // EntryPayload: ratificationIdentifier — 17 codes
    const entryPayloadCodes = [
      'missing-identifier', 'identifier-grammar-violation', 'identifier-heading-mismatch',
      'malformed-date', 'malformed-status', 'missing-subject', 'duplicate-entry-identifier',
      'missing-declaration-block', 'unterminated-declaration-block', 'nested-declaration-block',
      'extraneous-declaration-content', 'empty-declaration-block', 'declaration-grammar-violation',
      'declaration-subject-grammar-violation', 'declarant-not-effective', 'unresolved-lifecycle',
      'duplicate-record-fingerprint',
    ] as const;

    for (const code of entryPayloadCodes) {
      throwsMalformedPayload(() =>
        createRatificationAuthoritySnapshotRejectedResult(code, {
          payloadKind: 'EntryPayload',
          ratificationIdentifier: '',
        }),
      );
    }

    // EntrySectionPayload: ratificationIdentifier — 2 codes
    const entrySectionPayloadCodes = ['missing-section', 'duplicate-section'] as const;

    for (const code of entrySectionPayloadCodes) {
      throwsMalformedPayload(() =>
        createRatificationAuthoritySnapshotRejectedResult(code, {
          payloadKind: 'EntrySectionPayload',
          ratificationIdentifier: '',
          sectionHeading: '## S',
        }),
      );
    }

    // EntrySectionPayload: sectionHeading — 2 codes
    for (const code of entrySectionPayloadCodes) {
      throwsMalformedPayload(() =>
        createRatificationAuthoritySnapshotRejectedResult(code, {
          payloadKind: 'EntrySectionPayload',
          ratificationIdentifier: 'NEXUS-RAT-2026-01-01-001',
          sectionHeading: '',
        }),
      );
    }

    // DeclarationPayload: declaringAuthority — 11 codes
    const declarationPayloadCodes = [
      'unsupported-lifecycle-form', 'relation-target-grammar-violation', 'unsupported-lifecycle-status',
      'unsupported-relation-kind', 'degenerate-segmentation', 'duplicate-declaration-subject',
      'self-referential-declaration', 'absent-declaration-subject', 'generic-rule-conflict',
      'status-binding-mismatch', 'duplicate-declaration',
    ] as const;

    for (const code of declarationPayloadCodes) {
      throwsMalformedPayload(() =>
        createRatificationAuthoritySnapshotRejectedResult(code, {
          payloadKind: 'DeclarationPayload',
          declaringAuthority: '',
          declarationSubject: 'subj',
        }),
      );
    }

    // DeclarationPayload: declarationSubject — 11 codes
    for (const code of declarationPayloadCodes) {
      throwsMalformedPayload(() =>
        createRatificationAuthoritySnapshotRejectedResult(code, {
          payloadKind: 'DeclarationPayload',
          declaringAuthority: 'auth',
          declarationSubject: '',
        }),
      );
    }

    // DeclarationScopePayload: declaringAuthority — 6 codes
    const declarationScopePayloadCodes = [
      'malformed-scope-key', 'missing-scope-description', 'residual-scope-description',
      'duplicate-scope-key', 'incomplete-segmentation', 'status-relation-mismatch',
    ] as const;

    for (const code of declarationScopePayloadCodes) {
      throwsMalformedPayload(() =>
        createRatificationAuthoritySnapshotRejectedResult(code, {
          payloadKind: 'DeclarationScopePayload',
          declaringAuthority: '',
          declarationSubject: 'subj',
          scopeKey: 'key',
        }),
      );
    }

    // DeclarationScopePayload: declarationSubject — 6 codes
    for (const code of declarationScopePayloadCodes) {
      throwsMalformedPayload(() =>
        createRatificationAuthoritySnapshotRejectedResult(code, {
          payloadKind: 'DeclarationScopePayload',
          declaringAuthority: 'auth',
          declarationSubject: '',
          scopeKey: 'key',
        }),
      );
    }

    // DeclarationScopePayload: scopeKey — 5 non-exempt codes (malformed-scope-key is exempt)
    const nonExemptScopeKeyCodes = [
      'missing-scope-description', 'residual-scope-description', 'duplicate-scope-key',
      'incomplete-segmentation', 'status-relation-mismatch',
    ] as const;

    for (const code of nonExemptScopeKeyCodes) {
      throwsMalformedPayload(() =>
        createRatificationAuthoritySnapshotRejectedResult(code, {
          payloadKind: 'DeclarationScopePayload',
          declaringAuthority: 'auth',
          declarationSubject: 'subj',
          scopeKey: '',
        }),
      );
    }

    // DeclaredInputPayload: declaredField — 1 non-exempt code (malformed-attribution is exempt)
    throwsMalformedPayload(() =>
      createRatificationAuthoritySnapshotRejectedResult('malformed-capture-instant', {
        payloadKind: 'DeclaredInputPayload',
        declaredField: '',
      }),
    );
  });

  it('refuses empty scopeKey for duplicate-scope-key (same field, non-exempt code)', () => {
    throwsMalformedPayload(() =>
      createRatificationAuthoritySnapshotRejectedResult('duplicate-scope-key', {
        payloadKind: 'DeclarationScopePayload',
        declaringAuthority: 'auth',
        declarationSubject: 'subj',
        scopeKey: '',
      }),
    );
  });

  it('refuses empty declaredField for malformed-capture-instant (same field, non-exempt code)', () => {
    throwsMalformedPayload(() =>
      createRatificationAuthoritySnapshotRejectedResult('malformed-capture-instant', {
        payloadKind: 'DeclaredInputPayload',
        declaredField: '',
      }),
    );
  });

  it('refuses empty declaringAuthority for malformed-scope-key (non-exempt field of exempt code)', () => {
    throwsMalformedPayload(() =>
      createRatificationAuthoritySnapshotRejectedResult('malformed-scope-key', {
        payloadKind: 'DeclarationScopePayload',
        declaringAuthority: '',
        declarationSubject: 'subj',
        scopeKey: '',
      }),
    );
  });

  it('refuses empty declarationSubject for malformed-scope-key (non-exempt field of exempt code)', () => {
    throwsMalformedPayload(() =>
      createRatificationAuthoritySnapshotRejectedResult('malformed-scope-key', {
        payloadKind: 'DeclarationScopePayload',
        declaringAuthority: 'auth',
        declarationSubject: '',
        scopeKey: '',
      }),
    );
  });

  it('refuses wrong payloadKind for all 47 codes', () => {
    for (const code of ratificationAuthoritySnapshotDiagnosticCodes) {
      const expectedKind = ratificationAuthoritySnapshotDiagnosticMetadata[code].payloadKind;

      // Supply any kind that is different from the expected one
      const wrongKind: RatificationAuthoritySnapshotDiagnosticPayload =
        expectedKind === 'NoPayload'
          ? { payloadKind: 'EntryPayload', ratificationIdentifier: 'NEXUS-RAT-2026-01-01-001' }
          : { payloadKind: 'NoPayload' };

      throwsMalformedPayload(() =>
        createRatificationAuthoritySnapshotRejectedResult(code, wrongKind),
      );
    }
  });

  it('refuses empty payloadKind for all 47 codes', () => {
    for (const code of ratificationAuthoritySnapshotDiagnosticCodes) {
      throwsMalformedPayload(() =>
        createRatificationAuthoritySnapshotRejectedResult(code, {
          payloadKind: '' as never,
        }),
      );
    }
  });
});

function buildValidPayload(
  payloadKind: RatificationAuthoritySnapshotDiagnosticPayload['payloadKind'],
): RatificationAuthoritySnapshotDiagnosticPayload {
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

