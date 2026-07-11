import type { Mission } from "../mission/mission.contract";
import type { SharedRealityView } from "../shared-reality/shared-reality.contract";

export interface ReviewFinding {
  readonly severity: "info" | "warning" | "error";
  readonly summary: string;
  readonly evidenceReferences: readonly string[];
}

export interface ReviewRequest {
  readonly mission: Mission;
  readonly sharedReality: SharedRealityView;
  readonly implementationSummary: string;
}

export interface ReviewResult {
  readonly findings: readonly ReviewFinding[];
}

export interface ReviewService {
  evaluate(request: ReviewRequest): Promise<ReviewResult>;
}
