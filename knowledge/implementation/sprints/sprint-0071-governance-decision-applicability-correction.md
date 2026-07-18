# Sprint 71 — Governance Decision Applicability Correction

## Status

Approved — `NEXUS-REV-2026-07-17-010` (RFC-0001 §15a Correction Verification; fully closed, zero open findings of any category). Originally Rejected under `NEXUS-REV-2026-07-17-009` (one Category 3, Critical finding, F-001, concerning `knowledge/specifications/rfc-0001-mission-model.md` only — never a defect in this Sprint's source, tests, or this record; resolved by `nexus-plan`'s RFC-0001 §15a correction, independently verified Resolved). Milestone 11's opening Sprint.

## Objective

Implement RFC-0001 v1.2's narrowed definition of "applicable `GovernanceDecision`", excluding a precisely superseded Rejected `GovernanceDecision` from Mission Completion evaluation, strictly within `src/kernel/mission/mission-completion-eligibility.ts` and its direct collaborators.

Sprint 71 SHALL introduce no new production capability, event, mechanism, lifecycle state, or domain concept beyond the narrowed applicability rule itself.

## Architectural Intent

Sprint 70 discovered, and correctly reported rather than silently fixed, a Mission Completion gap: under RFC-0001 v1.1 §15a, a historical Rejected `GovernanceDecision` remained independently blocking even after its Recovery Requirement resolved, re-advancement occurred, and a later Approved `GovernanceDecision` was recorded for the same governed position. `NEXUS-RAT-2026-07-17-009` amended RFC-0001 to v1.2 to resolve this gap through a narrow, exact-attribution supersession rule. Sprint 71 implements that amendment. It does not redesign Mission Completion, Governance Decision, or Recovery Requirement; it narrows one definition — "applicable" — using data already produced by Sprint 61 (`GovernanceDecision`), Sprint 67 (`EngineeringDecisionCorrelation`), and Sprint 69 (`RecoveryRequirement`).

## RFC Coverage

