import { describe, expect, it } from 'vitest';

import { EventBus } from '../../../src/kernel/events/event-bus';
import { createKernelServices } from '../../../src/kernel/common/create-kernel-services';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';
import {
  RatificationAuthorityRecord,
  RatificationAuthoritySnapshot,
} from '../../../src/kernel/governance/ratification-authority-snapshot';
import { InMemoryRatificationAuthoritySnapshotRepository } from '../../../src/kernel/governance/ratification-authority.repository';
import { RatificationAttributionValidationService } from '../../../src/kernel/governance/ratification-attribution-validation';
import type {
  RatificationAttributionDiagnosticCode,
  RatificationAttributionValidationOutcome,
  RatificationAuthorityRecordInput,
} from '../../../src/kernel/governance/ratification-attribution.types';
import type { RepositoryPolicySnapshot } from '../../../src/kernel/governance/repository-policy.types';

class TestLogger implements KernelLogger {
  public info(): void {}
  public error(): void {}
}

const policy: RepositoryPolicySnapshot = Object.freeze({
  id: 'repository-policy-1',
  version: 1,
  name: 'Review Closure Policy',
  description: 'Governs completed Review outcomes.',
  criteria: Object.freeze([
    Object.freeze({
      id: 'criterion-1',
      description: 'Criterion description.',
      requiredInputs: Object.freeze(['ReviewOutcome']),
      conditionDescriptor: 'Opaque descriptor.',
    }),
  ]),
  ratificationId: 'NEXUS-RAT-2026-07-15-017',
});

function record(
  overrides: RatificationAuthorityRecordInput = {},
): RatificationAuthorityRecordInput {
  return {
    identifier: 'NEXUS-RAT-2026-07-15-017',
    date: '2026-07-15',
    subject: 'Sprint 54 Scope Ratification.',
    lifecycleStatus: 'Effective',
    ...overrides,
  };
}

function snapshot(records: readonly RatificationAuthorityRecordInput[]): RatificationAuthoritySnapshot {
  return RatificationAuthoritySnapshot.create({
    source: 'RATIFICATION_LEDGER.md',
    capturedAt: '2026-07-15T15:00:00.000Z',
    records,
  });
}

async function createService(
  records: readonly RatificationAuthorityRecordInput[] | undefined,
): Promise<RatificationAttributionValidationService> {
  const repository = new InMemoryRatificationAuthoritySnapshotRepository();

  if (records !== undefined) {
    await repository.recordSnapshot(snapshot(records));
  }

  return new RatificationAttributionValidationService(repository);
}

async function expectValidation(input: {
  readonly records?: readonly RatificationAuthorityRecordInput[];
  readonly repositoryPolicy?: RepositoryPolicySnapshot;
  readonly outcome: RatificationAttributionValidationOutcome;
  readonly diagnosticCode: RatificationAttributionDiagnosticCode;
}): Promise<void> {
  const service = await createService(input.records);
  const result = await service.validateRepositoryPolicyRatificationAttribution({
    repositoryPolicy: input.repositoryPolicy ?? policy,
  });

  expect(result.outcome).toBe(input.outcome);
  expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
    input.diagnosticCode,
  ]);
  expect(result.ratificationId).toBe((input.repositoryPolicy ?? policy).ratificationId.trim());
  expect(Object.isFrozen(result)).toBe(true);
  expect(Object.isFrozen(result.diagnostics)).toBe(true);
}

