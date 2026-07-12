export const dependencyOrderingRules = ['RequireCompletedDependencies'] as const;
export type DependencyOrderingRule = (typeof dependencyOrderingRules)[number];

export const concurrencyRules = ['IndependentTasksMayBeReadyConcurrently'] as const;
export type ConcurrencyRule = (typeof concurrencyRules)[number];

export interface ExecutionStrategySnapshot {
  readonly id: string;
  readonly missionId: string;
  readonly dependencyOrderingRule: DependencyOrderingRule;
  readonly concurrencyRule: ConcurrencyRule;
}

export interface ExecutionStrategyEvaluationInput {
  readonly missionPlanId: string;
  readonly missionId: string;
  readonly taskId: string;
  readonly roleId: string;
  readonly tasks: readonly ExecutionStrategyTask[];
}

export interface ExecutionStrategyTask {
  readonly id: string;
  readonly status: string;
  readonly dependencies: readonly string[];
}

export interface AssignmentReadinessResult {
  readonly executionStrategyId: string;
  readonly missionId: string;
  readonly missionPlanId: string;
  readonly taskId: string;
  readonly roleId: string;
  readonly ready: true;
  readonly satisfiedDependencyTaskIds: readonly string[];
  readonly concurrencyRule: ConcurrencyRule;
}
