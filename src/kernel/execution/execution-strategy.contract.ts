import type { Mission } from "../mission/mission.contract";
import type { SharedRealityView } from "../shared-reality/shared-reality.contract";

export type EngineeringRole =
  | "builder"
  | "reviewer"
  | "security-reviewer"
  | "performance-reviewer"
  | "test-engineer"
  | "documentation-reviewer"
  | "accessibility-reviewer"
  | "database-reviewer";

export interface ExecutionStrategyRequest {
  readonly mission: Mission;
  readonly sharedReality: SharedRealityView;
}

export interface RoleAssignment {
  readonly role: EngineeringRole;
  readonly providerId: string;
}

export interface ExecutionStrategy {
  readonly id: string;
  readonly assignments: readonly RoleAssignment[];
}

export interface ExecutionStrategyService {
  select(request: ExecutionStrategyRequest): Promise<ExecutionStrategy>;
}
