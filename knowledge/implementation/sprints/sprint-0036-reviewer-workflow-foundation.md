# Sprint 36 — Reviewer Workflow Foundation

**Status:** Approved (NEXUS-REV-2026-07-14-012).

---

## Objective

Add a second Role-scoped AI Engineering Workflow, `nexus.runReviewerMissionWorkflow`, constructed with explicit `roleId: 'reviewer'` (Sprint 8's registered Execution Role), reusing Host Adapter Configuration resolution (Sprint 33) and the certified Execution Pipeline (Sprints 25–27) verbatim — mirroring Sprint 35's Builder Workflow exactly in externally observable behavior.

This Sprint additionally establishes the **canonical Role-scoped Workflow construction pattern** for Milestone 7: the Role-scoped Configured Mission Workflow construction currently duplicated in `vscode-host.ts` (once for the Developer Workflow, once near-identically for the Builder Workflow) SHALL be extracted into a single reusable factory function, and the existing Builder Workflow SHALL be refactored to use it. This is a behavior-preserving refactor, not a new capability.

---

## RFC Coverage

- No Primary RFC — Host-layer additive command, reusing existing certified contracts.
- Referenced: RFC-0004 — Execution Model (`reviewer` Execution Role, already registered by Sprint 8, consumed unmodified), RFC-0009 — Host Contract, RFC-0010 — Kernel Boundaries.

Sprint 36 introduces no new normative concept in any RFC.

---

## Ratification References

- `NEXUS-RAT-2026-07-14-012` — governs this Sprint's entire scope: title, the binding Architectural Invariant for all Milestone 7 Sprints, the authorized canonical-pattern-extraction refactor, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-011` — the milestone-boundary ratification that closed Milestone 6 at Sprint 34 and opened Milestone 7 — AI Engineering Workflows, under which this Sprint is planned.
- `NEXUS-RAT-2026-07-14-010` — the Sprint 35 scope ratification establishing the Builder Workflow pattern this Sprint mirrors and refactors.

---

## Architectural Invariant (binding on this and all future Milestone 7 Sprints)

Every Role-scoped Workflow entry point SHALL differ from every other **only** by:

- the Execution Role requested;
- workflow presentation metadata (`workflowLabel`, `completionMessageLabel`, `includeAssignedRole`, and equivalents).

All such workflows SHALL reuse, unmodified:

- Host Adapter Configuration (`HostAdapterConfigurationResolver`/`HostConfiguredMissionWorkflow`, Sprint 33);
- explicit-`adapterId` dispatch;
- the certified Execution Pipeline (Sprints 25–27);
- Adapter Runtime;
- Kernel contracts.

---

## Preserved Architecture (binding, unchanged)

```text
Developer → nexus.runReviewerMissionWorkflow (new, additive) →
HostAdapterConfigurationResolver.resolveDeveloperWorkflowAdapterId() [reused verbatim] →
<canonical Role-scoped Workflow factory, extracted this Sprint> (roleId: 'reviewer') →
HostMissionWorkflow →
[Sprint 25/26/27 certified Execution Pipeline, unchanged] →
Host presents Reviewer-specific execution result
```

No Kernel contract, Adapter contract, or existing command's dispatch behavior changes. The Builder Workflow (Sprint 35) continues to dispatch identically; only its internal construction is refactored to call the new shared factory.

---

## Authorized Vertical Slice

- Extract the Role-scoped Configured Mission Workflow construction (the `Map`-of-`HostMissionWorkflow` + `HostConfiguredMissionWorkflow` block, currently duplicated for the Developer and Builder Workflows in `vscode-host.ts`) into a single reusable Host-layer factory function parameterized by `roleId` and `presentationOptions`.
- Refactor the existing Builder Workflow wiring (Sprint 35) to call this factory instead of its current inline duplicate. Behavior-preserving only: `nexus.runBuilderMissionWorkflow`'s command identifier, dispatch target, presentation strings, and test coverage SHALL be unaffected and SHALL continue passing unmodified without test modification.
- Add `nexus.runReviewerMissionWorkflow` using the same factory, with explicit `roleId: 'reviewer'` and `presentationOptions: { workflowLabel: 'Reviewer Workflow', completionMessageLabel: 'Reviewer workflow', includeAssignedRole: true }`.
- `package.json` `contributes.commands`/`activationEvents` registration for the new command, following the existing registration pattern (Sprints 30/32/33/35).
- Unit/integration test coverage for the new command's success and input-cancellation-failure paths (mirroring Sprint 35's two new tests), package-metadata and extension-host discoverability assertions, and a regression assertion that the refactored Builder Workflow's existing tests still pass unchanged.

---

## Deferred Concepts

- Planner Workflow, Documentation Workflow, or any other role-scoped workflow beyond Builder/Reviewer.
- Role-based adapter assignment, workflow chaining, multi-agent coordination, automatic routing.
- Any new RFC-0004 Execution Model concept (Execution State expansion, Execution Session, Review-gated progression, Assignment Policy).
- A fourth production Adapter, Adapter Selection Policy, Marketplace publication.
- Any `src/kernel` or `src/adapters` change; any change to `HostAdapterConfigurationResolver`, `HostConfiguredMissionWorkflow`, or existing command dispatch/registration logic beyond the authorized internal refactor of the Builder Workflow's construction.

