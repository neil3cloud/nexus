import { AdapterId } from '../adapter/adapter-id';
import { RoleId } from '../execution/role-id';
import { EngineeringSessionId } from '../execution/engineering-session-id';
import { ExecutionSessionId } from '../execution/execution-session-id';
import { InvalidPlanningDefinitionError } from './planning.errors';
import type { PlannerAttributionInput, PlannerAttributionSnapshot } from './planning.types';
import { normalizeNonEmptyString } from './proposed-mission-plan-id';

export class PlannerAttribution {
  private constructor(private readonly snapshotValue: PlannerAttributionSnapshot) {
    Object.freeze(this);
  }

  public static create(input: PlannerAttributionInput): PlannerAttribution {
    if (input.actorType === 'Adapter' && input.adapterId === undefined) {
      throw new InvalidPlanningDefinitionError(
        'PlannerAttribution adapterId is required when actorType is Adapter.',
      );
    }

    if (input.actorType === 'Human' && input.adapterId !== undefined) {
      throw new InvalidPlanningDefinitionError(
        'PlannerAttribution adapterId is not valid when actorType is Human.',
      );
    }

    return new PlannerAttribution(
      Object.freeze({
        executionRoleId: RoleId.fromString(input.executionRoleId).toString(),
        actorType: input.actorType,
        actorId: normalizeNonEmptyString(input.actorId, 'PlannerAttribution actorId'),
        ...(input.adapterId === undefined
          ? {}
          : { adapterId: AdapterId.fromString(input.adapterId).toString() }),
        ...(input.engineeringSessionId === undefined
          ? {}
          : { engineeringSessionId: EngineeringSessionId.fromString(input.engineeringSessionId).toString() }),
        ...(input.executionSessionId === undefined
          ? {}
          : { executionSessionId: ExecutionSessionId.fromString(input.executionSessionId).toString() }),
        generatedAt: normalizeNonEmptyString(input.generatedAt, 'PlannerAttribution generatedAt'),
        causality: Object.freeze(
          (input.causality ?? []).map((value) =>
            normalizeNonEmptyString(value, 'PlannerAttribution causality'),
          ),
        ),
        ...(input.correlationId === undefined
          ? {}
          : {
              correlationId: normalizeNonEmptyString(
                input.correlationId,
                'PlannerAttribution correlationId',
              ),
            }),
      }),
    );
  }

  public static fromSnapshot(snapshot: PlannerAttributionSnapshot): PlannerAttribution {
    return PlannerAttribution.create(snapshot);
  }

  public toSnapshot(): PlannerAttributionSnapshot {
    return Object.freeze({
      ...this.snapshotValue,
      causality: Object.freeze([...this.snapshotValue.causality]),
    });
  }
}
