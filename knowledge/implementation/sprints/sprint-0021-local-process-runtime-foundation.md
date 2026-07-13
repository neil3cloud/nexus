# Sprint 21 — Local Process Runtime Foundation

## Sprint Status

Approved (NEXUS-REV-2026-07-13-021)

## Sprint Objective

Implement a provider-agnostic **Local Process Runtime** that enables the Nexus Adapter layer to execute local processes deterministically, without introducing any production AI provider integration. This sprint establishes the runtime foundation that all future CLI-based Adapters (GitHub Copilot CLI, Claude CLI, Codex CLI, Gemini CLI, etc.) will reuse.

The implementation SHALL introduce only generic process execution capabilities. No provider-specific behavior is authorized. No Kernel architectural concepts change.

## Milestone

Milestone 4 — External Integration (third slice). Sprint 19 certified the Adapter runtime; Sprint 20 certified the execution pipeline; Sprint 21 certifies process-execution infrastructure beneath the Adapter layer, splitting "production provider Adapter integration" into two steps to bound risk: this sprint (generic process execution, no provider, no auth, no network) and a future sprint (a specific provider Adapter built on top of it).

## RFC Coverage

Primary:

- RFC-0008 — Kernel Adapter Contract (Partial)

Referenced:

- RFC-0004 — Execution Model
- RFC-0010 — Kernel Boundaries

This sprint extends the certified Adapter runtime with a reusable process-execution capability. No new Adapter lifecycle semantics are introduced. No changes to Kernel orchestration are authorized.

## Ratification References

- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md` remains deferred; this sprint is explicitly **not** "the first production AI provider integration sprint" that ratification names as the activation trigger, since no provider is introduced here. `COPILOT_INSTRUCTIONS.md` SHALL NOT be created this sprint.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected by this sprint; the Local Process Runtime sits beneath Adapter dispatch and has no bearing on which Adapter is selected.

## Architectural Context

Current certified execution pipeline (Sprint 19/20):

```text
Task → Execution Strategy → Role Assignment → Adapter Registry → Mock Adapter (in-process) → Adapter Response
```

Sprint 21 introduces a reusable runtime *beneath* the Adapter layer, for Adapters that choose to use it:

```text
Adapter → Local Process Runtime → Local Process → Process Result → (Adapter translates into AdapterResponse)
```

The Adapter remains responsible for protocol translation (RFC-0008). The Local Process Runtime is responsible only for deterministic process execution. It has no knowledge of Adapters, AI providers, or the Kernel.

## Critical Boundary — Local Process Runtime Is Adapter-Layer Infrastructure, Not a Kernel Capability (Sprint Owner Directive)

RFC-0010 § Responsibilities Outside the Kernel § Execution Responsibilities: *"The Kernel SHALL NOT implement responsibilities owned by Adapters, including: ... external tool execution."* Process execution is external tool execution. Accordingly:

- `LocalProcessRuntime` and its supporting types (`ProcessRequest`, `ProcessResult`, `ProcessExecutionOptions`, `ProcessExitStatus`, `ProcessDiagnostics`) SHALL be placed outside `src/kernel` — under `src/adapters/runtime/` (or an equivalent non-Kernel location), mirroring how `MockAdapter` was correctly placed under `src/adapters/mock/` in Sprint 19.
- The Kernel SHALL depend only upon the runtime *contract*, never upon operating-system process management directly. Dependency direction: `Kernel → Adapter → Local Process Runtime → Operating System`.
- Kernel services SHALL NOT depend upon `child_process`, platform-specific APIs, shell implementations, or operating-system process semantics of any kind. Adapters SHALL consume runtime abstractions rather than operating-system APIs directly. Operating-system concerns SHALL remain encapsulated entirely within the runtime implementation.
- `src/kernel` SHALL NOT import `LocalProcessRuntime` or any of its supporting types. The Kernel continues to depend only on the `Adapter` contract (RFC-0008), never on a concrete Adapter's internal execution mechanism.
- Sprint 18's `src/kernel` import-graph boundary test SHALL continue to pass unmodified, independently re-verifying this.

## Critical Guardrail — MockAdapter's Sprint 19 Contract Remains Frozen

Sprint 19 (`NEXUS-REV-2026-07-13-019`) approved `MockAdapter` as explicitly: "simulate deterministic execution; produce predictable responses; never invoke external processes; never access AI providers; never modify Kernel behavior." That approved baseline is an Approved Vertical Slice under `IMPLEMENTATION_CONSTITUTION.md` § Approved Vertical Slice Immutability. This sprint SHALL NOT modify previously approved `MockAdapter` behavior **unless correcting an implementation defect** (the Constitution's own narrow exception for Approved Vertical Slices) — it SHALL NOT be redesigned or extended to gain process-execution behavior.

TASK-007 ("Runtime Integration Validation") SHALL be satisfied through one of:

1. Dedicated runtime integration tests that exercise `LocalProcessRuntime` directly, spawning a trivial, deterministic, cross-platform-safe local command (e.g., invoking the already-present Node.js executable with a short inline script) — proving the runtime works without touching any Adapter.
2. A dedicated runtime-validation Adapter created solely for runtime verification (e.g. a new, separate, clearly-named test-only Adapter living beside `MockAdapter` under `src/adapters/`) that uses `LocalProcessRuntime` — leaving `MockAdapter` itself unchanged.

The purpose of TASK-007 is to prove runtime compatibility — not to redesign or extend `MockAdapter`. `MockAdapter` remains the Kernel's registered Adapter for Sprint 19/20-style pipeline tests; it is not required to, and SHALL NOT, gain process-execution behavior except to correct a genuine implementation defect (which, if discovered, SHALL be reported before being fixed, per `IMPLEMENTATION_CONSTITUTION.md` § Stop Conditions, rather than silently folded into this sprint's scope). If neither approach can satisfy TASK-007 without modifying `MockAdapter`, implementation SHALL stop and report the gap.

## Authorized Concepts

Implement, all outside `src/kernel`:

- `LocalProcessRuntime` — process creation, lifecycle, output capture, exit status, timeout handling, cancellation, runtime diagnostics.
- `ProcessRequest` — immutable: executable, arguments, working directory, environment overrides, timeout, cancellation token.
- `ProcessResult` — immutable: exit status, standard output, standard error, execution duration, termination reason.
- `ProcessExecutionOptions`, `ProcessExitStatus`, `ProcessDiagnostics` — supporting value objects for the above.

These concepts belong exclusively to the runtime/infrastructure layer beneath Adapters. They are not RFC-0008 Adapter Contract concepts and SHALL NOT be added to `src/kernel/adapter/`.

## Architectural Responsibilities

**`LocalProcessRuntime` owns:** process creation, process lifecycle, output capture, exit status, timeout handling, cancellation, runtime diagnostics.

**Adapter owns:** provider protocol, request translation, response translation, provider-specific validation (unchanged, RFC-0008). Adapters that choose to execute local processes SHALL consume the Local Process Runtime rather than implementing independent process execution.

**Execution Strategy:** Adapter Selection remains deferred and unowned (per `NEXUS-RAT-2026-07-13-011`); Execution Strategy SHALL NOT own process execution and is unaffected by this sprint.

**Kernel:** unaffected. No Kernel orchestration, service, or contract changes are authorized.

## Authorized Scope (TASK-001 through TASK-009)

- **TASK-001 — Local Process Runtime.** Implement `LocalProcessRuntime`: launch local processes, monitor execution, collect results, enforce execution constraints. Acceptance: deterministic execution; dependency injection; unit tested.
- **TASK-002 — Process Request Model.** Immutable `ProcessRequest`: executable, arguments, working directory, environment overrides, timeout, cancellation token. Acceptance: immutable value object; validation; unit tested.
- **TASK-003 — Process Result Model.** Immutable `ProcessResult`: exit status, standard output, standard error, execution duration, termination reason. Acceptance: immutable; deterministic; unit tested.
- **TASK-004 — Timeout Support.** Deterministic timeout handling; the runtime SHALL terminate processes exceeding the configured timeout. Acceptance: timeout enforcement; deterministic diagnostics; unit tested.
- **TASK-005 — Cancellation Support.** Cooperative cancellation; SHALL terminate the running process cleanly. Acceptance: cancellation support; deterministic, non-flaky behavior; unit tested.
- **TASK-006 — Diagnostics.** Deterministic diagnostics for: executable not found, startup failure, timeout, cancellation, abnormal termination, non-zero exit code. Diagnostics SHALL preserve attribution. Acceptance: deterministic diagnostics; unit tested.
- **TASK-007 — Runtime Integration.** Prove `LocalProcessRuntime` works beneath the Adapter layer, per the Critical Guardrail above — without modifying `MockAdapter`'s Sprint 19-approved behavior. No production provider integration is authorized. Acceptance: existing execution pipeline (Sprint 19/20) preserved and unmodified; `LocalProcessRuntime` proven functional via dedicated tests or a new test-only Adapter; existing tests continue to pass.
- **TASK-008 — Repository Validation.** Verify introducing the runtime does not alter the Adapter Contract, Execution Strategy, Role Assignment, or Kernel boundaries. Acceptance: RFC-0010 boundaries preserved (Sprint 18's `src/kernel` import-graph test passes unmodified); no architectural regressions; `npm run validate` passes.
- **TASK-009 — Documentation.** Update `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, `IMPLEMENTATION_REPORT.md`, and this Sprint Implementation Record with implemented capabilities, deferred concepts, architectural decisions, runtime limitations, RFC coverage, and validation summary.

