import type { Evidence } from '../evidence/evidence.aggregate';
import type { DomainEventMetadata } from '../mission/mission.types';
import type { Mission } from '../mission/mission.aggregate';
import type { Review } from '../review/review.aggregate';
import { KnowledgeAttribution } from './knowledge-attribution';
import { KnowledgeId } from './knowledge-id';
import { KnowledgeProvenance } from './knowledge-provenance';
import { KnowledgeScope } from './knowledge-scope';
import { KnowledgeStatus } from './knowledge-status';
import type { KnowledgeDomainEvent } from './knowledge.events';
import {
  createKnowledgeCandidateCreatedEvent,
  createKnowledgeRevisionCreatedEvent,
} from './knowledge.events';
import {
  InvalidKnowledgeDefinitionError,
  KnowledgeCapturePreconditionError,
  KnowledgeRevisionRejectedError,
} from './knowledge.errors';
import type {
  KnowledgeAttributionSnapshot,
  KnowledgeProvenanceSnapshot,
  KnowledgeRevisionSnapshot,
  KnowledgeSnapshot,
  KnowledgeStatusValue,
} from './knowledge.types';

export interface CaptureKnowledgeInput {
  readonly id: KnowledgeId | string;
  readonly missionId: string;
  readonly missionPlanRevisionId: string;
  readonly summary: string;
  readonly scope: KnowledgeScope | string;
  readonly supportingEvidenceIds: readonly string[];
  readonly supportingReviewId: string;
  readonly contributingEventIds: readonly string[];
  readonly approvingAuthority: string;
}

export interface KnowledgeCaptureContext {
  readonly mission?: Mission;
  readonly supportingEvidence: readonly Evidence[];
  readonly supportingReview?: Review;
}

export class KnowledgeRevision {
  private constructor(
    private readonly revisionNumberValue: number,
    private readonly previousRevisionNumberValue: number | undefined,
    private readonly summaryValue: string,
    private readonly attributionValue: KnowledgeAttribution,
    private readonly provenanceValue: KnowledgeProvenance,
  ) {
    Object.freeze(this);
  }

  public static create(input: {
    readonly revisionNumber: number;
    readonly previousRevisionNumber?: number;
    readonly summary: string;
    readonly attribution: KnowledgeAttribution;
    readonly provenance: KnowledgeProvenance;
  }): KnowledgeRevision {
    return new KnowledgeRevision(
      normalizePositiveInteger(input.revisionNumber, 'Knowledge revision number'),
      input.previousRevisionNumber === undefined
        ? undefined
        : normalizePositiveInteger(input.previousRevisionNumber, 'Knowledge previous revision number'),
      normalizeNonEmptyString(input.summary, 'Knowledge revision summary'),
      KnowledgeAttribution.fromSnapshot(input.attribution.toSnapshot()),
      KnowledgeProvenance.fromSnapshot(input.provenance.toSnapshot()),
    );
  }

  public static fromSnapshot(snapshot: KnowledgeRevisionSnapshot): KnowledgeRevision {
    return KnowledgeRevision.create({
      revisionNumber: snapshot.revisionNumber,
      ...(snapshot.previousRevisionNumber === undefined
        ? {}
        : { previousRevisionNumber: snapshot.previousRevisionNumber }),
      summary: snapshot.summary,
      attribution: KnowledgeAttribution.fromSnapshot(snapshot.attribution),
      provenance: KnowledgeProvenance.fromSnapshot(snapshot.provenance),
    });
  }

  public get revisionNumber(): number {
    return this.revisionNumberValue;
  }

  public toSnapshot(): KnowledgeRevisionSnapshot {
    return Object.freeze({
      revisionNumber: this.revisionNumberValue,
      ...(this.previousRevisionNumberValue === undefined
        ? {}
        : { previousRevisionNumber: this.previousRevisionNumberValue }),
      summary: this.summaryValue,
      attribution: this.attributionValue.toSnapshot(),
      provenance: this.provenanceValue.toSnapshot(),
    });
  }
}

export class Knowledge {
  private readonly recordedEvents: KnowledgeDomainEvent[] = [];

