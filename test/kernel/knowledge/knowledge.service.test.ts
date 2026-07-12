import { describe, expect, it } from 'vitest';

import { InMemoryEvidenceRepository } from '../../../src/kernel/evidence/evidence.repository';
import { EventBus } from '../../../src/kernel/events/event-bus';
import { createKernelServices } from '../../../src/kernel/common/create-kernel-services';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';
import { InMemoryMissionRepository } from '../../../src/kernel/mission/mission.repository';
import { InMemoryReviewRepository } from '../../../src/kernel/review/review.repository';
import type { Knowledge } from '../../../src/kernel/knowledge/knowledge.aggregate';
import {
  InMemoryKnowledgeRepository,
  type IKnowledgeRepository,
} from '../../../src/kernel/knowledge/knowledge.repository';
import { KnowledgeService } from '../../../src/kernel/knowledge/knowledge.service';
import {
  DuplicateKnowledgeError,
  KnowledgeCapturePreconditionError,
  KnowledgeEventPublisherUnavailableError,
  KnowledgeNotFoundError,
} from '../../../src/kernel/knowledge/knowledge.errors';
import {
  captureKnowledgeInput,
  createAcceptedReview,
  createCompletedMission,
  createEvidence,
} from './knowledge.test-support';

class TestLogger implements KernelLogger {
  public info(): void {}

  public error(): void {}
}

function sequence(values: readonly string[]): () => string {
  let index = 0;

  return () => {
    const value = values[index];

    if (value === undefined) {
      throw new Error('Sequence exhausted.');
    }

    index += 1;

    return value;
  };
}

class FailingCreateKnowledgeRepository implements IKnowledgeRepository {
  public async create(): Promise<void> {
    throw new Error('Create failed.');
  }

  public async save(): Promise<void> {}

  public async getById(): Promise<Knowledge | undefined> {
    return undefined;
  }

  public async exists(): Promise<boolean> {
    return false;
  }

  public async enumerate(): Promise<readonly Knowledge[]> {
    return [];
  }
}

class FailingSaveKnowledgeRepository extends InMemoryKnowledgeRepository {
  public override async save(): Promise<void> {
    throw new Error('Save failed.');
  }
}

