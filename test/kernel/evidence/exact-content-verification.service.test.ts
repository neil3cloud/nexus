import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { Evidence } from '../../../src/kernel/evidence/evidence.aggregate';
import {
  ContentDigestMismatchException,
  EvidenceVersionNotFoundException,
  ExactContentCycleDetectedException,
  ExactContentRequiredException,
  RepresentedContentReferenceMismatchException,
  UnsupportedCanonicalizerIdentityException,
  UnsupportedCanonicalizerVersionException,
} from '../../../src/kernel/evidence/evidence.errors';
import type {
  ExactContentResolver,
  ResolvedSourceRepresentation,
} from '../../../src/kernel/evidence/exact-content-resolver';
import { ExactContentVerificationService } from '../../../src/kernel/evidence/exact-content-verification.service';
import { InMemoryEvidenceRepository } from '../../../src/kernel/evidence/evidence.repository';
import { InMemoryExactContentResolver } from '../../../src/kernel/evidence/in-memory-exact-content-resolver';
import type { ExactContentCanonicalizer } from '../../../src/kernel/evidence/exact-content-canonicalizer-registry';
import type { RepresentedContentReferenceInput } from '../../../src/kernel/evidence/exact-content-reference';

describe('ExactContentVerificationService', () => {
  it('verifies SnapshotContent by resolving, canonicalizing, and matching SHA-256 digest', async () => {
    const { service, evidence } = await harness(snapshotEvidence('snapshot-1', 1, bytes('hello')));

    await expect(service.verify(evidence)).resolves.toMatchObject({
      status: 'Verified',
      diagnostic: undefined,
      verified: true,
    });
  });

  it('fails closed for syntactically valid but incorrect content digest', async () => {
    const { service, evidence } = await harness(
      snapshotEvidence('snapshot-1', 1, bytes('hello'), { contentDigest: '0'.repeat(64) }),
    );

    await expect(service.verify(evidence)).resolves.toMatchObject({
      status: 'Failed',
      diagnostic: new ContentDigestMismatchException().message,
    });
  });

  it('reports unsupported profile identity and version distinctly during verification', async () => {
    const unsupportedIdentity = await harness(
      snapshotEvidence('snapshot-1', 1, bytes('hello'), {
        representedContentReference: representedContentReference({
          evidenceTypeIdentity: 'UnsupportedProfile',
        }),
      }),
    );
    const unsupportedVersion = await harness(
      snapshotEvidence('snapshot-2', 1, bytes('hello'), {
        representedContentReference: representedContentReference({ evidenceTypeVersion: '2' }),
      }),
    );

    await expect(unsupportedIdentity.service.verify(unsupportedIdentity.evidence)).resolves.toMatchObject({
      status: 'Failed',
      diagnostic: new UnsupportedCanonicalizerIdentityException('UnsupportedProfile').message,
    });
    await expect(unsupportedVersion.service.verify(unsupportedVersion.evidence)).resolves.toMatchObject({
      status: 'Failed',
      diagnostic: new UnsupportedCanonicalizerVersionException('ExactOctetStream', '2').message,
    });
  });

  it('fails closed on every six-field resolver substitution mismatch', async () => {
    const referenceFields = [
      'contentOwner',
      'contentType',
      'contentId',
      'contentRevision',
      'evidenceTypeIdentity',
      'evidenceTypeVersion',
    ] as const;

    for (const field of referenceFields) {
      const evidence = snapshotEvidence(`snapshot-${field}`, 1, bytes('hello'));
      const service = new ExactContentVerificationService(
        new SubstitutingResolver(field, 'substituted'),
        new InMemoryEvidenceRepository(),
      );

      await expect(service.verify(evidence)).resolves.toMatchObject({
        status: 'Failed',
      });
      expect((await service.verify(evidence)).diagnostic).toContain(
        new RepresentedContentReferenceMismatchException(field, evidence.exactContent.representedContentReference.toSnapshot()[field], 'substituted').message,
      );
    }
  });

  it('recursively verifies DerivedContent through exact EvidenceId and EvidenceVersion sources', async () => {
    const repository = new InMemoryEvidenceRepository();
    const resolver = new InMemoryExactContentResolver();
    const sourceV1 = snapshotEvidence('source-1', 1, bytes('source-v1'));
    const sourceV2 = snapshotEvidence('source-1', 2, bytes('source-v2'));
    const derived = derivedEvidence('derived-1', 1, bytes('derived'), 'source-1', 2);

    for (const evidence of [sourceV1, sourceV2, derived]) {
      await repository.register(evidence);
      resolver.register(evidence.exactContent.representedContentReference.toSnapshot(), contentBytes(evidence));
    }

    const service = new ExactContentVerificationService(resolver, repository);

    await expect(service.verify(derived)).resolves.toMatchObject({
      status: 'Verified',
    });
  });

  it('distinguishes missing source identity and missing source version', async () => {
    const missingIdentity = await harness(
      derivedEvidence('derived-1', 1, bytes('derived'), 'missing-source', 1),
    );
    const repository = new InMemoryEvidenceRepository();
    const resolver = new InMemoryExactContentResolver();
    const source = snapshotEvidence('source-1', 1, bytes('source'));
    const missingVersion = derivedEvidence('derived-2', 1, bytes('derived'), 'source-1', 2);

    await repository.register(source);
    resolver.register(source.exactContent.representedContentReference.toSnapshot(), bytes('source'));
    resolver.register(
      missingVersion.exactContent.representedContentReference.toSnapshot(),
      bytes('derived'),
    );

    const missingVersionService = new ExactContentVerificationService(resolver, repository);

    await expect(missingIdentity.service.verify(missingIdentity.evidence)).resolves.toMatchObject({
      status: 'Failed',
      diagnostic: "Evidence 'missing-source' was not found.",
    });
    await expect(missingVersionService.verify(missingVersion)).resolves.toMatchObject({
      status: 'Failed',
      diagnostic: new EvidenceVersionNotFoundException('source-1', 2).message,
    });
  });

  it('detects transitive cycles in DerivedContent chains', async () => {
    const repository = new InMemoryEvidenceRepository();
    const resolver = new InMemoryExactContentResolver();
    const evidenceA = derivedEvidence('evidence-a', 1, bytes('a'), 'evidence-b', 1);
    const evidenceB = derivedEvidence('evidence-b', 1, bytes('b'), 'evidence-a', 1);

    for (const evidence of [evidenceA, evidenceB]) {
      await repository.register(evidence);
      resolver.register(evidence.exactContent.representedContentReference.toSnapshot(), contentBytes(evidence));
    }

    const service = new ExactContentVerificationService(resolver, repository);

    await expect(service.verify(evidenceA)).resolves.toMatchObject({
      status: 'Failed',
      diagnostic: `DerivedContent source Evidence failed Resolution Verification: DerivedContent source Evidence failed Resolution Verification: ${new ExactContentCycleDetectedException('evidence-a', 1).message}`,
    });
  });

  it('requires recursive DerivedContent chains to terminate in verified SnapshotContent', async () => {
    const repository = new InMemoryEvidenceRepository();
    const resolver = new InMemoryExactContentResolver();
    const legacy = legacyEvidence('legacy-source', 1);
    const derived = derivedEvidence('derived-1', 1, bytes('derived'), 'legacy-source', 1);

    await repository.register(legacy);
    await repository.register(derived);
    resolver.register(derived.exactContent.representedContentReference.toSnapshot(), bytes('derived'));

    const service = new ExactContentVerificationService(resolver, repository);

    await expect(service.verify(derived)).resolves.toMatchObject({
      status: 'Failed',
      diagnostic: `DerivedContent source Evidence failed Resolution Verification: ${new ExactContentRequiredException('legacy-source', 1).message}`,
    });
  });

  it('repeats full resolution, canonicalization, and digest work on successive verify calls', async () => {
    const resolver = new CountingResolver();
    const canonicalizer = new CountingCanonicalizer();
    const evidence = snapshotEvidence('snapshot-1', 1, bytes('hello'));

    resolver.register(evidence.exactContent.representedContentReference.toSnapshot(), bytes('hello'));
    const service = new ExactContentVerificationService(
      resolver,
      new InMemoryEvidenceRepository(),
      canonicalizer,
    );

    await service.verify(evidence);
    await service.verify(evidence);

    expect(resolver.resolveCount).toBe(2);
    expect(canonicalizer.canonicalizeCount).toBe(2);
  });
});

