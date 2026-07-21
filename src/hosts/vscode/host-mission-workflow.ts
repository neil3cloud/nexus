import { randomUUID } from 'node:crypto';

import { AdapterRequest } from '../../kernel/adapter/adapter-request';
import type { AdapterResponseSnapshot } from '../../kernel/adapter/adapter-response';
import type { AdapterExecutionConstraints } from '../../kernel/adapter/adapter-request';
import type { AdapterService } from '../../kernel/adapter/adapter.service';
import type { Evidence } from '../../kernel/evidence/evidence.aggregate';
import type { EvidenceService } from '../../kernel/evidence/evidence.service';
import type { AssignmentReadinessResult } from '../../kernel/execution/execution-strategy.types';
import type { ExecutionRole } from '../../kernel/execution/execution-role';
import type { ExecutionStrategyService } from '../../kernel/execution/execution-strategy.service';
import type { RoleService } from '../../kernel/execution/role.service';
import type { KnowledgeService } from '../../kernel/knowledge/knowledge.service';
import type { KnowledgeSnapshot } from '../../kernel/knowledge/knowledge.types';
import type { MissionStatus } from '../../kernel/mission/mission.types';
import type {
  AddTaskRequest,
  CreateMissionPlanRequest,
  TaskStatus,
  UpdateTaskRequest,
} from '../../kernel/mission/mission-planning.types';
import type { CreateMissionRequest } from '../../kernel/mission/mission.types';
import type { MissionExecutionRequest, TaskExecutionRequest } from '../../kernel/mission/mission-execution.types';
import type { ReviewResult } from '../../kernel/review/review.contract';
import type { ReviewService } from '../../kernel/review/review.service';
import type { FindingSnapshot, ReviewOutcomeValue } from '../../kernel/review/review.types';
import type { HostPresentationSurface, HostWorkspaceTrustSurface } from './host.contract';
import { HostMissionWorkflowError } from './host-mission-workflow.errors';

export interface HostMissionWorkflowInput {
  readonly objective: string;
  readonly taskTitle: string;
  readonly taskDescription: string;
  readonly adapterExecutionConstraints?: AdapterExecutionConstraints;
}

export interface HostMissionWorkflowHistoryEntry {
  readonly missionId: string;
  readonly objective: string;
  readonly finalStatus: MissionStatus;
  readonly assignedRoleId?: string;
  readonly assignedRoleName?: string;
  readonly adapterId?: string;
  readonly adapterDispatchStatus?: AdapterResponseSnapshot['status'];
  readonly reviewOutcome?: ReviewOutcomeValue;
  readonly knowledgeCaptureStatus?: KnowledgeSnapshot['status'];
}

export interface HostMissionWorkflowResult {
  readonly missionId: string;
  readonly missionPlanId: string;
  readonly taskId: string;
  readonly finalStatus: MissionStatus;
  readonly missionPlanRevision: number;
  readonly taskStatus: TaskStatus;
  readonly assignedRoleId?: string;
  readonly assignedRoleName?: string;
  readonly adapterId: string;
  readonly adapterDispatchStatus: AdapterResponseSnapshot['status'];
  readonly reviewOutcome: ReviewOutcomeValue;
  readonly knowledgeCaptureStatus: KnowledgeSnapshot['status'];
  readonly knowledge: KnowledgeSnapshot;
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

export interface MissionWorkflowPipelineServices {
  readonly roleService: Pick<RoleService, 'assignRole' | 'retrieveRole'>;
  readonly executionStrategyService: Pick<
    ExecutionStrategyService,
    'createExecutionStrategy' | 'evaluateAssignmentReadiness'
  >;
  readonly adapterService: Pick<AdapterService, 'dispatch'>;
  readonly adapterId: string;
  readonly requiredCapability: string;
  readonly roleId?: string;
}

export interface MissionWorkflowCompletionServices {
  readonly evidenceService: Pick<EvidenceService, 'registerEvidence'>;
  readonly reviewService: Pick<ReviewService, 'startReview' | 'publishFinding' | 'finalizeReviewOutcome'>;
  readonly knowledgeService: Pick<KnowledgeService, 'captureKnowledge'>;
  readonly reviewOutcome?: ReviewOutcomeValue;
}

export interface HostMissionWorkflowPresentationOptions {
  readonly workflowLabel?: string;
  readonly completionMessageLabel?: string;
  readonly includeAssignedRole?: boolean;
}

interface HostMissionWorkflowInternalResult extends HostMissionWorkflowResult {
  readonly readyTaskStatus: TaskStatus;
}

export class HostMissionWorkflow {
  private readonly history: HostMissionWorkflowHistoryEntry[] = [];
  private readonly roleId: string;
  private readonly completionReviewOutcome: ReviewOutcomeValue;
  private readonly workflowLabel: string;
  private readonly completionMessageLabel: string;
  private readonly includeAssignedRole: boolean;

