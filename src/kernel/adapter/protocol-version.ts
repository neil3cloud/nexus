import { InvalidAdapterDefinitionError } from './adapter.errors';

export class ProtocolVersion {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): ProtocolVersion {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidAdapterDefinitionError('ProtocolVersion must be a non-empty string.');
    }

    return new ProtocolVersion(normalized);
  }

  public equals(other: ProtocolVersion): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
