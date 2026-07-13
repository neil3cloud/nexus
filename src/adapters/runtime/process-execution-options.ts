import { InvalidProcessRequestError } from './local-process-runtime.errors';

export type ProcessEnvironmentOverrides = Readonly<Record<string, string>>;

export interface ProcessExecutionOptionsInput {
  readonly workingDirectory?: string;
  readonly environment?: ProcessEnvironmentOverrides;
  readonly timeoutMs?: number;
  readonly cancellationSignal?: AbortSignal;
}

export interface ProcessExecutionOptionsSnapshot {
  readonly workingDirectory?: string;
  readonly environment: ProcessEnvironmentOverrides;
  readonly timeoutMs?: number;
}

export class ProcessExecutionOptions {
  private constructor(
    private readonly workingDirectoryValue: string | undefined,
    private readonly environmentValue: ProcessEnvironmentOverrides,
    private readonly timeoutMsValue: number | undefined,
    private readonly cancellationSignalValue: AbortSignal | undefined,
  ) {
    Object.freeze(this);
  }

  public static create(input: ProcessExecutionOptionsInput = {}): ProcessExecutionOptions {
    return new ProcessExecutionOptions(
      normalizeOptionalNonEmptyString(input.workingDirectory, 'Process workingDirectory'),
      copyEnvironment(input.environment ?? {}),
      normalizeTimeout(input.timeoutMs),
      input.cancellationSignal,
    );
  }

  public static fromSnapshot(snapshot: ProcessExecutionOptionsSnapshot): ProcessExecutionOptions {
    return ProcessExecutionOptions.create(snapshot);
  }

  public get workingDirectory(): string | undefined {
    return this.workingDirectoryValue;
  }

  public get environment(): ProcessEnvironmentOverrides {
    return this.environmentValue;
  }

  public get timeoutMs(): number | undefined {
    return this.timeoutMsValue;
  }

  public get cancellationSignal(): AbortSignal | undefined {
    return this.cancellationSignalValue;
  }

  public toSnapshot(): ProcessExecutionOptionsSnapshot {
    return Object.freeze({
      ...(this.workingDirectoryValue === undefined
        ? {}
        : { workingDirectory: this.workingDirectoryValue }),
      environment: this.environmentValue,
      ...(this.timeoutMsValue === undefined ? {} : { timeoutMs: this.timeoutMsValue }),
    });
  }
}

function copyEnvironment(environment: ProcessEnvironmentOverrides): ProcessEnvironmentOverrides {
  const copied: Record<string, string> = {};

  for (const [key, value] of Object.entries(environment).sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    const normalizedKey = normalizeNonEmptyString(key, 'Process environment key');
    copied[normalizedKey] = value;
  }

  return Object.freeze(copied);
}

function normalizeTimeout(timeoutMs: number | undefined): number | undefined {
  if (timeoutMs === undefined) {
    return undefined;
  }

  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new InvalidProcessRequestError('Process timeoutMs must be a positive integer.');
  }

  return timeoutMs;
}

function normalizeOptionalNonEmptyString(value: string | undefined, label: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return normalizeNonEmptyString(value, label);
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidProcessRequestError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
