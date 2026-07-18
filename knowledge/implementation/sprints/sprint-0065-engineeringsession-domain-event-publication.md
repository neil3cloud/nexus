# Sprint 65 — EngineeringSession Domain Event Publication

## Status

✅ Approved — `NEXUS-REV-2026-07-17-001` (Cycle 2, revised scope; fully closed with zero open findings of any blocking category; one Category 6, Informational Observation, no Builder Task).

## Milestone

Milestone 10 — Autonomous Engineering Readiness. Prerequisite foundation for Step 2's remainder (Event-Driven Workflow Advancement) and Step 3 (Recovery Workflow Automation), authorized by `NEXUS-RAT-2026-07-16-018`.

## Ratification

- `NEXUS-RAT-2026-07-16-015` — opens Milestone 10; binding Objective, Architectural Boundary, and Initial Capability Sequence (unmodified by this Sprint).
- `NEXUS-RAT-2026-07-16-016` — Sprint 63 `GovernanceStateProjection` Mission-scoped-only scope (frozen, unaffected).
- `NEXUS-RAT-2026-07-16-017` — Sprint 64 Event-Driven Mission Completion scope (frozen, unaffected).
- `NEXUS-RAT-2026-07-16-018` — resolves the Event-Driven Workflow Advancement/Recovery Workflow Automation session-attribution gap and authorizes this Sprint.
- `NEXUS-RAT-2026-07-16-019` — **binding, supersedes this record's original Canonical Events/Authorized Operations.** Revises Sprint 65 following a Builder block: Mission attribution SHALL be resolved exclusively through the existing Mission Engineering Group association via one new read-only reverse-lookup query; `EngineeringSessionCreated` is deferred from Sprint 65 entirely. See `knowledge/governance/RATIFICATION_LEDGER.md` § `NEXUS-RAT-2026-07-16-018` and § `NEXUS-RAT-2026-07-16-019` for the full binding text.

## Objective

Extend the established Kernel Domain Event publication pattern to `EngineeringSession`. Sprint 65 SHALL publish the first authoritative Engineering Session event — `EngineeringSessionWorkflowAdvanced` — using Mission attribution resolved from the existing, RFC-0004-owned Mission Engineering Group association, establishing the event stream required for a future Session State Projection and future Event-Driven Workflow Consumers. It SHALL NOT introduce event consumers, projections, workflow automation, or new Engineering Session behavior, and SHALL NOT publish an Engineering Session creation event until an authoritative Mission association exists at creation time (deferred, per `NEXUS-RAT-2026-07-16-019`).

## Architectural Intent

`EngineeringSession` currently owns mutable Workflow position state but publishes no Domain Events, creating a visibility gap where consumers must inspect or infer current state rather than observe an authoritative event.

Sprint 65 closes that gap by having the aggregate record a Domain Event on successful state transitions, with the event published only after the transition has persisted — the same persistence-first, save-then-publish model already established for `Mission`/`Evidence`/`Review`/`Knowledge`/`MissionPlan`/`Task`. That model remains unchanged.

## RFC Coverage

- RFC-0005 — Domain Event Model (Partial). Extends the existing publication pattern to a new aggregate.
- RFC-0004 v1.13 — Execution Model (Referenced). Existing `EngineeringSession` and Workflow Advancement behavior is consumed but SHALL NOT be amended or redefined.

No RFC is amended by this Sprint.

## Authorized Vertical Slice

### 1. EngineeringSession Event Recording

`EngineeringSession` SHALL gain:

- a private recorded Domain Event collection;
- `pullDomainEvents()` consistent with the existing aggregate publication pattern;
- deterministic event recording after successful state transitions only.

`pullDomainEvents()` SHALL:

- return all currently recorded events in recording order;
- clear the aggregate's internal event collection after retrieval;
- return an empty collection when no events are pending;
- prevent the same recorded event from being published twice through repeated pulls.

No events SHALL be recorded during aggregate rehydration.

### 2. EngineeringSessionService EventBus Integration

`EngineeringSessionService` SHALL receive an optional constructor-injected `EventBusContract`, using the existing repository convention and `requireEventBus()` guard pattern already established by previously approved Domain Event publication slices.

The service SHALL follow: Aggregate transition → Persist successfully → Pull recorded Domain Events → Publish each event in recorded order.

The service SHALL NOT publish an event before persistence succeeds, and SHALL NOT publish an event when: validation fails; a lifecycle transition is rejected; repository persistence fails; no state transition occurred; or an operation returns an already-existing idempotent result without producing a new transition.

## Canonical Events (exactly one authorized this Sprint, per `NEXUS-RAT-2026-07-16-019`)

