import { describe, expect, it } from 'vitest';

import { Knowledge } from '../../../src/kernel/knowledge/knowledge.aggregate';
import { DuplicateKnowledgeError } from '../../../src/kernel/knowledge/knowledge.errors';
import { KnowledgeId } from '../../../src/kernel/knowledge/knowledge-id';
import { InMemoryKnowledgeRepository } from '../../../src/kernel/knowledge/knowledge.repository';
import {
  captureKnowledgeInput,
  createAcceptedReview,
  createCompletedMission,
  createEvidence,
} from './knowledge.test-support';

function createKnowledge(id = 'knowledge-1'): Knowledge {
  return Knowledge.capture(
    {
      ...captureKnowledgeInput(),
      id,
    },
    {
      mission: createCompletedMission(),
      supportingEvidence: [createEvidence()],
      supportingReview: createAcceptedReview(),
    },
  );
}

describe('InMemoryKnowledgeRepository', () => {
  it('creates, retrieves, checks existence, saves, and enumerates Knowledge snapshots', async () => {
    const repository = new InMemoryKnowledgeRepository();
    const knowledge = createKnowledge();

    await repository.create(knowledge);

    const revised = knowledge.revise({ summary: 'Revised Knowledge summary.' });
    await repository.save(revised);

    expect(await repository.exists(KnowledgeId.fromString('knowledge-1'))).toBe(true);
    expect((await repository.getById('knowledge-1'))?.toSnapshot()).toEqual(revised.toSnapshot());
    expect((await repository.enumerate()).map((item) => item.id.toString())).toEqual(['knowledge-1']);
  });

  it('rejects duplicate create operations without overwriting existing Knowledge', async () => {
    const repository = new InMemoryKnowledgeRepository();

    await repository.create(createKnowledge());

    await expect(repository.create(createKnowledge())).rejects.toThrow(DuplicateKnowledgeError);
    expect((await repository.getById('knowledge-1'))?.summary).toBe(
      'Knowledge preserves accepted engineering outcomes.',
    );
  });

  it('stores snapshots so retrieved Knowledge is independent from caller instances', async () => {
    const repository = new InMemoryKnowledgeRepository();
    const knowledge = createKnowledge();

    await repository.create(knowledge);

    const retrieved = await repository.getById('knowledge-1');

    expect(retrieved).not.toBe(knowledge);
    expect(retrieved?.toSnapshot()).toEqual(knowledge.toSnapshot());
  });
});
