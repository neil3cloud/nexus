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
2. IMPLEMENTATION_PLAN.md
3. IMPLEMENTATION_MANIFEST.md
4. Relevant Kernel Canon
5. Relevant RFCs
6. Relevant Reference Documents
7. Implementation Technology Standard
8. Implementation Conventions

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

# Architecture and Implementation Independence

Architecture defines WHAT the system SHALL do.

Implementation defines WHEN and HOW architectural concepts are delivered.

Implementation sequencing SHALL NOT redefine architectural intent.

Normative specifications SHALL remain implementation-independent.

Implementation plans SHALL remain architecture-independent.

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

Builder AI SHALL additionally:

- implement only the requested vertical slice;
- avoid speculative implementation of future slices;
- preserve deferred concepts without approximation;
- report implementation gaps rather than filling them with assumptions.

Builder AI SHALL NOT require complete RFC implementation unless explicitly instructed.

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

Reviewer AI SHALL classify every finding in accordance with:

- knowledge/implementation/review-classification.md

Reviewer AI SHALL NOT redesign architecture.

Reviewer AI SHALL NOT introduce new architectural requirements.

---

# Vertical Slice Strategy

Implementation SHALL proceed using vertical slices.

Each slice SHALL represent one coherent capability.

A slice SHALL be completed before another slice begins.

Partial implementation of multiple capabilities SHALL be avoided.

---

# Implementation Roadmap

Implementation sequencing is governed by the Implementation Plan.

The Implementation Plan organizes work into milestones and vertical slices.

Vertical slices SHALL define implementation order.

RFCs SHALL define architectural behavior.

The implementation roadmap SHALL NOT redefine architectural contracts.

Each vertical slice SHALL declare:

- referenced RFCs;
- implemented concepts;
- deferred concepts;
- completion criteria.

Deferred concepts SHALL remain tracked in the Implementation Manifest.

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

# Implementation Manifest

IMPLEMENTATION_MANIFEST.md is the authoritative mapping between architectural specifications and implementation progress.

The manifest SHALL record:

- milestones;
- vertical slices;
- RFC coverage;
- implementation status;
- deferred concepts;
- implementation dependencies.

The Implementation Manifest SHALL NOT redefine architecture.

It SHALL exist solely to describe implementation progress.

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
- implementation requires extending concepts owned by another RFC

Implementers SHALL report the conflict rather than making assumptions.

---

# Vertical Slice Policy

Nexus SHALL be implemented through incremental vertical slices.

Each vertical slice SHALL deliver one complete, testable increment of functionality.

A vertical slice MAY implement only a subset of one or more RFCs.

Partial RFC implementation is an expected implementation state.

Every implemented concept SHALL:

- fully conform to its governing RFC;
- remain within the declared RFC Coverage of the Sprint Specification.

Concepts intentionally omitted from a vertical slice SHALL be explicitly declared as deferred.

Deferred concepts SHALL:

- remain normative;
- be explicitly identified;
- be tracked within the Implementation Manifest.

Implementation sequencing SHALL NOT:

- redefine architectural intent;
- modify normative behavior;
- redefine specification ownership.

Vertical slices SHALL optimize for:

- continuous integration;
- continuous validation;
- deterministic implementation progress.

Completion of a vertical slice SHALL NOT imply completion of the referenced RFC.

Completion of an RFC SHALL be determined by the cumulative implementation of all required concepts across one or more approved vertical slices.

---

# RFC Coverage

Every implementation request SHALL explicitly declare:

- Primary RFCs
- Referenced RFCs
- Implemented Concepts
- Deferred Concepts

Each implemented concept SHALL have exactly one normative specification owner.

The owning RFC exclusively defines:

- terminology;
- semantics;
- invariants;
- lifecycle;
- normative behavior.

Vertical slices SHALL implement only concepts owned by the RFCs declared in the Sprint Specification.

If implementation requires extending or modifying a concept owned by an RFC outside the declared RFC Coverage, implementation SHALL stop and request human ratification.

Builders SHALL NOT introduce undocumented states, events, lifecycles, enumerations, or terminology belonging to another RFC.

RFC Coverage SHALL be maintained in IMPLEMENTATION_MANIFEST.md.

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
- extending terminology owned by another RFC
- extending enumerations owned by another RFC
- modifying another RFC's lifecycle semantics

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

---

# Sprint Specifications

Every implementation sprint SHALL be defined using the standard Sprint Template.

The Sprint Template establishes the minimum required information for implementation requests.

Each sprint SHALL define:

- Sprint identifier
- Sprint objective
- RFC coverage
- Implemented concepts
- Deferred concepts
- Deliverables
- Acceptance criteria
- Out-of-scope items
- Completion requirements

The canonical Sprint Template is located at:

knowledge/implementation/sprint-template.md

Implementation requests that do not conform to the Sprint Template SHOULD be considered incomplete and MAY require clarification before implementation proceeds.
