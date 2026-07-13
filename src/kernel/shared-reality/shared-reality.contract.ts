export { ProjectionResult } from './projection-result';
export type { ProjectionResultSnapshot } from './projection-result';
export { ProjectionService } from './projection.service';
export { ProjectionVersion } from './projection-version';
export { SharedReality } from './shared-reality.aggregate';
export {
  DuplicateProjectionEvidenceReferenceError,
  ProjectionConsistencyError,
  ProjectionEvidenceRequiredError,
  ProjectionEvidenceNotFoundError,
  ProjectionEvidenceVersionMismatchError,
  ProjectionInactiveMissionError,
  ProjectionMissionNotFoundError,
  ProjectionMissionPlanNotFoundError,
  ProjectionValidationError,
  SharedRealityDomainException,
  UnsupportedProjectionEvidenceTypeError,
} from './shared-reality.errors';
export type {
  EvidenceProjectionReference,
  EvidenceProjectionRequest,
  MissionExecutionStateProjection,
  ProjectionContextAggregation,
  ProjectionMetadata,
  ProjectionRequest,
  SharedRealitySnapshot,
} from './shared-reality.types';
