import { createHash } from 'node:crypto';

import type {
  RatificationAuthoritySnapshotDiagnosticCode,
  RatificationAuthoritySnapshotDiagnosticPayload,
  RatificationAuthoritySnapshotDiagnosticPhase,
  RatificationAuthoritySnapshotIssuanceResult,
  RatificationAuthoritySnapshotLifecycleRelation,
  RatificationAuthoritySnapshotLifecycleSegment,
  RatificationAuthoritySnapshotProducingAttribution,
  RatificationAuthoritySnapshotRecord,
} from './ratification-authority-snapshot-issuance.types';
import {
  ratificationAuthoritySnapshotCanonicalSerializationProtocolId,
  ratificationAuthoritySnapshotDiagnosticCodes,
  ratificationAuthoritySnapshotSchemaVersion,
  ratificationAuthoritySnapshotSourceIdentity,
} from './ratification-authority-snapshot-issuance.types';
import {
  RatificationAuthoritySnapshotIssuanceContractError,
} from './ratification-authority-snapshot-issuance.errors';

export {
  ratificationAuthoritySnapshotCanonicalSerializationProtocolId,
  ratificationAuthoritySnapshotSchemaVersion,
  ratificationAuthoritySnapshotSourceIdentity,
};

export const ratificationAuthoritySnapshotRecordFingerprintPrefix = 'lr-sha256-' as const;
export const ratificationAuthoritySnapshotAuthorityRootPrefix = 'ar-sha256-' as const;
export const ratificationAuthoritySnapshotEnvelopeCommitmentPrefix = 'ec-sha256-' as const;
export const ratificationAuthoritySnapshotResidualScopeKey = 'residual' as const;
export const ratificationAuthoritySnapshotGenericRuleStatusText = 'Active' as const;
export const ratificationAuthoritySnapshotDeclarationBlockFormat =
  'nexus-lifecycle-authority-declarations/1' as const;

export const ratificationAuthoritySnapshotDiagnosticMetadata: Readonly<
  Record<
    RatificationAuthoritySnapshotDiagnosticCode,
    {
      readonly phase: RatificationAuthoritySnapshotDiagnosticPhase;
      readonly precedence: number;
      readonly payloadKind: RatificationAuthoritySnapshotDiagnosticPayload['payloadKind'];
    }
  >
