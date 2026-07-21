import { describe, expect, it } from 'vitest';

import type { IKernelService } from '../../src/kernel/common/kernel-service';
import type { KernelLogger } from '../../src/kernel/common/kernel-logger';
import { createKernelServices } from '../../src/kernel/common/create-kernel-services';
import { EvidenceService } from '../../src/kernel/evidence/evidence.service';
import { ProjectionEvidenceNotFoundError } from '../../src/kernel/shared-reality/shared-reality.errors';
import { Kernel } from '../../src/kernel/kernel';
import {
  DuplicateReviewError,
  ReviewCompletionRejectedError,
} from '../../src/kernel/review/review.errors';
import {
  KnowledgeCapturePreconditionError,
} from '../../src/kernel/knowledge/knowledge.errors';
import { KnowledgeService } from '../../src/kernel/knowledge/knowledge.service';
import {
  MissionAlreadyPlannedError,
  MissionCompletionRejectedError,
  MissionExecutionValidationError,
  MissionPlanningTerminalMissionError,
} from '../../src/kernel/mission/mission.errors';
import { MissionExecutionService } from '../../src/kernel/mission/mission-execution.service';
import { MissionPlanningService } from '../../src/kernel/mission/mission-planning.service';
import { MissionService } from '../../src/kernel/mission/mission.service';
import { ReviewService } from '../../src/kernel/review/review.service';
import { ProjectionService } from '../../src/kernel/shared-reality/projection.service';

class TestLogger implements KernelLogger {
  public readonly errors: Readonly<Record<string, string>>[] = [];

  public info(): void {}

  public error(_message: string, fields: Readonly<Record<string, string>> = {}): void {
    this.errors.push(fields);
  }
}

interface KernelHarness {
  readonly kernel: Kernel;
  readonly services: readonly IKernelService[];
  readonly missionService: MissionService;
  readonly planningService: MissionPlanningService;
  readonly executionService: MissionExecutionService;
  readonly evidenceService: EvidenceService;
  readonly projectionService: ProjectionService;
  readonly reviewService: ReviewService;
  readonly knowledgeService: KnowledgeService;
  readonly logger: TestLogger;
}

