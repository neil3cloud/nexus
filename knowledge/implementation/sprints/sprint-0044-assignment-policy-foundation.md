# Sprint 44 — Assignment Policy Foundation

**Status:** Approved — `NEXUS-REV-2026-07-14-024`.

---

## Objective

Implement RFC-0004's existing **"Assignment"** and **"Assignment Policy"** sections as a standalone, deterministic Kernel domain concept.

This Sprint establishes the canonical assignment model — an `AssignmentPolicy` aggregate representing the assignment-requirement factors RFC-0004 already names, with deterministic policy evaluation — that future, separately-ratified Sprints may wire into workflow progression and multi-agent execution.

`AssignmentPolicy` SHALL remain:

- standalone;
- deterministic;
- wholly independent of `EngineeringSession`, `ExecutionSession`, `WorkflowChain`, and `WorkflowStep`.

No runtime wiring or orchestration behavior is introduced.

---

## RFC Coverage

### Primary

- RFC-0004 v1.3 — Execution Model
  - "Assignment" (existing, unmodified)
  - "Assignment Policy" (existing, unmodified)

### Referenced

- RFC-0010 — Kernel Boundaries

No RFC ownership changes are authorized by this Sprint.

---

## Ratification References

- `NEXUS-RAT-2026-07-14-024` — Sprint 44 scope ratification: governs this Sprint's entire scope, four Sprint Owner Refinements, Explicitly Deferred list, and scope restrictions.
- `NEXUS-RAT-2026-07-14-011` — the ratification naming Milestone 8's candidate scope, of which Assignment Policy is one member.

---

## Architectural Responsibilities (binding, from `NEXUS-RAT-2026-07-14-024`)

| Concern | Owner |
| --- | --- |
| Assignment-requirement value objects, deterministic policy evaluation | `AssignmentPolicy` (this Sprint) |
| Creation, lookup, enumeration, and policy evaluation orchestration | `AssignmentPolicyService` (this Sprint; SHALL NOT dispatch, wire, or orchestrate) |
| Execution role identity | `ExecutionRole`/`RoleId` (Sprint 8, unmodified; referenced read-only) |
| Runtime wiring into workflow progression, Adapter dispatch, Review-Gated Progression, Multi-Agent Orchestration | Future, separately-ratified Milestone 8 Sprints |

`AssignmentPolicy` gains no reference to `EngineeringSession`, `ExecutionSession`, `WorkflowChain`, or `WorkflowStep`, and none of those concepts are modified by this Sprint.

---

## Authorized Vertical Slice

- `AssignmentPolicy` immutable Kernel domain concept with `AssignmentPolicyId` and immutable value objects for exactly the five RFC-0004-named assignment-requirement factors:
  - required role (via the existing `RoleId`);
  - Adapter/execution capability;
  - repository configuration;
  - execution constraints;
  - human preferences.
- A deterministic policy-evaluation operation on `AssignmentPolicy` that is a pure function of its stated inputs — equivalent inputs SHALL produce equivalent outcomes; no dispatch or side effect.
- `IAssignmentPolicyRepository` contract and in-memory implementation for creation, lookup, and enumeration only, mirroring existing Kernel repository patterns.
- Thin `AssignmentPolicyService` for creation, lookup, enumeration, and policy evaluation only, through constructor-injected repository contracts — no dispatch, no wiring, no orchestration.
- `createKernelServices` composition updated only as strictly required to construct and register the `AssignmentPolicy` repository and service.
- Unit tests:
  - aggregate construction and immutability;
  - each assignment-requirement value object's validation;
  - deterministic policy evaluation for equivalent inputs;
  - the repository;
  - the service;
  - a composition assertion that `createKernelServices()` continues to compose all existing services, including `WorkflowChainService` and `EngineeringSessionService`, without alteration beyond what this Sprint authorizes.

---

## Deferred Concepts

- `EngineeringSession` / `WorkflowChain` / `ExecutionSession` wiring of `AssignmentPolicy`.
- Runtime dispatch, Adapter selection, or Adapter invocation driven by policy evaluation.
- Review-Gated Progression.
- Multi-Agent Engineering Orchestration.
- Automatic or event-driven workflow advancement.
- Session recovery/checkpointing.
- Concurrent session/workflow coordination.
- Any `src/hosts` or `src/adapters` change.
- Any modification to `EngineeringSession`, `ExecutionSession`, `WorkflowChain`, `WorkflowChainId`, `WorkflowStep`, `IWorkflowChainRepository`, `InMemoryWorkflowChainRepository`, `WorkflowChainService`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, or `ExecutionStrategy`.

---

## Deferred RFC Ownership

- Workflow Chaining's own structural definition, Engineering Session's workflow-position ownership (RFC-0004 v1.3, unmodified).
- Review-Gated Progression, Multi-Agent Orchestration (not yet defined by any RFC amendment).

---

## Known Limitations

