import { WorkflowChain } from './workflow-chain';
import { WorkflowChainId } from './workflow-chain-id';
import { DuplicateWorkflowChainError } from './workflow-chain.errors';
import type { WorkflowChainSnapshot } from './workflow-chain.types';

export interface IWorkflowChainRepository {
  create(workflowChain: WorkflowChain): Promise<void>;
  getById(workflowChainId: WorkflowChainId | string): Promise<WorkflowChain | undefined>;
  enumerate(): Promise<readonly WorkflowChain[]>;
}

export class InMemoryWorkflowChainRepository implements IWorkflowChainRepository {
  private readonly chainsById = new Map<string, WorkflowChainSnapshot>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async create(workflowChain: WorkflowChain): Promise<void> {
    await this.runExclusive(() => {
      const snapshot = workflowChain.toSnapshot();

      if (this.chainsById.has(snapshot.id)) {
        throw new DuplicateWorkflowChainError(snapshot.id);
      }

      this.chainsById.set(snapshot.id, snapshot);
    });
  }

  public async getById(
    workflowChainId: WorkflowChainId | string,
  ): Promise<WorkflowChain | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.chainsById.get(normalizeWorkflowChainId(workflowChainId).toString());

      if (snapshot === undefined) {
        return undefined;
      }

      return WorkflowChain.fromSnapshot(snapshot);
    });
  }

  public async enumerate(): Promise<readonly WorkflowChain[]> {
    return this.runExclusive(() =>
      Object.freeze(
        [...this.chainsById.values()]
          .map((snapshot) => WorkflowChain.fromSnapshot(snapshot))
          .sort((left, right) => left.id.toString().localeCompare(right.id.toString())),
      ),
    );
  }

  private async runExclusive<T>(operation: () => T): Promise<T> {
    const run = this.operationQueue.then(operation, operation);
    this.operationQueue = run.then(
      () => undefined,
      () => undefined,
    );

    return run;
  }
}

function normalizeWorkflowChainId(workflowChainId: WorkflowChainId | string): WorkflowChainId {
  return typeof workflowChainId === 'string'
    ? WorkflowChainId.fromString(workflowChainId)
    : workflowChainId;
}
