import { randomUUID } from 'node:crypto';

import { ServiceLifecycle } from '../common/service-lifecycle';
import type { Finding } from '../review/finding';
import type { IReviewRepository } from '../review/review.repository';
import { InMemoryReviewRepository } from '../review/review.repository';
import type {
  FindingStatusValue,
  ReviewOutcomeValue,
  ReviewSnapshot,
  SeverityValue,
} from '../review/review.types';
import { findingStatuses, reviewOutcomes, severities } from '../review/review.types';
import type { EvaluateGovernancePolicyCommand, GovernanceServiceContract } from './governance.contract';
import {
  GovernanceDecision,
  GovernanceEscalation,
  PolicyCriterionResult,
  PolicyEvaluation,
} from './governance-decision';
import {
  InMemoryGovernanceDecisionRepository,
  type IGovernanceDecisionRepository,
} from './governance-decision.repository';
import type {
  GovernanceDecisionSnapshot,
  GovernanceDecisionValue,
  GovernanceEscalationReasonCode,
  PolicyCriterionResultStatusValue,
  UnresolvedFindingExpectedMatch,
} from './governance.types';
import { unresolvedFindingExpectedMatches } from './governance.types';
import {
  InMemoryRepositoryPolicyRepository,
  type IRepositoryPolicyRepository,
} from './repository-policy.repository';
import type { RepositoryPolicySnapshot } from './repository-policy.types';

const evaluationContractVersion = 'Sprint53PolicyEvaluation.v1';
const unresolvedReviewStateReference = 'unresolved-review-state';

interface EvaluationInputs {
  readonly command: EvaluateGovernancePolicyCommand;
  readonly repositoryPolicy?: RepositoryPolicySnapshot;
  readonly repositoryPolicyIdentityExists: boolean;
  readonly review?: ReviewSnapshot;
  readonly findings?: readonly Finding[];
  readonly reviewStateReference: string;
  readonly evaluationKey: string;
}

interface DescriptorResolution {
  readonly status?: PolicyCriterionResultStatusValue;
  readonly kind: string;
  readonly schemaVersion: string;
  readonly reasonCode?: GovernanceEscalationReasonCode;
  readonly explanationCode: string;
}

export class GovernanceService extends ServiceLifecycle implements GovernanceServiceContract {
  public constructor(
    private readonly repositoryPolicyRepository: IRepositoryPolicyRepository = new InMemoryRepositoryPolicyRepository(),
    private readonly reviewRepository: IReviewRepository = new InMemoryReviewRepository(),
    private readonly governanceDecisionRepository: IGovernanceDecisionRepository = new InMemoryGovernanceDecisionRepository(),
    private readonly createIdentity: () => string = randomUUID,
  ) {
    super('GovernanceService');
  }

  public async evaluateGovernancePolicy(
    command: EvaluateGovernancePolicyCommand,
  ): Promise<GovernanceDecisionSnapshot> {
    const inputs = await this.resolveInputs(command);
    const existingDecision = await this.governanceDecisionRepository.getByEvaluationKey(
      inputs.evaluationKey,
    );

    if (existingDecision !== undefined) {
      return existingDecision.toSnapshot();
    }

    const decision = await this.createDecision(inputs);
    const recordedDecision = await this.governanceDecisionRepository.register(decision);

    return recordedDecision.toSnapshot();
  }

