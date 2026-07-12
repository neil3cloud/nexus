import { describe, expect, it } from 'vitest';

import { ExecutionStrategy } from '../../../src/kernel/execution/execution-strategy.aggregate';
import { ExecutionStrategyId } from '../../../src/kernel/execution/execution-strategy-id';
import {
  ExecutionStrategyReferenceError,
  InvalidExecutionStrategyDefinitionError,
  UnsatisfiedDependencyOrderingError,
} from '../../../src/kernel/execution/execution-strategy.errors';

function executionStrategy(): ExecutionStrategy {
  return ExecutionStrategy.create({
    id: ' strategy-1 ',
    missionId: ' mission-1 ',
  });
}

describe('ExecutionStrategy', () => {
  it('creates deterministic policy data for one Mission', () => {
    const strategy = executionStrategy();

    expect(strategy.id.equals(ExecutionStrategyId.fromString('strategy-1'))).toBe(true);
    expect(strategy.toSnapshot()).toEqual({
      id: 'strategy-1',
      missionId: 'mission-1',
      dependencyOrderingRule: 'RequireCompletedDependencies',
      concurrencyRule: 'IndependentTasksMayBeReadyConcurrently',
    });
  });

  it('evaluates assignment readiness when direct and transitive dependencies are completed', () => {
    const result = executionStrategy().evaluateAssignmentReadiness({
      missionPlanId: 'plan-1',
      missionId: 'mission-1',
      taskId: 'task-3',
      roleId: 'builder',
      tasks: [
        { id: 'task-1', status: 'Completed', dependencies: [] },
        { id: 'task-2', status: 'Completed', dependencies: ['task-1'] },
        { id: 'task-3', status: 'Ready', dependencies: ['task-2'] },
      ],
    });

    expect(result).toEqual({
      executionStrategyId: 'strategy-1',
      missionId: 'mission-1',
      missionPlanId: 'plan-1',
      taskId: 'task-3',
      roleId: 'builder',
      ready: true,
      satisfiedDependencyTaskIds: ['task-1', 'task-2'],
      concurrencyRule: 'IndependentTasksMayBeReadyConcurrently',
    });
  });

  it('rejects assignment readiness when transitive dependency ordering is unsatisfied', () => {
    expect(() =>
      executionStrategy().evaluateAssignmentReadiness({
        missionPlanId: 'plan-1',
        missionId: 'mission-1',
        taskId: 'task-3',
        roleId: 'builder',
        tasks: [
          { id: 'task-1', status: 'Ready', dependencies: [] },
          { id: 'task-2', status: 'Completed', dependencies: ['task-1'] },
          { id: 'task-3', status: 'Ready', dependencies: ['task-2'] },
        ],
      }),
    ).toThrow(UnsatisfiedDependencyOrderingError);
  });

  it('rejects unknown references and invalid definitions', () => {
    expect(() => ExecutionStrategy.create({ id: ' ', missionId: 'mission-1' })).toThrow(
      InvalidExecutionStrategyDefinitionError,
    );

    expect(() =>
      executionStrategy().evaluateAssignmentReadiness({
        missionPlanId: 'plan-1',
        missionId: 'mission-2',
        taskId: 'task-1',
        roleId: 'builder',
        tasks: [{ id: 'task-1', status: 'Ready', dependencies: [] }],
      }),
    ).toThrow(ExecutionStrategyReferenceError);

    expect(() =>
      executionStrategy().evaluateAssignmentReadiness({
        missionPlanId: 'plan-1',
        missionId: 'mission-1',
        taskId: 'missing-task',
        roleId: 'builder',
        tasks: [{ id: 'task-1', status: 'Ready', dependencies: [] }],
      }),
    ).toThrow(ExecutionStrategyReferenceError);
  });
});
