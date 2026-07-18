import { describe, expect, it } from 'vitest';

import { EngineeringSessionCheckpoint } from '../../../src/kernel/execution/engineering-session-checkpoint';
import {
  DuplicateEngineeringSessionCheckpointError,
} from '../../../src/kernel/execution/engineering-session.errors';
import { InMemoryEngineeringSessionCheckpointRepository } from '../../../src/kernel/execution/engineering-session-checkpoint.repository';
import type { EngineeringSessionSnapshot } from '../../../src/kernel/execution/engineering-session.types';

const engineeringSessionSnapshot: EngineeringSessionSnapshot = Object.freeze({
  id: 'engineering-session-1',
  status: 'Open',
  engineeringRuntimeContextReference: 'runtime-context-1',
  activeEngineeringWorkflowReference: 'builder-workflow',
  workflowChainId: 'workflow-chain-1',
  currentWorkflowStepId: '0',
  participatingRoleIds: Object.freeze(['builder', 'reviewer']),
  workflowState: 'active',
  timeline: Object.freeze({
    createdAt: '2026-07-15T00:00:00.000Z',
    statusTransitions: Object.freeze([
      Object.freeze({
        status: 'Open',
        occurredAt: '2026-07-15T00:00:00.000Z',
      }),
    ]),
  }),
  diagnostics: Object.freeze([
    Object.freeze({
      code: 'engineering-session.diagnostic',
      message: 'Checkpoint repository test diagnostic.',
      recordedAt: '2026-07-15T00:01:00.000Z',
    }),
  ]),
  collaborationMetadata: Object.freeze({
    pair: 'human-builder',
  }),
});

describe('InMemoryEngineeringSessionCheckpointRepository', () => {
  it('creates, retrieves, and enumerates immutable EngineeringSessionCheckpoints deterministically', async () => {
    const repository = new InMemoryEngineeringSessionCheckpointRepository();
    const checkpointB = createCheckpoint('checkpoint-b');
    const checkpointA = createCheckpoint('checkpoint-a');

    await repository.create(checkpointB);
    await repository.create(checkpointA);

    expect(await repository.exists('checkpoint-a')).toBe(true);
    expect((await repository.getById('checkpoint-a'))?.toSnapshot()).toEqual(
      checkpointA.toSnapshot(),
    );
    expect((await repository.enumerate()).map((checkpoint) => checkpoint.id.toString())).toEqual([
      'checkpoint-a',
      'checkpoint-b',
    ]);
  });

  it('rejects duplicate EngineeringSessionCheckpoint identities', async () => {
    const repository = new InMemoryEngineeringSessionCheckpointRepository();

    await repository.create(createCheckpoint('checkpoint-1'));

    await expect(repository.create(createCheckpoint('checkpoint-1'))).rejects.toThrow(
      DuplicateEngineeringSessionCheckpointError,
    );
  });
});

function createCheckpoint(id: string): EngineeringSessionCheckpoint {
  return EngineeringSessionCheckpoint.create({
    id,
    engineeringSession: engineeringSessionSnapshot,
    capturedAt: '2026-07-15T00:02:00.000Z',
  });
}
