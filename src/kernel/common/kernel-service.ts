export type ServiceHealthStatus = 'not-initialized' | 'ready' | 'disposed';

export interface ServiceHealth {
  readonly serviceName: string;
  readonly status: ServiceHealthStatus;
}

export interface IKernelService {
  readonly serviceName: string;
  initialize(): Promise<void>;
  dispose(): void;
  health(): ServiceHealth;
}
