# Sprint 37 — Documentation Workflow Foundation

**Status:** Approved with Findings — NEXUS-REV-2026-07-14-013.

---

## Objective

Register the existing RFC-0004 `Documentation Reviewer` Additional Role as a third default Kernel Role and expose its Host workflow entry point, `nexus.runDocumentationReviewerMissionWorkflow`, using the canonical Role-scoped Workflow factory introduced in Sprint 36 (`createConfiguredMissionWorkflow`). This is Milestone 7's first authorized `src/kernel` change — Role registration only — and otherwise reuses the certified Host, Configuration, Execution Pipeline, and Adapter architecture verbatim.

This Sprint introduces exactly one architectural variable: registering an already RFC-0004-named Role and exposing its corresponding Host workflow. All other architecture, execution behavior, and runtime components SHALL remain unchanged.

---

## RFC Coverage

- No Primary RFC — Kernel Role registration reuses RFC-0004's existing `ExecutionRole`/`RoleRegistry` contracts; the Host command is additive, reusing existing certified contracts.
- Referenced: RFC-0004 — Execution Model (registers the `Documentation Reviewer` Additional Role it already names under "Additional roles MAY include"), RFC-0009 — Host Contract, RFC-0010 — Kernel Boundaries.

Sprint 37 introduces no new normative concept in any RFC.

---

## Ratification References

- `NEXUS-RAT-2026-07-14-013` — governs this Sprint's entire scope: title, canonical Role id/command id/presentation strings, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-011` — the milestone-boundary ratification naming this Sprint's direction and flagging it as Milestone 7's first Sprint expected to touch `src/kernel`.
- `NEXUS-RAT-2026-07-14-012` — the binding Architectural Invariant for all Milestone 7 Sprints, which this Sprint complies with.

---

## Architectural Invariant (binding, inherited from NEXUS-RAT-2026-07-14-012)

Every Role-scoped Workflow entry point SHALL differ from every other **only** by:

- the Execution Role requested;
- workflow presentation metadata (`workflowLabel`, `completionMessageLabel`, `includeAssignedRole`, and equivalents).

All such workflows SHALL reuse, unmodified:

- Host Adapter Configuration (`HostAdapterConfigurationResolver`/`HostConfiguredMissionWorkflow`, Sprint 33);
- explicit-`adapterId` dispatch;
- the certified Execution Pipeline (Sprints 25–27);
- Adapter Runtime;
- Kernel contracts.

This Sprint's `completionMessageLabel` ("Documentation Review completed") deviates in wording from the `'{Role} workflow'` phrasing used by the Builder/Reviewer Workflows, but remains within the Invariant's permitted variance in presentation metadata "and equivalents" per `NEXUS-RAT-2026-07-14-013`.

---

## Preserved Architecture (binding, unchanged)

```text
Developer → nexus.runDocumentationReviewerMissionWorkflow (new, additive) →
HostAdapterConfigurationResolver.resolveDeveloperWorkflowAdapterId() [reused verbatim] →
createConfiguredMissionWorkflow (Sprint 36 factory, reused verbatim) (roleId: 'documentation-reviewer') →
HostMissionWorkflow →
[Sprint 25/26/27 certified Execution Pipeline, unchanged] →
Host presents Documentation Reviewer-specific execution result
```

No Kernel contract (beyond the one authorized Role-registration addition), Adapter contract, or existing command's dispatch behavior changes. The Builder Workflow (Sprint 35) and Reviewer Workflow (Sprint 36) continue to dispatch identically and are not modified.

---

## Authorized Vertical Slice

