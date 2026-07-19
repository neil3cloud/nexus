import { describe, expect, it } from 'vitest';

import { Evidence } from '../../../src/kernel/evidence/evidence.aggregate';
import {
  AmbiguousEvidenceVersionException,
  DuplicateEvidenceException,
  EvidenceVersionNotFoundException,
} from '../../../src/kernel/evidence/evidence.errors';
import { EvidenceId } from '../../../src/kernel/evidence/evidence-id';
import { EvidenceVersion } from '../../../src/kernel/evidence/evidence-version';
import { InMemoryEvidenceRepository } from '../../../src/kernel/evidence/evidence.repository';

function createEvidence(id: string, version = 1): Evidence {
  return Evidence.register({
    id,
    type: 'TestResult',
    version,
    hash: `sha256:${id}:${version}`,
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

  it('rejects exact version duplicates without overwriting registered Evidence', async () => {
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

  it('accepts distinct versions under one identity and retrieves exact pairs', async () => {
    const repository = new InMemoryEvidenceRepository();
    const evidenceV1 = createEvidence('evidence-1', 1);
    const evidenceV2 = createEvidence('evidence-1', 2);

    await repository.register(evidenceV1);
    await repository.register(evidenceV2);

    await expect(
      repository.getByIdAndVersion(EvidenceId.fromString('evidence-1'), EvidenceVersion.fromNumber(1)),
    ).resolves.toMatchObject({ version: EvidenceVersion.fromNumber(1) });
    await expect(
      repository.getByIdAndVersion(EvidenceId.fromString('evidence-1'), EvidenceVersion.fromNumber(2)),
    ).resolves.toMatchObject({ version: EvidenceVersion.fromNumber(2) });
    await expect(repository.exists(EvidenceId.fromString('evidence-1'))).resolves.toBe(true);
  });

  it('distinguishes missing identity, missing version, and exact existence checks', async () => {
    const repository = new InMemoryEvidenceRepository();

    await repository.register(createEvidence('evidence-1', 1));

    await expect(
      repository.getByIdAndVersion(
        EvidenceId.fromString('missing-evidence'),
        EvidenceVersion.fromNumber(1),
      ),
    ).resolves.toBeUndefined();
    await expect(
      repository.getByIdAndVersion(EvidenceId.fromString('evidence-1'), EvidenceVersion.fromNumber(2)),
    ).rejects.toThrow(EvidenceVersionNotFoundException);
    await expect(
      repository.existsByIdAndVersion(
        EvidenceId.fromString('missing-evidence'),
        EvidenceVersion.fromNumber(1),
      ),
    ).resolves.toBe(false);
    await expect(
      repository.existsByIdAndVersion(EvidenceId.fromString('evidence-1'), EvidenceVersion.fromNumber(2)),
    ).resolves.toBe(false);
  });

  it('requires exact version for identity-only retrieval when multiple versions exist', async () => {
    const repository = new InMemoryEvidenceRepository();

    await repository.register(createEvidence('evidence-1', 1));
    await repository.register(createEvidence('evidence-1', 2));

    await expect(repository.getById(EvidenceId.fromString('evidence-1'))).rejects.toThrow(
      AmbiguousEvidenceVersionException,
    );
  });

  it('enumerates identities in first-registration order and versions in numeric order', async () => {
    const repository = new InMemoryEvidenceRepository();

    await repository.register(createEvidence('evidence-b', 2));
    await repository.register(createEvidence('evidence-a', 1));
    await repository.register(createEvidence('evidence-b', 1));

    expect(
      (await repository.enumerate()).map(
        (evidence) => `${evidence.id.toString()}:${evidence.version.toNumber()}`,
      ),
    ).toEqual(['evidence-b:1', 'evidence-b:2', 'evidence-a:1']);
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
