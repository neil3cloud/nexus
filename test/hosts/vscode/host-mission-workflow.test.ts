import { describe, expect, it } from 'vitest';

import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';
import { createKernelServices } from '../../../src/kernel/common/create-kernel-services';
import type { IKernelService } from '../../../src/kernel/common/kernel-service';
import { Kernel } from '../../../src/kernel/kernel';
import { MissionExecutionService } from '../../../src/kernel/mission/mission-execution.service';
import { MissionPlanningService } from '../../../src/kernel/mission/mission-planning.service';
import { MissionService } from '../../../src/kernel/mission/mission.service';
import type { MissionStatus } from '../../../src/kernel/mission/mission.types';
import type { TaskStatus } from '../../../src/kernel/mission/mission-planning.types';
import type {
  HostPresentationSurface,
  HostProgressOptions,
  HostWorkspaceTrustSurface,
} from '../../../src/hosts/vscode/host.contract';
import {
  HostMissionWorkflow,
  type MissionWorkflowExecutionService,
  type MissionWorkflowMissionService,
  type MissionWorkflowMissionState,
  type MissionWorkflowPlanningService,
  type MissionWorkflowPlanState,
} from '../../../src/hosts/vscode/host-mission-workflow';
import { HostMissionWorkflowError } from '../../../src/hosts/vscode/host-mission-workflow.errors';

describe('HostMissionWorkflow', () => {
  it('executes the Sprint 25 eleven-call Mission workflow sequence', async () => {
    const recorder = new ServiceCallRecorder();
    const presentation = new RecordingPresentationSurface();
    const workflow = new HostMissionWorkflow(
      new RecordingMissionService(recorder),
      new RecordingPlanningService(recorder),
      new RecordingExecutionService(recorder),
      presentation,
      new StaticWorkspaceTrustSurface(true),
      createDeterministicIdentity(['sprint-25-mission', 'sprint-25-plan', 'sprint-25-task']),
    );

    await expect(
      workflow.runDeveloperMissionWorkflow({
        objective: 'Run a Sprint 25 developer workflow.',
        taskTitle: 'Execute developer task',
        taskDescription: 'Complete the single developer workflow task.',
      }),
    ).resolves.toEqual({
      missionId: 'mission-sprint-25-mission',
      missionPlanId: 'mission-plan-sprint-25-plan',
      taskId: 'task-sprint-25-task',
      finalStatus: 'Completed',
      missionPlanRevision: 3,
      taskStatus: 'Completed',
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
      'MissionExecutionService.completeTask',
      'MissionService.reviewMission',
      'MissionExecutionService.completeMission',
    ]);
    expect(presentation.lines).toContain(
      'Mission Workflow Progress: started mission-sprint-25-mission',
    );
    expect(presentation.lines).toContain('Mission Status: Completed');
    expect(presentation.lines).toContain('MissionPlan Revision: 3');
    expect(presentation.lines).toContain('Task Status: Completed');
    expect(workflow.showMissionWorkflowHistory()).toEqual([
      {
        missionId: 'mission-sprint-25-mission',
        objective: 'Run a Sprint 25 developer workflow.',
        finalStatus: 'Completed',
      },
    ]);
  });

  it('refuses before any Kernel service call when workspace trust is not granted', async () => {
    const recorder = new ServiceCallRecorder();
    const presentation = new RecordingPresentationSurface();
    const workflow = new HostMissionWorkflow(
      new RecordingMissionService(recorder),
      new RecordingPlanningService(recorder),
      new RecordingExecutionService(recorder),
      presentation,
      new StaticWorkspaceTrustSurface(false),
      createDeterministicIdentity(['untrusted-mission', 'untrusted-plan', 'untrusted-task']),
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
      presentation,
      new StaticWorkspaceTrustSurface(true),
      createDeterministicIdentity(['reject-mission', 'reject-plan', 'reject-task']),
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
      },
    ]);
    expect(presentation.lines).toContain(
      'Host Diagnostic host-mission-workflow.kernel-rejected: Kernel rejected Mission execution.',
    );
  });

  it('composes with real Kernel services and completes a single-Task Mission', async () => {
    let services: readonly IKernelService[] = [];
    const kernel = new Kernel((eventBus) => {
      services = createKernelServices(eventBus);

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
      new RecordingPresentationSurface(),
      new StaticWorkspaceTrustSurface(true),
      createDeterministicIdentity(['integration-mission', 'integration-plan', 'integration-task']),
    );

    await kernel.initialize();

    const result = await workflow.runDeveloperMissionWorkflow({
      objective: 'Validate Sprint 25 Host Mission workflow integration.',
      taskTitle: 'Execute Sprint 25 integration task',
      taskDescription: 'Validate the Host calls public Kernel Mission contracts only.',
    });

    expect(result.finalStatus).toBe('Completed');
    expect(result.taskStatus).toBe('Completed');
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

    return planState(request.id ?? 'generated-mission-plan', 1, 'task-sprint-25-task', 'Planned');
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
