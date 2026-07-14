# Sprint 42 — Engineering Session Workflow Chain Wiring

**Status:** Approved with Findings — NEXUS-REV-2026-07-14-021.

---

## Objective

Introduce immutable `WorkflowChain` binding into `EngineeringSession`.

This Sprint establishes the runtime relationship:

```text
EngineeringSession
        │
        ▼
WorkflowChain
```

An `EngineeringSession` SHALL reference exactly one active `WorkflowChain` and exactly one current `WorkflowStep`, established only at `EngineeringSession` creation.

This Sprint introduces **structural runtime binding only**. No workflow progression semantics are introduced.

---

## RFC Coverage

### Primary

- RFC-0004 v1.3 — Execution Model
  - `EngineeringSession` § Architectural Responsibilities (already amended to include active `WorkflowChain` reference and current workflow position by `NEXUS-RAT-2026-07-14-020`; unmodified by this Sprint)
  - `WorkflowChain` § Workflow Chaining (unmodified by this Sprint)

### Referenced

- RFC-0010 — Kernel Boundaries

No RFC ownership changes are authorized by this Sprint.

---

## Ratification References

- `NEXUS-RAT-2026-07-14-022` — Sprint 42 scope ratification: governs this Sprint's entire scope, four Sprint Owner Refinements, Explicitly Deferred list, and scope restrictions.
- `NEXUS-RAT-2026-07-14-021` — Sprint 41's ratification; establishes `WorkflowChain`/`WorkflowStep`, consumed read-only and unmodified by this Sprint.
- `NEXUS-RAT-2026-07-14-020` — the RFC-0004 v1.3 amendment that already assigns `EngineeringSession` ownership of the active `WorkflowChain` reference and current workflow position; this Sprint implements that existing normative assignment.
- `NEXUS-RAT-2026-07-14-018` / `-019` — Sprint 39/40's ratifications; establish `EngineeringSession` and `ExecutionSession`. `ExecutionSession` is confirmed unmodified by this Sprint.

---

## Architectural Responsibilities (binding, from RFC-0004 v1.3 / NEXUS-RAT-2026-07-14-022)

| Concern | Owner |
| --- | --- |
| Active `WorkflowChain` reference, current `WorkflowStep` reference, binding validation, cross-reference validation (Step belongs to Chain) | `EngineeringSession` (this Sprint) |
| Immutable workflow definition, ordered `WorkflowStep`s, workflow topology | `WorkflowChain` (Sprint 41, unmodified) |
| Workflow identity, execution ordering, associated `ExecutionRole` | `WorkflowStep` (Sprint 41, unmodified; gains no runtime state) |
| Orchestration, repository interaction, lookup, persistence | `EngineeringSessionService` (extended this Sprint; gains no workflow progression behavior) |
| One coordinated execution attempt | `ExecutionSession` (Sprint 40, unmodified) |
| Workflow advancement (manual or automatic), Assignment Policy evaluation, Review-Gated Progression, Multi-Agent Orchestration | Future, separately-ratified Milestone 8 Sprints |

`EngineeringSession` remains the sole authoritative owner of its own runtime workflow context. `WorkflowChain` and `WorkflowStep` gain no new owned concern and no runtime state.

---

## Authorized Vertical Slice

- `EngineeringSession.workflowChainId: WorkflowChainId` — immutable, populated only at construction.
- `EngineeringSession.currentWorkflowStepId` (or equivalent `WorkflowStep` identity reference) — immutable, populated only at construction; fixed for this Sprint's scope (no operation changes it after creation).
- Binding validation within `EngineeringSession`'s construction path:
  - reject a null `WorkflowChain` reference;
  - reject a nonexistent `WorkflowChain` reference (read-only lookup via `IWorkflowChainRepository`);
  - reject a null `WorkflowStep` reference;
  - reject a nonexistent `WorkflowStep` reference;
  - reject a `WorkflowStep` that does not belong to the referenced `WorkflowChain`.
