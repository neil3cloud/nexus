import { InvalidAdapterRuntimeMetadataError } from './adapter-runtime-operational-metadata.errors';

export type AdapterConfigurationSettings = Readonly<Record<string, string>>;

export interface AdapterConfigurationInput {
  readonly adapterId: string;
  readonly executablePath?: string;
  readonly workingDirectory?: string;
  readonly environment?: AdapterConfigurationSettings;
  readonly settings?: AdapterConfigurationSettings;
}

export interface AdapterConfigurationSnapshot {
  readonly adapterId: string;
  readonly executablePath?: string;
  readonly workingDirectory?: string;
  readonly environment: AdapterConfigurationSettings;
  readonly settings: AdapterConfigurationSettings;
}

const forbiddenSecretKeyFragments = ['auth', 'credential', 'password', 'secret', 'token'] as const;

export class AdapterConfiguration {
  private constructor(
    private readonly adapterIdValue: string,
    private readonly executablePathValue: string | undefined,
    private readonly workingDirectoryValue: string | undefined,
    private readonly environmentValue: AdapterConfigurationSettings,
    private readonly settingsValue: AdapterConfigurationSettings,
  ) {
    Object.freeze(this);
  }

  public static create(input: AdapterConfigurationInput): AdapterConfiguration {
    return new AdapterConfiguration(
      normalizeNonEmptyString(input.adapterId, 'AdapterConfiguration adapterId'),
      normalizeOptionalNonEmptyString(input.executablePath, 'AdapterConfiguration executablePath'),
      normalizeOptionalNonEmptyString(input.workingDirectory, 'AdapterConfiguration workingDirectory'),
      copySettings(input.environment ?? {}, 'environment'),
      copySettings(input.settings ?? {}, 'settings'),
    );
  }

  public static fromSnapshot(snapshot: AdapterConfigurationSnapshot): AdapterConfiguration {
    return AdapterConfiguration.create(snapshot);
  }

  public get adapterId(): string {
    return this.adapterIdValue;
  }

  public get executablePath(): string | undefined {
    return this.executablePathValue;
  }

  public get workingDirectory(): string | undefined {
    return this.workingDirectoryValue;
  }

  public get environment(): AdapterConfigurationSettings {
    return this.environmentValue;
  }

  public get settings(): AdapterConfigurationSettings {
    return this.settingsValue;
  }

  public toSnapshot(): AdapterConfigurationSnapshot {
    return Object.freeze({
      adapterId: this.adapterIdValue,
      ...(this.executablePathValue === undefined
        ? {}
        : { executablePath: this.executablePathValue }),
      ...(this.workingDirectoryValue === undefined
        ? {}
        : { workingDirectory: this.workingDirectoryValue }),
      environment: this.environmentValue,
      settings: this.settingsValue,
    });
  }
}

function copySettings(
  settings: AdapterConfigurationSettings,
  label: string,
): AdapterConfigurationSettings {
  const copied: Record<string, string> = {};

  for (const [key, value] of Object.entries(settings).sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    const normalizedKey = normalizeNonEmptyString(key, `AdapterConfiguration ${label} key`);
    assertNonSecretKey(normalizedKey, label);
    copied[normalizedKey] = normalizeNonEmptyString(
      value,
      `AdapterConfiguration ${label} '${normalizedKey}'`,
    );
  }

  return Object.freeze(copied);
}

function assertNonSecretKey(key: string, label: string): void {
  const normalizedKey = key.toLowerCase();
  const forbiddenFragment = forbiddenSecretKeyFragments.find((fragment) =>
    normalizedKey.includes(fragment),
  );

  if (forbiddenFragment !== undefined) {
    throw new InvalidAdapterRuntimeMetadataError(
      `AdapterConfiguration ${label} key '${key}' must not contain secret-bearing fragment '${forbiddenFragment}'.`,
    );
  }
}

function normalizeOptionalNonEmptyString(value: string | undefined, label: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return normalizeNonEmptyString(value, label);
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidAdapterRuntimeMetadataError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
