export const proposalLifecycleStates = ['Draft', 'Submitted', 'Under Review', 'Withdrawn'] as const;

export type ProposalLifecycleState = (typeof proposalLifecycleStates)[number];

export const plannerActorTypes = ['Human', 'Adapter'] as const;

export type PlannerActorType = (typeof plannerActorTypes)[number];

export type ProposedTaskField = 'title' | 'description';

export type PlanningDiagnosticCode =
  | 'MissingProposedTaskReference'
  | 'SelfDependency'
  | 'DuplicateDependency'
  | 'DependencyCycle'
  | 'PlanningPolicyViolation';

export interface PlanningDiagnostic {
  readonly code: PlanningDiagnosticCode;
  readonly message: string;
  readonly proposedTaskId?: string;
  readonly dependencyTargetId?: string;
  readonly dependencyPrerequisiteId?: string;
}

export interface PlannerAttributionInput {
  readonly executionRoleId: string;
  readonly actorType: PlannerActorType;
  readonly actorId: string;
  readonly adapterId?: string;
  readonly engineeringSessionId?: string;
  readonly executionSessionId?: string;
  readonly generatedAt: string;
  readonly causality?: readonly string[];
  readonly correlationId?: string;
}

export interface PlannerAttributionSnapshot extends PlannerAttributionInput {
  readonly causality: readonly string[];
}

export interface PlanningPolicyInput {
  readonly id: string;
  readonly version: string;
  readonly maxProposedTaskCount?: number;
  readonly requiredProposedTaskFields?: readonly ProposedTaskField[];
}

export interface PlanningPolicySnapshot {
  readonly id: string;
  readonly version: string;
  readonly maxProposedTaskCount?: number;
  readonly requiredProposedTaskFields: readonly ProposedTaskField[];
}

export interface ProposedTaskInput {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export interface ProposedTaskSnapshot extends ProposedTaskInput {}

export interface ProposedTaskDependencyInput {
  readonly targetProposedTaskId: string;
  readonly prerequisiteProposedTaskId: string;
}

export interface ProposedTaskDependencySnapshot extends ProposedTaskDependencyInput {}

export interface ProposedPlanRevisionInput {
  readonly id: string;
  readonly proposedMissionPlanId: string;
  readonly revisionNumber: number;
  readonly proposedTasks: readonly ProposedTaskInput[];
  readonly proposedTaskDependencies: readonly ProposedTaskDependencyInput[];
  readonly plannerAttribution: PlannerAttributionInput;
  readonly createdAt: string;
  readonly causality?: readonly string[];
  readonly correlationId?: string;
  readonly lifecycleState?: ProposalLifecycleState;
}

export interface ProposedPlanRevisionSnapshot {
  readonly id: string;
  readonly proposedMissionPlanId: string;
  readonly revisionNumber: number;
  readonly proposedTasks: readonly ProposedTaskSnapshot[];
  readonly proposedTaskDependencies: readonly ProposedTaskDependencySnapshot[];
  readonly plannerAttribution: PlannerAttributionSnapshot;
  readonly createdAt: string;
  readonly causality: readonly string[];
  readonly correlationId?: string;
  readonly lifecycleState: ProposalLifecycleState;
}

export interface ProposedMissionPlanInput {
  readonly id: string;
  readonly missionId: string;
  readonly initialRevision: ProposedPlanRevisionInput;
}

export interface ProposedMissionPlanSnapshot {
  readonly id: string;
  readonly missionId: string;
  readonly plannerAttribution: PlannerAttributionSnapshot;
  readonly lifecycleState: ProposalLifecycleState;
  readonly revisions: readonly ProposedPlanRevisionSnapshot[];
}

export interface AppendProposedPlanRevisionInput extends Omit<ProposedPlanRevisionInput, 'proposedMissionPlanId' | 'revisionNumber' | 'lifecycleState'> {}

export interface TransitionProposedPlanRevisionInput {
  readonly id: string;
  readonly plannerAttribution: PlannerAttributionInput;
  readonly createdAt: string;
  readonly causality?: readonly string[];
  readonly correlationId?: string;
}

export interface PlanningCorrelationSnapshot {
  readonly id: string;
  readonly missionId: string;
  readonly proposedMissionPlanId: string;
  readonly proposedPlanRevisionId: string;
  readonly plannerAttribution: PlannerAttributionSnapshot;
  readonly createdAt: string;
  readonly causality: readonly string[];
  readonly correlationId?: string;
  readonly reviewId?: string;
}
