import { describe, expect, it } from 'vitest';

import {
  AssignmentAdapterExecutionCapability,
  AssignmentExecutionConstraints,
  AssignmentHumanPreferences,
  AssignmentPolicy,
  AssignmentRepositoryConfiguration,
  AssignmentRequiredRole,
} from '../../../src/kernel/execution/assignment-policy';
import { AssignmentPolicyId } from '../../../src/kernel/execution/assignment-policy-id';
import { InvalidAssignmentPolicyDefinitionError } from '../../../src/kernel/execution/assignment-policy.errors';
import type {
  AssignmentPolicyEvaluationInput,
  AssignmentPolicyInput,
} from '../../../src/kernel/execution/assignment-policy.types';

function createAssignmentPolicy(): AssignmentPolicy {
  return AssignmentPolicy.create({
    id: ' assignment-policy-1 ',
    requiredRole: ' builder ',
    adapterExecutionCapability: ' CodeModification ',
    repositoryConfiguration: {
      branch: 'main',
      repository: 'nexus',
    },
    executionConstraints: {
      validation: 'required',
    },
    humanPreferences: {
      reviewer: 'human-required',
    },
  });
}

const matchingEvaluationInput: AssignmentPolicyEvaluationInput = {
  requiredRole: 'builder',
  adapterExecutionCapability: 'CodeModification',
  repositoryConfiguration: {
    repository: 'nexus',
    branch: 'main',
    extra: 'allowed',
  },
  executionConstraints: {
    validation: 'required',
    timeout: 'bounded',
  },
  humanPreferences: {
    reviewer: 'human-required',
    locale: 'en',
  },
};

