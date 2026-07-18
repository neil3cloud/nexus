# Sprint 60 — Recovery-Gated Re-Advancement

**Status:** ✅ Approved — `NEXUS-REV-2026-07-16-011` (fully closed; one Category 4, Informational Documentation Drift finding and one Category 6, Informational Observation, zero Builder Tasks blocking; zero open findings of any blocking category). RFC-0004 amended to v1.13 by `NEXUS-RAT-2026-07-16-010`; Sprint scope authorized by `NEXUS-RAT-2026-07-16-011`. Milestone 9's ninth Sprint.

---

## Objective

Implement RFC-0004 v1.13's Recovery-Gated Re-Advancement Eligibility: when Governance-Gated Advancement's (v1.11) governing `GovernanceDecision` is Rejected, consult the Recovery Requirement (v1.12) for the exact (Mission, Engineering Session, Workflow Step, `GovernanceDecision`) attribution key; if it is Resolved with a present `acceptedOutcomeReference`, restore Advancement Eligibility for evaluation by the existing Governance-Gated Advancement authority instead of unconditionally failing.

```text
GovernanceDecision = Rejected
        ↓
RecoveryRequirement lookup (read-only)
        ↓
Resolved + acceptedOutcomeReference present + exact attribution match
        ↓
Advancement Eligibility restored (evaluation only — not automatic advancement)
```

---

## RFC Coverage

### Primary

- RFC-0004 v1.13 — Execution Model ("Recovery-Gated Re-Advancement Eligibility" §, new).

### Referenced

