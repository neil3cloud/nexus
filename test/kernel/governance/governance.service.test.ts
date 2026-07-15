import { describe, expect, it } from 'vitest';

import { EventBus } from '../../../src/kernel/events/event-bus';
import { createKernelServices } from '../../../src/kernel/common/create-kernel-services';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';
import { Finding } from '../../../src/kernel/review/finding';
import { Review } from '../../../src/kernel/review/review.aggregate';
import { InMemoryReviewRepository } from '../../../src/kernel/review/review.repository';
import type { ReviewOutcomeValue } from '../../../src/kernel/review/review.types';
import { GovernanceDecision } from '../../../src/kernel/governance/governance-decision';
import { InMemoryGovernanceDecisionRepository } from '../../../src/kernel/governance/governance-decision.repository';
import { ContradictoryGovernanceDecisionError } from '../../../src/kernel/governance/governance.errors';
import { GovernanceService } from '../../../src/kernel/governance/governance.service';
import { RepositoryPolicy } from '../../../src/kernel/governance/repository-policy';
import { InMemoryRepositoryPolicyRepository } from '../../../src/kernel/governance/repository-policy.repository';
import type { PolicyCriterionInput } from '../../../src/kernel/governance/repository-policy.types';

class TestLogger implements KernelLogger {
  public info(): void {}
  public error(): void {}
}

const metadata = Object.freeze({
  eventId: 'event-1',
  timestamp: '2026-07-15T00:00:00.000Z',
});

function outcomeDescriptor(allowedReviewOutcomes: readonly ReviewOutcomeValue[]): string {
  return JSON.stringify({
    kind: 'ReviewOutcomeMembership',
    schemaVersion: 1,
    allowedReviewOutcomes,
  });
}

function findingDescriptor(input: {
  readonly severities: readonly string[];
  readonly statuses: readonly string[];
  readonly expectedMatch: string;
}): string {
  return JSON.stringify({
    kind: 'UnresolvedFindingMatch',
    schemaVersion: 1,
    severities: input.severities,
    statuses: input.statuses,
    expectedMatch: input.expectedMatch,
  });
}

function criterion(id: string, conditionDescriptor: string): PolicyCriterionInput {
  return {
    id,
    description: `${id} description.`,
    requiredInputs: ['ReviewOutcome'],
    conditionDescriptor,
  };
}

function createPolicy(criteria: readonly PolicyCriterionInput[] = [
  criterion('review-accepted', outcomeDescriptor(['Accepted', 'Accepted With Observations'])),
]): RepositoryPolicy {
  return RepositoryPolicy.createInitial({
    id: 'repository-policy-1',
    name: 'Review Closure Policy',
    description: 'Governs Review closure.',
    criteria,
    ratificationId: 'NEXUS-RAT-2026-07-15-016',
  });
}

function createReview(
  id = 'review-1',
  outcome: ReviewOutcomeValue = 'Accepted',
  findings: readonly Finding[] = [],
): Review {
  const review = Review.create({
    id,
    missionId: 'mission-1',
    missionPlanRevision: 'revision-1',
    reviewCriteria: [{ id: 'criteria-1', description: 'Review criteria.' }],
    evidenceReferences: ['evidence-1'],
  });

  review.start(metadata);

  for (const finding of findings) {
    review.publishFinding(finding, metadata);
  }

  review.complete(outcome, metadata, requiresOutcomeMetadata(outcome) ? metadata : undefined);
  review.pullDomainEvents();

  return review;
}

function createInProgressReview(id = 'review-1'): Review {
  const review = Review.create({
    id,
    missionId: 'mission-1',
    missionPlanRevision: 'revision-1',
    reviewCriteria: [{ id: 'criteria-1', description: 'Review criteria.' }],
    evidenceReferences: ['evidence-1'],
  });

  review.start(metadata);
  review.pullDomainEvents();

  return review;
}

