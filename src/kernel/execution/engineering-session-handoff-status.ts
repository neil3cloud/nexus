import { InvalidEngineeringSessionHandoffDefinitionError } from './mission-engineering-orchestration.errors';

export const engineeringSessionHandoffStates = ['Recorded'] as const;
export type EngineeringSessionHandoffState = (typeof engineeringSessionHandoffStates)[number];

export class EngineeringSessionHandoffStatus {
  private constructor(private readonly value: EngineeringSessionHandoffState) {
    Object.freeze(this);
  }

  public static recorded(): EngineeringSessionHandoffStatus {
    return new EngineeringSessionHandoffStatus('Recorded');
  }

  public static fromString(value: string): EngineeringSessionHandoffStatus {
    const normalized = value.trim();

    if (!engineeringSessionHandoffStates.some((state) => state === normalized)) {
      throw new InvalidEngineeringSessionHandoffDefinitionError(
        `EngineeringSessionHandoffStatus '${normalized}' is not valid.`,
      );
    }

    return new EngineeringSessionHandoffStatus(normalized as EngineeringSessionHandoffState);
  }

  public get state(): EngineeringSessionHandoffState {
    return this.value;
  }

  public equals(other: EngineeringSessionHandoffStatus): boolean {
    return this.value === other.value;
  }

  public toString(): EngineeringSessionHandoffState {
    return this.value;
  }

  public toJSON(): EngineeringSessionHandoffState {
    return this.value;
  }
}
