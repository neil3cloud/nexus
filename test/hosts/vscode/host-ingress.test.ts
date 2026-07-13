import { describe, expect, it } from 'vitest';

import { AdapterRuntimeDiagnostics } from '../../../src/adapters/runtime/adapter-runtime-diagnostics';
import { AdapterHealthStatus } from '../../../src/adapters/runtime/adapter-health-status';
import { AdapterInstallationStatus } from '../../../src/adapters/runtime/adapter-installation-status';
import { createMockAdapter, MOCK_ADAPTER_ID } from '../../../src/adapters/mock/mock-adapter';
import { AdapterService } from '../../../src/kernel/adapter/adapter.service';
import type { Adapter } from '../../../src/kernel/adapter/adapter.contract';
import { AdapterMetadata } from '../../../src/kernel/adapter/adapter-metadata';
import type { AdapterRequest } from '../../../src/kernel/adapter/adapter-request';
import { AdapterResponse } from '../../../src/kernel/adapter/adapter-response';
import { InMemoryAdapterRegistry } from '../../../src/kernel/adapter/adapter-registry';
import { ProtocolVersion } from '../../../src/kernel/adapter/protocol-version';
import type {
  HostPresentationSurface,
  HostProgressOptions,
  HostWorkspaceTrustSurface,
} from '../../../src/hosts/vscode/host.contract';
import { HostIngressError } from '../../../src/hosts/vscode/host-ingress.errors';
import { HostIngressLayer } from '../../../src/hosts/vscode/host-ingress';
import { StaticHostAdapterOperationalMetadataProvider } from '../../../src/hosts/vscode/host-operational-metadata';

describe('HostIngressLayer', () => {
  it('declares RFC-0009 Host capabilities deterministically', () => {
    const ingress = new HostIngressLayer(
      createAdapterService([createMockAdapter()]),
      createOperationalMetadataProvider(),
      new RecordingPresentationSurface(),
    );

    expect(ingress.declareCapabilities()).toEqual([
      'Command Registration',
      'Notifications',
      'Diagnostics',
      'User Interface',
    ]);
  });

  it('discovers adapters through AdapterService and presents operational metadata', async () => {
    const presentation = new RecordingPresentationSurface();
    const ingress = new HostIngressLayer(
      createAdapterService([createMockAdapter()]),
      createOperationalMetadataProvider(),
      presentation,
    );

    await expect(ingress.discoverAdapters()).resolves.toMatchObject([
      {
        adapter: {
          id: MOCK_ADAPTER_ID,
          name: 'Mock Adapter',
        },
        operationalMetadata: {
          installationStatus: { state: 'Discovered' },
          healthStatus: { state: 'Ready' },
        },
      },
    ]);
    expect(presentation.lines).toContain('Adapter: mock-adapter');
    expect(presentation.lines).toContain('Installation: Discovered');
    expect(presentation.lines).toContain('Health: Ready');
    expect(presentation.informationMessages).toEqual(['Nexus discovered 1 adapter(s).']);
  });

  it('dispatches explicitly and with fails-closed single-match lookup only', async () => {
    const presentation = new RecordingPresentationSurface();
    const ingress = new HostIngressLayer(
      createAdapterService([createMockAdapter()]),
      createOperationalMetadataProvider(),
      presentation,
    );

    await expect(
      ingress.dispatchAdapterRequest({
        adapterId: MOCK_ADAPTER_ID,
        requiredCapability: 'StaticAnalysis',
        request: {
          engineeringRole: 'Reviewer',
          taskId: 'task-1',
          contextPackageReference: 'context-1',
        },
      }),
    ).resolves.toMatchObject({
      adapterId: MOCK_ADAPTER_ID,
      response: {
        status: 'Completed',
        executionMetadata: {
          adapterId: MOCK_ADAPTER_ID,
        },
      },
    });
    expect(presentation.progressTitles).toContain('Nexus adapter dispatch: mock-adapter');
    expect(presentation.lines).toContain('Produced Artifact: mock-adapter:Reviewer:task-1:context-1');
    expect(presentation.lines).toContain('Execution Metadata adapterId: mock-adapter');
    expect(presentation.lines).toContain('Dispatch Progress: started mock-adapter');
    expect(presentation.lines).toContain('Dispatch Progress: completed mock-adapter');

    await expect(
      ingress.dispatchAdapterRequest({
        requiredCapability: 'StaticAnalysis',
        request: {
          engineeringRole: 'Reviewer',
          taskId: 'task-2',
          contextPackageReference: 'context-2',
        },
      }),
    ).resolves.toMatchObject({
      adapterId: MOCK_ADAPTER_ID,
      response: {
        status: 'Completed',
      },
    });
  });

  it('fails closed when single-match dispatch would require selection policy', async () => {
    const ingress = new HostIngressLayer(
      createAdapterService([createMockAdapter(), new SecondaryStaticAnalysisAdapter()]),
      createOperationalMetadataProvider(),
      new RecordingPresentationSurface(),
    );

    await expect(
      ingress.dispatchAdapterRequest({
        requiredCapability: 'StaticAnalysis',
        request: {
          engineeringRole: 'Reviewer',
          taskId: 'task-1',
          contextPackageReference: 'context-1',
        },
      }),
    ).rejects.toMatchObject({
      code: 'host-ingress.ambiguous-adapter-match',
    } satisfies Partial<HostIngressError>);
  });

  it('refuses dispatch when workspace trust is not granted before Adapter execution', async () => {
    const adapter = new DispatchRecordingAdapter();
    const presentation = new RecordingPresentationSurface();
    const ingress = new HostIngressLayer(
      createAdapterService([adapter]),
      createOperationalMetadataProvider(),
      presentation,
      new StaticWorkspaceTrustSurface(false),
    );

    await expect(
      ingress.dispatchAdapterRequest({
        adapterId: 'recording-adapter',
        request: {
          engineeringRole: 'Reviewer',
          taskId: 'task-1',
          contextPackageReference: 'context-1',
        },
      }),
    ).rejects.toMatchObject({
      code: 'host-ingress.workspace-not-trusted',
    } satisfies Partial<HostIngressError>);
    expect(adapter.dispatchCount).toBe(0);
    expect(presentation.lines).toContain(
      'Host Diagnostic host-ingress.workspace-not-trusted: Workspace Trust is required before dispatching Adapter requests.',
    );
  });
});

