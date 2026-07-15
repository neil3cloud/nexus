import { GovernanceDecisionId } from './governance-decision-id';
import {
  InvalidGovernanceDecisionDefinitionError,
} from './governance.errors';
import { PolicyEvaluationId } from './policy-evaluation-id';
import type {
  GovernanceDecisionSnapshot,
  GovernanceDecisionValue,
  GovernanceEscalationReasonCode,
  GovernanceEscalationSnapshot,
  PolicyCriterionResultSnapshot,
  PolicyCriterionResultStatusValue,
  PolicyEvaluationSnapshot,
} from './governance.types';
import {
  governanceDecisionValues,
  governanceEscalationReasonCodes,
  policyCriterionResultStatuses,
} from './governance.types';

export interface PolicyCriterionResultInput {
  readonly policyCriterionId: string;
  readonly predicateKind: string;
  readonly predicateSchemaVersion: string;
  readonly status: PolicyCriterionResultStatusValue;
  readonly reviewOutcome?: string;
  readonly findingReferences?: readonly string[];
  readonly explanationCode: string;
}

export interface GovernanceEscalationInput {
  readonly id: string;
  readonly reasonCode: GovernanceEscalationReasonCode;
  readonly repositoryPolicyId: string;
  readonly repositoryPolicyVersion: number;
  readonly reviewId: string;
  readonly reviewStateReference?: string;
  readonly policyCriterionIds?: readonly string[];
  readonly inputReferences?: readonly string[];
  readonly requiredAuthority: string;
}

export interface PolicyEvaluationInput {
  readonly id: string;
  readonly repositoryPolicyId: string;
  readonly repositoryPolicyVersion: number;
  readonly reviewId: string;
  readonly reviewStateReference: string;
  readonly criterionResults: readonly PolicyCriterionResult[];
  readonly evaluationContractVersion: string;
  readonly evaluationKey: string;
  readonly evaluatedAt: string;
  readonly governanceDecisionId: string;
}

export interface GovernanceDecisionInput {
  readonly id: string;
  readonly value: GovernanceDecisionValue;
  readonly repositoryPolicyId: string;
  readonly repositoryPolicyVersion: number;
  readonly reviewId: string;
  readonly reviewStateReference: string;
  readonly policyEvaluationId: string;
  readonly evaluationKey: string;
  readonly criterionResults: readonly PolicyCriterionResult[];
  readonly evaluatedAt: string;
  readonly explanationCodes: readonly string[];
  readonly escalation?: GovernanceEscalation;
}

export class PolicyCriterionResult {
  private constructor(private readonly snapshotValue: PolicyCriterionResultSnapshot) {
    Object.freeze(this);
  }

  public static create(input: PolicyCriterionResultInput): PolicyCriterionResult {
    return new PolicyCriterionResult(
      Object.freeze({
        policyCriterionId: normalizeNonEmptyString(
          input.policyCriterionId,
          'PolicyCriterionResult policyCriterionId',
        ),
        predicateKind: normalizeNonEmptyString(
          input.predicateKind,
          'PolicyCriterionResult predicateKind',
        ),
        predicateSchemaVersion: normalizeNonEmptyString(
          input.predicateSchemaVersion,
          'PolicyCriterionResult predicateSchemaVersion',
        ),
        status: normalizeAllowed(
          input.status,
          policyCriterionResultStatuses,
          'PolicyCriterionResult status',
        ),
        ...(input.reviewOutcome === undefined
          ? {}
          : {
              reviewOutcome: normalizeNonEmptyString(
                input.reviewOutcome,
                'PolicyCriterionResult reviewOutcome',
              ),
            }),
        findingReferences: normalizeStringList(
          input.findingReferences ?? [],
          'PolicyCriterionResult findingReferences',
        ),
        explanationCode: normalizeNonEmptyString(
          input.explanationCode,
          'PolicyCriterionResult explanationCode',
        ),
      }) as PolicyCriterionResultSnapshot,
    );
  }

  public static fromSnapshot(snapshot: PolicyCriterionResultSnapshot): PolicyCriterionResult {
    return PolicyCriterionResult.create(snapshot);
  }

  public get status(): PolicyCriterionResultStatusValue {
    return this.snapshotValue.status;
  }

  public get explanationCode(): string {
    return this.snapshotValue.explanationCode;
  }

