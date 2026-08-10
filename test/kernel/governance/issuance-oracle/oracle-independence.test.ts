import { readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const oracleFiles = [
  'nccs1-encoder.oracle.ts',
  'schema-table.oracle.ts',
  'source-parser.oracle.ts',
  'vocabulary.oracle.ts',
  'issuance.oracle.ts',
] as const;

describe('ratification authority issuance oracle independence', () => {
  it('does not transitively import any src module from oracle modules', () => {
    const visited = new Set<string>();

    for (const file of oracleFiles) {
      walk(resolve(__dirname, file), visited);
    }

    for (const file of visited) {
      const normalized = file.replace(/\\/g, '/');

      expect(normalized.includes('/src/')).toBe(false);
    }
  });
});

function walk(file: string, visited: Set<string>): void {
  if (visited.has(file)) {
    return;
  }

  visited.add(file);

  const source = readFileSync(file, 'utf8');
  const imports = [...source.matchAll(/from\s+['"](.+)['"]/g)].map((match) => match[1]).filter(isDefined);

  for (const specifier of imports) {
    if (!specifier.startsWith('.')) {
      continue;
    }

    const candidate = resolve(dirname(file), `${specifier}.ts`);

    if (statSync(candidate).isFile()) {
      walk(candidate, visited);
    }
  }
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

