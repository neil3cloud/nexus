# Nexus Implementation Manifest

## Purpose

This manifest records implementation progress for Nexus vertical slices. Normative behavior remains governed by the Kernel Canon and RFC specification suite.

---

# Milestone 1 — Core Mission Kernel

Status: ✅ COMPLETE (Sprint 1 through Sprint 4)

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

Status: Historically Accepted Governance Deviation (NEXUS-RAT-2026-07-13-008). No Reviewer certification for this sprint was ever persisted in `REVIEW_HISTORY.md`; none is fabricated retroactively. See `knowledge/governance/RATIFICATION_LEDGER.md` § NEXUS-RAT-2026-07-13-008 for the full investigation and governance decision.

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

Status: Historically Accepted Governance Deviation (NEXUS-RAT-2026-07-13-008). The Source Review entries below (`NEXUS-REV-2026-07-12-003`/`-004`) were never persisted in `REVIEW_HISTORY.md`; no fabricated retroactive certification is recorded. See `knowledge/governance/RATIFICATION_LEDGER.md` § NEXUS-RAT-2026-07-13-008.

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

Status: Historically Accepted Governance Deviation (NEXUS-RAT-2026-07-13-008). No Reviewer certification for this sprint was ever persisted in `REVIEW_HISTORY.md`; none is fabricated retroactively. See `knowledge/governance/RATIFICATION_LEDGER.md` § NEXUS-RAT-2026-07-13-008.

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

# Milestone 2 — AI Collaboration Kernel

Status: ✅ COMPLETE (Sprint 5 through Sprint 15)

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

## Sprint 9 — Review Foundation

Status: Implemented — Pending Reviewer Validation

RFC Coverage:

- RFC-0006 — Engineering Assessment Model (Partial)

Ratification:

- NEXUS-RAT-2026-07-12-006 — canonical "Review" implementation-layer vocabulary for RFC-0006: `Review`, `ReviewStatus` (`Pending → In Progress → Completed`), `ReviewOutcome` (Accepted / Accepted With Observations / Action Required / Rejected), `ReviewCriteria`, `Finding`, `Severity`, `FindingCategory`, `FindingStatus` (`Created → Accepted / Resolved / Dismissed`). Also corrects an unrelated RFC-0005 title citation in `domain-schema.md`. RFC-0006 and RFC-0005 are unmodified.

Implemented Concepts:

- Review aggregate with immutable ReviewId, Mission reference, MissionPlan revision reference, explicit ReviewCriteria, consumed Evidence references, ReviewStatus lifecycle, ReviewOutcome assignment, and owned Finding collection.
- ReviewId and FindingId immutable identity value objects.
- ReviewStatus lifecycle: Pending → In Progress → Completed.
- ReviewOutcome value object supporting Accepted, Accepted With Observations, Action Required, and Rejected.
- ReviewCriteria value object for explicit assessment criteria.
- Finding entity with FindingId, owning ReviewId, Severity, optional FindingCategory for actionable Findings, summary, description, supporting Evidence references, affected artifact references, criteria references, and FindingStatus lifecycle.
- Severity, FindingCategory, and FindingStatus value objects using the ratified vocabulary.
- IReviewRepository contract and InMemoryReviewRepository process-local snapshot persistence for Reviews and Findings.
- ReviewService orchestration for start Review, publish Finding, finalize Review outcome, retrieve Review, enumerate Reviews, and enumerate Findings through constructor injection.
- Kernel service composition updated so ReviewService receives an injected in-memory Review repository.
- Deterministic diagnostics for invalid Review definitions, invalid lifecycle transitions, duplicate Reviews, duplicate Findings, missing Evidence references, missing Reviews, rejected completion, and invalid Finding transitions.
- Unit tests for Review aggregate behavior, Finding behavior, value objects, repository behavior, service orchestration, lifecycle validation, duplicate validation, evidence-backed Findings, and completion rules.

Deferred Concepts:

- AI review execution (Claude, Copilot, or any Adapter-driven Review execution).
- Adapter invocation from the Review domain.
- Governance decisions / policy-driven Assessment Criteria selection.
- Event Bus integration (`ReviewStarted`, `ReviewCompleted`, `ReviewAccepted`, `ReviewRejected`, `FindingCreated`, `FindingAccepted`, `FindingResolved`, `FindingDismissed`).
- Multi-Assessment-Session Reviews.
- Actionable Finding to Mission Plan revision / Mission Evolution wiring.
- Human Authority operations (approve/reject/override Assessment Outcomes) and Override-as-Evidence.
- Execution Session consumption (RFC-0004 Execution Session remains unimplemented).
- Shared Reality Projection consumption as an Assessment input.
- Produced Artifacts consumption as an Assessment input.
- Assessment Outcome reasoning-chain capture (RFC-0006 § Explainability).
- Produced Artifacts becoming Knowledge.
- Workflow automation and repository state transitions outside Review and Finding lifecycles.
- Sensitive Finding access control.

Notes:

- See `knowledge/implementation/sprints/sprint-0009-review-foundation.md` for the complete Sprint Implementation Record, including the full canonical vocabulary table.
- RFC-0006 is not modified by this sprint or by its ratification; RFC-0006 remains the sole normative owner of Engineering Assessment semantics.
- `ReviewStatus` and `FindingStatus` are implementation-layer operational lifecycle concepts, not RFC-0006-normative concepts, and SHALL NOT be conflated with `ReviewOutcome` (the RFC-0006-owned Assessment Outcome).
- Review remains deterministic and provider-agnostic.
- ReviewService coordinates repository access and aggregate operations only; Review and Finding own lifecycle and validation rules.
- Evidence, Shared Reality, Execution Roles, Governance, Mission Plan mutation, Adapter invocation, Event Bus integration, and Knowledge capture remain outside this slice.

---

## Sprint 10 — Execution Strategy

Status: Implemented — Pending Reviewer Validation

RFC Coverage:

- RFC-0004 — Execution Model (Partial)

Ratification:

- NEXUS-RAT-2026-07-12-007 — corrects `knowledge/reference/domain-schema.md`'s Execution Domain description: `Assignment` (the approved Sprint 8 `RoleAssignment` model) remains independently owned; Execution Strategy coordinates and references `RoleAssignment` records rather than exclusively owning them. RFC-0004 is unmodified. Sprint 8's approved implementation is not reopened.

Implemented Concepts:

- `ExecutionStrategy` aggregate representing one Mission's deterministic execution-coordination rules (dependency-ordering rule, concurrency rule as deterministic policy data).
- `ExecutionStrategyId`.
- Advisory/evaluative dependency-ordering readiness query for `RoleAssignment` via `ExecutionStrategyService.evaluateAssignmentReadiness` against MissionPlan Task Graph dependencies (direct and transitive); not an enforced precondition on `RoleService.assignRole`.
- `ExecutionStrategyService` orchestration through constructor-injected repository contracts, reading `RoleAssignmentRepository` and `IMissionPlanRepository` without mutating them.
- `IExecutionStrategyRepository` contract and `InMemoryExecutionStrategyRepository`.
- Deterministic diagnostics for unsatisfied dependency ordering, unknown references, and duplicate ExecutionStrategy per Mission.

Deferred Concepts:

- Execution State (full RFC-0004 minimum state set: Pending, Ready, Assigned, Executing, Awaiting Review, Completed, Failed, Blocked).
- Execution Session.
- Review requirements enforcement / RFC-0006 Review gating of execution progression.
- Adapter invocation and Adapter selection.
- AI Providers and provider coordination.
- Actual parallel/concurrent execution runtime; only deterministic concurrency policy data is in scope.
- Governance.
- Assignment Policy elements beyond dependency ordering (Adapter capability matching, repository configuration, execution constraints, human preferences).
- Human Authority operations.
- Event Bus integration.
- Explainability reporting beyond deterministic validation diagnostics.

Notes:

- See `knowledge/implementation/sprints/sprint-0010-execution-strategy.md` for the complete Sprint Implementation Record.
- RFC-0004 is not modified by this sprint or by its ratification.
- `ExecutionStrategy` does not mutate Mission, MissionPlan, Task, or RoleAssignment aggregates; all cross-domain interaction occurs through existing published repository contracts.
- `ExecutionStrategy` is advisory/evaluative this slice; it does not gate or trigger Task execution. `MissionExecutionService` (Sprint 4) remains the sole Task execution entry point and already performs its own independent Task-dependency validation before Task start.

---

## Sprint 11 — Domain Event Publication (Evidence, Review)

Status: Implemented — Pending Reviewer Validation

RFC Coverage:

- RFC-0005 — Domain Event Model (Partial)

Ratification:

- NEXUS-RAT-2026-07-13-001 — authorizes an optional `missionId` field on `RegisterEvidenceRequest`/`EvidenceSnapshot` (additive extension to the approved Sprint 5 Evidence model), resolving the RFC-0005 `EvidenceCaptured` envelope attribution gap identified by the Builder before implementation began. RFC-0002 and RFC-0005 are unmodified; Evidence remains Mission-independent by design.
- NEXUS-RAT-2026-07-13-002 — restores required `missionId` on the shared Kernel `DomainEvent` / `DomainEventAttribution` contract and authorizes an Evidence-specific publication variant for Mission-independent `EvidenceCaptured` events.

Implemented Concepts:

- Optional `missionId?: string` on `RegisterEvidenceRequest`/`EvidenceSnapshot` and the `Evidence` aggregate (NEXUS-RAT-2026-07-13-001).
- `EvidenceService` and `ReviewService` optional constructor-injected `EventBusContract`, matching `MissionService`'s established pattern.
- `Evidence` and `Review` aggregate internal recorded-events collections and `pullDomainEvents()`, mirroring `Mission`.
- `EvidenceCaptured` event (Evidence Service producer); Mission-associated Evidence uses the shared `DomainEvent` envelope with `missionId`, while Mission-independent Evidence uses the Evidence-specific publication variant authorized by NEXUS-RAT-2026-07-13-002 and omits `missionId` as authorized by NEXUS-RAT-2026-07-13-001.
- `ReviewStarted`, `ReviewCompleted`, `ReviewAccepted`, `ReviewRejected`, `FindingCreated` events (Review Service producer).

Deferred Concepts:

- Execution Strategy event publication — no cataloged event category currently assigns `ExecutionStrategyService` a producible event.
- `EvidenceAccepted`, `EvidenceRejected` (catalog Producer: Review Service; no corresponding operation exists).
- `FindingAccepted`, `FindingDismissed` (catalog Producer: Developer; no human-action command pathway exists).
- `FindingResolved` (catalog Producer: Execution Strategy; no trigger exists).
- Mission Plan Events and Task Events — deferred pending resolution of the Task Lifecycle three-way naming mismatch between RFC-0004's Execution State, `kernel-state-machine.md`'s Task Lifecycle, and the approved Sprint 3 `TaskStatus` enum.
- Knowledge Events, Shared Reality Events, Context Package Events, Policy Events.
- Event subscription/consumption by other services.
- Durable/persistent Event Streams.

Notes:

- See `knowledge/implementation/sprints/sprint-0011-domain-event-publication.md` for the complete Sprint Implementation Record, including the full Producer-mismatch scoping table.
- This sprint does not modify RFC-0005, the Kernel Canon, or `ExecutionStrategyService`.
- Save-then-publish non-atomicity for Evidence and Review mirrors the disclosed Mission (Sprint 2) limitation; it is not resolved by this sprint.

---

## Sprint 12 — Knowledge Foundation

Status: Implemented — Pending Reviewer Validation

RFC Coverage:

- RFC-0007 — Knowledge Model (Partial)

Ratification:

- NEXUS-RAT-2026-07-13-003 — ratifies `Knowledge` as the canonical implementation-layer vocabulary for RFC-0007's Engineering Memory domain (`Knowledge` aggregate, `KnowledgeId`, `KnowledgeStatus` [`Candidate → Approved → Active → Superseded → Archived`], `KnowledgeScope`, `KnowledgeProvenance`, `KnowledgeAttribution`). RFC-0007 is unmodified and remains the sole normative owner of Engineering Memory semantics. Authorizes corrections to `kernel-data-model.md` (adding `status`, `missionPlanRevisionId`, `supportingReviewId`, `contributingEventIds`, `approvingAuthority` to the Knowledge model) and `knowledge-service-contract.md` (`supportingAssessment` → `supportingReview`). Defers Knowledge event publication and the three existing inconsistent Knowledge/Memory event-name sets to a future Knowledge Event Publication sprint.

Implemented Concepts (Implemented — Pending Reviewer Validation):

- `Knowledge` aggregate with immutable `KnowledgeId`, `missionId`, `missionPlanRevisionId`, `summary`, `KnowledgeScope`, `KnowledgeStatus` lifecycle, `supportingEvidenceIds`, `supportingReviewId`, `approvingAuthority`, and append-only revision history preserving identity, attribution, and provenance.
- `KnowledgeStatus` lifecycle value object: `Candidate → Approved → Active → Superseded → Archived`.
- `KnowledgeProvenance` and `KnowledgeAttribution` value objects (Evidence lineage, Review lineage, Mission lineage, approval lineage).
- Memory Capture (`KnowledgeService.captureKnowledge`) rejecting capture unless a supporting Review exists, has reached a terminal accepted state, supporting Evidence exists, required Mission work has completed, and required approval metadata is present — validation owned by the `Knowledge` aggregate and its value objects.
- Memory Evolution (`KnowledgeService.reviseKnowledge`) producing append-only revisions.
- `IKnowledgeRepository` contract and `InMemoryKnowledgeRepository` process-local persistence.
- `KnowledgeService` thin orchestration through constructor-injected repository contracts.

Deferred Concepts:

- Knowledge event publication and reconciliation of the three existing Knowledge/Memory event-name sets (`kernel-event-catalog.md`, `knowledge-service.md`, RFC-0007 Memory Lifecycle).
- Event subscriptions/consumers.
- Context Assembly consumption of Knowledge.
- Governance / policy-driven capture criteria.
- Human Authority approval workflow automation beyond recording `approvingAuthority` as data.
- Adapter/AI Provider integration.
- Search, indexing, durable persistence.

Notes:

- See `knowledge/implementation/sprints/sprint-0012-knowledge-foundation.md` for the complete Sprint Implementation Record.
- This sprint does not modify RFC-0007, RFC-0006, RFC-0002, RFC-0001, or the Kernel Canon.
- `KnowledgeService` SHALL remain a thin application service; business rules SHALL remain within the `Knowledge` aggregate and its value objects, per Sprint Owner direction.

---

## Sprint 13 — Knowledge Event Publication

Status: Implemented — Pending Reviewer Validation

RFC Coverage:

- RFC-0005 — Domain Event Model (Partial)

Ratification:

- NEXUS-RAT-2026-07-13-004 — ratifies `KnowledgeCandidateCreated` (reused from `kernel-event-catalog.md`) for `captureKnowledge` and `KnowledgeRevisionCreated` (new) for `reviseKnowledge`; scopes Sprint 13 to exactly these two operations/events; defers `approveKnowledge`/`activateKnowledge`/`supersedeKnowledge`/`archiveKnowledge` and their events (`KnowledgeAccepted`/`KnowledgePublished`/`KnowledgeSuperseded`/`KnowledgeArchived`) entirely to a future sprint; establishes the permanent Governance Rule that Domain Events represent completed domain facts, not implementation actions. RFC-0007, RFC-0005, RFC-0006, and the Kernel Canon are unmodified.

Implemented Concepts:

- `KnowledgeService` optional constructor-injected `EventBusContract`, matching the established `EvidenceService`/`ReviewService` pattern (`requireEventBus()` guard).
- `Knowledge` aggregate exposing recorded Domain Events through the Kernel's established aggregate event-recording contract (drain-once `pullDomainEvents()`-shaped access), mirroring `Mission`/`Evidence`/`Review`.
- `knowledge.events.ts`: `KnowledgeEventType` union (`KnowledgeCandidateCreated`, `KnowledgeRevisionCreated`), `KnowledgeDomainEvent` type, and factory functions.
- `captureKnowledge` publishes `KnowledgeCandidateCreated`; `reviseKnowledge` publishes `KnowledgeRevisionCreated` — both only after the associated state transition has been successfully persisted; no event is published if persistence fails.
- Kernel service composition updated so `KnowledgeService` receives the shared `EventBusContract` instance.
- Reference-document corrections authorized by NEXUS-RAT-2026-07-13-004 (`kernel-event-catalog.md` additions, `knowledge-service.md` Events-section correction).

Deferred Concepts:

- `approveKnowledge`/`activateKnowledge`/`supersedeKnowledge`/`archiveKnowledge` operations and their events — entirely out of scope, not merely event-silent.
- Event subscriptions/consumers.
- Mission Plan Events, Task Events, Execution Strategy Events (unresolved Task Lifecycle naming mismatch).
- Shared Reality, Context Package, and Policy Events.
- Durable/persistent Event Streams.

Notes:

- See `knowledge/implementation/sprints/sprint-0013-knowledge-event-publication.md` for the complete Sprint Implementation Record.
- This sprint does not modify RFC-0007, RFC-0005, RFC-0006, or the Kernel Canon.
- Knowledge Domain Events SHALL remain notifications of completed state transitions; they SHALL NOT initiate, coordinate, or trigger subsequent domain behavior, per Sprint Owner direction and NEXUS-RAT-2026-07-13-004.
- Equivalent aggregate state transitions SHALL produce equivalent Domain Events (deterministic publication), per Sprint Owner direction.

---

## Sprint 14 — Knowledge Lifecycle Advancement

Status: Implemented — Pending Reviewer Validation

RFC Coverage:

- RFC-0005 — Domain Event Model (Partial)
- RFC-0007 — Knowledge Model (Referenced)

Ratification:

- NEXUS-RAT-2026-07-13-005 — ratifies `KnowledgeService.approveKnowledge`/`activateKnowledge`/`supersedeKnowledge`/`archiveKnowledge`, publishing `KnowledgeAccepted`/`KnowledgePublished`/`KnowledgeSuperseded`/`KnowledgeArchived` respectively (event names previously reused/named by NEXUS-RAT-2026-07-13-003/-004), each a thin orchestration invoking the corresponding existing frozen `Knowledge` aggregate method and publishing only after successful persistence. RFC-0007, RFC-0005, RFC-0006, and the Kernel Canon are unmodified. No successor-reference modeling, authorization/policy enforcement, or event subscription is authorized.

Implemented Concepts:

- `KnowledgeService.approveKnowledge`/`activateKnowledge`/`supersedeKnowledge`/`archiveKnowledge` — minimal `{ knowledgeId }` request shape, matching `ReviseKnowledgeRequest`.
- `knowledge.events.ts` factories for `KnowledgeAccepted`, `KnowledgePublished`, `KnowledgeSuperseded`, `KnowledgeArchived`.
- `Knowledge.approve()`/`activate()`/`supersede()`/`archive()` gain the same optional `DomainEventMetadata` parameter already added to `capture()`/`revise()` in Sprint 13.
- Reference-document corrections to `knowledge-service.md` and `knowledge-service-contract.md` authorized by NEXUS-RAT-2026-07-13-005.

Deferred Concepts:

- Successor-reference modeling (a "supersedes"/"supersededBy" link between Knowledge items) — not defined by RFC-0007.
- Authorization, policy evaluation, or governance-workflow enforcement for who may call the lifecycle-advancement operations.
- Event subscriptions/consumers.
- Context Assembly consumption of Knowledge.
- Mission Plan Events, Task Events, Execution Strategy Events (unresolved Task Lifecycle naming mismatch).
- Shared Reality, Context Package, and Policy Events.
- Durable/persistent Event Streams.

Notes:

- See `knowledge/implementation/sprints/sprint-0014-knowledge-lifecycle-advancement.md` for the complete Sprint Implementation Record.
- This sprint does not modify RFC-0007, RFC-0005, RFC-0006, or the Kernel Canon.
- `KnowledgeStatus`'s existing linear transition legality (Sprint 12, frozen) and the aggregate's existing parameterless lifecycle methods are consumed unmodified, per NEXUS-RAT-2026-07-13-005 and the Approved Vertical Slice Immutability rule.

---

## Sprint 15 — Mission Plan & Task Event Publication

Status: Implemented — Pending Reviewer Validation

RFC Coverage:

- RFC-0005 — Domain Event Model (Partial)
- RFC-0001 — Mission Model (Referenced)

Ratification:

- NEXUS-RAT-2026-07-13-006 — ratifies `TaskStatus` as implementation-layer vocabulary distinct from RFC-0004's Execution State; corrects `kernel-state-machine.md`'s Task Lifecycle; reattributes Mission Plan/Task event producers to `MissionPlanningService` and `MissionExecutionService`; resolves a pre-existing `kernel-event-catalog.md` duplication (legacy `MissionPlanRevised`/`TaskAdded` entries, redundant `MissionPlanSuperseded` entry); defers `MissionPlanActivated`.

