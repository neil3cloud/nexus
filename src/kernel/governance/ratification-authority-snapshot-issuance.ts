import {
  createRatificationAuthoritySnapshotRejectedResult,
  encodeLifecycleAuthorityRecord,
  encodeNccsOrderInsensitiveStrings,
  encodeNccsRecord,
  encodeNccsString,
  encodeProducingAttribution,
  noPayload,
  ratificationAuthoritySnapshotAuthorityRootPrefix,
  ratificationAuthoritySnapshotCanonicalSerializationProtocolId,
  ratificationAuthoritySnapshotDeclarationBlockFormat,
  ratificationAuthoritySnapshotEnvelopeCommitmentPrefix,
  ratificationAuthoritySnapshotGenericRuleStatusText,
  ratificationAuthoritySnapshotRecordFingerprintPrefix,
  ratificationAuthoritySnapshotSchemaVersion,
  ratificationAuthoritySnapshotSourceIdentity,
  sha256Hex,
} from './ratification-authority-snapshot-issuance.contract';
import {
  RatificationAuthoritySnapshotIssuanceContractError,
} from './ratification-authority-snapshot-issuance.errors';
import type {
  RatificationAuthoritySnapshotDiagnosticPayload,
  RatificationAuthoritySnapshotGovernedDeclarationRecord,
  RatificationAuthoritySnapshotIssuanceResult,
  RatificationAuthoritySnapshotLifecycleRelation,
  RatificationAuthoritySnapshotLifecycleSegment,
  RatificationAuthoritySnapshotLifecycleStatus,
  RatificationAuthoritySnapshotProducingAttribution,
  RatificationAuthoritySnapshotRecord,
  RatificationAuthoritySnapshotSourceInput,
} from './ratification-authority-snapshot-issuance.types';
import { RatificationAuthoritySnapshotSource } from './ratification-authority-snapshot-issuance.types';

const identifierPattern = /^NEXUS-RAT-\d{4}-\d{2}-\d{2}-\d{3}$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const capturedAtPattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/;
const digestPattern = /^[0-9a-f]{64}$/;
const scopeKeyPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const requiredSectionHeadings = [
  '## Ratification Identifier',
  '## Date',
  '## Subject',
  '## Current Status',
] as const;

interface PreparedSource {
  readonly text: string;
  readonly lines: readonly string[];
  readonly fencedLineIndexes: ReadonlySet<number>;
  readonly hasUnterminatedFence: boolean;
}

interface Section {
  readonly heading: string;
  readonly lineIndex: number;
  readonly bodyLines: readonly string[];
}

interface Entry {
  readonly identifier: string;
  readonly boundaryLineIndex: number;
  readonly lines: readonly string[];
  readonly sections: ReadonlyMap<string, Section>;
}

interface ParsedEntry {
  readonly entry: Entry;
  readonly identifier: string;
  readonly date: string;
  readonly subject: string;
  readonly currentStatus: string;
  readonly currentStatusDigest: string;
}

interface ParsedDeclaration {
  readonly declaringAuthority: string;
  readonly subject: string;
  readonly sourceStatusDigest: string;
  readonly form: 'WholeRecordLifecycle' | 'SegmentedLifecycle';
  readonly segments: readonly ParsedSegment[];
}

interface ParsedSegment {
  readonly scopeKey: string;
  readonly scopeDescription?: string;
  readonly status: RatificationAuthoritySnapshotLifecycleStatus;
  readonly relations: readonly RatificationAuthoritySnapshotLifecycleRelation[];
}

interface DeclarationSet {
  readonly declarations: readonly ParsedDeclaration[];
}

export function issueRatificationAuthoritySnapshot(
  input: unknown,
): RatificationAuthoritySnapshotIssuanceResult {
  const sourceInput = readSourceInput(input);

  if (sourceInput === undefined) {
    return reject('invalid-input', noPayload());
  }

  const prepared = prepareSource(sourceInput.source);

  if (prepared.result !== undefined) {
    return prepared.result;
  }

  const entries = extractEntries(prepared.value);

  if (entries.result !== undefined) {
    return entries.result;
  }

  const parsedEntries = parseEntryStructure(entries.value);

  if (parsedEntries.result !== undefined) {
    return parsedEntries.result;
  }

  const declarations = parseDeclarations(parsedEntries.value);

  if (declarations.result !== undefined) {
    return declarations.result;
  }

  const declarantAuthority = validateDeclarantAuthority(parsedEntries.value, declarations.value);

  if (declarantAuthority.result !== undefined) {
    return declarantAuthority.result;
  }

  const boundDeclarations = validateDeclarationBinding(parsedEntries.value, declarations.value);

  if (boundDeclarations.result !== undefined) {
    return boundDeclarations.result;
  }

  const provisionalRecords = buildProvisionalRecords(parsedEntries.value, declarations.value);
  const lifecycleGraph = validateLifecycleGraph(provisionalRecords);

  if (lifecycleGraph.result !== undefined) {
    return lifecycleGraph.result;
  }

  const unresolved = provisionalRecords.find((record) => record.record === undefined);

  if (unresolved !== undefined) {
    return reject('unresolved-lifecycle', entryPayload(unresolved.entry.identifier));
  }

  const records = provisionalRecords.map((record) => record.record).filter(isDefined);

  const commitment = deriveAuthorityCommitment(prepared.value.text, records);

  if (commitment.result !== undefined) {
    return commitment.result;
  }

  const envelopeInput = validateEnvelopeInput(input);

  if (envelopeInput.result !== undefined) {
    return envelopeInput.result;
  }

  return issueResult(commitment.value, records, envelopeInput.value);
}

