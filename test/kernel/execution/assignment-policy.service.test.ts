import { describe, expect, it } from 'vitest';

import {
  AssignmentPolicyNotFoundError,
} from '../../../src/kernel/execution/assignment-policy.errors';
import { InMemoryAssignmentPolicyRepository } from '../../../src/kernel/execution/assignment-policy.repository';
import { AssignmentPolicyService } from '../../../src/kernel/execution/assignment-policy.service';
import { InvalidRoleDefinitionError } from '../../../src/kernel/execution/role.errors';

describe('AssignmentPolicyService', () => {
  it('creates, looks up, enumerates, and evaluates policies through repository contracts', async () => {
    const service = new AssignmentPolicyService(
      new InMemoryAssignmentPolicyRepository(),
      () => 'assignment-policy-1',
    );

    const created = await service.createAssignmentPolicy({
      requiredRole: 'builder',
      adapterExecutionCapability: 'CodeModification',
      repositoryConfiguration: {
        repository: 'nexus',
      },
      executionConstraints: {
        validation: 'required',
      },
      humanPreferences: {
        reviewer: 'human-required',
      },
    });

    expect(created).toEqual({
      id: 'assignment-policy-1',
      requiredRole: 'builder',
      adapterExecutionCapability: 'CodeModification',
      repositoryConfiguration: {
        repository: 'nexus',
      },
      executionConstraints: {
        validation: 'required',
      },
      humanPreferences: {
        reviewer: 'human-required',
      },
    });
    await expect(service.getAssignmentPolicy('assignment-policy-1')).resolves.toEqual(created);
    await expect(service.enumerateAssignmentPolicies()).resolves.toEqual([created]);
    await expect(
      service.evaluateAssignmentPolicy({
        assignmentPolicyId: 'assignment-policy-1',
        input: {
          requiredRole: 'builder',
          adapterExecutionCapability: 'CodeModification',
          repositoryConfiguration: {
            repository: 'nexus',
          },
          executionConstraints: {
            validation: 'required',
          },
          humanPreferences: {
            reviewer: 'human-required',
          },
        },
      }),
    ).resolves.toMatchObject({
      assignmentPolicyId: 'assignment-policy-1',
      satisfied: true,
    });
  });

  it('reports not-found and invalid input without hiding domain failures', async () => {
    const service = new AssignmentPolicyService(
      new InMemoryAssignmentPolicyRepository(),
      () => 'assignment-policy-1',
    );

    await expect(service.getAssignmentPolicy('missing-assignment-policy')).rejects.toThrow(
      AssignmentPolicyNotFoundError,
    );
    await expect(
      service.createAssignmentPolicy({
        requiredRole: '',
        adapterExecutionCapability: 'CodeModification',
        repositoryConfiguration: {},
        executionConstraints: {},
        humanPreferences: {},
      }),
    ).rejects.toThrow(InvalidRoleDefinitionError);
  });

  it('does not expose dispatch, wiring, orchestration, or workflow advancement', () => {
    const service = new AssignmentPolicyService();

    expect('dispatch' in service).toBe(false);
    expect('selectAdapter' in service).toBe(false);
    expect('attachEngineeringSession' in service).toBe(false);
    expect('advanceWorkflow' in service).toBe(false);
    expect('orchestrate' in service).toBe(false);
  });
});
