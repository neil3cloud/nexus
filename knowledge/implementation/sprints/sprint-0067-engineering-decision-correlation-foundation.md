# Sprint 67 — Engineering Decision Correlation Foundation

## Status

✅ Approved — `NEXUS-REV-2026-07-17-003` (Approved with Findings), Documentation Task `DOC-TASK-067-001` Resolved by `NEXUS-REV-2026-07-17-004`. Ratified by `NEXUS-RAT-2026-07-17-003`, implementing RFC-0004 v1.14 (`NEXUS-RAT-2026-07-17-002`).

## Objective

Introduce `EngineeringDecisionCorrelation` — an explicit, attributable, append-only record correlating a governed Workflow position (Mission, Engineering Session, Workflow Step) with the Review and `GovernanceDecision` subsequently produced for it — resolving the inbound half of the Milestone 10 attribution gap. Sprint 65/66 resolved the outbound half (`EngineeringSession` publishes its own Workflow position); Sprint 67 resolves the inbound half (a Mission-scoped Review/`GovernanceDecision` can be deterministically traced back to the governed Workflow position that produced it). This Sprint introduces no Workflow mutation, no event consumption, no auto-wiring of any existing consumer, and no change to Review or `GovernanceDecision` ownership.

## RFC Coverage

- RFC-0004 v1.14 (Partial — implements exactly the Engineering Decision Correlation section)
- RFC-0006 — Engineering Assessment Model (Referenced; `Review` consumed read-only)
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision` consumed read-only)
- RFC-0005 — Domain Event Model (Referenced; existing envelope conventions only)

## Ratification

- `NEXUS-RAT-2026-07-16-015` — Milestone 10 Objective, Architectural Boundary, Initial Capability Sequence (unmodified; Sequence revised to insert this Sprint ahead of Event-Driven Workflow Advancement).
- `NEXUS-RAT-2026-07-16-018`/`-019` — Prerequisite Foundation (Sprint 65/66, frozen; resolved the outbound half of the attribution gap this Sprint's inbound half complements).
- `NEXUS-RAT-2026-07-17-002` — RFC-0004 v1.14 amendment, defining Engineering Decision Correlation.
- `NEXUS-RAT-2026-07-17-003` — authorizes this Sprint, including the binding Creation Authority resolution below.

## Authorized Concepts

- `EngineeringDecisionCorrelation` aggregate: immutable identity; immutable Mission/Engineering-Session/Workflow-Step attribution set at creation; append-only, at-most-once `reviewId` and `governanceDecisionId` associations.
- `IEngineeringDecisionCorrelationRepository`/in-memory implementation.
- `EngineeringDecisionCorrelationService`:
  - `beginCorrelation({ engineeringSessionId, workflowStepId })` — caller-supplied `engineeringSessionId`/`workflowStepId`; `missionId` resolved exclusively through the existing, unmodified Mission Engineering Group reverse-lookup query (Sprint 65 precedent), failing closed on missing/ambiguous association.
  - `associateReview({ correlationId, reviewId })` — reads the referenced `Review` read-only; rejects (fails closed, correlation unchanged) if the Review's `missionId` does not match the correlation's Mission; idempotent-safe on repeated identical association.
  - `associateGovernanceDecision({ correlationId, governanceDecisionId })` — same contract as `associateReview`, against `GovernanceDecision`.
  - Deterministic, read-only, bidirectional lookup: by `reviewId`; by `governanceDecisionId`; by (Mission, Engineering Session, Workflow Step).
- Additive `createKernelServices()` composition wiring (construction and registration only).

## Creation Authority (binding, per `NEXUS-RAT-2026-07-17-003`)

Correlation creation and association are explicit, caller-invoked operations only. This Sprint SHALL NOT wire `beginCorrelation`/`associateReview`/`associateGovernanceDecision` into `EngineeringSessionService`, `ReviewService`, or `GovernanceService` as an automatic side effect of any existing operation. No existing service gains a new call to `EngineeringDecisionCorrelationService`.

## Deferred Concepts

- Event-Driven Workflow Advancement (Sprint 68) and Recovery Workflow Automation (Sprint 69) — this Sprint provides their future attribution source only; neither is implemented or authorized here.
- Wiring `GovernanceGatedWorkflowAdvancementConsumer`/`RecoveryRequirementGovernanceDecisionConsumer` as automatic `EventBusContract` subscribers.
- Autonomous Engineering Integration Validation (Milestone 10 Step 4).
- Host or Adapter surfacing, correlation caching, durable persistence, distributed consumers, event checkpoints, consumer offsets, dead-letter queues, retry policies.
- Any change to `EngineeringSession`, `EngineeringSessionService`, `EngineeringSessionStateProjection`, `WorkflowChain`, Mission Engineering Group, Review, `GovernanceDecision`, `RecoveryRequirement`, or `Mission`.

## Acceptance Criteria

- `EngineeringDecisionCorrelation` identity and Mission/Engineering-Session/Workflow-Step attribution are immutable after `beginCorrelation`; Mission attribution is resolved exclusively through Mission Engineering Group, never caller-supplied.
- `associateReview`/`associateGovernanceDecision` are idempotent-safe and reject a Mission mismatch, failing closed with the correlation left unchanged.
- Lookup by `reviewId`, by `governanceDecisionId`, and by (Mission, Engineering Session, Workflow Step) is deterministic and fails closed (explicit absence result) when no correlation exists.
- No `EngineeringSession`, `EngineeringSessionService`, `WorkflowChain`, Mission Engineering Group, Review, `GovernanceDecision`, `RecoveryRequirement`, `Mission`, or `src/hosts`/`src/adapters` file is modified.
- No RFC other than RFC-0004 (already amended to v1.14) is amended.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

## Builder Responsibilities

- Implement exactly the Authorized Concepts above under `src/kernel/execution/` (or an equivalently scoped location consistent with Recovery Requirement's Sprint 59 placement), mirroring the Recovery Requirement/`RecoveryRequirementService` pattern for a caller-invoked, read-only-repository-consuming Kernel service.
- Cover the Required Test Matrix implied by the Acceptance Criteria above: creation attribution immutability, Mission-mismatch rejection for each association, idempotent re-association, fail-closed lookup in all three directions, and Kernel composition/production-drift protection consistent with prior Sprints' patterns.
- Stop and report, per `IMPLEMENTATION_CONSTITUTION.md` "Documentation Before Code," if any Authorized Concept cannot be implemented without touching a file this Sprint forbids, or without inferring attribution from a source not authorized above.

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` documents implemented capability, RFC coverage, assumptions, limitations, and validation summary, consistent with prior Sprints.
- No RFC, Kernel Canon, or Ratification file is modified by the Builder; RFC-0004 v1.14 and both ratifications are already recorded by `nexus-plan`.

