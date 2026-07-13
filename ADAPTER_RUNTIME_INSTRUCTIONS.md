# Nexus Adapter Runtime Instructions

This document describes runtime execution guidance for production Adapter implementations. It is provider-neutral and applies to CLI-backed Adapters such as `GeminiCliAdapter` and `CodexCliAdapter`.

## Runtime lifecycle

1. Receive an immutable `AdapterRequest` from the Kernel Adapter Contract.
2. Translate the request into a local `ProcessRequest`.
3. Invoke the configured CLI executable through `LocalProcessRuntimeContract`.
4. Parse the process result into exactly one `AdapterResponse`.
5. Return diagnostics and execution metadata without creating Kernel state, Host state, credentials, or Evidence.

## Request construction

CLI-backed Adapters pass the Kernel request as provider input without independently assembling engineering context. The request payload includes:

- `engineeringRole`
- `taskId`
- `contextPackageReference`
- `executionConstraints`
- `requestMetadata`

CLI-backed Adapters embed this payload in a prompt marker named `NEXUS_ADAPTER_REQUEST_JSON`. The provider is instructed to return a single JSON object and no Markdown, prose, comments, or code fences.

## Command invocation

`GeminiCliAdapter` uses the local `gemini` executable by default and invokes it through the injected `LocalProcessRuntimeContract`.

```text
gemini --prompt "<Nexus Adapter prompt>"
```

`CodexCliAdapter` uses the local `codex` executable by default and invokes Codex CLI's non-interactive execution command through the injected `LocalProcessRuntimeContract`.

```text
codex exec "<Nexus Adapter prompt>"
```

The executable and base arguments may be supplied by runtime composition for deterministic testing or local installation differences. Authentication is external to Nexus: the local Gemini CLI or Codex CLI session must already be authenticated by the developer through the provider CLI's own login flow. Nexus does not store, request, prompt for, or manage credentials, API keys, OAuth flows, or tokens.

## Response contract

The CLI output is parsed as one JSON object with this shape:

```json
{
  "status": "Completed",
  "diagnostics": [
    {
      "code": "provider.completed",
      "message": "Provider completed the request."
    }
  ],
  "producedArtifacts": ["artifact-reference"],
  "findings": [],
  "executionMetadata": {
    "provider": "codex-cli"
  }
}
```

`status` must be `Completed` or `Failed`. `diagnostics`, `producedArtifacts`, and `findings` must be arrays. `executionMetadata` must be a string-valued object. Adapter-owned execution metadata is added to preserve attribution to the Adapter, provider, executable, request, and process result.

## Diagnostics

CLI-backed Adapters preserve process diagnostics from `LocalProcessRuntimeContract` where applicable:

| Runtime condition | Diagnostic source |
| --- | --- |
| Executable not found | `process.executable-not-found` |
| Non-zero exit | `process.non-zero-exit-code` |
| Timeout | `process.timed-out` |
| Runtime startup failure | `process.startup-failed` |
| Runtime exception | Adapter runtime-error diagnostic |
| Malformed provider output | Adapter malformed-output diagnostic |

Adapters do not retry automatically. Timeout configuration is explicit and local to the Adapter request or Adapter construction.

## Manual Production Verification

Manual verification is intentionally separate from automated repository validation. It requires a real local provider CLI installation and a pre-authenticated local CLI session.

### Gemini CLI

1. Confirm executable discovery:

   ```text
   gemini --version
   ```

2. Confirm the local Gemini CLI can execute a minimal request:

   ```text
   gemini --prompt "Return exactly this JSON: {\"status\":\"Completed\",\"diagnostics\":[{\"code\":\"manual.completed\",\"message\":\"Manual verification completed.\"}],\"producedArtifacts\":[\"manual-gemini-cli-verification\"],\"findings\":[],\"executionMetadata\":{\"manualVerification\":\"true\"}}"
   ```

3. Confirm the output is a single parseable JSON object matching the response contract above.
4. Confirm expected failure handling by temporarily configuring an invalid executable path and verifying the Adapter reports `process.executable-not-found`.
5. Confirm timeout handling by using a very small timeout against a long-running local test-double command, not a live provider request.
6. Record the local Gemini CLI version, operating system, command outcome, and observed diagnostics in the Sprint implementation evidence.

### Codex CLI

1. Confirm executable discovery:

   ```text
   codex --version
   ```

2. Confirm the local Codex CLI can execute a minimal request:

   ```text
   codex exec "Return exactly this JSON: {\"status\":\"Completed\",\"diagnostics\":[{\"code\":\"manual.completed\",\"message\":\"Manual verification completed.\"}],\"producedArtifacts\":[\"manual-codex-cli-verification\"],\"findings\":[],\"executionMetadata\":{\"manualVerification\":\"true\"}}"
   ```

   If the local shell wrapper splits quoted prompt arguments, use Codex CLI's documented stdin form instead:

   ```text
   echo "<same prompt>" | codex exec -
   ```

3. Confirm the output is a single parseable JSON object matching the response contract above.
4. Confirm expected failure handling by temporarily configuring an invalid executable path and verifying the Adapter reports `process.executable-not-found`.
5. Confirm timeout handling by using a very small timeout against a long-running local test-double command, not a live provider request.
6. Record the local Codex CLI version, operating system, command outcome, and observed diagnostics in the Sprint implementation evidence.

The manual procedure is not part of `npm run validate` and does not require deterministic provider content across machines.
