import { describe, expect, it } from 'vitest';

import { createKernelServices } from '../../../src/kernel/common/create-kernel-services';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';
import { EventBus } from '../../../src/kernel/events/event-bus';
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
      missionPlanRevision: 'proposed-plan-revision-under-review',
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
    missionPlanRevision: 'proposed-plan-revision-under-review',
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
