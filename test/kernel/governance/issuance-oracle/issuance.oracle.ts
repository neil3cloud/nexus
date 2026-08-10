import { oracleConstants } from './schema-table.oracle';
import {
  oracleInteger,
  oracleList,
  oracleOrderInsensitiveStrings,
  oracleRecord,
  oracleSha256Hex,
  oracleString,
} from './nccs1-encoder.oracle';
import { oracleDiagnosticMetadata } from './vocabulary.oracle';

const identifierPattern = /^NEXUS-RAT-\d{4}-\d{2}-\d{2}-\d{3}$/;
const scopeKeyPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const digestPattern = /^[0-9a-f]{64}$/;
const requiredSections = [
  '## Ratification Identifier',
  '## Date',
  '## Subject',
  '## Current Status',
] as const;
const allowedInputKeys = ['capturedAt', 'producingAttribution', 'source'] as const;
const allowedAttributionKeys = [
  'producingImplementationIdentity',
  'producingImplementationRevision',
] as const;

type DiagnosticCode = keyof typeof oracleDiagnosticMetadata;

type Payload =
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

interface OracleInput {
  readonly source: OracleSource;
  readonly capturedAt: string;
  readonly producingAttribution: {
    readonly producingImplementationIdentity: string;
    readonly producingImplementationRevision: string;
  };
}

export interface OracleSource {
  readonly bytes: Uint8Array;
}

interface Section {
  readonly heading: string;
  readonly body: readonly string[];
  readonly firstLine: number;
  readonly duplicateLine?: number | undefined;
}

interface Entry {
  readonly id: string;
  readonly startLine: number;
  readonly lines: readonly string[];
  readonly sections: readonly Section[];
  readonly duplicateSection?: Section | undefined;
  readonly identifier: string;
  readonly date: string;
  readonly subject: string;
  readonly status: string;
}

interface Relation {
  readonly relationKind: string;
  readonly relationTarget: string;
}

interface Segment {
  readonly scopeKey: string;
  readonly scopeDescription?: string | undefined;
  readonly status: string;
  readonly relations: readonly Relation[];
}

interface Declaration {
  readonly declaringAuthority: string;
  readonly declarationSubject: string;
  readonly sourceStatusDigest: string;
  readonly form: string;
  readonly segments: readonly Segment[];
}

interface ParsedSource {
  readonly prepared: string;
  readonly entries: readonly Entry[];
  readonly declarations: readonly Declaration[];
}

interface LifecycleRecord {
  readonly lifecycleAuthorityKind: 'GenericSourceRule' | 'GovernedDeclaration';
  readonly ratificationIdentifier: string;
  readonly ratificationDate: string;
  readonly ratificationSubject: string;
  readonly lifecycleResolutionForm: 'WholeRecordLifecycle' | 'SegmentedLifecycle';
  readonly lifecycleDeclaringAuthority?: string | undefined;
  readonly lifecycleSegments: readonly LifecycleSegment[];
}

interface LifecycleSegment {
  readonly scopeKind: 'GovernedScope' | 'ResidualScope';
  readonly scopeKey: string;
  readonly scopeDescription?: string | undefined;
  readonly lifecycleStatus: 'Effective' | 'Superseded' | 'Withdrawn';
  readonly lifecycleRelations: readonly LifecycleRelation[];
}

interface LifecycleRelation {
  readonly relationKind: 'SupersededBy' | 'WithdrawnBy';
  readonly relationTarget: string;
}

export function oracleSource(bytes: Uint8Array): OracleSource {
  return Object.freeze({ bytes: new Uint8Array(bytes) });
}

export function issueOracle(input: unknown): unknown {
  if (!isOracleInputShape(input)) {
    return oracleRejected('invalid-input', { payloadKind: 'NoPayload' });
  }

  if (containsUtf8ByteOrderMark(input.source.bytes)) {
    return oracleRejected('byte-order-mark-present', { payloadKind: 'NoPayload' });
  }

  let text: string;

  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(input.source.bytes);
  } catch {
    return oracleRejected('invalid-utf8', { payloadKind: 'NoPayload' });
  }

  const prepared = text.normalize('NFC').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const parsed = parseSource(prepared);

  if ('rejection' in parsed) {
    return parsed.rejection;
  }

  const binding = validateBinding(parsed);

  if ('rejection' in binding) {
    return binding.rejection;
  }

  const graph = validateLifecycleGraph(binding.records);

  if ('rejection' in graph) {
    return graph.rejection;
  }

  const unresolved = parsed.entries.find(
    (entry) => !binding.records.some((record) => record.ratificationIdentifier === entry.identifier),
  );

  if (unresolved !== undefined) {
    return oracleRejected('unresolved-lifecycle', entryPayload(unresolved.identifier));
  }

  const envelope = validateEnvelope(input);

  if ('rejection' in envelope) {
    return envelope.rejection;
  }

  return oracleIssued(parsed.prepared, binding.records, input);
}

function isOracleInputShape(value: unknown): value is OracleInput {
  if (!isRecord(value)) {
    return false;
  }

  if (!isOracleSource(value.source)) {
    return false;
  }

  if (typeof value.capturedAt !== 'string' || !isRecord(value.producingAttribution)) {
    return false;
  }

  return (
    typeof value.producingAttribution.producingImplementationIdentity === 'string'
    && typeof value.producingAttribution.producingImplementationRevision === 'string'
  );
}

