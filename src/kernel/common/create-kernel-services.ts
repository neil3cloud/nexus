import { randomUUID } from 'node:crypto';

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
import { InMemoryEngineeringSessionCheckpointRepository } from '../execution/engineering-session-checkpoint.repository';
import { InMemoryEngineeringSessionRepository } from '../execution/engineering-session.repository';
import { EngineeringSessionService } from '../execution/engineering-session.service';
import { GovernanceGatedWorkflowAdvancementConsumer } from '../execution/governance-gated-workflow-advancement.consumer';
import { InMemoryExecutionSessionRepository } from '../execution/execution-session.repository';
import { ExecutionSessionService } from '../execution/execution-session.service';
import { InMemoryExecutionStrategyRepository } from '../execution/execution-strategy.repository';
import { ExecutionStrategyService } from '../execution/execution-strategy.service';
import { ExecutionService } from '../execution/execution.service';
import {
  InMemoryEngineeringSessionHandoffRepository,
  InMemoryMissionEngineeringGroupRepository,
} from '../execution/mission-engineering-orchestration.repository';
import { MissionEngineeringOrchestrationService } from '../execution/mission-engineering-orchestration.service';
import { RecoveryRequirementGovernanceDecisionConsumer } from '../execution/recovery-requirement-governance-decision.consumer';
import { InMemoryRecoveryRequirementRepository } from '../execution/recovery-requirement.repository';
import { RecoveryRequirementService } from '../execution/recovery-requirement.service';
import { InMemoryRoleAssignmentRepository } from '../execution/role-assignment.repository';
import { InMemoryRoleRegistry } from '../execution/role-registry';
import { RoleService } from '../execution/role.service';
import { InMemoryWorkflowChainRepository } from '../execution/workflow-chain.repository';
import { WorkflowChainService } from '../execution/workflow-chain.service';
import { InMemoryKnowledgeRepository } from '../knowledge/knowledge.repository';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { InMemoryGovernanceDecisionRepository } from '../governance/governance-decision.repository';
import { GovernanceService } from '../governance/governance.service';
import { InMemoryRatificationAuthoritySnapshotRepository } from '../governance/ratification-authority.repository';
import { RatificationAttributionValidationService } from '../governance/ratification-attribution-validation';
import { InMemoryRepositoryPolicyRepository } from '../governance/repository-policy.repository';
import { RepositoryPolicyService } from '../governance/repository-policy.service';
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
  const repositoryPolicyRepository = new InMemoryRepositoryPolicyRepository();
  const governanceDecisionRepository = new InMemoryGovernanceDecisionRepository();
  const ratificationAuthoritySnapshotRepository = new InMemoryRatificationAuthoritySnapshotRepository();
  const roleRegistry = new InMemoryRoleRegistry();
  const engineeringRoleProfileRegistry = new InMemoryEngineeringRoleProfileRegistry(
    createDefaultEngineeringRoleProfiles(),
  );
  const roleAssignmentRepository = new InMemoryRoleAssignmentRepository();
  const engineeringSessionRepository = new InMemoryEngineeringSessionRepository();
  const engineeringSessionCheckpointRepository = new InMemoryEngineeringSessionCheckpointRepository();
  const missionEngineeringGroupRepository = new InMemoryMissionEngineeringGroupRepository();
  const engineeringSessionHandoffRepository = new InMemoryEngineeringSessionHandoffRepository();
  const recoveryRequirementRepository = new InMemoryRecoveryRequirementRepository();
  const executionSessionRepository = new InMemoryExecutionSessionRepository();
  const workflowChainRepository = new InMemoryWorkflowChainRepository();
  const assignmentPolicyRepository = new InMemoryAssignmentPolicyRepository();
  const executionStrategyRepository = new InMemoryExecutionStrategyRepository();
  const adapterService = new AdapterService(adapterRegistry, ProtocolVersion.fromString('1.0'));
  const executionSessionService = new ExecutionSessionService(executionSessionRepository);
  const assignmentPolicyService = new AssignmentPolicyService(assignmentPolicyRepository);
  const repositoryPolicyService = new RepositoryPolicyService(repositoryPolicyRepository);
  const ratificationAttributionValidationService = new RatificationAttributionValidationService(
    ratificationAuthoritySnapshotRepository,
  );
  const governanceService = new GovernanceService(
    repositoryPolicyRepository,
    reviewRepository,
    governanceDecisionRepository,
    randomUUID,
    ratificationAttributionValidationService,
    eventBus,
  );
  const executionStrategyService = new ExecutionStrategyService(
    executionStrategyRepository,
    roleAssignmentRepository,
    missionRepository,
  );
  const engineeringSessionService = new EngineeringSessionService(
    engineeringSessionRepository,
    workflowChainRepository,
    randomUUID,
    () => new Date().toISOString(),
    executionStrategyService,
    adapterService,
    executionSessionService,
    assignmentPolicyService,
    engineeringSessionCheckpointRepository,
    governanceDecisionRepository,
    reviewRepository,
  );
  const missionEngineeringOrchestrationService = new MissionEngineeringOrchestrationService(
    missionEngineeringGroupRepository,
    engineeringSessionHandoffRepository,
    engineeringSessionRepository,
    randomUUID,
    () => new Date().toISOString(),
  );
  const recoveryRequirementService = new RecoveryRequirementService(
    recoveryRequirementRepository,
    eventBus,
  );

  return [
    adapterService,
    new MissionService(missionRepository, eventBus),
    new MissionPlanningService(missionRepository, eventBus),
    new MissionExecutionService(missionRepository, eventBus),
    new EvidenceService(evidenceRepository, eventBus),
    new ProjectionService(missionRepository, evidenceRepository),
    new RoleService(roleRegistry, roleAssignmentRepository),
    new EngineeringRoleProfileService(engineeringRoleProfileRegistry),
    engineeringSessionService,
    new GovernanceGatedWorkflowAdvancementConsumer(engineeringSessionService),
    missionEngineeringOrchestrationService,
    recoveryRequirementService,
    new RecoveryRequirementGovernanceDecisionConsumer(
      governanceDecisionRepository,
      recoveryRequirementRepository,
      randomUUID,
      eventBus,
    ),
    executionSessionService,
    new WorkflowChainService(workflowChainRepository),
    assignmentPolicyService,
    repositoryPolicyService,
    governanceService,
    ratificationAttributionValidationService,
    executionStrategyService,
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