describe('Kernel cross-domain failure-path integration', () => {
  it('rejects execution of a Task whose dependencies remain incomplete', async () => {
    const harness = await createHarness();
    const missionId = 'mission-sprint-17-dependency';
    const missionPlanId = 'mission-plan-sprint-17-dependency';
    const prerequisiteTaskId = 'task-sprint-17-prerequisite';
    const dependentTaskId = 'task-sprint-17-dependent';
    const evidenceId = 'evidence-sprint-17-dependency';

    await createExecutableMissionPlan(harness, {
      missionId,
      missionPlanId,
      taskIds: [prerequisiteTaskId, dependentTaskId],
      dependencyTaskId: dependentTaskId,
      prerequisiteTaskId,
    });
    await harness.evidenceService.registerEvidence(createEvidenceRequest(evidenceId, missionId));
    await harness.missionService.markMissionReady(missionId);
    await harness.executionService.startMission({ missionId });

    const beforeEvents = eventTypes(harness, missionId);
    const beforeProjection = await harness.projectionService.project({
      missionId,
      evidence: [{ id: evidenceId, version: 1 }],
    });

    await expect(
      harness.executionService.startTask({ missionId, taskId: dependentTaskId }),
    ).rejects.toBeInstanceOf(MissionExecutionValidationError);

    const afterProjection = await harness.projectionService.project({
      missionId,
      evidence: [{ id: evidenceId, version: 1 }],
    });
    expect(eventTypes(harness, missionId)).toEqual(beforeEvents);
    expect(afterProjection.toSnapshot()).toEqual(beforeProjection.toSnapshot());

    await harness.executionService.startTask({ missionId, taskId: prerequisiteTaskId });
    await harness.executionService.completeTask({ missionId, taskId: prerequisiteTaskId });
    await harness.executionService.startTask({ missionId, taskId: dependentTaskId });
    await harness.executionService.completeTask({ missionId, taskId: dependentTaskId });
    expect(taskStatuses(await harness.projectionService.project({
      missionId,
      evidence: [{ id: evidenceId, version: 1 }],
    }))).toEqual(['Completed', 'Completed']);
    expect(harness.logger.errors).toEqual([]);
  });

  it('rejects premature Mission completion while Tasks remain incomplete', async () => {
    const harness = await createHarness();
    const missionId = 'mission-sprint-17-premature-completion';
    const missionPlanId = 'mission-plan-sprint-17-premature-completion';
    const firstTaskId = 'task-sprint-17-premature-first';
    const secondTaskId = 'task-sprint-17-premature-second';
    const evidenceId = 'evidence-sprint-17-premature-completion';

    await createExecutableMissionPlan(harness, {
      missionId,
      missionPlanId,
      taskIds: [firstTaskId, secondTaskId],
    });
    await harness.evidenceService.registerEvidence(createEvidenceRequest(evidenceId, missionId));
    await harness.missionService.markMissionReady(missionId);
    await harness.executionService.startMission({ missionId });
    await harness.executionService.startTask({ missionId, taskId: firstTaskId });
    await harness.executionService.completeTask({ missionId, taskId: firstTaskId });
    await harness.missionService.reviewMission(missionId);

    const beforeEvents = eventTypes(harness, missionId);
    const beforeProjection = await harness.projectionService.project({
      missionId,
      evidence: [{ id: evidenceId, version: 1 }],
    });

    await expect(
      harness.executionService.completeMission({ missionId }),
    ).rejects.toBeInstanceOf(MissionCompletionRejectedError);

    const afterProjection = await harness.projectionService.project({
      missionId,
      evidence: [{ id: evidenceId, version: 1 }],
    });
    expect(eventTypes(harness, missionId)).toEqual(beforeEvents);
    expect(afterProjection.toSnapshot()).toEqual(beforeProjection.toSnapshot());

    await harness.missionService.resumeMission(missionId);
    await harness.executionService.startTask({ missionId, taskId: secondTaskId });
    await harness.executionService.completeTask({ missionId, taskId: secondTaskId });
    await harness.missionService.reviewMission(missionId);
    await expect(harness.executionService.completeMission({ missionId })).resolves.toMatchObject({
      status: 'Completed',
    });
    expect(eventTypes(harness, missionId)).toContain('MissionCompleted');
    expect(harness.logger.errors).toEqual([]);
  });

  it('rejects duplicate MissionPlan registration for the same Mission', async () => {
    const harness = await createHarness();
    const missionId = 'mission-sprint-17-duplicate-plan';
    const missionPlanId = 'mission-plan-sprint-17-duplicate-plan';
    const evidenceId = 'evidence-sprint-17-duplicate-plan';

    await createMissionAndPlan(harness, { missionId, missionPlanId });
    await harness.evidenceService.registerEvidence(createEvidenceRequest(evidenceId, missionId));

    const beforeEvents = eventTypes(harness, missionId);
    const beforeProjection = await harness.projectionService.project({
      missionId,
      evidence: [{ id: evidenceId, version: 1 }],
    });

    await expect(
      harness.planningService.createMissionPlan({
        id: 'mission-plan-sprint-17-duplicate-plan-second',
        missionId,
        revisionReason: 'Attempt duplicate MissionPlan registration.',
      }),
    ).rejects.toBeInstanceOf(MissionAlreadyPlannedError);

    const afterProjection = await harness.projectionService.project({
      missionId,
      evidence: [{ id: evidenceId, version: 1 }],
    });
    expect(eventTypes(harness, missionId)).toEqual(beforeEvents);
    expect(afterProjection.toSnapshot()).toEqual(beforeProjection.toSnapshot());

    await expect(
      harness.planningService.addTask({
        missionPlanId,
        taskId: 'task-sprint-17-after-duplicate-plan',
        title: 'Continue after duplicate MissionPlan rejection',
        description: 'Valid planning remains available after the rejected operation.',
        revisionReason: 'Validate subsequent valid planning.',
      }),
    ).resolves.toMatchObject({ revisionNumber: 2 });
    expect(harness.logger.errors).toEqual([]);
  });

  it('rejects duplicate Review registration for the same Review identity', async () => {
    const harness = await createHarness();
    const missionId = 'mission-sprint-17-duplicate-review-registration';
    const reviewId = 'review-sprint-17-duplicate-registration';
    const replacementReviewId = 'review-sprint-17-after-duplicate-registration';

    await harness.reviewService.startReview(createReviewCommand({
      id: reviewId,
      missionId,
      evidenceId: 'evidence-sprint-17-duplicate-registration',
    }));

    const beforeEvents = eventTypes(harness, missionId);
    const beforeReviews = await harness.reviewService.enumerateReviews();

    await expect(
      harness.reviewService.startReview(createReviewCommand({
        id: reviewId,
        missionId,
        evidenceId: 'evidence-sprint-17-duplicate-registration',
      })),
    ).rejects.toBeInstanceOf(DuplicateReviewError);

    expect(eventTypes(harness, missionId)).toEqual(beforeEvents);
    await expect(harness.reviewService.enumerateReviews()).resolves.toEqual(beforeReviews);

    await expect(
      harness.reviewService.startReview(createReviewCommand({
        id: replacementReviewId,
        missionId,
        evidenceId: 'evidence-sprint-17-duplicate-registration',
      })),
    ).resolves.toMatchObject({ status: 'In Progress' });
    expect(harness.logger.errors).toEqual([]);
  });

  it('rejects Knowledge capture before an accepted completed Review exists', async () => {
    const harness = await createHarness();
    const workflow = await completeMissionWorkflow(harness, 'invalid-knowledge-capture');

    await harness.evidenceService.registerEvidence(
      createEvidenceRequest(workflow.evidenceId, workflow.missionId),
    );
    const review = await harness.reviewService.startReview(createReviewCommand({
      id: workflow.reviewId,
      missionId: workflow.missionId,
      evidenceId: workflow.evidenceId,
      missionPlanRevision: workflow.missionPlanRevision,
    }));

    const beforeEvents = eventTypes(harness, workflow.missionId);

    await expect(
      harness.knowledgeService.captureKnowledge(createKnowledgeRequest({
        id: workflow.knowledgeId,
        missionId: workflow.missionId,
        missionPlanRevisionId: workflow.missionPlanRevision.revisionId,
        evidenceId: workflow.evidenceId,
        reviewId: review.id,
        contributingEventIds: eventIds(harness, workflow.missionId),
      })),
    ).rejects.toBeInstanceOf(KnowledgeCapturePreconditionError);

    expect(eventTypes(harness, workflow.missionId)).toEqual(beforeEvents);
    expect(await harness.knowledgeService.enumerateKnowledge()).toEqual([]);

    await harness.reviewService.finalizeReviewOutcome({
      reviewId: review.id,
      outcome: 'Accepted',
    });
    await expect(
      harness.knowledgeService.captureKnowledge(createKnowledgeRequest({
        id: workflow.knowledgeId,
        missionId: workflow.missionId,
        missionPlanRevisionId: workflow.missionPlanRevision.revisionId,
        evidenceId: workflow.evidenceId,
        reviewId: review.id,
        contributingEventIds: eventIds(harness, workflow.missionId),
      })),
    ).resolves.toMatchObject({ status: 'Candidate' });
    expect(harness.logger.errors).toEqual([]);
  });

  it('rejects projection when required authoritative Evidence is missing', async () => {
    const harness = await createHarness();
    const missionId = 'mission-sprint-17-missing-evidence';
    const missionPlanId = 'mission-plan-sprint-17-missing-evidence';
    const evidenceId = 'evidence-sprint-17-missing';

    await createMissionAndPlan(harness, { missionId, missionPlanId });
    const beforeEvents = eventTypes(harness, missionId);

    await expect(
      harness.projectionService.project({
        missionId,
        evidence: [{ id: evidenceId, version: 1 }],
      }),
    ).rejects.toBeInstanceOf(ProjectionEvidenceNotFoundError);

    expect(eventTypes(harness, missionId)).toEqual(beforeEvents);
    expect(await harness.evidenceService.enumerateEvidence()).toEqual([]);

    await harness.evidenceService.registerEvidence(createEvidenceRequest(evidenceId, missionId));
    await expect(
      harness.projectionService.project({
        missionId,
        evidence: [{ id: evidenceId, version: 1 }],
      }),
    ).resolves.toMatchObject({
      projectionMetadata: {
        evidenceCount: 1,
      },
    });
    expect(harness.logger.errors).toEqual([]);
  });

  it('rejects Review completion after the Review lifecycle is already terminal', async () => {
    const harness = await createHarness();
    const workflow = await completeMissionWorkflow(harness, 'invalid-review-completion');

    await harness.evidenceService.registerEvidence(
      createEvidenceRequest(workflow.evidenceId, workflow.missionId),
    );
    const review = await harness.reviewService.startReview(createReviewCommand({
      id: workflow.reviewId,
      missionId: workflow.missionId,
      evidenceId: workflow.evidenceId,
      missionPlanRevision: workflow.missionPlanRevision,
    }));
    await harness.reviewService.finalizeReviewOutcome({
      reviewId: review.id,
      outcome: 'Accepted',
    });

    const beforeEvents = eventTypes(harness, workflow.missionId);
    const beforeReview = await harness.reviewService.queryReviewResult({ reviewId: review.id });

    await expect(
      harness.reviewService.finalizeReviewOutcome({
        reviewId: review.id,
        outcome: 'Accepted',
      }),
    ).rejects.toBeInstanceOf(ReviewCompletionRejectedError);

    expect(eventTypes(harness, workflow.missionId)).toEqual(beforeEvents);
    await expect(harness.reviewService.queryReviewResult({ reviewId: review.id })).resolves.toEqual(
      beforeReview,
    );

    await expect(
      harness.reviewService.startReview(createReviewCommand({
        id: 'review-sprint-17-after-terminal-review',
        missionId: workflow.missionId,
        evidenceId: workflow.evidenceId,
        missionPlanRevision: workflow.missionPlanRevision,
      })),
    ).resolves.toMatchObject({ status: 'In Progress' });
    expect(harness.logger.errors).toEqual([]);
  });

  it('rejects MissionPlan mutation after the Mission enters a terminal state', async () => {
    const harness = await createHarness();
    const workflow = await completeMissionWorkflow(harness, 'terminal-mission-planning');

    const beforeEvents = eventTypes(harness, workflow.missionId);

    await expect(
      harness.planningService.addTask({
        missionPlanId: workflow.missionPlanId,
        taskId: 'task-sprint-17-terminal-planning-rejected',
        title: 'Rejected terminal Mission planning',
        description: 'This Task must not be persisted after Mission completion.',
        revisionReason: 'Attempt invalid terminal Mission planning.',
      }),
    ).rejects.toBeInstanceOf(MissionPlanningTerminalMissionError);

    expect(eventTypes(harness, workflow.missionId)).toEqual(beforeEvents);

    await harness.evidenceService.registerEvidence(
      createEvidenceRequest(workflow.evidenceId, workflow.missionId),
    );
    await expect(
      harness.reviewService.startReview(createReviewCommand({
        id: workflow.reviewId,
        missionId: workflow.missionId,
        evidenceId: workflow.evidenceId,
        missionPlanRevision: workflow.missionPlanRevision,
      })),
    ).resolves.toMatchObject({ status: 'In Progress' });
    expect(harness.logger.errors).toEqual([]);
  });
});