- `IEngineeringSessionRepository` / `InMemoryEngineeringSessionRepository` persistence updated to carry the new fields through snapshot/reconstitution, mirroring the existing `EngineeringSession` persistence pattern.
- `EngineeringSessionService`'s creation path updated to accept and validate the binding, with `IWorkflowChainRepository` available for read-only lookup — no new operation that changes the binding after creation, and no advancement, dispatch, or orchestration behavior.
- `createKernelServices` composition updated only as strictly required to make the `WorkflowChain` repository available to `EngineeringSessionService`'s construction path.
- Unit tests:
  - valid binding at construction (chain + step both exist, step belongs to chain);
  - rejection of null `WorkflowChain` reference;
  - rejection of nonexistent `WorkflowChain` reference;
  - rejection of null `WorkflowStep` reference;
  - rejection of nonexistent `WorkflowStep` reference;
  - rejection of a `WorkflowStep` that exists but does not belong to the bound `WorkflowChain`;
  - deterministic construction (equivalent inputs produce equivalent runtime state);
  - repository persistence/reconstitution of the new fields;
  - service orchestration of the validated creation path (success and each rejection case);
  - a composition assertion that `createKernelServices()` continues to compose all existing services, including `WorkflowChainService`, without alteration.

---

## Deferred Concepts

- Workflow advancement — manual or automatic.
- Event-driven advancement.
- Review-Gated Progression.
- Assignment Policy.
- Workflow completion, branching, restart, or replacement.
- `EngineeringSession` orchestration behavior beyond the validated creation path.
- Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing.
- Concurrent session coordination.
- Any `src/hosts` or `src/adapters` file change.
- Any modification to `WorkflowChain`, `WorkflowChainId`, `WorkflowStep`, `IWorkflowChainRepository`, `InMemoryWorkflowChainRepository`, `WorkflowChainService`, `ExecutionSession`, `ExecutionSessionId`, `ExecutionSessionService`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, or `ExecutionStrategy`.

---

## Deferred RFC Ownership

- Execution, Execution Strategy, Execution Role, Assignment, Assignment Policy, Execution State (RFC-0004, unmodified).
- Workflow Chaining's own structural definition (RFC-0004 v1.3, unmodified beyond `EngineeringSession`'s already-existing consumption of it).

---

## Known Limitations

- The current `WorkflowStep` reference is fixed at `EngineeringSession` creation; no mechanism exists this Sprint to advance it. `EngineeringSession` is otherwise inert with respect to its bound `WorkflowChain` until a future, separately-ratified Sprint introduces advancement.
- Binding is validated once, at construction; no re-validation occurs if the underlying `WorkflowChain` repository state were hypothetically inconsistent afterward (it cannot become so, since `WorkflowChain` is immutable and unmodifiable after Sprint 41).
- Sessions remain in-memory only; no durable persistence.

These are implementation boundaries, not defects.

---

## Acceptance Criteria (Definition of Done)

- The `EngineeringSession` → `WorkflowChain` binding is the only new normative capability introduced by Sprint 42.
- `EngineeringSession` construction establishes an immutable binding to exactly one `WorkflowChain` and exactly one `WorkflowStep`; neither reference changes after construction (Refinement 1).
- `EngineeringSession` owns the binding and its validation, including cross-reference validation that the bound `WorkflowStep` belongs to the bound `WorkflowChain` (Refinement 2). `WorkflowChain` and `WorkflowStep` are not modified in any way.
- No workflow progression semantics of any kind are introduced — no advancement (manual or automatic), no event-driven advancement, no Review-Gated Progression, no Assignment Policy, no completion/branching/restart/replacement, no orchestration behavior (Refinement 3).
- Construction deterministically rejects null/nonexistent `WorkflowChain` references, null/nonexistent `WorkflowStep` references, and mismatched Step/Chain pairs; equivalent inputs always produce equivalent runtime state (Refinement 4).
- No existing Kernel Execution/Mission-domain file (`WorkflowChain`, `WorkflowChainId`, `WorkflowStep`, `IWorkflowChainRepository`, `InMemoryWorkflowChainRepository`, `WorkflowChainService`, `ExecutionSession`, `ExecutionSessionId`, `ExecutionSessionService`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, `ExecutionStrategy`) is modified.
- No `src/hosts` or `src/adapters` file is modified.
- `EngineeringSessionService` remains orchestration-only; the binding's validation rules live in `EngineeringSession` itself.
- Sprint 18's Kernel Boundary Certification test passes, updated only if it enumerates Kernel-composed services or `EngineeringSession`'s snapshot shape, mirroring the Sprint 37/38/39/40/41 precedent.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

