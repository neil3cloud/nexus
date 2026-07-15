import { ServiceLifecycle } from '../common/service-lifecycle';
import { RepositoryPolicyId } from './repository-policy-id';
import { RatificationAuthorityRecord, RatificationAuthoritySnapshot } from './ratification-authority-snapshot';
import {
  InMemoryRatificationAuthoritySnapshotRepository,
  type IRatificationAuthoritySnapshotRepository,
} from './ratification-authority.repository';
import type { RatificationAttributionValidationServiceContract } from './ratification-attribution.contract';
import type {
  RatificationAttributionDiagnostic,
  RatificationAttributionDiagnosticCode,
  RatificationAttributionValidationOutcome,
  RatificationAttributionValidationSnapshot,
  RatificationAuthorityLifecycleStatus,
  ValidateRatificationAttributionCommand,
} from './ratification-attribution.types';
import { ratificationAuthorityLifecycleStatuses } from './ratification-attribution.types';
import type { RepositoryPolicySnapshot } from './repository-policy.types';

const ratificationIdentifierPattern = /^NEXUS-RAT-\d{4}-\d{2}-\d{2}-\d{3}$/;

export class RatificationAttributionValidationService
  extends ServiceLifecycle
  implements RatificationAttributionValidationServiceContract
{
  public constructor(
    private readonly snapshotRepository: IRatificationAuthoritySnapshotRepository = new InMemoryRatificationAuthoritySnapshotRepository(),
  ) {
    super('RatificationAttributionValidationService');
  }

  public async validateRepositoryPolicyRatificationAttribution(
    command: ValidateRatificationAttributionCommand,
  ): Promise<RatificationAttributionValidationSnapshot> {
    const repositoryPolicy = normalizeRepositoryPolicy(command.repositoryPolicy);

    if (!ratificationIdentifierPattern.test(repositoryPolicy.ratificationId)) {
      return createValidation(repositoryPolicy, 'Unresolvable', {
        code: 'unresolvable-malformed-ratification-reference',
        message: 'RepositoryPolicy ratificationId is malformed.',
        ratificationId: repositoryPolicy.ratificationId,
      });
    }

    const snapshot = await this.snapshotRepository.getSnapshot();

    if (snapshot === undefined) {
      return createValidation(repositoryPolicy, 'Unresolvable', {
        code: 'unresolvable-snapshot-source-unavailable',
        message: 'RatificationAuthoritySnapshot source is unavailable.',
        ratificationId: repositoryPolicy.ratificationId,
      });
    }

    return evaluateAgainstSnapshot(repositoryPolicy, snapshot);
  }
}

function evaluateAgainstSnapshot(
  repositoryPolicy: RepositoryPolicySnapshot,
  snapshot: RatificationAuthoritySnapshot,
): RatificationAttributionValidationSnapshot {
  const matchingRecords = snapshot.records.filter(
    (record) => record.identifier === repositoryPolicy.ratificationId,
  );

  if (matchingRecords.length === 0) {
    return createValidation(repositoryPolicy, 'Unresolvable', {
      code: 'unresolvable-no-matching-record',
      message: 'No RatificationAuthorityRecord resolves to the RepositoryPolicy ratificationId.',
      ratificationId: repositoryPolicy.ratificationId,
    });
  }

  if (matchingRecords.length > 1) {
    return createValidation(repositoryPolicy, 'Unresolvable', {
      code: 'unresolvable-duplicate-identifier',
      message: 'More than one RatificationAuthorityRecord resolves to the RepositoryPolicy ratificationId.',
      ratificationId: repositoryPolicy.ratificationId,
    });
  }

  const record = matchingRecords[0];

  if (record === undefined) {
    return createValidation(repositoryPolicy, 'Unresolvable', {
      code: 'unresolvable-no-matching-record',
      message: 'No RatificationAuthorityRecord resolves to the RepositoryPolicy ratificationId.',
      ratificationId: repositoryPolicy.ratificationId,
    });
  }

  if (!isStructurallyComplete(record)) {
    return createValidation(repositoryPolicy, 'Invalid', {
      code: 'invalid-structurally-malformed-record',
      message: 'RatificationAuthorityRecord is missing one or more required fields.',
      ratificationId: repositoryPolicy.ratificationId,
    });
  }

  const statuses = lifecycleStatuses(record);

  if (statuses.some((status) => !isKnownLifecycleStatus(status))) {
    return createValidation(repositoryPolicy, 'Unresolvable', {
      code: 'unresolvable-unknown-lifecycle-status',
      message: 'RatificationAuthorityRecord has an unrecognized lifecycle status.',
      ratificationId: repositoryPolicy.ratificationId,
    });
  }

  if (isContradictory(record, statuses)) {
    return createValidation(repositoryPolicy, 'Invalid', {
      code: 'invalid-contradictory-record',
      message: 'RatificationAuthorityRecord contains contradictory lifecycle markers.',
      ratificationId: repositoryPolicy.ratificationId,
    });
  }

  const status = statuses[0];

  if (status === 'Effective') {
    return createValidation(repositoryPolicy, 'Valid', {
      code: 'valid-effective-record',
      message: 'RatificationAuthorityRecord resolves uniquely with explicit Effective status.',
      ratificationId: repositoryPolicy.ratificationId,
    });
  }

  if (status === 'Superseded') {
    return createValidation(repositoryPolicy, 'Invalid', {
      code: 'invalid-superseded-record',
      message: 'RatificationAuthorityRecord is explicitly Superseded.',
      ratificationId: repositoryPolicy.ratificationId,
    });
  }

  return createValidation(repositoryPolicy, 'Invalid', {
    code: 'invalid-withdrawn-record',
    message: 'RatificationAuthorityRecord is explicitly Withdrawn.',
    ratificationId: repositoryPolicy.ratificationId,
  });
}

