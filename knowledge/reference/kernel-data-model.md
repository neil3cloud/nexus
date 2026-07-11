# Nexus Kernel Data Model

**Status:** Reference
**Version:** 1.0
**Authority:** Informative (Derived from the Kernel Canon, RFC Suite, and Domain Schema)

---

# Purpose

This document defines the Canonical Kernel Data Model.

The Kernel Data Model provides the standard data structures that implementations SHALL derive into language-specific models.

Examples include:

- TypeScript interfaces
- C# records
- Rust structs
- Go structs

This document intentionally avoids persistence concerns.

Database schemas, serialization formats, and storage implementations remain outside its scope.

---

# Design Principles

## Stable Identity

Every Aggregate Root and Entity SHALL possess a stable identifier.

Identifiers SHALL NOT change throughout the lifetime of an object.

---

## Revision-Based Evolution

Mutable objects SHALL evolve through revisions.

Identity SHALL remain constant.

Revision SHALL increase monotonically.

---

## Immutable Objects

The following objects SHALL be immutable:

- Evidence
- Domain Event
- Adapter Request
- Adapter Response

Corrections SHALL create new instances.

---

## UTC Time

All timestamps SHALL be stored in UTC.

---

## Language Neutrality

No implementation-specific constructs shall appear in this document.

Examples include:

- TypeScript decorators
- Entity Framework attributes
- SQL constraints
- JSON serialization annotations

---

# Common Types

## Identifier

Represents a globally unique identifier.

```
Identifier
-----------
type: string
required: yes
immutable: yes
```

---

## Revision

Represents the version of a mutable object.

```
Revision
---------
type: integer
minimum: 1
immutable: no
```

---

## Timestamp

Represents a UTC timestamp.

```
Timestamp
----------
type: datetime (UTC)
```

---

## Metadata

Represents implementation-independent metadata.

```
Metadata
---------
key
value
```

---

# Base Entity

All Aggregate Roots and Entities derive from Base Entity.

| Field     | Type       | Required |
| --------- | ---------- | -------- |
| id        | Identifier | Yes      |
| revision  | Revision   | Yes      |
| createdAt | Timestamp  | Yes      |
| updatedAt | Timestamp  | Yes      |

---

# Mission Domain

## Mission

| Field        | Type          |
| ------------ | ------------- |
| id           | Identifier    |
| objective    | String        |
| status       | MissionStatus |
| activePlanId | Identifier    |
| revision     | Revision      |
| createdAt    | Timestamp     |
| updatedAt    | Timestamp     |

---

## Mission Plan

| Field     | Type       |
| --------- | ---------- |
| id        | Identifier |
| missionId | Identifier |
| revision  | Revision   |
| status    | PlanStatus |
| createdAt | Timestamp  |
| updatedAt | Timestamp  |

---

## Task

| Field         | Type         |
| ------------- | ------------ |
| id            | Identifier   |
| planId        | Identifier   |
| title         | String       |
| description   | String       |
| status        | TaskStatus   |
| assignedRole  | RoleType     |
| dependencyIds | Identifier[] |
| artifactIds   | Identifier[] |

---

# Evidence Domain

## Evidence

| Field      | Type           |
| ---------- | -------------- |
| id         | Identifier     |
| type       | EvidenceType   |
| authority  | AuthorityLevel |
| source     | String         |
| hash       | String         |
| uri        | String         |
| capturedAt | Timestamp      |

---

## Evidence Relationship

| Field            | Type                     |
| ---------------- | ------------------------ |
| parentEvidenceId | Identifier               |
| childEvidenceId  | Identifier               |
| relationship     | EvidenceRelationshipType |

---

# Shared Reality Domain

## Shared Reality

| Field             | Type         |
| ----------------- | ------------ |
| id                | Identifier   |
| missionId         | Identifier   |
| projectionVersion | Integer      |
| evidenceIds       | Identifier[] |
| generatedAt       | Timestamp    |

---

## Context Package

| Field           | Type           |
| --------------- | -------------- |
| id              | Identifier     |
| sharedRealityId | Identifier     |
| purpose         | ContextPurpose |
| artifactIds     | Identifier[]   |
| constraintIds   | Identifier[]   |
| generatedAt     | Timestamp      |

---

# Execution Domain

## Execution Strategy

