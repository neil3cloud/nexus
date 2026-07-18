> **NOTE**
>
> This document is the normative specification governing the Mission domain of the Nexus Kernel.
>
> It follows the standardized RFC structure agreed for all Nexus specifications:
>
> - Own one bounded capability.
> - Define upstream dependencies.
> - Define downstream guarantees.
> - Never redefine vocabulary owned by another RFC.
>
> This document is intended to be the template for all subsequent RFCs.

# RFC-0001 — Mission Model

**Status:** Final

**Category:** Kernel Specification

**Version:** 1.2

**Authority:** Nexus Kernel Canon

---

# Amendment History

- v1.0 — Original specification.
- v1.1 — Adds Governance-Gated Mission Completion (Sprint Owner Ratification `NEXUS-RAT-2026-07-16-012`). Before a Mission may transition `Reviewing → Completed`, the existing Mission completion preconditions (§ 8 Invariant 7, § 9 Lifecycle, § 10 Operations — unmodified) SHALL first be satisfied; Governance eligibility is then evaluated, additively, against every `GovernanceDecision` (RFC-0011) attributed to that Mission, using RFC-0004's existing Blocking/Non-Blocking classification (v1.11, unmodified): Approved is Non-blocking; Rejected, Deferred, and Escalation Required are uniformly Blocking. When no `GovernanceDecision` is attributed to the Mission, existing Mission completion behavior (Sprint 4) is unchanged. Recovery Requirement override is explicitly **not** part of this amendment: RFC-0004 v1.12's Recovery Requirement attribution key is scoped to (Mission, Engineering Session, Workflow Step, `GovernanceDecision`), and Mission Completion has no authoritative Engineering Session or Workflow Step context to supply that key — this amendment SHALL NOT weaken that attribution matching, infer missing workflow context, or introduce new cross-subsystem plumbing bridging Mission Completion to Engineering Session/Workflow Step. Recovery-aware Mission completion is deferred to its own future RFC amendment. This amendment does not modify RFC-0004, RFC-0011, `GovernanceDecision`, `RecoveryRequirement`, `WorkflowChain`, `WorkflowStep`, or `EngineeringSession`; does not introduce Review-outcome or Knowledge-requirement completion gating, Withdrawn Recovery Requirement eligibility, `MissionPaused` lifecycle semantics, event publication/subscription, or any Host/Adapter surface — each remains explicitly unauthorized pending its own future Sprint Owner scope ratification. No other section of this specification is modified.
- v1.2 — Narrows the definition of "applicable `GovernanceDecision`" in § 15a to exclude a precisely superseded Rejected decision (Sprint Owner Ratification, Milestone 10 closure / Milestone 11 opening cycle). A blocking `GovernanceDecision` may become superseded only through the existing Recovery-Gated Re-Advancement path (RFC-0004, Sprint 60/69), scoped to one exact governed position (Mission, Engineering Session, Workflow Step) via existing `EngineeringDecisionCorrelation` (RFC-0004, Sprint 67) attribution. This amendment does not authorize selecting one globally latest `GovernanceDecision`, does not permit supersession across distinct governed positions, and does not modify RFC-0004, RFC-0011, `GovernanceDecision`, `RecoveryRequirement`, `WorkflowChain`, `WorkflowStep`, `EngineeringSession`, or `EngineeringDecisionCorrelation`. No other section of this specification is modified.

---

# Status of This Memo

This document specifies the normative Mission Model for the Nexus Kernel.

The key words **MUST**, **SHALL**, **SHOULD**, **MAY**, **MUST NOT**, **SHALL NOT**, and **SHOULD NOT** are to be interpreted as described in RFC 2119.

Where implementation behavior conflicts with this specification, this specification SHALL take precedence.

---

# Abstract

The Mission Model defines the transactional boundary of engineering work within the Nexus Kernel.

Every engineering activity coordinated by the Kernel SHALL belong to exactly one Mission.

A Mission owns engineering intent.

Mission Plans own execution.

Tasks own implementation activities.

Mission identity is immutable.

Mission Plans evolve.

Mission execution is deterministic.

This specification defines:

- Mission principles
- Domain ownership
- Transaction semantics
- Domain model
- Lifecycle
- Invariants
- Operations
- Upstream dependencies
- Downstream guarantees
- Events
- Failure semantics
- Security requirements
- Extensibility
- Conformance requirements

---

# 1. Introduction

A Mission represents one engineering objective.

The Mission is the bounded engineering transaction through which software engineering work is planned, executed, reviewed, validated, and completed.

Mission identity SHALL remain immutable.

Mission execution MAY evolve.

Mission objectives SHALL remain stable.

Every engineering artifact SHALL be attributable to exactly one Mission.

---

# 2. Terminology

## Mission

A bounded engineering transaction representing exactly one engineering objective.