## Explicitly Deferred

**Provider Integrations:** GitHub Copilot CLI, Claude CLI, Codex CLI, Gemini CLI, OpenAI, Azure OpenAI.

**Provider Runtime Features:** authentication, login management, credential storage, provider configuration, provider discovery, provider capability negotiation.

**Process Orchestration:** parallel execution, process pools, retries, fallback execution, execution scheduling, execution prioritization.

**Adapter Selection** (per `NEXUS-RAT-2026-07-13-011`, unaffected by this sprint): routing policy, capability scoring, provider preference, priority ordering, fallback selection, load balancing. Execution SHALL continue to dispatch only through an explicit `adapterId` or a deterministic single-match lookup; multiple matching Adapters SHALL fail deterministically.

**CLI Interpretation:** the runtime SHALL NOT parse AI responses, understand markdown, understand JSON payload semantics, validate provider protocols, or interpret prompts. Those responsibilities belong to provider Adapters, not yet implemented.

**MockAdapter modification:** MockAdapter's Sprint 19-approved behavior remains frozen (see Critical Guardrail).

## Acceptance Criteria

Sprint 21 SHALL demonstrate:

- deterministic local process execution;
- a reusable runtime abstraction, placed outside `src/kernel`;
- process lifecycle management (launch, output capture, exit status);
- timeout support;
- cancellation support;
- deterministic diagnostics;
- proof of integration beneath the Adapter layer without modifying `MockAdapter`'s approved behavior;
- preservation of all previously certified Kernel boundaries (Sprint 18's boundary test passes unmodified);
- no production AI provider introduced;
- no Kernel architectural concept changed;
- successful repository validation (`npm run validate`);
- comprehensive unit test coverage.

## Builder Responsibilities

- Read, in order: `IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md` § Milestone 4 / Sprint 21, `IMPLEMENTATION_MANIFEST.md` § Milestone 4 / Sprint 21, `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`, `knowledge/specifications/rfc-0010-kernel-boundaries.md`, the Sprint 19 record and `src/adapters/mock/mock-adapter.ts` as the precedent for Adapter-layer code placement, `knowledge/implementation/implementation-technology-standard.md`, `knowledge/implementation/implementation-conventions.md`.
- Implement only the concepts listed under Authorized Concepts / Authorized Scope (TASK-001 through TASK-009) above.
- Preserve every Deferred Concept without approximation, especially: no provider-specific code, no authentication, and no modification to `MockAdapter`.
- Place all new code outside `src/kernel`, per the Critical Boundary above.
- Report any additional undocumented concept, terminology gap, or specification conflict rather than guessing; stop and request ratification if one is found.
- Produce the Sprint 21 section of `IMPLEMENTATION_REPORT.md` upon completion.
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

- The runtime executes only local, synchronous-from-the-Kernel's-perspective processes; no remote/distributed execution.
- No provider is wired to real process execution this sprint; `MockAdapter` remains purely in-process and simulated.
- Cancellation/timeout tests must be written to be deterministic and non-flaky in CI; wall-clock-dependent assertions should use generous, clearly-justified margins or dependency-injected clocks/process factories rather than real sleep-based races where avoidable.
- `COPILOT_INSTRUCTIONS.md` is not created this sprint (see Ratification References).

## Expected Outcome

Upon successful completion, the Nexus Adapter layer will have a certified, reusable, provider-agnostic Local Process Runtime, ready to be consumed by a future sprint's concrete CLI-based Adapter (e.g., GitHub Copilot CLI) without requiring further Kernel changes. That future sprint would then be scoped narrowly to provider-specific protocol translation and authentication, building on this sprint's process-execution foundation.

## Builder Results

Implemented the Sprint 21 Local Process Runtime Foundation slice.

- Added `LocalProcessRuntime` under `src/adapters/runtime/`, outside `src/kernel`.
- Added `LocalProcessRuntimeContract` so Adapters consume a runtime abstraction instead of operating-system process APIs.
- Added immutable runtime value objects: `ProcessRequest`, `ProcessExecutionOptions`, `ProcessResult`, `ProcessExitStatus`, and `ProcessDiagnostics`.
- Added explicit local-process runtime errors for invalid request and result definitions.
- Implemented provider-agnostic local process launch, stdout/stderr capture, exit status, duration capture, timeout termination, cancellation termination, and deterministic diagnostics.
- Added deterministic diagnostics for executable-not-found, startup failure, timeout, cancellation, abnormal termination, non-zero exit code, and successful completion.
- Proved Adapter-layer integration through a separate test-only Adapter in `test/integration/local-process-runtime.integration.test.ts`.
- Preserved `MockAdapter`'s Sprint 19-approved behavior unchanged.
- Introduced no Kernel source changes and no `src/kernel` dependency on Adapter-layer runtime code.
- Encapsulated operating-system process management inside `LocalProcessRuntime`; the runtime-validation Adapter depends only on `LocalProcessRuntimeContract`.

No production provider integration, authentication, credential handling, provider discovery, provider protocol interpretation, Adapter Selection Policy, process pool, retry, fallback execution, scheduling, prioritization, Kernel architectural change, Adapter Contract change, Execution Strategy change, Role Assignment change, Domain Event, repository, or `COPILOT_INSTRUCTIONS.md` was introduced.

## Test Summary

Validation passed.

- Targeted Sprint 21 validation passed: 3 files, 12 tests.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 41 files, 232 tests.

## Reviewer Notes

**Status**

PASS

## Review Summary

See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-13-021` for the complete review record.

`git diff --stat HEAD -- src/kernel/ src/adapters/mock/` confirmed zero changes to `src/kernel` or `MockAdapter` — both Critical guardrails are fully honored. `node:child_process` usage is confined to exactly one file (`local-process-runtime.ts`), entirely encapsulated within `LocalProcessRuntime`; Adapters consume only `LocalProcessRuntimeContract`. Sprint 18's `src/kernel` import-graph boundary test is unmodified and still passes, independently re-verifying the Kernel imports nothing from `src/adapters/`. TASK-007 was satisfied via Approach 2 (a new, separate `LocalProcessTestAdapter`), dispatched through the pre-existing, unmodified `InMemoryAdapterRegistry`/`AdapterService`, using the already-running Node.js binary as a deterministic, cross-platform-safe process target. Timeout/cancellation tests use a dependency-injected fake process factory rather than real timing races, avoiding CI flakiness. Independent re-validation confirmed `npm run validate` passes cleanly: TypeScript compile, ESLint, Vitest 41 files / 232 tests, esbuild build — matching the Builder's reported figures exactly.

## Findings

None.

## Required Actions

None. Sprint 21's review cycle is complete with no open findings.

## Final Disposition

**Approved.** No architectural violations detected. `LocalProcessRuntime` is provider-agnostic, deterministic, correctly placed outside `src/kernel`, and consumed only through its contract. `MockAdapter`'s Sprint 19-approved baseline remains byte-for-byte unchanged. All declared Deferred Concepts remain correctly unimplemented. Milestone 4 progression is not blocked.

Date: 2026-07-13

Reviewer: Reviewer AI (Claude Code)

Review Reference: `NEXUS-REV-2026-07-13-021`
