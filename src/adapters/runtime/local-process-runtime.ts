import { spawn } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';

import type { LocalProcessRuntimeContract } from './local-process-runtime.contract';
import { ProcessRequest } from './process-request';
import type { ProcessRequestInput } from './process-request';
import { ProcessResult } from './process-result';
import type { ProcessTerminationReason } from './process-result';
import { ProcessExitStatus } from './process-exit-status';
import type { ProcessDiagnosticInput } from './process-diagnostics';

interface SpawnedProcess {
  readonly stdout: NodeJS.ReadableStream | null;
  readonly stderr: NodeJS.ReadableStream | null;
  once(event: 'error', listener: (error: Error) => void): this;
  once(event: 'close', listener: (code: number | null, signal: NodeJS.Signals | null) => void): this;
  off(event: 'error', listener: (error: Error) => void): this;
  off(event: 'close', listener: (code: number | null, signal: NodeJS.Signals | null) => void): this;
  kill(signal?: NodeJS.Signals): boolean;
}

type ProcessFactory = (request: ProcessRequest) => SpawnedProcess;
type RuntimeClock = () => number;

export class LocalProcessRuntime implements LocalProcessRuntimeContract {
  public constructor(
    private readonly processFactory: ProcessFactory = spawnProcess,
    private readonly clock: RuntimeClock = () => Date.now(),
  ) {}