  private async resolveInputs(command: EvaluateGovernancePolicyCommand): Promise<EvaluationInputs> {
    const repositoryPolicy = await this.repositoryPolicyRepository.getByIdAndVersion(
      command.repositoryPolicyId,
      command.repositoryPolicyVersion,
    );
    const repositoryPolicyIdentityExists =
      repositoryPolicy !== undefined ||
      (await this.repositoryPolicyRepository.enumerateHistory(command.repositoryPolicyId)).length > 0;
    const review = await this.reviewRepository.getById(command.reviewId);
    const reviewSnapshot = review?.toSnapshot();
    const findings = review === undefined ? undefined : await this.reviewRepository.enumerateFindings(review.id);
    const reviewStateReference =
      reviewSnapshot === undefined
        ? command.reviewStateReference ?? unresolvedReviewStateReference
        : createReviewStateReference(reviewSnapshot);

    return {
      command,
      ...(repositoryPolicy === undefined ? {} : { repositoryPolicy: repositoryPolicy.toSnapshot() }),
      repositoryPolicyIdentityExists,
      ...(reviewSnapshot === undefined ? {} : { review: reviewSnapshot }),
      ...(findings === undefined ? {} : { findings }),
      reviewStateReference,
      evaluationKey: createEvaluationKey({
        repositoryPolicyId: command.repositoryPolicyId,
        repositoryPolicyVersion: command.repositoryPolicyVersion,
        reviewId: command.reviewId,
        reviewStateReference,
      }),
    };
  }

  private async createDecision(inputs: EvaluationInputs): Promise<GovernanceDecision> {
    const criterionResults = createCriterionResults(inputs);
    const escalationReason = deriveEscalationReason(inputs, criterionResults);
    const value = deriveGovernanceDecisionValue(escalationReason, criterionResults);
    const escalation =
      value === 'Escalation Required'
        ? GovernanceEscalation.create({
            id: inputs.command.governanceEscalationId ?? this.createIdentity(),
            reasonCode: escalationReason ?? 'MalformedPredicateDescriptor',
            repositoryPolicyId: inputs.command.repositoryPolicyId,
            repositoryPolicyVersion: inputs.command.repositoryPolicyVersion,
            reviewId: inputs.command.reviewId,
            reviewStateReference: inputs.reviewStateReference,
            policyCriterionIds: criterionResults.map(
              (result) => result.toSnapshot().policyCriterionId,
            ),
            inputReferences: createEscalationInputReferences(inputs, criterionResults),
            requiredAuthority: 'Sprint Owner',
          })
        : undefined;
    const policyEvaluationId = inputs.command.policyEvaluationId ?? this.createIdentity();
    const governanceDecisionId = inputs.command.governanceDecisionId ?? this.createIdentity();
    const policyEvaluation = PolicyEvaluation.create({
      id: policyEvaluationId,
      repositoryPolicyId: inputs.command.repositoryPolicyId,
      repositoryPolicyVersion: inputs.command.repositoryPolicyVersion,
      reviewId: inputs.command.reviewId,
      reviewStateReference: inputs.reviewStateReference,
      criterionResults,
      evaluationContractVersion,
      evaluationKey: inputs.evaluationKey,
      evaluatedAt: inputs.command.evaluatedAt,
      governanceDecisionId,
    });

    return GovernanceDecision.create({
      id: governanceDecisionId,
      value,
      repositoryPolicyId: inputs.command.repositoryPolicyId,
      repositoryPolicyVersion: inputs.command.repositoryPolicyVersion,
      reviewId: inputs.command.reviewId,
      reviewStateReference: inputs.reviewStateReference,
      policyEvaluationId: policyEvaluation.toSnapshot().id,
      evaluationKey: inputs.evaluationKey,
      criterionResults,
      evaluatedAt: inputs.command.evaluatedAt,
      explanationCodes: createExplanationCodes(value, criterionResults, escalation),
      ...(escalation === undefined ? {} : { escalation }),
    });
  }
}

function createCriterionResults(inputs: EvaluationInputs): readonly PolicyCriterionResult[] {
  if (inputs.repositoryPolicy === undefined || inputs.review === undefined) {
    return Object.freeze([]);
  }

  if (inputs.review.status !== 'Completed' || inputs.review.outcome === undefined) {
    return Object.freeze(
      inputs.repositoryPolicy.criteria.map((criterion) =>
        evaluateCriterionWithoutFinalReview(criterion.id, criterion.conditionDescriptor),
      ),
    );
  }

  const review = inputs.review;

  return Object.freeze(
    inputs.repositoryPolicy.criteria.map((criterion) =>
      evaluateCriterion(criterion.id, criterion.conditionDescriptor, review, inputs.findings ?? []),
    ),
  );
}

