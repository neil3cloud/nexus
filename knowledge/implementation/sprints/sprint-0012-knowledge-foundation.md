# Sprint 12 — Knowledge Foundation

## Sprint Status

Approved (NEXUS-REV-2026-07-13-007)

## Sprint Objective

Implement the Knowledge Foundation vertical slice by introducing the Knowledge domain defined by RFC-0007 (Knowledge Model), using the `Knowledge` canonical implementation vocabulary ratified by NEXUS-RAT-2026-07-13-003. This sprint establishes an immutable, evidence-and-review-backed Engineering Memory foundation, mirroring the Evidence (Sprint 5) and Review (Sprint 9) Foundation-slice pattern, while preserving the architectural boundaries established by Sprints 1–11.

## RFC Coverage

- RFC-0007 — Knowledge Model (Partial)
- RFC-0002 — Evidence Model (Referenced — supporting Evidence lineage)
- RFC-0006 — Engineering Assessment Model (Referenced — Memory Capture requires a completed, accepted Review)
- RFC-0001 — Mission Model (Referenced — Mission / Mission Plan Revision attribution)

## Ratification References

- NEXUS-RAT-2026-07-13-003 — ratifies `Knowledge` as the canonical implementation-layer vocabulary for RFC-0007's Engineering Memory domain: `Knowledge` (aggregate), `KnowledgeId`, `KnowledgeStatus` (`Candidate → Approved → Active → Superseded → Archived`), `KnowledgeScope`, `KnowledgeProvenance`, `KnowledgeAttribution`. RFC-0007 itself is unmodified and remains the sole normative owner of Engineering Memory semantics. Authorizes corrections to `kernel-data-model.md` and `knowledge-service-contract.md`. Defers reconciliation of the three existing Knowledge/Memory event-name sets and all Knowledge event publication to a future Knowledge Event Publication sprint.

## Canonical Vocabulary (per NEXUS-RAT-2026-07-13-003)

| RFC-0007 Normative Term | Canonical Implementation Name |
| --- | --- |
| Engineering Memory | `Knowledge` (aggregate root) |
| *(implementation-layer identity)* | `KnowledgeId` |
| Memory Lifecycle (`Candidate → Approved → Active → Superseded → Archived`) | `KnowledgeStatus` (`Candidate → Approved → Active → Superseded → Archived`) |
| Memory Scope | `KnowledgeScope` |
| Memory Provenance | `KnowledgeProvenance` |
| Memory Attribution | `KnowledgeAttribution` |
| Memory Capture | `KnowledgeService.captureKnowledge` |
| Memory Evolution / Memory Revision | `KnowledgeService.reviseKnowledge` |

## Implemented Concepts

