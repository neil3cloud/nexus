import { createHash } from 'node:crypto';

export function oracleString(value: string): Uint8Array {
  const normalized = value.normalize('NFC').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const bytes = Buffer.from(normalized, 'utf8');

  return Buffer.concat([Buffer.from(`${bytes.byteLength}:`, 'utf8'), bytes]);
}

export function oracleInteger(value: number): Uint8Array {
  return Buffer.from(`i${value}e`, 'utf8');
}

export function oracleList(values: readonly Uint8Array[]): Uint8Array {
  return Buffer.concat([Buffer.from('l', 'utf8'), ...values, Buffer.from('e', 'utf8')]);
}

export function oracleRecord(fields: readonly [string, Uint8Array][]): Uint8Array {
  return Buffer.concat([
    Buffer.from('r', 'utf8'),
    oracleInteger(fields.length),
    ...fields.flatMap(([name, value]) => [oracleString(name), value]),
    Buffer.from('e', 'utf8'),
  ]);
}

export function oracleOrderInsensitiveStrings(values: readonly string[]): Uint8Array | undefined {
  const encoded = values.map((value) => oracleString(value));
  const sorted = [...encoded].sort((left, right) => Buffer.compare(left, right));

  for (let index = 1; index < sorted.length; index += 1) {
    const current = sorted[index];
    const previous = sorted[index - 1];

    if (current !== undefined && previous !== undefined && Buffer.compare(current, previous) === 0) {
      return undefined;
    }
  }

  return oracleList(sorted);
}

export function oracleSha256Hex(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

