import { describe, expect, it } from 'vitest';

import { Evidence } from '../../../src/kernel/evidence/evidence.aggregate';
import { InMemoryEvidenceRepository } from '../../../src/kernel/evidence/evidence.repository';
import { Mission } from '../../../src/kernel/mission/mission.aggregate';
import { MissionId } from '../../../src/kernel/mission/mission-id';
import { MissionObjective } from '../../../src/kernel/mission/mission-objective';
import { MissionPlan } from '../../../src/kernel/mission/mission-plan.aggregate';
import { MissionPlanId } from '../../../src/kernel/mission/mission-plan-id';
import type { RevisionMetadata } from '../../../src/kernel/mission/mission-planning.types';
import { InMemoryMissionRepository } from '../../../src/kernel/mission/mission.repository';
import type { DomainEventMetadata } from '../../../src/kernel/mission/mission.types';
import { Task } from '../../../src/kernel/mission/task';
import { TaskId } from '../../../src/kernel/mission/task-id';
import { ProjectionService } from '../../../src/kernel/shared-reality/projection.service';
import { ProjectionVersion } from '../../../src/kernel/shared-reality/projection-version';
import {
  DuplicateProjectionEvidenceReferenceError,
  ProjectionEvidenceNotFoundError,
  ProjectionEvidenceRequiredError,
  ProjectionEvidenceVersionMismatchError,
  ProjectionInactiveMissionError,
  ProjectionMissionNotFoundError,
  ProjectionMissionPlanNotFoundError,
  UnsupportedProjectionEvidenceTypeError,
} from '../../../src/kernel/shared-reality/shared-reality.errors';

const timestamp = '2026-07-12T00:00:00.000Z';

function metadata(eventId: string): DomainEventMetadata {
  return {
    eventId,
    timestamp,
  };
}

function revisionMetadata(reason: string): RevisionMetadata {
  return {
    createdAt: timestamp,
    reason,
    attributes: {},
  };
}

function createMission(): Mission {
  const mission = Mission.create(
    MissionId.fromString('mission-1'),
    MissionObjective.fromString('Implement Shared Reality Foundation'),
    metadata('event-created'),
  );

  mission.pullDomainEvents();
  mission.plan(metadata('event-planned'));
  mission.markReady(metadata('event-ready'));

  return mission;
}

function createMissionPlan(): MissionPlan {
  const missionPlan = MissionPlan.create({
    id: MissionPlanId.fromString('plan-1'),
    missionId: MissionId.fromString('mission-1'),
    revisionMetadata: revisionMetadata('Initial plan'),
  });
  const task = Task.create({
    id: TaskId.fromString('task-1'),
    title: 'Project Evidence',
    description: 'Compute Shared Reality from Evidence',
    parentMissionPlanId: missionPlan.id,
  });

  task.markReady();
  missionPlan.addTask(task, revisionMetadata('Add projection task'));

  return missionPlan;
}

function createEvidence(input: {
  readonly id: string;
  readonly type?: string;
  readonly version?: number;
  readonly source?: string;
}): Evidence {
  return Evidence.register({
    id: input.id,
    type: input.type ?? 'ArchitectureDocument',
    version: input.version ?? 1,
    hash: `sha256:${input.id}`,
    metadata: {
      capturedAt: timestamp,
      attributes: {
        summary: input.id,
      },
    },
    confidenceClassification: 'Verified',
    provenance: {
      source: input.source ?? 'repository',
      acquisitionMethod: 'repository-inspection',
      acquiredAt: timestamp,
      actor: 'builder',
      system: 'nexus',
      verificationStatus: 'Verified',
      verificationStatusSemantics: 'EvidenceVerificationStatus/v1',
    },
  });
}

async function createReadyProjectionService(): Promise<{
  readonly service: ProjectionService;
  readonly missionRepository: InMemoryMissionRepository;
  readonly evidenceRepository: InMemoryEvidenceRepository;
}> {
  const missionRepository = new InMemoryMissionRepository();
  const evidenceRepository = new InMemoryEvidenceRepository();

  await missionRepository.save(createMission());
  await missionRepository.saveMissionPlan(createMissionPlan());
  await evidenceRepository.register(createEvidence({ id: 'evidence-b', type: 'TestResult' }));
  await evidenceRepository.register(
    createEvidence({ id: 'evidence-a', type: 'ArchitectureDocument' }),
  );

  return {
    service: new ProjectionService(missionRepository, evidenceRepository),
    missionRepository,
    evidenceRepository,
  };
}

