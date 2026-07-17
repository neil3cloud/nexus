import { MissionId } from '../mission/mission-id';
import { PlannerAttribution } from './planner-attribution';
import type {
  AppendProposedPlanRevisionInput,
  ProposalLifecycleState,
  ProposedMissionPlanInput,
  ProposedMissionPlanSnapshot,
  TransitionProposedPlanRevisionInput,
} from './planning.types';
import {
  InvalidPlanningDefinitionError,
  InvalidProposalLifecycleTransitionError,
  StructuralPlanValidationError,
} from './planning.errors';
import { PlanningPolicy } from './planning-policy';
import { ProposedMissionPlanId } from './proposed-mission-plan-id';
import { ProposedPlanRevision } from './proposed-plan-revision';

export class ProposedMissionPlan {
  private constructor(
    private readonly proposedMissionPlanId: ProposedMissionPlanId,
    private readonly missionIdValue: MissionId,
    private readonly revisionsValue: readonly ProposedPlanRevision[],
  ) {
    if (revisionsValue.length < 1) {
      throw new InvalidPlanningDefinitionError(
        'ProposedMissionPlan requires at least one ProposedPlanRevision.',
      );
    }

    Object.freeze(this);
  }

  public static create(input: ProposedMissionPlanInput): ProposedMissionPlan {
    const proposedMissionPlanId = ProposedMissionPlanId.fromString(input.id);
    const initialRevision = ProposedPlanRevision.create({
      ...input.initialRevision,
      proposedMissionPlanId: proposedMissionPlanId.toString(),
      revisionNumber: 1,
      lifecycleState: 'Draft',
    });

    return new ProposedMissionPlan(
      proposedMissionPlanId,
      MissionId.fromString(input.missionId),
      Object.freeze([initialRevision]),
    );
  }

  public static fromSnapshot(snapshot: ProposedMissionPlanSnapshot): ProposedMissionPlan {
    return new ProposedMissionPlan(
      ProposedMissionPlanId.fromString(snapshot.id),
      MissionId.fromString(snapshot.missionId),
      Object.freeze(
        snapshot.revisions
          .map((revision) => ProposedPlanRevision.fromSnapshot(revision))
          .sort((left, right) => left.revisionNumber - right.revisionNumber),
      ),
    );
  }

  public get id(): ProposedMissionPlanId {
    return this.proposedMissionPlanId;
  }

  public get lifecycleState(): ProposalLifecycleState {
    return this.currentRevision.lifecycleState;
  }

  public get currentRevision(): ProposedPlanRevision {
    const revision = this.revisionsValue.at(-1);

    if (revision === undefined) {
      throw new InvalidPlanningDefinitionError(
        `ProposedMissionPlan '${this.proposedMissionPlanId.toString()}' has no ProposedPlanRevision.`,
      );
    }

    return revision;
  }

  public appendRevision(input: AppendProposedPlanRevisionInput): ProposedMissionPlan {
    this.assertCurrentStateAllowsNewRevision();

    const nextRevision = ProposedPlanRevision.create({
      ...input,
      proposedMissionPlanId: this.proposedMissionPlanId.toString(),
      revisionNumber: this.currentRevision.revisionNumber + 1,
      lifecycleState: 'Draft',
    });

    return new ProposedMissionPlan(
      this.proposedMissionPlanId,
      this.missionIdValue,
      Object.freeze([...this.revisionsValue, nextRevision]),
    );
  }

  public submitCurrentRevision(
    input: TransitionProposedPlanRevisionInput,
    planningPolicy: PlanningPolicy,
  ): ProposedMissionPlan {
    const currentRevision = this.currentRevision;
    const diagnostics = [
      ...planningPolicy.validateRevision(currentRevision),
      ...currentRevision.validateStructure(),
    ];

    if (diagnostics.length > 0) {
      throw new StructuralPlanValidationError(
        diagnostics.map((diagnostic) => diagnostic.message).join(' '),
      );
    }

    return this.appendLifecycleRevision(input, 'Submitted');
  }

  public withdrawCurrentRevision(input: TransitionProposedPlanRevisionInput): ProposedMissionPlan {
    return this.appendLifecycleRevision(input, 'Withdrawn');
  }

  public toSnapshot(): ProposedMissionPlanSnapshot {
    const originatingRevision = this.revisionsValue[0];

    if (originatingRevision === undefined) {
      throw new InvalidPlanningDefinitionError(
        `ProposedMissionPlan '${this.proposedMissionPlanId.toString()}' has no originating ProposedPlanRevision.`,
      );
    }

    return Object.freeze({
      id: this.proposedMissionPlanId.toString(),
      missionId: this.missionIdValue.toString(),
      plannerAttribution: PlannerAttribution.fromSnapshot(
        originatingRevision.toSnapshot().plannerAttribution,
      ).toSnapshot(),
      lifecycleState: this.lifecycleState,
      revisions: Object.freeze(this.revisionsValue.map((revision) => revision.toSnapshot())),
    });
  }

  private appendLifecycleRevision(
    input: TransitionProposedPlanRevisionInput,
    lifecycleState: ProposalLifecycleState,
  ): ProposedMissionPlan {
    const currentRevision = this.currentRevision;
    const transitionInput = {
      id: input.id,
      proposedMissionPlanId: this.proposedMissionPlanId.toString(),
      revisionNumber: currentRevision.revisionNumber + 1,
      proposedTasks: currentRevision.toSnapshot().proposedTasks,
      proposedTaskDependencies: currentRevision.toSnapshot().proposedTaskDependencies,
      plannerAttribution: input.plannerAttribution,
      createdAt: input.createdAt,
      lifecycleState: currentRevision.transitionTo(lifecycleState).lifecycleState,
      ...(input.causality === undefined ? {} : { causality: input.causality }),
      ...(input.correlationId === undefined ? {} : { correlationId: input.correlationId }),
    };
    const transitionedRevision = ProposedPlanRevision.create(transitionInput);

    return new ProposedMissionPlan(
      this.proposedMissionPlanId,
      this.missionIdValue,
      Object.freeze([...this.revisionsValue, transitionedRevision]),
    );
  }

  private assertCurrentStateAllowsNewRevision(): void {
    if (this.lifecycleState === 'Withdrawn') {
      throw new InvalidProposalLifecycleTransitionError(
        `ProposedMissionPlan '${this.proposedMissionPlanId.toString()}' cannot create a new ProposedPlanRevision after Withdrawn.`,
      );
    }
  }
}
