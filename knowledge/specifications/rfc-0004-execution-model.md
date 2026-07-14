# RFC-0004 — Execution Model

**Status:** Final
**Version:** 1.2
**Authority:** Normative
**Normative Language:** RFC 2119

---

# Amendment History

- v1.0 — Original specification.
- v1.1 — Adds Engineering Role Profile (Sprint Owner Ratification `NEXUS-RAT-2026-07-14-014`). Engineering Role Profile is descriptive/presentational metadata only, one-to-one with Execution Role; Execution Role remains the sole authority for execution semantics, identity, and dispatch eligibility. No other section of this specification is modified.
- v1.2 — Adds Engineering Session (Sprint Owner Ratification `NEXUS-RAT-2026-07-14-017`). Engineering Session is the Kernel-owned runtime boundary for one span of AI-assisted engineering work and MAY contain zero or more Execution Sessions. Execution Session's existing definition, invariants, and immutability are unmodified by this amendment; it becomes one activity record capturable within an Engineering Session's timeline. No other section of this specification is modified.

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

# Engineering Session

An Engineering Session is the Kernel-owned runtime boundary for one span of AI-assisted engineering work.

An Engineering Session MAY contain zero or more Execution Sessions. Each Execution Session remains the authoritative, immutable record of one coordinated execution attempt occurring within that Engineering Session, exactly as defined below; Engineering Session establishes a containment relationship over Execution Sessions and does not redefine, wrap, or duplicate Execution Session's existing semantics.

## Architectural Responsibilities

Engineering Session owns:

- engineering runtime context
- the active engineering workflow
- participating Engineering Roles
- workflow state
- the session timeline
- session diagnostics
- collaboration metadata

Execution Session owns:

- one coordinated execution attempt
- assigned Execution Role
- assigned Adapter
- execution timestamps
- execution outcome
- produced artifacts

Execution semantics, dispatch eligibility, and execution policies remain owned by this specification's Execution, Execution Strategy, Execution Role, Assignment, Assignment Policy, and Execution State sections. Engineering Session SHALL NOT redefine or duplicate those responsibilities, and SHALL NOT itself define Workflow Chaining behavior, Assignment Policy, or Multi-agent Orchestration.

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
