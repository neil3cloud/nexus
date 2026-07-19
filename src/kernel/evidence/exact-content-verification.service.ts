import { createHash } from 'node:crypto';

import { Evidence } from './evidence.aggregate';
import {
  ContentDigestMismatchException,
  EvidenceNotFoundException,
  ExactContentCycleDetectedException,
  ExactContentRequiredException,
  ExactContentSourceVerificationException,
  RepresentedContentReferenceMismatchException,
} from './evidence.errors';
import type { ExactContentResolver } from './exact-content-resolver';
import { ExactContentCanonicalizerRegistry } from './exact-content-canonicalizer-registry';
import type { ExactContentCanonicalizer } from './exact-content-canonicalizer-registry';
import type { RepresentedContentReferenceField } from './exact-content-reference';
import type { IEvidenceRepository } from './evidence.repository';

export type VerificationStatus = 'Verified' | 'Failed';

export class VerificationResult {
  private constructor(
    public readonly status: VerificationStatus,
    public readonly diagnostic: string | undefined,
  ) {
    Object.freeze(this);
  }

  public static verified(): VerificationResult {
    return new VerificationResult('Verified', undefined);
  }

  public static failed(error: Error): VerificationResult {
    return new VerificationResult('Failed', error.message);
  }

  public get verified(): boolean {
    return this.status === 'Verified';
  }
}

export class ExactContentVerificationService {
  public constructor(
    private readonly resolver: ExactContentResolver,
    private readonly repository: IEvidenceRepository,
    private readonly canonicalizer: ExactContentCanonicalizer =
      new ExactContentCanonicalizerRegistry(),
  ) {}

  public async verify(evidence: Evidence): Promise<VerificationResult> {
    try {
      await this.verifyEvidence(evidence, new Set<string>());
      return VerificationResult.verified();
    } catch (error) {
      return VerificationResult.failed(toError(error));
    }
  }

  private async verifyEvidence(evidence: Evidence, visited: Set<string>): Promise<void> {
    if (!evidence.hasExactContent()) {
      throw new ExactContentRequiredException(evidence.id.toString(), evidence.version.toNumber());
    }

    const traversalKey = `${evidence.id.toString()}\u001f${evidence.version.toNumber()}`;

    if (visited.has(traversalKey)) {
      throw new ExactContentCycleDetectedException(evidence.id.toString(), evidence.version.toNumber());
    }

    visited.add(traversalKey);

    const exactContent = evidence.exactContent;

    if (exactContent.contentRepresentation === 'DerivedContent') {
      const sourceReference = exactContent.sourceEvidenceReferences[0];

      if (sourceReference === undefined) {
        throw new ExactContentSourceVerificationException('DerivedContent source reference is missing.');
      }

      const sourceEvidence = await this.repository.getByIdAndVersion(
        sourceReference.evidenceId,
        sourceReference.evidenceVersion,
      );

      if (sourceEvidence === undefined) {
        throw new EvidenceNotFoundException(sourceReference.evidenceId.toString());
      }

      try {
        await this.verifyEvidence(sourceEvidence, visited);
      } catch (error) {
        throw new ExactContentSourceVerificationException(toError(error).message);
      }
    }

    const requestedReference = exactContent.representedContentReference;
    const resolved = await this.resolver.resolve(requestedReference.toSnapshot());
    const echoedReference = resolved.echoedReference;

    for (const field of representedContentReferenceFields) {
      const expected = requestedReference.toSnapshot()[field];
      const actual = echoedReference[field];

      if (actual !== expected) {
        throw new RepresentedContentReferenceMismatchException(field, expected, actual);
      }
    }

    const canonicalBytes = this.canonicalizer.canonicalize(
      requestedReference,
      resolved.sourceOctets,
    );
    const computedDigest = createHash('sha256').update(canonicalBytes).digest('hex');

    if (computedDigest !== exactContent.contentDigest.toString()) {
      throw new ContentDigestMismatchException();
    }

    visited.delete(traversalKey);
  }
}

const representedContentReferenceFields: readonly RepresentedContentReferenceField[] = [
  'contentOwner',
  'contentType',
  'contentId',
  'contentRevision',
  'evidenceTypeIdentity',
  'evidenceTypeVersion',
];

function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error(String(error));
}
