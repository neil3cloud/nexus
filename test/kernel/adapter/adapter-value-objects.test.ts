import { describe, expect, it } from 'vitest';

import { AdapterCapability } from '../../../src/kernel/adapter/adapter-capability';
import { AdapterId } from '../../../src/kernel/adapter/adapter-id';
import { AdapterLifecycle } from '../../../src/kernel/adapter/adapter-lifecycle';
import { AdapterMetadata } from '../../../src/kernel/adapter/adapter-metadata';
import { AdapterName } from '../../../src/kernel/adapter/adapter-name';
import { AdapterRequest } from '../../../src/kernel/adapter/adapter-request';
import { AdapterResponse } from '../../../src/kernel/adapter/adapter-response';
import { AdapterVersion } from '../../../src/kernel/adapter/adapter-version';
import {
  InvalidAdapterDefinitionError,
  InvalidAdapterLifecycleTransitionError,
  InvalidAdapterRequestError,
  InvalidAdapterResponseError,
} from '../../../src/kernel/adapter/adapter.errors';
import { ProtocolVersion } from '../../../src/kernel/adapter/protocol-version';

describe('Adapter value objects', () => {
  it('normalizes immutable adapter identity and version objects', () => {
    const adapterId = AdapterId.fromString(' adapter-1 ');
    const adapterName = AdapterName.fromString(' Test Adapter ');
    const adapterVersion = AdapterVersion.fromString(' 1.0.0 ');
    const protocolVersion = ProtocolVersion.fromString(' 1.0 ');

    expect(adapterId.toString()).toBe('adapter-1');
    expect(adapterName.toString()).toBe('Test Adapter');
    expect(adapterVersion.toString()).toBe('1.0.0');
    expect(protocolVersion.toString()).toBe('1.0');
    expect(adapterId.equals(AdapterId.fromString('adapter-1'))).toBe(true);
    expect(Object.isFrozen(adapterId)).toBe(true);
    expect(Object.isFrozen(adapterName)).toBe(true);
    expect(Object.isFrozen(adapterVersion)).toBe(true);
    expect(Object.isFrozen(protocolVersion)).toBe(true);
  });

  it('validates AdapterCapability as a technical function and rejects roles', () => {
    const capability = AdapterCapability.fromString(' StaticAnalysis ');

    expect(capability.toString()).toBe('StaticAnalysis');
    expect(capability.equals(AdapterCapability.fromString('StaticAnalysis'))).toBe(true);
    expect(Object.isFrozen(capability)).toBe(true);
    expect(() => AdapterCapability.fromString('Builder')).toThrow(InvalidAdapterDefinitionError);
  });

  it('validates deterministic lifecycle transitions', () => {
    const registered = AdapterLifecycle.registered();
    const available = registered.transitionTo('Available');
    const active = available.transitionTo('Active');
    const completed = active.transitionTo('Completed');
    const unavailable = completed.transitionTo('Unavailable');

    expect(unavailable.state).toBe('Unavailable');
    expect(registered.canTransitionTo('Available')).toBe(true);
    expect(registered.canTransitionTo('Active')).toBe(false);
    expect(() => registered.transitionTo('Active')).toThrow(InvalidAdapterLifecycleTransitionError);
    expect(() => unavailable.transitionTo('Available')).toThrow(InvalidAdapterLifecycleTransitionError);
    expect(Object.isFrozen(registered)).toBe(true);
  });

  it('constructs immutable AdapterMetadata with declared capabilities and supported roles', () => {
    const metadata = AdapterMetadata.create({
      id: 'adapter-1',
      name: 'Adapter One',
      version: '1.0.0',
      protocolVersion: '1.0',
      capabilities: ['TestGeneration', 'StaticAnalysis', 'StaticAnalysis'],
      supportedRoles: ['Reviewer', 'Builder', 'Builder'],
      attributes: {
        provider: 'test',
      },
    });

    expect(metadata.toSnapshot()).toEqual({
      id: 'adapter-1',
      name: 'Adapter One',
      version: '1.0.0',
      protocolVersion: '1.0',
      capabilities: ['StaticAnalysis', 'TestGeneration'],
      supportedRoles: ['Builder', 'Reviewer'],
      lifecycle: 'Registered',
      attributes: {
        provider: 'test',
      },
    });
    expect(metadata.supportsCapability(AdapterCapability.fromString('StaticAnalysis'))).toBe(true);
    expect(metadata.supportsRole(' Builder ')).toBe(true);
    expect(Object.isFrozen(metadata)).toBe(true);
    expect(Object.isFrozen(metadata.capabilities)).toBe(true);
    expect(Object.isFrozen(metadata.supportedRoles)).toBe(true);
    expect(Object.isFrozen(metadata.attributes)).toBe(true);
  });

  it('rejects invalid adapter definitions deterministically', () => {
    expect(() => AdapterId.fromString(' ')).toThrow(InvalidAdapterDefinitionError);
    expect(() =>
      AdapterMetadata.create({
        id: 'adapter-1',
        name: 'Adapter One',
        version: '1.0.0',
        protocolVersion: '1.0',
        capabilities: [],
        supportedRoles: ['Builder'],
      }),
    ).toThrow(InvalidAdapterDefinitionError);
    expect(() =>
      AdapterMetadata.create({
        id: 'adapter-1',
        name: 'Adapter One',
        version: '1.0.0',
        protocolVersion: '1.0',
        capabilities: ['CodeGeneration'],
        supportedRoles: [],
      }),
    ).toThrow(InvalidAdapterDefinitionError);
  });
});

