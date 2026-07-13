import { describe, expect, it } from 'vitest';

import type { Adapter } from '../../../src/kernel/adapter/adapter.contract';
import { AdapterMetadata } from '../../../src/kernel/adapter/adapter-metadata';
import { AdapterRequest } from '../../../src/kernel/adapter/adapter-request';
import { AdapterResponse } from '../../../src/kernel/adapter/adapter-response';
import { InMemoryAdapterRegistry } from '../../../src/kernel/adapter/adapter-registry';
import {
  AdapterNotFoundError,
  DuplicateAdapterRegistrationError,
} from '../../../src/kernel/adapter/adapter.errors';

class TestAdapter implements Adapter {
  public readonly metadata: AdapterMetadata;

  public constructor(adapterId: string) {
    this.metadata = AdapterMetadata.create({
      id: adapterId,
      name: `Adapter ${adapterId}`,
      version: '1.0.0',
      protocolVersion: '1.0',
      capabilities: ['StaticAnalysis'],
      supportedRoles: ['Reviewer'],
    });
  }

  public async execute(request: AdapterRequest): Promise<AdapterResponse> {
    void request;

    return AdapterResponse.create({ status: 'Completed' });
  }
}

describe('InMemoryAdapterRegistry', () => {
  it('registers, discovers, retrieves, and unregisters adapters deterministically', async () => {
    const registry = new InMemoryAdapterRegistry();
    const adapterB = new TestAdapter('adapter-b');
    const adapterA = new TestAdapter('adapter-a');

    await registry.register(adapterB);
    await registry.register(adapterA);

    expect(await registry.has('adapter-a')).toBe(true);
    expect(await registry.getById('adapter-a')).toBe(adapterA);
    expect((await registry.enumerate()).map((metadata) => metadata.id.toString())).toEqual([
      'adapter-a',
      'adapter-b',
    ]);

    await registry.unregister('adapter-a');

    expect(await registry.has('adapter-a')).toBe(false);
    expect(await registry.getById('adapter-a')).toBeUndefined();
  });

  it('rejects duplicate registration and missing unregister operations', async () => {
    const registry = new InMemoryAdapterRegistry();
    const adapter = new TestAdapter('adapter-1');

    await registry.register(adapter);

    await expect(registry.register(adapter)).rejects.toThrow(DuplicateAdapterRegistrationError);
    await expect(registry.unregister('missing-adapter')).rejects.toThrow(AdapterNotFoundError);
  });
});
