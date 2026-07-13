import { randomUUID } from 'node:crypto';

import type { MissionStatus } from '../../kernel/mission/mission.types';
import type {
  AddTaskRequest,
  CreateMissionPlanRequest,
  TaskStatus,
  UpdateTaskRequest,
} from '../../kernel/mission/mission-planning.types';
import type { CreateMissionRequest } from '../../kernel/mission/mission.types';
import type { MissionExecutionRequest, TaskExecutionRequest } from '../../kernel/mission/mission-execution.types';
import type { HostPresentationSurface, HostWorkspaceTrustSurface } from './host.contract';
import { HostMissionWorkflowError } from './host-mission-workflow.errors';

export interface HostMissionWorkflowInput {
  readonly objective: string;
  readonly taskTitle: string;
  readonly taskDescription: string;
}

export interface HostMissionWorkflowHistoryEntry {
  readonly missionId: string;
  readonly objective: string;
  readonly finalStatus: MissionStatus;
}

export interface HostMissionWorkflowResult {
  readonly missionId: string;
  readonly missionPlanId: string;
  readonly taskId: string;
  readonly finalStatus: MissionStatus;
  readonly missionPlanRevision: number;
  readonly taskStatus: TaskStatus;
}

export interface MissionWorkflowMissionState {
  readonly id: { toString(): string };
  readonly status: MissionStatus;
}

export interface MissionWorkflowPlanState {
  readonly id: { toString(): string };
  readonly revisionNumber: number;
  readonly tasks: readonly {
    readonly id: string;
    readonly status: TaskStatus;
  }[];
}

export interface MissionWorkflowMissionService {
  createMission(request: CreateMissionRequest): Promise<MissionWorkflowMissionState>;
  planMission(missionId: string): Promise<MissionWorkflowMissionState>;
  markMissionReady(missionId: string): Promise<MissionWorkflowMissionState>;
  reviewMission(missionId: string): Promise<MissionWorkflowMissionState>;
}

export interface MissionWorkflowPlanningService {
  createMissionPlan(request: CreateMissionPlanRequest): Promise<MissionWorkflowPlanState>;
  addTask(request: AddTaskRequest): Promise<MissionWorkflowPlanState>;
  updateTask(request: UpdateTaskRequest): Promise<MissionWorkflowPlanState>;
}

export interface MissionWorkflowExecutionService {
  startMission(request: MissionExecutionRequest): Promise<MissionWorkflowMissionState>;
  startTask(request: TaskExecutionRequest): Promise<MissionWorkflowPlanState>;
  completeTask(request: TaskExecutionRequest): Promise<MissionWorkflowPlanState>;
  completeMission(request: MissionExecutionRequest): Promise<MissionWorkflowMissionState>;
}

export class HostMissionWorkflow {
  private readonly history: HostMissionWorkflowHistoryEntry[] = [];

  public constructor(
    private readonly missionService: MissionWorkflowMissionService,
    private readonly planningService: MissionWorkflowPlanningService,
    private readonly executionService: MissionWorkflowExecutionService,
    private readonly presentation: HostPresentationSurface,
    private readonly workspaceTrust: HostWorkspaceTrustSurface,
    private readonly createIdentity: () => string = randomUUID,
  ) {}

