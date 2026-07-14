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

Status: ACTIVE (Sprint 39 Approved — NEXUS-REV-2026-07-14-017; Sprint 40 Approved with Findings — Execution Session Foundation, NEXUS-REV-2026-07-14-018; Sprint 41 Approved — Workflow Chaining Foundation, NEXUS-REV-2026-07-14-020; Sprint 42 Approved with Findings — Engineering Session Workflow Chain Wiring, NEXUS-REV-2026-07-14-021, fully closed by NEXUS-REV-2026-07-14-022; Sprint 43 Approved — Engineering Session Manual Workflow Advancement, NEXUS-REV-2026-07-14-023; Sprint 44 Approved — Assignment Policy Foundation, NEXUS-REV-2026-07-14-024; Sprint 45 Approved — Automatic/Event-Driven Workflow Advancement, NEXUS-REV-2026-07-14-026, fully closed by TASK-001 remediation of NEXUS-REV-2026-07-14-025-F-001; Sprint 46 Approved with Findings — Review-Gated Workflow Advancement, NEXUS-REV-2026-07-15-001, zero open findings; Sprint 47 Approved — Workflow Chain Execution, NEXUS-REV-2026-07-15-003, fully closed with zero open findings; Sprint 48 Approved — Assignment Policy Integration, NEXUS-REV-2026-07-15-005, fully closed with zero open findings)

Named by `NEXUS-RAT-2026-07-14-011` as a future milestone. Original candidate scope: Engineering Role Profiles, Workflow Chaining, Assignment Policy, Execution Sessions, Multi-agent Engineering Orchestration, and review-gated execution progression. These are execution-orchestration concerns, not Host-workflow concerns, and were intentionally excluded from Milestone 7 (now Complete, `NEXUS-RAT-2026-07-14-016`). Engineering Role Profiles shipped under Milestone 7 (Sprint 38); Execution Sessions' foundation shipped as Sprint 39's `EngineeringSession` and Sprint 40's `ExecutionSession`. RFC-0004 was amended to v1.3 (`NEXUS-RAT-2026-07-14-020`) to define Workflow Chaining, implemented by Sprint 41 as a standalone `WorkflowChain` concept and wired into `EngineeringSession` by Sprint 42. Sprint 43 (Approved, `NEXUS-REV-2026-07-14-023`) closed Sprint 42's own recorded Known Limitation by introducing deterministic, manually-invoked, single-step workflow advancement and terminal-completion detection. Sprint 44 (Approved, `NEXUS-REV-2026-07-14-024`) implements RFC-0004's existing Assignment Policy section as a standalone domain foundation. RFC-0004 was amended to v1.4 (`NEXUS-RAT-2026-07-14-025`) to define a generalized Workflow Advancement model (Advancement Strategy, Trigger, Eligibility, Authority, Result, Failure) naming three Advancement Strategies: Manual (Sprint 43), Automatic/Event-Driven (Sprint 45, `NEXUS-RAT-2026-07-14-026`), and Review-Gated (Sprint 46, `NEXUS-REV-2026-07-15-001`). During Sprint 47's planning, governance analysis determined that Workflow Advancement moves the current workflow position but RFC-0004 explicitly reserved *executing* the Workflow Step at that position (Adapter dispatch) as a separate, not-yet-authorized capability (v1.3 § Workflow Chaining, v1.4 § Workflow Advancement). RFC-0004 was therefore amended to v1.6 (`NEXUS-RAT-2026-07-15-003`) to add "Workflow Chain Execution," implemented by Sprint 47 (`NEXUS-RAT-2026-07-15-004`) and Approved (`NEXUS-REV-2026-07-15-003`, fully closed after `TASK-001` remediated the sole finding from `NEXUS-REV-2026-07-15-002`). During Sprint 48's planning, a Sprint Owner planning request proposed evaluating "Assignment Policy Foundation" as Milestone 8's next capability; governance analysis found that capability already certified with zero findings as Sprint 44, frozen under Approved Vertical Slice Immutability. RFC-0004 was therefore amended to v1.7 (`NEXUS-RAT-2026-07-15-005`) to add an "Assignment Policy Evaluation" subsection to Workflow Chain Execution — an optional consumption point gating dispatch using Sprint 44's existing, unmodified evaluation — implemented by Sprint 48 (`NEXUS-RAT-2026-07-15-006`), Approved (`NEXUS-REV-2026-07-15-005`, fully closed after `TASK-001` remediated the sole finding from `NEXUS-REV-2026-07-15-004`). Remaining candidate scope after Sprint 48 (Multi-Agent Engineering Orchestration, session recovery/checkpointing, concurrent session coordination) requires its own future Sprint Owner scope ratification via `nexus-plan`.

Opened by `NEXUS-RAT-2026-07-14-018`, following the RFC-0004 v1.2 amendment (`NEXUS-RAT-2026-07-14-017`) that introduced `Engineering Session` — the Kernel-owned runtime boundary for one span of AI-assisted engineering work, distinct from and containing zero or more of RFC-0004's existing, unmodified `Execution Session` records. Sprint 39 — Engineering Sessions Foundation is Milestone 8's opening Sprint, implementing `EngineeringSession`/`EngineeringSessionId`/`EngineeringSessionStatus`/`EngineeringSessionService` as a foundation-only vertical slice.

Workflow Chaining, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration, automatic workflow advancement, session recovery/checkpointing, and concurrent session coordination remain explicitly deferred; each requires its own future Sprint Owner scope ratification before implementation.

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
- `TASK-001` remediation verified (`NEXUS-REV-2026-07-15-005`): two test cases added to `engineering-session.service.test.ts` covering exactly the two identified branches; no production source file modified; `npm run validate` passes at 75 files / 376 tests. Sprint 48 is fully closed with zero open findings. No further Milestone 8 Sprint is currently planned to advance to Current; the next Milestone 8 direction (Multi-Agent Orchestration, session recovery/checkpointing, or concurrent session coordination) requires its own future Sprint Owner scope ratification via `nexus-plan`.
