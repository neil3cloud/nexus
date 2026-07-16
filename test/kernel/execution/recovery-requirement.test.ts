import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { GovernanceDecision } from '../../../src/kernel/governance/governance-decision';
import { InMemoryGovernanceDecisionRepository } from '../../../src/kernel/governance/governance-decision.repository';
import { createGovernanceDecisionRecordedEvent } from '../../../src/kernel/governance/governance.events';
import type { GovernanceDecisionValue } from '../../../src/kernel/governance/governance.types';
import {
  InvalidRecoveryRequirementDefinitionError,
} from '../../../src/kernel/execution/recovery-requirement.errors';
import { RecoveryRequirement } from '../../../src/kernel/execution/recovery-requirement';
import { RecoveryRequirementGovernanceDecisionConsumer } from '../../../src/kernel/execution/recovery-requirement-governance-decision.consumer';
import { InMemoryRecoveryRequirementRepository } from '../../../src/kernel/execution/recovery-requirement.repository';
import { RecoveryRequirementService } from '../../../src/kernel/execution/recovery-requirement.service';
import type { RecoveryRequirementSnapshot } from '../../../src/kernel/execution/recovery-requirement.types';
import { createKernelServices } from '../../../src/kernel/common/create-kernel-services';
import { EventBus } from '../../../src/kernel/events/event-bus';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';
import type {
  EventBusEvent,
  EventSubscription,
  EventSubscriptionHandle,
} from '../../../src/kernel/common/event-bus-contract';
import { GovernanceGatedWorkflowAdvancementConsumer } from '../../../src/kernel/execution/governance-gated-workflow-advancement.consumer';

class TestLogger implements KernelLogger {
  public info(): void {}
  public error(): void {}
}

class CollectingEventBus extends EventBus {
  public readonly publishedEvents: EventBusEvent[] = [];

  public override async publish(event: EventBusEvent): Promise<void> {
    await super.publish(event);
    this.publishedEvents.push(event);
  }
}

class RecordingSubscriptionEventBus extends CollectingEventBus {
  private readonly recordedSubscriptions: EventSubscription[] = [];

  public override subscribe(subscription: EventSubscription): EventSubscriptionHandle {
    this.recordedSubscriptions.push(subscription);
    const handle = super.subscribe(subscription);

    return {
      dispose: () => {
        const index = this.recordedSubscriptions.indexOf(subscription);

        if (index >= 0) {
          this.recordedSubscriptions.splice(index, 1);
        }

        handle.dispose();
      },
    };
  }

  public subscriptionCount(eventType: string): number {
    return this.recordedSubscriptions.filter((subscription) => subscription.eventType === eventType).length;
  }
}

