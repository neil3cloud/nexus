import { InvalidPlanningDefinitionError } from './planning.errors';

export class ProposedMissionPlanId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): ProposedMissionPlanId {
    return new ProposedMissionPlanId(normalizeNonEmptyString(value, 'ProposedMissionPlanId'));
  }

  public equals(other: ProposedMissionPlanId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}

export function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidPlanningDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
