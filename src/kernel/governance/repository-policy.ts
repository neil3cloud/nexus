import { PolicyCriterion, normalizeCriteria } from './policy-criterion';
import { RepositoryPolicyId } from './repository-policy-id';
import {
  InvalidRepositoryPolicyDefinitionError,
  InvalidRepositoryPolicyLineageError,
} from './repository-policy.errors';
import type {
  RepositoryPolicyInitialInput,
  RepositoryPolicySnapshot,
  RepositoryPolicySupersessionInput,
  RepositoryPolicyVersionInput,
} from './repository-policy.types';

const ratificationIdentifierPattern = /^NEXUS-RAT-\d{4}-\d{2}-\d{2}-\d{3}$/;

export class RepositoryPolicy {
  private constructor(
    private readonly repositoryPolicyId: RepositoryPolicyId,
    private readonly versionValue: number,
    private readonly nameValue: string,
    private readonly descriptionValue: string,
    private readonly criterionValues: readonly PolicyCriterion[],
    private readonly ratificationIdValue: string,
    private readonly predecessorVersionValue: number | undefined,
  ) {
    Object.freeze(this);
  }

  public static createInitial(input: RepositoryPolicyInitialInput): RepositoryPolicy {
    return RepositoryPolicy.createVersion({
      ...input,
      version: 1,
    });
  }

  public static createVersion(input: RepositoryPolicyVersionInput): RepositoryPolicy {
    const version = normalizePositiveInteger(input.version, 'RepositoryPolicy version');
    const predecessorVersion =
      input.predecessorVersion === undefined
        ? undefined
        : normalizePositiveInteger(
            input.predecessorVersion,
            'RepositoryPolicy predecessorVersion',
          );

    assertVersionLineage(version, predecessorVersion);

    return new RepositoryPolicy(
      RepositoryPolicyId.fromString(input.id),
      version,
      normalizeNonEmptyString(input.name, 'RepositoryPolicy name'),
      normalizeNonEmptyString(input.description, 'RepositoryPolicy description'),
      normalizeCriteria(input.criteria),
      normalizeRatificationIdentifier(input.ratificationId),
      predecessorVersion,
    );
  }

  public static supersede(
    predecessor: RepositoryPolicy,
    input: RepositoryPolicySupersessionInput,
  ): RepositoryPolicy {
    return RepositoryPolicy.createVersion({
      id: predecessor.id.toString(),
      version: predecessor.version + 1,
      predecessorVersion: predecessor.version,
      name: input.name,
      description: input.description,
      criteria: input.criteria,
      ratificationId: input.ratificationId,
    });
  }

  public static fromSnapshot(snapshot: RepositoryPolicySnapshot): RepositoryPolicy {
    return RepositoryPolicy.createVersion(snapshot);
  }

  public get id(): RepositoryPolicyId {
    return this.repositoryPolicyId;
  }

  public get version(): number {
    return this.versionValue;
  }

  public get predecessorVersion(): number | undefined {
    return this.predecessorVersionValue;
  }

  public get ratificationId(): string {
    return this.ratificationIdValue;
  }

  public get criteria(): readonly PolicyCriterion[] {
    return Object.freeze(this.criterionValues.map((criterion) => PolicyCriterion.fromSnapshot(criterion.toSnapshot())));
  }

  public toSnapshot(): RepositoryPolicySnapshot {
    const snapshot = {
      id: this.repositoryPolicyId.toString(),
      version: this.versionValue,
      name: this.nameValue,
      description: this.descriptionValue,
      criteria: Object.freeze(this.criterionValues.map((criterion) => criterion.toSnapshot())),
      ratificationId: this.ratificationIdValue,
      ...(this.predecessorVersionValue === undefined
        ? {}
        : { predecessorVersion: this.predecessorVersionValue }),
    };

    return Object.freeze(snapshot);
  }
}

function assertVersionLineage(version: number, predecessorVersion: number | undefined): void {
  if (version === 1) {
    if (predecessorVersion !== undefined) {
      throw new InvalidRepositoryPolicyLineageError(
        'RepositoryPolicy initial version must not reference a predecessor.',
      );
    }

    return;
  }

  if (predecessorVersion === undefined) {
    throw new InvalidRepositoryPolicyLineageError(
      'RepositoryPolicy superseding version requires a predecessor version.',
    );
  }

  if (predecessorVersion !== version - 1) {
    throw new InvalidRepositoryPolicyLineageError(
      'RepositoryPolicy superseding version must reference the immediately preceding version.',
    );
  }
}

function normalizePositiveInteger(value: number, label: string): number {
  if (!Number.isInteger(value) || value < 1) {
    throw new InvalidRepositoryPolicyDefinitionError(`${label} must be a positive integer.`);
  }

  return value;
}

function normalizeRatificationIdentifier(value: string): string {
  const normalized = normalizeNonEmptyString(value, 'RepositoryPolicy ratificationId');

  if (!ratificationIdentifierPattern.test(normalized)) {
    throw new InvalidRepositoryPolicyDefinitionError(
      'RepositoryPolicy ratificationId must match NEXUS-RAT-YYYY-MM-DD-###.',
    );
  }

  return normalized;
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidRepositoryPolicyDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