function isOracleSource(value: unknown): value is OracleSource {
  return isRecord(value) && value.bytes instanceof Uint8Array;
}

function containsUtf8ByteOrderMark(bytes: Uint8Array): boolean {
  for (let index = 0; index <= bytes.length - 3; index += 1) {
    if (bytes[index] === 0xef && bytes[index + 1] === 0xbb && bytes[index + 2] === 0xbf) {
      return true;
    }
  }

  return false;
}

function parseSource(prepared: string): ParsedSource | { readonly rejection: unknown } {
  const lines = prepared.split('\n');
  const fence = scanFences(lines);
  const entryStarts: number[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? '';

    if (!fence.insideOrFenceLines.has(index) && line.startsWith('# ') && identifierPattern.test(line.slice(2))) {
      entryStarts.push(index);
    }
  }

  if (entryStarts.length === 0) {
    return { rejection: oracleRejected('no-entries', { payloadKind: 'NoPayload' }) };
  }

  if (fence.unterminated) {
    return { rejection: oracleRejected('unterminated-fenced-region', { payloadKind: 'NoPayload' }) };
  }

  const entries = entryStarts.map((start, index) => {
    const end = entryStarts[index + 1] ?? lines.length;
    const entryLines = lines.slice(start, end);
    const id = entryLines[0]?.slice(2) ?? '';
    const sections = parseSections(entryLines, start, fence.insideOrFenceLines);
    const duplicateSection = sections.find((section) => section.duplicateLine !== undefined);

    return {
      id,
      startLine: start,
      lines: entryLines,
      sections,
      duplicateSection,
      identifier: '',
      date: '',
      subject: '',
      status: '',
    };
  });

  for (const entry of entries) {
    for (const heading of requiredSections) {
      if (section(entry, heading) === undefined) {
        return { rejection: oracleRejected('missing-section', entrySectionPayload(entry.id, heading)) };
      }
    }
  }

  for (const entry of entries) {
    if (entry.duplicateSection !== undefined) {
      return {
        rejection: oracleRejected(
          'duplicate-section',
          entrySectionPayload(entry.id, entry.duplicateSection.heading),
        ),
      };
    }
  }

  const populated: Entry[] = [];

  for (const entry of entries) {
    const identifier = contentLines(requiredSection(entry, '## Ratification Identifier'));

    if (identifier.length === 0) {
      return { rejection: oracleRejected('missing-identifier', entryPayload(entry.id)) };
    }

    populated.push({
      ...entry,
      identifier: identifier[0] ?? '',
      date: contentLines(requiredSection(entry, '## Date')).join('\n'),
      subject: contentLines(requiredSection(entry, '## Subject')).join('\n'),
      status: contentLines(requiredSection(entry, '## Current Status')).join('\n'),
    });
  }

  for (const entry of populated) {
    if (!identifierPattern.test(entry.identifier)) {
      return { rejection: oracleRejected('identifier-grammar-violation', entryPayload(entry.id)) };
    }
  }

  for (const entry of populated) {
    if (entry.identifier !== entry.id) {
      return { rejection: oracleRejected('identifier-heading-mismatch', entryPayload(entry.id)) };
    }
  }

  for (const entry of populated) {
    if (!isSingleRealDate(contentLines(requiredSection(entry, '## Date')))) {
      return { rejection: oracleRejected('malformed-date', entryPayload(entry.id)) };
    }
  }

  for (const entry of populated) {
    if (contentLines(requiredSection(entry, '## Current Status')).length !== 1) {
      return { rejection: oracleRejected('malformed-status', entryPayload(entry.id)) };
    }
  }

  for (const entry of populated) {
    if (contentLines(requiredSection(entry, '## Subject')).length === 0) {
      return { rejection: oracleRejected('missing-subject', entryPayload(entry.id)) };
    }
  }

  const seen = new Set<string>();

  for (const entry of populated) {
    if (seen.has(entry.identifier)) {
      return { rejection: oracleRejected('duplicate-entry-identifier', entryPayload(entry.identifier)) };
    }

    seen.add(entry.identifier);
  }

  const declarations = parseDeclarations(populated);

  if ('rejection' in declarations) {
    return declarations;
  }

  return { prepared, entries: populated, declarations: declarations.declarations };
}

function parseSections(
  entryLines: readonly string[],
  entryStartLine: number,
  fenceLines: ReadonlySet<number>,
): readonly Section[] {
  const headings: { heading: string; line: number }[] = [];

  for (let offset = 1; offset < entryLines.length; offset += 1) {
    const absolute = entryStartLine + offset;
    const line = entryLines[offset] ?? '';

    if (!fenceLines.has(absolute) && line.startsWith('## ')) {
      headings.push({ heading: line, line: offset });
    }
  }

  const duplicateLines = new Map<string, number>();
  const seen = new Map<string, number>();

  for (const heading of headings) {
    if (seen.has(heading.heading) && !duplicateLines.has(heading.heading)) {
      duplicateLines.set(heading.heading, heading.line);
    }

    seen.set(heading.heading, heading.line);
  }

  return headings.map((heading, index) => {
    const next = headings[index + 1]?.line ?? entryLines.length;

    return {
      heading: heading.heading,
      body: entryLines.slice(heading.line + 1, next),
      firstLine: heading.line,
      duplicateLine: duplicateLines.get(heading.heading),
    };
  });
}

