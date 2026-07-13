import * as vscode from 'vscode';

import { createGeminiCliAdapter, GEMINI_CLI_ADAPTER_ID, GEMINI_CLI_ADAPTER_VERSION } from './adapters/gemini/gemini-cli-adapter';
import { createMockAdapter, MOCK_ADAPTER_ID, MOCK_ADAPTER_VERSION } from './adapters/mock/mock-adapter';
import { LocalProcessRuntime } from './adapters/runtime/local-process-runtime';
import { AdapterHealthStatus } from './adapters/runtime/adapter-health-status';
import { AdapterInstallationStatus } from './adapters/runtime/adapter-installation-status';
import { AdapterRuntimeDiagnostics } from './adapters/runtime/adapter-runtime-diagnostics';
import { createVscodeHost } from './hosts/vscode/vscode-host';
import { StaticHostAdapterOperationalMetadataProvider } from './hosts/vscode/host-operational-metadata';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const mockDiagnostics = AdapterRuntimeDiagnostics.create([
    {
      code: 'adapter-runtime.discovered',
      message: 'Mock Adapter is registered for provider-independent Host ingress validation.',
      attribution: MOCK_ADAPTER_ID,
    },
  ]);
  const geminiDiagnostics = AdapterRuntimeDiagnostics.create([
    {
      code: 'adapter-runtime.discovered',
      message: 'Gemini CLI Adapter is registered for explicit Developer Workflow validation.',
      attribution: GEMINI_CLI_ADAPTER_ID,
    },
  ]);
  const host = createVscodeHost({
    adapters: [createMockAdapter(), createGeminiCliAdapter(new LocalProcessRuntime())],
    missionWorkflowAdapterId: MOCK_ADAPTER_ID,
    geminiCliMissionWorkflowAdapterId: GEMINI_CLI_ADAPTER_ID,
    operationalMetadataProvider: new StaticHostAdapterOperationalMetadataProvider({
      [MOCK_ADAPTER_ID]: {
        installationStatus: AdapterInstallationStatus.create({
          state: 'Discovered',
          version: MOCK_ADAPTER_VERSION,
          diagnostics: mockDiagnostics,
        }).toSnapshot(),
        healthStatus: AdapterHealthStatus.create({
          state: 'Ready',
          checkedAt: '1970-01-01T00:00:00.000Z',
          diagnostics: mockDiagnostics,
        }).toSnapshot(),
        runtimeDiagnostics: mockDiagnostics.toSnapshot(),
      },
      [GEMINI_CLI_ADAPTER_ID]: {
        installationStatus: AdapterInstallationStatus.create({
          state: 'Discovered',
          version: GEMINI_CLI_ADAPTER_VERSION,
          diagnostics: geminiDiagnostics,
        }).toSnapshot(),
        healthStatus: AdapterHealthStatus.create({
          state: 'Ready',
          checkedAt: '1970-01-01T00:00:00.000Z',
          diagnostics: geminiDiagnostics,
        }).toSnapshot(),
        runtimeDiagnostics: geminiDiagnostics.toSnapshot(),
      },
    }),
  });

  context.subscriptions.push(host);

  await host.initialize();
}
