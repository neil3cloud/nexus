import { describe, expect, it } from 'vitest';

import { MOCK_ADAPTER_ID, createMockAdapter } from '../../../src/adapters/mock/mock-adapter';
import { AdapterResponse } from '../../../src/kernel/adapter/adapter-response';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';
import { createKernelServices } from '../../../src/kernel/common/create-kernel-services';
import type { IKernelService } from '../../../src/kernel/common/kernel-service';
import { AdapterService } from '../../../src/kernel/adapter/adapter.service';
import { Evidence } from '../../../src/kernel/evidence/evidence.aggregate';
import { EvidenceService } from '../../../src/kernel/evidence/evidence.service';
import { ExecutionRole } from '../../../src/kernel/execution/execution-role';
import { ExecutionStrategyService } from '../../../src/kernel/execution/execution-strategy.service';
import { RoleAssignment } from '../../../src/kernel/execution/role-assignment';
import { RoleService } from '../../../src/kernel/execution/role.service';
import { Kernel } from '../../../src/kernel/kernel';
import { KnowledgeService } from '../../../src/kernel/knowledge/knowledge.service';
import type { KnowledgeSnapshot } from '../../../src/kernel/knowledge/knowledge.types';
import { MissionExecutionService } from '../../../src/kernel/mission/mission-execution.service';
import { MissionPlanningService } from '../../../src/kernel/mission/mission-planning.service';
import { MissionService } from '../../../src/kernel/mission/mission.service';
import type { MissionStatus } from '../../../src/kernel/mission/mission.types';
import type { TaskStatus } from '../../../src/kernel/mission/mission-planning.types';
import { ReviewService } from '../../../src/kernel/review/review.service';
import type {
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
import { HostMissionWorkflowError } from '../../../src/hosts/vscode/host-mission-workflow.errors';

describe('HostMissionWorkflow', () => {
  it('executes the Sprint 26 Mission workflow Adapter pipeline sequence', async () => {
    const recorder = new ServiceCallRecorder();
    const presentation = new RecordingPresentationSurface();
    const workflow = new HostMissionWorkflow(
      new RecordingMissionService(recorder),
      new RecordingPlanningService(recorder),
      new RecordingExecutionService(recorder),
      createRecordingPipeline(recorder),
      createRecordingCompletion(recorder),
      presentation,
      new StaticWorkspaceTrustSurface(true),
      createDeterministicIdentity([
        'sprint-26-mission',
        'sprint-26-plan',
        'sprint-26-task',
        'sprint-26-strategy',
        'sprint-26-evidence',
        'sprint-26-review',
        'sprint-26-finding',
        'sprint-26-knowledge',
      ]),
    );

    const result = await workflow.runDeveloperMissionWorkflow({
      objective: 'Run a Sprint 25 developer workflow.',
      taskTitle: 'Execute developer task',
      taskDescription: 'Complete the single developer workflow task.',
    });

    expect(result).toMatchObject({
      missionId: 'mission-sprint-26-mission',
      missionPlanId: 'mission-plan-sprint-26-plan',
      taskId: 'task-sprint-26-task',
      finalStatus: 'Completed',
      missionPlanRevision: 3,
      taskStatus: 'Completed',
      adapterId: MOCK_ADAPTER_ID,
      adapterDispatchStatus: 'Completed',
      reviewOutcome: 'Accepted',
      knowledgeCaptureStatus: 'Candidate',
      knowledge: {
        id: 'knowledge-sprint-26-knowledge',
        status: 'Candidate',
        supportingReviewId: 'review-sprint-26-review',
        supportingEvidenceIds: ['evidence-sprint-26-evidence'],
      },
    });
    expect(recorder.calls).toEqual([
      'MissionService.createMission',
      'MissionPlanningService.createMissionPlan',
      'MissionService.planMission',
      'MissionPlanningService.addTask',
      'MissionPlanningService.updateTask',
      'MissionService.markMissionReady',
      'MissionExecutionService.startMission',
      'MissionExecutionService.startTask',
      'ExecutionStrategyService.createExecutionStrategy',
      'RoleService.assignRole',
      'ExecutionStrategyService.evaluateAssignmentReadiness',
      'RoleService.retrieveRole',
      'AdapterService.dispatch',
      'MissionExecutionService.completeTask',
      'MissionService.reviewMission',
      'MissionExecutionService.completeMission',
      'EvidenceService.registerEvidence',
      'ReviewService.startReview',
      'ReviewService.publishFinding',
      'ReviewService.finalizeReviewOutcome',
      'KnowledgeService.captureKnowledge',
    ]);
    expect(presentation.lines).toContain(
      'Mission Workflow Progress: started mission-sprint-26-mission',
    );
    expect(presentation.lines).toContain('Adapter Dispatch Status: Completed');
    expect(presentation.lines).toContain('Mission Status: Completed');
    expect(presentation.lines).toContain('MissionPlan Revision: 3');
    expect(presentation.lines).toContain('Task Status: Completed');
    expect(presentation.lines).toContain('Review Finding: Developer Workflow completion evidence recorded.');
    expect(presentation.lines).toContain('Review Outcome: Accepted');
    expect(presentation.lines).toContain('Knowledge Capture Status: Candidate');
    expect(workflow.showMissionWorkflowHistory()).toEqual([
      {
        missionId: 'mission-sprint-26-mission',
        objective: 'Run a Sprint 25 developer workflow.',
        finalStatus: 'Completed',
        adapterId: MOCK_ADAPTER_ID,
        adapterDispatchStatus: 'Completed',
        reviewOutcome: 'Accepted',
        knowledgeCaptureStatus: 'Candidate',
      },
    ]);
  });

  it('labels Builder Workflow results with the assigned Execution Role', async () => {
    const recorder = new ServiceCallRecorder();
    const presentation = new RecordingPresentationSurface();
    const workflow = new HostMissionWorkflow(
      new RecordingMissionService(recorder),
      new RecordingPlanningService(recorder),
      new RecordingExecutionService(recorder),
      createRecordingPipeline(recorder),
      createRecordingCompletion(recorder),
      presentation,
      new StaticWorkspaceTrustSurface(true),
      createDeterministicIdentity([
        'builder-mission',
        'builder-plan',
        'builder-task',
        'builder-strategy',
        'builder-evidence',
        'builder-review',
        'builder-finding',
        'builder-knowledge',
      ]),
      {
        workflowLabel: 'Builder Workflow',
        completionMessageLabel: 'Builder workflow',
        includeAssignedRole: true,
      },
    );

    const result = await workflow.runDeveloperMissionWorkflow({
      objective: 'Run a Sprint 35 Builder Workflow.',
      taskTitle: 'Execute builder task',
      taskDescription: 'Complete the single Builder Workflow task.',
    });

    expect(result).toMatchObject({
      missionId: 'mission-builder-mission',
      assignedRoleId: 'builder',
      assignedRoleName: 'Builder',
      finalStatus: 'Completed',
      adapterId: MOCK_ADAPTER_ID,
    });
    expect(presentation.lines).toContain('Builder Workflow Progress: started mission-builder-mission');
    expect(presentation.lines).toContain('Nexus Builder Workflow: mission-builder-mission');
    expect(presentation.lines).toContain('Assigned Role: Builder (builder)');
    expect(presentation.lines).toContain('Builder Workflow Progress: completed mission-builder-mission');
    expect(workflow.showMissionWorkflowHistory()).toEqual([
      {
        missionId: 'mission-builder-mission',
        objective: 'Run a Sprint 35 Builder Workflow.',
        finalStatus: 'Completed',
        assignedRoleId: 'builder',
        assignedRoleName: 'Builder',
        adapterId: MOCK_ADAPTER_ID,
        adapterDispatchStatus: 'Completed',
        reviewOutcome: 'Accepted',
        knowledgeCaptureStatus: 'Candidate',
      },
    ]);
    expect(presentation.lines).toContain('Nexus Builder Workflow History');
    expect(presentation.lines).toContain(
      'Mission History Entry: mission-builder-mission | Completed | Builder (builder) | mock-adapter | Completed | Accepted | Candidate | Run a Sprint 35 Builder Workflow.',
    );
  });

  it('labels Reviewer Workflow results with the assigned Execution Role', async () => {
    const recorder = new ServiceCallRecorder();
    const presentation = new RecordingPresentationSurface();
    const workflow = new HostMissionWorkflow(
      new RecordingMissionService(recorder),
      new RecordingPlanningService(recorder),
      new RecordingExecutionService(recorder),
      createRecordingPipeline(recorder, 'Completed', {
        id: 'reviewer',
        name: 'Reviewer',
        description: 'Responsible for validating engineering work against governing evidence.',
      }),
      createRecordingCompletion(recorder),
      presentation,
      new StaticWorkspaceTrustSurface(true),
      createDeterministicIdentity([
        'reviewer-mission',
        'reviewer-plan',
        'reviewer-task',
        'reviewer-strategy',
        'reviewer-evidence',
        'reviewer-review',
        'reviewer-finding',
        'reviewer-knowledge',
      ]),
      {
        workflowLabel: 'Reviewer Workflow',
        completionMessageLabel: 'Reviewer workflow',
        includeAssignedRole: true,
      },
    );

    const result = await workflow.runDeveloperMissionWorkflow({
      objective: 'Run a Sprint 36 Reviewer Workflow.',
      taskTitle: 'Execute reviewer task',
      taskDescription: 'Complete the single Reviewer Workflow task.',
    });

    expect(result).toMatchObject({
      missionId: 'mission-reviewer-mission',
      assignedRoleId: 'reviewer',
      assignedRoleName: 'Reviewer',
      finalStatus: 'Completed',
      adapterId: MOCK_ADAPTER_ID,
    });
    expect(presentation.lines).toContain('Reviewer Workflow Progress: started mission-reviewer-mission');
    expect(presentation.lines).toContain('Nexus Reviewer Workflow: mission-reviewer-mission');
    expect(presentation.lines).toContain('Assigned Role: Reviewer (reviewer)');
    expect(presentation.lines).toContain('Reviewer Workflow Progress: completed mission-reviewer-mission');
    expect(workflow.showMissionWorkflowHistory()).toEqual([
      {
        missionId: 'mission-reviewer-mission',
        objective: 'Run a Sprint 36 Reviewer Workflow.',
        finalStatus: 'Completed',
        assignedRoleId: 'reviewer',
        assignedRoleName: 'Reviewer',
        adapterId: MOCK_ADAPTER_ID,
        adapterDispatchStatus: 'Completed',
        reviewOutcome: 'Accepted',
        knowledgeCaptureStatus: 'Candidate',
      },
    ]);
    expect(presentation.lines).toContain('Nexus Reviewer Workflow History');
    expect(presentation.lines).toContain(
      'Mission History Entry: mission-reviewer-mission | Completed | Reviewer (reviewer) | mock-adapter | Completed | Accepted | Candidate | Run a Sprint 36 Reviewer Workflow.',
    );
  });

  it('labels Documentation Reviewer Workflow results with the assigned Execution Role', async () => {
    const recorder = new ServiceCallRecorder();
    const presentation = new RecordingPresentationSurface();
    const workflow = new HostMissionWorkflow(
      new RecordingMissionService(recorder),
      new RecordingPlanningService(recorder),
      new RecordingExecutionService(recorder),
      createRecordingPipeline(recorder, 'Completed', {
        id: 'documentation-reviewer',
        name: 'Documentation Reviewer',
        description: 'Responsible for validating engineering documentation against governing evidence.',
      }),
      createRecordingCompletion(recorder),
      presentation,
      new StaticWorkspaceTrustSurface(true),
      createDeterministicIdentity([
        'documentation-reviewer-mission',
        'documentation-reviewer-plan',
        'documentation-reviewer-task',
        'documentation-reviewer-strategy',
        'documentation-reviewer-evidence',
        'documentation-reviewer-review',
        'documentation-reviewer-finding',
        'documentation-reviewer-knowledge',
      ]),
      {
        workflowLabel: 'Documentation Reviewer Workflow',
        completionMessageLabel: 'Documentation Review completed',
        includeAssignedRole: true,
      },
    );

    const result = await workflow.runDeveloperMissionWorkflow({
      objective: 'Run a Sprint 37 Documentation Reviewer Workflow.',
      taskTitle: 'Execute documentation reviewer task',
      taskDescription: 'Complete the single Documentation Reviewer Workflow task.',
    });

    expect(result).toMatchObject({
      missionId: 'mission-documentation-reviewer-mission',
      assignedRoleId: 'documentation-reviewer',
      assignedRoleName: 'Documentation Reviewer',
      finalStatus: 'Completed',
      adapterId: MOCK_ADAPTER_ID,
    });
    expect(presentation.lines).toContain(
      'Documentation Reviewer Workflow Progress: started mission-documentation-reviewer-mission',
    );
    expect(presentation.lines).toContain(
      'Nexus Documentation Reviewer Workflow: mission-documentation-reviewer-mission',
    );
    expect(presentation.progressTitles).toContain(
      'Nexus Documentation Review completed: mission-documentation-reviewer-mission',
    );
    expect(presentation.lines).toContain(
      'Assigned Role: Documentation Reviewer (documentation-reviewer)',
    );
    expect(presentation.lines).toContain(
      'Documentation Reviewer Workflow Progress: completed mission-documentation-reviewer-mission',
    );
    expect(workflow.showMissionWorkflowHistory()).toEqual([
      {
        missionId: 'mission-documentation-reviewer-mission',
        objective: 'Run a Sprint 37 Documentation Reviewer Workflow.',
        finalStatus: 'Completed',
        assignedRoleId: 'documentation-reviewer',
        assignedRoleName: 'Documentation Reviewer',
        adapterId: MOCK_ADAPTER_ID,
        adapterDispatchStatus: 'Completed',
        reviewOutcome: 'Accepted',
        knowledgeCaptureStatus: 'Candidate',
      },
    ]);
    expect(presentation.lines).toContain('Nexus Documentation Reviewer Workflow History');
    expect(presentation.lines).toContain(
      'Mission History Entry: mission-documentation-reviewer-mission | Completed | Documentation Reviewer (documentation-reviewer) | mock-adapter | Completed | Accepted | Candidate | Run a Sprint 37 Documentation Reviewer Workflow.',
    );
  });

  it('refuses before any Kernel service call when workspace trust is not granted', async () => {
    const recorder = new ServiceCallRecorder();
    const presentation = new RecordingPresentationSurface();
    const workflow = new HostMissionWorkflow(
      new RecordingMissionService(recorder),
      new RecordingPlanningService(recorder),
      new RecordingExecutionService(recorder),
      createRecordingPipeline(recorder),
      createRecordingCompletion(recorder),
      presentation,
      new StaticWorkspaceTrustSurface(false),
      createDeterministicIdentity([
        'untrusted-mission',
        'untrusted-plan',
        'untrusted-task',
        'untrusted-strategy',
      ]),
    );

    await expect(
      workflow.runDeveloperMissionWorkflow({
        objective: 'Should not execute.',
        taskTitle: 'Blocked task',
        taskDescription: 'Trust gate blocks before Kernel calls.',
      }),
    ).rejects.toMatchObject({
      code: 'host-mission-workflow.workspace-not-trusted',
    } satisfies Partial<HostMissionWorkflowError>);
    expect(recorder.calls).toEqual([]);
    expect(workflow.showMissionWorkflowHistory()).toEqual([]);
    expect(presentation.lines).toContain(
      'Host Diagnostic host-mission-workflow.workspace-not-trusted: Workspace Trust is required before running Mission workflows.',
    );
  });

  it('stops on Kernel rejection without retrying or continuing and records last-known status', async () => {
    const recorder = new ServiceCallRecorder();
    const presentation = new RecordingPresentationSurface();
    const workflow = new HostMissionWorkflow(
      new RecordingMissionService(recorder),
      new RecordingPlanningService(recorder),
      new RejectingExecutionService(recorder),
      createRecordingPipeline(recorder),
      createRecordingCompletion(recorder),
      presentation,
      new StaticWorkspaceTrustSurface(true),
      createDeterministicIdentity(['reject-mission', 'reject-plan', 'reject-task', 'reject-strategy']),
    );

    await expect(
      workflow.runDeveloperMissionWorkflow({
        objective: 'Stop on rejection.',
        taskTitle: 'Rejected task',
        taskDescription: 'Kernel rejection stops the workflow.',
      }),
    ).rejects.toThrow('Kernel rejected Mission execution.');
    expect(recorder.calls).toEqual([
      'MissionService.createMission',
      'MissionPlanningService.createMissionPlan',
      'MissionService.planMission',
      'MissionPlanningService.addTask',
      'MissionPlanningService.updateTask',
      'MissionService.markMissionReady',
      'MissionExecutionService.startMission',
    ]);
    expect(workflow.showMissionWorkflowHistory()).toEqual([
      {
        missionId: 'mission-reject-mission',
        objective: 'Stop on rejection.',
        finalStatus: 'Ready',
        adapterId: MOCK_ADAPTER_ID,
      },
    ]);
    expect(presentation.lines).toContain(
      'Host Diagnostic host-mission-workflow.kernel-rejected: Kernel rejected Mission execution.',
    );
  });

  it('calls Knowledge capture unconditionally and stops on Kernel Knowledge rejection', async () => {
    const recorder = new ServiceCallRecorder();
    const presentation = new RecordingPresentationSurface();
    const workflow = new HostMissionWorkflow(
      new RecordingMissionService(recorder),
      new RecordingPlanningService(recorder),
      new RecordingExecutionService(recorder),
      createRecordingPipeline(recorder),
      createRecordingCompletion(recorder, true),
      presentation,
      new StaticWorkspaceTrustSurface(true),
      createDeterministicIdentity([
        'knowledge-reject-mission',
        'knowledge-reject-plan',
        'knowledge-reject-task',
        'knowledge-reject-strategy',
        'knowledge-reject-evidence',
        'knowledge-reject-review',
        'knowledge-reject-finding',
        'knowledge-reject-knowledge',
      ]),
    );

    await expect(
      workflow.runDeveloperMissionWorkflow({
        objective: 'Stop on Knowledge rejection.',
        taskTitle: 'Knowledge rejection task',
        taskDescription: 'Kernel Knowledge rejection stops the workflow.',
      }),
    ).rejects.toThrow('Kernel rejected Knowledge capture.');
    expect(recorder.calls).toEqual([
      'MissionService.createMission',
      'MissionPlanningService.createMissionPlan',
      'MissionService.planMission',
      'MissionPlanningService.addTask',
      'MissionPlanningService.updateTask',
      'MissionService.markMissionReady',
      'MissionExecutionService.startMission',
      'MissionExecutionService.startTask',
      'ExecutionStrategyService.createExecutionStrategy',
      'RoleService.assignRole',
      'ExecutionStrategyService.evaluateAssignmentReadiness',
      'RoleService.retrieveRole',
      'AdapterService.dispatch',
      'MissionExecutionService.completeTask',
      'MissionService.reviewMission',
      'MissionExecutionService.completeMission',
      'EvidenceService.registerEvidence',
      'ReviewService.startReview',
      'ReviewService.publishFinding',
      'ReviewService.finalizeReviewOutcome',
      'KnowledgeService.captureKnowledge',
    ]);
    expect(workflow.showMissionWorkflowHistory()).toEqual([
      {
        missionId: 'mission-knowledge-reject-mission',
        objective: 'Stop on Knowledge rejection.',
        finalStatus: 'Completed',
        adapterId: MOCK_ADAPTER_ID,
        adapterDispatchStatus: 'Completed',
        reviewOutcome: 'Accepted',
      },
    ]);
    expect(presentation.lines).toContain(
      'Host Diagnostic host-mission-workflow.kernel-rejected: Kernel rejected Knowledge capture.',
    );
    expect(presentation.lines).not.toContain('Mission Workflow Progress: completed mission-knowledge-reject-mission');
  });

  it('stops on non-Completed Adapter responses without completing the Task', async () => {
    const recorder = new ServiceCallRecorder();
    const presentation = new RecordingPresentationSurface();
    const workflow = new HostMissionWorkflow(
      new RecordingMissionService(recorder),
      new RecordingPlanningService(recorder),
      new RecordingExecutionService(recorder),
      createRecordingPipeline(recorder, 'Failed'),
      createRecordingCompletion(recorder),
      presentation,
      new StaticWorkspaceTrustSurface(true),
      createDeterministicIdentity(['failed-mission', 'failed-plan', 'failed-task', 'failed-strategy']),
    );

    await expect(
      workflow.runDeveloperMissionWorkflow({
        objective: 'Stop on Adapter failure.',
        taskTitle: 'Adapter failure task',
        taskDescription: 'Adapter failure stops before Task completion.',
      }),
    ).rejects.toMatchObject({
      code: 'host-mission-workflow.adapter-dispatch-failed',
    } satisfies Partial<HostMissionWorkflowError>);
    expect(recorder.calls).toEqual([
      'MissionService.createMission',
      'MissionPlanningService.createMissionPlan',
      'MissionService.planMission',
      'MissionPlanningService.addTask',
      'MissionPlanningService.updateTask',
      'MissionService.markMissionReady',
      'MissionExecutionService.startMission',
      'MissionExecutionService.startTask',
      'ExecutionStrategyService.createExecutionStrategy',
      'RoleService.assignRole',
      'ExecutionStrategyService.evaluateAssignmentReadiness',
      'RoleService.retrieveRole',
      'AdapterService.dispatch',
    ]);
    expect(workflow.showMissionWorkflowHistory()).toEqual([
      {
        missionId: 'mission-failed-mission',
        objective: 'Stop on Adapter failure.',
        finalStatus: 'Executing',
        adapterId: MOCK_ADAPTER_ID,
        adapterDispatchStatus: 'Failed',
      },
    ]);
    expect(presentation.lines).toContain(
      'Adapter Diagnostic mock-adapter.execution-failed: Mock Adapter deterministically failed the request.',
    );
  });

  it('composes with real Kernel services and completes a single-Task Mission', async () => {
    let services: readonly IKernelService[] = [];
    const kernel = new Kernel((eventBus) => {
      services = createKernelServices(eventBus, { adapters: [createMockAdapter()] });

      return services;
    }, new NullLogger());
    const workflow = new HostMissionWorkflow(
      requireService(
        services,
        'MissionService',
        (service): service is MissionService => service instanceof MissionService,
      ),
      requireService(
        services,
        'MissionPlanningService',
        (service): service is MissionPlanningService => service instanceof MissionPlanningService,
      ),
      requireService(
        services,
        'MissionExecutionService',
        (service): service is MissionExecutionService => service instanceof MissionExecutionService,
      ),
      {
        roleService: requireService(
          services,
          'RoleService',
          (service): service is RoleService => service instanceof RoleService,
        ),
        executionStrategyService: requireService(
          services,
          'ExecutionStrategyService',
          (service): service is ExecutionStrategyService => service instanceof ExecutionStrategyService,
        ),
        adapterService: requireService(
          services,
          'AdapterService',
          (service): service is AdapterService => service instanceof AdapterService,
        ),
        adapterId: MOCK_ADAPTER_ID,
        requiredCapability: 'CodeModification',
      },
      {
        evidenceService: requireService(
          services,
          'EvidenceService',
          (service): service is EvidenceService => service instanceof EvidenceService,
        ),
        reviewService: requireService(
          services,
          'ReviewService',
          (service): service is ReviewService => service instanceof ReviewService,
        ),
        knowledgeService: requireService(
          services,
          'KnowledgeService',
          (service): service is KnowledgeService => service instanceof KnowledgeService,
        ),
      },
      new RecordingPresentationSurface(),
      new StaticWorkspaceTrustSurface(true),
      createDeterministicIdentity([
        'integration-mission',
        'integration-plan',
        'integration-task',
        'integration-strategy',
        'integration-evidence',
        'integration-review',
        'integration-finding',
        'integration-knowledge',
      ]),
    );

    await kernel.initialize();

    const result = await workflow.runDeveloperMissionWorkflow({
      objective: 'Validate Sprint 25 Host Mission workflow integration.',
      taskTitle: 'Execute Sprint 25 integration task',
      taskDescription: 'Validate the Host calls public Kernel Mission contracts only.',
    });

    expect(result.finalStatus).toBe('Completed');
    expect(result.taskStatus).toBe('Completed');
    expect(result.adapterDispatchStatus).toBe('Completed');
    expect(result.reviewOutcome).toBe('Accepted');
    expect(result.knowledgeCaptureStatus).toBe('Candidate');
    expect(result.knowledge.id).toBe('knowledge-integration-knowledge');
    expect(result.missionPlanRevision).toBe(3);
    expect(kernel.getEventBus().replay(result.missionId).map((event) => event.eventType)).toEqual([
      'MissionCreated',
      'MissionPlanCreated',
      'MissionPlanned',
      'TaskCreated',
      'MissionReady',
      'MissionStarted',
      'TaskStarted',
      'TaskCompleted',
      'MissionReviewed',
      'MissionCompleted',
      'EvidenceCaptured',
      'ReviewStarted',
      'FindingCreated',
      'ReviewCompleted',
      'ReviewAccepted',
      'KnowledgeCandidateCreated',
    ]);

    kernel.dispose();
  });
});

class ServiceCallRecorder {
  public readonly calls: string[] = [];
}

class RecordingMissionService implements MissionWorkflowMissionService {
  public constructor(private readonly recorder: ServiceCallRecorder) {}

  public async createMission(): Promise<MissionWorkflowMissionState> {
    this.recorder.calls.push('MissionService.createMission');

    return missionState('mission', 'Draft');
  }

  public async planMission(): Promise<MissionWorkflowMissionState> {
    this.recorder.calls.push('MissionService.planMission');

    return missionState('mission', 'Planned');
  }

  public async markMissionReady(): Promise<MissionWorkflowMissionState> {
    this.recorder.calls.push('MissionService.markMissionReady');

    return missionState('mission', 'Ready');
  }

  public async reviewMission(): Promise<MissionWorkflowMissionState> {
    this.recorder.calls.push('MissionService.reviewMission');

    return missionState('mission', 'Reviewing');
  }
}

class RecordingPlanningService implements MissionWorkflowPlanningService {
  public constructor(private readonly recorder: ServiceCallRecorder) {}

  public async createMissionPlan(
    request: Parameters<MissionWorkflowPlanningService['createMissionPlan']>[0],
  ): Promise<MissionWorkflowPlanState> {
    this.recorder.calls.push('MissionPlanningService.createMissionPlan');

    return planState(request.id ?? 'generated-mission-plan', 1, 'task-sprint-26-task', 'Planned');
  }

  public async addTask(request: Parameters<MissionWorkflowPlanningService['addTask']>[0]): Promise<MissionWorkflowPlanState> {
    this.recorder.calls.push('MissionPlanningService.addTask');

    return planState('mission-plan', 2, request.taskId ?? 'generated-task', 'Planned');
  }

  public async updateTask(request: Parameters<MissionWorkflowPlanningService['updateTask']>[0]): Promise<MissionWorkflowPlanState> {
    this.recorder.calls.push('MissionPlanningService.updateTask');

    return planState('mission-plan', 3, request.taskId, 'Ready');
  }
}

function createRecordingPipeline(
  recorder: ServiceCallRecorder,
  adapterStatus: 'Completed' | 'Failed' = 'Completed',
  role: {
    readonly id: string;
    readonly name: string;
    readonly description: string;
  } = {
    id: 'builder',
    name: 'Builder',
    description: 'Responsible for implementing authorized engineering changes.',
  },
): MissionWorkflowPipelineServices {
  return {
    roleService: {
      async assignRole(input) {
        recorder.calls.push('RoleService.assignRole');

        return RoleAssignment.create(input);
      },
      async retrieveRole() {
        recorder.calls.push('RoleService.retrieveRole');

        return ExecutionRole.create({
          id: role.id,
          name: role.name,
          description: role.description,
          category: 'Engineering Responsibility',
        });
      },
    },
    executionStrategyService: {
      async createExecutionStrategy(input) {
        recorder.calls.push('ExecutionStrategyService.createExecutionStrategy');

        return {
          id: input.id ?? 'generated-execution-strategy',
          missionId: input.missionId,
          dependencyOrderingRule: 'RequireCompletedDependencies',
          concurrencyRule: 'IndependentTasksMayBeReadyConcurrently',
        };
      },
      async evaluateAssignmentReadiness(input) {
        recorder.calls.push('ExecutionStrategyService.evaluateAssignmentReadiness');

        return {
          executionStrategyId: input.executionStrategyId,
          missionId: 'mission-sprint-26-mission',
          missionPlanId: input.missionPlanId,
          taskId: input.taskId,
          roleId: role.id,
          ready: true,
          satisfiedDependencyTaskIds: [],
          concurrencyRule: 'IndependentTasksMayBeReadyConcurrently',
        };
      },
    },
    adapterService: {
      async dispatch() {
        recorder.calls.push('AdapterService.dispatch');

        return AdapterResponse.create(
          adapterStatus === 'Completed'
            ? {
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
              }
            : {
                status: 'Failed',
                diagnostics: [
                  {
                    code: 'mock-adapter.execution-failed',
                    message: 'Mock Adapter deterministically failed the request.',
                  },
                ],
                executionMetadata: {
                  adapterId: MOCK_ADAPTER_ID,
                },
              },
        );
      },
    },
    adapterId: MOCK_ADAPTER_ID,
    requiredCapability: 'CodeModification',
  };
}

function createRecordingCompletion(
  recorder: ServiceCallRecorder,
  rejectKnowledge = false,
): MissionWorkflowCompletionServices {
  return {
    evidenceService: {
      async registerEvidence(request) {
        recorder.calls.push('EvidenceService.registerEvidence');

        return Evidence.register(request);
      },
    },
    reviewService: {
      async startReview(command) {
        recorder.calls.push('ReviewService.startReview');

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
        recorder.calls.push('ReviewService.publishFinding');

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
        recorder.calls.push('ReviewService.finalizeReviewOutcome');

        return {
          review: {
            id: command.reviewId,
            missionId: 'mission-sprint-26-mission',
            missionPlanRevision: { kind: 'ExecutableMissionPlan', revisionId: 'revision-3' },
            status: 'Completed',
            outcome: 'Accepted',
            reviewCriteria: [
              {
                id: 'sprint-27-developer-workflow-completion',
                description: 'Sprint 27 Developer Workflow completion acceptance criteria.',
              },
            ],
            evidenceReferences: ['evidence-sprint-26-evidence'],
            findings: [],
          },
          findings: [],
        };
      },
    },
    knowledgeService: {
      async captureKnowledge(request) {
        recorder.calls.push('KnowledgeService.captureKnowledge');

        if (rejectKnowledge) {
          throw new Error('Kernel rejected Knowledge capture.');
        }

        return knowledgeSnapshot(request);
      },
    },
  };
}

class RecordingExecutionService implements MissionWorkflowExecutionService {
  public constructor(private readonly recorder: ServiceCallRecorder) {}

  public async startMission(): Promise<MissionWorkflowMissionState> {
    this.recorder.calls.push('MissionExecutionService.startMission');

    return missionState('mission', 'Executing');
  }

  public async startTask(request: Parameters<MissionWorkflowExecutionService['startTask']>[0]): Promise<MissionWorkflowPlanState> {
    this.recorder.calls.push('MissionExecutionService.startTask');

    return planState('mission-plan', 3, request.taskId, 'InProgress');
  }

  public async completeTask(request: Parameters<MissionWorkflowExecutionService['completeTask']>[0]): Promise<MissionWorkflowPlanState> {
    this.recorder.calls.push('MissionExecutionService.completeTask');

    return planState('mission-plan', 3, request.taskId, 'Completed');
  }

  public async completeMission(): Promise<MissionWorkflowMissionState> {
    this.recorder.calls.push('MissionExecutionService.completeMission');

    return missionState('mission', 'Completed');
  }
}

class RejectingExecutionService extends RecordingExecutionService {
  public override async startMission(): Promise<MissionWorkflowMissionState> {
    await super.startMission();

    throw new Error('Kernel rejected Mission execution.');
  }
}

class RecordingPresentationSurface implements HostPresentationSurface {
  public readonly lines: string[] = [];
  public readonly progressTitles: string[] = [];

  public appendLine(message: string): void {
    this.lines.push(message);
  }

  public async showInformationMessage(): Promise<void> {}

  public async showErrorMessage(): Promise<void> {}

  public async withProgress<T>(options: HostProgressOptions, operation: () => Promise<T>): Promise<T> {
    this.progressTitles.push(options.title);

    return operation();
  }
}

class StaticWorkspaceTrustSurface implements HostWorkspaceTrustSurface {
  public constructor(private readonly trusted: boolean) {}

  public isWorkspaceTrusted(): boolean {
    return this.trusted;
  }
}

class NullLogger implements KernelLogger {
  public info(): void {}

  public error(): void {}
}

function missionState(id: string, status: MissionStatus): MissionWorkflowMissionState {
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
  status: TaskStatus,
): MissionWorkflowPlanState {
  return {
    id: {
      toString: () => id,
    },
    revisionNumber,
    tasks: [
      {
        id: taskId,
        status,
      },
    ],
  };
}

function knowledgeSnapshot(input: Parameters<KnowledgeService['captureKnowledge']>[0]): KnowledgeSnapshot {
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

function createDeterministicIdentity(values: string[]): () => string {
  return () => {
    const value = values.shift();

    if (value === undefined) {
      throw new Error('No deterministic identity value remains.');
    }

    return value;
  };
}

function requireService<T extends IKernelService>(
  services: readonly IKernelService[],
  serviceName: string,
  isService: (service: IKernelService) => service is T,
): T {
  const service = services.find(isService);

  if (service === undefined) {
    throw new Error(`Expected ${serviceName} to be composed by createKernelServices.`);
  }

  return service;
}
