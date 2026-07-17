import { PlannerAttribution } from './planner-attribution';
import type {
  PlanningDiagnostic,
  ProposalLifecycleState,
  ProposedPlanRevisionInput,
  ProposedPlanRevisionSnapshot,
} from './planning.types';
import {
  InvalidPlanningDefinitionError,
  InvalidProposalLifecycleTransitionError,
  StructuralPlanValidationError,
} from './planning.errors';
import { ProposedMissionPlanId, normalizeNonEmptyString } from './proposed-mission-plan-id';
import { ProposedPlanRevisionId } from './proposed-plan-revision-id';
import { ProposedTask } from './proposed-task';
import { ProposedTaskDependency } from './proposed-task-dependency';

export class ProposedPlanRevision {
  private constructor(private readonly snapshotValue: ProposedPlanRevisionSnapshot) {
    Object.freeze(this);
  }

  public static create(input: ProposedPlanRevisionInput): ProposedPlanRevision {
    if (input.revisionNumber < 1 || !Number.isInteger(input.revisionNumber)) {
      throw new InvalidPlanningDefinitionError(
        'ProposedPlanRevision revisionNumber must be a positive integer.',
      );
    }

    const proposedTasks = input.proposedTasks.map((proposedTask) =>
      ProposedTask.create(proposedTask).toSnapshot(),
    );
    const proposedTaskDependencies = input.proposedTaskDependencies.map((dependency) =>
      ProposedTaskDependency.create(dependency).toSnapshot(),
    );

    return new ProposedPlanRevision(
      Object.freeze({
        id: ProposedPlanRevisionId.fromString(input.id).toString(),
        proposedMissionPlanId: ProposedMissionPlanId.fromString(
          input.proposedMissionPlanId,
        ).toString(),
        revisionNumber: input.revisionNumber,
        proposedTasks: Object.freeze(proposedTasks),
        proposedTaskDependencies: Object.freeze(proposedTaskDependencies),
        plannerAttribution: PlannerAttribution.create(input.plannerAttribution).toSnapshot(),
        createdAt: normalizeNonEmptyString(input.createdAt, 'ProposedPlanRevision createdAt'),
        causality: Object.freeze(
          (input.causality ?? []).map((value) =>
            normalizeNonEmptyString(value, 'ProposedPlanRevision causality'),
          ),
        ),
        ...(input.correlationId === undefined
          ? {}
          : {
              correlationId: normalizeNonEmptyString(
                input.correlationId,
                'ProposedPlanRevision correlationId',
              ),
            }),
        lifecycleState: input.lifecycleState ?? 'Draft',
      }),
    );
  }

  public static fromSnapshot(snapshot: ProposedPlanRevisionSnapshot): ProposedPlanRevision {
    return ProposedPlanRevision.create(snapshot);
  }

  public get id(): ProposedPlanRevisionId {
    return ProposedPlanRevisionId.fromString(this.snapshotValue.id);
  }

  public get revisionNumber(): number {
    return this.snapshotValue.revisionNumber;
  }

  public get lifecycleState(): ProposalLifecycleState {
    return this.snapshotValue.lifecycleState;
  }

  public transitionTo(lifecycleState: ProposalLifecycleState): ProposedPlanRevision {
    if (!isAllowedTransition(this.snapshotValue.lifecycleState, lifecycleState)) {
      throw new InvalidProposalLifecycleTransitionError(
        `ProposedPlanRevision '${this.snapshotValue.id}' cannot transition from '${this.snapshotValue.lifecycleState}' to '${lifecycleState}'.`,
      );
    }

    return ProposedPlanRevision.fromSnapshot({
      ...this.snapshotValue,
      lifecycleState,
    });
  }

