import { InvalidEvidenceException } from './evidence.errors';
import type { ThresholdSatisfactionResult } from './threshold-satisfaction';

export const confidenceClassificationNames = [
  'Verified',
  'Accepted',
  'Observed',
  'Inferred',
  'Unverified',
] as const;

export type ConfidenceClassificationName = (typeof confidenceClassificationNames)[number];

export class ConfidenceClassification {
  private constructor(private readonly value: ConfidenceClassificationName) {
    Object.freeze(this);
  }

  public static fromString(value: string): ConfidenceClassification {
    if (typeof value !== 'string') {
      throw new InvalidEvidenceException(
        'ConfidenceClassification must be a non-empty RFC-0002 v1.3 vocabulary value.',
      );
    }

    if (!isConfidenceClassificationName(value)) {
      throw new InvalidEvidenceException(
        `ConfidenceClassification '${value}' is not supported by RFC-0002 v1.3.`,
      );
    }

    return new ConfidenceClassification(value);
  }

  public equals(other: ConfidenceClassification): boolean {
    return this.value === other.value;
  }

  public compareTo(other: ConfidenceClassification): number {
    return confidenceRank(this.value) - confidenceRank(other.value);
  }

  public satisfiesThreshold(threshold: ConfidenceClassification): ThresholdSatisfactionResult {
    return confidenceSatisfiesThreshold(this, threshold);
  }

  public toString(): ConfidenceClassificationName {
    return this.value;
  }

  public toJSON(): ConfidenceClassificationName {
    return this.value;
  }
}

export function confidenceSatisfiesThreshold(
  classification: ConfidenceClassification | undefined,
  threshold: ConfidenceClassification,
): ThresholdSatisfactionResult {
  if (classification === undefined) {
    return 'Undetermined';
  }

  return classification.compareTo(threshold) >= 0 ? 'Satisfied' : 'Insufficient';
}

function confidenceRank(value: ConfidenceClassificationName): number {
  return confidenceClassificationNames.length - confidenceClassificationNames.indexOf(value);
}

function isConfidenceClassificationName(value: string): value is ConfidenceClassificationName {
  return confidenceClassificationNames.some((classification) => classification === value);
}
