export interface VscodeHostContext {
  readonly workspaceRoot?: string;
  readonly activeProjectId?: string;
}

export interface VscodeHostBridge {
  initialize(context: VscodeHostContext): Promise<void>;
}

export interface HostDisposable {
  dispose(): void;
}

export type HostCommandHandler = (...args: readonly unknown[]) => Promise<unknown> | unknown;

export interface HostCommandRegistry {
  registerCommand(command: string, handler: HostCommandHandler): HostDisposable;
}

export interface HostOutputSurface {
  appendLine(message: string): void;
}

export interface HostNotificationSurface {
  showInformationMessage(message: string): Promise<void>;
  showErrorMessage(message: string): Promise<void>;
}

export interface HostProgressOptions {
  readonly title: string;
}

export interface HostPresentationSurface extends HostOutputSurface, HostNotificationSurface {
  withProgress<T>(options: HostProgressOptions, operation: () => Promise<T>): Promise<T>;
}

export interface HostInputPrompt {
  readonly prompt: string;
  readonly value?: string;
}

export interface HostInputSurface {
  showInputBox(prompt: HostInputPrompt): Promise<string | undefined>;
}

export interface HostWorkspaceTrustSurface {
  isWorkspaceTrusted(): boolean;
}

export const hostCapabilityValues = [
  'Command Registration',
  'Notifications',
  'Diagnostics',
  'User Interface',
] as const;

export type HostCapability = (typeof hostCapabilityValues)[number];

export class TrustedHostWorkspaceTrustSurface implements HostWorkspaceTrustSurface {
  public isWorkspaceTrusted(): boolean {
    return true;
  }
}
