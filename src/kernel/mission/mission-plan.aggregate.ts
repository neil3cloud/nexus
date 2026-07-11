import { MissionId } from './mission-id';
import { MissionPlanningValidationError, TaskNotFoundError } from './mission.errors';
import { MissionPlanId } from './mission-plan-id';
import type {
  MissionPlanSnapshot,
  PlanningMetadata,
  RevisionMetadata,
  TaskSnapshot,
  TaskStatus,
} from './mission-planning.types';
import { PlanRevision, cloneRevisionMetadata, cloneTaskSnapshot } from './plan-revision';
import { Task } from './task';
import { TaskDependency } from './task-dependency';
import { TaskId } from './task-id';

export class MissionPlan {
  private readonly tasksById = new Map<string, Task>();
  private readonly revisionsValue: PlanRevision[] = [];
  private metadataValue: PlanningMetadata;
  private revisionNumberValue: number;

  private constructor(
    private readonly missionPlanId: MissionPlanId,
    private readonly missionIdValue: MissionId,
    revisionNumber: number,
    metadata: PlanningMetadata,
  ) {
    this.revisionNumberValue = revisionNumber;
    this.metadataValue = Object.freeze({ ...metadata });
  }

  public static create(input: {
    readonly id: MissionPlanId;
    readonly missionId: MissionId;
    readonly metadata?: PlanningMetadata;
    readonly revisionMetadata: RevisionMetadata;
  }): MissionPlan {
    const missionPlan = new MissionPlan(input.id, input.missionId, 1, input.metadata ?? {});

    missionPlan.recordCurrentRevision(input.revisionMetadata);

    return missionPlan;
  }

  public static fromSnapshot(snapshot: MissionPlanSnapshot): MissionPlan {
    const missionPlan = new MissionPlan(
      MissionPlanId.fromString(snapshot.id),
      MissionId.fromString(snapshot.missionId),
      snapshot.revisionNumber,
      snapshot.metadata,
    );

    for (const taskSnapshot of snapshot.tasks) {
      missionPlan.tasksById.set(taskSnapshot.id, Task.fromSnapshot(taskSnapshot));
    }

    for (const revisionSnapshot of snapshot.revisions) {
      missionPlan.revisionsValue.push(PlanRevision.fromSnapshot(revisionSnapshot));
    }

    return missionPlan;
  }

  public get id(): MissionPlanId {
    return this.missionPlanId;
  }

  public get missionId(): MissionId {
    return this.missionIdValue;
  }

  public get revisionNumber(): number {
    return this.revisionNumberValue;
  }

  public get metadata(): PlanningMetadata {
    return Object.freeze({ ...this.metadataValue });
  }

  public get tasks(): readonly TaskSnapshot[] {
    return this.currentTaskSnapshots();
  }

  public get revisions(): readonly PlanRevision[] {
    return [...this.revisionsValue];
  }

  public addTask(task: Task, revisionMetadata: RevisionMetadata): void {
    this.assertTaskOwnership(task);

    const taskId = task.id.toString();

    if (this.tasksById.has(taskId)) {
      throw new MissionPlanningValidationError(`Task '${taskId}' already exists in MissionPlan.`);
    }

    this.assertDependenciesExist(task.prerequisites());
    this.assertDependencyUpdateIsAcyclic(task.id, task.prerequisites());
    this.tasksById.set(taskId, Task.fromSnapshot(task.toSnapshot()));
    this.recordNextRevision(revisionMetadata);
  }

  public updateTask(
    taskId: TaskId,
    input: {
      readonly title?: string;
      readonly description?: string;
      readonly status?: TaskStatus;
      readonly dependencies?: readonly TaskId[];
      readonly metadata?: PlanningMetadata;
    },
    revisionMetadata: RevisionMetadata,
  ): void {
    const task = this.requireTask(taskId);

    task.assertUpdateIsValid(input);

    if (input.dependencies !== undefined) {
      this.assertDependenciesExist(input.dependencies);
      this.assertDependencyUpdateIsAcyclic(taskId, input.dependencies);
    }

    task.update(input);

    if (input.status !== undefined) {
      task.transitionTo(input.status);
    }

    if (input.dependencies !== undefined) {
      task.replaceDependencies(input.dependencies);
    }

    this.recordNextRevision(revisionMetadata);
  }

  public removeTask(taskId: TaskId, revisionMetadata: RevisionMetadata): void {
    const normalizedTaskId = taskId.toString();

    if (!this.tasksById.delete(normalizedTaskId)) {
      throw new TaskNotFoundError(normalizedTaskId);
    }

    for (const task of this.tasksById.values()) {
      task.removeDependency(taskId);
    }

    this.recordNextRevision(revisionMetadata);
  }

