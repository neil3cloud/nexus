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

function run(text: string): ReturnType<typeof issueRatificationAuthoritySnapshot> {
  return issueRatificationAuthoritySnapshot({
    source: RatificationAuthoritySnapshotSource.fromBytes(Buffer.from(text, 'utf8')),
    ...facts,
  });
}

function entry(extraSubject = ''): string {
  return `# NEXUS-RAT-2026-08-06-201

## Ratification Identifier

NEXUS-RAT-2026-08-06-201

## Date

2026-08-06

## Subject

Entry subject.${extraSubject}

## Current Status

Active
`;
}

describe('RatificationAuthoritySnapshotIssuance entry structure', () => {
  it('treats longer outer fences as enclosing inner headings verbatim', () => {
    const result = run(entry('\n````\n# NEXUS-RAT-2026-08-06-999\n```text\nquoted\n```\n````'));

    expect(result.result).toBe('Issued');
    expect(result.result === 'Issued' ? result.records : []).toHaveLength(1);
  });

  it('rejects unterminated fenced regions before recognizing enclosed headings', () => {
    expect(run(`${entry()}\n\`\`\`\n# NEXUS-RAT-2026-08-06-202\n`)).toMatchObject({
      diagnosticCode: 'unterminated-fenced-region',
    });
  });

  it('extracts sections by first occurrence and rejects absent subjects', () => {
    expect(run(entry())).toMatchObject({ result: 'Issued' });
    expect(run(entry().replace('Entry subject.', ''))).toMatchObject({
      diagnosticCode: 'missing-subject',
    });
  });
});