- `AssignmentPolicy` is a standalone domain model this Sprint; nothing in this Sprint consults it during `EngineeringSession` construction, `WorkflowChain` binding, or workflow advancement.
- Policy evaluation is advisory data only; no Adapter dispatch, Task lifecycle transition, or execution-eligibility determination reads it.
- Sessions and policies remain in-memory only; no durable persistence.

These are implementation boundaries, not defects.

---

## Acceptance Criteria (Definition of Done)

- `AssignmentPolicy` is the only new normative architectural concept introduced by Sprint 44.
- `AssignmentPolicy` is wholly independent of `EngineeringSession`, `ExecutionSession`, `WorkflowChain`, and `WorkflowStep`; none of them are modified or referenced (Refinement 1).
- `AssignmentPolicy` represents exactly the five RFC-0004-named assignment-requirement factors, no more (Refinement 2).
- Policy evaluation is a pure, deterministic function of its inputs; equivalent inputs always produce equivalent outcomes; no dispatch or side effect is introduced (Refinement 3).
- `AssignmentPolicyService` remains thin orchestration — creation, lookup, enumeration, and policy evaluation only (Refinement 4).
- No existing Kernel Execution/Mission-domain file is modified beyond `AssignmentPolicy`'s own new files and the one authorized `createKernelServices` composition touch point.
- No `src/hosts` or `src/adapters` file is modified.
- Sprint 18's Kernel Boundary Certification test passes, updated only if it enumerates Kernel-composed services, mirroring the Sprint 37–43 precedent.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

---

## Builder Responsibilities

- Implement exactly the Authorized Vertical Slice above; do not exceed `NEXUS-RAT-2026-07-14-024`'s Authorized Builder Scope or its four Refinements.
- Introduce only new `AssignmentPolicy` domain files, its repository/service, and the one authorized `createKernelServices` composition touch point.
- Do not modify `EngineeringSession`, `ExecutionSession`, `WorkflowChain`, `WorkflowStep`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, or `ExecutionStrategy`.
- Do not modify any `src/hosts` or `src/adapters` file.
- Do not introduce any reference from `AssignmentPolicy`/`AssignmentPolicyService` to `EngineeringSession`, `ExecutionSession`, `WorkflowChain`, or `WorkflowStep`, including as an unused/optional field.
- Do not introduce Adapter dispatch, Adapter selection, Review-Gated Progression, orchestration, or automatic/event-driven workflow advancement, in any form, including as an unused stub.
- Report implementation outcome, assumptions, limitations, and any architectural deviations ("No architectural deviations." if none) in `IMPLEMENTATION_REPORT.md`, following the Sprint 43 section's format.
- Record Sprint 44's completion in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` per the Constitution's Implementation Manifest requirements (status transition from "Current" to "Implemented — Pending Reviewer Validation").

---

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` — new Sprint 44 section (Scope, Referenced RFCs, Referenced Reference Documents, Assumptions, Limitations, Architectural Deviations).
- `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md` — status update to Implemented/Approved upon Reviewer certification.
- No README or user-facing documentation change is required this Sprint, since no Host-observable behavior changes.

---

## Reserved Sections

### Builder Results

Implemented the Sprint 44 Assignment Policy Foundation vertical slice.

Builder-owned implementation outputs:

- Added standalone `AssignmentPolicy` domain model, `AssignmentPolicyId`, and exactly five immutable assignment-requirement value objects: required role via `RoleId`, Adapter/execution capability, repository configuration, execution constraints, and human preferences.
- Added pure deterministic `AssignmentPolicy.evaluate()` with no dispatch, Adapter selection, Task transition, workflow advancement, Review-Gated Progression, or orchestration side effect.
- Added `IAssignmentPolicyRepository`, `InMemoryAssignmentPolicyRepository`, and thin `AssignmentPolicyService` for creation, lookup, enumeration, and evaluation only.
- Updated `createKernelServices()` only to compose `AssignmentPolicyService` and its repository.
- Added unit coverage for aggregate construction and immutability, value-object validation, deterministic evaluation, repository behavior, service behavior, and Kernel composition.
- Preserved the explicit deferrals and made no `src/hosts` or `src/adapters` changes.

### Reviewer Notes

Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-14-024`). Independently read all seven new `AssignmentPolicy` source files, their three test files, and the `create-kernel-services.ts`/Kernel Boundary Certification test diffs against `NEXUS-RAT-2026-07-14-024`'s Authorized Builder Scope and four Sprint Owner Refinements. Confirmed: `AssignmentPolicy` represents exactly the five RFC-0004-named assignment-requirement factors with no sixth; evaluation is a pure, deterministic function with no dispatch or side effect; `AssignmentPolicyService` remains thin orchestration; and `EngineeringSession`, `ExecutionSession`, `WorkflowChain`, `WorkflowStep`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, `ExecutionStrategy`, and every `src/hosts`/`src/adapters` file are unmodified. Independent re-validation confirms `tsc --noEmit`, ESLint, `npm run build`, `npm run test:extension-host:build`, and the full Vitest suite (74 files / 347 tests) all pass cleanly. Zero findings of any category.

### Final Disposition

**PASS** — Approved with zero open findings. See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-14-024` for the complete review record.
