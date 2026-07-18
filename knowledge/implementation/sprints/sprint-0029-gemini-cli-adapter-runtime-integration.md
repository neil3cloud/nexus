# Sprint 29 — Gemini CLI Adapter Runtime Integration

## Sprint Status

Approved (NEXUS-REV-2026-07-14-002)

## Sprint Objective

Implement the first production Adapter — `GeminiCliAdapter` — conforming to the frozen RFC-0008 Adapter Contract, validating that it correctly interoperates with the existing `LocalProcessRuntime` (Sprint 21) while preserving every previously certified architectural boundary. This Sprint validates the Adapter implementation itself, in isolation. It SHALL NOT introduce Developer Workflow integration. It SHALL NOT modify Host orchestration. It SHALL NOT modify Kernel behavior.

## Milestone

Milestone 5 — Production Adapter Integration (second slice). Sprint 28 productized Nexus as an installable extension. Sprint 29 introduces exactly one architectural variable — `GeminiCliAdapter` alongside (not replacing) the certified `MockAdapter` — proving RFC-0008's Adapter Contract is executable with a real production provider before any workflow coupling is authorized.

## RFC Coverage

Primary:

- RFC-0008 — Kernel Adapter Contract (Partial — first production implementation).

Referenced:

- RFC-0004 — Execution Model.
- RFC-0010 — Kernel Boundaries.

## Ratification References

- `NEXUS-RAT-2026-07-14-003` — governs this sprint's entire scope: refined objective, Architectural Intent (`MockAdapter` → `GeminiCliAdapter` as the sole variable), Authorized Vertical Slice, the binding two-tier Acceptance Criteria (Automated Repository Validation + Manual Production Verification), authorized Builder scope, and scope restrictions. This record implements that ratification; where any ambiguity arises, the Ratification Ledger entry is authoritative.
- `NEXUS-RAT-2026-07-14-002` — governs provider selection (Gemini CLI), authentication model (pre-authenticated local CLI session; Nexus never handles credentials), and the `ADAPTER_RUNTIME_INSTRUCTIONS.md` canonical naming this sprint creates.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected.

## Critical Boundary (binding — from NEXUS-RAT-2026-07-14-003)

**Sprint 29 SHALL:** implement `GeminiCliAdapter` conforming to the existing `Adapter` contract (`metadata`, `execute(request): Promise<AdapterResponse>`); reuse `LocalProcessRuntimeContract` for all process execution; register the Adapter through the existing `createKernelServices` composition mechanism; create `ADAPTER_RUNTIME_INSTRUCTIONS.md`.

**Sprint 29 SHALL NOT:** modify `HostMissionWorkflow` or any other Developer Workflow file; modify Host orchestration; modify any `src/kernel` file; introduce Adapter Selection, provider routing, or authentication/credential management of any kind; wire `GeminiCliAdapter` as the Developer Workflow's dispatch target (`extension.ts` continues registering `MockAdapter` there, unchanged).

**Architectural Intent (binding):** This sprint introduces exactly one architectural variable:

```text
MockAdapter
      ↓
MockAdapter + GeminiCliAdapter (both registered; GeminiCliAdapter exercised only via direct AdapterService.dispatch in tests)
```

All other architectural components remain unchanged. Only after a future Sprint's independent certification of this Sprint SHALL Developer Workflow integration of `GeminiCliAdapter` be authorized.

## Authentication Model (binding — from NEXUS-RAT-2026-07-14-002)

`GeminiCliAdapter` SHALL assume a pre-authenticated local `gemini` CLI session. Nexus SHALL NOT store, manage, request, prompt for, or otherwise handle credentials, API keys, tokens, or OAuth flows. The Adapter invokes the already-authenticated local `gemini` executable exactly as any other local process through `LocalProcessRuntimeContract` — no authentication-specific code path is authorized.

## Two-Tier Acceptance Criteria (binding — from NEXUS-RAT-2026-07-14-003)

### 1. Automated Repository Validation (Mandatory, CI-safe, part of `npm run validate`)

Automated tests SHALL exercise `GeminiCliAdapter` using a deterministic local test-double executable — never a live `gemini` CLI. The automated suite SHALL validate:

