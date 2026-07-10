export interface ExecutionProviderDescriptor {
  readonly id: string;
  readonly supportedCapabilities: readonly string[];
}

export interface ExecutionProvider {
  readonly descriptor: ExecutionProviderDescriptor;
}

// TODO: Define execution request, response, and lifecycle contracts.