function evaluateCriterionWithoutFinalReview(
  policyCriterionId: string,
  conditionDescriptor: string,
): PolicyCriterionResult {
  const descriptor = resolveDescriptor(conditionDescriptor);

  if (descriptor.status === 'Unsupported') {
    return PolicyCriterionResult.create({
      policyCriterionId,
      predicateKind: descriptor.kind,
      predicateSchemaVersion: descriptor.schemaVersion,
      status: 'Unsupported',
      findingReferences: [],
      explanationCode: descriptor.explanationCode,
    });
  }

  return PolicyCriterionResult.create({
    policyCriterionId,
    predicateKind: descriptor.kind,
    predicateSchemaVersion: descriptor.schemaVersion,
    status: 'Undetermined',
    findingReferences: [],
    explanationCode: 'review-not-finalized',
  });
}

function evaluateCriterion(
  policyCriterionId: string,
  conditionDescriptor: string,
  review: ReviewSnapshot,
  findings: readonly Finding[],
): PolicyCriterionResult {
  const descriptor = resolveDescriptor(conditionDescriptor);

  if (descriptor.status === 'Unsupported') {
    return PolicyCriterionResult.create({
      policyCriterionId,
      predicateKind: descriptor.kind,
      predicateSchemaVersion: descriptor.schemaVersion,
      status: 'Unsupported',
      findingReferences: [],
      explanationCode: descriptor.explanationCode,
    });
  }

  if (descriptor.kind === 'ReviewOutcomeMembership') {
    const parsed = JSON.parse(conditionDescriptor) as {
      readonly allowedReviewOutcomes: readonly ReviewOutcomeValue[];
    };
    const satisfied = parsed.allowedReviewOutcomes.includes(requireReviewOutcome(review));

    return PolicyCriterionResult.create({
      policyCriterionId,
      predicateKind: 'ReviewOutcomeMembership',
      predicateSchemaVersion: '1',
      status: satisfied ? 'Satisfied' : 'Violated',
      reviewOutcome: requireReviewOutcome(review),
      findingReferences: [],
      explanationCode: satisfied
        ? 'review-outcome-membership-satisfied'
        : 'review-outcome-membership-violated',
    });
  }

  const parsed = JSON.parse(conditionDescriptor) as {
    readonly severities: readonly SeverityValue[];
    readonly statuses: readonly FindingStatusValue[];
    readonly expectedMatch: UnresolvedFindingExpectedMatch;
  };
  const matchingFindingIds = findings
    .filter(
      (finding) =>
        parsed.severities.includes(finding.severity.toString() as SeverityValue) &&
        parsed.statuses.includes(finding.status.toString() as FindingStatusValue),
    )
    .map((finding) => finding.id.toString());
  const actualMatch = matchingFindingIds.length > 0 ? 'Present' : 'Absent';
  const satisfied = actualMatch === parsed.expectedMatch;

  return PolicyCriterionResult.create({
    policyCriterionId,
    predicateKind: 'UnresolvedFindingMatch',
    predicateSchemaVersion: '1',
    status: satisfied ? 'Satisfied' : 'Violated',
    findingReferences: matchingFindingIds,
    explanationCode: satisfied
      ? 'unresolved-finding-match-satisfied'
      : 'unresolved-finding-match-violated',
  });
}

