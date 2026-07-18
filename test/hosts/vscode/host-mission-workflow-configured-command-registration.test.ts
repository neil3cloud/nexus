import { describe, expect, it } from 'vitest';

import { GEMINI_CLI_ADAPTER_ID } from '../../../src/adapters/gemini/gemini-cli-adapter';
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
  HOST_RUN_BUILDER_MISSION_WORKFLOW_COMMAND,
  HOST_RUN_DEVELOPER_MISSION_WORKFLOW_COMMAND,
  HOST_RUN_DEVELOPER_MISSION_WORKFLOW_WITH_CONFIGURED_ADAPTER_COMMAND,
  HOST_RUN_DOCUMENTATION_REVIEWER_MISSION_WORKFLOW_COMMAND,
  HOST_RUN_REVIEWER_MISSION_WORKFLOW_COMMAND,
  HOST_SHOW_MISSION_WORKFLOW_HISTORY_COMMAND,
  HostMissionWorkflowCommandRegistration,
} from '../../../src/hosts/vscode/host-mission-workflow-command-registration';
import { HostMissionWorkflowError } from '../../../src/hosts/vscode/host-mission-workflow.errors';

describe('HostMissionWorkflowCommandRegistration configured adapter command', () => {
  it('registers an additive configured-adapter command without changing the MockAdapter command', async () => {
    const registry = new RecordingCommandRegistry();
    const mockWorkflow = new RecordingWorkflow(MOCK_ADAPTER_ID);
    const configuredWorkflow = new RecordingWorkflow(GEMINI_CLI_ADAPTER_ID);

    new HostMissionWorkflowCommandRegistration(
      registry,
      mockWorkflow,
      new EmptyInputSurface(),
      new SilentPresentationSurface(),
      { configuredAdapterWorkflow: configuredWorkflow },
    );

    expect(registry.commands).toEqual([
      HOST_RUN_DEVELOPER_MISSION_WORKFLOW_COMMAND,
      HOST_SHOW_MISSION_WORKFLOW_HISTORY_COMMAND,
      HOST_RUN_DEVELOPER_MISSION_WORKFLOW_WITH_CONFIGURED_ADAPTER_COMMAND,
    ]);

    await expect(
      registry.invoke(HOST_RUN_DEVELOPER_MISSION_WORKFLOW_COMMAND, {
        objective: 'Run through MockAdapter.',
        taskTitle: 'Mock task',
        taskDescription: 'Preserve the deterministic baseline.',
      }),
    ).resolves.toMatchObject({ adapterId: MOCK_ADAPTER_ID });
    await expect(
      registry.invoke(HOST_RUN_DEVELOPER_MISSION_WORKFLOW_WITH_CONFIGURED_ADAPTER_COMMAND, {
        objective: 'Run through configured adapter.',
        taskTitle: 'Configured task',
        taskDescription: 'Exercise the additive configured adapter path.',
      }),
    ).resolves.toMatchObject({ adapterId: GEMINI_CLI_ADAPTER_ID });

    expect(mockWorkflow.inputs).toEqual([
      {
        objective: 'Run through MockAdapter.',
        taskTitle: 'Mock task',
        taskDescription: 'Preserve the deterministic baseline.',
      },
    ]);
    expect(configuredWorkflow.inputs).toEqual([
      {
        objective: 'Run through configured adapter.',
        taskTitle: 'Configured task',
        taskDescription: 'Exercise the additive configured adapter path.',
      },
    ]);
  });

  it('registers the additive Builder Workflow command through configured adapter resolution', async () => {
    const registry = new RecordingCommandRegistry();
    const mockWorkflow = new RecordingWorkflow(MOCK_ADAPTER_ID);
    const configuredWorkflow = new RecordingWorkflow(GEMINI_CLI_ADAPTER_ID);
    const builderWorkflow = new RecordingWorkflow(GEMINI_CLI_ADAPTER_ID, {
      assignedRoleId: 'builder',
      assignedRoleName: 'Builder',
    });

    new HostMissionWorkflowCommandRegistration(
      registry,
      mockWorkflow,
      new EmptyInputSurface(),
      new SilentPresentationSurface(),
      { configuredAdapterWorkflow: configuredWorkflow, builderWorkflow },
    );

    expect(registry.commands).toEqual([
      HOST_RUN_DEVELOPER_MISSION_WORKFLOW_COMMAND,
      HOST_SHOW_MISSION_WORKFLOW_HISTORY_COMMAND,
      HOST_RUN_DEVELOPER_MISSION_WORKFLOW_WITH_CONFIGURED_ADAPTER_COMMAND,
      HOST_RUN_BUILDER_MISSION_WORKFLOW_COMMAND,
    ]);

    await expect(
      registry.invoke(HOST_RUN_BUILDER_MISSION_WORKFLOW_COMMAND, {
        objective: 'Run the Builder Workflow.',
        taskTitle: 'Builder task',
        taskDescription: 'Exercise the additive Builder Workflow path.',
      }),
    ).resolves.toMatchObject({
      adapterId: GEMINI_CLI_ADAPTER_ID,
      assignedRoleId: 'builder',
      assignedRoleName: 'Builder',
    });
    expect(mockWorkflow.inputs).toEqual([]);
    expect(configuredWorkflow.inputs).toEqual([]);
    expect(builderWorkflow.inputs).toEqual([
      {
        objective: 'Run the Builder Workflow.',
        taskTitle: 'Builder task',
        taskDescription: 'Exercise the additive Builder Workflow path.',
      },
    ]);
  });

  it('aborts the Builder Workflow command deterministically on input cancellation', async () => {
    const registry = new RecordingCommandRegistry();
    const builderWorkflow = new RecordingWorkflow(GEMINI_CLI_ADAPTER_ID);
    const presentation = new RecordingPresentationSurface();

    new HostMissionWorkflowCommandRegistration(
      registry,
      new RecordingWorkflow(MOCK_ADAPTER_ID),
      new EmptyInputSurface(),
      presentation,
      { builderWorkflow },
    );

    await expect(registry.invoke(HOST_RUN_BUILDER_MISSION_WORKFLOW_COMMAND)).rejects.toMatchObject({
      code: 'host-mission-workflow.input-cancelled',
    } satisfies Partial<HostMissionWorkflowError>);
    expect(builderWorkflow.inputs).toEqual([]);
    expect(presentation.lines).toContain(
      'Host Diagnostic host-mission-workflow.input-cancelled: Mission workflow input cancelled while reading Mission Objective.',
    );
  });

  it('registers the additive Reviewer Workflow command through configured adapter resolution', async () => {
    const registry = new RecordingCommandRegistry();
    const reviewerWorkflow = new RecordingWorkflow(GEMINI_CLI_ADAPTER_ID, {
      assignedRoleId: 'reviewer',
      assignedRoleName: 'Reviewer',
    });

    new HostMissionWorkflowCommandRegistration(
      registry,
      new RecordingWorkflow(MOCK_ADAPTER_ID),
      new EmptyInputSurface(),
      new SilentPresentationSurface(),
      { reviewerWorkflow },
    );

    expect(registry.commands).toEqual([
      HOST_RUN_DEVELOPER_MISSION_WORKFLOW_COMMAND,
      HOST_SHOW_MISSION_WORKFLOW_HISTORY_COMMAND,
      HOST_RUN_REVIEWER_MISSION_WORKFLOW_COMMAND,
    ]);

    await expect(
      registry.invoke(HOST_RUN_REVIEWER_MISSION_WORKFLOW_COMMAND, {
        objective: 'Run the Reviewer Workflow.',
        taskTitle: 'Reviewer task',
        taskDescription: 'Exercise the additive Reviewer Workflow path.',
      }),
    ).resolves.toMatchObject({
      adapterId: GEMINI_CLI_ADAPTER_ID,
      assignedRoleId: 'reviewer',
      assignedRoleName: 'Reviewer',
    });
    expect(reviewerWorkflow.inputs).toEqual([
      {
        objective: 'Run the Reviewer Workflow.',
        taskTitle: 'Reviewer task',
        taskDescription: 'Exercise the additive Reviewer Workflow path.',
      },
    ]);
  });

  it('aborts the Reviewer Workflow command deterministically on input cancellation', async () => {
    const registry = new RecordingCommandRegistry();
    const reviewerWorkflow = new RecordingWorkflow(GEMINI_CLI_ADAPTER_ID);
    const presentation = new RecordingPresentationSurface();

    new HostMissionWorkflowCommandRegistration(
      registry,
      new RecordingWorkflow(MOCK_ADAPTER_ID),
      new EmptyInputSurface(),
      presentation,
      { reviewerWorkflow },
    );

    await expect(registry.invoke(HOST_RUN_REVIEWER_MISSION_WORKFLOW_COMMAND)).rejects.toMatchObject({
      code: 'host-mission-workflow.input-cancelled',
    } satisfies Partial<HostMissionWorkflowError>);
    expect(reviewerWorkflow.inputs).toEqual([]);
    expect(presentation.lines).toContain(
      'Host Diagnostic host-mission-workflow.input-cancelled: Mission workflow input cancelled while reading Mission Objective.',
    );
  });

  it('registers the additive Documentation Reviewer Workflow command through configured adapter resolution', async () => {
    const registry = new RecordingCommandRegistry();
    const documentationReviewerWorkflow = new RecordingWorkflow(GEMINI_CLI_ADAPTER_ID, {
      assignedRoleId: 'documentation-reviewer',
      assignedRoleName: 'Documentation Reviewer',
    });

    new HostMissionWorkflowCommandRegistration(
      registry,
      new RecordingWorkflow(MOCK_ADAPTER_ID),
      new EmptyInputSurface(),
      new SilentPresentationSurface(),
      { documentationReviewerWorkflow },
    );

    expect(registry.commands).toEqual([
      HOST_RUN_DEVELOPER_MISSION_WORKFLOW_COMMAND,
      HOST_SHOW_MISSION_WORKFLOW_HISTORY_COMMAND,
      HOST_RUN_DOCUMENTATION_REVIEWER_MISSION_WORKFLOW_COMMAND,
    ]);

    await expect(
      registry.invoke(HOST_RUN_DOCUMENTATION_REVIEWER_MISSION_WORKFLOW_COMMAND, {
        objective: 'Run the Documentation Reviewer Workflow.',
        taskTitle: 'Documentation reviewer task',
        taskDescription: 'Exercise the additive Documentation Reviewer Workflow path.',
      }),
    ).resolves.toMatchObject({
      adapterId: GEMINI_CLI_ADAPTER_ID,
      assignedRoleId: 'documentation-reviewer',
      assignedRoleName: 'Documentation Reviewer',
    });
    expect(documentationReviewerWorkflow.inputs).toEqual([
      {
        objective: 'Run the Documentation Reviewer Workflow.',
        taskTitle: 'Documentation reviewer task',
        taskDescription: 'Exercise the additive Documentation Reviewer Workflow path.',
      },
    ]);
  });

  it('aborts the Documentation Reviewer Workflow command deterministically on input cancellation', async () => {
    const registry = new RecordingCommandRegistry();
    const documentationReviewerWorkflow = new RecordingWorkflow(GEMINI_CLI_ADAPTER_ID);
    const presentation = new RecordingPresentationSurface();

    new HostMissionWorkflowCommandRegistration(
      registry,
      new RecordingWorkflow(MOCK_ADAPTER_ID),
      new EmptyInputSurface(),
      presentation,
      { documentationReviewerWorkflow },
    );

    await expect(
      registry.invoke(HOST_RUN_DOCUMENTATION_REVIEWER_MISSION_WORKFLOW_COMMAND),
    ).rejects.toMatchObject({
      code: 'host-mission-workflow.input-cancelled',
    } satisfies Partial<HostMissionWorkflowError>);
    expect(documentationReviewerWorkflow.inputs).toEqual([]);
    expect(presentation.lines).toContain(
      'Host Diagnostic host-mission-workflow.input-cancelled: Mission workflow input cancelled while reading Mission Objective.',
    );
  });
});

