import { InvalidAdapterDefinitionError } from './adapter.errors';

export const supportedAdapterCapabilities = [
  'CodeGeneration',
  'CodeModification',
  'StaticAnalysis',
  'DocumentationGeneration',
  'TestGeneration',
  'CLI',
  'Chat',
  'Completion',
] as const;

export type AdapterCapabilityName = (typeof supportedAdapterCapabilities)[number];

export class AdapterCapability {
  private constructor(private readonly value: AdapterCapabilityName) {
    Object.freeze(this);
  }

  public static fromString(value: string): AdapterCapability {
    const normalized = value.trim();

    if (!isAdapterCapabilityName(normalized)) {
      throw new InvalidAdapterDefinitionError(
        `AdapterCapability '${normalized}' is not supported by the Adapter Framework slice.`,
      );
    }

    return new AdapterCapability(normalized);
  }

  public equals(other: AdapterCapability): boolean {
    return this.value === other.value;
  }

  public toString(): AdapterCapabilityName {
    return this.value;
  }

  public toJSON(): AdapterCapabilityName {
    return this.value;
  }
}

function isAdapterCapabilityName(value: string): value is AdapterCapabilityName {
  return supportedAdapterCapabilities.some((capability) => capability === value);
}
