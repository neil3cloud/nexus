import { describe, expect, it } from 'vitest';

import {
  encodeNccsOrderInsensitiveStrings,
  encodeNccsString,
} from '../../../src/kernel/governance/ratification-authority-snapshot-issuance.contract';
import {
  oracleOrderInsensitiveStrings,
  oracleString,
} from './issuance-oracle/nccs1-encoder.oracle';

const positiveVector4Hex = '353a436166c3a9';
const positiveVector5Hex = '31313a6c696e65310a6c696e6532';
const positiveVector6Hex =
  '6c31393a636c6f636b2d736b65772d646574656374656434363a7265736f6c7574696f6e2d7761726e696e673a206f7074696f6e616c20736f7572636520756e7265736f6c76656465';

const diagnosticsInOriginalOrder = [
  'resolution-warning: optional source unresolved',
  'clock-skew-detected',
] as const;
const diagnosticsInCanonicalOrder = [
  'clock-skew-detected',
  'resolution-warning: optional source unresolved',
] as const;

describe('NCCS-1 conformance vectors for Sprint 82 encoders', () => {
  it('reproduces RFC-0003 Positive Vector 4 for Unicode NFC equivalence', () => {
    const precomposed = 'Caf\u00e9';
    const decomposed = 'Cafe\u0301';

    expect(toHex(encodeNccsString(precomposed))).toBe(positiveVector4Hex);
    expect(toHex(encodeNccsString(decomposed))).toBe(positiveVector4Hex);
    expect(toHex(oracleString(precomposed))).toBe(positiveVector4Hex);
    expect(toHex(oracleString(decomposed))).toBe(positiveVector4Hex);
  });

  it('reproduces RFC-0003 Positive Vector 5 for line-ending equivalence', () => {
    const crlf = 'line1\r\nline2';
    const lf = 'line1\nline2';

    expect(toHex(encodeNccsString(crlf))).toBe(positiveVector5Hex);
    expect(toHex(encodeNccsString(lf))).toBe(positiveVector5Hex);
    expect(toHex(oracleString(crlf))).toBe(positiveVector5Hex);
    expect(toHex(oracleString(lf))).toBe(positiveVector5Hex);
  });

  it('reproduces RFC-0003 Positive Vector 6 for order-insensitive collection ordering', () => {
    expect(toHex(encodeNccsOrderInsensitiveStrings(diagnosticsInOriginalOrder))).toBe(
      positiveVector6Hex,
    );
    expect(toHex(encodeNccsOrderInsensitiveStrings(diagnosticsInCanonicalOrder))).toBe(
      positiveVector6Hex,
    );
    expect(toHex(oracleOrderInsensitiveStrings(diagnosticsInOriginalOrder))).toBe(
      positiveVector6Hex,
    );
    expect(toHex(oracleOrderInsensitiveStrings(diagnosticsInCanonicalOrder))).toBe(
      positiveVector6Hex,
    );
  });
});

function toHex(bytes: Uint8Array | undefined): string {
  return bytes === undefined ? 'undefined' : Buffer.from(bytes).toString('hex');
}