class RecordingWorkflow {
  public readonly inputs: HostMissionWorkflowInput[] = [];

  public constructor(
    private readonly adapterId: string,
    private readonly roleAssignment: Pick<
      HostMissionWorkflowResult,
      'assignedRoleId' | 'assignedRoleName'
    > = {},
  ) {}

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
      ...this.roleAssignment,
      adapterId: this.adapterId,
      adapterDispatchStatus: 'Completed',
      reviewOutcome: 'Accepted',
      knowledgeCaptureStatus: 'Candidate',
      knowledge: {
        id: `knowledge-${this.adapterId}`,
        missionId: `mission-${this.adapterId}`,
        missionPlanRevisionId: 'revision-3',
        summary: 'Deterministic configured command-registration test knowledge.',
        scope: 'Repository',
        status: 'Candidate',
        supportingEvidenceIds: [`evidence-${this.adapterId}`],
        supportingReviewId: `review-${this.adapterId}`,
        contributingEventIds: [`domain-event-mission-${this.adapterId}-completion`],
        approvingAuthority: 'Sprint 33 configured adapter command registration test',
        attribution: {
          missionId: `mission-${this.adapterId}`,
          missionPlanRevisionId: 'revision-3',
          supportingEvidenceIds: [`evidence-${this.adapterId}`],
          supportingReviewId: `review-${this.adapterId}`,
          contributingEventIds: [`domain-event-mission-${this.adapterId}-completion`],
          approvingAuthority: 'Sprint 33 configured adapter command registration test',
        },
        provenance: {
          evidenceLineage: [`evidence-${this.adapterId}`],
          reviewLineage: `review-${this.adapterId}`,
          missionLineage: {
            missionId: `mission-${this.adapterId}`,
            missionPlanRevisionId: 'revision-3',
          },
          approvalLineage: 'Sprint 33 configured adapter command registration test',
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

  public async invoke(command: string, input?: unknown): Promise<unknown> {
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

class RecordingPresentationSurface implements HostPresentationSurface {
  public readonly lines: string[] = [];

  public appendLine(message: string): void {
    this.lines.push(message);
  }

  public async showInformationMessage(): Promise<void> {}

  public async showErrorMessage(): Promise<void> {}

  public async withProgress<T>(_: HostProgressOptions, operation: () => Promise<T>): Promise<T> {
    return operation();
  }
}
