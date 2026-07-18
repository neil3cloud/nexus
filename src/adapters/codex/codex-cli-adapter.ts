import type { LocalProcessRuntimeContract } from '../runtime/local-process-runtime.contract';
import type { ProcessDiagnostic } from '../runtime/process-diagnostics';
import type { ProcessResult } from '../runtime/process-result';
import type { Adapter } from '../../kernel/adapter/adapter.contract';
import { AdapterMetadata } from '../../kernel/adapter/adapter-metadata';
import type { AdapterRequest } from '../../kernel/adapter/adapter-request';
import { AdapterResponse } from '../../kernel/adapter/adapter-response';
import type { AdapterDiagnosticInput } from '../../kernel/adapter/adapter-response';

export const CODEX_CLI_ADAPTER_ID = 'codex-cli-adapter';
export const CODEX_CLI_ADAPTER_PROTOCOL_VERSION = '1.0';
export const CODEX_CLI_ADAPTER_VERSION = '1.0.0';
export const CODEX_CLI_DEFAULT_EXECUTABLE = 'codex';
export const CODEX_CLI_DEFAULT_BASE_ARGUMENTS = ['exec'] as const;
export const CODEX_CLI_TIMEOUT_CONSTRAINT = 'codexCliAdapter.timeoutMs';

const DEFAULT_TIMEOUT_MS = 120_000;

export interface CodexCliAdapterOptions {
  readonly executable?: string;
  readonly baseArguments?: readonly string[];
  readonly workingDirectory?: string;
  readonly environment?: Readonly<Record<string, string>>;
  readonly timeoutMs?: number;
}

interface CodexCliResponseDocument {
  readonly status: 'Completed' | 'Failed';
  readonly diagnostics: readonly AdapterDiagnosticInput[];
  readonly producedArtifacts: readonly string[];
  readonly findings: readonly string[];
  readonly executionMetadata: Readonly<Record<string, string>>;
}

