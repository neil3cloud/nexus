# Nexus Kernel Event Catalog

**Status:** Reference
**Version:** 1.0
**Authority:** Informative (Derived from RFC-0001 through RFC-0009)

---

# Purpose

This document defines the canonical Domain Events of the Nexus Kernel.

Domain Events represent immutable records of meaningful engineering state transitions.

Events coordinate collaboration between Kernel domains while preserving loose coupling.

Events SHALL describe facts that have already occurred.

Events SHALL NOT represent commands or intentions.

---

# Event Principles

## Past Tense

Every Domain Event SHALL be named using past tense.

Examples:

- MissionCreated
- TaskAssigned
- ReviewCompleted

Examples of invalid names:

- CreateMission
- ExecuteTask
- StartReview

---

## Immutability

Events are immutable.

Events SHALL NEVER be modified after publication.

---

## Single Fact

Each Event SHALL represent exactly one engineering fact.

Events SHALL NOT combine multiple unrelated changes.

---

## Domain Ownership

Each Event SHALL belong to exactly one Aggregate Root.

---

## Traceability

Every Event SHALL preserve:

- aggregate identity
- timestamp
- causation
- correlation

---

# Standard Event Envelope

Every Domain Event SHALL contain:

| Field         | Description               |
| ------------- | ------------------------- |
| eventId       | Unique event identifier   |
| eventType     | Canonical event name      |
| aggregateType | Aggregate Root type       |
| aggregateId   | Aggregate Root identifier |
| revision      | Aggregate revision        |
| occurredAt    | UTC timestamp             |
| causationId   | Triggering event          |
| correlationId | Mission correlation       |
| payload       | Event-specific data       |

---

# Mission Events

## MissionCreated

Aggregate

Mission

Producer

Mission Service

Consumers

- Planning Service
- Event Store

Payload

- Mission Identifier
- Objective

---

## MissionPlanningStarted

Producer

Mission Service

Consumers

Execution Strategy

---

## MissionPlanned

Producer

Planning Service

Consumers

Execution Service

---

## MissionExecutionStarted

Producer

Execution Service

Consumers

Task Coordination

---

## MissionPaused

Producer

Mission Service

---

## MissionResumed

Producer

Mission Service

---

## MissionCancelled

Producer

Mission Service

---

## MissionCompleted

Producer

Mission Service

Consumers

Knowledge Service

---

## MissionFailed

Producer

Mission Service

---

# Mission Plan Events

## MissionPlanCreated

Producer

Planning Service

---

## MissionPlanActivated

Producer

Planning Service

---

## MissionPlanRevised

Producer

Execution Strategy

Consumers

Task Coordination

---

## MissionPlanSuperseded

Producer

Planning Service

---

# Task Events

## TaskCreated

Producer

Planning Service

---

## TaskReady

Producer

Task Coordinator

---

## TaskAssigned

Producer

Execution Strategy

Consumers

Adapter

---

## TaskStarted

Producer

Adapter

---

## TaskCompleted

Producer

Adapter

Consumers

Review Service

---

## TaskBlocked

Producer

Execution Strategy

---

## TaskCancelled

Producer

Mission Service

---

# Review Events

## ReviewStarted

Producer

Review Service

---

## ReviewCompleted

Producer

Review Service

---

## ReviewAccepted

Producer

Review Service

Consumers

Mission Service

---

## ReviewRejected

Producer

Review Service

---

# Finding Events

## FindingCreated

Producer

Review Service

---

## FindingAccepted

Producer

Developer

---

## FindingResolved

Producer

Execution Strategy

---

## FindingDismissed

Producer

Developer

---

# Evidence Events

## EvidenceCaptured

Producer

Evidence Service

---

## EvidenceAccepted

Producer

Review Service

---

## EvidenceRejected

Producer

Review Service

---

# Shared Reality Events

## SharedRealityRequested

Producer

Mission Service

---

## SharedRealityGenerated

Producer

Shared Reality Service

---

## SharedRealityObsolete

Producer

Evidence Service

---

# Context Package Events

## ContextPackageGenerated

Producer

Shared Reality Service

---

## ContextPackageConsumed

Producer

Adapter

---

## ContextPackageExpired

Producer

Kernel

---

# Execution Events

## ExecutionStrategyCreated

Producer

Execution Service

---

## AssignmentCreated

Producer

Execution Strategy

---

## AssignmentCompleted

Producer

Execution Strategy

---

# Adapter Events

## AdapterRegistered

Producer

Adapter Registry

---

## AdapterAvailable

Producer

Adapter Registry

---

## AdapterUnavailable

Producer

Adapter Registry

---

## AdapterRetired

Producer

Adapter Registry

---

# Host Events

## HostRegistered

Producer

Host Registry

---

## HostConnected

Producer

Host

---

## HostDisconnected

Producer

Host

---

## HostRetired

Producer

Host Registry

---

# Knowledge Events

## KnowledgeCandidateCreated

Producer

Knowledge Service

---

## KnowledgeAccepted

Producer

Knowledge Service

---

## KnowledgePublished

Producer

Knowledge Service

---

# Event Ordering

Within a single Aggregate Root:

Events SHALL preserve order.

Across Aggregate Roots:

Ordering is not guaranteed.

Consumers SHALL NOT rely on global ordering.

---

# Delivery Guarantees

Kernel implementations SHALL guarantee:

- At-least-once delivery
- Immutable payloads
- Stable event identity
- Observable publication

Consumers SHALL be idempotent.

---

# Correlation

Every event participating in the same Mission SHALL share the same Correlation Identifier.

Correlation SHALL enable complete Mission reconstruction.

---

# Causation

Every derived event SHALL reference the event that caused it.

Example:

```
TaskCompleted
        │
        ▼
ReviewStarted
        │
        ▼
ReviewCompleted
        │
        ▼
MissionCompleted
```

---

# Event Flow

```
MissionCreated
        │
        ▼
MissionPlanned
        │
        ▼
TaskCreated
        │
        ▼
TaskAssigned
        │
        ▼
TaskStarted
        │
        ▼
TaskCompleted
        │
        ▼
ReviewStarted
        │
        ▼
ReviewCompleted
        │
        ▼
FindingCreated
        │
        ▼
MissionPlanRevised
        │
        ▼
TaskCreated
        │
        ▼
...
        │
        ▼
MissionCompleted
        │
        ▼
KnowledgeAccepted
        │
        ▼
KnowledgePublished
```

---

# Event Naming Rules

Domain Events SHALL:

- use PascalCase
- use past tense
- describe completed facts
- avoid implementation terminology
- remain stable across versions

---

# Versioning

Event payloads MAY evolve through additive changes.

Existing fields SHALL NOT change meaning.

Breaking changes SHALL require a new Event Version.

---

# Relationship to Other Documents

This document derives its authority from:

1. Kernel Canon
2. RFC Specification Suite
3. Domain Schema
4. Kernel Data Model
5. Kernel State Machine

Event definitions SHALL remain consistent with the owning RFC.

No implementation SHALL redefine the meaning of a canonical Domain Event.
