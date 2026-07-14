import { EngineeringSessionId } from './engineering-session-id';
import { EngineeringSessionStatus } from './engineering-session-status';
import { AdvancementTrigger } from './advancement-trigger';
import { ReviewOutcome } from '../review/review-values';
import type {
  EngineeringSessionDiagnosticInput,
  EngineeringSessionDiagnosticSnapshot,
  EngineeringSessionInput,
  EngineeringSessionMetadata,
  EngineeringSessionSnapshot,
  EngineeringSessionStatusTransitionInput,
  EngineeringSessionStatusTransitionSnapshot,
  EngineeringSessionTimelineInput,
  EngineeringSessionTimelineSnapshot,
} from './engineering-session.types';
import {
  InvalidEngineeringSessionDefinitionError,
  InvalidEngineeringSessionLifecycleTransitionError,
} from './engineering-session.errors';
import { RoleId } from './role-id';
import { WorkflowChain } from './workflow-chain';
import { WorkflowChainId } from './workflow-chain-id';

export class EngineeringSession {
  private constructor(
    private readonly engineeringSessionId: EngineeringSessionId,
    private statusValue: EngineeringSessionStatus,
    private readonly engineeringRuntimeContextReferenceValue: string,
    private readonly activeEngineeringWorkflowReferenceValue: string,
    private readonly workflowChainIdValue: WorkflowChainId,
    private currentWorkflowStepIdValue: string,
    private readonly participatingRoleIdValues: readonly RoleId[],
    private readonly workflowStateValue: string,
    private timelineValue: EngineeringSessionTimelineSnapshot,
    private readonly diagnosticValues: readonly EngineeringSessionDiagnosticSnapshot[],
    private readonly collaborationMetadataValue: EngineeringSessionMetadata,
  ) {}

  public static create(
    input: EngineeringSessionInput,
    workflowChain: WorkflowChain | undefined,
  ): EngineeringSession {
    const statusTransitions = normalizeStatusTransitions(
      input.timeline.statusTransitions ?? [
        {
          status: 'Open',
          occurredAt: input.timeline.createdAt,
        },
      ],
    );
    const currentStatus = statusTransitions[statusTransitions.length - 1]?.status;

    if (currentStatus === undefined) {
      throw new InvalidEngineeringSessionDefinitionError(
        'EngineeringSession timeline requires at least one status transition.',
      );
    }

    const status = EngineeringSessionStatus.fromString(currentStatus);
    const timeline = normalizeTimeline(input.timeline, statusTransitions, status);
    const workflowBinding = normalizeWorkflowBinding(input, workflowChain);

    return new EngineeringSession(
      EngineeringSessionId.fromString(input.id),
      status,
      normalizeNonEmptyString(
        input.engineeringRuntimeContextReference,
        'EngineeringSession engineeringRuntimeContextReference',
      ),
      normalizeNonEmptyString(
        input.activeEngineeringWorkflowReference,
        'EngineeringSession activeEngineeringWorkflowReference',
      ),
      workflowBinding.workflowChainId,
      workflowBinding.currentWorkflowStepId,
      normalizeParticipatingRoleIds(input.participatingRoleIds),
      normalizeNonEmptyString(input.workflowState, 'EngineeringSession workflowState'),
      timeline,
      normalizeDiagnostics(input.diagnostics ?? []),
      copyMetadata(input.collaborationMetadata ?? {}, 'EngineeringSession collaborationMetadata'),
    );
  }

  public static fromSnapshot(snapshot: EngineeringSessionSnapshot): EngineeringSession {
    const statusTransitions = normalizeStatusTransitions(snapshot.timeline.statusTransitions);
    const currentStatus = statusTransitions[statusTransitions.length - 1]?.status;

    if (currentStatus === undefined) {
      throw new InvalidEngineeringSessionDefinitionError(
        'EngineeringSession timeline requires at least one status transition.',
      );
    }

    const status = EngineeringSessionStatus.fromString(currentStatus);
    const timeline = normalizeTimeline(snapshot.timeline, statusTransitions, status);
    const engineeringSession = new EngineeringSession(
      EngineeringSessionId.fromString(snapshot.id),
      status,
      normalizeNonEmptyString(
        snapshot.engineeringRuntimeContextReference,
        'EngineeringSession engineeringRuntimeContextReference',
      ),
      normalizeNonEmptyString(
        snapshot.activeEngineeringWorkflowReference,
        'EngineeringSession activeEngineeringWorkflowReference',
      ),
      WorkflowChainId.fromString(
        normalizeNonEmptyString(snapshot.workflowChainId, 'EngineeringSession workflowChainId'),
      ),
      normalizeNonEmptyString(
        snapshot.currentWorkflowStepId,
        'EngineeringSession currentWorkflowStepId',
      ),
      normalizeParticipatingRoleIds(snapshot.participatingRoleIds),
      normalizeNonEmptyString(snapshot.workflowState, 'EngineeringSession workflowState'),
      timeline,
      normalizeDiagnostics(snapshot.diagnostics),
      copyMetadata(snapshot.collaborationMetadata, 'EngineeringSession collaborationMetadata'),
    );

    if (snapshot.status !== engineeringSession.status.toString()) {
      throw new InvalidEngineeringSessionDefinitionError(
        `EngineeringSession snapshot status '${snapshot.status}' does not match its timeline status '${engineeringSession.status.toString()}'.`,
      );
    }

    return engineeringSession;
  }

