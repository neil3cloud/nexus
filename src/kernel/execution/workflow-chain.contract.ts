import type { WorkflowChainSnapshot, WorkflowStepInput } from './workflow-chain.types';

export interface CreateWorkflowChainCommand {
  readonly id?: string;
  readonly steps: readonly WorkflowStepInput[];
}

export interface WorkflowChainServiceContract {
  createWorkflowChain(command: CreateWorkflowChainCommand): Promise<WorkflowChainSnapshot>;
  getWorkflowChain(workflowChainId: string): Promise<WorkflowChainSnapshot>;
  enumerateWorkflowChains(): Promise<readonly WorkflowChainSnapshot[]>;
}
