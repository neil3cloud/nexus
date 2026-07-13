import { InvalidKnowledgeDefinitionError } from './knowledge.errors';

export class KnowledgeId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): KnowledgeId {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new InvalidKnowledgeDefinitionError('KnowledgeId must be a non-empty string.');
    }

    return new KnowledgeId(normalized);
  }

  public equals(other: KnowledgeId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
