import { describe, expect, it } from 'vitest';

import { PolicyCriterion } from '../../../src/kernel/governance/policy-criterion';
import { RepositoryPolicy } from '../../../src/kernel/governance/repository-policy';
import { RepositoryPolicyId } from '../../../src/kernel/governance/repository-policy-id';
import {
  DuplicatePolicyCriterionError,
  InvalidRepositoryPolicyDefinitionError,
  InvalidRepositoryPolicyLineageError,
} from '../../../src/kernel/governance/repository-policy.errors';

const criterion = {
  id: 'review-outcome-accepted',
  description: 'Review Outcome SHALL be accepted by the Reviewer.',
  requiredInputs: ['ReviewOutcome'],
  conditionDescriptor: 'Review outcome is accepted or accepted with observations.',
};

function createInitialRepositoryPolicy(): RepositoryPolicy {
  return RepositoryPolicy.createInitial({
    id: ' repository-policy-1 ',
    name: ' Review Closure Policy ',
    description: ' Governs completed Review outcomes. ',
    criteria: [criterion],
    ratificationId: ' NEXUS-RAT-2026-07-15-015 ',
  });
}

describe('RepositoryPolicy domain', () => {
  it('constructs immutable version-1 RepositoryPolicies with ordered inert criteria', () => {
    const repositoryPolicy = createInitialRepositoryPolicy();
    const snapshot = repositoryPolicy.toSnapshot();

    expect(snapshot).toEqual({
      id: 'repository-policy-1',
      version: 1,
      name: 'Review Closure Policy',
      description: 'Governs completed Review outcomes.',
      criteria: [
        {
          id: 'review-outcome-accepted',
          description: 'Review Outcome SHALL be accepted by the Reviewer.',
          requiredInputs: ['ReviewOutcome'],
          conditionDescriptor: 'Review outcome is accepted or accepted with observations.',
        },
      ],
      ratificationId: 'NEXUS-RAT-2026-07-15-015',
    });
    expect(RepositoryPolicyId.fromString('repository-policy-1').equals(repositoryPolicy.id)).toBe(
      true,
    );
    expect(repositoryPolicy.predecessorVersion).toBeUndefined();
    expect(repositoryPolicy.ratificationId).toBe('NEXUS-RAT-2026-07-15-015');
    expect(Object.isFrozen(repositoryPolicy)).toBe(true);
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.criteria)).toBe(true);
    expect(Object.isFrozen(snapshot.criteria[0]?.requiredInputs)).toBe(true);
    expect('evaluate' in repositoryPolicy).toBe(false);
    expect('governanceDecision' in repositoryPolicy).toBe(false);
    expect('publishDomainEvent' in repositoryPolicy).toBe(false);
  });

  it('preserves identity and history when creating a superseding immutable version', () => {
    const initialPolicy = createInitialRepositoryPolicy();
    const supersedingPolicy = RepositoryPolicy.supersede(initialPolicy, {
      name: 'Review Closure Policy v2',
      description: 'Superseding policy text.',
      criteria: [
        criterion,
        {
          id: 'no-critical-findings-open',
          description: 'No Critical Finding SHALL remain open.',
          requiredInputs: ['FindingStatus', 'FindingSeverity'],
          conditionDescriptor: 'Critical findings are resolved.',
        },
      ],
      ratificationId: 'NEXUS-RAT-2026-07-15-016',
    });

    expect(supersedingPolicy.toSnapshot()).toMatchObject({
      id: 'repository-policy-1',
      version: 2,
      predecessorVersion: 1,
      ratificationId: 'NEXUS-RAT-2026-07-15-016',
    });
    expect(initialPolicy.toSnapshot()).toEqual(createInitialRepositoryPolicy().toSnapshot());
    expect(supersedingPolicy.id.equals(initialPolicy.id)).toBe(true);
  });

  it('validates PolicyCriterion identity, description, inputs, and condition descriptor', () => {
    expect(
      PolicyCriterion.create({
        id: ' criterion-1 ',
        description: ' Criterion description. ',
        requiredInputs: [' Evidence ', ' ReviewOutcome '],
        conditionDescriptor: ' Opaque descriptor. ',
      }).toSnapshot(),
    ).toEqual({
      id: 'criterion-1',
      description: 'Criterion description.',
      requiredInputs: ['Evidence', 'ReviewOutcome'],
      conditionDescriptor: 'Opaque descriptor.',
    });
    expect(() =>
      PolicyCriterion.create({
        id: '',
        description: 'Criterion description.',
        requiredInputs: [],
        conditionDescriptor: 'Opaque descriptor.',
      }),
    ).toThrow(InvalidRepositoryPolicyDefinitionError);
    expect(() =>
      PolicyCriterion.create({
        id: 'criterion-1',
        description: '',
        requiredInputs: [],
        conditionDescriptor: 'Opaque descriptor.',
      }),
    ).toThrow(InvalidRepositoryPolicyDefinitionError);
    expect(() =>
      PolicyCriterion.create({
        id: 'criterion-1',
        description: 'Criterion description.',
        requiredInputs: [' '],
        conditionDescriptor: 'Opaque descriptor.',
      }),
    ).toThrow(InvalidRepositoryPolicyDefinitionError);
    expect(() =>
      PolicyCriterion.create({
        id: 'criterion-1',
        description: 'Criterion description.',
        requiredInputs: [],
        conditionDescriptor: '',
      }),
    ).toThrow(InvalidRepositoryPolicyDefinitionError);
  });

  it('rejects invalid RepositoryPolicy definitions and criterion collections', () => {
    expect(() =>
      RepositoryPolicy.createInitial({
        id: 'repository-policy-1',
        name: '',
        description: 'Description.',
        criteria: [criterion],
        ratificationId: 'NEXUS-RAT-2026-07-15-015',
      }),
    ).toThrow(InvalidRepositoryPolicyDefinitionError);
    expect(() =>
      RepositoryPolicy.createInitial({
        id: 'repository-policy-1',
        name: 'Policy',
        description: 'Description.',
        criteria: [],
        ratificationId: 'NEXUS-RAT-2026-07-15-015',
      }),
    ).toThrow(InvalidRepositoryPolicyDefinitionError);
    expect(() =>
      RepositoryPolicy.createInitial({
        id: 'repository-policy-1',
        name: 'Policy',
        description: 'Description.',
        criteria: [criterion, { ...criterion }],
        ratificationId: 'NEXUS-RAT-2026-07-15-015',
      }),
    ).toThrow(DuplicatePolicyCriterionError);
    expect(() =>
      RepositoryPolicy.createInitial({
        id: 'repository-policy-1',
        name: 'Policy',
        description: 'Description.',
        criteria: [criterion],
        ratificationId: 'ratification-1',
      }),
    ).toThrow(InvalidRepositoryPolicyDefinitionError);
  });

  it('rejects skipped, regressed, and malformed version lineage', () => {
    expect(() =>
      RepositoryPolicy.createVersion({
        id: 'repository-policy-1',
        version: 0,
        name: 'Policy',
        description: 'Description.',
        criteria: [criterion],
        ratificationId: 'NEXUS-RAT-2026-07-15-015',
      }),
    ).toThrow(InvalidRepositoryPolicyDefinitionError);
    expect(() =>
      RepositoryPolicy.createVersion({
        id: 'repository-policy-1',
        version: 1,
        predecessorVersion: 1,
        name: 'Policy',
        description: 'Description.',
        criteria: [criterion],
        ratificationId: 'NEXUS-RAT-2026-07-15-015',
      }),
    ).toThrow(InvalidRepositoryPolicyLineageError);
    expect(() =>
      RepositoryPolicy.createVersion({
        id: 'repository-policy-1',
        version: 2,
        name: 'Policy',
        description: 'Description.',
        criteria: [criterion],
        ratificationId: 'NEXUS-RAT-2026-07-15-015',
      }),
    ).toThrow(InvalidRepositoryPolicyLineageError);
    expect(() =>
      RepositoryPolicy.createVersion({
        id: 'repository-policy-1',
        version: 3,
        predecessorVersion: 1,
        name: 'Policy',
        description: 'Description.',
        criteria: [criterion],
        ratificationId: 'NEXUS-RAT-2026-07-15-015',
      }),
    ).toThrow(InvalidRepositoryPolicyLineageError);
  });
});
