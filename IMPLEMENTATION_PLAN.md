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

Status: ✅ COMPLETE (Sprint 28 Approved with Findings; Sprint 29 Approved — NEXUS-REV-2026-07-14-002; Sprint 30 Approved — NEXUS-REV-2026-07-14-003)

Objective

Transition Nexus from a certified, provider-independent Kernel/Host architecture to an operational product, and — after productization is independently certified — introduce the first production AI provider Adapter.

Governance Note

Per `NEXUS-RAT-2026-07-14-001`, Milestone 5 began with a productization/host-validation slice (Sprint 28) rather than a production Adapter. Following Sprint 28's independent certification, `NEXUS-RAT-2026-07-14-002` resolved the previously open provider-selection, authentication-model, and runtime-instructions-naming ambiguities: the first production Adapter targets **Gemini CLI**, assumes a **pre-authenticated local CLI session** (Nexus never handles credentials), and activates the canonically-named `ADAPTER_RUNTIME_INSTRUCTIONS.md` (superseding `NEXUS-RAT-2026-07-13-010`'s illustrative `COPILOT_INSTRUCTIONS.md` naming; that entry remains recorded unmodified). `NEXUS-RAT-2026-07-14-003` then scoped Sprint 29 to implement `GeminiCliAdapter` in isolation, deferring Developer Workflow integration to a future Sprint. Following Sprint 29's independent certification (`NEXUS-REV-2026-07-14-002`), `nexus-plan` raised a Governance Report on how to wire `GeminiCliAdapter` into the Developer Workflow without regressing the frozen, deterministic Sprint 25–28 `MockAdapter` test baseline; `NEXUS-RAT-2026-07-14-004` resolved this by authorizing a second, dedicated Developer Workflow command for `GeminiCliAdapter`, explicitly declining to introduce a persisted Adapter-selection configuration surface this Sprint.

Planning Principle

Sprint sequencing within this milestone is intentionally provisional. Following each approved Sprint, `nexus-plan` SHALL assess the repository state and determine the next implementation slice based on implementation experience, repository readiness, governance decisions, and approved ratifications. Approved vertical slices remain immutable.

Expected Outcomes

- An installable, activatable, and operational Nexus VS Code extension, validated inside a real Extension Host (Sprint 28 — complete).
- A certified, isolated `GeminiCliAdapter` production Adapter implementation, proving the RFC-0008 Adapter Contract works with a real provider without Developer Workflow coupling (Sprint 29 — complete).
- Developer Workflow integration of `GeminiCliAdapter` via a second, dedicated command, preserving the existing `MockAdapter`-based command as the frozen deterministic baseline (Sprint 30 — complete).

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

Status: ✅ Approved (NEXUS-REV-2026-07-14-003)

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

---

# Milestone 6 — Multi-Provider Adapter Integration

Status: ✅ COMPLETE (Sprint 31 Approved — NEXUS-REV-2026-07-14-004; Sprint 32 Approved with Findings — NEXUS-REV-2026-07-14-005; Sprint 33 Approved with Findings — NEXUS-REV-2026-07-14-008, remediation verified NEXUS-REV-2026-07-14-009; Sprint 34 Approved — NEXUS-REV-2026-07-14-010; Milestone closed at Sprint 34 by NEXUS-RAT-2026-07-14-011)

Objective

Prove that the RFC-0008 Adapter Contract scales beyond a single production provider by implementing and certifying a second production Adapter, `CodexCliAdapter`, in isolation — mirroring the Sprint 29 pattern of implement-then-certify-in-isolation before any Developer Workflow wiring is authorized.

Governance Note

Per `NEXUS-RAT-2026-07-14-005`, following Milestone 5's completion (Sprint 30, `NEXUS-REV-2026-07-14-003`), the Sprint Owner opened Milestone 6 with a second production Adapter rather than a persisted Adapter-selection configuration surface, Marketplace publication, or Execution Model deepening — each remaining a valid future candidate. The second production Adapter targets **Codex CLI**, assuming the identical **pre-authenticated local CLI session** authentication model already ratified for Gemini CLI (`NEXUS-RAT-2026-07-14-002`).

Per `NEXUS-RAT-2026-07-14-011`, Milestone 6 is declared Complete as of Sprint 34: both Expected Outcomes below were fully satisfied (Sprint 31/33 and Sprint 32, respectively), with Sprint 34 as its closing presentation slice. Sprint 35 — Builder Workflow Foundation introduces a fundamentally different engineering concern (Role-scoped Host workflows, not Adapter/provider scaling) and is retroactively classified as the opening Sprint of Milestone 7 — AI Engineering Workflows, below.

Planning Principle

Sprint sequencing within this milestone was intentionally provisional. Following each approved Sprint, `nexus-plan` assessed the repository state and determined the next implementation slice based on implementation experience, repository readiness, governance decisions, and approved ratifications. Approved vertical slices remain immutable.

Expected Outcomes

- A certified, isolated `CodexCliAdapter` production Adapter implementation, proving the RFC-0008 Adapter Contract generalizes across providers without Developer Workflow coupling (Sprint 31). — Satisfied.
- Developer Workflow integration of `CodexCliAdapter` and/or a persisted Adapter-selection configuration surface (future slice, scope to be determined by a future Sprint Owner decision). — Satisfied (Sprint 32: Developer Workflow integration; Sprint 33: persisted Adapter-selection configuration surface).

---

## Sprint 31 — Codex CLI Adapter Runtime Integration

Status: ✅ Approved (NEXUS-REV-2026-07-14-004)

Objective

Implement the second production Adapter — `CodexCliAdapter` — conforming to the frozen RFC-0008 Adapter Contract, validating that it correctly interoperates with the existing `LocalProcessRuntime` (Sprint 21) while preserving every previously certified architectural boundary. This Sprint validates the Adapter implementation itself, in isolation, mirroring Sprint 29's `GeminiCliAdapter` pattern exactly. It SHALL NOT introduce Developer Workflow integration. It SHALL NOT modify Host orchestration. It SHALL NOT modify Kernel behavior.

RFC Coverage

- RFC-0008 — Kernel Adapter Contract (Partial — second production implementation).
- Referenced: RFC-0004 — Execution Model, RFC-0010 — Kernel Boundaries.

Ratification

- `NEXUS-RAT-2026-07-14-005` — governs this sprint's entire scope: Milestone 6 direction, provider selection (Codex CLI), authentication model (pre-authenticated local CLI session, inherited from `NEXUS-RAT-2026-07-14-002`), the binding Isolation Boundary and Two-Tier Acceptance Criteria (mirroring `NEXUS-RAT-2026-07-14-003`), authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-002` — the Gemini CLI provider-selection/authentication-model precedent this ratification mirrors for Codex CLI.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected.

Authorized Scope

- `CodexCliAdapter implements Adapter` under `src/adapters/codex/`, constructor-injected with `LocalProcessRuntimeContract`, mirroring `GeminiCliAdapter`'s and `MockAdapter`'s existing placement outside `src/kernel`.
- Deterministic diagnostics reusing `ProcessDiagnostics` where applicable, for: executable-not-found, non-zero exit, malformed/unparseable CLI output, timeout, runtime error.
- Composition-time registration of `CodexCliAdapter` through the existing `createKernelServices` `adapters` option, exercised in tests only via direct `AdapterService.dispatch` calls with an explicit `adapterId` — never wired into `HostMissionWorkflow` or any Host command.
- `ADAPTER_RUNTIME_INSTRUCTIONS.md` reconciliation, extending its existing provider-neutral guidance to explicitly cover a second CLI-backed provider, without redefining its runtime-guidance-only scope.
- The automated deterministic-test-double suite (Acceptance Criteria § 1) and a documented manual verification procedure (Acceptance Criteria § 2), mirroring Sprint 29's Two-Tier Acceptance Criteria exactly.

Deferred Concepts

- Developer Workflow integration; any new Host command targeting `CodexCliAdapter`; any Host orchestration change.
- Persisted Adapter-selection configuration surface (remains deferred from Sprint 24/30, unaffected by this Sprint).
- GitHub Copilot CLI Adapter; Claude CLI Adapter; any third production Adapter.
- Adapter Selection Policy, provider routing, provider preference, fallback, multi-adapter execution.
- Authentication management, credential storage, OAuth, `SecretStorage` integration.
- Streaming responses, multi-provider coordination, background execution, retries beyond Sprint 21's existing timeout/cancellation primitives.

Definition of Done

- `CodexCliAdapter` dispatches successfully and deterministically through `AdapterService` in isolation against a test-double executable, with correct diagnostics for all specified failure modes.
- A documented Manual Production Verification procedure exists and its results are recorded in the Implementation Report.
- No `src/kernel` file changes; no Host orchestration/Developer Workflow file changes; both existing Developer Workflow commands continue registering `MockAdapter`/`GeminiCliAdapter` respectively, unmodified.
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified.
- Repository-wide automated validation passes: TypeScript compile, ESLint, Vitest, esbuild — Manual Production Verification excluded from this automated gate by design.

See `knowledge/implementation/sprints/sprint-0031-codex-cli-adapter-runtime-integration.md` for the complete Sprint Implementation Record.

---

## Sprint 32 — Production Workflow Parity

Status: ✅ Approved with Findings (NEXUS-REV-2026-07-14-005)

Objective

Complete the production workflow matrix by integrating `CodexCliAdapter` (certified in isolation by Sprint 31, `NEXUS-REV-2026-07-14-004`) into the Developer Workflow, mirroring the exact architectural pattern `NEXUS-RAT-2026-07-14-004` established for `GeminiCliAdapter` in Sprint 30. Introduces exactly one architectural variable: a third Developer Workflow command targeting `CodexCliAdapter` via an explicit `adapterId`, reusing the existing certified execution pipeline verbatim.

RFC Coverage

- RFC-0009 — Host Contract (Primary, Partial).
- Referenced: RFC-0004 — Execution Model, RFC-0008 — Kernel Adapter Contract, RFC-0010 — Kernel Boundaries.

Ratification

- `NEXUS-RAT-2026-07-14-006` — governs this sprint's entire scope: title, authorized command addition, Host/Kernel responsibility split, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-005` — named the three candidate directions for Milestone 6 following Sprint 31; `NEXUS-RAT-2026-07-14-006` selects Developer Workflow integration.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected; the new command dispatches via explicit `adapterId` only.

Authorized Vertical Slice

