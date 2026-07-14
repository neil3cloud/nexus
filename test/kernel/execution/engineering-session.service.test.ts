import { describe, expect, it } from 'vitest';

import {
  EngineeringSessionNotFoundError,
  InvalidEngineeringSessionDefinitionError,
  InvalidEngineeringSessionLifecycleTransitionError,
} from '../../../src/kernel/execution/engineering-session.errors';
import { InvalidAdvancementTriggerDefinitionError } from '../../../src/kernel/execution/advancement-trigger.errors';
import { EngineeringSession } from '../../../src/kernel/execution/engineering-session';
import { InMemoryEngineeringSessionRepository } from '../../../src/kernel/execution/engineering-session.repository';
import { EngineeringSessionService } from '../../../src/kernel/execution/engineering-session.service';
import { WorkflowChain } from '../../../src/kernel/execution/workflow-chain';
import { InMemoryWorkflowChainRepository } from '../../../src/kernel/execution/workflow-chain.repository';

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
});
