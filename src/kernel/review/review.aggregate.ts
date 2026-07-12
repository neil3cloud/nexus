import { Finding } from './finding';
import type { DomainEventMetadata } from '../mission/mission.types';
import type { ReviewDomainEvent } from './review.events';
import {
  createFindingCreatedEvent,
  createReviewAcceptedEvent,
  createReviewCompletedEvent,
  createReviewRejectedEvent,
  createReviewStartedEvent,
} from './review.events';
import { ReviewCriteria } from './review-criteria';
import { ReviewId } from './review-id';
import type { ReviewSnapshot } from './review.types';
import { ReviewOutcome, ReviewStatus } from './review-values';
import {
  DuplicateFindingError,
  InvalidReviewDefinitionError,
  InvalidReviewLifecycleTransitionError,
  MissingEvidenceReferenceError,
  ReviewCompletionRejectedError,
} from './review.errors';

export interface CreateReviewInput {
  readonly id: ReviewId | string;
  readonly missionId: string;
  readonly missionPlanRevision: string;
  readonly reviewCriteria: readonly (ReviewCriteria | { readonly id: string; readonly description: string })[];
  readonly evidenceReferences: readonly string[];
}

export class Review {
  private readonly findingsById = new Map<string, Finding>();
  private readonly recordedEvents: ReviewDomainEvent[] = [];

  private constructor(
    private readonly reviewId: ReviewId,
    private readonly missionIdValue: string,
    private readonly missionPlanRevisionValue: string,
    private readonly criteriaValues: readonly ReviewCriteria[],
    private readonly evidenceReferenceValues: readonly string[],
    private statusValue: ReviewStatus,
    private outcomeValue: ReviewOutcome | undefined,
  ) {}

  public static create(input: CreateReviewInput): Review {
    return new Review(
      normalizeReviewId(input.id),
      normalizeNonEmptyString(input.missionId, 'Mission identity'),
      normalizeNonEmptyString(input.missionPlanRevision, 'MissionPlan revision'),
      normalizeCriteria(input.reviewCriteria),
      normalizeRequiredStringList(
        input.evidenceReferences,
        'Review Evidence reference',
        MissingEvidenceReferenceError,
      ),
      ReviewStatus.pending(),
      undefined,
    );
  }

  public static fromSnapshot(snapshot: ReviewSnapshot): Review {
    const review = new Review(
      ReviewId.fromString(snapshot.id),
      normalizeNonEmptyString(snapshot.missionId, 'Mission identity'),
      normalizeNonEmptyString(snapshot.missionPlanRevision, 'MissionPlan revision'),
      normalizeCriteria(snapshot.reviewCriteria),
      normalizeRequiredStringList(
        snapshot.evidenceReferences,
        'Review Evidence reference',
        MissingEvidenceReferenceError,
      ),
      ReviewStatus.fromString(snapshot.status),
      snapshot.outcome === undefined ? undefined : ReviewOutcome.fromString(snapshot.outcome),
    );

    for (const findingSnapshot of snapshot.findings) {
      const finding = Finding.fromSnapshot(findingSnapshot);
      review.assertFindingBelongsToReview(finding);
      review.assertFindingIsSupportedByReviewEvidence(finding);
      const findingId = finding.id.toString();

      if (review.findingsById.has(findingId)) {
        throw new DuplicateFindingError(findingId);
      }

      review.findingsById.set(findingId, finding);
    }

    review.assertCompletionStateConsistency();

    return review;
  }

  public get id(): ReviewId {
    return this.reviewId;
  }

  public get missionId(): string {
    return this.missionIdValue;
  }

  public get missionPlanRevision(): string {
    return this.missionPlanRevisionValue;
  }

  public get status(): ReviewStatus {
    return this.statusValue;
  }

  public get outcome(): ReviewOutcome | undefined {
    return this.outcomeValue;
  }

  public get reviewCriteria(): readonly ReviewCriteria[] {
    return this.criteriaValues;
  }

  public get evidenceReferences(): readonly string[] {
    return this.evidenceReferenceValues;
  }

  public get findings(): readonly Finding[] {
    return Object.freeze(
      [...this.findingsById.values()].sort((left, right) =>
        left.id.toString().localeCompare(right.id.toString()),
      ),
    );
  }

  public start(metadata: DomainEventMetadata): void {
    this.transitionTo('In Progress');
    this.recordedEvents.push(createReviewStartedEvent(this, metadata));
  }

  public publishFinding(finding: Finding, metadata: DomainEventMetadata): void {
    this.assertMutable();
    this.assertFindingBelongsToReview(finding);
    this.assertFindingIsSupportedByReviewEvidence(finding);

    if (this.statusValue.state !== 'In Progress') {
      throw new InvalidReviewLifecycleTransitionError(this.statusValue.toString(), 'publish Finding');
    }

    const findingId = finding.id.toString();

    if (this.findingsById.has(findingId)) {
      throw new DuplicateFindingError(findingId);
    }

    const storedFinding = Finding.fromSnapshot(finding.toSnapshot());

    this.findingsById.set(findingId, storedFinding);
    this.recordedEvents.push(createFindingCreatedEvent(this, storedFinding, metadata));
  }

