import type { DomainEvent } from '../events/domain-event';
import type { DomainEventMetadata } from '../mission/mission.types';
import type { EngineeringSession } from './engineering-session';

export const engineeringSessionEventTypes = ['EngineeringSessionWorkflowAdvanced'] as const;
export type EngineeringSessionEventType = (typeof engineeringSessionEventTypes)[number];

export const engineeringSessionWorkflowAdvancementStrategies = [
  'Direct',
  'Trigger',
  'ReviewGated',
  'GovernanceGated',
] as const;
export type EngineeringSessionWorkflowAdvancementStrategy =
  (typeof engineeringSessionWorkflowAdvancementStrategies)[number];

export type EngineeringSessionDomainEvent = DomainEvent & {
  readonly eventType: EngineeringSessionEventType;
};

export function createEngineeringSessionWorkflowAdvancedEvent(
  input: {
    readonly engineeringSession: EngineeringSession;
    readonly missionId: string;
    readonly previousWorkflowStepId: string;
    readonly newWorkflowStepId: string;
    readonly strategy: EngineeringSessionWorkflowAdvancementStrategy;
  },
  metadata: DomainEventMetadata,
): EngineeringSessionDomainEvent {
  const engineeringSessionId = input.engineeringSession.id.toString();

  return {
    eventId: metadata.eventId,
    missionId: input.missionId,
    eventType: 'EngineeringSessionWorkflowAdvanced',
    timestamp: metadata.timestamp,
    causality: metadata.causality ?? [],
    ...(metadata.correlationId === undefined ? {} : { correlationId: metadata.correlationId }),
    attribution: {
      missionId: input.missionId,
    },
    payload: {
      engineeringSessionId,
      previousWorkflowStepId: input.previousWorkflowStepId,
      newWorkflowStepId: input.newWorkflowStepId,
      strategy: input.strategy,
    },
  };
}
