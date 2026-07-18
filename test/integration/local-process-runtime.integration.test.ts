import { describe, expect, it } from 'vitest';

import type { Adapter } from '../../src/kernel/adapter/adapter.contract';
import { AdapterMetadata } from '../../src/kernel/adapter/adapter-metadata';
import { AdapterRequest } from '../../src/kernel/adapter/adapter-request';
import { AdapterResponse } from '../../src/kernel/adapter/adapter-response';
import { InMemoryAdapterRegistry } from '../../src/kernel/adapter/adapter-registry';
import { AdapterService } from '../../src/kernel/adapter/adapter.service';
import { ProtocolVersion } from '../../src/kernel/adapter/protocol-version';
import { LocalProcessRuntime } from '../../src/adapters/runtime/local-process-runtime';
import type { LocalProcessRuntimeContract } from '../../src/adapters/runtime/local-process-runtime.contract';
import type { ProcessResult } from '../../src/adapters/runtime/process-result';

class LocalProcessTestAdapter implements Adapter {
  public readonly metadata = AdapterMetadata.create({
    id: 'local-process-test-adapter',
    name: 'Local Process Test Adapter',
    version: '1.0.0',
    protocolVersion: '1.0',
    capabilities: ['StaticAnalysis'],
    supportedRoles: ['Reviewer'],
    attributes: {
      runtime: 'local-process-runtime',
      provider: 'none',
    },
  });

  public constructor(
    private readonly runtime: LocalProcessRuntimeContract = new LocalProcessRuntime(),
  ) {}

  public async execute(request: AdapterRequest): Promise<AdapterResponse> {
    const result = await this.runtime.execute({
      executable: process.execPath,
      arguments: ['-e', 'process.stdout.write("adapter-layer-runtime-proof");'],
      timeoutMs: 5000,
    });

    return result.exitStatus.succeeded
      ? this.createCompletedResponse(request, result)
      : this.createFailedResponse(request, result);
  }

  private createCompletedResponse(
    request: AdapterRequest,
    result: ProcessResult,
  ): AdapterResponse {
    return AdapterResponse.create({
      status: 'Completed',
      diagnostics: [
        {
          code: 'local-process-test-adapter.completed',
          message: 'Local Process Test Adapter completed runtime execution.',
        },
      ],
      producedArtifacts: [result.standardOutput],
      executionMetadata: this.executionMetadata(request, result),
    });
  }

  private createFailedResponse(request: AdapterRequest, result: ProcessResult): AdapterResponse {
    return AdapterResponse.create({
      status: 'Failed',
      diagnostics: result.diagnostics.entries.map((diagnostic) => ({
        code: diagnostic.code,
        message: diagnostic.message,
      })),
      executionMetadata: this.executionMetadata(request, result),
    });
  }

  private executionMetadata(
    request: AdapterRequest,
    result: ProcessResult,
  ): Readonly<Record<string, string>> {
    return {
      adapterId: this.metadata.id.toString(),
      engineeringRole: request.engineeringRole,
      taskId: request.taskId,
      contextPackageReference: request.contextPackageReference,
      processTerminationReason: result.terminationReason,
    };
  }
}

describe('Local Process Runtime adapter-layer integration', () => {
  it('executes beneath Adapter dispatch without modifying MockAdapter or Kernel contracts', async () => {
    const registry = new InMemoryAdapterRegistry([new LocalProcessTestAdapter()]);
    const service = new AdapterService(registry, ProtocolVersion.fromString('1.0'));
    const response = await service.dispatch({
      adapterId: 'local-process-test-adapter',
      requiredCapability: 'StaticAnalysis',
      request: AdapterRequest.create({
        engineeringRole: 'Reviewer',
        taskId: 'task-sprint-21-runtime-proof',
        contextPackageReference: 'context-package-sprint-21-runtime-proof',
      }),
    });

    expect(response.toSnapshot()).toMatchObject({
      status: 'Completed',
      producedArtifacts: ['adapter-layer-runtime-proof'],
      executionMetadata: {
        adapterId: 'local-process-test-adapter',
        engineeringRole: 'Reviewer',
        taskId: 'task-sprint-21-runtime-proof',
        contextPackageReference: 'context-package-sprint-21-runtime-proof',
        processTerminationReason: 'Exited',
      },
    });
  });
});
