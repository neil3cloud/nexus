import { InvalidReviewDefinitionError } from './review.errors';
import { compareUtf8Bytes } from './subject-element-reference';
import { frame } from './assessment-criterion-applicability';

export const exactContentExpectationClassifications = [
  'AnyExactContent',
  'SnapshotContent',
  'DerivedContent',
] as const;

export type ExactContentExpectationClassification = (typeof exactContentExpectationClassifications)[number];

export type EvidenceExpectation =
  | { readonly kind: 'NoAdditionalExpectation' }
  | {
      readonly kind: 'RequiredEvidenceType';
      readonly evidenceTypeIdentity: string;
      readonly evidenceTypeVersion: string;
    }
  | {
      readonly kind: 'RequiredExactContent';
      readonly classification: ExactContentExpectationClassification;
    }
  | { readonly kind: 'RequiredEvidenceCount'; readonly minimumCount: number };

export function noAdditionalExpectation(): EvidenceExpectation {
  return Object.freeze({ kind: 'NoAdditionalExpectation' });
}

export function requiredEvidenceType(identity: string, version: string): EvidenceExpectation {
  return Object.freeze({
    kind: 'RequiredEvidenceType',
    evidenceTypeIdentity: normalizeNonEmpty(identity, 'Evidence Type identity'),
    evidenceTypeVersion: normalizeNonEmpty(version, 'Evidence Type version'),
  });
}

export function requiredExactContent(
  classification: ExactContentExpectationClassification,
): EvidenceExpectation {
  if (!exactContentExpectationClassifications.some((candidate) => candidate === classification)) {
    throw new InvalidReviewDefinitionError('RequiredExactContent classification is not authorized by RFC-0006 v1.3.');
  }

  return Object.freeze({ kind: 'RequiredExactContent', classification });
}

export function requiredEvidenceCount(minimumCount: number): EvidenceExpectation {
  if (!Number.isInteger(minimumCount) || minimumCount < 1) {
    throw new InvalidReviewDefinitionError('RequiredEvidenceCount.minimumCount must be a positive integer.');
  }

  return Object.freeze({ kind: 'RequiredEvidenceCount', minimumCount });
}

export function createEvidenceExpectationSet(
  expectations: readonly EvidenceExpectation[],
): readonly EvidenceExpectation[] {
  if (expectations.length === 0) {
    throw new InvalidReviewDefinitionError('EvidenceExpectation set must be non-empty.');
  }

  const encoded = expectations.map((expectation) => ({
    expectation,
    encoded: canonicalizeEvidenceExpectation(expectation),
  }));
  const unique = new Set(encoded.map((entry) => entry.encoded));

  if (unique.size !== encoded.length) {
    throw new InvalidReviewDefinitionError('EvidenceExpectation set cannot contain duplicate clauses.');
  }

  const hasNoAdditionalExpectation = expectations.some((expectation) => expectation.kind === 'NoAdditionalExpectation');

  if (hasNoAdditionalExpectation && expectations.length > 1) {
    throw new InvalidReviewDefinitionError('NoAdditionalExpectation cannot be declared with another expectation.');
  }

  if (expectations.filter((expectation) => expectation.kind === 'RequiredExactContent').length > 1) {
    throw new InvalidReviewDefinitionError('At most one RequiredExactContent clause is permitted.');
  }

  if (expectations.filter((expectation) => expectation.kind === 'RequiredEvidenceCount').length > 1) {
    throw new InvalidReviewDefinitionError('At most one RequiredEvidenceCount clause is permitted.');
  }

  return Object.freeze(
    encoded.sort((left, right) => compareUtf8Bytes(left.encoded, right.encoded)).map((entry) => entry.expectation),
  );
}

export function canonicalizeEvidenceExpectationSet(expectations: readonly EvidenceExpectation[]): string {
  const sorted = createEvidenceExpectationSet(expectations).map(canonicalizeEvidenceExpectation).sort(compareUtf8Bytes);
  return [frame(String(sorted.length)), ...sorted.map(frame)].join('');
}

export function canonicalizeEvidenceExpectation(expectation: EvidenceExpectation): string {
  switch (expectation.kind) {
    case 'NoAdditionalExpectation':
      return frame('NoAdditionalExpectation');
    case 'RequiredEvidenceType':
      return [
        frame('RequiredEvidenceType'),
        frame(expectation.evidenceTypeIdentity),
        frame(expectation.evidenceTypeVersion),
      ].join('');
    case 'RequiredExactContent':
      return [frame('RequiredExactContent'), frame(expectation.classification)].join('');
    case 'RequiredEvidenceCount':
      return [frame('RequiredEvidenceCount'), frame(String(expectation.minimumCount))].join('');
    default:
      throw new InvalidReviewDefinitionError('Unknown EvidenceExpectation variant.');
  }
}

function normalizeNonEmpty(value: string, label: string): string {
  if (typeof value !== 'string') {
    throw new InvalidReviewDefinitionError(`${label} must be a non-empty string.`);
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidReviewDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
