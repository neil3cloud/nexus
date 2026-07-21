export class CorpusReviewException extends Error {
  public constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class InvalidCorpusReviewPurposeException extends CorpusReviewException {}

export class InvalidCorpusArtifactKindException extends CorpusReviewException {}

export class InvalidCorpusArtifactReferenceException extends CorpusReviewException {}

export class MissingExactContentEvidenceException extends CorpusReviewException {
  public constructor() {
    super('CorpusArtifactReference requires Evidence with Exact Content Evidence.');
  }
}

export class EmptyCorpusReviewScopeException extends CorpusReviewException {
  public constructor() {
    super('CorpusReviewScope requires at least one CorpusArtifactReference.');
  }
}

export class EmptyCorpusReviewContractException extends CorpusReviewException {
  public constructor() {
    super('CorpusReviewContract requires at least one authority CorpusArtifactReference.');
  }
}

export class DuplicateCorpusArtifactReferenceIdException extends CorpusReviewException {
  public constructor(owner: 'CorpusReviewScope' | 'CorpusReviewContract', referenceId: string) {
    super(`${owner} cannot contain duplicate corpusArtifactReferenceId '${referenceId}'.`);
  }
}

export class DuplicateCanonicalCorpusArtifactIdentityException extends CorpusReviewException {
  public constructor(owner: 'CorpusReviewScope' | 'CorpusReviewContract', identity: string) {
    super(`${owner} cannot contain duplicate canonical exact artifact identity '${identity}'.`);
  }
}

export class IneligibleCorpusReviewContractArtifactKindException extends CorpusReviewException {
  public constructor(kind: string) {
    super(`CorpusArtifactKind '${kind}' is not eligible for CorpusReviewContract authority references.`);
  }
}

export class InvalidCorpusReviewOpeningAttributionException extends CorpusReviewException {}

export class InvalidCorpusReviewFingerprintInputException extends CorpusReviewException {}
