import type {
  HostCommandRegistry,
  HostDisposable,
  HostInputPrompt,
  HostInputSurface,
  HostPresentationSurface,
} from './host.contract';
import { HostMissionWorkflowError } from './host-mission-workflow.errors';
import type { HostMissionWorkflow, HostMissionWorkflowInput } from './host-mission-workflow';

export const HOST_RUN_DEVELOPER_MISSION_WORKFLOW_COMMAND = 'nexus.runDeveloperMissionWorkflow';
export const HOST_SHOW_MISSION_WORKFLOW_HISTORY_COMMAND = 'nexus.showMissionWorkflowHistory';

export class HostMissionWorkflowCommandRegistration implements HostDisposable {
  private readonly registrations: readonly HostDisposable[];

  public constructor(
    commandRegistry: HostCommandRegistry,
    private readonly workflow: HostMissionWorkflow,
    private readonly inputSurface: HostInputSurface,
    private readonly presentation: HostPresentationSurface,
  ) {
    this.registrations = Object.freeze([
      commandRegistry.registerCommand(HOST_RUN_DEVELOPER_MISSION_WORKFLOW_COMMAND, async (input) =>
        this.workflow.runDeveloperMissionWorkflow(await this.normalizeWorkflowInput(input)),
      ),
      commandRegistry.registerCommand(HOST_SHOW_MISSION_WORKFLOW_HISTORY_COMMAND, () =>
        this.workflow.showMissionWorkflowHistory(),
      ),
    ]);
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
