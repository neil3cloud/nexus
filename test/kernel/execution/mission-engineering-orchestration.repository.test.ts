import { describe, expect, it } from 'vitest';

import { EngineeringSessionHandoff } from '../../../src/kernel/execution/engineering-session-handoff';
import { MissionEngineeringGroup } from '../../../src/kernel/execution/mission-engineering-group';
import {
  AmbiguousMissionEngineeringGroupAssociationError,
  DuplicateEngineeringSessionHandoffError,
  DuplicateMissionEngineeringGroupAssociationError,
  MissingMissionEngineeringGroupAssociationError,
} from '../../../src/kernel/execution/mission-engineering-orchestration.errors';
import {
  InMemoryEngineeringSessionHandoffRepository,
  InMemoryMissionEngineeringGroupRepository,
} from '../../../src/kernel/execution/mission-engineering-orchestration.repository';

describe('MissionEngineeringGroup repositories', () => {
  it('persists MissionEngineeringGroups and enumerates associations deterministically', async () => {
    const repository = new InMemoryMissionEngineeringGroupRepository();
    const groupB = MissionEngineeringGroup.create({
      missionId: 'mission-b',
      engineeringSessionIds: ['engineering-session-b', 'engineering-session-a'],
    });
    const groupA = MissionEngineeringGroup.create({
      missionId: 'mission-a',
      engineeringSessionIds: ['engineering-session-c'],
    });

    await repository.save(groupB);
    await repository.save(groupA);

    expect((await repository.getByMissionId('mission-b'))?.toSnapshot()).toEqual({
      missionId: 'mission-b',
      engineeringSessionIds: ['engineering-session-a', 'engineering-session-b'],
    });
    expect((await repository.enumerate()).map((group) => group.missionId.toString())).toEqual([
      'mission-a',
      'mission-b',
    ]);
  });

  it('rejects duplicate MissionEngineeringGroup EngineeringSession associations', () => {
    const group = MissionEngineeringGroup.create({
      missionId: 'mission-1',
      engineeringSessionIds: ['engineering-session-1'],
    });

    expect(() => group.addEngineeringSession('engineering-session-1')).toThrow(
      DuplicateMissionEngineeringGroupAssociationError,
    );
  });

  it('resolves EngineeringSession Mission association without mutating groups', async () => {
    const repository = new InMemoryMissionEngineeringGroupRepository();
    const group = MissionEngineeringGroup.create({
      missionId: 'mission-1',
      engineeringSessionIds: ['engineering-session-1'],
    });

    await repository.save(group);

    await expect(
      repository.getMissionIdByEngineeringSessionId('engineering-session-1'),
    ).resolves.toMatchObject({
      value: 'mission-1',
    });
    await expect(repository.enumerate()).resolves.toEqual([group]);
  });

  it('fails closed when EngineeringSession Mission association is missing or ambiguous', async () => {
    const repository = new InMemoryMissionEngineeringGroupRepository();

    await expect(
      repository.getMissionIdByEngineeringSessionId('engineering-session-1'),
    ).rejects.toThrow(MissingMissionEngineeringGroupAssociationError);

    await repository.save(
      MissionEngineeringGroup.create({
        missionId: 'mission-1',
        engineeringSessionIds: ['engineering-session-1'],
      }),
    );
    await repository.save(
      MissionEngineeringGroup.create({
        missionId: 'mission-2',
        engineeringSessionIds: ['engineering-session-1'],
      }),
    );

    await expect(
      repository.getMissionIdByEngineeringSessionId('engineering-session-1'),
    ).rejects.toThrow(AmbiguousMissionEngineeringGroupAssociationError);
  });
});

describe('EngineeringSessionHandoff repositories', () => {
  it('persists EngineeringSessionHandoffs and enumerates visibility deterministically', async () => {
    const repository = new InMemoryEngineeringSessionHandoffRepository();
    const handoffB = createHandoff('handoff-b', 'mission-1', 'engineering-session-b');
    const handoffA = createHandoff('handoff-a', 'mission-1', 'engineering-session-a');
    const handoffC = createHandoff('handoff-c', 'mission-2', 'engineering-session-c');

    await repository.create(handoffB);
    await repository.create(handoffA);
    await repository.create(handoffC);

    expect(await repository.existsForTransfer('mission-1', 'engineering-session-a', 'target')).toBe(
      true,
    );
    expect((await repository.getById('handoff-a'))?.toSnapshot()).toMatchObject({
      id: 'handoff-a',
      missionId: 'mission-1',
      status: 'Recorded',
    });
    expect((await repository.enumerate('mission-1')).map((handoff) => handoff.id)).toEqual([
      'handoff-a',
      'handoff-b',
    ]);
    expect((await repository.enumerate()).map((handoff) => handoff.id)).toEqual([
      'handoff-a',
      'handoff-b',
      'handoff-c',
    ]);
  });

  it('rejects duplicate EngineeringSessionHandoff identities', async () => {
    const repository = new InMemoryEngineeringSessionHandoffRepository();

    await repository.create(createHandoff('handoff-1', 'mission-1', 'engineering-session-a'));

    await expect(
      repository.create(createHandoff('handoff-1', 'mission-1', 'engineering-session-b')),
    ).rejects.toThrow(DuplicateEngineeringSessionHandoffError);
  });
});

function createHandoff(
  id: string,
  missionId: string,
  sourceEngineeringSessionId: string,
): EngineeringSessionHandoff {
  return EngineeringSessionHandoff.record({
    id,
    missionId,
    sourceEngineeringSessionId,
    sourceRoleId: 'builder',
    targetEngineeringSessionId: 'target',
    targetRoleId: 'reviewer',
    recordedAt: '2026-07-15T00:00:00.000Z',
  });
}
