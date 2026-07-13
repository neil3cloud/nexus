# Sprint 31 — Codex CLI Adapter Runtime Integration

## Sprint Status

Approved (NEXUS-REV-2026-07-14-004)

## Sprint Objective

Implement the second production Adapter — `CodexCliAdapter` — conforming to the frozen RFC-0008 Adapter Contract, validating that it correctly interoperates with the existing `LocalProcessRuntime` (Sprint 21) while preserving every previously certified architectural boundary. This Sprint validates the Adapter implementation itself, in isolation, mirroring Sprint 29's `GeminiCliAdapter` pattern exactly. It SHALL NOT introduce Developer Workflow integration. It SHALL NOT modify Host orchestration. It SHALL NOT modify Kernel behavior.

## Milestone

Milestone 6 — Multi-Provider Adapter Integration (opening slice). Milestone 5 certified the Kernel's first production Adapter (`GeminiCliAdapter`) and its Developer Workflow integration. Sprint 31 proves the RFC-0008 Adapter Contract generalizes to a second, independent provider — `CodexCliAdapter` — registered alongside (not replacing) `MockAdapter` and `GeminiCliAdapter`, before any Developer Workflow coupling is authorized.

## RFC Coverage

Primary:

- RFC-0008 — Kernel Adapter Contract (Partial — second production implementation).

Referenced:

- RFC-0004 — Execution Model.
- RFC-0010 — Kernel Boundaries.

## Ratification References

- `NEXUS-RAT-2026-07-14-005` — governs this sprint's entire scope: Milestone 6 direction, provider selection (Codex CLI), authentication model (pre-authenticated local CLI session, inherited from `NEXUS-RAT-2026-07-14-002`), the binding Isolation Boundary and Two-Tier Acceptance Criteria (mirroring `NEXUS-RAT-2026-07-14-003`), authorized Builder scope, and scope restrictions. This record implements that ratification; where any ambiguity arises, the Ratification Ledger entry is authoritative.
- `NEXUS-RAT-2026-07-14-002` — the Gemini CLI provider-selection/authentication-model precedent this ratification mirrors for Codex CLI.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected.

## Critical Boundary (binding — from NEXUS-RAT-2026-07-14-005)

**Sprint 31 SHALL:** implement `CodexCliAdapter` conforming to the existing `Adapter` contract (`metadata`, `execute(request): Promise<AdapterResponse>`); reuse `LocalProcessRuntimeContract` for all process execution; register the Adapter through the existing `createKernelServices` composition mechanism; reconcile `ADAPTER_RUNTIME_INSTRUCTIONS.md` to explicitly cover a second CLI-backed provider.

**Sprint 31 SHALL NOT:** modify `HostMissionWorkflow`, `host-mission-workflow-command-registration.ts`, `vscode-host.ts`, `extension.ts`, or any other Developer Workflow / Host orchestration file; modify any `src/kernel` file; introduce Adapter Selection, provider routing, or authentication/credential management of any kind; introduce a persisted Adapter-selection configuration surface (remains deferred from Sprint 24/30); wire `CodexCliAdapter` as any Host command's dispatch target.

**Architectural Intent (binding):** This sprint introduces exactly one architectural variable:

```text
MockAdapter + GeminiCliAdapter
      ↓
MockAdapter + GeminiCliAdapter + CodexCliAdapter (all three registered in tests;
CodexCliAdapter exercised only via direct AdapterService.dispatch — not wired into any Host command)
```

All other architectural components remain unchanged. Only after a future Sprint's independent certification of this Sprint SHALL Developer Workflow integration of `CodexCliAdapter` be authorized.

## Authentication Model (binding — inherited from NEXUS-RAT-2026-07-14-002 via NEXUS-RAT-2026-07-14-005)

`CodexCliAdapter` SHALL assume a pre-authenticated local `codex` CLI session, identical in structure to the Gemini CLI authentication model. Nexus SHALL NOT store, manage, request, prompt for, or otherwise handle credentials, API keys, tokens, or OAuth flows. The Adapter invokes the already-authenticated local `codex` executable exactly as any other local process through `LocalProcessRuntimeContract` — no authentication-specific code path is authorized.

## Two-Tier Acceptance Criteria (binding — mirroring NEXUS-RAT-2026-07-14-003 via NEXUS-RAT-2026-07-14-005)

### 1. Automated Repository Validation (Mandatory, CI-safe, part of `npm run validate`)

