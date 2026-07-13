import { randomUUID } from 'node:crypto';

import { ServiceLifecycle } from '../common/service-lifecycle';
import { MissionPlanId } from '../mission/mission-plan-id';
import type { IMissionPlanRepository } from '../mission/mission.repository';
import type { RoleAssignmentRepository } from './role-assignment.repository';
import {
  ExecutionStrategy,
} from './execution-strategy.aggregate';
import type {
  CreateExecutionStrategyCommand,
  EvaluateAssignmentReadinessCommand,
  ExecutionStrategyServiceContract,
} from './execution-strategy.contract';
import { ExecutionStrategyId } from './execution-strategy-id';
import {
  InMemoryExecutionStrategyRepository,
  type IExecutionStrategyRepository,
} from './execution-strategy.repository';
import type { AssignmentReadinessResult, ExecutionStrategySnapshot } from './execution-strategy.types';
import {
  DuplicateExecutionStrategyForMissionError,
  ExecutionStrategyNotFoundError,
  ExecutionStrategyReferenceError,
} from './execution-strategy.errors';
import { RoleAssignmentNotFoundError } from './role.errors';

export class ExecutionStrategyService
  extends ServiceLifecycle
  implements ExecutionStrategyServiceContract
{
  public constructor(
    private readonly repository: IExecutionStrategyRepository = new InMemoryExecutionStrategyRepository(),
    private readonly roleAssignments: RoleAssignmentRepository,
    private readonly missionPlans: IMissionPlanRepository,
    private readonly createIdentity: () => string = randomUUID,
  ) {
    super('ExecutionStrategyService');
  }

  public async createExecutionStrategy(
    command: CreateExecutionStrategyCommand,
  ): Promise<ExecutionStrategySnapshot> {
    if ((await this.repository.getByMissionId(command.missionId)) !== undefined) {
      throw new DuplicateExecutionStrategyForMissionError(command.missionId.trim());
    }

    const executionStrategy = ExecutionStrategy.create({
      id: command.id ?? this.createIdentity(),
      missionId: command.missionId,
    });

    await this.repository.create(executionStrategy);

    return executionStrategy.toSnapshot();
  }

  public async evaluateAssignmentReadiness(
    command: EvaluateAssignmentReadinessCommand,
  ): Promise<AssignmentReadinessResult> {
    const executionStrategy = await this.requireExecutionStrategy(command.executionStrategyId);
    const missionPlan = await this.missionPlans.getMissionPlanById(
      MissionPlanId.fromString(command.missionPlanId),
    );

    if (missionPlan === undefined) {
      throw new ExecutionStrategyReferenceError(
        `MissionPlan '${command.missionPlanId.trim()}' was not found.`,
      );
    }

    const assignment = await this.roleAssignments.getByTaskId(command.taskId);

    if (assignment === undefined) {
      throw new RoleAssignmentNotFoundError(command.taskId.trim());
    }

    return executionStrategy.evaluateAssignmentReadiness({
      missionPlanId: missionPlan.id.toString(),
      missionId: missionPlan.missionId.toString(),
      taskId: assignment.taskId,
      roleId: assignment.roleId.toString(),
      tasks: missionPlan.tasks.map((task) => ({
        id: task.id,
        status: task.status,
        dependencies: task.dependencies,
      })),
    });
  }

  public async enumerateExecutionStrategies(): Promise<readonly ExecutionStrategySnapshot[]> {
    return Object.freeze(
      (await this.repository.enumerate()).map((executionStrategy) =>
        executionStrategy.toSnapshot(),
      ),
    );
  }

  private async requireExecutionStrategy(
    executionStrategyId: ExecutionStrategyId | string,
  ): Promise<ExecutionStrategy> {
    const normalizedExecutionStrategyId =
      typeof executionStrategyId === 'string'
        ? ExecutionStrategyId.fromString(executionStrategyId)
        : executionStrategyId;
    const executionStrategy = await this.repository.getById(normalizedExecutionStrategyId);

    if (executionStrategy === undefined) {
      throw new ExecutionStrategyNotFoundError(normalizedExecutionStrategyId.toString());
    }

    return executionStrategy;
  }
}
