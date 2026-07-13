import { describe, expect, it } from 'vitest';

import {
  HOST_DISCOVER_ADAPTERS_COMMAND,
  HOST_DISPATCH_ADAPTER_REQUEST_COMMAND,
  HOST_SHOW_CAPABILITIES_COMMAND,
  HostCommandRegistration,
} from '../../../src/hosts/vscode/host-command-registration';
import type {
  HostCommandHandler,
  HostCommandRegistry,
  HostDisposable,
  HostInputPrompt,
  HostInputSurface,
  HostPresentationSurface,
  HostProgressOptions,
} from '../../../src/hosts/vscode/host.contract';
import { HostIngressError } from '../../../src/hosts/vscode/host-ingress.errors';
import { HostIngressLayer } from '../../../src/hosts/vscode/host-ingress';
import { StaticHostAdapterOperationalMetadataProvider } from '../../../src/hosts/vscode/host-operational-metadata';
import { AdapterService } from '../../../src/kernel/adapter/adapter.service';
import { InMemoryAdapterRegistry } from '../../../src/kernel/adapter/adapter-registry';
import { ProtocolVersion } from '../../../src/kernel/adapter/protocol-version';

describe('HostCommandRegistration', () => {
  it('registers deterministic Host ingress commands and disposes registrations', async () => {
    const commandRegistry = new RecordingCommandRegistry();
    const presentation = new SilentPresentationSurface();
    const registration = new HostCommandRegistration(
      commandRegistry,
      new HostIngressLayer(
        new AdapterService(new InMemoryAdapterRegistry(), ProtocolVersion.fromString('1.0')),
        new StaticHostAdapterOperationalMetadataProvider({}),
        new SilentPresentationSurface(),
      ),
      new RecordingInputSurface([]),
      presentation,
    );

    expect(commandRegistry.commands).toEqual([
      HOST_DISCOVER_ADAPTERS_COMMAND,
      HOST_DISPATCH_ADAPTER_REQUEST_COMMAND,
      HOST_SHOW_CAPABILITIES_COMMAND,
    ]);
    await expect(commandRegistry.invoke(HOST_SHOW_CAPABILITIES_COMMAND)).resolves.toEqual([
      'Command Registration',
      'Notifications',
      'Diagnostics',
      'User Interface',
    ]);

    registration.dispose();

    expect(commandRegistry.disposeCount).toBe(3);
  });

  it('collects interactive dispatch input when invoked without a pre-built argument', async () => {
    const commandRegistry = new RecordingCommandRegistry();
    const recordingIngress = new RecordingIngressLayer();
    new HostCommandRegistration(
      commandRegistry,
      recordingIngress,
      new RecordingInputSurface([
        'Reviewer',
        'interactive-task',
        'interactive-context',
        'mock-adapter',
        'StaticAnalysis',
      ]),
      new SilentPresentationSurface(),
    );

    await commandRegistry.invoke(HOST_DISPATCH_ADAPTER_REQUEST_COMMAND);

    expect(recordingIngress.dispatchInputs).toEqual([
      {
        request: {
          engineeringRole: 'Reviewer',
          taskId: 'interactive-task',
          contextPackageReference: 'interactive-context',
        },
        adapterId: 'mock-adapter',
        requiredCapability: 'StaticAnalysis',
      },
    ]);
  });

  it('aborts interactive dispatch deterministically when input is cancelled', async () => {
    const commandRegistry = new RecordingCommandRegistry();
    const recordingIngress = new RecordingIngressLayer();
    const presentation = new SilentPresentationSurface();
    new HostCommandRegistration(
      commandRegistry,
      recordingIngress,
      new RecordingInputSurface(['Reviewer', undefined]),
      presentation,
    );

    await expect(commandRegistry.invoke(HOST_DISPATCH_ADAPTER_REQUEST_COMMAND)).rejects.toMatchObject({
      code: 'host-ingress.input-cancelled',
    } satisfies Partial<HostIngressError>);
    expect(recordingIngress.dispatchInputs).toEqual([]);
    expect(presentation.lines).toContain(
      'Host Diagnostic host-ingress.input-cancelled: Adapter dispatch input cancelled while reading Task Identifier.',
    );
  });

  it('preserves programmatic dispatch input without prompting', async () => {
    const commandRegistry = new RecordingCommandRegistry();
    const recordingIngress = new RecordingIngressLayer();
    const inputSurface = new RecordingInputSurface([]);
    new HostCommandRegistration(
      commandRegistry,
      recordingIngress,
      inputSurface,
      new SilentPresentationSurface(),
    );

    await commandRegistry.invoke(HOST_DISPATCH_ADAPTER_REQUEST_COMMAND, {
      adapterId: 'mock-adapter',
      requiredCapability: 'StaticAnalysis',
      request: {
        engineeringRole: 'Reviewer',
        taskId: 'programmatic-task',
        contextPackageReference: 'programmatic-context',
      },
    });

    expect(inputSurface.prompts).toEqual([]);
    expect(recordingIngress.dispatchInputs).toEqual([
      {
        adapterId: 'mock-adapter',
        requiredCapability: 'StaticAnalysis',
        request: {
          engineeringRole: 'Reviewer',
          taskId: 'programmatic-task',
          contextPackageReference: 'programmatic-context',
        },
      },
    ]);
  });
});

class RecordingCommandRegistry implements HostCommandRegistry {
  public readonly commands: string[] = [];
  public disposeCount = 0;
  private readonly handlers = new Map<string, HostCommandHandler>();

  public registerCommand(command: string, handler: HostCommandHandler): HostDisposable {
    this.commands.push(command);
    this.handlers.set(command, handler);

    return {
      dispose: () => {
        this.disposeCount += 1;
      },
    };
  }

  public async invoke(command: string, ...args: readonly unknown[]): Promise<unknown> {
    const handler = this.handlers.get(command);

    if (handler === undefined) {
      throw new Error(`Command '${command}' was not registered.`);
    }

    return handler(...args);
  }
}

class SilentPresentationSurface implements HostPresentationSurface {
  public readonly lines: string[] = [];

  public appendLine(message: string): void {
    this.lines.push(message);
  }

  public async showInformationMessage(): Promise<void> {}

  public async showErrorMessage(): Promise<void> {}

  public async withProgress<T>(_: HostProgressOptions, operation: () => Promise<T>): Promise<T> {
    return operation();
  }
}

class RecordingInputSurface implements HostInputSurface {
  public readonly prompts: HostInputPrompt[] = [];

  public constructor(private readonly values: (string | undefined)[]) {}

  public async showInputBox(prompt: HostInputPrompt): Promise<string | undefined> {
    this.prompts.push(prompt);

    return this.values.shift();
  }
}

class RecordingIngressLayer extends HostIngressLayer {
  public readonly dispatchInputs: unknown[] = [];

  public constructor() {
    super(
      new AdapterService(new InMemoryAdapterRegistry(), ProtocolVersion.fromString('1.0')),
      new StaticHostAdapterOperationalMetadataProvider({}),
      new SilentPresentationSurface(),
    );
  }

  public override async dispatchAdapterRequest(input: Parameters<HostIngressLayer['dispatchAdapterRequest']>[0]): Promise<ReturnType<HostIngressLayer['dispatchAdapterRequest']> extends Promise<infer T> ? T : never> {
    this.dispatchInputs.push(input);

    return {
      adapterId: 'recorded-adapter',
      response: {
        status: 'Completed',
        diagnostics: [],
        producedArtifacts: [],
        findings: [],
        executionMetadata: {},
      },
    };
  }
}
