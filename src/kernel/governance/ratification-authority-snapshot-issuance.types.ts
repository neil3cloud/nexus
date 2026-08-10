export const ratificationAuthoritySnapshotSourceIdentity =
  'nexus-repository-ratification-ledger' as const;
export const ratificationAuthoritySnapshotCanonicalSerializationProtocolId = 'NCCS-1' as const;
export const ratificationAuthoritySnapshotSchemaVersion =
  'nexus-ratification-authority-snapshot/3' as const;

export const ratificationAuthoritySnapshotDiagnosticPhases = [
  'SourceIntegrity',
  'EntryStructure',
  'DeclarationGrammar',
  'DeclarantAuthority',
  'DeclarationBinding',
  'LifecycleGraph',
  'Resolution',
  'Commitment',
  'Envelope',
] as const;

export type RatificationAuthoritySnapshotDiagnosticPhase =
  (typeof ratificationAuthoritySnapshotDiagnosticPhases)[number];

export const ratificationAuthoritySnapshotDiagnosticCodes = [
  'invalid-input',
  'invalid-utf8',
  'byte-order-mark-present',
  'no-entries',
  'unterminated-fenced-region',
  'missing-section',
  'duplicate-section',
  'missing-identifier',
  'identifier-grammar-violation',
  'identifier-heading-mismatch',
  'malformed-date',
  'malformed-status',
  'missing-subject',
  'duplicate-entry-identifier',
  'missing-declaration-block',
  'unterminated-declaration-block',
  'nested-declaration-block',
  'extraneous-declaration-content',
  'empty-declaration-block',
  'declaration-grammar-violation',
  'declaration-subject-grammar-violation',
  'unsupported-lifecycle-form',
  'relation-target-grammar-violation',
  'unsupported-lifecycle-status',
  'unsupported-relation-kind',
  'degenerate-segmentation',
  'duplicate-declaration-subject',
  'malformed-scope-key',
  'missing-scope-description',
  'residual-scope-description',
  'duplicate-scope-key',
  'incomplete-segmentation',
  'status-relation-mismatch',
  'declarant-not-effective',
  'self-referential-declaration',
  'cyclic-declaration-authority',
  'absent-declaration-subject',
  'generic-rule-conflict',
  'status-binding-mismatch',
  'duplicate-declaration',
  'absent-relation-target',
  'self-referential-relation',
  'cyclic-lifecycle-relation',
  'unresolved-lifecycle',
  'duplicate-record-fingerprint',
  'malformed-capture-instant',
  'malformed-attribution',
] as const;

export type RatificationAuthoritySnapshotDiagnosticCode =
  (typeof ratificationAuthoritySnapshotDiagnosticCodes)[number];

export type RatificationAuthoritySnapshotDiagnosticPayload =
  | { readonly payloadKind: 'NoPayload' }
  | { readonly payloadKind: 'EntryPayload'; readonly ratificationIdentifier: string }
  | {
      readonly payloadKind: 'EntrySectionPayload';
      readonly ratificationIdentifier: string;
      readonly sectionHeading: string;
    }
  | {
      readonly payloadKind: 'DeclarationPayload';
      readonly declaringAuthority: string;
      readonly declarationSubject: string;
    }
  | {
      readonly payloadKind: 'DeclarationScopePayload';
      readonly declaringAuthority: string;
      readonly declarationSubject: string;
      readonly scopeKey: string;
    }
  | { readonly payloadKind: 'RelationPathPayload'; readonly pathIdentifiers: readonly string[] }
  | { readonly payloadKind: 'DeclaredInputPayload'; readonly declaredField: string };

export type RatificationAuthoritySnapshotLifecycleStatus =
  | 'Effective'
  | 'Superseded'
  | 'Withdrawn';
export type RatificationAuthoritySnapshotLifecycleAuthorityKind =
  | 'GenericSourceRule'
  | 'GovernedDeclaration';
export type RatificationAuthoritySnapshotLifecycleResolutionForm =
  | 'WholeRecordLifecycle'
  | 'SegmentedLifecycle';
export type RatificationAuthoritySnapshotScopeKind = 'GovernedScope' | 'ResidualScope';
export type RatificationAuthoritySnapshotRelationKind = 'SupersededBy' | 'WithdrawnBy';

export interface RatificationAuthoritySnapshotProducingAttribution {
  readonly producingImplementationIdentity: string;
  readonly producingImplementationRevision: string;
}