Planned Concepts:

- `MissionPlanningService` optional `EventBusContract` injection publishing `MissionPlanCreated`, `MissionPlanRevised`, `TaskCreated`.
- `MissionExecutionService`'s existing required `EventBusContract` extended to publish `TaskStarted`, `TaskCompleted`, `TaskCancelled` from its existing Task execution operations.
- `MissionPlan`/`Task` aggregate recorded-events collections and `pullDomainEvents()`, new to these aggregates.
- Reference-document corrections to `kernel-state-machine.md` and `kernel-event-catalog.md` per NEXUS-RAT-2026-07-13-006.

Deferred Concepts:

- `MissionPlanActivated` — no implemented operation exists.
- `TaskReady`, `TaskAssigned`, `TaskBlocked` — Execution Strategy/Task Coordinator producer roles unimplemented.
- Event subscriptions/consumers.
- Knowledge, Shared Reality, Context Package, and Policy Events.
- Durable/persistent Event Streams.

Notes:

- See `knowledge/implementation/sprints/sprint-0015-mission-plan-task-event-publication.md` for the complete Sprint Implementation Record.
- This sprint does not modify RFC-0001, RFC-0004, RFC-0005, or the Kernel Canon.
- `Mission`'s existing, frozen `MissionEventType` union (`mission.events.ts`) already contains unused `MissionPlanRevised`/`TaskAdded`/`TaskCompleted`/`TaskRemoved` entries dating from before Sprint 3 introduced `MissionPlan`/`Task` as independent aggregates; these are never constructed anywhere and are out of scope for this sprint. New Mission Plan/Task events are defined on new `MissionPlanDomainEvent`/`TaskDomainEvent` type unions, not by modifying `mission.events.ts`.

---

# Milestone 3 — Kernel Integration & Composition

Status: ✅ COMPLETE (Sprint 16 Approved; Sprint 17 Approved; Sprint 18 Approved)

## Sprint 16 — End-to-End Mission Workflow Integration Validation

Status: Approved (NEXUS-REV-2026-07-13-014)

RFC Coverage:

- RFC-0001 — Mission Model (Referenced)
- RFC-0002 — Evidence Model (Referenced)
- RFC-0003 — Shared Reality Projection Model (Referenced)
- RFC-0004 — Execution Model (Referenced)
- RFC-0005 — Domain Event Model (Referenced)
- RFC-0006 — Engineering Assessment Model (Referenced)
- RFC-0007 — Knowledge Model (Referenced)

Implemented Concepts:

- End-to-end integration test suite exercising the composed Kernel (`createKernelServices`) through: Create Mission → Create Mission Plan → Create Tasks → Execute Tasks → Complete Mission → Perform Review → Capture Knowledge.
- Composed-service, dependency-injection, repository-interaction, aggregate-interaction, Domain Event ordering, and cross-domain invariant validation.
- Review outcome-specific Domain Event identity correction discovered during integration validation; `ReviewCompleted` and `ReviewAccepted`/`ReviewRejected` now use distinct event identities.

Deferred Concepts:

- AI provider integrations (Claude CLI, GitHub Copilot, Gemini, Codex), Adapter runtime implementations, VS Code host integration, workflow/governance automation, Context Package, Policy Engine, Durable Event Streams, event subscriptions, persistent storage, production/distributed infrastructure.

Notes:

- See `knowledge/implementation/sprints/sprint-0016-end-to-end-mission-workflow-integration-validation.md` for the complete Sprint Implementation Record.
- This sprint introduces no new normative concepts; it validates existing approved behavior only.

---

## Sprint 17 — Cross-Domain Failure-Path Integration Validation

Status: Approved (NEXUS-REV-2026-07-13-017)

RFC Coverage:

- None primary — this sprint introduces no new normative concepts.
- Referenced: RFC-0001, RFC-0002, RFC-0004, RFC-0005, RFC-0006, RFC-0007.

Implemented Concepts:

- Failure-path integration tests under `test/integration/` exercising eight rejection scenarios through the composed Kernel (`createKernelServices`) and public service contracts only: Task dependency violation, premature Mission completion, duplicate MissionPlan registration, duplicate Review registration, invalid Knowledge capture, missing Evidence, invalid Review completion, and terminal Mission planning.
- Side-effect verification for every scenario: no partial persistence, no unintended Domain Event publication, deterministic rejection, and continued success of subsequent valid operations.
- Remediation of `NEXUS-REV-2026-07-13-015-F-001` per `NEXUS-RAT-2026-07-13-009`: restored the Sprint 9 `ReviewService` orchestration-only baseline and replaced Scenario 4 with duplicate Review registration, an already-approved Review-domain rejection path.

Deferred Concepts:

- AI provider integrations, Adapter runtime implementations, VS Code host integration, Context Package, Policy Engine, Durable Event Streams, event subscriptions, persistent storage, production infrastructure, observability/telemetry, retry policies, distributed execution.
- Exhaustive combinatorial failure-path coverage beyond the eight authorized scenarios.

Notes:

- See `knowledge/implementation/sprints/sprint-0017-cross-domain-failure-path-integration-validation.md` for the complete Sprint Implementation Record.
- This sprint introduces no new normative concepts; it validates rejection behavior already authorized by implemented RFCs and approved vertical slices.

---

## Sprint 18 — RFC-0010 Kernel Boundary Certification

Status: Approved (NEXUS-REV-2026-07-13-018)

RFC Coverage:

- RFC-0010 — Kernel Boundaries (Primary)
- Referenced: RFC-0001, RFC-0002, RFC-0003, RFC-0004, RFC-0005, RFC-0006, RFC-0007, RFC-0008 (contract validation only), RFC-0009 (boundary validation only)

Ratification:

- None. Sprint 18's scope was approved directly by Sprint Owner decision during `/nexus-plan` (2026-07-13); no governance ambiguity required a Sprint Owner Ratification.

Implemented Concepts:

- Integration Validation Scenarios certifying successful composed-Kernel behavior (Mission, Mission Planning, Task execution, Review, Knowledge, Domain Event publication, repository coordination, dependency injection, Role assignment, Execution Strategy readiness, and composed service construction) through `createKernelServices` and public service contracts only.
- Boundary Violation Scenarios proving deterministic rejection of invalid cross-Mission Execution Strategy evaluation, missing Adapter dispatch targets, and mismatched Domain Event Mission attribution — with no aggregate/repository corruption, no partial persistence, and no unintended Domain Event publication.
- Static Kernel dependency validation proving Kernel source files do not import outside `src/kernel`, preserving Host/UI/infrastructure/adapter-implementation independence.
- Documentation reconciliation in Builder-owned implementation artifacts only.

Deferred Concepts:

- Event subscribers/consumers/handlers/orchestration
- Adapter implementations, Mock Adapter, AI provider integration
- VS Code host integration, workflow automation
- Context Package, Policy Engine, Durable Event Streams, persistent infrastructure
- Any new aggregate, repository, business rule, lifecycle transition, or Domain Event

Notes:

- See `knowledge/implementation/sprints/sprint-0018-rfc-0010-kernel-boundary-certification.md` for the complete Sprint Implementation Record.
- This is a validation-only vertical slice; it introduces no new normative concepts and validates only architecture already implemented by Sprint 1–17.
- Sprint 18 concludes the Internal Kernel Certification phase of Milestone 3. Subsequent implementation MAY transition to introducing new runtime capabilities (event consumers, adapter implementations, external integrations) while preserving the certified Kernel baseline.

---

# Milestone 4 — External Integration

Status: In Progress (Sprint 19 Approved; Sprint 20 Approved; Sprint 21 Approved; Sprint 22 Approved (NEXUS-REV-2026-07-13-022); Sprint 23 Approved with Findings (NEXUS-REV-2026-07-13-023, remediated NEXUS-REV-2026-07-13-024); Sprint 24 Approved (NEXUS-REV-2026-07-13-025); Sprint 25 Approved (NEXUS-REV-2026-07-13-026); Sprint 26 Approved (NEXUS-REV-2026-07-13-027); Sprint 27 Implemented — Pending Reviewer Validation)

## Sprint 19 — Mock Adapter Runtime Integration

Status: Approved (NEXUS-REV-2026-07-13-019)

RFC Coverage:

- RFC-0008 — Kernel Adapter Contract (Primary)
- Referenced: RFC-0004 — Execution Model, RFC-0010 — Kernel Boundaries

Ratification:

- `NEXUS-RAT-2026-07-13-010` — establishes `COPILOT_INSTRUCTIONS.md` as a planned, optional, future Provider Integration artifact, deferred until the repository's first production AI provider integration sprint.
- Sprint 19's scope, including the Milestone 3 → Milestone 4 transition, was otherwise approved directly by Sprint Owner decision during `/nexus-plan` (2026-07-13); no other governance ambiguity required a Sprint Owner Ratification.

Implemented Concepts:

- `MockAdapter` implementing the existing (Sprint 7) Adapter Contract; stateless; deterministic.
- Registration with the existing `AdapterRegistry`; discovery through the existing `AdapterService`.
- Static capability declaration using RFC-0008's existing capability vocabulary.
- Deterministic `AdapterRequest` validation/handling and immutable `AdapterResponse` generation using the existing contracts.
- Runtime dispatch through `AdapterService.dispatch` and `createKernelServices`.
- Deterministic diagnostics, reusing existing Sprint 7 diagnostics where applicable.

Deferred Concepts:

- Provider integrations (GitHub Copilot CLI, Claude CLI, Gemini CLI, Codex CLI, OpenAI APIs), process execution, authentication, retry/timeout policies, streaming responses, telemetry/metrics/observability.
- Adapter lifecycle management beyond the existing value object, dynamic capability negotiation, multi-adapter routing, prioritization, load balancing, fallback adapters.
- Event subscribers/consumers, Context Package production/consumption beyond the existing reference-only field, VS Code host integration.
- Any new aggregate, repository, business rule, lifecycle transition, or Domain Event outside the Adapter domain.

Notes:

- See `knowledge/implementation/sprints/sprint-0019-mock-adapter-runtime-integration.md` for the complete Sprint Implementation Record.
- The Sprint Owner's scope draft named `COPILOT_INSTRUCTIONS.md` as required Builder reading; per `NEXUS-RAT-2026-07-13-010`, that file is a planned, optional, future Provider Integration artifact deferred until the first production AI provider integration sprint, and is correctly omitted from Sprint 19's required reading.
- This sprint introduces the Kernel's first concrete Adapter implementation. It does not introduce any new bounded context — Adapter has been an approved bounded context since Sprint 7.
- `createKernelServices` accepts Adapter contract implementations at composition time so Kernel source remains independent of concrete Adapter implementations.

---

## Sprint 20 — Execution Pipeline Integration

Status: Approved (NEXUS-REV-2026-07-13-020)

RFC Coverage:

- RFC-0004 — Execution Model (Primary)
- Referenced: RFC-0008 — Kernel Adapter Contract, RFC-0010 — Kernel Boundaries

Ratification:

- `NEXUS-RAT-2026-07-13-011` — ratifies as binding that Sprint 20 authorizes Adapter dispatch only, never Adapter selection; no routing, prioritization, capability-scoring, or provider-preference policy is authorized.
- Sprint 20's remaining scope was otherwise approved directly by Sprint Owner decision during `/nexus-plan` (2026-07-13); no other governance ambiguity required a Sprint Owner Ratification.

Implemented Concepts:

- Integration test coverage exercising the full pipeline (Task → Execution Strategy readiness evaluation → Role Assignment → Adapter Registry lookup → explicit Mock Adapter dispatch → Adapter Response → Execution Result) through existing public service contracts composed via `createKernelServices`.
- Role resolution through the existing, unmodified `RoleService` and Sprint 8 Role Assignment model.
- Adapter dispatch through explicit `adapterId` only, preserving `NEXUS-RAT-2026-07-13-011`; no Adapter selection or routing policy was introduced.
- Deterministic diagnostics reusing existing error types for: no Adapter available, unsupported capability, missing Role Assignment, and deterministic Mock Adapter execution failure.
- No additive `ExecutionStrategyService` coordination method was required because public-service composition already expresses the authorized pipeline.

Critical Guardrail (Ratified: NEXUS-RAT-2026-07-13-011):

- Adapter Selection Policy (deferred since Sprint 7/8/10) SHALL NOT be resolved or approximated by a general routing/priority algorithm this sprint — dispatch SHALL use an explicit `adapterId` or a fails-closed single-match lookup only. This guardrail was elevated from planning guidance to binding repository law specifically because Sprint 17 previously introduced an unauthorized business rule under similar ambiguity (`NEXUS-REV-2026-07-13-015-F-001`).

Deferred Concepts:

- Production provider integrations, process execution, authentication, network communication, streaming, retry/timeout policies, telemetry/metrics/observability, VS Code Host integration, `COPILOT_INSTRUCTIONS.md` (per `NEXUS-RAT-2026-07-13-010`).
- Adapter Selection Policy / routing / prioritization; full RFC-0004 Execution State set; Execution Session; Review-gated execution progression.

Notes:

- See `knowledge/implementation/sprints/sprint-0020-execution-pipeline-integration.md` for the complete Sprint Implementation Record.
- This sprint introduces no new bounded context; it composes Sprint 8, Sprint 10, and Sprint 19's already-approved capabilities.
- `ExecutionStrategy` remains advisory/evaluative; `MissionExecutionService` remains the sole Task execution entry point, ungated by this sprint's work — mirroring the Sprint 10 Note this sprint does not reopen.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest 38 files / 220 tests, esbuild.

---

## Sprint 21 — Local Process Runtime Foundation

Status: Implemented — Pending Reviewer Validation

RFC Coverage:

- RFC-0008 — Kernel Adapter Contract (Partial)
- Referenced: RFC-0004 — Execution Model, RFC-0010 — Kernel Boundaries

Ratification:

- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md` remains deferred; this sprint is not the production-provider-integration sprint that ratification names as the activation trigger.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected by this sprint.

Implemented Concepts:

- `LocalProcessRuntime`, `ProcessRequest`, `ProcessResult`, `ProcessExecutionOptions`, `ProcessExitStatus`, and `ProcessDiagnostics` — provider-agnostic process launch, output capture, exit status, timeout, cancellation, and deterministic diagnostics, placed under `src/adapters/runtime/` outside `src/kernel` (Adapter-layer infrastructure, per RFC-0010 § Execution Responsibilities).
- `LocalProcessRuntimeContract` — Adapter-facing runtime abstraction; operating-system process management remains encapsulated inside the concrete runtime implementation.
- Deterministic diagnostics for executable-not-found, startup failure, timeout, cancellation, abnormal termination, non-zero exit code, and successful completion.
- Integration proof beneath the Adapter layer via a separate test-only Adapter in `test/integration/local-process-runtime.integration.test.ts`; `MockAdapter`'s Sprint 19-approved behavior remains unchanged.

Critical Boundary:

- `LocalProcessRuntime` is Adapter-layer infrastructure, not a Kernel capability. `src/kernel` SHALL NOT import it; Sprint 18's `src/kernel` import-graph boundary test SHALL continue to pass unmodified.

Critical Guardrail:

- `MockAdapter`'s Sprint 19-approved baseline ("never invoke external processes") is an Approved Vertical Slice and remains frozen; it SHALL NOT be modified by this sprint.

Deferred Concepts:

- All production provider integrations (GitHub Copilot CLI, Claude CLI, Codex CLI, Gemini CLI, OpenAI, Azure OpenAI), authentication, credential storage, provider discovery/negotiation.
- Process orchestration: parallel execution, process pools, retries, fallback execution, scheduling, prioritization.
- Adapter Selection Policy (unaffected, per `NEXUS-RAT-2026-07-13-011`).
- CLI/response interpretation; `COPILOT_INSTRUCTIONS.md`.

Notes:

- See `knowledge/implementation/sprints/sprint-0021-local-process-runtime-foundation.md` for the complete Sprint Implementation Record.
- This sprint splits "production provider Adapter integration" into two bounded steps: generic process execution now, a specific provider Adapter in a future sprint.
- This sprint introduces no new bounded context and does not modify RFC-0008, RFC-0004, RFC-0010, or the Kernel Canon.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest 41 files / 232 tests, esbuild.

---

## Sprint 22 — Adapter Runtime Operational Metadata

Status: Approved (NEXUS-REV-2026-07-13-022)

RFC Coverage:

- RFC-0008 — Kernel Adapter Contract (Primary, Partial)
- Referenced: RFC-0004 — Execution Model, RFC-0010 — Kernel Boundaries

Ratification:

- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md`'s activation point is pushed to when the first live provider executes inside the completed Nexus host; not created or consumed this sprint.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected.

Governance History:

- An earlier draft proposed a parallel "Provider" vocabulary (`ProviderMetadata`, `ProviderCapability`, `ProviderRegistry`), mis-cited "RFC-0008 — Provider Contract," and conflated `ProviderCapability` with Engineering Roles (`Builder`, `Reviewer`) in direct contradiction of RFC-0008. Flagged and rejected during `/nexus-plan`; the Sprint Owner reframed the sprint entirely in terms of the existing, RFC-0008-owned Adapter vocabulary. No RFC Amendment or ADR was required.

Implemented Concepts:

- `AdapterInstallationStatus`, `AdapterHealthStatus`, `AdapterRuntimeDiagnostics`, `AdapterConfiguration` (or equivalent), and executable/version discovery helpers — placed outside `src/kernel` (Adapter-layer implementation tooling, not RFC-0008 Contract vocabulary).
- One narrow, additive `AdapterCapability` value-list extension in `src/kernel/adapter/adapter-capability.ts` — the sole authorized Kernel change this sprint.

Critical Boundary:

- `AdapterCapability`'s value-list extension is the only authorized Kernel change; `Builder`/`Reviewer` SHALL NOT appear as capability values. Everything else lives outside `src/kernel`. No second runtime registry; `AdapterRegistry` remains sole registry. `AdapterLifecycle` and `AdapterMetadata`'s existing fields remain frozen.

Deferred Concepts:

- Any `Provider`-prefixed type or second runtime registry; live provider integration (GitHub Copilot CLI, Claude CLI, Gemini CLI, Codex CLI, OpenAI, Azure OpenAI); authentication; provider protocol translation; Adapter Selection Policy; Host/VS Code integration; `COPILOT_INSTRUCTIONS.md`.

Notes:

- See `knowledge/implementation/sprints/sprint-0022-adapter-runtime-operational-metadata.md` for the complete Sprint Implementation Record.
- This sprint introduces no new bounded context and does not modify RFC-0008, RFC-0004, RFC-0010, or the Kernel Canon beyond the single authorized additive `AdapterCapability` extension.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest 42 files / 236 tests, esbuild.

---

## Sprint 23 — Host Ingress Foundation

Status: Approved with Findings (NEXUS-REV-2026-07-13-023; remediated NEXUS-REV-2026-07-13-024)

RFC Coverage:

- RFC-0009 — Host Contract (Primary, Partial)
- Referenced: RFC-0008 — Kernel Adapter Contract, RFC-0004 — Execution Model, RFC-0010 — Kernel Boundaries

Ratification:

- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md` remains deferred until the first live provider is integrated and exercised from within the completed Host runtime; not this sprint.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected; Host dispatch SHALL use explicit `adapterId` or a fails-closed single-match lookup only.

Implemented Concepts:

- Host command registration, Host ingress routing, Host capability declaration (RFC-0009 § Host Capabilities).
- Adapter discovery through `AdapterService.enumerateAdapters` and deterministic dispatch through `AdapterService.dispatch`, exercised against the certified `MockAdapter` only.
- Presentation of Sprint 22's Adapter operational metadata via VS Code Output Channel / notifications.
- Host diagnostics for ingress-layer failures.
- VS Code command contributions for Adapter discovery, Adapter dispatch, and Host capability display.
- Unit and integration coverage for command registration, Host ingress routing, provider-independent presentation, fails-closed dispatch, and the Host → Kernel → AdapterService → MockAdapter path.

Critical Boundary:

- The Host SHALL invoke only public Kernel service contracts — no direct aggregate, repository, `AdapterRegistry`, `LocalProcessRuntime`, or Adapter access. Adapter dispatch SHALL use explicit `adapterId` or a fails-closed single-match lookup only; no Adapter Selection Policy is authorized.

Deferred Concepts:

- Live AI provider integration (GitHub Copilot CLI, Claude CLI, Gemini CLI, Codex CLI, OpenAI, Azure OpenAI), authentication, provider protocol translation.
- Adapter Selection Policy / routing / capability scoring / provider preference / fallback / load balancing.
- Mission UI, Review UI, Knowledge UI, workflow visualization.
- The broader Host Ingress Contract (`submitMission`, `publishHostObservation`, `submitApproval`, `queryWorkflowStatus`).
- `COPILOT_INSTRUCTIONS.md`.

Notes:

- See `knowledge/implementation/sprints/sprint-0023-host-ingress-foundation.md` for the complete Sprint Implementation Record.
- This sprint introduces no new bounded context and does not modify RFC-0008, RFC-0004, RFC-0010, or the Kernel Canon.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest 45 files / 242 tests, esbuild.

---

## Sprint 24 — Host Runtime Completion

Status: Approved (NEXUS-REV-2026-07-13-025)

RFC Coverage:

- RFC-0009 — Host Contract (Primary, Partial)
- Referenced: RFC-0008 — Kernel Adapter Contract, RFC-0004 — Execution Model, RFC-0010 — Kernel Boundaries

Ratification:

- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md` remains deferred; this sprint is provider-independent.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected; interactive input MAY collect an explicit `adapterId`/`requiredCapability` but introduces no automatic selection logic.