function scanFences(lines: readonly string[]): {
  readonly insideOrFenceLines: ReadonlySet<number>;
  readonly unterminated: boolean;
} {
  const fenceLines = new Set<number>();
  let openLength = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? '';

    if (openLength === 0) {
      const match = line.match(/^(`{3,})/);

      if (match?.[1] !== undefined) {
        openLength = match[1].length;
        fenceLines.add(index);
      }

      continue;
    }

    fenceLines.add(index);

    if (new RegExp(`^\`{${openLength},}$`).test(line)) {
      openLength = 0;
    }
  }

  return { insideOrFenceLines: fenceLines, unterminated: openLength !== 0 };
}

function parseDeclarations(
  entries: readonly Entry[],
): { readonly declarations: readonly Declaration[] } | { readonly rejection: unknown } {
  const declarations: Declaration[] = [];

  for (const entry of entries) {
    const declarationSection = section(entry, '## Lifecycle Authority Declarations');

    if (declarationSection === undefined) {
      continue;
    }

    const body = declarationSection.body;
    const openIndex = body.findIndex((line) => line === '```text');

    if (openIndex < 0) {
      return { rejection: oracleRejected('missing-declaration-block', entryPayload(entry.identifier)) };
    }

    const closeIndex = body.findIndex((line, index) => index > openIndex && line === '```');

    if (closeIndex < 0) {
      return { rejection: oracleRejected('unterminated-declaration-block', entryPayload(entry.identifier)) };
    }

    if (body.slice(openIndex + 1, closeIndex).includes('```text')) {
      return { rejection: oracleRejected('nested-declaration-block', entryPayload(entry.identifier)) };
    }

    if (contentLines({ ...declarationSection, body: body.slice(closeIndex + 1) }).length > 0) {
      return { rejection: oracleRejected('extraneous-declaration-content', entryPayload(entry.identifier)) };
    }

    const block = body.slice(openIndex + 1, closeIndex);

    if (block.length === 2 && block[0] === 'nexus-lifecycle-authority-declarations/1' && block[1] === 'end-block') {
      return { rejection: oracleRejected('empty-declaration-block', entryPayload(entry.identifier)) };
    }

    const parsed = parseDeclarationBlock(entry.identifier, block);

    if ('rejection' in parsed) {
      return parsed;
    }

    declarations.push(...parsed.declarations);
  }

  return { declarations };
}

