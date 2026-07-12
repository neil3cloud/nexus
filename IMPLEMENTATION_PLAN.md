# Nexus Implementation Plan

## Purpose

This document defines the implementation roadmap for Nexus.

Normative behavior is defined by the Kernel Canon and RFCs.

This document defines **how** the specifications are implemented through incremental vertical slices.

RFCs SHALL NOT dictate sprint boundaries.

Each sprint SHALL deliver a working, testable increment while preserving conformance with the published specifications.

---

# Milestone 1 — Foundation

## Sprint 1 — VS Code Extension Foundation

Status: ✅ Completed

Deliverables

- Extension activation
- Dependency Injection
- Host bootstrap
- Configuration
- Logging
- Testing foundation

RFC Coverage

- RFC-0009 (Partial)

---

## Sprint 2 — Mission Foundation

Status: Implemented — Review Remediation Complete, Pending Reviewer Validation

Objective

Establish the Mission domain foundation.

RFC Coverage

Primary

- RFC-0001 Mission Model

Implemented Concepts

- Mission
- Mission Identity
- Mission Lifecycle
- Mission Repository
- Mission Service
- Mission Domain Events
- Mission Domain Exceptions

Deferred Concepts

- Mission Plan
- Mission Revision
- Task
- Task Graph

Definition of Done

- Mission aggregate, lifecycle, repository, service, events, and domain exceptions are implemented.
- All Mission tests pass.
- Lifecycle conforms to RFC-0001 for implemented Mission states and transitions.
- Deferred RFC-0001 concepts remain unimplemented.
- Reviewer approval pending.

---

## Sprint 3 — Mission Planning

Status: Implemented — Kernel Integration Remediation Complete, Pending Reviewer Validation

RFC Coverage

RFC-0001

Implemented Concepts

- Mission Plan
- Mission Revision
- Task
- Task Graph

Review Remediation

- TASK-001 — Enforced exactly one MissionPlan per Mission.
- TASK-002 — Made MissionPlan Task updates atomic for validation failures.
- TASK-003 — Rejected planning operations for terminal Missions.
- NEXUS-REV-2026-07-12-004 TASK-001 — Restored Kernel wiring for MissionService and MissionPlanningService with the Kernel-owned EventBus and one shared in-memory Mission repository.
- NEXUS-REV-2026-07-12-004 TASK-002 — Closed with Option A by rejecting same-status update requests on terminal Tasks.
- NEXUS-REV-2026-07-12-004 TASK-003 — Implemented authorized Task Graph cycle detection for direct and transitive dependency cycles.

---

## Sprint 4 — Mission Execution

Status: Implemented — Pending Reviewer Validation

RFC Coverage

- RFC-0001 Mission Model (Partial)

Ratification

- Sprint Owner ratified Sprint 4 RFC-0001 (Partial) coverage on 2026-07-12; Sprint 4 does not implement RFC-0004.

Implemented Concepts

- Mission execution use cases
- Mission execution lifecycle validation
- Task execution lifecycle
- Task dependency execution validation
- Mission completion evaluation
- MissionExecutionService
- In-memory repository persistence for Mission and Task execution state

Deferred Concepts

- Execution Strategy
- Builder
- Reviewer
- Governance
- Provider Adapters
- AI Providers
- Event Bus expansion
- Shared Reality
- Evidence
- Knowledge
- Scheduling
- Parallel Execution
- Critical Path Analysis
- Automatic Planning
- Mission pause and resume pending RFC amendment candidate review
- Task execution failure states, deferred to RFC-0004
- Execution Strategy, Execution Roles, Execution Policies, and Provider Coordination, owned by RFC-0004

Definition of Done

- Mission, MissionPlan, and Task aggregates own execution validation for this slice.
- MissionExecutionService coordinates repository loading, aggregate calls, and persistence only.
- Execution remains deterministic and provider-agnostic.
- Unit tests cover aggregate execution, invalid transitions, dependency violations, completion rejection, service orchestration, and repository persistence.

---

## Sprint 5 — Evidence Foundation

