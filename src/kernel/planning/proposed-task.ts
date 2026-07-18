import type { ProposedTaskInput, ProposedTaskSnapshot } from './planning.types';
import { normalizeNonEmptyString } from './proposed-mission-plan-id';
import { ProposedTaskId } from './proposed-task-id';

export class ProposedTask {
  private constructor(
    private readonly proposedTaskId: ProposedTaskId,
    private readonly titleValue: string,
    private readonly descriptionValue: string,
  ) {
    Object.freeze(this);
  }

  public static create(input: ProposedTaskInput): ProposedTask {
    return new ProposedTask(
      ProposedTaskId.fromString(input.id),
      normalizeNonEmptyString(input.title, 'ProposedTask title'),
      normalizeNonEmptyString(input.description, 'ProposedTask description'),
    );
  }

  public static fromSnapshot(snapshot: ProposedTaskSnapshot): ProposedTask {
    return ProposedTask.create(snapshot);
  }

  public get id(): ProposedTaskId {
    return this.proposedTaskId;
  }

  public toSnapshot(): ProposedTaskSnapshot {
    return Object.freeze({
      id: this.proposedTaskId.toString(),
      title: this.titleValue,
      description: this.descriptionValue,
    });
  }
}
