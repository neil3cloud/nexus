import {
  UnsupportedCanonicalizerIdentityException,
  UnsupportedCanonicalizerVersionException,
} from './evidence.errors';
import type { RepresentedContentReference } from './exact-content-reference';

export interface ExactContentCanonicalizer {
  canonicalize(reference: RepresentedContentReference, sourceOctets: Uint8Array): Uint8Array;
}

export class ExactContentCanonicalizerRegistry implements ExactContentCanonicalizer {
  public canonicalize(reference: RepresentedContentReference, sourceOctets: Uint8Array): Uint8Array {
    if (reference.evidenceTypeIdentity !== 'ExactOctetStream') {
      throw new UnsupportedCanonicalizerIdentityException(reference.evidenceTypeIdentity);
    }

    if (reference.evidenceTypeVersion !== '1') {
      throw new UnsupportedCanonicalizerVersionException(
        reference.evidenceTypeIdentity,
        reference.evidenceTypeVersion,
      );
    }

    return new Uint8Array(sourceOctets);
  }
}