  private constructor(
    private readonly knowledgeId: KnowledgeId,
    private readonly summaryValue: string,
    private readonly scopeValue: KnowledgeScope,
    private readonly statusValue: KnowledgeStatus,
    private readonly attributionValue: KnowledgeAttribution,
    private readonly provenanceValue: KnowledgeProvenance,
    private readonly revisionValues: readonly KnowledgeRevision[],
  ) {
    Object.freeze(this);
  }

  public static capture(
    input: CaptureKnowledgeInput,
    context: KnowledgeCaptureContext,
    metadata?: DomainEventMetadata,
  ): Knowledge {
    if (input.approvingAuthority.trim().length === 0) {
      throw new KnowledgeCapturePreconditionError(
        'Knowledge capture requires approval metadata.',
      );
    }

    const attribution = KnowledgeAttribution.create({
      missionId: input.missionId,
      missionPlanRevisionId: input.missionPlanRevisionId,
      supportingEvidenceIds: input.supportingEvidenceIds,
      supportingReviewId: input.supportingReviewId,
      contributingEventIds: input.contributingEventIds,
      approvingAuthority: input.approvingAuthority,
    });
    const provenance = KnowledgeProvenance.fromAttribution(attribution);

    Knowledge.assertCapturePreconditions(attribution, context);

    const knowledge = Knowledge.create({
      id: normalizeKnowledgeId(input.id),
      summary: normalizeNonEmptyString(input.summary, 'Knowledge summary'),
      scope: normalizeKnowledgeScope(input.scope),
      status: KnowledgeStatus.candidate(),
      attribution,
      provenance,
      revisions: [
        KnowledgeRevision.create({
          revisionNumber: 1,
          summary: input.summary,
          attribution,
          provenance,
        }),
      ],
    });

    if (metadata !== undefined) {
      knowledge.recordedEvents.push(createKnowledgeCandidateCreatedEvent(knowledge, metadata));
    }

    return knowledge;
  }

  public static fromSnapshot(snapshot: KnowledgeSnapshot): Knowledge {
    const attribution = KnowledgeAttribution.fromSnapshot(snapshot.attribution);
    const provenance = KnowledgeProvenance.fromSnapshot(snapshot.provenance);

    assertSnapshotConsistency(snapshot, attribution.toSnapshot(), provenance.toSnapshot());

    return Knowledge.create({
      id: KnowledgeId.fromString(snapshot.id),
      summary: snapshot.summary,
      scope: KnowledgeScope.fromString(snapshot.scope),
      status: KnowledgeStatus.fromString(snapshot.status),
      attribution,
      provenance,
      revisions: snapshot.revisions.map((revision) => KnowledgeRevision.fromSnapshot(revision)),
    });
  }

  public get id(): KnowledgeId {
    return this.knowledgeId;
  }

  public get missionId(): string {
    return this.attributionValue.missionId;
  }

  public get missionPlanRevisionId(): string {
    return this.attributionValue.missionPlanRevisionId;
  }

  public get summary(): string {
    return this.summaryValue;
  }

  public get scope(): KnowledgeScope {
    return this.scopeValue;
  }

  public get status(): KnowledgeStatus {
    return this.statusValue;
  }

  public get supportingEvidenceIds(): readonly string[] {
    return this.attributionValue.supportingEvidenceIds;
  }

  public get supportingReviewId(): string {
    return this.attributionValue.supportingReviewId;
  }

  public get contributingEventIds(): readonly string[] {
    return this.attributionValue.contributingEventIds;
  }

  public get approvingAuthority(): string {
    return this.attributionValue.approvingAuthority;
  }

  public get attribution(): KnowledgeAttribution {
    return this.attributionValue;
  }

  public get provenance(): KnowledgeProvenance {
    return this.provenanceValue;
  }

  public get revisions(): readonly KnowledgeRevision[] {
    return this.revisionValues;
  }

  public transitionTo(target: KnowledgeStatusValue | string): Knowledge {
    return this.withState({
      status: this.statusValue.transitionTo(target),
    });
  }

  public approve(): Knowledge {
    return this.transitionTo('Approved');
  }

