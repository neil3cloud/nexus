import type { EventBusEvent } from '../common/event-bus-contract';
import { KernelError } from '../common/kernel-error';
import { MissionId } from '../mission/mission-id';
import { EngineeringSessionId } from './engineering-session-id';
import {
  engineeringSessionEventTypes,
  engineeringSessionWorkflowAdvancementStrategies,
  type EngineeringSessionWorkflowAdvancementStrategy,
} from './engineering-session.events';
import type {
  EngineeringSessionAdvancementHistoryEntrySnapshot,
  EngineeringSessionStateProjectionDiagnosticsSnapshot,
  EngineeringSessionStateProjectionSnapshot,
} from './engineering-session-state-projection.types';

type EngineeringSessionStateProjectionEventType = (typeof engineeringSessionEventTypes)[number];

interface NormalizedEngineeringSessionWorkflowAdvancedEvent {
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

export class EngineeringSessionStateProjection {
  private constructor(
    private readonly missionIdValue: string,
    private readonly engineeringSessionIdValue: string,
    private readonly currentWorkflowStepIdValue: string,
    private readonly previousWorkflowStepIdValue: string,
    private readonly latestAdvancementStrategyValue: EngineeringSessionWorkflowAdvancementStrategy,
    private readonly advancementHistoryValues: readonly EngineeringSessionAdvancementHistoryEntrySnapshot[],
    private readonly revisionValue: number,
  ) {
    Object.freeze(this);
  }

  public static createFromEvent(event: EventBusEvent): EngineeringSessionStateProjection {
    const normalizedEvent = normalizeEngineeringSessionWorkflowAdvancedEvent(event);
    const history = Object.freeze([createHistoryEntry(normalizedEvent)]);

    return new EngineeringSessionStateProjection(
      normalizedEvent.missionId,
      normalizedEvent.engineeringSessionId,
      normalizedEvent.newWorkflowStepId,
      normalizedEvent.previousWorkflowStepId,
      normalizedEvent.advancementStrategy,
      history,
      history.length,
    );
  }

  public static fromSnapshot(
    snapshot: EngineeringSessionStateProjectionSnapshot,
  ): EngineeringSessionStateProjection {
    const history = normalizeHistory(snapshot.advancementHistory);

    if (history.length === 0) {
      throw new KernelError('EngineeringSessionStateProjection history must contain an observed event.');
    }

    const latestEntry = history[history.length - 1];

    if (latestEntry === undefined) {
      throw new KernelError('EngineeringSessionStateProjection history must contain a latest event.');
    }

    const missionId = normalizeMissionId(snapshot.missionId);
    const engineeringSessionId = normalizeEngineeringSessionId(snapshot.engineeringSessionId);

    if (latestEntry.missionId !== missionId || latestEntry.engineeringSessionId !== engineeringSessionId) {
      throw new KernelError('EngineeringSessionStateProjection latest history attribution is inconsistent.');
    }

    if (snapshot.revision !== history.length) {
      throw new KernelError('EngineeringSessionStateProjection revision must equal history length.');
    }

    return new EngineeringSessionStateProjection(
      missionId,
      engineeringSessionId,
      normalizeNonEmptyString(
        snapshot.currentWorkflowStepId,
        'EngineeringSessionStateProjection currentWorkflowStepId',
      ),
      normalizeNonEmptyString(
        snapshot.previousWorkflowStepId,
        'EngineeringSessionStateProjection previousWorkflowStepId',
      ),
      normalizeAdvancementStrategy(snapshot.latestAdvancementStrategy),
      history,
      snapshot.revision,
    );
  }

  public get missionId(): string {
    return this.missionIdValue;
  }

  public get engineeringSessionId(): string {
    return this.engineeringSessionIdValue;
  }

  public get currentWorkflowStepId(): string {
    return this.currentWorkflowStepIdValue;
  }

  public hasProcessedEvent(eventId: string): boolean {
    const normalizedEventId = normalizeNonEmptyString(
      eventId,
      'EngineeringSessionStateProjection eventId',
    );

    return this.advancementHistoryValues.some((entry) => entry.eventId === normalizedEventId);
  }

