export interface VscodeHostContext {
  readonly workspaceRoot?: string;
  readonly activeProjectId?: string;
}

export interface VscodeHostBridge {
  initialize(context: VscodeHostContext): Promise<void>;
}

// TODO: Define VS Code-specific host integration contracts without embedding kernel logic.
