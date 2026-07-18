import { randomUUID } from 'node:crypto';

import { ServiceLifecycle } from '../common/service-lifecycle';
import { ExecutionSession } from './execution-session';
import type {
  CreateExecutionSessionCommand,
  ExecutionSessionServiceContract,
} from './execution-session.contract';
import { ExecutionSessionId } from './execution-session-id';
import { ExecutionSessionNotFoundError } from './execution-session.errors';
import {
  InMemoryExecutionSessionRepository,
  type IExecutionSessionRepository,
} from './execution-session.repository';
import type { ExecutionSessionSnapshot } from './execution-session.types';

export class ExecutionSessionService
  extends ServiceLifecycle
  implements ExecutionSessionServiceContract
{
  public constructor(
    private readonly repository: IExecutionSessionRepository = new InMemoryExecutionSessionRepository(),
    private readonly createIdentity: () => string = randomUUID,
  ) {
    super('ExecutionSessionService');
  }

  public async createExecutionSession(
    command: CreateExecutionSessionCommand,
  ): Promise<ExecutionSessionSnapshot> {
    const executionSession = ExecutionSession.create({
      id: command.id ?? this.createIdentity(),
      engineeringSessionId: command.engineeringSessionId,
      assignedRole: command.assignedRole,
      assignedAdapter: command.assignedAdapter,
      executionTimestamps: {
        startedAt: command.startedAt,
        completedAt: command.completedAt,
      },
      consumedProjectionVersion: command.consumedProjectionVersion,
      producedArtifacts: command.producedArtifacts ?? [],
      executionOutcome: command.executionOutcome,
    });

    await this.repository.create(executionSession);

    return executionSession.toSnapshot();
  }

  public async getExecutionSession(executionSessionId: string): Promise<ExecutionSessionSnapshot> {
    return (await this.requireExecutionSession(executionSessionId)).toSnapshot();
  }

  public async enumerateExecutionSessions(
    engineeringSessionId?: string,
  ): Promise<readonly ExecutionSessionSnapshot[]> {
    return Object.freeze(
      (await this.repository.enumerate(engineeringSessionId)).map((executionSession) =>
        executionSession.toSnapshot(),
      ),
    );
  }

  private async requireExecutionSession(
    executionSessionId: ExecutionSessionId | string,
  ): Promise<ExecutionSession> {
    const normalizedExecutionSessionId =
      typeof executionSessionId === 'string'
        ? ExecutionSessionId.fromString(executionSessionId)
        : executionSessionId;
    const executionSession = await this.repository.getById(normalizedExecutionSessionId);

    if (executionSession === undefined) {
      throw new ExecutionSessionNotFoundError(normalizedExecutionSessionId.toString());
    }

    return executionSession;
  }
}