- A new Host command (e.g. `nexus.runDeveloperMissionWorkflowWithCodexCli`) sequencing the identical, already-certified workflow steps (Sprint 25/26/27's Mission → MissionPlan → Task → Execution → Evidence → Review → Knowledge sequence), with the Adapter dispatch step's explicit `adapterId` set to the `CodexCliAdapter` identifier instead of `MOCK_ADAPTER_ID`/`GEMINI_CLI_ADAPTER_ID`.
- Registration of `CodexCliAdapter` at the `extension.ts` composition root alongside the existing, unmodified `MockAdapter` and `GeminiCliAdapter` registrations.
- New command contribution point (`package.json` `contributes.commands` / `activationEvents`) mirroring the existing commands' registration pattern.
- Unit/integration test coverage for the new command's success and failure paths, using the existing deterministic Codex CLI test-double (Sprint 31) exclusively — never a live `codex` CLI.

Deferred Concepts

- Persisted adapter preferences, Workspace/User adapter settings, or any configuration subsystem for Adapter selection.
- Adapter Selection Policy, automatic provider routing, capability scoring, fallback, or multi-adapter coordination.
- Execution Model deepening (full RFC-0004 Execution State set, Execution Session, Review-gated execution progression).
- Authentication management, credential storage, OAuth, `SecretStorage` integration.
- GitHub Copilot CLI Adapter, Claude CLI Adapter, or any fourth production Adapter.
- Streaming responses, multi-provider coordination, background execution.

Definition of Done

- The existing `nexus.runDeveloperMissionWorkflow` and `nexus.runDeveloperMissionWorkflowWithGeminiCli` commands, and every Sprint 25–31 test asserting their behavior, pass unmodified.
- The new command executes the identical certified workflow sequence through `CodexCliAdapter` via explicit `adapterId`, with no Adapter Selection, routing, or persisted configuration introduced.
- The new command's automated test coverage remains fully deterministic and CI-safe, using only the Sprint 31 test-double executable.
- No `src/kernel` file changes.
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

See `knowledge/implementation/sprints/sprint-0032-production-workflow-parity.md` for the complete Sprint Implementation Record.

---

## Sprint 33 — Adapter Configuration Foundation

Status: ✅ Approved with Findings (NEXUS-REV-2026-07-14-008)

Objective

Introduce a provider-neutral Adapter Configuration capability that allows the Host to resolve an explicit `adapterId` from VS Code User or Workspace configuration, while preserving the deterministic execution model established through Milestone 5 and Sprint 31/32. The Developer Workflow now has parity commands for `MockAdapter`, `GeminiCliAdapter`, and `CodexCliAdapter` (Sprint 32); this Sprint lets a developer configure a default adapter instead of remembering which command targets which provider, without introducing Adapter Selection Policy, routing, or capability scoring.

RFC Coverage

- RFC-0009 — Host Contract (Primary, Partial).
- Referenced: RFC-0008 — Kernel Adapter Contract, RFC-0010 — Kernel Boundaries.

Ratification

- `NEXUS-RAT-2026-07-14-007` — governs this Sprint's entire scope: title, authorized configuration surface, Host/Kernel responsibility split, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-005` — named the three candidate directions for Milestone 6 following Sprint 31; `NEXUS-RAT-2026-07-14-007` selects the persisted Adapter-selection configuration surface.
- `NEXUS-RAT-2026-07-13-011` — dispatch remains explicit-`adapterId`-only; a configuration-resolved default is not Adapter Selection Policy.

Authorized Vertical Slice

- VS Code User/Workspace configuration (`package.json` `contributes.configuration`) declaring a default Developer Workflow adapter identifier setting.
- Host-local resolution of this configuration value into an explicit `adapterId`, consumed only by the Host before invoking the existing, unmodified execution pipeline.
- Continued availability and backward compatibility of the three existing explicit Developer Workflow commands, which SHALL continue to dispatch via their own hardcoded `adapterId` exactly as certified in Sprints 25, 30, and 32.
- Unit/integration test coverage for configuration resolution (default present, default absent, default naming an unregistered/unknown adapter identifier), using only deterministic test-doubles.

Deferred Concepts

- Adapter Selection Policy, automatic provider routing, capability scoring, fallback, or multi-adapter coordination.
- Role-based adapter assignment; multi-provider coordination.
- Execution Model deepening (full RFC-0004 Execution State set, Execution Session, Review-gated execution progression).
- Authentication management, credential storage, OAuth, `SecretStorage` integration.
- A fourth production Adapter (GitHub Copilot CLI, Claude CLI).
- Streaming responses, background execution.

Definition of Done

- The three existing Developer Workflow commands and every Sprint 25–32 test asserting their behavior pass unmodified.
- A new configuration setting exists, resolved entirely within the Host; the Kernel continues to receive only an explicit `adapterId` at the call site.
- Configuration resolution is covered by deterministic tests for: default present and valid, default absent, and default naming an unregistered adapter identifier.
- No `src/kernel` file changes.
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

See `knowledge/implementation/sprints/sprint-0033-adapter-configuration-foundation.md` for the complete Sprint Implementation Record.

---

## Sprint 34 — Developer Workflow UX Consolidation

Status: ✅ Approved (NEXUS-REV-2026-07-14-010)

Objective

Consolidate the Developer Workflow's user experience around the provider-neutral entry point Sprint 33 already established (`nexus.runDeveloperMissionWorkflowWithConfiguredAdapter`), promoting its discoverability, naming, and documentation as the recommended default. Documentation, metadata, and presentation scope only; introduces no new runtime or architectural capability. The originally-proposed "Unified Developer Workflow" framing (merging the three provider-specific commands into one) is found, per `/nexus-plan` governance analysis, to already be satisfied architecturally by Sprint 33; command removal/deprecation is explicitly deferred.

RFC Coverage

- No Primary RFC — documentation/presentation-only slice.
- Referenced: RFC-0009 — Host Contract.

Ratification

- `NEXUS-RAT-2026-07-14-009` — governs this Sprint's entire scope: title, authorized presentation/documentation surface, the binding decision that command consolidation (removal/deprecation) is deferred, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-007` — governs the Sprint 33 architecture this Sprint promotes; unmodified.

Authorized Vertical Slice

- `package.json` `contributes.commands` title/description/category updates presenting `nexus.runDeveloperMissionWorkflowWithConfiguredAdapter` as the primary Developer Workflow entry point.
- README/user-facing documentation updates describing the configured-adapter command and its configuration setting as the recommended default, with the three provider-specific commands described as compatibility alternatives.
- Command metadata clarifications supported by the existing VS Code contribution model.
- Test coverage for `package.json` command metadata only.

Deferred Concepts

- Removal, deprecation, renaming, or aliasing of any existing command identifier.
- Any change to Host Adapter Configuration resolution or dispatch logic.
- Adapter Selection Policy, routing, capability scoring, a fourth production Adapter, Execution Model deepening, authentication/credential management.
- Any `src/kernel` or `src/adapters` change.

Definition of Done

- All existing Developer Workflow commands retain their identifiers and dispatch behavior, unmodified.
- `nexus.runDeveloperMissionWorkflowWithConfiguredAdapter` is presented as the primary, recommended entry point.
- Every Sprint 25–33 test asserting command dispatch behavior passes unmodified.
- No `src/kernel`/`src/adapters` file changes; Sprint 18's boundary test passes unmodified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

See `knowledge/implementation/sprints/sprint-0034-developer-workflow-ux-consolidation.md` for the complete Sprint Implementation Record.

---

# Milestone 7 — AI Engineering Workflow Framework

Status: ✅ COMPLETE (Sprint 35 Approved — NEXUS-REV-2026-07-14-011; Sprint 36 Approved — NEXUS-REV-2026-07-14-012; Sprint 37 Approved with Findings — NEXUS-REV-2026-07-14-013; Sprint 38 Approved with Findings — NEXUS-REV-2026-07-14-015)

Objective

Establish the AI Engineering Workflow Framework: a family of dedicated, Role-scoped AI Engineering Workflow entry points at the Host layer, together with the reusable Kernel metadata foundation (Engineering Role Profile) that supports discovering and presenting those workflows without hard-coded Host knowledge of each Role. Each workflow SHALL reuse the already-certified Host, Kernel, Execution Pipeline, Adapter Runtime, and Adapter Configuration without modification, differing only by Execution Role, Host presentation, and workflow-specific result presentation.

Governance Note

Retitled from "AI Engineering Workflows" to "AI Engineering Workflow Framework" per Sprint Owner direction (2026-07-14): Sprints 35–37 certified the canonical Role-scoped Host Workflow pattern and Sprint 38 completed the reusable framework's metadata foundation (Engineering Role Profiles). Per `NEXUS-RAT-2026-07-14-016`, Milestone 7's remaining objectives are limited to those explicitly authorized through ratified governance; no additional architectural capability, including Workflow Chaining, is authorized within this milestone. Sprint 38 is Milestone 7's final authorized Sprint, and Milestone 7 is therefore Complete. No additional individual engineering-role workflow foundation (Security Reviewer, Performance Reviewer, Accessibility Reviewer, Test Engineer, Database Reviewer) SHALL be proposed under this milestone unless it introduces a genuinely new architectural capability.

Opened by `NEXUS-RAT-2026-07-14-011`, which closed Milestone 6 at Sprint 34 and retroactively classified Sprint 35 — Builder Workflow Foundation as this milestone's opening Sprint. Sprint 35's own implementation, review, and ratification records are unmodified by this reclassification; only milestone-level bookkeeping changed. No Milestone 7 Sprint SHALL introduce Kernel ownership changes, Adapter Contract changes, Adapter Selection, Role-to-Adapter routing, Execution Session, Assignment Policy, Workflow Chaining, or multi-agent orchestration, unless separately authorized through a future RFC or Sprint Owner ratification. Workflow Chaining, Assignment Policy, and Execution Sessions remain deferred to Milestone 8 per `NEXUS-RAT-2026-07-14-011`, reaffirmed by `NEXUS-RAT-2026-07-14-016`.

`NEXUS-RAT-2026-07-14-013` authorizes Sprint 37 — Documentation Workflow Foundation, Milestone 7's first authorized `src/kernel` change (Role registration only), registering the RFC-0004-named `Documentation Reviewer` Additional Role and exposing its Host workflow via the Sprint 36 canonical factory.

`NEXUS-RAT-2026-07-14-012` establishes a binding Architectural Invariant for this milestone: every Role-scoped Workflow entry point SHALL differ from every other only by the Execution Role requested and by workflow presentation metadata, reusing Host Adapter Configuration, explicit-`adapterId` dispatch, the certified Execution Pipeline, Adapter Runtime, and Kernel contracts unmodified in every case. Sprint 36 is directed to extract the Role-scoped Configured Mission Workflow construction (duplicated in `vscode-host.ts` for the Developer and Builder Workflows) into a single reusable factory, refactoring the Builder Workflow to use it, so the pattern is genuinely canonical rather than repeatedly copy-pasted.

`NEXUS-RAT-2026-07-14-014` amends RFC-0004 to Version 1.1, introducing `Engineering Role Profile` as a new RFC-0004-owned architectural concept — descriptive, presentational, discoverability metadata for an Execution Role, distinct from and subordinate to Execution Role's ownership of execution semantics. `NEXUS-RAT-2026-07-14-015` authorizes Sprint 38 — Engineering Role Profiles Foundation to implement it.

Completed

- Sprint 35 — Builder Workflow Foundation (Approved).
- Sprint 36 — Reviewer Workflow Foundation (Approved).
- Sprint 37 — Documentation Workflow Foundation (Approved with Findings; remediated — no open findings).
- Sprint 38 — Engineering Role Profiles Foundation (Approved with Findings — NEXUS-REV-2026-07-14-015; one Minor Documentation Drift finding open in `IMPLEMENTATION_MANIFEST.md`, non-blocking).

Remaining Objectives

- Workflow Chaining Foundation (not yet scheduled; requires its own future Sprint Owner scope ratification).

Milestone 7 SHALL conclude only after these framework capabilities have been established. A **Planner Workflow** remains explicitly not scheduled: "Planner" is not an RFC-0004 Execution Role.

---

## Sprint 35 — Builder Workflow Foundation

Status: Approved — NEXUS-REV-2026-07-14-011

Objective

Introduce the first AI Engineering Workflow by implementing a dedicated Builder Workflow entry point that reuses the certified Host, Configuration, Execution Pipeline, and Adapter architecture verbatim, differing from the existing Developer Workflow only in explicit Role framing (`roleId: 'builder'`) and Builder-specific result presentation.

RFC Coverage

- No Primary RFC — Host-layer additive command, reusing existing certified contracts.
- Referenced: RFC-0004 — Execution Model (`builder` Execution Role, already registered by Sprint 8), RFC-0009 — Host Contract, RFC-0010 — Kernel Boundaries.

Ratification

- `NEXUS-RAT-2026-07-14-010` — governs this Sprint's entire scope: title, authorized command addition, Host/Kernel responsibility split, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-005` — named the original three Milestone 6 candidate directions; `NEXUS-RAT-2026-07-14-010` selects a fourth direction instead for Sprint 35.

Authorized Vertical Slice

- A new, additive Host command (e.g. `nexus.runBuilderMissionWorkflow`) constructing the existing `HostMissionWorkflow`/`HostConfiguredMissionWorkflow` machinery with an explicit `roleId: 'builder'`, reusing Host Adapter Configuration resolution (Sprint 33) and the certified Execution Pipeline (Sprints 25–27) verbatim.
- `package.json` command contribution registration mirroring the existing pattern.
- Host presentation/result formatting labeling the new command's output as Builder-specific, without introducing new Kernel data or a new Domain Event.
- Unit/integration test coverage for the new command, using existing deterministic test-doubles exclusively.

Deferred Concepts

- Reviewer Workflow, Planner Workflow, or any other role-scoped workflow beyond Builder.
- Role-based adapter assignment, workflow chaining, multi-agent coordination, automatic routing.
- Execution Model expansion, a fourth production Adapter, Adapter Selection Policy, Marketplace publication.
- Any `src/kernel` or `src/adapters` change.

Definition of Done

- All existing Developer Workflow commands retain their identifiers, dispatch behavior, and test coverage, unmodified.
- The new Builder Workflow command dispatches through the identical certified Execution Pipeline with explicit `roleId: 'builder'`.
- No `src/kernel`/`src/adapters` file changes; Sprint 18's boundary test passes unmodified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

See `knowledge/implementation/sprints/sprint-0035-builder-workflow-foundation.md` for the complete Sprint Implementation Record.

---

## Sprint 36 — Reviewer Workflow Foundation

Status: Approved — NEXUS-REV-2026-07-14-012

Objective

Add a second Role-scoped AI Engineering Workflow, `nexus.runReviewerMissionWorkflow`, constructed with explicit `roleId: 'reviewer'` (Sprint 8's registered Execution Role), reusing Host Adapter Configuration resolution and the certified Execution Pipeline verbatim. Establish the canonical Role-scoped Workflow construction pattern by extracting the Developer/Builder Workflow construction currently duplicated in `vscode-host.ts` into a single reusable factory, and refactoring the Builder Workflow to use it.

RFC Coverage

- No Primary RFC — Host-layer additive command, reusing existing certified contracts.
- Referenced: RFC-0004 — Execution Model (`reviewer` Execution Role, already registered by Sprint 8), RFC-0009 — Host Contract, RFC-0010 — Kernel Boundaries.

Ratification

- `NEXUS-RAT-2026-07-14-012` — governs this Sprint's entire scope: title, the binding Architectural Invariant for all Milestone 7 Sprints, the authorized canonical-pattern-extraction refactor, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-011` — the milestone-boundary ratification opening Milestone 7 under which this Sprint is planned.

Authorized Vertical Slice

- Extract the Role-scoped Configured Mission Workflow construction (the `Map`-of-`HostMissionWorkflow` + `HostConfiguredMissionWorkflow` block, currently duplicated for the Developer and Builder Workflows in `vscode-host.ts`) into a single reusable Host-layer factory function parameterized by `roleId` and `presentationOptions`.
- Refactor the existing Builder Workflow wiring (Sprint 35) to call this factory instead of its current inline duplicate — a behavior-preserving refactor only; `nexus.runBuilderMissionWorkflow`'s identifier, dispatch target, presentation strings, and test coverage SHALL be unaffected.
- Add `nexus.runReviewerMissionWorkflow` using the same factory, with `roleId: 'reviewer'` and `presentationOptions: { workflowLabel: 'Reviewer Workflow', completionMessageLabel: 'Reviewer workflow', includeAssignedRole: true }`.
- `package.json` command contribution registration mirroring the existing pattern.
- Unit/integration test coverage for the new command's success and failure paths, plus a regression assertion that the refactored Builder Workflow's existing tests still pass unchanged.

Deferred Concepts

- Planner Workflow, Documentation Workflow, or any other role-scoped workflow beyond Builder/Reviewer.
- Role-based adapter assignment, workflow chaining, multi-agent coordination, automatic routing.
- Execution Model expansion, Execution Session, Assignment Policy, a fourth production Adapter, Adapter Selection Policy, Marketplace publication.
- Any `src/kernel` or `src/adapters` change.

Definition of Done

- All existing Developer Workflow and Builder Workflow commands retain their identifiers, dispatch behavior, and test coverage, unmodified (Sprint 35's tests pass without modification).
- The Role-scoped Configured Mission Workflow construction exists as a single reusable factory, used by both the Builder Workflow and the new Reviewer Workflow.
- The new Reviewer Workflow command dispatches through the identical certified Execution Pipeline with explicit `roleId: 'reviewer'`.
- No `src/kernel`/`src/adapters` file changes; Sprint 18's boundary test passes unmodified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

See `knowledge/implementation/sprints/sprint-0036-reviewer-workflow-foundation.md` for the complete Sprint Implementation Record.

---

## Sprint 37 — Documentation Workflow Foundation

Status: Approved with Findings — NEXUS-REV-2026-07-14-013

Objective

Register the existing RFC-0004 `Documentation Reviewer` Additional Role as a third default Kernel Role and expose its Host workflow entry point, `nexus.runDocumentationReviewerMissionWorkflow`, using the canonical Role-scoped Workflow factory introduced in Sprint 36. This is Milestone 7's first authorized `src/kernel` change — Role registration only — and otherwise reuses the certified Host, Configuration, Execution Pipeline, and Adapter architecture verbatim.

RFC Coverage

- No Primary RFC — Kernel Role registration reuses RFC-0004's existing `ExecutionRole`/`RoleRegistry` contracts; Host command is additive, reusing existing certified contracts.
- Referenced: RFC-0004 — Execution Model (registers the `Documentation Reviewer` Additional Role it already names), RFC-0009 — Host Contract, RFC-0010 — Kernel Boundaries.

Ratification

- `NEXUS-RAT-2026-07-14-013` — governs this Sprint's entire scope: title, canonical Role id/command id/presentation strings, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-011` — named this Sprint's direction and flagged it as Milestone 7's first Sprint expected to touch `src/kernel`.
- `NEXUS-RAT-2026-07-14-012` — the binding Architectural Invariant this Sprint complies with.

Authorized Vertical Slice

- Add exactly one new `ExecutionRole` entry to `createDefaultKernelRoles()` (`src/kernel/execution/default-kernel-roles.ts`) for Role id `documentation-reviewer`, mirroring the existing `builder`/`reviewer` entries' shape exactly (`category: 'Engineering Responsibility'`, `metadata.attributes: { origin: 'KernelDefault', rfc: 'RFC-0004' }`); the existing two entries SHALL remain byte-for-byte unchanged.
- Add `nexus.runDocumentationReviewerMissionWorkflow` via the Sprint 36 `createConfiguredMissionWorkflow` factory, with explicit `roleId: 'documentation-reviewer'` and `presentationOptions: { workflowLabel: 'Documentation Reviewer Workflow', completionMessageLabel: 'Documentation Review completed', includeAssignedRole: true }`.
- `package.json` command contribution registration mirroring the existing pattern.
- Unit/integration test coverage: Kernel Role-registration unit test(s); Host command registration, success-path, and input-cancellation-failure-path tests; package-metadata/activation-event/extension-host discoverability assertions; and a regression assertion that the Builder and Reviewer Workflows' existing tests continue to pass unmodified.

Deferred Concepts

- Planner Workflow, Documentation Author Workflow, Security Reviewer Workflow, Architecture Reviewer Workflow, or any other role-scoped workflow beyond Builder/Reviewer/Documentation Reviewer.
- Registration of any Additional Role other than `Documentation Reviewer` (Security Reviewer, Performance Reviewer, Accessibility Reviewer, Test Engineer, Database Reviewer).
- Role-based adapter assignment, workflow chaining, multi-agent coordination, automatic routing.
- Execution Model expansion, Execution Session, Assignment Policy, a fourth production Adapter, Adapter Selection Policy, Marketplace publication.
- Any `src/adapters` change; any change to `HostAdapterConfigurationResolver`/`HostConfiguredMissionWorkflow`.

Definition of Done

- All existing Developer, Builder, and Reviewer Workflow commands retain their identifiers, dispatch behavior, and test coverage, unmodified.
- Exactly one new default `ExecutionRole` is registered; no lifecycle, event, or new Kernel concept is introduced.
- The new Documentation Reviewer Workflow command dispatches through the identical certified Execution Pipeline with explicit `roleId: 'documentation-reviewer'`.
- Sprint 18's Kernel Boundary Certification test passes unmodified; no `src/adapters` file changes.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0037-documentation-workflow-foundation.md` for the complete Sprint Implementation Record.

Implementation Result

- Builder implementation completed the authorized Role-registration and Host command vertical slice.
- Reviewer validation complete: **Approved with Findings** (`NEXUS-REV-2026-07-14-013`). One Minor Documentation Drift finding (F-001) generates a Documentation Task and does not block progression. See `REVIEW_HISTORY.md` and the Sprint Implementation Record for details.

---

## Sprint 38 — Engineering Role Profiles Foundation

Status: Approved with Findings — NEXUS-REV-2026-07-14-015

Objective

Introduce the Kernel-owned `EngineeringRoleProfile` domain concept authorized by RFC-0004 v1.1 (`NEXUS-RAT-2026-07-14-014`), mirroring the existing `ExecutionRole`/`RoleRegistry` pattern, and seed one default profile per already-registered Kernel Role (`builder`, `reviewer`, `documentation-reviewer`) with presentation metadata semantically equivalent to the existing Builder, Reviewer, and Documentation Reviewer Workflow presentation strings. Establishes metadata only; introduces no orchestration.

RFC Coverage

- RFC-0004 — Execution Model v1.1 (Primary; new "Engineering Role Profile" section)
- Referenced: RFC-0010 — Kernel Boundaries

Ratification

- `NEXUS-RAT-2026-07-14-015` — governs this Sprint's entire scope: `EngineeringRoleProfileService`'s non-orchestration boundary, registry immutability after Kernel composition, the strengthened acceptance criterion, the forward-compatibility statement, and the semantic-equivalence (not byte-for-byte) presentation-value requirement.
- `NEXUS-RAT-2026-07-14-014` — the RFC-0004 v1.1 amendment this Sprint implements.
- `NEXUS-RAT-2026-07-14-011` — the milestone-boundary ratification opening Milestone 7, as retitled.

Authorized Vertical Slice

- `EngineeringRoleProfile` immutable Kernel value object (`src/kernel/execution/engineering-role-profile.ts`): `roleId` reference, workflow presentation label, completion presentation label, attribution presentation policy (boolean); `create`/`fromSnapshot`/`toSnapshot`/`equals`, mirroring `ExecutionRole`'s construction pattern.
- `EngineeringRoleProfileRegistry` contract + `InMemoryEngineeringRoleProfileRegistry` (`register`/`getById`/`has`/`enumerate`), mirroring `RoleRegistry`/`InMemoryRoleRegistry`, keyed by `RoleId`.
- `createDefaultEngineeringRoleProfiles()` factory producing exactly one profile per existing default Kernel Role, with presentation values semantically equivalent to Sprints 35–37's existing `vscode-host.ts` `presentationOptions` values. No observable Host behavior change is authorized.
- `EngineeringRoleProfileService`: a thin, non-orchestration abstraction over the registry, limited to lookup, existence checks, enumeration, and diagnostics (duplicate registration, not-found). It SHALL NOT evolve into an orchestration service and authorizes no execution behavior or business rule.
- `createKernelServices` composition seeds the registry via `createDefaultEngineeringRoleProfiles()` at composition time only. Registration exists only during Kernel composition; the registry is treated as immutable at runtime thereafter. No runtime profile creation is authorized.
- Unit tests: value object validation/equality/immutability; registry registration/duplicate-rejection/lookup/enumeration; default-profile factory semantic-equivalence assertions against Sprint 35–37 presentation values; service lookup/enumeration/diagnostics behavior; composition-time-only seeding assertion.

Architectural Purpose (forward compatibility)

`EngineeringRoleProfile` is established as the canonical engineering metadata abstraction for future Kernel and Host capabilities, remaining independent of execution semantics. Future capabilities MAY consume it, including Workflow Chaining, Planner Workflow, engineering role catalogs, future Host discovery mechanisms, and engineering orchestration. This Sprint does not authorize any of those capabilities; it establishes only their common metadata foundation.

Deferred Concepts

- Any Host (`src/hosts`) file change — `vscode-host.ts` continues using its own inline `presentationOptions`; no existing command's identifier, dispatch behavior, presentation strings, or test coverage changes.
- Host/command discovery, workflow catalogs, Activity Bar integration, dashboard generation.
- Workflow Chaining, Assignment Policy, Execution Sessions, Planner Workflow.
- Security Reviewer, Performance Reviewer, Accessibility Reviewer, Test Engineer Workflows (and their Kernel Role registration).
- Adapter Routing, Adapter Selection, multi-agent orchestration, authorization.
- Any `src/adapters` or Execution Pipeline change.

Definition of Done

- `EngineeringRoleProfile` SHALL be the only new normative architectural concept introduced by Sprint 38. No additional execution, lifecycle, workflow, or orchestration concept is introduced.
- Every default Kernel Role has exactly one default Engineering Role Profile; presentation values remain semantically equivalent to existing `vscode-host.ts` values — no observable behavior change.
- No `src/hosts` or `src/adapters` file is modified; all existing Developer/Builder/Reviewer/Documentation Reviewer Workflow commands remain unmodified in identifier, dispatch, presentation, and test coverage.
- `EngineeringRoleProfileService` remains a thin lookup/enumeration/diagnostics abstraction; it introduces no execution behavior or business rule.
- Engineering Role Profile registration occurs only during Kernel composition (`createKernelServices`); the registry is immutable thereafter — no runtime profile creation is introduced.
- `EngineeringRoleProfile` carries no execution semantics, dispatch eligibility, lifecycle, assignment, orchestration, or authorization behavior (verified against RFC-0004 v1.1's SHALL-NOT list).
- Sprint 18's Kernel Boundary Certification test passes, updated only if it enumerates Kernel-composed services (mirroring Sprint 37's role-enumeration assertion update).
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0038-engineering-role-profiles-foundation.md` for the complete Sprint Implementation Record.

Implementation Result

- Builder implementation completed the authorized Engineering Role Profiles metadata foundation vertical slice.
- Reviewer validation complete: **Approved with Findings** (`NEXUS-REV-2026-07-14-015`). One Minor Documentation Drift finding (F-001) generated Documentation Task DOC-004 (`IMPLEMENTATION_MANIFEST.md`'s Milestone 7 status summary line), completed and independently verified (`NEXUS-REV-2026-07-14-016`). See `REVIEW_HISTORY.md` and the Sprint Implementation Record for details.
- Per `NEXUS-RAT-2026-07-14-016`, Sprint 38 is Milestone 7's final authorized Sprint; Milestone 7 is Complete. Milestone 8 was subsequently opened by `NEXUS-RAT-2026-07-14-018` with Sprint 39 — Engineering Sessions Foundation (see below); any further Milestone 8 scope (Workflow Chaining, Assignment Policy, Review-Gated Progression, Multi-Agent Orchestration) still requires its own future RFC extension and dedicated Sprint Owner ratification.

---

# Milestone 8 — Engineering Orchestration

Status: ✅ COMPLETE (Sprint 39 Approved — NEXUS-REV-2026-07-14-017; Sprint 40 Approved with Findings — Execution Session Foundation, NEXUS-REV-2026-07-14-018; Sprint 41 Approved — Workflow Chaining Foundation, NEXUS-REV-2026-07-14-020; Sprint 42 Approved with Findings — Engineering Session Workflow Chain Wiring, NEXUS-REV-2026-07-14-021, fully closed by NEXUS-REV-2026-07-14-022; Sprint 43 Approved — Engineering Session Manual Workflow Advancement, NEXUS-REV-2026-07-14-023; Sprint 44 Approved — Assignment Policy Foundation, NEXUS-REV-2026-07-14-024; Sprint 45 Approved — Automatic/Event-Driven Workflow Advancement, NEXUS-REV-2026-07-14-026, fully closed by TASK-001 remediation of NEXUS-REV-2026-07-14-025-F-001; Sprint 46 Approved with Findings — Review-Gated Workflow Advancement, NEXUS-REV-2026-07-15-001, zero open findings; Sprint 47 Approved — Workflow Chain Execution, NEXUS-REV-2026-07-15-003, fully closed with zero open findings; Sprint 48 Approved — Assignment Policy Integration, NEXUS-REV-2026-07-15-005, fully closed with zero open findings; Sprint 49 Approved — Session Recovery/Checkpointing Foundation, NEXUS-REV-2026-07-15-006, fully closed with zero open findings; Sprint 50 Approved — Concurrent Session Coordination, NEXUS-REV-2026-07-15-007, fully closed with zero open findings; Sprint 51 Approved — Multi-Agent Engineering Orchestration Foundation, NEXUS-REV-2026-07-15-008, fully closed with zero open findings — Milestone 8's concluding Sprint per NEXUS-RAT-2026-07-15-012)

Named by `NEXUS-RAT-2026-07-14-011` as a future milestone. Original candidate scope: Engineering Role Profiles, Workflow Chaining, Assignment Policy, Execution Sessions, Multi-agent Engineering Orchestration, and review-gated execution progression. These are execution-orchestration concerns, not Host-workflow concerns, and were intentionally excluded from Milestone 7 (now Complete, `NEXUS-RAT-2026-07-14-016`). Engineering Role Profiles shipped under Milestone 7 (Sprint 38); Execution Sessions' foundation shipped as Sprint 39's `EngineeringSession` and Sprint 40's `ExecutionSession`. RFC-0004 was amended to v1.3 (`NEXUS-RAT-2026-07-14-020`) to define Workflow Chaining, implemented by Sprint 41 as a standalone `WorkflowChain` concept and wired into `EngineeringSession` by Sprint 42. Sprint 43 (Approved, `NEXUS-REV-2026-07-14-023`) closed Sprint 42's own recorded Known Limitation by introducing deterministic, manually-invoked, single-step workflow advancement and terminal-completion detection. Sprint 44 (Approved, `NEXUS-REV-2026-07-14-024`) implements RFC-0004's existing Assignment Policy section as a standalone domain foundation. RFC-0004 was amended to v1.4 (`NEXUS-RAT-2026-07-14-025`) to define a generalized Workflow Advancement model (Advancement Strategy, Trigger, Eligibility, Authority, Result, Failure) naming three Advancement Strategies: Manual (Sprint 43), Automatic/Event-Driven (Sprint 45, `NEXUS-RAT-2026-07-14-026`), and Review-Gated (Sprint 46, `NEXUS-REV-2026-07-15-001`). During Sprint 47's planning, governance analysis determined that Workflow Advancement moves the current workflow position but RFC-0004 explicitly reserved *executing* the Workflow Step at that position (Adapter dispatch) as a separate, not-yet-authorized capability (v1.3 § Workflow Chaining, v1.4 § Workflow Advancement). RFC-0004 was therefore amended to v1.6 (`NEXUS-RAT-2026-07-15-003`) to add "Workflow Chain Execution," implemented by Sprint 47 (`NEXUS-RAT-2026-07-15-004`) and Approved (`NEXUS-REV-2026-07-15-003`, fully closed after `TASK-001` remediated the sole finding from `NEXUS-REV-2026-07-15-002`). During Sprint 48's planning, a Sprint Owner planning request proposed evaluating "Assignment Policy Foundation" as Milestone 8's next capability; governance analysis found that capability already certified with zero findings as Sprint 44, frozen under Approved Vertical Slice Immutability. RFC-0004 was therefore amended to v1.7 (`NEXUS-RAT-2026-07-15-005`) to add an "Assignment Policy Evaluation" subsection to Workflow Chain Execution — an optional consumption point gating dispatch using Sprint 44's existing, unmodified evaluation — implemented by Sprint 48 (`NEXUS-RAT-2026-07-15-006`), Approved (`NEXUS-REV-2026-07-15-005`, fully closed after `TASK-001` remediated the sole finding from `NEXUS-REV-2026-07-15-004`). During Sprint 49's planning, the Sprint Owner selected Session Recovery/Checkpointing from Milestone 8's remaining candidate scope; RFC-0004 was amended to v1.8 (`NEXUS-RAT-2026-07-15-007`) to add "Session Recovery/Checkpointing," implemented by Sprint 49 (`NEXUS-RAT-2026-07-15-008`) and Approved (`NEXUS-REV-2026-07-15-006`, fully closed with zero open findings). During Sprint 50's planning, the Sprint Owner selected Concurrent Session Coordination from Milestone 8's remaining candidate scope (Multi-Agent Engineering Orchestration, Concurrent Session Coordination); RFC-0004 was amended to v1.9 (`NEXUS-RAT-2026-07-15-009`) to add "Concurrent Session Coordination," implemented by Sprint 50 (`NEXUS-RAT-2026-07-15-010`) and Approved (`NEXUS-REV-2026-07-15-007`, fully closed with zero open findings). Following Sprint 50's closure, the planner found no existing normative definition of Multi-Agent Engineering Orchestration anywhere in RFC-0004, the Kernel Canon, or `knowledge/reference/`; the Sprint Owner selected a combined scope — Mission Engineering Grouping and cross-role Handoff — as Milestone 8's concluding capability. RFC-0004 was amended to v1.10 (`NEXUS-RAT-2026-07-15-011`) to add "Multi-Agent Engineering Orchestration Foundation," authorized for implementation as Sprint 51 (`NEXUS-RAT-2026-07-15-012`), which is Current.

Opened by `NEXUS-RAT-2026-07-14-018`, following the RFC-0004 v1.2 amendment (`NEXUS-RAT-2026-07-14-017`) that introduced `Engineering Session` — the Kernel-owned runtime boundary for one span of AI-assisted engineering work, distinct from and containing zero or more of RFC-0004's existing, unmodified `Execution Session` records. Sprint 39 — Engineering Sessions Foundation is Milestone 8's opening Sprint, implementing `EngineeringSession`/`EngineeringSessionId`/`EngineeringSessionStatus`/`EngineeringSessionService` as a foundation-only vertical slice. Sprint 51 — Multi-Agent Engineering Orchestration Foundation is designated Milestone 8's concluding Sprint per `NEXUS-RAT-2026-07-15-012`; upon its Approval with zero open findings, Milestone 8 SHALL be considered Complete.

## Sprint 39 — Engineering Sessions Foundation

Status: Approved — NEXUS-REV-2026-07-14-017

Objective

Introduce the Kernel-owned `EngineeringSession` domain concept authorized by RFC-0004 v1.2 (`NEXUS-RAT-2026-07-14-017`): the runtime boundary for one span of AI-assisted engineering work, distinct from RFC-0004's existing, unimplemented `Execution Session`. Establishes session identity, lifecycle, persistence, and diagnostics only; introduces no orchestration.

RFC Coverage

- RFC-0004 — Execution Model v1.2 (Primary; new "Engineering Session" section)
- Referenced: RFC-0010 — Kernel Boundaries

Ratification

- `NEXUS-RAT-2026-07-14-018` — governs this Sprint's entire scope: Authorized Builder Scope, Explicitly Deferred list, and scope restrictions.
- `NEXUS-RAT-2026-07-14-017` — the RFC-0004 v1.2 amendment (Engineering Session, containment relationship over Execution Session, Architectural Responsibilities) this Sprint implements.
- `NEXUS-RAT-2026-07-14-011` — the ratification naming Milestone 8's candidate scope, now opened by `NEXUS-RAT-2026-07-14-018`.

Authorized Vertical Slice

- `EngineeringSession` Kernel domain concept with `EngineeringSessionId`, `EngineeringSessionStatus` deterministic lifecycle, and the RFC-0004 v1.2 Architectural Responsibilities (engineering runtime context, active engineering workflow reference, participating Engineering Roles, workflow state, session timeline, session diagnostics, collaboration metadata) at foundation-level detail only.
- Session repository contract and in-memory implementation, mirroring existing Kernel repository patterns.
- `EngineeringSessionService` for session creation, lifecycle transition, lookup, and enumeration through constructor-injected repository contracts — thin orchestration only.
- `createKernelServices` composition updated to construct and register the Session repository and `EngineeringSessionService`.
- Unit tests for the domain concept, lifecycle, repository, and service.

Deferred Concepts

- Workflow Chaining, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration.
- Automatic workflow advancement, session recovery/checkpointing, concurrent session coordination.
- `ExecutionSession` implementation (RFC-0004's existing, narrower concept remains unimplemented and out of scope).
- Any `src/hosts` or `src/adapters` change.

Definition of Done

- `EngineeringSession` is the only new normative architectural concept introduced by Sprint 39.
- No existing Kernel Execution-domain file (`ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, `ExecutionStrategy`) is modified.
- No `src/hosts` or `src/adapters` file is modified.
- `EngineeringSessionService` remains thin orchestration; business rules remain within the `EngineeringSession` domain concept.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0039-engineering-sessions-foundation.md` for the complete Sprint Implementation Record.

Implementation Result

- Builder implementation completed the authorized Engineering Sessions Foundation vertical slice.
- `EngineeringSession`, `EngineeringSessionId`, `EngineeringSessionStatus`, `IEngineeringSessionRepository`/`InMemoryEngineeringSessionRepository`, and `EngineeringSessionService` were implemented as Kernel-only execution-domain code.
- `createKernelServices()` composes `EngineeringSessionService` through an in-memory session repository.
- Workflow Chaining, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration, automatic workflow advancement, session recovery/checkpointing, concurrent session coordination, and `ExecutionSession` implementation remain deferred pending future ratification.
- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-14-017`). One Category 6 Observation (F-001, composition property verified indirectly rather than by a standalone test) was recorded; it generates no Builder Task and does not affect approval. See `REVIEW_HISTORY.md` and the Sprint Implementation Record for details.

## Sprint 40 — Execution Session Foundation

Status: Approved with Findings — NEXUS-REV-2026-07-14-018

Objective

Implement RFC-0004's existing, unmodified `Execution Session` concept — the immutable record of one coordinated execution attempt (assigned role, assigned adapter, execution timestamps, consumed Projection version, produced artifacts, execution outcome) — as a Kernel domain concept owned by, and associated with, exactly one `EngineeringSession`.

RFC Coverage

- RFC-0004 — Execution Model v1.2 (Primary; existing "Execution Session" section, unmodified by this Sprint)
- Referenced: RFC-0010 — Kernel Boundaries

Ratification

- `NEXUS-RAT-2026-07-14-019` — governs this Sprint's entire scope: Authorized Builder Scope, four Sprint Owner Refinements, Explicitly Deferred list, and scope restrictions.
- `NEXUS-RAT-2026-07-14-018` — Sprint 39's ratification; establishes `EngineeringSession`, the aggregate this Sprint's `ExecutionSession` is owned by.

Authorized Vertical Slice

- `ExecutionSession` immutable, append-only Kernel domain concept with `ExecutionSessionId`, recording assigned Execution Role, assigned Adapter, execution timestamps, consumed Projection version, produced artifacts, and execution outcome, exactly per RFC-0004's existing "Execution Session" section.
- A required, immutable owning-`EngineeringSessionId` reference on every `ExecutionSession` (Refinement 4): every `ExecutionSession` SHALL belong to exactly one `EngineeringSession` and SHALL NOT exist independently of one, enforced at construction and the repository layer.
- `ExecutionSession` repository contract and in-memory implementation, mirroring existing Kernel repository patterns, including lookup/enumeration scoped by owning `EngineeringSessionId`.
- Thin `ExecutionSessionService` (create/lookup/enumerate only) through constructor-injected repository contracts — no dispatch, no Assignment Policy evaluation, no Task lifecycle transition, no workflow coordination (Refinement 2).
- `createKernelServices` composition updated to construct and register the `ExecutionSession` repository and `ExecutionSessionService`.
- Unit tests covering aggregate construction/immutability/append-only behavior, deterministic and reproducible state for equivalent inputs (Refinement 3), the ownership invariant (Refinement 4), the repository, and the service.

Deferred Concepts

- Workflow Chaining, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration.
- Automatic workflow advancement, session recovery/checkpointing, concurrent session coordination.
- Adapter dispatch, execution-eligibility determination, Task lifecycle transition, and all orchestration behavior.
- Any `src/hosts` or `src/adapters` change.

Definition of Done

- `ExecutionSession` is the only new normative architectural concept introduced by Sprint 40.
- Neither `EngineeringSession` nor `ExecutionSession` mutates the other's internal state; `EngineeringSession` owns only the containment association (Refinement 1).
- `ExecutionSessionId` is immutable; `ExecutionSession` records are append-only and never modified after creation; equivalent inputs always produce equivalent state (Refinement 3).
- Every `ExecutionSession` belongs to exactly one `EngineeringSession`; construction without a valid owning `EngineeringSessionId` is rejected (Refinement 4).
- No existing Kernel Execution/Mission-domain file (`EngineeringSession`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, `ExecutionStrategy`, `Task`, `TaskId`) is modified beyond the one authorized `createKernelServices` composition touch point.
- No `src/hosts` or `src/adapters` file is modified.
- `ExecutionSessionService` remains thin orchestration; implements no dispatch, Assignment Policy, or orchestration behavior.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0040-execution-session-foundation.md` for the complete Sprint Implementation Record.

Implementation Result

- Builder implementation completed the authorized Execution Session Foundation vertical slice.
- `ExecutionSession`, `ExecutionSessionId`, `IExecutionSessionRepository`/`InMemoryExecutionSessionRepository`, and `ExecutionSessionService` were implemented as Kernel-only execution-domain code.
- `createKernelServices()` composes `ExecutionSessionService` through an in-memory execution-session repository.
- Adapter dispatch, execution-eligibility determination, Assignment Policy evaluation, Task lifecycle transition, workflow coordination, Workflow Chaining, Review-Gated Progression, Multi-Agent Engineering Orchestration, automatic workflow advancement, session recovery/checkpointing, concurrent session coordination, and Host/Adapter consumption remain deferred pending future ratification.
- Repository validation passed with `npm run validate`; extension-host test bundle build passed with `npm run test:extension-host:build`.
- Reviewer validation complete: **Approved with Findings** (`NEXUS-REV-2026-07-14-018`). One Category 1 Minor finding (F-001, unused `ExecutionSessionMetadata` type in `execution-session.types.ts`) was recorded; it generates a non-blocking Builder Task via `nexus-sprint` and does not affect approval. See `REVIEW_HISTORY.md` and the Sprint Implementation Record for details.
- Both findings (F-001, F-002) were remediated and independently verified Completed (`NEXUS-REV-2026-07-14-019`). Sprint 40 is fully closed with zero open findings.

## Sprint 41 — Workflow Chaining Foundation

Status: Approved — NEXUS-REV-2026-07-14-020

Objective

Implement RFC-0004 v1.3's `WorkflowChain` — the Kernel-owned, immutable definition of an ordered engineering workflow (chain identity, ordered `WorkflowStep`s each referencing an Execution Role, workflow topology) — as a standalone Kernel domain concept, wholly independent of `EngineeringSession` and `ExecutionSession`.

RFC Coverage

- RFC-0004 — Execution Model v1.3 (Primary; new "Workflow Chaining" section)
- Referenced: RFC-0010 — Kernel Boundaries

Ratification

- `NEXUS-RAT-2026-07-14-021` — governs this Sprint's entire scope: Authorized Builder Scope, two Sprint Owner Refinements, Explicitly Deferred list, and scope restrictions.
- `NEXUS-RAT-2026-07-14-020` — the RFC-0004 v1.3 amendment (Workflow Chaining) this Sprint implements.

Authorized Vertical Slice

- `WorkflowChain` immutable Kernel domain concept with `WorkflowChainId` and an ordered list of `WorkflowStep`s, exactly per RFC-0004 v1.3's "Workflow Chaining" section. No mutation method of any kind after construction (Refinement 1).
- `WorkflowStep` value object referencing exactly one Execution Role via the existing `RoleId`; no reference to `EngineeringSession`, `ExecutionSession`, Adapter, Assignment Policy, or `EngineeringRoleProfile` in any form (Refinement 2).
- `IWorkflowChainRepository` and in-memory implementation, mirroring existing Kernel repository patterns — create/lookup/enumerate only.
- Thin `WorkflowChainService` (create/lookup/enumerate only) through constructor-injected repository contracts — no dispatch, no advancement, no Assignment Policy, no Engineering Session wiring.
- `createKernelServices` composition updated to construct and register the `WorkflowChain` repository and `WorkflowChainService`.
- Unit tests covering aggregate construction/immutability/no-mutation-method, `WorkflowStep` boundary constraints, the repository, and the service.

Deferred Concepts

- `EngineeringSession` → `WorkflowChain` wiring (active-chain reference, current workflow position).
- Automatic workflow advancement, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing, concurrent session coordination.
- Any `src/hosts` or `src/adapters` change.

Definition of Done

- `WorkflowChain` is the only new normative architectural concept introduced by Sprint 41.
- `WorkflowChain` is immutable after creation; topology and ordered steps cannot be modified; a changed definition requires a new `WorkflowChain` instance (Refinement 1).
- Every `WorkflowStep` references exactly one Execution Role via `RoleId`; no `WorkflowStep` references `EngineeringSession`, `ExecutionSession`, Adapter, Assignment Policy, or `EngineeringRoleProfile` (Refinement 2).
- No existing Kernel Execution/Mission-domain file (`EngineeringSession`, `ExecutionSession`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, `ExecutionStrategy`, `Task`, `TaskId`) is modified beyond the one authorized `createKernelServices` composition touch point.
- No `src/hosts` or `src/adapters` file is modified.
- `WorkflowChainService` remains thin orchestration; implements no dispatch, advancement, or Assignment Policy behavior.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0041-workflow-chaining-foundation.md` for the complete Sprint Implementation Record.

Implementation Result

- Builder implementation completed the authorized Workflow Chaining Foundation vertical slice.
- `WorkflowChain`, `WorkflowChainId`, `WorkflowStep`, `IWorkflowChainRepository`/`InMemoryWorkflowChainRepository`, and `WorkflowChainService` were implemented as Kernel-only execution-domain code.
- `createKernelServices()` composes `WorkflowChainService` through an in-memory workflow-chain repository.
- `EngineeringSession` to `WorkflowChain` wiring, automatic workflow advancement, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration, session recovery/checkpointing, concurrent session coordination, Host integration, and Adapter integration remain deferred pending future ratification.
- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-14-020`). No findings were recorded.

## Sprint 42 — Engineering Session Workflow Chain Wiring

Status: Approved with Findings — NEXUS-REV-2026-07-14-021

Objective

Introduce immutable `WorkflowChain` binding into `EngineeringSession`: an `EngineeringSession` SHALL reference exactly one active `WorkflowChain` and exactly one current `WorkflowStep`, established only at `EngineeringSession` creation. This Sprint introduces structural runtime binding only; no workflow progression semantics are introduced.

RFC Coverage

- RFC-0004 — Execution Model v1.3 (Primary; existing "Engineering Session" § Architectural Responsibilities, already amended by `NEXUS-RAT-2026-07-14-020` to assign this ownership; unmodified by this Sprint)
- Referenced: RFC-0010 — Kernel Boundaries

Ratification

- `NEXUS-RAT-2026-07-14-022` — governs this Sprint's entire scope: Authorized Builder Scope, four Sprint Owner Refinements, Explicitly Deferred list, and scope restrictions.
- `NEXUS-RAT-2026-07-14-021` — Sprint 41's ratification; establishes `WorkflowChain`/`WorkflowStep`, consumed read-only and unmodified by this Sprint.
- `NEXUS-RAT-2026-07-14-020` — the RFC-0004 v1.3 amendment this Sprint implements.

Authorized Concepts

- `EngineeringSession.workflowChainId` and `EngineeringSession.currentWorkflowStepId`, both immutable and populated only at construction.
- Binding validation within `EngineeringSession` construction: rejects null/nonexistent `WorkflowChain` references, null/nonexistent `WorkflowStep` references, and a `WorkflowStep` that does not belong to the bound `WorkflowChain`.
- `IEngineeringSessionRepository`/`InMemoryEngineeringSessionRepository` persistence extended to carry the new fields.
- `EngineeringSessionService` creation path extended to validate and persist the binding — no new operation changes it after creation.
- `createKernelServices` composition updated only as strictly required to supply `IWorkflowChainRepository` for read-only lookup during `EngineeringSession` construction.

Deferred Concepts

- Workflow advancement (manual or automatic), event-driven advancement, Review-Gated Progression, Assignment Policy.
- Workflow completion, branching, restart, or replacement.
- Multi-Agent Engineering Orchestration, session recovery/checkpointing, concurrent session coordination.
- Any `src/hosts` or `src/adapters` change.
- Any modification to `WorkflowChain`, `WorkflowStep`, `ExecutionSession`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, or `ExecutionStrategy`.

Definition of Done

- The `EngineeringSession` → `WorkflowChain` binding is the only new normative capability introduced by Sprint 42.
- Binding occurs only at `EngineeringSession` construction; neither the `WorkflowChain` nor `WorkflowStep` reference changes afterward.
- `EngineeringSession` owns the binding and its validation, including that the bound `WorkflowStep` belongs to the bound `WorkflowChain`; `WorkflowChain`/`WorkflowStep` are unmodified.
- No workflow progression semantics of any kind are introduced.
- Construction deterministically rejects each invalid-binding case; equivalent inputs produce equivalent runtime state.
- No existing Kernel Execution/Mission-domain file is modified beyond `EngineeringSession`'s own files and the one authorized `createKernelServices` composition touch point.
- No `src/hosts` or `src/adapters` file is modified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0042-engineering-session-workflow-chain-wiring.md` for the complete Sprint Implementation Record.

Implementation Result

- Builder implementation completed the authorized Engineering Session Workflow Chain Wiring vertical slice.
- `EngineeringSession` now carries required immutable `workflowChainId` and `currentWorkflowStepId` snapshot fields populated only at creation.
- `EngineeringSession` validates the binding against a read-only `WorkflowChain` supplied through `EngineeringSessionService`, including nonexistent chain/step rejection and Step/Chain membership validation.
- `IEngineeringSessionRepository` / `InMemoryEngineeringSessionRepository` persist and reconstitute the new binding fields through existing snapshot storage.
- `createKernelServices()` supplies the existing in-memory `WorkflowChain` repository to `EngineeringSessionService` without modifying `WorkflowChainService`.
- Workflow advancement, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration, session recovery/checkpointing, concurrent session coordination, Host integration, and Adapter integration remain deferred pending future ratification.
- Reviewer validation complete: **Approved with Findings** (`NEXUS-REV-2026-07-14-021`). One Major finding (F-001, `currentWorkflowStepId`'s role-based representation cannot address a repeated-role `WorkflowChain` position) was recorded; it generated a non-blocking Builder Task via `nexus-sprint` and did not require Sprint Owner ratification to correct.
- TASK-001 remediated `currentWorkflowStepId` to a validated, canonical zero-based position string (bounds-checked against the bound `WorkflowChain`'s step count), resolving the repeated-role ambiguity without modifying `WorkflowChain` or `WorkflowStep`. Completed and independently verified (`NEXUS-REV-2026-07-14-022`). Sprint 42 is fully closed with zero open findings.
- No further Milestone 8 Sprint is currently planned to advance to Current; the next Milestone 8 direction (Assignment Policy, Review-Gated Progression, Multi-Agent Orchestration, or automatic workflow advancement) requires its own future Sprint Owner scope ratification via `nexus-plan`.

---

## Sprint 43 — Engineering Session Manual Workflow Advancement

Status: ✅ Approved — NEXUS-REV-2026-07-14-023

Objective

Introduce deterministic manual workflow progression within an already-bound `EngineeringSession`, extending the runtime model established in Sprint 42 by allowing explicit advancement from the current `WorkflowStep` to the next `WorkflowStep` in the bound `WorkflowChain`. Progression SHALL remain explicit, deterministic, and caller-invoked. No orchestration behavior is introduced.

RFC Coverage

Primary

- RFC-0004 v1.3 — Execution Model (`EngineeringSession`, `WorkflowChain`, `WorkflowStep` — existing, unmodified)

Referenced

- RFC-0010 — Kernel Boundaries

No RFC ownership changes are authorized.

Ratification

- `NEXUS-RAT-2026-07-14-023` — governs this Sprint's entire scope: Authorized Builder Scope, five Sprint Owner Refinements, Explicitly Deferred list, and scope restrictions.
- `NEXUS-RAT-2026-07-14-022` — Sprint 42's ratification; establishes the `workflowChainId`/`currentWorkflowStepId` binding this Sprint advances.
- `NEXUS-RAT-2026-07-14-021` / `NEXUS-RAT-2026-07-14-020` — establish `WorkflowChain`/`WorkflowStep` and the RFC-0004 v1.3 amendment; both unmodified by this Sprint.

Architectural Responsibilities (binding, from `NEXUS-RAT-2026-07-14-023`)

| Concern | Owner |
| --- | --- |
| Current `WorkflowStep`, validation of workflow progression, transition to the next `WorkflowStep`, workflow completion detection | `EngineeringSession` (this Sprint) |
| Immutable workflow definition, workflow topology, ordered `WorkflowStep`s | `WorkflowChain` (Sprint 41, unmodified) |
| Workflow identity, execution ordering, associated `ExecutionRole` | `WorkflowStep` (Sprint 41, unmodified) |
| Orchestration, repository interaction, persistence for `advanceWorkflow()` | `EngineeringSessionService` (extended this Sprint; no Assignment Policy, Review Gate, or orchestration-rule evaluation) |
| Assignment Policy, Review-Gated Progression, Adapter dispatch, `ExecutionStrategy` invocation, orchestration events triggered by completion | Future, separately-ratified Milestone 8 Sprints |

Authorized Vertical Slice

- An explicit `advanceWorkflow()` operation on `EngineeringSession` (and its orchestration counterpart on `EngineeringSessionService`) that deterministically advances `currentWorkflowStepId` to exactly the next `WorkflowStep` in the bound `WorkflowChain`'s ordered steps — exactly one step per invocation; no multi-step, skip, or batch advancement.
- Workflow completion detection: a read-only signal indicating the `EngineeringSession` has reached the bound `WorkflowChain`'s terminal `WorkflowStep`. Completion is state only — it SHALL NOT complete the `EngineeringSession`, trigger Assignment Policy, trigger Review-Gated Progression, dispatch Adapters, invoke `ExecutionStrategy`, or publish orchestration events.
- Validation rejecting: advancement with no bound `WorkflowChain`; advancement from an invalid current `WorkflowStep`; advancement beyond the terminal `WorkflowStep`; a `WorkflowStep` reference not belonging to the bound `WorkflowChain`.
- `IEngineeringSessionRepository` / `InMemoryEngineeringSessionRepository` persistence updated to carry the advanced position through snapshot/reconstitution, mirroring the existing pattern.
- `createKernelServices` composition updated only as strictly required to support the above.
- Unit tests:
  - valid single-step advancement;
  - rejection of advancement beyond the terminal `WorkflowStep`;
  - rejection of advancement from an invalid current `WorkflowStep`;
  - rejection of advancement with no bound `WorkflowChain`;
  - workflow completion detection at the terminal step;
  - deterministic construction (equivalent inputs produce equivalent outcomes);
  - repository persistence/reconstitution of the advanced position;
  - service orchestration of the validated advancement path (success and each rejection case);
  - a composition assertion that `createKernelServices()` continues to compose all existing services without alteration beyond what this Sprint authorizes.

Deferred Concepts

- Automatic workflow advancement.
- Event-driven advancement.
- Assignment Policy.
- Review-Gated Progression.
- Workflow branching, restart, or replacement.
- Concurrent workflow execution.
- Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing.
- Any `src/hosts` or `src/adapters` change.
- Any modification to `WorkflowChain`, `WorkflowChainId`, `WorkflowStep`, `IWorkflowChainRepository`, `InMemoryWorkflowChainRepository`, `WorkflowChainService`, `ExecutionSession`, `ExecutionSessionId`, `ExecutionSessionService`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, or `ExecutionStrategy`.

Definition of Done

- `advanceWorkflow()` is the only new normative capability introduced by Sprint 43, advancing exactly one `WorkflowStep` per invocation.
- `EngineeringSession` owns progression, its validation, and workflow completion detection; `WorkflowChain`/`WorkflowStep` remain immutable, read-only, and unmodified.
- Workflow completion is state only; no Assignment Policy, Review-Gated Progression, Adapter dispatch, `ExecutionStrategy` invocation, or orchestration event is triggered by reaching the terminal step.
- Construction/advancement deterministically rejects each invalid case; equivalent inputs produce equivalent outcomes.
- No existing Kernel Execution/Mission-domain file is modified beyond `EngineeringSession`'s own files and the one authorized `createKernelServices` composition touch point.
- No `src/hosts` or `src/adapters` file is modified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0043-engineering-session-manual-workflow-advancement.md` for the complete Sprint Implementation Record.

Implementation Result

- Builder implementation completed the authorized Engineering Session Manual Workflow Advancement vertical slice.
- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-14-023`). Zero findings requiring Builder action; two non-blocking Category 6 Observations recorded (service-level exposure of `isWorkflowComplete()`; reuse of the existing `InvalidEngineeringSessionDefinitionError` for advancement-time rejections). Sprint 43 is fully closed with zero open findings.
- No further Milestone 8 Sprint is currently planned to advance to Current; the next Milestone 8 direction (Assignment Policy, Review-Gated Progression, Multi-Agent Orchestration, or automatic/event-driven workflow advancement) requires its own future Sprint Owner scope ratification via `nexus-plan`.

---

## Sprint 44 — Assignment Policy Foundation

Status: Approved — NEXUS-REV-2026-07-14-024

Objective

Implement RFC-0004's existing "Assignment" and "Assignment Policy" sections as a standalone, deterministic Kernel domain concept: an `AssignmentPolicy` aggregate and supporting value objects representing assignment requirements (required role, Adapter/execution capability, repository configuration, execution constraints, and human preferences), with validation and deterministic policy evaluation. Establishes the canonical assignment model that future, separately-ratified Sprints may wire into workflow progression and multi-agent execution. No integration with `EngineeringSession`, `ExecutionSession`, or `WorkflowChain` is introduced.

RFC Coverage

Primary

- RFC-0004 — Execution Model v1.3 (existing "Assignment" and "Assignment Policy" sections, unmodified by this Sprint)

Referenced

- RFC-0010 — Kernel Boundaries

No RFC ownership changes are authorized.

Ratification

- `NEXUS-RAT-2026-07-14-024` — governs this Sprint's entire scope: Authorized Builder Scope, four Sprint Owner Refinements, Explicitly Deferred list, and scope restrictions.

Authorized Vertical Slice

- `AssignmentPolicy` immutable Kernel domain concept with `AssignmentPolicyId` and immutable value objects for exactly the five RFC-0004-named assignment-requirement factors: required role (via the existing `RoleId`), Adapter/execution capability, repository configuration, execution constraints, and human preferences.
- A deterministic policy-evaluation operation on `AssignmentPolicy` that is a pure function of its stated inputs; equivalent inputs produce equivalent outcomes; no dispatch or side effect.
- `IAssignmentPolicyRepository` contract and in-memory implementation for creation, lookup, and enumeration only, mirroring existing Kernel repository patterns.
- Thin `AssignmentPolicyService` for creation, lookup, enumeration, and policy evaluation only, through constructor-injected repository contracts — no dispatch, no wiring, no orchestration.
- `createKernelServices` composition updated only as strictly required to construct and register the `AssignmentPolicy` repository and service.
- Unit tests covering: aggregate construction and immutability; each assignment-requirement value object's validation; deterministic policy evaluation for equivalent inputs; the repository; and the service.

Deferred Concepts

- `EngineeringSession` / `WorkflowChain` / `ExecutionSession` wiring of `AssignmentPolicy`.
- Runtime dispatch, Adapter selection, or Adapter invocation driven by policy evaluation.
- Review-Gated Progression.
- Multi-Agent Engineering Orchestration.
- Automatic or event-driven workflow advancement.
- Session recovery/checkpointing.
- Concurrent session/workflow coordination.
- Any `src/hosts` or `src/adapters` change.

Definition of Done

- `AssignmentPolicy` is the only new normative architectural concept introduced by Sprint 44.
- `AssignmentPolicy` is wholly independent of `EngineeringSession`, `ExecutionSession`, `WorkflowChain`, and `WorkflowStep`; none of them are modified or referenced.
- `AssignmentPolicy` represents exactly the five RFC-0004-named assignment-requirement factors, no more.
- Policy evaluation is a pure, deterministic function of its inputs; equivalent inputs always produce equivalent outcomes; no dispatch or side effect is introduced.
- `AssignmentPolicyService` remains thin orchestration; implements no dispatch, wiring, or orchestration behavior.
- No `src/hosts` or `src/adapters` file is modified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0044-assignment-policy-foundation.md` for the complete Sprint Implementation Record.

Implementation Result

- Builder implementation completed the authorized Assignment Policy Foundation vertical slice.
- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-14-024`). Zero findings of any category; full Vitest suite (74 files / 347 tests), `tsc --noEmit`, ESLint, `npm run build`, and `npm run test:extension-host:build` all pass cleanly. Sprint 44 is fully closed with zero open findings.
- RFC-0004 was amended to v1.4 (`NEXUS-RAT-2026-07-14-025`) following this Sprint's closure, introducing the generalized Workflow Advancement model. Sprint 45 — Automatic/Event-Driven Workflow Advancement (`NEXUS-RAT-2026-07-14-026`) is now Current.

---

## Sprint 45 — Automatic/Event-Driven Workflow Advancement

Status: Approved — NEXUS-REV-2026-07-14-026 (fully closed, zero open findings)

Objective

Implement RFC-0004 v1.4's Automatic/Event-Driven Advancement Strategy as a synchronous, deterministic extension of `EngineeringSession`'s existing Manual Advancement capability (Sprint 43), introducing a producer-independent `AdvancementTrigger` domain concept. No Event Bus subscription, scheduling, or asynchronous behavior is introduced; no wiring to `ExecutionSession`, `Review`, or `AssignmentPolicy` is introduced.

RFC Coverage

Primary

- RFC-0004 v1.4 — Execution Model ("Workflow Advancement" section, Automatic/Event-Driven Advancement Strategy)

Referenced

- RFC-0004 v1.4 — "Engineering Session" (existing, unmodified)
- RFC-0010 — Kernel Boundaries

No RFC ownership changes are authorized.

Ratification

- `NEXUS-RAT-2026-07-14-026` — Sprint 45 scope ratification: governs this Sprint's entire scope, four Sprint Owner Refinements, Explicitly Deferred list, and scope restrictions.
- `NEXUS-RAT-2026-07-14-025` — the companion RFC-0004 v1.4 amendment naming and defining the Workflow Advancement model.

Authorized Vertical Slice

- Immutable, producer-independent `AdvancementTrigger` value object.
- New `EngineeringSession` operation accepting an `AdvancementTrigger`, evaluating Advancement Eligibility using Sprint 43's existing validated logic, and producing the same Advancement Result/Failure outcomes as `advanceWorkflow()`.
- Corresponding thin `EngineeringSessionService` orchestration operation, mirroring the existing `advanceWorkflow()` service method.
- Exactly one synchronous trigger-submission path; no Event Bus, scheduling, or asynchronous behavior.
- Unit tests covering trigger validation, eligible/ineligible advancement, determinism, and regression-safety of Sprint 43's existing behavior.

Deferred Concepts

- `ExecutionSession`-completion-driven or other concrete domain-event-driven trigger producers.
- Event Bus integration or subscription for `EngineeringSession`.
- Review-Gated Advancement and its Review Outcome gating semantics.
- Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing.
- Concurrent session/workflow coordination.
- Any `src/hosts` or `src/adapters` change.

Definition of Done

- `AdvancementTrigger` is the only new normative architectural concept introduced by Sprint 45.
- `AdvancementTrigger` contains no "caller"/producer framing in its domain semantics.
- No Event Bus subscription, scheduling, background processing, or asynchronous behavior is introduced.
- The Automatic/Event-Driven Advancement Strategy reuses Sprint 43's existing Advancement Eligibility/Result/Failure semantics verbatim; no second validation path is introduced.
- No reference from the new concepts to `ExecutionSession`, `Review`, `AssignmentPolicy`, Adapter dispatch, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, or `ExecutionStrategy`.
- `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, and Sprint 43's existing `advanceWorkflow()`/`isWorkflowComplete()` remain unmodified.
- No `src/hosts` or `src/adapters` file is modified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

Builder Implementation Result

- Implemented the authorized synchronous Automatic/Event-Driven Advancement Strategy entry point.
- Added `AdvancementTrigger` as an immutable, producer-independent value object containing a deterministic advancement fact and optional metadata only.
- Added `EngineeringSession.advanceWorkflowOnTrigger()` as the trigger-accepting aggregate operation, reusing Sprint 43's existing `advanceWorkflow()` eligibility/result/failure behavior.
- Added `EngineeringSessionService.advanceWorkflowOnTrigger()` as repository lookup, trigger construction, aggregate delegation, and persistence only.
- Added focused unit coverage for trigger validation, eligible and ineligible trigger advancement, deterministic equivalent-trigger behavior, service orchestration, and Kernel composition continuity.
- No Event Bus subscription, scheduling, background processing, Host change, Adapter change, or cross-domain wiring was introduced.

See `knowledge/implementation/sprints/sprint-0045-automatic-event-driven-workflow-advancement.md` for the complete Sprint Implementation Record.

Reviewer Validation Result

- Reviewer validation complete: **Approved with Findings** (`NEXUS-REV-2026-07-14-025`). One Minor, non-blocking finding (F-001 — dead `trigger.toSnapshot()` statement in `EngineeringSession.advanceWorkflowOnTrigger()`, Gate 10 dead-code); full Vitest suite (75 files / 354 tests), `tsc --noEmit`, ESLint, `npm run build`, and `npm run test:extension-host:build` all pass cleanly.
- `TASK-001` remediation of F-001 verified (`NEXUS-REV-2026-07-14-026`): dead statement removed; only `engineering-session.ts` changed; all tests pass unmodified. Sprint 45 is now fully closed with zero open findings.
- RFC-0004 was amended to v1.5 (`NEXUS-RAT-2026-07-15-001`) following this Sprint's closure, defining Review-Gated Advancement's Blocking/Non-Blocking Review Outcome gating semantics. Sprint 46 — Review-Gated Workflow Advancement (`NEXUS-RAT-2026-07-15-002`) implemented that Strategy and is Approved with Findings (`NEXUS-REV-2026-07-15-001`).

---

## Sprint 46 — Review-Gated Workflow Advancement

Status: Approved with Findings — `NEXUS-REV-2026-07-15-001` (one Minor, non-blocking Category 6 Observation; zero open Builder Tasks)

Objective

Implement RFC-0004 v1.5's Review-Gated Advancement Strategy by introducing an `EngineeringSession` advancement operation that consumes an already-finalized `ReviewOutcome`, determines advancement eligibility using the ratified Blocking/Non-Blocking classification (`NEXUS-RAT-2026-07-15-001`), and advances the current workflow position only when the supplied `ReviewOutcome` is classified as Non-Blocking. The Sprint SHALL NOT evaluate, calculate, reinterpret, or modify `ReviewOutcome`; `ReviewOutcome` remains exclusively owned by RFC-0006; this Sprint only consumes the final `ReviewOutcome` as immutable input.

RFC Coverage

Primary

- RFC-0004 v1.5 — Execution Model ("Workflow Advancement" § Review-Gated Advancement)

Referenced

- RFC-0006 — Engineering Assessment Model (`ReviewOutcome` consumed as immutable, read-only input; RFC-0006 unmodified)
- RFC-0010 — Kernel Boundaries

No RFC ownership changes are authorized.

Ratification

- `NEXUS-RAT-2026-07-15-002` — Sprint 46 scope ratification: governs this Sprint's entire scope, the binding Objective refinement, the binding Architectural Responsibilities split, and scope restrictions.
- `NEXUS-RAT-2026-07-15-001` — the companion RFC-0004 v1.5 amendment defining the Blocking/Non-Blocking Review Outcome classification this Sprint consumes.

Architectural Responsibilities (binding, from `NEXUS-RAT-2026-07-15-002`)

| Concern | Owner |
| --- | --- |
| Review lifecycle, Review evaluation, `ReviewOutcome` determination | RFC-0006 / `ReviewService` (unmodified) |
| Advancement eligibility, Blocking/Non-Blocking classification, workflow position advancement | RFC-0004 (this Sprint, consuming `NEXUS-RAT-2026-07-15-001`) |

Authorized Vertical Slice

- A new `EngineeringSession` operation accepting an already-finalized `ReviewOutcome` (or a reference resolved via existing, unmodified `ReviewService` lookup) as immutable input, classifying it using the ratified Blocking/Non-Blocking semantics, and reusing Sprint 43's existing Advancement Eligibility, Advancement Result, and Advancement Failure semantics unchanged, extended only by the Review-Gated eligibility check.
- A corresponding thin `EngineeringSessionService` orchestration operation, mirroring Sprint 45's pattern (repository lookup, aggregate delegation, persistence only).
- Unit/integration tests covering: Non-Blocking outcome advancement (Accepted, Accepted With Observations); Blocking outcome rejection (Action Required, Rejected) producing an Advancement Failure with no state change; determinism; regression-safety of Sprint 43's and Sprint 45's existing behavior.

Deferred Concepts

- Event Bus-driven or other automatic Review-completion-triggered advancement.
- Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing.
- Concurrent session/workflow coordination.
- Any `ReviewService` write operation, Review lifecycle modification, or Review state persistence from within `EngineeringSession`/`EngineeringSessionService`.
- Any `AssignmentPolicy`, `ExecutionSession`, `src/hosts`, or `src/adapters` change.

Definition of Done

- `ReviewOutcome` is treated as immutable input; this Sprint does not modify or persist Review state.
- Advancement preserves Sprint 43's Advancement Eligibility, Result, and Failure semantics unchanged, adding only the Review-Gated eligibility check.
- Existing approved advancement behavior (Sprint 43 Manual Advancement, Sprint 45 Automatic/Event-Driven Advancement) remains byte-for-byte identical for all non-review-gated scenarios.
- `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionSession`, `AssignmentPolicy` remain unmodified.
- No `src/hosts` or `src/adapters` file is modified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0046-review-gated-workflow-advancement.md` for the complete Sprint Implementation Record.

Reviewer Validation Result

- Reviewer validation complete: **Approved with Findings** (`NEXUS-REV-2026-07-15-001`). Confirmed `advanceWorkflowAfterReview()` reuses Sprint 43's `advanceWorkflow()` unchanged, adding only the ratified Review-Gated eligibility check; confirmed `ReviewOutcome` is consumed strictly read-only with no `ReviewService` write path; confirmed `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionSession`, `AssignmentPolicy`, `ReviewService`, `Review`, `Finding`, `src/hosts`, and `src/adapters` are all byte-for-byte unmodified. Independent re-validation confirmed `tsc --noEmit`, ESLint, `npm run validate` (Vitest 75 files / 362 tests, esbuild), and `npm run test:extension-host:build` all pass cleanly.
- One Minor, non-blocking finding recorded: `NEXUS-REV-2026-07-15-001-F-001` — the Blocking/Non-Blocking classification duplicates RFC-0006's `ReviewOutcome` vocabulary as literal strings rather than referencing the canonical `reviewOutcomes` array in `review.types.ts`. Currently correct; generates no Builder Task. Sprint 46 is fully closed with zero open findings requiring action.

---

## Sprint 47 — Workflow Chain Execution

Status: Approved — `NEXUS-REV-2026-07-15-003` (fully closed; `TASK-001` remediation of `NEXUS-REV-2026-07-15-002-F-001` verified; zero open findings)

Objective

Implement RFC-0004 v1.6's Workflow Chain Execution section by introducing a new `EngineeringSession` operation that, at the session's current workflow position, resolves the bound `WorkflowStep`'s `RoleId`, invokes the existing `ExecutionStrategyService` to evaluate execution readiness, dispatches through the existing `AdapterService` using an explicit, caller-supplied `adapterId` (no Adapter Selection), and returns the resulting execution outcome, recording the attempt through the existing, unmodified `ExecutionSession` model. A corresponding thin `EngineeringSessionService` orchestration operation mirrors the existing Sprint 45/46 pattern. This Sprint introduces execution of the current Workflow Step only; it does not fold execution into any existing Advancement operation and does not itself advance the workflow position.

RFC Coverage

Primary

- RFC-0004 v1.6 — Execution Model ("Workflow Chain Execution", new section)

Referenced

- RFC-0004 v1.6 — Execution Model ("Engineering Session", "Workflow Chaining", "Workflow Advancement", "Execution Strategy", "Execution Session" — all existing, unmodified)
- RFC-0008 — Kernel Adapter Contract (`AdapterService.dispatch`, unmodified)
- RFC-0010 — Kernel Boundaries

No RFC ownership changes are authorized beyond `NEXUS-RAT-2026-07-15-003`'s RFC-0004 v1.6 amendment.

Ratification

- `NEXUS-RAT-2026-07-15-004` — Sprint 47 scope ratification: governs this Sprint's entire scope, the binding Objective, the binding Architectural Responsibilities, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-15-003` — the companion RFC-0004 v1.6 amendment defining Workflow Chain Execution this Sprint implements.

Architectural Responsibilities (binding, from `NEXUS-RAT-2026-07-15-004`)

| Concern | Owner |
| --- | --- |
| `ReviewOutcome` determination, Review lifecycle | RFC-0006 / `ReviewService` (unmodified) |
| Workflow Chain structure, `WorkflowStep` topology | `WorkflowChain`/`WorkflowChainService` (Sprint 41, unmodified) |
| Current workflow position, workflow state | `EngineeringSession` (Sprint 39/42/43, unmodified except this Sprint's new execution operation) |
| Execution readiness evaluation | `ExecutionStrategyService.evaluateAssignmentReadiness` (Sprint 10/20, unmodified) |
| Adapter dispatch | `AdapterService.dispatch` (Sprint 7/19/20, unmodified; explicit `adapterId` only) |
| Execution attempt record | `ExecutionSession`/`ExecutionSessionService` (Sprint 40, unmodified) |
| Workflow position advancement (separate from execution) | Manual/Automatic/Review-Gated Advancement (Sprints 43/45/46, unmodified and unaffected) |

Authorized Vertical Slice

- One new `EngineeringSession` operation (e.g. `executeCurrentWorkflowStep`) resolving the current `WorkflowStep`'s `RoleId`, invoking `ExecutionStrategyService` for readiness evaluation, dispatching via `AdapterService.dispatch` with a caller-supplied explicit `adapterId`, and constructing an `ExecutionSession` record through the existing `ExecutionSessionService` to capture the attempt.
- A corresponding thin `EngineeringSessionService` orchestration operation, mirroring Sprint 45/46's pattern (repository lookup, delegation, persistence, snapshot return).
- `createKernelServices` composition updated only as strictly required to supply the additional repository/service contracts this operation reads.
- Unit/integration tests covering: successful execution producing an `ExecutionSession` record; execution readiness rejection; Adapter dispatch failure/non-`Completed` response handling; determinism; regression-safety of Sprint 43/45/46's existing advancement behavior (unaffected by this Sprint).

Deferred Concepts

- Adapter Selection, Adapter routing, capability scoring, or fallback logic — dispatch SHALL use an explicit, caller-supplied `adapterId` only.
- Assignment Policy evaluation.
- Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing.
- Concurrent session/workflow coordination.
- Any modification to `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, or `Finding`.
- Any modification to Sprint 43's `advanceWorkflow()`, Sprint 45's `advanceWorkflowOnTrigger()`, or Sprint 46's `advanceWorkflowAfterReview()`.
- Any `src/hosts` or `src/adapters` change.

Definition of Done

- Execution and Advancement remain separate operations; this Sprint does not fold execution into any existing `advanceWorkflow*` method and does not cause execution to implicitly advance the workflow position.
- `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, and `Finding` remain unmodified.
- Adapter dispatch uses an explicit, caller-supplied `adapterId` only; no Adapter Selection Policy is introduced.
- No `src/hosts` or `src/adapters` file is modified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0047-workflow-chain-execution.md` for the complete Sprint Implementation Record.

Reviewer Validation Result

- Reviewer validation complete: **Approved with Findings** (`NEXUS-REV-2026-07-15-002`). Confirmed `executeCurrentWorkflowStep()` is thin orchestration reusing `ExecutionStrategyService.evaluateAssignmentReadiness`, explicit-`adapterId` `AdapterService.dispatch`, and `ExecutionSessionService.createExecutionSession` unchanged; confirmed `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding`, `src/hosts`, and `src/adapters` are all byte-for-byte unmodified. Independent re-validation confirmed `tsc --noEmit`, ESLint, `npm run validate` (Vitest 75 files / 366 tests, esbuild), and `npm run test:extension-host:build` all pass cleanly.
- One Minor, non-blocking finding recorded: `NEXUS-REV-2026-07-15-002-F-001` — four defensive branches (WorkflowStep-Role/Assignment-Role mismatch check; three `require*Service()` constructor-dependency guards) have no exercising test. Unreachable in the certified Kernel composition today; generated one Builder Task (test-only).
- `TASK-001` remediation verified (`NEXUS-REV-2026-07-15-003`): four test cases added to `engineering-session.service.test.ts` covering exactly the identified branches; no production source file modified; `npm run validate` passes at 75 files / 370 tests. Sprint 47 is fully closed with zero open findings. RFC-0004 was amended to v1.7 (`NEXUS-RAT-2026-07-15-005`) following this Sprint's closure, adding an Assignment Policy Evaluation subsection to Workflow Chain Execution. Sprint 48 — Assignment Policy Integration (`NEXUS-RAT-2026-07-15-006`) is Implemented — Pending Reviewer Validation.

---

## Sprint 48 — Assignment Policy Integration

Status: Approved — `NEXUS-REV-2026-07-15-005` (fully closed; `TASK-001` remediation of `NEXUS-REV-2026-07-15-004-F-001` verified; zero open findings)

Objective

Extend `EngineeringSessionService.executeCurrentWorkflowStep` (Sprint 47) with an optional, deterministic Assignment Policy Evaluation gate per RFC-0004 v1.7: given a caller-supplied Assignment Policy reference and evaluation input, invoke the existing, unmodified Sprint 44 `AssignmentPolicyService.evaluateAssignmentPolicy` — using the resolved current `WorkflowStep`'s `RoleId` as the required-role input — before Adapter dispatch. When unsatisfied, execution is rejected deterministically: no Adapter dispatch, no `ExecutionSession` record. When no Assignment Policy reference is supplied, behavior is byte-for-byte identical to Sprint 47. This Sprint determines Execution Role eligibility only; it introduces no Adapter Selection, routing, or scoring.

RFC Coverage

Primary

- RFC-0004 v1.7 — Execution Model ("Workflow Chain Execution" § Assignment Policy Evaluation, new subsection)

Referenced

- RFC-0004 v1.3 — "Assignment Policy" (existing, unmodified)
- RFC-0004 v1.6 — "Workflow Chain Execution" (Sprint 47, unmodified except for this Sprint's new optional gate)
- RFC-0010 — Kernel Boundaries

No RFC ownership changes are authorized beyond `NEXUS-RAT-2026-07-15-005`'s RFC-0004 v1.7 amendment.

Ratification

- `NEXUS-RAT-2026-07-15-006` — Sprint 48 scope ratification: governs this Sprint's entire scope, the binding Objective, the binding Architectural Responsibilities, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-15-005` — the companion RFC-0004 v1.7 amendment defining Assignment Policy Evaluation this Sprint implements.

Architectural Responsibilities (binding, from `NEXUS-RAT-2026-07-15-006`)

| Concern | Owner |
| --- | --- |
| Assignment Policy value objects, pure evaluation function | `AssignmentPolicy`/`AssignmentPolicyService` (Sprint 44, unmodified) |
| Resolving current Workflow Step's Execution Role; Execution Strategy readiness; Adapter dispatch | `EngineeringSession`/`EngineeringSessionService` (Sprint 47, unmodified except for this Sprint's new optional gate) |
| Assignment Policy Evaluation consumption gating dispatch | `EngineeringSessionService.executeCurrentWorkflowStep` (this Sprint, new optional gate only) |
| Execution attempt record | `ExecutionSession`/`ExecutionSessionService` (Sprint 40, unmodified) |
| Workflow position advancement | Manual/Automatic/Review-Gated Advancement (Sprints 43/45/46, unmodified and unaffected) |

Authorized Vertical Slice

- Extend `ExecuteCurrentWorkflowStepCommand` with an optional Assignment Policy reference and optional evaluation-input fields, mirroring `AssignmentPolicyEvaluationInput`'s existing shape.
- Extend `EngineeringSessionService.executeCurrentWorkflowStep` to invoke `AssignmentPolicyService.evaluateAssignmentPolicy` when a reference is supplied, using the resolved `WorkflowStep`'s `RoleId` as the required-role input, before constructing the Adapter dispatch request.
- Add one new deterministic rejection outcome to `EngineeringSessionWorkflowExecutionStatus` (e.g. `AssignmentPolicyRejected`), mirroring the existing `ReadinessRejected` outcome shape.
- Extend `createKernelServices` composition only as strictly required to supply `AssignmentPolicyService` to `EngineeringSessionService`'s constructor as an optional collaborator.
- Unit/integration tests covering: satisfied policy → execution proceeds unchanged; unsatisfied policy → deterministic rejection with no dispatch and no `ExecutionSession` record; omitted policy reference → Sprint 47 behavior unchanged, byte-for-byte; determinism; regression-safety of Sprint 43/45/46's existing advancement behavior.

Deferred Concepts

- Adapter Selection, Adapter routing, capability scoring, or fallback logic.
- Automatic Assignment Policy binding, inference, or lookup by `WorkflowStep`.
- Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing.
- Concurrent session/workflow coordination.
- Any modification to `AssignmentPolicy`, `AssignmentPolicyService`, `IAssignmentPolicyRepository`, `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, or `Finding`.
- Any modification to Sprint 43's `advanceWorkflow()`, Sprint 45's `advanceWorkflowOnTrigger()`, or Sprint 46's `advanceWorkflowAfterReview()`.
- Any `src/hosts` or `src/adapters` change.

Definition of Done

- `AssignmentPolicy`, `AssignmentPolicyService`, `IAssignmentPolicyRepository` (Sprint 44) remain unmodified.
- `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding` remain unmodified.
- Sprint 43/45/46 advancement methods remain unmodified; execution and advancement stay separate operations.
- No Adapter Selection or role routing is introduced; `adapterId` and the Assignment Policy reference both remain explicit and caller-supplied.
- Policy evaluation reuses Sprint 44's existing pure, deterministic `AssignmentPolicy.evaluate()` verbatim.
- When no Assignment Policy reference is supplied, behavior is byte-for-byte identical to Sprint 47.
- No `src/hosts` or `src/adapters` file is modified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0048-assignment-policy-integration.md` for the complete Sprint Implementation Record.

Reviewer Validation Result

- Reviewer validation complete: **Approved with Findings** (`NEXUS-REV-2026-07-15-004`). Confirmed the Assignment Policy Evaluation gate is thin orchestration reusing Sprint 44's unmodified `AssignmentPolicyService.evaluateAssignmentPolicy`/`AssignmentPolicy.evaluate()`, evaluated after Sprint 47's existing readiness check and strictly before Adapter dispatch/`ExecutionSession` creation; confirmed `AssignmentPolicy`, `AssignmentPolicyService`, `IAssignmentPolicyRepository`, `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding`, the `EngineeringSession` aggregate itself, Sprint 43's/45's/46's advancement methods, and `src/hosts`/`src/adapters` are all byte-for-byte unmodified. Independent re-validation confirmed `tsc --noEmit`, ESLint, `npm run validate` (Vitest 75 files / 374 tests, esbuild), and `npm run test:extension-host:build` all pass cleanly.
- One Minor, non-blocking finding recorded: `NEXUS-REV-2026-07-15-004-F-001` — two new defensive/guard branches (missing `assignmentPolicyEvaluationInput` when `assignmentPolicyId` is supplied; missing `assignmentPolicyService` collaborator when `assignmentPolicyId` is supplied) have no exercising test, directly analogous to Sprint 47's `NEXUS-REV-2026-07-15-002-F-001`. Generated one test-only Builder Task.
- `TASK-001` remediation verified (`NEXUS-REV-2026-07-15-005`): two test cases added to `engineering-session.service.test.ts` covering exactly the two identified branches; no production source file modified; `npm run validate` passes at 75 files / 376 tests. Sprint 48 is fully closed with zero open findings.

---

## Sprint 49 — Session Recovery/Checkpointing Foundation

Status: ✅ Approved — `NEXUS-REV-2026-07-15-006` (fully closed; two Category 6 Observations, zero Builder Tasks; zero open findings).

Objective

Add `EngineeringSessionService.createCheckpoint()`, capturing an Engineering Session's existing `toSnapshot()` state as a named, immutable, timestamped `EngineeringSessionCheckpoint` persisted through a new `IEngineeringSessionCheckpointRepository`, and `EngineeringSessionService.recoverFromCheckpoint()`, reconstituting an `EngineeringSession` from a stored Checkpoint via the existing, unmodified `fromSnapshot()`. Recovery SHALL reconstruct a semantically equivalent Engineering Session, not a byte-for-byte identical one.

RFC Coverage

Primary

- RFC-0004 v1.8 — Execution Model ("Session Recovery/Checkpointing", new section)

Referenced

- RFC-0004 v1.2/v1.3 — "Engineering Session" (Sprints 39/40, unmodified)
- RFC-0010 — Kernel Boundaries

No RFC ownership changes are authorized beyond `NEXUS-RAT-2026-07-15-007`'s RFC-0004 v1.8 amendment.

Ratification

- `NEXUS-RAT-2026-07-15-008` — Sprint 49 scope ratification: governs this Sprint's entire scope, the binding Objective, the binding Architectural Responsibilities, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-15-007` — the companion RFC-0004 v1.8 amendment defining Session Recovery/Checkpointing this Sprint implements.

Architectural Responsibilities (binding, from `NEXUS-RAT-2026-07-15-008`)

| Concern | Owner |
| --- | --- |
| Engineering Session runtime state, snapshot, reconstitution | `EngineeringSession` (Sprints 39/40, unmodified) |
| `EngineeringSessionCheckpoint` value object, Checkpoint identity, capture timestamp | `EngineeringSessionCheckpoint` (this Sprint, new) |
| Checkpoint capture orchestration | `EngineeringSessionService.createCheckpoint` (this Sprint, new) |
| Checkpoint persistence | `IEngineeringSessionCheckpointRepository` / in-memory implementation (this Sprint, new) |
| Recovery orchestration via existing `fromSnapshot()` | `EngineeringSessionService.recoverFromCheckpoint` (this Sprint, new) |
| Workflow position, Workflow Advancement, Workflow Chain Execution, Assignment Policy Evaluation | Unmodified (Sprints 43/45/46/47/48) |

Authorized Vertical Slice

- Add `EngineeringSessionCheckpoint`, an immutable value object wrapping an Engineering Session's existing `EngineeringSessionSnapshot`, a `EngineeringSessionCheckpointId`, and a capture timestamp.
- Add `EngineeringSessionService.createCheckpoint()`, calling the existing, unmodified `EngineeringSession.toSnapshot()` and persisting the resulting Checkpoint.
- Add `IEngineeringSessionCheckpointRepository` and an in-memory implementation, mirroring existing Kernel repository patterns.
- Add `EngineeringSessionService.recoverFromCheckpoint()`, retrieving a stored Checkpoint and reconstituting an `EngineeringSession` via the existing, unmodified `EngineeringSession.fromSnapshot()`.
- Extend `createKernelServices` composition only as strictly required to construct and register the Checkpoint repository and supply it to `EngineeringSessionService`.
- Unit/integration tests covering: deterministic Checkpoint capture; Recovery producing a semantically equivalent Engineering Session; the deterministic round-trip property `recoverFromCheckpoint(createCheckpoint(session))` yields a session semantically equivalent to `session` under all RFC-0004 invariants; not-found handling; repository behavior; Kernel composition continuity.

Deferred Concepts

- Concurrent Session Coordination, Multi-Agent Engineering Orchestration.
- Automatic or background checkpointing, Checkpoint retention/pruning policy, cross-session Checkpoint sharing.
- Any modification to `EngineeringSession`'s existing `toSnapshot()`, `fromSnapshot()`, snapshot structure, workflow state, timeline, or diagnostics.
- Any modification to `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding`, `AssignmentPolicy`, or `AssignmentPolicyService`.
- Any modification to Sprint 43's `advanceWorkflow()`, Sprint 45's `advanceWorkflowOnTrigger()`, Sprint 46's `advanceWorkflowAfterReview()`, or Sprint 47's/48's `executeCurrentWorkflowStep()`.
- Any `src/hosts` or `src/adapters` change.

Definition of Done

- `EngineeringSession`, `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding`, `AssignmentPolicy`, `AssignmentPolicyService` remain unmodified.
- Sprint 43/45/46/47/48 advancement and execution methods remain unmodified.
- Checkpoint capture and Recovery reuse `toSnapshot()`/`fromSnapshot()` exactly as they exist; no duplicate snapshot or reconstruction model is introduced.
- Recovery satisfies semantic equivalence (RFC-defined state, workflow progression, workflow execution history, timeline, diagnostics, and architectural invariants), not byte-for-byte identity.
- The deterministic round-trip property `recoverFromCheckpoint(createCheckpoint(session))` is verified by automated test to be semantically equivalent to `session`.
- No `src/hosts` or `src/adapters` file is modified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0049-session-recovery-checkpointing-foundation.md` for the complete Sprint Implementation Record.

Reviewer Validation Result

- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-15-006`). Confirmed the Checkpoint capture/Recovery pair is thin orchestration reusing Sprint 39's unmodified `EngineeringSession.toSnapshot()`/`fromSnapshot()` verbatim, with no duplicate snapshot or reconstruction model introduced; confirmed `EngineeringSession`, `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding`, `AssignmentPolicy`, `AssignmentPolicyService`, Sprint 43's/45's/46's/47's/48's advancement and execution methods, and `src/hosts`/`src/adapters` are all byte-for-byte unmodified. Independent re-validation confirmed `tsc --noEmit`, ESLint, `npm run validate` (Vitest 76 files / 380 tests, esbuild), and `npm run test:extension-host:build` all pass cleanly.
- Two Category 6, Informational Observations recorded (`NEXUS-REV-2026-07-15-006-F-001`, `-F-002`): a `JSON.stringify`-based `equals()` versus the sibling `EngineeringSession.equals()`'s dedicated comparison helper, and reuse of an EngineeringSession-scoped error class for Checkpoint validation. Neither generates a Builder Task. Sprint 49 is fully closed with zero open findings.

