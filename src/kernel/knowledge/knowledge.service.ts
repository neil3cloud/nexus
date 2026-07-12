import { randomUUID } from 'node:crypto';

import { ServiceLifecycle } from '../common/service-lifecycle';
import type { EventBusContract } from '../common/event-bus-contract';
import type { Evidence } from '../evidence/evidence.aggregate';
import { EvidenceId } from '../evidence/evidence-id';
import type { IEvidenceRepository } from '../evidence/evidence.repository';
import { MissionId } from '../mission/mission-id';
import type { IMissionRepository } from '../mission/mission.repository';
import type { IReviewRepository } from '../review/review.repository';
import { Knowledge } from './knowledge.aggregate';
import type {
  KnowledgeCaptureRequest,
  KnowledgeServiceContract,
  QueryKnowledgeRequest,
  ReviseKnowledgeRequest,
} from './knowledge.contract';
import {
  KnowledgeEventPublisherUnavailableError,
  KnowledgeNotFoundError,
} from './knowledge.errors';
import { KnowledgeId } from './knowledge-id';
import {
  InMemoryKnowledgeRepository,
  type IKnowledgeRepository,
} from './knowledge.repository';
import type { KnowledgeSnapshot } from './knowledge.types';

export class KnowledgeService extends ServiceLifecycle implements KnowledgeServiceContract {
  public constructor(
    private readonly repository: IKnowledgeRepository = new InMemoryKnowledgeRepository(),
    private readonly reviewRepository?: IReviewRepository,
    private readonly evidenceRepository?: IEvidenceRepository,
    private readonly missionRepository?: IMissionRepository,
    private readonly eventBus?: EventBusContract,
    private readonly createIdentity: () => string = randomUUID,
    private readonly createTimestamp: () => string = () => new Date().toISOString(),
  ) {
    super('KnowledgeService');
  }

  public async captureKnowledge(request: KnowledgeCaptureRequest): Promise<KnowledgeSnapshot> {
    const eventBus = this.requireEventBus();
    const supportingReview = await this.reviewRepository?.getById(request.supportingReviewId);
    const supportingEvidence = await Promise.all(
      request.supportingEvidenceIds.map(async (evidenceId) =>
        this.evidenceRepository?.getById(EvidenceId.fromString(evidenceId)),
      ),
    );
    const mission = await this.missionRepository?.getById(MissionId.fromString(request.missionId));
    const knowledge = Knowledge.capture(
      {
        id: request.id ?? this.createIdentity(),
        missionId: request.missionId,
        missionPlanRevisionId: request.missionPlanRevisionId,
        summary: request.summary,
        scope: request.scope,
        supportingEvidenceIds: request.supportingEvidenceIds,
        supportingReviewId: request.supportingReviewId,
        contributingEventIds: request.contributingEventIds,
        approvingAuthority: request.approvingAuthority,
      },
      {
        ...(mission === undefined ? {} : { mission }),
        supportingEvidence: supportingEvidence.filter(isEvidence),
        ...(supportingReview === undefined ? {} : { supportingReview }),
      },
      this.createEventMetadata(),
    );

    await this.repository.create(knowledge);
    await this.publishRecordedEvents(knowledge, eventBus);

    return knowledge.toSnapshot();
  }

  public async reviseKnowledge(request: ReviseKnowledgeRequest): Promise<KnowledgeSnapshot> {
    const eventBus = this.requireEventBus();
    const knowledge = await this.requireKnowledge(request.knowledgeId);
    const revisedKnowledge = knowledge.revise(
      { summary: request.summary },
      this.createEventMetadata(),
    );

    await this.repository.save(revisedKnowledge);
    await this.publishRecordedEvents(revisedKnowledge, eventBus);

    return revisedKnowledge.toSnapshot();
  }

  public async retrieveKnowledge(request: QueryKnowledgeRequest): Promise<KnowledgeSnapshot> {
    return (await this.requireKnowledge(request.knowledgeId)).toSnapshot();
  }

  public async enumerateKnowledge(): Promise<readonly KnowledgeSnapshot[]> {
    return Object.freeze((await this.repository.enumerate()).map((knowledge) => knowledge.toSnapshot()));
  }

  private async requireKnowledge(knowledgeId: KnowledgeId | string): Promise<Knowledge> {
    const normalizedKnowledgeId =
      typeof knowledgeId === 'string' ? KnowledgeId.fromString(knowledgeId) : knowledgeId;
    const knowledge = await this.repository.getById(normalizedKnowledgeId);

    if (knowledge === undefined) {
      throw new KnowledgeNotFoundError(normalizedKnowledgeId.toString());
    }

    return knowledge;
  }

  private createEventMetadata(): {
    readonly eventId: string;
    readonly timestamp: string;
  } {
    return {
      eventId: this.createIdentity(),
      timestamp: this.createTimestamp(),
    };
  }

  private async publishRecordedEvents(
    knowledge: Knowledge,
    eventBus: EventBusContract,
  ): Promise<void> {
    for (const event of knowledge.pullDomainEvents()) {
      await eventBus.publish(event);
    }
  }

  private requireEventBus(): EventBusContract {
    if (this.eventBus === undefined) {
      throw new KnowledgeEventPublisherUnavailableError();
    }

    return this.eventBus;
  }
}

function isEvidence(evidence: Evidence | undefined): evidence is Evidence {
  return evidence !== undefined;
}
