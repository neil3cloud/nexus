import * as vscode from 'vscode';

import { createMockAdapter, MOCK_ADAPTER_ID, MOCK_ADAPTER_VERSION } from './adapters/mock/mock-adapter';
import { AdapterHealthStatus } from './adapters/runtime/adapter-health-status';
import { AdapterInstallationStatus } from './adapters/runtime/adapter-installation-status';
import { AdapterRuntimeDiagnostics } from './adapters/runtime/adapter-runtime-diagnostics';
import { createVscodeHost } from './hosts/vscode/vscode-host';
import { StaticHostAdapterOperationalMetadataProvider } from './hosts/vscode/host-operational-metadata';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const diagnostics = AdapterRuntimeDiagnostics.create([
    {
      code: 'adapter-runtime.discovered',
      message: 'Mock Adapter is registered for provider-independent Host ingress validation.',
      attribution: MOCK_ADAPTER_ID,
    },
  ]);
  const host = createVscodeHost({
    adapters: [createMockAdapter()],
    operationalMetadataProvider: new StaticHostAdapterOperationalMetadataProvider({
      [MOCK_ADAPTER_ID]: {
        installationStatus: AdapterInstallationStatus.create({
          state: 'Discovered',
          version: MOCK_ADAPTER_VERSION,
          diagnostics,
        }).toSnapshot(),
        healthStatus: AdapterHealthStatus.create({
          state: 'Ready',
          checkedAt: '1970-01-01T00:00:00.000Z',
          diagnostics,
        }).toSnapshot(),
        runtimeDiagnostics: diagnostics.toSnapshot(),
      },
    }),
  });

  context.subscriptions.push(host);

  await host.initialize();
}
