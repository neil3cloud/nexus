# Sprint 11 — Domain Event Publication (Evidence, Review)

## Sprint Status

Approved (NEXUS-REV-2026-07-13-005)

## Sprint Objective

Extend Kernel-owned Domain Event publication (established for Mission in Sprint 2) to the Evidence and Review domains, using the RFC-0005 Standard Event Envelope and the event names already cataloged in `knowledge/reference/kernel-event-catalog.md`. This sprint closes the "Event Bus integration" item declared deferred in Sprints 3–10, for the subset of cataloged events whose declared Producer matches a service that actually exists and has the corresponding operation implemented today.

## Governance Constraint (Sprint Owner, pre-implementation)

Event publication SHALL NOT introduce behavioral coupling between domains. Events are notifications of completed state transitions, not commands that drive domain behavior. This restates and makes explicit, for this sprint, RFC-0005's own text: "Events SHALL describe completed facts. Events SHALL NOT describe: commands, requests, intentions, planned work, executable behavior." Concretely for this slice:

- No new event subscription/consumption is introduced anywhere in the Kernel (already declared deferred above); publishing a `Review*`/`Finding*`/`Evidence*` event SHALL NOT cause any other service to react, mutate its own state, or invoke an operation as a side effect of that publication.
- `EvidenceService` and `ReviewService` SHALL publish events strictly as an after-the-fact recording of a state transition that has already been committed to the aggregate and persisted — publication SHALL NOT be used to trigger, gate, authorize, or sequence the transition itself, and SHALL NOT be placed before the transition or the persistence call.
- No aggregate or service in this sprint SHALL subscribe to Mission's existing published events (or any other domain's events) to decide its own behavior. Cross-domain behavior continues to occur only through existing published repository/service contracts (unchanged from Sprint 4–10 practice), never through event handlers.
- If implementing this sprint reveals that a cataloged event's Producer/Consumer relationship (e.g., `ReviewAccepted` → Mission Service, per `kernel-event-catalog.md`) implies Mission Service should *react* to a Review event, that reaction is explicitly out of scope for this sprint — publish the event and stop; do not wire a consumer.

## RFC Coverage

- RFC-0005 — Domain Event Model (Partial, extending the existing Sprint 2 Mission pattern)
- RFC-0002 — Evidence Model (Referenced — event trigger only, plus the ratified optional `missionId` extension below)
- RFC-0006 — Engineering Assessment Model (Referenced — event trigger only, no semantic change)

## Ratification References

- NEXUS-RAT-2026-07-13-001 — authorizes an optional `missionId` field on `RegisterEvidenceRequest` and `EvidenceSnapshot` (extending the approved Sprint 5 Evidence model additively), resolving the RFC-0005 `EvidenceCaptured` envelope attribution gap identified by the Builder before implementation began. RFC-0002 and RFC-0005 are unmodified; Evidence remains Mission-independent by design, with `missionId` as an optional contextual association only. `EvidenceCaptured` includes `missionId` when present on the Evidence record and omits the envelope field when it is not — a disclosed partial-conformance limitation, not a reinterpretation of RFC-0005.
- NEXUS-RAT-2026-07-13-002 — narrows the Sprint 11 implementation so the Kernel-wide `DomainEvent` / `DomainEventAttribution` contract keeps required `missionId`, while `evidence.events.ts` owns an Evidence-specific publication variant that permits omission only for Mission-independent `EvidenceCaptured` events.

## Scoping Note (why Execution Strategy is not in this sprint)

The Sprint Owner approved a candidate scope of "Evidence, Review, and Execution Strategy." Cross-referencing `kernel-event-catalog.md`'s declared Producer for every relevant event narrowed this:

| Event | Catalog Producer | In scope this sprint? |
| --- | --- | --- |
| `EvidenceCaptured` | Evidence Service | Yes |
| `EvidenceAccepted`, `EvidenceRejected` | Review Service | No — no current `ReviewService` operation accepts/rejects Evidence; would require a new cross-domain operation not authorized this slice |
| `ReviewStarted`, `ReviewCompleted`, `ReviewAccepted`, `ReviewRejected` | Review Service | Yes |
| `FindingCreated` | Review Service | Yes |
| `FindingAccepted`, `FindingDismissed` | Developer (human actor) | No — no Kernel service produces these; no human-action command pathway exists |
| `FindingResolved` | Execution Strategy | No — `ExecutionStrategyService` (Sprint 10) has no Finding-resolution trigger |

