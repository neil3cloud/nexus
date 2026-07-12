import { describe, expect, it } from 'vitest';

import { ExecutionStrategy } from '../../../src/kernel/execution/execution-strategy.aggregate';
import {
  DuplicateExecutionStrategyError,
  DuplicateExecutionStrategyForMissionError,
} from '../../../src/kernel/execution/execution-strategy.errors';
import { InMemoryExecutionStrategyRepository } from '../../../src/kernel/execution/execution-strategy.repository';

function createStrategy(id: string, missionId: string): ExecutionStrategy {
  return ExecutionStrategy.create({ id, missionId });
}

describe('InMemoryExecutionStrategyRepository', () => {
  it('creates, retrieves, and enumerates ExecutionStrategies deterministically', async () => {
    const repository = new InMemoryExecutionStrategyRepository();
    const strategyB = createStrategy('strategy-b', 'mission-b');
    const strategyA = createStrategy('strategy-a', 'mission-a');

    await repository.create(strategyB);
    await repository.create(strategyA);

    expect(await repository.exists('strategy-a')).toBe(true);
    expect((await repository.getById('strategy-a'))?.toSnapshot()).toEqual(strategyA.toSnapshot());
    expect((await repository.getByMissionId('mission-b'))?.toSnapshot()).toEqual(
      strategyB.toSnapshot(),
    );
    expect((await repository.enumerate()).map((strategy) => strategy.id.toString())).toEqual([
      'strategy-a',
      'strategy-b',
    ]);
  });

  it('rejects duplicate identities and duplicate Mission strategies', async () => {
    const repository = new InMemoryExecutionStrategyRepository();

    await repository.create(createStrategy('strategy-1', 'mission-1'));

    await expect(repository.create(createStrategy('strategy-1', 'mission-2'))).rejects.toThrow(
      DuplicateExecutionStrategyError,
    );
    await expect(repository.create(createStrategy('strategy-2', 'mission-1'))).rejects.toThrow(
      DuplicateExecutionStrategyForMissionError,
    );
  });
});