  public activate(): Knowledge {
    return this.transitionTo('Active');
  }

  public supersede(): Knowledge {
    return this.transitionTo('Superseded');
  }

  public archive(): Knowledge {
    return this.transitionTo('Archived');
  }

  public revise(input: { readonly summary: string }, metadata?: DomainEventMetadata): Knowledge {
    if (this.statusValue.state === 'Archived') {
      throw new KnowledgeRevisionRejectedError(
        `Archived Knowledge '${this.knowledgeId.toString()}' cannot be revised.`,
      );
    }

    const nextRevisionNumber = this.revisionValues.length + 1;
    const nextSummary = normalizeNonEmptyString(input.summary, 'Knowledge revision summary');

    const revisedKnowledge = this.withState({
      summary: nextSummary,
      revisions: [
        ...this.revisionValues,
        KnowledgeRevision.create({
          revisionNumber: nextRevisionNumber,
          previousRevisionNumber: nextRevisionNumber - 1,
          summary: nextSummary,
          attribution: this.attributionValue,
          provenance: this.provenanceValue,
        }),
      ],
    });

    if (metadata !== undefined) {
      revisedKnowledge.recordedEvents.push(
        createKnowledgeRevisionCreatedEvent(revisedKnowledge, metadata),
      );
    }

    return revisedKnowledge;
  }

  public pullDomainEvents(): readonly KnowledgeDomainEvent[] {
    const events = [...this.recordedEvents];

    this.recordedEvents.length = 0;

    return events;
  }

  public toSnapshot(): KnowledgeSnapshot {
    return Object.freeze({
      id: this.knowledgeId.toString(),
      missionId: this.missionId,
      missionPlanRevisionId: this.missionPlanRevisionId,
      summary: this.summaryValue,
      scope: this.scopeValue.toString(),
      status: this.statusValue.toString(),
      supportingEvidenceIds: this.supportingEvidenceIds,
      supportingReviewId: this.supportingReviewId,
      contributingEventIds: this.contributingEventIds,
      approvingAuthority: this.approvingAuthority,
      attribution: this.attributionValue.toSnapshot(),
      provenance: this.provenanceValue.toSnapshot(),
      revisions: Object.freeze(this.revisionValues.map((revision) => revision.toSnapshot())),
    });
  }

  private static create(input: {
    readonly id: KnowledgeId;
    readonly summary: string;
    readonly scope: KnowledgeScope;
    readonly status: KnowledgeStatus;
    readonly attribution: KnowledgeAttribution;
    readonly provenance: KnowledgeProvenance;
    readonly revisions: readonly KnowledgeRevision[];
  }): Knowledge {
    if (input.revisions.length === 0) {
      throw new InvalidKnowledgeDefinitionError('Knowledge revision history is required.');
    }

    return new Knowledge(
      input.id,
      normalizeNonEmptyString(input.summary, 'Knowledge summary'),
      input.scope,
      input.status,
      KnowledgeAttribution.fromSnapshot(input.attribution.toSnapshot()),
      KnowledgeProvenance.fromSnapshot(input.provenance.toSnapshot()),
      Object.freeze(input.revisions.map((revision) => KnowledgeRevision.fromSnapshot(revision.toSnapshot()))),
    );
  }

