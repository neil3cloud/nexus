import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';

import { describe, expect, it } from 'vitest';

import { LocalProcessRuntime } from '../../../src/adapters/runtime/local-process-runtime';
import { ProcessRequest } from '../../../src/adapters/runtime/process-request';

describe('LocalProcessRuntime', () => {
  it('executes a deterministic local process and captures stdout and stderr', async () => {
    const runtime = new LocalProcessRuntime();
    const result = await runtime.execute({
      executable: process.execPath,
      arguments: [
        '-e',
        'process.stdout.write("sprint-21-out"); process.stderr.write("sprint-21-err");',
      ],
      environment: {
        NEXUS_SPRINT: '21',
      },
    });

    expect(result.toSnapshot()).toMatchObject({
      exitStatus: {
        state: 'Completed',
        exitCode: 0,
      },
      standardOutput: 'sprint-21-out',
      standardError: 'sprint-21-err',
      terminationReason: 'Exited',
      diagnostics: [
        {
          code: 'process.completed',
        },
      ],
    });
  });

  it('returns deterministic diagnostics for non-zero exit codes', async () => {
    const runtime = new LocalProcessRuntime();
    const result = await runtime.execute({
      executable: process.execPath,
      arguments: ['-e', 'process.stderr.write("failure"); process.exit(7);'],
    });

    expect(result.toSnapshot()).toMatchObject({
      exitStatus: {
        state: 'Failed',
        exitCode: 7,
      },
      standardError: 'failure',
      terminationReason: 'Exited',
      diagnostics: [
        {
          code: 'process.non-zero-exit-code',
          attributes: {
            exitCode: '7',
          },
        },
      ],
    });
  });

  it('returns deterministic diagnostics when an executable is not found', async () => {
    const runtime = new LocalProcessRuntime();
    const result = await runtime.execute({
      executable: 'nexus-sprint-21-missing-executable',
    });

    expect(result.toSnapshot()).toMatchObject({
      exitStatus: {
        state: 'Failed',
      },
      terminationReason: 'ExecutableNotFound',
      diagnostics: [
        {
          code: 'process.executable-not-found',
          attributes: {
            executable: 'nexus-sprint-21-missing-executable',
          },
        },
      ],
    });
  });

  it('returns deterministic diagnostics when process startup fails', async () => {
    const runtime = new LocalProcessRuntime(() => {
      const error = new Error('spawn rejected');
      Object.defineProperty(error, 'code', {
        value: 'EACCES',
      });
      throw error;
    });
    const result = await runtime.execute({
      executable: process.execPath,
    });

    expect(result.toSnapshot()).toMatchObject({
      exitStatus: {
        state: 'Failed',
      },
      terminationReason: 'StartupFailed',
      diagnostics: [
        {
          code: 'process.startup-failed',
        },
      ],
    });
  });

  it('terminates a process that exceeds its timeout', async () => {
    const fakeProcess = new FakeSpawnedProcess();
    const runtime = new LocalProcessRuntime(() => fakeProcess);
    const result = await runtime.execute({
      executable: process.execPath,
      arguments: ['-e', 'setInterval(() => undefined, 1000);'],
      timeoutMs: 1,
    });

    expect(fakeProcess.killCount).toBe(1);
    expect(result.toSnapshot()).toMatchObject({
      exitStatus: {
        state: 'Failed',
        signal: 'SIGTERM',
      },
      terminationReason: 'TimedOut',
      diagnostics: [
        {
          code: 'process.timed-out',
        },
      ],
    });
  });

  it('terminates a process when cancellation is requested', async () => {
    const controller = new AbortController();
    const fakeProcess = new FakeSpawnedProcess();
    const runtime = new LocalProcessRuntime(() => fakeProcess);
    const execution = runtime.execute({
      executable: process.execPath,
      cancellationSignal: controller.signal,
    });

    controller.abort();
    const result = await execution;

    expect(fakeProcess.killCount).toBe(1);
    expect(result.toSnapshot()).toMatchObject({
      exitStatus: {
        state: 'Failed',
        signal: 'SIGTERM',
      },
      terminationReason: 'Cancelled',
      diagnostics: [
        {
          code: 'process.cancelled',
        },
      ],
    });
  });

  it('returns deterministic diagnostics for abnormal termination', async () => {
    const fakeProcess = new FakeSpawnedProcess();
    const runtime = new LocalProcessRuntime(() => {
      setTimeout(() => {
        fakeProcess.emitClose(null, 'SIGTERM');
      }, 0);
      return fakeProcess;
    });
    const result = await runtime.execute(ProcessRequest.create({ executable: process.execPath }));

    expect(result.toSnapshot()).toMatchObject({
      exitStatus: {
        state: 'Failed',
        signal: 'SIGTERM',
      },
      terminationReason: 'AbnormalTermination',
      diagnostics: [
        {
          code: 'process.abnormal-termination',
        },
      ],
    });
  });
});

class FakeSpawnedProcess extends EventEmitter {
  public readonly stdout = new PassThrough();
  public readonly stderr = new PassThrough();
  public killCount = 0;

  public kill(): boolean {
    this.killCount += 1;
    setTimeout(() => {
      this.emitClose(null, 'SIGTERM');
    }, 0);
    return true;
  }

  public emitClose(code: number | null, signal: NodeJS.Signals | null): void {
    this.emit('close', code, signal);
  }
}
