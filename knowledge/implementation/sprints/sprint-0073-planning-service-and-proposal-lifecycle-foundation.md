# Sprint 73 — Planning Service and Proposal Lifecycle Foundation

## Status

Approved — `NEXUS-REV-2026-07-17-013` (PASS; zero findings of any category). Authorized by `NEXUS-RAT-2026-07-17-011`. Milestone 11, Initial Capability Sequence step 4 (renamed from "Governed Plan Generation" by the same ratification).

## Objective

Introduce a thin `PlanningService` application-orchestration layer over Sprint 72's frozen, independent Planning domain model (`src/kernel/planning/`): Kernel-composed creation of `ProposedMissionPlan` and `ProposedPlanRevision`, and support for the existing `Draft`/`Submitted`/`Withdrawn` Proposal Lifecycle transitions only. Sprint 73 introduces no Domain Event publication, no new Proposal Lifecycle state, no Review/Governance integration, and no Activation.

## Architectural Intent

Sprint 72 established the Planning domain's data model, validation, and repository but no application-service orchestration boundary — every prior domain in this repository (Mission, Evidence, Review, Knowledge, Adapter, Execution Role, Execution Strategy) exposes its aggregate operations through a thin, constructor-injected application service rather than direct aggregate/repository manipulation by callers. Sprint 73 closes that gap for Planning, strictly reusing Sprint 72's frozen validation, value objects, and repository contract unmodified. It establishes the callable planning application boundary only — it does not advance the Proposal Lifecycle beyond `Draft`/`Submitted`/`Withdrawn`, does not touch Review (RFC-0006) or Governance (RFC-0011), and does not publish any Domain Event.

## RFC Coverage

