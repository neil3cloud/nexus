import { execFileSync } from 'node:child_process';

import { describe, expect, it } from 'vitest';

import type { EventBusEvent } from '../../../src/kernel/common/event-bus-contract';
import { createKernelServices } from '../../../src/kernel/common/create-kernel-services';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';
import { EventBus } from '../../../src/kernel/events/event-bus';
import { EngineeringSessionStateProjection } from '../../../src/kernel/execution/engineering-session-state-projection';
import {
  InMemoryEngineeringSessionStateProjectionRepository,
  type IEngineeringSessionStateProjectionRepository,
} from '../../../src/kernel/execution/engineering-session-state-projection.repository';
import { EngineeringSessionStateProjectionService } from '../../../src/kernel/execution/engineering-session-state-projection.service';

class TestLogger implements KernelLogger {
  public readonly errors: Readonly<Record<string, string>>[] = [];

  public info(): void {}

  public error(_message: string, fields: Readonly<Record<string, string>> = {}): void {
    this.errors.push(fields);
  }
}

const missionId = 'mission-sprint-66';
const otherMissionId = 'mission-sprint-66-other';
const engineeringSessionId = 'engineering-session-sprint-66';

describe('EngineeringSessionStateProjection', () => {
  it('creates exactly one projection from the first observed advancement event', async () => {
    const harness = await createHarness();

    await harness.publish(createWorkflowAdvancedEvent('event-direct-1', '0', '1', 'Direct'));

    await expect(
      harness.service.getEngineeringSessionStateProjection(engineeringSessionId),
    ).resolves.toMatchObject({
      missionId,
      engineeringSessionId,
      previousWorkflowStepId: '0',
      currentWorkflowStepId: '1',
      latestAdvancementStrategy: 'Direct',
      latestProcessedEventId: 'event-direct-1',
      latestEventOccurredAt: '2026-07-17T00:00:01.000Z',
      revision: 1,
      advancementHistory: [
        {
          eventId: 'event-direct-1',
          missionId,
          engineeringSessionId,
          previousWorkflowStepId: '0',
          newWorkflowStepId: '1',
          advancementStrategy: 'Direct',
          occurredAt: '2026-07-17T00:00:01.000Z',
          causality: ['event-cause-direct-1'],
          correlationId: 'correlation-sprint-66',
        },
      ],
      attribution: {
        missionId,
        engineeringSessionId,
      },
      diagnostics: {
        consumedEventCount: 1,
        consumedEventIds: ['event-direct-1'],
      },
    });
  });

  it('does not fabricate a projection for a Session with no observed advancement event', async () => {
    const harness = await createHarness();

    await expect(
      harness.service.getEngineeringSessionStateProjection(engineeringSessionId),
    ).resolves.toBeUndefined();
  });

  it('applies subsequent valid events in EventBus order and preserves advancement strategies', async () => {
    const harness = await createHarness();
    const events = [
      createWorkflowAdvancedEvent('event-direct-1', '0', '1', 'Direct'),
      createWorkflowAdvancedEvent('event-trigger-2', '1', '2', 'Trigger'),
      createWorkflowAdvancedEvent('event-review-3', '2', '3', 'ReviewGated'),
      createWorkflowAdvancedEvent('event-governance-4', '3', '4', 'GovernanceGated'),
    ];

    for (const event of events) {
      await harness.publish(event);
    }

    const projection = await harness.service.getEngineeringSessionStateProjection(engineeringSessionId);

    expect(projection).toMatchObject({
      currentWorkflowStepId: '4',
      previousWorkflowStepId: '3',
      latestAdvancementStrategy: 'GovernanceGated',
      revision: 4,
    });
    expect(projection?.advancementHistory.map((entry) => entry.eventId)).toEqual([
      'event-direct-1',
      'event-trigger-2',
      'event-review-3',
      'event-governance-4',
    ]);
    expect(projection?.advancementHistory.map((entry) => entry.advancementStrategy)).toEqual([
      'Direct',
      'Trigger',
      'ReviewGated',
      'GovernanceGated',
    ]);
  });

  it('rejects Workflow continuity mismatches without changing the existing projection', async () => {
    const harness = await createHarness();

    await harness.publish(createWorkflowAdvancedEvent('event-direct-1', '0', '1', 'Direct'));
    const before = await harness.service.getEngineeringSessionStateProjection(engineeringSessionId);
    const result = await harness.service.applyEvent(
      createWorkflowAdvancedEvent('event-mismatch-2', '9', '10', 'Trigger'),
    );

    expect(result).toMatchObject({
      status: 'Rejected',
      eventId: 'event-mismatch-2',
      engineeringSessionId,
    });
    expect(result.diagnostic).toContain('continuity mismatch');
    await expect(
      harness.service.getEngineeringSessionStateProjection(engineeringSessionId),
    ).resolves.toEqual(before);
  });

  it('rejects Mission attribution conflicts without resolving Mission association elsewhere', async () => {
    const harness = await createHarness();

    await harness.publish(createWorkflowAdvancedEvent('event-direct-1', '0', '1', 'Direct'));
    const before = await harness.service.getEngineeringSessionStateProjection(engineeringSessionId);
    const result = await harness.service.applyEvent(
      createWorkflowAdvancedEvent('event-conflicting-mission-2', '1', '2', 'Trigger', {
        missionId: otherMissionId,
      }),
    );

    expect(result).toMatchObject({
      status: 'Rejected',
      missionId: otherMissionId,
      engineeringSessionId,
    });
    expect(result.diagnostic).toContain(`from Mission '${otherMissionId}'`);
    await expect(
      harness.service.getEngineeringSessionStateProjection(engineeringSessionId),
    ).resolves.toEqual(before);
  });

  it('deduplicates repeated event identity across live delivery and replay without changing revision', async () => {
    const harness = await createHarness();
    const event = createWorkflowAdvancedEvent('event-direct-1', '0', '1', 'Direct');

    await harness.publish(event);
    await expect(harness.service.applyEvent(event)).resolves.toMatchObject({
      status: 'Duplicate',
      projection: {
        revision: 1,
      },
    });
    await expect(harness.service.replayMissionEventStream(missionId)).resolves.toMatchObject([
      {
        status: 'Duplicate',
      },
    ]);

    const projection = await harness.service.getEngineeringSessionStateProjection(engineeringSessionId);

    expect(projection?.revision).toBe(1);
    expect(projection?.advancementHistory).toHaveLength(1);
  });

  it('replays the same ordered event stream into an identical reconstructed projection without read-time mutation', async () => {
    const liveHarness = await createHarness();
    const replayHarness = await createHarness({ initializeService: false });
    const events = [
      createWorkflowAdvancedEvent('event-direct-1', '0', '1', 'Direct'),
      createWorkflowAdvancedEvent('event-trigger-2', '1', '2', 'Trigger'),
    ];

    for (const event of events) {
      await liveHarness.publish(event);
      await replayHarness.eventBus.publish(event);
    }

    const beforeReplayRead = await replayHarness.service.getEngineeringSessionStateProjection(
      engineeringSessionId,
    );

    expect(beforeReplayRead).toBeUndefined();

    await replayHarness.service.replayMissionEventStream(missionId);

    const liveProjection = await liveHarness.service.getEngineeringSessionStateProjection(
      engineeringSessionId,
    );
    const replayProjection = await replayHarness.service.getEngineeringSessionStateProjection(
      engineeringSessionId,
    );

    expect(replayProjection).toEqual(liveProjection);
    await expect(
      replayHarness.service.getEngineeringSessionStateProjection(engineeringSessionId),
    ).resolves.toEqual(replayProjection);
  });

  it('returns deterministic rejection diagnostics for unsupported or malformed events', async () => {
    const harness = await createHarness();

    await expect(harness.service.applyEvent(createUnsupportedEvent())).resolves.toMatchObject({
      status: 'Rejected',
      eventType: 'MissionCreated',
      diagnostic: "Unsupported event type 'MissionCreated'.",
    });
    await expect(
      harness.service.applyEvent(
        createWorkflowAdvancedEvent('event-invalid-strategy', '0', '1', 'Direct', {
          strategy: 'Speculative',
        }),
      ),
    ).resolves.toMatchObject({
      status: 'Rejected',
      diagnostic: "EngineeringSessionStateProjection received unsupported advancement strategy 'Speculative'.",
    });
    await expect(
      harness.service.getEngineeringSessionStateProjection(engineeringSessionId),
    ).resolves.toBeUndefined();
  });

  it('leaves the existing projection unchanged when repository persistence fails', async () => {
    const repository = new FailingSaveRepository();
    const service = new EngineeringSessionStateProjectionService(repository);
    const firstProjection = EngineeringSessionStateProjection.createFromEvent(
      createWorkflowAdvancedEvent('event-direct-1', '0', '1', 'Direct'),
    );

    await repository.seed(firstProjection);

    const before = await service.getEngineeringSessionStateProjection(engineeringSessionId);
    const result = await service.applyEvent(
      createWorkflowAdvancedEvent('event-trigger-2', '1', '2', 'Trigger'),
    );

    expect(result).toMatchObject({
      status: 'Rejected',
      engineeringSessionId,
      diagnostic: 'projection persistence unavailable',
    });
    await expect(service.getEngineeringSessionStateProjection(engineeringSessionId)).resolves.toEqual(before);
  });

  it('enumerates immutable projections globally and by Mission through read-only service access', async () => {
    const harness = await createHarness();

    await harness.publish(createWorkflowAdvancedEvent('event-direct-1', '0', '1', 'Direct'));
    await harness.publish(
      createWorkflowAdvancedEvent('event-other-session-1', '0', '1', 'Direct', {
        engineeringSessionId: 'engineering-session-sprint-66-other',
      }),
    );
    await harness.publish(
      createWorkflowAdvancedEvent('event-other-mission-1', '0', '1', 'Direct', {
        missionId: otherMissionId,
        engineeringSessionId: 'engineering-session-other-mission',
      }),
    );

    const allProjections = await harness.service.enumerateProjections();
    const missionProjections = await harness.service.enumerateProjectionsByMission(missionId);

    expect(allProjections.map((projection) => projection.engineeringSessionId)).toEqual([
      'engineering-session-other-mission',
      'engineering-session-sprint-66',
      'engineering-session-sprint-66-other',
    ]);
    expect(missionProjections.map((projection) => projection.engineeringSessionId)).toEqual([
      'engineering-session-sprint-66',
      'engineering-session-sprint-66-other',
    ]);
    expect(Object.isFrozen(missionProjections[0])).toBe(true);
    expect(Object.isFrozen(missionProjections[0]?.advancementHistory)).toBe(true);
  });

  it('wires the projection subscriber through Kernel service composition', async () => {
    const eventBus = new EventBus(new TestLogger());
    const services = createKernelServices(eventBus);
    const projectionService = services.find(
      (service): service is EngineeringSessionStateProjectionService =>
        service instanceof EngineeringSessionStateProjectionService,
    );

    expect(projectionService).toBeDefined();

    if (projectionService === undefined) {
      throw new Error('Expected EngineeringSessionStateProjectionService to be composed.');
    }

    for (const service of services) {
      await service.initialize();
    }

    await eventBus.publish(createWorkflowAdvancedEvent('event-composed-1', '0', '1', 'Direct'));

    await expect(
      projectionService.getEngineeringSessionStateProjection(engineeringSessionId),
    ).resolves.toMatchObject({
      currentWorkflowStepId: '1',
      revision: 1,
    });

    for (const service of [...services].reverse()) {
      service.dispose();
    }
  });

  it('does not modify Host or Adapter production surfaces', () => {
    const changedHostOrAdapterPaths = execFileSync(
      'git',
      ['--no-pager', 'diff', '--name-only', '--', 'src/hosts', 'src/adapters'],
      { cwd: process.cwd(), encoding: 'utf8' },
    )
      .split(/\r?\n/)
      .filter((path) => path.length > 0);

    expect(changedHostOrAdapterPaths).toEqual([]);
  });
});

