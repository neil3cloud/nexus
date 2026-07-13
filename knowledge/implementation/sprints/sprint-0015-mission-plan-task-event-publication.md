# Sprint 15 — Mission Plan & Task Event Publication

## Sprint Status

Approved (NEXUS-REV-2026-07-13-011; TASK-001 remediation verified by NEXUS-REV-2026-07-13-012; TASK-002 remediation verified by NEXUS-REV-2026-07-13-013, authorized by NEXUS-RAT-2026-07-13-007 — review cycle complete with no open findings)

## Sprint Objective

Complete Kernel-owned Domain Event publication by extending the established save-then-publish pattern (`Mission`: Sprint 2; `Evidence`/`Review`: Sprint 11; `Knowledge`: Sprint 13/14) to the `MissionPlan` and `Task` aggregates. This sprint publishes events for previously implemented lifecycle operations only. No new domain behavior, lifecycle semantics, or aggregate business rules are introduced.

## Governance Constraint (Sprint Owner, pre-implementation)

This sprint implements event publication for existing, approved `MissionPlan`/`Task` lifecycle operations only. It SHALL NOT redefine, extend, or reinterpret `MissionPlan` or `Task` business rules. Concretely:

- Sprint 3's approved `TaskStatus` enum (`Planned → Ready → InProgress → Completed`, alternative `Cancelled`) and its transition rules (`src/kernel/mission/task.ts`) SHALL NOT be modified, renamed, or expanded. No new Task state is introduced.
- Sprint 3's approved `MissionPlan` aggregate SHALL NOT gain a status/Draft/Active/Superseded field or an activation operation. `MissionPlanActivated` publication is explicitly out of scope, not merely deferred as event-silent.
- No new lifecycle transition, precondition, or validation rule is authorized on `MissionPlan`, `Task`, `MissionPlanningService`, or `MissionExecutionService` beyond adding recorded-events infrastructure and publication calls.
- Events SHALL be published only after the associated state transition has been successfully persisted, matching the Mission/Evidence/Review/Knowledge save-then-publish pattern exactly. No event subscription, consumer, or handler is authorized anywhere in the Kernel.

## RFC Coverage

- RFC-0005 — Domain Event Model (Partial, extending the Sprint 11/13 pattern)
- RFC-0001 — Mission Model (Referenced — existing lifecycle operations only; Mission lifecycle semantics unchanged)

## Ratification References

- NEXUS-RAT-2026-07-13-006 — ratifies Sprint 3's `TaskStatus` as implementation-layer operational lifecycle vocabulary distinct from RFC-0004's normative Execution State (mirroring `ReviewStatus`/`FindingStatus` under NEXUS-RAT-2026-07-12-006); corrects `kernel-state-machine.md`'s Task Lifecycle to describe the approved `TaskStatus` reality; reattributes Mission Plan/Task Domain Event producers to `MissionPlanningService` (`MissionPlanCreated`, `MissionPlanRevised`, `TaskCreated`) and `MissionExecutionService` (`TaskStarted`, `TaskCompleted`, `TaskCancelled`); resolves a pre-existing `kernel-event-catalog.md` duplication (legacy `# Mission Events` section's `MissionPlanRevised`/`TaskAdded` entries, and a redundant `MissionPlanSuperseded` entry that duplicated the same fact `kernel-state-machine.md`'s own transition table already names `MissionPlanRevised`); defers `MissionPlanActivated` because no implementing operation exists. RFC-0004, RFC-0005, and the Kernel Canon are unmodified. Sprint 3 and Sprint 4 are not reopened.

## Event Reconciliation Table (per NEXUS-RAT-2026-07-13-006)

