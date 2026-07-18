import { normalizeNonEmptyString } from './proposed-mission-plan-id';

export class ProposedTaskId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): ProposedTaskId {
    return new ProposedTaskId(normalizeNonEmptyString(value, 'ProposedTaskId'));
  }

  public equals(other: ProposedTaskId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
