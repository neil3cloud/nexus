import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { createKernelServices } from '../../../src/kernel/common/create-kernel-services';
import { EventBus } from '../../../src/kernel/events/event-bus';
import { GovernanceDecision, PolicyCriterionResult } from '../../../src/kernel/governance/governance-decision';
import { InMemoryGovernanceDecisionRepository } from '../../../src/kernel/governance/governance-decision.repository';
import { Review } from '../../../src/kernel/review/review.aggregate';
import { InMemoryReviewRepository } from '../../../src/kernel/review/review.repository';
import { EngineeringDecisionCorrelation } from '../../../src/kernel/execution/engineering-decision-correlation';
import {
  EngineeringDecisionCorrelationAssociationRejectedError,
  InvalidEngineeringDecisionCorrelationDefinitionError,
} from '../../../src/kernel/execution/engineering-decision-correlation.errors';
import {
  InMemoryEngineeringDecisionCorrelationRepository,
} from '../../../src/kernel/execution/engineering-decision-correlation.repository';
import { EngineeringDecisionCorrelationService } from '../../../src/kernel/execution/engineering-decision-correlation.service';
import { MissionEngineeringGroup } from '../../../src/kernel/execution/mission-engineering-group';
import {
  InMemoryMissionEngineeringGroupRepository,
} from '../../../src/kernel/execution/mission-engineering-orchestration.repository';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';

class TestLogger implements KernelLogger {
  public info(): void {}
  public error(): void {}
}