describe('RecoveryRequirement', () => {
  it('M1 creates exactly one Open RecoveryRequirement with correct attribution for a Rejected GovernanceDecision', async () => {
    const harness = await createHarness('Rejected');

    const recoveryRequirement = await harness.consumer.handleGovernanceDecisionRecorded({
      event: harness.event,
      engineeringSessionId: 'engineering-session-1',
      workflowStepId: 'workflow-step-1',
    });

    expect(recoveryRequirement).toMatchObject({
      id: 'recovery-requirement-1',
      missionId: 'mission-1',
      engineeringSessionId: 'engineering-session-1',
      workflowStepId: 'workflow-step-1',
      governanceDecisionId: 'governance-decision-1',
      createdAt: '2026-07-16T01:00:00.000Z',
      creationCausality: ['event-policy-evaluation'],
      creationCorrelationId: 'correlation-1',
      status: 'Open',
    });
    expect(await harness.recoveryRequirementRepository.enumerate()).toHaveLength(1);
    expect(collectRecoveryRequirementEvents(harness.eventBus, 'RecoveryRequirementCreated')).toEqual([
      expect.objectContaining({
        eventId: 'event-recovery-requirement-created-1',
        missionId: 'mission-1',
        eventType: 'RecoveryRequirementCreated',
        timestamp: '2026-07-16T01:00:00.000Z',
        causality: ['event-policy-evaluation'],
        correlationId: 'correlation-1',
        attribution: {
          missionId: 'mission-1',
        },
        payload: expect.objectContaining({
          recoveryRequirementId: 'recovery-requirement-1',
          recoveryRequirementStatus: 'Open',
          engineeringSessionId: 'engineering-session-1',
          workflowStepId: 'workflow-step-1',
          governanceDecisionId: 'governance-decision-1',
        }),
      }),
    ]);
  });

  it.each(['Deferred', 'Escalation Required', 'Approved'] as const)(
    'M2-M4 creates no RecoveryRequirement for %s GovernanceDecision',
    async (governanceDecisionValue) => {
      const harness = await createHarness(governanceDecisionValue);

      await expect(
        harness.consumer.handleGovernanceDecisionRecorded({
          event: harness.event,
          engineeringSessionId: 'engineering-session-1',
          workflowStepId: 'workflow-step-1',
        }),
      ).resolves.toBeUndefined();
      expect(await harness.recoveryRequirementRepository.enumerate()).toEqual([]);
    },
  );

  it('M5 returns the existing record for duplicate handling of the same Rejected GovernanceDecision', async () => {
    const harness = await createHarness('Rejected', [
      'recovery-requirement-1',
      'event-recovery-requirement-created-1',
      'recovery-requirement-2',
      'event-recovery-requirement-created-2',
    ]);
    const command = {
      event: harness.event,
      engineeringSessionId: 'engineering-session-1',
      workflowStepId: 'workflow-step-1',
    };

    const first = await harness.consumer.handleGovernanceDecisionRecorded(command);
    const duplicate = await harness.consumer.handleGovernanceDecisionRecorded(command);

    expect(first?.id).toBe('recovery-requirement-1');
    expect(duplicate?.id).toBe('recovery-requirement-1');
    expect(await harness.recoveryRequirementRepository.enumerate()).toHaveLength(1);
    expect(collectRecoveryRequirementEvents(harness.eventBus, 'RecoveryRequirementCreated')).toHaveLength(1);
  });

  it('M6 creates a separate requirement for a distinct Rejected GovernanceDecision on the same Mission Session and Step', async () => {
    const harness = await createHarness('Rejected', [
      'recovery-requirement-1',
      'event-recovery-requirement-created-1',
      'recovery-requirement-2',
      'event-recovery-requirement-created-2',
    ]);
    const secondDecision = createGovernanceDecision('Rejected', 'governance-decision-2');
    const secondEvent = createGovernanceDecisionRecordedEvent(secondDecision, {
      eventId: 'event-governance-decision-recorded-2',
      timestamp: '2026-07-16T01:05:00.000Z',
    });

    await harness.governanceDecisionRepository.register(secondDecision);
    await harness.consumer.handleGovernanceDecisionRecorded({
      event: harness.event,
      engineeringSessionId: 'engineering-session-1',
      workflowStepId: 'workflow-step-1',
    });
    await harness.consumer.handleGovernanceDecisionRecorded({
      event: secondEvent,
      engineeringSessionId: 'engineering-session-1',
      workflowStepId: 'workflow-step-1',
    });

    expect((await harness.recoveryRequirementRepository.enumerate()).map((item) => item.id.toString())).toEqual([
      'recovery-requirement-1',
      'recovery-requirement-2',
    ]);
    expect(collectRecoveryRequirementEvents(harness.eventBus, 'RecoveryRequirementCreated')).toHaveLength(2);
  });

  it('M7 resolves an Open RecoveryRequirement and rejects further conflicting transition attempts', async () => {
    const { service, recoveryRequirement, eventBus } = await createOpenRecoveryRequirement();

    const resolved = await service.resolveRecoveryRequirement({
      recoveryRequirementId: recoveryRequirement.id,
      acceptedOutcomeReference: 'review-outcome:accepted-remediation',
      resolvedAt: '2026-07-16T02:00:00.000Z',
      attribution: 'builder:primary',
      causality: ['event-recovery-requirement-created-1'],
      correlationId: 'correlation-resolution',
    });

    expect(resolved.status).toBe('Resolved');
    expect(collectRecoveryRequirementEvents(eventBus, 'RecoveryRequirementResolved')).toEqual([
      expect.objectContaining({
        eventType: 'RecoveryRequirementResolved',
        missionId: 'mission-1',
        timestamp: '2026-07-16T02:00:00.000Z',
        causality: ['event-recovery-requirement-created-1'],
        correlationId: 'correlation-resolution',
        attribution: {
          missionId: 'mission-1',
        },
        payload: expect.objectContaining({
          recoveryRequirementId: recoveryRequirement.id,
          recoveryRequirementStatus: 'Resolved',
          governanceDecisionId: 'governance-decision-1',
          acceptedOutcomeReference: 'review-outcome:accepted-remediation',
          resolvedAt: '2026-07-16T02:00:00.000Z',
        }),
      }),
    ]);
    await expect(
      service.withdrawRecoveryRequirement({
        recoveryRequirementId: recoveryRequirement.id,
        authoritativeDecisionReference: 'NEXUS-RAT-2026-07-16-999',
        reason: 'Superseded.',
        withdrawnAt: '2026-07-16T02:05:00.000Z',
        attribution: 'sprint-owner',
      }),
    ).rejects.toThrow(InvalidRecoveryRequirementDefinitionError);
    expect(collectRecoveryRequirementEvents(eventBus, 'RecoveryRequirementWithdrawn')).toHaveLength(0);
  });

  it('M8 withdraws an Open RecoveryRequirement and rejects further conflicting transition attempts', async () => {
    const { service, recoveryRequirement, eventBus } = await createOpenRecoveryRequirement();

    const withdrawn = await service.withdrawRecoveryRequirement({
      recoveryRequirementId: recoveryRequirement.id,
      authoritativeDecisionReference: 'NEXUS-RAT-2026-07-16-009',
      reason: 'Superseding Ratification resolves the rejected input.',
      withdrawnAt: '2026-07-16T02:00:00.000Z',
      attribution: 'sprint-owner',
      causality: ['event-recovery-requirement-created-1'],
      correlationId: 'correlation-withdrawal',
    });

    expect(withdrawn.status).toBe('Withdrawn');
    expect(collectRecoveryRequirementEvents(eventBus, 'RecoveryRequirementWithdrawn')).toEqual([
      expect.objectContaining({
        eventType: 'RecoveryRequirementWithdrawn',
        missionId: 'mission-1',
        timestamp: '2026-07-16T02:00:00.000Z',
        causality: ['event-recovery-requirement-created-1'],
        correlationId: 'correlation-withdrawal',
        attribution: {
          missionId: 'mission-1',
        },
        payload: expect.objectContaining({
          recoveryRequirementId: recoveryRequirement.id,
          recoveryRequirementStatus: 'Withdrawn',
          governanceDecisionId: 'governance-decision-1',
          authoritativeDecisionReference: 'NEXUS-RAT-2026-07-16-009',
          withdrawnAt: '2026-07-16T02:00:00.000Z',
        }),
      }),
    ]);
    await expect(
      service.resolveRecoveryRequirement({
        recoveryRequirementId: recoveryRequirement.id,
        acceptedOutcomeReference: 'review-outcome:accepted-remediation',
        resolvedAt: '2026-07-16T02:05:00.000Z',
        attribution: 'builder:primary',
      }),
    ).rejects.toThrow(InvalidRecoveryRequirementDefinitionError);
    expect(collectRecoveryRequirementEvents(eventBus, 'RecoveryRequirementResolved')).toHaveLength(0);
  });

  it('M9 stores only GovernanceDecision identity and no copied GovernanceDecision diagnostics', async () => {
    const harness = await createHarness('Rejected');

    const recoveryRequirement = await harness.consumer.handleGovernanceDecisionRecorded({
      event: harness.event,
      engineeringSessionId: 'engineering-session-1',
      workflowStepId: 'workflow-step-1',
    });

    expect(recoveryRequirement?.governanceDecisionId).toBe('governance-decision-1');
    expect('criterionResults' in (recoveryRequirement as RecoveryRequirementSnapshot)).toBe(false);
    expect('explanationCodes' in (recoveryRequirement as RecoveryRequirementSnapshot)).toBe(false);
    expect('reviewId' in (recoveryRequirement as RecoveryRequirementSnapshot)).toBe(false);
  });

  it('M9-S59 rehydrates RecoveryRequirement snapshots without recording Domain Events', async () => {
    const { recoveryRequirement } = await createOpenRecoveryRequirement();

    const rehydrated = RecoveryRequirement.fromSnapshot(recoveryRequirement);

    expect(rehydrated.pullDomainEvents()).toEqual([]);
  });

  it('M10 keeps frozen governance workflow and event files free of RecoveryRequirement ownership', () => {
    const frozenFiles = [
      'src\\kernel\\governance\\governance.service.ts',
      'src\\kernel\\governance\\governance-decision.ts',
      'src\\kernel\\execution\\workflow-chain.ts',
      'src\\kernel\\common\\event-bus-contract.ts',
      'src\\kernel\\events\\domain-event.ts',
    ];

    for (const filePath of frozenFiles) {
      expect(readFileSync(filePath, 'utf8')).not.toContain('RecoveryRequirement');
    }
  });

  it('M11 composes RecoveryRequirement service and consumer through createKernelServices', () => {
    const services = createKernelServices(new EventBus(new TestLogger()));

    expect(services.map((service) => service.serviceName)).toContain('RecoveryRequirementService');
    expect(services.map((service) => service.serviceName)).toContain(
      'RecoveryRequirementGovernanceDecisionConsumer',
    );
    const compositionSource = readFileSync('src\\kernel\\common\\create-kernel-services.ts', 'utf8');

    expect(compositionSource).toMatch(
      /new RecoveryRequirementService\(\s*recoveryRequirementRepository,\s*eventBus,\s*\)/,
    );
    expect(compositionSource).toMatch(
      /new RecoveryRequirementGovernanceDecisionConsumer\(\s*governanceDecisionRepository,\s*recoveryRequirementService,\s*engineeringDecisionCorrelationService,\s*engineeringSessionService,\s*eventBus,\s*\)/,
    );
  });

  it('S69-1 subscribes the Recovery consumer exactly once per Kernel composition initialization', async () => {
    const eventBus = new RecordingSubscriptionEventBus(new TestLogger());
    const services = createKernelServices(eventBus);
    const recoveryConsumer = services.find(
      (service): service is RecoveryRequirementGovernanceDecisionConsumer =>
        service instanceof RecoveryRequirementGovernanceDecisionConsumer,
    );
    const advancementConsumer = services.find(
      (service): service is GovernanceGatedWorkflowAdvancementConsumer =>
        service instanceof GovernanceGatedWorkflowAdvancementConsumer,
    );

    expect(recoveryConsumer).toBeDefined();
    expect(advancementConsumer).toBeDefined();

    await recoveryConsumer?.initialize();
    await recoveryConsumer?.initialize();

    expect(eventBus.subscriptionCount('GovernanceDecisionRecorded')).toBe(1);

    for (const service of services) {
      await service.initialize();
    }

    const initializedSubscriptionCount = eventBus.subscriptionCount('GovernanceDecisionRecorded');

    for (const service of services) {
      await service.initialize();
    }

    expect(eventBus.subscriptionCount('GovernanceDecisionRecorded')).toBe(initializedSubscriptionCount);
    expect(initializedSubscriptionCount).toBeGreaterThanOrEqual(2);
    expect(recoveryConsumer?.diagnostics()).toEqual([]);
  });

  it('S69-2 creates one RecoveryRequirement for a Rejected GovernanceDecisionRecorded event using correlated attribution', async () => {
    const harness = await createRecoveryWorkflowAutomationHarness('Rejected');

    await harness.consumer.initialize();
    await harness.eventBus.publish(harness.event);

    expect(harness.consumer.diagnostics()).toMatchObject([
      {
        eventId: 'event-governance-decision-recorded',
        governanceDecisionId: 'governance-decision-1',
        missionId: 'mission-1',
        engineeringSessionId: 'engineering-session-1',
        workflowStepId: 'workflow-step-1',
        status: 'Created',
        recoveryRequirement: {
          id: 'recovery-requirement-1',
          status: 'Open',
        },
      },
    ]);
    await expect(harness.recoveryRequirementRepository.enumerate()).resolves.toHaveLength(1);
    expect(collectRecoveryRequirementEvents(harness.eventBus, 'RecoveryRequirementCreated')).toHaveLength(1);
  });

  it.each(['Approved', 'Deferred', 'Escalation Required'] as const)(
    'S69-3 produces deterministic no-recovery result for %s GovernanceDecision',
    async (governanceDecisionValue) => {
      const harness = await createRecoveryWorkflowAutomationHarness(governanceDecisionValue);

      const result = await harness.consumer.handleEvent(harness.event);

      expect(result).toMatchObject({
        status: 'NotCreated',
        diagnostic: {
          code: 'recovery-workflow-automation.non-rejected-governance-decision',
        },
      });
      await expect(harness.recoveryRequirementRepository.enumerate()).resolves.toEqual([]);
    },
  );

  it('S69-4 fails closed when GovernanceDecision correlation is missing or ambiguous', async () => {
    const harness = await createRecoveryWorkflowAutomationHarness('Rejected', {
      resolveCorrelation: false,
    });

    const result = await harness.consumer.handleEvent(harness.event);

    expect(result).toMatchObject({
      status: 'Rejected',
      diagnostic: {
        code: 'recovery-workflow-automation.correlation-unresolved',
      },
    });
    await expect(harness.recoveryRequirementRepository.enumerate()).resolves.toEqual([]);
  });

  it('S69-5 fails closed on Mission and WorkflowStep attribution mismatches', async () => {
    const missionMismatchHarness = await createRecoveryWorkflowAutomationHarness('Rejected');
    const missionMismatchEvent = {
      ...missionMismatchHarness.event,
      missionId: 'mission-other',
      attribution: {
        missionId: 'mission-other',
      },
    };

    await expect(missionMismatchHarness.consumer.handleEvent(missionMismatchEvent)).resolves.toMatchObject({
      status: 'Rejected',
      diagnostic: {
        code: 'recovery-workflow-automation.mission-mismatch',
      },
    });
    await expect(missionMismatchHarness.recoveryRequirementRepository.enumerate()).resolves.toEqual([]);

    const workflowMismatchHarness = await createRecoveryWorkflowAutomationHarness('Rejected', {
      currentWorkflowStepId: 'workflow-step-other',
    });

    await expect(workflowMismatchHarness.consumer.handleEvent(workflowMismatchHarness.event)).resolves.toMatchObject({
      status: 'Rejected',
      diagnostic: {
        code: 'recovery-workflow-automation.workflow-step-mismatch',
      },
    });
    await expect(workflowMismatchHarness.recoveryRequirementRepository.enumerate()).resolves.toEqual([]);
  });

  it('S69-6 handles duplicate GovernanceDecisionRecorded delivery idempotently', async () => {
    const harness = await createRecoveryWorkflowAutomationHarness('Rejected', {
      identities: [
        'recovery-requirement-1',
        'event-recovery-requirement-created-1',
        'recovery-requirement-2',
        'event-recovery-requirement-created-2',
      ],
    });

    const first = await harness.consumer.handleEvent(harness.event);
    const duplicate = await harness.consumer.handleEvent(harness.event);

    expect(first.status).toBe('Created');
    expect(duplicate).toEqual(first);
    await expect(harness.recoveryRequirementRepository.enumerate()).resolves.toHaveLength(1);
    expect(collectRecoveryRequirementEvents(harness.eventBus, 'RecoveryRequirementCreated')).toHaveLength(1);
  });

  it('S69-7 rejects missing GovernanceDecision and malformed GovernanceDecisionRecorded events deterministically', async () => {
    const missingDecisionHarness = await createRecoveryWorkflowAutomationHarness('Rejected', {
      registerGovernanceDecision: false,
    });

    await expect(missingDecisionHarness.consumer.handleEvent(missingDecisionHarness.event)).resolves.toMatchObject({
      status: 'Rejected',
      diagnostic: {
        code: 'recovery-workflow-automation.governance-decision-not-found',
      },
    });

    const malformedHarness = await createRecoveryWorkflowAutomationHarness('Rejected');

    await expect(
      malformedHarness.consumer.handleEvent({
        ...malformedHarness.event,
        payload: {},
      }),
    ).resolves.toMatchObject({
      status: 'Rejected',
      diagnostic: {
        code: 'recovery-workflow-automation.malformed-event',
      },
    });
    await expect(malformedHarness.recoveryRequirementRepository.enumerate()).resolves.toEqual([]);
  });

  it('S69-8 reports repository failures without partial RecoveryRequirement state', async () => {
    const failingRepository = new FailingRegisterRecoveryRequirementRepository();
    const harness = await createRecoveryWorkflowAutomationHarness('Rejected', {
      recoveryRequirementRepository: failingRepository,
    });

    failingRepository.failNextRegister();

    await expect(harness.consumer.handleEvent(harness.event)).resolves.toMatchObject({
      status: 'Rejected',
      diagnostic: {
        code: 'recovery-workflow-automation.creation-rejected',
        message: 'Injected recovery requirement register failure.',
      },
    });
    await expect(failingRepository.enumerate()).resolves.toEqual([]);
  });

  it('S69-9 invokes only RecoveryRequirementService for creation after resolving correlation', async () => {
    const governanceDecision = createGovernanceDecision('Rejected');
    const calls: string[] = [];
    const consumer = new RecoveryRequirementGovernanceDecisionConsumer(
      {
        async getById() {
          return governanceDecision;
        },
      },
      {
        async createRecoveryRequirement(command) {
          calls.push(
            `create:${command.missionId}:${command.engineeringSessionId}:${command.workflowStepId}:${command.governanceDecisionId}`,
          );

          return {
            id: 'recovery-requirement-service-only',
            missionId: command.missionId,
            engineeringSessionId: command.engineeringSessionId,
            workflowStepId: command.workflowStepId,
            governanceDecisionId: command.governanceDecisionId,
            createdAt: command.createdAt,
            creationCausality: command.creationCausality ?? [],
            ...(command.creationCorrelationId === undefined
              ? {}
              : { creationCorrelationId: command.creationCorrelationId }),
            status: 'Open',
          };
        },
      },
      {
        async findByGovernanceDecisionId() {
          return createCorrelationSnapshot();
        },
      },
      {
        async getEngineeringSession(engineeringSessionId) {
          return createEngineeringSessionSnapshot(engineeringSessionId);
        },
      },
    );

    await expect(
      consumer.handleEvent(
        createGovernanceDecisionRecordedEvent(governanceDecision, {
          eventId: 'event-s69-service-only',
          timestamp: '2026-07-17T01:00:00.000Z',
        }),
      ),
    ).resolves.toMatchObject({
      status: 'Created',
      recoveryRequirement: {
        id: 'recovery-requirement-service-only',
      },
    });
    expect(calls).toEqual([
      'create:mission-1:engineering-session-1:workflow-step-1:governance-decision-1',
    ]);
  });

  it('M12 rejects resolution without an accepted outcome reference', async () => {
    const { service, recoveryRequirement, eventBus } = await createOpenRecoveryRequirement();

    await expect(
      service.resolveRecoveryRequirement({
        recoveryRequirementId: recoveryRequirement.id,
        acceptedOutcomeReference: '',
        resolvedAt: '2026-07-16T02:00:00.000Z',
        attribution: 'builder:primary',
      }),
    ).rejects.toThrow(InvalidRecoveryRequirementDefinitionError);
    expect(collectRecoveryRequirementEvents(eventBus, 'RecoveryRequirementResolved')).toHaveLength(0);
  });

  it('M13 rejects withdrawal without authoritative decision attribution', async () => {
    const { service, recoveryRequirement, eventBus } = await createOpenRecoveryRequirement();

    await expect(
      service.withdrawRecoveryRequirement({
        recoveryRequirementId: recoveryRequirement.id,
        authoritativeDecisionReference: '',
        reason: 'Superseded.',
        withdrawnAt: '2026-07-16T02:00:00.000Z',
        attribution: 'sprint-owner',
      }),
    ).rejects.toThrow(InvalidRecoveryRequirementDefinitionError);
    expect(collectRecoveryRequirementEvents(eventBus, 'RecoveryRequirementWithdrawn')).toHaveLength(0);
  });

  it('M14 preserves immutable resolution metadata after terminal transition', async () => {
    const { service, recoveryRequirement } = await createOpenRecoveryRequirement();

    await service.resolveRecoveryRequirement({
      recoveryRequirementId: recoveryRequirement.id,
      acceptedOutcomeReference: 'review-outcome:accepted-remediation',
      resolvedAt: '2026-07-16T02:00:00.000Z',
      attribution: 'builder:primary',
      causality: ['event-governance-decision-recorded'],
      correlationId: 'correlation-resolution',
    });
    const repeated = await service.resolveRecoveryRequirement({
      recoveryRequirementId: recoveryRequirement.id,
      acceptedOutcomeReference: 'review-outcome:accepted-remediation',
      resolvedAt: '2026-07-16T03:00:00.000Z',
      attribution: 'builder:secondary',
      causality: ['event-second-request'],
      correlationId: 'correlation-second',
    });

    expect(repeated.resolution).toEqual({
      acceptedOutcomeReference: 'review-outcome:accepted-remediation',
      resolvedAt: '2026-07-16T02:00:00.000Z',
      attribution: 'builder:primary',
      causality: ['event-governance-decision-recorded'],
      correlationId: 'correlation-resolution',
    });
  });

  it('M15 preserves immutable withdrawal metadata after terminal transition', async () => {
    const { service, recoveryRequirement } = await createOpenRecoveryRequirement();

    await service.withdrawRecoveryRequirement({
      recoveryRequirementId: recoveryRequirement.id,
      authoritativeDecisionReference: 'NEXUS-RAT-2026-07-16-009',
      reason: 'Superseding Ratification resolves the rejected input.',
      withdrawnAt: '2026-07-16T02:00:00.000Z',
      attribution: 'sprint-owner',
      causality: ['event-governance-decision-recorded'],
      correlationId: 'correlation-withdrawal',
    });
    const repeated = await service.withdrawRecoveryRequirement({
      recoveryRequirementId: recoveryRequirement.id,
      authoritativeDecisionReference: 'NEXUS-RAT-2026-07-16-009',
      reason: 'Different reason is ignored for idempotent repeated terminal request.',
      withdrawnAt: '2026-07-16T03:00:00.000Z',
      attribution: 'delegate',
      causality: ['event-second-request'],
      correlationId: 'correlation-second',
    });

    expect(repeated.withdrawal).toEqual({
      authoritativeDecisionReference: 'NEXUS-RAT-2026-07-16-009',
      reason: 'Superseding Ratification resolves the rejected input.',
      withdrawnAt: '2026-07-16T02:00:00.000Z',
      attribution: 'sprint-owner',
      causality: ['event-governance-decision-recorded'],
      correlationId: 'correlation-withdrawal',
    });
  });

  it('M16 handles repeated identical terminal transition requests idempotently', async () => {
    const { service, recoveryRequirement } = await createOpenRecoveryRequirement();

    const first = await service.resolveRecoveryRequirement({
      recoveryRequirementId: recoveryRequirement.id,
      acceptedOutcomeReference: 'review-outcome:accepted-remediation',
      resolvedAt: '2026-07-16T02:00:00.000Z',
      attribution: 'builder:primary',
    });
    const repeated = await service.resolveRecoveryRequirement({
      recoveryRequirementId: recoveryRequirement.id,
      acceptedOutcomeReference: 'review-outcome:accepted-remediation',
      resolvedAt: '2026-07-16T02:00:00.000Z',
      attribution: 'builder:primary',
    });

    expect(repeated).toEqual(first);
  });

  it('M17 rejects conflicting terminal transitions in both directions', async () => {
    const resolvedRequirement = await createOpenRecoveryRequirement('resolved-requirement');
    const withdrawnRequirement = await createOpenRecoveryRequirement('withdrawn-requirement');

    await resolvedRequirement.service.resolveRecoveryRequirement({
      recoveryRequirementId: resolvedRequirement.recoveryRequirement.id,
      acceptedOutcomeReference: 'review-outcome:accepted-remediation',
      resolvedAt: '2026-07-16T02:00:00.000Z',
      attribution: 'builder:primary',
    });
    await withdrawnRequirement.service.withdrawRecoveryRequirement({
      recoveryRequirementId: withdrawnRequirement.recoveryRequirement.id,
      authoritativeDecisionReference: 'NEXUS-RAT-2026-07-16-009',
      reason: 'Superseded.',
      withdrawnAt: '2026-07-16T02:00:00.000Z',
      attribution: 'sprint-owner',
    });

    await expect(
      resolvedRequirement.service.withdrawRecoveryRequirement({
        recoveryRequirementId: resolvedRequirement.recoveryRequirement.id,
        authoritativeDecisionReference: 'NEXUS-RAT-2026-07-16-009',
        reason: 'Superseded.',
        withdrawnAt: '2026-07-16T02:05:00.000Z',
        attribution: 'sprint-owner',
      }),
    ).rejects.toThrow(InvalidRecoveryRequirementDefinitionError);
    await expect(
      withdrawnRequirement.service.resolveRecoveryRequirement({
        recoveryRequirementId: withdrawnRequirement.recoveryRequirement.id,
        acceptedOutcomeReference: 'review-outcome:accepted-remediation',
        resolvedAt: '2026-07-16T02:05:00.000Z',
        attribution: 'builder:primary',
      }),
    ).rejects.toThrow(InvalidRecoveryRequirementDefinitionError);
  });
});

