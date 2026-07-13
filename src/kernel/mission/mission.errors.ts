import { KernelError } from '../common/kernel-error';
import type { TaskStatus } from './mission-planning.types';
import type { MissionStatus } from './mission.types';

export class MissionDomainError extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'MissionDomainError';
  }
}

export class MissionIdentityError extends MissionDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'MissionIdentityError';
  }
}

export class MissionObjectiveError extends MissionDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'MissionObjectiveError';
  }
}

export class MissionLifecycleTransitionError extends MissionDomainError {
  public constructor(from: MissionStatus, to: MissionStatus) {
    super(`Mission lifecycle transition '${from}' -> '${to}' is not defined by RFC-0001.`);
    this.name = 'MissionLifecycleTransitionError';
  }
}

export class MissionAlreadyExistsError extends MissionDomainError {
  public constructor(missionId: string) {
    super(`Mission '${missionId}' already exists.`);
    this.name = 'MissionAlreadyExistsError';
  }
}

export class MissionNotFoundError extends MissionDomainError {
  public constructor(missionId: string) {
    super(`Mission '${missionId}' was not found.`);
    this.name = 'MissionNotFoundError';
  }
}

export class MissionEventPublisherUnavailableError extends MissionDomainError {
  public constructor() {
    super('MissionService requires an EventBusContract to publish Mission domain events.');
    this.name = 'MissionEventPublisherUnavailableError';
  }
}

export class MissionPlanningEventPublisherUnavailableError extends MissionDomainError {
  public constructor() {
    super('MissionPlanningService requires an EventBusContract to publish MissionPlan and Task domain events.');
    this.name = 'MissionPlanningEventPublisherUnavailableError';
  }
}

export class MissionPlanningValidationError extends MissionDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'MissionPlanningValidationError';
  }
}

export class MissionPlanAlreadyExistsError extends MissionDomainError {
  public constructor(missionPlanId: string) {
    super(`MissionPlan '${missionPlanId}' already exists.`);
    this.name = 'MissionPlanAlreadyExistsError';
  }
}

export class MissionAlreadyPlannedError extends MissionDomainError {
  public constructor(missionId: string, missionPlanId: string) {
    super(`Mission '${missionId}' already owns MissionPlan '${missionPlanId}'.`);
    this.name = 'MissionAlreadyPlannedError';
  }
}

export class MissionPlanNotFoundError extends MissionDomainError {
  public constructor(missionPlanId: string) {
    super(`MissionPlan '${missionPlanId}' was not found.`);
    this.name = 'MissionPlanNotFoundError';
  }
}

export class MissionPlanningTerminalMissionError extends MissionDomainError {
  public constructor(missionId: string, status: MissionStatus) {
    super(`Mission '${missionId}' is terminal with status '${status}' and cannot be planned.`);
    this.name = 'MissionPlanningTerminalMissionError';
  }
}

export class MissionExecutionValidationError extends MissionDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'MissionExecutionValidationError';
  }
}

export class MissionCompletionRejectedError extends MissionDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'MissionCompletionRejectedError';
  }
}

export class TaskNotFoundError extends MissionDomainError {
  public constructor(taskId: string) {
    super(`Task '${taskId}' was not found.`);
    this.name = 'TaskNotFoundError';
  }
}

export class TaskLifecycleTransitionError extends MissionDomainError {
  public constructor(from: TaskStatus, to: TaskStatus) {
    super(`Task status transition '${from}' -> '${to}' is not valid.`);
    this.name = 'TaskLifecycleTransitionError';
  }
}
