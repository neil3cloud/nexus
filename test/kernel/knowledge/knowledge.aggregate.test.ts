import { describe, expect, it } from 'vitest';

import { Knowledge } from '../../../src/kernel/knowledge/knowledge.aggregate';
import {
  InvalidKnowledgeDefinitionError,
  InvalidKnowledgeLifecycleTransitionError,
  KnowledgeCapturePreconditionError,
  KnowledgeRevisionRejectedError,
} from '../../../src/kernel/knowledge/knowledge.errors';
import {
  captureKnowledgeInput,
  createAcceptedReview,
  createCompletedMission,
  createEvidence,
  createIncompleteMission,
  createPendingReview,
  createRejectedReview,
} from './knowledge.test-support';

function captureKnowledge(): Knowledge {
  return Knowledge.capture(captureKnowledgeInput(), {
    mission: createCompletedMission(),
    supportingEvidence: [createEvidence()],
    supportingReview: createAcceptedReview(),
  });
}

describe('Knowledge', () => {
  it('captures immutable Candidate Knowledge with attribution, provenance, and revision history', () => {
    const knowledge = captureKnowledge();

    expect(Object.isFrozen(knowledge)).toBe(true);
    expect(knowledge.toSnapshot()).toEqual({
      id: 'knowledge-1',
      missionId: 'mission-1',
      missionPlanRevisionId: 'revision-1',
      summary: 'Knowledge preserves accepted engineering outcomes.',
      scope: 'Repository',
      status: 'Candidate',
      supportingEvidenceIds: ['evidence-1'],
      supportingReviewId: 'review-1',
      contributingEventIds: ['event-completed'],
      approvingAuthority: 'sprint-owner',
      attribution: {
        missionId: 'mission-1',
        missionPlanRevisionId: 'revision-1',
        supportingEvidenceIds: ['evidence-1'],
        supportingReviewId: 'review-1',
        contributingEventIds: ['event-completed'],
        approvingAuthority: 'sprint-owner',
      },
      provenance: {
        evidenceLineage: ['evidence-1'],
        reviewLineage: 'review-1',
        missionLineage: {
          missionId: 'mission-1',
          missionPlanRevisionId: 'revision-1',
        },
        approvalLineage: 'sprint-owner',
      },
      revisions: [
        {
          revisionNumber: 1,
          summary: 'Knowledge preserves accepted engineering outcomes.',
          attribution: {
            missionId: 'mission-1',
            missionPlanRevisionId: 'revision-1',
            supportingEvidenceIds: ['evidence-1'],
            supportingReviewId: 'review-1',
            contributingEventIds: ['event-completed'],
            approvingAuthority: 'sprint-owner',
          },
          provenance: {
            evidenceLineage: ['evidence-1'],
            reviewLineage: 'review-1',
            missionLineage: {
              missionId: 'mission-1',
              missionPlanRevisionId: 'revision-1',
            },
            approvalLineage: 'sprint-owner',
          },
        },
      ],
    });
  });

  it('rejects capture without a supporting Review', () => {
    expect(() =>
      Knowledge.capture(captureKnowledgeInput(), {
        mission: createCompletedMission(),
        supportingEvidence: [createEvidence()],
      }),
    ).toThrow(KnowledgeCapturePreconditionError);
  });

  it('rejects capture unless the supporting Review is terminal and accepted', () => {
    expect(() =>
      Knowledge.capture(captureKnowledgeInput(), {
        mission: createCompletedMission(),
        supportingEvidence: [createEvidence()],
        supportingReview: createPendingReview(),
      }),
    ).toThrow(KnowledgeCapturePreconditionError);

    expect(() =>
      Knowledge.capture(captureKnowledgeInput(), {
        mission: createCompletedMission(),
        supportingEvidence: [createEvidence()],
        supportingReview: createRejectedReview(),
      }),
    ).toThrow(KnowledgeCapturePreconditionError);

    expect(() =>
      Knowledge.capture(captureKnowledgeInput(), {
        mission: createCompletedMission(),
        supportingEvidence: [createEvidence()],
        supportingReview: createAcceptedReview('review-1', 'Accepted With Observations'),
      }),
    ).not.toThrow();
  });

  it('rejects capture without supporting Evidence', () => {
    expect(() =>
      Knowledge.capture(captureKnowledgeInput(), {
        mission: createCompletedMission(),
        supportingEvidence: [],
        supportingReview: createAcceptedReview(),
      }),
    ).toThrow(KnowledgeCapturePreconditionError);
  });

  it('rejects capture unless Mission work is completed', () => {
    expect(() =>
      Knowledge.capture(captureKnowledgeInput(), {
        supportingEvidence: [createEvidence()],
        supportingReview: createAcceptedReview(),
      }),
    ).toThrow(KnowledgeCapturePreconditionError);

    expect(() =>
      Knowledge.capture(captureKnowledgeInput(), {
        mission: createIncompleteMission(),
        supportingEvidence: [createEvidence()],
        supportingReview: createAcceptedReview(),
      }),
    ).toThrow(KnowledgeCapturePreconditionError);
  });

  it('rejects capture without approval metadata', () => {
    expect(() =>
      Knowledge.capture(
        {
          ...captureKnowledgeInput(),
          approvingAuthority: ' ',
        },
        {
          mission: createCompletedMission(),
          supportingEvidence: [createEvidence()],
          supportingReview: createAcceptedReview(),
        },
      ),
    ).toThrow(KnowledgeCapturePreconditionError);
  });

  it('rejects invalid Knowledge definitions and snapshot inconsistency', () => {
    expect(() =>
      Knowledge.capture(
        {
          ...captureKnowledgeInput(),
          summary: ' ',
        },
        {
          mission: createCompletedMission(),
          supportingEvidence: [createEvidence()],
          supportingReview: createAcceptedReview(),
        },
      ),
    ).toThrow(InvalidKnowledgeDefinitionError);

    expect(() =>
      Knowledge.fromSnapshot({
        ...captureKnowledge().toSnapshot(),
        missionId: 'other-mission',
      }),
    ).toThrow(InvalidKnowledgeDefinitionError);
  });

  it('preserves identity, attribution, provenance, and prior revisions during evolution', () => {
    const captured = captureKnowledge();
    const revised = captured.revise({
      summary: 'Knowledge revisions preserve attribution and provenance.',
    });

    expect(revised).not.toBe(captured);
    expect(captured.revisions).toHaveLength(1);
    expect(revised.toSnapshot().revisions).toHaveLength(2);
    expect(revised.toSnapshot().revisions[1]).toMatchObject({
      revisionNumber: 2,
      previousRevisionNumber: 1,
      summary: 'Knowledge revisions preserve attribution and provenance.',
      attribution: captured.toSnapshot().attribution,
      provenance: captured.toSnapshot().provenance,
    });
  });

  it('enforces KnowledgeStatus lifecycle transitions on immutable aggregate instances', () => {
    const candidate = captureKnowledge();
    const archived = candidate.approve().activate().supersede().archive();

    expect(candidate.status.toString()).toBe('Candidate');
    expect(archived.status.toString()).toBe('Archived');
    expect(() => candidate.activate()).toThrow(InvalidKnowledgeLifecycleTransitionError);
    expect(() =>
      archived.revise({
        summary: 'Archived Knowledge cannot change.',
      }),
    ).toThrow(KnowledgeRevisionRejectedError);
  });
});