Implemented Concepts:

- Interactive request input (`HostInputSurface`) for `nexus.dispatchAdapterRequest` when invoked without a pre-built argument; the existing Sprint 23 programmatic path is unchanged.
- Structured response presentation surfacing `producedArtifacts`, `findings`, and `executionMetadata` alongside existing `status`/`diagnostics`, plus a deterministic dispatch progress indicator.
- Workspace Trust enforcement (`HostWorkspaceTrustSurface`) gating dispatch only; discovery/capability commands remain ungated.
- Exercised against the certified `MockAdapter` only.
- Deterministic cancellation diagnostics for interactive input cancellation before dispatch.
- Unit and integration coverage for interactive input, cancellation, programmatic dispatch preservation, full response presentation, progress, trust gating, and the Host → Kernel → AdapterService → MockAdapter path.

Critical Boundary:

- These three capabilities are a single architectural concern (Host runtime completion), not independent features. They SHALL NOT introduce provider protocol logic, Adapter behavior changes, authentication, provider selection, or live provider execution. No `src/kernel`, `src/adapters/mock/`, or `src/adapters/runtime/` file may change.

Deferred Concepts:

- Live AI provider integration, authentication, provider protocol translation.
- Adapter Selection Policy / routing / capability scoring / provider preference / fallback / load balancing.
- Persisted VS Code Configuration surface for Adapter settings.
- Mission UI, Review UI, Knowledge UI, workflow visualization; the broader Host Ingress Contract; `COPILOT_INSTRUCTIONS.md`.

Notes:

- See `knowledge/implementation/sprints/sprint-0024-host-runtime-completion.md` for the complete Sprint Implementation Record.
- This sprint introduces no new bounded context and does not modify RFC-0008, RFC-0004, RFC-0010, or the Kernel Canon.
- Identified by repository-state assessment during `/nexus-plan`: all three gaps were found in the already-approved Sprint 23 code via direct grep evidence, not speculative future-proofing.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest 45 files / 246 tests, esbuild.

---

## Sprint 25 — Developer Workflow Foundation

Status: Approved (NEXUS-REV-2026-07-13-026)

RFC Coverage:

- RFC-0009 — Host Contract (Primary, Partial)
- Referenced: RFC-0001 — Mission Model, RFC-0004 — Execution Model, RFC-0010 — Kernel Boundaries

Ratification:

- None required. Two scope clarifications (Host thin-orchestration boundary; non-durable session-only Mission history) were resolved during `/nexus-plan` by direct application of the already-reviewed Sprint 23/24 Adapter-domain precedent.

Implemented Concepts:

- A single new Host command sequencing exactly eleven existing public Kernel operations, in the fixed order proven legal by Sprint 16's integration test: `createMission` → `createMissionPlan` → `planMission` → `addTask` → `updateTask`(Ready) → `markMissionReady` → `startMission`(execution) → `startTask` → `completeTask` → `reviewMission`(Mission-lifecycle transition) → `completeMission`(execution).
- Interactive input and deterministic progress/result presentation, reusing Sprint 24's `HostInputSurface`/`HostPresentationSurface` abstractions.
- Workspace Trust enforcement before the first Kernel call, reusing Sprint 24's pattern.
- A session-only (in-memory, non-durable) list of `{missionId, objective, finalStatus}`.
- VS Code command contributions for running the developer Mission workflow and showing the in-memory Mission workflow history.
- Unit and integration coverage for success, cancellation, Kernel rejection, Workspace Trust gating, minimal history shape, and real `createKernelServices` composition.

Critical Boundary:

- The Host owns no Mission business logic; it only sequentially invokes existing `MissionService`/`MissionPlanningService`/`MissionExecutionService` public operations. Session history SHALL NOT use `vscode.Memento`/`globalState`/`workspaceState` or duplicate Mission aggregate state.

Deferred Concepts:

- Multiple Tasks per Mission, Task dependencies/graphs; Evidence, Shared Reality, Review (domain), Knowledge capture; persistent/cross-session Mission history; live AI providers, Adapter dispatch, Adapter Selection Policy; workflow automation, background execution, retry policies.

Notes:

- See `knowledge/implementation/sprints/sprint-0025-developer-workflow-foundation.md` for the complete Sprint Implementation Record.
- This sprint introduces no new bounded context and does not modify RFC-0001, RFC-0004, RFC-0009, RFC-0010, or the Kernel Canon.
- Opens a second, parallel Host entry point (Mission domain) alongside Sprint 23/24's Adapter-domain entry point; orthogonal to existing Adapter-domain behavior.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest 48 files / 253 tests, esbuild.

---

## Sprint 26 — Developer Workflow Adapter Integration

Status: Approved (NEXUS-REV-2026-07-13-027)

RFC Coverage:

- RFC-0004 — Execution Model (Primary)
- Referenced: RFC-0008 — Kernel Adapter Contract, RFC-0009 — Host Contract, RFC-0010 — Kernel Boundaries

Ratification:

- `NEXUS-RAT-2026-07-13-013` — governs this sprint's entire scope: title, authorized execution sequence, Host/Kernel/Adapter Runtime responsibility split, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected.
- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md` remains deferred.

Implemented Concepts:

- Extension of `HostMissionWorkflow` (Sprint 25) inserting `ExecutionStrategyService.createExecutionStrategy`, `RoleService.assignRole`, `ExecutionStrategyService.evaluateAssignmentReadiness`, `RoleService.retrieveRole`, and `AdapterService.dispatch` between `startTask` and `completeTask`, reusing Sprint 20's certified pipeline without introducing a duplicate execution path.
- Explicit `mock-adapter` dispatch with required `CodeModification` capability supplied by Host composition; no Adapter Selection Policy, routing, scoring, fallback, or provider preference was introduced.
- `MockAdapter` registration at the VS Code Host composition root shared with Sprint 23/24.
- Session-only history extended with Adapter ID and dispatch status, preserving Sprint 25's non-durable, minimal-field constraint.
- Deterministic non-`Completed` Adapter response handling that presents Adapter diagnostics, records true last-known Mission status, and does not fabricate a Task failure or call `completeTask`.

Critical Boundary:

- Host assigns no role, selects no adapter, and determines no execution outcome itself — those decisions flow through `RoleService`/`ExecutionStrategyService`/`AdapterService`/`MockAdapter` only. On non-`Completed` Adapter response, the workflow stops deterministically without calling `completeTask` and without fabricating any Task-failure state.

Deferred Concepts:

- Live AI provider integration; Adapter Selection Policy / routing / capability scoring / provider preference / fallback / load balancing / multi-adapter execution; background execution, workflow automation, retry policies, streaming, cancellation, progress callbacks beyond existing markers; persistent execution history, Knowledge, Shared Reality visualization, Mission browser, dashboards; `COPILOT_INSTRUCTIONS.md`.

Notes:

- See `knowledge/implementation/sprints/sprint-0026-developer-workflow-adapter-integration.md` for the complete Sprint Implementation Record.
- This sprint introduces no new bounded context and does not modify RFC-0004, RFC-0008, RFC-0009, RFC-0010, or the Kernel Canon.
- Converges the Adapter-domain (Sprint 23/24) and Mission-domain (Sprint 25) Host entry points into one working, provider-independent developer workflow.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest 48 files / 254 tests, esbuild.

---

## Sprint 27 — Developer Workflow Completion

Status: Approved (NEXUS-REV-2026-07-13-028)

RFC Coverage:

- RFC-0009 — Host Contract (Primary)
- Referenced: RFC-0002 — Evidence Model, RFC-0006 — Engineering Assessment Model, RFC-0007 — Knowledge Model, RFC-0010 — Kernel Boundaries

Ratification:

- `NEXUS-RAT-2026-07-13-014` — governs this sprint's entire scope: title ("Developer Workflow Completion," refining `nexus-plan`'s proposed "Host Review & Knowledge Workflow Integration"), authorized completion workflow, Host/Kernel responsibility split, the binding Knowledge-eligibility implementation clarification (`captureKnowledge()` called unconditionally; eligibility enforced solely by the Kernel's existing `KnowledgeCapturePreconditionError`), authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-13-013` — governs the Sprint 26 pipeline this sprint extends; unaffected and unmodified.
- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md` remains deferred.

Implemented Concepts:

- Extension of `HostMissionWorkflow` (Sprint 25/26) inserting `EvidenceService.registerEvidence`, `ReviewService.startReview`, `ReviewService.publishFinding`, `ReviewService.finalizeReviewOutcome`, and `KnowledgeService.captureKnowledge` immediately after the existing `completeMission()` call.
- Deterministic, fixed Host-supplied command inputs (identities, Review outcome value, Evidence/Finding/Knowledge content) mirroring Sprint 25/26's deterministic identity and default-Role/explicit-Adapter pattern.
- `EvidenceService`/`ReviewService`/`KnowledgeService` wired into the VS Code Host composition root via the existing `resolveService` pattern.
- Session-only history extended with Review outcome and Knowledge capture status.

Deferred Concepts:

- Live AI Providers, production Adapter integration, Adapter Selection, provider routing; human review intervention, review retry workflows; streaming execution, background workflow execution, workflow automation, multi-provider coordination; persistent/durable workflow/execution/review/knowledge history; Policy Engine integration, Evidence indexing, Knowledge conflict resolution; `COPILOT_INSTRUCTIONS.md`.

Critical Boundary:

- Host makes no Evidence-validity, Review-outcome-interpretation, or Knowledge-eligibility decision itself — those decisions flow through `EvidenceService`/`ReviewService`/`KnowledgeService` only. `captureKnowledge()` is invoked unconditionally; a `KnowledgeCapturePreconditionError` (or any other Kernel rejection) is handled through the existing Sprint 25/26 Kernel-rejection stop pattern, not a Host-side eligibility branch.

Notes:

- See `knowledge/implementation/sprints/sprint-0027-developer-workflow-completion.md` for the complete Sprint Implementation Record.
- This sprint introduces no new bounded context and does not modify RFC-0002, RFC-0006, RFC-0007, RFC-0009, RFC-0010, or the Kernel Canon.
- Completes the provider-independent Developer Workflow; upon approval, the repository is ready to begin Milestone 5 — Production Adapter Integration.

---

# Milestone 5 — Production Adapter Integration

Status: ✅ COMPLETE (Sprint 28 Approved with Findings; Sprint 29 Approved — NEXUS-REV-2026-07-14-002; Sprint 30 Approved — NEXUS-REV-2026-07-14-003)

## Sprint 28 — VS Code Extension Installability

Status: Approved with Findings (NEXUS-REV-2026-07-14-001)

RFC Coverage:

- No Primary RFC — packaging/tooling and validation-only slice.
- Referenced: RFC-0009 — Host Contract, RFC-0010 — Kernel Boundaries.

Ratification:

- `NEXUS-RAT-2026-07-14-001` — governs this sprint's entire scope: retitling/confirmation, refined Authorized Vertical Slice, the binding Extension Host Validation Boundary, the binding Packaging Scope, authorized Builder scope, and scope restrictions. Resequences Milestone 5 to begin with productization/host-validation rather than a production Adapter; provider selection, authentication model, and `COPILOT_INSTRUCTIONS.md` activation remain explicitly unresolved and deferred.
- `NEXUS-RAT-2026-07-13-013` / `NEXUS-RAT-2026-07-13-014` — govern the certified Developer Workflow this sprint validates inside a real host; unaffected and unmodified.
- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md` remains deferred.

Implemented Concepts:

- Completion of `package.json` packaging metadata (`activationEvents`, `icon`, `repository`, `license`, `engines`).
- `.vscodeignore`, `@vscode/vsce` dev dependency, and a local `package` script producing a `.vsix`.
- `.vscode/launch.json` for manual Extension Development Host verification.
- `@vscode/test-electron` dev dependency and a new automated extension-host integration test verifying activation, all six command registrations, and an end-to-end `nexus.runDeveloperMissionWorkflow` execution against the certified `MockAdapter`.
- Local VSIX installation validation through the VS Code CLI before automated Extension Host execution.

Deferred Concepts:

- GitHub Copilot CLI / Claude CLI / Gemini CLI / Codex CLI Adapters; production Adapter integration; Adapter Selection; provider routing; authentication/credential management; OAuth; `SecretStorage` integration; streaming responses; multi-provider coordination; Visual Studio Marketplace publishing; release automation; `COPILOT_INSTRUCTIONS.md`.

Critical Boundary:

- Host remains responsible only for extension lifecycle, activation, command registration, dependency injection, workflow orchestration, presentation, and user interaction; it SHALL NOT implement business rules, bypass Kernel services, or access aggregates/repositories/adapters directly. Extension-host tests SHALL exercise only existing public Host entry points and SHALL NOT replace or duplicate Kernel integration test ownership, which remains with the existing Vitest suite.

Notes:

- See `knowledge/implementation/sprints/sprint-0028-vs-code-extension-installability.md` for the complete Sprint Implementation Record.
- This sprint introduces no new bounded context and does not modify RFC-0009, RFC-0010, or the Kernel Canon.
- Validates, but does not extend, the architecture certified through Sprint 27.

---

## Sprint 29 — Gemini CLI Adapter Runtime Integration

Status: Approved (NEXUS-REV-2026-07-14-002)

RFC Coverage:

- RFC-0008 — Kernel Adapter Contract (Primary, Partial — first production implementation)
- Referenced: RFC-0004 — Execution Model, RFC-0010 — Kernel Boundaries

Ratification:

- `NEXUS-RAT-2026-07-14-003` — governs this sprint's entire scope: refined objective, Architectural Intent (`MockAdapter` → `MockAdapter` + `GeminiCliAdapter`), Authorized Vertical Slice, the binding two-tier Acceptance Criteria (Automated Repository Validation + Manual Production Verification), authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-002` — governs provider selection (Gemini CLI), authentication model (pre-authenticated local CLI session; Nexus never handles credentials), and `ADAPTER_RUNTIME_INSTRUCTIONS.md` canonical naming (superseding `NEXUS-RAT-2026-07-13-010`'s illustrative `COPILOT_INSTRUCTIONS.md` name).
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected.

Implemented Concepts:

- `GeminiCliAdapter implements Adapter` under `src/adapters/gemini/`, constructor-injected with `LocalProcessRuntimeContract`, mirroring `MockAdapter`'s placement outside `src/kernel`.
- Deterministic diagnostics for executable-not-found, non-zero exit, malformed output, timeout, runtime error.
- Composition-time registration through the existing `createKernelServices` `adapters` option; exercised only via direct `AdapterService.dispatch` in tests, never wired into `HostMissionWorkflow`.
- `ADAPTER_RUNTIME_INSTRUCTIONS.md` — provider-neutral runtime execution guidance, not governance.
- A deterministic local test-double executable suite (Automated Repository Validation) and a documented, non-automated Manual Production Verification procedure against a real, locally authenticated Gemini CLI.

Deferred Concepts:

- Developer Workflow integration; replacing `MockAdapter` in `HostMissionWorkflow`; GitHub Copilot CLI / Claude CLI / Codex CLI Adapters; Adapter Selection / provider routing; authentication/credential management, OAuth, `SecretStorage`; streaming responses; multi-provider coordination.

Critical Boundary:

- This sprint introduces exactly one architectural variable — `GeminiCliAdapter` registered alongside `MockAdapter` — while every other component remains unchanged. No `src/kernel`, Host orchestration, or Developer Workflow file may be modified. Manual Production Verification is documentation only and SHALL NOT be added to `npm run validate` or any CI-gating script.

Notes:

- See `knowledge/implementation/sprints/sprint-0029-gemini-cli-adapter-runtime-integration.md` for the complete Sprint Implementation Record.
- This sprint introduces no new bounded context and does not modify RFC-0004, RFC-0008, RFC-0010, or the Kernel Canon.
- Only after this sprint's independent certification SHALL a future Sprint authorize Developer Workflow integration of `GeminiCliAdapter`.

---

## Sprint 30 — Developer Workflow Integration of GeminiCliAdapter

Status: Approved (NEXUS-REV-2026-07-14-003)

RFC Coverage:

- RFC-0009 — Host Contract (Primary, Partial)
- Referenced: RFC-0004 — Execution Model, RFC-0008 — Kernel Adapter Contract, RFC-0010 — Kernel Boundaries

Ratification:

- `NEXUS-RAT-2026-07-14-004` — governs this sprint's entire scope: the binding decision to introduce a second Developer Workflow command (rather than a persisted Adapter-configuration surface), Architectural Responsibilities, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-003` — established that Developer Workflow integration of `GeminiCliAdapter` is authorized only after Sprint 29's independent certification; satisfied by `NEXUS-REV-2026-07-14-002`.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected; the new command dispatches via explicit `adapterId` only.

Implemented Concepts:

- A new Host command sequencing the identical, already-certified Sprint 25/26/27 workflow steps (Mission → MissionPlan → Task → Execution → Evidence → Review → Knowledge), with the Adapter dispatch step's explicit `adapterId` set to `GEMINI_CLI_ADAPTER_ID` instead of `MOCK_ADAPTER_ID`.
- `GeminiCliAdapter` registration at the `extension.ts` composition root alongside the existing, unmodified `MockAdapter` registration.
- New command contribution point (`package.json` `contributes.commands` / `activationEvents`) mirroring the existing command's registration pattern.
- Unit/integration test coverage for the new command using the existing deterministic Gemini CLI test-double (Sprint 29) exclusively.

Deferred Concepts:

- Persisted adapter preferences, Workspace/User adapter settings, or any Adapter-selection configuration subsystem.
- Adapter Selection Policy, automatic provider routing, capability scoring, fallback, multi-adapter coordination.
- Authentication management, credential storage, OAuth, `SecretStorage` integration.
- GitHub Copilot CLI Adapter, Claude CLI Adapter, Codex CLI Adapter, or any second production Adapter.
- Streaming responses, multi-provider coordination, background execution.

Critical Boundary:

- The existing `nexus.runDeveloperMissionWorkflow` command, its `HostMissionWorkflow` construction, and every Sprint 25–28 test asserting its behavior SHALL NOT be modified. The new command SHALL dispatch via explicit `adapterId` only — no Adapter Selection, routing, or persisted configuration. No `src/kernel` file may be modified.

Notes:

- See `knowledge/implementation/sprints/sprint-0030-developer-workflow-gemini-cli-integration.md` for the complete Sprint Implementation Record.
- This sprint introduces no new bounded context and does not modify RFC-0004, RFC-0008, RFC-0009, RFC-0010, or the Kernel Canon.

---

# Milestone 6 — Multi-Provider Adapter Integration

Status: ✅ COMPLETE (Sprint 31 Approved — NEXUS-REV-2026-07-14-004; Sprint 32 Approved with Findings — NEXUS-REV-2026-07-14-005; Sprint 33 Approved with Findings — NEXUS-REV-2026-07-14-008, remediation verified NEXUS-REV-2026-07-14-009; Sprint 34 Approved — NEXUS-REV-2026-07-14-010; Milestone closed at Sprint 34 by NEXUS-RAT-2026-07-14-011)

Governance Note: Per `NEXUS-RAT-2026-07-14-011`, Milestone 6 is declared Complete as of Sprint 34. Sprint 35 — Builder Workflow Foundation is retroactively classified as the opening Sprint of Milestone 7 — AI Engineering Workflows, below.

## Sprint 31 — Codex CLI Adapter Runtime Integration

Status: Approved (NEXUS-REV-2026-07-14-004)

RFC Coverage:

- RFC-0008 — Kernel Adapter Contract (Primary, Partial — second production implementation)
- Referenced: RFC-0004 — Execution Model, RFC-0010 — Kernel Boundaries

Ratification:

- `NEXUS-RAT-2026-07-14-005` — governs this sprint's entire scope: Milestone 6 direction, provider selection (Codex CLI), authentication model (pre-authenticated local CLI session, inherited from `NEXUS-RAT-2026-07-14-002`), the binding Isolation Boundary and Two-Tier Acceptance Criteria, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-002` — the Gemini CLI provider-selection/authentication-model precedent this ratification mirrors for Codex CLI.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected.

