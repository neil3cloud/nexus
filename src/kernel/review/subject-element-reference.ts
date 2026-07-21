import { Buffer } from 'node:buffer';

import { InvalidReviewDefinitionError } from './review.errors';

export class SubjectElementReference {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): SubjectElementReference {
    return new SubjectElementReference(normalizeOpaqueIdentifier(value, 'SubjectElementReference'));
  }

  public equals(other: SubjectElementReference): boolean {
    return this.value === other.value;
  }

  public compareTo(other: SubjectElementReference): number {
    return compareUtf8Bytes(this.value, other.value);
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}

export class CanonicalSubjectElementKind {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): CanonicalSubjectElementKind {
    return new CanonicalSubjectElementKind(normalizeOpaqueIdentifier(value, 'CanonicalSubjectElementKind'));
  }

  public equals(other: CanonicalSubjectElementKind): boolean {
    return this.value === other.value;
  }

  public compareTo(other: CanonicalSubjectElementKind): number {
    return compareUtf8Bytes(this.value, other.value);
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}

export class CorpusReviewBasisFingerprint {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): CorpusReviewBasisFingerprint {
    return new CorpusReviewBasisFingerprint(normalizeOpaqueIdentifier(value, 'CorpusReviewBasisFingerprint'));
  }

  public equals(other: CorpusReviewBasisFingerprint): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}

export function compareUtf8Bytes(left: string, right: string): number {
  return Buffer.compare(Buffer.from(left, 'utf8'), Buffer.from(right, 'utf8'));
}

function normalizeOpaqueIdentifier(value: string, label: string): string {
  if (typeof value !== 'string') {
    throw new InvalidReviewDefinitionError(`${label} must be a non-empty opaque string.`);
  }

  const normalized = value.trim();

  if (normalized.length === 0 || hasControlCharacter(normalized)) {
    throw new InvalidReviewDefinitionError(`${label} must be a structurally valid non-empty opaque string.`);
  }

  return normalized;
}

function hasControlCharacter(value: string): boolean {
  return [...value].some((character) => {
    const codePoint = character.codePointAt(0);

    return codePoint !== undefined && (codePoint < 32 || codePoint === 127);
  });
}