> = Object.freeze({
  'invalid-input': { phase: 'SourceIntegrity', precedence: 0, payloadKind: 'NoPayload' },
  'invalid-utf8': { phase: 'SourceIntegrity', precedence: 0, payloadKind: 'NoPayload' },
  'byte-order-mark-present': { phase: 'SourceIntegrity', precedence: 0, payloadKind: 'NoPayload' },
  'no-entries': { phase: 'EntryStructure', precedence: 1, payloadKind: 'NoPayload' },
  'unterminated-fenced-region': { phase: 'EntryStructure', precedence: 1, payloadKind: 'NoPayload' },
  'missing-section': { phase: 'EntryStructure', precedence: 1, payloadKind: 'EntrySectionPayload' },
  'duplicate-section': { phase: 'EntryStructure', precedence: 1, payloadKind: 'EntrySectionPayload' },
  'missing-identifier': { phase: 'EntryStructure', precedence: 1, payloadKind: 'EntryPayload' },
  'identifier-grammar-violation': { phase: 'EntryStructure', precedence: 1, payloadKind: 'EntryPayload' },
  'identifier-heading-mismatch': { phase: 'EntryStructure', precedence: 1, payloadKind: 'EntryPayload' },
  'malformed-date': { phase: 'EntryStructure', precedence: 1, payloadKind: 'EntryPayload' },
  'malformed-status': { phase: 'EntryStructure', precedence: 1, payloadKind: 'EntryPayload' },
  'missing-subject': { phase: 'EntryStructure', precedence: 1, payloadKind: 'EntryPayload' },
  'duplicate-entry-identifier': { phase: 'EntryStructure', precedence: 1, payloadKind: 'EntryPayload' },
  'missing-declaration-block': { phase: 'DeclarationGrammar', precedence: 2, payloadKind: 'EntryPayload' },
  'unterminated-declaration-block': { phase: 'DeclarationGrammar', precedence: 2, payloadKind: 'EntryPayload' },
  'nested-declaration-block': { phase: 'DeclarationGrammar', precedence: 2, payloadKind: 'EntryPayload' },
  'extraneous-declaration-content': { phase: 'DeclarationGrammar', precedence: 2, payloadKind: 'EntryPayload' },
  'empty-declaration-block': { phase: 'DeclarationGrammar', precedence: 2, payloadKind: 'EntryPayload' },
  'declaration-grammar-violation': { phase: 'DeclarationGrammar', precedence: 2, payloadKind: 'EntryPayload' },
  'declaration-subject-grammar-violation': { phase: 'DeclarationGrammar', precedence: 2, payloadKind: 'EntryPayload' },
  'unsupported-lifecycle-form': { phase: 'DeclarationGrammar', precedence: 2, payloadKind: 'DeclarationPayload' },
  'relation-target-grammar-violation': { phase: 'DeclarationGrammar', precedence: 2, payloadKind: 'DeclarationPayload' },
  'unsupported-lifecycle-status': { phase: 'DeclarationGrammar', precedence: 2, payloadKind: 'DeclarationPayload' },
  'unsupported-relation-kind': { phase: 'DeclarationGrammar', precedence: 2, payloadKind: 'DeclarationPayload' },
  'degenerate-segmentation': { phase: 'DeclarationGrammar', precedence: 2, payloadKind: 'DeclarationPayload' },
  'duplicate-declaration-subject': { phase: 'DeclarationGrammar', precedence: 2, payloadKind: 'DeclarationPayload' },
  'malformed-scope-key': { phase: 'DeclarationGrammar', precedence: 2, payloadKind: 'DeclarationScopePayload' },
  'missing-scope-description': { phase: 'DeclarationGrammar', precedence: 2, payloadKind: 'DeclarationScopePayload' },
  'residual-scope-description': { phase: 'DeclarationGrammar', precedence: 2, payloadKind: 'DeclarationScopePayload' },
  'duplicate-scope-key': { phase: 'DeclarationGrammar', precedence: 2, payloadKind: 'DeclarationScopePayload' },
  'incomplete-segmentation': { phase: 'DeclarationGrammar', precedence: 2, payloadKind: 'DeclarationScopePayload' },
  'status-relation-mismatch': { phase: 'DeclarationGrammar', precedence: 2, payloadKind: 'DeclarationScopePayload' },
  'declarant-not-effective': { phase: 'DeclarantAuthority', precedence: 3, payloadKind: 'EntryPayload' },
  'self-referential-declaration': { phase: 'DeclarantAuthority', precedence: 3, payloadKind: 'DeclarationPayload' },
  'cyclic-declaration-authority': { phase: 'DeclarantAuthority', precedence: 3, payloadKind: 'RelationPathPayload' },
  'absent-declaration-subject': { phase: 'DeclarationBinding', precedence: 4, payloadKind: 'DeclarationPayload' },
  'generic-rule-conflict': { phase: 'DeclarationBinding', precedence: 4, payloadKind: 'DeclarationPayload' },
  'status-binding-mismatch': { phase: 'DeclarationBinding', precedence: 4, payloadKind: 'DeclarationPayload' },
  'duplicate-declaration': { phase: 'DeclarationBinding', precedence: 4, payloadKind: 'DeclarationPayload' },
  'absent-relation-target': { phase: 'LifecycleGraph', precedence: 5, payloadKind: 'RelationPathPayload' },
  'self-referential-relation': { phase: 'LifecycleGraph', precedence: 5, payloadKind: 'RelationPathPayload' },
  'cyclic-lifecycle-relation': { phase: 'LifecycleGraph', precedence: 5, payloadKind: 'RelationPathPayload' },
  'unresolved-lifecycle': { phase: 'Resolution', precedence: 6, payloadKind: 'EntryPayload' },
  'duplicate-record-fingerprint': { phase: 'Commitment', precedence: 7, payloadKind: 'EntryPayload' },
  'malformed-capture-instant': { phase: 'Envelope', precedence: 8, payloadKind: 'DeclaredInputPayload' },
  'malformed-attribution': { phase: 'Envelope', precedence: 8, payloadKind: 'DeclaredInputPayload' },
});