function parseDeclarationBlock(
  declaringAuthority: string,
  block: readonly string[],
): { readonly declarations: readonly Declaration[] } | { readonly rejection: unknown } {
  if (
    block.length < 3
    || block[0] !== 'nexus-lifecycle-authority-declarations/1'
    || block[block.length - 1] !== 'end-block'
  ) {
    return { rejection: oracleRejected('declaration-grammar-violation', entryPayload(declaringAuthority)) };
  }

  const declarations: Declaration[] = [];
  let index = 1;

  while (index < block.length - 1) {
    const declarationLine = block[index] ?? '';

    if (!declarationLine.startsWith('declaration ')) {
      return { rejection: oracleRejected('declaration-grammar-violation', entryPayload(declaringAuthority)) };
    }

    const declarationSubject = declarationLine.slice('declaration '.length);
    const sourceStatusLine = block[index + 1] ?? '';
    const formLine = block[index + 2] ?? '';

    if (!sourceStatusLine.startsWith('  sourceStatusDigest ') || !formLine.startsWith('  form ')) {
      return { rejection: oracleRejected('declaration-grammar-violation', entryPayload(declaringAuthority)) };
    }

    const sourceStatusDigest = sourceStatusLine.slice('  sourceStatusDigest '.length);

    if (!digestPattern.test(sourceStatusDigest)) {
      return { rejection: oracleRejected('declaration-grammar-violation', entryPayload(declaringAuthority)) };
    }

    const form = formLine.slice('  form '.length);

    index += 3;

    if (form === 'WholeRecordLifecycle') {
      const statusLine = block[index] ?? '';

      if (!statusLine.startsWith('  status ')) {
        return { rejection: oracleRejected('declaration-grammar-violation', entryPayload(declaringAuthority)) };
      }

      const status = statusLine.slice('  status '.length);
      index += 1;
      const relations: Relation[] = [];

      while ((block[index] ?? '').startsWith('  relation ')) {
        const relation = parseRelation(block[index] ?? '');

        if (relation === undefined) {
          return {
            rejection: oracleRejected(
              'declaration-grammar-violation',
              declarationPayload(declaringAuthority, declarationSubject),
            ),
          };
        }

        relations.push(relation);
        index += 1;
      }

      if (block[index] !== 'end-declaration') {
        return { rejection: oracleRejected('declaration-grammar-violation', entryPayload(declaringAuthority)) };
      }

      declarations.push({
        declaringAuthority,
        declarationSubject,
        sourceStatusDigest,
        form,
        segments: [{ scopeKey: 'residual', status, relations }],
      });
      index += 1;
      continue;
    }

    if (form !== 'SegmentedLifecycle') {
      declarations.push({
        declaringAuthority,
        declarationSubject,
        sourceStatusDigest,
        form,
        segments: [],
      });

      while (index < block.length - 1 && block[index] !== 'end-declaration') {
        index += 1;
      }

      index += 1;
      continue;
    }

    const segments: Segment[] = [];

    while (index < block.length - 1 && block[index] !== 'end-declaration') {
      const segmentLine = block[index] ?? '';

      if (!segmentLine.startsWith('  segment ')) {
        return { rejection: oracleRejected('declaration-grammar-violation', entryPayload(declaringAuthority)) };
      }

      const scopeKey = segmentLine.slice('  segment '.length);
      index += 1;
      let scopeDescription: string | undefined;

      if ((block[index] ?? '').startsWith('    describes ')) {
        scopeDescription = (block[index] ?? '').slice('    describes '.length);
        index += 1;
      }

      const statusLine = block[index] ?? '';

      if (!statusLine.startsWith('    status ')) {
        return { rejection: oracleRejected('declaration-grammar-violation', entryPayload(declaringAuthority)) };
      }

      const status = statusLine.slice('    status '.length);
      index += 1;
      const relations: Relation[] = [];

      while ((block[index] ?? '').startsWith('    relation ')) {
        const relation = parseRelation((block[index] ?? '').replace(/^ {4}/, '  '));

        if (relation === undefined) {
          return {
            rejection: oracleRejected(
              'declaration-grammar-violation',
              declarationPayload(declaringAuthority, declarationSubject),
            ),
          };
        }

        relations.push(relation);
        index += 1;
      }

      if (block[index] !== '  end-segment') {
        return { rejection: oracleRejected('declaration-grammar-violation', entryPayload(declaringAuthority)) };
      }

      segments.push({ scopeKey, scopeDescription, status, relations });
      index += 1;
    }

    if (block[index] !== 'end-declaration') {
      return { rejection: oracleRejected('declaration-grammar-violation', entryPayload(declaringAuthority)) };
    }

    declarations.push({ declaringAuthority, declarationSubject, sourceStatusDigest, form, segments });
    index += 1;
  }

  for (const declaration of declarations) {
    if (!identifierPattern.test(declaration.declarationSubject)) {
      return { rejection: oracleRejected('declaration-subject-grammar-violation', entryPayload(declaration.declaringAuthority)) };
    }
  }

  for (const declaration of declarations) {
    if (declaration.form !== 'WholeRecordLifecycle' && declaration.form !== 'SegmentedLifecycle') {
      return {
        rejection: oracleRejected(
          'unsupported-lifecycle-form',
          declarationPayload(declaration.declaringAuthority, declaration.declarationSubject),
        ),
      };
    }
  }

  for (const declaration of declarations) {
    for (const segment of declaration.segments) {
      for (const relation of segment.relations) {
        if (!identifierPattern.test(relation.relationTarget)) {
          return {
            rejection: oracleRejected(
              'relation-target-grammar-violation',
              declarationPayload(declaration.declaringAuthority, declaration.declarationSubject),
            ),
          };
        }
      }
    }
  }

  for (const declaration of declarations) {
    for (const segment of declaration.segments) {
      if (!['Effective', 'Superseded', 'Withdrawn'].includes(segment.status)) {
        return {
          rejection: oracleRejected(
            'unsupported-lifecycle-status',
            declarationPayload(declaration.declaringAuthority, declaration.declarationSubject),
          ),
        };
      }
    }
  }

  for (const declaration of declarations) {
    for (const segment of declaration.segments) {
      for (const relation of segment.relations) {
        if (!['SupersededBy', 'WithdrawnBy'].includes(relation.relationKind)) {
          return {
            rejection: oracleRejected(
              'unsupported-relation-kind',
              declarationPayload(declaration.declaringAuthority, declaration.declarationSubject),
            ),
          };
        }
      }
    }
  }

  for (const declaration of declarations) {
    if (declaration.form === 'SegmentedLifecycle' && declaration.segments.length < 2) {
      return {
        rejection: oracleRejected(
          'degenerate-segmentation',
          declarationPayload(declaration.declaringAuthority, declaration.declarationSubject),
        ),
      };
    }
  }

  const subjects = new Set<string>();

  for (const declaration of declarations) {
    if (subjects.has(declaration.declarationSubject)) {
      return {
        rejection: oracleRejected(
          'duplicate-declaration-subject',
          declarationPayload(declaration.declaringAuthority, declaration.declarationSubject),
        ),
      };
    }

    subjects.add(declaration.declarationSubject);
  }

  for (const declaration of declarations) {
    for (const segment of declaration.segments) {
      if (!scopeKeyPattern.test(segment.scopeKey)) {
        return {
          rejection: oracleRejected(
            'malformed-scope-key',
            declarationScopePayload(declaration.declaringAuthority, declaration.declarationSubject, segment.scopeKey),
          ),
        };
      }
    }
  }

  for (const declaration of declarations) {
    for (const segment of declaration.segments) {
      if (segment.scopeKey !== 'residual' && segment.scopeDescription === undefined) {
        return {
          rejection: oracleRejected(
            'missing-scope-description',
            declarationScopePayload(declaration.declaringAuthority, declaration.declarationSubject, segment.scopeKey),
          ),
        };
      }
    }
  }

  for (const declaration of declarations) {
    for (const segment of declaration.segments) {
      if (segment.scopeKey === 'residual' && segment.scopeDescription !== undefined) {
        return {
          rejection: oracleRejected(
            'residual-scope-description',
            declarationScopePayload(declaration.declaringAuthority, declaration.declarationSubject, segment.scopeKey),
          ),
        };
      }
    }
  }

  for (const declaration of declarations) {
    const scopeKeys = new Set<string>();

    for (const segment of declaration.segments) {
      if (scopeKeys.has(segment.scopeKey)) {
        return {
          rejection: oracleRejected(
            'duplicate-scope-key',
            declarationScopePayload(declaration.declaringAuthority, declaration.declarationSubject, segment.scopeKey),
          ),
        };
      }

      scopeKeys.add(segment.scopeKey);
    }
  }

  for (const declaration of declarations) {
    if (declaration.segments.filter((segment) => segment.scopeKey === 'residual').length !== 1) {
      return {
        rejection: oracleRejected(
          'incomplete-segmentation',
          declarationScopePayload(
            declaration.declaringAuthority,
            declaration.declarationSubject,
            'residual',
          ),
        ),
      };
    }
  }

  for (const declaration of declarations) {
    for (const segment of declaration.segments) {
      if (!statusRelationsMatch(segment.status, segment.relations)) {
        return {
          rejection: oracleRejected(
            'status-relation-mismatch',
            declarationScopePayload(declaration.declaringAuthority, declaration.declarationSubject, segment.scopeKey),
          ),
        };
      }
    }
  }

  return { declarations };
}

