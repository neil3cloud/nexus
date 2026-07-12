import type { EventBusContract } from './event-bus-contract';
import { EvidenceService } from '../evidence/evidence.service';
import { ExecutionService } from '../execution/execution.service';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { MissionExecutionService } from '../mission/mission-execution.service';
import { MissionPlanningService } from '../mission/mission-planning.service';
import { InMemoryMissionRepository } from '../mission/mission.repository';
import { MissionService } from '../mission/mission.service';
import { ReviewService } from '../review/review.service';
import { SharedRealityService } from '../shared-reality/shared-reality.service';
import type { IKernelService } from './kernel-service';

export function createKernelServices(eventBus: EventBusContract): readonly IKernelService[] {
  const missionRepository = new InMemoryMissionRepository();

  return [
    new MissionService(missionRepository, eventBus),
    new MissionPlanningService(missionRepository),
    new MissionExecutionService(missionRepository, eventBus),
    new EvidenceService(),
    new SharedRealityService(),
    new ExecutionService(),
    new ReviewService(),
    new KnowledgeService(),
  ];
}
