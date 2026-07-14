import { randomUUID } from 'node:crypto';

import { ServiceLifecycle } from '../common/service-lifecycle';
import { AdapterRequest } from '../adapter/adapter-request';
import type { AdapterService } from '../adapter/adapter.service';
import { KernelError } from '../common/kernel-error';
import { AdvancementTrigger } from './advancement-trigger';
import type { AssignmentPolicyService } from './assignment-policy.service';
import type { AssignmentPolicyEvaluationResult } from './assignment-policy.types';
import { EngineeringSession } from './engineering-session';
import type {
  AdvanceEngineeringSessionWorkflowCommand,
  AdvanceEngineeringSessionWorkflowAfterReviewCommand,
  AdvanceEngineeringSessionWorkflowOnTriggerCommand,
  CloseEngineeringSessionCommand,
  CreateEngineeringSessionCommand,
  EngineeringSessionServiceContract,
  ExecuteCurrentWorkflowStepCommand,
} from './engineering-session.contract';
import { EngineeringSessionId } from './engineering-session-id';
import {
  EngineeringSessionNotFoundError,
  InvalidEngineeringSessionDefinitionError,
} from './engineering-session.errors';
import {
  InMemoryEngineeringSessionRepository,
  type IEngineeringSessionRepository,
} from './engineering-session.repository';
import type {
  EngineeringSessionSnapshot,
  EngineeringSessionWorkflowExecutionResult,
} from './engineering-session.types';
import type { ExecutionSessionService } from './execution-session.service';
import type { ExecutionStrategyService } from './execution-strategy.service';
import {
  InMemoryWorkflowChainRepository,
  type IWorkflowChainRepository,
} from './workflow-chain.repository';
import { ReviewOutcome } from '../review/review-values';
import type { AssignmentReadinessResult } from './execution-strategy.types';

type WorkflowExecutionReadinessEvaluation =
  | {
      readonly status: 'Ready';
      readonly readiness: AssignmentReadinessResult;
    }
  | ReadinessRejectedWorkflowExecutionResult;

type ReadinessRejectedWorkflowExecutionResult = EngineeringSessionWorkflowExecutionResult & {
  readonly status: 'ReadinessRejected';
};

type AssignmentPolicyRejectedWorkflowExecutionResult = EngineeringSessionWorkflowExecutionResult & {
  readonly status: 'AssignmentPolicyRejected';
  readonly assignmentPolicy: AssignmentPolicyEvaluationResult;
};

type WorkflowExecutionAssignmentPolicyEvaluation =
  | {
      readonly status: 'Satisfied';
      readonly assignmentPolicy: AssignmentPolicyEvaluationResult;
    }
  | AssignmentPolicyRejectedWorkflowExecutionResult;

