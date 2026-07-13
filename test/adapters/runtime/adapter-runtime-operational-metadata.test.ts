import { describe, expect, it } from 'vitest';

import { AdapterConfiguration } from '../../../src/adapters/runtime/adapter-configuration';
import { AdapterExecutableDiscovery } from '../../../src/adapters/runtime/adapter-executable-discovery';
import { AdapterHealthStatus } from '../../../src/adapters/runtime/adapter-health-status';
import { AdapterInstallationStatus } from '../../../src/adapters/runtime/adapter-installation-status';
import { InvalidAdapterRuntimeMetadataError } from '../../../src/adapters/runtime/adapter-runtime-operational-metadata.errors';
import { AdapterRuntimeDiagnostics } from '../../../src/adapters/runtime/adapter-runtime-diagnostics';
import type { LocalProcessRuntimeContract } from '../../../src/adapters/runtime/local-process-runtime.contract';
import { ProcessExitStatus } from '../../../src/adapters/runtime/process-exit-status';
import { ProcessRequest } from '../../../src/adapters/runtime/process-request';
import { ProcessResult } from '../../../src/adapters/runtime/process-result';

describe('Adapter runtime operational metadata', () => {
  it('creates immutable installation and health status snapshots with diagnostics', () => {
    const diagnostics = AdapterRuntimeDiagnostics.create([
      {
        code: 'adapter-runtime.unsupported-version',
        message: 'Unsupported version.',
        attribution: 'adapter-1',
        attributes: {
          zeta: 'last',
          alpha: 'first',
        },
      },
    ]);
    const installation = AdapterInstallationStatus.create({
      state: ' UnsupportedVersion ',
      executablePath: ' C:\\Tools\\adapter.exe ',
      version: ' 0.9.0 ',
      diagnostics,
    });
    const health = AdapterHealthStatus.create({
      state: ' Misconfigured ',
      checkedAt: ' 2026-07-13T00:00:00.000Z ',
      diagnostics: diagnostics.toSnapshot(),
    });

    expect(installation.toSnapshot()).toEqual({
      state: 'UnsupportedVersion',
      executablePath: 'C:\\Tools\\adapter.exe',
      version: '0.9.0',
      diagnostics: [
        {
          code: 'adapter-runtime.unsupported-version',
          message: 'Unsupported version.',
          attribution: 'adapter-1',
          attributes: {
            alpha: 'first',
            zeta: 'last',
          },
        },
      ],
    });
    expect(health.toSnapshot()).toEqual({
      state: 'Misconfigured',
      checkedAt: '2026-07-13T00:00:00.000Z',
      diagnostics: diagnostics.toSnapshot(),
    });
    expect(Object.isFrozen(installation)).toBe(true);
    expect(Object.isFrozen(installation.diagnostics.entries)).toBe(true);
    const diagnostic = installation.diagnostics.entries[0];
    expect(diagnostic).toBeDefined();
    expect(Object.isFrozen(diagnostic)).toBe(true);
    expect(Object.isFrozen(diagnostic?.attributes)).toBe(true);
    expect(Object.isFrozen(health)).toBe(true);
  });

  it('creates configuration metadata without accepting secret-bearing settings', () => {
    const configuration = AdapterConfiguration.create({
      adapterId: ' adapter-1 ',
      executablePath: ' C:\\Tools\\adapter.exe ',
      workingDirectory: ' C:\\Projects\\nexus ',
      environment: {
        ZETA_PATH: 'last',
        ALPHA_PATH: 'first',
      },
      settings: {
        mode: 'metadata-only',
      },
    });

    expect(configuration.toSnapshot()).toEqual({
      adapterId: 'adapter-1',
      executablePath: 'C:\\Tools\\adapter.exe',
      workingDirectory: 'C:\\Projects\\nexus',
      environment: {
        ALPHA_PATH: 'first',
        ZETA_PATH: 'last',
      },
      settings: {
        mode: 'metadata-only',
      },
    });
    expect(Object.isFrozen(configuration)).toBe(true);
    expect(Object.isFrozen(configuration.environment)).toBe(true);
    expect(Object.isFrozen(configuration.settings)).toBe(true);
    expect(() =>
      AdapterConfiguration.create({
        adapterId: 'adapter-1',
        settings: {
          authToken: 'redacted',
        },
      }),
    ).toThrow(InvalidAdapterRuntimeMetadataError);
  });

  it('rejects invalid operational metadata deterministically', () => {
    expect(() => AdapterInstallationStatus.create({ state: 'Ready' })).toThrow(
      InvalidAdapterRuntimeMetadataError,
    );
    expect(() =>
      AdapterHealthStatus.create({
        state: 'Ready',
        checkedAt: ' ',
      }),
    ).toThrow(InvalidAdapterRuntimeMetadataError);
    expect(() =>
      AdapterRuntimeDiagnostics.create([
        {
          code: 'adapter-runtime.invalid',
          message: 'Invalid.',
          attribution: ' ',
        },
      ]),
    ).toThrow(InvalidAdapterRuntimeMetadataError);
  });
});

