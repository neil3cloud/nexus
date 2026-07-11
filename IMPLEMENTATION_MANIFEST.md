# Nexus Implementation Manifest

## Purpose

This manifest records implementation progress for Nexus vertical slices. Normative behavior remains governed by the Kernel Canon and RFC specification suite.

---

# Milestone 1 — Kernel Foundation

## Sprint 1 — VS Code Extension Foundation

Status: Completed

RFC Coverage:

- RFC-0009 — Host Contract (Partial)
- RFC-0005 — Domain Event Model (Partial)

Implemented Concepts:

- VS Code extension activation
- Host bootstrap
- Kernel service lifecycle
- Kernel-owned in-memory EventBus infrastructure
- DomainEvent envelope contract

Deferred Concepts:

- Durable persistence
- Mission aggregate
- Mission repository
- Mission execution
- Adapter implementations
- UI beyond bootstrap command

---

## Sprint 2 — Mission Foundation

Status: Implemented — Pending Reviewer Validation

Primary RFC:

- RFC-0001 — Mission Model

Implemented Concepts:

- Mission
- Mission Identity
- Mission Objective
- Mission Lifecycle
- Mission Repository
- Mission Service
- Mission Domain Events
- Mission Domain Exceptions

Deferred Concepts:

- Mission Plan
- Mission Revision
- Task
- Task Graph

---

## Sprint 3 — Mission Planning Review Remediation

Status: Implemented — NEXUS-REV-2026-07-12-004 Complete, Pending Reviewer Validation

Source Review:

- NEXUS-REV-2026-07-12-003
- NEXUS-REV-2026-07-12-004

RFC Coverage:

- RFC-0001 — Mission Model

Implemented Concepts:

- MissionPlan aggregate with immutable `MissionPlanId`, owning `MissionId`, planning metadata, Task collection, current revision number, and revision history.
- PlanRevision immutable snapshot preserving revision metadata and Task state for each planning change.
- Task domain model with immutable `TaskId`, title, description, `TaskStatus`, parent MissionPlan, dependency collection, and metadata.
- TaskDependency value object with self-dependency detection and duplicate prevention through Task validation.
- MissionPlanningService for create MissionPlan, add Task, update Task, remove Task, and revise MissionPlan operations.
- Repository additions through `IMissionPlanRepository` and `InMemoryMissionRepository` snapshot persistence for MissionPlans, Tasks, and Revisions.
- Kernel registration of MissionService with the Kernel-owned EventBus and a shared `InMemoryMissionRepository`.
- Kernel registration of MissionPlanningService with the same shared `InMemoryMissionRepository`.

Completed Remediation Tasks:

- TASK-001 — Enforced RFC-0001 Invariant 4 by rejecting a second MissionPlan for the same Mission with `MissionAlreadyPlannedError`.
- TASK-002 — Made `MissionPlan.updateTask` validate title, status transition, dependency existence, self-dependency, and duplicate dependencies before mutating Task state or recording a revision.
- TASK-003 — Rejected MissionPlanningService create and mutation operations for terminal Missions with `MissionPlanningTerminalMissionError`.
- NEXUS-REV-2026-07-12-004 TASK-001 — Restored factory-based Kernel service registration so MissionService receives the Kernel-owned EventBus and MissionPlanningService is reachable from the running Kernel.
- NEXUS-REV-2026-07-12-004 TASK-002 — Rejected same-status update validation on terminal Tasks as part of the authorized acyclicity remediation.
- NEXUS-REV-2026-07-12-004 TASK-003 — Implemented Option A cycle validation inside MissionPlan for direct and transitive dependency cycles.

Blocked Tasks:

- None for NEXUS-REV-2026-07-12-004; the human operator selected Option A for Task Graph acyclicity in `builder-task.md`.

Deferred Concepts:

- Execution Strategy
- Planning Domain Events
- Task Scheduling
- Parallel Execution
- Critical Path Analysis
- Automatic Planning
- AI-generated Plans

Notes:

- Planning operations remain event-silent for this slice.
- No active/inactive plan, plan archival, or plan replacement concept was introduced.
- Cycle detection is validation only; no scheduling, execution ordering, topological sorting, or critical path analysis was introduced.


Implementation Dependencies:

- Existing RFC-0005-aligned `DomainEvent` envelope.
- Existing Kernel `EventBusContract` for publishing Mission domain events.

Notes:

- The Mission Foundation slice defines the RFC-0001 Mission event catalog but implements behavior only for Mission lifecycle concepts in scope.
- Mission Plan, Mission Revision, Task, and Task Graph remain deferred and are not approximated by placeholder implementation.

---

## Sprint 2 — Review Remediation

Status: Implemented — TASK-004 Blocked Pending Human Ratification

Source Review:

- NEXUS-REV-2026-07-12-002

RFC Coverage:

- RFC-0001 — Mission Model
- RFC-0005 — Domain Event Model (causality and correlation semantics)

Completed Tasks:

- TASK-001 — Removed duplicate `MissionService.create(objective)` method; `createMission(request)` remains the Mission Service creation operation.
- TASK-002 — Added Mission lifecycle event causality chaining from the immediately preceding Mission event ID, persisted through `MissionSnapshot`, and optional lifecycle operation correlation IDs.
- TASK-003 — Documented the non-atomic MissionService save/publish limitation in `IMPLEMENTATION_REPORT.md`.

Blocked Tasks:

- TASK-004 — Mission reference documentation reconciliation remains blocked until explicit human ratification.

Deferred Concepts:

- Mission Plan
- Mission Revision
- Task
- Task Graph