  public constructor(
    private readonly missionService: MissionWorkflowMissionService,
    private readonly planningService: MissionWorkflowPlanningService,
    private readonly executionService: MissionWorkflowExecutionService,
    private readonly pipeline: MissionWorkflowPipelineServices,
    private readonly completion: MissionWorkflowCompletionServices,
    private readonly presentation: HostPresentationSurface,
    private readonly workspaceTrust: HostWorkspaceTrustSurface,
    private readonly createIdentity: () => string = randomUUID,
    presentationOptions: HostMissionWorkflowPresentationOptions = {},
  ) {
    this.roleId = pipeline.roleId ?? 'builder';
    this.completionReviewOutcome = completion.reviewOutcome ?? 'Accepted';
    this.workflowLabel = presentationOptions.workflowLabel ?? 'Mission Workflow';
    this.completionMessageLabel = presentationOptions.completionMessageLabel ?? 'Mission workflow';
    this.includeAssignedRole = presentationOptions.includeAssignedRole ?? false;
  }

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
    const executionStrategyId = `execution-strategy-${this.createIdentity()}`;
    let missionCreated = false;
    let lastKnownStatus: MissionStatus | undefined;
    let adapterDispatchStatus: AdapterResponseSnapshot['status'] | undefined;
    let reviewOutcome: ReviewOutcomeValue | undefined;
    let knowledgeCaptureStatus: KnowledgeSnapshot['status'] | undefined;

    this.presentation.appendLine(`${this.workflowLabel} Progress: started ${missionId}`);

    try {
      const result: HostMissionWorkflowInternalResult = await this.presentation.withProgress(
        { title: `Nexus ${this.completionMessageLabel}: ${missionId}` },
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
          await this.pipeline.executionStrategyService.createExecutionStrategy({
            id: executionStrategyId,
            missionId,
          });
          await this.pipeline.roleService.assignRole({
            taskId,
            roleId: this.roleId,
          });
          const readiness = await this.pipeline.executionStrategyService.evaluateAssignmentReadiness({
            executionStrategyId,
            missionPlanId: missionPlan.id.toString(),
            taskId,
          });
          const role = await this.pipeline.roleService.retrieveRole(readiness.roleId);
          const adapterResponse = await this.pipeline.adapterService.dispatch({
            adapterId: this.pipeline.adapterId,
            requiredCapability: this.pipeline.requiredCapability,
            request: createPipelineAdapterRequest({
              readiness,
              role,
              missionId,
              ...(input.adapterExecutionConstraints === undefined
                ? {}
                : { executionConstraints: input.adapterExecutionConstraints }),
            }),
          });
          const adapterSnapshot = adapterResponse.toSnapshot();
          adapterDispatchStatus = adapterSnapshot.status;

          this.presentAdapterResponse(this.pipeline.adapterId, adapterSnapshot);

          if (adapterSnapshot.status !== 'Completed') {
            return this.failAdapterResponse(missionId, adapterSnapshot);
          }

          const completedTaskPlan = await this.executionService.completeTask({ missionId, taskId });
          const completedTask = findTask(completedTaskPlan, taskId);

          lastKnownStatus = (await this.missionService.reviewMission(missionId)).status;
          const completedMission = await this.executionService.completeMission({ missionId });
          lastKnownStatus = completedMission.status;
          const completionResult = await this.completeDeveloperWorkflow({
            missionId,
            missionPlanRevision: completedTaskPlan.revisionNumber,
            recordReviewOutcome: (outcome) => {
              reviewOutcome = outcome;
            },
            recordKnowledgeCaptureStatus: (status) => {
              knowledgeCaptureStatus = status;
            },
          });

          return Object.freeze({
            missionId,
            missionPlanId: missionPlan.id.toString(),
            taskId,
            finalStatus: completedMission.status,
            missionPlanRevision: completedTaskPlan.revisionNumber,
            taskStatus: completedTask.status,
            adapterId: this.pipeline.adapterId,
            adapterDispatchStatus: adapterSnapshot.status,
            reviewOutcome: completionResult.reviewOutcome,
            knowledgeCaptureStatus: completionResult.knowledge.status,
            knowledge: completionResult.knowledge,
            readyTaskStatus: readyTask.status,
            ...this.assignedRoleResult(role),
          });
        },
      );

