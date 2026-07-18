import { InvalidEngineeringSessionDefinitionError } from './engineering-session.errors';

export class EngineeringSessionId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): EngineeringSessionId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidEngineeringSessionDefinitionError(
        'EngineeringSessionId must be a non-empty string.',
      );
    }

    return new EngineeringSessionId(normalized);
  }

  public equals(other: EngineeringSessionId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
