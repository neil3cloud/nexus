import { describe, expect, it } from 'vitest';

import type { KernelLogger } from '../../src/kernel/common/kernel-logger';
import type { EventBusEvent } from '../../src/kernel/common/event-bus-contract';
import { KernelError } from '../../src/kernel/common/kernel-error';
import { EventBus } from '../../src/kernel/events/event-bus';
import type { DomainEvent } from '../../src/kernel/events/domain-event';

class TestLogger implements KernelLogger {
  public readonly errors: Readonly<Record<string, string>>[] = [];

  public info(): void {}

  public error(_message: string, fields: Readonly<Record<string, string>> = {}): void {
    this.errors.push(fields);
  }
}

function createEvent(overrides: Partial<DomainEvent> = {}): DomainEvent {
  return {
    eventId: 'event-1',
    missionId: 'mission-1',
    eventType: 'MissionCreated',
    timestamp: '2026-07-11T00:00:00.000Z',
    causality: [],
    attribution: {
      missionId: 'mission-1',
    },
    payload: {},
    ...overrides,
  };
}

describe('EventBus', () => {
  it('allows a subscriber to detach without disposing the bus', async () => {
    const bus = new EventBus(new TestLogger());
    const handledEvents: string[] = [];
    const handle = bus.subscribe({
      eventType: 'MissionCreated',
      handler: (event) => {
        handledEvents.push(event.eventId);
      },
    });

    await bus.publish(createEvent({ eventId: 'event-1' }));
    handle.dispose();
    await bus.publish(createEvent({ eventId: 'event-2' }));

    expect(handledEvents).toEqual(['event-1']);
  });

  it('treats each subscription handle as an idempotent registration owner', async () => {
    const bus = new EventBus(new TestLogger());
    const handledEvents: string[] = [];
    const subscription = {
      eventType: 'MissionCreated',
      handler: (event: EventBusEvent) => {
        handledEvents.push(event.eventId);
      },
    };
    const firstHandle = bus.subscribe(subscription);

    bus.subscribe(subscription);
    firstHandle.dispose();
    firstHandle.dispose();
    await bus.publish(createEvent());

    expect(handledEvents).toEqual(['event-1']);
  });

  it('logs throwing handlers and continues delivery to remaining subscribers', async () => {
    const logger = new TestLogger();
    const bus = new EventBus(logger);
    const handledEvents: string[] = [];

    bus.subscribe({
      eventType: 'MissionCreated',
      handler: () => {
        throw new Error('handler failed');
      },
    });
    bus.subscribe({
      eventType: 'MissionCreated',
      handler: (event) => {
        handledEvents.push(event.eventId);
      },
    });

    await bus.publish(createEvent());

    expect(handledEvents).toEqual(['event-1']);
    expect(logger.errors).toEqual([
      {
        eventId: 'event-1',
        eventType: 'MissionCreated',
        error: 'handler failed',
      },
    ]);
  });

  it('deeply freezes published events before delivery and replay', async () => {
    const bus = new EventBus(new TestLogger());
    const event = createEvent({
      payload: {
        nested: {
          value: 'initial',
        },
      },
    });

    bus.subscribe({
      eventType: 'MissionCreated',
      handler: (publishedEvent) => {
        const mutablePayload = publishedEvent.payload as { nested: { value: string } };

        expect(() => {
          mutablePayload.nested.value = 'changed';
        }).toThrow(TypeError);
      },
    });

    await bus.publish(event);

    const replayedEvent = bus.replay('mission-1')[0];

    if (replayedEvent === undefined) {
      throw new Error('Expected replayed event.');
    }

    const mutableReplayPayload = replayedEvent.payload as { nested: { value: string } };

    expect(() => {
      mutableReplayPayload.nested.value = 'changed';
    }).toThrow(TypeError);
  });

  it('publishes events when missionId matches attribution.missionId', async () => {
    const bus = new EventBus(new TestLogger());
    const handledEvents: string[] = [];
    const event = createEvent({
      eventId: 'event-matching-attribution',
      missionId: 'mission-matching',
      attribution: {
        missionId: 'mission-matching',
      },
    });

    bus.subscribe({
      eventType: 'MissionCreated',
      handler: (publishedEvent) => {
        handledEvents.push(publishedEvent.eventId);
      },
    });

    await bus.publish(event);

    expect(handledEvents).toEqual(['event-matching-attribution']);
    expect(bus.replay('mission-matching')).toEqual([event]);
  });

  it('rejects events when missionId differs from attribution.missionId', async () => {
    const bus = new EventBus(new TestLogger());
    const handledEvents: string[] = [];

    bus.subscribe({
      eventType: 'MissionCreated',
      handler: (publishedEvent) => {
        handledEvents.push(publishedEvent.eventId);
      },
    });

    await expect(
      bus.publish(
        createEvent({
          eventId: 'event-mismatched-attribution',
          missionId: 'mission-stream',
          attribution: {
            missionId: 'mission-attribution',
          },
        }),
      ),
    ).rejects.toThrow(
      "Domain event missionId 'mission-stream' must match attribution.missionId 'mission-attribution'.",
    );

    expect(handledEvents).toEqual([]);
    expect(bus.replay('mission-stream')).toEqual([]);
    expect(bus.replay('mission-attribution')).toEqual([]);
  });

  it('rejects mutable built-ins before publication', async () => {
    const bus = new EventBus(new TestLogger());
    const event = createEvent({
      payload: {
        mutable: new Map<string, string>(),
      } as unknown as DomainEvent['payload'],
    });

    await expect(bus.publish(event)).rejects.toThrow(
      'Domain events may contain only plain objects, arrays, and primitive values.',
    );
    expect(bus.replay('mission-1')).toEqual([]);
  });

  it('rejects non-json payload primitives before publication', async () => {
    const invalidPayloads: readonly DomainEvent['payload'][] = [
      { value: undefined } as unknown as DomainEvent['payload'],
      { value: Number.NaN },
      { value: Number.POSITIVE_INFINITY },
      { value: 1n } as unknown as DomainEvent['payload'],
      { value: Symbol('event') } as unknown as DomainEvent['payload'],
    ];

    for (const payload of invalidPayloads) {
      const bus = new EventBus(new TestLogger());

      await expect(bus.publish(createEvent({ payload }))).rejects.toThrow(
        'Domain events may contain only JSON-compatible primitive values.',
      );
      expect(bus.replay('mission-1')).toEqual([]);
    }
  });

  it('rejects circular payloads before publication', async () => {
    const bus = new EventBus(new TestLogger());
    const cycle: Record<string, unknown> = {};

    cycle['self'] = cycle;

    await expect(
      bus.publish(
        createEvent({
          payload: {
            cycle,
          } as unknown as DomainEvent['payload'],
        }),
      ),
    ).rejects.toThrow('Domain events may not contain circular references.');
    expect(bus.replay('mission-1')).toEqual([]);
  });

  it('rejects non-json object descriptors before publication', async () => {
    const hiddenValuePayload: Record<string, unknown> = {};
    const accessorPayload: Record<string, unknown> = {};
    const symbolPayload: Record<string | symbol, unknown> = {};

    Object.defineProperty(hiddenValuePayload, 'hidden', {
      value: 'hidden',
      enumerable: false,
    });
    Object.defineProperty(accessorPayload, 'value', {
      get: () => 'derived',
      enumerable: true,
    });
    symbolPayload[Symbol('event')] = 'symbol-keyed';

    const cases: readonly {
      readonly payload: DomainEvent['payload'];
      readonly message: string;
    }[] = [
      {
        payload: hiddenValuePayload as unknown as DomainEvent['payload'],
        message: 'Domain events may contain only enumerable data properties.',
      },
      {
        payload: accessorPayload as unknown as DomainEvent['payload'],
        message: 'Domain events may not contain accessor properties.',
      },
      {
        payload: symbolPayload as unknown as DomainEvent['payload'],
        message: 'Domain events may contain only string-keyed data properties.',
      },
    ];

    for (const testCase of cases) {
      const bus = new EventBus(new TestLogger());

      await expect(bus.publish(createEvent({ payload: testCase.payload }))).rejects.toThrow(
        testCase.message,
      );
      expect(bus.replay('mission-1')).toEqual([]);
    }
  });

  it('rejects non-json arrays before publication', async () => {
    const sparseArray: unknown[] = [];
    const propertyArray: unknown[] = [];

    sparseArray[1] = 'value';
    (propertyArray as unknown as Record<string, unknown>)['extra'] = 'value';

    const cases: readonly {
      readonly payload: DomainEvent['payload'];
      readonly message: string;
    }[] = [
      {
        payload: {
          value: sparseArray,
        } as unknown as DomainEvent['payload'],
        message: 'Domain event arrays may not contain sparse elements.',
      },
      {
        payload: {
          value: propertyArray,
        } as unknown as DomainEvent['payload'],
        message: 'Domain event arrays may contain only indexed elements.',
      },
    ];

    for (const testCase of cases) {
      const bus = new EventBus(new TestLogger());

      await expect(bus.publish(createEvent({ payload: testCase.payload }))).rejects.toThrow(
        testCase.message,
      );
      expect(bus.replay('mission-1')).toEqual([]);
    }
  });

  it('replays events for the requested mission stream only', async () => {
    const bus = new EventBus(new TestLogger());

    await bus.publish(createEvent({ eventId: 'event-1', missionId: 'mission-1' }));
    await bus.publish(
      createEvent({
        eventId: 'event-2',
        missionId: 'mission-2',
        attribution: {
          missionId: 'mission-2',
        },
      }),
    );

    expect(bus.replay('mission-1').map((event) => event.eventId)).toEqual(['event-1']);
  });

  it('makes disposal terminal for publish, subscribe, and replay', async () => {
    const bus = new EventBus(new TestLogger());
    const handledEvents: string[] = [];

    bus.subscribe({
      eventType: 'MissionCreated',
      handler: (event) => {
        handledEvents.push(event.eventId);
      },
    });

    await bus.publish(createEvent({ eventId: 'event-1' }));
    bus.dispose();

    await expect(bus.publish(createEvent({ eventId: 'event-2' }))).rejects.toThrow(KernelError);
    expect(() =>
      bus.subscribe({
        eventType: 'MissionCreated',
        handler: () => {},
      }),
    ).toThrow(KernelError);
    expect(() => bus.replay('mission-1')).toThrow(KernelError);
    expect(handledEvents).toEqual(['event-1']);
  });
});