function resolveDescriptor(conditionDescriptor: string): DescriptorResolution {
  let parsed: unknown;

  try {
    parsed = JSON.parse(conditionDescriptor);
  } catch {
    return unsupportedDescriptor(
      'MalformedPredicateDescriptor',
      'malformed-predicate-descriptor',
    );
  }

  if (!isRecord(parsed)) {
    return unsupportedDescriptor(
      'MalformedPredicateDescriptor',
      'malformed-predicate-descriptor',
    );
  }

  const kind = typeof parsed.kind === 'string' ? parsed.kind : 'MalformedPredicateDescriptor';
  const schemaVersion =
    typeof parsed.schemaVersion === 'number' || typeof parsed.schemaVersion === 'string'
      ? String(parsed.schemaVersion)
      : 'MalformedPredicateDescriptor';

  if (kind !== 'ReviewOutcomeMembership' && kind !== 'UnresolvedFindingMatch') {
    return {
      status: 'Unsupported',
      kind,
      schemaVersion,
      reasonCode: 'UnsupportedPredicateKind',
      explanationCode: 'unsupported-predicate-kind',
    };
  }

  if (parsed.schemaVersion !== 1) {
    return {
      status: 'Unsupported',
      kind,
      schemaVersion,
      reasonCode: 'UnsupportedPredicateSchemaVersion',
      explanationCode: 'unsupported-predicate-schema-version',
    };
  }

  if (kind === 'ReviewOutcomeMembership') {
    return validateReviewOutcomeMembershipDescriptor(parsed);
  }

  return validateUnresolvedFindingMatchDescriptor(parsed);
}

function validateReviewOutcomeMembershipDescriptor(
  descriptor: Readonly<Record<string, unknown>>,
): DescriptorResolution {
  if (!isUniqueNonEmptyAllowedList(descriptor.allowedReviewOutcomes, reviewOutcomes)) {
    return unsupportedDescriptor(
      'MalformedPredicateDescriptor',
      'malformed-review-outcome-membership-descriptor',
      'ReviewOutcomeMembership',
      '1',
    );
  }

  return {
    kind: 'ReviewOutcomeMembership',
    schemaVersion: '1',
    explanationCode: 'review-outcome-membership-supported',
  };
}

function validateUnresolvedFindingMatchDescriptor(
  descriptor: Readonly<Record<string, unknown>>,
): DescriptorResolution {
  if (!isUniqueNonEmptyAllowedList(descriptor.severities, severities)) {
    return unsupportedDescriptor(
      'MalformedPredicateDescriptor',
      'malformed-unresolved-finding-severities',
      'UnresolvedFindingMatch',
      '1',
    );
  }

  if (!isUniqueNonEmptyAllowedList(descriptor.statuses, findingStatuses)) {
    return unsupportedDescriptor(
      'MalformedPredicateDescriptor',
      'malformed-unresolved-finding-statuses',
      'UnresolvedFindingMatch',
      '1',
    );
  }

  if (
    typeof descriptor.expectedMatch !== 'string' ||
    !unresolvedFindingExpectedMatches.some((candidate) => candidate === descriptor.expectedMatch)
  ) {
    return unsupportedDescriptor(
      'InvalidExpectedMatch',
      'invalid-expected-match',
      'UnresolvedFindingMatch',
      '1',
    );
  }

  return {
    kind: 'UnresolvedFindingMatch',
    schemaVersion: '1',
    explanationCode: 'unresolved-finding-match-supported',
  };
}

function unsupportedDescriptor(
  reasonCode: GovernanceEscalationReasonCode,
  explanationCode: string,
  kind = 'MalformedPredicateDescriptor',
  schemaVersion = 'MalformedPredicateDescriptor',
): DescriptorResolution {
  return {
    status: 'Unsupported',
    kind,
    schemaVersion,
    reasonCode,
    explanationCode,
  };
}

function deriveEscalationReason(
  inputs: EvaluationInputs,
  criterionResults: readonly PolicyCriterionResult[],
): GovernanceEscalationReasonCode | undefined {
  if (inputs.repositoryPolicy === undefined) {
    return inputs.repositoryPolicyIdentityExists
      ? 'UnknownRepositoryPolicyVersion'
      : 'UnknownRepositoryPolicy';
  }

  if (inputs.review === undefined) {
    return 'MissingReview';
  }

  const unsupportedResult = criterionResults.find((result) => result.status === 'Unsupported');

  if (unsupportedResult === undefined) {
    return undefined;
  }

  return explanationCodeToEscalationReason(unsupportedResult.explanationCode);
}

