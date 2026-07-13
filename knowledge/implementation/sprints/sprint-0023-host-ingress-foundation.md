# Sprint 23 — Host Ingress Foundation

## Sprint Status

Approved with Findings (NEXUS-REV-2026-07-13-023)

## Sprint Objective

Implement the Host Ingress Layer defined by RFC-0009, establishing the first production entry point from the VS Code extension into the certified Nexus Kernel. The Host SHALL expose deterministic command surfaces that invoke only public Kernel service contracts. This sprint validates the complete Host → Kernel → Adapter execution path using only previously certified runtime capabilities (`MockAdapter`, Sprint 21's runtime validation Adapter). No live AI provider execution is authorized.

This sprint directly closes the gap identified during `/nexus-plan`: the VS Code Host currently wires only Kernel initialization (`nexus.initializeWorkspace`) and exposes no pathway from the extension into `AdapterService` — no command discovers Adapters, dispatches a request, or surfaces Sprint 22's installation/health diagnostics. A live provider Adapter has nowhere to be exercised from inside the extension until this gap is closed, independent of which provider is eventually integrated.

## Milestone

Milestone 4 — External Integration (fifth slice). Sprint 19 certified the Adapter runtime; Sprint 20 certified the execution pipeline; Sprint 21 certified process-execution infrastructure beneath the Adapter layer; Sprint 22 made a concrete Adapter's operational state discoverable; Sprint 23 connects all of it to the VS Code Host, still without any live provider.

## RFC Coverage

Primary:

- RFC-0009 — Host Contract (Partial)

Referenced:

- RFC-0008 — Kernel Adapter Contract
- RFC-0004 — Execution Model
- RFC-0010 — Kernel Boundaries

This sprint implements Host ingress only. No Adapter behavior is modified. No Kernel orchestration semantics are modified. No provider integration is introduced.

## Ratification References

- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md` remains deferred; it becomes active only when the first live provider is integrated and exercised from within the completed Host runtime — not this sprint. The current GitHub Copilot Chat Builder workflow remains the authoritative implementation environment. This sprint SHALL NOT introduce or consume `COPILOT_INSTRUCTIONS.md`.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected. Host dispatch SHALL preserve this guardrail exactly as Sprint 20 did: explicit `adapterId` or a fails-closed deterministic single-match lookup only.

Sprint 23's scope was approved directly by Sprint Owner decision during `/nexus-plan` (2026-07-13), refining the planner's proposal into the record below. No new governance ambiguity required a new Sprint Owner Ratification — both binding guardrails above are pre-existing repository law, reapplied at the Host boundary.

## Architectural Context

Current certified architecture:

```text
VS Code
        ↓
Host
        ↓
Kernel
```

Sprint 23 extends the execution path:

```text
User
        ↓
VS Code Command
        ↓
Host Ingress Layer
        ↓
Kernel Public Services
        ↓
AdapterService
        ↓
Adapter Registry
        ↓
Adapter
        ↓
LocalProcessRuntime
```

The Host remains an infrastructure concern. The Kernel remains the owner of all engineering behavior.

## Sprint Owner Directives (binding)

### Host Boundary

The VS Code Host SHALL invoke only public Kernel service contracts. The Host SHALL NOT:

- instantiate aggregates;
- access repositories directly;
- manipulate `AdapterRegistry` directly;
- invoke `LocalProcessRuntime` directly;
- invoke Adapter implementations directly;
- bypass `AdapterService`.

All Host interactions SHALL traverse public Kernel service contracts. This preserves the RFC-0010 dependency direction.

### Adapter Dispatch

Host dispatch SHALL preserve `NEXUS-RAT-2026-07-13-011`. The Host SHALL dispatch only through:

- explicit `adapterId`; or
- deterministic single-match lookup.

The Host SHALL NOT implement Adapter Selection Policy, routing algorithms, provider preference, capability scoring, fallback execution, priority ordering, or load balancing. Adapter Selection remains explicitly deferred.

### Provider Independence

Sprint 23 SHALL remain completely provider-independent. The Host SHALL NOT know GitHub Copilot, Claude, Gemini, Codex, or OpenAI. The Host communicates only with the Adapter abstraction.

## Architectural Responsibilities

**Host owns:** command registration, command routing, capability declaration, UI notifications, output presentation, Host diagnostics.

**Kernel owns (unchanged):** execution orchestration, Adapter dispatch, engineering rules, domain behavior.

**Adapter owns (unchanged, RFC-0008):** protocol translation, runtime interaction, execution semantics.

**`LocalProcessRuntime` owns (unchanged, Sprint 21):** operating-system process execution.

Each architectural layer owns exactly one responsibility. The Host adds no new owner of engineering behavior.

## Authorized Vertical Slice

Implement:

- Host command registration.
- Host ingress routing (a Host-layer coordination component receiving Host commands and invoking Kernel public services only).
- Host capability declaration per RFC-0009 § Host Capabilities (Command Registration at minimum).
- Adapter discovery through `AdapterService.enumerateAdapters`.
- Deterministic Adapter dispatch through `AdapterService.dispatch`, using explicit `adapterId` or a fails-closed single-match lookup only.
- Presentation of Sprint 22's Adapter operational metadata (`AdapterInstallationStatus`, `AdapterHealthStatus`, `AdapterRuntimeDiagnostics`) via VS Code Output Channel / notifications.
- Host diagnostics for ingress-layer failures (e.g., no Adapter found, dispatch failure), reusing existing Kernel/Adapter error types where possible.

Only the existing certified `MockAdapter` (Sprint 19) and the Sprint 21 runtime-validation test Adapter may be exercised. No other Adapter implementation may be introduced this sprint.

## Task Breakdown

### TASK-001 — Host Command Registration

Implement VS Code command registration for the new ingress commands. Commands SHALL invoke only Host services (never Kernel internals directly).

Acceptance Criteria: deterministic command registration; unit tested.

### TASK-002 — Host Ingress Layer

Implement the Host Ingress Layer. Responsibilities: receive Host commands, invoke Kernel public services, return deterministic results.

Acceptance Criteria: Host remains infrastructure only; dependency injection used for the Kernel service contracts consumed; unit tested.

### TASK-003 — Adapter Discovery

Expose Adapter discovery through `AdapterService`. Display registered adapters, installation status, runtime health, and runtime diagnostics.

Acceptance Criteria: `AdapterService` remains authoritative for what is registered; unit tested.

### TASK-004 — Adapter Dispatch

Implement deterministic Adapter dispatch. Dispatch SHALL occur only through explicit `adapterId` or a fails-closed deterministic single-match lookup. No Adapter Selection logic is authorized.

Acceptance Criteria: deterministic dispatch; unit tested.

### TASK-005 — Host Presentation

Present runtime information using Output Channel, Notifications, and Host diagnostics. Presentation SHALL remain provider-independent (no provider names, no provider-specific formatting).

Acceptance Criteria: deterministic presentation; unit tested.

### TASK-006 — Host Capability Declaration

Implement Host capabilities required by RFC-0009. Expose Host-supported functionality without introducing runtime behavior.

Acceptance Criteria: deterministic capability declaration; unit tested.

### TASK-007 — End-to-End Host Validation

Validate the complete Host execution path against `MockAdapter` and/or the Sprint 21 runtime validation Adapter:

```text
VS Code → Host → Kernel → AdapterService → MockAdapter
```

or

```text
VS Code → Host → Kernel → AdapterService → Sprint 21 Runtime Validation Adapter
```

No live provider execution.

Acceptance Criteria: end-to-end execution demonstrated; repository validation passes; unit tested.

### TASK-008 — Repository Validation

Verify RFC-0010 boundaries preserved, Host remains infrastructure only, Adapter Contract unchanged, `LocalProcessRuntime` unchanged, Execution Strategy unchanged.

Acceptance Criteria: all Implementation Gates pass; no architectural regressions; `npm run validate` passes.

### TASK-009 — Documentation

Update `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, `IMPLEMENTATION_REPORT.md`, and this Sprint Implementation Record (Builder Results / Test Summary sections) with implemented capabilities, deferred concepts, architectural decisions, Host ingress architecture, and validation summary.

The Builder SHALL NOT modify: Kernel Canon, any RFC, `REVIEW_HISTORY.md`, `RATIFICATION_LEDGER.md`.

## Explicitly Out of Scope / Deferred Concepts

**Live Provider Integration:** GitHub Copilot CLI, Claude CLI, Gemini CLI, Codex CLI, OpenAI, Azure OpenAI.

**Provider Runtime:** authentication, login, credential management, provider configuration, provider protocol translation, prompt execution, response parsing, streaming.

**Adapter Selection:** routing policy, capability scoring, provider preference, fallback, priority ordering, load balancing (`NEXUS-RAT-2026-07-13-011`, unaffected).

**Workflow UI:** Mission UI, Review UI, Knowledge UI, workflow visualization.

**Host Ingress Contract (broader ingress):** `submitMission`, `publishHostObservation`, `submitApproval`, `queryWorkflowStatus` (`knowledge/reference/interface-contracts/host-ingress-contract.md`) remain out of scope — this sprint implements Adapter-facing ingress only, not general Mission ingress.

**`COPILOT_INSTRUCTIONS.md`:** SHALL NOT be activated or consumed. It becomes active only when the first live provider is integrated and exercised from within the completed Host runtime; the current GitHub Copilot Chat Builder workflow remains the authoritative implementation environment.

**Kernel/Adapter/Runtime changes:** any modification to `AdapterLifecycle`, `AdapterRegistry`, `AdapterMetadata`'s existing fields, `MockAdapter`, `LocalProcessRuntime`'s existing behavior, Execution Strategy, or Role Assignment.

## Acceptance Criteria

Sprint 23 SHALL demonstrate:

- deterministic Host ingress;
- public Kernel service invocation only (no direct aggregate/repository/registry/runtime/Adapter access from the Host);
- deterministic Adapter discovery;
- deterministic Adapter dispatch (explicit `adapterId` or fails-closed single-match lookup only);
- Host diagnostics;
- runtime operational metadata presentation;
- preservation of all previously certified Kernel boundaries (Sprint 18's `src/kernel` boundary test passes unmodified);
- preservation of the Adapter abstraction and `LocalProcessRuntime` ownership;
- successful repository validation (`npm run validate`);
- comprehensive unit test coverage.

No live provider SHALL execute. No new Kernel concepts SHALL be introduced. No architectural ownership SHALL change.

## Builder Responsibilities

- Read, in order: `IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md` § Milestone 4 / Sprint 23, `IMPLEMENTATION_MANIFEST.md` § Milestone 4 / Sprint 23, `knowledge/specifications/rfc-0009-host-contract.md`, `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`, `knowledge/specifications/rfc-0010-kernel-boundaries.md`, the Sprint 1, 7, 19, 20, 21, and 22 records, `src/hosts/vscode/vscode-host.ts` and `src/hosts/vscode/host.contract.ts` as the current baseline, `src/kernel/adapter/` as the Adapter service surface to be consumed, `knowledge/implementation/implementation-technology-standard.md`, `knowledge/implementation/implementation-conventions.md`.
- Implement only the concepts listed under Authorized Vertical Slice above.
- Preserve every Deferred/Out-of-Scope item without approximation — especially: no live provider, no Adapter Selection Policy, no `COPILOT_INSTRUCTIONS.md`, no broader Mission ingress.
- Respect the Host Boundary directive precisely: all Host → Kernel interaction traverses public Kernel service contracts only.
- Report any additional undocumented concept, terminology gap, or specification conflict rather than guessing; stop and request ratification if one is found.
- Produce the Sprint 23 section of `IMPLEMENTATION_REPORT.md` upon completion.
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

- Only two pre-certified, non-production Adapters can be exercised through the new ingress; no production provider Adapter exists yet.
- The broader Host Ingress Contract (Mission submission, host observation publication, approval submission, workflow status query) remains unimplemented; this sprint scopes strictly to Adapter-facing ingress.
- `COPILOT_INSTRUCTIONS.md`'s activation point remains pushed to first live provider execution inside the completed Host runtime, per `NEXUS-RAT-2026-07-13-010`.

## Expected Outcome

Upon successful completion, a user inside the VS Code extension will be able to discover registered Adapters, see their installation/health status, and deterministically dispatch a request to a named Adapter — end to end through the Host, Kernel, and Adapter layers — using only pre-certified, provider-independent Adapters. This establishes the production entry point a future live provider Adapter sprint will plug into, without pulling any provider-specific behavior into the Host or Kernel.

## Builder Results

Implemented Sprint 23 Host Ingress Foundation as an RFC-0009 Host-layer vertical slice.

Implemented scope:

- Added Host command registration for Adapter discovery, Adapter dispatch, and Host capability declaration.
- Added Host ingress routing through the public `AdapterService` contract only.
- Added deterministic Host capability declaration for Command Registration, Notifications, Diagnostics, and User Interface.
- Added Adapter discovery output that presents Adapter metadata, Sprint 22 operational metadata, runtime diagnostics, and Host diagnostics.
- Added Adapter dispatch using explicit `adapterId` or fails-closed single-match lookup only; no routing, preference, fallback, or scoring policy was introduced.
- Wired the extension activation composition root to register the certified `MockAdapter` for provider-independent Host validation.
- Added package command contributions for `nexus.discoverAdapters`, `nexus.dispatchAdapterRequest`, and `nexus.showHostCapabilities`.

Preserved deferred scope:

- No live provider integration, authentication, protocol translation, prompt execution, response parsing, streaming, Adapter Selection Policy, broader Mission ingress, workflow UI, or `COPILOT_INSTRUCTIONS.md` was introduced.
- `AdapterLifecycle`, `AdapterRegistry`, `AdapterMetadata`, `MockAdapter`, `LocalProcessRuntime`, Execution Strategy, Role Assignment, Kernel Canon, and RFCs were not modified.

## Test Summary

Validation passed:

- Targeted Sprint 23 validation passed: 3 files, 6 tests.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 45 files, 242 tests.

## Reviewer Notes

**Status**

PASS WITH FINDINGS

## Review Summary

See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-13-023` for the complete review record.

`git diff --stat HEAD -- src/kernel/ src/adapters/mock/ src/adapters/runtime/` confirmed zero changes to the Kernel or to any existing Adapter/runtime implementation; all new code is additive under `src/hosts/vscode/` and `src/extension.ts`. `HostIngressLayer` invokes only `AdapterService.enumerateAdapters()`/`AdapterService.dispatch()`, honoring the Host Boundary directive exactly — no direct aggregate, repository, `AdapterRegistry`, or `LocalProcessRuntime` access. Adapter dispatch implements exactly the two mechanisms `NEXUS-RAT-2026-07-13-011` authorizes (explicit `adapterId`, or a fails-closed single-match lookup), confirmed by a dedicated ambiguous-match test that rejects deterministically rather than falling back to a default choice. `grep` confirmed zero "Provider"/live-provider vocabulary anywhere in the new code — Sprint 23 is completely provider-independent, as directed. Independent re-validation confirmed `npm run validate` passes cleanly: TypeScript compile, ESLint, Vitest 45 files / 242 tests, esbuild build — matching the Builder's reported figures exactly.

## Findings

One Minor, Category 4 (Documentation Drift) finding: `IMPLEMENTATION_MANIFEST.md` § Sprint 23 states both `MockAdapter` and the Sprint 21 runtime-validation test Adapter were exercised, but only `MockAdapter` is referenced anywhere in Sprint 23's actual implementation and tests. See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-13-023-F-001`.

## Required Actions

One Documentation Task (non-blocking): reword `IMPLEMENTATION_MANIFEST.md`'s Sprint 23 "Implemented Concepts" bullet to state the exercised path was `MockAdapter` only, consistent with `IMPLEMENTATION_REPORT.md`. This finding does not block progression to the next planned sprint.

**Status: COMPLETED** — verified by `NEXUS-REV-2026-07-13-024`. `IMPLEMENTATION_MANIFEST.md` § Sprint 23 now reads "...exercised against the certified `MockAdapter` only." `git diff` confirmed this was the only line changed in the file; no source, test, Plan, or Report change occurred; `npm run validate` continues to pass (45 files / 242 tests).

## Final Disposition

**Approved with Findings.** No architectural violations detected. All Sprint Owner Directives (Host Boundary, Adapter Dispatch, Provider Independence) are honored precisely. All declared Deferred Concepts remain correctly unimplemented. The single Minor documentation-drift finding (`NEXUS-REV-2026-07-13-023-F-001`) has been remediated and verified closed by `NEXUS-REV-2026-07-13-024`. Sprint 23's review cycle is complete with no open findings.

Date: 2026-07-13

Reviewer: Reviewer AI (Claude Code)

Review Reference: `NEXUS-REV-2026-07-13-023`; remediation verified by `NEXUS-REV-2026-07-13-024`
