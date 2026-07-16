# Sprint 63 — Governance State Projection Foundation

## Status

✅ Approved — `NEXUS-REV-2026-07-16-016` (Mission-scoped-only; fully closed with zero open findings of any blocking category; two Category 6, Informational Observations, no Builder Task). Scope narrowed by `NEXUS-RAT-2026-07-16-016`, resolving the pre-implementation block recorded in `NEXUS-REV-2026-07-16-015`. See the Revision History addendum below for the Cycle 1 (Blocked) / Cycle 2 (Approved) history.

## Milestone

Milestone 10 — Autonomous Engineering Readiness (opening Sprint).

## Ratification

`NEXUS-RAT-2026-07-16-015` authorizes this Sprint's original scope. `NEXUS-RAT-2026-07-16-016` narrows that scope to Mission-scoped-only reporting, superseding the per-Workflow-position language below. This document has been revised to reflect `NEXUS-RAT-2026-07-16-016`'s binding text directly rather than leaving the superseded wording in place. See `knowledge/governance/RATIFICATION_LEDGER.md` §§ `NEXUS-RAT-2026-07-16-015` and `NEXUS-RAT-2026-07-16-016` for the full binding text.

## Objective

Implement the first concrete Domain Event consumer in the system: a deterministic, **Mission-scoped only** read model — `GovernanceStateProjection` — reporting, per Mission: the latest authoritative `GovernanceDecision` and its outcome; unresolved Recovery Requirements and their lifecycle state; whether any governance state remains Blocking; whether Escalation Required is present; and Mission-level governance diagnostics and attribution. Built exclusively by consuming existing, frozen Domain Events. This Sprint introduces no workflow mutation, no Host UI, and no Engineering-Session- or Workflow-Step-level attribution of any kind. It is Step 1 of Milestone 10's Initial Capability Sequence.

## RFC Coverage

- RFC-0005 — Domain Event Model (Referenced). This Sprint is the first concrete consumer of `GovernanceDecisionRecorded` (Sprint 56), `RecoveryRequirementCreated`/`RecoveryRequirementResolved`/`RecoveryRequirementWithdrawn` (Sprint 59). No existing event type, envelope, or publisher is modified.
- RFC-0004 — Execution Model v1.13 (Referenced). Workflow Advancement, Recovery Requirement, and Recovery-Gated Re-Advancement state are consumed read-only through existing public contracts only.
- RFC-0011 — Engineering Governance Model v1.0 (Referenced). `GovernanceDecision` is consumed read-only and unmodified.
- RFC-0001 — Mission Model v1.1 (Referenced). The projection is Mission-scoped; Mission Completion state is consumed read-only.

No RFC is amended by this Sprint.

## Implemented Concepts

- `GovernanceStateProjection` — an immutable, **Mission-scoped only** read model summarizing, as of the last consumed event: the latest authoritative `GovernanceDecision` and its outcome; unresolved `RecoveryRequirement`s and their lifecycle state (Open/Resolved/Withdrawn); whether any governance state remains Blocking; whether Escalation Required is present; and Mission-level governance diagnostics and attribution. The projection reports this state; it does not evaluate or reinterpret it, and it carries no Engineering-Session or Workflow-Step identity of any kind.
- A minimal, concrete event-subscription mechanism scoped to exactly the four event types below, sufficient to update the projection deterministically as events are published. This mechanism SHALL NOT be generalized into an independent, reusable subscriber/consumer framework; it exists to serve this one projection.
- `IGovernanceStateProjectionRepository` contract and an in-memory implementation, consistent with the Kernel's established repository pattern (`InMemory*Repository`).
- A thin, read-only application service (e.g., `GovernanceStateProjectionService`) exposing Mission-scoped projection retrieval through constructor-injected contracts only.
- Kernel service composition (`createKernelServices`) wiring so the projection mechanism subscribes to the existing shared `EventBusContract` instance.

## Event Inputs (binding, per `NEXUS-RAT-2026-07-16-016`)

The projection MAY consume only: `GovernanceDecisionRecorded`, `RecoveryRequirementCreated`, `RecoveryRequirementResolved`, `RecoveryRequirementWithdrawn`. All projection state SHALL be derived solely from these events' authoritative payloads and resolvable public contracts — never from caller-supplied command context, which is transient and not available to a passive `EventBus` subscriber.

## Deferred Concepts

