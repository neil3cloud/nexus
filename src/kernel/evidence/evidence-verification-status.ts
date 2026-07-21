import { InvalidEvidenceException } from './evidence.errors';
import type { ThresholdSatisfactionResult } from './threshold-satisfaction';

export const evidenceVerificationStatusSemantics = 'EvidenceVerificationStatus/v1' as const;

export const evidenceVerificationStatusNames = [
  'Verified',
  'Unverified',
  'VerificationFailed',
] as const;

export type EvidenceVerificationStatusName = (typeof evidenceVerificationStatusNames)[number];

export type GovernedVerificationStatusInput =
  | { readonly kind: 'Governed'; readonly value: EvidenceVerificationStatus }
  | { readonly kind: 'Unrankable' };

export class EvidenceVerificationStatus {
  private constructor(private readonly value: EvidenceVerificationStatusName) {
    Object.freeze(this);
  }

  public static fromString(value: string): EvidenceVerificationStatus {
    if (typeof value !== 'string') {
      throw new InvalidEvidenceException(
        'EvidenceVerificationStatus must be a non-empty RFC-0002 v1.3 vocabulary value.',
      );
    }

    if (!isEvidenceVerificationStatusName(value)) {
      throw new InvalidEvidenceException(
        `EvidenceVerificationStatus '${value}' is not supported by RFC-0002 v1.3.`,
      );
    }

    return new EvidenceVerificationStatus(value);
  }

  public static isEvidenceVerificationStatus(value: unknown): value is EvidenceVerificationStatus {
    return value instanceof EvidenceVerificationStatus;
  }

  public equals(other: EvidenceVerificationStatus): boolean {
    return this.value === other.value;
  }

  public compareTo(other: EvidenceVerificationStatus): number {
    return verificationStatusRank(this.value) - verificationStatusRank(other.value);
  }

  public satisfiesThreshold(threshold: EvidenceVerificationStatus): ThresholdSatisfactionResult {
    return verificationStatusSatisfiesThreshold({ kind: 'Governed', value: this }, threshold);
  }

  public toString(): EvidenceVerificationStatusName {
    return this.value;
  }

  public toJSON(): EvidenceVerificationStatusName {
    return this.value;
  }
}

export function verificationStatusSatisfiesThreshold(
  status: GovernedVerificationStatusInput,
  threshold: EvidenceVerificationStatus,
): ThresholdSatisfactionResult {
  if (status.kind === 'Unrankable') {
    return 'Undetermined';
  }

  return status.value.compareTo(threshold) >= 0 ? 'Satisfied' : 'Insufficient';
}

function verificationStatusRank(value: EvidenceVerificationStatusName): number {
  return evidenceVerificationStatusNames.length - evidenceVerificationStatusNames.indexOf(value);
}

function isEvidenceVerificationStatusName(value: string): value is EvidenceVerificationStatusName {
  return evidenceVerificationStatusNames.some((status) => status === value);
}
