import { describe, expect, it } from 'vitest';

import { AssignmentPolicy } from '../../../src/kernel/execution/assignment-policy';
import { DuplicateAssignmentPolicyError } from '../../../src/kernel/execution/assignment-policy.errors';
import { InMemoryAssignmentPolicyRepository } from '../../../src/kernel/execution/assignment-policy.repository';

function createAssignmentPolicy(id: string): AssignmentPolicy {
  return AssignmentPolicy.create({
    id,
    requiredRole: 'builder',
    adapterExecutionCapability: 'CodeModification',
    repositoryConfiguration: {
      repository: 'nexus',
    },
    executionConstraints: {},
    humanPreferences: {},
  });
}

describe('InMemoryAssignmentPolicyRepository', () => {
  it('creates, retrieves, and enumerates AssignmentPolicies deterministically', async () => {
    const repository = new InMemoryAssignmentPolicyRepository();
    const assignmentPolicyB = createAssignmentPolicy('assignment-policy-b');
    const assignmentPolicyA = createAssignmentPolicy('assignment-policy-a');
    const assignmentPolicyC = createAssignmentPolicy('assignment-policy-c');

    await repository.create(assignmentPolicyB);
    await repository.create(assignmentPolicyA);
    await repository.create(assignmentPolicyC);

    expect((await repository.getById('assignment-policy-a'))?.toSnapshot()).toEqual(
      assignmentPolicyA.toSnapshot(),
    );
    expect((await repository.enumerate()).map((policy) => policy.id.toString())).toEqual([
      'assignment-policy-a',
      'assignment-policy-b',
      'assignment-policy-c',
    ]);
    expect(await repository.getById('assignment-policy-missing')).toBeUndefined();
    expect('save' in repository).toBe(false);
    expect('dispatch' in repository).toBe(false);
    expect('exists' in repository).toBe(false);
  });

  it('rejects duplicate AssignmentPolicy identities', async () => {
    const repository = new InMemoryAssignmentPolicyRepository();

    await repository.create(createAssignmentPolicy('assignment-policy-1'));

    await expect(repository.create(createAssignmentPolicy('assignment-policy-1'))).rejects.toThrow(
      DuplicateAssignmentPolicyError,
    );
  });
});
