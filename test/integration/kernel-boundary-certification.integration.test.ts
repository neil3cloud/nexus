import { readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';

import { describe, expect, it } from 'vitest';

import { AdapterRequest } from '../../src/kernel/adapter/adapter-request';
import { AdapterService } from '../../src/kernel/adapter/adapter.service';
import { AdapterNotFoundError } from '../../src/kernel/adapter/adapter.errors';
import type { IKernelService } from '../../src/kernel/common/kernel-service';
import type { KernelLogger } from '../../src/kernel/common/kernel-logger';
import { KernelError } from '../../src/kernel/common/kernel-error';
import { createKernelServices } from '../../src/kernel/common/create-kernel-services';
import { EvidenceService } from '../../src/kernel/evidence/evidence.service';
import { AssignmentPolicyService } from '../../src/kernel/execution/assignment-policy.service';
import { EngineeringRoleProfileService } from '../../src/kernel/execution/engineering-role-profile.service';
import { EngineeringSessionService } from '../../src/kernel/execution/engineering-session.service';
import { ExecutionSessionService } from '../../src/kernel/execution/execution-session.service';
import { ExecutionStrategyReferenceError } from '../../src/kernel/execution/execution-strategy.errors';
import { ExecutionStrategyService } from '../../src/kernel/execution/execution-strategy.service';
import { ExecutionService } from '../../src/kernel/execution/execution.service';
import { MissionEngineeringOrchestrationService } from '../../src/kernel/execution/mission-engineering-orchestration.service';
import { RoleService } from '../../src/kernel/execution/role.service';
import { WorkflowChainService } from '../../src/kernel/execution/workflow-chain.service';
import { Kernel } from '../../src/kernel/kernel';
import { GovernanceService } from '../../src/kernel/governance/governance.service';
import { RepositoryPolicyService } from '../../src/kernel/governance/repository-policy.service';
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

interface KernelHarness {
  readonly kernel: Kernel;
  readonly services: readonly IKernelService[];
  readonly adapterService: AdapterService;
  readonly missionService: MissionService;
  readonly planningService: MissionPlanningService;
  readonly missionExecutionService: MissionExecutionService;
  readonly evidenceService: EvidenceService;
  readonly projectionService: ProjectionService;
  readonly roleService: RoleService;
  readonly engineeringRoleProfileService: EngineeringRoleProfileService;
  readonly engineeringSessionService: EngineeringSessionService;
  readonly missionEngineeringOrchestrationService: MissionEngineeringOrchestrationService;
  readonly executionSessionService: ExecutionSessionService;
  readonly workflowChainService: WorkflowChainService;
  readonly assignmentPolicyService: AssignmentPolicyService;
  readonly repositoryPolicyService: RepositoryPolicyService;
  readonly governanceService: GovernanceService;
  readonly executionStrategyService: ExecutionStrategyService;
  readonly executionService: ExecutionService;
  readonly reviewService: ReviewService;
  readonly knowledgeService: KnowledgeService;
  readonly logger: TestLogger;
}

const expectedKernelServiceNames = [
  'AdapterService',
  'MissionService',
  'MissionPlanningService',
  'MissionExecutionService',
  'EvidenceService',
  'ProjectionService',
  'RoleService',
  'EngineeringRoleProfileService',
  'EngineeringSessionService',
  'MissionEngineeringOrchestrationService',
  'ExecutionSessionService',
  'WorkflowChainService',
  'AssignmentPolicyService',
  'RepositoryPolicyService',
  'GovernanceService',
  'ExecutionStrategyService',
  'ExecutionService',
  'ReviewService',
  'KnowledgeService',
] as const;

describe('RFC-0010 Kernel boundary certification', () => {
  it('composes every implemented bounded context through createKernelServices', async () => {
    const harness = await createHarness();

    expect(harness.services.map((service) => service.serviceName)).toEqual(expectedKernelServiceNames);
    expect(harness.kernel.health()).toEqual({
      initialized: true,
      services: expectedKernelServiceNames.map((serviceName) => ({
        serviceName,
        status: 'ready',
      })),
    });
    expect(typeof harness.engineeringSessionService.advanceWorkflowAfterReview).toBe('function');
    expect(typeof harness.engineeringSessionService.executeCurrentWorkflowStep).toBe('function');
    expect(typeof harness.engineeringSessionService.createCheckpoint).toBe('function');
    expect(typeof harness.engineeringSessionService.recoverFromCheckpoint).toBe('function');
    expect(typeof harness.engineeringSessionService.enumerateActiveEngineeringSessions).toBe('function');
    expect(
      typeof harness.missionEngineeringOrchestrationService.associateEngineeringSessionWithMission,
    ).toBe('function');
    expect(typeof harness.missionEngineeringOrchestrationService.recordEngineeringSessionHandoff).toBe(
      'function',
    );
    expect(harness.logger.errors).toEqual([]);
  });

  it('certifies successful composed-Kernel behavior through public service contracts', async () => {
    const harness = await createHarness();
    const workflow = await completeBoundaryWorkflow(harness, 'success');

    const roles = await harness.roleService.enumerateRoles();
    const profiles = await harness.engineeringRoleProfileService.enumerate();

    expect(roles.map((role) => role.id.toString())).toEqual([
      'builder',
      'documentation-reviewer',
      'reviewer',
    ]);
    expect(profiles.map((profile) => profile.roleId.toString())).toEqual([
      'builder',
      'documentation-reviewer',
      'reviewer',
    ]);
    expect((await harness.engineeringRoleProfileService.getById('builder')).toSnapshot()).toEqual({
      roleId: 'builder',
      workflowPresentationLabel: 'Builder Workflow',
      completionPresentationLabel: 'Builder workflow',
      includeAssignedRoleInPresentation: true,
    });
    expect(await harness.engineeringSessionService.enumerateEngineeringSessions()).toEqual([]);
    expect(await harness.executionSessionService.enumerateExecutionSessions()).toEqual([]);
    expect(await harness.workflowChainService.enumerateWorkflowChains()).toEqual([]);
    expect(await harness.assignmentPolicyService.enumerateAssignmentPolicies()).toEqual([]);
    expect(await harness.repositoryPolicyService.enumerateCurrentRepositoryPolicies()).toEqual([]);
    expect(harness.governanceService.serviceName).toBe('GovernanceService');

    const assignment = await harness.roleService.assignRole({
      taskId: workflow.firstTaskId,
      roleId: 'builder',
    });
    expect(assignment.toSnapshot()).toMatchObject({
      taskId: workflow.firstTaskId,
      roleId: 'builder',
    });

    const strategy = await harness.executionStrategyService.createExecutionStrategy({
      id: 'execution-strategy-sprint-18-success',
      missionId: workflow.missionId,
    });
    await expect(
      harness.executionStrategyService.evaluateAssignmentReadiness({
        executionStrategyId: strategy.id,
        missionPlanId: workflow.missionPlanId,
        taskId: workflow.firstTaskId,
      }),
    ).resolves.toMatchObject({
      executionStrategyId: strategy.id,
      missionId: workflow.missionId,
      missionPlanId: workflow.missionPlanId,
      taskId: workflow.firstTaskId,
      roleId: 'builder',
      ready: true,
    });

    expect(harness.executionService.serviceName).toBe('ExecutionService');
    expect(harness.logger.errors).toEqual([]);
  });

  it('certifies composed multi-agent orchestration without mutating EngineeringSession state', async () => {
    const harness = await createHarness();

    await harness.missionService.createMission({
      id: 'mission-sprint-51-boundary',
      objective: 'Certify Sprint 51 multi-agent orchestration composition.',
    });
    await harness.workflowChainService.createWorkflowChain({
      id: 'workflow-chain-sprint-51-boundary',
      steps: [{ roleId: 'builder' }, { roleId: 'reviewer' }],
    });
    const builderSession = await harness.engineeringSessionService.createEngineeringSession({
      id: 'engineering-session-sprint-51-builder',
      engineeringRuntimeContextReference: 'runtime-context-sprint-51-builder',
      activeEngineeringWorkflowReference: 'builder-workflow',
      workflowChainId: 'workflow-chain-sprint-51-boundary',
      currentWorkflowStepId: '0',
      participatingRoleIds: ['builder'],
      workflowState: 'active',
    });
    const reviewerSession = await harness.engineeringSessionService.createEngineeringSession({
      id: 'engineering-session-sprint-51-reviewer',
      engineeringRuntimeContextReference: 'runtime-context-sprint-51-reviewer',
      activeEngineeringWorkflowReference: 'reviewer-workflow',
      workflowChainId: 'workflow-chain-sprint-51-boundary',
      currentWorkflowStepId: '1',
      participatingRoleIds: ['reviewer'],
      workflowState: 'active',
    });

    await harness.missionEngineeringOrchestrationService.associateEngineeringSessionWithMission({
      missionId: 'mission-sprint-51-boundary',
      engineeringSessionId: builderSession.id,
    });
    const group =
      await harness.missionEngineeringOrchestrationService.associateEngineeringSessionWithMission({
        missionId: 'mission-sprint-51-boundary',
        engineeringSessionId: reviewerSession.id,
      });
    const handoff =
      await harness.missionEngineeringOrchestrationService.recordEngineeringSessionHandoff({
        handoffId: 'handoff-sprint-51-boundary',
        missionId: 'mission-sprint-51-boundary',
        sourceEngineeringSessionId: builderSession.id,
        sourceRoleId: 'builder',
        targetEngineeringSessionId: reviewerSession.id,
        targetRoleId: 'reviewer',
      });

    expect(group.engineeringSessionIds).toEqual([
      'engineering-session-sprint-51-builder',
      'engineering-session-sprint-51-reviewer',
    ]);
    expect(handoff).toMatchObject({
      id: 'handoff-sprint-51-boundary',
      missionId: 'mission-sprint-51-boundary',
      sourceEngineeringSessionId: builderSession.id,
      targetEngineeringSessionId: reviewerSession.id,
      status: 'Recorded',
    });
    await expect(
      harness.engineeringSessionService.getEngineeringSession(builderSession.id),
    ).resolves.toEqual(builderSession);
    await expect(
      harness.engineeringSessionService.getEngineeringSession(reviewerSession.id),
    ).resolves.toEqual(reviewerSession);
    expect(harness.logger.errors).toEqual([]);
  });

  it('rejects invalid cross-boundary interactions without corrupting repositories or publishing unintended events', async () => {
    const harness = await createHarness();
    const leftWorkflow = await createExecutableMissionPlan(harness, 'left-boundary');
    const rightWorkflow = await createExecutableMissionPlan(harness, 'right-boundary');

    await harness.roleService.assignRole({
      taskId: rightWorkflow.firstTaskId,
      roleId: 'reviewer',
    });
    const strategy = await harness.executionStrategyService.createExecutionStrategy({
      id: 'execution-strategy-sprint-18-left-boundary',
      missionId: leftWorkflow.missionId,
    });
    const beforeRightEvents = eventTypes(harness, rightWorkflow.missionId);
    const beforeStrategies = await harness.executionStrategyService.enumerateExecutionStrategies();

    await expect(
      harness.executionStrategyService.evaluateAssignmentReadiness({
        executionStrategyId: strategy.id,
        missionPlanId: rightWorkflow.missionPlanId,
        taskId: rightWorkflow.firstTaskId,
      }),
    ).rejects.toBeInstanceOf(ExecutionStrategyReferenceError);
    expect(eventTypes(harness, rightWorkflow.missionId)).toEqual(beforeRightEvents);
    await expect(harness.executionStrategyService.enumerateExecutionStrategies()).resolves.toEqual(
      beforeStrategies,
    );

    const beforeLeftEvents = eventTypes(harness, leftWorkflow.missionId);
    await expect(
      harness.adapterService.dispatch({
        adapterId: 'adapter-sprint-18-not-registered',
        request: AdapterRequest.create({
          engineeringRole: 'builder',
          taskId: leftWorkflow.firstTaskId,
          contextPackageReference: 'context-package-sprint-18',
        }),
        requiredCapability: 'CodeModification',
      }),
    ).rejects.toBeInstanceOf(AdapterNotFoundError);
    expect(eventTypes(harness, leftWorkflow.missionId)).toEqual(beforeLeftEvents);

    await expect(
      harness.kernel.getEventBus().publish({
        eventId: 'event-sprint-18-mismatched-attribution',
        missionId: leftWorkflow.missionId,
        eventType: 'MissionCreated',
        timestamp: '2026-07-13T00:00:00.000Z',
        causality: [],
        attribution: {
          missionId: rightWorkflow.missionId,
        },
        payload: {},
      }),
    ).rejects.toBeInstanceOf(KernelError);
    expect(eventTypes(harness, leftWorkflow.missionId)).toEqual(beforeLeftEvents);
    expect(eventTypes(harness, rightWorkflow.missionId)).toEqual(beforeRightEvents);
    expect(harness.logger.errors).toEqual([]);
  });

  it(
    'certifies Kernel source dependencies do not cross into Host, UI, infrastructure, or adapter implementations',
    () => {
      const kernelRoot = resolve(process.cwd(), 'src', 'kernel');
      const violations = collectSourceFiles(kernelRoot)
        .flatMap((filePath) =>
          collectRelativeImports(filePath).map((specifier) => ({
            filePath,
            specifier,
            resolvedPath: resolve(dirname(filePath), specifier),
          })),
        )
        .filter((dependency) => !isWithinDirectory(dependency.resolvedPath, kernelRoot))
        .map((dependency) =>
          `${toProjectPath(dependency.filePath)} imports '${dependency.specifier}' -> ${toProjectPath(dependency.resolvedPath)}`,
        );

      expect(violations).toEqual([]);
    },
    10_000,
  );
});

async function createHarness(): Promise<KernelHarness> {
  const logger = new TestLogger();
  let services: readonly IKernelService[] = [];
  const kernel = new Kernel((eventBus) => {
    services = createKernelServices(eventBus);

    return services;
  }, logger);

  await kernel.initialize();

  return {
    kernel,
    services,
    adapterService: requireService(
      services,
      'AdapterService',
      (service): service is AdapterService => service instanceof AdapterService,
    ),
    missionService: requireService(
      services,
      'MissionService',
      (service): service is MissionService => service instanceof MissionService,
    ),
    planningService: requireService(
      services,
      'MissionPlanningService',
      (service): service is MissionPlanningService => service instanceof MissionPlanningService,
    ),
    missionExecutionService: requireService(
      services,
      'MissionExecutionService',
      (service): service is MissionExecutionService => service instanceof MissionExecutionService,
    ),
    evidenceService: requireService(
      services,
      'EvidenceService',
      (service): service is EvidenceService => service instanceof EvidenceService,
    ),
    projectionService: requireService(
      services,
      'ProjectionService',
      (service): service is ProjectionService => service instanceof ProjectionService,
    ),
    roleService: requireService(
      services,
      'RoleService',
      (service): service is RoleService => service instanceof RoleService,
    ),
    engineeringRoleProfileService: requireService(
      services,
      'EngineeringRoleProfileService',
      (service): service is EngineeringRoleProfileService =>
        service instanceof EngineeringRoleProfileService,
    ),
    engineeringSessionService: requireService(
      services,
      'EngineeringSessionService',
      (service): service is EngineeringSessionService => service instanceof EngineeringSessionService,
    ),
    missionEngineeringOrchestrationService: requireService(
      services,
      'MissionEngineeringOrchestrationService',
      (service): service is MissionEngineeringOrchestrationService =>
        service instanceof MissionEngineeringOrchestrationService,
    ),
    executionSessionService: requireService(
      services,
      'ExecutionSessionService',
      (service): service is ExecutionSessionService => service instanceof ExecutionSessionService,
    ),
    workflowChainService: requireService(
      services,
      'WorkflowChainService',
      (service): service is WorkflowChainService => service instanceof WorkflowChainService,
    ),
    assignmentPolicyService: requireService(
      services,
      'AssignmentPolicyService',
      (service): service is AssignmentPolicyService => service instanceof AssignmentPolicyService,
    ),
    repositoryPolicyService: requireService(
      services,
      'RepositoryPolicyService',
      (service): service is RepositoryPolicyService => service instanceof RepositoryPolicyService,
    ),
    governanceService: requireService(
      services,
      'GovernanceService',
      (service): service is GovernanceService => service instanceof GovernanceService,
    ),
    executionStrategyService: requireService(
      services,
      'ExecutionStrategyService',
      (service): service is ExecutionStrategyService => service instanceof ExecutionStrategyService,
    ),
    executionService: requireService(
      services,
      'ExecutionService',
      (service): service is ExecutionService => service instanceof ExecutionService,
    ),
    reviewService: requireService(
      services,
      'ReviewService',
      (service): service is ReviewService => service instanceof ReviewService,
    ),
    knowledgeService: requireService(
      services,
      'KnowledgeService',
      (service): service is KnowledgeService => service instanceof KnowledgeService,
    ),
    logger,
  };
}

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

async function completeBoundaryWorkflow(
  harness: KernelHarness,
  suffix: string,
): Promise<BoundaryWorkflow> {
  const workflow = await createExecutableMissionPlan(harness, suffix);
  const evidenceId = `evidence-sprint-18-${suffix}`;
  const reviewId = `review-sprint-18-${suffix}`;
  const knowledgeId = `knowledge-sprint-18-${suffix}`;

  await harness.missionService.markMissionReady(workflow.missionId);
  await harness.missionExecutionService.startMission({ missionId: workflow.missionId });
  await harness.missionExecutionService.startTask({
    missionId: workflow.missionId,
    taskId: workflow.firstTaskId,
  });
  await harness.missionExecutionService.completeTask({
    missionId: workflow.missionId,
    taskId: workflow.firstTaskId,
  });
  await harness.missionExecutionService.startTask({
    missionId: workflow.missionId,
    taskId: workflow.secondTaskId,
  });
  await harness.missionExecutionService.completeTask({
    missionId: workflow.missionId,
    taskId: workflow.secondTaskId,
  });
  await harness.evidenceService.registerEvidence(createEvidenceRequest(evidenceId, workflow.missionId));
  const projection = await harness.projectionService.project({
    missionId: workflow.missionId,
    evidence: [{ id: evidenceId, version: 1 }],
  });
  await harness.missionService.reviewMission(workflow.missionId);
  await harness.missionExecutionService.completeMission({ missionId: workflow.missionId });
  const review = await harness.reviewService.startReview({
    id: reviewId,
    missionId: workflow.missionId,
    missionPlanRevision: `revision-${workflow.readyRevisionNumber}`,
    reviewCriteria: [
      {
        id: 'sprint-18-boundary-certification',
        description: 'Sprint 18 RFC-0010 Kernel boundary certification.',
      },
    ],
    evidenceReferences: [evidenceId],
  });
  await harness.reviewService.finalizeReviewOutcome({
    reviewId: review.id,
    outcome: 'Accepted',
  });
  const knowledge = await harness.knowledgeService.captureKnowledge({
    id: knowledgeId,
    missionId: workflow.missionId,
    missionPlanRevisionId: review.missionPlanRevision,
    summary: 'Sprint 18 certified the composed Kernel boundary.',
    scope: 'Repository',
    supportingEvidenceIds: [evidenceId],
    supportingReviewId: review.id,
    contributingEventIds: eventIds(harness, workflow.missionId),
    approvingAuthority: 'Sprint 18 boundary certification',
  });

  expect(projection.missionExecutionState.tasks).toEqual([
    { id: workflow.firstTaskId, status: 'Completed' },
    { id: workflow.secondTaskId, status: 'Completed' },
  ]);
  expect(knowledge.status).toBe('Candidate');
  expect(eventTypes(harness, workflow.missionId)).toEqual([
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

  return workflow;
}

async function createExecutableMissionPlan(
  harness: KernelHarness,
  suffix: string,
): Promise<BoundaryWorkflow> {
  const missionId = `mission-sprint-18-${suffix}`;
  const missionPlanId = `mission-plan-sprint-18-${suffix}`;
  const firstTaskId = `task-sprint-18-${suffix}-first`;
  const secondTaskId = `task-sprint-18-${suffix}-second`;

  await harness.missionService.createMission({
    id: missionId,
    objective: `Certify Sprint 18 Kernel boundary behavior for ${suffix}.`,
  });
  await harness.planningService.createMissionPlan({
    id: missionPlanId,
    missionId,
    revisionReason: 'Create Sprint 18 boundary-certification MissionPlan.',
    revisionMetadata: {
      sprint: 'Sprint 18',
    },
  });
  await harness.missionService.planMission(missionId);
  await harness.planningService.addTask({
    missionPlanId,
    taskId: firstTaskId,
    title: 'Certify initial boundary behavior',
    description: 'Validate public service contract interaction.',
    revisionReason: 'Add first Sprint 18 boundary-certification Task.',
    revisionMetadata: {
      sprint: 'Sprint 18',
    },
  });
  await harness.planningService.addTask({
    missionPlanId,
    taskId: secondTaskId,
    title: 'Certify dependent boundary behavior',
    description: 'Validate repository coordination and dependency preservation.',
    dependencies: [firstTaskId],
    revisionReason: 'Add dependent Sprint 18 boundary-certification Task.',
    revisionMetadata: {
      sprint: 'Sprint 18',
    },
  });
  await harness.planningService.updateTask({
    missionPlanId,
    taskId: firstTaskId,
    status: 'Ready',
    revisionReason: 'Mark first Sprint 18 Task ready.',
    revisionMetadata: {
      sprint: 'Sprint 18',
    },
  });
  const readyPlan = await harness.planningService.updateTask({
    missionPlanId,
    taskId: secondTaskId,
    status: 'Ready',
    revisionReason: 'Mark dependent Sprint 18 Task ready.',
    revisionMetadata: {
      sprint: 'Sprint 18',
    },
  });

  return {
    missionId,
    missionPlanId,
    firstTaskId,
    secondTaskId,
    readyRevisionNumber: readyPlan.revisionNumber,
  };
}

interface BoundaryWorkflow {
  readonly missionId: string;
  readonly missionPlanId: string;
  readonly firstTaskId: string;
  readonly secondTaskId: string;
  readonly readyRevisionNumber: number;
}

function createEvidenceRequest(id: string, missionId: string) {
  return {
    id,
    missionId,
    type: 'TestResult',
    version: 1,
    hash: `sha256:${id}`,
    metadata: {
      capturedAt: '2026-07-13T00:00:00.000Z',
      attributes: {
        sprint: 'Sprint 18',
      },
    },
    provenance: {
      source: 'vitest',
      acquisitionMethod: 'integration-test',
      acquiredAt: '2026-07-13T00:00:00.000Z',
      actor: 'builder',
      system: 'nexus',
      verificationStatus: 'Verified',
    },
  } as const;
}

function eventTypes(harness: KernelHarness, missionId: string): readonly string[] {
  return harness.kernel.getEventBus().replay(missionId).map((event) => event.eventType);
}

function eventIds(harness: KernelHarness, missionId: string): readonly string[] {
  return harness.kernel.getEventBus().replay(missionId).map((event) => event.eventId);
}

function collectSourceFiles(directoryPath: string): readonly string[] {
  return readdirSync(directoryPath, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = resolve(directoryPath, entry.name);

      if (entry.isDirectory()) {
        return collectSourceFiles(entryPath);
      }

      return entry.isFile() && entry.name.endsWith('.ts') ? [entryPath] : [];
    })
    .sort((left, right) => left.localeCompare(right));
}

function collectRelativeImports(filePath: string): readonly string[] {
  const sourceText = readFileSync(filePath, 'utf8');
  const importPattern =
    /(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?['"](?<specifier>[^'"]+)['"]/g;
  const specifiers: string[] = [];

  for (const match of sourceText.matchAll(importPattern)) {
    const specifier = match.groups?.specifier;

    if (specifier !== undefined && specifier.startsWith('.')) {
      specifiers.push(specifier);
    }
  }

  return specifiers;
}

function isWithinDirectory(childPath: string, parentPath: string): boolean {
  const normalizedParent = parentPath.endsWith(sep) ? parentPath : `${parentPath}${sep}`;

  return childPath === parentPath || childPath.startsWith(normalizedParent);
}

function toProjectPath(filePath: string): string {
  return filePath.replace(`${process.cwd()}${sep}`, '');
}
