# Sprint 20 — Execution Pipeline Integration

## Sprint Status

Approved (NEXUS-REV-2026-07-13-020)

## Sprint Objective

Validate the complete Nexus execution pipeline by integrating the existing Execution Strategy (Sprint 10), Execution Roles / Role Assignment (Sprint 8), Adapter Registry (Sprint 7), and Mock Adapter (Sprint 19) into a single deterministic execution flow:

```text
Task
    ↓
Execution Strategy (readiness evaluation)
    ↓
Role Assignment (assigned Role)
    ↓
Adapter Registry (Adapter lookup)
    ↓
Mock Adapter (execution)
    ↓
Adapter Response
    ↓
Execution Result
```

This sprint certifies that the architecture implemented across Sprints 8, 10, and 19 composes correctly into a unified execution pipeline. It introduces **no new architectural concepts** and **no production AI provider integration**. After Sprint 20, the architecture SHOULD be capable of replacing the Mock Adapter with a production Adapter in a future sprint without requiring Kernel changes.

## Milestone

Milestone 4 — External Integration (second slice). Milestone 3 certified the internal Kernel; Sprint 19 certified the Adapter runtime; Sprint 20 certifies the Execution Pipeline.

## RFC Coverage

Primary:

- RFC-0004 — Execution Model

Referenced:

- RFC-0008 — Kernel Adapter Contract
- RFC-0010 — Kernel Boundaries

## Ratification References

- `NEXUS-RAT-2026-07-13-011` — ratifies the Critical Guardrail below as binding: Sprint 20 authorizes Adapter **dispatch** only, never Adapter **selection**. No routing, prioritization, capability-scoring, or provider-preference policy is authorized under this sprint.

Sprint 20's remaining scope was otherwise approved directly by Sprint Owner decision during `/nexus-plan` (2026-07-13); no other governance ambiguity required a Sprint Owner Ratification.

## Architectural Responsibilities

**Execution Strategy owns:** execution planning, execution orchestration, role resolution for the pipeline it coordinates. Execution Strategy SHALL remain provider-independent.

**Execution Roles / Role Assignment own:** engineering responsibility and execution intent (unchanged from Sprint 8). Roles SHALL remain stable regardless of Adapter implementation.

**Adapter Registry owns:** Adapter discovery (unchanged from Sprint 7/19). The Registry SHALL remain implementation-independent.

**Mock Adapter owns:** deterministic execution, request handling, response generation (unchanged from Sprint 19). It SHALL remain stateless.

**Kernel owns:** orchestration, lifecycle, attribution, diagnostics. The Kernel SHALL remain the only owner of execution coordination.

## Critical Guardrail — Adapter Selection Policy Remains Deferred (Ratified: NEXUS-RAT-2026-07-13-011)

Sprint 7, Sprint 8, and Sprint 10 each explicitly deferred "Adapter selection," "Provider selection," and "Provider Mapping" as unresolved, undefined concepts. Per `NEXUS-RAT-2026-07-13-011`, this is now binding repository law, not merely planning guidance: **Sprint 20 authorizes Adapter dispatch only, never Adapter selection.** The Kernel SHALL NOT introduce routing, prioritization, capability scoring, provider preference, or any other Adapter-selection policy. Execution Strategy SHALL invoke an Adapter only through one of:

- an explicitly supplied `adapterId` (mirroring Sprint 19's own dispatch pattern), or
- a fails-closed lookup that succeeds only when exactly one registered Adapter satisfies the request — if zero or multiple Adapters match, execution SHALL fail with a deterministic diagnostic, never a silent "pick one" heuristic.

No automatic selection algorithm is authorized. Adapter Selection remains a future architectural capability, to be introduced only under a dedicated vertical slice and appropriate RFC authority — never by implementation assumption inside this sprint. If completing any authorized task would require inventing a real selection/routing business rule beyond the above, implementation SHALL stop at that point and the gap SHALL be reported per `IMPLEMENTATION_CONSTITUTION.md` § Stop Conditions. This guardrail exists because Sprint 17 previously introduced an unauthorized business rule under similar ambiguity (`NEXUS-REV-2026-07-13-015-F-001`); Sprint 20 SHALL NOT repeat that failure mode.

## Authorized Scope

The Builder MAY:

- Add integration test(s) under `test/integration/` exercising the full pipeline (Task → readiness evaluation → Role Assignment → Adapter Registry lookup → Mock Adapter dispatch → response handling) through existing public service contracts: `RoleService`, `ExecutionStrategyService`, `AdapterService`, composed via `createKernelServices`.
- Add **at most one** narrow, thin, additive coordination method (not a new aggregate, not a new business rule, not a new RFC-0004 state) if — and only if — pure test-level composition of the existing `RoleService`/`ExecutionStrategyService`/`AdapterService` public methods cannot express the pipeline. Any such method SHALL:
  - live in `ExecutionStrategyService` (the domain the Sprint Owner's scope draft names as owning "execution orchestration" and "role resolution");
  - only compose existing repository/service calls already used by `evaluateAssignmentReadiness` and `AdapterService.dispatch`;
  - respect the Critical Guardrail above;
  - not become an enforced precondition on any other existing operation (mirroring Sprint 10's Note that `ExecutionStrategy` remains advisory/evaluative and does not gate `MissionExecutionService`, which remains the sole Task execution entry point).
- Add deterministic diagnostics reusing existing error types where they already exist (`ExecutionStrategyNotFoundError`, `ExecutionStrategyReferenceError`, `RoleAssignmentNotFoundError`, `AdapterNotFoundError`, `UnsupportedAdapterCapabilityError`) for: no Adapter available, unsupported capability, missing Role Assignment, and deterministic execution failure (the Mock Adapter's own `Failed` response, unchanged from Sprint 19).
- Update documentation per Documentation Requirements below.

## Explicitly Out of Scope

The Builder SHALL NOT implement:

- GitHub Copilot Adapter, Claude Adapter, Gemini Adapter, Codex Adapter, or any production provider integration
- CLI execution, process spawning, authentication, network communication, MCP integration
- Streaming responses, retry policies, timeout handling, telemetry, metrics, observability
- Event consumers, VS Code Host integration, Context Package expansion, Shared Reality enhancements, Knowledge enhancements
- A general Adapter-selection/routing/prioritization algorithm (see Critical Guardrail)
- Any new Execution State, Execution Session, RoleAssignment business rule, or MissionPlan/Task lifecycle change
- `COPILOT_INSTRUCTIONS.md` (remains deferred per `NEXUS-RAT-2026-07-13-010` until the first production provider integration sprint)

## Implemented Concepts (Authorized Tasks)

- **TASK-001 — Pipeline Orchestration.** Integrate the complete execution pipeline using existing Kernel services. Acceptance: end-to-end orchestration succeeds; deterministic execution; tested.
- **TASK-002 — Execution Strategy Integration.** Exercise the existing `ExecutionStrategyService.evaluateAssignmentReadiness`, extended only as narrowly as the Critical Guardrail permits to resolve the assigned Role and delegate toward Adapter dispatch. Acceptance: strategy exercised; deterministic routing; tested.
- **TASK-003 — Role Assignment Integration.** Validate execution using the existing, unmodified Role Assignment model (Sprint 8). No new execution roles. Acceptance: roles correctly resolved; assignments preserved; tested.
- **TASK-004 — Adapter Dispatch.** Exercise Adapter dispatch through the existing `AdapterRegistry`/`AdapterService`, using the existing Mock Adapter (Sprint 19). Acceptance: adapter located; dispatch succeeds; response returned; integration tested.
- **TASK-005 — Execution Result.** Validate execution result handling for successful responses, deterministic failures, diagnostics, and attribution, using the existing `AdapterResponse` contract unmodified. Acceptance: execution result validated; attribution preserved; tested.
- **TASK-006 — Pipeline Diagnostics.** Deterministic diagnostics for: no Adapter available, unsupported capability, missing Role Assignment, execution failure — reusing existing error types. Acceptance: deterministic diagnostics; integration tested.
- **TASK-007 — Integration Validation.** Integration tests covering the complete pipeline: successful execution, deterministic failure, registry lookup, role resolution, dispatch, response processing. Acceptance: comprehensive integration coverage; `npm run validate` passes.
- **TASK-008 — Documentation.** Update `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, `IMPLEMENTATION_REPORT.md`, and this Sprint Implementation Record with implemented capabilities, RFC coverage, architectural decisions, deferred concepts, validation summary, and integration test summary.

## Deferred Concepts

- Production Providers: GitHub Copilot CLI, Claude CLI, Gemini CLI, Codex CLI
- Runtime Infrastructure: process execution, authentication, CLI lifecycle, retry policies, streaming, timeout handling, network communication, telemetry, metrics, observability
- Host Integration: VS Code Extension Host, commands, workspace services, UI integration
- Builder Runtime: `COPILOT_INSTRUCTIONS.md`, production Builder Adapter, live provider execution (remain deferred until the first production provider integration sprint, per `NEXUS-RAT-2026-07-13-010`)
- Adapter Selection Policy / routing / prioritization (see Critical Guardrail — remains deferred, not resolved by this sprint)
- Execution State (full RFC-0004 minimum state set), Execution Session, Review-gated execution progression (deferred since Sprint 4/10, unaffected by this sprint)

## Acceptance Criteria

Sprint 20 SHALL demonstrate:

- complete execution pipeline integration through public service contracts only;
- deterministic Role resolution;
- deterministic Adapter dispatch (using an explicit `adapterId` or a fails-closed single-match lookup, per the Critical Guardrail — never an invented selection heuristic);
- deterministic execution results, with successful and failed Mock Adapter responses both correctly processed;
- preservation of Kernel orchestration ownership;
- preservation of RFC-0010 architectural boundaries (the existing Sprint 18 `src/kernel` import-graph boundary test SHALL continue to pass unmodified);
- no new Execution State, Execution Session, or RoleAssignment business rule;
- `ExecutionStrategy` remains advisory/evaluative and does not become a precondition gating `MissionExecutionService`'s existing Task execution entry point;
- repository-wide validation passes (`npm run validate`);
- comprehensive unit and integration tests.

## Builder Responsibilities

- Read, in order: `IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md` § Milestone 4 / Sprint 20, `IMPLEMENTATION_MANIFEST.md` § Milestone 4 / Sprint 20, `knowledge/canon/nexus-kernel-canon.md`, `knowledge/specifications/rfc-0004-execution-model.md`, `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`, `knowledge/specifications/rfc-0010-kernel-boundaries.md`, the Sprint 10 and Sprint 19 records and existing source (`src/kernel/execution/`, `src/kernel/adapter/`, `src/adapters/mock/`), `knowledge/implementation/implementation-technology-standard.md`, `knowledge/implementation/implementation-conventions.md`.
- Implement only the concepts listed under Authorized Scope / Implemented Concepts (TASK-001 through TASK-008) above.
- Preserve every Deferred Concept without approximation, especially Adapter Selection Policy per the Critical Guardrail.
- Do not modify any other domain's aggregate business rules or lifecycle transitions outside the narrow, single coordination method (if any) authorized above.
- Report any additional undocumented concept, terminology gap, or specification conflict rather than guessing; stop and request ratification if one is found.
- Produce the Sprint 20 section of `IMPLEMENTATION_REPORT.md` upon completion.
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

- The pipeline executes only against the deterministic, in-process Mock Adapter; it does not certify real production-provider latency, failure modes, or network behavior.
- Adapter Registry/dispatch remain in-memory and process-local, consistent with every domain since Sprint 1.
- Adapter Selection Policy remains unresolved beyond the explicit/fails-closed patterns described above; a general routing algorithm remains future work.

## Expected Outcome

Upon successful completion, the Nexus Kernel will have a fully certified execution pipeline: Execution Strategy correctly resolves Role Assignments and reaches Adapter dispatch through existing, unmodified contracts, using the Mock Adapter deterministically. This establishes the final architectural prerequisite before introducing the first production Builder Adapter — a future sprint would replace only the Adapter implementation (Mock Adapter → a production Adapter) while leaving the certified Kernel execution pipeline unchanged.

## Builder Results

Implemented the Sprint 20 Execution Pipeline Integration slice.

- Added `test/integration/execution-pipeline-integration.integration.test.ts`.
- Certified the complete Task → Execution Strategy readiness evaluation → Role Assignment → Adapter Registry lookup → explicit Mock Adapter dispatch → Adapter Response → Execution Result flow through existing public service contracts composed by `createKernelServices`.
- Resolved assigned Roles through the existing `RoleService` and preserved the Sprint 8 Role Assignment model unchanged.
- Exercised Adapter dispatch through the existing `AdapterService` using explicit `adapterId` lookup only, preserving `NEXUS-RAT-2026-07-13-011`; no Adapter selection, routing, prioritization, capability scoring, provider preference, or fallback policy was introduced.
- Validated successful Mock Adapter execution, deterministic Mock Adapter failure, attribution metadata, missing Role Assignment diagnostics, missing Adapter diagnostics, and unsupported capability diagnostics.
- Added no new `ExecutionStrategyService` coordination method because public-service composition was sufficient to express the authorized pipeline.

No production provider integration, process execution, network communication, authentication, streaming, retry/timeout handling, telemetry, VS Code Host integration, new Execution State, Execution Session, RoleAssignment business rule, MissionPlan/Task lifecycle change, aggregate, repository, or Domain Event was introduced.

## Test Summary

Validation passed.

- Targeted Sprint 20 validation passed: 1 file, 3 tests.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 38 files, 220 tests.

## Reviewer Notes

**Status**

PASS

## Review Summary

See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-13-020` for the complete review record.

`git diff --stat HEAD -- src/kernel/` confirmed `adapter-registry.ts`, `adapter.service.ts`, and `create-kernel-services.ts` are unchanged from the state already approved in Sprint 19 (`NEXUS-REV-2026-07-13-019`), and `src/kernel/execution/` shows zero diff — the Builder determined pure test-level composition of `RoleService`, `ExecutionStrategyService.evaluateAssignmentReadiness`, and `AdapterService.dispatch` was sufficient, and correctly added no new coordination method rather than introducing one unnecessarily. Every `AdapterService.dispatch` call in the new test supplies an explicit `adapterId`, directly verifying compliance with the Critical Guardrail (`NEXUS-RAT-2026-07-13-011`) — no Adapter-selection, routing, or capability-scoring logic exists anywhere in the diff. The three tests cover the nominal pipeline plus two independent deterministic-failure classes, all using pre-existing error types and the pre-existing `AdapterRequest.requestMetadata` field. Independent re-validation confirmed `npm run validate` passes cleanly: TypeScript compile, ESLint, Vitest 38 files / 220 tests, esbuild build — matching the Builder's reported figures exactly.

## Findings

None.

## Required Actions

None. Sprint 20's review cycle is complete with no open findings.

## Final Disposition

**Approved.** No architectural violations detected. The complete execution pipeline (Task → Execution Strategy readiness → Role Assignment → Adapter Registry → Mock Adapter dispatch → Execution Result) is certified entirely through pre-existing, approved public service contracts, with zero net-new `src/kernel` changes this sprint. The Critical Guardrail against Adapter Selection Policy (`NEXUS-RAT-2026-07-13-011`) is fully honored. All declared Deferred Concepts remain correctly unimplemented. Milestone 4 progression is not blocked.

Date: 2026-07-13

Reviewer: Reviewer AI (Claude Code)

Review Reference: `NEXUS-REV-2026-07-13-020`