## Mission Identity

The immutable identifier of a Mission.

## Mission Objective

The engineering outcome the Mission exists to achieve.

## Mission Plan

A versioned execution blueprint describing how the objective will be achieved.

## Mission Revision

A new version of the Mission Plan.

## Task

A discrete engineering activity belonging to exactly one Mission.

## Task Graph

A directed acyclic graph describing task dependencies.

## Completion

The terminal successful state of a Mission.

---

# 3. Motivation

The Mission Model establishes deterministic engineering boundaries.

It provides:

- traceability
- accountability
- execution scope
- review scope
- completion semantics

Every engineering decision SHALL remain attributable to a Mission.

---

# 4. Scope

This RFC defines:

- Mission
- Mission Plan
- Mission Revision
- Task ownership
- Task Graph
- Mission lifecycle
- Mission completion

This RFC SHALL NOT define:

- Evidence
- Shared Reality
- Adapter behavior
- Review behavior
- Knowledge persistence
- Host integration

---

# 5. Principles

## Principle 1 — One Mission, One Objective

A Mission SHALL represent exactly one engineering objective.

## Principle 2 — Immutable Identity

Mission identity SHALL NEVER change.

## Principle 3 — Stable Intent

Mission objectives SHALL NOT change after Mission creation.

## Principle 4 — Evolving Execution

Mission Plans MAY evolve without changing Mission identity.

## Principle 5 — Atomic Completion

A Mission SHALL complete only when every completion criterion has been satisfied.

## Principle 6 — Permanent History

Mission history SHALL remain permanently auditable.

---

# 6. Domain Ownership

This RFC exclusively owns:

- Mission
- Mission Identity
- Mission Objective
- Mission Plan
- Mission Revision
- Task
- Task Graph
- Mission Lifecycle
- Mission Completion

No other RFC SHALL redefine these concepts.

---

# 7. Domain Model

```text
Mission
│
├── Identity
├── Objective
├── Metadata
├── Status
├── Mission Plan
│      │
│      ├── Revision
│      └── Task Graph
│              └── Task
└── Completion
```

---

# 8. Invariants

A conforming implementation SHALL preserve:

1. One Mission owns one objective.
2. Mission identity is immutable.
3. Mission objectives are immutable.
4. Exactly one active Mission Plan exists.
5. Tasks belong to exactly one Mission.
6. Task Graphs SHALL remain acyclic.
7. Completed Missions SHALL NOT return to execution.
8. Mission is the exclusive engineering transaction boundary.

---

# 9. Lifecycle

```text
Draft
 ↓
Planned
 ↓
Ready
 ↓
Executing
 ↓
Reviewing
 ↓
Completed

Alternative terminal states:

Cancelled
Failed
```

Only the following transitions are valid:

- Draft → Planned
- Planned → Ready
- Ready → Executing
- Executing → Reviewing
- Reviewing → Completed
- Executing → Failed
- Reviewing → Executing
- Any State → Cancelled

---

# 10. Operations

Mission operations include:

- Create Mission
- Create Mission Plan
- Revise Mission Plan
- Add Task
- Remove Pending Task
- Update Task Dependency
- Complete Task
- Evaluate Completion
- Complete Mission
- Cancel Mission
- Fail Mission

Mission identity SHALL NOT change during any operation.

---

# 11. Upstream Dependencies

This RFC has no upstream kernel dependency.

Mission creation originates from engineering intent supplied by the user or host.

---

# 12. Downstream Guarantees

This RFC guarantees:

- Stable Mission identity
- Stable Mission objective
- Deterministic execution boundary
- Versioned Mission Plans
- Deterministic completion semantics

These guarantees are consumed by:

- RFC-0002 — Evidence Model
- RFC-0003 — Shared Reality Projection Model
- RFC-0004 — Execution Model
- RFC-0006 — Engineering Assessment Model
- RFC-0007 — Knowledge Model

---

# 13. Events

Minimum events:

- MissionCreated
- MissionPlanned
- MissionReady
- MissionStarted
- MissionPaused
- MissionResumed
- MissionPlanRevised
- TaskAdded
- TaskCompleted
- TaskRemoved
- MissionReviewed
- MissionCompleted
- MissionCancelled
- MissionFailed

---

# 14. Failure Semantics

Mission failure SHALL preserve:

- Mission identity
- Mission history
- Mission revisions
- Task history

Failure SHALL NOT erase engineering history.

---

# 15. Security & Integrity

Mission identifiers SHALL remain immutable.

Mission revisions SHALL be auditable.

Unauthorized Mission mutation SHALL be rejected.

---

# 16. Extensibility

Implementations MAY extend:

- Mission metadata
- Task metadata
- Planning metadata

Extensions SHALL NOT violate Mission invariants.

---

# 17. Conformance Requirements

A conforming implementation MUST:

