import { describe, expect, it } from 'vitest';

import {
  EngineeringSessionNotFoundError,
  InvalidEngineeringSessionDefinitionError,
  InvalidEngineeringSessionLifecycleTransitionError,
} from '../../../src/kernel/execution/engineering-session.errors';
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
});
