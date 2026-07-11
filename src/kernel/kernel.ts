import { EventBus } from './events/event-bus';
import type { EventBusContract } from './common/event-bus-contract';
import { KernelError } from './common/kernel-error';
import type { KernelLogger } from './common/kernel-logger';
import type { IKernelService, ServiceHealth } from './common/kernel-service';

export interface KernelHealth {
  readonly initialized: boolean;
  readonly services: readonly ServiceHealth[];
}

export type KernelServiceRegistration =
  | readonly IKernelService[]
  | ((eventBus: EventBusContract) => readonly IKernelService[]);

export class Kernel {
  private readonly eventBus: EventBus;
  private readonly services: readonly IKernelService[];
  private initialized = false;
  private disposed = false;

  public constructor(
    services: KernelServiceRegistration,
    private readonly logger: KernelLogger,
  ) {
    this.eventBus = new EventBus(logger);
    this.services = typeof services === 'function' ? services(this.eventBus) : services;
  }

  /**
   * Initializes the Kernel once. Disposal is terminal because the Kernel owns a terminal EventBus.
   */
  public async initialize(): Promise<void> {
    if (this.disposed) {
      throw new KernelError('Kernel has been disposed.');
    }

    if (this.initialized) {
      this.logger.info('Kernel initialization skipped.', { reason: 'already_initialized' });
      return;
    }

    this.logger.info('Kernel initialization started.');

    for (const service of this.services) {
      await service.initialize();
    }

    this.initialized = true;
    this.logger.info('Kernel initialization completed.', {
      serviceCount: String(this.services.length),
    });
  }

  /**
   * Returns the Kernel-owned EventBus. After Kernel disposal, the EventBus remains observable but
   * terminal: its publish, subscribe, and replay operations reject with KernelError.
   */
  public getEventBus(): EventBusContract {
    return this.eventBus;
  }

  /**
   * Reports lifecycle diagnostics after disposal with initialized=false and service health intact.
   */
  public health(): KernelHealth {
    return {
      initialized: this.initialized,
      services: this.services.map((service) => service.health()),
    };
  }

  /**
   * Terminally disposes the Kernel. Repeated disposal is idempotent and does not re-dispose services.
   */
  public dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;

    for (const service of [...this.services].reverse()) {
      service.dispose();
    }

    this.eventBus.dispose();
    this.initialized = false;
    this.logger.info('Kernel shutdown completed.');
  }
}
