import { GovernanceDecisionId } from '../governance/governance-decision-id';
import { MissionId } from '../mission/mission-id';
import type { DomainEventMetadata } from '../mission/mission.types';
import { EngineeringSessionId } from './engineering-session-id';
import type { RecoveryRequirementDomainEvent } from './recovery-requirement.events';
import {
  createRecoveryRequirementCreatedEvent,
  createRecoveryRequirementResolvedEvent,
  createRecoveryRequirementWithdrawnEvent,
} from './recovery-requirement.events';
import {
  InvalidRecoveryRequirementDefinitionError,
} from './recovery-requirement.errors';
import { RecoveryRequirementId } from './recovery-requirement-id';
import type {
  RecoveryRequirementResolutionSnapshot,
  RecoveryRequirementSnapshot,
  RecoveryRequirementStatus,
  RecoveryRequirementWithdrawalSnapshot,
} from './recovery-requirement.types';
import { recoveryRequirementStatuses } from './recovery-requirement.types';

export interface CreateRecoveryRequirementInput {
  readonly id: string;
  readonly missionId: string;
  readonly engineeringSessionId: string;
  readonly workflowStepId: string;
  readonly governanceDecisionId: string;
  readonly createdAt: string;
  readonly creationEventId: string;
  readonly creationCausality?: readonly string[];
  readonly creationCorrelationId?: string;
}

export interface ResolveRecoveryRequirementInput {
  readonly acceptedOutcomeReference: string;
  readonly resolvedAt: string;
  readonly attribution: string;
  readonly eventId: string;
  readonly causality?: readonly string[];
  readonly correlationId?: string;
}

export interface WithdrawRecoveryRequirementInput {
  readonly authoritativeDecisionReference: string;
  readonly reason: string;
  readonly withdrawnAt: string;
  readonly attribution: string;
  readonly eventId: string;
  readonly causality?: readonly string[];
  readonly correlationId?: string;
}

export class RecoveryRequirement {
  private readonly recordedEvents: RecoveryRequirementDomainEvent[] = [];

  private constructor(private readonly snapshotValue: RecoveryRequirementSnapshot) {
    Object.freeze(this);
  }

  public static create(input: CreateRecoveryRequirementInput): RecoveryRequirement {
    const recoveryRequirement = new RecoveryRequirement(
      normalizeSnapshot({
        id: input.id,
        missionId: input.missionId,
        engineeringSessionId: input.engineeringSessionId,
        workflowStepId: input.workflowStepId,
        governanceDecisionId: input.governanceDecisionId,
        createdAt: input.createdAt,
        creationCausality: input.creationCausality ?? [],
        ...(input.creationCorrelationId === undefined
          ? {}
          : { creationCorrelationId: input.creationCorrelationId }),
        status: 'Open',
      }),
    );

    recoveryRequirement.recordedEvents.push(
      createRecoveryRequirementCreatedEvent(
        recoveryRequirement,
        createMetadata(
          input.creationEventId,
          recoveryRequirement.snapshotValue.createdAt,
          recoveryRequirement.snapshotValue.creationCausality,
          recoveryRequirement.snapshotValue.creationCorrelationId,
        ),
      ),
    );

    return recoveryRequirement;
  }

  public static fromSnapshot(snapshot: RecoveryRequirementSnapshot): RecoveryRequirement {
    const normalized = normalizeSnapshot(snapshot);

    validateLifecycleSnapshot(normalized);

    return new RecoveryRequirement(normalized);
  }

  public get id(): RecoveryRequirementId {
    return RecoveryRequirementId.fromString(this.snapshotValue.id);
  }

  public get missionId(): string {
    return this.snapshotValue.missionId;
  }

  public get engineeringSessionId(): string {
    return this.snapshotValue.engineeringSessionId;
  }

  public get workflowStepId(): string {
    return this.snapshotValue.workflowStepId;
  }

  public get governanceDecisionId(): string {
    return this.snapshotValue.governanceDecisionId;
  }

  public get status(): RecoveryRequirementStatus {
    return this.snapshotValue.status;
  }

