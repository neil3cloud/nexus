import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  GEMINI_CLI_ADAPTER_ID,
  GEMINI_CLI_TIMEOUT_CONSTRAINT,
  GeminiCliAdapter,
} from '../../../src/adapters/gemini/gemini-cli-adapter';
import type { LocalProcessRuntimeContract } from '../../../src/adapters/runtime/local-process-runtime.contract';
import { LocalProcessRuntime } from '../../../src/adapters/runtime/local-process-runtime';
import { ProcessExitStatus } from '../../../src/adapters/runtime/process-exit-status';
import { ProcessRequest } from '../../../src/adapters/runtime/process-request';
import type { ProcessRequestInput } from '../../../src/adapters/runtime/process-request';
import { ProcessResult } from '../../../src/adapters/runtime/process-result';
import { AdapterRequest } from '../../../src/kernel/adapter/adapter-request';

const testDoublePath = join(process.cwd(), 'test', 'adapters', 'gemini', 'gemini-cli-test-double.cjs');

describe('GeminiCliAdapter', () => {
  it('declares immutable RFC-0008 metadata for the production Gemini CLI provider', () => {
    const adapter = new GeminiCliAdapter(new CapturingRuntime(completedProcessResult()));

    expect(Object.isFrozen(adapter.metadata)).toBe(true);
    expect(adapter.metadata.toSnapshot()).toMatchObject({
      id: GEMINI_CLI_ADAPTER_ID,
      name: 'Gemini CLI Adapter',
      version: '1.0.0',
      protocolVersion: '1.0',
      capabilities: [
        'CLI',
        'CodeGeneration',
        'CodeModification',
        'DocumentationGeneration',
        'StaticAnalysis',
        'TestGeneration',
      ],
      supportedRoles: ['Builder', 'Documentation Reviewer', 'Reviewer', 'Test Engineer'],
      attributes: {
        authentication: 'pre-authenticated-local-cli-session',
        provider: 'gemini-cli',
        runtime: 'local-process',
      },
    });
  });

  it('translates AdapterRequest into a ProcessRequest through the injected runtime', async () => {
    const runtime = new CapturingRuntime(completedProcessResult());
    const adapter = new GeminiCliAdapter(runtime, {
      executable: 'gemini-test-double',
      baseArguments: ['--deterministic'],
      timeoutMs: 5000,
      workingDirectory: process.cwd(),
      environment: {
        NEXUS_TEST_DOUBLE: 'true',
      },
    });
    const request = createRequest({
      taskId: 'task-request-translation',
      executionConstraints: {
        [GEMINI_CLI_TIMEOUT_CONSTRAINT]: '2500',
      },
      requestMetadata: {
        projectionVersion: 'projection-1',
      },
    });

    const response = await adapter.execute(request);

    expect(response.toSnapshot()).toMatchObject({
      status: 'Completed',
      producedArtifacts: ['artifact-from-test-double'],
      executionMetadata: {
        adapterId: GEMINI_CLI_ADAPTER_ID,
        executable: 'gemini-test-double',
        processTerminationReason: 'Exited',
        taskId: 'task-request-translation',
      },
    });
    expect(runtime.capturedRequest).toMatchObject({
      executable: 'gemini-test-double',
      arguments: ['--deterministic', '--prompt', expect.stringContaining('NEXUS_ADAPTER_REQUEST_JSON:')],
      options: {
        environment: {
          NEXUS_TEST_DOUBLE: 'true',
        },
        timeoutMs: 2500,
        workingDirectory: process.cwd(),
      },
    });
    expect(runtime.capturedRequest?.arguments[2]).toContain('"projectionVersion":"projection-1"');
  });

  it('executes successfully against a deterministic local test-double executable', async () => {
    const adapter = createTestDoubleAdapter();

    const response = await adapter.execute(createRequest({ taskId: 'task-test-double-success' }));

    expect(response.toSnapshot()).toMatchObject({
      status: 'Completed',
      diagnostics: [
        {
          code: 'test-double.completed',
        },
      ],
      producedArtifacts: ['gemini-test-double:Builder:task-test-double-success'],
      executionMetadata: {
        adapterId: GEMINI_CLI_ADAPTER_ID,
        testDouble: 'true',
        contextPackageReference: 'context-package-1',
        processTerminationReason: 'Exited',
      },
    });
  });

  it('maps executable-not-found and non-zero exit diagnostics from LocalProcessRuntime', async () => {
    const missingExecutableAdapter = new GeminiCliAdapter(new LocalProcessRuntime(), {
      executable: 'nexus-sprint-29-missing-gemini-executable',
      timeoutMs: 1000,
    });
    const nonZeroExitAdapter = createTestDoubleAdapter();

    await expect(missingExecutableAdapter.execute(createRequest())).resolves.toMatchObject({
      status: 'Failed',
      diagnostics: [
        {
          code: 'process.executable-not-found',
        },
      ],
    });
    await expect(
      nonZeroExitAdapter.execute(
        createRequest({
          executionConstraints: {
            'geminiCliAdapter.testDoubleResult': 'NonZeroExit',
          },
        }),
      ),
    ).resolves.toMatchObject({
      status: 'Failed',
      diagnostics: [
        {
          code: 'process.non-zero-exit-code',
        },
      ],
    });
  });

  it('returns deterministic diagnostics for malformed output, timeout, and runtime errors', async () => {
    const adapter = createTestDoubleAdapter();
    const runtimeErrorAdapter = new GeminiCliAdapter(new ThrowingRuntime());

    await expect(
      adapter.execute(
        createRequest({
          executionConstraints: {
            'geminiCliAdapter.testDoubleResult': 'MalformedOutput',
          },
        }),
      ),
    ).resolves.toMatchObject({
      status: 'Failed',
      diagnostics: [
        {
          code: 'gemini-cli-adapter.malformed-output',
        },
      ],
    });

    await expect(
      adapter.execute(
        createRequest({
          executionConstraints: {
            [GEMINI_CLI_TIMEOUT_CONSTRAINT]: '25',
            'geminiCliAdapter.testDoubleResult': 'Timeout',
          },
        }),
      ),
    ).resolves.toMatchObject({
      status: 'Failed',
      diagnostics: [
        {
          code: 'process.timed-out',
        },
      ],
    });

    await expect(runtimeErrorAdapter.execute(createRequest())).resolves.toMatchObject({
      status: 'Failed',
      diagnostics: [
        {
          code: 'gemini-cli-adapter.runtime-error',
        },
      ],
    });
  });

  it('fails closed for unsupported engineering roles and invalid timeout constraints', async () => {
    const adapter = createTestDoubleAdapter();

    await expect(
      adapter.execute(createRequest({ engineeringRole: 'Security Reviewer' })),
    ).resolves.toMatchObject({
      status: 'Failed',
      diagnostics: [
        {
          code: 'gemini-cli-adapter.unsupported-role',
        },
      ],
    });
    await expect(
      adapter.execute(
        createRequest({
          executionConstraints: {
            [GEMINI_CLI_TIMEOUT_CONSTRAINT]: 'not-a-number',
          },
        }),
      ),
    ).resolves.toMatchObject({
      status: 'Failed',
      diagnostics: [
        {
          code: 'gemini-cli-adapter.invalid-timeout',
        },
      ],
    });
  });
});