function parseRelation(line: string): Relation | undefined {
  const match = line.match(/^ {2}relation ([^ ]+) ([^ ]+)$/);

  if (match?.[1] === undefined || match[2] === undefined) {
    return undefined;
  }

  return { relationKind: match[1], relationTarget: match[2] };
}

function validateBinding(
  parsed: ParsedSource,
): { readonly records: readonly LifecycleRecord[] } | { readonly rejection: unknown } {
  for (const declaration of parsed.declarations) {
    const declarant = parsed.entries.find((entry) => entry.identifier === declaration.declaringAuthority);

    if (declarant?.status !== 'Active') {
      return { rejection: oracleRejected('declarant-not-effective', entryPayload(declaration.declaringAuthority)) };
    }
  }

  for (const declaration of parsed.declarations) {
    if (declaration.declaringAuthority === declaration.declarationSubject) {
      return {
        rejection: oracleRejected(
          'self-referential-declaration',
          declarationPayload(declaration.declaringAuthority, declaration.declarationSubject),
        ),
      };
    }
  }

  const authorityCycle = firstCycle(
    parsed.declarations.map((declaration) => ({
      from: declaration.declaringAuthority,
      to: declaration.declarationSubject,
    })),
  );

  if (authorityCycle !== undefined) {
    return { rejection: oracleRejected('cyclic-declaration-authority', relationPathPayload(authorityCycle)) };
  }

  for (const declaration of parsed.declarations) {
    const subject = parsed.entries.find((entry) => entry.identifier === declaration.declarationSubject);

    if (subject === undefined) {
      return {
        rejection: oracleRejected(
          'absent-declaration-subject',
          declarationPayload(declaration.declaringAuthority, declaration.declarationSubject),
        ),
      };
    }
  }

  for (const declaration of parsed.declarations) {
    const subject = parsed.entries.find((entry) => entry.identifier === declaration.declarationSubject);

    if (subject?.status === 'Active') {
      return {
        rejection: oracleRejected(
          'generic-rule-conflict',
          declarationPayload(declaration.declaringAuthority, declaration.declarationSubject),
        ),
      };
    }
  }

  for (const declaration of parsed.declarations) {
    const subject = parsed.entries.find((entry) => entry.identifier === declaration.declarationSubject);

    if (subject !== undefined && sourceStatusDigest(subject.status) !== declaration.sourceStatusDigest) {
      return {
        rejection: oracleRejected(
          'status-binding-mismatch',
          declarationPayload(declaration.declaringAuthority, declaration.declarationSubject),
        ),
      };
    }
  }

  const declarationsBySubject = new Set<string>();

  for (const declaration of parsed.declarations) {
    if (declarationsBySubject.has(declaration.declarationSubject)) {
      return {
        rejection: oracleRejected(
          'duplicate-declaration',
          declarationPayload(declaration.declaringAuthority, declaration.declarationSubject),
        ),
      };
    }

    declarationsBySubject.add(declaration.declarationSubject);
  }

  const records = parsed.entries.flatMap((entry): LifecycleRecord[] => {
    if (entry.status === 'Active') {
      return [genericRecord(entry)];
    }

    const declaration = parsed.declarations.find((candidate) => candidate.declarationSubject === entry.identifier);

    return declaration === undefined ? [] : [declaredRecord(entry, declaration)];
  });

  return { records };
}

