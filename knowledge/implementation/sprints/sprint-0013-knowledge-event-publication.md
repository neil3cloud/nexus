# Sprint 13 — Knowledge Event Publication

## Sprint Status

Approved

## Sprint Objective

Extend Kernel-owned Domain Event publication (established for Mission in Sprint 2, extended to Evidence and Review in Sprint 11) to the Knowledge domain, publishing `KnowledgeCandidateCreated` and `KnowledgeRevisionCreated` per NEXUS-RAT-2026-07-13-004, following the established Foundation → Event Publication pattern already used for Evidence (Sprint 5 → 11) and Review (Sprint 9 → 11).

## Governance Constraint (Sprint Owner, pre-implementation)

Knowledge Domain Events SHALL remain notifications of completed state transitions. They SHALL NOT initiate, coordinate, or trigger subsequent domain behavior. This restates, for the Knowledge domain specifically, both RFC-0005's own text ("Events SHALL describe completed facts. Events SHALL NOT describe: commands, requests, intentions, planned work, executable behavior") and the permanent Governance Rule established by NEXUS-RAT-2026-07-13-004 ("Domain events represent completed domain facts, not implementation actions"). Concretely for this slice:

- No event subscription/consumption is introduced anywhere in the Kernel; publishing a `Knowledge*` event SHALL NOT cause any other service to react, mutate its own state, or invoke an operation as a side effect of that publication.
- `KnowledgeService` SHALL publish events strictly as an after-the-fact recording of a state transition that has already been committed to the aggregate and successfully persisted. A Domain Event SHALL be published only after the associated state transition has been successfully persisted. If persistence fails, no Domain Event SHALL be published. Publication SHALL NOT be used to trigger, gate, authorize, or sequence the transition itself, and SHALL NOT be placed before the transition or the persistence call.
- No aggregate or service in this sprint SHALL subscribe to Knowledge's own published events, or to any other domain's events, to decide its own behavior.
- Equivalent aggregate state transitions SHALL produce equivalent Domain Events — publication SHALL remain deterministic.

## RFC Coverage

- RFC-0005 — Domain Event Model (Partial, extending the existing Sprint 11 pattern)
- RFC-0007 — Knowledge Model (Referenced — event trigger only, no semantic change)

## Ratification References

- NEXUS-RAT-2026-07-13-004 — ratifies the Knowledge event-name reconciliation: `KnowledgeCandidateCreated` (reused from `kernel-event-catalog.md`) for `captureKnowledge`; `KnowledgeRevisionCreated` (new) for `reviseKnowledge`. Scopes Sprint 13 to exactly these two operations/events. Explicitly defers `approveKnowledge`/`activateKnowledge`/`supersedeKnowledge`/`archiveKnowledge` and their events (`KnowledgeAccepted`/`KnowledgePublished`/`KnowledgeSuperseded`/`KnowledgeArchived`) entirely — not merely event-silent, but out of scope as operations too. Establishes the permanent Governance Rule: Domain events represent completed domain facts, not implementation actions. RFC-0007, RFC-0005, RFC-0006, and the Kernel Canon are unmodified.

## Event Reconciliation Table (per NEXUS-RAT-2026-07-13-004)

| `KnowledgeService` Operation | Event | Status |
| --- | --- | --- |
| `captureKnowledge` | `KnowledgeCandidateCreated` (reused from `kernel-event-catalog.md`) | Authorized this slice |
| `reviseKnowledge` | `KnowledgeRevisionCreated` (new) | Authorized this slice |
| *(future)* `approveKnowledge` | `KnowledgeAccepted` (reused) | Deferred — no operation exists |
| *(future)* `activateKnowledge` | `KnowledgePublished` (reused) | Deferred — no operation exists |
| *(future)* `supersedeKnowledge` | `KnowledgeSuperseded` (reused from `knowledge-service.md`) | Deferred — no operation exists |
| *(future)* `archiveKnowledge` | `KnowledgeArchived` (new) | Deferred — no operation exists |

## Implemented Concepts