async function createHarness(
  options: { readonly initializeService?: boolean } = {},
): Promise<{
  readonly service: EngineeringSessionStateProjectionService;
  readonly eventBus: EventBus;
  readonly publish: (event: EventBusEvent) => Promise<void>;
}> {
  const eventBus = new EventBus(new TestLogger());
  const service = new EngineeringSessionStateProjectionService(
    new InMemoryEngineeringSessionStateProjectionRepository(),
    eventBus,
  );

  if (options.initializeService !== false) {
    await service.initialize();
  }

  return {
    service,
    eventBus,
    publish: (event) => eventBus.publish(event),
  };
}

function createWorkflowAdvancedEvent(
  eventId: string,
  previousWorkflowStepId: string,
  newWorkflowStepId: string,
  strategy: string,
  overrides: {
    readonly missionId?: string;
    readonly engineeringSessionId?: string;
    readonly strategy?: string;
  } = {},
): EventBusEvent {
  const targetMissionId = overrides.missionId ?? missionId;

  return {
    eventId,
    missionId: targetMissionId,
    eventType: 'EngineeringSessionWorkflowAdvanced',
    timestamp: `2026-07-17T00:00:0${eventId.endsWith('-1') ? '1' : '2'}.000Z`,
    causality: [`event-cause-${eventId.replace('event-', '')}`],
    correlationId: 'correlation-sprint-66',
    attribution: {
      missionId: targetMissionId,
    },
    payload: {
      engineeringSessionId: overrides.engineeringSessionId ?? engineeringSessionId,
      previousWorkflowStepId,
      newWorkflowStepId,
      strategy: overrides.strategy ?? strategy,
    },
  };
}

function createUnsupportedEvent(): EventBusEvent {
  return {
    eventId: 'event-unsupported',
    missionId,
    eventType: 'MissionCreated',
    timestamp: '2026-07-17T00:00:00.000Z',
    causality: [],
    attribution: {
      missionId,
    },
    payload: {},
  };
}

class FailingSaveRepository implements IEngineeringSessionStateProjectionRepository {
  private readonly delegate = new InMemoryEngineeringSessionStateProjectionRepository();

  public async seed(projection: EngineeringSessionStateProjection): Promise<void> {
    await this.delegate.save(projection);
  }

  public async save(): Promise<EngineeringSessionStateProjection> {
    throw new Error('projection persistence unavailable');
  }

  public getByEngineeringSessionId(
    engineeringSessionId: string,
  ): Promise<EngineeringSessionStateProjection | undefined> {
    return this.delegate.getByEngineeringSessionId(engineeringSessionId);
  }

  public enumerate(): Promise<readonly EngineeringSessionStateProjection[]> {
    return this.delegate.enumerate();
  }

  public getByMissionId(missionIdValue: string): Promise<readonly EngineeringSessionStateProjection[]> {
    return this.delegate.getByMissionId(missionIdValue);
  }
}
