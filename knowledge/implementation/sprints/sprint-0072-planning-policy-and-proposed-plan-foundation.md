# Sprint 72 — Planning Policy and Proposed Plan Foundation

## Status

Approved — `NEXUS-REV-2026-07-17-012` (PASS; zero open findings of any category). `BT-072-001`/`BT-072-002` (the two Minor Category 1 findings from `NEXUS-REV-2026-07-17-011`) independently verified Resolved. Ratified by `NEXUS-RAT-2026-07-17-010`. Milestone 11, Initial Capability Sequence step 3.

## Objective

Implement the foundational, non-executable Planning domain defined by RFC-0012 v1.0 — Autonomous Engineering Planning Model: Planning Policy, `ProposedMissionPlan`, `ProposedPlanRevision`, `ProposedTask`, `ProposedTaskDependency`, Planner Attribution, the `Draft`/`Submitted`/`Withdrawn` Proposal Lifecycle foundation, and Structural Plan Validation.

Sprint 72 SHALL introduce no Review integration, Governance integration, Activation, Domain Event publication, or workflow orchestration. It establishes the speculative planning data model and its own internal validation only.

## Architectural Intent

RFC-0012 v1.0 (ratified Final by `NEXUS-RAT-2026-07-17-010`) owns the Autonomous Engineering Planning domain: a Proposed Mission Plan is speculative, non-executable content, structurally and behaviorally independent of RFC-0001's executable `MissionPlan`/`Task`/`TaskDependency` until Activation. Sprint 72 implements the data model and structural validation layer only — the part of RFC-0012 that requires no interaction with `Review` (RFC-0006), `GovernanceDecision` (RFC-0011), or `MissionPlanningService` (RFC-0001). The remaining Proposal Lifecycle states (`Under Review`, `Governed`, `Activated`, `Rejected`, `Superseded`), Planning Correlation's Review/Governance association, and Activation itself are explicitly deferred to future Milestone 11 Sprints (steps 4–6), each requiring its own Sprint Owner scope ratification.

## RFC Coverage

- RFC-0012 v1.0 — Autonomous Engineering Planning Model (Planning Policy, Proposed Mission Plan, Proposed Plan Revision, Proposed Task, Proposed Task Dependency, Planner Attribution, Proposal Lifecycle foundation, Structural Plan Validation)
- RFC-0004 — Execution Model (Referenced; `RoleRegistry`/`executionRoleId` and Adapter identity consumed read-only for Planner Attribution; unmodified)
- RFC-0001 — Mission Model (Referenced; `missionId` consumed read-only for Mission attribution; unmodified — no `MissionPlan`/`Task`/`TaskDependency` interaction)

## Ratification

- `NEXUS-RAT-2026-07-17-010` — ratifies RFC-0012 v1.0 Final and authorizes this Sprint's exact scope, reproduced below.

## Dependencies

Sprint 72 consumes the following frozen, read-only dependencies through their existing public contracts only, where referenced at all:

