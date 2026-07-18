# Sprint 58 — Governance Recovery and Blocking-State Foundation

**Status:** ✅ Approved — `NEXUS-REV-2026-07-16-009` (fully closed; one Category 6, Informational Observation, zero Builder Tasks; zero open findings). RFC-0004 amended to v1.12 by `NEXUS-RAT-2026-07-16-007`; Sprint scope authorized by `NEXUS-RAT-2026-07-16-008`. Milestone 9's seventh Sprint.

---

## Objective

Implement `RecoveryRequirement` as authorized by RFC-0004 v1.12: an explicit, attributable record that a Rejected `GovernanceDecision` (RFC-0011) has generated engineering remediation work, associated immutably with the Mission, Engineering Session, Workflow Step, and originating `GovernanceDecision` that produced it. This Sprint is the first implementation of Recovery Requirement and the immediate successor to Sprint 57's Governance-Gated Advancement.

```text
GovernanceDecision (Rejected)
        ↓
GovernanceDecisionRecorded
        ↓
RecoveryRequirement (Open)
        ↓
resolveRecoveryRequirement / withdrawRecoveryRequirement
        ↓
RecoveryRequirement (Resolved | Withdrawn) — terminal
```

---

## RFC Coverage

### Primary

- RFC-0004 v1.12 — Execution Model
  - "Recovery Requirement" § Architectural Responsibilities, Identity and Uniqueness, Required Attribution, Creation, Lifecycle, Boundaries.

### Referenced

- RFC-0011 — Engineering Governance Model v1.1 (`GovernanceDecision` consumed as immutable, read-only input; RFC-0011 unmodified).
- RFC-0010 — Kernel Boundaries.
- Sprint 57 — Governance-Gated Workflow Advancement (precedent `GovernanceDecisionRecorded` consumer pattern, consumed unmodified).

No finalized RFC or previously approved vertical slice may be redefined.

---

## Ratification References

- `NEXUS-RAT-2026-07-15-013`, `NEXUS-RAT-2026-07-15-014` — open Milestone 9; ratify RFC-0011 v1.0 Final.
- `NEXUS-RAT-2026-07-16-005`/`-006` — RFC-0004 v1.11 amendment and Sprint 57 scope (Governance-Gated Advancement, frozen, consumed read-only).
- `NEXUS-RAT-2026-07-16-007` — RFC-0004 v1.12 amendment: adds Recovery Requirement, its identity/uniqueness, required attribution, creation rules, lifecycle, and boundaries.
- `NEXUS-RAT-2026-07-16-008` — Sprint 58 scope ratification: governs this Sprint's entire authorized scope, including the Recovery Resolution Contract, Recovery Withdrawal Contract, and Lifecycle Immutability rules.

---

## Dependencies

Sprint 58 consumes the following frozen, read-only dependencies:

