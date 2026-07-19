import { InvalidEvidenceException } from './evidence.errors';

export interface RepresentedContentReferenceInput {
  readonly contentOwner: string;
  readonly contentType: string;
  readonly contentId: string;
  readonly contentRevision: string;
  readonly evidenceTypeIdentity: string;
  readonly evidenceTypeVersion: string;
}

export type RepresentedContentReferenceSnapshot = RepresentedContentReferenceInput;

export type RepresentedContentReferenceField = keyof RepresentedContentReferenceSnapshot;

export class RepresentedContentReference {
  private constructor(
    private readonly contentOwnerValue: string,
    private readonly contentTypeValue: string,
    private readonly contentIdValue: string,
    private readonly contentRevisionValue: string,
    private readonly evidenceTypeIdentityValue: string,
    private readonly evidenceTypeVersionValue: string,
  ) {
    Object.freeze(this);
  }

  public static create(input: RepresentedContentReferenceInput): RepresentedContentReference {
    return new RepresentedContentReference(
      requireNonEmpty(input.contentOwner, 'representedContentReference.contentOwner'),
      requireNonEmpty(input.contentType, 'representedContentReference.contentType'),
      requireNonEmpty(input.contentId, 'representedContentReference.contentId'),
      requireNonEmpty(input.contentRevision, 'representedContentReference.contentRevision'),
      requireNonEmpty(
        input.evidenceTypeIdentity,
        'representedContentReference.evidenceTypeIdentity',
      ),
      requireNonEmpty(input.evidenceTypeVersion, 'representedContentReference.evidenceTypeVersion'),
    );
  }

  public static fromSnapshot(
    snapshot: RepresentedContentReferenceSnapshot,
  ): RepresentedContentReference {
    return RepresentedContentReference.create(snapshot);
  }

  public get contentOwner(): string {
    return this.contentOwnerValue;
  }

  public get contentType(): string {
    return this.contentTypeValue;
  }

  public get contentId(): string {
    return this.contentIdValue;
  }

  public get contentRevision(): string {
    return this.contentRevisionValue;
  }

  public get evidenceTypeIdentity(): string {
    return this.evidenceTypeIdentityValue;
  }

  public get evidenceTypeVersion(): string {
    return this.evidenceTypeVersionValue;
  }

  public equals(other: RepresentedContentReference): boolean {
    return this.key() === other.key();
  }

  public key(): string {
    return [
      this.contentOwnerValue,
      this.contentTypeValue,
      this.contentIdValue,
      this.contentRevisionValue,
      this.evidenceTypeIdentityValue,
      this.evidenceTypeVersionValue,
    ].join('\u001f');
  }

  public toSnapshot(): RepresentedContentReferenceSnapshot {
    return {
      contentOwner: this.contentOwnerValue,
      contentType: this.contentTypeValue,
      contentId: this.contentIdValue,
      contentRevision: this.contentRevisionValue,
      evidenceTypeIdentity: this.evidenceTypeIdentityValue,
      evidenceTypeVersion: this.evidenceTypeVersionValue,
    };
  }
}

function requireNonEmpty(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidEvidenceException(`${label} must be a non-empty string.`);
  }

  return normalized;
}
