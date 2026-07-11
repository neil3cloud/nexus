export class KernelError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'KernelError';
  }
}
