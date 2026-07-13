import type { MissionDomainEvent } from './mission.events';
import { createMissionCreatedEvent, createMissionLifecycleEvent } from './mission.events';
import {
  MissionCompletionRejectedError,
  MissionExecutionValidationError,
  MissionLifecycleTransitionError,
} from './mission.errors';
import { MissionId } from './mission-id';
import { MissionObjective } from './mission-objective';
import type { TaskSnapshot } from './mission-planning.types';
import type { DomainEventMetadata, MissionSnapshot, MissionStatus } from './mission.types';

const lifecycleEventsByTarget = {
  Planned: 'MissionPlanned',
  Ready: 'MissionReady',
  Executing: 'MissionStarted',
  Reviewing: 'MissionReviewed',
  Completed: 'MissionCompleted',
  Cancelled: 'MissionCancelled',
  Failed: 'MissionFailed',
} as const;

type LifecycleEventTarget = keyof typeof lifecycleEventsByTarget;

export class Mission {
  private readonly recordedEvents: MissionDomainEvent[] = [];

  private constructor(
    private readonly missionId: MissionId,
    private readonly missionObjective: MissionObjective,
    private statusValue: MissionStatus,
    private latestEventId: string,
  ) {}

  public static create(
    missionId: MissionId,
    missionObjective: MissionObjective,
    metadata: DomainEventMetadata,
  ): Mission {
    const mission = new Mission(missionId, missionObjective, 'Draft', metadata.eventId);

    mission.recordedEvents.push(createMissionCreatedEvent(missionId, missionObjective, metadata));

    return mission;
  }

  public static fromSnapshot(snapshot: MissionSnapshot): Mission {
    return new Mission(
      MissionId.fromString(snapshot.id),
      MissionObjective.fromString(snapshot.objective),
      snapshot.status,
      snapshot.latestEventId,
    );
  }

  public get id(): MissionId {
    return this.missionId;
  }

  public get objective(): MissionObjective {
    return this.missionObjective;
  }

  public get status(): MissionStatus {
    return this.statusValue;
  }

  public plan(metadata: DomainEventMetadata): void {
    this.transitionTo('Planned', metadata);
  }

  public markReady(metadata: DomainEventMetadata): void {
    this.transitionTo('Ready', metadata);
  }

  public start(metadata: DomainEventMetadata): void {
    this.transitionTo('Executing', metadata);
  }

  public review(metadata: DomainEventMetadata): void {
    this.transitionTo('Reviewing', metadata);
  }

  public resume(metadata: DomainEventMetadata): void {
    this.transitionTo('Executing', metadata);
  }

  public complete(metadata: DomainEventMetadata, tasks: readonly TaskSnapshot[]): void {
    this.assertCompletionPermitted(tasks);
    this.transitionTo('Completed', metadata);
  }

  public cancel(metadata: DomainEventMetadata): void {
    this.transitionTo('Cancelled', metadata);
  }

  public fail(metadata: DomainEventMetadata): void {
    this.transitionTo('Failed', metadata);
  }

  public assertTaskExecutionPermitted(): void {
    if (this.statusValue !== 'Executing') {
      throw new MissionExecutionValidationError(
        `Mission '${this.missionId.toString()}' must be Executing before executing Tasks; current status is '${this.statusValue}'.`,
      );
    }
  }

  public assertCompletionPermitted(tasks: readonly TaskSnapshot[]): void {
    if (this.statusValue !== 'Reviewing') {
      throw new MissionCompletionRejectedError(
        `Mission '${this.missionId.toString()}' cannot complete from status '${this.statusValue}'.`,
      );
    }

    if (tasks.length === 0) {
      throw new MissionCompletionRejectedError(
        `Mission '${this.missionId.toString()}' cannot complete without Tasks.`,
      );
    }

    const incompleteTask = tasks.find((task) => task.status !== 'Completed');

    if (incompleteTask !== undefined) {
      throw new MissionCompletionRejectedError(
        `Mission '${this.missionId.toString()}' cannot complete because Task '${incompleteTask.id}' is '${incompleteTask.status}'.`,
      );
    }
  }

  public pullDomainEvents(): readonly MissionDomainEvent[] {
    const events = [...this.recordedEvents];

    this.recordedEvents.length = 0;

    return events;
  }

  public toSnapshot(): MissionSnapshot {
    return {
      id: this.missionId.toString(),
      objective: this.missionObjective.toString(),
      status: this.statusValue,
      latestEventId: this.latestEventId,
    };
  }

  private transitionTo(target: LifecycleEventTarget, metadata: DomainEventMetadata): void {
    if (!isValidTransition(this.statusValue, target)) {
      throw new MissionLifecycleTransitionError(this.statusValue, target);
    }

    const eventType =
      this.statusValue === 'Reviewing' && target === 'Executing'
        ? 'MissionResumed'
        : lifecycleEventsByTarget[target];
    const event = createMissionLifecycleEvent(eventType, this.missionId, {
      ...metadata,
      causality: [this.latestEventId],
    });

    this.statusValue = target;
    this.latestEventId = event.eventId;
    this.recordedEvents.push(event);
  }
}

function isValidTransition(from: MissionStatus, to: MissionStatus): boolean {
  if (from === 'Draft') {
    return to === 'Planned' || to === 'Cancelled';
  }

  if (from === 'Planned') {
    return to === 'Ready' || to === 'Cancelled';
  }

  if (from === 'Ready') {
    return to === 'Executing' || to === 'Cancelled';
  }

  if (from === 'Executing') {
    return to === 'Reviewing' || to === 'Failed' || to === 'Cancelled';
  }

  if (from === 'Reviewing') {
    return to === 'Completed' || to === 'Executing' || to === 'Cancelled';
  }

  return false;
}
