import type { EventBusEvent } from '../common/event-bus-contract';
import { KernelError } from '../common/kernel-error';
import { recoveryRequirementStatuses } from '../execution/recovery-requirement.types';
import type { RecoveryRequirementStatus } from '../execution/recovery-requirement.types';
import { MissionId } from '../mission/mission-id';
import { governanceDecisionValues } from './governance.types';
import type { GovernanceDecisionValue } from './governance.types';
import type {
  GovernanceStateProjectionDecisionSnapshot,
  GovernanceStateProjectionDiagnosticsSnapshot,
  GovernanceStateProjectionRecoveryRequirementSnapshot,
  GovernanceStateProjectionSnapshot,
} from './governance-state-projection.types';

const governanceStateProjectionEventTypes = [
  'GovernanceDecisionRecorded',
  'RecoveryRequirementCreated',
  'RecoveryRequirementResolved',
  'RecoveryRequirementWithdrawn',
] as const;

type GovernanceStateProjectionEventType = (typeof governanceStateProjectionEventTypes)[number];

export class GovernanceStateProjection {
  private constructor(
    private readonly missionIdValue: string,
    private readonly latestGovernanceDecisionValue:
      | GovernanceStateProjectionDecisionSnapshot
      | undefined,
    private readonly recoveryRequirementValues:
      readonly GovernanceStateProjectionRecoveryRequirementSnapshot[],
    private readonly diagnosticsValue: GovernanceStateProjectionDiagnosticsSnapshot,
  ) {
    Object.freeze(this);
  }

  public static empty(missionId: string): GovernanceStateProjection {
    return new GovernanceStateProjection(
      MissionId.fromString(missionId).toString(),
      undefined,
      Object.freeze([]),
      Object.freeze({
        consumedEventCount: 0,
        consumedEventIds: Object.freeze([]),
      }),
    );
  }

  public static fromSnapshot(snapshot: GovernanceStateProjectionSnapshot): GovernanceStateProjection {
    return new GovernanceStateProjection(
      MissionId.fromString(snapshot.missionId).toString(),
      snapshot.latestGovernanceDecision === undefined
        ? undefined
        : normalizeDecision(snapshot.latestGovernanceDecision),
      normalizeRecoveryRequirements(snapshot.recoveryRequirements),
      normalizeDiagnostics(snapshot.diagnostics),
    );
  }

  public get missionId(): string {
    return this.missionIdValue;
  }

  public apply(event: EventBusEvent): GovernanceStateProjection {
    if (!isGovernanceStateProjectionEventType(event.eventType)) {
      return this;
    }

    assertMissionScopedEvent(event, this.missionIdValue);

    if (this.diagnosticsValue.consumedEventIds.includes(event.eventId)) {
      return this;
    }

    if (event.eventType === 'GovernanceDecisionRecorded') {
      return this.recordGovernanceDecision(event);
    }

    return this.recordRecoveryRequirement(event);
  }

  public toSnapshot(): GovernanceStateProjectionSnapshot {
    const recoveryRequirements = normalizeRecoveryRequirements(this.recoveryRequirementValues);
    const unresolvedRecoveryRequirements = Object.freeze(
      recoveryRequirements.filter((requirement) => requirement.status === 'Open'),
    );
    const latestGovernanceDecision =
      this.latestGovernanceDecisionValue === undefined
        ? undefined
        : normalizeDecision(this.latestGovernanceDecisionValue);

    return Object.freeze({
      missionId: this.missionIdValue,
      ...(latestGovernanceDecision === undefined ? {} : { latestGovernanceDecision }),
      recoveryRequirements,
      unresolvedRecoveryRequirements,
      isBlocking: isProjectionBlocking(latestGovernanceDecision, recoveryRequirements),
      hasEscalationRequired: latestGovernanceDecision?.outcome === 'Escalation Required',
      attribution: Object.freeze({
        missionId: this.missionIdValue,
      }),
      diagnostics: normalizeDiagnostics(this.diagnosticsValue),
    });
  }

