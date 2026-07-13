import { InvalidProcessResultError } from './local-process-runtime.errors';

export type ProcessDiagnosticAttributes = Readonly<Record<string, string>>;

export interface ProcessDiagnosticInput {
  readonly code: string;
  readonly message: string;
  readonly attributes?: ProcessDiagnosticAttributes;
}

export interface ProcessDiagnostic {
  readonly code: string;
  readonly message: string;
  readonly attributes: ProcessDiagnosticAttributes;
}

export class ProcessDiagnostics {
  private constructor(private readonly diagnosticEntries: readonly ProcessDiagnostic[]) {
    Object.freeze(this);
  }

  public static create(diagnostics: readonly ProcessDiagnosticInput[] = []): ProcessDiagnostics {
    return new ProcessDiagnostics(
      Object.freeze(
        diagnostics.map((diagnostic) =>
          Object.freeze({
            code: normalizeNonEmptyString(diagnostic.code, 'ProcessDiagnostic code'),
            message: normalizeNonEmptyString(diagnostic.message, 'ProcessDiagnostic message'),
            attributes: copyAttributes(diagnostic.attributes ?? {}),
          }),
        ),
      ),
    );
  }

  public get entries(): readonly ProcessDiagnostic[] {
    return this.diagnosticEntries;
  }

  public toSnapshot(): readonly ProcessDiagnostic[] {
    return this.diagnosticEntries;
  }
}

function copyAttributes(attributes: ProcessDiagnosticAttributes): ProcessDiagnosticAttributes {
  const copied: Record<string, string> = {};

  for (const [key, value] of Object.entries(attributes).sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    copied[normalizeNonEmptyString(key, 'ProcessDiagnostic attribute key')] =
      normalizeNonEmptyString(value, `ProcessDiagnostic attribute '${key}'`);
  }

  return Object.freeze(copied);
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidProcessResultError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
