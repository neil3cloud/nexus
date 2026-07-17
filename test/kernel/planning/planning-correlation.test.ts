import { describe, expect, it } from 'vitest';

import { createKernelServices } from '../../../src/kernel/common/create-kernel-services';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';
import { EventBus } from '../../../src/kernel/events/event-bus';
import type { GovernanceServiceContract } from '../../../src/kernel/governance/governance.contract';
import { InMemoryGovernanceDecisionRepository } from '../../../src/kernel/governance/governance-decision.repository';
import { GovernanceService } from '../../../src/kernel/governance/governance.service';
import { GovernanceDecision } from '../../../src/kernel/governance/governance-decision';
import type { GovernanceDecisionSnapshot } from '../../../src/kernel/governance/governance.types';
import { InMemoryRatificationAuthoritySnapshotRepository } from '../../../src/kernel/governance/ratification-authority.repository';
import { RatificationAuthoritySnapshot } from '../../../src/kernel/governance/ratification-authority-snapshot';
import { RatificationAttributionValidationService } from '../../../src/kernel/governance/ratification-attribution-validation';
import { RepositoryPolicy } from '../../../src/kernel/governance/repository-policy';
import { InMemoryRepositoryPolicyRepository } from '../../../src/kernel/governance/repository-policy.repository';
import type { PolicyCriterionInput } from '../../../src/kernel/governance/repository-policy.types';
import { PlanningCorrelation } from '../../../src/kernel/planning/planning-correlation';
import {
  InMemoryPlanningCorrelationRepository,
} from '../../../src/kernel/planning/planning-correlation.repository';
import { PlanningCorrelationService } from '../../../src/kernel/planning/planning-correlation.service';
import {
  InvalidPlanningCorrelationDefinitionError,
  PlanningCorrelationAssociationRejectedError,
  ProposedMissionPlanNotFoundError,
} from '../../../src/kernel/planning/planning.errors';
import { PlanningService } from '../../../src/kernel/planning/planning.service';
import type {
  PlannerAttributionInput,
  ProposedMissionPlanInput,
  ProposedPlanRevisionInput,
} from '../../../src/kernel/planning/planning.types';
import {
  InMemoryProposedMissionPlanRepository,
} from '../../../src/kernel/planning/proposed-mission-plan.repository';
import { InMemoryReviewRepository } from '../../../src/kernel/review/review.repository';
import { ReviewService } from '../../../src/kernel/review/review.service';
import type { ReviewSnapshot } from '../../../src/kernel/review/review.types';

const plannerAttribution: PlannerAttributionInput = {
  executionRoleId: 'planner',
  actorType: 'Human',
  actorId: 'neil',
  engineeringSessionId: 'engineering-session-1',
  generatedAt: '2026-07-17T00:00:00.000Z',
  causality: ['mission-created'],
  correlationId: 'planner-correlation-1',
};

