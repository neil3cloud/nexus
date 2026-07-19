import type {
  RepresentedContentReferenceInput,
  RepresentedContentReferenceSnapshot,
} from './exact-content-reference';

export interface ExactContentResolutionRequest extends RepresentedContentReferenceInput {}

export interface ResolvedSourceRepresentation {
  readonly sourceOctets: Uint8Array;
  readonly echoedReference: RepresentedContentReferenceSnapshot;
}

export interface ExactContentResolver {
  resolve(requestedReference: ExactContentResolutionRequest): Promise<ResolvedSourceRepresentation>;
}
