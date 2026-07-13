import type {
  HostCommandRegistry,
  HostDisposable,
  HostInputPrompt,
  HostInputSurface,
  HostPresentationSurface,
} from './host.contract';
import { HostMissionWorkflowError } from './host-mission-workflow.errors';
import type { HostMissionWorkflow, HostMissionWorkflowInput } from './host-mission-workflow';

type RegisteredMissionWorkflow = Pick<
  HostMissionWorkflow,
  'runDeveloperMissionWorkflow' | 'showMissionWorkflowHistory'
>;

export const HOST_RUN_DEVELOPER_MISSION_WORKFLOW_COMMAND = 'nexus.runDeveloperMissionWorkflow';
export const HOST_RUN_DEVELOPER_MISSION_WORKFLOW_WITH_GEMINI_CLI_COMMAND =
  'nexus.runDeveloperMissionWorkflowWithGeminiCli';
export const HOST_RUN_DEVELOPER_MISSION_WORKFLOW_WITH_CODEX_CLI_COMMAND =
  'nexus.runDeveloperMissionWorkflowWithCodexCli';
export const HOST_RUN_DEVELOPER_MISSION_WORKFLOW_WITH_CONFIGURED_ADAPTER_COMMAND =
  'nexus.runDeveloperMissionWorkflowWithConfiguredAdapter';
export const HOST_RUN_BUILDER_MISSION_WORKFLOW_COMMAND = 'nexus.runBuilderMissionWorkflow';
export const HOST_RUN_REVIEWER_MISSION_WORKFLOW_COMMAND = 'nexus.runReviewerMissionWorkflow';
export const HOST_SHOW_MISSION_WORKFLOW_HISTORY_COMMAND = 'nexus.showMissionWorkflowHistory';

export interface HostMissionWorkflowCommandRegistrationOptions {
  readonly geminiCliWorkflow?: Pick<HostMissionWorkflow, 'runDeveloperMissionWorkflow'>;
  readonly codexCliWorkflow?: Pick<HostMissionWorkflow, 'runDeveloperMissionWorkflow'>;
  readonly configuredAdapterWorkflow?: Pick<HostMissionWorkflow, 'runDeveloperMissionWorkflow'>;
  readonly builderWorkflow?: Pick<HostMissionWorkflow, 'runDeveloperMissionWorkflow'>;
  readonly reviewerWorkflow?: Pick<HostMissionWorkflow, 'runDeveloperMissionWorkflow'>;
}

export class HostMissionWorkflowCommandRegistration implements HostDisposable {
  private readonly registrations: readonly HostDisposable[];

  public constructor(
    commandRegistry: HostCommandRegistry,
    private readonly workflow: RegisteredMissionWorkflow,
    private readonly inputSurface: HostInputSurface,
    private readonly presentation: HostPresentationSurface,
    options: HostMissionWorkflowCommandRegistrationOptions = {},
  ) {
    const registrations = [
      commandRegistry.registerCommand(HOST_RUN_DEVELOPER_MISSION_WORKFLOW_COMMAND, async (input) =>
        this.workflow.runDeveloperMissionWorkflow(await this.normalizeWorkflowInput(input)),
      ),
      commandRegistry.registerCommand(HOST_SHOW_MISSION_WORKFLOW_HISTORY_COMMAND, () =>
        this.workflow.showMissionWorkflowHistory(),
      ),
    ];

    const geminiCliWorkflow = options.geminiCliWorkflow;

    if (geminiCliWorkflow !== undefined) {
      registrations.push(
        commandRegistry.registerCommand(
          HOST_RUN_DEVELOPER_MISSION_WORKFLOW_WITH_GEMINI_CLI_COMMAND,
          async (input) =>
            geminiCliWorkflow.runDeveloperMissionWorkflow(
              await this.normalizeWorkflowInput(input),
            ),
        ),
      );
    }

    const codexCliWorkflow = options.codexCliWorkflow;

    if (codexCliWorkflow !== undefined) {
      registrations.push(
        commandRegistry.registerCommand(
          HOST_RUN_DEVELOPER_MISSION_WORKFLOW_WITH_CODEX_CLI_COMMAND,
          async (input) =>
            codexCliWorkflow.runDeveloperMissionWorkflow(await this.normalizeWorkflowInput(input)),
        ),
      );
    }

    const configuredAdapterWorkflow = options.configuredAdapterWorkflow;

    if (configuredAdapterWorkflow !== undefined) {
      registrations.push(
        commandRegistry.registerCommand(
          HOST_RUN_DEVELOPER_MISSION_WORKFLOW_WITH_CONFIGURED_ADAPTER_COMMAND,
          async (input) =>
            configuredAdapterWorkflow.runDeveloperMissionWorkflow(
              await this.normalizeWorkflowInput(input),
            ),
        ),
      );
    }

    const builderWorkflow = options.builderWorkflow;

    if (builderWorkflow !== undefined) {
      registrations.push(
        commandRegistry.registerCommand(HOST_RUN_BUILDER_MISSION_WORKFLOW_COMMAND, async (input) =>
          builderWorkflow.runDeveloperMissionWorkflow(await this.normalizeWorkflowInput(input)),
        ),
      );
    }

    const reviewerWorkflow = options.reviewerWorkflow;

    if (reviewerWorkflow !== undefined) {
      registrations.push(
        commandRegistry.registerCommand(HOST_RUN_REVIEWER_MISSION_WORKFLOW_COMMAND, async (input) =>
          reviewerWorkflow.runDeveloperMissionWorkflow(await this.normalizeWorkflowInput(input)),
        ),
      );
    }

    this.registrations = Object.freeze(registrations);
  }

  public dispose(): void {
    for (const registration of this.registrations) {
      registration.dispose();
    }
  }

  private async normalizeWorkflowInput(input: unknown): Promise<HostMissionWorkflowInput> {
    if (isRecord(input)) {
      return {
        objective: typeof input.objective === 'string' ? input.objective : '',
        taskTitle: typeof input.taskTitle === 'string' ? input.taskTitle : '',
        taskDescription: typeof input.taskDescription === 'string' ? input.taskDescription : '',
        ...(isStringRecord(input.adapterExecutionConstraints)
          ? { adapterExecutionConstraints: input.adapterExecutionConstraints }
          : {}),
      };
    }

    return {
      objective: await this.readRequiredInput({ prompt: 'Mission Objective' }),
      taskTitle: await this.readRequiredInput({ prompt: 'Task Title' }),
      taskDescription: await this.readRequiredInput({ prompt: 'Task Description' }),
    };
  }

  private async readRequiredInput(prompt: HostInputPrompt): Promise<string> {
    const value = await this.inputSurface.showInputBox(prompt);

    if (value === undefined) {
      return this.failInputCancelled(prompt.prompt);
    }

    return value;
  }

  private async failInputCancelled(prompt: string): Promise<never> {
    const message = `Mission workflow input cancelled while reading ${prompt}.`;

    this.presentation.appendLine(`Host Diagnostic host-mission-workflow.input-cancelled: ${message}`);
    await this.presentation.showErrorMessage(`Nexus Mission workflow input cancelled: ${message}`);

    throw new HostMissionWorkflowError('host-mission-workflow.input-cancelled', message);
  }
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringRecord(value: unknown): value is Readonly<Record<string, string>> {
  return isRecord(value) && Object.values(value).every((entry) => typeof entry === 'string');
}