- Per-Engineering-Session governance projection; per-Workflow-Step governance projection (removed from this Sprint's scope by `NEXUS-RAT-2026-07-16-016`).
- Workflow-position attribution in Governance events or in `GovernanceDecision`.
- Host or Adapter governance surfacing — any UI, command, or presentation of the projection. No `src/hosts` or `src/adapters` file may be modified.
- `MissionPaused`/`MissionResumed` lifecycle correction (long-standing, tracked since Sprint 4; remains out of scope).
- Recovery-aware Mission completion attribution bridging.
- Event-Driven Workflow Coordination (Milestone 10 Step 2) — using the projection to invoke advancement/completion authorities. This Sprint builds the read model only; it does not act on it.
- Recovery Workflow Automation (Milestone 10 Step 3).
- Autonomous Engineering Integration Validation (Milestone 10 Step 4).
- Autonomous planning, autonomous ratification, and AI architectural/governance deliberation of any kind.
- Unrestricted or general-purpose workflow mutation.
- A general-purpose, independent event-subscription/consumer framework decoupled from this one projection's concrete needs.

Any future Workflow-position projection SHALL require its own RFC ownership analysis and a dedicated Sprint Owner ratification.

## Architectural Constraints (binding)

- The projection SHALL NOT mutate `Mission`, `MissionPlan`, `Task`, `GovernanceDecision`, `RecoveryRequirement`, `EngineeringSession`, `WorkflowChain`, or any other existing aggregate or repository. It is read-only in every direction.
- The projection SHALL be built exclusively from the existing `EventBusContract` and existing, unmodified Domain Event types. No existing event producer, envelope, or event type may be changed.
- The projection SHALL NOT infer Engineering Session or Workflow Step identity from any source, and SHALL NOT reuse transient caller-supplied command context (per `NEXUS-RAT-2026-07-16-016`).
- The event-subscription mechanism SHALL be scoped to the minimum required for this projection. Do not build a generic, reusable subscription registry, dispatcher, or framework "for future use" — Governance Rule (Sprint 13/`NEXUS-RAT-2026-07-13-004`): capability is added when a concrete consumer requires it, not speculatively.
- Idempotent, deterministic updates: replaying the same event stream SHALL produce the same projection state (mirrors the Sprint 62 idempotency requirement already proven for `GovernanceDecision`/`RecoveryRequirement` production).
- No `src/hosts` or `src/adapters` file may be modified.
- No RFC may be amended.

## Required Test Matrix

1. Projection correctly reflects an Approved `GovernanceDecision` (Non-Blocking) for a Mission.
2. Projection correctly reflects a Rejected `GovernanceDecision` (Blocking) and the resulting `RecoveryRequirementCreated`.
3. Projection transitions correctly on `RecoveryRequirementResolved` (Blocking → no-longer-blocking, mirroring existing Sprint 60 rules at the Mission level) and on `RecoveryRequirementWithdrawn`.
4. Projection is Mission-scoped: events attributed to a different Mission do not affect another Mission's projection.
5. Replaying an identical event sequence produces an identical projection (idempotency/determinism).
6. Projection retrieval for a Mission with no governance events yet returns a well-defined empty/initial state, not an error.
7. A source-level or `git diff`-style check confirming no `src/hosts` or `src/adapters` file, and no existing Sprint 1–62 production contract, is modified (per the established Sprint 62 convention — use forward-slash pathspecs).

## Acceptance Criteria

- All Required Test Matrix items pass.
- `git diff --stat -- src/hosts src/adapters` is empty.
- No existing RFC, the Kernel Canon, or any prior Ratification is modified.
- Repository-wide validation passes: TypeScript compile (`tsc --noEmit`), ESLint, full Vitest suite, esbuild, extension-host bundle build.
- `IMPLEMENTATION_REPORT.md` documents implemented capability, referenced RFCs, assumptions, limitations, and explicitly states "No architectural deviations" (or names any deviation, per `IMPLEMENTATION_CONSTITUTION.md`).

## Builder Responsibilities

- Implement exactly the Authorized Concepts above; do not implement any Deferred Concept, including as a placeholder or stub.
- Follow existing Kernel conventions for aggregates/read-models, repository contracts, in-memory repositories, and thin application services (see Sprint 56/59's event-publication pattern as the closest precedent for consuming/reacting to events).
- Update `IMPLEMENTATION_REPORT.md` and `builder-task.md` per standard convention upon completion.
- Report full validation pipeline results (compile, lint, test, build) in the completion report.

## Documentation Requirements

- Sprint Implementation Record (this document) — Builder Results section to be completed by the Builder.
- `IMPLEMENTATION_REPORT.md` update.
- `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md` Sprint 63 status update upon completion (Reviewer/Builder handoff synchronization per established convention).

## Known Limitations (anticipated; to be confirmed by Builder Results)

- The projection is a disposable read model, not a source of engineering truth — `GovernanceDecision` and `RecoveryRequirement` remain the authoritative aggregates, exactly as Shared Reality (Sprint 6) is disposable relative to Evidence.
- No workflow action is taken based on the projection in this Sprint; consumption remains manual/external until Milestone 10 Step 2.

---

## Revision History

### Cycle 1 — Blocked (superseded by Cycle 2 below)

No implementation was submitted. The Builder identified, before writing any code, that the original Objective ("reports the latest `GovernanceDecision` outcome per Workflow position") could not be satisfied by a passive `EventBus` subscriber: `GovernanceDecisionRecorded` carries only `missionId`/`governanceDecisionId`, and existing consumers obtain Workflow-Step attribution exclusively from caller-supplied command context, never from the event stream. The Builder correctly stopped and reported the blocker rather than guessing, per `IMPLEMENTATION_CONSTITUTION.md`'s Documentation Before Code rule.

**Reviewer Notes (Cycle 1):** See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-16-015` for the complete review. Independently verified in source (`governance.events.ts`, `governance-decision.ts`, `governance-gated-workflow-advancement.consumer.ts`, `recovery-requirement-governance-decision.consumer.ts`) that the Builder's blocking claim was accurate: no authorized data source could deterministically supply Workflow-Step attribution for this projection. Root cause: this Sprint's own Objective and Required Test Matrix item 1, as originally drafted by `nexus-plan`, required per-Workflow-Step granularity that `NEXUS-RAT-2026-07-16-015`'s actual binding text did not itself demand. One Category 5 — Governance Decision Required finding recorded (`NEXUS-REV-2026-07-16-015-F-001`).

**Final Disposition (Cycle 1):** BLOCKED — Governance Decision Required. Resolved by the Sprint Owner's decision below.

### Cycle 2 — Narrowed and reactivated

The Sprint Owner reviewed `NEXUS-REV-2026-07-16-015-F-001` and issued `NEXUS-RAT-2026-07-16-016`, narrowing this Sprint's Objective to Mission-scoped-only governance state reporting (no Engineering-Session or Workflow-Step attribution of any kind) and explicitly prohibiting any inference of that attribution, any event/aggregate modification, and any reuse of transient caller context inside the projection. The Objective, Implemented Concepts, Deferred Concepts, Architectural Constraints, and Required Test Matrix sections above have been revised in place to reflect `NEXUS-RAT-2026-07-16-016`'s binding text directly. Sprint 63 proceeded under this narrowed implementation-ready scope.

## Builder Results

Implemented the Cycle 2 narrowed Mission-scoped-only scope.

- Added immutable `GovernanceStateProjection` read model snapshots under `src/kernel/governance/`.
- Added `IGovernanceStateProjectionRepository` and `InMemoryGovernanceStateProjectionRepository`.
- Added `GovernanceStateProjectionService` with concrete subscriptions to exactly `GovernanceDecisionRecorded`, `RecoveryRequirementCreated`, `RecoveryRequirementResolved`, and `RecoveryRequirementWithdrawn`.
- Wired `createKernelServices()` so the projection service subscribes to the shared Kernel `EventBusContract`.
- Added `test/kernel/governance/governance-state-projection.test.ts` covering all Required Test Matrix items, including Mission scoping, deterministic replay/idempotency, empty initial state, and Host/Adapter drift protection.
- Updated Kernel boundary certification for the newly composed service and updated the Sprint 62 drift guard to ignore only the explicitly authorized Sprint 63 production files while still guarding `src/hosts` and `src/adapters`.

Validation passed:

- `npm run compile`
- `npm run lint`
- `npm run test` — 86 files, 551 tests
- `npm run build`
- `npm run test:extension-host:build`

No architectural deviations.

## Reviewer Notes

See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-16-016` for the complete review. Independently verified in source that every field the projection reads from `GovernanceDecisionRecorded` and the Recovery Requirement events matches the actual, unmodified event payloads; confirmed `RecoveryRequirement` events do carry `engineeringSessionId`/`workflowStepId` in their payload but the projection correctly never reads or stores them, honoring the Ratification's explicit prohibition. Confirmed `governance.events.ts`, `governance-decision.ts`, `recovery-requirement.ts`, `recovery-requirement.events.ts`, `event-bus-contract.ts`, and `event-bus.ts` are all byte-for-byte unmodified. Confirmed no `src/hosts` or `src/adapters` file changed, and confirmed the Sprint 62 drift guard was correctly updated to allowlist only the new Sprint 63 files. Independently re-ran the full validation pipeline (`tsc --noEmit`, ESLint, Vitest 86 files/551 tests, `npm run build`, `npm run test:extension-host:build`) — all pass, matching the Builder's reported counts. Zero findings of any blocking category; two Category 6, Informational Observations recorded (replay/subscription redundancy; unexercised diagnostic fields), neither generating a Builder Task.

## Final Disposition

**Approved.** Sprint 63 is fully closed with zero open findings of any blocking category. See `NEXUS-REV-2026-07-16-016`.
