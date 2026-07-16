import type { GovernanceStateProjectionSnapshot } from './governance-state-projection.types';

export interface GovernanceStateProjectionServiceContract {
  getGovernanceStateProjection(missionId: string): Promise<GovernanceStateProjectionSnapshot>;
}
