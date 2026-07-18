import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  CODEX_CLI_ADAPTER_ID,
  CODEX_CLI_TIMEOUT_CONSTRAINT,
  CodexCliAdapter,
} from '../../../src/adapters/codex/codex-cli-adapter';
import type { LocalProcessRuntimeContract } from '../../../src/adapters/runtime/local-process-runtime.contract';
import { LocalProcessRuntime } from '../../../src/adapters/runtime/local-process-runtime';
import { ProcessExitStatus } from '../../../src/adapters/runtime/process-exit-status';
import { ProcessRequest } from '../../../src/adapters/runtime/process-request';
import type { ProcessRequestInput } from '../../../src/adapters/runtime/process-request';
import { ProcessResult } from '../../../src/adapters/runtime/process-result';
import { AdapterRequest } from '../../../src/kernel/adapter/adapter-request';

const testDoublePath = join(process.cwd(), 'test', 'adapters', 'codex', 'codex-cli-test-double.cjs');

describe('CodexCliAdapter', () => {
  it('declares immutable RFC-0008 metadata for the production Codex CLI provider', () => {
    const adapter = new CodexCliAdapter(new CapturingRuntime(completedProcessResult()));

    expect(Object.isFrozen(adapter.metadata)).toBe(true);
    expect(adapter.metadata.toSnapshot()).toMatchObject({
      id: CODEX_CLI_ADAPTER_ID,
      name: 'Codex CLI Adapter',
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
        provider: 'codex-cli',
        runtime: 'local-process',
      },
    });
  });

  it('translates AdapterRequest into a ProcessRequest through the injected runtime', async () => {
    const runtime = new CapturingRuntime(completedProcessResult());
    const adapter = new CodexCliAdapter(runtime, {
      executable: 'codex-test-double',
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
        [CODEX_CLI_TIMEOUT_CONSTRAINT]: '2500',
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
        adapterId: CODEX_CLI_ADAPTER_ID,
        executable: 'codex-test-double',
        processTerminationReason: 'Exited',
        taskId: 'task-request-translation',
      },
    });
    expect(runtime.capturedRequest).toMatchObject({
      executable: 'codex-test-double',
      arguments: ['--deterministic', expect.stringContaining('NEXUS_ADAPTER_REQUEST_JSON:')],
      options: {
        environment: {
          NEXUS_TEST_DOUBLE: 'true',
        },
        timeoutMs: 2500,
        workingDirectory: process.cwd(),
      },
    });
    expect(runtime.capturedRequest?.arguments[1]).toContain('"projectionVersion":"projection-1"');
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
      producedArtifacts: ['codex-test-double:Builder:task-test-double-success'],
      executionMetadata: {
        adapterId: CODEX_CLI_ADAPTER_ID,
        testDouble: 'true',
        contextPackageReference: 'context-package-1',
        processTerminationReason: 'Exited',
      },
    });
  });

  it('maps executable-not-found and non-zero exit diagnostics from LocalProcessRuntime', async () => {
    const missingExecutableAdapter = new CodexCliAdapter(new LocalProcessRuntime(), {
      executable: 'nexus-sprint-31-missing-codex-executable',
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
            'codexCliAdapter.testDoubleResult': 'NonZeroExit',
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
    const runtimeErrorAdapter = new CodexCliAdapter(new ThrowingRuntime());

    await expect(
      adapter.execute(
        createRequest({
          executionConstraints: {
            'codexCliAdapter.testDoubleResult': 'MalformedOutput',
          },
        }),
      ),
    ).resolves.toMatchObject({
      status: 'Failed',
      diagnostics: [
        {
          code: 'codex-cli-adapter.malformed-output',
        },
      ],
    });

    await expect(
      adapter.execute(
        createRequest({
          executionConstraints: {
            [CODEX_CLI_TIMEOUT_CONSTRAINT]: '25',
            'codexCliAdapter.testDoubleResult': 'Timeout',
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
          code: 'codex-cli-adapter.runtime-error',
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
          code: 'codex-cli-adapter.unsupported-role',
        },
      ],
    });
    await expect(
      adapter.execute(
        createRequest({
          executionConstraints: {
            [CODEX_CLI_TIMEOUT_CONSTRAINT]: 'not-a-number',
          },
        }),
      ),
    ).resolves.toMatchObject({
      status: 'Failed',
      diagnostics: [
        {
          code: 'codex-cli-adapter.invalid-timeout',
        },
      ],
    });
  });
});

function createTestDoubleAdapter(): CodexCliAdapter {
  return new CodexCliAdapter(new LocalProcessRuntime(), {
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
