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
  HostAdapterConfigurationSurface,
} from './host-adapter-configuration';
import {
  DEVELOPER_WORKFLOW_DEFAULT_ADAPTER_ID_CONFIGURATION_KEY,
  HostAdapterConfigurationResolver,
  HostConfiguredMissionWorkflow,
  NEXUS_CONFIGURATION_SECTION,
} from './host-adapter-configuration';
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
import type { HostMissionWorkflowPresentationOptions } from './host-mission-workflow';
import { HostMissionWorkflowCommandRegistration } from './host-mission-workflow-command-registration';
import type { HostAdapterOperationalMetadataProvider } from './host-operational-metadata';
import { StaticHostAdapterOperationalMetadataProvider } from './host-operational-metadata';

type RegisteredMissionWorkflow = Pick<
  HostMissionWorkflow,
  'runDeveloperMissionWorkflow' | 'showMissionWorkflowHistory'
>;

export interface VscodeHostOptions {
  readonly adapters?: readonly Adapter[];
  readonly missionWorkflowAdapterId?: string;
  readonly geminiCliMissionWorkflowAdapterId?: string;
  readonly codexCliMissionWorkflowAdapterId?: string;
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

class VscodeAdapterConfigurationSurface implements HostAdapterConfigurationSurface {
  public getDeveloperWorkflowDefaultAdapterId(): string | undefined {
    const value = vscode.workspace
      .getConfiguration(NEXUS_CONFIGURATION_SECTION)
      .get<unknown>(DEVELOPER_WORKFLOW_DEFAULT_ADAPTER_ID_CONFIGURATION_KEY);

    return typeof value === 'string' ? value : undefined;
  }
}

export class VscodeHost implements vscode.Disposable {
  private readonly outputChannel: vscode.OutputChannel;
  private readonly kernel: Kernel;
  private readonly logger: KernelLogger;
  private readonly ingress: HostIngressLayer;
  private readonly missionWorkflow: HostMissionWorkflow;
  private readonly geminiCliMissionWorkflow: HostMissionWorkflow | undefined;
  private readonly codexCliMissionWorkflow: HostMissionWorkflow | undefined;
  private readonly configuredAdapterMissionWorkflow: HostConfiguredMissionWorkflow;
  private readonly builderMissionWorkflow: HostConfiguredMissionWorkflow;
  private commandRegistrations: HostDisposable[] = [];

