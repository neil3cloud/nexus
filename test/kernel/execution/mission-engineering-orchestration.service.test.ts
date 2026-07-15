import { describe, expect, it } from 'vitest';

import { EngineeringSession } from '../../../src/kernel/execution/engineering-session';
import { EngineeringSessionNotFoundError } from '../../../src/kernel/execution/engineering-session.errors';
import { InMemoryEngineeringSessionRepository } from '../../../src/kernel/execution/engineering-session.repository';
import { MissionEngineeringOrchestrationService } from '../../../src/kernel/execution/mission-engineering-orchestration.service';
import {
  DuplicateEngineeringSessionHandoffError,
  UnauthorizedEngineeringSessionHandoffError,
} from '../../../src/kernel/execution/mission-engineering-orchestration.errors';
import {
  InMemoryEngineeringSessionHandoffRepository,
  InMemoryMissionEngineeringGroupRepository,
} from '../../../src/kernel/execution/mission-engineering-orchestration.repository';
import { WorkflowChain } from '../../../src/kernel/execution/workflow-chain';

const workflowChain = WorkflowChain.create({
  id: 'workflow-chain-1',
  steps: [{ roleId: 'builder' }, { roleId: 'reviewer' }],
});

describe('MissionEngineeringOrchestrationService', () => {
  it('associates multiple EngineeringSessions with one MissionEngineeringGroup deterministically', async () => {
    const harness = await createHarness(['engineering-session-b', 'engineering-session-a']);

    await expect(
      harness.service.associateEngineeringSessionWithMission({
        missionId: 'mission-1',
        engineeringSessionId: 'engineering-session-b',
      }),
    ).resolves.toEqual({
      missionId: 'mission-1',
      engineeringSessionIds: ['engineering-session-b'],
    });
    await expect(
      harness.service.associateEngineeringSessionWithMission({
        missionId: 'mission-1',
        engineeringSessionId: 'engineering-session-a',
      }),
    ).resolves.toEqual({
      missionId: 'mission-1',
      engineeringSessionIds: ['engineering-session-a', 'engineering-session-b'],
    });
    await expect(
      harness.service.enumerateMissionEngineeringGroup({ missionId: 'mission-1' }),
    ).resolves.toEqual({
      missionId: 'mission-1',
      engineeringSessionIds: ['engineering-session-a', 'engineering-session-b'],
    });
  });

  it('records EngineeringSessionHandoffs between participating EngineeringSessions with deterministic lifecycle', async () => {
    const harness = await createHarness(['engineering-session-builder', 'engineering-session-reviewer']);

    await associatePair(harness.service);

    const handoff = await harness.service.recordEngineeringSessionHandoff({
      handoffId: 'handoff-1',
      missionId: 'mission-1',
      sourceEngineeringSessionId: 'engineering-session-builder',
      sourceRoleId: 'builder',
      targetEngineeringSessionId: 'engineering-session-reviewer',
      targetRoleId: 'reviewer',
    });

    expect(handoff).toEqual({
      id: 'handoff-1',
      missionId: 'mission-1',
      sourceEngineeringSessionId: 'engineering-session-builder',
      sourceRoleId: 'builder',
      targetEngineeringSessionId: 'engineering-session-reviewer',
      targetRoleId: 'reviewer',
      recordedAt: '2026-07-15T00:00:00.000Z',
      status: 'Recorded',
    });
    await expect(
      harness.service.enumerateEngineeringSessionHandoffs({ missionId: 'mission-1' }),
    ).resolves.toEqual([handoff]);
  });

  it('rejects invalid and unauthorized Handoff attempts with deterministic diagnostics', async () => {
    const harness = await createHarness([
      'engineering-session-builder',
      'engineering-session-reviewer',
      'engineering-session-outsider',
    ]);

    await expect(
      harness.service.associateEngineeringSessionWithMission({
        missionId: 'mission-1',
        engineeringSessionId: 'missing-session',
      }),
    ).rejects.toThrow(EngineeringSessionNotFoundError);

    await harness.service.associateEngineeringSessionWithMission({
      missionId: 'mission-1',
      engineeringSessionId: 'engineering-session-builder',
    });
    await expect(
      harness.service.recordEngineeringSessionHandoff({
        handoffId: 'handoff-unauthorized',
        missionId: 'mission-1',
        sourceEngineeringSessionId: 'engineering-session-builder',
        sourceRoleId: 'builder',
        targetEngineeringSessionId: 'engineering-session-outsider',
        targetRoleId: 'reviewer',
      }),
    ).rejects.toThrow(UnauthorizedEngineeringSessionHandoffError);

    await harness.service.associateEngineeringSessionWithMission({
      missionId: 'mission-1',
      engineeringSessionId: 'engineering-session-reviewer',
    });
    await harness.service.recordEngineeringSessionHandoff({
      handoffId: 'handoff-1',
      missionId: 'mission-1',
      sourceEngineeringSessionId: 'engineering-session-builder',
      sourceRoleId: 'builder',
      targetEngineeringSessionId: 'engineering-session-reviewer',
      targetRoleId: 'reviewer',
    });
    await expect(
      harness.service.recordEngineeringSessionHandoff({
        handoffId: 'handoff-2',
        missionId: 'mission-1',
        sourceEngineeringSessionId: 'engineering-session-builder',
        sourceRoleId: 'builder',
        targetEngineeringSessionId: 'engineering-session-reviewer',
        targetRoleId: 'reviewer',
      }),
    ).rejects.toThrow(DuplicateEngineeringSessionHandoffError);
  });

  it('preserves EngineeringSession runtime isolation during grouping, enumeration, and Handoff recording', async () => {
    const harness = await createHarness(['engineering-session-builder', 'engineering-session-reviewer']);
    const beforeBuilder = (await harness.sessionRepository.getById('engineering-session-builder'))?.toSnapshot();
    const beforeReviewer = (await harness.sessionRepository.getById('engineering-session-reviewer'))?.toSnapshot();

    await associatePair(harness.service);
    await harness.service.enumerateMissionEngineeringGroup({ missionId: 'mission-1' });
    await harness.service.recordEngineeringSessionHandoff({
      handoffId: 'handoff-1',
      missionId: 'mission-1',
      sourceEngineeringSessionId: 'engineering-session-builder',
      sourceRoleId: 'builder',
      targetEngineeringSessionId: 'engineering-session-reviewer',
      targetRoleId: 'reviewer',
    });

    expect((await harness.sessionRepository.getById('engineering-session-builder'))?.toSnapshot()).toEqual(
      beforeBuilder,
    );
    expect((await harness.sessionRepository.getById('engineering-session-reviewer'))?.toSnapshot()).toEqual(
      beforeReviewer,
    );
  });
});

