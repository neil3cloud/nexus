import { describe, expect, it } from 'vitest';

import { CODEX_CLI_ADAPTER_ID } from '../../../src/adapters/codex/codex-cli-adapter';
import { MOCK_ADAPTER_ID } from '../../../src/adapters/mock/mock-adapter';
import type {
  HostCommandHandler,
  HostCommandRegistry,
  HostDisposable,
  HostInputSurface,
  HostPresentationSurface,
  HostProgressOptions,
} from '../../../src/hosts/vscode/host.contract';
import type {
  HostMissionWorkflowHistoryEntry,
  HostMissionWorkflowInput,
  HostMissionWorkflowResult,
} from '../../../src/hosts/vscode/host-mission-workflow';
import {
  HOST_RUN_DEVELOPER_MISSION_WORKFLOW_COMMAND,
  HOST_RUN_DEVELOPER_MISSION_WORKFLOW_WITH_CODEX_CLI_COMMAND,
  HOST_SHOW_MISSION_WORKFLOW_HISTORY_COMMAND,
  HostMissionWorkflowCommandRegistration,
} from '../../../src/hosts/vscode/host-mission-workflow-command-registration';

describe('HostMissionWorkflowCommandRegistration Codex CLI command', () => {
  it('registers a third Developer Workflow command without changing the MockAdapter command', async () => {
    const registry = new RecordingCommandRegistry();
    const mockWorkflow = new RecordingWorkflow(MOCK_ADAPTER_ID);
    const codexWorkflow = new RecordingWorkflow(CODEX_CLI_ADAPTER_ID);

    new HostMissionWorkflowCommandRegistration(
      registry,
      mockWorkflow,
      new EmptyInputSurface(),
      new SilentPresentationSurface(),
      { codexCliWorkflow: codexWorkflow },
    );

    expect(registry.commands).toEqual([
      HOST_RUN_DEVELOPER_MISSION_WORKFLOW_COMMAND,
      HOST_SHOW_MISSION_WORKFLOW_HISTORY_COMMAND,
      HOST_RUN_DEVELOPER_MISSION_WORKFLOW_WITH_CODEX_CLI_COMMAND,
    ]);

    await expect(
      registry.invoke(HOST_RUN_DEVELOPER_MISSION_WORKFLOW_COMMAND, {
        objective: 'Run through MockAdapter.',
        taskTitle: 'Mock task',
        taskDescription: 'Preserve the deterministic baseline.',
      }),
    ).resolves.toMatchObject({ adapterId: MOCK_ADAPTER_ID });
    await expect(
      registry.invoke(HOST_RUN_DEVELOPER_MISSION_WORKFLOW_WITH_CODEX_CLI_COMMAND, {
        objective: 'Run through CodexCliAdapter.',
        taskTitle: 'Codex task',
        taskDescription: 'Exercise the production adapter path.',
        adapterExecutionConstraints: {
          'codexCliAdapter.testDoubleResult': 'Completed',
        },
      }),
    ).resolves.toMatchObject({ adapterId: CODEX_CLI_ADAPTER_ID });

    expect(mockWorkflow.inputs).toEqual([
      {
        objective: 'Run through MockAdapter.',
        taskTitle: 'Mock task',
        taskDescription: 'Preserve the deterministic baseline.',
      },
    ]);
    expect(codexWorkflow.inputs).toEqual([
      {
        objective: 'Run through CodexCliAdapter.',
        taskTitle: 'Codex task',
        taskDescription: 'Exercise the production adapter path.',
        adapterExecutionConstraints: {
          'codexCliAdapter.testDoubleResult': 'Completed',
        },
      },
    ]);
  });
});

class RecordingWorkflow {
  public readonly inputs: HostMissionWorkflowInput[] = [];

  public constructor(private readonly adapterId: string) {}

  public async runDeveloperMissionWorkflow(
    input: HostMissionWorkflowInput,
  ): Promise<HostMissionWorkflowResult> {
    this.inputs.push(input);

    return {
      missionId: `mission-${this.adapterId}`,
      missionPlanId: `mission-plan-${this.adapterId}`,
      taskId: `task-${this.adapterId}`,
      finalStatus: 'Completed',
      missionPlanRevision: 3,
      taskStatus: 'Completed',
      adapterId: this.adapterId,
      adapterDispatchStatus: 'Completed',
      reviewOutcome: 'Accepted',
      knowledgeCaptureStatus: 'Candidate',
      knowledge: {
        id: `knowledge-${this.adapterId}`,
        missionId: `mission-${this.adapterId}`,
        missionPlanRevisionId: 'revision-3',
        summary: 'Deterministic command-registration test knowledge.',
        scope: 'Repository',
        status: 'Candidate',
        supportingEvidenceIds: [`evidence-${this.adapterId}`],
        supportingReviewId: `review-${this.adapterId}`,
        contributingEventIds: [`domain-event-mission-${this.adapterId}-completion`],
        approvingAuthority: 'Sprint 32 Codex CLI command registration test',
        attribution: {
          missionId: `mission-${this.adapterId}`,
          missionPlanRevisionId: 'revision-3',
          supportingEvidenceIds: [`evidence-${this.adapterId}`],
          supportingReviewId: `review-${this.adapterId}`,
          contributingEventIds: [`domain-event-mission-${this.adapterId}-completion`],
          approvingAuthority: 'Sprint 32 Codex CLI command registration test',
        },
        provenance: {
          evidenceLineage: [`evidence-${this.adapterId}`],
          reviewLineage: `review-${this.adapterId}`,
          missionLineage: {
            missionId: `mission-${this.adapterId}`,
            missionPlanRevisionId: 'revision-3',
          },
          approvalLineage: 'Sprint 32 Codex CLI command registration test',
        },
        revisions: [],
      },
    };
  }

  public showMissionWorkflowHistory(): readonly HostMissionWorkflowHistoryEntry[] {
    return [];
  }
}

class RecordingCommandRegistry implements HostCommandRegistry {
  public readonly commands: string[] = [];
  private readonly handlers = new Map<string, HostCommandHandler>();

  public registerCommand(command: string, handler: HostCommandHandler): HostDisposable {
    this.commands.push(command);
    this.handlers.set(command, handler);

    return {
      dispose: () => {},
    };
  }

  public async invoke(command: string, input: unknown): Promise<unknown> {
    const handler = this.handlers.get(command);

    if (handler === undefined) {
      throw new Error(`Command '${command}' was not registered.`);
    }

    return handler(input);
  }
}

class EmptyInputSurface implements HostInputSurface {
  public async showInputBox(): Promise<string | undefined> {
    return undefined;
  }
}

class SilentPresentationSurface implements HostPresentationSurface {
  public appendLine(): void {}

  public async showInformationMessage(): Promise<void> {}

  public async showErrorMessage(): Promise<void> {}

  public async withProgress<T>(_: HostProgressOptions, operation: () => Promise<T>): Promise<T> {
    return operation();
  }
}
