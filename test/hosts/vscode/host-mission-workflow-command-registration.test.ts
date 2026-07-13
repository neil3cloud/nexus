import { describe, expect, it } from 'vitest';

import { MOCK_ADAPTER_ID } from '../../../src/adapters/mock/mock-adapter';
import { AdapterResponse } from '../../../src/kernel/adapter/adapter-response';
import { Evidence } from '../../../src/kernel/evidence/evidence.aggregate';
import { ExecutionRole } from '../../../src/kernel/execution/execution-role';
import { RoleAssignment } from '../../../src/kernel/execution/role-assignment';
import type { KnowledgeSnapshot } from '../../../src/kernel/knowledge/knowledge.types';
import type {
  HostCommandHandler,
  HostCommandRegistry,
  HostDisposable,
  HostInputSurface,
  HostPresentationSurface,
  HostProgressOptions,
  HostWorkspaceTrustSurface,
} from '../../../src/hosts/vscode/host.contract';
import {
  HostMissionWorkflow,
  type MissionWorkflowCompletionServices,
  type MissionWorkflowPipelineServices,
  type MissionWorkflowExecutionService,
  type MissionWorkflowMissionService,
  type MissionWorkflowMissionState,
  type MissionWorkflowPlanningService,
  type MissionWorkflowPlanState,
} from '../../../src/hosts/vscode/host-mission-workflow';
import {
  HOST_RUN_DEVELOPER_MISSION_WORKFLOW_COMMAND,
  HOST_SHOW_MISSION_WORKFLOW_HISTORY_COMMAND,
  HostMissionWorkflowCommandRegistration,
} from '../../../src/hosts/vscode/host-mission-workflow-command-registration';
import { HostMissionWorkflowError } from '../../../src/hosts/vscode/host-mission-workflow.errors';

describe('HostMissionWorkflowCommandRegistration', () => {
  it('registers Mission workflow commands and collects interactive input', async () => {
    const registry = new RecordingCommandRegistry();
    const workflow = new HostMissionWorkflow(
      new RecordingMissionService(),
      new RecordingPlanningService(),
      new RecordingExecutionService(),
      createRecordingPipeline(),
      createRecordingCompletion(),
      new SilentPresentationSurface(),
      new StaticWorkspaceTrustSurface(true),
      createDeterministicIdentity([
        'command-mission',
        'command-plan',
        'command-task',
        'command-strategy',
        'command-evidence',
        'command-review',
        'command-finding',
        'command-knowledge',
      ]),
    );
    new HostMissionWorkflowCommandRegistration(
      registry,
      workflow,
      new RecordingInputSurface([
        'Create a developer workflow Mission.',
        'Run command task',
        'Complete command task.',
      ]),
      new SilentPresentationSurface(),
    );

    expect(registry.commands).toEqual([
      HOST_RUN_DEVELOPER_MISSION_WORKFLOW_COMMAND,
      HOST_SHOW_MISSION_WORKFLOW_HISTORY_COMMAND,
    ]);
    await expect(registry.invoke(HOST_RUN_DEVELOPER_MISSION_WORKFLOW_COMMAND)).resolves.toMatchObject({
      missionId: 'mission-command-mission',
      finalStatus: 'Completed',
      taskStatus: 'Completed',
      adapterDispatchStatus: 'Completed',
      reviewOutcome: 'Accepted',
      knowledgeCaptureStatus: 'Candidate',
    });
    await expect(registry.invoke(HOST_SHOW_MISSION_WORKFLOW_HISTORY_COMMAND)).resolves.toEqual([
      {
        missionId: 'mission-command-mission',
        objective: 'Create a developer workflow Mission.',
        finalStatus: 'Completed',
        adapterId: MOCK_ADAPTER_ID,
        adapterDispatchStatus: 'Completed',
        reviewOutcome: 'Accepted',
        knowledgeCaptureStatus: 'Candidate',
      },
    ]);
  });

  it('aborts deterministically on prompt cancellation before Kernel calls', async () => {
    const registry = new RecordingCommandRegistry();
    const presentation = new SilentPresentationSurface();
    const missionService = new RecordingMissionService();
    const workflow = new HostMissionWorkflow(
      missionService,
      new RecordingPlanningService(),
      new RecordingExecutionService(),
      createRecordingPipeline(),
      createRecordingCompletion(),
      new SilentPresentationSurface(),
      new StaticWorkspaceTrustSurface(true),
      createDeterministicIdentity(['cancel-mission', 'cancel-plan', 'cancel-task', 'cancel-strategy']),
    );
    new HostMissionWorkflowCommandRegistration(
      registry,
      workflow,
      new RecordingInputSurface(['Cancelled objective', undefined]),
      presentation,
    );

    await expect(registry.invoke(HOST_RUN_DEVELOPER_MISSION_WORKFLOW_COMMAND)).rejects.toMatchObject({
      code: 'host-mission-workflow.input-cancelled',
    } satisfies Partial<HostMissionWorkflowError>);
    expect(missionService.callCount).toBe(0);
    expect(presentation.lines).toContain(
      'Host Diagnostic host-mission-workflow.input-cancelled: Mission workflow input cancelled while reading Task Title.',
    );
  });
});

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

  public async invoke(command: string): Promise<unknown> {
    const handler = this.handlers.get(command);

    if (handler === undefined) {
      throw new Error(`Command '${command}' was not registered.`);
    }

    return handler();
  }
}

