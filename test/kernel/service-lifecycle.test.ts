import { describe, expect, it } from 'vitest';

import { ServiceLifecycle } from '../../src/kernel/common/service-lifecycle';

class TestServiceLifecycle extends ServiceLifecycle {
  public constructor() {
    super('TestServiceLifecycle');
  }
}

describe('ServiceLifecycle', () => {
  it('reports not-initialized before initialize is called', () => {
    const service = new TestServiceLifecycle();

    expect(service.health()).toEqual({
      serviceName: 'TestServiceLifecycle',
      status: 'not-initialized',
    });
  });

  it('reports ready after initialize is called', async () => {
    const service = new TestServiceLifecycle();

    await service.initialize();

    expect(service.health()).toEqual({
      serviceName: 'TestServiceLifecycle',
      status: 'ready',
    });
  });

  it('reports disposed after dispose is called', async () => {
    const service = new TestServiceLifecycle();

    await service.initialize();
    service.dispose();

    expect(service.health()).toEqual({
      serviceName: 'TestServiceLifecycle',
      status: 'disposed',
    });
  });
});