### EngineeringSessionCreated — DEFERRED FROM SPRINT 65

`EngineeringSessionCreated` cannot truthfully include authoritative `missionId` at Engineering Session creation time because Mission association is currently established through a separate operation (`associateEngineeringSessionWithMission`) after creation. Sprint 65 SHALL NOT fabricate or prematurely assert that association. `createEngineeringSession` remains behaviorally unchanged and SHALL NOT publish a Mission-attributed Domain Event in Sprint 65. A future Sprint MAY introduce an authoritative Mission-association event (for example `EngineeringSessionAssociatedWithMission`, published by the Mission Engineering Group owner) or a future RFC amendment MAY authorize an atomic create-and-associate use case; neither is authorized now.

### EngineeringSessionWorkflowAdvanced

Published exactly once after successful Workflow position advancement, and only once the authoritative Mission association resolves.

Before publishing, `EngineeringSessionService` SHALL resolve the authoritative Mission association through the approved read-only Mission Engineering Group reverse-lookup query (see "Mission Engineering Group Reverse Lookup" below). Publication SHALL occur only when: (1) Workflow advancement succeeds; (2) Engineering Session persistence succeeds; (3) exactly one authoritative Mission association is resolved. If Mission attribution is missing or ambiguous, the operation SHALL fail closed — no Domain Event SHALL be published, and no caller-supplied fallback SHALL be used.

Includes: authoritative `missionId` (Mission Engineering Group-resolved, never caller-supplied), `engineeringSessionId`, previous `workflowStepId`, new `workflowStepId`, advancement strategy, plus every field and metadata requirement of the existing `DomainEvent` contract.

**Canonical Advancement Strategy Values** — a closed implementation vocabulary equivalent to: `Direct`, `Trigger`, `ReviewGated`, `GovernanceGated`. The exact representation MAY use the repository's existing enum, union, or value-object convention. Free-form strategy strings SHALL NOT be introduced.

**Equivalent Transition Rule** — all successful advancement paths SHALL produce the same canonical event type, with the triggering strategy represented as event data. Separate event types per advancement method SHALL NOT be introduced. Equivalent Workflow transitions SHALL remain structurally equivalent regardless of which approved advancement strategy initiated them.

## Mission Engineering Group Reverse Lookup (authorized, binding per `NEXUS-RAT-2026-07-16-019`)

Sprint 65 is authorized to introduce exactly one read-only reverse-association query within the existing Mission Engineering Group ownership boundary (`mission-engineering-orchestration.contract.ts`/`.repository.ts`/`.service.ts`), resolving `EngineeringSessionId → MissionId`. The exact method name is an implementation detail; its semantics SHALL be:

- read-only; deterministic;
- owned by the existing Mission Engineering Group capability — SHALL NOT be added to `EngineeringSession`, `EngineeringSessionService`, or `EngineeringSessionRepository`;
- return exactly one associated Mission identity;
- fail (throw a deterministic diagnostic) when no association exists for the given `EngineeringSessionId`;
- fail (throw a deterministic diagnostic) when the association is ambiguous — i.e. more than one Mission Engineering Group contains the same `EngineeringSessionId` (structurally possible today: `IMissionEngineeringGroupRepository` indexes groups by `missionId` only and does not prevent the same `engineeringSessionId` from being added to more than one group);
- SHALL NOT mutate any `MissionEngineeringGroup` or `EngineeringSession`;
- SHALL NOT introduce duplicate Mission state into `EngineeringSession`.

`EngineeringSessionService` gains a new constructor-injected, read-only dependency on this query (e.g. a `Pick<...>` of the Mission Engineering Group repository/service), used only to resolve `missionId` immediately before publishing `EngineeringSessionWorkflowAdvanced`.

## Authorized Service Operations

Event publication SHALL apply to the existing successful advancement operations only:

- `advanceWorkflow`
- `advanceWorkflowOnTrigger`
- `advanceWorkflowAfterReview`
- `advanceWorkflowAfterGovernanceDecision`

`createEngineeringSession` remains behaviorally unchanged and publishes no event in this Sprint. No new advancement operation is authorized. No existing operation signature SHALL change except for additive constructor injection required for `EventBusContract` and the Mission Engineering Group reverse-lookup dependency.

## Event Identity and Attribution

Every new event SHALL comply with the existing Kernel Domain Event contract, reusing existing conventions for event identity, Mission attribution, occurrence time, aggregate attribution, causation, correlation, and immutable event payloads. Sprint 65 SHALL NOT introduce a parallel event metadata model. Where the initiating operation already provides causation or correlation context, that context SHALL be preserved according to the existing event infrastructure. No attribution SHALL be inferred from Governance events or unrelated domains.

