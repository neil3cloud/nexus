# Nexus Implementation Plan

## Purpose

This document defines the implementation roadmap for Nexus.

Normative behavior is defined by the Kernel Canon and RFCs.

This document defines **how** the specifications are implemented through incremental vertical slices.

RFCs SHALL NOT dictate sprint boundaries.

Each sprint SHALL deliver a working, testable increment while preserving conformance with the published specifications.

---

# Milestone 1 — Foundation

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

Status: Planned

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

Deferred Concepts

- Mission Plan
- Mission Revision
- Task
- Task Graph

Definition of Done

- All Mission tests pass.
- Lifecycle conforms to RFC-0001.
- Domain model validated.
- Reviewer approval received.

---

## Sprint 3 — Mission Planning

Status: Planned

RFC Coverage

RFC-0001

Implemented Concepts

- Mission Plan
- Mission Revision
- Task
- Task Graph

---

## Sprint 4 — Mission Execution

Status: Planned

RFC Coverage

RFC-0004

Implemented Concepts

- Execution Strategy
- Execution Roles