## Known Limitations

- This Sprint does not itself unblock Event-Driven Workflow Advancement or Recovery Workflow Automation — it supplies their attribution source only. Wiring correlation creation into a production call site, and wiring either existing consumer as an automatic `EventBusContract` subscriber, are explicitly out of scope and reserved for Sprint 68/69, each requiring its own future Sprint Owner scope ratification.

## Builder Results

Implemented.

- Added `EngineeringDecisionCorrelation`, `EngineeringDecisionCorrelationId`, snapshots, errors, repository contract/in-memory repository, service contract, and `EngineeringDecisionCorrelationService`.
- `beginCorrelation` resolves Mission attribution exclusively through Mission Engineering Group reverse lookup from the caller-supplied `engineeringSessionId`.
- `associateReview` and `associateGovernanceDecision` validate referenced Mission identity read-only, reject mismatch without partial effect, and preserve append-only idempotent associations.
- Added deterministic lookup by `reviewId`, by `governanceDecisionId`, and by Mission/Engineering Session/Workflow Step, returning explicit absence for missing or ambiguous lookup.
- Wired `createKernelServices()` additively with no automatic call sites in `EngineeringSessionService`, `ReviewService`, or `GovernanceService`.
- Added Sprint 67 tests for the required matrix and composition/forbidden-drift protection.

Validation performed:

- `npm run compile`
- `npx vitest run test\kernel\execution\engineering-decision-correlation.test.ts`
- `npm run validate`
- `npm run test:extension-host:build`

## Reviewer Notes

Reviewed as `NEXUS-REV-2026-07-17-003`. Overall Disposition: PASS WITH FINDINGS. Independently re-verified in source that `EngineeringDecisionCorrelation`'s identity and Mission/Engineering-Session/Workflow-Step attribution are immutable after creation; that `beginCorrelation` resolves Mission attribution exclusively through the existing, unmodified Mission Engineering Group reverse lookup; that `associateReview`/`associateGovernanceDecision` are idempotent-safe, Mission-match-validated, order-enforced (Review before GovernanceDecision), and fail closed with the correlation left unchanged on any mismatch or conflicting reassociation; and that lookup by `reviewId`, `governanceDecisionId`, and Workflow position fails closed on absence. Independently re-executed `tsc --noEmit`, ESLint, `npm run test` (89 files / 588 tests), `npm run build`, and `npm run test:extension-host:build`, all passing, exactly matching the Builder's reported counts. Confirmed no forbidden file (`EngineeringSession`, `EngineeringSessionService`, `WorkflowChain`, Mission Engineering Group, Review, Governance, `RecoveryRequirement`, `Mission`, `src/hosts`, `src/adapters`) was touched. One Category 4, Minor Documentation Drift finding (F-001: two orphaned Sprint 66 Notes bullets misplaced under Sprint 67's `IMPLEMENTATION_MANIFEST.md` section, one factually incorrect for Sprint 67) and two Category 6, Informational Observations (O-001: `S67-7`'s name overstates what it tests — position-key ambiguity is structurally unreachable through the current repository contract, by design; O-002: the Review-before-GovernanceDecision ordering invariant is correctly implemented but not directly tested) are recorded; none are blocking. See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-17-003` for the complete review.

## Final Disposition

**Approved.** `NEXUS-REV-2026-07-17-003` certified Approved with Findings (zero Category 1–3/5 findings; one Category 4, Minor Documentation Drift finding requiring `DOC-TASK-067-001`; two Category 6 Observations, no Builder Task). `NEXUS-REV-2026-07-17-004` independently verified `DOC-TASK-067-001`'s completion — the orphaned Sprint 66 Notes bullets are removed from `IMPLEMENTATION_MANIFEST.md`'s Sprint 67 section, no source/test/RFC/Ratification file was touched, and the full validation pipeline (89 files / 588 tests) passes with no regression — and certified PASS with zero remaining findings of any category. Sprint 67 is fully closed. Its implementation is frozen as the attribution source for Event-Driven Workflow Advancement (Sprint 68) and Recovery Workflow Automation (Sprint 69), each requiring its own future `nexus-plan` Sprint scope proposal. O-001/O-002 remain outstanding, informational, non-blocking.