function normalizeRepositoryPolicy(repositoryPolicy: RepositoryPolicySnapshot): RepositoryPolicySnapshot {
  return Object.freeze({
    id: RepositoryPolicyId.fromString(repositoryPolicy.id).toString(),
    version: repositoryPolicy.version,
    name: repositoryPolicy.name,
    description: repositoryPolicy.description,
    criteria: repositoryPolicy.criteria,
    ratificationId: repositoryPolicy.ratificationId.trim(),
    ...(repositoryPolicy.predecessorVersion === undefined
      ? {}
      : { predecessorVersion: repositoryPolicy.predecessorVersion }),
  });
}

function isStructurallyComplete(record: RatificationAuthorityRecord): boolean {
  return (
    record.identifier !== undefined &&
    record.date !== undefined &&
    record.subject !== undefined &&
    record.lifecycleStatus !== undefined &&
    lifecycleStatuses(record).length > 0
  );
}

function lifecycleStatuses(record: RatificationAuthorityRecord): readonly string[] {
  const status = record.lifecycleStatus;

  if (status === undefined) {
    return Object.freeze([]);
  }

  return Object.freeze(Array.isArray(status) ? [...status] : [status]);
}

function isKnownLifecycleStatus(status: string): status is RatificationAuthorityLifecycleStatus {
  return ratificationAuthorityLifecycleStatuses.includes(status as RatificationAuthorityLifecycleStatus);
}

function isContradictory(
  record: RatificationAuthorityRecord,
  statuses: readonly string[],
): boolean {
  const uniqueStatuses = new Set(statuses);

  if (uniqueStatuses.size > 1) {
    return true;
  }

  const status = statuses[0];

  return (
    (record.supersededByRatificationId !== undefined &&
      record.withdrawnByRatificationId !== undefined) ||
    (status === 'Effective' &&
      (record.supersededByRatificationId !== undefined ||
        record.withdrawnByRatificationId !== undefined)) ||
    (status === 'Superseded' && record.withdrawnByRatificationId !== undefined) ||
    (status === 'Withdrawn' && record.supersededByRatificationId !== undefined)
  );
}

function createValidation(
  repositoryPolicy: RepositoryPolicySnapshot,
  outcome: RatificationAttributionValidationOutcome,
  diagnostic: {
    readonly code: RatificationAttributionDiagnosticCode;
    readonly message: string;
    readonly ratificationId: string;
  },
): RatificationAttributionValidationSnapshot {
  return Object.freeze({
    repositoryPolicyId: repositoryPolicy.id,
    repositoryPolicyVersion: repositoryPolicy.version,
    ratificationId: repositoryPolicy.ratificationId,
    outcome,
    diagnostics: Object.freeze([
      Object.freeze<RatificationAttributionDiagnostic>({
        code: diagnostic.code,
        message: diagnostic.message,
        ratificationId: diagnostic.ratificationId,
      }),
    ]),
  });
}