  public addTaskDependency(
    taskId: TaskId,
    prerequisiteTaskId: TaskId,
    revisionMetadata: RevisionMetadata,
  ): void {
    this.requireTask(prerequisiteTaskId);
    const task = this.requireTask(taskId);
    const updatedPrerequisites = [...task.prerequisites(), prerequisiteTaskId];

    this.assertDependencyUpdateIsAcyclic(taskId, updatedPrerequisites);
    task.addDependency(TaskDependency.fromTaskIds(taskId, prerequisiteTaskId));
    this.recordNextRevision(revisionMetadata);
  }

  public removeTaskDependency(
    taskId: TaskId,
    prerequisiteTaskId: TaskId,
    revisionMetadata: RevisionMetadata,
  ): void {
    this.requireTask(taskId).removeDependency(prerequisiteTaskId);
    this.recordNextRevision(revisionMetadata);
  }

  public prerequisitesFor(taskId: TaskId): readonly TaskId[] {
    return this.requireTask(taskId).prerequisites();
  }

  public revise(input: { readonly metadata?: PlanningMetadata }, revisionMetadata: RevisionMetadata): void {
    if (input.metadata !== undefined) {
      this.metadataValue = Object.freeze({ ...input.metadata });
    }

    this.recordNextRevision(revisionMetadata);
  }

  public getRevision(revisionNumber: number): PlanRevision | undefined {
    return this.revisionsValue.find((revision) => revision.revisionNumber === revisionNumber);
  }

  public toSnapshot(): MissionPlanSnapshot {
    return {
      id: this.missionPlanId.toString(),
      missionId: this.missionIdValue.toString(),
      revisionNumber: this.revisionNumberValue,
      metadata: Object.freeze({ ...this.metadataValue }),
      tasks: this.currentTaskSnapshots(),
      revisions: this.revisionsValue.map((revision) => revision.toSnapshot()),
    };
  }

  private assertTaskOwnership(task: Task): void {
    if (!task.parentMissionPlanId.equals(this.missionPlanId)) {
      throw new MissionPlanningValidationError(
        `Task '${task.id.toString()}' belongs to MissionPlan '${task.parentMissionPlanId.toString()}', not '${this.missionPlanId.toString()}'.`,
      );
    }
  }

  private assertDependenciesExist(taskIds: readonly TaskId[]): void {
    for (const taskId of taskIds) {
      if (!this.tasksById.has(taskId.toString())) {
        throw new TaskNotFoundError(taskId.toString());
      }
    }
  }

  private assertDependencyUpdateIsAcyclic(
    taskId: TaskId,
    prerequisiteTaskIds: readonly TaskId[],
  ): void {
    const targetTaskId = taskId.toString();
    const dependenciesByTaskId = new Map<string, readonly string[]>();

    for (const task of this.tasksById.values()) {
      dependenciesByTaskId.set(
        task.id.toString(),
        task.prerequisites().map((prerequisite) => prerequisite.toString()),
      );
    }

    dependenciesByTaskId.set(
      targetTaskId,
      prerequisiteTaskIds.map((prerequisite) => prerequisite.toString()),
    );

    for (const prerequisiteTaskId of prerequisiteTaskIds) {
      if (this.hasDependencyPath(prerequisiteTaskId.toString(), targetTaskId, dependenciesByTaskId)) {
        throw new MissionPlanningValidationError(
          `Task dependency would create a cycle involving Task '${targetTaskId}'.`,
        );
      }
    }
  }

  private hasDependencyPath(
    currentTaskId: string,
    targetTaskId: string,
    dependenciesByTaskId: ReadonlyMap<string, readonly string[]>,
    visitedTaskIds: ReadonlySet<string> = new Set<string>(),
  ): boolean {
    if (currentTaskId === targetTaskId) {
      return true;
    }

    if (visitedTaskIds.has(currentTaskId)) {
      return false;
    }

    const nextVisitedTaskIds = new Set(visitedTaskIds);
    nextVisitedTaskIds.add(currentTaskId);

    for (const prerequisiteTaskId of dependenciesByTaskId.get(currentTaskId) ?? []) {
      if (
        this.hasDependencyPath(
          prerequisiteTaskId,
          targetTaskId,
          dependenciesByTaskId,
          nextVisitedTaskIds,
        )
      ) {
        return true;
      }
    }

    return false;
  }

  private requireTask(taskId: TaskId): Task {
    const task = this.tasksById.get(taskId.toString());

    if (task === undefined) {
      throw new TaskNotFoundError(taskId.toString());
    }

    return task;
  }

  private recordNextRevision(metadata: RevisionMetadata): void {
    this.revisionNumberValue += 1;
    this.recordCurrentRevision(metadata);
  }

  private recordCurrentRevision(metadata: RevisionMetadata): void {
    this.revisionsValue.push(
      PlanRevision.create(
        this.revisionNumberValue,
        cloneRevisionMetadata(metadata),
        this.currentTaskSnapshots(),
      ),
    );
  }

  private currentTaskSnapshots(): readonly TaskSnapshot[] {
    return [...this.tasksById.values()].map((task) => cloneTaskSnapshot(task.toSnapshot()));
  }
}
