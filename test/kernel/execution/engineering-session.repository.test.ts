import { describe, expect, it } from 'vitest';

import { EngineeringSession } from '../../../src/kernel/execution/engineering-session';
import {
  DuplicateEngineeringSessionError,
} from '../../../src/kernel/execution/engineering-session.errors';
import { InMemoryEngineeringSessionRepository } from '../../../src/kernel/execution/engineering-session.repository';
import { WorkflowChain } from '../../../src/kernel/execution/workflow-chain';

const workflowChain = WorkflowChain.create({
  id: 'workflow-chain-1',
  steps: [{ roleId: 'builder' }, { roleId: 'reviewer' }],
});

function createSession(id: string): EngineeringSession {
  return EngineeringSession.create({
    id,
    engineeringRuntimeContextReference: `runtime-context-${id}`,
    activeEngineeringWorkflowReference: 'builder-workflow',
    workflowChainId: 'workflow-chain-1',
    currentWorkflowStepId: '0',
    participatingRoleIds: ['builder'],
    workflowState: 'active',
    timeline: {
      createdAt: '2026-07-14T00:00:00.000Z',
    },
  }, workflowChain);
}

describe('InMemoryEngineeringSessionRepository', () => {
  it('creates, retrieves, saves, and enumerates EngineeringSessions deterministically', async () => {
    const repository = new InMemoryEngineeringSessionRepository();
    const sessionB = createSession('session-b');
    const sessionA = createSession('session-a');

    await repository.create(sessionB);
    await repository.create(sessionA);
    sessionA.close('2026-07-14T01:00:00.000Z');
    await repository.save(sessionA);

    expect(await repository.exists('session-a')).toBe(true);
    expect((await repository.getById('session-a'))?.toSnapshot()).toEqual(sessionA.toSnapshot());
    expect((await repository.getById('session-b'))?.toSnapshot()).toMatchObject({
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '0',
    });
    expect((await repository.enumerate()).map((session) => session.id.toString())).toEqual([
      'session-a',
      'session-b',
    ]);
  });

  it('rejects duplicate EngineeringSession identities', async () => {
    const repository = new InMemoryEngineeringSessionRepository();

    await repository.create(createSession('session-1'));

    await expect(repository.create(createSession('session-1'))).rejects.toThrow(
      DuplicateEngineeringSessionError,
    );
  });

  it('persists and reconstitutes advanced workflow position deterministically', async () => {
    const repository = new InMemoryEngineeringSessionRepository();
    const session = createSession('session-1');

    await repository.create(session);

    session.advanceWorkflow(workflowChain);
    await repository.save(session);

    const reconstituted = await repository.getById('session-1');

    expect(reconstituted?.toSnapshot()).toEqual(session.toSnapshot());
    expect(reconstituted?.currentWorkflowStepId).toBe('1');
    expect(reconstituted?.isWorkflowComplete(workflowChain)).toBe(true);
  });
});