describe('EngineeringDecisionCorrelation', () => {
  it('S67-1 begins a correlation with immutable Mission Engineering Group attribution', async () => {
    const harness = await createHarness();

    const correlation = await harness.service.beginCorrelation({
      engineeringSessionId: 'engineering-session-1',
      workflowStepId: 'workflow-step-1',
      creationCausality: ['event-engineering-session-workflow-advanced'],
      creationCorrelationId: 'correlation-workflow-position',
    });

    expect(correlation).toEqual({
      id: 'engineering-decision-correlation-1',
      missionId: 'mission-1',
      engineeringSessionId: 'engineering-session-1',
      workflowStepId: 'workflow-step-1',
      createdAt: '2026-07-17T00:00:00.000Z',
      creationCausality: ['event-engineering-session-workflow-advanced'],
      creationCorrelationId: 'correlation-workflow-position',
    });
    expect(await harness.service.beginCorrelation({
      engineeringSessionId: 'engineering-session-1',
      workflowStepId: 'workflow-step-1',
    })).toEqual(correlation);
  });

  it('S67-2 rejects Review Mission mismatch without changing the correlation', async () => {
    const harness = await createHarness();
    const correlation = await harness.service.beginCorrelation({
      engineeringSessionId: 'engineering-session-1',
      workflowStepId: 'workflow-step-1',
    });

    await harness.reviewRepository.create(createReview('review-other-mission', 'mission-2'));
    await expect(
      harness.service.associateReview({
        correlationId: correlation.id,
        reviewId: 'review-other-mission',
      }),
    ).rejects.toThrow(EngineeringDecisionCorrelationAssociationRejectedError);

    expect(await harness.service.getCorrelation(correlation.id)).toEqual(correlation);
    expect(await harness.service.findByReviewId('review-other-mission')).toBeUndefined();
  });

  it('S67-3 associates Review idempotently and rejects conflicting reassociation', async () => {
    const harness = await createHarness();
    const correlation = await harness.service.beginCorrelation({
      engineeringSessionId: 'engineering-session-1',
      workflowStepId: 'workflow-step-1',
    });

    await harness.reviewRepository.create(createReview('review-1', 'mission-1'));
    await harness.reviewRepository.create(createReview('review-2', 'mission-1'));

    const associated = await harness.service.associateReview({
      correlationId: correlation.id,
      reviewId: 'review-1',
    });
    const repeated = await harness.service.associateReview({
      correlationId: correlation.id,
      reviewId: 'review-1',
    });

    expect(repeated).toEqual(associated);
    expect(associated.reviewId).toBe('review-1');
    await expect(
      harness.service.associateReview({
        correlationId: correlation.id,
        reviewId: 'review-2',
      }),
    ).rejects.toThrow(InvalidEngineeringDecisionCorrelationDefinitionError);
    expect(await harness.service.findByReviewId('review-1')).toEqual(associated);
  });

  it('S67-4 rejects GovernanceDecision Mission mismatch without changing the correlation', async () => {
    const harness = await createHarness();
    const correlation = await harness.service.beginCorrelation({
      engineeringSessionId: 'engineering-session-1',
      workflowStepId: 'workflow-step-1',
    });

    await harness.reviewRepository.create(createReview('review-1', 'mission-1'));
    const associatedReview = await harness.service.associateReview({
      correlationId: correlation.id,
      reviewId: 'review-1',
    });
    await harness.governanceDecisionRepository.register(
      createGovernanceDecision('governance-decision-other-mission', 'mission-2', 'review-1'),
    );

    await expect(
      harness.service.associateGovernanceDecision({
        correlationId: correlation.id,
        governanceDecisionId: 'governance-decision-other-mission',
      }),
    ).rejects.toThrow(EngineeringDecisionCorrelationAssociationRejectedError);

    expect(await harness.service.getCorrelation(correlation.id)).toEqual(associatedReview);
    expect(
      await harness.service.findByGovernanceDecisionId('governance-decision-other-mission'),
    ).toBeUndefined();
  });

  it('S67-5 associates GovernanceDecision idempotently and rejects conflicting reassociation', async () => {
    const harness = await createHarness();
    const correlation = await harness.service.beginCorrelation({
      engineeringSessionId: 'engineering-session-1',
      workflowStepId: 'workflow-step-1',
    });

    await harness.reviewRepository.create(createReview('review-1', 'mission-1'));
    await harness.service.associateReview({
      correlationId: correlation.id,
      reviewId: 'review-1',
    });
    await harness.governanceDecisionRepository.register(
      createGovernanceDecision('governance-decision-1', 'mission-1', 'review-1'),
    );
    await harness.governanceDecisionRepository.register(
      createGovernanceDecision('governance-decision-2', 'mission-1', 'review-1'),
    );

    const associated = await harness.service.associateGovernanceDecision({
      correlationId: correlation.id,
      governanceDecisionId: 'governance-decision-1',
    });
    const repeated = await harness.service.associateGovernanceDecision({
      correlationId: correlation.id,
      governanceDecisionId: 'governance-decision-1',
    });

    expect(repeated).toEqual(associated);
    expect(associated.governanceDecisionId).toBe('governance-decision-1');
    await expect(
      harness.service.associateGovernanceDecision({
        correlationId: correlation.id,
        governanceDecisionId: 'governance-decision-2',
      }),
    ).rejects.toThrow(InvalidEngineeringDecisionCorrelationDefinitionError);
    expect(await harness.service.findByGovernanceDecisionId('governance-decision-1')).toEqual(
      associated,
    );
  });

  it('S67-6 fails closed for absent lookup in every supported direction', async () => {
    const harness = await createHarness();

    await expect(harness.service.getCorrelation('missing-correlation')).resolves.toBeUndefined();
    await expect(harness.service.findByReviewId('missing-review')).resolves.toBeUndefined();
    await expect(
      harness.service.findByGovernanceDecisionId('missing-governance-decision'),
    ).resolves.toBeUndefined();
    await expect(
      harness.service.findByWorkflowPosition({
        missionId: 'mission-1',
        engineeringSessionId: 'engineering-session-1',
        workflowStepId: 'missing-workflow-step',
      }),
    ).resolves.toBeUndefined();
  });

  it('S67-7 resolves by Workflow position and fails closed on ambiguous repository state', async () => {
    const repository = new InMemoryEngineeringDecisionCorrelationRepository();
    const first = EngineeringDecisionCorrelation.create({
      id: 'correlation-1',
      missionId: 'mission-1',
      engineeringSessionId: 'engineering-session-1',
      workflowStepId: 'workflow-step-1',
      createdAt: '2026-07-17T00:00:00.000Z',
    });
    const second = EngineeringDecisionCorrelation.create({
      id: 'correlation-2',
      missionId: 'mission-1',
      engineeringSessionId: 'engineering-session-2',
      workflowStepId: 'workflow-step-1',
      createdAt: '2026-07-17T00:01:00.000Z',
    }).associateReview('review-ambiguous');

    await repository.register(first);
    await repository.register(second);
    await repository.save(
      EngineeringDecisionCorrelation.fromSnapshot({
        ...first.toSnapshot(),
        reviewId: 'review-ambiguous',
      }),
    );

    await expect(
      repository.findByPositionKey({
        missionId: 'mission-1',
        engineeringSessionId: 'engineering-session-1',
        workflowStepId: 'workflow-step-1',
      }),
    ).resolves.toEqual(
      EngineeringDecisionCorrelation.fromSnapshot({
        ...first.toSnapshot(),
        reviewId: 'review-ambiguous',
      }),
    );
    await expect(repository.findByReviewId('review-ambiguous')).resolves.toBeUndefined();
  });

  it('S67-8 composes only the EngineeringDecisionCorrelationService through createKernelServices', () => {
    const services = createKernelServices(new EventBus(new TestLogger()));

    expect(services.map((service) => service.serviceName)).toContain(
      'EngineeringDecisionCorrelationService',
    );
    const compositionSource = readFileSync(
      'src\\kernel\\common\\create-kernel-services.ts',
      'utf8',
    );

    expect(compositionSource).toMatch(
      /new EngineeringDecisionCorrelationService\(\s*engineeringDecisionCorrelationRepository,\s*missionEngineeringGroupRepository,\s*reviewRepository,\s*governanceDecisionRepository,\s*randomUUID,\s*\(\) => new Date\(\)\.toISOString\(\),\s*\)/,
    );

    for (const forbiddenFile of [
      'src\\kernel\\execution\\engineering-session.service.ts',
      'src\\kernel\\review\\review.service.ts',
      'src\\kernel\\governance\\governance.service.ts',
      'src\\kernel\\execution\\recovery-requirement.ts',
    ]) {
      expect(readFileSync(forbiddenFile, 'utf8')).not.toContain(
        'EngineeringDecisionCorrelationService',
      );
    }
  });
});