      this.appendHistory({
        objective: input.objective,
        missionId,
        finalStatus: result.finalStatus,
        ...this.assignedRoleHistory(result),
        adapterId: result.adapterId,
        adapterDispatchStatus: result.adapterDispatchStatus,
        reviewOutcome: result.reviewOutcome,
        knowledgeCaptureStatus: result.knowledgeCaptureStatus,
      });
      this.presentation.appendLine(`Nexus ${this.workflowLabel}: ${missionId}`);
      this.presentation.appendLine(`Mission Status: ${result.finalStatus}`);
      this.presentation.appendLine(`MissionPlan Revision: ${String(result.missionPlanRevision)}`);
      this.presentation.appendLine(`Task Status: ${result.taskStatus}`);
      if (result.assignedRoleName !== undefined && result.assignedRoleId !== undefined) {
        this.presentation.appendLine(
          `Assigned Role: ${result.assignedRoleName} (${result.assignedRoleId})`,
        );
      }
      this.presentation.appendLine(`Adapter Dispatch Status: ${result.adapterDispatchStatus}`);
      this.presentation.appendLine(`Review Outcome: ${result.reviewOutcome}`);
      this.presentation.appendLine(`Knowledge Capture Status: ${result.knowledgeCaptureStatus}`);
      this.presentation.appendLine(`Knowledge Captured: ${result.knowledge.id}`);
      this.presentation.appendLine(`${this.workflowLabel} Progress: completed ${missionId}`);
      await this.presentation.showInformationMessage(
        `Nexus ${this.completionMessageLabel} '${missionId}' completed.`,
      );