function validateLifecycleGraph(records: readonly LifecycleRecord[]): { readonly rejection?: unknown } {
  const identifiers = new Set(records.map((record) => record.ratificationIdentifier));

  for (const record of records) {
    for (const segment of record.lifecycleSegments) {
      for (const relation of segment.lifecycleRelations) {
        if (!identifiers.has(relation.relationTarget)) {
          return {
            rejection: oracleRejected(
              'absent-relation-target',
              relationPathPayload([record.ratificationIdentifier, relation.relationTarget]),
            ),
          };
        }
      }
    }
  }

  for (const record of records) {
    for (const segment of record.lifecycleSegments) {
      for (const relation of segment.lifecycleRelations) {
        if (record.ratificationIdentifier === relation.relationTarget) {
          return {
            rejection: oracleRejected(
              'self-referential-relation',
              relationPathPayload([record.ratificationIdentifier, relation.relationTarget]),
            ),
          };
        }
      }
    }
  }

  const cycle = firstCycle(
    records.flatMap((record) =>
      record.lifecycleSegments.flatMap((segment) =>
        segment.lifecycleRelations.map((relation) => ({
          from: record.ratificationIdentifier,
          to: relation.relationTarget,
        })),
      ),
    ),
  );

  return cycle === undefined
    ? {}
    : { rejection: oracleRejected('cyclic-lifecycle-relation', relationPathPayload(cycle)) };
}

function validateEnvelope(input: OracleInput): { readonly rejection?: unknown } {
  if (!isValidCaptureInstant(input.capturedAt)) {
    return {
      rejection: oracleRejected('malformed-capture-instant', declaredInputPayload('capturedAt')),
    };
  }

  const attribution = input.producingAttribution;

  if (
    attribution.producingImplementationIdentity.length === 0
    || attribution.producingImplementationRevision.length === 0
  ) {
    return {
      rejection: oracleRejected(
        'malformed-attribution',
        declaredInputPayload(
          attribution.producingImplementationIdentity.length === 0
            ? 'producingImplementationIdentity'
            : 'producingImplementationRevision',
        ),
      ),
    };
  }

  const extraInputKey = Object.keys(input).filter((key) => !allowedInputKeys.includes(key as typeof allowedInputKeys[number])).sort()[0];

  if (extraInputKey !== undefined) {
    return { rejection: oracleRejected('malformed-attribution', declaredInputPayload(extraInputKey)) };
  }

  const extraAttributionKey = Object.keys(attribution)
    .filter((key) => !allowedAttributionKeys.includes(key as typeof allowedAttributionKeys[number]))
    .sort()[0];

  if (extraAttributionKey !== undefined) {
    return { rejection: oracleRejected('malformed-attribution', declaredInputPayload(extraAttributionKey)) };
  }

  return {};
}

function oracleIssued(prepared: string, records: readonly LifecycleRecord[], input: OracleInput): unknown {
  const recordFingerprints = records.map((record) => {
    const encoded = encodeRecord(record);

    return `${oracleConstants.recordFingerprintPrefix}${oracleSha256Hex(encoded)}`;
  });
  const sourceRevision = oracleSha256Hex(oracleString(prepared));
  const rootBasis = oracleRecord([
    ['authorityRecordFingerprints', requiredBytes(oracleOrderInsensitiveStrings(recordFingerprints))],
    ['authoritySourceIdentity', oracleString(oracleConstants.authoritySourceIdentity)],
    ['authoritySourceRevision', oracleString(sourceRevision)],
    ['canonicalSerializationProtocolId', oracleString(oracleConstants.canonicalSerializationProtocolId)],
    ['recordCount', oracleInteger(records.length)],
    ['snapshotSchemaVersion', oracleString(oracleConstants.snapshotSchemaVersion)],
  ]);
  const authorityRoot = `${oracleConstants.authorityRootPrefix}${oracleSha256Hex(rootBasis)}`;
  const attribution = oracleRecord([
    ['producingImplementationIdentity', oracleString(input.producingAttribution.producingImplementationIdentity)],
    ['producingImplementationRevision', oracleString(input.producingAttribution.producingImplementationRevision)],
  ]);
  const envelopeBasis = oracleRecord([
    ['authorityRoot', oracleString(authorityRoot)],
    ['authoritySourceIdentity', oracleString(oracleConstants.authoritySourceIdentity)],
    ['authoritySourceRevision', oracleString(sourceRevision)],
    ['canonicalSerializationProtocolId', oracleString(oracleConstants.canonicalSerializationProtocolId)],
    ['capturedAt', oracleString(input.capturedAt)],
    ['producingAttribution', attribution],
    ['recordCount', oracleInteger(records.length)],
    ['snapshotSchemaVersion', oracleString(oracleConstants.snapshotSchemaVersion)],
  ]);
  const declarationCount = records.filter((record) => record.lifecycleAuthorityKind === 'GovernedDeclaration').length;
  const genericCount = records.filter((record) => record.lifecycleAuthorityKind === 'GenericSourceRule').length;
  const segmentedCount = records.filter((record) => record.lifecycleResolutionForm === 'SegmentedLifecycle').length;

  return Object.freeze({
    result: 'Issued',
    envelope: Object.freeze({
      authorityRoot,
      authoritySourceIdentity: oracleConstants.authoritySourceIdentity,
      authoritySourceRevision: sourceRevision,
      canonicalSerializationProtocolId: oracleConstants.canonicalSerializationProtocolId,
      capturedAt: input.capturedAt,
      producingAttribution: Object.freeze({ ...input.producingAttribution }),
      recordCount: records.length,
      snapshotSchemaVersion: oracleConstants.snapshotSchemaVersion,
    }),
    envelopeCommitment: `${oracleConstants.envelopeCommitmentPrefix}${oracleSha256Hex(envelopeBasis)}`,
    records: deepFreeze(records.map(publicRecord)),
    recordFingerprints: Object.freeze(recordFingerprints),
    declarationCount,
    genericCount,
    segmentedCount,
  });
}

