# Sprint 35 — Builder Workflow Foundation

**Status:** Approved.

---

## Objective

Introduce the first AI Engineering Workflow by implementing a dedicated Builder Workflow entry point that reuses the certified Host, Configuration, Execution Pipeline, and Adapter architecture verbatim. This Sprint evolves Nexus from a generic Developer Workflow into the first dedicated, Role-scoped AI Engineering Workflow, without introducing any new Kernel behavior, Role, Adapter, or RFC concept.

---

## RFC Coverage

- No Primary RFC — Host-layer additive command, reusing existing certified contracts.
- Referenced: RFC-0004 — Execution Model (`builder` Execution Role, already registered by Sprint 8, consumed unmodified), RFC-0009 — Host Contract, RFC-0010 — Kernel Boundaries.

Sprint 35 introduces no new normative concept in any RFC.

---

## Ratification References

- `NEXUS-RAT-2026-07-14-010` — governs this Sprint's entire scope: title, authorized command addition, Host/Kernel responsibility split, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-005` — named the original three candidate directions for Milestone 6; `NEXUS-RAT-2026-07-14-010` selects a fourth direction instead, explicitly superseding those three for Sprint 35's selection only (they remain valid future candidates for later Sprints).
- `NEXUS-RAT-2026-07-13-011` — explicit-`adapterId`-only dispatch remains unaffected.

---

## Architectural Precondition (verified before ratification)

- `builder` and `reviewer` are already registered default Execution Roles (`src/kernel/execution/default-kernel-roles.ts`, Sprint 8).
- The existing `HostMissionWorkflow` pipeline already defaults its `roleId` constructor option to `'builder'` (`src/hosts/vscode/host-mission-workflow.ts:129`) for every existing Developer Workflow command (Mock/Gemini/Codex/Configured-Adapter).
- "Developer Workflow" is a Sprint-25 Host-layer term, not an RFC-0009 concept; "Builder Workflow" is the same category of Host-layer naming.

This Sprint therefore reuses an already-exercised Kernel Role and an already-parameterized Host pipeline option — it does not introduce new Kernel surface area.

---

## Preserved Architecture (binding, unchanged)

```text
Developer → nexus.runBuilderMissionWorkflow (new, additive) →
HostAdapterConfigurationResolver.resolveDeveloperWorkflowAdapterId() [reused verbatim] →
HostMissionWorkflow (constructed with explicit roleId: 'builder') →
[Sprint 25/26/27 certified Execution Pipeline, unchanged] →
Host presents Builder-specific execution result
```

No Kernel contract, Adapter contract, or existing command's dispatch behavior changes.

---

## Authorized Vertical Slice

- A new, additive Host command (e.g. `nexus.runBuilderMissionWorkflow`) constructing the existing `HostMissionWorkflow`/`HostConfiguredMissionWorkflow` machinery with an explicit `roleId: 'builder'`, reusing Host Adapter Configuration resolution (Sprint 33) and the certified Execution Pipeline (Sprints 25–27) verbatim.
- `package.json` `contributes.commands`/`activationEvents` registration for the new command, following the existing registration pattern (Sprints 30/32/33).
- Host presentation/result formatting extended to label the new command's output as Builder-specific (e.g., surfacing the assigned Role name in the result/history presentation), without introducing new Kernel data or a new Domain Event.
- Unit/integration test coverage for the new command's success and failure paths, using existing deterministic test-doubles exclusively.

---

## Deferred Concepts

- Reviewer Workflow, Planner Workflow, or any other role-scoped workflow beyond Builder.
- Role-based adapter assignment, workflow chaining, multi-agent coordination, automatic routing.
- Any new RFC-0004 Execution Model concept (Execution State expansion, Execution Session, Review-gated progression).
- A fourth production Adapter, Adapter Selection Policy, Marketplace publication.
- Any `src/kernel` or `src/adapters` change; any change to `HostAdapterConfigurationResolver`, `HostConfiguredMissionWorkflow`, or existing command dispatch/registration logic.

---

## Acceptance Criteria (Definition of Done)