- Sprint 52–56: `GovernanceService`, `GovernanceDecision`, `GovernanceDecisionRecorded` (existing shape and behavior, consumed read-only, unmodified).
- Sprint 57: the `GovernanceDecisionRecorded` consumer pattern (precedent for this Sprint's Recovery-triggering consumer shape), unmodified.
- Existing `EventBusContract`/`DomainEvent` envelope infrastructure, unmodified (consumption only; this Sprint publishes no new Domain Event).

Sprint 58 SHALL NOT alter any previously approved behavior owned by Sprint 39 through Sprint 57 except through additive extension as specified below.

---

## Authorized Concepts

Sprint 58 may introduce only:

- `RecoveryRequirement` domain aggregate: immutable identity; immutable Mission/Engineering Session/Workflow Step/`GovernanceDecision` identity references; creation timestamp; causality/correlation identifiers where available.
- A narrowly scoped `GovernanceDecisionRecorded` consumer that creates a Recovery Requirement only when the persisted `GovernanceDecision` is Rejected.
- `IRecoveryRequirementRepository` and an in-memory implementation enforcing the (Mission, Engineering Session, Workflow Step, `GovernanceDecision`) uniqueness key.
- A thin `RecoveryRequirementService` exposing exactly `resolveRecoveryRequirement(...)` and `withdrawRecoveryRequirement(...)`, per the Recovery Resolution Contract and Recovery Withdrawal Contract below.
- Minimal `createKernelServices` wiring change strictly required to supply the new operation's dependencies.
- Unit and integration tests satisfying the Required Test Matrix.

No additional Governance or Workflow capability is authorized.

---

## Recovery Requirement (binding, per RFC-0004 v1.12)

### Identity, Uniqueness, and Attribution

- A Recovery Requirement SHALL possess an immutable identity, assigned at creation and never reassigned.
- Creation SHALL be deterministic and idempotent: at most one Recovery Requirement per (Mission, Engineering Session, Workflow Step, `GovernanceDecision`) combination. Repeated handling of the same Rejected `GovernanceDecision` SHALL return the existing record, never create a duplicate.
- A new Recovery Requirement MAY be created only when a distinct `GovernanceDecision` produces a new Rejection for that combination.
- Every Recovery Requirement SHALL preserve immutable references to Mission identity, Engineering Session identity, Workflow Step identity, the originating `GovernanceDecision` identity, a creation timestamp, and causality/correlation identifiers where available.
- A Recovery Requirement SHALL NOT duplicate or reinterpret `GovernanceDecision` diagnostics; it references the originating `GovernanceDecision` by identity only.

### Creation

- A Recovery Requirement MAY be created only when the governing `GovernanceDecision` is **Rejected**.
- **Deferred** SHALL NOT create a Recovery Requirement (it resolves automatically once its missing input exists, per RFC-0011).
- **Escalation Required** SHALL NOT create a Recovery Requirement (it requires Sprint Owner/Ratification resolution, per RFC-0011 — external authority, not automatic recovery).
- **Approved** SHALL NOT create a Recovery Requirement.
- `GovernanceService` SHALL NOT own, create, or mutate Recovery Requirement state as a side effect of producing a `GovernanceDecision`.

### Recovery Resolution Contract

- `resolveRecoveryRequirement(...)` SHALL require an immutable reference to the authoritative accepted engineering outcome (an accepted outcome or Evidence reference) demonstrating that remediation has completed.
- The resulting resolution record SHALL preserve: the Recovery Requirement identity; the accepted-outcome or Evidence reference; a resolution timestamp; attribution; causality and correlation identifiers, where available.
- `RecoveryRequirementService` SHALL NOT itself determine whether remediation is sufficient; it SHALL consume an already-accepted outcome supplied by the caller and delegate transition validation (current status, terminality) entirely to the `RecoveryRequirement` aggregate.

### Recovery Withdrawal Contract

- `withdrawRecoveryRequirement(...)` SHALL require: an authoritative decision or Ratification reference; a withdrawal reason; a withdrawal timestamp; attribution; causality and correlation identifiers, where available.
- Withdrawal SHALL NOT occur from free-form caller intent alone; the authoritative decision/Ratification reference is a required input.

### Lifecycle and Lifecycle Immutability

- Statuses: **Open** (initial) → **Resolved** | **Withdrawn**, both terminal.
- After transition to Resolved or Withdrawn: the lifecycle state SHALL be terminal; transition metadata SHALL remain immutable; a repeated, identical transition request MAY return the existing record rather than fail; a conflicting repeated transition request (`Resolved → Withdrawn`, `Withdrawn → Resolved`) SHALL fail deterministically.

---

## Architectural Boundaries

Sprint 58 SHALL NOT:

- generate remediation plans, steps, or content through AI or any automated planning mechanism;
- mutate `WorkflowChain` topology, `WorkflowStep` definitions, or Workflow Chain Execution;
- permit `GovernanceService`, `GovernanceDecision`, or `GovernanceEscalation` to own, create, or mutate Recovery Requirement state, or vice versa;
- redefine or reinterpret any `GovernanceDecision` value's meaning, precondition, or permitted downstream effect;
- introduce any differentiated Engineering Session state for Deferred or Escalation Required beyond Sprint 57's existing uniform Blocking classification;
- introduce Governed Mission Completion or any Mission completion precondition change;
- publish a Recovery Requirement Domain Event (for example, `RecoveryRequirementRecorded`) — not authorized by RFC-0004 v1.12;
- modify `src/hosts` or `src/adapters`.

Sprint 39 through Sprint 57 contracts remain frozen and may only be consumed or additively extended, never redefined.

---

## Deferred Concepts

- Recovery Requirement Domain Event publication (candidate future Sprint, mirroring Sprint 53 preceding Sprint 56).
- AI-generated remediation plan generation.
- Governed Mission Completion; any Mission completion precondition change (candidate Sprint 59, unscheduled; requires an RFC-0001 amendment; depends on this Sprint's Recovery Requirement existing).
- Differentiated Rejected/Deferred/Escalation-Required Engineering Session state beyond Sprint 57's uniform Blocking classification.
- Downstream Host/Adapter surfacing of Recovery Requirement state.
- Any event subscription/consumer beyond this Sprint's single narrowly scoped `GovernanceDecisionRecorded` consumer.

No placeholder implementation of any deferred concept is authorized.

---

## Required Test Matrix (binding, normative)

Tests SHALL cover at minimum:

1. Rejected `GovernanceDecision` creates exactly one Open Recovery Requirement with correct attribution.
2. Deferred `GovernanceDecision` creates no Recovery Requirement.
3. Escalation Required `GovernanceDecision` creates no Recovery Requirement.
4. Approved `GovernanceDecision` creates no Recovery Requirement.
5. Duplicate/repeated handling of the same Rejected `GovernanceDecision` returns the existing record; no duplicate created.
6. A distinct `GovernanceDecision` (new rejection) for the same Mission/Session/Step creates a new, separate Recovery Requirement.
7. `Open → Resolved` succeeds via `resolveRecoveryRequirement` given a valid accepted-outcome reference; further transitions on a Resolved record are rejected.
8. `Open → Withdrawn` succeeds via `withdrawRecoveryRequirement` given a valid authoritative reference; further transitions on a Withdrawn record are rejected.
9. Recovery Requirement stores no copied/re-derived `GovernanceDecision` diagnostics — identity reference only.
10. `GovernanceService`, `GovernanceDecision`, `WorkflowChain`, `EventBusContract`, `DomainEvent` remain byte-for-byte unmodified.
11. Full repository validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.
12. Resolution without an accepted-outcome reference is rejected.
13. Withdrawal without authoritative decision attribution is rejected.
14. Resolution metadata (accepted-outcome reference, timestamp, attribution, causality/correlation) is preserved and immutable after the transition.
15. Withdrawal metadata (authoritative reference, reason, timestamp, attribution, causality/correlation) is preserved and immutable after the transition.
16. Repeating the identical terminal transition (same target status, same reference) is idempotent or deterministically rejected, per the service contract.
17. A conflicting terminal transition is rejected: `Resolved → Withdrawn` and `Withdrawn → Resolved` both fail deterministically.

---

## Acceptance Criteria (Definition of Done)

- `RecoveryRequirement` is created only for a Rejected `GovernanceDecision`; Deferred, Escalation Required, and Approved never create one.
- Creation is deterministic and idempotent per the (Mission, Engineering Session, Workflow Step, `GovernanceDecision`) uniqueness key.
- `resolveRecoveryRequirement` and `withdrawRecoveryRequirement` enforce their respective required-reference contracts and delegate transition validity to the aggregate.
- The lifecycle is limited to Open → Resolved | Withdrawn, both terminal, with immutable transition metadata and deterministic rejection of conflicting repeated transitions.
- `GovernanceService`, `GovernanceDecision`, `GovernanceEscalation`, `WorkflowChain`, `WorkflowStep`, `EventBusContract`, and `DomainEvent` remain unmodified.
- No `src/hosts` or `src/adapters` file is modified.
- No Recovery Requirement Domain Event is introduced, including as a stub.
- Every row of the Required Test Matrix is covered by a dedicated test.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

---

## Builder Responsibilities

Per `NEXUS-RAT-2026-07-16-008`'s Authorized Vertical Slice, the Builder SHALL:

1. Introduce the `RecoveryRequirement` domain aggregate with immutable identity and immutable Mission/Engineering Session/Workflow Step/`GovernanceDecision` attribution.
2. Introduce `IRecoveryRequirementRepository` and an in-memory implementation enforcing the uniqueness key and idempotent creation.
3. Introduce a narrowly scoped `GovernanceDecisionRecorded` consumer that creates a Recovery Requirement only for a Rejected `GovernanceDecision`, owning no other logic.
4. Introduce the thin `RecoveryRequirementService` with exactly `resolveRecoveryRequirement(...)` and `withdrawRecoveryRequirement(...)`, implementing the Recovery Resolution Contract and Recovery Withdrawal Contract exactly as specified.
5. Enforce Lifecycle Immutability: terminal states, immutable transition metadata, deterministic rejection of conflicting repeated transitions.
6. Add minimal `createKernelServices` wiring for the new consumer, repository, and service.
7. Add all seventeen Required Test Matrix rows above.
8. Update Sprint 58 implementation and governance documentation (`IMPLEMENTATION_REPORT.md`).
9. Run the full repository validation pipeline.

The Builder SHALL NOT:

- generate AI remediation plans or content of any kind;
- mutate `WorkflowChain` topology or `WorkflowStep` definitions;
- modify `GovernanceService`, `GovernanceDecision`, `GovernanceEscalation`, `EventBusContract`, or `DomainEvent`;
- introduce a Recovery Requirement Domain Event;
- introduce Governed Mission Completion or any Mission completion precondition change;
- introduce any differentiated Engineering Session state;
- modify Host or Adapter code;
- modify the Kernel Canon, RFC-0011, RFC-0004 (beyond what `NEXUS-RAT-2026-07-16-007` already records), or `REVIEW_HISTORY.md`;
- implement any Deferred Concept, including as a placeholder, stub, or unused reference.

Report implementation outcome, assumptions, limitations, and any architectural deviations ("No architectural deviations." if none) in `IMPLEMENTATION_REPORT.md`. Record Sprint 58's completion in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` per the Constitution's Implementation Manifest requirements (status transition to "Implemented — Pending Reviewer Validation").

---

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` — add a new Sprint 58 section (Scope, Referenced RFCs, Referenced Reference Documents, Assumptions, Limitations, Architectural Deviations, Validation Summary).
- `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md` — status update upon Reviewer certification.
- Document: the `RecoveryRequirement` aggregate and its shape; the Recovery Resolution and Recovery Withdrawal contracts as implemented; the narrowly scoped `GovernanceDecisionRecorded` consumer; the uniqueness/idempotency guarantee; deferred concepts (event publication, Sprint 59); known limitations; test and validation summary.
- Do not modify: Kernel Canon; RFC-0011; other finalized RFCs; `REVIEW_HISTORY.md`. (RFC-0004 itself is already amended to v1.12 by `NEXUS-RAT-2026-07-16-007`; the Builder SHALL NOT further modify RFC-0004 text.)

---

## Known Limitations (anticipated)

- This Sprint records Recovery Requirement state only; it does not publish a Domain Event for Recovery Requirement creation or transition — a candidate future Sprint, mirroring how Sprint 53's decision foundation preceded Sprint 56's event publication.
- Governed Mission Completion (Sprint 59) remains unauthorized; it depends on this Sprint's Recovery Requirement existing as a queryable "unresolved recovery" condition but is not itself addressed here.
- The `GovernanceDecisionRecorded` consumer introduced here is narrowly scoped to Recovery Requirement creation; no general-purpose event subscription/consumer framework is introduced.

These are implementation boundaries, not defects.

---

## Reserved Sections

### Builder Results

Implemented.

- Added `RecoveryRequirement` with immutable identity and immutable Mission / Engineering Session / Workflow Step / `GovernanceDecision` attribution.
- Added `IRecoveryRequirementRepository` and `InMemoryRecoveryRequirementRepository`, enforcing idempotent uniqueness by `(Mission, Engineering Session, Workflow Step, GovernanceDecision)`.
- Added `RecoveryRequirementGovernanceDecisionConsumer`, creating Recovery Requirements only for persisted Rejected `GovernanceDecision` records.
- Added `RecoveryRequirementService` exposing exactly `resolveRecoveryRequirement(...)` and `withdrawRecoveryRequirement(...)`.
- Added minimal `createKernelServices` wiring for the new repository, service, and consumer.
- Added Required Test Matrix coverage in `test/kernel/execution/recovery-requirement.test.ts` plus Kernel composition coverage.
- Validation passed: targeted Sprint 58 tests (22 tests), `npm run validate` (TypeScript compile, ESLint, Vitest 84 files / 499 tests, esbuild), and `npm run test:extension-host:build`.

No architectural deviations.

### Reviewer Notes

**Status:** PASS

Reviewer validation complete (`NEXUS-REV-2026-07-16-009`). Confirmed `RecoveryRequirement` carries immutable identity and immutable Mission/Engineering Session/Workflow Step/`GovernanceDecision` attribution; creation is deterministic and idempotent via `InMemoryRecoveryRequirementRepository`'s attribution-key uniqueness index; a Recovery Requirement is created only for a Rejected `GovernanceDecision`, verified by dedicated tests showing Deferred, Escalation Required, and Approved each create none. Confirmed the Recovery Resolution Contract and Recovery Withdrawal Contract enforce their required-reference fields exactly as ratified, with `RecoveryRequirementService` performing no sufficiency/authority judgment and delegating all transition validity to the aggregate. Confirmed Lifecycle Immutability: both terminal states, immutable transition metadata across repeated identical requests, and deterministic rejection of conflicting repeated transitions in both directions. Confirmed via `git diff --stat`, source inspection, and a dedicated negative test (M10) that `GovernanceService`, `GovernanceDecision`, `WorkflowChain`, `EventBusContract`, and `DomainEvent` are byte-for-byte unmodified and contain no `RecoveryRequirement` reference; no `src/hosts` or `src/adapters` file was touched; no Recovery Requirement Domain Event was introduced. All seventeen Required Test Matrix rows are covered (`recovery-requirement.test.ts` M1–M17). Independent re-validation confirmed `tsc --noEmit`, ESLint, targeted Vitest (22/22), `npm run test` (84 files / 499 tests, matching the Builder's reported count), `npm run build`, and `npm run test:extension-host:build` all pass cleanly.

One Category 6, Informational Observation recorded (`NEXUS-REV-2026-07-16-009-F-001`): `RecoveryRequirementService`'s constructor defaults to a private, unshared `InMemoryRecoveryRequirementRepository()`, the same accepted pattern previously identified in Sprint 5's `EvidenceService`. Unreachable in the certified Kernel composition; no Builder Task generated.

See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-16-009` for the complete review, including the full Architectural Compliance Summary and Deferred Concept Validation.

### Final Disposition

**Approved.** Sprint 58 is approved and fully closed with zero open findings of any blocking category. One Category 6, Informational Observation (`NEXUS-REV-2026-07-16-009-F-001`) is non-blocking and requires no Builder action. No further Milestone 9 Sprint is Current: Sprint 59 (Governed Mission Completion) remains unauthorized pending its own future RFC-0001 amendment and Sprint Owner scope ratification via `nexus-plan`.

Date: 2026-07-16
Reviewer: Reviewer AI (Claude Code)
Review Reference: `NEXUS-REV-2026-07-16-009`

---

## Traceability

| Artifact | Reference |
| --- | --- |
| Sprint | Sprint 58 |
| Primary RFCs | RFC-0004 v1.12 (amended by `NEXUS-RAT-2026-07-16-007`), RFC-0011 v1.1 (Referenced, unmodified) |
| Ratifications | `NEXUS-RAT-2026-07-16-007` (RFC-0004 v1.12 amendment), `NEXUS-RAT-2026-07-16-008` (Sprint 58 scope) |
| Reviews | `NEXUS-REV-2026-07-16-009` (**Approved**, fully closed) |
| Implementation Plan | `IMPLEMENTATION_PLAN.md` |
| Implementation Manifest | `IMPLEMENTATION_MANIFEST.md` |
| Implementation Report | `IMPLEMENTATION_REPORT.md` |
| Review Report | `REVIEW_HISTORY.md` |
