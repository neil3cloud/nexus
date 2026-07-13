import type { Adapter } from '../../kernel/adapter/adapter.contract';
import { AdapterMetadata } from '../../kernel/adapter/adapter-metadata';
import type { AdapterRequest } from '../../kernel/adapter/adapter-request';
import { AdapterResponse } from '../../kernel/adapter/adapter-response';

export const MOCK_ADAPTER_ID = 'mock-adapter';
export const MOCK_ADAPTER_PROTOCOL_VERSION = '1.0';
export const MOCK_ADAPTER_VERSION = '1.0.0';
export const MOCK_ADAPTER_RESULT_CONSTRAINT = 'mockAdapter.result';

export class MockAdapter implements Adapter {
  public readonly metadata = AdapterMetadata.create({
    id: MOCK_ADAPTER_ID,
    name: 'Mock Adapter',
    version: MOCK_ADAPTER_VERSION,
    protocolVersion: MOCK_ADAPTER_PROTOCOL_VERSION,
    capabilities: [
      'CodeGeneration',
      'CodeModification',
      'DocumentationGeneration',
      'StaticAnalysis',
      'TestGeneration',
    ],
    supportedRoles: ['Builder', 'Documentation Reviewer', 'Reviewer', 'Test Engineer'],
    attributes: {
      runtime: 'in-process',
      deterministic: 'true',
      provider: 'none',
    },
  });

  public async execute(request: AdapterRequest): Promise<AdapterResponse> {
    if (!this.metadata.supportsRole(request.engineeringRole)) {
      return this.createFailedResponse(request, {
        code: 'mock-adapter.unsupported-role',
        message: `Mock Adapter does not support engineering role '${request.engineeringRole}'.`,
      });
    }

    const requestedResult = request.executionConstraints[MOCK_ADAPTER_RESULT_CONSTRAINT] ?? 'Completed';

    if (requestedResult === 'Failed') {
      return this.createFailedResponse(request, {
        code: 'mock-adapter.execution-failed',
        message: 'Mock Adapter deterministically failed the request.',
      });
    }

    if (requestedResult !== 'Completed') {
      return this.createFailedResponse(request, {
        code: 'mock-adapter.invalid-request',
        message: `Mock Adapter result constraint '${requestedResult}' is not valid.`,
      });
    }

    return AdapterResponse.create({
      status: 'Completed',
      diagnostics: [
        {
          code: 'mock-adapter.completed',
          message: 'Mock Adapter deterministically completed the request.',
        },
      ],
      producedArtifacts: [this.artifactReference(request)],
      executionMetadata: this.executionMetadata(request, requestedResult),
    });
  }

  private createFailedResponse(
    request: AdapterRequest,
    diagnostic: { readonly code: string; readonly message: string },
  ): AdapterResponse {
    return AdapterResponse.create({
      status: 'Failed',
      diagnostics: [diagnostic],
      executionMetadata: this.executionMetadata(request, 'Failed'),
    });
  }

  private artifactReference(request: AdapterRequest): string {
    return `${MOCK_ADAPTER_ID}:${request.engineeringRole}:${request.taskId}:${request.contextPackageReference}`;
  }

  private executionMetadata(
    request: AdapterRequest,
    requestedResult: string,
  ): Readonly<Record<string, string>> {
    return {
      adapterId: this.metadata.id.toString(),
      adapterName: this.metadata.name.toString(),
      adapterVersion: this.metadata.version.toString(),
      protocolVersion: this.metadata.protocolVersion.toString(),
      engineeringRole: request.engineeringRole,
      taskId: request.taskId,
      contextPackageReference: request.contextPackageReference,
      requestedResult,
    };
  }
}

export function createMockAdapter(): MockAdapter {
  return new MockAdapter();
}
