import {
  InvalidKnowledgeDefinitionError,
  InvalidKnowledgeLifecycleTransitionError,
} from './knowledge.errors';
import { knowledgeStatuses, type KnowledgeStatusValue } from './knowledge.types';

export class KnowledgeStatus {
  private constructor(private readonly value: KnowledgeStatusValue) {
    Object.freeze(this);
  }

  public static candidate(): KnowledgeStatus {
    return new KnowledgeStatus('Candidate');
  }

  public static fromString(value: string): KnowledgeStatus {
    const normalized = value.trim();

    if (!knowledgeStatuses.some((status) => status === normalized)) {
      throw new InvalidKnowledgeDefinitionError(`KnowledgeStatus '${normalized}' is not valid.`);
    }

    return new KnowledgeStatus(normalized as KnowledgeStatusValue);
  }

  public get state(): KnowledgeStatusValue {
    return this.value;
  }

  public canTransitionTo(target: KnowledgeStatus | KnowledgeStatusValue | string): boolean {
    const targetState = target instanceof KnowledgeStatus ? target.state : KnowledgeStatus.fromString(target).state;

    if (this.value === 'Candidate') {
      return targetState === 'Approved';
    }

    if (this.value === 'Approved') {
      return targetState === 'Active';
    }

    if (this.value === 'Active') {
      return targetState === 'Superseded';
    }

    if (this.value === 'Superseded') {
      return targetState === 'Archived';
    }

    return false;
  }

  public transitionTo(target: KnowledgeStatusValue | string): KnowledgeStatus {
    const targetStatus = KnowledgeStatus.fromString(target);

    if (!this.canTransitionTo(targetStatus)) {
      throw new InvalidKnowledgeLifecycleTransitionError(this.value, targetStatus.toString());
    }

    return targetStatus;
  }

  public equals(other: KnowledgeStatus): boolean {
    return this.value === other.value;
  }

  public toString(): KnowledgeStatusValue {
    return this.value;
  }

  public toJSON(): KnowledgeStatusValue {
    return this.value;
  }
}
