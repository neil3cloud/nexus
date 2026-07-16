import { describe, expect, it } from 'vitest';

import { EventBus } from '../../../src/kernel/events/event-bus';
import { createKernelServices } from '../../../src/kernel/common/create-kernel-services';
import type { IKernelService } from '../../../src/kernel/common/kernel-service';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';
import { EngineeringDecisionCorrelation } from '../../../src/kernel/execution/engineering-decision-correlation';
import type { EngineeringDecisionCorrelationSnapshot } from '../../../src/kernel/execution/engineering-decision-correlation.types';
import { RecoveryRequirement } from '../../../src/kernel/execution/recovery-requirement';
import type { RecoveryRequirementSnapshot } from '../../../src/kernel/execution/recovery-requirement.types';
import { GovernanceDecision } from '../../../src/kernel/governance/governance-decision';
import { InMemoryGovernanceDecisionRepository } from '../../../src/kernel/governance/governance-decision.repository';
import { GovernanceService } from '../../../src/kernel/governance/governance.service';
import type {
  GovernanceDecisionSnapshot,
  GovernanceDecisionValue,
} from '../../../src/kernel/governance/governance.types';
import {
  assertGovernanceGatedMissionCompletionEligible,
  isGovernanceGatedMissionCompletionEligible,
} from '../../../src/kernel/mission/mission-completion-eligibility';
import { Mission } from '../../../src/kernel/mission/mission.aggregate';
import { MissionExecutionService } from '../../../src/kernel/mission/mission-execution.service';
import {
  MissionCompletionRejectedError,
  MissionExecutionValidationError,
  MissionNotFoundError,
  TaskLifecycleTransitionError,
} from '../../../src/kernel/mission/mission.errors';
import { MissionId } from '../../../src/kernel/mission/mission-id';
import { MissionObjective } from '../../../src/kernel/mission/mission-objective';
import { MissionPlan } from '../../../src/kernel/mission/mission-plan.aggregate';
import { MissionPlanId } from '../../../src/kernel/mission/mission-plan-id';
import type { RevisionMetadata } from '../../../src/kernel/mission/mission-planning.types';
import { MissionPlanningService } from '../../../src/kernel/mission/mission-planning.service';
import { InMemoryMissionRepository } from '../../../src/kernel/mission/mission.repository';
import { MissionService } from '../../../src/kernel/mission/mission.service';
import type { DomainEventMetadata } from '../../../src/kernel/mission/mission.types';
import { Task } from '../../../src/kernel/mission/task';
import { TaskDependency } from '../../../src/kernel/mission/task-dependency';
import { TaskId } from '../../../src/kernel/mission/task-id';

const timestamp = '2026-07-12T00:00:00.000Z';
const recoveryResolvedAt = '2026-07-12T00:10:00.000Z';
const supersedingEvaluatedAt = '2026-07-12T00:20:00.000Z';

class TestLogger implements KernelLogger {
  public info(): void {}

  public error(): void {}
}

class FailingSaveMissionPlanRepository extends InMemoryMissionRepository {
  private failMissionPlanSaves = false;

  public failNextMissionPlanSaves(): void {
    this.failMissionPlanSaves = true;
  }

  public override async saveMissionPlan(missionPlan: MissionPlan): Promise<void> {
    if (this.failMissionPlanSaves) {
      throw new Error('Save MissionPlan failed.');
    }

    await super.saveMissionPlan(missionPlan);
  }
}

class EngineeringDecisionCorrelationSnapshotSource {
  public constructor(private readonly snapshots: readonly EngineeringDecisionCorrelationSnapshot[]) {}

  public async enumerate(): Promise<readonly EngineeringDecisionCorrelation[]> {
    return this.snapshots.map((snapshot) => EngineeringDecisionCorrelation.fromSnapshot(snapshot));
  }
}

class RecoveryRequirementSnapshotSource {
  public constructor(private readonly snapshots: readonly RecoveryRequirementSnapshot[]) {}

  public async enumerate(): Promise<readonly RecoveryRequirement[]> {
    return this.snapshots.map((snapshot) => RecoveryRequirement.fromSnapshot(snapshot));
  }
}

function metadata(eventId: string): DomainEventMetadata {
  return {
    eventId,
    timestamp,
  };
}

function revisionMetadata(reason: string): RevisionMetadata {
  return {
    createdAt: timestamp,
    reason,
    attributes: {},
  };
}

