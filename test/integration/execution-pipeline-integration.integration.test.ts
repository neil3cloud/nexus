import { describe, expect, it } from 'vitest';

import {
  MOCK_ADAPTER_ID,
  MOCK_ADAPTER_RESULT_CONSTRAINT,
  MockAdapter,
} from '../../src/adapters/mock/mock-adapter';
import { AdapterRequest } from '../../src/kernel/adapter/adapter-request';
import { AdapterService } from '../../src/kernel/adapter/adapter.service';
import {
  AdapterNotFoundError,
  UnsupportedAdapterCapabilityError,
} from '../../src/kernel/adapter/adapter.errors';
import type { Adapter } from '../../src/kernel/adapter/adapter.contract';
import { AdapterMetadata } from '../../src/kernel/adapter/adapter-metadata';
import { AdapterResponse } from '../../src/kernel/adapter/adapter-response';
import type { IKernelService } from '../../src/kernel/common/kernel-service';
import type { KernelLogger } from '../../src/kernel/common/kernel-logger';
import { createKernelServices } from '../../src/kernel/common/create-kernel-services';
import { ExecutionStrategyService } from '../../src/kernel/execution/execution-strategy.service';
import { RoleAssignmentNotFoundError } from '../../src/kernel/execution/role.errors';
import { RoleService } from '../../src/kernel/execution/role.service';
import { Kernel } from '../../src/kernel/kernel';
import { MissionExecutionService } from '../../src/kernel/mission/mission-execution.service';
import { MissionPlanningService } from '../../src/kernel/mission/mission-planning.service';
import { MissionService } from '../../src/kernel/mission/mission.service';

class TestLogger implements KernelLogger {
  public info(): void {}

  public error(): void {}
}

const LIMITED_ADAPTER_ID = 'limited-capability-adapter';

class LimitedCapabilityAdapter implements Adapter {
  public readonly metadata = AdapterMetadata.create({
    id: LIMITED_ADAPTER_ID,
    name: 'Limited Capability Adapter',
    version: '1.0.0',
    protocolVersion: '1.0',
    capabilities: ['StaticAnalysis'],
    supportedRoles: ['Builder'],
  });

  public async execute(): Promise<AdapterResponse> {
    return AdapterResponse.create({
      status: 'Completed',
    });
  }
}

interface PipelineHarness {
  readonly adapterService: AdapterService;
  readonly missionService: MissionService;
  readonly planningService: MissionPlanningService;
  readonly missionExecutionService: MissionExecutionService;
  readonly roleService: RoleService;
  readonly executionStrategyService: ExecutionStrategyService;
}

interface PipelineWorkflow {
  readonly missionId: string;
  readonly missionPlanId: string;
  readonly firstTaskId: string;
  readonly secondTaskId: string;
  readonly executionStrategyId: string;
}