  private static assertCapturePreconditions(
    attribution: KnowledgeAttribution,
    context: KnowledgeCaptureContext,
  ): void {
    if (context.supportingReview === undefined) {
      throw new KnowledgeCapturePreconditionError(
        `Knowledge capture requires supporting Review '${attribution.supportingReviewId}'.`,
      );
    }

    if (context.supportingReview.id.toString() !== attribution.supportingReviewId) {
      throw new KnowledgeCapturePreconditionError(
        `Knowledge supporting Review '${context.supportingReview.id.toString()}' does not match attribution '${attribution.supportingReviewId}'.`,
      );
    }

    if (context.supportingReview.status.toString() !== 'Completed') {
      throw new KnowledgeCapturePreconditionError(
        `Knowledge supporting Review '${attribution.supportingReviewId}' must be Completed.`,
      );
    }

    const reviewOutcome = context.supportingReview.outcome?.toString();

    if (reviewOutcome !== 'Accepted' && reviewOutcome !== 'Accepted With Observations') {
      throw new KnowledgeCapturePreconditionError(
        `Knowledge supporting Review '${attribution.supportingReviewId}' must have an accepted ReviewOutcome.`,
      );
    }

    const foundEvidenceIds = new Set(context.supportingEvidence.map((evidence) => evidence.id.toString()));
    const missingEvidenceId = attribution.supportingEvidenceIds.find(
      (evidenceId) => !foundEvidenceIds.has(evidenceId),
    );

    if (missingEvidenceId !== undefined) {
      throw new KnowledgeCapturePreconditionError(
        `Knowledge supporting Evidence '${missingEvidenceId}' was not found.`,
      );
    }

    if (context.mission === undefined) {
      throw new KnowledgeCapturePreconditionError(
        `Knowledge capture requires originating Mission '${attribution.missionId}'.`,
      );
    }

    if (context.mission.id.toString() !== attribution.missionId) {
      throw new KnowledgeCapturePreconditionError(
        `Knowledge originating Mission '${context.mission.id.toString()}' does not match attribution '${attribution.missionId}'.`,
      );
    }

    if (context.mission.status !== 'Completed') {
      throw new KnowledgeCapturePreconditionError(
        `Knowledge originating Mission '${attribution.missionId}' must be Completed.`,
      );
    }
  }

  private withState(input: {
    readonly summary?: string;
    readonly status?: KnowledgeStatus;
    readonly revisions?: readonly KnowledgeRevision[];
  }): Knowledge {
    return Knowledge.create({
      id: this.knowledgeId,
      summary: input.summary ?? this.summaryValue,
      scope: this.scopeValue,
      status: input.status ?? this.statusValue,
      attribution: this.attributionValue,
      provenance: this.provenanceValue,
      revisions: input.revisions ?? this.revisionValues,
    });
  }
}

function normalizeKnowledgeId(id: KnowledgeId | string): KnowledgeId {
  return typeof id === 'string' ? KnowledgeId.fromString(id) : id;
}

function normalizeKnowledgeScope(scope: KnowledgeScope | string): KnowledgeScope {
  return typeof scope === 'string' ? KnowledgeScope.fromString(scope) : scope;
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidKnowledgeDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}

function normalizePositiveInteger(value: number, label: string): number {
  if (!Number.isInteger(value) || value < 1) {
    throw new InvalidKnowledgeDefinitionError(`${label} must be a positive integer.`);
  }

  return value;
}

function assertSnapshotConsistency(
  snapshot: KnowledgeSnapshot,
  attribution: KnowledgeAttributionSnapshot,
  provenance: KnowledgeProvenanceSnapshot,
): void {
  if (
    snapshot.missionId !== attribution.missionId ||
    snapshot.missionPlanRevisionId !== attribution.missionPlanRevisionId ||
    snapshot.supportingReviewId !== attribution.supportingReviewId ||
    snapshot.approvingAuthority !== attribution.approvingAuthority ||
    !sameValues(snapshot.supportingEvidenceIds, attribution.supportingEvidenceIds) ||
    !sameValues(snapshot.contributingEventIds, attribution.contributingEventIds)
  ) {
    throw new InvalidKnowledgeDefinitionError(
      `Knowledge '${snapshot.id}' top-level attribution fields do not match KnowledgeAttribution.`,
    );
  }

  if (
    provenance.reviewLineage !== attribution.supportingReviewId ||
    provenance.approvalLineage !== attribution.approvingAuthority ||
    provenance.missionLineage.missionId !== attribution.missionId ||
    provenance.missionLineage.missionPlanRevisionId !== attribution.missionPlanRevisionId ||
    !sameValues(provenance.evidenceLineage, attribution.supportingEvidenceIds)
  ) {
    throw new InvalidKnowledgeDefinitionError(
      `Knowledge '${snapshot.id}' provenance does not match KnowledgeAttribution.`,
    );
  }
}

function sameValues(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}
