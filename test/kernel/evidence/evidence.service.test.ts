import { describe, expect, it } from 'vitest';

import { EventBus } from '../../../src/kernel/events/event-bus';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';
import type { RegisterEvidenceRequest } from '../../../src/kernel/evidence/evidence.contract';
import { Evidence } from '../../../src/kernel/evidence/evidence.aggregate';
import {
  AmbiguousEvidenceVersionException,
  DuplicateEvidenceException,
  EvidenceEventPublisherUnavailableError,
  EvidenceNotFoundException,
  EvidenceVersionNotFoundException,
  InvalidEvidenceException,
} from '../../../src/kernel/evidence/evidence.errors';
import { EvidenceId } from '../../../src/kernel/evidence/evidence-id';
import { EvidenceVersion } from '../../../src/kernel/evidence/evidence-version';
import { InMemoryEvidenceRepository } from '../../../src/kernel/evidence/evidence.repository';
import { EvidenceService } from '../../../src/kernel/evidence/evidence.service';

class TestLogger implements KernelLogger {
  public info(): void {}

  public error(): void {}
}

function sequence(values: readonly string[]): () => string {
  let index = 0;

  return () => {
    const value = values[index];

    if (value === undefined) {
      throw new Error('Sequence exhausted.');
    }

    index += 1;

    return value;
  };
}

function evidenceRequest(id = 'evidence-1', version = 1): RegisterEvidenceRequest {
  return {
    id,
    missionId: 'mission-1',
    type: 'TestResult',
    version,
    hash: `sha256:${id}:${version}`,
    metadata: {
      capturedAt: '2026-07-12T00:00:00.000Z',
      attributes: {
        suite: 'unit',
      },
    },
    confidenceClassification: 'Verified',
    provenance: {
      source: 'vitest',
      acquisitionMethod: 'test-run',
      acquiredAt: '2026-07-12T00:00:00.000Z',
      actor: 'builder',
      system: 'nexus',
      verificationStatus: 'Verified',
      verificationStatusSemantics: 'EvidenceVerificationStatus/v1',
    },
  };
}