describe('Sprint 20 execution pipeline integration', () => {
  it('executes the complete pipeline through public Kernel service contracts', async () => {
    const harness = await createHarness();
    const workflow = await createPipelineWorkflow(harness, 'success');

    await harness.roleService.assignRole({
      taskId: workflow.secondTaskId,
      roleId: 'builder',
    });

    const readiness = await harness.executionStrategyService.evaluateAssignmentReadiness({
      executionStrategyId: workflow.executionStrategyId,
      missionPlanId: workflow.missionPlanId,
      taskId: workflow.secondTaskId,
    });
    const role = await harness.roleService.retrieveRole(readiness.roleId);
    const adapters = await harness.adapterService.enumerateAdapters();
    const response = await harness.adapterService.dispatch({
      adapterId: MOCK_ADAPTER_ID,
      requiredCapability: 'CodeModification',
      request: AdapterRequest.create({
        engineeringRole: role.name,
        taskId: readiness.taskId,
        contextPackageReference: `context-package-${workflow.missionId}`,
        requestMetadata: {
          executionStrategyId: readiness.executionStrategyId,
          missionId: readiness.missionId,
          missionPlanId: readiness.missionPlanId,
          roleId: readiness.roleId,
        },
      }),
    });

    expect(readiness).toMatchObject({
      executionStrategyId: workflow.executionStrategyId,
      missionId: workflow.missionId,
      missionPlanId: workflow.missionPlanId,
      taskId: workflow.secondTaskId,
      roleId: 'builder',
      ready: true,
      satisfiedDependencyTaskIds: [workflow.firstTaskId],
    });
    expect(role.toSnapshot()).toMatchObject({
      id: 'builder',
      name: 'Builder',
    });
    expect(adapters.map((adapter) => adapter.id.toString())).toEqual([MOCK_ADAPTER_ID]);
    expect(response.toSnapshot()).toMatchObject({
      status: 'Completed',
      diagnostics: [
        {
          code: 'mock-adapter.completed',
          message: 'Mock Adapter deterministically completed the request.',
        },
      ],
      producedArtifacts: [
        `${MOCK_ADAPTER_ID}:Builder:${workflow.secondTaskId}:context-package-${workflow.missionId}`,
      ],
      executionMetadata: {
        adapterId: MOCK_ADAPTER_ID,
        engineeringRole: 'Builder',
        taskId: workflow.secondTaskId,
        contextPackageReference: `context-package-${workflow.missionId}`,
        requestedResult: 'Completed',
      },
    });
  });

  it('surfaces deterministic diagnostics for missing Role Assignment and Adapter lookup failure', async () => {
    const harness = await createHarness();
    const workflow = await createPipelineWorkflow(harness, 'missing-assignment');

    await expect(
      harness.executionStrategyService.evaluateAssignmentReadiness({
        executionStrategyId: workflow.executionStrategyId,
        missionPlanId: workflow.missionPlanId,
        taskId: workflow.secondTaskId,
      }),
    ).rejects.toThrow(RoleAssignmentNotFoundError);

    await harness.roleService.assignRole({
      taskId: workflow.secondTaskId,
      roleId: 'builder',
    });
    const readiness = await harness.executionStrategyService.evaluateAssignmentReadiness({
      executionStrategyId: workflow.executionStrategyId,
      missionPlanId: workflow.missionPlanId,
      taskId: workflow.secondTaskId,
    });
    const role = await harness.roleService.retrieveRole(readiness.roleId);

    await expect(
      harness.adapterService.dispatch({
        adapterId: 'missing-adapter',
        requiredCapability: 'CodeModification',
        request: AdapterRequest.create({
          engineeringRole: role.name,
          taskId: readiness.taskId,
          contextPackageReference: `context-package-${workflow.missionId}`,
        }),
      }),
    ).rejects.toThrow(AdapterNotFoundError);
  });

  it('surfaces deterministic diagnostics for unsupported capabilities and Mock Adapter failures', async () => {
    const harness = await createHarness([new LimitedCapabilityAdapter()]);
    const workflow = await createPipelineWorkflow(harness, 'failed-response');

    await harness.roleService.assignRole({
      taskId: workflow.secondTaskId,
      roleId: 'builder',
    });
    const readiness = await harness.executionStrategyService.evaluateAssignmentReadiness({
      executionStrategyId: workflow.executionStrategyId,
      missionPlanId: workflow.missionPlanId,
      taskId: workflow.secondTaskId,
    });
    const role = await harness.roleService.retrieveRole(readiness.roleId);
    const request = AdapterRequest.create({
      engineeringRole: role.name,
      taskId: readiness.taskId,
      contextPackageReference: `context-package-${workflow.missionId}`,
      executionConstraints: {
        [MOCK_ADAPTER_RESULT_CONSTRAINT]: 'Failed',
      },
    });

    await expect(
      harness.adapterService.dispatch({
        adapterId: LIMITED_ADAPTER_ID,
        requiredCapability: 'CodeModification',
        request,
      }),
    ).rejects.toThrow(UnsupportedAdapterCapabilityError);

    const failedResponse = await harness.adapterService.dispatch({
      adapterId: MOCK_ADAPTER_ID,
      requiredCapability: 'CodeModification',
      request,
    });

    expect(failedResponse.toSnapshot()).toMatchObject({
      status: 'Failed',
      diagnostics: [
        {
          code: 'mock-adapter.execution-failed',
          message: 'Mock Adapter deterministically failed the request.',
        },
      ],
      executionMetadata: {
        adapterId: MOCK_ADAPTER_ID,
        engineeringRole: 'Builder',
        taskId: workflow.secondTaskId,
        requestedResult: 'Failed',
      },
    });
  });
});