  public apply(event: EventBusEvent): EngineeringSessionStateProjection {
    const normalizedEvent = normalizeEngineeringSessionWorkflowAdvancedEvent(event);

    if (this.hasProcessedEvent(normalizedEvent.eventId)) {
      return this;
    }

    if (normalizedEvent.engineeringSessionId !== this.engineeringSessionIdValue) {
      throw new KernelError(
        `EngineeringSessionStateProjection for Engineering Session '${this.engineeringSessionIdValue}' cannot consume event '${normalizedEvent.eventId}' for Engineering Session '${normalizedEvent.engineeringSessionId}'.`,
      );
    }

    if (normalizedEvent.missionId !== this.missionIdValue) {
      throw new KernelError(
        `EngineeringSessionStateProjection for Engineering Session '${this.engineeringSessionIdValue}' cannot consume event '${normalizedEvent.eventId}' from Mission '${normalizedEvent.missionId}'.`,
      );
    }

    if (normalizedEvent.previousWorkflowStepId !== this.currentWorkflowStepIdValue) {
      throw new KernelError(
        `EngineeringSessionStateProjection continuity mismatch for Engineering Session '${this.engineeringSessionIdValue}': event '${normalizedEvent.eventId}' starts at Workflow Step '${normalizedEvent.previousWorkflowStepId}' but projection is at '${this.currentWorkflowStepIdValue}'.`,
      );
    }

    const history = Object.freeze([
      ...this.advancementHistoryValues,
      createHistoryEntry(normalizedEvent),
    ]);

    return new EngineeringSessionStateProjection(
      this.missionIdValue,
      this.engineeringSessionIdValue,
      normalizedEvent.newWorkflowStepId,
      normalizedEvent.previousWorkflowStepId,
      normalizedEvent.advancementStrategy,
      history,
      history.length,
    );
  }