- Add exactly one new `ExecutionRole` entry to `createDefaultKernelRoles()` (`src/kernel/execution/default-kernel-roles.ts`) for Role id `documentation-reviewer`, mirroring the existing `builder`/`reviewer` entries' shape exactly (`category: 'Engineering Responsibility'`, `metadata.attributes: { origin: 'KernelDefault', rfc: 'RFC-0004' }`). The existing two entries SHALL remain byte-for-byte unchanged.
- Add `nexus.runDocumentationReviewerMissionWorkflow` via the Sprint 36 `createConfiguredMissionWorkflow` factory, with explicit `roleId: 'documentation-reviewer'` and `presentationOptions: { workflowLabel: 'Documentation Reviewer Workflow', completionMessageLabel: 'Documentation Review completed', includeAssignedRole: true }`.
- `package.json` `contributes.commands`/`activationEvents` registration for the new command, following the existing registration pattern (Sprints 30/32/33/35/36).
- Test coverage:
  - Kernel Role-registration unit test(s) confirming the new default Role and confirming `builder`/`reviewer` remain unchanged.
  - Host command registration, success-path, and input-cancellation-failure-path tests (mirroring Sprint 36's two new tests).
  - Package-metadata/activation-event/extension-host discoverability assertions.
  - A regression assertion that the Builder and Reviewer Workflows' existing tests continue to pass unmodified.

---

## Deferred Concepts

- Planner Workflow, Documentation Author Workflow, Security Reviewer Workflow, Architecture Reviewer Workflow, or any other role-scoped workflow beyond Builder/Reviewer/Documentation Reviewer.
- Registration of any Additional Role other than `Documentation Reviewer` (Security Reviewer, Performance Reviewer, Accessibility Reviewer, Test Engineer, Database Reviewer).
- Role-based adapter assignment, workflow chaining, multi-agent coordination, automatic routing.
- Any new RFC-0004 Execution Model concept (Execution State expansion, Execution Session, Review-gated progression, Assignment Policy).
- A fourth production Adapter, Adapter Selection Policy, Marketplace publication.
- Any `src/adapters` change; any change to `HostAdapterConfigurationResolver`, `HostConfiguredMissionWorkflow`, or existing command dispatch/registration logic beyond the additive registration of the new command.

---

## Acceptance Criteria (Definition of Done)

- All existing commands (`nexus.runDeveloperMissionWorkflow`, `...WithGeminiCli`, `...WithCodexCli`, `...WithConfiguredAdapter`, `nexus.runBuilderMissionWorkflow`, `nexus.runReviewerMissionWorkflow`, `nexus.showMissionWorkflowHistory`) retain their identifiers, dispatch behavior, and test coverage, unmodified — Sprint 35/36's existing tests pass without modification to those tests.
- Exactly one new default `ExecutionRole` is registered (`documentation-reviewer`); the `builder`/`reviewer` entries remain byte-for-byte unchanged; no new Kernel lifecycle, event, or concept is introduced.
- The new Documentation Reviewer Workflow command dispatches through the identical certified Execution Pipeline with explicit `roleId: 'documentation-reviewer'`, constructed via the Sprint 36 factory.
- The new command's result presentation is Documentation Reviewer-specific (labels the assigned Role `Documentation Reviewer (documentation-reviewer)`) without introducing new Kernel data or Domain Events.
- No `src/adapters` file changes; no change to `HostAdapterConfigurationResolver`/`HostConfiguredMissionWorkflow`.
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

---

## Builder Responsibilities

- Implement exactly the Authorized Vertical Slice above; do not exceed `NEXUS-RAT-2026-07-14-013`'s Authorized Builder Scope.
- Modify only `src/kernel/execution/default-kernel-roles.ts` within `src/kernel` (Role registration only, per the ratification); do not modify any other `src/kernel` file or any `src/adapters` file.
- Do not modify existing command dispatch/registration logic beyond the additive registration of the new command.
- Report implementation outcome, assumptions, limitations, and any architectural deviations ("No architectural deviations." if none) in `IMPLEMENTATION_REPORT.md`, following the Sprint 36 section's format.
- Record Sprint 37's completion in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` per the Constitution's Implementation Manifest requirements.

---

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` — new Sprint 37 section (Scope, Referenced RFCs, Referenced Reference Documents, Assumptions, Limitations, Architectural Deviations).
- `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md` — status update to Implemented/Approved upon Reviewer certification.
- README or equivalent user-facing documentation updated to describe the new Documentation Reviewer Workflow command alongside the existing Developer, Builder, and Reviewer Workflow commands.

---

## Known Limitations

- Only Builder, Reviewer, and Documentation Reviewer Workflows exist after this Sprint; any further role-scoped or coordinated workflows remain deferred to future, separately-ratified Sprints.
- This Sprint does not change session-only, non-durable history behavior (Sprint 25's constraint).
- The Documentation Reviewer Workflow uses the same configured adapter setting as the configured Developer, Builder, and Reviewer Workflows, preserving Sprint 33 configuration scope and avoiding role-based adapter assignment.

---

## Reserved Sections

### Builder Results

Implemented the authorized Documentation Workflow Foundation vertical slice.

Builder implementation summary:

- Added exactly one default Kernel `ExecutionRole` registration for `documentation-reviewer` in `src/kernel/execution/default-kernel-roles.ts`.
- Added `nexus.runDocumentationReviewerMissionWorkflow` through the Sprint 36 `createConfiguredMissionWorkflow` factory with explicit `roleId: 'documentation-reviewer'`.
- Registered the command in `package.json` activation events and command contributions.
- Added deterministic coverage for default Role registration, Host command registration/success/cancellation, package metadata activation/contribution assertions, extension-host discoverability, and Documentation Reviewer result/history presentation.
- Updated README user-facing workflow documentation.

Validation summary:

- Targeted Sprint 37 tests passed: `npm test -- --run test/kernel/execution/execution-role.test.ts test/hosts/vscode/host-mission-workflow-configured-command-registration.test.ts test/hosts/vscode/host-mission-workflow.test.ts test/hosts/vscode/package-command-metadata.test.ts`.
- Repository validation passed: `npm run validate`.
- Extension-host bundle build passed: `npm run test:extension-host:build`.
- Sprint 18 Kernel boundary certification test passed unmodified.
- No `src/adapters` file was modified.

No architectural deviations.

### Reviewer Notes

Independently reran `npm run validate` (`tsc --noEmit`, ESLint, Vitest 59 files / 294 tests, esbuild) and `npm run test:extension-host:build`; both passed. Confirmed exactly one new default `ExecutionRole` (`documentation-reviewer`) was registered and that the existing `builder`/`reviewer` entries are byte-for-byte unchanged. Confirmed `src/adapters`, `HostAdapterConfigurationResolver`, and `HostConfiguredMissionWorkflow` are untouched, and that no existing Developer/Builder/Reviewer Workflow command's identifier, dispatch behavior, or test coverage changed. One Minor Documentation Drift finding was recorded (`NEXUS-REV-2026-07-14-013-F-001`): `IMPLEMENTATION_REPORT.md`'s Validation Summary overstates that the Sprint 18 Kernel Boundary Certification *test file* remained unmodified, when in fact only the specific import-graph-boundary assertion within it (the Sprint Specification's actual Acceptance Criterion) remained unmodified — the file's role-enumeration assertion was correctly and necessarily updated to reflect the new default Role. This finding does not affect approval. See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-14-013` for full findings and evidence.

### Final Disposition

**Approved with Findings.** No architectural violations detected. One Minor Documentation Drift finding (F-001) generates a Documentation Task; it does not block Sprint 37's approval or Milestone 7 progression.

### Remediation Verification

`DOC-003` (`builder-task.md`, remediating `NEXUS-REV-2026-07-14-013-F-001`) was independently verified in `NEXUS-REV-2026-07-14-014`: `IMPLEMENTATION_REPORT.md`'s Sprint 37 Validation Summary now accurately distinguishes the updated role-enumeration assertion in `test/integration/kernel-boundary-certification.integration.test.ts` from its unmodified import-graph-boundary assertion. No other file was modified. Repository-wide validation (`tsc --noEmit`, ESLint, Vitest 59/294, esbuild) passed unchanged. `DOC-003` is **Completed**; Sprint 37 has no remaining open findings.
