import { describe, expect, it } from 'vitest';

import { AdapterHealthStatus } from '../../src/adapters/runtime/adapter-health-status';
import { AdapterInstallationStatus } from '../../src/adapters/runtime/adapter-installation-status';
import { AdapterRuntimeDiagnostics } from '../../src/adapters/runtime/adapter-runtime-diagnostics';
import { createMockAdapter, MOCK_ADAPTER_ID } from '../../src/adapters/mock/mock-adapter';
import { createKernelServices } from '../../src/kernel/common/create-kernel-services';
import type { EventBusContract } from '../../src/kernel/common/event-bus-contract';
import type { IKernelService } from '../../src/kernel/common/kernel-service';
import type { KernelLogger } from '../../src/kernel/common/kernel-logger';
import { AdapterService } from '../../src/kernel/adapter/adapter.service';
import { Kernel } from '../../src/kernel/kernel';
import type { HostPresentationSurface, HostProgressOptions } from '../../src/hosts/vscode/host.contract';
import { HostIngressLayer } from '../../src/hosts/vscode/host-ingress';
import { StaticHostAdapterOperationalMetadataProvider } from '../../src/hosts/vscode/host-operational-metadata';

describe('Sprint 23 Host Ingress Foundation', () => {
  it('executes the Host to Kernel to AdapterService to MockAdapter path', async () => {
    let services: readonly IKernelService[] = [];
    const kernel = new Kernel((eventBus: EventBusContract) => {
      services = createKernelServices(eventBus, { adapters: [createMockAdapter()] });

      return services;
    }, new NullLogger());
    const adapterService = resolveAdapterService(services);
    const ingress = new HostIngressLayer(
      adapterService,
      createOperationalMetadataProvider(),
      new RecordingPresentationSurface(),
    );

    await kernel.initialize();

    await expect(ingress.discoverAdapters()).resolves.toMatchObject([
      {
        adapter: {
          id: MOCK_ADAPTER_ID,
        },
        operationalMetadata: {
          installationStatus: { state: 'Discovered' },
          healthStatus: { state: 'Ready' },
        },
      },
    ]);
    await expect(
      ingress.dispatchAdapterRequest({
        adapterId: MOCK_ADAPTER_ID,
        requiredCapability: 'StaticAnalysis',
        request: {
          engineeringRole: 'Reviewer',
          taskId: 'sprint-23-host-ingress',
          contextPackageReference: 'sprint-23-context',
        },
      }),
    ).resolves.toMatchObject({
      adapterId: MOCK_ADAPTER_ID,
      response: {
        status: 'Completed',
        executionMetadata: {
          adapterId: MOCK_ADAPTER_ID,
          taskId: 'sprint-23-host-ingress',
        },
      },
    });

    kernel.dispose();
  });
});

function resolveAdapterService(services: readonly IKernelService[]): AdapterService {
  const adapterService = services.find(
    (service): service is AdapterService => service instanceof AdapterService,
  );

  if (adapterService === undefined) {
    throw new Error('AdapterService was not composed.');
  }

  return adapterService;
}

function createOperationalMetadataProvider(): StaticHostAdapterOperationalMetadataProvider {
  const diagnostics = AdapterRuntimeDiagnostics.create([
    {
      code: 'adapter-runtime.discovered',
      message: 'Adapter runtime metadata is available.',
      attribution: MOCK_ADAPTER_ID,
    },
  ]);

  return new StaticHostAdapterOperationalMetadataProvider({
    [MOCK_ADAPTER_ID]: {
      installationStatus: AdapterInstallationStatus.create({
        state: 'Discovered',
        diagnostics,
      }).toSnapshot(),
      healthStatus: AdapterHealthStatus.create({
        state: 'Ready',
        checkedAt: '1970-01-01T00:00:00.000Z',
        diagnostics,
      }).toSnapshot(),
      runtimeDiagnostics: diagnostics.toSnapshot(),
    },
  });
}

class RecordingPresentationSurface implements HostPresentationSurface {
  public appendLine(): void {}

  public async showInformationMessage(): Promise<void> {}

  public async showErrorMessage(): Promise<void> {}

  public async withProgress<T>(_: HostProgressOptions, operation: () => Promise<T>): Promise<T> {
    return operation();
  }
}

class NullLogger implements KernelLogger {
  public info(): void {}

  public error(): void {}
}