Status: ✅ Approved (NEXUS-REV-2026-07-12-009, NEXUS-REV-2026-07-12-010)

Objective

Establish the immutable Evidence domain foundation as the authoritative source of engineering facts within the Nexus Kernel.

RFC Coverage

- RFC-0002 Evidence Model (Partial)

Ratification

- NEXUS-RAT-2026-07-12-001 — Sprint Owner ratified the Sprint 5 retroactive Sprint Specification as a recoverable governance deviation with no architecture or implementation impact.

Implemented Concepts

- Evidence aggregate
- Evidence identity
- Evidence type
- Evidence source
- Evidence version
- Evidence hash
- Evidence metadata
- Evidence provenance
- Evidence registration
- Evidence validation
- Evidence repository contract
- In-memory Evidence repository
- EvidenceService orchestration
- Evidence domain exceptions

Deferred Concepts

- Shared Reality
- Context Assembly
- Projection
- Knowledge
- Review
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
- Evidence confidence policy enforcement

Definition of Done

- Evidence aggregate and value objects preserve immutability and deterministic snapshots.
- EvidenceService coordinates registration, validation, retrieval, and enumeration through the repository contract.
- InMemoryEvidenceRepository provides process-local persistence only and does not implement business rules beyond duplicate storage protection.
- Unit tests cover aggregate construction, value object validation, equality, repository behavior, service orchestration, diagnostics, and immutability.

---

## Sprint 6 — Shared Reality Foundation

Status: ✅ Approved with Findings (NEXUS-REV-2026-07-12-011)

Objective

Implement the first deterministic Shared Reality projection computed from authoritative Evidence within the scope of an active Mission.

RFC Coverage

- RFC-0003 Shared Reality Projection Model (Partial)
- RFC-0002 Evidence Model (Referenced)
- RFC-0001 Mission Model (Referenced)

Implemented Concepts

- SharedReality immutable model
- ProjectionService orchestration
- ProjectionResult immutable result
- ProjectionVersion deterministic value object
- Context aggregation by Evidence type and source
- Projection validation and deterministic diagnostics
- Mission, MissionPlan, Mission execution state, and Evidence reference projection

Deferred Concepts

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

Definition of Done

- SharedReality remains an immutable read model computed from Evidence.
- ProjectionService retrieves Mission, MissionPlan, and Evidence through injected repository contracts and does not mutate Evidence.
- ProjectionVersion is deterministically generated from projection inputs and metadata.
- ProjectionResult exposes Projection Version, Active Mission, Mission Plan, Mission Execution State, Evidence References, and Projection Metadata without mutable state.
- Unit tests cover model immutability, deterministic projection, deterministic versioning, validation failures, diagnostics, and repository retrieval.

Governance Ratification

- NEXUS-RAT-2026-07-12-004 — Sprint Owner ratified the Sprint 6 concurrent-Sprint-Specification governance deviation and established the mandatory Sprint 7+ specification-first workflow.

---

## Sprint 7 — Adapter Framework

Status: ✅ Approved with Findings (NEXUS-REV-2026-07-12-015)

Objective

Establish the Kernel Adapter Framework contracts that allow the Kernel to delegate engineering responsibilities to external systems while remaining provider-agnostic.

RFC Coverage

- RFC-0008 Kernel Adapter Contract (Partial)

Implemented Concepts

- Adapter contract
- Adapter identity, name, version, protocol version, metadata, and lifecycle value objects
- AdapterCapability technical capability declaration
- AdapterRequest immutable execution request
- AdapterResponse immutable execution outcome
- AdapterRegistry contract and in-memory implementation
- AdapterService orchestration for registry lookup, protocol validation, capability validation, and request dispatch
- Deterministic adapter diagnostics

Deferred Concepts

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

Definition of Done

- Adapter Framework remains provider-agnostic.
- AdapterService coordinates registry lookup and dispatch only.
- Adapter value objects, metadata, request, response, lifecycle, registry, service, and diagnostics are unit tested.
- Deferred provider and execution concepts remain unimplemented.
