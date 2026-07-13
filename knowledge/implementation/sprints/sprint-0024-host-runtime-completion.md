# Sprint 24 — Host Runtime Completion

## Sprint Status

Approved (NEXUS-REV-2026-07-13-025)

## Sprint Objective

Complete the provider-independent Host runtime defined by RFC-0009 by closing three gaps identified by repository-state assessment during `/nexus-plan` (2026-07-13), all found in the already-approved Sprint 23 Host Ingress Foundation code:

1. **Interactive request input** — `nexus.dispatchAdapterRequest` currently always falls back to a hardcoded `defaultAdapterRequest` when invoked without a pre-built object argument (exactly how a human triggers it from the Command Palette). No interactive input surface exists (`grep -rn "showInputBox\|showQuickPick\|QuickInput" src/` returns nothing).
2. **Incomplete response presentation** — `AdapterResponseSnapshot.producedArtifacts` and `.findings` are silently discarded by `HostIngressLayer.dispatchAdapterRequest`'s presentation code; only `status` and `diagnostics` are shown.
3. **No Workspace Trust enforcement** — RFC-0009 § Security Responsibilities assigns workspace trust enforcement to the Host before platform actions occur. `grep -rn "isTrusted\|workspaceTrust" src/` returns nothing. This is inert today because `MockAdapter` never touches the OS, but becomes live the moment a real Adapter invokes `LocalProcessRuntime`.

These three capabilities are treated as a single architectural concern: completing the Host runtime so that the first live Adapter (a future sprint) changes exactly one architectural variable — replacing the `MockAdapter` registration with a production Adapter implementation — with no further Host-layer work required at that time.

This sprint SHALL NOT introduce: provider protocol logic, Adapter behavior changes, authentication, provider selection, or live provider execution.

## Milestone

Milestone 4 — External Integration (sixth slice). Sprint 19 certified the Adapter runtime; Sprint 20 certified the execution pipeline; Sprint 21 certified process-execution infrastructure; Sprint 22 made Adapter operational state discoverable; Sprint 23 connected the Host to the Kernel/Adapter path; Sprint 24 completes the Host runtime itself so that it is production-ready and safe, still without any live provider.

## RFC Coverage

Primary:

- RFC-0009 — Host Contract (Partial) — extends User Interaction, Security Responsibilities, and Explainability sections.

Referenced:

- RFC-0008 — Kernel Adapter Contract (`AdapterResponse` fields consumed as already defined; not modified)
- RFC-0004 — Execution Model
- RFC-0010 — Kernel Boundaries

This sprint implements Host-layer capability only. No Adapter, Kernel, or Runtime behavior is modified.

## Ratification References

- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md` remains deferred; this sprint is provider-independent and is explicitly not the production-provider-integration sprint that ratification names as the activation trigger.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected. Interactive input MAY let a user supply an explicit `adapterId` or `requiredCapability`, but SHALL NOT introduce any automatic selection, ranking, or preference logic — the existing explicit-id-or-fails-closed-single-match dispatch mechanism (Sprint 23) is unchanged.

Sprint 24's scope was approved directly by Sprint Owner decision during `/nexus-plan` (2026-07-13), following a repository-state assessment the Sprint Owner explicitly requested in place of naming a live provider. No new governance ambiguity required a new Ratification.

## Sprint Owner Directive (binding)

Sprint 24 SHALL establish a production-ready Host runtime capable of safely exercising any certified Adapter while remaining completely provider-independent. These three capabilities SHALL be treated as a single architectural concern, not independent features:

- Interactive request input.
- Structured response presentation (findings, produced artifacts, diagnostics, and progress).
- Workspace Trust enforcement.

These capabilities SHALL remain Host responsibilities. They SHALL NOT introduce provider protocol logic, Adapter behavior, authentication, provider selection, or live provider execution.

The objective of Sprint 24 is to complete the Host runtime so that the first live Adapter introduced in a subsequent sprint changes exactly one architectural variable: replacing the Mock Adapter with a production Adapter implementation.

## Architectural Responsibilities

**Host owns (this sprint, additive):** interactive input collection, structured output/notification presentation of the full `AdapterResponseSnapshot` surface, Workspace Trust gating of dispatch.

**Kernel owns (unchanged):** execution orchestration, Adapter dispatch, engineering rules, domain behavior.

**Adapter owns (unchanged, RFC-0008):** protocol translation, runtime interaction, execution semantics, and the meaning of `producedArtifacts`/`findings` content (the Host presents them verbatim; it does not interpret them).

**`LocalProcessRuntime` owns (unchanged, Sprint 21):** operating-system process execution.

No aggregate, repository, `AdapterRegistry`, `AdapterLifecycle`, `AdapterMetadata`, `AdapterResponse`/`AdapterRequest` shape, `MockAdapter`, or Execution Strategy/Role Assignment is modified.

## Authorized Vertical Slice

### 1. Interactive Request Input

- Introduce a Host input abstraction (e.g. `HostInputSurface`) analogous to the existing `HostPresentationSurface`/`HostCommandRegistry` abstractions, backed by VS Code `window.showInputBox`/`window.showQuickPick` in the real implementation and by a deterministic fake in tests (mirroring Sprint 21's dependency-injected process-factory pattern).
- When `nexus.dispatchAdapterRequest` is invoked without a pre-built request argument (the interactive path — i.e., from the Command Palette), prompt for `engineeringRole`, `taskId`, `contextPackageReference`, and optionally `adapterId`/`requiredCapability`, then dispatch using the existing `HostIngressLayer.dispatchAdapterRequest` unchanged.
- When invoked with a pre-built argument (the existing programmatic path — e.g. from tests or future automation), behavior SHALL remain exactly as Sprint 23 left it: no prompting.
- User cancellation of any prompt SHALL abort the dispatch deterministically with a Host diagnostic; it SHALL NOT fall back to the old hardcoded default.

### 2. Structured Response Presentation

- Extend `HostIngressLayer.dispatchAdapterRequest`'s presentation to additionally surface `producedArtifacts`, `findings`, and `executionMetadata` from `AdapterResponseSnapshot`, alongside the existing `status`/`diagnostics` output.
- Add a deterministic "progress" marker: an Output Channel line (and, where appropriate, a `vscode.window.withProgress` or equivalent indicator behind the `HostPresentationSurface` abstraction) at dispatch start and completion, so a long-running Adapter call is observably in progress rather than silent.
- Presentation SHALL remain provider-independent: it presents whatever the `AdapterResponseSnapshot` contains verbatim, with no provider-specific formatting, interpretation, or filtering.

### 3. Workspace Trust Enforcement

- Introduce a Host workspace-trust abstraction (e.g. `HostWorkspaceTrustSurface`) wrapping `vscode.workspace.isTrusted` in the real implementation, injectable/fakeable in tests.
- `HostIngressLayer.dispatchAdapterRequest` (and any future Host operation that could trigger external process execution) SHALL check workspace trust before calling `AdapterService.dispatch`, and SHALL refuse deterministically with a Host diagnostic (e.g. `host-ingress.workspace-not-trusted`) and no dispatch attempt when the workspace is untrusted.
- `nexus.discoverAdapters` and `nexus.showHostCapabilities` (read-only, no process execution) are NOT gated by Workspace Trust.

Only the existing certified `MockAdapter` (Sprint 19) and the Sprint 21 runtime-validation test Adapter may be exercised through these capabilities. No other Adapter implementation may be introduced this sprint.

## Explicitly Out of Scope / Deferred Concepts

- **Live Provider Integration:** GitHub Copilot CLI, Claude CLI, Gemini CLI, Codex CLI, OpenAI, Azure OpenAI — provider selection remains explicitly deferred per Sprint Owner direction.
- **Provider Runtime:** authentication, login, credential management, provider configuration, provider protocol translation, prompt execution, response parsing, streaming.
- **Adapter Selection Policy:** routing, capability scoring, provider preference, fallback, priority ordering, load balancing (`NEXUS-RAT-2026-07-13-011`, unaffected). Letting a user type an explicit `adapterId` into an input prompt is not selection policy — it is the same explicit-id mechanism Sprint 23 already authorized, now reachable interactively.
- **VS Code Configuration surface** (`package.json` `contributes.configuration`) for persisted Adapter settings — out of scope; input remains per-invocation/interactive this sprint.
- **Workflow UI:** Mission UI, Review UI, Knowledge UI, workflow visualization.
- **Broader Host Ingress Contract:** `submitMission`, `publishHostObservation`, `submitApproval`, `queryWorkflowStatus`.
- **`COPILOT_INSTRUCTIONS.md`:** SHALL NOT be activated or consumed this sprint.
- **Kernel/Adapter/Runtime changes:** any modification to `AdapterLifecycle`, `AdapterRegistry`, `AdapterMetadata`, `AdapterRequest`/`AdapterResponse` shape, `MockAdapter`, `LocalProcessRuntime`, Execution Strategy, or Role Assignment.

## Acceptance Criteria

Sprint 24 SHALL demonstrate:

- A user invoking `nexus.dispatchAdapterRequest` from the Command Palette (no pre-built argument) is interactively prompted for request fields; cancellation aborts deterministically without dispatching.
- Programmatic invocation with a pre-built argument continues to behave exactly as Sprint 23 (no prompting), with existing Sprint 23 tests unmodified and passing.
- Dispatch presentation surfaces `status`, `diagnostics`, `producedArtifacts`, `findings`, `executionMetadata`, and a start/completion progress indicator.
- Dispatch is refused deterministically with a Host diagnostic when the workspace is untrusted, before any Adapter/process interaction occurs; discovery and capability commands remain ungated.
- No `src/kernel`, `src/adapters/mock/`, or `src/adapters/runtime/` file changes (`git diff --stat HEAD -- src/kernel/ src/adapters/mock/ src/adapters/runtime/` empty).
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified.
- No live provider execution; no new Kernel concept; no architectural ownership change.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.
- Comprehensive unit test coverage using dependency-injected fakes for input and workspace-trust surfaces, mirroring the existing `HostPresentationSurface` test pattern; no test requires real user interaction or a real VS Code window.

## Builder Responsibilities

- Read, in order: `IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md` § Milestone 4 / Sprint 24, `IMPLEMENTATION_MANIFEST.md` § Milestone 4 / Sprint 24, `knowledge/specifications/rfc-0009-host-contract.md`, `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`, `knowledge/specifications/rfc-0010-kernel-boundaries.md`, the Sprint 21 and Sprint 23 records, `src/hosts/vscode/host.contract.ts`, `src/hosts/vscode/host-ingress.ts`, `src/hosts/vscode/host-command-registration.ts`, and `src/hosts/vscode/vscode-host.ts` as the current baseline, `knowledge/implementation/implementation-technology-standard.md`, `knowledge/implementation/implementation-conventions.md`.
- Implement only the concepts listed under Authorized Vertical Slice above.
- Preserve every Deferred/Out-of-Scope item without approximation — especially: no live provider, no Adapter Selection Policy, no persisted Configuration surface, no `COPILOT_INSTRUCTIONS.md`.
- Preserve Sprint 23's existing programmatic dispatch path and its existing tests unmodified in behavior.
- Report any additional undocumented concept, terminology gap, or specification conflict rather than guessing; stop and request ratification if one is found.
- Produce the Sprint 24 section of `IMPLEMENTATION_REPORT.md` upon completion.
- Populate the Builder Results / Test Summary sections of this record upon completion.

## Documentation Requirements

The Builder SHALL update:

- `IMPLEMENTATION_PLAN.md`
- `IMPLEMENTATION_MANIFEST.md`
- `IMPLEMENTATION_REPORT.md`
- This Sprint Implementation Record (Builder Results / Test Summary sections)

The Builder SHALL NOT modify:

- Kernel Canon
- Any RFC
- `REVIEW_HISTORY.md`
- `RATIFICATION_LEDGER.md`

## Known Limitations (anticipated)

- Only two pre-certified, non-production Adapters can be exercised through the completed Host runtime; no production provider Adapter exists yet.
- Input remains per-invocation (no persisted VS Code Configuration surface); a user must re-enter request fields each time until a future Configuration sprint, if one is authorized.
- Workspace Trust enforcement covers dispatch only this sprint; any future Host operation that triggers process execution must independently apply the same gate.

## Expected Outcome

Upon successful completion, a user inside the VS Code extension will be able to interactively request Adapter work with real input, see the complete response (including any produced artifacts and findings), and be protected by Workspace Trust before any external process runs — all using only pre-certified, provider-independent Adapters. The next Milestone 4 sprint that introduces a live provider Adapter will need to change exactly one thing: the Adapter implementation registered at the Host's composition root.

## Builder Results

Implemented Sprint 24 Host Runtime Completion as an RFC-0009 Host-layer vertical slice.

Implemented scope:

- Added injectable `HostInputSurface` and VS Code-backed input prompts for command-palette Adapter dispatch.
- Added interactive input for `engineeringRole`, `taskId`, `contextPackageReference`, optional `adapterId`, and optional `requiredCapability` when `nexus.dispatchAdapterRequest` is invoked without a pre-built argument.
- Added deterministic `host-ingress.input-cancelled` diagnostics so cancellation aborts without dispatching.
- Preserved Sprint 23's programmatic dispatch path for pre-built command arguments.
- Extended `HostPresentationSurface` with progress support and wired the VS Code implementation to `window.withProgress`.
- Extended dispatch presentation to include `status`, `diagnostics`, `producedArtifacts`, `findings`, sorted `executionMetadata`, and deterministic start/completion progress markers.
- Added injectable `HostWorkspaceTrustSurface` and VS Code-backed `workspace.isTrusted` enforcement before dispatch. Discovery and capability commands remain ungated.

Preserved deferred scope:

- No live provider integration, authentication, provider protocol translation, Adapter Selection Policy, persisted VS Code configuration, workflow UI, broader Host ingress, or `COPILOT_INSTRUCTIONS.md` was introduced.
- `src/kernel`, `src/adapters/mock`, `src/adapters/runtime`, `AdapterRequest`/`AdapterResponse` shape, `AdapterLifecycle`, `AdapterRegistry`, `AdapterMetadata`, `MockAdapter`, `LocalProcessRuntime`, Execution Strategy, Role Assignment, Kernel Canon, and RFCs were not modified.

## Test Summary

Validation passed:

- Targeted Sprint 24 validation passed: 3 files, 10 tests.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 45 files, 246 tests.
- `git diff --stat -- src/kernel src/adapters/mock src/adapters/runtime` is empty.

## Reviewer Notes

**Status**

PASS

## Review Summary

See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-13-025` for the complete review record.

