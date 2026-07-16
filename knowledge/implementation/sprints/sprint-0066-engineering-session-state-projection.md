# Sprint 66 — Engineering Session State Projection

## Status

✅ Approved — `NEXUS-REV-2026-07-17-002` (fully closed with zero open findings of any blocking category). Authorized by `NEXUS-RAT-2026-07-17-001`.

## Milestone

Milestone 10 — Autonomous Engineering Readiness. Fulfills the Prerequisite Foundation item named by `NEXUS-RAT-2026-07-16-018` ("EngineeringSession Session State Projection"), the acknowledged blocker for Event-Driven Workflow Advancement (Step 2's remainder) and Recovery Workflow Automation (Step 3).

## Ratification

- `NEXUS-RAT-2026-07-16-015` — opens Milestone 10; binding Objective, Architectural Boundary, and Initial Capability Sequence (unmodified by this Sprint).
- `NEXUS-RAT-2026-07-16-016` — Sprint 63 `GovernanceStateProjection` Mission-scoped-only scope (frozen, unaffected; structural precedent for this Sprint).
- `NEXUS-RAT-2026-07-16-017` — Sprint 64 Event-Driven Mission Completion scope (frozen, unaffected).
- `NEXUS-RAT-2026-07-16-018` — resolves the Event-Driven Workflow Advancement/Recovery Workflow Automation session-attribution gap; names Session State Projection as the remaining Prerequisite Foundation item this Sprint fulfills.
- `NEXUS-RAT-2026-07-16-019` — Sprint 65 revised scope (frozen, unaffected); establishes that `EngineeringSessionCreated` remains deferred, which this Sprint's Known Source Limitation directly follows from.
- `NEXUS-RAT-2026-07-17-001` — **authorizes this Sprint.** Binding Objective, Known Source Limitation, Architectural Responsibilities, Authorized Scope, Deterministic Event Consumption rules, and Builder Stop Conditions below are reproduced from and governed by this ratification. See `knowledge/governance/RATIFICATION_LEDGER.md` § `NEXUS-RAT-2026-07-17-001` for the full binding text.

## Objective

Introduce a deterministic, read-only projection of observed `EngineeringSession` Workflow position changes by consuming exactly the existing `EngineeringSessionWorkflowAdvanced` event stream (Sprint 65, frozen) through the existing `EventBusContract`. The projection SHALL expose the latest observed Workflow position and advancement history for each Engineering Session. It SHALL NOT mutate Workflow state, trigger Workflow advancement, automate recovery, or infer unrecorded domain facts.

## Architectural Intent

Sprint 65 established authoritative Workflow advancement events:

```text
EngineeringSession transition
        ↓
EngineeringSessionWorkflowAdvanced
        ↓
EventBus
```

Sprint 66 introduces the corresponding read model:

```text
EngineeringSessionWorkflowAdvanced
        ↓
EngineeringSessionStateProjection
        ↓
Read-only Session state
```

The projection is derived state, not authoritative domain state. `EngineeringSession` remains the sole owner of Workflow position and advancement behavior. This mirrors the Sprint 63 `GovernanceStateProjection` precedent: a Kernel Domain Event consumer building a read model without gaining any mutation authority.

## Known Source Limitation (binding)

`EngineeringSessionCreated` remains deferred (per `NEXUS-RAT-2026-07-16-019`). Sprint 66 SHALL NOT claim to represent the initial state of an Engineering Session before its first observed advancement event. The projection SHALL distinguish between:

- no observed Workflow advancement; and
- an observed current Workflow position.

The projection MAY establish its first observed history entry using the first event's `previousWorkflowStepId` and `newWorkflowStepId`. It SHALL NOT infer creation-time Workflow state from repositories, `WorkflowChain` definitions, Mission Engineering Groups, commands, or unrelated events. A newly created Engineering Session with no advancement event MAY legitimately have no projection record. This limitation SHALL be documented explicitly in `IMPLEMENTATION_REPORT.md`.

## RFC Coverage

- RFC-0005 — Domain Event Model (Referenced). Authoritative event-consumption contract; no amendment.
- RFC-0004 v1.13 — Execution Model (Referenced). Existing `EngineeringSession` and Workflow Advancement state consumed read-only; not redefined.

No RFC is amended by this Sprint. No RFC-owned behavior is redefined.

## Authorized Vertical Slice

Sprint 66 SHALL introduce only:

- `EngineeringSessionStateProjection` (read model).
- `EngineeringSessionStateProjectionRepository` contract and in-memory implementation.
- `EngineeringSessionStateProjectionService`.
- Event subscription to exactly `EngineeringSessionWorkflowAdvanced` and deterministic projection updates.
- Additive `createKernelServices()` composition wiring.
- Tests and implementation documentation.

No mutation capability is authorized.

## Architectural Responsibilities (binding)

| Concern | Owner |
| --- | --- |
| Authoritative Workflow position, advancement behavior | `EngineeringSession`/`EngineeringSessionService` (Sprint 39/42/43/45/46/65, unmodified) |
| `EngineeringSessionWorkflowAdvanced` event contract, publication semantics | Sprint 65 (frozen, consumed unmodified) |
| Mission attribution | Copied exclusively from the consumed event; never independently resolved or re-derived |
| Observed Workflow-position read model | New `EngineeringSessionStateProjection`/`EngineeringSessionStateProjectionService` (this Sprint) |
| Event delivery, ordering, replay/subscription mechanics | Existing `EventBusContract` (Sprint 1/63, unmodified) |

## Projection Identity

Each projection SHALL be uniquely identified by `engineeringSessionId`. Each projection SHALL also preserve authoritative `missionId`, copied exclusively from `EngineeringSessionWorkflowAdvanced`. The projection SHALL NOT independently resolve or infer Mission association.

## Projection State

The projection SHALL expose, at minimum:

- `missionId`
- `engineeringSessionId`
- current observed `workflowStepId`
- previous observed `workflowStepId`
- latest advancement strategy
- ordered advancement history
- latest processed event identity
- latest event occurrence time
- projection revision or equivalent deterministic update count

The exact implementation representation MAY follow existing repository conventions (see Sprint 63's `GovernanceStateProjection` as the closest structural precedent). Projection data SHALL remain immutable to consumers.

## Advancement History

Each projected advancement history entry SHALL preserve:

- Domain Event identity
- `missionId`
- `engineeringSessionId`
- previous `workflowStepId`
- new `workflowStepId`
- advancement strategy
- occurrence time
- causation metadata, where present
- correlation metadata, where present

History SHALL preserve Domain Event order. History SHALL NOT be reconstructed from current aggregate state.

## Deterministic Event Consumption (binding)

For every accepted `EngineeringSessionWorkflowAdvanced` event, the consumer SHALL:

1. validate the event;
2. locate the existing projection by `engineeringSessionId`;
3. verify Mission attribution consistency;
4. verify Workflow continuity when a prior projection exists;
5. append exactly one advancement history entry;
6. update the current observed Workflow position;
7. persist the updated projection.

Equivalent ordered event streams SHALL produce equivalent projections.

## Workflow Continuity

When a projection already exists, `event.previousWorkflowStepId` SHALL equal `projection.currentWorkflowStepId`. A continuity mismatch SHALL fail deterministically. The consumer SHALL NOT repair the event, skip the mismatch silently, infer an intermediate transition, or overwrite the projection with contradictory state. The existing projection SHALL remain unchanged after rejection.

## First Observed Event

When no projection exists, the first valid advancement event SHALL initialize the projection using the event's `previousWorkflowStepId` as the earliest observed position and the event's `newWorkflowStepId` as the current observed position. This represents the earliest state visible from the event stream. It SHALL NOT be described as the Engineering Session's authoritative creation state.

## Mission Attribution Consistency

All events applied to one `engineeringSessionId` SHALL carry the same `missionId`. A conflicting Mission identity SHALL fail closed, produce deterministic diagnostics, and leave the existing projection unchanged. No Mission reassignment behavior is authorized.

## Idempotency

Processing the same Domain Event identity more than once SHALL NOT duplicate history, increment projection revision, alter current state, or produce a second effective update. The consumer SHALL either return the existing projection unchanged, or return a deterministic already-processed result consistent with repository conventions. Idempotency SHALL be based on authoritative event identity, not payload similarity.

## Event Ordering

Events SHALL be applied in authoritative `EventBus` order. Sprint 66 SHALL NOT introduce timestamp-based reordering, speculative sorting, conflict resolution, distributed ordering, or eventual-consistency reconciliation. An event older than or contradictory to the already projected position SHALL fail closed unless it is recognized as an already-processed event.

## Subscription and Replay Semantics

Sprint 66 SHALL use the established `EventBus` consumption mechanism. The implementation SHALL avoid creating duplicate effective updates when historical replay and live subscription overlap. The projection architecture SHALL ensure: historical events can reconstruct projection state deterministically; live events update the same projection; reads do not independently mutate projection state; repeated reads do not replay and append duplicate history; repeated composition or subscription does not register duplicate effective consumers. Where the current `EventBus` contract cannot guarantee these properties, the Builder SHALL stop and report rather than invent new event infrastructure.

## Projection Repository

Introduce a dedicated projection repository supporting capabilities equivalent to: save projection; retrieve by `engineeringSessionId`; enumerate projections; optionally retrieve by `missionId`, only when naturally supported by the approved repository pattern. The repository SHALL NOT mutate `EngineeringSession`, query aggregate repositories to infer missing projection data, own Workflow behavior, or become a general event store. The initial implementation SHALL remain in memory. No durable persistence is authorized.

## Projection Service

`EngineeringSessionStateProjectionService` SHALL provide read-only access equivalent to: get projection by Engineering Session; enumerate projections; optionally enumerate projections by Mission. The service MAY coordinate event application if that matches the established Sprint 63 projection pattern. It SHALL NOT advance Workflow state, execute Workflow steps, evaluate Review outcomes, evaluate Governance Decisions, resolve Recovery Requirements, select Adapters, dispatch execution, or mutate Missions or Engineering Sessions.

## Diagnostics

Provide deterministic diagnostics for: unsupported event type; invalid event payload; missing Mission attribution; Mission attribution conflict; Workflow continuity mismatch; duplicate event; projection repository failure; invalid advancement strategy; malformed Workflow identifiers. Diagnostics SHALL preserve relevant event and projection attribution.

## Failure Semantics

A rejected event SHALL produce no partial projection mutation. The existing projection SHALL remain unchanged when: validation fails; Mission attribution conflicts; Workflow continuity fails; repository persistence fails; the event is unsupported; the event payload is malformed. No automatic retry, recovery, or compensation behavior is authorized.

## Dependencies

Sprint 66 may consume only existing approved contracts, including: `EngineeringSessionWorkflowAdvanced`, `EventBusContract`, `DomainEvent`, existing event metadata contracts, existing Kernel composition patterns, and Sprint 63 Governance State Projection patterns where structurally reusable. Sprint 65 remains frozen and SHALL be consumed unmodified.

## Authorized Files and Boundaries

Implementation SHALL remain within the Kernel projection/read-model boundary. No changes are authorized within: `EngineeringSession`, `EngineeringSessionService`, `WorkflowChain`, Mission Engineering Group, Execution Strategy, Assignment Policy, Review, Governance, `RecoveryRequirement`, `Mission`, Host implementations, Adapter implementations, `src/hosts`, `src/adapters`, or existing Sprint 65 event contracts. Additive Kernel composition wiring is authorized.

## Implemented Concepts (Authorized)

- `EngineeringSessionStateProjection` read model.
- `IEngineeringSessionStateProjectionRepository`/in-memory implementation.
- `EngineeringSessionStateProjectionService`.
- Deterministic `EngineeringSessionWorkflowAdvanced` consumption: continuity validation, Mission attribution consistency, idempotent duplicate handling, ordered advancement history.
- Additive `createKernelServices()` wiring.
- Tests and implementation documentation.

## Deferred Concepts

- `EngineeringSessionCreated`.
- Projection of creation-time Session state.
- Event-Driven Workflow Advancement.
- Event-driven Workflow mutation.
- Recovery Workflow Automation.
- Automatic recovery execution.
- Autonomous Engineering Integration Validation.
- Host projection UI.
- Adapter consumers.
- Projection caching.
- Durable projection storage.
- Distributed consumers.
- Event checkpoints.
- Consumer offsets.
- Dead-letter queues.
- Retry policies.
- Event-stream compaction.
- Mission-level orchestration.
- WorkflowStep execution-status projection.
- ExecutionSession projection.

These concepts require separate future Sprint authorization.

## Architectural Invariants (binding)

- Domain aggregates remain authoritative.
- Projections are derived read models.
- Missing events mean missing projected knowledge.
- Projection state SHALL NOT be inferred from unrelated repositories.
- Events are processed deterministically.
- Duplicate events do not produce duplicate effective state.
- Contradictory events fail closed.
- Projection consumers do not mutate Workflow state.
- Projection and automation remain separate architectural concerns.
- Sprint 65 remains frozen.

## Required Test Matrix

1. First observed event creates exactly one projection, recording Mission/Engineering-Session attribution and previous/new Workflow positions; the new position becomes current.
2. No projection is fabricated for a Session with no observed advancement event.
3. Subsequent valid events update the existing projection; history remains ordered; current position matches the latest accepted event; advancement strategy is preserved; revision advances deterministically.
4. All four advancement strategies (`Direct`/`Trigger`/`ReviewGated`/`GovernanceGated`) are projected correctly, preserving the strategy value from the source event.
5. Workflow continuity: a subsequent event must begin from the projection's current Workflow position; a continuity mismatch is rejected and leaves projection state unchanged.
6. Mission attribution: Mission identity comes exclusively from the Domain Event; conflicting Mission identity is rejected with no repository lookup or caller-provided fallback used.
7. Idempotency: reprocessing the same event identity produces no duplicate history and no revision change.
8. Replay/live overlap: replay and live delivery overlap do not produce duplicate effective updates.
9. Reconstruction: replaying the same ordered event stream reconstructs the same projection; projection state does not depend on mutable aggregate repositories; reads do not trigger duplicate event application.
10. Malformed/unsupported event rejection produces deterministic diagnostics with no partial projection mutation.
11. Projection repository persistence failure leaves the existing projection unchanged and produces a deterministic diagnostic.
12. Boundaries: no Workflow mutation is introduced; no `EngineeringSession` or Sprint 65 event contract changes occur; no Host or Adapter files are touched; no Governance or Recovery behavior is introduced.
13. Enumeration and read-only access — `enumerateProjections`/optional Mission-scoped enumeration return correct, immutable results.
14. Kernel composition — `createKernelServices()` wires the new service/repository additively without disturbing existing service construction.

## Acceptance Criteria

- All Required Test Matrix items pass.
- The first valid advancement event creates exactly one projection; no projection exists before any advancement event for a given Engineering Session.
- Workflow continuity mismatches and Mission attribution conflicts fail closed, leaving any existing projection unchanged.
- Duplicate event identities do not produce duplicate history or a second effective update.
- Events are applied in authoritative `EventBus` order only; no timestamp-based reordering or reconciliation is introduced.
- `git diff --stat -- src/hosts src/adapters` is empty.
- `EngineeringSession`, `EngineeringSessionService`, `WorkflowChain`, Mission Engineering Group, Execution Strategy, Assignment Policy, Review, Governance, `RecoveryRequirement`, `Mission`, and Sprint 65's event contract are unmodified.
- No RFC is amended.
- Repository-wide validation passes: TypeScript compile (`tsc --noEmit`), ESLint, full Vitest suite, esbuild, extension-host bundle build.
- `IMPLEMENTATION_REPORT.md` documents implemented capability, referenced RFCs, the Known Source Limitation, idempotency/continuity/replay semantics, assumptions, deferred concepts, and explicitly states "No architectural deviations" (or names any deviation, per `IMPLEMENTATION_CONSTITUTION.md`).

## Builder Responsibilities

- Implement exactly the Authorized Vertical Slice above; do not implement any Deferred Concept, including as a placeholder or stub.
- Follow the Sprint 63 `GovernanceStateProjection`/`GovernanceStateProjectionService` structural precedent where reusable.
- Update `IMPLEMENTATION_REPORT.md` and `builder-task.md` per standard convention upon completion.
- Update `knowledge/reference/kernel-event-catalog.md` or an equivalent projection/consumer catalog reference where required by repository convention, documenting `EngineeringSessionStateProjection` as a consumer of `EngineeringSessionWorkflowAdvanced`.
- Report full validation pipeline results (compile, lint, test, build) in the completion report.

The Builder SHALL stop and report rather than infer behavior when:

- the `EventBus` cannot provide deterministic consumption or replay;
- replay and live subscription cannot be deduplicated using existing event identity;
- `EngineeringSessionWorkflowAdvanced` lacks required attribution;
- event ordering cannot be established through the existing contract;
- projection continuity cannot be validated without modifying Sprint 65;
- implementation would require Host, Adapter, aggregate, or RFC changes.

No speculative event infrastructure or inferred-state workaround is authorized. No architectural workaround is authorized without Sprint Owner ratification.

## Documentation Requirements

- Sprint Implementation Record (this document) — Builder Results section to be completed by the Builder.
- `IMPLEMENTATION_REPORT.md` update, explicitly documenting: the projection represents observed advancement state only; creation-time state is unavailable because `EngineeringSessionCreated` remains deferred; event-consumption semantics; idempotency behavior; continuity validation; replay behavior; deferred automation capabilities; validation results.
- `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md` Sprint 66 status update upon completion (Reviewer/Builder handoff synchronization per established convention).
- `knowledge/reference/kernel-event-catalog.md` or equivalent reference update, per repository convention, where a new consumer is cataloged.

## Known Limitations (anticipated; to be confirmed by Builder Results)

- No projection exists for an Engineering Session before its first observed `EngineeringSessionWorkflowAdvanced` event; creation-time state is not represented, per the Known Source Limitation above.
- Event-Driven Workflow Advancement and Recovery Workflow Automation remain unimplemented until this projection exists and its own future Sprint scope ratification is obtained.
- The projection remains in-memory only; no durable persistence is authorized this Sprint.

## Revision History

- Cycle 1: Scope authorized by `NEXUS-RAT-2026-07-17-001`, following a `nexus-plan` Sprint Proposal presented after Sprint 65's certification (`NEXUS-REV-2026-07-17-001`).

## Builder Results

Implemented the authorized Sprint 66 vertical slice.

Completed deliverables:

- Added immutable `EngineeringSessionStateProjection` read model with current observed Workflow position, previous observed Workflow position, latest advancement strategy, ordered advancement history, latest processed event identity, latest event occurrence time, revision, attribution, and diagnostics.
- Added `IEngineeringSessionStateProjectionRepository` and `InMemoryEngineeringSessionStateProjectionRepository` with save, Engineering Session lookup, global enumeration, and Mission-scoped enumeration.
- Added `EngineeringSessionStateProjectionService`, subscribed to exactly `EngineeringSessionWorkflowAdvanced` through the existing `EventBusContract`.
- Implemented deterministic first-observed-event initialization, Workflow continuity validation, Mission attribution consistency, event-identity idempotency, explicit Mission-stream replay reconstruction, and read-only projection retrieval/enumeration.
- Wired `createKernelServices()` additively and updated Kernel boundary certification for `EngineeringSessionStateProjectionService`.
- Updated `knowledge/reference/kernel-event-catalog.md` to document `EngineeringSessionStateProjectionService` as a consumer of `EngineeringSessionWorkflowAdvanced`.

Known Source Limitation confirmed:

- No projection exists before the first observed `EngineeringSessionWorkflowAdvanced` event for an Engineering Session.
- The projection represents observed advancement state only; it does not represent creation-time state because `EngineeringSessionCreated` remains deferred.

Deferred concepts preserved:

- `EngineeringSessionCreated`; creation-time Session projection; Event-Driven Workflow Advancement; Recovery Workflow Automation; Autonomous Engineering Integration Validation; Host/Adapter surfacing; projection caching; durable storage; distributed consumers; event checkpoints; consumer offsets; dead-letter queues; retry policies; event-stream compaction; Mission-level orchestration; WorkflowStep execution-status projection; ExecutionSession projection.

Boundary confirmation:

- `EngineeringSession`, `EngineeringSessionService`, `WorkflowChain`, Mission Engineering Group, Execution Strategy, Assignment Policy, Review, Governance, `RecoveryRequirement`, `Mission`, Sprint 65's event contract, `src/hosts`, and `src/adapters` were not modified.
- No RFC was amended.

Validation Summary:

- Targeted validation passed: `engineering-session-state-projection.test.ts` and `kernel-boundary-certification.integration.test.ts` (17 tests).
- TypeScript compile passed: `npm run compile`.
- ESLint passed: `npm run lint`.
- Vitest passed: 88 files, 580 tests.
- esbuild passed: `npm run build`.
- Extension-host bundle build passed: `npm run test:extension-host:build`.

No architectural deviations.

## Reviewer Notes

See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-17-002` for the complete review. Independently verified that `createFromEvent` initializes observed Workflow position exclusively from the first consumed event's `previousWorkflowStepId`/`newWorkflowStepId` (never from `EngineeringSession`, `WorkflowChain`, Mission Engineering Group, or any repository), and that no projection is fabricated before a Session's first observed advancement event (dedicated test). Confirmed `apply()` enforces Workflow continuity and Mission attribution consistency, both failing closed via `KernelError` before the service layer calls `repository.save()` — two dedicated tests independently prove the existing projection is unchanged (`toEqual(before)`) after a continuity mismatch and after a Mission conflict. Confirmed idempotency: duplicate event identity (live re-delivery and replay/live overlap) short-circuits to a `Duplicate` result with no revision change, by direct test inspection. Confirmed replay-vs-live reconstruction produces structurally identical projections. Confirmed via `git diff --stat -- src/` that exactly the four new projection files plus additive `create-kernel-services.ts` wiring changed; `git diff --stat -- src/hosts src/adapters` and diffs on `engineering-session.ts`/`engineering-session.service.ts`/`engineering-session.events.ts`/`mission-engineering-orchestration.repository.ts`/`workflow-chain.ts` are all empty. The pre-existing `GovernanceGatedWorkflowAdvancementConsumer`/`RecoveryRequirementGovernanceDecisionConsumer` kernel services observed in `create-kernel-services.ts` predate this Sprint (Sprint 57/59) and are unmodified; they are not consumers of this Sprint's new projection. Independently re-ran the full validation pipeline (`tsc --noEmit`, ESLint, Vitest 88 files/580 tests, `npm run build`, `npm run test:extension-host:build`) — all pass, matching the Builder's reported counts. Zero findings of any category.

## Final Disposition

**Approved.** Sprint 66 is fully closed with zero open findings of any blocking category. See `NEXUS-REV-2026-07-17-002`.
