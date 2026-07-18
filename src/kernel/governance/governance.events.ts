import type { DomainEvent } from '../events/domain-event';
import type { DomainEventMetadata } from '../mission/mission.types';
import type { GovernanceDecision } from './governance-decision';

export const governanceEventTypes = ['GovernanceDecisionRecorded'] as const;
export type GovernanceEventType = (typeof governanceEventTypes)[number];

export type GovernanceDomainEvent = DomainEvent & {
  readonly eventType: GovernanceEventType;
};

export function createGovernanceDecisionRecordedEvent(
  governanceDecision: GovernanceDecision,
  metadata: DomainEventMetadata,
): GovernanceDomainEvent {
  const snapshot = governanceDecision.toSnapshot();
  const payload: GovernanceDomainEvent['payload'] = {
    governanceDecisionId: snapshot.id,
    governanceDecisionValue: snapshot.value,
    repositoryPolicyId: snapshot.repositoryPolicyId,
    repositoryPolicyVersion: snapshot.repositoryPolicyVersion,
    reviewId: snapshot.reviewId,
    policyEvaluationId: snapshot.policyEvaluationId,
    evaluationKey: snapshot.evaluationKey,
    explanationCodes: snapshot.explanationCodes,
    ...(snapshot.escalation === undefined
      ? {}
      : { governanceEscalationId: snapshot.escalation.id }),
  };

  return {
    eventId: metadata.eventId,
    missionId: snapshot.missionId,
    eventType: 'GovernanceDecisionRecorded',
    timestamp: metadata.timestamp,
    causality: metadata.causality ?? [],
    ...(metadata.correlationId === undefined ? {} : { correlationId: metadata.correlationId }),
    attribution: {
      missionId: snapshot.missionId,
    },
    payload,
  };
}
