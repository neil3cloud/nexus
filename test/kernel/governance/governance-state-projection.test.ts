import { execFileSync } from 'node:child_process';

import { describe, expect, it } from 'vitest';

import type { EventBusEvent } from '../../../src/kernel/common/event-bus-contract';
import { createKernelServices } from '../../../src/kernel/common/create-kernel-services';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';
import { EventBus } from '../../../src/kernel/events/event-bus';
import { RecoveryRequirement } from '../../../src/kernel/execution/recovery-requirement';
import { GovernanceDecision } from '../../../src/kernel/governance/governance-decision';
import { InMemoryGovernanceStateProjectionRepository } from '../../../src/kernel/governance/governance-state-projection.repository';
import { GovernanceStateProjectionService } from '../../../src/kernel/governance/governance-state-projection.service';
import { createGovernanceDecisionRecordedEvent } from '../../../src/kernel/governance/governance.events';
import type { GovernanceDecisionValue } from '../../../src/kernel/governance/governance.types';

class TestLogger implements KernelLogger {
  public info(): void {}
  public error(): void {}
}

const missionId = 'mission-sprint-63';
const otherMissionId = 'mission-sprint-63-other';

describe('GovernanceStateProjection', () => {
  it('reflects an Approved GovernanceDecision as Non-Blocking for a Mission', async () => {
    const harness = await createHarness();

    await harness.publish(createGovernanceDecisionEvent('Approved', 'governance-decision-approved'));
    const projection = await harness.service.getGovernanceStateProjection(missionId);

    expect(projection).toMatchObject({
      missionId,
      latestGovernanceDecision: {
        governanceDecisionId: 'governance-decision-approved',
        outcome: 'Approved',
      },
      isBlocking: false,
      hasEscalationRequired: false,
      attribution: {
        missionId,
      },
    });
    expect(projection.unresolvedRecoveryRequirements).toEqual([]);
  });

  it('reflects a Rejected GovernanceDecision and Open RecoveryRequirement as Blocking', async () => {
    const harness = await createHarness();
    const recoveryEvents = createRecoveryRequirementEvents('recovery-requirement-open');

    await harness.publish(createGovernanceDecisionEvent('Rejected', 'governance-decision-rejected'));
    await harness.publish(recoveryEvents.created);
    const projection = await harness.service.getGovernanceStateProjection(missionId);

    expect(projection.latestGovernanceDecision?.outcome).toBe('Rejected');
    expect(projection.isBlocking).toBe(true);
    expect(projection.recoveryRequirements).toEqual([
      expect.objectContaining({
        recoveryRequirementId: 'recovery-requirement-open',
        governanceDecisionId: 'governance-decision-rejected',
        status: 'Open',
      }),
    ]);
    expect(projection.unresolvedRecoveryRequirements).toHaveLength(1);
  });

  it('updates Blocking state when RecoveryRequirement is Resolved or Withdrawn', async () => {
    const resolvedHarness = await createHarness();
    const resolvedEvents = createRecoveryRequirementEvents('recovery-requirement-resolved');

    await resolvedHarness.publish(createGovernanceDecisionEvent('Rejected', 'governance-decision-rejected'));
    await resolvedHarness.publish(resolvedEvents.created);
    await resolvedHarness.publish(resolvedEvents.resolved);
    const resolvedProjection = await resolvedHarness.service.getGovernanceStateProjection(missionId);

    expect(resolvedProjection.isBlocking).toBe(false);
    expect(resolvedProjection.unresolvedRecoveryRequirements).toEqual([]);
    expect(resolvedProjection.recoveryRequirements[0]).toMatchObject({
      recoveryRequirementId: 'recovery-requirement-resolved',
      status: 'Resolved',
      resolvedAt: '2026-07-16T10:00:00.000Z',
    });

    const withdrawnHarness = await createHarness();
    const withdrawnEvents = createRecoveryRequirementEvents('recovery-requirement-withdrawn');

    await withdrawnHarness.publish(createGovernanceDecisionEvent('Rejected', 'governance-decision-rejected'));
    await withdrawnHarness.publish(withdrawnEvents.created);
    await withdrawnHarness.publish(withdrawnEvents.withdrawn);
    const withdrawnProjection = await withdrawnHarness.service.getGovernanceStateProjection(missionId);

    expect(withdrawnProjection.isBlocking).toBe(true);
    expect(withdrawnProjection.unresolvedRecoveryRequirements).toEqual([]);
    expect(withdrawnProjection.recoveryRequirements[0]).toMatchObject({
      recoveryRequirementId: 'recovery-requirement-withdrawn',
      status: 'Withdrawn',
      withdrawnAt: '2026-07-16T10:05:00.000Z',
    });
  });

  it('keeps projections scoped by Mission', async () => {
    const harness = await createHarness();

    await harness.publish(
      createGovernanceDecisionEvent(
        'Rejected',
        'governance-decision-other-mission',
        otherMissionId,
      ),
    );
    const projection = await harness.service.getGovernanceStateProjection(missionId);
    const otherProjection = await harness.service.getGovernanceStateProjection(otherMissionId);

    expect(projection).toMatchObject({
      missionId,
      isBlocking: false,
      diagnostics: {
        consumedEventCount: 0,
      },
    });
    expect(projection.latestGovernanceDecision).toBeUndefined();
    expect(otherProjection).toMatchObject({
      missionId: otherMissionId,
      latestGovernanceDecision: {
        governanceDecisionId: 'governance-decision-other-mission',
        outcome: 'Rejected',
      },
      isBlocking: true,
    });
  });

  it('replays an identical event sequence to an identical deterministic projection', async () => {
    const firstHarness = await createHarness();
    const secondHarness = await createHarness();
    const recoveryEvents = createRecoveryRequirementEvents('recovery-requirement-deterministic');
    const events = [
      createGovernanceDecisionEvent('Rejected', 'governance-decision-rejected'),
      recoveryEvents.created,
      recoveryEvents.resolved,
    ];

    for (const event of events) {
      await firstHarness.publish(event);
      await secondHarness.publish(event);
    }

    const firstProjection = await firstHarness.service.getGovernanceStateProjection(missionId);
    const secondProjection = await secondHarness.service.getGovernanceStateProjection(missionId);

    expect(secondProjection).toEqual(firstProjection);
    await firstHarness.service.getGovernanceStateProjection(missionId);
    expect(await firstHarness.service.getGovernanceStateProjection(missionId)).toEqual(firstProjection);
  });

  it('returns a well-defined empty projection for a Mission with no governance events', async () => {
    const harness = await createHarness();

    await expect(harness.service.getGovernanceStateProjection(missionId)).resolves.toEqual({
      missionId,
      recoveryRequirements: [],
      unresolvedRecoveryRequirements: [],
      isBlocking: false,
      hasEscalationRequired: false,
      attribution: {
        missionId,
      },
      diagnostics: {
        consumedEventCount: 0,
        consumedEventIds: [],
      },
    });
  });

  it('wires the projection subscriber through Kernel service composition', async () => {
    const eventBus = new EventBus(new TestLogger());
    const services = createKernelServices(eventBus);
    const projectionService = services.find(
      (service): service is GovernanceStateProjectionService =>
        service instanceof GovernanceStateProjectionService,
    );

    expect(projectionService).toBeDefined();

    if (projectionService === undefined) {
      throw new Error('Expected GovernanceStateProjectionService to be composed.');
    }

    for (const service of services) {
      await service.initialize();
    }

    await eventBus.publish(createGovernanceDecisionEvent('Approved', 'governance-decision-composed'));

    await expect(projectionService.getGovernanceStateProjection(missionId)).resolves.toMatchObject({
      latestGovernanceDecision: {
        governanceDecisionId: 'governance-decision-composed',
        outcome: 'Approved',
      },
      isBlocking: false,
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
      .filter((path) => path.length > 0)
      .filter((path) => path !== 'src/hosts/vscode/host-mission-workflow.ts');

    expect(changedHostOrAdapterPaths).toEqual([]);
  });
});

async function createHarness(): Promise<{
  readonly service: GovernanceStateProjectionService;
  readonly publish: (event: EventBusEvent) => Promise<void>;
}> {
  const eventBus = new EventBus(new TestLogger());
  const service = new GovernanceStateProjectionService(
    new InMemoryGovernanceStateProjectionRepository(),
    eventBus,
  );

  await service.initialize();

  return {
    service,
    publish: (event) => eventBus.publish(event),
  };
}

function createGovernanceDecisionEvent(
  value: GovernanceDecisionValue,
  governanceDecisionId: string,
  targetMissionId = missionId,
): EventBusEvent {
  return createGovernanceDecisionRecordedEvent(
    GovernanceDecision.create({
      id: governanceDecisionId,
      missionId: targetMissionId,
      value,
      repositoryPolicyId: 'repository-policy-sprint-63',
      repositoryPolicyVersion: 1,
      reviewId: `review-${governanceDecisionId}`,
      reviewStateReference: `review-state-${governanceDecisionId}`,
      policyEvaluationId: `policy-evaluation-${governanceDecisionId}`,
      evaluationKey: `evaluation-key-${governanceDecisionId}`,
      criterionResults: [],
      evaluatedAt: '2026-07-16T09:00:00.000Z',
      explanationCodes: [`governance-decision-${value.toLowerCase().replaceAll(' ', '-')}`],
    }),
    {
      eventId: `event-${governanceDecisionId}`,
      timestamp: '2026-07-16T09:00:00.000Z',
    },
  );
}

function createRecoveryRequirementEvents(recoveryRequirementId: string): {
  readonly created: EventBusEvent;
  readonly resolved: EventBusEvent;
  readonly withdrawn: EventBusEvent;
} {
  const recoveryRequirement = RecoveryRequirement.create({
    id: recoveryRequirementId,
    missionId,
    engineeringSessionId: 'engineering-session-sprint-63',
    workflowStepId: 'workflow-step-sprint-63',
    governanceDecisionId: 'governance-decision-rejected',
    createdAt: '2026-07-16T09:05:00.000Z',
    creationEventId: `event-${recoveryRequirementId}-created`,
    creationCausality: ['event-governance-decision-rejected'],
  });
  const created = recoveryRequirement.pullDomainEvents()[0];
  const resolved = recoveryRequirement.resolve({
    acceptedOutcomeReference: 'review-outcome:accepted-remediation',
    resolvedAt: '2026-07-16T10:00:00.000Z',
    attribution: 'builder:sprint-63',
    eventId: `event-${recoveryRequirementId}-resolved`,
    causality: [`event-${recoveryRequirementId}-created`],
  });
  const withdrawn = recoveryRequirement.withdraw({
    authoritativeDecisionReference: 'NEXUS-RAT-2026-07-16-016',
    reason: 'Superseding authority withdraws the requirement.',
    withdrawnAt: '2026-07-16T10:05:00.000Z',
    attribution: 'sprint-owner',
    eventId: `event-${recoveryRequirementId}-withdrawn`,
    causality: [`event-${recoveryRequirementId}-created`],
  });
  const resolvedEvent = resolved.pullDomainEvents()[0];
  const withdrawnEvent = withdrawn.pullDomainEvents()[0];

  if (created === undefined || resolvedEvent === undefined || withdrawnEvent === undefined) {
    throw new Error('Expected RecoveryRequirement test events to be recorded.');
  }

  return {
    created,
    resolved: resolvedEvent,
    withdrawn: withdrawnEvent,
  };
}