Automated tests SHALL exercise `CodexCliAdapter` using a deterministic local test-double executable — never a live `codex` CLI. The automated suite SHALL validate:

- Adapter request translation (`AdapterRequest` → `ProcessRequest`);
- process invocation through the injected `LocalProcessRuntimeContract`;
- response parsing (`ProcessResult` → `AdapterResponse`);
- diagnostics for executable-not-found, non-zero exit, malformed/unparseable output, timeout, and runtime error;
- timeout handling;
- malformed output handling;
- Adapter Contract conformance (metadata shape, `execute` signature, response invariants).

This suite SHALL NOT depend on network connectivity, external AI services, authenticated user sessions, or nondeterministic model responses, and SHALL remain part of the standard `npm run validate` pipeline.

### 2. Manual Production Verification (Mandatory, documented, NOT part of automated validation)

Sprint 31 SHALL include a documented manual verification procedure (added to `ADAPTER_RUNTIME_INSTRUCTIONS.md`, alongside the existing Gemini CLI procedure) validating `CodexCliAdapter` against a real, locally authenticated Codex CLI installation, confirming:

- executable discovery;
- successful CLI invocation;
- request execution;
- response parsing;
- diagnostics;
- expected failure handling.

This procedure serves as production interoperability evidence. It is documentation, not automation. It SHALL NOT be added to `npm run validate` or any CI-gating script, and its outcome SHALL NOT be required to reproduce identically across all review environments.

## Authorized Vertical Slice

- `CodexCliAdapter implements Adapter` under `src/adapters/codex/`, constructor-injected with `LocalProcessRuntimeContract` (mirroring `GeminiCliAdapter`'s and `MockAdapter`'s placement outside `src/kernel`, per RFC-0010).
- Request/response translation: `AdapterRequest` → `ProcessRequest` (CLI invocation), `ProcessResult` → `AdapterResponse`, preserving `AdapterResponse`'s existing shape (`status`, `diagnostics`, `producedArtifacts`, `findings`, `executionMetadata`) unchanged.
- Deterministic diagnostics reusing Sprint 21's `ProcessDiagnostics` where applicable, for: executable-not-found, non-zero exit, malformed/unparseable CLI output, timeout, runtime error.
- Composition-time registration of `CodexCliAdapter` through the existing `createKernelServices` `adapters` option, exercised in tests only via direct `AdapterService.dispatch` calls with an explicit `adapterId` — never wired into `HostMissionWorkflow` or any Host command.
- `ADAPTER_RUNTIME_INSTRUCTIONS.md` reconciliation: extend the existing provider-neutral runtime execution guidance (already covering `GeminiCliAdapter`) to explicitly document `CodexCliAdapter` as a second conforming CLI-backed provider, including its own Manual Production Verification procedure. SHALL NOT define repository governance, Sprint planning, architectural ownership, Builder authority, Reviewer authority, or implementation policy.
- The automated deterministic-test-double suite (Acceptance Criteria § 1) and the documented manual verification procedure (Acceptance Criteria § 2).

## Explicitly Out of Scope / Deferred Concepts

**Workflow:** Developer Workflow integration; any new Host command targeting `CodexCliAdapter`; any Host orchestration change.

**Configuration:** Persisted Adapter-selection configuration surface (remains deferred from Sprint 24/30, unaffected by this Sprint).

**Providers:** GitHub Copilot CLI Adapter; Claude CLI Adapter; any third production Adapter.

**Selection/Routing:** Adapter Selection Policy, provider routing, provider preference, fallback, multi-adapter execution.

**Security:** Authentication management, credential storage, OAuth, `SecretStorage` integration.

**Runtime:** Streaming responses, multi-provider coordination, background execution, retries beyond Sprint 21's existing timeout/cancellation primitives.

**Unchanged baselines:** `Adapter` contract, `AdapterService`, `AdapterRegistry`, `MockAdapter`, `GeminiCliAdapter`, `LocalProcessRuntime`, `HostMissionWorkflow`, both existing Developer Workflow commands, and every Kernel/Host capability approved through Sprint 30. Existing Sprint 16/17/18/20/25/26/27/28/29/30 tests SHALL continue to pass unmodified.

## Acceptance Criteria

Sprint 31 SHALL demonstrate:

