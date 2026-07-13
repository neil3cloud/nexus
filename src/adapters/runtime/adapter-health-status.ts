import { InvalidAdapterRuntimeMetadataError } from './adapter-runtime-operational-metadata.errors';
import { AdapterRuntimeDiagnostics } from './adapter-runtime-diagnostics';
import type {
  AdapterRuntimeDiagnostic,
  AdapterRuntimeDiagnosticInput,
} from './adapter-runtime-diagnostics';

export const adapterHealthStatusStates = ['Ready', 'Missing', 'Unsupported', 'Misconfigured'] as const;

export type AdapterHealthStatusState = (typeof adapterHealthStatusStates)[number];

export interface AdapterHealthStatusInput {
  readonly state: AdapterHealthStatusState | string;
  readonly checkedAt: string;
  readonly diagnostics?: AdapterRuntimeDiagnostics | readonly AdapterRuntimeDiagnosticInput[];
}

export interface AdapterHealthStatusSnapshot {
  readonly state: AdapterHealthStatusState;
  readonly checkedAt: string;
  readonly diagnostics: readonly AdapterRuntimeDiagnostic[];
}

export class AdapterHealthStatus {
  private constructor(
    private readonly stateValue: AdapterHealthStatusState,
    private readonly checkedAtValue: string,
    private readonly diagnosticsValue: AdapterRuntimeDiagnostics,
  ) {
    Object.freeze(this);
  }

  public static create(input: AdapterHealthStatusInput): AdapterHealthStatus {
    return new AdapterHealthStatus(
      normalizeState(input.state),
      normalizeNonEmptyString(input.checkedAt, 'AdapterHealthStatus checkedAt'),
      normalizeDiagnostics(input.diagnostics),
    );
  }

  public static fromSnapshot(snapshot: AdapterHealthStatusSnapshot): AdapterHealthStatus {
    return AdapterHealthStatus.create(snapshot);
  }

  public get state(): AdapterHealthStatusState {
    return this.stateValue;
  }

  public get checkedAt(): string {
    return this.checkedAtValue;
  }

  public get diagnostics(): AdapterRuntimeDiagnostics {
    return this.diagnosticsValue;
  }

  public toSnapshot(): AdapterHealthStatusSnapshot {
    return Object.freeze({
      state: this.stateValue,
      checkedAt: this.checkedAtValue,
      diagnostics: this.diagnosticsValue.toSnapshot(),
    });
  }
}

function normalizeState(state: AdapterHealthStatusState | string): AdapterHealthStatusState {
  const normalized = state.trim();

  if (!adapterHealthStatusStates.some((candidate) => candidate === normalized)) {
    throw new InvalidAdapterRuntimeMetadataError(
      `AdapterHealthStatus state '${normalized}' is not valid.`,
    );
  }

  return normalized as AdapterHealthStatusState;
}

function normalizeDiagnostics(
  diagnostics: AdapterRuntimeDiagnostics | readonly AdapterRuntimeDiagnosticInput[] | undefined,
): AdapterRuntimeDiagnostics {
  if (diagnostics instanceof AdapterRuntimeDiagnostics) {
    return diagnostics;
  }

  return AdapterRuntimeDiagnostics.create(diagnostics ?? []);
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidAdapterRuntimeMetadataError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