function readSourceInput(input: unknown): RatificationAuthoritySnapshotSourceInput | undefined {
  if (!isRecord(input) || !(input.source instanceof RatificationAuthoritySnapshotSource)) {
    return undefined;
  }

  const capturedAt = input.capturedAt;
  const producingAttribution = input.producingAttribution;

  if (typeof capturedAt !== 'string' || !isProducingAttribution(producingAttribution)) {
    return undefined;
  }

  return {
    source: input.source,
    capturedAt,
    producingAttribution,
  };
}

function prepareSource(
  source: RatificationAuthoritySnapshotSource,
): { readonly value: PreparedSource; readonly result?: undefined } | { readonly result: RatificationAuthoritySnapshotIssuanceResult } {
  const rawBytes = source.toBytes();

  for (let index = 0; index < rawBytes.length - 2; index += 1) {
    if (rawBytes[index] === 0xef && rawBytes[index + 1] === 0xbb && rawBytes[index + 2] === 0xbf) {
      return { result: reject('byte-order-mark-present', noPayload()) };
    }
  }

  let text: string;

  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(rawBytes);
  } catch {
    return { result: reject('invalid-utf8', noPayload()) };
  }

  if (text.includes('\uFEFF')) {
    return { result: reject('byte-order-mark-present', noPayload()) };
  }

  const normalizedText = text.normalize('NFC').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalizedText.split('\n');
  const fence = collectFencedLineIndexes(lines);

  return {
    value: Object.freeze({
      text: normalizedText,
      lines: Object.freeze(lines),
      fencedLineIndexes: fence.indexes,
      hasUnterminatedFence: fence.unterminated,
    }),
  };
}

function extractEntries(
  prepared: PreparedSource,
): { readonly value: readonly Entry[]; readonly result?: undefined } | { readonly result: RatificationAuthoritySnapshotIssuanceResult } {
  const boundaries: { readonly identifier: string; readonly lineIndex: number }[] = [];

  prepared.lines.forEach((line, lineIndex) => {
    if (!prepared.fencedLineIndexes.has(lineIndex) && line.startsWith('# ')) {
      const identifier = line.slice(2);

      if (identifierPattern.test(identifier)) {
        boundaries.push({ identifier, lineIndex });
      }
    }
  });

  if (boundaries.length === 0) {
    return { result: reject('no-entries', noPayload()) };
  }

  if (prepared.hasUnterminatedFence) {
    return { result: reject('unterminated-fenced-region', noPayload()) };
  }

  const entries = boundaries.map((boundary, index) => {
    const nextBoundary = boundaries[index + 1];
    const endLine = nextBoundary?.lineIndex ?? prepared.lines.length;
    const lines = prepared.lines.slice(boundary.lineIndex, endLine);
    const sections = extractSections(prepared, boundary.lineIndex, endLine);

    return Object.freeze({
      identifier: boundary.identifier,
      boundaryLineIndex: boundary.lineIndex,
      lines: Object.freeze(lines),
      sections: sections.sections,
    });
  });

  const duplicateSection = entries.find((entry) => {
    const sections = extractSections(prepared, entry.boundaryLineIndex, entry.boundaryLineIndex + entry.lines.length);

    return sections.duplicate !== undefined;
  });

  if (duplicateSection !== undefined) {
    const duplicate = extractSections(
      prepared,
      duplicateSection.boundaryLineIndex,
      duplicateSection.boundaryLineIndex + duplicateSection.lines.length,
    ).duplicate;

    if (duplicate !== undefined) {
      return {
        result: reject('duplicate-section', entrySectionPayload(duplicateSection.identifier, duplicate)),
      };
    }
  }

  return { value: Object.freeze(entries) };
}

function parseEntryStructure(
  entries: readonly Entry[],
): { readonly value: readonly ParsedEntry[]; readonly result?: undefined } | { readonly result: RatificationAuthoritySnapshotIssuanceResult } {
  for (const entry of entries) {
    for (const heading of requiredSectionHeadings) {
      if (!entry.sections.has(heading)) {
        return { result: reject('missing-section', entrySectionPayload(entry.identifier, heading)) };
      }
    }
  }

  const parsedEntries: ParsedEntry[] = [];
  const seenIdentifiers = new Set<string>();

  for (const entry of entries) {
    const identifier = firstContentLine(entry, '## Ratification Identifier');

    if (identifier === undefined) {
      return { result: reject('missing-identifier', entryPayload(entry.identifier)) };
    }

    if (!identifierPattern.test(identifier)) {
      return { result: reject('identifier-grammar-violation', entryPayload(entry.identifier)) };
    }

    if (identifier !== entry.identifier) {
      return { result: reject('identifier-heading-mismatch', entryPayload(entry.identifier)) };
    }

    const dateLines = contentLines(entry, '## Date');

    if (dateLines.length !== 1 || !isRealDate(dateLines[0] ?? '')) {
      return { result: reject('malformed-date', entryPayload(entry.identifier)) };
    }

    const statusLines = contentLines(entry, '## Current Status');

    if (statusLines.length !== 1) {
      return { result: reject('malformed-status', entryPayload(entry.identifier)) };
    }

    const subjectLines = contentLines(entry, '## Subject');

    if (subjectLines.length === 0) {
      return { result: reject('missing-subject', entryPayload(entry.identifier)) };
    }

    if (seenIdentifiers.has(identifier)) {
      return { result: reject('duplicate-entry-identifier', entryPayload(identifier)) };
    }

    seenIdentifiers.add(identifier);

    const currentStatus = statusLines[0] ?? '';

    parsedEntries.push(
      Object.freeze({
        entry,
        identifier,
        date: dateLines[0] ?? '',
        subject: subjectLines.join('\n'),
        currentStatus,
        currentStatusDigest: sha256Hex(encodeNccsString(currentStatus)),
      }),
    );
  }

  return { value: Object.freeze(parsedEntries) };
}

