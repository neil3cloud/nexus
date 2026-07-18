const esbuild = require('esbuild');

async function build() {
  await esbuild.build({
    entryPoints: ['test/extension-host/run-tests.ts'],
    bundle: true,
    outfile: 'out/extension-host/run-tests.js',
    external: ['@vscode/test-electron'],
    format: 'cjs',
    platform: 'node',
    sourcemap: true,
    target: 'node20',
  });

  await esbuild.build({
    entryPoints: ['test/extension-host/suite/extension-host.test.ts'],
    bundle: true,
    outfile: 'out/extension-host/suite/extension-host.test.js',
    external: ['vscode'],
    format: 'cjs',
    platform: 'node',
    sourcemap: true,
    target: 'node20',
  });
}

build().catch(() => process.exit(1));
