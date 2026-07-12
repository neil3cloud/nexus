import { describe, expect, it } from 'vitest';

import { InvalidKnowledgeDefinitionError, InvalidKnowledgeLifecycleTransitionError } from '../../../src/kernel/knowledge/knowledge.errors';
import { KnowledgeAttribution } from '../../../src/kernel/knowledge/knowledge-attribution';
import { KnowledgeId } from '../../../src/kernel/knowledge/knowledge-id';
import { KnowledgeScope } from '../../../src/kernel/knowledge/knowledge-scope';
import { KnowledgeStatus } from '../../../src/kernel/knowledge/knowledge-status';

describe('Knowledge value objects', () => {
  it('normalizes KnowledgeId and KnowledgeScope using ratified vocabulary', () => {
    expect(KnowledgeId.fromString(' knowledge-1 ').toString()).toBe('knowledge-1');
    expect(KnowledgeScope.fromString('Repository').toString()).toBe('Repository');
    expect(() => KnowledgeScope.fromString('Team')).toThrow(InvalidKnowledgeDefinitionError);
  });

  it('enforces the ratified KnowledgeStatus lifecycle and terminal Archived state', () => {
    const candidate = KnowledgeStatus.candidate();
    const approved = candidate.transitionTo('Approved');
    const active = approved.transitionTo('Active');
    const superseded = active.transitionTo('Superseded');
    const archived = superseded.transitionTo('Archived');

    expect(archived.toString()).toBe('Archived');
    expect(() => candidate.transitionTo('Active')).toThrow(InvalidKnowledgeLifecycleTransitionError);
    expect(() => archived.transitionTo('Approved')).toThrow(InvalidKnowledgeLifecycleTransitionError);
  });

  it('validates KnowledgeAttribution identity, lineage, and approval fields', () => {
    const attribution = KnowledgeAttribution.create({
      missionId: ' mission-1 ',
      missionPlanRevisionId: ' revision-1 ',
      supportingEvidenceIds: [' evidence-1 '],
      supportingReviewId: ' review-1 ',
      contributingEventIds: [' event-1 '],
      approvingAuthority: ' sprint-owner ',
    });

    expect(attribution.toSnapshot()).toEqual({
      missionId: 'mission-1',
      missionPlanRevisionId: 'revision-1',
      supportingEvidenceIds: ['evidence-1'],
      supportingReviewId: 'review-1',
      contributingEventIds: ['event-1'],
      approvingAuthority: 'sprint-owner',
    });
    expect(() =>
      KnowledgeAttribution.create({
        missionId: 'mission-1',
        missionPlanRevisionId: 'revision-1',
        supportingEvidenceIds: ['evidence-1', 'evidence-1'],
        supportingReviewId: 'review-1',
        contributingEventIds: ['event-1'],
        approvingAuthority: 'sprint-owner',
      }),
    ).toThrow(InvalidKnowledgeDefinitionError);
  });
});
