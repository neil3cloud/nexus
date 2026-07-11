import * as vscode from 'vscode';

import { createVscodeHost } from './hosts/vscode/vscode-host';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const host = createVscodeHost();

  context.subscriptions.push(host);

  await host.initialize();
}
