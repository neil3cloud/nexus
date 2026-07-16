import { execFileSync } from 'node:child_process';

import { describe, expect, it } from 'vitest';

import type {
  EventBusEvent,
} from '../../src/kernel/common/event-bus-contract';
import type { KernelLogger } from '../../src/kernel/common/kernel-logger';
import { EventBus } from '../../src/kernel/events/event-bus';
import { InMemoryEngineeringSessionCheckpointRepository } from '../../src/kernel/execution/engineering-session-checkpoint.repository';
import { InMemoryEngineeringDecisionCorrelationRepository } from '../../src/kernel/execution/engineering-decision-correlation.repository';
import { EngineeringDecisionCorrelationService } from '../../src/kernel/execution/engineering-decision-correlation.service';
import { GovernanceGatedWorkflowAdvancementConsumer } from '../../src/kernel/execution/governance-gated-workflow-advancement.consumer';
import { InMemoryEngineeringSessionRepository } from '../../src/kernel/execution/engineering-session.repository';
import { EngineeringSessionService } from '../../src/kernel/execution/engineering-session.service';
import { EngineeringSessionStateProjectionService } from '../../src/kernel/execution/engineering-session-state-projection.service';
import { InMemoryEngineeringSessionStateProjectionRepository } from '../../src/kernel/execution/engineering-session-state-projection.repository';
import { MissionEngineeringOrchestrationService } from '../../src/kernel/execution/mission-engineering-orchestration.service';
import {
  InMemoryEngineeringSessionHandoffRepository,
  InMemoryMissionEngineeringGroupRepository,
} from '../../src/kernel/execution/mission-engineering-orchestration.repository';
import { RecoveryRequirementGovernanceDecisionConsumer } from '../../src/kernel/execution/recovery-requirement-governance-decision.consumer';
import {
  InMemoryRecoveryRequirementRepository,
  type IRecoveryRequirementRepository,
} from '../../src/kernel/execution/recovery-requirement.repository';
import { RecoveryRequirementService } from '../../src/kernel/execution/recovery-requirement.service';
import { WorkflowChainService } from '../../src/kernel/execution/workflow-chain.service';
import { InMemoryWorkflowChainRepository } from '../../src/kernel/execution/workflow-chain.repository';
import { GovernanceService } from '../../src/kernel/governance/governance.service';
import type {
  GovernanceDecisionSnapshot,
  GovernanceDecisionValue,
} from '../../src/kernel/governance/governance.types';
import {
  InMemoryGovernanceDecisionRepository,
  type IGovernanceDecisionRepository,
} from '../../src/kernel/governance/governance-decision.repository';
import { GovernanceStateProjectionService } from '../../src/kernel/governance/governance-state-projection.service';
import { InMemoryGovernanceStateProjectionRepository } from '../../src/kernel/governance/governance-state-projection.repository';
import { InMemoryRatificationAuthoritySnapshotRepository } from '../../src/kernel/governance/ratification-authority.repository';
import { RatificationAuthoritySnapshot } from '../../src/kernel/governance/ratification-authority-snapshot';
import { RatificationAttributionValidationService } from '../../src/kernel/governance/ratification-attribution-validation';
import type { RatificationAuthorityRecordInput } from '../../src/kernel/governance/ratification-attribution.types';
import { RepositoryPolicyService } from '../../src/kernel/governance/repository-policy.service';
import { InMemoryRepositoryPolicyRepository } from '../../src/kernel/governance/repository-policy.repository';
import type { PolicyCriterionInput } from '../../src/kernel/governance/repository-policy.types';
import { MissionExecutionService } from '../../src/kernel/mission/mission-execution.service';
import { GovernanceGatedMissionCompletionCoordinator } from '../../src/kernel/mission/governance-gated-mission-completion.coordinator';
import { MissionId } from '../../src/kernel/mission/mission-id';
import { MissionPlanningService } from '../../src/kernel/mission/mission-planning.service';
import { InMemoryMissionRepository } from '../../src/kernel/mission/mission.repository';
import { MissionService } from '../../src/kernel/mission/mission.service';
import { ReviewService } from '../../src/kernel/review/review.service';
import { InMemoryReviewRepository } from '../../src/kernel/review/review.repository';
import type { ReviewOutcomeValue } from '../../src/kernel/review/review.types';

const missionId = 'mission-sprint-70';
const missionPlanId = 'mission-plan-sprint-70';
const taskId = 'task-sprint-70';
const workflowChainId = 'workflow-chain-sprint-70';
const engineeringSessionId = 'engineering-session-sprint-70';
const currentWorkflowStepId = '0';
const repositoryPolicyId = 'repository-policy-sprint-70';
const repositoryPolicyVersion = 1;
const ratificationId = 'NEXUS-RAT-2026-07-17-008';
const timestamp = '2026-07-17T04:00:00.000Z';

