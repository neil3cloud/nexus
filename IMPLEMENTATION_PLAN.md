# Nexus Implementation Plan

## Purpose

This document defines the implementation roadmap for Nexus.

Normative behavior is defined by the Kernel Canon and RFCs.

This document defines **how** the specifications are implemented through incremental vertical slices.

RFCs SHALL NOT dictate sprint boundaries.

Each sprint SHALL deliver a working, testable increment while preserving conformance with the published specifications.

---

# Milestone 1 — Core Mission Kernel

Status: ✅ COMPLETE

Objective

Establish the Mission domain: Mission, Mission Planning, and Mission Execution, atop the VS Code extension host bootstrap.

RFC Coverage

- RFC-0009 — Host Contract (Partial)
- RFC-0001 — Mission Model (Partial)

Governance Note

Sprint 2 (Mission Foundation), Sprint 3 (Mission Planning), and Sprint 4 (Mission Execution) predate `REVIEW_HISTORY.md`'s existence and are recorded as Historically Accepted Governance Deviations per NEXUS-RAT-2026-07-13-008 — see each sprint's status line below. This does not diminish Milestone 1's completion; it is corroborated by eleven-to-thirteen subsequent independently-reviewed sprints building on this foundation without defect.

---

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

Status: Historically Accepted Governance Deviation (NEXUS-RAT-2026-07-13-008). Implemented and remediated prior to `REVIEW_HISTORY.md`'s existence; no persisted Reviewer certification exists or is fabricated retroactively. Superseded in practice by Sprint 3/4 and eleven subsequent independently-reviewed sprints building on this foundation without defect.

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
- Historically Accepted Governance Deviation per NEXUS-RAT-2026-07-13-008; no persisted Reviewer certification exists.

---

## Sprint 3 — Mission Planning

Status: Historically Accepted Governance Deviation (NEXUS-RAT-2026-07-13-008). Remediation tasks below cite reviews (`NEXUS-REV-2026-07-12-003`/`-004`) that were never persisted to `REVIEW_HISTORY.md`; no fabricated retroactive certification is recorded. Superseded in practice by twelve subsequent independently-reviewed sprints building on this foundation without defect.

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

Status: Historically Accepted Governance Deviation (NEXUS-RAT-2026-07-13-008). Implemented prior to `REVIEW_HISTORY.md`'s existence; no persisted Reviewer certification exists or is fabricated retroactively. Superseded in practice by eleven subsequent independently-reviewed sprints building on this foundation without defect.

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

# Milestone 2 — AI Collaboration Kernel

Status: ✅ COMPLETE (Sprint 5 through Sprint 15)

Objective

Build the Nexus Kernel's remaining core domains and their event-driven collaboration surface: Evidence, Shared Reality, the Adapter Framework, Execution Roles, Review, Execution Strategy, Domain Event publication across Mission/Evidence/Review/Knowledge/MissionPlan/Task, and Knowledge (capture through lifecycle advancement).

RFC Coverage