- RFC-0001 v1.2 — Mission Model (Amended by `NEXUS-RAT-2026-07-17-009`; this Sprint implements the amendment)
- RFC-0004 v1.16 — Execution Model (Referenced; `EngineeringDecisionCorrelation`, `RecoveryRequirement`, Recovery-Gated Re-Advancement consumed read-only, unmodified)
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision` consumed read-only, unmodified)

## Ratification

- `NEXUS-RAT-2026-07-17-009` — declares Milestone 10 Complete, amends RFC-0001 to v1.2, opens Milestone 11, and authorizes this Sprint, including the binding Required Test Matrix reproduced below.

## Dependencies

Sprint 71 consumes the following frozen, read-only dependencies through their existing public contracts only:

- Sprint 61 — `GovernanceDecisionSnapshot` (`missionId`, `id`, `value`, `evaluatedAt`) and the existing Blocking/Non-Blocking matrix (frozen, unmodified).
- Sprint 67 — `EngineeringDecisionCorrelationSnapshot` (`missionId`, `engineeringSessionId`, `workflowStepId`, `governanceDecisionId`), `IEngineeringDecisionCorrelationRepository.findByGovernanceDecisionId`/`findByWorkflowPosition`.
- Sprint 69 — `RecoveryRequirementSnapshot` (`missionId`, `engineeringSessionId`, `workflowStepId`, `governanceDecisionId`, `status`, `resolution`), the existing Recovery Requirement repository.
- Sprint 4/61 — `MissionExecutionService`'s existing Mission Completion orchestration and its existing invocation of `assertGovernanceGatedMissionCompletionEligible`/`isGovernanceGatedMissionCompletionEligible`.

Sprint 71 SHALL NOT alter any previously approved behavior owned by Sprint 1 through Sprint 70.

## Authorized Concepts

Sprint 71 may introduce only:

- A supersession check inside (or directly adjacent to, within the same file/module) `mission-completion-eligibility.ts`, determining whether a Blocking `GovernanceDecision` D1 is excluded from the applicable set because it has been superseded by a later Approved `GovernanceDecision` D2, per the exact rule below.
- Any additional read-only repository access (`IEngineeringDecisionCorrelationRepository`, the Recovery Requirement repository) strictly required to evaluate the supersession rule, added as constructor-injected dependencies of the existing eligibility evaluation path — no new aggregate, no new persistence write path, no new event.
- Unit tests proving the Required Test Matrix below.

No modification to any Sprint 1–70 production source is authorized, except the narrow addition described above.

## Supersession Rule (binding, exact text — RFC-0001 v1.2 §15a)

A blocking `GovernanceDecision` D1 is superseded by a later `GovernanceDecision` D2 if, and only if, all of the following hold:

1. D1 and D2 are attributed to the same governed position — the same Mission, the same Engineering Session, and the same Workflow Step — as established by their respective authoritative `EngineeringDecisionCorrelation` records.
2. D1 has outcome `Rejected`.
3. A `RecoveryRequirement` was created from D1 (i.e. `RecoveryRequirement.governanceDecisionId === D1.id`) for that exact governed position.
4. That `RecoveryRequirement` reached `Resolved` through an authoritative accepted recovery outcome.
5. D2 was produced by a subsequent governance re-evaluation of that same governed position after the Recovery Requirement was resolved.
6. D2 has outcome `Approved`.
7. D2 is later than D1 according to the authoritative governance decision ordering (`evaluatedAt`, or an equivalent authoritative ordering signal already present on `GovernanceDecisionSnapshot`).

Supersession SHALL NOT be inferred from chronological order alone. Supersession SHALL NOT cross Mission, Engineering Session, or Workflow Step boundaries. A `GovernanceDecision` concerning a different governed position remains independently applicable regardless of when it was recorded. This rule SHALL NOT be interpreted as authorizing selection of one globally latest `GovernanceDecision`.

## Required Test Matrix (binding, normative — minimum coverage)

1. Rejected D1 → exact `RecoveryRequirement` (created from D1) Resolved → subsequent Approved D2 for the same governed position → D1 excluded from the applicable set; Mission Completion permitted (subject to all other applicable decisions and existing Task-completion rules).
2. A later Rejected D2 for the same governed position does not supersede D1.
3. A later Deferred D2 for the same governed position does not supersede D1.
4. A later Escalation Required D2 for the same governed position does not supersede D1.
5. An Approved decision for a different Workflow Step does not supersede D1.
6. An Approved decision for a different Engineering Session does not supersede D1.
7. An Approved decision for a different Mission does not supersede D1.
8. A `RecoveryRequirement` not caused by D1 does not permit supersession, even if Resolved.
9. An unresolved or Withdrawn `RecoveryRequirement` does not permit supersession.
10. Existing independent-satisfaction behavior (Sprint 61/62, frozen) is unchanged for every non-superseded `GovernanceDecision`.

## Architectural Boundaries

Sprint 71 SHALL NOT:

- modify `GovernanceDecision`, `GovernanceService`, `RecoveryRequirement`, `RecoveryRequirementService`, `EngineeringDecisionCorrelation`, `EngineeringDecisionCorrelationService`, `WorkflowChain`, `WorkflowStep`, `EngineeringSession`, `EngineeringSessionService`, Review, any event, any event consumer, or any projection;
- introduce any new Domain Event, aggregate, lifecycle state, or persistence write path;
- introduce Withdrawn Recovery Requirement eligibility beyond the existing frozen Withdrawn-does-not-resolve semantics;
- introduce any RFC-0012, Planning Policy, or Proposed Mission Plan concept — these remain deferred to a future Milestone 11 Sprint;
- modify `src/hosts` or `src/adapters`.

## Deferred Concepts

- RFC-0012 drafting; Planning Policy; Proposed Mission Plan; Proposed Plan Revision; Planner Attribution; Structural Plan Validation; Planning Diagnostics; Proposal Lifecycle; Proposal Review/Activation Eligibility; Governed Plan Generation; Plan Review/Governance/Activation; Autonomous Planning Integration Validation.
- Any generalized "decision supersession" framework beyond the exact Mission Completion applicability rule above.
- Event publication for supersession determination (no event is authorized).

No placeholder implementation of any deferred concept is authorized.

## Acceptance Criteria (Definition of Done)

- All ten Required Test Matrix items pass.
- Existing Sprint 61/62 tests (independent-satisfaction behavior for non-superseded decisions) remain passing, unmodified in intent.
- No Sprint 1–70 production contract, Host, or Adapter file is found to have drifted, other than the narrowly authorized addition to `mission-completion-eligibility.ts` and its direct collaborators.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

## Builder Responsibilities

Per `NEXUS-RAT-2026-07-17-009`'s Authorized Scope, the Builder SHALL:

1. Implement the Supersession Rule exactly as specified above, strictly within `mission-completion-eligibility.ts` and its direct collaborators.
2. Implement the ten-item Required Test Matrix as dedicated unit tests.
3. Run the full repository validation pipeline.
4. Update Sprint 71 implementation and governance documentation (`IMPLEMENTATION_REPORT.md`).
5. Report implementation outcome, assumptions, limitations, and any architectural deviations ("No architectural deviations." if none) in `IMPLEMENTATION_REPORT.md`. Record Sprint 71's completion in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` per the Constitution's Implementation Manifest requirements (status transition to "Implemented — Pending Reviewer Validation").