function explanationCodeToEscalationReason(
  explanationCode: string,
): GovernanceEscalationReasonCode {
  if (explanationCode === 'unsupported-predicate-kind') {
    return 'UnsupportedPredicateKind';
  }

  if (explanationCode === 'unsupported-predicate-schema-version') {
    return 'UnsupportedPredicateSchemaVersion';
  }

  if (explanationCode === 'invalid-expected-match') {
    return 'InvalidExpectedMatch';
  }

  return 'MalformedPredicateDescriptor';
}

function deriveGovernanceDecisionValue(
  escalationReason: GovernanceEscalationReasonCode | undefined,
  criterionResults: readonly PolicyCriterionResult[],
): GovernanceDecisionValue {
  if (escalationReason !== undefined || criterionResults.some((result) => result.status === 'Unsupported')) {
    return 'Escalation Required';
  }

  if (criterionResults.some((result) => result.status === 'Undetermined')) {
    return 'Deferred';
  }

  if (criterionResults.some((result) => result.status === 'Violated')) {
    return 'Rejected';
  }

  return 'Approved';
}

function createEscalationInputReferences(
  inputs: EvaluationInputs,
  criterionResults: readonly PolicyCriterionResult[],
): readonly string[] {
  const references = [
    `RepositoryPolicy:${inputs.command.repositoryPolicyId}@${inputs.command.repositoryPolicyVersion}`,
    `Review:${inputs.command.reviewId}`,
    `ReviewState:${inputs.reviewStateReference}`,
    ...criterionResults
      .filter((result) => result.status === 'Unsupported')
      .map((result) => `PolicyCriterion:${result.toSnapshot().policyCriterionId}`),
  ];

  return Object.freeze(references);
}

function createExplanationCodes(
  value: GovernanceDecisionValue,
  criterionResults: readonly PolicyCriterionResult[],
  escalation: GovernanceEscalation | undefined,
): readonly string[] {
  return Object.freeze([
    `governance-decision-${value.toLowerCase().replaceAll(' ', '-')}`,
    ...criterionResults.map((result) => result.explanationCode),
    ...(escalation === undefined
      ? []
      : [`governance-escalation-${escalation.toSnapshot().reasonCode}`]),
  ]);
}

function createReviewStateReference(review: ReviewSnapshot): string {
  return `review-fingerprint:${createCanonicalFingerprint(review)}`;
}

function createEvaluationKey(input: {
  readonly repositoryPolicyId: string;
  readonly repositoryPolicyVersion: number;
  readonly reviewId: string;
  readonly reviewStateReference: string;
}): string {
  return createCanonicalFingerprint({
    contract: evaluationContractVersion,
    repositoryPolicyId: input.repositoryPolicyId,
    repositoryPolicyVersion: input.repositoryPolicyVersion,
    reviewId: input.reviewId,
    reviewStateReference: input.reviewStateReference,
  });
}

function createCanonicalFingerprint(value: unknown): string {
  return JSON.stringify(sortForCanonicalSerialization(value));
}

function sortForCanonicalSerialization(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortForCanonicalSerialization);
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, sortForCanonicalSerialization(item)]),
    );
  }

  return value;
}

function requireReviewOutcome(review: ReviewSnapshot): ReviewOutcomeValue {
  if (review.outcome === undefined) {
    return 'Rejected';
  }

  return review.outcome;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isUniqueNonEmptyAllowedList<const T extends readonly string[]>(
  value: unknown,
  allowed: T,
): value is readonly T[number][] {
  if (!Array.isArray(value) || value.length === 0) {
    return false;
  }

  const seen = new Set<string>();

  for (const item of value) {
    if (typeof item !== 'string' || !allowed.some((candidate) => candidate === item) || seen.has(item)) {
      return false;
    }

    seen.add(item);
  }

  return true;
}
