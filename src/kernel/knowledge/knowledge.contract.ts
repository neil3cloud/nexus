import type { KnowledgeSnapshot } from './knowledge.types';

export interface KnowledgeCaptureRequest {
  readonly id?: string;
  readonly missionId: string;
  readonly missionPlanRevisionId: string;
  readonly summary: string;
  readonly scope: string;
  readonly supportingEvidenceIds: readonly string[];
  readonly supportingReviewId: string;
  readonly contributingEventIds: readonly string[];
  readonly approvingAuthority: string;
}

export interface ReviseKnowledgeRequest {
  readonly knowledgeId: string;
  readonly summary: string;
}

export interface KnowledgeLifecycleRequest {
  readonly knowledgeId: string;
}

export interface QueryKnowledgeRequest {
  readonly knowledgeId: string;
}

export interface KnowledgeServiceContract {
  captureKnowledge(request: KnowledgeCaptureRequest): Promise<KnowledgeSnapshot>;
  reviseKnowledge(request: ReviseKnowledgeRequest): Promise<KnowledgeSnapshot>;
  approveKnowledge(request: KnowledgeLifecycleRequest): Promise<KnowledgeSnapshot>;
  activateKnowledge(request: KnowledgeLifecycleRequest): Promise<KnowledgeSnapshot>;
  supersedeKnowledge(request: KnowledgeLifecycleRequest): Promise<KnowledgeSnapshot>;
  archiveKnowledge(request: KnowledgeLifecycleRequest): Promise<KnowledgeSnapshot>;
  retrieveKnowledge(request: QueryKnowledgeRequest): Promise<KnowledgeSnapshot>;
  enumerateKnowledge(): Promise<readonly KnowledgeSnapshot[]>;
}
