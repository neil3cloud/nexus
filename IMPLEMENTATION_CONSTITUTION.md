# Nexus Implementation Constitution

**Status:** Constitutional
**Version:** 1.0
**Authority:** Supreme Implementation Authority
**Normative Language:** RFC 2119

---

# Purpose

The Nexus Implementation Constitution governs every implementation produced within this repository.

Its purpose is to ensure that every implementation remains faithful to the architectural intent established by the Nexus Kernel Canon and the RFC specification suite.

The Constitution defines how implementation SHALL occur.

It does not redefine architecture.

Architecture remains governed by the Kernel Canon and the RFCs.

Where conflicts exist between implementation and architecture, architecture SHALL prevail.

---

# Scope

This Constitution applies to:

- AI-assisted implementation
- Human implementation
- Refactoring
- Code generation
- Testing
- Documentation updates
- Repository maintenance

Every implementation SHALL comply with this Constitution.

---

# Implementation Authority

Implementation authority SHALL follow this order.

1. Kernel Canon
2. RFC Specification Suite
3. Implementation Constitution
4. Implementation Technology Standard
5. Implementation Conventions
6. Reference Documents
7. Implementation

Lower authority SHALL NOT contradict higher authority.

---

# Reading Order

Before producing implementation, every implementer SHALL read, in order:

1. IMPLEMENTATION_CONSTITUTION.md
2. Relevant RFCs
3. Relevant Reference Documents
4. Implementation Technology Standard
5. Implementation Conventions

Implementers SHALL NOT begin implementation before understanding the governing documents.

---

# Implementation Philosophy

Implementation exists to realize architecture.

Implementation SHALL NOT redefine architecture.

Documentation is authoritative.

Code is an implementation of documentation.

When implementation reveals an architectural inconsistency, the inconsistency SHALL be reported.

Implementation SHALL NOT silently compensate for architectural ambiguity.

---

# Architectural Fidelity

Implementations SHALL preserve:

- architectural terminology
- aggregate ownership
- capability boundaries
- event semantics
- state transitions
- domain ownership
- contract boundaries

Implementations SHALL NOT introduce new architectural concepts without an approved Architectural Decision Record.

---

# Domain Ownership

Implementations SHALL preserve aggregate ownership.

Aggregate ownership SHALL NOT be bypassed for convenience.

Cross-domain interaction SHALL occur only through:

- Aggregate Roots
- Domain Events
- Published Contracts

Implementations SHALL NOT access internal entities owned by foreign aggregates.

---

# Deterministic Implementation

Equivalent inputs SHALL produce equivalent behavior.

Implementations SHALL avoid hidden behavior.

Behavior SHALL remain explicit.

Side effects SHALL be observable.

---

# AI Implementation Rules

Builder AI SHALL:

- implement architecture
- preserve contracts
- preserve terminology
- generate tests
- report assumptions
- stop when ambiguity exists

Builder AI SHALL NOT:

- invent architecture
- redefine RFC terminology
- infer undocumented behavior
- bypass architectural constraints
- introduce speculative abstractions

---

# Reviewer AI

Reviewer AI exists to validate compliance.

Reviewer AI SHALL evaluate implementations against:

- Kernel Canon
- RFCs
- Reference Documents
- Implementation Constitution

Reviewer AI SHALL report only:

- architectural violations
- contract violations
- domain ownership violations
- state machine violations
- event contract violations
- terminology inconsistencies

Reviewer AI SHALL NOT redesign architecture.

Reviewer AI SHALL NOT introduce new architectural requirements.

---

# Vertical Slice Strategy

Implementation SHALL proceed using vertical slices.

Each slice SHALL represent one coherent capability.

A slice SHALL be completed before another slice begins.

Partial implementation of multiple capabilities SHALL be avoided.

---

# Capability Order

Unless otherwise directed, implementation SHALL proceed in the following order.

1. Mission
2. Evidence
3. Shared Reality
4. Execution
5. Review
6. Knowledge
7. Adapter
8. Host
9. User Interface

Higher-level capabilities SHALL NOT be implemented before their dependencies exist.

---

# Documentation Before Code

When required documentation is absent or inconsistent:

Implementation SHALL stop.

Missing documentation SHALL be reported.

Implementation SHALL NOT guess architectural behavior.

---

# Required Deliverables

Every completed implementation SHALL include:

- implementation
- unit tests
- integration tests where applicable
- documentation updates when required
- implementation report

No implementation is complete without tests.

---

# Implementation Report

Every implementation SHALL include a report describing:

- implemented capability
- referenced RFCs
- referenced reference documents
- assumptions
- limitations
- architectural deviations

If no deviations exist, the report SHALL explicitly state:

"No architectural deviations."

---

# Testing

Every implementation SHALL be testable.

Tests SHALL validate:

- aggregate behavior
- contract compliance
- state transitions
- event publication
- invariants

Testing SHALL be considered part of implementation.

---

# Refactoring

Refactoring SHALL preserve observable behavior.

Refactoring SHALL NOT redefine architectural intent.

Refactoring SHALL preserve:

- contracts
- events
- state machines
- aggregate ownership

Architectural refactoring SHALL require an approved ADR.

---

# Stop Conditions

Implementation SHALL stop immediately when any of the following occurs:

- conflicting RFC requirements
- missing architectural definition
- undefined domain concept
- undefined event
- undefined state transition
- undefined aggregate ownership
- contradictory documentation

Implementers SHALL report the conflict rather than making assumptions.

---

# Definition of Done

Implementation SHALL be considered complete only when:

- relevant RFC requirements are satisfied
- aggregate ownership is preserved
- state machines are respected
- event contracts are respected
- capability contracts are respected
- tests pass
- documentation is updated where necessary
- implementation report is complete
- reviewer validation succeeds

---

# AI Collaboration Model

Implementation SHALL follow the following workflow.

```
Developer

↓

Builder AI

↓

Implementation

↓

Reviewer AI

↓

Developer Approval

↓

Merge
```

Builder AI and Reviewer AI SHALL remain independent.

Reviewer AI SHALL evaluate the produced implementation rather than participate in implementation.

---

# Architectural Violations

The following constitute architectural violations.

- introducing undocumented behavior
- redefining aggregate ownership
- bypassing capability boundaries
- introducing undocumented state transitions
- introducing undocumented events
- renaming architectural concepts
- violating implementation authority

Architectural violations SHALL be corrected before implementation proceeds.

---

# Continuous Compliance

Every implementation SHALL strengthen the repository.

Implementation SHALL increase:

- maintainability
- determinism
- readability
- testability
- architectural consistency

Implementation SHALL NOT increase accidental complexity.

---

# Constitutional Amendments

This Constitution is intended to remain stable.

Amendments SHALL occur only when implementation experience demonstrates that the existing Constitution is insufficient to preserve architectural integrity.

Personal preference SHALL NOT justify constitutional amendments.

The burden of proof for modifying this Constitution SHALL be intentionally high.
