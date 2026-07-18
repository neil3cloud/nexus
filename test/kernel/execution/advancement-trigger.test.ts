import { describe, expect, it } from 'vitest';

import { AdvancementTrigger } from '../../../src/kernel/execution/advancement-trigger';
import { InvalidAdvancementTriggerDefinitionError } from '../../../src/kernel/execution/advancement-trigger.errors';

describe('AdvancementTrigger value object', () => {
  it('constructs immutable producer-independent trigger facts with deterministic snapshots', () => {
    const trigger = AdvancementTrigger.create({
      fact: ' workflow-position-eligible ',
    });
    const equivalentTrigger = AdvancementTrigger.fromSnapshot(trigger.toSnapshot());

    expect(trigger.fact).toBe('workflow-position-eligible');
    expect(trigger.toSnapshot()).toEqual({
      fact: 'workflow-position-eligible',
    });
    expect(Object.isFrozen(trigger)).toBe(true);
    expect(Object.isFrozen(trigger.toSnapshot())).toBe(true);
    expect(trigger.equals(equivalentTrigger)).toBe(true);
  });

  it('rejects invalid trigger facts and metadata deterministically', () => {
    expect(() => AdvancementTrigger.create({ fact: '' })).toThrow(
      InvalidAdvancementTriggerDefinitionError,
    );
    expect(() =>
      AdvancementTrigger.create({
        fact: 'workflow-position-eligible',
        unsupported: 'value',
      } as unknown as Parameters<typeof AdvancementTrigger.create>[0]),
    ).toThrow(InvalidAdvancementTriggerDefinitionError);
  });
});
