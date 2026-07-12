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

## Sprint 4 — Mission Execution

Status: Implemented — Pending Reviewer Validation

RFC Coverage:

- RFC-0001 — Mission Model (Partial)

Ratification:

- Sprint Owner ratified Sprint 4 RFC-0001 (Partial) coverage on 2026-07-12; Sprint 4 does not implement RFC-0004.

Implemented Concepts:

- Mission aggregate execution validation for start, complete, fail, and cancel lifecycle operations.
- Mission completion evaluation requiring lifecycle permission and all MissionPlan Tasks to be `Completed`.
- Task execution lifecycle operations: start, complete, and cancel.
- Task terminal-state immutability for `Completed` and `Cancelled`.
- MissionPlan execution validation for executable plans and satisfied Task dependencies before Task start.
- MissionExecutionService application orchestration for Mission and Task execution using constructor-injected repository contracts.
- InMemoryMissionRepository snapshot persistence for Mission lifecycle status and Task execution status updates.
- Deterministic diagnostics for invalid lifecycle transitions, dependency violations, non-executable Missions, and rejected completion.
- Unit tests for Mission, MissionPlan, Task, MissionExecutionService, and repository execution behavior.

Deferred Concepts:

- Execution Strategy
- Builder
- Reviewer
- Governance
- Provider Adapters
- AI Providers
- Claude CLI
- GitHub Copilot
- Gemini
- Codex
- Event Bus expansion
- Domain Event expansion
- Shared Reality
- Evidence
- Knowledge
- Scheduling
- Parallel Execution
- Critical Path Analysis
- Automatic Planning
- Mission Planning changes
- Mission pause and resume pending RFC amendment candidate review
- Task execution failure states deferred to RFC-0004
- Execution Strategy, Execution Roles, Execution Policies, and Provider Coordination owned by RFC-0004

Notes:

- Execution remains provider-agnostic and does not invoke AI providers, adapters, schedulers, event-bus expansion, Evidence, Shared Reality, Knowledge, Builder, or Reviewer concepts.
- MissionExecutionService is intentionally thin; domain validation remains inside Mission, MissionPlan, and Task.
- Mission completion continues to respect the RFC-0001 lifecycle permission requirement; this slice does not reinterpret the known MissionPaused lifecycle inconsistency.

---

## Sprint 5 — Evidence Foundation

Status: Implemented — Pending Reviewer Validation

RFC Coverage:

- RFC-0002 — Evidence Model (Partial)

Ratification:

- NEXUS-RAT-2026-07-12-001 — Sprint Owner ratified the Sprint 5 retroactive Sprint Specification as a recoverable governance deviation with no architecture or implementation impact.

Implemented Concepts:

- Evidence aggregate with immutable identity, type, version, hash, metadata, and provenance.
- EvidenceId, EvidenceType, EvidenceSource, EvidenceVersion, and EvidenceHash value objects with validation and equality semantics.
- EvidenceMetadata and Provenance immutable domain objects.
- IEvidenceRepository contract for registration, retrieval, existence checks, and enumeration.
- InMemoryEvidenceRepository process-local snapshot persistence.
- EvidenceService application orchestration for registration, duplicate validation, retrieval, and enumeration through constructor injection.
- DuplicateEvidenceException, InvalidEvidenceException, and EvidenceNotFoundException deterministic diagnostics.
- Unit tests for Evidence aggregate behavior, value objects, repository behavior, service behavior, and diagnostics.

Deferred Concepts:

- Shared Reality
- Context Assembly
- Projection
- Knowledge
- Review
- Review Findings
- Event Bus expansion
- Domain Events
- Execution Strategy
- Execution Roles
- Provider Adapters
- AI Providers
- Indexing
- Search
- Durable persistence engines
- Evidence relationships
- Evidence conflict resolution
- Evidence authority set resolution
- Evidence Confidence classification
- Evidence confidence policy enforcement
- Evidence Lifecycle progression

Notes:

- Evidence remains a domain concept and not a storage engine, search engine, index, projection, or knowledge graph.
- Evidence registration is append-only for this slice; corrections are represented by additional Evidence instances and versions, not mutation.
- EvidenceService is intentionally thin; domain validation remains in the Evidence aggregate and value objects, while repository coordination and duplicate detection are service responsibilities.

---

## Sprint 6 — Shared Reality Foundation

Status: Approved with Findings — NEXUS-REV-2026-07-12-011; remediation verified by NEXUS-REV-2026-07-12-012

RFC Coverage:

- RFC-0003 — Shared Reality Projection Model (Partial)
- RFC-0002 — Evidence Model (Referenced)
- RFC-0001 — Mission Model (Referenced)

Implemented Concepts:

- SharedReality immutable read model for the computed engineering understanding of an active Mission.
- ProjectionService for projection orchestration through constructor-injected Mission and Evidence repository contracts.
- ProjectionResult immutable output exposing Projection Version, Active Mission, Mission Plan, Mission Execution State, Evidence References, and Projection Metadata.
- ProjectionVersion immutable value object with deterministic SHA-256 generation from stable projection inputs.
- Context aggregation by Evidence type and Evidence source.
- Projection validation for missing Mission, inactive Mission, missing MissionPlan, missing Evidence, empty Evidence sets, duplicate Evidence references, inconsistent Evidence versions, unsupported Evidence types, and internal context consistency.
- Kernel service composition updated so ProjectionService receives the shared in-memory Mission repository and Evidence repository.
- Unit tests for Shared Reality projection behavior, immutability, deterministic versioning, validation diagnostics, and repository retrieval.

