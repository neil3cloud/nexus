import { ServiceLifecycle } from '../common/service-lifecycle';
import type { Evidence } from '../evidence/evidence.aggregate';
import { EvidenceId } from '../evidence/evidence-id';
import { supportedEvidenceTypes } from '../evidence/evidence-type';
import type { IEvidenceRepository } from '../evidence/evidence.repository';
import { MissionId } from '../mission/mission-id';
import type { IMissionPlanRepository, IMissionRepository } from '../mission/mission.repository';
import { ProjectionResult } from './projection-result';
import { ProjectionVersion } from './projection-version';
import { SharedReality } from './shared-reality.aggregate';
import {
  ProjectionConsistencyError,
  DuplicateProjectionEvidenceReferenceError,
  ProjectionInactiveMissionError,
  ProjectionEvidenceRequiredError,
  ProjectionEvidenceNotFoundError,
  ProjectionEvidenceVersionMismatchError,
  ProjectionMissionNotFoundError,
  ProjectionMissionPlanNotFoundError,
  UnsupportedProjectionEvidenceTypeError,
} from './shared-reality.errors';
import type {
  EvidenceProjectionReference,
  ProjectionContextAggregation,
  ProjectionMetadata,
  ProjectionRequest,
} from './shared-reality.types';

type MissionProjectionRepository = Pick<IMissionRepository, 'getById'> &
  Pick<IMissionPlanRepository, 'getMissionPlansByMissionId'>;

export class ProjectionService extends ServiceLifecycle {
  public constructor(
    private readonly missionRepository: MissionProjectionRepository,
    private readonly evidenceRepository: Pick<IEvidenceRepository, 'getById' | 'enumerate'>,
  ) {
    super('ProjectionService');
  }

  public async project(request: ProjectionRequest): Promise<ProjectionResult> {
    const missionId = MissionId.fromString(request.missionId);
    const mission = await this.missionRepository.getById(missionId);

    if (mission === undefined) {
      throw new ProjectionMissionNotFoundError(missionId.toString());
    }

    if (mission.status === 'Completed' || mission.status === 'Cancelled' || mission.status === 'Failed') {
      throw new ProjectionInactiveMissionError(mission.id.toString(), mission.status);
    }

    const missionPlan = (await this.missionRepository.getMissionPlansByMissionId(missionId))[0];

    if (missionPlan === undefined) {
      throw new ProjectionMissionPlanNotFoundError(missionId.toString());
    }

    const evidence = await this.retrieveProjectionEvidence(request);
    if (evidence.length === 0) {
      throw new ProjectionEvidenceRequiredError();
    }

    const evidenceReferences = evidence.map((item) => this.toEvidenceReference(item));
    const activeMission = mission.toSnapshot();
    const missionPlanSnapshot = missionPlan.toSnapshot();
    const missionExecutionState = Object.freeze({
      missionStatus: activeMission.status,
      tasks: Object.freeze(
        missionPlanSnapshot.tasks.map((task) =>
          Object.freeze({
            id: task.id,
            status: task.status,
          }),
        ),
      ),
    });
    const context = this.aggregateContext(evidenceReferences);
    const sharedReality = SharedReality.fromSnapshot({
      activeMission,
      missionPlan: missionPlanSnapshot,
      missionExecutionState,
      evidenceReferences,
      context,
    });
    const projectionMetadata: ProjectionMetadata = Object.freeze({
      algorithm: 'nexus-shared-reality-foundation-v1',
      evidenceCount: evidenceReferences.length,
      missionPlanRevision: missionPlanSnapshot.revisionNumber,
    });
    const projectionVersion = ProjectionVersion.generate({
      sharedReality: sharedReality.toSnapshot(),
      projectionMetadata,
    });

    return ProjectionResult.create({
      projectionVersion,
      sharedReality,
      projectionMetadata,
    });
  }

  private async retrieveProjectionEvidence(
    request: ProjectionRequest,
  ): Promise<readonly Evidence[]> {
    if (request.evidence === undefined) {
      return this.sortEvidence(await this.evidenceRepository.enumerate());
    }

    const evidence = [];
    const requestedEvidenceIds = new Set<string>();

    for (const reference of request.evidence) {
      const evidenceId = EvidenceId.fromString(reference.id);
      const normalizedEvidenceId = evidenceId.toString();

      if (requestedEvidenceIds.has(normalizedEvidenceId)) {
        throw new DuplicateProjectionEvidenceReferenceError(normalizedEvidenceId);
      }

      requestedEvidenceIds.add(normalizedEvidenceId);
      const item = await this.evidenceRepository.getById(evidenceId);

      if (item === undefined) {
        throw new ProjectionEvidenceNotFoundError(normalizedEvidenceId);
      }

      if (reference.version !== undefined && item.version.toNumber() !== reference.version) {
        throw new ProjectionEvidenceVersionMismatchError(
          normalizedEvidenceId,
          reference.version,
          item.version.toNumber(),
        );
      }

      evidence.push(item);
    }

    return this.sortEvidence(evidence);
  }

  private toEvidenceReference(evidence: Evidence): EvidenceProjectionReference {
    const reference = Object.freeze({
      id: evidence.id.toString(),
      type: evidence.type.toString(),
      version: evidence.version.toNumber(),
      source: evidence.source.toString(),
      hash: evidence.hash.toString(),
    });

    if (!supportedEvidenceTypes.includes(reference.type)) {
      throw new UnsupportedProjectionEvidenceTypeError(reference.id, reference.type);
    }

    return reference;
  }

  private aggregateContext(
    evidenceReferences: readonly EvidenceProjectionReference[],
  ): ProjectionContextAggregation {
    const evidenceByType = groupEvidenceReferences(evidenceReferences, (reference) => reference.type);
    const evidenceBySource = groupEvidenceReferences(
      evidenceReferences,
      (reference) => reference.source,
    );
    const flattenedReferenceCount = Object.values(evidenceByType).reduce(
      (count, references) => count + references.length,
      0,
    );

    if (flattenedReferenceCount !== evidenceReferences.length) {
      throw new ProjectionConsistencyError('Projection context aggregation is internally inconsistent.');
    }

    return Object.freeze({
      evidenceByType,
      evidenceBySource,
    });
  }

  private sortEvidence(evidence: readonly Evidence[]): readonly Evidence[] {
    return [...evidence].sort((left, right) => {
      const idComparison = left.id.toString().localeCompare(right.id.toString());

      if (idComparison !== 0) {
        return idComparison;
      }

      return left.version.toNumber() - right.version.toNumber();
    });
  }
}

function groupEvidenceReferences(
  evidenceReferences: readonly EvidenceProjectionReference[],
  selectKey: (reference: EvidenceProjectionReference) => string,
): Readonly<Record<string, readonly EvidenceProjectionReference[]>> {
  const groups = new Map<string, EvidenceProjectionReference[]>();

  for (const reference of evidenceReferences) {
    const key = selectKey(reference);
    const references = groups.get(key) ?? [];
    references.push(reference);
    groups.set(key, references);
  }

  return Object.freeze(
    Object.fromEntries(
      [...groups.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, references]) => [
          key,
          Object.freeze([...references].sort(compareEvidenceReferences)),
        ]),
    ),
  );
}

function compareEvidenceReferences(
  left: EvidenceProjectionReference,
  right: EvidenceProjectionReference,
): number {
  const idComparison = left.id.localeCompare(right.id);

  if (idComparison !== 0) {
    return idComparison;
  }

  return left.version - right.version;
}
