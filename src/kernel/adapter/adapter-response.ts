import { InvalidAdapterResponseError } from './adapter.errors';

export const adapterExecutionStatuses = ['Completed', 'Failed'] as const;

export type AdapterExecutionStatus = (typeof adapterExecutionStatuses)[number];
export type AdapterExecutionMetadata = Readonly<Record<string, string>>;

export interface AdapterDiagnosticInput {
  readonly code: string;
  readonly message: string;
}

export interface AdapterDiagnostic {
  readonly code: string;
  readonly message: string;
}

export interface AdapterResponseInput {
  readonly status: AdapterExecutionStatus | string;
  readonly diagnostics?: readonly AdapterDiagnosticInput[];
  readonly producedArtifacts?: readonly string[];
  readonly findings?: readonly string[];
  readonly executionMetadata?: AdapterExecutionMetadata;
}

export interface AdapterResponseSnapshot {
  readonly status: AdapterExecutionStatus;
  readonly diagnostics: readonly AdapterDiagnostic[];
  readonly producedArtifacts: readonly string[];
  readonly findings: readonly string[];
  readonly executionMetadata: AdapterExecutionMetadata;
}

export class AdapterResponse {
  private constructor(
    private readonly statusValue: AdapterExecutionStatus,
    private readonly diagnosticsValue: readonly AdapterDiagnostic[],
    private readonly producedArtifactsValue: readonly string[],
    private readonly findingsValue: readonly string[],
    private readonly executionMetadataValue: AdapterExecutionMetadata,
  ) {
    Object.freeze(this);
  }

  public static create(input: AdapterResponseInput): AdapterResponse {
    return new AdapterResponse(
      normalizeStatus(input.status),
      normalizeDiagnostics(input.diagnostics ?? []),
      normalizeStringList(input.producedArtifacts ?? [], 'Produced Artifact'),
      normalizeStringList(input.findings ?? [], 'Finding'),
      copyRecord(input.executionMetadata ?? {}, 'Execution Metadata'),
    );
  }

  public static fromSnapshot(snapshot: AdapterResponseSnapshot): AdapterResponse {
    return AdapterResponse.create(snapshot);
  }

  public get status(): AdapterExecutionStatus {
    return this.statusValue;
  }

  public get diagnostics(): readonly AdapterDiagnostic[] {
    return this.diagnosticsValue;
  }

  public get producedArtifacts(): readonly string[] {
    return this.producedArtifactsValue;
  }

  public get findings(): readonly string[] {
    return this.findingsValue;
  }

  public get executionMetadata(): AdapterExecutionMetadata {
    return this.executionMetadataValue;
  }

  public toSnapshot(): AdapterResponseSnapshot {
    return Object.freeze({
      status: this.statusValue,
      diagnostics: this.diagnosticsValue,
      producedArtifacts: this.producedArtifactsValue,
      findings: this.findingsValue,
      executionMetadata: this.executionMetadataValue,
    });
  }
}

function normalizeStatus(status: AdapterExecutionStatus | string): AdapterExecutionStatus {
  const normalized = status.trim();

  if (!isAdapterExecutionStatus(normalized)) {
    throw new InvalidAdapterResponseError(`AdapterResponse status '${normalized}' is not valid.`);
  }

  return normalized;
}

function normalizeDiagnostics(diagnostics: readonly AdapterDiagnosticInput[]): readonly AdapterDiagnostic[] {
  return Object.freeze(
    diagnostics.map((diagnostic) =>
      Object.freeze({
        code: normalizeNonEmptyString(diagnostic.code, 'Diagnostic code'),
        message: normalizeNonEmptyString(diagnostic.message, 'Diagnostic message'),
      }),
    ),
  );
}

function normalizeStringList(values: readonly string[], label: string): readonly string[] {
  return Object.freeze(values.map((value) => normalizeNonEmptyString(value, label)));
}

function copyRecord(record: Readonly<Record<string, string>>, label: string): Readonly<Record<string, string>> {
  const copied: Record<string, string> = {};

  for (const [key, value] of Object.entries(record)) {
    const normalizedKey = normalizeNonEmptyString(key, `${label} key`);
    copied[normalizedKey] = normalizeNonEmptyString(value, `${label} '${normalizedKey}'`);
  }

  return Object.freeze(copied);
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidAdapterResponseError(`${label} must be a non-empty string.`);
  }

  return normalized;
}

function isAdapterExecutionStatus(value: string): value is AdapterExecutionStatus {
  return adapterExecutionStatuses.some((status) => status === value);
}
