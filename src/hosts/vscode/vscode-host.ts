import * as vscode from 'vscode';

import pino, { type Logger } from 'pino';

import type { Adapter } from '../../kernel/adapter/adapter.contract';
import { AdapterService } from '../../kernel/adapter/adapter.service';
import { Kernel } from '../../kernel/kernel';
import { createKernelServices } from '../../kernel/common/create-kernel-services';
import type { IKernelService } from '../../kernel/common/kernel-service';
import type { KernelLogger } from '../../kernel/common/kernel-logger';
import { EvidenceService } from '../../kernel/evidence/evidence.service';
import { ExecutionStrategyService } from '../../kernel/execution/execution-strategy.service';
import { RoleService } from '../../kernel/execution/role.service';
import { KnowledgeService } from '../../kernel/knowledge/knowledge.service';
import { MissionExecutionService } from '../../kernel/mission/mission-execution.service';
import { MissionPlanningService } from '../../kernel/mission/mission-planning.service';
import { MissionService } from '../../kernel/mission/mission.service';
import { ReviewService } from '../../kernel/review/review.service';
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
import { HostMissionWorkflow } from './host-mission-workflow';
import { HostMissionWorkflowCommandRegistration } from './host-mission-workflow-command-registration';
import type { HostAdapterOperationalMetadataProvider } from './host-operational-metadata';
import { StaticHostAdapterOperationalMetadataProvider } from './host-operational-metadata';

export interface VscodeHostOptions {
  readonly adapters?: readonly Adapter[];
  readonly missionWorkflowAdapterId?: string;
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
  private readonly missionWorkflow: HostMissionWorkflow;
  private commandRegistrations: HostDisposable[] = [];

  public constructor(
    outputChannel: vscode.OutputChannel,
    kernel: Kernel,
    logger: KernelLogger,
    ingress: HostIngressLayer,
    missionWorkflow: HostMissionWorkflow,
  ) {
    this.outputChannel = outputChannel;
    this.kernel = kernel;
    this.logger = logger;
    this.ingress = ingress;
    this.missionWorkflow = missionWorkflow;
  }

  public async initialize(): Promise<void> {
    const commandRegistry = new VscodeCommandRegistry();
    const presentation = new VscodePresentationSurface(this.outputChannel);
    const inputSurface = new VscodeInputSurface();
    this.commandRegistrations = [
      commandRegistry.registerCommand('nexus.initializeWorkspace', async () =>
        this.initializeWorkspaceCommand(),
      ),
      new HostCommandRegistration(commandRegistry, this.ingress, inputSurface, presentation),
      new HostMissionWorkflowCommandRegistration(
        commandRegistry,
        this.missionWorkflow,
        inputSurface,
        presentation,
      ),
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
  const missionService = resolveService(
    composedServices,
    'MissionService',
    (service): service is MissionService => service instanceof MissionService,
  );
  const planningService = resolveService(
    composedServices,
    'MissionPlanningService',
    (service): service is MissionPlanningService => service instanceof MissionPlanningService,
  );
  const executionService = resolveService(
    composedServices,
    'MissionExecutionService',
    (service): service is MissionExecutionService => service instanceof MissionExecutionService,
  );
  const roleService = resolveService(
    composedServices,
    'RoleService',
    (service): service is RoleService => service instanceof RoleService,
  );
  const executionStrategyService = resolveService(
    composedServices,
    'ExecutionStrategyService',
    (service): service is ExecutionStrategyService => service instanceof ExecutionStrategyService,
  );
  const evidenceService = resolveService(
    composedServices,
    'EvidenceService',
    (service): service is EvidenceService => service instanceof EvidenceService,
  );
  const reviewService = resolveService(
    composedServices,
    'ReviewService',
    (service): service is ReviewService => service instanceof ReviewService,
  );
  const knowledgeService = resolveService(
    composedServices,
    'KnowledgeService',
    (service): service is KnowledgeService => service instanceof KnowledgeService,
  );
  const operationalMetadataProvider =
    options.operationalMetadataProvider ?? new StaticHostAdapterOperationalMetadataProvider({});
  const presentation = new VscodePresentationSurface(outputChannel);
  const workspaceTrust = new VscodeWorkspaceTrustSurface();
  const ingress = new HostIngressLayer(
    adapterService,
    operationalMetadataProvider,
    presentation,
    workspaceTrust,
  );
  const missionWorkflow = new HostMissionWorkflow(
    missionService,
    planningService,
    executionService,
    {
      roleService,
      executionStrategyService,
      adapterService,
      adapterId: options.missionWorkflowAdapterId ?? 'mock-adapter',
      requiredCapability: 'CodeModification',
    },
    {
      evidenceService,
      reviewService,
      knowledgeService,
    },
    presentation,
    workspaceTrust,
  );

  return new VscodeHost(outputChannel, kernel, logger, ingress, missionWorkflow);
}

function resolveAdapterService(services: readonly IKernelService[]): AdapterService {
  return resolveService(
    services,
    'AdapterService',
    (service): service is AdapterService => service instanceof AdapterService,
  );
}

function resolveService<T extends IKernelService>(
  services: readonly IKernelService[],
  serviceName: string,
  isService: (service: IKernelService) => service is T,
): T {
  const adapterService = services.find(
    isService,
  );

  if (adapterService === undefined) {
    throw new Error(`${serviceName} is required for VS Code Host composition.`);
  }

  return adapterService;
}
