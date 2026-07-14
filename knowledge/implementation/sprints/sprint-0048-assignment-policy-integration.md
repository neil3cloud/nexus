# Sprint 48 — Assignment Policy Integration

**Status:** Approved — `NEXUS-REV-2026-07-15-005` (fully closed; `TASK-001` remediation of `NEXUS-REV-2026-07-15-004-F-001` verified; zero open findings)

---

## Objective

Extend `EngineeringSessionService.executeCurrentWorkflowStep` (Sprint 47) with an optional, deterministic **Assignment Policy Evaluation** gate per RFC-0004 v1.7: given a caller-supplied Assignment Policy reference and evaluation input, invoke the existing, unmodified Sprint 44 `AssignmentPolicyService.evaluateAssignmentPolicy` — using the resolved current `WorkflowStep`'s `RoleId` as the required-role input — before Adapter dispatch. When the evaluation reports unsatisfied, execution SHALL be rejected deterministically: no Adapter dispatch occurs and no `ExecutionSession` record is created. When no Assignment Policy reference is supplied, `executeCurrentWorkflowStep` SHALL behave exactly as it did in Sprint 47.

This Sprint determines **Execution Role eligibility only**. It does not select among multiple Execution Roles, does not select among Adapters, and does not introduce any routing or scoring behavior.

---

## RFC Coverage

### Primary

