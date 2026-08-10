import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { encodeNccsString } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance.contract';
import { issueRatificationAuthoritySnapshot } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance';
import { RatificationAuthoritySnapshotSource } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance.types';

const facts = Object.freeze({
  capturedAt: '2026-08-06T09:00:00Z',
  producingAttribution: Object.freeze({
    producingImplementationIdentity: 'test-issuer',
    producingImplementationRevision: 'rev-1',
  }),
});

describe('RatificationAuthoritySnapshotIssuance graph diagnostics', () => {
  it('reports absent lifecycle relation targets with the canonical two-element path', () => {
    const result = issue(source());

    expect(result).toMatchObject({
      result: 'Rejected',
      diagnosticCode: 'absent-relation-target',
      diagnosticPayload: {
        payloadKind: 'RelationPathPayload',
        pathIdentifiers: ['NEXUS-RAT-2026-08-06-502', 'NEXUS-RAT-2026-08-06-599'],
      },
    });
  });

  it('reports the normatively selected declarant-authority cycle path when multiple cycles exist', () => {
    const result = issue(`${entry('NEXUS-RAT-2026-08-06-510', 'Active', declarations([
      wholeDeclaration('NEXUS-RAT-2026-08-06-511', 'Active'),
      wholeDeclaration('NEXUS-RAT-2026-08-06-512', 'Active'),
    ]))}${entry('NEXUS-RAT-2026-08-06-511', 'Active', declarations([
      wholeDeclaration('NEXUS-RAT-2026-08-06-510', 'Active'),
    ]))}${entry('NEXUS-RAT-2026-08-06-512', 'Active', declarations([
      wholeDeclaration('NEXUS-RAT-2026-08-06-510', 'Active'),
    ]))}`);

    expect(result).toMatchObject({
      result: 'Rejected',
      diagnosticCode: 'cyclic-declaration-authority',
      diagnosticPayload: {
        payloadKind: 'RelationPathPayload',
        pathIdentifiers: [
          'NEXUS-RAT-2026-08-06-510',
          'NEXUS-RAT-2026-08-06-511',
          'NEXUS-RAT-2026-08-06-510',
        ],
      },
    });
  });

  it('reports the normatively selected lifecycle-relation cycle path when multiple cycles exist', () => {
    const result = issue(`${entry('NEXUS-RAT-2026-08-06-520', 'Active', declarations([
      wholeDeclaration('NEXUS-RAT-2026-08-06-521', 'Retired', 'NEXUS-RAT-2026-08-06-522'),
      wholeDeclaration('NEXUS-RAT-2026-08-06-522', 'Retired', 'NEXUS-RAT-2026-08-06-521'),
      wholeDeclaration('NEXUS-RAT-2026-08-06-523', 'Retired', 'NEXUS-RAT-2026-08-06-524'),
      wholeDeclaration('NEXUS-RAT-2026-08-06-524', 'Retired', 'NEXUS-RAT-2026-08-06-523'),
    ]))}${entry('NEXUS-RAT-2026-08-06-521', 'Retired')}${entry('NEXUS-RAT-2026-08-06-522', 'Retired')}${entry('NEXUS-RAT-2026-08-06-523', 'Retired')}${entry('NEXUS-RAT-2026-08-06-524', 'Retired')}`);

    expect(result).toMatchObject({
      result: 'Rejected',
      diagnosticCode: 'cyclic-lifecycle-relation',
      diagnosticPayload: {
        payloadKind: 'RelationPathPayload',
        pathIdentifiers: [
          'NEXUS-RAT-2026-08-06-521',
          'NEXUS-RAT-2026-08-06-522',
          'NEXUS-RAT-2026-08-06-521',
        ],
      },
    });
  });

  it('does not let closed marking hide a later lifecycle-relation cycle', () => {
    const result = issue(`${entry('NEXUS-RAT-2026-08-06-530', 'Active', declarations([
      segmentedDeclaration('NEXUS-RAT-2026-08-06-531', 'Retired', [
        ['alpha', 'NEXUS-RAT-2026-08-06-532'],
        ['residual', 'NEXUS-RAT-2026-08-06-533'],
      ]),
      wholeDeclaration('NEXUS-RAT-2026-08-06-533', 'Retired', 'NEXUS-RAT-2026-08-06-534'),
      wholeDeclaration('NEXUS-RAT-2026-08-06-534', 'Retired', 'NEXUS-RAT-2026-08-06-533'),
    ]))}${entry('NEXUS-RAT-2026-08-06-531', 'Retired')}${entry('NEXUS-RAT-2026-08-06-532', 'Active')}${entry('NEXUS-RAT-2026-08-06-533', 'Retired')}${entry('NEXUS-RAT-2026-08-06-534', 'Retired')}`);

    expect(result).toMatchObject({
      result: 'Rejected',
      diagnosticCode: 'cyclic-lifecycle-relation',
      diagnosticPayload: {
        payloadKind: 'RelationPathPayload',
        pathIdentifiers: [
          'NEXUS-RAT-2026-08-06-533',
          'NEXUS-RAT-2026-08-06-534',
          'NEXUS-RAT-2026-08-06-533',
        ],
      },
    });
  });

  it('reports self-referential lifecycle relations through the lifecycle graph', () => {
    const result = issue(`${entry('NEXUS-RAT-2026-08-06-540', 'Active', declarations([
      wholeDeclaration('NEXUS-RAT-2026-08-06-541', 'Retired', 'NEXUS-RAT-2026-08-06-541'),
    ]))}${entry('NEXUS-RAT-2026-08-06-541', 'Retired')}`);

    expect(result).toMatchObject({
      result: 'Rejected',
      diagnosticCode: 'self-referential-relation',
      diagnosticPayload: {
        payloadKind: 'RelationPathPayload',
        pathIdentifiers: [
          'NEXUS-RAT-2026-08-06-541',
          'NEXUS-RAT-2026-08-06-541',
        ],
      },
    });
  });
});

