# SPRINT-0004 — Mission Execution

## Status

Implemented — Pending Reviewer Validation

## Ratification Note

This retroactive sprint specification was authorized by Sprint Owner decision on 2026-07-12.

The Sprint Owner ratified Sprint 4 as a vertical slice implementing RFC-0001 (Mission Model — Partial). Sprint 4 does NOT implement RFC-0004, which remains the owning specification for Execution Strategy, Execution Roles, Execution Policies, Provider Coordination, and future Task execution failure states.

## Sprint Objective

Implement deterministic Mission execution within the Mission domain.

Sprint 4 enables an approved MissionPlan to progress through Mission and Task execution state changes while preserving Mission invariants and deterministic completion evaluation.

Execution remains provider-agnostic and deterministic. The slice does not invoke AI providers, schedule work, perform parallel execution, or implement RFC-0004 Execution Strategy concepts.

## RFC Coverage

Primary RFC:

- RFC-0001 — Mission Model (Partial)

Boundary RFC:

- RFC-0004 — Execution Model is not implemented in Sprint 4.

Implemented Concepts:

- Mission execution use cases.
- Mission execution lifecycle validation.
- Task execution lifecycle without failure states.
- Task dependency execution validation.
- Mission completion evaluation.
- MissionExecutionService orchestration.
- In-memory persistence of Mission and Task execution state.
- Mission lifecycle event publication for MissionStarted, MissionCompleted, MissionCancelled, and MissionFailed.

Deferred Concepts:

- Execution Strategy.
- Execution Roles.
- Execution Policies.
- Provider Coordination.
- Task execution failure states.
- Builder.
- Reviewer.
- Governance.
- Provider Adapters.
- AI Providers.
- Claude CLI.
- GitHub Copilot.
- Gemini.
- Codex.
- Event Bus expansion.
- Domain Event expansion.
- Shared Reality.
- Evidence.
- Knowledge.
- Scheduling.
- Parallel Execution.
- Critical Path Analysis.
- Automatic Planning.
- Mission Planning changes.
- Mission pause and resume pending RFC amendment candidate review.

Deferred concepts remain normative.

Implementation is tracked through IMPLEMENTATION_MANIFEST.md.

## Deliverables

- Mission aggregate completion evaluation for MissionPlan Task snapshots.
- Task aggregate execution operations for start, complete, and cancel.
- MissionPlan aggregate execution validation for executable plans and prerequisite completion before Task start.
- MissionExecutionService for repository loading, aggregate coordination, persistence, and Mission lifecycle event publication.
- InMemoryMissionRepository snapshot persistence for Mission status and Task status updates.
- Unit tests for Mission, Task, MissionPlan, MissionExecutionService, MissionService completion restoration, and repository persistence.
- Implementation-layer documentation updates for Sprint 4 progress, ratification, deferred concepts, limitations, and deviations.

## Acceptance Criteria

- Mission, MissionPlan, and Task aggregates own execution validation for this slice.
- MissionExecutionService coordinates repository loading, aggregate calls, persistence, and Mission lifecycle event publication only.
- Execution remains deterministic and provider-agnostic.
- Unit tests cover aggregate execution, invalid transitions, dependency violations, completion rejection, service orchestration, Mission lifecycle event publication, and repository persistence.
- Mission completion succeeds only when lifecycle permits completion and every MissionPlan Task is Completed.
- Task execution failure states remain deferred to RFC-0004.
- No RFC-0004 Execution Strategy, Execution Roles, Execution Policies, or Provider Coordination concepts are implemented.

## Architectural Boundaries

- Mission owns Mission lifecycle, Mission execution state, and Mission completion rules.
- MissionPlan owns planning state, Task Graph ownership, and dependency validation.
- Task owns Task lifecycle and Task transition validation.
- MissionExecutionService owns application orchestration only: loading aggregates, invoking aggregate methods, persisting changes, and publishing Mission lifecycle events.
- Business rules remain inside Mission, MissionPlan, and Task.
- Repositories persist state and do not own business rules.
- Infrastructure does not own execution logic.

## Out of Scope

- RFC-0004 Execution Strategy.
- RFC-0004 Execution Roles.
- RFC-0004 Execution Policies.
- RFC-0004 Provider Coordination.
- Task execution failure states.
- Builder.
- Reviewer.
- Governance.
- Provider Adapters.
- AI Providers.
- Event Bus expansion.
- Task-level event emission.
- Shared Reality.
- Evidence.
- Knowledge.
- Scheduling.
- Parallel Execution.
- Critical Path Analysis.
- Automatic Planning.
- Mission pause and resume.

## Completion Requirements

- Requested vertical slice is implemented without introducing future-sprint concepts.
- Implemented concepts conform to RFC-0001.
- Deferred concepts remain recorded in IMPLEMENTATION_MANIFEST.md.
- Unit tests cover aggregate behavior, state transitions, invariants, contracts, value objects, service orchestration, and repository persistence.
- IMPLEMENTATION_PLAN.md, IMPLEMENTATION_MANIFEST.md, and IMPLEMENTATION_REPORT.md are synchronized with implementation state.
- `npm run validate` passes.