  public resolve(input: ResolveRecoveryRequirementInput): RecoveryRequirement {
    const resolution = normalizeResolution({
      acceptedOutcomeReference: input.acceptedOutcomeReference,
      resolvedAt: input.resolvedAt,
      attribution: input.attribution,
      causality: input.causality ?? [],
      ...(input.correlationId === undefined ? {} : { correlationId: input.correlationId }),
    });

    if (this.snapshotValue.status === 'Resolved') {
      if (this.snapshotValue.resolution?.acceptedOutcomeReference === resolution.acceptedOutcomeReference) {
        return this;
      }

      throw new InvalidRecoveryRequirementDefinitionError(
        `RecoveryRequirement '${this.snapshotValue.id}' is already Resolved with a different accepted outcome reference.`,
      );
    }

    this.assertOpen('Resolved');

    const resolved = RecoveryRequirement.fromSnapshot({
      ...this.snapshotValue,
      status: 'Resolved',
      resolution,
    });

    resolved.recordedEvents.push(
      createRecoveryRequirementResolvedEvent(
        resolved,
        createMetadata(input.eventId, resolution.resolvedAt, resolution.causality, resolution.correlationId),
      ),
    );

    return resolved;
  }

  public withdraw(input: WithdrawRecoveryRequirementInput): RecoveryRequirement {
    const withdrawal = normalizeWithdrawal({
      authoritativeDecisionReference: input.authoritativeDecisionReference,
      reason: input.reason,
      withdrawnAt: input.withdrawnAt,
      attribution: input.attribution,
      causality: input.causality ?? [],
      ...(input.correlationId === undefined ? {} : { correlationId: input.correlationId }),
    });

    if (this.snapshotValue.status === 'Withdrawn') {
      if (
        this.snapshotValue.withdrawal?.authoritativeDecisionReference ===
        withdrawal.authoritativeDecisionReference
      ) {
        return this;
      }

      throw new InvalidRecoveryRequirementDefinitionError(
        `RecoveryRequirement '${this.snapshotValue.id}' is already Withdrawn with a different authoritative decision reference.`,
      );
    }

    this.assertOpen('Withdrawn');

    const withdrawn = RecoveryRequirement.fromSnapshot({
      ...this.snapshotValue,
      status: 'Withdrawn',
      withdrawal,
    });

    withdrawn.recordedEvents.push(
      createRecoveryRequirementWithdrawnEvent(
        withdrawn,
        createMetadata(
          input.eventId,
          withdrawal.withdrawnAt,
          withdrawal.causality,
          withdrawal.correlationId,
        ),
      ),
    );

    return withdrawn;
  }

  public pullDomainEvents(): readonly RecoveryRequirementDomainEvent[] {
    const events = [...this.recordedEvents];

    this.recordedEvents.length = 0;

    return events;
  }

  public toSnapshot(): RecoveryRequirementSnapshot {
    return Object.freeze({
      ...this.snapshotValue,
      creationCausality: Object.freeze([...this.snapshotValue.creationCausality]),
      ...(this.snapshotValue.resolution === undefined
        ? {}
        : { resolution: normalizeResolution(this.snapshotValue.resolution) }),
      ...(this.snapshotValue.withdrawal === undefined
        ? {}
        : { withdrawal: normalizeWithdrawal(this.snapshotValue.withdrawal) }),
    });
  }

  private assertOpen(targetStatus: RecoveryRequirementStatus): void {
    if (this.snapshotValue.status !== 'Open') {
      throw new InvalidRecoveryRequirementDefinitionError(
        `RecoveryRequirement '${this.snapshotValue.id}' cannot transition from '${this.snapshotValue.status}' to '${targetStatus}'.`,
      );
    }
  }

}

function normalizeSnapshot(snapshot: RecoveryRequirementSnapshot): RecoveryRequirementSnapshot {
  const normalizedStatus = normalizeStatus(snapshot.status);

  return Object.freeze({
    id: RecoveryRequirementId.fromString(snapshot.id).toString(),
    missionId: MissionId.fromString(snapshot.missionId).toString(),
    engineeringSessionId: EngineeringSessionId.fromString(snapshot.engineeringSessionId).toString(),
    workflowStepId: normalizeNonEmptyString(
      snapshot.workflowStepId,
      'RecoveryRequirement workflowStepId',
    ),
    governanceDecisionId: GovernanceDecisionId.fromString(snapshot.governanceDecisionId).toString(),
    createdAt: normalizeNonEmptyString(snapshot.createdAt, 'RecoveryRequirement createdAt'),
    creationCausality: normalizeStringList(
      snapshot.creationCausality,
      'RecoveryRequirement creationCausality',
    ),
    ...(snapshot.creationCorrelationId === undefined
      ? {}
      : {
          creationCorrelationId: normalizeNonEmptyString(
            snapshot.creationCorrelationId,
            'RecoveryRequirement creationCorrelationId',
          ),
        }),
    status: normalizedStatus,
    ...(snapshot.resolution === undefined
      ? {}
      : { resolution: normalizeResolution(snapshot.resolution) }),
    ...(snapshot.withdrawal === undefined
      ? {}
      : { withdrawal: normalizeWithdrawal(snapshot.withdrawal) }),
  });
}

