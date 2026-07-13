# Sprint 22 — Adapter Runtime Operational Metadata

## Sprint Status

Approved (NEXUS-REV-2026-07-13-022)

## Sprint Objective

Make the certified Adapter Runtime (Sprint 7, 19, 20, 21) operationally self-describing and verifiable — installation detection, health status, runtime diagnostics, and configuration metadata for a concrete Adapter instance — **before** any live production provider is introduced. This sprint is an implementation refinement of the existing, RFC-0008-owned Adapter architecture. It does **not** introduce a new architectural layer, a new registry, or any concept requiring RFC ownership beyond RFC-0008.

No production provider invocation, authentication, or provider protocol translation is authorized. No changes to Execution Strategy, Adapter dispatch semantics, `AdapterRegistry`, `AdapterLifecycle`, or `LocalProcessRuntime` ownership are authorized.

## Milestone

Milestone 4 — External Integration (fourth slice). Sprint 19 certified the Adapter runtime; Sprint 20 certified the execution pipeline; Sprint 21 certified process-execution infrastructure beneath the Adapter layer; Sprint 22 makes a concrete Adapter's operational state (installed? healthy? configured?) discoverable, still without any live provider.

## Governance History — Why This Record Looks the Way It Does

An earlier draft of this sprint proposed a parallel **"Provider"** vocabulary (`ProviderMetadata`, `ProviderCapability`, `ProviderRegistry`, `ProviderInstallationStatus`, `ProviderHealthStatus`) and cited "RFC-0008 — Provider Contract." That draft was rejected during `/nexus-plan` for three reasons, and the Sprint Owner confirmed the correction:

1. RFC-0008 is titled *Kernel Adapter Contract* and exclusively owns `Adapter`, `Adapter Contract`, `Adapter Capability`, `Adapter Request`, `Adapter Response`, `Adapter Metadata`, `Adapter Lifecycle` — it has no "Provider" concept; "RFC-0008 — Provider Contract" was a citation error.
2. The draft's `ProviderCapability` examples included `Builder, Reviewer` — these are RFC-0008 **Engineering Roles**, not Capabilities. RFC-0008 explicitly states *"Capabilities SHALL NOT redefine Engineering Roles."* Listing them as capabilities would have been a direct rule violation.
3. `ProviderRegistry` would have substantially duplicated the already-approved `AdapterRegistry` (Sprint 7) — redundant architecture with two sources of truth for what's registered.

The Sprint Owner confirmed the intent was never a new architectural layer, and reframed the sprint entirely in terms of the existing, RFC-0008-owned Adapter vocabulary. This record reflects that reframing. No RFC Amendment or ADR is required because no new architectural concept is introduced.

## RFC Coverage

Primary:

- RFC-0008 — Kernel Adapter Contract (Partial)

Referenced:

- RFC-0004 — Execution Model
- RFC-0010 — Kernel Boundaries

This sprint extends the certified Adapter runtime with operational self-description. `AdapterRegistry` remains the only runtime registry. No Adapter lifecycle semantics are modified. No Kernel orchestration semantics are modified.

## Ratification References

- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md` remains deferred; per the Sprint Owner's explicit direction this sprint, it becomes active only when the first live provider executes inside the completed Nexus host — not this sprint, and not merely upon the first production provider Adapter sprint as previously anticipated. This sprint SHALL NOT introduce or consume `COPILOT_INSTRUCTIONS.md`.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected.

## Architectural Direction (Sprint Owner Directive, binding)

- Do **not** introduce a new `Provider` architectural layer or any `Provider`-prefixed type.
- Do **not** introduce `ProviderRegistry` or any second runtime registry. `AdapterRegistry` (Sprint 7) remains the only runtime registry.
- Do **not** duplicate or supersede any RFC-0008 concept.
- `AdapterCapability` SHALL continue to describe technical capabilities only. Engineering Roles remain exclusively owned by the Execution Role model established in Sprint 8. **`Builder` and `Reviewer` SHALL NOT appear as Adapter capability values.**

## Critical Boundary — Two Placement Rules

1. **`AdapterCapability`'s supported-value list (`src/kernel/adapter/adapter-capability.ts`) is the one narrow, explicitly authorized Kernel-touching change this sprint.** RFC-0008 describes its capability list as illustrative and non-exhaustive ("Capabilities MAY include: ..."); Sprint 7 selected five concrete values from it. This sprint MAY additively extend `supportedAdapterCapabilities` with new technical-capability values (e.g., `CLI`, `Streaming`, `Chat`, `Completion` — exact naming left to the Builder, provided none collide with or rename the existing five values and none duplicate an Engineering Role name). This is an additive extension to an Approved Vertical Slice, explicitly authorized by this Sprint Implementation Record, per `IMPLEMENTATION_CONSTITUTION.md` § Approved Vertical Slice Immutability. No other part of `adapter-capability.ts` (validation, equality, string conversion) may change, and no other `src/kernel` file may change.
2. **Everything else — installation detection, health status, runtime diagnostics, configuration metadata, executable/version discovery — is Adapter-layer implementation tooling, not RFC-0008 Contract vocabulary, and SHALL live outside `src/kernel`** (e.g., under `src/adapters/runtime/` or a new sibling directory such as `src/adapters/diagnostics/`), mirroring the Sprint 19 (`src/adapters/mock/`) and Sprint 21 (`src/adapters/runtime/`) precedent. `AdapterLifecycle`, `AdapterRegistry`, and `AdapterMetadata`'s existing fields remain byte-for-byte frozen. Sprint 18's `src/kernel` import-graph boundary test SHALL continue to pass unmodified.

## Architectural Responsibilities

**New Adapter-layer descriptive types own:** installation detection, health status, runtime diagnostics, configuration validation — for a concrete Adapter instance. They describe; they do not execute.

**Adapter owns (unchanged, RFC-0008):** provider protocol translation, request translation, response translation.

**`LocalProcessRuntime` owns (unchanged, Sprint 21):** process execution. The new descriptive types SHALL NOT launch or manage long-running processes themselves; they MAY use `LocalProcessRuntime` for short-lived detection probes (e.g., invoking an executable with a version flag) if needed, consistent with Sprint 21's contract.

**`AdapterRegistry` owns (unchanged, Sprint 7):** registration and discovery. No second registry is authorized.

**Execution Strategy (unchanged, Sprint 8/10):** execution coordination and Adapter dispatch. Unaffected by this sprint.

## Authorized Concepts

Implement, outside `src/kernel` except where noted:

- `AdapterInstallationStatus` — e.g., executable discovered / executable missing / unsupported version / invalid installation.
- `AdapterHealthStatus` — e.g., Ready / Missing / Unsupported / Misconfigured. Runtime readiness only — SHALL NOT be confused with or merged into the existing, frozen `AdapterLifecycle` state machine (Registered → Available → Active → Completed → Unavailable).
- `AdapterRuntimeDiagnostics` — deterministic diagnostics for executable missing, configuration invalid, unsupported version, incompatible platform. Diagnostics SHALL preserve attribution.
- `AdapterConfiguration` (or equivalently named runtime configuration metadata) — configuration validation, environment discovery, installation path metadata, runtime settings. **SHALL NOT include authentication, credentials, tokens, or secrets.**
- Executable discovery / version detection helpers consumed by the above.
- **Kernel-touching exception:** additive new `AdapterCapability` values in `src/kernel/adapter/adapter-capability.ts`, per Critical Boundary Rule 1.

## Explicitly Out of Scope

The Builder SHALL NOT implement:

- Any `Provider`-prefixed type or a second runtime registry (see Architectural Direction).
- GitHub Copilot CLI, Claude CLI, Gemini CLI, Codex CLI, OpenAI, Azure OpenAI, or any live provider integration.
- Process invocation for actual work execution, prompt submission, response parsing, streaming, provider protocol translation, retries, or execution-lifecycle behavior — these remain future Adapter responsibilities.
- Authentication: login, OAuth, tokens, credential storage, secrets, account management.
- Provider execution, provider selection, provider routing, provider fallback, provider prioritization (Adapter Selection Policy remains deferred per `NEXUS-RAT-2026-07-13-011`, unaffected).
- VS Code APIs, Cursor APIs, extension activation, command registration, or any Host UI integration — these belong to a future Host Integration sprint.
- `COPILOT_INSTRUCTIONS.md` — remains deferred until the first live provider executes inside the completed Nexus host (see Ratification References).
- Any modification to `AdapterLifecycle`, `AdapterRegistry`, `AdapterMetadata`'s existing fields, `MockAdapter`, `LocalProcessRuntime`'s existing behavior, Execution Strategy, or Role Assignment.

## Acceptance Criteria

Sprint 22 SHALL demonstrate:

- deterministic, immutable Adapter installation-status, health-status, runtime-diagnostics, and configuration models, placed outside `src/kernel`;
- the sole Kernel change (if any) is a narrow, additive `AdapterCapability` value-list extension — no other `src/kernel` file changes;
- `Builder`/`Reviewer` never appear as Adapter capability values;
- no second runtime registry exists; `AdapterRegistry` remains the sole registry;
- `AdapterLifecycle` remains unchanged;
- no production provider execution, authentication, or protocol translation is introduced;
- `COPILOT_INSTRUCTIONS.md` is not created or consumed;
- preservation of all previously certified Kernel boundaries (Sprint 18's boundary test passes unmodified);
- repository-wide validation passes (`npm run validate`);
- comprehensive unit test coverage.

## Builder Responsibilities

- Read, in order: `IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md` § Milestone 4 / Sprint 22, `IMPLEMENTATION_MANIFEST.md` § Milestone 4 / Sprint 22, `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`, `knowledge/specifications/rfc-0010-kernel-boundaries.md`, the Sprint 7, Sprint 19, and Sprint 21 records, `src/kernel/adapter/adapter-capability.ts` and `src/adapters/runtime/` as placement precedent, `knowledge/implementation/implementation-technology-standard.md`, `knowledge/implementation/implementation-conventions.md`.
- Implement only the concepts listed under Authorized Concepts above.
- Preserve every Deferred/Out-of-Scope item without approximation — especially: no `Provider`-prefixed type, no second registry, no authentication, no `COPILOT_INSTRUCTIONS.md`.
- Respect both Critical Boundary rules precisely: the `AdapterCapability` extension is the only authorized Kernel change; everything else lives outside `src/kernel`.
- Report any additional undocumented concept, terminology gap, or specification conflict rather than guessing; stop and request ratification if one is found.
- Produce the Sprint 22 section of `IMPLEMENTATION_REPORT.md` upon completion.
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

- Installation/health detection is descriptive only; it does not guarantee a provider will actually work when later invoked.
- No production Adapter consumes this metadata yet — it establishes the self-description contract for a future provider Adapter sprint.
- `COPILOT_INSTRUCTIONS.md`'s activation point has been pushed later than previously anticipated (host-execution time, not provider-Adapter-implementation time) — see Ratification References.

## Expected Outcome

Upon successful completion, any concrete Adapter (including a future production provider Adapter) will be able to report whether it is installed, healthy, and correctly configured, using a consistent, RFC-0008-consistent vocabulary — without any live provider having been introduced, and without duplicating or reopening any previously approved Adapter concept.

## Builder Results

Implemented Sprint 22 Adapter Runtime Operational Metadata as an RFC-0008-consistent Adapter-layer refinement.

Implemented scope:

- Added immutable Adapter-layer runtime metadata models outside `src/kernel`: `AdapterInstallationStatus`, `AdapterHealthStatus`, `AdapterRuntimeDiagnostics`, and `AdapterConfiguration`.
- Added `AdapterExecutableDiscovery` for short-lived executable/version detection through `LocalProcessRuntimeContract`.
- Extended `supportedAdapterCapabilities` with technical capability values `CLI`, `Chat`, and `Completion`; no Engineering Role names were added as capabilities.
- Preserved `AdapterRegistry` as the sole registry and left `AdapterLifecycle`, `AdapterMetadata`, `MockAdapter`, `LocalProcessRuntime`, Execution Strategy, and Role Assignment unchanged.
- Did not introduce Provider-prefixed types, authentication, live provider execution, protocol translation, host integration, Adapter Selection Policy, or `COPILOT_INSTRUCTIONS.md`.

## Test Summary

Validation passed:

- Targeted Sprint 22 validation passed: 2 files, 11 tests.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 42 files, 236 tests.

## Reviewer Notes

**Status**

PASS

## Review Summary

See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-13-022` for the complete review record.

