import { describe, expect, it } from 'vitest';

import { CODEX_CLI_ADAPTER_ID } from '../../../src/adapters/codex/codex-cli-adapter';
import { GEMINI_CLI_ADAPTER_ID } from '../../../src/adapters/gemini/gemini-cli-adapter';
import { MOCK_ADAPTER_ID } from '../../../src/adapters/mock/mock-adapter';
import type {
  HostPresentationSurface,
  HostProgressOptions,
} from '../../../src/hosts/vscode/host.contract';
import {
  HostAdapterConfigurationResolver,
  HostConfiguredMissionWorkflow,
  type HostAdapterConfigurationSurface,
} from '../../../src/hosts/vscode/host-adapter-configuration';
import type {
  HostMissionWorkflowHistoryEntry,
  HostMissionWorkflowInput,
  HostMissionWorkflowResult,
} from '../../../src/hosts/vscode/host-mission-workflow';
import { HostMissionWorkflowError } from '../../../src/hosts/vscode/host-mission-workflow.errors';

describe('HostAdapterConfigurationResolver', () => {
  it('resolves a configured Developer Workflow adapter identifier', () => {
    const presentation = new RecordingPresentationSurface();
    const resolver = new HostAdapterConfigurationResolver(
      new StaticAdapterConfigurationSurface(GEMINI_CLI_ADAPTER_ID),
      [MOCK_ADAPTER_ID, GEMINI_CLI_ADAPTER_ID, CODEX_CLI_ADAPTER_ID],
      MOCK_ADAPTER_ID,
      presentation,
    );

    expect(resolver.resolveDeveloperWorkflowAdapterId()).toBe(GEMINI_CLI_ADAPTER_ID);
    expect(presentation.lines).toContain(
      `Developer Workflow Adapter Configuration: ${GEMINI_CLI_ADAPTER_ID}`,
    );
  });

  it('falls back to the certified MockAdapter command behavior when no default is configured', () => {
    const resolver = new HostAdapterConfigurationResolver(
      new StaticAdapterConfigurationSurface(undefined),
      [MOCK_ADAPTER_ID, GEMINI_CLI_ADAPTER_ID, CODEX_CLI_ADAPTER_ID],
      MOCK_ADAPTER_ID,
      new RecordingPresentationSurface(),
    );

    expect(resolver.resolveDeveloperWorkflowAdapterId()).toBe(MOCK_ADAPTER_ID);
  });

  it('rejects an unknown configured adapter identifier before invoking a workflow', () => {
    const presentation = new RecordingPresentationSurface();
    const resolver = new HostAdapterConfigurationResolver(
      new StaticAdapterConfigurationSurface('unknown-adapter'),
      [MOCK_ADAPTER_ID, GEMINI_CLI_ADAPTER_ID, CODEX_CLI_ADAPTER_ID],
      MOCK_ADAPTER_ID,
      presentation,
    );

    expect(() => resolver.resolveDeveloperWorkflowAdapterId()).toThrow(
      HostMissionWorkflowError,
    );
    expect(() => resolver.resolveDeveloperWorkflowAdapterId()).toThrow(
      "Configured Developer Workflow adapter 'unknown-adapter' is not registered with the Host.",
    );
    expect(presentation.lines).toContain(
      "Host Diagnostic host-adapter-configuration.unknown-adapter-id: Configured Developer Workflow adapter 'unknown-adapter' is not registered with the Host.",
    );
  });
});

