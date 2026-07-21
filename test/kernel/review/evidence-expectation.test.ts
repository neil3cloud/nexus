import { describe, expect, it } from 'vitest';

import {
  canonicalizeEvidenceExpectationSet,
  createEvidenceExpectationSet,
  noAdditionalExpectation,
  requiredEvidenceCount,
  requiredEvidenceType,
  requiredExactContent,
} from '../../../src/kernel/review/evidence-expectation';
import { InvalidReviewDefinitionError } from '../../../src/kernel/review/review.errors';

describe('EvidenceExpectation', () => {
  it('constructs and canonicalizes every authorized variant', () => {
    const expectations = createEvidenceExpectationSet([
      requiredEvidenceCount(2),
      requiredExactContent('SnapshotContent'),
      requiredEvidenceType('RepositorySourceCode', '1'),
    ]);

    expect(expectations.map((expectation) => expectation.kind).sort()).toEqual([
      'RequiredEvidenceCount',
      'RequiredEvidenceType',
      'RequiredExactContent',
    ]);
    expect(canonicalizeEvidenceExpectationSet(expectations)).toBe(
      canonicalizeEvidenceExpectationSet([...expectations].reverse()),
    );
    expect(createEvidenceExpectationSet([noAdditionalExpectation()])).toHaveLength(1);
  });

  it('fails closed on malformed expectation sets', () => {
    expect(() => createEvidenceExpectationSet([])).toThrow(InvalidReviewDefinitionError);
    expect(() => createEvidenceExpectationSet([noAdditionalExpectation(), requiredEvidenceCount(1)])).toThrow(
      InvalidReviewDefinitionError,
    );
    expect(() => createEvidenceExpectationSet([requiredEvidenceCount(1), requiredEvidenceCount(2)])).toThrow(
      InvalidReviewDefinitionError,
    );
    expect(() =>
      createEvidenceExpectationSet([requiredExactContent('SnapshotContent'), requiredExactContent('DerivedContent')]),
    ).toThrow(InvalidReviewDefinitionError);
    expect(() => createEvidenceExpectationSet([requiredEvidenceType('type', '1'), requiredEvidenceType('type', '1')])).toThrow(
      InvalidReviewDefinitionError,
    );
    expect(() => requiredEvidenceType('', '1')).toThrow(InvalidReviewDefinitionError);
    expect(() => requiredEvidenceCount(0)).toThrow(InvalidReviewDefinitionError);
    expect(() => requiredExactContent('Other' as never)).toThrow(InvalidReviewDefinitionError);
  });
});