No cataloged event category assigns `ExecutionStrategyService` a producer role for any event it can currently trigger. `ExecutionStrategyService` therefore publishes no events this sprint. This is a scope narrowing within the already-approved sprint, not a new governance ambiguity — no RFC ownership, terminology, or ratification question is involved.

## Implemented Concepts

- Per NEXUS-RAT-2026-07-13-001: `RegisterEvidenceRequest` and `EvidenceSnapshot` (`src/kernel/evidence/evidence.aggregate.ts`) gain an optional `missionId?: string` field. `Evidence.register`/`Evidence.fromSnapshot` propagate it and expose a `missionId` getter (`string | undefined`). This is additive and backward-compatible — no existing caller is required to supply it, and no other Evidence field, invariant, or value object changes.
- `EvidenceService.registerEvidence`'s request type propagates the optional `missionId`.
- `EvidenceService` gains an optional constructor-injected `EventBusContract` parameter, matching `MissionService`'s established pattern (`requireEventBus()` guard raising a deterministic error when publication is attempted without a configured bus).
- `Evidence` aggregate gains an internal recorded-events collection and `pullDomainEvents()` method, mirroring `Mission`'s existing pattern — the aggregate records the fact, the service pulls and publishes it after successful persistence.
- `evidence.events.ts`: `EvidenceEventType` union (`EvidenceCaptured`), `EvidenceDomainEvent` type, and `createEvidenceCapturedEvent()` factory. Per NEXUS-RAT-2026-07-13-002, `EvidenceDomainEvent` uses an Evidence-specific publication variant for Mission-independent Evidence while preserving the shared Kernel `DomainEvent` contract's required `missionId`.
- `EvidenceService` publishes `EvidenceCaptured` after successful Evidence registration. The envelope's `missionId` field is populated when the registered Evidence carries one and omitted when it does not (per NEXUS-RAT-2026-07-13-001).
- `ReviewService` gains the same optional `EventBusContract` constructor parameter and `requireEventBus()` guard pattern.
- `Review` aggregate gains an internal recorded-events collection and `pullDomainEvents()` method.
- `review.events.ts`: `ReviewEventType` union (`ReviewStarted`, `ReviewCompleted`, `ReviewAccepted`, `ReviewRejected`, `FindingCreated`), `ReviewDomainEvent` type, and corresponding factory functions.
- `ReviewService` publishes: `ReviewStarted` on `startReview`; `FindingCreated` on `publishFinding`; and on `finalizeReviewOutcome`, always `ReviewCompleted`, plus exactly one of `ReviewAccepted` (when the outcome is `Accepted` or `Accepted With Observations`) or `ReviewRejected` (when the outcome is `Rejected`). When the outcome is `Action Required`, only `ReviewCompleted` is published — neither `ReviewAccepted` nor `ReviewRejected` applies, since `Action Required` is neither acceptance nor rejection.
- Mission-scoped events conform to the RFC-0005 Standard Event Envelope (`eventId`, `missionId`, `eventType`, `timestamp`, `causality`, `correlationId`, `attribution`, `payload`) through the shared `DomainEvent`/`DomainEventMetadata` infrastructure. `ReviewStarted`, `ReviewCompleted`, `ReviewAccepted`, `ReviewRejected`, `FindingCreated`, and Mission-associated `EvidenceCaptured` always carry `missionId`. Mission-independent `EvidenceCaptured` uses the Evidence-specific event publication variant authorized by NEXUS-RAT-2026-07-13-002 and omits `missionId` as authorized by NEXUS-RAT-2026-07-13-001.
- Kernel service composition updated so `EvidenceService` and `ReviewService` receive the same Kernel-owned `EventBusContract` instance already passed to `MissionService`.
- Unit tests for event recording and `pullDomainEvents()` on both aggregates, and for service-level publication including the outcome-conditional Review event selection.

## Deferred Concepts

