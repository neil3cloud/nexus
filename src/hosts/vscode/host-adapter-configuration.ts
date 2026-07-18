import type { HostPresentationSurface } from './host.contract';
import type {
  HostMissionWorkflow,
  HostMissionWorkflowHistoryEntry,
  HostMissionWorkflowInput,
  HostMissionWorkflowResult,
} from './host-mission-workflow';
import { HostMissionWorkflowError } from './host-mission-workflow.errors';

export const NEXUS_CONFIGURATION_SECTION = 'nexus';
export const DEVELOPER_WORKFLOW_DEFAULT_ADAPTER_ID_CONFIGURATION_KEY =
  'developerWorkflow.defaultAdapterId';
export const DEVELOPER_WORKFLOW_DEFAULT_ADAPTER_ID_CONFIGURATION_ID =
  `${NEXUS_CONFIGURATION_SECTION}.${DEVELOPER_WORKFLOW_DEFAULT_ADAPTER_ID_CONFIGURATION_KEY}`;

export interface HostAdapterConfigurationSurface {
  getDeveloperWorkflowDefaultAdapterId(): string | undefined;
}

export class HostAdapterConfigurationResolver {
  private readonly registeredAdapterIds: ReadonlySet<string>;

  public constructor(
    private readonly configuration: HostAdapterConfigurationSurface,
    registeredAdapterIds: Iterable<string>,
    private readonly fallbackAdapterId: string,
    private readonly presentation: Pick<HostPresentationSurface, 'appendLine'>,
  ) {
    this.registeredAdapterIds = new Set([...registeredAdapterIds].map((adapterId) => adapterId.trim()));
  }

  public resolveDeveloperWorkflowAdapterId(): string {
    const configuredAdapterId = normalizeAdapterId(
      this.configuration.getDeveloperWorkflowDefaultAdapterId(),
    );
    const adapterId = configuredAdapterId ?? this.fallbackAdapterId;

    if (!this.registeredAdapterIds.has(adapterId)) {
      const message = `Configured Developer Workflow adapter '${adapterId}' is not registered with the Host.`;

      this.presentation.appendLine(
        `Host Diagnostic host-adapter-configuration.unknown-adapter-id: ${message}`,
      );
      throw new HostMissionWorkflowError(
        'host-adapter-configuration.unknown-adapter-id',
        message,
      );
    }

    this.presentation.appendLine(`Developer Workflow Adapter Configuration: ${adapterId}`);

    return adapterId;
  }
}

export class HostConfiguredMissionWorkflow {
  public constructor(
    private readonly resolver: Pick<
      HostAdapterConfigurationResolver,
      'resolveDeveloperWorkflowAdapterId'
    >,
    private readonly workflowsByAdapterId: ReadonlyMap<
      string,
      Pick<HostMissionWorkflow, 'runDeveloperMissionWorkflow' | 'showMissionWorkflowHistory'>
    >,
  ) {}

  public async runDeveloperMissionWorkflow(
    input: HostMissionWorkflowInput,
  ): Promise<HostMissionWorkflowResult> {
    const adapterId = this.resolver.resolveDeveloperWorkflowAdapterId();
    const workflow = this.workflowsByAdapterId.get(adapterId);

    if (workflow === undefined) {
      throw new HostMissionWorkflowError(
        'host-adapter-configuration.workflow-not-registered',
        `Configured Developer Workflow adapter '${adapterId}' does not have a Host workflow.`,
      );
    }

    return workflow.runDeveloperMissionWorkflow(input);
  }

  public showMissionWorkflowHistory(): readonly HostMissionWorkflowHistoryEntry[] {
    return Object.freeze(
      [...this.workflowsByAdapterId.values()].flatMap((workflow) =>
        workflow.showMissionWorkflowHistory(),
      ),
    );
  }
}

function normalizeAdapterId(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalized = value.trim();

  return normalized.length === 0 ? undefined : normalized;
}
