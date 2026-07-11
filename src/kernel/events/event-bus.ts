import type { EventBusContract, EventSubscription } from '../common/event-bus-contract';
import type { EventSubscriptionHandle } from '../common/event-bus-contract';
import { KernelError } from '../common/kernel-error';
import type { KernelLogger } from '../common/kernel-logger';
import type { DomainEvent } from './domain-event';

export class EventBus implements EventBusContract {
  private readonly subscriptions: SubscriptionEntry[] = [];
  private readonly eventsByMissionId = new Map<string, DomainEvent[]>();
  private disposed = false;

  public constructor(private readonly logger: KernelLogger) {}

  public async publish(event: DomainEvent): Promise<void> {
    this.assertActive();
    assertMissionAttribution(event);

    const immutableEvent = deepFreeze(event);
    const missionEvents = this.eventsByMissionId.get(immutableEvent.missionId) ?? [];

    missionEvents.push(immutableEvent);
    this.eventsByMissionId.set(immutableEvent.missionId, missionEvents);

    for (const entry of [...this.subscriptions]) {
      if (entry.subscription.eventType === immutableEvent.eventType) {
        await this.deliver(entry.subscription, immutableEvent);
      }
    }
  }

  public subscribe(subscription: EventSubscription): EventSubscriptionHandle {
    this.assertActive();

    const entry: SubscriptionEntry = {
      subscription,
    };
    let disposed = false;

    this.subscriptions.push(entry);

    return {
      dispose: () => {
        if (disposed) {
          return;
        }

        disposed = true;

        const index = this.subscriptions.indexOf(entry);

        if (index >= 0) {
          this.subscriptions.splice(index, 1);
        }
      },
    };
  }

  public replay(missionId: string): readonly DomainEvent[] {
    this.assertActive();

    return [...(this.eventsByMissionId.get(missionId) ?? [])];
  }

  public dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this.subscriptions.length = 0;
    this.eventsByMissionId.clear();
  }

  private assertActive(): void {
    if (this.disposed) {
      throw new KernelError('EventBus has been disposed.');
    }
  }

  private async deliver(subscription: EventSubscription, event: DomainEvent): Promise<void> {
    try {
      await subscription.handler(event);
    } catch (error) {
      this.logger.error('Event handler failed.', {
        eventId: event.eventId,
        eventType: event.eventType,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

interface SubscriptionEntry {
  readonly subscription: EventSubscription;
}

function assertMissionAttribution(event: DomainEvent): void {
  if (event.missionId === event.attribution.missionId) {
    return;
  }

  throw new KernelError(
    `Domain event missionId '${event.missionId}' must match attribution.missionId '${event.attribution.missionId}'.`,
  );
}

function deepFreeze<T extends object>(
  value: T,
  validated: WeakSet<object> = new WeakSet<object>(),
  visiting: WeakSet<object> = new WeakSet<object>(),
): T {
  if (visiting.has(value)) {
    throw new KernelError('Domain events may not contain circular references.');
  }

  if (validated.has(value)) {
    return value;
  }

  visiting.add(value);

  if (!Array.isArray(value) && !isPlainObject(value)) {
    throw new KernelError('Domain events may contain only plain objects, arrays, and primitive values.');
  }

  for (const child of getJsonDataPropertyValues(value)) {
    if (isFreezable(child)) {
      deepFreeze(child, validated, visiting);
    } else {
      assertJsonPrimitive(child);
    }
  }

  visiting.delete(value);
  validated.add(value);

  return Object.freeze(value);
}

function isFreezable(value: unknown): value is object {
  return (typeof value === 'object' || typeof value === 'function') && value !== null;
}

function isPlainObject(value: object): value is Readonly<Record<string, unknown>> {
  const prototype = Object.getPrototypeOf(value) as object | null;

  return prototype === Object.prototype || prototype === null;
}

function getJsonDataPropertyValues(value: object): readonly unknown[] {
  const values: unknown[] = [];

  if (Array.isArray(value)) {
    return getJsonArrayValues(value);
  }

  for (const key of Reflect.ownKeys(value)) {
    if (typeof key === 'symbol') {
      throw new KernelError('Domain events may contain only string-keyed data properties.');
    }

    const descriptor = Object.getOwnPropertyDescriptor(value, key);

    if (descriptor === undefined) {
      continue;
    }

    if (!descriptor.enumerable) {
      throw new KernelError('Domain events may contain only enumerable data properties.');
    }

    if ('get' in descriptor || 'set' in descriptor) {
      throw new KernelError('Domain events may not contain accessor properties.');
    }

    values.push(descriptor.value);
  }

  return values;
}

function getJsonArrayValues(value: readonly unknown[]): readonly unknown[] {
  const values: unknown[] = [];

  for (let index = 0; index < value.length; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(value, String(index))) {
      throw new KernelError('Domain event arrays may not contain sparse elements.');
    }
  }

  for (const key of Reflect.ownKeys(value)) {
    if (key === 'length') {
      continue;
    }

    if (typeof key === 'symbol') {
      throw new KernelError('Domain events may contain only string-keyed data properties.');
    }

    if (!isArrayIndexKey(key)) {
      throw new KernelError('Domain event arrays may contain only indexed elements.');
    }

    const descriptor = Object.getOwnPropertyDescriptor(value, key);

    if (descriptor === undefined) {
      continue;
    }

    if (!descriptor.enumerable) {
      throw new KernelError('Domain events may contain only enumerable data properties.');
    }

    if ('get' in descriptor || 'set' in descriptor) {
      throw new KernelError('Domain events may not contain accessor properties.');
    }

    values.push(descriptor.value);
  }

  return values;
}

function isArrayIndexKey(key: string): boolean {
  const index = Number(key);

  return Number.isInteger(index) && index >= 0 && index < 4_294_967_295 && String(index) === key;
}

function assertJsonPrimitive(value: unknown): void {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') {
    return;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return;
  }

  throw new KernelError('Domain events may contain only JSON-compatible primitive values.');
}
