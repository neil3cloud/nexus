import { describe, expect, it } from 'vitest';

import type { Adapter } from '../../../src/kernel/adapter/adapter.contract';
import { AdapterMetadata } from '../../../src/kernel/adapter/adapter-metadata';
import type { AdapterRequest } from '../../../src/kernel/adapter/adapter-request';
import { AdapterResponse } from '../../../src/kernel/adapter/adapter-response';
import { InMemoryAdapterRegistry } from '../../../src/kernel/adapter/adapter-registry';
import { AdapterService } from '../../../src/kernel/adapter/adapter.service';
import type { EventBusContract, EventBusEvent, EventSubscriptionHandle } from '../../../src/kernel/common/event-bus-contract';
import { ProtocolVersion } from '../../../src/kernel/adapter/protocol-version';
import { InMemoryAssignmentPolicyRepository } from '../../../src/kernel/execution/assignment-policy.repository';
import { AssignmentPolicyService } from '../../../src/kernel/execution/assignment-policy.service';
import {
  EngineeringSessionCheckpointNotFoundError,
  EngineeringSessionNotFoundError,
  InvalidEngineeringSessionDefinitionError,
  InvalidEngineeringSessionLifecycleTransitionError,
} from '../../../src/kernel/execution/engineering-session.errors';
import { InvalidAdvancementTriggerDefinitionError } from '../../../src/kernel/execution/advancement-trigger.errors';
import { EngineeringSession } from '../../../src/kernel/execution/engineering-session';
import { GovernanceGatedWorkflowAdvancementConsumer } from '../../../src/kernel/execution/governance-gated-workflow-advancement.consumer';
import { InMemoryEngineeringSessionCheckpointRepository } from '../../../src/kernel/execution/engineering-session-checkpoint.repository';
import { InMemoryEngineeringSessionRepository } from '../../../src/kernel/execution/engineering-session.repository';
import { EngineeringSessionService } from '../../../src/kernel/execution/engineering-session.service';
import { ExecutionSessionService } from '../../../src/kernel/execution/execution-session.service';
import { InMemoryExecutionSessionRepository } from '../../../src/kernel/execution/execution-session.repository';
import { ExecutionStrategyService } from '../../../src/kernel/execution/execution-strategy.service';
import { InMemoryExecutionStrategyRepository } from '../../../src/kernel/execution/execution-strategy.repository';
import { InMemoryRoleAssignmentRepository } from '../../../src/kernel/execution/role-assignment.repository';
import { InMemoryRoleRegistry } from '../../../src/kernel/execution/role-registry';
import { RoleService } from '../../../src/kernel/execution/role.service';
import { WorkflowChain } from '../../../src/kernel/execution/workflow-chain';
import { InMemoryWorkflowChainRepository } from '../../../src/kernel/execution/workflow-chain.repository';
import { GovernanceDecision } from '../../../src/kernel/governance/governance-decision';
import { InMemoryGovernanceDecisionRepository } from '../../../src/kernel/governance/governance-decision.repository';
import { createGovernanceDecisionRecordedEvent } from '../../../src/kernel/governance/governance.events';
import type { GovernanceDecisionValue } from '../../../src/kernel/governance/governance.types';
import { InMemoryMissionRepository } from '../../../src/kernel/mission/mission.repository';
import { MissionPlanningService } from '../../../src/kernel/mission/mission-planning.service';
import { MissionService } from '../../../src/kernel/mission/mission.service';
import { Review } from '../../../src/kernel/review/review.aggregate';
import { InMemoryReviewRepository } from '../../../src/kernel/review/review.repository';
import type { ReviewOutcomeValue } from '../../../src/kernel/review/review.types';

class TestEventBus implements EventBusContract {
  private readonly events: EventBusEvent[] = [];

  public async publish(event: EventBusEvent): Promise<void> {
    this.events.push(event);
  }

  public subscribe(): EventSubscriptionHandle {
    return {
      dispose(): void {},
    };
  }

  public replay(): readonly EventBusEvent[] {
    return Object.freeze([...this.events]);
  }
}

class RecordingAdapter implements Adapter {
  public readonly metadata = AdapterMetadata.create({
    id: 'recording-adapter',
    name: 'Recording Adapter',
    version: '1.0.0',
    protocolVersion: '1.0',
    capabilities: ['CodeModification'],
    supportedRoles: ['builder', 'reviewer'],
  });

  public readonly requests: AdapterRequest[] = [];

  public constructor(private readonly status: 'Completed' | 'Failed' = 'Completed') {}

  public async execute(request: AdapterRequest): Promise<AdapterResponse> {
    this.requests.push(request);

    return AdapterResponse.create({
      status: this.status,
      diagnostics: [
        {
          code: `recording-adapter.${this.status.toLowerCase()}`,
          message: `Recording Adapter ${this.status}.`,
        },
      ],
      producedArtifacts:
        this.status === 'Completed'
          ? [`recording-adapter:${request.engineeringRole}:${request.taskId}`]
          : [],
      executionMetadata: {
        adapterId: 'recording-adapter',
        engineeringRole: request.engineeringRole,
        taskId: request.taskId,
      },
    });
  }
}

interface WorkflowExecutionHarness {
  readonly service: EngineeringSessionService;
  readonly assignmentPolicyService: AssignmentPolicyService;
  readonly roleService: RoleService;
  readonly executionSessionService: ExecutionSessionService;
  readonly missionService: MissionService;
  readonly planningService: MissionPlanningService;
  readonly executionStrategyService: ExecutionStrategyService;
  readonly adapter: RecordingAdapter;
}

async function createWorkflowChainRepository(): Promise<InMemoryWorkflowChainRepository> {
  const repository = new InMemoryWorkflowChainRepository();

  await repository.create(
    WorkflowChain.create({
      id: 'workflow-chain-1',
      steps: [{ roleId: 'builder' }, { roleId: 'reviewer' }],
    }),
  );
  await repository.create(
    WorkflowChain.create({
      id: 'workflow-chain-2',
      steps: [{ roleId: 'documentation-reviewer' }],
    }),
  );

  return repository;
}