function parseDeclarations(
  entries: readonly ParsedEntry[],
): { readonly value: DeclarationSet; readonly result?: undefined } | { readonly result: RatificationAuthoritySnapshotIssuanceResult } {
  const declarations: ParsedDeclaration[] = [];

  for (const parsedEntry of entries) {
    const declarationSection = parsedEntry.entry.sections.get('## Lifecycle Authority Declarations');

    if (declarationSection === undefined) {
      continue;
    }

    const blockLines = declarationSection.bodyLines;
    const openingIndex = blockLines.findIndex((line) => line === '```text');

    if (openingIndex === -1) {
      return { result: reject('missing-declaration-block', entryPayload(parsedEntry.identifier)) };
    }

    const closingIndex = blockLines.findIndex((line, index) => index > openingIndex && line === '```');

    if (closingIndex === -1) {
      return { result: reject('unterminated-declaration-block', entryPayload(parsedEntry.identifier)) };
    }

    if (blockLines.slice(openingIndex + 1, closingIndex).some((line) => line === '```text')) {
      return { result: reject('nested-declaration-block', entryPayload(parsedEntry.identifier)) };
    }

    if (blockLines.slice(closingIndex + 1).some((line) => line !== '' && line !== '---')) {
      return { result: reject('extraneous-declaration-content', entryPayload(parsedEntry.identifier)) };
    }

    const body = blockLines.slice(openingIndex + 1, closingIndex);
    const parsed = parseDeclarationBlock(parsedEntry.identifier, body);

    if (parsed.result !== undefined) {
      return parsed;
    }

    declarations.push(...parsed.value);
  }

  return { value: Object.freeze({ declarations: Object.freeze(declarations) }) };
}

function parseDeclarationBlock(
  declaringAuthority: string,
  lines: readonly string[],
): { readonly value: readonly ParsedDeclaration[]; readonly result?: undefined } | { readonly result: RatificationAuthoritySnapshotIssuanceResult } {
  if (lines[0] !== ratificationAuthoritySnapshotDeclarationBlockFormat || lines[lines.length - 1] !== 'end-block') {
    return { result: reject('declaration-grammar-violation', entryPayload(declaringAuthority)) };
  }

  const declarations: ParsedDeclaration[] = [];
  let cursor = 1;

  while (cursor < lines.length - 1) {
    const declarationLine = lines[cursor];

    if (declarationLine === undefined || !declarationLine.startsWith('declaration ')) {
      return { result: reject('declaration-grammar-violation', entryPayload(declaringAuthority)) };
    }

    const subject = declarationLine.slice('declaration '.length);

    if (!identifierPattern.test(subject)) {
      return { result: reject('declaration-subject-grammar-violation', entryPayload(declaringAuthority)) };
    }

    const sourceStatusDigestLine = lines[cursor + 1];

    if (sourceStatusDigestLine === undefined || !sourceStatusDigestLine.startsWith('  sourceStatusDigest ')) {
      return { result: reject('declaration-grammar-violation', entryPayload(declaringAuthority)) };
    }

    const sourceStatusDigest = sourceStatusDigestLine.slice('  sourceStatusDigest '.length);

    if (!digestPattern.test(sourceStatusDigest)) {
      return { result: reject('declaration-grammar-violation', entryPayload(declaringAuthority)) };
    }

    const formLine = lines[cursor + 2];

    if (formLine === undefined || !formLine.startsWith('  form ')) {
      return { result: reject('declaration-grammar-violation', entryPayload(declaringAuthority)) };
    }

    const form = formLine.slice('  form '.length);

    if (form !== 'WholeRecordLifecycle' && form !== 'SegmentedLifecycle') {
      return { result: reject('unsupported-lifecycle-form', declarationPayload(declaringAuthority, subject)) };
    }

    const parse = form === 'WholeRecordLifecycle'
      ? parseWholeRecordDeclaration(declaringAuthority, subject, lines, cursor + 3)
      : parseSegmentedDeclaration(declaringAuthority, subject, lines, cursor + 3);

    if (parse.result !== undefined) {
      return parse;
    }

    declarations.push(
      Object.freeze({
        declaringAuthority,
        subject,
        sourceStatusDigest,
        form,
        segments: Object.freeze(parse.value.segments),
      }),
    );
    cursor = parse.value.nextCursor;
  }

  if (declarations.length === 0) {
    return { result: reject('empty-declaration-block', entryPayload(declaringAuthority)) };
  }

  const seen = new Set<string>();

  for (const declaration of declarations) {
    if (seen.has(declaration.subject)) {
      return {
        result: reject(
          'duplicate-declaration-subject',
          declarationPayload(declaration.declaringAuthority, declaration.subject),
        ),
      };
    }

    seen.add(declaration.subject);
  }

  return { value: Object.freeze(declarations) };
}

function parseWholeRecordDeclaration(
  declaringAuthority: string,
  subject: string,
  lines: readonly string[],
  cursor: number,
): { readonly value: { readonly segments: readonly ParsedSegment[]; readonly nextCursor: number }; readonly result?: undefined } | { readonly result: RatificationAuthoritySnapshotIssuanceResult } {
  const statusLine = lines[cursor];

  if (statusLine === undefined || !statusLine.startsWith('  status ')) {
    return { result: reject('declaration-grammar-violation', entryPayload(declaringAuthority)) };
  }

  const status = statusLine.slice('  status '.length);
  const statusResult = validateLifecycleStatus(status, declaringAuthority, subject);

  if (statusResult !== undefined) {
    return { result: statusResult };
  }

  const relations: RatificationAuthoritySnapshotLifecycleRelation[] = [];
  let nextCursor = cursor + 1;

  while (lines[nextCursor]?.startsWith('  relation ') === true) {
    const relation = parseRelationLine(declaringAuthority, subject, lines[nextCursor] ?? '');

    if (relation.result !== undefined) {
      return relation;
    }

    relations.push(relation.value);
    nextCursor += 1;
  }

  if (lines[nextCursor] !== 'end-declaration') {
    return { result: reject('declaration-grammar-violation', entryPayload(declaringAuthority)) };
  }

  const segment = validateSegment(
    declaringAuthority,
    subject,
    {
      scopeKey: 'residual',
      status,
      relations,
    },
    'WholeRecordLifecycle',
  );

  if (segment.result !== undefined) {
    return segment;
  }

  return {
    value: {
      segments: Object.freeze([segment.value]),
      nextCursor: nextCursor + 1,
    },
  };
}

