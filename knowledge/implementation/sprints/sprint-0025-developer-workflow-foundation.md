# Sprint 25 — Developer Workflow Foundation

## Sprint Status

Approved (NEXUS-REV-2026-07-13-026)

## Sprint Objective

Implement the first provider-independent Mission developer workflow inside the VS Code extension: a single Host-triggered command that sequences the already-certified Mission → MissionPlan → Task → MissionExecution golden path (the Mission/Planning/Execution portion of Sprint 16's end-to-end integration test) through existing public Kernel service contracts only, presenting progress and result, plus a session-only (in-memory, non-persistent) list of missions run.

This sprint gives the Host its first Mission-domain workflow entry point, mirroring the Adapter-domain entry point pattern already established and twice reviewed (Sprint 23 Host Ingress Foundation, Sprint 24 Host Runtime Completion) — reusing the same `HostInputSurface`/`HostPresentationSurface`/`HostWorkspaceTrustSurface` abstractions rather than inventing new ones.

No live AI provider, no Adapter dispatch, no Evidence, Shared Reality, Review, or Knowledge capture is introduced. No new Kernel concept, aggregate, or business rule is introduced — every operation this sprint calls already exists and is already certified by Sprint 2, 3, 4, and 16.

## Milestone

Milestone 4 — External Integration (seventh slice). Sprints 19–24 built and completed the Adapter-domain Host entry point. Sprint 25 opens a second, parallel Host entry point for the Mission domain, using the identical architectural pattern. It does not depend on, and does not touch, the Adapter/Execution-Pipeline work.

## RFC Coverage

Primary:

- RFC-0009 — Host Contract (Partial) — extends Command Registration / User Interaction to the Mission domain.

Referenced:

- RFC-0001 — Mission Model (existing lifecycle operations only; no semantic change).
- RFC-0004 — Execution Model (existing Task execution operations only; Execution Strategy and Role Assignment are NOT exercised — `MissionExecutionService` remains the sole Task execution entry point per the Sprint 10 precedent, and this sprint introduces no Adapter/Role involvement).
- RFC-0010 — Kernel Boundaries.

This sprint implements Host-layer orchestration only. No Mission, MissionPlan, Task, or MissionExecution business rule, state, or event is modified.

## Ratification References

None required. Two scope clarifications were resolved during `/nexus-plan` by direct application of the Sprint 23/24 precedent (Host thin orchestration over public Kernel contracts) rather than new governance — see Critical Boundary below. No Ratification Ledger entry conflicts with or governs this sprint.

## Critical Boundary (binding — resolves RFC-0009 § Separation of Responsibilities for this sprint)

RFC-0009 states the Host SHALL NOT "create Missions," "plan Missions," or "evolve Mission Plans." This is interpreted, consistent with the already-reviewed Sprint 23/24 Adapter-domain precedent, as: **the Host SHALL own no Mission business logic, validation, or invariant** — it may only be a thin, sequential caller of `MissionService`, `MissionPlanningService`, and `MissionExecutionService`'s existing public operations, passing user-supplied input straight through without interpretation. All validation, invariant enforcement, and state-transition legality remain exclusively inside the Kernel, exactly as today.

RFC-0009 states Hosts SHALL NOT persist Missions. The Sprint's "session-only Mission history" SHALL be interpreted narrowly: an in-memory, process-lifetime-only list of `{missionId, objective, finalStatus}` for missions run via this workflow, held purely for Output Channel convenience. It SHALL NOT reconstruct, cache, or duplicate Mission/MissionPlan/Task aggregate state, SHALL NOT use `vscode.Memento`/`globalState`/`workspaceState` or any other durable storage, and SHALL be discarded on extension deactivation.

## Architectural Responsibilities

**Host owns (this sprint, additive):** command registration for the workflow command; sequential invocation of existing Mission/MissionPlanning/MissionExecution public operations in the fixed order below; interactive collection of `objective`, Task `title`/`description`; presentation of progress and result; the session-only summary list described above.

**Kernel owns (unchanged):** all Mission, MissionPlan, and Task business rules, validation, lifecycle legality, and state transitions; Domain Event publication; repository persistence.

**MissionService / MissionPlanningService / MissionExecutionService (unchanged):** exactly the same public operations exercised by the Sprint 16 integration test; no method signature, business rule, or event is modified.

No Adapter, AdapterRegistry, AdapterService, LocalProcessRuntime, Execution Strategy, or Role Assignment is touched or exercised by this sprint.

## Authorized Vertical Slice

A single new Host command (e.g. `nexus.runDeveloperMissionWorkflow`), reusing Sprint 24's `HostInputSurface` (interactive prompts) and `HostPresentationSurface` (Output Channel, notifications, progress) exactly as-is, that:

1. Prompts for `objective` (Mission), then `title`/`description` for exactly one Task. Cancellation at any prompt aborts deterministically with a Host diagnostic and performs no Kernel calls, mirroring Sprint 24's `host-ingress.input-cancelled` pattern (a new diagnostic code in the same family, e.g. `host-mission-workflow.input-cancelled`).
2. Calls, in this exact order — the order Sprint 16's certified integration test already proves legal — with no additional business logic, retries, or branching beyond what each call's own resolved outcome dictates:
   - `MissionService.createMission({ id, objective })`
   - `MissionPlanningService.createMissionPlan({ id, missionId, revisionReason, revisionMetadata })`
   - `MissionService.planMission(missionId)`
   - `MissionPlanningService.addTask({ missionPlanId, taskId, title, description, revisionReason, revisionMetadata })`
   - `MissionPlanningService.updateTask({ missionPlanId, taskId, status: 'Ready', revisionReason })`
   - `MissionService.markMissionReady(missionId)`
   - `MissionExecutionService.startMission({ missionId })`
   - `MissionExecutionService.startTask({ missionId, taskId })`
   - `MissionExecutionService.completeTask({ missionId, taskId })`
   - `MissionService.reviewMission(missionId)` (the Mission-lifecycle transition method on `MissionService` — distinct from, and NOT to be confused with, the Review domain / `ReviewService`, which this sprint does not touch)
   - `MissionExecutionService.completeMission({ missionId })`
3. Presents deterministic progress markers (mirroring Sprint 24's `Dispatch Progress: started/completed` pattern, e.g. `Mission Workflow Progress: started/completed`) and the final Mission status, MissionPlan revision, and Task status via the Output Channel and a completion/error notification.
4. Appends `{missionId, objective, finalStatus}` to the session-only in-memory list on completion (success or failure), and exposes it via a lightweight read (e.g. a second command `nexus.showMissionWorkflowHistory` presenting the list through the Output Channel) — or, if simpler, folds the presentation into the same Output Channel session log. Builder MAY choose either shape provided the Critical Boundary above is respected.
5. Applies Workspace Trust the same way Sprint 24 applies it to Adapter dispatch: refuse deterministically, before any Kernel call, when the workspace is untrusted (Mission workflow execution is exactly the kind of platform action RFC-0009 § Security Responsibilities gates).

If a Kernel call fails (a legitimate domain rejection, e.g. an invalid transition), the workflow SHALL stop at that step, present the Kernel's own error deterministically, and record the Mission in the session-only list with its actual last-known status — it SHALL NOT retry, skip, or paper over the rejection.

## Explicitly Out of Scope / Deferred Concepts

- **Evidence, Shared Reality, Review (domain), Knowledge:** not exercised — the workflow stops at `MissionExecutionService.completeMission`. Sprint 16 already certifies these compose correctly; wiring them to the Host is separate future work.
- **Multiple Tasks per Mission, Task dependencies, Task Graph authoring:** this sprint supports exactly one Task. Multi-task workflows are deferred.
- **Mission editing / revision after creation**, beyond the fixed single-task planning sequence above.
- **Persistent (cross-session) Mission history**, `vscode.Memento`/`globalState`/`workspaceState`, or any durable Host-side storage of Mission data.
- **Live AI providers, Adapter dispatch, Adapter Selection Policy, multiple Adapter dispatch** — this sprint does not touch the Adapter domain at all.
- **Workflow automation, background execution, retry policies, scheduling** — the workflow runs exactly once, synchronously, only when the user explicitly invokes the command.
- **New Kernel domains, aggregates, business rules, states, or events.**
- **`COPILOT_INSTRUCTIONS.md`.**

## Acceptance Criteria

Sprint 25 SHALL demonstrate:

- The workflow command, invoked interactively, prompts for `objective`/Task `title`/`description`, then deterministically executes the eleven-call sequence above via public Kernel service contracts only, ending with a `Completed` Mission — verified by a unit test using fake `MissionService`/`MissionPlanningService`/`MissionExecutionService` doubles or the real in-memory-backed services (Builder's choice), and by an integration test composing the real Kernel via `createKernelServices` (mirroring `test/integration/host-ingress-foundation.integration.test.ts`'s pattern) and asserting the final Mission/Task status matches Sprint 16's proven outcome.
- Prompt cancellation at any step aborts deterministically with a Host diagnostic and makes zero Kernel calls.
- A Kernel-rejected step (e.g. an invalid transition induced in a test) stops the workflow deterministically, presents the Kernel's error, and does not retry or continue.
- Workspace Trust is checked before the first Kernel call in the sequence, refusing deterministically when untrusted, with zero Kernel calls made — mirroring Sprint 24's `dispatchCount === 0` proof pattern.
- The session-only history list contains no more than `{missionId, objective, finalStatus}` per entry and is never written to `vscode.Memento`/`globalState`/`workspaceState` (`grep -rn "globalState\|workspaceState\|Memento" src/hosts/` returns nothing new).
- No `src/kernel`, `src/adapters/`, `src/kernel/mission/`, `src/kernel/planning/`, or `src/kernel/execution/` file changes (`git diff --stat HEAD -- src/kernel/ src/adapters/` empty) — this sprint is additive within `src/hosts/vscode/` only.
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

## Builder Responsibilities

- Read, in order: `IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md` § Milestone 4 / Sprint 25, `IMPLEMENTATION_MANIFEST.md` § Milestone 4 / Sprint 25, `knowledge/specifications/rfc-0009-host-contract.md`, `knowledge/specifications/rfc-0001-mission-model.md`, `knowledge/specifications/rfc-0004-execution-model.md`, `knowledge/specifications/rfc-0010-kernel-boundaries.md`, the Sprint 16, 23, and 24 records, `test/integration/kernel-mission-workflow.integration.test.ts` as the authoritative reference sequence, `src/hosts/vscode/host.contract.ts`, `host-ingress.ts`, `host-command-registration.ts`, `vscode-host.ts` as the pattern to mirror, `knowledge/implementation/implementation-technology-standard.md`, `knowledge/implementation/implementation-conventions.md`.
- Implement only the concepts listed under Authorized Vertical Slice above, in the exact call order specified.
- Do not deviate from the eleven-call sequence; do not add, omit, or reorder Mission/Planning/Execution operations.
- Respect both Critical Boundary rules precisely: no Mission business logic in the Host; session history is a non-durable, minimal-field, in-memory list only.
- Preserve Sprint 23/24's existing Adapter-domain code, commands, and tests unmodified — this sprint is purely additive and orthogonal to them.
- Report any additional undocumented concept, terminology gap, or specification conflict rather than guessing; stop and request ratification if one is found.
- Produce the Sprint 25 section of `IMPLEMENTATION_REPORT.md` upon completion.
- Populate the Builder Results / Test Summary sections of this record upon completion.

## Documentation Requirements

The Builder SHALL update:

- `IMPLEMENTATION_PLAN.md`
- `IMPLEMENTATION_MANIFEST.md`
- `IMPLEMENTATION_REPORT.md`
- This Sprint Implementation Record (Builder Results / Test Summary sections)

The Builder SHALL NOT modify:

- Kernel Canon
- Any RFC
- `REVIEW_HISTORY.md`
- `RATIFICATION_LEDGER.md`
- Any Sprint 19–24 source file or test

## Known Limitations (anticipated)

- Single-Task Missions only; no dependency graph authoring.
- No cross-session Mission history; history is lost on extension deactivation.
- No Evidence, Review, or Knowledge capture — the workflow validates only the Mission/Planning/Execution portion of the Sprint 16 golden path.
- No AI/Adapter involvement of any kind; this is a purely deterministic, human-triggered Mission lifecycle exercise.

## Expected Outcome

Upon successful completion, a user inside the VS Code extension will be able to interactively create, plan, and execute a single-Task Mission end-to-end through one command, observe deterministic progress and results, and see a session-only summary of missions run — using only already-certified Kernel behavior, with the Host contributing no new business logic. This establishes the Mission domain's Host entry point as a sibling to the Adapter domain's (Sprint 23/24), both following the same thin-orchestration pattern.

## Builder Results

Implemented Sprint 25 Developer Workflow Foundation as an RFC-0009 Host-layer Mission workflow vertical slice.

Implemented scope:

- Added `HostMissionWorkflow` to sequence the exact authorized eleven public Kernel operations through `MissionService`, `MissionPlanningService`, and `MissionExecutionService`.
- Added `nexus.runDeveloperMissionWorkflow` for interactive Mission objective and single Task title/description input.
- Added `nexus.showMissionWorkflowHistory` to present the session-only in-memory list of `{missionId, objective, finalStatus}`.
- Added Workspace Trust refusal before the first Kernel call and deterministic cancellation handling before Kernel calls.
- Added deterministic progress/result/error presentation, including final Mission status, MissionPlan revision, and Task status.
- Added Kernel rejection handling that stops without retrying or continuing and records the Mission with its last-known status when a Mission was created.
- Wired the VS Code composition root to the existing public Kernel service contracts only.

Preserved deferred scope:

- No Evidence, Shared Reality, Review-domain, Knowledge capture, multiple Tasks, Task dependencies, Mission editing, persistent Mission history, live AI provider, Adapter dispatch, Adapter Selection Policy, workflow automation, retry policy, new Kernel concept, new aggregate, new business rule, new state, or new event was introduced.
- No `src/kernel` or `src/adapters` source file was modified.
- No `vscode.Memento`, `globalState`, `workspaceState`, or durable Host-side Mission storage was introduced.

No architectural deviations.

## Test Summary

- Targeted Sprint 25 validation passed: 3 files / 7 tests.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 48 files / 253 tests.
- `git diff --stat -- src/kernel src/adapters` is empty.
- `rg "globalState|workspaceState|Memento" src\hosts` returns no matches.

## Reviewer Notes

**Status**

PASS

## Review Summary

See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-13-026` for the complete review record.

`git diff --stat HEAD -- src/kernel/ src/adapters/` confirmed zero changes, and a file-by-file check confirmed no Sprint 19–24 file was modified. The eleven-call sequence was verified line-by-line against the authorized order and independently re-confirmed by a call-order assertion test. Two independent tests composing the real `createKernelServices` Kernel both assert the resulting Domain Event sequence is a strict, correctly-ordered subset of Sprint 16's certified golden path. Workspace Trust is checked before any Kernel call (proven by a zero-calls test), and Kernel rejection is proven to stop without retry while recording the true last-known Mission status. Both Critical Boundary rules (no Mission business logic in the Host; non-durable, minimal-field session history) are honored, independently re-verified by code inspection and `grep`. Independent re-validation confirmed `npm run validate` passes cleanly: TypeScript compile, ESLint, Vitest 48 files / 253 tests, esbuild build — matching the Builder's reported figures exactly.

## Findings

None.

## Required Actions

None. Sprint 25's review cycle is complete with no open findings.

## Final Disposition

**Approved.** No architectural violations detected. The Mission domain now has a certified Host entry point, structurally parallel to and independent of the Adapter-domain entry point (Sprint 23/24). All declared Deferred Concepts remain correctly unimplemented.

Date: 2026-07-13

Reviewer: Reviewer AI (Claude Code)

Review Reference: `NEXUS-REV-2026-07-13-026`
