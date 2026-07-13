import { createHash } from 'node:crypto';

import { ProjectionValidationError } from './shared-reality.errors';

export class ProjectionVersion {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): ProjectionVersion {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new ProjectionValidationError('ProjectionVersion must not be empty.');
    }

    return new ProjectionVersion(normalized);
  }

  public static generate(input: unknown): ProjectionVersion {
    return new ProjectionVersion(
      createHash('sha256').update(stableStringify(input)).digest('hex'),
    );
  }

  public equals(other: ProjectionVersion): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  const record = value as Readonly<Record<string, unknown>>;
  const entries = Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`);

  return `{${entries.join(',')}}`;
}
