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

---

## Sprint 8 — Execution Roles

Status: ✅ Approved (NEXUS-REV-2026-07-12-017, NEXUS-REV-2026-07-12-018)

Objective

Implement the Execution Roles domain.

RFC Coverage

- RFC-0004 — Execution Model (Partial)

Implemented Concepts

- ExecutionRole
- RoleAssignment
- RoleRegistry
- RoleMetadata
- RoleValidation
- RoleService

Deferred Concepts

- Execution Strategy
- Assignment dependency-ordering preservation (RFC-0004 § Assignment)
- Provider Mapping
- Adapter Invocation
- Review Engine
- Governance
- Scheduling
- Parallel Execution

Definition of Done

- ExecutionRole and RoleAssignment remain immutable and provider agnostic.
- Builder and Reviewer are registered as default Kernel roles.
- RoleRegistry enforces uniqueness and deterministic discovery.
- RoleService coordinates registry and assignment dependencies only.
- In-memory repositories support registered roles and role assignments.
- Unit tests cover role invariants, default roles, registry behavior, assignment validation, service orchestration, and repository persistence.

---

## Sprint 9 — Review Foundation

Status: ✅ Approved (NEXUS-REV-2026-07-12-019, NEXUS-REV-2026-07-12-020)

Objective

Implement the Review Foundation vertical slice by introducing the Review domain defined by RFC-0006 (Engineering Assessment Model), using the "Review" canonical vocabulary ratified by NEXUS-RAT-2026-07-12-006.

RFC Coverage

- RFC-0006 — Engineering Assessment Model (Partial)

Ratification

- NEXUS-RAT-2026-07-12-006 — canonical "Review" vocabulary for RFC-0006 (Review, ReviewStatus, ReviewOutcome, FindingCategory, FindingStatus) and an unrelated RFC-0005 citation correction. RFC-0006 and RFC-0005 are unmodified.

Authorized Concepts

- Review
- ReviewId
- ReviewStatus
- ReviewOutcome
- ReviewCriteria
- Finding
- Severity
- FindingCategory
- FindingStatus
- ReviewService
- InMemoryReviewRepository

Deferred Concepts

- AI review execution and Adapter invocation
- Event Bus integration
- Multi-Assessment-Session Reviews
- Actionable Finding to Mission Plan revision wiring
- Human Authority operations
- Execution Session consumption
- Shared Reality Projection consumption as an Assessment input
- Produced Artifacts consumption as an Assessment input
- Assessment Outcome reasoning-chain capture (RFC-0006 § Explainability)
- Produced Artifacts becoming Knowledge
- Workflow automation

Definition of Done

- Review aggregate and Finding entity own their invariants; ReviewService coordinates only.
- ReviewStatus and ReviewOutcome remain distinct; ReviewOutcome assignable only when ReviewStatus is Completed.
- Findings reference supporting Evidence and declare FindingCategory when actionable.
- No Adapter, AI provider, Event Bus, or Mission Plan mutation is introduced.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.
- Unit tests cover aggregate behavior, lifecycle transitions, value object validation, repository behavior, and service orchestration.

See `knowledge/implementation/sprints/sprint-0009-review-foundation.md` for the complete Sprint Implementation Record.

---

## Sprint 10 — Execution Strategy

Status: ✅ Approved (NEXUS-REV-2026-07-13-001, NEXUS-REV-2026-07-13-002)

Objective

Implement the Execution Strategy vertical slice defined by RFC-0004 (Execution Model): deterministic coordination of Task execution ordering and dependency handling, closing the Sprint 8 Manifest's declared deferred concept "Assignment dependency-ordering preservation (RFC-0004 § Assignment)."

RFC Coverage

- RFC-0004 — Execution Model (Partial)

Ratification

