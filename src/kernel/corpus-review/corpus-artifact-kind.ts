import { InvalidCorpusArtifactKindException } from './corpus-review.errors';

export const corpusArtifactKindValues = [
  'Canon',
  'RFC',
  'ADR',
  'Ratification',
  'RepositoryPolicy',
  'ImplementationConstitution',
  'ImplementationPlan',
  'ImplementationManifest',
  'SprintImplementationRecord',
  'ReviewHistory',
  'ProviderInstruction',
  'BuilderInstruction',
  'ReviewerInstruction',
  'PlannerInstruction',
] as const;

export type CorpusArtifactKindValue = (typeof corpusArtifactKindValues)[number];

const authorityBearingCorpusArtifactKinds = [
  'Canon',
  'RFC',
  'ADR',
  'Ratification',
  'RepositoryPolicy',
  'ImplementationConstitution',
  'ProviderInstruction',
  'BuilderInstruction',
  'ReviewerInstruction',
  'PlannerInstruction',
] as const satisfies readonly CorpusArtifactKindValue[];

export class CorpusArtifactKind {
  private constructor(private readonly value: CorpusArtifactKindValue) {
    Object.freeze(this);
  }

  public static fromString(value: string): CorpusArtifactKind {
    if (isCorpusArtifactKindValue(value)) {
      return new CorpusArtifactKind(value);
    }

    throw new InvalidCorpusArtifactKindException(
      `CorpusArtifactKind '${value}' is not one of the fourteen authorized core values.`,
    );
  }

  public get canonicalArtifactKindKey(): string {
    return this.value;
  }

  public isAuthorityBearing(): boolean {
    return authorityBearingCorpusArtifactKinds.some((kind) => kind === this.value);
  }

  public equals(other: CorpusArtifactKind): boolean {
    return this.value === other.value;
  }

  public toString(): CorpusArtifactKindValue {
    return this.value;
  }

  public toJSON(): CorpusArtifactKindValue {
    return this.value;
  }
}

function isCorpusArtifactKindValue(value: string): value is CorpusArtifactKindValue {
  return corpusArtifactKindValues.some((kind) => kind === value);
}