function createAdapterService(adapters: readonly Adapter[]): AdapterService {
  return new AdapterService(
    new InMemoryAdapterRegistry(adapters),
    ProtocolVersion.fromString('1.0'),
  );
}

function createOperationalMetadataProvider(): StaticHostAdapterOperationalMetadataProvider {
  const diagnostics = AdapterRuntimeDiagnostics.create([
    {
      code: 'adapter-runtime.discovered',
      message: 'Adapter runtime metadata is available.',
      attribution: MOCK_ADAPTER_ID,
    },
  ]);

  return new StaticHostAdapterOperationalMetadataProvider({
    [MOCK_ADAPTER_ID]: {
      installationStatus: AdapterInstallationStatus.create({
        state: 'Discovered',
        diagnostics,
      }).toSnapshot(),
      healthStatus: AdapterHealthStatus.create({
        state: 'Ready',
        checkedAt: '1970-01-01T00:00:00.000Z',
        diagnostics,
      }).toSnapshot(),
      runtimeDiagnostics: diagnostics.toSnapshot(),
    },
  });
}

class RecordingPresentationSurface implements HostPresentationSurface {
  public readonly lines: string[] = [];
  public readonly informationMessages: string[] = [];
  public readonly errorMessages: string[] = [];
  public readonly progressTitles: string[] = [];

  public appendLine(message: string): void {
    this.lines.push(message);
  }

  public async showInformationMessage(message: string): Promise<void> {
    this.informationMessages.push(message);
  }

  public async showErrorMessage(message: string): Promise<void> {
    this.errorMessages.push(message);
  }

  public async withProgress<T>(options: HostProgressOptions, operation: () => Promise<T>): Promise<T> {
    this.progressTitles.push(options.title);

    return operation();
  }
}

class StaticWorkspaceTrustSurface implements HostWorkspaceTrustSurface {
  public constructor(private readonly trusted: boolean) {}

  public isWorkspaceTrusted(): boolean {
    return this.trusted;
  }
}

class DispatchRecordingAdapter implements Adapter {
  public dispatchCount = 0;
  public readonly metadata = AdapterMetadata.create({
    id: 'recording-adapter',
    name: 'Recording Adapter',
    version: '1.0.0',
    protocolVersion: '1.0',
    capabilities: ['StaticAnalysis'],
    supportedRoles: ['Reviewer'],
  });

  public async execute(request: AdapterRequest): Promise<AdapterResponse> {
    this.dispatchCount += 1;

    return AdapterResponse.create({
      status: 'Completed',
      executionMetadata: {
        taskId: request.taskId,
      },
    });
  }
}

class SecondaryStaticAnalysisAdapter implements Adapter {
  public readonly metadata = AdapterMetadata.create({
    id: 'secondary-static-analysis-adapter',
    name: 'Secondary Static Analysis Adapter',
    version: '1.0.0',
    protocolVersion: '1.0',
    capabilities: ['StaticAnalysis'],
    supportedRoles: ['Reviewer'],
  });

  public async execute(request: AdapterRequest): Promise<AdapterResponse> {
    return AdapterResponse.create({
      status: 'Completed',
      findings: ['secondary finding'],
      executionMetadata: {
        adapterId: this.metadata.id.toString(),
        taskId: request.taskId,
      },
    });
  }
}
