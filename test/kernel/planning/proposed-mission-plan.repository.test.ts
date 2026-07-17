import { describe, expect, it } from 'vitest';

import { PlanningPolicy } from '../../../src/kernel/planning/planning-policy';
import { ProposedMissionPlan } from '../../../src/kernel/planning/proposed-mission-plan';
import { InMemoryProposedMissionPlanRepository } from '../../../src/kernel/planning/proposed-mission-plan.repository';
import { DuplicateProposedMissionPlanError } from '../../../src/kernel/planning/planning.errors';

const plannerAttribution = {
  executionRoleId: 'planner',
  actorType: 'Human' as const,
  actorId: 'neil',
  generatedAt: '2026-07-17T00:00:00.000Z',
};

function createProposedMissionPlan(id: string, missionId: string): ProposedMissionPlan {
  return ProposedMissionPlan.create({
    id,
    missionId,
    initialRevision: {
      id: `${id}-revision-1`,
      proposedMissionPlanId: id,
      revisionNumber: 1,
      proposedTasks: [
        {
          id: `${id}-task-1`,
          title: 'Plan',
          description: 'Plan the mission.',
        },
      ],
      proposedTaskDependencies: [],
      plannerAttribution,
      createdAt: '2026-07-17T00:00:00.000Z',
    },
  });
}

describe('InMemoryProposedMissionPlanRepository', () => {
  it('persists Proposed Mission Plans by immutable snapshots', async () => {
    const repository = new InMemoryProposedMissionPlanRepository();
    const proposedMissionPlan = createProposedMissionPlan('proposed-mission-plan-1', 'mission-1');
    const created = await repository.create(proposedMissionPlan);
    const submitted = created.submitCurrentRevision(
      {
        id: 'proposed-mission-plan-1-revision-2',
        plannerAttribution,
        createdAt: '2026-07-17T01:00:00.000Z',
      },
      PlanningPolicy.create({
        id: 'planning-policy-1',
        version: '1.0.0',
      }),
    );

    await repository.save(submitted);

    const loaded = await repository.getById('proposed-mission-plan-1');
    const byMissionId = await repository.getByMissionId('mission-1');
    const allPlans = await repository.enumerate();

    expect(loaded?.toSnapshot()).toEqual(submitted.toSnapshot());
    expect(byMissionId.map((plan) => plan.id.toString())).toEqual(['proposed-mission-plan-1']);
    expect(allPlans.map((plan) => plan.id.toString())).toEqual(['proposed-mission-plan-1']);
    expect(loaded).not.toBe(submitted);
    expect(Object.isFrozen(loaded?.toSnapshot())).toBe(true);
  });

  it('rejects duplicate Proposed Mission Plan creation', async () => {
    const repository = new InMemoryProposedMissionPlanRepository();
    const proposedMissionPlan = createProposedMissionPlan('proposed-mission-plan-1', 'mission-1');

    await repository.create(proposedMissionPlan);

    await expect(repository.create(proposedMissionPlan)).rejects.toThrow(
      DuplicateProposedMissionPlanError,
    );
  });
});