- RFC-0012 v1.0 — Autonomous Engineering Planning Model (Referenced; `PlanningService` orchestrates Sprint 72's frozen domain model; RFC-0012 unmodified)
- RFC-0001 — Mission Model (Referenced; `missionId` consumed read-only, unchanged from Sprint 72)
- RFC-0004 — Execution Model (Referenced; `RoleRegistry`/`executionRoleId` consumed read-only, unchanged from Sprint 72)
- RFC-0008 — Kernel Adapter Contract (Referenced; Adapter identity consumed read-only, unchanged from Sprint 72)

## Ratification

- `NEXUS-RAT-2026-07-17-011` — renames Milestone 11 Initial Capability Sequence step 4 and authorizes this Sprint's exact scope, reproduced below.

## Dependencies

Sprint 73 consumes the following frozen, read-only dependencies through their existing public contracts only:

- Sprint 72's `PlanningPolicy`, `ProposedMissionPlan`, `ProposedPlanRevision`, `ProposedTask`, `ProposedTaskDependency`, `PlannerAttribution`, Structural Plan Validation, Planning Diagnostics, and `IProposedMissionPlanRepository`/in-memory implementation — all unmodified.
- RFC-0001 `Mission` identity (`missionId` attribution only).
- RFC-0004 `RoleRegistry`/`executionRoleId` (Planner Attribution, as already established by Sprint 72).
- RFC-0008 Adapter identity (Planner Attribution, as already established by Sprint 72).

Sprint 73 SHALL NOT alter any previously approved behavior owned by Sprint 1 through Sprint 72.

## Authorized Concepts

Sprint 73 may introduce only, within the existing Planning domain module (`src/kernel/planning/`):

- **`PlanningService`** — a thin application-orchestration service (mirroring `KnowledgeService`/`ReviewService`) through constructor-injected `IProposedMissionPlanRepository` (and any other Sprint 72 read-only contract already required by Planner Attribution resolution).
- **Proposed Mission Plan creation** — `PlanningService` operation constructing a `ProposedMissionPlan` via Sprint 72's existing domain constructors, unmodified.
- **Proposed Plan Revision creation** — `PlanningService` operation constructing an immutable `ProposedPlanRevision` via Sprint 72's existing domain constructors, unmodified.
- **Proposal Lifecycle transition operations** — `PlanningService` operations invoking exactly the existing `Draft → Submitted` and `Draft`/`Submitted → Withdrawn` transitions already implemented by Sprint 72's domain model. No new transition or state is authorized.
- **Kernel composition registration** of `PlanningService`, following this repository's established Kernel service-composition pattern.
- Deterministic diagnostics for `PlanningService`-level failures, reusing Sprint 72's `PlanningDiagnosticCode`/exception types unmodified — no new diagnostic code is authorized unless strictly required to represent a service-boundary condition Sprint 72 could not have expressed (e.g. "proposal not found" for a repository lookup miss).
- Unit tests for `PlanningService` construction, Proposed Mission Plan creation, Proposed Plan Revision creation, each authorized lifecycle transition, idempotency, structural validation reuse (failure propagation only — not reimplementation), and Planner Attribution enforcement at the service boundary.

No modification to any Sprint 1–72 production source is authorized. No modification to any Sprint 72 domain model, value object, or validation logic is authorized — Sprint 73 consumes them read-only/as-is through a new orchestration layer only.

## Architectural Boundaries

Sprint 73 SHALL NOT:

- publish any Domain Event, including any RFC-0012-reserved event name;
- implement the `Under Review`, `Governed`, `Activated`, `Rejected`, or `Superseded` Proposal Lifecycle states or any transition into or out of them;
- implement Planning Correlation or any interaction with `Review` (RFC-0006) or `GovernanceDecision` (RFC-0011);
- implement Activation or any conversion of Proposed Task/Proposed Task Dependency into RFC-0001 `Task`/`TaskDependency`;
- invoke, reference as a write path, or modify `MissionPlanningService`, `MissionExecutionService`, `MissionPlan`, `Task`, or `TaskDependency` (RFC-0001, unmodified);
- introduce AI plan generation, Adapter invocation, or provider/Adapter selection beyond Sprint 72's existing Planner Attribution data model;
- introduce workflow orchestration, Workflow Chain participation, or Workflow Step assignment;
- modify `GovernanceDecision`, `Review`, `EngineeringDecisionCorrelation`, `RecoveryRequirement`, `WorkflowChain`, `WorkflowStep`, `EngineeringSession`, any event, any event consumer, any projection, `src/hosts`, or `src/adapters`;
- modify any Sprint 72 domain model, value object, diagnostic, or validation logic.

## Deferred Concepts

- Domain Event publication for any RFC-0012-reserved event (`ProposedMissionPlanCreated`, `ProposedPlanRevisionCreated`, `ProposedPlanRevisionSubmitted`, `ProposedPlanRevisionWithdrawn`, `ProposedPlanRevisionRejected`, `ProposedPlanRevisionSuperseded`, `ProposedMissionPlanActivated`).
- `Under Review`, `Governed`, `Activated`, `Rejected`, `Superseded` Proposal Lifecycle states and transitions.
- Planning Correlation, in whole (structural type or Review/Governance association fields).
- Review execution, Governance evaluation, Activation, conversion into RFC-0001 executable objects.
- Workflow orchestration.
- Plan Review, Governance, and Activation; Autonomous Planning Integration Validation (Initial Capability Sequence steps 5–6).

No placeholder implementation of any deferred concept is authorized.

## Acceptance Criteria (Definition of Done)

- `PlanningService` supports Proposed Mission Plan creation, Proposed Plan Revision creation, and the `Draft`/`Submitted`/`Withdrawn` transitions, registered through Kernel composition, with deterministic diagnostics on every validation failure.
- Unit tests cover construction, idempotency, structural validation reuse (delegation, not reimplementation), and Planner Attribution enforcement at the service boundary.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.
- No Sprint 1–72 production contract, Host, or Adapter file is found to have drifted.
- No Sprint 72 domain model, value object, or validation logic is found to have been modified.

## Builder Responsibilities

Per `NEXUS-RAT-2026-07-17-011`'s Authorized Scope, the Builder SHALL:

1. Implement the Authorized Concepts exactly as specified above, strictly within the existing Planning domain module.
2. Implement unit tests covering construction, idempotency, each authorized lifecycle transition, structural validation reuse, and Planner Attribution enforcement.
3. Run the full repository validation pipeline.
4. Update Sprint 73 implementation and governance documentation (`IMPLEMENTATION_REPORT.md`).
5. Report implementation outcome, assumptions, limitations, and any architectural deviations ("No architectural deviations." if none) in `IMPLEMENTATION_REPORT.md`. Record Sprint 73's completion in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` per the Constitution's Implementation Manifest requirements (status transition to "Implemented — Pending Reviewer Validation").

The Builder SHALL NOT:

- introduce any Authorized Concept beyond this Sprint's scope;
- introduce any Deferred Concept, including as a placeholder, stub, or unused reference;
- modify the Kernel Canon, any RFC, or `REVIEW_HISTORY.md`;
- modify `src/hosts` or `src/adapters`;
- modify any Sprint 72 domain model, value object, or validation logic.

## Builder Stop Conditions

The Builder SHALL stop and report if:

- `PlanningService`'s creation or lifecycle-transition operations cannot be implemented without modifying Sprint 72's frozen domain model, value objects, or validation logic;
- implementing the authorized `Draft`/`Submitted`/`Withdrawn` transitions at the service boundary appears to require any `Under Review`/`Governed`/`Activated`/`Rejected`/`Superseded` state, Planning Correlation, Review, or Governance behavior;
- a service-boundary diagnostic condition cannot be represented using Sprint 72's existing `PlanningDiagnosticCode` set without introducing a new code — report the exact gap rather than silently reusing an ill-fitting existing code or unilaterally expanding the set beyond what this Sprint's scope authorizes.

No speculative production change beyond this Sprint's Authorized Concepts is authorized inside Sprint 73.

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` — add a new Sprint 73 section (Scope, Referenced RFCs, Referenced Reference Documents, Assumptions, Limitations, Architectural Deviations, Validation Summary).
- `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md` — status update upon Reviewer certification.
- Do not modify: Kernel Canon; RFC-0001; RFC-0004; RFC-0005; RFC-0006; RFC-0008; RFC-0011; RFC-0012; `REVIEW_HISTORY.md`.

## Known Limitations (anticipated)

- This Sprint does not advance the Proposal Lifecycle beyond `Draft`/`Submitted`/`Withdrawn`; a Proposed Mission Plan still cannot be Reviewed, Governed, or Activated until future Milestone 11 Sprints implement those capabilities under their own ratifications.
- This Sprint publishes no Domain Event; Planning domain state changes remain externally unobservable through the Event Bus until a future Sprint authorizes event publication.
- This Sprint certifies in-memory, single-process Kernel composition only, consistent with all prior Sprints.

These are implementation boundaries, not defects.

## Builder Results

Implemented the authorized Sprint 73 vertical slice.

- Added `PlanningService` in `src/kernel/planning/` as a thin application-orchestration layer over Sprint 72's frozen Planning domain model.
- Registered `PlanningService` through Kernel composition with the existing `IProposedMissionPlanRepository`/`InMemoryProposedMissionPlanRepository`.
- Implemented idempotent Proposed Mission Plan creation and idempotent immutable Proposed Plan Revision creation.
- Implemented service operations for the existing `Draft -> Submitted`, `Draft -> Withdrawn`, and `Submitted -> Withdrawn` lifecycle transitions only.
- Reused Sprint 72 Structural Plan Validation, Planning Policy validation, Planner Attribution validation, repository persistence, and Planning domain errors without modifying Sprint 72 domain/value-object logic.
- Added unit and integration tests covering construction, Kernel composition, idempotency, lifecycle transitions, validation propagation, Planner Attribution enforcement, and missing proposal lookup diagnostics.

Validation completed:

- `npm run validate`
- `npm run test:extension-host:build`

No architectural deviations.

## Reviewer Notes

Reviewed as `NEXUS-REV-2026-07-17-013`. Overall Disposition: **PASS**, zero findings of any category. Independently re-executed the full validation pipeline: `tsc --noEmit`, ESLint, the full test suite (643/643 tests, 93 files, up from 637/92 at Sprint 72's close), `npm run build`, and `npm run test:extension-host:build`, all clean. `git status --porcelain -- src test` confirmed drift limited to exactly `src/kernel/planning/planning.service.ts` (new), `test/kernel/planning/planning.service.test.ts` (new), `src/kernel/common/create-kernel-services.ts` (additive registration only), and `test/integration/kernel-boundary-certification.integration.test.ts` (additive coverage only) — zero Sprint 1–72 production/test drift beyond the two authorized additive edits, and zero `src/hosts`/`src/adapters` drift. Verified by direct inspection that every Sprint 72 Planning domain file (`proposed-mission-plan.ts`, `proposed-plan-revision.ts`, `proposed-task.ts`, `proposed-task-dependency.ts`, `planner-attribution.ts`, `planning-policy.ts`, `planning.types.ts`, `planning.errors.ts`, `proposed-mission-plan.repository.ts`) is unmodified, and that `PlanningService` delegates exclusively to their existing constructors/methods. Confirmed by import inspection that every Deferred Concept is correctly absent: no `EventBusContract` usage (no Domain Event publication), no `Under Review`/`Governed`/`Activated`/`Rejected`/`Superseded` state, no Planning Correlation, no Review/Governance module import, no RFC-0001 executable conversion, no Adapter/workflow orchestration reference. `DuplicateProposedMissionPlanError`/`ProposedMissionPlanNotFoundError` were already defined in Sprint 72's frozen `planning.errors.ts`, so no new diagnostic code was introduced. See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-17-013` for the complete review.

## Final Disposition

**Approved.** `NEXUS-REV-2026-07-17-013` certified PASS with zero findings of any category. Full repository validation independently re-executed and passing: `tsc --noEmit`, ESLint, 643/643 tests (93 files), `npm run build`, `npm run test:extension-host:build`, and `git status --porcelain -- src test` confirming drift limited to the Sprint-73-authorized file set with zero Sprint 1–72 or Host/Adapter drift. Sprint 73 is fully closed with zero open findings of any category. Milestone 11 Initial Capability Sequence step 5 (Plan Review, Governance, and Activation) requires its own future Sprint Owner scope ratification via `nexus-plan`.

Date: 2026-07-17
Reviewer: Reviewer AI (Claude Code)
Review Reference: `NEXUS-REV-2026-07-17-013` (PASS, zero findings)

## Traceability

| Artifact | Reference |
| --- | --- |
| Sprint | Sprint 73 |
| Referenced RFCs | RFC-0012 v1.0 (Referenced, unmodified); RFC-0001, RFC-0004, RFC-0008 (Referenced, unmodified) |
| Ratifications | `NEXUS-RAT-2026-07-17-011` (Initial Capability Sequence step 4 rename; Sprint 73 scope authorization) |
| Reviews | `NEXUS-REV-2026-07-17-013` (PASS, zero findings, fully closed) |
| Implementation Plan | `IMPLEMENTATION_PLAN.md` |
| Implementation Manifest | `IMPLEMENTATION_MANIFEST.md` |
| Implementation Report | `IMPLEMENTATION_REPORT.md` |
| Review Report | `REVIEW_HISTORY.md` |