function sequence(values: readonly string[]): () => string {
  let index = 0;

  return () => {
    const value = values[index];

    if (value === undefined) {
      throw new Error('Sequence exhausted.');
    }

    index += 1;

    return value;
  };
}

function createReadyMission(): Mission {
  const mission = Mission.create(
    MissionId.fromString('mission-1'),
    MissionObjective.fromString('Implement Mission Execution'),
    metadata('event-created'),
  );

  mission.pullDomainEvents();
  mission.plan(metadata('event-planned'));
  mission.markReady(metadata('event-ready'));

  return mission;
}

function createExecutableMissionPlan(): MissionPlan {
  const missionPlan = MissionPlan.create({
    id: MissionPlanId.fromString('plan-1'),
    missionId: MissionId.fromString('mission-1'),
    revisionMetadata: revisionMetadata('Initial plan'),
  });
  const firstTask = Task.create({
    id: TaskId.fromString('task-1'),
    title: 'First task',
    description: 'Execute first',
    parentMissionPlanId: missionPlan.id,
  });
  const secondTask = Task.create({
    id: TaskId.fromString('task-2'),
    title: 'Second task',
    description: 'Execute second',
    parentMissionPlanId: missionPlan.id,
  });

  firstTask.markReady();
  secondTask.markReady();
  secondTask.addDependency(TaskDependency.fromTaskIds(secondTask.id, firstTask.id));
  missionPlan.addTask(firstTask, revisionMetadata('Add first task'));
  missionPlan.addTask(secondTask, revisionMetadata('Add second task'));

  return missionPlan;
}

function createGovernanceDecision(
  value: GovernanceDecisionValue,
  input: {
    readonly id?: string;
    readonly missionId?: string;
    readonly evaluatedAt?: string;
  } = {},
): GovernanceDecision {
  const id = input.id ?? `decision-${value.toLowerCase().replaceAll(' ', '-')}`;

  return GovernanceDecision.create({
    id,
    missionId: input.missionId ?? 'mission-1',
    value,
    repositoryPolicyId: 'repository-policy-1',
    repositoryPolicyVersion: 1,
    reviewId: `review-${id}`,
    reviewStateReference: `review-state-${id}`,
    policyEvaluationId: `policy-evaluation-${id}`,
    evaluationKey: `evaluation-key-${id}`,
    criterionResults: [],
    evaluatedAt: input.evaluatedAt ?? timestamp,
    explanationCodes: [`decision-${value.toLowerCase().replaceAll(' ', '-')}`],
  });
}

function createEngineeringDecisionCorrelationSnapshot(
  governanceDecisionId: string,
  input: {
    readonly id?: string;
    readonly missionId?: string;
    readonly engineeringSessionId?: string;
    readonly workflowStepId?: string;
  } = {},
): EngineeringDecisionCorrelationSnapshot {
  return {
    id: input.id ?? `correlation-${governanceDecisionId}`,
    missionId: input.missionId ?? 'mission-1',
    engineeringSessionId: input.engineeringSessionId ?? 'engineering-session-1',
    workflowStepId: input.workflowStepId ?? 'workflow-step-1',
    createdAt: timestamp,
    creationCausality: [],
    reviewId: `review-${governanceDecisionId}`,
    governanceDecisionId,
  };
}

function createResolvedRecoveryRequirementSnapshot(
  governanceDecisionId: string,
  input: {
    readonly id?: string;
    readonly missionId?: string;
    readonly engineeringSessionId?: string;
    readonly workflowStepId?: string;
    readonly status?: RecoveryRequirementSnapshot['status'];
  } = {},
): RecoveryRequirementSnapshot {
  const status = input.status ?? 'Resolved';

  return {
    id: input.id ?? `recovery-requirement-${governanceDecisionId}`,
    missionId: input.missionId ?? 'mission-1',
    engineeringSessionId: input.engineeringSessionId ?? 'engineering-session-1',
    workflowStepId: input.workflowStepId ?? 'workflow-step-1',
    governanceDecisionId,
    createdAt: timestamp,
    creationCausality: [],
    status,
    ...(status === 'Resolved'
      ? {
          resolution: {
            acceptedOutcomeReference: 'accepted-recovery-outcome-1',
            resolvedAt: recoveryResolvedAt,
            attribution: 'reviewer',
            causality: [],
          },
        }
      : {}),
    ...(status === 'Withdrawn'
      ? {
          withdrawal: {
            authoritativeDecisionReference: 'withdrawal-decision-1',
            reason: 'Withdrawn by authority',
            withdrawnAt: recoveryResolvedAt,
            attribution: 'reviewer',
            causality: [],
          },
        }
      : {}),
  };
}

