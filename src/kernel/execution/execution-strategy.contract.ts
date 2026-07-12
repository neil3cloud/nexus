import type { AssignmentReadinessResult, ExecutionStrategySnapshot } from './execution-strategy.types';

export interface CreateExecutionStrategyCommand {
  readonly id?: string;
  readonly missionId: string;
}

export interface EvaluateAssignmentReadinessCommand {
  readonly executionStrategyId: string;
  readonly missionPlanId: string;
  readonly taskId: string;
}

export interface ExecutionStrategyServiceContract {
  createExecutionStrategy(command: CreateExecutionStrategyCommand): Promise<ExecutionStrategySnapshot>;
  evaluateAssignmentReadiness(
    command: EvaluateAssignmentReadinessCommand,
  ): Promise<AssignmentReadinessResult>;
  enumerateExecutionStrategies(): Promise<readonly ExecutionStrategySnapshot[]>;
}