describe('Sprint 70 autonomous engineering integration validation', () => {
  it('Scenario 1: Approved governance advances the exact correlated Workflow position once and updates projection', async () => {
    const harness = await createAutonomousEngineeringHarness();
    await harness.registerPolicy([reviewOutcomeCriterion('review-accepted', ['Accepted'])]);
    const correlation = await harness.beginCorrelation();
    const review = await harness.createCompletedReview('review-approved', 'Accepted');
    await harness.correlationService.associateReview({
      correlationId: correlation.id,
      reviewId: review.review.id,
    });

    const decision = await harness.evaluateGovernance(review.review.id, 'governance-decision-approved');
    await harness.correlationService.associateGovernanceDecision({
      correlationId: correlation.id,
      governanceDecisionId: decision.id,
    });
    const event = harness.requireGovernanceDecisionRecordedEvent(decision.id);
    const recoveryResult = await harness.recoveryConsumer.handleEvent(event);
    const firstAdvancement = await harness.advancementConsumer.handleEvent(event);
    const duplicateAdvancement = await harness.advancementConsumer.handleEvent(event);
    const sessionProjection =
      await harness.sessionProjectionService.getEngineeringSessionStateProjection(engineeringSessionId);

    expect(decision.value).toBe('Approved');
    expect(firstAdvancement).toMatchObject({
      status: 'Advanced',
      engineeringSessionId,
      workflowStepId: currentWorkflowStepId,
      engineeringSession: {
        currentWorkflowStepId: '1',
      },
    });
    expect(duplicateAdvancement).toEqual(firstAdvancement);
    expect(sessionProjection).toMatchObject({
      engineeringSessionId,
      previousWorkflowStepId: currentWorkflowStepId,
      currentWorkflowStepId: '1',
      latestAdvancementStrategy: 'GovernanceGated',
      revision: 1,
    });
    expect(recoveryResult).toMatchObject({
      status: 'NotCreated',
      diagnostic: {
        code: 'recovery-workflow-automation.non-rejected-governance-decision',
      },
    });
    await expect(harness.recoveryRequirementRepository.enumerate()).resolves.toEqual([]);
    expect(harness.eventsOfType('EngineeringSessionWorkflowAdvanced')).toHaveLength(1);
  });

  it('Scenario 2: Rejected governance creates one Recovery Requirement and does not advance Workflow', async () => {
    const harness = await createAutonomousEngineeringHarness();
    await harness.registerPolicy([reviewOutcomeCriterion('review-must-be-rejected', ['Rejected'])]);
    const correlation = await harness.beginCorrelation();
    const review = await harness.createCompletedReview('review-rejected-path', 'Accepted');
    await harness.correlationService.associateReview({
      correlationId: correlation.id,
      reviewId: review.review.id,
    });

    const decision = await harness.evaluateGovernance(
      review.review.id,
      'governance-decision-rejected',
    );
    await harness.correlationService.associateGovernanceDecision({
      correlationId: correlation.id,
      governanceDecisionId: decision.id,
    });
    const event = harness.requireGovernanceDecisionRecordedEvent(decision.id);
    const advancement = await harness.advancementConsumer.handleEvent(event);
    const recovery = await harness.recoveryConsumer.handleEvent(event);
    const duplicateRecovery = await harness.recoveryConsumer.handleEvent(event);
    const projection = await harness.governanceProjectionService.getGovernanceStateProjection(missionId);

    expect(decision.value).toBe('Rejected');
    expect(advancement).toMatchObject({
      status: 'NotAdvanced',
      engineeringSession: {
        currentWorkflowStepId,
      },
    });
    expect(recovery).toMatchObject({
      status: 'Created',
      recoveryRequirement: {
        missionId,
        engineeringSessionId,
        workflowStepId: currentWorkflowStepId,
        governanceDecisionId: decision.id,
        status: 'Open',
      },
    });
    expect(duplicateRecovery).toEqual(recovery);
    await expect(harness.recoveryRequirementRepository.enumerate()).resolves.toHaveLength(1);
    await expect(harness.requireEngineeringSessionStep()).resolves.toBe(currentWorkflowStepId);
    expect(projection).toMatchObject({
      latestGovernanceDecision: {
        outcome: 'Rejected',
      },
      isBlocking: true,
      unresolvedRecoveryRequirements: [
        expect.objectContaining({
          governanceDecisionId: decision.id,
          status: 'Open',
        }),
      ],
    });
    expect(harness.eventsOfType('EngineeringSessionWorkflowAdvanced')).toHaveLength(0);
  });

  it('Scenario 3: Recovery resolution restores eligibility and re-advancement occurs through the advancement path', async () => {
    const harness = await createAutonomousEngineeringHarness();
    const rejectedDecision = await harness.createRejectedDecisionWithRecovery();
    const recoveryRequirement = await harness.requireSingleRecoveryRequirement();
    const beforeResolutionStep = await harness.requireEngineeringSessionStep();

    const resolved = await harness.recoveryRequirementService.resolveRecoveryRequirement({
      recoveryRequirementId: recoveryRequirement.id,
      acceptedOutcomeReference: 'review-outcome:accepted-remediation',
      resolvedAt: '2026-07-17T04:10:00.000Z',
      attribution: 'builder:sprint-70',
      causality: ['event-recovery-requirement-created'],
    });
    const afterResolutionStep = await harness.requireEngineeringSessionStep();
    const event = harness.requireGovernanceDecisionRecordedEvent(rejectedDecision.id);
    const projection = await harness.governanceProjectionService.getGovernanceStateProjection(missionId);

    expect(beforeResolutionStep).toBe(currentWorkflowStepId);
    expect(afterResolutionStep).toBe(currentWorkflowStepId);
    expect(resolved).toMatchObject({
      id: recoveryRequirement.id,
      governanceDecisionId: rejectedDecision.id,
      status: 'Resolved',
      resolution: {
        acceptedOutcomeReference: 'review-outcome:accepted-remediation',
      },
    });
    await expect(harness.advancementConsumer.handleEvent(event)).resolves.toMatchObject({
      status: 'NotAdvanced',
      diagnostic: {
        code: 'event-driven-workflow-advancement.blocking-governance-decision',
      },
    });
    const reAdvancement =
      await harness.advancementConsumer.handleGovernanceDecisionRecorded({
        event,
        engineeringSessionId,
        currentWorkflowStepId,
      });
    const duplicateReAdvancement =
      await harness.advancementConsumer.handleGovernanceDecisionRecorded({
        event,
        engineeringSessionId,
        currentWorkflowStepId,
      });
    expect(reAdvancement).toMatchObject({
      currentWorkflowStepId: '1',
    });
    expect(duplicateReAdvancement).toEqual(reAdvancement);
    expect(projection).toMatchObject({
      isBlocking: false,
      unresolvedRecoveryRequirements: [],
      recoveryRequirements: [
        expect.objectContaining({
          recoveryRequirementId: recoveryRequirement.id,
          governanceDecisionId: rejectedDecision.id,
          status: 'Resolved',
        }),
      ],
    });
  });

  it('Scenario 4: Governance-gated Mission completion permits Approved and blocks non-approved outcomes', async () => {
    const approvedHarness = await createAutonomousEngineeringHarness();
    const approvedDecision = await approvedHarness.createDecision('Approved');
    const approvedEvent = approvedHarness.requireGovernanceDecisionRecordedEvent(approvedDecision.id);

    expect(await approvedHarness.completionCoordinator.handleEvent(approvedEvent)).toMatchObject({
      status: 'Completed',
      projection: {
        latestGovernanceDecision: {
          outcome: 'Approved',
        },
      },
    });
    await expect(approvedHarness.requireMissionStatus()).resolves.toBe('Completed');

    for (const value of ['Rejected', 'Deferred', 'Escalation Required'] as const) {
      const blockingHarness = await createAutonomousEngineeringHarness(
        value === 'Escalation Required'
          ? {
              authorityRecords: [
                ratificationRecord({
                  lifecycleStatus: 'Withdrawn',
                  withdrawnByRatificationId: 'NEXUS-RAT-2026-07-17-999',
                }),
              ],
            }
          : {},
      );
      const decision = await blockingHarness.createDecision(value);
      const event = blockingHarness.requireGovernanceDecisionRecordedEvent(decision.id);
      const diagnostic = await blockingHarness.completionCoordinator.handleEvent(event);

      expect(decision.value).toBe(value);
      expect(diagnostic.status).not.toBe('Completed');
      await expect(blockingHarness.requireMissionStatus()).resolves.toBe('Reviewing');
    }

    const unresolvedHarness = await createAutonomousEngineeringHarness();
    const unresolvedDecision = await unresolvedHarness.createRejectedDecisionWithRecovery();
    const unresolvedEvent =
      unresolvedHarness.requireGovernanceDecisionRecordedEvent(unresolvedDecision.id);

    await expect(unresolvedHarness.completionCoordinator.handleEvent(unresolvedEvent)).resolves.toMatchObject({
      status: 'Skipped',
      projection: {
        isBlocking: true,
      },
    });
    await expect(unresolvedHarness.requireMissionStatus()).resolves.toBe('Reviewing');
  });

  it('Scenario 5: Missing correlation fails closed without fallback inference or downstream mutation', async () => {
    const harness = await createAutonomousEngineeringHarness();
    const decision = await harness.createDecision('Approved');
    const event = harness.requireGovernanceDecisionRecordedEvent(decision.id);
    const beforeStep = await harness.requireEngineeringSessionStep();
    const beforeRequirements = await harness.recoveryRequirementRepository.enumerate();

    const advancement = await harness.advancementConsumer.handleEvent(event);
    const recovery = await harness.recoveryConsumer.handleEvent(event);

    expect(advancement).toMatchObject({
      status: 'Rejected',
      diagnostic: {
        code: 'event-driven-workflow-advancement.correlation-unresolved',
      },
    });
    expect(recovery).toMatchObject({
      status: 'Rejected',
      diagnostic: {
        code: 'recovery-workflow-automation.correlation-unresolved',
      },
    });
    await expect(harness.requireEngineeringSessionStep()).resolves.toBe(beforeStep);
    await expect(harness.recoveryRequirementRepository.enumerate()).resolves.toEqual(beforeRequirements);
    expect(harness.eventsOfType('EngineeringSessionWorkflowAdvanced')).toHaveLength(0);
    expect(harness.eventsOfType('RecoveryRequirementCreated')).toHaveLength(0);
  });

  it('Scenario 6: Attribution mismatches fail closed without advancement, recovery, or projection mutation', async () => {
    const missionMismatchHarness = await createAutonomousEngineeringHarness();
    const missionMismatch = await missionMismatchHarness.createCorrelatedDecision('Approved');
    const missionMismatchEvent: EventBusEvent = {
      ...missionMismatch.event,
      missionId: 'mission-sprint-70-other',
      attribution: {
        missionId: 'mission-sprint-70-other',
      },
    };
    const missionProjectionBefore =
      await missionMismatchHarness.sessionProjectionService.getEngineeringSessionStateProjection(
        engineeringSessionId,
      );

    await expect(
      missionMismatchHarness.advancementConsumer.handleEvent(missionMismatchEvent),
    ).resolves.toMatchObject({
      status: 'Rejected',
      diagnostic: {
        code: 'event-driven-workflow-advancement.mission-mismatch',
      },
    });
    await expect(
      missionMismatchHarness.recoveryConsumer.handleEvent(missionMismatchEvent),
    ).resolves.toMatchObject({
      status: 'Rejected',
      diagnostic: {
        code: 'recovery-workflow-automation.mission-mismatch',
      },
    });
    await expect(
      missionMismatchHarness.sessionProjectionService.getEngineeringSessionStateProjection(
        engineeringSessionId,
      ),
    ).resolves.toEqual(missionProjectionBefore);

    const stepMismatchHarness = await createAutonomousEngineeringHarness();
    const stepMismatch = await stepMismatchHarness.createCorrelatedDecision('Rejected', {
      correlationWorkflowStepId: '1',
    });

    await expect(
      stepMismatchHarness.advancementConsumer.handleEvent(stepMismatch.event),
    ).resolves.toMatchObject({
      status: 'Rejected',
      diagnostic: {
        code: 'event-driven-workflow-advancement.workflow-step-mismatch',
      },
    });
    await expect(stepMismatchHarness.recoveryConsumer.handleEvent(stepMismatch.event)).resolves.toMatchObject({
      status: 'Rejected',
      diagnostic: {
        code: 'recovery-workflow-automation.workflow-step-mismatch',
      },
    });
    await expect(stepMismatchHarness.requireEngineeringSessionStep()).resolves.toBe(currentWorkflowStepId);
    await expect(stepMismatchHarness.recoveryRequirementRepository.enumerate()).resolves.toEqual([]);
  });

  it('Scenario 7: Duplicate and replay delivery create equivalent final state without duplicate effects', async () => {
    const firstHarness = await createAutonomousEngineeringHarness();
    const secondHarness = await createAutonomousEngineeringHarness();

    await exerciseApprovedPath(firstHarness);
    await exerciseApprovedPath(secondHarness);

    const firstProjection =
      await firstHarness.sessionProjectionService.getEngineeringSessionStateProjection(engineeringSessionId);
    const secondProjection =
      await secondHarness.sessionProjectionService.getEngineeringSessionStateProjection(engineeringSessionId);

    expect(secondProjection).toEqual(firstProjection);
    expect(firstHarness.eventsOfType('EngineeringSessionWorkflowAdvanced')).toHaveLength(1);
    expect(secondHarness.eventsOfType('EngineeringSessionWorkflowAdvanced')).toHaveLength(1);
    await expect(firstHarness.requireEngineeringSessionStep()).resolves.toBe('1');
    await expect(secondHarness.requireEngineeringSessionStep()).resolves.toBe('1');

    const event = firstHarness.eventsOfType('GovernanceDecisionRecorded')[0];

    if (event === undefined) {
      throw new Error('Expected GovernanceDecisionRecorded event.');
    }

    await expect(firstHarness.advancementConsumer.handleEvent(event)).resolves.toEqual(
      firstHarness.advancementConsumer.diagnostics()[0],
    );
    expect(firstHarness.eventsOfType('EngineeringSessionWorkflowAdvanced')).toHaveLength(1);
  });

  it('Scenario 8: Persistence failures isolate publication and prevent partial downstream state', async () => {
    const governanceFailureHarness = await createAutonomousEngineeringHarness({
      governanceDecisionRepository: new FailingGovernanceDecisionRepository(),
    });
    await governanceFailureHarness.registerPolicy([reviewOutcomeCriterion('review-accepted', ['Accepted'])]);
    const review = await governanceFailureHarness.createCompletedReview('review-governance-failure', 'Accepted');

    await expect(
      governanceFailureHarness.evaluateGovernance(review.review.id, 'governance-decision-failure'),
    ).rejects.toThrow('GovernanceDecision persistence failed.');
    expect(governanceFailureHarness.eventsOfType('GovernanceDecisionRecorded')).toHaveLength(0);
    expect(governanceFailureHarness.eventsOfType('RecoveryRequirementCreated')).toHaveLength(0);

    const advancementFailureRepository = new FailingEngineeringSessionRepository();
    const advancementFailureHarness = await createAutonomousEngineeringHarness({
      engineeringSessionRepository: advancementFailureRepository,
    });
    const advancementFailure = await advancementFailureHarness.createCorrelatedDecision('Approved');
    advancementFailureRepository.failNextSave();

    await expect(
      advancementFailureHarness.advancementConsumer.handleEvent(advancementFailure.event),
    ).resolves.toMatchObject({
      status: 'Rejected',
      diagnostic: {
        code: 'event-driven-workflow-advancement.advancement-rejected',
        message: 'EngineeringSession persistence failed.',
      },
    });
    expect(advancementFailureHarness.eventsOfType('EngineeringSessionWorkflowAdvanced')).toHaveLength(0);
    await expect(advancementFailureHarness.requireEngineeringSessionStep()).resolves.toBe(
      currentWorkflowStepId,
    );

    const recoveryFailureRepository = new FailingRecoveryRequirementRepository();
    const recoveryFailureHarness = await createAutonomousEngineeringHarness({
      recoveryRequirementRepository: recoveryFailureRepository,
    });
    const recoveryFailure = await recoveryFailureHarness.createCorrelatedDecision('Rejected');
    recoveryFailureRepository.failNextRegister();

    await expect(recoveryFailureHarness.recoveryConsumer.handleEvent(recoveryFailure.event)).resolves.toMatchObject({
      status: 'Rejected',
      diagnostic: {
        code: 'recovery-workflow-automation.creation-rejected',
        message: 'RecoveryRequirement persistence failed.',
      },
    });
    expect(recoveryFailureHarness.eventsOfType('RecoveryRequirementCreated')).toHaveLength(0);
    await expect(recoveryFailureHarness.recoveryRequirementRepository.enumerate()).resolves.toEqual([]);
  });

  it('Lifecycle Certification Flow: composes rejection, recovery, re-advancement, approval, projection, and RFC-gated Mission completion rejection', async () => {
    const harness = await createAutonomousEngineeringHarness();
    const rejectedDecision = await harness.createRejectedDecisionWithRecovery();
    const recoveryRequirement = await harness.requireSingleRecoveryRequirement();

    await harness.recoveryRequirementService.resolveRecoveryRequirement({
      recoveryRequirementId: recoveryRequirement.id,
      acceptedOutcomeReference: 'review-outcome:accepted-remediation',
      resolvedAt: '2026-07-17T04:15:00.000Z',
      attribution: 'builder:sprint-70',
      causality: ['event-recovery-requirement-created'],
    });
    const rejectedEvent = harness.requireGovernanceDecisionRecordedEvent(rejectedDecision.id);
    await expect(harness.advancementConsumer.handleEvent(rejectedEvent)).resolves.toMatchObject({
      status: 'NotAdvanced',
      diagnostic: {
        code: 'event-driven-workflow-advancement.blocking-governance-decision',
      },
    });
    const reAdvancement =
      await harness.advancementConsumer.handleGovernanceDecisionRecorded({
        event: rejectedEvent,
        engineeringSessionId,
        currentWorkflowStepId,
      });
    const approvedCorrelation = await harness.beginCorrelation('1');
    const approvedReview = await harness.createCompletedReview('review-approved-after-recovery', 'Rejected');
    await harness.correlationService.associateReview({
      correlationId: approvedCorrelation.id,
      reviewId: approvedReview.review.id,
    });
    const approvedDecision = await harness.evaluateGovernance(
      approvedReview.review.id,
      'governance-decision-approved-after-recovery',
      '2026-07-17T04:20:00.000Z',
    );
    await harness.correlationService.associateGovernanceDecision({
      correlationId: approvedCorrelation.id,
      governanceDecisionId: approvedDecision.id,
    });
    const approvedEvent = harness.requireGovernanceDecisionRecordedEvent(approvedDecision.id);

    expect(reAdvancement).toMatchObject({
      currentWorkflowStepId: '1',
    });
    expect(approvedDecision.value).toBe('Approved');
    expect(
      await harness.sessionProjectionService.getEngineeringSessionStateProjection(engineeringSessionId),
    ).toMatchObject({
      currentWorkflowStepId: '1',
      latestAdvancementStrategy: 'GovernanceGated',
      revision: 1,
    });
    expect(
      await harness.governanceProjectionService.getGovernanceStateProjection(missionId),
    ).toMatchObject({
      latestGovernanceDecision: {
        governanceDecisionId: approvedDecision.id,
        outcome: 'Approved',
      },
      isBlocking: false,
      unresolvedRecoveryRequirements: [],
    });
    await expect(harness.completionCoordinator.handleEvent(approvedEvent)).resolves.toMatchObject({
      status: 'CompletionRejected',
      rejectionName: 'MissionCompletionRejectedError',
      reason:
        "Mission 'mission-sprint-70' cannot complete because GovernanceDecision 'governance-decision-rejected' is 'Rejected'.",
    });
    await expect(harness.requireMissionStatus()).resolves.toBe('Reviewing');
  });

  it('confirms production changes are limited to authorized current-sprint paths', () => {
    const authorizedProductionPaths = new Set([
      'src/kernel/common/create-kernel-services.ts',
      'src/kernel/mission/mission-completion-eligibility.ts',
      'src/kernel/mission/mission-execution.service.ts',
    ]);
    const changedProductionPaths = execFileSync(
      'git',
      ['--no-pager', 'diff', '--name-only', '--', 'src'],
      { cwd: process.cwd(), encoding: 'utf8' },
    )
      .split(/\r?\n/)
      .filter((path) => path.length > 0)
      .filter((path) => !authorizedProductionPaths.has(path));
    const changedHostOrAdapterPaths = execFileSync(
      'git',
      ['--no-pager', 'diff', '--name-only', '--', 'src/hosts', 'src/adapters'],
      { cwd: process.cwd(), encoding: 'utf8' },
    )
      .split(/\r?\n/)
      .filter((path) => path.length > 0);

    expect(changedProductionPaths).toEqual([]);
    expect(changedHostOrAdapterPaths).toEqual([]);
  });
});

