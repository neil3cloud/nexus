import { ServiceLifecycle } from '../common/service-lifecycle';
import { AdapterCapability } from './adapter-capability';
import { AdapterId } from './adapter-id';
import type { AdapterMetadata } from './adapter-metadata';
import type { AdapterRequest } from './adapter-request';
import type { AdapterResponse } from './adapter-response';
import type { AdapterRegistry } from './adapter-registry';
import {
  AdapterNotFoundError,
  IncompatibleAdapterProtocolVersionError,
  UnsupportedAdapterCapabilityError,
} from './adapter.errors';
import { ProtocolVersion } from './protocol-version';

export interface AdapterDispatchRequest {
  readonly adapterId: AdapterId | string;
  readonly request: AdapterRequest;
  readonly requiredCapability?: AdapterCapability | string;
}

export class AdapterService extends ServiceLifecycle {
  public constructor(
    private readonly registry: AdapterRegistry,
    private readonly protocolVersion: ProtocolVersion,
  ) {
    super('AdapterService');
  }

  public async enumerateAdapters(): Promise<readonly AdapterMetadata[]> {
    return this.registry.enumerate();
  }

  public async dispatch(input: AdapterDispatchRequest): Promise<AdapterResponse> {
    const adapterId = normalizeAdapterId(input.adapterId);
    const adapter = await this.registry.getById(adapterId);

    if (adapter === undefined) {
      throw new AdapterNotFoundError(adapterId.toString());
    }

    if (!adapter.metadata.protocolVersion.equals(this.protocolVersion)) {
      throw new IncompatibleAdapterProtocolVersionError(
        adapterId.toString(),
        this.protocolVersion.toString(),
        adapter.metadata.protocolVersion.toString(),
      );
    }

    if (input.requiredCapability !== undefined) {
      const requiredCapability = normalizeCapability(input.requiredCapability);

      if (!adapter.metadata.supportsCapability(requiredCapability)) {
        throw new UnsupportedAdapterCapabilityError(
          adapterId.toString(),
          requiredCapability.toString(),
        );
      }
    }

    return adapter.execute(input.request);
  }
}

function normalizeAdapterId(adapterId: AdapterId | string): AdapterId {
  return typeof adapterId === 'string' ? AdapterId.fromString(adapterId) : adapterId;
}

function normalizeCapability(capability: AdapterCapability | string): AdapterCapability {
  return typeof capability === 'string' ? AdapterCapability.fromString(capability) : capability;
}
