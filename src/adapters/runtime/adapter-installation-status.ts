import { InvalidAdapterRuntimeMetadataError } from './adapter-runtime-operational-metadata.errors';
import { AdapterRuntimeDiagnostics } from './adapter-runtime-diagnostics';
import type {
  AdapterRuntimeDiagnostic,
  AdapterRuntimeDiagnosticInput,
} from './adapter-runtime-diagnostics';

export const adapterInstallationStatusStates = [
  'Discovered',
  'Missing',
  'UnsupportedVersion',
  'InvalidInstallation',
] as const;

export type AdapterInstallationStatusState = (typeof adapterInstallationStatusStates)[number];

export interface AdapterInstallationStatusInput {
  readonly state: AdapterInstallationStatusState | string;
  readonly executablePath?: string;
  readonly version?: string;
  readonly diagnostics?: AdapterRuntimeDiagnostics | readonly AdapterRuntimeDiagnosticInput[];
}

export interface AdapterInstallationStatusSnapshot {
  readonly state: AdapterInstallationStatusState;
  readonly executablePath?: string;
  readonly version?: string;
  readonly diagnostics: readonly AdapterRuntimeDiagnostic[];
}

export class AdapterInstallationStatus {
  private constructor(
    private readonly stateValue: AdapterInstallationStatusState,
    private readonly executablePathValue: string | undefined,
    private readonly versionValue: string | undefined,
    private readonly diagnosticsValue: AdapterRuntimeDiagnostics,
  ) {
    Object.freeze(this);
  }

  public static create(input: AdapterInstallationStatusInput): AdapterInstallationStatus {
    return new AdapterInstallationStatus(
      normalizeState(input.state),
      normalizeOptionalNonEmptyString(input.executablePath, 'Adapter executablePath'),
      normalizeOptionalNonEmptyString(input.version, 'Adapter version'),
      normalizeDiagnostics(input.diagnostics),
    );
  }

  public static fromSnapshot(
    snapshot: AdapterInstallationStatusSnapshot,
  ): AdapterInstallationStatus {
    return AdapterInstallationStatus.create(snapshot);
  }

  public get state(): AdapterInstallationStatusState {
    return this.stateValue;
  }

  public get executablePath(): string | undefined {
    return this.executablePathValue;
  }

  public get version(): string | undefined {
    return this.versionValue;
  }

  public get diagnostics(): AdapterRuntimeDiagnostics {
    return this.diagnosticsValue;
  }

  public toSnapshot(): AdapterInstallationStatusSnapshot {
    return Object.freeze({
      state: this.stateValue,
      ...(this.executablePathValue === undefined
        ? {}
        : { executablePath: this.executablePathValue }),
      ...(this.versionValue === undefined ? {} : { version: this.versionValue }),
      diagnostics: this.diagnosticsValue.toSnapshot(),
    });
  }
}

function normalizeState(
  state: AdapterInstallationStatusState | string,
): AdapterInstallationStatusState {
  const normalized = state.trim();

  if (!adapterInstallationStatusStates.some((candidate) => candidate === normalized)) {
    throw new InvalidAdapterRuntimeMetadataError(
      `AdapterInstallationStatus state '${normalized}' is not valid.`,
    );
  }

  return normalized as AdapterInstallationStatusState;
}

function normalizeDiagnostics(
  diagnostics: AdapterRuntimeDiagnostics | readonly AdapterRuntimeDiagnosticInput[] | undefined,
): AdapterRuntimeDiagnostics {
  if (diagnostics instanceof AdapterRuntimeDiagnostics) {
    return diagnostics;
  }

  return AdapterRuntimeDiagnostics.create(diagnostics ?? []);
}

function normalizeOptionalNonEmptyString(value: string | undefined, label: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidAdapterRuntimeMetadataError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