interface AutonomousEngineeringHarness {
  readonly eventBus: EventBus;
  readonly governanceDecisionRepository: IGovernanceDecisionRepository;
  readonly recoveryRequirementRepository: IRecoveryRequirementRepository;
  readonly recoveryRequirementService: RecoveryRequirementService;
  readonly correlationService: EngineeringDecisionCorrelationService;
  readonly governanceProjectionService: GovernanceStateProjectionService;
  readonly sessionProjectionService: EngineeringSessionStateProjectionService;
  readonly advancementConsumer: GovernanceGatedWorkflowAdvancementConsumer;
  readonly recoveryConsumer: RecoveryRequirementGovernanceDecisionConsumer;
  readonly completionCoordinator: GovernanceGatedMissionCompletionCoordinator;
  registerPolicy(criteria: readonly PolicyCriterionInput[]): Promise<void>;
  beginCorrelation(workflowStepId?: string): ReturnType<EngineeringDecisionCorrelationService['beginCorrelation']>;
  createCompletedReview(
    reviewId: string,
    outcome: ReviewOutcomeValue,
  ): ReturnType<ReviewService['finalizeReviewOutcome']>;
  evaluateGovernance(
    reviewId: string,
    governanceDecisionId: string,
    evaluatedAt?: string,
  ): Promise<GovernanceDecisionSnapshot>;
  createDecision(value: GovernanceDecisionValue): Promise<GovernanceDecisionSnapshot>;
  createCorrelatedDecision(
    value: GovernanceDecisionValue,
    options?: {
      readonly correlationWorkflowStepId?: string;
    },
  ): Promise<{
    readonly decision: GovernanceDecisionSnapshot;
    readonly event: EventBusEvent;
  }>;
  createRejectedDecisionWithRecovery(): Promise<GovernanceDecisionSnapshot>;
  requireGovernanceDecisionRecordedEvent(governanceDecisionId: string): EventBusEvent;
  requireSingleRecoveryRequirement(): Promise<Awaited<ReturnType<IRecoveryRequirementRepository['enumerate']>>[number]['toSnapshot'] extends () => infer T ? T : never>;
  requireEngineeringSessionStep(): Promise<string>;
  requireMissionStatus(): Promise<string>;
  eventsOfType(eventType: string): readonly EventBusEvent[];
}