function validateLifecycleSnapshot(snapshot: RecoveryRequirementSnapshot): void {
  if (snapshot.status === 'Open' && (snapshot.resolution !== undefined || snapshot.withdrawal !== undefined)) {
    throw new InvalidRecoveryRequirementDefinitionError(
      'Open RecoveryRequirement cannot contain terminal transition metadata.',
    );
  }

  if (snapshot.status === 'Resolved' && snapshot.resolution === undefined) {
    throw new InvalidRecoveryRequirementDefinitionError(
      'Resolved RecoveryRequirement requires resolution metadata.',
    );
  }

  if (snapshot.status === 'Resolved' && snapshot.withdrawal !== undefined) {
    throw new InvalidRecoveryRequirementDefinitionError(
      'Resolved RecoveryRequirement cannot contain withdrawal metadata.',
    );
  }

  if (snapshot.status === 'Withdrawn' && snapshot.withdrawal === undefined) {
    throw new InvalidRecoveryRequirementDefinitionError(
      'Withdrawn RecoveryRequirement requires withdrawal metadata.',
    );
  }

  if (snapshot.status === 'Withdrawn' && snapshot.resolution !== undefined) {
    throw new InvalidRecoveryRequirementDefinitionError(
      'Withdrawn RecoveryRequirement cannot contain resolution metadata.',
    );
  }
}

function normalizeResolution(
  resolution: RecoveryRequirementResolutionSnapshot,
): RecoveryRequirementResolutionSnapshot {
  return Object.freeze({
    acceptedOutcomeReference: normalizeNonEmptyString(
      resolution.acceptedOutcomeReference,
      'RecoveryRequirement acceptedOutcomeReference',
    ),
    resolvedAt: normalizeNonEmptyString(resolution.resolvedAt, 'RecoveryRequirement resolvedAt'),
    attribution: normalizeNonEmptyString(resolution.attribution, 'RecoveryRequirement resolution attribution'),
    causality: normalizeStringList(resolution.causality, 'RecoveryRequirement resolution causality'),
    ...(resolution.correlationId === undefined
      ? {}
      : {
          correlationId: normalizeNonEmptyString(
            resolution.correlationId,
            'RecoveryRequirement resolution correlationId',
          ),
        }),
  });
}

function normalizeWithdrawal(
  withdrawal: RecoveryRequirementWithdrawalSnapshot,
): RecoveryRequirementWithdrawalSnapshot {
  return Object.freeze({
    authoritativeDecisionReference: normalizeNonEmptyString(
      withdrawal.authoritativeDecisionReference,
      'RecoveryRequirement authoritativeDecisionReference',
    ),
    reason: normalizeNonEmptyString(withdrawal.reason, 'RecoveryRequirement withdrawal reason'),
    withdrawnAt: normalizeNonEmptyString(withdrawal.withdrawnAt, 'RecoveryRequirement withdrawnAt'),
    attribution: normalizeNonEmptyString(withdrawal.attribution, 'RecoveryRequirement withdrawal attribution'),
    causality: normalizeStringList(withdrawal.causality, 'RecoveryRequirement withdrawal causality'),
    ...(withdrawal.correlationId === undefined
      ? {}
      : {
          correlationId: normalizeNonEmptyString(
            withdrawal.correlationId,
            'RecoveryRequirement withdrawal correlationId',
          ),
        }),
  });
}

function normalizeStatus(status: string): RecoveryRequirementStatus {
  if (!recoveryRequirementStatuses.includes(status as RecoveryRequirementStatus)) {
    throw new InvalidRecoveryRequirementDefinitionError(
      `RecoveryRequirement status '${status}' is not supported.`,
    );
  }

  return status as RecoveryRequirementStatus;
}

function normalizeStringList(values: readonly string[], label: string): readonly string[] {
  return Object.freeze(values.map((value) => normalizeNonEmptyString(value, label)));
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidRecoveryRequirementDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}

function createMetadata(
  eventId: string,
  timestamp: string,
  causality: readonly string[],
  correlationId?: string,
): DomainEventMetadata {
  return {
    eventId: normalizeNonEmptyString(eventId, 'RecoveryRequirement eventId'),
    timestamp,
    causality,
    ...(correlationId === undefined ? {} : { correlationId }),
  };
}