  public complete(outcome: ReviewOutcome | string, metadata: DomainEventMetadata): void {
    if (this.statusValue.state !== 'In Progress') {
      throw new ReviewCompletionRejectedError(
        `Review '${this.reviewId.toString()}' must be In Progress before completion.`,
      );
    }

    this.outcomeValue = typeof outcome === 'string' ? ReviewOutcome.fromString(outcome) : outcome;
    this.transitionTo('Completed');
    this.recordCompletedEvents(this.outcomeValue, metadata);
  }

  public pullDomainEvents(): readonly ReviewDomainEvent[] {
    const events = [...this.recordedEvents];

    this.recordedEvents.length = 0;

    return events;
  }

  public toSnapshot(): ReviewSnapshot {
    return Object.freeze({
      id: this.reviewId.toString(),
      missionId: this.missionIdValue,
      missionPlanRevision: this.missionPlanRevisionValue,
      status: this.statusValue.toString(),
      ...(this.outcomeValue === undefined ? {} : { outcome: this.outcomeValue.toString() }),
      reviewCriteria: Object.freeze(this.criteriaValues.map((criteria) => criteria.toSnapshot())),
      evidenceReferences: this.evidenceReferenceValues,
      findings: Object.freeze(this.findings.map((finding) => finding.toSnapshot())),
    });
  }

  private transitionTo(target: 'In Progress' | 'Completed'): void {
    const current = this.statusValue.state;

    if (
      (current === 'Pending' && target === 'In Progress') ||
      (current === 'In Progress' && target === 'Completed')
    ) {
      this.statusValue = ReviewStatus.fromString(target);
      return;
    }

    throw new InvalidReviewLifecycleTransitionError(current, target);
  }

  private assertMutable(): void {
    if (this.statusValue.state === 'Completed') {
      throw new InvalidReviewLifecycleTransitionError('Completed', 'mutate Review');
    }
  }

  private assertFindingBelongsToReview(finding: Finding): void {
    if (!finding.reviewId.equals(this.reviewId)) {
      throw new InvalidReviewDefinitionError(
        `Finding '${finding.id.toString()}' belongs to Review '${finding.reviewId.toString()}', not '${this.reviewId.toString()}'.`,
      );
    }
  }

  private assertFindingIsSupportedByReviewEvidence(finding: Finding): void {
    const unsupportedReference = finding.supportingEvidenceReferences.find(
      (reference) => !this.evidenceReferenceValues.includes(reference),
    );

    if (unsupportedReference !== undefined) {
      throw new MissingEvidenceReferenceError(
        `Finding '${finding.id.toString()}' references Evidence '${unsupportedReference}' that is not consumed by Review '${this.reviewId.toString()}'.`,
      );
    }
  }

  private assertCompletionStateConsistency(): void {
    if (this.statusValue.state === 'Completed' && this.outcomeValue === undefined) {
      throw new ReviewCompletionRejectedError(
        `Completed Review '${this.reviewId.toString()}' requires exactly one ReviewOutcome.`,
      );
    }

    if (this.statusValue.state !== 'Completed' && this.outcomeValue !== undefined) {
      throw new ReviewCompletionRejectedError(
        `Review '${this.reviewId.toString()}' cannot have a ReviewOutcome before completion.`,
      );
    }
  }

  private recordCompletedEvents(outcome: ReviewOutcome, metadata: DomainEventMetadata): void {
    const outcomeValue = outcome.toString();

    this.recordedEvents.push(createReviewCompletedEvent(this, outcome, metadata));

    if (outcomeValue === 'Accepted' || outcomeValue === 'Accepted With Observations') {
      this.recordedEvents.push(createReviewAcceptedEvent(this, outcome, metadata));
      return;
    }

    if (outcomeValue === 'Rejected') {
      this.recordedEvents.push(createReviewRejectedEvent(this, outcome, metadata));
    }
  }
}

function normalizeReviewId(reviewId: ReviewId | string): ReviewId {
  return typeof reviewId === 'string' ? ReviewId.fromString(reviewId) : reviewId;
}

function normalizeCriteria(
  criteria: readonly (ReviewCriteria | { readonly id: string; readonly description: string })[],
): readonly ReviewCriteria[] {
  if (criteria.length === 0) {
    throw new InvalidReviewDefinitionError('ReviewCriteria is required.');
  }

  const normalizedCriteria = criteria.map((item) =>
    item instanceof ReviewCriteria ? item : ReviewCriteria.create(item),
  );
  const criteriaIds = normalizedCriteria.map((item) => item.id);
  const uniqueIds = new Set(criteriaIds);

  if (uniqueIds.size !== criteriaIds.length) {
    throw new InvalidReviewDefinitionError('ReviewCriteria identities must be unique.');
  }

  return Object.freeze(normalizedCriteria);
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