async function createAutonomousEngineeringHarness(input: {
  readonly authorityRecords?: readonly RatificationAuthorityRecordInput[];
  readonly governanceDecisionRepository?: IGovernanceDecisionRepository;
  readonly recoveryRequirementRepository?: IRecoveryRequirementRepository;
  readonly engineeringSessionRepository?: InMemoryEngineeringSessionRepository;
} = {}): Promise<AutonomousEngineeringHarness> {
  const eventBus = new EventBus(new TestLogger());
  const missionRepository = new InMemoryMissionRepository();
  const repositoryPolicyRepository = new InMemoryRepositoryPolicyRepository();
  const reviewRepository = new InMemoryReviewRepository();
  const governanceDecisionRepository =
    input.governanceDecisionRepository ?? new InMemoryGovernanceDecisionRepository();
  const governanceStateProjectionRepository = new InMemoryGovernanceStateProjectionRepository();
  const ratificationAuthorityRepository = new InMemoryRatificationAuthoritySnapshotRepository();
  const recoveryRequirementRepository =
    input.recoveryRequirementRepository ?? new InMemoryRecoveryRequirementRepository();
  const workflowChainRepository = new InMemoryWorkflowChainRepository();
  const engineeringSessionRepository =
    input.engineeringSessionRepository ?? new InMemoryEngineeringSessionRepository();
  const engineeringSessionStateProjectionRepository =
    new InMemoryEngineeringSessionStateProjectionRepository();
  const missionEngineeringGroupRepository = new InMemoryMissionEngineeringGroupRepository();
  const repositoryPolicyService = new RepositoryPolicyService(repositoryPolicyRepository);
  const reviewService = new ReviewService(
    reviewRepository,
    eventBus,
    createIdentityFactory('review-event'),
    () => timestamp,
  );
  const ratificationAttributionValidationService = new RatificationAttributionValidationService(
    ratificationAuthorityRepository,
  );
  const governanceService = new GovernanceService(
    repositoryPolicyRepository,
    reviewRepository,
    governanceDecisionRepository,
    createIdentityFactory('governance-event'),
    ratificationAttributionValidationService,
    eventBus,
  );
  const workflowChainService = new WorkflowChainService(workflowChainRepository);
  const engineeringSessionService = new EngineeringSessionService(
    engineeringSessionRepository,
    workflowChainRepository,
    createIdentityFactory('engineering-session'),
    () => timestamp,
    undefined,
    undefined,
    undefined,
    undefined,
    new InMemoryEngineeringSessionCheckpointRepository(),
    governanceDecisionRepository,
    reviewRepository,
    recoveryRequirementRepository,
    eventBus,
    missionEngineeringGroupRepository,
  );
  const missionEngineeringOrchestrationService = new MissionEngineeringOrchestrationService(
    missionEngineeringGroupRepository,
    new InMemoryEngineeringSessionHandoffRepository(),
    engineeringSessionRepository,
    createIdentityFactory('engineering-handoff'),
    () => timestamp,
  );
  const recoveryRequirementService = new RecoveryRequirementService(
    recoveryRequirementRepository,
    eventBus,
    createIdentityFactory('recovery-requirement'),
  );
  const correlationService = new EngineeringDecisionCorrelationService(
    new InMemoryEngineeringDecisionCorrelationRepository(),
    missionEngineeringGroupRepository,
    reviewRepository,
    governanceDecisionRepository,
    createIdentityFactory('engineering-decision-correlation'),
    () => timestamp,
  );
  const missionService = new MissionService(
    missionRepository,
    eventBus,
    createIdentityFactory('mission-event'),
    () => timestamp,
  );
  const missionPlanningService = new MissionPlanningService(
    missionRepository,
    eventBus,
    createIdentityFactory('mission-plan-event'),
    () => timestamp,
  );
  const missionExecutionService = new MissionExecutionService(
    missionRepository,
    eventBus,
    createIdentityFactory('mission-execution-event'),
    () => timestamp,
    governanceDecisionRepository,
  );
  const governanceProjectionService = new GovernanceStateProjectionService(
    governanceStateProjectionRepository,
    eventBus,
  );
  const sessionProjectionService = new EngineeringSessionStateProjectionService(
    engineeringSessionStateProjectionRepository,
    eventBus,
  );
  const advancementConsumer = new GovernanceGatedWorkflowAdvancementConsumer(
    engineeringSessionService,
    governanceDecisionRepository,
    correlationService,
  );
  const recoveryConsumer = new RecoveryRequirementGovernanceDecisionConsumer(
    governanceDecisionRepository,
    recoveryRequirementService,
    correlationService,
    engineeringSessionService,
  );
  const completionCoordinator = new GovernanceGatedMissionCompletionCoordinator(
    eventBus,
    governanceProjectionService,
    missionExecutionService,
  );

  await ratificationAuthorityRepository.recordSnapshot(
    RatificationAuthoritySnapshot.create({
      source: 'RATIFICATION_LEDGER.md',
      capturedAt: timestamp,
      records: input.authorityRecords ?? [ratificationRecord()],
    }),
  );
  await governanceProjectionService.initialize();
  await sessionProjectionService.initialize();
  await createMissionReadyForGovernanceCompletion({
    missionService,
    missionPlanningService,
    missionExecutionService,
  });
  await workflowChainService.createWorkflowChain({
    id: workflowChainId,
    steps: [{ roleId: 'builder' }, { roleId: 'reviewer' }, { roleId: 'approver' }],
  });
  await engineeringSessionService.createEngineeringSession({
    id: engineeringSessionId,
    engineeringRuntimeContextReference: 'runtime-context-sprint-70',
    activeEngineeringWorkflowReference: 'autonomous-engineering-integration-validation',
    workflowChainId,
    currentWorkflowStepId,
    participatingRoleIds: ['builder', 'reviewer', 'approver'],
    workflowState: 'active',
  });
  await missionEngineeringOrchestrationService.associateEngineeringSessionWithMission({
    missionId,
    engineeringSessionId,
  });

  const requireGovernanceDecisionRecordedEvent = (governanceDecisionId: string): EventBusEvent => {
    const event = eventBus
      .replay(missionId)
      .find(
        (candidate) =>
          candidate.eventType === 'GovernanceDecisionRecorded' &&
          candidate.payload['governanceDecisionId'] === governanceDecisionId,
      );

    if (event === undefined) {
      throw new Error(`Expected GovernanceDecisionRecorded event for '${governanceDecisionId}'.`);
    }

    return event;
  };

  const harness: AutonomousEngineeringHarness = {
    eventBus,
    governanceDecisionRepository,
    recoveryRequirementRepository,
    recoveryRequirementService,
    correlationService,
    governanceProjectionService,
    sessionProjectionService,
    advancementConsumer,
    recoveryConsumer,
    completionCoordinator,
    async registerPolicy(criteria) {
      await repositoryPolicyService.registerRepositoryPolicy({
        id: repositoryPolicyId,
        name: 'Sprint 70 Autonomous Engineering Integration Policy',
        description: 'Validation policy for Milestone 10 autonomous engineering readiness.',
        criteria,
        ratificationId,
      });
    },
    beginCorrelation(workflowStepId = currentWorkflowStepId) {
      return correlationService.beginCorrelation({
        engineeringSessionId,
        workflowStepId,
        creationCausality: ['event-engineering-session-position-established'],
        creationCorrelationId: `correlation-${workflowStepId}`,
      });
    },
    async createCompletedReview(reviewId, outcome) {
      await reviewService.startReview({
        id: reviewId,
        missionId,
        missionPlanRevision: 'mission-plan-revision-sprint-70',
        reviewCriteria: [{ id: 'review-criteria-sprint-70', description: 'Review criteria.' }],
        evidenceReferences: ['evidence-sprint-70'],
      });

      return reviewService.finalizeReviewOutcome({
        reviewId,
        outcome,
      });
    },
    evaluateGovernance(reviewId, governanceDecisionId, evaluatedAt = timestamp) {
      return governanceService.evaluateGovernancePolicy({
        missionId,
        repositoryPolicyId,
        repositoryPolicyVersion,
        reviewId,
        evaluatedAt,
        policyEvaluationId: `policy-evaluation-${governanceDecisionId}`,
        governanceDecisionId,
      });
    },
    async createDecision(value) {
      if (value === 'Rejected') {
        await this.registerPolicy([reviewOutcomeCriterion('review-must-be-rejected', ['Rejected'])]);
        const review = await this.createCompletedReview('review-rejected', 'Accepted');

        return this.evaluateGovernance(review.review.id, 'governance-decision-rejected');
      }

      if (value === 'Deferred') {
        await this.registerPolicy([reviewOutcomeCriterion('review-accepted', ['Accepted'])]);
        await reviewService.startReview({
          id: 'review-deferred',
          missionId,
          missionPlanRevision: 'mission-plan-revision-sprint-70',
          reviewCriteria: [{ id: 'review-criteria-sprint-70', description: 'Review criteria.' }],
          evidenceReferences: ['evidence-sprint-70'],
        });

        return this.evaluateGovernance('review-deferred', 'governance-decision-deferred');
      }

      await this.registerPolicy([reviewOutcomeCriterion('review-accepted', ['Accepted'])]);
      const review = await this.createCompletedReview(
        value === 'Escalation Required' ? 'review-escalation' : 'review-approved',
        'Accepted',
      );

      return this.evaluateGovernance(
        review.review.id,
        value === 'Escalation Required'
          ? 'governance-decision-escalation'
          : 'governance-decision-approved',
      );
    },
    async createCorrelatedDecision(value, options = {}) {
      await this.registerPolicy([
        reviewOutcomeCriterion(
          value === 'Rejected' ? 'review-must-be-rejected' : 'review-accepted',
          value === 'Rejected' ? ['Rejected'] : ['Accepted'],
        ),
      ]);
      const correlation = await this.beginCorrelation(
        options.correlationWorkflowStepId ?? currentWorkflowStepId,
      );
      const review = await this.createCompletedReview(`review-${value.toLowerCase().replaceAll(' ', '-')}`, 'Accepted');
      await this.correlationService.associateReview({
        correlationId: correlation.id,
        reviewId: review.review.id,
      });
      const decision = await this.evaluateGovernance(
        review.review.id,
        `governance-decision-${value.toLowerCase().replaceAll(' ', '-')}`,
      );
      await this.correlationService.associateGovernanceDecision({
        correlationId: correlation.id,
        governanceDecisionId: decision.id,
      });

      return {
        decision,
        event: this.requireGovernanceDecisionRecordedEvent(decision.id),
      };
    },
    async createRejectedDecisionWithRecovery() {
      const { decision, event } = await this.createCorrelatedDecision('Rejected');
      const recovery = await this.recoveryConsumer.handleEvent(event);

      expect(recovery.status).toBe('Created');

      return decision;
    },
    requireGovernanceDecisionRecordedEvent,
    async requireSingleRecoveryRequirement() {
      const recoveryRequirements = await recoveryRequirementRepository.enumerate();
      const recoveryRequirement = recoveryRequirements[0];

      if (recoveryRequirement === undefined || recoveryRequirements.length !== 1) {
        throw new Error('Expected exactly one RecoveryRequirement.');
      }

      return recoveryRequirement.toSnapshot();
    },
    async requireEngineeringSessionStep() {
      return (await engineeringSessionService.getEngineeringSession(engineeringSessionId))
        .currentWorkflowStepId;
    },
    async requireMissionStatus() {
      const mission = await missionRepository.getById(MissionId.fromString(missionId));

      if (mission === undefined) {
        throw new Error(`Expected Mission '${missionId}'.`);
      }

      return mission.status;
    },
    eventsOfType(eventType) {
      return eventBus.replay(missionId).filter((event) => event.eventType === eventType);
    },
  };

  return harness;
}

