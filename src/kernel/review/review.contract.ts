import type {
  FindingCategoryValue,
  FindingSnapshot,
  ReviewCriteriaSnapshot,
  ReviewOutcomeValue,
  ReviewSnapshot,
  SeverityValue,
} from './review.types';

export interface StartReviewCommand {
  readonly id?: string;
  readonly missionId: string;
  readonly missionPlanRevision: string;
  readonly reviewCriteria: readonly ReviewCriteriaSnapshot[];
  readonly evidenceReferences: readonly string[];
}

export interface PublishFindingCommand {
  readonly reviewId: string;
  readonly findingId?: string;
  readonly severity: SeverityValue | string;
  readonly category?: FindingCategoryValue | string;
  readonly summary: string;
  readonly description: string;
  readonly supportingEvidenceReferences: readonly string[];
  readonly affectedArtifactReferences: readonly string[];
  readonly criteriaReferences: readonly string[];
}

export interface FinalizeReviewOutcomeCommand {
  readonly reviewId: string;
  readonly outcome: ReviewOutcomeValue | string;
}

export interface QueryReviewResult {
  readonly reviewId: string;
}

export interface ReviewResult {
  readonly review: ReviewSnapshot;
  readonly findings: readonly FindingSnapshot[];
}

export interface ReviewServiceContract {
  startReview(command: StartReviewCommand): Promise<ReviewSnapshot>;
  publishFinding(command: PublishFindingCommand): Promise<FindingSnapshot>;
  finalizeReviewOutcome(command: FinalizeReviewOutcomeCommand): Promise<ReviewResult>;
  queryReviewResult(query: QueryReviewResult): Promise<ReviewResult>;
}