- All existing Developer Workflow commands (`nexus.runDeveloperMissionWorkflow`, `...WithGeminiCli`, `...WithCodexCli`, `...WithConfiguredAdapter`) and `nexus.showMissionWorkflowHistory` retain their identifiers, dispatch behavior, and test coverage, unmodified.
- The new Builder Workflow command dispatches through the identical certified Execution Pipeline with explicit `roleId: 'builder'`, and reuses Host Adapter Configuration resolution unmodified.
- The new command's result presentation is Builder-specific (labels the assigned Role) without introducing new Kernel data or Domain Events.
- No `src/kernel`/`src/adapters` file changes.
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

---

## Builder Responsibilities

- Implement exactly the Authorized Vertical Slice above; do not exceed `NEXUS-RAT-2026-07-14-010`'s Authorized Builder Scope.
- Do not modify any file under `src/kernel` or `src/adapters`.
- Do not modify existing command dispatch/registration logic beyond the additive registration of the new command.
- Report implementation outcome, assumptions, limitations, and any architectural deviations ("No architectural deviations." if none) in `IMPLEMENTATION_REPORT.md`, following the Sprint 34 section's format.
- Record Sprint 35's completion in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` per the Constitution's Implementation Manifest requirements.

---

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` — new Sprint 35 section (Scope, Referenced RFCs, Referenced Reference Documents, Assumptions, Limitations, Architectural Deviations).
- `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md` — status update to Implemented/Approved upon Reviewer certification.
- README or equivalent user-facing documentation updated to describe the new Builder Workflow command alongside the existing Developer Workflow commands.

---

## Known Limitations

- Only a Builder Workflow is introduced this Sprint; Reviewer Workflow, Planner Workflow, and any workflow chaining/coordination between them are explicitly deferred to future, separately-ratified Sprints.
- This Sprint does not change session-only, non-durable history behavior (Sprint 25's constraint).

---

## Reserved Sections

### Builder Results

Implemented Sprint 35 as an additive Host-layer Builder Workflow entry point.

Implemented scope:

- Added `nexus.runBuilderMissionWorkflow` as a new VS Code Host command.
- Registered the new command in `package.json` activation events and command contributions.
- Composed the Builder Workflow through `HostConfiguredMissionWorkflow`, reusing Host Adapter Configuration resolution and the certified execution pipeline unchanged.
- Constructed Builder Workflow `HostMissionWorkflow` instances with explicit `roleId: 'builder'`.
- Added Builder-specific Host result/history presentation metadata for the assigned Execution Role without adding Kernel data or Domain Events.
- Added deterministic command-registration, Builder result labeling, package metadata, and extension-host command-registration coverage.
- Updated README user guidance for the Builder Workflow command.

Validation summary:

- Targeted Sprint 35 tests passed: `test/hosts/vscode/host-mission-workflow.test.ts`, `test/hosts/vscode/host-mission-workflow-configured-command-registration.test.ts`, and `test/hosts/vscode/package-command-metadata.test.ts`.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 59 files, 287 tests.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.
- Sprint 18 Kernel boundary certification remained unmodified and passed as part of repository-wide validation.
- No `src/kernel` or `src/adapters` files were modified.

### Reviewer Notes

Independently verified `git status`/`git diff --stat` for `src/kernel` and `src/adapters` are empty, and that `src/hosts/vscode/host-adapter-configuration.ts` is untouched — the Builder Workflow reuses `HostAdapterConfigurationResolver`/`HostConfiguredMissionWorkflow` verbatim via a second `HostConfiguredMissionWorkflow` instance over a second `Map` of `HostMissionWorkflow` instances constructed with explicit `roleId: 'builder'`. Confirmed the surfaced `assignedRoleId`/`assignedRoleName` are read from the existing `ExecutionRole` already retrieved via `roleService.retrieveRole` (Sprint 8's registered `builder`/`'Builder'` Role), not new Kernel data. Confirmed no existing Developer Workflow command's identifier, dispatch, or test coverage changed, and that `RATIFICATION_LEDGER.md`/`IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` diffs are additive only. Independently reran `npm run validate` (tsc, ESLint, Vitest 59 files/287 tests, esbuild), `npm run test:extension-host:build`, and the Sprint 18 Kernel Boundary Certification test in isolation — all passed, matching the Builder's reported results. See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-14-011` for full findings.

### Final Disposition

**PASS.** No architectural violations detected. Sprint 35 is Approved.