class SubstitutingResolver implements ExactContentResolver {
  public constructor(
    private readonly field: keyof RepresentedContentReferenceInput,
    private readonly value: string,
  ) {}

  public async resolve(requestedReference: RepresentedContentReferenceInput): Promise<ResolvedSourceRepresentation> {
    return {
      sourceOctets: bytes('hello'),
      echoedReference: {
        ...requestedReference,
        [this.field]: this.value,
      },
    };
  }
}

class CountingResolver extends InMemoryExactContentResolver {
  public resolveCount = 0;

  public override async resolve(
    requestedReference: RepresentedContentReferenceInput,
  ): Promise<ResolvedSourceRepresentation> {
    this.resolveCount += 1;
    return super.resolve(requestedReference);
  }
}

class CountingCanonicalizer implements ExactContentCanonicalizer {
  public canonicalizeCount = 0;

  public canonicalize(_reference: unknown, sourceOctets: Uint8Array): Uint8Array {
    this.canonicalizeCount += 1;
    return new Uint8Array(sourceOctets);
  }
}

async function harness(evidence: Evidence): Promise<{
  readonly service: ExactContentVerificationService;
  readonly evidence: Evidence;
}> {
  const repository = new InMemoryEvidenceRepository();
  const resolver = new InMemoryExactContentResolver();

  await repository.register(evidence);

  if (evidence.hasExactContent()) {
    resolver.register(evidence.exactContent.representedContentReference.toSnapshot(), contentBytes(evidence));
  }

  return {
    service: new ExactContentVerificationService(resolver, repository),
    evidence,
  };
}

