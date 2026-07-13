import type { AdapterHealthStatusSnapshot } from '../../adapters/runtime/adapter-health-status';
import type { AdapterInstallationStatusSnapshot } from '../../adapters/runtime/adapter-installation-status';
import type { AdapterRuntimeDiagnostic } from '../../adapters/runtime/adapter-runtime-diagnostics';

export interface HostAdapterOperationalMetadataSnapshot {
  readonly installationStatus: AdapterInstallationStatusSnapshot;
  readonly healthStatus: AdapterHealthStatusSnapshot;
  readonly runtimeDiagnostics: readonly AdapterRuntimeDiagnostic[];
}

export interface HostAdapterOperationalMetadataProvider {
  getOperationalMetadata(
    adapterId: string,
  ): Promise<HostAdapterOperationalMetadataSnapshot | undefined>;
}

export class StaticHostAdapterOperationalMetadataProvider
  implements HostAdapterOperationalMetadataProvider
{
  private readonly metadataByAdapterId: ReadonlyMap<string, HostAdapterOperationalMetadataSnapshot>;

  public constructor(
    metadataByAdapterId: Readonly<Record<string, HostAdapterOperationalMetadataSnapshot>>,
  ) {
    this.metadataByAdapterId = new Map(
      Object.entries(metadataByAdapterId).map(([adapterId, metadata]) => [
        normalizeNonEmptyString(adapterId, 'Adapter identifier'),
        metadata,
      ]),
    );
  }

  public async getOperationalMetadata(
    adapterId: string,
  ): Promise<HostAdapterOperationalMetadataSnapshot | undefined> {
    return this.metadataByAdapterId.get(normalizeNonEmptyString(adapterId, 'Adapter identifier'));
  }
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }

  return normalized;
}
