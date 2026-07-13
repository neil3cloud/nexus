import { describe, expect, it } from 'vitest';

import { InvalidEvidenceException } from '../../../src/kernel/evidence/evidence.errors';
import { EvidenceHash } from '../../../src/kernel/evidence/evidence-hash';
import { EvidenceId } from '../../../src/kernel/evidence/evidence-id';
import { EvidenceSource } from '../../../src/kernel/evidence/evidence-source';
import { EvidenceType } from '../../../src/kernel/evidence/evidence-type';
import { EvidenceVersion } from '../../../src/kernel/evidence/evidence-version';

describe('Evidence value objects', () => {
  it('normalizes immutable identities with equality semantics', () => {
    const evidenceId = EvidenceId.fromString(' evidence-1 ');

    expect(evidenceId.toString()).toBe('evidence-1');
    expect(evidenceId.equals(EvidenceId.fromString('evidence-1'))).toBe(true);
    expect(evidenceId.equals(EvidenceId.fromString('evidence-2'))).toBe(false);
    expect(Object.isFrozen(evidenceId)).toBe(true);
  });

  it('validates supported EvidenceType values', () => {
    const evidenceType = EvidenceType.fromString(' TestResult ');

    expect(evidenceType.toString()).toBe('TestResult');
    expect(evidenceType.equals(EvidenceType.fromString('TestResult'))).toBe(true);
    expect(() => EvidenceType.fromString('SearchIndex')).toThrow(InvalidEvidenceException);
  });

  it('validates EvidenceSource, EvidenceVersion, and EvidenceHash', () => {
    expect(EvidenceSource.fromString(' repository ').toString()).toBe('repository');
    expect(EvidenceVersion.fromNumber(1).toNumber()).toBe(1);
    expect(EvidenceHash.fromString(' sha256:abc ').toString()).toBe('sha256:abc');

    expect(() => EvidenceSource.fromString(' ')).toThrow(InvalidEvidenceException);
    expect(() => EvidenceVersion.fromNumber(0)).toThrow(InvalidEvidenceException);
    expect(() => EvidenceVersion.fromNumber(1.5)).toThrow(InvalidEvidenceException);
    expect(() => EvidenceHash.fromString(' ')).toThrow(InvalidEvidenceException);
  });
});
