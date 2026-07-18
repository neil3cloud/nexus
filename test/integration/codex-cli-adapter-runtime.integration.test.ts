import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { CodexCliAdapter, CODEX_CLI_ADAPTER_ID } from '../../src/adapters/codex/codex-cli-adapter';
import { GeminiCliAdapter, GEMINI_CLI_ADAPTER_ID } from '../../src/adapters/gemini/gemini-cli-adapter';
import { MockAdapter, MOCK_ADAPTER_ID } from '../../src/adapters/mock/mock-adapter';
import { LocalProcessRuntime } from '../../src/adapters/runtime/local-process-runtime';
import { AdapterRequest } from '../../src/kernel/adapter/adapter-request';
import { AdapterService } from '../../src/kernel/adapter/adapter.service';
import type { IKernelService } from '../../src/kernel/common/kernel-service';
import type { KernelLogger } from '../../src/kernel/common/kernel-logger';
import { createKernelServices } from '../../src/kernel/common/create-kernel-services';
import { Kernel } from '../../src/kernel/kernel';

const codexTestDoublePath = join(
  process.cwd(),
  'test',
  'adapters',
  'codex',
  'codex-cli-test-double.cjs',
);
const geminiTestDoublePath = join(
  process.cwd(),
  'test',
  'adapters',
  'gemini',
  'gemini-cli-test-double.cjs',
);

class TestLogger implements KernelLogger {
  public info(): void {}

  public error(): void {}
}

describe('Codex CLI Adapter runtime integration', () => {
  it('registers beside MockAdapter and GeminiCliAdapter and dispatches only through explicit AdapterService adapterId', async () => {
    let services: readonly IKernelService[] = [];
    const kernel = new Kernel((eventBus) => {
      services = createKernelServices(eventBus, {
        adapters: [
          new MockAdapter(),
          new GeminiCliAdapter(new LocalProcessRuntime(), {
            executable: process.execPath,
            baseArguments: [geminiTestDoublePath],
            timeoutMs: 5000,
          }),
          new CodexCliAdapter(new LocalProcessRuntime(), {
            executable: process.execPath,
            baseArguments: [codexTestDoublePath],
            timeoutMs: 5000,
          }),
        ],
      });

      return services;
    }, new TestLogger());

    await kernel.initialize();

    const adapterService = requireService(
      services,
      'AdapterService',
      (service): service is AdapterService => service instanceof AdapterService,
    );
    const adapters = await adapterService.enumerateAdapters();

    expect(adapters.map((adapter) => adapter.id.toString())).toEqual([
      CODEX_CLI_ADAPTER_ID,
      GEMINI_CLI_ADAPTER_ID,
      MOCK_ADAPTER_ID,
    ]);

    const response = await adapterService.dispatch({
      adapterId: CODEX_CLI_ADAPTER_ID,
      requiredCapability: 'CodeModification',
      request: AdapterRequest.create({
        engineeringRole: 'Builder',
        taskId: 'task-codex-runtime-integration',
        contextPackageReference: 'context-package-codex-runtime-integration',
      }),
    });

    expect(response.toSnapshot()).toMatchObject({
      status: 'Completed',
      producedArtifacts: ['codex-test-double:Builder:task-codex-runtime-integration'],
      executionMetadata: {
        adapterId: CODEX_CLI_ADAPTER_ID,
        provider: 'codex-cli',
        processTerminationReason: 'Exited',
      },
    });

    kernel.dispose();
  });
});

function requireService<T extends IKernelService>(
  services: readonly IKernelService[],
  serviceName: string,
  predicate: (service: IKernelService) => service is T,
): T {
  const service = services.find(predicate);

  if (service === undefined) {
    throw new Error(`Expected ${serviceName} to be composed by createKernelServices.`);
  }

  return service;
}
