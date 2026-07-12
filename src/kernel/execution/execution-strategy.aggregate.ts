import { ExecutionStrategyId } from './execution-strategy-id';
import {
  concurrencyRules,
  dependencyOrderingRules,
  type AssignmentReadinessResult,
  type ConcurrencyRule,
  type DependencyOrderingRule,
  type ExecutionStrategyEvaluationInput,
  type ExecutionStrategySnapshot,
  type ExecutionStrategyTask,
} from './execution-strategy.types';
import {
  ExecutionStrategyReferenceError,
  InvalidExecutionStrategyDefinitionError,
  UnsatisfiedDependencyOrderingError,
} from './execution-strategy.errors';

export interface ExecutionStrategyInput {
  readonly id: ExecutionStrategyId | string;
  readonly missionId: string;
  readonly dependencyOrderingRule?: DependencyOrderingRule | string;
  readonly concurrencyRule?: ConcurrencyRule | string;
}

export class ExecutionStrategy {
  private constructor(
    private readonly executionStrategyId: ExecutionStrategyId,
    private readonly missionIdValue: string,
    private readonly dependencyOrderingRuleValue: DependencyOrderingRule,
    private readonly concurrencyRuleValue: ConcurrencyRule,
  ) {
    Object.freeze(this);
  }

  public static create(input: ExecutionStrategyInput): ExecutionStrategy {
    return new ExecutionStrategy(
      normalizeExecutionStrategyId(input.id),
      normalizeNonEmptyString(input.missionId, 'Mission identity'),
      normalizeAllowed(
        input.dependencyOrderingRule ?? 'RequireCompletedDependencies',
        dependencyOrderingRules,
        'Dependency ordering rule',
      ),
      normalizeAllowed(
        input.concurrencyRule ?? 'IndependentTasksMayBeReadyConcurrently',
        concurrencyRules,
        'Concurrency rule',
      ),
    );
  }

  public static fromSnapshot(snapshot: ExecutionStrategySnapshot): ExecutionStrategy {
    return ExecutionStrategy.create(snapshot);
  }

  public get id(): ExecutionStrategyId {
    return this.executionStrategyId;
  }

  public get missionId(): string {
    return this.missionIdValue;
  }

  public get dependencyOrderingRule(): DependencyOrderingRule {
    return this.dependencyOrderingRuleValue;
  }

  public get concurrencyRule(): ConcurrencyRule {
    return this.concurrencyRuleValue;
  }

  public evaluateAssignmentReadiness(
    input: ExecutionStrategyEvaluationInput,
  ): AssignmentReadinessResult {
    if (input.missionId !== this.missionIdValue) {
      throw new ExecutionStrategyReferenceError(
        `ExecutionStrategy '${this.executionStrategyId.toString()}' belongs to Mission '${this.missionIdValue}', not Mission '${input.missionId}'.`,
      );
    }

    const tasksById = new Map(input.tasks.map((task) => [task.id, task]));
    const task = tasksById.get(input.taskId);

    if (task === undefined) {
      throw new ExecutionStrategyReferenceError(
        `Task '${input.taskId}' was not found in MissionPlan '${input.missionPlanId}'.`,
      );
    }

    const dependencyTaskIds = collectTransitiveDependencyTaskIds(task, tasksById);
    const unsatisfiedDependencyTaskIds = dependencyTaskIds.filter((dependencyTaskId) => {
      const dependencyTask = tasksById.get(dependencyTaskId);

      return dependencyTask === undefined || dependencyTask.status !== 'Completed';
    });

    if (unsatisfiedDependencyTaskIds.length > 0) {
      throw new UnsatisfiedDependencyOrderingError(input.taskId, unsatisfiedDependencyTaskIds);
    }

    return Object.freeze({
      executionStrategyId: this.executionStrategyId.toString(),
      missionId: this.missionIdValue,
      missionPlanId: input.missionPlanId,
      taskId: input.taskId,
      roleId: input.roleId,
      ready: true,
      satisfiedDependencyTaskIds: Object.freeze(dependencyTaskIds),
      concurrencyRule: this.concurrencyRuleValue,
    });
  }

  public toSnapshot(): ExecutionStrategySnapshot {
    return Object.freeze({
      id: this.executionStrategyId.toString(),
      missionId: this.missionIdValue,
      dependencyOrderingRule: this.dependencyOrderingRuleValue,
      concurrencyRule: this.concurrencyRuleValue,
    });
  }
}

function collectTransitiveDependencyTaskIds(
  task: ExecutionStrategyTask,
  tasksById: ReadonlyMap<string, ExecutionStrategyTask>,
): readonly string[] {
  const dependencyTaskIds = new Set<string>();

  visitDependencies(task, tasksById, dependencyTaskIds);

  return Object.freeze([...dependencyTaskIds].sort((left, right) => left.localeCompare(right)));
}

function visitDependencies(
  task: ExecutionStrategyTask,
  tasksById: ReadonlyMap<string, ExecutionStrategyTask>,
  dependencyTaskIds: Set<string>,
): void {
  for (const dependencyTaskId of task.dependencies) {
    if (dependencyTaskIds.has(dependencyTaskId)) {
      continue;
    }

    dependencyTaskIds.add(dependencyTaskId);

    const dependencyTask = tasksById.get(dependencyTaskId);

    if (dependencyTask !== undefined) {
      visitDependencies(dependencyTask, tasksById, dependencyTaskIds);
    }
  }
}

function normalizeExecutionStrategyId(
  executionStrategyId: ExecutionStrategyId | string,
): ExecutionStrategyId {
  return typeof executionStrategyId === 'string'
    ? ExecutionStrategyId.fromString(executionStrategyId)
    : executionStrategyId;
}

function normalizeAllowed<const T extends readonly string[]>(
  value: T[number] | string,
  allowed: T,
  label: string,
): T[number] {
  const normalized = value.trim();

  if (!allowed.some((candidate) => candidate === normalized)) {
    throw new InvalidExecutionStrategyDefinitionError(`${label} '${normalized}' is not valid.`);
  }

  return normalized as T[number];
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidExecutionStrategyDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
