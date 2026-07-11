# Nexus Kernel Capability Contracts

**Status:** Reference
**Version:** 1.0
**Authority:** Informative

---

# Purpose

This document defines the canonical capability contracts of the Nexus Kernel.

Capabilities describe what the Kernel provides.

They do not prescribe implementation.

Implementations MAY realize capabilities using services, modules, actors, components, or other architectural styles.

---

# Capability Principles

Every capability SHALL:

- own one bounded domain
- expose explicit operations
- consume canonical aggregates
- produce canonical aggregates
- raise Domain Events
- remain deterministic

Capabilities SHALL NOT directly manipulate foreign domain state.

Communication SHALL occur through Aggregate Roots and Domain Events.

---

# Mission Capability

**Owns**

RFC-0001

---

## Operations

### Create Mission

Consumes

- Mission Request

Produces

- Mission

Raises

- MissionCreated

---

### Activate Mission Plan

Consumes

- Mission Plan

Produces

- Active Mission Plan

Raises

- MissionPlanActivated

---

### Complete Mission

Consumes

- Review Outcome

Produces

- Completed Mission

Raises

- MissionCompleted

---

# Evidence Capability

**Owns**

RFC-0002

---

## Operations

### Capture Evidence

Consumes

- Artifact

Produces

- Evidence

Raises

- EvidenceCaptured

---

### Accept Evidence

Consumes

- Review Outcome

Produces

- Accepted Evidence

Raises

- EvidenceAccepted

---

# Shared Reality Capability

**Owns**

RFC-0003

---

## Operations

### Generate Shared Reality

Consumes

- Mission
- Evidence

Produces

- Shared Reality

Raises

- SharedRealityGenerated

---

### Create Context Package

Consumes

- Shared Reality

Produces

- Context Package

Raises

- ContextPackageGenerated

---

# Execution Capability

**Owns**

RFC-0004

---

## Operations

### Assign Task

Consumes

- Task
- Execution Strategy

Produces

- Assignment

Raises

- TaskAssigned

---

### Revise Mission Plan

Consumes

- Finding

Produces

- Mission Plan Revision

Raises

- MissionPlanRevised

---

# Event Capability

**Owns**

RFC-0005

---

## Operations

### Publish Event

Consumes

- Domain Event

Produces

- Recorded Event

---

### Subscribe to Event

Consumes

- Event Type

Produces

- Event Stream

---

# Review Capability

**Owns**

RFC-0006

---

## Operations

### Review Task

Consumes

- Task Output

Produces

- Review

Raises

- ReviewCompleted

---

### Create Finding

Consumes

- Review

Produces

- Finding

Raises

- FindingCreated

---

# Knowledge Capability

**Owns**

RFC-0007

---

## Operations

### Capture Knowledge

Consumes

- Accepted Evidence

Produces

- Knowledge

Raises

- KnowledgeAccepted

---

### Publish Knowledge

Consumes

- Knowledge

Produces

- Published Knowledge

Raises

- KnowledgePublished

---

# Adapter Capability

**Owns**

RFC-0008

---

## Operations

### Register Adapter

Consumes

- Adapter Registration

Produces

- Registered Adapter

Raises

- AdapterRegistered

---

### Execute Assignment

Consumes

- Adapter Request

Produces

- Adapter Response

Raises

- TaskCompleted

---

# Host Capability

**Owns**

RFC-0009

---

## Operations

### Register Host

Consumes

- Host Registration

Produces

- Host

Raises

- HostRegistered

---

### Activate Host

Consumes

- Host

Produces

- Active Host

Raises

- HostConnected

---

# Capability Dependencies

```
Mission
      │
      ▼
Evidence
      │
      ▼
Shared Reality
      │
      ▼
Execution
      │
      ▼
Review
      │
      ▼
Knowledge

Adapter
      ▲

Host
```

Capabilities SHALL depend only upon published contracts.

Capabilities SHALL NOT bypass ownership boundaries.

---

# Relationship to Other Documents

Capability Contracts derive from:

1. Kernel Canon
2. RFC Specification Suite
3. Domain Schema
4. Kernel Data Model
5. Kernel State Machine
6. Kernel Event Catalog

Implementations SHALL preserve capability semantics regardless of implementation architecture.