Planned Concepts:

- `CodexCliAdapter implements Adapter` under `src/adapters/codex/`, constructor-injected with `LocalProcessRuntimeContract`, mirroring `GeminiCliAdapter`'s and `MockAdapter`'s existing placement outside `src/kernel`.
- Deterministic diagnostics for executable-not-found, non-zero exit, malformed/unparseable output, timeout, and runtime error, reusing `ProcessDiagnostics` where applicable.
- Composition-time registration of `CodexCliAdapter` through the existing `createKernelServices` `adapters` option, exercised in tests only via direct `AdapterService.dispatch` calls — never wired into `HostMissionWorkflow` or any Host command.
- `ADAPTER_RUNTIME_INSTRUCTIONS.md` reconciliation extending its existing provider-neutral guidance to a second CLI-backed provider.
- A deterministic local test-double executable suite (Automated Repository Validation) and a documented, non-automated Manual Production Verification procedure against a real, locally authenticated Codex CLI.

Deferred Concepts:

- Developer Workflow integration; any new Host command targeting `CodexCliAdapter`; any Host orchestration change.
- Persisted Adapter-selection configuration surface (remains deferred from Sprint 24/30, unaffected by this Sprint).
- GitHub Copilot CLI Adapter; Claude CLI Adapter; any third production Adapter.
- Adapter Selection Policy, provider routing, provider preference, fallback, multi-adapter execution.
- Authentication management, credential storage, OAuth, `SecretStorage` integration.
- Streaming responses, multi-provider coordination, background execution.

Critical Boundary:

- This sprint introduces exactly one architectural variable — `CodexCliAdapter` registered alongside `MockAdapter` and `GeminiCliAdapter` — while every other component remains unchanged. No `src/kernel`, Host orchestration, or Developer Workflow file may be modified. Manual Production Verification is documentation only and SHALL NOT be added to `npm run validate` or any CI-gating script.

Notes:

- See `knowledge/implementation/sprints/sprint-0031-codex-cli-adapter-runtime-integration.md` for the complete Sprint Implementation Record.
- This sprint introduces no new bounded context and does not modify RFC-0004, RFC-0008, RFC-0010, or the Kernel Canon.
- Only after this sprint's independent certification SHALL a future Sprint authorize Developer Workflow integration of `CodexCliAdapter`.

---

## Sprint 32 — Production Workflow Parity

Status: Implemented — Pending Reviewer Validation.

RFC Coverage:

- RFC-0009 — Host Contract (Primary, Partial)
- Referenced: RFC-0004 — Execution Model, RFC-0008 — Kernel Adapter Contract, RFC-0010 — Kernel Boundaries

Ratification:

- `NEXUS-RAT-2026-07-14-006` — governs this sprint's entire scope: title, authorized command addition, Host/Kernel responsibility split, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-005` — named the three candidate directions for Milestone 6 following Sprint 31; `NEXUS-RAT-2026-07-14-006` selects Developer Workflow integration.
- `NEXUS-RAT-2026-07-14-004` — the Sprint 30 scope ratification this sprint mirrors provider-for-provider.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected; the new command dispatches via explicit `adapterId` only.

Implemented Concepts:

