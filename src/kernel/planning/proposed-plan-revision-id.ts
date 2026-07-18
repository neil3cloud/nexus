import { normalizeNonEmptyString } from './proposed-mission-plan-id';

export class ProposedPlanRevisionId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): ProposedPlanRevisionId {
    return new ProposedPlanRevisionId(normalizeNonEmptyString(value, 'ProposedPlanRevisionId'));
  }

  public equals(other: ProposedPlanRevisionId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