- `Knowledge` aggregate with immutable `KnowledgeId`, `missionId`, `missionPlanRevisionId`, `summary`, `KnowledgeScope`, `KnowledgeStatus` lifecycle, `supportingEvidenceIds` (non-empty), `supportingReviewId`, `approvingAuthority`, and an append-only revision history preserving `KnowledgeId`, attribution, and provenance across revisions.
- `KnowledgeId` immutable identity value object.
- `KnowledgeStatus` lifecycle value object/state machine: `Candidate → Approved → Active → Superseded → Archived`, per RFC-0007's Memory Lifecycle. `Archived` is terminal.
- `KnowledgeScope` value object with the RFC-0007 minimum scope set: Repository, Architecture, Capability, Component, Module, Policy.
- `KnowledgeProvenance` value object preserving Evidence lineage, Review (Assessment) lineage, Mission lineage, and approval lineage.
- `KnowledgeAttribution` value object identifying originating Mission, originating Mission Plan Revision, supporting Evidence, supporting Review, and approving authority.
- Memory Capture (`KnowledgeService.captureKnowledge`): rejects capture unless — a supporting Review exists; that Review has reached a terminal accepted state (`ReviewStatus` = `Completed` with `ReviewOutcome` of `Accepted` or `Accepted With Observations`); supporting Evidence exists (each `supportingEvidenceIds` entry resolves through `IEvidenceRepository`); required Mission work has completed (the referenced Mission/Task work this Knowledge item attributes to is in a completed execution state); required approval metadata (`approvingAuthority`) is present. All of these preconditions are validated by the `Knowledge` aggregate and its value objects at construction time, not by `KnowledgeService`. A `Knowledge` item that passes all preconditions is created in `Candidate` status.
- Memory Evolution (`KnowledgeService.reviseKnowledge`): produces a new immutable revision preserving `KnowledgeId`, attribution, and provenance; prior revisions remain permanently preserved in the revision history; revision validation (e.g. rejecting revision of an `Archived` item) is owned by the `Knowledge` aggregate.
- `IKnowledgeRepository` contract and `InMemoryKnowledgeRepository` process-local snapshot persistence for `Knowledge` items and their revision history.
- `KnowledgeService` thin application-service orchestration for capture, revision, retrieval, and enumeration through constructor-injected repository contracts (`IKnowledgeRepository`, `IReviewRepository`, `IEvidenceRepository`), consistent with the `EvidenceService`/`ReviewService` orchestration pattern. `KnowledgeService` SHALL NOT contain business rules; it coordinates repository access and delegates all validation and lifecycle decisions to the `Knowledge` aggregate and its value objects.
- Deterministic diagnostics for invalid Knowledge definitions, capture-precondition failures (missing/non-terminal/non-accepted Review, missing Evidence, missing approval metadata), invalid lifecycle transitions, and missing Knowledge references.
- Kernel service composition update: `KnowledgeService` replaces the Sprint 1 bootstrap placeholder, receiving the injected in-memory Knowledge repository plus the existing Evidence and Review repositories already shared by `EvidenceService`/`ReviewService`.
- Documentation corrections authorized by NEXUS-RAT-2026-07-13-003: `kernel-data-model.md`'s Knowledge field table (adding `status`, `missionPlanRevisionId`, `supportingReviewId`, `contributingEventIds`, `approvingAuthority`); `knowledge-service-contract.md`'s `supportingAssessment` → `supportingReview`; consistent `Knowledge` vocabulary in `knowledge-service.md`'s interface descriptions (without reconciling its described event names or subscription/consumer design, which remain deferred).
- Unit tests covering `Knowledge` aggregate construction, invariants, `KnowledgeStatus` transitions, capture-precondition validation (each of the five preconditions individually and in combination), revision append-only behavior, value object validation, repository behavior, and `KnowledgeService` orchestration.

## Deferred Concepts