---

## Acceptance Criteria (Definition of Done)

- All existing commands (`nexus.runDeveloperMissionWorkflow`, `...WithGeminiCli`, `...WithCodexCli`, `...WithConfiguredAdapter`, `nexus.runBuilderMissionWorkflow`, `nexus.showMissionWorkflowHistory`) retain their identifiers, dispatch behavior, and test coverage, unmodified — Sprint 35's existing tests pass without modification to those tests.
- The Role-scoped Configured Mission Workflow construction exists as a single reusable factory, used by both the Builder Workflow and the new Reviewer Workflow.
- The new Reviewer Workflow command dispatches through the identical certified Execution Pipeline with explicit `roleId: 'reviewer'`.
- The new command's result presentation is Reviewer-specific (labels the assigned Role `Reviewer (reviewer)`) without introducing new Kernel data or Domain Events.
- No `src/kernel`/`src/adapters` file changes.
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

---

## Builder Responsibilities

- Implement exactly the Authorized Vertical Slice above; do not exceed `NEXUS-RAT-2026-07-14-012`'s Authorized Builder Scope.
- Do not modify any file under `src/kernel` or `src/adapters`.
- Do not modify existing command dispatch/registration logic beyond the additive registration of the new command and the authorized internal refactor of the Builder Workflow's construction.
- Report implementation outcome, assumptions, limitations, and any architectural deviations ("No architectural deviations." if none) in `IMPLEMENTATION_REPORT.md`, following the Sprint 35 section's format.
- Record Sprint 36's completion in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` per the Constitution's Implementation Manifest requirements.

---

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` — new Sprint 36 section (Scope, Referenced RFCs, Referenced Reference Documents, Assumptions, Limitations, Architectural Deviations).
- `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md` — status update to Implemented/Approved upon Reviewer certification.
- README or equivalent user-facing documentation updated to describe the new Reviewer Workflow command alongside the existing Developer and Builder Workflow commands.

---

## Known Limitations

- Only Builder and Reviewer Workflows exist after this Sprint; Documentation, Planner, and any other role-scoped or coordinated workflows remain deferred to future, separately-ratified Sprints.
- This Sprint does not change session-only, non-durable history behavior (Sprint 25's constraint).

---

## Reserved Sections

### Builder Results

Implemented Sprint 36 as an additive Host-layer Reviewer Workflow entry point and canonical Role-scoped configured workflow factory extraction.

Implemented scope:

- Extracted Role-scoped Configured Mission Workflow construction into a single reusable Host-layer factory in `vscode-host.ts`.
- Refactored the Sprint 35 Builder Workflow wiring to use the shared factory without changing its command identifier, dispatch target, presentation strings, or existing tests.
- Added `nexus.runReviewerMissionWorkflow` as a new VS Code Host command.
- Registered the Reviewer Workflow command in `package.json` activation events and command contributions.
- Composed Reviewer Workflow instances through the shared factory with explicit `roleId: 'reviewer'`.
- Added Reviewer-specific Host result/history presentation metadata for the assigned Execution Role without adding Kernel data or Domain Events.
- Added deterministic command-registration, Reviewer result labeling, package metadata/activation-event, and extension-host command-discoverability coverage.
- Updated README user guidance for the Reviewer Workflow command.

Validation summary:

- Targeted Sprint 36 tests passed: `test/hosts/vscode/host-mission-workflow-configured-command-registration.test.ts`, `test/hosts/vscode/host-mission-workflow.test.ts`, and `test/hosts/vscode/package-command-metadata.test.ts`.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 59 files, 291 tests.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.
- Sprint 18 Kernel boundary certification remained unmodified and passed as part of repository-wide validation.
- No `src/kernel` or `src/adapters` files were modified.

### Reviewer Notes

Independently verified `git status`/`git diff --stat` show no `src/kernel` or `src/adapters` changes, and confirmed `host-mission-workflow.ts`/`host-adapter-configuration.ts` (the certified `HostMissionWorkflow`/`HostAdapterConfigurationResolver`/`HostConfiguredMissionWorkflow` contracts) are untouched. Confirmed the `vscode-host.ts` refactor collapses the prior duplicated construction into a single `createConfiguredMissionWorkflow` factory used by the Developer/configured-adapter, Builder, and Reviewer workflows, with the Builder Workflow's call site preserving its exact prior `roleId`/`presentationOptions`. Confirmed `reviewer` is the pre-existing Sprint 8 registered Kernel Role. Reran `npm run validate` (tsc, ESLint, Vitest 59 files/291 tests, esbuild) and `npm run test:extension-host:build`; both passed. No findings. See `NEXUS-REV-2026-07-14-012` in `REVIEW_HISTORY.md` for the complete review.

### Final Disposition

**PASS.** No architectural violations detected. Sprint 36 is Approved.
