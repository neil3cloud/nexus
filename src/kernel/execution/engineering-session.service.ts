import { randomUUID } from 'node:crypto';

import { ServiceLifecycle } from '../common/service-lifecycle';
import { EngineeringSession } from './engineering-session';
import type {
  CloseEngineeringSessionCommand,
  CreateEngineeringSessionCommand,
  EngineeringSessionServiceContract,
} from './engineering-session.contract';
import { EngineeringSessionId } from './engineering-session-id';
import {
  EngineeringSessionNotFoundError,
} from './engineering-session.errors';
import {
  InMemoryEngineeringSessionRepository,
  type IEngineeringSessionRepository,
} from './engineering-session.repository';
import type { EngineeringSessionSnapshot } from './engineering-session.types';

export class EngineeringSessionService
  extends ServiceLifecycle
  implements EngineeringSessionServiceContract
{
  public constructor(
    private readonly repository: IEngineeringSessionRepository = new InMemoryEngineeringSessionRepository(),
    private readonly createIdentity: () => string = randomUUID,
    private readonly createTimestamp: () => string = () => new Date().toISOString(),
  ) {
    super('EngineeringSessionService');
  }

  public async createEngineeringSession(
    command: CreateEngineeringSessionCommand,
  ): Promise<EngineeringSessionSnapshot> {
    const createdAt = this.createTimestamp();
    const engineeringSession = EngineeringSession.create({
      id: command.id ?? this.createIdentity(),
      engineeringRuntimeContextReference: command.engineeringRuntimeContextReference,
      activeEngineeringWorkflowReference: command.activeEngineeringWorkflowReference,
      participatingRoleIds: command.participatingRoleIds,
      workflowState: command.workflowState,
      timeline: {
        createdAt,
      },
      diagnostics: command.diagnostics ?? [],
      collaborationMetadata: command.collaborationMetadata ?? {},
    });

    await this.repository.create(engineeringSession);

    return engineeringSession.toSnapshot();
  }

  public async closeEngineeringSession(
    command: CloseEngineeringSessionCommand,
  ): Promise<EngineeringSessionSnapshot> {
    const engineeringSession = await this.requireEngineeringSession(command.engineeringSessionId);

    engineeringSession.close(this.createTimestamp());
    await this.repository.save(engineeringSession);

    return engineeringSession.toSnapshot();
  }

  public async getEngineeringSession(engineeringSessionId: string): Promise<EngineeringSessionSnapshot> {
    return (await this.requireEngineeringSession(engineeringSessionId)).toSnapshot();
  }

  public async enumerateEngineeringSessions(): Promise<readonly EngineeringSessionSnapshot[]> {
    return Object.freeze(
      (await this.repository.enumerate()).map((engineeringSession) =>
        engineeringSession.toSnapshot(),
      ),
    );
  }

  private async requireEngineeringSession(
    engineeringSessionId: EngineeringSessionId | string,
  ): Promise<EngineeringSession> {
    const normalizedEngineeringSessionId =
      typeof engineeringSessionId === 'string'
        ? EngineeringSessionId.fromString(engineeringSessionId)
        : engineeringSessionId;
    const engineeringSession = await this.repository.getById(normalizedEngineeringSessionId);

    if (engineeringSession === undefined) {
      throw new EngineeringSessionNotFoundError(normalizedEngineeringSessionId.toString());
    }

    return engineeringSession;
  }
}
