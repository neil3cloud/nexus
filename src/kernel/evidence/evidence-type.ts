import { InvalidEvidenceException } from './evidence.errors';

export const supportedEvidenceTypes = [
  'RepositorySourceCode',
  'ArchitectureDocument',
  'ADR',
  'AcceptedMissionOutcome',
  'ApprovedRepositoryPolicy',
  'BuildOutput',
  'StaticAnalysisResult',
  'TestResult',
  'HumanApprovedDecision',
] as const;

export type EvidenceTypeName = (typeof supportedEvidenceTypes)[number];

export class EvidenceType {
  private constructor(private readonly value: EvidenceTypeName) {
    Object.freeze(this);
  }

  public static fromString(value: string): EvidenceType {
    const normalized = value.trim();

    if (!isEvidenceTypeName(normalized)) {
      throw new InvalidEvidenceException(
        `EvidenceType '${normalized}' is not supported by the Evidence Foundation slice.`,
      );
    }

    return new EvidenceType(normalized);
  }

  public equals(other: EvidenceType): boolean {
    return this.value === other.value;
  }

  public toString(): EvidenceTypeName {
    return this.value;
  }

  public toJSON(): EvidenceTypeName {
    return this.value;
  }
}

function isEvidenceTypeName(value: string): value is EvidenceTypeName {
  return supportedEvidenceTypes.some((supportedType) => supportedType === value);
}