`git diff --stat HEAD -- src/kernel/ src/adapters/mock/ src/adapters/runtime/` confirmed zero changes to the Kernel or any existing Adapter/runtime implementation. Interactive input correctly branches on argument presence, preserving the Sprint 23 programmatic path exactly (verified by a dedicated zero-prompts test) while adding deterministic, cancellation-safe prompting for the Command Palette path. Response presentation now surfaces the full `AdapterResponseSnapshot` (`producedArtifacts`, `findings`, `executionMetadata`) plus progress markers. Workspace Trust enforcement is proven to gate strictly before Adapter execution (`dispatchCount === 0` when untrusted) and is genuinely wired in the real composition root (`vscode-host.ts` passes the real `VscodeWorkspaceTrustSurface`, not the permissive default). `grep` confirmed zero provider-specific vocabulary anywhere in the new code. Independent re-validation confirmed `npm run validate` passes cleanly: TypeScript compile, ESLint, Vitest 45 files / 246 tests, esbuild build — matching the Builder's reported figures exactly.

## Findings

One Informational, Category 6 (Observation) finding: `HostIngressLayer`'s constructor defaults `workspaceTrust` to a permissive "always trusted" surface when omitted. Inert today since the real composition root wires the genuine surface, but this repository has a direct precedent (`NEXUS-REV-2026-07-12-008-F-006`) for flagging this exact silent-default pattern. See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-13-025-F-001`.

## Required Actions

None required. Recommend removing the default `workspaceTrust` parameter (making it required) in a future slice; non-blocking.

## Final Disposition

**Approved.** No architectural violations detected. The Sprint Owner Directive (all three capabilities as a single architectural concern, Host-only, provider-independent) is honored precisely. All declared Deferred Concepts remain correctly unimplemented. The Host runtime is now complete: the next live-Adapter sprint changes exactly one variable, as intended.

Date: 2026-07-13

Reviewer: Reviewer AI (Claude Code)

Review Reference: `NEXUS-REV-2026-07-13-025`
