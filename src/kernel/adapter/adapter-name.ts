import { InvalidAdapterDefinitionError } from './adapter.errors';

export class AdapterName {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): AdapterName {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidAdapterDefinitionError('AdapterName must be a non-empty string.');
    }

    return new AdapterName(normalized);
  }

  public equals(other: AdapterName): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
