import { describe, expect, it } from 'vitest';

import type { IKernelService } from '../../src/kernel/common/kernel-service';
import type { KernelLogger } from '../../src/kernel/common/kernel-logger';
import { createKernelServices } from '../../src/kernel/common/create-kernel-services';
import { EvidenceService } from '../../src/kernel/evidence/evidence.service';
import { Kernel } from '../../src/kernel/kernel';
import { KnowledgeService } from '../../src/kernel/knowledge/knowledge.service';
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

describe('Kernel end-to-end Mission workflow integration', () => {
  it('executes the complete composed Mission workflow through createKernelServices', async () => {
    const logger = new TestLogger();
    let services: readonly IKernelService[] = [];
    const kernel = new Kernel((eventBus) => {
      services = createKernelServices(eventBus);

      return services;
    }, logger);

    await kernel.initialize();

    const missionService = requireService(
      services,
      'MissionService',
      (service): service is MissionService => service instanceof MissionService,
    );
    const planningService = requireService(
      services,
      'MissionPlanningService',
      (service): service is MissionPlanningService => service instanceof MissionPlanningService,
    );
    const executionService = requireService(
      services,
      'MissionExecutionService',
      (service): service is MissionExecutionService => service instanceof MissionExecutionService,
    );
    const evidenceService = requireService(
      services,
      'EvidenceService',
      (service): service is EvidenceService => service instanceof EvidenceService,
    );
    const projectionService = requireService(
      services,
      'ProjectionService',
      (service): service is ProjectionService => service instanceof ProjectionService,
    );
    const reviewService = requireService(
      services,
      'ReviewService',
      (service): service is ReviewService => service instanceof ReviewService,
    );
    const knowledgeService = requireService(
      services,
      'KnowledgeService',
      (service): service is KnowledgeService => service instanceof KnowledgeService,
    );

    const missionId = 'mission-sprint-16';
    const missionPlanId = 'mission-plan-sprint-16';
    const firstTaskId = 'task-sprint-16-plan';
    const secondTaskId = 'task-sprint-16-validate';
    const evidenceId = 'evidence-sprint-16-validation';
    const reviewId = 'review-sprint-16';
    const knowledgeId = 'knowledge-sprint-16';

    const mission = await missionService.createMission({
      id: missionId,
      objective: 'Validate composed Kernel Mission workflow integration.',
      correlationId: 'correlation-sprint-16',
    });
    const missionPlan = await planningService.createMissionPlan({
      id: missionPlanId,
      missionId: mission.id.toString(),
      revisionReason: 'Sprint 16 integration validation plan.',
      revisionMetadata: {
        sprint: 'Sprint 16',
      },
    });

    await missionService.planMission(mission.id);
    await planningService.addTask({
      missionPlanId: missionPlan.id.toString(),
      taskId: firstTaskId,
      title: 'Create integration workflow evidence',
      description: 'Capture evidence for the composed Kernel workflow.',
      revisionReason: 'Add evidence capture task.',
      revisionMetadata: {
        sprint: 'Sprint 16',
      },
    });
    await planningService.addTask({
      missionPlanId: missionPlan.id.toString(),
      taskId: secondTaskId,
      title: 'Validate composed workflow',
      description: 'Validate workflow completion against captured evidence.',
      dependencies: [firstTaskId],
      revisionReason: 'Add dependent workflow validation task.',
      revisionMetadata: {
        sprint: 'Sprint 16',
      },
    });
    await planningService.updateTask({
      missionPlanId: missionPlan.id.toString(),
      taskId: firstTaskId,
      status: 'Ready',
      revisionReason: 'Mark first task ready for Sprint 16 execution.',
    });
    const readyPlan = await planningService.updateTask({
      missionPlanId: missionPlan.id.toString(),
      taskId: secondTaskId,
      status: 'Ready',
      revisionReason: 'Mark dependent task ready for Sprint 16 execution.',
    });

    await missionService.markMissionReady(mission.id);
    await executionService.startMission({ missionId });
    await executionService.startTask({ missionId, taskId: firstTaskId });
    await executionService.completeTask({ missionId, taskId: firstTaskId });
    await executionService.startTask({ missionId, taskId: secondTaskId });
    await executionService.completeTask({ missionId, taskId: secondTaskId });

    const evidence = await evidenceService.registerEvidence({
      id: evidenceId,
      missionId,
      type: 'TestResult',
      version: 1,
      hash: 'sha256:sprint-16-integration-validation',
      metadata: {
        capturedAt: '2026-07-13T00:00:00.000Z',
        attributes: {
          runner: 'vitest',
          sprint: 'Sprint 16',
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
    });
    const projection = await projectionService.project({
      missionId,
      evidence: [
        {
          id: evidence.id.toString(),
          version: 1,
        },
      ],
    });

    await missionService.reviewMission(mission.id);
    const completedMission = await executionService.completeMission({ missionId });
    const review = await reviewService.startReview({
      id: reviewId,
      missionId,
      missionPlanRevision: {
        kind: 'ExecutableMissionPlan',
        revisionId: `revision-${readyPlan.revisionNumber}`,
      },
      reviewCriteria: [
        {
          id: 'sprint-16-acceptance',
          description: 'Sprint 16 composed Kernel workflow acceptance criteria.',
        },
      ],
      evidenceReferences: [evidence.id.toString()],
    });
    const reviewResult = await reviewService.finalizeReviewOutcome({
      reviewId: review.id,
      outcome: 'Accepted',
    });
    const contributingEventIds = kernel.getEventBus().replay(missionId).map((event) => event.eventId);
    const knowledge = await knowledgeService.captureKnowledge({
      id: knowledgeId,
      missionId,
      missionPlanRevisionId: review.missionPlanRevision.revisionId,
      summary: 'Sprint 16 validated the composed Kernel Mission workflow.',
      scope: 'Repository',
      supportingEvidenceIds: [evidence.id.toString()],
      supportingReviewId: review.id,
      contributingEventIds,
      approvingAuthority: 'Sprint 16 integration review',
    });

    const eventTypes = kernel.getEventBus().replay(missionId).map((event) => event.eventType);

    expect(kernel.health()).toEqual({
      initialized: true,
      services: services.map((service) => ({
        serviceName: service.serviceName,
        status: 'ready',
      })),
    });
    expect(completedMission.status).toBe('Completed');
    expect(readyPlan.tasks.map((task) => task.status)).toEqual(['Ready', 'Ready']);
    expect(projection.missionExecutionState.tasks).toEqual([
      {
        id: firstTaskId,
        status: 'Completed',
      },
      {
        id: secondTaskId,
        status: 'Completed',
      },
    ]);
    expect(reviewResult.review.status).toBe('Completed');
    expect(reviewResult.review.outcome).toBe('Accepted');
    expect(knowledge.status).toBe('Candidate');
    expect(knowledge.supportingEvidenceIds).toEqual([evidence.id.toString()]);
    expect(knowledge.supportingReviewId).toBe(review.id);
    expect(eventTypes).toEqual([
      'MissionCreated',
      'MissionPlanCreated',
      'MissionPlanned',
      'TaskCreated',
      'TaskCreated',
      'MissionReady',
      'MissionStarted',
      'TaskStarted',
      'TaskCompleted',
      'TaskStarted',
      'TaskCompleted',
      'EvidenceCaptured',
      'MissionReviewed',
      'MissionCompleted',
      'ReviewStarted',
      'ReviewCompleted',
      'ReviewAccepted',
      'KnowledgeCandidateCreated',
    ]);
    expect(
      kernel.getEventBus().replay(missionId).map((event) => ({
        eventType: event.eventType,
        missionId: event.missionId,
        attributionMissionId: event.attribution.missionId,
      })),
    ).toEqual(
      eventTypes.map((eventType) => ({
        eventType,
        missionId,
        attributionMissionId: missionId,
      })),
    );
    expect(logger.errors).toEqual([]);
  });
});

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