- NEXUS-RAT-2026-07-12-007 — corrects `domain-schema.md`'s Execution Domain description so Assignment (the approved Sprint 8 `RoleAssignment` model) remains independently owned; Execution Strategy coordinates and references it rather than exclusively owning it. RFC-0004 is unmodified; Sprint 8 is not reopened.

Authorized Concepts

- ExecutionStrategy
- ExecutionStrategyId
- Advisory/evaluative dependency-ordering readiness query for RoleAssignment via `ExecutionStrategyService.evaluateAssignmentReadiness`; not an enforced precondition on `RoleService.assignRole`.
- ExecutionStrategyService
- InMemoryExecutionStrategyRepository

Deferred Concepts

- Execution State (full RFC-0004 state set)
- Execution Session
- Review requirements enforcement
- Adapter invocation and AI Providers
- Actual parallel/concurrent execution runtime
- Governance
- Assignment Policy beyond dependency ordering
- Human Authority operations
- Event Bus integration

Definition of Done

- ExecutionStrategy remains deterministic, provider-agnostic, and adapter-agnostic.
- ExecutionStrategy and ExecutionStrategyService do not mutate Mission, MissionPlan, Task, or RoleAssignment aggregates; all cross-domain interaction occurs through existing published repository contracts.
- Sprint 8's approved RoleAssignment model is not modified or restructured.
- Dependency-ordering evaluation correctly reads Task Graph dependencies from the MissionPlan, including transitive dependencies.
- No Execution State enum, Execution Session, Adapter invocation, AI provider integration, or Event Bus publication is introduced.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.
- Unit tests cover aggregate behavior, dependency-ordering evaluation, service orchestration, and repository behavior.

See `knowledge/implementation/sprints/sprint-0010-execution-strategy.md` for the complete Sprint Implementation Record.

---

## Sprint 11 — Domain Event Publication (Evidence, Review)

Status: ✅ Approved (NEXUS-REV-2026-07-13-003; remediated per NEXUS-RAT-2026-07-13-002 and confirmed by NEXUS-REV-2026-07-13-004; documentation findings closed by NEXUS-REV-2026-07-13-005)

Objective