  public async execute(input: ProcessRequest | ProcessRequestInput): Promise<ProcessResult> {
    const request = input instanceof ProcessRequest ? input : ProcessRequest.create(input);
    const startedAt = this.clock();

    if (request.options.cancellationSignal?.aborted === true) {
      return createResult({
        request,
        startedAt,
        finishedAt: this.clock(),
        terminationReason: 'Cancelled',
        diagnostics: [
          {
            code: 'process.cancelled',
            message: 'Process execution was cancelled before launch.',
          },
        ],
      });
    }

    let process: SpawnedProcess;

    try {
      process = this.processFactory(request);
    } catch (error: unknown) {
      return createStartupFailureResult(request, startedAt, this.clock(), error);
    }

    return new Promise((resolve) => {
      const stdoutChunks: Buffer[] = [];
      const stderrChunks: Buffer[] = [];
      let settled = false;
      let timedOut = false;
      let cancelled = false;
      let timeout: NodeJS.Timeout | undefined;

      const finish = (result: ProcessResult): void => {
        if (settled) {
          return;
        }

        settled = true;
        if (timeout !== undefined) {
          clearTimeout(timeout);
        }
        request.options.cancellationSignal?.removeEventListener('abort', onAbort);
        process.off('error', onError);
        process.off('close', onClose);
        resolve(result);
      };

      const terminate = (): void => {
        process.kill('SIGTERM');
      };

      const onAbort = (): void => {
        cancelled = true;
        terminate();
      };

      const onError = (error: Error): void => {
        finish(createStartupFailureResult(request, startedAt, this.clock(), error));
      };

      const onClose = (code: number | null, signal: NodeJS.Signals | null): void => {
        const standardOutput = Buffer.concat(stdoutChunks).toString('utf8');
        const standardError = Buffer.concat(stderrChunks).toString('utf8');

        if (timedOut) {
          finish(
            createResult({
              request,
              startedAt,
              finishedAt: this.clock(),
              standardOutput,
              standardError,
              terminationReason: 'TimedOut',
              signal: signal ?? 'SIGTERM',
              diagnostics: [
                {
                  code: 'process.timed-out',
                  message: `Process '${request.executable}' exceeded timeout ${request.options.timeoutMs?.toString() ?? 'unknown'}ms.`,
                  attributes: { executable: request.executable },
                },
              ],
            }),
          );
          return;
        }

        if (cancelled) {
          finish(
            createResult({
              request,
              startedAt,
              finishedAt: this.clock(),
              standardOutput,
              standardError,
              terminationReason: 'Cancelled',
              signal: signal ?? 'SIGTERM',
              diagnostics: [
                {
                  code: 'process.cancelled',
                  message: `Process '${request.executable}' was cancelled.`,
                  attributes: { executable: request.executable },
                },
              ],
            }),
          );
          return;
        }

        finish(
          createExitResult({
            request,
            startedAt,
            finishedAt: this.clock(),
            standardOutput,
            standardError,
            exitCode: code,
            signal,
          }),
        );
      };

      process.stdout?.on('data', (chunk: Buffer | string) => {
        stdoutChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
      process.stderr?.on('data', (chunk: Buffer | string) => {
        stderrChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
      process.once('error', onError);
      process.once('close', onClose);

      if (request.options.timeoutMs !== undefined) {
        timeout = setTimeout(() => {
          timedOut = true;
          terminate();
        }, request.options.timeoutMs);
      }
      request.options.cancellationSignal?.addEventListener('abort', onAbort, { once: true });
    });
  }
}

interface CreateResultInput {
  readonly request: ProcessRequest;
  readonly startedAt: number;
  readonly finishedAt: number;
  readonly standardOutput?: string;
  readonly standardError?: string;
  readonly terminationReason: ProcessTerminationReason;
  readonly exitCode?: number;
  readonly signal?: string;
  readonly diagnostics: readonly ProcessDiagnosticInput[];
}

interface CreateExitResultInput {
  readonly request: ProcessRequest;
  readonly startedAt: number;
  readonly finishedAt: number;
  readonly standardOutput: string;
  readonly standardError: string;
  readonly exitCode: number | null;
  readonly signal: NodeJS.Signals | null;
}

function spawnProcess(request: ProcessRequest): SpawnedProcess {
  const childProcess: ChildProcess = spawn(request.executable, [...request.arguments], {
    ...(request.options.workingDirectory === undefined
      ? {}
      : { cwd: request.options.workingDirectory }),
    env: {
      ...process.env,
      ...request.options.environment,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });

  return childProcess as SpawnedProcess;
}

function createExitResult(input: CreateExitResultInput): ProcessResult {
  if (input.signal !== null) {
    return createResult({
      request: input.request,
      startedAt: input.startedAt,
      finishedAt: input.finishedAt,
      standardOutput: input.standardOutput,
      standardError: input.standardError,
      terminationReason: 'AbnormalTermination',
      signal: input.signal,
      diagnostics: [
        {
          code: 'process.abnormal-termination',
          message: `Process '${input.request.executable}' terminated with signal '${input.signal}'.`,
          attributes: {
            executable: input.request.executable,
            signal: input.signal,
          },
        },
      ],
    });
  }

  if (input.exitCode === 0) {
    return createResult({
      request: input.request,
      startedAt: input.startedAt,
      finishedAt: input.finishedAt,
      standardOutput: input.standardOutput,
      standardError: input.standardError,
      terminationReason: 'Exited',
      exitCode: 0,
      diagnostics: [
        {
          code: 'process.completed',
          message: `Process '${input.request.executable}' completed successfully.`,
          attributes: { executable: input.request.executable },
        },
      ],
    });
  }

  return createResult({
    request: input.request,
    startedAt: input.startedAt,
    finishedAt: input.finishedAt,
    standardOutput: input.standardOutput,
    standardError: input.standardError,
    terminationReason: 'Exited',
    exitCode: input.exitCode ?? 1,
    diagnostics: [
      {
        code: 'process.non-zero-exit-code',
        message: `Process '${input.request.executable}' exited with code '${(input.exitCode ?? 1).toString()}'.`,
        attributes: {
          executable: input.request.executable,
          exitCode: (input.exitCode ?? 1).toString(),
        },
      },
    ],
  });
}

function createStartupFailureResult(
  request: ProcessRequest,
  startedAt: number,
  finishedAt: number,
  error: unknown,
): ProcessResult {
  const executableNotFound = errorHasCode(error, 'ENOENT');
  const code = executableNotFound ? 'process.executable-not-found' : 'process.startup-failed';
  const terminationReason = executableNotFound ? 'ExecutableNotFound' : 'StartupFailed';
  const message = executableNotFound
    ? `Process executable '${request.executable}' was not found.`
    : `Process '${request.executable}' failed to start: ${errorMessage(error)}.`;

  return createResult({
    request,
    startedAt,
    finishedAt,
    terminationReason,
    diagnostics: [
      {
        code,
        message,
        attributes: { executable: request.executable },
      },
    ],
  });
}

function createResult(input: CreateResultInput): ProcessResult {
  return ProcessResult.create({
    exitStatus:
      input.terminationReason === 'Exited' && (input.exitCode ?? 0) === 0
        ? ProcessExitStatus.completed(input.exitCode ?? 0)
        : ProcessExitStatus.failed({
            ...(input.exitCode === undefined ? {} : { exitCode: input.exitCode }),
            ...(input.signal === undefined ? {} : { signal: input.signal }),
          }),
    standardOutput: input.standardOutput ?? '',
    standardError: input.standardError ?? '',
    durationMs: Math.max(0, Math.trunc(input.finishedAt - input.startedAt)),
    terminationReason: input.terminationReason,
    diagnostics: input.diagnostics,
  });
}

function errorHasCode(error: unknown, code: string): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === code;
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
