import assert from 'node:assert/strict';

import * as vscode from 'vscode';

const EXTENSION_ID = 'nexus.nexus';
const COMMANDS = [
  'nexus.initializeWorkspace',
  'nexus.discoverAdapters',
  'nexus.dispatchAdapterRequest',
  'nexus.showHostCapabilities',
  'nexus.runDeveloperMissionWorkflow',
  'nexus.runDeveloperMissionWorkflowWithGeminiCli',
  'nexus.runDeveloperMissionWorkflowWithCodexCli',
  'nexus.runDeveloperMissionWorkflowWithConfiguredAdapter',
  'nexus.runBuilderMissionWorkflow',
  'nexus.runReviewerMissionWorkflow',
  'nexus.showMissionWorkflowHistory',
] as const;

export async function run(): Promise<void> {
  installUnattendedNotifications();

  const extension = vscode.extensions.getExtension(EXTENSION_ID);
  assert.ok(extension, `Expected installed Nexus extension '${EXTENSION_ID}' to be discoverable.`);

  await withTimeout(extension.activate(), 'Nexus extension activation');
  assert.equal(extension.isActive, true, 'Expected Nexus extension activation to complete.');

  const registeredCommands = await withTimeout(
    vscode.commands.getCommands(true),
    'Nexus command discovery',
  );
  for (const command of COMMANDS) {
    assert.ok(
      registeredCommands.includes(command),
      `Expected Nexus command '${command}' to be registered after activation.`,
    );
  }

  const workflowResult = await withTimeout(
    vscode.commands.executeCommand('nexus.runDeveloperMissionWorkflow', {
      objective: 'Validate Sprint 28 Extension Host Developer Workflow execution.',
      taskTitle: 'Run Sprint 28 Extension Host workflow',
      taskDescription: 'Exercise the provider-independent Developer Workflow through MockAdapter.',
    }),
    'Nexus Developer Workflow command execution',
  );
  assertWorkflowResult(workflowResult);

  const history = await withTimeout(
    vscode.commands.executeCommand('nexus.showMissionWorkflowHistory'),
    'Nexus Mission workflow history command execution',
  );
  assert.ok(Array.isArray(history), 'Expected Mission workflow history command to return an array.');
  assert.equal(history.length, 1, 'Expected exactly one Mission workflow history entry.');
}

function assertWorkflowResult(value: unknown): asserts value is Readonly<Record<string, unknown>> {
  assert.ok(isRecord(value), 'Expected Developer Workflow command to return a result object.');
  assert.equal(value.finalStatus, 'Completed');
  assert.equal(value.taskStatus, 'Completed');
  assert.equal(value.adapterId, 'mock-adapter');
  assert.equal(value.adapterDispatchStatus, 'Completed');
  assert.equal(value.reviewOutcome, 'Accepted');
  assert.equal(value.knowledgeCaptureStatus, 'Candidate');
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function installUnattendedNotifications(): void {
  const testWindow = vscode.window as unknown as {
    showInformationMessage(message: string): Thenable<undefined>;
    showErrorMessage(message: string): Thenable<undefined>;
  };

  testWindow.showInformationMessage = async () => undefined;
  testWindow.showErrorMessage = async () => undefined;
}

async function withTimeout<T>(operation: Thenable<T>, label: string): Promise<T> {
  let timeout: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      reject(new Error(`${label} did not complete within 60000ms.`));
    }, 60000);
  });

  try {
    return await Promise.race([operation, timeoutPromise]);
  } finally {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
  }
}
