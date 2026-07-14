# Sprint 41 — Workflow Chaining Foundation

**Status:** Approved — NEXUS-REV-2026-07-14-020.

---

## Objective

Implement RFC-0004 v1.3's `WorkflowChain` — the Kernel-owned, immutable definition of an ordered engineering workflow (chain identity, ordered `WorkflowStep`s each referencing an Execution Role, workflow topology) — as a standalone Kernel domain concept, wholly independent of `EngineeringSession` and `ExecutionSession`.

This Sprint establishes `WorkflowChain` identity, immutability, and structural definition only. It introduces no `EngineeringSession` wiring, no current-position tracking, no automatic advancement, no Assignment Policy, and no Host wiring.

---

## RFC Coverage

- RFC-0004 — Execution Model v1.3 (Primary; new "Workflow Chaining" section, added by `NEXUS-RAT-2026-07-14-020`).
- Referenced: RFC-0010 — Kernel Boundaries (Kernel-only change; provider-independent).

Sprint 41 introduces no new normative concept beyond the one RFC-0004 v1.3 already authorizes.

---

## Ratification References

- `NEXUS-RAT-2026-07-14-021` — Sprint 41 scope ratification: governs this Sprint's entire scope, Authorized Builder Scope, two Sprint Owner Refinements, Explicitly Deferred list, and scope restrictions.
- `NEXUS-RAT-2026-07-14-020` — the RFC-0004 v1.3 amendment (Workflow Chaining, `EngineeringSession` Architectural Responsibilities clarification) this Sprint implements.
- `NEXUS-RAT-2026-07-14-018` / `-019` — Sprint 39/40's ratifications; establish `EngineeringSession` and `ExecutionSession`, both confirmed unmodified by this Sprint.

---

## Ownership Boundary (binding, from RFC-0004 v1.3 / NEXUS-RAT-2026-07-14-021)

| Concern | Owner |
| --- | --- |
| Chain identity, ordered workflow steps, workflow topology (immutable template) | `WorkflowChain` (this Sprint) |
| Each `WorkflowStep`'s reference to exactly one Execution Role | `WorkflowStep` via existing `RoleId` (this Sprint) |
| Engineering runtime context, active `WorkflowChain` reference, current workflow position, workflow state, workflow execution history, participating Engineering Roles, session timeline, session diagnostics, collaboration metadata | `EngineeringSession` (Sprint 39, unmodified — wiring deferred to a future Sprint) |
| One coordinated execution attempt | `ExecutionSession` (Sprint 40, unmodified) |
| Execution identity, execution semantics, dispatch eligibility | `ExecutionRole` (unmodified) |
| Assignment Policy evaluation | RFC-0004 "Assignment Policy" section (unmodified, unimplemented, out of scope) |

`WorkflowChain` SHALL NOT redefine or duplicate `EngineeringSession`'s or `ExecutionSession`'s responsibilities. `WorkflowStep` SHALL NOT directly reference `EngineeringSession`, `ExecutionSession`, Adapter, Assignment Policy, or `EngineeringRoleProfile` (Refinement 2).

---

## Authorized Vertical Slice

- `WorkflowChain` — Kernel domain concept (new file(s) under `src/kernel/execution/`):
  - `WorkflowChainId` — immutable identity value object.
  - An ordered, immutable list of `WorkflowStep`s, each referencing exactly one Execution Role via the existing `RoleId`. No other field on `WorkflowStep` (Refinement 2).
  - Construction/validation mirroring the existing `ExecutionSession`/`EngineeringSession` pattern: `create`/`fromSnapshot`/`toSnapshot`/`equals`, immutability per snapshot, dedicated validation error type.
  - No mutation method of any kind after construction (Refinement 1): changing a workflow definition requires creating a new `WorkflowChain` instance, not mutating an existing one.
- An `IWorkflowChainRepository` contract and in-memory implementation, mirroring the existing Kernel repository pattern: create, lookup, enumerate only.
- `WorkflowChainService` — thin orchestration through constructor-injected repository contracts, limited to: create, lookup by id, enumerate. No dispatch, no advancement, no Assignment Policy evaluation, no `EngineeringSession` wiring.
- `createKernelServices` composition updated to construct the `WorkflowChain` repository and `WorkflowChainService` and register them alongside existing Kernel services. No modification to `EngineeringSession`, `ExecutionSession`, or any other existing Execution/Mission-domain file's behavior.
- Unit tests:
  - `WorkflowChain` construction, validation, equality, immutability, and absence of any mutation method (mirroring the Sprint 40 `ExecutionSession` `'close' in ...` / `'save' in ...` assertion pattern).
  - `WorkflowStep` boundary constraints: constructs with exactly one Execution Role reference; rejects any attempt to carry an `EngineeringSession`, `ExecutionSession`, Adapter, Assignment Policy, or `EngineeringRoleProfile` reference (type-level and/or runtime, as applicable).
  - Repository registration, lookup, and enumeration.
  - `WorkflowChainService` orchestration: create, lookup, enumeration (not-found, invalid input).
  - A composition assertion that `createKernelServices()` composes the `WorkflowChain` repository and `WorkflowChainService` without altering any existing composed service, including `EngineeringSessionService` and `ExecutionSessionService`.

