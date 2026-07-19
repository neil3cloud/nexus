import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { ExactContentCanonicalizerRegistry } from '../../../src/kernel/evidence/exact-content-canonicalizer-registry';
import {
  UnsupportedCanonicalizerIdentityException,
  UnsupportedCanonicalizerVersionException,
} from '../../../src/kernel/evidence/evidence.errors';
import { RepresentedContentReference } from '../../../src/kernel/evidence/exact-content-reference';

describe('ExactContentCanonicalizerRegistry', () => {
  it('implements ExactOctetStream/1 as zero-transformation byte identity', () => {
    const canonicalizer = new ExactContentCanonicalizerRegistry();
    const octets = new Uint8Array([0, 1, 2, 255]);
    const canonicalBytes = canonicalizer.canonicalize(reference(), octets);

    expect(canonicalBytes).not.toBe(octets);
    expect([...canonicalBytes]).toEqual([...octets]);
  });

  it('fails closed for unsupported profile identity and version distinctly', () => {
    const canonicalizer = new ExactContentCanonicalizerRegistry();

    expect(() =>
      canonicalizer.canonicalize(
        reference({ evidenceTypeIdentity: 'UnsupportedProfile' }),
        new Uint8Array(),
      ),
    ).toThrow(UnsupportedCanonicalizerIdentityException);
    expect(() =>
      canonicalizer.canonicalize(reference({ evidenceTypeVersion: '2' }), new Uint8Array()),
    ).toThrow(UnsupportedCanonicalizerVersionException);
  });

  it('preserves byte-level identity for CRLF/LF, Unicode forms, invalid UTF-8, and empty octets', () => {
    const canonicalizer = new ExactContentCanonicalizerRegistry();
    const crlf = canonicalizer.canonicalize(reference(), Buffer.from('a\r\n'));
    const lf = canonicalizer.canonicalize(reference(), Buffer.from('a\n'));
    const nfc = canonicalizer.canonicalize(reference(), Buffer.from('\u00e9', 'utf8'));
    const nfd = canonicalizer.canonicalize(reference(), Buffer.from('e\u0301', 'utf8'));
    const invalidUtf8 = canonicalizer.canonicalize(reference(), new Uint8Array([0xc3, 0x28]));
    const empty = canonicalizer.canonicalize(reference(), new Uint8Array());

    expect(sha256(crlf)).not.toBe(sha256(lf));
    expect(sha256(nfc)).not.toBe(sha256(nfd));
    expect([...invalidUtf8]).toEqual([0xc3, 0x28]);
    expect(sha256(empty)).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });
});

function reference(
  overrides: Partial<ReturnType<RepresentedContentReference['toSnapshot']>> = {},
): RepresentedContentReference {
  return RepresentedContentReference.create({
    contentOwner: 'repo',
    contentType: 'file',
    contentId: 'README.md',
    contentRevision: 'rev-1',
    evidenceTypeIdentity: 'ExactOctetStream',
    evidenceTypeVersion: '1',
    ...overrides,
  });
}

function sha256(octets: Uint8Array): string {
  return createHash('sha256').update(octets).digest('hex');
}