function parseSegmentedDeclaration(
  declaringAuthority: string,
  subject: string,
  lines: readonly string[],
  cursor: number,
): { readonly value: { readonly segments: readonly ParsedSegment[]; readonly nextCursor: number }; readonly result?: undefined } | { readonly result: RatificationAuthoritySnapshotIssuanceResult } {
  const segments: ParsedSegment[] = [];
  let nextCursor = cursor;

  while (lines[nextCursor]?.startsWith('  segment ') === true) {
    const scopeKey = (lines[nextCursor] ?? '').slice('  segment '.length);

    if (!scopeKeyPattern.test(scopeKey)) {
      return {
        result: reject('malformed-scope-key', declarationScopePayload(declaringAuthority, subject, scopeKey)),
      };
    }

    const describesLine = lines[nextCursor + 1];
    const hasDescription = describesLine?.startsWith('    describes ') === true;

    if (scopeKey !== 'residual' && !hasDescription) {
      return {
        result: reject('missing-scope-description', declarationScopePayload(declaringAuthority, subject, scopeKey)),
      };
    }

    if (scopeKey === 'residual' && hasDescription) {
      return {
        result: reject('residual-scope-description', declarationScopePayload(declaringAuthority, subject, scopeKey)),
      };
    }

    const scopeDescription = hasDescription ? (describesLine ?? '').slice('    describes '.length) : undefined;

    if (scopeKey !== 'residual' && scopeDescription?.length === 0) {
      return {
        result: reject('missing-scope-description', declarationScopePayload(declaringAuthority, subject, scopeKey)),
      };
    }

    const statusOffset = hasDescription ? 2 : 1;
    const statusLine = lines[nextCursor + statusOffset];

    if (statusLine === undefined || !statusLine.startsWith('    status ')) {
      return { result: reject('declaration-grammar-violation', entryPayload(declaringAuthority)) };
    }

    const status = statusLine.slice('    status '.length);
    const statusResult = validateLifecycleStatus(status, declaringAuthority, subject);

    if (statusResult !== undefined) {
      return { result: statusResult };
    }

    const relations: RatificationAuthoritySnapshotLifecycleRelation[] = [];
    nextCursor += statusOffset + 1;

    while (lines[nextCursor]?.startsWith('    relation ') === true) {
      const relation = parseRelationLine(
        declaringAuthority,
        subject,
        `  ${(lines[nextCursor] ?? '').slice(4)}`,
      );

      if (relation.result !== undefined) {
        return relation;
      }

      relations.push(relation.value);
      nextCursor += 1;
    }

    if (lines[nextCursor] !== '  end-segment') {
      return { result: reject('declaration-grammar-violation', entryPayload(declaringAuthority)) };
    }

    const segment = validateSegment(
      declaringAuthority,
      subject,
      {
        scopeKey,
        ...(scopeDescription === undefined ? {} : { scopeDescription }),
        status,
        relations,
      },
      'SegmentedLifecycle',
    );

    if (segment.result !== undefined) {
      return segment;
    }

    segments.push(segment.value);
    nextCursor += 1;
  }

  if (lines[nextCursor] !== 'end-declaration') {
    return { result: reject('declaration-grammar-violation', entryPayload(declaringAuthority)) };
  }

  if (segments.length < 2) {
    return { result: reject('degenerate-segmentation', declarationPayload(declaringAuthority, subject)) };
  }

  const duplicate = firstDuplicate(segments.map((segment) => segment.scopeKey));

  if (duplicate !== undefined) {
    return {
      result: reject('duplicate-scope-key', declarationScopePayload(declaringAuthority, subject, duplicate)),
    };
  }

  if (!segments.some((segment) => segment.scopeKey === 'residual')) {
    return {
      result: reject('incomplete-segmentation', declarationScopePayload(declaringAuthority, subject, 'residual')),
    };
  }

  return { value: { segments: Object.freeze(segments), nextCursor: nextCursor + 1 } };
}

function parseRelationLine(
  declaringAuthority: string,
  subject: string,
  line: string,
): { readonly value: RatificationAuthoritySnapshotLifecycleRelation; readonly result?: undefined } | { readonly result: RatificationAuthoritySnapshotIssuanceResult } {
  const relationText = line.slice('  relation '.length);
  const [kind, target, extra] = relationText.split(' ');

  if (kind === undefined || target === undefined || extra !== undefined) {
    return { result: reject('declaration-grammar-violation', entryPayload(declaringAuthority)) };
  }

  if (kind !== 'SupersededBy' && kind !== 'WithdrawnBy') {
    return { result: reject('unsupported-relation-kind', declarationPayload(declaringAuthority, subject)) };
  }

  if (!identifierPattern.test(target)) {
    return { result: reject('relation-target-grammar-violation', declarationPayload(declaringAuthority, subject)) };
  }

  return {
    value: Object.freeze({
      relationKind: kind,
      relationTarget: target,
    }),
  };
}