- RFC-0001 `Mission` identity (for `missionId` attribution only — no `MissionPlan`, `Task`, or `TaskDependency` type, contract, or service is read, written, or referenced).
- RFC-0004 `RoleRegistry`/`executionRoleId` (for Planner Attribution's `executionRoleId` field — read-only role lookup, if implemented; MAY instead be deferred to accept an unvalidated identifier string in this foundation Sprint if full `RoleRegistry` integration is not yet required by any Sprint 72 acceptance criterion — Builder SHALL document which approach was taken).
- RFC-0008 Adapter identity (for Planner Attribution's `adapterId` field — reference only, no Adapter invocation).

Sprint 72 SHALL NOT alter any previously approved behavior owned by Sprint 1 through Sprint 71.

## Authorized Concepts

Sprint 72 may introduce only, within a new, independent Planning domain module (e.g. `src/kernel/planning/`):

- **Planning Policy** — deterministic, read-only constraint data (RFC-0012 §Planning Policy), consumed by Structural Plan Validation and Proposal submission eligibility. Planning Policy SHALL NOT modify Mission Objective and SHALL NOT grant or substitute for Governance approval authority.
- **`ProposedMissionPlan`** — immutable `ProposedMissionPlanId`, immutable `missionId` reference, Planner Attribution, current Proposal Lifecycle state, and an ordered, append-only collection of Proposed Plan Revisions.
- **`ProposedPlanRevision`** — immutable `ProposedPlanRevisionId`, owning `ProposedMissionPlanId`, monotonically increasing revision number, immutable Proposed Task/Proposed Task Dependency collection, Planner Attribution, creation timestamp, and causality/correlation identifiers.
- **`ProposedTask`** and **`ProposedTaskDependency`** — separate, immutable types (RFC-0012 §Proposed Task and Proposed Task Dependency). SHALL NOT reuse, inherit, or be coerced into RFC-0001's `Task`/`TaskDependency`.
- **Planner Attribution** — immutable value object with `executionRoleId`, `actorType` (`Human`|`Adapter`), `actorId`, `adapterId` (required iff `actorType = Adapter`), optional `engineeringSessionId`, optional `executionSessionId`, `generatedAt`, and causality/correlation identifiers, exactly as specified in RFC-0012 §Planner Attribution.
- **Proposal Lifecycle foundation** — exactly the `Draft`, `Submitted`, and `Withdrawn` states and the transitions `Draft → Submitted`, `Draft → Withdrawn`, `Submitted → Withdrawn`. No other state or transition is authorized this Sprint.
- **Structural Plan Validation** — missing-`ProposedTaskId`-reference rejection, self-dependency rejection, duplicate-dependency rejection, and direct/transitive cycle rejection (Option A cycle validation, matching the approach ratified for RFC-0001 `MissionPlan`, Sprint 3), run before `Draft → Submitted` and exposed for reuse by a future Activation Sprint.
- **Planning Diagnostics** — deterministic diagnostics for invalid Proposed Mission Plan/Revision definitions, Structural Plan Validation failures, and invalid Proposal Lifecycle transitions, scoped to the states authorized this Sprint.
- A repository contract (e.g. `IProposedMissionPlanRepository`) and in-memory implementation for Proposed Mission Plans and Revisions, following this repository's established constructor-injection/snapshot-persistence pattern.
- Unit tests for every authorized concept's construction, immutability, validation, and diagnostics.

No modification to any Sprint 1–71 production source is authorized.

## Architectural Boundaries

Sprint 72 SHALL NOT:

- implement the `Under Review`, `Governed`, `Activated`, `Rejected`, or `Superseded` Proposal Lifecycle states or any transition into or out of them;
- implement Planning Correlation's `reviewId`/`governanceDecisionId` association fields, or any interaction with `Review` (RFC-0006) or `GovernanceDecision` (RFC-0011);
- implement Activation or any conversion of Proposed Task/Proposed Task Dependency into RFC-0001 `Task`/`TaskDependency`;
- invoke, reference as a write path, or modify `MissionPlanningService`, `MissionExecutionService`, `MissionPlan`, `Task`, or `TaskDependency` (RFC-0001, unmodified);
- publish any Domain Event, including any RFC-0012-reserved event name;
- introduce workflow orchestration, Workflow Chain participation, or Workflow Step assignment;
- introduce AI plan generation, Adapter invocation, or provider/Adapter selection;
- modify `GovernanceDecision`, `Review`, `EngineeringDecisionCorrelation`, `RecoveryRequirement`, `WorkflowChain`, `WorkflowStep`, `EngineeringSession`, any event, any event consumer, any projection, `src/hosts`, or `src/adapters`.

## Deferred Concepts

- `Under Review`, `Governed`, `Activated`, `Rejected`, `Superseded` Proposal Lifecycle states and transitions.
- Planning Correlation's Review/Governance association fields (the Planning Correlation record type itself MAY be defined structurally this Sprint if useful for the Proposed Plan Revision data model, but SHALL carry no `reviewId`/`governanceDecisionId` behavior and SHALL NOT be wired to any Review or Governance contract).
- Review execution, Governance evaluation, Activation, conversion into RFC-0001 executable objects.
- Domain Event publication for any RFC-0012-reserved event (`ProposedMissionPlanCreated`, `ProposedPlanRevisionCreated`, `ProposedPlanRevisionSubmitted`, `ProposedPlanRevisionWithdrawn`, `ProposedPlanRevisionRejected`, `ProposedPlanRevisionSuperseded`, `ProposedMissionPlanActivated`).
- Workflow orchestration.
- Governed Plan Generation; Plan Review, Governance, and Activation; Autonomous Planning Integration Validation (Initial Capability Sequence steps 4–6).

No placeholder implementation of any deferred concept is authorized.

## Acceptance Criteria (Definition of Done)

- Planning Policy, `ProposedMissionPlan`, `ProposedPlanRevision`, `ProposedTask`, `ProposedTaskDependency`, and Planner Attribution are implemented exactly as specified in RFC-0012 §Planning Policy, §Proposed Mission Plan, §Planner Attribution.
- The `Draft`/`Submitted`/`Withdrawn` Proposal Lifecycle foundation is implemented with deterministic, validated transitions; no other state is reachable.
- Structural Plan Validation rejects missing references, self-dependencies, duplicate dependencies, and cycles (direct and transitive), and runs as a precondition of `Draft → Submitted`.
- A submitted revision (and any state reachable from it) is immutable; a lifecycle or content change always produces a new `ProposedPlanRevision`.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.
- No Sprint 1–71 production contract, Host, or Adapter file is found to have drifted.

## Builder Responsibilities

Per `NEXUS-RAT-2026-07-17-010`'s Authorized Scope, the Builder SHALL:

1. Implement the Authorized Concepts exactly as specified above, strictly within a new, independent Planning domain module.
2. Implement unit tests covering construction, immutability, Structural Plan Validation (all four rejection categories), and Proposal Lifecycle foundation transitions.
3. Run the full repository validation pipeline.
4. Update Sprint 72 implementation and governance documentation (`IMPLEMENTATION_REPORT.md`).
5. Report implementation outcome, assumptions, limitations, and any architectural deviations ("No architectural deviations." if none) in `IMPLEMENTATION_REPORT.md`. Record Sprint 72's completion in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` per the Constitution's Implementation Manifest requirements (status transition to "Implemented — Pending Reviewer Validation").

The Builder SHALL NOT:

- introduce any Authorized Concept beyond this Sprint's scope;
- introduce any Deferred Concept, including as a placeholder, stub, or unused reference;
- modify the Kernel Canon, any RFC, or `REVIEW_HISTORY.md`;
- modify `src/hosts` or `src/adapters`.

## Builder Stop Conditions

The Builder SHALL stop and report if:

- Planning Policy, Proposed Mission Plan, Proposed Plan Revision, Proposed Task, Proposed Task Dependency, or Planner Attribution as specified in RFC-0012 v1.0 cannot be implemented without touching Sprint 1–71 production source;
- implementing the `Draft`/`Submitted`/`Withdrawn` lifecycle foundation appears to require any `Under Review`/`Governed`/`Activated`/`Rejected`/`Superseded` state, Review, Governance, or Activation behavior;
- Structural Plan Validation's Option A cycle-validation approach cannot be implemented independently of RFC-0001 `MissionPlan`'s existing cycle validation without duplicating production logic that should instead be shared — report the conflict rather than either duplicating or reaching into RFC-0001's frozen implementation.

No speculative production change beyond this Sprint's Authorized Concepts is authorized inside Sprint 72.

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` — add a new Sprint 72 section (Scope, Referenced RFCs, Referenced Reference Documents, Assumptions, Limitations, Architectural Deviations, Validation Summary).
- `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md` — status update upon Reviewer certification.
- Do not modify: Kernel Canon; RFC-0001; RFC-0004; RFC-0005; RFC-0006; RFC-0008; RFC-0011; `REVIEW_HISTORY.md`. RFC-0012 is already Final by `NEXUS-RAT-2026-07-17-010`; this Sprint implements a subset of it and SHALL NOT modify RFC-0012 text.

## Known Limitations (anticipated)

- This Sprint implements only the foundation of RFC-0012's Proposal Lifecycle; a Proposed Mission Plan cannot be Reviewed, Governed, or Activated until future Milestone 11 Sprints implement those capabilities under their own ratifications.
- This Sprint certifies in-memory, single-process Kernel composition only, consistent with all prior Sprints.

These are implementation boundaries, not defects.

## Builder Results

Implemented Sprint 72 exactly within the authorized independent Planning domain boundary.

Implemented source:

- `src/kernel/planning/planning-policy.ts`
- `src/kernel/planning/proposed-mission-plan.ts`
- `src/kernel/planning/proposed-plan-revision.ts`
- `src/kernel/planning/proposed-task.ts`
- `src/kernel/planning/proposed-task-dependency.ts`
- `src/kernel/planning/planner-attribution.ts`
- `src/kernel/planning/proposed-mission-plan.repository.ts`
- Planning identifiers, diagnostics, errors, and snapshot types under `src/kernel/planning/`.

Implemented tests:

- `test/kernel/planning/planning-domain.test.ts`
- `test/kernel/planning/proposed-mission-plan.repository.test.ts`

Builder notes:

- Planner Attribution normalizes `executionRoleId` through the existing RFC-0004 `RoleId` value object and accepts the identifier read-only; no Role Registry integration was added because Sprint 72 does not require registry lookup.
- Adapter planner attribution normalizes `adapterId` through the existing RFC-0008 `AdapterId` value object; no Adapter invocation or provider selection was added.
- Structural Plan Validation is implemented independently in the Planning domain and does not call or modify RFC-0001 `MissionPlan`, `Task`, or `TaskDependency`.
- No Review, Governance, Activation, Domain Event publication, workflow orchestration, Host, or Adapter integration was introduced.

Validation summary:

- `npm run validate` passed.
- `npm run test:extension-host:build` passed.
- Host/Adapter drift check passed: no `src/hosts` or `src/adapters` file changed.

## Reviewer Notes

Reviewed as `NEXUS-REV-2026-07-17-011`. Overall Disposition: **PASS WITH FINDINGS**. Independently re-executed the full validation pipeline: `tsc --noEmit`, ESLint, the full test suite (637/637 tests, 92 files, up from 630/90 at Sprint 71), `npm run build`, and `npm run test:extension-host:build`, all clean. `git status --porcelain -- src test` confirmed drift is limited to exactly the twelve new Planning-domain source files and two new test files; zero Sprint 1–71 production/test drift and zero Host/Adapter drift. Verified by direct inspection that every Authorized Concept is present (Planning Policy, the four Proposed data types kept structurally independent of RFC-0001's `Task`/`TaskDependency`, Planner Attribution for both Human and Adapter actors, the exact `Draft`/`Submitted`/`Withdrawn` lifecycle with no other reachable state, and Structural Plan Validation covering missing-reference, self-dependency, duplicate-dependency, and transitive-cycle rejection) and every Deferred Concept is correctly absent (no Planning Correlation Review/Governance fields, no Activation or RFC-0001 conversion, no Domain Event publication, no Kernel/Host/Adapter wiring — confirmed via import inspection across every file in `src/kernel/planning/`). Two Minor, non-blocking Category 1 findings were recorded: F-001 (`PlanningPolicy.requireMissionId` is accepted, stored, and defaulted but never enforced by any validation path, and is structurally incapable of having observable effect since `ProposedMissionPlan` already unconditionally requires a valid `missionId`) and F-002 (three of the eight `PlanningDiagnosticCode` union members — `InvalidProposedMissionPlanDefinition`, `InvalidProposedPlanRevisionDefinition`, `InvalidProposalLifecycleTransition` — are declared but never constructed as `PlanningDiagnostic` values anywhere; the corresponding failures are reported only via thrown exceptions). Neither finding affects RFC-0012 conformance, this Sprint's authorized scope, or any Deferred Concept boundary. A non-blocking Category 6 Observation was also recorded: lifecycle transitions (`submitCurrentRevision`/`withdrawCurrentRevision`) are implemented by minting a new, incrementally-numbered `ProposedPlanRevision` carrying forward identical content, rather than mutating a state field on the same revision in place — a legitimate, RFC-0012-compliant design choice, but one the future Planning Correlation Sprint will need to account for when defining "the exact revision under evaluation." See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-17-011` for the complete review.

## Final Disposition

**Approved.** `NEXUS-REV-2026-07-17-011` certified PASS WITH FINDINGS (two Minor Category 1 findings, F-001/F-002, both non-blocking dead/unenforced schema surface). `nexus-sprint` translated both into `BT-072-001`/`BT-072-002` (`builder-task.md`), the Builder implemented both as strictly subtractive/narrowing corrective fixes with zero new capability, and `NEXUS-REV-2026-07-17-012` independently re-verified both Resolved — `grep -rn "requireMissionId\|InvalidProposedMissionPlanDefinition\|InvalidProposedPlanRevisionDefinition" src test` returns zero matches. Full repository validation independently re-executed and passing across both review cycles: `tsc --noEmit`, ESLint, 637/637 tests (92 files), `npm run build`, `npm run test:extension-host:build`, and `git status --porcelain -- src test` confirming drift limited to the Sprint-72-authorized Planning-domain file set with zero Sprint 1–71 or Host/Adapter drift. Sprint 72 is fully closed with zero open findings of any category. Milestone 11 Initial Capability Sequence step 4 (Governed Plan Generation) requires its own future Sprint Owner scope ratification via `nexus-plan`.

Date: 2026-07-17
Reviewer: Reviewer AI (Claude Code)
Review Reference: `NEXUS-REV-2026-07-17-011` (PASS WITH FINDINGS, two Minor findings); `NEXUS-REV-2026-07-17-012` (BT-072-001/BT-072-002 Resolution Verification, PASS, fully closed)

## Traceability

| Artifact | Reference |
| --- | --- |
| Sprint | Sprint 72 |
| Referenced RFCs | RFC-0012 v1.0 (implemented, partial); RFC-0001, RFC-0004 (Referenced, unmodified) |
| Ratifications | `NEXUS-RAT-2026-07-17-010` (RFC-0012 v1.0 Final ratification; Sprint 72 scope authorization) |
| Reviews | `NEXUS-REV-2026-07-17-011` (PASS WITH FINDINGS); `NEXUS-REV-2026-07-17-012` (PASS, fully closed) |
| Implementation Plan | `IMPLEMENTATION_PLAN.md` |
| Implementation Manifest | `IMPLEMENTATION_MANIFEST.md` |
| Implementation Report | `IMPLEMENTATION_REPORT.md` |
| Review Report | `REVIEW_HISTORY.md` |