export class CodexCliAdapter implements Adapter {
  public readonly metadata = AdapterMetadata.create({
    id: CODEX_CLI_ADAPTER_ID,
    name: 'Codex CLI Adapter',
    version: CODEX_CLI_ADAPTER_VERSION,
    protocolVersion: CODEX_CLI_ADAPTER_PROTOCOL_VERSION,
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

  public constructor(
    private readonly runtime: LocalProcessRuntimeContract,
    private readonly options: CodexCliAdapterOptions = {},
  ) {}

  public async execute(request: AdapterRequest): Promise<AdapterResponse> {
    if (!this.metadata.supportsRole(request.engineeringRole)) {
      return this.createFailedResponse(request, {
        code: 'codex-cli-adapter.unsupported-role',
        message: `Codex CLI Adapter does not support engineering role '${request.engineeringRole}'.`,
      });
    }

    const timeoutMs = this.resolveTimeout(request);

    if (typeof timeoutMs !== 'number') {
      return this.createFailedResponse(request, timeoutMs);
    }

    let result: ProcessResult;

    try {
      result = await this.runtime.execute({
        executable: this.options.executable ?? CODEX_CLI_DEFAULT_EXECUTABLE,
        arguments: [
          ...(this.options.baseArguments ?? CODEX_CLI_DEFAULT_BASE_ARGUMENTS),
          this.createPrompt(request),
        ],
        ...(this.options.workingDirectory === undefined
          ? {}
          : { workingDirectory: this.options.workingDirectory }),
        ...(this.options.environment === undefined ? {} : { environment: this.options.environment }),
        timeoutMs,
      });
    } catch (error: unknown) {
      return this.createFailedResponse(request, {
        code: 'codex-cli-adapter.runtime-error',
        message: `Codex CLI Adapter runtime failed: ${errorMessage(error)}.`,
      });
    }

    if (!result.exitStatus.succeeded) {
      return AdapterResponse.create({
        status: 'Failed',
        diagnostics: this.processDiagnostics(result.diagnostics.entries),
        executionMetadata: this.executionMetadata(request, result),
      });
    }

    const parsed = parseResponseDocument(result.standardOutput);

    if (typeof parsed === 'string') {
      return AdapterResponse.create({
        status: 'Failed',
        diagnostics: [
          {
            code: 'codex-cli-adapter.malformed-output',
            message: parsed,
          },
        ],
        executionMetadata: this.executionMetadata(request, result),
      });
    }

    return AdapterResponse.create({
      status: parsed.status,
      diagnostics:
        parsed.diagnostics.length === 0
          ? [
              {
                code: `codex-cli-adapter.${parsed.status === 'Completed' ? 'completed' : 'failed'}`,
                message: `Codex CLI Adapter returned '${parsed.status}'.`,
              },
            ]
          : parsed.diagnostics,
      producedArtifacts: parsed.producedArtifacts,
      findings: parsed.findings,
      executionMetadata: {
        ...parsed.executionMetadata,
        ...this.executionMetadata(request, result),
      },
    });
  }

  private resolveTimeout(request: AdapterRequest): number | AdapterDiagnosticInput {
    const timeoutConstraint = request.executionConstraints[CODEX_CLI_TIMEOUT_CONSTRAINT];

    if (timeoutConstraint === undefined) {
      return this.options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    }

    const timeoutMs = Number(timeoutConstraint);

    if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
      return {
        code: 'codex-cli-adapter.invalid-timeout',
        message: `Codex CLI Adapter timeout constraint '${timeoutConstraint}' is not a positive integer.`,
      };
    }

    return timeoutMs;
  }

  private createPrompt(request: AdapterRequest): string {
    return [
      'Execute this Nexus Adapter Request and return exactly one JSON object.',
      'Do not return Markdown, prose, comments, or code fences.',
      'The JSON object must contain status, diagnostics, producedArtifacts, findings, and executionMetadata.',
      "The status value must be either 'Completed' or 'Failed'.",
      `NEXUS_ADAPTER_REQUEST_JSON:${JSON.stringify(request.toSnapshot())}`,
    ].join('\n');
  }

  private processDiagnostics(diagnostics: readonly ProcessDiagnostic[]): readonly AdapterDiagnosticInput[] {
    if (diagnostics.length === 0) {
      return [
        {
          code: 'codex-cli-adapter.process-failed',
          message: 'Codex CLI process failed without diagnostics.',
        },
      ];
    }

    return diagnostics.map((diagnostic) => ({
      code: diagnostic.code,
      message: diagnostic.message,
    }));
  }

  private createFailedResponse(
    request: AdapterRequest,
    diagnostic: AdapterDiagnosticInput,
  ): AdapterResponse {
    return AdapterResponse.create({
      status: 'Failed',
      diagnostics: [diagnostic],
      executionMetadata: this.executionMetadata(request),
    });
  }

  private executionMetadata(
    request: AdapterRequest,
    result?: ProcessResult,
  ): Readonly<Record<string, string>> {
    return {
      adapterId: this.metadata.id.toString(),
      adapterName: this.metadata.name.toString(),
      adapterVersion: this.metadata.version.toString(),
      protocolVersion: this.metadata.protocolVersion.toString(),
      provider: 'codex-cli',
      executable: this.options.executable ?? CODEX_CLI_DEFAULT_EXECUTABLE,
      engineeringRole: request.engineeringRole,
      taskId: request.taskId,
      contextPackageReference: request.contextPackageReference,
      ...(result === undefined
        ? {}
        : {
            processTerminationReason: result.terminationReason,
            processDurationMs: result.durationMs.toString(),
          }),
      ...(result?.exitStatus.exitCode === undefined
        ? {}
        : { processExitCode: result.exitStatus.exitCode.toString() }),
      ...(result?.exitStatus.signal === undefined ? {} : { processSignal: result.exitStatus.signal }),
    };
  }
}

export function createCodexCliAdapter(
  runtime: LocalProcessRuntimeContract,
  options: CodexCliAdapterOptions = {},
): CodexCliAdapter {
  return new CodexCliAdapter(runtime, options);
}

function parseResponseDocument(output: string): CodexCliResponseDocument | string {
  let parsed: unknown;

  try {
    parsed = JSON.parse(output.trim());
  } catch {
    return 'Codex CLI Adapter could not parse Codex CLI output as JSON.';
  }

  if (!isRecord(parsed)) {
    return 'Codex CLI Adapter output must be a JSON object.';
  }

  if (parsed.status !== 'Completed' && parsed.status !== 'Failed') {
    return "Codex CLI Adapter output status must be either 'Completed' or 'Failed'.";
  }

  const diagnostics = parseDiagnostics(parsed.diagnostics);
  const producedArtifacts = parseStringList(parsed.producedArtifacts, 'producedArtifacts');
  const findings = parseStringList(parsed.findings, 'findings');
  const executionMetadata = parseStringRecord(parsed.executionMetadata);

  if (typeof diagnostics === 'string') {
    return diagnostics;
  }

  if (typeof producedArtifacts === 'string') {
    return producedArtifacts;
  }

  if (typeof findings === 'string') {
    return findings;
  }

  if (typeof executionMetadata === 'string') {
    return executionMetadata;
  }

  return {
    status: parsed.status,
    diagnostics,
    producedArtifacts,
    findings,
    executionMetadata,
  };
}

function parseDiagnostics(value: unknown): readonly AdapterDiagnosticInput[] | string {
  if (!Array.isArray(value)) {
    return 'Codex CLI Adapter output diagnostics must be an array.';
  }

  const diagnostics: AdapterDiagnosticInput[] = [];

  for (const diagnostic of value) {
    if (!isRecord(diagnostic)) {
      return 'Codex CLI Adapter output diagnostics entries must be objects.';
    }

    if (typeof diagnostic.code !== 'string' || typeof diagnostic.message !== 'string') {
      return 'Codex CLI Adapter output diagnostics entries must include string code and message.';
    }

    diagnostics.push({
      code: diagnostic.code,
      message: diagnostic.message,
    });
  }

  return Object.freeze(diagnostics);
}

function parseStringList(value: unknown, label: string): readonly string[] | string {
  if (!Array.isArray(value)) {
    return `Codex CLI Adapter output ${label} must be an array.`;
  }

  if (!value.every((entry) => typeof entry === 'string')) {
    return `Codex CLI Adapter output ${label} entries must be strings.`;
  }

  return Object.freeze([...value]);
}

function parseStringRecord(value: unknown): Readonly<Record<string, string>> | string {
  if (!isRecord(value)) {
    return 'Codex CLI Adapter output executionMetadata must be an object.';
  }

  const record: Record<string, string> = {};

  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry !== 'string') {
      return 'Codex CLI Adapter output executionMetadata values must be strings.';
    }

    record[key] = entry;
  }

  return Object.freeze(record);
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
