import { InvalidEvidenceException } from './evidence.errors';

export const contentDigestAlgorithm = 'SHA-256';

export type ContentDigestAlgorithmName = typeof contentDigestAlgorithm;

export class ContentDigestAlgorithm {
  private constructor(private readonly value: ContentDigestAlgorithmName) {
    Object.freeze(this);
  }

  public static fromString(value: string): ContentDigestAlgorithm {
    const normalized = value.trim();

    if (normalized !== contentDigestAlgorithm) {
      throw new InvalidEvidenceException(
        `contentDigestAlgorithm '${normalized}' is not supported; expected SHA-256.`,
      );
    }

    return new ContentDigestAlgorithm(contentDigestAlgorithm);
  }

  public equals(other: ContentDigestAlgorithm): boolean {
    return this.value === other.value;
  }

  public toString(): ContentDigestAlgorithmName {
    return this.value;
  }

  public toJSON(): ContentDigestAlgorithmName {
    return this.value;
  }
}

export class ContentDigest {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): ContentDigest {
    const normalized = value.trim();

    if (!/^[0-9a-f]{64}$/.test(normalized)) {
      throw new InvalidEvidenceException(
        'contentDigest must be exactly 64 lowercase hexadecimal characters.',
      );
    }

    return new ContentDigest(normalized);
  }

  public equals(other: ContentDigest): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