---

## Sprint 50 — Concurrent Session Coordination

Status: ✅ Approved — `NEXUS-REV-2026-07-15-007` (fully closed; one Category 6 Observation, zero Builder Tasks; zero open findings).

Objective

Introduce the minimum Kernel capability required to expose multiple concurrent Engineering Sessions while preserving complete isolation between them, reusing the existing `EngineeringSessionRepository` and `EngineeringSessionService`, per RFC-0004 v1.9's new "Concurrent Session Coordination" section.

RFC Coverage

Primary

- RFC-0004 v1.9 — Execution Model ("Concurrent Session Coordination", new section)

Referenced

- RFC-0004 v1.2/v1.3 — "Engineering Session" (Sprints 39/40, unmodified)
- RFC-0004 v1.8 — "Session Recovery/Checkpointing" (Sprint 49, unmodified)
- RFC-0010 — Kernel Boundaries

No RFC ownership changes are authorized beyond `NEXUS-RAT-2026-07-15-009`'s RFC-0004 v1.9 amendment.

Ratification

- `NEXUS-RAT-2026-07-15-010` — Sprint 50 scope ratification: governs this Sprint's entire scope, the binding Objective, the binding Architectural Responsibilities, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-15-009` — the companion RFC-0004 v1.9 amendment defining Concurrent Session Coordination this Sprint implements.

