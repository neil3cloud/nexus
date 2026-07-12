import { randomUUID } from 'node:crypto';

import { ServiceLifecycle } from '../common/service-lifecycle';
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
import { KnowledgeNotFoundError } from './knowledge.errors';
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
    private readonly createIdentity: () => string = randomUUID,
  ) {
    super('KnowledgeService');
  }

  public async captureKnowledge(request: KnowledgeCaptureRequest): Promise<KnowledgeSnapshot> {
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
    );

    await this.repository.create(knowledge);

    return knowledge.toSnapshot();
  }

  public async reviseKnowledge(request: ReviseKnowledgeRequest): Promise<KnowledgeSnapshot> {
    const knowledge = await this.requireKnowledge(request.knowledgeId);
    const revisedKnowledge = knowledge.revise({ summary: request.summary });

    await this.repository.save(revisedKnowledge);

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
}

function isEvidence(evidence: Evidence | undefined): evidence is Evidence {
  return evidence !== undefined;
}