---

## Builder Responsibilities

- Implement exactly the Authorized Vertical Slice above; do not exceed `NEXUS-RAT-2026-07-14-022`'s Authorized Builder Scope or its four Refinements.
- Modify only `EngineeringSession` and its supporting types/repository/service, plus the one authorized `createKernelServices` composition touch point.
- Do not modify `WorkflowChain`, `WorkflowStep`, `ExecutionSession`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, or `ExecutionStrategy`.
- Do not modify any `src/hosts` or `src/adapters` file.
- Report implementation outcome, assumptions, limitations, and any architectural deviations ("No architectural deviations." if none) in `IMPLEMENTATION_REPORT.md`, following the Sprint 41 section's format.
- Record Sprint 42's completion in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` per the Constitution's Implementation Manifest requirements (status transition from "Current" to "Implemented — Pending Reviewer Validation").

---

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` — new Sprint 42 section (Scope, Referenced RFCs, Referenced Reference Documents, Assumptions, Limitations, Architectural Deviations).
- `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md` — status update to Implemented/Approved upon Reviewer certification.
- No README or user-facing documentation change is required this Sprint, since no Host-observable behavior changes.

---

## Reserved Sections

### Builder Results

Implemented — Pending Reviewer Validation.

- Added required immutable `workflowChainId` and `currentWorkflowStepId` fields to `EngineeringSession` input/snapshot state.
- Implemented creation-time binding validation owned by `EngineeringSession`, using a read-only `WorkflowChain` lookup supplied by `EngineeringSessionService`.
- Remediated `NEXUS-REV-2026-07-14-021-F-001` / `TASK-001` by changing `currentWorkflowStepId` from a `WorkflowStep.roleId` match to a canonical zero-based workflow position string, allowing repeated-role chains to bind each position independently.
- Extended `IEngineeringSessionRepository` / `InMemoryEngineeringSessionRepository` persistence and reconstitution through existing snapshots.
- Updated `EngineeringSessionService` creation orchestration and `createKernelServices()` composition to supply the existing `WorkflowChain` repository.
- Added Sprint 42 domain, repository, service, and Kernel boundary certification coverage.
- Repository validation passed with `npm run validate`; extension-host test bundle build passed with `npm run test:extension-host:build`.
- Recovery validation for `NEXUS-REV-2026-07-14-021-F-001` passed with `npm run validate` (71 files / 330 tests) and `npm run test:extension-host:build`.
- No `WorkflowChain`, `WorkflowStep`, `ExecutionSession`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, `ExecutionStrategy`, `src/hosts`, or `src/adapters` files were modified.
- No workflow progression semantics were introduced.
- No architectural deviations.

### Reviewer Notes

Independently read `engineering-session.ts`, `engineering-session.types.ts`, `engineering-session.contract.ts`, `engineering-session.service.ts`, and `engineering-session.repository.ts` in full, and confirmed the binding matches the Authorized Vertical Slice and three of the four Sprint Owner Refinements exactly: binding occurs only at construction with no subsequent mutation path (Refinement 1); `EngineeringSession` owns the binding and its validation while `WorkflowChain`/`WorkflowStep` are consulted read-only and never mutated (Refinement 2); no progression, advancement, Assignment Policy, or orchestration method exists anywhere in the changed files (Refinement 3).

Refinement 4 (deterministic rejection of null/nonexistent/mismatched references) is satisfied for every case it explicitly enumerates, but review identified a gap the ratification did not anticipate: `currentWorkflowStepId` is matched against `WorkflowStep.roleId`, and Sprint 41's approved `WorkflowChain` places no uniqueness constraint on `roleId` across a chain's steps. A chain repeating a role (e.g., Builder → Reviewer → Builder) is legal to construct but can never have an `EngineeringSession` bound to either of its repeated-role positions — confirmed both by direct code reading (`normalizeWorkflowBinding`'s ambiguity rejection) and by the Builder's own deliberate test (`engineering-session.test.ts:205-213`) and documented assumption (`IMPLEMENTATION_REPORT.md` Sprint 42 § Architectural Assumptions). Filed as `NEXUS-REV-2026-07-14-021-F-001` (Major, Category 1) since RFC-0004 frames this concern as ordinal "position," which a chain-relative step index would satisfy without requiring role uniqueness or any change to the frozen `WorkflowChain`/`WorkflowStep` classes.

Confirmed by `git diff` that `WorkflowChain`, `WorkflowChainId`, `WorkflowStep`, `IWorkflowChainRepository`, `InMemoryWorkflowChainRepository`, `WorkflowChainService`, `ExecutionSession`, `ExecutionSessionId`, `ExecutionSessionService`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, `ExecutionStrategy`, and the Kernel Canon are all unmodified; the only existing-file change is `create-kernel-services.ts`, limited to passing the shared `InMemoryWorkflowChainRepository` instance into `EngineeringSessionService`'s constructor (the one authorized composition touch point). No `src/hosts` or `src/adapters` file was touched.

Independently reran `npm run compile` (clean), `npm run lint` (clean), `npm run test` (71 files / 328 tests passing), `npm run build` (clean), and `npm run test:extension-host:build` (clean).

**TASK-001 Remediation Verification (NEXUS-REV-2026-07-14-022):** Independently confirmed `TASK-001`'s remediation of `NEXUS-REV-2026-07-14-021-F-001`. `normalizeWorkflowBinding` no longer matches `currentWorkflowStepId` against `WorkflowStep.roleId`; it now validates a canonical zero-based position string and bounds-checks it against `workflowChain.steps.length`, resolving the repeated-role ambiguity entirely. Two new tests — `engineering-session.test.ts:213-243` and `engineering-session.service.test.ts:182-215` — directly reproduce the finding's `[builder, reviewer, builder]` scenario and confirm all three positions bind independently. `WorkflowChain`, `WorkflowStep`, and every other protected file remain confirmed unmodified; the remediation is confined entirely to `EngineeringSession`'s own files and tests, within `NEXUS-RAT-2026-07-14-022`'s existing authorization. Re-ran `npm run compile`, `npm run lint`, `npm run test` (71 files / 330 tests passing), `npm run build`, and `npm run test:extension-host:build`, all clean.

### Final Disposition

**Approved with Findings** (historical, `NEXUS-REV-2026-07-14-021`). No architectural violations were detected at initial review; `EngineeringSession`'s `WorkflowChain` binding conforms to RFC-0004 v1.3 and `NEXUS-RAT-2026-07-14-022`'s Authorized Builder Scope for three of its four Refinements. One Major finding (`NEXUS-REV-2026-07-14-021-F-001`, Category 1 — Implementation Defect) was recorded at initial review.

**TASK-001 Completed and independently verified (`NEXUS-REV-2026-07-14-022`). Sprint 42 is fully closed with zero open findings.**

Date: 2026-07-14

Reviewer: Reviewer AI (Claude Code)

Review References: `NEXUS-REV-2026-07-14-021`; `NEXUS-REV-2026-07-14-022` (TASK-001 remediation verification)
