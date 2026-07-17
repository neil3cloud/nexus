import { execFileSync } from 'node:child_process';

import { describe, expect, it } from 'vitest';

import type { EventBusEvent } from '../../../src/kernel/common/event-bus-contract';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';
import { EventBus } from '../../../src/kernel/events/event-bus';
import { RecoveryRequirement } from '../../../src/kernel/execution/recovery-requirement';
import { GovernanceDecision } from '../../../src/kernel/governance/governance-decision';
import { InMemoryGovernanceDecisionRepository } from '../../../src/kernel/governance/governance-decision.repository';
import { InMemoryGovernanceStateProjectionRepository } from '../../../src/kernel/governance/governance-state-projection.repository';
import { GovernanceStateProjectionService } from '../../../src/kernel/governance/governance-state-projection.service';
import { createGovernanceDecisionRecordedEvent } from '../../../src/kernel/governance/governance.events';
import type { GovernanceDecisionValue } from '../../../src/kernel/governance/governance.types';
import { GovernanceGatedMissionCompletionCoordinator } from '../../../src/kernel/mission/governance-gated-mission-completion.coordinator';
import { Mission } from '../../../src/kernel/mission/mission.aggregate';
import { MissionExecutionService } from '../../../src/kernel/mission/mission-execution.service';
import { MissionId } from '../../../src/kernel/mission/mission-id';
import { MissionObjective } from '../../../src/kernel/mission/mission-objective';
import { MissionPlan } from '../../../src/kernel/mission/mission-plan.aggregate';
import { MissionPlanId } from '../../../src/kernel/mission/mission-plan-id';
import type { RevisionMetadata } from '../../../src/kernel/mission/mission-planning.types';
import { InMemoryMissionRepository } from '../../../src/kernel/mission/mission.repository';
import type { DomainEventMetadata } from '../../../src/kernel/mission/mission.types';
import { Task } from '../../../src/kernel/mission/task';
import { TaskId } from '../../../src/kernel/mission/task-id';

class TestLogger implements KernelLogger {
  public info(): void {}

  public error(): void {}
}

const timestamp = '2026-07-16T21:00:00.000Z';