async function createOpenRecoveryRequirement(id = 'recovery-requirement-1'): Promise<{
  readonly service: RecoveryRequirementService;
  readonly recoveryRequirement: RecoveryRequirementSnapshot;
  readonly eventBus: CollectingEventBus;
}> {
  const harness = await createHarness('Rejected', [id, 'event-recovery-requirement-created-1']);
  const recoveryRequirement = await harness.consumer.handleGovernanceDecisionRecorded({
    event: harness.event,
    engineeringSessionId: 'engineering-session-1',
    workflowStepId: 'workflow-step-1',
  });

  if (recoveryRequirement === undefined) {
    throw new Error('Expected RecoveryRequirement to be created.');
  }

  return {
    service: harness.service,
    recoveryRequirement,
    eventBus: harness.eventBus,
  };
}

async function createHarness(
  governanceDecisionValue: GovernanceDecisionValue,
  identities: string[] = ['recovery-requirement-1', 'event-recovery-requirement-created-1'],
): Promise<{
  readonly governanceDecisionRepository: InMemoryGovernanceDecisionRepository;
  readonly recoveryRequirementRepository: InMemoryRecoveryRequirementRepository;
  readonly service: RecoveryRequirementService;
  readonly consumer: RecoveryRequirementGovernanceDecisionConsumer;
  readonly event: ReturnType<typeof createGovernanceDecisionRecordedEvent>;
  readonly eventBus: CollectingEventBus;
}> {
  const governanceDecisionRepository = new InMemoryGovernanceDecisionRepository();
  const recoveryRequirementRepository = new InMemoryRecoveryRequirementRepository();
  const eventBus = new CollectingEventBus(new TestLogger());
  let generatedIdentityCount = 0;
  const createIdentity = (): string => {
    const identity = identities.shift();

    if (identity !== undefined) {
      return identity;
    }

    generatedIdentityCount += 1;

    return `generated-recovery-requirement-event-${generatedIdentityCount}`;
  };
  const service = new RecoveryRequirementService(
    recoveryRequirementRepository,
    eventBus,
    createIdentity,
  );
  const consumer = new RecoveryRequirementGovernanceDecisionConsumer(
    governanceDecisionRepository,
    service,
    undefined,
    undefined,
    eventBus,
  );
  const governanceDecision = createGovernanceDecision(governanceDecisionValue);
  const event = createGovernanceDecisionRecordedEvent(governanceDecision, {
    eventId: 'event-governance-decision-recorded',
    timestamp: '2026-07-16T01:00:00.000Z',
    causality: ['event-policy-evaluation'],
    correlationId: 'correlation-1',
  });

  await governanceDecisionRepository.register(governanceDecision);

  return {
    governanceDecisionRepository,
    recoveryRequirementRepository,
    service,
    consumer,
    event,
    eventBus,
  };
}