async function createHarness(): Promise<KernelHarness> {
  const logger = new TestLogger();
  let services: readonly IKernelService[] = [];
  const kernel = new Kernel((eventBus) => {
    services = createKernelServices(eventBus);

    return services;
  }, logger);

  await kernel.initialize();

  return {
    kernel,
    services,
    missionService: requireService(
      services,
      'MissionService',
      (service): service is MissionService => service instanceof MissionService,
    ),
    planningService: requireService(
      services,
      'MissionPlanningService',
      (service): service is MissionPlanningService => service instanceof MissionPlanningService,
    ),
    executionService: requireService(
      services,
      'MissionExecutionService',
      (service): service is MissionExecutionService => service instanceof MissionExecutionService,
    ),
    evidenceService: requireService(
      services,
      'EvidenceService',
      (service): service is EvidenceService => service instanceof EvidenceService,
    ),
    projectionService: requireService(
      services,
      'ProjectionService',
      (service): service is ProjectionService => service instanceof ProjectionService,
    ),
    reviewService: requireService(
      services,
      'ReviewService',
      (service): service is ReviewService => service instanceof ReviewService,
    ),
    knowledgeService: requireService(
      services,
      'KnowledgeService',
      (service): service is KnowledgeService => service instanceof KnowledgeService,
    ),
    logger,
  };
}

