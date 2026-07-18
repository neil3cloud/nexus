# Sprint 38 — Engineering Role Profiles Foundation

**Status:** Approved with Findings — NEXUS-REV-2026-07-14-015.

---

## Objective

Introduce the Kernel-owned `EngineeringRoleProfile` domain concept authorized by RFC-0004 v1.1 (`NEXUS-RAT-2026-07-14-014`), mirroring the existing `ExecutionRole`/`RoleRegistry` pattern, and seed one default profile per already-registered Kernel Role (`builder`, `reviewer`, `documentation-reviewer`) with presentation metadata semantically equivalent to the existing Builder, Reviewer, and Documentation Reviewer Workflow presentation strings already in `vscode-host.ts`.

This Sprint establishes metadata only. It introduces no orchestration, no Host wiring, and no observable behavior change.

---

## RFC Coverage

- RFC-0004 — Execution Model v1.1 (Primary; new "Engineering Role Profile" section, added by `NEXUS-RAT-2026-07-14-014`).
- Referenced: RFC-0010 — Kernel Boundaries (Kernel-only change; provider-independent).

Sprint 38 introduces no new normative concept beyond the one RFC-0004 v1.1 already authorizes.

---

## Ratification References

- `NEXUS-RAT-2026-07-14-015` — governs this Sprint's entire scope: `EngineeringRoleProfileService`'s non-orchestration boundary, registry immutability after Kernel composition, the strengthened acceptance criterion ("EngineeringRoleProfile SHALL be the only new normative architectural concept introduced by Sprint 38"), the forward-compatibility statement, and the semantic-equivalence (not byte-for-byte) presentation-value requirement.
- `NEXUS-RAT-2026-07-14-014` — the RFC-0004 v1.1 amendment (Engineering Role Profile) this Sprint implements.
- `NEXUS-RAT-2026-07-14-011` — the milestone-boundary ratification opening Milestone 7, retitled to "AI Engineering Workflow Framework" to include this Sprint's framework objective.

---

## Ownership Boundary (binding, from RFC-0004 v1.1 / NEXUS-RAT-2026-07-14-014 / -015)

| Concern | Owner |
| --- | --- |
| Execution identity, execution semantics, dispatch eligibility | `ExecutionRole` |
| Registration, lookup, enumeration of Execution Roles | `RoleRegistry` |
| Workflow presentation metadata, completion presentation metadata, attribution presentation policy, engineering role discoverability | `EngineeringRoleProfile` |
| Command registration, workflow dispatch | Host (RFC-0009), unchanged this Sprint |
| Execution Pipeline | Existing Kernel architecture, unchanged |

`EngineeringRoleProfile` SHALL NOT replace, wrap, or redefine `ExecutionRole`. `ExecutionRole` remains the sole authority for execution semantics, identity, and dispatch eligibility.

---

## Authorized Vertical Slice

- `EngineeringRoleProfile` — immutable Kernel value object (`src/kernel/execution/engineering-role-profile.ts`):
  - `roleId` (`RoleId`) — reference to the owning `ExecutionRole`, not a duplicate identity.
  - Workflow presentation metadata (e.g. a `workflowPresentationLabel` field).
  - Completion presentation metadata (e.g. a `completionPresentationLabel` field).
  - Attribution presentation policy (e.g. an `includeAssignedRoleInPresentation` boolean).
  - `create`/`fromSnapshot`/`toSnapshot`/`equals`, mirroring `ExecutionRole`'s exact construction pattern (`src/kernel/execution/execution-role.ts`), including `Object.freeze` immutability and non-empty-string validation via a dedicated `InvalidEngineeringRoleProfileDefinitionError`.