- RFC-0002 — Evidence Model (Partial)
- RFC-0003 — Shared Reality Projection Model (Partial)
- RFC-0004 — Execution Model (Partial)
- RFC-0005 — Domain Event Model (Partial)
- RFC-0006 — Engineering Assessment Model (Partial)
- RFC-0007 — Knowledge Model (Partial)
- RFC-0008 — Kernel Adapter Contract (Partial)
- RFC-0001 — Mission Model (Partial, extended via Sprint 15's Mission Plan/Task Event Publication)

Governance Note

Every sprint in this milestone (5 through 15) carries a persisted Reviewer certification in `REVIEW_HISTORY.md`, each closed with no open findings.

See the Milestone 2 Completion Report (`knowledge/implementation/milestone-2-completion-report.md`) for the full outcome summary.

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

---

## Sprint 13 — Knowledge Event Publication

Status: ✅ Approved (NEXUS-REV-2026-07-13-008)

Objective

Extend Kernel-owned Domain Event publication (established for Mission in Sprint 2, extended to Evidence/Review in Sprint 11) to the Knowledge domain, publishing `KnowledgeCandidateCreated` and `KnowledgeRevisionCreated` per NEXUS-RAT-2026-07-13-004, following the established Foundation → Event Publication pattern.

RFC Coverage

- RFC-0005 — Domain Event Model (Partial, extending the existing Sprint 11 pattern)
- RFC-0007 — Knowledge Model (Referenced — event trigger only)

Ratification

- NEXUS-RAT-2026-07-13-004 — ratifies the Knowledge event-name reconciliation (`KnowledgeCandidateCreated` for `captureKnowledge`, `KnowledgeRevisionCreated` for `reviseKnowledge`), scopes Sprint 13 to exactly these two operations/events, defers the four lifecycle-advancement operations and events entirely, and establishes the permanent Governance Rule that Domain Events represent completed domain facts, not implementation actions. RFC-0007, RFC-0005, RFC-0006, and the Kernel Canon are unmodified.

Authorized Concepts

- `KnowledgeService` optional `EventBusContract` injection (Mission/Evidence/Review pattern)
- `Knowledge` aggregate exposing recorded Domain Events through the Kernel's established aggregate event-recording contract
- `KnowledgeCandidateCreated` (on `captureKnowledge`)
- `KnowledgeRevisionCreated` (on `reviseKnowledge`)

Deferred Concepts

- `approveKnowledge`/`activateKnowledge`/`supersedeKnowledge`/`archiveKnowledge` operations and their events (entirely out of scope, not merely event-silent)
- Event subscriptions/consumers
- Mission Plan Events, Task Events, Execution Strategy Events (unresolved Task Lifecycle naming mismatch)
- Shared Reality, Context Package, and Policy Events
- Durable Event Streams

Definition of Done

- `KnowledgeService` accepts an optional constructor-injected `EventBusContract`, matching the established pattern.
- `Knowledge` exposes recorded Domain Events through the Kernel's established aggregate event-recording contract; the service pulls and publishes rather than fabricating event objects directly.
- A Domain Event SHALL be published only after the associated state transition has been successfully persisted; if persistence fails, no Domain Event SHALL be published.
- Only `KnowledgeCandidateCreated` and `KnowledgeRevisionCreated` are published this slice.
- No lifecycle-advancement operation is introduced, even as an unpublished stub.
- No event subscription or consumer is introduced. Knowledge Domain Events SHALL remain notifications of completed state transitions; they SHALL NOT initiate, coordinate, or trigger subsequent domain behavior.
- Equivalent aggregate state transitions SHALL produce equivalent Domain Events.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.
- Unit tests cover event recording, the event-recording contract, and service-level publication for both operations.

See `knowledge/implementation/sprints/sprint-0013-knowledge-event-publication.md` for the complete Sprint Implementation Record.

---

## Sprint 14 — Knowledge Lifecycle Advancement

Status: ✅ Approved (NEXUS-REV-2026-07-13-009; documentation finding closed by NEXUS-REV-2026-07-13-010)

Objective

Extend `KnowledgeService` with the four lifecycle-advancement operations — `approveKnowledge`, `activateKnowledge`, `supersedeKnowledge`, `archiveKnowledge` — deferred by Sprint 12 and Sprint 13, publishing their already-ratified events `KnowledgeAccepted`, `KnowledgePublished`, `KnowledgeSuperseded`, and `KnowledgeArchived` per NEXUS-RAT-2026-07-13-005, following the exact save-then-publish pattern established in Sprint 13.

RFC Coverage

- RFC-0005 — Domain Event Model (Partial, extending the Sprint 11/13 pattern)
- RFC-0007 — Knowledge Model (Referenced — exercises the already-normative Memory Lifecycle states)

Ratification

- NEXUS-RAT-2026-07-13-005 — ratifies implementation of `approveKnowledge`, `activateKnowledge`, `supersedeKnowledge`, `archiveKnowledge` and their already-named events, previously deferred by NEXUS-RAT-2026-07-13-004. RFC-0007, RFC-0005, RFC-0006, and the Kernel Canon are unmodified.

Authorized Concepts

- `KnowledgeService` operations `approveKnowledge`, `activateKnowledge`, `supersedeKnowledge`, `archiveKnowledge`, each a thin orchestration calling the corresponding existing frozen `Knowledge` aggregate method.
- `KnowledgeAccepted`, `KnowledgePublished`, `KnowledgeSuperseded`, `KnowledgeArchived` event publication, save-then-publish, mirroring Sprint 13.

Deferred Concepts

- Successor-reference modeling (a "supersedes"/"supersededBy" link between Knowledge items).
- Authorization/policy enforcement for who may call the lifecycle-advancement operations.
- Event subscriptions/consumers.
- Context Assembly consumption of Knowledge.
- Mission Plan Events, Task Events, Execution Strategy Events (unresolved Task Lifecycle naming mismatch).
- Shared Reality, Context Package, and Policy Events.
- Durable Event Streams.

Definition of Done

- `KnowledgeService` gains exactly the four lifecycle-advancement operations, each matching the Sprint 13 save-then-publish pattern.
- No new business precondition, authorization check, or successor-reference field is introduced.
- Events publish only after successful persistence; illegal transitions continue to raise `InvalidKnowledgeLifecycleTransitionError` unchanged.
- No event subscription or consumer is introduced.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.
- Unit tests cover all four operations' publication, persistence-failure handling, not-found handling, illegal-transition handling, and deterministic publication.

See `knowledge/implementation/sprints/sprint-0014-knowledge-lifecycle-advancement.md` for the complete Sprint Implementation Record.

---

## Sprint 15 — Mission Plan & Task Event Publication

Status: ✅ Approved (NEXUS-REV-2026-07-13-011; TASK-001 remediation verified by NEXUS-REV-2026-07-13-012; TASK-002 remediation verified by NEXUS-REV-2026-07-13-013, authorized by NEXUS-RAT-2026-07-13-007 — review cycle complete with no open findings). No Sprint 16 exists in the Implementation Plan to advance to Current (Sprint Owner action required under the specification-first workflow).

Objective

Complete Kernel-owned Domain Event publication by extending the established save-then-publish pattern (Mission: Sprint 2; Evidence/Review: Sprint 11; Knowledge: Sprint 13/14) to the `MissionPlan` and `Task` aggregates, publishing events for previously implemented lifecycle operations only. Closes the deferred concept first recorded in Sprint 11 and carried forward, unresolved, through Sprint 13 and Sprint 14.

RFC Coverage

- RFC-0005 — Domain Event Model (Partial, extending the Sprint 11/13 pattern)
- RFC-0001 — Mission Model (Referenced — existing lifecycle operations only; Mission lifecycle semantics unchanged)

Ratification

- NEXUS-RAT-2026-07-13-006 — ratifies Sprint 3's `TaskStatus` as implementation-layer operational lifecycle vocabulary distinct from RFC-0004's normative Execution State; corrects `kernel-state-machine.md`'s Task Lifecycle to match; reattributes Mission Plan/Task Domain Event producers to `MissionPlanningService` (`MissionPlanCreated`, `MissionPlanRevised`, `TaskCreated`) and `MissionExecutionService` (`TaskStarted`, `TaskCompleted`, `TaskCancelled`); resolves a pre-existing `kernel-event-catalog.md` duplication (legacy `MissionPlanRevised`/`TaskAdded` under `# Mission Events`, and a redundant `MissionPlanSuperseded` entry); defers `MissionPlanActivated` (no implementing operation exists). RFC-0004, RFC-0005, and the Kernel Canon are unmodified.

Authorized Concepts

- `MissionPlanningService` optional `EventBusContract` injection, publishing `MissionPlanCreated`, `MissionPlanRevised`, `TaskCreated`.
- `MissionExecutionService`'s already-required `EventBusContract` (Sprint 4 baseline) extended to publish `TaskStarted`, `TaskCompleted`, `TaskCancelled` from its existing Task execution operations.
- `MissionPlan` and `Task` aggregate recorded-events collections and `pullDomainEvents()`, mirroring `Mission`'s established pattern.
- `kernel-state-machine.md` Task Lifecycle correction to the approved Sprint 3 `TaskStatus` state set.
- `kernel-event-catalog.md` producer reattribution and duplicate-entry reconciliation per NEXUS-RAT-2026-07-13-006.

Deferred Concepts

- `MissionPlanActivated` — no implemented operation exists.
- `TaskReady`, `TaskAssigned`, `TaskBlocked` — Execution Strategy/Task Coordinator producer roles unimplemented.
- Event subscriptions/consumers.
- Knowledge, Shared Reality, Context Package, and Policy Events.
- Durable/persistent Event Streams.

Definition of Done

- `MissionPlan` and `Task` remain unmodified in business rules; only recorded-events infrastructure is added.
- Events publish only after the corresponding state transition has been successfully persisted.
- No new Task state or MissionPlan status field is introduced.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.
- Unit tests cover aggregate event recording, `pullDomainEvents()`, and service-level publication for all six authorized events.

See `knowledge/implementation/sprints/sprint-0015-mission-plan-task-event-publication.md` for the complete Sprint Implementation Record.

---

# Milestone 3 — Kernel Integration & Composition

Status: ✅ COMPLETE (Sprint 16 Approved; Sprint 17 Approved; Sprint 18 Approved)

Objective

Validate that the implemented Kernel bounded contexts compose correctly into a complete engineering workflow, exercising the actual composed services rather than isolated unit tests. This milestone marks the transition from implementing independent bounded contexts to validating the complete composed Kernel. No new foundational domains are introduced during this milestone unless explicitly authorized through a future Sprint Owner Ratification.

Engineering Principle

Beginning with Milestone 3, implementation priorities SHALL shift from introducing new domains to validating composed behavior. Future implementation SHALL prioritize integration, composition, deterministic execution, architectural correctness, cross-domain validation, and production readiness — driven by demonstrated integration needs rather than speculative architectural expansion.

Planning Principle

Future Sprint sequencing within this milestone is intentionally provisional.

Following each approved Sprint, `nexus-plan` SHALL assess the repository state and determine the next implementation slice based on implementation experience, repository readiness, governance decisions, and approved ratifications.

Approved vertical slices remain immutable.

Expected Outcomes

- End-to-end Mission workflow
- Cross-domain integration
- Event flow validation
- Builder/Reviewer workflow integration
- Adapter runtime integration
- Context Package foundation
- Repository-wide integration validation

---

## Sprint 16 — End-to-End Mission Workflow Integration Validation

Status: ✅ Approved (NEXUS-REV-2026-07-13-014)

Objective

Validate that the implemented Kernel bounded contexts compose correctly into a complete engineering workflow, exercising the Kernel using the actual composed services (via `createKernelServices`) rather than isolated unit tests. This sprint validates the implementation; it does not expand the architecture.

RFC Coverage

- RFC-0001 — Mission Model (Referenced)
- RFC-0002 — Evidence Model (Referenced)
- RFC-0003 — Shared Reality Projection Model (Referenced)
- RFC-0004 — Execution Model (Referenced)
- RFC-0005 — Domain Event Model (Referenced)
- RFC-0006 — Engineering Assessment Model (Referenced)
- RFC-0007 — Knowledge Model (Referenced)

Sprint 16 validates previously implemented behavior only; it introduces no new normative concepts.

Authorized Scope

- End-to-end integration test infrastructure exercising the composed Kernel through: Create Mission → Create Mission Plan → Create Tasks → Execute Tasks → Complete Mission → Perform Review → Capture Knowledge.
- Composed-service validation, dependency-injection wiring verification, repository interaction validation, aggregate interaction validation, Domain Event ordering verification, cross-domain invariant validation.
- Correction of implementation defects discovered during integration testing, provided they remain within existing approved architecture.

Deferred Concepts

- AI provider integrations (Claude CLI, GitHub Copilot, Gemini, Codex), Adapter runtime implementations, VS Code host integration, workflow/governance automation, Context Package, Policy Engine, Durable Event Streams, event subscriptions, persistent storage, production/distributed infrastructure.

Definition of Done

- All Kernel services compose successfully; complete Mission workflow executes successfully.
- Domain Events publish in deterministic, causally-correct order.
- Aggregate boundaries remain intact; repositories coordinate correctly; dependency-injection wiring is valid.
- Cross-domain invariants are preserved; repository-wide validation passes; no architectural regressions.

See `knowledge/implementation/sprints/sprint-0016-end-to-end-mission-workflow-integration-validation.md` for the complete Sprint Implementation Record.

---

## Sprint 17 — Cross-Domain Failure-Path Integration Validation

Status: ✅ Approved (NEXUS-REV-2026-07-13-017; remediation of NEXUS-REV-2026-07-13-015-F-001 authorized by NEXUS-RAT-2026-07-13-009 and verified by NEXUS-REV-2026-07-13-016; documentation finding NEXUS-REV-2026-07-13-016-F-001 closed by NEXUS-REV-2026-07-13-017 — review cycle complete with no open findings)

Objective

Extend the Sprint 16 integration validation by exercising the composed Nexus Kernel through deterministic failure-path integration scenarios, complementing Sprint 16's validated nominal ("happy path") workflow. This sprint introduces no new architectural concepts, domain behavior, or business rules; it validates only behavior already authorized by the implemented RFCs and approved vertical slices.

RFC Coverage

- None primary — this sprint introduces no new normative concepts.
- Referenced: RFC-0001, RFC-0002, RFC-0004, RFC-0005, RFC-0006, RFC-0007.

Authorized Concepts

- Failure-path integration tests under `test/integration/`, exercising eight rejection scenarios (Task dependency violation, premature Mission completion, duplicate MissionPlan, duplicate Review registration, invalid Knowledge capture, missing Evidence, invalid Review completion, terminal Mission planning) through public Kernel service contracts only.
- Side-effect verification: no partial persistence, no unintended Domain Event publication, deterministic rejection.
- Bug fixes to existing approved behavior discovered during testing, within existing approved architecture only (mirroring Sprint 16's Authorized Builder Scope).

Deferred Concepts

- AI Providers, Adapter runtime implementations, VS Code host integration, Context Package, Policy Engine, Durable Event Streams, event subscriptions, persistent storage, production infrastructure, observability/telemetry, retry policies, distributed execution.
- Exhaustive combinatorial failure-path coverage beyond the eight authorized scenarios.

Definition of Done

- All eight authorized rejection scenarios execute through public Kernel service contracts and fail deterministically with the correct, already-cataloged error/exception.
- No partial persistence or unintended Domain Event publication occurs on any rejected operation.
- Subsequent valid operations continue to succeed after each rejection is exercised.
- No architectural regressions; no new concept, state, or event is introduced.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

See `knowledge/implementation/sprints/sprint-0017-cross-domain-failure-path-integration-validation.md` for the complete Sprint Implementation Record.

---

## Sprint 18 — RFC-0010 Kernel Boundary Certification

Status: ✅ Approved (NEXUS-REV-2026-07-13-018)

Objective

Certify that the composed Nexus Kernel conforms to the architectural boundaries defined by RFC-0010 — Kernel Boundaries: architectural ownership, bounded-context isolation, service contract integrity, dependency correctness, repository isolation, successful composition, and deterministic rejection of invalid cross-boundary interactions. This is a validation-only vertical slice; it introduces no new domain concepts, production capabilities, runtime behavior, lifecycle semantics, repositories, or aggregate responsibilities. Sprint 18 concludes the Internal Kernel Certification phase of Milestone 3, begun by Sprint 16 (nominal composition) and Sprint 17 (failure-path composition).

RFC Coverage

- RFC-0010 — Kernel Boundaries (Primary)
- Referenced: RFC-0001, RFC-0002, RFC-0003, RFC-0004, RFC-0005, RFC-0006, RFC-0007, RFC-0008 (contract validation only), RFC-0009 (boundary validation only)

Authorized Scope

- Integration Validation Scenarios demonstrating successful composed-Kernel behavior across Mission, Mission Planning, Task execution, Review, Knowledge, Domain Event publication, repository coordination, and dependency injection, exercised through `createKernelServices` and public service contracts only.
- Boundary Violation Scenarios intentionally attempting invalid cross-domain interactions (unauthorized cross-domain access, invalid service composition, invalid repository usage, invalid aggregate ownership assumptions, invalid dependency paths, bypassing public service contracts) to prove deterministic rejection with no aggregate/repository corruption, no partial persistence, and no unintended Domain Event publication.
- Documentation reconciliation arising directly from validated observations.

Deferred Concepts

- Event subscribers/consumers/handlers/orchestration
- Adapter implementations, Mock Adapter, AI provider integration
- VS Code host integration, workflow automation
- Context Package, Policy Engine, Durable Event Streams, persistent infrastructure
- Any new aggregate, repository, business rule, lifecycle transition, or Domain Event

Definition of Done

- RFC-0010 boundary rules are satisfied by every implemented bounded context.
- All cross-domain interaction occurs exclusively through approved public service contracts.
- No architectural boundary violations are detected; no unauthorized runtime dependencies exist.
- Successful execution validation and failure-path validation both pass.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

See `knowledge/implementation/sprints/sprint-0018-rfc-0010-kernel-boundary-certification.md` for the complete Sprint Implementation Record.

---

## Future Sprint Planning (Milestone 3)

Status: Milestone 2 Complete; Milestone 3 Complete (Sprint 16 Approved — NEXUS-REV-2026-07-13-014; Sprint 17 Approved — NEXUS-REV-2026-07-13-017; Sprint 18 Approved — NEXUS-REV-2026-07-13-018)

Milestone 2 completion assessed: see `knowledge/implementation/milestone-2-completion-report.md`.

Repository readiness evaluated: see `knowledge/implementation/repository-readiness-assessment.md`.

Sprint 18's review cycle is complete with no open findings, and with it, Milestone 3 — Kernel Integration & Composition is Complete. The Sprint Owner has opened Milestone 4 — External Integration; see below.

---

# Milestone 4 — External Integration

Status: ✅ COMPLETE (Sprint 19 Approved; Sprint 20 Approved; Sprint 21 Approved; Sprint 22 Approved; Sprint 23 Approved with Findings; Sprint 24 Approved; Sprint 25 Approved; Sprint 26 Approved; Sprint 27 Approved)

Objective

Transition the certified Kernel from internal composition/boundary validation (Milestone 3) to external extensibility, beginning with a deterministic Mock Adapter that proves the existing Adapter Framework (RFC-0008, Sprint 7) end-to-end, ahead of any future production provider Adapter.

Governance Note

Milestone 3's Engineering Principle constrained that milestone to validating already-implemented behavior with no new foundational domains. A concrete Adapter implementation is a new runtime capability rather than composed-behavior validation, so the Sprint Owner opened Milestone 4 to house it rather than stretching Milestone 3's validation-only scope. This is a Sprint Owner planning decision, not a Ratification — Adapter is an existing bounded context (RFC-0008, approved since Sprint 7); Milestone 4 introduces no new bounded context.

Planning Principle

Sprint sequencing within this milestone is intentionally provisional. Following each approved Sprint, `nexus-plan` SHALL assess the repository state and determine the next implementation slice based on implementation experience, repository readiness, governance decisions, and approved ratifications. Approved vertical slices remain immutable.

Expected Outcomes

- Adapter runtime integration (first concrete Adapter implementation)
- Builder/Reviewer workflow integration (future slice)
- Production provider Adapter integration (future slice, out of scope for Sprint 19)

---

## Sprint 19 — Mock Adapter Runtime Integration

Status: ✅ Approved (NEXUS-REV-2026-07-13-019)

Objective

Implement the first concrete Adapter — a deterministic Mock Adapter — conforming to the certified Adapter Contract (RFC-0008), integrated into the composed Kernel via the existing `AdapterRegistry`/`AdapterService` (Sprint 7). This sprint validates the Adapter runtime lifecycle using a deterministic, in-process implementation; it does not introduce AI providers.

RFC Coverage

- RFC-0008 — Kernel Adapter Contract (Primary)
- Referenced: RFC-0004 — Execution Model, RFC-0010 — Kernel Boundaries

Authorized Scope

- `MockAdapter` implementing the existing Adapter Contract; stateless; deterministic.
- Registration with the existing `AdapterRegistry`; discovery through the existing `AdapterService`.
- Static capability declaration using RFC-0008's existing capability vocabulary.
- Deterministic `AdapterRequest` validation/handling and immutable `AdapterResponse` generation using the existing contracts.
- Runtime dispatch through `AdapterService.dispatch` and `createKernelServices`.
- Deterministic diagnostics, reusing existing Sprint 7 diagnostics where applicable.

Deferred Concepts

- Provider integrations (GitHub Copilot CLI, Claude CLI, Gemini CLI, Codex CLI, OpenAI APIs), process execution, authentication, retry/timeout policies, streaming responses, telemetry/metrics/observability.
- Adapter lifecycle management beyond the existing value object, dynamic capability negotiation, multi-adapter routing, prioritization, load balancing, fallback adapters.
- Event subscribers/consumers, Context Package production/consumption beyond the existing reference-only field, VS Code host integration.
- Any new aggregate, repository, business rule, lifecycle transition, or Domain Event outside the Adapter domain.

Definition of Done

- Adapter registration, capability discovery, deterministic request/response handling, and runtime dispatch through Kernel services all succeed.
- RFC-0008 Adapter Contract and RFC-0010 Kernel boundaries are preserved.
- No production provider behavior is introduced.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest, esbuild.

Implementation Progress

- Implemented `MockAdapter` as a deterministic, stateless, in-process Adapter implementation.
- Added composition-time Adapter registration through `createKernelServices` while preserving the RFC-0010 Kernel dependency boundary: `src/kernel` depends only on Adapter contracts, not Adapter implementations.
- Added Adapter discovery through `AdapterService.enumerateAdapters`.
- Added unit and integration coverage for Mock Adapter metadata, deterministic responses, failure diagnostics, registry-backed discovery, and runtime dispatch.

See `knowledge/implementation/sprints/sprint-0019-mock-adapter-runtime-integration.md` for the complete Sprint Implementation Record.

---

## Sprint 20 — Execution Pipeline Integration

Status: ✅ Approved (NEXUS-REV-2026-07-13-020)

Objective

Validate the complete execution pipeline by integrating the existing Execution Strategy (Sprint 10), Execution Roles / Role Assignment (Sprint 8), Adapter Registry (Sprint 7), and Mock Adapter (Sprint 19) into a single deterministic execution flow: Task → Execution Strategy readiness evaluation → Role Assignment → Adapter Registry lookup → Mock Adapter dispatch → Adapter Response → Execution Result. No new architectural concepts and no production AI provider integration are authorized.

RFC Coverage

- RFC-0004 — Execution Model (Primary)
- Referenced: RFC-0008 — Kernel Adapter Contract, RFC-0010 — Kernel Boundaries

Authorized Scope

- Integration test(s) exercising the full pipeline through existing public service contracts (`RoleService`, `ExecutionStrategyService`, `AdapterService`) composed via `createKernelServices`.
- At most one narrow, additive coordination method in `ExecutionStrategyService`, only if pure test-level composition cannot express the pipeline — no new aggregate, business rule, or RFC-0004 state.
- Deterministic diagnostics reusing existing error types for: no Adapter available, unsupported capability, missing Role Assignment, execution failure.

Critical Guardrail (Ratified: NEXUS-RAT-2026-07-13-011)

Adapter Selection Policy (deferred since Sprint 7/8/10) SHALL NOT be resolved or approximated by a general routing/priority algorithm this sprint — dispatch SHALL use an explicit `adapterId` or a fails-closed single-match lookup only. This guardrail was elevated from planning guidance to binding repository law by `NEXUS-RAT-2026-07-13-011`, written in direct response to Sprint 17's unauthorized business rule under similar ambiguity (`NEXUS-REV-2026-07-13-015-F-001`).

Deferred Concepts

- Production provider integrations, process execution, authentication, network communication, streaming, retry/timeout policies, telemetry/metrics/observability, VS Code Host integration, `COPILOT_INSTRUCTIONS.md` (per `NEXUS-RAT-2026-07-13-010`).
- Adapter Selection Policy / routing / prioritization; full RFC-0004 Execution State set; Execution Session; Review-gated execution progression.

Definition of Done

- Complete execution pipeline integration succeeds deterministically through public service contracts only.
- RFC-0010 Kernel boundaries preserved; Sprint 18's `src/kernel` import-graph boundary test continues to pass unmodified.
- `ExecutionStrategy` remains advisory/evaluative; `MissionExecutionService` remains the sole Task execution entry point, ungated by this sprint's work.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

Implementation Progress

- Added `test/integration/execution-pipeline-integration.integration.test.ts`.
- Certified the full Task → Execution Strategy readiness evaluation → Role Assignment → Adapter Registry lookup → explicit Mock Adapter dispatch → Adapter Response flow through existing public service contracts.
- Resolved assigned Roles through the existing `RoleService` without modifying the Sprint 8 Role Assignment model.
- Exercised Adapter dispatch through explicit `adapterId` only; no Adapter selection, routing, prioritization, capability scoring, provider preference, or fallback policy was introduced.
- Validated deterministic successful execution, missing Role Assignment, missing Adapter, unsupported capability, and deterministic Mock Adapter execution failure diagnostics.
- No new coordination method was added because pure public-service composition of `RoleService`, `ExecutionStrategyService`, and `AdapterService` already expressed the authorized pipeline.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest 38 files / 220 tests, esbuild.

See `knowledge/implementation/sprints/sprint-0020-execution-pipeline-integration.md` for the complete Sprint Implementation Record.

---

## Sprint 21 — Local Process Runtime Foundation

Status: ✅ Approved (NEXUS-REV-2026-07-13-021)

Objective

Implement a provider-agnostic Local Process Runtime enabling the Adapter layer to execute local processes deterministically, without introducing any production AI provider integration. Splits "production provider Adapter integration" into two bounded steps: this sprint (generic process execution, no provider, no auth, no network) and a future sprint (a specific provider Adapter built on top of it).

RFC Coverage

- RFC-0008 — Kernel Adapter Contract (Partial)
- Referenced: RFC-0004 — Execution Model, RFC-0010 — Kernel Boundaries

Ratification References

- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md` remains deferred; this sprint is explicitly not the production-provider-integration sprint that ratification names as the activation trigger.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected.

Critical Boundary

`LocalProcessRuntime` and its supporting types are Adapter-layer infrastructure, not a Kernel capability — RFC-0010 § Execution Responsibilities forbids the Kernel from implementing "external tool execution." All new code SHALL live outside `src/kernel` (e.g., `src/adapters/runtime/`); Sprint 18's `src/kernel` import-graph boundary test SHALL continue to pass unmodified.

Critical Guardrail

`MockAdapter`'s Sprint 19-approved baseline ("never invoke external processes") is an Approved Vertical Slice and remains frozen except to correct a genuine, reported implementation defect (the Constitution's own narrow exception). `LocalProcessRuntime` integration SHALL be proven via dedicated tests or a new, separate test-only Adapter — not by redesigning or extending `MockAdapter` itself.

Authorized Scope

- `LocalProcessRuntime`, `ProcessRequest`, `ProcessResult`, `ProcessExecutionOptions`, `ProcessExitStatus`, `ProcessDiagnostics` — process launch, output capture, exit status, timeout, cancellation, deterministic diagnostics.
- Integration proof beneath the Adapter layer without modifying `MockAdapter`.

Deferred Concepts

- All production provider integrations (GitHub Copilot CLI, Claude CLI, Codex CLI, Gemini CLI, OpenAI, Azure OpenAI), authentication, credential storage, provider discovery/negotiation.
- Process orchestration: parallel execution, process pools, retries, fallback execution, scheduling, prioritization.
- Adapter Selection Policy (unaffected, per `NEXUS-RAT-2026-07-13-011`).
- CLI/response interpretation (markdown, JSON payload semantics, provider protocol validation).
- `COPILOT_INSTRUCTIONS.md`.

Definition of Done

- Deterministic local process execution with timeout and cancellation support, fully unit tested.
- Runtime placed outside `src/kernel`; Sprint 18's boundary test passes unmodified.
- `MockAdapter`'s Sprint 19-approved behavior unchanged.
- No production provider, authentication, or Kernel architectural change introduced.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

Implementation Progress

- Added `LocalProcessRuntime` under `src/adapters/runtime/`, outside `src/kernel`.
- Added `LocalProcessRuntimeContract` so Adapters consume a runtime abstraction instead of operating-system process APIs.
- Added immutable runtime value objects: `ProcessRequest`, `ProcessExecutionOptions`, `ProcessResult`, `ProcessExitStatus`, and `ProcessDiagnostics`.
- Implemented provider-agnostic process launch, stdout/stderr capture, exit status, timeout termination, cancellation termination, and deterministic diagnostics for executable-not-found, startup failure, timeout, cancellation, abnormal termination, and non-zero exit code.
- Added unit coverage for runtime value-object validation and deterministic process execution behavior.
- Added an Adapter-layer integration proof using a separate test-only Adapter; `MockAdapter` remains unchanged.
- Preserved Kernel boundaries: no `src/kernel` source change was introduced by Sprint 21.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest 41 files / 232 tests, esbuild.

See `knowledge/implementation/sprints/sprint-0021-local-process-runtime-foundation.md` for the complete Sprint Implementation Record.

---

## Sprint 22 — Adapter Runtime Operational Metadata

Status: ✅ Approved (NEXUS-REV-2026-07-13-022)

Objective

Make the certified Adapter Runtime operationally self-describing (installation detection, health status, runtime diagnostics, configuration metadata for a concrete Adapter instance) before any live production provider is introduced. This is an implementation refinement of the existing RFC-0008 Adapter architecture — no new architectural layer, no new registry.

Governance History

An earlier draft proposed a parallel "Provider" vocabulary (`ProviderMetadata`, `ProviderCapability`, `ProviderRegistry`) mis-citing "RFC-0008 — Provider Contract," and conflated `ProviderCapability` with Engineering Roles (`Builder`, `Reviewer`), directly contradicting RFC-0008's rule that Capabilities SHALL NOT redefine Engineering Roles. This was flagged and rejected during `/nexus-plan`; the Sprint Owner reframed the sprint entirely in terms of the existing Adapter vocabulary. No RFC Amendment or ADR was required since no new architectural concept survives into this record.

RFC Coverage

- RFC-0008 — Kernel Adapter Contract (Primary, Partial)
- Referenced: RFC-0004 — Execution Model, RFC-0010 — Kernel Boundaries

Ratification References

- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md`'s activation point is pushed to when the first live provider executes inside the completed Nexus host, per explicit Sprint Owner direction this sprint; not created or consumed this sprint.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected.

Critical Boundary (two rules)

1. `AdapterCapability`'s supported-value list (`src/kernel/adapter/adapter-capability.ts`) may be additively extended with new technical-capability values (e.g., CLI, Streaming, Chat, Completion) — the sole authorized Kernel change this sprint, consistent with RFC-0008's non-exhaustive capability list. `Builder`/`Reviewer` SHALL NOT appear as capability values.
2. Everything else (installation detection, health status, diagnostics, configuration) is Adapter-layer implementation tooling and SHALL live outside `src/kernel`, mirroring the Sprint 19/21 precedent. `AdapterLifecycle`, `AdapterRegistry`, and `AdapterMetadata`'s existing fields remain frozen.

Deferred Concepts

- Any `Provider`-prefixed type or second runtime registry; live provider integration; authentication; provider protocol translation; Adapter Selection Policy; Host/VS Code integration; `COPILOT_INSTRUCTIONS.md`.

Definition of Done

- Deterministic, immutable installation/health/diagnostics/configuration models exist outside `src/kernel`.
- The only Kernel change (if any) is the additive `AdapterCapability` extension; no other `src/kernel` file changes.
- No second registry; `AdapterRegistry` remains sole registry; `AdapterLifecycle` unchanged.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

Implementation Progress

- Added immutable Adapter-layer operational metadata models under `src/adapters/runtime/`: `AdapterInstallationStatus`, `AdapterHealthStatus`, `AdapterRuntimeDiagnostics`, and `AdapterConfiguration`.
- Added `AdapterExecutableDiscovery`, using `LocalProcessRuntimeContract` for short-lived executable/version probes.
- Extended `AdapterCapability` with technical capability values `CLI`, `Chat`, and `Completion`; `Builder` and `Reviewer` remain rejected as capabilities.
- Preserved `AdapterRegistry` as the sole registry and left `AdapterLifecycle`, `AdapterMetadata`, `MockAdapter`, `LocalProcessRuntime`, Execution Strategy, and Role Assignment unchanged.
- Preserved all deferred concepts: no Provider-prefixed types, second registry, live provider execution, authentication, provider protocol translation, Host integration, Adapter Selection Policy, or `COPILOT_INSTRUCTIONS.md`.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest 42 files / 236 tests, esbuild.

See `knowledge/implementation/sprints/sprint-0022-adapter-runtime-operational-metadata.md` for the complete Sprint Implementation Record.

---

## Sprint 23 — Host Ingress Foundation

Status: ✅ Approved with Findings (NEXUS-REV-2026-07-13-023)

Objective

Implement the Host Ingress Layer defined by RFC-0009: establish the first production entry point from the VS Code extension into the certified Nexus Kernel, exposing deterministic command surfaces that invoke only public Kernel service contracts. Validates the complete Host → Kernel → Adapter execution path using only previously certified, provider-independent runtime capabilities (`MockAdapter`, the Sprint 21 runtime validation Adapter). No live AI provider execution is authorized.

RFC Coverage

- RFC-0009 — Host Contract (Primary, Partial)
- Referenced: RFC-0008 — Kernel Adapter Contract, RFC-0004 — Execution Model, RFC-0010 — Kernel Boundaries

Ratification References

- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md` remains deferred until the first live provider is integrated and exercised from within the completed Host runtime; not this sprint.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected; Host dispatch SHALL use explicit `adapterId` or a fails-closed single-match lookup only.

Sprint 23's scope was approved directly by Sprint Owner decision during `/nexus-plan` (2026-07-13), refining the planner's proposal; no new governance ambiguity required a new Ratification.

Authorized Vertical Slice

- Host command registration, Host ingress routing, and Host capability declaration (RFC-0009 § Host Capabilities).
- Adapter discovery through `AdapterService.enumerateAdapters` and deterministic dispatch through `AdapterService.dispatch` (explicit `adapterId` or fails-closed single-match lookup only — no Adapter Selection Policy).
- Presentation of Sprint 22's Adapter operational metadata (installation status, health status, runtime diagnostics) via VS Code Output Channel / notifications.
- Host diagnostics for ingress-layer failures.
- Exercised only against the existing certified `MockAdapter` and the Sprint 21 runtime-validation test Adapter.

Deferred Concepts

- Any live AI provider (GitHub Copilot CLI, Claude CLI, Gemini CLI, Codex CLI, OpenAI, Azure OpenAI), authentication, provider protocol translation, prompt execution, response parsing, streaming.
- Adapter Selection Policy / routing / capability scoring / provider preference / fallback / load balancing.
- Mission UI, Review UI, Knowledge UI, workflow visualization.
- The broader Host Ingress Contract (`submitMission`, `publishHostObservation`, `submitApproval`, `queryWorkflowStatus`) — this sprint implements Adapter-facing ingress only.
- `COPILOT_INSTRUCTIONS.md`.
- Any modification to `AdapterLifecycle`, `AdapterRegistry`, `AdapterMetadata`'s existing fields, `MockAdapter`, `LocalProcessRuntime`, Execution Strategy, or Role Assignment.

Definition of Done

- Host invokes only public Kernel service contracts; no direct aggregate, repository, registry, runtime, or Adapter access from the Host.
- Deterministic Adapter discovery and dispatch (explicit `adapterId` or fails-closed single-match lookup only).
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified.
- No live provider execution; no new Kernel concept; no architectural ownership change.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

Implementation Progress

- Added Host command registration for Adapter discovery, Adapter dispatch, and Host capability declaration.
- Added Host ingress routing through `AdapterService.enumerateAdapters` and `AdapterService.dispatch` only.
- Added provider-independent Adapter operational metadata presentation and Host diagnostics.
- Added deterministic dispatch with explicit `adapterId` or fails-closed single-match lookup only.
- Added unit and integration coverage for the Host → Kernel → AdapterService → MockAdapter path.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest 45 files / 242 tests, esbuild.

See `knowledge/implementation/sprints/sprint-0023-host-ingress-foundation.md` for the complete Sprint Implementation Record.

---

## Sprint 24 — Host Runtime Completion

Status: ✅ Approved (NEXUS-REV-2026-07-13-025)

Objective

Complete the provider-independent Host runtime defined by RFC-0009, closing three gaps found by repository-state assessment in the already-approved Sprint 23 code: no interactive request input (dispatch always used a hardcoded default request), incomplete response presentation (`producedArtifacts`/`findings` silently discarded), and no Workspace Trust enforcement before dispatch (RFC-0009 § Security Responsibilities). Treated as a single architectural concern so that the first live Adapter (a future sprint) changes exactly one variable: replacing `MockAdapter` with a production Adapter implementation.

RFC Coverage

- RFC-0009 — Host Contract (Primary, Partial)
- Referenced: RFC-0008 — Kernel Adapter Contract, RFC-0004 — Execution Model, RFC-0010 — Kernel Boundaries

Ratification References

- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md` remains deferred; this sprint is provider-independent.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected; interactive input MAY collect an explicit `adapterId`/`requiredCapability` but introduces no automatic selection logic.

Sprint 24's scope was approved directly by Sprint Owner decision during `/nexus-plan` (2026-07-13), following a Sprint-Owner-directed repository-state assessment in place of naming a live provider; no new governance ambiguity required a new Ratification.

Authorized Vertical Slice

- Interactive request input (VS Code `showInputBox`/`showQuickPick` behind an injectable `HostInputSurface`) for `nexus.dispatchAdapterRequest` when invoked without a pre-built argument; the existing Sprint 23 programmatic path is unchanged.
- Structured response presentation: surface `producedArtifacts`, `findings`, and `executionMetadata` alongside existing `status`/`diagnostics`, plus a deterministic dispatch progress indicator.
- Workspace Trust enforcement (`vscode.workspace.isTrusted` behind an injectable `HostWorkspaceTrustSurface`) gating dispatch only; discovery/capability commands remain ungated.
- Exercised only against the existing certified `MockAdapter` and the Sprint 21 runtime-validation test Adapter.

Deferred Concepts

- Any live AI provider, authentication, provider protocol translation.
- Adapter Selection Policy / routing / capability scoring / provider preference / fallback / load balancing.
- Persisted VS Code Configuration surface for Adapter settings.
- Mission UI, Review UI, Knowledge UI, workflow visualization; the broader Host Ingress Contract; `COPILOT_INSTRUCTIONS.md`.
- Any modification to `AdapterLifecycle`, `AdapterRegistry`, `AdapterMetadata`, `AdapterRequest`/`AdapterResponse` shape, `MockAdapter`, `LocalProcessRuntime`, Execution Strategy, or Role Assignment.

Definition of Done

- Interactive dispatch prompts for and uses real input; cancellation aborts deterministically without dispatching; the existing programmatic path and its tests are unaffected.
- Dispatch presentation surfaces the full `AdapterResponseSnapshot` (status, diagnostics, producedArtifacts, findings, executionMetadata) plus progress.
- Dispatch is refused deterministically when the workspace is untrusted, before any Adapter/process interaction.
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified; zero `src/kernel`/`src/adapters/mock`/`src/adapters/runtime` changes.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

Implementation Progress

- Added injectable Host input and workspace-trust surfaces, backed by VS Code `showInputBox` and `workspace.isTrusted`.
- Added interactive command-palette dispatch input for engineering role, task identifier, context package reference, optional adapter identifier, and optional required capability.
- Added deterministic cancellation diagnostics with no dispatch attempt.
- Preserved Sprint 23 programmatic dispatch behavior for pre-built command arguments.
- Added full `AdapterResponseSnapshot` presentation with progress start/completion markers.
- Added unit and integration coverage for interactive input, cancellation, trust gating, full response presentation, progress, and the Host → Kernel → AdapterService → MockAdapter path.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest 45 files / 246 tests, esbuild.

See `knowledge/implementation/sprints/sprint-0024-host-runtime-completion.md` for the complete Sprint Implementation Record.

---

## Sprint 25 — Developer Workflow Foundation

Status: ✅ Approved (NEXUS-REV-2026-07-13-026)

Objective

Implement the first provider-independent Mission developer workflow inside the VS Code extension: a single Host-triggered command sequencing the already-certified Mission → MissionPlan → Task → MissionExecution golden path (the Mission/Planning/Execution portion of Sprint 16's end-to-end integration test) through existing public Kernel service contracts only. Opens a second, parallel Host entry point (Mission domain) alongside Sprint 23/24's Adapter-domain entry point, using the identical thin-orchestration pattern.

RFC Coverage

- RFC-0009 — Host Contract (Primary, Partial)
- Referenced: RFC-0001 — Mission Model, RFC-0004 — Execution Model, RFC-0010 — Kernel Boundaries

Ratification References

None required. Two scope clarifications (Host thin-orchestration boundary; non-durable session-only Mission history) were resolved during `/nexus-plan` by direct application of the already-reviewed Sprint 23/24 Adapter-domain precedent, not new governance.

Authorized Vertical Slice

- A single new Host command sequencing exactly eleven existing public Kernel operations, in the fixed order proven legal by Sprint 16's integration test: `createMission` → `createMissionPlan` → `planMission` → `addTask` → `updateTask`(Ready) → `markMissionReady` → `startMission`(execution) → `startTask` → `completeTask` → `reviewMission`(Mission-lifecycle transition) → `completeMission`(execution).
- Interactive input (reusing Sprint 24's `HostInputSurface`) for Mission `objective` and one Task's `title`/`description`; deterministic cancellation handling.
- Deterministic progress/result presentation (reusing Sprint 24's `HostPresentationSurface`/progress pattern).
- Workspace Trust enforcement before the first Kernel call (reusing Sprint 24's pattern).
- A session-only (in-memory, non-durable) list of `{missionId, objective, finalStatus}` for missions run.

Deferred Concepts

- Multiple Tasks per Mission, Task dependencies/graphs; Mission editing beyond the fixed single-task sequence.
- Evidence, Shared Reality, Review (domain), Knowledge capture — the workflow stops at Mission completion.
- Persistent/cross-session Mission history (no `vscode.Memento`/`globalState`/`workspaceState`).
- Live AI providers, Adapter dispatch, Adapter Selection Policy — this sprint does not touch the Adapter domain.
- Workflow automation, background execution, retry policies, scheduling.
- New Kernel domains, aggregates, business rules, states, or events; `COPILOT_INSTRUCTIONS.md`.

Definition of Done

- The eleven-call sequence executes deterministically end-to-end through public Kernel contracts only, matching Sprint 16's proven outcome (final Mission status `Completed`).
- Cancellation and Kernel-rejection both abort deterministically with zero further Kernel calls; Workspace Trust gates before the first Kernel call.
- No `src/kernel`, `src/adapters/` file changes; Sprint 18's boundary test passes unmodified; existing Adapter-domain behavior remains unmodified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

Implementation Progress

- Added `HostMissionWorkflow` as a Host-layer Mission workflow entry point that invokes only `MissionService`, `MissionPlanningService`, and `MissionExecutionService` public operations in the authorized eleven-call order.
- Added `nexus.runDeveloperMissionWorkflow` and `nexus.showMissionWorkflowHistory` command registration, with interactive input for Mission objective and single Task title/description.
- Added deterministic Workspace Trust refusal before Kernel calls, deterministic input cancellation before Kernel calls, Kernel rejection stop behavior, progress/result presentation, and session-only in-memory history containing only `{missionId, objective, finalStatus}`.
- Added VS Code composition-root wiring and command contributions without modifying `src/kernel` or `src/adapters`.
- Added unit and integration coverage for successful execution, cancellation, Kernel rejection, Workspace Trust gating, minimal history shape, command registration, and real `createKernelServices` composition.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest 48 files / 253 tests, esbuild.

See `knowledge/implementation/sprints/sprint-0025-developer-workflow-foundation.md` for the complete Sprint Implementation Record.

---

## Sprint 26 — Developer Workflow Adapter Integration

Status: ✅ Approved (NEXUS-REV-2026-07-13-027)

Objective

Connect the Developer Workflow established in Sprint 25 to the already-certified Adapter execution pipeline established in Sprint 20, so developer-initiated Task execution is fulfilled through the existing Adapter Contract while preserving complete provider independence. This is not a new execution pipeline — Sprint 26 integrates with the pipeline Sprint 20 already normatively established. Introduces exactly one architectural variable: Developer Workflow → Certified Adapter Pipeline Integration.

RFC Coverage

- RFC-0004 — Execution Model (Primary)
- Referenced: RFC-0008 — Kernel Adapter Contract, RFC-0009 — Host Contract, RFC-0010 — Kernel Boundaries

Ratification References

- `NEXUS-RAT-2026-07-13-013` — governs this sprint's entire scope: title, authorized execution sequence, Host/Kernel/Adapter Runtime responsibility split, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected; dispatch SHALL use explicit `adapterId` or a fails-closed single-match lookup only.
- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md` remains deferred; this sprint is provider-independent.

Authorized Execution Path (binding)

```text
Developer Workflow → MissionExecutionService.startTask() → RoleService.assignRole() →
ExecutionStrategyService.evaluateAssignmentReadiness() → AdapterService.dispatch() →
MockAdapter → AdapterResponse → MissionExecutionService.completeTask()
```

This is the only execution path this sprint may exercise, reusing Sprint 20's certified pipeline verbatim. On a non-`Completed` Adapter response, the workflow stops deterministically, presents diagnostics, and does not call `completeTask` — no Task-failure state is fabricated (none exists in the Kernel).

Authorized Vertical Slice

- Extend `HostMissionWorkflow` (Sprint 25) to insert Role Assignment → Execution Strategy readiness → Adapter dispatch between `startTask` and `completeTask`.
- Register `MockAdapter` at the Host composition root shared with Sprint 23/24.
- Extend session-only history with the Adapter dispatch outcome, preserving Sprint 25's non-durable, minimal-field constraint.

Deferred Concepts

- Live AI provider integration; Adapter Selection Policy / routing / capability scoring / provider preference / fallback / load balancing / multi-adapter execution; background execution, workflow automation, retry policies, streaming, cancellation, progress callbacks beyond existing markers; persistent execution history, Knowledge, Shared Reality visualization, Mission browser, dashboards; `COPILOT_INSTRUCTIONS.md`.

Definition of Done

- The Developer Workflow exercises the exact Authorized Execution Path, in order, with no duplicate orchestration.
- Host assigns no role, selects no adapter, and determines no execution outcome itself.
- Success and non-success Adapter outcomes are both handled deterministically without fabricating Task state.
- Existing Sprint 20 execution-pipeline tests and Sprint 25 tests for unchanged behavior pass unmodified.
- No `src/kernel`/`src/adapters` file changes; Sprint 18's boundary test passes unmodified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

Implementation Progress

- Extended `HostMissionWorkflow` to create an Execution Strategy and then invoke `RoleService.assignRole`, `ExecutionStrategyService.evaluateAssignmentReadiness`, `RoleService.retrieveRole`, and `AdapterService.dispatch` between `startTask` and `completeTask`.
- Wired the VS Code Host composition root to supply `RoleService`, `ExecutionStrategyService`, `AdapterService`, explicit `mock-adapter` dispatch, and `CodeModification` capability to the Developer Workflow.
- Registered `MockAdapter` for the Developer Workflow through the existing extension composition root; no Kernel or Adapter source changes were introduced.
- Extended session-only Mission workflow history and result presentation with Adapter ID and dispatch status while preserving in-memory-only history.
- Added deterministic non-`Completed` Adapter response handling that presents diagnostics, records the actual last-known Mission status, and does not call `completeTask`.
- Added and updated unit/integration coverage for the Sprint 26 pipeline sequence, failure stop behavior, command registration, real Kernel composition with `MockAdapter`, and unchanged Sprint 20 pipeline behavior.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest 48 files / 254 tests, esbuild.

See `knowledge/implementation/sprints/sprint-0026-developer-workflow-adapter-integration.md` for the complete Sprint Implementation Record.

---

## Sprint 27 — Developer Workflow Completion

Status: ✅ Approved (NEXUS-REV-2026-07-13-028)

Objective

Complete the provider-independent Developer Workflow by extending it, after Mission completion, through an Evidence → Review → Knowledge sequence using only previously approved, existing public Kernel service contracts. This closes the "Builder/Reviewer workflow integration" outcome Milestone 4 has listed as future scope since its opening, completing at the Host layer the same Evidence → Review → Knowledge sequence Sprint 16 already certified legal at the Kernel-composition level. Review and Knowledge integration are implementation details of completing the developer workflow, not new architectural capability.

RFC Coverage

- RFC-0009 — Host Contract (Primary)
- Referenced: RFC-0002 — Evidence Model, RFC-0006 — Engineering Assessment Model, RFC-0007 — Knowledge Model, RFC-0010 — Kernel Boundaries

Ratification References

- `NEXUS-RAT-2026-07-13-014` — governs this sprint's entire scope: title, authorized completion workflow, Host/Kernel responsibility split, the binding Knowledge-eligibility implementation clarification, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-13-013` — governs the Sprint 26 pipeline this sprint extends; unaffected and unmodified.
- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md` remains deferred; this sprint is provider-independent.

Authorized Completion Workflow (binding)

```text
Developer Workflow → MissionExecutionService.completeMission() (Sprint 25/26, unchanged) →
EvidenceService.registerEvidence() → ReviewService.startReview() → ReviewService.publishFinding() →
ReviewService.finalizeReviewOutcome() → KnowledgeService.captureKnowledge() → Host presents completion result
```

This is the only workflow extension this sprint may exercise, extending the exact sequence Sprint 16's integration test already proves legal. Knowledge eligibility SHALL NOT be encoded as Host-side conditional logic (`if (reviewAccepted) { captureKnowledge(); }`); the Host SHALL call `captureKnowledge()` unconditionally and treat a Kernel-thrown `KnowledgeCapturePreconditionError` as an ordinary Kernel-rejection stop, mirroring the Sprint 25/26 pattern.

Authorized Vertical Slice

- Extend `HostMissionWorkflow` (Sprint 25/26) to invoke the Authorized Completion Workflow immediately after the existing `completeMission()` call.
- Wire `EvidenceService`, `ReviewService`, and `KnowledgeService` into the Host composition root, mirroring the existing `resolveService` pattern.
- Extend session-only history with Review outcome and Knowledge capture status, preserving Sprint 25's non-durable, minimal-field constraint.

Deferred Concepts

- Live AI Providers, production Adapter integration, Adapter Selection, provider routing; human review intervention, review retry workflows; streaming execution, background workflow execution, workflow automation, multi-provider coordination; persistent/durable workflow/execution/review/knowledge history; Policy Engine integration, Evidence indexing, Knowledge conflict resolution; `COPILOT_INSTRUCTIONS.md`.

Definition of Done

- The Developer Workflow exercises the exact Authorized Completion Workflow, in order, with no duplicate orchestration.
- Host makes no Evidence-validity, Review-outcome-interpretation, or Knowledge-eligibility decision itself; `captureKnowledge()` is called unconditionally.
- Success and Kernel-rejection outcomes are both handled deterministically without fabricating state.
- Existing Sprint 16 integration tests and Sprint 25/26 tests for unchanged behavior pass unmodified.
- No `src/kernel`/`src/adapters` file changes; Sprint 18's boundary test passes unmodified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

See `knowledge/implementation/sprints/sprint-0027-developer-workflow-completion.md` for the complete Sprint Implementation Record.

---

## Milestone 4 Completion Summary

Status: ✅ COMPLETE (Sprint 19 Approved; Sprint 20 Approved; Sprint 21 Approved; Sprint 22 Approved; Sprint 23 Approved with Findings; Sprint 24 Approved; Sprint 25 Approved; Sprint 26 Approved; Sprint 27 Approved)

Sprint 27's review cycle is complete with no open findings, completing the provider-independent Developer Workflow ratified by `NEXUS-RAT-2026-07-13-014`. Milestone 4 — External Integration is complete.

---

# Milestone 5 — Production Adapter Integration

Status: In Progress (Sprint 28 Approved with Findings; Sprint 29 Approved — NEXUS-REV-2026-07-14-002; Sprint 30 Current)

Objective

Transition Nexus from a certified, provider-independent Kernel/Host architecture to an operational product, and — after productization is independently certified — introduce the first production AI provider Adapter.

Governance Note

Per `NEXUS-RAT-2026-07-14-001`, Milestone 5 began with a productization/host-validation slice (Sprint 28) rather than a production Adapter. Following Sprint 28's independent certification, `NEXUS-RAT-2026-07-14-002` resolved the previously open provider-selection, authentication-model, and runtime-instructions-naming ambiguities: the first production Adapter targets **Gemini CLI**, assumes a **pre-authenticated local CLI session** (Nexus never handles credentials), and activates the canonically-named `ADAPTER_RUNTIME_INSTRUCTIONS.md` (superseding `NEXUS-RAT-2026-07-13-010`'s illustrative `COPILOT_INSTRUCTIONS.md` naming; that entry remains recorded unmodified). `NEXUS-RAT-2026-07-14-003` then scoped Sprint 29 to implement `GeminiCliAdapter` in isolation, deferring Developer Workflow integration to a future Sprint. Following Sprint 29's independent certification (`NEXUS-REV-2026-07-14-002`), `nexus-plan` raised a Governance Report on how to wire `GeminiCliAdapter` into the Developer Workflow without regressing the frozen, deterministic Sprint 25–28 `MockAdapter` test baseline; `NEXUS-RAT-2026-07-14-004` resolved this by authorizing a second, dedicated Developer Workflow command for `GeminiCliAdapter`, explicitly declining to introduce a persisted Adapter-selection configuration surface this Sprint.

Planning Principle

Sprint sequencing within this milestone is intentionally provisional. Following each approved Sprint, `nexus-plan` SHALL assess the repository state and determine the next implementation slice based on implementation experience, repository readiness, governance decisions, and approved ratifications. Approved vertical slices remain immutable.

Expected Outcomes

- An installable, activatable, and operational Nexus VS Code extension, validated inside a real Extension Host (Sprint 28 — complete).
- A certified, isolated `GeminiCliAdapter` production Adapter implementation, proving the RFC-0008 Adapter Contract works with a real provider without Developer Workflow coupling (Sprint 29 — complete).
- Developer Workflow integration of `GeminiCliAdapter` via a second, dedicated command, preserving the existing `MockAdapter`-based command as the frozen deterministic baseline (Sprint 30 — current).

---

## Sprint 28 — VS Code Extension Installability

Status: ✅ Approved with Findings (NEXUS-REV-2026-07-14-001)

Objective

Establish Nexus as an installable, activatable, and operational VS Code extension by validating the complete provider-independent Developer Workflow inside a real VS Code Extension Host. This is a productization and host-validation vertical slice: its purpose is to prove that the architecture certified through Sprint 27 operates correctly in a real extension environment. Sprint 28 SHALL validate the existing architecture. Sprint 28 SHALL NOT extend it.

RFC Coverage

- No Primary RFC — packaging/tooling and validation-only slice.
- Referenced: RFC-0009 — Host Contract, RFC-0010 — Kernel Boundaries.

Ratification References

- `NEXUS-RAT-2026-07-14-001` — governs this sprint's entire scope: retitling/confirmation, refined Authorized Vertical Slice, the binding Extension Host Validation Boundary, the binding Packaging Scope, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-13-013` / `NEXUS-RAT-2026-07-13-014` — govern the certified Developer Workflow this sprint validates inside a real host; unaffected and unmodified.
- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md` remains deferred; this sprint continues using the certified `MockAdapter` exclusively.

Extension Host Validation Boundary (binding)

Extension-host tests SHALL exercise only existing public Host entry points and SHALL validate installation, activation, command execution, provider-independent workflow execution, and extension lifecycle only. Extension-host tests SHALL NOT replace or duplicate Kernel integration test ownership, which remains with the existing Vitest suite (Sprint 16/17/18/20/25/26/27, unmodified).

Packaging Scope (binding)

Authorized: local VSIX generation, local installation, Extension Development Host validation, packaging metadata completion. Excluded: Visual Studio Marketplace publication, marketplace metadata validation, release automation, extension publishing.

Authorized Vertical Slice

- Complete `package.json` packaging metadata (`activationEvents`, `icon`, `repository`, `license`, `engines`).
- Add `.vscodeignore`; add `@vscode/vsce` and a local `package` script producing a `.vsix`.
- Add `.vscode/launch.json` for manual Extension Development Host verification.
- Add `@vscode/test-electron` and a new automated extension-host integration test verifying activation, all six command registrations, and an end-to-end `nexus.runDeveloperMissionWorkflow` execution against the certified `MockAdapter`.
- No `src/kernel`, `src/adapters`, or `src/hosts` business-logic changes.

Deferred Concepts

- GitHub Copilot CLI / Claude CLI / Gemini CLI / Codex CLI Adapters; production Adapter integration; Adapter Selection; provider routing; authentication/credential management; OAuth; `SecretStorage` integration; streaming responses; multi-provider coordination; Visual Studio Marketplace publishing; release automation; `COPILOT_INSTRUCTIONS.md`.

Definition of Done

- A valid `.vsix` package is produced from a clean repository, installs successfully, and activates without runtime errors.
- All six currently-implemented commands register and are discoverable after activation.
- The complete provider-independent Developer Workflow executes successfully through `MockAdapter`, verified by an automated `@vscode/test-electron` test running inside a real Extension Host.
- No `src/kernel`/`src/adapters` file changes; Sprint 18's boundary test passes unmodified.
- Repository-wide validation passes: TypeScript compile, ESLint, existing Vitest suite, esbuild, plus the new extension-host test target.

See `knowledge/implementation/sprints/sprint-0028-vs-code-extension-installability.md` for the complete Sprint Implementation Record.

---

## Sprint 29 — Gemini CLI Adapter Runtime Integration

Status: ✅ Approved (NEXUS-REV-2026-07-14-002)

Objective

Implement the first production Adapter — `GeminiCliAdapter` — conforming to the frozen RFC-0008 Adapter Contract, validating that it correctly interoperates with the existing `LocalProcessRuntime` (Sprint 21) while preserving every previously certified architectural boundary. This Sprint validates the Adapter implementation itself, in isolation. It SHALL NOT introduce Developer Workflow integration, modify Host orchestration, or modify Kernel behavior.

RFC Coverage

- RFC-0008 — Kernel Adapter Contract (Primary, Partial — first production implementation)
- Referenced: RFC-0004 — Execution Model, RFC-0010 — Kernel Boundaries

Ratification References

- `NEXUS-RAT-2026-07-14-003` — governs this sprint's entire scope: refined objective, Architectural Intent, Authorized Vertical Slice, the binding two-tier Acceptance Criteria (Automated Repository Validation + Manual Production Verification), authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-002` — governs provider selection (Gemini CLI), authentication model (pre-authenticated local CLI session), and `ADAPTER_RUNTIME_INSTRUCTIONS.md` naming.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected.

Architectural Intent (binding)

```text
MockAdapter → MockAdapter + GeminiCliAdapter (both registered; GeminiCliAdapter exercised only via
direct AdapterService.dispatch in tests — not wired into HostMissionWorkflow)
```

Two-Tier Acceptance Criteria (binding)

1. **Automated Repository Validation (Mandatory, CI-safe):** tests exercise `GeminiCliAdapter` against a deterministic local test-double executable only — never a live Gemini CLI; validates request translation, process invocation, response parsing, diagnostics, timeout/malformed-output handling, and Adapter Contract conformance; no network/auth/nondeterministic dependency; part of `npm run validate`.
2. **Manual Production Verification (Mandatory, documented, NOT automated):** a documented procedure validating `GeminiCliAdapter` against a real, locally authenticated Gemini CLI, confirming executable discovery, invocation, execution, response parsing, and diagnostics. Serves as production interoperability evidence; explicitly excluded from `npm run validate`.

Authorized Vertical Slice

- `GeminiCliAdapter implements Adapter` under `src/adapters/gemini/`, using constructor-injected `LocalProcessRuntimeContract`, mirroring `MockAdapter`'s placement outside `src/kernel`.
- Deterministic diagnostics for executable-not-found, non-zero exit, malformed output, timeout, runtime error.
- Composition-time registration through the existing `createKernelServices` `adapters` option; not wired as the Developer Workflow's dispatch target.
- `ADAPTER_RUNTIME_INSTRUCTIONS.md` at repository root — runtime execution guidance only, not governance.

Deferred Concepts

- Developer Workflow integration; replacing `MockAdapter` in `HostMissionWorkflow`; GitHub Copilot CLI / Claude CLI / Codex CLI Adapters; Adapter Selection / provider routing; authentication/credential management, OAuth, `SecretStorage`; streaming responses; multi-provider coordination.

Definition of Done

- `GeminiCliAdapter` dispatches successfully and deterministically through `AdapterService` in isolation against a test-double executable, with correct diagnostics for all specified failure modes.
- A documented Manual Production Verification procedure exists and its results are recorded in the Implementation Report.
- `ADAPTER_RUNTIME_INSTRUCTIONS.md` exists, scoped strictly to runtime guidance.
- No `src/kernel` file changes; no Host orchestration/Developer Workflow file changes; `extension.ts` continues registering `MockAdapter` for the Developer Workflow, unmodified.
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified.
- Repository-wide automated validation passes: TypeScript compile, ESLint, Vitest, esbuild — Manual Production Verification excluded from this automated gate by design.

See `knowledge/implementation/sprints/sprint-0029-gemini-cli-adapter-runtime-integration.md` for the complete Sprint Implementation Record.

---

## Sprint 30 — Developer Workflow Integration of GeminiCliAdapter

Status: Current

Objective

Connect the certified, isolated `GeminiCliAdapter` (Sprint 29) to the Developer Workflow through a second, dedicated Host command, so a developer can exercise a real production Adapter end-to-end, while leaving the existing `nexus.runDeveloperMissionWorkflow` command and its frozen, deterministic `MockAdapter`-based test baseline (Sprints 25–28) completely unmodified. This introduces exactly one architectural variable: a second workflow command targeting `GeminiCliAdapter` via an explicit `adapterId`, reusing the existing certified execution pipeline verbatim.

RFC Coverage

- RFC-0009 — Host Contract (Primary, Partial).
- Referenced: RFC-0004 — Execution Model, RFC-0008 — Kernel Adapter Contract, RFC-0010 — Kernel Boundaries.

Ratification

- `NEXUS-RAT-2026-07-14-004` — governs this sprint's entire scope: the binding decision to introduce a second Developer Workflow command rather than a persisted Adapter-configuration surface, the Architectural Responsibilities, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-003` — established that Developer Workflow integration of `GeminiCliAdapter` is authorized only after Sprint 29's independent certification; satisfied by `NEXUS-REV-2026-07-14-002`.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected; the new command dispatches via explicit `adapterId` only.

Authorized Vertical Slice

- A new Host command (e.g. `nexus.runDeveloperMissionWorkflowWithGeminiCli`) sequencing the identical, already-certified workflow steps (Sprint 25/26/27's Mission → MissionPlan → Task → Execution → Evidence → Review → Knowledge sequence), with the Adapter dispatch step's explicit `adapterId` set to `GEMINI_CLI_ADAPTER_ID` instead of `MOCK_ADAPTER_ID`.
- Registration of `GeminiCliAdapter` at the `extension.ts` composition root alongside the existing, unmodified `MockAdapter` registration.
- New command contribution point (`package.json` `contributes.commands` / `activationEvents`) mirroring the existing command's registration pattern.
- Unit/integration test coverage for the new command's success and failure paths, using the existing deterministic Gemini CLI test-double (Sprint 29) exclusively — never a live Gemini CLI.

Deferred Concepts

- Persisted adapter preferences, Workspace/User adapter settings, or any configuration subsystem for Adapter selection.
- Adapter Selection Policy, automatic provider routing, capability scoring, fallback, or multi-adapter coordination.
- Authentication management, credential storage, OAuth, `SecretStorage` integration.
- GitHub Copilot CLI Adapter, Claude CLI Adapter, Codex CLI Adapter, or any second production Adapter.
- Streaming responses, multi-provider coordination, background execution.

Definition of Done

- The existing `nexus.runDeveloperMissionWorkflow` command and every Sprint 25–28 test asserting its behavior pass unmodified.
- The new command executes the identical certified workflow sequence through `GeminiCliAdapter` via explicit `adapterId`, with no Adapter Selection, routing, or persisted configuration introduced.
- The new command's automated test coverage remains fully deterministic and CI-safe, using only the Sprint 29 test-double executable.
- No `src/kernel` file changes.
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

See `knowledge/implementation/sprints/sprint-0030-developer-workflow-gemini-cli-integration.md` for the complete Sprint Implementation Record.