describe('AdapterRequest and AdapterResponse', () => {
  it('constructs immutable AdapterRequest values', () => {
    const request = AdapterRequest.create({
      engineeringRole: ' Builder ',
      taskId: ' task-1 ',
      contextPackageReference: ' context-package-1 ',
      executionConstraints: {
        timeout: '60s',
      },
      requestMetadata: {
        correlation: 'correlation-1',
      },
    });

    expect(request.toSnapshot()).toEqual({
      engineeringRole: 'Builder',
      taskId: 'task-1',
      contextPackageReference: 'context-package-1',
      executionConstraints: {
        timeout: '60s',
      },
      requestMetadata: {
        correlation: 'correlation-1',
      },
    });
    expect(Object.isFrozen(request)).toBe(true);
    expect(Object.isFrozen(request.executionConstraints)).toBe(true);
    expect(Object.isFrozen(request.requestMetadata)).toBe(true);
    expect(() =>
      AdapterRequest.create({
        engineeringRole: ' ',
        taskId: 'task-1',
        contextPackageReference: 'context-package-1',
      }),
    ).toThrow(InvalidAdapterRequestError);
  });

  it('constructs immutable AdapterResponse values', () => {
    const response = AdapterResponse.create({
      status: 'Completed',
      diagnostics: [
        {
          code: 'adapter.completed',
          message: 'Adapter completed the delegated request.',
        },
      ],
      producedArtifacts: ['artifact-1'],
      findings: ['finding-1'],
      executionMetadata: {
        duration: '1s',
      },
    });

    expect(response.toSnapshot()).toEqual({
      status: 'Completed',
      diagnostics: [
        {
          code: 'adapter.completed',
          message: 'Adapter completed the delegated request.',
        },
      ],
      producedArtifacts: ['artifact-1'],
      findings: ['finding-1'],
      executionMetadata: {
        duration: '1s',
      },
    });
    expect(Object.isFrozen(response)).toBe(true);
    expect(Object.isFrozen(response.diagnostics)).toBe(true);
    expect(Object.isFrozen(response.diagnostics[0])).toBe(true);
    expect(Object.isFrozen(response.producedArtifacts)).toBe(true);
    expect(Object.isFrozen(response.findings)).toBe(true);
    expect(Object.isFrozen(response.executionMetadata)).toBe(true);
    expect(() => AdapterResponse.create({ status: 'Running' })).toThrow(InvalidAdapterResponseError);
  });
});