---

## Deferred Concepts

- `EngineeringSession` → `WorkflowChain` wiring (active-chain reference, current workflow position).
- Automatic workflow advancement, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing, concurrent session coordination.
- Any `src/hosts` or `src/adapters` file change.
- Any modification to `EngineeringSession`, `EngineeringSessionId`, `EngineeringSessionStatus`, `EngineeringSessionService`, `ExecutionSession`, `ExecutionSessionId`, `ExecutionSessionService`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, `ExecutionStrategy`, `Task`, `TaskId`, or any existing Kernel Execution/Mission-domain file's behavior, beyond the one authorized `createKernelServices` composition touch point.

---

## Deferred RFC Ownership

- Execution, Execution Strategy, Execution Role, Assignment, Assignment Policy, Execution State, Engineering Session, Execution Session (RFC-0004, unmodified by this Sprint beyond the Workflow Chaining addition already reflected in RFC-0004 v1.3).

---

## Known Limitations

- `WorkflowChain` exists as an isolated Kernel concept this Sprint; no `EngineeringSession` consumer, no current-position tracking, and no linkage to `ExecutionSession` records is introduced.
- Chains are in-memory only; no durable persistence.
- No workflow, review, or orchestration behavior consumes `WorkflowChain` yet — it is inert Kernel state until a future, separately-ratified Sprint wires `EngineeringSession` to reference and execute it.

These are implementation boundaries, not defects.

---

## Acceptance Criteria (Definition of Done)

- `WorkflowChain` SHALL be the only new normative architectural concept introduced by Sprint 41.
- `WorkflowChain` is immutable after creation; its topology and ordered steps cannot be modified; a changed workflow definition requires creating a new `WorkflowChain` instance (Refinement 1).
- Every `WorkflowStep` references exactly one Execution Role via `RoleId`; no `WorkflowStep` references `EngineeringSession`, `ExecutionSession`, Adapter, Assignment Policy, or `EngineeringRoleProfile` (Refinement 2).
- No existing Kernel Execution/Mission-domain file (`EngineeringSession`, `ExecutionSession`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, `ExecutionStrategy`, `Task`, `TaskId`) is modified beyond the one authorized `createKernelServices` composition touch point.
- No `src/hosts` or `src/adapters` file is modified; all existing Developer/Builder/Reviewer/Documentation Reviewer Workflow commands remain unmodified in identifier, dispatch behavior, presentation strings, and test coverage.
- `WorkflowChainService` remains thin orchestration; business rules (validity, invariants) remain within `WorkflowChain` and `WorkflowStep`.
- Sprint 18's Kernel Boundary Certification test passes, updated only if it enumerates Kernel-composed services (mirroring the Sprint 37/38/39/40 precedent).
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

---

## Builder Responsibilities

- Implement exactly the Authorized Vertical Slice above; do not exceed `NEXUS-RAT-2026-07-14-021`'s Authorized Builder Scope or its two Refinements.
- Add new files only under `src/kernel/execution/` (or an equivalent existing Kernel execution module location); do not modify any existing Kernel Execution/Mission-domain file's behavior beyond the one authorized composition touch point (`createKernelServices`).
- Do not modify any `src/hosts` or `src/adapters` file.
- Report implementation outcome, assumptions, limitations, and any architectural deviations ("No architectural deviations." if none) in `IMPLEMENTATION_REPORT.md`, following the Sprint 40 section's format.
- Record Sprint 41's completion in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` per the Constitution's Implementation Manifest requirements (status transition from "Current" to "Implemented — Pending Reviewer Validation").

