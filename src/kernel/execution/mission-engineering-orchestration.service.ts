import { randomUUID } from 'node:crypto';

import { ServiceLifecycle } from '../common/service-lifecycle';
import { MissionId } from '../mission/mission-id';
import { EngineeringSessionHandoff } from './engineering-session-handoff';
import { EngineeringSessionId } from './engineering-session-id';
import { EngineeringSessionNotFoundError } from './engineering-session.errors';
import type { IEngineeringSessionRepository } from './engineering-session.repository';
import { InMemoryEngineeringSessionRepository } from './engineering-session.repository';
import { MissionEngineeringGroup } from './mission-engineering-group';
import type {
  AssociateEngineeringSessionWithMissionCommand,
  EnumerateEngineeringSessionHandoffsCommand,
  EnumerateMissionEngineeringGroupCommand,
  MissionEngineeringOrchestrationServiceContract,
  RecordEngineeringSessionHandoffCommand,
} from './mission-engineering-orchestration.contract';
import {
  DuplicateEngineeringSessionHandoffError,
  UnauthorizedEngineeringSessionHandoffError,
} from './mission-engineering-orchestration.errors';
import {
  InMemoryEngineeringSessionHandoffRepository,
  InMemoryMissionEngineeringGroupRepository,
  type IEngineeringSessionHandoffRepository,
  type IMissionEngineeringGroupRepository,
} from './mission-engineering-orchestration.repository';
import type {
  EngineeringSessionHandoffSnapshot,
  MissionEngineeringGroupSnapshot,
} from './mission-engineering-orchestration.types';

export class MissionEngineeringOrchestrationService
  extends ServiceLifecycle
  implements MissionEngineeringOrchestrationServiceContract
{
  public constructor(
    private readonly missionEngineeringGroupRepository: IMissionEngineeringGroupRepository =
      new InMemoryMissionEngineeringGroupRepository(),
    private readonly engineeringSessionHandoffRepository: IEngineeringSessionHandoffRepository =
      new InMemoryEngineeringSessionHandoffRepository(),
    private readonly engineeringSessionRepository: IEngineeringSessionRepository =
      new InMemoryEngineeringSessionRepository(),
    private readonly createIdentity: () => string = randomUUID,
    private readonly createTimestamp: () => string = () => new Date().toISOString(),
  ) {
    super('MissionEngineeringOrchestrationService');
  }

  public async associateEngineeringSessionWithMission(
    command: AssociateEngineeringSessionWithMissionCommand,
  ): Promise<MissionEngineeringGroupSnapshot> {
    const missionId = MissionId.fromString(command.missionId);
    const engineeringSessionId = EngineeringSessionId.fromString(command.engineeringSessionId);

    await this.requireEngineeringSession(engineeringSessionId);

    const existingGroup = await this.missionEngineeringGroupRepository.getByMissionId(missionId);
    const group =
      existingGroup ??
      MissionEngineeringGroup.create({
        missionId: missionId.toString(),
        engineeringSessionIds: [],
      });

    group.addEngineeringSession(engineeringSessionId);
    await this.missionEngineeringGroupRepository.save(group);

    return group.toSnapshot();
  }

  public async enumerateMissionEngineeringGroup(
    command: EnumerateMissionEngineeringGroupCommand,
  ): Promise<MissionEngineeringGroupSnapshot> {
    const missionId = MissionId.fromString(command.missionId);
    const group = await this.missionEngineeringGroupRepository.getByMissionId(missionId);

    if (group === undefined) {
      return MissionEngineeringGroup.create({
        missionId: missionId.toString(),
        engineeringSessionIds: [],
      }).toSnapshot();
    }

    return group.toSnapshot();
  }

  public async recordEngineeringSessionHandoff(
    command: RecordEngineeringSessionHandoffCommand,
  ): Promise<EngineeringSessionHandoffSnapshot> {
    const missionId = MissionId.fromString(command.missionId);
    const sourceEngineeringSessionId = EngineeringSessionId.fromString(
      command.sourceEngineeringSessionId,
    );
    const targetEngineeringSessionId = EngineeringSessionId.fromString(
      command.targetEngineeringSessionId,
    );

    await this.requireEngineeringSession(sourceEngineeringSessionId);
    await this.requireEngineeringSession(targetEngineeringSessionId);
    await this.requireAuthorizedHandoffGroup(
      missionId,
      sourceEngineeringSessionId,
      targetEngineeringSessionId,
    );

    if (
      await this.engineeringSessionHandoffRepository.existsForTransfer(
        missionId,
        sourceEngineeringSessionId,
        targetEngineeringSessionId,
      )
    ) {
      throw new DuplicateEngineeringSessionHandoffError(
        missionId.toString(),
        sourceEngineeringSessionId.toString(),
        targetEngineeringSessionId.toString(),
      );
    }

    const handoff = EngineeringSessionHandoff.record({
      id: command.handoffId ?? this.createIdentity(),
      missionId: missionId.toString(),
      sourceEngineeringSessionId: sourceEngineeringSessionId.toString(),
      sourceRoleId: command.sourceRoleId,
      targetEngineeringSessionId: targetEngineeringSessionId.toString(),
      targetRoleId: command.targetRoleId,
      recordedAt: this.createTimestamp(),
    });

    await this.engineeringSessionHandoffRepository.create(handoff);

    return handoff.toSnapshot();
  }

  public async enumerateEngineeringSessionHandoffs(
    command: EnumerateEngineeringSessionHandoffsCommand = {},
  ): Promise<readonly EngineeringSessionHandoffSnapshot[]> {
    return Object.freeze(
      (await this.engineeringSessionHandoffRepository.enumerate(command.missionId)).map((handoff) =>
        handoff.toSnapshot(),
      ),
    );
  }

  private async requireEngineeringSession(engineeringSessionId: EngineeringSessionId): Promise<void> {
    if (!(await this.engineeringSessionRepository.exists(engineeringSessionId))) {
      throw new EngineeringSessionNotFoundError(engineeringSessionId.toString());
    }
  }

  private async requireAuthorizedHandoffGroup(
    missionId: MissionId,
    sourceEngineeringSessionId: EngineeringSessionId,
    targetEngineeringSessionId: EngineeringSessionId,
  ): Promise<void> {
    const group = await this.missionEngineeringGroupRepository.getByMissionId(missionId);

    if (
      group === undefined ||
      !group.hasEngineeringSession(sourceEngineeringSessionId) ||
      !group.hasEngineeringSession(targetEngineeringSessionId)
    ) {
      throw new UnauthorizedEngineeringSessionHandoffError(
        missionId.toString(),
        sourceEngineeringSessionId.toString(),
        targetEngineeringSessionId.toString(),
      );
    }
  }
}
