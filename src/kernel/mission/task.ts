import {
  MissionPlanningValidationError,
  TaskLifecycleTransitionError,
} from './mission.errors';
import { MissionPlanId } from './mission-plan-id';
import type { PlanningMetadata, TaskSnapshot, TaskStatus } from './mission-planning.types';
import { TaskDependency } from './task-dependency';
import { TaskId } from './task-id';

export class Task {
  private readonly dependenciesByTaskId = new Map<string, TaskId>();
  private metadataValue: PlanningMetadata;

  private constructor(
    private readonly taskId: TaskId,
    private titleValue: string,
    private descriptionValue: string,
    private statusValue: TaskStatus,
    private readonly parentMissionPlanIdValue: MissionPlanId,
    dependencies: readonly TaskId[],
    metadata: PlanningMetadata,
  ) {
    this.titleValue = normalizeRequiredText(titleValue, 'Task title');
    this.descriptionValue = descriptionValue;
    this.metadataValue = cloneMetadata(metadata);
    this.replaceDependencies(dependencies);
  }

  public static create(input: {
    readonly id: TaskId;
    readonly title: string;
    readonly description: string;
    readonly parentMissionPlanId: MissionPlanId;
    readonly dependencies?: readonly TaskId[];
    readonly metadata?: PlanningMetadata;
  }): Task {
    return new Task(
      input.id,
      input.title,
      input.description,
      'Planned',
      input.parentMissionPlanId,
      input.dependencies ?? [],
      input.metadata ?? {},
    );
  }

  public static fromSnapshot(snapshot: TaskSnapshot): Task {
    return new Task(
      TaskId.fromString(snapshot.id),
      snapshot.title,
      snapshot.description,
      snapshot.status,
      MissionPlanId.fromString(snapshot.parentMissionPlanId),
      snapshot.dependencies.map((dependency) => TaskId.fromString(dependency)),
      snapshot.metadata,
    );
  }

  public get id(): TaskId {
    return this.taskId;
  }

  public get title(): string {
    return this.titleValue;
  }

  public get description(): string {
    return this.descriptionValue;
  }

  public get status(): TaskStatus {
    return this.statusValue;
  }

  public get parentMissionPlanId(): MissionPlanId {
    return this.parentMissionPlanIdValue;
  }

  public get metadata(): PlanningMetadata {
    return cloneMetadata(this.metadataValue);
  }

  public assertUpdateIsValid(input: {
    readonly title?: string;
    readonly status?: TaskStatus;
    readonly dependencies?: readonly TaskId[];
  }): void {
    if (input.title !== undefined) {
      normalizeRequiredText(input.title, 'Task title');
    }

    if (input.status !== undefined && !isValidTaskStatusTransition(this.statusValue, input.status)) {
      throw new TaskLifecycleTransitionError(this.statusValue, input.status);
    }

    if (
      input.status !== undefined &&
      input.status === this.statusValue &&
      isTerminalTaskStatus(this.statusValue)
    ) {
      throw new TaskLifecycleTransitionError(this.statusValue, input.status);
    }

    if (input.dependencies !== undefined) {
      validateDependencies(this.taskId, input.dependencies);
    }
  }

  public update(input: {
    readonly title?: string;
    readonly description?: string;
    readonly metadata?: PlanningMetadata;
  }): void {
    if (input.title !== undefined) {
      this.titleValue = normalizeRequiredText(input.title, 'Task title');
    }

    if (input.description !== undefined) {
      this.descriptionValue = input.description;
    }

    if (input.metadata !== undefined) {
      this.metadataValue = cloneMetadata(input.metadata);
    }
  }

  public transitionTo(status: TaskStatus): void {
    if (this.statusValue === status) {
      return;
    }

    if (!isValidTaskStatusTransition(this.statusValue, status)) {
      throw new TaskLifecycleTransitionError(this.statusValue, status);
    }

    this.statusValue = status;
  }

  public addDependency(dependency: TaskDependency): void {
    if (!dependency.taskId.equals(this.taskId)) {
      throw new MissionPlanningValidationError(
        `TaskDependency target '${dependency.taskId.toString()}' does not match Task '${this.taskId.toString()}'.`,
      );
    }

    const prerequisiteId = dependency.prerequisiteTaskId.toString();

    if (this.dependenciesByTaskId.has(prerequisiteId)) {
      throw new MissionPlanningValidationError(
        `Task '${this.taskId.toString()}' already depends on Task '${prerequisiteId}'.`,
      );
    }

    this.dependenciesByTaskId.set(prerequisiteId, dependency.prerequisiteTaskId);
  }

  public removeDependency(prerequisiteTaskId: TaskId): void {
    this.dependenciesByTaskId.delete(prerequisiteTaskId.toString());
  }

  public replaceDependencies(prerequisiteTaskIds: readonly TaskId[]): void {
    validateDependencies(this.taskId, prerequisiteTaskIds);

    const dependencies = prerequisiteTaskIds.map((prerequisiteTaskId) =>
      TaskDependency.fromTaskIds(this.taskId, prerequisiteTaskId),
    );

    this.dependenciesByTaskId.clear();

    for (const dependency of dependencies) {
      this.addDependency(dependency);
    }
  }

  public prerequisites(): readonly TaskId[] {
    return [...this.dependenciesByTaskId.values()];
  }

  public toSnapshot(): TaskSnapshot {
    return {
      id: this.taskId.toString(),
      title: this.titleValue,
      description: this.descriptionValue,
      status: this.statusValue,
      parentMissionPlanId: this.parentMissionPlanIdValue.toString(),
      dependencies: this.prerequisites().map((dependency) => dependency.toString()),
      metadata: cloneMetadata(this.metadataValue),
    };
  }
}

function isValidTaskStatusTransition(from: TaskStatus, to: TaskStatus): boolean {
  if (from === to) {
    return true;
  }

  if (from === 'Planned') {
    return to === 'Ready' || to === 'Cancelled';
  }

  if (from === 'Ready') {
    return to === 'InProgress' || to === 'Cancelled';
  }

  if (from === 'InProgress') {
    return to === 'Completed' || to === 'Cancelled';
  }

  return false;
}

function isTerminalTaskStatus(status: TaskStatus): boolean {
  return status === 'Completed' || status === 'Cancelled';
}

function validateDependencies(taskId: TaskId, prerequisiteTaskIds: readonly TaskId[]): void {
  const seen = new Set<string>();

  for (const prerequisiteTaskId of prerequisiteTaskIds) {
    TaskDependency.fromTaskIds(taskId, prerequisiteTaskId);

    const prerequisiteId = prerequisiteTaskId.toString();

    if (seen.has(prerequisiteId)) {
      throw new MissionPlanningValidationError(
        `Task '${taskId.toString()}' already depends on Task '${prerequisiteId}'.`,
      );
    }

    seen.add(prerequisiteId);
  }
}

function normalizeRequiredText(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new MissionPlanningValidationError(`${label} must be a non-empty string.`);
  }

  return normalized;
}

export function cloneMetadata(metadata: PlanningMetadata): PlanningMetadata {
  return Object.freeze({ ...metadata });
}
