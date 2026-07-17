import { Evidence } from '../../../src/kernel/evidence/evidence.aggregate';
import { Mission } from '../../../src/kernel/mission/mission.aggregate';
import { MissionId } from '../../../src/kernel/mission/mission-id';
import { MissionObjective } from '../../../src/kernel/mission/mission-objective';
import type { TaskSnapshot } from '../../../src/kernel/mission/mission-planning.types';
import type { DomainEventMetadata } from '../../../src/kernel/mission/mission.types';
import { Review } from '../../../src/kernel/review/review.aggregate';

export const timestamp = '2026-07-13T00:00:00.000Z';

export function metadata(eventId: string): DomainEventMetadata {
  return {
    eventId,
    timestamp,
  };
}

export function createEvidence(id = 'evidence-1'): Evidence {
  return Evidence.register({
    id,
    missionId: 'mission-1',
    type: 'TestResult',
    version: 1,
    hash: `sha256:${id}`,
    metadata: {
      capturedAt: timestamp,
      attributes: {
        suite: 'knowledge',
      },
    },
    provenance: {
      source: 'vitest',
      acquisitionMethod: 'test-run',
      acquiredAt: timestamp,
      actor: 'builder',
      system: 'nexus',
      verificationStatus: 'Verified',
    },
  });
}

export function createCompletedMission(): Mission {
  const mission = Mission.create(
    MissionId.fromString('mission-1'),
    MissionObjective.fromString('Implement Knowledge Foundation'),
    metadata('event-created'),
  );

  mission.pullDomainEvents();
  mission.plan(metadata('event-planned'));
  mission.markReady(metadata('event-ready'));
  mission.start(metadata('event-started'));
  mission.review(metadata('event-reviewed'));
  mission.complete(metadata('event-completed'), [completedTask()]);
  mission.pullDomainEvents();

  return mission;
}

export function createIncompleteMission(): Mission {
  const mission = Mission.create(
    MissionId.fromString('mission-1'),
    MissionObjective.fromString('Implement Knowledge Foundation'),
    metadata('event-created'),
  );

  mission.pullDomainEvents();
  mission.plan(metadata('event-planned'));

  return mission;
}

export function createAcceptedReview(
  id = 'review-1',
  outcome: 'Accepted' | 'Accepted With Observations' = 'Accepted',
): Review {
  const review = Review.create({
    id,
    missionId: 'mission-1',
    missionPlanRevision: {
      kind: 'ExecutableMissionPlan',
      revisionId: 'revision-1',
    },
    reviewCriteria: [{ id: 'architecture', description: 'Architecture is preserved.' }],
    evidenceReferences: ['evidence-1'],
  });

  review.start(metadata(`event-started-${id}`));
  review.complete(outcome, metadata(`event-completed-${id}`), metadata(`event-outcome-${id}`));
  review.pullDomainEvents();

  return review;
}

export function createRejectedReview(): Review {
  const review = Review.create({
    id: 'review-1',
    missionId: 'mission-1',
    missionPlanRevision: {
      kind: 'ExecutableMissionPlan',
      revisionId: 'revision-1',
    },
    reviewCriteria: [{ id: 'architecture', description: 'Architecture is preserved.' }],
    evidenceReferences: ['evidence-1'],
  });

  review.start(metadata('event-started-review'));
  review.complete('Rejected', metadata('event-completed-review'), metadata('event-rejected-review'));
  review.pullDomainEvents();

  return review;
}

export function createPendingReview(): Review {
  return Review.create({
    id: 'review-1',
    missionId: 'mission-1',
    missionPlanRevision: {
      kind: 'ExecutableMissionPlan',
      revisionId: 'revision-1',
    },
    reviewCriteria: [{ id: 'architecture', description: 'Architecture is preserved.' }],
    evidenceReferences: ['evidence-1'],
  });
}

export function captureKnowledgeInput() {
  return {
    id: ' knowledge-1 ',
    missionId: ' mission-1 ',
    missionPlanRevisionId: ' revision-1 ',
    summary: ' Knowledge preserves accepted engineering outcomes. ',
    scope: 'Repository',
    supportingEvidenceIds: [' evidence-1 '],
    supportingReviewId: ' review-1 ',
    contributingEventIds: [' event-completed '],
    approvingAuthority: ' sprint-owner ',
  };
}

function completedTask(): TaskSnapshot {
  return {
    id: 'task-1',
    title: 'Implement Knowledge',
    description: 'Implement the Knowledge Foundation slice.',
    status: 'Completed',
    parentMissionPlanId: 'plan-1',
    dependencies: [],
    metadata: {},
  };
}