export function createRatificationAuthoritySnapshotRejectedResult(
  code: RatificationAuthoritySnapshotDiagnosticCode,
  diagnosticPayload: RatificationAuthoritySnapshotDiagnosticPayload,
): RatificationAuthoritySnapshotIssuanceResult {
  if (!ratificationAuthoritySnapshotDiagnosticCodes.includes(code)) {
    throw new RatificationAuthoritySnapshotIssuanceContractError(
      'undeclared-diagnostic',
      `Diagnostic code is not a member of the declared public vocabulary: ${String(code)}`,
    );
  }

  const metadata = ratificationAuthoritySnapshotDiagnosticMetadata[code];
  validateDiagnosticPayload(code, metadata.payloadKind, diagnosticPayload);

  return Object.freeze({
    result: 'Rejected',
    diagnosticCode: code,
    diagnosticPhase: metadata.phase,
    diagnosticPrecedence: metadata.precedence,
    diagnosticPayload: freezeDiagnosticPayload(diagnosticPayload),
    detail: renderDiagnosticPayload(diagnosticPayload),
  });
}

export function noPayload(): RatificationAuthoritySnapshotDiagnosticPayload {
  return Object.freeze({ payloadKind: 'NoPayload' });
}

export function renderDiagnosticPayload(
  diagnosticPayload: RatificationAuthoritySnapshotDiagnosticPayload,
): string {
  switch (diagnosticPayload.payloadKind) {
    case 'NoPayload':
      return '';
    case 'EntryPayload':
      return diagnosticPayload.ratificationIdentifier;
    case 'EntrySectionPayload':
      return `${diagnosticPayload.ratificationIdentifier} :: ${diagnosticPayload.sectionHeading}`;
    case 'DeclarationPayload':
      return `${diagnosticPayload.declaringAuthority} :: ${diagnosticPayload.declarationSubject}`;
    case 'DeclarationScopePayload':
      return `${diagnosticPayload.declaringAuthority} :: ${diagnosticPayload.declarationSubject} :: ${diagnosticPayload.scopeKey}`;
    case 'RelationPathPayload':
      return diagnosticPayload.pathIdentifiers.join(' -> ');
    case 'DeclaredInputPayload':
      return diagnosticPayload.declaredField;
  }
}

export function encodeNccsString(value: string): Uint8Array {
  const normalized = value.normalize('NFC').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const bytes = Buffer.from(normalized, 'utf8');

  return Buffer.concat([Buffer.from(`${bytes.byteLength}:`, 'utf8'), bytes]);
}

export function encodeNccsInteger(value: number): Uint8Array {
  return Buffer.from(`i${value}e`, 'utf8');
}

export function encodeNccsOrderedList(values: readonly Uint8Array[]): Uint8Array {
  return Buffer.concat([Buffer.from('l', 'utf8'), ...values, Buffer.from('e', 'utf8')]);
}

export function encodeNccsOrderInsensitiveStrings(values: readonly string[]): Uint8Array | undefined {
  const encoded = values.map((value) => ({
    value,
    encoded: encodeNccsString(value),
  }));
  const sorted = [...encoded].sort((left, right) => Buffer.compare(left.encoded, right.encoded));

  for (let index = 1; index < sorted.length; index += 1) {
    const current = sorted[index];
    const previous = sorted[index - 1];

    if (current !== undefined && previous !== undefined && Buffer.compare(current.encoded, previous.encoded) === 0) {
      return undefined;
    }
  }

  return encodeNccsOrderedList(sorted.map((entry) => entry.encoded));
}

