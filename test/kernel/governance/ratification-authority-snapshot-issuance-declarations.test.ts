import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { encodeNccsString } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance.contract';
import { issueRatificationAuthoritySnapshot } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance';
import { RatificationAuthoritySnapshotSource } from '../../../src/kernel/governance/ratification-authority-snapshot-issuance.types';

const facts = {
  capturedAt: '2026-08-06T09:00:00Z',
  producingAttribution: {
    producingImplementationIdentity: 'test-issuer',
    producingImplementationRevision: 'rev-1',
  },
} as const;

function digest(value: string): string {
  return createHash('sha256').update(encodeNccsString(value)).digest('hex');
}

function run(text: string): ReturnType<typeof issueRatificationAuthoritySnapshot> {
  return issueRatificationAuthoritySnapshot({
    source: RatificationAuthoritySnapshotSource.fromBytes(Buffer.from(text, 'utf8')),
    ...facts,
  });
}

function declared(status = 'Retired'): string {
  return `# NEXUS-RAT-2026-08-06-301

## Ratification Identifier

NEXUS-RAT-2026-08-06-301

## Date

2026-08-06

## Subject

Declarant.

## Current Status

Active

## Lifecycle Authority Declarations

\`\`\`text
nexus-lifecycle-authority-declarations/1
declaration NEXUS-RAT-2026-08-06-302
  sourceStatusDigest ${digest(status)}
  form WholeRecordLifecycle
  status Superseded
  relation SupersededBy NEXUS-RAT-2026-08-06-301
end-declaration
end-block
\`\`\`

# NEXUS-RAT-2026-08-06-302

## Ratification Identifier

NEXUS-RAT-2026-08-06-302

## Date

2026-08-06

## Subject

Declared.

## Current Status

${status}
`;
}

describe('RatificationAuthoritySnapshotIssuance declarations', () => {
  it('parses governed declarations and exposes no caller-supplied declaration channel', () => {
    const result = run(declared());

    expect(result.result).toBe('Issued');
    expect(result.result === 'Issued' ? result.declarationCount : -1).toBe(1);
    expect(
      issueRatificationAuthoritySnapshot({
        source: RatificationAuthoritySnapshotSource.fromBytes(Buffer.from(declared(), 'utf8')),
        callerSuppliedDeclaration: {},
        ...facts,
      }),
    ).toMatchObject({ diagnosticCode: 'malformed-attribution' });
  });

  it('rejects generic-rule conflicts and binding defects', () => {
    expect(run(declared('Active'))).toMatchObject({ diagnosticCode: 'generic-rule-conflict' });
    expect(run(declared().replace(digest('Retired'), digest('Other')))).toMatchObject({
      diagnosticCode: 'status-binding-mismatch',
    });
  });
});
