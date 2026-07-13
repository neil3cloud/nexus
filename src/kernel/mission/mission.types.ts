export const missionStatuses = [
  'Draft',
  'Planned',
  'Ready',
  'Executing',
  'Reviewing',
  'Completed',
  'Cancelled',
  'Failed',
] as const;

export type MissionStatus = (typeof missionStatuses)[number];

export interface MissionSnapshot {
  readonly id: string;
  readonly objective: string;
  readonly status: MissionStatus;
  readonly latestEventId: string;
}

export interface DomainEventMetadata {
  readonly eventId: string;
  readonly timestamp: string;
  readonly correlationId?: string;
  readonly causality?: readonly string[];
}

export interface CreateMissionRequest {
  readonly id?: string;
  readonly objective: string;
  readonly correlationId?: string;
}
