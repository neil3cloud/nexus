export class AdapterRuntimeOperationalMetadataError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'AdapterRuntimeOperationalMetadataError';
  }
}

export class InvalidAdapterRuntimeMetadataError extends AdapterRuntimeOperationalMetadataError {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidAdapterRuntimeMetadataError';
  }
}