describe('PlanningCorrelation', () => {
  it('constructs immutable PlanningCorrelation records and appends Review association history', async () => {
    const repository = new InMemoryPlanningCorrelationRepository();
    const correlation = PlanningCorrelation.create({
      id: 'planning-correlation-1',
      missionId: 'mission-1',
      proposedMissionPlanId: 'proposed-mission-plan-1',
      proposedPlanRevisionId: 'proposed-plan-revision-under-review',
      plannerAttribution,
      createdAt: '2026-07-17T03:00:00.000Z',
      causality: ['proposed-plan-revision-submitted'],
      correlationId: 'review-entry-correlation-1',
    });
    const registered = await repository.register(correlation);
    const associated = registered.associateReview('review-1');
    const saved = await repository.save(associated);

    expect(Object.isFrozen(correlation)).toBe(true);
    expect(Object.isFrozen(correlation.toSnapshot())).toBe(true);
    expect(Object.isFrozen(correlation.toSnapshot().causality)).toBe(true);
    expect(saved.toSnapshot()).toEqual({
      id: 'planning-correlation-1',
      missionId: 'mission-1',
      proposedMissionPlanId: 'proposed-mission-plan-1',
      proposedPlanRevisionId: 'proposed-plan-revision-under-review',
      plannerAttribution,
      createdAt: '2026-07-17T03:00:00.000Z',
      causality: ['proposed-plan-revision-submitted'],
      correlationId: 'review-entry-correlation-1',
      reviewId: 'review-1',
    });
    expect((await repository.history('planning-correlation-1')).map((item) => item.toSnapshot())).toEqual([
      registered.toSnapshot(),
      saved.toSnapshot(),
    ]);
    expect(await repository.findByReviewId('review-1')).toEqual(saved);
    expect(
      await repository.findByProposedPlanRevision({
        missionId: 'mission-1',
        proposedMissionPlanId: 'proposed-mission-plan-1',
        proposedPlanRevisionId: 'proposed-plan-revision-under-review',
      }),
    ).toEqual(saved);
    expect(() => saved.associateReview('review-2')).toThrow(
      InvalidPlanningCorrelationDefinitionError,
    );

    const governed = await repository.save(
      saved
        .associateRepositoryPolicy({
          repositoryPolicyId: 'repository-policy-1',
          repositoryPolicyVersion: 1,
        })
        .associateGovernanceDecision('governance-decision-1'),
    );

    expect(governed.toSnapshot()).toMatchObject({
      repositoryPolicyId: 'repository-policy-1',
      repositoryPolicyVersion: 1,
      governanceDecisionId: 'governance-decision-1',
    });
    expect(await repository.findByGovernanceDecisionId('governance-decision-1')).toEqual(
      governed,
    );
    expect(() =>
      governed.associateRepositoryPolicy({
        repositoryPolicyId: 'repository-policy-2',
        repositoryPolicyVersion: 1,
      }),
    ).toThrow(InvalidPlanningCorrelationDefinitionError);
  });

  it('enforces Under Review lifecycle transition through a new immutable revision', async () => {
    const harness = createHarness();
    const submitted = await createSubmittedPlan(harness.planningService);
    const result = await harness.planningCorrelationService.enterReview(reviewEntryCommand());
    const repeated = await harness.planningCorrelationService.enterReview(reviewEntryCommand());

    expect(submitted.lifecycleState).toBe('Submitted');
    expect(result).toEqual(repeated);
    expect(result.proposedMissionPlan.lifecycleState).toBe('Under Review');
    expect(result.proposedMissionPlan.revisions.map((revision) => revision.lifecycleState)).toEqual([
      'Draft',
      'Submitted',
      'Under Review',
    ]);
    expect(result.planningCorrelation).toMatchObject({
      id: 'planning-correlation-1',
      missionId: 'mission-1',
      proposedMissionPlanId: 'proposed-mission-plan-1',
      proposedPlanRevisionId: 'proposed-plan-revision-under-review',
      reviewId: 'review-1',
    });
    expect((await harness.reviewRepository.getById('review-1'))?.toSnapshot()).toMatchObject({
      id: 'review-1',
      missionId: 'mission-1',
      missionPlanRevision: {
        kind: 'ProposedPlanRevision',
        revisionId: 'proposed-plan-revision-under-review',
      },
      status: 'In Progress',
    });
  });

  it('fails closed for missing or ambiguous Proposed Mission Plan references', async () => {
    const missingHarness = createHarness();

    await expect(
      missingHarness.planningCorrelationService.enterReview(
        reviewEntryCommand({ proposedMissionPlanId: 'missing-proposed-mission-plan' }),
      ),
    ).rejects.toThrow(ProposedMissionPlanNotFoundError);

    const ambiguousHarness = createHarness();
    await ambiguousHarness.planningService.createProposedMissionPlan(createPlanInput());
    await ambiguousHarness.planningService.createProposedMissionPlan(
      createPlanInput({
        id: 'proposed-mission-plan-2',
        initialRevision: createRevisionInput({
          id: 'proposed-plan-revision-other',
          proposedMissionPlanId: 'proposed-mission-plan-2',
        }),
      }),
    );

    const commandWithoutPlanId = { ...reviewEntryCommand() };
    delete commandWithoutPlanId.proposedMissionPlanId;
    await expect(
      ambiguousHarness.planningCorrelationService.enterReview(commandWithoutPlanId),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);
  });

  it('fails closed for missing, non-current, or non-Submitted Proposed Plan Revision references', async () => {
    const missingRevisionHarness = createHarness();
    await createSubmittedPlan(missingRevisionHarness.planningService);
    await expect(
      missingRevisionHarness.planningCorrelationService.enterReview(
        reviewEntryCommand({ submittedProposedPlanRevisionId: 'missing-revision' }),
      ),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);

    const nonCurrentHarness = createHarness();
    await createSubmittedPlan(nonCurrentHarness.planningService);
    await nonCurrentHarness.planningService.withdrawCurrentRevision({
      proposedMissionPlanId: 'proposed-mission-plan-1',
      id: 'proposed-plan-revision-withdrawn',
      plannerAttribution,
      createdAt: '2026-07-17T02:00:00.000Z',
    });
    await expect(
      nonCurrentHarness.planningCorrelationService.enterReview(reviewEntryCommand()),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);

    const draftHarness = createHarness();
    await draftHarness.planningService.createProposedMissionPlan(createPlanInput());
    await expect(
      draftHarness.planningCorrelationService.enterReview(
        reviewEntryCommand({ submittedProposedPlanRevisionId: 'proposed-plan-revision-1' }),
      ),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);
  });

  it('fails closed for Review mismatch, reused Review reference, and unresolved Planner Attribution', async () => {
    const mismatchHarness = createHarness({
      reviewService: {
        async startReview(command) {
          return reviewSnapshot({
            id: command.id ?? 'review-1',
            missionId: 'mission-other',
            missionPlanRevision: command.missionPlanRevision,
          });
        },
      },
    });
    await createSubmittedPlan(mismatchHarness.planningService);
    await expect(
      mismatchHarness.planningCorrelationService.enterReview(reviewEntryCommand()),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);

    const reusedReviewHarness = createHarness();
    await createSubmittedPlan(reusedReviewHarness.planningService);
    await reusedReviewHarness.planningCorrelationRepository.register(
      PlanningCorrelation.create({
        id: 'planning-correlation-existing',
        missionId: 'mission-1',
        proposedMissionPlanId: 'proposed-mission-plan-existing',
        proposedPlanRevisionId: 'proposed-plan-revision-existing',
        plannerAttribution,
        createdAt: '2026-07-17T00:00:00.000Z',
      }).associateReview('review-1'),
    );
    await expect(
      reusedReviewHarness.planningCorrelationService.enterReview(reviewEntryCommand()),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);

    const attributionHarness = createHarness();
    await createSubmittedPlan(attributionHarness.planningService);
    await expect(
      attributionHarness.planningCorrelationService.enterReview(
        reviewEntryCommand({
          plannerAttribution: {
            ...plannerAttribution,
            actorType: 'Adapter',
          },
        }),
      ),
    ).rejects.toThrow();
  });

  it('evaluates eligible terminal Review outcomes into Governed revisions with explicit RepositoryPolicy attribution', async () => {
    const harness = await createGovernanceHarness();
    await harness.policyRepository.registerInitialVersion(createRepositoryPolicy());
    await createSubmittedPlan(harness.planningService);
    await harness.planningCorrelationService.enterReview(reviewEntryCommand());
    await harness.reviewService.finalizeReviewOutcome({
      reviewId: 'review-1',
      outcome: 'Accepted',
    });

    const result = await harness.planningCorrelationService.evaluateGovernance(
      governanceCommand(),
    );
    const repeated = await harness.planningCorrelationService.evaluateGovernance(
      governanceCommand(),
    );

    expect(result.proposedMissionPlan.lifecycleState).toBe('Governed');
    expect(result.proposedMissionPlan.revisions.map((revision) => revision.lifecycleState)).toEqual([
      'Draft',
      'Submitted',
      'Under Review',
      'Governed',
    ]);
    expect(result.planningCorrelation).toMatchObject({
      repositoryPolicyId: 'repository-policy-1',
      repositoryPolicyVersion: 1,
      governanceDecisionId: 'governance-decision-1',
    });
    expect(result.governanceDecision).toMatchObject({
      id: 'governance-decision-1',
      missionId: 'mission-1',
      value: 'Approved',
      reviewId: 'review-1',
      repositoryPolicyId: 'repository-policy-1',
      repositoryPolicyVersion: 1,
    });
    expect(repeated.proposedMissionPlan).toEqual(result.proposedMissionPlan);
    expect(repeated.planningCorrelation).toEqual(result.planningCorrelation);
  });

  it('rejects cross-policy re-evaluation and superseded RepositoryPolicy attribution', async () => {
    const harness = await createGovernanceHarness();
    const policy = createRepositoryPolicy();
    await harness.policyRepository.registerInitialVersion(policy);
    await createSubmittedPlan(harness.planningService);
    await harness.planningCorrelationService.enterReview(reviewEntryCommand());
    await harness.reviewService.finalizeReviewOutcome({
      reviewId: 'review-1',
      outcome: 'Accepted',
    });
    await harness.planningCorrelationService.evaluateGovernance(governanceCommand());

    await expect(
      harness.planningCorrelationService.evaluateGovernance(
        governanceCommand({
          repositoryPolicyId: 'repository-policy-other',
        }),
      ),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);

    const supersededHarness = await createGovernanceHarness();
    await supersededHarness.policyRepository.registerInitialVersion(policy);
    await supersededHarness.policyRepository.registerSupersedingVersion(
      policy.id,
      policy.version,
      RepositoryPolicy.supersede(policy, {
        name: 'Review Closure Policy v2',
        description: 'Superseding policy.',
        criteria: policy.toSnapshot().criteria,
        ratificationId: 'NEXUS-RAT-2026-07-17-016',
      }),
    );
    await createSubmittedPlan(supersededHarness.planningService);
    await supersededHarness.planningCorrelationService.enterReview(reviewEntryCommand());
    await supersededHarness.reviewService.finalizeReviewOutcome({
      reviewId: 'review-1',
      outcome: 'Accepted',
    });

    await expect(
      supersededHarness.planningCorrelationService.evaluateGovernance(governanceCommand()),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);
  });

  it('rejects non-eligible Review outcomes and non-Approved GovernanceDecision outcomes', async () => {
    const reviewRejectedHarness = await createGovernanceHarness();
    await createSubmittedPlan(reviewRejectedHarness.planningService);
    await reviewRejectedHarness.planningCorrelationService.enterReview(reviewEntryCommand());
    await reviewRejectedHarness.reviewService.finalizeReviewOutcome({
      reviewId: 'review-1',
      outcome: 'Action Required',
    });

    const reviewRejected = await reviewRejectedHarness.planningCorrelationService.evaluateGovernance(
      governanceCommand(),
    );

    expect(reviewRejected.proposedMissionPlan.lifecycleState).toBe('Rejected');
    expect(reviewRejected.planningCorrelation.governanceDecisionId).toBeUndefined();

    const governanceRejectedHarness = await createGovernanceHarness();
    await governanceRejectedHarness.policyRepository.registerInitialVersion(
      createRepositoryPolicy([
        criterion('review-rejected', outcomeDescriptor(['Rejected'])),
      ]),
    );
    await createSubmittedPlan(governanceRejectedHarness.planningService);
    await governanceRejectedHarness.planningCorrelationService.enterReview(reviewEntryCommand());
    await governanceRejectedHarness.reviewService.finalizeReviewOutcome({
      reviewId: 'review-1',
      outcome: 'Accepted',
    });

    const governanceRejected =
      await governanceRejectedHarness.planningCorrelationService.evaluateGovernance(
        governanceCommand(),
      );

    expect(governanceRejected.proposedMissionPlan.lifecycleState).toBe('Rejected');
    expect(governanceRejected.governanceDecision?.value).toBe('Rejected');
    await expect(
      governanceRejectedHarness.planningCorrelationService.evaluateGovernance(
        governanceCommand({ id: 'different-rejected-revision' }),
      ),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);
  });

  it('records Deferred GovernanceDecision outcomes without transitioning the Under Review revision', async () => {
    const harness = await createGovernanceHarness({
      governanceDecisions: [
        governanceDecisionSnapshot({
          id: 'governance-decision-deferred',
          value: 'Deferred',
          explanationCodes: ['governance-decision-deferred'],
        }),
      ],
    });
    await harness.policyRepository.registerInitialVersion(createRepositoryPolicy());
    await createSubmittedPlan(harness.planningService);
    await harness.planningCorrelationService.enterReview(reviewEntryCommand());
    await harness.reviewService.finalizeReviewOutcome({
      reviewId: 'review-1',
      outcome: 'Accepted',
    });

    const result = await harness.planningCorrelationService.evaluateGovernance(
      governanceCommand({ governanceDecisionId: 'governance-decision-deferred' }),
    );

    expect(result.proposedMissionPlan.lifecycleState).toBe('Under Review');
    expect(result.proposedMissionPlan.revisions.map((revision) => revision.lifecycleState)).toEqual([
      'Draft',
      'Submitted',
      'Under Review',
    ]);
    expect(result.governanceDecision?.value).toBe('Deferred');
    expect(result.planningCorrelation.governanceDecisionId).toBe('governance-decision-deferred');
  });

  it('records Escalation Required GovernanceDecision outcomes without transitioning the Under Review revision', async () => {
    const harness = await createGovernanceHarness({
      governanceDecisions: [
        governanceDecisionSnapshot({
          id: 'governance-decision-escalation',
          value: 'Escalation Required',
          explanationCodes: ['governance-decision-escalation-required'],
          escalation: {
            id: 'governance-escalation-1',
            reasonCode: 'UnsupportedPredicateKind',
            repositoryPolicyId: 'repository-policy-1',
            repositoryPolicyVersion: 1,
            reviewId: 'review-1',
            policyCriterionIds: ['criterion-1'],
            inputReferences: ['review-1'],
            requiredAuthority: 'Sprint Owner',
          },
        }),
      ],
    });
    await harness.policyRepository.registerInitialVersion(createRepositoryPolicy());
    await createSubmittedPlan(harness.planningService);
    await harness.planningCorrelationService.enterReview(reviewEntryCommand());
    await harness.reviewService.finalizeReviewOutcome({
      reviewId: 'review-1',
      outcome: 'Accepted',
    });

    const result = await harness.planningCorrelationService.evaluateGovernance(
      governanceCommand({ governanceDecisionId: 'governance-decision-escalation' }),
    );

    expect(result.proposedMissionPlan.lifecycleState).toBe('Under Review');
    expect(result.governanceDecision?.value).toBe('Escalation Required');
    expect(result.planningCorrelation.governanceDecisionId).toBe('governance-decision-escalation');
  });

  it('permits later Governance evaluation to supersede a Deferred decision and transition to Governed', async () => {
    const harness = await createGovernanceHarness({
      governanceDecisions: [
        governanceDecisionSnapshot({
          id: 'governance-decision-deferred',
          value: 'Deferred',
          explanationCodes: ['governance-decision-deferred'],
        }),
        governanceDecisionSnapshot({
          id: 'governance-decision-approved',
          value: 'Approved',
          policyEvaluationId: 'policy-evaluation-2',
          evaluationKey: 'evaluation-key-2',
          explanationCodes: ['governance-decision-approved'],
        }),
      ],
    });
    await harness.policyRepository.registerInitialVersion(createRepositoryPolicy());
    await createSubmittedPlan(harness.planningService);
    await harness.planningCorrelationService.enterReview(reviewEntryCommand());
    await harness.reviewService.finalizeReviewOutcome({
      reviewId: 'review-1',
      outcome: 'Accepted',
    });

    await harness.planningCorrelationService.evaluateGovernance(
      governanceCommand({ governanceDecisionId: 'governance-decision-deferred' }),
    );
    const result = await harness.planningCorrelationService.evaluateGovernance(
      governanceCommand({ governanceDecisionId: 'governance-decision-approved' }),
    );

    expect(result.proposedMissionPlan.lifecycleState).toBe('Governed');
    expect(result.governanceDecision?.value).toBe('Approved');
    expect(result.planningCorrelation.governanceDecisionId).toBe('governance-decision-approved');
    expect(
      (await harness.planningCorrelationRepository.getById('planning-correlation-1'))?.governanceDecisionId,
    ).toBe('governance-decision-approved');
  });

  it('permits later Governance evaluation to supersede an Escalation Required decision and transition to Rejected', async () => {
    const harness = await createGovernanceHarness({
      governanceDecisions: [
        governanceDecisionSnapshot({
          id: 'governance-decision-escalation',
          value: 'Escalation Required',
          explanationCodes: ['governance-decision-escalation-required'],
          escalation: {
            id: 'governance-escalation-1',
            reasonCode: 'UnsupportedPredicateKind',
            repositoryPolicyId: 'repository-policy-1',
            repositoryPolicyVersion: 1,
            reviewId: 'review-1',
            policyCriterionIds: ['criterion-1'],
            inputReferences: ['review-1'],
            requiredAuthority: 'Sprint Owner',
          },
        }),
        governanceDecisionSnapshot({
          id: 'governance-decision-rejected',
          value: 'Rejected',
          policyEvaluationId: 'policy-evaluation-2',
          evaluationKey: 'evaluation-key-2',
          explanationCodes: ['governance-decision-rejected'],
        }),
      ],
    });
    await harness.policyRepository.registerInitialVersion(createRepositoryPolicy());
    await createSubmittedPlan(harness.planningService);
    await harness.planningCorrelationService.enterReview(reviewEntryCommand());
    await harness.reviewService.finalizeReviewOutcome({
      reviewId: 'review-1',
      outcome: 'Accepted',
    });

    await harness.planningCorrelationService.evaluateGovernance(
      governanceCommand({ governanceDecisionId: 'governance-decision-escalation' }),
    );
    const result = await harness.planningCorrelationService.evaluateGovernance(
      governanceCommand({
        id: 'proposed-plan-revision-rejected',
        governanceDecisionId: 'governance-decision-rejected',
      }),
    );

    expect(result.proposedMissionPlan.lifecycleState).toBe('Rejected');
    expect(result.governanceDecision?.value).toBe('Rejected');
    expect(result.planningCorrelation.governanceDecisionId).toBe('governance-decision-rejected');
  });

  it('rejects superseding a terminal GovernanceDecision recorded before the revision transition commits', async () => {
    const harness = await createGovernanceHarness({
      governanceDecisions: [
        governanceDecisionSnapshot({
          id: 'governance-decision-later',
          value: 'Rejected',
          policyEvaluationId: 'policy-evaluation-2',
          evaluationKey: 'evaluation-key-2',
          explanationCodes: ['governance-decision-rejected'],
        }),
      ],
    });
    await harness.policyRepository.registerInitialVersion(createRepositoryPolicy());
    await createSubmittedPlan(harness.planningService);
    await harness.planningCorrelationService.enterReview(reviewEntryCommand());
    await harness.reviewService.finalizeReviewOutcome({
      reviewId: 'review-1',
      outcome: 'Accepted',
    });
    await harness.governanceDecisionRepository.register(
      GovernanceDecision.fromSnapshot(
        governanceDecisionSnapshot({
          id: 'governance-decision-terminal',
          value: 'Approved',
          explanationCodes: ['governance-decision-approved'],
        }),
      ),
    );

    const planningCorrelation = await harness.planningCorrelationRepository.getById(
      'planning-correlation-1',
    );

    if (planningCorrelation === undefined) {
      throw new Error('Expected PlanningCorrelation to exist for terminal supersession test.');
    }

    await harness.planningCorrelationRepository.save(
      planningCorrelation
        .associateRepositoryPolicy({
          repositoryPolicyId: 'repository-policy-1',
          repositoryPolicyVersion: 1,
        })
        .associateGovernanceDecision('governance-decision-terminal'),
    );

    await expect(
      harness.planningCorrelationService.evaluateGovernance(
        governanceCommand({
          id: 'proposed-plan-revision-terminal-supersession',
          governanceDecisionId: 'governance-decision-later',
        }),
      ),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);

    expect(
      (await harness.planningCorrelationRepository.getById('planning-correlation-1'))
        ?.governanceDecisionId,
    ).toBe('governance-decision-terminal');
  });

  it('fails closed for non-terminal Review outcomes and GovernanceDecision Mission mismatch', async () => {
    const nonTerminalHarness = await createGovernanceHarness();
    await nonTerminalHarness.policyRepository.registerInitialVersion(createRepositoryPolicy());
    await createSubmittedPlan(nonTerminalHarness.planningService);
    await nonTerminalHarness.planningCorrelationService.enterReview(reviewEntryCommand());

    await expect(
      nonTerminalHarness.planningCorrelationService.evaluateGovernance(governanceCommand()),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);

    const mismatchHarness = await createGovernanceHarness({
      governanceService: {
        async evaluateGovernancePolicy(command) {
          return governanceDecisionSnapshot({
            id: command.governanceDecisionId ?? 'governance-decision-1',
            missionId: 'mission-other',
            reviewId: command.reviewId,
            repositoryPolicyId: command.repositoryPolicyId,
            repositoryPolicyVersion: command.repositoryPolicyVersion,
            evaluatedAt: command.evaluatedAt,
          });
        },
      },
    });
    await mismatchHarness.policyRepository.registerInitialVersion(createRepositoryPolicy());
    await createSubmittedPlan(mismatchHarness.planningService);
    await mismatchHarness.planningCorrelationService.enterReview(reviewEntryCommand());
    await mismatchHarness.reviewService.finalizeReviewOutcome({
      reviewId: 'review-1',
      outcome: 'Accepted',
    });

    await expect(
      mismatchHarness.planningCorrelationService.evaluateGovernance(governanceCommand()),
    ).rejects.toThrow(PlanningCorrelationAssociationRejectedError);
  });

  it('is composed additively by createKernelServices', () => {
    const services = createKernelServices(new EventBus(new TestLogger()));

    expect(services.map((service) => service.serviceName)).toContain('PlanningCorrelationService');
    expect(
      services.find(
        (service): service is PlanningCorrelationService =>
          service instanceof PlanningCorrelationService,
      ),
    ).toBeInstanceOf(PlanningCorrelationService);
  });
});

