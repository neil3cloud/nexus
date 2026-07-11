import { describe, expect, it } from 'vitest';

import { Mission } from '../../../src/kernel/mission/mission.aggregate';
import { MissionLifecycleTransitionError } from '../../../src/kernel/mission/mission.errors';
import { missionEventTypes } from '../../../src/kernel/mission/mission.events';
import { MissionId } from '../../../src/kernel/mission/mission-id';
import { MissionObjective } from '../../../src/kernel/mission/mission-objective';
import type { DomainEventMetadata } from '../../../src/kernel/mission/mission.types';

const timestamp = '2026-07-12T00:00:00.000Z';

function metadata(eventId: string): DomainEventMetadata {
  return {
    eventId,
    timestamp,
  };
}

function createMission(): Mission {
  return Mission.create(
    MissionId.fromString('mission-1'),
    MissionObjective.fromString('Implement Mission Foundation'),
    metadata('event-created'),
  );
}

describe('Mission aggregate', () => {
  it('creates a Draft Mission with immutable identity and objective', () => {
    const missionId = MissionId.fromString(' mission-1 ');
    const objective = MissionObjective.fromString(' Implement Mission Foundation ');
    const mission = Mission.create(missionId, objective, metadata('event-created'));

    expect(mission.id).toBe(missionId);
    expect(mission.objective).toBe(objective);
    expect(Object.isFrozen(mission.id)).toBe(true);
    expect(Object.isFrozen(mission.objective)).toBe(true);
    expect(mission.toSnapshot()).toEqual({
      id: 'mission-1',
      objective: 'Implement Mission Foundation',
      status: 'Draft',
      latestEventId: 'event-created',
    });
    expect(mission.pullDomainEvents()).toEqual([
      {
        eventId: 'event-created',
        missionId: 'mission-1',
        eventType: 'MissionCreated',
        timestamp,
        causality: [],
        attribution: {
          missionId: 'mission-1',
        },
        payload: {
          missionId: 'mission-1',
          objective: 'Implement Mission Foundation',
        },
      },
    ]);
  });

  it('supports MissionId equality and serialization', () => {
    const missionId = MissionId.fromString('mission-1');

    expect(missionId.equals(MissionId.fromString('mission-1'))).toBe(true);
    expect(missionId.equals(MissionId.fromString('mission-2'))).toBe(false);
    expect(missionId.toString()).toBe('mission-1');
    expect(JSON.stringify({ missionId })).toBe('{"missionId":"mission-1"}');
  });

  it('supports MissionObjective equality and serialization', () => {
    const objective = MissionObjective.fromString('Implement Mission Foundation');

    expect(objective.equals(MissionObjective.fromString('Implement Mission Foundation'))).toBe(
      true,
    );
    expect(objective.equals(MissionObjective.fromString('Implement Mission Planning'))).toBe(
      false,
    );
    expect(objective.toString()).toBe('Implement Mission Foundation');
    expect(JSON.stringify({ objective })).toBe(
      '{"objective":"Implement Mission Foundation"}',
    );
  });

  it('rejects empty identity and objective values', () => {
    expect(() => MissionId.fromString(' ')).toThrow('Mission identity must be a non-empty string.');
    expect(() => MissionObjective.fromString(' ')).toThrow(
      'Mission objective must be a non-empty string.',
    );
  });

  it('enforces the RFC-0001 successful lifecycle path with causality chaining', () => {
    const mission = createMission();

    mission.pullDomainEvents();
    mission.plan(metadata('event-planned'));
    mission.markReady(metadata('event-ready'));
    mission.start(metadata('event-started'));
    mission.review(metadata('event-reviewed'));
    mission.complete(metadata('event-completed'));

    expect(mission.status).toBe('Completed');
    expect(
      mission.pullDomainEvents().map((event) => ({
        eventId: event.eventId,
        eventType: event.eventType,
        causality: event.causality,
      })),
    ).toEqual([
      {
        eventId: 'event-planned',
        eventType: 'MissionPlanned',
        causality: ['event-created'],
      },
      {
        eventId: 'event-ready',
        eventType: 'MissionReady',
        causality: ['event-planned'],
      },
      {
        eventId: 'event-started',
        eventType: 'MissionStarted',
        causality: ['event-ready'],
      },
      {
        eventId: 'event-reviewed',
        eventType: 'MissionReviewed',
        causality: ['event-started'],
      },
      {
        eventId: 'event-completed',
        eventType: 'MissionCompleted',
        causality: ['event-reviewed'],
      },
    ]);
  });

  it('preserves latest event causality after rehydrating from a snapshot', () => {
    const mission = createMission();

    mission.pullDomainEvents();
    mission.plan(metadata('event-planned'));

    const rehydrated = Mission.fromSnapshot(mission.toSnapshot());

    rehydrated.markReady(metadata('event-ready'));

    expect(rehydrated.pullDomainEvents().map((event) => event.causality)).toEqual([
      ['event-planned'],
    ]);
  });

  it('allows Reviewing to return to Executing through the canonical MissionResumed event', () => {
    const mission = createMission();

    mission.pullDomainEvents();
    mission.plan(metadata('event-planned'));
    mission.markReady(metadata('event-ready'));
    mission.start(metadata('event-started'));
    mission.review(metadata('event-reviewed'));
    mission.resume(metadata('event-resumed'));

    expect(mission.status).toBe('Executing');
    expect(mission.pullDomainEvents().map((event) => event.eventType)).toContain(
      'MissionResumed',
    );
  });

  it('supports failure and cancellation from non-terminal RFC-0001 states only', () => {
    const cancellableMission = createMission();
    const failableMission = createMission();

    cancellableMission.cancel(metadata('event-cancelled'));
    failableMission.pullDomainEvents();
    failableMission.plan(metadata('event-planned'));
    failableMission.markReady(metadata('event-ready'));
    failableMission.start(metadata('event-started'));
    failableMission.fail(metadata('event-failed'));

    expect(cancellableMission.status).toBe('Cancelled');
    expect(failableMission.status).toBe('Failed');
    expect(cancellableMission.pullDomainEvents().map((event) => event.eventType)).toContain(
      'MissionCancelled',
    );
    expect(failableMission.pullDomainEvents().map((event) => event.eventType)).toContain(
      'MissionFailed',
    );
  });

  it('rejects lifecycle transitions not defined by RFC-0001', () => {
    const mission = createMission();

    expect(() => mission.complete(metadata('event-completed'))).toThrow(
      MissionLifecycleTransitionError,
    );
    expect(mission.status).toBe('Draft');
  });

  it('preserves terminal lifecycle states', () => {
    const mission = createMission();

    mission.cancel(metadata('event-cancelled'));

    expect(() => mission.start(metadata('event-started'))).toThrow(
      MissionLifecycleTransitionError,
    );
    expect(() => mission.cancel(metadata('event-cancelled-again'))).toThrow(
      MissionLifecycleTransitionError,
    );
    expect(mission.status).toBe('Cancelled');
  });

  it('exposes only the RFC-0001 Mission event catalog', () => {
    expect(missionEventTypes).toEqual([
      'MissionCreated',
      'MissionPlanned',
      'MissionReady',
      'MissionStarted',
      'MissionPaused',
      'MissionResumed',
      'MissionPlanRevised',
      'TaskAdded',
      'TaskCompleted',
      'TaskRemoved',
      'MissionReviewed',
      'MissionCompleted',
      'MissionCancelled',
      'MissionFailed',
    ]);
  });
});
