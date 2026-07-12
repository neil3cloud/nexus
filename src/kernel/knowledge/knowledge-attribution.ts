import { InvalidKnowledgeDefinitionError } from './knowledge.errors';
import type { KnowledgeAttributionSnapshot } from './knowledge.types';

export interface KnowledgeAttributionInput {
  readonly missionId: string;
  readonly missionPlanRevisionId: string;
  readonly supportingEvidenceIds: readonly string[];
  readonly supportingReviewId: string;
  readonly contributingEventIds: readonly string[];
  readonly approvingAuthority: string;
}

export class KnowledgeAttribution {
  private constructor(
    private readonly missionIdValue: string,
    private readonly missionPlanRevisionIdValue: string,
    private readonly supportingEvidenceIdValues: readonly string[],
    private readonly supportingReviewIdValue: string,
    private readonly contributingEventIdValues: readonly string[],
    private readonly approvingAuthorityValue: string,
  ) {
    Object.freeze(this);
  }

  public static create(input: KnowledgeAttributionInput): KnowledgeAttribution {
    return new KnowledgeAttribution(
      normalizeNonEmptyString(input.missionId, 'Knowledge Mission identity'),
      normalizeNonEmptyString(input.missionPlanRevisionId, 'Knowledge MissionPlan revision identity'),
      normalizeRequiredUniqueList(input.supportingEvidenceIds, 'Knowledge supporting Evidence identity'),
      normalizeNonEmptyString(input.supportingReviewId, 'Knowledge supporting Review identity'),
      normalizeRequiredUniqueList(input.contributingEventIds, 'Knowledge contributing Domain Event identity'),
      normalizeNonEmptyString(input.approvingAuthority, 'Knowledge approving authority'),
    );
  }

  public static fromSnapshot(snapshot: KnowledgeAttributionSnapshot): KnowledgeAttribution {
    return KnowledgeAttribution.create(snapshot);
  }

  public get missionId(): string {
    return this.missionIdValue;
  }

  public get missionPlanRevisionId(): string {
    return this.missionPlanRevisionIdValue;
  }

  public get supportingEvidenceIds(): readonly string[] {
    return this.supportingEvidenceIdValues;
  }

  public get supportingReviewId(): string {
    return this.supportingReviewIdValue;
  }

  public get contributingEventIds(): readonly string[] {
    return this.contributingEventIdValues;
  }

  public get approvingAuthority(): string {
    return this.approvingAuthorityValue;
  }

  public toSnapshot(): KnowledgeAttributionSnapshot {
    return Object.freeze({
      missionId: this.missionIdValue,
      missionPlanRevisionId: this.missionPlanRevisionIdValue,
      supportingEvidenceIds: this.supportingEvidenceIdValues,
      supportingReviewId: this.supportingReviewIdValue,
      contributingEventIds: this.contributingEventIdValues,
      approvingAuthority: this.approvingAuthorityValue,
    });
  }
}

function normalizeRequiredUniqueList(values: readonly string[], label: string): readonly string[] {
  if (values.length === 0) {
    throw new InvalidKnowledgeDefinitionError(`${label} is required.`);
  }

  const normalizedValues = values.map((value) => normalizeNonEmptyString(value, label));
  const uniqueValues = new Set(normalizedValues);

  if (uniqueValues.size !== normalizedValues.length) {
    throw new InvalidKnowledgeDefinitionError(`${label} values must be unique.`);
  }

  return Object.freeze(normalizedValues);
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidKnowledgeDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