function createRecordingPipeline(): MissionWorkflowPipelineServices {
  return {
    roleService: {
      async assignRole(input) {
        return RoleAssignment.create(input);
      },
      async retrieveRole() {
        return ExecutionRole.create({
          id: 'builder',
          name: 'Builder',
          description: 'Responsible for implementing authorized engineering changes.',
          category: 'Engineering Responsibility',
        });
      },
    },
    executionStrategyService: {
      async createExecutionStrategy(input) {
        return {
          id: input.id ?? 'generated-execution-strategy',
          missionId: input.missionId,
          dependencyOrderingRule: 'RequireCompletedDependencies',
          concurrencyRule: 'IndependentTasksMayBeReadyConcurrently',
        };
      },
      async evaluateAssignmentReadiness(input) {
        return {
          executionStrategyId: input.executionStrategyId,
          missionId: 'mission-command-mission',
          missionPlanId: input.missionPlanId,
          taskId: input.taskId,
          roleId: 'builder',
          ready: true,
          satisfiedDependencyTaskIds: [],
          concurrencyRule: 'IndependentTasksMayBeReadyConcurrently',
        };
      },
    },
    adapterService: {
      async dispatch() {
        return AdapterResponse.create({
          status: 'Completed',
          diagnostics: [
            {
              code: 'mock-adapter.completed',
              message: 'Mock Adapter deterministically completed the request.',
            },
          ],
          executionMetadata: {
            adapterId: MOCK_ADAPTER_ID,
          },
        });
      },
    },
    adapterId: MOCK_ADAPTER_ID,
    requiredCapability: 'CodeModification',
  };
}

function createRecordingCompletion(): MissionWorkflowCompletionServices {
  return {
    evidenceService: {
      async registerEvidence(request) {
        return Evidence.register(request);
      },
    },
    reviewService: {
      async startReview(command) {
        return {
          id: command.id ?? 'generated-review',
          missionId: command.missionId,
          missionPlanRevision: command.missionPlanRevision,
          status: 'In Progress',
          reviewCriteria: command.reviewCriteria,
          evidenceReferences: command.evidenceReferences,
          findings: [],
        };
      },
      async publishFinding(command) {
        return {
          id: command.findingId ?? 'generated-finding',
          reviewId: command.reviewId,
          severity: 'Informational',
          category: 'Alignment',
          summary: command.summary,
          description: command.description,
          supportingEvidenceReferences: command.supportingEvidenceReferences,
          affectedArtifactReferences: command.affectedArtifactReferences,
          criteriaReferences: command.criteriaReferences,
          status: 'Created',
        };
      },
      async finalizeReviewOutcome(command) {
        return {
          review: {
            id: command.reviewId,
            missionId: 'mission-command-mission',
            missionPlanRevision: 'revision-3',
            status: 'Completed',
            outcome: 'Accepted',
            reviewCriteria: [],
            evidenceReferences: [],
            findings: [],
          },
          findings: [],
        };
      },
    },
    knowledgeService: {
      async captureKnowledge(request) {
        return knowledgeSnapshot(request);
      },
    },
  };
}

