import { AdapterCapability } from './adapter-capability';
import { AdapterId } from './adapter-id';
import { AdapterLifecycle } from './adapter-lifecycle';
import type { AdapterLifecycleState } from './adapter-lifecycle';
import { AdapterName } from './adapter-name';
import { AdapterVersion } from './adapter-version';
import { InvalidAdapterDefinitionError } from './adapter.errors';
import { ProtocolVersion } from './protocol-version';

export type AdapterMetadataAttributes = Readonly<Record<string, string>>;

export interface AdapterMetadataInput {
  readonly id: AdapterId | string;
  readonly name: AdapterName | string;
  readonly version: AdapterVersion | string;
  readonly protocolVersion: ProtocolVersion | string;
  readonly capabilities: readonly (AdapterCapability | string)[];
  readonly supportedRoles: readonly string[];
  readonly lifecycle?: AdapterLifecycle | AdapterLifecycleState | string;
  readonly attributes?: AdapterMetadataAttributes;
}

export interface AdapterMetadataSnapshot {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly protocolVersion: string;
  readonly capabilities: readonly string[];
  readonly supportedRoles: readonly string[];
  readonly lifecycle: AdapterLifecycleState;
  readonly attributes: AdapterMetadataAttributes;
}

export class AdapterMetadata {
  private constructor(
    private readonly idValue: AdapterId,
    private readonly nameValue: AdapterName,
    private readonly versionValue: AdapterVersion,
    private readonly protocolVersionValue: ProtocolVersion,
    private readonly capabilitiesValue: readonly AdapterCapability[],
    private readonly supportedRolesValue: readonly string[],
    private readonly lifecycleValue: AdapterLifecycle,
    private readonly attributesValue: AdapterMetadataAttributes,
  ) {
    Object.freeze(this);
  }

  public static create(input: AdapterMetadataInput): AdapterMetadata {
    return new AdapterMetadata(
      normalizeAdapterId(input.id),
      normalizeAdapterName(input.name),
      normalizeAdapterVersion(input.version),
      normalizeProtocolVersion(input.protocolVersion),
      normalizeCapabilities(input.capabilities),
      normalizeSupportedRoles(input.supportedRoles),
      normalizeLifecycle(input.lifecycle),
      copyAttributes(input.attributes ?? {}),
    );
  }

  public static fromSnapshot(snapshot: AdapterMetadataSnapshot): AdapterMetadata {
    return AdapterMetadata.create(snapshot);
  }

  public get id(): AdapterId {
    return this.idValue;
  }

  public get name(): AdapterName {
    return this.nameValue;
  }

  public get version(): AdapterVersion {
    return this.versionValue;
  }

  public get protocolVersion(): ProtocolVersion {
    return this.protocolVersionValue;
  }

  public get capabilities(): readonly AdapterCapability[] {
    return this.capabilitiesValue;
  }

  public get supportedRoles(): readonly string[] {
    return this.supportedRolesValue;
  }

  public get lifecycle(): AdapterLifecycle {
    return this.lifecycleValue;
  }

  public get attributes(): AdapterMetadataAttributes {
    return this.attributesValue;
  }

  public supportsCapability(capability: AdapterCapability): boolean {
    return this.capabilitiesValue.some((declaredCapability) => declaredCapability.equals(capability));
  }

  public supportsRole(engineeringRole: string): boolean {
    const normalizedRole = normalizeNonEmptyString(engineeringRole, 'Engineering Role');

    return this.supportedRolesValue.some((supportedRole) => supportedRole === normalizedRole);
  }

  public withLifecycle(lifecycle: AdapterLifecycle | AdapterLifecycleState | string): AdapterMetadata {
    return AdapterMetadata.create({
      id: this.idValue,
      name: this.nameValue,
      version: this.versionValue,
      protocolVersion: this.protocolVersionValue,
      capabilities: this.capabilitiesValue,
      supportedRoles: this.supportedRolesValue,
      lifecycle,
      attributes: this.attributesValue,
    });
  }

  public toSnapshot(): AdapterMetadataSnapshot {
    return Object.freeze({
      id: this.idValue.toString(),
      name: this.nameValue.toString(),
      version: this.versionValue.toString(),
      protocolVersion: this.protocolVersionValue.toString(),
      capabilities: Object.freeze(this.capabilitiesValue.map((capability) => capability.toString())),
      supportedRoles: Object.freeze([...this.supportedRolesValue]),
      lifecycle: this.lifecycleValue.state,
      attributes: this.attributesValue,
    });
  }
}

function normalizeAdapterId(id: AdapterId | string): AdapterId {
  return typeof id === 'string' ? AdapterId.fromString(id) : id;
}

function normalizeAdapterName(name: AdapterName | string): AdapterName {
  return typeof name === 'string' ? AdapterName.fromString(name) : name;
}

function normalizeAdapterVersion(version: AdapterVersion | string): AdapterVersion {
  return typeof version === 'string' ? AdapterVersion.fromString(version) : version;
}

function normalizeProtocolVersion(protocolVersion: ProtocolVersion | string): ProtocolVersion {
  return typeof protocolVersion === 'string'
    ? ProtocolVersion.fromString(protocolVersion)
    : protocolVersion;
}

function normalizeLifecycle(
  lifecycle: AdapterLifecycle | AdapterLifecycleState | string | undefined,
): AdapterLifecycle {
  if (lifecycle === undefined) {
    return AdapterLifecycle.registered();
  }

  return typeof lifecycle === 'string' ? AdapterLifecycle.fromState(lifecycle) : lifecycle;
}

function normalizeCapabilities(
  capabilities: readonly (AdapterCapability | string)[],
): readonly AdapterCapability[] {
  if (capabilities.length === 0) {
    throw new InvalidAdapterDefinitionError('AdapterMetadata must declare at least one capability.');
  }

  const normalizedCapabilities = capabilities.map((capability) =>
    typeof capability === 'string' ? AdapterCapability.fromString(capability) : capability,
  );
  const uniqueCapabilities = new Map<string, AdapterCapability>();

  for (const capability of normalizedCapabilities) {
    uniqueCapabilities.set(capability.toString(), capability);
  }

  return Object.freeze(
    [...uniqueCapabilities.values()].sort((left, right) =>
      left.toString().localeCompare(right.toString()),
    ),
  );
}

function normalizeSupportedRoles(supportedRoles: readonly string[]): readonly string[] {
  if (supportedRoles.length === 0) {
    throw new InvalidAdapterDefinitionError('AdapterMetadata must declare at least one supported role.');
  }

  const uniqueRoles = new Set<string>();

  for (const role of supportedRoles) {
    uniqueRoles.add(normalizeNonEmptyString(role, 'Engineering Role'));
  }

  return Object.freeze([...uniqueRoles].sort((left, right) => left.localeCompare(right)));
}

function copyAttributes(attributes: AdapterMetadataAttributes): AdapterMetadataAttributes {
  const copied: Record<string, string> = {};

  for (const [key, value] of Object.entries(attributes)) {
    const normalizedKey = normalizeNonEmptyString(key, 'AdapterMetadata attribute key');
    copied[normalizedKey] = normalizeNonEmptyString(value, `AdapterMetadata attribute '${normalizedKey}'`);
  }

  return Object.freeze(copied);
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidAdapterDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
