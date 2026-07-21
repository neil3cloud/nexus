import { createHash } from 'node:crypto';

import { InvalidCorpusReviewFingerprintInputException } from './corpus-review.errors';

export type CorpusReviewFingerprintTuple = readonly string[];

export class CorpusReviewFingerprintProtocol {
  public static compute(tuples: readonly CorpusReviewFingerprintTuple[]): string {
    return createHash('sha256')
      .update(CorpusReviewFingerprintProtocol.serialize(tuples), 'utf8')
      .digest('hex');
  }

  public static serialize(tuples: readonly CorpusReviewFingerprintTuple[]): string {
    const normalized = tuples.map((tuple) => normalizeTuple(tuple)).sort(compareUtf8);

    return [frame(String(normalized.length)), ...normalized.map(frame)].join('');
  }
}

function normalizeTuple(tuple: CorpusReviewFingerprintTuple): string {
  if (tuple.length === 0) {
    throw new InvalidCorpusReviewFingerprintInputException(
      'Corpus Review fingerprint tuples must contain at least one field.',
    );
  }

  return tuple.map((field) => frame(normalizeField(field))).join('');
}

function normalizeField(field: string): string {
  if (typeof field !== 'string') {
    throw new InvalidCorpusReviewFingerprintInputException(
      'Corpus Review fingerprint fields must be strings.',
    );
  }

  return field;
}

function frame(value: string): string {
  return `${Buffer.byteLength(value, 'utf8')}:${value}`;
}

function compareUtf8(left: string, right: string): number {
  return Buffer.compare(Buffer.from(left, 'utf8'), Buffer.from(right, 'utf8'));
}
