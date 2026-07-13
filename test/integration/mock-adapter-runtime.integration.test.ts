import { describe, expect, it } from 'vitest';

import {
  MOCK_ADAPTER_ID,
  MockAdapter,
} from '../../src/adapters/mock/mock-adapter';
import { AdapterRequest } from '../../src/kernel/adapter/adapter-request';
import { AdapterService } from '../../src/kernel/adapter/adapter.service';
import type { IKernelService } from '../../src/kernel/common/kernel-service';
import type { KernelLogger } from '../../src/kernel/common/kernel-logger';
import { createKernelServices } from '../../src/kernel/common/create-kernel-services';
import { Kernel } from '../../src/kernel/kernel';

class TestLogger implements KernelLogger {
  public info(): void {}

  public error(): void {}
}

describe('Mock Adapter runtime integration', () => {
  it('registers, discovers, and dispatches MockAdapter through Kernel composition', async () => {
    let services: readonly IKernelService[] = [];
    const kernel = new Kernel((eventBus) => {
      services = createKernelServices(eventBus, {
        adapters: [new MockAdapter()],
      });

      return services;
    }, new TestLogger());

    await kernel.initialize();

    const adapterService = requireService(
      services,
      'AdapterService',
      (service): service is AdapterService => service instanceof AdapterService,
    );

    await expect(adapterService.enumerateAdapters()).resolves.toHaveLength(1);
    await expect(adapterService.enumerateAdapters()).resolves.toMatchObject([
      {
        supportedRoles: ['Builder', 'Documentation Reviewer', 'Reviewer', 'Test Engineer'],
      },
    ]);

    const response = await adapterService.dispatch({
      adapterId: MOCK_ADAPTER_ID,
      requiredCapability: 'CodeModification',
      request: AdapterRequest.create({
        engineeringRole: 'Builder',
        taskId: 'task-runtime-integration',
        contextPackageReference: 'context-package-runtime-integration',
      }),
    });

    expect(response.toSnapshot()).toMatchObject({
      status: 'Completed',
      producedArtifacts: [
        'mock-adapter:Builder:task-runtime-integration:context-package-runtime-integration',
      ],
      executionMetadata: {
        adapterId: MOCK_ADAPTER_ID,
        engineeringRole: 'Builder',
        taskId: 'task-runtime-integration',
        contextPackageReference: 'context-package-runtime-integration',
      },
    });
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