export class EngineeringSessionService
  extends ServiceLifecycle
  implements EngineeringSessionServiceContract
{
  public constructor(
    private readonly repository: IEngineeringSessionRepository = new InMemoryEngineeringSessionRepository(),
    private readonly workflowChainRepository: IWorkflowChainRepository = new InMemoryWorkflowChainRepository(),
    private readonly createIdentity: () => string = randomUUID,
    private readonly createTimestamp: () => string = () => new Date().toISOString(),
    private readonly executionStrategyService?: Pick<
      ExecutionStrategyService,
      'evaluateAssignmentReadiness'
    >,
    private readonly adapterService?: Pick<AdapterService, 'dispatch'>,
    private readonly executionSessionService?: Pick<
      ExecutionSessionService,
      'createExecutionSession'
    >,
    private readonly assignmentPolicyService?: Pick<
      AssignmentPolicyService,
      'evaluateAssignmentPolicy'
    >,
  ) {
    super('EngineeringSessionService');
  }

  public async createEngineeringSession(
    command: CreateEngineeringSessionCommand,
  ): Promise<EngineeringSessionSnapshot> {
    const createdAt = this.createTimestamp();
    const workflowChainId = normalizeCreationReference(
      command.workflowChainId,
      'EngineeringSession workflowChainId',
    );
    const currentWorkflowStepId = normalizeCreationReference(
      command.currentWorkflowStepId,
      'EngineeringSession currentWorkflowStepId',
    );
    const workflowChain = await this.workflowChainRepository.getById(workflowChainId);

    const engineeringSession = EngineeringSession.create(
      {
        id: command.id ?? this.createIdentity(),
        engineeringRuntimeContextReference: command.engineeringRuntimeContextReference,
        activeEngineeringWorkflowReference: command.activeEngineeringWorkflowReference,
        workflowChainId,
        currentWorkflowStepId,
        participatingRoleIds: command.participatingRoleIds,
        workflowState: command.workflowState,
        timeline: {
          createdAt,
        },
        diagnostics: command.diagnostics ?? [],
        collaborationMetadata: command.collaborationMetadata ?? {},
      },
      workflowChain,
    );

    await this.repository.create(engineeringSession);

    return engineeringSession.toSnapshot();
  }

  public async closeEngineeringSession(
    command: CloseEngineeringSessionCommand,
  ): Promise<EngineeringSessionSnapshot> {
    const engineeringSession = await this.requireEngineeringSession(command.engineeringSessionId);

    engineeringSession.close(this.createTimestamp());
    await this.repository.save(engineeringSession);

    return engineeringSession.toSnapshot();
  }

  public async advanceWorkflow(
    command: AdvanceEngineeringSessionWorkflowCommand,
  ): Promise<EngineeringSessionSnapshot> {
    const engineeringSession = await this.requireEngineeringSession(command.engineeringSessionId);
    const workflowChain = await this.workflowChainRepository.getById(engineeringSession.workflowChainId);

    engineeringSession.advanceWorkflow(workflowChain);
    await this.repository.save(engineeringSession);

    return engineeringSession.toSnapshot();
  }

  public async advanceWorkflowOnTrigger(
    command: AdvanceEngineeringSessionWorkflowOnTriggerCommand,
  ): Promise<EngineeringSessionSnapshot> {
    const engineeringSession = await this.requireEngineeringSession(command.engineeringSessionId);
    const workflowChain = await this.workflowChainRepository.getById(engineeringSession.workflowChainId);
    const trigger = AdvancementTrigger.create(command.trigger);

    engineeringSession.advanceWorkflowOnTrigger(trigger, workflowChain);
    await this.repository.save(engineeringSession);

    return engineeringSession.toSnapshot();
  }

  public async advanceWorkflowAfterReview(
    command: AdvanceEngineeringSessionWorkflowAfterReviewCommand,
  ): Promise<EngineeringSessionSnapshot> {
    const engineeringSession = await this.requireEngineeringSession(command.engineeringSessionId);
    const workflowChain = await this.workflowChainRepository.getById(engineeringSession.workflowChainId);
    const reviewOutcome = ReviewOutcome.fromString(command.reviewOutcome);

    engineeringSession.advanceWorkflowAfterReview(reviewOutcome, workflowChain);
    await this.repository.save(engineeringSession);

    return engineeringSession.toSnapshot();
  }

  public async executeCurrentWorkflowStep(
    command: ExecuteCurrentWorkflowStepCommand,
  ): Promise<EngineeringSessionWorkflowExecutionResult> {
    const executionStrategyService = this.requireExecutionStrategyService();
    const adapterService = this.requireAdapterService();
    const executionSessionService = this.requireExecutionSessionService();
    const engineeringSession = await this.requireEngineeringSession(command.engineeringSessionId);
    const workflowChain = await this.workflowChainRepository.getById(engineeringSession.workflowChainId);
    const executionTarget = engineeringSession.executeCurrentWorkflowStep(workflowChain);
    const workflowStepRoleId = executionTarget.roleId;
    const adapterId = normalizeCreationReference(command.adapterId, 'EngineeringSession adapterId');
    const taskId = normalizeCreationReference(command.taskId, 'EngineeringSession taskId');
    const contextPackageReference = normalizeCreationReference(
      command.contextPackageReference,
      'EngineeringSession contextPackageReference',
    );
    const consumedProjectionVersion = normalizeCreationReference(
      command.consumedProjectionVersion,
      'EngineeringSession consumedProjectionVersion',
    );
    const readiness = await this.evaluateReadiness(
      command,
      taskId,
      workflowStepRoleId,
      engineeringSession.toSnapshot(),
      adapterId,
      executionStrategyService,
    );

    if (readiness.status === 'ReadinessRejected') {
      return readiness;
    }

    const readinessResult = readiness.readiness;
    const assignmentPolicyEvaluation = await this.evaluateAssignmentPolicy(
      command,
      workflowStepRoleId,
      engineeringSession.toSnapshot(),
      taskId,
      adapterId,
    );

    if (assignmentPolicyEvaluation?.status === 'AssignmentPolicyRejected') {
      return assignmentPolicyEvaluation;
    }

    const startedAt = this.createTimestamp();
    const adapterResponse = await adapterService.dispatch({
      adapterId,
      request: AdapterRequest.create({
        engineeringRole: workflowStepRoleId,
        taskId,
        contextPackageReference,
        ...(command.executionConstraints === undefined
          ? {}
          : { executionConstraints: command.executionConstraints }),
        requestMetadata: {
          ...(command.requestMetadata ?? {}),
          executionStrategyId: readinessResult.executionStrategyId,
          missionId: readinessResult.missionId,
          missionPlanId: readinessResult.missionPlanId,
          roleId: workflowStepRoleId,
          workflowChainId: executionTarget.workflowChainId,
          currentWorkflowStepId: executionTarget.currentWorkflowStepId,
        },
      }),
    });
    const completedAt = this.createTimestamp();
    const executionSession = await executionSessionService.createExecutionSession({
      engineeringSessionId: engineeringSession.id.toString(),
      assignedRole: workflowStepRoleId,
      assignedAdapter: adapterId,
      startedAt,
      completedAt,
      consumedProjectionVersion,
      producedArtifacts: adapterResponse.producedArtifacts,
      executionOutcome: adapterResponse.status,
    });

    return Object.freeze({
      status: adapterResponse.status,
      engineeringSession: engineeringSession.toSnapshot(),
      workflowChainId: executionTarget.workflowChainId,
      currentWorkflowStepId: executionTarget.currentWorkflowStepId,
      workflowStepRoleId,
      taskId,
      adapterId,
      readiness: readinessResult,
      ...(assignmentPolicyEvaluation === undefined
        ? {}
        : { assignmentPolicy: assignmentPolicyEvaluation.assignmentPolicy }),
      adapterResponse: adapterResponse.toSnapshot(),
      executionSession,
      diagnostics: adapterResponse.diagnostics.map((diagnostic) =>
        Object.freeze({
          code: diagnostic.code,
          message: diagnostic.message,
          recordedAt: completedAt,
        }),
      ),
    });
  }

  public async getEngineeringSession(engineeringSessionId: string): Promise<EngineeringSessionSnapshot> {
    return (await this.requireEngineeringSession(engineeringSessionId)).toSnapshot();
  }

  public async enumerateEngineeringSessions(): Promise<readonly EngineeringSessionSnapshot[]> {
    return Object.freeze(
      (await this.repository.enumerate()).map((engineeringSession) =>
        engineeringSession.toSnapshot(),
      ),
    );
  }

  private async requireEngineeringSession(
    engineeringSessionId: EngineeringSessionId | string,
  ): Promise<EngineeringSession> {
    const normalizedEngineeringSessionId =
      typeof engineeringSessionId === 'string'
        ? EngineeringSessionId.fromString(engineeringSessionId)
        : engineeringSessionId;
    const engineeringSession = await this.repository.getById(normalizedEngineeringSessionId);

    if (engineeringSession === undefined) {
      throw new EngineeringSessionNotFoundError(normalizedEngineeringSessionId.toString());
    }

    return engineeringSession;
  }

  private async evaluateReadiness(
    command: ExecuteCurrentWorkflowStepCommand,
    taskId: string,
    workflowStepRoleId: string,
    engineeringSession: EngineeringSessionSnapshot,
    adapterId: string,
    executionStrategyService: Pick<ExecutionStrategyService, 'evaluateAssignmentReadiness'>,
  ): Promise<WorkflowExecutionReadinessEvaluation> {
    try {
      const readiness = await executionStrategyService.evaluateAssignmentReadiness({
        executionStrategyId: command.executionStrategyId,
        missionPlanId: command.missionPlanId,
        taskId,
      });

      if (readiness.roleId !== workflowStepRoleId) {
        return this.createReadinessRejectedResult(
          engineeringSession,
          workflowStepRoleId,
          taskId,
          adapterId,
          'engineering-session.workflow-step-role-mismatch',
          `WorkflowStep Role '${workflowStepRoleId}' does not match Assignment Role '${readiness.roleId}'.`,
        );
      }

      return Object.freeze({
        status: 'Ready' as const,
        readiness,
      });
    } catch (error) {
      if (error instanceof KernelError) {
        return this.createReadinessRejectedResult(
          engineeringSession,
          workflowStepRoleId,
          taskId,
          adapterId,
          'engineering-session.readiness-rejected',
          error.message,
        );
      }

      throw error;
    }
  }

  private createReadinessRejectedResult(
    engineeringSession: EngineeringSessionSnapshot,
    workflowStepRoleId: string,
    taskId: string,
    adapterId: string,
    code: string,
    message: string,
  ): ReadinessRejectedWorkflowExecutionResult {
    return Object.freeze({
      status: 'ReadinessRejected',
      engineeringSession,
      workflowChainId: engineeringSession.workflowChainId,
      currentWorkflowStepId: engineeringSession.currentWorkflowStepId,
      workflowStepRoleId,
      taskId,
      adapterId,
      diagnostics: Object.freeze([
        Object.freeze({
          code,
          message,
          recordedAt: this.createTimestamp(),
        }),
      ]),
    });
  }

  private async evaluateAssignmentPolicy(
    command: ExecuteCurrentWorkflowStepCommand,
    workflowStepRoleId: string,
    engineeringSession: EngineeringSessionSnapshot,
    taskId: string,
    adapterId: string,
  ): Promise<WorkflowExecutionAssignmentPolicyEvaluation | undefined> {
    if (command.assignmentPolicyId === undefined) {
      return undefined;
    }

    if (command.assignmentPolicyEvaluationInput === undefined) {
      throw new InvalidEngineeringSessionDefinitionError(
        'EngineeringSession Workflow Chain Execution Assignment Policy Evaluation requires assignmentPolicyEvaluationInput.',
      );
    }

    const assignmentPolicyService = this.requireAssignmentPolicyService();
    const assignmentPolicyId = normalizeCreationReference(
      command.assignmentPolicyId,
      'EngineeringSession assignmentPolicyId',
    );
    const assignmentPolicy = await assignmentPolicyService.evaluateAssignmentPolicy({
      assignmentPolicyId,
      input: {
        requiredRole: workflowStepRoleId,
        ...command.assignmentPolicyEvaluationInput,
      },
    });

    if (assignmentPolicy.satisfied) {
      return Object.freeze({
        status: 'Satisfied' as const,
        assignmentPolicy,
      });
    }

    return Object.freeze({
      status: 'AssignmentPolicyRejected',
      engineeringSession,
      workflowChainId: engineeringSession.workflowChainId,
      currentWorkflowStepId: engineeringSession.currentWorkflowStepId,
      workflowStepRoleId,
      taskId,
      adapterId,
      assignmentPolicy,
      diagnostics: Object.freeze([
        Object.freeze({
          code: 'engineering-session.assignment-policy-rejected',
          message: `AssignmentPolicy '${assignmentPolicy.assignmentPolicyId}' was not satisfied for WorkflowStep Role '${workflowStepRoleId}'.`,
          recordedAt: this.createTimestamp(),
        }),
      ]),
    });
  }

  private requireExecutionStrategyService(): Pick<
    ExecutionStrategyService,
    'evaluateAssignmentReadiness'
  > {
    if (this.executionStrategyService === undefined) {
      throw new InvalidEngineeringSessionDefinitionError(
        'EngineeringSession Workflow Chain Execution requires ExecutionStrategyService.',
      );
    }

    return this.executionStrategyService;
  }

  private requireAdapterService(): Pick<AdapterService, 'dispatch'> {
    if (this.adapterService === undefined) {
      throw new InvalidEngineeringSessionDefinitionError(
        'EngineeringSession Workflow Chain Execution requires AdapterService.',
      );
    }

    return this.adapterService;
  }

  private requireExecutionSessionService(): Pick<
    ExecutionSessionService,
    'createExecutionSession'
  > {
    if (this.executionSessionService === undefined) {
      throw new InvalidEngineeringSessionDefinitionError(
        'EngineeringSession Workflow Chain Execution requires ExecutionSessionService.',
      );
    }

    return this.executionSessionService;
  }

  private requireAssignmentPolicyService(): Pick<
    AssignmentPolicyService,
    'evaluateAssignmentPolicy'
  > {
    if (this.assignmentPolicyService === undefined) {
      throw new InvalidEngineeringSessionDefinitionError(
        'EngineeringSession Workflow Chain Execution Assignment Policy Evaluation requires AssignmentPolicyService.',
      );
    }

    return this.assignmentPolicyService;
  }
}

function normalizeCreationReference(value: unknown, label: string): string {
  if (typeof value !== 'string') {
    throw new InvalidEngineeringSessionDefinitionError(`${label} must be a non-empty string.`);
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidEngineeringSessionDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
