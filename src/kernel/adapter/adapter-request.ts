import { InvalidAdapterRequestError } from './adapter.errors';

export type AdapterExecutionConstraints = Readonly<Record<string, string>>;
export type AdapterRequestMetadata = Readonly<Record<string, string>>;

export interface AdapterRequestInput {
  readonly engineeringRole: string;
  readonly taskId: string;
  readonly contextPackageReference: string;
  readonly executionConstraints?: AdapterExecutionConstraints;
  readonly requestMetadata?: AdapterRequestMetadata;
}

export interface AdapterRequestSnapshot {
  readonly engineeringRole: string;
  readonly taskId: string;
  readonly contextPackageReference: string;
  readonly executionConstraints: AdapterExecutionConstraints;
  readonly requestMetadata: AdapterRequestMetadata;
}

export class AdapterRequest {
  private constructor(
    private readonly engineeringRoleValue: string,
    private readonly taskIdValue: string,
    private readonly contextPackageReferenceValue: string,
    private readonly executionConstraintsValue: AdapterExecutionConstraints,
    private readonly requestMetadataValue: AdapterRequestMetadata,
  ) {
    Object.freeze(this);
  }

  public static create(input: AdapterRequestInput): AdapterRequest {
    return new AdapterRequest(
      normalizeNonEmptyString(input.engineeringRole, 'Engineering Role'),
      normalizeNonEmptyString(input.taskId, 'Task Identifier'),
      normalizeNonEmptyString(input.contextPackageReference, 'Context Package Reference'),
      copyRecord(input.executionConstraints ?? {}, 'Execution Constraint'),
      copyRecord(input.requestMetadata ?? {}, 'Request Metadata'),
    );
  }

  public static fromSnapshot(snapshot: AdapterRequestSnapshot): AdapterRequest {
    return AdapterRequest.create(snapshot);
  }

  public get engineeringRole(): string {
    return this.engineeringRoleValue;
  }

  public get taskId(): string {
    return this.taskIdValue;
  }

  public get contextPackageReference(): string {
    return this.contextPackageReferenceValue;
  }

  public get executionConstraints(): AdapterExecutionConstraints {
    return this.executionConstraintsValue;
  }

  public get requestMetadata(): AdapterRequestMetadata {
    return this.requestMetadataValue;
  }

  public toSnapshot(): AdapterRequestSnapshot {
    return Object.freeze({
      engineeringRole: this.engineeringRoleValue,
      taskId: this.taskIdValue,
      contextPackageReference: this.contextPackageReferenceValue,
      executionConstraints: this.executionConstraintsValue,
      requestMetadata: this.requestMetadataValue,
    });
  }
}

function copyRecord(record: Readonly<Record<string, string>>, label: string): Readonly<Record<string, string>> {
  const copied: Record<string, string> = {};

  for (const [key, value] of Object.entries(record)) {
    const normalizedKey = normalizeNonEmptyString(key, `${label} key`);
    copied[normalizedKey] = normalizeNonEmptyString(value, `${label} '${normalizedKey}'`);
  }

  return Object.freeze(copied);
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidAdapterRequestError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
