import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const CONFIGURED_COMMAND = 'nexus.runDeveloperMissionWorkflowWithConfiguredAdapter';
const MOCK_COMMAND = 'nexus.runDeveloperMissionWorkflow';
const GEMINI_COMMAND = 'nexus.runDeveloperMissionWorkflowWithGeminiCli';
const CODEX_COMMAND = 'nexus.runDeveloperMissionWorkflowWithCodexCli';
const BUILDER_COMMAND = 'nexus.runBuilderMissionWorkflow';
const REVIEWER_COMMAND = 'nexus.runReviewerMissionWorkflow';
const HISTORY_COMMAND = 'nexus.showMissionWorkflowHistory';

describe('package command metadata', () => {
  it('presents the configured-adapter Developer Workflow as the primary entry point', () => {
    const commands = readCommandContributions();

    expect(commandIds(commands)).toEqual([
      'nexus.initializeWorkspace',
      'nexus.discoverAdapters',
      'nexus.dispatchAdapterRequest',
      'nexus.showHostCapabilities',
      CONFIGURED_COMMAND,
      BUILDER_COMMAND,
      REVIEWER_COMMAND,
      MOCK_COMMAND,
      GEMINI_COMMAND,
      CODEX_COMMAND,
      HISTORY_COMMAND,
    ]);

    expect(command(commands, CONFIGURED_COMMAND)).toEqual({
      command: CONFIGURED_COMMAND,
      title: 'Run Developer Workflow',
      category: 'Nexus',
      shortTitle: 'Run Developer Workflow',
    });
    expect(command(commands, BUILDER_COMMAND)).toEqual({
      command: BUILDER_COMMAND,
      title: 'Run Builder Workflow',
      category: 'Nexus',
      shortTitle: 'Run Builder Workflow',
    });
    expect(command(commands, REVIEWER_COMMAND)).toEqual({
      command: REVIEWER_COMMAND,
      title: 'Run Reviewer Workflow',
      category: 'Nexus',
      shortTitle: 'Run Reviewer Workflow',
    });
  });

  it('presents explicit provider commands as compatibility alternatives', () => {
    const commands = readCommandContributions();

    expect(command(commands, MOCK_COMMAND)).toMatchObject({
      title: 'Run Developer Workflow (Mock Adapter Compatibility)',
      category: 'Nexus',
      shortTitle: 'Run with Mock Adapter',
    });
    expect(command(commands, GEMINI_COMMAND)).toMatchObject({
      title: 'Run Developer Workflow (Gemini CLI Compatibility)',
      category: 'Nexus',
      shortTitle: 'Run with Gemini CLI',
    });
    expect(command(commands, CODEX_COMMAND)).toMatchObject({
      title: 'Run Developer Workflow (Codex CLI Compatibility)',
      category: 'Nexus',
      shortTitle: 'Run with Codex CLI',
    });
  });

  it('declares activation events for role-scoped workflow commands', () => {
    const activationEvents = readActivationEvents();

    expect(activationEvents).toContain(`onCommand:${CONFIGURED_COMMAND}`);
    expect(activationEvents).toContain(`onCommand:${BUILDER_COMMAND}`);
    expect(activationEvents).toContain(`onCommand:${REVIEWER_COMMAND}`);
  });
});

interface PackageManifest {
  readonly activationEvents: readonly string[];
  readonly contributes: {
    readonly commands: readonly CommandContribution[];
  };
}

interface CommandContribution {
  readonly command: string;
  readonly title: string;
  readonly category?: string;
  readonly shortTitle?: string;
}

function readCommandContributions(): readonly CommandContribution[] {
  const packageJson = readFileSync(join(process.cwd(), 'package.json'), 'utf8');
  const manifest = parsePackageManifest(packageJson);

  return manifest.contributes.commands;
}

function readActivationEvents(): readonly string[] {
  const packageJson = readFileSync(join(process.cwd(), 'package.json'), 'utf8');
  const manifest = parsePackageManifest(packageJson);

  return manifest.activationEvents;
}

function parsePackageManifest(source: string): PackageManifest {
  const value: unknown = JSON.parse(source);

  if (!isPackageManifest(value)) {
    throw new Error('package.json does not contain VS Code command contributions.');
  }

  return value;
}

function isPackageManifest(value: unknown): value is PackageManifest {
  if (
    !isRecord(value) ||
    !Array.isArray(value.activationEvents) ||
    !isRecord(value.contributes) ||
    !Array.isArray(value.contributes.commands)
  ) {
    return false;
  }

  return (
    value.activationEvents.every((entry) => typeof entry === 'string') &&
    value.contributes.commands.every(isCommandContribution)
  );
}

function isCommandContribution(value: unknown): value is CommandContribution {
  return (
    isRecord(value) &&
    typeof value.command === 'string' &&
    typeof value.title === 'string' &&
    optionalString(value.category) &&
    optionalString(value.shortTitle)
  );
}

function optionalString(value: unknown): boolean {
  return value === undefined || typeof value === 'string';
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function commandIds(commands: readonly CommandContribution[]): readonly string[] {
  return commands.map((candidate) => candidate.command);
}

function command(
  commands: readonly CommandContribution[],
  commandId: string,
): CommandContribution {
  const found = commands.find((candidate) => candidate.command === commandId);

  if (found === undefined) {
    throw new Error(`Command '${commandId}' was not contributed by package.json.`);
  }

  return found;
}
