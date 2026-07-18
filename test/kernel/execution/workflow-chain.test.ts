import { describe, expect, it } from 'vitest';

import {
  WorkflowChain,
  WorkflowStep,
} from '../../../src/kernel/execution/workflow-chain';
import { WorkflowChainId } from '../../../src/kernel/execution/workflow-chain-id';
import { InvalidWorkflowChainDefinitionError } from '../../../src/kernel/execution/workflow-chain.errors';
import type {
  WorkflowStepInput,
  WorkflowStepSnapshot,
} from '../../../src/kernel/execution/workflow-chain.types';

function createWorkflowChain(): WorkflowChain {
  return WorkflowChain.create({
    id: ' workflow-chain-1 ',
    steps: [{ roleId: ' builder ' }, { roleId: ' reviewer ' }],
  });
}

describe('WorkflowChain domain', () => {
  it('constructs immutable WorkflowChains with deterministic snapshots and equality', () => {
    const workflowChain = createWorkflowChain();
    const equivalentWorkflowChain = WorkflowChain.fromSnapshot(workflowChain.toSnapshot());

    expect(workflowChain.toSnapshot()).toEqual({
      id: 'workflow-chain-1',
      steps: [{ roleId: 'builder' }, { roleId: 'reviewer' }],
    });
    expect(workflowChain.equals(equivalentWorkflowChain)).toBe(true);
    expect(WorkflowChainId.fromString('workflow-chain-1').equals(workflowChain.id)).toBe(true);
    expect(workflowChain.steps.map((step) => step.roleId.toString())).toEqual([
      'builder',
      'reviewer',
    ]);
    expect(Object.isFrozen(workflowChain)).toBe(true);
    expect(Object.isFrozen(workflowChain.steps)).toBe(true);
    expect(Object.isFrozen(workflowChain.toSnapshot())).toBe(true);
    expect(Object.isFrozen(workflowChain.toSnapshot().steps)).toBe(true);
    expect(Object.isFrozen(workflowChain.toSnapshot().steps[0])).toBe(true);
    expect('close' in workflowChain).toBe(false);
    expect('save' in workflowChain).toBe(false);
    expect('advance' in workflowChain).toBe(false);
    expect('addStep' in workflowChain).toBe(false);
  });

  it('preserves workflow topology by ordered WorkflowStep sequence', () => {
    expect(createWorkflowChain().toSnapshot().steps).toEqual([
      { roleId: 'builder' },
      { roleId: 'reviewer' },
    ]);
    expect(
      WorkflowChain.create({
        id: 'workflow-chain-2',
        steps: [{ roleId: 'reviewer' }, { roleId: 'builder' }],
      }).toSnapshot().steps,
    ).toEqual([{ roleId: 'reviewer' }, { roleId: 'builder' }]);
  });

  it('prevents mutation of exposed WorkflowChain topology', () => {
    const workflowChain = createWorkflowChain();
    const steps = workflowChain.steps;
    const snapshot = workflowChain.toSnapshot();

    expect(() =>
      (steps as WorkflowStep[]).push(WorkflowStep.create({ roleId: 'documentation-reviewer' })),
    ).toThrow(TypeError);
    expect(() =>
      (snapshot.steps as WorkflowStepSnapshot[]).push({ roleId: 'documentation-reviewer' }),
    ).toThrow(TypeError);
    expect(workflowChain.toSnapshot().steps).toEqual([
      { roleId: 'builder' },
      { roleId: 'reviewer' },
    ]);
  });

  it('rejects invalid WorkflowChain definitions deterministically', () => {
    expect(() => WorkflowChainId.fromString('')).toThrow(InvalidWorkflowChainDefinitionError);
    expect(() =>
      WorkflowChain.create({
        id: '',
        steps: [{ roleId: 'builder' }],
      }),
    ).toThrow(InvalidWorkflowChainDefinitionError);
    expect(() =>
      WorkflowChain.create({
        id: 'workflow-chain-1',
        steps: [],
      }),
    ).toThrow(InvalidWorkflowChainDefinitionError);
    expect(() =>
      WorkflowChain.create({
        id: 'workflow-chain-1',
        steps: [{ roleId: '' }],
      }),
    ).toThrow(InvalidWorkflowChainDefinitionError);
  });

  it('enforces WorkflowStep boundaries around exactly one Execution Role reference', () => {
    const validStep = WorkflowStep.create({ roleId: ' builder ' });

    expect(validStep.toSnapshot()).toEqual({ roleId: 'builder' });
    expect(Object.isFrozen(validStep)).toBe(true);
    expect(Object.isFrozen(validStep.toSnapshot())).toBe(true);
    expect(validStep.equals(WorkflowStep.fromSnapshot({ roleId: 'builder' }))).toBe(true);

    const forbiddenEngineeringSessionStep: WorkflowStepInput = {
      roleId: 'builder',
      // @ts-expect-error WorkflowStep must not carry EngineeringSession references.
      engineeringSessionId: 'engineering-session-1',
    };
    const forbiddenExecutionSessionStep: WorkflowStepInput = {
      roleId: 'builder',
      // @ts-expect-error WorkflowStep must not carry ExecutionSession references.
      executionSessionId: 'execution-session-1',
    };
    const forbiddenAdapterStep: WorkflowStepInput = {
      roleId: 'builder',
      // @ts-expect-error WorkflowStep must not carry Adapter references.
      adapterId: 'mock-adapter',
    };
    const forbiddenAssignmentPolicyStep: WorkflowStepInput = {
      roleId: 'builder',
      // @ts-expect-error WorkflowStep must not carry Assignment Policy references.
      assignmentPolicy: 'round-robin',
    };
    const forbiddenEngineeringRoleProfileStep: WorkflowStepInput = {
      roleId: 'builder',
      // @ts-expect-error WorkflowStep must not carry EngineeringRoleProfile references.
      engineeringRoleProfileId: 'builder-profile',
    };
    const unsupportedStep: WorkflowStepInput = {
      roleId: 'builder',
      // @ts-expect-error WorkflowStep supports only roleId.
      label: 'Build',
    };

    for (const invalidStep of [
      forbiddenEngineeringSessionStep,
      forbiddenExecutionSessionStep,
      forbiddenAdapterStep,
      forbiddenAssignmentPolicyStep,
      forbiddenEngineeringRoleProfileStep,
      unsupportedStep,
    ]) {
      expect(() => WorkflowStep.create(invalidStep)).toThrow(InvalidWorkflowChainDefinitionError);
    }
  });
});
