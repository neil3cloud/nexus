import { InvalidPlanningDefinitionError } from './planning.errors';
import type {
  PlanningDiagnostic,
  PlanningPolicyInput,
  PlanningPolicySnapshot,
  ProposedTaskField,
} from './planning.types';
import { normalizeNonEmptyString } from './proposed-mission-plan-id';
import type { ProposedPlanRevision } from './proposed-plan-revision';

const allowedRequiredFields = new Set<ProposedTaskField>(['title', 'description']);

export class PlanningPolicy {
  private constructor(private readonly snapshotValue: PlanningPolicySnapshot) {
    Object.freeze(this);
  }

  public static create(input: PlanningPolicyInput): PlanningPolicy {
    const requiredFields = input.requiredProposedTaskFields ?? ['title', 'description'];

    if (input.maxProposedTaskCount !== undefined && input.maxProposedTaskCount < 1) {
      throw new InvalidPlanningDefinitionError(
        'PlanningPolicy maxProposedTaskCount must be at least 1 when provided.',
      );
    }

    for (const field of requiredFields) {
      if (!allowedRequiredFields.has(field)) {
        throw new InvalidPlanningDefinitionError(
          `PlanningPolicy unsupported required Proposed Task field '${field}'.`,
        );
      }
    }

    return new PlanningPolicy(
      Object.freeze({
        id: normalizeNonEmptyString(input.id, 'PlanningPolicy id'),
        version: normalizeNonEmptyString(input.version, 'PlanningPolicy version'),
        ...(input.maxProposedTaskCount === undefined
          ? {}
          : { maxProposedTaskCount: input.maxProposedTaskCount }),
        requiredProposedTaskFields: Object.freeze([...requiredFields]),
      }),
    );
  }

  public static fromSnapshot(snapshot: PlanningPolicySnapshot): PlanningPolicy {
    return PlanningPolicy.create(snapshot);
  }

  public validateRevision(revision: ProposedPlanRevision): readonly PlanningDiagnostic[] {
    const diagnostics: PlanningDiagnostic[] = [];
    const snapshot = revision.toSnapshot();

    if (
      this.snapshotValue.maxProposedTaskCount !== undefined &&
      snapshot.proposedTasks.length > this.snapshotValue.maxProposedTaskCount
    ) {
      diagnostics.push(
        Object.freeze({
          code: 'PlanningPolicyViolation',
          message: `ProposedPlanRevision '${snapshot.id}' has ${snapshot.proposedTasks.length} Proposed Tasks, exceeding PlanningPolicy maximum ${this.snapshotValue.maxProposedTaskCount}.`,
        }),
      );
    }

    for (const proposedTask of snapshot.proposedTasks) {
      if (
        this.snapshotValue.requiredProposedTaskFields.includes('title') &&
        proposedTask.title.trim().length === 0
      ) {
        diagnostics.push(
          Object.freeze({
            code: 'PlanningPolicyViolation',
            message: `ProposedTask '${proposedTask.id}' requires a title.`,
            proposedTaskId: proposedTask.id,
          }),
        );
      }

      if (
        this.snapshotValue.requiredProposedTaskFields.includes('description') &&
        proposedTask.description.trim().length === 0
      ) {
        diagnostics.push(
          Object.freeze({
            code: 'PlanningPolicyViolation',
            message: `ProposedTask '${proposedTask.id}' requires a description.`,
            proposedTaskId: proposedTask.id,
          }),
        );
      }
    }

    return Object.freeze(diagnostics);
  }

  public toSnapshot(): PlanningPolicySnapshot {
    return Object.freeze({
      ...this.snapshotValue,
      requiredProposedTaskFields: Object.freeze([...this.snapshotValue.requiredProposedTaskFields]),
    });
  }
}