describe('EvidenceService', () => {
  it('coordinates Evidence registration through an injected repository', async () => {
    const repository = new InMemoryEvidenceRepository();
    const service = new EvidenceService(
      repository,
      new EventBus(new TestLogger()),
      sequence(['event-evidence-captured']),
      () => '2026-07-12T00:00:00.000Z',
    );

    const evidence = await service.registerEvidence(evidenceRequest());

    expect(evidence.id.toString()).toBe('evidence-1');
    await expect(repository.exists(evidence.id)).resolves.toBe(true);
  });

  it('registers distinct versions while rejecting exact-pair duplicates', async () => {
    const service = new EvidenceService(
      new InMemoryEvidenceRepository(),
      new EventBus(new TestLogger()),
      sequence(['event-captured-1', 'event-captured-2']),
      () => '2026-07-12T00:00:00.000Z',
    );

    await service.registerEvidence(evidenceRequest('evidence-1', 1));
    await expect(service.registerEvidence(evidenceRequest('evidence-1', 2))).resolves.toMatchObject({
      version: EvidenceVersion.fromNumber(2),
    });
    await expect(service.registerEvidence(evidenceRequest('evidence-1', 2))).rejects.toThrow(
      DuplicateEvidenceException,
    );
  });

  it('validates exact Evidence pairs and permits distinct versions', async () => {
    const repository = new InMemoryEvidenceRepository();
    const service = new EvidenceService(
      repository,
      new EventBus(new TestLogger()),
      sequence(['event-captured-1']),
      () => '2026-07-12T00:00:00.000Z',
    );

    await service.registerEvidence(evidenceRequest('evidence-1', 1));

    await expect(service.validateEvidence(Evidence.register(evidenceRequest('evidence-1', 2)))).resolves.toBeUndefined();
    await expect(service.validateEvidence(Evidence.register(evidenceRequest('evidence-1', 1)))).rejects.toThrow(
      DuplicateEvidenceException,
    );
  });

  it('retrieves exact Evidence versions with service-layer missing identity translation', async () => {
    const service = new EvidenceService(
      new InMemoryEvidenceRepository(),
      new EventBus(new TestLogger()),
      sequence(['event-captured-1']),
      () => '2026-07-12T00:00:00.000Z',
    );

    await service.registerEvidence(evidenceRequest('evidence-1', 1));

    await expect(service.retrieveEvidenceVersion('evidence-1', 1)).resolves.toMatchObject({
      id: EvidenceId.fromString('evidence-1'),
      version: EvidenceVersion.fromNumber(1),
    });
    await expect(service.retrieveEvidenceVersion('missing-evidence', 1)).rejects.toThrow(
      EvidenceNotFoundException,
    );
    await expect(service.retrieveEvidenceVersion('evidence-1', 2)).rejects.toThrow(
      EvidenceVersionNotFoundException,
    );
  });

  it('preserves identity-only retrieval behavior except for multi-version ambiguity', async () => {
    const service = new EvidenceService(
      new InMemoryEvidenceRepository(),
      new EventBus(new TestLogger()),
      sequence(['event-captured-1', 'event-captured-2']),
      () => '2026-07-12T00:00:00.000Z',
    );

    await service.registerEvidence(evidenceRequest('evidence-1', 1));
    await expect(service.retrieveEvidence('evidence-1')).resolves.toMatchObject({
      version: EvidenceVersion.fromNumber(1),
    });
    await service.registerEvidence(evidenceRequest('evidence-1', 2));
    await expect(service.retrieveEvidence('evidence-1')).rejects.toThrow(
      AmbiguousEvidenceVersionException,
    );
  });

  it('validates duplicate identifiers before registration', async () => {
    const service = new EvidenceService(
      new InMemoryEvidenceRepository(),
      new EventBus(new TestLogger()),
      sequence(['event-evidence-captured']),
      () => '2026-07-12T00:00:00.000Z',
    );

    await service.registerEvidence(evidenceRequest());

    await expect(service.registerEvidence(evidenceRequest())).rejects.toThrow(
      DuplicateEvidenceException,
    );
  });

  it('retrieves registered Evidence and rejects missing Evidence', async () => {
    const service = new EvidenceService(
      new InMemoryEvidenceRepository(),
      new EventBus(new TestLogger()),
      sequence(['event-evidence-captured']),
      () => '2026-07-12T00:00:00.000Z',
    );

    await service.registerEvidence(evidenceRequest());

    await expect(service.retrieveEvidence('evidence-1')).resolves.toMatchObject({
      id: EvidenceId.fromString('evidence-1'),
    });
    await expect(service.retrieveEvidence('missing-evidence')).rejects.toThrow(
      EvidenceNotFoundException,
    );
  });

  it('enumerates Evidence deterministically in registration order', async () => {
    const service = new EvidenceService(
      new InMemoryEvidenceRepository(),
      new EventBus(new TestLogger()),
      sequence(['event-captured-1', 'event-captured-2']),
      () => '2026-07-12T00:00:00.000Z',
    );

    await service.registerEvidence(evidenceRequest('evidence-1'));
    await service.registerEvidence(evidenceRequest('evidence-2'));

    expect((await service.enumerateEvidence()).map((evidence) => evidence.id.toString())).toEqual([
      'evidence-1',
      'evidence-2',
    ]);
  });

  it('surfaces aggregate validation errors without repository side effects', async () => {
    const repository = new InMemoryEvidenceRepository();
    const service = new EvidenceService(
      repository,
      new EventBus(new TestLogger()),
      sequence(['event-evidence-captured']),
      () => '2026-07-12T00:00:00.000Z',
    );

    await expect(
      service.registerEvidence({
        ...evidenceRequest(),
        type: 'SearchIndex',
      }),
    ).rejects.toThrow(InvalidEvidenceException);
    await expect(repository.enumerate()).resolves.toEqual([]);
  });

  it('publishes EvidenceCaptured after registration and supports Mission-independent Evidence', async () => {
    const eventBus = new EventBus(new TestLogger());
    const service = new EvidenceService(
      new InMemoryEvidenceRepository(),
      eventBus,
      sequence(['event-with-mission', 'event-without-mission']),
      () => '2026-07-12T00:00:00.000Z',
    );

    await service.registerEvidence(evidenceRequest());
    await service.registerEvidence({
      id: 'evidence-2',
      type: 'TestResult',
      version: 1,
      hash: 'sha256:evidence-2',
      metadata: {
        capturedAt: '2026-07-12T00:00:00.000Z',
        attributes: {
          suite: 'unit',
        },
      },
      confidenceClassification: 'Verified',
      provenance: {
        source: 'vitest',
        acquisitionMethod: 'test-run',
        acquiredAt: '2026-07-12T00:00:00.000Z',
        actor: 'builder',
        system: 'nexus',
        verificationStatus: 'Verified',
        verificationStatusSemantics: 'EvidenceVerificationStatus/v1',
      },
    });

    expect(eventBus.replay('mission-1').map((event) => event.eventType)).toEqual([
      'EvidenceCaptured',
    ]);
    expect(eventBus.replay('mission-1')[0]).toMatchObject({
      eventId: 'event-with-mission',
      missionId: 'mission-1',
      eventType: 'EvidenceCaptured',
      attribution: {
        missionId: 'mission-1',
      },
      payload: {
        evidenceId: 'evidence-1',
      },
    });
    expect(eventBus.replay('missing-mission')).toEqual([]);
  });

  it('requires an EventBusContract before registering Evidence', async () => {
    const repository = new InMemoryEvidenceRepository();
    const service = new EvidenceService(repository);

    await expect(service.registerEvidence(evidenceRequest())).rejects.toThrow(
      EvidenceEventPublisherUnavailableError,
    );
    await expect(repository.enumerate()).resolves.toEqual([]);
  });
});
