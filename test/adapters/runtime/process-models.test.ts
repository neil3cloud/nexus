import { describe, expect, it } from 'vitest';

import { InvalidProcessRequestError, InvalidProcessResultError } from '../../../src/adapters/runtime/local-process-runtime.errors';
import { ProcessDiagnostics } from '../../../src/adapters/runtime/process-diagnostics';
import { ProcessExecutionOptions } from '../../../src/adapters/runtime/process-execution-options';
import { ProcessExitStatus } from '../../../src/adapters/runtime/process-exit-status';
import { ProcessRequest } from '../../../src/adapters/runtime/process-request';
import { ProcessResult } from '../../../src/adapters/runtime/process-result';

describe('Local Process Runtime value objects', () => {
  it('creates immutable ProcessRequest snapshots with deterministic options', () => {
    const controller = new AbortController();
    const request = ProcessRequest.create({
      executable: 'node',
      arguments: ['-e', 'console.log("nexus")'],
      workingDirectory: 'C:\\Projects\\nexus',
      environment: {
        ZETA: 'last',
        ALPHA: 'first',
      },
      timeoutMs: 1000,
      cancellationSignal: controller.signal,
    });

    expect(Object.isFrozen(request)).toBe(true);
    expect(Object.isFrozen(request.arguments)).toBe(true);
    expect(Object.isFrozen(request.options.environment)).toBe(true);
    expect(request.options.cancellationSignal).toBe(controller.signal);
    expect(request.toSnapshot()).toEqual({
      executable: 'node',
      arguments: ['-e', 'console.log("nexus")'],
      options: {
        workingDirectory: 'C:\\Projects\\nexus',
        environment: {
          ALPHA: 'first',
          ZETA: 'last',
        },
        timeoutMs: 1000,
      },
    });
  });

  it('rejects invalid ProcessRequest definitions', () => {
    expect(() => ProcessRequest.create({ executable: ' ' })).toThrow(InvalidProcessRequestError);
    expect(() =>
      ProcessRequest.create({
        executable: 'node',
        timeoutMs: 0,
      }),
    ).toThrow(InvalidProcessRequestError);
    expect(() =>
      ProcessRequest.create({
        executable: 'node',
        timeoutMs: 100,
        options: ProcessExecutionOptions.create(),
      }),
    ).toThrow(InvalidProcessRequestError);
  });

  it('creates immutable ProcessResult snapshots with deterministic diagnostics', () => {
    const result = ProcessResult.create({
      exitStatus: ProcessExitStatus.failed({ exitCode: 7 }),
      standardOutput: 'out',
      standardError: 'err',
      durationMs: 12,
      terminationReason: 'Exited',
      diagnostics: ProcessDiagnostics.create([
        {
          code: 'process.non-zero-exit-code',
          message: 'Process exited with code 7.',
          attributes: {
            zeta: 'last',
            alpha: 'first',
          },
        },
      ]),
    });

    expect(Object.isFrozen(result)).toBe(true);
    expect(result.toSnapshot()).toEqual({
      exitStatus: {
        state: 'Failed',
        exitCode: 7,
      },
      standardOutput: 'out',
      standardError: 'err',
      durationMs: 12,
      terminationReason: 'Exited',
      diagnostics: [
        {
          code: 'process.non-zero-exit-code',
          message: 'Process exited with code 7.',
          attributes: {
            alpha: 'first',
            zeta: 'last',
          },
        },
      ],
    });
  });

  it('rejects invalid ProcessResult definitions', () => {
    expect(() =>
      ProcessExitStatus.create({
        state: 'Unknown',
      }),
    ).toThrow(InvalidProcessResultError);
    expect(() =>
      ProcessResult.create({
        exitStatus: ProcessExitStatus.completed(),
        durationMs: -1,
        terminationReason: 'Exited',
      }),
    ).toThrow(InvalidProcessResultError);
    expect(() =>
      ProcessResult.create({
        exitStatus: ProcessExitStatus.completed(),
        durationMs: 0,
        terminationReason: 'Retried',
      }),
    ).toThrow(InvalidProcessResultError);
  });
});