describe('AdapterExecutableDiscovery', () => {
  it('reports discovered, missing, unsupported, and invalid executable states', async () => {
    const runtime = new StubRuntime([
      ProcessResult.create({
        exitStatus: ProcessExitStatus.completed(),
        standardOutput: 'adapter version 1.2.3',
        durationMs: 1,
        terminationReason: 'Exited',
      }),
      ProcessResult.create({
        exitStatus: ProcessExitStatus.failed({ signal: 'ENOENT' }),
        durationMs: 1,
        terminationReason: 'ExecutableNotFound',
      }),
      ProcessResult.create({
        exitStatus: ProcessExitStatus.completed(),
        standardOutput: 'adapter version 0.1.0',
        durationMs: 1,
        terminationReason: 'Exited',
      }),
      ProcessResult.create({
        exitStatus: ProcessExitStatus.failed({ exitCode: 2 }),
        standardError: 'invalid',
        durationMs: 1,
        terminationReason: 'Exited',
      }),
    ]);
    const discovery = new AdapterExecutableDiscovery(runtime);

    await expect(
      discovery.detect({
        adapterId: 'adapter-1',
        executable: 'adapter',
        supportedVersionPattern: /1\.2\.3/,
      }),
    ).resolves.toMatchObject({ state: 'Discovered' });
    await expect(
      discovery.detect({
        adapterId: 'adapter-1',
        executable: 'missing-adapter',
      }),
    ).resolves.toMatchObject({ state: 'Missing' });
    await expect(
      discovery.detect({
        adapterId: 'adapter-1',
        executable: 'adapter',
        supportedVersionPattern: /1\.2\.3/,
      }),
    ).resolves.toMatchObject({ state: 'UnsupportedVersion' });
    await expect(
      discovery.detect({
        adapterId: 'adapter-1',
        executable: 'adapter',
      }),
    ).resolves.toMatchObject({ state: 'InvalidInstallation' });

    expect(runtime.requests.map((request) => request.toSnapshot())).toEqual([
      {
        executable: 'adapter',
        arguments: ['--version'],
        options: { environment: {}, timeoutMs: 1000 },
      },
      {
        executable: 'missing-adapter',
        arguments: ['--version'],
        options: { environment: {}, timeoutMs: 1000 },
      },
      {
        executable: 'adapter',
        arguments: ['--version'],
        options: { environment: {}, timeoutMs: 1000 },
      },
      {
        executable: 'adapter',
        arguments: ['--version'],
        options: { environment: {}, timeoutMs: 1000 },
      },
    ]);
  });
});

class StubRuntime implements LocalProcessRuntimeContract {
  public readonly requests: ProcessRequest[] = [];

  public constructor(private readonly results: ProcessResult[]) {}

  public async execute(request: ProcessRequest): Promise<ProcessResult> {
    this.requests.push(request);
    const result = this.results.shift();

    if (result === undefined) {
      throw new Error('No stubbed process result.');
    }

    return result;
  }
}
