export interface DomainEvent {
  readonly id: string;
  readonly missionId: string;
  readonly type: string;
  readonly timestamp: string;
  readonly causality: readonly string[];
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface DomainEventBus {
  publish(event: DomainEvent): Promise<void>;
  replay(missionId: string): Promise<readonly DomainEvent[]>;
}

// TODO: Add correlation and subscription contracts.