describe('RatificationAttributionValidationService', () => {
  it('returns Valid for exactly one structurally valid Effective RatificationAuthorityRecord', async () => {
    await expectValidation({
      records: [record()],
      outcome: 'Valid',
      diagnosticCode: 'valid-effective-record',
    });
  });

  it('returns Invalid for an explicitly Superseded RatificationAuthorityRecord', async () => {
    await expectValidation({
      records: [
        record({
          lifecycleStatus: 'Superseded',
          supersededByRatificationId: 'NEXUS-RAT-2026-07-15-018',
        }),
      ],
      outcome: 'Invalid',
      diagnosticCode: 'invalid-superseded-record',
    });
  });

  it('returns Invalid for an explicitly Withdrawn RatificationAuthorityRecord', async () => {
    await expectValidation({
      records: [
        record({
          lifecycleStatus: 'Withdrawn',
          withdrawnByRatificationId: 'NEXUS-RAT-2026-07-15-018',
        }),
      ],
      outcome: 'Invalid',
      diagnosticCode: 'invalid-withdrawn-record',
    });
  });

  it('returns Invalid for a contradictory RatificationAuthorityRecord', async () => {
    await expectValidation({
      records: [
        record({
          lifecycleStatus: ['Superseded', 'Withdrawn'],
          supersededByRatificationId: 'NEXUS-RAT-2026-07-15-018',
          withdrawnByRatificationId: 'NEXUS-RAT-2026-07-15-019',
        }),
      ],
      outcome: 'Invalid',
      diagnosticCode: 'invalid-contradictory-record',
    });
  });

  it('returns Invalid for a structurally malformed matching RatificationAuthorityRecord', async () => {
    await expectValidation({
      records: [
        {
          identifier: 'NEXUS-RAT-2026-07-15-017',
          date: '2026-07-15',
          lifecycleStatus: 'Effective',
        },
      ],
      outcome: 'Invalid',
      diagnosticCode: 'invalid-structurally-malformed-record',
    });
  });

  it('returns Unresolvable when no RatificationAuthorityRecord matches the RepositoryPolicy reference', async () => {
    await expectValidation({
      records: [
        record({
          identifier: 'NEXUS-RAT-2026-07-15-018',
        }),
      ],
      outcome: 'Unresolvable',
      diagnosticCode: 'unresolvable-no-matching-record',
    });
  });

  it('returns Unresolvable when duplicate identifiers resolve to the RepositoryPolicy reference', async () => {
    await expectValidation({
      records: [
        record(),
        record({
          date: '2026-07-16',
          subject: 'Duplicate authority record.',
        }),
      ],
      outcome: 'Unresolvable',
      diagnosticCode: 'unresolvable-duplicate-identifier',
    });
  });

  it('returns Unresolvable for an unknown lifecycle status', async () => {
    await expectValidation({
      records: [
        record({
          lifecycleStatus: 'Pending',
        }),
      ],
      outcome: 'Unresolvable',
      diagnosticCode: 'unresolvable-unknown-lifecycle-status',
    });
  });

  it('returns Unresolvable for a malformed RepositoryPolicy Ratification reference', async () => {
    await expectValidation({
      records: [record()],
      repositoryPolicy: {
        ...policy,
        ratificationId: 'ratification-017',
      },
      outcome: 'Unresolvable',
      diagnosticCode: 'unresolvable-malformed-ratification-reference',
    });
  });

  it('returns Unresolvable when the Snapshot source is unavailable', async () => {
    await expectValidation({
      outcome: 'Unresolvable',
      diagnosticCode: 'unresolvable-snapshot-source-unavailable',
    });
  });

  it('preserves immutable Snapshot and Record data without inferring lifecycle status', () => {
    const authoritySnapshot = snapshot([
      {
        identifier: ' NEXUS-RAT-2026-07-15-017 ',
        date: ' 2026-07-15 ',
        subject: ' Sprint 54 Scope Ratification. ',
      },
    ]);
    const snapshotState = authoritySnapshot.toSnapshot();
    const authorityRecord = RatificationAuthorityRecord.fromSnapshot(snapshotState.records[0] ?? {});

    expect(snapshotState).toEqual({
      source: 'RATIFICATION_LEDGER.md',
      capturedAt: '2026-07-15T15:00:00.000Z',
      records: [
        {
          identifier: 'NEXUS-RAT-2026-07-15-017',
          date: '2026-07-15',
          subject: 'Sprint 54 Scope Ratification.',
        },
      ],
    });
    expect(authorityRecord.lifecycleStatus).toBeUndefined();
    expect(Object.isFrozen(authoritySnapshot)).toBe(true);
    expect(Object.isFrozen(snapshotState)).toBe(true);
    expect(Object.isFrozen(snapshotState.records)).toBe(true);
  });

  it('stores and retrieves defensive immutable Snapshot copies through the repository', async () => {
    const repository = new InMemoryRatificationAuthoritySnapshotRepository(snapshot([record()]));
    const retrieved = await repository.getSnapshot();

    expect(retrieved).not.toBeUndefined();
    expect(retrieved?.toSnapshot()).toEqual(snapshot([record()]).toSnapshot());
    expect(Object.isFrozen(retrieved?.toSnapshot())).toBe(true);
  });

  it('does not expose Governance Decision, Policy Evaluation, event, host, or adapter integration', () => {
    const service = new RatificationAttributionValidationService();

    expect('evaluateGovernancePolicy' in service).toBe(false);
    expect('createGovernanceDecision' in service).toBe(false);
    expect('publishDomainEvent' in service).toBe(false);
    expect('executeAdapter' in service).toBe(false);
    expect('activateHostSurface' in service).toBe(false);
  });

  it('is composed by createKernelServices as a standalone Kernel service', () => {
    const services = createKernelServices(new EventBus(new TestLogger()));

    expect(services.map((service) => service.serviceName)).toContain(
      'RatificationAttributionValidationService',
    );
    expect(services.map((service) => service.serviceName)).toContain('GovernanceService');
    expect(services.map((service) => service.serviceName)).toContain('RepositoryPolicyService');
  });
});

