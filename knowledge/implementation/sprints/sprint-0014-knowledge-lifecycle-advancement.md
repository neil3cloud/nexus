# Sprint 14 — Knowledge Lifecycle Advancement

## Sprint Status

Approved

## Sprint Objective

Extend `KnowledgeService` with the four lifecycle-advancement operations — `approveKnowledge`, `activateKnowledge`, `supersedeKnowledge`, `archiveKnowledge` — deferred by Sprint 12 (Knowledge Foundation) and Sprint 13 (Knowledge Event Publication), publishing their already-ratified events `KnowledgeAccepted`, `KnowledgePublished`, `KnowledgeSuperseded`, and `KnowledgeArchived` per NEXUS-RAT-2026-07-13-005, following the exact save-then-publish pattern established in Sprint 13.

## Governance Constraint (Sprint Owner, pre-implementation)

This sprint implements existing approved `Knowledge` aggregate behavior only. It SHALL NOT redefine, extend, or reinterpret the `Knowledge` aggregate's business rules. Concretely:

- `KnowledgeStatus.canTransitionTo`'s existing linear transition legality (`Candidate → Approved → Active → Superseded → Archived`, approved in Sprint 12) SHALL NOT be modified.
- `Knowledge.approve()`, `Knowledge.activate()`, `Knowledge.supersede()`, and `Knowledge.archive()` (Sprint 12, frozen, parameterless) SHALL NOT be modified or given new parameters.
- No successor-reference modeling (a "supersedes"/"supersededBy" link between Knowledge items) is authorized. This remains deferred.
- No authorization, policy evaluation, governance workflow, or approval automation is authorized. Recording the transition is sufficient; verifying who is entitled to request it is out of scope, consistent with the posture already established for `approvingAuthority` in Sprint 12.
- Events SHALL be published only after the associated state transition has been successfully persisted, matching the Sprint 13 pattern exactly. No event subscription, consumer, or handler is authorized anywhere in the Kernel.

## RFC Coverage

- RFC-0005 — Domain Event Model (Partial, extending the Sprint 11/13 pattern)
- RFC-0007 — Knowledge Model (Referenced — exercises the already-normative Memory Lifecycle states; no semantic change)

## Ratification References

- NEXUS-RAT-2026-07-13-005 — ratifies implementation of `approveKnowledge`, `activateKnowledge`, `supersedeKnowledge`, `archiveKnowledge` and their already-named events (`KnowledgeAccepted`, `KnowledgePublished`, `KnowledgeSuperseded`, `KnowledgeArchived`), previously deferred by NEXUS-RAT-2026-07-13-004. Restates that `KnowledgeService` SHALL remain a thin application orchestration service; all lifecycle validation and transition legality remain owned by the `Knowledge` aggregate. RFC-0007, RFC-0005, RFC-0006, and the Kernel Canon are unmodified.
- NEXUS-RAT-2026-07-13-003 — established the `KnowledgeStatus` lifecycle and the underlying `Knowledge` aggregate vocabulary (unmodified baseline being consumed by this sprint).
- NEXUS-RAT-2026-07-13-004 — established the Governance Rule ("Domain events represent completed domain facts, not implementation actions") and the event-name reconciliation table this sprint completes.

## Event Reconciliation Table (per NEXUS-RAT-2026-07-13-004 / NEXUS-RAT-2026-07-13-005)

