import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

import {
  downloadAndUnzipVSCode,
  resolveCliPathFromVSCodeExecutablePath,
  runTests,
} from '@vscode/test-electron';

async function main(): Promise<void> {
  const extensionDevelopmentPath = process.cwd();
  const extensionTestsPath = path.resolve(
    extensionDevelopmentPath,
    'out',
    'extension-host',
    'suite',
    'extension-host.test.js',
  );
  const vsixPath = path.resolve(extensionDevelopmentPath, 'nexus-0.0.1.vsix');

  if (!existsSync(vsixPath)) {
    throw new Error(`Sprint 28 VSIX package was not found at '${vsixPath}'.`);
  }

  const vscodeExecutablePath = process.env.VSCODE_EXECUTABLE_PATH ?? await downloadAndUnzipVSCode();
  const cliPath = resolveCliPathFromVSCodeExecutablePath(vscodeExecutablePath);
  const extensionsDir = path.resolve(extensionDevelopmentPath, 'out', 'extension-host', 'extensions');
  const userDataDir = path.resolve(extensionDevelopmentPath, 'out', 'extension-host', 'user-data');

  mkdirSync(extensionsDir, { recursive: true });
  mkdirSync(userDataDir, { recursive: true });

  await runCodeCli(cliPath, [
    '--install-extension',
    vsixPath,
    '--force',
    '--extensions-dir',
    extensionsDir,
    '--user-data-dir',
    userDataDir,
  ]);

  await runTests({
    vscodeExecutablePath,
    extensionDevelopmentPath,
    extensionTestsPath,
    launchArgs: [
      extensionDevelopmentPath,
      '--disable-workspace-trust',
      `--extensions-dir=${extensionsDir}`,
      `--user-data-dir=${userDataDir}`,
    ],
  });
}

function runCodeCli(cliPath: string, args: readonly string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.platform === 'win32' ? `"${cliPath}"` : cliPath, args, {
      shell: process.platform === 'win32',
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`VS Code CLI exited with code ${String(code)}.`));
    });
  });
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error(message);
  process.exit(1);
});