function requireService<T extends IKernelService>(
  services: readonly IKernelService[],
  serviceName: string,
  isService: (service: IKernelService) => service is T,
): T {
  const service = services.find(isService);

  if (service === undefined) {
    throw new Error(`Expected ${serviceName} to be composed by createKernelServices.`);
  }

  return service;
}

async function createMissionAndPlan(
  harness: KernelHarness,
  input: {
    readonly missionId: string;
    readonly missionPlanId: string;
  },
): Promise<void> {
  await harness.missionService.createMission({
    id: input.missionId,
    objective: `Sprint 17 failure-path validation for ${input.missionId}.`,
  });
  await harness.planningService.createMissionPlan({
    id: input.missionPlanId,
    missionId: input.missionId,
    revisionReason: 'Create Sprint 17 failure-path MissionPlan.',
    revisionMetadata: {
      sprint: 'Sprint 17',
    },
  });
  await harness.missionService.planMission(input.missionId);
}

async function createExecutableMissionPlan(
  harness: KernelHarness,
  input: {
    readonly missionId: string;
    readonly missionPlanId: string;
    readonly taskIds: readonly string[];
    readonly dependencyTaskId?: string;
    readonly prerequisiteTaskId?: string;
  },
): Promise<void> {
  await createMissionAndPlan(harness, input);

  for (const taskId of input.taskIds) {
    await harness.planningService.addTask({
      missionPlanId: input.missionPlanId,
      taskId,
      title: `Task ${taskId}`,
      description: `Sprint 17 validation Task ${taskId}.`,
      ...(taskId === input.dependencyTaskId && input.prerequisiteTaskId !== undefined
        ? { dependencies: [input.prerequisiteTaskId] }
        : {}),
      revisionReason: `Add Task ${taskId}.`,
      revisionMetadata: {
        sprint: 'Sprint 17',
      },
    });
  }

  for (const taskId of input.taskIds) {
    await harness.planningService.updateTask({
      missionPlanId: input.missionPlanId,
      taskId,
      status: 'Ready',
      revisionReason: `Mark Task ${taskId} ready.`,
      revisionMetadata: {
        sprint: 'Sprint 17',
      },
    });
  }
}