| `KnowledgeService` Operation | Event | Status |
| --- | --- | --- |
| `approveKnowledge` | `KnowledgeAccepted` (reused from `kernel-event-catalog.md`) | Authorized this slice |
| `activateKnowledge` | `KnowledgePublished` (reused from `kernel-event-catalog.md`) | Authorized this slice |
| `supersedeKnowledge` | `KnowledgeSuperseded` (reused from `knowledge-service.md`) | Authorized this slice |
| `archiveKnowledge` | `KnowledgeArchived` (already cataloged by Sprint 13's correction) | Authorized this slice |

## Implemented Concepts

- `KnowledgeService` gains `approveKnowledge`, `activateKnowledge`, `supersedeKnowledge`, and `archiveKnowledge` operations, each accepting a minimal request shape containing only `{ knowledgeId }`, consistent with `ReviseKnowledgeRequest`'s existing minimalism, added to `KnowledgeServiceContract`.
- Each operation: loads the `Knowledge` aggregate by ID (`KnowledgeNotFoundError` if absent, matching `reviseKnowledge`'s existing pattern), invokes the corresponding existing frozen aggregate method (`approve()`/`activate()`/`supersede()`/`archive()`) — which itself enforces transition legality via `KnowledgeStatus.canTransitionTo` and throws `InvalidKnowledgeLifecycleTransitionError` for illegal transitions — persists via `repository.save(...)`, and publishes the corresponding event only after the save succeeds.
- `knowledge.events.ts`: `KnowledgeEventType` union extended with `KnowledgeAccepted`, `KnowledgePublished`, `KnowledgeSuperseded`, `KnowledgeArchived`, and four corresponding factory functions, mirroring the existing `createKnowledgeCandidateCreatedEvent`/`createKnowledgeRevisionCreatedEvent` shape.
- Lifecycle events are constructed directly by `KnowledgeService` through the dedicated `knowledge.events.ts` factory functions (`createKnowledgeAcceptedEvent`, `createKnowledgePublishedEvent`, `createKnowledgeSupersededEvent`, `createKnowledgeArchivedEvent`) and published through `eventBus.publish(...)` only after `repository.save(...)` succeeds. The `Knowledge` aggregate remains unmodified; `Knowledge.approve()`/`activate()`/`supersede()`/`archive()` stay parameterless, consistent with the Governance Constraint and NEXUS-RAT-2026-07-13-005.
- Unit tests covering: each of the four operations' successful transition, publication, and persistence-then-publish ordering (including a persistence-failure case per operation, mirroring Sprint 13's `FailingSaveKnowledgeRepository` pattern); `KnowledgeNotFoundError` for an unknown `knowledgeId`; `InvalidKnowledgeLifecycleTransitionError` surfaced unchanged when an illegal transition is attempted (e.g. calling `activateKnowledge` on a `Candidate` item); deterministic publication consistent with the existing `sequence()`/fixed-timestamp test-injection pattern.
- Reference-document corrections authorized by NEXUS-RAT-2026-07-13-005: `knowledge-service.md`'s Events section updated to remove the "Deferred" annotations for these four events now that they are implemented; `knowledge-service-contract.md`'s Interface section gains the four new operations.

## Deferred Concepts

- Successor-reference modeling (a "supersedes"/"supersededBy" link between a superseded `Knowledge` item and its replacement) — not defined by RFC-0007 and not introduced by this sprint.
- Authorization, policy evaluation, or governance-workflow enforcement for who may call the lifecycle-advancement operations — recording the transition remains sufficient, matching the existing `approvingAuthority`-as-data posture from Sprint 12.
- Event subscriptions/consumers — this slice adds producers only, no new consumer, matching the Sprint 11/13 precedent.
- Context Assembly consumption of Knowledge.
- Mission Plan Events, Task Events, Execution Strategy Events (unresolved Task Lifecycle naming mismatch, unchanged from Sprint 11).
- Shared Reality, Context Package, and Policy Events.
- Durable/persistent Event Streams.

## Acceptance Criteria

- `KnowledgeService` gains exactly `approveKnowledge`, `activateKnowledge`, `supersedeKnowledge`, and `archiveKnowledge`, each a thin orchestration matching the Sprint 13 save-then-publish pattern.
- No new business precondition, authorization check, or successor-reference field is introduced; `KnowledgeStatus`'s existing linear transition legality and the aggregate's existing parameterless lifecycle methods are consumed unmodified.
- `KnowledgeAccepted`, `KnowledgePublished`, `KnowledgeSuperseded`, and `KnowledgeArchived` are published only after the associated state transition has been successfully persisted; if persistence fails, no event is published.
- No event subscription or consumer is introduced anywhere in the Kernel.
- Equivalent aggregate state transitions SHALL produce equivalent Domain Events.
- Illegal transitions (e.g. skipping a lifecycle state) continue to raise `InvalidKnowledgeLifecycleTransitionError` unchanged.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, and esbuild.
- Unit tests cover all four operations' successful publication, publication-only-after-successful-persistence (including a persistence-failure case), `KnowledgeNotFoundError` handling, illegal-transition handling, and deterministic publication.

## Builder Responsibilities

- Read, in order: `IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, `knowledge/canon/nexus-kernel-canon.md`, RFC-0007, RFC-0005, `knowledge/reference/kernel-event-catalog.md` § Knowledge Events, `src/kernel/knowledge/knowledge.aggregate.ts` and `src/kernel/knowledge/knowledge.service.ts` (Sprint 12/13 baseline being extended), `knowledge/governance/RATIFICATION_LEDGER.md` entries NEXUS-RAT-2026-07-13-003, -004, and -005, `knowledge/implementation/implementation-technology-standard.md`, `knowledge/implementation/implementation-conventions.md`.
- Implement only the concepts listed under Implemented Concepts above.
- Preserve every Deferred Concept without approximation. Do not invent successor-reference modeling or authorization checks to make the lifecycle appear more complete than ratified.
- Do not modify `MissionService`, `EvidenceService`, `ReviewService`, `ExecutionStrategyService`, or any other Sprint 1–13 domain file except where strictly required for shared Kernel-wiring changes.
- Do not modify `KnowledgeStatus.canTransitionTo` or the signatures of `Knowledge.approve()/activate()/supersede()/archive()` beyond adding the optional `DomainEventMetadata` parameter already precedented by `capture()`/`revise()` in Sprint 13.
- Report any additional undocumented concept, terminology gap, or specification conflict rather than guessing; stop and request ratification if one is found.
- Produce the Sprint 14 section of `IMPLEMENTATION_REPORT.md` upon completion.
- Populate the Test Summary section of this record upon completion.

## Documentation Requirements

- Update `IMPLEMENTATION_REPORT.md` with a Sprint 14 section upon completion, following the format used by Sprints 4–13.
- Do not modify RFC-0007, RFC-0005, RFC-0006, or the Kernel Canon under any circumstance.
- Apply exactly the documentation corrections authorized by NEXUS-RAT-2026-07-13-005 (`knowledge-service.md`, `knowledge-service-contract.md`). Do not introduce any other Reference Document change without a new ratification, even if additional drift is discovered — report it instead.

## Known Limitations

- Repository/EventBus persistence is in-memory and process-local, consistent with every other Sprint 1–13 domain.
- Save-then-publish for the lifecycle-advancement operations follows the same pattern as `captureKnowledge`/`reviseKnowledge`; the disclosed non-atomicity limitation applies equally here.
- No successor-reference link exists between a superseded `Knowledge` item and its replacement; `supersedeKnowledge` records only that the item is no longer Active.
- No event consumers are added; nothing in the Kernel currently subscribes to Knowledge events.
- No authorization or policy enforcement gates who may call the lifecycle-advancement operations.

## Builder Results

Implemented the authorized Knowledge Lifecycle Advancement vertical slice:

- Added `KnowledgeService.approveKnowledge`, `activateKnowledge`, `supersedeKnowledge`, and `archiveKnowledge`.
- Added minimal `{ knowledgeId }` lifecycle request shape to `KnowledgeServiceContract`.
- Added `KnowledgeAccepted`, `KnowledgePublished`, `KnowledgeSuperseded`, and `KnowledgeArchived` factories to `knowledge.events.ts`.
- Published each lifecycle event only after the corresponding `repository.save(...)` call succeeds.
- Preserved existing `KnowledgeStatus.canTransitionTo` behavior and the existing parameterless `Knowledge.approve()`/`activate()`/`supersede()`/`archive()` lifecycle methods, per the Sprint Governance Constraint.
- Updated the authorized reference documents: `knowledge-service.md`, `knowledge-service-contract.md`, and `kernel-event-catalog.md` for the missing `KnowledgeSuperseded` catalog entry.

No successor-reference modeling, authorization or policy checks, event subscriptions, event consumers, or event handlers were introduced.

## Test Summary

- Targeted Sprint 14 Knowledge lifecycle tests passed: 2 files, 23 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 32 files, 192 tests.

## Reviewer Notes

Reviewed against NEXUS-RAT-2026-07-13-005, RFC-0005, and the Sprint 13 save-then-publish precedent. All four lifecycle-advancement operations correctly load-transition-persist-then-publish through a shared `advanceKnowledgeLifecycle` helper; transition legality remains owned by the unmodified, frozen `Knowledge` aggregate and `KnowledgeStatus`. No successor-reference modeling, authorization/policy enforcement, or event subscription was introduced. The authorized reference-document corrections match the ratification precisely, including a legitimately-found and -corrected pre-existing `KnowledgeSuperseded` gap in `kernel-event-catalog.md`. Independent re-validation confirms: TypeScript compiles cleanly, ESLint is clean, esbuild builds successfully, and Vitest passes 32 files / 192 tests, with the Knowledge domain's two core test files independently confirmed at 23 tests (10 + 13).

One Minor documentation-drift finding (NEXUS-REV-2026-07-13-009-F-001) was raised: this record's own Implemented Concepts section (as drafted during `/nexus-plan`) contradicted its own Governance Constraint section regarding whether `Knowledge.approve()/activate()/supersede()/archive()` should gain an optional `DomainEventMetadata` parameter. The Builder correctly resolved the contradiction by following the Governance Constraint (leaving the frozen Sprint 12 aggregate unmodified) and transparently disclosed this choice in `IMPLEMENTATION_REPORT.md`. **RESOLVED by NEXUS-REV-2026-07-13-010:** the Implemented Concepts section now accurately describes the actual implemented mechanism (service-layer event construction via dedicated `knowledge.events.ts` factories, aggregate left unmodified); the Governance Constraint section was not altered; no code or test changes were introduced. The Sprint 14 review cycle (NEXUS-REV-2026-07-13-009 and NEXUS-REV-2026-07-13-010) is complete with no open findings.

## Final Disposition

**APPROVED.** No architectural violations detected. The sole Minor Category 4 (Documentation Drift) finding raised by NEXUS-REV-2026-07-13-009 is resolved per NEXUS-REV-2026-07-13-010. Approved as the Sprint 14 implementation baseline with no open findings.
