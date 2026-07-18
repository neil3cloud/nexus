import { describe, expect, it } from 'vitest';

import { EventBus } from '../../../src/kernel/events/event-bus';
import type { KernelLogger } from '../../../src/kernel/common/kernel-logger';
import { createKernelServices } from '../../../src/kernel/common/create-kernel-services';
import type { IKernelService } from '../../../src/kernel/common/kernel-service';
import {
  DuplicateProposedMissionPlanError,
  InvalidPlanningDefinitionError,
  InvalidProposalLifecycleTransitionError,
  ProposedMissionPlanNotFoundError,
  StructuralPlanValidationError,
} from '../../../src/kernel/planning/planning.errors';
import { PlanningService } from '../../../src/kernel/planning/planning.service';
import type {
  PlannerAttributionInput,
  ProposedMissionPlanInput,
  ProposedPlanRevisionInput,
} from '../../../src/kernel/planning/planning.types';

const plannerAttribution: PlannerAttributionInput = {
  executionRoleId: 'planner',
  actorType: 'Human',
  actorId: 'neil',
  engineeringSessionId: 'engineering-session-1',
  generatedAt: '2026-07-17T00:00:00.000Z',
  causality: ['mission-created'],
  correlationId: 'planning-correlation-1',
};

function createRevisionInput(
  overrides: Partial<ProposedPlanRevisionInput> = {},
): ProposedPlanRevisionInput {
  return {
    id: 'proposed-plan-revision-1',
    proposedMissionPlanId: 'proposed-mission-plan-1',
    revisionNumber: 1,
    proposedTasks: [
      {
        id: 'proposed-task-1',
        title: 'Define Planning service',
        description: 'Introduce the PlanningService orchestration boundary.',
      },
      {
        id: 'proposed-task-2',
        title: 'Validate Planning service',
        description: 'Cover service orchestration with deterministic unit tests.',
      },
    ],
    proposedTaskDependencies: [
      {
        targetProposedTaskId: 'proposed-task-2',
        prerequisiteProposedTaskId: 'proposed-task-1',
      },
    ],
    plannerAttribution,
    createdAt: '2026-07-17T00:00:00.000Z',
    causality: ['mission-created'],
    correlationId: 'revision-correlation-1',
    ...overrides,
  };
}

function createProposedMissionPlanInput(
  overrides: Partial<ProposedMissionPlanInput> = {},
): ProposedMissionPlanInput {
  return {
    id: 'proposed-mission-plan-1',
    missionId: 'mission-1',
    initialRevision: createRevisionInput(),
    ...overrides,
  };
}

