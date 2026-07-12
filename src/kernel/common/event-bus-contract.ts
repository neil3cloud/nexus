import type { DomainEvent } from '../events/domain-event';
import type { EvidenceDomainEvent } from '../evidence/evidence.events';

export type EventBusEvent = DomainEvent | EvidenceDomainEvent;

export interface EventSubscription {
  readonly eventType: string;
  readonly handler: (event: EventBusEvent) => void | Promise<void>;
}

export interface EventSubscriptionHandle {
  dispose(): void;
}

export interface EventBusContract {
  /**
   * Publishes an immutable Domain Event. Implementations that support disposal SHALL reject
   * publication with KernelError after disposal and SHALL NOT mutate stream state.
   */
  publish(event: EventBusEvent): Promise<void>;
  /**
   * Registers a handler for future events. Implementations that support disposal SHALL reject
   * new subscriptions with KernelError after disposal.
   */
  subscribe(subscription: EventSubscription): EventSubscriptionHandle;
  /**
   * Returns the current process-local Mission event stream. Implementations that support disposal
   * SHALL reject replay with KernelError after disposal rather than returning a partial stream.
   */
  replay(missionId: string): readonly EventBusEvent[];
}
