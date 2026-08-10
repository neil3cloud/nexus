import { createHash } from 'node:crypto';

export function oracleSourceForSingleActiveEntry(input: {
  readonly id?: string;
  readonly date?: string;
  readonly subject?: string;
  readonly status?: string;
} = {}): string {
  return [
    `# ${input.id ?? 'NEXUS-RAT-2026-08-06-901'}`,
    '',
    '## Ratification Identifier',
    '',
    input.id ?? 'NEXUS-RAT-2026-08-06-901',
    '',
    '## Date',
    '',
    input.date ?? '2026-08-06',
    '',
    '## Subject',
    '',
    input.subject ?? 'Oracle active entry.',
    '',
    '## Current Status',
    '',
    input.status ?? 'Active',
    '',
  ].join('\n');
}

export function oracleDeclarationSource(): string {
  const declarant = oracleSourceForSingleActiveEntry({
    id: 'NEXUS-RAT-2026-08-06-902',
    subject: 'Oracle declarant.',
  });
  const statusEncoding = Buffer.from('8:Retired', 'utf8');
  const digest = createHash('sha256').update(statusEncoding).digest('hex');

  return `${declarant}# NEXUS-RAT-2026-08-06-903

## Ratification Identifier

NEXUS-RAT-2026-08-06-903

## Date

2026-08-06

## Subject

Oracle declared entry.

## Current Status

Retired

## Lifecycle Authority Declarations

\`\`\`text
nexus-lifecycle-authority-declarations/1
declaration NEXUS-RAT-2026-08-06-903
  sourceStatusDigest ${digest}
  form WholeRecordLifecycle
  status Superseded
  relation SupersededBy NEXUS-RAT-2026-08-06-902
end-declaration
end-block
\`\`\`
`;
}