async function createHarness(extraAdapters: readonly Adapter[] = []): Promise<PipelineHarness> {
  let services: readonly IKernelService[] = [];
  const kernel = new Kernel((eventBus) => {
    services = createKernelServices(eventBus, {
      adapters: [new MockAdapter(), ...extraAdapters],
    });

    return services;
  }, new TestLogger());

  await kernel.initialize();

  return {
    adapterService: requireService(
      services,
      'AdapterService',
      (service): service is AdapterService => service instanceof AdapterService,
    ),
    missionService: requireService(
      services,
      'MissionService',
      (service): service is MissionService => service instanceof MissionService,
    ),
    planningService: requireService(
      services,
      'MissionPlanningService',
      (service): service is MissionPlanningService => service instanceof MissionPlanningService,
    ),
    missionExecutionService: requireService(
      services,
      'MissionExecutionService',
      (service): service is MissionExecutionService => service instanceof MissionExecutionService,
    ),
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
  };
}

async function createPipelineWorkflow(
  harness: PipelineHarness,
  suffix: string,
): Promise<PipelineWorkflow> {
  const missionId = `mission-sprint-20-${suffix}`;
  const missionPlanId = `mission-plan-sprint-20-${suffix}`;
  const firstTaskId = `task-sprint-20-${suffix}-first`;
  const secondTaskId = `task-sprint-20-${suffix}-second`;
  const executionStrategyId = `execution-strategy-sprint-20-${suffix}`;

  await harness.missionService.createMission({
    id: missionId,
    objective: `Validate Sprint 20 execution pipeline integration for ${suffix}.`,
  });
  await harness.planningService.createMissionPlan({
    id: missionPlanId,
    missionId,
    revisionReason: 'Create Sprint 20 execution-pipeline MissionPlan.',
    revisionMetadata: {
      sprint: 'Sprint 20',
    },
  });
  await harness.missionService.planMission(missionId);
  await harness.planningService.addTask({
    missionPlanId,
    taskId: firstTaskId,
    title: 'Prepare execution pipeline prerequisite',
    description: 'Validate prerequisite Task completion before Adapter dispatch.',
    revisionReason: 'Add Sprint 20 prerequisite Task.',
    revisionMetadata: {
      sprint: 'Sprint 20',
    },
  });
  await harness.planningService.addTask({
    missionPlanId,
    taskId: secondTaskId,
    title: 'Execute through Mock Adapter',
    description: 'Validate Strategy, Role Assignment, Adapter Registry, and Adapter Response.',
    dependencies: [firstTaskId],
    revisionReason: 'Add Sprint 20 Adapter-dispatch Task.',
    revisionMetadata: {
      sprint: 'Sprint 20',
    },
  });
  await harness.planningService.updateTask({
    missionPlanId,
    taskId: firstTaskId,
    status: 'Ready',
    revisionReason: 'Mark Sprint 20 prerequisite Task ready.',
    revisionMetadata: {
      sprint: 'Sprint 20',
    },
  });
  await harness.planningService.updateTask({
    missionPlanId,
    taskId: secondTaskId,
    status: 'Ready',
    revisionReason: 'Mark Sprint 20 Adapter-dispatch Task ready.',
    revisionMetadata: {
      sprint: 'Sprint 20',
    },
  });
  await harness.missionService.markMissionReady(missionId);
  await harness.missionExecutionService.startMission({ missionId });
  await harness.missionExecutionService.startTask({
    missionId,
    taskId: firstTaskId,
  });
  await harness.missionExecutionService.completeTask({
    missionId,
    taskId: firstTaskId,
  });
  await harness.executionStrategyService.createExecutionStrategy({
    id: executionStrategyId,
    missionId,
  });

  return {
    missionId,
    missionPlanId,
    firstTaskId,
    secondTaskId,
    executionStrategyId,
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