- Adapter request translation (`AdapterRequest` → `ProcessRequest`);
- process invocation through the injected `LocalProcessRuntimeContract`;
- response parsing (`ProcessResult` → `AdapterResponse`);
- diagnostics for executable-not-found, non-zero exit, malformed/unparseable output, timeout, and runtime error;
- timeout handling;
- malformed output handling;
- Adapter Contract conformance (metadata shape, `execute` signature, response invariants).

This suite SHALL NOT depend on network connectivity, external AI services, authenticated user sessions, or nondeterministic model responses, and SHALL remain part of the standard `npm run validate` pipeline.

### 2. Manual Production Verification (Mandatory, documented, NOT part of automated validation)

Sprint 29 SHALL include a documented manual verification procedure (e.g., a section in `ADAPTER_RUNTIME_INSTRUCTIONS.md` or a dedicated `MANUAL_VERIFICATION.md`-style document referenced from the Implementation Report) validating `GeminiCliAdapter` against a real, locally authenticated Gemini CLI installation, confirming:

- executable discovery;
- successful CLI invocation;
- request execution;
- response parsing;
- diagnostics;
- expected failure handling.

This procedure serves as production interoperability evidence. It is documentation, not automation. It SHALL NOT be added to `npm run validate` or any CI-gating script, and its outcome SHALL NOT be required to reproduce identically across all review environments (unlike the automated suite).

## Authorized Vertical Slice

