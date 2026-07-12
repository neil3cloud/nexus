import { FindingId } from './finding-id';
import { ReviewId } from './review-id';
import {
  FindingCategory,
  FindingStatus,
  Severity,
} from './review-values';
import type { FindingSnapshot } from './review.types';
import {
  InvalidFindingLifecycleTransitionError,
  InvalidReviewDefinitionError,
  MissingEvidenceReferenceError,
} from './review.errors';

export interface FindingInput {
  readonly id: FindingId | string;
  readonly reviewId: ReviewId | string;
  readonly severity: Severity | string;
  readonly category?: FindingCategory | string;
  readonly summary: string;
  readonly description: string;
  readonly supportingEvidenceReferences: readonly string[];
  readonly affectedArtifactReferences: readonly string[];
  readonly criteriaReferences: readonly string[];
}

export class Finding {
  private constructor(
    private readonly findingId: FindingId,
    private readonly owningReviewId: ReviewId,
    private readonly findingSeverity: Severity,
    private readonly findingCategory: FindingCategory | undefined,
    private readonly findingSummary: string,
    private readonly findingDescription: string,
    private readonly evidenceReferences: readonly string[],
    private readonly artifactReferences: readonly string[],
    private readonly criteriaReferenceValues: readonly string[],
    private statusValue: FindingStatus,
  ) {}

  public static create(input: FindingInput): Finding {
    return new Finding(
      normalizeFindingId(input.id),
      normalizeReviewId(input.reviewId),
      normalizeSeverity(input.severity),
      normalizeCategory(input.category),
      normalizeNonEmptyString(input.summary, 'Finding summary'),
      normalizeNonEmptyString(input.description, 'Finding description'),
      normalizeRequiredStringList(
        input.supportingEvidenceReferences,
        'Supporting Evidence reference',
        MissingEvidenceReferenceError,
      ),
      normalizeRequiredStringList(input.affectedArtifactReferences, 'Affected Artifact reference'),
      normalizeRequiredStringList(input.criteriaReferences, 'ReviewCriteria reference'),
      FindingStatus.created(),
    );
  }

  public static fromSnapshot(snapshot: FindingSnapshot): Finding {
    const finding = new Finding(
      FindingId.fromString(snapshot.id),
      ReviewId.fromString(snapshot.reviewId),
      Severity.fromString(snapshot.severity),
      snapshot.category === undefined ? undefined : FindingCategory.fromString(snapshot.category),
      normalizeNonEmptyString(snapshot.summary, 'Finding summary'),
      normalizeNonEmptyString(snapshot.description, 'Finding description'),
      normalizeRequiredStringList(
        snapshot.supportingEvidenceReferences,
        'Supporting Evidence reference',
        MissingEvidenceReferenceError,
      ),
      normalizeRequiredStringList(snapshot.affectedArtifactReferences, 'Affected Artifact reference'),
      normalizeRequiredStringList(snapshot.criteriaReferences, 'ReviewCriteria reference'),
      FindingStatus.fromString(snapshot.status),
    );

    return finding;
  }

  public get id(): FindingId {
    return this.findingId;
  }

  public get reviewId(): ReviewId {
    return this.owningReviewId;
  }

  public get severity(): Severity {
    return this.findingSeverity;
  }

  public get category(): FindingCategory | undefined {
    return this.findingCategory;
  }

  public get status(): FindingStatus {
    return this.statusValue;
  }

  public get supportingEvidenceReferences(): readonly string[] {
    return this.evidenceReferences;
  }

  public get affectedArtifactReferences(): readonly string[] {
    return this.artifactReferences;
  }

  public get criteriaReferences(): readonly string[] {
    return this.criteriaReferenceValues;
  }

  public isActionable(): boolean {
    return this.findingCategory !== undefined;
  }

  public accept(): void {
    this.transitionTo('Accepted');
  }

  public resolve(): void {
    this.transitionTo('Resolved');
  }

  public dismiss(): void {
    this.transitionTo('Dismissed');
  }

  public toSnapshot(): FindingSnapshot {
    return Object.freeze({
      id: this.findingId.toString(),
      reviewId: this.owningReviewId.toString(),
      severity: this.findingSeverity.toString(),
      ...(this.findingCategory === undefined
        ? {}
        : { category: this.findingCategory.toString() }),
      summary: this.findingSummary,
      description: this.findingDescription,
      supportingEvidenceReferences: this.evidenceReferences,
      affectedArtifactReferences: this.artifactReferences,
      criteriaReferences: this.criteriaReferenceValues,
      status: this.statusValue.toString(),
    });
  }

  private transitionTo(target: 'Accepted' | 'Resolved' | 'Dismissed'): void {
    const current = this.statusValue.state;

    if (
      (current === 'Created' && (target === 'Accepted' || target === 'Dismissed')) ||
      (current === 'Accepted' && target === 'Resolved')
    ) {
      this.statusValue = FindingStatus.fromString(target);
      return;
    }

    throw new InvalidFindingLifecycleTransitionError(current, target);
  }
}

function normalizeFindingId(findingId: FindingId | string): FindingId {
  return typeof findingId === 'string' ? FindingId.fromString(findingId) : findingId;
}

function normalizeReviewId(reviewId: ReviewId | string): ReviewId {
  return typeof reviewId === 'string' ? ReviewId.fromString(reviewId) : reviewId;
}

function normalizeSeverity(severity: Severity | string): Severity {
  return typeof severity === 'string' ? Severity.fromString(severity) : severity;
}

function normalizeCategory(category: FindingCategory | string | undefined): FindingCategory | undefined {
  if (category === undefined) {
    return undefined;
  }

  return typeof category === 'string' ? FindingCategory.fromString(category) : category;
}

function normalizeRequiredStringList(
  values: readonly string[],
  label: string,
  ErrorType: new (message: string) => Error = InvalidReviewDefinitionError,
): readonly string[] {
  if (values.length === 0) {
    throw new ErrorType(`${label} is required.`);
  }

  const normalizedValues = values.map((value) => normalizeNonEmptyString(value, label));
  const uniqueValues = new Set(normalizedValues);

  if (uniqueValues.size !== normalizedValues.length) {
    throw new InvalidReviewDefinitionError(`${label} values must be unique.`);
  }

  return Object.freeze(normalizedValues);
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidReviewDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
