import { describe, expect, it } from 'vitest';

import { EventBus } from '../../../src/kernel/events/event-bus';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';
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
import { InMemoryMissionRepository } from '../../../src/kernel/mission/mission.repository';
import { MissionService } from '../../../src/kernel/mission/mission.service';
import type { DomainEventMetadata } from '../../../src/kernel/mission/mission.types';
import { Task } from '../../../src/kernel/mission/task';
import { TaskDependency } from '../../../src/kernel/mission/task-dependency';
import { TaskId } from '../../../src/kernel/mission/task-id';

const timestamp = '2026-07-12T00:00:00.000Z';

class TestLogger implements KernelLogger {
  public info(): void {}

  public error(): void {}
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

describe('MissionExecutionService', () => {
  it('coordinates deterministic Mission and Task execution through aggregates', async () => {
    const repository = new InMemoryMissionRepository();
    const eventBus = new EventBus(new TestLogger());
    const service = new MissionExecutionService(
      repository,
      eventBus,
      sequence(['event-started', 'event-completed']),
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
      sequence(['event-started', 'event-completed']),
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
    ]);
  });

  it('rejects Mission completion unless all Tasks are completed and lifecycle permits completion', async () => {
    const repository = new InMemoryMissionRepository();
    const service = new MissionExecutionService(
      repository,
      new EventBus(new TestLogger()),
      sequence(['event-started', 'event-completed']),
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
      sequence(['event-started', 'event-completed']),
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
});