## Persistence and Publication Semantics

Mandatory ordering: Validate operation → Mutate `EngineeringSession` through existing aggregate behavior → Record Domain Event within the aggregate → Persist `EngineeringSession` → Pull recorded events → Publish through `EventBusContract`.

Events SHALL NOT be published if persistence fails. Existing aggregate state and transition semantics SHALL remain authoritative. Sprint 65 SHALL NOT introduce transactional infrastructure, an outbox, retries, durable streams, or delivery guarantees beyond the existing save-then-publish contract.

## Failure and Rejection Semantics

No Domain Event SHALL be emitted for: rejected Workflow advancement; invalid Workflow state; invalid Review outcome; non-approved Governance Decision; missing Workflow step; invalid session lifecycle transition; failed repository persistence; or any operation that leaves the Engineering Session unchanged.

A failed or rejected operation SHALL leave no pending event inside the aggregate. Tests SHALL prove that failed operations do not leak events into later successful operations.

## Aggregate Rehydration

Repository reconstruction of an existing `EngineeringSession` SHALL NOT emit `EngineeringSessionCreated`, `EngineeringSessionWorkflowAdvanced`, or any other Domain Event. Events represent new domain facts, not reconstruction of historical state. Any constructor, factory, or snapshot restoration path used for rehydration SHALL preserve this distinction.

## Dependencies

Sprint 65 may consume only existing, approved contracts: `EngineeringSession`, `EngineeringSessionService`, `EngineeringSessionRepository`, `EventBusContract`, `DomainEvent`, existing Workflow Advancement operations, existing Review and Governance outcome contracts as read-only advancement inputs, and — per `NEXUS-RAT-2026-07-16-019` — the existing `IMissionEngineeringGroupRepository`/`MissionEngineeringOrchestrationServiceContract` as a read-only dependency for the one authorized reverse-lookup query. No other new infrastructure dependency is authorized.

## Authorized Files and Boundaries

Implementation SHALL remain within the existing Kernel-owned `EngineeringSession` domain, the existing Mission Engineering Group files (limited to adding the one authorized read-only reverse-lookup query), and their tests.

No changes are authorized within: `GovernanceDecision`, `GovernanceDecisionRecorded`, Governance domain services, `RecoveryRequirement`, Review domain ownership, `WorkflowChain` semantics, Execution Strategy semantics, Mission Engineering Group lifecycle/mutation operations (`associateEngineeringSessionWithMission`, `recordEngineeringSessionHandoff`, and their existing semantics), Host implementations, Adapter implementations, `src/hosts`, `src/adapters`.

Composition changes required only to supply the existing `EventBusContract` and the Mission Engineering Group reverse-lookup dependency to `EngineeringSessionService` are authorized.

## Implemented Concepts (Authorized)

- `EngineeringSessionWorkflowAdvanced`
- `EngineeringSession` recorded Domain Events
- `EngineeringSession.pullDomainEvents()`
- Optional `EventBusContract` injection into `EngineeringSessionService`
- One read-only Mission Engineering Group reverse-lookup query (`EngineeringSessionId → MissionId`), fail-closed on missing or ambiguous association
- Persistence-first event publication
- Deterministic advancement-strategy attribution
- Tests and implementation documentation

## Deferred Concepts

- `EngineeringSessionCreated` (deferred from Sprint 65 per `NEXUS-RAT-2026-07-16-019`; requires an authoritative Mission association at creation time, which does not exist today)
- `EngineeringSessionAssociatedWithMission` or any other Mission-association event
- Atomic Engineering Session creation and Mission association
- Any change to Mission Engineering Group lifecycle/mutation operations beyond the one authorized read-only reverse query
- Caller-supplied Mission attribution of any kind
- Persistent `missionId` field on `EngineeringSession`
- `closeEngineeringSession` event publication
- Checkpoint events
- Recovery events beyond the existing Recovery Requirement domain
- Handoff events
- Execution-session events
- Current Workflow-step execution events
- Workflow position projection / Engineering Session state projection
- Event subscriptions / event-driven consumers
- Workflow coordination from events
- Autonomous advancement
- Projection caching, durable event streams, event replay infrastructure, event outbox, retry or delivery guarantees
- Host or Adapter event handling

These concepts require separate future Sprint authorization.

## Architectural Invariants (binding)

- Domain Events represent completed domain facts.
- Aggregate state changes precede persistence.
- Persistence precedes publication.
- Failed operations publish nothing.
- Event reconstruction is not event creation.
- All Workflow advancement strategies produce one canonical event shape.
- Event consumers SHALL NOT be introduced in the same Sprint as event publication.
- Governance, Review, Host, and Adapter boundaries remain unchanged.
- No new Engineering Session lifecycle semantics are introduced.

