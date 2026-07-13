import { describe, expect, it } from 'vitest';

import {
  MOCK_ADAPTER_ID,
  MOCK_ADAPTER_RESULT_CONSTRAINT,
  MockAdapter,
} from '../../../src/adapters/mock/mock-adapter';
import { AdapterRequest } from '../../../src/kernel/adapter/adapter-request';

function createRequest(
  input: {
    readonly engineeringRole?: string;
    readonly taskId?: string;
    readonly executionConstraints?: Readonly<Record<string, string>>;
  } = {},
): AdapterRequest {
  const requestInput = {
    engineeringRole: input.engineeringRole ?? 'Builder',
    taskId: input.taskId ?? 'task-1',
    contextPackageReference: 'context-package-1',
  };

  if (input.executionConstraints === undefined) {
    return AdapterRequest.create(requestInput);
  }

  return AdapterRequest.create({
    ...requestInput,
    executionConstraints: input.executionConstraints,
  });
}

describe('MockAdapter', () => {
  it('declares immutable RFC-0008 metadata and static capabilities', () => {
    const adapter = new MockAdapter();

    expect(Object.isFrozen(adapter.metadata)).toBe(true);
    expect(adapter.metadata.toSnapshot()).toMatchObject({
      id: MOCK_ADAPTER_ID,
      name: 'Mock Adapter',
      version: '1.0.0',
      protocolVersion: '1.0',
      capabilities: [
        'CodeGeneration',
        'CodeModification',
        'DocumentationGeneration',
        'StaticAnalysis',
        'TestGeneration',
      ],
      supportedRoles: ['Builder', 'Documentation Reviewer', 'Reviewer', 'Test Engineer'],
      attributes: {
        deterministic: 'true',
        provider: 'none',
        runtime: 'in-process',
      },
    });
  });

  it('produces deterministic attributable responses for equivalent requests', async () => {
    const adapter = new MockAdapter();
    const request = createRequest({ taskId: 'task-deterministic' });

    const firstResponse = await adapter.execute(request);
    const secondResponse = await adapter.execute(AdapterRequest.fromSnapshot(request.toSnapshot()));

    expect(firstResponse.toSnapshot()).toEqual(secondResponse.toSnapshot());
    expect(firstResponse.toSnapshot()).toMatchObject({
      status: 'Completed',
      diagnostics: [
        {
          code: 'mock-adapter.completed',
          message: 'Mock Adapter deterministically completed the request.',
        },
      ],
      producedArtifacts: ['mock-adapter:Builder:task-deterministic:context-package-1'],
      executionMetadata: {
        adapterId: MOCK_ADAPTER_ID,
        engineeringRole: 'Builder',
        taskId: 'task-deterministic',
        contextPackageReference: 'context-package-1',
        requestedResult: 'Completed',
      },
    });
  });

  it('returns deterministic failure diagnostics for unsupported roles and execution failures', async () => {
    const adapter = new MockAdapter();

    await expect(adapter.execute(createRequest({ engineeringRole: 'Security Reviewer' }))).resolves.toMatchObject({
      status: 'Failed',
      diagnostics: [
        {
          code: 'mock-adapter.unsupported-role',
          message: "Mock Adapter does not support engineering role 'Security Reviewer'.",
        },
      ],
    });

    await expect(
      adapter.execute(
        createRequest({
          executionConstraints: {
            [MOCK_ADAPTER_RESULT_CONSTRAINT]: 'Failed',
          },
        }),
      ),
    ).resolves.toMatchObject({
      status: 'Failed',
      diagnostics: [
        {
          code: 'mock-adapter.execution-failed',
          message: 'Mock Adapter deterministically failed the request.',
        },
      ],
    });
  });

  it('rejects invalid deterministic result constraints with an AdapterResponse failure', async () => {
    const adapter = new MockAdapter();

    await expect(
      adapter.execute(
        createRequest({
          executionConstraints: {
            [MOCK_ADAPTER_RESULT_CONSTRAINT]: 'Skipped',
          },
        }),
      ),
    ).resolves.toMatchObject({
      status: 'Failed',
      diagnostics: [
        {
          code: 'mock-adapter.invalid-request',
          message: "Mock Adapter result constraint 'Skipped' is not valid.",
        },
      ],
    });
  });
});
