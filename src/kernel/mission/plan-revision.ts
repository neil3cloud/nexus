import type { PlanRevisionSnapshot, RevisionMetadata, TaskSnapshot } from './mission-planning.types';
import { cloneMetadata } from './task';

export class PlanRevision {
  private constructor(
    private readonly revisionNumberValue: number,
    private readonly metadataValue: RevisionMetadata,
    private readonly taskSnapshots: readonly TaskSnapshot[],
  ) {
    Object.freeze(this.taskSnapshots);
    Object.freeze(this.metadataValue.attributes);
    Object.freeze(this.metadataValue);
    Object.freeze(this);
  }

  public static create(
    revisionNumber: number,
    metadata: RevisionMetadata,
    tasks: readonly TaskSnapshot[],
  ): PlanRevision {
    return new PlanRevision(
      revisionNumber,
      cloneRevisionMetadata(metadata),
      tasks.map((task) => cloneTaskSnapshot(task)),
    );
  }

  public static fromSnapshot(snapshot: PlanRevisionSnapshot): PlanRevision {
    return PlanRevision.create(snapshot.revisionNumber, snapshot.metadata, snapshot.tasks);
  }

  public get revisionNumber(): number {
    return this.revisionNumberValue;
  }

  public get metadata(): RevisionMetadata {
    return cloneRevisionMetadata(this.metadataValue);
  }

  public get tasks(): readonly TaskSnapshot[] {
    return this.taskSnapshots.map((task) => cloneTaskSnapshot(task));
  }

  public toSnapshot(): PlanRevisionSnapshot {
    return {
      revisionNumber: this.revisionNumberValue,
      metadata: cloneRevisionMetadata(this.metadataValue),
      tasks: this.tasks,
    };
  }
}

export function cloneRevisionMetadata(metadata: RevisionMetadata): RevisionMetadata {
  return Object.freeze({
    createdAt: metadata.createdAt,
    ...(metadata.reason === undefined ? {} : { reason: metadata.reason }),
    attributes: cloneMetadata(metadata.attributes),
  });
}

export function cloneTaskSnapshot(snapshot: TaskSnapshot): TaskSnapshot {
  return Object.freeze({
    id: snapshot.id,
    title: snapshot.title,
    description: snapshot.description,
    status: snapshot.status,
    parentMissionPlanId: snapshot.parentMissionPlanId,
    dependencies: Object.freeze([...snapshot.dependencies]),
    metadata: cloneMetadata(snapshot.metadata),
  });
}

