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

## Approved Vertical Slice Immutability

An Approved Vertical Slice establishes the implementation baseline for its covered RFC scope.

After a sprint receives an **Approved** or **Approved with Findings** disposition, its implemented capabilities SHALL be considered frozen.

Subsequent sprints MAY:

- consume approved capabilities;
- extend approved capabilities only when explicitly authorized by the governing RFC and implementation plan;
- correct implementation defects identified through review.

Subsequent sprints SHALL NOT:

- redefine previously approved behavior;
- expand previously approved scope without authorization;
- modify approved implementation solely for architectural preference.

Any intentional modification to an approved vertical slice SHALL be documented in the implementing sprint and reference the affected sprint(s).

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

# Sprint Owner Ratifications

Sprint Owner Ratifications are permanent implementation-governance decisions.

Ratifications formally authorize, clarify, constrain, or amend implementation governance without modifying the Kernel Canon or RFC suite.

Ratifications SHALL NOT redefine architecture.

Ratifications SHALL NOT reinterpret previously ratified governance decisions unless they explicitly supersede or withdraw an earlier ratification.

Every ratification SHALL:

- have a unique identifier;
- record the date of ratification;
- identify the originating Review Finding(s), if applicable;
- clearly state the governance decision;
- define the authorized Builder scope;
- define any implementation restrictions;
- remain permanently traceable.

Ratifications SHALL be recorded in:

`knowledge/governance/RATIFICATION_LEDGER.md`

The Ratification Ledger is the authoritative repository for all Sprint Owner Ratifications.

Ratifications SHALL NOT exist solely in transient implementation artifacts, including:

- builder-task.md
- Work Orders
- Sprint prompts
- chat conversations

Builder and Reviewer workflows MAY reference ratifications, but the Ratification Ledger remains the single source of truth.

If a ratification supersedes or withdraws an earlier ratification, both SHALL remain recorded, and the superseding or withdrawal relationship SHALL be explicitly documented.

The Builder SHALL modify the Ratification Ledger only when explicitly authorized by a Sprint Owner Ratification.

The Reviewer SHALL reference ratifications during certification but SHALL NOT create, amend, or withdraw Sprint Owner Ratifications.

### Ratification Identifier Convention

Sprint Owner Ratifications SHALL use the following identifier format:

`NEXUS-RAT-YYYY-MM-DD-###`

Where:

- `NEXUS-RAT` identifies a Sprint Owner Ratification.
- `YYYY-MM-DD` is the ratification date.
- `###` is a sequential three-digit number assigned for that date.

Ratification identifiers SHALL be:

- globally unique;
- immutable;
- permanently traceable;
- assigned only once;
- never reused, even if a ratification is superseded, withdrawn, or determined to have been issued in error.

If a ratification supersedes an earlier ratification, the superseding ratification SHALL receive a new identifier and SHALL explicitly reference the superseded identifier.

If an identifier collision is discovered, the existing assignment SHALL remain unchanged and the new ratification SHALL receive the next available sequence number unless the Sprint Owner explicitly directs another unused identifier.

The Ratification Ledger SHALL maintain the complete history of all issued ratifications.

# Governance Artifacts

The implementation governance of the Nexus repository is maintained through permanent governance artifacts.

Each governance artifact has a single authoritative purpose and ownership.

The governance artifacts are:

| Artifact                                    | Purpose                                                                                       | Authority               |
| ------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------- |
| IMPLEMENTATION_CONSTITUTION.md              | Defines implementation governance, roles, responsibilities, and governance rules.             | Constitutional          |
| IMPLEMENTATION_PLAN.md                      | Defines the implementation roadmap, sprint sequencing, and current implementation state.      | Implementation Planning |
| IMPLEMENTATION_MANIFEST.md                  | Defines implementation scope, RFC coverage, deferred concepts, and implementation boundaries. | Implementation Planning |
| IMPLEMENTATION_REPORT.md                    | Records Builder implementation outcomes for each completed vertical slice.                    | Builder                 |
| REVIEW_HISTORY.md                           | Records Reviewer findings, certifications, repository state transitions, and review history.  | Reviewer                |
| knowledge/governance/RATIFICATION_LEDGER.md | Records all Sprint Owner Ratifications as the permanent implementation-governance record.     | Sprint Owner            |

Governance artifacts SHALL remain permanently traceable.

Each governance decision SHALL have exactly one authoritative source.

Transient workflow artifacts, including Sprint prompts, Work Orders, and `builder-task.md`, SHALL NOT become the permanent system of record for implementation governance.

Where conflicts exist between governance artifacts, the following precedence SHALL apply:

1. IMPLEMENTATION_CONSTITUTION.md
2. RATIFICATION_LEDGER.md
3. IMPLEMENTATION_PLAN.md
4. IMPLEMENTATION_MANIFEST.md
5. IMPLEMENTATION_REPORT.md
6. REVIEW_HISTORY.md

A lower-precedence artifact SHALL NOT redefine or contradict a higher-precedence governance artifact.
