# Sprint 26 — Developer Workflow Adapter Integration

## Sprint Status

Approved (NEXUS-REV-2026-07-13-027)

## Sprint Objective

Connect the Developer Workflow established in Sprint 25 to the already-certified Adapter execution pipeline established in Sprint 20, so that developer-initiated Task execution is fulfilled through the existing Adapter Contract while preserving complete provider independence. This is not a new execution pipeline — Sprint 26 integrates with the pipeline Sprint 20 already normatively established and Sprint Owner Ratification `NEXUS-RAT-2026-07-13-013` requires it be reused verbatim, not redefined or extended.

Sprint 26 SHALL demonstrate that the Host Developer Workflow exercises the same execution path previously certified during Sprint 20. No production AI provider is introduced.

This sprint introduces exactly one architectural variable: **Developer Workflow → Certified Adapter Pipeline Integration.**

## Milestone

Milestone 4 — External Integration (eighth slice). Sprint 20 certified the execution pipeline (Role Assignment → Execution Strategy readiness → Adapter dispatch) at the Kernel-composition level, proven only by a test harness, never wired to a Host. Sprint 23/24 gave the Host an Adapter-domain entry point. Sprint 25 gave the Host a Mission-domain entry point, but its Task execution never invoked an Adapter. Sprint 26 closes that gap: it is the convergence point of both prior Host entry points into one working, provider-independent developer workflow.

## RFC Coverage

Primary:

- RFC-0004 — Execution Model (extending Sprint 20's certified pipeline to a real Host trigger; no new normative concept).

Referenced:

- RFC-0008 — Kernel Adapter Contract.
- RFC-0009 — Host Contract.
- RFC-0010 — Kernel Boundaries.

This sprint implements Host-layer integration only. No Role Assignment, Execution Strategy, Adapter, or Task lifecycle business rule, state, or event is modified.

## Ratification References

- `NEXUS-RAT-2026-07-13-013` — governs this sprint's entire scope: title, authorized execution sequence, Host/Kernel/Adapter Runtime responsibility split, authorized Builder scope, and scope restrictions. This record implements that ratification; where any ambiguity arises, the Ratification Ledger entry is authoritative.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected; dispatch SHALL use explicit `adapterId` or a fails-closed single-match lookup only, exactly as Sprint 20/23/24 already established.
- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md` remains deferred; this sprint is provider-independent.

## Critical Boundary (binding — from NEXUS-RAT-2026-07-13-013)

**Host SHALL:** orchestrate the Developer Workflow; invoke existing public Kernel service contracts; present execution progress and results; preserve Workspace Trust enforcement (Sprint 24's existing gate, unchanged in position — before the first Kernel call).

**Host SHALL NOT:** assign execution roles, select adapters, or determine execution success/failure. The Host calls `RoleService.assignRole`/`ExecutionStrategyService.evaluateAssignmentReadiness`/`AdapterService.dispatch` — it does not itself decide role suitability, readiness, or dispatch outcome; the Kernel and Adapter own those decisions entirely, exactly as in Sprint 20's certified test.

**Kernel remains authoritative for (unchanged):** Mission execution, Role Assignment, Execution Strategy, Adapter dispatch authorization, Task lifecycle, Domain Events.

**Adapter Runtime remains unchanged:** `MockAdapter` continues to serve as the only execution implementation. No production provider behavior is introduced.

## Authorized Execution Path (binding — the only execution path this sprint may exercise)

```text
Developer Workflow
        ↓
MissionExecutionService.startTask()
        ↓
RoleService.assignRole()
        ↓
ExecutionStrategyService.evaluateAssignmentReadiness()
        ↓
AdapterService.dispatch()
        ↓
MockAdapter
        ↓
AdapterResponse
        ↓
MissionExecutionService.completeTask()
```

This sequence reuses the exact pipeline `test/integration/execution-pipeline-integration.integration.test.ts` (Sprint 20) already proves legal. Duplicate execution paths SHALL NOT be introduced — this is the only Task-execution path in the Developer Workflow.

## Execution Semantics (binding)

1. `MissionExecutionService.startTask({ missionId, taskId })` — unchanged from Sprint 25.
2. `RoleService.assignRole({ taskId, roleId })` — default `roleId: 'builder'` (Sprint 8's default registered Kernel role); the Builder MAY make this interactively overridable using the existing `HostInputSurface` pattern, provided the default remains `'builder'` when not overridden.
3. `ExecutionStrategyService.evaluateAssignmentReadiness({ executionStrategyId, missionPlanId, taskId })` — requires an `ExecutionStrategy` to exist for the Mission; the workflow SHALL create one via `ExecutionStrategyService.createExecutionStrategy({ id, missionId })` before this step (mirroring Sprint 20's harness setup), using a deterministically generated identifier consistent with Sprint 25's existing identity-generation pattern.
4. `AdapterService.dispatch({ adapterId, requiredCapability, request })`, where `request` is an `AdapterRequest` built from the readiness result and assigned Role — `engineeringRole` from the Role's name, `taskId`, and a deterministic `contextPackageReference` — mirroring Sprint 20's test construction. Dispatch SHALL use explicit `adapterId` or the existing fails-closed single-match lookup only (`NEXUS-RAT-2026-07-13-011`); no selection policy.
5. **If the Adapter response status is `Completed`:** call `MissionExecutionService.completeTask({ missionId, taskId })`, then present the Mission/Task result exactly as Sprint 25 already does.
6. **If the Adapter response status is not `Completed`:** stop deterministically, present the Adapter's diagnostics via the existing Host presentation surface, and do **not** call `completeTask`. There is no Kernel Task-failure operation (Sprint 4 still defers "Task execution failure states"); the workflow SHALL NOT fabricate one — the Task remains at whatever state `startTask` left it (`InProgress`), and the session history entry records the Mission's actual last-known status, exactly mirroring Sprint 25's existing Kernel-rejection handling pattern.

Task completion or failure SHALL NOT be fabricated at any step.

## Authorized Vertical Slice

- Extend `HostMissionWorkflow` (Sprint 25, `src/hosts/vscode/host-mission-workflow.ts`) to insert the Role Assignment → Execution Strategy readiness → Adapter dispatch steps between `startTask` and `completeTask`, per the Authorized Execution Path and Execution Semantics above. This is the one architectural variable this ratification authorizes as an extension to Sprint 25's Approved Vertical Slice.
- Register `MockAdapter` at the same Host composition root already used for Sprint 23/24 (`createVscodeHost`'s `adapters` option), so the Developer Workflow and the existing Adapter Ingress commands share one registered Adapter set.
- Extend the session-only history entry shape (still in-memory, non-durable, minimal fields per Sprint 25's Critical Boundary) to additionally record the Adapter dispatch outcome (e.g., `adapterId` and dispatch `status`) alongside the existing `{missionId, objective, finalStatus}`.
- Present Adapter diagnostics and dispatch progress through the existing `HostPresentationSurface` (Sprint 24), consistent with the presentation style already used by `HostIngressLayer.dispatchAdapterRequest`.

## Explicitly Out of Scope / Deferred Concepts

**Provider Integration:** GitHub Copilot CLI, Claude CLI, Gemini CLI, Codex CLI, any live AI provider.

**Adapter Selection:** routing policy, provider preference, capability scoring, fallback routing, load balancing, multi-adapter execution (`NEXUS-RAT-2026-07-13-011`, unaffected).

**Workflow:** background execution, workflow automation, retry policies, streaming execution, streaming Adapter responses, partial results, cancellation, progress callbacks beyond Sprint 24's existing `withProgress` start/completion markers.

**Runtime:** persistent execution history, Knowledge integration, Shared Reality visualization, Mission browser, execution dashboards.

**Unchanged baselines:** `AdapterLifecycle`, `AdapterRegistry`, `AdapterMetadata`, `MockAdapter`, `LocalProcessRuntime`, and every Sprint 8/10/19/20/23/24/25 approved capability beyond the authorized Developer Workflow extension itself. Existing Sprint 20 execution-pipeline tests SHALL continue to pass unmodified.

**`COPILOT_INSTRUCTIONS.md`:** SHALL NOT be activated or consumed.

## Acceptance Criteria

Sprint 26 SHALL demonstrate:

- The Developer Workflow exercises the exact Authorized Execution Path above, in order, with no duplicate or alternate execution orchestration.
- Host remains orchestration-only: it assigns no role, selects no adapter, and determines no execution outcome itself — verified by code inspection confirming all such decisions flow through `RoleService`/`ExecutionStrategyService`/`AdapterService`.
- On a `Completed` Adapter response, the Task is completed and results presented, verified by a test asserting the full call sequence and final state.
- On a non-`Completed` Adapter response, the workflow stops deterministically without calling `completeTask`, presents diagnostics, and records the true last-known status — verified by a dedicated test, mirroring Sprint 25's Kernel-rejection test pattern.
- Existing Sprint 20 execution-pipeline tests pass unmodified (`test/integration/execution-pipeline-integration.integration.test.ts` untouched).
- Existing Sprint 25 unit/integration tests for the parts of the workflow this sprint does not change (input collection, cancellation, Workspace Trust gating before any Kernel call) continue to pass, extended only where the new steps require additional assertions.
- No `src/kernel`, `src/adapters/mock/`, or `src/adapters/runtime/` file changes (`git diff --stat HEAD -- src/kernel/ src/adapters/` empty).
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

## Builder Responsibilities

- Read, in order: `IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md` § Milestone 4 / Sprint 26, `IMPLEMENTATION_MANIFEST.md` § Milestone 4 / Sprint 26, `knowledge/governance/RATIFICATION_LEDGER.md` § `NEXUS-RAT-2026-07-13-013` (authoritative for this sprint's scope), `knowledge/specifications/rfc-0004-execution-model.md`, `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`, `knowledge/specifications/rfc-0009-host-contract.md`, `knowledge/specifications/rfc-0010-kernel-boundaries.md`, the Sprint 20, 23, 24, and 25 records, `test/integration/execution-pipeline-integration.integration.test.ts` as the authoritative reference pipeline, `src/hosts/vscode/host-mission-workflow.ts` as the file to extend, `knowledge/implementation/implementation-technology-standard.md`, `knowledge/implementation/implementation-conventions.md`.
- Implement only the concepts listed under Authorized Vertical Slice above, following the Authorized Execution Path and Execution Semantics exactly.
- Do not modify `test/integration/execution-pipeline-integration.integration.test.ts` or any other Sprint 20 file; reuse the pipeline, do not redefine it.
- Preserve every Deferred/Out-of-Scope item without approximation.
- Report any additional undocumented concept, terminology gap, or specification conflict rather than guessing; stop and request ratification if one is found.
- Produce the Sprint 26 section of `IMPLEMENTATION_REPORT.md` upon completion.
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

## Known Limitations (anticipated)

- Only `MockAdapter` participates; no production provider Adapter exists yet.
- Role is fixed to `'builder'` by default; no role-selection UI beyond an optional interactive override.
- No retry, cancellation, or streaming; a single dispatch attempt per Task.
- Session history remains in-memory and non-durable, per Sprint 25's unchanged Critical Boundary.

## Expected Outcome

Upon successful completion, Nexus provides the following provider-independent execution flow, exactly as specified in `NEXUS-RAT-2026-07-13-013`:

```text
Developer
        ↓
Developer Workflow
        ↓
Host Runtime
        ↓
Kernel
        ↓
Execution Strategy
        ↓
Adapter Runtime
        ↓
MockAdapter
        ↓
Execution Result
```

The only remaining architectural substitution for a subsequent sprint SHALL be `MockAdapter → Live Provider Adapter`. No Host, Kernel, or execution architecture change should be required beyond that substitution.

## Builder Results

Implemented the Sprint 26 Developer Workflow Adapter Integration slice.

- Extended `HostMissionWorkflow` to insert the authorized Role Assignment, Execution Strategy readiness, Role retrieval, and Adapter dispatch sequence after `MissionExecutionService.startTask()` and before `MissionExecutionService.completeTask()`.
- Created a deterministic Execution Strategy identifier through the existing Sprint 25 identity-generation pattern and invoked `ExecutionStrategyService.createExecutionStrategy()` before readiness evaluation.
- Built the `AdapterRequest` from the readiness result and retrieved Kernel Role, using the Role name as `engineeringRole`, the ready Task identity, deterministic context package reference, and request metadata for Mission, MissionPlan, Execution Strategy, and Role identity.
- Dispatched through an explicitly injected `mock-adapter` ID and `CodeModification` capability; no Adapter Selection Policy, routing, scoring, fallback, or provider preference was introduced.
- On `Completed` Adapter response, completed the Task and then completed the Mission through the existing Sprint 25 sequence.
- On non-`Completed` Adapter response, stopped deterministically, presented Adapter diagnostics, recorded the actual last-known Mission status, and did not call `completeTask` or fabricate Task failure state.
- Extended session-only in-memory history with Adapter ID and dispatch status while preserving Sprint 25's non-durable Host boundary.
- Wired VS Code Host composition to provide `RoleService`, `ExecutionStrategyService`, `AdapterService`, explicit `mock-adapter`, and required `CodeModification` capability. The extension activation continues to register `MockAdapter` through the existing composition path.
- No `src/kernel`, `src/adapters/mock`, or `src/adapters/runtime` source files were modified.

## Test Summary

- Targeted Sprint 26 validation passed: 4 files, 11 tests.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 48 files, 254 tests.
- Sprint 20 execution pipeline test remained unmodified and passed.
- `git diff --stat -- src\kernel src\adapters` is empty.
- Built-in search for `globalState|workspaceState|Memento` under `src\hosts` returned no matches.

## Reviewer Notes

Independent re-validation confirms the Builder's reported results exactly: `tsc --noEmit`, ESLint, `npm run build` (esbuild), and Vitest (48 files / 254 tests) all pass. `git diff --stat -- src/kernel src/adapters` is confirmed empty — no Kernel or Adapter source file was touched. `host-mission-workflow.ts` was read line-by-line: the inserted sequence (`ExecutionStrategyService.createExecutionStrategy` → `RoleService.assignRole` → `ExecutionStrategyService.evaluateAssignmentReadiness` → `RoleService.retrieveRole` → `AdapterService.dispatch`) sits exactly between `startTask` and `completeTask`, matching the Authorized Execution Path in `NEXUS-RAT-2026-07-13-013` verbatim, with no duplicate or alternate orchestration. The Host makes no role, readiness, or dispatch-outcome decision itself — every such call is a pass-through to `RoleService`/`ExecutionStrategyService`/`AdapterService`, confirmed by inspecting `role.service.ts`, `execution-strategy.service.ts`, and `adapter.service.ts`; the Host only branches on `adapterSnapshot.status`, which is the Adapter's own determination, not one made by Host code. Dispatch uses the explicit `adapterId` supplied by Host composition (`vscode-host.ts`: `options.missionWorkflowAdapterId ?? 'mock-adapter'`), consistent with `NEXUS-RAT-2026-07-13-011`; no selection/routing/scoring logic was introduced. The non-`Completed` path (`failAdapterResponse`) presents diagnostics, records the true last-known Mission status, and does not call `completeTask` or fabricate Task failure state, verified by a dedicated unit test. Sprint 20's `execution-pipeline-integration.integration.test.ts` is untouched (absent from `git diff --stat`) and passes unmodified. `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, `IMPLEMENTATION_REPORT.md`, and this record are mutually consistent and accurately scoped.

## Findings

None.

## Required Actions

None. No Category 1 Implementation Defects, Category 2 Architectural Violations, Category 3 Specification Conflicts, or Category 5 Governance Decisions were identified.

## Final Disposition

PASS. No architectural violations detected. Sprint 26 is Approved (`NEXUS-REV-2026-07-13-027`).