interface RecoveryWorkflowAutomationHarnessInput {
  readonly identities?: string[];
  readonly correlation?: ReturnType<typeof createCorrelationSnapshot> | undefined;
  readonly resolveCorrelation?: boolean;
  readonly currentWorkflowStepId?: string;
  readonly registerGovernanceDecision?: boolean;
  readonly recoveryRequirementRepository?: InMemoryRecoveryRequirementRepository;
}

async function createRecoveryWorkflowAutomationHarness(
  governanceDecisionValue: GovernanceDecisionValue,
  input: RecoveryWorkflowAutomationHarnessInput = {},
): Promise<{
  readonly governanceDecisionRepository: InMemoryGovernanceDecisionRepository;
  readonly recoveryRequirementRepository: InMemoryRecoveryRequirementRepository;
  readonly service: RecoveryRequirementService;
  readonly consumer: RecoveryRequirementGovernanceDecisionConsumer;
  readonly event: ReturnType<typeof createGovernanceDecisionRecordedEvent>;
  readonly eventBus: CollectingEventBus;
}> {
  const identities = input.identities ?? [
    'recovery-requirement-1',
    'event-recovery-requirement-created-1',
  ];
  const governanceDecisionRepository = new InMemoryGovernanceDecisionRepository();
  const recoveryRequirementRepository =
    input.recoveryRequirementRepository ?? new InMemoryRecoveryRequirementRepository();
  const eventBus = new CollectingEventBus(new TestLogger());
  const createIdentity = createIdentitySequence(identities);
  const service = new RecoveryRequirementService(
    recoveryRequirementRepository,
    eventBus,
    createIdentity,
  );
  const correlation = input.resolveCorrelation === false
    ? undefined
    : input.correlation ?? createCorrelationSnapshot();
  const consumer = new RecoveryRequirementGovernanceDecisionConsumer(
    governanceDecisionRepository,
    service,
    {
      async findByGovernanceDecisionId() {
        return correlation;
      },
    },
    {
      async getEngineeringSession(engineeringSessionId) {
        return createEngineeringSessionSnapshot(
          engineeringSessionId,
          input.currentWorkflowStepId ?? 'workflow-step-1',
        );
      },
    },
    eventBus,
  );
  const governanceDecision = createGovernanceDecision(governanceDecisionValue);
  const event = createGovernanceDecisionRecordedEvent(governanceDecision, {
    eventId: 'event-governance-decision-recorded',
    timestamp: '2026-07-16T01:00:00.000Z',
    causality: ['event-policy-evaluation'],
    correlationId: 'correlation-1',
  });

  if (input.registerGovernanceDecision ?? true) {
    await governanceDecisionRepository.register(governanceDecision);
  }

  return {
    governanceDecisionRepository,
    recoveryRequirementRepository,
    service,
    consumer,
    event,
    eventBus,
  };
}

