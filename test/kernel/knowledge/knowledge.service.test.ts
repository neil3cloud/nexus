import { describe, expect, it } from 'vitest';

import { InMemoryEvidenceRepository } from '../../../src/kernel/evidence/evidence.repository';
import { EventBus } from '../../../src/kernel/events/event-bus';
import { createKernelServices } from '../../../src/kernel/common/create-kernel-services';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';
import { InMemoryMissionRepository } from '../../../src/kernel/mission/mission.repository';
import { InMemoryReviewRepository } from '../../../src/kernel/review/review.repository';
import { InMemoryKnowledgeRepository } from '../../../src/kernel/knowledge/knowledge.repository';
import { KnowledgeService } from '../../../src/kernel/knowledge/knowledge.service';
import {
  DuplicateKnowledgeError,
  KnowledgeCapturePreconditionError,
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

describe('KnowledgeService', () => {
  it('coordinates capture, revision, retrieval, and enumeration through repositories', async () => {
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
  });

  it('uses injected identity generation without adapter, provider, or event publication concepts', async () => {
    const reviewRepository = new InMemoryReviewRepository();
    const evidenceRepository = new InMemoryEvidenceRepository();
    const missionRepository = new InMemoryMissionRepository();
    const eventBus = new EventBus(new TestLogger());
    const service = new KnowledgeService(
      new InMemoryKnowledgeRepository(),
      reviewRepository,
      evidenceRepository,
      missionRepository,
      () => 'generated-knowledge',
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
    expect(eventBus.replay('mission-1')).toEqual([]);
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

  it('wires KnowledgeService into Kernel service composition with shared repositories', () => {
    const services = createKernelServices(new EventBus(new TestLogger()));

    expect(services.map((service) => service.health().serviceName)).toContain('KnowledgeService');
  });
});
