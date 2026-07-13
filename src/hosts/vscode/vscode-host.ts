import * as vscode from 'vscode';

import pino, { type Logger } from 'pino';

import type { Adapter } from '../../kernel/adapter/adapter.contract';
import { AdapterService } from '../../kernel/adapter/adapter.service';
import { Kernel } from '../../kernel/kernel';
import { createKernelServices } from '../../kernel/common/create-kernel-services';
import type { IKernelService } from '../../kernel/common/kernel-service';
import type { KernelLogger } from '../../kernel/common/kernel-logger';
import type {
  HostCommandHandler,
  HostCommandRegistry,
  HostDisposable,
  HostInputPrompt,
  HostInputSurface,
  HostPresentationSurface,
  HostProgressOptions,
  HostWorkspaceTrustSurface,
} from './host.contract';
import { HostCommandRegistration } from './host-command-registration';
import { HostIngressLayer } from './host-ingress';
import type { HostAdapterOperationalMetadataProvider } from './host-operational-metadata';
import { StaticHostAdapterOperationalMetadataProvider } from './host-operational-metadata';

export interface VscodeHostOptions {
  readonly adapters?: readonly Adapter[];
  readonly operationalMetadataProvider?: HostAdapterOperationalMetadataProvider;
}

class VscodeOutputChannelStream {
  public constructor(private readonly outputChannel: vscode.OutputChannel) {}

  public write(message: string): void {
    this.outputChannel.appendLine(message.trimEnd());
  }
}

class VscodeKernelLogger implements KernelLogger {
  private readonly logger: Logger;

  public constructor(outputChannel: vscode.OutputChannel) {
    this.logger = pino(
      {
        base: {
          component: 'nexus-vscode-host',
        },
      },
      new VscodeOutputChannelStream(outputChannel),
    );
  }

  public info(message: string, fields: Readonly<Record<string, string>> = {}): void {
    this.logger.info(fields, message);
  }

  public error(message: string, fields: Readonly<Record<string, string>> = {}): void {
    this.logger.error(fields, message);
  }
}

class VscodeCommandRegistry implements HostCommandRegistry {
  public registerCommand(command: string, handler: HostCommandHandler): HostDisposable {
    return vscode.commands.registerCommand(command, async (...args: readonly unknown[]) =>
      handler(...args),
    );
  }
}

class VscodePresentationSurface implements HostPresentationSurface {
  public constructor(private readonly outputChannel: vscode.OutputChannel) {}

  public appendLine(message: string): void {
    this.outputChannel.appendLine(message);
  }

  public async showInformationMessage(message: string): Promise<void> {
    await vscode.window.showInformationMessage(message);
  }

  public async showErrorMessage(message: string): Promise<void> {
    await vscode.window.showErrorMessage(message);
  }

  public async withProgress<T>(options: HostProgressOptions, operation: () => Promise<T>): Promise<T> {
    return vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: options.title,
      },
      operation,
    );
  }
}

class VscodeInputSurface implements HostInputSurface {
  public async showInputBox(prompt: HostInputPrompt): Promise<string | undefined> {
    return vscode.window.showInputBox({
      prompt: prompt.prompt,
      ...(prompt.value === undefined ? {} : { value: prompt.value }),
    });
  }
}

class VscodeWorkspaceTrustSurface implements HostWorkspaceTrustSurface {
  public isWorkspaceTrusted(): boolean {
    return vscode.workspace.isTrusted;
  }
}

export class VscodeHost implements vscode.Disposable {
  private readonly outputChannel: vscode.OutputChannel;
  private readonly kernel: Kernel;
  private readonly logger: KernelLogger;
  private readonly ingress: HostIngressLayer;
  private commandRegistrations: HostDisposable[] = [];

  public constructor(
    outputChannel: vscode.OutputChannel,
    kernel: Kernel,
    logger: KernelLogger,
    ingress: HostIngressLayer,
  ) {
    this.outputChannel = outputChannel;
    this.kernel = kernel;
    this.logger = logger;
    this.ingress = ingress;
  }

  public async initialize(): Promise<void> {
    const commandRegistry = new VscodeCommandRegistry();
    const presentation = new VscodePresentationSurface(this.outputChannel);
    this.commandRegistrations = [
      commandRegistry.registerCommand('nexus.initializeWorkspace', async () =>
        this.initializeWorkspaceCommand(),
      ),
      new HostCommandRegistration(commandRegistry, this.ingress, new VscodeInputSurface(), presentation),
    ];

    await this.kernel.initialize();
  }

  public dispose(): void {
    for (const registration of this.commandRegistrations) {
      registration.dispose();
    }

    this.kernel.dispose();
    this.outputChannel.dispose();
  }

  private async initializeWorkspaceCommand(): Promise<void> {
    if (this.kernel.health().initialized) {
      await vscode.window.showInformationMessage('Nexus workspace is already initialized.');
      this.logger.info('Nexus workspace initialization skipped.', {
        reason: 'already_initialized',
      });
      return;
    }

    await vscode.window.showInformationMessage('Nexus workspace initialization started.');
    await this.kernel.initialize();
    await vscode.window.showInformationMessage('Nexus workspace initialized.');
    this.logger.info('Nexus workspace initialized.');
  }
}

export function createVscodeHost(options: VscodeHostOptions = {}): VscodeHost {
  const outputChannel = vscode.window.createOutputChannel('Nexus');
  const logger = new VscodeKernelLogger(outputChannel);
  let composedServices: readonly IKernelService[] = [];
  const kernel = new Kernel(
    (eventBus) => {
      composedServices = createKernelServices(eventBus, { adapters: options.adapters ?? [] });

      return composedServices;
    },
    logger,
  );
  const adapterService = resolveAdapterService(composedServices);
  const operationalMetadataProvider =
    options.operationalMetadataProvider ?? new StaticHostAdapterOperationalMetadataProvider({});
  const ingress = new HostIngressLayer(
    adapterService,
    operationalMetadataProvider,
    new VscodePresentationSurface(outputChannel),
    new VscodeWorkspaceTrustSurface(),
  );

  return new VscodeHost(outputChannel, kernel, logger, ingress);
}

function resolveAdapterService(services: readonly IKernelService[]): AdapterService {
  const adapterService = services.find(
    (service): service is AdapterService => service instanceof AdapterService,
  );

  if (adapterService === undefined) {
    throw new Error('AdapterService is required for VS Code Host ingress.');
  }

  return adapterService;
}
