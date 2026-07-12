import type { Mission } from '../mission/mission.contract';
import type { SharedRealitySnapshot } from '../shared-reality/shared-reality.contract';

export interface ContextRequest {
  readonly mission: Mission;
  readonly evidenceScopes: readonly string[];
}

export interface ContextService {
  assemble(request: ContextRequest): Promise<SharedRealitySnapshot>;
}