  private recordGovernanceDecision(event: EventBusEvent): GovernanceStateProjection {
    const decision: GovernanceStateProjectionDecisionSnapshot = Object.freeze({
      governanceDecisionId: readPayloadString(event, 'governanceDecisionId'),
      outcome: readGovernanceDecisionValue(event),
      repositoryPolicyId: readPayloadString(event, 'repositoryPolicyId'),
      repositoryPolicyVersion: readPayloadNumber(event, 'repositoryPolicyVersion'),
      reviewId: readPayloadString(event, 'reviewId'),
      policyEvaluationId: readPayloadString(event, 'policyEvaluationId'),
      evaluationKey: readPayloadString(event, 'evaluationKey'),
      explanationCodes: readPayloadStringArray(event, 'explanationCodes'),
      recordedAt: normalizeNonEmptyString(event.timestamp, 'GovernanceStateProjection recordedAt'),
      eventId: normalizeNonEmptyString(event.eventId, 'GovernanceStateProjection eventId'),
      ...optionalPayloadString(event, 'governanceEscalationId'),
    });

    return new GovernanceStateProjection(
      this.missionIdValue,
      decision,
      this.recoveryRequirementValues,
      this.recordEvent(event),
    );
  }

  private recordRecoveryRequirement(event: EventBusEvent): GovernanceStateProjection {
    const recoveryRequirementId = readPayloadString(event, 'recoveryRequirementId');
    const status = readRecoveryRequirementStatus(event);
    const existingRequirement = this.recoveryRequirementValues.find(
      (requirement) => requirement.recoveryRequirementId === recoveryRequirementId,
    );
    const updatedRequirement = normalizeRecoveryRequirement({
      recoveryRequirementId,
      governanceDecisionId: readPayloadString(event, 'governanceDecisionId'),
      status,
      createdAt:
        existingRequirement?.createdAt ??
        readPayloadString(event, 'createdAt'),
      lastUpdatedAt: normalizeNonEmptyString(event.timestamp, 'GovernanceStateProjection lastUpdatedAt'),
      lastEventId: normalizeNonEmptyString(event.eventId, 'GovernanceStateProjection lastEventId'),
      ...(status === 'Resolved' ? { resolvedAt: readPayloadString(event, 'resolvedAt') } : {}),
      ...(status === 'Withdrawn' ? { withdrawnAt: readPayloadString(event, 'withdrawnAt') } : {}),
    });
    const recoveryRequirements = this.recoveryRequirementValues.filter(
      (requirement) => requirement.recoveryRequirementId !== recoveryRequirementId,
    );

    return new GovernanceStateProjection(
      this.missionIdValue,
      this.latestGovernanceDecisionValue,
      normalizeRecoveryRequirements([...recoveryRequirements, updatedRequirement]),
      this.recordEvent(event),
    );
  }

  private recordEvent(event: EventBusEvent): GovernanceStateProjectionDiagnosticsSnapshot {
    const consumedEventIds = Object.freeze([...this.diagnosticsValue.consumedEventIds, event.eventId]);

    return Object.freeze({
      consumedEventCount: consumedEventIds.length,
      consumedEventIds,
      lastEventId: normalizeNonEmptyString(event.eventId, 'GovernanceStateProjection lastEventId'),
      lastUpdatedAt: normalizeNonEmptyString(event.timestamp, 'GovernanceStateProjection lastUpdatedAt'),
    });
  }
}

export function isGovernanceStateProjectionEventType(
  eventType: string,
): eventType is GovernanceStateProjectionEventType {
  return governanceStateProjectionEventTypes.some((candidate) => candidate === eventType);
}

function isProjectionBlocking(
  latestGovernanceDecision: GovernanceStateProjectionDecisionSnapshot | undefined,
  recoveryRequirements: readonly GovernanceStateProjectionRecoveryRequirementSnapshot[],
): boolean {
  if (recoveryRequirements.some((requirement) => requirement.status === 'Open')) {
    return true;
  }

  if (latestGovernanceDecision === undefined || latestGovernanceDecision.outcome === 'Approved') {
    return false;
  }

  if (
    latestGovernanceDecision.outcome === 'Deferred' ||
    latestGovernanceDecision.outcome === 'Escalation Required'
  ) {
    return true;
  }

  const requirementsForDecision = recoveryRequirements.filter(
    (requirement) =>
      requirement.governanceDecisionId === latestGovernanceDecision.governanceDecisionId,
  );

  return (
    requirementsForDecision.length === 0 ||
    requirementsForDecision.some((requirement) => requirement.status !== 'Resolved')
  );
}

