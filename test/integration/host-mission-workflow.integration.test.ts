import { describe, expect, it } from 'vitest';

import { MOCK_ADAPTER_ID, createMockAdapter } from '../../src/adapters/mock/mock-adapter';
import { AdapterService } from '../../src/kernel/adapter/adapter.service';
import { createKernelServices } from '../../src/kernel/common/create-kernel-services';
import type { IKernelService } from '../../src/kernel/common/kernel-service';
import type { KernelLogger } from '../../src/kernel/common/kernel-logger';
import { EvidenceService } from '../../src/kernel/evidence/evidence.service';
import { ExecutionStrategyService } from '../../src/kernel/execution/execution-strategy.service';
import { RoleService } from '../../src/kernel/execution/role.service';
import { Kernel } from '../../src/kernel/kernel';
import { KnowledgeService } from '../../src/kernel/knowledge/knowledge.service';
import { MissionExecutionService } from '../../src/kernel/mission/mission-execution.service';
import { MissionPlanningService } from '../../src/kernel/mission/mission-planning.service';
import { MissionService } from '../../src/kernel/mission/mission.service';
import { ReviewService } from '../../src/kernel/review/review.service';
import type {
  HostPresentationSurface,
  HostProgressOptions,
  HostWorkspaceTrustSurface,
} from '../../src/hosts/vscode/host.contract';
import { HostMissionWorkflow } from '../../src/hosts/vscode/host-mission-workflow';

describe('Sprint 25 Host Mission Workflow integration', () => {
  it('executes the Host to Kernel Mission workflow path through createKernelServices', async () => {
    let services: readonly IKernelService[] = [];
    const kernel = new Kernel((eventBus) => {
      services = createKernelServices(eventBus, { adapters: [createMockAdapter()] });

      return services;
    }, new NullLogger());
    const workflow = new HostMissionWorkflow(
      requireService(
        services,
        'MissionService',
        (service): service is MissionService => service instanceof MissionService,
      ),
      requireService(
        services,
        'MissionPlanningService',
        (service): service is MissionPlanningService => service instanceof MissionPlanningService,
      ),
      requireService(
        services,
        'MissionExecutionService',
        (service): service is MissionExecutionService => service instanceof MissionExecutionService,
      ),
      {
        roleService: requireService(
          services,
          'RoleService',
          (service): service is RoleService => service instanceof RoleService,
        ),
        executionStrategyService: requireService(
          services,
          'ExecutionStrategyService',
          (service): service is ExecutionStrategyService => service instanceof ExecutionStrategyService,
        ),
        adapterService: requireService(
          services,
          'AdapterService',
          (service): service is AdapterService => service instanceof AdapterService,
        ),
        adapterId: MOCK_ADAPTER_ID,
        requiredCapability: 'CodeModification',
      },
      {
        evidenceService: requireService(
          services,
          'EvidenceService',
          (service): service is EvidenceService => service instanceof EvidenceService,
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
      },
      new SilentPresentationSurface(),
      new StaticWorkspaceTrustSurface(true),
      createDeterministicIdentity([
        'integration-mission',
        'integration-plan',
        'integration-task',
        'integration-strategy',
        'integration-evidence',
        'integration-review',
        'integration-finding',
        'integration-knowledge',
      ]),
    );

    await kernel.initialize();

    const result = await workflow.runDeveloperMissionWorkflow({
      objective: 'Validate Sprint 25 Host Mission workflow integration.',
      taskTitle: 'Execute Sprint 25 integration task',
      taskDescription: 'Validate the Host calls public Kernel Mission contracts only.',
    });

    expect(result).toEqual({
      missionId: 'mission-integration-mission',
      missionPlanId: 'mission-plan-integration-plan',
      taskId: 'task-integration-task',
      finalStatus: 'Completed',
      missionPlanRevision: 3,
      taskStatus: 'Completed',
      adapterId: MOCK_ADAPTER_ID,
      adapterDispatchStatus: 'Completed',
      reviewOutcome: 'Accepted',
      knowledgeCaptureStatus: 'Candidate',
      knowledge: {
        id: 'knowledge-integration-knowledge',
        missionId: 'mission-integration-mission',
        missionPlanRevisionId: 'revision-3',
        summary: 'Sprint 27 completed the provider-independent Developer Workflow.',
        scope: 'Repository',
        status: 'Candidate',
        supportingEvidenceIds: ['evidence-integration-evidence'],
        supportingReviewId: 'review-integration-review',
        contributingEventIds: ['domain-event-mission-integration-mission-completion'],
        approvingAuthority: 'Sprint 27 Developer Workflow completion',
        attribution: {
          missionId: 'mission-integration-mission',
          missionPlanRevisionId: 'revision-3',
          supportingEvidenceIds: ['evidence-integration-evidence'],
          supportingReviewId: 'review-integration-review',
          contributingEventIds: ['domain-event-mission-integration-mission-completion'],
          approvingAuthority: 'Sprint 27 Developer Workflow completion',
        },
        provenance: {
          evidenceLineage: ['evidence-integration-evidence'],
          reviewLineage: 'review-integration-review',
          missionLineage: {
            missionId: 'mission-integration-mission',
            missionPlanRevisionId: 'revision-3',
          },
          approvalLineage: 'Sprint 27 Developer Workflow completion',
        },
        revisions: [
          {
            revisionNumber: 1,
            summary: 'Sprint 27 completed the provider-independent Developer Workflow.',
            attribution: {
              missionId: 'mission-integration-mission',
              missionPlanRevisionId: 'revision-3',
              supportingEvidenceIds: ['evidence-integration-evidence'],
              supportingReviewId: 'review-integration-review',
              contributingEventIds: ['domain-event-mission-integration-mission-completion'],
              approvingAuthority: 'Sprint 27 Developer Workflow completion',
            },
            provenance: {
              evidenceLineage: ['evidence-integration-evidence'],
              reviewLineage: 'review-integration-review',
              missionLineage: {
                missionId: 'mission-integration-mission',
                missionPlanRevisionId: 'revision-3',
              },
              approvalLineage: 'Sprint 27 Developer Workflow completion',
            },
          },
        ],
      },
    });
    expect(kernel.getEventBus().replay(result.missionId).map((event) => event.eventType)).toEqual([
      'MissionCreated',
      'MissionPlanCreated',
      'MissionPlanned',
      'TaskCreated',
      'MissionReady',
      'MissionStarted',
      'TaskStarted',
      'TaskCompleted',
      'MissionReviewed',
      'MissionCompleted',
      'EvidenceCaptured',
      'ReviewStarted',
      'FindingCreated',
      'ReviewCompleted',
      'ReviewAccepted',
      'KnowledgeCandidateCreated',
    ]);

    kernel.dispose();
  });
});

class SilentPresentationSurface implements HostPresentationSurface {
  public appendLine(): void {}

  public async showInformationMessage(): Promise<void> {}

  public async showErrorMessage(): Promise<void> {}

  public async withProgress<T>(_: HostProgressOptions, operation: () => Promise<T>): Promise<T> {
    return operation();
  }
}

class StaticWorkspaceTrustSurface implements HostWorkspaceTrustSurface {
  public constructor(private readonly trusted: boolean) {}

  public isWorkspaceTrusted(): boolean {
    return this.trusted;
  }
}

class NullLogger implements KernelLogger {
  public info(): void {}

  public error(): void {}
}

function createDeterministicIdentity(values: string[]): () => string {
  return () => {
    const value = values.shift();

    if (value === undefined) {
      throw new Error('No deterministic identity value remains.');
    }

    return value;
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
