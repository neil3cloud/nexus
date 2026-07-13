import { describe, expect, it } from 'vitest';

import { Kernel } from '../../src/kernel/kernel';
import type { EventBusContract } from '../../src/kernel/common/event-bus-contract';
import { KernelError } from '../../src/kernel/common/kernel-error';
import type { KernelLogger } from '../../src/kernel/common/kernel-logger';
import type { IKernelService, ServiceHealth } from '../../src/kernel/common/kernel-service';

class TestLogger implements KernelLogger {
  public readonly entries: { readonly level: string; readonly message: string }[] = [];

  public info(message: string): void {
    this.entries.push({ level: 'info', message });
  }

  public error(message: string): void {
    this.entries.push({ level: 'error', message });
  }
}

class TestService implements IKernelService {
  public readonly initializeCalls: string[];
  public readonly disposeCalls: string[];
  private initialized = false;
  private disposed = false;

  public constructor(
    public readonly serviceName: string,
    lifecycleEvents: {
      readonly initializeCalls?: string[];
      readonly disposeCalls?: string[];
    } = {},
  ) {
    this.initializeCalls = lifecycleEvents.initializeCalls ?? [];
    this.disposeCalls = lifecycleEvents.disposeCalls ?? [];
  }

  public async initialize(): Promise<void> {
    this.initialized = true;
    this.initializeCalls.push(this.serviceName);
  }

  public dispose(): void {
    this.disposed = true;
    this.disposeCalls.push(this.serviceName);
  }

  public health(): ServiceHealth {
    return {
      serviceName: this.serviceName,
      status: this.disposed ? 'disposed' : this.initialized ? 'ready' : 'not-initialized',
    };
  }
}

describe('Kernel', () => {
  it('accepts a service factory and passes the Kernel-owned EventBus to it', async () => {
    const logger = new TestLogger();
    const service = new TestService('FactoryService');
    let providedEventBus: EventBusContract | undefined;
    const kernel = new Kernel((eventBus) => {
      providedEventBus = eventBus;

      return [service];
    }, logger);

    await kernel.initialize();

    expect(providedEventBus).toBe(kernel.getEventBus());
    expect(kernel.health()).toEqual({
      initialized: true,
      services: [
        {
          serviceName: 'FactoryService',
          status: 'ready',
        },
      ],
    });
  });

  it('initializes registered services and reports health', async () => {
    const logger = new TestLogger();
    const kernel = new Kernel([new TestService('TestService')], logger);

    await kernel.initialize();

    expect(kernel.health()).toEqual({
      initialized: true,
      services: [
        {
          serviceName: 'TestService',
          status: 'ready',
        },
      ],
    });
    expect(logger.entries).toContainEqual({
      level: 'info',
      message: 'Kernel initialization completed.',
    });
  });

  it('skips service initialization when already initialized', async () => {
    const logger = new TestLogger();
    const initializeCalls: string[] = [];
    const kernel = new Kernel(
      [
        new TestService('FirstService', {
          initializeCalls,
        }),
      ],
      logger,
    );

    await kernel.initialize();
    await kernel.initialize();

    expect(initializeCalls).toEqual(['FirstService']);
    expect(logger.entries).toContainEqual({
      level: 'info',
      message: 'Kernel initialization skipped.',
    });
  });

  it('rejects initialization after terminal disposal without touching services', async () => {
    const logger = new TestLogger();
    const initializeCalls: string[] = [];
    const service = new TestService('TestService', {
      initializeCalls,
    });
    const kernel = new Kernel([service], logger);

    await kernel.initialize();
    kernel.dispose();

    await expect(kernel.initialize()).rejects.toThrow(KernelError);
    expect(initializeCalls).toEqual(['TestService']);
    expect(kernel.health().initialized).toBe(false);
  });

  it('disposes registered services and event bus subscriptions', async () => {
    const logger = new TestLogger();
    const service = new TestService('TestService');
    const kernel = new Kernel([service], logger);
    const handledEvents: string[] = [];

    kernel.getEventBus().subscribe({
      eventType: 'DomainEventPublished',
      handler: (event) => {
        handledEvents.push(event.eventId);
      },
    });

    await kernel.getEventBus().publish({
      eventId: 'event-1',
      missionId: 'mission-1',
      eventType: 'DomainEventPublished',
      timestamp: '2026-07-11T00:00:00.000Z',
      causality: [],
      attribution: {
        missionId: 'mission-1',
      },
      payload: {},
    });

    kernel.dispose();

    await expect(
      kernel.getEventBus().publish({
        eventId: 'event-2',
        missionId: 'mission-1',
        eventType: 'DomainEventPublished',
        timestamp: '2026-07-11T00:00:00.000Z',
        causality: [],
        attribution: {
          missionId: 'mission-1',
        },
        payload: {},
      }),
    ).rejects.toThrow(KernelError);

    expect(handledEvents).toEqual(['event-1']);
    expect(() => kernel.getEventBus().replay('mission-1')).toThrow(KernelError);
    expect(service.health().status).toBe('disposed');
  });

  it('disposes services once in reverse registration order and reports disposed health', async () => {
    const logger = new TestLogger();
    const disposeCalls: string[] = [];
    const firstService = new TestService('FirstService', {
      disposeCalls,
    });
    const secondService = new TestService('SecondService', {
      disposeCalls,
    });
    const kernel = new Kernel([firstService, secondService], logger);

    await kernel.initialize();
    kernel.dispose();
    kernel.dispose();

    expect(disposeCalls).toEqual(['SecondService', 'FirstService']);
    expect(kernel.health()).toEqual({
      initialized: false,
      services: [
        {
          serviceName: 'FirstService',
          status: 'disposed',
        },
        {
          serviceName: 'SecondService',
          status: 'disposed',
        },
      ],
    });
    expect(logger.entries).toContainEqual({
      level: 'info',
      message: 'Kernel shutdown completed.',
    });
    expect(
      logger.entries.filter((entry) => entry.message === 'Kernel shutdown completed.'),
    ).toHaveLength(1);
  });
});