- `CodexCliAdapter` conforms to the `Adapter` contract and dispatches successfully and deterministically through `AdapterService` in isolation, verified against a deterministic local test-double executable (Automated Repository Validation).
- Correct, deterministic diagnostics for executable-not-found, non-zero exit, malformed output, and timeout failure modes (Automated Repository Validation).
- A documented Manual Production Verification procedure exists and, when followed against a real locally authenticated Codex CLI, confirms executable discovery, invocation, execution, response parsing, and diagnostics — evidenced in the Implementation Report, not the automated suite.
- `ADAPTER_RUNTIME_INSTRUCTIONS.md` is updated to cover `CodexCliAdapter`, remains scoped strictly to runtime execution guidance, and does not duplicate or redefine governance artifacts.
- No `src/kernel` file changes; no `HostMissionWorkflow`/Host-orchestration file changes; both existing Developer Workflow commands continue registering `MockAdapter`/`GeminiCliAdapter` respectively, unmodified.
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified.
- Repository-wide automated validation passes: TypeScript compile, ESLint, Vitest (including the new deterministic `CodexCliAdapter` test-double suite), esbuild. The Manual Production Verification procedure is documented but explicitly excluded from this automated gate.

## Builder Responsibilities

- Read, in order: `IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md` § Milestone 6 / Sprint 31, `IMPLEMENTATION_MANIFEST.md` § Milestone 6 / Sprint 31, `knowledge/governance/RATIFICATION_LEDGER.md` § `NEXUS-RAT-2026-07-14-005` and § `NEXUS-RAT-2026-07-14-002` (both authoritative for this sprint's scope), `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`, `knowledge/specifications/rfc-0004-execution-model.md`, `knowledge/specifications/rfc-0010-kernel-boundaries.md`, the Sprint 7, 19, 21, and 29 records, `src/adapters/gemini/gemini-cli-adapter.ts` and `src/adapters/runtime/local-process-runtime.ts` as the structural precedents to mirror, `knowledge/implementation/implementation-technology-standard.md`, `knowledge/implementation/implementation-conventions.md`.
- Implement only the concepts listed under Authorized Vertical Slice above, honoring the Critical Boundary, Authentication Model, and Two-Tier Acceptance Criteria exactly.
- Do not modify `src/hosts/vscode/host-mission-workflow.ts`, `src/hosts/vscode/host-mission-workflow-command-registration.ts`, `src/hosts/vscode/vscode-host.ts`, `src/extension.ts`, or any other Developer Workflow / Host orchestration file.
- Do not add any live-network-dependent step to `npm run validate` or any script it invokes.
- Preserve every Deferred/Out-of-Scope item without approximation.
- Report any additional undocumented concept, terminology gap, or specification conflict rather than guessing; stop and request ratification if one is found.
- Produce the Sprint 31 section of `IMPLEMENTATION_REPORT.md` upon completion, including the Manual Production Verification results/evidence.
- Populate the Builder Results / Test Summary sections of this record upon completion.

## Documentation Requirements

The Builder SHALL update:

- `IMPLEMENTATION_PLAN.md`
- `IMPLEMENTATION_MANIFEST.md`
- `IMPLEMENTATION_REPORT.md`
- This Sprint Implementation Record (Builder Results / Test Summary sections)
- `ADAPTER_RUNTIME_INSTRUCTIONS.md` (extended, not redefined, to cover `CodexCliAdapter`)

The Builder SHALL NOT modify:

- Kernel Canon
- Any RFC
- `REVIEW_HISTORY.md`
- `RATIFICATION_LEDGER.md`

## Known Limitations (anticipated)

- `CodexCliAdapter` is implemented and unit/integration-tested in isolation; it is not reachable from any VS Code command or the Developer Workflow in this sprint.
- Automated CI validation exercises a test-double executable only; genuine Codex CLI behavior is confirmed solely through the separate, documented Manual Production Verification procedure, which is not machine-enforced or repeatable in every environment.
- No retry, streaming, or multi-turn conversation support — a single deterministic request/response cycle per `execute()` call, matching the existing `Adapter` contract shape.
- Authentication remains entirely external to Nexus; if the local Codex CLI is not authenticated, only the Manual Production Verification procedure is affected, not automated validation.

## Expected Outcome

Upon successful completion, Nexus SHALL possess two independently-certified production Adapter implementations while preserving the previously certified architecture:

```text
AdapterService
      ↓
AdapterRegistry (MockAdapter, GeminiCliAdapter, CodexCliAdapter)
      ↓
CodexCliAdapter.execute()
      ↓
LocalProcessRuntime
      ↓
codex CLI (pre-authenticated, local)
      ↓
AdapterResponse
```

This demonstrates that the RFC-0008 Adapter Contract generalizes across independent production providers, and that `CodexCliAdapter` interoperates correctly with existing runtime infrastructure, without introducing any Developer Workflow coupling. Only after successful independent certification of this Sprint SHALL a future Sprint authorize integration of `CodexCliAdapter` into the Developer Workflow.

## Builder Results

Implemented the Sprint 31 Codex CLI Adapter Runtime Integration vertical slice.

- Added `CodexCliAdapter` under `src/adapters/codex/`, outside `src/kernel`, constructor-injected with `LocalProcessRuntimeContract`.
- Implemented RFC-0008 Adapter metadata, declared capabilities, supported roles, immutable request handling, and `execute(request): Promise<AdapterResponse>`.
- Translated `AdapterRequest` into a Codex CLI local process invocation using `codex exec "<Nexus Adapter prompt>"` by default, with executable/base arguments overridable for deterministic tests.
- Parsed successful Codex CLI JSON output into the existing `AdapterResponse` shape without changing Kernel contracts.
- Preserved `LocalProcessRuntimeContract` diagnostics for executable-not-found, non-zero exit, timeout, and process failures; added Codex-specific malformed-output, invalid-timeout, unsupported-role, and runtime-error diagnostics.
- Added deterministic local test-double coverage and direct `AdapterService.dispatch` composition coverage with `MockAdapter`, `GeminiCliAdapter`, and `CodexCliAdapter` registered together.
- Updated `ADAPTER_RUNTIME_INSTRUCTIONS.md` to cover `CodexCliAdapter` as a second CLI-backed provider and document Manual Production Verification.
- Preserved all deferred concepts: no Developer Workflow integration, Host orchestration change, `src/kernel` change, Adapter Selection Policy, routing, persisted configuration, credential handling, OAuth, `SecretStorage`, streaming responses, retries, or multi-provider coordination was introduced.

No architectural deviations.

## Test Summary

- Targeted Sprint 31 Vitest suite passed: `test\adapters\codex\codex-cli-adapter.test.ts` and `test\integration\codex-cli-adapter-runtime.integration.test.ts` — 2 files, 7 tests.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 54 files, 272 tests.
- Sprint 18 Kernel boundary certification passed unmodified as part of the Vitest suite.
- `git diff --stat -- src\kernel src\hosts src\extension.ts package.json` is empty.
- Manual Production Verification evidence: local Codex CLI executable discovery succeeded at `C:\Users\NeilBusa\AppData\Roaming\npm\codex.ps1`; version `codex-cli 0.144.3`.
- Manual live Codex CLI smoke verification succeeded outside the repository (`workdir: C:\Users\NeilBusa\AppData\Local\Temp`) using `codex exec` stdin mode with `--skip-git-repo-check`, `--ignore-rules`, `--ephemeral`, and `--output-last-message`; Codex returned a parseable JSON object matching the Adapter response contract with `status: "Completed"` and diagnostic `manual.completed`.
- Failure-path and timeout diagnostics are covered by deterministic automated tests using the local test-double executable; no live provider failure path is part of `npm run validate`.

## Reviewer Notes

Independently re-verified every claim in Builder Results and Test Summary: `git diff --stat -- src/kernel src/hosts src/extension.ts package.json src/adapters/mock src/adapters/runtime src/adapters/gemini` confirmed empty; `RATIFICATION_LEDGER.md`'s diff confirmed to be exactly the Reviewer/Planner's own `NEXUS-RAT-2026-07-14-005` addition, not a Builder change; a repository-wide grep confirmed `CodexCliAdapter` is referenced nowhere in `src/extension.ts` or `src/hosts/**`. Re-ran the targeted Sprint 31 suite directly (2 files / 7 tests passed) and the full `npm run validate` pipeline independently (TypeScript compile, ESLint, Vitest 54 files / 272 tests, esbuild — all passed, matching the Builder's reported counts exactly), with the Sprint 18 kernel boundary certification test included and passing unmodified. Read `CodexCliAdapter` and the deterministic test-double in full and confirmed structural fidelity to the certified `GeminiCliAdapter` pattern. See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-14-004` for the complete review record.

## Findings

None.

## Required Actions

None. Zero findings; nothing blocks or requires remediation.

## Final Disposition

**Approved** (`NEXUS-REV-2026-07-14-004`). No architectural violations detected. Only after this Sprint's independent certification SHALL a future Sprint authorize Developer Workflow integration of `CodexCliAdapter`, per `NEXUS-RAT-2026-07-14-005`.
