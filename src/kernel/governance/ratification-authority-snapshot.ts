import { InvalidRatificationAttributionDefinitionError } from './ratification-attribution.errors';
import type {
  RatificationAuthorityRecordInput,
  RatificationAuthorityRecordSnapshot,
  RatificationAuthoritySnapshotInput,
  RatificationAuthoritySnapshotState,
} from './ratification-attribution.types';

export class RatificationAuthorityRecord {
  private constructor(
    private readonly identifierValue: string | undefined,
    private readonly dateValue: string | undefined,
    private readonly subjectValue: string | undefined,
    private readonly lifecycleStatusValue: string | readonly string[] | undefined,
    private readonly supersededByRatificationIdValue: string | undefined,
    private readonly withdrawnByRatificationIdValue: string | undefined,
  ) {
    Object.freeze(this);
  }

  public static create(input: RatificationAuthorityRecordInput): RatificationAuthorityRecord {
    return new RatificationAuthorityRecord(
      normalizeOptionalString(input.identifier),
      normalizeOptionalString(input.date),
      normalizeOptionalString(input.subject),
      normalizeOptionalLifecycleStatus(input.lifecycleStatus),
      normalizeOptionalString(input.supersededByRatificationId),
      normalizeOptionalString(input.withdrawnByRatificationId),
    );
  }

  public static fromSnapshot(
    snapshot: RatificationAuthorityRecordSnapshot,
  ): RatificationAuthorityRecord {
    return RatificationAuthorityRecord.create(snapshot);
  }

  public get identifier(): string | undefined {
    return this.identifierValue;
  }

  public get date(): string | undefined {
    return this.dateValue;
  }

  public get subject(): string | undefined {
    return this.subjectValue;
  }

  public get lifecycleStatus(): string | readonly string[] | undefined {
    return Array.isArray(this.lifecycleStatusValue)
      ? Object.freeze([...this.lifecycleStatusValue])
      : this.lifecycleStatusValue;
  }

  public get supersededByRatificationId(): string | undefined {
    return this.supersededByRatificationIdValue;
  }

  public get withdrawnByRatificationId(): string | undefined {
    return this.withdrawnByRatificationIdValue;
  }

  public toSnapshot(): RatificationAuthorityRecordSnapshot {
    const snapshot = {
      ...(this.identifierValue === undefined ? {} : { identifier: this.identifierValue }),
      ...(this.dateValue === undefined ? {} : { date: this.dateValue }),
      ...(this.subjectValue === undefined ? {} : { subject: this.subjectValue }),
      ...(this.lifecycleStatusValue === undefined
        ? {}
        : {
            lifecycleStatus: Array.isArray(this.lifecycleStatusValue)
              ? Object.freeze([...this.lifecycleStatusValue])
              : this.lifecycleStatusValue,
          }),
      ...(this.supersededByRatificationIdValue === undefined
        ? {}
        : { supersededByRatificationId: this.supersededByRatificationIdValue }),
      ...(this.withdrawnByRatificationIdValue === undefined
        ? {}
        : { withdrawnByRatificationId: this.withdrawnByRatificationIdValue }),
    };

    return Object.freeze(snapshot);
  }
}

export class RatificationAuthoritySnapshot {
  private constructor(
    private readonly sourceValue: string,
    private readonly capturedAtValue: string,
    private readonly recordValues: readonly RatificationAuthorityRecord[],
  ) {
    Object.freeze(this);
  }

  public static create(input: RatificationAuthoritySnapshotInput): RatificationAuthoritySnapshot {
    return new RatificationAuthoritySnapshot(
      normalizeRequiredString(input.source, 'RatificationAuthoritySnapshot source'),
      normalizeRequiredString(input.capturedAt, 'RatificationAuthoritySnapshot capturedAt'),
      Object.freeze(input.records.map((record) => RatificationAuthorityRecord.create(record))),
    );
  }

  public static fromSnapshot(
    snapshot: RatificationAuthoritySnapshotState,
  ): RatificationAuthoritySnapshot {
    return RatificationAuthoritySnapshot.create(snapshot);
  }

  public get source(): string {
    return this.sourceValue;
  }

  public get capturedAt(): string {
    return this.capturedAtValue;
  }

  public get records(): readonly RatificationAuthorityRecord[] {
    return Object.freeze(
      this.recordValues.map((record) => RatificationAuthorityRecord.fromSnapshot(record.toSnapshot())),
    );
  }

  public toSnapshot(): RatificationAuthoritySnapshotState {
    return Object.freeze({
      source: this.sourceValue,
      capturedAt: this.capturedAtValue,
      records: Object.freeze(this.recordValues.map((record) => record.toSnapshot())),
    });
  }
}

function normalizeRequiredString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidRatificationAttributionDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}

function normalizeOptionalString(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalized = value.trim();

  return normalized.length === 0 ? undefined : normalized;
}

function normalizeOptionalLifecycleStatus(
  value: string | readonly string[] | undefined,
): string | readonly string[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    return Object.freeze(value.map((status) => status.trim()).filter((status) => status.length > 0));
  }

  return normalizeOptionalString(value);
}
