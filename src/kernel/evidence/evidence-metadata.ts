import { InvalidEvidenceException } from './evidence.errors';

export type EvidenceMetadataAttributes = Readonly<Record<string, string>>;

export interface EvidenceMetadataInput {
  readonly capturedAt: string;
  readonly attributes?: EvidenceMetadataAttributes;
}

export interface EvidenceMetadataSnapshot {
  readonly capturedAt: string;
  readonly attributes: EvidenceMetadataAttributes;
}

export class EvidenceMetadata {
  private constructor(
    private readonly capturedAtValue: string,
    private readonly attributesValue: EvidenceMetadataAttributes,
  ) {
    Object.freeze(this);
  }

  public static create(input: EvidenceMetadataInput): EvidenceMetadata {
    const capturedAt = input.capturedAt.trim();

    if (capturedAt.length === 0) {
      throw new InvalidEvidenceException('EvidenceMetadata capturedAt must be a non-empty string.');
    }

    return new EvidenceMetadata(capturedAt, copyAttributes(input.attributes ?? {}));
  }

  public static fromSnapshot(snapshot: EvidenceMetadataSnapshot): EvidenceMetadata {
    return EvidenceMetadata.create(snapshot);
  }

  public get capturedAt(): string {
    return this.capturedAtValue;
  }

  public get attributes(): EvidenceMetadataAttributes {
    return { ...this.attributesValue };
  }

  public equals(other: EvidenceMetadata): boolean {
    return (
      this.capturedAtValue === other.capturedAtValue &&
      attributesEqual(this.attributesValue, other.attributesValue)
    );
  }

  public toSnapshot(): EvidenceMetadataSnapshot {
    return {
      capturedAt: this.capturedAtValue,
      attributes: { ...this.attributesValue },
    };
  }
}

function copyAttributes(attributes: EvidenceMetadataAttributes): EvidenceMetadataAttributes {
  const copied: Record<string, string> = {};

  for (const [key, value] of Object.entries(attributes)) {
    const normalizedKey = key.trim();

    if (normalizedKey.length === 0) {
      throw new InvalidEvidenceException('EvidenceMetadata attribute keys must be non-empty.');
    }

    if (value.trim().length === 0) {
      throw new InvalidEvidenceException(
        `EvidenceMetadata attribute '${normalizedKey}' must be non-empty.`,
      );
    }

    copied[normalizedKey] = value;
  }

  return Object.freeze(copied);
}

function attributesEqual(left: EvidenceMetadataAttributes, right: EvidenceMetadataAttributes): boolean {
  const leftEntries = Object.entries(left);
  const rightEntries = Object.entries(right);

  if (leftEntries.length !== rightEntries.length) {
    return false;
  }

  return leftEntries.every(([key, value]) => right[key] === value);
}