function validateDeclarantAuthority(
  entries: readonly ParsedEntry[],
  declarations: DeclarationSet,
): { readonly result?: RatificationAuthoritySnapshotIssuanceResult } {
  const genericEffective = new Set(
    entries
      .filter((entry) => entry.currentStatus === ratificationAuthoritySnapshotGenericRuleStatusText)
      .map((entry) => entry.identifier),
  );

  for (const declaration of declarations.declarations) {
    if (!genericEffective.has(declaration.declaringAuthority)) {
      return { result: reject('declarant-not-effective', entryPayload(declaration.declaringAuthority)) };
    }
  }

  for (const declaration of declarations.declarations) {
    if (declaration.declaringAuthority === declaration.subject) {
      return {
        result: reject(
          'self-referential-declaration',
          declarationPayload(declaration.declaringAuthority, declaration.subject),
        ),
      };
    }
  }

  const cycle = findCycle(
    declarations.declarations.map((declaration) => ({
      from: declaration.declaringAuthority,
      to: declaration.subject,
    })),
  );

  if (cycle !== undefined) {
    return { result: reject('cyclic-declaration-authority', relationPathPayload(cycle)) };
  }

  return {};
}

function validateDeclarationBinding(
  entries: readonly ParsedEntry[],
  declarations: DeclarationSet,
): { readonly result?: RatificationAuthoritySnapshotIssuanceResult } {
  const entryByIdentifier = new Map(entries.map((entry) => [entry.identifier, entry]));
  const claimed = new Set<string>();

  for (const declaration of declarations.declarations) {
    const target = entryByIdentifier.get(declaration.subject);

    if (target === undefined) {
      return {
        result: reject(
          'absent-declaration-subject',
          declarationPayload(declaration.declaringAuthority, declaration.subject),
        ),
      };
    }
  }

  for (const declaration of declarations.declarations) {
    const target = entryByIdentifier.get(declaration.subject);

    if (target?.currentStatus === ratificationAuthoritySnapshotGenericRuleStatusText) {
      return {
        result: reject('generic-rule-conflict', declarationPayload(declaration.declaringAuthority, declaration.subject)),
      };
    }
  }

  for (const declaration of declarations.declarations) {
    const target = entryByIdentifier.get(declaration.subject);

    if (target?.currentStatusDigest !== declaration.sourceStatusDigest) {
      return {
        result: reject('status-binding-mismatch', declarationPayload(declaration.declaringAuthority, declaration.subject)),
      };
    }
  }

  for (const declaration of declarations.declarations) {
    if (claimed.has(declaration.subject)) {
      return {
        result: reject('duplicate-declaration', declarationPayload(declaration.declaringAuthority, declaration.subject)),
      };
    }

    claimed.add(declaration.subject);
  }

  return {};
}

function buildProvisionalRecords(
  entries: readonly ParsedEntry[],
  declarations: DeclarationSet,
): readonly { readonly entry: ParsedEntry; readonly record?: RatificationAuthoritySnapshotRecord }[] {
  const declarationBySubject = new Map(
    declarations.declarations.map((declaration) => [declaration.subject, declaration]),
  );

  return Object.freeze(
    entries.map((entry) => {
      if (entry.currentStatus === ratificationAuthoritySnapshotGenericRuleStatusText) {
        return Object.freeze({
          entry,
          record: createGenericRecord(entry),
        });
      }

      const declaration = declarationBySubject.get(entry.identifier);

      if (declaration === undefined) {
        return Object.freeze({ entry });
      }

      return Object.freeze({
        entry,
        record: createDeclaredRecord(entry, declaration),
      });
    }),
  );
}

function validateLifecycleGraph(
  provisionalRecords: readonly { readonly entry: ParsedEntry; readonly record?: RatificationAuthoritySnapshotRecord }[],
): { readonly result?: RatificationAuthoritySnapshotIssuanceResult } {
  const recordIdentifiers = new Set(provisionalRecords.map((record) => record.entry.identifier));
  const structurallyValid = new Set(
    provisionalRecords.filter((record) => record.record !== undefined).map((record) => record.entry.identifier),
  );
  const edges: { readonly from: string; readonly to: string }[] = [];

  for (const provisionalRecord of provisionalRecords) {
    const from = provisionalRecord.entry.identifier;
    const relations = provisionalRecord.record?.lifecycleSegments.flatMap((segment) => segment.lifecycleRelations) ?? [];

    for (const relation of relations) {
      if (!recordIdentifiers.has(relation.relationTarget) || !structurallyValid.has(relation.relationTarget)) {
        return { result: reject('absent-relation-target', relationPathPayload([from, relation.relationTarget])) };
      }

      edges.push({ from, to: relation.relationTarget });
    }
  }

  for (const edge of edges) {
    if (edge.from === edge.to) {
      return { result: reject('self-referential-relation', relationPathPayload([edge.from, edge.to])) };
    }
  }

  const cycle = findCycle(edges);

  if (cycle !== undefined) {
    return { result: reject('cyclic-lifecycle-relation', relationPathPayload(cycle)) };
  }

  return {};
}

function validateEnvelopeInput(
  input: unknown,
): { readonly value: { readonly capturedAt: string; readonly producingAttribution: RatificationAuthoritySnapshotProducingAttribution }; readonly result?: undefined } | { readonly result: RatificationAuthoritySnapshotIssuanceResult } {
  if (!isRecord(input)) {
    return { result: reject('malformed-attribution', declaredInputPayload('source')) };
  }

  const allowedKeys = new Set(['source', 'capturedAt', 'producingAttribution']);
  const extraKey = Object.keys(input).filter((key) => !allowedKeys.has(key)).sort()[0];

  if (extraKey !== undefined) {
    return { result: reject('malformed-attribution', declaredInputPayload(extraKey)) };
  }

  if (typeof input.capturedAt !== 'string' || !isValidCapturedAt(input.capturedAt)) {
    return { result: reject('malformed-capture-instant', declaredInputPayload('capturedAt')) };
  }

  if (!isRecord(input.producingAttribution)) {
    return { result: reject('malformed-attribution', declaredInputPayload('producingAttribution')) };
  }

  const attributionKeys = Object.keys(input.producingAttribution);
  const allowedAttributionKeys = new Set([
    'producingImplementationIdentity',
    'producingImplementationRevision',
  ]);
  const extraAttributionKey = attributionKeys.filter((key) => !allowedAttributionKeys.has(key)).sort()[0];

  if (extraAttributionKey !== undefined) {
    return { result: reject('malformed-attribution', declaredInputPayload(extraAttributionKey)) };
  }

  if (typeof input.producingAttribution.producingImplementationIdentity !== 'string' || input.producingAttribution.producingImplementationIdentity.length === 0) {
    return { result: reject('malformed-attribution', declaredInputPayload('producingImplementationIdentity')) };
  }

  if (typeof input.producingAttribution.producingImplementationRevision !== 'string' || input.producingAttribution.producingImplementationRevision.length === 0) {
    return { result: reject('malformed-attribution', declaredInputPayload('producingImplementationRevision')) };
  }

  return {
    value: {
      capturedAt: input.capturedAt,
      producingAttribution: Object.freeze({
        producingImplementationIdentity: input.producingAttribution.producingImplementationIdentity,
        producingImplementationRevision: input.producingAttribution.producingImplementationRevision,
      }),
    },
  };
}