Architectural Responsibilities (binding, from `NEXUS-RAT-2026-07-15-010`)

| Concern | Owner |
| --- | --- |
| Engineering Session runtime state, workflow position, timeline, diagnostics | `EngineeringSession` (Sprints 39/40, unmodified) |
| Checkpoint capture, Recovery | `EngineeringSessionService.createCheckpoint`/`recoverFromCheckpoint` (Sprint 49, unmodified) |
| Concurrent visibility, active-session enumeration, cross-session isolation guarantee | `EngineeringSessionService` (this Sprint, new operation(s) only) |
| Workflow position, Workflow Advancement, Workflow Chain Execution, Assignment Policy Evaluation | Unmodified (Sprints 43/45/46/47/48) |

Authorized Vertical Slice

- Add one new thin `EngineeringSessionService` operation exposing active/eligible-for-progression Engineering Session discovery, reusing the existing `IEngineeringSessionRepository`/`enumerate()`; no new aggregate, no new repository.
- Extend `createKernelServices` composition only as strictly required, if at all.
- Unit/integration tests demonstrating: multiple Engineering Sessions may exist concurrently; Engineering Sessions remain fully isolated; operations against one Engineering Session never mutate or observe another Engineering Session's runtime state; Engineering Session visibility is deterministic.

Deferred Concepts

- Multi-Agent Engineering Orchestration.
- Single-session mutation ordering, optimistic concurrency, locking semantics, distributed coordination.
- Any modification to `EngineeringSession`'s existing runtime state, snapshot/reconstitution semantics, workflow state, timeline, or diagnostics.
- Any modification to `EngineeringSessionCheckpoint`, `IEngineeringSessionCheckpointRepository`, `createCheckpoint()`, or `recoverFromCheckpoint()` (Sprint 49).
- Any modification to `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding`, `AssignmentPolicy`, or `AssignmentPolicyService`.
- Any modification to Sprint 43's `advanceWorkflow()`, Sprint 45's `advanceWorkflowOnTrigger()`, Sprint 46's `advanceWorkflowAfterReview()`, or Sprint 47's/48's `executeCurrentWorkflowStep()`.
- Any `src/hosts` or `src/adapters` change.

Definition of Done

- `EngineeringSession`, `EngineeringSessionCheckpoint`, `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding`, `AssignmentPolicy`, `AssignmentPolicyService` remain unmodified.
- Sprint 43/45/46/47/48/49 advancement, execution, and Checkpoint/Recovery methods remain unmodified.
- No new `EngineeringSession`-family aggregate or repository is introduced; the new operation is a thin, reused-repository query.
- No locking primitive, orchestration, or runtime scheduling is introduced.
- Cross-session isolation is demonstrated by automated test, not by a new enforcement mechanism.
- No `src/hosts` or `src/adapters` file is modified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0050-concurrent-session-coordination.md` for the complete Sprint Implementation Record.

Implementation Notes:

- Added `EngineeringSessionService.enumerateActiveEngineeringSessions()` as the one authorized thin active/eligible Engineering Session discovery query, reusing the existing `IEngineeringSessionRepository.enumerate()` contract.
- Added unit coverage for deterministic active-session visibility, lifecycle eligibility changes, and cross-session isolation across lifecycle, advancement, Checkpoint/Recovery, and WorkflowStep execution operations.
- Updated the Sprint 18 Kernel boundary certification composition assertion to include the new service operation.
- No `EngineeringSession`, Checkpoint/Recovery, Workflow Chain, advancement/execution, Assignment Policy, Adapter, Host, or additional repository behavior was modified.

Reviewer Validation Result

- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-15-007`). Confirmed `enumerateActiveEngineeringSessions()` is thin orchestration reusing Sprint 39's unmodified `IEngineeringSessionRepository.enumerate()` verbatim, with no new aggregate, repository, locking primitive, or orchestration mechanism introduced; confirmed `EngineeringSession`, `EngineeringSessionCheckpoint`, `IEngineeringSessionCheckpointRepository`, `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding`, `AssignmentPolicy`, `AssignmentPolicyService`, Sprint 43's/45's/46's/47's/48's advancement and execution methods, `createKernelServices`, and `src/hosts`/`src/adapters` are all byte-for-byte unmodified. Independent re-validation confirmed `tsc --noEmit`, ESLint, `npm run validate` (Vitest 76 files / 383 tests, esbuild), and `npm run test:extension-host:build` all pass cleanly.
- One Category 6, Informational Observation recorded (`NEXUS-REV-2026-07-15-007-F-001`): the active-session filter compares `EngineeringSessionStatus.toString()` to a string literal rather than the `.state` accessor idiom used elsewhere in `EngineeringSession`. No Builder Task generated. Sprint 50 is fully closed with zero open findings. No further Milestone 8 Sprint is currently planned to advance to Current; the sole remaining Milestone 8 direction (Multi-Agent Engineering Orchestration) requires its own future Sprint Owner scope ratification via `nexus-plan`.

---

## Sprint 51 — Multi-Agent Engineering Orchestration Foundation

Status: ✅ Approved — `NEXUS-REV-2026-07-15-008` (fully closed; two Category 6 Observations, zero Builder Tasks; zero open findings). Authorized by `NEXUS-RAT-2026-07-15-012`. Milestone 8's concluding Sprint — Milestone 8 is now Complete.

Objective

Introduce the minimum Kernel capabilities required to model multiple Engineering Sessions collaborating toward a common Mission through deterministic orchestration relationships — Mission Engineering Grouping and explicit cross-role Handoff — per RFC-0004 v1.10's new "Multi-Agent Engineering Orchestration Foundation" section. Introduces orchestration structure only; no autonomous orchestration behavior.

RFC Coverage

- RFC-0004 v1.10 — Execution Model ("Multi-Agent Engineering Orchestration Foundation", new section)

Referenced

- RFC-0004 v1.2/v1.3 — "Engineering Session" (Sprints 39/40, unmodified)
- RFC-0004 v1.8 — "Session Recovery/Checkpointing" (Sprint 49, unmodified)
- RFC-0004 v1.9 — "Concurrent Session Coordination" (Sprint 50, unmodified)
- RFC-0010 — Kernel Boundaries

No RFC ownership changes are authorized beyond `NEXUS-RAT-2026-07-15-011`'s RFC-0004 v1.10 amendment.

Ratification

- `NEXUS-RAT-2026-07-15-012` — Sprint 51 scope ratification: governs this Sprint's entire scope, the binding Objective, the binding Architectural Responsibilities, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-15-011` — the companion RFC-0004 v1.10 amendment defining Multi-Agent Engineering Orchestration Foundation this Sprint implements.

Authorized Vertical Slice

- Introduce a `MissionEngineeringGroup` (or equivalently named canonical Kernel concept) recording the deterministic association between a Mission and the Engineering Sessions participating in it, with a repository contract and in-memory implementation.
- Add a Kernel service operation enumerating a Mission's participating Engineering Sessions.
- Introduce an `EngineeringSessionHandoff` (or equivalently named canonical Kernel concept): an explicit, immutable record that engineering responsibility for a Mission passed from one existing, unmodified Engineering Session to another, with a deterministic Handoff lifecycle, repository contract, and in-memory implementation.
- Add Kernel service operation(s) for recording and enumerating Handoffs, with deterministic diagnostics for invalid/unauthorized Handoff attempts.
- Extend `createKernelServices` composition only as strictly required.
- Unit/integration tests demonstrating: multiple Engineering Sessions may participate in one Mission Engineering Group; deterministic enumeration; Handoff recording and lifecycle determinism; rejection diagnostics; and preserved cross-session isolation.

Deferred Concepts

- Autonomous planning, dynamic workflow generation, AI negotiation, agent-to-agent messaging.
- Scheduling algorithms, load balancing, parallel execution semantics, distributed orchestration, execution synchronization primitives.
- Dynamic Assignment Policy, automatic Adapter Selection.
- Any modification to `EngineeringSession`, `EngineeringSessionCheckpoint`, `enumerateActiveEngineeringSessions()`, `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding`, `AssignmentPolicy`, or `AssignmentPolicyService`.
- Any modification to Sprint 43's `advanceWorkflow()`, Sprint 45's `advanceWorkflowOnTrigger()`, Sprint 46's `advanceWorkflowAfterReview()`, or Sprint 47's/48's `executeCurrentWorkflowStep()`.
- Any `src/hosts` or `src/adapters` change.
- Governance Engine capabilities.

Definition of Done

- All previously certified aggregates, services, and repositories listed above remain unmodified.
- Mission Engineering Group and Engineering Session Handoff are new, additive Kernel concepts; no existing aggregate or repository is modified to introduce them.
- No autonomous orchestration, scheduling, messaging, or distributed coordination mechanism is introduced, including as an unused/stubbed reference.
- Cross-session isolation is preserved and verified by automated test.
- No `src/hosts` or `src/adapters` file is modified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.
- Upon Approval with zero open Critical/Major/Minor findings, Milestone 8 — Engineering Orchestration SHALL be considered Complete.

See `knowledge/implementation/sprints/sprint-0051-multi-agent-engineering-orchestration-foundation.md` for the complete Sprint Implementation Record.

Reviewer Validation Result

- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-15-008`). Confirmed `MissionEngineeringGroup` and `EngineeringSessionHandoff` are new, additive Kernel concepts with their own repository contracts and in-memory implementations reusing the Kernel's established sequential-operation-queue idiom; confirmed `MissionEngineeringOrchestrationService` is thin orchestration validating Engineering Session references through the existing, unmodified `IEngineeringSessionRepository.exists()`, rejecting unauthorized and duplicate Handoffs deterministically, and never executing a Workflow Step, advancing a workflow position, evaluating an Assignment Policy, or dispatching an Adapter. Confirmed `EngineeringSession`, `EngineeringSessionCheckpoint`, `IEngineeringSessionCheckpointRepository`, `enumerateActiveEngineeringSessions()`, `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding`, `AssignmentPolicy`, `AssignmentPolicyService`, `RoleId`, `EngineeringSessionId`, `MissionId`, and `src/hosts`/`src/adapters` are all byte-for-byte unmodified. Cross-session isolation is verified by unit and composed-Kernel integration tests. Independent re-validation confirmed `tsc --noEmit`, targeted Vitest (13/13), `npm run validate` (Vitest 78 files / 392 tests, esbuild), and `npm run test:extension-host:build` all pass cleanly.
- Two Category 6, Informational Observations recorded (`NEXUS-REV-2026-07-15-008-F-001`, `-F-002`): `MissionEngineeringGroup` association performs no Mission-existence validation (not required by the ratified scope), and an unrelated pre-existing Kernel-boundary test was reformatted with an added timeout in the same diff (cosmetic only). Neither generates a Builder Task. Sprint 51 is fully closed with zero open findings. Per `NEXUS-RAT-2026-07-15-012`, Milestone 8 — Engineering Orchestration is now Complete.

---

# Milestone 9 — Engineering Governance Automation

Status: ✅ COMPLETE (Sprint 52 — Governance Policy Model Foundation is ✅ Approved — `NEXUS-REV-2026-07-15-009`, authorized by `NEXUS-RAT-2026-07-15-015`; Sprint 53 — Policy Evaluation and Governance Decision Foundation is ✅ Approved — `NEXUS-REV-2026-07-15-010`/`-011`/`-012`, fully closed with zero open findings, authorized by `NEXUS-RAT-2026-07-15-016`; Sprint 54 — Ratification Attribution Validation Foundation is ✅ Approved — `NEXUS-REV-2026-07-16-001`, fully closed with zero open findings, authorized by `NEXUS-RAT-2026-07-15-017`; Sprint 55 — Ratification and Repository-Law Integration is ✅ Approved — `NEXUS-REV-2026-07-16-002`, fully closed with zero open findings, authorized by `NEXUS-RAT-2026-07-16-001`; Sprint 56 — Governance Decision Domain Event Publication is ✅ Approved with Findings — `NEXUS-REV-2026-07-16-006`, fully closed with one Category 4, Informational finding and zero open findings of any blocking category, authorized by `NEXUS-RAT-2026-07-16-002` and remediated under `NEXUS-RAT-2026-07-16-003`/`NEXUS-RAT-2026-07-16-004`; Sprint 57 — Governance-Gated Workflow Advancement is ✅ Approved — `NEXUS-REV-2026-07-16-008`, fully closed with zero open findings of any category (originally Approved with Findings under `NEXUS-REV-2026-07-16-007`, one Category 1, Minor finding resolved via TASK-001 Option B), RFC-0004 amended to v1.11 by `NEXUS-RAT-2026-07-16-005`, Sprint scope narrowed and authorized by `NEXUS-RAT-2026-07-16-006`; Sprint 58 — Governance Recovery and Blocking-State Foundation is ✅ Approved — `NEXUS-REV-2026-07-16-009`, fully closed with one Category 6, Informational Observation and zero open findings of any blocking category, RFC-0004 amended to v1.12 by `NEXUS-RAT-2026-07-16-007`, Sprint scope authorized by `NEXUS-RAT-2026-07-16-008`; Sprint 59 — Recovery Requirement Domain Event Publication is ✅ Approved — `NEXUS-REV-2026-07-16-010`, fully closed with one Category 4, Informational finding and zero open findings of any blocking category, Sprint scope authorized by `NEXUS-RAT-2026-07-16-009`, no RFC amendment; Sprint 60 — Recovery-Gated Re-Advancement is ✅ Approved — `NEXUS-REV-2026-07-16-011`, fully closed with one Category 4, Informational finding and one Category 6, Informational Observation and zero open findings of any blocking category, RFC-0004 amended to v1.13 by `NEXUS-RAT-2026-07-16-010`, Sprint scope authorized by `NEXUS-RAT-2026-07-16-011`; Sprint 61 — Governance-Gated Mission Completion is ✅ Approved — `NEXUS-REV-2026-07-16-012`, fully closed with one Category 6, Informational Observation and zero open findings of any blocking category, RFC-0001 amended to v1.1 by `NEXUS-RAT-2026-07-16-012`, Sprint scope authorized by `NEXUS-RAT-2026-07-16-013`; Sprint 62 — Governance Automation Integration Validation and Milestone 9 Certification is ✅ Approved — `NEXUS-REV-2026-07-16-014` (TASK-001 Resolution Verification; fully closed with zero open findings of any category; originally Approved with Findings under `NEXUS-REV-2026-07-16-013`, one Category 1, Minor finding, resolved via TASK-001), Sprint scope authorized by `NEXUS-RAT-2026-07-16-014` — Milestone 9's concluding Sprint. Milestone 9 declared complete by the `nexus-plan` cycle of 2026-07-16 per `NEXUS-RAT-2026-07-16-014`'s Milestone Decision Authority: Sprint 62 certification passed with zero blocking findings of any category.)

Objective

Introduce deterministic, evidence-based governance capabilities that evaluate engineering outcomes, repository policies, review findings, ratifications, and workflow state. Milestone 9 SHALL reduce repetitive Sprint Owner intervention without transferring final engineering authority to the Kernel. The milestone builds upon the completed Engineering Orchestration Foundation established through Milestone 8.

RFC Coverage

- RFC-0011 — Engineering Governance Model (Final, Version 1.0, Normative — ratified `NEXUS-RAT-2026-07-15-014`)

Ratification

- `NEXUS-RAT-2026-07-15-013` — opens Milestone 9, sets the binding Objective and Architectural Boundary, and authorizes `nexus-plan` to draft RFC-0011 for a separate follow-up ratification.
- `NEXUS-RAT-2026-07-15-014` — ratifies RFC-0011 v1.0 as Final and Normative following a section-by-section pre-ratification architectural review (RFC Ratification Report). Does not itself authorize any implementation Sprint.

Architectural Boundary (binding, from `NEXUS-RAT-2026-07-15-013`)

Governance automation SHALL evaluate explicit repository policies; consume authoritative Evidence and Shared Reality; consume finalized Review Outcomes and structured Findings; apply existing Ratifications and repository law; produce deterministic governance decisions and escalation requirements; and preserve complete attribution and explainability.

Governance automation SHALL NOT redefine Mission objectives; autonomously create project intent; perform unrestricted architectural deliberation; replace final human engineering authority; introduce persistent cognition or self-directed engineering; or silently approve ambiguous or unsupported decisions. Any decision that cannot be resolved deterministically from repository law SHALL be escalated to the Sprint Owner.

Provisional Capability Sequence (non-binding; subject to `nexus-plan` dependency validation and re-sequencing before any Sprint is proposed)

- Sprint 52 — Governance Policy Model Foundation (implemented as proposed)
- Sprint 53 — Policy Evaluation Foundation (implemented, merged with the provisional Sprint 54 scope, as "Policy Evaluation and Governance Decision Foundation")
- Sprint 54 — Ratification Attribution Validation Foundation (re-sequenced from the provisional "Governance Decision and Escalation" naming; Governance Decision/Escalation were delivered by Sprint 53's merge instead)
- Sprint 55 — Ratification and Repository-Law Integration (implemented as proposed)
- Sprint 56 — Governance Decision Domain Event Publication (re-sequenced from the provisional "Review-to-Governance Workflow Integration"; Domain Event publication is the smaller, foundational prerequisite — workflow integration/consumption remains a later, still-unscheduled provisional item)
- Sprint 57 — Governance-Gated Workflow Advancement (re-sequenced and re-scoped from the provisional "Governance Automation Validation"; the Sprint Owner determined the next required capability was operational integration — a `GovernanceDecision`-gated RFC-0004 Advancement Strategy — not further validation of already-certified Sprints 52–56; authorized by `NEXUS-RAT-2026-07-16-005`/`-006`, narrowed from a broader initially-proposed scope that exceeded ratified RFC text)
- Sprint 58 — Governance Recovery and Blocking-State Foundation (RFC-0004 amended to v1.12 by `NEXUS-RAT-2026-07-16-007`, adding `RecoveryRequirement`; Sprint scope authorized by `NEXUS-RAT-2026-07-16-008`; ✅ Approved — `NEXUS-REV-2026-07-16-009`)
- Sprint 59 — Recovery Requirement Domain Event Publication (re-sequenced from the provisional "Governed Mission Completion" naming, which remains unscheduled and requires its own future RFC-0001 amendment; Sprint scope authorized by `NEXUS-RAT-2026-07-16-009`; ✅ Approved — `NEXUS-REV-2026-07-16-010`)
- Sprint 60 — Recovery-Gated Re-Advancement (RFC-0004 amended to v1.13 by `NEXUS-RAT-2026-07-16-010`, adding Recovery-Gated Re-Advancement Eligibility to Governance-Gated Advancement; Sprint scope authorized by `NEXUS-RAT-2026-07-16-011`; ✅ Approved — `NEXUS-REV-2026-07-16-011`)
- Sprint 61 — Governance-Gated Mission Completion (RFC-0001 amended to v1.1 by `NEXUS-RAT-2026-07-16-012`, adding Governance-Gated Mission Completion; Sprint scope authorized by `NEXUS-RAT-2026-07-16-013`; ✅ Approved — `NEXUS-REV-2026-07-16-012`)
- Sprint 62 — Governance Automation Integration Validation and Milestone 9 Certification (validation-only Sprint exercising the complete Sprint 52–61 governed engineering path end-to-end; Sprint scope authorized by `NEXUS-RAT-2026-07-16-014`; ✅ Approved — `NEXUS-REV-2026-07-16-014`, TASK-001 Resolution Verification, fully closed with zero open findings of any category)

Status

- RFC-0011 drafted (`knowledge/specifications/rfc-0011-engineering-governance-model.md`), pre-ratification reviewed (RFC Ratification Report), revised to v0.2 to resolve a `Blocked`/RFC-0004 terminology collision and add explicit Authority Hierarchy, Decision Semantics, and Failure/Conflict Handling, and ratified Final as v1.0 by `NEXUS-RAT-2026-07-15-014`.
- Sprint 52 — Governance Policy Model Foundation is ✅ Approved — `NEXUS-REV-2026-07-15-009` (fully closed; two Category 6 Observations, zero Builder Tasks; zero open findings), authorized by `NEXUS-RAT-2026-07-15-015`.
- Sprint 53 — Policy Evaluation and Governance Decision Foundation is **✅ Approved** (`NEXUS-REV-2026-07-15-010`; one Category 1, Minor finding resolved by TASK-001 and verified by `NEXUS-REV-2026-07-15-011`; one Category 4, Informational documentation finding resolved by DOC-001 and verified by `NEXUS-REV-2026-07-15-012`; fully closed with zero open findings of any category), formally activating the provisional Sprint 53/54 merge approved in principle by `NEXUS-RAT-2026-07-15-015`, following two Sprint Owner review cycles (Changes Required, then Approved With Final Refinements) and ratified by `NEXUS-RAT-2026-07-15-016`.
- Sprint 54 — Ratification Attribution Validation Foundation is **✅ Approved** (`NEXUS-REV-2026-07-16-001`; two Category 6, Informational Observations, zero Builder Tasks; fully closed with zero open findings of any blocking category), authorized by `NEXUS-RAT-2026-07-15-017` following two Sprint Owner review cycles (Changes Required — scope bundling across seven distinct concerns; Changes Required — Snapshot cardinality and explicit Effective status). Validates the Ratification attribution recorded by one `RepositoryPolicy` version against an immutable collection of Ratification Authority Records, producing exactly one of three closed outcomes (Valid, Invalid, Unresolvable). Standalone this Sprint — no integration with `PolicyEvaluation`/`GovernanceDecision`/`GovernanceService`.
- Sprint 55 — Ratification and Repository-Law Integration is **✅ Approved** (`NEXUS-REV-2026-07-16-002`; one Category 6, Informational Observation, zero Builder Tasks; fully closed with zero open findings of any blocking category), authorized by `NEXUS-RAT-2026-07-16-001` (Approved With Changes on the originating `nexus-plan` proposal). Integrates Sprint 54's standalone `RatificationAttributionValidationService` into `GovernanceService` as an additive precondition to Policy Evaluation: `Valid` attribution proceeds through existing Sprint 53 evaluation/precedence logic unchanged; `Invalid`/`Unresolvable` attribution unconditionally yields `Escalation Required` without Policy Criteria evaluation. Milestone 9's fourth Sprint.
- Sprint 56 — Governance Decision Domain Event Publication is **✅ Approved with Findings** (`NEXUS-REV-2026-07-16-006`; one Category 4, Informational finding, zero Builder Tasks blocking; fully closed with zero open findings of any blocking category), originally authorized by `NEXUS-RAT-2026-07-16-002`, first remediated under `NEXUS-RAT-2026-07-16-003` (Mission Identity Rule, since withdrawn), and second remediated under `NEXUS-RAT-2026-07-16-004` (RFC-0011 v1.1 Mission-Scoped Governance Evaluation) after `NEXUS-REV-2026-07-16-004`. Milestone 9's fifth Sprint: publishes exactly one `GovernanceDecisionRecorded` Domain Event (RFC-0005's "Policy Events" category) per persisted `GovernanceDecision`; governance evaluation is Mission-scoped per RFC-0011 v1.1, so `missionId` is required on the evaluation request, retained by every `GovernanceDecision`, and always present on the event envelope with no unsafe cast. See `knowledge/implementation/sprints/sprint-0056-governance-decision-domain-event-publication.md` for the complete Sprint Implementation Record.
- Sprint 57 — Governance-Gated Workflow Advancement is **✅ Approved** (`NEXUS-REV-2026-07-16-008`, TASK-001 Resolution Verification; fully closed with zero open findings of any category), originally Approved with Findings under `NEXUS-REV-2026-07-16-007` (one Category 1, Minor finding, `NEXUS-REV-2026-07-16-007-F-001`, resolved via TASK-001 Option B — accepting direct repository resolution as the go-forward design, documented in `IMPLEMENTATION_REPORT.md`), authorized by `NEXUS-RAT-2026-07-16-006`, narrowed from a broader Sprint Owner-proposed scope per `nexus-plan`'s Governance Report. RFC-0004 was amended to v1.11 (`NEXUS-RAT-2026-07-16-005`) to add Governance-Gated Advancement as a fourth Advancement Strategy: a `GovernanceDecision` classifies as Non-Blocking (Approved) or Blocking (Rejected, Deferred, Escalation Required) solely for this Strategy's Advancement Eligibility. Milestone 9's sixth Sprint; the first Sprint integrating Governance (RFC-0011) with the Engineering Workflow (RFC-0004). See `knowledge/implementation/sprints/sprint-0057-governance-gated-workflow-advancement.md` for the complete Sprint Implementation Record.
- Sprint 58 — Governance Recovery and Blocking-State Foundation is **✅ Approved** (`NEXUS-REV-2026-07-16-009`; fully closed with one Category 6, Informational Observation and zero open findings of any blocking category), authorized by `NEXUS-RAT-2026-07-16-008`, following RFC-0004's amendment to v1.12 (`NEXUS-RAT-2026-07-16-007`) adding `RecoveryRequirement`. Milestone 9's seventh Sprint: `RecoveryRequirement` is created only for a Rejected `GovernanceDecision` (never Deferred, Escalation Required, or Approved), keyed uniquely and idempotently to (Mission, Engineering Session, Workflow Step, `GovernanceDecision`), with an Open → Resolved | Withdrawn lifecycle governed by explicit Recovery Resolution and Recovery Withdrawal contracts. Builder implementation complete: targeted Sprint 58 validation passed (22 tests); repository validation passed with TypeScript compile, ESLint, Vitest (84 files / 499 tests), esbuild, and extension-host bundle build. See `knowledge/implementation/sprints/sprint-0058-governance-recovery-and-blocking-state-foundation.md` for the complete Sprint Implementation Record.
- Sprint 59 — Recovery Requirement Domain Event Publication is **✅ Approved** (`NEXUS-REV-2026-07-16-010`; fully closed with one Category 4, Informational finding and zero open findings of any blocking category), authorized by `NEXUS-RAT-2026-07-16-009`. Milestone 9's eighth Sprint: publishes `RecoveryRequirementCreated`/`RecoveryRequirementResolved`/`RecoveryRequirementWithdrawn` Domain Events under RFC-0005's existing "Execution Events" category, with seven Sprint Owner refinements binding (attribution completeness, creation-event idempotency, rehydration safety, failure-path silence, save-then-publish sequencing, production EventBus wiring, required test coverage). No RFC amendment. See `knowledge/implementation/sprints/sprint-0059-recovery-requirement-domain-event-publication.md` for the complete Sprint Implementation Record.
- Sprint 60 — Recovery-Gated Re-Advancement is **✅ Approved** (`NEXUS-REV-2026-07-16-011`; fully closed with one Category 4, Informational finding and one Category 6, Informational Observation and zero open findings of any blocking category), RFC-0004 amended to v1.13 (`NEXUS-RAT-2026-07-16-010`) adding Recovery-Gated Re-Advancement Eligibility to Governance-Gated Advancement (v1.11), Sprint scope authorized by `NEXUS-RAT-2026-07-16-011`. Milestone 9's ninth Sprint: a Resolved Recovery Requirement, exactly attributed to the Rejected `GovernanceDecision` governing a blocked workflow position and referencing its authoritative accepted outcome, restores Advancement Eligibility for evaluation by the existing Governance-Gated Advancement authority — it does not reclassify the `GovernanceDecision` and does not itself advance the workflow. Builder implementation complete: targeted Sprint 60 validation passed (96 tests); repository validation passed with TypeScript compile, ESLint, Vitest (84 files / 517 tests), esbuild, and extension-host bundle build. See `knowledge/implementation/sprints/sprint-0060-recovery-gated-re-advancement.md` for the complete Sprint Implementation Record.
- Sprint 61 — Governance-Gated Mission Completion is **✅ Approved** (`NEXUS-REV-2026-07-16-012`; fully closed with one Category 6, Informational Observation and zero open findings of any blocking category), RFC-0001 amended to v1.1 (`NEXUS-RAT-2026-07-16-012`) adding Governance-Gated Mission Completion, Sprint scope authorized by `NEXUS-RAT-2026-07-16-013`. Milestone 9's tenth Sprint: before a Mission may transition `Reviewing → Completed`, the existing Sprint 4 Task-completion precondition SHALL first be satisfied, then every `GovernanceDecision` attributed to the Mission SHALL independently be Non-Blocking (Approved) — Rejected, Deferred, and Escalation Required each unconditionally block completion; Recovery Requirement consultation is explicitly out of scope. Builder implementation complete: repository validation passed with TypeScript compile, ESLint, Vitest (84 files / 528 tests), esbuild, and extension-host bundle build. See `knowledge/implementation/sprints/sprint-0061-governance-gated-mission-completion.md` for the complete Sprint Implementation Record.
- Sprint 62 — Governance Automation Integration Validation and Milestone 9 Certification is **✅ Approved** (`NEXUS-REV-2026-07-16-014`, TASK-001 Resolution Verification; fully closed with zero open findings of any category; originally Approved with Findings under `NEXUS-REV-2026-07-16-013`), Sprint scope authorized by `NEXUS-RAT-2026-07-16-014`. Milestone 9's concluding (eleventh) Sprint: added an integration test suite exercising the complete governed engineering path (Review → Policy Evaluation → Ratification Attribution Validation → Governance Decision → Governance Decision Event Publication → Governance-Gated Workflow Advancement → Recovery Requirement Creation → Recovery Requirement Event Publication → Recovery Resolution → Recovery-Gated Re-Advancement → Governance-Gated Mission Completion) assembled exclusively from existing, frozen Sprint 52–61 contracts. No new production capability was introduced. Repository validation passed: TypeScript compile, ESLint, Vitest (85 files / 543 tests), esbuild, and extension-host bundle build. See `knowledge/implementation/sprints/sprint-0062-governance-automation-integration-validation.md` for the complete Sprint Implementation Record. Milestone 9 declared complete by the `nexus-plan` cycle of 2026-07-16 per `NEXUS-RAT-2026-07-16-014`'s Milestone Decision Authority.

---

## Sprint 62 — Governance Automation Integration Validation and Milestone 9 Certification

Status: ✅ Approved — `NEXUS-REV-2026-07-16-014` (TASK-001 Resolution Verification; fully closed with zero open findings of any category). Originally Approved with Findings under `NEXUS-REV-2026-07-16-013` (one Category 1, Minor finding, resolved via TASK-001). Validation-only Sprint; no production source changes. Sprint scope authorized by `NEXUS-RAT-2026-07-16-014`. Milestone 9's concluding (eleventh) Sprint. Milestone 9 declared complete by the `nexus-plan` cycle of 2026-07-16 per `NEXUS-RAT-2026-07-16-014`'s Milestone Decision Authority.

Objective

Validate the complete Milestone 9 governance lifecycle as an integrated system and determine whether Milestone 9 — Engineering Governance Automation can be formally closed.

RFC Coverage

- RFC-0001 v1.1 — Mission Model (Referenced; Governance-Gated Mission Completion consumed unmodified).
- RFC-0004 v1.13 — Execution Model (Referenced; Governance-Gated Advancement, Recovery Requirement, Recovery-Gated Re-Advancement Eligibility consumed unmodified).
- RFC-0005 — Domain Event Model (Referenced; event publication, persistence, and consumption boundaries exercised unmodified).
- RFC-0006 — Engineering Assessment Model (Referenced; Review consumed unmodified).
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision`, Policy Evaluation, Ratification Authority Validation consumed unmodified).

Authorized Concepts

- An integration test suite exercising every required Sprint 62 governance automation scenario across existing Sprint 52–61 services/repositories and public contracts.
- A Milestone 9 closure recommendation.

Deferred Concepts

- Withdrawn Recovery Requirement eligibility.
- Recovery-aware Mission completion.
- The `MissionPaused` lifecycle inconsistency.
- Generic event subscription/consumer infrastructure.
- Host/Adapter governance surfacing.
- Autonomous ratification and AI governance deliberation.

Builder Implementation Summary

- Added `test/integration/governance-automation-integration-validation.integration.test.ts` with 15 tests covering all fourteen Required Scenarios.
- Exercised the full governed path: Review, Policy Evaluation, Ratification Authority Validation, Governance Decision, Domain Event publication, Governance-Gated Workflow Advancement, Recovery Requirement creation/publication/resolution, Recovery-Gated Re-Advancement, and Governance-Gated Mission Completion.
- Confirmed no production `src` contract drift, and no `src/hosts` or `src/adapters` changes.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest (85 files / 543 tests), esbuild, and extension-host bundle build.
- Milestone 9 closure recommendation: Ready to Close, pending Reviewer validation and the next authorized planning cycle.

See `knowledge/implementation/sprints/sprint-0062-governance-automation-integration-validation.md` for the complete Sprint Implementation Record.

---

## Sprint 61 — Governance-Gated Mission Completion

Status: ✅ Approved — `NEXUS-REV-2026-07-16-012` (fully closed; one Category 6, Informational Observation, zero Builder Tasks; zero open findings of any blocking category). RFC-0001 amended to v1.1 by `NEXUS-RAT-2026-07-16-012`; Sprint scope authorized by `NEXUS-RAT-2026-07-16-013`. Milestone 9's tenth Sprint.

Objective

Implement RFC-0001 v1.1's Governance-Gated Mission Completion: before a Mission may transition `Reviewing → Completed`, the existing Task-completion precondition (Sprint 4) SHALL first be satisfied, then every `GovernanceDecision` attributed to the Mission SHALL independently be Non-Blocking (Approved) — Rejected, Deferred, and Escalation Required each unconditionally block completion. No Recovery Requirement consultation is introduced; Mission Completion has no Engineering Session/Workflow Step context to construct RFC-0004 v1.12's attribution key.

RFC Coverage