function createFinding(input: {
  readonly id?: string;
  readonly severity?: string;
  readonly status?: 'Created' | 'Accepted' | 'Resolved' | 'Dismissed';
} = {}): Finding {
  const finding = Finding.create({
    id: input.id ?? 'finding-1',
    reviewId: 'review-1',
    severity: input.severity ?? 'Critical',
    category: 'Correction',
    summary: 'Finding summary.',
    description: 'Finding description.',
    supportingEvidenceReferences: ['evidence-1'],
    affectedArtifactReferences: ['artifact-1'],
    criteriaReferences: ['criteria-1'],
  });

  if (input.status === 'Accepted') {
    finding.accept();
  }

  if (input.status === 'Resolved') {
    finding.accept();
    finding.resolve();
  }

  if (input.status === 'Dismissed') {
    finding.dismiss();
  }

  return finding;
}

async function createHarness(input: {
  readonly policy?: RepositoryPolicy;
  readonly review?: Review;
  readonly identities?: readonly string[];
} = {}): Promise<{
  readonly service: GovernanceService;
  readonly policyRepository: InMemoryRepositoryPolicyRepository;
  readonly reviewRepository: InMemoryReviewRepository;
  readonly decisionRepository: InMemoryGovernanceDecisionRepository;
}> {
  const policyRepository = new InMemoryRepositoryPolicyRepository();
  const reviewRepository = new InMemoryReviewRepository();
  const decisionRepository = new InMemoryGovernanceDecisionRepository();
  const identities = [...(input.identities ?? ['evaluation-1', 'decision-1', 'escalation-1'])];
  const service = new GovernanceService(
    policyRepository,
    reviewRepository,
    decisionRepository,
    () => identities.shift() ?? `generated-${identities.length}`,
  );

  if (input.policy !== undefined) {
    await policyRepository.registerInitialVersion(input.policy);
  }

  if (input.review !== undefined) {
    await reviewRepository.create(input.review);
  }

  return { service, policyRepository, reviewRepository, decisionRepository };
}

async function evaluate(service: GovernanceService, overrides: Partial<{
  readonly repositoryPolicyId: string;
  readonly repositoryPolicyVersion: number;
  readonly reviewId: string;
  readonly reviewStateReference: string;
  readonly evaluatedAt: string;
}> = {}) {
  return service.evaluateGovernancePolicy({
    repositoryPolicyId: overrides.repositoryPolicyId ?? 'repository-policy-1',
    repositoryPolicyVersion: overrides.repositoryPolicyVersion ?? 1,
    reviewId: overrides.reviewId ?? 'review-1',
    ...(overrides.reviewStateReference === undefined
      ? {}
      : { reviewStateReference: overrides.reviewStateReference }),
    evaluatedAt: overrides.evaluatedAt ?? '2026-07-15T01:00:00.000Z',
  });
}