async function completeMissionWorkflow(
  harness: KernelHarness,
  suffix: string,
): Promise<{
  readonly missionId: string;
  readonly missionPlanId: string;
  readonly missionPlanRevision: {
    readonly kind: 'ExecutableMissionPlan';
    readonly revisionId: string;
  };
  readonly evidenceId: string;
  readonly reviewId: string;
  readonly knowledgeId: string;
}> {
  const missionId = `mission-sprint-17-${suffix}`;
  const missionPlanId = `mission-plan-sprint-17-${suffix}`;
  const firstTaskId = `task-sprint-17-${suffix}-first`;
  const secondTaskId = `task-sprint-17-${suffix}-second`;
  const evidenceId = `evidence-sprint-17-${suffix}`;
  const reviewId = `review-sprint-17-${suffix}`;
  const knowledgeId = `knowledge-sprint-17-${suffix}`;

  await createExecutableMissionPlan(harness, {
    missionId,
    missionPlanId,
    taskIds: [firstTaskId, secondTaskId],
  });
  const readyPlan = await harness.planningService.updateTask({
    missionPlanId,
    taskId: secondTaskId,
    status: 'Ready',
    revisionReason: 'Exercise idempotent non-terminal Task update before execution.',
    revisionMetadata: {
      sprint: 'Sprint 17',
    },
  });

  await harness.missionService.markMissionReady(missionId);
  await harness.executionService.startMission({ missionId });
  await harness.executionService.startTask({ missionId, taskId: firstTaskId });
  await harness.executionService.completeTask({ missionId, taskId: firstTaskId });
  await harness.executionService.startTask({ missionId, taskId: secondTaskId });
  await harness.executionService.completeTask({ missionId, taskId: secondTaskId });
  await harness.missionService.reviewMission(missionId);
  await harness.executionService.completeMission({ missionId });

  return {
    missionId,
    missionPlanId,
    missionPlanRevision: {
      kind: 'ExecutableMissionPlan',
      revisionId: `revision-${readyPlan.revisionNumber}`,
    },
    evidenceId,
    reviewId,
    knowledgeId,
  };
}

