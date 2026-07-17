import type {
  ProposedTaskDependencyInput,
  ProposedTaskDependencySnapshot,
} from './planning.types';
import { ProposedTaskId } from './proposed-task-id';

export class ProposedTaskDependency {
  private constructor(
    private readonly targetProposedTaskIdValue: ProposedTaskId,
    private readonly prerequisiteProposedTaskIdValue: ProposedTaskId,
  ) {
    Object.freeze(this);
  }

  public static create(input: ProposedTaskDependencyInput): ProposedTaskDependency {
    return new ProposedTaskDependency(
      ProposedTaskId.fromString(input.targetProposedTaskId),
      ProposedTaskId.fromString(input.prerequisiteProposedTaskId),
    );
  }

  public static fromSnapshot(snapshot: ProposedTaskDependencySnapshot): ProposedTaskDependency {
    return ProposedTaskDependency.create(snapshot);
  }

  public get targetProposedTaskId(): ProposedTaskId {
    return this.targetProposedTaskIdValue;
  }

  public get prerequisiteProposedTaskId(): ProposedTaskId {
    return this.prerequisiteProposedTaskIdValue;
  }

  public toSnapshot(): ProposedTaskDependencySnapshot {
    return Object.freeze({
      targetProposedTaskId: this.targetProposedTaskIdValue.toString(),
      prerequisiteProposedTaskId: this.prerequisiteProposedTaskIdValue.toString(),
    });
  }
}
