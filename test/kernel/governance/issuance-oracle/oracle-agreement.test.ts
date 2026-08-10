import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { issueRatificationAuthoritySnapshot } from '../../../../src/kernel/governance/ratification-authority-snapshot-issuance';
import { RatificationAuthoritySnapshotSource } from '../../../../src/kernel/governance/ratification-authority-snapshot-issuance.types';
import { issueOracle, oracleSource } from './issuance.oracle';
import { oracleString } from './nccs1-encoder.oracle';
import { oracleDiagnosticCodes } from './vocabulary.oracle';

interface IssuanceFacts {
  readonly capturedAt: string;
  readonly producingAttribution: {
    readonly producingImplementationIdentity: string;
    readonly producingImplementationRevision: string;
  };
}

const facts: IssuanceFacts = Object.freeze({
  capturedAt: '2026-08-06T09:00:00Z',
  producingAttribution: Object.freeze({
    producingImplementationIdentity: 'sprint-82-test',
    producingImplementationRevision: 'rev-1',
  }),
});

interface AgreementCase {
  readonly name: string;
  readonly implementationInput: unknown;
  readonly oracleInput: unknown;
}

describe('ratification authority issuance oracle agreement', () => {
  it('agrees field-for-field on complete public results across the declared agreement corpus', () => {
    const cases = agreementCases();
    const reachedCodes = new Set<string>();

    for (const current of cases) {
      const implementation = issueImplementation(current.implementationInput);
      const oracle = issueOracle(current.oracleInput);

      if (isRejected(implementation)) {
        reachedCodes.add(implementation.diagnosticCode);
      }

      expect(implementation, current.name).toEqual(oracle);
    }

    expect(reachedCodes).toEqual(new Set(oracleDiagnosticCodes));
    expect(cases.some((current) => current.name === 'live Ratification Ledger')).toBe(true);
    expect(cases.some((current) => current.name.includes('Issued'))).toBe(true);
  });
});

