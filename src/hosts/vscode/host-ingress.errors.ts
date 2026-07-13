export class HostIngressError extends Error {
  public constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'HostIngressError';
  }
}