- A new Host command (e.g. `nexus.runDeveloperMissionWorkflowWithCodexCli`) sequencing the identical, already-certified workflow steps (Sprint 25/26/27's Mission → MissionPlan → Task → Execution → Evidence → Review → Knowledge sequence), with the Adapter dispatch step's explicit `adapterId` set to the `CodexCliAdapter` identifier instead of `MOCK_ADAPTER_ID`/`GEMINI_CLI_ADAPTER_ID`.
- Registration of `CodexCliAdapter` at the `extension.ts` composition root alongside the existing, unmodified `MockAdapter` and `GeminiCliAdapter` registrations.
- New command contribution point (`package.json` `contributes.commands` / `activationEvents`) mirroring the existing commands' registration pattern.
- Unit/integration test coverage for the new command's success and failure paths, using the existing deterministic Codex CLI test-double (Sprint 31) exclusively.

Deferred Concepts:

- Persisted adapter preferences, Workspace/User adapter settings, or any configuration subsystem for Adapter selection.
- Adapter Selection Policy, automatic provider routing, capability scoring, fallback, or multi-adapter coordination.
- Execution Model deepening (full RFC-0004 Execution State set, Execution Session, Review-gated execution progression).
- Authentication management, credential storage, OAuth, `SecretStorage` integration.
- GitHub Copilot CLI Adapter, Claude CLI Adapter, or any fourth production Adapter.
- Streaming responses, multi-provider coordination, background execution.

Critical Boundary:

- This sprint introduces exactly one architectural variable — a third Developer Workflow command targeting `CodexCliAdapter` — while every other component remains unchanged. No `src/kernel` file may be modified; the existing `nexus.runDeveloperMissionWorkflow` and `nexus.runDeveloperMissionWorkflowWithGeminiCli` commands and their test coverage remain frozen.

Notes:

- See `knowledge/implementation/sprints/sprint-0032-production-workflow-parity.md` for the complete Sprint Implementation Record.
- This sprint introduces no new bounded context and does not modify RFC-0004, RFC-0008, RFC-0009, RFC-0010, or the Kernel Canon.
- Upon completion, every certified production Adapter (`MockAdapter`, `GeminiCliAdapter`, `CodexCliAdapter`) SHALL have a corresponding, independently dispatched Developer Workflow command.

---

## Sprint 33 — Adapter Configuration Foundation

Status: Implemented — Pending Reviewer Validation

RFC Coverage:

- RFC-0009 — Host Contract (Primary, Partial)
- Referenced: RFC-0008 — Kernel Adapter Contract, RFC-0010 — Kernel Boundaries

Ratification:

- `NEXUS-RAT-2026-07-14-007` — governs this sprint's entire scope: title, authorized configuration surface, Host/Kernel responsibility split, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-005` — named the three candidate directions for Milestone 6 following Sprint 31; `NEXUS-RAT-2026-07-14-007` selects the persisted Adapter-selection configuration surface.
- `NEXUS-RAT-2026-07-13-011` — dispatch remains explicit-`adapterId`-only; a configuration-resolved default is not Adapter Selection Policy.

Implemented Concepts:

- VS Code User/Workspace configuration (`package.json` `contributes.configuration`) declaring a default Developer Workflow adapter identifier setting.
- Host-local resolution of this configuration value into an explicit `adapterId`, consumed only by the Host before invoking the existing, unmodified execution pipeline.
- Continued availability and backward compatibility of the three existing explicit Developer Workflow commands, which SHALL continue to dispatch via their own hardcoded `adapterId` exactly as certified in Sprints 25, 30, and 32.
- Unit/integration test coverage for configuration resolution (default present, default absent, default naming an unregistered/unknown adapter identifier), using only deterministic test-doubles.

Deferred Concepts:

- Adapter Selection Policy, automatic provider routing, capability scoring, fallback, or multi-adapter coordination.
- Role-based adapter assignment; multi-provider coordination.
- Execution Model deepening (full RFC-0004 Execution State set, Execution Session, Review-gated execution progression).
- Authentication management, credential storage, OAuth, `SecretStorage` integration.
- A fourth production Adapter (GitHub Copilot CLI, Claude CLI).
- Streaming responses, background execution.

Critical Boundary:

- This sprint introduces exactly one architectural variable — Host-local resolution of a configured default `adapterId` — while every other component remains unchanged. No `src/kernel` file may be modified; the three existing Developer Workflow commands and their test coverage remain frozen.

Notes:

- See `knowledge/implementation/sprints/sprint-0033-adapter-configuration-foundation.md` for the complete Sprint Implementation Record.
- This sprint introduces no new bounded context and does not modify RFC-0004, RFC-0008, RFC-0009, RFC-0010, or the Kernel Canon.
- Sprint 33's disposition is Approved with Findings (`NEXUS-REV-2026-07-14-008`); its sole finding was remediated and independently verified PASS by `NEXUS-REV-2026-07-14-009`.

---

## Sprint 34 — Developer Workflow UX Consolidation

Status: Approved (NEXUS-REV-2026-07-14-010)

RFC Coverage:

- No Primary RFC — documentation/presentation-only slice.
- Referenced: RFC-0009 — Host Contract.

Ratification:

- `NEXUS-RAT-2026-07-14-009` — governs this Sprint's entire scope: title, authorized presentation/documentation surface, the binding decision that command consolidation (removal/deprecation) is deferred, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-007` — governs the Sprint 33 architecture this Sprint promotes; unmodified.

Implemented Concepts:

- `package.json` `contributes.commands` title/category/shortTitle updates presenting `nexus.runDeveloperMissionWorkflowWithConfiguredAdapter` as the primary Developer Workflow entry point.
- README/user-facing documentation updates describing the configured-adapter command and its configuration setting as the recommended default, with the three provider-specific commands described as compatibility alternatives.
- Command metadata clarifications supported by the existing VS Code contribution model.
- Test coverage for `package.json` command metadata only.

Deferred Concepts:

- Removal, deprecation, renaming, or aliasing of any existing command identifier.
- Any change to Host Adapter Configuration resolution or dispatch logic.
- Adapter Selection Policy, routing, capability scoring, a fourth production Adapter, Execution Model deepening, authentication/credential management.
- Any `src/kernel` or `src/adapters` change.

Critical Boundary:

- This sprint introduces no new runtime or architectural capability — presentation/documentation only. No `src/kernel`, `src/adapters`, or dispatch-logic file may be modified; all four existing Developer Workflow commands and their test coverage remain frozen.

Notes:

- See `knowledge/implementation/sprints/sprint-0034-developer-workflow-ux-consolidation.md` for the complete Sprint Implementation Record.
- This sprint introduces no new bounded context and does not modify any RFC or the Kernel Canon.
- Re-scopes the originally candidate "Unified Developer Workflow" objective, which `/nexus-plan` governance analysis found already satisfied architecturally by Sprint 33; true command consolidation remains deferred per `NEXUS-RAT-2026-07-14-009`.
- Sprint 34's disposition is Approved with zero findings (`NEXUS-REV-2026-07-14-010`).

---

# Milestone 7 — AI Engineering Workflow Framework

Status: ✅ COMPLETE (Sprint 35 Approved — NEXUS-REV-2026-07-14-011; Sprint 36 Approved — NEXUS-REV-2026-07-14-012; Sprint 37 Approved with Findings — NEXUS-REV-2026-07-14-013; Sprint 38 Approved with Findings — NEXUS-REV-2026-07-14-015)

Retitled from "AI Engineering Workflows" to "AI Engineering Workflow Framework" per Sprint Owner direction (2026-07-14): Sprints 35–37 certified the canonical Role-scoped Host Workflow pattern and Sprint 38 completed the reusable framework's metadata foundation (Engineering Role Profiles). Per `NEXUS-RAT-2026-07-14-016`, Milestone 7's remaining objectives are limited to those explicitly authorized through ratified governance; no additional architectural capability, including Workflow Chaining, is authorized within this milestone. Sprint 38 is Milestone 7's final authorized Sprint, and Milestone 7 is therefore Complete.

Opened by `NEXUS-RAT-2026-07-14-011`, which closed Milestone 6 at Sprint 34 and retroactively classified Sprint 35 — Builder Workflow Foundation as this milestone's opening Sprint. No Milestone 7 Sprint SHALL introduce Kernel ownership changes, Adapter Contract changes, Adapter Selection, Role-to-Adapter routing, Execution Session, Assignment Policy, Workflow Chaining, or multi-agent orchestration, unless separately authorized through a future RFC or Sprint Owner ratification. Workflow Chaining, Assignment Policy, and Execution Sessions remain deferred to Milestone 8 per `NEXUS-RAT-2026-07-14-011`, reaffirmed by `NEXUS-RAT-2026-07-14-016`.

`NEXUS-RAT-2026-07-14-012` establishes a binding Architectural Invariant for this milestone: every Role-scoped Workflow entry point SHALL differ from every other only by the Execution Role requested and by workflow presentation metadata, reusing Host Adapter Configuration, explicit-`adapterId` dispatch, the certified Execution Pipeline, Adapter Runtime, and Kernel contracts unmodified in every case.

`NEXUS-RAT-2026-07-14-013` authorizes Sprint 37 — Documentation Workflow Foundation: registration of the RFC-0004-named `Documentation Reviewer` Additional Role as default Kernel Role `documentation-reviewer` — Milestone 7's first authorized `src/kernel` change (Role registration only) — and exposure of its Host workflow via the Sprint 36 canonical factory. A Planner Workflow is not scheduled — "Planner" is not an RFC-0004 Execution Role.

`NEXUS-RAT-2026-07-14-014` amends RFC-0004 to Version 1.1, introducing `Engineering Role Profile` as a new RFC-0004-owned architectural concept. `NEXUS-RAT-2026-07-14-015` authorizes Sprint 38 — Engineering Role Profiles Foundation to implement it as Kernel-owned metadata, non-authoritative for execution semantics.

## Sprint 35 — Builder Workflow Foundation

Status: Approved (NEXUS-REV-2026-07-14-011)

RFC Coverage:

- No Primary RFC — Host-layer additive command, reusing existing certified contracts.
- Referenced: RFC-0004 — Execution Model (`builder` Execution Role, already registered by Sprint 8), RFC-0009 — Host Contract, RFC-0010 — Kernel Boundaries.

Ratification:

- `NEXUS-RAT-2026-07-14-010` — governs this Sprint's entire scope: title, authorized command addition, Host/Kernel responsibility split, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-005` — named the original three Milestone 6 candidate directions; `NEXUS-RAT-2026-07-14-010` selects a fourth direction instead for Sprint 35.

Implemented Concepts:

- A new, additive Host command (e.g. `nexus.runBuilderMissionWorkflow`) constructing the existing `HostMissionWorkflow`/`HostConfiguredMissionWorkflow` machinery with an explicit `roleId: 'builder'`, reusing Host Adapter Configuration resolution (Sprint 33) and the certified Execution Pipeline (Sprints 25–27) verbatim.
- `package.json` command contribution registration mirroring the existing pattern.
- Host presentation/result formatting labeling the new command's output as Builder-specific, without introducing new Kernel data or a new Domain Event.
- Unit/integration test coverage for the new command, using existing deterministic test-doubles exclusively.

Deferred Concepts:

- Reviewer Workflow, Planner Workflow, or any other role-scoped workflow beyond Builder.
- Role-based adapter assignment, workflow chaining, multi-agent coordination, automatic routing.
- Execution Model expansion, a fourth production Adapter, Adapter Selection Policy, Marketplace publication.
- Any `src/kernel` or `src/adapters` change.

Critical Boundary:

- This sprint introduces exactly one architectural variable — an additive Builder Workflow command reusing the certified pipeline with explicit `roleId: 'builder'` — while every other component remains unchanged. No `src/kernel` or `src/adapters` file may be modified; all existing Developer Workflow commands and their test coverage remain frozen.

Notes:

- See `knowledge/implementation/sprints/sprint-0035-builder-workflow-foundation.md` for the complete Sprint Implementation Record.
- This sprint introduces no new bounded context and does not modify any RFC or the Kernel Canon; it reuses the `builder` Execution Role already registered by Sprint 8.

---

## Sprint 36 — Reviewer Workflow Foundation

Status: Approved (NEXUS-REV-2026-07-14-012)

RFC Coverage:

- No Primary RFC — Host-layer additive command, reusing existing certified contracts.
- Referenced: RFC-0004 — Execution Model (`reviewer` Execution Role, already registered by Sprint 8), RFC-0009 — Host Contract, RFC-0010 — Kernel Boundaries.

Ratification:

- `NEXUS-RAT-2026-07-14-012` — governs this Sprint's entire scope: title, the binding Architectural Invariant for all Milestone 7 Sprints, the authorized canonical-pattern-extraction refactor, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-011` — the milestone-boundary ratification opening Milestone 7 under which this Sprint is planned.

Implemented Concepts:

- A single reusable Host-layer factory function, extracted from the Role-scoped Configured Mission Workflow construction currently duplicated in `vscode-host.ts`, parameterized by `roleId` and `presentationOptions`.
- The existing Builder Workflow (Sprint 35) refactored to use this factory — behavior-preserving only.
- A new, additive Host command (`nexus.runReviewerMissionWorkflow`) constructed via the same factory with explicit `roleId: 'reviewer'`, reusing Host Adapter Configuration resolution (Sprint 33) and the certified Execution Pipeline (Sprints 25–27) verbatim.
- `package.json` command contribution registration mirroring the existing pattern.
- Unit/integration test coverage for the new command, plus a regression assertion that the refactored Builder Workflow's existing tests still pass unchanged.

Deferred Concepts:

- Planner Workflow, Documentation Workflow, or any other role-scoped workflow beyond Builder/Reviewer.
- Role-based adapter assignment, workflow chaining, multi-agent coordination, automatic routing.
- Execution Model expansion, Execution Session, Assignment Policy, a fourth production Adapter, Adapter Selection Policy, Marketplace publication.
- Any `src/kernel` or `src/adapters` change.

Critical Boundary:

- This sprint introduces exactly one architectural variable — a second Role-scoped Workflow command reusing the certified pipeline with explicit `roleId: 'reviewer'` — while every other component remains unchanged. The factory extraction SHALL NOT alter the Builder Workflow's observable behavior. No `src/kernel` or `src/adapters` file may be modified; all existing Developer/Builder Workflow commands and their test coverage remain frozen.

Notes:

- See `knowledge/implementation/sprints/sprint-0036-reviewer-workflow-foundation.md` for the complete Sprint Implementation Record.
- This sprint introduces no new bounded context and does not modify any RFC or the Kernel Canon; it reuses the `reviewer` Execution Role already registered by Sprint 8.

---

## Sprint 37 — Documentation Workflow Foundation

Status: Approved with Findings — NEXUS-REV-2026-07-14-013

RFC Coverage:

- No Primary RFC — Kernel Role registration reuses RFC-0004's existing `ExecutionRole`/`RoleRegistry` contracts; Host command is additive, reusing existing certified contracts.
- Referenced: RFC-0004 — Execution Model (registers the `Documentation Reviewer` Additional Role it already names), RFC-0009 — Host Contract, RFC-0010 — Kernel Boundaries.

Ratification:

- `NEXUS-RAT-2026-07-14-013` — governs this Sprint's entire scope: title, canonical Role id/command id/presentation strings, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-011` — named this Sprint's direction and flagged it as Milestone 7's first Sprint expected to touch `src/kernel`.
- `NEXUS-RAT-2026-07-14-012` — the binding Architectural Invariant this Sprint complies with.

Implemented Concepts:

- One new `ExecutionRole` entry in `createDefaultKernelRoles()` for Role id `documentation-reviewer`, mirroring the existing `builder`/`reviewer` entries' shape exactly.
- `nexus.runDocumentationReviewerMissionWorkflow`, constructed via the Sprint 36 `createConfiguredMissionWorkflow` factory with explicit `roleId: 'documentation-reviewer'` and `presentationOptions: { workflowLabel: 'Documentation Reviewer Workflow', completionMessageLabel: 'Documentation Review completed', includeAssignedRole: true }`.
- `package.json` command contribution registration mirroring the existing pattern.
- Deterministic unit/integration/package metadata/extension-host discoverability coverage for the new Role and command, preserving existing Builder/Reviewer workflow coverage.

Deferred Concepts:

- Planner Workflow, Documentation Author Workflow, Security Reviewer Workflow, Architecture Reviewer Workflow, or any other role-scoped workflow beyond Builder/Reviewer/Documentation Reviewer.
- Registration of any Additional Role other than `Documentation Reviewer`.
- Role-based adapter assignment, workflow chaining, multi-agent coordination, automatic routing.
- Execution Model expansion, Execution Session, Assignment Policy, a fourth production Adapter, Adapter Selection Policy, Marketplace publication.
- Any `src/adapters` change; any change to `HostAdapterConfigurationResolver`/`HostConfiguredMissionWorkflow`.

Critical Boundary:

- This sprint introduces exactly one architectural variable — registering an already RFC-0004-named Role and exposing its corresponding Host workflow via the existing Sprint 36 factory — while every other component remains unchanged. This is Milestone 7's first authorized `src/kernel` change, strictly limited to Role registration; all existing Developer/Builder/Reviewer Workflow commands and their test coverage remain frozen.

Notes:

- See `knowledge/implementation/sprints/sprint-0037-documentation-workflow-foundation.md` for the complete Sprint Implementation Record.
- This sprint introduces no new bounded context and does not modify RFC-0004 or the Kernel Canon; `Documentation Reviewer` is already named by RFC-0004's Additional Role enumeration.
- Builder implementation is complete; Reviewer validation complete — **Approved with Findings** (`NEXUS-REV-2026-07-14-013`). One Minor Documentation Drift finding (F-001) generates a Documentation Task and does not block progression.

---

## Sprint 38 — Engineering Role Profiles Foundation

Status: Approved with Findings — NEXUS-REV-2026-07-14-015 (F-001 remediated and verified by NEXUS-REV-2026-07-14-016)

RFC Coverage:

- RFC-0004 — Execution Model v1.1 (Primary; new "Engineering Role Profile" section).
- Referenced: RFC-0010 — Kernel Boundaries.

Ratification:

- `NEXUS-RAT-2026-07-14-015` — governs this Sprint's entire scope: `EngineeringRoleProfileService`'s non-orchestration boundary, registry immutability after Kernel composition, the strengthened acceptance criterion, the forward-compatibility statement, and the semantic-equivalence presentation-value requirement.
- `NEXUS-RAT-2026-07-14-014` — the RFC-0004 v1.1 amendment this Sprint implements.
- `NEXUS-RAT-2026-07-14-011` — the milestone-boundary ratification opening Milestone 7, as retitled.

Implemented Concepts:

- `EngineeringRoleProfile` immutable Kernel value object, mirroring `ExecutionRole`'s construction pattern.
- `EngineeringRoleProfileRegistry` contract + `InMemoryEngineeringRoleProfileRegistry`, mirroring `RoleRegistry`/`InMemoryRoleRegistry`.
- `createDefaultEngineeringRoleProfiles()`, seeding one profile per existing default Kernel Role with presentation metadata semantically equivalent to existing `vscode-host.ts` values.
- `EngineeringRoleProfileService`, a thin lookup/enumeration/diagnostics abstraction only — not an orchestration service.
- `createKernelServices` composition-time-only registry seeding.

Deferred Concepts:

- Any `src/hosts` or `src/adapters` change.
- Host/command discovery, workflow catalogs, Activity Bar integration, dashboard generation.
- Workflow Chaining, Assignment Policy, Execution Sessions, Planner Workflow.
- Security Reviewer, Performance Reviewer, Accessibility Reviewer, Test Engineer Workflows.
- Adapter Routing, Adapter Selection, multi-agent orchestration, authorization.

Critical Boundary:

- `EngineeringRoleProfile` SHALL be the only new normative architectural concept introduced by this Sprint. No execution semantics, dispatch eligibility, lifecycle, assignment, orchestration, or authorization behavior is authorized. Registration occurs only at Kernel composition time; the registry is immutable thereafter.

Notes:

- See `knowledge/implementation/sprints/sprint-0038-engineering-role-profiles-foundation.md` for the complete Sprint Implementation Record.
- Builder implementation completed the authorized vertical slice. Reviewer validation complete: Approved with Findings (`NEXUS-REV-2026-07-14-015`); the sole finding, F-001, was remediated (`DOC-004`) and independently verified (`NEXUS-REV-2026-07-14-016`). Sprint 38 is Milestone 7's final authorized Sprint; Milestone 7 is Complete per `NEXUS-RAT-2026-07-14-016`.

---

# Milestone 8 — Engineering Orchestration

Status: ✅ COMPLETE (Sprint 39 Approved — NEXUS-REV-2026-07-14-017; Sprint 40 Approved with Findings — Execution Session Foundation, NEXUS-REV-2026-07-14-018; Sprint 41 Approved — Workflow Chaining Foundation, NEXUS-REV-2026-07-14-020; Sprint 42 Approved with Findings — Engineering Session Workflow Chain Wiring, NEXUS-REV-2026-07-14-021, fully closed by NEXUS-REV-2026-07-14-022; Sprint 43 Approved — Engineering Session Manual Workflow Advancement, NEXUS-REV-2026-07-14-023; Sprint 44 Approved — Assignment Policy Foundation, NEXUS-REV-2026-07-14-024; Sprint 45 Approved — Automatic/Event-Driven Workflow Advancement, NEXUS-REV-2026-07-14-026; Sprint 46 Approved with Findings — Review-Gated Workflow Advancement, NEXUS-REV-2026-07-15-001, zero open findings; Sprint 47 Approved — Workflow Chain Execution, NEXUS-REV-2026-07-15-003, fully closed with zero open findings; Sprint 48 Approved — Assignment Policy Integration, NEXUS-REV-2026-07-15-005, fully closed with zero open findings; Sprint 49 Approved — Session Recovery/Checkpointing Foundation, NEXUS-REV-2026-07-15-006, fully closed with zero open findings; Sprint 50 Approved — Concurrent Session Coordination, NEXUS-REV-2026-07-15-007, fully closed with zero open findings; Sprint 51 Approved — NEXUS-REV-2026-07-15-008 — Multi-Agent Engineering Orchestration Foundation, authorized by NEXUS-RAT-2026-07-15-012, designated and confirmed as Milestone 8's concluding Sprint; Milestone 8 is Complete)

Named by `NEXUS-RAT-2026-07-14-011` as a future milestone. Original candidate scope: Engineering Role Profiles, Workflow Chaining, Assignment Policy, Execution Sessions, Multi-agent Engineering Orchestration, and review-gated execution progression. These are execution-orchestration concerns, not Host-workflow concerns, and were intentionally excluded from Milestone 7 (now Complete, `NEXUS-RAT-2026-07-14-016`). Engineering Role Profiles shipped under Milestone 7 (Sprint 38); Execution Sessions' foundation shipped as Sprint 39's `EngineeringSession` and Sprint 40's `ExecutionSession`. RFC-0004 was amended to v1.3 (`NEXUS-RAT-2026-07-14-020`) to define Workflow Chaining, implemented by Sprint 41 as a standalone `WorkflowChain` concept and wired into `EngineeringSession` by Sprint 42. Sprint 43 (Approved, `NEXUS-REV-2026-07-14-023`) closed Sprint 42's own recorded Known Limitation by introducing deterministic, manually-invoked, single-step workflow advancement and terminal-completion detection. Sprint 44 (Approved, `NEXUS-REV-2026-07-14-024`) implements RFC-0004's existing Assignment Policy section as a standalone domain foundation. RFC-0004 was amended to v1.4 (`NEXUS-RAT-2026-07-14-025`) to define a generalized Workflow Advancement model naming three Advancement Strategies: Manual (Sprint 43), Automatic/Event-Driven (Sprint 45, `NEXUS-RAT-2026-07-14-026`), and Review-Gated (Sprint 46, `NEXUS-REV-2026-07-15-001`). RFC-0004 was further amended to v1.6 (`NEXUS-RAT-2026-07-15-003`) to add "Workflow Chain Execution" — executing the Workflow Step at the current position, distinct from Workflow Advancement — after governance analysis found this capability explicitly reserved but unauthorized by v1.3/v1.4. Sprint 47 (`NEXUS-RAT-2026-07-15-004`) implemented that section and is Approved (`NEXUS-REV-2026-07-15-003`, fully closed with zero open findings). During Sprint 48's planning, a Sprint Owner request to evaluate "Assignment Policy Foundation" was re-scoped after governance analysis found that capability already certified as Sprint 44; RFC-0004 was amended to v1.7 (`NEXUS-RAT-2026-07-15-005`) to add an "Assignment Policy Evaluation" subsection to Workflow Chain Execution. Sprint 48 (`NEXUS-RAT-2026-07-15-006`) is Approved (`NEXUS-REV-2026-07-15-005`), fully closed with zero open findings. During Sprint 49's planning, the Sprint Owner selected Session Recovery/Checkpointing from Milestone 8's remaining candidate scope (Multi-Agent Engineering Orchestration, session recovery/checkpointing, concurrent session coordination); RFC-0004 was amended to v1.8 (`NEXUS-RAT-2026-07-15-007`) to add a "Session Recovery/Checkpointing" section defining Checkpoint and Recovery atop Engineering Session's existing, unmodified snapshot/reconstitution contract. Sprint 49 (`NEXUS-RAT-2026-07-15-008`) is Approved (`NEXUS-REV-2026-07-15-006`), fully closed with zero open findings. During Sprint 50's planning, the Sprint Owner selected Concurrent Session Coordination from Milestone 8's remaining candidate scope (Multi-Agent Engineering Orchestration, Concurrent Session Coordination); RFC-0004 was amended to v1.9 (`NEXUS-RAT-2026-07-15-009`) to add a "Concurrent Session Coordination" section. Sprint 50 (`NEXUS-RAT-2026-07-15-010`) is Approved (`NEXUS-REV-2026-07-15-007`), fully closed with zero open findings. Following Sprint 50's closure, the planner found no existing normative definition of Multi-Agent Engineering Orchestration anywhere in RFC-0004, the Kernel Canon, or `knowledge/reference/`; the Sprint Owner selected a combined scope — Mission Engineering Grouping and cross-role Handoff — as Milestone 8's concluding capability. RFC-0004 was amended to v1.10 (`NEXUS-RAT-2026-07-15-011`) to add "Multi-Agent Engineering Orchestration Foundation," authorized for implementation as Sprint 51 (`NEXUS-RAT-2026-07-15-012`), which is Current.

Opened by `NEXUS-RAT-2026-07-14-018`, following the RFC-0004 v1.2 amendment (`NEXUS-RAT-2026-07-14-017`) introducing `Engineering Session` — the Kernel-owned runtime boundary for one span of AI-assisted engineering work, distinct from and containing zero or more of RFC-0004's existing, unmodified `Execution Session` records. Sprint 51 — Multi-Agent Engineering Orchestration Foundation is designated Milestone 8's concluding Sprint per `NEXUS-RAT-2026-07-15-012`; upon its Approval with zero open findings, Milestone 8 SHALL be considered Complete.

## Sprint 39 — Engineering Sessions Foundation

Status: Approved — NEXUS-REV-2026-07-14-017

RFC Coverage:

- RFC-0004 — Execution Model v1.2 (Primary; new "Engineering Session" section).
- Referenced: RFC-0010 — Kernel Boundaries.

Ratification:

- `NEXUS-RAT-2026-07-14-018` — governs this Sprint's entire scope: Authorized Builder Scope, Explicitly Deferred list, and scope restrictions.
- `NEXUS-RAT-2026-07-14-017` — the RFC-0004 v1.2 amendment (Engineering Session) this Sprint implements.
- `NEXUS-RAT-2026-07-14-011` — the ratification naming Milestone 8's candidate scope, now opened by `NEXUS-RAT-2026-07-14-018`.

Implemented Concepts:

- `EngineeringSession` Kernel domain concept with `EngineeringSessionId`, `EngineeringSessionStatus` deterministic lifecycle, and the RFC-0004 v1.2 Architectural Responsibilities at foundation-level detail only.
- Session repository contract and in-memory implementation, mirroring existing Kernel repository patterns.
- `EngineeringSessionService` for session creation, lifecycle transition, lookup, and enumeration — thin orchestration only.
- `createKernelServices` composition updated to construct and register the Session repository and `EngineeringSessionService`.

Deferred Concepts:

- Workflow Chaining, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration.
- Automatic workflow advancement, session recovery/checkpointing, concurrent session coordination.
- `ExecutionSession` implementation (RFC-0004's existing, narrower concept remains unimplemented and out of scope).
- Any `src/hosts` or `src/adapters` change.

Notes:

- See `knowledge/implementation/sprints/sprint-0039-engineering-sessions-foundation.md` for the complete Sprint Implementation Record.
- This sprint does not modify RFC-0004 further (already amended to v1.2 by `NEXUS-RAT-2026-07-14-017`), any other RFC, or the Kernel Canon.
- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-14-017`).

---

## Sprint 40 — Execution Session Foundation

Status: Approved with Findings — NEXUS-REV-2026-07-14-018

RFC Coverage:

- RFC-0004 — Execution Model v1.2 (Primary; existing "Execution Session" section, unmodified).
- Referenced: RFC-0010 — Kernel Boundaries.

Ratification:

- `NEXUS-RAT-2026-07-14-019` — governs this Sprint's entire scope: Authorized Builder Scope, four Sprint Owner Refinements, Explicitly Deferred list, and scope restrictions.
- `NEXUS-RAT-2026-07-14-018` — Sprint 39's ratification; establishes `EngineeringSession`, the aggregate this Sprint's `ExecutionSession` is owned by.

Authorized Concepts:

- `ExecutionSession` immutable, append-only Kernel domain concept with `ExecutionSessionId`, recording assigned Execution Role, assigned Adapter, execution timestamps, consumed Projection version, produced artifacts, and execution outcome, exactly per RFC-0004's existing "Execution Session" section.
- Required, immutable owning-`EngineeringSessionId` reference on every `ExecutionSession` (Refinement 4 ownership invariant): exactly one `EngineeringSession` per `ExecutionSession`, enforced at construction and the repository layer.
- `ExecutionSession` repository contract and in-memory implementation, scoped lookup/enumeration by owning `EngineeringSessionId`.
- Thin `ExecutionSessionService` (create/lookup/enumerate only) — no dispatch, Assignment Policy evaluation, Task lifecycle transition, or workflow coordination.
- `createKernelServices` composition updated to construct and register the `ExecutionSession` repository and `ExecutionSessionService`.

Deferred Concepts:

- Workflow Chaining, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration.
- Automatic workflow advancement, session recovery/checkpointing, concurrent session coordination.
- Adapter dispatch, execution-eligibility determination, Task lifecycle transition, and all orchestration behavior.
- Any `src/hosts` or `src/adapters` change.

Notes:

- See `knowledge/implementation/sprints/sprint-0040-execution-session-foundation.md` for the complete Sprint Implementation Record.
- This sprint does not modify RFC-0004, any other RFC, or the Kernel Canon. Refinement 4's ownership invariant is an implementation/repository-level constraint only.
- Builder implementation completed the authorized Execution Session Foundation vertical slice.
- `ExecutionSession`, `ExecutionSessionId`, `IExecutionSessionRepository`/`InMemoryExecutionSessionRepository`, and `ExecutionSessionService` are implemented as Kernel-only execution-domain code and composed through `createKernelServices()`.
- Adapter dispatch, execution-eligibility determination, Assignment Policy evaluation, Task lifecycle transition, workflow coordination, Workflow Chaining, Review-Gated Progression, Multi-Agent Engineering Orchestration, automatic workflow advancement, session recovery/checkpointing, concurrent session coordination, and Host/Adapter consumption remain deferred pending future ratification.
- Both findings (F-001, F-002) remediated and independently verified Completed (`NEXUS-REV-2026-07-14-019`). Sprint 40 is fully closed with zero open findings.

---

## Sprint 41 — Workflow Chaining Foundation

Status: Approved — NEXUS-REV-2026-07-14-020

RFC Coverage:

- RFC-0004 — Execution Model v1.3 (Primary; new "Workflow Chaining" section).
- Referenced: RFC-0010 — Kernel Boundaries.

Ratification:

- `NEXUS-RAT-2026-07-14-021` — governs this Sprint's entire scope: Authorized Builder Scope, two Sprint Owner Refinements, Explicitly Deferred list, and scope restrictions.
- `NEXUS-RAT-2026-07-14-020` — the RFC-0004 v1.3 amendment (Workflow Chaining) this Sprint implements.

Authorized Concepts:

- `WorkflowChain` immutable Kernel domain concept with `WorkflowChainId` and an ordered list of `WorkflowStep`s, exactly per RFC-0004 v1.3's "Workflow Chaining" section. No mutation method after construction (Refinement 1).
- `WorkflowStep` value object referencing exactly one Execution Role via the existing `RoleId`; no reference to `EngineeringSession`, `ExecutionSession`, Adapter, Assignment Policy, or `EngineeringRoleProfile` (Refinement 2).
- `WorkflowChain` repository contract and in-memory implementation — create/lookup/enumerate only.
- Thin `WorkflowChainService` (create/lookup/enumerate only) — no dispatch, no advancement, no Assignment Policy, no Engineering Session wiring.
- `createKernelServices` composition updated to construct and register the `WorkflowChain` repository and `WorkflowChainService`.

Deferred Concepts:

- `EngineeringSession` → `WorkflowChain` wiring (active-chain reference, current workflow position).
- Automatic workflow advancement, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing, concurrent session coordination.
- Any `src/hosts` or `src/adapters` change.

Notes:

- See `knowledge/implementation/sprints/sprint-0041-workflow-chaining-foundation.md` for the complete Sprint Implementation Record.
- This sprint does not modify RFC-0004, any other RFC, or the Kernel Canon. `EngineeringSession` and `ExecutionSession` are not modified by this Sprint.
- Builder implementation completed the authorized Workflow Chaining Foundation vertical slice.
- `WorkflowChain`, `WorkflowChainId`, `WorkflowStep`, `IWorkflowChainRepository`/`InMemoryWorkflowChainRepository`, and `WorkflowChainService` are implemented as Kernel-only execution-domain code and composed through `createKernelServices()`.
- `EngineeringSession` to `WorkflowChain` wiring, automatic workflow advancement, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration, session recovery/checkpointing, concurrent session coordination, Host integration, and Adapter integration remain deferred pending future ratification.
- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-14-020`).

---

## Sprint 42 — Engineering Session Workflow Chain Wiring

Status: Approved with Findings — NEXUS-REV-2026-07-14-021; TASK-001 remediation of F-001 independently verified — NEXUS-REV-2026-07-14-022; fully closed with zero open findings

RFC Coverage:

- RFC-0004 — Execution Model v1.3 (Primary; existing "Engineering Session" § Architectural Responsibilities, already amended by `NEXUS-RAT-2026-07-14-020` to assign this ownership; unmodified by this Sprint).
- Referenced: RFC-0010 — Kernel Boundaries.

Ratification:

- `NEXUS-RAT-2026-07-14-022` — governs this Sprint's entire scope: Authorized Builder Scope, four Sprint Owner Refinements, Explicitly Deferred list, and scope restrictions.
- `NEXUS-RAT-2026-07-14-021` — Sprint 41's ratification; establishes `WorkflowChain`/`WorkflowStep`, consumed read-only and unmodified by this Sprint.
- `NEXUS-RAT-2026-07-14-020` — the RFC-0004 v1.3 amendment this Sprint implements.

Implemented Concepts:

- `EngineeringSession.workflowChainId` and `EngineeringSession.currentWorkflowStepId`, both immutable and populated only at construction.
- Binding validation within `EngineeringSession` construction: rejects null/nonexistent `WorkflowChain` references, null/nonexistent `WorkflowStep` references, and a `WorkflowStep` that does not belong to the bound `WorkflowChain`.
- `IEngineeringSessionRepository`/`InMemoryEngineeringSessionRepository` persistence extended to carry the new fields.
- `EngineeringSessionService` creation path extended to validate and persist the binding — no new operation changes it after creation.
- `createKernelServices` composition updated only as strictly required to supply `IWorkflowChainRepository` for read-only lookup during `EngineeringSession` construction.

Deferred Concepts:

- Workflow advancement (manual or automatic), event-driven advancement, Review-Gated Progression, Assignment Policy.
- Workflow completion, branching, restart, or replacement.
- Multi-Agent Engineering Orchestration, session recovery/checkpointing, concurrent session coordination.
- Any `src/hosts` or `src/adapters` change.
- Any modification to `WorkflowChain`, `WorkflowStep`, `ExecutionSession`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, or `ExecutionStrategy`.

Notes:

- See `knowledge/implementation/sprints/sprint-0042-engineering-session-workflow-chain-wiring.md` for the complete Sprint Implementation Record.
- This sprint does not modify RFC-0004, any other RFC, or the Kernel Canon. `WorkflowChain`, `WorkflowStep`, and `ExecutionSession` are not modified by this Sprint.
- Introduces structural runtime binding only; no workflow progression semantics are introduced.
- Builder implementation completed the authorized Engineering Session Workflow Chain Wiring vertical slice.
- `EngineeringSession`, `IEngineeringSessionRepository` / `InMemoryEngineeringSessionRepository`, `EngineeringSessionService`, and `createKernelServices()` were updated only for creation-time binding, persistence, and composition.
- Workflow advancement, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration, session recovery/checkpointing, concurrent session coordination, Host integration, and Adapter integration remain deferred pending future ratification.
- Reviewer validation complete: **Approved with Findings** (`NEXUS-REV-2026-07-14-021`). One Major finding (F-001) recorded — `currentWorkflowStepId`'s role-based representation could not address a repeated-role `WorkflowChain` position.
- `TASK-001` remediated `currentWorkflowStepId` to a validated, canonical zero-based position string; independently verified Completed (`NEXUS-REV-2026-07-14-022`). Sprint 42 is fully closed with zero open findings.

---

## Sprint 43 — Engineering Session Manual Workflow Advancement

Status: Approved — NEXUS-REV-2026-07-14-023

RFC Coverage:

- RFC-0004 — Execution Model v1.3 (Primary; existing "EngineeringSession", "WorkflowChain", "WorkflowStep" sections, unmodified by this Sprint).
- Referenced: RFC-0010 — Kernel Boundaries.

Ratification:

- `NEXUS-RAT-2026-07-14-023` — governs this Sprint's entire scope: Authorized Builder Scope, five Sprint Owner Refinements, Explicitly Deferred list, and scope restrictions.
- `NEXUS-RAT-2026-07-14-022` — Sprint 42's ratification; establishes the `workflowChainId`/`currentWorkflowStepId` binding this Sprint advances.
- `NEXUS-RAT-2026-07-14-021` — Sprint 41's ratification; establishes `WorkflowChain`/`WorkflowStep`, consumed read-only and unmodified by this Sprint.

Authorized Concepts:

- `EngineeringSession.advanceWorkflow()` — deterministic, single-step advancement of `currentWorkflowStepId` to the next `WorkflowStep` in the bound `WorkflowChain`'s ordered steps; exactly one step per invocation.
- Workflow completion detection — a read-only signal that the `EngineeringSession` has reached the bound `WorkflowChain`'s terminal `WorkflowStep`; state only, with no triggered behavior.
- Deterministic rejection of: advancement with no bound `WorkflowChain`; advancement from an invalid current `WorkflowStep`; advancement beyond the terminal `WorkflowStep`; a `WorkflowStep` reference not belonging to the bound `WorkflowChain`.
- `IEngineeringSessionRepository`/`InMemoryEngineeringSessionRepository` persistence extended to carry the advanced position through snapshot/reconstitution.
- `EngineeringSessionService` orchestration extended to expose `advanceWorkflow()` — repository interaction and persistence only.
- `createKernelServices` composition updated only as strictly required.

Deferred Concepts:

- Automatic workflow advancement, event-driven advancement.
- Assignment Policy, Review-Gated Progression.
- Workflow branching, restart, or replacement.
- Concurrent workflow execution, Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing.
- Any `src/hosts` or `src/adapters` change.
- Any modification to `WorkflowChain`, `WorkflowChainId`, `WorkflowStep`, `IWorkflowChainRepository`, `InMemoryWorkflowChainRepository`, `WorkflowChainService`, `ExecutionSession`, `ExecutionSessionId`, `ExecutionSessionService`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, or `ExecutionStrategy`.

Notes:

- See `knowledge/implementation/sprints/sprint-0043-engineering-session-manual-workflow-advancement.md` for the complete Sprint Implementation Record.
- This sprint does not modify RFC-0004, any other RFC, or the Kernel Canon. `WorkflowChain`, `WorkflowStep`, and `ExecutionSession` are not modified by this Sprint.
- Introduces deterministic, caller-invoked, single-step workflow progression and terminal-completion detection only; no orchestration behavior is introduced.
- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-14-023`). Zero findings requiring Builder action; two non-blocking Category 6 Observations recorded (service-level exposure of `isWorkflowComplete()`; reuse of the existing `InvalidEngineeringSessionDefinitionError` for advancement-time rejections). Sprint 43 is fully closed with zero open findings.

---

## Sprint 44 — Assignment Policy Foundation

Status: Approved — NEXUS-REV-2026-07-14-024

RFC Coverage:

- RFC-0004 — Execution Model v1.3 (Primary; existing "Assignment" and "Assignment Policy" sections, unmodified by this Sprint).
- Referenced: RFC-0010 — Kernel Boundaries.

Ratification:

- `NEXUS-RAT-2026-07-14-024` — governs this Sprint's entire scope: Authorized Builder Scope, four Sprint Owner Refinements, Explicitly Deferred list, and scope restrictions.

Authorized Concepts:

- `AssignmentPolicy` immutable Kernel domain concept with `AssignmentPolicyId` and immutable value objects for exactly the five RFC-0004-named assignment-requirement factors: required role (via the existing `RoleId`), Adapter/execution capability, repository configuration, execution constraints, and human preferences.
- A deterministic policy-evaluation operation on `AssignmentPolicy` that is a pure function of its stated inputs; equivalent inputs produce equivalent outcomes; no dispatch or side effect.
- `IAssignmentPolicyRepository` contract and in-memory implementation for creation, lookup, and enumeration only.
- Thin `AssignmentPolicyService` for creation, lookup, enumeration, and policy evaluation only, through constructor-injected repository contracts.
- `createKernelServices` composition updated only as strictly required to construct and register the `AssignmentPolicy` repository and service.

Deferred Concepts:

- `EngineeringSession` / `WorkflowChain` / `ExecutionSession` wiring of `AssignmentPolicy`.
- Runtime dispatch, Adapter selection, or Adapter invocation driven by policy evaluation.
- Review-Gated Progression, Multi-Agent Engineering Orchestration.
- Automatic or event-driven workflow advancement.
- Session recovery/checkpointing, concurrent session/workflow coordination.
- Any `src/hosts` or `src/adapters` change.

Notes:

- See `knowledge/implementation/sprints/sprint-0044-assignment-policy-foundation.md` for the complete Sprint Implementation Record.
- This sprint does not modify RFC-0004, any other RFC, or the Kernel Canon. `EngineeringSession`, `ExecutionSession`, `WorkflowChain`, and `WorkflowStep` are not modified by this Sprint.
- Introduces a standalone, deterministic Assignment Policy domain model only; no runtime wiring or orchestration behavior is introduced.
- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-14-024`). Zero findings of any category. Sprint 44 is fully closed with zero open findings.
- RFC-0004 was subsequently amended to v1.4 (`NEXUS-RAT-2026-07-14-025`), introducing the generalized Workflow Advancement model. Sprint 45 — Automatic/Event-Driven Workflow Advancement (`NEXUS-RAT-2026-07-14-026`) is now Current.

---

## Sprint 45 — Automatic/Event-Driven Workflow Advancement

Status: Approved (NEXUS-REV-2026-07-14-026; fully closed, zero open findings — TASK-001 remediation of NEXUS-REV-2026-07-14-025-F-001 verified)

RFC Coverage:

- RFC-0004 — Execution Model v1.4 (Primary; new "Workflow Advancement" section, Automatic/Event-Driven Advancement Strategy).
- Referenced: RFC-0004 v1.4 "Engineering Session" (existing, unmodified); RFC-0010 — Kernel Boundaries.

Ratification:

- `NEXUS-RAT-2026-07-14-026` — governs this Sprint's entire scope: Authorized Builder Scope, four Sprint Owner Refinements, Explicitly Deferred list, and scope restrictions.
- `NEXUS-RAT-2026-07-14-025` — the companion RFC-0004 v1.4 amendment naming and defining the Workflow Advancement model.

Authorized Concepts:

- Immutable, producer-independent `AdvancementTrigger` value object.
- New `EngineeringSession` operation accepting an `AdvancementTrigger`, evaluating Advancement Eligibility using Sprint 43's existing validated logic, producing the same Advancement Result/Failure outcomes as `advanceWorkflow()`.
- Corresponding thin `EngineeringSessionService` orchestration operation.
- Exactly one synchronous trigger-submission path; no Event Bus, scheduling, or asynchronous behavior.

Deferred Concepts:

- `ExecutionSession`-completion-driven or other concrete domain-event-driven trigger producers.
- Event Bus integration or subscription for `EngineeringSession`.
- Review-Gated Advancement and its Review Outcome gating semantics.
- Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing, concurrent session/workflow coordination.
- Any `src/hosts` or `src/adapters` change.

Notes:

- See `knowledge/implementation/sprints/sprint-0045-automatic-event-driven-workflow-advancement.md` for the complete Sprint Implementation Record.
- This sprint does not modify RFC-0004, any other RFC, or the Kernel Canon beyond what `NEXUS-RAT-2026-07-14-025` already authorized. `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionSession`, and Sprint 43's existing `advanceWorkflow()`/`isWorkflowComplete()` are not modified by this Sprint.
- Introduces the Automatic/Event-Driven Advancement Strategy only; Manual Advancement (Sprint 43) and Review-Gated Advancement (future) are unaffected.
- Approved. Builder implementation introduced `AdvancementTrigger`, `EngineeringSession.advanceWorkflowOnTrigger()`, and `EngineeringSessionService.advanceWorkflowOnTrigger()` only; all deferred concepts remain deferred. The single Reviewer finding (F-001, dead `trigger.toSnapshot()` statement) was remediated via `TASK-001` and independently verified (`NEXUS-REV-2026-07-14-026`); Sprint 45 is fully closed with zero open findings.

---

## Sprint 46 — Review-Gated Workflow Advancement

Status: Approved with Findings — `NEXUS-REV-2026-07-15-001` (one Minor, non-blocking Category 6 Observation; zero open Builder Tasks)

RFC Coverage:

- RFC-0004 — Execution Model v1.5 (Primary; "Workflow Advancement" § Review-Gated Advancement)
- Referenced: RFC-0006 — Engineering Assessment Model (`ReviewOutcome` consumed as immutable, read-only input; unmodified); RFC-0010 — Kernel Boundaries

Ratification:

- `NEXUS-RAT-2026-07-15-002` — governs this Sprint's entire scope: the binding Objective refinement, the binding Architectural Responsibilities split, and scope restrictions.
- `NEXUS-RAT-2026-07-15-001` — the companion RFC-0004 v1.5 amendment defining the Blocking/Non-Blocking Review Outcome classification this Sprint consumes.

Authorized Concepts:

- New `EngineeringSession` operation accepting an already-finalized `ReviewOutcome` (or a reference resolved via existing, unmodified `ReviewService` lookup) as immutable input, classifying it using the ratified Blocking/Non-Blocking semantics, and reusing Sprint 43's existing Advancement Eligibility/Result/Failure semantics unchanged, extended only by the Review-Gated eligibility check.
- Corresponding thin `EngineeringSessionService` orchestration operation, mirroring Sprint 45's pattern.

Deferred Concepts:

- Event Bus-driven or other automatic Review-completion-triggered advancement.
- Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing, concurrent session/workflow coordination.
- Any `ReviewService` write operation, Review lifecycle modification, or Review state persistence from within `EngineeringSession`/`EngineeringSessionService`.
- Any `AssignmentPolicy`, `ExecutionSession`, `src/hosts`, or `src/adapters` change.

Notes:

- See `knowledge/implementation/sprints/sprint-0046-review-gated-workflow-advancement.md` for the complete Sprint Implementation Record.
- This Sprint does not modify RFC-0004 or RFC-0006 beyond what `NEXUS-RAT-2026-07-15-001` already authorized. `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionSession`, `AssignmentPolicy`, and Sprint 43's/Sprint 45's existing advancement methods are not modified by this Sprint.
- `ReviewOutcome` remains exclusively owned and determined by RFC-0006/`ReviewService`; this Sprint only consumes the final outcome value.

---

## Sprint 47 — Workflow Chain Execution

Status: Implemented — Pending Reviewer Validation (`NEXUS-RAT-2026-07-15-004`); Builder implementation complete

RFC Coverage:

- RFC-0004 — Execution Model v1.6 (Primary; new "Workflow Chain Execution" section)
- Referenced: RFC-0008 — Kernel Adapter Contract (`AdapterService.dispatch`, unmodified); RFC-0010 — Kernel Boundaries

Ratification:

- `NEXUS-RAT-2026-07-15-004` — governs this Sprint's entire scope: the binding Objective, the binding Architectural Responsibilities, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-15-003` — the companion RFC-0004 v1.6 amendment defining Workflow Chain Execution this Sprint implements.

Authorized Concepts:

- One new `EngineeringSession` operation (e.g. `executeCurrentWorkflowStep`) resolving the current `WorkflowStep`'s `RoleId`, invoking the existing `ExecutionStrategyService` for readiness evaluation, dispatching via `AdapterService.dispatch` with a caller-supplied explicit `adapterId`, and constructing an `ExecutionSession` record through the existing, unmodified `ExecutionSessionService` to capture the attempt.
- A corresponding thin `EngineeringSessionService` orchestration operation, mirroring Sprint 45/46's pattern.
- `createKernelServices` composition updated only as strictly required to supply the additional repository/service contracts this operation reads.

Deferred Concepts:

- Adapter Selection, Adapter routing, capability scoring, or fallback logic — dispatch SHALL use an explicit, caller-supplied `adapterId` only.
- Assignment Policy evaluation.
- Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing.
- Concurrent session/workflow coordination.
- Any modification to `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, or `Finding`.
- Any modification to Sprint 43's `advanceWorkflow()`, Sprint 45's `advanceWorkflowOnTrigger()`, or Sprint 46's `advanceWorkflowAfterReview()`.
- Any `src/hosts` or `src/adapters` change.

Notes:

- See `knowledge/implementation/sprints/sprint-0047-workflow-chain-execution.md` for the complete Sprint Implementation Record.
- This Sprint does not modify RFC-0006, the Kernel Canon, or any other RFC beyond `NEXUS-RAT-2026-07-15-003`'s RFC-0004 v1.6 amendment.
- Execution and Advancement remain separate operations; this Sprint SHALL NOT fold execution into any existing `advanceWorkflow*` method or cause execution to implicitly advance the workflow position.
- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-15-003`). `TASK-001` remediated the sole finding from `NEXUS-REV-2026-07-15-002`; Sprint 47 is fully closed with zero open findings.