function createTestDoubleAdapter(): GeminiCliAdapter {
  return new GeminiCliAdapter(new LocalProcessRuntime(), {
    executable: process.execPath,
    baseArguments: [testDoublePath],
    timeoutMs: 5000,
  });
}

function createRequest(
  input: {
    readonly engineeringRole?: string;
    readonly taskId?: string;
    readonly executionConstraints?: Readonly<Record<string, string>>;
    readonly requestMetadata?: Readonly<Record<string, string>>;
  } = {},
): AdapterRequest {
  return AdapterRequest.create({
    engineeringRole: input.engineeringRole ?? 'Builder',
    taskId: input.taskId ?? 'task-1',
    contextPackageReference: 'context-package-1',
    ...(input.executionConstraints === undefined
      ? {}
      : { executionConstraints: input.executionConstraints }),
    ...(input.requestMetadata === undefined ? {} : { requestMetadata: input.requestMetadata }),
  });
}

function completedProcessResult(): ProcessResult {
  return ProcessResult.create({
    exitStatus: ProcessExitStatus.completed(),
    standardOutput: JSON.stringify({
      status: 'Completed',
      diagnostics: [
        {
          code: 'test-double.completed',
          message: 'Deterministic test-double completed.',
        },
      ],
      producedArtifacts: ['artifact-from-test-double'],
      findings: [],
      executionMetadata: {
        testDouble: 'true',
      },
    }),
    durationMs: 7,
    terminationReason: 'Exited',
  });
}

class CapturingRuntime implements LocalProcessRuntimeContract {
  public capturedRequest: ReturnType<ProcessRequest['toSnapshot']> | undefined;

  public constructor(private readonly result: ProcessResult) {}

  public async execute(input: ProcessRequest | ProcessRequestInput): Promise<ProcessResult> {
    this.capturedRequest =
      input instanceof ProcessRequest ? input.toSnapshot() : ProcessRequest.create(input).toSnapshot();

    return this.result;
  }
}

class ThrowingRuntime implements LocalProcessRuntimeContract {
  public async execute(): Promise<ProcessResult> {
    throw new Error('deterministic runtime failure');
  }
}