interface AuthorityCommitmentStage {
  readonly authoritySourceRevision: string;
  readonly recordFingerprints: readonly string[];
  readonly encodedFingerprints: Uint8Array;
  readonly authorityRoot: string;
}

type AuthorityCommitmentResult =
  | { readonly result?: undefined; readonly value: AuthorityCommitmentStage }
  | { readonly result: RatificationAuthoritySnapshotIssuanceResult; readonly value?: undefined };

function deriveAuthorityCommitment(
  preparedText: string,
  records: readonly RatificationAuthoritySnapshotRecord[],
): AuthorityCommitmentResult {
  const authoritySourceRevision = sha256Hex(encodeNccsString(preparedText));

  const recordFingerprints: string[] = [];
  const seenFingerprints = new Set<string>();

  for (const record of records) {
    const fingerprint =
      `${ratificationAuthoritySnapshotRecordFingerprintPrefix}${sha256Hex(encodeLifecycleAuthorityRecord(record))}`;

    if (seenFingerprints.has(fingerprint)) {
      return { result: reject('duplicate-record-fingerprint', entryPayload(record.ratificationIdentifier)) };
    }

    seenFingerprints.add(fingerprint);
    recordFingerprints.push(fingerprint);
  }

  const encodedFingerprints = encodeNccsOrderInsensitiveStrings(recordFingerprints);

  if (encodedFingerprints === undefined) {
    throw new RatificationAuthoritySnapshotIssuanceContractError(
      'internal-invariant-violation',
      'Canonical order-insensitive encoding refused the record-fingerprint collection after the uniqueness check passed',
    );
  }

  const authorityRootBasis = encodeNccsRecord([
    ['authorityRecordFingerprints', encodedFingerprints],
    ['authoritySourceIdentity', encodeNccsString(ratificationAuthoritySnapshotSourceIdentity)],
    ['authoritySourceRevision', encodeNccsString(authoritySourceRevision)],
    ['canonicalSerializationProtocolId', encodeNccsString(ratificationAuthoritySnapshotCanonicalSerializationProtocolId)],
    ['recordCount', Buffer.from(`i${records.length}e`, 'utf8')],
    ['snapshotSchemaVersion', encodeNccsString(ratificationAuthoritySnapshotSchemaVersion)],
  ]);
  const authorityRoot = `${ratificationAuthoritySnapshotAuthorityRootPrefix}${sha256Hex(authorityRootBasis)}`;

  return { value: { authoritySourceRevision, recordFingerprints, encodedFingerprints, authorityRoot } };
}

function issueResult(
  commitment: AuthorityCommitmentStage,
  records: readonly RatificationAuthoritySnapshotRecord[],
  envelopeInput: {
    readonly capturedAt: string;
    readonly producingAttribution: RatificationAuthoritySnapshotProducingAttribution;
  },
): RatificationAuthoritySnapshotIssuanceResult {
  const { authoritySourceRevision, recordFingerprints, authorityRoot } = commitment;
  const envelopeCommitmentBasis = encodeNccsRecord([
    ['authorityRoot', encodeNccsString(authorityRoot)],
    ['authoritySourceIdentity', encodeNccsString(ratificationAuthoritySnapshotSourceIdentity)],
    ['authoritySourceRevision', encodeNccsString(authoritySourceRevision)],
    ['canonicalSerializationProtocolId', encodeNccsString(ratificationAuthoritySnapshotCanonicalSerializationProtocolId)],
    ['capturedAt', encodeNccsString(envelopeInput.capturedAt)],
    ['producingAttribution', encodeProducingAttribution(envelopeInput.producingAttribution)],
    ['recordCount', Buffer.from(`i${records.length}e`, 'utf8')],
    ['snapshotSchemaVersion', encodeNccsString(ratificationAuthoritySnapshotSchemaVersion)],
  ]);
  const envelopeCommitment = `${ratificationAuthoritySnapshotEnvelopeCommitmentPrefix}${sha256Hex(envelopeCommitmentBasis)}`;
  const declarationCount = records.filter((record) => record.lifecycleAuthorityKind === 'GovernedDeclaration').length;
  const genericCount = records.filter((record) => record.lifecycleAuthorityKind === 'GenericSourceRule').length;
  const segmentedCount = records.filter((record) => record.lifecycleResolutionForm === 'SegmentedLifecycle').length;

  return Object.freeze({
    result: 'Issued',
    envelope: Object.freeze({
      authorityRoot,
      authoritySourceIdentity: ratificationAuthoritySnapshotSourceIdentity,
      authoritySourceRevision,
      canonicalSerializationProtocolId: ratificationAuthoritySnapshotCanonicalSerializationProtocolId,
      capturedAt: envelopeInput.capturedAt,
      producingAttribution: envelopeInput.producingAttribution,
      recordCount: records.length,
      snapshotSchemaVersion: ratificationAuthoritySnapshotSchemaVersion,
    }),
    envelopeCommitment,
    records: freezeRecords(records),
    recordFingerprints: Object.freeze([...recordFingerprints].sort()),
    declarationCount,
    genericCount,
    segmentedCount,
  });
}

