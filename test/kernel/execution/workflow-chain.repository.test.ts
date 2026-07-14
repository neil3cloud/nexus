import { describe, expect, it } from 'vitest';

import { WorkflowChain } from '../../../src/kernel/execution/workflow-chain';
import {
  DuplicateWorkflowChainError,
} from '../../../src/kernel/execution/workflow-chain.errors';
import { InMemoryWorkflowChainRepository } from '../../../src/kernel/execution/workflow-chain.repository';

function createWorkflowChain(id: string): WorkflowChain {
  return WorkflowChain.create({
    id,
    steps: [{ roleId: 'builder' }],
  });
}

describe('InMemoryWorkflowChainRepository', () => {
  it('creates, retrieves, and enumerates WorkflowChains deterministically', async () => {
    const repository = new InMemoryWorkflowChainRepository();
    const workflowChainB = createWorkflowChain('workflow-chain-b');
    const workflowChainA = createWorkflowChain('workflow-chain-a');
    const workflowChainC = createWorkflowChain('workflow-chain-c');

    await repository.create(workflowChainB);
    await repository.create(workflowChainA);
    await repository.create(workflowChainC);

    expect((await repository.getById('workflow-chain-a'))?.toSnapshot()).toEqual(
      workflowChainA.toSnapshot(),
    );
    expect((await repository.enumerate()).map((chain) => chain.id.toString())).toEqual([
      'workflow-chain-a',
      'workflow-chain-b',
      'workflow-chain-c',
    ]);
    expect(await repository.getById('workflow-chain-missing')).toBeUndefined();
    expect('save' in repository).toBe(false);
    expect('exists' in repository).toBe(false);
  });

  it('rejects duplicate WorkflowChain identities', async () => {
    const repository = new InMemoryWorkflowChainRepository();

    await repository.create(createWorkflowChain('workflow-chain-1'));

    await expect(repository.create(createWorkflowChain('workflow-chain-1'))).rejects.toThrow(
      DuplicateWorkflowChainError,
    );
  });
});
