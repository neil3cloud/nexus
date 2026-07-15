import { describe, expect, it } from 'vitest';

import { RepositoryPolicy } from '../../../src/kernel/governance/repository-policy';
import {
  CompetingRepositoryPolicySuccessorError,
  DuplicateRepositoryPolicyVersionError,
  InvalidRepositoryPolicyLineageError,
  UnknownRepositoryPolicyPredecessorError,
} from '../../../src/kernel/governance/repository-policy.errors';
import { InMemoryRepositoryPolicyRepository } from '../../../src/kernel/governance/repository-policy.repository';

function createRepositoryPolicy(id: string): RepositoryPolicy {
  return RepositoryPolicy.createInitial({
    id,
    name: `${id} name`,
    description: `${id} description`,
    criteria: [
      {
        id: 'criterion-1',
        description: 'Criterion description.',
        requiredInputs: ['ReviewOutcome'],
        conditionDescriptor: 'Opaque descriptor.',
      },
    ],
    ratificationId: 'NEXUS-RAT-2026-07-15-015',
  });
}

describe('InMemoryRepositoryPolicyRepository', () => {
  it('preserves complete linear history and enumerates current versions deterministically', async () => {
    const repository = new InMemoryRepositoryPolicyRepository();
    const policyB = createRepositoryPolicy('repository-policy-b');
    const policyA = createRepositoryPolicy('repository-policy-a');
    const policyA2 = RepositoryPolicy.supersede(policyA, {
      name: 'repository-policy-a v2',
      description: 'Second version.',
      criteria: [
        {
          id: 'criterion-2',
          description: 'Second criterion.',
          requiredInputs: ['Evidence'],
          conditionDescriptor: 'Second opaque descriptor.',
        },
      ],
      ratificationId: 'NEXUS-RAT-2026-07-15-016',
    });

    await repository.registerInitialVersion(policyB);
    await repository.registerInitialVersion(policyA);
    await repository.registerSupersedingVersion(policyA.id, policyA.version, policyA2);

    expect((await repository.getByIdAndVersion('repository-policy-a', 1))?.toSnapshot()).toEqual(
      policyA.toSnapshot(),
    );
    expect((await repository.getCurrent('repository-policy-a'))?.toSnapshot()).toEqual(
      policyA2.toSnapshot(),
    );
    expect((await repository.enumerateHistory('repository-policy-a')).map((policy) => policy.version)).toEqual([
      1,
      2,
    ]);
    expect((await repository.enumerateCurrent()).map((policy) => policy.id.toString())).toEqual([
      'repository-policy-a',
      'repository-policy-b',
    ]);
    expect(await repository.getByIdAndVersion('missing-policy', 1)).toBeUndefined();
    expect(await repository.getCurrent('missing-policy')).toBeUndefined();
    expect(await repository.enumerateHistory('missing-policy')).toEqual([]);
    expect('save' in repository).toBe(false);
    expect('evaluate' in repository).toBe(false);
    expect('publish' in repository).toBe(false);
  });

  it('rejects duplicate versions and invalid lineage', async () => {
    const repository = new InMemoryRepositoryPolicyRepository();
    const policy = createRepositoryPolicy('repository-policy-1');

    await repository.registerInitialVersion(policy);

    await expect(repository.registerInitialVersion(policy)).rejects.toThrow(
      DuplicateRepositoryPolicyVersionError,
    );
    await expect(
      repository.registerSupersedingVersion('different-policy', 1, RepositoryPolicy.supersede(policy, {
        name: 'Policy v2',
        description: 'Second version.',
        criteria: [
          {
            id: 'criterion-2',
            description: 'Second criterion.',
            requiredInputs: [],
            conditionDescriptor: 'Second descriptor.',
          },
        ],
        ratificationId: 'NEXUS-RAT-2026-07-15-016',
      })),
    ).rejects.toThrow(InvalidRepositoryPolicyLineageError);
    await expect(
      repository.registerSupersedingVersion('repository-policy-1', 2, RepositoryPolicy.supersede(policy, {
        name: 'Policy v2',
        description: 'Second version.',
        criteria: [
          {
            id: 'criterion-2',
            description: 'Second criterion.',
            requiredInputs: [],
            conditionDescriptor: 'Second descriptor.',
          },
        ],
        ratificationId: 'NEXUS-RAT-2026-07-15-016',
      })),
    ).rejects.toThrow(InvalidRepositoryPolicyLineageError);
  });

  it('rejects unknown predecessors and competing successors', async () => {
    const repository = new InMemoryRepositoryPolicyRepository();
    const policy = createRepositoryPolicy('repository-policy-1');
    const policy2 = RepositoryPolicy.supersede(policy, {
      name: 'Policy v2',
      description: 'Second version.',
      criteria: [
        {
          id: 'criterion-2',
          description: 'Second criterion.',
          requiredInputs: [],
          conditionDescriptor: 'Second descriptor.',
        },
      ],
      ratificationId: 'NEXUS-RAT-2026-07-15-016',
    });

    await expect(
      repository.registerSupersedingVersion(policy.id, policy.version, policy2),
    ).rejects.toThrow(UnknownRepositoryPolicyPredecessorError);

    await repository.registerInitialVersion(policy);
    await repository.registerSupersedingVersion(policy.id, policy.version, policy2);

    await expect(
      repository.registerSupersedingVersion(
        policy.id,
        policy.version,
        RepositoryPolicy.supersede(policy, {
          name: 'Policy v2 competing',
          description: 'Competing second version.',
          criteria: [
            {
              id: 'criterion-3',
              description: 'Third criterion.',
              requiredInputs: [],
              conditionDescriptor: 'Third descriptor.',
            },
          ],
          ratificationId: 'NEXUS-RAT-2026-07-15-017',
        }),
      ),
    ).rejects.toThrow(CompetingRepositoryPolicySuccessorError);
  });

  it('returns defensive immutable RepositoryPolicy instances', async () => {
    const repository = new InMemoryRepositoryPolicyRepository();
    const policy = createRepositoryPolicy('repository-policy-1');

    await repository.registerInitialVersion(policy);

    const retrieved = await repository.getCurrent('repository-policy-1');

    expect(retrieved).not.toBe(policy);
    expect(retrieved?.toSnapshot()).toEqual(policy.toSnapshot());
    expect(Object.isFrozen(retrieved?.toSnapshot())).toBe(true);
  });
});
