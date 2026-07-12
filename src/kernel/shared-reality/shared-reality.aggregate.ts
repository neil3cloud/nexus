import type { SharedRealitySnapshot } from './shared-reality.types';

export class SharedReality {
  private constructor(private readonly snapshot: SharedRealitySnapshot) {
    Object.freeze(this);
  }

  public static fromSnapshot(snapshot: SharedRealitySnapshot): SharedReality {
    return new SharedReality(freezeSharedRealitySnapshot(snapshot));
  }

  public get activeMission(): SharedRealitySnapshot['activeMission'] {
    return this.snapshot.activeMission;
  }

  public get missionPlan(): SharedRealitySnapshot['missionPlan'] {
    return this.snapshot.missionPlan;
  }

  public get missionExecutionState(): SharedRealitySnapshot['missionExecutionState'] {
    return this.snapshot.missionExecutionState;
  }

  public get evidenceReferences(): SharedRealitySnapshot['evidenceReferences'] {
    return this.snapshot.evidenceReferences;
  }

  public get context(): SharedRealitySnapshot['context'] {
    return this.snapshot.context;
  }

  public toSnapshot(): SharedRealitySnapshot {
    return this.snapshot;
  }
}

export function freezeSharedRealitySnapshot(snapshot: SharedRealitySnapshot): SharedRealitySnapshot {
  const evidenceReferences = Object.freeze(
    snapshot.evidenceReferences.map((reference) => Object.freeze({ ...reference })),
  );
  const activeMission = Object.freeze({ ...snapshot.activeMission });
  const tasks = Object.freeze(
    snapshot.missionPlan.tasks.map((task) =>
      Object.freeze({
        ...task,
        dependencies: Object.freeze([...task.dependencies]),
        metadata: Object.freeze({ ...task.metadata }),
      }),
    ),
  );
  const revisions = Object.freeze(
    snapshot.missionPlan.revisions.map((revision) =>
      Object.freeze({
        ...revision,
        metadata: Object.freeze({
          ...revision.metadata,
          attributes: Object.freeze({ ...revision.metadata.attributes }),
        }),
        tasks: Object.freeze(
          revision.tasks.map((task) =>
            Object.freeze({
              ...task,
              dependencies: Object.freeze([...task.dependencies]),
              metadata: Object.freeze({ ...task.metadata }),
            }),
          ),
        ),
      }),
    ),
  );
  const missionPlan = Object.freeze({
    ...snapshot.missionPlan,
    metadata: Object.freeze({ ...snapshot.missionPlan.metadata }),
    tasks,
    revisions,
  });
  const missionExecutionState = Object.freeze({
    ...snapshot.missionExecutionState,
    tasks: Object.freeze(
      snapshot.missionExecutionState.tasks.map((task) => Object.freeze({ ...task })),
    ),
  });
  const context = freezeContext(snapshot.context);

  return Object.freeze({
    activeMission,
    missionPlan,
    missionExecutionState,
    evidenceReferences,
    context,
  });
}

function freezeContext(context: SharedRealitySnapshot['context']): SharedRealitySnapshot['context'] {
  return Object.freeze({
    evidenceByType: freezeReferenceGroups(context.evidenceByType),
    evidenceBySource: freezeReferenceGroups(context.evidenceBySource),
  });
}

function freezeReferenceGroups(
  groups: Readonly<Record<string, readonly SharedRealitySnapshot['evidenceReferences'][number][]>>,
): Readonly<Record<string, readonly SharedRealitySnapshot['evidenceReferences'][number][]>> {
  const frozenEntries = Object.entries(groups).map(([key, references]) => [
    key,
    Object.freeze(references.map((reference) => Object.freeze({ ...reference }))),
  ]);

  return Object.freeze(Object.fromEntries(frozenEntries));
}