- RFC-0004 v1.7 — Execution Model
  - "Workflow Chain Execution" § Assignment Policy Evaluation (new subsection, added by this specification's v1.7 amendment)

### Referenced

- RFC-0004 v1.3 — "Assignment Policy" (existing, unmodified; `AssignmentPolicy`'s five named factors and pure evaluation function reused verbatim)
- RFC-0004 v1.6 — "Workflow Chain Execution" (Sprint 47, unmodified except for this Sprint's new optional gate)
- RFC-0010 — Kernel Boundaries

No RFC ownership changes are authorized beyond `NEXUS-RAT-2026-07-15-005`'s RFC-0004 v1.7 amendment.

---

## Ratification References

- `NEXUS-RAT-2026-07-15-006` — Sprint 48 scope ratification: governs this Sprint's entire scope, the binding Objective, the binding Architectural Responsibilities, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-15-005` — the companion RFC-0004 v1.7 amendment defining Assignment Policy Evaluation this Sprint implements.

---

## Architectural Responsibilities (binding, from `NEXUS-RAT-2026-07-15-006`)

| Concern | Owner |
| --- | --- |
| Assignment Policy value objects, pure evaluation function | `AssignmentPolicy`/`AssignmentPolicyService` (Sprint 44, unmodified) |
| Resolving current Workflow Step's Execution Role; Execution Strategy readiness; Adapter dispatch | `EngineeringSession`/`EngineeringSessionService` (Sprint 47, unmodified except for this Sprint's new optional gate) |
| Assignment Policy Evaluation consumption gating dispatch | `EngineeringSessionService.executeCurrentWorkflowStep` (this Sprint, new optional gate only) |
| Execution attempt record | `ExecutionSession`/`ExecutionSessionService` (Sprint 40, unmodified) |
| Workflow position advancement | Manual/Automatic/Review-Gated Advancement (Sprints 43/45/46, unmodified and unaffected) |

---

## Authorized Vertical Slice

- Extend `ExecuteCurrentWorkflowStepCommand` with an optional Assignment Policy reference and optional evaluation-input fields, mirroring `AssignmentPolicyEvaluationInput`'s existing shape (Adapter execution capability, repository configuration, execution constraints, human preferences).
- Extend `EngineeringSessionService.executeCurrentWorkflowStep`: when the Assignment Policy reference is supplied, invoke `AssignmentPolicyService.evaluateAssignmentPolicy` with the resolved `WorkflowStep`'s `RoleId` as the required-role input and the caller-supplied evaluation input, before constructing the Adapter dispatch request.
- Add one new deterministic rejection outcome to `EngineeringSessionWorkflowExecutionStatus` (e.g. `AssignmentPolicyRejected`), mirroring the existing `ReadinessRejected` outcome shape — produced when the evaluation reports unsatisfied, with no Adapter dispatch and no `ExecutionSession` record created.
- Extend `createKernelServices` composition only as strictly required to supply `AssignmentPolicyService` to `EngineeringSessionService`'s constructor as an optional collaborator, mirroring the existing optional `executionStrategyService`/`adapterService`/`executionSessionService` pattern.
- Unit/integration tests covering:
  - satisfied Assignment Policy → execution proceeds exactly as Sprint 47 (readiness evaluation, Adapter dispatch, `ExecutionSession` creation all occur);
  - unsatisfied Assignment Policy → `AssignmentPolicyRejected` outcome, no Adapter dispatch, no `ExecutionSession` record;
  - omitted Assignment Policy reference → Sprint 47 behavior unchanged, byte-for-byte;
  - determinism: equivalent inputs (resolved `RoleId` + evaluation input + policy) produce equivalent outcomes;
  - regression confirmation that Sprint 43/45/46 advancement methods remain unmodified and passing;
  - a composition assertion that `createKernelServices()` continues to compose all existing services without alteration beyond what this Sprint authorizes.

---

## Deferred Concepts

- Adapter Selection, Adapter routing, capability scoring, or fallback logic — dispatch continues to use an explicit, caller-supplied `adapterId` only.
- Automatic Assignment Policy binding, inference, or lookup by `WorkflowStep` — the Assignment Policy reference SHALL be supplied explicitly by the caller.
- Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing.
- Concurrent session/workflow coordination.
- Task lifecycle transition.
- Any modification to `AssignmentPolicy`, `AssignmentPolicyService`, `IAssignmentPolicyRepository`, `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, or `Finding`.
- Any modification to Sprint 43's `advanceWorkflow()`, Sprint 45's `advanceWorkflowOnTrigger()`, or Sprint 46's `advanceWorkflowAfterReview()`.
- Any `src/hosts` or `src/adapters` change.

---

## Deferred RFC Ownership

- `AssignmentPolicy`'s own value objects and evaluation semantics — RFC-0004 § Assignment Policy (Sprint 44, unmodified; consumed read-only via its existing public method).
- Adapter Selection — not yet defined by any RFC amendment.
- Multi-Agent Engineering Orchestration, session recovery/checkpointing, concurrent session coordination — not yet defined by any RFC amendment.

---

## Known Limitations (anticipated)

- Assignment Policy Evaluation this Sprint gates only the single, already-resolved `WorkflowStep`'s `RoleId` against one caller-supplied policy; it does not evaluate or choose among multiple candidate roles or policies.
- The Assignment Policy reference must be supplied by the caller at the `executeCurrentWorkflowStep` call site; no persistent binding between a `WorkflowStep` and an `AssignmentPolicy` exists.
- Sessions remain in-memory only; no durable persistence.

These are implementation boundaries, not defects.

---

## Acceptance Criteria (Definition of Done)

- `AssignmentPolicy`, `AssignmentPolicyService`, `IAssignmentPolicyRepository` (Sprint 44) remain unmodified.
- `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding` remain unmodified.
- Sprint 43's `advanceWorkflow()`, Sprint 45's `advanceWorkflowOnTrigger()`, and Sprint 46's `advanceWorkflowAfterReview()` remain unmodified; execution and advancement stay separate operations.
- No Adapter Selection, capability scoring, or role routing is introduced — `adapterId` remains explicit and caller-supplied; the Assignment Policy reference remains explicit and caller-supplied.
- Policy evaluation reuses Sprint 44's existing pure, deterministic `AssignmentPolicy.evaluate()` verbatim; no new evaluation logic is duplicated in `EngineeringSession`/`EngineeringSessionService`.
- When no Assignment Policy reference is supplied, `executeCurrentWorkflowStep` behavior is byte-for-byte identical to Sprint 47.
- No `src/hosts` or `src/adapters` file is modified.
- Sprint 18's Kernel Boundary Certification test continues to pass, updated only if it enumerates Kernel-composed services.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

---

## Builder Responsibilities

- Implement exactly the Authorized Vertical Slice above; do not exceed `NEXUS-RAT-2026-07-15-006`'s Authorized Builder Scope.
- Introduce only: the `ExecuteCurrentWorkflowStepCommand` extension, the `EngineeringSessionService.executeCurrentWorkflowStep` gate, the new `AssignmentPolicyRejected` outcome, and the minimal `createKernelServices` wiring required to supply `AssignmentPolicyService`.
- Do not modify `AssignmentPolicy`, `AssignmentPolicyService`, `IAssignmentPolicyRepository`, `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `ExecutionStrategyService`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, or `Finding`.
- Do not modify Sprint 43's `advanceWorkflow()`, Sprint 45's `advanceWorkflowOnTrigger()`, or Sprint 46's `advanceWorkflowAfterReview()`.
- Do not modify any `src/hosts` or `src/adapters` file.
- Do not introduce Adapter Selection, Adapter routing, capability scoring, automatic Assignment Policy binding/inference, Multi-Agent Engineering Orchestration, Task lifecycle transition, session recovery/checkpointing, or concurrent session/workflow coordination, in any form, including as an unused/stubbed reference.
- Report implementation outcome, assumptions, limitations, and any architectural deviations ("No architectural deviations." if none) in `IMPLEMENTATION_REPORT.md`, following the Sprint 47 section's format.
- Record Sprint 48's completion in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` per the Constitution's Implementation Manifest requirements (status transition from "Current" to "Implemented — Pending Reviewer Validation").

---

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` — new Sprint 48 section (Scope, Referenced RFCs, Referenced Reference Documents, Assumptions, Limitations, Architectural Deviations).
- `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md` — status update to Implemented/Approved upon Reviewer certification.
- No README or user-facing documentation change is required this Sprint, since no Host-observable behavior changes.

---

## Reserved Sections

### Builder Results

Implemented the authorized RFC-0004 v1.7 Assignment Policy Evaluation gate for `EngineeringSessionService.executeCurrentWorkflowStep`.

Builder outcome:

- Extended `ExecuteCurrentWorkflowStepCommand` with an explicit optional `assignmentPolicyId` and optional `assignmentPolicyEvaluationInput` mirroring `AssignmentPolicyEvaluationInput` without redefining `requiredRole`.
- Added `AssignmentPolicyRejected` to `EngineeringSessionWorkflowExecutionStatus`.
- Reused the existing `AssignmentPolicyService.evaluateAssignmentPolicy` collaborator; `EngineeringSessionService` supplies the resolved current `WorkflowStep` RoleId as `requiredRole`.
- Preserved Sprint 47 behavior when no Assignment Policy reference is supplied.
- Updated `createKernelServices` only to pass the already-composed `AssignmentPolicyService` instance into `EngineeringSessionService`.
- Added focused tests for satisfied policy execution, unsatisfied deterministic rejection with no Adapter dispatch and no `ExecutionSession`, omitted policy behavior, deterministic policy rejection, existing advancement regression coverage, and Kernel composition continuity.

No architectural deviations.

### Reviewer Notes

**Status:** PASS WITH FINDINGS

Reviewer validation complete: **Approved with Findings** (`NEXUS-REV-2026-07-15-004`). Confirmed the Assignment Policy Evaluation gate is thin orchestration reusing Sprint 44's unmodified `AssignmentPolicyService.evaluateAssignmentPolicy` and `AssignmentPolicy.evaluate()`, evaluated after Sprint 47's existing readiness check and strictly before Adapter dispatch/`ExecutionSession` creation; confirmed `AssignmentPolicy`, `AssignmentPolicyService`, `IAssignmentPolicyRepository`, `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding`, the `EngineeringSession` aggregate itself, Sprint 43's/45's/46's advancement methods, and `src/hosts`/`src/adapters` are all byte-for-byte unmodified via direct diff inspection; confirmed the Assignment Policy reference and evaluation input remain explicit/caller-supplied with no automatic binding, inference, or lookup introduced; confirmed byte-for-byte regression safety when no Assignment Policy reference is supplied. Independent re-validation confirmed `tsc --noEmit`, ESLint, targeted Vitest (44/44), `npm run validate` (Vitest 75 files / 374 tests, esbuild), and `npm run test:extension-host:build` all pass cleanly, matching the Builder's reported results exactly.

One Minor, non-blocking finding recorded: `NEXUS-REV-2026-07-15-004-F-001` — two new defensive/guard branches in `evaluateAssignmentPolicy()` (missing `assignmentPolicyEvaluationInput` when `assignmentPolicyId` is supplied; missing `assignmentPolicyService` collaborator when `assignmentPolicyId` is supplied) have no exercising test. Directly analogous to Sprint 47's `NEXUS-REV-2026-07-15-002-F-001`. Generated one test-only Builder Task.

`TASK-001` remediation verified (`NEXUS-REV-2026-07-15-005`): two test cases added to `test/kernel/execution/engineering-session.service.test.ts` covering exactly the two identified branches — supplying `assignmentPolicyId` without `assignmentPolicyEvaluationInput`, and supplying `assignmentPolicyId` to an `EngineeringSessionService` constructed without an `assignmentPolicyService` collaborator. No production source file was modified; `git diff --stat` confirms `engineering-session.service.ts`, `engineering-session.contract.ts`, `engineering-session.types.ts`, and `create-kernel-services.ts` remain byte-for-byte identical to what was already reviewed in `NEXUS-REV-2026-07-15-004`. `npm run validate` passes at 75 files / 376 tests; `npm run test:extension-host:build` passes. Sprint 48 is fully closed with zero open findings.

### Final Disposition

**Approved.** Zero Critical/Major/Minor findings remain open. `NEXUS-REV-2026-07-15-004-F-001` was fully resolved by `TASK-001`'s test-only remediation, verified by `NEXUS-REV-2026-07-15-005`. Sprint 48 is fully closed with zero open findings. Milestone 8's remaining candidate scope (Multi-Agent Engineering Orchestration, session recovery/checkpointing, concurrent session coordination) requires its own future Sprint Owner scope ratification via `nexus-plan`.

Date: 2026-07-15
Reviewer: Reviewer AI (Claude Code)
Review Reference: `NEXUS-REV-2026-07-15-004`, `NEXUS-REV-2026-07-15-005`

---

## Traceability

| Artifact | Reference |
| --- | --- |
| Sprint | Sprint 48 |
| Primary RFC | RFC-0004 v1.7 |
| Ratifications | `NEXUS-RAT-2026-07-15-005`, `NEXUS-RAT-2026-07-15-006` |
| Reviews | `NEXUS-REV-2026-07-15-004`, `NEXUS-REV-2026-07-15-005` |
| Implementation Plan | `IMPLEMENTATION_PLAN.md` |
| Implementation Manifest | `IMPLEMENTATION_MANIFEST.md` |
| Implementation Report | `IMPLEMENTATION_REPORT.md` |
| Review Report | `REVIEW_HISTORY.md` |