function createSupersessionEligibilityInput(input: {
  readonly supersedingDecisionValue?: GovernanceDecisionValue;
  readonly supersedingDecisionMissionId?: string;
  readonly supersedingDecisionEvaluatedAt?: string;
  readonly supersedingCorrelationMissionId?: string;
  readonly supersedingEngineeringSessionId?: string;
  readonly supersedingWorkflowStepId?: string;
  readonly recoveryRequirementGovernanceDecisionId?: string;
  readonly recoveryRequirementStatus?: RecoveryRequirementSnapshot['status'];
} = {}): {
  readonly governanceDecisions: readonly GovernanceDecisionSnapshot[];
  readonly engineeringDecisionCorrelations: readonly EngineeringDecisionCorrelationSnapshot[];
  readonly recoveryRequirements: readonly RecoveryRequirementSnapshot[];
} {
  const rejectedDecision = createGovernanceDecision('Rejected', {
    id: 'decision-rejected-1',
    evaluatedAt: timestamp,
  }).toSnapshot();
  const supersedingDecision = createGovernanceDecision(
    input.supersedingDecisionValue ?? 'Approved',
    {
      id: 'decision-superseding-1',
      evaluatedAt: input.supersedingDecisionEvaluatedAt ?? supersedingEvaluatedAt,
      ...(input.supersedingDecisionMissionId === undefined
        ? {}
        : { missionId: input.supersedingDecisionMissionId }),
    },
  ).toSnapshot();

  return {
    governanceDecisions: [rejectedDecision, supersedingDecision],
    engineeringDecisionCorrelations: [
      createEngineeringDecisionCorrelationSnapshot(rejectedDecision.id),
      createEngineeringDecisionCorrelationSnapshot(supersedingDecision.id, {
        id: 'correlation-decision-superseding-1',
        ...(input.supersedingCorrelationMissionId === undefined
          ? {}
          : { missionId: input.supersedingCorrelationMissionId }),
        ...(input.supersedingEngineeringSessionId === undefined
          ? {}
          : { engineeringSessionId: input.supersedingEngineeringSessionId }),
        ...(input.supersedingWorkflowStepId === undefined
          ? {}
          : { workflowStepId: input.supersedingWorkflowStepId }),
      }),
    ],
    recoveryRequirements: [
      createResolvedRecoveryRequirementSnapshot(
        input.recoveryRequirementGovernanceDecisionId ?? rejectedDecision.id,
        input.recoveryRequirementStatus === undefined
          ? {}
          : { status: input.recoveryRequirementStatus },
      ),
    ],
  };
}

async function createReviewingMissionWithCompletedTasks(input: {
  readonly repository: InMemoryMissionRepository;
  readonly service: MissionExecutionService;
}): Promise<void> {
  const mission = createReadyMission();
  const missionPlan = createExecutableMissionPlan();

  await input.repository.save(mission);
  await input.repository.saveMissionPlan(missionPlan);
  await input.service.startMission({ missionId: 'mission-1' });
  await input.service.startTask({ missionId: 'mission-1', taskId: 'task-1' });
  await input.service.completeTask({ missionId: 'mission-1', taskId: 'task-1' });
  await input.service.startTask({ missionId: 'mission-1', taskId: 'task-2' });
  await input.service.completeTask({ missionId: 'mission-1', taskId: 'task-2' });

  const reviewingMission = await input.repository.getById(mission.id);

  if (reviewingMission === undefined) {
    throw new Error('Expected Mission to exist.');
  }

  reviewingMission.review(metadata('event-reviewed'));
  await input.repository.save(reviewingMission);
}

function requireService<T extends IKernelService>(
  services: readonly IKernelService[],
  serviceType: new (...args: never[]) => T,
): T {
  const service = services.find((candidate): candidate is T => candidate instanceof serviceType);

  if (service === undefined) {
    throw new Error(`Expected ${serviceType.name} to be registered.`);
  }

  return service;
}

