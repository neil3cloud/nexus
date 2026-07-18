import { InvalidEngineeringSessionDefinitionError } from './engineering-session.errors';

export class EngineeringSessionCheckpointId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): EngineeringSessionCheckpointId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidEngineeringSessionDefinitionError(
        'EngineeringSessionCheckpointId must be a non-empty string.',
      );
    }

    return new EngineeringSessionCheckpointId(normalized);
  }

  public equals(other: EngineeringSessionCheckpointId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
