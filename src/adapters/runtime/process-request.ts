import { InvalidProcessRequestError } from './local-process-runtime.errors';
import { ProcessExecutionOptions } from './process-execution-options';
import type { ProcessEnvironmentOverrides, ProcessExecutionOptionsInput } from './process-execution-options';

export interface ProcessRequestInput extends ProcessExecutionOptionsInput {
  readonly executable: string;
  readonly arguments?: readonly string[];
  readonly options?: ProcessExecutionOptions | ProcessExecutionOptionsInput;
}

export interface ProcessRequestSnapshot {
  readonly executable: string;
  readonly arguments: readonly string[];
  readonly options: ReturnType<ProcessExecutionOptions['toSnapshot']>;
}

export class ProcessRequest {
  private constructor(
    private readonly executableValue: string,
    private readonly argumentValues: readonly string[],
    private readonly optionsValue: ProcessExecutionOptions,
  ) {
    Object.freeze(this);
  }

  public static create(input: ProcessRequestInput): ProcessRequest {
    return new ProcessRequest(
      normalizeNonEmptyString(input.executable, 'Process executable'),
      normalizeArguments(input.arguments ?? []),
      normalizeOptions(input),
    );
  }

  public static fromSnapshot(snapshot: ProcessRequestSnapshot): ProcessRequest {
    return ProcessRequest.create({
      executable: snapshot.executable,
      arguments: snapshot.arguments,
      options: ProcessExecutionOptions.fromSnapshot(snapshot.options),
    });
  }

  public get executable(): string {
    return this.executableValue;
  }

  public get arguments(): readonly string[] {
    return this.argumentValues;
  }

  public get options(): ProcessExecutionOptions {
    return this.optionsValue;
  }

  public toSnapshot(): ProcessRequestSnapshot {
    return Object.freeze({
      executable: this.executableValue,
      arguments: this.argumentValues,
      options: this.optionsValue.toSnapshot(),
    });
  }
}

function normalizeArguments(processArguments: readonly string[]): readonly string[] {
  return Object.freeze([...processArguments]);
}

function normalizeOptions(input: ProcessRequestInput): ProcessExecutionOptions {
  if (input.options !== undefined && hasInlineOptions(input)) {
    throw new InvalidProcessRequestError(
      'ProcessRequest options must be provided either inline or through options, not both.',
    );
  }

  if (input.options instanceof ProcessExecutionOptions) {
    return input.options;
  }

  if (input.options !== undefined) {
    return ProcessExecutionOptions.create(input.options);
  }

  return ProcessExecutionOptions.create({
    ...(input.workingDirectory === undefined ? {} : { workingDirectory: input.workingDirectory }),
    ...(input.environment === undefined
      ? {}
      : { environment: input.environment as ProcessEnvironmentOverrides }),
    ...(input.timeoutMs === undefined ? {} : { timeoutMs: input.timeoutMs }),
    ...(input.cancellationSignal === undefined
      ? {}
      : { cancellationSignal: input.cancellationSignal }),
  });
}

function hasInlineOptions(input: ProcessRequestInput): boolean {
  return (
    input.workingDirectory !== undefined ||
    input.environment !== undefined ||
    input.timeoutMs !== undefined ||
    input.cancellationSignal !== undefined
  );
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidProcessRequestError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
