# RFC-0004 — Execution Model

**Status:** Final
**Version:** 1.16
**Authority:** Normative
**Normative Language:** RFC 2119

---

# Amendment History

- v1.0 — Original specification.
- v1.1 — Adds Engineering Role Profile (Sprint Owner Ratification `NEXUS-RAT-2026-07-14-014`). Engineering Role Profile is descriptive/presentational metadata only, one-to-one with Execution Role; Execution Role remains the sole authority for execution semantics, identity, and dispatch eligibility. No other section of this specification is modified.
- v1.2 — Adds Engineering Session (Sprint Owner Ratification `NEXUS-RAT-2026-07-14-017`). Engineering Session is the Kernel-owned runtime boundary for one span of AI-assisted engineering work and MAY contain zero or more Execution Sessions. Execution Session's existing definition, invariants, and immutability are unmodified by this amendment; it becomes one activity record capturable within an Engineering Session's timeline. No other section of this specification is modified.
- v1.3 — Adds Workflow Chaining (Sprint Owner Ratification `NEXUS-RAT-2026-07-14-020`). Workflow Chain is the Kernel-owned, immutable definition of an ordered engineering workflow (chain identity, ordered steps, topology); it owns no mutable runtime state. Engineering Session's existing Architectural Responsibilities are clarified, not expanded: it executes a Workflow Chain, owning the active Workflow Chain reference, current workflow position, workflow state, and workflow execution history as runtime progression through that Chain's immutable structure. Execution Session's existing definition, invariants, and immutability are unmodified. No other section of this specification is modified.
- v1.4 — Adds Workflow Advancement (Sprint Owner Ratification `NEXUS-RAT-2026-07-14-025`). Workflow Advancement is the generalized, normative model for how an Engineering Session's current workflow position moves forward within its bound Workflow Chain, organized around six concepts (Advancement Strategy, Advancement Trigger, Advancement Eligibility, Advancement Authority, Advancement Result, Advancement Failure) and exactly three named Advancement Strategies (Manual Advancement, Automatic/Event-Driven Advancement, Review-Gated Advancement). Manual Advancement is the existing Sprint 43 capability, unmodified and unexpanded by this amendment. Automatic/Event-Driven Advancement and Review-Gated Advancement are named but not yet implemented; each requires its own future Sprint Owner scope ratification. Engineering Session's existing ownership of runtime progression (RFC-0004 v1.2/v1.3) is unmodified; this amendment organizes and names the strategies by which that progression occurs. No other section of this specification is modified.
- v1.5 — Defines Review-Gated Advancement's gating semantics (Sprint Owner Ratification `NEXUS-RAT-2026-07-15-001`). Introduces the **Blocking Review Outcome** / **Non-Blocking Review Outcome** classification of RFC-0006's `ReviewOutcome` values: Accepted and Accepted With Observations are Non-Blocking; Action Required and Rejected are Blocking. Review-Gated Advancement's Advancement Eligibility additionally requires a Non-Blocking Review Outcome. This amendment defines gating semantics only; it does not authorize implementation, which requires its own future Sprint Owner scope ratification. Manual Advancement, Automatic/Event-Driven Advancement, Engineering Session, Workflow Chain, and RFC-0006 are unmodified. No other section of this specification is modified.
- v1.6 — Adds Workflow Chain Execution (Sprint Owner Ratification `NEXUS-RAT-2026-07-15-003`). Defines the act of executing the Workflow Step at an Engineering Session's current workflow position — resolving the Workflow Step's Execution Role, invoking the existing Execution Strategy, and dispatching through the existing Adapter contract (explicit `adapterId` only; no Adapter Selection) — distinct from Workflow Advancement, which only moves the current workflow position. Execution is recorded through the existing Execution Session model without redefining Execution Session's own lifecycle. This amendment does not modify Engineering Session, Workflow Chain, Workflow Advancement, Review-Gated Advancement, Execution Strategy, Execution Session, Assignment Policy, or RFC-0006; it does not introduce Assignment Policy evaluation, Adapter Selection, Multi-Agent Orchestration, or Task lifecycle transition. No other section of this specification is modified.
- v1.7 — Adds Assignment Policy Evaluation to Workflow Chain Execution (Sprint Owner Ratification `NEXUS-RAT-2026-07-15-005`). Defines an optional consumption point at which Workflow Chain Execution, given a caller-supplied Assignment Policy reference, consults the existing Assignment Policy's existing deterministic evaluation to gate dispatch: when the resolved Workflow Step's Execution Role and supplied evaluation input do not satisfy the referenced Assignment Policy, Workflow Chain Execution SHALL reject execution before Adapter dispatch and before any Execution Session is recorded. This amendment does not modify Assignment Policy's own definition, evaluation semantics, or value objects (v1.3, unmodified); it does not introduce Adapter Selection, Adapter routing, capability scoring, automatic Assignment Policy binding/inference, Multi-Agent Orchestration, or Task lifecycle transition. When no Assignment Policy reference is supplied, Workflow Chain Execution's existing v1.6 behavior is unchanged. No other section of this specification is modified.
- v1.8 — Adds Session Recovery/Checkpointing (Sprint Owner Ratification `NEXUS-RAT-2026-07-15-007`). Defines a **Checkpoint** — a named, immutable, point-in-time capture of an Engineering Session's existing runtime snapshot (v1.2/v1.3, unmodified) — and **Recovery**, which reconstitutes an Engineering Session from a Checkpoint via the existing, unmodified `fromSnapshot()` reconstitution contract (Sprint 39). Recovery SHALL reconstruct an Engineering Session that is semantically equivalent to the captured Checkpoint, preserving all RFC-defined state, workflow progression, workflow execution history, timeline, diagnostics, and architectural invariants; implementation-specific object identity, memory layout, or serialization format are not part of this contract. This amendment does not modify Engineering Session's existing snapshot, reconstitution, workflow state, timeline, or diagnostics ownership; it does not introduce Concurrent Session Coordination or Multi-Agent Engineering Orchestration, both of which remain separately unauthorized. No other section of this specification is modified.
- v1.9 — Adds Concurrent Session Coordination (Sprint Owner Ratification `NEXUS-RAT-2026-07-15-009`). Defines how multiple Engineering Sessions MAY coexist within the Kernel, remain independently executable, and be observed through provider-neutral Kernel services: concurrent visibility of Engineering Sessions, enumeration of Engineering Sessions eligible for further progression, observation of concurrent Engineering Session lifecycle, and repository-level guarantees that operations on one Engineering Session SHALL NOT observe or mutate the runtime state of another. This amendment does not redefine Engineering Session's existing runtime state, snapshot, or Recovery ownership (v1.2/v1.3/v1.8, unmodified), and does not introduce single-session mutation ordering, optimistic concurrency, locking semantics, distributed coordination, or Multi-Agent Engineering Orchestration, all of which remain separately unauthorized. No other section of this specification is modified.
- v1.10 — Adds Multi-Agent Engineering Orchestration Foundation (Sprint Owner Ratification `NEXUS-RAT-2026-07-15-012`). Defines the structural relationships through which multiple independent Engineering Sessions MAY participate in a single Mission while preserving complete session independence: a **Mission Engineering Group** (the deterministic association of a Mission with the Engineering Sessions participating in it, and their enumeration), and an **Engineering Session Handoff** (an explicit, immutable record that engineering responsibility for a Mission passed from one Engineering Session/Execution Role to another, together with a deterministic Handoff lifecycle). This amendment defines orchestration structure only; it does not introduce autonomous planning, dynamic workflow generation, AI negotiation, agent-to-agent messaging, scheduling algorithms, load balancing, parallel execution semantics, distributed orchestration, execution synchronization primitives, dynamic Assignment Policy, or automatic Adapter Selection. It does not redefine Engineering Session's existing runtime state, snapshot/reconstitution, or Recovery ownership (v1.2/v1.3/v1.8, unmodified), Workflow Chain or Workflow Chain Execution (v1.3/v1.6/v1.7, unmodified), Assignment Policy (v1.3, unmodified), Execution Strategy, or Concurrent Session Coordination (v1.9, unmodified). No other section of this specification is modified.
- v1.11 — Adds Governance-Gated Advancement as RFC-0004's fourth Advancement Strategy (Sprint Owner Ratification `NEXUS-RAT-2026-07-16-005`). Advancement is contingent upon an already-produced, immutable `GovernanceDecision` (RFC-0011), consumed as read-only input; Advancement Eligibility for this Strategy additionally requires that a `GovernanceDecision` has in fact been produced for the governing evaluation (its absence is an Advancement Eligibility failure, not a classification value). A `GovernanceDecision` is classified as exactly one of: **Non-Blocking Governance Decision** — Approved (advancement MAY proceed); **Blocking Governance Decision** — Rejected, Deferred, Escalation Required (advancement SHALL NOT proceed, producing an Advancement Failure). This classification is owned by RFC-0004 for the sole purpose of Governance-Gated Advancement's Advancement Eligibility; it does not modify RFC-0011's `GovernanceDecision` values, semantics, lifecycle, or production, and does not modify Manual Advancement, Automatic/Event-Driven Advancement, Review-Gated Advancement, Engineering Session, Workflow Chain, or Workflow Chain Execution. This amendment defines gating semantics only; it does not authorize Recovery Requirement records, new Engineering Session states distinguishing Rejected/Deferred/Escalation Required beyond uniform Blocking treatment, or any Mission completion precondition change — each remains explicitly unauthorized pending its own future Sprint Owner scope ratification. No other section of this specification is modified.
- v1.12 — Adds Recovery Requirement (Sprint Owner Ratification `NEXUS-RAT-2026-07-16-007`). Introduces `RecoveryRequirement` — an explicit, attributable record that a Rejected `GovernanceDecision` (RFC-0011) has generated engineering remediation work, immutably associated with the Mission, Engineering Session, Workflow Step, and originating `GovernanceDecision` identities that produced it. Creation is deterministic and idempotent: for a given (Mission, Engineering Session, Workflow Step, `GovernanceDecision`) combination the Kernel SHALL create at most one Recovery Requirement, and repeated handling of the same Rejected `GovernanceDecision` SHALL return the existing record rather than create a duplicate; a new Recovery Requirement MAY be created only when a distinct `GovernanceDecision` produces a new rejection. A Recovery Requirement SHALL be created only for a Rejected `GovernanceDecision`; Deferred and Escalation Required remain Blocking under Governance-Gated Advancement (v1.11, unmodified) but SHALL NOT create a Recovery Requirement — Deferred resolves automatically per RFC-0011 once its missing input exists, and Escalation Required requires Sprint Owner/Ratification resolution per RFC-0011's Governance Escalation, neither of which is "recovery work" in the RFC-0004 sense. Approved SHALL NOT create a Recovery Requirement. Recovery Requirement lifecycle is limited to a closed set of deterministic statuses (Open, Resolved, Withdrawn) with deterministic transition rules (`Open → Resolved`, `Open → Withdrawn`, both terminal); it SHALL NOT generate remediation plans through AI, SHALL NOT mutate Workflow Chain topology, and SHALL NOT be owned or mutated by `GovernanceService`. This amendment does not modify RFC-0011's `GovernanceDecision` values, semantics, lifecycle, or production; does not modify Manual, Automatic/Event-Driven, Review-Gated, or Governance-Gated Advancement; and does not authorize any differentiated Engineering Session state beyond Governance-Gated Advancement's existing uniform Blocking classification (v1.11, unmodified). No other section of this specification is modified.
- v1.13 — Adds Recovery-Gated Re-Advancement Eligibility to Governance-Gated Advancement (Sprint Owner Ratification `NEXUS-RAT-2026-07-16-010`). For a workflow position governed by a Rejected `GovernanceDecision` (a Blocking Governance Decision, v1.11), Advancement Eligibility is additionally satisfied — restoring it for evaluation by Governance-Gated Advancement's existing Advancement Authority only, not producing an Advancement Result automatically — when a Recovery Requirement (v1.12) exists for the exact (Mission, Engineering Session, Workflow Step, `GovernanceDecision`) combination governing that position and that Recovery Requirement's status is Resolved, using its existing, unmodified Recovery Resolution Contract reference. Missing, Open, and Withdrawn Recovery Requirement states remain Blocking; Withdrawn is deliberately excluded because withdrawal demonstrates only that a Recovery Requirement ceased to apply through separate authority, not that the rejected engineering condition was remediated — extending eligibility to Withdrawn requires its own future RFC amendment and Sprint Owner ratification. A Resolved Recovery Requirement SHALL NOT change, supersede, or reinterpret the originating Rejected `GovernanceDecision`, which remains immutable and fully attributable (RFC-0011, unmodified); it provides an additional, independent advancement-eligibility input only, and only when its Mission/Engineering Session/Workflow Step/`GovernanceDecision` attribution exactly matches the position under evaluation — an accepted outcome resolving an unrelated Recovery Requirement SHALL NOT satisfy this path. Deferred and Escalation Required remain Blocking and unaffected (v1.12 creates no Recovery Requirement for either). This amendment does not modify `GovernanceDecision` (RFC-0011), Recovery Requirement's own lifecycle, Recovery Resolution Contract, or Recovery Withdrawal Contract (v1.12, unmodified), Workflow Chain topology or Workflow Step definitions, Mission completion preconditions (RFC-0001, unmodified), or introduce a new Advancement Authority. No other section of this specification is modified.
- v1.14 — Adds Engineering Decision Correlation (Sprint Owner Ratification `NEXUS-RAT-2026-07-17-002`). Introduces `EngineeringDecisionCorrelation` — an explicit, attributable, append-only record correlating a governed Workflow position (Mission, Engineering Session, Workflow Step) with the Review (RFC-0006) and `GovernanceDecision` (RFC-0011) produced for it, resolving the inbound attribution gap identified during Milestone 10 planning: `GovernanceDecisionRecorded` and `Review` are Mission-scoped only (RFC-0006/RFC-0011, unmodified) and carry no Engineering Session or Workflow Step identity, so no automatic, event-driven consumer can deterministically resolve which Engineering Session a Mission-scoped Governance Decision or Review pertains to. This amendment defines the correlation's identity, required attribution, append-only association lifecycle, and deterministic fail-closed lookup contract only. It does not itself implement Event-Driven Workflow Advancement or Recovery Workflow Automation, does not modify `Review` or `GovernanceDecision` ownership, values, semantics, lifecycle, or production (RFC-0006/RFC-0011, unmodified), does not modify Engineering Session's existing ownership of runtime progression or Mission Engineering Group's existing Mission-attribution ownership (v1.2/v1.3/v1.10, unmodified), and does not introduce a general-purpose relationship graph, routing policy, or orchestration engine. No other section of this specification is modified.
- v1.15 — Adds Event-Driven Workflow Advancement (Sprint Owner Ratification `NEXUS-RAT-2026-07-17-004`). Defines the Kernel mechanism that reacts to an authoritative `GovernanceDecisionRecorded` Domain Event and invokes Governance-Gated Advancement (v1.11, unmodified) for the exact Engineering Session and Workflow Step resolved through Engineering Decision Correlation's (v1.14, unmodified) existing lookup by `governanceDecisionId`. Defines Trigger Authority (exactly one Kernel component owns the `EventBus` subscription for this purpose), the normative event handling flow, fail-closed correlation resolution and attribution validation, idempotency and delivery-ordering rules, and explicit architectural boundaries. This amendment does not modify `GovernanceDecision`, Review, Engineering Decision Correlation, Governance-Gated Advancement's existing Advancement Eligibility, Engineering Session's existing Workflow Advancement operations, or Mission Engineering Group (v1.2/v1.3/v1.10/v1.11/v1.14, unmodified); it does not authorize Recovery Workflow Automation, which remains gated behind its own future Sprint Owner scope ratification. No other section of this specification is modified.
- v1.16 — Adds Recovery Workflow Automation (Sprint Owner Ratification `NEXUS-RAT-2026-07-17-006`). Defines the Kernel mechanism that reacts to an authoritative `GovernanceDecisionRecorded` Domain Event carrying a Rejected `GovernanceDecision` (RFC-0011) and creates the corresponding Recovery Requirement (v1.12, unmodified) for the exact Engineering Session and Workflow Step resolved through Engineering Decision Correlation's (v1.14, unmodified) existing lookup by `governanceDecisionId`, reusing Recovery Requirement's existing deterministic, idempotent creation contract unmodified. Defines Trigger Authority (`RecoveryRequirementGovernanceDecisionConsumer` owns the sole `EventBus` subscription for this purpose, separate from and non-duplicative of Event-Driven Workflow Advancement's v1.15 subscription for the same event type), the normative event handling flow, Governance Outcome Handling (only Rejected authorizes Recovery Requirement creation; Approved, Deferred, and Escalation Required create none), fail-closed correlation resolution and attribution validation, idempotency and delivery-ordering rules, and explicit architectural boundaries. This amendment does not modify `GovernanceDecision`, Review, Engineering Decision Correlation, Recovery Requirement's existing lifecycle and creation contract, Governance-Gated Advancement, Event-Driven Workflow Advancement, Engineering Session's existing Workflow Advancement operations, or Mission Engineering Group (v1.2/v1.3/v1.10/v1.11/v1.12/v1.14/v1.15, unmodified); it does not authorize recovery-plan generation, automatic recovery execution, Recovery Requirement resolution or withdrawal, or Autonomous Engineering Integration Validation, each of which remains gated behind its own future Sprint Owner scope ratification. No other section of this specification is modified.

---

# Purpose

This specification defines the Execution domain of the Nexus Kernel.

Execution transforms an approved Mission Plan into completed engineering work through deterministic assignment of engineering responsibilities.

Execution SHALL coordinate engineering work.

Execution SHALL NOT redefine engineering intent.

This specification owns:

- Execution
- Execution Strategy
- Execution Roles
- Task Assignment
- Work Coordination
- Execution State

No other specification may redefine these concepts.

---

# Relationship to the Kernel Canon

This specification implements:

- Canon 3 — Mission-Centric Engineering
- Canon 5 — Controlled Mission Evolution
- Canon 7 — Shared Engineering Roles
- Canon 8 — Replaceable Integrations
- Canon 9 — Deterministic Engineering

Where conflicts exist, the Kernel Canon SHALL prevail.

---

# Dependencies

Consumes:

- RFC-0001 Mission Model
- RFC-0002 Evidence Model
- RFC-0003 Shared Reality Projection Model

Owns:

- Execution
- Execution Strategy
- Execution Roles
- Assignment
- Execution State

---

# Design Goals

Execution SHALL:

- remain deterministic
- remain adapter agnostic
- preserve traceability
- preserve explainability
- preserve Mission identity
- preserve engineering responsibility

Execution SHALL coordinate engineering work without altering Mission intent.

---

# Domain Ownership

RFC-0004 exclusively owns:

- Execution
- Execution Strategy
- Execution Role
- Engineering Role Profile
- Assignment
- Assignment Policy
- Execution State
- Execution Session
- Engineering Session
- Workflow Chaining
- Workflow Advancement

Other specifications MAY reference these concepts.

Other specifications SHALL NOT redefine them.

---

# Execution

Execution is the controlled progression of a Mission Plan.

Execution SHALL:

- consume Shared Reality
- execute approved Tasks
- preserve Mission identity
- preserve Task dependencies
- produce attributable outcomes

Execution SHALL NOT modify Mission objectives.

---

# Execution Strategy

Execution Strategy defines how engineering work is coordinated.

Execution Strategy SHALL determine:

- role assignment
- execution ordering
- dependency handling
- concurrency rules
- review requirements

Execution Strategy SHALL remain deterministic.

---

# Execution Roles

Execution SHALL be performed through engineering roles.

Default roles SHALL include:

- Builder
- Reviewer

Additional roles MAY include:

- Security Reviewer
- Performance Reviewer
- Documentation Reviewer
- Accessibility Reviewer
- Test Engineer
- Database Reviewer

Roles define responsibilities.

Roles SHALL remain independent of implementation providers.

---

# Engineering Role Profile

An Engineering Role Profile describes an Execution Role for engineering discovery and presentation purposes.

Every registered Execution Role SHALL have exactly one corresponding Engineering Role Profile.

Engineering Role Profile SHALL provide:

- workflow presentation metadata
- completion presentation metadata
- attribution presentation policy

Engineering Role Profile SHALL support canonical engineering role discoverability and enumeration, so that consumers MAY discover every registered Engineering Role Profile without requiring hard-coded knowledge of specific Execution Roles.

Engineering Role Profile SHALL NOT:

- define execution semantics
- define dispatch eligibility
- define execution lifecycle
- define assignment policy
- define workflow behavior
- define execution sequencing
- define orchestration
- define Adapter routing
- define Adapter selection
- define authorization

Execution Role remains the sole authority for execution semantics, identity, and dispatch eligibility. Engineering Role Profile SHALL NOT replace, wrap, or redefine Execution Role.

Engineering Role Profile SHALL remain Kernel-owned, consistent with Execution Role and Role Registry, so that presentation and discovery metadata remain provider-independent and Host-independent.

This specification describes Engineering Role Profile's architectural responsibilities only. Concrete implementation properties satisfying workflow presentation metadata, completion presentation metadata, and attribution presentation policy are implementation details and MAY evolve without requiring amendment to this specification, provided they continue to satisfy these architectural responsibilities.

This amendment authorizes only the metadata foundation necessary for engineering role discoverability. It does not authorize Workflow Chaining, Assignment Policy, Execution Sessions, a Planner Workflow, Adapter Routing, Adapter Selection, authorization, or any orchestration behavior.

---

# Adapter Independence

Providers execute Roles.

Providers SHALL NOT define:

- Mission behavior
- Execution Strategy
- Repository policies
- Engineering rules
- Task ownership

Providers SHALL remain replaceable.

---

# Assignment

Every Task SHALL be assigned to exactly one execution role.

Multiple Tasks MAY be assigned concurrently.

Assignment SHALL preserve dependency ordering.

Assignments SHALL remain attributable.

---

# Assignment Policy

Assignment policies MAY consider:

- required role
- Adapter capability
- repository configuration
- execution constraints
- human preferences

Policies SHALL remain deterministic.

---

# Task Execution

Tasks SHALL execute only when:

- dependencies are satisfied
- required Shared Reality is available
- applicable policies permit execution

Execution SHALL preserve Task traceability.

---

# Parallel Execution

Independent Tasks MAY execute concurrently.

Tasks possessing dependency relationships SHALL preserve execution order.

Execution Strategy SHALL determine allowable concurrency.

---

# Execution State

Each Task SHALL possess one execution state.

Minimum states SHALL include:

- Pending
- Ready
- Assigned
- Executing
- Awaiting Review
- Completed
- Failed
- Blocked

Execution State SHALL remain observable.

---

# Workflow Chaining

A Workflow Chain is the Kernel-owned, immutable definition of an ordered engineering workflow: a named, ordered sequence of Role-scoped Workflow steps, each step referencing exactly one Execution Role.

## Architectural Responsibilities

Workflow Chain owns:

- chain identity
- ordered workflow steps, each referencing exactly one Execution Role
- workflow topology (the ordering and structure of those steps)

Workflow Chain SHALL remain immutable after creation. It SHALL NOT own mutable runtime state, current execution position, step history, or any other runtime progression concern — those belong to Engineering Session, which executes the Chain (see "Engineering Session" below).

Workflow Chain SHALL NOT itself define: automatic advancement between steps, Assignment Policy evaluation, Review-Gated Progression, Multi-Agent Orchestration, Adapter dispatch, or Task lifecycle transition. Advancing execution through a Workflow Chain is a separate, future orchestration capability requiring its own Sprint Owner ratification; this amendment authorizes only the Chain's structure and identity.

## Relationship to Engineering Session and Execution Session

```text
EngineeringSession
        │
        ▼
WorkflowChain
        │
        ▼
ExecutionSession(s)
```

- `WorkflowChain` defines the ordered sequence of engineering activities (template; immutable).
- `EngineeringSession` coordinates runtime execution of that sequence (runtime progression: active Chain reference, current position, workflow state, workflow execution history).
- `ExecutionSession` records each immutable execution attempt performed within the Engineering Session, exactly as defined below.

---

# Engineering Session

An Engineering Session is the Kernel-owned runtime boundary for one span of AI-assisted engineering work. An Engineering Session executes a Workflow Chain: it owns runtime progression through that Chain's immutable, ordered structure; it does not redefine, wrap, or duplicate the Chain's structural definition.

An Engineering Session MAY contain zero or more Execution Sessions. Each Execution Session remains the authoritative, immutable record of one coordinated execution attempt occurring within that Engineering Session, exactly as defined below; Engineering Session establishes a containment relationship over Execution Sessions and does not redefine, wrap, or duplicate Execution Session's existing semantics.

## Architectural Responsibilities

Engineering Session owns:

- engineering runtime context
- the active Workflow Chain (a reference to the Workflow Chain being executed)
- the current workflow position within that Workflow Chain
- participating Engineering Roles
- workflow state
- workflow execution history
- the session timeline
- session diagnostics
- collaboration metadata

Workflow Chain owns only the immutable definition of the engineering workflow (chain identity, ordered steps, topology). Workflow Chain SHALL NOT own step history or current execution position; those remain Engineering Session's runtime responsibility.

Execution Session owns:

- one coordinated execution attempt
- assigned Execution Role
- assigned Adapter
- execution timestamps
- execution outcome
- produced artifacts

Execution semantics, dispatch eligibility, and execution policies remain owned by this specification's Execution, Execution Strategy, Execution Role, Assignment, Assignment Policy, and Execution State sections. Engineering Session SHALL NOT redefine or duplicate Workflow Chain's structural definition or those execution responsibilities, and SHALL NOT itself define Assignment Policy or Multi-agent Orchestration.

---

# Workflow Advancement

Workflow Advancement is the generalized model for how an Engineering Session's current workflow position moves forward within its bound Workflow Chain.

## Architectural Responsibilities

Workflow Advancement owns:

- Advancement Strategy
- Advancement Trigger
- Advancement Eligibility
- Advancement Authority
- Advancement Result
- Advancement Failure

An **Advancement Strategy** is a named mechanism by which an Engineering Session's current workflow position advances. RFC-0004 defines exactly four Advancement Strategies:

- **Manual Advancement** — an explicit, caller-invoked request to advance exactly one workflow position. Implemented by Sprint 43; unmodified and unexpanded by this amendment.
- **Automatic/Event-Driven Advancement** — advancement evaluated deterministically in response to an Advancement Trigger, without the caller itself deciding or requesting the specific advancement. Not yet implemented; requires its own future Sprint Owner scope ratification.
- **Review-Gated Advancement** — advancement contingent upon a Review Outcome (RFC-0006). Advancement Eligibility for this Strategy additionally requires a **Non-Blocking Review Outcome** (defined below). Gating semantics are defined by v1.5; implemented by Sprint 46.
- **Governance-Gated Advancement** — advancement contingent upon a `GovernanceDecision` (RFC-0011). Advancement Eligibility for this Strategy additionally requires that a `GovernanceDecision` has been produced for the governing evaluation and that it classifies as a **Non-Blocking Governance Decision** (defined below). Gating semantics are defined by this amendment (v1.11); implementation requires its own future Sprint Owner scope ratification.

A **ReviewOutcome** (RFC-0006) is classified as exactly one of:

- **Non-Blocking Review Outcome** — Accepted, Accepted With Observations. A workflow position gated by Review-Gated Advancement MAY advance when the governing Review reaches a Non-Blocking Review Outcome.
- **Blocking Review Outcome** — Action Required, Rejected. A workflow position gated by Review-Gated Advancement SHALL NOT advance when the governing Review reaches a Blocking Review Outcome; the attempt SHALL produce an Advancement Failure.

This classification is owned by RFC-0004 for the sole purpose of Review-Gated Advancement's Advancement Eligibility. It does not modify RFC-0006's `ReviewOutcome` values, semantics, or lifecycle.

A `GovernanceDecision` (RFC-0011) is classified as exactly one of:

- **Non-Blocking Governance Decision** — Approved. A workflow position gated by Governance-Gated Advancement MAY advance when the governing `GovernanceDecision` is Approved and all other eligibility requirements are satisfied.
- **Blocking Governance Decision** — Rejected, Deferred, Escalation Required. A workflow position gated by Governance-Gated Advancement SHALL NOT advance when the governing `GovernanceDecision` is any of these three values; the attempt SHALL produce an Advancement Failure. Rejected, Deferred, and Escalation Required remain semantically distinct `GovernanceDecision` values under RFC-0011 — this amendment classifies all three identically only for the narrow purpose of Governance-Gated Advancement's Blocking/Non-Blocking eligibility test; it does not collapse, rename, or reinterpret their distinct RFC-0011 meanings, and does not authorize any differentiated downstream treatment (such as a Recovery Requirement record or a persisted Deferred/Escalation-Required Engineering Session state) without its own future Sprint Owner scope ratification.

This classification is owned by RFC-0004 for the sole purpose of Governance-Gated Advancement's Advancement Eligibility. It does not modify RFC-0011's `GovernanceDecision` values, semantics, lifecycle, or production, and does not permit `GovernanceService` to mutate Engineering Session state as a side effect of producing a `GovernanceDecision`.

## Recovery-Gated Re-Advancement Eligibility

For a workflow position governed by Governance-Gated Advancement whose governing `GovernanceDecision` is Rejected (a Blocking Governance Decision), Advancement Eligibility SHALL be classified according to the status of the Recovery Requirement (RFC-0004 v1.12) associated with the exact (Mission, Engineering Session, Workflow Step, `GovernanceDecision`) combination governing that position:

| Recovery Requirement State | Advancement Eligibility |
| --- | --- |
| Missing (none created) | Blocking |
| Open | Blocking |
| Resolved | Eligible for normal advancement evaluation |
| Withdrawn | Blocking |

A Resolved Recovery Requirement SHALL NOT change, supersede, or reinterpret the originating Rejected `GovernanceDecision`. The `GovernanceDecision` remains Rejected, immutable, and fully attributable (RFC-0011, unmodified). A Resolved Recovery Requirement SHALL provide an additional, independent advancement-eligibility input demonstrating that the remediation obligation created from that decision has been authoritatively satisfied — it does not reclassify the decision itself.

Recovery-Gated Re-Advancement Eligibility SHALL apply only when all of the following hold:

- the Recovery Requirement's status is Resolved;
- the reference required by the existing Recovery Resolution Contract (v1.12, unmodified) — an immutable reference to the authoritative accepted engineering outcome demonstrating that remediation has completed — is present, and is the reference that resolved that exact Recovery Requirement;
- the Recovery Requirement's Mission, Engineering Session, Workflow Step, and originating `GovernanceDecision` identity references all match the workflow position being evaluated for advancement.

An accepted engineering outcome that resolved a different Recovery Requirement, or that is otherwise unrelated to the exact combination under evaluation, SHALL NOT satisfy this eligibility path.

A Resolved status SHALL NOT itself produce an Advancement Result. It SHALL only restore Advancement Eligibility for evaluation by Governance-Gated Advancement's existing Advancement Authority; every other Advancement Eligibility precondition defined by this section SHALL still be satisfied before an Advancement Result may be produced.

Withdrawn Recovery Requirements are explicitly excluded from this eligibility path: withdrawal demonstrates only that a Recovery Requirement ceased to apply through separate authority (for example, a superseding Repository Policy Ratification), not that the originating rejected engineering condition was remediated. Extending advancement eligibility to a Withdrawn Recovery Requirement requires its own independent future RFC amendment and Sprint Owner ratification.

Deferred and Escalation Required `GovernanceDecision` values remain Blocking exactly as this amendment (v1.11, unmodified) defines and are unaffected by Recovery-Gated Re-Advancement Eligibility: v1.12 creates no Recovery Requirement for either value, so this eligibility path never applies to them.

This subsection does not modify `GovernanceDecision`'s value, semantics, lifecycle, or production (RFC-0011, unmodified); does not modify Recovery Requirement's own lifecycle, ownership, Recovery Resolution Contract, or Recovery Withdrawal Contract (v1.12, unmodified); does not mutate Workflow Chain topology or Workflow Step definitions; does not modify Mission completion preconditions (RFC-0001, unmodified; Governed Mission Completion remains separately unauthorized); and does not introduce a new Advancement Authority — Governance-Gated Advancement's existing Advancement Authority (v1.11, unmodified) applies unchanged to evaluation under this eligibility path.

An **Advancement Trigger** is the deterministic condition or reported fact that causes an Advancement Strategy to evaluate Advancement Eligibility.

**Advancement Eligibility** is the deterministic precondition set that SHALL be satisfied before any Advancement Strategy advances a workflow position, at minimum: a Workflow Chain is bound; the current workflow position is valid within that Chain; the current workflow position is not the Chain's terminal position.

**Advancement Authority** is the entity or mechanism authorized to invoke or trigger a given Advancement Strategy. Each Advancement Strategy's own defining Sprint Owner ratification SHALL state its Advancement Authority.

An **Advancement Result** is the deterministic outcome of a successful advancement: the new current workflow position.

An **Advancement Failure** is the deterministic rejection of an ineligible advancement attempt. The current workflow position SHALL remain unchanged after an Advancement Failure.

Workflow Advancement SHALL remain deterministic: equivalent Engineering Session state and equivalent Advancement Trigger input SHALL always produce equivalent Advancement Results or Advancement Failures.

Workflow Advancement SHALL NOT define Assignment Policy evaluation, Review Outcome semantics, Governance Decision semantics or production, Multi-Agent Orchestration, Adapter dispatch, or Task lifecycle transition; those remain owned by their respective sections.

This section does not modify Engineering Session's existing ownership of runtime progression (current workflow position, workflow state, workflow execution history), established by v1.2 and v1.3; it organizes and names the strategies by which that progression occurs.

---

# Workflow Chain Execution

A Workflow Chain Execution is the act of executing the Workflow Step at an Engineering Session's current workflow position, distinct from Workflow Advancement, which only moves that position.

## Architectural Responsibilities

Workflow Chain Execution owns:

- resolving the current Workflow Step's referenced Execution Role;
- invoking this specification's existing Execution Strategy to evaluate execution readiness;
- dispatching through the existing Adapter contract (explicit `adapterId` only — no Adapter Selection, per the standing guardrail established by Sprint 20's Ratification);
- returning the execution outcome to the existing Workflow Advancement process.

Execution is recorded through the existing Execution Session model, in accordance with its existing ownership and lifecycle. This amendment SHALL NOT redefine when an Execution Session is created, updated, completed, or persisted; Execution Session remains the normative owner of its own lifecycle.

Workflow Chain Execution SHALL NOT own:

- Review evaluation or Review Outcome determination;
- Assignment Policy;
- Adapter Selection;
- Task lifecycle transition;
- Execution Session lifecycle;
- Multi-Agent Orchestration;
- any Advancement Strategy.

Those remain owned by their respective sections, unmodified. Execution outcome consumption by Workflow Advancement (for example, Review-Gated Advancement reading a resulting Review Outcome) remains governed entirely by the existing Workflow Advancement section, unmodified.

Workflow Chain Execution SHALL reuse the previously certified Engineering Session, Workflow Chain, Execution Strategy, Adapter Runtime, Workflow Advancement, and Review-Gated Advancement without modifying their existing semantics. It introduces execution of the current Workflow Step only; no new workflow behavior is authorized by this amendment.

Workflow Chain Execution SHALL remain deterministic and provider-agnostic, consistent with this specification's existing Execution Strategy and Adapter Contract guarantees.

This amendment intentionally preserves future compatibility with Assignment Policy, Session Recovery/Checkpointing, Concurrent Session Coordination, and Multi-Agent Engineering Orchestration. None of these capabilities are introduced or implied by Workflow Chain Execution.

## Assignment Policy Evaluation

Workflow Chain Execution MAY accept a caller-supplied Assignment Policy reference alongside its existing execution inputs.

When an Assignment Policy reference is supplied, Workflow Chain Execution SHALL invoke that Assignment Policy's existing deterministic evaluation, supplying the resolved Workflow Step's Execution Role and the caller-supplied evaluation input, before Adapter dispatch.

When the evaluation is not satisfied, Workflow Chain Execution SHALL reject execution deterministically: no Adapter dispatch SHALL occur and no Execution Session record SHALL be created.

When no Assignment Policy reference is supplied, Workflow Chain Execution SHALL proceed exactly as defined by this specification's v1.6 amendment, unchanged.

This section SHALL NOT redefine Assignment Policy's own value objects, evaluation semantics, or determinism guarantees; those remain exclusively owned by this specification's Assignment Policy section, unmodified. This section owns only the consumption point at which that evaluation gates Workflow Chain Execution's existing dispatch step.

This section SHALL NOT introduce Assignment Policy selection, inference, or automatic binding to a Workflow Step; the Assignment Policy reference SHALL be supplied explicitly by the caller.

---

# Session Recovery/Checkpointing

Session Recovery/Checkpointing defines how an Engineering Session's runtime state MAY be captured and later reconstituted, distinct from and reusing Engineering Session's existing snapshot and reconstitution contract (v1.2/v1.3, Sprint 39, unmodified).

## Architectural Responsibilities

Session Recovery/Checkpointing owns:

- Checkpoint capture;
- Recovery from a Checkpoint.

A **Checkpoint** is a named, immutable, point-in-time capture of an Engineering Session's existing runtime snapshot. A Checkpoint SHALL NOT itself define or duplicate Engineering Session's snapshot structure; it SHALL capture that structure exactly as Engineering Session's existing `toSnapshot()` contract produces it, together with a Checkpoint identity and capture timestamp.

**Recovery** is the act of reconstituting an Engineering Session from a given Checkpoint through Engineering Session's existing, unmodified reconstitution contract (`fromSnapshot()`).

Recovery SHALL reconstruct an Engineering Session that is semantically equivalent to the captured Checkpoint, preserving all RFC-defined state, workflow progression, workflow execution history, timeline, diagnostics, and architectural invariants. Implementation-specific object identity, memory layout, or serialization format are not part of this contract.

Checkpoint capture and Recovery SHALL remain deterministic: capturing a Checkpoint from a given Engineering Session, then recovering from that Checkpoint, SHALL always produce a semantically equivalent Engineering Session.

Session Recovery/Checkpointing SHALL NOT own:

- Engineering Session's existing snapshot or reconstitution semantics, workflow state, timeline, or diagnostics, all of which remain owned by Engineering Session (v1.2/v1.3, unmodified);
- Concurrent Session Coordination;
- Multi-Agent Engineering Orchestration;
- automatic or triggered checkpointing;
- Checkpoint retention, pruning, or expiry policy;
- cross-session Checkpoint sharing.

Those remain either owned by their respective sections, unmodified, or unauthorized and reserved for future Sprint Owner scope ratification.

---

# Concurrent Session Coordination

Concurrent Session Coordination defines how multiple Engineering Sessions MAY coexist within the Kernel, remain independently executable, and be observed through provider-neutral Kernel services.

This amendment formalizes concurrent session visibility and coordination. It SHALL NOT redefine Engineering Session ownership, runtime semantics, or snapshot/Recovery behavior established by previously approved vertical slices (v1.2/v1.3, Sprint 39, unmodified; v1.8 Session Recovery/Checkpointing, Sprint 49, unmodified).

## Architectural Responsibilities

Concurrent Session Coordination owns:

- concurrent visibility of Engineering Sessions;
- enumeration of Engineering Sessions that remain eligible for further progression;
- observation of concurrent Engineering Session lifecycle;
- provider-neutral coordination of multiple independent Engineering Sessions;
- repository-level guarantees that operations on one Engineering Session SHALL NOT observe or mutate the runtime state of another Engineering Session.

Concurrent Session Coordination SHALL NOT own:

- Engineering Session's existing runtime state, workflow position, timeline, or diagnostics (v1.2/v1.3, unmodified);
- Workflow Chain ownership;
- Workflow Advancement;
- Assignment Policy;
- Execution Strategy;
- Execution Session lifecycle;
- Session Recovery/Checkpointing's Checkpoint capture or Recovery semantics (v1.8, unmodified);
- single-session mutation ordering;
- optimistic concurrency or locking semantics;
- distributed coordination;
- Multi-Agent Engineering Orchestration;
- cross-session synchronization.

Those capabilities remain owned by their previously ratified RFC sections or remain explicitly deferred, unauthorized, and reserved for future Sprint Owner scope ratification.

Multiple Engineering Sessions existing concurrently SHALL remain fully isolated from one another: an operation performed against one Engineering Session SHALL NOT observe or mutate the runtime state of another. Engineering Session visibility (enumeration and active-session discovery) SHALL remain deterministic.

This specification intentionally defines architectural capabilities rather than specific APIs; public service operations exposing concurrent session visibility remain an implementation detail defined by the corresponding Sprint Implementation Record.

---

# Multi-Agent Engineering Orchestration Foundation

Multi-Agent Engineering Orchestration Foundation defines the structural relationships through which multiple independent Engineering Sessions MAY participate in the execution of a single Mission, while preserving complete Engineering Session independence.

This section establishes orchestration **structure**, not orchestration **intelligence**. It provides the minimum relationships upon which future autonomous orchestration capabilities may safely evolve; it does not itself introduce any autonomous, dynamic, or negotiated behavior.

## Architectural Responsibilities

Multi-Agent Engineering Orchestration Foundation owns:

- **Mission Engineering Group** — the deterministic association between a Mission and the set of Engineering Sessions participating in it;
- enumeration of a Mission's participating Engineering Sessions;
- **Engineering Session Handoff** — an explicit, immutable record that engineering responsibility for a Mission passed from one Engineering Session (and its assigned Execution Role) to another;
- deterministic Handoff lifecycle state (for example, recorded and reconciled with the participating Engineering Sessions);
- orchestration visibility (observing which Engineering Sessions participate in a Mission and the Handoffs recorded between them);
- orchestration diagnostics for invalid or unauthorized Handoff attempts.

A Mission Engineering Group SHALL NOT duplicate, override, or supersede any individual Engineering Session's existing runtime state, workflow position, timeline, or diagnostics (v1.2/v1.3, unmodified). It is a structural association only.

An Engineering Session Handoff SHALL reference two existing, unmodified Engineering Sessions; it SHALL NOT itself execute a Workflow Step, advance a workflow position, evaluate an Assignment Policy, or dispatch an Adapter. Recording a Handoff is an observational, structural fact — not an orchestration action.

Multi-Agent Engineering Orchestration Foundation SHALL NOT own:

- Engineering Session's existing runtime state, snapshot/reconstitution semantics, workflow state, timeline, or diagnostics (v1.2/v1.3, unmodified);
- Session Recovery/Checkpointing's Checkpoint capture or Recovery semantics (v1.8, unmodified);
- Concurrent Session Coordination's visibility and isolation guarantees (v1.9, unmodified);
- Workflow Chain, Workflow Advancement, or Workflow Chain Execution (v1.3/v1.4/v1.6/v1.7, unmodified);
- Assignment Policy or Assignment Policy Evaluation (v1.3/v1.7, unmodified);
- Execution Strategy or Execution Session (unmodified);
- autonomous planning, dynamic workflow generation, or AI deliberation;
- agent-to-agent messaging or negotiation;
- scheduling algorithms, load balancing, or parallel execution semantics;
- distributed orchestration or execution synchronization primitives;
- dynamic Assignment Policy or automatic Adapter Selection;
- Governance Engine capabilities.

Those capabilities remain owned by their previously ratified RFC sections or remain explicitly deferred, unauthorized, and reserved for future Sprint Owner scope ratification.

Multiple Engineering Sessions participating in a shared Mission Engineering Group SHALL remain as fully isolated from one another as required by Concurrent Session Coordination (v1.9): recording a Mission Engineering Group association, enumerating it, or recording an Engineering Session Handoff SHALL NOT mutate or observe any participating Engineering Session's runtime state.

This specification intentionally defines architectural capabilities rather than specific APIs; public service operations exposing Mission Engineering Group and Handoff behavior remain an implementation detail defined by the corresponding Sprint Implementation Record.

---

# Recovery Requirement

A Recovery Requirement is the explicit, attributable record that a Rejected `GovernanceDecision` (RFC-0011) has generated engineering remediation work, distinct from and owned independently of the `GovernanceDecision` itself.

## Architectural Responsibilities

Recovery Requirement owns:

- Recovery Requirement identity;
- association with the Mission, Engineering Session, Workflow Step, and `GovernanceDecision` that produced it;
- the Recovery Requirement lifecycle and its deterministic status transitions.

### Identity and Uniqueness

A Recovery Requirement SHALL possess an immutable identity, assigned at creation and never reassigned.

Creation SHALL be deterministic and idempotent. For a given combination of Mission, Engineering Session, Workflow Step, and `GovernanceDecision`, the Kernel SHALL create at most one Recovery Requirement. Repeated handling of the same Rejected `GovernanceDecision` (for example, duplicate event delivery or repeated invocation) SHALL return the existing Recovery Requirement and SHALL NOT create a duplicate record.

A new Recovery Requirement MAY be created only when a distinct `GovernanceDecision` produces a new Rejection for that combination.

### Required Attribution

Every Recovery Requirement SHALL preserve immutable references to:

- Mission identity;
- Engineering Session identity;
- Workflow Step identity;
- the originating `GovernanceDecision` identity;
- a creation timestamp;
- creation causality and correlation identifiers, where available, consistent with the existing Domain Event envelope (RFC-0005).

A Recovery Requirement SHALL NOT duplicate or reinterpret `GovernanceDecision` diagnostics; it references the originating `GovernanceDecision` by identity and SHALL NOT copy, restate, or re-derive its Policy Criteria results, Evidence references, or evaluation diagnostics (RFC-0011, unmodified).

### Creation

A Recovery Requirement MAY be created only when the governing `GovernanceDecision` is **Rejected**.

- **Deferred** remains a Blocking Governance Decision under Governance-Gated Advancement (v1.11, unmodified); it SHALL NOT create a Recovery Requirement. Per RFC-0011, a Deferred Governance Decision resolves automatically once its missing input becomes available — it is not remediation work.
- **Escalation Required** remains a Blocking Governance Decision under Governance-Gated Advancement (v1.11, unmodified); it SHALL NOT create a Recovery Requirement. Per RFC-0011, resolution requires a new or amended Repository Policy Ratification or direct Sprint Owner decision — external authority, not automatic recovery.
- **Approved** SHALL NOT create a Recovery Requirement.

Creation of a Recovery Requirement SHALL NOT alter the governing `GovernanceDecision`'s value, semantics, or lifecycle (RFC-0011, unmodified), and SHALL NOT be performed by `GovernanceService`; `GovernanceService` SHALL NOT own, create, or mutate Recovery Requirement state as a side effect of producing a `GovernanceDecision`.

### Lifecycle

A Recovery Requirement SHALL be exactly one of the following statuses at any time:

- **Open** — remediation work is outstanding; the initial status upon creation.
- **Resolved** — remediation work has been completed and deterministically recorded.
- **Withdrawn** — the Recovery Requirement no longer applies (for example, a superseding Repository Policy Ratification or a corrected upstream input resolves the underlying Rejection without remediation).

Status transitions SHALL be deterministic and explicit:

```text
Open → Resolved
Open → Withdrawn
```

A Resolved or Withdrawn Recovery Requirement is terminal and SHALL NOT transition further.

### Boundaries

Recovery Requirement SHALL NOT:

- generate remediation plans, steps, or content through AI or any automated planning mechanism;
- mutate Workflow Chain topology, Workflow Step definitions, or Workflow Chain Execution (unmodified);
- be owned, created, or mutated by `GovernanceService`, `GovernanceDecision`, or `GovernanceEscalation` (RFC-0011, unmodified);
- redefine or reinterpret any `GovernanceDecision` value's meaning, precondition, or permitted downstream effect (RFC-0011, unmodified);
- introduce a differentiated Engineering Session state for Deferred or Escalation Required beyond Governance-Gated Advancement's existing uniform Blocking classification (v1.11, unmodified);
- mutate Mission objective, Mission intent, or Mission completion preconditions (RFC-0001, unmodified; Governed Mission Completion remains a separately unauthorized future capability);
- touch `src/hosts` or `src/adapters`.

This section does not modify Workflow Advancement's existing Advancement Strategy, Advancement Eligibility, Advancement Result, or Advancement Failure ownership (v1.4/v1.5/v1.11, unmodified); Recovery Requirement is a distinct, additional record created alongside a Rejected Governance-Gated Advancement Failure, not a redefinition of that Advancement Failure.

---

# Engineering Decision Correlation

An Engineering Decision Correlation is the explicit, attributable, append-only record correlating a governed Workflow position — a Mission, Engineering Session, and Workflow Step combination — with the Review (RFC-0006) and `GovernanceDecision` (RFC-0011) subsequently produced for it.

Review and `GovernanceDecision` are Mission-scoped only, by design (RFC-0006/RFC-0011, unmodified; Mission-scoped-only Governance state reaffirmed by `NEXUS-RAT-2026-07-16-016`). Neither carries Engineering Session or Workflow Step identity. Engineering Decision Correlation exists solely to make that missing inbound attribution deterministically resolvable, without adding runtime-topology ownership to Review or `GovernanceDecision` themselves.

## Architectural Responsibilities

Engineering Decision Correlation owns:

- Engineering Decision Correlation identity;
- immutable attribution to the Mission, Engineering Session, and Workflow Step that requested or initiated Review;
- append-only association of that attribution with the resulting Review identity, and subsequently the resulting `GovernanceDecision` identity;
- deterministic, fail-closed, bidirectional lookup between a governed Workflow position and its Review/`GovernanceDecision`.

Engineering Decision Correlation SHALL NOT own Review production, Review Outcome determination, `GovernanceDecision` production, `GovernanceDecision` values or semantics, Workflow Advancement, Workflow mutation, or Recovery Requirement creation. Those remain owned by their respective sections and RFCs, unmodified.

### Identity and Attribution

An Engineering Decision Correlation SHALL possess an immutable identity, assigned at creation and never reassigned.

An Engineering Decision Correlation SHALL be created with, and preserve for its lifetime, immutable references to:

- Mission identity;
- Engineering Session identity;
- Workflow Step identity;
- a creation timestamp;
- creation causality and correlation identifiers, where available, consistent with the existing Domain Event envelope (RFC-0005).

Mission attribution SHALL be resolved the same way established by RFC-0004 v1.13/`NEXUS-RAT-2026-07-16-019` for `EngineeringSessionWorkflowAdvanced`: exclusively through the existing Mission Engineering Group association (v1.10, unmodified), never caller-supplied and never inferred from Review or `GovernanceDecision`.

### Append-Only Association

After creation, an Engineering Decision Correlation MAY be extended, in order, with:

1. a `reviewId`, once the Review requested for that Workflow position is created;
2. a `governanceDecisionId`, once Governance evaluation produces a decision for that Review.

Each association SHALL be recorded exactly once per Engineering Decision Correlation and SHALL be immutable once recorded: a previously recorded `reviewId` or `governanceDecisionId` SHALL NOT be rewritten, replaced, or removed.

An association SHALL be rejected, deterministically and without partial effect, when the referenced Review's or `GovernanceDecision`'s own `missionId` does not exactly equal the Engineering Decision Correlation's Mission identity.

### Creation Authority

Engineering Decision Correlation creation SHALL be invoked only by a caller that authoritatively possesses the Mission, Engineering Session, and Workflow Step identities together at the moment of creation. This amendment does not identify that caller; consistent with Advancement Authority's existing pattern (this section, above), the authorizing Sprint Owner ratification for Engineering Decision Correlation's implementing Sprint SHALL state its Creation Authority.

Engineering Decision Correlation creation SHALL NOT be inferred by an `EventBus` consumer guessing from Mission identity alone, supplied by a Host command as an unverified value, or derived by Review or Governance code asserting runtime-topology ownership it does not possess.

### Lookup

Engineering Decision Correlation SHALL support deterministic, read-only resolution in both directions:

- from a `reviewId` or `governanceDecisionId` to the Mission, Engineering Session, and Workflow Step attribution that produced it;
- from a Mission, Engineering Session, and Workflow Step combination to its associated `reviewId` and `governanceDecisionId`, where recorded.

Lookup SHALL fail closed — returning a deterministic absence result, never a guessed or partial match — when no Engineering Decision Correlation exists for the supplied reference, when resolving a reference would require selecting among more than one Engineering Decision Correlation without a uniquely-identifying key, or when a supplied Review or `GovernanceDecision` reference belongs to a Mission different from the Engineering Decision Correlation being resolved. No fallback inference is authorized.

### Boundaries

Engineering Decision Correlation SHALL NOT:

- redefine or reinterpret Review or `GovernanceDecision` values, semantics, lifecycle, or production (RFC-0006/RFC-0011, unmodified);
- add Engineering Session or Workflow Step fields to Review or `GovernanceDecision` (RFC-0006/RFC-0011, unmodified);
- mutate Engineering Session, Workflow Chain, Mission Engineering Group, or Recovery Requirement state (v1.2/v1.3/v1.10/v1.12, unmodified);
- become a general-purpose relationship graph, routing policy, orchestration engine, or replacement for Domain Events;
- duplicate runtime state already owned by Engineering Session or `EngineeringSessionStateProjection`;
- itself trigger Workflow Advancement, Review evaluation, Governance evaluation, or Recovery Requirement creation — it is a correlation record only, consumed by those capabilities' own future Sprints;
- touch `src/hosts` or `src/adapters`.

This section does not modify Review-Gated Advancement, Governance-Gated Advancement, Recovery-Gated Re-Advancement Eligibility, Recovery Requirement, Engineering Session, Workflow Chain, or Mission Engineering Group (v1.5/v1.10/v1.11/v1.12/v1.13, unmodified). It does not authorize Event-Driven Workflow Advancement or Recovery Workflow Automation; each remains gated behind its own future Sprint Owner scope ratification, which MAY now consume Engineering Decision Correlation as its attribution source.

---

# Event-Driven Workflow Advancement

Event-Driven Workflow Advancement is the Kernel mechanism that reacts to an authoritative `GovernanceDecisionRecorded` Domain Event (RFC-0005) and invokes Governance-Gated Advancement (v1.11, unmodified) for the exact Engineering Session and Workflow Step correlated with that Governance Decision through Engineering Decision Correlation (this specification, above).

Event-Driven Workflow Advancement SHALL reuse, unmodified:

- `GovernanceDecisionRecorded`;
- Engineering Decision Correlation;
- Governance-Gated Advancement's existing Advancement Eligibility and Advancement Authority rules;
- Engineering Session's existing Workflow Advancement operations.

Event-Driven Workflow Advancement SHALL NOT redefine `GovernanceDecision` semantics, Review semantics, Governance-Gated Advancement's existing Advancement Eligibility, Engineering Decision Correlation ownership, or Engineering Session's existing state ownership.

## Trigger Authority

Exactly one Kernel component SHALL own the `EventBus` subscription to `GovernanceDecisionRecorded` for the purpose of Event-Driven Workflow Advancement. No Host, Adapter, Review capability, Governance capability, projection, or other caller SHALL independently trigger Event-Driven Workflow Advancement. Exactly one effective subscription for this purpose SHALL exist within one Kernel composition. Direct, caller-invoked advancement (Manual Advancement, v1.0, and existing test/administrative call paths) MAY remain available and is not a second Event-Driven Workflow Advancement subscription path.

## Event Handling

Upon receiving a `GovernanceDecisionRecorded` event, Event-Driven Workflow Advancement SHALL, in order: validate the event; resolve the referenced `GovernanceDecision`; resolve its Engineering Decision Correlation; obtain the correlation's authoritative Mission, Engineering Session, and Workflow Step attribution; validate attribution consistency between the event, the `GovernanceDecision`, and the correlation; and invoke Governance-Gated Advancement's existing Advancement Authority through Engineering Session's existing Workflow Advancement operations. Event-Driven Workflow Advancement SHALL coordinate these existing capabilities only; it SHALL NOT mutate `GovernanceDecision`, Review, Engineering Decision Correlation, Mission Engineering Group, or Engineering Session state directly.

Only an Approved `GovernanceDecision` (a Non-Blocking Governance Decision, v1.11, unmodified) MAY result in advancement through Governance-Gated Advancement's existing rules. Event-Driven Workflow Advancement SHALL NOT duplicate or reinterpret the Blocking/Non-Blocking classification already owned by v1.11. For Rejected, Deferred, or Escalation Required `GovernanceDecision` values, Event-Driven Workflow Advancement SHALL produce a deterministic non-advancing result; these values SHALL NOT be treated as technical failures. Recovery behavior for a Rejected `GovernanceDecision` remains owned by Recovery Requirement (v1.12) and Recovery Workflow Automation's own future Sprint; Event-Driven Workflow Advancement SHALL NOT create a Recovery Requirement.

## Correlation Resolution and Fail-Closed Behavior

Event-Driven Workflow Advancement SHALL resolve Engineering Session and Workflow Step attribution exclusively through Engineering Decision Correlation's existing lookup by `governanceDecisionId`. Caller-supplied Engineering Session, Workflow Step, or Mission identity SHALL NOT be accepted as a substitute for this resolution, and no Engineering Session enumeration or inference is authorized. If no Engineering Decision Correlation exists for a `GovernanceDecision`, or resolution would require selecting among more than one Engineering Decision Correlation, Event-Driven Workflow Advancement SHALL fail closed: no Workflow advancement, no aggregate mutation, and no Recovery Requirement creation SHALL occur, and this outcome SHALL be an attribution failure, not a silent successful no-op. Before invoking advancement, Event-Driven Workflow Advancement SHALL additionally verify that the event's Mission identity, the `GovernanceDecision`'s Mission identity, and the correlation's Mission identity are identical, and that the correlated Engineering Session and Workflow Step match the runtime position governed by the `GovernanceDecision`; any mismatch SHALL fail closed with no fallback attribution.

## Idempotency and Ordering

Repeated delivery of the same `GovernanceDecisionRecorded` event SHALL NOT advance the same Workflow position more than once, using existing authoritative Engineering Session state and event identity to establish idempotency. Event-Driven Workflow Advancement SHALL process events in the existing `EventBus`'s delivery order and SHALL NOT introduce event reordering, timestamp-based sequencing, parallel consumption, retry queues, dead-letter queues, or durable delivery infrastructure; where an event is delivered before its required Engineering Decision Correlation exists, Event-Driven Workflow Advancement SHALL fail closed rather than buffer or automatically retry. Durable delivery and retry semantics require their own future Sprint Owner scope ratification.

## Boundaries

Event-Driven Workflow Advancement SHALL NOT modify `GovernanceDecision`, Review, Engineering Decision Correlation, `EngineeringSessionStateProjection`, Workflow Chain topology, or Mission Engineering Group; create a Recovery Requirement; evaluate Repository Policy; evaluate Review Outcome; select an Adapter; execute a Workflow Step; or introduce a Host command or Adapter behavior. This section does not modify Governance-Gated Advancement, Recovery Requirement, Recovery-Gated Re-Advancement Eligibility, Engineering Session, Workflow Chain, Mission Engineering Group, or Engineering Decision Correlation (v1.10/v1.11/v1.12/v1.13/v1.14, unmodified). It does not authorize Recovery Workflow Automation, which remains gated behind its own future Sprint Owner scope ratification.

---

# Recovery Workflow Automation

Recovery Workflow Automation is the Kernel mechanism that reacts to an authoritative `GovernanceDecisionRecorded` Domain Event (RFC-0005) carrying a Rejected `GovernanceDecision` (RFC-0011) and creates the corresponding Recovery Requirement (v1.12, unmodified) for the exact Engineering Session and Workflow Step correlated with that Governance Decision through Engineering Decision Correlation (v1.14, unmodified).

Recovery Workflow Automation SHALL reuse, unmodified:

- `GovernanceDecisionRecorded`;
- Engineering Decision Correlation;
- Recovery Requirement's existing deterministic, idempotent creation contract and lifecycle (v1.12, unmodified);
- `RecoveryRequirementGovernanceDecisionConsumer`'s existing structure.

Recovery Workflow Automation SHALL NOT redefine `GovernanceDecision` semantics, Review semantics, Recovery Requirement's existing lifecycle or creation contract, Engineering Decision Correlation ownership, Event-Driven Workflow Advancement (v1.15, unmodified), or Engineering Session's existing state ownership.

## Trigger Authority

`RecoveryRequirementGovernanceDecisionConsumer` SHALL own the `EventBus` subscription to `GovernanceDecisionRecorded` for the purpose of Recovery Workflow Automation. No Host, Adapter, Review capability, Governance capability, projection, or other caller SHALL independently trigger Recovery Workflow Automation. Exactly one effective subscription for this purpose SHALL exist within one Kernel composition. This subscription is separate from, and SHALL NOT duplicate the responsibility of, Event-Driven Workflow Advancement's (v1.15) subscription to the same event type: `GovernanceGatedWorkflowAdvancementConsumer` SHALL NOT create a Recovery Requirement, and `RecoveryRequirementGovernanceDecisionConsumer` SHALL NOT advance Workflow state. The consumer MAY retain a direct, caller-invoked handling method for tests or explicit invocation; this is not a second Recovery Workflow Automation subscription path.

## Event Handling

Upon receiving a `GovernanceDecisionRecorded` event, Recovery Workflow Automation SHALL, in order: validate the event; resolve the referenced `GovernanceDecision`; verify its outcome is Rejected; resolve its Engineering Decision Correlation; obtain the correlation's authoritative Mission, Engineering Session, and Workflow Step attribution; validate attribution consistency between the event, the `GovernanceDecision`, and the correlation; and invoke Recovery Requirement's existing creation path. Recovery Workflow Automation SHALL coordinate these existing capabilities only; it SHALL NOT construct or persist a Recovery Requirement directly, and it SHALL NOT mutate `GovernanceDecision`, Review, Engineering Decision Correlation, Mission Engineering Group, or Engineering Session state.

## Governance Outcome Handling

Only a Rejected `GovernanceDecision` SHALL authorize Recovery Requirement creation through Recovery Requirement's existing creation path. Approved, Deferred, and Escalation Required `GovernanceDecision` values SHALL NOT create a Recovery Requirement and SHALL produce a deterministic no-recovery result; these SHALL NOT be treated as technical failures. Recovery Workflow Automation SHALL NOT duplicate or reinterpret the Rejected/Deferred/Escalation Required classification already owned by v1.11/v1.12.

## Correlation Resolution and Fail-Closed Behavior

Recovery Workflow Automation SHALL resolve Engineering Session and Workflow Step attribution exclusively through Engineering Decision Correlation's existing lookup by `governanceDecisionId`. Caller-supplied Engineering Session, Workflow Step, or Mission identity SHALL NOT be accepted as a substitute for this resolution, and no Engineering Session enumeration or inference is authorized. If no Engineering Decision Correlation exists for a `GovernanceDecision`, or resolution would require selecting among more than one Engineering Decision Correlation, Recovery Workflow Automation SHALL fail closed: no Recovery Requirement creation and no aggregate mutation SHALL occur, and this outcome SHALL be an attribution failure, not a silent successful no-op. Before invoking Recovery Requirement creation, Recovery Workflow Automation SHALL additionally verify that the event's Mission identity, the `GovernanceDecision`'s Mission identity, and the correlation's Mission identity are identical, and that the correlated Engineering Session and Workflow Step match the runtime position governed by the `GovernanceDecision`; any mismatch SHALL fail closed with no fallback attribution.

## Idempotency and Ordering

Repeated delivery of the same `GovernanceDecisionRecorded` event SHALL NOT create more than one Recovery Requirement for the same (Mission, Engineering Session, Workflow Step, `GovernanceDecision`) combination, using Recovery Requirement's existing deterministic creation key and event identity to establish idempotency; a repeated handling attempt SHALL return the existing Recovery Requirement. Recovery Workflow Automation SHALL process events in the existing `EventBus`'s delivery order and SHALL NOT introduce event reordering, timestamp-based sequencing, parallel consumption, retry queues, dead-letter queues, or durable delivery infrastructure; where an event is delivered before its required Engineering Decision Correlation exists, Recovery Workflow Automation SHALL fail closed rather than buffer or automatically retry. Durable delivery and retry semantics require their own future Sprint Owner scope ratification.

## Boundaries

Recovery Workflow Automation SHALL NOT modify `GovernanceDecision`, Review, Engineering Decision Correlation, `EngineeringSessionStateProjection`, Workflow Chain topology, or Mission Engineering Group; advance Workflow state; resolve or withdraw a Recovery Requirement; generate remediation plans through AI; evaluate Repository Policy; evaluate Review Outcome; select an Adapter; execute a Workflow Step; or introduce a Host command or Adapter behavior. This section does not modify Recovery Requirement's existing lifecycle and creation contract, Governance-Gated Advancement, Event-Driven Workflow Advancement, Recovery-Gated Re-Advancement Eligibility, Engineering Session, Workflow Chain, Mission Engineering Group, or Engineering Decision Correlation (v1.10/v1.11/v1.12/v1.13/v1.14/v1.15, unmodified). It does not authorize Autonomous Engineering Integration Validation, which remains gated behind its own future Sprint Owner scope ratification.

---

# Execution Session

An Execution Session represents one coordinated execution attempt.

Execution Sessions SHALL record:

- assigned role
- assigned adapter
- execution timestamps
- consumed Projection version
- produced artifacts
- execution outcome

Execution Sessions SHALL remain immutable.

---

# Produced Artifacts

Execution MAY produce:

- source code
- tests
- documentation
- configuration
- review requests

Produced artifacts SHALL remain attributable.

Produced artifacts SHALL NOT become authoritative Evidence until accepted through the engineering workflow.

---

# Failure Handling

Execution failures SHALL NOT modify Mission identity.

Failures MAY result in:

- retry
- reassignment
- Mission evolution
- developer intervention

Failure handling SHALL preserve traceability.

---

# Explainability

Every execution decision SHALL identify:

- responsible role
- assigned adapter
- consumed Shared Reality
- executed Task
- produced outcome

Execution SHALL remain reproducible.

---

# Human Authority

Human participants MAY:

- approve execution
- reject execution
- cancel execution
- modify assignment policies

Human authority SHALL supersede automated execution decisions.

---

# Security Considerations

Execution SHALL respect:

- repository permissions
- Adapter capabilities
- execution policies
- workspace restrictions

Execution SHALL NOT exceed granted authority.

---

# Implementation Requirements

Implementations SHALL:

- support deterministic assignment
- support Adapter replacement
- support concurrent execution
- preserve execution traceability
- preserve dependency ordering
- preserve explainability

Implementation details remain outside the scope of this specification.

---

# Implementation Guidance

This specification is implementation independent.

Implementations MAY realize this specification across multiple development iterations.

Partial implementations SHALL preserve all guarantees for the implemented concepts.

Implementation sequencing is governed by the Implementation Plan.

---

# Conformance

A Kernel implementation conforms to RFC-0004 only if it:

- executes approved Mission Plans
- preserves Mission identity
- coordinates work through Execution Roles
- remains adapter agnostic
- preserves deterministic behavior
- preserves execution traceability
- preserves dependency ordering
- supports explainable execution

Failure to satisfy these guarantees constitutes non-conformance with this specification.
