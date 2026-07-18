import { randomUUID } from 'node:crypto';

import { ServiceLifecycle } from '../common/service-lifecycle';
import { WorkflowChain } from './workflow-chain';
import type {
  CreateWorkflowChainCommand,
  WorkflowChainServiceContract,
} from './workflow-chain.contract';
import { WorkflowChainId } from './workflow-chain-id';
import { WorkflowChainNotFoundError } from './workflow-chain.errors';
import {
  InMemoryWorkflowChainRepository,
  type IWorkflowChainRepository,
} from './workflow-chain.repository';
import type { WorkflowChainSnapshot } from './workflow-chain.types';

export class WorkflowChainService
  extends ServiceLifecycle
  implements WorkflowChainServiceContract
{
  public constructor(
    private readonly repository: IWorkflowChainRepository = new InMemoryWorkflowChainRepository(),
    private readonly createIdentity: () => string = randomUUID,
  ) {
    super('WorkflowChainService');
  }

  public async createWorkflowChain(
    command: CreateWorkflowChainCommand,
  ): Promise<WorkflowChainSnapshot> {
    const workflowChain = WorkflowChain.create({
      id: command.id ?? this.createIdentity(),
      steps: command.steps,
    });

    await this.repository.create(workflowChain);

    return workflowChain.toSnapshot();
  }

  public async getWorkflowChain(workflowChainId: string): Promise<WorkflowChainSnapshot> {
    return (await this.requireWorkflowChain(workflowChainId)).toSnapshot();
  }

  public async enumerateWorkflowChains(): Promise<readonly WorkflowChainSnapshot[]> {
    return Object.freeze(
      (await this.repository.enumerate()).map((workflowChain) => workflowChain.toSnapshot()),
    );
  }

  private async requireWorkflowChain(
    workflowChainId: WorkflowChainId | string,
  ): Promise<WorkflowChain> {
    const normalizedWorkflowChainId =
      typeof workflowChainId === 'string'
        ? WorkflowChainId.fromString(workflowChainId)
        : workflowChainId;
    const workflowChain = await this.repository.getById(normalizedWorkflowChainId);

    if (workflowChain === undefined) {
      throw new WorkflowChainNotFoundError(normalizedWorkflowChainId.toString());
    }

    return workflowChain;
  }
}
