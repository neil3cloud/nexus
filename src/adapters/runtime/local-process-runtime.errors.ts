export class LocalProcessRuntimeError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'LocalProcessRuntimeError';
  }
}

export class InvalidProcessRequestError extends LocalProcessRuntimeError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidProcessRequestError';
  }
}

export class InvalidProcessResultError extends LocalProcessRuntimeError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidProcessResultError';
  }
}