function assertMissionScopedEvent(event: EventBusEvent, missionId: string): void {
  if (event.missionId !== missionId) {
    throw new KernelError(
      `GovernanceStateProjection for Mission '${missionId}' cannot consume event '${event.eventId}' from Mission '${event.missionId}'.`,
    );
  }
}

function readGovernanceDecisionValue(event: EventBusEvent): GovernanceDecisionValue {
  const value = readPayloadString(event, 'governanceDecisionValue');

  if (!governanceDecisionValues.some((candidate) => candidate === value)) {
    throw new KernelError(`GovernanceStateProjection received unsupported GovernanceDecision '${value}'.`);
  }

  return value as GovernanceDecisionValue;
}

function readRecoveryRequirementStatus(event: EventBusEvent): RecoveryRequirementStatus {
  const value = readPayloadString(event, 'recoveryRequirementStatus');

  if (!recoveryRequirementStatuses.some((candidate) => candidate === value)) {
    throw new KernelError(`GovernanceStateProjection received unsupported RecoveryRequirement status '${value}'.`);
  }

  return value as RecoveryRequirementStatus;
}

function readPayloadString(event: EventBusEvent, key: string): string {
  const value = event.payload[key];

  if (typeof value !== 'string') {
    throw new KernelError(
      `GovernanceStateProjection event '${event.eventType}' requires string payload '${key}'.`,
    );
  }

  return normalizeNonEmptyString(value, `GovernanceStateProjection payload ${key}`);
}

function readPayloadNumber(event: EventBusEvent, key: string): number {
  const value = event.payload[key];

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new KernelError(
      `GovernanceStateProjection event '${event.eventType}' requires numeric payload '${key}'.`,
    );
  }

  return value;
}

function readPayloadStringArray(event: EventBusEvent, key: string): readonly string[] {
  const value = event.payload[key];

  if (!Array.isArray(value)) {
    throw new KernelError(
      `GovernanceStateProjection event '${event.eventType}' requires string array payload '${key}'.`,
    );
  }

  return Object.freeze(
    value.map((item, index) => {
      if (typeof item !== 'string') {
        throw new KernelError(
          `GovernanceStateProjection event '${event.eventType}' requires string payload '${key}[${index}]'.`,
        );
      }

      return normalizeNonEmptyString(item, `GovernanceStateProjection payload ${key}[${index}]`);
    }),
  );
}

function optionalPayloadString(event: EventBusEvent, key: string): { readonly [key: string]: string } {
  const value = event.payload[key];

  if (value === undefined) {
    return {};
  }

  if (typeof value !== 'string') {
    throw new KernelError(
      `GovernanceStateProjection event '${event.eventType}' requires string payload '${key}'.`,
    );
  }

  return {
    [key]: normalizeNonEmptyString(value, `GovernanceStateProjection payload ${key}`),
  };
}

function normalizeDecision(
  decision: GovernanceStateProjectionDecisionSnapshot,
): GovernanceStateProjectionDecisionSnapshot {
  return Object.freeze({
    governanceDecisionId: normalizeNonEmptyString(
      decision.governanceDecisionId,
      'GovernanceStateProjection governanceDecisionId',
    ),
    outcome: normalizeGovernanceDecisionValue(decision.outcome),
    repositoryPolicyId: normalizeNonEmptyString(
      decision.repositoryPolicyId,
      'GovernanceStateProjection repositoryPolicyId',
    ),
    repositoryPolicyVersion: decision.repositoryPolicyVersion,
    reviewId: normalizeNonEmptyString(decision.reviewId, 'GovernanceStateProjection reviewId'),
    policyEvaluationId: normalizeNonEmptyString(
      decision.policyEvaluationId,
      'GovernanceStateProjection policyEvaluationId',
    ),
    evaluationKey: normalizeNonEmptyString(
      decision.evaluationKey,
      'GovernanceStateProjection evaluationKey',
    ),
    explanationCodes: Object.freeze(
      decision.explanationCodes.map((code) =>
        normalizeNonEmptyString(code, 'GovernanceStateProjection explanationCode'),
      ),
    ),
    recordedAt: normalizeNonEmptyString(decision.recordedAt, 'GovernanceStateProjection recordedAt'),
    eventId: normalizeNonEmptyString(decision.eventId, 'GovernanceStateProjection eventId'),
    ...(decision.governanceEscalationId === undefined
      ? {}
      : {
          governanceEscalationId: normalizeNonEmptyString(
            decision.governanceEscalationId,
            'GovernanceStateProjection governanceEscalationId',
          ),
        }),
  });
}

