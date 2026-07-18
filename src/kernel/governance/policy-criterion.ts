import { DuplicatePolicyCriterionError, InvalidRepositoryPolicyDefinitionError } from './repository-policy.errors';
import type { PolicyCriterionInput, PolicyCriterionSnapshot } from './repository-policy.types';

export class PolicyCriterion {
  private constructor(
    private readonly criterionId: string,
    private readonly descriptionValue: string,
    private readonly requiredInputValues: readonly string[],
    private readonly conditionDescriptorValue: string,
  ) {
    Object.freeze(this);
  }

  public static create(input: PolicyCriterionInput): PolicyCriterion {
    return new PolicyCriterion(
      normalizeNonEmptyString(input.id, 'PolicyCriterion id'),
      normalizeNonEmptyString(input.description, 'PolicyCriterion description'),
      normalizeStringList(input.requiredInputs, 'PolicyCriterion requiredInputs'),
      normalizeNonEmptyString(input.conditionDescriptor, 'PolicyCriterion conditionDescriptor'),
    );
  }

  public static fromSnapshot(snapshot: PolicyCriterionSnapshot): PolicyCriterion {
    return PolicyCriterion.create(snapshot);
  }

  public get id(): string {
    return this.criterionId;
  }

  public toSnapshot(): PolicyCriterionSnapshot {
    return Object.freeze({
      id: this.criterionId,
      description: this.descriptionValue,
      requiredInputs: Object.freeze([...this.requiredInputValues]),
      conditionDescriptor: this.conditionDescriptorValue,
    });
  }
}

export function normalizeCriteria(
  criteria: readonly PolicyCriterionInput[],
): readonly PolicyCriterion[] {
  if (criteria.length === 0) {
    throw new InvalidRepositoryPolicyDefinitionError(
      'RepositoryPolicy requires at least one PolicyCriterion.',
    );
  }

  const seenCriterionIds = new Set<string>();
  const normalizedCriteria = criteria.map((criterionInput) => {
    const criterion = PolicyCriterion.create(criterionInput);

    if (seenCriterionIds.has(criterion.id)) {
      throw new DuplicatePolicyCriterionError(criterion.id);
    }

    seenCriterionIds.add(criterion.id);

    return criterion;
  });

  return Object.freeze(normalizedCriteria);
}

function normalizeStringList(values: readonly string[], label: string): readonly string[] {
  return Object.freeze(
    values.map((value, index) => normalizeNonEmptyString(value, `${label}[${index}]`)),
  );
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidRepositoryPolicyDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