| Field         | Type         |
| ------------- | ------------ |
| id            | Identifier   |
| missionId     | Identifier   |
| strategyType  | StrategyType |
| assignmentIds | Identifier[] |

---

## Execution Role

| Field         | Type         |
| ------------- | ------------ |
| id            | Identifier   |
| name          | String       |
| capabilityIds | Identifier[] |

---

## Assignment

| Field     | Type       |
| --------- | ---------- |
| id        | Identifier |
| taskId    | Identifier |
| roleId    | Identifier |
| adapterId | Identifier |

---

# Event Domain

## Domain Event

| Field         | Type          |
| ------------- | ------------- |
| id            | Identifier    |
| eventType     | EventType     |
| aggregateType | AggregateType |
| aggregateId   | Identifier    |
| causationId   | Identifier    |
| correlationId | Identifier    |
| occurredAt    | Timestamp     |
| payload       | Object        |

---

# Review Domain

## Review

| Field        | Type          |
| ------------ | ------------- |
| id           | Identifier    |
| missionId    | Identifier    |
| reviewerRole | RoleType      |
| outcome      | ReviewOutcome |
| findingIds   | Identifier[]  |
| completedAt  | Timestamp     |

---

## Finding

| Field          | Type          |
| -------------- | ------------- |
| id             | Identifier    |
| reviewId       | Identifier    |
| severity       | Severity      |
| intent         | FindingIntent |
| recommendation | String        |
| evidenceIds    | Identifier[]  |
| status         | FindingStatus |

---

# Knowledge Domain

## Knowledge

| Field               | Type         |
| ------------------- | ------------ |
| id                  | Identifier   |
| missionId           | Identifier   |
| summary             | String       |
| acceptedEvidenceIds | Identifier[] |
| createdAt           | Timestamp    |

---

# Adapter Domain

## Adapter Registration

| Field           | Type          |
| --------------- | ------------- |
| id              | Identifier    |
| name            | String        |
| version         | String        |
| protocolVersion | String        |
| capabilityIds   | Identifier[]  |
| supportedRoles  | RoleType[]    |
| status          | AdapterStatus |

---

## Adapter Request

| Field            | Type         |
| ---------------- | ------------ |
| id               | Identifier   |
| taskId           | Identifier   |
| roleId           | Identifier   |
| contextPackageId | Identifier   |
| constraintIds    | Identifier[] |

---

## Adapter Response

| Field       | Type                  |
| ----------- | --------------------- |
| id          | Identifier            |
| requestId   | Identifier            |
| status      | AdapterResponseStatus |
| artifactIds | Identifier[]          |
| findingIds  | Identifier[]          |
| metrics     | Object                |

---

# Host Domain

## Host Registration

| Field         | Type         |
| ------------- | ------------ |
| id            | Identifier   |
| hostType      | HostType     |
| version       | String       |
| capabilityIds | Identifier[] |
| status        | HostStatus   |

---

# Enumerations

The Kernel SHALL define canonical enumerations for the following:

## Mission

- MissionStatus
- PlanStatus
- TaskStatus

## Evidence

- EvidenceType
- AuthorityLevel
- EvidenceRelationshipType

## Execution

- StrategyType
- RoleType

## Events

- EventType
- AggregateType

## Review

- ReviewOutcome
- Severity
- FindingIntent
- FindingStatus

## Adapter

- AdapterStatus
- AdapterResponseStatus

## Host

- HostStatus
- HostType

---

# Collection Names

Canonical collection names are defined as:

```
missions
missionPlans
tasks
evidence
sharedReality
contextPackages
executionStrategies
assignments
domainEvents
reviews
findings
knowledge
adapters
hosts
```

These names are language-neutral and may be mapped to repositories, tables, or storage collections.

---

# Implementation Mapping

Implementations SHOULD derive their language-specific models directly from this document.

For example:

- TypeScript → interfaces
- C# → records
- Rust → structs
- Go → structs

Implementations SHALL NOT redefine field semantics.

---

# Relationship to Other Documents

The Kernel Data Model is derived from:

1. Kernel Canon
2. RFC Specification Suite
3. Domain Schema

If inconsistencies arise, authority SHALL follow this order:

```
Kernel Canon
        ↓
RFC Specifications
        ↓
Domain Schema
        ↓
Kernel Data Model
        ↓
Implementation
```

This document SHALL evolve only when changes to higher-authority documents require corresponding updates.