- `EngineeringRoleProfileRegistry` contract + `InMemoryEngineeringRoleProfileRegistry` (`src/kernel/execution/engineering-role-profile-registry.ts`), mirroring `RoleRegistry`/`InMemoryRoleRegistry` (`src/kernel/execution/role-registry.ts`) exactly: `register`/`getById`/`has`/`enumerate`, keyed by `RoleId`, with `DuplicateEngineeringRoleProfileRegistrationError` on duplicate registration.
- `createDefaultEngineeringRoleProfiles()` (`src/kernel/execution/default-engineering-role-profiles.ts`) — a factory producing exactly one `EngineeringRoleProfile` per entry currently returned by `createDefaultKernelRoles()` (`builder`, `reviewer`, `documentation-reviewer`), with presentation values **semantically equivalent** to the `presentationOptions` already hardcoded for each Role's workflow in `vscode-host.ts` (Builder: `workflowLabel: 'Builder Workflow'`, `completionMessageLabel: 'Builder workflow'`, `includeAssignedRole: true`; Reviewer: `workflowLabel: 'Reviewer Workflow'`, `completionMessageLabel: 'Reviewer workflow'`, `includeAssignedRole: true`; Documentation Reviewer: `workflowLabel: 'Documentation Reviewer Workflow'`, `completionMessageLabel: 'Documentation Review completed'`, `includeAssignedRole: true`). Exact wording MAY be adapted for the new abstraction provided the presentation intent is preserved; no `vscode-host.ts` file changes as a result.
- `EngineeringRoleProfileService` (`src/kernel/execution/engineering-role-profile.service.ts`) — a thin, non-orchestration abstraction over the registry. Its responsibilities SHALL be limited strictly to: lookup (`getById`), existence checks (`has`), enumeration (`enumerate`), and diagnostics (duplicate registration, not-found). It SHALL NOT gain business rules, workflow behavior, or execution behavior of any kind.
- `createKernelServices` (Kernel composition) is updated to construct an `InMemoryEngineeringRoleProfileRegistry`, seed it via `createDefaultEngineeringRoleProfiles()` **at composition time only**, and register `EngineeringRoleProfileService` with it. No public API is introduced for runtime profile creation; registration exists only during Kernel composition and the registry SHALL be treated as immutable thereafter.
- Unit tests:
  - `EngineeringRoleProfile` construction, validation, equality, immutability (mirroring `execution-role.test.ts`).
  - `InMemoryEngineeringRoleProfileRegistry` registration, duplicate rejection, lookup, `has`, enumeration (mirroring `role-registry` tests).
  - `createDefaultEngineeringRoleProfiles()` — asserts exactly one profile per default Kernel Role and asserts presentation values are semantically equivalent to the existing `vscode-host.ts` values for Builder/Reviewer/Documentation Reviewer.
  - `EngineeringRoleProfileService` — lookup, enumeration, and diagnostics behavior only; a test asserting the service exposes no execution/orchestration method.
  - A composition test asserting `createKernelServices()` seeds the registry from `createDefaultEngineeringRoleProfiles()` exactly once and that no runtime registration path exists outside composition.

---

## Architectural Purpose (forward compatibility, binding statement from NEXUS-RAT-2026-07-14-015)

`EngineeringRoleProfile` is established as the canonical engineering metadata abstraction for future Kernel and Host capabilities, remaining independent of execution semantics. Future capabilities MAY consume it, including Workflow Chaining, Planner Workflow, engineering role catalogs, future Host discovery mechanisms, and engineering orchestration. **This Sprint does not authorize any of those capabilities; it establishes only their common metadata foundation.**

---

## Deferred Concepts

- Any Host (`src/hosts`) file change — `vscode-host.ts` continues using its own inline `presentationOptions`; no existing command's identifier, dispatch behavior, presentation strings, or test coverage changes.
- Host/command discovery, workflow catalogs, Activity Bar integration, dashboard generation.
- Workflow Chaining, Assignment Policy, Execution Sessions, Planner Workflow.
- Security Reviewer, Performance Reviewer, Accessibility Reviewer, Test Engineer Workflows (and their Kernel Role registration).
- Adapter Routing, Adapter Selection, multi-agent orchestration, authorization.
- Any `src/adapters` or Execution Pipeline change.

---

## Deferred RFC Ownership

- Execution Strategy, Assignment, Assignment Policy, Execution State, Execution Session (RFC-0004, unmodified by this Sprint beyond the Engineering Role Profile addition already reflected in RFC-0004 v1.1).

---

## Known Limitations

- Engineering Role Profiles exist only for the Kernel's three current default Roles; no Additional Role (Security Reviewer, Performance Reviewer, Accessibility Reviewer, Test Engineer, Database Reviewer) gains a profile this Sprint, since none is registered as a Kernel Role yet.
- Profiles are in-memory only, seeded once at Kernel composition; no durable persistence, no runtime creation, no update/versioning capability.
- No Host consumer exists yet; the profiles are inert data until a future, separately-ratified Sprint wires Host discovery/presentation to read from them.

These are implementation boundaries, not defects.

---

## Acceptance Criteria (Definition of Done)

- `EngineeringRoleProfile` SHALL be the only new normative architectural concept introduced by Sprint 38. No additional execution, lifecycle, workflow, or orchestration concept is introduced.
- Every default Kernel Role (`builder`, `reviewer`, `documentation-reviewer`) has exactly one default Engineering Role Profile; presentation values remain semantically equivalent to existing `vscode-host.ts` values — no observable behavior change anywhere in the Host.
- No `src/hosts` or `src/adapters` file is modified; all existing Developer/Builder/Reviewer/Documentation Reviewer Workflow commands remain unmodified in identifier, dispatch behavior, presentation strings, and test coverage.
- `EngineeringRoleProfileService` remains a thin lookup/existence/enumeration/diagnostics abstraction; it introduces no execution behavior or business rule and SHALL NOT evolve into an orchestration service.
- Engineering Role Profile registration occurs only during Kernel composition (`createKernelServices`); the registry is immutable thereafter — no runtime profile creation is introduced.
- `EngineeringRoleProfile` carries no execution semantics, dispatch eligibility, lifecycle, assignment, orchestration, or authorization behavior, verified against RFC-0004 v1.1's "Engineering Role Profile SHALL NOT" list.
- `ExecutionRole` is not modified; `createDefaultKernelRoles()`'s three existing entries remain byte-for-byte unchanged.
- Sprint 18's Kernel Boundary Certification test passes, updated only if it enumerates Kernel-composed services (mirroring how Sprint 37 updated its role-enumeration assertion, and only that assertion).
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

