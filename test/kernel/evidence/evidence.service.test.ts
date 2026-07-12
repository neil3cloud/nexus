import { describe, expect, it } from 'vitest';

import type { RegisterEvidenceRequest } from '../../../src/kernel/evidence/evidence.contract';
import {
  DuplicateEvidenceException,
  EvidenceNotFoundException,
  InvalidEvidenceException,
} from '../../../src/kernel/evidence/evidence.errors';
import { EvidenceId } from '../../../src/kernel/evidence/evidence-id';
import { InMemoryEvidenceRepository } from '../../../src/kernel/evidence/evidence.repository';
import { EvidenceService } from '../../../src/kernel/evidence/evidence.service';

function evidenceRequest(id = 'evidence-1'): RegisterEvidenceRequest {
  return {
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
  };
}

describe('EvidenceService', () => {
  it('coordinates Evidence registration through an injected repository', async () => {
    const repository = new InMemoryEvidenceRepository();
    const service = new EvidenceService(repository);

    const evidence = await service.registerEvidence(evidenceRequest());

    expect(evidence.id.toString()).toBe('evidence-1');
    await expect(repository.exists(evidence.id)).resolves.toBe(true);
  });

  it('validates duplicate identifiers before registration', async () => {
    const service = new EvidenceService(new InMemoryEvidenceRepository());

    await service.registerEvidence(evidenceRequest());

    await expect(service.registerEvidence(evidenceRequest())).rejects.toThrow(
      DuplicateEvidenceException,
    );
  });

  it('retrieves registered Evidence and rejects missing Evidence', async () => {
    const service = new EvidenceService(new InMemoryEvidenceRepository());

    await service.registerEvidence(evidenceRequest());

    await expect(service.retrieveEvidence('evidence-1')).resolves.toMatchObject({
      id: EvidenceId.fromString('evidence-1'),
    });
    await expect(service.retrieveEvidence('missing-evidence')).rejects.toThrow(
      EvidenceNotFoundException,
    );
  });

  it('enumerates Evidence deterministically in registration order', async () => {
    const service = new EvidenceService(new InMemoryEvidenceRepository());

    await service.registerEvidence(evidenceRequest('evidence-1'));
    await service.registerEvidence(evidenceRequest('evidence-2'));

    expect((await service.enumerateEvidence()).map((evidence) => evidence.id.toString())).toEqual([
      'evidence-1',
      'evidence-2',
    ]);
  });

  it('surfaces aggregate validation errors without repository side effects', async () => {
    const repository = new InMemoryEvidenceRepository();
    const service = new EvidenceService(repository);

    await expect(
      service.registerEvidence({
        ...evidenceRequest(),
        type: 'SearchIndex',
      }),
    ).rejects.toThrow(InvalidEvidenceException);
    await expect(repository.enumerate()).resolves.toEqual([]);
  });
});