| Producer Service | Operation | Event | Status |
| --- | --- | --- | --- |
| `MissionPlanningService` | `createMissionPlan` | `MissionPlanCreated` | Authorized this slice |
| `MissionPlanningService` | `reviseMissionPlan` | `MissionPlanRevised` | Authorized this slice |
| `MissionPlanningService` | `addTask` | `TaskCreated` | Authorized this slice |
| `MissionExecutionService` | `startTask` | `TaskStarted` | Authorized this slice |
| `MissionExecutionService` | `completeTask` | `TaskCompleted` | Authorized this slice |
| `MissionExecutionService` | `cancelTask` | `TaskCancelled` | Authorized this slice |
| *(none — no operation exists)* | *(none)* | `MissionPlanActivated` | Deferred — no implementing operation |
| *(Task Coordinator — unimplemented)* | *(none)* | `TaskReady` | Deferred |
| *(Execution Strategy — unimplemented)* | *(none)* | `TaskAssigned` | Deferred |
| *(Execution Strategy — unimplemented)* | *(none)* | `TaskBlocked` | Deferred |

`MissionPlanningService.updateTask` and `MissionPlanningService.removeTask` are existing operations with no cataloged corresponding event (`kernel-event-catalog.md` § Task Events lists no `TaskUpdated`/`TaskRemoved` entry aligned with the canonical `# Task Events` section — the legacy `# Mission Events` section's `TaskRemoved` entry is part of the same pre-existing duplication problem as `TaskAdded`, but NEXUS-RAT-2026-07-13-006 did not authorize a producer-role table entry for it). No event is published for `updateTask` or `removeTask` this slice; if this gap should be closed, it requires a future ratification, not an assumption made during implementation.

## Implemented Concepts (Planned)

- `MissionPlanningService` gains an optional constructor-injected `EventBusContract` parameter with a `requireEventBus()` guard, matching the `EvidenceService`/`ReviewService`/`KnowledgeService` pattern (Sprint 11/13). This is a new addition — `MissionPlanningService`'s constructor currently has no `eventBus` parameter at all.
- `MissionExecutionService`'s existing **required** `EventBusContract` constructor parameter (Sprint 4 baseline, already wired and already used to publish `Mission`-level events via `publishRecordedEvents(mission)`) is *not* changed in shape. This sprint adds publication calls to `startTask`/`completeTask`/`cancelTask` using the already-existing `eventBus` field — it does not add optionality where a required parameter already exists and is already exercised.
- `MissionPlan` and `Task` aggregates each gain a private `recordedEvents` collection and a drain-once `pullDomainEvents()` accessor, mirroring `Mission`'s established pattern (`src/kernel/mission/mission.aggregate.ts:26,131-134,164`) exactly. Neither aggregate currently has any recorded-events infrastructure.
- New `mission-planning.events.ts` (or equivalently named new file — Builder's choice of filename, following the `evidence.events.ts`/`review.events.ts`/`knowledge.events.ts` naming convention) defines a `MissionPlanEventType` union (`MissionPlanCreated`, `MissionPlanRevised`, `TaskCreated`) and a `MissionPlanDomainEvent` type, with factory functions mirroring `mission.events.ts`'s `createMissionCreatedEvent`/`createMissionLifecycleEvent` shape.
- New `mission-execution.events.ts` (or equivalently named new file) defines a `TaskEventType` union (`TaskStarted`, `TaskCompleted`, `TaskCancelled`) and a `TaskDomainEvent` type, with corresponding factory functions.
- `MissionPlanningService.createMissionPlan`, `.reviseMissionPlan`, and `.addTask` publish `MissionPlanCreated`, `MissionPlanRevised`, and `TaskCreated` respectively, only after the corresponding `repository.saveMissionPlan(...)` call succeeds.
- `MissionExecutionService.startTask`, `.completeTask`, and `.cancelTask` publish `TaskStarted`, `TaskCompleted`, and `TaskCancelled` respectively, only after the corresponding `repository.saveMissionPlan(missionPlan)` call succeeds (these currently call `saveMissionPlan` but never call `publishRecordedEvents`; this sprint adds that call for the Task-level events pulled from `MissionPlan`/`Task`, without altering the Mission-level `publishRecordedEvents(mission)` calls already present in `startMission`/`completeMission`/`failMission`/`cancelMission`).
- `kernel-state-machine.md` § Task Lifecycle corrected to describe the approved Sprint 3 `TaskStatus` state set and transitions.
- `kernel-event-catalog.md` corrected per the reconciliation table above: producer reattribution, removal of the legacy `# Mission Events` section's duplicate `MissionPlanRevised`/`TaskAdded` entries, removal of the redundant `MissionPlanSuperseded` entry, and `MissionPlanActivated` marked as a deferred/no-operation-exists note rather than an actively-cataloged producer.

## Deferred Concepts

- `MissionPlanActivated` — no implemented operation exists; deferred until a future sprint introduces Mission Plan status/activation as its own vertical slice.
- `TaskReady` (Task Coordinator), `TaskAssigned` (Execution Strategy), `TaskBlocked` (Execution Strategy) — producer roles unimplemented.
- `TaskUpdated`/`TaskRemoved`-equivalent events for `MissionPlanningService.updateTask`/`.removeTask` — no ratified event name exists for these operations; not introduced by assumption.
- Event subscriptions/consumers — this slice adds producers only.
- Knowledge, Shared Reality, Context Package, and Policy Events.
- Durable/persistent Event Streams.
- `Mission`'s existing frozen `MissionEventType` union's unused `MissionPlanRevised`/`TaskAdded`/`TaskCompleted`/`TaskRemoved` entries (`mission.events.ts`) — pre-Sprint-3 dead enum members, never constructed anywhere in `mission.aggregate.ts`. Out of scope; not modified by this sprint. New Mission Plan/Task events live on new, separate type unions.

## Acceptance Criteria

- `MissionPlanningService` gains an optional constructor-injected `EventBusContract`, matching the established optional-injection pattern.
- `MissionExecutionService`'s existing required `EventBusContract` parameter is unchanged in shape; only new publication calls are added.
- `MissionPlan` and `Task` each gain recorded-events/`pullDomainEvents()` infrastructure mirroring `Mission`'s exactly.
- Exactly six events are published this slice: `MissionPlanCreated`, `MissionPlanRevised`, `TaskCreated`, `TaskStarted`, `TaskCompleted`, `TaskCancelled`.
- No event is published for `MissionPlanActivated`, `TaskReady`, `TaskAssigned`, `TaskBlocked`, or any `updateTask`/`removeTask`-triggered event.
- Publication occurs only after the associated state transition has been successfully persisted; if persistence fails, no event is published.
- No existing `MissionPlan`, `Task`, `MissionPlanningService`, or `MissionExecutionService` business rule, validation, or lifecycle transition is modified.
- `mission.aggregate.ts` and `mission.events.ts` are not modified by this sprint (Sprint 2 baseline remains frozen).
- `kernel-state-machine.md` and `kernel-event-catalog.md` are corrected exactly as authorized by NEXUS-RAT-2026-07-13-006 — no other Reference Document is modified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, and esbuild.
- Unit tests cover: `MissionPlan`/`Task` event recording and `pullDomainEvents()`; service-level publication for all six events; publication-only-after-successful-persistence (including a persistence-failure case per event, mirroring the `FailingSaveKnowledgeRepository`-style pattern used in Sprint 13/14); deterministic publication (equivalent operations produce equivalent events apart from identity fields).

## Builder Responsibilities

- Read, in order: `IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md` § Sprint 15, `IMPLEMENTATION_MANIFEST.md` § Sprint 15, `knowledge/canon/nexus-kernel-canon.md`, RFC-0005, RFC-0001, `knowledge/reference/kernel-event-catalog.md` § Mission Plan Events / Task Events (post-correction), `knowledge/reference/kernel-state-machine.md` § Task Lifecycle (post-correction), `src/kernel/mission/mission.aggregate.ts` and `src/kernel/mission/mission.events.ts` (the pattern to mirror, not to modify), `src/kernel/mission/mission-plan.aggregate.ts`, `src/kernel/mission/task.ts`, `src/kernel/mission/mission-planning.service.ts`, `src/kernel/mission/mission-execution.service.ts` (Sprint 3/4 baseline being extended), `knowledge/governance/RATIFICATION_LEDGER.md` entry NEXUS-RAT-2026-07-13-006, `knowledge/implementation/implementation-technology-standard.md`, `knowledge/implementation/implementation-conventions.md`.
- Implement only the concepts listed under Implemented Concepts (Planned) above.
- Preserve every Deferred Concept without approximation. Do not invent `MissionPlanActivated`, Task readiness/assignment/blocking events, or `updateTask`/`removeTask` events to make the domain appear more complete than ratified.
- Do not modify `Mission`, `mission.aggregate.ts`, `mission.events.ts`, `MissionService`, `EvidenceService`, `ReviewService`, `KnowledgeService`, `ExecutionStrategyService`, or any other Sprint 1–14 domain file except where strictly required for shared Kernel-wiring changes (e.g. `create-kernel-services.ts` passing the shared `EventBusContract` to `MissionPlanningService`).
- Do not modify `TaskStatus`'s transition rules or `MissionPlan`'s existing structure beyond adding the recorded-events collection and `pullDomainEvents()` accessor.
- Report any additional undocumented concept, terminology gap, or specification conflict rather than guessing; stop and request ratification if one is found — in particular, do not silently decide the `updateTask`/`removeTask` event-naming gap; leave it deferred and report it.
- Produce the Sprint 15 section of `IMPLEMENTATION_REPORT.md` upon completion.
- Populate the Test Summary section of this record upon completion.

## Documentation Requirements

- Update `IMPLEMENTATION_REPORT.md` with a Sprint 15 section upon completion, following the format used by Sprints 4–14.
- Do not modify RFC-0001, RFC-0004, RFC-0005, or the Kernel Canon under any circumstance.
- Apply exactly the documentation corrections authorized by NEXUS-RAT-2026-07-13-006 (`kernel-state-machine.md`, `kernel-event-catalog.md`). Do not introduce any other Reference Document change without a new ratification, even if additional drift is discovered — report it instead.

## Known Limitations

- Repository/EventBus persistence is in-memory and process-local, consistent with every other Sprint 1–14 domain.
- Save-then-publish for `MissionPlan`/`Task` events follows the same non-atomic pattern already disclosed for Mission (Sprint 2) and Evidence/Review (Sprint 11); this sprint does not resolve that limitation.
- No event consumers are added; nothing in the Kernel currently subscribes to Mission Plan or Task events.
- `updateTask` and `removeTask` remain event-silent; no ratified event name exists for either operation.
- `MissionPlanActivated` remains unpublishable; `MissionPlan` has no status field distinguishing Draft/Active/Superseded.

## Builder Results

Implemented the Sprint 15 Mission Plan & Task Event Publication vertical slice.

Completed Builder-owned scope:

- Added `mission-planning.events.ts` with `MissionPlanCreated`, `MissionPlanRevised`, and `TaskCreated` event factories.
- Added `mission-execution.events.ts` with `TaskStarted`, `TaskCompleted`, and `TaskCancelled` event factories.
- Added recorded-events collections and drain-once `pullDomainEvents()` accessors to `MissionPlan` and `Task`.
- Wired `MissionPlanningService.createMissionPlan`, `.addTask`, and `.reviseMissionPlan` to publish only their authorized events after successful `saveMissionPlan`.
- Wired `MissionExecutionService.startTask`, `.completeTask`, and `.cancelTask` to publish only their authorized Task events after successful `saveMissionPlan`.
- Injected the shared Kernel `EventBusContract` into `MissionPlanningService` from Kernel service composition.
- Reconciled `kernel-state-machine.md` Task Lifecycle to the frozen implementation `TaskStatus` state set without modifying `TaskStatus`.
- Reconciled `kernel-event-catalog.md` producer attribution and duplicate Mission Plan/Task event entries per NEXUS-RAT-2026-07-13-006.

Preserved scope restrictions:

- `mission.aggregate.ts`, `mission.events.ts`, `MissionService`, Evidence, Review, Knowledge, and Execution Strategy domain behavior were not modified.
- `TaskStatus` values and transition rules were not modified.
- `MissionPlan` did not gain status, activation, Draft/Active/Superseded lifecycle, or `MissionPlanActivated` publication.
- No events were introduced for `updateTask`, `removeTask`, `TaskReady`, `TaskAssigned`, or `TaskBlocked`.
- No event subscriptions, consumers, handlers, or durable event streams were introduced.

## Test Summary

- Targeted Sprint 15 Mission tests passed: 4 files, 39 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 32 files, 199 tests.

## Reviewer Notes

**Status**

PASS WITH FINDINGS

## Review Summary

Reviewed against NEXUS-RAT-2026-07-13-006, RFC-0005, and the established Mission/Evidence/Review/Knowledge save-then-publish precedent. `MissionPlan` and `Task` correctly gained recorded-events/`pullDomainEvents()` infrastructure mirroring `Mission`'s exactly; `MissionPlanningService` and `MissionExecutionService` publish exactly the six authorized events, only after successful persistence, with `updateTask`/`removeTask` correctly left event-silent. `mission.aggregate.ts` and `mission.events.ts` (Sprint 2 baseline) are confirmed unmodified; `TaskStatus`'s values and transition rules are confirmed unmodified. Independent re-validation confirms: TypeScript compiles cleanly, ESLint is clean, esbuild builds successfully, and Vitest passes 32 files / 199 tests, matching this record's Test Summary.

Two Minor Category 4 (Documentation Drift) findings were raised, both non-blocking:

- **NEXUS-REV-2026-07-13-011-F-001:** NEXUS-RAT-2026-07-13-006 and this record's planning-authored sections misstate the approved Sprint 3 `TaskStatus` initial state as `Pending`; the actual frozen value is `Planned` (`src/kernel/mission/mission-planning.types.ts:1-7`). The Builder correctly identified and used the real value when correcting `kernel-state-machine.md`, diverging from the ratification's inaccurate prose — the correct outcome, not a defect.
- **NEXUS-REV-2026-07-13-011-F-002:** A residual duplicate `TaskCompleted`/`TaskRemoved` pair remains under `kernel-event-catalog.md`'s legacy `# Mission Events` section, the same duplication class NEXUS-RAT-2026-07-13-006 resolved for `MissionPlanRevised`/`TaskAdded` but did not name for removal. Correctly left untouched by the Builder as out of authorized scope.

See REVIEW_HISTORY.md § NEXUS-REV-2026-07-13-011 for full finding detail and evidence.

## Required Actions

**F-001 — RESOLVED.** Verified by NEXUS-REV-2026-07-13-012: the record's planning-authored sections now correctly state `Planned` as the Sprint 3 `TaskStatus` initial state. `RATIFICATION_LEDGER.md` was correctly left unmodified per TASK-001's explicit scope restriction.

**F-002 — RESOLVED.** Verified by NEXUS-REV-2026-07-13-013: NEXUS-RAT-2026-07-13-007 authorized removal of the legacy `# Mission Events` `TaskCompleted` duplicate and retention (relocated, marked `Deferred`) of `TaskRemoved` under `# Task Events`. `kernel-event-catalog.md` now contains exactly one `TaskCompleted` entry (Producer: `MissionExecutionService`) and one `TaskRemoved` entry (`Deferred`, unpublished); no other file was modified.

Both findings from NEXUS-REV-2026-07-13-011 are now resolved. No open findings remain.

## Final Disposition

**APPROVED.** No architectural violations detected. F-001 and F-002 (both Minor, Category 4) are resolved and verified by NEXUS-REV-2026-07-13-012 and NEXUS-REV-2026-07-13-013 respectively. Sprint 15's review cycle is complete with no open findings; approved as the clean Sprint 15 implementation baseline.

Date: 2026-07-13 (original); remediation verified 2026-07-13 (TASK-001) and 2026-07-13 (TASK-002)

Reviewer: Reviewer AI (Claude Code)

Review Reference: NEXUS-REV-2026-07-13-011; NEXUS-REV-2026-07-13-012 (TASK-001 remediation verification); NEXUS-REV-2026-07-13-013 (TASK-002 remediation verification)