      return Object.freeze({
        missionId: result.missionId,
        missionPlanId: result.missionPlanId,
        taskId: result.taskId,
        finalStatus: result.finalStatus,
        missionPlanRevision: result.missionPlanRevision,
        taskStatus: result.taskStatus,
        ...this.assignedRoleHistory(result),
        adapterId: result.adapterId,
        adapterDispatchStatus: result.adapterDispatchStatus,
        reviewOutcome: result.reviewOutcome,
        knowledgeCaptureStatus: result.knowledgeCaptureStatus,
        knowledge: result.knowledge,
      });
    } catch (error) {
      if (missionCreated && lastKnownStatus !== undefined) {
        this.appendHistory({
          objective: input.objective,
          missionId,
          finalStatus: lastKnownStatus,
          adapterId: this.pipeline.adapterId,
          ...(adapterDispatchStatus === undefined ? {} : { adapterDispatchStatus }),
          ...(reviewOutcome === undefined ? {} : { reviewOutcome }),
          ...(knowledgeCaptureStatus === undefined ? {} : { knowledgeCaptureStatus }),
        });
      }

      const message = error instanceof Error ? error.message : 'Unknown Mission workflow failure.';
      this.presentation.appendLine(`${this.workflowLabel} Progress: failed ${missionId}`);
      this.presentation.appendLine(`Host Diagnostic host-mission-workflow.kernel-rejected: ${message}`);
      await this.presentation.showErrorMessage(`Nexus ${this.completionMessageLabel} failed: ${message}`);
      throw error;
    }
  }

  public showMissionWorkflowHistory(): readonly HostMissionWorkflowHistoryEntry[] {
    const entries = this.history.map((entry) => Object.freeze({ ...entry }));

    this.presentation.appendLine(`Nexus ${this.workflowLabel} History`);
    for (const entry of entries) {
      const roleSummary =
        entry.assignedRoleName === undefined || entry.assignedRoleId === undefined
          ? ''
          : ` | ${entry.assignedRoleName} (${entry.assignedRoleId})`;
      const adapterSummary =
        entry.adapterId === undefined || entry.adapterDispatchStatus === undefined
          ? ''
          : ` | ${entry.adapterId} | ${entry.adapterDispatchStatus}`;
      const completionSummary =
        entry.reviewOutcome === undefined || entry.knowledgeCaptureStatus === undefined
          ? ''
          : ` | ${entry.reviewOutcome} | ${entry.knowledgeCaptureStatus}`;
      this.presentation.appendLine(
        `Mission History Entry: ${entry.missionId} | ${entry.finalStatus}${roleSummary}${adapterSummary}${completionSummary} | ${entry.objective}`,
      );
    }

    return Object.freeze(entries);
  }

  private assignedRoleResult(role: ExecutionRole): Pick<
    HostMissionWorkflowResult,
    'assignedRoleId' | 'assignedRoleName'
  > {
    if (!this.includeAssignedRole) {
      return {};
    }

    return {
      assignedRoleId: role.id.toString(),
      assignedRoleName: role.name,
    };
  }

  private assignedRoleHistory(
    result: Pick<HostMissionWorkflowResult, 'assignedRoleId' | 'assignedRoleName'>,
  ): Pick<HostMissionWorkflowHistoryEntry, 'assignedRoleId' | 'assignedRoleName'> {
    if (result.assignedRoleId === undefined || result.assignedRoleName === undefined) {
      return {};
    }

    return {
      assignedRoleId: result.assignedRoleId,
      assignedRoleName: result.assignedRoleName,
    };
  }

  private appendHistory(entry: HostMissionWorkflowHistoryEntry): void {
    this.history.push(Object.freeze({ ...entry }));
  }

  private presentAdapterResponse(adapterId: string, response: AdapterResponseSnapshot): void {
    this.presentation.appendLine(`Mission Workflow Adapter Dispatch: ${adapterId}`);
    this.presentation.appendLine(`Adapter Dispatch Status: ${response.status}`);
    for (const diagnostic of response.diagnostics) {
      this.presentation.appendLine(`Adapter Diagnostic ${diagnostic.code}: ${diagnostic.message}`);
    }

    for (const producedArtifact of response.producedArtifacts) {
      this.presentation.appendLine(`Adapter Produced Artifact: ${producedArtifact}`);
    }
    for (const finding of response.findings) {
      this.presentation.appendLine(`Adapter Finding: ${finding}`);
    }
    for (const [key, value] of Object.entries(response.executionMetadata).sort(([left], [right]) =>
      left.localeCompare(right),
    )) {
      this.presentation.appendLine(`Adapter Execution Metadata ${key}: ${value}`);
    }
  }

  private async completeDeveloperWorkflow(input: {
    readonly missionId: string;
    readonly missionPlanRevision: number;
    readonly recordReviewOutcome: (outcome: ReviewOutcomeValue) => void;
    readonly recordKnowledgeCaptureStatus: (status: KnowledgeSnapshot['status']) => void;
  }): Promise<{
    readonly evidence: Evidence;
    readonly finding: FindingSnapshot;
    readonly reviewOutcome: ReviewOutcomeValue;
    readonly review: ReviewResult;
    readonly knowledge: KnowledgeSnapshot;
  }> {
    const missionPlanRevisionId = `revision-${input.missionPlanRevision}`;
    const evidenceId = `evidence-${this.createIdentity()}`;
    const reviewId = `review-${this.createIdentity()}`;
    const findingId = `finding-${this.createIdentity()}`;
    const knowledgeId = `knowledge-${this.createIdentity()}`;
    const evidence = await this.completion.evidenceService.registerEvidence({
      id: evidenceId,
      missionId: input.missionId,
      type: 'TestResult',
      version: 1,
      hash: `sha256:${input.missionId}-developer-workflow-completion`,
      metadata: {
        capturedAt: '2026-07-13T00:00:00.000Z',
        attributes: {
          sprint: 'Sprint 27',
          workflow: 'Developer Workflow Completion',
        },
      },
      confidenceClassification: 'Observed',
      provenance: {
        source: 'vscode-host',
        acquisitionMethod: 'developer-workflow-completion',
        acquiredAt: '2026-07-13T00:00:00.000Z',
        actor: 'builder',
        system: 'nexus',
        verificationStatus: 'Verified',
        verificationStatusSemantics: 'EvidenceVerificationStatus/v1',
      },
    });
    const review = await this.completion.reviewService.startReview({
      id: reviewId,
      missionId: input.missionId,
      missionPlanRevision: {
        kind: 'ExecutableMissionPlan',
        revisionId: missionPlanRevisionId,
      },
      reviewCriteria: [
        {
          id: 'sprint-27-developer-workflow-completion',
          description: 'Sprint 27 Developer Workflow completion acceptance criteria.',
        },
      ],
      evidenceReferences: [evidence.id.toString()],
    });
    const finding = await this.completion.reviewService.publishFinding({
      reviewId: review.id,
      findingId,
      severity: 'Informational',
      category: 'Alignment',
      summary: 'Developer Workflow completion evidence recorded.',
      description: 'The Host supplied deterministic Sprint 27 workflow completion data for Kernel Review.',
      supportingEvidenceReferences: [evidence.id.toString()],
      affectedArtifactReferences: [input.missionId],
      criteriaReferences: ['sprint-27-developer-workflow-completion'],
    });
    const reviewResult = await this.completion.reviewService.finalizeReviewOutcome({
      reviewId: review.id,
      outcome: this.completionReviewOutcome,
    });
    const outcome = reviewResult.review.outcome ?? this.completionReviewOutcome;
    input.recordReviewOutcome(outcome);

    const knowledge = await this.completion.knowledgeService.captureKnowledge({
      id: knowledgeId,
      missionId: input.missionId,
      missionPlanRevisionId,
      summary: 'Sprint 27 completed the provider-independent Developer Workflow.',
      scope: 'Repository',
      supportingEvidenceIds: [evidence.id.toString()],
      supportingReviewId: review.id,
      contributingEventIds: [`domain-event-${input.missionId}-completion`],
      approvingAuthority: 'Sprint 27 Developer Workflow completion',
    });
    input.recordKnowledgeCaptureStatus(knowledge.status);

    this.presentation.appendLine(`Review Finding: ${finding.summary}`);
    this.presentation.appendLine(`Review Outcome: ${outcome}`);
    this.presentation.appendLine(`Knowledge Capture Status: ${knowledge.status}`);
    this.presentation.appendLine(`Knowledge Captured: ${knowledge.id}`);

    return Object.freeze({
      evidence,
      finding,
      reviewOutcome: outcome,
      review: reviewResult,
      knowledge,
    });
  }

  private async failAdapterResponse(
    missionId: string,
    response: AdapterResponseSnapshot,
  ): Promise<never> {
    this.presentation.appendLine(`Mission Workflow Progress: failed ${missionId}`);
    await this.presentation.showErrorMessage(
      `Nexus Mission workflow adapter dispatch failed with status '${response.status}'.`,
    );

    throw new HostMissionWorkflowError(
      'host-mission-workflow.adapter-dispatch-failed',
      `Adapter dispatch returned status '${response.status}'.`,
    );
  }

  private async failWorkflow(code: string, message: string): Promise<never> {
    this.presentation.appendLine(`Host Diagnostic ${code}: ${message}`);
    await this.presentation.showErrorMessage(`Nexus Mission workflow failed: ${message}`);

    throw new HostMissionWorkflowError(code, message);
  }

}

function createPipelineAdapterRequest(input: {
  readonly readiness: AssignmentReadinessResult;
  readonly role: ExecutionRole;
  readonly missionId: string;
  readonly executionConstraints?: AdapterExecutionConstraints;
}): AdapterRequest {
  return AdapterRequest.create({
    engineeringRole: input.role.name,
    taskId: input.readiness.taskId,
    contextPackageReference: `context-package-${input.missionId}`,
    ...(input.executionConstraints === undefined
      ? {}
      : { executionConstraints: input.executionConstraints }),
    requestMetadata: {
      executionStrategyId: input.readiness.executionStrategyId,
      missionId: input.readiness.missionId,
      missionPlanId: input.readiness.missionPlanId,
      roleId: input.readiness.roleId,
    },
  });
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