- RFC-0001 v1.1 — Mission Model ("§ 15a. Governance-Gated Mission Completion", new).
- RFC-0004 v1.11 — Execution Model (Referenced; Blocking/Non-Blocking Governance Decision classification consumed unmodified).
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision` consumed unmodified).

Ratification

- `NEXUS-RAT-2026-07-16-012` — RFC-0001 amendment to v1.1: adds Governance-Gated Mission Completion.
- `NEXUS-RAT-2026-07-16-013` — Sprint 61 scope ratification: governs this Sprint's entire authorized scope, including the Required Behavioral Matrix and the explicit exclusion of Recovery Requirement consultation.

Authorized Concepts

- An optional constructor-injected `IGovernanceDecisionRepository` on `MissionExecutionService`, used exclusively within `completeMission`, after the existing `assertCompletionPermitted` precondition succeeds, to retrieve every `GovernanceDecision` attributed to the Mission via the existing, unmodified `enumerate()` method (read-only, filtered client-side by `missionId`).
- A pure, deterministic Mission Completion eligibility function implementing exactly the Required Behavioral Matrix.
- `createKernelServices` wiring so `MissionExecutionService` always receives the shared, production `IGovernanceDecisionRepository`.

Deferred Concepts

- Recovery-aware Mission completion; Mission-level Recovery Requirement projection or aggregation; Engineering Session/Workflow Step attribution bridging.
- Review-outcome and Knowledge-requirement completion gating.
- Withdrawn Recovery Requirement eligibility.
- The `MissionPaused` lifecycle inconsistency.
- Event subscriptions/consumers; any `src/hosts` or `src/adapters` change.

Definition of Done

- Mission Completion is rejected when any applicable `GovernanceDecision` is Blocking; every applicable `GovernanceDecision` is evaluated independently; absence of any attributed `GovernanceDecision` preserves existing Sprint 4 completion behavior unchanged.
- `GovernanceDecision`, `GovernanceService`, `RecoveryRequirement`, `RecoveryRequirementService`, `WorkflowChain`, and `EngineeringSession` remain unmodified; no `IRecoveryRequirementRepository` reference is introduced anywhere.
- No `src/hosts` or `src/adapters` file is modified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

Builder Implementation Summary

- Implemented `mission-completion-eligibility.ts` as the pure deterministic eligibility function for the Sprint 61 Required Behavioral Matrix.
- Extended `MissionExecutionService.completeMission` additively: existing Task-completion preconditions are asserted first, then applicable Mission-attributed `GovernanceDecision`s are enumerated read-only and evaluated before `MissionCompleted` persistence/publication.
- Wired `createKernelServices()` so the production `MissionExecutionService` receives the shared `IGovernanceDecisionRepository`.
- Added Sprint 61 test coverage for every matrix row, independent blocking, purity/no repository access, production wiring, no applicable `GovernanceDecision`, and absence of recovery-symbol references in the new eligibility code.
- Validation complete: TypeScript compile, ESLint, Vitest (84 files / 528 tests), esbuild, and extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0061-governance-gated-mission-completion.md` for the complete Sprint Implementation Record.

---

## Sprint 60 — Recovery-Gated Re-Advancement

Status: ✅ Approved — `NEXUS-REV-2026-07-16-011` (fully closed; one Category 4, Informational finding, one Category 6, Informational Observation, zero Builder Tasks blocking; zero open findings of any blocking category). RFC-0004 amended to v1.13 by `NEXUS-RAT-2026-07-16-010`; Sprint scope authorized by `NEXUS-RAT-2026-07-16-011`. Milestone 9's ninth Sprint.

Objective

Implement RFC-0004 v1.13's Recovery-Gated Re-Advancement Eligibility: when Governance-Gated Advancement's governing `GovernanceDecision` is Rejected, consult the Recovery Requirement for the exact (Mission, Engineering Session, Workflow Step, `GovernanceDecision`) attribution key; if it is Resolved with a present `acceptedOutcomeReference`, restore Advancement Eligibility instead of unconditionally failing.

RFC Coverage

- RFC-0004 v1.13 — Execution Model ("Recovery-Gated Re-Advancement Eligibility" §, new).
- RFC-0004 v1.11/v1.12 — Execution Model (Referenced; Governance-Gated Advancement and Recovery Requirement consumed unmodified).
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision` consumed unmodified).

Ratification

- `NEXUS-RAT-2026-07-16-010` — RFC-0004 amendment to v1.13: adds Recovery-Gated Re-Advancement Eligibility.
- `NEXUS-RAT-2026-07-16-011` — Sprint 60 scope ratification: governs this Sprint's entire authorized scope, including mandatory production repository injection, resolution-authority fail-closed validation, pure eligibility evaluation, and the Required Behavioral Matrix.

Authorized Concepts

- An optional constructor-injected `IRecoveryRequirementRepository` on `EngineeringSessionService`, used exclusively via `findByAttributionKey` ahead of invoking `EngineeringSession.advanceWorkflowAfterGovernanceDecision` — read-only.
- A pure, deterministic eligibility function implementing exactly the Required Behavioral Matrix, replacing or wrapping the existing `assertNonBlockingGovernanceDecision`.
- `createKernelServices` wiring so `EngineeringSessionService` always receives the shared, production `IRecoveryRequirementRepository`.

Deferred Concepts

- Advancement eligibility for Withdrawn Recovery Requirements.
- Event subscriptions/consumers of Recovery Requirement or Governance Decision events.
- Governed Mission Completion; any Mission completion precondition change (still unscheduled; requires its own future RFC-0001 amendment).
- Any differentiated Deferred/Escalation-Required treatment beyond uniform Blocking.
- Any `src/hosts` or `src/adapters` change.

Definition of Done

- Every row of the Required Behavioral Matrix (see `NEXUS-RAT-2026-07-16-011`) holds exactly as specified; a Resolved Recovery Requirement restores eligibility only for its exact attribution key and never automatically advances the workflow.
- `RecoveryRequirement`, `RecoveryRequirementService`, `GovernanceDecision`, `GovernanceService`, `WorkflowChain`, and `WorkflowStep` remain otherwise unmodified.
- No `src/hosts` or `src/adapters` file is modified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

Implementation Progress

- Added pure Recovery-Gated Re-Advancement eligibility evaluation for Approved, Rejected, Deferred, and Escalation Required `GovernanceDecision` values per the Required Behavioral Matrix.
- Added read-only exact-attribution Recovery Requirement lookup to `EngineeringSessionService.advanceWorkflowAfterGovernanceDecision(...)`.
- Wired `createKernelServices()` so `EngineeringSessionService` receives the shared production `IRecoveryRequirementRepository`.
- Preserved `RecoveryRequirement`, `RecoveryRequirementService`, `GovernanceDecision`, `GovernanceService`, `WorkflowChain`, `WorkflowStep`, `src/hosts`, and `src/adapters` outside this Sprint's changes.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest (84 files / 517 tests), esbuild, and extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0060-recovery-gated-re-advancement.md` for the complete Sprint Implementation Record.

---

## Sprint 58 — Governance Recovery and Blocking-State Foundation

Status: ✅ Approved — `NEXUS-REV-2026-07-16-009` (fully closed; one Category 6, Informational Observation, zero Builder Tasks; zero open findings of any blocking category). RFC-0004 amended to v1.12 by `NEXUS-RAT-2026-07-16-007`; Sprint scope authorized by `NEXUS-RAT-2026-07-16-008`. Milestone 9's seventh Sprint.

Reviewer Validation Result

- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-16-009`). Confirmed `RecoveryRequirement` implements exactly RFC-0004 v1.12's Recovery Requirement section within `NEXUS-RAT-2026-07-16-008`'s Authorized Vertical Slice: immutable identity and attribution, deterministic idempotent creation keyed on (Mission, Engineering Session, Workflow Step, `GovernanceDecision`), Rejected-only creation (Deferred/Escalation Required/Approved each verified to create none), the Recovery Resolution and Recovery Withdrawal Contracts' required-reference enforcement, and Lifecycle Immutability (terminal states, immutable transition metadata, deterministic rejection of conflicting repeated transitions). Confirmed via `git diff --stat`, source inspection, and a dedicated negative test that `GovernanceService`, `GovernanceDecision`, `WorkflowChain`, `EventBusContract`, and `DomainEvent` remain byte-for-byte unmodified, and that no `src/hosts`/`src/adapters` file or Recovery Requirement Domain Event was introduced. Independent re-validation confirmed `tsc --noEmit`, ESLint, targeted Vitest (22/22), `npm run test` (84 files / 499 tests), `npm run build`, and `npm run test:extension-host:build` all pass cleanly.
- One Category 6, Informational Observation recorded (`NEXUS-REV-2026-07-16-009-F-001`): `RecoveryRequirementService`'s constructor defaults to a private, unshared repository instance, the same pattern previously accepted in Sprint 5's `EvidenceService`. Unreachable in the certified Kernel composition; no Builder Task generated. Sprint 58 is fully closed with zero open findings of any blocking category.

Objective

Implement `RecoveryRequirement` as authorized by RFC-0004 v1.12: an explicit, attributable record that a Rejected `GovernanceDecision` (RFC-0011) has generated engineering remediation work, associated immutably with the Mission, Engineering Session, Workflow Step, and originating `GovernanceDecision` that produced it.

RFC Coverage

- RFC-0004 v1.12 — Execution Model ("Recovery Requirement" §, new).
- RFC-0011 — Engineering Governance Model v1.1 (Referenced; `GovernanceDecision` consumed as immutable, read-only input; RFC-0011 unmodified).
- RFC-0010 — Kernel Boundaries (Referenced).

Ratification

- `NEXUS-RAT-2026-07-16-007` — RFC-0004 amendment to v1.12: adds Recovery Requirement, its identity/uniqueness, required attribution, creation rules, lifecycle, and boundaries.
- `NEXUS-RAT-2026-07-16-008` — Sprint 58 scope ratification: governs this Sprint's entire authorized scope, including the Recovery Resolution Contract, Recovery Withdrawal Contract, and Lifecycle Immutability rules.

Authorized Concepts

- `RecoveryRequirement` domain aggregate: immutable identity; immutable Mission/Engineering Session/Workflow Step/`GovernanceDecision` identity references; creation timestamp; causality/correlation identifiers where available.
- A narrowly scoped `GovernanceDecisionRecorded` consumer creating a Recovery Requirement only for a Rejected `GovernanceDecision`.
- `IRecoveryRequirementRepository` and an in-memory implementation enforcing deterministic, idempotent creation keyed on (Mission, Engineering Session, Workflow Step, `GovernanceDecision`).
- A thin `RecoveryRequirementService` exposing exactly `resolveRecoveryRequirement(...)` and `withdrawRecoveryRequirement(...)`.
- Minimal `createKernelServices` wiring.

Deferred Concepts

- Recovery Requirement Domain Event publication.
- AI-generated remediation plan generation.
- Governed Mission Completion; any Mission completion precondition change (still unscheduled; requires its own future RFC-0001 amendment; superseded from the "Sprint 59" provisional naming by `NEXUS-RAT-2026-07-16-009`, which authorized Sprint 59 for Recovery Requirement Domain Event Publication instead).
- Differentiated Rejected/Deferred/Escalation-Required Engineering Session state beyond Sprint 57's uniform Blocking classification.
- Any `src/hosts` or `src/adapters` change.

Definition of Done

- `RecoveryRequirement` is created only for a Rejected `GovernanceDecision`; creation is deterministic and idempotent per the uniqueness key.
- `resolveRecoveryRequirement`/`withdrawRecoveryRequirement` enforce their required-reference contracts; the lifecycle is limited to Open → Resolved | Withdrawn, both terminal, with immutable transition metadata.
- `GovernanceService`, `GovernanceDecision`, `WorkflowChain`, `EventBusContract`, and `DomainEvent` remain unmodified.
- No `src/hosts` or `src/adapters` file is modified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0058-governance-recovery-and-blocking-state-foundation.md` for the complete Sprint Implementation Record.

Builder Implementation Result

- Builder implementation complete: added `RecoveryRequirement`, `IRecoveryRequirementRepository` / in-memory implementation, `RecoveryRequirementService`, `RecoveryRequirementGovernanceDecisionConsumer`, minimal Kernel wiring, and Required Test Matrix coverage.
- Validation passed: targeted Sprint 58 tests (22 tests), `npm run validate` (TypeScript compile, ESLint, Vitest 84 files / 499 tests, esbuild), and `npm run test:extension-host:build`.

---

## Sprint 59 — Recovery Requirement Domain Event Publication

Status: ✅ Approved — `NEXUS-REV-2026-07-16-010` (fully closed; one Category 4, Informational finding, zero Builder Tasks; zero open findings of any blocking category). Sprint scope authorized by `NEXUS-RAT-2026-07-16-009`. No RFC amendment. Milestone 9's eighth Sprint.

Objective

Publish exactly one Domain Event per `RecoveryRequirement` (RFC-0004 v1.12, Sprint 58) creation, resolution, and withdrawal, per RFC-0005's Engineering Progression principle — mirroring the established Foundation → Event Publication pattern (Sprint 12→13 Knowledge, Sprint 53→56 Governance Decision).

RFC Coverage

- RFC-0005 — Domain Event Model (Partial; new catalog entries under the existing "Execution Events" category; no RFC-0005 text amendment).
- RFC-0004 v1.12 — Execution Model (Referenced; `RecoveryRequirement` aggregate, lifecycle, and boundaries consumed unmodified).
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision` consumed unmodified).

Ratification

- `NEXUS-RAT-2026-07-16-009` — Sprint 59 scope ratification, incorporating seven Sprint Owner refinements (attribution completeness, creation-event idempotency, rehydration safety, failure-path silence, save-then-publish sequencing, production EventBus wiring, required test coverage).

Authorized Vertical Slice

- `recovery-requirement.events.ts`: `RecoveryRequirementEventType` union (`RecoveryRequirementCreated`, `RecoveryRequirementResolved`, `RecoveryRequirementWithdrawn`), `RecoveryRequirementDomainEvent` type, and factory functions, mirroring `governance.events.ts` (Sprint 56).
- `RecoveryRequirement` aggregate recorded-events collection and `pullDomainEvents()`, mirroring `Mission`/`Evidence`/`Review`/`Knowledge`/`GovernanceDecision`. `RecoveryRequirementCreated` is recorded only during authoritative creation, never during `fromSnapshot` rehydration, and never duplicated on idempotent creation handling.
- `RecoveryRequirementGovernanceDecisionConsumer` and `RecoveryRequirementService` gain constructor-injected `EventBusContract`, publishing only after successful persistence (save-then-publish); no event on failed or rejected/conflicting transitions.
- `createKernelServices` updated so both receive the shared, production `EventBusContract` instance.
- `kernel-event-catalog.md` reference-document addition for the three new event types under "Execution Events."
- Required Test Matrix per `NEXUS-RAT-2026-07-16-009` (nine rows).

Deferred Concepts

- Event subscriptions/consumers of these new events.
- Governed Mission Completion; any Mission completion precondition change (still unscheduled, still requires its own future RFC-0001 amendment).
- `WorkflowChain`/`WorkflowStep` mutation; any `GovernanceService`/`GovernanceDecision`/`GovernanceEscalation` modification.
- Durable/transactional event delivery.
- Any `src/hosts` or `src/adapters` change.

Definition of Done

- Exactly one Domain Event per successful `RecoveryRequirement` creation, resolution, and withdrawal; none on failed persistence, rehydration, idempotent duplicate creation, or rejected/conflicting transitions.
- `RecoveryRequirement`, `GovernanceDecision`, `GovernanceService`, `WorkflowChain`, `EventBusContract`, and `DomainEvent` envelope remain otherwise unmodified.
- No `src/hosts` or `src/adapters` file is modified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0059-recovery-requirement-domain-event-publication.md` for the complete Sprint Implementation Record.

Builder Implementation Result

- Builder implementation complete: added `recovery-requirement.events.ts`; added `RecoveryRequirement` recorded Domain Events and drain-once `pullDomainEvents()`; wired `RecoveryRequirementGovernanceDecisionConsumer` and `RecoveryRequirementService` to publish through the injected production `EventBusContract` only after successful persistence; preserved no-publication behavior for rehydration, idempotent duplicate creation, failed validation, and conflicting terminal transitions; added `RecoveryRequirementCreated`, `RecoveryRequirementResolved`, and `RecoveryRequirementWithdrawn` to the Kernel Event Catalog; and added Sprint 59 test coverage. Repository validation passed: TypeScript compile, ESLint, Vitest (84 files / 500 tests), esbuild, and extension-host bundle build.

---

## Sprint 57 — Governance-Gated Workflow Advancement

Status: ✅ Approved — `NEXUS-REV-2026-07-16-008` (TASK-001 Resolution Verification; fully closed with zero open findings of any category). Originally Approved with Findings under `NEXUS-REV-2026-07-16-007`. RFC-0004 amended to v1.11 by `NEXUS-RAT-2026-07-16-005`; Sprint scope authorized (narrowed from a broader initially-proposed scope) by `NEXUS-RAT-2026-07-16-006`. Milestone 9's sixth Sprint.

Reviewer Validation Result

- Reviewer validation complete: **Approved with Findings** (`NEXUS-REV-2026-07-16-007`). Confirmed Governance-Gated Advancement's Non-Blocking/Blocking classification, uniform Blocking treatment across Rejected/Deferred/Escalation Required, idempotent duplicate handling, and that `GovernanceService`, `GovernanceDecision`, `EventBusContract`, `DomainEvent`, `WorkflowChain`, `WorkflowStep`, `ExecutionStrategy`, `AssignmentPolicy`, `src/hosts`, and `src/adapters` are byte-for-byte unmodified. Independent re-validation confirmed `tsc --noEmit`, `npm run lint`, `npm run test` (83 files / 482 tests), `npm run build`, and `npm run test:extension-host:build` all pass cleanly.
- One Category 1, Minor finding recorded (`NEXUS-REV-2026-07-16-007-F-001`): new `IReviewRepository`/`IGovernanceDecisionRepository` dependencies on `EngineeringSessionService` diverge from Sprint 46's caller-supplied-outcome precedent. Non-blocking; does not require Sprint Owner ratification.
- **TASK-001 Resolution Verification** (`NEXUS-REV-2026-07-16-008`): the Builder selected Option B — `IMPLEMENTATION_REPORT.md` now documents the rationale for accepting direct repository resolution as the go-forward design for Governance-Gated Advancement. Confirmed via `git diff --stat` that no source or test file was modified. Independent re-validation confirmed `tsc --noEmit`, `npm run lint`, `npm run test` (83 files / 482 tests, unchanged), `npm run build`, and `npm run test:extension-host:build` all pass cleanly. `NEXUS-REV-2026-07-16-007-F-001` is confirmed **Resolved**. Sprint 57 is now fully closed with zero open findings of any category. See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-16-007`/`-008` for the complete reviews.

Objective

Implement the Governance-Gated Advancement Strategy authorized by RFC-0004 v1.11: an `EngineeringSession` advancement operation that consumes an already-produced, immutable `GovernanceDecision` (RFC-0011) and advances the current workflow position only when the `GovernanceDecision` is Approved, all existing Review-Gated Advancement requirements are satisfied, and all existing advancement prerequisites are satisfied. This is the first Sprint integrating the Governance capability (RFC-0011, Sprints 52–56) with the Engineering Workflow (RFC-0004, Sprints 39–51).

RFC Coverage

Primary

- RFC-0004 v1.11 — Execution Model ("Workflow Advancement" § Governance-Gated Advancement, new Advancement Strategy)

Referenced

- RFC-0011 — Engineering Governance Model v1.1 (`GovernanceDecision` consumed as immutable, read-only input; RFC-0011 unmodified)
- RFC-0010 — Kernel Boundaries

No RFC ownership changes are authorized beyond `NEXUS-RAT-2026-07-16-005`'s RFC-0004 v1.11 amendment.

Ratification

- `NEXUS-RAT-2026-07-16-006` — Sprint 57 scope ratification: governs this Sprint's entire authorized scope (Authorized Vertical Slice, Explicitly Unauthorized list, Required Test Matrix), narrowed by the Sprint Owner from a broader initially-proposed scope following `nexus-plan`'s Governance Report.
- `NEXUS-RAT-2026-07-16-005` — the companion RFC-0004 v1.11 amendment (Governance-Gated Advancement, Non-Blocking/Blocking classification) this Sprint implements.

Architectural Responsibilities (binding, mirroring Sprint 46's split)

| Concern | Owner |
| --- | --- |
| `GovernanceDecision` production, meaning, lifecycle | RFC-0011 / `GovernanceService` (unmodified) |
| Advancement eligibility, Non-Blocking/Blocking classification, workflow position advancement | RFC-0004 (this Sprint, consuming `NEXUS-RAT-2026-07-16-005`) |

Authorized Vertical Slice

- A new `EngineeringSession` operation (e.g. `advanceWorkflowAfterGovernanceDecision`) consuming an existing, already-produced `GovernanceDecision` (via existing, unmodified `GovernanceService` retrieval) as immutable input, classifying it per RFC-0004 v1.11 (Approved → Non-Blocking; Rejected/Deferred/Escalation Required → uniform Blocking, no sub-classification), and reusing Sprint 43/45/46's existing Advancement Eligibility, Result, and Failure semantics unchanged, extended only by the Governance-Gated eligibility check alongside the existing Review-Gated check.
- A corresponding thin `EngineeringSessionService` orchestration operation, mirroring Sprint 46's pattern (repository lookup, aggregate delegation, persistence only).
- A narrowly scoped `GovernanceDecisionRecorded` consumer that retrieves the persisted `GovernanceDecision` and delegates all eligibility/mutation to the above operation; the consumer itself owns no eligibility or mutation logic and remains deterministic and idempotent.
- Unit/integration tests covering the ten-row Required Test Matrix in `NEXUS-RAT-2026-07-16-006`.

Deferred Concepts

- Recovery Requirement records; recovery-plan generation (Sprint 58 candidate, unscheduled, requires its own RFC amendment).
- Any new Engineering Session state distinguishing Rejected/Deferred/Escalation Required beyond RFC-0004 v1.11's uniform Blocking classification (Sprint 58 candidate).
- Governed Mission Completion or any Mission completion precondition change (still unscheduled, requires its own future RFC-0001 amendment; superseded from the "Sprint 59" provisional naming by `NEXUS-RAT-2026-07-16-009`, which authorized Sprint 59 for Recovery Requirement Domain Event Publication instead).
- `WorkflowChain` topology mutation; `GovernanceDecision` reinterpretation; any `GovernanceService` side effect.
- Any `src/hosts` or `src/adapters` change.

Definition of Done

- `GovernanceDecision` is treated as immutable input; this Sprint does not modify or persist Governance state.
- Advancement preserves Sprint 43/45/46's existing Advancement Eligibility, Result, and Failure semantics unchanged, adding only the Governance-Gated eligibility check.
- Only `Approved` permits advancement; `Rejected`, `Deferred`, and `Escalation Required` all produce an identical, uniform Advancement Failure (no differentiated treatment).
- Existing approved advancement behavior (Sprint 43 Manual, Sprint 45 Automatic/Event-Driven, Sprint 46 Review-Gated) remains byte-for-byte identical for all non-governance-gated scenarios.
- Repeated invocation or duplicate `GovernanceDecisionRecorded` delivery produces no duplicate advancement.
- `WorkflowChain`, `WorkflowStep`, `ExecutionStrategy`, `AssignmentPolicy`, `GovernanceService`, `GovernanceDecision`, `EventBusContract`, and `DomainEvent` remain unmodified.
- No `src/hosts` or `src/adapters` file is modified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0057-governance-gated-workflow-advancement.md` for the complete Sprint Implementation Record.

---

## Sprint 56 — Governance Decision Domain Event Publication

Status: ✅ Approved with Findings — `NEXUS-REV-2026-07-16-006` (fully closed; one Category 4, Informational finding, zero Builder Tasks blocking; zero open findings of any blocking category). Authorized by `NEXUS-RAT-2026-07-16-002`; remediations authorized by `NEXUS-RAT-2026-07-16-003` (Mission Identity Rule, since withdrawn) and `NEXUS-RAT-2026-07-16-004` (RFC-0011 v1.1 Mission-Scoped Governance Evaluation). Milestone 9's fifth Sprint.

Objective

Publish exactly one Domain Event, `GovernanceDecisionRecorded`, for every persisted `GovernanceDecision`, reusing RFC-0005's reserved "Policy Events" category, per RFC-0011's Dependencies § requirement that Governance Decisions be published as Domain Events.

RFC Coverage

- RFC-0005 — Domain Event Model v1.0 (Primary; Domain Event, Event Identity/Attribution/Causality/Correlation, "Policy Events" category).
- RFC-0011 — Engineering Governance Model v1.1 (Primary; Dependencies § Domain Event publication requirement; Mission-Scoped Governance Evaluation §).

Ratification

- `NEXUS-RAT-2026-07-16-002` — governs this Sprint's entire binding scope: Event Model, Mission Identity, Publication Semantics, RFC Coverage, Dependencies, Authorized Concepts, Architectural Boundaries, and the Required Test Matrix.

Authorized Concepts

- `GovernanceDecisionRecorded` Domain Event type (single event, unchanged four-value outcome).
- Required `missionId` on the governance-evaluation request and `GovernanceDecision`, populated from the evaluation request.
- Resolved Review Mission mismatch validation producing `Escalation Required`.
- `EventBusContract` wiring into `GovernanceService`.
- Persist-before-publish event draining, mirroring the existing `ReviewService` pattern.
- Minimal `createKernelServices` wiring change.

Deferred Concepts

- Downstream consumption of `GovernanceDecisionRecorded` by any workflow gate, repository-write automation, or Host/Adapter surface.
- Evidence- or Shared-Reality-consuming Policy Criteria.
- Multi-Policy or multi-Ratification conflict arbitration beyond Sprint 55's existing scope.
- Any change to the four-value `GovernanceDecision` model's outcome semantics or the Mixed-Result Decision Table.
- Any change to `EventBusContract` or the `DomainEvent` envelope.
- Any `src/hosts` or `src/adapters` change.

Definition of Done

- Every `GovernanceDecision` production (all four outcomes, including both criterion-driven and attribution-driven Escalation Required) publishes exactly one `GovernanceDecisionRecorded` event with a correctly populated envelope.
- Idempotent re-evaluation publishes no duplicate event.
- `missionId` is obtained directly from the persisted `GovernanceDecision`, never resolved indirectly through the Review at publication time.
- `GovernanceDecision` is persisted before its event is recorded or published.
- No modification to the four-value `GovernanceDecision` model's existing outcome semantics, the Mixed-Result Decision Table, existing Policy Criterion predicates, `EventBusContract`, or `DomainEvent`.
- No `src/hosts` or `src/adapters` file is modified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0056-governance-decision-domain-event-publication.md` for the complete Sprint Implementation Record.

Reviewer Validation Result

- First review (`NEXUS-REV-2026-07-16-003`): **FAIL**. One Category 2, Critical finding (`-F-001`): an unratified `EvaluateGovernancePolicyCommand.missionId` fallback broke Sprint 53's frozen "missing Review → `Escalation Required`" guarantee. One Category 4, Minor finding (`-F-002`): `IMPLEMENTATION_REPORT.md` mischaracterized this as a "Known Limitation."
- First Recovery Review (`NEXUS-REV-2026-07-16-004`), after `NEXUS-RAT-2026-07-16-003` (Mission Identity Optionality) remediation: `-F-001`/`-F-002` confirmed Resolved, but implementing "`missionId` MAY be absent" surfaced a new Category 3, Critical finding (`NEXUS-REV-2026-07-16-004-F-001`): RFC-0005's unconditional Event Attribution requirement conflicted with the ratified Mission Identity Rule, realized via an unsound `as GovernanceDomainEvent` cast. **FAIL.**
- Sprint Owner resolution (`NEXUS-RAT-2026-07-16-004`): amended RFC-0011 to v1.1, adding a binding "Mission-Scoped Governance Evaluation" section — mandatory `missionId` on every governance evaluation request, independent of Review resolution; Review Mission mismatch and missing/unresolvable Review both produce `Escalation Required` retaining the requested Mission identity; `GovernanceDecisionRecorded` obtains `missionId` from the persisted `GovernanceDecision` with no cast. Withdrew `NEXUS-RAT-2026-07-16-003`'s Mission Identity Rule in its entirety.
- Second Recovery Review (`NEXUS-REV-2026-07-16-006`): **Approved with Findings**. Confirmed all twelve items of `NEXUS-RAT-2026-07-16-004`'s Authorized Builder Remediation implemented exactly as specified, including removal of the unsound cast at its root cause (verified via direct inspection of `governance.events.ts` and a repository-wide search confirming no `as GovernanceDomainEvent` cast or absent-Mission-attribution test assertion remains anywhere in `src/`/`test/`). Confirmed `EventBusContract`, `DomainEvent`, `src/hosts`, `src/adapters`, the Mixed-Result Decision Table, and existing Policy Criterion predicates are unmodified, and that RFC-0011 was not further modified by the Builder beyond the `nexus-plan`-authored v1.1 amendment. Independent re-validation confirmed `tsc --noEmit`, targeted Vitest (49/49), `npm run test` (83 files / 468 tests), `npm run build`, and `npm run test:extension-host:build` all pass cleanly.
- One Category 4, Informational finding recorded (`NEXUS-REV-2026-07-16-006-F-001`): `IMPLEMENTATION_REPORT.md`'s Sprint 56 Validation Summary reports 467 tests where two independent re-runs both confirm 468. Cosmetic only; does not generate a blocking Builder Task. Sprint 56 is fully closed with zero open findings of any blocking category.

---

## Sprint 55 — Ratification and Repository-Law Integration

Status: ✅ Approved — `NEXUS-REV-2026-07-16-002` (fully closed; one Category 6 Observation, zero Builder Tasks; zero open findings). Authorized by `NEXUS-RAT-2026-07-16-001`. Milestone 9's fourth Sprint.

Objective

Integrate Sprint 54's standalone `RatificationAttributionValidationService` into Sprint 53's Governance Decision production path as a single additive precondition to Policy Evaluation, per RFC-0011's Authority Hierarchy (tier 4, `RATIFICATION_LEDGER.md`) and Failure and Conflict Handling table.

RFC Coverage

- RFC-0011 — Engineering Governance Model v1.0 (Primary; Authority Hierarchy §, Failure and Conflict Handling §).
- Referenced: Sprint 53's `GovernanceDecision`/`PolicyEvaluation`/`GovernanceEscalation` (frozen structure, additively extended only); Sprint 54's `RatificationAttributionValidationService`/`RatificationAuthoritySnapshot` (frozen, consumed read-only for the first time).

Ratification

- `NEXUS-RAT-2026-07-16-001` — governs this Sprint's entire binding scope: Validation Ordering (attribution check precedes Policy Criteria evaluation), Escalation Attribution (required fields on an attribution-driven `GovernanceEscalation`), Determinism and Idempotency (Ratification Authority Snapshot fingerprint included in the deterministic evaluation key), Architectural Boundaries, and the Required Test Matrix. Approved With Changes following one Sprint Owner review cycle on the originating `nexus-plan` proposal.

Authorized Vertical Slice

- `GovernanceService` invokes `RatificationAttributionValidationService` for the `RepositoryPolicy` version under evaluation, before any Policy Criteria are evaluated.
- `Valid` attribution → existing Sprint 53 Policy Evaluation and decision-precedence logic proceeds unchanged.
- `Invalid`/`Unresolvable` attribution → Policy Criteria SHALL NOT be evaluated; exactly one `GovernanceDecision` with outcome `Escalation Required` is produced.
- `GovernanceEscalation` extended additively to preserve `RepositoryPolicy` identity/version, the referenced Ratification identity, the attribution-validation result, the deterministic attribution diagnostic, and the Ratification Authority Snapshot fingerprint/version consulted, for attribution-driven escalations.
- The deterministic evaluation key/idempotency mechanism extended to incorporate the Ratification Authority Snapshot fingerprint.
- Minimal `createKernelServices` wiring change supplying `GovernanceService` its new dependency.

Deferred Concepts

- Contradiction detection across multiple distinct Ratifications or Policies beyond Sprint 54's existing single-record scope.
- General repository-law interpretation or precedence.
- Automatic `RATIFICATION_LEDGER.md` ingestion.
- RFC-0005 Domain Event publication.
- Host-facing/Adapter-facing governance surfaces, durable persistence.
- Any change to the four-value `GovernanceDecision` model, the Mixed-Result Decision Table, or existing Policy Criterion predicates.
- Any `src/hosts` or `src/adapters` change.

Definition of Done

- Valid attribution + Approved/Rejected/Deferred/Escalation-Required criteria results all pass through unchanged from Sprint 53.
- Invalid or Unresolvable attribution always yields `Escalation Required`, without Policy Criteria evaluation.
- Identical complete inputs (`RepositoryPolicy` version, Review identity/version, Ratification Authority Snapshot fingerprint) yield identical decisions/diagnostics and no duplicate persisted records; a changed Snapshot fingerprint may yield a different decision.
- No modification to the four-value `GovernanceDecision` model, the Mixed-Result Decision Table, existing Policy Criterion predicates, or Sprint 52/54's existing behavior.
- No Domain Event, `src/hosts`, or `src/adapters` change.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0055-ratification-and-repository-law-integration.md` for the complete Sprint Implementation Record.

Reviewer Validation Result

- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-16-002`). Confirmed Validation Ordering, Escalation Attribution, and Determinism and Idempotency are implemented exactly as `NEXUS-RAT-2026-07-16-001` requires, each independently covered by a dedicated test reproducing every row of the Required Test Matrix, including exact-repeat idempotency and independent re-evaluation on a changed Snapshot fingerprint. Confirmed via source diff that the four-value `GovernanceDecision` model, the Mixed-Result Decision Table, and both existing Policy Criterion predicates are byte-for-byte unmodified, and that no RFC-0005 Domain Event, `src/hosts`, or `src/adapters` file was touched. Independent re-validation confirmed `tsc --noEmit`, ESLint, targeted Vitest (64/64), `npm run test` (83 files / 464 tests), `npm run build`, and `npm run test:extension-host:build` all pass cleanly.
- One Category 6, Informational Observation recorded (`NEXUS-REV-2026-07-16-002-F-001`): a wording tension in `NEXUS-RAT-2026-07-16-001` between its Architectural Boundaries clause (permitting additive wiring of Sprint 54's contract) and its Scope Restrictions clause (prohibiting modification of Sprint 54's files), surfaced by one strictly additive field added to Sprint 54's `RatificationAttributionValidationSnapshot` to satisfy this Sprint's own binding Determinism requirement. Sprint 54's existing outcome/diagnostic logic and its own pre-existing test file remain unmodified. Does not generate a Builder Task. Sprint 55 is fully closed with zero open findings.

---

## Sprint 54 — Ratification Attribution Validation Foundation

Status: ✅ Approved — `NEXUS-REV-2026-07-16-001` (fully closed; two Category 6 Observations, zero Builder Tasks; zero open findings). Authorized by `NEXUS-RAT-2026-07-15-017`. Milestone 9's third Sprint.

Objective

Validate the Ratification attribution recorded by exactly one immutable `RepositoryPolicy` version against one immutable collection of structured Ratification Authority Records, producing exactly one of three closed outcomes: Valid, Invalid, or Unresolvable. This Sprint does not interpret Ratification prose or intent, and does not integrate with `PolicyEvaluation`, `GovernanceDecision`, or `GovernanceService`.

RFC Coverage

- RFC-0011 — Engineering Governance Model v1.0 (Primary; Repository Policy § "attributable").
- RFC-0011 — Authority Hierarchy § (Referenced; tier-4 `RATIFICATION_LEDGER.md` relationship, not implemented this Sprint).
- `IMPLEMENTATION_CONSTITUTION.md` § Sprint Owner Ratifications (Referenced; explicit supersession/withdrawal documentation requirement).

Ratification

- `NEXUS-RAT-2026-07-15-017` — governs this Sprint's entire binding scope: the Objective diagram, Snapshot Cardinality (collection, not single-record), RatificationAuthorityRecord Fields, Closed Lifecycle Statuses (`Effective`/`Superseded`/`Withdrawn`), the Required Outcome Mapping table (Valid/Invalid/Unresolvable), Authorized Concepts, and Scope Boundary, following two Sprint Owner "Changes Required" review cycles on the original `nexus-plan` proposal.

Authorized Vertical Slice

- `RatificationAuthoritySnapshot` (or equivalently named canonical concept) — an immutable **collection** of `RatificationAuthorityRecord` entries, not a single Ratification.
- `RatificationAuthorityRecord` — identifier, date, subject, and any explicitly documented supersession/withdrawal reference.
- `RatificationAttributionValidation` (or equivalently named canonical capability) — consumes one `RepositoryPolicy` version's Ratification reference plus the Snapshot, produces exactly one of Valid / Invalid / Unresolvable per the ratified Required Outcome Mapping table.
- Repository contract and in-memory implementation for the Snapshot source.
- Deterministic diagnostics for every sub-condition in the Required Outcome Mapping table.
- Minimal `createKernelServices` wiring.

Deferred Concepts

- Ratification prose/intent interpretation; semantic applicability of a Ratification to Policy content.
- Contradiction detection across multiple distinct Ratifications or Policies (beyond a single record's internal contradiction).
- General repository-law interpretation or precedence.
- Integration with `PolicyEvaluation`, `GovernanceDecision`, or `GovernanceService`.
- Domain Event publication.
- Host-facing/Adapter-facing governance surfaces, durable persistence, automatic Ratification-Ledger ingestion beyond the Snapshot source contract.
- Any `src/hosts` or `src/adapters` change.

Definition of Done

- A currently-effective, uniquely-resolving, well-formed Ratification reference yields Valid.
- An explicitly superseded, explicitly withdrawn, duplicate, contradictory, or structurally malformed record yields Invalid, with a diagnostic identifying which condition applied.
- A missing/malformed/unresolvable reference or unavailable Snapshot source yields Unresolvable — never fabricated, never defaulted to Valid.
- No modification to Sprint 52's `RepositoryPolicy`/`PolicyCriterion` or Sprint 53's `PolicyEvaluation`/`GovernanceDecision`/`GovernanceEscalation`.
- No `GovernanceDecision`, `PolicyEvaluation`, or Domain Event is introduced, including as a stub.
- No `src/hosts` or `src/adapters` file is modified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

Implementation Result

- Builder implementation complete: added immutable Ratification Authority Snapshot/Record domain, standalone Ratification Attribution Validation service, in-memory Snapshot source repository, deterministic diagnostics for every Required Outcome Mapping condition, minimal Kernel composition wiring, and 14 Sprint 54 tests. Repository validation passed: TypeScript compile, ESLint, Vitest (83 files / 456 tests), esbuild, and extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0054-ratification-attribution-validation-foundation.md` for the complete Sprint Implementation Record.

Reviewer Validation Result

- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-16-001`). Confirmed `RatificationAuthoritySnapshot`/`RatificationAuthorityRecord`/`RatificationAttributionValidationService` implement exactly `NEXUS-RAT-2026-07-15-017`'s Authorized Scope, including the ratified Snapshot Cardinality correction, the closed three-value lifecycle status set, and every row of the Required Outcome Mapping table, each independently tested. Confirmed via source inspection, a full import-graph check, and a dedicated negative test that the capability exposes no `GovernanceDecision`, `PolicyEvaluation`, event-publication, host, or adapter surface, and is composed by `createKernelServices()` as a fully standalone service, never wired into `GovernanceService`/`RepositoryPolicyService`. Confirmed Sprint 52's `RepositoryPolicy`/`PolicyCriterion` and Sprint 53's `PolicyEvaluation`/`GovernanceDecision`/`GovernanceEscalation` are byte-for-byte unmodified. Independent re-validation confirmed `tsc --noEmit`, ESLint, targeted Vitest (19/19), `npm run test` (83 files / 456 tests), `npm run build`, and `npm run test:extension-host:build` all pass cleanly.
- Two Category 6, Informational Observations recorded (`NEXUS-REV-2026-07-16-001-F-001`, `-F-002`): a recurrence of the pre-existing, systemic Sprint 21 process-timing flake (confirmed passing in isolation on three consecutive re-runs), and a minor Dependencies-wording precision gap in `NEXUS-RAT-2026-07-15-017` (read-only consumption of `RepositoryPolicy` identity/version for output attribution, slightly broader than the ratification's literal "Ratification reference field only" phrasing). Neither generates a Builder Task. Sprint 54 is fully closed with zero open findings.

---

## Sprint 53 — Policy Evaluation and Governance Decision Foundation

Status: ✅ Approved — `NEXUS-REV-2026-07-15-010`/`-011`/`-012` (fully closed; one Category 1, Minor finding resolved by TASK-001; one Category 4, Informational documentation finding resolved by DOC-001; zero open findings of any category). Authorized by `NEXUS-RAT-2026-07-15-016`. Milestone 9's second Sprint.

Objective

Implement deterministic evaluation of exactly one immutable `RepositoryPolicy` version against one `Review`, producing exactly one immutable, attributable `GovernanceDecision` (Approved, Rejected, Deferred, or Escalation Required), per RFC-0011's Policy Evaluation, Governance Decision, Governance Escalation, and Failure and Conflict Handling sections.

RFC Coverage

- RFC-0011 — Engineering Governance Model v1.0 (Primary; Policy Evaluation, Governance Decision, Governance Escalation, Failure and Conflict Handling).
- RFC-0006 — Engineering Assessment Model (Referenced; finalized Review Outcome/Finding consumption only, unmodified).
- RFC-0005 — Domain Event Model (Referenced; Policy Events remain deferred).
- RFC-0010 — Kernel Boundaries (Referenced).

Ratification

- `NEXUS-RAT-2026-07-15-016` — governs this Sprint's entire binding scope: Evaluation Input Boundary, Finalized Review Boundary and Missing Review Resolution (Final Refinement 1), Closed Predicate Model and `UnresolvedFindingMatch` Polarity (Final Refinement 2), Governance Decision Precedence and Mixed-Result Decision Table, Deterministic Time/Identity/Idempotency, PolicyEvaluation/GovernanceDecision/GovernanceEscalation models, GovernanceService boundary, repository contract, and Failure-Closed Requirements.
- `NEXUS-RAT-2026-07-15-015` — approved the Sprint 53/54 merge in principle; formally activated by `NEXUS-RAT-2026-07-15-016`.

Authorized Concepts

- `PolicyEvaluation`, `PolicyEvaluationId`, `PolicyCriterionResult`, `PolicyCriterionResultStatus`.
- `GovernanceDecision`, `GovernanceDecisionId`, and the four canonical values (Approved, Rejected, Deferred, Escalation Required).
- `GovernanceEscalation`.
- `IGovernanceDecisionRepository` and an in-memory append-only implementation.
- `GovernanceService` (thin orchestration only).
- Two closed predicate kinds: `ReviewOutcomeMembership`, `UnresolvedFindingMatch` (with explicit `expectedMatch` polarity).
- Minimal `createKernelServices` wiring for the new repository/service.

Deferred Concepts

- Evidence- and Shared Reality-consuming Policy Criteria; multi-Policy evaluation, precedence, and conflict arbitration.
- Ratification-Ledger content/authority validation; repository-law interpretation.
- RFC-0005 Policy Events, Domain Event publication.
- Downstream Governance Decision consumers, policy enforcement, workflow gates.
- Host-facing/Adapter-facing governance surfaces, durable persistence.
- Any `src/hosts` or `src/adapters` change.

Definition of Done

- One `RepositoryPolicy` version and one finalized Review produce exactly one `GovernanceDecision`; Governance Decision precedence is deterministic and evaluation-order-independent.
- Existing non-final/incomplete Review → Deferred; missing/unresolvable Review → Escalation Required (never Deferred, Approved, or Rejected).
- Unsupported predicates, malformed descriptors, unsupported schema versions, and invalid `expectedMatch` values → Escalation Required.
- `GovernanceDecision` records are immutable, append-only, and idempotent for identical inputs; `GovernanceService` remains thin; `RepositoryPolicy` and `Review` remain unchanged.
- No Domain Event is published; no `src/hosts` or `src/adapters` file is modified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0053-policy-evaluation-and-governance-decision-foundation.md` for the complete Sprint Implementation Record.

Reviewer Validation Result

- Reviewer validation complete: **Approved with Findings** (`NEXUS-REV-2026-07-15-010`). Confirmed `PolicyEvaluation`/`GovernanceDecision`/`GovernanceEscalation` implement exactly RFC-0011's Policy Evaluation/Governance Decision/Governance Escalation sections within `NEXUS-RAT-2026-07-15-016`'s Authorized Scope, including both Final Refinements; confirmed the ratified Governance Decision Precedence and full Mixed-Result Decision Table via parameterized tests reproducing every ratified row; confirmed `GovernanceService` is thin with zero downstream mutation, workflow, Ratification, Adapter, or event-publication surface via a dedicated negative test; confirmed a full import-graph check shows zero cross-domain imports and that Sprint 52's `RepositoryPolicy` and Sprint 9's `Review` are byte-for-byte unmodified; confirmed no wall-clock read exists in the evaluation path. Independent re-validation confirmed `tsc --noEmit`, ESLint, `npm run test` (Vitest 82 files / 441 tests), `npm run build`, and `npm run test:extension-host:build` all pass cleanly.
- One Category 1, Minor finding recorded (`NEXUS-REV-2026-07-15-010-F-001`): `InMemoryGovernanceDecisionRepository`'s contradictory-duplicate equivalence check compares entire snapshots (including randomly-generated identifiers and the caller-supplied timestamp) rather than only semantically relevant fields, so two concurrent (non-sequential) evaluations for the same evaluation key can spuriously throw `ContradictoryGovernanceDecisionError` even when semantically identical. Repeated sequential evaluation is correctly idempotent and directly tested; the gap is reachable only under concurrent racing. Does not block approval. Recommend a follow-up Builder Task via `nexus-sprint`; no Sprint Owner ratification required.
- **TASK-001 Remediation Verification** (`NEXUS-REV-2026-07-15-011`): confirmed `NEXUS-REV-2026-07-15-010-F-001` is fully resolved — `canonicalizeGovernanceDecision`/`canonicalizeGovernanceEscalation` now compare only semantic fields, verified by a new regression test reproducing the original race scenario; genuine-contradiction rejection continues to pass unmodified; no other Sprint 53 behavior or Sprint 52/9 file was touched. Independent re-validation: `tsc --noEmit`, ESLint, `npm run test` (82 files / 442 tests), `npm run build`, `npm run test:extension-host:build` all clean. One new Category 4, Informational finding recorded (`NEXUS-REV-2026-07-15-011-F-001`): `IMPLEMENTATION_REPORT.md`'s Sprint 53 Validation Summary still reports 441 tests instead of the corrected 442. Cosmetic only; recommend a Documentation Task via `nexus-sprint`.
- **DOC-001 Documentation Correction Verification** (`NEXUS-REV-2026-07-15-012`): confirmed `NEXUS-REV-2026-07-15-011-F-001` is fully resolved — `IMPLEMENTATION_REPORT.md`'s Sprint 53 Validation Summary now reads "82 files, 442 tests," verified by an independent `npm run test` re-run and by direct inspection; `git diff --stat` confirmed only `IMPLEMENTATION_REPORT.md`, `IMPLEMENTATION_MANIFEST.md` (mirrored citation), and `builder-task.md` changed — no source, test, RFC, Kernel Canon, or Ratification touched. Sprint 53 is now **fully closed with zero open findings of any category** across `NEXUS-REV-2026-07-15-010`, `-011`, and `-012`.

---

## Sprint 52 — Governance Policy Model Foundation

Status: ✅ Approved — `NEXUS-REV-2026-07-15-009` (fully closed; two Category 6 Observations, zero Builder Tasks; zero open findings). Authorized by `NEXUS-RAT-2026-07-15-015`. Milestone 9's opening Sprint.

Objective

Introduce `RepositoryPolicy` as an immutable, ratification-attributed, versioned Kernel domain concept. Sprint 52 establishes only the policy-definition and version-history foundation required by future deterministic Policy Evaluation. It does not implement evaluation, decision production, escalation, event publication, or cross-domain consumption.

RFC Coverage

- RFC-0011 — Engineering Governance Model v1.0 (Primary; Repository Policy, Policy Criterion, immutability, versioning/supersession, attribution).
- RFC-0005 — Domain Event Model (Referenced; no Domain Events authorized this Sprint).

Ratification

- `NEXUS-RAT-2026-07-15-015` — governs this Sprint's entire scope: the binding Objective, RepositoryPolicy Aggregate, Version Lineage Rules, PolicyCriterion Boundary, Criterion Integrity, Ratification Attribution, Repository Contract, RepositoryPolicyService, and Kernel Composition rules.
- `NEXUS-RAT-2026-07-15-014` — the companion RFC-0011 Final ratification this Sprint implements.

Authorized Concepts

- `RepositoryPolicy`, `RepositoryPolicyId`, `PolicyCriterion`, policy version, policy supersession reference, Ratification attribution reference.
- `IRepositoryPolicyRepository` and in-memory implementation.
- `RepositoryPolicyService` (registration, supersession, retrieval, current-version lookup, enumeration, version-history enumeration; thin orchestration only).
- Minimal `createKernelServices` wiring for the new repository/service.

Deferred Concepts

- Policy Criterion predicate evaluation, Policy Evaluation, Governance Decision (Approved/Rejected/Deferred/Escalation Required), Governance Escalation.
- Evidence, Shared Reality, Review Outcome/Finding consumption.
- Ratification-Ledger content validation, policy authority/conflict/precedence resolution.
- RFC-0005 Policy Events, Domain Event publication.
- Policy activation/enforcement, workflow gates, repository-write automation, Host-facing policy surfaces, durable persistence.
- Any `src/hosts` or `src/adapters` change.

Definition of Done