export function encodeNccsRecord(fields: readonly [string, Uint8Array][]): Uint8Array {
  return Buffer.concat([
    Buffer.from('r', 'utf8'),
    encodeNccsInteger(fields.length),
    ...fields.flatMap(([fieldName, fieldValue]) => [encodeNccsString(fieldName), fieldValue]),
    Buffer.from('e', 'utf8'),
  ]);
}

export function encodeProducingAttribution(
  producingAttribution: RatificationAuthoritySnapshotProducingAttribution,
): Uint8Array {
  return encodeNccsRecord([
    ['producingImplementationIdentity', encodeNccsString(producingAttribution.producingImplementationIdentity)],
    ['producingImplementationRevision', encodeNccsString(producingAttribution.producingImplementationRevision)],
  ]);
}

export function encodeLifecycleRelation(
  relation: RatificationAuthoritySnapshotLifecycleRelation,
): Uint8Array {
  return encodeNccsRecord([
    ['relationKind', encodeNccsString(relation.relationKind)],
    ['relationTarget', encodeNccsString(relation.relationTarget)],
  ]);
}

export function encodeLifecycleSegment(
  segment: RatificationAuthoritySnapshotLifecycleSegment,
): Uint8Array {
  const relationBytes = encodeNccsOrderedList(segment.lifecycleRelations.map(encodeLifecycleRelation));

  if (segment.scopeKind === 'GovernedScope') {
    return encodeNccsRecord([
      ['scopeKind', encodeNccsString(segment.scopeKind)],
      ['scopeKey', encodeNccsString(segment.scopeKey)],
      ['scopeDescription', encodeNccsString(segment.scopeDescription)],
      ['lifecycleStatus', encodeNccsString(segment.lifecycleStatus)],
      ['lifecycleRelations', relationBytes],
    ]);
  }

  return encodeNccsRecord([
    ['scopeKind', encodeNccsString(segment.scopeKind)],
    ['scopeKey', encodeNccsString(segment.scopeKey)],
    ['lifecycleStatus', encodeNccsString(segment.lifecycleStatus)],
    ['lifecycleRelations', relationBytes],
  ]);
}

export function encodeLifecycleAuthorityRecord(
  record: RatificationAuthoritySnapshotRecord,
): Uint8Array {
  const segmentBytes = encodeNccsOrderedList(record.lifecycleSegments.map(encodeLifecycleSegment));

  if (record.lifecycleAuthorityKind === 'GenericSourceRule') {
    return encodeNccsRecord([
      ['lifecycleAuthorityKind', encodeNccsString(record.lifecycleAuthorityKind)],
      ['ratificationIdentifier', encodeNccsString(record.ratificationIdentifier)],
      ['ratificationDate', encodeNccsString(record.ratificationDate)],
      ['ratificationSubject', encodeNccsString(record.ratificationSubject)],
      ['lifecycleResolutionForm', encodeNccsString(record.lifecycleResolutionForm)],
      ['lifecycleSegments', segmentBytes],
    ]);
  }

  return encodeNccsRecord([
    ['lifecycleAuthorityKind', encodeNccsString(record.lifecycleAuthorityKind)],
    ['ratificationIdentifier', encodeNccsString(record.ratificationIdentifier)],
    ['ratificationDate', encodeNccsString(record.ratificationDate)],
    ['ratificationSubject', encodeNccsString(record.ratificationSubject)],
    ['lifecycleResolutionForm', encodeNccsString(record.lifecycleResolutionForm)],
    ['lifecycleDeclaringAuthority', encodeNccsString(record.lifecycleDeclaringAuthority)],
    ['lifecycleSegments', segmentBytes],
  ]);
}

