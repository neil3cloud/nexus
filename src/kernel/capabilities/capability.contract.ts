export interface CapabilityInvocation<TInput> {
  readonly capabilityId: string;
  readonly input: TInput;
}

export interface CapabilityResult<TOutput> {
  readonly capabilityId: string;
  readonly output: TOutput;
  readonly evidenceReferences: readonly string[];
}

export interface Capability<TInput, TOutput> {
  readonly id: string;
  invoke(request: CapabilityInvocation<TInput>): Promise<CapabilityResult<TOutput>>;
}

// TODO: Add capability metadata, policy, and observability contracts.