  public toSnapshot(): EngineeringSessionStateProjectionSnapshot {
    const history = normalizeHistory(this.advancementHistoryValues);
    const latestEntry = history[history.length - 1];

    if (latestEntry === undefined) {
      throw new KernelError('EngineeringSessionStateProjection history must contain a latest event.');
    }

    return Object.freeze({
      missionId: this.missionIdValue,
      engineeringSessionId: this.engineeringSessionIdValue,
      currentWorkflowStepId: this.currentWorkflowStepIdValue,
      previousWorkflowStepId: this.previousWorkflowStepIdValue,
      latestAdvancementStrategy: this.latestAdvancementStrategyValue,
      advancementHistory: history,
      latestProcessedEventId: latestEntry.eventId,
      latestEventOccurredAt: latestEntry.occurredAt,
      revision: this.revisionValue,
      attribution: Object.freeze({
        missionId: this.missionIdValue,
        engineeringSessionId: this.engineeringSessionIdValue,
      }),
      diagnostics: normalizeDiagnostics({
        consumedEventCount: history.length,
        consumedEventIds: history.map((entry) => entry.eventId),
      }),
    });
  }
}

export function isEngineeringSessionStateProjectionEventType(
  eventType: string,
): eventType is EngineeringSessionStateProjectionEventType {
  return engineeringSessionEventTypes.some((candidate) => candidate === eventType);
}

function normalizeEngineeringSessionWorkflowAdvancedEvent(
  event: EventBusEvent,
): NormalizedEngineeringSessionWorkflowAdvancedEvent {
  if (!isEngineeringSessionStateProjectionEventType(event.eventType)) {
    throw new KernelError(
      `EngineeringSessionStateProjection does not support event type '${event.eventType}'.`,
    );
  }

  const missionId = requireEventMissionId(event);

  if (event.attribution.missionId !== missionId) {
    throw new KernelError(
      `EngineeringSessionStateProjection event '${event.eventId}' missionId must match attribution.missionId.`,
    );
  }

  return {
    eventId: normalizeNonEmptyString(event.eventId, 'EngineeringSessionStateProjection eventId'),
    missionId,
    engineeringSessionId: normalizeEngineeringSessionId(
      readPayloadString(event, 'engineeringSessionId'),
    ),
    previousWorkflowStepId: readPayloadString(event, 'previousWorkflowStepId'),
    newWorkflowStepId: readPayloadString(event, 'newWorkflowStepId'),
    advancementStrategy: readAdvancementStrategy(event),
    occurredAt: normalizeNonEmptyString(event.timestamp, 'EngineeringSessionStateProjection occurredAt'),
    causality: Object.freeze(
      event.causality.map((eventId) =>
        normalizeNonEmptyString(eventId, 'EngineeringSessionStateProjection causality'),
      ),
    ),
    ...(event.correlationId === undefined
      ? {}
      : {
          correlationId: normalizeNonEmptyString(
            event.correlationId,
            'EngineeringSessionStateProjection correlationId',
          ),
        }),
  };
}

function createHistoryEntry(
  event: NormalizedEngineeringSessionWorkflowAdvancedEvent,
): EngineeringSessionAdvancementHistoryEntrySnapshot {
  return Object.freeze({
    eventId: event.eventId,
    missionId: event.missionId,
    engineeringSessionId: event.engineeringSessionId,
    previousWorkflowStepId: event.previousWorkflowStepId,
    newWorkflowStepId: event.newWorkflowStepId,
    advancementStrategy: event.advancementStrategy,
    occurredAt: event.occurredAt,
    causality: Object.freeze([...event.causality]),
    ...(event.correlationId === undefined ? {} : { correlationId: event.correlationId }),
  });
}

function readPayloadString(event: EventBusEvent, key: string): string {
  const value = event.payload[key];

  if (typeof value !== 'string') {
    throw new KernelError(
      `EngineeringSessionStateProjection event '${event.eventType}' requires string payload '${key}'.`,
    );
  }

  return normalizeNonEmptyString(value, `EngineeringSessionStateProjection payload ${key}`);
}

function readAdvancementStrategy(event: EventBusEvent): EngineeringSessionWorkflowAdvancementStrategy {
  const value = readPayloadString(event, 'strategy');

  return normalizeAdvancementStrategy(value);
}

function normalizeAdvancementStrategy(value: string): EngineeringSessionWorkflowAdvancementStrategy {
  if (!engineeringSessionWorkflowAdvancementStrategies.some((candidate) => candidate === value)) {
    throw new KernelError(
      `EngineeringSessionStateProjection received unsupported advancement strategy '${value}'.`,
    );
  }

  return value as EngineeringSessionWorkflowAdvancementStrategy;
}

function normalizeHistory(
  history: readonly EngineeringSessionAdvancementHistoryEntrySnapshot[],
): readonly EngineeringSessionAdvancementHistoryEntrySnapshot[] {
  return Object.freeze(
    history.map((entry) =>
      Object.freeze({
        eventId: normalizeNonEmptyString(entry.eventId, 'EngineeringSessionStateProjection eventId'),
        missionId: normalizeMissionId(entry.missionId),
        engineeringSessionId: normalizeEngineeringSessionId(entry.engineeringSessionId),
        previousWorkflowStepId: normalizeNonEmptyString(
          entry.previousWorkflowStepId,
          'EngineeringSessionStateProjection previousWorkflowStepId',
        ),
        newWorkflowStepId: normalizeNonEmptyString(
          entry.newWorkflowStepId,
          'EngineeringSessionStateProjection newWorkflowStepId',
        ),
        advancementStrategy: normalizeAdvancementStrategy(entry.advancementStrategy),
        occurredAt: normalizeNonEmptyString(
          entry.occurredAt,
          'EngineeringSessionStateProjection occurredAt',
        ),
        causality: Object.freeze(
          entry.causality.map((eventId) =>
            normalizeNonEmptyString(eventId, 'EngineeringSessionStateProjection causality'),
          ),
        ),
        ...(entry.correlationId === undefined
          ? {}
          : {
              correlationId: normalizeNonEmptyString(
                entry.correlationId,
                'EngineeringSessionStateProjection correlationId',
              ),
            }),
      }),
    ),
  );
}

function normalizeDiagnostics(
  diagnostics: EngineeringSessionStateProjectionDiagnosticsSnapshot,
): EngineeringSessionStateProjectionDiagnosticsSnapshot {
  const consumedEventIds = Object.freeze(
    diagnostics.consumedEventIds.map((eventId) =>
      normalizeNonEmptyString(eventId, 'EngineeringSessionStateProjection consumedEventId'),
    ),
  );

  return Object.freeze({
    consumedEventCount: consumedEventIds.length,
    consumedEventIds,
  });
}

function normalizeMissionId(missionId: string): string {
  return MissionId.fromString(missionId).toString();
}

function requireEventMissionId(event: EventBusEvent): string {
  if (event.missionId === undefined) {
    throw new KernelError(
      `EngineeringSessionStateProjection requires Mission-scoped event '${event.eventType}'.`,
    );
  }

  return normalizeMissionId(event.missionId);
}

function normalizeEngineeringSessionId(engineeringSessionId: string): string {
  return EngineeringSessionId.fromString(engineeringSessionId).toString();
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new KernelError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
