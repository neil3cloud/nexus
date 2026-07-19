import { ContentDigest, ContentDigestAlgorithm } from './content-digest';
import { EvidenceId } from './evidence-id';
import { EvidenceVersion } from './evidence-version';
import {
  DerivedContentMultiSourceDeferredException,
  DerivedContentZeroSourceException,
  DuplicateDerivedContentSourceException,
  InvalidEvidenceException,
  SnapshotContentSourceReferenceException,
} from './evidence.errors';
import { RepresentedContentReference } from './exact-content-reference';
import type {
  RepresentedContentReferenceInput,
  RepresentedContentReferenceSnapshot,
} from './exact-content-reference';

export const contentRepresentationClassifications = ['SnapshotContent', 'DerivedContent'] as const;

export type ContentRepresentationClassification =
  (typeof contentRepresentationClassifications)[number];

export interface ExactContentSourceReferenceInput {
  readonly evidenceId: string;
  readonly evidenceVersion: number;
}

export type ExactContentSourceReferenceSnapshot = ExactContentSourceReferenceInput;

export interface ExactContentEvidenceInput {
  readonly representedContentReference: RepresentedContentReferenceInput;
  readonly contentRepresentation: ContentRepresentationClassification;
  readonly contentDigestAlgorithm: string;
  readonly contentDigest: string;
  readonly sourceEvidenceReferences?: readonly ExactContentSourceReferenceInput[];
}

export interface ExactContentEvidenceSnapshot {
  readonly representedContentReference: RepresentedContentReferenceSnapshot;
  readonly contentRepresentation: ContentRepresentationClassification;
  readonly contentDigestAlgorithm: string;
  readonly contentDigest: string;
  readonly sourceEvidenceReferences: readonly ExactContentSourceReferenceSnapshot[];
}

export class ExactContentSourceReference {
  private constructor(
    private readonly evidenceIdValue: EvidenceId,
    private readonly evidenceVersionValue: EvidenceVersion,
  ) {
    Object.freeze(this);
  }

  public static create(input: ExactContentSourceReferenceInput): ExactContentSourceReference {
    return new ExactContentSourceReference(
      EvidenceId.fromString(input.evidenceId),
      EvidenceVersion.fromNumber(input.evidenceVersion),
    );
  }

  public static fromSnapshot(
    snapshot: ExactContentSourceReferenceSnapshot,
  ): ExactContentSourceReference {
    return ExactContentSourceReference.create(snapshot);
  }

  public get evidenceId(): EvidenceId {
    return this.evidenceIdValue;
  }

  public get evidenceVersion(): EvidenceVersion {
    return this.evidenceVersionValue;
  }

  public equals(other: ExactContentSourceReference): boolean {
    return (
      this.evidenceIdValue.equals(other.evidenceIdValue) &&
      this.evidenceVersionValue.equals(other.evidenceVersionValue)
    );
  }

  public key(): string {
    return `${this.evidenceIdValue.toString()}\u001f${this.evidenceVersionValue.toNumber()}`;
  }

  public toSnapshot(): ExactContentSourceReferenceSnapshot {
    return {
      evidenceId: this.evidenceIdValue.toString(),
      evidenceVersion: this.evidenceVersionValue.toNumber(),
    };
  }
}

export class ExactContentEvidence {
  private constructor(
    private readonly representedContentReferenceValue: RepresentedContentReference,
    private readonly contentRepresentationValue: ContentRepresentationClassification,
    private readonly contentDigestAlgorithmValue: ContentDigestAlgorithm,
    private readonly contentDigestValue: ContentDigest,
    private readonly sourceEvidenceReferencesValue: readonly ExactContentSourceReference[],
  ) {
    Object.freeze(this.sourceEvidenceReferencesValue);
    Object.freeze(this);
  }

  public static create(input: ExactContentEvidenceInput): ExactContentEvidence {
    const contentRepresentation = parseContentRepresentation(input.contentRepresentation);
    const sourceEvidenceReferences = (input.sourceEvidenceReferences ?? []).map((sourceReference) =>
      ExactContentSourceReference.create(sourceReference),
    );

    validateSourceReferences(contentRepresentation, sourceEvidenceReferences);

    return new ExactContentEvidence(
      RepresentedContentReference.create(input.representedContentReference),
      contentRepresentation,
      ContentDigestAlgorithm.fromString(input.contentDigestAlgorithm),
      ContentDigest.fromString(input.contentDigest),
      sourceEvidenceReferences,
    );
  }

  public static fromSnapshot(snapshot: ExactContentEvidenceSnapshot): ExactContentEvidence {
    return ExactContentEvidence.create(snapshot);
  }

  public get representedContentReference(): RepresentedContentReference {
    return this.representedContentReferenceValue;
  }

  public get contentRepresentation(): ContentRepresentationClassification {
    return this.contentRepresentationValue;
  }

  public get contentDigestAlgorithm(): ContentDigestAlgorithm {
    return this.contentDigestAlgorithmValue;
  }

  public get contentDigest(): ContentDigest {
    return this.contentDigestValue;
  }

  public get sourceEvidenceReferences(): readonly ExactContentSourceReference[] {
    return [...this.sourceEvidenceReferencesValue];
  }

  public toSnapshot(): ExactContentEvidenceSnapshot {
    return {
      representedContentReference: this.representedContentReferenceValue.toSnapshot(),
      contentRepresentation: this.contentRepresentationValue,
      contentDigestAlgorithm: this.contentDigestAlgorithmValue.toString(),
      contentDigest: this.contentDigestValue.toString(),
      sourceEvidenceReferences: this.sourceEvidenceReferencesValue.map((sourceReference) =>
        sourceReference.toSnapshot(),
      ),
    };
  }
}

function parseContentRepresentation(value: string): ContentRepresentationClassification {
  if (isContentRepresentationClassification(value)) {
    return value;
  }

  throw new InvalidEvidenceException(
    `contentRepresentation '${value}' is not supported by RFC-0002 Exact Content Evidence.`,
  );
}

function isContentRepresentationClassification(
  value: string,
): value is ContentRepresentationClassification {
  return contentRepresentationClassifications.some((classification) => classification === value);
}

function validateSourceReferences(
  contentRepresentation: ContentRepresentationClassification,
  sourceReferences: readonly ExactContentSourceReference[],
): void {
  if (contentRepresentation === 'SnapshotContent') {
    if (sourceReferences.length > 0) {
      throw new SnapshotContentSourceReferenceException();
    }

    return;
  }

  if (sourceReferences.length === 0) {
    throw new DerivedContentZeroSourceException();
  }

  if (hasDuplicateSourceReference(sourceReferences)) {
    throw new DuplicateDerivedContentSourceException();
  }

  if (sourceReferences.length > 1) {
    throw new DerivedContentMultiSourceDeferredException();
  }
}

function hasDuplicateSourceReference(
  sourceReferences: readonly ExactContentSourceReference[],
): boolean {
  return new Set(sourceReferences.map((sourceReference) => sourceReference.key())).size !==
    sourceReferences.length;
}
