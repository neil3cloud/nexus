import type { EngineeringSessionSnapshot } from './engineering-session.types';

export interface EngineeringSessionCheckpointInput {
  readonly id: string;
  readonly engineeringSession: EngineeringSessionSnapshot;
  readonly capturedAt: string;
}

export interface EngineeringSessionCheckpointSnapshot {
  readonly id: string;
  readonly engineeringSession: EngineeringSessionSnapshot;
  readonly capturedAt: string;
}
