import type { Mission } from "../mission/mission.contract";
import type { ReviewResult } from "../review/review.contract";

export interface KnowledgeCaptureRequest {
  readonly mission: Mission;
  readonly implementationSummary: string;
  readonly reviewResult: ReviewResult;
}

export interface KnowledgeService {
  capture(request: KnowledgeCaptureRequest): Promise<void>;
}
