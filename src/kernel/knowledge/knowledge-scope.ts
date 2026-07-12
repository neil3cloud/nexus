import { InvalidKnowledgeDefinitionError } from './knowledge.errors';
import { knowledgeScopes, type KnowledgeScopeValue } from './knowledge.types';

export class KnowledgeScope {
  private constructor(private readonly value: KnowledgeScopeValue) {
    Object.freeze(this);
  }

  public static fromString(value: string): KnowledgeScope {
    const normalized = value.trim();

    if (!knowledgeScopes.some((scope) => scope === normalized)) {
      throw new InvalidKnowledgeDefinitionError(`KnowledgeScope '${normalized}' is not valid.`);
    }

    return new KnowledgeScope(normalized as KnowledgeScopeValue);
  }

  public equals(other: KnowledgeScope): boolean {
    return this.value === other.value;
  }

  public toString(): KnowledgeScopeValue {
    return this.value;
  }

  public toJSON(): KnowledgeScopeValue {
    return this.value;
  }
}
