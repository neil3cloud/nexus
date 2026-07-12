# Nexus Domain Schema

**Status:** Reference
**Version:** 1.0
**Authority:** Informative (Derived from the Kernel Canon and RFC Suite)

---

# Purpose

This document defines the canonical domain model of the Nexus Kernel.

The Domain Schema provides a language-neutral representation of the Kernel's architectural domains.

It exists to:

- identify aggregate boundaries
- define ownership relationships
- establish canonical terminology
- support implementation in any programming language

This document does **not** define behavior.

Behavior is exclusively owned by the Kernel Canon and the RFC specification suite.

Where conflicts exist, the RFCs SHALL prevail.

---

# Domain Hierarchy

```
Kernel
│
├── Mission Domain
├── Evidence Domain
├── Shared Reality Domain
├── Execution Domain
├── Event Domain
├── Review Domain
├── Knowledge Domain
├── Adapter Domain
└── Host Domain
```

Each domain owns its vocabulary.

No domain may redefine concepts owned by another domain.

---

# Common Domain Types

## Aggregate Root

An Aggregate Root defines the consistency boundary of a domain.

Only Aggregate Roots may be referenced across domain boundaries.

---

## Entity

Entities possess stable identity.

Entities may evolve over time while preserving identity.

---

## Value Object

Value Objects possess no identity.

Equality is determined solely by value.

---

# Mission Domain

**Owned By**

RFC-0001 — Mission Model

---

## Aggregate Root

### Mission

Represents a single engineering objective.

Owns:

- Mission Plan
- Mission Lifecycle
- Mission Revision

Referenced by:

- Evidence
- Review
- Knowledge
- Events

---

## Entity

### Mission Plan

Represents the executable plan for a Mission.

A Mission may own multiple revisions of its Mission Plan.

Only one Mission Plan revision may be active.

Owns:

- Tasks

---

### Task

Represents an executable unit of engineering work.

Tasks belong exclusively to one Mission Plan.

Tasks may declare dependencies on other Tasks.

Tasks are assigned through the Execution Domain.

---

# Evidence Domain

**Owned By**

RFC-0002 — Evidence Model

---

## Aggregate Root

### Evidence

Represents an authoritative engineering fact.

Evidence is immutable.

Corrections produce new Evidence.

---

## Entity

### Evidence Relationship

Represents semantic relationships between Evidence.

Examples include:

- derives-from
- supports
- supersedes
- references
- duplicates

---

# Shared Reality Domain

**Owned By**

RFC-0003 — Shared Reality Projection Model

---

## Aggregate Root

### Shared Reality

Represents the computed engineering understanding of a Mission.

Shared Reality is derived from Evidence.

Shared Reality is not authoritative.

Evidence remains authoritative.

---

## Entity

### Context Package

Represents a mission-specific projection of Shared Reality.

Context Packages are produced by the Kernel.

Context Packages are consumed by Adapters.

---

# Execution Domain

**Owned By**

RFC-0004 — Execution Model

---

## Aggregate Root

### Execution Strategy

Represents how engineering work is coordinated.

Execution Strategy assigns Roles to Adapters.

---

## Entity

### Execution Role

Represents an engineering responsibility.

Examples include:

- Builder
- Reviewer
- Documentation Reviewer
- Security Reviewer
- Performance Reviewer

Roles remain independent of implementations.

---

### Assignment

Represents the assignment of:

- Role
- Adapter
- Task

Assignment is independently owned (approved Sprint 8 `RoleAssignment` baseline; see NEXUS-RAT-2026-07-12-007). Execution Strategy coordinates and references Assignment records; it does not exclusively own them as nested entities.

---

# Event Domain

**Owned By**

RFC-0005 — Domain Event Model

---

## Aggregate Root

### Domain Event

Represents a recorded engineering event.

Events are immutable.

Events preserve causality.

Events coordinate Kernel behavior.

---

# Review Domain

**Owned By**

RFC-0006 — Engineering Assessment Model