The Builder SHALL NOT:

- introduce any Authorized Concept beyond the Supersession Rule and its required tests;
- introduce any Deferred Concept, including as a placeholder, stub, or unused reference;
- modify the Kernel Canon, any RFC, or `REVIEW_HISTORY.md`;
- modify `src/hosts` or `src/adapters`.

## Builder Stop Conditions

The Builder SHALL stop and report if:

- the Supersession Rule cannot be evaluated using only Sprint 61/67/69's existing, frozen public contracts;
- implementing the rule requires a new event, aggregate, lifecycle state, or persistence write path;
- `EngineeringDecisionCorrelation` or `RecoveryRequirement` data does not deterministically resolve the governed position for a given `GovernanceDecision`;
- the rule as specified would produce a result inconsistent with any Required Test Matrix item.

No speculative production change beyond the Supersession Rule is authorized inside Sprint 71.

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` — add a new Sprint 71 section (Scope, Referenced RFCs, Referenced Reference Documents, Assumptions, Limitations, Architectural Deviations, Validation Summary).
- `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md` — status update upon Reviewer certification.
- Do not modify: Kernel Canon; RFC-0004; RFC-0011; `REVIEW_HISTORY.md`. (RFC-0001 is already amended to v1.2 by `NEXUS-RAT-2026-07-17-009`; this Sprint implements it and SHALL NOT further modify RFC-0001 text.)

## Known Limitations (anticipated)

- Supersession under this Sprint applies only to the exact governed-position, exact-causality path defined above; it does not generalize to any other notion of Governance Decision revision, correction, or amendment.
- This Sprint certifies in-memory, single-process Kernel composition only, consistent with all prior Sprints.

These are implementation boundaries, not defects.

## Builder Results

Implemented RFC-0001 v1.2's narrowed applicable `GovernanceDecision` rule for Mission Completion.

Implemented scope:

- Added exact supersession filtering in `src/kernel/mission/mission-completion-eligibility.ts`.
- Excluded only a Rejected `D1` when an exact-position `EngineeringDecisionCorrelation` exists for `D1`, an exact `RecoveryRequirement` caused by `D1` is Resolved, and a later Approved `D2` is correlated to the same Mission, Engineering Session, and Workflow Step after recovery resolution.
- Preserved Deferred and Escalation Required as independently Blocking; preserved every non-superseded `GovernanceDecision` as independently evaluated.
- Added read-only constructor-injected Engineering Decision Correlation and Recovery Requirement repository inputs to `MissionExecutionService`.
- Wired `createKernelServices()` to pass the existing in-memory correlation and recovery repositories into Mission Completion eligibility evaluation.
- Added dedicated unit coverage for all ten Required Test Matrix items.

Out of scope and not implemented:

- No new Domain Event, aggregate, lifecycle state, persistence write path, event consumer, projection, Host surface, or Adapter surface.
- No generalized decision-supersession framework.
- No modification to `GovernanceDecision`, `RecoveryRequirement`, `WorkflowChain`, `WorkflowStep`, `EngineeringSession`, `EngineeringDecisionCorrelation`, Review, event consumers, or projections.

Architectural deviations:

No architectural deviations.

## Reviewer Notes

Reviewed as `NEXUS-REV-2026-07-17-009`. Overall Disposition: **FAIL**. Independently verified that `mission-completion-eligibility.ts`'s new supersession filter implements all seven conditions of `NEXUS-RAT-2026-07-17-009`'s ratified rule exactly — unique-correlation-based governed-position matching (failing closed on zero or ambiguous correlations), `D1` Rejected, an exact-causality Resolved `RecoveryRequirement`, `D2` Approved, `D2` strictly later than both `D1` and the recovery resolution, and non-transitive, position-scoped, non-chronology-only supersession. All ten Required Test Matrix items are present and independently re-executed passing, alongside the full repository suite (630/630 tests, 90 files), `tsc --noEmit`, ESLint, and `npm run build`, all clean, with `git diff --name-only -- src` confirming exactly the three authorized files changed and zero Host/Adapter drift. However, independently reading `knowledge/specifications/rfc-0001-mission-model.md` in full found that only the Version header and Amendment History were updated to v1.2; the operative § 15a section is still headed "(v1.1)" and its body retains, verbatim, the v1.1 sentence declaring Recovery Requirement consideration entirely out of scope and Rejected/Deferred/Escalation Required decisions unconditionally blocking — directly contradicting both the Amendment History three lines above it and this Sprint's own ratified and implemented behavior. One Category 3, Critical Specification Conflict recorded (F-001). This is a defect in the RFC document only, not in this Sprint's source, tests, or this record, all of which correctly implement the already-ratified rule; per the Reviewer's Blocking Rules, the conflict is reported, not resolved. See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-17-009` for the complete review.

