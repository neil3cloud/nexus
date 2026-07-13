import type { AdapterMetadataSnapshot } from '../../kernel/adapter/adapter-metadata';
import { AdapterRequest } from '../../kernel/adapter/adapter-request';
import type { AdapterRequestInput } from '../../kernel/adapter/adapter-request';
import type { AdapterResponseSnapshot } from '../../kernel/adapter/adapter-response';
import { AdapterService } from '../../kernel/adapter/adapter.service';
import type {
  HostPresentationSurface,
  HostCapability,
  HostWorkspaceTrustSurface,
} from './host.contract';
import { hostCapabilityValues } from './host.contract';
import { TrustedHostWorkspaceTrustSurface } from './host.contract';
import { HostIngressError } from './host-ingress.errors';
import type {
  HostAdapterOperationalMetadataProvider,
  HostAdapterOperationalMetadataSnapshot,
} from './host-operational-metadata';

export interface HostDiagnostic {
  readonly code: string;
  readonly message: string;
  readonly attribution: string;
}

export interface HostAdapterDiscoveryEntry {
  readonly adapter: AdapterMetadataSnapshot;
  readonly diagnostics: readonly HostDiagnostic[];
  readonly operationalMetadata?: HostAdapterOperationalMetadataSnapshot;
}

export interface HostAdapterDispatchInput {
  readonly adapterId?: string;
  readonly request: AdapterRequest | AdapterRequestInput;
  readonly requiredCapability?: string;
}

export interface HostAdapterDispatchResult {
  readonly adapterId: string;
  readonly response: AdapterResponseSnapshot;
}

export class HostIngressLayer {
  public constructor(
    private readonly adapterService: AdapterService,
    private readonly operationalMetadataProvider: HostAdapterOperationalMetadataProvider,
    private readonly presentation: HostPresentationSurface,
    private readonly workspaceTrust: HostWorkspaceTrustSurface = new TrustedHostWorkspaceTrustSurface(),
  ) {}

  public declareCapabilities(): readonly HostCapability[] {
    return Object.freeze([...hostCapabilityValues]);
  }

  public async discoverAdapters(): Promise<readonly HostAdapterDiscoveryEntry[]> {
    const adapters = await this.adapterService.enumerateAdapters();
    const entries = await Promise.all(
      adapters.map(async (adapter) => this.createDiscoveryEntry(adapter.toSnapshot())),
    );

    this.presentation.appendLine('Nexus Adapter Discovery');
    for (const entry of entries) {
      this.presentDiscoveryEntry(entry);
    }

    await this.presentation.showInformationMessage(
      `Nexus discovered ${String(entries.length)} adapter(s).`,
    );

    return Object.freeze(entries);
  }

  public async dispatchAdapterRequest(
    input: HostAdapterDispatchInput,
  ): Promise<HostAdapterDispatchResult> {
    const request = input.request instanceof AdapterRequest ? input.request : AdapterRequest.create(input.request);
    const requiredCapability = normalizeOptionalNonEmptyString(
      input.requiredCapability,
      'Required Adapter Capability',
    );
    const adapterId = await this.resolveAdapterId(input.adapterId, requiredCapability);

    if (!this.workspaceTrust.isWorkspaceTrusted()) {
      return this.failIngress(
        'host-ingress.workspace-not-trusted',
        'Workspace Trust is required before dispatching Adapter requests.',
      );
    }

    try {
      this.presentation.appendLine(`Dispatch Progress: started ${adapterId}`);
      const response = await this.presentation.withProgress(
        { title: `Nexus adapter dispatch: ${adapterId}` },
        async () =>
          this.adapterService.dispatch({
            adapterId,
            request,
            ...(requiredCapability === undefined ? {} : { requiredCapability }),
          }),
      );
      const snapshot = response.toSnapshot();

      this.presentation.appendLine(`Nexus Adapter Dispatch: ${adapterId}`);
      this.presentation.appendLine(`Status: ${snapshot.status}`);
      for (const diagnostic of snapshot.diagnostics) {
        this.presentation.appendLine(`Diagnostic ${diagnostic.code}: ${diagnostic.message}`);
      }
      for (const producedArtifact of snapshot.producedArtifacts) {
        this.presentation.appendLine(`Produced Artifact: ${producedArtifact}`);
      }
      for (const finding of snapshot.findings) {
        this.presentation.appendLine(`Finding: ${finding}`);
      }
      for (const [key, value] of Object.entries(snapshot.executionMetadata).sort(([left], [right]) =>
        left.localeCompare(right),
      )) {
        this.presentation.appendLine(`Execution Metadata ${key}: ${value}`);
      }
      this.presentation.appendLine(`Dispatch Progress: completed ${adapterId}`);

      if (snapshot.status === 'Completed') {
        await this.presentation.showInformationMessage(`Nexus adapter '${adapterId}' completed.`);
      } else {
        await this.presentation.showErrorMessage(`Nexus adapter '${adapterId}' failed.`);
      }

      return Object.freeze({
        adapterId,
        response: snapshot,
      });
    } catch (error) {
      await this.presentation.showErrorMessage(
        `Nexus adapter dispatch failed: ${error instanceof Error ? error.message : 'Unknown error.'}`,
      );
      throw error;
    }
  }