- `RepositoryPolicy` versions are immutable; supersession creates a new version without mutating history while preserving stable identity; version numbers sequential; policy history linear (no forking); duplicate/skipped/regressed versions rejected.
- Policy Criteria ordered, immutable, unique identifiers within a version; never evaluated or interpreted.
- Every version carries Ratification attribution (structural-format validation only; no ledger access).
- `RepositoryPolicyService` remains orchestration-only.
- No Governance Decision, Governance Escalation, or Domain Event is introduced, including as a stub.
- No `src/hosts` or `src/adapters` file is modified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0052-governance-policy-model-foundation.md` for the complete Sprint Implementation Record.

Reviewer Validation Result

- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-15-009`). Confirmed `RepositoryPolicy`/`PolicyCriterion` are new, additive Kernel governance concepts implementing exactly RFC-0011's Repository Policy/Policy Criterion sections; confirmed the ratified Version Lineage Rules are enforced at both the aggregate and repository layers with no mutation path; confirmed `PolicyCriterion` is inert declarative data with no predicate/evaluation logic anywhere in the diff; confirmed `RepositoryPolicyService` is thin orchestration with zero Policy Evaluation, Governance Decision, Governance Escalation, Ratification-Ledger access, cross-domain access, or event publication, verified by source inspection, a full import-graph check (zero cross-domain imports), and dedicated negative tests. Confirmed `create-kernel-services.ts` and `kernel-boundary-certification.integration.test.ts` were extended additively only, and no `src/hosts` or `src/adapters` file was touched. Independent re-validation confirmed `tsc --noEmit`, ESLint, `npm run test` (Vitest 81 files / 405 tests on full-suite re-run), `npm run build`, and `npm run test:extension-host:build` all pass cleanly.
- Two Category 6, Informational Observations recorded (`NEXUS-REV-2026-07-15-009-F-001`, `-F-002`): pre-existing, systemic `kernel-service-map.md` drift predating this Sprint (also missing prior Approved sprints' services), and a transient process-timing flake in an unrelated, unmodified Sprint 21 test (confirmed passing in isolation and on full-suite re-run). Neither generates a Builder Task. Sprint 52 is fully closed with zero open findings.

---

# Milestone 10 — Autonomous Engineering Readiness

Status: ✅ COMPLETE (Sprint 63 through Sprint 70). Declared Complete by `NEXUS-RAT-2026-07-17-009`. (Sprint 63 — Governance State Projection Foundation is ✅ Approved — `NEXUS-REV-2026-07-16-016`, originally authorized by `NEXUS-RAT-2026-07-16-015`; briefly 🔴 Blocked per `NEXUS-REV-2026-07-16-015` pending a Workflow-position attribution gap; narrowed to Mission-scoped-only reporting and implemented under `NEXUS-RAT-2026-07-16-016`; fully closed with zero open findings of any blocking category. Sprint 64 — Event-Driven Mission Completion is ✅ Approved — `NEXUS-REV-2026-07-16-017`, authorized by `NEXUS-RAT-2026-07-16-017`, which narrows Milestone 10 Step 2 — Event-Driven Workflow Coordination — to Mission Completion only; fully closed with zero open findings of any blocking category. Sprint 65 — EngineeringSession Domain Event Publication is ✅ Approved — `NEXUS-REV-2026-07-17-001`, authorized by `NEXUS-RAT-2026-07-16-018` and revised by `NEXUS-RAT-2026-07-16-019` after a Cycle 1 pre-implementation Builder block; fully closed with zero open findings of any blocking category. Sprint 66 — Engineering Session State Projection is ✅ Approved — `NEXUS-REV-2026-07-17-002`, authorized by `NEXUS-RAT-2026-07-17-001`, fulfilling the Prerequisite Foundation item named by `NEXUS-RAT-2026-07-16-018`; fully closed with zero open findings of any blocking category. `nexus-plan`'s post-Sprint-66 Governance Scan found that the Prerequisite Foundation resolved only the *outbound* half of the Milestone 10 attribution gap (Engineering Session publishing its own Workflow position); the *inbound* half (a Mission-scoped Review/`GovernanceDecision` tracing back to the governed Workflow position that produced it) remained unresolved by any prior ratification. The Sprint Owner resolved this via `NEXUS-RAT-2026-07-17-002` (RFC-0004 v1.14 amendment, Engineering Decision Correlation) and `NEXUS-RAT-2026-07-17-003` (Sprint 67 scope), revising the Initial Capability Sequence to insert Sprint 67 ahead of Event-Driven Workflow Advancement. **Sprint 67 — Engineering Decision Correlation Foundation is ✅ Approved — `NEXUS-REV-2026-07-17-003`/`NEXUS-REV-2026-07-17-004`** (Approved with Findings; its one Category 4, Minor Documentation Drift finding was resolved via `DOC-TASK-067-001` and independently verified Resolved; two Category 6 Observations remain outstanding, informational, non-blocking). `nexus-plan`'s post-Sprint-67 Governance Scan found that Event-Driven Workflow Advancement (Sprint 68) had no authorized mechanism definition; the Sprint Owner resolved this via `NEXUS-RAT-2026-07-17-004` (RFC-0004 v1.15 amendment, Event-Driven Workflow Advancement) and `NEXUS-RAT-2026-07-17-005` (Sprint 68 scope). **Sprint 68 — Event-Driven Workflow Advancement is ✅ Approved — `NEXUS-REV-2026-07-17-005`** (fully closed with zero open findings of any blocking category; one Category 6, Informational Observation, no Builder Task). `nexus-plan`'s post-Sprint-68 Governance Scan found that Recovery Workflow Automation (Sprint 69) had no authorized mechanism definition; the Sprint Owner resolved this via `NEXUS-RAT-2026-07-17-006` (RFC-0004 v1.16 amendment, Recovery Workflow Automation) and `NEXUS-RAT-2026-07-17-007` (Sprint 69 scope). **Sprint 69 — Recovery Workflow Automation is ✅ Approved — `NEXUS-REV-2026-07-17-006`** (fully closed with zero open findings of any blocking category; one Category 6, Informational Observation, no Builder Task). `nexus-plan`'s post-Sprint-69 Governance Scan found that Autonomous Engineering Integration Validation (Sprint 70) required no preceding RFC-0004 amendment — unlike Steps 2 and 3, its description already defines no new mechanism, consumer, or domain concept, matching the Sprint 62 / Milestone 9 closure precedent. The Sprint Owner authorized it via `NEXUS-RAT-2026-07-17-008` (Sprint-scope ratification only). **Sprint 70 — Autonomous Engineering Integration Validation is ✅ Approved — `NEXUS-REV-2026-07-17-008`** (BT-070-001 Resolution Verification; fully closed with zero open findings of any category; originally Rejected under `NEXUS-REV-2026-07-17-007` on one Category 2, Critical finding, resolved via `BT-070-001`), Milestone 10's closing Sprint. Milestone 10 Completion Conditions per `NEXUS-RAT-2026-07-17-008` appear satisfied; formal Milestone 10 closure and any future Sprint scoping for the historical-decision-superseding Mission Completion gap Sprint 70 discovered, reported, and left unimplemented are reserved for the next authorized `nexus-plan` cycle.)

Objective

Transform the deterministic execution and governance foundations completed through Milestone 9 into a closed-loop engineering workflow capable of reacting to authoritative engineering outcomes with reduced manual coordination.

RFC Coverage

- RFC-0004 — Execution Model (Referenced; consumed read-only through existing public contracts)
- RFC-0005 — Domain Event Model (Referenced; first concrete consumer of existing `GovernanceDecisionRecorded`/`RecoveryRequirementCreated`/`RecoveryRequirementResolved`/`RecoveryRequirementWithdrawn` events)
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision`/`RecoveryRequirement` consumed read-only and unmodified)
- RFC-0001 — Mission Model (Referenced)

Ratification

- `NEXUS-RAT-2026-07-16-015` — opens Milestone 10, sets the binding Objective and Architectural Boundary, defines the non-binding-sequencing Initial Capability Sequence, and authorizes Sprint 63.
- `NEXUS-RAT-2026-07-16-016` — resolves `NEXUS-REV-2026-07-16-015-F-001` by narrowing Sprint 63 to Mission-scoped-only governance state reporting, removing all Workflow-Step-level attribution requirements. Milestone 10's Objective, Architectural Boundary, and Initial Capability Sequence from `NEXUS-RAT-2026-07-16-015` remain unmodified.
- `NEXUS-RAT-2026-07-16-017` — narrows Milestone 10 Step 2 to Event-Driven Mission Completion only and authorizes Sprint 64.
- `NEXUS-RAT-2026-07-16-018` — resolves the Event-Driven Workflow Advancement/Recovery Workflow Automation session-attribution gap by authorizing `EngineeringSession` Domain Event Publication (Sprint 65) as the prerequisite foundation, per the ratified sequence Domain Event Publication → Session State Projection → Event-Driven Consumers.
- `NEXUS-RAT-2026-07-17-001` — authorizes Sprint 66, Engineering Session State Projection, fulfilling the remaining Prerequisite Foundation item.
- `NEXUS-RAT-2026-07-17-002` — amends RFC-0004 to v1.14, adding Engineering Decision Correlation, resolving the inbound half of the attribution gap left open by `NEXUS-RAT-2026-07-16-018`'s Prerequisite Foundation.
- `NEXUS-RAT-2026-07-17-003` — authorizes Sprint 67, Engineering Decision Correlation Foundation, implementing RFC-0004 v1.14.
- `NEXUS-RAT-2026-07-17-004` — amends RFC-0004 to v1.15, adding Event-Driven Workflow Advancement, resolving Sprint 68's mechanism-definition gap.
- `NEXUS-RAT-2026-07-17-005` — authorizes Sprint 68, Event-Driven Workflow Advancement, implementing RFC-0004 v1.15.
- `NEXUS-RAT-2026-07-17-006` — amends RFC-0004 to v1.16, adding Recovery Workflow Automation, resolving Sprint 69's mechanism-definition gap.
- `NEXUS-RAT-2026-07-17-007` — authorizes Sprint 69, Recovery Workflow Automation, implementing RFC-0004 v1.16.

Architectural Boundary (binding, from `NEXUS-RAT-2026-07-16-015`)

Milestone 10 SHALL NOT begin with Host or Adapter governance UI; isolated `MissionPaused`/`MissionResumed` lifecycle correction; generic event-subscription infrastructure without a concrete consumer; or further narrow Milestone 9 recovery refinements. These MAY be addressed later as supporting work but do not define the milestone's opening architecture. Milestone 10 SHALL NOT introduce autonomous architectural decision-making, autonomous ratification, or AI governance deliberation at any point in its Initial Capability Sequence.

Initial Capability Sequence (non-binding sequencing; each step requires its own future Sprint scope ratification)

1. Governance State Projection (Sprint 63 — authorized)
2. Event-Driven Workflow Coordination (narrowed to Event-Driven Mission Completion only — Sprint 64, authorized by `NEXUS-RAT-2026-07-16-017`; Event-Driven Workflow Advancement is Sprint 68, authorized by `NEXUS-RAT-2026-07-17-005`, implementing RFC-0004 v1.15)
3. Recovery Workflow Automation (Sprint 69 — ✅ Approved, `NEXUS-REV-2026-07-17-006`, authorized by `NEXUS-RAT-2026-07-17-007`, implementing RFC-0004 v1.16)
4. Autonomous Engineering Integration Validation (Sprint 70 — Implemented — Pending Reviewer Validation, authorized by `NEXUS-RAT-2026-07-17-008`)

Prerequisite Foundation (authorized by `NEXUS-RAT-2026-07-16-018`/`NEXUS-RAT-2026-07-17-002`; not itself a numbered Initial Capability Sequence step, but required before Steps 2's remainder and 3 could be sequenced)

- EngineeringSession Domain Event Publication (Sprint 65 — ✅ Approved, `NEXUS-REV-2026-07-17-001`) — outbound half.
- EngineeringSession Session State Projection (Sprint 66 — ✅ Approved, `NEXUS-REV-2026-07-17-002`) — outbound half.
- Engineering Decision Correlation Foundation (Sprint 67 — ✅ Approved, `NEXUS-REV-2026-07-17-003`/`NEXUS-REV-2026-07-17-004`, implementing RFC-0004 v1.14) — inbound half.

Status

- `NEXUS-RAT-2026-07-16-015` opens Milestone 10 and authorizes Sprint 63 — Governance State Projection Foundation as its opening Sprint.
- Sprint 63's first implementation cycle was Blocked (`NEXUS-REV-2026-07-16-015`): the Builder correctly stopped before writing code upon discovering that the Sprint's original per-Workflow-position Objective could not be satisfied by any authorized data source. `NEXUS-RAT-2026-07-16-016` narrowed the Objective to Mission-scoped-only reporting, resolving the block.
- Sprint 63 is **✅ Approved** (`NEXUS-REV-2026-07-16-016`; fully closed with zero open findings of any blocking category; two Category 6, Informational Observations, no Builder Task) under its narrowed scope. See `knowledge/implementation/sprints/sprint-0063-governance-state-projection-foundation.md` for the complete Sprint Implementation Record.
- `nexus-plan`'s Sprint 64 candidacy analysis found that Milestone 10 Step 2 as originally sequenced ("invoke existing advancement and completion authorities") cannot be implemented as a single coherent Sprint: Mission Completion is satisfiable Mission-scoped, but Workflow Advancement requires Engineering-Session/Workflow-Step attribution the Mission-scoped-only `GovernanceStateProjection` is prohibited from supplying (RFC-0004 Workflow Advancement; `NEXUS-RAT-2026-07-16-016`). The Sprint Owner narrowed Step 2 to Mission Completion only via `NEXUS-RAT-2026-07-16-017`.
- **Sprint 64 — Event-Driven Mission Completion is ✅ Approved** (`NEXUS-REV-2026-07-16-017`; fully closed with zero open findings of any blocking category; one Category 6, Informational Observation, no Builder Task). See `knowledge/implementation/sprints/sprint-0064-event-driven-mission-completion.md` for the complete Sprint Implementation Record.
- `nexus-plan`'s post-Sprint-64 Governance Scan found that Event-Driven Workflow Advancement (Step 2's remainder) and Recovery Workflow Automation (Step 3) are both blocked by the same root cause: no authorized data source supplies Engineering-Session/Workflow-Step attribution to an automatic, event-driven consumer, and `EngineeringSession` itself publishes no Domain Events. The Sprint Owner resolved this via `NEXUS-RAT-2026-07-16-018`, authorizing `EngineeringSession` Domain Event Publication as the prerequisite foundation, per the sequence Domain Event Publication → Session State Projection → Event-Driven Consumers.
- **Sprint 65 — EngineeringSession Domain Event Publication is ✅ Approved** (`NEXUS-REV-2026-07-17-001`; fully closed with zero open findings of any blocking category; one Category 6, Informational Observation, no Builder Task). Cycle 1 was blocked pre-implementation on the Builder's own initiative; `NEXUS-RAT-2026-07-16-019` revised the scope and Cycle 2 was implemented and certified. See `knowledge/implementation/sprints/sprint-0065-engineeringsession-domain-event-publication.md` for the complete Sprint Implementation Record.
- `nexus-plan`'s post-Sprint-65 Sprint Proposal recommended Sprint 66 — Engineering Session State Projection, consuming Sprint 65's `EngineeringSessionWorkflowAdvanced` stream to fulfill the remaining Prerequisite Foundation item named by `NEXUS-RAT-2026-07-16-018`. The Sprint Owner approved with binding refinements via `NEXUS-RAT-2026-07-17-001`.
- **Sprint 66 — Engineering Session State Projection is ✅ Approved** (`NEXUS-REV-2026-07-17-002`; fully closed with zero open findings of any blocking category). See `knowledge/implementation/sprints/sprint-0066-engineering-session-state-projection.md` for the complete Sprint Implementation Record.
- `nexus-plan`'s post-Sprint-66 Governance Scan found that the Prerequisite Foundation (Sprint 65/66) resolved only the outbound half of the Milestone 10 attribution gap; the inbound half — a Mission-scoped Review/`GovernanceDecision` tracing back to the governed Workflow position that produced it — remained unresolved by any prior ratification, since `Review`/`GovernanceDecision` (RFC-0006/RFC-0011) carry no Engineering Session or Workflow Step identity. The Sprint Owner resolved this by amending RFC-0004 to v1.14 (`NEXUS-RAT-2026-07-17-002`), adding Engineering Decision Correlation, and authorized its implementation as Sprint 67 (`NEXUS-RAT-2026-07-17-003`), revising the Initial Capability Sequence to Sprint 67 → 68 (Event-Driven Workflow Advancement) → 69 (Recovery Workflow Automation) → 70 (Autonomous Engineering Integration Validation).
- **Sprint 67 — Engineering Decision Correlation Foundation is ✅ Approved** (`NEXUS-REV-2026-07-17-003`, Approved with Findings; one Category 4, Minor Documentation Drift finding resolved via `DOC-TASK-067-001`, independently verified Resolved by `NEXUS-REV-2026-07-17-004`; two Category 6 Observations outstanding, informational). See `knowledge/implementation/sprints/sprint-0067-engineering-decision-correlation-foundation.md` for the complete Sprint Implementation Record.
- `nexus-plan`'s post-Sprint-67 Governance Scan found that Sprint 68 — Event-Driven Workflow Advancement had no authorized mechanism definition: the existing `GovernanceGatedWorkflowAdvancementConsumer` (Sprint 57) is not wired to the `EventBus` and requires caller-supplied Engineering Session/Workflow Step identifiers, and RFC-0004 v1.14's Engineering Decision Correlation section explicitly defers Event-Driven Workflow Advancement's mechanics to its own future Sprint Owner scope ratification. `nexus-plan` presented a Governance Report; the Sprint Owner resolved this by amending RFC-0004 to v1.15 (`NEXUS-RAT-2026-07-17-004`), adding Event-Driven Workflow Advancement, and authorized its implementation as Sprint 68 (`NEXUS-RAT-2026-07-17-005`).
- **Sprint 68 — Event-Driven Workflow Advancement is ✅ Approved** (`NEXUS-REV-2026-07-17-005`; fully closed with zero open findings of any blocking category; one Category 6, Informational Observation, no Builder Task). See `knowledge/implementation/sprints/sprint-0068-event-driven-workflow-advancement.md` for the complete Sprint Implementation Record.
- `nexus-plan`'s post-Sprint-68 Governance Scan found that Sprint 69 — Recovery Workflow Automation had no authorized mechanism definition: the existing `RecoveryRequirementGovernanceDecisionConsumer` (Sprint 58/59) is not wired to the `EventBus` and requires caller-supplied Engineering Session/Workflow Step identifiers, and RFC-0004 v1.15's Event-Driven Workflow Advancement section explicitly defers Recovery Workflow Automation's mechanics to its own future Sprint Owner scope ratification. `nexus-plan` presented a Governance Report; the Sprint Owner resolved this by amending RFC-0004 to v1.16 (`NEXUS-RAT-2026-07-17-006`), adding Recovery Workflow Automation, and authorized its implementation as Sprint 69 (`NEXUS-RAT-2026-07-17-007`).
- **Sprint 69 — Recovery Workflow Automation is ✅ Approved** (`NEXUS-REV-2026-07-17-006`; fully closed with zero open findings of any blocking category; one Category 6, Informational Observation, no Builder Task). See `knowledge/implementation/sprints/sprint-0069-recovery-workflow-automation.md` for the complete Sprint Implementation Record.
- **Sprint 70 — Autonomous Engineering Integration Validation is ✅ Approved** (`NEXUS-REV-2026-07-17-008`, BT-070-001 Resolution Verification; fully closed with zero open findings of any category). The Builder added the integration-only certification suite, then — after `NEXUS-REV-2026-07-17-007` rejected an unratified Mission Completion latest-GovernanceDecision change as a Category 2 Critical Architectural Violation — reverted it via `BT-070-001`, restoring RFC-0001 v1.1 §15a's independent-satisfaction rule byte-for-byte, and recorded the underlying historical-decision-superseding completion gap as unresolved and unimplemented, pending future governance resolution. See `knowledge/implementation/sprints/sprint-0070-autonomous-engineering-integration-validation.md` for the complete Sprint Implementation Record.
- Milestone 10's Initial Capability Sequence (Steps 1–4, Sprints 63–70) is now fully implemented and certified. Per `NEXUS-RAT-2026-07-17-008`'s Milestone 10 Completion Conditions, all required scenarios pass, no Category 1–5 findings remain open, and repository state is synchronized — the conditions for closure appear satisfied. Consistent with the Sprint 62 / Milestone 9 precedent, formal Milestone 10 closure, and any future Sprint proposal to address the historical-decision-superseding Mission Completion gap, are reserved for the next authorized `nexus-plan` cycle. No further Milestone 10 Sprint is Current.

---

## Sprint 63 — Governance State Projection Foundation

Status: ✅ Approved — `NEXUS-REV-2026-07-16-016` (Mission-scoped-only; fully closed with zero open findings of any blocking category; two Category 6, Informational Observations, no Builder Task). This Sprint's first cycle was briefly 🔴 Blocked — Governance Decision Required (`NEXUS-REV-2026-07-16-015`): the Builder correctly stopped before writing code upon discovering that a per-Workflow-position Objective could not be satisfied by any authorized data source. The Sprint Owner resolved this via `NEXUS-RAT-2026-07-16-016`, narrowing the Objective below to Mission-scoped-only reporting, under which the Builder implemented and the Reviewer certified this Sprint. Milestone 10's opening Sprint.

Builder Implementation Summary

- Added immutable `GovernanceStateProjection` read model, `IGovernanceStateProjectionRepository`/`InMemoryGovernanceStateProjectionRepository`, and `GovernanceStateProjectionService` — the system's first concrete Domain Event consumer — under `src/kernel/governance/`.
- Consumes only `GovernanceDecisionRecorded`, `RecoveryRequirementCreated`, `RecoveryRequirementResolved`, and `RecoveryRequirementWithdrawn` through the existing, unmodified `EventBusContract`.
- Wired `createKernelServices()` additively; updated `kernel-boundary-certification.integration.test.ts` for the new service and minimally updated the Sprint 62 production-drift self-check to allowlist exactly the new Sprint 63 files.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest (86 files / 551 tests), esbuild, and extension-host bundle build. Independently re-verified by the Reviewer.

Objective

Implement the first concrete Domain Event consumer in the system: a deterministic, **Mission-scoped only** read model (`GovernanceStateProjection`) reporting, per Mission, the latest authoritative `GovernanceDecision` and its outcome, unresolved Recovery Requirements and their lifecycle state, whether any governance state remains Blocking, whether Escalation Required is present, and Mission-level governance diagnostics and attribution — built by consuming existing `GovernanceDecisionRecorded`, `RecoveryRequirementCreated`, `RecoveryRequirementResolved`, and `RecoveryRequirementWithdrawn` Domain Events. This Sprint introduces no workflow mutation, no Host UI, and no Engineering-Session- or Workflow-Step-level attribution of any kind.

RFC Coverage

- RFC-0005 — Domain Event Model (Referenced; first concrete Domain Event consumer, subscribing to existing event types only)
- RFC-0004 — Execution Model (Referenced; Workflow Advancement/Recovery state consumed read-only)
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision` consumed read-only)
- RFC-0001 — Mission Model (Referenced; projection is Mission-scoped)

Ratification

- `NEXUS-RAT-2026-07-16-015` — originally authorizes Sprint 63's scope: the Governance State Projection concept, the minimum event-subscription mechanism required to build it, and the explicit exclusions below.
- `NEXUS-RAT-2026-07-16-016` — narrows Sprint 63 to Mission-scoped-only reporting, resolving `NEXUS-REV-2026-07-16-015-F-001`; supersedes the original Objective's per-Workflow-position language.

Authorized Concepts

- A deterministic, **Mission-scoped only** `GovernanceStateProjection` read model summarizing governance and recovery state from existing Domain Events, per `NEXUS-RAT-2026-07-16-016`.
- The minimum concrete event-subscription mechanism required for this one projection to consume `GovernanceDecisionRecorded`, `RecoveryRequirementCreated`, `RecoveryRequirementResolved`, and `RecoveryRequirementWithdrawn`. This mechanism SHALL NOT be built as an independent, general-purpose subscriber framework.
- Read-only projection retrieval, scoped by Mission.

Deferred Concepts

- Per-Engineering-Session and per-Workflow-Step governance projection; Workflow-position attribution in Governance events or `GovernanceDecision` (removed from this Sprint's scope by `NEXUS-RAT-2026-07-16-016`; any future Workflow-position projection requires its own RFC ownership analysis and Sprint Owner ratification).
- Host or Adapter governance surfacing (any UI presentation of the projection).
- `MissionPaused`/`MissionResumed` lifecycle correction.
- Recovery-aware Mission completion attribution bridging.
- Event-Driven Workflow Coordination (Milestone 10 Step 2) — invoking existing advancement/completion authorities from the projection.
- Recovery Workflow Automation (Milestone 10 Step 3).
- Autonomous Engineering Integration Validation (Milestone 10 Step 4).
- Autonomous planning, AI architectural ratification, and any autonomous architectural decision-making.
- Unrestricted workflow mutation of any kind.
- A general-purpose, reusable event-subscription/consumer framework independent of this one projection's needs.

Definition of Done

- `GovernanceStateProjection` is a read model only; it does not mutate `Mission`, `MissionPlan`, `Task`, `GovernanceDecision`, `RecoveryRequirement`, `EngineeringSession`, `WorkflowChain`, or any other existing aggregate or repository.
- The projection is built exclusively by consuming existing, unmodified Domain Event types through the existing `EventBusContract`; no existing event type, envelope, or publisher is modified.
- The projection does not infer Engineering Session or Workflow Step identity from any source and does not reuse transient caller-supplied command context.
- The event-subscription mechanism is scoped to exactly this projection's needs; no unused generality is introduced.
- No `src/hosts` or `src/adapters` file is modified.
- No RFC is amended; RFC-0001, RFC-0004, RFC-0005, and RFC-0011 remain as currently ratified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0063-governance-state-projection-foundation.md` for the complete Sprint Implementation Record.

---

## Sprint 64 — Event-Driven Mission Completion

Status: ✅ Approved — `NEXUS-REV-2026-07-16-017` (fully closed with zero open findings of any blocking category; one Category 6, Informational Observation, no Builder Task). Authorized by `NEXUS-RAT-2026-07-16-017`, narrowing Milestone 10 Step 2 — Event-Driven Workflow Coordination — to Mission Completion only.

Objective

Implement a deterministic Domain Event consumer that reacts to `GovernanceDecisionRecorded`, `RecoveryRequirementCreated`, `RecoveryRequirementResolved`, and `RecoveryRequirementWithdrawn`, consults the Mission-scoped `GovernanceStateProjection` (Sprint 63, frozen) to confirm no blocking governance state remains for the event's Mission, and invokes the existing, unmodified `MissionExecutionService.completeMission` authority (Sprint 4/61, frozen) through its existing public contract — closing the loop between Sprint 63's governance read model and Sprint 4/61's existing Mission completion authority, without introducing any new completion or governance decision semantics.

RFC Coverage

- RFC-0004 v1.13 — Execution Model (Referenced; existing completion authority invoked unmodified)
- RFC-0005 — Domain Event Model (Referenced; consumes existing, unmodified events only)
- RFC-0001 v1.1 — Mission Model (Referenced; Governance-Gated Mission Completion consumed unmodified)
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision`/`RecoveryRequirement` consumed read-only)

Ratification

- `NEXUS-RAT-2026-07-16-015` — Milestone 10 Objective, Architectural Boundary, and Initial Capability Sequence (unmodified).
- `NEXUS-RAT-2026-07-16-016` — Sprint 63 Mission-scoped-only `GovernanceStateProjection` scope (frozen, consumed read-only).
- `NEXUS-RAT-2026-07-16-017` — narrows Milestone 10 Step 2 to Event-Driven Mission Completion only and authorizes Sprint 64, including the activation-time trigger-source and idempotency refinements below.

Authorized Concepts

- A concrete Domain Event consumer (e.g. `GovernanceGatedMissionCompletionCoordinator`) subscribed to exactly `GovernanceDecisionRecorded`, `RecoveryRequirementCreated`, `RecoveryRequirementResolved`, and `RecoveryRequirementWithdrawn` through the existing `EventBusContract`.
- For each relevant event: resolve the event's `missionId`; read the current Mission-scoped `GovernanceStateProjection` via `GovernanceStateProjectionService`; confirm no blocking `GovernanceDecision`, unresolved Recovery Requirement, or escalation state remains; invoke `MissionExecutionService.completeMission({ missionId })` only when fully non-blocking.
- The `GovernanceStateProjection` is consulted as a read model per-event; it is never treated as an independent event source.
- Deterministic, idempotent behavior under duplicate or replayed events: a Mission SHALL NOT be successfully completed more than once; an already-completed Mission is treated as a benign no-op or observable terminal-state rejection per the existing `completeMission` contract; no automatic retry behavior is introduced; failed completion attempts remain observable through deterministic diagnostics.

Deferred Concepts

- Event-Driven Workflow Advancement (`engineeringSessionId`/`currentWorkflowStepId`-scoped remainder of Milestone 10 Step 2) — requires its own future RFC ownership analysis and Sprint scope ratification.
- Engineering Session or Workflow Step attribution of any kind.
- Session/step-scoped governance projections or extensions to `GovernanceStateProjection`.
- Recovery Workflow Automation (Milestone 10 Step 3).
- Autonomous Engineering Integration Validation (Milestone 10 Step 4).
- Autonomous recovery and autonomous decision-making of any kind.
- Any new completion authority or reinterpretation of existing Mission completion rules and diagnostics.
- Host or Adapter surfacing of this coordinator.

Definition of Done

- The coordinator does not modify `GovernanceStateProjection`, `GovernanceDecision`, `RecoveryRequirement`, `MissionExecutionService`, Mission completion semantics, any existing Domain Event contract, any repository, or any Host/Adapter file.
- The coordinator invokes `completeMission` only when the projection reflects a fully non-blocking governance state for that Mission.
- Repeated/duplicate event delivery does not cause more than one successful Mission completion and does not error the coordinator.
- No `src/hosts` or `src/adapters` file is modified.
- No RFC is amended; RFC-0001, RFC-0004, RFC-0005, and RFC-0011 remain as currently ratified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

Implemented Deliverables

- Added `GovernanceGatedMissionCompletionCoordinator` as a thin Domain Event consumer subscribed to exactly the four authorized governance/recovery event types through `EventBusContract`.
- Wired the coordinator into `createKernelServices()` using the existing `GovernanceStateProjectionService` read model and existing `MissionExecutionService.completeMission` public contract.
- Added Sprint 64 test coverage for non-blocking completion, blocking projections, Recovery Requirement resolution/withdrawal trigger paths, duplicate/replayed delivery idempotency, completion rejection diagnostics, unrelated Mission isolation, kernel composition, and Host/Adapter drift protection.
- Preserved RFCs, Kernel Canon, existing Domain Event contracts, existing repositories, `MissionExecutionService`, `GovernanceStateProjection`, `GovernanceDecision`, `RecoveryRequirement`, and all Host/Adapter production surfaces unchanged.

See `knowledge/implementation/sprints/sprint-0064-event-driven-mission-completion.md` for the complete Sprint Implementation Record.

---

## Sprint 65 — EngineeringSession Domain Event Publication

Status: ✅ Approved — `NEXUS-REV-2026-07-17-001` (Cycle 2, revised scope; fully closed with zero open findings of any blocking category; one Category 6, Informational Observation, no Builder Task). Authorized by `NEXUS-RAT-2026-07-16-018`, resolving the Event-Driven Workflow Advancement/Recovery Workflow Automation session-attribution gap by extending the established Kernel Domain Event publication pattern (Sprints 11/13/15) to `EngineeringSession`. Cycle 1 was blocked before implementation began: the Builder correctly stopped upon discovering that no authorized data source supplies `missionId` for `EngineeringSession`. `NEXUS-RAT-2026-07-16-019` revised the scope below: Mission attribution SHALL be resolved exclusively through the existing, RFC-0004-owned Mission Engineering Group association via one new read-only reverse-lookup query; `EngineeringSessionCreated` is deferred from this Sprint entirely.

Objective

Publish `EngineeringSessionWorkflowAdvanced` for successful Workflow position advancement, with Mission attribution resolved from the existing Mission Engineering Group association, establishing the event stream required for a future Session State Projection and future Event-Driven Workflow Consumers. This Sprint introduces no event consumers, projections, workflow automation, or new Engineering Session behavior, and does not publish an Engineering Session creation event.

RFC Coverage

- RFC-0005 — Domain Event Model (Partial; extends the established publication pattern to a new aggregate)
- RFC-0004 v1.13 — Execution Model (Referenced; existing `EngineeringSession`/Workflow Advancement behavior and Mission Engineering Group ownership consumed, not amended)

Ratification

- `NEXUS-RAT-2026-07-16-015` — Milestone 10 Objective, Architectural Boundary, Initial Capability Sequence (unmodified).
- `NEXUS-RAT-2026-07-16-016` — Sprint 63 Mission-scoped-only `GovernanceStateProjection` scope (frozen, unaffected).
- `NEXUS-RAT-2026-07-16-017` — Sprint 64 Event-Driven Mission Completion scope (frozen, unaffected).
- `NEXUS-RAT-2026-07-16-018` — resolves the session/step attribution gap and originally authorizes Sprint 65.
- `NEXUS-RAT-2026-07-16-019` — binding revision following the Cycle 1 Builder block; supersedes the original Canonical Events/Authorized Operations, exactly as specified in `knowledge/implementation/sprints/sprint-0065-engineeringsession-domain-event-publication.md`.

Authorized Concepts

- `EngineeringSession` recorded Domain Event collection and `pullDomainEvents()`, mirroring `Mission`/`Evidence`/`Review`/`Knowledge`/`MissionPlan`/`Task`.
- `EngineeringSessionService` optional constructor-injected `EventBusContract`, using the existing `requireEventBus()` guard pattern.
- One new read-only reverse-lookup query on the existing Mission Engineering Group capability (`EngineeringSessionId → MissionId`), fail-closed on missing or ambiguous association; `EngineeringSessionService` gains a read-only constructor-injected dependency on it.
- Exactly one canonical event this Sprint: `EngineeringSessionWorkflowAdvanced`, published identically by `advanceWorkflow`, `advanceWorkflowOnTrigger`, `advanceWorkflowAfterReview`, and `advanceWorkflowAfterGovernanceDecision`, carrying the triggering strategy as closed-vocabulary event data — `Direct`/`Trigger`/`ReviewGated`/`GovernanceGated` — not as separate event types, and carrying the Mission Engineering Group-resolved `missionId`.
- Persistence-first, save-then-publish semantics; no event during rehydration, on failed/rejected operations, when no state transition occurred, or when Mission attribution is missing or ambiguous.

Deferred Concepts

- `EngineeringSessionCreated` (Mission association is established through a separate operation after creation; cannot be truthfully attributed at creation time).
- Session State Projection; Event-Driven Workflow Advancement and Recovery Workflow Automation consumers (require Session State Projection first); Autonomous Engineering Integration Validation (Milestone 10 Step 4).
- Any change to Mission Engineering Group mutation operations (`associateEngineeringSessionWithMission`, `recordEngineeringSessionHandoff`) or their existing semantics.
- `closeEngineeringSession`/checkpoint/recovery/handoff/execution-session event publication.
- Any event subscription/consumer of any kind.
- Any change to `GovernanceDecisionRecorded`, `GovernanceDecision`, or `RecoveryRequirement`.

Definition of Done

- `EngineeringSessionWorkflowAdvanced` is recorded and published exactly once per successful advancement, only after persistence and only when exactly one Mission association resolves; never on rehydration, rejection, or ambiguous/missing Mission association.
- `createEngineeringSession` publishes no Domain Event.
- No existing `EngineeringSession`/`EngineeringSessionService` behavior or public signature changes beyond additive constructor injection.
- `EngineeringSession` gains no persistent `missionId` field.
- No `GovernanceDecision`, `RecoveryRequirement`, `GovernanceStateProjection`, or `src/hosts`/`src/adapters` file is modified.
- No RFC is amended.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0065-engineeringsession-domain-event-publication.md` for the complete Sprint Implementation Record.

---

## Sprint 66 — Engineering Session State Projection

Status: ✅ Approved — `NEXUS-REV-2026-07-17-002` (fully closed with zero open findings of any blocking category). Authorized by `NEXUS-RAT-2026-07-17-001`. Fulfills the Prerequisite Foundation item named by `NEXUS-RAT-2026-07-16-018` ("EngineeringSession Session State Projection").

Builder Implementation Summary

- Added immutable `EngineeringSessionStateProjection` read model, `IEngineeringSessionStateProjectionRepository`/`InMemoryEngineeringSessionStateProjectionRepository`, and `EngineeringSessionStateProjectionService` under `src/kernel/execution/`.
- Consumes exactly `EngineeringSessionWorkflowAdvanced` through the existing `EventBusContract`; no Sprint 65 event contract or publisher was modified.
- Implements first-observed-event initialization, Workflow continuity validation, Mission attribution consistency, ordered advancement history, event-identity idempotency, explicit replay reconstruction, and read-only enumeration.
- Wired `createKernelServices()` additively and updated Kernel boundary certification for the new service.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest (88 files / 580 tests), esbuild, and extension-host bundle build.

Objective

Introduce a deterministic, read-only projection of observed `EngineeringSession` Workflow position changes by consuming exactly the existing `EngineeringSessionWorkflowAdvanced` event stream (Sprint 65, frozen) through the existing `EventBusContract`, exposing the latest observed Workflow position and advancement history per Engineering Session. This Sprint introduces no Workflow mutation, no Workflow advancement trigger, no recovery automation, and no inference of unrecorded domain facts.

RFC Coverage

- RFC-0005 — Domain Event Model (Referenced; authoritative event-consumption contract)
- RFC-0004 v1.13 — Execution Model (Referenced; existing `EngineeringSession`/Workflow Advancement state consumed read-only)

Ratification

- `NEXUS-RAT-2026-07-16-015` — Milestone 10 Objective, Architectural Boundary, and Initial Capability Sequence (unmodified).
- `NEXUS-RAT-2026-07-16-016` — Sprint 63 `GovernanceStateProjection` Mission-scoped-only scope (frozen, unaffected; structural precedent).
- `NEXUS-RAT-2026-07-16-018` — names Session State Projection as the remaining Prerequisite Foundation item this Sprint fulfills.
- `NEXUS-RAT-2026-07-16-019` — Sprint 65 revised scope (frozen, unaffected); establishes the deferral of `EngineeringSessionCreated` this Sprint's Known Source Limitation follows from.
- `NEXUS-RAT-2026-07-17-001` — authorizes Sprint 66, including its binding Objective, Known Source Limitation, Architectural Responsibilities, Authorized Scope, Deterministic Event Consumption rules, and Builder Stop Conditions.

Authorized Concepts

- `EngineeringSessionStateProjection` read model, uniquely identified by `engineeringSessionId`, preserving authoritative `missionId` copied exclusively from the consumed event.
- `IEngineeringSessionStateProjectionRepository`/in-memory implementation and `EngineeringSessionStateProjectionService`, subscribed to exactly `EngineeringSessionWorkflowAdvanced` through the existing `EventBusContract`, mirroring the Sprint 63 `GovernanceStateProjection` pattern where structurally reusable.
- Deterministic event consumption: continuity validation (`event.previousWorkflowStepId` must equal `projection.currentWorkflowStepId` when a projection exists), Mission attribution consistency, ordered advancement history, and idempotent handling of duplicate event identities.
- Additive `createKernelServices()` composition wiring.

Known Source Limitation (binding, per `NEXUS-RAT-2026-07-17-001`)

`EngineeringSessionCreated` remains deferred. The projection SHALL NOT claim to represent an Engineering Session's creation-time state, and SHALL distinguish "no observed advancement" from "an observed current Workflow position." The first observed event MAY initialize the projection using its `previousWorkflowStepId`/`newWorkflowStepId` only; creation-time state SHALL NOT be inferred from any repository, `WorkflowChain` definition, Mission Engineering Group, command, or unrelated event. A newly created Engineering Session with no advancement event MAY legitimately have no projection record.

Deferred Concepts

- `EngineeringSessionCreated` and projection of creation-time Session state.
- Event-Driven Workflow Advancement and Recovery Workflow Automation (require this projection first).
- Autonomous Engineering Integration Validation (Milestone 10 Step 4).
- Host or Adapter surfacing, projection caching, durable projection storage, distributed consumers, event checkpoints, consumer offsets, dead-letter queues, retry policies, event-stream compaction.
- Mission-level orchestration, WorkflowStep execution-status projection, ExecutionSession projection.

Definition of Done

- The first valid advancement event creates exactly one projection; no projection is fabricated for a Session with no observed advancement event.
- Workflow continuity mismatches and Mission attribution conflicts fail closed, leaving any existing projection unchanged.
- Duplicate event identities do not produce duplicate history or a second effective update; replay and live delivery overlap do not produce duplicate effective updates.
- Events are applied in authoritative `EventBus` order only; no timestamp-based reordering or reconciliation is introduced.
- No `EngineeringSession`, `EngineeringSessionService`, `WorkflowChain`, Mission Engineering Group, Execution Strategy, Assignment Policy, Review, Governance, `RecoveryRequirement`, `Mission`, Sprint 65 event contract, or `src/hosts`/`src/adapters` file is modified.
- No RFC is amended; RFC-0004 and RFC-0005 remain as currently ratified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0066-engineering-session-state-projection.md` for the complete Sprint Implementation Record.

---

## Sprint 67 — Engineering Decision Correlation Foundation

Status: ✅ Approved — `NEXUS-REV-2026-07-17-003` (Approved with Findings; zero Category 1–3/5 findings; one Category 4, Minor Documentation Drift finding, resolved via `DOC-TASK-067-001`; two Category 6 Observations). Documentation Task independently verified Resolved by `NEXUS-REV-2026-07-17-004` (PASS, zero remaining findings). Authorized by `NEXUS-RAT-2026-07-17-003`, implementing RFC-0004 v1.14 amended by `NEXUS-RAT-2026-07-17-002`.

Objective

Introduce `EngineeringDecisionCorrelation` — an explicit, attributable, append-only record correlating a governed Workflow position (Mission, Engineering Session, Workflow Step) with the Review and `GovernanceDecision` subsequently produced for it — resolving the inbound half of the Milestone 10 attribution gap. This Sprint introduces no Workflow mutation, no event consumption, no auto-wiring of any existing consumer, and no change to Review or `GovernanceDecision` ownership.

RFC Coverage

- RFC-0004 v1.14 (Partial — implements exactly the Engineering Decision Correlation section)
- RFC-0006 — Engineering Assessment Model (Referenced; `Review` consumed read-only)
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision` consumed read-only)
- RFC-0005 — Domain Event Model (Referenced; existing envelope conventions only)

Ratification

- `NEXUS-RAT-2026-07-16-015` — Milestone 10 Objective, Architectural Boundary, Initial Capability Sequence (unmodified; Sequence revised to insert this Sprint ahead of Event-Driven Workflow Advancement).
- `NEXUS-RAT-2026-07-16-018`/`-019` — Prerequisite Foundation (Sprint 65/66, frozen; outbound half of the attribution gap).
- `NEXUS-RAT-2026-07-17-002` — RFC-0004 v1.14 amendment, defining Engineering Decision Correlation.
- `NEXUS-RAT-2026-07-17-003` — authorizes this Sprint, including its binding Creation Authority resolution.

Implemented Concepts

- `EngineeringDecisionCorrelation` aggregate: immutable identity; immutable Mission/Engineering-Session/Workflow-Step attribution set at creation; append-only, at-most-once `reviewId` and `governanceDecisionId` associations, order-enforced (Review before GovernanceDecision).
- `IEngineeringDecisionCorrelationRepository`/in-memory implementation and `EngineeringDecisionCorrelationService` (`beginCorrelation`, `associateReview`, `associateGovernanceDecision`, deterministic bidirectional lookup).
- Additive `createKernelServices()` composition wiring.

Deferred Concepts

- Event-Driven Workflow Advancement (Sprint 68) and Recovery Workflow Automation (Sprint 69) — this Sprint provides their future attribution source only.
- Wiring correlation creation into `EngineeringSessionService`, `ReviewService`, or `GovernanceService` as an automatic side effect.
- Wiring `GovernanceGatedWorkflowAdvancementConsumer`/`RecoveryRequirementGovernanceDecisionConsumer` as automatic `EventBusContract` subscribers.
- Autonomous Engineering Integration Validation (Milestone 10 Step 4).

Definition of Done

- `EngineeringDecisionCorrelation` identity and attribution are immutable after `beginCorrelation`; Mission attribution resolved exclusively through Mission Engineering Group.
- Association operations are idempotent-safe and Mission-match-validated, failing closed on mismatch.
- Lookup by `reviewId`, by `governanceDecisionId`, and by (Mission, Engineering Session, Workflow Step) is deterministic and fails closed on absence.
- No `EngineeringSession`, `EngineeringSessionService`, `WorkflowChain`, Mission Engineering Group, Review, `GovernanceDecision`, `RecoveryRequirement`, `Mission`, or `src/hosts`/`src/adapters` file is modified.
- No RFC other than RFC-0004 (already amended to v1.14) is amended.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

Reviewer Validation Result

- Independently re-verified: `tsc --noEmit`, ESLint, `npm run test` (89 files / 588 tests), `npm run build`, `npm run test:extension-host:build` — all pass, matching the Builder's reported counts.
- One Category 4, Minor Documentation Drift finding (`NEXUS-REV-2026-07-17-003` F-001: two orphaned Sprint 66 Notes bullets misplaced under Sprint 67's `IMPLEMENTATION_MANIFEST.md` section) — Resolved via `DOC-TASK-067-001`, independently verified by `NEXUS-REV-2026-07-17-004` (PASS, zero remaining findings; full suite re-verified at 89 files / 588 tests with no regression). Two Category 6 Observations remain outstanding, informational, non-blocking. See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-17-003`/`NEXUS-REV-2026-07-17-004` for the complete review.

See `knowledge/implementation/sprints/sprint-0067-engineering-decision-correlation-foundation.md` for the complete Sprint Implementation Record.

---

## Sprint 68 — Event-Driven Workflow Advancement

Status: ✅ Approved — `NEXUS-REV-2026-07-17-005` (fully closed with zero open findings of any blocking category; one Category 6, Informational Observation, no Builder Task). Ratified by `NEXUS-RAT-2026-07-17-005`, implementing RFC-0004 v1.15 (`NEXUS-RAT-2026-07-17-004`).

Objective

Wire the existing `GovernanceGatedWorkflowAdvancementConsumer` (Sprint 57, frozen contract) to an actual `EventBusContract` subscription to `GovernanceDecisionRecorded`, resolve the exact Engineering Session and Workflow Step attribution for that Governance Decision through Sprint 67's `EngineeringDecisionCorrelationService.findByGovernanceDecisionId`, and invoke the existing Governance-Gated Advancement path deterministically — closing the loop between Sprint 67's correlation record and Sprint 57's existing advancement authority, without introducing Recovery automation or any second event consumer.

RFC Coverage

- RFC-0004 v1.15 (Partial — implements exactly the Event-Driven Workflow Advancement section)
- RFC-0005 — Domain Event Model (Referenced; consumes existing, unmodified `GovernanceDecisionRecorded` only)
- RFC-0006 — Engineering Assessment Model (Referenced; `Review` consumed read-only, unmodified)
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision` consumed read-only, unmodified)

Ratification

- `NEXUS-RAT-2026-07-16-015` — Milestone 10 Objective, Architectural Boundary, Initial Capability Sequence (unmodified).
- `NEXUS-RAT-2026-07-16-018`/`-019` — Prerequisite Foundation (Sprint 65/66, frozen; outbound half of the attribution gap).
- `NEXUS-RAT-2026-07-17-002`/`-003` — RFC-0004 v1.14 amendment and Sprint 67 (frozen; inbound half of the attribution gap and this Sprint's attribution source).
- `NEXUS-RAT-2026-07-17-004` — amends RFC-0004 to v1.15, adding Event-Driven Workflow Advancement.
- `NEXUS-RAT-2026-07-17-005` — authorizes this Sprint, including the binding Existing Consumer Ownership and Subscription Lifecycle rules.

Authorized Concepts

- Extending `GovernanceGatedWorkflowAdvancementConsumer` with an actual `EventBusContract` subscription to `GovernanceDecisionRecorded`, established during Kernel composition, exactly once per Kernel composition.
- On receipt of `GovernanceDecisionRecorded`: validate the event; resolve the referenced `GovernanceDecision`; resolve its Engineering Decision Correlation via `EngineeringDecisionCorrelationService.findByGovernanceDecisionId`; obtain authoritative Mission/Engineering-Session/Workflow-Step attribution; validate attribution consistency; invoke the existing Governance-Gated Advancement path through `EngineeringSessionService.advanceWorkflowAfterGovernanceDecision`.
- Only an Approved `GovernanceDecision` may result in advancement; Rejected/Deferred/Escalation Required produce a deterministic non-advancing result, not a Recovery Requirement.
- Fail-closed handling of missing/ambiguous correlation and any attribution mismatch; idempotent handling of duplicate/replayed event delivery.
- Additive `createKernelServices()` composition wiring establishing the subscription.

Existing Consumer Ownership (binding, per `NEXUS-RAT-2026-07-17-005`)

`GovernanceGatedWorkflowAdvancementConsumer` SHALL be extended, not replaced; a second consumer for the same responsibility SHALL NOT be introduced. Production `EventBus` subscription handling SHALL construct its command exclusively from authoritative loaded and correlated state — it SHALL NOT require caller-supplied Engineering Session or Workflow Step identifiers.

Deferred Concepts

- `RecoveryRequirementGovernanceDecisionConsumer` wiring and Recovery Workflow Automation (Sprint 69) in their entirety.
- Retry, buffering, or reordering of unresolved/out-of-order events; durable subscriptions; consumer checkpoints; dead-letter queues.
- Autonomous Engineering Integration Validation (Milestone 10 Step 4).
- Host or Adapter surfacing of any kind.
- Any change to `GovernanceDecision`, Review, Engineering Decision Correlation, `EngineeringSessionStateProjection`, Workflow Chain topology, or Mission Engineering Group.

Definition of Done

- The consumer subscribes to `GovernanceDecisionRecorded` exactly once per Kernel composition; repeated service resolution does not duplicate subscription behavior.
- Attribution is resolved exclusively through `EngineeringDecisionCorrelationService.findByGovernanceDecisionId`; missing or ambiguous correlation fails closed with no advancement, no aggregate mutation, and no Recovery Requirement creation.
- Mission, Engineering Session, and Workflow Step identity are validated consistent across the event, the `GovernanceDecision`, the correlation, and the Engineering Session before advancement; any mismatch fails closed.
- Duplicate/replayed event delivery does not advance the same Workflow position more than once.
- No `EngineeringSession` (beyond its existing, unmodified public operations), `WorkflowChain`, Mission Engineering Group, Review, `GovernanceDecision`, `RecoveryRequirement`, `Mission`, Sprint 65/66/67 contract, or `src/hosts`/`src/adapters` file is modified.
- No RFC other than RFC-0004 (already amended to v1.15) is amended.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0068-event-driven-workflow-advancement.md` for the complete Sprint Implementation Record.

---

## Sprint 69 — Recovery Workflow Automation

Status: ✅ Approved — `NEXUS-REV-2026-07-17-006` (fully closed with zero open findings of any blocking category; one Category 6, Informational Observation, no Builder Task). Ratified by `NEXUS-RAT-2026-07-17-007`, implementing RFC-0004 v1.16 (`NEXUS-RAT-2026-07-17-006`).

Objective

Wire the existing `RecoveryRequirementGovernanceDecisionConsumer` (Sprint 58/59, frozen contract) to an actual `EventBusContract` subscription to `GovernanceDecisionRecorded`, resolve the exact Engineering Session and Workflow Step attribution for that Governance Decision through Sprint 67's `EngineeringDecisionCorrelationService.findByGovernanceDecisionId`, and invoke the existing Recovery Requirement creation path deterministically for Rejected Governance Decisions only — closing the loop between Sprint 67's correlation record and Recovery Requirement's existing creation authority, as a sibling consumer to Sprint 68's advancement path, without introducing recovery execution, resolution, or withdrawal.

RFC Coverage

- RFC-0004 v1.16 (Partial — implements exactly the Recovery Workflow Automation section)
- RFC-0005 — Domain Event Model (Referenced; consumes existing, unmodified `GovernanceDecisionRecorded` only)
- RFC-0006 — Engineering Assessment Model (Referenced; `Review` consumed read-only, unmodified)
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision` consumed read-only, unmodified)

Ratification

- `NEXUS-RAT-2026-07-16-015` — Milestone 10 Objective, Architectural Boundary, Initial Capability Sequence (unmodified).
- `NEXUS-RAT-2026-07-16-018`/`-019` — Prerequisite Foundation (Sprint 65/66, frozen; outbound half of the attribution gap).
- `NEXUS-RAT-2026-07-17-002`/`-003` — RFC-0004 v1.14 amendment and Sprint 67 (frozen; inbound half of the attribution gap and this Sprint's attribution source).
- `NEXUS-RAT-2026-07-17-004`/`-005` — RFC-0004 v1.15 amendment and Sprint 68 (frozen; sibling consumer of the same event type, distinct responsibility).
- `NEXUS-RAT-2026-07-17-006` — amends RFC-0004 to v1.16, adding Recovery Workflow Automation.
- `NEXUS-RAT-2026-07-17-007` — authorizes this Sprint, including the binding Existing Consumer Ownership, Subscription Lifecycle, and Consumer Separation rules.

Authorized Concepts

- Extending `RecoveryRequirementGovernanceDecisionConsumer` with an actual `EventBusContract` subscription to `GovernanceDecisionRecorded`, established during Kernel composition, exactly once per Kernel composition.
- On receipt of `GovernanceDecisionRecorded`: validate the event; resolve the referenced `GovernanceDecision`; verify its outcome is Rejected; resolve its Engineering Decision Correlation via `EngineeringDecisionCorrelationService.findByGovernanceDecisionId`; obtain authoritative Mission/Engineering-Session/Workflow-Step attribution; validate attribution consistency; invoke the existing Recovery Requirement creation path.
- Only a Rejected `GovernanceDecision` may result in Recovery Requirement creation; Approved/Deferred/Escalation Required produce a deterministic no-recovery result.
- Fail-closed handling of missing/ambiguous correlation and any attribution mismatch; idempotent handling of duplicate/replayed event delivery using Recovery Requirement's existing deterministic creation key.
- Additive `createKernelServices()` composition wiring establishing the subscription.
- `IMPLEMENTATION_MANIFEST.md` Sprint 68 status-line synchronization (documentation-only correction).

Existing Consumer Ownership (binding, per `NEXUS-RAT-2026-07-17-007`)

`RecoveryRequirementGovernanceDecisionConsumer` SHALL be extended, not replaced; a second recovery consumer SHALL NOT be introduced. Production `EventBus` subscription handling SHALL construct its command exclusively from authoritative loaded and correlated state — it SHALL NOT require caller-supplied Engineering Session or Workflow Step identifiers.

Consumer Separation (binding, per `NEXUS-RAT-2026-07-17-007`)

`GovernanceGatedWorkflowAdvancementConsumer` (Sprint 68) and `RecoveryRequirementGovernanceDecisionConsumer` (this Sprint) SHALL remain two separate `EventBus` subscriptions to `GovernanceDecisionRecorded`, each independently exactly-once per Kernel composition; neither SHALL be merged into, replace, or depend on the other's handling result. Sprint 68's behavior SHALL remain unchanged.

Deferred Concepts

- Recovery-plan generation, AI remediation planning, or automatic recovery execution.
- Recovery Requirement resolution or withdrawal.
- Event-driven re-advancement after recovery.
- Automatic Builder invocation.
- Retry, buffering, or reordering of unresolved/out-of-order events; durable subscriptions; consumer checkpoints; dead-letter queues.
- Autonomous Engineering Integration Validation (Milestone 10 Step 4).
- Host or Adapter surfacing of any kind.
- Any change to `GovernanceDecision`, Review, Engineering Decision Correlation, `EngineeringSessionStateProjection`, Workflow Chain topology, Mission Engineering Group, or Event-Driven Workflow Advancement (Sprint 68).

Definition of Done

- The existing Recovery consumer subscribes to `GovernanceDecisionRecorded` exactly once per Kernel composition; repeated service resolution does not duplicate subscription behavior.
- Attribution is resolved exclusively through `EngineeringDecisionCorrelationService.findByGovernanceDecisionId`; missing or ambiguous correlation fails closed with no Recovery Requirement creation and no aggregate mutation.
- Mission, Engineering Session, and Workflow Step identity are validated consistent across the event, the `GovernanceDecision`, and the correlation before Recovery Requirement creation; any mismatch fails closed.
- Approved, Deferred, and Escalation Required `GovernanceDecision` values produce a deterministic no-recovery result and create no Recovery Requirement.
- Duplicate/replayed event delivery does not create more than one Recovery Requirement for the same deterministic key.
- Sprint 68's `GovernanceGatedWorkflowAdvancementConsumer` behavior is unchanged; the two consumers remain independent.
- No `EngineeringSession`, `WorkflowChain`, Mission Engineering Group, Review, `GovernanceDecision`, `RecoveryRequirement`'s existing lifecycle/creation contract, `Mission`, Sprint 65/66/67/68 contract, or `src/hosts`/`src/adapters` file is modified.
- No RFC other than RFC-0004 (already amended to v1.16) is amended.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

See `knowledge/implementation/sprints/sprint-0069-recovery-workflow-automation.md` for the complete Sprint Implementation Record.

Implementation Notes:

- Extended the existing `RecoveryRequirementGovernanceDecisionConsumer` with an exactly-once `EventBusContract` subscription to `GovernanceDecisionRecorded`.
- Added production event handling that resolves attribution exclusively through `EngineeringDecisionCorrelationService.findByGovernanceDecisionId`, validates event/decision/correlation/runtime Workflow Step consistency, and fails closed with deterministic diagnostics.
- Routed Rejected decisions through `RecoveryRequirementService.createRecoveryRequirement`, preserving Recovery Requirement's deterministic idempotency key and avoiding direct aggregate mutation by the consumer.
- Preserved Approved, Deferred, and Escalation Required decisions as deterministic no-recovery outcomes.
- Preserved Sprint 68 `GovernanceGatedWorkflowAdvancementConsumer` behavior and Host/Adapter boundaries.

---

## Sprint 70 — Autonomous Engineering Integration Validation

Status: ✅ Approved — `NEXUS-REV-2026-07-17-008` (BT-070-001 Resolution Verification; fully closed with zero open findings of any category). Originally Rejected under `NEXUS-REV-2026-07-17-007` (one Category 2, Critical finding, F-001; resolved via `BT-070-001`). Ratified by `NEXUS-RAT-2026-07-17-008`. Milestone 10 Step 4 — the closing Sprint of the Initial Capability Sequence.

Objective

Validate the complete Milestone 10 autonomous engineering readiness lifecycle through an integration-only test suite, exercising: Governance state established → `GovernanceDecisionRecorded` → Approved → Event-Driven Workflow Advancement, or Rejected → Recovery Requirement Automation → Recovery resolution → Recovery-Gated Re-Advancement → Governance-Gated Mission Completion. This Sprint introduces no new production capability.

RFC Coverage

- RFC-0001 — Mission Model (Referenced)
- RFC-0004 v1.16 — Execution Model (Referenced)
- RFC-0005 — Domain Event Model (Referenced)
- RFC-0006 — Engineering Assessment Model (Referenced)
- RFC-0011 — Engineering Governance Model (Referenced)

All Referenced RFCs are consumed read-only; none is amended.

Ratification

- `NEXUS-RAT-2026-07-16-015` — Milestone 10 Objective, Architectural Boundary, Initial Capability Sequence (unmodified).
- `NEXUS-RAT-2026-07-17-008` — authorizes this Sprint's Required Validation Scenarios, Lifecycle Certification Flow, Event Ordering Assertions, Consumer Separation proof obligations, Production Source Restrictions, and Milestone 10 Completion Conditions.

See `knowledge/implementation/sprints/sprint-0070-autonomous-engineering-integration-validation.md` for the complete Sprint Implementation Record.

---

# Milestone 11 — Autonomous Engineering Planning Readiness

Status: 🟡 ACTIVE (Sprint 71 — Governance Decision Applicability Correction is ✅ Approved — `NEXUS-REV-2026-07-17-010`, per `NEXUS-RAT-2026-07-17-009`, Milestone 11's opening Sprint. RFC-0012 — Autonomous Engineering Planning Model ratified Final v1.0 by `NEXUS-RAT-2026-07-17-010` [ratification], closing Initial Capability Sequence step 2. Sprint 72 — Planning Policy and Proposed Plan Foundation is ✅ Approved — `NEXUS-REV-2026-07-17-012` [review] (fully closed; `BT-072-001`/`BT-072-002` independently verified Resolved). Sprint 73 — Planning Service and Proposal Lifecycle Foundation is ✅ Approved — `NEXUS-REV-2026-07-17-013` (PASS, zero findings, fully closed). Initial Capability Sequence step 5 [Plan Review, Governance, and Activation] decomposed by `NEXUS-RAT-2026-07-17-012` into steps 5–7 [Sprints 74–76] plus renumbered step 8 [Sprint 77]. Sprint 74 — Planning Correlation and Review Entry Foundation is ✅ Approved — `NEXUS-REV-2026-07-17-014`/`-015` (fully closed; `BT-074-001` independently verified Resolved; two Informational Observations remain non-blocking, carried forward). Sprint 75 — Proposal Governance Integration is ✅ Approved with Findings — `NEXUS-REV-2026-07-17-016` through `-019` (fully closed; originating Critical finding F-001 Resolved via `NEXUS-RAT-2026-07-17-015`/RFC-0012 v1.1, independently verified by `NEXUS-REV-2026-07-17-018`; the resulting Minor finding's `BT-075-003` independently verified Resolved by `NEXUS-REV-2026-07-17-019`; one carried-forward Informational Observation remains, non-blocking). RFC-0006 amended to v1.1 by `NEXUS-RAT-2026-07-17-016`, typing `Review`'s revision-under-assessment reference as `ReviewPlanRevisionReference` ahead of Sprint 76, completed by `NEXUS-RAT-2026-07-18-001`. Sprint 76 — Approved Plan Activation is ✅ Approved — `NEXUS-REV-2026-07-18-002` (fully closed; zero open findings of any category; `BT-076-002` independently verified Resolved by `NEXUS-REV-2026-07-18-001`, `BT-076-001` independently verified Resolved by `NEXUS-REV-2026-07-18-002`). Milestone 11 Initial Capability Sequence step 7 is complete. Sprint 77 — Autonomous Planning Integration Validation and Milestone 11 Closure is authorized by `NEXUS-RAT-2026-07-18-002`; 🔵 Current Sprint, Resumed — the Planning Correlation lineage defect that had paused it (spanning frozen Sprint 74–76 production code, outside Sprint 77's own Architectural Boundaries) is fully resolved: corrective scope authorized by `NEXUS-RAT-2026-07-18-003`, independently Reviewer-certified `NEXUS-REV-2026-07-18-004` (PASS, zero findings). Sprint 77's own five Authorized Concepts have not yet been attempted. Milestone 11 closure remains contingent on Sprint 77's own eventual independent Reviewer PASS.)

Objective

Enable governed, human-reviewed autonomous Mission Plan proposal, built on the corrected Mission Completion baseline established by RFC-0001 v1.2 and Sprint 71.

RFC Coverage

- RFC-0001 v1.2 — Mission Model (Amended by `NEXUS-RAT-2026-07-17-009`)
- RFC-0004 v1.16 — Execution Model (Referenced; consumed read-only)
- RFC-0011 — Engineering Governance Model (Referenced; consumed read-only)

Ratification

- `NEXUS-RAT-2026-07-17-009` — declares Milestone 10 Complete, amends RFC-0001 to v1.2, opens Milestone 11 with its binding Objective and Architectural Boundary, and authorizes Sprint 71.
- `NEXUS-RAT-2026-07-17-010` — ratifies RFC-0012 v1.0 Final, closes Initial Capability Sequence step 2, and authorizes Sprint 72.
- `NEXUS-RAT-2026-07-17-011` — renames Initial Capability Sequence step 4 to "Planning Service and Proposal Lifecycle Foundation" and authorizes Sprint 73.
- `NEXUS-RAT-2026-07-17-012` — decomposes Initial Capability Sequence step 5 ("Plan Review, Governance, and Activation") into steps 5–7 (Sprints 74–76) plus renumbered step 8 (Sprint 77), and authorizes Sprint 74.
- `NEXUS-RAT-2026-07-17-014` — authorizes Sprint 75, including the binding explicit Repository Policy attribution rule for Proposal Governance evaluation (no default, no inference, no cross-policy re-evaluation).
- `NEXUS-RAT-2026-07-17-015` — resolves `NEXUS-REV-2026-07-17-016-F-001`; amends RFC-0012 to v1.1; authorizes the corrective Sprint 75 `BT-075-001` scope.
- `NEXUS-RAT-2026-07-17-016` — resolves the `Review.missionPlanRevision` dual-semantics Observation; amends RFC-0006 to v1.1, defining the typed `ReviewPlanRevisionReference`.
- `NEXUS-RAT-2026-07-17-017` — authorizes Sprint 76 (Approved Plan Activation), including the binding Required Activation Guarantees (atomic commit, deferred event publication, idempotency, concurrency exclusivity, traceability).
- `NEXUS-RAT-2026-07-18-001` — authorizes the explicit `host-mission-workflow.ts` migration to the typed `ReviewPlanRevisionReference` and the removal of the silent-inference fallback, completing `NEXUS-RAT-2026-07-17-016`'s migration and resolving `NEXUS-REV-2026-07-17-020-F-001`.
- `NEXUS-RAT-2026-07-18-002` — authorizes Sprint 77 (Autonomous Planning Integration Validation and Milestone 11 Closure), including the binding five-category validation-coverage refinement (complete happy path, typed revision integrity, Activation safety, Governance protection, Milestone closure gating).
- `NEXUS-RAT-2026-07-18-003` — corrective ratification resolving the Planning Correlation lineage defect discovered during Sprint 77 (renames `PlanningCorrelation.proposedPlanRevisionId` to `reviewedProposedPlanRevisionId`; adds `governedProposedPlanRevisionId`); authorizes a narrow corrective scope to Sprint 74–76; pauses Sprint 77 pending independent Reviewer PASS of this correction.

Architectural Boundary (binding, from `NEXUS-RAT-2026-07-17-009`)

Milestone 11 SHALL NOT redefine Mission, active Mission Plan, Task, Task Graph, Mission completion, Governance Decision, Review, or Shared Reality. RFC-0001 remains the sole owner of active Mission Plan semantics and executable Mission state. No end-to-end autonomous planning integration certification SHALL proceed until Sprint 71 is Reviewer-certified and the corrected Mission Completion lifecycle is validated.

Initial Capability Sequence (non-binding sequencing; each step requires its own future Sprint scope ratification)

1. Governance Decision Applicability Correction (Sprint 71 — ✅ Approved, implements RFC-0001 v1.2)
2. RFC-0012 drafting and ratification (Autonomous Engineering Planning Model) — ✅ Closed by `NEXUS-RAT-2026-07-17-010`; RFC-0012 v1.0 Final
3. Planning Policy and Proposed Plan Foundation (Sprint 72 — ✅ Approved, `NEXUS-REV-2026-07-17-012`, fully closed)
4. Planning Service and Proposal Lifecycle Foundation (renamed from "Governed Plan Generation" by `NEXUS-RAT-2026-07-17-011`; Sprint 73 — ✅ Approved, `NEXUS-REV-2026-07-17-013`, fully closed)
5. Planning Correlation and Review Entry Foundation (refined from "Plan Review, Governance, and Activation" by `NEXUS-RAT-2026-07-17-012`; Sprint 74 — ✅ Approved, `NEXUS-REV-2026-07-17-014`/`-015`, fully closed; `BT-074-001` independently verified Resolved)
6. Proposal Governance Integration (Sprint 75 — ✅ Approved with Findings, `NEXUS-REV-2026-07-17-019`, fully closed; F-001 Resolved; `BT-075-003` independently verified Resolved)
7. Approved Plan Activation (Sprint 76 — ✅ Approved, `NEXUS-REV-2026-07-18-002`, fully closed; `BT-076-001`/`BT-076-002` independently verified Resolved)
8. Autonomous Planning Integration Validation and Milestone 11 Closure (renumbered from step 6; Sprint 77 — authorized by `NEXUS-RAT-2026-07-18-002`; 🔵 Current Sprint, Resumed — corrective ratification `NEXUS-RAT-2026-07-18-003` independently Reviewer-certified `NEXUS-REV-2026-07-18-004`, PASS)

---

## Sprint 77 — Autonomous Planning Integration Validation and Milestone 11 Closure

Status: 🔵 Current Sprint — Resumed. Authorized by `NEXUS-RAT-2026-07-18-002`. Implementation had surfaced a genuine Planning Correlation lineage defect spanning frozen Sprint 74–76 production code (`PlanningCorrelation.proposedPlanRevisionId` never updated when Governance mints a new `Governed` revision, so `PlanningActivationService` cannot resolve the correlation), outside this Sprint's own Architectural Boundaries to fix. Corrective scope authorized by `NEXUS-RAT-2026-07-18-003` (renames `proposedPlanRevisionId` to `reviewedProposedPlanRevisionId`; adds `governedProposedPlanRevisionId`) and independently Reviewer-certified Resolved (`NEXUS-REV-2026-07-18-004`, PASS, zero findings). Sprint 77 resumes its own five Authorized Concepts, unexpanded. Milestone 11 Initial Capability Sequence step 8 (renumbered from step 6 by `NEXUS-RAT-2026-07-17-012`).

Objective

Add one dedicated end-to-end integration test validating the complete, already-implemented Planning domain flow — `Draft → Submitted → Under Review → Governed → Activated → executable RFC-0001 state` — through real, non-mocked Kernel service composition. This Sprint introduces no new domain capability. Milestone 11 SHALL be declared complete only after this Sprint receives an independent Reviewer PASS.

RFC Coverage

- RFC-0012 v1.1 — Autonomous Engineering Planning Model (Referenced; validates the already-implemented Activation section, does not amend it)
- RFC-0001, RFC-0006 v1.1, RFC-0011 (Referenced; consumed read-only through existing public contracts, unmodified)

Ratification

- `NEXUS-RAT-2026-07-18-002` — authorizes this Sprint's exact scope, including five binding validation-coverage categories (complete happy path; typed revision integrity; Activation safety; Governance protection; Milestone closure gating), reproduced in full in the Sprint 77 record.

See `knowledge/implementation/sprints/sprint-0077-autonomous-planning-integration-validation-and-milestone-11-closure.md` for the complete Sprint Implementation Record.

---

## Sprint 76 — Approved Plan Activation

Status: ✅ Approved — `NEXUS-REV-2026-07-18-002` (fully closed; zero open findings of any category). Originally Rejected under `NEXUS-REV-2026-07-17-020` (one Category 3 — Specification Conflict, blocking; one Category 1 — Implementation Defect, Major); both independently verified Resolved (`BT-076-002` by `NEXUS-REV-2026-07-18-001`; `BT-076-001` by `NEXUS-REV-2026-07-18-002`). Authorized by `NEXUS-RAT-2026-07-17-017`, incorporating the typed `ReviewPlanRevisionReference` migration ratified by `NEXUS-RAT-2026-07-17-016` (RFC-0006 v1.1) and completed by `NEXUS-RAT-2026-07-18-001`. Milestone 11 Initial Capability Sequence step 7 (Approved Plan Activation) — complete.

Objective

Migrate `Review`'s revision-under-assessment reference to the typed `ReviewPlanRevisionReference` (`NEXUS-RAT-2026-07-17-016`), then implement RFC-0012's Activation: the atomic, irreversible conversion of a `Governed`, `GovernanceDecision`-`Approved` Proposed Plan Revision into executable RFC-0001 `MissionPlan`/`Task`/`TaskDependency` state, exclusively through `MissionPlanningService`'s existing public operations, under the binding Required Activation Guarantees ratified by `NEXUS-RAT-2026-07-17-017` (atomic commit, deferred Domain Event publication, idempotency, concurrency exclusivity, and full traceability).

RFC Coverage

- RFC-0012 v1.1 — Autonomous Engineering Planning Model (Primary; implements the Activation section)
- RFC-0006 v1.1 — Engineering Assessment Model (Referenced; consumes the typed `ReviewPlanRevisionReference` this Sprint migrates to, per `NEXUS-RAT-2026-07-17-016`)
- RFC-0001 — Mission Model (Referenced; Activation writes exclusively through `MissionPlanningService`'s existing public operations, Sprint 3, unmodified)
- RFC-0011 — Engineering Governance Model (Referenced; terminal `Approved` `GovernanceDecision` re-verified read-only, unmodified)
- RFC-0004, RFC-0005, RFC-0008 (Referenced; consumed read-only, unmodified, unchanged from Sprint 72–75)

Ratification

- `NEXUS-RAT-2026-07-17-016` — resolves the `Review.missionPlanRevision` dual-semantics Observation (`NEXUS-REV-2026-07-17-014-F-002`/`NEXUS-REV-2026-07-17-016-F-003`); amends RFC-0006 to v1.1, defining `ReviewPlanRevisionReference`.
- `NEXUS-RAT-2026-07-17-017` — authorizes this Sprint's exact scope, including the binding Required Activation Guarantees, reproduced in full in the Sprint 76 record.

See `knowledge/implementation/sprints/sprint-0076-approved-plan-activation.md` for the complete Sprint Implementation Record.

---

## Sprint 75 — Proposal Governance Integration

Status: ✅ Approved with Findings — `NEXUS-REV-2026-07-17-016` through `-019`, fully closed (originating Critical finding `NEXUS-REV-2026-07-17-016-F-001` Resolved via `NEXUS-RAT-2026-07-17-015`/RFC-0012 v1.1, verified by `NEXUS-REV-2026-07-17-018`; the resulting Minor finding's `BT-075-003` independently verified Resolved by `NEXUS-REV-2026-07-17-019`; one carried-forward Informational Observation remains, non-blocking). Authorized by `NEXUS-RAT-2026-07-17-014`, corrected by `NEXUS-RAT-2026-07-17-015`. Milestone 11 Initial Capability Sequence step 6 (Proposal Governance Integration).

Objective

Extend the `PlanningCorrelation` record (Sprint 74) with explicit Repository Policy attribution and a `governanceDecisionId`, consume the terminal RFC-0006 `Review` outcome for the exact `Under Review` Proposed Plan Revision, invoke the existing RFC-0011 `GovernanceServiceContract.evaluateGovernancePolicy` unmodified, and implement the `Under Review → Governed` and `Rejected` Proposal Lifecycle transitions. This Sprint introduces no Activation, no Domain Event publication, and no new Repository Policy concept.

RFC Coverage

- RFC-0012 v1.0 — Autonomous Engineering Planning Model (Referenced; Planning Correlation's Governance extension and the `Governed`/`Rejected` Proposal Lifecycle transitions implement RFC-0012's Planning Correlation and Proposal Lifecycle sections, unmodified)
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision`/`GovernanceServiceContract.evaluateGovernancePolicy` consumed read-only through its existing public contract, unmodified)
- RFC-0006 — Engineering Assessment Model (Referenced; terminal `Review`/`ReviewOutcome` consumed read-only, unmodified)
- RFC-0001, RFC-0004, RFC-0005, RFC-0008 (Referenced; consumed read-only, unmodified, unchanged from Sprint 72–74)

