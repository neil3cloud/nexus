import {
  findingCategories,
  findingStatuses,
  reviewOutcomes,
  reviewStatuses,
  severities,
  type FindingCategoryValue,
  type FindingStatusValue,
  type ReviewOutcomeValue,
  type ReviewStatusValue,
  type SeverityValue,
} from './review.types';
import { InvalidReviewDefinitionError } from './review.errors';

export class ReviewStatus {
  private constructor(private readonly value: ReviewStatusValue) {
    Object.freeze(this);
  }

  public static pending(): ReviewStatus {
    return new ReviewStatus('Pending');
  }

  public static fromString(value: string): ReviewStatus {
    return new ReviewStatus(normalizeAllowed(value, reviewStatuses, 'ReviewStatus'));
  }

  public get state(): ReviewStatusValue {
    return this.value;
  }

  public toString(): ReviewStatusValue {
    return this.value;
  }
}

export class ReviewOutcome {
  private constructor(private readonly value: ReviewOutcomeValue) {
    Object.freeze(this);
  }

  public static fromString(value: string): ReviewOutcome {
    return new ReviewOutcome(normalizeAllowed(value, reviewOutcomes, 'ReviewOutcome'));
  }

  public toString(): ReviewOutcomeValue {
    return this.value;
  }
}

export class Severity {
  private constructor(private readonly value: SeverityValue) {
    Object.freeze(this);
  }

  public static fromString(value: string): Severity {
    return new Severity(normalizeAllowed(value, severities, 'Severity'));
  }

  public toString(): SeverityValue {
    return this.value;
  }
}

export class FindingCategory {
  private constructor(private readonly value: FindingCategoryValue) {
    Object.freeze(this);
  }

  public static fromString(value: string): FindingCategory {
    return new FindingCategory(normalizeAllowed(value, findingCategories, 'FindingCategory'));
  }

  public toString(): FindingCategoryValue {
    return this.value;
  }
}

export class FindingStatus {
  private constructor(private readonly value: FindingStatusValue) {
    Object.freeze(this);
  }

  public static created(): FindingStatus {
    return new FindingStatus('Created');
  }

  public static fromString(value: string): FindingStatus {
    return new FindingStatus(normalizeAllowed(value, findingStatuses, 'FindingStatus'));
  }

  public get state(): FindingStatusValue {
    return this.value;
  }

  public toString(): FindingStatusValue {
    return this.value;
  }
}

function normalizeAllowed<const T extends readonly string[]>(
  value: string,
  allowed: T,
  label: string,
): T[number] {
  const normalized = value.trim();

  if (!allowed.some((candidate) => candidate === normalized)) {
    throw new InvalidReviewDefinitionError(`${label} '${normalized}' is not valid.`);
  }

  return normalized as T[number];
}