- `GeminiCliAdapter implements Adapter` under `src/adapters/gemini/`, constructor-injected with `LocalProcessRuntimeContract` (mirroring `MockAdapter`'s placement outside `src/kernel`, per RFC-0010).
- Request/response translation: `AdapterRequest` → `ProcessRequest` (CLI invocation), `ProcessResult` → `AdapterResponse`, preserving `AdapterResponse`'s existing shape (`status`, `diagnostics`, `producedArtifacts`, `findings`, `executionMetadata`) unchanged.
- Deterministic diagnostics reusing Sprint 21's `ProcessDiagnostics` where applicable, for: executable-not-found, non-zero exit, malformed/unparseable CLI output, timeout, runtime error.
- Composition-time registration of `GeminiCliAdapter` through the existing `createKernelServices` `adapters` option, exercised in tests only via direct `AdapterService.dispatch` calls with an explicit `adapterId` — never wired into `HostMissionWorkflow`.
- `ADAPTER_RUNTIME_INSTRUCTIONS.md` at the repository root: provider-neutral runtime execution guidance only (adapter execution lifecycle, request construction, command invocation, response parsing, diagnostics, runtime expectations, operational requirements for future production Adapters). SHALL NOT define repository governance, Sprint planning, architectural ownership, Builder authority, Reviewer authority, or implementation policy.
- The automated deterministic-test-double suite (Acceptance Criteria § 1) and the documented manual verification procedure (Acceptance Criteria § 2).

## Explicitly Out of Scope / Deferred Concepts

**Workflow:** Developer Workflow integration; replacing `MockAdapter` within `HostMissionWorkflow`; any Host orchestration change.

**Providers:** GitHub Copilot CLI Adapter; Claude CLI Adapter; Codex CLI Adapter; any second production Adapter.

**Selection/Routing:** Adapter Selection Policy, provider routing, provider preference, fallback, multi-adapter execution.

**Security:** Authentication management, credential storage, OAuth, `SecretStorage` integration.

**Runtime:** Streaming responses, multi-provider coordination, background execution, retries beyond Sprint 21's existing timeout/cancellation primitives.

**Unchanged baselines:** `Adapter` contract, `AdapterService`, `AdapterRegistry`, `MockAdapter`, `LocalProcessRuntime`, `HostMissionWorkflow`, and every Kernel/Host capability approved through Sprint 28. Existing Sprint 16/17/18/20/25/26/27 tests and the Sprint 28 extension-host suite SHALL continue to pass unmodified.

## Acceptance Criteria

Sprint 29 SHALL demonstrate:

- `GeminiCliAdapter` conforms to the `Adapter` contract and dispatches successfully and deterministically through `AdapterService` in isolation, verified against a deterministic local test-double executable (Automated Repository Validation).
- Correct, deterministic diagnostics for executable-not-found, non-zero exit, malformed output, and timeout failure modes (Automated Repository Validation).
- A documented Manual Production Verification procedure exists and, when followed against a real locally authenticated Gemini CLI, confirms executable discovery, invocation, execution, response parsing, and diagnostics — evidenced in the Implementation Report, not the automated suite.
- `ADAPTER_RUNTIME_INSTRUCTIONS.md` exists, is scoped strictly to runtime execution guidance, and does not duplicate or redefine governance artifacts.
- No `src/kernel` file changes; no `HostMissionWorkflow`/Host-orchestration file changes; `extension.ts` continues registering `MockAdapter` as the Developer Workflow's dispatch target, unmodified.
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified.
- Repository-wide automated validation passes: TypeScript compile, ESLint, Vitest (including the new deterministic `GeminiCliAdapter` test-double suite), esbuild. The Manual Production Verification procedure is documented but explicitly excluded from this automated gate.

## Builder Responsibilities

- Read, in order: `IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md` § Milestone 5 / Sprint 29, `IMPLEMENTATION_MANIFEST.md` § Milestone 5 / Sprint 29, `knowledge/governance/RATIFICATION_LEDGER.md` § `NEXUS-RAT-2026-07-14-003` and § `NEXUS-RAT-2026-07-14-002` (both authoritative for this sprint's scope), `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`, `knowledge/specifications/rfc-0004-execution-model.md`, `knowledge/specifications/rfc-0010-kernel-boundaries.md`, the Sprint 7, 19, and 21 records, `src/adapters/mock/mock-adapter.ts` and `src/adapters/runtime/local-process-runtime.ts` as the structural precedents to mirror, `knowledge/implementation/implementation-technology-standard.md`, `knowledge/implementation/implementation-conventions.md`.
- Implement only the concepts listed under Authorized Vertical Slice above, honoring the Critical Boundary, Authentication Model, and Two-Tier Acceptance Criteria exactly.
- Do not modify `src/hosts/vscode/host-mission-workflow.ts`, `src/hosts/vscode/vscode-host.ts`, `src/extension.ts`, or any other Developer Workflow / Host orchestration file.
- Do not add any live-network-dependent step to `npm run validate` or any script it invokes.
- Preserve every Deferred/Out-of-Scope item without approximation.
- Report any additional undocumented concept, terminology gap, or specification conflict rather than guessing; stop and request ratification if one is found.
- Produce the Sprint 29 section of `IMPLEMENTATION_REPORT.md` upon completion, including the Manual Production Verification results/evidence.
- Populate the Builder Results / Test Summary sections of this record upon completion.

## Documentation Requirements

The Builder SHALL update:

- `IMPLEMENTATION_PLAN.md`
- `IMPLEMENTATION_MANIFEST.md`
- `IMPLEMENTATION_REPORT.md`
- This Sprint Implementation Record (Builder Results / Test Summary sections)
- `ADAPTER_RUNTIME_INSTRUCTIONS.md` (new document, created by this sprint)

The Builder SHALL NOT modify:

- Kernel Canon
- Any RFC
- `REVIEW_HISTORY.md`
- `RATIFICATION_LEDGER.md`

## Known Limitations (anticipated)

- `GeminiCliAdapter` is implemented and unit/integration-tested in isolation; it is not reachable from any VS Code command or the Developer Workflow in this sprint.
- Automated CI validation exercises a test-double executable only; genuine Gemini CLI behavior is confirmed solely through the separate, documented Manual Production Verification procedure, which is not machine-enforced or repeatable in every environment.
- No retry, streaming, or multi-turn conversation support — a single deterministic request/response cycle per `execute()` call, matching the existing `Adapter` contract shape.
- Authentication remains entirely external to Nexus; if the local Gemini CLI is not authenticated, only the Manual Production Verification procedure is affected, not automated validation.

## Expected Outcome

Upon successful completion, Nexus SHALL possess its first certified production Adapter implementation while preserving the previously certified architecture:

```text
AdapterService
      ↓
AdapterRegistry (MockAdapter, GeminiCliAdapter)
      ↓
GeminiCliAdapter.execute()
      ↓
LocalProcessRuntime
      ↓
gemini CLI (pre-authenticated, local)
      ↓
AdapterResponse
```

This demonstrates that the RFC-0008 Adapter Contract is executable with a real production provider, and that the Adapter interoperates correctly with existing runtime infrastructure, without introducing any Developer Workflow coupling. Only after successful independent certification of this Sprint SHALL a future Sprint authorize integration of `GeminiCliAdapter` into the Developer Workflow.

## Builder Results

Implemented the Sprint 29 Gemini CLI Adapter Runtime Integration slice:

- Added `GeminiCliAdapter` under `src/adapters/gemini/`, implementing the existing RFC-0008 `Adapter` contract without modifying `src/kernel`, Host orchestration, Developer Workflow files, or `extension.ts`.
- Translated `AdapterRequest` into a local `ProcessRequest` invoked through constructor-injected `LocalProcessRuntimeContract`, preserving the pre-authenticated local Gemini CLI authentication model and introducing no credential handling.
- Parsed Gemini CLI JSON output into the existing `AdapterResponse` shape, preserving `status`, `diagnostics`, `producedArtifacts`, `findings`, and `executionMetadata`.
- Added deterministic diagnostics for executable-not-found, non-zero exit, malformed output, timeout, invalid timeout constraints, unsupported roles, and runtime exceptions.
- Registered `GeminiCliAdapter` only through the existing `createKernelServices` `adapters` composition option in tests, alongside `MockAdapter`, and exercised dispatch only by explicit `AdapterService.dispatch({ adapterId })`.
- Created `ADAPTER_RUNTIME_INSTRUCTIONS.md` as provider-neutral runtime execution guidance with a documented Manual Production Verification procedure.
- Preserved all deferred scope: no Developer Workflow integration, no Host orchestration changes, no Kernel changes, no Adapter Selection, no provider routing, no credential management, no streaming, and no multi-provider coordination.

## Test Summary

- Targeted Sprint 29 Vitest suite passed: `test/adapters/gemini/gemini-cli-adapter.test.ts` and `test/integration/gemini-cli-adapter-runtime.integration.test.ts` — 2 files, 7 tests.
- Repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild through `npm run validate`.
- Vitest passed: 50 files, 262 tests, with the Extension Host suite remaining excluded from Vitest as before.
- Sprint 18 Kernel boundary certification passed unmodified as part of the Vitest suite.
- Manual Production Verification was executed separately from automation with local Gemini CLI discovery successful (`gemini` found at `C:\Users\NeilBusa\AppData\Roaming\npm\gemini.ps1`, version `0.50.0`). Live request execution did not complete because the installed Gemini CLI returned `IneligibleTierError` / `UNSUPPORTED_CLIENT` for the local Gemini Code Assist account tier; rerun with `--skip-trust` confirmed the remaining blocker is provider-side eligibility rather than Nexus automation. The procedure is documented in `ADAPTER_RUNTIME_INSTRUCTIONS.md`, and the observed result is recorded in `IMPLEMENTATION_REPORT.md`.

## Reviewer Notes

Independently re-verified every claim in Builder Results and Test Summary: `git status`/`git diff --stat` confirmed zero `src/kernel` changes; a repository-wide grep confirmed `GeminiCliAdapter` is referenced nowhere in `src/extension.ts` or `src/hosts/**`; the targeted Sprint 29 suite was re-run directly (2 files / 7 tests passed); the full `npm run validate` pipeline was re-run independently (TypeScript compile, ESLint, Vitest 50 files / 262 tests, esbuild — all passed, matching the Builder's reported counts exactly), with the Sprint 18 kernel boundary certification test included and passing unmodified. `ADAPTER_RUNTIME_INSTRUCTIONS.md` and the deterministic test-double executable were read in full and confirmed to satisfy the binding Two-Tier Acceptance Criteria from `NEXUS-RAT-2026-07-14-003`. See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-14-002` for the complete review record.

## Findings

None.

## Required Actions

None. Zero findings; nothing blocks or requires remediation.

## Final Disposition

**Approved** (`NEXUS-REV-2026-07-14-002`). No architectural violations detected. Only after this Sprint's independent certification SHALL a future Sprint authorize Developer Workflow integration of `GeminiCliAdapter`, per `NEXUS-RAT-2026-07-14-003`.
