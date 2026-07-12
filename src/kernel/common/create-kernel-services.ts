import type { EventBusContract } from './event-bus-contract';
import { AdapterService } from '../adapter/adapter.service';
import { InMemoryAdapterRegistry } from '../adapter/adapter-registry';
import { ProtocolVersion } from '../adapter/protocol-version';
import { InMemoryEvidenceRepository } from '../evidence/evidence.repository';
import { EvidenceService } from '../evidence/evidence.service';
import { ExecutionService } from '../execution/execution.service';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { MissionExecutionService } from '../mission/mission-execution.service';
import { MissionPlanningService } from '../mission/mission-planning.service';
import { InMemoryMissionRepository } from '../mission/mission.repository';
import { MissionService } from '../mission/mission.service';
import { ReviewService } from '../review/review.service';
import { ProjectionService } from '../shared-reality/projection.service';
import type { IKernelService } from './kernel-service';

export function createKernelServices(eventBus: EventBusContract): readonly IKernelService[] {
  const adapterRegistry = new InMemoryAdapterRegistry();
  const missionRepository = new InMemoryMissionRepository();
  const evidenceRepository = new InMemoryEvidenceRepository();

  return [
    new AdapterService(adapterRegistry, ProtocolVersion.fromString('1.0')),
    new MissionService(missionRepository, eventBus),
    new MissionPlanningService(missionRepository),
    new MissionExecutionService(missionRepository, eventBus),
    new EvidenceService(evidenceRepository),
    new ProjectionService(missionRepository, evidenceRepository),
    new ExecutionService(),
    new ReviewService(),
    new KnowledgeService(),
  ];
}