describe('GovernanceService', () => {
  it('approves when every PolicyCriterion is satisfied', async () => {
    const { service } = await createHarness({
      policy: createPolicy([
        criterion('review-accepted', outcomeDescriptor(['Accepted'])),
        criterion(
          'no-critical-created-findings',
          findingDescriptor({
            severities: ['Critical'],
            statuses: ['Created'],
            expectedMatch: 'Absent',
          }),
        ),
      ]),
      review: createReview(),
    });

    const decision = await evaluate(service);

    expect(decision.value).toBe('Approved');
    expect(decision.criterionResults.map((result) => result.status)).toEqual([
      'Satisfied',
      'Satisfied',
    ]);
    expect(decision.escalation).toBeUndefined();
    expect(Object.isFrozen(decision)).toBe(true);
  });

  it('rejects when at least one Criterion is violated and no higher-precedence result exists', async () => {
    const { service } = await createHarness({
      policy: createPolicy([
        criterion('review-accepted', outcomeDescriptor(['Accepted'])),
        criterion('no-rejected-outcome', outcomeDescriptor(['Rejected'])),
      ]),
      review: createReview(),
    });

    const decision = await evaluate(service);

    expect(decision.value).toBe('Rejected');
    expect(decision.criterionResults.map((result) => result.status)).toEqual([
      'Satisfied',
      'Violated',
    ]);
  });

  it('defers an existing non-final Review without fabricating an outcome', async () => {
    const { service } = await createHarness({
      policy: createPolicy(),
      review: createInProgressReview(),
    });

    const decision = await evaluate(service);

    expect(decision.value).toBe('Deferred');
    expect(decision.criterionResults).toHaveLength(1);
    expect(decision.criterionResults[0]?.status).toBe('Undetermined');
    expect(decision.escalation).toBeUndefined();
  });

  it('escalates a missing Review and never treats it as Deferred, Approved, or Rejected', async () => {
    const { service } = await createHarness({ policy: createPolicy() });

    const decision = await evaluate(service, {
      reviewId: 'missing-review',
      reviewStateReference: 'requested-review-state-1',
    });

    expect(decision.value).toBe('Escalation Required');
    expect(decision.criterionResults).toEqual([]);
    expect(decision.escalation).toMatchObject({
      reasonCode: 'MissingReview',
      reviewId: 'missing-review',
      reviewStateReference: 'requested-review-state-1',
    });
  });

  it('escalates an unknown RepositoryPolicy identity without fallback', async () => {
    const { service } = await createHarness({ review: createReview() });

    const decision = await evaluate(service, { repositoryPolicyId: 'missing-policy' });

    expect(decision.value).toBe('Escalation Required');
    expect(decision.escalation?.reasonCode).toBe('UnknownRepositoryPolicy');
  });

  it('escalates an unknown RepositoryPolicy version without selecting another version', async () => {
    const { service } = await createHarness({
      policy: createPolicy(),
      review: createReview(),
    });

    const decision = await evaluate(service, { repositoryPolicyVersion: 2 });

    expect(decision.value).toBe('Escalation Required');
    expect(decision.escalation?.reasonCode).toBe('UnknownRepositoryPolicyVersion');
  });

  it('escalates an unsupported predicate kind', async () => {
    const { service } = await createHarness({
      policy: createPolicy([criterion('unknown-kind', JSON.stringify({ kind: 'Unknown', schemaVersion: 1 }))]),
      review: createReview(),
    });

    const decision = await evaluate(service);

    expect(decision.value).toBe('Escalation Required');
    expect(decision.criterionResults[0]?.status).toBe('Unsupported');
    expect(decision.escalation?.reasonCode).toBe('UnsupportedPredicateKind');
  });

  it('escalates an unsupported predicate schema version', async () => {
    const { service } = await createHarness({
      policy: createPolicy([
        criterion(
          'schema-version',
          JSON.stringify({
            kind: 'ReviewOutcomeMembership',
            schemaVersion: 2,
            allowedReviewOutcomes: ['Accepted'],
          }),
        ),
      ]),
      review: createReview(),
    });

    const decision = await evaluate(service);

    expect(decision.value).toBe('Escalation Required');
    expect(decision.escalation?.reasonCode).toBe('UnsupportedPredicateSchemaVersion');
  });

  it('escalates a malformed descriptor', async () => {
    const { service } = await createHarness({
      policy: createPolicy([criterion('malformed', '{not-json')]),
      review: createReview(),
    });

    const decision = await evaluate(service);

    expect(decision.value).toBe('Escalation Required');
    expect(decision.escalation?.reasonCode).toBe('MalformedPredicateDescriptor');
  });

  it('escalates an empty ReviewOutcomeMembership allowed-outcome list', async () => {
    const { service } = await createHarness({
      policy: createPolicy([
        criterion('empty-outcomes', outcomeDescriptor([])),
      ]),
      review: createReview(),
    });

    const decision = await evaluate(service);

    expect(decision.value).toBe('Escalation Required');
    expect(decision.escalation?.reasonCode).toBe('MalformedPredicateDescriptor');
  });

  it('escalates contradictory duplicate Finding severity configuration', async () => {
    const { service } = await createHarness({
      policy: createPolicy([
        criterion(
          'duplicate-severity',
          findingDescriptor({
            severities: ['Critical', 'Critical'],
            statuses: ['Created'],
            expectedMatch: 'Absent',
          }),
        ),
      ]),
      review: createReview(),
    });

    const decision = await evaluate(service);

    expect(decision.value).toBe('Escalation Required');
    expect(decision.escalation?.reasonCode).toBe('MalformedPredicateDescriptor');
  });

  it('escalates invalid expectedMatch values', async () => {
    const { service } = await createHarness({
      policy: createPolicy([
        criterion(
          'invalid-expected-match',
          findingDescriptor({
            severities: ['Critical'],
            statuses: ['Created'],
            expectedMatch: 'Maybe',
          }),
        ),
      ]),
      review: createReview(),
    });

    const decision = await evaluate(service);

    expect(decision.value).toBe('Escalation Required');
    expect(decision.escalation?.reasonCode).toBe('InvalidExpectedMatch');
  });

  it.each([
    ['Present', 'Present', 'Satisfied'],
    ['Absent', 'Present', 'Violated'],
    ['Present', 'Absent', 'Violated'],
    ['Absent', 'Absent', 'Satisfied'],
  ] as const)(
    'applies UnresolvedFindingMatch polarity for actual %s and expected %s',
    async (actualMatch, expectedMatch, expectedStatus) => {
      const finding = actualMatch === 'Present' ? [createFinding()] : [];
      const { service } = await createHarness({
        policy: createPolicy([
          criterion(
            'finding-polarity',
            findingDescriptor({
              severities: ['Critical'],
              statuses: ['Created'],
              expectedMatch,
            }),
          ),
        ]),
        review: createReview('review-1', 'Accepted', finding),
      });

      const decision = await evaluate(service);

      expect(decision.criterionResults[0]?.status).toBe(expectedStatus);
    },
  );

  it.each([
    [['Satisfied', 'Satisfied'], 'Approved'],
    [['Satisfied', 'Violated'], 'Rejected'],
    [['Violated', 'Violated'], 'Rejected'],
    [['Satisfied', 'Undetermined'], 'Deferred'],
    [['Violated', 'Undetermined'], 'Deferred'],
    [['Undetermined', 'Undetermined'], 'Deferred'],
    [['Satisfied', 'Unsupported'], 'Escalation Required'],
    [['Violated', 'Unsupported'], 'Escalation Required'],
    [['Undetermined', 'Unsupported'], 'Escalation Required'],
  ] as const)('derives %s from mixed Criterion results as %s', async (statuses, expectedValue) => {
    const first =
      statuses[0] === 'Satisfied'
        ? criterion('first', outcomeDescriptor(['Accepted']))
        : criterion('first', outcomeDescriptor(['Rejected']));
    const second =
      statuses[1] === 'Satisfied'
        ? criterion('second', outcomeDescriptor(['Accepted']))
        : statuses[1] === 'Violated'
          ? criterion('second', outcomeDescriptor(['Rejected']))
          : statuses[1] === 'Unsupported'
            ? criterion('second', JSON.stringify({ kind: 'Unknown', schemaVersion: 1 }))
            : criterion('second', outcomeDescriptor(['Accepted']));
    const review = statuses.some((status) => status === 'Undetermined')
      ? createInProgressReview()
      : createReview();
    const { service } = await createHarness({
      policy: createPolicy([first, second]),
      review,
    });

    const decision = await evaluate(service);

    expect(decision.value).toBe(expectedValue);
  });

  it('is evaluation-order-independent because Unsupported takes precedence over Violated', async () => {
    const { service } = await createHarness({
      policy: createPolicy([
        criterion('violated', outcomeDescriptor(['Rejected'])),
        criterion('unsupported', JSON.stringify({ kind: 'Unknown', schemaVersion: 1 })),
      ]),
      review: createReview(),
    });

    const decision = await evaluate(service);

    expect(decision.value).toBe('Escalation Required');
  });

  it('is evaluation-order-independent because Undetermined takes precedence over Violated', async () => {
    const { service } = await createHarness({
      policy: createPolicy([
        criterion('violated', outcomeDescriptor(['Rejected'])),
        criterion('satisfied', outcomeDescriptor(['Accepted'])),
      ]),
      review: createInProgressReview(),
    });

    const decision = await evaluate(service);

    expect(decision.value).toBe('Deferred');
  });

  it('returns the existing GovernanceDecision for repeated evaluation of the same immutable input set', async () => {
    const { service, decisionRepository } = await createHarness({
      policy: createPolicy(),
      review: createReview(),
      identities: ['evaluation-1', 'decision-1', 'evaluation-2', 'decision-2'],
    });

    const first = await evaluate(service);
    const second = await evaluate(service, { evaluatedAt: '2026-07-15T02:00:00.000Z' });

    expect(second).toEqual(first);
    expect(await decisionRepository.enumerate()).toHaveLength(1);
  });

  it('rejects contradictory duplicate GovernanceDecision registration for the same evaluation key', async () => {
    const repository = new InMemoryGovernanceDecisionRepository();
    const decision = GovernanceDecision.fromSnapshot({
      id: 'decision-1',
      value: 'Approved',
      repositoryPolicyId: 'repository-policy-1',
      repositoryPolicyVersion: 1,
      reviewId: 'review-1',
      reviewStateReference: 'review-state-1',
      policyEvaluationId: 'evaluation-1',
      evaluationKey: 'evaluation-key-1',
      criterionResults: [],
      evaluatedAt: '2026-07-15T01:00:00.000Z',
      explanationCodes: ['approved'],
    });
    const contradictoryDecision = GovernanceDecision.fromSnapshot({
      ...decision.toSnapshot(),
      id: 'decision-2',
      value: 'Rejected',
      explanationCodes: ['rejected'],
    });

    await repository.register(decision);

    await expect(repository.register(contradictoryDecision)).rejects.toThrow(
      ContradictoryGovernanceDecisionError,
    );
  });

  it('returns the existing equivalent GovernanceDecision for duplicate repository registration', async () => {
    const repository = new InMemoryGovernanceDecisionRepository();
    const decision = GovernanceDecision.fromSnapshot({
      id: 'decision-1',
      value: 'Approved',
      repositoryPolicyId: 'repository-policy-1',
      repositoryPolicyVersion: 1,
      reviewId: 'review-1',
      reviewStateReference: 'review-state-1',
      policyEvaluationId: 'evaluation-1',
      evaluationKey: 'evaluation-key-1',
      criterionResults: [],
      evaluatedAt: '2026-07-15T01:00:00.000Z',
      explanationCodes: ['approved'],
    });

    await repository.register(decision);

    expect((await repository.register(decision)).toSnapshot()).toEqual(decision.toSnapshot());
    expect(await repository.enumerate()).toHaveLength(1);
  });

  it('treats duplicate decisions with different attribution metadata as equivalent', async () => {
    const repository = new InMemoryGovernanceDecisionRepository();
    const decision = GovernanceDecision.fromSnapshot({
      id: 'decision-1',
      value: 'Escalation Required',
      repositoryPolicyId: 'repository-policy-1',
      repositoryPolicyVersion: 1,
      reviewId: 'review-1',
      reviewStateReference: 'review-state-1',
      policyEvaluationId: 'evaluation-1',
      evaluationKey: 'evaluation-key-1',
      criterionResults: [
        {
          policyCriterionId: 'criterion-1',
          predicateKind: 'Unknown',
          predicateSchemaVersion: '1',
          status: 'Unsupported',
          findingReferences: [],
          explanationCode: 'unsupported-predicate-kind',
        },
      ],
      evaluatedAt: '2026-07-15T01:00:00.000Z',
      explanationCodes: [
        'governance-decision-escalation-required',
        'unsupported-predicate-kind',
      ],
      escalation: {
        id: 'escalation-1',
        reasonCode: 'UnsupportedPredicateKind',
        repositoryPolicyId: 'repository-policy-1',
        repositoryPolicyVersion: 1,
        reviewId: 'review-1',
        reviewStateReference: 'review-state-1',
        policyCriterionIds: ['criterion-1'],
        inputReferences: ['PolicyCriterion:criterion-1'],
        requiredAuthority: 'Sprint Owner',
      },
    });
    const equivalentDecision = GovernanceDecision.fromSnapshot({
      ...decision.toSnapshot(),
      id: 'decision-2',
      policyEvaluationId: 'evaluation-2',
      evaluatedAt: '2026-07-15T02:00:00.000Z',
      escalation: {
        ...decision.toSnapshot().escalation!,
        id: 'escalation-2',
      },
    });

    await repository.register(decision);

    expect((await repository.register(equivalentDecision)).toSnapshot()).toEqual(
      decision.toSnapshot(),
    );
    expect(await repository.enumerate()).toHaveLength(1);
  });

  it('preserves append-only retrieval by id, evaluation key, policy version, review, and enumeration', async () => {
    const { service, decisionRepository } = await createHarness({
      policy: createPolicy(),
      review: createReview(),
    });
    const decision = await evaluate(service);

    await expect(decisionRepository.getById(decision.id)).resolves.toMatchObject({ id: { toString: expect.any(Function) } });
    expect((await decisionRepository.getByEvaluationKey(decision.evaluationKey))?.toSnapshot()).toEqual(decision);
    expect((await decisionRepository.findByRepositoryPolicy('repository-policy-1', 1))).toHaveLength(1);
    expect((await decisionRepository.findByReview('review-1'))).toHaveLength(1);
    expect((await decisionRepository.enumerate())).toHaveLength(1);
  });

  it('does not mutate RepositoryPolicy or Review inputs and publishes no Domain Events', async () => {
    const policy = createPolicy();
    const review = createReview();
    const policySnapshot = policy.toSnapshot();
    const reviewSnapshot = review.toSnapshot();
    const { service } = await createHarness({ policy, review });

    await evaluate(service);

    expect(policy.toSnapshot()).toEqual(policySnapshot);
    expect(review.toSnapshot()).toEqual(reviewSnapshot);
    expect(review.pullDomainEvents()).toEqual([]);
  });

  it('records GovernanceEscalation only for Escalation Required decisions', async () => {
    const approvedHarness = await createHarness({
      policy: createPolicy(),
      review: createReview(),
    });
    const escalationHarness = await createHarness({
      policy: createPolicy([criterion('unsupported', JSON.stringify({ kind: 'Unknown', schemaVersion: 1 }))]),
      review: createReview(),
    });

    expect((await evaluate(approvedHarness.service)).escalation).toBeUndefined();
    expect((await evaluate(escalationHarness.service)).escalation).toBeDefined();
  });

  it('uses a deterministic canonical Review fingerprint without modifying Review', async () => {
    const review = createReview();
    const { service } = await createHarness({
      policy: createPolicy(),
      review,
    });

    const decision = await evaluate(service);

    expect(decision.reviewStateReference).toContain('review-fingerprint:');
    expect(decision.evaluationKey).toContain('review-fingerprint');
    expect(review.toSnapshot().status).toBe('Completed');
  });

  it('composes GovernanceService through createKernelServices without Host or Adapter changes', () => {
    const services = createKernelServices(new EventBus(new TestLogger()));

    expect(services.map((service) => service.serviceName)).toContain('GovernanceService');
    expect(services.map((service) => service.serviceName)).toContain('RepositoryPolicyService');
    expect(services.map((service) => service.serviceName)).toContain('ReviewService');
  });

  it('does not expose downstream mutation, workflow, ratification, adapter, or event-publication APIs', () => {
    const service = new GovernanceService();

    expect('enforceGovernanceDecision' in service).toBe(false);
    expect('advanceWorkflow' in service).toBe(false);
    expect('createRatification' in service).toBe(false);
    expect('invokeAdapter' in service).toBe(false);
    expect('publishDomainEvent' in service).toBe(false);
  });
});

function requiresOutcomeMetadata(outcome: ReviewOutcomeValue): boolean {
  return outcome === 'Accepted' || outcome === 'Accepted With Observations' || outcome === 'Rejected';
}
