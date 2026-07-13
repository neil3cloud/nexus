import type { AdapterRequestInput } from '../../kernel/adapter/adapter-request';
import type {
  HostCommandRegistry,
  HostDisposable,
  HostInputSurface,
  HostPresentationSurface,
} from './host.contract';
import type { HostAdapterDispatchInput } from './host-ingress';
import { HostIngressLayer } from './host-ingress';
import { HostIngressError } from './host-ingress.errors';

export const HOST_DISCOVER_ADAPTERS_COMMAND = 'nexus.discoverAdapters';
export const HOST_DISPATCH_ADAPTER_REQUEST_COMMAND = 'nexus.dispatchAdapterRequest';
export const HOST_SHOW_CAPABILITIES_COMMAND = 'nexus.showHostCapabilities';

export class HostCommandRegistration implements HostDisposable {
  private readonly registrations: readonly HostDisposable[];

  public constructor(
    commandRegistry: HostCommandRegistry,
    private readonly ingress: HostIngressLayer,
    private readonly inputSurface: HostInputSurface,
    private readonly presentation: HostPresentationSurface,
  ) {
    this.registrations = Object.freeze([
      commandRegistry.registerCommand(HOST_DISCOVER_ADAPTERS_COMMAND, async () =>
        this.ingress.discoverAdapters(),
      ),
      commandRegistry.registerCommand(HOST_DISPATCH_ADAPTER_REQUEST_COMMAND, async (input) =>
        this.ingress.dispatchAdapterRequest(await this.normalizeDispatchInput(input)),
      ),
      commandRegistry.registerCommand(HOST_SHOW_CAPABILITIES_COMMAND, () =>
        this.ingress.declareCapabilities(),
      ),
    ]);
  }

  public dispose(): void {
    for (const registration of this.registrations) {
      registration.dispose();
    }
  }

  private async normalizeDispatchInput(input: unknown): Promise<HostAdapterDispatchInput> {
    if (!isRecord(input)) {
      return this.readInteractiveDispatchInput();
    }

    const request = isRecord(input.request)
      ? normalizeRequestInput(input.request)
      : {
          engineeringRole: 'Reviewer',
          taskId: 'host-ingress-command',
          contextPackageReference: 'host-ingress-context',
        };
    const adapterId = typeof input.adapterId === 'string' ? input.adapterId : undefined;
    const requiredCapability =
      typeof input.requiredCapability === 'string' ? input.requiredCapability : 'StaticAnalysis';

    return {
      request,
      ...(adapterId === undefined ? {} : { adapterId }),
      requiredCapability,
    };
  }

  private async readInteractiveDispatchInput(): Promise<HostAdapterDispatchInput> {
    const engineeringRole = await this.readRequiredInput('Engineering Role');
    const taskId = await this.readRequiredInput('Task Identifier');
    const contextPackageReference = await this.readRequiredInput('Context Package Reference');
    const adapterId = await this.readOptionalInput('Adapter Identifier (optional)');
    const requiredCapability = await this.readOptionalInput('Required Adapter Capability (optional)');

    return {
      request: {
        engineeringRole,
        taskId,
        contextPackageReference,
      },
      ...(adapterId === undefined ? {} : { adapterId }),
      ...(requiredCapability === undefined ? {} : { requiredCapability }),
    };
  }

  private async readRequiredInput(prompt: string): Promise<string> {
    const value = await this.inputSurface.showInputBox({ prompt });

    if (value === undefined) {
      return this.failInputCancelled(prompt);
    }

    return value;
  }

  private async readOptionalInput(prompt: string): Promise<string | undefined> {
    const value = await this.inputSurface.showInputBox({ prompt });

    if (value === undefined) {
      return this.failInputCancelled(prompt);
    }

    const normalized = value.trim();

    return normalized.length === 0 ? undefined : value;
  }

  private async failInputCancelled(prompt: string): Promise<never> {
    const message = `Adapter dispatch input cancelled while reading ${prompt}.`;

    this.presentation.appendLine(`Host Diagnostic host-ingress.input-cancelled: ${message}`);
    await this.presentation.showErrorMessage(`Nexus host input cancelled: ${message}`);

    throw new HostIngressError('host-ingress.input-cancelled', message);
  }
}

function normalizeRequestInput(input: Readonly<Record<string, unknown>>): AdapterRequestInput {
  return {
    engineeringRole:
      typeof input.engineeringRole === 'string' ? input.engineeringRole : 'Reviewer',
    taskId: typeof input.taskId === 'string' ? input.taskId : 'host-ingress-command',
    contextPackageReference:
      typeof input.contextPackageReference === 'string'
        ? input.contextPackageReference
        : 'host-ingress-context',
    ...(isStringRecord(input.executionConstraints)
      ? { executionConstraints: input.executionConstraints }
      : {}),
    ...(isStringRecord(input.requestMetadata) ? { requestMetadata: input.requestMetadata } : {}),
  };
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringRecord(value: unknown): value is Readonly<Record<string, string>> {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every((entry) => typeof entry === 'string');
}
