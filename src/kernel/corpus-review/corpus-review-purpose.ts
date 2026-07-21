import { InvalidCorpusReviewPurposeException } from './corpus-review.errors';

export const corpusReviewPurposeValues = [
  'AutonomousPlanning',
  'Implementation',
  'ProviderExecution',
  'ArchitecturalRatification',
  'Migration',
  'ReleasePreparation',
] as const;

export type CorpusReviewPurposeValue = (typeof corpusReviewPurposeValues)[number];

export class CorpusReviewPurpose {
  private constructor(private readonly value: CorpusReviewPurposeValue) {
    Object.freeze(this);
  }

  public static fromString(value: string): CorpusReviewPurpose {
    if (isCorpusReviewPurposeValue(value)) {
      return new CorpusReviewPurpose(value);
    }

    throw new InvalidCorpusReviewPurposeException(
      `CorpusReviewPurpose '${value}' is not one of the six authorized core values.`,
    );
  }

  public get canonicalPurposeKey(): string {
    return this.value;
  }

  public equals(other: CorpusReviewPurpose): boolean {
    return this.value === other.value;
  }

  public toString(): CorpusReviewPurposeValue {
    return this.value;
  }

  public toJSON(): CorpusReviewPurposeValue {
    return this.value;
  }
}

function isCorpusReviewPurposeValue(value: string): value is CorpusReviewPurposeValue {
  return corpusReviewPurposeValues.some((purpose) => purpose === value);
}
