import type { DomainEvent } from '../events/domain-event';
import type { DomainEventMetadata } from '../mission/mission.types';
import type { RecoveryRequirement } from './recovery-requirement';

export const recoveryRequirementEventTypes = [
  'RecoveryRequirementCreated',
  'RecoveryRequirementResolved',
  'RecoveryRequirementWithdrawn',
] as const;
export type RecoveryRequirementEventType = (typeof recoveryRequirementEventTypes)[number];

export type RecoveryRequirementDomainEvent = DomainEvent & {
  readonly eventType: RecoveryRequirementEventType;
};

export function createRecoveryRequirementCreatedEvent(
  recoveryRequirement: RecoveryRequirement,
  metadata: DomainEventMetadata,
): RecoveryRequirementDomainEvent {
  return createRecoveryRequirementEvent(
    'RecoveryRequirementCreated',
    recoveryRequirement,
    metadata,
    {},
  );
}

export function createRecoveryRequirementResolvedEvent(
  recoveryRequirement: RecoveryRequirement,
  metadata: DomainEventMetadata,
): RecoveryRequirementDomainEvent {
  const snapshot = recoveryRequirement.toSnapshot();

  return createRecoveryRequirementEvent(
    'RecoveryRequirementResolved',
    recoveryRequirement,
    metadata,
    snapshot.resolution === undefined
      ? {}
      : {
          acceptedOutcomeReference: snapshot.resolution.acceptedOutcomeReference,
          resolvedAt: snapshot.resolution.resolvedAt,
          resolutionAttribution: snapshot.resolution.attribution,
        },
  );
}

export function createRecoveryRequirementWithdrawnEvent(
  recoveryRequirement: RecoveryRequirement,
  metadata: DomainEventMetadata,
): RecoveryRequirementDomainEvent {
  const snapshot = recoveryRequirement.toSnapshot();

  return createRecoveryRequirementEvent(
    'RecoveryRequirementWithdrawn',
    recoveryRequirement,
    metadata,
    snapshot.withdrawal === undefined
      ? {}
      : {
          authoritativeDecisionReference: snapshot.withdrawal.authoritativeDecisionReference,
          withdrawalReason: snapshot.withdrawal.reason,
          withdrawnAt: snapshot.withdrawal.withdrawnAt,
          withdrawalAttribution: snapshot.withdrawal.attribution,
        },
  );
}

function createRecoveryRequirementEvent(
  eventType: RecoveryRequirementEventType,
  recoveryRequirement: RecoveryRequirement,
  metadata: DomainEventMetadata,
  additionalPayload: RecoveryRequirementDomainEvent['payload'],
): RecoveryRequirementDomainEvent {
  const snapshot = recoveryRequirement.toSnapshot();
  const payload: RecoveryRequirementDomainEvent['payload'] = {
    recoveryRequirementId: snapshot.id,
    recoveryRequirementStatus: snapshot.status,
    engineeringSessionId: snapshot.engineeringSessionId,
    workflowStepId: snapshot.workflowStepId,
    governanceDecisionId: snapshot.governanceDecisionId,
    createdAt: snapshot.createdAt,
    ...additionalPayload,
  };

  return {
    eventId: metadata.eventId,
    missionId: snapshot.missionId,
    eventType,
    timestamp: metadata.timestamp,
    causality: metadata.causality ?? [],
    ...(metadata.correlationId === undefined ? {} : { correlationId: metadata.correlationId }),
    attribution: {
      missionId: snapshot.missionId,
    },
    payload,
  };
}
