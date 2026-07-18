# Sprint 74 — Planning Correlation and Review Entry Foundation

## Status

Approved — `NEXUS-REV-2026-07-17-014` (PASS WITH FINDINGS; one Minor Category 1 finding, F-001, plus two Category 6 Observations, F-002/F-003). `BT-074-001` (F-001's Builder Task) independently verified Resolved by `NEXUS-REV-2026-07-17-015`; fully closed with zero open findings of any blocking category (F-002/F-003 remain non-blocking Observations, carried forward). Authorized by `NEXUS-RAT-2026-07-17-012`, corrected by `NEXUS-RAT-2026-07-17-013`. Milestone 11, Initial Capability Sequence step 5 (refined from "Plan Review, Governance, and Activation" by `NEXUS-RAT-2026-07-17-012`).

## Objective

Introduce the `PlanningCorrelation` record — the append-only, attributable association between an exact `ProposedPlanRevision` and the RFC-0006 `Review` initiated for it — and the `Submitted → Under Review` Proposal Lifecycle transition. Sprint 74 introduces no Governance integration, no Activation, and no Domain Event publication.

## Architectural Intent

RFC-0012 defines Planning Correlation as the Planning-domain analogue of RFC-0004's Engineering Decision Correlation: an explicit, immutable, fail-closed record correlating a Proposed Plan Revision with the `Review` and `GovernanceDecision` subsequently produced for it. Milestone 11's opening ratification (`NEXUS-RAT-2026-07-17-009`) originally compressed Review integration, Governance integration, and Activation into a single provisional step, but noted this compression was "subject to revision once RFC-0012 analysis confirms step 5 can safely combine review, governance, and activation without violating ownership boundaries." `NEXUS-RAT-2026-07-17-012` performed that analysis, found the three concerns cannot safely combine into one vertical slice, and narrowed Sprint 74 to Planning Correlation and Review initiation only — establishing the correlation record and the first Proposal Lifecycle transition that depends on an external domain (RFC-0006 `Review`), while deferring Governance correlation (Sprint 75) and Activation (Sprint 76) to their own independently-ratified Sprints.

Sprint 74 reuses `Review` exclusively through its existing, frozen public contract (RFC-0006, Sprint 9/11, unmodified) — it initiates a Review for the exact Proposed Plan Revision identified by the Planning Correlation, but does not consume a terminal Review outcome, does not interpret `ReviewOutcome`, and does not gate any subsequent transition on Review completion. That remains Sprint 75's and RFC-0011's concern.

## RFC Coverage

- RFC-0012 v1.0 — Autonomous Engineering Planning Model (Referenced; `PlanningCorrelation` and the `Submitted → Under Review` transition implement RFC-0012's Planning Correlation and Proposal Lifecycle sections, unmodified)
- RFC-0006 — Engineering Assessment Model (Referenced; `Review` consumed read-only through its existing public contract, unmodified)
- RFC-0001 — Mission Model (Referenced; `missionId` consumed read-only, unchanged from Sprint 72/73)
- RFC-0004 — Execution Model (Referenced; `RoleRegistry`/`executionRoleId` consumed read-only, unchanged from Sprint 72/73)
- RFC-0005 — Domain Event Model (Referenced; causation/correlation identifier shape only — no event publication in this Sprint)
- RFC-0008 — Kernel Adapter Contract (Referenced; Adapter identity consumed read-only, unchanged from Sprint 72/73)

## Ratification

- `NEXUS-RAT-2026-07-17-012` — decomposes Initial Capability Sequence step 5 into Sprints 74–77 and authorizes this Sprint's exact scope, reproduced below.
- `NEXUS-RAT-2026-07-17-013` — corrects a self-contradiction discovered by the Builder during implementation: `NEXUS-RAT-2026-07-17-012` authorized the `Submitted → Under Review` transition while simultaneously prohibiting any modification to Sprint 72/73's frozen `ProposedPlanRevision` lifecycle, which has no `Under Review` value. Sprint 74 is explicitly authorized to additively extend `ProposedPlanRevision`'s existing lifecycle with an `Under Review` state and transition method — mirroring the Sprint 12 → Sprint 14 `KnowledgeStatus` precedent for additive lifecycle extension of a previously frozen aggregate. Every existing Sprint 72/73 transition, method signature, validation rule, and diagnostic remains byte-for-byte unchanged.

## Dependencies

Sprint 74 consumes the following frozen, read-only dependencies through their existing public contracts only:

- Sprint 72's `PlanningPolicy`, `ProposedMissionPlan`, `ProposedTask`, `ProposedTaskDependency`, `PlannerAttribution`, Structural Plan Validation, Planning Diagnostics, and `IProposedMissionPlanRepository`/in-memory implementation — all unmodified.
- Sprint 73's `PlanningService` (`createProposedMissionPlan`, `createProposedPlanRevision`, `submitCurrentRevision`, `withdrawCurrentRevision`) — unmodified.
- RFC-0006 `Review`/`ReviewService` public contract (Sprint 9/11), consumed read-only to initiate a Review — unmodified.
- RFC-0001 `Mission` identity (`missionId` attribution only).
- RFC-0004 `RoleRegistry`/`executionRoleId` (Planner Attribution, as already established by Sprint 72).
- RFC-0008 Adapter identity (Planner Attribution, as already established by Sprint 72).

`ProposedPlanRevision` (Sprint 72) is consumed read-only for its existing `Draft`/`Submitted`/`Withdrawn` behavior, method signatures, validation, and diagnostics — all unmodified — except for the one additive `Under Review` lifecycle extension explicitly authorized by `NEXUS-RAT-2026-07-17-013` (see Authorized Concepts, below).

Sprint 74 SHALL NOT alter any other previously approved behavior owned by Sprint 1 through Sprint 73.

## Authorized Concepts

Sprint 74 may introduce only, within the existing Planning domain module (`src/kernel/planning/`):

- **`PlanningCorrelation`** — an immutable record correlating `missionId`, `ProposedMissionPlanId`, the exact `ProposedPlanRevisionId` under evaluation, Planner Attribution, an RFC-0006 `reviewId` (appended once Review is initiated), and causation/correlation identifiers.
- **`IPlanningCorrelationRepository`** and an in-memory implementation, following this repository's established constructor-injected, snapshot-persistence pattern, with append-only history.
- **Additive `ProposedPlanRevision` lifecycle extension** (authorized by `NEXUS-RAT-2026-07-17-013`) — a new `Under Review` value added to `ProposedPlanRevision`'s existing lifecycle type/enum, and a new transition method (e.g. `markUnderReview()`), reachable only from `Submitted`, rejected from `Draft` or `Withdrawn`, and requiring an associated `PlanningCorrelation` carrying a `reviewId` for the exact same revision. Every existing `Draft → Submitted`, `Draft → Withdrawn`, and `Submitted → Withdrawn` transition, method signature, validation rule, and diagnostic SHALL remain byte-for-byte unchanged.
- **`Submitted → Under Review` transition** — a `PlanningService` operation (or a new, sibling thin service) that initiates an RFC-0006 `Review` for exactly one `Submitted` `ProposedPlanRevision`, creates the corresponding `PlanningCorrelation` record, and invokes the new `ProposedPlanRevision` transition method to move the revision to `Under Review`. No other Proposal Lifecycle transition is authorized.
- **Fail-closed diagnostics** for: missing or ambiguous Proposed Mission Plan, Proposed Plan Revision, or Review reference; Review/Mission identity mismatch against the Proposed Mission Plan's own `missionId`; unresolved Planner Attribution; and a Proposed Mission Plan that has produced a later revision since correlation was requested.
- Kernel composition registration of any new repository/service introduced, following this repository's established pattern, purely additive.
- Unit tests for `PlanningCorrelation` construction, immutability, append-only history, every fail-closed rejection condition, the `Submitted → Under Review` transition (including idempotency for an already-`Under Review` revision), and Planner Attribution enforcement.

No modification to any Sprint 1–73 production source is authorized, **except** the one additive `ProposedPlanRevision` lifecycle extension explicitly authorized by `NEXUS-RAT-2026-07-17-013` above. No other modification to any Sprint 72 or Sprint 73 domain model, value object, service, or validation logic is authorized — Sprint 74 consumes everything else read-only/as-is through a new, additive orchestration and correlation layer.

## Architectural Boundaries

Sprint 74 SHALL NOT:

- consume or interpret a terminal Review outcome (`ReviewOutcome`) — Review completion handling is out of scope;
- implement the `Governed`, `Activated`, `Rejected`, or `Superseded` Proposal Lifecycle states or any transition into or out of them;
- implement `GovernanceDecision` correlation or any RFC-0011 Governance evaluation;
- implement Activation or any conversion of Proposed Task/Proposed Task Dependency into RFC-0001 `Task`/`TaskDependency`;
- invoke, reference as a write path, or modify `MissionPlanningService`, `MissionExecutionService`, `MissionPlan`, `Task`, or `TaskDependency` (RFC-0001, unmodified);
- publish any Domain Event, including any RFC-0012-reserved event name;
- introduce AI plan generation, Adapter invocation, or provider/Adapter selection beyond Sprint 72's existing Planner Attribution data model;
- introduce workflow orchestration, Workflow Chain participation, or Workflow Step assignment;
- modify `GovernanceDecision`, `Review`, `EngineeringDecisionCorrelation`, `RecoveryRequirement`, `WorkflowChain`, `WorkflowStep`, `EngineeringSession`, any event, any event consumer, any projection, `src/hosts`, or `src/adapters`;
- modify any Sprint 72 or Sprint 73 domain model, value object, service, or validation logic **except** the one additive `ProposedPlanRevision` lifecycle extension (`Under Review` state and its transition method) explicitly authorized by `NEXUS-RAT-2026-07-17-013`; every existing Sprint 72/73 transition, method signature, validation rule, and diagnostic SHALL remain byte-for-byte unchanged.

## Deferred Concepts

- Terminal Review outcome handling / `ReviewOutcome` consumption.
- `Governed`, `Activated`, `Rejected`, `Superseded` Proposal Lifecycle states and transitions.
- `GovernanceDecision` correlation and RFC-0011 Governance evaluation (Sprint 75).
- Activation, conversion into RFC-0001 executable objects (Sprint 76).
- Domain Event publication for any RFC-0012-reserved event.
- AI-generated planning, Adapter invocation, provider/Adapter selection.
- Workflow orchestration.
- Autonomous Planning Integration Validation and Milestone 11 closure (Sprint 77).

No placeholder implementation of any deferred concept is authorized.

## Acceptance Criteria (Definition of Done)

- `PlanningCorrelation` is implemented immutably with append-only history.
- The `Submitted → Under Review` transition is implemented and requires Review initiation against exactly one immutable Proposed Plan Revision.
- Every fail-closed rejection condition specified above is enforced and tested.
- Kernel composition registration (if a new service/repository pair is introduced) is additive only.
- Unit tests cover construction, immutability, every rejection condition, transition idempotency, and Planner Attribution enforcement.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.
- No Sprint 1–73 production contract, Host, or Adapter file is found to have drifted, other than the one additive `ProposedPlanRevision` lifecycle extension authorized by `NEXUS-RAT-2026-07-17-013`.
- No Sprint 72 or Sprint 73 domain model, value object, service, or validation logic is found to have been modified beyond that one additive extension; every existing transition, method signature, validation rule, and diagnostic is byte-for-byte unchanged.

## Builder Responsibilities

Per `NEXUS-RAT-2026-07-17-012`'s Authorized Scope, the Builder SHALL:

1. Implement the Authorized Concepts exactly as specified above, strictly within the existing Planning domain module.
2. Implement unit tests covering construction, immutability, every fail-closed rejection condition, transition idempotency, and Planner Attribution enforcement.
3. Run the full repository validation pipeline.
4. Update Sprint 74 implementation and governance documentation (`IMPLEMENTATION_REPORT.md`).
5. Report implementation outcome, assumptions, limitations, and any architectural deviations ("No architectural deviations." if none) in `IMPLEMENTATION_REPORT.md`. Record Sprint 74's completion in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` per the Constitution's Implementation Manifest requirements (status transition to "Implemented — Pending Reviewer Validation").

The Builder SHALL NOT:

- introduce any Authorized Concept beyond this Sprint's scope;
- introduce any Deferred Concept, including as a placeholder, stub, or unused reference;
- modify the Kernel Canon, any RFC, or `REVIEW_HISTORY.md`;
- modify `src/hosts` or `src/adapters`;
- modify any Sprint 72 or Sprint 73 domain model, value object, service, or validation logic beyond the one additive `ProposedPlanRevision` lifecycle extension authorized by `NEXUS-RAT-2026-07-17-013`.

## Builder Stop Conditions

The Builder SHALL stop and report if:

- the `Submitted → Under Review` transition cannot be implemented as an additive extension to `ProposedPlanRevision`'s existing lifecycle type/enum without altering any existing `Draft`/`Submitted`/`Withdrawn` transition, method signature, validation rule, or diagnostic;
- initiating a Review for a Proposed Plan Revision appears to require any `Governed`/`Activated`/`Rejected`/`Superseded` state, `GovernanceDecision`, or Activation behavior;
- a fail-closed rejection condition cannot be represented using a new, additive diagnostic without modifying an existing Sprint 72/73 diagnostic type — report the exact gap rather than silently reusing an ill-fitting existing code or unilaterally expanding an existing set beyond what this Sprint's scope authorizes.

No speculative production change beyond this Sprint's Authorized Concepts is authorized inside Sprint 74.

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` — add a new Sprint 74 section (Scope, Referenced RFCs, Referenced Reference Documents, Assumptions, Limitations, Architectural Deviations, Validation Summary).
- `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md` — status update upon Reviewer certification.
- Do not modify: Kernel Canon; RFC-0001; RFC-0004; RFC-0005; RFC-0006; RFC-0008; RFC-0011; RFC-0012; `REVIEW_HISTORY.md`.

## Known Limitations (anticipated)

- This Sprint does not advance the Proposal Lifecycle beyond `Under Review`; a Proposed Mission Plan still cannot be Governed or Activated until future Milestone 11 Sprints implement those capabilities under their own ratifications.
- This Sprint does not consume or interpret a terminal Review outcome; Review completion handling remains deferred to Sprint 75.
- This Sprint publishes no Domain Event; Planning domain state changes remain externally unobservable through the Event Bus until a future Sprint authorizes event publication.
- This Sprint certifies in-memory, single-process Kernel composition only, consistent with all prior Sprints.

These are implementation boundaries, not defects.

## Builder Results

Implemented by Builder.

Implemented scope:

- Added immutable `PlanningCorrelation` and `PlanningCorrelationId`.
- Added `IPlanningCorrelationRepository` and in-memory implementation with append-only history.
- Added additive `Under Review` lifecycle support and the `Submitted → Under Review` transition path authorized by `NEXUS-RAT-2026-07-17-013`.
- Added `PlanningCorrelationService` for Review initiation, Planning Correlation creation, lifecycle transition persistence, and idempotent already-`Under Review` retry handling.
- Added Kernel composition registration for the new Planning Correlation repository/service.
- Added unit tests for construction, immutability, append-only history, fail-closed rejection conditions, transition idempotency, and Planner Attribution enforcement.

Validation:

- `npm run validate`
- `npm run test:extension-host:build`
- `npx vitest run test\kernel\planning\planning-domain.test.ts test\kernel\planning\planning.service.test.ts test\kernel\planning\planning-correlation.test.ts`

## Reviewer Notes

Reviewed as `NEXUS-REV-2026-07-17-014`. Overall Disposition: **PASS WITH FINDINGS** (one Minor Category 1 finding, two Category 6 Observations, zero Critical/Major/Category 2–5 findings). Independently re-executed the full validation pipeline: `tsc --noEmit`, ESLint, the full test suite (649/649 tests, 94 files, up from 643/93 at Sprint 73's close, consistent with exactly one new test file and six new tests), `npm run build`, and `npm run test:extension-host:build`, all clean. `git status --porcelain -- src test` confirmed drift limited to exactly the Sprint-74-authorized file set — zero Sprint 1–73 production/test drift beyond the two authorized additive edits (`create-kernel-services.ts` registration, and the one `NEXUS-RAT-2026-07-17-013`-authorized `ProposedPlanRevision`/`ProposedMissionPlan` lifecycle extension) — and zero `src/hosts`/`src/adapters` drift. Confirmed by diff inspection that the additive lifecycle extension is minimal and exact: exactly one new `proposalLifecycleStates` value and one new `isAllowedTransition` pair, with every existing Sprint 72/73 transition, method signature, validation rule, and diagnostic byte-for-byte unchanged. Confirmed by import inspection that every Deferred Concept is correctly absent (no `ReviewOutcome` consumption, no `Governed`/`Activated`/`Rejected`/`Superseded` state, no Governance module import, no RFC-0001 executable conversion, no Domain Event publication, no Adapter/workflow orchestration reference).

F-001 (Minor): `ProposedMissionPlan.markCurrentRevisionUnderReview`/`ProposedPlanRevision.transitionTo('Under Review')` are exercised only indirectly through `PlanningCorrelationService.enterReview`, whose own independent `assertSubmittedCurrentRevision` guard prevents any test from reaching the aggregate with a non-`Submitted` revision — so the aggregate-level rejection from `Draft`/`Withdrawn` that `NEXUS-RAT-2026-07-17-013` specifically authorized and bounded is unverified in isolation. Builder Task recommended (add tests only; no production defect).

F-002 and F-003 (Informational Observations): `Review.missionPlanRevision` now carries dual semantics (executable Mission Plan revision vs. Proposed Plan Revision id) depending on caller, worth reconciling before Sprint 76 (Activation); `PlanningCorrelationService`'s constructor retains default-constructed collaborators (lower risk than the Sprint 5 F-006 precedent, since a default `ReviewService()` fails fast via `requireEventBus()` rather than silently diverging). Neither requires action this Sprint.

See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-17-014` for the complete review.

**`BT-074-001` Resolution Verification (`NEXUS-REV-2026-07-17-015`):** Independently verified `git diff -- test/kernel/planning/planning-domain.test.ts` contains exactly the three test cases `BT-074-001` required — `markCurrentRevisionUnderReview` success from `Submitted`, and rejection (`InvalidProposalLifecycleTransitionError`) from `Draft` and from `Withdrawn` — each invoked directly at the aggregate level, bypassing `PlanningCorrelationService`, closing F-001's exact coverage gap. Confirmed no production source file changed (`git status --porcelain -- src test` limited to the one test file) and no pre-existing test was modified or removed. Re-executed the full validation pipeline: `tsc --noEmit`, ESLint, the full test suite (652/652 tests, 94 files, up from 649/94 at `NEXUS-REV-2026-07-17-014`, consistent with exactly three new tests in the same file), `npm run build`, and `npm run test:extension-host:build`, all clean. Overall Disposition: **PASS**, zero new findings. F-002/F-003 (Category 6 Observations) are untouched and remain carried forward, non-blocking. See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-17-015` for the complete review.

## Final Disposition

**Approved.** `NEXUS-REV-2026-07-17-014` certified PASS WITH FINDINGS (one Minor Category 1 finding, F-001, plus two Informational Category 6 Observations, F-002/F-003; zero Critical/Major/Category 2–5 findings). `nexus-sprint` translated F-001 into `BT-074-001` (`builder-task.md`), the Builder implemented it as a strictly additive, test-only change (three new aggregate-level unit tests, zero production source modification), and `NEXUS-REV-2026-07-17-015` independently re-verified it Resolved. Full repository validation independently re-executed and passing across both review cycles: `tsc --noEmit`, ESLint, 652/652 tests (94 files), `npm run build`, `npm run test:extension-host:build`, and `git status --porcelain -- src test` confirming drift limited to the Sprint-74-authorized file set with zero Sprint 1–73 or Host/Adapter drift. Sprint 74 is fully closed with zero open findings of any blocking category (F-002/F-003 remain non-blocking Observations, carried forward for future Sprint awareness). Milestone 11 Initial Capability Sequence step 6 (Proposal Governance Integration, Sprint 75) requires its own future Sprint Owner scope ratification via `nexus-plan`.

Date: 2026-07-17
Reviewer: Reviewer AI (Claude Code)
Review Reference: `NEXUS-REV-2026-07-17-014` (PASS WITH FINDINGS, one Minor finding); `NEXUS-REV-2026-07-17-015` (BT-074-001 Resolution Verification, PASS, fully closed)

## Traceability

| Artifact | Reference |
| --- | --- |
| Sprint | Sprint 74 |
| Referenced RFCs | RFC-0012 v1.0 (Referenced, unmodified); RFC-0006 (Referenced, unmodified); RFC-0001, RFC-0004, RFC-0005, RFC-0008 (Referenced, unmodified) |
| Ratifications | `NEXUS-RAT-2026-07-17-012` (Initial Capability Sequence step 5 decomposition; Sprint 74 scope authorization); `NEXUS-RAT-2026-07-17-013` (additive `Under Review` lifecycle correction) |
| Reviews | `NEXUS-REV-2026-07-17-014` (PASS WITH FINDINGS; one Minor, two Informational; approved); `NEXUS-REV-2026-07-17-015` (BT-074-001 Resolution Verification; PASS; fully closed) |
| Implementation Plan | `IMPLEMENTATION_PLAN.md` |
| Implementation Manifest | `IMPLEMENTATION_MANIFEST.md` |
| Implementation Report | `IMPLEMENTATION_REPORT.md` |
| Review Report | `REVIEW_HISTORY.md` |
