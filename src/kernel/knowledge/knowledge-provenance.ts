import { KnowledgeAttribution } from './knowledge-attribution';
import type { KnowledgeProvenanceSnapshot } from './knowledge.types';

export class KnowledgeProvenance {
  private constructor(
    private readonly evidenceLineageValues: readonly string[],
    private readonly reviewLineageValue: string,
    private readonly missionLineageValue: {
      readonly missionId: string;
      readonly missionPlanRevisionId: string;
    },
    private readonly approvalLineageValue: string,
  ) {
    Object.freeze(this);
  }

  public static fromAttribution(attribution: KnowledgeAttribution): KnowledgeProvenance {
    return new KnowledgeProvenance(
      attribution.supportingEvidenceIds,
      attribution.supportingReviewId,
      Object.freeze({
        missionId: attribution.missionId,
        missionPlanRevisionId: attribution.missionPlanRevisionId,
      }),
      attribution.approvingAuthority,
    );
  }

  public static fromSnapshot(snapshot: KnowledgeProvenanceSnapshot): KnowledgeProvenance {
    return new KnowledgeProvenance(
      Object.freeze([...snapshot.evidenceLineage]),
      snapshot.reviewLineage,
      Object.freeze({ ...snapshot.missionLineage }),
      snapshot.approvalLineage,
    );
  }

  public get evidenceLineage(): readonly string[] {
    return this.evidenceLineageValues;
  }

  public get reviewLineage(): string {
    return this.reviewLineageValue;
  }

  public get missionLineage(): {
    readonly missionId: string;
    readonly missionPlanRevisionId: string;
  } {
    return Object.freeze({ ...this.missionLineageValue });
  }

  public get approvalLineage(): string {
    return this.approvalLineageValue;
  }

  public toSnapshot(): KnowledgeProvenanceSnapshot {
    return Object.freeze({
      evidenceLineage: this.evidenceLineageValues,
      reviewLineage: this.reviewLineageValue,
      missionLineage: Object.freeze({ ...this.missionLineageValue }),
      approvalLineage: this.approvalLineageValue,
    });
  }
}