Deferred Concepts:

- Context Assembly
- AI Context Packaging
- Provider Context
- Adapter Framework
- Execution Roles
- Review Engine
- Knowledge
- Governance
- Event Bus integration
- Incremental projections
- Projection caching
- Projection Scope (full scope declaration)
- Projection Freshness / stale projection invalidation
- Projection persistence
- Projection persistence optimization
- Search
- Indexing

Notes:

- Shared Reality is a disposable read model and does not own engineering truth or mutate Evidence.
- Evidence remains the authoritative source for projected engineering facts.
- ProjectionService owns orchestration only; Mission and Evidence state ownership remains with their respective domains.
- The active Evidence set for this foundation slice is the explicitly requested Evidence references, or all Evidence returned by the injected Evidence repository when no references are supplied. Evidence authority resolution remains deferred.

Review Remediation:

- TASK-001 — Recorded Projection Scope and Projection Freshness as deferred Sprint 6 concepts in the Implementation Manifest, Sprint 6 record, Implementation Plan, and Implementation Report.
- TASK-002 — Reconciled the ratified RFC-0003 contract surface by removing the duplicate `projection.contract.ts` request/service placeholders, removing the obsolete `SharedRealityService` alias, removing legacy Shared Reality placeholder interfaces, and updating placeholder consumers to use the canonical `SharedRealitySnapshot` type.

---

## Sprint 7 — Adapter Framework

Status: Implemented — Pending Reviewer Validation

RFC Coverage:

- RFC-0008 — Kernel Adapter Contract (Partial)

Implemented Concepts:

- Adapter contract defining the minimum implementation-independent adapter interface.
- Adapter domain model with immutable AdapterId, AdapterName, AdapterVersion, ProtocolVersion, AdapterMetadata, and AdapterLifecycle value objects.
- AdapterCapability technical capability declaration and validation for CodeGeneration, CodeModification, StaticAnalysis, DocumentationGeneration, and TestGeneration.
- AdapterRequest immutable execution request containing Engineering Role name, Task Identifier, Context Package Reference, Execution Constraints, and Request Metadata.
- AdapterResponse immutable execution outcome containing status, diagnostics, produced artifacts, findings, and execution metadata.
- AdapterRegistry contract and InMemoryAdapterRegistry for deterministic registration, unregistration, lookup, discovery, and duplicate validation.
- AdapterService orchestration for registry lookup, protocol compatibility validation, capability validation, and request dispatch.
- Deterministic adapter diagnostics for duplicate registration, adapter not found, unsupported capability, invalid lifecycle transition, invalid definitions, invalid requests, invalid responses, and incompatible protocol version.
- Kernel service composition updated to register AdapterService with an empty in-memory AdapterRegistry.
- Unit tests for Adapter value objects, lifecycle, request, response, registry, service dispatch, and diagnostics.

Deferred Concepts:

- AI Providers
- Copilot Adapter
- Claude Adapter
- Gemini Adapter
- Codex Adapter
- Human Adapter
- Execution Roles
- Execution Strategy
- Builder
- Reviewer
- Review Engine
- Shared Reality enhancements
- Context Assembly
- Knowledge
- Governance
- AdapterRequest applicable-policies element (pending Kernel policy concepts)
- Event Bus integration
- Provider configuration
- Retry policies
- Adapter security policies

Notes:

- Engineering Roles are represented only as Kernel-assigned role-name strings and are not enumerated or owned by the Adapter Framework.
- AdapterRequest applicable policies remain deferred because Kernel policy concepts are not implemented in this slice.
- Context Package handling is reference-only; no Context Assembly or Shared Reality expansion was introduced.
- Adapter lifecycle transitions are deterministic and local to Adapter metadata; Event Bus integration remains deferred.

---

## Sprint 8 — Execution Roles

Status: Implemented — Pending Reviewer Validation

RFC Coverage:

- RFC-0004 — Execution Model (Partial)

Implemented Concepts:

- ExecutionRole immutable domain model with RoleId, name, description, category, and RoleMetadata.
- Built-in provider-independent Kernel roles: Builder and Reviewer.
- RoleRegistry contract and InMemoryRoleRegistry for registration, retrieval, enumeration, and duplicate prevention.
- RoleAssignment immutable Task-to-ExecutionRole relationship with assignment metadata.
- RoleValidation deterministic diagnostics for unknown roles and duplicate assignments.
- RoleService orchestration for role registration, lookup, assignment, and assignment discovery through constructor-injected contracts.
- InMemoryRoleAssignmentRepository for process-local assignment persistence.

Deferred Concepts:

- Execution Strategy.
- Assignment dependency-ordering preservation (RFC-0004 § Assignment).
- Provider Mapping.
- Adapter Invocation.
- Review Engine.
- Governance.
- Scheduling.
- Parallel Execution.
- Provider selection.
- Adapter selection.
- Builder workflow.
- Reviewer workflow.
- Event Bus integration.

Notes:

- Execution Roles remain independent of providers and adapters.
- RoleAssignment references Task identity only and does not access Task aggregate internals.
- Role category is deterministic metadata text; RFC-0004 does not define a category enumeration.

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