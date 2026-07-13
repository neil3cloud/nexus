import { KernelError } from '../common/kernel-error';

export class ReviewDomainError extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'ReviewDomainError';
  }
}

export class InvalidReviewDefinitionError extends ReviewDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidReviewDefinitionError';
  }
}

export class InvalidReviewLifecycleTransitionError extends ReviewDomainError {
  public constructor(from: string, to: string) {
    super(`Review cannot transition from '${from}' to '${to}'.`);
    this.name = 'InvalidReviewLifecycleTransitionError';
  }
}

export class ReviewCompletionRejectedError extends ReviewDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'ReviewCompletionRejectedError';
  }
}

export class DuplicateReviewError extends ReviewDomainError {
  public constructor(reviewId: string) {
    super(`Review '${reviewId}' already exists.`);
    this.name = 'DuplicateReviewError';
  }
}

export class ReviewNotFoundError extends ReviewDomainError {
  public constructor(reviewId: string) {
    super(`Review '${reviewId}' was not found.`);
    this.name = 'ReviewNotFoundError';
  }
}

export class ReviewEventPublisherUnavailableError extends ReviewDomainError {
  public constructor() {
    super('ReviewService requires an EventBusContract to publish Review domain events.');
    this.name = 'ReviewEventPublisherUnavailableError';
  }
}

export class DuplicateFindingError extends ReviewDomainError {
  public constructor(findingId: string) {
    super(`Finding '${findingId}' already exists in Review.`);
    this.name = 'DuplicateFindingError';
  }
}

export class MissingEvidenceReferenceError extends ReviewDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'MissingEvidenceReferenceError';
  }
}

export class InvalidFindingLifecycleTransitionError extends ReviewDomainError {
  public constructor(from: string, to: string) {
    super(`Finding cannot transition from '${from}' to '${to}'.`);
    this.name = 'InvalidFindingLifecycleTransitionError';
  }
}