  public async runDeveloperMissionWorkflow(
    input: HostMissionWorkflowInput,
  ): Promise<HostMissionWorkflowResult> {
    if (!this.workspaceTrust.isWorkspaceTrusted()) {
      return this.failWorkflow(
        'host-mission-workflow.workspace-not-trusted',
        'Workspace Trust is required before running Mission workflows.',
      );
    }

    const missionId = `mission-${this.createIdentity()}`;
    const missionPlanId = `mission-plan-${this.createIdentity()}`;
    const taskId = `task-${this.createIdentity()}`;
    let missionCreated = false;
    let lastKnownStatus: MissionStatus | undefined;

    this.presentation.appendLine(`Mission Workflow Progress: started ${missionId}`);

    try {
      const result = await this.presentation.withProgress(
        { title: `Nexus Mission workflow: ${missionId}` },
        async () => {
          const mission = await this.missionService.createMission({
            id: missionId,
            objective: input.objective,
          });
          missionCreated = true;
          lastKnownStatus = mission.status;

          const missionPlan = await this.planningService.createMissionPlan({
            id: missionPlanId,
            missionId,
            revisionReason: 'Create Sprint 25 developer workflow MissionPlan.',
            revisionMetadata: {
              sprint: 'Sprint 25',
            },
          });

          lastKnownStatus = (await this.missionService.planMission(missionId)).status;

          await this.planningService.addTask({
            missionPlanId: missionPlan.id.toString(),
            taskId,
            title: input.taskTitle,
            description: input.taskDescription,
            revisionReason: 'Add Sprint 25 developer workflow Task.',
            revisionMetadata: {
              sprint: 'Sprint 25',
            },
          });

          const readyPlan = await this.planningService.updateTask({
            missionPlanId: missionPlan.id.toString(),
            taskId,
            status: 'Ready',
            revisionReason: 'Mark Sprint 25 developer workflow Task ready.',
          });
          const readyTask = findTask(readyPlan, taskId);

          lastKnownStatus = (await this.missionService.markMissionReady(missionId)).status;
          lastKnownStatus = (await this.executionService.startMission({ missionId })).status;
          await this.executionService.startTask({ missionId, taskId });
          const completedTaskPlan = await this.executionService.completeTask({ missionId, taskId });
          const completedTask = findTask(completedTaskPlan, taskId);

          lastKnownStatus = (await this.missionService.reviewMission(missionId)).status;
          const completedMission = await this.executionService.completeMission({ missionId });
          lastKnownStatus = completedMission.status;

          return Object.freeze({
            missionId,
            missionPlanId: missionPlan.id.toString(),
            taskId,
            finalStatus: completedMission.status,
            missionPlanRevision: completedTaskPlan.revisionNumber,
            taskStatus: completedTask.status,
            readyTaskStatus: readyTask.status,
          });
        },
      );

      this.appendHistory(input.objective, missionId, result.finalStatus);
      this.presentation.appendLine(`Nexus Mission Workflow: ${missionId}`);
      this.presentation.appendLine(`Mission Status: ${result.finalStatus}`);
      this.presentation.appendLine(`MissionPlan Revision: ${String(result.missionPlanRevision)}`);
      this.presentation.appendLine(`Task Status: ${result.taskStatus}`);
      this.presentation.appendLine(`Mission Workflow Progress: completed ${missionId}`);
      await this.presentation.showInformationMessage(`Nexus Mission workflow '${missionId}' completed.`);

      return Object.freeze({
        missionId: result.missionId,
        missionPlanId: result.missionPlanId,
        taskId: result.taskId,
        finalStatus: result.finalStatus,
        missionPlanRevision: result.missionPlanRevision,
        taskStatus: result.taskStatus,
      });
    } catch (error) {
      if (missionCreated && lastKnownStatus !== undefined) {
        this.appendHistory(input.objective, missionId, lastKnownStatus);
      }

      const message = error instanceof Error ? error.message : 'Unknown Mission workflow failure.';
      this.presentation.appendLine(`Mission Workflow Progress: failed ${missionId}`);
      this.presentation.appendLine(`Host Diagnostic host-mission-workflow.kernel-rejected: ${message}`);
      await this.presentation.showErrorMessage(`Nexus Mission workflow failed: ${message}`);
      throw error;
    }
  }

  public showMissionWorkflowHistory(): readonly HostMissionWorkflowHistoryEntry[] {
    const entries = this.history.map((entry) => Object.freeze({ ...entry }));

    this.presentation.appendLine('Nexus Mission Workflow History');
    for (const entry of entries) {
      this.presentation.appendLine(
        `Mission History Entry: ${entry.missionId} | ${entry.finalStatus} | ${entry.objective}`,
      );
    }

    return Object.freeze(entries);
  }

  private appendHistory(objective: string, missionId: string, finalStatus: MissionStatus): void {
    this.history.push(Object.freeze({ missionId, objective, finalStatus }));
  }

  private async failWorkflow(code: string, message: string): Promise<never> {
    this.presentation.appendLine(`Host Diagnostic ${code}: ${message}`);
    await this.presentation.showErrorMessage(`Nexus Mission workflow failed: ${message}`);

    throw new HostMissionWorkflowError(code, message);
  }
}

function findTask(plan: MissionWorkflowPlanState, taskId: string): { readonly id: string; readonly status: TaskStatus } {
  const task = plan.tasks.find((candidate) => candidate.id === taskId);

  if (task === undefined) {
    throw new HostMissionWorkflowError(
      'host-mission-workflow.task-not-found',
      `Mission workflow Task '${taskId}' was not returned by the MissionPlan.`,
    );
  }

  return task;
}