function collectFencedLineIndexes(lines: readonly string[]): {
  readonly indexes: ReadonlySet<number>;
  readonly unterminated: boolean;
} {
  const indexes = new Set<number>();
  let fenceLength: number | undefined;

  lines.forEach((line, index) => {
    if (fenceLength === undefined) {
      const opening = line.match(/^`{3,}/);

      if (opening !== null) {
        fenceLength = opening[0].length;
        indexes.add(index);
      }

      return;
    }

    indexes.add(index);

    if (new RegExp(`^\`{${fenceLength},}$`).test(line)) {
      fenceLength = undefined;
    }
  });

  return {
    indexes,
    unterminated: fenceLength !== undefined,
  };
}

function extractSections(
  prepared: PreparedSource,
  startLine: number,
  endLine: number,
): { readonly sections: ReadonlyMap<string, Section>; readonly duplicate?: string } {
  const sections = new Map<string, Section>();
  const headings: { readonly heading: string; readonly lineIndex: number }[] = [];

  for (let lineIndex = startLine + 1; lineIndex < endLine; lineIndex += 1) {
    const line = prepared.lines[lineIndex];

    if (line !== undefined && !prepared.fencedLineIndexes.has(lineIndex) && line.startsWith('## ')) {
      headings.push({ heading: line, lineIndex });
    }
  }

  let duplicate: string | undefined;
  const seen = new Set<string>();

  headings.forEach((heading) => {
    if (duplicate === undefined && seen.has(heading.heading)) {
      duplicate = heading.heading;
    }

    seen.add(heading.heading);
  });

  headings.forEach((heading, index) => {
    const nextHeading = headings[index + 1];
    const bodyStart = heading.lineIndex + 1;
    const bodyEnd = nextHeading?.lineIndex ?? endLine;
    const bodyLines = prepared.lines.slice(bodyStart, bodyEnd);

    if (!sections.has(heading.heading)) {
      sections.set(
        heading.heading,
        Object.freeze({
          heading: heading.heading,
          lineIndex: heading.lineIndex,
          bodyLines: Object.freeze(bodyLines),
        }),
      );
    }
  });

  return {
    sections,
    ...(duplicate === undefined ? {} : { duplicate }),
  };
}

function contentLines(entry: Entry, heading: string): readonly string[] {
  return Object.freeze(
    (entry.sections.get(heading)?.bodyLines ?? []).filter((line) => line !== '' && line !== '---'),
  );
}

function firstContentLine(entry: Entry, heading: string): string | undefined {
  return contentLines(entry, heading)[0];
}

function validateLifecycleStatus(
  status: string,
  declaringAuthority: string,
  subject: string,
): RatificationAuthoritySnapshotIssuanceResult | undefined {
  if (status === 'Effective' || status === 'Superseded' || status === 'Withdrawn') {
    return undefined;
  }

  return reject('unsupported-lifecycle-status', declarationPayload(declaringAuthority, subject));
}

function validateSegment(
  declaringAuthority: string,
  subject: string,
  segment: {
    readonly scopeKey: string;
    readonly scopeDescription?: string;
    readonly status: string;
    readonly relations: readonly RatificationAuthoritySnapshotLifecycleRelation[];
  },
  form: 'WholeRecordLifecycle' | 'SegmentedLifecycle',
): { readonly value: ParsedSegment; readonly result?: undefined } | { readonly result: RatificationAuthoritySnapshotIssuanceResult } {
  const status = segment.status as RatificationAuthoritySnapshotLifecycleStatus;
  const expectedRelationKind = status === 'Superseded' ? 'SupersededBy' : 'WithdrawnBy';
  const relationMatches =
    status === 'Effective'
      ? segment.relations.length === 0
      : segment.relations.length === 1 && segment.relations[0]?.relationKind === expectedRelationKind;

  if (!relationMatches) {
    return {
      result: reject('status-relation-mismatch', declarationScopePayload(declaringAuthority, subject, segment.scopeKey)),
    };
  }

  if (form === 'WholeRecordLifecycle') {
    return {
      value: Object.freeze({
        scopeKey: 'residual',
        status,
        relations: Object.freeze([...segment.relations]),
      }),
    };
  }

  return {
    value: Object.freeze({
      scopeKey: segment.scopeKey,
      ...(segment.scopeDescription === undefined ? {} : { scopeDescription: segment.scopeDescription }),
      status,
      relations: Object.freeze([...segment.relations]),
    }),
  };
}

function createGenericRecord(entry: ParsedEntry): RatificationAuthoritySnapshotRecord {
  return Object.freeze({
    lifecycleAuthorityKind: 'GenericSourceRule',
    ratificationIdentifier: entry.identifier,
    ratificationDate: entry.date,
    ratificationSubject: entry.subject,
    lifecycleResolutionForm: 'WholeRecordLifecycle',
    lifecycleSegments: Object.freeze([
      Object.freeze({
        scopeKind: 'ResidualScope',
        scopeKey: 'residual',
        lifecycleStatus: 'Effective',
        lifecycleRelations: Object.freeze([]),
      }),
    ]),
  });
}

function createDeclaredRecord(
  entry: ParsedEntry,
  declaration: ParsedDeclaration,
): RatificationAuthoritySnapshotGovernedDeclarationRecord {
  return Object.freeze({
    lifecycleAuthorityKind: 'GovernedDeclaration',
    ratificationIdentifier: entry.identifier,
    ratificationDate: entry.date,
    ratificationSubject: entry.subject,
    lifecycleResolutionForm: declaration.form,
    lifecycleDeclaringAuthority: declaration.declaringAuthority,
    lifecycleSegments: Object.freeze(
      declaration.segments.map((segment) => createLifecycleSegment(segment)),
    ),
  });
}

