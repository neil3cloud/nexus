import type { EventBusContract } from './event-bus-contract';
import type { Adapter } from '../adapter/adapter.contract';
import { AdapterService } from '../adapter/adapter.service';
import { InMemoryAdapterRegistry } from '../adapter/adapter-registry';
import { ProtocolVersion } from '../adapter/protocol-version';
import { InMemoryEvidenceRepository } from '../evidence/evidence.repository';
import { EvidenceService } from '../evidence/evidence.service';
import { InMemoryAssignmentPolicyRepository } from '../execution/assignment-policy.repository';
import { AssignmentPolicyService } from '../execution/assignment-policy.service';
import { createDefaultEngineeringRoleProfiles } from '../execution/default-engineering-role-profiles';
import { InMemoryEngineeringRoleProfileRegistry } from '../execution/engineering-role-profile-registry';
import { EngineeringRoleProfileService } from '../execution/engineering-role-profile.service';
import { InMemoryEngineeringSessionRepository } from '../execution/engineering-session.repository';
import { EngineeringSessionService } from '../execution/engineering-session.service';
import { InMemoryExecutionSessionRepository } from '../execution/execution-session.repository';
import { ExecutionSessionService } from '../execution/execution-session.service';
import { InMemoryExecutionStrategyRepository } from '../execution/execution-strategy.repository';
import { ExecutionStrategyService } from '../execution/execution-strategy.service';
import { ExecutionService } from '../execution/execution.service';
import { InMemoryRoleAssignmentRepository } from '../execution/role-assignment.repository';
import { InMemoryRoleRegistry } from '../execution/role-registry';
import { RoleService } from '../execution/role.service';
import { InMemoryWorkflowChainRepository } from '../execution/workflow-chain.repository';
import { WorkflowChainService } from '../execution/workflow-chain.service';
import { InMemoryKnowledgeRepository } from '../knowledge/knowledge.repository';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { MissionExecutionService } from '../mission/mission-execution.service';
import { MissionPlanningService } from '../mission/mission-planning.service';
import { InMemoryMissionRepository } from '../mission/mission.repository';
import { MissionService } from '../mission/mission.service';
import { InMemoryReviewRepository } from '../review/review.repository';
import { ReviewService } from '../review/review.service';
import { ProjectionService } from '../shared-reality/projection.service';
import type { IKernelService } from './kernel-service';

export interface KernelServiceCompositionOptions {
  readonly adapters?: readonly Adapter[];
}

export function createKernelServices(
  eventBus: EventBusContract,
  options: KernelServiceCompositionOptions = {},
): readonly IKernelService[] {
  const adapterRegistry = new InMemoryAdapterRegistry(options.adapters ?? []);
  const missionRepository = new InMemoryMissionRepository();
  const evidenceRepository = new InMemoryEvidenceRepository();
  const reviewRepository = new InMemoryReviewRepository();
  const knowledgeRepository = new InMemoryKnowledgeRepository();
  const roleRegistry = new InMemoryRoleRegistry();
  const engineeringRoleProfileRegistry = new InMemoryEngineeringRoleProfileRegistry(
    createDefaultEngineeringRoleProfiles(),
  );
  const roleAssignmentRepository = new InMemoryRoleAssignmentRepository();
  const engineeringSessionRepository = new InMemoryEngineeringSessionRepository();
  const executionSessionRepository = new InMemoryExecutionSessionRepository();
  const workflowChainRepository = new InMemoryWorkflowChainRepository();
  const assignmentPolicyRepository = new InMemoryAssignmentPolicyRepository();
  const executionStrategyRepository = new InMemoryExecutionStrategyRepository();

  return [
    new AdapterService(adapterRegistry, ProtocolVersion.fromString('1.0')),
    new MissionService(missionRepository, eventBus),
    new MissionPlanningService(missionRepository, eventBus),
    new MissionExecutionService(missionRepository, eventBus),
    new EvidenceService(evidenceRepository, eventBus),
    new ProjectionService(missionRepository, evidenceRepository),
    new RoleService(roleRegistry, roleAssignmentRepository),
    new EngineeringRoleProfileService(engineeringRoleProfileRegistry),
    new EngineeringSessionService(engineeringSessionRepository, workflowChainRepository),
    new ExecutionSessionService(executionSessionRepository),
    new WorkflowChainService(workflowChainRepository),
    new AssignmentPolicyService(assignmentPolicyRepository),
    new ExecutionStrategyService(
      executionStrategyRepository,
      roleAssignmentRepository,
      missionRepository,
    ),
    new ExecutionService(),
    new ReviewService(reviewRepository, eventBus),
    new KnowledgeService(
      knowledgeRepository,
      reviewRepository,
      evidenceRepository,
      missionRepository,
      eventBus,
    ),
  ];
}