class FailingRegisterRecoveryRequirementRepository extends InMemoryRecoveryRequirementRepository {
  private shouldFailNextRegister = false;

  public failNextRegister(): void {
    this.shouldFailNextRegister = true;
  }

  public override async register(
    recoveryRequirement: RecoveryRequirement,
  ): Promise<RecoveryRequirement> {
    if (this.shouldFailNextRegister) {
      this.shouldFailNextRegister = false;
      throw new Error('Injected recovery requirement register failure.');
    }

    return super.register(recoveryRequirement);
  }
}

function createIdentitySequence(identities: string[]): () => string {
  return () => {
    const identity = identities.shift();

    if (identity === undefined) {
      throw new Error('No identity available for test.');
    }

    return identity;
  };
}

function createCorrelationSnapshot(): {
  readonly id: string;
  readonly missionId: string;
  readonly engineeringSessionId: string;
  readonly workflowStepId: string;
  readonly reviewId: string;
  readonly governanceDecisionId: string;
  readonly createdAt: string;
  readonly creationCausality: readonly string[];
} {
  return {
    id: 'engineering-decision-correlation-1',
    missionId: 'mission-1',
    engineeringSessionId: 'engineering-session-1',
    workflowStepId: 'workflow-step-1',
    reviewId: 'review-1',
    governanceDecisionId: 'governance-decision-1',
    createdAt: '2026-07-16T00:00:00.000Z',
    creationCausality: [],
  };
}