function snapshotEvidence(
  id: string,
  version: number,
  octets: Uint8Array,
  overrides: Partial<{
    readonly representedContentReference: RepresentedContentReferenceInput;
    readonly contentDigest: string;
  }> = {},
): Evidence {
  return Evidence.register({
    ...baseEvidenceRequest(id, version),
    exactContent: {
      representedContentReference:
        overrides.representedContentReference ??
        representedContentReference({ contentId: id, contentRevision: `rev-${version}` }),
      contentRepresentation: 'SnapshotContent',
      contentDigestAlgorithm: 'SHA-256',
      contentDigest: overrides.contentDigest ?? sha256(octets),
      sourceEvidenceReferences: [],
    },
  });
}

function derivedEvidence(
  id: string,
  version: number,
  octets: Uint8Array,
  sourceEvidenceId: string,
  sourceEvidenceVersion: number,
): Evidence {
  return Evidence.register({
    ...baseEvidenceRequest(id, version),
    exactContent: {
      representedContentReference: representedContentReference({ contentId: id, contentRevision: `rev-${version}` }),
      contentRepresentation: 'DerivedContent',
      contentDigestAlgorithm: 'SHA-256',
      contentDigest: sha256(octets),
      sourceEvidenceReferences: [
        {
          evidenceId: sourceEvidenceId,
          evidenceVersion: sourceEvidenceVersion,
        },
      ],
    },
  });
}

function legacyEvidence(id: string, version: number): Evidence {
  return Evidence.register(baseEvidenceRequest(id, version));
}

function baseEvidenceRequest(id: string, version: number) {
  return {
    id,
    type: 'TestResult',
    version,
    hash: `sha256:${id}:${version}`,
    metadata: {
      capturedAt: '2026-07-12T00:00:00.000Z',
    },
    confidenceClassification: 'Verified',
    provenance: {
      source: 'vitest',
      acquisitionMethod: 'test-run',
      acquiredAt: '2026-07-12T00:00:00.000Z',
      actor: 'builder',
      system: 'nexus',
      verificationStatus: 'Verified',
      verificationStatusSemantics: 'EvidenceVerificationStatus/v1',
    },
  };
}

function representedContentReference(
  overrides: Partial<RepresentedContentReferenceInput> = {},
): RepresentedContentReferenceInput {
  return {
    contentOwner: 'repo',
    contentType: 'file',
    contentId: 'artifact',
    contentRevision: 'rev-1',
    evidenceTypeIdentity: 'ExactOctetStream',
    evidenceTypeVersion: '1',
    ...overrides,
  };
}

function contentBytes(evidence: Evidence): Uint8Array {
  const contentId = evidence.exactContent.representedContentReference.contentId;

  if (contentId === 'source-1' && evidence.version.toNumber() === 1) {
    return bytes('source-v1');
  }

  if (contentId === 'source-1' && evidence.version.toNumber() === 2) {
    return bytes('source-v2');
  }

  if (contentId === 'derived-1' || contentId === 'derived-2') {
    return bytes('derived');
  }

  if (contentId === 'evidence-a') {
    return bytes('a');
  }

  if (contentId === 'evidence-b') {
    return bytes('b');
  }

  return bytes('hello');
}

function bytes(value: string): Uint8Array {
  return Buffer.from(value);
}

function sha256(octets: Uint8Array): string {
  return createHash('sha256').update(octets).digest('hex');
}