- `KnowledgeService` gains an optional constructor-injected `EventBusContract` parameter, matching `MissionService`/`EvidenceService`/`ReviewService`'s established pattern (`requireEventBus()` guard raising a deterministic error when publication is attempted without a configured bus).
- The `Knowledge` aggregate exposes recorded Domain Events through the Kernel's established aggregate event-recording contract: a drain-once accessor (`pullDomainEvents()`-shaped) that returns all events recorded since the aggregate was constructed or last drained, and empties on each call, mirroring the behavioral contract already satisfied by `Mission`, `Evidence`, and `Review`. This is a behavioral requirement, not a prescription of the aggregate's private internal representation — the Builder MAY implement it with whatever internal structure is consistent with `Knowledge`'s existing immutable, `withState`-based design (Sprint 12), provided the drain-once contract holds.
- `knowledge.events.ts`: `KnowledgeEventType` union (`KnowledgeCandidateCreated`, `KnowledgeRevisionCreated`), `KnowledgeDomainEvent` type, and `createKnowledgeCandidateCreatedEvent()`/`createKnowledgeRevisionCreatedEvent()` factory functions, mirroring `evidence.events.ts`/`review.events.ts`.
- `KnowledgeService.captureKnowledge` publishes `KnowledgeCandidateCreated` only after `Knowledge.capture(...)` has been constructed and the repository `create` call has succeeded. `KnowledgeService.reviseKnowledge` publishes `KnowledgeRevisionCreated` only after `Knowledge.revise(...)` has produced the new revision and the repository `save` call has succeeded. In both operations: if the repository call throws, no event is recorded as published and no partial publication occurs.
- All published events conform to the RFC-0005 Standard Event Envelope (`eventId`, `missionId`, `eventType`, `timestamp`, `causality`, `correlationId`, `attribution`, `payload`) via the existing `DomainEvent`/`DomainEventMetadata` infrastructure. Knowledge items always carry a `missionId` (Sprint 12's `Knowledge.capture` requires an originating, completed Mission), so no Evidence-style Mission-independent variant is needed for Knowledge — `DomainEvent`'s required `missionId` applies without modification.
- Kernel service composition updated so `KnowledgeService` receives the same Kernel-owned `EventBusContract` instance already passed to `MissionService`/`EvidenceService`/`ReviewService`.
- Unit tests covering: the event-recording contract's drain-once behavior on `Knowledge`; `KnowledgeCandidateCreated` publication on `captureKnowledge`; `KnowledgeRevisionCreated` publication on `reviseKnowledge`; publication occurring only after successful persistence (including a case where persistence fails and no event is published); and deterministic publication (equivalent inputs producing equivalent events, consistent with the existing `sequence()`/fixed-timestamp test-injection pattern used for Evidence/Review).
- Reference-document corrections authorized by NEXUS-RAT-2026-07-13-004: `kernel-event-catalog.md` § Knowledge Events gains `KnowledgeRevisionCreated` and `KnowledgeArchived` (Producer: Knowledge Service), retaining `KnowledgeCandidateCreated`/`KnowledgeAccepted`/`KnowledgePublished` unchanged; `knowledge-service.md`'s Events section is corrected to match the Event Reconciliation Table above, and its "Subscribes to ReviewAccepted and approval events" line is corrected to reflect that no event subscription exists.

## Deferred Concepts

- `approveKnowledge`, `activateKnowledge`, `supersedeKnowledge`, `archiveKnowledge` `KnowledgeService` operations — entirely out of scope this slice, not merely event-silent. The `Knowledge` aggregate's existing `approve()`/`activate()`/`supersede()`/`archive()` methods (Sprint 12) remain unreachable through any service operation.
- `KnowledgeAccepted`, `KnowledgePublished`, `KnowledgeSuperseded`, `KnowledgeArchived` events — deferred pending the lifecycle-advancement operations above.
- Event subscriptions/consumers — this slice adds a producer only, no new consumer, matching the Sprint 11 precedent.
- Mission Plan Events, Task Events, Execution Strategy Events — deferred pending resolution of the Task Lifecycle three-way naming mismatch (unchanged from Sprint 11).
- Shared Reality Events, Context Package Events, Policy Events — respective domains unimplemented or not requested this slice.
- Durable/persistent Event Streams — the existing EventBus remains in-memory and process-local.
- Event causality chaining beyond what the Standard Event Envelope structurally supports.

## Acceptance Criteria

- `KnowledgeService` accepts an optional constructor-injected `EventBusContract`, matching `MissionService`/`EvidenceService`/`ReviewService`'s established pattern exactly.
- `Knowledge` exposes recorded Domain Events through the Kernel's established aggregate event-recording contract; `KnowledgeService` pulls and publishes rather than fabricating event objects directly.
- All published events conform to the RFC-0005 Standard Event Envelope and use only `KnowledgeCandidateCreated` and `KnowledgeRevisionCreated`, per the Event Reconciliation Table.
- A Domain Event SHALL be published only after the associated state transition has been successfully persisted. If persistence fails, no Domain Event SHALL be published.
- No `KnowledgeAccepted`, `KnowledgePublished`, `KnowledgeSuperseded`, or `KnowledgeArchived` event is published this slice, and no lifecycle-advancement `KnowledgeService` operation is introduced, even as an unpublished stub.
- No event subscription or consumer is introduced anywhere in the Kernel. Knowledge Domain Events SHALL remain notifications of completed state transitions; they SHALL NOT initiate, coordinate, or trigger subsequent domain behavior.
- Equivalent aggregate state transitions SHALL produce equivalent Domain Events.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, and esbuild.
- Unit tests cover the event-recording contract's drain-once behavior, service-level publication for both operations, publication-only-after-successful-persistence (including a persistence-failure case), and deterministic publication.

## Builder Responsibilities

- Read, in order: `IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, `knowledge/canon/nexus-kernel-canon.md`, RFC-0005, `knowledge/reference/kernel-event-catalog.md` (Standard Event Envelope, Knowledge Events section — post NEXUS-RAT-2026-07-13-004 correction), the existing `src/kernel/evidence/evidence.events.ts` and the relevant sections of `src/kernel/evidence/evidence.service.ts` as the established pattern to mirror (Knowledge always carries `missionId`, so the simpler Review-style pattern applies, not Evidence's Mission-independent variant), `knowledge/governance/RATIFICATION_LEDGER.md` entry NEXUS-RAT-2026-07-13-004, `knowledge/implementation/implementation-technology-standard.md`, `knowledge/implementation/implementation-conventions.md`.
- Implement only the concepts listed under Implemented Concepts above.
- Preserve every Deferred Concept without approximation. Do not invent `approveKnowledge`/`activateKnowledge`/`supersedeKnowledge`/`archiveKnowledge`, even as unpublished stubs, to make the lifecycle appear complete — report the gap instead if tempted.
- Do not modify `MissionService`, `EvidenceService`, `ReviewService`, `ExecutionStrategyService`, or any other Sprint 1–12 domain file except where strictly required for shared Kernel-wiring changes (e.g. passing the same `EventBusContract` instance).
- Honor the Governance Constraint above in every line of implementation: events are notifications of already-committed, successfully-persisted facts, never commands, and never triggers for other domain behavior.
- Report any additional undocumented concept, terminology gap, or specification conflict rather than guessing; stop and request ratification if one is found.
- Produce the Sprint 13 section of `IMPLEMENTATION_REPORT.md` upon completion.
- Populate the Test Summary section of this record upon completion.

## Documentation Requirements

- Update `IMPLEMENTATION_REPORT.md` with a Sprint 13 section upon completion, following the format used by Sprints 4–12.
- Do not modify RFC-0007, RFC-0005, RFC-0006, or the Kernel Canon under any circumstance.
- Apply exactly the documentation corrections authorized by NEXUS-RAT-2026-07-13-004 (`kernel-event-catalog.md`, `knowledge-service.md`). Do not introduce any other Reference Document change without a new ratification, even if additional drift is discovered — report it instead.

## Known Limitations

- Repository/EventBus persistence is in-memory and process-local, consistent with every other Sprint 1–12 domain.
- Save-then-publish for Knowledge follows the same pattern as Mission/Evidence/Review; the disclosed non-atomicity limitation (a publish failure after successful save can leave persisted state ahead of the process-local event stream) applies equally here.
- `KnowledgeAccepted`, `KnowledgePublished`, `KnowledgeSuperseded`, and `KnowledgeArchived` remain unpublishable until their respective `KnowledgeService` operations are designed and authorized in a future sprint.
- No event consumers are added; nothing in the Kernel currently subscribes to Knowledge events.
- RFC-0007's Memory Lifecycle states beyond `Candidate` remain reachable only via the `Knowledge` aggregate's existing transition methods, not through `KnowledgeService`, until a future sprint.

## Builder Results

Implemented the authorized Knowledge Event Publication vertical slice:

- Added `KnowledgeCandidateCreated` and `KnowledgeRevisionCreated` event factories in `knowledge.events.ts`.
- Added `Knowledge` aggregate recorded-event support with drain-once `pullDomainEvents()` behavior.
- Updated `Knowledge.capture(...)` and `Knowledge.revise(...)` to record the authorized events when supplied RFC-0005 event metadata.
- Updated `KnowledgeService` to require an optional constructor-injected `EventBusContract` for mutating operations and publish only after successful repository persistence.
- Updated Kernel service composition so `KnowledgeService` receives the shared Kernel-owned EventBus.
- Applied the NEXUS-RAT-2026-07-13-004 reference-document corrections to `kernel-event-catalog.md` and `knowledge-service.md`.

No lifecycle-advancement `KnowledgeService` operations were introduced. No event subscriptions, consumers, or handlers were introduced.

## Test Summary

- Targeted Sprint 13 Knowledge event tests passed: 2 files, 18 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 32 files, 187 tests.

## Reviewer Notes

Reviewed against NEXUS-RAT-2026-07-13-004, RFC-0005, and the Sprint 11 precedent (`evidence.service.ts`/`evidence.events.ts`, `review.service.ts`/`review.events.ts`). `KnowledgeService`'s optional `EventBusContract` injection, `requireEventBus()` guard, `createEventMetadata()`/`publishRecordedEvents()` helpers, and save-then-publish ordering exactly mirror the established `EvidenceService`/`ReviewService` pattern. `Knowledge.pullDomainEvents()` provides the same drain-once contract as `Mission`/`Evidence`/`Review`. `knowledge.events.ts` conforms to the RFC-0005 Standard Event Envelope. No lifecycle-advancement operation was introduced, even as a stub, and no event subscription was introduced anywhere in the Kernel. The two authorized reference-document corrections (`kernel-event-catalog.md`, `knowledge-service.md`) match the Ratification's Authorized Builder Scope verbatim. Independent re-validation confirms: TypeScript compiles cleanly, ESLint is clean, esbuild builds successfully, and Vitest passes 32 files / 187 tests, with the targeted Sprint 13 files independently confirmed at 2 files / 18 tests. See REVIEW_HISTORY.md § NEXUS-REV-2026-07-13-008 for the full review record.

## Final Disposition

**PASS.** No architectural violations detected. No findings raised. Approved as the Sprint 13 implementation baseline per NEXUS-REV-2026-07-13-008.