describe('AssignmentPolicy domain', () => {
  it('constructs immutable AssignmentPolicies with exactly the five assignment factors', () => {
    const assignmentPolicy = createAssignmentPolicy();
    const equivalentAssignmentPolicy = AssignmentPolicy.fromSnapshot(
      assignmentPolicy.toSnapshot(),
    );

    expect(assignmentPolicy.toSnapshot()).toEqual({
      id: 'assignment-policy-1',
      requiredRole: 'builder',
      adapterExecutionCapability: 'CodeModification',
      repositoryConfiguration: {
        branch: 'main',
        repository: 'nexus',
      },
      executionConstraints: {
        validation: 'required',
      },
      humanPreferences: {
        reviewer: 'human-required',
      },
    });
    expect(assignmentPolicy.equals(equivalentAssignmentPolicy)).toBe(true);
    expect(AssignmentPolicyId.fromString('assignment-policy-1').equals(assignmentPolicy.id)).toBe(
      true,
    );
    expect(Object.keys(assignmentPolicy.toSnapshot()).sort()).toEqual([
      'adapterExecutionCapability',
      'executionConstraints',
      'humanPreferences',
      'id',
      'repositoryConfiguration',
      'requiredRole',
    ]);
    expect(Object.isFrozen(assignmentPolicy)).toBe(true);
    expect(Object.isFrozen(assignmentPolicy.toSnapshot())).toBe(true);
    expect(Object.isFrozen(assignmentPolicy.toSnapshot().repositoryConfiguration)).toBe(true);
    expect(Object.isFrozen(assignmentPolicy.toSnapshot().executionConstraints)).toBe(true);
    expect(Object.isFrozen(assignmentPolicy.toSnapshot().humanPreferences)).toBe(true);
    expect('dispatch' in assignmentPolicy).toBe(false);
    expect('advanceWorkflow' in assignmentPolicy).toBe(false);
    expect('adapterId' in assignmentPolicy).toBe(false);
  });

  it('validates every assignment-requirement value object', () => {
    expect(AssignmentRequiredRole.fromString(' builder ').toString()).toBe('builder');
    expect(AssignmentAdapterExecutionCapability.fromString(' CLI ').toString()).toBe('CLI');
    expect(AssignmentRepositoryConfiguration.fromRecord({ branch: ' main ' }).toSnapshot()).toEqual({
      branch: 'main',
    });
    expect(AssignmentExecutionConstraints.fromRecord({ timeout: ' bounded ' }).toSnapshot()).toEqual({
      timeout: 'bounded',
    });
    expect(AssignmentHumanPreferences.fromRecord({ reviewer: ' human ' }).toSnapshot()).toEqual({
      reviewer: 'human',
    });
    expect(() => AssignmentPolicyId.fromString('')).toThrow(
      InvalidAssignmentPolicyDefinitionError,
    );
    expect(() => AssignmentRequiredRole.fromString('')).toThrow();
    expect(() => AssignmentAdapterExecutionCapability.fromString('')).toThrow(
      InvalidAssignmentPolicyDefinitionError,
    );
    expect(() => AssignmentRepositoryConfiguration.fromRecord({ ' ': 'main' })).toThrow(
      InvalidAssignmentPolicyDefinitionError,
    );
    expect(() => AssignmentExecutionConstraints.fromRecord({ timeout: ' ' })).toThrow(
      InvalidAssignmentPolicyDefinitionError,
    );
    expect(() => AssignmentHumanPreferences.fromRecord({ ' ': 'human' })).toThrow(
      InvalidAssignmentPolicyDefinitionError,
    );
  });

  it('evaluates policies deterministically as a pure function of stated inputs', () => {
    const assignmentPolicy = createAssignmentPolicy();
    const firstResult = assignmentPolicy.evaluate(matchingEvaluationInput);
    const secondResult = assignmentPolicy.evaluate({
      requiredRole: ' builder ',
      adapterExecutionCapability: ' CodeModification ',
      repositoryConfiguration: {
        extra: 'allowed',
        branch: 'main',
        repository: 'nexus',
      },
      executionConstraints: {
        timeout: 'bounded',
        validation: 'required',
      },
      humanPreferences: {
        locale: 'en',
        reviewer: 'human-required',
      },
    });

    expect(firstResult).toEqual({
      assignmentPolicyId: 'assignment-policy-1',
      satisfied: true,
      requirements: {
        requiredRole: true,
        adapterExecutionCapability: true,
        repositoryConfiguration: true,
        executionConstraints: true,
        humanPreferences: true,
      },
    });
    expect(secondResult).toEqual(firstResult);
    expect(Object.isFrozen(firstResult)).toBe(true);
    expect(Object.isFrozen(firstResult.requirements)).toBe(true);
    expect(assignmentPolicy.toSnapshot()).toEqual(createAssignmentPolicy().toSnapshot());
  });

  it('reports each unsatisfied assignment factor without side effects', () => {
    const result = createAssignmentPolicy().evaluate({
      requiredRole: 'reviewer',
      adapterExecutionCapability: 'StaticAnalysis',
      repositoryConfiguration: {
        repository: 'nexus',
      },
      executionConstraints: {},
      humanPreferences: {},
    });

    expect(result).toEqual({
      assignmentPolicyId: 'assignment-policy-1',
      satisfied: false,
      requirements: {
        requiredRole: false,
        adapterExecutionCapability: false,
        repositoryConfiguration: false,
        executionConstraints: false,
        humanPreferences: false,
      },
    });
  });

  it('rejects unsupported or deferred runtime fields', () => {
    const policyWithAdapterReference: AssignmentPolicyInput = {
      id: 'assignment-policy-1',
      requiredRole: 'builder',
      adapterExecutionCapability: 'CodeModification',
      repositoryConfiguration: {},
      executionConstraints: {},
      humanPreferences: {},
      // @ts-expect-error AssignmentPolicy must not carry Adapter references.
      adapterId: 'mock-adapter',
    };
    const policyWithWorkflowReference: AssignmentPolicyInput = {
      id: 'assignment-policy-1',
      requiredRole: 'builder',
      adapterExecutionCapability: 'CodeModification',
      repositoryConfiguration: {},
      executionConstraints: {},
      humanPreferences: {},
      // @ts-expect-error AssignmentPolicy must not carry WorkflowChain references.
      workflowChainId: 'workflow-chain-1',
    };
    const policyWithExtraFactor: AssignmentPolicyInput = {
      id: 'assignment-policy-1',
      requiredRole: 'builder',
      adapterExecutionCapability: 'CodeModification',
      repositoryConfiguration: {},
      executionConstraints: {},
      humanPreferences: {},
      // @ts-expect-error AssignmentPolicy supports exactly the five ratified factors.
      costPreference: 'low',
    };
    const evaluationWithDispatch: AssignmentPolicyEvaluationInput = {
      ...matchingEvaluationInput,
      // @ts-expect-error AssignmentPolicy evaluation must not dispatch.
      dispatch: true,
    };

    for (const invalidPolicy of [
      policyWithAdapterReference,
      policyWithWorkflowReference,
      policyWithExtraFactor,
    ]) {
      expect(() => AssignmentPolicy.create(invalidPolicy)).toThrow(
        InvalidAssignmentPolicyDefinitionError,
      );
    }
    expect(() => createAssignmentPolicy().evaluate(evaluationWithDispatch)).toThrow(
      InvalidAssignmentPolicyDefinitionError,
    );
  });
});