function normalizeGovernanceDecisionValue(value: string): GovernanceDecisionValue {
  if (!governanceDecisionValues.some((candidate) => candidate === value)) {
    throw new KernelError(`GovernanceStateProjection GovernanceDecision '${value}' is not valid.`);
  }

  return value as GovernanceDecisionValue;
}

function normalizeRecoveryRequirements(
  requirements: readonly GovernanceStateProjectionRecoveryRequirementSnapshot[],
): readonly GovernanceStateProjectionRecoveryRequirementSnapshot[] {
  return Object.freeze(
    [...requirements]
      .map(normalizeRecoveryRequirement)
      .sort((left, right) => left.recoveryRequirementId.localeCompare(right.recoveryRequirementId)),
  );
}

function normalizeRecoveryRequirement(
  requirement: GovernanceStateProjectionRecoveryRequirementSnapshot,
): GovernanceStateProjectionRecoveryRequirementSnapshot {
  return Object.freeze({
    recoveryRequirementId: normalizeNonEmptyString(
      requirement.recoveryRequirementId,
      'GovernanceStateProjection recoveryRequirementId',
    ),
    governanceDecisionId: normalizeNonEmptyString(
      requirement.governanceDecisionId,
      'GovernanceStateProjection recoveryRequirement governanceDecisionId',
    ),
    status: normalizeRecoveryRequirementStatus(requirement.status),
    createdAt: normalizeNonEmptyString(requirement.createdAt, 'GovernanceStateProjection createdAt'),
    lastUpdatedAt: normalizeNonEmptyString(
      requirement.lastUpdatedAt,
      'GovernanceStateProjection lastUpdatedAt',
    ),
    lastEventId: normalizeNonEmptyString(requirement.lastEventId, 'GovernanceStateProjection lastEventId'),
    ...(requirement.resolvedAt === undefined
      ? {}
      : {
          resolvedAt: normalizeNonEmptyString(
            requirement.resolvedAt,
            'GovernanceStateProjection resolvedAt',
          ),
        }),
    ...(requirement.withdrawnAt === undefined
      ? {}
      : {
          withdrawnAt: normalizeNonEmptyString(
            requirement.withdrawnAt,
            'GovernanceStateProjection withdrawnAt',
          ),
        }),
  });
}

function normalizeRecoveryRequirementStatus(value: string): RecoveryRequirementStatus {
  if (!recoveryRequirementStatuses.some((candidate) => candidate === value)) {
    throw new KernelError(`GovernanceStateProjection RecoveryRequirement status '${value}' is not valid.`);
  }

  return value as RecoveryRequirementStatus;
}

function normalizeDiagnostics(
  diagnostics: GovernanceStateProjectionDiagnosticsSnapshot,
): GovernanceStateProjectionDiagnosticsSnapshot {
  return Object.freeze({
    consumedEventCount: diagnostics.consumedEventIds.length,
    consumedEventIds: Object.freeze(
      diagnostics.consumedEventIds.map((eventId) =>
        normalizeNonEmptyString(eventId, 'GovernanceStateProjection consumedEventId'),
      ),
    ),
    ...(diagnostics.lastEventId === undefined
      ? {}
      : {
          lastEventId: normalizeNonEmptyString(
            diagnostics.lastEventId,
            'GovernanceStateProjection lastEventId',
          ),
        }),
    ...(diagnostics.lastUpdatedAt === undefined
      ? {}
      : {
          lastUpdatedAt: normalizeNonEmptyString(
            diagnostics.lastUpdatedAt,
            'GovernanceStateProjection lastUpdatedAt',
          ),
        }),
  });
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new KernelError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