async function createMissionReadyForGovernanceCompletion(services: {
  readonly missionService: MissionService;
  readonly missionPlanningService: MissionPlanningService;
  readonly missionExecutionService: MissionExecutionService;
}): Promise<void> {
  await services.missionService.createMission({
    id: missionId,
    objective: 'Validate Milestone 10 autonomous engineering readiness.',
  });
  await services.missionService.planMission(missionId);
  await services.missionPlanningService.createMissionPlan({
    id: missionPlanId,
    missionId,
    revisionReason: 'Create Sprint 70 certification plan.',
  });
  await services.missionPlanningService.addTask({
    missionPlanId,
    taskId,
    title: 'Exercise autonomous engineering readiness lifecycle',
    description: 'Run the integrated Milestone 10 certification path.',
    revisionReason: 'Add certification task.',
  });
  await services.missionPlanningService.updateTask({
    missionPlanId,
    taskId,
    status: 'Ready',
    revisionReason: 'Mark certification task ready.',
  });
  await services.missionService.markMissionReady(missionId);
  await services.missionExecutionService.startMission({ missionId });
  await services.missionExecutionService.startTask({ missionId, taskId });
  await services.missionExecutionService.completeTask({ missionId, taskId });
  await services.missionService.reviewMission(missionId);
}