### RFC-0001 §15a Correction Verification (`NEXUS-REV-2026-07-17-010`)

Confirmed `git status`/`git diff --name-only -- src test` show zero source or test changes since `NEXUS-REV-2026-07-17-009` — only `nexus-plan`-owned governance artifacts changed. Independently read `rfc-0001-mission-model.md` § 15a in full: retitled "(v1.2)"; the "applicable" definition now references the Supersession Rule; the seven-condition Supersession Rule is reproduced matching `NEXUS-RAT-2026-07-17-009` exactly; the contradictory v1.1 "out of scope"/"blocks unconditionally" sentence is gone. No stray "(v1.1)" heading or contradictory text remains anywhere in the document. Re-verified the implementation independently of F-001: `tsc --noEmit`, ESLint, full suite (630/630 tests, 90 files), `npm run build` all clean; `git diff --name-only -- src` returns exactly the three Sprint-71-authorized files with zero Host/Adapter drift. `F-001` is Resolved. See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-17-010` for the complete verification review.

## Final Disposition

**Approved.** `NEXUS-REV-2026-07-17-010` certified PASS with zero findings of any category. `nexus-plan` applied `NEXUS-RAT-2026-07-17-009`'s exact, already-ratified replacement text to `knowledge/specifications/rfc-0001-mission-model.md` § 15a's body (retitled "(v1.2)"), resolving `NEXUS-REV-2026-07-17-009`'s sole finding (F-001, Critical, Category 3) with zero source, test, or Sprint Implementation Record changes — none were required, since both prior and current reviews independently confirmed this Sprint's implementation already fully and correctly conformed to the ratified Supersession Rule. RFC-0001's Version header, Amendment History, and § 15a body now agree. Full repository validation independently re-executed and passing: `tsc --noEmit`, ESLint, 630/630 tests (90 files), `npm run build`, and a `git diff --name-only -- src` confirming drift limited to exactly the three Sprint-71-authorized files with zero Host/Adapter drift. Sprint 71 is fully closed.

Date: 2026-07-17
Reviewer: Reviewer AI (Claude Code)
Review Reference: `NEXUS-REV-2026-07-17-009` (original, FAIL, one Category 3 Critical finding, RFC document only); `NEXUS-REV-2026-07-17-010` (RFC-0001 §15a Correction Verification, PASS, fully closed)

## Traceability

| Artifact | Reference |
| --- | --- |
| Sprint | Sprint 71 |
| Referenced/Amended RFCs | RFC-0001 v1.2 (Amended); RFC-0004 v1.16, RFC-0011 (Referenced, unmodified) |
| Ratifications | `NEXUS-RAT-2026-07-17-009` (Milestone 10 closure, RFC-0001 v1.2 amendment, Milestone 11 opening, Sprint 71 scope) |
| Reviews | Pending |
| Implementation Plan | `IMPLEMENTATION_PLAN.md` |
| Implementation Manifest | `IMPLEMENTATION_MANIFEST.md` |
| Implementation Report | `IMPLEMENTATION_REPORT.md` |
| Review Report | `REVIEW_HISTORY.md` |
