import { InvalidAdapterDefinitionError } from './adapter.errors';

export class AdapterVersion {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): AdapterVersion {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidAdapterDefinitionError('AdapterVersion must be a non-empty string.');
    }

    return new AdapterVersion(normalized);
  }

  public equals(other: AdapterVersion): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