async function exerciseApprovedPath(harness: AutonomousEngineeringHarness): Promise<void> {
  const { event } = await harness.createCorrelatedDecision('Approved');

  await harness.advancementConsumer.handleEvent(event);
  await harness.advancementConsumer.handleEvent(event);
  await harness.recoveryConsumer.handleEvent(event);
}

function reviewOutcomeCriterion(
  id: string,
  allowedReviewOutcomes: readonly ReviewOutcomeValue[],
): PolicyCriterionInput {
  return {
    id,
    description: `${id} criterion.`,
    requiredInputs: ['ReviewOutcome'],
    conditionDescriptor: JSON.stringify({
      kind: 'ReviewOutcomeMembership',
      schemaVersion: 1,
      allowedReviewOutcomes,
    }),
  };
}

function ratificationRecord(
  overrides: RatificationAuthorityRecordInput = {},
): RatificationAuthorityRecordInput {
  return {
    identifier: ratificationId,
    date: '2026-07-17',
    subject: 'Sprint 70 Scope Ratification.',
    lifecycleStatus: 'Effective',
    ...overrides,
  };
}

function createIdentityFactory(prefix: string): () => string {
  let index = 0;

  return () => {
    index += 1;

    return `${prefix}-${index}`;
  };
}

class TestLogger implements KernelLogger {
  public info(): void {}