- Knowledge event publication (`KnowledgeCandidateCreated`/`KnowledgeAccepted`/`KnowledgePublished` per `kernel-event-catalog.md`, or any other Knowledge/Memory event name) is not implemented this slice.
- Reconciliation of the three existing Knowledge/Memory event-name sets (`kernel-event-catalog.md`'s 3-event set, `knowledge-service.md`'s different 3-event set, and RFC-0007's own 5-state Memory Lifecycle) — explicitly deferred to the first Knowledge Event Publication vertical slice per NEXUS-RAT-2026-07-13-003.
- Event subscriptions/consumers — `knowledge-service.md`'s described "Subscribes to ReviewAccepted and approval events" design is not implemented; Knowledge Capture in this slice is triggered only through direct `KnowledgeService.captureKnowledge` calls, never through an event handler.
- Context Assembly consumption of Knowledge (RFC-0007 § Memory Retention: "Memory SHALL remain available to future Context Assembly") — Context Assembly remains unimplemented across the Kernel.
- Governance / policy-driven capture criteria beyond the five deterministic preconditions listed above.
- Human Authority approval workflow automation (RFC-0007 § Human Authority: "Human participants SHALL remain the final authority for accepting Engineering Memory") — this slice records `approvingAuthority` as attribution data; it does not implement an approval command, workflow, or UI.
- Adapter invocation and AI Provider integration.
- Search, indexing, and durable persistence engines beyond the in-memory repository.
- Multi-source Knowledge aggregation or synthesis across multiple Missions.

## Acceptance Criteria

- `Knowledge` remains immutable; revisions are append-only, preserving `KnowledgeId`, attribution, provenance, and revision history — no in-place mutation of a prior revision.
- Knowledge capture is rejected unless all five preconditions hold: a supporting Review exists; the Review has reached a terminal accepted state; supporting Evidence exists; required Mission work has completed; required approval metadata is present. Each precondition SHALL be independently testable and independently rejectable.
- `KnowledgeStatus` transitions match the ratified lifecycle (`Candidate → Approved → Active → Superseded → Archived`); `Archived` is terminal; no undocumented transition is introduced.
- `KnowledgeService` remains a thin application service — orchestration and repository coordination only. All capture preconditions, lifecycle transitions, and revision rules are owned by the `Knowledge` aggregate and its value objects, not by `KnowledgeService`.
- `InMemoryKnowledgeRepository` provides process-local persistence only, with no business-rule enforcement beyond duplicate/consistency protection.
- No Adapter invocation, AI provider integration, Event Bus publication, or event subscription is introduced by this slice.
- No modification to RFC-0007, RFC-0006, RFC-0002, RFC-0001, or the Kernel Canon.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, and esbuild.
- Unit tests cover `Knowledge` aggregate behavior, `KnowledgeStatus` transitions, each capture precondition individually, revision append-only behavior, value object validation, repository behavior, and `KnowledgeService` orchestration.

## Builder Responsibilities

- Read, in order: `IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, `knowledge/canon/nexus-kernel-canon.md` (Canon 11 — Knowledge Through Acceptance), RFC-0007, `knowledge/reference/domain-schema.md` (Knowledge Domain), `knowledge/reference/kernel-data-model.md` (Knowledge field shapes, pre- and post-correction), `knowledge/reference/interface-contracts/knowledge-service-contract.md`, `knowledge/reference/service-catalog/knowledge-service.md`, `knowledge/reference/kernel-event-catalog.md` (Knowledge Events — for future-event-name awareness only; no events are published this slice), the existing `src/kernel/evidence/evidence.service.ts` and `src/kernel/review/review.service.ts` as the established thin-service pattern to mirror, `knowledge/governance/RATIFICATION_LEDGER.md` entry NEXUS-RAT-2026-07-13-003, `knowledge/implementation/implementation-technology-standard.md`, `knowledge/implementation/implementation-conventions.md`.
- Implement only the concepts listed under Implemented Concepts above.
- Preserve every Deferred Concept without approximation. Do not invent Knowledge event publication, an event-subscription pathway, or a Context Assembly integration to make the deferred concepts appear complete — report the gap instead if tempted.
- Do not modify `EvidenceService`, `ReviewService`, `MissionService`, or any other Sprint 1–11 file except where strictly required for shared Kernel-wiring changes (e.g. constructing `KnowledgeService` with the existing shared `IEvidenceRepository`/`IReviewRepository` instances).
- All five Memory Capture preconditions SHALL be enforced by the `Knowledge` aggregate (or its value objects), not by `KnowledgeService` — this is a Sprint Owner-directed architectural requirement, not a stylistic preference.
- Report any additional undocumented concept, terminology gap, or specification conflict rather than guessing; stop and request ratification if one is found.
- Produce the Sprint 12 section of `IMPLEMENTATION_REPORT.md` (Implemented Slice, RFC Coverage, Referenced Reference Documents, Architectural Assumptions, Limitations, Test Summary, Deviations) upon completion.
- Populate the Test Summary section of this record upon completion.

## Documentation Requirements

- Update `IMPLEMENTATION_REPORT.md` with a Sprint 12 section upon completion, following the format used by Sprints 4–11.
- Do not modify RFC-0007, RFC-0006, RFC-0002, RFC-0001, or the Kernel Canon under any circumstance.
- Apply exactly the documentation corrections authorized by NEXUS-RAT-2026-07-13-003 (`kernel-data-model.md`, `knowledge-service-contract.md`, and consistent `Knowledge` vocabulary in `knowledge-service.md`). Do not reconcile the three Knowledge/Memory event-name sets or introduce any other Reference Document change without a new ratification, even if additional drift is discovered — report it instead.

## Known Limitations

- Repository persistence is in-memory and process-local, consistent with every other Sprint 1–11 domain.
- No Event Bus integration; Knowledge lifecycle transitions are not observable outside direct service calls this slice.
- No Adapter or AI provider integration; Knowledge is captured and revised through direct `KnowledgeService` calls only.
- `Knowledge` models exactly one supporting Review per item; multi-Review synthesis or aggregation across Reviews is not supported.
- `approvingAuthority` is recorded as attribution data only; no approval command, workflow, or UI enforces who may supply it.
- Knowledge does not consume Context Assembly, Shared Reality Projections, or Produced Artifacts as capture inputs in this slice.
- "Required Mission work has completed" is validated against the referenced Mission/Task execution state available through existing Sprint 4 `MissionExecutionService`/repository contracts; no new Mission or Task concept is introduced to represent this precondition.

## Builder Results

- Implemented the RFC-0007 Knowledge Foundation slice using the ratified `Knowledge` implementation vocabulary from NEXUS-RAT-2026-07-13-003.
- Added `Knowledge`, `KnowledgeId`, `KnowledgeStatus`, `KnowledgeScope`, `KnowledgeAttribution`, `KnowledgeProvenance`, and append-only `KnowledgeRevision` support.
- Implemented `Knowledge.capture` with aggregate-owned validation for supporting Review existence, terminal accepted Review outcome, supporting Evidence existence, completed originating Mission state, and approval metadata.
- Implemented immutable Knowledge revision evolution through `Knowledge.revise`, preserving `KnowledgeId`, attribution, provenance, and prior revision snapshots; archived Knowledge rejects further revision.
- Added `IKnowledgeRepository` and `InMemoryKnowledgeRepository` process-local snapshot persistence with duplicate protection.
- Replaced the Sprint 1 `KnowledgeService` placeholder with thin orchestration for capture, revision, retrieval, and enumeration.
- Updated Kernel service composition so `KnowledgeService` receives the in-memory Knowledge repository and the shared Mission, Evidence, and Review repositories needed to retrieve capture-precondition context while keeping validation inside the aggregate.
- Preserved deferred Knowledge event publication, event subscriptions/consumers, Context Assembly integration, Adapter/AI provider integration, search/indexing, durable persistence, policy-driven capture, and approval workflow automation.
- Applied the reference-document corrections authorized by NEXUS-RAT-2026-07-13-003.

## Test Summary

- Targeted Knowledge tests passed: 4 files, 19 tests.
- TypeScript compile passed.
- ESLint passed.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 32 files, 182 tests.

## Reviewer Notes

Reviewed as NEXUS-REV-2026-07-13-006. Independent validation confirmed the Builder Results and Test Summary above: `tsc --noEmit`, ESLint, `esbuild` build, and Vitest (32 files / 182 tests) all pass. `Knowledge` is genuinely immutable — every mutation (`revise`, `approve`, `activate`, `supersede`, `archive`) returns a new frozen instance rather than mutating in place, and revisions are strictly append-only with `Archived` correctly rejecting further revision. `KnowledgeStatus` enforces the exact ratified lifecycle (`Candidate → Approved → Active → Superseded → Archived`, single-step-forward, `Archived` terminal). All five Sprint Owner-specified Memory Capture preconditions are enforced inside the `Knowledge` aggregate's `assertCapturePreconditions`, each independently tested. `KnowledgeService` is correctly thin — no precondition or lifecycle logic lives in the service. `git diff --stat` confirms zero changes to any Sprint 1–11 domain file; RFC-0007, RFC-0006, RFC-0002, RFC-0001, `domain-schema.md`, and the Kernel Canon are all untouched. No event publication, subscription, or consumer was introduced, matching the ratification's deferral.

One Minor finding (F-001): the `knowledge-service-contract.md` corrections go beyond the ratification's narrow per-file Authorized Builder Scope bullet, though every addition matches fields authorized elsewhere in the same ratification and the renames are pure `Knowledge` vocabulary consistent with the ratification's general vocabulary-consistency bullet — a documentation-precision note with no semantic or architectural consequence.

**Remediation review:** Reviewed as NEXUS-REV-2026-07-13-007. TASK-001 verified RESOLVED: the NEXUS-RAT-2026-07-13-003 Ledger entry now carries a non-reinterpretive Factual Addendum recording the implementation basis for the broader `knowledge-service-contract.md` correction. No source or test changes were introduced by the remediation; re-validation confirms TypeScript compile clean, ESLint clean, and Vitest 32 files / 182 tests passing. No open findings remain.

See REVIEW_HISTORY.md § NEXUS-REV-2026-07-13-006 and § NEXUS-REV-2026-07-13-007 for full finding detail and evidence.

## Final Disposition

**Approved** (NEXUS-REV-2026-07-13-007). No architectural violations detected in either review cycle. Aggregate ownership, immutability, the ratified `KnowledgeStatus` lifecycle, and the Sprint Owner's thin-service directive are all preserved. The sole Minor finding (F-001) from NEXUS-REV-2026-07-13-006 is resolved. Sprint 12 review cycle is complete with no open findings.
