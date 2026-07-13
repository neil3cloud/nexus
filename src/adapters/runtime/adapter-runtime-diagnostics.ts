import { InvalidAdapterRuntimeMetadataError } from './adapter-runtime-operational-metadata.errors';

export type AdapterRuntimeDiagnosticAttributes = Readonly<Record<string, string>>;

export interface AdapterRuntimeDiagnosticInput {
  readonly code: string;
  readonly message: string;
  readonly attribution: string;
  readonly attributes?: AdapterRuntimeDiagnosticAttributes;
}

export interface AdapterRuntimeDiagnostic {
  readonly code: string;
  readonly message: string;
  readonly attribution: string;
  readonly attributes: AdapterRuntimeDiagnosticAttributes;
}

export class AdapterRuntimeDiagnostics {
  private constructor(private readonly diagnosticEntries: readonly AdapterRuntimeDiagnostic[]) {
    Object.freeze(this);
  }

  public static create(
    diagnostics: readonly AdapterRuntimeDiagnosticInput[] = [],
  ): AdapterRuntimeDiagnostics {
    return new AdapterRuntimeDiagnostics(
      Object.freeze(
        diagnostics.map((diagnostic) =>
          Object.freeze({
            code: normalizeNonEmptyString(diagnostic.code, 'AdapterRuntimeDiagnostic code'),
            message: normalizeNonEmptyString(diagnostic.message, 'AdapterRuntimeDiagnostic message'),
            attribution: normalizeNonEmptyString(
              diagnostic.attribution,
              'AdapterRuntimeDiagnostic attribution',
            ),
            attributes: copyAttributes(diagnostic.attributes ?? {}),
          }),
        ),
      ),
    );
  }

  public get entries(): readonly AdapterRuntimeDiagnostic[] {
    return this.diagnosticEntries;
  }

  public toSnapshot(): readonly AdapterRuntimeDiagnostic[] {
    return this.diagnosticEntries;
  }
}

function copyAttributes(
  attributes: AdapterRuntimeDiagnosticAttributes,
): AdapterRuntimeDiagnosticAttributes {
  const copied: Record<string, string> = {};

  for (const [key, value] of Object.entries(attributes).sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    const normalizedKey = normalizeNonEmptyString(key, 'AdapterRuntimeDiagnostic attribute key');
    copied[normalizedKey] = normalizeNonEmptyString(
      value,
      `AdapterRuntimeDiagnostic attribute '${normalizedKey}'`,
    );
  }

  return Object.freeze(copied);
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidAdapterRuntimeMetadataError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
