import { InvalidProcessResultError } from './local-process-runtime.errors';
import { ProcessDiagnostics } from './process-diagnostics';
import type { ProcessDiagnosticInput, ProcessDiagnostic } from './process-diagnostics';
import { ProcessExitStatus } from './process-exit-status';
import type { ProcessExitStatusSnapshot } from './process-exit-status';

export const processTerminationReasons = [
  'Exited',
  'ExecutableNotFound',
  'StartupFailed',
  'TimedOut',
  'Cancelled',
  'AbnormalTermination',
] as const;

export type ProcessTerminationReason = (typeof processTerminationReasons)[number];

export interface ProcessResultInput {
  readonly exitStatus: ProcessExitStatus | ProcessExitStatusSnapshot;
  readonly standardOutput?: string;
  readonly standardError?: string;
  readonly durationMs: number;
  readonly terminationReason: ProcessTerminationReason | string;
  readonly diagnostics?: ProcessDiagnostics | readonly ProcessDiagnosticInput[];
}

export interface ProcessResultSnapshot {
  readonly exitStatus: ProcessExitStatusSnapshot;
  readonly standardOutput: string;
  readonly standardError: string;
  readonly durationMs: number;
  readonly terminationReason: ProcessTerminationReason;
  readonly diagnostics: readonly ProcessDiagnostic[];
}

export class ProcessResult {
  private constructor(
    private readonly exitStatusValue: ProcessExitStatus,
    private readonly standardOutputValue: string,
    private readonly standardErrorValue: string,
    private readonly durationMsValue: number,
    private readonly terminationReasonValue: ProcessTerminationReason,
    private readonly diagnosticsValue: ProcessDiagnostics,
  ) {
    Object.freeze(this);
  }

  public static create(input: ProcessResultInput): ProcessResult {
    return new ProcessResult(
      normalizeExitStatus(input.exitStatus),
      input.standardOutput ?? '',
      input.standardError ?? '',
      normalizeDuration(input.durationMs),
      normalizeTerminationReason(input.terminationReason),
      normalizeDiagnostics(input.diagnostics),
    );
  }

  public static fromSnapshot(snapshot: ProcessResultSnapshot): ProcessResult {
    return ProcessResult.create(snapshot);
  }

  public get exitStatus(): ProcessExitStatus {
    return this.exitStatusValue;
  }

  public get standardOutput(): string {
    return this.standardOutputValue;
  }

  public get standardError(): string {
    return this.standardErrorValue;
  }

  public get durationMs(): number {
    return this.durationMsValue;
  }

  public get terminationReason(): ProcessTerminationReason {
    return this.terminationReasonValue;
  }

  public get diagnostics(): ProcessDiagnostics {
    return this.diagnosticsValue;
  }

  public toSnapshot(): ProcessResultSnapshot {
    return Object.freeze({
      exitStatus: this.exitStatusValue.toSnapshot(),
      standardOutput: this.standardOutputValue,
      standardError: this.standardErrorValue,
      durationMs: this.durationMsValue,
      terminationReason: this.terminationReasonValue,
      diagnostics: this.diagnosticsValue.toSnapshot(),
    });
  }
}

function normalizeExitStatus(
  exitStatus: ProcessExitStatus | ProcessExitStatusSnapshot,
): ProcessExitStatus {
  return exitStatus instanceof ProcessExitStatus
    ? exitStatus
    : ProcessExitStatus.fromSnapshot(exitStatus);
}

function normalizeDiagnostics(
  diagnostics: ProcessDiagnostics | readonly ProcessDiagnosticInput[] | undefined,
): ProcessDiagnostics {
  if (diagnostics instanceof ProcessDiagnostics) {
    return diagnostics;
  }

  return ProcessDiagnostics.create(diagnostics ?? []);
}

function normalizeDuration(durationMs: number): number {
  if (!Number.isInteger(durationMs) || durationMs < 0) {
    throw new InvalidProcessResultError('ProcessResult durationMs must be a non-negative integer.');
  }

  return durationMs;
}

function normalizeTerminationReason(
  terminationReason: ProcessTerminationReason | string,
): ProcessTerminationReason {
  const normalized = terminationReason.trim();

  if (!processTerminationReasons.some((reason) => reason === normalized)) {
    throw new InvalidProcessResultError(
      `ProcessResult terminationReason '${normalized}' is not valid.`,
    );
  }

  return normalized as ProcessTerminationReason;
}