---

## Sprint 48 — Assignment Policy Integration

Status: ✅ Approved — `NEXUS-REV-2026-07-15-005` (fully closed; `TASK-001` remediation of `NEXUS-REV-2026-07-15-004-F-001` verified; zero open findings).

RFC Coverage:

- RFC-0004 — Execution Model v1.7 (Primary; new "Workflow Chain Execution" § Assignment Policy Evaluation subsection).
- Referenced: RFC-0004 v1.3 "Assignment Policy" (Sprint 44, unmodified); RFC-0004 v1.6 "Workflow Chain Execution" (Sprint 47, unmodified); RFC-0010 — Kernel Boundaries.

Ratification:

- `NEXUS-RAT-2026-07-15-006` — governs this Sprint's entire scope: the binding Objective, the binding Architectural Responsibilities, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-15-005` — the companion RFC-0004 v1.7 amendment defining Assignment Policy Evaluation this Sprint implements.

Authorized Concepts:

- Extension of `ExecuteCurrentWorkflowStepCommand` with an optional Assignment Policy reference and optional evaluation-input fields.
- Extension of `EngineeringSessionService.executeCurrentWorkflowStep` to invoke the existing, unmodified `AssignmentPolicyService.evaluateAssignmentPolicy` (Sprint 44) with the resolved `WorkflowStep`'s `RoleId` as the required-role input, before Adapter dispatch, when a reference is supplied.
- A new deterministic rejection outcome on `EngineeringSessionWorkflowExecutionStatus` (e.g. `AssignmentPolicyRejected`), mirroring the existing `ReadinessRejected` shape.
- `createKernelServices` composition updated only as strictly required to supply `AssignmentPolicyService` to `EngineeringSessionService` as an optional collaborator.

Deferred Concepts:

- Adapter Selection, Adapter routing, capability scoring, or fallback logic.
- Automatic Assignment Policy binding, inference, or lookup by `WorkflowStep`.
- Multi-Agent Engineering Orchestration, session recovery/checkpointing, concurrent session/workflow coordination, Task lifecycle transition.
- Any modification to `AssignmentPolicy`, `AssignmentPolicyService`, `IAssignmentPolicyRepository`, `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, or `Finding`.
- Any modification to Sprint 43's `advanceWorkflow()`, Sprint 45's `advanceWorkflowOnTrigger()`, or Sprint 46's `advanceWorkflowAfterReview()`.
- Any `src/hosts` or `src/adapters` change.

Notes:

- See `knowledge/implementation/sprints/sprint-0048-assignment-policy-integration.md` for the complete Sprint Implementation Record.
- This Sprint does not modify RFC-0006, the Kernel Canon, or any other RFC beyond `NEXUS-RAT-2026-07-15-005`'s RFC-0004 v1.7 amendment.
- When no Assignment Policy reference is supplied, `executeCurrentWorkflowStep` SHALL behave identically to Sprint 47's certified implementation.
- This Sprint determines Execution Role eligibility only; no Adapter Selection or role routing is introduced.
- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-15-005`). `TASK-001` remediated the sole finding from `NEXUS-REV-2026-07-15-004`; Sprint 48 is fully closed with zero open findings.

---

## Sprint 49 — Session Recovery/Checkpointing Foundation

Status: ✅ Approved — `NEXUS-REV-2026-07-15-006` (fully closed; two Category 6 Observations, zero Builder Tasks; zero open findings).

RFC Coverage:

- RFC-0004 — Execution Model v1.8 (Primary; new "Session Recovery/Checkpointing" section).
- Referenced: RFC-0004 v1.2/v1.3 "Engineering Session" (Sprints 39/40, unmodified); RFC-0010 — Kernel Boundaries.

Ratification:

- `NEXUS-RAT-2026-07-15-008` — governs this Sprint's entire scope: the binding Objective, the binding Architectural Responsibilities, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-15-007` — the companion RFC-0004 v1.8 amendment defining Session Recovery/Checkpointing this Sprint implements.

Authorized Concepts:

- `EngineeringSessionCheckpoint`, an immutable value object wrapping an Engineering Session's existing `EngineeringSessionSnapshot`, a `EngineeringSessionCheckpointId`, and a capture timestamp.
- `EngineeringSessionService.createCheckpoint()`, calling the existing, unmodified `EngineeringSession.toSnapshot()` and persisting the resulting Checkpoint.
- `IEngineeringSessionCheckpointRepository` and an in-memory implementation, mirroring existing Kernel repository patterns.
- `EngineeringSessionService.recoverFromCheckpoint()`, retrieving a stored Checkpoint and reconstituting an `EngineeringSession` via the existing, unmodified `EngineeringSession.fromSnapshot()`.
- `createKernelServices` composition updated only as strictly required to construct and register the Checkpoint repository and supply it to `EngineeringSessionService`.

Deferred Concepts:

- Concurrent Session Coordination, Multi-Agent Engineering Orchestration.
- Automatic or background checkpointing, Checkpoint retention/pruning policy, cross-session Checkpoint sharing.
- Any modification to `EngineeringSession`'s existing `toSnapshot()`, `fromSnapshot()`, snapshot structure, workflow state, timeline, or diagnostics.
- Any modification to `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding`, `AssignmentPolicy`, or `AssignmentPolicyService`.
- Any modification to Sprint 43's `advanceWorkflow()`, Sprint 45's `advanceWorkflowOnTrigger()`, Sprint 46's `advanceWorkflowAfterReview()`, or Sprint 47's/48's `executeCurrentWorkflowStep()`.
- Any `src/hosts` or `src/adapters` change.

Notes:

- See `knowledge/implementation/sprints/sprint-0049-session-recovery-checkpointing-foundation.md` for the complete Sprint Implementation Record.
- This Sprint does not modify RFC-0006, the Kernel Canon, or any other RFC beyond `NEXUS-RAT-2026-07-15-007`'s RFC-0004 v1.8 amendment.
- Recovery SHALL satisfy semantic equivalence, not byte-for-byte identity, per `NEXUS-RAT-2026-07-15-007`'s wording refinement; verified by a deterministic round-trip test: `recoverFromCheckpoint(createCheckpoint(session))` SHALL be semantically equivalent to `session` under all RFC-0004 invariants.
- Checkpoint capture and Recovery SHALL reuse `toSnapshot()`/`fromSnapshot()` exactly as they exist; no duplicate snapshot or reconstruction model is authorized.
- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-15-006`). Two Category 6, Informational Observations recorded (`-F-001`, `-F-002`); neither generates a Builder Task. Sprint 49 is fully closed with zero open findings.

---

## Sprint 50 — Concurrent Session Coordination

Status: ✅ Approved — `NEXUS-REV-2026-07-15-007` (fully closed; one Category 6 Observation, zero Builder Tasks; zero open findings).

RFC Coverage:

- RFC-0004 — Execution Model v1.9 (Primary; new "Concurrent Session Coordination" section).
- Referenced: RFC-0004 v1.2/v1.3 "Engineering Session" (Sprints 39/40, unmodified); RFC-0004 v1.8 "Session Recovery/Checkpointing" (Sprint 49, unmodified); RFC-0010 — Kernel Boundaries.

Ratification:

- `NEXUS-RAT-2026-07-15-010` — governs this Sprint's entire scope: the binding Objective, the binding Architectural Responsibilities, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-15-009` — the companion RFC-0004 v1.9 amendment defining Concurrent Session Coordination this Sprint implements.

Authorized Concepts:

- Implemented `EngineeringSessionService.enumerateActiveEngineeringSessions()` as one new thin active/eligible-for-progression Engineering Session discovery operation, reusing the existing, unmodified `IEngineeringSessionRepository`/`enumerate()`.
- `createKernelServices` composition required no production wiring change; the existing composed `EngineeringSessionService` exposes the new operation.

Deferred Concepts:

- Multi-Agent Engineering Orchestration.
- Single-session mutation ordering, optimistic concurrency, locking semantics, distributed coordination.
- Any modification to `EngineeringSession`'s existing runtime state, snapshot/reconstitution semantics, workflow state, timeline, or diagnostics.
- Any modification to `EngineeringSessionCheckpoint`, `IEngineeringSessionCheckpointRepository`, `createCheckpoint()`, or `recoverFromCheckpoint()` (Sprint 49).
- Any modification to `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding`, `AssignmentPolicy`, or `AssignmentPolicyService`.
- Any modification to Sprint 43's `advanceWorkflow()`, Sprint 45's `advanceWorkflowOnTrigger()`, Sprint 46's `advanceWorkflowAfterReview()`, or Sprint 47's/48's `executeCurrentWorkflowStep()`.
- Any `src/hosts` or `src/adapters` change.

Notes:

- See `knowledge/implementation/sprints/sprint-0050-concurrent-session-coordination.md` for the complete Sprint Implementation Record.
- This Sprint does not modify RFC-0006, the Kernel Canon, or any other RFC beyond `NEXUS-RAT-2026-07-15-009`'s RFC-0004 v1.9 amendment.
- No new `EngineeringSession`-family aggregate or repository is authorized; the existing per-ID `IEngineeringSessionRepository` already isolates Engineering Sessions structurally, and this Sprint SHALL demonstrate that isolation by test rather than introduce a new enforcement mechanism.
- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-15-007`). One Category 6, Informational Observation recorded (`-F-001`); no Builder Task generated. Sprint 50 is fully closed with zero open findings.

---

## Sprint 51 — Multi-Agent Engineering Orchestration Foundation

Status: ✅ Approved — `NEXUS-REV-2026-07-15-008` (fully closed; two Category 6 Observations, zero Builder Tasks; zero open findings). Authorized by `NEXUS-RAT-2026-07-15-012`. Milestone 8's concluding Sprint — Milestone 8 is now Complete.

RFC Coverage:

- RFC-0004 — Execution Model v1.10 (Primary; new "Multi-Agent Engineering Orchestration Foundation" section).
- Referenced: RFC-0004 v1.2/v1.3 "Engineering Session" (Sprints 39/40, unmodified); RFC-0004 v1.8 "Session Recovery/Checkpointing" (Sprint 49, unmodified); RFC-0004 v1.9 "Concurrent Session Coordination" (Sprint 50, unmodified); RFC-0010 — Kernel Boundaries.

Ratification:

- `NEXUS-RAT-2026-07-15-012` — governs this Sprint's entire scope: the binding Objective, the binding Architectural Responsibilities, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-15-011` — the companion RFC-0004 v1.10 amendment defining Multi-Agent Engineering Orchestration Foundation this Sprint implements.

Authorized Concepts:

- `MissionEngineeringGroup` (or equivalently named canonical Kernel concept): the deterministic association between a Mission and the Engineering Sessions participating in it, with a repository contract and in-memory implementation.
- A Kernel service operation enumerating a Mission's participating Engineering Sessions.
- `EngineeringSessionHandoff` (or equivalently named canonical Kernel concept): an explicit, immutable record that engineering responsibility for a Mission passed from one existing, unmodified Engineering Session to another, with a deterministic Handoff lifecycle, repository contract, and in-memory implementation.
- Kernel service operation(s) for recording and enumerating Handoffs, with deterministic diagnostics for invalid/unauthorized Handoff attempts.
- `createKernelServices` composition updated only as strictly required to construct and register the new repositories/services.

Deferred Concepts:

- Autonomous planning, dynamic workflow generation, AI negotiation, agent-to-agent messaging.
- Scheduling algorithms, load balancing, parallel execution semantics, distributed orchestration, execution synchronization primitives.
- Dynamic Assignment Policy, automatic Adapter Selection.
- Any modification to `EngineeringSession`, `EngineeringSessionCheckpoint`, `enumerateActiveEngineeringSessions()`, `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding`, `AssignmentPolicy`, or `AssignmentPolicyService`.
- Any modification to Sprint 43's `advanceWorkflow()`, Sprint 45's `advanceWorkflowOnTrigger()`, Sprint 46's `advanceWorkflowAfterReview()`, or Sprint 47's/48's `executeCurrentWorkflowStep()`.
- Any `src/hosts` or `src/adapters` change.
- Governance Engine capabilities.

Notes:

- See `knowledge/implementation/sprints/sprint-0051-multi-agent-engineering-orchestration-foundation.md` for the complete Sprint Implementation Record.
- This Sprint does not modify RFC-0006, the Kernel Canon, or any other RFC beyond `NEXUS-RAT-2026-07-15-011`'s RFC-0004 v1.10 amendment.
- Mission Engineering Group and Engineering Session Handoff are new, additive Kernel concepts; no existing aggregate or repository is modified to introduce them, and neither operation executes a Workflow Step, advances a workflow position, evaluates an Assignment Policy, or dispatches an Adapter.
- Upon this Sprint's Approval with zero open Critical/Major/Minor findings, Milestone 8 — Engineering Orchestration SHALL be considered Complete.
- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-15-008`). Two Category 6, Informational Observations recorded (`-F-001`, `-F-002`); neither generates a Builder Task. Sprint 51 is fully closed with zero open findings. Per `NEXUS-RAT-2026-07-15-012`, Milestone 8 — Engineering Orchestration is now Complete.

---

# Milestone 9 — Engineering Governance Automation

Status: 🟡 ACTIVE (Sprint 52 — Governance Policy Model Foundation is ✅ Approved — `NEXUS-REV-2026-07-15-009`, fully closed with zero open findings, authorized by `NEXUS-RAT-2026-07-15-015`; Sprint 53 — Policy Evaluation and Governance Decision Foundation is ✅ Approved — `NEXUS-REV-2026-07-15-010`/`-011`/`-012`, fully closed with zero open findings, authorized by `NEXUS-RAT-2026-07-15-016`; Sprint 54 — Ratification Attribution Validation Foundation is ✅ Approved — `NEXUS-REV-2026-07-16-001`, fully closed with zero open findings, authorized by `NEXUS-RAT-2026-07-15-017`; Sprint 55 — Ratification and Repository-Law Integration is ✅ Approved — `NEXUS-REV-2026-07-16-002`, fully closed with zero open findings, authorized by `NEXUS-RAT-2026-07-16-001`; Sprint 56 — Governance Decision Domain Event Publication is ✅ Approved with Findings — `NEXUS-REV-2026-07-16-006`, fully closed with one Category 4, Informational finding and zero open findings of any blocking category, authorized by `NEXUS-RAT-2026-07-16-002` and remediated under `NEXUS-RAT-2026-07-16-003`/`NEXUS-RAT-2026-07-16-004`; Sprint 57 — Governance-Gated Workflow Advancement is ✅ Approved — `NEXUS-REV-2026-07-16-008`, fully closed with zero open findings of any category, RFC-0004 amended to v1.11 by `NEXUS-RAT-2026-07-16-005`, authorized by `NEXUS-RAT-2026-07-16-006`; Sprint 58 — Governance Recovery and Blocking-State Foundation is Implemented — Pending Reviewer Validation, RFC-0004 amended to v1.12 by `NEXUS-RAT-2026-07-16-007`, authorized by `NEXUS-RAT-2026-07-16-008`. This status line's prior Sprint 56/57 wording was stale relative to `IMPLEMENTATION_PLAN.md`/`REVIEW_HISTORY.md`; synchronized during Sprint 58 planning.)

RFC Coverage:

- RFC-0011 — Engineering Governance Model (Final, Version 1.0, Normative — ratified `NEXUS-RAT-2026-07-15-014`)

Ratification:

- `NEXUS-RAT-2026-07-15-013` — opens Milestone 9, sets the binding Objective and Architectural Boundary, and authorizes `nexus-plan` to draft RFC-0011 for a separate follow-up ratification.
- `NEXUS-RAT-2026-07-15-014` — ratifies RFC-0011 v1.0 as Final and Normative following a section-by-section pre-ratification architectural review. Does not itself authorize any implementation Sprint.

Notes:

- RFC-0011 owns Repository Policy, Policy Criterion, Policy Evaluation, Governance Decision, and Governance Escalation; it does not modify RFC-0001 through RFC-0010 or the Kernel Canon.
- Governance Decision values (Approved, Rejected, Deferred, Escalation Required) are ratified as deterministic and mutually exclusive; no value permits autonomous state mutation.
- See `knowledge/specifications/rfc-0011-engineering-governance-model.md` for the full ratified text.

---

## Sprint 52 — Governance Policy Model Foundation

Status: ✅ Approved — `NEXUS-REV-2026-07-15-009` (fully closed; two Category 6 Observations, zero Builder Tasks; zero open findings). Authorized by `NEXUS-RAT-2026-07-15-015`. Milestone 9's opening Sprint.

RFC Coverage:

- RFC-0011 — Engineering Governance Model v1.0 (Primary; Repository Policy, Policy Criterion, immutability, versioning/supersession, attribution).
- RFC-0005 — Domain Event Model (Referenced; no Domain Events authorized this Sprint).

Ratification:

- `NEXUS-RAT-2026-07-15-015` — governs this Sprint's entire scope.
- `NEXUS-RAT-2026-07-15-014` — the companion RFC-0011 Final ratification this Sprint implements.

Authorized Concepts:

- `RepositoryPolicy`, `RepositoryPolicyId`, `PolicyCriterion`, policy version, policy supersession reference, Ratification attribution reference.
- `IRepositoryPolicyRepository` and in-memory implementation.
- `RepositoryPolicyService` (registration, supersession, retrieval, current-version lookup, enumeration, version-history enumeration; thin orchestration only).
- Minimal `createKernelServices` wiring for the new repository/service.

Deferred Concepts:

- Policy Criterion predicate evaluation, Policy Evaluation, Governance Decision (Approved/Rejected/Deferred/Escalation Required), Governance Escalation.
- Evidence, Shared Reality, Review Outcome/Finding consumption.
- Ratification-Ledger content validation, policy authority/conflict/precedence resolution.
- RFC-0005 Policy Events, Domain Event publication.
- Policy activation/enforcement, workflow gates, repository-write automation, Host-facing policy surfaces, durable persistence.
- Any `src/hosts` or `src/adapters` change.

Notes:

- See `knowledge/implementation/sprints/sprint-0052-governance-policy-model-foundation.md` for the complete Sprint Implementation Record.
- This Sprint does not modify the Kernel Canon, RFC-0011, any other finalized RFC, or `REVIEW_HISTORY.md`.
- No placeholder implementation of any deferred concept is authorized, including as an unused/stubbed reference.

Reviewer Validation Result:

- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-15-009`). Confirmed `RepositoryPolicy`/`PolicyCriterion` are new, additive Kernel governance concepts implementing exactly RFC-0011's Repository Policy/Policy Criterion sections; confirmed the ratified Version Lineage Rules are enforced at both the aggregate and repository layers with no mutation path; confirmed `PolicyCriterion` is inert declarative data with no predicate/evaluation logic anywhere in the diff; confirmed `RepositoryPolicyService` is thin orchestration with zero Policy Evaluation, Governance Decision, Governance Escalation, Ratification-Ledger access, cross-domain access, or event publication. No `src/hosts` or `src/adapters` file was touched. Independent re-validation confirmed `tsc --noEmit`, ESLint, `npm run test` (Vitest 81 files / 405 tests), `npm run build`, and `npm run test:extension-host:build` all pass cleanly.
- Two Category 6, Informational Observations recorded (`NEXUS-REV-2026-07-15-009-F-001`, `-F-002`): pre-existing, systemic `kernel-service-map.md` drift predating this Sprint, and a transient process-timing flake in an unrelated, unmodified Sprint 21 test. Neither generates a Builder Task. Sprint 52 is fully closed with zero open findings.

---

## Sprint 53 — Policy Evaluation and Governance Decision Foundation

Status: ✅ Approved — `NEXUS-REV-2026-07-15-010`/`-011`/`-012` (fully closed; one Category 1, Minor finding resolved by TASK-001; one Category 4, Informational documentation finding resolved by DOC-001; zero open findings of any category). Authorized by `NEXUS-RAT-2026-07-15-016`.

RFC Coverage:

- RFC-0011 — Engineering Governance Model v1.0 (Primary; Policy Evaluation, Governance Decision, Governance Escalation, Failure and Conflict Handling).
- RFC-0006 — Engineering Assessment Model (Referenced; finalized Review Outcome/Finding consumption only, unmodified).
- RFC-0005 — Domain Event Model (Referenced; Policy Events remain deferred).
- RFC-0010 — Kernel Boundaries (Referenced).

Ratification:

- `NEXUS-RAT-2026-07-15-016` — governs this Sprint's entire scope, including Final Refinement 1 (Missing Review Resolution: existing non-final/incomplete Review → Deferred; missing/unresolvable Review → Escalation Required) and Final Refinement 2 (`UnresolvedFindingMatch` explicit `expectedMatch: Present | Absent` polarity).
- `NEXUS-RAT-2026-07-15-015` — approved the Sprint 53/54 merge in principle; formally activated by `NEXUS-RAT-2026-07-15-016`.

Authorized Concepts:

- `PolicyEvaluation`, `PolicyEvaluationId`, `PolicyCriterionResult`, `PolicyCriterionResultStatus`.
- `GovernanceDecision`, `GovernanceDecisionId`, and the four canonical values (Approved, Rejected, Deferred, Escalation Required), derived via strict precedence (Escalation Required > Deferred > Rejected > Approved).
- `GovernanceEscalation`.
- `IGovernanceDecisionRepository` and an in-memory append-only implementation, enforcing evaluation idempotency via a deterministic evaluation key.
- `GovernanceService` (thin orchestration only).
- Two closed predicate kinds: `ReviewOutcomeMembership`, `UnresolvedFindingMatch` (with explicit `expectedMatch` polarity table).
- Minimal `createKernelServices` wiring for the new repository/service.

Deferred Concepts:

- Evidence- and Shared Reality-consuming Policy Criteria; multi-Policy evaluation, precedence, and conflict arbitration.
- Ratification-Ledger content/authority validation; repository-law interpretation.
- RFC-0005 Policy Events, Domain Event publication.
- Downstream Governance Decision consumers, policy enforcement, workflow gates, automatic remediation.
- Host-facing/Adapter-facing governance surfaces, durable persistence.
- Any `src/hosts` or `src/adapters` change.

Notes:

- See `knowledge/implementation/sprints/sprint-0053-policy-evaluation-and-governance-decision-foundation.md` for the complete Sprint Implementation Record.
- This Sprint does not modify the Kernel Canon, RFC-0011, RFC-0006, any other finalized RFC, or `REVIEW_HISTORY.md`.
- This Sprint does not modify Sprint 52's `RepositoryPolicy`/`PolicyCriterion` or Sprint 9's `Review`/`Finding` behavior; both are consumed as frozen, read-only dependencies.
- No placeholder implementation of any deferred concept is authorized, including as an unused/stubbed reference.
- Builder implementation complete: added deterministic governance evaluation/decision domain, in-memory append-only decision repository, thin `GovernanceService`, minimal Kernel composition, and 36 Sprint 53 tests. Repository validation passed: TypeScript compile, ESLint, Vitest (82 files / 442 tests), esbuild, and extension-host bundle build.
- TASK-001 remediation complete: narrowed `InMemoryGovernanceDecisionRepository` duplicate-registration equivalence to semantic decision content only, excluding non-semantic decision/evaluation/escalation identifiers and attribution timestamp while preserving contradictory duplicate rejection. Added regression coverage; targeted validation passed at 37 Sprint 53 tests.
- DOC-001 documentation correction complete: `IMPLEMENTATION_REPORT.md`'s Sprint 53 Validation Summary corrected to "82 files, 442 tests." Verified by `NEXUS-REV-2026-07-15-012`. Sprint 53 is fully closed with zero open findings of any category across `NEXUS-REV-2026-07-15-010`, `-011`, and `-012`.

---

## Sprint 60 — Recovery-Gated Re-Advancement

Status: Implemented — Pending Reviewer Validation. RFC-0004 amended to v1.13 by `NEXUS-RAT-2026-07-16-010`; Sprint scope authorized by `NEXUS-RAT-2026-07-16-011`. Milestone 9's ninth Sprint.

RFC Coverage:

- RFC-0004 v1.13 — Execution Model (Primary; "Recovery-Gated Re-Advancement Eligibility" §, new).
- RFC-0004 v1.11/v1.12 — Execution Model (Referenced; Governance-Gated Advancement and Recovery Requirement consumed unmodified).
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision` consumed unmodified).

Authorized Concepts:

- An optional constructor-injected `IRecoveryRequirementRepository` on `EngineeringSessionService`, used exclusively via `findByAttributionKey` ahead of invoking `EngineeringSession.advanceWorkflowAfterGovernanceDecision` — read-only.
- A pure, deterministic eligibility function implementing the Required Behavioral Matrix (`NEXUS-RAT-2026-07-16-011`), replacing or wrapping the existing `assertNonBlockingGovernanceDecision`.
- `createKernelServices` wiring so `EngineeringSessionService` always receives the shared, production `IRecoveryRequirementRepository`.

Deferred Concepts:

- Advancement eligibility for Withdrawn Recovery Requirements.
- Event subscriptions/consumers of Recovery Requirement or Governance Decision events.
- Governed Mission Completion; any Mission completion precondition change (still unscheduled; requires its own future RFC-0001 amendment).
- Any differentiated Deferred/Escalation-Required treatment beyond uniform Blocking.
- Any `src/hosts` or `src/adapters` change.

Notes:

- A Resolved Recovery Requirement restores Advancement Eligibility only for the exact (Mission, Engineering Session, Workflow Step, `GovernanceDecision`) attribution key that produced it, and only when its `acceptedOutcomeReference` is present; it does not reclassify the `GovernanceDecision` and does not itself advance the workflow.
- `RecoveryRequirement`, `RecoveryRequirementService`, `GovernanceDecision`, `GovernanceService`, `WorkflowChain`, and `WorkflowStep` remain unmodified.
- See `knowledge/implementation/sprints/sprint-0060-recovery-gated-re-advancement.md` for the complete Sprint Implementation Record.
- Builder implementation complete: added pure Recovery-Gated Re-Advancement eligibility evaluation, read-only exact-attribution Recovery Requirement lookup in `EngineeringSessionService`, production shared repository injection in `createKernelServices`, and Sprint 60 test coverage. Repository validation passed: TypeScript compile, ESLint, Vitest (84 files / 517 tests), esbuild, and extension-host bundle build.

---

## Sprint 59 — Recovery Requirement Domain Event Publication

Status: Implemented — Pending Reviewer Validation. Sprint scope authorized by `NEXUS-RAT-2026-07-16-009`. No RFC amendment. Milestone 9's eighth Sprint.

RFC Coverage:

- RFC-0005 — Domain Event Model (Partial; new catalog entries under the existing "Execution Events" category; no RFC-0005 text amendment).
- RFC-0004 v1.12 — Execution Model (Referenced; `RecoveryRequirement` aggregate, lifecycle, and boundaries consumed unmodified).
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision` consumed unmodified).

Authorized Concepts:

- `recovery-requirement.events.ts`: `RecoveryRequirementEventType` union (`RecoveryRequirementCreated`, `RecoveryRequirementResolved`, `RecoveryRequirementWithdrawn`), `RecoveryRequirementDomainEvent` type, and factory functions, mirroring `governance.events.ts` (Sprint 56).
- `RecoveryRequirement` aggregate recorded-events collection and `pullDomainEvents()`, mirroring `Mission`/`Evidence`/`Review`/`Knowledge`/`GovernanceDecision`.
- `RecoveryRequirementGovernanceDecisionConsumer` and `RecoveryRequirementService` gain constructor-injected `EventBusContract`, publishing only after successful persistence (save-then-publish pattern).
- `createKernelServices` updated so both receive the shared, production `EventBusContract` instance.
- `kernel-event-catalog.md` reference-document addition for the three new event types under "Execution Events."

Deferred Concepts:

- Event subscriptions/consumers of these new events.
- Governed Mission Completion; any Mission completion precondition change (still unscheduled; requires its own future RFC-0001 amendment).
- `WorkflowChain`/`WorkflowStep` mutation; any `GovernanceService`/`GovernanceDecision`/`GovernanceEscalation` modification.
- Durable/transactional event delivery.
- Any `src/hosts` or `src/adapters` change.

Notes:

- `RecoveryRequirementCreated` is recorded only during authoritative creation, never during `fromSnapshot` rehydration, and never duplicated on idempotent creation handling — Sprint Owner refinements incorporated by `NEXUS-RAT-2026-07-16-009`.
- No event is published on failed persistence or on a rejected/conflicting lifecycle transition.
- `GovernanceService`, `GovernanceDecision`, `WorkflowChain`, `EventBusContract`, and `DomainEvent` envelope remain unmodified.
- See `knowledge/implementation/sprints/sprint-0059-recovery-requirement-domain-event-publication.md` for the complete Sprint Implementation Record.
- Builder implementation complete: added Recovery Requirement Domain Event factories, aggregate recorded-events draining, save-then-publish EventBus wiring for creation/resolution/withdrawal, production `createKernelServices` injection, event catalog entries, and Sprint 59 tests. Repository validation passed: TypeScript compile, ESLint, Vitest (84 files / 500 tests), esbuild, and extension-host bundle build.