describe('PlanningService', () => {
  it('constructs as a thin Kernel service and is composed by createKernelServices', () => {
    const service = new PlanningService();
    const services = createKernelServices(new EventBus(new TestLogger()));

    expect(service.serviceName).toBe('PlanningService');
    expect(services.map((kernelService) => kernelService.serviceName)).toContain('PlanningService');
    expect(
      requireService(
        services,
        'PlanningService',
        (kernelService): kernelService is PlanningService =>
          kernelService instanceof PlanningService,
      ),
    ).toBeInstanceOf(PlanningService);
  });

  it('creates Proposed Mission Plans idempotently through the repository boundary', async () => {
    const service = new PlanningService();
    const input = createProposedMissionPlanInput();
    const created = await service.createProposedMissionPlan(input);
    const repeated = await service.createProposedMissionPlan(input);

    expect(repeated).toEqual(created);
    expect(created).toMatchObject({
      id: 'proposed-mission-plan-1',
      missionId: 'mission-1',
      lifecycleState: 'Draft',
    });
    await expect(
      service.createProposedMissionPlan({
        ...input,
        missionId: 'mission-2',
      }),
    ).rejects.toThrow(DuplicateProposedMissionPlanError);
  });

  it('creates immutable Proposed Plan Revisions idempotently', async () => {
    const service = new PlanningService();
    await service.createProposedMissionPlan(createProposedMissionPlanInput());

    const revised = await service.createProposedPlanRevision({
      proposedMissionPlanId: 'proposed-mission-plan-1',
      id: 'proposed-plan-revision-2',
      proposedTasks: [
        {
          id: 'proposed-task-1',
          title: 'Define Planning service',
          description: 'Introduce the PlanningService orchestration boundary.',
        },
      ],
      proposedTaskDependencies: [],
      plannerAttribution,
      createdAt: '2026-07-17T01:00:00.000Z',
      causality: ['proposed-plan-revision-1'],
      correlationId: 'revision-correlation-2',
    });
    const repeated = await service.createProposedPlanRevision({
      proposedMissionPlanId: 'proposed-mission-plan-1',
      id: 'proposed-plan-revision-2',
      proposedTasks: [
        {
          id: 'proposed-task-1',
          title: 'Define Planning service',
          description: 'Introduce the PlanningService orchestration boundary.',
        },
      ],
      proposedTaskDependencies: [],
      plannerAttribution,
      createdAt: '2026-07-17T01:00:00.000Z',
      causality: ['proposed-plan-revision-1'],
      correlationId: 'revision-correlation-2',
    });

    expect(repeated).toEqual(revised);
    expect(revised.revisions.map((revision) => revision.revisionNumber)).toEqual([1, 2]);
    expect(revised.revisions.map((revision) => revision.lifecycleState)).toEqual(['Draft', 'Draft']);
    await expect(
      service.createProposedPlanRevision({
        proposedMissionPlanId: 'proposed-mission-plan-1',
        id: 'proposed-plan-revision-2',
        proposedTasks: [],
        proposedTaskDependencies: [],
        plannerAttribution,
        createdAt: '2026-07-17T01:00:00.000Z',
      }),
    ).rejects.toThrow(InvalidPlanningDefinitionError);
  });

  it('submits and withdraws the current revision idempotently', async () => {
    const service = new PlanningService();
    await service.createProposedMissionPlan(createProposedMissionPlanInput());

    const submitCommand = {
      proposedMissionPlanId: 'proposed-mission-plan-1',
      id: 'proposed-plan-revision-2',
      plannerAttribution,
      createdAt: '2026-07-17T01:00:00.000Z',
      causality: ['proposed-plan-revision-1'],
      correlationId: 'submit-correlation-1',
      planningPolicy: {
        id: 'planning-policy-1',
        version: '1.0.0',
        maxProposedTaskCount: 5,
        requiredProposedTaskFields: ['title', 'description'] as const,
      },
    };
    const submitted = await service.submitCurrentRevision(submitCommand);
    const repeatedSubmission = await service.submitCurrentRevision(submitCommand);

    expect(repeatedSubmission).toEqual(submitted);
    expect(submitted.lifecycleState).toBe('Submitted');
    expect(submitted.revisions.map((revision) => revision.lifecycleState)).toEqual([
      'Draft',
      'Submitted',
    ]);

    const withdrawCommand = {
      proposedMissionPlanId: 'proposed-mission-plan-1',
      id: 'proposed-plan-revision-3',
      plannerAttribution,
      createdAt: '2026-07-17T02:00:00.000Z',
      causality: ['proposed-plan-revision-2'],
      correlationId: 'withdraw-correlation-1',
    };
    const withdrawn = await service.withdrawCurrentRevision(withdrawCommand);
    const repeatedWithdrawal = await service.withdrawCurrentRevision(withdrawCommand);

    expect(repeatedWithdrawal).toEqual(withdrawn);
    expect(withdrawn.lifecycleState).toBe('Withdrawn');
    expect(withdrawn.revisions.map((revision) => revision.lifecycleState)).toEqual([
      'Draft',
      'Submitted',
      'Withdrawn',
    ]);
    await expect(
      service.createProposedPlanRevision({
        proposedMissionPlanId: 'proposed-mission-plan-1',
        id: 'proposed-plan-revision-4',
        proposedTasks: [],
        proposedTaskDependencies: [],
        plannerAttribution,
        createdAt: '2026-07-17T03:00:00.000Z',
      }),
    ).rejects.toThrow(InvalidProposalLifecycleTransitionError);
  });

  it('propagates structural validation and Planner Attribution failures from Sprint 72 domain rules', async () => {
    const service = new PlanningService();
    await service.createProposedMissionPlan(
      createProposedMissionPlanInput({
        initialRevision: createRevisionInput({
          proposedTaskDependencies: [
            {
              targetProposedTaskId: 'proposed-task-2',
              prerequisiteProposedTaskId: 'missing-task',
            },
          ],
        }),
      }),
    );

    await expect(
      service.submitCurrentRevision({
        proposedMissionPlanId: 'proposed-mission-plan-1',
        id: 'proposed-plan-revision-2',
        plannerAttribution,
        createdAt: '2026-07-17T01:00:00.000Z',
        planningPolicy: {
          id: 'planning-policy-1',
          version: '1.0.0',
        },
      }),
    ).rejects.toThrow(StructuralPlanValidationError);

    await expect(
      service.createProposedPlanRevision({
        proposedMissionPlanId: 'proposed-mission-plan-1',
        id: 'proposed-plan-revision-2',
        proposedTasks: [],
        proposedTaskDependencies: [],
        plannerAttribution: {
          ...plannerAttribution,
          actorType: 'Adapter',
        },
        createdAt: '2026-07-17T01:00:00.000Z',
      }),
    ).rejects.toThrow(InvalidPlanningDefinitionError);
  });

  it('fails deterministically when a Proposed Mission Plan is missing', async () => {
    const service = new PlanningService();

    await expect(
      service.createProposedPlanRevision({
        proposedMissionPlanId: 'missing-proposed-mission-plan',
        id: 'proposed-plan-revision-1',
        proposedTasks: [],
        proposedTaskDependencies: [],
        plannerAttribution,
        createdAt: '2026-07-17T01:00:00.000Z',
      }),
    ).rejects.toThrow(ProposedMissionPlanNotFoundError);
  });
});

function requireService<T extends IKernelService>(
  services: readonly IKernelService[],
  serviceName: string,
  isService: (service: IKernelService) => service is T,
): T {
  const service = services.find(isService);

  if (service === undefined) {
    throw new Error(`Expected ${serviceName} to be composed by createKernelServices.`);
  }

  return service;
}

class TestLogger implements KernelLogger {
  public info(): void {}
  public warn(): void {}
  public error(): void {}
  public debug(): void {}
}