function createEngineeringSessionSnapshot(
  engineeringSessionId: string,
  currentWorkflowStepId = 'workflow-step-1',
): {
  readonly id: string;
  readonly status: 'Open';
  readonly engineeringRuntimeContextReference: string;
  readonly activeEngineeringWorkflowReference: string;
  readonly workflowChainId: string;
  readonly currentWorkflowStepId: string;
  readonly participatingRoleIds: readonly string[];
  readonly workflowState: 'active';
  readonly timeline: {
    readonly createdAt: string;
    readonly statusTransitions: readonly [{
      readonly status: 'Open';
      readonly occurredAt: string;
    }];
  };
  readonly diagnostics: readonly [];
  readonly collaborationMetadata: Record<string, never>;
} {
  return {
    id: engineeringSessionId,
    status: 'Open',
    engineeringRuntimeContextReference: 'runtime-context',
    activeEngineeringWorkflowReference: 'workflow',
    workflowChainId: 'workflow-chain-1',
    currentWorkflowStepId,
    participatingRoleIds: ['builder'],
    workflowState: 'active',
    timeline: {
      createdAt: '2026-07-16T00:00:00.000Z',
      statusTransitions: [
        {
          status: 'Open',
          occurredAt: '2026-07-16T00:00:00.000Z',
        },
      ],
    },
    diagnostics: [],
    collaborationMetadata: {},
  };
}