---

## Sprint 58 — Governance Recovery and Blocking-State Foundation

Status: ✅ Approved — `NEXUS-REV-2026-07-16-009` (fully closed; one Category 6, Informational Observation, zero Builder Tasks; zero open findings of any blocking category). RFC-0004 amended to v1.12 by `NEXUS-RAT-2026-07-16-007`; Sprint scope authorized by `NEXUS-RAT-2026-07-16-008`. Milestone 9's seventh Sprint.

RFC Coverage:

- RFC-0004 v1.12 — Execution Model (Primary; "Recovery Requirement" §, new).
- RFC-0011 v1.1 — Engineering Governance Model (Referenced; `GovernanceDecision` consumed read-only and unmodified).
- RFC-0010 — Kernel Boundaries (Referenced).

Authorized Concepts:

- `RecoveryRequirement` domain aggregate: immutable identity; immutable Mission/Engineering Session/Workflow Step/`GovernanceDecision` identity references; creation timestamp; causality/correlation identifiers where available.
- A narrowly scoped `GovernanceDecisionRecorded` consumer creating a Recovery Requirement only for a Rejected `GovernanceDecision`.
- `IRecoveryRequirementRepository` and an in-memory implementation enforcing deterministic, idempotent creation keyed on (Mission, Engineering Session, Workflow Step, `GovernanceDecision`).
- A thin `RecoveryRequirementService` exposing exactly `resolveRecoveryRequirement(...)` (Recovery Resolution Contract: requires an accepted-outcome/Evidence reference; does not itself judge remediation sufficiency) and `withdrawRecoveryRequirement(...)` (Recovery Withdrawal Contract: requires an authoritative decision/Ratification reference, reason, and timestamp).
- Minimal `createKernelServices` wiring.

Deferred Concepts:

- Recovery Requirement Domain Event publication (delivered by Sprint 59).
- AI-generated remediation plan generation.
- Governed Mission Completion or Mission completion precondition changes (still unscheduled; requires its own future RFC-0001 amendment).
- Differentiated Rejected/Deferred/Escalation-Required Engineering Session state beyond Sprint 57's uniform Blocking classification.
- Any `src/hosts` or `src/adapters` change.

Notes:

- A Recovery Requirement is created only for a Rejected `GovernanceDecision`; Deferred and Escalation Required remain Blocking (Sprint 57, unmodified) but create no Recovery Requirement; Approved creates no Recovery Requirement.
- Creation is deterministic and idempotent: at most one Recovery Requirement per (Mission, Engineering Session, Workflow Step, `GovernanceDecision`) combination.
- Lifecycle is limited to Open → Resolved | Withdrawn, both terminal, with immutable transition metadata and deterministic rejection of conflicting repeated transitions.
- `GovernanceService`, `GovernanceDecision`, `EventBusContract`, `DomainEvent`, `WorkflowChain`, `WorkflowStep`, `ExecutionStrategy`, and `AssignmentPolicy` remain unmodified.
- See `knowledge/implementation/sprints/sprint-0058-governance-recovery-and-blocking-state-foundation.md` for the complete Sprint Implementation Record.
- Builder implementation complete: added the `RecoveryRequirement` aggregate, repository, thin service, Rejected-only `GovernanceDecisionRecorded` consumer, Kernel composition wiring, and 17 Sprint 58 tests. Repository validation passed: TypeScript compile, ESLint, Vitest (84 files / 499 tests), esbuild, and extension-host bundle build.

---

## Sprint 57 — Governance-Gated Workflow Advancement

Status: ✅ Approved — `NEXUS-REV-2026-07-16-008` (TASK-001 Resolution Verification; fully closed with zero open findings of any category). Originally Approved with Findings under `NEXUS-REV-2026-07-16-007` (one Category 1, Minor finding resolved via TASK-001 Option B). Authorized by `NEXUS-RAT-2026-07-16-006`; RFC-0004 amended to v1.11 by `NEXUS-RAT-2026-07-16-005`. Milestone 9's sixth Sprint. *(Corrected: this line previously read "Implemented — Pending Reviewer Validation", which was stale relative to `IMPLEMENTATION_PLAN.md` and `REVIEW_HISTORY.md`; synchronized during Sprint 58 planning.)*

RFC Coverage:

- RFC-0004 v1.11 — Execution Model (Primary; Workflow Advancement § Governance-Gated Advancement; Non-Blocking/Blocking Governance Decision classification).
- RFC-0011 v1.1 — Engineering Governance Model (Referenced; `GovernanceDecision` consumed read-only and unmodified).
- RFC-0010 — Kernel Boundaries (Referenced).

Authorized Concepts:

- `EngineeringSession.advanceWorkflowAfterGovernanceDecision`, preserving existing Manual, Automatic/Event-Driven, and Review-Gated advancement operations.
- `EngineeringSessionService.advanceWorkflowAfterGovernanceDecision`, retrieving an already-produced persisted `GovernanceDecision`, resolving the associated completed Review outcome, delegating eligibility/mutation to `EngineeringSession`, and persisting only the resulting Engineering Session state.
- `GovernanceGatedWorkflowAdvancementConsumer`, a narrowly scoped `GovernanceDecisionRecorded` event consumer that extracts the persisted Governance Decision identity and delegates to `EngineeringSessionService`.
- Minimal `createKernelServices` wiring for the new consumer and the existing Governance Decision / Review repository dependencies.

Deferred Concepts:

- Recovery Requirement records; recovery-plan generation.
- Differentiated Engineering Session state for Rejected, Deferred, or Escalation Required Governance Decisions.
- Governed Mission Completion or Mission completion precondition changes.
- General-purpose event subscription/routing, Host or Adapter surfacing, and any `src/hosts` or `src/adapters` change.

Notes:

- `Approved` is the only Non-Blocking Governance Decision for Governance-Gated Advancement.
- `Rejected`, `Deferred`, and `Escalation Required` produce the same uniform Advancement Failure and do not advance the workflow position.
- Repeated invocation or duplicate `GovernanceDecisionRecorded` handling for the same governed WorkflowStep is idempotent and produces no duplicate advancement.
- `GovernanceService`, `GovernanceDecision`, `EventBusContract`, `DomainEvent`, `WorkflowChain`, `WorkflowStep`, `ExecutionStrategy`, and `AssignmentPolicy` remain unmodified.
- Builder implementation complete: targeted Sprint 57 validation passed (61 tests); repository validation passed with TypeScript compile, ESLint, Vitest (83 files / 482 tests), esbuild, and extension-host bundle build.

---

## Sprint 56 — Governance Decision Domain Event Publication

Status: ✅ Approved with Findings — `NEXUS-REV-2026-07-16-006` (fully closed; one Category 4, Informational finding, zero Builder Tasks blocking; zero open findings of any blocking category). Authorized by `NEXUS-RAT-2026-07-16-002`; remediated under `NEXUS-RAT-2026-07-16-003` (Mission Identity Rule, since withdrawn) and `NEXUS-RAT-2026-07-16-004` (RFC-0011 v1.1 Mission-Scoped Governance Evaluation). Milestone 9's fifth Sprint. *(Corrected: this line previously read "Second Recovery Remediation Implemented — Pending Recovery Review", which was stale relative to `IMPLEMENTATION_PLAN.md` and `REVIEW_HISTORY.md`; synchronized during Sprint 58 planning.)*

RFC Coverage:

- RFC-0005 — Domain Event Model v1.0 (Primary; Domain Event, Event Identity/Attribution/Causality/Correlation, "Policy Events" category).
- RFC-0011 — Engineering Governance Model v1.1 (Primary; Dependencies § Domain Event publication requirement; Mission-Scoped Governance Evaluation §).

Ratification:

- `NEXUS-RAT-2026-07-16-002` — governs this Sprint's entire binding scope: Event Model, Mission Identity, Publication Semantics, Architectural Boundaries, and the Required Test Matrix. Issued following one Sprint Owner "Approve With Changes" review cycle on the originating `nexus-plan` proposal.

Authorized Concepts:

- `GovernanceDecisionRecorded` Domain Event type (single event, unchanged four-value outcome).
- Required `missionId` on the governance-evaluation request and `GovernanceDecision`, populated from the evaluation request.
- Resolved Review Mission mismatch validation producing `Escalation Required`.
- `EventBusContract` wiring into `GovernanceService`.
- Persist-before-publish event draining, mirroring the existing `ReviewService` pattern.
- Minimal `createKernelServices` wiring change.

Deferred Concepts:

- Downstream consumption of `GovernanceDecisionRecorded` by any workflow gate, repository-write automation, or Host/Adapter surface.
- Evidence- or Shared-Reality-consuming Policy Criteria.
- Multi-Policy or multi-Ratification conflict arbitration beyond Sprint 55's existing scope.
- Any change to the four-value `GovernanceDecision` model's outcome semantics or the Mixed-Result Decision Table.
- Any change to `EventBusContract` or the `DomainEvent` envelope.
- Any `src/hosts` or `src/adapters` change.

Notes:

- See `knowledge/implementation/sprints/sprint-0056-governance-decision-domain-event-publication.md` for the complete Sprint Implementation Record.
- This Sprint does not modify the Kernel Canon, RFC-0005, RFC-0011, any other finalized RFC, or `REVIEW_HISTORY.md`.
- This Sprint does not modify Sprint 52's `RepositoryPolicy`/`PolicyCriterion` or Sprint 54's `RatificationAuthoritySnapshot`/`RatificationAttributionValidationService` behavior.
- No placeholder implementation of any deferred concept is authorized.
- Builder implementation complete: added `GovernanceDecisionRecorded`, persisted required `GovernanceDecision.missionId`, EventBus publication from `GovernanceService` after repository registration, idempotent no-duplicate publication, and Sprint 56 test coverage.
- First recovery remediation complete: removed the unratified command-level Mission identity fallback and `GovernanceDecisionMissionUnavailableError`, and restored missing/unresolvable Review → `Escalation Required`.
- Second recovery remediation complete pending Recovery Review: implemented RFC-0011 v1.1 Mission-scoped governance evaluation, required explicit evaluation Mission identity, added Review Mission mismatch → `Escalation Required`, and restored structurally required Mission attribution on every `GovernanceDecisionRecorded` event.

---

## Sprint 55 — Ratification and Repository-Law Integration

Status: ✅ Approved — `NEXUS-REV-2026-07-16-002` (fully closed; one Category 6, Informational Observation, zero Builder Tasks; zero open findings). Authorized by `NEXUS-RAT-2026-07-16-001`.

RFC Coverage:

- RFC-0011 — Engineering Governance Model v1.0 (Primary; Authority Hierarchy §, Failure and Conflict Handling §).
- Referenced: Sprint 53's `GovernanceDecision`/`PolicyEvaluation`/`GovernanceEscalation`; Sprint 54's `RatificationAttributionValidationService`/`RatificationAuthoritySnapshot`.

Ratification:

- `NEXUS-RAT-2026-07-16-001` — governs this Sprint's entire binding scope: Validation Ordering, Escalation Attribution, Determinism and Idempotency, Architectural Boundaries, and the Required Test Matrix. Issued following one Sprint Owner "Approve With Changes" review cycle on the originating `nexus-plan` proposal.

Implemented Concepts:

- Additive `GovernanceService` precondition step invoking `RatificationAttributionValidationService` for the `RepositoryPolicy` version under evaluation, before Policy Criteria evaluation.
- Two-branch outcome mapping: `Valid` → existing Sprint 53 evaluation/precedence logic unchanged; `Invalid`/`Unresolvable` → `Escalation Required` without Policy Criteria evaluation.
- `GovernanceEscalation` extended additively with attribution-driven fields (Policy identity/version, referenced Ratification identity, attribution-validation result, attribution diagnostic, Snapshot fingerprint/version).
- Deterministic evaluation key/idempotency mechanism extended to incorporate the Ratification Authority Snapshot fingerprint.
- Minimal `createKernelServices` wiring change.

Deferred Concepts:

- Contradiction detection across multiple distinct Ratifications or Policies beyond Sprint 54's existing single-record scope.
- General repository-law interpretation or precedence.
- Automatic `RATIFICATION_LEDGER.md` ingestion.
- RFC-0005 Domain Event publication.
- Host-facing/Adapter-facing governance surfaces, durable persistence.
- Any change to the four-value `GovernanceDecision` model, the Mixed-Result Decision Table, or existing Policy Criterion predicates.
- Any `src/hosts` or `src/adapters` change.

Notes:

- See `knowledge/implementation/sprints/sprint-0055-ratification-and-repository-law-integration.md` for the complete Sprint Implementation Record.
- This Sprint does not modify the Kernel Canon, RFC-0011, any other finalized RFC, or `REVIEW_HISTORY.md`.
- This Sprint does not modify Sprint 52's `RepositoryPolicy`/`PolicyCriterion` or Sprint 54's `RatificationAuthoritySnapshot`/`RatificationAttributionValidationService` behavior; both are consumed read-only.
- This Sprint does not modify the four-value `GovernanceDecision` model, the Mixed-Result Decision Table, or existing Policy Criterion predicates — only additive extension is authorized.
- No placeholder implementation of any deferred concept is authorized.
- Builder implementation complete: added attribution validation as a `GovernanceService` precondition, attribution-driven escalation fields, Snapshot fingerprint-based evaluation-key determinism, minimal Kernel composition wiring, and Sprint 55 test coverage. Repository validation passed: TypeScript compile, ESLint, Vitest (83 files / 464 tests), esbuild, and extension-host bundle build.

Reviewer Validation Result:

- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-16-002`). Confirmed Validation Ordering, Escalation Attribution, and Determinism and Idempotency are implemented exactly as `NEXUS-RAT-2026-07-16-001` requires, each independently tested, including exact-repeat idempotency and independent re-evaluation on a changed Snapshot fingerprint. Confirmed the four-value `GovernanceDecision` model, the Mixed-Result Decision Table, and both existing Policy Criterion predicates are byte-for-byte unmodified, and that no RFC-0005 Domain Event, `src/hosts`, or `src/adapters` file was touched. Independent re-validation confirmed `tsc --noEmit`, ESLint, targeted Vitest (64/64), `npm run test` (83 files / 464 tests), `npm run build`, and `npm run test:extension-host:build` all pass cleanly.
- One Category 6, Informational Observation recorded (`NEXUS-REV-2026-07-16-002-F-001`): a wording tension between `NEXUS-RAT-2026-07-16-001`'s Architectural Boundaries and Scope Restrictions clauses, surfaced by one additive field added to Sprint 54's `RatificationAttributionValidationSnapshot`. Does not generate a Builder Task. Sprint 55 is fully closed with zero open findings.

---

## Sprint 54 — Ratification Attribution Validation Foundation

Status: ✅ Approved — `NEXUS-REV-2026-07-16-001` (fully closed; two Category 6, Informational Observations, zero Builder Tasks; zero open findings of any blocking category). Authorized by `NEXUS-RAT-2026-07-15-017`.

RFC Coverage:

- RFC-0011 — Engineering Governance Model v1.0 (Primary; Repository Policy § "attributable").
- RFC-0011 — Authority Hierarchy § (Referenced; tier-4 `RATIFICATION_LEDGER.md` relationship, not implemented this Sprint).
- `IMPLEMENTATION_CONSTITUTION.md` § Sprint Owner Ratifications (Referenced).

Ratification:

- `NEXUS-RAT-2026-07-15-017` — governs this Sprint's entire binding scope: the Objective diagram, Snapshot Cardinality (immutable collection, not single-record), RatificationAuthorityRecord Fields, Closed Lifecycle Statuses (`Effective`/`Superseded`/`Withdrawn`), the Required Outcome Mapping table (Valid/Invalid/Unresolvable), Authorized Concepts, and Scope Boundary. Issued following two Sprint Owner "Changes Required" review cycles on the originating `nexus-plan` proposal.

Planned Concepts:

- `RatificationAuthoritySnapshot` (or equivalently named canonical concept) — an immutable collection of `RatificationAuthorityRecord` entries.
- `RatificationAuthorityRecord` — identifier, date, subject, and any explicitly documented supersession/withdrawal reference.
- `RatificationAttributionValidation` (or equivalently named canonical capability) producing exactly Valid, Invalid, or Unresolvable per the ratified Required Outcome Mapping table.
- Repository contract and in-memory implementation for the Snapshot source.
- Minimal `createKernelServices` wiring for the new repository/capability.

Deferred Concepts:

- Ratification prose/intent interpretation; semantic applicability of a Ratification to Policy content.
- Contradiction detection across multiple distinct Ratifications or Policies (beyond a single record's internal contradiction).
- General repository-law interpretation or precedence.
- Integration with `PolicyEvaluation`, `GovernanceDecision`, or `GovernanceService`.
- Domain Event publication.
- Host-facing/Adapter-facing governance surfaces, durable persistence, automatic Ratification-Ledger ingestion beyond the Snapshot source contract.
- Any `src/hosts` or `src/adapters` change.

Notes:

- See `knowledge/implementation/sprints/sprint-0054-ratification-attribution-validation-foundation.md` for the complete Sprint Implementation Record.
- This Sprint does not modify the Kernel Canon, RFC-0011, any other finalized RFC, or `REVIEW_HISTORY.md`.
- This Sprint does not modify Sprint 52's `RepositoryPolicy`/`PolicyCriterion` or Sprint 53's `PolicyEvaluation`/`GovernanceDecision`/`GovernanceEscalation` behavior; both are consumed/left frozen and unintegrated.
- This Sprint's output is standalone; no downstream consumer exists yet.
- No placeholder implementation of any deferred concept is authorized.
- Builder implementation complete: added immutable Ratification Authority Snapshot/Record domain, standalone Ratification Attribution Validation service, in-memory Snapshot source repository, deterministic diagnostics for every Required Outcome Mapping condition, minimal Kernel composition wiring, and 14 Sprint 54 tests. Repository validation passed: TypeScript compile, ESLint, Vitest (83 files / 456 tests), esbuild, and extension-host bundle build.

Reviewer Validation Result:

- Reviewer validation complete: **Approved** (`NEXUS-REV-2026-07-16-001`). Confirmed `RatificationAuthoritySnapshot`/`RatificationAuthorityRecord`/`RatificationAttributionValidationService` implement exactly `NEXUS-RAT-2026-07-15-017`'s Authorized Scope, including the ratified Snapshot Cardinality correction, the closed three-value lifecycle status set, and every row of the Required Outcome Mapping table. Confirmed the capability exposes no `GovernanceDecision`, `PolicyEvaluation`, event-publication, host, or adapter surface, and is composed by `createKernelServices()` as a fully standalone service. Independent re-validation confirmed `tsc --noEmit`, ESLint, targeted Vitest (19/19), `npm run test` (83 files / 456 tests), `npm run build`, and `npm run test:extension-host:build` all pass cleanly.
- Two Category 6, Informational Observations recorded (`NEXUS-REV-2026-07-16-001-F-001`, `-F-002`): a recurrence of the pre-existing Sprint 21 process-timing flake, and a minor Dependencies-wording precision gap in `NEXUS-RAT-2026-07-15-017`. Neither generates a Builder Task. Sprint 54 is fully closed with zero open findings.

---

## Sprint 2 — Review Remediation

Status: Historically Accepted Governance Deviation (NEXUS-RAT-2026-07-13-008). Source Review `NEXUS-REV-2026-07-12-002` was never persisted in `REVIEW_HISTORY.md`; no fabricated retroactive certification is recorded. TASK-004 is closed by NEXUS-RAT-2026-07-13-008 — its underlying concern has been repeatedly addressed by eight subsequent reference-document reconciliation ratifications and requires no further work.

Source Review:

- NEXUS-REV-2026-07-12-002 (never persisted; see NEXUS-RAT-2026-07-13-008)

RFC Coverage:

- RFC-0001 — Mission Model
- RFC-0005 — Domain Event Model (causality and correlation semantics)

Completed Tasks:

- TASK-001 — Removed duplicate `MissionService.create(objective)` method; `createMission(request)` remains the Mission Service creation operation.
- TASK-002 — Added Mission lifecycle event causality chaining from the immediately preceding Mission event ID, persisted through `MissionSnapshot`, and optional lifecycle operation correlation IDs.
- TASK-003 — Documented the non-atomic MissionService save/publish limitation in `IMPLEMENTATION_REPORT.md`.
- TASK-004 — CLOSED by NEXUS-RAT-2026-07-13-008. No further implementation work required; no recovery sprint authorized.

Deferred Concepts:

- Mission Plan
- Mission Revision
- Task
- Task Graph
