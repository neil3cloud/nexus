import * as vscode from 'vscode';

import pino, { type Logger } from 'pino';

import { Kernel } from '../../kernel/kernel';
import { createKernelServices } from '../../kernel/common/create-kernel-services';
import type { KernelLogger } from '../../kernel/common/kernel-logger';

class VscodeOutputChannelStream {
  public constructor(private readonly outputChannel: vscode.OutputChannel) {}

  public write(message: string): void {
    this.outputChannel.appendLine(message.trimEnd());
  }
}

class VscodeKernelLogger implements KernelLogger {
  private readonly logger: Logger;

  public constructor(outputChannel: vscode.OutputChannel) {
    this.logger = pino(
      {
        base: {
          component: 'nexus-vscode-host',
        },
      },
      new VscodeOutputChannelStream(outputChannel),
    );
  }

  public info(message: string, fields: Readonly<Record<string, string>> = {}): void {
    this.logger.info(fields, message);
  }

  public error(message: string, fields: Readonly<Record<string, string>> = {}): void {
    this.logger.error(fields, message);
  }
}

export class VscodeHost implements vscode.Disposable {
  private readonly outputChannel: vscode.OutputChannel;
  private readonly kernel: Kernel;
  private readonly logger: KernelLogger;
  private commandRegistration: vscode.Disposable | undefined;

  public constructor(outputChannel: vscode.OutputChannel, kernel: Kernel, logger: KernelLogger) {
    this.outputChannel = outputChannel;
    this.kernel = kernel;
    this.logger = logger;
  }

  public async initialize(): Promise<void> {
    this.commandRegistration = vscode.commands.registerCommand(
      'nexus.initializeWorkspace',
      async () => {
        if (this.kernel.health().initialized) {
          await vscode.window.showInformationMessage('Nexus workspace is already initialized.');
          this.logger.info('Nexus workspace initialization skipped.', {
            reason: 'already_initialized',
          });
          return;
        }

        await vscode.window.showInformationMessage('Nexus workspace initialization started.');
        await this.kernel.initialize();
        await vscode.window.showInformationMessage('Nexus workspace initialized.');
        this.logger.info('Nexus workspace initialized.');
      },
    );

    await this.kernel.initialize();
  }

  public dispose(): void {
    this.commandRegistration?.dispose();
    this.kernel.dispose();
    this.outputChannel.dispose();
  }
}

export function createVscodeHost(): VscodeHost {
  const outputChannel = vscode.window.createOutputChannel('Nexus');
  const logger = new VscodeKernelLogger(outputChannel);
  const kernel = new Kernel(createKernelServices, logger);

  return new VscodeHost(outputChannel, kernel, logger);
}