  public get id(): EngineeringSessionId {
    return this.engineeringSessionId;
  }

  public get status(): EngineeringSessionStatus {
    return this.statusValue;
  }

  public get engineeringRuntimeContextReference(): string {
    return this.engineeringRuntimeContextReferenceValue;
  }

  public get activeEngineeringWorkflowReference(): string {
    return this.activeEngineeringWorkflowReferenceValue;
  }

  public get workflowChainId(): WorkflowChainId {
    return this.workflowChainIdValue;
  }

  public get currentWorkflowStepId(): string {
    return this.currentWorkflowStepIdValue;
  }

  public get participatingRoleIds(): readonly RoleId[] {
    return this.participatingRoleIdValues;
  }

  public get workflowState(): string {
    return this.workflowStateValue;
  }

  public get timeline(): EngineeringSessionTimelineSnapshot {
    return this.timelineValue;
  }

  public get diagnostics(): readonly EngineeringSessionDiagnosticSnapshot[] {
    return this.diagnosticValues;
  }

  public get collaborationMetadata(): EngineeringSessionMetadata {
    return this.collaborationMetadataValue;
  }

  public close(occurredAt: string): void {
    if (this.statusValue.state !== 'Open') {
      throw new InvalidEngineeringSessionLifecycleTransitionError(
        this.statusValue.toString(),
        'Closed',
      );
    }

    const normalizedOccurredAt = normalizeNonEmptyString(
      occurredAt,
      'EngineeringSession status transition occurredAt',
    );
    const statusTransition = Object.freeze({
      status: 'Closed' as const,
      occurredAt: normalizedOccurredAt,
    });

    this.statusValue = EngineeringSessionStatus.closed();
    this.timelineValue = Object.freeze({
      createdAt: this.timelineValue.createdAt,
      statusTransitions: Object.freeze([...this.timelineValue.statusTransitions, statusTransition]),
      closedAt: normalizedOccurredAt,
    });
  }

  public advanceWorkflow(workflowChain: WorkflowChain | undefined): void {
    const workflowPosition = validateWorkflowPosition(
      this.workflowChainIdValue,
      this.currentWorkflowStepIdValue,
      workflowChain,
    );

    if (workflowPosition.position === workflowPosition.terminalPosition) {
      throw new InvalidEngineeringSessionDefinitionError(
        `EngineeringSession currentWorkflowStepId '${this.currentWorkflowStepIdValue}' is already at the terminal WorkflowStep for WorkflowChain '${this.workflowChainIdValue.toString()}'.`,
      );
    }

    this.currentWorkflowStepIdValue = (workflowPosition.position + 1).toString();
  }

  public advanceWorkflowOnTrigger(
    _trigger: AdvancementTrigger,
    workflowChain: WorkflowChain | undefined,
  ): void {
    this.advanceWorkflow(workflowChain);
  }

  public advanceWorkflowAfterReview(
    reviewOutcome: ReviewOutcome,
    workflowChain: WorkflowChain | undefined,
  ): void {
    assertNonBlockingReviewOutcome(reviewOutcome);
    this.advanceWorkflow(workflowChain);
  }

  public isWorkflowComplete(workflowChain: WorkflowChain | undefined): boolean {
    const workflowPosition = validateWorkflowPosition(
      this.workflowChainIdValue,
      this.currentWorkflowStepIdValue,
      workflowChain,
    );

    return workflowPosition.position === workflowPosition.terminalPosition;
  }

  public equals(other: EngineeringSession): boolean {
    return snapshotsEqual(this.toSnapshot(), other.toSnapshot());
  }