  public error(): void {}
}

class FailingGovernanceDecisionRepository
  extends InMemoryGovernanceDecisionRepository
  implements IGovernanceDecisionRepository
{
  public override async register(): Promise<never> {
    throw new Error('GovernanceDecision persistence failed.');
  }
}

class FailingEngineeringSessionRepository extends InMemoryEngineeringSessionRepository {
  private failSave = false;

  public failNextSave(): void {
    this.failSave = true;
  }

  public override async save(
    engineeringSession: Parameters<InMemoryEngineeringSessionRepository['save']>[0],
  ): ReturnType<InMemoryEngineeringSessionRepository['save']> {
    if (this.failSave) {
      this.failSave = false;
      throw new Error('EngineeringSession persistence failed.');
    }

    return super.save(engineeringSession);
  }
}

class FailingRecoveryRequirementRepository
  extends InMemoryRecoveryRequirementRepository
  implements IRecoveryRequirementRepository
{
  private failRegister = false;

  public failNextRegister(): void {
    this.failRegister = true;
  }

  public override async register(
    recoveryRequirement: Parameters<InMemoryRecoveryRequirementRepository['register']>[0],
  ): ReturnType<InMemoryRecoveryRequirementRepository['register']> {
    if (this.failRegister) {
      this.failRegister = false;
      throw new Error('RecoveryRequirement persistence failed.');
    }

    return super.register(recoveryRequirement);
  }
}