function createHarness(overrides: {
  readonly reviewService?: Pick<ReviewService, 'startReview'>;
} = {}): {
  readonly planningService: PlanningService;
  readonly planningCorrelationService: PlanningCorrelationService;
  readonly planningCorrelationRepository: InMemoryPlanningCorrelationRepository;
  readonly reviewRepository: InMemoryReviewRepository;
} {
  const proposedMissionPlanRepository = new InMemoryProposedMissionPlanRepository();
  const planningCorrelationRepository = new InMemoryPlanningCorrelationRepository();
  const reviewRepository = new InMemoryReviewRepository();
  const reviewService =
    overrides.reviewService ??
    new ReviewService(
      reviewRepository,
      new EventBus(new TestLogger()),
      createIdentitySequence(['review-event-1']),
      () => '2026-07-17T03:00:00.000Z',
    );

  return {
    planningService: new PlanningService(proposedMissionPlanRepository),
    planningCorrelationService: new PlanningCorrelationService(
      proposedMissionPlanRepository,
      planningCorrelationRepository,
      reviewService,
      createIdentitySequence(['planning-correlation-1']),
    ),
    planningCorrelationRepository,
    reviewRepository,
  };
}

async function createGovernanceHarness(overrides: {
  readonly governanceService?: GovernanceServiceContract;
  readonly governanceDecisions?: readonly GovernanceDecisionSnapshot[];
} = {}): Promise<{
  readonly planningService: PlanningService;
  readonly planningCorrelationService: PlanningCorrelationService;
  readonly planningCorrelationRepository: InMemoryPlanningCorrelationRepository;
  readonly policyRepository: InMemoryRepositoryPolicyRepository;
  readonly reviewService: ReviewService;
  readonly reviewRepository: InMemoryReviewRepository;
  readonly governanceDecisionRepository: InMemoryGovernanceDecisionRepository;
}> {
  const proposedMissionPlanRepository = new InMemoryProposedMissionPlanRepository();
  const planningCorrelationRepository = new InMemoryPlanningCorrelationRepository();
  const reviewRepository = new InMemoryReviewRepository();
  const policyRepository = new InMemoryRepositoryPolicyRepository();
  const governanceDecisionRepository = new InMemoryGovernanceDecisionRepository();
  const ratificationAuthorityRepository = new InMemoryRatificationAuthoritySnapshotRepository();
  const ratificationAttributionValidationService = new RatificationAttributionValidationService(
    ratificationAuthorityRepository,
  );
  const eventBus = new EventBus(new TestLogger());
  const reviewService = new ReviewService(
    reviewRepository,
    eventBus,
    createIdentitySequence([
      'review-event-1',
      'review-completed-event-1',
      'review-accepted-event-1',
    ]),
    () => '2026-07-17T04:00:00.000Z',
  );

  await ratificationAuthorityRepository.recordSnapshot(
    RatificationAuthoritySnapshot.create({
      source: 'RATIFICATION_LEDGER.md',
      capturedAt: '2026-07-17T00:00:00.000Z',
      records: [
        {
          identifier: 'NEXUS-RAT-2026-07-17-015',
          date: '2026-07-17',
          subject: 'Planning governance policy.',
          lifecycleStatus: 'Effective',
        },
        {
          identifier: 'NEXUS-RAT-2026-07-17-016',
          date: '2026-07-17',
          subject: 'Planning governance policy supersession.',
          lifecycleStatus: 'Effective',
        },
      ],
    }),
  );

  const governanceService =
    overrides.governanceService ??
    (overrides.governanceDecisions === undefined
      ? new GovernanceService(
          policyRepository,
          reviewRepository,
          governanceDecisionRepository,
          createIdentitySequence(['policy-evaluation-1', 'governance-decision-1', 'governance-event-1']),
          ratificationAttributionValidationService,
          eventBus,
        )
      : createScriptedGovernanceService(
          governanceDecisionRepository,
          overrides.governanceDecisions,
        ));

  return {
    planningService: new PlanningService(proposedMissionPlanRepository),
    planningCorrelationService: new PlanningCorrelationService(
      proposedMissionPlanRepository,
      planningCorrelationRepository,
      reviewService,
      createIdentitySequence(['planning-correlation-1']),
      governanceService,
      policyRepository,
      governanceDecisionRepository,
    ),
    planningCorrelationRepository,
    policyRepository,
    reviewService,
    reviewRepository,
    governanceDecisionRepository,
  };
}