  public toSnapshot(): EngineeringSessionSnapshot {
    return Object.freeze({
      id: this.engineeringSessionId.toString(),
      status: this.statusValue.toString(),
      engineeringRuntimeContextReference: this.engineeringRuntimeContextReferenceValue,
      activeEngineeringWorkflowReference: this.activeEngineeringWorkflowReferenceValue,
      workflowChainId: this.workflowChainIdValue.toString(),
      currentWorkflowStepId: this.currentWorkflowStepIdValue,
      participatingRoleIds: Object.freeze(
        this.participatingRoleIdValues.map((roleId) => roleId.toString()),
      ),
      workflowState: this.workflowStateValue,
      timeline: copyTimeline(this.timelineValue),
      diagnostics: Object.freeze(
        this.diagnosticValues.map((diagnostic) => Object.freeze({ ...diagnostic })),
      ),
      collaborationMetadata: this.collaborationMetadataValue,
    });
  }
}

function normalizeWorkflowBinding(
  input: EngineeringSessionInput,
  workflowChain: WorkflowChain | undefined,
): {
  readonly workflowChainId: WorkflowChainId;
  readonly currentWorkflowStepId: string;
} {
  const workflowChainId = WorkflowChainId.fromString(
    normalizeNonEmptyString(input.workflowChainId, 'EngineeringSession workflowChainId'),
  );
  const currentWorkflowStepId = normalizeNonEmptyString(
    input.currentWorkflowStepId,
    'EngineeringSession currentWorkflowStepId',
  );
  const currentWorkflowStepPosition = validateWorkflowPosition(
    workflowChainId,
    currentWorkflowStepId,
    workflowChain,
  );

  return Object.freeze({
    workflowChainId,
    currentWorkflowStepId: currentWorkflowStepPosition.position.toString(),
  });
}

function validateWorkflowPosition(
  workflowChainId: WorkflowChainId,
  currentWorkflowStepId: string,
  workflowChain: WorkflowChain | undefined,
): {
  readonly position: number;
  readonly terminalPosition: number;
} {
  if (workflowChain === undefined) {
    throw new InvalidEngineeringSessionDefinitionError(
      'EngineeringSession workflowChainId must reference an existing WorkflowChain.',
    );
  }

  if (!workflowChain.id.equals(workflowChainId)) {
    throw new InvalidEngineeringSessionDefinitionError(
      `EngineeringSession workflowChainId '${workflowChainId.toString()}' does not match the supplied WorkflowChain '${workflowChain.id.toString()}'.`,
    );
  }

  const position = normalizeWorkflowStepPosition(
    currentWorkflowStepId,
    'EngineeringSession currentWorkflowStepId',
  );
  const terminalPosition = workflowChain.steps.length - 1;

  if (position > terminalPosition) {
    throw new InvalidEngineeringSessionDefinitionError(
      `EngineeringSession currentWorkflowStepId '${position.toString()}' is outside WorkflowChain '${workflowChainId.toString()}' step range.`,
    );
  }

  return Object.freeze({
    position,
    terminalPosition,
  });
}

function assertNonBlockingReviewOutcome(reviewOutcome: ReviewOutcome): void {
  const outcome = reviewOutcome.toString();

  if (outcome === 'Accepted' || outcome === 'Accepted With Observations') {
    return;
  }

  throw new InvalidEngineeringSessionDefinitionError(
    `EngineeringSession Review-Gated Advancement requires a Non-Blocking Review Outcome; received '${outcome}'.`,
  );
}

function normalizeWorkflowStepPosition(value: unknown, label: string): number {
  const normalized = normalizeNonEmptyString(value, label);

  if (!/^(0|[1-9]\d*)$/.test(normalized)) {
    throw new InvalidEngineeringSessionDefinitionError(
      `${label} must be a zero-based WorkflowStep position.`,
    );
  }

  const position = Number(normalized);

  if (!Number.isSafeInteger(position)) {
    throw new InvalidEngineeringSessionDefinitionError(
      `${label} must be a safe zero-based WorkflowStep position.`,
    );
  }

  return position;
}

function normalizeParticipatingRoleIds(roleIds: readonly string[]): readonly RoleId[] {
  if (roleIds.length === 0) {
    throw new InvalidEngineeringSessionDefinitionError(
      'EngineeringSession participatingRoleIds requires at least one Engineering Role.',
    );
  }

  const normalizedRoleIds = roleIds.map((roleId) => RoleId.fromString(roleId));
  const roleIdValues = normalizedRoleIds.map((roleId) => roleId.toString());

  if (new Set(roleIdValues).size !== roleIdValues.length) {
    throw new InvalidEngineeringSessionDefinitionError(
      'EngineeringSession participatingRoleIds cannot contain duplicate Engineering Roles.',
    );
  }

  return Object.freeze(
    normalizedRoleIds.sort((left, right) => left.toString().localeCompare(right.toString())),
  );
}