function source(): string {
  return `${entry('NEXUS-RAT-2026-08-06-501', 'Active', declarations([
    wholeDeclaration('NEXUS-RAT-2026-08-06-502', 'Retired', 'NEXUS-RAT-2026-08-06-599'),
  ]))}${entry('NEXUS-RAT-2026-08-06-502', 'Retired')}`;
}

function entry(id: string, status: string, lifecycleDeclarations = ''): string {
  return `# ${id}

## Ratification Identifier

${id}

## Date

2026-08-06

## Subject

${id} subject.

## Current Status

${status}
${lifecycleDeclarations}`;
}

function declarations(body: readonly string[]): string {
  return `
## Lifecycle Authority Declarations

\`\`\`text
nexus-lifecycle-authority-declarations/1
${body.join('\n')}
end-block
\`\`\`
`;
}

function wholeDeclaration(subject: string, sourceStatus: string, target = 'NEXUS-RAT-2026-08-06-501'): string {
  return [
    `declaration ${subject}`,
    `  sourceStatusDigest ${digest(sourceStatus)}`,
    '  form WholeRecordLifecycle',
    '  status Superseded',
    `  relation SupersededBy ${target}`,
    'end-declaration',
  ].join('\n');
}

function segmentedDeclaration(subject: string, sourceStatus: string, segments: readonly (readonly [string, string])[]): string {
  return [
    `declaration ${subject}`,
    `  sourceStatusDigest ${digest(sourceStatus)}`,
    '  form SegmentedLifecycle',
    ...segments.flatMap(([scopeKey, relationTarget]) => [
      `  segment ${scopeKey}`,
      ...(scopeKey === 'residual' ? [] : [`    describes ${scopeKey} scope`]),
      '    status Superseded',
      `    relation SupersededBy ${relationTarget}`,
      '  end-segment',
    ]),
    'end-declaration',
  ].join('\n');
}

function issue(sourceText: string): ReturnType<typeof issueRatificationAuthoritySnapshot> {
  return issueRatificationAuthoritySnapshot({
    source: RatificationAuthoritySnapshotSource.fromBytes(Buffer.from(sourceText, 'utf8')),
    ...facts,
  });
}

function digest(value: string): string {
  return createHash('sha256').update(encodeNccsString(value)).digest('hex');
}
