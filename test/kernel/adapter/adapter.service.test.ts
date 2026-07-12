import { describe, expect, it } from 'vitest';

import type { Adapter } from '../../../src/kernel/adapter/adapter.contract';
import { AdapterMetadata } from '../../../src/kernel/adapter/adapter-metadata';
import { AdapterRequest } from '../../../src/kernel/adapter/adapter-request';
import { AdapterResponse } from '../../../src/kernel/adapter/adapter-response';
import { InMemoryAdapterRegistry } from '../../../src/kernel/adapter/adapter-registry';
import { AdapterService } from '../../../src/kernel/adapter/adapter.service';
import {
  AdapterNotFoundError,
  IncompatibleAdapterProtocolVersionError,
  UnsupportedAdapterCapabilityError,
} from '../../../src/kernel/adapter/adapter.errors';
import { ProtocolVersion } from '../../../src/kernel/adapter/protocol-version';

class DispatchRecordingAdapter implements Adapter {
  public readonly requests: AdapterRequest[] = [];
  public readonly metadata: AdapterMetadata;

  public constructor(input: {
    readonly adapterId: string;
    readonly protocolVersion?: string;
    readonly capabilities?: readonly string[];
  }) {
    this.metadata = AdapterMetadata.create({
      id: input.adapterId,
      name: `Adapter ${input.adapterId}`,
      version: '1.0.0',
      protocolVersion: input.protocolVersion ?? '1.0',
      capabilities: input.capabilities ?? ['StaticAnalysis'],
      supportedRoles: ['Reviewer'],
    });
  }

  public async execute(request: AdapterRequest): Promise<AdapterResponse> {
    this.requests.push(request);

    return AdapterResponse.create({
      status: 'Completed',
      diagnostics: [
        {
          code: 'adapter.completed',
          message: 'Adapter completed the request.',
        },
      ],
      producedArtifacts: ['artifact-1'],
      findings: ['finding-1'],
      executionMetadata: {
        adapterId: this.metadata.id.toString(),
      },
    });
  }
}

function createRequest(): AdapterRequest {
  return AdapterRequest.create({
    engineeringRole: 'Reviewer',
    taskId: 'task-1',
    contextPackageReference: 'context-package-1',
  });
}

describe('AdapterService', () => {
  it('resolves a registered adapter and dispatches an AdapterRequest', async () => {
    const registry = new InMemoryAdapterRegistry();
    const adapter = new DispatchRecordingAdapter({ adapterId: 'adapter-1' });
    const service = new AdapterService(registry, ProtocolVersion.fromString('1.0'));
    const request = createRequest();

    await registry.register(adapter);

    const response = await service.dispatch({
      adapterId: 'adapter-1',
      request,
      requiredCapability: 'StaticAnalysis',
    });

    expect(response.toSnapshot()).toMatchObject({
      status: 'Completed',
      producedArtifacts: ['artifact-1'],
      findings: ['finding-1'],
      executionMetadata: {
        adapterId: 'adapter-1',
      },
    });
    expect(adapter.requests).toEqual([request]);
  });

  it('rejects missing adapters, unsupported capabilities, and incompatible protocol versions', async () => {
    const registry = new InMemoryAdapterRegistry();
    const adapter = new DispatchRecordingAdapter({
      adapterId: 'adapter-1',
      protocolVersion: '2.0',
      capabilities: ['TestGeneration'],
    });
    const service = new AdapterService(registry, ProtocolVersion.fromString('1.0'));
    const request = createRequest();

    await expect(
      service.dispatch({
        adapterId: 'missing-adapter',
        request,
      }),
    ).rejects.toThrow(AdapterNotFoundError);

    await registry.register(adapter);

    await expect(
      service.dispatch({
        adapterId: 'adapter-1',
        request,
      }),
    ).rejects.toThrow(IncompatibleAdapterProtocolVersionError);

    const compatibleRegistry = new InMemoryAdapterRegistry();
    const compatibleAdapter = new DispatchRecordingAdapter({
      adapterId: 'adapter-2',
      capabilities: ['TestGeneration'],
    });
    const compatibleService = new AdapterService(
      compatibleRegistry,
      ProtocolVersion.fromString('1.0'),
    );

    await compatibleRegistry.register(compatibleAdapter);

    await expect(
      compatibleService.dispatch({
        adapterId: 'adapter-2',
        request,
        requiredCapability: 'StaticAnalysis',
      }),
    ).rejects.toThrow(UnsupportedAdapterCapabilityError);
  });
});
