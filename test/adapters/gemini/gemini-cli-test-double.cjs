const promptIndex = process.argv.indexOf('--prompt');
const prompt = promptIndex === -1 ? '' : process.argv[promptIndex + 1] ?? '';
const marker = 'NEXUS_ADAPTER_REQUEST_JSON:';
const markerIndex = prompt.indexOf(marker);

if (markerIndex === -1) {
  process.stderr.write('Missing Nexus Adapter Request payload.');
  process.exit(4);
}

const request = JSON.parse(prompt.slice(markerIndex + marker.length));
const result = request.executionConstraints['geminiCliAdapter.testDoubleResult'] ?? 'Completed';

if (result === 'NonZeroExit') {
  process.stderr.write('Deterministic Gemini CLI test-double failure.');
  process.exit(7);
}

if (result === 'MalformedOutput') {
  process.stdout.write('not-json');
  process.exit(0);
}

if (result === 'Timeout') {
  setInterval(() => undefined, 1000);
  return;
}

process.stdout.write(
  JSON.stringify({
    status: result === 'FailedResponse' ? 'Failed' : 'Completed',
    diagnostics: [
      {
        code: result === 'FailedResponse' ? 'test-double.failed' : 'test-double.completed',
        message:
          result === 'FailedResponse'
            ? 'Deterministic Gemini CLI test-double returned a failure response.'
            : 'Deterministic Gemini CLI test-double completed.',
      },
    ],
    producedArtifacts:
      result === 'FailedResponse'
        ? []
        : [`gemini-test-double:${request.engineeringRole}:${request.taskId}`],
    findings: result === 'FailedResponse' ? ['deterministic finding'] : [],
    executionMetadata: {
      testDouble: 'true',
      contextPackageReference: request.contextPackageReference,
    },
  }),
);