- Implement Mission identity
- Implement Mission Plans
- Implement Mission revisions
- Implement Task Graphs
- Preserve Mission invariants
- Enforce lifecycle transitions
- Emit Mission events
- Preserve Mission history
- Honor upstream/downstream contracts

Failure to satisfy any mandatory requirement constitutes non-conformance.

---

# 15a. Governance-Gated Mission Completion (v1.2)

This section defines an additive Mission completion precondition. It does not redefine § 8 Invariant 7, § 9 Lifecycle, or § 10 Operations; the existing `Reviewing → Completed` transition and its existing Task-completion precondition (Sprint 4) SHALL first be satisfied before this section's evaluation begins.

A `GovernanceDecision` (RFC-0011) is **applicable** to a Mission when it is attributed to that Mission and has not been superseded under the Supersession Rule below. Mission completion evaluation SHALL consider every applicable `GovernanceDecision`; it SHALL NOT consider only one arbitrarily selected `GovernanceDecision`.

For each applicable `GovernanceDecision`, Mission Completion eligibility SHALL be determined by the following matrix, using RFC-0004's existing Blocking/Non-Blocking Governance Decision classification (v1.11, unmodified):

| Governance Decision | Mission Completion |
| --- | --- |
| Approved | Non-blocking |
| Rejected | Blocking |
| Deferred | Blocking |
| Escalation Required | Blocking |

Mission Completion SHALL be rejected when any applicable `GovernanceDecision` is Blocking under the matrix above. Every applicable `GovernanceDecision` SHALL independently satisfy the matrix before Mission Completion may proceed.

**Supersession Rule (v1.2).** A blocking `GovernanceDecision` `D1` is superseded by a later `GovernanceDecision` `D2` if, and only if, all of the following hold:

1. `D1` and `D2` are attributed to the same governed position, consisting of the same Mission, the same Engineering Session, and the same Workflow Step, as established by their respective authoritative `EngineeringDecisionCorrelation` (RFC-0004) records.
2. `D1` has outcome `Rejected`.
3. A `RecoveryRequirement` (RFC-0004/RFC-0011) was created from `D1` for that exact governed position.
4. That `RecoveryRequirement` reached `Resolved` through an authoritative accepted recovery outcome.
5. `D2` was produced by a subsequent governance re-evaluation of that same governed position after the `RecoveryRequirement` was resolved.
6. `D2` has outcome `Approved`.
7. `D2` is later than `D1` according to the authoritative governance decision ordering.

Supersession SHALL NOT be inferred from chronological order alone. Supersession SHALL NOT cross Mission, Engineering Session, or Workflow Step boundaries. A `GovernanceDecision` concerning a different governed position remains independently applicable regardless of when it was recorded. Mission completion evaluation SHALL exclude superseded `GovernanceDecision`s from the applicable decision set; every remaining applicable `GovernanceDecision` SHALL independently satisfy the matrix above. This rule SHALL NOT be interpreted as authorizing selection of one globally latest `GovernanceDecision`.

RFC-0004 v1.12's Recovery Requirement attribution key remains scoped to (Mission, Engineering Session, Workflow Step, `GovernanceDecision`) — the full four-part key, unmodified. This section reads `RecoveryRequirement` state only to evaluate the Supersession Rule above; it does not weaken Recovery Requirement attribution matching, does not introduce Mission-level Recovery Requirement projection or aggregation, and does not otherwise generalize Recovery-aware Mission completion beyond the exact Supersession Rule stated above.

When no `GovernanceDecision` is attributed to the Mission, this section does not apply and existing Mission completion behavior (Sprint 4, unmodified) governs unchanged.

This section does not modify `GovernanceDecision`, `GovernanceService`, `RecoveryRequirement`, `RecoveryRequirementService`, `EngineeringDecisionCorrelation`, the Recovery Resolution Contract, or the Recovery Withdrawal Contract (RFC-0004/RFC-0011, unmodified); does not modify `WorkflowChain`, `WorkflowStep`, or `EngineeringSession`; does not introduce Review-outcome or Knowledge-requirement completion gating, Withdrawn Recovery Requirement eligibility, Mission-level Recovery Requirement projection or aggregation, Engineering Session/Workflow Step attribution bridging beyond the exact Supersession Rule above, or any resolution of the `MissionPaused` lifecycle inconsistency (§ 13); and does not introduce event publication/subscription or any Host/Adapter surface. Mission remains the sole owner of Mission Completion; Governance and Recovery input are consumed read-only.

---

# Implementation Guidance

This specification is implementation independent.

Implementations MAY realize this specification across multiple development iterations.

Partial implementations SHALL preserve all guarantees for the implemented concepts.

Implementation sequencing is governed by the Implementation Plan.

---

# 18. References

- RFC 2119
- Nexus Kernel Canon
