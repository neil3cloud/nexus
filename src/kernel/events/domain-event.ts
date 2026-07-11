export type DomainEventPayloadValue =
  | string
  | number
  | boolean
  | null
  | readonly DomainEventPayloadValue[]
  | { readonly [key: string]: DomainEventPayloadValue };

export type DomainEventPayload = Readonly<Record<string, DomainEventPayloadValue>>;

export interface DomainEventAttribution {
  readonly missionId: string;
  readonly missionPlanRevisionId?: string;
  readonly taskId?: string;
  readonly executionSessionId?: string;
  readonly engineeringRole?: string;
  readonly adapterId?: string;
}

export interface DomainEvent {
  readonly eventId: string;
  /**
   * Canonical Mission stream identifier. This value SHALL match attribution.missionId.
   */
  readonly missionId: string;
  readonly eventType: string;
  readonly timestamp: string;
  readonly causality: readonly string[];
  readonly correlationId?: string;
  readonly attribution: DomainEventAttribution;
  readonly payload: DomainEventPayload;
}
