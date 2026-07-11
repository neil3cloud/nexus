import { EvidenceService } from '../evidence/evidence.service';
import { ExecutionService } from '../execution/execution.service';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { MissionService } from '../mission/mission.service';
import { ReviewService } from '../review/review.service';
import { SharedRealityService } from '../shared-reality/shared-reality.service';
import type { IKernelService } from './kernel-service';

export function createKernelServices(): readonly IKernelService[] {
  return [
    new MissionService(),
    new EvidenceService(),
    new SharedRealityService(),
    new ExecutionService(),
    new ReviewService(),
    new KnowledgeService(),
  ];
}
