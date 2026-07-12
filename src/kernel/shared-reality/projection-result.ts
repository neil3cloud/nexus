import { ProjectionVersion } from './projection-version';
import { SharedReality } from './shared-reality.aggregate';
import { freezeSharedRealitySnapshot } from './shared-reality.aggregate';
import type { ProjectionMetadata, SharedRealitySnapshot } from './shared-reality.types';

export interface ProjectionResultSnapshot extends SharedRealitySnapshot {
  readonly projectionVersion: string;
  readonly projectionMetadata: ProjectionMetadata;
}

export class ProjectionResult {
  private constructor(
    private readonly version: ProjectionVersion,
    private readonly sharedReality: SharedReality,
    private readonly metadata: ProjectionMetadata,
  ) {
    Object.freeze(this);
  }

  public static create(input: {
    readonly projectionVersion: ProjectionVersion;
    readonly sharedReality: SharedReality;
    readonly projectionMetadata: ProjectionMetadata;
  }): ProjectionResult {
    return new ProjectionResult(
      input.projectionVersion,
      input.sharedReality,
      Object.freeze({ ...input.projectionMetadata }),
    );
  }

  public get projectionVersion(): ProjectionVersion {
    return this.version;
  }

  public get activeMission(): SharedRealitySnapshot['activeMission'] {
    return this.sharedReality.activeMission;
  }

  public get missionPlan(): SharedRealitySnapshot['missionPlan'] {
    return this.sharedReality.missionPlan;
  }

  public get missionExecutionState(): SharedRealitySnapshot['missionExecutionState'] {
    return this.sharedReality.missionExecutionState;
  }

  public get evidenceReferences(): SharedRealitySnapshot['evidenceReferences'] {
    return this.sharedReality.evidenceReferences;
  }

  public get context(): SharedRealitySnapshot['context'] {
    return this.sharedReality.context;
  }

  public get projectionMetadata(): ProjectionMetadata {
    return this.metadata;
  }

  public toSnapshot(): ProjectionResultSnapshot {
    return Object.freeze({
      ...freezeSharedRealitySnapshot(this.sharedReality.toSnapshot()),
      projectionVersion: this.version.toString(),
      projectionMetadata: Object.freeze({ ...this.metadata }),
    });
  }
}