interface Harness {
  readonly service: MissionEngineeringOrchestrationService;
  readonly sessionRepository: InMemoryEngineeringSessionRepository;
}

async function createHarness(engineeringSessionIds: readonly string[]): Promise<Harness> {
  const sessionRepository = new InMemoryEngineeringSessionRepository();

  for (const engineeringSessionId of engineeringSessionIds) {
    await sessionRepository.create(createSession(engineeringSessionId));
  }

  return {
    service: new MissionEngineeringOrchestrationService(
      new InMemoryMissionEngineeringGroupRepository(),
      new InMemoryEngineeringSessionHandoffRepository(),
      sessionRepository,
      () => 'generated-handoff-id',
      () => '2026-07-15T00:00:00.000Z',
    ),
    sessionRepository,
  };
}

function createSession(id: string): EngineeringSession {
  return EngineeringSession.create(
    {
      id,
      engineeringRuntimeContextReference: `runtime-context-${id}`,
      activeEngineeringWorkflowReference: 'builder-workflow',
      workflowChainId: 'workflow-chain-1',
      currentWorkflowStepId: '0',
      participatingRoleIds: ['builder', 'reviewer'],
      workflowState: 'active',
      timeline: {
        createdAt: '2026-07-15T00:00:00.000Z',
      },
      diagnostics: [
        {
          code: `diagnostic-${id}`,
          message: `Diagnostic for ${id}.`,
          recordedAt: '2026-07-15T00:00:00.000Z',
        },
      ],
      collaborationMetadata: {
        owner: id,
      },
    },
    workflowChain,
  );
}

async function associatePair(service: MissionEngineeringOrchestrationService): Promise<void> {
  await service.associateEngineeringSessionWithMission({
    missionId: 'mission-1',
    engineeringSessionId: 'engineering-session-builder',
  });
  await service.associateEngineeringSessionWithMission({
    missionId: 'mission-1',
    engineeringSessionId: 'engineering-session-reviewer',
  });
}