- Execution Strategy event publication (no cataloged producer role this slice; see Scoping Note).
- `EvidenceAccepted`, `EvidenceRejected` (Producer: Review Service, no corresponding operation exists).
- `FindingAccepted`, `FindingDismissed` (Producer: Developer, no human-action command pathway exists).
- `FindingResolved` (Producer: Execution Strategy, no trigger exists).
- Mission Plan Events and Task Events — deferred pending resolution of the Task Lifecycle three-way naming mismatch between RFC-0004's Execution State, `kernel-state-machine.md`'s Task Lifecycle, and the approved Sprint 3 `TaskStatus` enum. Out of scope for this sprint; not resolved by this sprint.
- Knowledge Events, Shared Reality Events, Context Package Events, Policy Events — respective domains unimplemented or not requested this slice.
- Event subscription/consumption by other services (RFC-0005 § Event Consumers: Execution Strategy, Review Engine, Knowledge Service, Host Integrations, Diagnostics, Audit Services) — this slice adds producers only, no new consumers.
- Durable/persistent Event Streams — the existing EventBus remains in-memory and process-local (unchanged Sprint 1 baseline).
- Event causality chaining beyond what the Standard Event Envelope structurally supports. The Builder SHOULD follow Mission's established causality pattern where straightforwardly applicable but SHALL report rather than invent new design if it requires a new decision.

## Acceptance Criteria