function encodeRecord(record: LifecycleRecord): Uint8Array {
  const common: [string, Uint8Array][] = [
    ['lifecycleAuthorityKind', oracleString(record.lifecycleAuthorityKind)],
    ['ratificationIdentifier', oracleString(record.ratificationIdentifier)],
    ['ratificationDate', oracleString(record.ratificationDate)],
    ['ratificationSubject', oracleString(record.ratificationSubject)],
    ['lifecycleResolutionForm', oracleString(record.lifecycleResolutionForm)],
  ];
  const segmentList = oracleList(record.lifecycleSegments.map(encodeSegment));

  return record.lifecycleAuthorityKind === 'GenericSourceRule'
    ? oracleRecord([...common, ['lifecycleSegments', segmentList]])
    : oracleRecord([
        ...common,
        ['lifecycleDeclaringAuthority', oracleString(record.lifecycleDeclaringAuthority ?? '')],
        ['lifecycleSegments', segmentList],
      ]);
}

function encodeSegment(segment: LifecycleSegment): Uint8Array {
  const relationList = oracleList(segment.lifecycleRelations.map((relation) =>
    oracleRecord([
      ['relationKind', oracleString(relation.relationKind)],
      ['relationTarget', oracleString(relation.relationTarget)],
    ]),
  ));

  return segment.scopeKind === 'ResidualScope'
    ? oracleRecord([
        ['scopeKind', oracleString(segment.scopeKind)],
        ['scopeKey', oracleString(segment.scopeKey)],
        ['lifecycleStatus', oracleString(segment.lifecycleStatus)],
        ['lifecycleRelations', relationList],
      ])
    : oracleRecord([
        ['scopeKind', oracleString(segment.scopeKind)],
        ['scopeKey', oracleString(segment.scopeKey)],
        ['scopeDescription', oracleString(segment.scopeDescription ?? '')],
        ['lifecycleStatus', oracleString(segment.lifecycleStatus)],
        ['lifecycleRelations', relationList],
      ]);
}

function genericRecord(entry: Entry): LifecycleRecord {
  return {
    lifecycleAuthorityKind: 'GenericSourceRule',
    ratificationIdentifier: entry.identifier,
    ratificationDate: entry.date,
    ratificationSubject: entry.subject,
    lifecycleResolutionForm: 'WholeRecordLifecycle',
    lifecycleSegments: [
      {
        scopeKind: 'ResidualScope',
        scopeKey: 'residual',
        lifecycleStatus: 'Effective',
        lifecycleRelations: [],
      },
    ],
  };
}

function declaredRecord(entry: Entry, declaration: Declaration): LifecycleRecord {
  return {
    lifecycleAuthorityKind: 'GovernedDeclaration',
    ratificationIdentifier: entry.identifier,
    ratificationDate: entry.date,
    ratificationSubject: entry.subject,
    lifecycleResolutionForm: declaration.form as 'WholeRecordLifecycle' | 'SegmentedLifecycle',
    lifecycleDeclaringAuthority: declaration.declaringAuthority,
    lifecycleSegments: declaration.segments.map((segment) => ({
      scopeKind: segment.scopeKey === 'residual' ? 'ResidualScope' : 'GovernedScope',
      scopeKey: segment.scopeKey,
      scopeDescription: segment.scopeDescription,
      lifecycleStatus: segment.status as 'Effective' | 'Superseded' | 'Withdrawn',
      lifecycleRelations: segment.relations.map((relation) => ({
        relationKind: relation.relationKind as 'SupersededBy' | 'WithdrawnBy',
        relationTarget: relation.relationTarget,
      })),
    })),
  };
}

function publicRecord(record: LifecycleRecord): object {
  const common = {
    lifecycleAuthorityKind: record.lifecycleAuthorityKind,
    ratificationIdentifier: record.ratificationIdentifier,
    ratificationDate: record.ratificationDate,
    ratificationSubject: record.ratificationSubject,
    lifecycleResolutionForm: record.lifecycleResolutionForm,
  };

  return record.lifecycleAuthorityKind === 'GenericSourceRule'
    ? { ...common, lifecycleSegments: record.lifecycleSegments.map(publicSegment) }
    : {
        ...common,
        lifecycleDeclaringAuthority: record.lifecycleDeclaringAuthority,
        lifecycleSegments: record.lifecycleSegments.map(publicSegment),
      };
}

function publicSegment(segment: LifecycleSegment): object {
  const common = {
    scopeKind: segment.scopeKind,
    scopeKey: segment.scopeKey,
  };

  return segment.scopeKind === 'ResidualScope'
    ? {
        ...common,
        lifecycleStatus: segment.lifecycleStatus,
        lifecycleRelations: segment.lifecycleRelations.map((relation) => ({ ...relation })),
      }
    : {
        ...common,
        scopeDescription: segment.scopeDescription,
        lifecycleStatus: segment.lifecycleStatus,
        lifecycleRelations: segment.lifecycleRelations.map((relation) => ({ ...relation })),
      };
}

