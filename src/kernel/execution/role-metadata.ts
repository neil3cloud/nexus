import { InvalidRoleDefinitionError } from './role.errors';

export type RoleMetadataAttributes = Readonly<Record<string, string>>;

export interface RoleMetadataInput {
  readonly attributes?: RoleMetadataAttributes;
}

export interface RoleMetadataSnapshot {
  readonly attributes: RoleMetadataAttributes;
}

export class RoleMetadata {
  private constructor(private readonly attributesValue: RoleMetadataAttributes) {
    Object.freeze(this);
  }

  public static create(input: RoleMetadataInput = {}): RoleMetadata {
    return new RoleMetadata(copyAttributes(input.attributes ?? {}));
  }

  public static fromSnapshot(snapshot: RoleMetadataSnapshot): RoleMetadata {
    return RoleMetadata.create(snapshot);
  }

  public get attributes(): RoleMetadataAttributes {
    return this.attributesValue;
  }

  public equals(other: RoleMetadata): boolean {
    return attributesEqual(this.attributesValue, other.attributesValue);
  }

  public toSnapshot(): RoleMetadataSnapshot {
    return Object.freeze({
      attributes: this.attributesValue,
    });
  }
}

function copyAttributes(attributes: RoleMetadataAttributes): RoleMetadataAttributes {
  const copied: Record<string, string> = {};

  for (const [key, value] of Object.entries(attributes).sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    const normalizedKey = normalizeNonEmptyString(key, 'RoleMetadata attribute key');
    copied[normalizedKey] = normalizeNonEmptyString(value, `RoleMetadata attribute '${normalizedKey}'`);
  }

  return Object.freeze(copied);
}

function attributesEqual(left: RoleMetadataAttributes, right: RoleMetadataAttributes): boolean {
  const leftEntries = Object.entries(left);
  const rightEntries = Object.entries(right);

  if (leftEntries.length !== rightEntries.length) {
    return false;
  }

  return leftEntries.every(([key, value]) => right[key] === value);
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidRoleDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}