- `EvidenceService` and `ReviewService` accept an optional constructor-injected `EventBusContract`, matching `MissionService`'s established pattern exactly.
- `Evidence` and `Review` aggregates record Domain Events internally (mirroring `Mission`'s `recordedEvents`/`pullDomainEvents()` pattern); services pull and publish rather than fabricating event objects directly.
- All published events conform to the RFC-0005 Standard Event Envelope and use only the event names cataloged for the producer role actually implemented this slice: `EvidenceCaptured`; `ReviewStarted`, `ReviewCompleted`, `ReviewAccepted`, `ReviewRejected`, `FindingCreated`.
- No event is published for `EvidenceAccepted`, `EvidenceRejected`, `FindingAccepted`, `FindingResolved`, or `FindingDismissed` this slice.
- `ExecutionStrategyService` publishes no events this slice and is not modified.
- No Mission Plan or Task events are introduced.
- Publication failure does not corrupt aggregate persistence state. The non-atomic save-then-publish limitation already disclosed for Mission (Sprint 2) is acknowledged as an equivalent, disclosed limitation for Evidence and Review — not silently resolved.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, and esbuild.
- Unit tests cover event recording, `pullDomainEvents()`, and service-level publication for both Evidence and Review, including outcome-conditional Review event selection (`Accepted`/`Accepted With Observations` → `ReviewAccepted`; `Rejected` → `ReviewRejected`; `Action Required` → neither).
- Events are published only after the corresponding state transition is committed to the aggregate and persisted — never before, and never as a trigger, gate, or authorization for the transition itself.
- No event subscription/consumer is introduced anywhere in the Kernel; no service reacts to a published `Evidence*`, `Review*`, or `Finding*` event as a side effect. Cross-domain behavior continues to occur exclusively through existing published repository/service contracts, not event handlers.

## Builder Responsibilities

- Read, in order: `IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, `knowledge/canon/nexus-kernel-canon.md`, RFC-0005, `knowledge/reference/kernel-event-catalog.md` (Standard Event Envelope, Review Events, Finding Events, Evidence Events sections), the existing `src/kernel/mission/mission.events.ts` and the relevant sections of `src/kernel/mission/mission.service.ts` / `mission.aggregate.ts` as the established pattern to mirror, `knowledge/implementation/implementation-technology-standard.md`, `knowledge/implementation/implementation-conventions.md`.
- Implement only the concepts listed under Implemented Concepts above.
- Preserve every Deferred Concept without approximation. Do not invent a `FindingResolved` trigger, a Developer-acceptance command, or an Evidence-acceptance operation to make the deferred events publishable — report the gap instead if tempted.
- Do not modify `ExecutionStrategyService`, `ExecutionStrategy`, or any other Sprint 10 file.
- Do not modify `MissionService` or `mission.events.ts` except where strictly required for shared Kernel-wiring changes (e.g., passing the same `EventBusContract` instance) — Sprint 2's Mission event publication is a frozen, approved baseline.
- Honor the Governance Constraint above in every line of implementation: events are notifications of already-committed facts, never commands. Do not add an event handler, subscription, or any code path where receiving an event changes another domain's behavior.
- Report any additional undocumented concept, terminology gap, or specification conflict rather than guessing; stop and request ratification if one is found.
- Produce the Sprint 11 section of `IMPLEMENTATION_REPORT.md` upon completion.
- Populate the Test Summary section of this record upon completion.

## Documentation Requirements

- Update `IMPLEMENTATION_REPORT.md` with a Sprint 11 section upon completion, following the format used by Sprints 4–10.
- Do not modify RFC-0002, RFC-0005, or the Kernel Canon under any circumstance.
- The only Sprint 5 Evidence data-model extension authorized is the optional `missionId` field per NEXUS-RAT-2026-07-13-001. Do not introduce any other Reference Document or approved-baseline change without a new ratification, even if additional drift is discovered — report it instead.

## Known Limitations

- Repository/EventBus persistence is in-memory and process-local, consistent with every other Sprint 1–10 domain.
- Save-then-publish for Evidence and Review is non-atomic, matching the disclosed Mission (Sprint 2) limitation: a publish failure after successful save can leave persisted state ahead of the process-local event stream.
- `ExecutionStrategyService` remains event-silent; no cataloged event category currently assigns it a producible event.
- `EvidenceAccepted`, `EvidenceRejected`, `FindingAccepted`, `FindingResolved`, and `FindingDismissed` remain unpublishable until their respective owning operations (cross-domain Evidence acceptance, a human-action command pathway, and an Execution-Strategy Finding-resolution trigger) are designed and authorized in a future sprint.
- No event consumers are added; nothing in the Kernel currently subscribes to the new events.
- `EvidenceCaptured` events for Evidence registered without a Mission context are published with the envelope's `missionId` field omitted — a deliberate, disclosed partial conformance to RFC-0005's envelope requirement, authorized by NEXUS-RAT-2026-07-13-001, not a defect.
- Mission-independent `EvidenceCaptured` events are not retrievable through `EventBusContract.replay()`, because that public replay contract remains Mission-stream scoped with a required `missionId: string` parameter.
- `EventBusContract` and `EventBus` directly import the Evidence domain's `EvidenceDomainEvent` type so the EventBus can accept the Evidence-specific publication variant authorized by NEXUS-RAT-2026-07-13-002 while preserving required `missionId` on the shared Kernel `DomainEvent` contract. This is an accepted common-to-Evidence coupling trade-off for this remediation; a future domain requiring the same Mission-independent-event accommodation would require either the same explicit common-to-domain import pattern or a refactor to a domain-agnostic extension point.

## Builder Results

- Implemented NEXUS-RAT-2026-07-13-001 by adding optional `missionId` propagation through `RegisterEvidenceRequest`, `EvidenceSnapshot`, and the `Evidence` aggregate without making Evidence Mission-owned.
- Implemented `EvidenceCaptured` event recording on the Evidence aggregate and publication through `EvidenceService` after successful repository registration.
- Implemented Review aggregate recorded-events support and `pullDomainEvents()` for `ReviewStarted`, `FindingCreated`, `ReviewCompleted`, `ReviewAccepted`, and `ReviewRejected`.
- Implemented `EvidenceService` and `ReviewService` optional constructor-injected `EventBusContract` publication following the established MissionService save-then-publish pattern.
- Updated Kernel service composition so EvidenceService and ReviewService receive the Kernel-owned EventBus instance.
- Preserved deferred events and introduced no event consumers, handlers, ExecutionStrategy events, Mission Plan events, Task events, Evidence acceptance operations, or Finding acceptance/resolution/dismissal pathways.
- Remediated NEXUS-REV-2026-07-13-003-F-001 per NEXUS-RAT-2026-07-13-002 by restoring required `missionId` on the shared `DomainEvent` / `DomainEventAttribution` contract and confining optional `missionId` support to the Evidence-specific event publication variant.

## Test Summary

- Targeted Evidence/Review/EventBus tests passed: 9 files, 52 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 28 files, 163 tests.

## Reviewer Notes

**Original review:** Reviewed as NEXUS-REV-2026-07-13-003. Independent validation confirmed the Builder Results and Test Summary above: `tsc --noEmit`, ESLint, `esbuild` build, and Vitest (28 files / 162 tests) all pass. `EvidenceService`/`ReviewService` correctly mirror the approved Sprint 2 `MissionService` optional-`EventBusContract` pattern; publication occurs strictly after aggregate mutation and repository persistence in every operation; only the cataloged event names for the producer roles implemented this slice are used; outcome-conditional Review event selection is correct; and no event consumer/subscriber was introduced anywhere in the Kernel. `ExecutionStrategyService` is confirmed unmodified and not wired to the EventBus.

Three findings were raised, none blocking: **F-001 (Major)** — the shared `DomainEvent`/`DomainEventAttribution` envelope type was made optional-`missionId` Kernel-wide to accommodate `EvidenceCaptured`, broader than NEXUS-RAT-2026-07-13-001's Authorized Builder Scope; **F-002 (Minor)** — the "no envelope changes" claim was inaccurate; **F-003 (Minor)** — the resulting inability to `replay()` Mission-independent `EvidenceCaptured` events was undisclosed.

**Remediation review:** Reviewed as NEXUS-REV-2026-07-13-004, verifying TASK-002 (F-001 remediation per NEXUS-RAT-2026-07-13-002 direction (b)) and TASK-004 (F-003 remediation). Independent re-validation confirms: `DomainEvent`/`DomainEventAttribution` are required-`missionId` again; the Evidence-specific `MissionIndependentEvidenceDomainEvent` variant is correctly scoped to `evidence.events.ts` only; `EventBusContract`/`EventBus` were widened via `EventBusEvent = DomainEvent | EvidenceDomainEvent` without reintroducing optionality on `DomainEvent` itself; Mission and Review publication are confirmed unaffected; and Known Limitations now discloses the replay gap. `tsc --noEmit`, ESLint, `esbuild`, and Vitest (28 files / **163** tests, one more than this record's still-stale 162 figure) all pass. TASK-001 and TASK-003 are correctly resolved as folded into TASK-002's documentation updates.

Four new Minor findings were raised in the remediation review, none blocking: **F-001** — `src/kernel/common/event-bus-contract.ts` now directly imports the Evidence domain's event type, coupling the shared Event Bus contract to one specific bounded context (accepted as the cost of NEXUS-RAT-2026-07-13-002's authorized "equivalent domain-scoped abstraction"); **F-002** — this record's and `IMPLEMENTATION_REPORT.md`'s Test Summary still said 162 tests instead of 163; **F-003** — `IMPLEMENTATION_REPORT.md`'s Deviations section still said "No architectural deviations" despite documenting the F-001 deviation-and-remediation elsewhere; **F-004** — `IMPLEMENTATION_MANIFEST.md`'s Sprint 11 section did not yet cite NEXUS-RAT-2026-07-13-002.

**Final documentation-remediation review:** Reviewed as NEXUS-REV-2026-07-13-005, verifying `builder-task.md` TASK-001 through TASK-004 (generated from NEXUS-REV-2026-07-13-004). All four findings are confirmed resolved: the common→Evidence coupling trade-off is now documented in Known Limitations; both Test Summary sections correctly state 163 tests, independently reconfirmed; `IMPLEMENTATION_REPORT.md`'s Deviations section now accurately discloses the F-001 deviation-and-remediation; and `IMPLEMENTATION_MANIFEST.md` now cites both ratifications and describes the Evidence-specific variant. `git status` confirms only documentation files changed. `tsc --noEmit`, ESLint, `esbuild`, and Vitest (28 files / 163 tests) all pass with no regression. No new findings.

See REVIEW_HISTORY.md § NEXUS-REV-2026-07-13-003, § NEXUS-REV-2026-07-13-004, and § NEXUS-REV-2026-07-13-005 for full finding detail and evidence.

## Final Disposition

**Approved** (confirmed clean on final documentation-remediation review NEXUS-REV-2026-07-13-005). No architectural violation in any review cycle; the original Major finding (ratification-scope overreach) was fully remediated per NEXUS-RAT-2026-07-13-002 (verified by NEXUS-REV-2026-07-13-004), and all subsequent documentation-accuracy and coupling-direction findings (F-001 through F-004 of NEXUS-REV-2026-07-13-004) are now resolved (verified by NEXUS-REV-2026-07-13-005). TASK-002 and TASK-004 (from the -003 review) and TASK-001 through TASK-004 (from the -004 review) are all Completed or Closed. No open findings remain for Sprint 11.