  private async resolveAdapterId(
    adapterId: string | undefined,
    requiredCapability: string | undefined,
  ): Promise<string> {
    if (adapterId !== undefined) {
      return normalizeNonEmptyString(adapterId, 'Adapter identifier');
    }

    const adapters = (await this.adapterService.enumerateAdapters())
      .map((adapter) => adapter.toSnapshot())
      .filter((adapter) =>
        requiredCapability === undefined
          ? true
          : adapter.capabilities.some((capability) => capability === requiredCapability),
      );

    if (adapters.length === 0) {
      return this.failIngress(
        'host-ingress.no-adapter-found',
        'Host ingress found no registered Adapter for dispatch.',
      );
    }

    if (adapters.length > 1) {
      return this.failIngress(
        'host-ingress.ambiguous-adapter-match',
        'Host ingress found multiple matching Adapters; explicit adapterId is required.',
      );
    }

    const adapter = adapters[0];

    if (adapter === undefined) {
      throw new HostIngressError(
        'host-ingress.no-adapter-found',
        'Host ingress found no registered Adapter for dispatch.',
      );
    }

    return adapter.id;
  }

  private async failIngress(code: string, message: string): Promise<never> {
    this.presentation.appendLine(`Host Diagnostic ${code}: ${message}`);
    await this.presentation.showErrorMessage(`Nexus host ingress failed: ${message}`);

    throw new HostIngressError(code, message);
  }

  private async createDiscoveryEntry(
    adapter: AdapterMetadataSnapshot,
  ): Promise<HostAdapterDiscoveryEntry> {
    const operationalMetadata = await this.operationalMetadataProvider.getOperationalMetadata(adapter.id);
    const diagnostics =
      operationalMetadata === undefined
        ? [
            Object.freeze({
              code: 'host-ingress.operational-metadata-missing',
              message: `Adapter '${adapter.id}' did not report operational metadata.`,
              attribution: 'VS Code Host',
            }),
          ]
        : [];

    return Object.freeze({
      adapter,
      diagnostics: Object.freeze(diagnostics),
      ...(operationalMetadata === undefined ? {} : { operationalMetadata }),
    });
  }

  private presentDiscoveryEntry(entry: HostAdapterDiscoveryEntry): void {
    this.presentation.appendLine(`Adapter: ${entry.adapter.id}`);
    this.presentation.appendLine(`Name: ${entry.adapter.name}`);
    this.presentation.appendLine(`Lifecycle: ${entry.adapter.lifecycle}`);
    this.presentation.appendLine(`Capabilities: ${entry.adapter.capabilities.join(', ')}`);

    if (entry.operationalMetadata !== undefined) {
      this.presentation.appendLine(
        `Installation: ${entry.operationalMetadata.installationStatus.state}`,
      );
      this.presentation.appendLine(`Health: ${entry.operationalMetadata.healthStatus.state}`);
      for (const diagnostic of entry.operationalMetadata.runtimeDiagnostics) {
        this.presentation.appendLine(
          `Runtime Diagnostic ${diagnostic.code}: ${diagnostic.message}`,
        );
      }
    }

    for (const diagnostic of entry.diagnostics) {
      this.presentation.appendLine(`Host Diagnostic ${diagnostic.code}: ${diagnostic.message}`);
    }
  }
}

function normalizeOptionalNonEmptyString(value: string | undefined, label: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return normalizeNonEmptyString(value, label);
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new HostIngressError('host-ingress.invalid-input', `${label} must be a non-empty string.`);
  }

  return normalized;
}
