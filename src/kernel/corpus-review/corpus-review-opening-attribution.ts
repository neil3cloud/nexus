import { InvalidCorpusReviewOpeningAttributionException } from './corpus-review.errors';

export const corpusReviewOpeningOriginTypes = ['Human', 'Provider', 'DeterministicSystem'] as const;

export type CorpusReviewOpeningOriginType = (typeof corpusReviewOpeningOriginTypes)[number];

export interface CorpusReviewOpeningAttributionInput {
  readonly originType: string;
  readonly originId: string;
  readonly timestamp: Date;
}

export class CorpusReviewOpeningAttribution {
  private constructor(
    public readonly originType: CorpusReviewOpeningOriginType,
    public readonly originId: string,
    private readonly timestampValue: Date,
  ) {
    Object.freeze(this);
  }

  public static create(
    input: CorpusReviewOpeningAttributionInput,
  ): CorpusReviewOpeningAttribution {
    const originType = normalizeOriginType(input.originType);

    return new CorpusReviewOpeningAttribution(
      originType,
      normalizeNonEmpty(input.originId, 'CorpusReviewOpeningAttribution originId'),
      normalizeTimestamp(input.timestamp),
    );
  }

  public get timestamp(): Date {
    return new Date(this.timestampValue.getTime());
  }
}

function normalizeOriginType(value: string): CorpusReviewOpeningOriginType {
  if (isOriginType(value)) {
    return value;
  }

  throw new InvalidCorpusReviewOpeningAttributionException(
    `CorpusReviewOpeningAttribution originType '${value}' is not supported.`,
  );
}

function isOriginType(value: string): value is CorpusReviewOpeningOriginType {
  return corpusReviewOpeningOriginTypes.some((originType) => originType === value);
}

function normalizeNonEmpty(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidCorpusReviewOpeningAttributionException(
      `${label} must be a non-empty string.`,
    );
  }

  return normalized;
}

function normalizeTimestamp(value: Date): Date {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new InvalidCorpusReviewOpeningAttributionException(
      'CorpusReviewOpeningAttribution timestamp must be a valid Date.',
    );
  }

  return new Date(value.getTime());
}