export function assertKnownDiagnosticCode(
  code: RatificationAuthoritySnapshotDiagnosticCode,
): RatificationAuthoritySnapshotDiagnosticCode {
  if (!ratificationAuthoritySnapshotDiagnosticCodes.includes(code)) {
    return 'invalid-input';
  }

  return code;
}

function freezeDiagnosticPayload(
  diagnosticPayload: RatificationAuthoritySnapshotDiagnosticPayload,
): RatificationAuthoritySnapshotDiagnosticPayload {
  if (diagnosticPayload.payloadKind === 'RelationPathPayload') {
    return Object.freeze({
      ...diagnosticPayload,
      pathIdentifiers: Object.freeze([...diagnosticPayload.pathIdentifiers]),
    });
  }

  return Object.freeze({ ...diagnosticPayload });
}

const payloadFieldSets: Readonly<Record<RatificationAuthoritySnapshotDiagnosticPayload['payloadKind'], readonly string[]>> = Object.freeze({
  NoPayload: ['payloadKind'],
  EntryPayload: ['payloadKind', 'ratificationIdentifier'],
  EntrySectionPayload: ['payloadKind', 'ratificationIdentifier', 'sectionHeading'],
  DeclarationPayload: ['payloadKind', 'declaringAuthority', 'declarationSubject'],
  DeclarationScopePayload: ['payloadKind', 'declaringAuthority', 'declarationSubject', 'scopeKey'],
  RelationPathPayload: ['payloadKind', 'pathIdentifiers'],
  DeclaredInputPayload: ['payloadKind', 'declaredField'],
});

function validateDiagnosticPayload(
  code: RatificationAuthoritySnapshotDiagnosticCode,
  expectedKind: RatificationAuthoritySnapshotDiagnosticPayload['payloadKind'],
  payload: RatificationAuthoritySnapshotDiagnosticPayload,
): void {
  const contractViolation = (detail: string): never => {
    throw new RatificationAuthoritySnapshotIssuanceContractError(
      'malformed-diagnostic-payload',
      `Diagnostic payload is malformed: ${detail}`,
    );
  };

  if (payload.payloadKind !== expectedKind) {
    contractViolation(`expected payloadKind '${expectedKind}', got '${payload.payloadKind}'`);
  }

  const expectedFields = payloadFieldSets[expectedKind];
  const actualFields = Object.keys(payload as unknown as Record<string, unknown>);
  const expectedSet = new Set(expectedFields);
  const actualSet = new Set(actualFields);

  for (const field of expectedFields) {
    if (!actualSet.has(field)) {
      contractViolation(`missing field '${field}'`);
    }
  }

  for (const field of actualFields) {
    if (!expectedSet.has(field)) {
      contractViolation(`unexpected field '${field}'`);
    }
  }

  for (const field of actualFields) {
    if (field === 'payloadKind') continue;
    if (field === 'pathIdentifiers') continue;
    const value = (payload as unknown as Record<string, unknown>)[field];
    const isEmptyPermitted =
      (code === 'malformed-scope-key' && field === 'scopeKey') ||
      (code === 'malformed-attribution' && field === 'declaredField');
    if (typeof value !== 'string' || (value.length === 0 && !isEmptyPermitted)) {
      contractViolation(`field '${field}' must be a non-empty string`);
    }
  }

  if (payload.payloadKind === 'RelationPathPayload') {
    const { pathIdentifiers } = payload;
    if (!Array.isArray(pathIdentifiers) || pathIdentifiers.length === 0) {
      contractViolation(`'pathIdentifiers' must be a non-empty list`);
    }
    for (const item of pathIdentifiers) {
      if (typeof item !== 'string' || item.length === 0) {
        contractViolation(`every element of 'pathIdentifiers' must be a non-empty string`);
      }
    }
  }
}

export function sha256Hex(value: Uint8Array): string {
  return createHash('sha256').update(value).digest('hex');
}