function createScriptedGovernanceService(
  governanceDecisionRepository: InMemoryGovernanceDecisionRepository,
  governanceDecisions: readonly GovernanceDecisionSnapshot[],
): GovernanceServiceContract {
  const pendingDecisions = [...governanceDecisions];

  return {
    async evaluateGovernancePolicy(command) {
      const governanceDecision = pendingDecisions.shift();

      if (governanceDecision === undefined) {
        throw new Error('Scripted GovernanceDecision was not configured.');
      }

      const registeredDecision = await governanceDecisionRepository.register(
        GovernanceDecision.fromSnapshot({
          ...governanceDecision,
          missionId: command.missionId,
          repositoryPolicyId: command.repositoryPolicyId,
          repositoryPolicyVersion: command.repositoryPolicyVersion,
          reviewId: command.reviewId,
          evaluatedAt: command.evaluatedAt,
        }),
      );

      return registeredDecision.toSnapshot();
    },
  };
}

async function createSubmittedPlan(
  planningService: PlanningService,
): Promise<Awaited<ReturnType<PlanningService['submitCurrentRevision']>>> {
  await planningService.createProposedMissionPlan(createPlanInput());

  return planningService.submitCurrentRevision({
    proposedMissionPlanId: 'proposed-mission-plan-1',
    id: 'proposed-plan-revision-submitted',
    plannerAttribution,
    createdAt: '2026-07-17T01:00:00.000Z',
    causality: ['proposed-plan-revision-1'],
    correlationId: 'submit-correlation-1',
    planningPolicy: {
      id: 'planning-policy-1',
      version: '1.0.0',
      maxProposedTaskCount: 5,
      requiredProposedTaskFields: ['title', 'description'],
    },
  });
}