describe('MissionExecutionService', () => {
  it('coordinates deterministic Mission and Task execution through aggregates', async () => {
    const repository = new InMemoryMissionRepository();
    const eventBus = new EventBus(new TestLogger());
    const service = new MissionExecutionService(
      repository,
      eventBus,
      sequence([
        'event-mission-started',
        'event-task-1-started',
        'event-task-1-completed',
        'event-task-2-started',
        'event-task-2-completed',
        'event-mission-completed',
      ]),
      () => timestamp,
    );
    const mission = createReadyMission();
    const missionPlan = createExecutableMissionPlan();

    await repository.save(mission);
    await repository.saveMissionPlan(missionPlan);

    await expect(service.startMission({ missionId: 'mission-1' })).resolves.toMatchObject({
      status: 'Executing',
    });
    await service.startTask({ missionId: 'mission-1', taskId: 'task-1' });
    await service.completeTask({ missionId: 'mission-1', taskId: 'task-1' });
    await service.startTask({ missionId: 'mission-1', taskId: 'task-2' });
    await service.completeTask({ missionId: 'mission-1', taskId: 'task-2' });

    const reviewingMission = await repository.getById(mission.id);

    if (reviewingMission === undefined) {
      throw new Error('Expected Mission to exist.');
    }

    reviewingMission.review(metadata('event-reviewed'));
    await repository.save(reviewingMission);

    const completedMission = await service.completeMission({ missionId: 'mission-1' });
    const persistedPlan = await repository.getMissionPlanById(missionPlan.id);

    expect(completedMission.status).toBe('Completed');
    expect(persistedPlan?.tasks.map((task) => task.status)).toEqual(['Completed', 'Completed']);
    expect(eventBus.replay('mission-1').map((event) => event.eventType)).toEqual([
      'MissionStarted',
      'TaskStarted',
      'TaskCompleted',
      'TaskStarted',
      'TaskCompleted',
      'MissionCompleted',
    ]);
  });

  it('rejects Task execution before Mission is active', async () => {
    const repository = new InMemoryMissionRepository();
    const service = new MissionExecutionService(repository, new EventBus(new TestLogger()));
    const mission = createReadyMission();

    await repository.save(mission);
    await repository.saveMissionPlan(createExecutableMissionPlan());

    await expect(service.startTask({ missionId: 'mission-1', taskId: 'task-1' })).rejects.toThrow(
      MissionExecutionValidationError,
    );
  });

  it('rejects dependency violations and immutable terminal Task execution', async () => {
    const repository = new InMemoryMissionRepository();
    const eventBus = new EventBus(new TestLogger());
    const service = new MissionExecutionService(
      repository,
      eventBus,
      sequence([
        'event-mission-started',
        'event-rejected-start',
        'event-task-cancelled',
        'event-rejected-restart',
      ]),
    );

    await repository.save(createReadyMission());
    await repository.saveMissionPlan(createExecutableMissionPlan());
    await service.startMission({ missionId: 'mission-1' });

    await expect(service.startTask({ missionId: 'mission-1', taskId: 'task-2' })).rejects.toThrow(
      MissionExecutionValidationError,
    );
    await service.cancelTask({ missionId: 'mission-1', taskId: 'task-1' });
    await expect(service.startTask({ missionId: 'mission-1', taskId: 'task-1' })).rejects.toThrow(
      TaskLifecycleTransitionError,
    );
    expect(eventBus.replay('mission-1').map((event) => event.eventType)).toEqual([
      'MissionStarted',
      'TaskCancelled',
    ]);
  });

  it('rejects Mission completion unless all Tasks are completed and lifecycle permits completion', async () => {
    const repository = new InMemoryMissionRepository();
    const service = new MissionExecutionService(
      repository,
      new EventBus(new TestLogger()),
      sequence(['event-mission-started', 'event-rejected-completion']),
    );

    await repository.save(createReadyMission());
    await repository.saveMissionPlan(createExecutableMissionPlan());
    await service.startMission({ missionId: 'mission-1' });

    await expect(service.completeMission({ missionId: 'mission-1' })).rejects.toThrow(
      MissionCompletionRejectedError,
    );
  });

  it('rejects unknown Missions and Missions without MissionPlans', async () => {
    const repository = new InMemoryMissionRepository();
    const service = new MissionExecutionService(repository, new EventBus(new TestLogger()));

    await expect(service.startMission({ missionId: 'missing-mission' })).rejects.toThrow(
      MissionNotFoundError,
    );
    await repository.save(createReadyMission());
    await expect(service.startMission({ missionId: 'mission-1' })).rejects.toThrow(
      MissionExecutionValidationError,
    );
  });

  it('publishes canonical Mission lifecycle events with causality across service paths', async () => {
    const repository = new InMemoryMissionRepository();
    const eventBus = new EventBus(new TestLogger());
    const missionService = new MissionService(
      repository,
      eventBus,
      sequence([
        'mission-1',
        'event-created',
        'event-planned',
        'event-ready',
        'event-reviewed',
      ]),
      () => timestamp,
    );
    const executionService = new MissionExecutionService(
      repository,
      eventBus,
      sequence([
        'event-started',
        'event-task-1-started',
        'event-task-1-completed',
        'event-task-2-started',
        'event-task-2-completed',
        'event-completed',
      ]),
      () => timestamp,
    );

    await missionService.createMission({ objective: 'Implement Mission Execution' });
    await repository.saveMissionPlan(createExecutableMissionPlan());
    await missionService.planMission('mission-1');
    await missionService.markMissionReady('mission-1');
    await executionService.startMission({ missionId: 'mission-1' });
    await executionService.startTask({ missionId: 'mission-1', taskId: 'task-1' });
    await executionService.completeTask({ missionId: 'mission-1', taskId: 'task-1' });
    await executionService.startTask({ missionId: 'mission-1', taskId: 'task-2' });
    await executionService.completeTask({ missionId: 'mission-1', taskId: 'task-2' });
    await missionService.reviewMission('mission-1');
    await executionService.completeMission({ missionId: 'mission-1' });

    expect(
      eventBus.replay('mission-1').map((event) => ({
        eventId: event.eventId,
        eventType: event.eventType,
        causality: event.causality,
      })),
    ).toEqual([
      {
        eventId: 'event-created',
        eventType: 'MissionCreated',
        causality: [],
      },
      {
        eventId: 'event-planned',
        eventType: 'MissionPlanned',
        causality: ['event-created'],
      },
      {
        eventId: 'event-ready',
        eventType: 'MissionReady',
        causality: ['event-planned'],
      },
      {
        eventId: 'event-started',
        eventType: 'MissionStarted',
        causality: ['event-ready'],
      },
      {
        eventId: 'event-task-1-started',
        eventType: 'TaskStarted',
        causality: [],
      },
      {
        eventId: 'event-task-1-completed',
        eventType: 'TaskCompleted',
        causality: [],
      },
      {
        eventId: 'event-task-2-started',
        eventType: 'TaskStarted',
        causality: [],
      },
      {
        eventId: 'event-task-2-completed',
        eventType: 'TaskCompleted',
        causality: [],
      },
      {
        eventId: 'event-reviewed',
        eventType: 'MissionReviewed',
        causality: ['event-started'],
      },
      {
        eventId: 'event-completed',
        eventType: 'MissionCompleted',
        causality: ['event-reviewed'],
      },
    ]);
  });

  it('publishes Mission failure and cancellation events through MissionExecutionService', async () => {
    const failingRepository = new InMemoryMissionRepository();
    const failingEventBus = new EventBus(new TestLogger());
    const failingService = new MissionExecutionService(
      failingRepository,
      failingEventBus,
      sequence(['event-started', 'event-failed']),
      () => timestamp,
    );
    const cancellingRepository = new InMemoryMissionRepository();
    const cancellingEventBus = new EventBus(new TestLogger());
    const cancellingService = new MissionExecutionService(
      cancellingRepository,
      cancellingEventBus,
      sequence(['event-cancelled']),
      () => timestamp,
    );

    await failingRepository.save(createReadyMission());
    await failingRepository.saveMissionPlan(createExecutableMissionPlan());
    await failingService.startMission({ missionId: 'mission-1' });
    await failingService.failMission({ missionId: 'mission-1' });

    await cancellingRepository.save(createReadyMission());
    await cancellingRepository.saveMissionPlan(createExecutableMissionPlan());
    await cancellingService.cancelMission({ missionId: 'mission-1' });

    expect(failingEventBus.replay('mission-1').map((event) => event.eventType)).toEqual([
      'MissionStarted',
      'MissionFailed',
    ]);
    expect(cancellingEventBus.replay('mission-1').map((event) => event.eventType)).toEqual([
      'MissionCancelled',
    ]);
  });

  it('publishes TaskStarted, TaskCompleted, and TaskCancelled only after MissionPlan persistence', async () => {
    const cases = [
      {
        eventId: 'event-task-started',
        operation: (service: MissionExecutionService) =>
          service.startTask({ missionId: 'mission-1', taskId: 'task-1' }),
      },
      {
        eventId: 'event-task-completed',
        prepare: (missionPlan: MissionPlan) => {
          missionPlan.startTask(TaskId.fromString('task-1'));
        },
        operation: (service: MissionExecutionService) =>
          service.completeTask({ missionId: 'mission-1', taskId: 'task-1' }),
      },
      {
        eventId: 'event-task-cancelled',
        operation: (service: MissionExecutionService) =>
          service.cancelTask({ missionId: 'mission-1', taskId: 'task-1' }),
      },
    ];

    for (const item of cases) {
      const repository = new FailingSaveMissionPlanRepository();
      const eventBus = new EventBus(new TestLogger());
      const service = new MissionExecutionService(
        repository,
        eventBus,
        sequence([item.eventId]),
        () => timestamp,
      );
      const mission = createReadyMission();
      const missionPlan = createExecutableMissionPlan();

      await repository.save(mission);
      await repository.saveMissionPlan(missionPlan);
      mission.start(metadata('event-mission-started'));
      mission.pullDomainEvents();
      await repository.save(mission);
      item.prepare?.(missionPlan);
      await repository.saveMissionPlan(missionPlan);
      repository.failNextMissionPlanSaves();

      await expect(item.operation(service)).rejects.toThrow('Save MissionPlan failed.');
      expect(eventBus.replay('mission-1')).toEqual([]);
    }
  });

  it.each([
    ['Approved', true],
    ['Rejected', false],
    ['Deferred', false],
    ['Escalation Required', false],
  ] as const)(
    'classifies %s GovernanceDecision for Mission Completion eligibility',
    (governanceDecisionValue, expectedEligibility) => {
      const governanceDecision = createGovernanceDecision(governanceDecisionValue);

      expect(
        isGovernanceGatedMissionCompletionEligible({
          governanceDecisions: [governanceDecision.toSnapshot()],
        }),
      ).toBe(expectedEligibility);
    },
  );

  it('treats no applicable GovernanceDecision as non-blocking Mission Completion', async () => {
    const repository = new InMemoryMissionRepository();
    const governanceDecisionRepository = new InMemoryGovernanceDecisionRepository();
    const eventBus = new EventBus(new TestLogger());
    const service = new MissionExecutionService(
      repository,
      eventBus,
      sequence([
        'event-mission-started',
        'event-task-1-started',
        'event-task-1-completed',
        'event-task-2-started',
        'event-task-2-completed',
        'event-mission-completed',
      ]),
      () => timestamp,
      governanceDecisionRepository,
    );

    await governanceDecisionRepository.register(
      createGovernanceDecision('Rejected', { id: 'decision-other-mission', missionId: 'mission-2' }),
    );
    await createReviewingMissionWithCompletedTasks({ repository, service });

    await expect(service.completeMission({ missionId: 'mission-1' })).resolves.toMatchObject({
      status: 'Completed',
    });
  });

  it('rejects Mission Completion for each blocking GovernanceDecision value', async () => {
    for (const governanceDecisionValue of ['Rejected', 'Deferred', 'Escalation Required'] as const) {
      const repository = new InMemoryMissionRepository();
      const governanceDecisionRepository = new InMemoryGovernanceDecisionRepository();
      const service = new MissionExecutionService(
        repository,
        new EventBus(new TestLogger()),
        sequence([
          `event-started-${governanceDecisionValue}`,
          `event-task-1-started-${governanceDecisionValue}`,
          `event-task-1-completed-${governanceDecisionValue}`,
          `event-task-2-started-${governanceDecisionValue}`,
          `event-task-2-completed-${governanceDecisionValue}`,
        ]),
        () => timestamp,
        governanceDecisionRepository,
      );

      await governanceDecisionRepository.register(
        createGovernanceDecision(governanceDecisionValue),
      );
      await createReviewingMissionWithCompletedTasks({ repository, service });

      await expect(service.completeMission({ missionId: 'mission-1' })).rejects.toThrow(
        MissionCompletionRejectedError,
      );
    }
  });

  it('requires every applicable GovernanceDecision to be independently non-blocking', async () => {
    const repository = new InMemoryMissionRepository();
    const governanceDecisionRepository = new InMemoryGovernanceDecisionRepository();
    const service = new MissionExecutionService(
      repository,
      new EventBus(new TestLogger()),
      sequence([
        'event-mission-started',
        'event-task-1-started',
        'event-task-1-completed',
        'event-task-2-started',
        'event-task-2-completed',
      ]),
      () => timestamp,
      governanceDecisionRepository,
    );

    await governanceDecisionRepository.register(createGovernanceDecision('Approved'));
    await governanceDecisionRepository.register(
      createGovernanceDecision('Deferred', { id: 'decision-deferred-2' }),
    );
    await createReviewingMissionWithCompletedTasks({ repository, service });

    await expect(service.completeMission({ missionId: 'mission-1' })).rejects.toThrow(
      MissionCompletionRejectedError,
    );
  });

  it('permits Mission Completion when a Rejected GovernanceDecision is exactly superseded', async () => {
    const repository = new InMemoryMissionRepository();
    const governanceDecisionRepository = new InMemoryGovernanceDecisionRepository();
    const supersessionInput = createSupersessionEligibilityInput();
    const service = new MissionExecutionService(
      repository,
      new EventBus(new TestLogger()),
      sequence([
        'event-mission-started',
        'event-task-1-started',
        'event-task-1-completed',
        'event-task-2-started',
        'event-task-2-completed',
        'event-mission-completed',
      ]),
      () => timestamp,
      governanceDecisionRepository,
      new EngineeringDecisionCorrelationSnapshotSource(
        supersessionInput.engineeringDecisionCorrelations,
      ),
      new RecoveryRequirementSnapshotSource(supersessionInput.recoveryRequirements),
    );

    for (const governanceDecision of supersessionInput.governanceDecisions) {
      await governanceDecisionRepository.register(GovernanceDecision.fromSnapshot(governanceDecision));
    }

    await createReviewingMissionWithCompletedTasks({ repository, service });

    await expect(service.completeMission({ missionId: 'mission-1' })).resolves.toMatchObject({
      status: 'Completed',
    });
  });

  it('excludes a superseded Rejected GovernanceDecision from the applicable set', () => {
    expect(
      isGovernanceGatedMissionCompletionEligible(createSupersessionEligibilityInput()),
    ).toBe(true);
  });

  it.each([
    ['Rejected', { supersedingDecisionValue: 'Rejected' }],
    ['Deferred', { supersedingDecisionValue: 'Deferred' }],
    ['Escalation Required', { supersedingDecisionValue: 'Escalation Required' }],
  ] as const)(
    'does not supersede a Rejected GovernanceDecision with a later %s GovernanceDecision',
    (_label, overrides) => {
      expect(
        isGovernanceGatedMissionCompletionEligible(
          createSupersessionEligibilityInput(overrides),
        ),
      ).toBe(false);
    },
  );

  it('does not supersede a Rejected GovernanceDecision across Workflow Step boundaries', () => {
    expect(
      isGovernanceGatedMissionCompletionEligible(
        createSupersessionEligibilityInput({
          supersedingWorkflowStepId: 'workflow-step-2',
        }),
      ),
    ).toBe(false);
  });

  it('does not supersede a Rejected GovernanceDecision across Engineering Session boundaries', () => {
    expect(
      isGovernanceGatedMissionCompletionEligible(
        createSupersessionEligibilityInput({
          supersedingEngineeringSessionId: 'engineering-session-2',
        }),
      ),
    ).toBe(false);
  });

  it('does not supersede a Rejected GovernanceDecision across Mission boundaries', () => {
    expect(
      isGovernanceGatedMissionCompletionEligible(
        createSupersessionEligibilityInput({
          supersedingDecisionMissionId: 'mission-2',
          supersedingCorrelationMissionId: 'mission-2',
        }),
      ),
    ).toBe(false);
  });

  it('does not supersede a Rejected GovernanceDecision with an unrelated RecoveryRequirement', () => {
    expect(
      isGovernanceGatedMissionCompletionEligible(
        createSupersessionEligibilityInput({
          recoveryRequirementGovernanceDecisionId: 'decision-rejected-unrelated',
        }),
      ),
    ).toBe(false);
  });

  it.each(['Open', 'Withdrawn'] as const)(
    'does not supersede a Rejected GovernanceDecision with a %s RecoveryRequirement',
    (recoveryRequirementStatus) => {
      expect(
        isGovernanceGatedMissionCompletionEligible(
          createSupersessionEligibilityInput({ recoveryRequirementStatus }),
        ),
      ).toBe(false);
    },
  );

  it('preserves independent satisfaction for every non-superseded GovernanceDecision', () => {
    const approvedDecision = createGovernanceDecision('Approved', {
      id: 'decision-approved-independent',
    }).toSnapshot();
    const deferredDecision = createGovernanceDecision('Deferred', {
      id: 'decision-deferred-independent',
    }).toSnapshot();
    const supersessionInput = createSupersessionEligibilityInput();

    expect(
      isGovernanceGatedMissionCompletionEligible({
        governanceDecisions: [approvedDecision],
      }),
    ).toBe(true);
    expect(
      isGovernanceGatedMissionCompletionEligible({
        governanceDecisions: [
          ...supersessionInput.governanceDecisions,
          approvedDecision,
          deferredDecision,
        ],
        engineeringDecisionCorrelations: supersessionInput.engineeringDecisionCorrelations,
        recoveryRequirements: supersessionInput.recoveryRequirements,
      }),
    ).toBe(false);
  });

  it('keeps Mission Completion eligibility pure and deterministic', () => {
    let enumerateCalls = 0;
    const governanceDecisions: readonly GovernanceDecisionSnapshot[] = [
      createGovernanceDecision('Approved').toSnapshot(),
    ];
    const repository = {
      enumerate(): readonly GovernanceDecisionSnapshot[] {
        enumerateCalls += 1;

        return governanceDecisions;
      },
    };
    const firstResult = isGovernanceGatedMissionCompletionEligible({ governanceDecisions });
    const secondResult = isGovernanceGatedMissionCompletionEligible({ governanceDecisions });

    expect(firstResult).toBe(true);
    expect(secondResult).toBe(true);
    expect(enumerateCalls).toBe(0);
    expect(repository.enumerate()).toEqual(governanceDecisions);
    expect(enumerateCalls).toBe(1);
  });

  it('wires createKernelServices MissionExecutionService to the shared GovernanceDecision repository', async () => {
    const eventBus = new EventBus(new TestLogger());
    const services = createKernelServices(eventBus);
    const missionService = requireService(services, MissionService);
    const missionPlanningService = requireService(services, MissionPlanningService);
    const missionExecutionService = requireService(services, MissionExecutionService);
    const governanceService = requireService(services, GovernanceService);

    await missionService.createMission({
      id: 'mission-1',
      objective: 'Validate shared GovernanceDecision repository wiring',
    });
    await missionService.planMission('mission-1');
    await missionService.markMissionReady('mission-1');
    await missionPlanningService.createMissionPlan({
      id: 'plan-1',
      missionId: 'mission-1',
      revisionReason: 'Initial plan',
    });
    await missionPlanningService.addTask({
      missionPlanId: 'plan-1',
      taskId: 'task-1',
      title: 'Complete task',
      description: 'Complete task before Mission Completion',
      revisionReason: 'Add task',
    });
    await missionPlanningService.updateTask({
      missionPlanId: 'plan-1',
      taskId: 'task-1',
      status: 'Ready',
      revisionReason: 'Ready task',
    });
    await missionExecutionService.startMission({ missionId: 'mission-1' });
    await missionExecutionService.startTask({ missionId: 'mission-1', taskId: 'task-1' });
    await missionExecutionService.completeTask({ missionId: 'mission-1', taskId: 'task-1' });
    await missionService.reviewMission('mission-1');

    await governanceService.evaluateGovernancePolicy({
      missionId: 'mission-1',
      repositoryPolicyId: 'missing-policy',
      repositoryPolicyVersion: 1,
      reviewId: 'missing-review',
      evaluatedAt: timestamp,
    });

    await expect(
      missionExecutionService.completeMission({ missionId: 'mission-1' }),
    ).rejects.toThrow(MissionCompletionRejectedError);
  });

  it('reports blocking GovernanceDecision details without mutating Mission state', () => {
    const governanceDecision = createGovernanceDecision('Rejected');

    expect(() =>
      assertGovernanceGatedMissionCompletionEligible({
        governanceDecisions: [governanceDecision.toSnapshot()],
      }),
    ).toThrow(MissionCompletionRejectedError);
    expect(governanceDecision.toSnapshot().value).toBe('Rejected');
  });
});