async function createHarness(): Promise<{
  readonly service: EngineeringDecisionCorrelationService;
  readonly reviewRepository: InMemoryReviewRepository;
  readonly governanceDecisionRepository: InMemoryGovernanceDecisionRepository;
}> {
  const repository = new InMemoryEngineeringDecisionCorrelationRepository();
  const missionEngineeringGroupRepository = new InMemoryMissionEngineeringGroupRepository();
  const reviewRepository = new InMemoryReviewRepository();
  const governanceDecisionRepository = new InMemoryGovernanceDecisionRepository();

  await missionEngineeringGroupRepository.save(
    MissionEngineeringGroup.create({
      missionId: 'mission-1',
      engineeringSessionIds: ['engineering-session-1'],
    }),
  );

  return {
    service: new EngineeringDecisionCorrelationService(
      repository,
      missionEngineeringGroupRepository,
      reviewRepository,
      governanceDecisionRepository,
      createIdentitySequence(['engineering-decision-correlation-1']),
      () => '2026-07-17T00:00:00.000Z',
    ),
    reviewRepository,
    governanceDecisionRepository,
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

    return `generated-engineering-decision-correlation-${generatedIdentityCount}`;
  };
}

function createReview(reviewId: string, missionId: string): Review {
  return Review.create({
    id: reviewId,
    missionId,
    missionPlanRevision: {
      kind: 'ExecutableMissionPlan',
      revisionId: 'mission-plan-revision-1',
    },
    reviewCriteria: [{ id: 'criterion-1', description: 'Criterion 1' }],
    evidenceReferences: ['evidence-1'],
  });
}

function createGovernanceDecision(
  governanceDecisionId: string,
  missionId: string,
  reviewId: string,
): GovernanceDecision {
  return GovernanceDecision.create({
    id: governanceDecisionId,
    missionId,
    value: 'Approved',
    repositoryPolicyId: 'repository-policy-1',
    repositoryPolicyVersion: 1,
    reviewId,
    reviewStateReference: `review:${reviewId}`,
    policyEvaluationId: `policy-evaluation-${governanceDecisionId}`,
    evaluationKey: `evaluation:${governanceDecisionId}`,
    criterionResults: [
      PolicyCriterionResult.create({
        policyCriterionId: 'criterion-1',
        predicateKind: 'review-outcome',
        predicateSchemaVersion: '1',
        status: 'Satisfied',
        reviewOutcome: 'Accepted',
        explanationCode: 'review-outcome-accepted',
      }),
    ],
    evaluatedAt: '2026-07-17T00:05:00.000Z',
    explanationCodes: ['review-outcome-accepted'],
  });
}
