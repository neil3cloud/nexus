import type { LocalProcessRuntimeContract } from './local-process-runtime.contract';
import { ProcessRequest } from './process-request';
import { AdapterInstallationStatus } from './adapter-installation-status';

export interface AdapterExecutableDiscoveryInput {
  readonly adapterId: string;
  readonly executable: string;
  readonly versionArguments?: readonly string[];
  readonly supportedVersionPattern?: RegExp;
  readonly timeoutMs?: number;
}

export class AdapterExecutableDiscovery {
  public constructor(private readonly runtime: LocalProcessRuntimeContract) {}

  public async detect(input: AdapterExecutableDiscoveryInput): Promise<AdapterInstallationStatus> {
    const request = ProcessRequest.create({
      executable: input.executable,
      arguments: input.versionArguments ?? ['--version'],
      timeoutMs: input.timeoutMs ?? 1000,
    });
    const result = await this.runtime.execute(request);
    const output = `${result.standardOutput}${result.standardError}`.trim();

    if (result.terminationReason === 'ExecutableNotFound') {
      return AdapterInstallationStatus.create({
        state: 'Missing',
        diagnostics: [
          {
            code: 'adapter-runtime.executable-missing',
            message: `Adapter executable '${input.executable}' was not found.`,
            attribution: input.adapterId,
            attributes: { executable: input.executable },
          },
        ],
      });
    }

    if (!result.exitStatus.succeeded) {
      return AdapterInstallationStatus.create({
        state: 'InvalidInstallation',
        diagnostics: [
          {
            code: 'adapter-runtime.invalid-installation',
            message: `Adapter executable '${input.executable}' did not report version successfully.`,
            attribution: input.adapterId,
            attributes: {
              executable: input.executable,
              terminationReason: result.terminationReason,
            },
          },
        ],
      });
    }

    if (
      input.supportedVersionPattern !== undefined &&
      !input.supportedVersionPattern.test(output)
    ) {
      return AdapterInstallationStatus.create({
        state: 'UnsupportedVersion',
        executablePath: input.executable,
        version: output,
        diagnostics: [
          {
            code: 'adapter-runtime.unsupported-version',
            message: `Adapter executable '${input.executable}' reported unsupported version '${output}'.`,
            attribution: input.adapterId,
            attributes: {
              executable: input.executable,
              version: output,
            },
          },
        ],
      });
    }

    return AdapterInstallationStatus.create({
      state: 'Discovered',
      executablePath: input.executable,
      version: output,
      diagnostics: [
        {
          code: 'adapter-runtime.executable-discovered',
          message: `Adapter executable '${input.executable}' was discovered.`,
          attribution: input.adapterId,
          attributes: {
            executable: input.executable,
            version: output,
          },
        },
      ],
    });
  }
}
