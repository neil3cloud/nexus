import type { DomainEvent, DomainEventPayload } from '../events/domain-event';
import type { DomainEventMetadata } from '../mission/mission.types';
import type { Evidence } from './evidence.aggregate';

export const evidenceEventTypes = ['EvidenceCaptured'] as const;

export type EvidenceEventType = (typeof evidenceEventTypes)[number];

export type MissionScopedEvidenceDomainEvent = DomainEvent & {
  readonly eventType: EvidenceEventType;
};

export interface MissionIndependentEvidenceDomainEvent {
  readonly eventId: string;
  readonly missionId?: undefined;
  readonly eventType: EvidenceEventType;
  readonly timestamp: string;
  readonly causality: readonly string[];
  readonly correlationId?: string;
  readonly attribution: EvidenceEventAttribution;
  readonly payload: DomainEventPayload;
}

export interface EvidenceEventAttribution {
  readonly missionId?: string;
}

export type EvidenceDomainEvent =
  | MissionScopedEvidenceDomainEvent
  | MissionIndependentEvidenceDomainEvent;

export function createEvidenceCapturedEvent(
  evidence: Evidence,
  metadata: DomainEventMetadata,
): EvidenceDomainEvent {
  const payload: EvidenceDomainEvent['payload'] = {
    evidenceId: evidence.id.toString(),
    evidenceType: evidence.type.toString(),
    evidenceVersion: evidence.version.toNumber(),
    evidenceSource: evidence.source.toString(),
    evidenceHash: evidence.hash.toString(),
  };

  if (evidence.missionId === undefined) {
    return {
      eventId: metadata.eventId,
      eventType: 'EvidenceCaptured',
      timestamp: metadata.timestamp,
      causality: metadata.causality ?? [],
      ...(metadata.correlationId === undefined ? {} : { correlationId: metadata.correlationId }),
      attribution: {},
      payload,
    };
  }

  return {
    eventId: metadata.eventId,
    missionId: evidence.missionId,
    eventType: 'EvidenceCaptured',
    timestamp: metadata.timestamp,
    causality: metadata.causality ?? [],
    ...(metadata.correlationId === undefined ? {} : { correlationId: metadata.correlationId }),
    attribution: {
      missionId: evidence.missionId,
    },
    payload,
  };
}
