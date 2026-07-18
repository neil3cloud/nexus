import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  CODEX_CLI_ADAPTER_ID,
  CodexCliAdapter,
} from '../../src/adapters/codex/codex-cli-adapter';
import { createMockAdapter } from '../../src/adapters/mock/mock-adapter';
import { LocalProcessRuntime } from '../../src/adapters/runtime/local-process-runtime';
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
import { HostMissionWorkflowError } from '../../src/hosts/vscode/host-mission-workflow.errors';

const testDoublePath = join(process.cwd(), 'test', 'adapters', 'codex', 'codex-cli-test-double.cjs');

describe('Sprint 32 Codex CLI Developer Workflow integration', () => {
  it('executes the complete Developer Workflow through CodexCliAdapter by explicit adapterId', async () => {
    const { kernel, workflow } = createCodexWorkflow([
      'codex-success-mission',
      'codex-success-plan',
      'codex-success-task',
      'codex-success-strategy',
      'codex-success-evidence',
      'codex-success-review',
      'codex-success-finding',
      'codex-success-knowledge',
    ]);

    await kernel.initialize();

    try {
      const result = await workflow.runDeveloperMissionWorkflow({
        objective: 'Validate Sprint 32 Codex CLI Developer Workflow integration.',
        taskTitle: 'Execute Codex CLI workflow task',
        taskDescription: 'Exercise the certified workflow through CodexCliAdapter.',
      });

      expect(result).toMatchObject({
        missionId: 'mission-codex-success-mission',
        finalStatus: 'Completed',
        taskStatus: 'Completed',
        adapterId: CODEX_CLI_ADAPTER_ID,
        adapterDispatchStatus: 'Completed',
        reviewOutcome: 'Accepted',
        knowledgeCaptureStatus: 'Candidate',
      });
      expect(result.knowledge.id).toBe('knowledge-codex-success-knowledge');
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
      expect(workflow.showMissionWorkflowHistory()).toEqual([
        {
          missionId: 'mission-codex-success-mission',
          objective: 'Validate Sprint 32 Codex CLI Developer Workflow integration.',
          finalStatus: 'Completed',
          adapterId: CODEX_CLI_ADAPTER_ID,
          adapterDispatchStatus: 'Completed',
          reviewOutcome: 'Accepted',
          knowledgeCaptureStatus: 'Candidate',
        },
      ]);
    } finally {
      kernel.dispose();
    }
  });

  it('stops deterministically on CodexCliAdapter failure without completing the Task', async () => {
    const presentation = new RecordingPresentationSurface();
    const { kernel, workflow } = createCodexWorkflow(
      [
        'codex-failure-mission',
        'codex-failure-plan',
        'codex-failure-task',
        'codex-failure-strategy',
      ],
      presentation,
    );

    await kernel.initialize();

    try {
      await expect(
        workflow.runDeveloperMissionWorkflow({
          objective: 'Validate Sprint 32 Codex CLI failure handling.',
          taskTitle: 'Execute failing Codex CLI workflow task',
          taskDescription: 'Exercise the deterministic Codex test-double failure path.',
          adapterExecutionConstraints: {
            'codexCliAdapter.testDoubleResult': 'FailedResponse',
          },
        }),
      ).rejects.toMatchObject({
        code: 'host-mission-workflow.adapter-dispatch-failed',
      } satisfies Partial<HostMissionWorkflowError>);

      expect(workflow.showMissionWorkflowHistory()).toEqual([
        {
          missionId: 'mission-codex-failure-mission',
          objective: 'Validate Sprint 32 Codex CLI failure handling.',
          finalStatus: 'Executing',
          adapterId: CODEX_CLI_ADAPTER_ID,
          adapterDispatchStatus: 'Failed',
        },
      ]);
      expect(presentation.lines).toContain(
        'Adapter Diagnostic test-double.failed: Deterministic Codex CLI test-double returned a failure response.',
      );
      expect(presentation.lines).not.toContain(
        'Mission Workflow Progress: completed mission-codex-failure-mission',
      );
    } finally {
      kernel.dispose();
    }
  });
});

function createCodexWorkflow(
  identities: string[],
  presentation: HostPresentationSurface = new RecordingPresentationSurface(),
): { readonly kernel: Kernel; readonly workflow: HostMissionWorkflow } {
  let services: readonly IKernelService[] = [];
  const kernel = new Kernel((eventBus) => {
    services = createKernelServices(eventBus, {
      adapters: [
        createMockAdapter(),
        new CodexCliAdapter(new LocalProcessRuntime(), {
          executable: process.execPath,
          baseArguments: [testDoublePath],
          timeoutMs: 5000,
        }),
      ],
    });

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
        (service): service is ExecutionStrategyService =>
          service instanceof ExecutionStrategyService,
      ),
      adapterService: requireService(
        services,
        'AdapterService',
        (service): service is AdapterService => service instanceof AdapterService,
      ),
      adapterId: CODEX_CLI_ADAPTER_ID,
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
    presentation,
    new StaticWorkspaceTrustSurface(true),
    createDeterministicIdentity(identities),
  );

  return { kernel, workflow };
}

class RecordingPresentationSurface implements HostPresentationSurface {
  public readonly lines: string[] = [];

  public appendLine(message: string): void {
    this.lines.push(message);
  }

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