`git diff --stat HEAD -- src/kernel/` confirmed exactly one Kernel file changed — `adapter-capability.ts` — with a three-line, purely additive diff (`CLI`, `Chat`, `Completion`); no other Kernel file was touched. `grep` confirmed zero occurrences of "Provider" or `Builder`/`Reviewer`-as-capability anywhere in the new code, directly resolving both violations flagged in the rejected earlier draft, and confirmed no second registry exists. `AdapterInstallationStatus`/`AdapterHealthStatus` are correctly independent of the frozen `AdapterLifecycle` state machine. `AdapterConfiguration` actively rejects secret-bearing configuration keys rather than merely omitting an authentication field. `AdapterExecutableDiscovery` correctly reuses the unmodified Sprint 21 `LocalProcessRuntimeContract` for short-lived detection probes. `MockAdapter`, `AdapterLifecycle`, `AdapterRegistry`, `AdapterMetadata`, Execution Strategy, and Role Assignment are all confirmed untouched. Independent re-validation confirmed `npm run validate` passes cleanly: TypeScript compile, ESLint, Vitest 42 files / 236 tests, esbuild build — matching the Builder's reported figures exactly.

## Findings

None.

## Required Actions

None. Sprint 22's review cycle is complete with no open findings.

## Final Disposition

**Approved.** No architectural violations detected. The governance conflict identified during planning (a parallel "Provider" vocabulary overlapping RFC-0008-owned concepts) does not appear anywhere in the implementation — the reframed, RFC-0008-consistent scope was followed precisely. All declared Deferred Concepts remain correctly unimplemented. Milestone 4 progression is not blocked.

Date: 2026-07-13

Reviewer: Reviewer AI (Claude Code)

Review Reference: `NEXUS-REV-2026-07-13-022`