- RFC-0004 v1.11 — Governance-Gated Advancement (`assertNonBlockingGovernanceDecision`, `EngineeringSession.advanceWorkflowAfterGovernanceDecision`; consumed and extended, not redefined).
- RFC-0004 v1.12 — Recovery Requirement (`RecoveryRequirement`, `IRecoveryRequirementRepository.findByAttributionKey`, Recovery Resolution Contract's `acceptedOutcomeReference`; consumed read-only, unmodified).
- RFC-0011 — Engineering Governance Model v1.1 (`GovernanceDecision` consumed as immutable, read-only input; unmodified).
- Sprint 57 — Governance-Gated Workflow Advancement (direct structural precedent and integration point; extended, not redefined).
- Sprint 58 — Governance Recovery and Blocking-State Foundation (`RecoveryRequirement` aggregate, repository, Recovery Resolution Contract; frozen, consumed read-only).

No finalized RFC or previously approved vertical slice may be redefined.

---

## Ratification References

- `NEXUS-RAT-2026-07-16-010` — RFC-0004 v1.13 amendment: Recovery-Gated Re-Advancement Eligibility.
- `NEXUS-RAT-2026-07-16-011` — Sprint 60 scope ratification: governs this Sprint's entire authorized scope, including the three binding Refinements (mandatory production repository injection, resolution-authority fail-closed validation, pure eligibility evaluation) and the Required Behavioral Matrix.

---

## Dependencies

Sprint 60 consumes the following frozen, read-only dependencies:

- Sprint 57: `EngineeringSession.advanceWorkflowAfterGovernanceDecision`, the private `assertNonBlockingGovernanceDecision` function, and `EngineeringSessionService`'s existing optional-repository-injection pattern (existing shape, extended additively, not redefined).
- Sprint 58: `RecoveryRequirement`, `IRecoveryRequirementRepository`/`InMemoryRecoveryRequirementRepository` (in particular `findByAttributionKey`), and the Recovery Resolution Contract's `acceptedOutcomeReference` field (existing shape and behavior, consumed read-only).
- Sprint 59: Recovery Requirement Domain Events (unaffected; this Sprint introduces no new event and does not consume these events).

Sprint 60 SHALL NOT alter any previously approved behavior owned by Sprint 39 through Sprint 59 except through the additive extension specified below.

---

## Authorized Concepts

Sprint 60 may introduce only:

- An optional constructor-injected `IRecoveryRequirementRepository` on `EngineeringSessionService`, used exclusively to call `findByAttributionKey({ missionId, engineeringSessionId, workflowStepId, governanceDecisionId })` ahead of invoking `EngineeringSession.advanceWorkflowAfterGovernanceDecision` — read-only; no repository mutation; no `RecoveryRequirementService` invocation.
- A pure, deterministic eligibility function (replacing or wrapping the existing `assertNonBlockingGovernanceDecision`) accepting the `GovernanceDecisionSnapshot` and an optional `RecoveryRequirementSnapshot`, implementing exactly the Required Behavioral Matrix below.
- `createKernelServices()` wiring so `EngineeringSessionService` always receives the shared, production `IRecoveryRequirementRepository` instance.
- Unit and integration tests satisfying the Required Test Matrix.

No additional Governance, Recovery Requirement, or Workflow capability is authorized.

---

## Required Behavioral Matrix (binding, per `NEXUS-RAT-2026-07-16-011`)

| Governance Decision | Recovery Requirement | Result |
| --- | --- | --- |
| Approved | Any or none | Existing approved path unchanged |
| Rejected | Missing | Blocking |
| Rejected | Open | Blocking |
| Rejected | Withdrawn | Blocking |
| Rejected | Resolved without `acceptedOutcomeReference` | Blocking (fail closed) |
| Rejected | Resolved with exact attribution and `acceptedOutcomeReference` present | Eligible for normal advancement evaluation |
| Deferred | Any | Blocking |
| Escalation Required | Any | Blocking |

A Recovery Requirement whose attribution key does not exactly match the Mission, Engineering Session, Workflow Step, and originating `GovernanceDecision` under evaluation SHALL be treated as absent (Missing). Restored eligibility SHALL NOT itself advance the workflow; `EngineeringSession.advanceWorkflowAfterGovernanceDecision`'s existing delegation to the unmodified `advanceWorkflow` remains the sole mechanism producing an Advancement Result.

---

## Architectural Boundaries

Sprint 60 SHALL NOT:

- modify `RecoveryRequirement`'s lifecycle, identity, or attribution;
- modify `RecoveryRequirementService`, `RecoveryRequirementGovernanceDecisionConsumer`, the Recovery Resolution Contract, or the Recovery Withdrawal Contract;
- modify `GovernanceDecision`'s lifecycle or semantics, or `GovernanceService`;
- modify `WorkflowChain` or `WorkflowStep`;
- modify Manual, Automatic/Event-Driven, or Review-Gated Advancement;
- introduce any event subscriber or consumer;
- modify `src/hosts` or `src/adapters`;
- introduce Governed Mission Completion or any Mission completion precondition change.

Sprint 39 through Sprint 59 contracts remain frozen and may only be consumed or additively extended, never redefined.

---

## Deferred Concepts

- Advancement eligibility for Withdrawn Recovery Requirements.
- Event subscriptions/consumers of Recovery Requirement or Governance Decision events.
- Governed Mission Completion; any Mission completion precondition change (still unscheduled; requires its own future RFC-0001 amendment).
- Any differentiated Deferred/Escalation-Required treatment beyond uniform Blocking.
- Downstream Host/Adapter surfacing of Recovery-Gated Re-Advancement.

No placeholder implementation of any deferred concept is authorized.

---

## Required Test Matrix (binding, normative)

Tests SHALL cover at minimum:

1. Every row of the Required Behavioral Matrix above, exercised as a dedicated test.
2. A Resolved Recovery Requirement at a mismatched attribution key (different Mission, Engineering Session, Workflow Step, or `GovernanceDecision`) does not restore eligibility for the position under evaluation.
3. The eligibility function is verified pure: given identical inputs it is deterministic, and a dedicated test confirms no repository or persistence call occurs within it.
4. `createKernelServices()` wires the shared, production `IRecoveryRequirementRepository` into `EngineeringSessionService` (integration-level test).
5. `RecoveryRequirement`, `RecoveryRequirementService`, `GovernanceDecision`, `GovernanceService`, `WorkflowChain` remain byte-for-byte unmodified.
6. Manual, Automatic/Event-Driven, and Review-Gated Advancement remain unaffected (regression test).
7. Full repository validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

---

## Acceptance Criteria (Definition of Done)

- Every row of the Required Behavioral Matrix holds exactly as specified.
- A Resolved Recovery Requirement restores Advancement Eligibility only for the exact attribution key that produced it; it never automatically advances the workflow.
- `RecoveryRequirement`, `RecoveryRequirementService`, `GovernanceDecision`, `GovernanceService`, `WorkflowChain`, and `WorkflowStep` remain otherwise unmodified.
- No `src/hosts` or `src/adapters` file is modified.
- Every row of the Required Test Matrix is covered by a dedicated test.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

---

## Builder Responsibilities

Per `NEXUS-RAT-2026-07-16-011`'s Authorized Vertical Slice, the Builder SHALL:

1. Add an optional constructor-injected `IRecoveryRequirementRepository` to `EngineeringSessionService`, used solely within `advanceWorkflowAfterGovernanceDecision` to call `findByAttributionKey` ahead of delegating to `EngineeringSession.advanceWorkflowAfterGovernanceDecision`.
2. Introduce a pure, deterministic eligibility function implementing exactly the Required Behavioral Matrix, replacing or wrapping `assertNonBlockingGovernanceDecision`, with no repository access, no persistence, and no mutation of either `GovernanceDecision` or `RecoveryRequirement` state.
3. Update `createKernelServices()` so `EngineeringSessionService` always receives the shared, production `IRecoveryRequirementRepository` instance.
4. Add all Required Test Matrix rows above.
5. Update Sprint 60 implementation and governance documentation (`IMPLEMENTATION_REPORT.md`).
6. Run the full repository validation pipeline.

The Builder SHALL NOT:

- modify `RecoveryRequirement`, `RecoveryRequirementService`, `RecoveryRequirementGovernanceDecisionConsumer`, the Recovery Resolution Contract, or the Recovery Withdrawal Contract;
- modify `GovernanceDecision`, `GovernanceService`, `GovernanceEscalation`, `WorkflowChain`, or `WorkflowStep`;
- modify Manual, Automatic/Event-Driven, or Review-Gated Advancement;
- introduce any event subscription or consumer;
- modify Host or Adapter code;
- modify the Kernel Canon, RFC-0004, RFC-0011, or `REVIEW_HISTORY.md`;
- implement any Deferred Concept, including as a placeholder, stub, or unused reference.

Report implementation outcome, assumptions, limitations, and any architectural deviations ("No architectural deviations." if none) in `IMPLEMENTATION_REPORT.md`. Record Sprint 60's completion in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` per the Constitution's Implementation Manifest requirements (status transition to "Implemented — Pending Reviewer Validation").

---

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` — add a new Sprint 60 section (Scope, Referenced RFCs, Referenced Reference Documents, Assumptions, Limitations, Architectural Deviations, Validation Summary).
- `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md` — status update upon Reviewer certification.
- Document: the pure eligibility function's exact behavior per the Required Behavioral Matrix; the read-only repository lookup in `EngineeringSessionService`; the production `createKernelServices()` wiring; deferred concepts (Withdrawn eligibility, event consumption, Governed Mission Completion); known limitations; test and validation summary.
- Do not modify: Kernel Canon; RFC-0004; RFC-0011; `REVIEW_HISTORY.md`.

---

## Known Limitations (anticipated)

- This Sprint restores Advancement Eligibility only; it does not automatically advance a workflow position, publish any event, or notify any consumer of the restored eligibility.
- Withdrawn Recovery Requirements remain Blocking; extending eligibility to Withdrawn is a candidate future Sprint requiring its own RFC amendment.
- Governed Mission Completion remains unauthorized; it is not addressed by this Sprint.

These are implementation boundaries, not defects.

---

## Reserved Sections

### Builder Results

Implemented the authorized Recovery-Gated Re-Advancement vertical slice.

- Added pure deterministic Recovery-Gated Re-Advancement eligibility evaluation for the Required Behavioral Matrix.
- Added read-only exact-attribution `IRecoveryRequirementRepository.findByAttributionKey(...)` lookup to `EngineeringSessionService.advanceWorkflowAfterGovernanceDecision(...)`.
- Extended `EngineeringSession.advanceWorkflowAfterGovernanceDecision(...)` to consume the optional Recovery Requirement snapshot without mutating `GovernanceDecision` or `RecoveryRequirement`.
- Wired `createKernelServices()` so `EngineeringSessionService` receives the shared production Recovery Requirement repository.
- Added tests for every matrix row, mismatched attribution, pure deterministic eligibility, production wiring, and unaffected Manual / Automatic/Event-Driven / Review-Gated Advancement.
- Repository validation passed: TypeScript compile, ESLint, Vitest (84 files / 517 tests), esbuild, and extension-host bundle build.

No architectural deviations.

### Reviewer Notes

**Status:** PASS

Reviewer validation complete (`NEXUS-REV-2026-07-16-011`). Confirmed `isGovernanceDecisionAdvancementEligible(...)` implements every row of the Required Behavioral Matrix exactly, including fail-closed behavior for a Resolved Recovery Requirement missing its `acceptedOutcomeReference` and Blocking treatment of Missing/Open/Withdrawn Recovery Requirement states and mismatched attribution (Refinement 2). Confirmed the function is pure — no repository access, no persistence, no mutation of either input snapshot — verified by source inspection and a dedicated determinism test (Refinement 3). Confirmed the read-only `findByAttributionKey` lookup is confined to `EngineeringSessionService`, invoked only for a Rejected `GovernanceDecision`. Confirmed `createKernelServices()` injects the single shared `InMemoryRecoveryRequirementRepository` instance into `EngineeringSessionService`, matching the instance used by `RecoveryRequirementService`/`RecoveryRequirementGovernanceDecisionConsumer` (Refinement 1). Confirmed restored eligibility never itself advances the workflow — the existing, unmodified `advanceWorkflow(...)` delegation remains the sole Advancement Result mechanism. Confirmed via `git diff --stat`, source inspection, and a dedicated regression test that `RecoveryRequirement`, `RecoveryRequirementService`, `RecoveryRequirementGovernanceDecisionConsumer`, the Recovery Resolution/Withdrawal Contracts, `GovernanceDecision`, `GovernanceService`, `WorkflowChain`, and RFC-0011 remain byte-for-byte unmodified; no `src/hosts` or `src/adapters` file was touched; no event subscriber was introduced; Manual, Automatic/Event-Driven, and Review-Gated Advancement are unaffected. Independent re-validation confirmed `tsc --noEmit`, ESLint, targeted Vitest (96/96), `npm run test` (84 files / 517 tests, matching the Builder's reported count), `npm run build`, and `npm run test:extension-host:build` all pass cleanly.

Two Informational findings recorded, neither blocking: `NEXUS-REV-2026-07-16-011-F-001` (Category 4, Documentation Drift — `IMPLEMENTATION_MANIFEST.md`'s Sprint 59 status line remains stale; pre-existing, not introduced by Sprint 60; recommended as a future Documentation Task since `IMPLEMENTATION_MANIFEST.md` is outside this review's Repository State Update ownership) and `NEXUS-REV-2026-07-16-011-F-002` (Category 6, Observation — cosmetic test indentation inconsistency in `engineering-session.test.ts`, no functional or CI impact). Sprint 60 is fully closed with zero open findings of any blocking category.

See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-16-011` for the complete review, including the full Architectural Compliance Summary and Deferred Concept Validation.

### Final Disposition

**Approved.** Sprint 60 is approved and fully closed with zero open findings of any blocking category. Two Informational findings (`NEXUS-REV-2026-07-16-011-F-001`, `-F-002`) are non-blocking; `-F-001` is recommended as a future Documentation Task, `-F-002` requires no action. No further Milestone 9 Sprint is Current: the next candidate capability (event subscriptions/consumers, Withdrawn eligibility, or Governed Mission Completion) remains unscheduled pending a future `nexus-plan` cycle.

Date: 2026-07-16
Reviewer: Reviewer AI (Claude Code)
Review Reference: `NEXUS-REV-2026-07-16-011`

---

## Traceability

| Artifact | Reference |
| --- | --- |
| Sprint | Sprint 60 |
| Primary RFCs | RFC-0004 v1.13 (new, Recovery-Gated Re-Advancement Eligibility), RFC-0004 v1.11/v1.12 (Referenced, unmodified), RFC-0011 v1.1 (Referenced, unmodified) |
| Ratifications | `NEXUS-RAT-2026-07-16-010` (RFC-0004 v1.13 amendment), `NEXUS-RAT-2026-07-16-011` (Sprint 60 scope) |
| Reviews | `NEXUS-REV-2026-07-16-011` (**Approved**, fully closed) |
| Implementation Plan | `IMPLEMENTATION_PLAN.md` |
| Implementation Manifest | `IMPLEMENTATION_MANIFEST.md` |
| Implementation Report | `IMPLEMENTATION_REPORT.md` |
| Review Report | `REVIEW_HISTORY.md` |