  public validateStructure(): readonly PlanningDiagnostic[] {
    const diagnostics: PlanningDiagnostic[] = [];
    const proposedTaskIds = new Set(this.snapshotValue.proposedTasks.map((task) => task.id));
    const dependencyPairs = new Set<string>();
    const dependenciesByTaskId = new Map<string, string[]>();

    for (const proposedTask of this.snapshotValue.proposedTasks) {
      dependenciesByTaskId.set(proposedTask.id, []);
    }

    for (const dependency of this.snapshotValue.proposedTaskDependencies) {
      const targetId = dependency.targetProposedTaskId;
      const prerequisiteId = dependency.prerequisiteProposedTaskId;

      if (!proposedTaskIds.has(targetId)) {
        diagnostics.push(createDependencyDiagnostic('MissingProposedTaskReference', targetId, prerequisiteId));
      }

      if (!proposedTaskIds.has(prerequisiteId)) {
        diagnostics.push(createDependencyDiagnostic('MissingProposedTaskReference', targetId, prerequisiteId));
      }

      if (targetId === prerequisiteId) {
        diagnostics.push(createDependencyDiagnostic('SelfDependency', targetId, prerequisiteId));
      }

      const dependencyPair = `${targetId}\u0000${prerequisiteId}`;

      if (dependencyPairs.has(dependencyPair)) {
        diagnostics.push(createDependencyDiagnostic('DuplicateDependency', targetId, prerequisiteId));
      }

      dependencyPairs.add(dependencyPair);
      dependenciesByTaskId.get(targetId)?.push(prerequisiteId);
    }

    for (const proposedTaskId of proposedTaskIds) {
      if (hasDependencyCycle(proposedTaskId, proposedTaskId, dependenciesByTaskId, new Set())) {
        diagnostics.push(
          Object.freeze({
            code: 'DependencyCycle',
            message: `ProposedTask dependency graph contains a cycle involving ProposedTask '${proposedTaskId}'.`,
            proposedTaskId,
          }),
        );
        break;
      }
    }

    return Object.freeze(diagnostics);
  }

  public assertStructurallyValid(): void {
    const diagnostics = this.validateStructure();

    if (diagnostics.length > 0) {
      throw new StructuralPlanValidationError(formatDiagnostics(diagnostics));
    }
  }

  public toSnapshot(): ProposedPlanRevisionSnapshot {
    return Object.freeze({
      ...this.snapshotValue,
      proposedTasks: Object.freeze(this.snapshotValue.proposedTasks.map((task) => Object.freeze({ ...task }))),
      proposedTaskDependencies: Object.freeze(
        this.snapshotValue.proposedTaskDependencies.map((dependency) =>
          Object.freeze({ ...dependency }),
        ),
      ),
      plannerAttribution: PlannerAttribution.fromSnapshot(
        this.snapshotValue.plannerAttribution,
      ).toSnapshot(),
      causality: Object.freeze([...this.snapshotValue.causality]),
    });
  }
}

function isAllowedTransition(
  from: ProposalLifecycleState,
  to: ProposalLifecycleState,
): boolean {
  return (
    (from === 'Draft' && to === 'Submitted') ||
    (from === 'Draft' && to === 'Withdrawn') ||
    (from === 'Submitted' && to === 'Withdrawn')
  );
}

function createDependencyDiagnostic(
  code: 'MissingProposedTaskReference' | 'SelfDependency' | 'DuplicateDependency',
  targetId: string,
  prerequisiteId: string,
): PlanningDiagnostic {
  const messages = {
    MissingProposedTaskReference: `ProposedTaskDependency '${targetId}' -> '${prerequisiteId}' references a missing ProposedTask.`,
    SelfDependency: `ProposedTask '${targetId}' cannot depend on itself.`,
    DuplicateDependency: `Duplicate ProposedTaskDependency '${targetId}' -> '${prerequisiteId}'.`,
  };

  return Object.freeze({
    code,
    message: messages[code],
    dependencyTargetId: targetId,
    dependencyPrerequisiteId: prerequisiteId,
  });
}

function hasDependencyCycle(
  currentTaskId: string,
  targetTaskId: string,
  dependenciesByTaskId: ReadonlyMap<string, readonly string[]>,
  visitedTaskIds: ReadonlySet<string>,
): boolean {
  if (visitedTaskIds.has(currentTaskId)) {
    return false;
  }

  const nextVisitedTaskIds = new Set(visitedTaskIds);
  nextVisitedTaskIds.add(currentTaskId);

  for (const prerequisiteTaskId of dependenciesByTaskId.get(currentTaskId) ?? []) {
    if (prerequisiteTaskId === targetTaskId) {
      return true;
    }

    if (
      hasDependencyCycle(
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

function formatDiagnostics(diagnostics: readonly PlanningDiagnostic[]): string {
  return diagnostics.map((diagnostic) => diagnostic.message).join(' ');
}