  public toSnapshot(): PolicyCriterionResultSnapshot {
    return Object.freeze({
      ...this.snapshotValue,
      findingReferences: Object.freeze([...this.snapshotValue.findingReferences]),
    });
  }
}

export class GovernanceEscalation {
  private constructor(private readonly snapshotValue: GovernanceEscalationSnapshot) {
    Object.freeze(this);
  }

  public static create(input: GovernanceEscalationInput): GovernanceEscalation {
    return new GovernanceEscalation(
      Object.freeze({
        id: normalizeNonEmptyString(input.id, 'GovernanceEscalation id'),
        reasonCode: normalizeAllowed(
          input.reasonCode,
          governanceEscalationReasonCodes,
          'GovernanceEscalation reasonCode',
        ),
        repositoryPolicyId: normalizeNonEmptyString(
          input.repositoryPolicyId,
          'GovernanceEscalation repositoryPolicyId',
        ),
        repositoryPolicyVersion: normalizePositiveInteger(
          input.repositoryPolicyVersion,
          'GovernanceEscalation repositoryPolicyVersion',
        ),
        reviewId: normalizeNonEmptyString(input.reviewId, 'GovernanceEscalation reviewId'),
        ...(input.reviewStateReference === undefined
          ? {}
          : {
              reviewStateReference: normalizeNonEmptyString(
                input.reviewStateReference,
                'GovernanceEscalation reviewStateReference',
              ),
            }),
        policyCriterionIds: normalizeStringList(
          input.policyCriterionIds ?? [],
          'GovernanceEscalation policyCriterionIds',
        ),
        inputReferences: normalizeStringList(
          input.inputReferences ?? [],
          'GovernanceEscalation inputReferences',
        ),
        requiredAuthority: normalizeNonEmptyString(
          input.requiredAuthority,
          'GovernanceEscalation requiredAuthority',
        ),
      }),
    );
  }

  public static fromSnapshot(snapshot: GovernanceEscalationSnapshot): GovernanceEscalation {
    return GovernanceEscalation.create(snapshot);
  }

  public toSnapshot(): GovernanceEscalationSnapshot {
    return Object.freeze({
      ...this.snapshotValue,
      policyCriterionIds: Object.freeze([...this.snapshotValue.policyCriterionIds]),
      inputReferences: Object.freeze([...this.snapshotValue.inputReferences]),
    });
  }
}

export class PolicyEvaluation {
  private constructor(private readonly snapshotValue: PolicyEvaluationSnapshot) {
    Object.freeze(this);
  }

  public static create(input: PolicyEvaluationInput): PolicyEvaluation {
    return new PolicyEvaluation(
      Object.freeze({
        id: PolicyEvaluationId.fromString(input.id).toString(),
        repositoryPolicyId: normalizeNonEmptyString(
          input.repositoryPolicyId,
          'PolicyEvaluation repositoryPolicyId',
        ),
        repositoryPolicyVersion: normalizePositiveInteger(
          input.repositoryPolicyVersion,
          'PolicyEvaluation repositoryPolicyVersion',
        ),
        reviewId: normalizeNonEmptyString(input.reviewId, 'PolicyEvaluation reviewId'),
        reviewStateReference: normalizeNonEmptyString(
          input.reviewStateReference,
          'PolicyEvaluation reviewStateReference',
        ),
        criterionResults: Object.freeze(
          input.criterionResults.map((result) => result.toSnapshot()),
        ),
        evaluationContractVersion: normalizeNonEmptyString(
          input.evaluationContractVersion,
          'PolicyEvaluation evaluationContractVersion',
        ),
        evaluationKey: normalizeNonEmptyString(input.evaluationKey, 'PolicyEvaluation evaluationKey'),
        evaluatedAt: normalizeNonEmptyString(input.evaluatedAt, 'PolicyEvaluation evaluatedAt'),
        governanceDecisionId: GovernanceDecisionId.fromString(
          input.governanceDecisionId,
        ).toString(),
      }),
    );
  }

  public static fromSnapshot(snapshot: PolicyEvaluationSnapshot): PolicyEvaluation {
    return PolicyEvaluation.create({
      ...snapshot,
      criterionResults: snapshot.criterionResults.map((result) =>
        PolicyCriterionResult.fromSnapshot(result),
      ),
    });
  }