---

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` — new Sprint 41 section (Scope, Referenced RFCs, Referenced Reference Documents, Assumptions, Limitations, Architectural Deviations).
- `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md` — status update to Implemented/Approved upon Reviewer certification.
- No README or user-facing documentation change is required this Sprint, since no Host-observable behavior changes.

---

## Reserved Sections

### Builder Results

Implemented the authorized Workflow Chaining Foundation vertical slice.

- Added immutable `WorkflowChainId`.
- Added `WorkflowStep` as a value object referencing exactly one Execution Role via `RoleId`; no `EngineeringSession`, `ExecutionSession`, Adapter, Assignment Policy, or `EngineeringRoleProfile` references are accepted.
- Added immutable `WorkflowChain` with ordered `WorkflowStep` topology, `create`/`fromSnapshot`/`toSnapshot`/`equals`, immutable snapshots, and dedicated validation errors.
- Added `IWorkflowChainRepository` / `InMemoryWorkflowChainRepository` with create, lookup, and deterministic enumeration only.
- Added thin `WorkflowChainService` orchestration for create, lookup, and enumeration only.
- Updated `createKernelServices()` to compose `WorkflowChainService` through an in-memory workflow-chain repository.
- Added unit and integration coverage for construction, validation, equality, immutability, no mutation method, `WorkflowStep` boundary constraints, repository behavior, service behavior, and Kernel composition.

Deferred concepts remain unimplemented: `EngineeringSession` to `WorkflowChain` wiring, current workflow position, automatic advancement, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration, session recovery/checkpointing, concurrent session coordination, Host integration, and Adapter integration.

### Reviewer Notes

Independently read `workflow-chain.ts`, `workflow-chain-id.ts`, `workflow-chain.types.ts`, `workflow-chain.errors.ts`, `workflow-chain.contract.ts`, `workflow-chain.repository.ts`, and `workflow-chain.service.ts` in full, and confirmed they match the Authorized Vertical Slice and both Sprint Owner Refinements exactly: `WorkflowChain` carries only chain identity and an ordered, immutable list of `WorkflowStep`s (RFC-0004 v1.3's "Workflow Chaining" section); it exposes no mutation method of any kind — `'advance' in workflowChain`, `'addStep' in workflowChain`, `'close' in workflowChain`, and `'save' in workflowChain` are all explicitly asserted `false` in tests, and both `.steps` and `.toSnapshot().steps` are frozen arrays of frozen snapshots confirmed to throw `TypeError` on attempted `push` (Refinement 1). `WorkflowStep` accepts only `roleId` at the type level (`WorkflowStepInput` declares no other field) and is independently guarded at runtime by `assertWorkflowStepBoundary`, which rejects `engineeringSessionId`, `executionSessionId`, `adapterId`, `assignmentPolicy`, and `engineeringRoleProfileId` — a dedicated test bypasses TypeScript via `@ts-expect-error` for each forbidden field and confirms the runtime guard actually throws, proving it is genuinely reachable rather than redundant with compile-time checking alone (Refinement 2).

Confirmed by `git diff` that `EngineeringSession`, `EngineeringSessionId`, `EngineeringSessionStatus`, `EngineeringSessionService`, `ExecutionSession`, `ExecutionSessionId`, `ExecutionSessionService`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, `ExecutionStrategy`, `Task`, `TaskId`, and the Kernel Canon are all byte-for-byte unmodified (empty diffs confirmed directly); the only existing-file changes are `create-kernel-services.ts`, limited to constructing `InMemoryWorkflowChainRepository` and registering `WorkflowChainService` (the one authorized composition touch point), and `kernel-boundary-certification.integration.test.ts`, extended only to add `WorkflowChainService` to the harness/expected-service-name list and one empty-enumeration assertion, mirroring the Sprint 37/38/39/40 precedent exactly. No `src/hosts` or `src/adapters` file was touched. RFC-0004's v1.3 text (applied during planning) was not further modified by this Sprint.

Checked all exported symbols across the six new `workflow-chain.*.ts` files for dead code, given the Sprint 40 precedent (`NEXUS-REV-2026-07-14-018-F-001`, an unused `ExecutionSessionMetadata` type): every export is referenced and used somewhere in the implementation or tests. No equivalent finding this Sprint.

Independently reran `npm run compile` (clean), `npm run lint` (clean), `npm run build` and `npm run test:extension-host:build` (both clean), and the full Vitest suite (`npm test`) twice: **71 files / 326 tests** passed cleanly on both runs, with no flakiness observed.

### Final Disposition

**Approved.** No architectural violations detected. `WorkflowChain` conforms to RFC-0004 v1.3 and `NEXUS-RAT-2026-07-14-021`'s Authorized Builder Scope, including both Sprint Owner Refinements. No findings were recorded.

Date: 2026-07-14

Reviewer: Reviewer AI (Claude Code)

Review Reference: `NEXUS-REV-2026-07-14-020`
