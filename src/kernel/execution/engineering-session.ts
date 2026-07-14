import { EngineeringSessionId } from './engineering-session-id';
import { EngineeringSessionStatus } from './engineering-session-status';
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

export class EngineeringSession {
  private constructor(
    private readonly engineeringSessionId: EngineeringSessionId,
    private statusValue: EngineeringSessionStatus,
    private readonly engineeringRuntimeContextReferenceValue: string,
    private readonly activeEngineeringWorkflowReferenceValue: string,
    private readonly participatingRoleIdValues: readonly RoleId[],
    private readonly workflowStateValue: string,
    private timelineValue: EngineeringSessionTimelineSnapshot,
    private readonly diagnosticValues: readonly EngineeringSessionDiagnosticSnapshot[],
    private readonly collaborationMetadataValue: EngineeringSessionMetadata,
  ) {}

  public static create(input: EngineeringSessionInput): EngineeringSession {
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
      normalizeParticipatingRoleIds(input.participatingRoleIds),
      normalizeNonEmptyString(input.workflowState, 'EngineeringSession workflowState'),
      timeline,
      normalizeDiagnostics(input.diagnostics ?? []),
      copyMetadata(input.collaborationMetadata ?? {}, 'EngineeringSession collaborationMetadata'),
    );
  }

  public static fromSnapshot(snapshot: EngineeringSessionSnapshot): EngineeringSession {
    const engineeringSession = EngineeringSession.create({
      id: snapshot.id,
      engineeringRuntimeContextReference: snapshot.engineeringRuntimeContextReference,
      activeEngineeringWorkflowReference: snapshot.activeEngineeringWorkflowReference,
      participatingRoleIds: snapshot.participatingRoleIds,
      workflowState: snapshot.workflowState,
      timeline: snapshot.timeline,
      diagnostics: snapshot.diagnostics,
      collaborationMetadata: snapshot.collaborationMetadata,
    });

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

  public equals(other: EngineeringSession): boolean {
    return snapshotsEqual(this.toSnapshot(), other.toSnapshot());
  }

  public toSnapshot(): EngineeringSessionSnapshot {
    return Object.freeze({
      id: this.engineeringSessionId.toString(),
      status: this.statusValue.toString(),
      engineeringRuntimeContextReference: this.engineeringRuntimeContextReferenceValue,
      activeEngineeringWorkflowReference: this.activeEngineeringWorkflowReferenceValue,
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

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidEngineeringSessionDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
