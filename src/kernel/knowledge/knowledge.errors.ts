import { KernelError } from '../common/kernel-error';

export class KnowledgeDomainError extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'KnowledgeDomainError';
  }
}

export class InvalidKnowledgeDefinitionError extends KnowledgeDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidKnowledgeDefinitionError';
  }
}

export class InvalidKnowledgeLifecycleTransitionError extends KnowledgeDomainError {
  public constructor(from: string, to: string) {
    super(`Knowledge cannot transition from '${from}' to '${to}'.`);
    this.name = 'InvalidKnowledgeLifecycleTransitionError';
  }
}

export class KnowledgeCapturePreconditionError extends KnowledgeDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'KnowledgeCapturePreconditionError';
  }
}

export class KnowledgeRevisionRejectedError extends KnowledgeDomainError {
  public constructor(message: string) {
    super(message);
    this.name = 'KnowledgeRevisionRejectedError';
  }
}

export class DuplicateKnowledgeError extends KnowledgeDomainError {
  public constructor(knowledgeId: string) {
    super(`Knowledge '${knowledgeId}' already exists.`);
    this.name = 'DuplicateKnowledgeError';
  }
}

export class KnowledgeNotFoundError extends KnowledgeDomainError {
  public constructor(knowledgeId: string) {
    super(`Knowledge '${knowledgeId}' was not found.`);
    this.name = 'KnowledgeNotFoundError';
  }
}

export class KnowledgeEventPublisherUnavailableError extends KnowledgeDomainError {
  public constructor() {
    super('KnowledgeService requires an EventBusContract to publish Knowledge domain events.');
    this.name = 'KnowledgeEventPublisherUnavailableError';
  }
}
