import type { LocalProcessRuntimeContract } from '../runtime/local-process-runtime.contract';
import type { ProcessDiagnostic } from '../runtime/process-diagnostics';
import type { ProcessResult } from '../runtime/process-result';
import type { Adapter } from '../../kernel/adapter/adapter.contract';
import { AdapterMetadata } from '../../kernel/adapter/adapter-metadata';
import type { AdapterRequest } from '../../kernel/adapter/adapter-request';
import { AdapterResponse } from '../../kernel/adapter/adapter-response';
import type { AdapterDiagnosticInput } from '../../kernel/adapter/adapter-response';

export const GEMINI_CLI_ADAPTER_ID = 'gemini-cli-adapter';
export const GEMINI_CLI_ADAPTER_PROTOCOL_VERSION = '1.0';
export const GEMINI_CLI_ADAPTER_VERSION = '1.0.0';
export const GEMINI_CLI_DEFAULT_EXECUTABLE = 'gemini';
export const GEMINI_CLI_TIMEOUT_CONSTRAINT = 'geminiCliAdapter.timeoutMs';

const DEFAULT_TIMEOUT_MS = 120_000;

export interface GeminiCliAdapterOptions {
  readonly executable?: string;
  readonly baseArguments?: readonly string[];
  readonly workingDirectory?: string;
  readonly environment?: Readonly<Record<string, string>>;
  readonly timeoutMs?: number;
}

interface GeminiCliResponseDocument {
  readonly status: 'Completed' | 'Failed';
  readonly diagnostics: readonly AdapterDiagnosticInput[];
  readonly producedArtifacts: readonly string[];
  readonly findings: readonly string[];
  readonly executionMetadata: Readonly<Record<string, string>>;
}

export class GeminiCliAdapter implements Adapter {
  public readonly metadata = AdapterMetadata.create({
    id: GEMINI_CLI_ADAPTER_ID,
    name: 'Gemini CLI Adapter',
    version: GEMINI_CLI_ADAPTER_VERSION,
    protocolVersion: GEMINI_CLI_ADAPTER_PROTOCOL_VERSION,
    capabilities: [
      'CodeGeneration',
      'CodeModification',
      'CLI',
      'DocumentationGeneration',
      'StaticAnalysis',
      'TestGeneration',
    ],
    supportedRoles: ['Builder', 'Documentation Reviewer', 'Reviewer', 'Test Engineer'],
    attributes: {
      runtime: 'local-process',
      provider: 'gemini-cli',
      authentication: 'pre-authenticated-local-cli-session',
    },
  });

  public constructor(
    private readonly runtime: LocalProcessRuntimeContract,
    private readonly options: GeminiCliAdapterOptions = {},
  ) {}

  public async execute(request: AdapterRequest): Promise<AdapterResponse> {
    if (!this.metadata.supportsRole(request.engineeringRole)) {
      return this.createFailedResponse(request, {
        code: 'gemini-cli-adapter.unsupported-role',
        message: `Gemini CLI Adapter does not support engineering role '${request.engineeringRole}'.`,
      });
    }

    const timeoutMs = this.resolveTimeout(request);

    if (typeof timeoutMs !== 'number') {
      return this.createFailedResponse(request, timeoutMs);
    }

    let result: ProcessResult;

    try {
      result = await this.runtime.execute({
        executable: this.options.executable ?? GEMINI_CLI_DEFAULT_EXECUTABLE,
        arguments: [...(this.options.baseArguments ?? []), '--prompt', this.createPrompt(request)],
        ...(this.options.workingDirectory === undefined
          ? {}
          : { workingDirectory: this.options.workingDirectory }),
        ...(this.options.environment === undefined ? {} : { environment: this.options.environment }),
        timeoutMs,
      });
    } catch (error: unknown) {
      return this.createFailedResponse(request, {
        code: 'gemini-cli-adapter.runtime-error',
        message: `Gemini CLI Adapter runtime failed: ${errorMessage(error)}.`,
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
            code: 'gemini-cli-adapter.malformed-output',
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
                code: `gemini-cli-adapter.${parsed.status === 'Completed' ? 'completed' : 'failed'}`,
                message: `Gemini CLI Adapter returned '${parsed.status}'.`,
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
    const timeoutConstraint = request.executionConstraints[GEMINI_CLI_TIMEOUT_CONSTRAINT];

    if (timeoutConstraint === undefined) {
      return this.options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    }

    const timeoutMs = Number(timeoutConstraint);

    if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
      return {
        code: 'gemini-cli-adapter.invalid-timeout',
        message: `Gemini CLI Adapter timeout constraint '${timeoutConstraint}' is not a positive integer.`,
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
          code: 'gemini-cli-adapter.process-failed',
          message: 'Gemini CLI process failed without diagnostics.',
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
      provider: 'gemini-cli',
      executable: this.options.executable ?? GEMINI_CLI_DEFAULT_EXECUTABLE,
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

export function createGeminiCliAdapter(
  runtime: LocalProcessRuntimeContract,
  options: GeminiCliAdapterOptions = {},
): GeminiCliAdapter {
  return new GeminiCliAdapter(runtime, options);
}

function parseResponseDocument(output: string): GeminiCliResponseDocument | string {
  let parsed: unknown;

  try {
    parsed = JSON.parse(output.trim());
  } catch {
    return 'Gemini CLI Adapter could not parse Gemini CLI output as JSON.';
  }

  if (!isRecord(parsed)) {
    return 'Gemini CLI Adapter output must be a JSON object.';
  }

  if (parsed.status !== 'Completed' && parsed.status !== 'Failed') {
    return "Gemini CLI Adapter output status must be either 'Completed' or 'Failed'.";
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
    return 'Gemini CLI Adapter output diagnostics must be an array.';
  }

  const diagnostics: AdapterDiagnosticInput[] = [];

  for (const diagnostic of value) {
    if (!isRecord(diagnostic)) {
      return 'Gemini CLI Adapter output diagnostics entries must be objects.';
    }

    if (typeof diagnostic.code !== 'string' || typeof diagnostic.message !== 'string') {
      return 'Gemini CLI Adapter output diagnostics entries must include string code and message.';
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
    return `Gemini CLI Adapter output ${label} must be an array.`;
  }

  if (!value.every((entry) => typeof entry === 'string')) {
    return `Gemini CLI Adapter output ${label} entries must be strings.`;
  }

  return Object.freeze([...value]);
}

function parseStringRecord(value: unknown): Readonly<Record<string, string>> | string {
  if (!isRecord(value)) {
    return 'Gemini CLI Adapter output executionMetadata must be an object.';
  }

  const record: Record<string, string> = {};

  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry !== 'string') {
      return 'Gemini CLI Adapter output executionMetadata values must be strings.';
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