  public toSnapshot(): PolicyEvaluationSnapshot {
    return Object.freeze({
      ...this.snapshotValue,
      criterionResults: Object.freeze(
        this.snapshotValue.criterionResults.map((result) =>
          PolicyCriterionResult.fromSnapshot(result).toSnapshot(),
        ),
      ),
    });
  }
}

export class GovernanceDecision {
  private constructor(private readonly snapshotValue: GovernanceDecisionSnapshot) {
    Object.freeze(this);
  }

  public static create(input: GovernanceDecisionInput): GovernanceDecision {
    return new GovernanceDecision(
      Object.freeze({
        id: GovernanceDecisionId.fromString(input.id).toString(),
        value: normalizeAllowed(input.value, governanceDecisionValues, 'GovernanceDecision value'),
        repositoryPolicyId: normalizeNonEmptyString(
          input.repositoryPolicyId,
          'GovernanceDecision repositoryPolicyId',
        ),
        repositoryPolicyVersion: normalizePositiveInteger(
          input.repositoryPolicyVersion,
          'GovernanceDecision repositoryPolicyVersion',
        ),
        reviewId: normalizeNonEmptyString(input.reviewId, 'GovernanceDecision reviewId'),
        reviewStateReference: normalizeNonEmptyString(
          input.reviewStateReference,
          'GovernanceDecision reviewStateReference',
        ),
        policyEvaluationId: PolicyEvaluationId.fromString(input.policyEvaluationId).toString(),
        evaluationKey: normalizeNonEmptyString(input.evaluationKey, 'GovernanceDecision evaluationKey'),
        criterionResults: Object.freeze(
          input.criterionResults.map((result) => result.toSnapshot()),
        ),
        evaluatedAt: normalizeNonEmptyString(input.evaluatedAt, 'GovernanceDecision evaluatedAt'),
        explanationCodes: normalizeStringList(
          input.explanationCodes,
          'GovernanceDecision explanationCodes',
        ),
        ...(input.escalation === undefined ? {} : { escalation: input.escalation.toSnapshot() }),
      }),
    );
  }

  public static fromSnapshot(snapshot: GovernanceDecisionSnapshot): GovernanceDecision {
    const { criterionResults, escalation, ...baseSnapshot } = snapshot;

    return GovernanceDecision.create({
      ...baseSnapshot,
      criterionResults: criterionResults.map((result) =>
        PolicyCriterionResult.fromSnapshot(result),
      ),
      ...(escalation === undefined
        ? {}
        : { escalation: GovernanceEscalation.fromSnapshot(escalation) }),
    });
  }

  public get id(): GovernanceDecisionId {
    return GovernanceDecisionId.fromString(this.snapshotValue.id);
  }

  public get evaluationKey(): string {
    return this.snapshotValue.evaluationKey;
  }

  public toSnapshot(): GovernanceDecisionSnapshot {
    return Object.freeze({
      ...this.snapshotValue,
      criterionResults: Object.freeze(
        this.snapshotValue.criterionResults.map((result) =>
          PolicyCriterionResult.fromSnapshot(result).toSnapshot(),
        ),
      ),
      explanationCodes: Object.freeze([...this.snapshotValue.explanationCodes]),
      ...(this.snapshotValue.escalation === undefined
        ? {}
        : {
            escalation: GovernanceEscalation.fromSnapshot(
              this.snapshotValue.escalation,
            ).toSnapshot(),
          }),
    });
  }
}

function normalizeStringList(values: readonly string[], label: string): readonly string[] {
  return Object.freeze(
    values.map((value, index) => normalizeNonEmptyString(value, `${label}[${index}]`)),
  );
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidGovernanceDecisionDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}

function normalizePositiveInteger(value: number, label: string): number {
  if (!Number.isInteger(value) || value < 1) {
    throw new InvalidGovernanceDecisionDefinitionError(`${label} must be a positive integer.`);
  }

  return value;
}

function normalizeAllowed<const T extends readonly string[]>(
  value: string,
  allowed: T,
  label: string,
): T[number] {
  const normalized = value.trim();

  if (!allowed.some((candidate) => candidate === normalized)) {
    throw new InvalidGovernanceDecisionDefinitionError(`${label} '${normalized}' is not valid.`);
  }

  return normalized as T[number];
}
