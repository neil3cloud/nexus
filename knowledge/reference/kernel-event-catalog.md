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

- event identity
- timestamp
- causality
- correlation
- attribution

---

# Standard Event Envelope

Every Domain Event SHALL contain the RFC-0005 envelope:

| Field         | Description                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| eventId       | Globally unique immutable event identifier                                  |
| missionId     | Mission identifier for the Mission event stream                             |
| eventType     | Canonical event name                                                        |
| timestamp     | Immutable UTC timestamp at which the represented fact became true           |
| causality     | Explicit references to one or more preceding events when causality exists   |
| correlationId | Optional correlation group for reconstructing related engineering workflows |
| attribution   | Immutable event origin attribution                                          |
| payload       | Event-specific data                                                         |

Attribution SHALL identify:

- Mission
- Mission Plan Revision
- Task, when applicable
- Execution Session, when applicable
- Engineering Role
- Adapter, when applicable

---

# Reconciliation Notes

The Standard Event Envelope is governed by RFC-0005. Earlier aggregate-oriented envelope fields have been superseded by the RFC-0005 event identity, Mission stream, causality, correlation, attribution, and payload model.

The reference corpus contains existing "Projection Service" naming in service catalog and dependency reference documents. The Domain Schema identifies the owning domain as Shared Reality, while RFC-0003 is titled "Shared Reality Projection Model" and several reference documents still use "Projection Service." This naming conflict is not mechanically reconciled in this catalog and requires human ratification before broad reference-document renaming.

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

## MissionPlanned

Aggregate

Mission

Producer

Mission Service

Consumers

- Execution Service
- Event Store

Payload

- Mission Identifier

---

## MissionReady

Aggregate

Mission

Producer

Mission Service

Consumers

- Execution Service
- Event Store

Payload

- Mission Identifier

---

## MissionStarted

Aggregate

Mission

Producer

Mission Service

Consumers

- Event Store

Payload

- Mission Identifier

---

## MissionPaused

Aggregate

Mission

Producer

Mission Service

Consumers

- Event Store

Payload

- Mission Identifier

---

## MissionResumed

Aggregate

Mission

Producer

Mission Service

Consumers

- Execution Service
- Event Store

Payload

- Mission Identifier

---

## MissionReviewed

Aggregate

Mission

Producer

Mission Service

Consumers

- Event Store

Payload

- Mission Identifier

---

## MissionCompleted

Aggregate

Mission

Producer

Mission Service

Consumers

- Knowledge Service
- Event Store

Payload

- Mission Identifier

---

## MissionCancelled

Aggregate

Mission

Producer

Mission Service

Consumers

- Event Store

Payload

- Mission Identifier

---

## MissionFailed

Aggregate

Mission

Producer

Mission Service

Consumers

- Event Store

Payload

- Mission Identifier

---

# Mission Plan Events

## MissionPlanCreated

Producer

MissionPlanningService

---

## MissionPlanActivated

Deferred

No implemented operation exists.

---

## MissionPlanRevised

Producer

MissionPlanningService

Consumers

Task Coordination

---

# Task Events

## TaskCreated

Producer

MissionPlanningService

---

## TaskRemoved

Deferred

Unpublished; producer attribution pending future ratification.

---

## TaskReady

Deferred Producer

Task Coordinator

---

## TaskAssigned

Deferred Producer

Execution Strategy

Consumers

Adapter

---

## TaskStarted

Producer

MissionExecutionService

---

## TaskCompleted

Producer

MissionExecutionService

Consumers

Review Service

---

## TaskBlocked

Deferred Producer

Execution Strategy

---

## TaskCancelled

Producer

MissionExecutionService

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

## RecoveryRequirementCreated

Producer

RecoveryRequirementGovernanceDecisionConsumer

Payload

- Recovery Requirement Identifier
- Engineering Session Identifier
- Workflow Step Identifier
- Governance Decision Identifier

---

## RecoveryRequirementResolved

Producer

RecoveryRequirementService

Payload

- Recovery Requirement Identifier
- Governance Decision Identifier
- Accepted Outcome Reference

---

## RecoveryRequirementWithdrawn

Producer

RecoveryRequirementService

Payload

- Recovery Requirement Identifier
- Governance Decision Identifier
- Authoritative Decision Reference

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

## KnowledgeSuperseded

Producer

Knowledge Service

---

## KnowledgeRevisionCreated

Producer

Knowledge Service

---

## KnowledgeArchived

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