---

## Builder Responsibilities

- Implement exactly the Authorized Vertical Slice above; do not exceed `NEXUS-RAT-2026-07-14-015`'s Authorized Builder Scope.
- Add new files only under `src/kernel/execution/`; do not modify `src/kernel/execution/default-kernel-roles.ts`, `execution-role.ts`, `role-registry.ts`, `role.service.ts`, or any other existing Kernel file's behavior (composition wiring in the Kernel's service-construction entry point is the one authorized touch point beyond new files).
- Do not modify any `src/hosts` or `src/adapters` file.
- Report implementation outcome, assumptions, limitations, and any architectural deviations ("No architectural deviations." if none) in `IMPLEMENTATION_REPORT.md`, following the Sprint 37 section's format.
- Record Sprint 38's completion in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` per the Constitution's Implementation Manifest requirements (status transition from "Current" to "Implemented — Pending Reviewer Validation").

---

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` — new Sprint 38 section (Scope, Referenced RFCs, Referenced Reference Documents, Assumptions, Limitations, Architectural Deviations).
- `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md` — status update to Implemented/Approved upon Reviewer certification.
- No README or user-facing documentation change is required this Sprint, since no Host-observable behavior changes.

---

## Reserved Sections

### Builder Results

Implemented the authorized Engineering Role Profiles Foundation vertical slice:

- Added immutable `EngineeringRoleProfile` Kernel value object, dedicated validation errors, snapshot conversion, equality, and immutability.
- Added `EngineeringRoleProfileRegistry` and `InMemoryEngineeringRoleProfileRegistry` with deterministic lookup, existence checks, enumeration, duplicate diagnostics, and composition-time constructor seeding.
- Added `createDefaultEngineeringRoleProfiles()` with one profile per default Kernel Role (`builder`, `reviewer`, `documentation-reviewer`) and presentation metadata semantically equivalent to the existing Host workflow values.
- Added `EngineeringRoleProfileService` as a thin lookup/existence/enumeration abstraction only; no runtime profile creation or orchestration method is exposed.
- Updated `createKernelServices()` to seed the profile registry during Kernel composition and compose `EngineeringRoleProfileService`.
- Added unit/integration coverage for the value object, registry, default profiles, service surface, and Kernel composition seeding.

No `src/hosts` or `src/adapters` file was modified. No execution semantics, dispatch eligibility, lifecycle, assignment, orchestration, Adapter routing, Adapter selection, or authorization behavior was introduced.

### Reviewer Notes

Independently reran full repository validation. `EngineeringRoleProfile`, `InMemoryEngineeringRoleProfileRegistry`, `createDefaultEngineeringRoleProfiles()`, and `EngineeringRoleProfileService` were read in full and confirmed to match the Authorized Vertical Slice exactly: the value object mirrors `ExecutionRole`'s construction pattern with no execution-semantic field; the registry mirrors `RoleRegistry`; the service exposes only `getById`/`has`/`enumerate` as own prototype methods (no orchestration surface); `createKernelServices()` seeds the registry once, at composition time, via the default-profiles factory. Confirmed by `git diff` that `ExecutionRole`, `default-kernel-roles.ts`, `role-registry.ts`, and `role.service.ts` are byte-for-byte unmodified, and that no `src/hosts` or `src/adapters` file was touched. Confirmed the Sprint 18 Kernel Boundary Certification test's import-graph-boundary assertion is unmodified; only its expected-service-list and enumeration assertions were extended, mirroring the Sprint 37 precedent.

`npm run validate` and `npm run test:extension-host:build` were independently rerun. One test, `test/integration/local-process-runtime.integration.test.ts` (unrelated Sprint 21 local-process-spawn coverage, touching no file this Sprint changed), failed under full-suite parallel load with a process-timing `TimedOut` result; rerun in isolation it passed deterministically (1/1). This is pre-existing test-infrastructure flakiness, not a Sprint 38 regression. With that confirmed, full validation passed: `tsc --noEmit`, ESLint, Vitest (62 files / 301 tests, matching the Builder's reported count), esbuild, and the extension-host bundle build.

One Minor Documentation Drift finding was recorded (`NEXUS-REV-2026-07-14-015-F-001`): the Milestone 7 status summary line in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` still read "Sprint 38 Current" after the Builder correctly updated Sprint 38's own subsection status to "Implemented — Pending Reviewer Validation." This finding does not affect approval. See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-14-015` for full findings and evidence.

## Required Actions

`IMPLEMENTATION_MANIFEST.md`'s Milestone 7 status summary line requires a documentation-only wording correction (F-001) via a future `nexus-sprint` Documentation Task. No implementation action is required.

### Final Disposition

**Approved with Findings.** No architectural violations detected. `EngineeringRoleProfile` conforms to RFC-0004 v1.1 and `NEXUS-RAT-2026-07-14-015`'s five binding refinements. One Minor Documentation Drift finding (F-001) generates a Documentation Task; it does not block Sprint 38's approval or Milestone 7 progression.

Date: 2026-07-14

Reviewer: Reviewer AI (Claude Code)

Review Reference: `NEXUS-REV-2026-07-14-015`