describe('EngineeringSessionService', () => {
  it('creates, closes, looks up, and enumerates sessions through repository contracts', async () => {
    const timestamps = [
      '2026-07-14T00:00:00.000Z',
      '2026-07-14T01:00:00.000Z',
    ];
    const service = new EngineeringSessionService(
      new InMemoryEngineeringSessionRepository(),
      await createWorkflowChainRepository(),
      () => 'session-1',
      () => {
        const timestamp = timestamps.shift();

        if (timestamp === undefined) {
          throw new Error('No timestamp available for test.');
        }

        return timestamp;
      },
    );

    const created = await service.createEngineeringSession({
      engineeringRuntimeContextReference: 'runtime-context-1',
      activeEngineeringWorkflowReference: 'builder-workflow',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '0',
      participatingRoleIds: ['builder', 'reviewer'],
      workflowState: 'active',
      diagnostics: [
        {
          code: 'session-created',
          message: 'Session created.',
          recordedAt: '2026-07-14T00:00:00.000Z',
        },
      ],
      collaborationMetadata: {
        pair: 'human-builder',
      },
    });
    const closed = await service.closeEngineeringSession({
      engineeringSessionId: created.id,
    });

    expect(created).toMatchObject({
      id: 'session-1',
      status: 'Open',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '0',
      timeline: {
        createdAt: '2026-07-14T00:00:00.000Z',
      },
    });
    expect(closed).toMatchObject({
      id: 'session-1',
      status: 'Closed',
      timeline: {
        closedAt: '2026-07-14T01:00:00.000Z',
      },
    });
    await expect(service.getEngineeringSession('session-1')).resolves.toEqual(closed);
    await expect(service.enumerateEngineeringSessions()).resolves.toEqual([closed]);
  });

  it('discovers active EngineeringSessions deterministically without mutating repository state', async () => {
    const service = new EngineeringSessionService(
      new InMemoryEngineeringSessionRepository(),
      await createWorkflowChainRepository(),
      () => 'unused-generated-session-id',
      createTimestampSequence([
        '2026-07-15T01:00:00.000Z',
        '2026-07-15T01:01:00.000Z',
        '2026-07-15T01:02:00.000Z',
        '2026-07-15T01:03:00.000Z',
      ]),
    );

    const sessionB = await service.createEngineeringSession({
      id: 'engineering-session-b',
      engineeringRuntimeContextReference: 'runtime-context-b',
      activeEngineeringWorkflowReference: 'builder-workflow',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '0',
      participatingRoleIds: ['builder', 'reviewer'],
      workflowState: 'active',
    });
    const sessionA = await service.createEngineeringSession({
      id: 'engineering-session-a',
      engineeringRuntimeContextReference: 'runtime-context-a',
      activeEngineeringWorkflowReference: 'builder-workflow',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '0',
      participatingRoleIds: ['builder', 'reviewer'],
      workflowState: 'active',
    });
    const sessionC = await service.createEngineeringSession({
      id: 'engineering-session-c',
      engineeringRuntimeContextReference: 'runtime-context-c',
      activeEngineeringWorkflowReference: 'builder-workflow',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '0',
      participatingRoleIds: ['builder', 'reviewer'],
      workflowState: 'active',
    });

    await expect(service.enumerateActiveEngineeringSessions()).resolves.toEqual([
      sessionA,
      sessionB,
      sessionC,
    ]);

    const closedSessionB = await service.closeEngineeringSession({
      engineeringSessionId: sessionB.id,
    });

    await expect(service.enumerateActiveEngineeringSessions()).resolves.toEqual([
      sessionA,
      sessionC,
    ]);
    await expect(service.enumerateEngineeringSessions()).resolves.toEqual([
      sessionA,
      closedSessionB,
      sessionC,
    ]);
  });

  it('keeps concurrent EngineeringSessions isolated across lifecycle, advancement, and Checkpoint operations', async () => {
    const service = new EngineeringSessionService(
      new InMemoryEngineeringSessionRepository(),
      await createWorkflowChainRepository(),
      () => 'unused-generated-session-id',
      createTimestampSequence([
        '2026-07-15T02:00:00.000Z',
        '2026-07-15T02:01:00.000Z',
        '2026-07-15T02:02:00.000Z',
        '2026-07-15T02:03:00.000Z',
      ]),
    );
    const source = await service.createEngineeringSession({
      id: 'engineering-session-source',
      engineeringRuntimeContextReference: 'runtime-context-source',
      activeEngineeringWorkflowReference: 'builder-workflow',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '0',
      participatingRoleIds: ['builder', 'reviewer'],
      workflowState: 'active',
    });
    const peer = await service.createEngineeringSession({
      id: 'engineering-session-peer',
      engineeringRuntimeContextReference: 'runtime-context-peer',
      activeEngineeringWorkflowReference: 'builder-workflow',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '0',
      participatingRoleIds: ['builder', 'reviewer'],
      workflowState: 'active',
      diagnostics: [
        {
          code: 'peer-diagnostic',
          message: 'Peer diagnostic remains isolated.',
          recordedAt: '2026-07-15T02:01:30.000Z',
        },
      ],
      collaborationMetadata: {
        owner: 'peer',
      },
    });

    const advancedSource = await service.advanceWorkflow({
      engineeringSessionId: source.id,
    });
    const checkpoint = await service.createCheckpoint({
      engineeringSessionId: source.id,
      checkpointId: 'checkpoint-source-only',
    });
    const closedSource = await service.closeEngineeringSession({
      engineeringSessionId: source.id,
    });

    expect(advancedSource.currentWorkflowStepId).toBe('1');
    expect(checkpoint.engineeringSession).toEqual(advancedSource);
    expect(closedSource.status).toBe('Closed');
    await expect(service.getEngineeringSession(peer.id)).resolves.toEqual(peer);
    await expect(service.enumerateActiveEngineeringSessions()).resolves.toEqual([peer]);
    await expect(service.recoverFromCheckpoint({ checkpointId: checkpoint.id })).resolves.toEqual(
      advancedSource,
    );
    await expect(service.getEngineeringSession(peer.id)).resolves.toEqual(peer);
  });

  it('reports not-found and invalid-transition diagnostics without hiding domain failures', async () => {
    const service = new EngineeringSessionService(
      new InMemoryEngineeringSessionRepository(),
      await createWorkflowChainRepository(),
      () => 'session-1',
      () => '2026-07-14T00:00:00.000Z',
    );

    await expect(service.getEngineeringSession('missing-session')).rejects.toThrow(
      EngineeringSessionNotFoundError,
    );

    await service.createEngineeringSession({
      engineeringRuntimeContextReference: 'runtime-context-1',
      activeEngineeringWorkflowReference: 'builder-workflow',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '0',
      participatingRoleIds: ['builder'],
      workflowState: 'active',
    });
    await service.closeEngineeringSession({ engineeringSessionId: 'session-1' });

    await expect(
      service.closeEngineeringSession({ engineeringSessionId: 'session-1' }),
    ).rejects.toThrow(InvalidEngineeringSessionLifecycleTransitionError);
  });

  it('captures deterministic Checkpoints and recovers semantically equivalent EngineeringSessions', async () => {
    const service = new EngineeringSessionService(
      new InMemoryEngineeringSessionRepository(),
      await createWorkflowChainRepository(),
      () => 'unused-generated-id',
      createTimestampSequence([
        '2026-07-15T00:00:00.000Z',
        '2026-07-15T00:01:00.000Z',
      ]),
    );
    const created = await service.createEngineeringSession({
      id: 'engineering-session-checkpointed',
      engineeringRuntimeContextReference: 'runtime-context-checkpointed',
      activeEngineeringWorkflowReference: 'builder-workflow',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '0',
      participatingRoleIds: ['reviewer', 'builder'],
      workflowState: 'active',
      diagnostics: [
        {
          code: 'engineering-session.checkpoint-source',
          message: 'Checkpoint source diagnostic.',
          recordedAt: '2026-07-15T00:00:30.000Z',
        },
      ],
      collaborationMetadata: {
        pair: 'human-builder',
      },
    });
    const checkpoint = await service.createCheckpoint({
      engineeringSessionId: created.id,
      checkpointId: 'checkpoint-before-advancement',
    });
    const advanced = await service.advanceWorkflow({ engineeringSessionId: created.id });
    const recovered = await service.recoverFromCheckpoint({
      checkpointId: checkpoint.id,
    });

    expect(checkpoint).toEqual({
      id: 'checkpoint-before-advancement',
      engineeringSession: created,
      capturedAt: '2026-07-15T00:01:00.000Z',
    });
    expect(advanced.currentWorkflowStepId).toBe('1');
    expect(recovered).toEqual(created);
    await expect(service.getEngineeringSession(created.id)).resolves.toEqual(advanced);
  });

  it('rejects Recovery from a nonexistent Checkpoint', async () => {
    const service = new EngineeringSessionService(
      new InMemoryEngineeringSessionRepository(),
      await createWorkflowChainRepository(),
      () => 'unused-generated-id',
      () => '2026-07-15T00:00:00.000Z',
    );

    await expect(
      service.recoverFromCheckpoint({ checkpointId: 'missing-checkpoint' }),
    ).rejects.toThrow(EngineeringSessionCheckpointNotFoundError);
  });

  it('orchestrates validated WorkflowChain binding creation and rejection cases', async () => {
    const service = new EngineeringSessionService(
      new InMemoryEngineeringSessionRepository(),
      await createWorkflowChainRepository(),
      () => 'session-1',
      () => '2026-07-14T00:00:00.000Z',
    );
    const command = {
      engineeringRuntimeContextReference: 'runtime-context-1',
      activeEngineeringWorkflowReference: 'builder-workflow',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '1',
      participatingRoleIds: ['reviewer'],
      workflowState: 'active',
    };

    await expect(service.createEngineeringSession(command)).resolves.toMatchObject({
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '1',
    });
    await expect(
      service.createEngineeringSession({
        ...command,
        id: 'session-null-chain',
        // @ts-expect-error Runtime validation rejects null WorkflowChain references.
        workflowChainId: null,
      }),
    ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
    await expect(
      service.createEngineeringSession({
        ...command,
        id: 'session-missing-chain',
        workflowChainId: 'missing-chain',
      }),
    ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
    await expect(
      service.createEngineeringSession({
        ...command,
        id: 'session-null-step',
        // @ts-expect-error Runtime validation rejects null WorkflowStep references.
        currentWorkflowStepId: null,
      }),
    ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
    await expect(
      service.createEngineeringSession({
        ...command,
        id: 'session-missing-step',
        currentWorkflowStepId: '2',
      }),
    ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
    await expect(
      service.createEngineeringSession({
        ...command,
        id: 'session-mismatched-step-chain',
        workflowChainId: 'workflow-chain-2',
        currentWorkflowStepId: '1',
      }),
    ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
  });

  it('orchestrates binding to each repeated-role WorkflowChain position independently', async () => {
    const repository = await createWorkflowChainRepository();

    await repository.create(
      WorkflowChain.create({
        id: 'workflow-chain-repeated-role',
        steps: [{ roleId: 'builder' }, { roleId: 'reviewer' }, { roleId: 'builder' }],
      }),
    );

    const service = new EngineeringSessionService(
      new InMemoryEngineeringSessionRepository(),
      repository,
      () => 'unused-generated-session-id',
      () => '2026-07-14T00:00:00.000Z',
    );

    for (const position of ['0', '1', '2']) {
      await expect(
        service.createEngineeringSession({
          id: `session-position-${position}`,
          engineeringRuntimeContextReference: `runtime-context-${position}`,
          activeEngineeringWorkflowReference: 'builder-workflow',
          workflowChainId: 'workflow-chain-repeated-role',
          currentWorkflowStepId: position,
          participatingRoleIds: ['builder', 'reviewer'],
          workflowState: 'active',
        }),
      ).resolves.toMatchObject({
        workflowChainId: 'workflow-chain-repeated-role',
        currentWorkflowStepId: position,
      });
    }
  });

  it('orchestrates validated single-step workflow advancement and persistence', async () => {
    const service = new EngineeringSessionService(
      new InMemoryEngineeringSessionRepository(),
      await createWorkflowChainRepository(),
      () => 'session-1',
      () => '2026-07-14T00:00:00.000Z',
    );

    const created = await service.createEngineeringSession({
      engineeringRuntimeContextReference: 'runtime-context-1',
      activeEngineeringWorkflowReference: 'builder-workflow',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '0',
      participatingRoleIds: ['builder', 'reviewer'],
      workflowState: 'active',
    });
    const advanced = await service.advanceWorkflow({ engineeringSessionId: created.id });

    expect(advanced).toMatchObject({
      id: 'session-1',
      status: 'Open',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '1',
    });
    await expect(service.getEngineeringSession('session-1')).resolves.toEqual(advanced);
  });

  it('orchestrates synchronous AdvancementTrigger workflow advancement and persistence', async () => {
    const service = new EngineeringSessionService(
      new InMemoryEngineeringSessionRepository(),
      await createWorkflowChainRepository(),
      () => 'session-1',
      () => '2026-07-14T00:00:00.000Z',
    );

    const created = await service.createEngineeringSession({
      engineeringRuntimeContextReference: 'runtime-context-1',
      activeEngineeringWorkflowReference: 'builder-workflow',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '0',
      participatingRoleIds: ['builder', 'reviewer'],
      workflowState: 'active',
    });
    const advanced = await service.advanceWorkflowOnTrigger({
      engineeringSessionId: created.id,
      trigger: {
        fact: 'workflow-position-eligible',
      },
    });

    expect(advanced).toMatchObject({
      id: 'session-1',
      status: 'Open',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '1',
    });
    await expect(service.getEngineeringSession('session-1')).resolves.toEqual(advanced);
  });

  it('orchestrates Review-Gated Advancement for Non-Blocking Review Outcomes and persists advancement', async () => {
    for (const outcome of ['Accepted', 'Accepted With Observations']) {
      const service = new EngineeringSessionService(
        new InMemoryEngineeringSessionRepository(),
        await createWorkflowChainRepository(),
        () => `session-${outcome.replaceAll(' ', '-').toLowerCase()}`,
        () => '2026-07-14T00:00:00.000Z',
      );
      const created = await service.createEngineeringSession({
        engineeringRuntimeContextReference: `runtime-context-${outcome}`,
        activeEngineeringWorkflowReference: 'builder-workflow',
        workflowChainId: 'workflow-chain-1',
        currentWorkflowStepId: '0',
        participatingRoleIds: ['builder', 'reviewer'],
        workflowState: 'active',
      });
      const advanced = await service.advanceWorkflowAfterReview({
        engineeringSessionId: created.id,
        reviewOutcome: outcome,
      });

      expect(advanced).toMatchObject({
        id: created.id,
        status: 'Open',
        workflowChainId: 'workflow-chain-1',
        currentWorkflowStepId: '1',
      });
      await expect(service.getEngineeringSession(created.id)).resolves.toEqual(advanced);
    }
  });

  it('rejects Review-Gated Advancement for Blocking Review Outcomes without changing position', async () => {
    for (const outcome of ['Action Required', 'Rejected']) {
      const service = new EngineeringSessionService(
        new InMemoryEngineeringSessionRepository(),
        await createWorkflowChainRepository(),
        () => `session-${outcome.replaceAll(' ', '-').toLowerCase()}`,
        () => '2026-07-14T00:00:00.000Z',
      );
      const created = await service.createEngineeringSession({
        engineeringRuntimeContextReference: `runtime-context-${outcome}`,
        activeEngineeringWorkflowReference: 'builder-workflow',
        workflowChainId: 'workflow-chain-1',
        currentWorkflowStepId: '0',
        participatingRoleIds: ['builder', 'reviewer'],
        workflowState: 'active',
      });

      await expect(
        service.advanceWorkflowAfterReview({
          engineeringSessionId: created.id,
          reviewOutcome: outcome,
        }),
      ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
      await expect(service.getEngineeringSession(created.id)).resolves.toMatchObject({
        currentWorkflowStepId: '0',
      });
    }
  });

  it('orchestrates deterministic workflow advancement rejection cases', async () => {
    const engineeringSessionRepository = new InMemoryEngineeringSessionRepository();
    const workflowChainRepository = await createWorkflowChainRepository();
    const service = new EngineeringSessionService(
      engineeringSessionRepository,
      workflowChainRepository,
      () => 'unused-generated-session-id',
      () => '2026-07-14T00:00:00.000Z',
    );
    const terminalSession = await service.createEngineeringSession({
      id: 'session-terminal',
      engineeringRuntimeContextReference: 'runtime-context-terminal',
      activeEngineeringWorkflowReference: 'builder-workflow',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '1',
      participatingRoleIds: ['reviewer'],
      workflowState: 'active',
    });

    await engineeringSessionRepository.create(
      EngineeringSession.fromSnapshot({
        ...terminalSession,
        id: 'session-invalid-current-step',
        currentWorkflowStepId: '2',
      }),
    );
    await engineeringSessionRepository.create(
      EngineeringSession.fromSnapshot({
        ...terminalSession,
        id: 'session-missing-chain',
        workflowChainId: 'missing-chain',
        currentWorkflowStepId: '0',
      }),
    );

    await expect(
      service.advanceWorkflow({ engineeringSessionId: 'missing-session' }),
    ).rejects.toThrow(EngineeringSessionNotFoundError);
    await expect(
      service.advanceWorkflow({ engineeringSessionId: 'session-terminal' }),
    ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
    await expect(
      service.advanceWorkflow({ engineeringSessionId: 'session-invalid-current-step' }),
    ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
    await expect(
      service.advanceWorkflow({ engineeringSessionId: 'session-missing-chain' }),
    ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
  });

  it('orchestrates deterministic AdvancementTrigger rejection cases without changing position', async () => {
    const engineeringSessionRepository = new InMemoryEngineeringSessionRepository();
    const workflowChainRepository = await createWorkflowChainRepository();
    const service = new EngineeringSessionService(
      engineeringSessionRepository,
      workflowChainRepository,
      () => 'unused-generated-session-id',
      () => '2026-07-14T00:00:00.000Z',
    );
    const terminalSession = await service.createEngineeringSession({
      id: 'session-terminal',
      engineeringRuntimeContextReference: 'runtime-context-terminal',
      activeEngineeringWorkflowReference: 'builder-workflow',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '1',
      participatingRoleIds: ['reviewer'],
      workflowState: 'active',
    });
    const validTrigger = {
      fact: 'workflow-position-eligible',
    };

    await engineeringSessionRepository.create(
      EngineeringSession.fromSnapshot({
        ...terminalSession,
        id: 'session-invalid-current-step',
        currentWorkflowStepId: '2',
      }),
    );

    await expect(
      service.advanceWorkflowOnTrigger({
        engineeringSessionId: 'missing-session',
        trigger: validTrigger,
      }),
    ).rejects.toThrow(EngineeringSessionNotFoundError);
    await expect(
      service.advanceWorkflowOnTrigger({
        engineeringSessionId: 'session-terminal',
        trigger: validTrigger,
      }),
    ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
    await expect(
      service.advanceWorkflowOnTrigger({
        engineeringSessionId: 'session-invalid-current-step',
        trigger: validTrigger,
      }),
    ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
    await expect(
      service.advanceWorkflowOnTrigger({
        engineeringSessionId: 'session-terminal',
        trigger: {
          fact: '',
        },
      }),
    ).rejects.toThrow(InvalidAdvancementTriggerDefinitionError);
    await expect(service.getEngineeringSession('session-terminal')).resolves.toMatchObject({
      currentWorkflowStepId: '1',
    });
  });

  it('orchestrates deterministic Review-Gated Advancement rejection cases without changing position', async () => {
    const engineeringSessionRepository = new InMemoryEngineeringSessionRepository();
    const workflowChainRepository = await createWorkflowChainRepository();
    const service = new EngineeringSessionService(
      engineeringSessionRepository,
      workflowChainRepository,
      () => 'unused-generated-session-id',
      () => '2026-07-14T00:00:00.000Z',
    );
    const terminalSession = await service.createEngineeringSession({
      id: 'session-terminal',
      engineeringRuntimeContextReference: 'runtime-context-terminal',
      activeEngineeringWorkflowReference: 'builder-workflow',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '1',
      participatingRoleIds: ['reviewer'],
      workflowState: 'active',
    });

    await engineeringSessionRepository.create(
      EngineeringSession.fromSnapshot({
        ...terminalSession,
        id: 'session-invalid-current-step',
        currentWorkflowStepId: '2',
      }),
    );
    await engineeringSessionRepository.create(
      EngineeringSession.fromSnapshot({
        ...terminalSession,
        id: 'session-missing-chain',
        workflowChainId: 'missing-chain',
        currentWorkflowStepId: '0',
      }),
    );

    await expect(
      service.advanceWorkflowAfterReview({
        engineeringSessionId: 'missing-session',
        reviewOutcome: 'Accepted',
      }),
    ).rejects.toThrow(EngineeringSessionNotFoundError);
    await expect(
      service.advanceWorkflowAfterReview({
        engineeringSessionId: 'session-terminal',
        reviewOutcome: 'Accepted',
      }),
    ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
    await expect(
      service.advanceWorkflowAfterReview({
        engineeringSessionId: 'session-invalid-current-step',
        reviewOutcome: 'Accepted',
      }),
    ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
    await expect(
      service.advanceWorkflowAfterReview({
        engineeringSessionId: 'session-missing-chain',
        reviewOutcome: 'Accepted',
      }),
    ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
    await expect(
      service.advanceWorkflowAfterReview({
        engineeringSessionId: 'session-terminal',
        reviewOutcome: '',
      }),
    ).rejects.toThrow();
    await expect(service.getEngineeringSession('session-terminal')).resolves.toMatchObject({
      currentWorkflowStepId: '1',
    });
  });

  it('advances after an Approved Review and Approved GovernanceDecision', async () => {
    const harness = await createGovernanceGatedAdvancementHarness();

    const advanced = await harness.service.advanceWorkflowAfterGovernanceDecision({
      engineeringSessionId: harness.engineeringSessionId,
      governanceDecisionId: harness.governanceDecisionId,
      currentWorkflowStepId: '0',
    });

    expect(advanced.currentWorkflowStepId).toBe('1');
  });

  it.each(['Rejected', 'Deferred', 'Escalation Required'] as const)(
    'rejects Governance-Gated Advancement for Blocking GovernanceDecision %s',
    async (governanceDecisionValue) => {
      const harness = await createGovernanceGatedAdvancementHarness({
        governanceDecisionValue,
      });

      await expect(
        harness.service.advanceWorkflowAfterGovernanceDecision({
          engineeringSessionId: harness.engineeringSessionId,
          governanceDecisionId: harness.governanceDecisionId,
          currentWorkflowStepId: '0',
        }),
      ).rejects.toThrow(
        new InvalidEngineeringSessionDefinitionError(
          'EngineeringSession Governance-Gated Advancement requires a Non-Blocking Governance Decision.',
        ),
      );
      await expect(harness.service.getEngineeringSession(harness.engineeringSessionId)).resolves.toMatchObject({
        currentWorkflowStepId: '0',
      });
    },
  );

  it('rejects Governance approval without Review-Gated Advancement eligibility', async () => {
    const harness = await createGovernanceGatedAdvancementHarness({
      reviewOutcome: 'Action Required',
    });

    await expect(
      harness.service.advanceWorkflowAfterGovernanceDecision({
        engineeringSessionId: harness.engineeringSessionId,
        governanceDecisionId: harness.governanceDecisionId,
        currentWorkflowStepId: '0',
      }),
    ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
    await expect(harness.service.getEngineeringSession(harness.engineeringSessionId)).resolves.toMatchObject({
      currentWorkflowStepId: '0',
    });
  });

  it('rejects Review approval without a produced GovernanceDecision', async () => {
    const harness = await createGovernanceGatedAdvancementHarness({
      registerGovernanceDecision: false,
    });

    await expect(
      harness.service.advanceWorkflowAfterGovernanceDecision({
        engineeringSessionId: harness.engineeringSessionId,
        governanceDecisionId: harness.governanceDecisionId,
        currentWorkflowStepId: '0',
      }),
    ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
    await expect(harness.service.getEngineeringSession(harness.engineeringSessionId)).resolves.toMatchObject({
      currentWorkflowStepId: '0',
    });
  });

  it('handles duplicate GovernanceDecisionRecorded delivery without duplicate advancement', async () => {
    const harness = await createGovernanceGatedAdvancementHarness();
    const consumer = new GovernanceGatedWorkflowAdvancementConsumer(harness.service);
    const event = createGovernanceDecisionRecordedEvent(harness.governanceDecision, {
      eventId: 'event-governance-decision-recorded',
      timestamp: '2026-07-16T00:00:00.000Z',
    });

    const first = await consumer.handleGovernanceDecisionRecorded({
      event,
      engineeringSessionId: harness.engineeringSessionId,
      currentWorkflowStepId: '0',
    });
    const duplicate = await consumer.handleGovernanceDecisionRecorded({
      event,
      engineeringSessionId: harness.engineeringSessionId,
      currentWorkflowStepId: '0',
    });

    expect(first.currentWorkflowStepId).toBe('1');
    expect(duplicate.currentWorkflowStepId).toBe('1');
    await expect(harness.service.getEngineeringSession(harness.engineeringSessionId)).resolves.toMatchObject({
      currentWorkflowStepId: '1',
    });
  });

  it('keeps existing Manual, Automatic/Event-Driven, and Review-Gated advancement behavior unchanged', async () => {
    const service = new EngineeringSessionService(
      new InMemoryEngineeringSessionRepository(),
      await createWorkflowChainRepository(),
      () => 'unused-generated-session-id',
      createTimestampSequence([
        '2026-07-16T00:00:00.000Z',
        '2026-07-16T00:01:00.000Z',
        '2026-07-16T00:02:00.000Z',
      ]),
    );

    await createEngineeringSessionForAdvancement(service, 'manual-session');
    await createEngineeringSessionForAdvancement(service, 'automatic-session');
    await createEngineeringSessionForAdvancement(service, 'review-session');

    await expect(
      service.advanceWorkflow({ engineeringSessionId: 'manual-session' }),
    ).resolves.toMatchObject({ currentWorkflowStepId: '1' });
    await expect(
      service.advanceWorkflowOnTrigger({
        engineeringSessionId: 'automatic-session',
        trigger: { fact: 'workflow-position-eligible' },
      }),
    ).resolves.toMatchObject({ currentWorkflowStepId: '1' });
    await expect(
      service.advanceWorkflowAfterReview({
        engineeringSessionId: 'review-session',
        reviewOutcome: 'Accepted With Observations',
      }),
    ).resolves.toMatchObject({ currentWorkflowStepId: '1' });
  });

  it('executes the current WorkflowStep through strategy readiness, explicit Adapter dispatch, and ExecutionSession recording', async () => {
    const harness = await createWorkflowExecutionHarness();
    const workflow = await createReadyWorkflowExecutionScenario(harness, 'success');

    const result = await harness.service.executeCurrentWorkflowStep({
      engineeringSessionId: workflow.engineeringSessionId,
      executionStrategyId: workflow.executionStrategyId,
      missionPlanId: workflow.missionPlanId,
      taskId: workflow.taskId,
      adapterId: 'recording-adapter',
      contextPackageReference: `context-package-${workflow.missionId}`,
      consumedProjectionVersion: 'projection-v1',
    });
    const executionSessions = await harness.executionSessionService.enumerateExecutionSessions(
      workflow.engineeringSessionId,
    );

    expect(result).toMatchObject({
      status: 'Completed',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '0',
      workflowStepRoleId: 'builder',
      taskId: workflow.taskId,
      adapterId: 'recording-adapter',
      adapterResponse: {
        status: 'Completed',
        producedArtifacts: [`recording-adapter:builder:${workflow.taskId}`],
      },
      executionSession: {
        engineeringSessionId: workflow.engineeringSessionId,
        assignedRole: 'builder',
        assignedAdapter: 'recording-adapter',
        consumedProjectionVersion: 'projection-v1',
        executionOutcome: 'Completed',
      },
    });
    expect(result.engineeringSession.currentWorkflowStepId).toBe('0');
    expect(executionSessions).toEqual([result.executionSession]);
    expect(harness.adapter.requests[0]?.toSnapshot()).toMatchObject({
      engineeringRole: 'builder',
      taskId: workflow.taskId,
      contextPackageReference: `context-package-${workflow.missionId}`,
      requestMetadata: {
        executionStrategyId: workflow.executionStrategyId,
        missionId: workflow.missionId,
        missionPlanId: workflow.missionPlanId,
        roleId: 'builder',
        workflowChainId: 'workflow-chain-1',
        currentWorkflowStepId: '0',
      },
    });
    await expect(harness.service.getEngineeringSession(workflow.engineeringSessionId)).resolves.toMatchObject({
      currentWorkflowStepId: '0',
    });
  });

  it('executes the current WorkflowStep when the supplied AssignmentPolicy is satisfied', async () => {
    const harness = await createWorkflowExecutionHarness();
    const workflow = await createReadyWorkflowExecutionScenario(harness, 'assignment-policy-satisfied');
    const assignmentPolicy = await createWorkflowExecutionAssignmentPolicy(
      harness,
      'assignment-policy-satisfied',
    );

    const result = await harness.service.executeCurrentWorkflowStep({
      engineeringSessionId: workflow.engineeringSessionId,
      executionStrategyId: workflow.executionStrategyId,
      missionPlanId: workflow.missionPlanId,
      taskId: workflow.taskId,
      adapterId: 'recording-adapter',
      contextPackageReference: `context-package-${workflow.missionId}`,
      consumedProjectionVersion: 'projection-v1',
      assignmentPolicyId: assignmentPolicy.id,
      assignmentPolicyEvaluationInput: createSatisfiedAssignmentPolicyEvaluationInput(),
    });

    expect(result).toMatchObject({
      status: 'Completed',
      readiness: {
        roleId: 'builder',
      },
      assignmentPolicy: {
        assignmentPolicyId: assignmentPolicy.id,
        satisfied: true,
        requirements: {
          requiredRole: true,
          adapterExecutionCapability: true,
          repositoryConfiguration: true,
          executionConstraints: true,
          humanPreferences: true,
        },
      },
      executionSession: {
        engineeringSessionId: workflow.engineeringSessionId,
        assignedRole: 'builder',
        assignedAdapter: 'recording-adapter',
      },
    });
    await expect(
      harness.executionSessionService.enumerateExecutionSessions(workflow.engineeringSessionId),
    ).resolves.toEqual([result.executionSession]);
    expect(harness.adapter.requests).toHaveLength(1);
  });

  it('rejects WorkflowStep execution when the supplied AssignmentPolicy is not satisfied', async () => {
    const harness = await createWorkflowExecutionHarness();
    const workflow = await createReadyWorkflowExecutionScenario(harness, 'assignment-policy-rejected');
    const assignmentPolicy = await createWorkflowExecutionAssignmentPolicy(
      harness,
      'assignment-policy-rejected',
    );

    const result = await harness.service.executeCurrentWorkflowStep({
      engineeringSessionId: workflow.engineeringSessionId,
      executionStrategyId: workflow.executionStrategyId,
      missionPlanId: workflow.missionPlanId,
      taskId: workflow.taskId,
      adapterId: 'recording-adapter',
      contextPackageReference: `context-package-${workflow.missionId}`,
      consumedProjectionVersion: 'projection-v1',
      assignmentPolicyId: assignmentPolicy.id,
      assignmentPolicyEvaluationInput: {
        ...createSatisfiedAssignmentPolicyEvaluationInput(),
        adapterExecutionCapability: 'DocumentationReview',
      },
    });

    expect(result).toMatchObject({
      status: 'AssignmentPolicyRejected',
      currentWorkflowStepId: '0',
      workflowStepRoleId: 'builder',
      assignmentPolicy: {
        assignmentPolicyId: assignmentPolicy.id,
        satisfied: false,
        requirements: {
          requiredRole: true,
          adapterExecutionCapability: false,
          repositoryConfiguration: true,
          executionConstraints: true,
          humanPreferences: true,
        },
      },
      diagnostics: [
        {
          code: 'engineering-session.assignment-policy-rejected',
        },
      ],
    });
    await expect(
      harness.executionSessionService.enumerateExecutionSessions(workflow.engineeringSessionId),
    ).resolves.toEqual([]);
    expect(harness.adapter.requests).toEqual([]);
  });

  it('preserves Sprint 47 execution behavior when no AssignmentPolicy reference is supplied', async () => {
    const harness = await createWorkflowExecutionHarness();
    const workflow = await createReadyWorkflowExecutionScenario(harness, 'assignment-policy-omitted');

    const result = await harness.service.executeCurrentWorkflowStep({
      engineeringSessionId: workflow.engineeringSessionId,
      executionStrategyId: workflow.executionStrategyId,
      missionPlanId: workflow.missionPlanId,
      taskId: workflow.taskId,
      adapterId: 'recording-adapter',
      contextPackageReference: `context-package-${workflow.missionId}`,
      consumedProjectionVersion: 'projection-v1',
      assignmentPolicyEvaluationInput: createSatisfiedAssignmentPolicyEvaluationInput(),
    });

    expect(result.assignmentPolicy).toBeUndefined();
    expect(result).toMatchObject({
      status: 'Completed',
      workflowStepRoleId: 'builder',
      executionSession: {
        engineeringSessionId: workflow.engineeringSessionId,
        assignedRole: 'builder',
        assignedAdapter: 'recording-adapter',
      },
    });
    expect(harness.adapter.requests).toHaveLength(1);
  });

  it('keeps concurrent EngineeringSessions isolated during WorkflowStep execution', async () => {
    const harness = await createWorkflowExecutionHarness();
    const workflow = await createReadyWorkflowExecutionScenario(harness, 'concurrent-execution');
    const peer = await harness.service.createEngineeringSession({
      id: 'engineering-session-workflow-execution-peer',
      engineeringRuntimeContextReference: 'runtime-context-workflow-execution-peer',
      activeEngineeringWorkflowReference: 'builder-workflow',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '0',
      participatingRoleIds: ['builder', 'reviewer'],
      workflowState: 'active',
      diagnostics: [
        {
          code: 'peer-execution-diagnostic',
          message: 'Peer execution diagnostic remains isolated.',
          recordedAt: '2026-07-15T00:14:30.000Z',
        },
      ],
      collaborationMetadata: {
        owner: 'peer-execution',
      },
    });

    const result = await harness.service.executeCurrentWorkflowStep({
      engineeringSessionId: workflow.engineeringSessionId,
      executionStrategyId: workflow.executionStrategyId,
      missionPlanId: workflow.missionPlanId,
      taskId: workflow.taskId,
      adapterId: 'recording-adapter',
      contextPackageReference: `context-package-${workflow.missionId}`,
      consumedProjectionVersion: 'projection-v1',
    });

    expect(result.engineeringSession.id).toBe(workflow.engineeringSessionId);
    await expect(harness.service.getEngineeringSession(peer.id)).resolves.toEqual(peer);
    await expect(
      harness.executionSessionService.enumerateExecutionSessions(peer.id),
    ).resolves.toEqual([]);
    await expect(harness.service.enumerateActiveEngineeringSessions()).resolves.toEqual([
      result.engineeringSession,
      peer,
    ]);
  });

  it('rejects AssignmentPolicy evaluation when an AssignmentPolicy reference is supplied without evaluation input', async () => {
    const harness = await createWorkflowExecutionHarness();
    const workflow = await createReadyWorkflowExecutionScenario(
      harness,
      'assignment-policy-missing-input',
    );

    await expect(
      harness.service.executeCurrentWorkflowStep({
        engineeringSessionId: workflow.engineeringSessionId,
        executionStrategyId: workflow.executionStrategyId,
        missionPlanId: workflow.missionPlanId,
        taskId: workflow.taskId,
        adapterId: 'recording-adapter',
        contextPackageReference: `context-package-${workflow.missionId}`,
        consumedProjectionVersion: 'projection-v1',
        assignmentPolicyId: 'assignment-policy-workflow-execution-missing-input',
      }),
    ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
    await expect(
      harness.executionSessionService.enumerateExecutionSessions(workflow.engineeringSessionId),
    ).resolves.toEqual([]);
    expect(harness.adapter.requests).toEqual([]);
  });

  it('rejects execution readiness deterministically without creating an ExecutionSession', async () => {
    const harness = await createWorkflowExecutionHarness();
    const workflow = await createReadyWorkflowExecutionScenario(harness, 'readiness-rejected', {
      completePrerequisite: false,
    });

    const result = await harness.service.executeCurrentWorkflowStep({
      engineeringSessionId: workflow.engineeringSessionId,
      executionStrategyId: workflow.executionStrategyId,
      missionPlanId: workflow.missionPlanId,
      taskId: workflow.taskId,
      adapterId: 'recording-adapter',
      contextPackageReference: `context-package-${workflow.missionId}`,
      consumedProjectionVersion: 'projection-v1',
    });

    expect(result).toMatchObject({
      status: 'ReadinessRejected',
      currentWorkflowStepId: '0',
      workflowStepRoleId: 'builder',
      diagnostics: [
        {
          code: 'engineering-session.readiness-rejected',
        },
      ],
    });
    await expect(
      harness.executionSessionService.enumerateExecutionSessions(workflow.engineeringSessionId),
    ).resolves.toEqual([]);
    expect(harness.adapter.requests).toEqual([]);
  });

  it('rejects execution readiness when the assigned Role differs from the current WorkflowStep Role', async () => {
    const harness = await createWorkflowExecutionHarness();
    const workflow = await createRoleMismatchWorkflowExecutionScenario(harness);

    const result = await harness.service.executeCurrentWorkflowStep({
      engineeringSessionId: workflow.engineeringSessionId,
      executionStrategyId: workflow.executionStrategyId,
      missionPlanId: workflow.missionPlanId,
      taskId: workflow.taskId,
      adapterId: 'recording-adapter',
      contextPackageReference: `context-package-${workflow.missionId}`,
      consumedProjectionVersion: 'projection-v1',
    });

    expect(result).toMatchObject({
      status: 'ReadinessRejected',
      currentWorkflowStepId: '0',
      workflowStepRoleId: 'builder',
      taskId: workflow.taskId,
      adapterId: 'recording-adapter',
      diagnostics: [
        {
          code: 'engineering-session.workflow-step-role-mismatch',
          message: "WorkflowStep Role 'builder' does not match Assignment Role 'reviewer'.",
        },
      ],
    });
    await expect(
      harness.executionSessionService.enumerateExecutionSessions(workflow.engineeringSessionId),
    ).resolves.toEqual([]);
    expect(harness.adapter.requests).toEqual([]);
  });

  it('rejects WorkflowStep execution when ExecutionStrategyService is not supplied', async () => {
    const service = new EngineeringSessionService(
      new InMemoryEngineeringSessionRepository(),
      await createWorkflowChainRepository(),
      () => 'engineering-session-generated',
      () => '2026-07-15T00:00:00.000Z',
      undefined,
      createAdapterService(new RecordingAdapter()),
      new ExecutionSessionService(new InMemoryExecutionSessionRepository()),
    );

    await expect(
      service.executeCurrentWorkflowStep(createWorkflowExecutionCommand()),
    ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
  });

  it('rejects WorkflowStep execution when AdapterService is not supplied', async () => {
    const missionRepository = new InMemoryMissionRepository();
    const roleAssignmentRepository = new InMemoryRoleAssignmentRepository();
    const service = new EngineeringSessionService(
      new InMemoryEngineeringSessionRepository(),
      await createWorkflowChainRepository(),
      () => 'engineering-session-generated',
      () => '2026-07-15T00:00:00.000Z',
      new ExecutionStrategyService(
        new InMemoryExecutionStrategyRepository(),
        roleAssignmentRepository,
        missionRepository,
      ),
      undefined,
      new ExecutionSessionService(new InMemoryExecutionSessionRepository()),
    );

    await expect(
      service.executeCurrentWorkflowStep(createWorkflowExecutionCommand()),
    ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
  });

  it('rejects WorkflowStep execution when ExecutionSessionService is not supplied', async () => {
    const missionRepository = new InMemoryMissionRepository();
    const roleAssignmentRepository = new InMemoryRoleAssignmentRepository();
    const service = new EngineeringSessionService(
      new InMemoryEngineeringSessionRepository(),
      await createWorkflowChainRepository(),
      () => 'engineering-session-generated',
      () => '2026-07-15T00:00:00.000Z',
      new ExecutionStrategyService(
        new InMemoryExecutionStrategyRepository(),
        roleAssignmentRepository,
        missionRepository,
      ),
      createAdapterService(new RecordingAdapter()),
      undefined,
    );

    await expect(
      service.executeCurrentWorkflowStep(createWorkflowExecutionCommand()),
    ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
  });

  it('rejects AssignmentPolicy evaluation when AssignmentPolicyService is not supplied', async () => {
    const harness = await createWorkflowExecutionHarnessWithoutAssignmentPolicyService();
    const workflow = await createReadyWorkflowExecutionScenario(
      harness,
      'assignment-policy-missing-service',
    );

    await expect(
      harness.service.executeCurrentWorkflowStep({
        engineeringSessionId: workflow.engineeringSessionId,
        executionStrategyId: workflow.executionStrategyId,
        missionPlanId: workflow.missionPlanId,
        taskId: workflow.taskId,
        adapterId: 'recording-adapter',
        contextPackageReference: `context-package-${workflow.missionId}`,
        consumedProjectionVersion: 'projection-v1',
        assignmentPolicyId: 'assignment-policy-workflow-execution-missing-service',
        assignmentPolicyEvaluationInput: createSatisfiedAssignmentPolicyEvaluationInput(),
      }),
    ).rejects.toThrow(InvalidEngineeringSessionDefinitionError);
    await expect(
      harness.executionSessionService.enumerateExecutionSessions(workflow.engineeringSessionId),
    ).resolves.toEqual([]);
    expect(harness.adapter.requests).toEqual([]);
  });

  it('records non-Completed Adapter responses as failed WorkflowStep execution attempts', async () => {
    const harness = await createWorkflowExecutionHarness('Failed');
    const workflow = await createReadyWorkflowExecutionScenario(harness, 'adapter-failed');

    const result = await harness.service.executeCurrentWorkflowStep({
      engineeringSessionId: workflow.engineeringSessionId,
      executionStrategyId: workflow.executionStrategyId,
      missionPlanId: workflow.missionPlanId,
      taskId: workflow.taskId,
      adapterId: 'recording-adapter',
      contextPackageReference: `context-package-${workflow.missionId}`,
      consumedProjectionVersion: 'projection-v1',
    });

    expect(result).toMatchObject({
      status: 'Failed',
      adapterResponse: {
        status: 'Failed',
      },
      executionSession: {
        assignedRole: 'builder',
        assignedAdapter: 'recording-adapter',
        executionOutcome: 'Failed',
      },
    });
    await expect(
      harness.executionSessionService.enumerateExecutionSessions(workflow.engineeringSessionId),
    ).resolves.toEqual([result.executionSession]);
    await expect(harness.service.getEngineeringSession(workflow.engineeringSessionId)).resolves.toMatchObject({
      currentWorkflowStepId: '0',
    });
  });

  it('executes WorkflowSteps deterministically for equivalent session state and Adapter responses', async () => {
    const left = await createWorkflowExecutionHarness();
    const right = await createWorkflowExecutionHarness();
    const leftWorkflow = await createReadyWorkflowExecutionScenario(left, 'deterministic');
    const rightWorkflow = await createReadyWorkflowExecutionScenario(right, 'deterministic');

    const command = {
      executionStrategyId: leftWorkflow.executionStrategyId,
      missionPlanId: leftWorkflow.missionPlanId,
      taskId: leftWorkflow.taskId,
      adapterId: 'recording-adapter',
      contextPackageReference: `context-package-${leftWorkflow.missionId}`,
      consumedProjectionVersion: 'projection-v1',
    };
    const leftResult = await left.service.executeCurrentWorkflowStep({
      engineeringSessionId: leftWorkflow.engineeringSessionId,
      ...command,
    });
    const rightResult = await right.service.executeCurrentWorkflowStep({
      engineeringSessionId: rightWorkflow.engineeringSessionId,
      ...command,
    });

    expect(leftResult).toEqual(rightResult);
  });

  it('evaluates AssignmentPolicy rejection deterministically for equivalent policy inputs', async () => {
    const left = await createWorkflowExecutionHarness();
    const right = await createWorkflowExecutionHarness();
    const leftWorkflow = await createReadyWorkflowExecutionScenario(left, 'policy-deterministic');
    const rightWorkflow = await createReadyWorkflowExecutionScenario(right, 'policy-deterministic');
    const leftPolicy = await createWorkflowExecutionAssignmentPolicy(left, 'policy-deterministic');
    const rightPolicy = await createWorkflowExecutionAssignmentPolicy(right, 'policy-deterministic');
    const command = {
      executionStrategyId: leftWorkflow.executionStrategyId,
      missionPlanId: leftWorkflow.missionPlanId,
      taskId: leftWorkflow.taskId,
      adapterId: 'recording-adapter',
      contextPackageReference: `context-package-${leftWorkflow.missionId}`,
      consumedProjectionVersion: 'projection-v1',
      assignmentPolicyId: leftPolicy.id,
      assignmentPolicyEvaluationInput: {
        ...createSatisfiedAssignmentPolicyEvaluationInput(),
        repositoryConfiguration: {
          branch: 'release',
        },
      },
    };

    expect(leftPolicy).toEqual(rightPolicy);

    const leftResult = await left.service.executeCurrentWorkflowStep({
      engineeringSessionId: leftWorkflow.engineeringSessionId,
      ...command,
    });
    const rightResult = await right.service.executeCurrentWorkflowStep({
      engineeringSessionId: rightWorkflow.engineeringSessionId,
      ...command,
    });

    expect(leftResult).toEqual(rightResult);
    expect(left.adapter.requests).toEqual([]);
    expect(right.adapter.requests).toEqual([]);
  });
});

async function createWorkflowExecutionHarnessWithoutAssignmentPolicyService(): Promise<WorkflowExecutionHarness> {
  const eventBus = new TestEventBus();
  const missionRepository = new InMemoryMissionRepository();
  const workflowChainRepository = await createWorkflowChainRepository();
  const engineeringSessionRepository = new InMemoryEngineeringSessionRepository();
  const executionSessionRepository = new InMemoryExecutionSessionRepository();
  const roleAssignmentRepository = new InMemoryRoleAssignmentRepository();
  const roleRegistry = new InMemoryRoleRegistry();
  const adapter = new RecordingAdapter();
  const adapterService = new AdapterService(
    new InMemoryAdapterRegistry([adapter]),
    ProtocolVersion.fromString('1.0'),
  );
  const executionSessionService = new ExecutionSessionService(
    executionSessionRepository,
    () => 'execution-session-1',
  );
  const assignmentPolicyService = new AssignmentPolicyService(
    new InMemoryAssignmentPolicyRepository(),
  );
  const executionStrategyService = new ExecutionStrategyService(
    new InMemoryExecutionStrategyRepository(),
    roleAssignmentRepository,
    missionRepository,
    () => 'execution-strategy-generated',
  );
  const roleService = new RoleService(roleRegistry, roleAssignmentRepository);
  const timestamps = [
    '2026-07-15T00:00:00.000Z',
    '2026-07-15T00:01:00.000Z',
    '2026-07-15T00:02:00.000Z',
    '2026-07-15T00:03:00.000Z',
    '2026-07-15T00:04:00.000Z',
    '2026-07-15T00:05:00.000Z',
    '2026-07-15T00:06:00.000Z',
    '2026-07-15T00:07:00.000Z',
    '2026-07-15T00:08:00.000Z',
    '2026-07-15T00:09:00.000Z',
    '2026-07-15T00:10:00.000Z',
    '2026-07-15T00:11:00.000Z',
    '2026-07-15T00:12:00.000Z',
    '2026-07-15T00:13:00.000Z',
    '2026-07-15T00:14:00.000Z',
    '2026-07-15T00:15:00.000Z',
  ];
  const createTimestamp = () => {
    const timestamp = timestamps.shift();

    if (timestamp === undefined) {
      throw new Error('No timestamp available for test.');
    }

    return timestamp;
  };

  await roleService.initialize();

  return {
    service: new EngineeringSessionService(
      engineeringSessionRepository,
      workflowChainRepository,
      () => 'engineering-session-generated',
      createTimestamp,
      executionStrategyService,
      adapterService,
      executionSessionService,
    ),
    assignmentPolicyService,
    roleService,
    executionSessionService,
    missionService: new MissionService(
      missionRepository,
      eventBus,
      () => 'mission-generated',
      createTimestamp,
    ),
    planningService: new MissionPlanningService(
      missionRepository,
      eventBus,
      () => 'mission-plan-generated',
      createTimestamp,
    ),
    executionStrategyService,
    adapter,
  };
}

async function createWorkflowExecutionHarness(
  adapterStatus: 'Completed' | 'Failed' = 'Completed',
): Promise<WorkflowExecutionHarness> {
  const eventBus = new TestEventBus();
  const missionRepository = new InMemoryMissionRepository();
  const workflowChainRepository = await createWorkflowChainRepository();
  const engineeringSessionRepository = new InMemoryEngineeringSessionRepository();
  const executionSessionRepository = new InMemoryExecutionSessionRepository();
  const roleAssignmentRepository = new InMemoryRoleAssignmentRepository();
  const roleRegistry = new InMemoryRoleRegistry();
  const adapter = new RecordingAdapter(adapterStatus);
  const adapterService = new AdapterService(
    new InMemoryAdapterRegistry([adapter]),
    ProtocolVersion.fromString('1.0'),
  );
  const executionSessionService = new ExecutionSessionService(
    executionSessionRepository,
    () => 'execution-session-1',
  );
  const assignmentPolicyService = new AssignmentPolicyService(
    new InMemoryAssignmentPolicyRepository(),
  );
  const executionStrategyService = new ExecutionStrategyService(
    new InMemoryExecutionStrategyRepository(),
    roleAssignmentRepository,
    missionRepository,
    () => 'execution-strategy-generated',
  );
  const roleService = new RoleService(roleRegistry, roleAssignmentRepository);
  const timestamps = [
    '2026-07-15T00:00:00.000Z',
    '2026-07-15T00:01:00.000Z',
    '2026-07-15T00:02:00.000Z',
    '2026-07-15T00:03:00.000Z',
    '2026-07-15T00:04:00.000Z',
    '2026-07-15T00:05:00.000Z',
    '2026-07-15T00:06:00.000Z',
    '2026-07-15T00:07:00.000Z',
    '2026-07-15T00:08:00.000Z',
    '2026-07-15T00:09:00.000Z',
    '2026-07-15T00:10:00.000Z',
    '2026-07-15T00:11:00.000Z',
    '2026-07-15T00:12:00.000Z',
    '2026-07-15T00:13:00.000Z',
    '2026-07-15T00:14:00.000Z',
    '2026-07-15T00:15:00.000Z',
  ];
  const createTimestamp = () => {
    const timestamp = timestamps.shift();

    if (timestamp === undefined) {
      throw new Error('No timestamp available for test.');
    }

    return timestamp;
  };

  await roleService.initialize();

  return {
    service: new EngineeringSessionService(
      engineeringSessionRepository,
      workflowChainRepository,
      () => 'engineering-session-generated',
      createTimestamp,
      executionStrategyService,
      adapterService,
      executionSessionService,
      assignmentPolicyService,
    ),
    assignmentPolicyService,
    roleService,
    executionSessionService,
    missionService: new MissionService(
      missionRepository,
      eventBus,
      () => 'mission-generated',
      createTimestamp,
    ),
    planningService: new MissionPlanningService(
      missionRepository,
      eventBus,
      () => 'mission-plan-generated',
      createTimestamp,
    ),
    executionStrategyService,
    adapter,
  };
}

async function createGovernanceGatedAdvancementHarness(input: {
  readonly reviewOutcome?: ReviewOutcomeValue;
  readonly governanceDecisionValue?: GovernanceDecisionValue;
  readonly registerGovernanceDecision?: boolean;
} = {}): Promise<{
  readonly service: EngineeringSessionService;
  readonly governanceDecision: GovernanceDecision;
  readonly governanceDecisionId: string;
  readonly engineeringSessionId: string;
}> {
  const engineeringSessionRepository = new InMemoryEngineeringSessionRepository();
  const workflowChainRepository = await createWorkflowChainRepository();
  const governanceDecisionRepository = new InMemoryGovernanceDecisionRepository();
  const reviewRepository = new InMemoryReviewRepository();
  const service = new EngineeringSessionService(
    engineeringSessionRepository,
    workflowChainRepository,
    () => 'unused-generated-session-id',
    createTimestampSequence(['2026-07-16T00:00:00.000Z']),
    undefined,
    undefined,
    undefined,
    undefined,
    new InMemoryEngineeringSessionCheckpointRepository(),
    governanceDecisionRepository,
    reviewRepository,
  );
  const review = createCompletedReview(input.reviewOutcome ?? 'Accepted');
  const governanceDecision = createGovernanceDecision(input.governanceDecisionValue ?? 'Approved');
  const engineeringSessionId = 'engineering-session-governance-gated';

  await reviewRepository.create(review);
  if (input.registerGovernanceDecision ?? true) {
    await governanceDecisionRepository.register(governanceDecision);
  }
  await createEngineeringSessionForAdvancement(service, engineeringSessionId);

  return {
    service,
    governanceDecision,
    governanceDecisionId: governanceDecision.id.toString(),
    engineeringSessionId,
  };
}

async function createEngineeringSessionForAdvancement(
  service: EngineeringSessionService,
  id: string,
): Promise<void> {
  await service.createEngineeringSession({
    id,
    engineeringRuntimeContextReference: `runtime-context-${id}`,
    activeEngineeringWorkflowReference: 'builder-workflow',
    workflowChainId: 'workflow-chain-1',
    currentWorkflowStepId: '0',
    participatingRoleIds: ['builder', 'reviewer'],
    workflowState: 'active',
  });
}

function createCompletedReview(outcome: ReviewOutcomeValue): Review {
  const review = Review.create({
    id: 'review-governance-gated',
    missionId: 'mission-governance-gated',
    missionPlanRevision: 'mission-plan-revision-governance-gated',
    reviewCriteria: [{ id: 'review-criteria-1', description: 'Review criteria.' }],
    evidenceReferences: ['evidence-1'],
  });
  const metadata = {
    eventId: 'event-review-governance-gated',
    timestamp: '2026-07-16T00:00:00.000Z',
  };

  review.start(metadata);
  review.complete(outcome, metadata, metadata);
  review.pullDomainEvents();

  return review;
}

function createGovernanceDecision(value: GovernanceDecisionValue): GovernanceDecision {
  return GovernanceDecision.fromSnapshot({
    id: 'governance-decision-governance-gated',
    missionId: 'mission-governance-gated',
    value,
    repositoryPolicyId: 'repository-policy-governance-gated',
    repositoryPolicyVersion: 1,
    reviewId: 'review-governance-gated',
    reviewStateReference: 'review-state-governance-gated',
    policyEvaluationId: 'policy-evaluation-governance-gated',
    evaluationKey: 'repository-policy-governance-gated:1:mission-governance-gated',
    criterionResults: [],
    evaluatedAt: '2026-07-16T00:00:00.000Z',
    explanationCodes: ['governance-gated-advancement.test'],
  });
}

function createSatisfiedAssignmentPolicyEvaluationInput(): {
  readonly adapterExecutionCapability: string;
  readonly repositoryConfiguration: Readonly<Record<string, string>>;
  readonly executionConstraints: Readonly<Record<string, string>>;
  readonly humanPreferences: Readonly<Record<string, string>>;
} {
  return Object.freeze({
    adapterExecutionCapability: 'CodeModification',
    repositoryConfiguration: Object.freeze({
      branch: 'main',
    }),
    executionConstraints: Object.freeze({
      sandbox: 'enabled',
    }),
    humanPreferences: Object.freeze({
      review: 'required',
    }),
  });
}

function createTimestampSequence(timestamps: string[]): () => string {
  return () => {
    const timestamp = timestamps.shift();

    if (timestamp === undefined) {
      throw new Error('No timestamp available for test.');
    }

    return timestamp;
  };
}

async function createWorkflowExecutionAssignmentPolicy(
  harness: WorkflowExecutionHarness,
  suffix: string,
) {
  return harness.assignmentPolicyService.createAssignmentPolicy({
    id: `assignment-policy-workflow-execution-${suffix}`,
    requiredRole: 'builder',
    ...createSatisfiedAssignmentPolicyEvaluationInput(),
  });
}

function createAdapterService(adapter: RecordingAdapter): AdapterService {
  return new AdapterService(
    new InMemoryAdapterRegistry([adapter]),
    ProtocolVersion.fromString('1.0'),
  );
}

function createWorkflowExecutionCommand(): Parameters<
  EngineeringSessionService['executeCurrentWorkflowStep']
>[0] {
  return {
    engineeringSessionId: 'engineering-session-workflow-execution-guard',
    executionStrategyId: 'execution-strategy-workflow-execution-guard',
    missionPlanId: 'mission-plan-workflow-execution-guard',
    taskId: 'task-workflow-execution-guard',
    adapterId: 'recording-adapter',
    contextPackageReference: 'context-package-workflow-execution-guard',
    consumedProjectionVersion: 'projection-v1',
  };
}

async function createReadyWorkflowExecutionScenario(
  harness: WorkflowExecutionHarness,
  suffix: string,
  options: { readonly completePrerequisite?: boolean } = {},
): Promise<{
  readonly missionId: string;
  readonly missionPlanId: string;
  readonly prerequisiteTaskId: string;
  readonly taskId: string;
  readonly executionStrategyId: string;
  readonly engineeringSessionId: string;
}> {
  const missionId = `mission-workflow-execution-${suffix}`;
  const missionPlanId = `mission-plan-workflow-execution-${suffix}`;
  const prerequisiteTaskId = `task-workflow-execution-${suffix}-prerequisite`;
  const taskId = `task-workflow-execution-${suffix}`;
  const executionStrategyId = `execution-strategy-workflow-execution-${suffix}`;
  const engineeringSessionId = `engineering-session-workflow-execution-${suffix}`;

  await harness.missionService.createMission({
    id: missionId,
    objective: `Validate Workflow Chain Execution ${suffix}.`,
  });
  await harness.planningService.createMissionPlan({
    id: missionPlanId,
    missionId,
    revisionReason: 'Create Sprint 47 Workflow Chain Execution plan.',
  });
  await harness.planningService.addTask({
    missionPlanId,
    taskId: prerequisiteTaskId,
    title: 'Prepare execution prerequisite',
    description: 'Prerequisite for Workflow Chain Execution readiness.',
  });
  await harness.planningService.addTask({
    missionPlanId,
    taskId,
    title: 'Execute current WorkflowStep',
    description: 'Task assigned to the current WorkflowStep Role.',
    dependencies: [prerequisiteTaskId],
  });
  if (options.completePrerequisite ?? true) {
    await harness.planningService.updateTask({
      missionPlanId,
      taskId: prerequisiteTaskId,
      status: 'Ready',
    });
    await harness.planningService.updateTask({
      missionPlanId,
      taskId: prerequisiteTaskId,
      status: 'InProgress',
    });
    await harness.planningService.updateTask({
      missionPlanId,
      taskId: prerequisiteTaskId,
      status: 'Completed',
    });
  }
  await harness.roleService.assignRole({
    taskId,
    roleId: 'builder',
  });
  await harness.executionStrategyService.createExecutionStrategy({
    id: executionStrategyId,
    missionId,
  });
  await harness.service.createEngineeringSession({
    id: engineeringSessionId,
    engineeringRuntimeContextReference: `runtime-context-${suffix}`,
    activeEngineeringWorkflowReference: 'builder-workflow',
    workflowChainId: 'workflow-chain-1',
    currentWorkflowStepId: '0',
    participatingRoleIds: ['builder', 'reviewer'],
    workflowState: 'active',
  });

  return {
    missionId,
    missionPlanId,
    prerequisiteTaskId,
    taskId,
    executionStrategyId,
    engineeringSessionId,
  };
}

async function createRoleMismatchWorkflowExecutionScenario(
  harness: WorkflowExecutionHarness,
): Promise<{
  readonly missionId: string;
  readonly missionPlanId: string;
  readonly taskId: string;
  readonly executionStrategyId: string;
  readonly engineeringSessionId: string;
}> {
  const missionId = 'mission-workflow-execution-role-mismatch';
  const missionPlanId = 'mission-plan-workflow-execution-role-mismatch';
  const taskId = 'task-workflow-execution-role-mismatch';
  const executionStrategyId = 'execution-strategy-workflow-execution-role-mismatch';
  const engineeringSessionId = 'engineering-session-workflow-execution-role-mismatch';

  await harness.missionService.createMission({
    id: missionId,
    objective: 'Validate Workflow Chain Execution role mismatch rejection.',
  });
  await harness.planningService.createMissionPlan({
    id: missionPlanId,
    missionId,
    revisionReason: 'Create Sprint 47 role-mismatch plan.',
  });
  await harness.planningService.addTask({
    missionPlanId,
    taskId,
    title: 'Execute mismatched current WorkflowStep',
    description: 'Task assignment intentionally differs from the current WorkflowStep Role.',
  });
  await harness.roleService.assignRole({
    taskId,
    roleId: 'reviewer',
  });
  await harness.executionStrategyService.createExecutionStrategy({
    id: executionStrategyId,
    missionId,
  });
  await harness.service.createEngineeringSession({
    id: engineeringSessionId,
    engineeringRuntimeContextReference: 'runtime-context-role-mismatch',
    activeEngineeringWorkflowReference: 'builder-workflow',
    workflowChainId: 'workflow-chain-1',
    currentWorkflowStepId: '0',
    participatingRoleIds: ['builder', 'reviewer'],
    workflowState: 'active',
  });

  return {
    missionId,
    missionPlanId,
    taskId,
    executionStrategyId,
    engineeringSessionId,
  };
}