function governanceCommand(
  overrides: Partial<Parameters<PlanningCorrelationService['evaluateGovernance']>[0]> = {},
): Parameters<PlanningCorrelationService['evaluateGovernance']>[0] {
  return {
    missionId: 'mission-1',
    planningCorrelationId: 'planning-correlation-1',
    repositoryPolicyId: 'repository-policy-1',
    repositoryPolicyVersion: 1,
    id: 'proposed-plan-revision-governed',
    plannerAttribution,
    createdAt: '2026-07-17T05:00:00.000Z',
    evaluatedAt: '2026-07-17T05:00:00.000Z',
    causality: ['review-1'],
    correlationId: 'governance-correlation-1',
    governanceDecisionId: 'governance-decision-1',
    ...overrides,
  };
}

function createRepositoryPolicy(
  criteria: readonly PolicyCriterionInput[] = [
    criterion('review-accepted', outcomeDescriptor(['Accepted', 'Accepted With Observations'])),
  ],
): RepositoryPolicy {
  return RepositoryPolicy.createInitial({
    id: 'repository-policy-1',
    name: 'Review Closure Policy',
    description: 'Governs Planning Review closure.',
    criteria,
    ratificationId: 'NEXUS-RAT-2026-07-17-015',
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

function outcomeDescriptor(allowedReviewOutcomes: readonly string[]): string {
  return JSON.stringify({
    kind: 'ReviewOutcomeMembership',
    schemaVersion: 1,
    allowedReviewOutcomes,
  });
}

function governanceDecisionSnapshot(
  overrides: Partial<GovernanceDecisionSnapshot> = {},
): GovernanceDecisionSnapshot {
  return {
    id: 'governance-decision-1',
    missionId: 'mission-1',
    value: 'Approved',
    repositoryPolicyId: 'repository-policy-1',
    repositoryPolicyVersion: 1,
    reviewId: 'review-1',
    reviewStateReference: 'Review:review-1:Completed:Accepted',
    policyEvaluationId: 'policy-evaluation-1',
    evaluationKey: 'evaluation-key-1',
    criterionResults: [],
    evaluatedAt: '2026-07-17T05:00:00.000Z',
    explanationCodes: ['approved'],
    ...overrides,
  };
}

function reviewEntryCommand(
  overrides: Partial<Parameters<PlanningCorrelationService['enterReview']>[0]> = {},
): Parameters<PlanningCorrelationService['enterReview']>[0] {
  return {
    missionId: 'mission-1',
    proposedMissionPlanId: 'proposed-mission-plan-1',
    submittedProposedPlanRevisionId: 'proposed-plan-revision-submitted',
    underReviewProposedPlanRevisionId: 'proposed-plan-revision-under-review',
    planningCorrelationId: 'planning-correlation-1',
    reviewId: 'review-1',
    reviewCriteria: [{ id: 'criterion-1', description: 'Validate proposed plan revision.' }],
    evidenceReferences: ['proposed-plan-revision-under-review'],
    plannerAttribution,
    createdAt: '2026-07-17T03:00:00.000Z',
    causality: ['proposed-plan-revision-submitted'],
    correlationId: 'review-entry-correlation-1',
    ...overrides,
  };
}

function createPlanInput(overrides: Partial<ProposedMissionPlanInput> = {}): ProposedMissionPlanInput {
  return {
    id: 'proposed-mission-plan-1',
    missionId: 'mission-1',
    initialRevision: createRevisionInput(),
    ...overrides,
  };
}

function createRevisionInput(
  overrides: Partial<ProposedPlanRevisionInput> = {},
): ProposedPlanRevisionInput {
  return {
    id: 'proposed-plan-revision-1',
    proposedMissionPlanId: 'proposed-mission-plan-1',
    revisionNumber: 1,
    proposedTasks: [
      {
        id: 'proposed-task-1',
        title: 'Implement Planning Correlation',
        description: 'Correlate a proposed plan revision with its Review.',
      },
    ],
    proposedTaskDependencies: [],
    plannerAttribution,
    createdAt: '2026-07-17T00:00:00.000Z',
    causality: ['mission-created'],
    correlationId: 'revision-correlation-1',
    ...overrides,
  };
}

function reviewSnapshot(overrides: Partial<ReviewSnapshot> = {}): ReviewSnapshot {
  return {
    id: 'review-1',
    missionId: 'mission-1',
    missionPlanRevision: {
      kind: 'ProposedPlanRevision',
      revisionId: 'proposed-plan-revision-under-review',
    },
    status: 'In Progress',
    reviewCriteria: [{ id: 'criterion-1', description: 'Validate proposed plan revision.' }],
    evidenceReferences: ['proposed-plan-revision-under-review'],
    findings: [],
    ...overrides,
  };
}

function createIdentitySequence(identities: string[]): () => string {
  let generatedIdentityCount = 0;

  return () => {
    const identity = identities.shift();

    if (identity !== undefined) {
      return identity;
    }

    generatedIdentityCount += 1;

    return `generated-identity-${generatedIdentityCount}`;
  };
}

class TestLogger implements KernelLogger {
  public info(): void {}
  public error(): void {}
}
