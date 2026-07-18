import { describe, expect, it } from 'vitest';

import { EventBus } from '../../../src/kernel/events/event-bus';
import { createKernelServices } from '../../../src/kernel/common/create-kernel-services';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';
import {
  RepositoryPolicyNotFoundError,
  RepositoryPolicyVersionNotFoundError,
} from '../../../src/kernel/governance/repository-policy.errors';
import { InMemoryRepositoryPolicyRepository } from '../../../src/kernel/governance/repository-policy.repository';
import { RepositoryPolicyService } from '../../../src/kernel/governance/repository-policy.service';

const criterion = {
  id: 'criterion-1',
  description: 'Criterion description.',
  requiredInputs: ['ReviewOutcome'],
  conditionDescriptor: 'Opaque descriptor.',
};

class TestLogger implements KernelLogger {
  public info(): void {}
  public error(): void {}
}

describe('RepositoryPolicyService', () => {
  it('registers, supersedes, retrieves, and enumerates RepositoryPolicy versions', async () => {
    const service = new RepositoryPolicyService(
      new InMemoryRepositoryPolicyRepository(),
      () => 'repository-policy-1',
    );

    const initialPolicy = await service.registerRepositoryPolicy({
      name: 'Review Closure Policy',
      description: 'Governs completed Review outcomes.',
      criteria: [criterion],
      ratificationId: 'NEXUS-RAT-2026-07-15-015',
    });
    const supersedingPolicy = await service.supersedeRepositoryPolicy({
      repositoryPolicyId: 'repository-policy-1',
      name: 'Review Closure Policy v2',
      description: 'Superseding policy.',
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

    expect(initialPolicy).toMatchObject({
      id: 'repository-policy-1',
      version: 1,
      ratificationId: 'NEXUS-RAT-2026-07-15-015',
    });
    expect(supersedingPolicy).toMatchObject({
      id: 'repository-policy-1',
      version: 2,
      predecessorVersion: 1,
      ratificationId: 'NEXUS-RAT-2026-07-15-016',
    });
    await expect(service.getRepositoryPolicy('repository-policy-1', 1)).resolves.toEqual(
      initialPolicy,
    );
    await expect(service.getCurrentRepositoryPolicy('repository-policy-1')).resolves.toEqual(
      supersedingPolicy,
    );
    await expect(service.enumerateCurrentRepositoryPolicies()).resolves.toEqual([
      supersedingPolicy,
    ]);
    await expect(service.enumerateRepositoryPolicyHistory('repository-policy-1')).resolves.toEqual([
      initialPolicy,
      supersedingPolicy,
    ]);
  });

  it('reports not-found conditions without hiding repository failures', async () => {
    const service = new RepositoryPolicyService(new InMemoryRepositoryPolicyRepository());

    await expect(service.getCurrentRepositoryPolicy('missing-policy')).rejects.toThrow(
      RepositoryPolicyNotFoundError,
    );
    await expect(service.enumerateRepositoryPolicyHistory('missing-policy')).rejects.toThrow(
      RepositoryPolicyNotFoundError,
    );
    await expect(service.getRepositoryPolicy('missing-policy', 1)).rejects.toThrow(
      RepositoryPolicyVersionNotFoundError,
    );
  });

  it('does not expose evaluation, decisions, escalation, event publication, or workflow gates', () => {
    const service = new RepositoryPolicyService();

    expect('evaluatePolicy' in service).toBe(false);
    expect('createGovernanceDecision' in service).toBe(false);
    expect('escalateGovernance' in service).toBe(false);
    expect('publishDomainEvent' in service).toBe(false);
    expect('enforcePolicy' in service).toBe(false);
    expect('advanceWorkflow' in service).toBe(false);
  });

  it('is composed by createKernelServices without changing existing service contracts', () => {
    const eventBus = new EventBus(new TestLogger());
    const services = createKernelServices(eventBus);

    expect(services.map((service) => service.serviceName)).toContain('RepositoryPolicyService');
    expect(services.map((service) => service.serviceName)).toContain('AssignmentPolicyService');
    expect(services.map((service) => service.serviceName)).toContain('KnowledgeService');
  });
});
