import { describe, expect, it } from 'vitest';

import {
  DuplicateExecutionStrategyForMissionError,
  ExecutionStrategyNotFoundError,
  UnsatisfiedDependencyOrderingError,
} from '../../../src/kernel/execution/execution-strategy.errors';
import { InMemoryExecutionStrategyRepository } from '../../../src/kernel/execution/execution-strategy.repository';
import { ExecutionStrategyService } from '../../../src/kernel/execution/execution-strategy.service';
import { RoleAssignment } from '../../../src/kernel/execution/role-assignment';
import { InMemoryRoleAssignmentRepository } from '../../../src/kernel/execution/role-assignment.repository';
import { RoleAssignmentNotFoundError } from '../../../src/kernel/execution/role.errors';
import { MissionId } from '../../../src/kernel/mission/mission-id';
import { MissionPlan } from '../../../src/kernel/mission/mission-plan.aggregate';
import { MissionPlanId } from '../../../src/kernel/mission/mission-plan-id';
import type { RevisionMetadata } from '../../../src/kernel/mission/mission-planning.types';
import { InMemoryMissionRepository } from '../../../src/kernel/mission/mission.repository';
import { Task } from '../../../src/kernel/mission/task';
import { TaskDependency } from '../../../src/kernel/mission/task-dependency';
import { TaskId } from '../../../src/kernel/mission/task-id';

const timestamp = '2026-07-12T00:00:00.000Z';

function revisionMetadata(reason: string): RevisionMetadata {
  return {
    createdAt: timestamp,
    reason,
    attributes: {},
  };
}

function task(id: string, missionPlanId: MissionPlanId): Task {
  return Task.create({
    id: TaskId.fromString(id),
    title: `Task ${id}`,
    description: `Execute ${id}`,
    parentMissionPlanId: missionPlanId,
  });
}

function createMissionPlan(): MissionPlan {
  const missionPlan = MissionPlan.create({
    id: MissionPlanId.fromString('plan-1'),
    missionId: MissionId.fromString('mission-1'),
    revisionMetadata: revisionMetadata('Initial plan'),
  });
  const firstTask = task('task-1', missionPlan.id);
  const secondTask = task('task-2', missionPlan.id);
  const thirdTask = task('task-3', missionPlan.id);

  firstTask.markReady();
  firstTask.start();
  firstTask.complete();
  secondTask.markReady();
  secondTask.start();
  secondTask.complete();
  secondTask.addDependency(TaskDependency.fromTaskIds(secondTask.id, firstTask.id));
  thirdTask.markReady();
  thirdTask.addDependency(TaskDependency.fromTaskIds(thirdTask.id, secondTask.id));

  missionPlan.addTask(firstTask, revisionMetadata('Add first task'));
  missionPlan.addTask(secondTask, revisionMetadata('Add second task'));
  missionPlan.addTask(thirdTask, revisionMetadata('Add third task'));

  return missionPlan;
}

describe('ExecutionStrategyService', () => {
  it('coordinates strategy creation and assignment readiness through injected repositories', async () => {
    const strategies = new InMemoryExecutionStrategyRepository();
    const assignments = new InMemoryRoleAssignmentRepository();
    const missionPlans = new InMemoryMissionRepository();
    const service = new ExecutionStrategyService(strategies, assignments, missionPlans, () => 'strategy-1');

    await missionPlans.saveMissionPlan(createMissionPlan());
    await assignments.save(RoleAssignment.create({ taskId: 'task-3', roleId: 'builder' }));

    const strategy = await service.createExecutionStrategy({ missionId: 'mission-1' });
    const readiness = await service.evaluateAssignmentReadiness({
      executionStrategyId: strategy.id,
      missionPlanId: 'plan-1',
      taskId: 'task-3',
    });

    expect(strategy.id).toBe('strategy-1');
    expect(readiness.satisfiedDependencyTaskIds).toEqual(['task-1', 'task-2']);
    expect((await service.enumerateExecutionStrategies()).map((item) => item.id)).toEqual([
      'strategy-1',
    ]);
  });

  it('surfaces deterministic diagnostics for duplicates, missing assignments, and missing strategy', async () => {
    const missionPlans = new InMemoryMissionRepository();
    const service = new ExecutionStrategyService(
      new InMemoryExecutionStrategyRepository(),
      new InMemoryRoleAssignmentRepository(),
      missionPlans,
    );

    await missionPlans.saveMissionPlan(createMissionPlan());
    await service.createExecutionStrategy({ id: 'strategy-1', missionId: 'mission-1' });

    await expect(
      service.createExecutionStrategy({ id: 'strategy-2', missionId: 'mission-1' }),
    ).rejects.toThrow(DuplicateExecutionStrategyForMissionError);
    await expect(
      service.evaluateAssignmentReadiness({
        executionStrategyId: 'missing-strategy',
        missionPlanId: 'plan-1',
        taskId: 'task-1',
      }),
    ).rejects.toThrow(ExecutionStrategyNotFoundError);
    await expect(
      service.evaluateAssignmentReadiness({
        executionStrategyId: 'strategy-1',
        missionPlanId: 'plan-1',
        taskId: 'task-1',
      }),
    ).rejects.toThrow(RoleAssignmentNotFoundError);
  });

  it('rejects readiness when dependency ordering is unsatisfied', async () => {
    const strategies = new InMemoryExecutionStrategyRepository();
    const assignments = new InMemoryRoleAssignmentRepository();
    const missionPlans = new InMemoryMissionRepository();
    const service = new ExecutionStrategyService(strategies, assignments, missionPlans);
    const missionPlan = MissionPlan.fromSnapshot({
      ...createMissionPlan().toSnapshot(),
      tasks: [
        {
          id: 'task-1',
          title: 'Task task-1',
          description: 'Execute task-1',
          status: 'Ready',
          parentMissionPlanId: 'plan-1',
          dependencies: [],
          metadata: {},
        },
        {
          id: 'task-2',
          title: 'Task task-2',
          description: 'Execute task-2',
          status: 'Completed',
          parentMissionPlanId: 'plan-1',
          dependencies: ['task-1'],
          metadata: {},
        },
        {
          id: 'task-3',
          title: 'Task task-3',
          description: 'Execute task-3',
          status: 'Ready',
          parentMissionPlanId: 'plan-1',
          dependencies: ['task-2'],
          metadata: {},
        },
      ],
    });
    await missionPlans.saveMissionPlan(missionPlan);
    await assignments.save(RoleAssignment.create({ taskId: 'task-3', roleId: 'builder' }));
    await service.createExecutionStrategy({ id: 'strategy-1', missionId: 'mission-1' });

    await expect(
      service.evaluateAssignmentReadiness({
        executionStrategyId: 'strategy-1',
        missionPlanId: 'plan-1',
        taskId: 'task-3',
      }),
    ).rejects.toThrow(UnsatisfiedDependencyOrderingError);
  });
});