Canonical implementation-layer vocabulary ratified by NEXUS-RAT-2026-07-12-006. RFC-0006 owns the underlying semantics under its literal terms (Engineering Assessment, Assessment Session, Assessment Outcome, Finding Intent); this document uses the ratified "Review"-prefixed naming.

---

## Aggregate Root

### Review

Represents the engineering assessment of completed work.

A Review belongs to exactly one Mission.

---

## Entity

### Finding

Represents an engineering observation.

Findings may be:

- informational
- actionable

Actionable Findings may trigger Mission Evolution.

---

## Value Object

### Review Outcome

Represents the result of a Review.

Possible outcomes include:

- Accepted
- Accepted With Observations
- Action Required
- Rejected

---

# Knowledge Domain

**Owned By**

RFC-0007 — Knowledge Model

---

## Aggregate Root

### Knowledge

Represents accepted engineering understanding.

Knowledge is derived exclusively from accepted engineering outcomes.

Knowledge references accepted Evidence.

Knowledge never references rejected work.

---

# Adapter Domain

**Owned By**

RFC-0008 — Kernel Adapter Contract

---

## Aggregate Root

### Adapter Registration

Represents an Adapter available to the Kernel.

---

## Entity

### Adapter Request

Represents delegated engineering work.

Produced by:

- Execution Strategy

Consumed by:

- Adapter

---

### Adapter Response

Represents the result returned by an Adapter.

Responses are candidates for Evidence.

Responses are not authoritative until accepted.

---

# Host Domain

**Owned By**

RFC-0009 — Host Contract

---

## Aggregate Root

### Host Registration

Represents a host environment capable of executing the Kernel.

Examples include:

- Visual Studio Code
- Cursor
- Windsurf

---

# Aggregate Relationships

```
Mission
│
└── Mission Plan
        │
        └── Task
                │
                ├── Assignment
                │       │
                │       └── Execution Strategy
                │
                └── Review
                        │
                        └── Finding

Evidence
      │
      └── Shared Reality
              │
              └── Context Package
                      │
                      └── Adapter Request
                              │
                              └── Adapter Response

Knowledge
      ▲
      │
Accepted Evidence
```

---

# Cross-Domain References

| Source Domain  | May Reference                  |
| -------------- | ------------------------------ |
| Mission        | —                              |
| Evidence       | Mission                        |
| Shared Reality | Mission, Evidence              |
| Execution      | Mission, Task, Context Package |
| Event          | Any Aggregate Root             |
| Review         | Mission, Task, Evidence        |
| Knowledge      | Mission, Evidence, Review      |
| Adapter        | Task, Context Package          |
| Host           | Adapter                        |

Domains SHALL reference Aggregate Roots only.

Domains SHALL NOT reference foreign internal Entities.

---

# Cardinality

| Relationship                       | Cardinality  |
| ---------------------------------- | ------------ |
| Mission → Mission Plan             | One-to-Many  |
| Mission Plan → Task                | One-to-Many  |
| Task → Assignment                  | One-to-Many  |
| Execution Strategy → Assignment    | One-to-Many  |
| Review → Finding                   | One-to-Many  |
| Shared Reality → Context Package   | One-to-Many  |
| Adapter Request → Adapter Response | One-to-One   |
| Knowledge → Evidence               | Many-to-Many |

---

# Architectural Rules

The following rules apply throughout the Kernel.

## Aggregate Ownership

Every Entity SHALL belong to exactly one Aggregate Root.

Entities SHALL NOT exist independently.

---

## Cross-Domain Communication

Domains SHALL communicate through Aggregate Roots.

Internal Entities SHALL remain encapsulated.

---

## Immutability

The following Aggregate Roots are immutable:

- Evidence
- Domain Event

Corrections SHALL produce new instances.

---

## Derived Objects

The following objects are projections:

- Shared Reality
- Context Package

They SHALL be regenerated from authoritative sources.

They SHALL NOT become engineering truth.

---

## Authority

This document is derived from the Kernel Canon and RFC specification suite.

It exists to provide a canonical implementation reference.

Behavior SHALL be defined exclusively by the normative RFCs.

This document SHALL evolve only when the normative specifications change.
