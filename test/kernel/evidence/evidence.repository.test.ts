import { describe, expect, it } from 'vitest';

import { Evidence } from '../../../src/kernel/evidence/evidence.aggregate';
import { DuplicateEvidenceException } from '../../../src/kernel/evidence/evidence.errors';
import { EvidenceId } from '../../../src/kernel/evidence/evidence-id';
import { InMemoryEvidenceRepository } from '../../../src/kernel/evidence/evidence.repository';

function createEvidence(id: string): Evidence {
  return Evidence.register({
    id,
    type: 'TestResult',
    version: 1,
    hash: `sha256:${id}`,
    metadata: {
      capturedAt: '2026-07-12T00:00:00.000Z',
      attributes: {
        suite: 'unit',
      },
    },
    provenance: {
      source: 'vitest',
      acquisitionMethod: 'test-run',
      acquiredAt: '2026-07-12T00:00:00.000Z',
      actor: 'builder',
      system: 'nexus',
      verificationStatus: 'Verified',
    },
  });
}

describe('InMemoryEvidenceRepository', () => {
  it('registers, retrieves, checks existence, and enumerates Evidence', async () => {
    const repository = new InMemoryEvidenceRepository();
    const evidence = createEvidence('evidence-1');

    await repository.register(evidence);

    const retrieved = await repository.getById(EvidenceId.fromString('evidence-1'));

    expect(await repository.exists(evidence.id)).toBe(true);
    expect(retrieved?.toSnapshot()).toEqual(evidence.toSnapshot());
    await expect(repository.enumerate()).resolves.toHaveLength(1);
  });

  it('returns undefined and false when Evidence does not exist', async () => {
    const repository = new InMemoryEvidenceRepository();
    const evidenceId = EvidenceId.fromString('missing-evidence');

    await expect(repository.getById(evidenceId)).resolves.toBeUndefined();
    await expect(repository.exists(evidenceId)).resolves.toBe(false);
  });

  it('rejects duplicate identifiers without overwriting registered Evidence', async () => {
    const repository = new InMemoryEvidenceRepository();
    const evidence = createEvidence('evidence-1');

    await repository.register(evidence);

    await expect(repository.register(createEvidence('evidence-1'))).rejects.toThrow(
      DuplicateEvidenceException,
    );
    expect((await repository.enumerate()).map((registered) => registered.id.toString())).toEqual([
      'evidence-1',
    ]);
  });

  it('stores snapshots so registered Evidence remains immutable through retrieval', async () => {
    const repository = new InMemoryEvidenceRepository();
    const evidence = createEvidence('evidence-1');

    await repository.register(evidence);

    const retrieved = await repository.getById(evidence.id);

    expect(retrieved).not.toBe(evidence);
    expect(Object.isFrozen(retrieved)).toBe(true);
    expect(retrieved?.toSnapshot()).toEqual(evidence.toSnapshot());
  });
});