function knowledgeSnapshot(input: {
  readonly id?: string;
  readonly missionId: string;
  readonly missionPlanRevisionId: string;
  readonly summary: string;
  readonly supportingEvidenceIds: readonly string[];
  readonly supportingReviewId: string;
  readonly contributingEventIds: readonly string[];
  readonly approvingAuthority: string;
}): KnowledgeSnapshot {
  return {
    id: input.id ?? 'generated-knowledge',
    missionId: input.missionId,
    missionPlanRevisionId: input.missionPlanRevisionId,
    summary: input.summary,
    scope: 'Repository',
    status: 'Candidate',
    supportingEvidenceIds: input.supportingEvidenceIds,
    supportingReviewId: input.supportingReviewId,
    contributingEventIds: input.contributingEventIds,
    approvingAuthority: input.approvingAuthority,
    attribution: {
      missionId: input.missionId,
      missionPlanRevisionId: input.missionPlanRevisionId,
      supportingEvidenceIds: input.supportingEvidenceIds,
      supportingReviewId: input.supportingReviewId,
      contributingEventIds: input.contributingEventIds,
      approvingAuthority: input.approvingAuthority,
    },
    provenance: {
      evidenceLineage: input.supportingEvidenceIds,
      reviewLineage: input.supportingReviewId,
      missionLineage: {
        missionId: input.missionId,
        missionPlanRevisionId: input.missionPlanRevisionId,
      },
      approvalLineage: input.approvingAuthority,
    },
    revisions: [
      {
        revisionNumber: 1,
        summary: input.summary,
        attribution: {
          missionId: input.missionId,
          missionPlanRevisionId: input.missionPlanRevisionId,
          supportingEvidenceIds: input.supportingEvidenceIds,
          supportingReviewId: input.supportingReviewId,
          contributingEventIds: input.contributingEventIds,
          approvingAuthority: input.approvingAuthority,
        },
        provenance: {
          evidenceLineage: input.supportingEvidenceIds,
          reviewLineage: input.supportingReviewId,
          missionLineage: {
            missionId: input.missionId,
            missionPlanRevisionId: input.missionPlanRevisionId,
          },
          approvalLineage: input.approvingAuthority,
        },
      },
    ],
  };
}

class RecordingInputSurface implements HostInputSurface {
  public constructor(private readonly values: (string | undefined)[]) {}

  public async showInputBox(): Promise<string | undefined> {
    return this.values.shift();
  }
}

class SilentPresentationSurface implements HostPresentationSurface {
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

class StaticWorkspaceTrustSurface implements HostWorkspaceTrustSurface {
  public constructor(private readonly trusted: boolean) {}

  public isWorkspaceTrusted(): boolean {
    return this.trusted;
  }
}

class RecordingMissionService implements MissionWorkflowMissionService {
  public callCount = 0;

  public async createMission(): Promise<MissionWorkflowMissionState> {
    this.callCount += 1;

    return missionState('mission', 'Draft');
  }

  public async planMission(): Promise<MissionWorkflowMissionState> {
    return missionState('mission', 'Planned');
  }

  public async markMissionReady(): Promise<MissionWorkflowMissionState> {
    return missionState('mission', 'Ready');
  }

  public async reviewMission(): Promise<MissionWorkflowMissionState> {
    return missionState('mission', 'Reviewing');
  }
}

class RecordingPlanningService implements MissionWorkflowPlanningService {
  public async createMissionPlan(
    request: Parameters<MissionWorkflowPlanningService['createMissionPlan']>[0],
  ): Promise<MissionWorkflowPlanState> {
    return planState(request.id ?? 'generated-mission-plan', 1, 'task-command-task', 'Planned');
  }

  public async addTask(request: Parameters<MissionWorkflowPlanningService['addTask']>[0]): Promise<MissionWorkflowPlanState> {
    return planState('mission-plan', 2, request.taskId ?? 'generated-task', 'Planned');
  }

  public async updateTask(request: Parameters<MissionWorkflowPlanningService['updateTask']>[0]): Promise<MissionWorkflowPlanState> {
    return planState('mission-plan', 3, request.taskId, 'Ready');
  }
}

class RecordingExecutionService implements MissionWorkflowExecutionService {
  public async startMission(): Promise<MissionWorkflowMissionState> {
    return missionState('mission', 'Executing');
  }

  public async startTask(request: Parameters<MissionWorkflowExecutionService['startTask']>[0]): Promise<MissionWorkflowPlanState> {
    return planState('mission-plan', 3, request.taskId, 'InProgress');
  }

  public async completeTask(request: Parameters<MissionWorkflowExecutionService['completeTask']>[0]): Promise<MissionWorkflowPlanState> {
    return planState('mission-plan', 3, request.taskId, 'Completed');
  }

  public async completeMission(): Promise<MissionWorkflowMissionState> {
    return missionState('mission', 'Completed');
  }
}

function missionState(id: string, status: MissionWorkflowMissionState['status']): MissionWorkflowMissionState {
  return {
    id: {
      toString: () => id,
    },
    status,
  };
}

function planState(
  id: string,
  revisionNumber: number,
  taskId: string,
  status: MissionWorkflowPlanState['tasks'][number]['status'],
): MissionWorkflowPlanState {
  return {
    id: {
      toString: () => id,
    },
    revisionNumber,
    tasks: [{ id: taskId, status }],
  };
}

function createDeterministicIdentity(values: string[]): () => string {
  return () => {
    const value = values.shift();

    if (value === undefined) {
      throw new Error('No deterministic identity value remains.');
    }

    return value;
  };
}