export interface RatificationAuthoritySnapshotSourceInput {
  readonly source: RatificationAuthoritySnapshotSource;
  readonly capturedAt: string;
  readonly producingAttribution: RatificationAuthoritySnapshotProducingAttribution;
}

export interface RatificationAuthoritySnapshotLifecycleRelation {
  readonly relationKind: RatificationAuthoritySnapshotRelationKind;
  readonly relationTarget: string;
}

export interface RatificationAuthoritySnapshotGovernedScopeSegment {
  readonly scopeKind: 'GovernedScope';
  readonly scopeKey: string;
  readonly scopeDescription: string;
  readonly lifecycleStatus: RatificationAuthoritySnapshotLifecycleStatus;
  readonly lifecycleRelations: readonly RatificationAuthoritySnapshotLifecycleRelation[];
}

export interface RatificationAuthoritySnapshotResidualScopeSegment {
  readonly scopeKind: 'ResidualScope';
  readonly scopeKey: 'residual';
  readonly lifecycleStatus: RatificationAuthoritySnapshotLifecycleStatus;
  readonly lifecycleRelations: readonly RatificationAuthoritySnapshotLifecycleRelation[];
}

export type RatificationAuthoritySnapshotLifecycleSegment =
  | RatificationAuthoritySnapshotGovernedScopeSegment
  | RatificationAuthoritySnapshotResidualScopeSegment;

interface LifecycleAuthorityRecordBase {
  readonly ratificationIdentifier: string;
  readonly ratificationDate: string;
  readonly ratificationSubject: string;
  readonly lifecycleResolutionForm: RatificationAuthoritySnapshotLifecycleResolutionForm;
  readonly lifecycleSegments: readonly RatificationAuthoritySnapshotLifecycleSegment[];
}

export interface RatificationAuthoritySnapshotGenericSourceRecord
  extends LifecycleAuthorityRecordBase {
  readonly lifecycleAuthorityKind: 'GenericSourceRule';
}

export interface RatificationAuthoritySnapshotGovernedDeclarationRecord
  extends LifecycleAuthorityRecordBase {
  readonly lifecycleAuthorityKind: 'GovernedDeclaration';
  readonly lifecycleDeclaringAuthority: string;
}

export type RatificationAuthoritySnapshotRecord =
  | RatificationAuthoritySnapshotGenericSourceRecord
  | RatificationAuthoritySnapshotGovernedDeclarationRecord;

export interface RatificationAuthoritySnapshotEnvelope {
  readonly authorityRoot: string;
  readonly authoritySourceIdentity: typeof ratificationAuthoritySnapshotSourceIdentity;
  readonly authoritySourceRevision: string;
  readonly canonicalSerializationProtocolId: typeof ratificationAuthoritySnapshotCanonicalSerializationProtocolId;
  readonly capturedAt: string;
  readonly producingAttribution: RatificationAuthoritySnapshotProducingAttribution;
  readonly recordCount: number;
  readonly snapshotSchemaVersion: typeof ratificationAuthoritySnapshotSchemaVersion;
}

export interface RatificationAuthoritySnapshotIssuedResult {
  readonly result: 'Issued';
  readonly envelope: RatificationAuthoritySnapshotEnvelope;
  readonly envelopeCommitment: string;
  readonly records: readonly RatificationAuthoritySnapshotRecord[];
  readonly recordFingerprints: readonly string[];
  readonly declarationCount: number;
  readonly genericCount: number;
  readonly segmentedCount: number;
}

export interface RatificationAuthoritySnapshotRejectedResult {
  readonly result: 'Rejected';
  readonly diagnosticCode: RatificationAuthoritySnapshotDiagnosticCode;
  readonly diagnosticPhase: RatificationAuthoritySnapshotDiagnosticPhase;
  readonly diagnosticPrecedence: number;
  readonly diagnosticPayload: RatificationAuthoritySnapshotDiagnosticPayload;
  readonly detail: string;
}

export type RatificationAuthoritySnapshotIssuanceResult =
  | RatificationAuthoritySnapshotIssuedResult
  | RatificationAuthoritySnapshotRejectedResult;

export class RatificationAuthoritySnapshotSource {
  readonly #octets: Uint8Array;

  private constructor(octets: Uint8Array) {
    this.#octets = new Uint8Array(octets);
    Object.freeze(this);
  }

  public static fromBytes(octets: Uint8Array): RatificationAuthoritySnapshotSource {
    return new RatificationAuthoritySnapshotSource(octets);
  }

  public toBytes(): Uint8Array {
    return new Uint8Array(this.#octets);
  }
}
