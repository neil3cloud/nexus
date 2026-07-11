import type { IKernelService, ServiceHealth, ServiceHealthStatus } from './kernel-service';

export abstract class ServiceLifecycle implements IKernelService {
  private status: ServiceHealthStatus = 'not-initialized';

  protected constructor(public readonly serviceName: string) {}

  public async initialize(): Promise<void> {
    this.status = 'ready';
  }

  public dispose(): void {
    this.status = 'disposed';
  }

  public health(): ServiceHealth {
    return {
      serviceName: this.serviceName,
      status: this.status,
    };
  }
}