## Required Test Matrix

1. Direct advancement (`advanceWorkflow`) resolves exactly one Mission association and publishes `EngineeringSessionWorkflowAdvanced` with `strategy: 'Direct'` and the resolved `missionId`.
2. Trigger-based advancement (`advanceWorkflowOnTrigger`) publishes the same canonical event with `strategy: 'Trigger'`.
3. Review-gated advancement (`advanceWorkflowAfterReview`) publishes the same canonical event with `strategy: 'ReviewGated'`.
4. Governance-gated advancement (`advanceWorkflowAfterGovernanceDecision`) publishes the same canonical event with `strategy: 'GovernanceGated'`.
5. Canonical event shape is structurally identical across all four strategies (only the strategy field and step identifiers differ).
6. No Mission association exists for the advancing `EngineeringSessionId` — the operation fails closed and publishes no event.
7. Mission association is ambiguous (the same `EngineeringSessionId` present in more than one `MissionEngineeringGroup`) — the operation fails closed and publishes no event.
8. Rejected advancement (any strategy) emits no event, independent of Mission association state.
9. Persistence failure emits no event, even when Mission association would have resolved successfully.
10. The Mission Engineering Group reverse-lookup query is read-only — a call resolving `missionId` does not mutate any `MissionEngineeringGroup` or `EngineeringSession`.
11. `createEngineeringSession` publishes no Domain Event (confirms deferral of `EngineeringSessionCreated`).
12. Event ordering — `pullDomainEvents()` returns events in deterministic recording order.
13. Event draining — pulling clears recorded events.
14. Duplicate-pull prevention — repeated pulls do not return duplicates.
15. Rehydration does not emit `EngineeringSessionWorkflowAdvanced` or any other event.
16. No leaked events — a failed transition (advancement rejection, persistence failure, or Mission-resolution failure) does not leave a pending event that a later successful operation would publish.

## Acceptance Criteria

- All Required Test Matrix items pass.
- Every published `EngineeringSessionWorkflowAdvanced` contains an authoritative Mission identity resolved from Mission Engineering Group ownership; no caller-provided Mission identity is trusted as authoritative.
- Missing or ambiguous Mission association fails closed with no event published.
- `git diff --stat -- src/hosts src/adapters` is empty.
- `EngineeringSession` does not gain persistent Mission ownership (no `missionId` field added to `EngineeringSession`/`EngineeringSessionSnapshot`).
- No existing `EngineeringSession`/`EngineeringSessionService` behavior is redefined; no existing public service signature changes beyond additive constructor injection (`EventBusContract` and the Mission Engineering Group reverse-lookup dependency).
- No existing Mission Engineering Group mutation operation (`associateEngineeringSessionWithMission`, `recordEngineeringSessionHandoff`) or its existing semantics changes.
- Existing Workflow Advancement, Review, and Governance semantics remain unchanged.
- No `GovernanceDecision`, `GovernanceDecisionRecorded`, `RecoveryRequirement`, or Kernel Canon file is modified.
- No RFC is amended.
- Repository-wide validation passes: TypeScript compile (`tsc --noEmit`), ESLint, full Vitest suite, esbuild, extension-host bundle build.
- `IMPLEMENTATION_REPORT.md` documents implemented capability, referenced RFCs, assumptions, limitations, and explicitly states "No architectural deviations" (or names any deviation, per `IMPLEMENTATION_CONSTITUTION.md`).

## Builder Responsibilities

- Implement exactly the Authorized Vertical Slice above; do not implement any Deferred Concept, including as a placeholder or stub.
- Follow existing Kernel conventions for aggregate event recording and service publication (see `Mission`/`MissionService`, `Knowledge`/`KnowledgeService` as the closest structural precedents).
- Update `IMPLEMENTATION_REPORT.md` and `builder-task.md` per standard convention upon completion.
- Update `knowledge/reference/kernel-event-catalog.md` to add `EngineeringSessionWorkflowAdvanced`, per the revised one-event scope.
- Report full validation pipeline results (compile, lint, test, build) in the completion report.

The Builder SHALL stop and report rather than infer behavior when:

- the existing `DomainEvent` contract cannot represent the required attribution;
- an advancement operation does not expose enough information to identify the previous and new Workflow Steps;
- persistence ordering cannot be preserved through the current service architecture;
- an existing approved contract conflicts with this Sprint scope;
- the existing Mission Engineering Group repository cannot support deterministic reverse association without redefining ownership;
- multiple Missions can legally associate with one Engineering Session (i.e. ambiguity is found to be an intended, not merely possible, state);
- introducing the read-only reverse-lookup query conflicts with an approved RFC guarantee.

