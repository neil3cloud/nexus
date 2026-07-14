import { describe, expect, it } from 'vitest';

import {
  InvalidWorkflowChainDefinitionError,
  WorkflowChainNotFoundError,
} from '../../../src/kernel/execution/workflow-chain.errors';
import { InMemoryWorkflowChainRepository } from '../../../src/kernel/execution/workflow-chain.repository';
import { WorkflowChainService } from '../../../src/kernel/execution/workflow-chain.service';

describe('WorkflowChainService', () => {
  it('creates, looks up, and enumerates chains through repository contracts', async () => {
    const service = new WorkflowChainService(
      new InMemoryWorkflowChainRepository(),
      () => 'workflow-chain-1',
    );

    const created = await service.createWorkflowChain({
      steps: [{ roleId: 'builder' }, { roleId: 'reviewer' }],
    });

    expect(created).toEqual({
      id: 'workflow-chain-1',
      steps: [{ roleId: 'builder' }, { roleId: 'reviewer' }],
    });
    await expect(service.getWorkflowChain('workflow-chain-1')).resolves.toEqual(created);
    await expect(service.enumerateWorkflowChains()).resolves.toEqual([created]);
  });

  it('reports not-found and invalid input without hiding domain failures', async () => {
    const service = new WorkflowChainService(
      new InMemoryWorkflowChainRepository(),
      () => 'workflow-chain-1',
    );

    await expect(service.getWorkflowChain('missing-workflow-chain')).rejects.toThrow(
      WorkflowChainNotFoundError,
    );
    await expect(
      service.createWorkflowChain({
        steps: [],
      }),
    ).rejects.toThrow(InvalidWorkflowChainDefinitionError);
  });

  it('does not expose dispatch, advancement, Assignment Policy, or EngineeringSession wiring', () => {
    const service = new WorkflowChainService();

    expect('dispatch' in service).toBe(false);
    expect('advance' in service).toBe(false);
    expect('evaluateAssignmentPolicy' in service).toBe(false);
    expect('attachEngineeringSession' in service).toBe(false);
  });
});
