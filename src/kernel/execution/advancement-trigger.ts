import { InvalidAdvancementTriggerDefinitionError } from './advancement-trigger.errors';
import type {
  AdvancementTriggerInput,
  AdvancementTriggerSnapshot,
} from './advancement-trigger.types';

const advancementTriggerAllowedKeys = new Set(['fact']);

export class AdvancementTrigger {
  private constructor(private readonly factValue: string) {
    Object.freeze(this);
  }

  public static create(input: AdvancementTriggerInput): AdvancementTrigger {
    assertAllowedKeys(input);

    return new AdvancementTrigger(normalizeNonEmptyString(input.fact, 'AdvancementTrigger fact'));
  }

  public static fromSnapshot(snapshot: AdvancementTriggerSnapshot): AdvancementTrigger {
    return AdvancementTrigger.create(snapshot);
  }

  public get fact(): string {
    return this.factValue;
  }

  public equals(other: AdvancementTrigger): boolean {
    return JSON.stringify(this.toSnapshot()) === JSON.stringify(other.toSnapshot());
  }

  public toSnapshot(): AdvancementTriggerSnapshot {
    return Object.freeze({
      fact: this.factValue,
    });
  }
}

function assertAllowedKeys(input: AdvancementTriggerInput): void {
  const unsupportedKeys = Object.keys(input).filter(
    (key) => !advancementTriggerAllowedKeys.has(key),
  );

  if (unsupportedKeys.length > 0) {
    throw new InvalidAdvancementTriggerDefinitionError(
      `AdvancementTrigger supports only fact; unsupported field(s): ${unsupportedKeys.join(', ')}.`,
    );
  }
}

function normalizeNonEmptyString(value: unknown, label: string): string {
  if (typeof value !== 'string') {
    throw new InvalidAdvancementTriggerDefinitionError(`${label} must be a non-empty string.`);
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidAdvancementTriggerDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
