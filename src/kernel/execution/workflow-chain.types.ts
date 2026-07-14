export interface WorkflowStepInput {
  readonly roleId: string;
}

export interface WorkflowStepSnapshot {
  readonly roleId: string;
}

export interface WorkflowChainInput {
  readonly id: string;
  readonly steps: readonly WorkflowStepInput[];
}

export interface WorkflowChainSnapshot {
  readonly id: string;
  readonly steps: readonly WorkflowStepSnapshot[];
}