function createLifecycleSegment(
  segment: ParsedSegment,
): RatificationAuthoritySnapshotLifecycleSegment {
  if (segment.scopeKey === 'residual') {
    return Object.freeze({
      scopeKind: 'ResidualScope',
      scopeKey: 'residual',
      lifecycleStatus: segment.status,
      lifecycleRelations: Object.freeze([...segment.relations]),
    });
  }

  return Object.freeze({
    scopeKind: 'GovernedScope',
    scopeKey: segment.scopeKey,
    scopeDescription: segment.scopeDescription ?? '',
    lifecycleStatus: segment.status,
    lifecycleRelations: Object.freeze([...segment.relations]),
  });
}

function findCycle(edges: readonly { readonly from: string; readonly to: string }[]): readonly string[] | undefined {
  const outgoing = new Map<string, readonly string[]>();

  for (const edge of edges) {
    outgoing.set(edge.from, Object.freeze([...(outgoing.get(edge.from) ?? []), edge.to]));
  }

  const states = new Map<string, 'open' | 'closed'>();
  const stack: string[] = [];
  const roots = [...outgoing.keys()].sort();

  function visit(node: string): readonly string[] | undefined {
    const state = states.get(node);

    if (state === 'open') {
      const cycleStart = stack.indexOf(node);

      return Object.freeze([...stack.slice(cycleStart), node]);
    }

    if (state === 'closed') {
      return undefined;
    }

    states.set(node, 'open');
    stack.push(node);

    for (const target of outgoing.get(node) ?? []) {
      const cycle = visit(target);

      if (cycle !== undefined) {
        return cycle;
      }
    }

    stack.pop();
    states.set(node, 'closed');

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

function isValidCapturedAt(value: string): boolean {
  const match = value.match(capturedAtPattern);

  if (match === null) {
    return false;
  }

  const [, year, month, day, hour, minute, second] = match;

  if (
    year === undefined ||
    month === undefined ||
    day === undefined ||
    hour === undefined ||
    minute === undefined ||
    second === undefined
  ) {
    return false;
  }

  if (Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59) {
    return false;
  }

  return isRealDate(`${year}-${month}-${day}`);
}

function isRealDate(value: string): boolean {
  if (!datePattern.test(value)) {
    return false;
  }

  const [yearText, monthText, dayText] = value.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function reject(
  code: Parameters<typeof createRatificationAuthoritySnapshotRejectedResult>[0],
  payload: RatificationAuthoritySnapshotDiagnosticPayload,
): RatificationAuthoritySnapshotIssuanceResult {
  return createRatificationAuthoritySnapshotRejectedResult(code, payload);
}

function entryPayload(ratificationIdentifier: string): RatificationAuthoritySnapshotDiagnosticPayload {
  return Object.freeze({ payloadKind: 'EntryPayload', ratificationIdentifier });
}

function entrySectionPayload(
  ratificationIdentifier: string,
  sectionHeading: string,
): RatificationAuthoritySnapshotDiagnosticPayload {
  return Object.freeze({ payloadKind: 'EntrySectionPayload', ratificationIdentifier, sectionHeading });
}

function declarationPayload(
  declaringAuthority: string,
  declarationSubject: string,
): RatificationAuthoritySnapshotDiagnosticPayload {
  return Object.freeze({ payloadKind: 'DeclarationPayload', declaringAuthority, declarationSubject });
}

function declarationScopePayload(
  declaringAuthority: string,
  declarationSubject: string,
  scopeKey: string,
): RatificationAuthoritySnapshotDiagnosticPayload {
  return Object.freeze({
    payloadKind: 'DeclarationScopePayload',
    declaringAuthority,
    declarationSubject,
    scopeKey,
  });
}

function relationPathPayload(pathIdentifiers: readonly string[]): RatificationAuthoritySnapshotDiagnosticPayload {
  return Object.freeze({ payloadKind: 'RelationPathPayload', pathIdentifiers: Object.freeze([...pathIdentifiers]) });
}

function declaredInputPayload(declaredField: string): RatificationAuthoritySnapshotDiagnosticPayload {
  return Object.freeze({ payloadKind: 'DeclaredInputPayload', declaredField });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isProducingAttribution(value: unknown): value is RatificationAuthoritySnapshotProducingAttribution {
  return (
    isRecord(value) &&
    typeof value.producingImplementationIdentity === 'string' &&
    typeof value.producingImplementationRevision === 'string'
  );
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function firstDuplicate(values: readonly string[]): string | undefined {
  const seen = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      return value;
    }

    seen.add(value);
  }

  return undefined;
}

function freezeRecords(
  records: readonly RatificationAuthoritySnapshotRecord[],
): readonly RatificationAuthoritySnapshotRecord[] {
  return Object.freeze(
    records.map((record) => {
      if (record.lifecycleAuthorityKind === 'GenericSourceRule') {
        return Object.freeze({
          ...record,
          lifecycleSegments: Object.freeze(record.lifecycleSegments.map(freezeSegment)),
        });
      }

      return Object.freeze({
        ...record,
        lifecycleSegments: Object.freeze(record.lifecycleSegments.map(freezeSegment)),
      });
    }),
  );
}

function freezeSegment(
  segment: RatificationAuthoritySnapshotLifecycleSegment,
): RatificationAuthoritySnapshotLifecycleSegment {
  if (segment.scopeKind === 'GovernedScope') {
    return Object.freeze({
      ...segment,
      lifecycleRelations: Object.freeze(segment.lifecycleRelations.map((relation) => Object.freeze({ ...relation }))),
    });
  }

  return Object.freeze({
    ...segment,
    lifecycleRelations: Object.freeze(segment.lifecycleRelations.map((relation) => Object.freeze({ ...relation }))),
  });
}