describe('GovernanceGatedMissionCompletionCoordinator', () => {
  it('completes a Mission when GovernanceDecisionRecorded produces a non-blocking projection', async () => {
    const harness = await createHarness();
    const event = createGovernanceDecisionEvent('Approved', 'governance-decision-approved');

    await harness.publish(event);
    const diagnostic = await harness.coordinator.handleEvent(event);

    expect(diagnostic).toMatchObject({
      eventId: event.eventId,
      eventType: 'GovernanceDecisionRecorded',
      missionId: 'mission-1',
      status: 'Completed',
      projection: {
        isBlocking: false,
        hasEscalationRequired: false,
      },
    });
    await expect(harness.requireMissionStatus('mission-1')).resolves.toBe('Completed');
    expect(harness.eventsOfType('mission-1', 'MissionCompleted')).toHaveLength(1);
  });

  it('does not complete a Mission when governance events leave the projection blocking', async () => {
    const harness = await createHarness();
    const decisionEvent = createGovernanceDecisionEvent('Rejected', 'governance-decision-rejected');
    const recoveryEvents = createRecoveryRequirementEvents('recovery-requirement-open');

    await harness.publish(decisionEvent);
    await harness.publish(recoveryEvents.created);

    const diagnostic = await harness.coordinator.handleEvent(recoveryEvents.created);

    expect(diagnostic).toMatchObject({
      eventType: 'RecoveryRequirementCreated',
      missionId: 'mission-1',
      status: 'Skipped',
      projection: {
        isBlocking: true,
        hasEscalationRequired: false,
      },
    });
    await expect(harness.requireMissionStatus('mission-1')).resolves.toBe('Reviewing');
    expect(harness.eventsOfType('mission-1', 'MissionCompleted')).toHaveLength(0);
  });

  it('completes a Mission when RecoveryRequirementResolved removes the remaining blocking state', async () => {
    const harness = await createHarness();
    const decisionEvent = createGovernanceDecisionEvent('Rejected', 'governance-decision-rejected');
    const recoveryEvents = createRecoveryRequirementEvents('recovery-requirement-resolved');

    await harness.publish(decisionEvent);
    await harness.publish(recoveryEvents.created);
    await expect(harness.coordinator.handleEvent(recoveryEvents.created)).resolves.toMatchObject({
      status: 'Skipped',
    });

    await harness.publish(recoveryEvents.resolved);
    const diagnostic = await harness.coordinator.handleEvent(recoveryEvents.resolved);

    expect(diagnostic).toMatchObject({
      eventType: 'RecoveryRequirementResolved',
      missionId: 'mission-1',
      status: 'Completed',
      projection: {
        isBlocking: false,
        unresolvedRecoveryRequirements: [],
      },
    });
    await expect(harness.requireMissionStatus('mission-1')).resolves.toBe('Completed');
  });

  it('completes a Mission when RecoveryRequirementWithdrawn leaves an approved non-blocking projection', async () => {
    const harness = await createHarness();
    const rejectedEvent = createGovernanceDecisionEvent('Rejected', 'governance-decision-rejected');
    const approvedEvent = createGovernanceDecisionEvent('Approved', 'governance-decision-approved');
    const recoveryEvents = createRecoveryRequirementEvents('recovery-requirement-withdrawn');

    await harness.publish(rejectedEvent);
    await harness.publish(recoveryEvents.created);
    await harness.publish(approvedEvent);
    await expect(harness.coordinator.handleEvent(approvedEvent)).resolves.toMatchObject({
      status: 'Skipped',
      projection: {
        isBlocking: true,
      },
    });

    await harness.publish(recoveryEvents.withdrawn);
    const diagnostic = await harness.coordinator.handleEvent(recoveryEvents.withdrawn);

    expect(diagnostic).toMatchObject({
      eventType: 'RecoveryRequirementWithdrawn',
      status: 'Completed',
      projection: {
        latestGovernanceDecision: {
          outcome: 'Approved',
        },
        isBlocking: false,
        unresolvedRecoveryRequirements: [],
      },
    });
    await expect(harness.requireMissionStatus('mission-1')).resolves.toBe('Completed');
  });

  it('handles duplicate and replayed event delivery without duplicate Mission completion', async () => {
    const harness = await createHarness();
    const event = createGovernanceDecisionEvent('Approved', 'governance-decision-approved');

    await harness.publish(event);
    const first = await harness.coordinator.handleEvent(event);
    const duplicate = await harness.coordinator.handleEvent(event);

    expect(first).toEqual(duplicate);
    expect(first.status).toBe('Completed');
    expect(harness.eventsOfType('mission-1', 'MissionCompleted')).toHaveLength(1);
  });

  it('surfaces completeMission rejection as a deterministic diagnostic without retry', async () => {
    const harness = await createHarness({ completeTasks: false });
    const event = createGovernanceDecisionEvent('Approved', 'governance-decision-approved');

    await harness.publish(event);
    const first = await harness.coordinator.handleEvent(event);
    const duplicate = await harness.coordinator.handleEvent(event);

    expect(first).toMatchObject({
      status: 'CompletionRejected',
      reason: "Mission 'mission-1' cannot complete because Task 'task-1' is 'InProgress'.",
      rejectionName: 'MissionCompletionRejectedError',
    });
    expect(duplicate).toEqual(first);
    await expect(harness.requireMissionStatus('mission-1')).resolves.toBe('Reviewing');
    expect(harness.eventsOfType('mission-1', 'MissionCompleted')).toHaveLength(0);
  });

  it('does not affect a Mission when handling an event for another Mission', async () => {
    const harness = await createHarness({ missionIds: ['mission-1', 'mission-2'] });
    const event = createGovernanceDecisionEvent(
      'Approved',
      'governance-decision-other',
      'mission-2',
    );

    await harness.publish(event);
    const diagnostic = await harness.coordinator.handleEvent(event);

    expect(diagnostic).toMatchObject({
      missionId: 'mission-2',
      status: 'Completed',
    });
    await expect(harness.requireMissionStatus('mission-1')).resolves.toBe('Reviewing');
    await expect(harness.requireMissionStatus('mission-2')).resolves.toBe('Completed');
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

async function createHarness(input: {
  readonly completeTasks?: boolean;
  readonly missionIds?: readonly string[];
} = {}): Promise<{
  readonly coordinator: GovernanceGatedMissionCompletionCoordinator;
  readonly publish: (event: EventBusEvent) => Promise<void>;
  readonly requireMissionStatus: (missionId: string) => Promise<string>;
  readonly eventsOfType: (missionId: string, eventType: string) => readonly EventBusEvent[];
}> {
  const eventBus = new EventBus(new TestLogger());
  const missionRepository = new InMemoryMissionRepository();
  const governanceDecisionRepository = new InMemoryGovernanceDecisionRepository();
  const missionExecutionService = new MissionExecutionService(
    missionRepository,
    eventBus,
    sequence([
      'event-mission-started-mission-1',
      'event-task-1-started-mission-1',
      'event-task-1-completed-mission-1',
      'event-mission-completed-mission-1',
      'event-mission-started-mission-2',
      'event-task-1-started-mission-2',
      'event-task-1-completed-mission-2',
      'event-mission-completed-mission-2',
    ]),
    () => timestamp,
    governanceDecisionRepository,
  );
  const projectionService = new GovernanceStateProjectionService(
    new InMemoryGovernanceStateProjectionRepository(),
    eventBus,
  );
  const coordinator = new GovernanceGatedMissionCompletionCoordinator(
    eventBus,
    projectionService,
    missionExecutionService,
  );

  for (const missionId of input.missionIds ?? ['mission-1']) {
    await createReviewingMission({
      missionId,
      repository: missionRepository,
      service: missionExecutionService,
      completeTasks: input.completeTasks ?? true,
    });
  }

  return {
    coordinator,
    publish: (event) => eventBus.publish(event),
    async requireMissionStatus(missionId) {
      const mission = await missionRepository.getById(MissionId.fromString(missionId));

      if (mission === undefined) {
        throw new Error(`Expected Mission '${missionId}'.`);
      }

      return mission.status;
    },
    eventsOfType(missionId, eventType) {
      return eventBus.replay(missionId).filter((event) => event.eventType === eventType);
    },
  };
}

async function createReviewingMission(input: {
  readonly missionId: string;
  readonly repository: InMemoryMissionRepository;
  readonly service: MissionExecutionService;
  readonly completeTasks: boolean;
}): Promise<void> {
  const mission = createReadyMission(input.missionId);
  const missionPlan = createMissionPlanWithReadyTask(input.missionId);

  await input.repository.save(mission);
  await input.repository.saveMissionPlan(missionPlan);
  await input.service.startMission({ missionId: input.missionId });
  await input.service.startTask({ missionId: input.missionId, taskId: 'task-1' });

  if (input.completeTasks) {
    await input.service.completeTask({ missionId: input.missionId, taskId: 'task-1' });
  }

  const reviewingMission = await input.repository.getById(MissionId.fromString(input.missionId));

  if (reviewingMission === undefined) {
    throw new Error(`Expected Mission '${input.missionId}'.`);
  }

  reviewingMission.review(metadata(`event-reviewed-${input.missionId}`));
  await input.repository.save(reviewingMission);
}

function createReadyMission(missionId: string): Mission {
  const mission = Mission.create(
    MissionId.fromString(missionId),
    MissionObjective.fromString(`Complete governed Mission ${missionId}`),
    metadata(`event-created-${missionId}`),
  );

  mission.pullDomainEvents();
  mission.plan(metadata(`event-planned-${missionId}`));
  mission.markReady(metadata(`event-ready-${missionId}`));

  return mission;
}

function createMissionPlanWithReadyTask(missionId: string): MissionPlan {
  const missionPlan = MissionPlan.create({
    id: MissionPlanId.fromString(`plan-${missionId}`),
    missionId: MissionId.fromString(missionId),
    revisionMetadata: revisionMetadata('Initial governed mission completion plan'),
  });
  const task = Task.create({
    id: TaskId.fromString('task-1'),
    title: 'Complete governed work',
    description: 'Complete work before event-driven Mission completion',
    parentMissionPlanId: missionPlan.id,
  });

  task.markReady();
  missionPlan.addTask(task, revisionMetadata('Add governed completion task'));

  return missionPlan;
}

function createGovernanceDecisionEvent(
  value: GovernanceDecisionValue,
  governanceDecisionId: string,
  missionId = 'mission-1',
): EventBusEvent {
  return createGovernanceDecisionRecordedEvent(
    GovernanceDecision.create({
      id: governanceDecisionId,
      missionId,
      value,
      repositoryPolicyId: 'repository-policy-sprint-64',
      repositoryPolicyVersion: 1,
      reviewId: `review-${governanceDecisionId}`,
      reviewStateReference: `review-state-${governanceDecisionId}`,
      policyEvaluationId: `policy-evaluation-${governanceDecisionId}`,
      evaluationKey: `evaluation-key-${governanceDecisionId}`,
      criterionResults: [],
      evaluatedAt: timestamp,
      explanationCodes: [`governance-decision-${value.toLowerCase().replaceAll(' ', '-')}`],
    }),
    {
      eventId: `event-${governanceDecisionId}`,
      timestamp,
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
    missionId: 'mission-1',
    engineeringSessionId: 'engineering-session-sprint-64',
    workflowStepId: 'workflow-step-sprint-64',
    governanceDecisionId: 'governance-decision-rejected',
    createdAt: timestamp,
    creationEventId: `event-${recoveryRequirementId}-created`,
    creationCausality: ['event-governance-decision-rejected'],
  });
  const created = recoveryRequirement.pullDomainEvents()[0];
  const resolved = recoveryRequirement.resolve({
    acceptedOutcomeReference: 'review-outcome:accepted-remediation',
    resolvedAt: '2026-07-16T21:05:00.000Z',
    attribution: 'builder:sprint-64',
    eventId: `event-${recoveryRequirementId}-resolved`,
    causality: [`event-${recoveryRequirementId}-created`],
  });
  const withdrawn = recoveryRequirement.withdraw({
    authoritativeDecisionReference: 'NEXUS-RAT-2026-07-16-017',
    reason: 'Superseding approved GovernanceDecision removes the open requirement.',
    withdrawnAt: '2026-07-16T21:10:00.000Z',
    attribution: 'sprint-owner',
    eventId: `event-${recoveryRequirementId}-withdrawn`,
    causality: [`event-${recoveryRequirementId}-created`],
  });
  const resolvedEvent = resolved.pullDomainEvents()[0];
  const withdrawnEvent = withdrawn.pullDomainEvents()[0];

  if (created === undefined || resolvedEvent === undefined || withdrawnEvent === undefined) {
    throw new Error('Expected RecoveryRequirement events to be recorded.');
  }

  return {
    created,
    resolved: resolvedEvent,
    withdrawn: withdrawnEvent,
  };
}

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