function firstCycle(edges: readonly { readonly from: string; readonly to: string }[]): readonly string[] | undefined {
  const outgoing = new Map<string, string[]>();

  for (const edge of edges) {
    outgoing.set(edge.from, [...(outgoing.get(edge.from) ?? []), edge.to]);
  }

  const roots = [...outgoing.keys()].sort();
  const state = new Map<string, 'open' | 'closed'>();
  const stack: string[] = [];

  function visit(node: string): readonly string[] | undefined {
    const nodeState = state.get(node);

    if (nodeState === 'open') {
      const start = stack.indexOf(node);

      return [...stack.slice(start), node];
    }

    if (nodeState === 'closed') {
      return undefined;
    }

    state.set(node, 'open');
    stack.push(node);

    for (const target of outgoing.get(node) ?? []) {
      const cycle = visit(target);

      if (cycle !== undefined) {
        return cycle;
      }
    }

    stack.pop();
    state.set(node, 'closed');

    return undefined;
  }

  for (const root of roots) {
    const cycle = visit(root);

    if (cycle !== undefined) {
      return cycle;
    }
  }

  return undefined;
}

function oracleRejected(code: DiagnosticCode, payload: Payload): unknown {
  const [phase, precedence] = oracleDiagnosticMetadata[code];

  return Object.freeze({
    result: 'Rejected',
    diagnosticCode: code,
    diagnosticPhase: phase,
    diagnosticPrecedence: precedence,
    diagnosticPayload: deepFreeze(payload),
    detail: renderPayload(payload),
  });
}

function renderPayload(payload: Payload): string {
  switch (payload.payloadKind) {
    case 'NoPayload':
      return '';
    case 'EntryPayload':
      return payload.ratificationIdentifier;
    case 'EntrySectionPayload':
      return `${payload.ratificationIdentifier} :: ${payload.sectionHeading}`;
    case 'DeclarationPayload':
      return `${payload.declaringAuthority} :: ${payload.declarationSubject}`;
    case 'DeclarationScopePayload':
      return `${payload.declaringAuthority} :: ${payload.declarationSubject} :: ${payload.scopeKey}`;
    case 'RelationPathPayload':
      return payload.pathIdentifiers.join(' -> ');
    case 'DeclaredInputPayload':
      return payload.declaredField;
  }
}

function entryPayload(ratificationIdentifier: string): Payload {
  return { payloadKind: 'EntryPayload', ratificationIdentifier };
}

function entrySectionPayload(ratificationIdentifier: string, sectionHeading: string): Payload {
  return { payloadKind: 'EntrySectionPayload', ratificationIdentifier, sectionHeading };
}

function declarationPayload(declaringAuthority: string, declarationSubject: string): Payload {
  return { payloadKind: 'DeclarationPayload', declaringAuthority, declarationSubject };
}

function declarationScopePayload(
  declaringAuthority: string,
  declarationSubject: string,
  scopeKey: string,
): Payload {
  return { payloadKind: 'DeclarationScopePayload', declaringAuthority, declarationSubject, scopeKey };
}

function relationPathPayload(pathIdentifiers: readonly string[]): Payload {
  return { payloadKind: 'RelationPathPayload', pathIdentifiers };
}

function declaredInputPayload(declaredField: string): Payload {
  return { payloadKind: 'DeclaredInputPayload', declaredField };
}

function section(entry: Entry, heading: string): Section | undefined {
  return entry.sections.find((candidate) => candidate.heading === heading);
}

function requiredSection(entry: Entry, heading: string): Section {
  const found = section(entry, heading);

  if (found === undefined) {
    throw new Error(`oracle invariant: missing section ${heading}`);
  }

  return found;
}

function contentLines(target: Pick<Section, 'body'>): readonly string[] {
  return target.body.filter((line) => line !== '' && line !== '---');
}

function sourceStatusDigest(status: string): string {
  return oracleSha256Hex(oracleString(status));
}

function statusRelationsMatch(status: string, relations: readonly Relation[]): boolean {
  if (status === 'Effective') {
    return relations.length === 0;
  }

  if (status === 'Superseded') {
    return relations.length === 1 && relations[0]?.relationKind === 'SupersededBy';
  }

  if (status === 'Withdrawn') {
    return relations.length === 1 && relations[0]?.relationKind === 'WithdrawnBy';
  }

  return true;
}

function isSingleRealDate(lines: readonly string[]): boolean {
  return lines.length === 1 && isRealDate(lines[0] ?? '');
}

function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);

  if (year === undefined || month === undefined || day === undefined) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function isValidCaptureInstant(value: string): boolean {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/);

  if (match === null) {
    return false;
  }

  const [, yearText, monthText, dayText, hourText, minuteText, secondText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);

  return hour <= 23 && minute <= 59 && second <= 59 && isRealDate(`${yearText}-${monthText}-${dayText}`)
    && year > 0 && month > 0 && day > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredBytes(value: Uint8Array | undefined): Uint8Array {
  if (value === undefined) {
    throw new Error('oracle invariant: duplicate order-insensitive value');
  }

  return value;
}

function deepFreeze<T>(value: T): T {
  if (typeof value !== 'object' || value === null) {
    return value;
  }

  for (const child of Object.values(value)) {
    deepFreeze(child);
  }

  return Object.freeze(value);
}