No caller-supplied or inferred Mission attribution workaround is authorized. No architectural workaround is authorized without Sprint Owner ratification.

## Documentation Requirements

- Sprint Implementation Record (this document) — Builder Results section to be completed by the Builder.
- `IMPLEMENTATION_REPORT.md` update.
- `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md` Sprint 65 status update upon completion (Reviewer/Builder handoff synchronization per established convention).
- `knowledge/reference/kernel-event-catalog.md` update for the two new event types.

## Known Limitations (anticipated; to be confirmed by Builder Results)

- `EngineeringSessionCreated` remains unpublished; an `EngineeringSession` has no observable creation event until a future Sprint resolves atomic create-and-associate or a dedicated Mission-association event.
- Session/Workflow-Step state remains unprojected until a future Session State Projection Sprint consumes this event stream.
- Event-Driven Workflow Advancement and Recovery Workflow Automation remain unimplemented until Session State Projection exists and its own future Sprint scope ratification is obtained.
- An `EngineeringSession` never associated with a Mission Engineering Group cannot advance its Workflow position in this Sprint's design — any `advanceWorkflow*` call for such a session fails closed. This is an intentional consequence of requiring authoritative Mission attribution, not a defect.

## Revision History

- Cycle 1: Original scope authorized by `NEXUS-RAT-2026-07-16-018` (two events: `EngineeringSessionCreated`, `EngineeringSessionWorkflowAdvanced`, both `missionId`-attributed). Builder stopped before implementation, reporting no authoritative `missionId` source exists on `EngineeringSession`.
- Cycle 2: Scope revised by `NEXUS-RAT-2026-07-16-019` to this record's current form — `EngineeringSessionWorkflowAdvanced` only, Mission attribution resolved via a new read-only Mission Engineering Group reverse-lookup query; `EngineeringSessionCreated` deferred.

## Builder Results

Implemented Cycle 2 revised scope.

Implemented:

- Added `EngineeringSessionWorkflowAdvanced` as the sole Sprint 65 Domain Event.
- Added `EngineeringSession` recorded Domain Events and `pullDomainEvents()` without adding persistent Mission ownership or a `missionId` snapshot field.
- Added one read-only Mission Engineering Group reverse lookup resolving `EngineeringSessionId → MissionId`, failing closed for missing or ambiguous association.
- Wired `EngineeringSessionService` to publish `EngineeringSessionWorkflowAdvanced` after successful persistence when exactly one Mission association resolves.
- Preserved `createEngineeringSession` as event-silent; `EngineeringSessionCreated` remains deferred.
- Added tests for all four advancement strategies, canonical event shape, missing/ambiguous association, persistence failure, event draining, duplicate-pull prevention, rehydration silence, and no leaked events.
- Validation passed: targeted Sprint 65 tests (95 tests), `npm run validate` (87 files / 568 tests), and `npm run test:extension-host:build`.

Deferred concepts remain deferred exactly as listed above.

No architectural deviations.

## Reviewer Notes

See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-17-001` for the complete review. Independently verified that `missionId` on `EngineeringSessionWorkflowAdvanced` is sourced exclusively from the new read-only `getMissionIdByEngineeringSessionId` reverse lookup, called before the aggregate mutates state, and that the lookup fails closed (dedicated errors) on missing or ambiguous association with no caller-supplied fallback anywhere in the code. Confirmed the Equivalent Transition Rule (one canonical event shape across all four advancement strategies), persistence-first publication (including a dedicated persistence-failure test proving no leaked/duplicated events), rehydration silence, and event draining/ordering/duplicate-pull prevention all by direct test inspection. Confirmed via `git diff --stat -- src/` that exactly the seven files authorized by this record's "Authorized Files and Boundaries" section changed, and that `git diff --stat -- src/hosts src/adapters` and `git diff --stat -- src/kernel/governance src/kernel/mission` are both empty. Independently re-ran the full validation pipeline (`tsc --noEmit`, ESLint, Vitest 87 files/568 tests, `npm run build`, `npm run test:extension-host:build`) — all pass, matching the Builder's reported counts. One Category 6, Informational Observation recorded (a benign, unobservable behavioral no-op around a redundant `repository.save()` skip on the idempotent governance-gated no-op path); it does not affect the disposition.

## Final Disposition

**Approved.** Sprint 65 (Cycle 2, revised scope) is fully closed with zero open findings of any blocking category. See `NEXUS-REV-2026-07-17-001`.
