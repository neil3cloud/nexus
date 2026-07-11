import { MissionPlanningValidationError } from './mission.errors';
import type { TaskId } from './task-id';

export class TaskDependency {
  private constructor(
    public readonly taskId: TaskId,
    public readonly prerequisiteTaskId: TaskId,
  ) {
    Object.freeze(this);
  }

  public static fromTaskIds(taskId: TaskId, prerequisiteTaskId: TaskId): TaskDependency {
    if (taskId.equals(prerequisiteTaskId)) {
      throw new MissionPlanningValidationError('Task cannot depend on itself.');
    }

    return new TaskDependency(taskId, prerequisiteTaskId);
  }

  public toString(): string {
    return this.prerequisiteTaskId.toString();
  }
}