function agreementCases(): readonly AgreementCase[] {
  const liveLedger = readFileSync('knowledge/governance/RATIFICATION_LEDGER.md');
  const cases: AgreementCase[] = [
    bytesCase('live Ratification Ledger', liveLedger),
    bytesCase('T1-T20 Issued generic source fixture', Buffer.from(activeEntry('NEXUS-RAT-2026-08-06-901'), 'utf8')),
    bytesCase('T4 fenced-region Issued fixture', Buffer.from(activeEntry(
      'NEXUS-RAT-2026-08-06-902',
      'Active',
      'Subject with fenced region.\n````\n# NEXUS-RAT-2026-08-06-999\n```text\nquoted\n```\n````',
    ), 'utf8')),
    bytesCase('T6-T10 declared lifecycle Issued fixture', Buffer.from(declaredSource(), 'utf8')),
    bytesCase('T9-T14 segmented lifecycle Issued fixture', Buffer.from(segmentedSource(), 'utf8')),
    invalidInputCase(),
    bytesCase('invalid-utf8', Uint8Array.from([0xff])),
    bytesCase('byte-order-mark-present', Buffer.from(`\uFEFF${activeEntry('NEXUS-RAT-2026-08-06-903')}`, 'utf8')),
    bytesCase('no-entries', Buffer.from('not a ledger', 'utf8')),
    bytesCase('unterminated-fenced-region', Buffer.from(`${activeEntry('NEXUS-RAT-2026-08-06-904')}\n\`\`\`\n# NEXUS-RAT-2026-08-06-905\n`, 'utf8')),
    bytesCase('missing-section', Buffer.from(entryMissing('NEXUS-RAT-2026-08-06-906', '## Date'), 'utf8')),
    bytesCase('duplicate-section', Buffer.from(`${activeEntry('NEXUS-RAT-2026-08-06-907')}\n## Subject\n\nDuplicate.\n`, 'utf8')),
    bytesCase('missing-identifier', Buffer.from(activeEntry('NEXUS-RAT-2026-08-06-908').replace('NEXUS-RAT-2026-08-06-908\n\n## Date', '\n\n## Date'), 'utf8')),
    bytesCase('identifier-grammar-violation', Buffer.from(activeEntry('NEXUS-RAT-2026-08-06-909').replace('NEXUS-RAT-2026-08-06-909\n\n## Date', '`NEXUS-RAT-2026-08-06-909`\n\n## Date'), 'utf8')),
    bytesCase('identifier-heading-mismatch', Buffer.from(activeEntry('NEXUS-RAT-2026-08-06-910').replace('NEXUS-RAT-2026-08-06-910\n\n## Date', 'NEXUS-RAT-2026-08-06-911\n\n## Date'), 'utf8')),
    bytesCase('malformed-date', Buffer.from(activeEntry('NEXUS-RAT-2026-08-06-912').replace('2026-08-06\n\n## Subject', '2026-02-31\n\n## Subject'), 'utf8')),
    bytesCase('malformed-status', Buffer.from(activeEntry('NEXUS-RAT-2026-08-06-913').replace('\nActive\n', '\n\n'), 'utf8')),
    bytesCase('missing-subject', Buffer.from(activeEntry('NEXUS-RAT-2026-08-06-914', 'Active', ''), 'utf8')),
    bytesCase('duplicate-entry-identifier', Buffer.from(`${activeEntry('NEXUS-RAT-2026-08-06-915')}${activeEntry('NEXUS-RAT-2026-08-06-915')}`, 'utf8')),
    bytesCase('missing-declaration-block', Buffer.from(withLifecycleSection('NEXUS-RAT-2026-08-06-916', ['not a block']), 'utf8')),
    bytesCase('unterminated-declaration-block', Buffer.from(withLifecycleSection('NEXUS-RAT-2026-08-06-917', ['```text', 'nexus-lifecycle-authority-declarations/1', '````']), 'utf8')),
    bytesCase('nested-declaration-block', Buffer.from(withLifecycleSection('NEXUS-RAT-2026-08-06-918', ['```text', '```text', '```']), 'utf8')),
    bytesCase('extraneous-declaration-content', Buffer.from(withLifecycleSection('NEXUS-RAT-2026-08-06-919', ['```text', 'nexus-lifecycle-authority-declarations/1', 'end-block', '```', 'after']), 'utf8')),
    bytesCase('empty-declaration-block', Buffer.from(withLifecycleSection('NEXUS-RAT-2026-08-06-920', ['```text', 'nexus-lifecycle-authority-declarations/1', 'end-block', '```']), 'utf8')),
    bytesCase('declaration-grammar-violation', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-921', ['not-a-declaration']), 'utf8')),
    bytesCase('declaration-subject-grammar-violation', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-922', wholeDeclaration('bad-subject', 'Retired')), 'utf8')),
    bytesCase('unsupported-lifecycle-form', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-923', wholeDeclaration('NEXUS-RAT-2026-08-06-924', 'Retired', { form: 'UnsupportedLifecycle' })) + inactiveEntry('NEXUS-RAT-2026-08-06-924'), 'utf8')),
    bytesCase('relation-target-grammar-violation', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-925', wholeDeclaration('NEXUS-RAT-2026-08-06-926', 'Retired', { relationTarget: 'bad-target' })) + inactiveEntry('NEXUS-RAT-2026-08-06-926'), 'utf8')),
    bytesCase('unsupported-lifecycle-status', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-927', wholeDeclaration('NEXUS-RAT-2026-08-06-928', 'Retired', { status: 'Dormant', relation: '' })) + inactiveEntry('NEXUS-RAT-2026-08-06-928'), 'utf8')),
    bytesCase('unsupported-relation-kind', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-929', wholeDeclaration('NEXUS-RAT-2026-08-06-930', 'Retired', { relationKind: 'ReplacedBy' })) + inactiveEntry('NEXUS-RAT-2026-08-06-930'), 'utf8')),
    bytesCase('degenerate-segmentation', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-931', segmentedDeclaration('NEXUS-RAT-2026-08-06-932', 'Retired', ['residual'])) + inactiveEntry('NEXUS-RAT-2026-08-06-932'), 'utf8')),
    bytesCase('duplicate-declaration-subject', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-933', [...wholeDeclaration('NEXUS-RAT-2026-08-06-934', 'Retired'), ...wholeDeclaration('NEXUS-RAT-2026-08-06-934', 'Retired')]) + inactiveEntry('NEXUS-RAT-2026-08-06-934'), 'utf8')),
    bytesCase('malformed-scope-key', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-935', segmentedDeclaration('NEXUS-RAT-2026-08-06-936', 'Retired', ['BadScope', 'residual'])) + inactiveEntry('NEXUS-RAT-2026-08-06-936'), 'utf8')),
    bytesCase('missing-scope-description', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-937', segmentedDeclaration('NEXUS-RAT-2026-08-06-938', 'Retired', ['alpha', 'residual'], { omitDescriptionFor: 'alpha' })) + inactiveEntry('NEXUS-RAT-2026-08-06-938'), 'utf8')),
    bytesCase('residual-scope-description', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-939', segmentedDeclaration('NEXUS-RAT-2026-08-06-940', 'Retired', ['alpha', 'residual'], { describeResidual: true })) + inactiveEntry('NEXUS-RAT-2026-08-06-940'), 'utf8')),
    bytesCase('duplicate-scope-key', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-941', segmentedDeclaration('NEXUS-RAT-2026-08-06-942', 'Retired', ['alpha', 'alpha', 'residual'])) + inactiveEntry('NEXUS-RAT-2026-08-06-942'), 'utf8')),
    bytesCase('incomplete-segmentation', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-943', segmentedDeclaration('NEXUS-RAT-2026-08-06-944', 'Retired', ['alpha', 'beta'])) + inactiveEntry('NEXUS-RAT-2026-08-06-944'), 'utf8')),
    bytesCase('status-relation-mismatch', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-945', segmentedDeclaration('NEXUS-RAT-2026-08-06-946', 'Retired', ['alpha', 'residual'], { status: 'Effective', relationKind: 'SupersededBy' })) + inactiveEntry('NEXUS-RAT-2026-08-06-946'), 'utf8')),
    bytesCase('declarant-not-effective', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-947', wholeDeclaration('NEXUS-RAT-2026-08-06-948', 'Retired'), 'Retired') + inactiveEntry('NEXUS-RAT-2026-08-06-948'), 'utf8')),
    bytesCase('self-referential-declaration', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-949', wholeDeclaration('NEXUS-RAT-2026-08-06-949', 'Active')), 'utf8')),
    bytesCase('cyclic-declaration-authority', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-950', wholeDeclaration('NEXUS-RAT-2026-08-06-951', 'Active')) + withDeclarationBody('NEXUS-RAT-2026-08-06-951', wholeDeclaration('NEXUS-RAT-2026-08-06-950', 'Active')), 'utf8')),
    bytesCase('absent-declaration-subject', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-952', wholeDeclaration('NEXUS-RAT-2026-08-06-953', 'Retired')), 'utf8')),
    bytesCase('generic-rule-conflict', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-954', wholeDeclaration('NEXUS-RAT-2026-08-06-955', 'Active')) + activeEntry('NEXUS-RAT-2026-08-06-955'), 'utf8')),
    bytesCase('status-binding-mismatch', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-956', wholeDeclaration('NEXUS-RAT-2026-08-06-957', 'Other')) + inactiveEntry('NEXUS-RAT-2026-08-06-957'), 'utf8')),
    bytesCase('duplicate-declaration', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-958', wholeDeclaration('NEXUS-RAT-2026-08-06-959', 'Retired')) + withDeclarationBody('NEXUS-RAT-2026-08-06-960', wholeDeclaration('NEXUS-RAT-2026-08-06-959', 'Retired')) + inactiveEntry('NEXUS-RAT-2026-08-06-959'), 'utf8')),
    bytesCase('absent-relation-target', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-961', wholeDeclaration('NEXUS-RAT-2026-08-06-962', 'Retired', { relationTarget: 'NEXUS-RAT-2026-08-06-963' })) + inactiveEntry('NEXUS-RAT-2026-08-06-962'), 'utf8')),
    bytesCase('self-referential-relation', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-964', wholeDeclaration('NEXUS-RAT-2026-08-06-965', 'Retired', { relationTarget: 'NEXUS-RAT-2026-08-06-965' })) + inactiveEntry('NEXUS-RAT-2026-08-06-965'), 'utf8')),
    bytesCase('cyclic-lifecycle-relation', Buffer.from(withDeclarationBody('NEXUS-RAT-2026-08-06-966', [...wholeDeclaration('NEXUS-RAT-2026-08-06-967', 'Retired', { relationTarget: 'NEXUS-RAT-2026-08-06-968' }), ...wholeDeclaration('NEXUS-RAT-2026-08-06-968', 'Retired', { relationTarget: 'NEXUS-RAT-2026-08-06-967' })]) + inactiveEntry('NEXUS-RAT-2026-08-06-967') + inactiveEntry('NEXUS-RAT-2026-08-06-968'), 'utf8')),
    bytesCase('unresolved-lifecycle', Buffer.from(inactiveEntry('NEXUS-RAT-2026-08-06-969'), 'utf8')),
    bytesCase('malformed-capture-instant', Buffer.from(activeEntry('NEXUS-RAT-2026-08-06-970'), 'utf8'), {
      capturedAt: '2026-08-06T09:00:00+08:00',
    }),
    bytesCase('malformed-attribution', Buffer.from(activeEntry('NEXUS-RAT-2026-08-06-971'), 'utf8'), {
      producingAttribution: {
        producingImplementationIdentity: '',
        producingImplementationRevision: 'rev-1',
      },
    }),
  ];

  return cases;
}

function bytesCase(
  name: string,
  bytes: Uint8Array,
  overrides: Partial<IssuanceFacts> = {},
): AgreementCase {
  const mergedFacts = { ...facts, ...overrides };

  return {
    name,
    implementationInput: {
      source: RatificationAuthoritySnapshotSource.fromBytes(bytes),
      ...mergedFacts,
    },
    oracleInput: {
      source: oracleSource(bytes),
      ...mergedFacts,
    },
  };
}

function invalidInputCase(): AgreementCase {
  const bytes = Buffer.from(activeEntry('NEXUS-RAT-2026-08-06-900'), 'utf8');

  return {
    name: 'invalid-input',
    implementationInput: {
      source: bytes,
      ...facts,
    },
    oracleInput: {
      source: bytes,
      ...facts,
    },
  };
}

function activeEntry(id: string, status = 'Active', subject = `${id} subject.`): string {
  return `# ${id}

## Ratification Identifier

${id}

## Date

2026-08-06

## Subject

${subject}

## Current Status

${status}
`;
}

function inactiveEntry(id: string): string {
  return activeEntry(id, 'Retired');
}

function entryMissing(id: string, heading: string): string {
  const sections = activeEntry(id).split('\n\n');
  const index = sections.indexOf(heading);

  return index < 0 ? sections.join('\n\n') : [...sections.slice(0, index), ...sections.slice(index + 2)].join('\n\n');
}

function withLifecycleSection(id: string, lines: readonly string[], status = 'Active'): string {
  return `${activeEntry(id, status)}
## Lifecycle Authority Declarations

${lines.join('\n')}
`;
}

function withDeclarationBody(id: string, body: readonly string[], status = 'Active'): string {
  return withLifecycleSection(id, ['```text', 'nexus-lifecycle-authority-declarations/1', ...body, 'end-block', '```'], status);
}

function declaredSource(): string {
  const declarant = 'NEXUS-RAT-2026-08-06-972';
  const target = 'NEXUS-RAT-2026-08-06-973';

  return `${withDeclarationBody(declarant, wholeDeclaration(target, 'Retired'))}${inactiveEntry(target)}`;
}

function segmentedSource(): string {
  const declarant = 'NEXUS-RAT-2026-08-06-974';
  const target = 'NEXUS-RAT-2026-08-06-975';

  return `${withDeclarationBody(declarant, segmentedDeclaration(target, 'Retired', ['alpha', 'residual']))}${inactiveEntry(target)}`;
}

function wholeDeclaration(
  subject: string,
  statusDigestForStatus: string,
  options: {
    readonly form?: string;
    readonly status?: string;
    readonly relation?: string;
    readonly relationKind?: string;
    readonly relationTarget?: string;
  } = {},
): readonly string[] {
  const status = options.status ?? 'Superseded';
  const relation = options.relation ?? `  relation ${options.relationKind ?? 'SupersededBy'} ${options.relationTarget ?? 'NEXUS-RAT-2026-08-06-901'}`;

  return [
    `declaration ${subject}`,
    `  sourceStatusDigest ${digest(statusDigestForStatus)}`,
    `  form ${options.form ?? 'WholeRecordLifecycle'}`,
    `  status ${status}`,
    ...(relation.length === 0 ? [] : [relation]),
    'end-declaration',
  ];
}

function segmentedDeclaration(
  subject: string,
  statusDigestForStatus: string,
  scopeKeys: readonly string[],
  options: {
    readonly status?: string;
    readonly relationKind?: string;
    readonly omitDescriptionFor?: string;
    readonly describeResidual?: boolean;
  } = {},
): readonly string[] {
  const lines = [
    `declaration ${subject}`,
    `  sourceStatusDigest ${digest(statusDigestForStatus)}`,
    '  form SegmentedLifecycle',
  ];

  for (const scopeKey of scopeKeys) {
    lines.push(`  segment ${scopeKey}`);

    if (scopeKey !== 'residual' && options.omitDescriptionFor !== scopeKey) {
      lines.push(`    describes ${scopeKey} scope`);
    }

    if (scopeKey === 'residual' && options.describeResidual === true) {
      lines.push('    describes residual scope');
    }

    lines.push(`    status ${options.status ?? 'Superseded'}`);
    lines.push(`    relation ${options.relationKind ?? 'SupersededBy'} NEXUS-RAT-2026-08-06-901`);
    lines.push('  end-segment');
  }

  lines.push('end-declaration');

  return lines;
}

function digest(value: string): string {
  return createHash('sha256').update(oracleString(value)).digest('hex');
}

function issueImplementation(input: unknown): ReturnType<typeof issueRatificationAuthoritySnapshot> {
  return issueRatificationAuthoritySnapshot(input as Parameters<typeof issueRatificationAuthoritySnapshot>[0]);
}

function isRejected(value: ReturnType<typeof issueRatificationAuthoritySnapshot>): value is Extract<
  ReturnType<typeof issueRatificationAuthoritySnapshot>,
  { readonly result: 'Rejected' }
> {
  return value.result === 'Rejected';
}