function createEvidenceRequest(id: string, missionId: string) {
  return {
    id,
    missionId,
    type: 'TestResult',
    version: 1,
    hash: `sha256:${id}`,
    metadata: {
      capturedAt: '2026-07-13T00:00:00.000Z',
      attributes: {
        sprint: 'Sprint 17',
      },
    },
    confidenceClassification: 'Verified',
    provenance: {
      source: 'vitest',
      acquisitionMethod: 'integration-test',
      acquiredAt: '2026-07-13T00:00:00.000Z',
      actor: 'builder',
      system: 'nexus',
      verificationStatus: 'Verified',
      verificationStatusSemantics: 'EvidenceVerificationStatus/v1',
    },
  } as const;
}

function createReviewCommand(input: {
  readonly id: string;
  readonly missionId: string;
  readonly evidenceId: string;
  readonly missionPlanRevision?: {
    readonly kind: 'ExecutableMissionPlan';
    readonly revisionId: string;
  };
}) {
  return {
    id: input.id,
    missionId: input.missionId,
    missionPlanRevision: input.missionPlanRevision ?? {
      kind: 'ExecutableMissionPlan',
      revisionId: 'revision-1',
    },
    reviewCriteria: [
      {
        id: 'sprint-17-acceptance',
        description: 'Sprint 17 failure-path validation acceptance criteria.',
      },
    ],
    evidenceReferences: [input.evidenceId],
  } as const;
}

function createKnowledgeRequest(input: {
  readonly id: string;
  readonly missionId: string;
  readonly missionPlanRevisionId: string;
  readonly evidenceId: string;
  readonly reviewId: string;
  readonly contributingEventIds: readonly string[];
}) {
  return {
    id: input.id,
    missionId: input.missionId,
    missionPlanRevisionId: input.missionPlanRevisionId,
    summary: 'Sprint 17 validated deterministic failure-path rejection.',
    scope: 'Repository',
    supportingEvidenceIds: [input.evidenceId],
    supportingReviewId: input.reviewId,
    contributingEventIds: input.contributingEventIds,
    approvingAuthority: 'Sprint 17 integration review',
  } as const;
}

function eventTypes(harness: KernelHarness, missionId: string): readonly string[] {
  return harness.kernel.getEventBus().replay(missionId).map((event) => event.eventType);
}

function eventIds(harness: KernelHarness, missionId: string): readonly string[] {
  return harness.kernel.getEventBus().replay(missionId).map((event) => event.eventId);
}

function taskStatuses(
  projection: Awaited<ReturnType<ProjectionService['project']>>,
): readonly string[] {
  return projection.missionExecutionState.tasks.map((task) => task.status);
}