function normalizeTimeline(
  input: EngineeringSessionTimelineInput,
  statusTransitions: readonly EngineeringSessionStatusTransitionSnapshot[],
  status: EngineeringSessionStatus,
): EngineeringSessionTimelineSnapshot {
  const createdAt = normalizeNonEmptyString(input.createdAt, 'EngineeringSession createdAt');

  if (statusTransitions[0]?.status !== 'Open') {
    throw new InvalidEngineeringSessionDefinitionError(
      'EngineeringSession first status transition must be Open.',
    );
  }

  if (statusTransitions[0].occurredAt !== createdAt) {
    throw new InvalidEngineeringSessionDefinitionError(
      'EngineeringSession first status transition must occur at createdAt.',
    );
  }

  if (status.state === 'Open' && input.closedAt !== undefined) {
    throw new InvalidEngineeringSessionDefinitionError(
      'Open EngineeringSession cannot define closedAt.',
    );
  }

  if (status.state === 'Closed') {
    const closedAt = normalizeNonEmptyString(input.closedAt ?? '', 'EngineeringSession closedAt');
    const finalTransition = statusTransitions[statusTransitions.length - 1];

    if (finalTransition?.occurredAt !== closedAt) {
      throw new InvalidEngineeringSessionDefinitionError(
        'Closed EngineeringSession closedAt must match the final status transition.',
      );
    }

    return Object.freeze({
      createdAt,
      statusTransitions,
      closedAt,
    });
  }

  return Object.freeze({
    createdAt,
    statusTransitions,
  });
}

function normalizeStatusTransitions(
  transitions: readonly EngineeringSessionStatusTransitionInput[],
): readonly EngineeringSessionStatusTransitionSnapshot[] {
  if (transitions.length === 0) {
    throw new InvalidEngineeringSessionDefinitionError(
      'EngineeringSession timeline requires at least one status transition.',
    );
  }

  const normalizedTransitions = transitions.map((transition) => {
    const status = EngineeringSessionStatus.fromString(transition.status).toString();

    return Object.freeze({
      status,
      occurredAt: normalizeNonEmptyString(
        transition.occurredAt,
        'EngineeringSession status transition occurredAt',
      ),
    });
  });

  validateTransitionSequence(normalizedTransitions);

  return Object.freeze(normalizedTransitions);
}

function validateTransitionSequence(
  transitions: readonly EngineeringSessionStatusTransitionSnapshot[],
): void {
  for (let index = 1; index < transitions.length; index += 1) {
    const previous = transitions[index - 1];
    const current = transitions[index];

    if (previous === undefined || current === undefined) {
      throw new InvalidEngineeringSessionDefinitionError(
        'EngineeringSession timeline contains an invalid status transition.',
      );
    }

    if (previous.status === 'Open' && current.status === 'Closed') {
      continue;
    }

    throw new InvalidEngineeringSessionLifecycleTransitionError(previous.status, current.status);
  }
}

function normalizeDiagnostics(
  diagnostics: readonly EngineeringSessionDiagnosticInput[],
): readonly EngineeringSessionDiagnosticSnapshot[] {
  return Object.freeze(
    diagnostics.map((diagnostic) =>
      Object.freeze({
        code: normalizeNonEmptyString(diagnostic.code, 'EngineeringSession diagnostic code'),
        message: normalizeNonEmptyString(
          diagnostic.message,
          'EngineeringSession diagnostic message',
        ),
        recordedAt: normalizeNonEmptyString(
          diagnostic.recordedAt,
          'EngineeringSession diagnostic recordedAt',
        ),
      }),
    ),
  );
}

function copyMetadata(
  metadata: EngineeringSessionMetadata,
  label: string,
): EngineeringSessionMetadata {
  const copied: Record<string, string> = {};

  for (const [key, value] of Object.entries(metadata).sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    const normalizedKey = normalizeNonEmptyString(key, `${label} key`);
    copied[normalizedKey] = normalizeNonEmptyString(value, `${label} '${normalizedKey}'`);
  }

  return Object.freeze(copied);
}

function copyTimeline(timeline: EngineeringSessionTimelineSnapshot): EngineeringSessionTimelineSnapshot {
  const snapshot = {
    createdAt: timeline.createdAt,
    statusTransitions: Object.freeze(
      timeline.statusTransitions.map((transition) => Object.freeze({ ...transition })),
    ),
    ...(timeline.closedAt === undefined ? {} : { closedAt: timeline.closedAt }),
  };

  return Object.freeze(snapshot);
}

function snapshotsEqual(
  left: EngineeringSessionSnapshot,
  right: EngineeringSessionSnapshot,
): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function normalizeNonEmptyString(value: unknown, label: string): string {
  if (typeof value !== 'string') {
    throw new InvalidEngineeringSessionDefinitionError(`${label} must be a non-empty string.`);
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidEngineeringSessionDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