describe('HostConfiguredMissionWorkflow', () => {
  it('dispatches the additive configured-adapter workflow through the configured adapter', async () => {
    const geminiWorkflow = new RecordingWorkflow(GEMINI_CLI_ADAPTER_ID);
    const configuredWorkflow = new HostConfiguredMissionWorkflow(
      new HostAdapterConfigurationResolver(
        new StaticAdapterConfigurationSurface(GEMINI_CLI_ADAPTER_ID),
        [MOCK_ADAPTER_ID, GEMINI_CLI_ADAPTER_ID],
        MOCK_ADAPTER_ID,
        new RecordingPresentationSurface(),
      ),
      new Map([
        [MOCK_ADAPTER_ID, new RecordingWorkflow(MOCK_ADAPTER_ID)],
        [GEMINI_CLI_ADAPTER_ID, geminiWorkflow],
      ]),
    );

    await expect(
      configuredWorkflow.runDeveloperMissionWorkflow({
        objective: 'Run through configured GeminiCliAdapter.',
        taskTitle: 'Configured task',
        taskDescription: 'Resolve adapterId in the Host before invoking the Kernel.',
      }),
    ).resolves.toMatchObject({ adapterId: GEMINI_CLI_ADAPTER_ID });
    expect(geminiWorkflow.inputs).toEqual([
      {
        objective: 'Run through configured GeminiCliAdapter.',
        taskTitle: 'Configured task',
        taskDescription: 'Resolve adapterId in the Host before invoking the Kernel.',
      },
    ]);
  });

  it('uses the configured-adapter fallback workflow when the configured default is absent', async () => {
    const mockWorkflow = new RecordingWorkflow(MOCK_ADAPTER_ID);
    const configuredWorkflow = new HostConfiguredMissionWorkflow(
      new HostAdapterConfigurationResolver(
        new StaticAdapterConfigurationSurface(undefined),
        [MOCK_ADAPTER_ID, GEMINI_CLI_ADAPTER_ID],
        MOCK_ADAPTER_ID,
        new RecordingPresentationSurface(),
      ),
      new Map([
        [MOCK_ADAPTER_ID, mockWorkflow],
        [GEMINI_CLI_ADAPTER_ID, new RecordingWorkflow(GEMINI_CLI_ADAPTER_ID)],
      ]),
    );

    await expect(
      configuredWorkflow.runDeveloperMissionWorkflow({
        objective: 'Run through fallback MockAdapter.',
        taskTitle: 'Fallback task',
        taskDescription: 'Preserve deterministic configured-adapter fallback behavior.',
      }),
    ).resolves.toMatchObject({ adapterId: MOCK_ADAPTER_ID });
    expect(mockWorkflow.inputs).toHaveLength(1);
  });

  it('does not invoke any workflow when the configured adapter is unknown', async () => {
    const mockWorkflow = new RecordingWorkflow(MOCK_ADAPTER_ID);
    const configuredWorkflow = new HostConfiguredMissionWorkflow(
      new HostAdapterConfigurationResolver(
        new StaticAdapterConfigurationSurface('unknown-adapter'),
        [MOCK_ADAPTER_ID],
        MOCK_ADAPTER_ID,
        new RecordingPresentationSurface(),
      ),
      new Map([[MOCK_ADAPTER_ID, mockWorkflow]]),
    );

    await expect(
      configuredWorkflow.runDeveloperMissionWorkflow({
        objective: 'Reject unknown adapter.',
        taskTitle: 'Rejected task',
        taskDescription: 'Unknown adapter IDs must not reach the Kernel.',
      }),
    ).rejects.toMatchObject({
      code: 'host-adapter-configuration.unknown-adapter-id',
    } satisfies Partial<HostMissionWorkflowError>);
    expect(mockWorkflow.inputs).toEqual([]);
  });
});

class StaticAdapterConfigurationSurface implements HostAdapterConfigurationSurface {
  public constructor(private readonly adapterId: string | undefined) {}

  public getDeveloperWorkflowDefaultAdapterId(): string | undefined {
    return this.adapterId;
  }
}

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
        summary: 'Deterministic Host adapter configuration test knowledge.',
        scope: 'Repository',
        status: 'Candidate',
        supportingEvidenceIds: [`evidence-${this.adapterId}`],
        supportingReviewId: `review-${this.adapterId}`,
        contributingEventIds: [`domain-event-mission-${this.adapterId}-completion`],
        approvingAuthority: 'Sprint 33 Host adapter configuration test',
        attribution: {
          missionId: `mission-${this.adapterId}`,
          missionPlanRevisionId: 'revision-3',
          supportingEvidenceIds: [`evidence-${this.adapterId}`],
          supportingReviewId: `review-${this.adapterId}`,
          contributingEventIds: [`domain-event-mission-${this.adapterId}-completion`],
          approvingAuthority: 'Sprint 33 Host adapter configuration test',
        },
        provenance: {
          evidenceLineage: [`evidence-${this.adapterId}`],
          reviewLineage: `review-${this.adapterId}`,
          missionLineage: {
            missionId: `mission-${this.adapterId}`,
            missionPlanRevisionId: 'revision-3',
          },
          approvalLineage: 'Sprint 33 Host adapter configuration test',
        },
        revisions: [],
      },
    };
  }

  public showMissionWorkflowHistory(): readonly HostMissionWorkflowHistoryEntry[] {
    return [
      {
        missionId: `mission-${this.adapterId}`,
        objective: `Configured workflow ${this.adapterId}`,
        finalStatus: 'Completed',
        adapterId: this.adapterId,
        adapterDispatchStatus: 'Completed',
        reviewOutcome: 'Accepted',
        knowledgeCaptureStatus: 'Candidate',
      },
    ];
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
