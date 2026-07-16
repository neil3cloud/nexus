import type { EngineeringSessionWorkflowAdvancementStrategy } from './engineering-session.events';

export interface EngineeringSessionAdvancementHistoryEntrySnapshot {
  readonly eventId: string;
  readonly missionId: string;
  readonly engineeringSessionId: string;
  readonly previousWorkflowStepId: string;
  readonly newWorkflowStepId: string;
  readonly advancementStrategy: EngineeringSessionWorkflowAdvancementStrategy;
  readonly occurredAt: string;
  readonly causality: readonly string[];
  readonly correlationId?: string;
}

export interface EngineeringSessionStateProjectionDiagnosticsSnapshot {
  readonly consumedEventCount: number;
  readonly consumedEventIds: readonly string[];
}

export interface EngineeringSessionStateProjectionSnapshot {
  readonly missionId: string;
  readonly engineeringSessionId: string;
  readonly currentWorkflowStepId: string;
  readonly previousWorkflowStepId: string;
  readonly latestAdvancementStrategy: EngineeringSessionWorkflowAdvancementStrategy;
  readonly advancementHistory: readonly EngineeringSessionAdvancementHistoryEntrySnapshot[];
  readonly latestProcessedEventId: string;
  readonly latestEventOccurredAt: string;
  readonly revision: number;
  readonly attribution: {
    readonly missionId: string;
    readonly engineeringSessionId: string;
  };
  readonly diagnostics: EngineeringSessionStateProjectionDiagnosticsSnapshot;
}

export type EngineeringSessionStateProjectionApplicationStatus =
  | 'Applied'
  | 'Duplicate'
  | 'Rejected';

export interface EngineeringSessionStateProjectionApplicationResult {
  readonly status: EngineeringSessionStateProjectionApplicationStatus;
  readonly eventId: string;
  readonly eventType: string;
  readonly missionId?: string;
  readonly engineeringSessionId?: string;
  readonly diagnostic: string;
  readonly projection?: EngineeringSessionStateProjectionSnapshot;
}
