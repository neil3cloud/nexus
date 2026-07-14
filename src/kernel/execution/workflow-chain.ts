import { RoleId } from './role-id';
import { WorkflowChainId } from './workflow-chain-id';
import { InvalidWorkflowChainDefinitionError } from './workflow-chain.errors';
import type {
  WorkflowChainInput,
  WorkflowChainSnapshot,
  WorkflowStepInput,
  WorkflowStepSnapshot,
} from './workflow-chain.types';

const workflowStepAllowedKeys = new Set(['roleId']);
const workflowStepForbiddenKeys = new Set([
  'engineeringSession',
  'engineeringSessionId',
  'executionSession',
  'executionSessionId',
  'adapter',
  'adapterId',
  'assignmentPolicy',
  'engineeringRoleProfile',
  'engineeringRoleProfileId',
]);

export class WorkflowStep {
  private constructor(private readonly roleIdValue: RoleId) {
    Object.freeze(this);
  }

  public static create(input: WorkflowStepInput): WorkflowStep {
    assertWorkflowStepBoundary(input);

    return new WorkflowStep(
      RoleId.fromString(normalizeNonEmptyString(input.roleId, 'WorkflowStep roleId')),
    );
  }

  public static fromSnapshot(snapshot: WorkflowStepSnapshot): WorkflowStep {
    return WorkflowStep.create(snapshot);
  }

  public get roleId(): RoleId {
    return this.roleIdValue;
  }

  public equals(other: WorkflowStep): boolean {
    return this.roleIdValue.equals(other.roleId);
  }

  public toSnapshot(): WorkflowStepSnapshot {
    return Object.freeze({
      roleId: this.roleIdValue.toString(),
    });
  }
}

export class WorkflowChain {
  private constructor(
    private readonly workflowChainId: WorkflowChainId,
    private readonly workflowStepValues: readonly WorkflowStep[],
  ) {
    Object.freeze(this);
  }

  public static create(input: WorkflowChainInput): WorkflowChain {
    return new WorkflowChain(
      WorkflowChainId.fromString(input.id),
      normalizeWorkflowSteps(input.steps),
    );
  }

  public static fromSnapshot(snapshot: WorkflowChainSnapshot): WorkflowChain {
    return WorkflowChain.create(snapshot);
  }

  public get id(): WorkflowChainId {
    return this.workflowChainId;
  }

  public get steps(): readonly WorkflowStep[] {
    return Object.freeze([...this.workflowStepValues]);
  }

  public equals(other: WorkflowChain): boolean {
    return JSON.stringify(this.toSnapshot()) === JSON.stringify(other.toSnapshot());
  }

  public toSnapshot(): WorkflowChainSnapshot {
    return Object.freeze({
      id: this.workflowChainId.toString(),
      steps: Object.freeze(this.workflowStepValues.map((step) => step.toSnapshot())),
    });
  }
}

function normalizeWorkflowSteps(steps: readonly WorkflowStepInput[]): readonly WorkflowStep[] {
  if (steps.length === 0) {
    throw new InvalidWorkflowChainDefinitionError(
      'WorkflowChain steps requires at least one WorkflowStep.',
    );
  }

  return Object.freeze(steps.map((step) => WorkflowStep.create(step)));
}

function assertWorkflowStepBoundary(input: WorkflowStepInput): void {
  const keys = Object.keys(input);
  const unsupportedKeys = keys.filter((key) => !workflowStepAllowedKeys.has(key));
  const forbiddenKeys = unsupportedKeys.filter((key) => workflowStepForbiddenKeys.has(key));

  if (forbiddenKeys.length > 0) {
    throw new InvalidWorkflowChainDefinitionError(
      `WorkflowStep cannot reference ${forbiddenKeys.join(', ')}.`,
    );
  }

  if (unsupportedKeys.length > 0) {
    throw new InvalidWorkflowChainDefinitionError(
      `WorkflowStep supports only roleId; unsupported field(s): ${unsupportedKeys.join(', ')}.`,
    );
  }
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidWorkflowChainDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