  public constructor(
    outputChannel: vscode.OutputChannel,
    kernel: Kernel,
    logger: KernelLogger,
    ingress: HostIngressLayer,
    missionWorkflow: HostMissionWorkflow,
    configuredAdapterMissionWorkflow: HostConfiguredMissionWorkflow,
    builderMissionWorkflow: HostConfiguredMissionWorkflow,
    geminiCliMissionWorkflow?: HostMissionWorkflow,
    codexCliMissionWorkflow?: HostMissionWorkflow,
  ) {
    this.outputChannel = outputChannel;
    this.kernel = kernel;
    this.logger = logger;
    this.ingress = ingress;
    this.missionWorkflow = missionWorkflow;
    this.configuredAdapterMissionWorkflow = configuredAdapterMissionWorkflow;
    this.builderMissionWorkflow = builderMissionWorkflow;
    this.geminiCliMissionWorkflow = geminiCliMissionWorkflow;
    this.codexCliMissionWorkflow = codexCliMissionWorkflow;
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
        createMissionWorkflowCommandOptions(
          this.geminiCliMissionWorkflow,
          this.codexCliMissionWorkflow,
          this.configuredAdapterMissionWorkflow,
          this.builderMissionWorkflow,
        ),
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
  const registeredAdapterIds = (options.adapters ?? []).map((adapter) => adapter.metadata.id.toString());
  const ingress = new HostIngressLayer(
    adapterService,
    operationalMetadataProvider,
    presentation,
    workspaceTrust,
  );
  const fallbackMissionWorkflowAdapterId = options.missionWorkflowAdapterId ?? 'mock-adapter';
  const missionWorkflow = createMissionWorkflow({
    adapterId: fallbackMissionWorkflowAdapterId,
    missionService,
    planningService,
    executionService,
    roleService,
    executionStrategyService,
    adapterService,
    evidenceService,
    reviewService,
    knowledgeService,
    presentation,
    workspaceTrust,
  });
  const configuredWorkflowAdapterIds = new Set([
    fallbackMissionWorkflowAdapterId,
    ...registeredAdapterIds,
  ]);
  const workflowsByAdapterId = new Map(
    [...configuredWorkflowAdapterIds].map((adapterId) => [
      adapterId,
      createMissionWorkflow({
        adapterId,
        missionService,
        planningService,
        executionService,
        roleService,
        executionStrategyService,
        adapterService,
        evidenceService,
        reviewService,
        knowledgeService,
        presentation,
        workspaceTrust,
      }),
    ]),
  );
  const configuredAdapterMissionWorkflow = new HostConfiguredMissionWorkflow(
    new HostAdapterConfigurationResolver(
      new VscodeAdapterConfigurationSurface(),
      registeredAdapterIds,
      fallbackMissionWorkflowAdapterId,
      presentation,
    ),
    workflowsByAdapterId,
  );
  const builderWorkflowsByAdapterId = new Map(
    [...configuredWorkflowAdapterIds].map((adapterId) => [
      adapterId,
      createMissionWorkflow({
        adapterId,
        roleId: 'builder',
        missionService,
        planningService,
        executionService,
        roleService,
        executionStrategyService,
        adapterService,
        evidenceService,
        reviewService,
        knowledgeService,
        presentation,
        workspaceTrust,
        presentationOptions: {
          workflowLabel: 'Builder Workflow',
          completionMessageLabel: 'Builder workflow',
          includeAssignedRole: true,
        },
      }),
    ]),
  );
  const builderMissionWorkflow = new HostConfiguredMissionWorkflow(
    new HostAdapterConfigurationResolver(
      new VscodeAdapterConfigurationSurface(),
      registeredAdapterIds,
      fallbackMissionWorkflowAdapterId,
      presentation,
    ),
    builderWorkflowsByAdapterId,
  );
  const geminiCliMissionWorkflow =
    options.geminiCliMissionWorkflowAdapterId === undefined
      ? undefined
      : createMissionWorkflow({
         adapterId: options.geminiCliMissionWorkflowAdapterId,
         missionService,
         planningService,
         executionService,
         roleService,
         executionStrategyService,
         adapterService,
         evidenceService,
         reviewService,
         knowledgeService,
         presentation,
         workspaceTrust,
        });
  const codexCliMissionWorkflow =
    options.codexCliMissionWorkflowAdapterId === undefined
      ? undefined
      : createMissionWorkflow({
         adapterId: options.codexCliMissionWorkflowAdapterId,
         missionService,
         planningService,
         executionService,
         roleService,
         executionStrategyService,
         adapterService,
         evidenceService,
         reviewService,
         knowledgeService,
         presentation,
         workspaceTrust,
        });

  return new VscodeHost(
    outputChannel,
    kernel,
    logger,
    ingress,
    missionWorkflow,
    configuredAdapterMissionWorkflow,
    builderMissionWorkflow,
    geminiCliMissionWorkflow,
    codexCliMissionWorkflow,
  );
}

function createMissionWorkflowCommandOptions(
  geminiCliWorkflow: RegisteredMissionWorkflow | undefined,
  codexCliWorkflow: RegisteredMissionWorkflow | undefined,
  configuredAdapterWorkflow: RegisteredMissionWorkflow,
  builderWorkflow: RegisteredMissionWorkflow,
): {
  readonly geminiCliWorkflow?: Pick<HostMissionWorkflow, 'runDeveloperMissionWorkflow'>;
  readonly codexCliWorkflow?: Pick<HostMissionWorkflow, 'runDeveloperMissionWorkflow'>;
  readonly configuredAdapterWorkflow: Pick<HostMissionWorkflow, 'runDeveloperMissionWorkflow'>;
  readonly builderWorkflow: Pick<HostMissionWorkflow, 'runDeveloperMissionWorkflow'>;
} {
  return {
    ...(geminiCliWorkflow === undefined ? {} : { geminiCliWorkflow }),
    ...(codexCliWorkflow === undefined ? {} : { codexCliWorkflow }),
    configuredAdapterWorkflow,
    builderWorkflow,
  };
}

function createMissionWorkflow(input: {
  readonly adapterId: string;
  readonly roleId?: string;
  readonly missionService: MissionService;
  readonly planningService: MissionPlanningService;
  readonly executionService: MissionExecutionService;
  readonly roleService: RoleService;
  readonly executionStrategyService: ExecutionStrategyService;
  readonly adapterService: AdapterService;
  readonly evidenceService: EvidenceService;
  readonly reviewService: ReviewService;
  readonly knowledgeService: KnowledgeService;
  readonly presentation: HostPresentationSurface;
  readonly workspaceTrust: HostWorkspaceTrustSurface;
  readonly presentationOptions?: HostMissionWorkflowPresentationOptions;
}): HostMissionWorkflow {
  return new HostMissionWorkflow(
    input.missionService,
    input.planningService,
    input.executionService,
    {
      roleService: input.roleService,
      executionStrategyService: input.executionStrategyService,
      adapterService: input.adapterService,
      adapterId: input.adapterId,
      requiredCapability: 'CodeModification',
      ...(input.roleId === undefined ? {} : { roleId: input.roleId }),
    },
    {
      evidenceService: input.evidenceService,
      reviewService: input.reviewService,
      knowledgeService: input.knowledgeService,
    },
    input.presentation,
    input.workspaceTrust,
    undefined,
    input.presentationOptions,
  );
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