describe('ProjectionService', () => {
  it('computes an immutable Shared Reality projection from Mission, MissionPlan, and Evidence', async () => {
    const { service } = await createReadyProjectionService();

    const result = await service.project({ missionId: 'mission-1' });
    const snapshot = result.toSnapshot();

    expect(snapshot.activeMission).toMatchObject({
      id: 'mission-1',
      status: 'Ready',
    });
    expect(snapshot.missionPlan).toMatchObject({
      id: 'plan-1',
      missionId: 'mission-1',
      revisionNumber: 2,
    });
    expect(snapshot.missionExecutionState).toEqual({
      missionStatus: 'Ready',
      tasks: [
        {
          id: 'task-1',
          status: 'Ready',
        },
      ],
    });
    expect(snapshot.evidenceReferences.map((reference) => reference.id)).toEqual([
      'evidence-a',
      'evidence-b',
    ]);
    expect(snapshot.context.evidenceByType.ArchitectureDocument?.map((reference) => reference.id)).toEqual([
      'evidence-a',
    ]);
    expect(snapshot.context.evidenceByType.TestResult?.map((reference) => reference.id)).toEqual([
      'evidence-b',
    ]);
    expect(snapshot.projectionMetadata).toEqual({
      algorithm: 'nexus-shared-reality-foundation-v1',
      evidenceCount: 2,
      missionPlanRevision: 2,
    });
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.evidenceReferences)).toBe(true);
    expect(Object.isFrozen(result.context.evidenceByType)).toBe(true);
    expect(Object.isFrozen(result.missionPlan.tasks)).toBe(true);
  });

  it('produces equivalent ProjectionVersions for equivalent projection inputs', async () => {
    const first = await createReadyProjectionService();
    const second = await createReadyProjectionService();

    const firstResult = await first.service.project({ missionId: 'mission-1' });
    const secondResult = await second.service.project({ missionId: 'mission-1' });

    expect(firstResult.projectionVersion.equals(secondResult.projectionVersion)).toBe(true);
    expect(firstResult.toSnapshot()).toEqual(secondResult.toSnapshot());
  });

  it('supports deterministic explicit Evidence retrieval and version traceability', async () => {
    const { service } = await createReadyProjectionService();

    const result = await service.project({
      missionId: 'mission-1',
      evidence: [
        {
          id: 'evidence-b',
          version: 1,
        },
      ],
    });

    expect(result.evidenceReferences).toEqual([
      {
        id: 'evidence-b',
        type: 'TestResult',
        version: 1,
        source: 'repository',
        hash: 'sha256:evidence-b',
      },
    ]);
    expect(result.projectionMetadata.evidenceCount).toBe(1);
  });

  it('rejects missing Mission, missing MissionPlan, and missing Evidence deterministically', async () => {
    const missionRepository = new InMemoryMissionRepository();
    const evidenceRepository = new InMemoryEvidenceRepository();
    const service = new ProjectionService(missionRepository, evidenceRepository);

    await expect(service.project({ missionId: 'missing-mission' })).rejects.toThrow(
      ProjectionMissionNotFoundError,
    );

    await missionRepository.save(createMission());
    await evidenceRepository.register(createEvidence({ id: 'evidence-a' }));

    await expect(service.project({ missionId: 'mission-1' })).rejects.toThrow(
      ProjectionMissionPlanNotFoundError,
    );

    await missionRepository.saveMissionPlan(createMissionPlan());
    await expect(
      service.project({
        missionId: 'mission-1',
        evidence: [
          {
            id: 'missing-evidence',
          },
        ],
      }),
    ).rejects.toThrow(ProjectionEvidenceNotFoundError);
  });

  it('rejects empty Evidence sets, duplicate references, and inconsistent versions', async () => {
    const missionRepository = new InMemoryMissionRepository();
    const evidenceRepository = new InMemoryEvidenceRepository();
    const service = new ProjectionService(missionRepository, evidenceRepository);

    await missionRepository.save(createMission());
    await missionRepository.saveMissionPlan(createMissionPlan());

    await expect(service.project({ missionId: 'mission-1' })).rejects.toThrow(
      ProjectionEvidenceRequiredError,
    );

    await evidenceRepository.register(createEvidence({ id: 'evidence-a', version: 1 }));

    await expect(
      service.project({
        missionId: 'mission-1',
        evidence: [{ id: 'evidence-a' }, { id: 'evidence-a' }],
      }),
    ).rejects.toThrow(DuplicateProjectionEvidenceReferenceError);
    await expect(
      service.project({
        missionId: 'mission-1',
        evidence: [
          {
            id: 'evidence-a',
            version: 2,
          },
        ],
      }),
    ).rejects.toThrow(ProjectionEvidenceVersionMismatchError);
  });

  it('rejects terminal Missions because Shared Reality projects active Missions', async () => {
    const missionRepository = new InMemoryMissionRepository();
    const evidenceRepository = new InMemoryEvidenceRepository();
    const mission = createMission();
    const service = new ProjectionService(missionRepository, evidenceRepository);

    mission.cancel(metadata('event-cancelled'));
    await missionRepository.save(mission);

    await expect(service.project({ missionId: 'mission-1' })).rejects.toThrow(
      ProjectionInactiveMissionError,
    );
  });

  it('rejects unsupported Evidence exposed by a repository contract', async () => {
    const missionRepository = new InMemoryMissionRepository();
    const evidence = createEvidence({ id: 'evidence-a' });
    const unsupportedEvidence = Object.create(evidence, {
      type: {
        get() {
          return {
            toString: () => 'UnsupportedEvidence',
          };
        },
      },
    }) as Evidence;
    const service = new ProjectionService(missionRepository, {
      getById: async () => unsupportedEvidence,
      enumerate: async () => [unsupportedEvidence],
    });

    await missionRepository.save(createMission());
    await missionRepository.saveMissionPlan(createMissionPlan());

    await expect(service.project({ missionId: 'mission-1' })).rejects.toThrow(
      UnsupportedProjectionEvidenceTypeError,
    );
  });
});

describe('ProjectionVersion', () => {
  it('is immutable, validates input, and generates deterministic identifiers', () => {
    const first = ProjectionVersion.generate({ b: 2, a: 1 });
    const second = ProjectionVersion.generate({ a: 1, b: 2 });

    expect(first.equals(second)).toBe(true);
    expect(Object.isFrozen(first)).toBe(true);
    expect(() => ProjectionVersion.fromString('')).toThrow();
  });
});