function collectRecoveryRequirementEvents(
  eventBus: CollectingEventBus,
  eventType: EventBusEvent['eventType'],
): readonly EventBusEvent[] {
  return eventBus.publishedEvents.filter((event) => event.eventType === eventType);
}

function createGovernanceDecision(
  value: GovernanceDecisionValue,
  id = 'governance-decision-1',
): GovernanceDecision {
  return GovernanceDecision.fromSnapshot({
    id,
    missionId: 'mission-1',
    value,
    repositoryPolicyId: 'repository-policy-1',
    repositoryPolicyVersion: 1,
    reviewId: 'review-1',
    reviewStateReference: 'review-state-1',
    policyEvaluationId: `policy-evaluation-${id}`,
    evaluationKey: `repository-policy-1:1:mission-1:${id}`,
    criterionResults: [
      {
        policyCriterionId: 'criterion-1',
        predicateKind: 'ReviewOutcomeMembership',
        predicateSchemaVersion: '1',
        status: value === 'Rejected' ? 'Violated' : 'Satisfied',
        findingReferences: [],
        explanationCode: `governance-decision-${value.toLowerCase().replaceAll(' ', '-')}`,
      },
    ],
    evaluatedAt: '2026-07-16T01:00:00.000Z',
    explanationCodes: [`governance-decision-${value.toLowerCase().replaceAll(' ', '-')}`],
  });
}