Ratification

- `NEXUS-RAT-2026-07-17-012` — decomposed Initial Capability Sequence step 5 into Sprints 74–77; reserved "`GovernanceDecision` correlation and RFC-0011 Governance integration" for Sprint 75.
- `NEXUS-RAT-2026-07-17-014` — authorizes this Sprint's exact scope, including the binding explicit Repository Policy attribution rule, reproduced in full in the Sprint 75 record.
- `NEXUS-RAT-2026-07-17-015` — resolves `NEXUS-REV-2026-07-17-016-F-001` (Critical); amends RFC-0012 to v1.1; authorizes the corrective `BT-075-001` scope, independently verified Resolved by `NEXUS-REV-2026-07-17-018` (`BT-075-003`'s follow-on test-coverage task independently verified Resolved by `NEXUS-REV-2026-07-17-019`).

See `knowledge/implementation/sprints/sprint-0075-proposal-governance-integration.md` for the complete Sprint Implementation Record.

---

## Sprint 74 — Planning Correlation and Review Entry Foundation

Status: ✅ Approved with Findings — `NEXUS-REV-2026-07-17-014` (one Minor, non-blocking Category 1 finding; two Informational Category 6 Observations; zero Critical/Major/Category 2–5 findings). Authorized by `NEXUS-RAT-2026-07-17-012`, corrected by `NEXUS-RAT-2026-07-17-013`. Milestone 11 Initial Capability Sequence step 5 (refined from "Plan Review, Governance, and Activation").

Objective

Introduce the `PlanningCorrelation` record — correlating an exact `ProposedPlanRevision` with the RFC-0006 `Review` initiated for it, Planner Attribution, and Mission identity — and the `Submitted → Under Review` Proposal Lifecycle transition. This Sprint introduces no Governance integration, no Activation, and no Domain Event publication.

RFC Coverage

- RFC-0012 v1.0 — Autonomous Engineering Planning Model (Referenced; Planning Correlation and the `Submitted → Under Review` transition implement RFC-0012's Planning Correlation and Proposal Lifecycle sections, unmodified)
- RFC-0006 — Engineering Assessment Model (Referenced; `Review` consumed read-only through its existing public contract, unmodified)
- RFC-0001, RFC-0004, RFC-0005, RFC-0008 (Referenced; consumed read-only, unmodified, unchanged from Sprint 72/73)

Ratification

- `NEXUS-RAT-2026-07-17-012` — decomposes Initial Capability Sequence step 5 into Sprints 74–77 and authorizes this Sprint's exact scope, reproduced in full in the Sprint 74 record.
- `NEXUS-RAT-2026-07-17-013` — authorizes the additive `Under Review` lifecycle extension required by Sprint 74's `Submitted → Under Review` transition.

See `knowledge/implementation/sprints/sprint-0074-planning-correlation-and-review-entry-foundation.md` for the complete Sprint Implementation Record.

---

## Sprint 73 — Planning Service and Proposal Lifecycle Foundation

Status: ✅ Approved — `NEXUS-REV-2026-07-17-013` (PASS; fully closed, zero findings of any category). Ratified by `NEXUS-RAT-2026-07-17-011`. Milestone 11 Initial Capability Sequence step 4.

Objective

Introduce a thin `PlanningService` application-orchestration layer over Sprint 72's frozen Planning domain model: Kernel-composed creation of `ProposedMissionPlan` and `ProposedPlanRevision`, and the existing `Draft`/`Submitted`/`Withdrawn` Proposal Lifecycle transitions only. This Sprint introduces no Domain Event publication, no new Proposal Lifecycle state, no Review/Governance integration, and no Activation.

RFC Coverage

- RFC-0012 v1.0 — Autonomous Engineering Planning Model (Referenced; `PlanningService` orchestrates Sprint 72's frozen domain model, unmodified)
- RFC-0001, RFC-0004, RFC-0008 (Referenced; consumed read-only, unmodified)

Ratification

- `NEXUS-RAT-2026-07-17-011` — renames Initial Capability Sequence step 4 and authorizes this Sprint's exact scope, reproduced in full in the Sprint 73 record.

See `knowledge/implementation/sprints/sprint-0073-planning-service-and-proposal-lifecycle-foundation.md` for the complete Sprint Implementation Record.

Builder Implementation Result

- Implemented `PlanningService` in `src/kernel/planning/` as a thin application-orchestration layer over Sprint 72's frozen Planning domain model.
- Registered `PlanningService` through Kernel composition with the existing in-memory Proposed Mission Plan repository.
- Added service operations for idempotent Proposed Mission Plan creation, idempotent Proposed Plan Revision creation, and the authorized `Draft`/`Submitted`/`Withdrawn` lifecycle transitions only.
- Reused Sprint 72 Structural Plan Validation, Planning Policy validation, Planner Attribution validation, repository persistence, and Planning domain errors without modifying Sprint 72 domain/value-object logic.
- Added Planning service and Kernel boundary tests covering construction, composition, idempotency, lifecycle transitions, validation propagation, Planner Attribution enforcement, and missing proposal lookup diagnostics.

---

## Sprint 72 — Planning Policy and Proposed Plan Foundation

Status: ✅ Approved — `NEXUS-REV-2026-07-17-012` (PASS; fully closed, zero open findings of any category). Originally Approved with Findings under `NEXUS-REV-2026-07-17-011` (two Minor Category 1 findings, F-001/F-002 — `PlanningPolicy.requireMissionId` dead field; three unused `PlanningDiagnosticCode` union members); both independently verified Resolved via `BT-072-001`/`BT-072-002` (`builder-task.md`). Ratified by `NEXUS-RAT-2026-07-17-010`.

Objective

Implement the foundational, non-executable Planning domain: Planning Policy, `ProposedMissionPlan`, `ProposedPlanRevision`, `ProposedTask`, `ProposedTaskDependency`, Planner Attribution, the `Draft`/`Submitted`/`Withdrawn` Proposal Lifecycle foundation, and Structural Plan Validation, exactly as scoped by RFC-0012 v1.0 and `NEXUS-RAT-2026-07-17-010`. This Sprint introduces no Review, Governance, Activation, event publication, or workflow orchestration.

RFC Coverage

- RFC-0012 v1.0 — Autonomous Engineering Planning Model (Planning Policy, Proposed Mission Plan/Revision/Task/Dependency, Planner Attribution, Proposal Lifecycle foundation, Structural Plan Validation)
- RFC-0004 — Execution Model (Referenced; `RoleRegistry`/`executionRoleId`, Adapter identity consumed read-only for Planner Attribution)
- RFC-0001 — Mission Model (Referenced; `missionId` consumed read-only; no MissionPlan/Task/TaskDependency modification)

Ratification

- `NEXUS-RAT-2026-07-17-010` — ratifies RFC-0012 v1.0 Final and authorizes this Sprint's exact scope, reproduced in full in the Sprint 72 record.

See `knowledge/implementation/sprints/sprint-0072-planning-policy-and-proposed-plan-foundation.md` for the complete Sprint Implementation Record.

Builder Implementation Result

- Implemented an independent `src/kernel/planning/` domain module with Planning Policy, `ProposedMissionPlan`, `ProposedPlanRevision`, `ProposedTask`, `ProposedTaskDependency`, Planner Attribution, Planning Diagnostics, Structural Plan Validation, and an in-memory `IProposedMissionPlanRepository`.
- Implemented only the authorized `Draft`, `Submitted`, and `Withdrawn` lifecycle foundation. Lifecycle transitions produce new immutable `ProposedPlanRevision` snapshots.
- Added Planning unit tests covering construction, immutability, Planner Attribution validation, structural validation failures, lifecycle transitions, submission preconditions, and repository snapshot persistence.
- Preserved Sprint 1-71 production contracts and did not modify `src/hosts` or `src/adapters`.

---

## Sprint 71 — Governance Decision Applicability Correction

Status: ✅ Approved — `NEXUS-REV-2026-07-17-010` (RFC-0001 §15a Correction Verification; fully closed with zero open findings of any category). Originally Rejected under `NEXUS-REV-2026-07-17-009` (one Category 3, Critical finding, F-001, confined to the RFC-0001 document; resolved via `nexus-plan`'s §15a correction). Ratified by `NEXUS-RAT-2026-07-17-009`. Milestone 11's opening Sprint.

Objective

Implement RFC-0001 v1.2's Governance Decision applicability and supersession semantics, excluding only a precisely superseded Rejected `GovernanceDecision` from Mission completion evaluation, strictly within `src/kernel/mission/mission-completion-eligibility.ts` and its direct collaborators. This Sprint introduces no new production capability, event, mechanism, lifecycle state, or domain concept beyond the narrowed applicability rule itself.

RFC Coverage

- RFC-0001 v1.2 — Mission Model (Amended by `NEXUS-RAT-2026-07-17-009`; this Sprint implements the amendment)
- RFC-0004 v1.16 — Execution Model (Referenced; `EngineeringDecisionCorrelation`, `RecoveryRequirement`, Recovery-Gated Re-Advancement consumed read-only, unmodified)
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision` consumed read-only, unmodified)

Ratification

- `NEXUS-RAT-2026-07-17-009` — amends RFC-0001 to v1.2 and authorizes this Sprint's Required Test Matrix (ten items) below.

Required Test Matrix (binding, minimum)

1. Rejected `D1` → exact `RecoveryRequirement` (created from `D1`) resolved → subsequent Approved `D2` for the same governed position → `D1` excluded from the applicable set; Mission Completion permitted (subject to all other applicable decisions and existing Task-completion rules).
2. A later Rejected `D2` for the same governed position does not supersede `D1`.
3. A later Deferred `D2` for the same governed position does not supersede `D1`.
4. A later Escalation Required `D2` for the same governed position does not supersede `D1`.
5. An Approved decision for a different Workflow Step does not supersede `D1`.
6. An Approved decision for a different Engineering Session does not supersede `D1`.
7. An Approved decision for a different Mission does not supersede `D1`.
8. A `RecoveryRequirement` not caused by `D1` does not permit supersession, even if Resolved.
9. An unresolved or Withdrawn `RecoveryRequirement` does not permit supersession.
10. Existing independent-satisfaction behavior (Sprint 61/62, frozen) is unchanged for every non-superseded `GovernanceDecision`.

Architectural Boundaries

Sprint 71 SHALL NOT modify `GovernanceDecision`, `RecoveryRequirement`, `WorkflowChain`, `WorkflowStep`, `EngineeringSession`, `EngineeringDecisionCorrelation`, Review, any event, any event consumer, any projection, Host, or Adapters.

Builder Implementation Result

- Implemented RFC-0001 v1.2's narrowed applicable `GovernanceDecision` rule inside `mission-completion-eligibility.ts`.
- Added exact-position supersession filtering for only a Rejected `D1` with a Resolved, causally matching `RecoveryRequirement` and a later Approved `D2` for the same Mission, Engineering Session, and Workflow Step.
- Wired `MissionExecutionService` and `createKernelServices()` to consume existing read-only Engineering Decision Correlation and Recovery Requirement repositories for Mission Completion eligibility.
- Added dedicated Sprint 71 tests covering all ten Required Test Matrix items while preserving independent-satisfaction behavior for non-superseded decisions.
- Introduced no new Domain Event, aggregate, lifecycle state, persistence write path, Host change, or Adapter change.

See `knowledge/implementation/sprints/sprint-0071-governance-decision-applicability-correction.md` for the complete Sprint Implementation Record.
