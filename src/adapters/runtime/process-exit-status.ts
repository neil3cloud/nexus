import { InvalidProcessResultError } from './local-process-runtime.errors';

export const processExitStatusStates = ['Completed', 'Failed'] as const;

export type ProcessExitStatusState = (typeof processExitStatusStates)[number];

export interface ProcessExitStatusInput {
  readonly state: ProcessExitStatusState | string;
  readonly exitCode?: number;
  readonly signal?: string;
}

export interface ProcessExitStatusSnapshot {
  readonly state: ProcessExitStatusState;
  readonly exitCode?: number;
  readonly signal?: string;
}

export class ProcessExitStatus {
  private constructor(
    private readonly stateValue: ProcessExitStatusState,
    private readonly exitCodeValue: number | undefined,
    private readonly signalValue: string | undefined,
  ) {
    Object.freeze(this);
  }

  public static completed(exitCode = 0): ProcessExitStatus {
    return ProcessExitStatus.create({
      state: 'Completed',
      exitCode,
    });
  }

  public static failed(input: Omit<ProcessExitStatusInput, 'state'> = {}): ProcessExitStatus {
    return ProcessExitStatus.create({
      state: 'Failed',
      ...input,
    });
  }

  public static create(input: ProcessExitStatusInput): ProcessExitStatus {
    return new ProcessExitStatus(
      normalizeState(input.state),
      normalizeExitCode(input.exitCode),
      normalizeSignal(input.signal),
    );
  }

  public static fromSnapshot(snapshot: ProcessExitStatusSnapshot): ProcessExitStatus {
    return ProcessExitStatus.create(snapshot);
  }

  public get state(): ProcessExitStatusState {
    return this.stateValue;
  }

  public get exitCode(): number | undefined {
    return this.exitCodeValue;
  }

  public get signal(): string | undefined {
    return this.signalValue;
  }

  public get succeeded(): boolean {
    return this.stateValue === 'Completed';
  }

  public toSnapshot(): ProcessExitStatusSnapshot {
    return Object.freeze({
      state: this.stateValue,
      ...(this.exitCodeValue === undefined ? {} : { exitCode: this.exitCodeValue }),
      ...(this.signalValue === undefined ? {} : { signal: this.signalValue }),
    });
  }
}

function normalizeState(state: ProcessExitStatusState | string): ProcessExitStatusState {
  const normalized = state.trim();

  if (!processExitStatusStates.some((candidate) => candidate === normalized)) {
    throw new InvalidProcessResultError(`ProcessExitStatus state '${normalized}' is not valid.`);
  }

  return normalized as ProcessExitStatusState;
}

function normalizeExitCode(exitCode: number | undefined): number | undefined {
  if (exitCode === undefined) {
    return undefined;
  }

  if (!Number.isInteger(exitCode) || exitCode < 0) {
    throw new InvalidProcessResultError('ProcessExitStatus exitCode must be a non-negative integer.');
  }

  return exitCode;
}

function normalizeSignal(signal: string | undefined): string | undefined {
  if (signal === undefined) {
    return undefined;
  }

  const normalized = signal.trim();

  if (normalized.length === 0) {
    throw new InvalidProcessResultError('ProcessExitStatus signal must be a non-empty string.');
  }

  return normalized;
}
