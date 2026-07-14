import { InvalidEngineeringSessionDefinitionError } from './engineering-session.errors';

export const engineeringSessionStates = ['Open', 'Closed'] as const;
export type EngineeringSessionState = (typeof engineeringSessionStates)[number];

export class EngineeringSessionStatus {
  private constructor(private readonly value: EngineeringSessionState) {
    Object.freeze(this);
  }

  public static open(): EngineeringSessionStatus {
    return new EngineeringSessionStatus('Open');
  }

  public static closed(): EngineeringSessionStatus {
    return new EngineeringSessionStatus('Closed');
  }

  public static fromString(value: string): EngineeringSessionStatus {
    const normalized = value.trim();

    if (!engineeringSessionStates.some((state) => state === normalized)) {
      throw new InvalidEngineeringSessionDefinitionError(
        `EngineeringSessionStatus '${normalized}' is not valid.`,
      );
    }

    return new EngineeringSessionStatus(normalized as EngineeringSessionState);
  }

  public get state(): EngineeringSessionState {
    return this.value;
  }

  public equals(other: EngineeringSessionStatus): boolean {
    return this.value === other.value;
  }

  public toString(): EngineeringSessionState {
    return this.value;
  }

  public toJSON(): EngineeringSessionState {
    return this.value;
  }
}