describe('KnowledgeService', () => {
  it('coordinates capture, revision, retrieval, and enumeration through repositories', async () => {
    const knowledgeRepository = new InMemoryKnowledgeRepository();
    const reviewRepository = new InMemoryReviewRepository();
    const evidenceRepository = new InMemoryEvidenceRepository();
    const missionRepository = new InMemoryMissionRepository();
    const eventBus = new EventBus(new TestLogger());
    const service = new KnowledgeService(
      knowledgeRepository,
      reviewRepository,
      evidenceRepository,
      missionRepository,
      eventBus,
      sequence(['event-candidate-created', 'event-revision-created']),
      () => '2026-07-13T00:00:00.000Z',
    );

    await missionRepository.save(createCompletedMission());
    await evidenceRepository.register(createEvidence());
    await reviewRepository.create(createAcceptedReview());

    const captured = await service.captureKnowledge(captureKnowledgeInput());
    const revised = await service.reviseKnowledge({
      knowledgeId: captured.id,
      summary: 'KnowledgeService preserves append-only revision history.',
    });

    expect(captured.status).toBe('Candidate');
    expect(revised.revisions).toHaveLength(2);
    expect(await service.retrieveKnowledge({ knowledgeId: captured.id })).toEqual(revised);
    expect((await service.enumerateKnowledge()).map((knowledge) => knowledge.id)).toEqual([
      'knowledge-1',
    ]);
    expect(eventBus.replay('mission-1').map((event) => event.eventType)).toEqual([
      'KnowledgeCandidateCreated',
      'KnowledgeRevisionCreated',
    ]);
  });

  it('uses injected identity generation without adapter or provider concepts', async () => {
    const reviewRepository = new InMemoryReviewRepository();
    const evidenceRepository = new InMemoryEvidenceRepository();
    const missionRepository = new InMemoryMissionRepository();
    const eventBus = new EventBus(new TestLogger());
    const service = new KnowledgeService(
      new InMemoryKnowledgeRepository(),
      reviewRepository,
      evidenceRepository,
      missionRepository,
      eventBus,
      sequence(['generated-knowledge', 'event-candidate-created']),
      () => '2026-07-13T00:00:00.000Z',
    );

    await missionRepository.save(createCompletedMission());
    await evidenceRepository.register(createEvidence());
    await reviewRepository.create(createAcceptedReview());

    const requestWithId = captureKnowledgeInput();
    const requestWithoutId = {
      missionId: requestWithId.missionId,
      missionPlanRevisionId: requestWithId.missionPlanRevisionId,
      summary: requestWithId.summary,
      scope: requestWithId.scope,
      supportingEvidenceIds: requestWithId.supportingEvidenceIds,
      supportingReviewId: requestWithId.supportingReviewId,
      contributingEventIds: requestWithId.contributingEventIds,
      approvingAuthority: requestWithId.approvingAuthority,
    };
    const captured = await service.captureKnowledge(requestWithoutId);

    expect(captured.id).toBe('generated-knowledge');
    expect(eventBus.replay('mission-1')[0]).toMatchObject({
      eventId: 'event-candidate-created',
      missionId: 'mission-1',
      eventType: 'KnowledgeCandidateCreated',
      attribution: {
        missionId: 'mission-1',
        missionPlanRevisionId: 'revision-1',
      },
      payload: {
        knowledgeId: 'generated-knowledge',
        status: 'Candidate',
        scope: 'Repository',
        revisionNumber: 1,
      },
    });
  });

  it('surfaces deterministic Knowledge diagnostics from aggregate and repository contracts', async () => {
    const knowledgeRepository = new InMemoryKnowledgeRepository();
    const reviewRepository = new InMemoryReviewRepository();
    const evidenceRepository = new InMemoryEvidenceRepository();
    const missionRepository = new InMemoryMissionRepository();
    const service = new KnowledgeService(
      knowledgeRepository,
      reviewRepository,
      evidenceRepository,
      missionRepository,
      new EventBus(new TestLogger()),
      sequence([
        'event-candidate-created',
        'event-candidate-created-duplicate',
        'event-candidate-created-missing-evidence',
      ]),
      () => '2026-07-13T00:00:00.000Z',
    );

    await missionRepository.save(createCompletedMission());
    await evidenceRepository.register(createEvidence());
    await reviewRepository.create(createAcceptedReview());
    await service.captureKnowledge(captureKnowledgeInput());

    await expect(service.captureKnowledge(captureKnowledgeInput())).rejects.toThrow(
      DuplicateKnowledgeError,
    );
    await expect(service.retrieveKnowledge({ knowledgeId: 'missing-knowledge' })).rejects.toThrow(
      KnowledgeNotFoundError,
    );
    await expect(
      service.captureKnowledge({
        ...captureKnowledgeInput(),
        id: 'knowledge-2',
        supportingEvidenceIds: ['missing-evidence'],
      }),
    ).rejects.toThrow(KnowledgeCapturePreconditionError);
  });

  it('publishes Knowledge events only after successful persistence', async () => {
    const knowledgeRepository = new InMemoryKnowledgeRepository();
    const reviewRepository = new InMemoryReviewRepository();
    const evidenceRepository = new InMemoryEvidenceRepository();
    const missionRepository = new InMemoryMissionRepository();
    const eventBus = new EventBus(new TestLogger());
    const persistedSnapshots: string[] = [];
    const service = new KnowledgeService(
      knowledgeRepository,
      reviewRepository,
      evidenceRepository,
      missionRepository,
      eventBus,
      sequence(['event-candidate-created', 'event-revision-created']),
      () => '2026-07-13T00:00:00.000Z',
    );

    eventBus.subscribe({
      eventType: 'KnowledgeCandidateCreated',
      handler: async (event) => {
        persistedSnapshots.push(
          (await knowledgeRepository.getById(String(event.payload.knowledgeId)))?.id.toString() ?? 'missing',
        );
      },
    });
    eventBus.subscribe({
      eventType: 'KnowledgeRevisionCreated',
      handler: async (event) => {
        persistedSnapshots.push(
          String((await knowledgeRepository.getById(String(event.payload.knowledgeId)))?.revisions.length),
        );
      },
    });

    await missionRepository.save(createCompletedMission());
    await evidenceRepository.register(createEvidence());
    await reviewRepository.create(createAcceptedReview());

    const captured = await service.captureKnowledge(captureKnowledgeInput());
    await service.reviseKnowledge({
      knowledgeId: captured.id,
      summary: 'KnowledgeService persists revisions before publication.',
    });

    expect(persistedSnapshots).toEqual(['knowledge-1', '2']);
  });

  it('does not publish Knowledge events when persistence fails', async () => {
    const reviewRepository = new InMemoryReviewRepository();
    const evidenceRepository = new InMemoryEvidenceRepository();
    const missionRepository = new InMemoryMissionRepository();
    const createFailureEventBus = new EventBus(new TestLogger());
    const failingCreateService = new KnowledgeService(
      new FailingCreateKnowledgeRepository(),
      reviewRepository,
      evidenceRepository,
      missionRepository,
      createFailureEventBus,
      sequence(['event-candidate-created']),
      () => '2026-07-13T00:00:00.000Z',
    );

    await missionRepository.save(createCompletedMission());
    await evidenceRepository.register(createEvidence());
    await reviewRepository.create(createAcceptedReview());

    await expect(failingCreateService.captureKnowledge(captureKnowledgeInput())).rejects.toThrow(
      'Create failed.',
    );
    expect(createFailureEventBus.replay('mission-1')).toEqual([]);

    const saveFailureEventBus = new EventBus(new TestLogger());
    const failingSaveRepository = new FailingSaveKnowledgeRepository();
    const failingSaveService = new KnowledgeService(
      failingSaveRepository,
      reviewRepository,
      evidenceRepository,
      missionRepository,
      saveFailureEventBus,
      sequence(['event-candidate-created', 'event-revision-created']),
      () => '2026-07-13T00:00:00.000Z',
    );
    const captured = await failingSaveService.captureKnowledge(captureKnowledgeInput());

    await expect(
      failingSaveService.reviseKnowledge({
        knowledgeId: captured.id,
        summary: 'KnowledgeService does not publish failed revisions.',
      }),
    ).rejects.toThrow('Save failed.');
    expect(saveFailureEventBus.replay('mission-1').map((event) => event.eventType)).toEqual([
      'KnowledgeCandidateCreated',
    ]);
  });

  it('publishes equivalent Knowledge transitions as equivalent events', async () => {
    const reviewRepository = new InMemoryReviewRepository();
    const evidenceRepository = new InMemoryEvidenceRepository();
    const missionRepository = new InMemoryMissionRepository();
    const eventBus = new EventBus(new TestLogger());
    const service = new KnowledgeService(
      new InMemoryKnowledgeRepository(),
      reviewRepository,
      evidenceRepository,
      missionRepository,
      eventBus,
      sequence(['event-candidate-1', 'event-candidate-2']),
      () => '2026-07-13T00:00:00.000Z',
    );

    await missionRepository.save(createCompletedMission());
    await evidenceRepository.register(createEvidence());
    await reviewRepository.create(createAcceptedReview());

    await service.captureKnowledge(captureKnowledgeInput());
    await service.captureKnowledge({
      ...captureKnowledgeInput(),
      id: 'knowledge-2',
    });

    expect(
      eventBus.replay('mission-1').map((event) => ({
        eventType: event.eventType,
        timestamp: event.timestamp,
        causality: event.causality,
        attribution: event.attribution,
        payload: {
          status: event.payload.status,
          scope: event.payload.scope,
          revisionNumber: event.payload.revisionNumber,
        },
      })),
    ).toEqual([
      {
        eventType: 'KnowledgeCandidateCreated',
        timestamp: '2026-07-13T00:00:00.000Z',
        causality: [],
        attribution: {
          missionId: 'mission-1',
          missionPlanRevisionId: 'revision-1',
        },
        payload: {
          status: 'Candidate',
          scope: 'Repository',
          revisionNumber: 1,
        },
      },
      {
        eventType: 'KnowledgeCandidateCreated',
        timestamp: '2026-07-13T00:00:00.000Z',
        causality: [],
        attribution: {
          missionId: 'mission-1',
          missionPlanRevisionId: 'revision-1',
        },
        payload: {
          status: 'Candidate',
          scope: 'Repository',
          revisionNumber: 1,
        },
      },
    ]);
  });

  it('requires an EventBusContract before mutating Knowledge state', async () => {
    const knowledgeRepository = new InMemoryKnowledgeRepository();
    const reviewRepository = new InMemoryReviewRepository();
    const evidenceRepository = new InMemoryEvidenceRepository();
    const missionRepository = new InMemoryMissionRepository();
    const service = new KnowledgeService(
      knowledgeRepository,
      reviewRepository,
      evidenceRepository,
      missionRepository,
    );

    await expect(service.captureKnowledge(captureKnowledgeInput())).rejects.toThrow(
      KnowledgeEventPublisherUnavailableError,
    );
    await expect(knowledgeRepository.enumerate()).resolves.toEqual([]);
  });

  it('wires KnowledgeService into Kernel service composition with shared repositories', () => {
    const services = createKernelServices(new EventBus(new TestLogger()));

    expect(services.map((service) => service.health().serviceName)).toContain('KnowledgeService');
  });
});