Extend Kernel-owned Domain Event publication (established for Mission in Sprint 2) to the Evidence and Review domains, using the RFC-0005 Standard Event Envelope and the event names already cataloged in `kernel-event-catalog.md`. Execution Strategy is not in scope: no cataloged event category assigns it a producible event this slice (see the Sprint 11 record's Scoping Note).

RFC Coverage

- RFC-0005 — Domain Event Model (Partial)

Ratification

- NEXUS-RAT-2026-07-13-001 — authorizes an optional `missionId` field on Evidence's `RegisterEvidenceRequest`/`EvidenceSnapshot` (additive extension to the approved Sprint 5 model), resolving the RFC-0005 `EvidenceCaptured` envelope attribution gap. RFC-0002 and RFC-0005 are unmodified.

Authorized Concepts

- EvidenceService/ReviewService optional EventBusContract injection (Mission pattern)
- Evidence and Review aggregate recorded-events + pullDomainEvents()
- Optional `missionId` on Evidence (NEXUS-RAT-2026-07-13-001)
- EvidenceCaptured
- ReviewStarted, ReviewCompleted, ReviewAccepted, ReviewRejected, FindingCreated

Deferred Concepts

- Execution Strategy event publication
- EvidenceAccepted, EvidenceRejected (Producer: Review Service, no operation exists)
- FindingAccepted, FindingDismissed (Producer: Developer, no command pathway exists)
- FindingResolved (Producer: Execution Strategy, no trigger exists)
- Mission Plan Events and Task Events (Task Lifecycle naming mismatch unresolved)
- Knowledge, Shared Reality, Context Package, and Policy Events
- Event consumers beyond producers
- Durable Event Streams

Definition of Done

- EvidenceService and ReviewService accept an optional constructor-injected EventBusContract, matching MissionService's pattern.
- Evidence and Review aggregates record Domain Events internally; services pull and publish.
- Published events conform to the RFC-0005 Standard Event Envelope and use only the cataloged names for the producer roles actually implemented.
- ExecutionStrategyService publishes no events and is not modified.
- No Mission Plan or Task events are introduced.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.
- Unit tests cover event recording, pullDomainEvents(), and service-level publication including outcome-conditional Review event selection.

See `knowledge/implementation/sprints/sprint-0011-domain-event-publication.md` for the complete Sprint Implementation Record.

---

## Sprint 12 — Knowledge Foundation

Status: ✅ Approved (NEXUS-REV-2026-07-13-006; documentation finding closed by NEXUS-REV-2026-07-13-007)

Objective

Establish the Knowledge domain foundation — RFC-0007's Engineering Memory, under the ratified `Knowledge` implementation vocabulary (NEXUS-RAT-2026-07-13-003) — as the Kernel's persistent, curated engineering understanding retained from accepted outcomes.

RFC Coverage

- RFC-0007 — Knowledge Model (Partial)
- RFC-0002 — Evidence Model (Referenced)
- RFC-0006 — Engineering Assessment Model (Referenced)
- RFC-0001 — Mission Model (Referenced)

Ratification

- NEXUS-RAT-2026-07-13-003 — ratifies `Knowledge` as the canonical implementation-layer vocabulary for RFC-0007's Engineering Memory (`Knowledge`, `KnowledgeId`, `KnowledgeStatus`, `KnowledgeScope`, `KnowledgeProvenance`, `KnowledgeAttribution`), authorizes corrections to `kernel-data-model.md` and `knowledge-service-contract.md`, and defers Knowledge event publication and the three-way event-name reconciliation to a future sprint. RFC-0007, RFC-0006, and the Kernel Canon are unmodified.

Authorized Concepts

- `Knowledge` aggregate — immutable `KnowledgeId`, `missionId`, `missionPlanRevisionId`, `summary`, `KnowledgeScope`, `KnowledgeStatus` lifecycle, `supportingEvidenceIds`, `supportingReviewId`, `approvingAuthority`, revision history.
- `KnowledgeStatus` lifecycle: `Candidate → Approved → Active → Superseded → Archived`.
- `KnowledgeProvenance` and `KnowledgeAttribution` value objects.
- Memory Capture (`KnowledgeService.captureKnowledge`) and Memory Evolution (`KnowledgeService.reviseKnowledge`), with capture preconditions and revisioning rules owned by the `Knowledge` aggregate and its value objects, not by `KnowledgeService`.
- `IKnowledgeRepository` contract and `InMemoryKnowledgeRepository`.
- `KnowledgeService` thin orchestration for capture, revision, retrieval, and enumeration through constructor injection.
- Documentation corrections authorized by NEXUS-RAT-2026-07-13-003.

Deferred Concepts

- Knowledge event publication and the three-way Knowledge/Memory event-name reconciliation (deferred to a future Knowledge Event Publication sprint)
- Event subscriptions/consumers
- Context Assembly consumption of Knowledge
- Governance / policy-driven capture criteria
- Human Authority approval workflow automation beyond recording `approvingAuthority` as data
- Adapter/AI Provider integration
- Search, indexing, durable persistence

Definition of Done

- `Knowledge` remains immutable; revisions are append-only, preserving `KnowledgeId`, attribution, provenance, and revision history.
- Knowledge capture is rejected unless: a supporting Review exists; that Review has reached a terminal accepted state; supporting Evidence exists; required Mission work has completed; required approval metadata is present.
- `KnowledgeService` remains a thin application service; business rules remain within the `Knowledge` aggregate and its value objects.
- `KnowledgeStatus` transitions match the ratified lifecycle.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.
- Unit tests cover aggregate behavior, lifecycle transitions, value objects, repository behavior, and service orchestration.

See `knowledge/implementation/sprints/sprint-0012-knowledge-foundation.md` for the complete Sprint Implementation Record.
